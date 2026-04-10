# ADR 0001: Browser automation first for Teams join flow

## Status

Accepted

## Context

The product baseline requires compatibility with Teams meetings hosted from Microsoft 365 Personal / Office 365 Personal accounts. Enterprise bot paths are not a sufficient baseline. We also need local-only transcription.

## Decision

Use browser automation as the primary meeting join strategy for v1.

## Consequences

- Better coverage for real join-link behavior
- More UI automation complexity
- Audio capture must be solved locally alongside the browser flow
- Native Teams or enterprise bot integrations can remain optional later paths
