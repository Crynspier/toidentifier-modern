# Migrating from 0.1.x to 0.2.x

Version 0.2.0 is intentionally a semantic breaking release.

## The important change

In 0.1.x, the default export reproduced the published `toidentifier@1.0.1` transformation.

In 0.2.x, the default export is the modern converter and guarantees a valid JavaScript binding identifier.

| Input | 0.1.x | 0.2.x |
| --- | --- | --- |
| `hello-world` | `Helloworld` | `HelloWorld` |
| `hello_world` | `Hello_world` | `HelloWorld` |
| `hello\tworld` | `Helloworld` | `HelloWorld` |
| `café` | `Caf` | `Café` |
| `你好 world` | `World` | `你好World` |
| `404 not found` | `404NotFound` | `_404NotFound` |

## Keeping exact legacy behavior

Use the named compatibility helper:

```js
import { toIdentifierLegacy } from 'toidentifier-modern'

toIdentifierLegacy(input)
```

The helper is maintained as a differential compatibility implementation against `toidentifier@1.0.1`.

## Migration choice

- Stay on `0.1.1` if you require the old default output.
- Move to `0.2.x` if you want the modern semantics.
- For gradual migration, import both functions and explicitly choose per call site.

Downstream systems that persist generated names should treat the change as a data/API migration, not a transparent patch update.

## Collision note

Different source strings can still produce the same modern identifier. Do not use the converter as a uniqueness mechanism.
