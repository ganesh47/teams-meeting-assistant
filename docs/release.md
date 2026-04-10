# Release and Supply Chain

## Automated versioning

This project uses Release Please to prepare release PRs and manage version bumps.

## CLI release artifacts

Tag-based release packaging is handled by `release-cli.yml` and uploads the packed npm tarball to GitHub Releases.

## SBOM

`sbom.yml` generates a CycloneDX SBOM artifact.

## Provenance

`provenance.yml` is intended to generate SLSA provenance for built release artifacts.

## Notes

These workflows improve release discipline and supply-chain visibility, but they should be tested in GitHub Actions after merge.
