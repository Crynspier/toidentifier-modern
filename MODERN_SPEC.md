# Modern identifier specification

Version 0.2.x defines the modern semantics of `toIdentifier()`.

## Goal

Convert arbitrary text into a deterministic, readable JavaScript binding identifier while preserving useful Unicode characters and avoiding the historical package's invalid-output edge cases.

## Pipeline

1. Normalize with Unicode NFKC unless `normalize: false` is passed.
2. Treat whitespace, punctuation, emoji, and underscore as word boundaries.
3. Treat `$` as an identifier-aware boundary marker, so `foo$bar` becomes `Foo$Bar`.
4. Split internal case boundaries:
   - lowercase letter followed by uppercase letter;
   - uppercase acronym followed by a capitalized word;
   - boundaries between cased and uncased identifier scripts.
5. Lowercase each word with JavaScript's Unicode-aware `toLowerCase()`.
6. For PascalCase, uppercase the first letter-like character of each word. For camelCase, lowercase the first word and PascalCase the remaining words.
7. Preserve valid Unicode identifier characters and combining marks.
8. If the result is empty, return `_`.
9. If the result begins with an invalid start character, prefix `_`.
10. If the result is reserved or forbidden as a strict/module binding identifier, prefix `_`.

## Validity contract

`isValidIdentifier()` checks JavaScript binding-identifier safety using Unicode identifier properties plus modern strict/module restrictions relevant to variable bindings.

The implementation validates the actual string value and does not treat Unicode escape spellings as a separate identifier representation. The validator is regression-tested against the JavaScript parser for thousands of generated candidates, with additional module-parser checks for module-reserved binding names.

The converter does not promise idempotence: concatenating separate single-letter words can create a different case-boundary interpretation on a subsequent pass.

## Runtime contract

- `input` must be a string.
- `options`, when provided, must be a non-null object and not an array.
- `style` may be `pascal` or `camel`; omitted means `pascal`.
- `normalize` may be boolean; omitted means `true`.
- Invalid runtime values throw `TypeError`.

## Normalization and collisions

NFKC normalization can intentionally collapse distinct source strings to the same modern identifier. For example, `①` and `1`, `Å` and `Å`, `ﬁ` and `fi`, and fullwidth versus ASCII forms can produce identical results. The converter is deterministic, but it is not a uniqueness mechanism.

## Invisible identifier continuation characters

U+200C ZERO WIDTH NON-JOINER and U+200D ZERO WIDTH JOINER are valid JavaScript identifier continuation characters. The converter may preserve them when they occur inside or at the end of an input word; leading occurrences are removed because they cannot start a binding identifier. Applications with a visible-only identifier policy should reject or sanitize them separately.

## Examples

| Input | Modern default | Legacy |
| --- | --- | --- |
| `hello world` | `HelloWorld` | `HelloWorld` |
| `hello-world` | `HelloWorld` | `Helloworld` |
| `hello_world` | `HelloWorld` | `Hello_world` |
| `hello\tworld` | `HelloWorld` | `Helloworld` |
| `café` | `Café` | `Caf` |
| `你好 world` | `你好World` | `World` |
| `404 not found` | `_404NotFound` | `404NotFound` |
| `Ｈｅｌｌｏ　ｗｏｒｌｄ` | `HelloWorld` | empty string |
| `XMLHttpRequest` | `XmlHttpRequest` | `XMLHttpRequest` |
| `!!!` | `_` | empty string |
