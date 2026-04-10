import { spawn } from 'node:child_process';

import { AudioCaptureController } from './audioCapture.js';
import { AudioCaptureHealth, AudioChunk, AudioCaptureOptions } from '../types/index.js';

export class LinuxSoxAudioCaptureController implements AudioCaptureController {
  private sessionId?: string;
  private process?: ReturnType<typeof spawn>;
  private buffer = Buffer.alloc(0);
  private sequence = 0;

  constructor(private readonly options: AudioCaptureOptions = {}) {}

  async start(sessionId: string): Promise<AudioCaptureHealth> {
    this.sessionId = sessionId;
    const sampleRateHz = this.options.sampleRateHz ?? 16000;
    const channels = this.options.channels ?? 1;
    const device = process.env.TEAMS_AUDIO_DEVICE || 'default';

    this.process = spawn('sox', [
      '-q',
      '-t', 'pulseaudio', device,
      '-r', String(sampleRateHz),
      '-c', String(channels),
      '-b', '16',
      '-e', 'signed-integer',
      '-t', 'raw', '-'
    ], { stdio: ['ignore', 'pipe', 'pipe'] });

    this.process.stdout?.on('data', (chunk: Buffer) => {
      this.buffer = Buffer.concat([this.buffer, chunk]);
    });

    return {
      mode: this.options.mode ?? 'system_loopback',
      healthy: true,
      detail: `Capturing Linux audio via sox pulseaudio device ${device}`,
    };
  }

  async stop(): Promise<void> {
    this.process?.kill('SIGTERM');
    this.process = undefined;
    this.buffer = Buffer.alloc(0);
    this.sequence = 0;
    this.sessionId = undefined;
  }

  async readChunk(): Promise<AudioChunk | null> {
    if (!this.sessionId) {
      return null;
    }

    const sampleRateHz = this.options.sampleRateHz ?? 16000;
    const channels = this.options.channels ?? 1;
    const chunkDurationMs = this.options.chunkDurationMs ?? 1000;
    const chunkSize = Math.max(1, Math.floor(sampleRateHz * channels * 2 * chunkDurationMs / 1000));

    const deadline = Date.now() + 5000;
    while (this.buffer.length < chunkSize && Date.now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    if (this.buffer.length === 0) {
      return null;
    }

    const payload = this.buffer.subarray(0, Math.min(chunkSize, this.buffer.length));
    this.buffer = this.buffer.subarray(payload.length);

    const sequence = this.sequence++;
    return {
      sessionId: this.sessionId,
      sequence,
      startedAtMs: sequence * chunkDurationMs,
      endedAtMs: sequence * chunkDurationMs + chunkDurationMs,
      sampleRateHz,
      channels,
      payload,
    };
  }
}
