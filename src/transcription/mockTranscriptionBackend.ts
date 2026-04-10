import { AudioChunk, TranscriptSegment } from '../types/index.js';
import { TranscriptionBackend } from './whisperPipeline.js';

export class MockTranscriptionBackend implements TranscriptionBackend {
  readonly name = 'mock-transcription-backend';

  async transcribe(chunk: AudioChunk): Promise<TranscriptSegment[]> {
    return [
      {
        sessionId: chunk.sessionId,
        sequence: chunk.sequence,
        kind: 'final',
        text: `mock transcript chunk ${chunk.sequence}`,
        startedAtMs: chunk.startedAtMs,
        endedAtMs: chunk.endedAtMs,
        createdAt: new Date().toISOString(),
        backend: this.name,
      },
    ];
  }
}
