import assert from 'node:assert/strict'
import test from 'node:test'
import toIdentifier from '../dist/index.js'

function reference(str) {
  return str
    .split(' ')
    .map((token) => token.slice(0, 1).toUpperCase() + token.slice(1))
    .join('')
    .replace(/[^ _0-9a-z]/gi, '')
}

function deterministicStrings(count) {
  let state = 0x9e3779b9
  const alphabet = ' abcXYZ012_-.@/\\\\\\t\\n😀éß你好'
  const result = []

  for (let i = 0; i < count; i += 1) {
    let value = ''
    const length = 1 + (state % 32)

    for (let j = 0; j < length; j += 1) {
      state = (state * 1103515245 + 12345) >>> 0
      value += alphabet[state % alphabet.length]
    }

    result.push(value)
  }

  return result
}

test('local reference model agrees across 10000 deterministic inputs', () => {
  for (const input of deterministicStrings(10000)) {
    assert.equal(toIdentifier(input), reference(input), JSON.stringify(input))
  }
})
