#!/usr/bin/env bash
set -euo pipefail

sudo apt update
sudo apt install -y git curl ca-certificates python3 python3-pip sox pulseaudio-utils ffmpeg
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
npx playwright install --with-deps chromium
pip3 install faster-whisper
npm install -g github:ganesh47/teams-meeting-assistant

echo "Install complete. Run: teams-meeting-assistant"
