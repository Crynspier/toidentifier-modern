# Compatibility with toidentifier 1.0.1

`toidentifier-modern` targets the published toidentifier@1.0.1 package. The compatibility suite executes the modern implementation and the installed reference package on the same input corpus.

## Preserved behavior

- CommonJS package exposes one callable default function.
- Literal U+0020 spaces are the only word separators.
- The first character of each token is uppercased before concatenation.
- Tokens are joined without a separator.
- The final filter removes characters outside ASCII letters, digits, and `_`.
- Runtime errors for invalid non-string inputs remain observable rather than being replaced with custom coercion.

## Modern additions and intentional differences

- ESM entrypoint.
- First-party TypeScript declarations.
- Explicit `exports` map.
- CommonJS compatibility shim generated from the TypeScript source.
- Node runtime floor is >=18 rather than the legacy package's much older engine range.
- Cross-platform Node 18–26 CI on Linux, Windows, and macOS.
- macOS Intel smoke testing in addition to the primary macOS ARM64 runner.

## Intentional non-features

The package does not attempt to become a general identifier or casing library. It deliberately does not add Unicode normalization, transliteration, generic whitespace handling, or arbitrary runtime value coercion.
