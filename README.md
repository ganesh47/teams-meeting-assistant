# Teams Meeting Assistant

A meeting assistant focused on Microsoft Teams meetings, with local-only transcription.

## Goals

- Join Microsoft Teams meetings from standard join links
- Support meetings hosted from Microsoft 365 Personal / Office 365 Personal accounts as a baseline
- Capture meeting audio locally
- Produce live and post-meeting text transcripts using a local Whisper-based pipeline
- Keep transcription and transcript storage local by default

## Planned Capabilities

- Browser-based Teams join flow
- Playwright-based persistent Chromium launch for M1 prototype
- Guest and signed-in personal Microsoft account join support
- Lobby detection and wait handling
- Mute mic and disable camera by default
- Local audio capture with preferred tab capture and loopback fallback
- Streaming transcript generation
- Transcript export in Markdown and JSONL
- Local summarization and action-item extraction in later phases

## Status

Planning complete, repository scaffolded, and initial TypeScript implementation skeleton added for:

- session orchestration
- Teams join flow abstraction
- local audio capture abstraction
- Whisper transcription backend abstraction
- first-pass faster-whisper integration path for local transcription
- transcript storage

## Initial Roadmap

1. Prototype Teams join via browser automation
2. Capture meeting audio locally
3. Stream local Whisper transcription
4. Build transcript persistence and export
5. Improve resilience, speaker labeling, and packaging

## Principles

- Local-first transcription
- Reliable join UX over deep integration complexity
- Personal-account compatibility as a product baseline
- Explicit consent and recording visibility

## Development

Current project baseline includes:

- TypeScript build setup
- GitHub Actions for CI, build, security checks, CodeQL, release prep, release packaging, container smoke, and label sync
- issue templates and PR template
- architecture and ADR docs
- implementation skeleton for core modules
- Linux CLI packaging and Docker build support
- release automation, SBOM, and provenance scaffolding

### One-liner install on Ubuntu/Debian VM

```bash
sudo apt update && sudo apt install -y git curl ca-certificates python3 python3-pip sox pulseaudio-utils ffmpeg && curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs && git clone https://github.com/ganesh47/teams-meeting-assistant.git && cd teams-meeting-assistant && npm ci && npx playwright install --with-deps chromium && pip3 install faster-whisper && npm run build
```

### Slicker terminal UX

```bash
node dist/cli.js
```

That opens the lightweight TUI menu.

### Quick start

```bash
TEAMS_HEADLESS=1 teams-meeting-assistant linux-cli "https://teams.microsoft.com/l/meetup-join/..."
```

### Offline transcript pipeline demo

```bash
TEAMS_AUDIO_FIXTURE_PATH=/path/to/sample.raw \
TEAMS_AUDIO_MODE=system_loopback \
node dist/cli.js offline-pipeline mock
```

Environment controls are documented in `.env.example`.

### Update check

```bash
teams-meeting-assistant update
```

Apply update:

```bash
teams-meeting-assistant update --apply
```

Additional notes:
- `docs/install.md` covers the simplified Linux VM install path
- `docs/tui.md` covers the terminal menu UX
- `docs/m1-prototype.md` covers the current browser-automation prototype
- `docs/transcription-backends.md` covers the local transcription backend direction
- `docs/end-to-end-status.md` states exactly what is and is not complete end-to-end
- `docs/linux-cli.md` covers the Linux CLI target flow
- `docs/devsecops.md` covers CI/CD and DevSecOps posture
- `docs/release.md` covers release automation and supply-chain posture
- `docs/packaging.md` covers Linux CLI packaging extras
