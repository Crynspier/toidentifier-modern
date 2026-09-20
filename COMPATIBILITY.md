# Compatibility with toidentifier 1.0.1

Version 0.2.x does not claim that the modern default is behavior-compatible with the historical package.

Instead, exact historical behavior is exposed as the named `toIdentifierLegacy` helper.

## Legacy guarantees

`toIdentifierLegacy` targets the published `toidentifier@1.0.1` package:

- split words only on literal U+0020 spaces;
- uppercase the first character of every token;
- concatenate tokens;
- remove characters outside ASCII letters, digits, and `_`;
- preserve the legacy runtime behavior for invalid non-string inputs.

The compatibility suite compares `toIdentifierLegacy` directly with the installed reference package across explicit edge cases and a deterministic 5,000-input Unicode corpus.

## Modern default

The default `toIdentifier` is intentionally different and provides:

- Unicode-aware NFKC normalization;
- punctuation and whitespace word boundaries;
- camelCase/PascalCase boundary detection;
- Unicode identifier preservation;
- strict/module-safe binding-identifier validity;
- reserved-word avoidance;
- PascalCase and camelCase styles.
- Runtime validation rejects non-string inputs, invalid option objects, unsupported styles, and non-boolean normalization flags.

## Packaging compatibility

- ESM entrypoint.
- CommonJS package root remains callable.
- First-party TypeScript declarations.
- Explicit `exports` map.
- Node runtime floor is >=18.
- Deep imports are not part of the public contract.
