import { Page } from 'playwright';

import { SessionState } from '../types/index.js';

export interface DetectionResult {
  state: SessionState;
  detail: string;
}

type Matcher = {
  state: SessionState;
  patterns: RegExp[];
  detail: string;
};

const MATCHERS: Matcher[] = [
  {
    state: 'lobby',
    patterns: [/we've let people in the meeting know/i, /when someone lets you in/i, /waiting for someone to let you in/i],
    detail: 'Detected lobby waiting screen.',
  },
  {
    state: 'prejoin',
    patterns: [/join now/i, /continue on this browser/i, /choose your audio and video settings/i, /enter your name/i],
    detail: 'Detected prejoin screen.',
  },
  {
    state: 'in_meeting',
    patterns: [/meeting chat/i, /people/i, /leave/i, /raise your hand/i],
    detail: 'Detected in-meeting UI markers.',
  },
  {
    state: 'ended',
    patterns: [/this meeting has ended/i, /you've left the meeting/i, /meeting ended/i],
    detail: 'Detected ended meeting state.',
  },
  {
    state: 'failed',
    patterns: [/we couldn't find a meeting matching this id/i, /sorry, but there was a problem reaching this app/i, /you can't join this meeting/i],
    detail: 'Detected a failed or blocked join state.',
  },
];

export async function extractPageText(page: Page): Promise<string> {
  const bodyText = await page.locator('body').innerText().catch(() => '');
  if (bodyText.trim()) {
    return bodyText;
  }

  const html = await page.content().catch(() => '');
  return html;
}

export function classifyMeetingState(bodyText: string, url?: string): DetectionResult {
  if (url?.includes('teams.live.com/v2/#/meet/')) {
    return {
      state: 'prejoin',
      detail: 'Detected Teams live meeting route, likely prejoin shell waiting for app hydration.',
    };
  }
  for (const matcher of MATCHERS) {
    if (matcher.patterns.some((pattern) => pattern.test(bodyText))) {
      return {
        state: matcher.state,
        detail: matcher.detail,
      };
    }
  }

  return {
    state: 'launching',
    detail: 'Could not confidently classify current Teams page state yet.',
  };
}

export async function detectMeetingState(page: Page): Promise<DetectionResult> {
  const bodyText = await extractPageText(page);
  return classifyMeetingState(bodyText, page.url());
}
