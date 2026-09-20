import assert from 'node:assert/strict'
import test from 'node:test'
import { createRequire } from 'node:module'
import toIdentifier, { toIdentifier as named } from '../dist/index.js'

const require = createRequire(import.meta.url)

const cases = [
  ['Bad Request', 'BadRequest'],
  ['hello world', 'HelloWorld'],
  ['hello', 'Hello'],
  ['', ''],
  ['hello  world', 'HelloWorld'],
  [' hello ', 'Hello'],
  ['hello\tworld', 'Helloworld'],
  ['hello\nworld', 'Helloworld'],
  ['hello-world', 'Helloworld'],
  ['hello.world', 'Helloworld'],
  ['404 not found', '404NotFound'],
  ['hello_world', 'Hello_world'],
  ['café', 'Caf'],
  ['你好 world', 'World'],
]

for (const [input, expected] of cases) {
  test(`converts ${JSON.stringify(input)} to ${JSON.stringify(expected)}`, () => {
    assert.equal(toIdentifier(input), expected)
  })
}

test('named and default exports reference the same function', () => {
  assert.equal(toIdentifier, named)
})

test('function exposes expected arity and name', () => {
  assert.equal(toIdentifier.length, 1)
  assert.equal(toIdentifier.name, 'toIdentifier')
})

test('CommonJS export is a callable legacy-style function', () => {
  const cjs = require('../dist/index.cjs')
  assert.equal(typeof cjs, 'function')
  assert.equal(cjs('Bad Request'), 'BadRequest')
  assert.equal(Object.keys(cjs), [])
})
