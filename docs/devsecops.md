# DevSecOps and CI/CD

## CI coverage

- `build.yml` for install, build, test, and artifact checks
- `ci.yml` for markdown/yaml validation and shell checks
- `security.yml` for dependency review and secret scanning
- `codeql.yml` for code analysis
- `devsecops.yml` for npm audit, OSV scanning, and OpenSSF Scorecard
- `container-smoke.yml` for Docker build and CLI smoke testing
- `release-cli.yml` for CLI packaging and GitHub Releases on version tags

## Linux CLI operational target

The project is now structured as a Linux CLI with supporting CI/CD around build, packaging, container smoke tests, and supply-chain scanning.

## Security posture

- lockfile committed
- npm engine strict mode enabled
- dependency audit in CI
- secret scan in CI
- CodeQL enabled
- OSV scan enabled
- Scorecard enabled

## Release flow

Tag a release like:

```bash
git tag v0.1.0
git push origin v0.1.0
```

That triggers CLI packaging and GitHub Release artifact upload.
