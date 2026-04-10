# M1 Prototype Usage

## Current status

The current M1 prototype can:

- validate Teams join URLs
- launch a persistent Chromium context with Playwright
- open a Teams join page
- continue into browser flow when Teams presents that handoff
- attempt text-based join state detection
- apply prejoin preferences for mic and camera using selector fallbacks
- optionally auto-fill display name and auto-attempt join
- write structured session logs to the session artifact directory

## Run locally

```bash
npm install
npx playwright install chromium
npm run build
TEAMS_HEADLESS=1 TEAMS_AUTO_JOIN=1 node dist/cli.js "https://teams.microsoft.com/l/meetup-join/..."
```

## Notes

- This is still an early prototype and not production-safe
- Headless and auto-join behavior can be controlled by env vars or CLI flags
- Join-state detection still relies partly on page text heuristics and needs more DOM-aware hardening
- Authentication and personal-account flows still need validation against real meetings
- Audio capture and transcription are still placeholder modules at runtime
