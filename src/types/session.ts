export type SessionState =
  | 'idle'
  | 'launching'
  | 'prejoin'
  | 'joining'
  | 'lobby'
  | 'in_meeting'
  | 'ending'
  | 'ended'
  | 'failed';

export interface MeetingTarget {
  joinUrl: string;
  hostType: 'personal' | 'work_or_school' | 'unknown';
}

export interface SessionArtifactPaths {
  rootDir: string;
  transcriptJsonl: string;
  transcriptMarkdown: string;
  transcriptText: string;
  logFile: string;
}

export interface SessionRuntimeOptions {
  headless: boolean;
  profileDir: string;
  displayName: string;
}

export interface MeetingSession {
  id: string;
  target: MeetingTarget;
  state: SessionState;
  startedAt: string;
  updatedAt: string;
  artifacts: SessionArtifactPaths;
  runtime: SessionRuntimeOptions;
}
