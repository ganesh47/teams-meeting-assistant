export type JoinCheckpoint =
  | 'launch_ok'
  | 'redirect_ok'
  | 'prejoin_detected'
  | 'join_attempted'
  | 'join_confirmed'
  | 'in_meeting'
  | 'transcription_active';

export interface JoinStatusReport {
  checkpoints: JoinCheckpoint[];
  finalState: string;
  detail: string;
}
