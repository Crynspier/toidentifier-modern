# Changelog

## 0.2.0 - 2026-09-20

### Changed

- Changed the default `toIdentifier()` semantics from exact legacy compatibility to modern identifier conversion.
- Added Unicode NFKC normalization by default.
- Added whitespace, punctuation, and underscore word boundaries.
- Added camelCase boundary detection and acronym splitting.
- Added strict/module-safe identifier validity guarantees.
- Added PascalCase (default) and camelCase output styles.
- Added reserved-word protection and leading-underscore fallback behavior.
- Updated documentation to make semantic compatibility boundaries explicit.

### Added

- `isValidIdentifier()`.
- `toIdentifierLegacy()` for exact `toidentifier@1.0.1` behavior.
- `MODERN_SPEC.md`.
- `MIGRATION.md`.
- Modern validity and case-boundary regression tests.
- Parser-backed strict-binding and module-grammar verification.
- Runtime option/input validation with explicit TypeError contracts.
- Adversarial Unicode, normalization, boundary, collision, and invisible-character coverage.
- Expanded legacy differential corpus.
- Tightened packed-package surface checks.

### Compatibility

This is an intentional semantic breaking release from 0.1.x. Consumers that require the historical default behavior should use `toIdentifierLegacy()` or remain on 0.1.1.

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

Initial modern compatibility release targeting the published `toidentifier@1.0.1` behavior.

### Added

- ESM and CommonJS packages from one TypeScript source.
- First-party TypeScript declarations.
- Differential tests against toidentifier@1.0.1.
- Deterministic 2,500-input differential corpus and 10,000-input local reference corpus.
- Linux, Windows, macOS ARM64, and macOS Intel CI coverage across Node 18–26.
- Explicit compatibility documentation and modern package metadata.
