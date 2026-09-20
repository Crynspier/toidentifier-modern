import assert from 'node:assert/strict'
import test from 'node:test'
import { isValidIdentifier } from '../dist/index.js'

function parsesStrictBinding(candidate) {
  try {
    new Function('"use strict"; let ' + candidate + ' = 1')
    return true
  } catch {
    return false
  }
}

const explicitValid = [
  'foo',
  '_foo',
  '$foo',
  '$',
  '_',
  '你好',
  'é',
  'foó',
  'foo‌bar',
  'foo‍bar',
  'foo‌',
  'foo‍',
  'ạ́',
  '𝔘𝔫𝔦𝔠𝔬𝔡𝔢',
]

const explicitInvalid = [
  '',
  '1foo',
  '123',
  'foo-bar',
  'foo.bar',
  'foo​bar',
  '́foo',
  '‌foo',
  '‍foo',
  '💩',
  'class',
  'yield',
  'arguments',
  'eval',
]

test('isValidIdentifier agrees with the strict JavaScript parser on explicit candidates', () => {
  for (const candidate of explicitValid) {
    assert.equal(parsesStrictBinding(candidate), true, JSON.stringify(candidate))
    assert.equal(isValidIdentifier(candidate), true, JSON.stringify(candidate))
  }

  for (const candidate of explicitInvalid) {
    assert.equal(parsesStrictBinding(candidate), false, JSON.stringify(candidate))
    assert.equal(isValidIdentifier(candidate), false, JSON.stringify(candidate))
  }
})

test('isValidIdentifier agrees with the module parser for reserved binding names', async () => {
  const moduleReserved = [
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
  ]

  for (const candidate of moduleReserved) {
    await assert.rejects(
      import('data:text/javascript,' + encodeURIComponent('const ' + candidate + ' = 1')),
      SyntaxError,
    )
    assert.equal(isValidIdentifier(candidate), false, JSON.stringify(candidate))
  }
})

test('isValidIdentifier agrees with the JavaScript parser across a structured candidate corpus', () => {
  const alphabet = ['a', 'A', '0', '_', '$', '-', '.', 'é', '你', '́', '​', '‌', '‍']
  const candidates = []

  const visit = (value, depth, maxDepth) => {
    if (depth > 0) candidates.push(value)
    if (depth === maxDepth) return

    for (const char of alphabet) {
      visit(value + char, depth + 1, maxDepth)
    }
  }

  visit('', 0, 3)

  for (const candidate of candidates) {
    assert.equal(
      isValidIdentifier(candidate),
      parsesStrictBinding(candidate),
      JSON.stringify(candidate),
    )
  }
})
