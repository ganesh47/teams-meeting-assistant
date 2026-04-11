import { JoinStatusReport } from '../types/status.js';
import { SessionState } from '../types/index.js';

export function buildJoinStatusReport(input: {
  launched: boolean;
  redirected: boolean;
  joinAttempted: boolean;
  finalState: SessionState;
  transcriptionActive: boolean;
  detail: string;
}): JoinStatusReport {
  const checkpoints: JoinStatusReport['checkpoints'] = [];

  if (input.launched) checkpoints.push('launch_ok');
  if (input.redirected) checkpoints.push('redirect_ok');
  if (input.finalState === 'prejoin' || input.finalState === 'joining' || input.finalState === 'lobby' || input.finalState === 'in_meeting') {
    checkpoints.push('prejoin_detected');
  }
  if (input.joinAttempted) checkpoints.push('join_attempted');
  if (input.finalState === 'lobby' || input.finalState === 'in_meeting') checkpoints.push('join_confirmed');
  if (input.finalState === 'in_meeting') checkpoints.push('in_meeting');
  if (input.transcriptionActive) checkpoints.push('transcription_active');

  return {
    checkpoints,
    finalState: input.finalState,
    detail: input.detail,
  };
}
