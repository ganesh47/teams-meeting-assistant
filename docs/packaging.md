# Linux CLI Packaging

## Shell completion

Generate bash completion locally:

```bash
bash scripts/generate-completion.sh > teams-meeting-assistant.bash
```

## Man page

A markdown manpage source is included at:

- `docs/teams-meeting-assistant.1.md`

You can convert it with tools like `pandoc` or `ronn` during packaging.

## Current packaging assets

- npm CLI package
- Dockerfile
- Makefile
- bash completion generator
- manpage source
