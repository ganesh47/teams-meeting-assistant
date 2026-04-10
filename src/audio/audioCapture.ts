import { AudioCaptureHealth, AudioCaptureMode, AudioChunk } from '../types/index.js';

export interface AudioCaptureController {
  start(sessionId: string): Promise<AudioCaptureHealth>;
  stop(): Promise<void>;
  readChunk(): Promise<AudioChunk | null>;
}

export class LocalAudioCaptureController implements AudioCaptureController {
  constructor(private readonly preferredMode: AudioCaptureMode = 'browser_tab') {}

  async start(_sessionId: string): Promise<AudioCaptureHealth> {
    return {
      mode: this.preferredMode,
      healthy: false,
      detail: 'Audio capture not implemented yet. Placeholder controller is wired.',
    };
  }

  async stop(): Promise<void> {
    return;
  }

  async readChunk(): Promise<AudioChunk | null> {
    return null;
  }
}
