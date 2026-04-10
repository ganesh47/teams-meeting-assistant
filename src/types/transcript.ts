export interface TranscriptSegment {
  sessionId: string;
  sequence: number;
  kind: 'partial' | 'final';
  text: string;
  startedAtMs: number;
  endedAtMs: number;
  createdAt: string;
  speakerHint?: string;
  confidence?: number;
  backend: string;
}
