import { randomUUID } from 'node:crypto';

import { LocalAudioCaptureController } from '../audio/audioCapture.js';
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
    const joinController = new BrowserTeamsJoinController(runtimeOptions);
    const audioCapture = new LocalAudioCaptureController();

    await this.transcriptStore.initialize(session);
    const snapshot = await joinController.launch(target);
    await audioCapture.start(session.id);
    void this.transcriptionBackend;

    return { session, snapshot };
  }
}
