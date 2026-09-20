/**
 * Convert a string of space-separated words into the identifier form used by
 * the original `toidentifier@1.0.1` package.
 *
 * Compatibility is intentional: only literal U+0020 spaces separate words,
 * the first character of every resulting token is uppercased, tokens are
 * concatenated, and characters outside ASCII letters, digits, and `_` are
 * removed.
 */
export function toIdentifier(str: string): string {
  return str
    .split(' ')
    .map((token) => token.slice(0, 1).toUpperCase() + token.slice(1))
    .join('')
    .replace(/[^ _0-9a-z]/gi, '')
}

export default toIdentifier
