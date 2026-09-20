# Security Policy

## Supported versions

Only the latest published toidentifier-modern release is supported with security fixes.

## Identifier security

The modern converter is designed for syntactic validity, not spoofing resistance. NFKC normalization does not make visually confusable identifiers unique or safe against homoglyph attacks. Applications that expose generated identifiers across trust boundaries should apply their own policy for length, allowed scripts, uniqueness, and confusable detection.

The converter never evaluates input and has no runtime dependencies.

U+200C ZERO WIDTH NON-JOINER and U+200D ZERO WIDTH JOINER are valid identifier continuation characters and may be preserved in generated names. They are invisible characters; applications that require human-visible identifiers should consider rejecting them explicitly.

## Release integrity

The repository includes a release workflow intended for npm trusted publishing with GitHub Actions OIDC. Trusted publishing avoids long-lived npm publish tokens and enables npm provenance for public packages.

## Reporting a vulnerability

Please report security issues privately through GitHub's private vulnerability reporting for this repository rather than opening a public issue.
