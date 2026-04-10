#!/usr/bin/env bash
set -euo pipefail

test -f README.md
test -f docs/spec.md
test -f docs/architecture.md
test -f SECURITY.md
test -f CONTRIBUTING.md
test -f tsconfig.json

echo "artifact checks passed"
