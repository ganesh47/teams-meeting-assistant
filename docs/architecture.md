# Architecture Overview

## Core modules

- `src/teams` for Teams join automation and meeting state detection
- `src/audio` for local audio capture abstractions
- `src/transcription` for local Whisper pipeline integration
- `src/storage` for transcript and artifact persistence
- `src/core` for orchestration and session lifecycle
- `src/types` for shared contracts

## Session flow

1. Parse Teams join URL
2. Launch join automation
3. Reach pre-join or in-meeting state
4. Start audio capture
5. Stream audio to local transcription backend
6. Persist transcript events and readable artifacts
7. Finalize session metadata and exports

## Non-functional goals

- Clear observable session states
- Local-first artifact handling
- Graceful failure states
- Extensible architecture for summaries and speaker hints later
