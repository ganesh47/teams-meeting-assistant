import { Page } from 'playwright';

import { SessionState } from '../types/index.js';

export interface DetectionResult {
  state: SessionState;
  detail: string;
}

const MATCHERS: Array<{ state: SessionState; patterns: RegExp[] }> = [
  { state: 'lobby', patterns: [/we've let people in the meeting know/i, /when someone lets you in/i, /waiting for someone to let you in/i] },
  { state: 'prejoin', patterns: [/join now/i, /continue on this browser/i, /choose your audio and video settings/i] },
  { state: 'in_meeting', patterns: [/meeting chat/i, /people/i, /more/i, /leave/i] },
  { state: 'ended', patterns: [/this meeting has ended/i, /you've left the meeting/i] },
  { state: 'failed', patterns: [/we couldn't find a meeting matching this id/i, /sorry, but there was a problem reaching this app/i] },
];

export async function detectMeetingState(page: Page): Promise<DetectionResult> {
  const bodyText = await page.locator('body').innerText().catch(() => '');

  for (const matcher of MATCHERS) {
    if (matcher.patterns.some((pattern) => pattern.test(bodyText))) {
      return {
        state: matcher.state,
        detail: `Detected Teams state from page text: ${matcher.state}`,
      };
    }
  }

  return {
    state: 'launching',
    detail: 'Could not confidently classify current Teams page state yet.',
  };
}
