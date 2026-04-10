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
- GitHub Actions for CI, build, security checks, CodeQL, release prep, and label sync
- issue templates and PR template
- architecture and ADR docs
- implementation skeleton for core modules

### Quick start

```bash
npm install
npm run build
npm test
```
