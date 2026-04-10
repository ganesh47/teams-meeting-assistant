import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { SessionOrchestrator, runLocalTranscriptionPipeline, MockTranscriptionBackend } from '../dist/index.js';

test('runs offline transcription pipeline with fixture audio', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'teams-assistant-test-'));
  const fixturePath = path.join(tempDir, 'fixture.raw');
  const rawAudio = Buffer.alloc(16000 * 2, 1);
  await writeFile(fixturePath, rawAudio);

  try {
    const orchestrator = new SessionOrchestrator();
    const { session } = await orchestrator.createOfflineSession({ headless: true });
    const result = await runLocalTranscriptionPipeline(session, new MockTranscriptionBackend(), {
      fixturePath,
      sampleRateHz: 16000,
      channels: 1,
      chunkDurationMs: 1000,
      mode: 'system_loopback',
    });

    assert.equal(result.chunksProcessed, 1);
    assert.equal(result.segmentsWritten, 1);
    const transcript = await readFile(session.artifacts.transcriptText, 'utf8');
    assert.match(transcript, /mock transcript chunk 0/);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});
