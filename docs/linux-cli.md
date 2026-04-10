# Linux CLI Flow

## Goal

Given a Teams meeting link, launch browser automation on Linux, join the meeting, and write transcript output locally to a text file first.

## Current CLI

```bash
teams-meeting-assistant join "<teams-link>" --auto-join
```

## Transcript-first local path

For pipeline validation:

```bash
TEAMS_AUDIO_FIXTURE_PATH=/path/to/sample.raw \
teams-meeting-assistant offline-pipeline mock
```

## Intended Linux live path

- Browser automation via Playwright/Chromium
- Audio capture via PulseAudio/PipeWire loopback using `sox`
- Local transcription via `faster-whisper`
- Output transcript written to `artifacts/<session-id>/transcript.txt`

## Linux dependencies

- Chromium dependencies for Playwright
- `sox`
- PulseAudio or PipeWire compatibility layer
- Python 3
- `faster-whisper`

## Important note

The repository now includes Linux-oriented scaffolding for this path, but real live meeting validation is still required to call it complete.
