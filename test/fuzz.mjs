import assert from 'node:assert/strict'
import test from 'node:test'
import toIdentifier, { isValidIdentifier } from '../dist/index.js'

function parsesStrictBinding(candidate) {
  try {
    new Function('"use strict"; let ' + candidate + ' = 1')
    return true
  } catch {
    return false
  }
}

function deterministicStrings(count) {
  let state = 0x9e3779b9
  const alphabet =
    ' abcXYZ012_-.@/$' +
    String.fromCharCode(92, 9, 10, 13) +
    '😀éß你好ΑБЖمرحباשלוםＡＢＣe\u0301\u200B𝔘'
  const result = []

  for (let i = 0; i < count; i += 1) {
    let value = ''
    const length = state % 48

    for (let j = 0; j < length; j += 1) {
      state = (state * 1103515245 + 12345) >>> 0
      value += alphabet[state % alphabet.length]
    }

    result.push(value)
  }

  return result
}

test('modern converter produces valid identifiers across 10000 deterministic inputs', () => {
  for (const input of deterministicStrings(10000)) {
    const output = toIdentifier(input)
    assert.equal(isValidIdentifier(output), true, JSON.stringify({ input, output }))
    assert.equal(parsesStrictBinding(output), true, JSON.stringify({ input, output }))
  }
})
