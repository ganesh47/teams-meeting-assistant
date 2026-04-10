import { LocalAudioCaptureController, AudioCaptureOptions } from '../audio/audioCapture.js';
import { TranscriptStore } from '../storage/transcriptStore.js';
import { TranscriptionBackend } from '../transcription/whisperPipeline.js';
import { MeetingSession, TranscriptSegment } from '../types/index.js';

export interface PipelineRunResult {
  chunksProcessed: number;
  segmentsWritten: number;
  segments: TranscriptSegment[];
}

export async function runLocalTranscriptionPipeline(
  session: MeetingSession,
  backend: TranscriptionBackend,
  audioOptions: AudioCaptureOptions,
): Promise<PipelineRunResult> {
  const audioCapture = new LocalAudioCaptureController(audioOptions);
  const store = new TranscriptStore();

  await audioCapture.start(session.id);

  let chunksProcessed = 0;
  let segmentsWritten = 0;
  const segments: TranscriptSegment[] = [];

  while (true) {
    const chunk = await audioCapture.readChunk();
    if (!chunk) break;

    chunksProcessed += 1;
    const transcriptSegments = await backend.transcribe(chunk);
    for (const segment of transcriptSegments) {
      await store.appendSegment(session, segment);
      segments.push(segment);
      segmentsWritten += 1;
    }
  }

  await audioCapture.stop();

  return {
    chunksProcessed,
    segmentsWritten,
    segments,
  };
}
