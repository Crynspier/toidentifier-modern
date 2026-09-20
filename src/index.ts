const IDENTIFIER_START = /^\p{ID_Start}$/u
const IDENTIFIER_CONTINUE = /^\p{ID_Continue}$/u
const DECIMAL_NUMBER = /^\p{Decimal_Number}$/u
const LOWERCASE_LETTER = /^\p{Lowercase_Letter}$/u
const UPPERCASE_LETTER = /^\p{Uppercase_Letter}$/u

const RESERVED_WORDS = new Set([
  'await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger',
  'default', 'delete', 'do', 'else', 'enum', 'export', 'extends', 'false',
  'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'new',
  'null', 'return', 'super', 'switch', 'this', 'throw', 'true', 'try',
  'typeof', 'var', 'void', 'while', 'with', 'yield', 'let', 'static',
  'implements', 'interface', 'package', 'private', 'protected', 'public',
  'arguments', 'eval',
])

export type IdentifierStyle = 'pascal' | 'camel'

export interface ToIdentifierOptions {
  style?: IdentifierStyle
  normalize?: boolean
}

function isIdentifierStartChar(char: string): boolean {
  return char === '$' || char === '_' || IDENTIFIER_START.test(char)
}

function isIdentifierContinueChar(char: string): boolean {
  return char === '$' || IDENTIFIER_CONTINUE.test(char)
}

function isDecimalNumber(char: string): boolean {
  return DECIMAL_NUMBER.test(char)
}

function isLowercaseLetter(char: string): boolean {
  return LOWERCASE_LETTER.test(char)
}

function isUppercaseLetter(char: string): boolean {
  return UPPERCASE_LETTER.test(char)
}

function isCasedLetter(char: string): boolean {
  return isLowercaseLetter(char) || isUppercaseLetter(char)
}

function shouldSplitBoundary(previous: string, current: string, next?: string): boolean {
  if (isLowercaseLetter(previous) && isUppercaseLetter(current)) {
    return true
  }

  if (
    isUppercaseLetter(previous) &&
    isUppercaseLetter(current) &&
    next !== undefined &&
    isLowercaseLetter(next)
  ) {
    return true
  }

  if (
    isIdentifierStartChar(previous) &&
    isIdentifierStartChar(current) &&
    isCasedLetter(previous) !== isCasedLetter(current)
  ) {
    return true
  }

  return false
}

function splitWords(input: string): string[] {
  const words: string[] = []
  let current: string[] = []

  const flush = () => {
    if (current.length > 0) {
      words.push(current.join(''))
      current = []
    }
  }

  const chars = Array.from(input)

  for (let index = 0; index < chars.length; index += 1) {
    const char = chars[index]

    if (char === '_' || !isIdentifierContinueChar(char)) {
      flush()
      continue
    }

    if (char === '$' && current.length > 0) {
      flush()
      current.push(char)
      continue
    }

    const previous = current[current.length - 1]
    const next = chars[index + 1]

    if (previous !== undefined && shouldSplitBoundary(previous, char, next)) {
      flush()
    }

    current.push(char)
  }

  flush()
  return words
}

function trimLeadingNonStarts(word: string): string {
  const chars = Array.from(word)

  while (chars.length > 0) {
    const first = chars[0]

    if (first === '$' || isIdentifierStartChar(first) || isDecimalNumber(first)) {
      return chars.join('')
    }

    chars.shift()
  }

  return ''
}

function capitalizeWord(word: string): string {
  const chars = Array.from(word.toLowerCase())

  for (let index = 0; index < chars.length; index += 1) {
    const char = chars[index]

    if (char === '$' || isDecimalNumber(char)) {
      continue
    }

    if (IDENTIFIER_START.test(char)) {
      chars[index] = char.toUpperCase()
      break
    }
  }

  return chars.join('')
}

function transformWords(words: string[], style: IdentifierStyle): string {
  return words
    .map(trimLeadingNonStarts)
    .filter(Boolean)
    .map((word, index) => {
      const normalized = word.toLowerCase()

      if (style === 'camel' && index === 0) {
        return normalized
      }

      return capitalizeWord(normalized)
    })
    .join('')
}

function makeValidIdentifier(value: string): string {
  if (value.length === 0) {
    return '_'
  }

  const first = Array.from(value)[0]

  if (!isIdentifierStartChar(first) || RESERVED_WORDS.has(value)) {
    return '_' + value
  }

  return value
}

export function toIdentifier(
  input: string,
  options: ToIdentifierOptions = {},
): string {
  const style = options.style ?? 'pascal'
  const normalized = options.normalize === false ? input : input.normalize('NFKC')
  const transformed = transformWords(splitWords(normalized), style)

  return makeValidIdentifier(transformed)
}

export function isValidIdentifier(value: string): boolean {
  if (typeof value !== 'string' || value.length === 0) {
    return false
  }

  const chars = Array.from(value)

  if (!isIdentifierStartChar(chars[0]) || RESERVED_WORDS.has(value)) {
    return false
  }

  for (let index = 1; index < chars.length; index += 1) {
    if (!isIdentifierContinueChar(chars[index])) {
      return false
    }
  }

  return true
}

export function toIdentifierLegacy(str: string): string {
  return str
    .split(' ')
    .map((token) => token.slice(0, 1).toUpperCase() + token.slice(1))
    .join('')
    .replace(/[^ _0-9a-z]/gi, '')
}

export default toIdentifier
