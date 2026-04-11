import path from 'node:path';
import { writeFile } from 'node:fs/promises';

import { chromium, BrowserContext, Page } from 'playwright';

import { SessionLogger } from '../core/logger.js';
import { JoinFlowOptions, MeetingTarget, SessionState } from '../types/index.js';
import { clickIfVisible, fillIfVisible, setPressedState } from './domActions.js';
import { detectMeetingState } from './meetingStateDetector.js';
import { TEAMS_SELECTORS } from './selectors.js';

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
  private logger?: SessionLogger;

  constructor(
    private readonly options: JoinFlowOptions = {},
    logger?: SessionLogger,
  ) {
    this.logger = logger;
  }

  async launch(target: MeetingTarget): Promise<JoinFlowSnapshot> {
    const userDataDir = path.resolve(this.options.profileDir ?? DEFAULT_PROFILE_DIR);
    await this.logger?.log('launch.begin', { joinUrl: target.joinUrl, userDataDir });

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
    await this.page.waitForTimeout(7000);
    await this.captureDebugArtifacts('after-goto');

    const openedInBrowser = await clickIfVisible(this.page, TEAMS_SELECTORS.continueInBrowserButtons);
    if (openedInBrowser) {
      await this.logger?.log('launch.continue_in_browser_clicked');
      await this.page.waitForTimeout(5000);
      await this.captureDebugArtifacts('after-continue-browser');
    }

    const snapshot = await this.detectState();
    await this.logger?.log('launch.detected_state', snapshot);
    return snapshot;
  }

  async detectState(): Promise<JoinFlowSnapshot> {
    if (!this.page) {
      return {
        state: 'failed',
        detail: 'No browser page available for Teams state detection.',
      };
    }

    const snapshot = await detectMeetingState(this.page);
    await this.logger?.log('state.detected', snapshot);
    return snapshot;
  }

  async join(): Promise<JoinFlowSnapshot> {
    if (!this.page) {
      return {
        state: 'failed',
        detail: 'Cannot join because browser page is not initialized.',
      };
    }

    await this.applyPrejoinPreferences();

    if (this.options.displayName) {
      const filledName = await fillIfVisible(this.page, TEAMS_SELECTORS.nameInput, this.options.displayName);
      if (filledName) {
        await this.logger?.log('join.display_name_filled', { displayName: this.options.displayName });
      }
    }

    await this.captureDebugArtifacts('before-join-click');
    const joined = await clickIfVisible(this.page, TEAMS_SELECTORS.joinNowButtons);
    await this.page.waitForTimeout(6000);
    await this.captureDebugArtifacts('after-join-click');

    if (joined) {
      let snapshot = await this.detectState();
      for (let i = 0; i < 4; i += 1) {
        if (snapshot.state === 'lobby' || snapshot.state === 'in_meeting') {
          break;
        }
        await this.page.waitForTimeout(3000);
        await this.captureDebugArtifacts(`post-join-poll-${i + 1}`);
        snapshot = await this.detectState();
      }
      await this.logger?.log('join.clicked_join_now', snapshot);
      return snapshot;
    }

    const snapshot = await this.detectState();
    return {
      state: snapshot.state,
      detail: `Join action did not find a clickable Join now button yet. Last state: ${snapshot.state}`,
    };
  }

  async shutdown(): Promise<void> {
    await this.logger?.log('shutdown.begin');
    await this.context?.close();
    this.context = undefined;
    this.page = undefined;
    await this.logger?.log('shutdown.complete');
  }

  private async applyPrejoinPreferences(): Promise<void> {
    if (!this.page) return;

    const muteMicrophone = this.options.prejoin?.muteMicrophone ?? true;
    const disableCamera = this.options.prejoin?.disableCamera ?? true;

    if (muteMicrophone) {
      const updated = await setPressedState(this.page, TEAMS_SELECTORS.micButtons, false);
      await this.logger?.log('prejoin.microphone_preference', { muteMicrophone, updated });
    }

    if (disableCamera) {
      const updated = await setPressedState(this.page, TEAMS_SELECTORS.cameraButtons, false);
      await this.logger?.log('prejoin.camera_preference', { disableCamera, updated });
    }
  }

  private async captureDebugArtifacts(label: string): Promise<void> {
    if (!this.page || !this.options.profileDir) return;

    const debugDir = path.resolve(this.options.profileDir, 'debug-artifacts');
    await writeFile(path.join(debugDir, '.keep'), '', { flag: 'a' }).catch(async () => {
      await import('node:fs/promises').then(({ mkdir }) => mkdir(debugDir, { recursive: true }));
    });

    const safeLabel = label.replace(/[^a-z0-9-_]/gi, '_');
    const url = this.page.url();
    const html = await this.page.content().catch(() => '');
    const bodyText = await this.page.locator('body').innerText().catch(() => '');

    await writeFile(path.join(debugDir, `${safeLabel}.url.txt`), url, 'utf8');
    await writeFile(path.join(debugDir, `${safeLabel}.body.txt`), bodyText, 'utf8');
    await writeFile(path.join(debugDir, `${safeLabel}.html`), html, 'utf8');
    await this.page.screenshot({ path: path.join(debugDir, `${safeLabel}.png`), fullPage: true }).catch(() => undefined);
    await this.logger?.log('debug.artifacts_captured', { label, url, debugDir });
  }
}
