import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

import { checkForUpdates } from './update.js';

export async function runTui(): Promise<void> {
  const rl = readline.createInterface({ input, output });

  try {
    output.write('\nTeams Meeting Assistant\n');
    output.write('1) Join a Teams meeting and write transcript locally\n');
    output.write('2) Run offline transcript pipeline demo\n');
    output.write('3) Check for updates\n');
    output.write('4) Show install one-liner\n');
    output.write('5) Exit\n\n');

    const choice = await rl.question('Choose an option: ');

    switch (choice.trim()) {
      case '1': {
        const link = await rl.question('Paste Teams meeting link: ');
        output.write(`\nRun:\nTEAMS_HEADLESS=1 teams-meeting-assistant linux-cli "${link}"\n\n`);
        break;
      }
      case '2': {
        output.write('\nRun:\nTEAMS_AUDIO_FIXTURE_PATH=/path/to/sample.raw teams-meeting-assistant offline-pipeline mock\n\n');
        break;
      }
      case '3': {
        const status = await checkForUpdates();
        output.write(`\nCurrent: ${status.currentVersion}\n`);
        output.write(`Latest: ${status.latestVersion ?? 'unknown'}\n`);
        output.write(status.updateAvailable ? `Update: ${status.command}\n\n` : 'Already up to date.\n\n');
        break;
      }
      case '4': {
        output.write('\nInstall one-liner:\n');
        output.write('sudo apt update && sudo apt install -y git curl ca-certificates python3 python3-pip sox pulseaudio-utils ffmpeg && curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs && git clone https://github.com/ganesh47/teams-meeting-assistant.git && cd teams-meeting-assistant && npm ci && npx playwright install --with-deps chromium && pip3 install faster-whisper && npm run build\n\n');
        break;
      }
      default:
        output.write('\nBye.\n');
    }
  } finally {
    rl.close();
  }
}
