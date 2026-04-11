import { createAudioOptionsFromEnv, createRuntimeOptionsFromEnv } from '../config.js';
import { buildJoinStatusReport } from './statusReporter.js';
import { runLocalTranscriptionPipeline } from './pipelineRunner.js';
import { SessionOrchestrator } from './sessionOrchestrator.js';
import { FasterWhisperBackend } from '../transcription/fasterWhisperRunner.js';
import { MockTranscriptionBackend } from '../transcription/mockTranscriptionBackend.js';

export async function runLinuxCliJoinAndTranscript(joinUrl: string, options: { useMockBackend?: boolean } = {}) {
  const orchestrator = new SessionOrchestrator();
  const runtimeOptions = {
    ...createRuntimeOptionsFromEnv(),
    autoJoin: true,
    headless: process.env.TEAMS_HEADLESS === '1',
  };

  const { session, snapshot, logger } = await orchestrator.bootstrap(joinUrl, runtimeOptions);
  await logger.log('linux_cli.join_snapshot', snapshot);

  const backend = options.useMockBackend
    ? new MockTranscriptionBackend()
    : new FasterWhisperBackend({ model: process.env.TEAMS_WHISPER_MODEL || 'base' });

  const audioOptions = createAudioOptionsFromEnv();
  const result = await runLocalTranscriptionPipeline(session, backend, audioOptions);

  await logger.log('linux_cli.pipeline_complete', {
    chunksProcessed: result.chunksProcessed,
    segmentsWritten: result.segmentsWritten,
    transcriptText: session.artifacts.transcriptText,
  });

  const status = buildJoinStatusReport({
    launched: true,
    redirected: snapshot.detail.toLowerCase().includes('prejoin') || snapshot.detail.toLowerCase().includes('teams live meeting route'),
    joinAttempted: true,
    finalState: snapshot.state,
    transcriptionActive: result.segmentsWritten > 0,
    detail: snapshot.detail,
  });

  return {
    session,
    snapshot,
    result,
    status,
  };
}
