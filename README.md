# toidentifier-modern

[![CI](https://github.com/Crynspier/toidentifier-modern/actions/workflows/ci.yml/badge.svg)](https://github.com/Crynspier/toidentifier-modern/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/toidentifier-modern)](https://www.npmjs.com/package/toidentifier-modern)

**A tiny, dependency-free, TypeScript-first modernization of the toidentifier@1.0.1 API.**

`toidentifier-modern` preserves the established single-function behavior while adding modern ESM/CommonJS packaging and first-party TypeScript declarations.

## Install

```sh
npm install toidentifier-modern
```

## Usage

```js
import toIdentifier from 'toidentifier-modern'

toIdentifier('Bad Request')
// => "BadRequest"
```

CommonJS remains callable:

```js
const toIdentifier = require('toidentifier-modern')

toIdentifier('Bad Request')
// => "BadRequest"
```

Named ESM exports are also available:

```js
import { toIdentifier } from 'toidentifier-modern'
```

## Compatibility

The compatibility target is the published toidentifier@1.0.1 package. The differential suite runs against the installed reference package on explicit edge cases and a deterministic 2,500-input corpus.

The legacy behavior is intentionally preserved:

1. Split words only on literal U+0020 spaces.
2. Uppercase the first character of each token.
3. Concatenate the tokens.
4. Remove characters outside ASCII letters, digits, and `_`.

This package does **not** add Unicode normalization, general whitespace splitting, transliteration, or automatic string coercion.

## Quality

- zero runtime dependencies
- ESM + CommonJS
- first-party TypeScript declarations
- differential tests against toidentifier@1.0.1
- deterministic 2,500-input differential corpus
- deterministic 10,000-input local behavior corpus
- Node 18/20/22/24/26 CI
- Linux, Windows, macOS ARM64, and macOS Intel smoke-test coverage

```sh
npm install
npm run check
npm run pack:check
```

## License

MIT
