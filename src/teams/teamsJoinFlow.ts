import { MeetingTarget, SessionState } from '../types/index.js';

export interface JoinFlowSnapshot {
  state: SessionState;
  detail: string;
}

export interface TeamsJoinController {
  launch(target: MeetingTarget): Promise<JoinFlowSnapshot>;
  detectState(): Promise<JoinFlowSnapshot>;
  join(): Promise<JoinFlowSnapshot>;
  shutdown(): Promise<void>;
}

export class BrowserTeamsJoinController implements TeamsJoinController {
  async launch(target: MeetingTarget): Promise<JoinFlowSnapshot> {
    return {
      state: 'launching',
      detail: `Launching browser automation for ${target.joinUrl}`,
    };
  }

  async detectState(): Promise<JoinFlowSnapshot> {
    return {
      state: 'prejoin',
      detail: 'Placeholder detection until DOM-driven Teams state mapping is implemented.',
    };
  }

  async join(): Promise<JoinFlowSnapshot> {
    return {
      state: 'joining',
      detail: 'Placeholder join action. Will mute mic, disable camera, and submit prejoin flow.',
    };
  }

  async shutdown(): Promise<void> {
    return;
  }
}
