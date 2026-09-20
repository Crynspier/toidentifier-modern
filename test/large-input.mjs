import assert from 'node:assert/strict'
import test from 'node:test'
import toIdentifier, { isValidIdentifier } from '../dist/index.js'

for (const size of [1024, 64 * 1024, 1024 * 1024]) {
  test('produces a valid identifier for a ' + size + '-unit input', () => {
    const input = ('Alpha beta-γ 😀 HTTPServer 123 value ').repeat(Math.ceil(size / 32)).slice(0, size)
    const output = toIdentifier(input)
    assert.equal(isValidIdentifier(output), true)
  })
}

test('handles pathological leading combining marks linearly', () => {
  const input = '\u0301'.repeat(100_000) + 'foo'
  const output = toIdentifier(input)

  assert.equal(output, 'Foo')
  assert.equal(isValidIdentifier(output), true)
})
