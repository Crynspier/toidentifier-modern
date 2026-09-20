# toidentifier-modern

[![CI](https://github.com/Crynspier/toidentifier-modern/actions/workflows/ci.yml/badge.svg)](https://github.com/Crynspier/toidentifier-modern/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/toidentifier-modern)](https://www.npmjs.com/package/toidentifier-modern)

**A tiny, dependency-free, Unicode-aware JavaScript identifier converter with first-party TypeScript, ESM, and CommonJS support.**

The modern default produces a valid JavaScript binding identifier instead of merely reproducing the historical ASCII string transformation.

## Install

`npm install toidentifier-modern`

## Usage

```js
import toIdentifier, { isValidIdentifier } from 'toidentifier-modern'

toIdentifier('hello-world')
// => "HelloWorld"

toIdentifier('café crème')
// => "CaféCrème"

toIdentifier('404 not found')
// => "_404NotFound"

toIdentifier('Ｈｅｌｌｏ　ｗｏｒｌｄ')
// => "HelloWorld"

isValidIdentifier(toIdentifier('some input'))
// => true
```

CommonJS remains a callable package-root export:

```js
const toIdentifier = require('toidentifier-modern')

toIdentifier('hello-world')
// => "HelloWorld"
```

## Modern API

`toIdentifier(input, options?)` supports:

- `style: 'pascal' | 'camel'` — defaults to `'pascal'`.
- `normalize: boolean` — defaults to `true` and applies Unicode NFKC before tokenization.

The converter treats whitespace, punctuation, emoji, and underscores as word boundaries; recognizes lower-to-upper and acronym-to-word case boundaries; preserves Unicode identifier characters; and guarantees a strict/module-safe binding identifier. At runtime, the API requires a string input, an object of options, a supported `style`, and a boolean `normalize` value.

Examples:

```js
toIdentifier('hello world')
// => "HelloWorld"

toIdentifier('hello world', { style: 'camel' })
// => "helloWorld"

toIdentifier('XMLHttpRequest')
// => "XmlHttpRequest"

toIdentifier('foo.bar_baz-qux')
// => "FooBarBazQux"

toIdentifier('class', { style: 'camel' })
// => "_class"

toIdentifier('!!!')
// => "_"
```

No transliteration is performed: `你好 world` becomes `你好World`.

### Runtime validation

JavaScript callers receive deterministic `TypeError` exceptions for invalid runtime inputs:

```js
toIdentifier(123)
// TypeError: input must be a string

toIdentifier('hello', { style: 'wat' })
// TypeError: options.style must be "pascal" or "camel"

toIdentifier('hello', { normalize: 'yes' })
// TypeError: options.normalize must be a boolean
```

## Legacy compatibility

Version 0.1.x optimized for exact `toidentifier@1.0.1` behavior. Version 0.2.0 intentionally changes the default semantics.

Use `toIdentifierLegacy()` when exact historical behavior is required:

```js
import { toIdentifierLegacy } from 'toidentifier-modern'

toIdentifierLegacy('hello-world')
// => "Helloworld"

toIdentifierLegacy('404 not found')
// => "404NotFound"
```

## Why this is not just another case-conversion package

Generic casing libraries such as `camelcase` and `change-case` already cover broad text transformation. This package has a narrower correctness contract: the default result is a valid JavaScript binding identifier, while Unicode identifier characters are retained and the old `toidentifier` behavior remains available as an explicit migration API.

## Compatibility boundary

- **Modern default:** semantic modernization; legacy output is not promised.
- **Legacy helper:** targets `toidentifier@1.0.1` and is differentially tested against the published package.
- **CommonJS:** package-root `require()` remains callable.
- **ESM:** default and named exports are available.
- **Types:** first-party TypeScript declarations are shipped.
- **Node:** support is explicitly `>=18`.
- **Deep imports:** only the package root is public.

## Quality

- zero runtime dependencies
- Unicode-aware NFKC normalization
- valid JavaScript binding identifier guarantee
- PascalCase and camelCase modes
- exact legacy compatibility helper
- deterministic 10,000-input modern validity corpus
- parser-backed strict-binding verification across 5,000 generated candidates
- independent validator/parser differential coverage across a structured Unicode candidate corpus
- module-parser checks for reserved binding words
- adversarial Unicode, normalization, boundary, and collision coverage
- 5,000-input legacy differential corpus
- large-input validity coverage through 1 MiB
- packed-tarball ESM, CommonJS, and TypeScript consumer tests
- Node 18/20/22/24/26 CI
- Linux, Windows, macOS ARM64, and macOS Intel coverage

```sh
npm ci
npm run check
npm run pack:check
```

## License

MIT
