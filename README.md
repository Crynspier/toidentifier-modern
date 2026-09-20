# toidentifier-modern

[![CI](https://github.com/Crynspier/toidentifier-modern/actions/workflows/ci.yml/badge.svg)](https://github.com/Crynspier/toidentifier-modern/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/toidentifier-modern)](https://www.npmjs.com/package/toidentifier-modern)

**A tiny, dependency-free, TypeScript-first modernization of the toidentifier@1.0.1 API.**

`toidentifier-modern` preserves the established string-transformation behavior while adding modern ESM/CommonJS packaging and first-party TypeScript declarations.

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

CommonJS remains a callable single-function export:

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

The compatibility target is the published `toidentifier@1.0.1` package. The differential suite runs against the installed reference package on explicit edge cases and a deterministic 5,000-input Unicode corpus.

The legacy behavior is intentionally preserved:

1. Split words only on literal U+0020 spaces.
2. Uppercase the first character of each token.
3. Concatenate the tokens.
4. Remove characters outside ASCII letters, digits, and `_`.

This package does **not** add Unicode normalization, general whitespace splitting, transliteration, or automatic string coercion.

## Compatibility boundary

`toidentifier-modern` aims for behavior compatibility, not byte-for-byte package compatibility.

- **Behavior:** targets `toidentifier@1.0.1` behavior.
- **CommonJS:** the package root remains a callable function, matching the legacy usage pattern.
- **ESM:** default and named ESM exports are additions.
- **Types:** first-party TypeScript declarations are additions.
- **Node:** support is explicitly `>=18`, unlike the legacy package's much older declared engine range.
- **Deep imports:** only the package root is exported; undocumented filesystem/deep imports are not part of the compatibility contract.
- **Identifier validity:** output preserves the legacy transformation and is not guaranteed to satisfy ECMAScript identifier grammar. For example, `"404 not found"` becomes `"404NotFound"`.

## Quality

- zero runtime dependencies
- ESM + CommonJS
- first-party TypeScript declarations
- differential tests against toidentifier@1.0.1
- deterministic 5,000-input Unicode differential corpus
- deterministic 10,000-input local behavior corpus
- large-input differential regression coverage
- packed-tarball ESM, CommonJS, and TypeScript consumer tests
- Node 18/20/22/24/26 CI
- Linux, Windows, macOS ARM64, and macOS Intel smoke-test coverage

```sh
npm install
npm run check
npm run pack:check
```

## License

MIT
