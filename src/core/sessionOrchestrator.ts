import { randomUUID } from 'node:crypto';

import { LocalAudioCaptureController } from '../audio/audioCapture.js';
import { TranscriptStore } from '../storage/transcriptStore.js';
import { BrowserTeamsJoinController } from '../teams/teamsJoinFlow.js';
import { MeetingSession, MeetingTarget } from '../types/index.js';
import { PlaceholderWhisperBackend } from '../transcription/whisperPipeline.js';

export class SessionOrchestrator {
  private readonly joinController = new BrowserTeamsJoinController();
  private readonly audioCapture = new LocalAudioCaptureController();
  private readonly transcriptStore = new TranscriptStore();
  private readonly transcriptionBackend = new PlaceholderWhisperBackend();

  createSession(target: MeetingTarget): MeetingSession {
    const id = randomUUID();
    const now = new Date().toISOString();
    return {
      id,
      target,
      state: 'idle',
      startedAt: now,
      updatedAt: now,
      artifacts: TranscriptStore.buildArtifactPaths('artifacts', id),
    };
  }

  async bootstrap(target: MeetingTarget): Promise<MeetingSession> {
    const session = this.createSession(target);
    await this.transcriptStore.initialize(session);
    await this.joinController.launch(target);
    await this.audioCapture.start(session.id);
    void this.transcriptionBackend;
    return session;
  }
}
