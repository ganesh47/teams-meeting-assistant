#!/usr/bin/env bash
set -euo pipefail

test -f README.md
test -f docs/spec.md
test -f docs/architecture.md
test -f docs/end-to-end-status.md
test -f docs/transcription-backends.md
test -f docs/linux-cli.md
test -f docs/devsecops.md
test -f docs/release.md
test -f docs/packaging.md
test -f docs/teams-meeting-assistant.1.md
test -f CHANGELOG.md
test -f SECURITY.md
test -f CONTRIBUTING.md
test -f tsconfig.json

echo "artifact checks passed"
