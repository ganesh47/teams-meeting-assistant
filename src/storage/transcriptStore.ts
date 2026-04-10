import { mkdir, appendFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { MeetingSession, TranscriptSegment } from '../types/index.js';

export class TranscriptStore {
  async initialize(session: MeetingSession): Promise<void> {
    await mkdir(session.artifacts.rootDir, { recursive: true });
    await writeFile(session.artifacts.transcriptMarkdown, `# Transcript\n\nSession: ${session.id}\n\n`, 'utf8');
    await writeFile(session.artifacts.transcriptText, '', 'utf8');
    await writeFile(session.artifacts.transcriptJsonl, '', 'utf8');
    await writeFile(session.artifacts.logFile, '', 'utf8');
  }

  async appendSegment(session: MeetingSession, segment: TranscriptSegment): Promise<void> {
    const line = JSON.stringify(segment) + '\n';
    await appendFile(session.artifacts.transcriptJsonl, line, 'utf8');
    await appendFile(session.artifacts.transcriptText, `${segment.text}\n`, 'utf8');
    await appendFile(
      session.artifacts.transcriptMarkdown,
      `- [${segment.startedAtMs}-${segment.endedAtMs}] ${segment.text}\n`,
      'utf8',
    );
  }

  static buildArtifactPaths(baseDir: string, sessionId: string) {
    const rootDir = path.join(baseDir, sessionId);
    return {
      rootDir,
      transcriptJsonl: path.join(rootDir, 'transcript.jsonl'),
      transcriptMarkdown: path.join(rootDir, 'transcript.md'),
      transcriptText: path.join(rootDir, 'transcript.txt'),
      logFile: path.join(rootDir, 'session.log'),
    };
  }
}
