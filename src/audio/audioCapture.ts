import { readFile } from 'node:fs/promises';

import { AudioCaptureHealth, AudioCaptureMode, AudioChunk } from '../types/index.js';

export interface AudioCaptureController {
  start(sessionId: string): Promise<AudioCaptureHealth>;
  stop(): Promise<void>;
  readChunk(): Promise<AudioChunk | null>;
}

export interface AudioCaptureOptions {
  mode?: AudioCaptureMode;
  fixturePath?: string;
  sampleRateHz?: number;
  channels?: number;
  chunkDurationMs?: number;
}

export class LocalAudioCaptureController implements AudioCaptureController {
  private sessionId?: string;
  private fixtureBuffer?: Buffer;
  private offset = 0;

  constructor(private readonly options: AudioCaptureOptions = {}) {}

  async start(sessionId: string): Promise<AudioCaptureHealth> {
    this.sessionId = sessionId;
    this.offset = 0;

    if (this.options.fixturePath) {
      this.fixtureBuffer = await readFile(this.options.fixturePath);
      return {
        mode: this.options.mode ?? 'system_loopback',
        healthy: true,
        detail: `Audio fixture loaded from ${this.options.fixturePath}`,
      };
    }

    return {
      mode: this.options.mode ?? 'unknown',
      healthy: false,
      detail: 'Live audio capture is not implemented yet. Use fixture-based capture for local pipeline validation.',
    };
  }

  async stop(): Promise<void> {
    this.offset = 0;
    this.fixtureBuffer = undefined;
    this.sessionId = undefined;
  }

  async readChunk(): Promise<AudioChunk | null> {
    if (!this.fixtureBuffer || !this.sessionId) {
      return null;
    }

    const sampleRateHz = this.options.sampleRateHz ?? 16000;
    const channels = this.options.channels ?? 1;
    const chunkDurationMs = this.options.chunkDurationMs ?? 1000;
    const bytesPerSample = 2;
    const bytesPerSecond = sampleRateHz * channels * bytesPerSample;
    const chunkSize = Math.max(1, Math.floor((bytesPerSecond * chunkDurationMs) / 1000));

    if (this.offset >= this.fixtureBuffer.length) {
      return null;
    }

    const start = this.offset;
    const end = Math.min(this.fixtureBuffer.length, start + chunkSize);
    const sequence = Math.floor(start / chunkSize);
    this.offset = end;

    return {
      sessionId: this.sessionId,
      sequence,
      startedAtMs: sequence * chunkDurationMs,
      endedAtMs: sequence * chunkDurationMs + chunkDurationMs,
      sampleRateHz,
      channels,
      payload: this.fixtureBuffer.subarray(start, end),
    };
  }
}
