#!/usr/bin/env node
import { createAudioOptionsFromEnv, createRuntimeOptionsFromEnv } from './config.js';
import { runLinuxCliJoinAndTranscript, runLocalTranscriptionPipeline, checkForUpdates, performUpdate } from './index.js';
import { SessionOrchestrator } from './index.js';
import { runTui } from './tui.js';
import { FasterWhisperBackend } from './transcription/fasterWhisperRunner.js';
import { MockTranscriptionBackend } from './transcription/mockTranscriptionBackend.js';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] ?? 'tui';

  if (command === 'tui') {
    await runTui();
    return;
  }

  const orchestrator = new SessionOrchestrator();

  if (command === 'update') {
    const shouldApply = args.includes('--apply');
    const status = await checkForUpdates();

    if (!status.latestVersion) {
      console.log(JSON.stringify({ ok: false, message: 'Could not determine latest version from npm.' }, null, 2));
      return;
    }

    if (!status.updateAvailable) {
      console.log(JSON.stringify({ ok: true, message: 'Already up to date.', currentVersion: status.currentVersion }, null, 2));
      return;
    }

    if (!shouldApply) {
      console.log(JSON.stringify({
        ok: true,
        updateAvailable: true,
        currentVersion: status.currentVersion,
        latestVersion: status.latestVersion,
        command: status.command,
      }, null, 2));
      return;
    }

    const result = await performUpdate();
    console.log(JSON.stringify({ ok: true, updated: true, command: result.command }, null, 2));
    return;
  }

  if (command === 'linux-cli') {
    const joinUrl = args[1];
    if (!joinUrl) {
      console.error('Usage: teams-meeting-assistant linux-cli <teams-join-url>');
      process.exit(1);
    }

    const output = await runLinuxCliJoinAndTranscript(joinUrl, {
      useMockBackend: process.env.TEAMS_USE_MOCK_BACKEND === '1',
    });
    console.log(JSON.stringify({
      sessionId: output.session.id,
      state: output.snapshot.state,
      transcriptText: output.session.artifacts.transcriptText,
      chunksProcessed: output.result.chunksProcessed,
      segmentsWritten: output.result.segmentsWritten,
    }, null, 2));
    return;
  }

  if (command === 'join') {
    const joinUrl = args[1];
    if (!joinUrl) {
      console.error('Usage: teams-meeting-assistant join <teams-join-url> [--headless] [--auto-join]');
      process.exit(1);
    }

    const envOptions = createRuntimeOptionsFromEnv();
    const runtimeOptions = {
      ...envOptions,
      headless: args.includes('--headless') ? true : envOptions.headless,
      autoJoin: args.includes('--auto-join') ? true : envOptions.autoJoin,
    };

    const { session, snapshot } = await orchestrator.bootstrap(joinUrl, runtimeOptions);
    console.log(JSON.stringify({ sessionId: session.id, state: snapshot.state, detail: snapshot.detail, artifacts: session.artifacts, runtime: session.runtime }, null, 2));
    return;
  }

  if (command === 'offline-pipeline') {
    const backendName = args[1] ?? 'mock';
    const runtimeOptions = createRuntimeOptionsFromEnv();
    const audioOptions = createAudioOptionsFromEnv();
    const { session } = await orchestrator.createOfflineSession(runtimeOptions);

    const backend = backendName === 'faster-whisper'
      ? new FasterWhisperBackend({ model: process.env.TEAMS_WHISPER_MODEL || 'base' })
      : new MockTranscriptionBackend();

    const result = await runLocalTranscriptionPipeline(session, backend, audioOptions);
    console.log(JSON.stringify({ sessionId: session.id, backend: backend.name, result, artifacts: session.artifacts }, null, 2));
    return;
  }

  console.error(`Unknown command: ${command}`);
  process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
