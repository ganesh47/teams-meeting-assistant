# Security Policy

## Scope

This project handles meeting join automation, local audio capture, and transcript artifacts. That means privacy and operator expectations matter from day one.

## Reporting

Please report security issues privately through GitHub security advisories or direct maintainer contact instead of filing public issues for sensitive vulnerabilities.

## Security principles

- No cloud transcription dependency for core transcription
- Local transcript storage should be explicit and operator-controlled
- Secrets and session state should never be committed
- Meeting automation should make recording/transcription state visible to the operator

## Sensitive areas

- Browser profile/session handling
- Local artifact storage
- Audio device access
- Meeting join credentials and tokens
