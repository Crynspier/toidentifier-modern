import assert from 'node:assert/strict'
import test from 'node:test'
import { isValidIdentifier } from '../dist/index.js'

function parsesStrictBinding(candidate) {
  try {
    new Function('\"use strict\"; let ' + candidate + ' = 1')
    return true
  } catch {
    return false
  }
}

function deterministicCandidates(count) {
  let state = 0x6d2b79f5
  const alphabet =
    'abcXYZ012_$-@.' +
    'éß你好ΑБЖمرحباשלום' +
    '\u0301\u200B\u200C\u200D😀'
  const result = []

  for (let i = 0; i < count; i += 1) {
    let value = ''
    const length = 1 + (state % 12)

    for (let j = 0; j < length; j += 1) {
      state = (state * 1664525 + 1013904223) >>> 0
      value += alphabet[state % alphabet.length]
    }

    result.push(value)
  }

  return result
}

test('isValidIdentifier matches the JavaScript strict-binding parser across 5000 candidates', () => {
  for (const candidate of deterministicCandidates(5000)) {
    // "await" is legal in a strict-script binding but reserved in modules;
    // module-specific coverage is exercised separately below.
    if (candidate === 'await') continue

    assert.equal(
      isValidIdentifier(candidate),
      parsesStrictBinding(candidate),
      JSON.stringify(candidate),
    )
  }
})

test('strict-binding parser oracle accepts representative Unicode and identifier edge cases', () => {
  for (const candidate of [
    'foo',
    '_foo',
    '$foo',
    '你好',
    'foo\u200Cbar',
    'foo\u200Dbar',
    'foo\u0301',
    '𝔘𝔫𝔦𝔠𝔬𝔡𝔢',
  ]) {
    assert.equal(parsesStrictBinding(candidate), true, candidate)
    assert.equal(isValidIdentifier(candidate), true, candidate)
  }
})

test('module parser rejects module-reserved binding names', async () => {
  for (const candidate of [
    'await',
    'yield',
    'class',
    'function',
    'return',
    'let',
    'static',
    'implements',
    'interface',
    'package',
    'private',
    'protected',
    'public',
    'arguments',
    'eval',
  ]) {
    const source = 'const ' + candidate + ' = 1'
    await assert.rejects(
      import('data:text/javascript,' + encodeURIComponent(source)),
      SyntaxError,
    )
    assert.equal(isValidIdentifier(candidate), false, candidate)
  }
})

test('module parser accepts representative safe bindings', async () => {
  for (const candidate of ['foo', '_foo', '$foo', '你好', 'foo\u200Cbar', 'foo\u200Dbar']) {
    const source = 'const ' + candidate + ' = 1'
    await assert.doesNotReject(import('data:text/javascript,' + encodeURIComponent(source)))
    assert.equal(isValidIdentifier(candidate), true, candidate)
  }
})
