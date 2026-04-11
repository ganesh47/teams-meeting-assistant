import { randomUUID } from 'node:crypto';

import { SessionLogger } from './logger.js';
import { TranscriptStore } from '../storage/transcriptStore.js';
import { BrowserTeamsJoinController, JoinFlowSnapshot } from '../teams/teamsJoinFlow.js';
import { createMeetingTarget } from '../teams/joinUrl.js';
import { AudioCaptureOptions, JoinFlowOptions, MeetingSession, MeetingTarget } from '../types/index.js';

export class SessionOrchestrator {
  private readonly transcriptStore = new TranscriptStore();

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

  async bootstrap(joinUrl: string, runtimeOptions: JoinFlowOptions = {}): Promise<{ session: MeetingSession; snapshot: JoinFlowSnapshot; logger: SessionLogger }> {
    const target = createMeetingTarget(joinUrl, 'personal');
    const session = this.createSession(target, runtimeOptions);
    const logger = new SessionLogger(session.artifacts.logFile);
    const joinController = new BrowserTeamsJoinController(runtimeOptions, logger);

    await this.transcriptStore.initialize(session);
    await logger.log('session.initialized', { sessionId: session.id, joinUrl: target.joinUrl });

    let snapshot = await joinController.launch(target);

    if (runtimeOptions.autoJoin) {
      await logger.log('session.auto_join_requested');
      snapshot = await joinController.join();
    }

    return { session, snapshot, logger };
  }

  async createOfflineSession(runtimeOptions: JoinFlowOptions = {}): Promise<{ session: MeetingSession; logger: SessionLogger }> {
    const target = createMeetingTarget('https://teams.microsoft.com/l/meetup-join/offline-prototype', 'personal');
    const session = this.createSession(target, runtimeOptions);
    const logger = new SessionLogger(session.artifacts.logFile);
    await this.transcriptStore.initialize(session);
    await logger.log('session.offline_initialized', { sessionId: session.id });
    return { session, logger };
  }
}
