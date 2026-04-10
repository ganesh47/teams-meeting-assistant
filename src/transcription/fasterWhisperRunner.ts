import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

import { AudioChunk, TranscriptSegment } from '../types/index.js';
import { TranscriptionBackend } from './whisperPipeline.js';

export interface FasterWhisperOptions {
  model: string;
  pythonBin?: string;
  workingDir?: string;
}

export class FasterWhisperBackend implements TranscriptionBackend {
  readonly name = 'faster-whisper';

  constructor(private readonly options: FasterWhisperOptions = { model: 'base' }) {}

  async transcribe(chunk: AudioChunk): Promise<TranscriptSegment[]> {
    const workRoot = this.options.workingDir ?? path.join(os.tmpdir(), 'teams-meeting-assistant');
    await mkdir(workRoot, { recursive: true });
    const runDir = await mkdtemp(path.join(workRoot, 'fw-'));

    const audioPath = path.join(runDir, `chunk-${chunk.sequence}.raw`);
    const outputPath = path.join(runDir, 'output.json');

    try {
      await writeFile(audioPath, chunk.payload);
      const pythonBin = this.options.pythonBin ?? 'python3';
      const scriptPath = path.resolve('scripts/transcribe_faster_whisper.py');
      const args = [scriptPath, '--input', audioPath, '--output', outputPath, '--model', this.options.model, '--sample-rate', String(chunk.sampleRateHz), '--channels', String(chunk.channels)];

      await runProcess(pythonBin, args);

      const { readFile } = await import('node:fs/promises');
      const parsed = JSON.parse(await readFile(outputPath, 'utf8'));
      return Array.isArray(parsed.segments)
        ? parsed.segments.map((segment: { text: string; start_ms?: number; end_ms?: number }, index: number) => ({
            sessionId: chunk.sessionId,
            sequence: chunk.sequence * 1000 + index,
            kind: 'final' as const,
            text: segment.text,
            startedAtMs: segment.start_ms ?? chunk.startedAtMs,
            endedAtMs: segment.end_ms ?? chunk.endedAtMs,
            createdAt: new Date().toISOString(),
            backend: this.name,
          }))
        : [];
    } finally {
      await rm(runDir, { recursive: true, force: true });
    }
  }
}

async function runProcess(command: string, args: string[]): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'pipe' });
    let stderr = '';

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(stderr || `Command failed: ${command} ${args.join(' ')}`));
      }
    });
  });
}
