export type AudioCaptureMode = 'browser_tab' | 'system_loopback' | 'unknown';

export interface AudioChunk {
  sessionId: string;
  sequence: number;
  startedAtMs: number;
  endedAtMs: number;
  sampleRateHz: number;
  channels: number;
  payload: Buffer;
}

export interface AudioCaptureHealth {
  mode: AudioCaptureMode;
  healthy: boolean;
  detail: string;
}

export interface AudioCaptureOptions {
  mode?: AudioCaptureMode;
  fixturePath?: string;
  sampleRateHz?: number;
  channels?: number;
  chunkDurationMs?: number;
}
