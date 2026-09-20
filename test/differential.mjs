import assert from 'node:assert/strict'
import test from 'node:test'
import { createRequire } from 'node:module'
import toIdentifier from '../dist/index.js'

const require = createRequire(import.meta.url)
const legacy = require('toidentifier')

const samples = [
  '',
  'hello',
  'Bad Request',
  'hello world',
  'hello  world',
  ' hello ',
  'hello\tworld',
  'hello\nworld',
  'hello\r\nworld',
  'hello-world',
  'hello.world',
  'hello/world',
  'hello@world',
  '404 not found',
  'v1 test',
  'hello_world',
  '_hello',
  'hello_',
  'café',
  'über test',
  '你好 world',
  '😀 hello',
  'ß test',
  'İ test',
  'A B C',
  'a1 b2 c3',
  '!!!',
  '   ',
]

function deterministicStrings(count) {
  let state = 0x12345678
  const alphabet = ' abcXYZ012_-.@/' + String.fromCharCode(92, 9, 10) + '😀éß你好'
  const result = []

  for (let i = 0; i < count; i += 1) {
    let value = ''
    const length = state % 24

    for (let j = 0; j < length; j += 1) {
      state = (state * 1664525 + 1013904223) >>> 0
      value += alphabet[state % alphabet.length]
    }

    result.push(value)
  }

  return result
}

for (const input of samples) {
  test(`matches legacy for ${JSON.stringify(input)}`, () => {
    assert.equal(toIdentifier(input), legacy(input))
  })
}

const fuzzInputs = deterministicStrings(2500)

test('matches legacy across deterministic 2500-input differential corpus', () => {
  for (const input of fuzzInputs) {
    assert.equal(toIdentifier(input), legacy(input), JSON.stringify(input))
  }
})

test('matches legacy runtime errors for a non-string input', () => {
  assert.throws(() => toIdentifier(123), (modernError) => {
    assert.throws(() => legacy(123), (legacyError) => {
      return modernError.constructor === legacyError.constructor
    })
    return true
  })
})
