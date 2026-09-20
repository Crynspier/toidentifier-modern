import assert from 'node:assert/strict'
import test from 'node:test'
import { createRequire } from 'node:module'
import { toIdentifierLegacy } from '../dist/index.js'

const require = createRequire(import.meta.url)
const legacy = require('toidentifier')

const samples = [
  '', 'hello', 'Bad Request', 'hello world', 'hello  world', ' hello ',
  'hello\tworld', 'hello\nworld', 'hello\r\nworld', 'hello-world',
  'hello.world', 'hello/world', 'hello@world', '404 not found', 'v1 test',
  'hello_world', '_hello', 'hello_', 'café', 'über test', '你好 world',
  '😀 hello', 'ß test', 'İ test', 'Αθήνα test', 'Москва test',
  'مرحبا world', 'שלום world', 'ＡＢＣ test', 'e\u0301 test',
  '𝔘𝔫𝔦𝔠𝔬𝔡𝔢 test', '\u200B hidden', '\u202E rtl', 'A B C',
  'a1 b2 c3', '!!!', '   ',
]

function deterministicStrings(count) {
  let state = 0x12345678
  const alphabet =
    ' abcXYZ012_-.@/' +
    String.fromCharCode(92, 9, 10, 13) +
    '😀éß你好ΑБЖمرحباשלוםＡＢＣe\u0301\u200B𝔘'
  const result = []

  for (let i = 0; i < count; i += 1) {
    let value = ''
    const length = state % 32

    for (let j = 0; j < length; j += 1) {
      state = (state * 1664525 + 1013904223) >>> 0
      value += alphabet[state % alphabet.length]
    }

    result.push(value)
  }

  return result
}

for (const input of samples) {
  test('legacy compatibility for ' + JSON.stringify(input), () => {
    assert.equal(toIdentifierLegacy(input), legacy(input))
  })
}

const differentialInputs = deterministicStrings(5000)

test('legacy helper matches published toidentifier@1.0.1 across 5000 deterministic inputs', () => {
  for (const input of differentialInputs) {
    assert.equal(toIdentifierLegacy(input), legacy(input), JSON.stringify(input))
  }
})

test('legacy helper preserves the legacy non-string runtime error', () => {
  assert.throws(() => toIdentifierLegacy(123), (modernError) => {
    assert.throws(() => legacy(123), (legacyError) => modernError.constructor === legacyError.constructor)
    return true
  })
})
