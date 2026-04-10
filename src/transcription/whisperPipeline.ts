import { AudioChunk, TranscriptSegment } from '../types/index.js';

export interface TranscriptionBackend {
  readonly name: string;
  transcribe(chunk: AudioChunk): Promise<TranscriptSegment[]>;
}

export class PlaceholderWhisperBackend implements TranscriptionBackend {
  readonly name = 'placeholder-whisper-backend';

  async transcribe(chunk: AudioChunk): Promise<TranscriptSegment[]> {
    return [
      {
        sessionId: chunk.sessionId,
        sequence: chunk.sequence,
        kind: 'partial',
        text: '',
        startedAtMs: chunk.startedAtMs,
        endedAtMs: chunk.endedAtMs,
        createdAt: new Date().toISOString(),
        backend: this.name,
      },
    ];
  }
}
