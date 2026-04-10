# Contributing

## Development principles

- Keep personal-account Teams compatibility in scope for all join-flow decisions
- Keep transcription local-first
- Prefer small, reviewable pull requests
- Document architecture changes in `docs/` when they affect core flows

## Local setup

1. Install Node.js 20+
2. Install dependencies with `npm install`
3. Copy `.env.example` if environment configuration is introduced
4. Run `npm run build`
5. Run `npm test`

## Pull requests

- Reference the related issue
- Describe user-visible impact
- Include validation notes
- Update docs when behavior changes
