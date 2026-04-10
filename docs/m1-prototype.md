# M1 Prototype Usage

## Current status

The current M1 prototype can:

- validate Teams join URLs
- launch a persistent Chromium context with Playwright
- open a Teams join page
- attempt basic text-based join state detection
- apply prejoin preferences for mic and camera when the page exposes matching controls

## Run locally

```bash
npm install
npx playwright install chromium
npm run build
node dist/cli.js "https://teams.microsoft.com/l/meetup-join/..." --headless
```

## Notes

- This is still an early prototype and not production-safe
- CLI defaults can be run headless with `--headless`, which is useful on servers and CI-like environments
- Join-state detection currently relies on page text heuristics
- Real authentication and resilient DOM selectors still need hardening
- Audio capture and transcription are still placeholder modules at runtime
