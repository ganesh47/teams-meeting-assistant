# Install

## One-liner for Ubuntu/Debian-style Linux VM

```bash
sudo apt update && sudo apt install -y git curl ca-certificates python3 python3-pip sox pulseaudio-utils ffmpeg && curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs && git clone https://github.com/ganesh47/teams-meeting-assistant.git && cd teams-meeting-assistant && npm ci && npx playwright install --with-deps chromium && pip3 install faster-whisper && npm run build
```

## Run

```bash
TEAMS_HEADLESS=1 node dist/cli.js linux-cli "<teams-link>"
```

## Check for updates

```bash
node dist/cli.js update
```
