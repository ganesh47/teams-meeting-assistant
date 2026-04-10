# Local Transcription Backends

## Current direction

This project now includes a first-pass integration path for `faster-whisper` via a local Python runner script.

## Why this path first

- easier to get a local prototype working quickly
- good quality/speed tradeoff
- keeps transcription fully local
- works as a bridge while a `whisper.cpp` path can be added later if packaging/runtime footprint matters more

## Current state

- `PlaceholderWhisperBackend` still exists for scaffolded runs
- `FasterWhisperBackend` has been added as an integration path
- runtime wiring still needs real audio capture feeding it with PCM chunks

## Requirements

- Python 3
- `pip install faster-whisper`
- model files downloaded locally by faster-whisper as needed

## Caveats

- current script path assumes raw 16-bit PCM input chunks
- chunk stitching and partial transcript behavior still need refinement
- real-time streaming behavior is not complete yet
