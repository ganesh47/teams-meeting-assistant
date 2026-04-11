# Install

## One-liner for Ubuntu/Debian-style Linux VM

```bash
sudo apt update && sudo apt install -y git curl ca-certificates python3 python3-pip sox pulseaudio-utils ffmpeg && curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs && npx playwright install --with-deps chromium && pip3 install faster-whisper && npm install -g github:ganesh47/teams-meeting-assistant
```

## Run

```bash
teams-meeting-assistant
```

## Direct join

```bash
TEAMS_HEADLESS=1 teams-meeting-assistant linux-cli "<teams-link>"
```

## Check for updates

```bash
teams-meeting-assistant update
```
