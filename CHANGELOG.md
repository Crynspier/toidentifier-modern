# Changelog

## 0.1.1 - 2026-09-20

### Changed

- Bumped package version to 0.1.1.
- Simplified the CommonJS entry to a plain callable export for closer legacy compatibility.
- Expanded npm keywords for package discovery.
- Renamed the internal CI check label from lint semantics to format checking while retaining the `npm run lint` alias.

### Added

- Committed `package-lock.json` for reproducible dependency installation.
- `npm ci`-based CI across Linux, Windows, macOS ARM64, and macOS Intel.
- Deterministic 5,000-input Unicode differential corpus.
- Large-input differential regression coverage up to 1 MiB.
- Real packed-tarball consumer tests for ESM, CommonJS, TypeScript declarations, and package contents.
- GitHub Actions release workflow prepared for npm trusted publishing and provenance.
- Compatibility-boundary documentation.

## 0.1.0 - 2026-09-20

Initial modern compatibility release targeting the published toidentifier@1.0.1 behavior.

### Added

- ESM and CommonJS packages from one TypeScript source.
- First-party TypeScript declarations.
- Differential tests against toidentifier@1.0.1.
- Deterministic 2,500-input differential corpus and 10,000-input local reference corpus.
- Linux, Windows, macOS ARM64, and macOS Intel CI coverage across Node 18–26.
- Explicit compatibility documentation and modern package metadata.
