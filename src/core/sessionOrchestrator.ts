import { randomUUID } from 'node:crypto';

import { LocalAudioCaptureController } from '../audio/audioCapture.js';
import { SessionLogger } from './logger.js';
import { TranscriptStore } from '../storage/transcriptStore.js';
import { BrowserTeamsJoinController, JoinFlowSnapshot } from '../teams/teamsJoinFlow.js';
import { createMeetingTarget } from '../teams/joinUrl.js';
import { MeetingSession, JoinFlowOptions, MeetingTarget } from '../types/index.js';
import { PlaceholderWhisperBackend } from '../transcription/whisperPipeline.js';

export class SessionOrchestrator {
  private readonly transcriptStore = new TranscriptStore();
  private readonly transcriptionBackend = new PlaceholderWhisperBackend();

  createSession(target: MeetingTarget, runtimeOptions: JoinFlowOptions = {}): MeetingSession {
    const id = randomUUID();
    const now = new Date().toISOString();
    return {
      id,
      target,
      state: 'idle',
      startedAt: now,
      updatedAt: now,
      artifacts: TranscriptStore.buildArtifactPaths('artifacts', id),
      runtime: {
        headless: runtimeOptions.headless ?? true,
        profileDir: runtimeOptions.profileDir ?? '.profiles/teams-personal',
        displayName: runtimeOptions.displayName ?? 'Meeting Assistant',
      },
    };
  }

  async bootstrap(joinUrl: string, runtimeOptions: JoinFlowOptions = {}): Promise<{ session: MeetingSession; snapshot: JoinFlowSnapshot }> {
    const target = createMeetingTarget(joinUrl, 'personal');
    const session = this.createSession(target, runtimeOptions);
    const logger = new SessionLogger(session.artifacts.logFile);
    const joinController = new BrowserTeamsJoinController(runtimeOptions, logger);
    const audioCapture = new LocalAudioCaptureController();

    await this.transcriptStore.initialize(session);
    await logger.log('session.initialized', { sessionId: session.id, joinUrl: target.joinUrl });

    const snapshot = await joinController.launch(target);

    if (runtimeOptions.autoJoin) {
      await logger.log('session.auto_join_requested');
      await joinController.join();
    }

    await audioCapture.start(session.id);
    void this.transcriptionBackend;

    return { session, snapshot };
  }
}
