import path from 'node:path';

import { chromium, BrowserContext, Page } from 'playwright';

import { JoinFlowOptions, MeetingTarget, SessionState } from '../types/index.js';
import { detectMeetingState } from './meetingStateDetector.js';

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

const DEFAULT_PROFILE_DIR = '.profiles/teams-personal';

export class BrowserTeamsJoinController implements TeamsJoinController {
  private context?: BrowserContext;
  private page?: Page;

  constructor(private readonly options: JoinFlowOptions = {}) {}

  async launch(target: MeetingTarget): Promise<JoinFlowSnapshot> {
    const userDataDir = path.resolve(this.options.profileDir ?? DEFAULT_PROFILE_DIR);

    this.context = await chromium.launchPersistentContext(userDataDir, {
      headless: this.options.headless ?? true,
      args: [
        '--use-fake-ui-for-media-stream',
        '--disable-blink-features=AutomationControlled',
      ],
      viewport: { width: 1440, height: 1024 },
    });

    this.page = this.context.pages()[0] ?? (await this.context.newPage());
    await this.page.goto(target.joinUrl, { waitUntil: 'domcontentloaded' });
    await this.page.waitForTimeout(1500);

    return this.detectState();
  }

  async detectState(): Promise<JoinFlowSnapshot> {
    if (!this.page) {
      return {
        state: 'failed',
        detail: 'No browser page available for Teams state detection.',
      };
    }

    return detectMeetingState(this.page);
  }

  async join(): Promise<JoinFlowSnapshot> {
    if (!this.page) {
      return {
        state: 'failed',
        detail: 'Cannot join because browser page is not initialized.',
      };
    }

    await this.applyPrejoinPreferences();

    const joinNowButton = this.page.getByRole('button', { name: /join now/i }).first();
    const continueInBrowserButton = this.page.getByRole('button', { name: /continue on this browser/i }).first();

    if (await continueInBrowserButton.isVisible().catch(() => false)) {
      await continueInBrowserButton.click();
      await this.page.waitForTimeout(1500);
    }

    if (await joinNowButton.isVisible().catch(() => false)) {
      await joinNowButton.click();
      await this.page.waitForTimeout(2000);
      return this.detectState();
    }

    return {
      state: 'prejoin',
      detail: 'Join action did not find a clickable Join now button yet.',
    };
  }

  async shutdown(): Promise<void> {
    await this.context?.close();
    this.context = undefined;
    this.page = undefined;
  }

  private async applyPrejoinPreferences(): Promise<void> {
    if (!this.page) return;

    const muteMicrophone = this.options.prejoin?.muteMicrophone ?? true;
    const disableCamera = this.options.prejoin?.disableCamera ?? true;

    if (muteMicrophone) {
      const micButton = this.page.getByRole('button', { name: /microphone/i }).first();
      if (await micButton.isVisible().catch(() => false)) {
        const pressed = await micButton.getAttribute('aria-pressed').catch(() => null);
        if (pressed === 'true') {
          await micButton.click().catch(() => undefined);
        }
      }
    }

    if (disableCamera) {
      const cameraButton = this.page.getByRole('button', { name: /camera/i }).first();
      if (await cameraButton.isVisible().catch(() => false)) {
        const pressed = await cameraButton.getAttribute('aria-pressed').catch(() => null);
        if (pressed === 'true') {
          await cameraButton.click().catch(() => undefined);
        }
      }
    }
  }
}
