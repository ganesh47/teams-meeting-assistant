#!/usr/bin/env bash
set -euo pipefail

sudo apt update
sudo apt install -y git curl ca-certificates python3 python3-pip sox pulseaudio-utils ffmpeg
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
git clone https://github.com/ganesh47/teams-meeting-assistant.git
cd teams-meeting-assistant
npm ci
npx playwright install --with-deps chromium
pip3 install faster-whisper
npm run build

echo "Install complete. Run: teams-meeting-assistant tui or node dist/cli.js tui"
