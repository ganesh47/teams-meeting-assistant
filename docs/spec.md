# Teams Meeting Assistant Specification

## Objective

Build a Microsoft Teams meeting assistant that can join Teams meetings, including meetings hosted from Microsoft 365 Personal / Office 365 Personal accounts, and produce local-only text transcripts using a Whisper-based transcription pipeline.

## Product Constraints

- Personal-account-hosted Teams meetings are a required baseline
- Transcription must run locally, not in cloud APIs
- UX should prioritize the simplest reliable meeting join experience

## Proposed v1 Architecture

### Join Layer
- Browser-based join flow using Chromium automation
- Support guest join and signed-in Microsoft personal account join
- Reuse persistent browser profile for session continuity
- Handle lobby, mute, camera-off, and reconnect states

### Audio Layer
- Preferred: browser tab audio capture
- Fallback: system loopback audio capture
- Buffer audio in rolling chunks for low-latency transcription

### Transcription Layer
- Local Whisper backend, likely faster-whisper or whisper.cpp
- Partial and finalized transcription segments
- Timestamps required

### Transcript Service
- Raw transcript event storage in JSONL
- Readable transcript export in Markdown and text
- Session metadata including join URL hash, start time, end time, and capture mode

### Later Layers
- Local summarization
- Action item extraction
- Better speaker attribution where feasible

## Risks

- Teams web join flow variability across meeting types
- Personal-account meeting auth edge cases
- Audio capture differences across OSes
- Limited speaker attribution fidelity in v1

## Non-Goals for v1

- Enterprise-grade Teams bot integration
- Perfect diarization
- Cloud transcription backends

## Milestones

1. Join Teams meeting links via browser automation
2. Capture meeting audio locally
3. Produce live local transcription
4. Store and export transcripts
5. Improve reliability and packaging
