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

function isValidModuleBinding(candidate) {
  return ![
    'await',
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'debugger',
    'default',
    'delete',
    'do',
    'else',
    'enum',
    'export',
    'extends',
    'false',
    'finally',
    'for',
    'function',
    'if',
    'import',
    'in',
    'instanceof',
    'let',
    'new',
    'null',
    'return',
    'super',
    'switch',
    'this',
    'throw',
    'true',
    'try',
    'typeof',
    'var',
    'void',
    'while',
    'with',
    'yield',
    'static',
    'implements',
    'interface',
    'package',
    'private',
    'protected',
    'public',
    'arguments',
    'eval',
  ].includes(candidate)
}

const explicitValid = [
  'foo',
  '_foo',
  '$foo',
  '$',
  '_',
  '你好',
  'é',
  'foo\\u0301',
  'foo\\u200Cbar',
  'foo\\u200Dbar',
  'foo\\u200C',
  'foo\\u200D',
  'a\\u0301\\u0323',
  '𝔘𝔫𝔦𝔠𝔬𝔡𝔢',
]

const explicitInvalid = [
  '',
  '1foo',
  '123',
  'foo-bar',
  'foo.bar',
  'foo\\u200Bbar',
  '\\u0301foo',
  '\\u200Cfoo',
  '\\u200Dfoo',
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

test('isValidIdentifier agrees with the module reserved-word contract', () => {
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
    assert.equal(isValidIdentifier(candidate), false, JSON.stringify(candidate))
    assert.equal(isValidModuleBinding(candidate), false, JSON.stringify(candidate))
  }
})

test('isValidIdentifier agrees with the JavaScript parser across a structured candidate corpus', () => {
  const alphabet = ['a', 'A', '0', '_', '$', '-', '.', 'é', '你', '\\u0301', '\\u200B', '\\u200C', '\\u200D']
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
