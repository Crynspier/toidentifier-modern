import assert from 'node:assert/strict'
import test from 'node:test'
import { createRequire } from 'node:module'
import toIdentifier, { isValidIdentifier, toIdentifierLegacy } from '../dist/index.js'

const require = createRequire(import.meta.url)

const cases = [
  ['hello world', 'HelloWorld'],
  ['hello-world', 'HelloWorld'],
  ['hello_world', 'HelloWorld'],
  ['hello\tworld', 'HelloWorld'],
  ['hello\nworld', 'HelloWorld'],
  ['foo.bar_baz-qux', 'FooBarBazQux'],
  ['camelCase', 'CamelCase'],
  ['XMLHttpRequest', 'XmlHttpRequest'],
  ['fooBARBaz', 'FooBarBaz'],
  ['404 not found', '_404NotFound'],
  ['café crème', 'CaféCrème'],
  ['你好 world', '你好World'],
  ['你好World', '你好World'],
  ['e\u0301 test', 'ÉTest'],
  ['Ｈｅｌｌｏ　ｗｏｒｌｄ', 'HelloWorld'],
  ['𝔘𝔫𝔦𝔠𝔬𝔡𝔢 test', 'UnicodeTest'],
  ['!!!', '_'],
  ['', '_'],
  ['$value', '$Value'],
  ['foo$bar', 'Foo$Bar'],
]

for (const [input, expected] of cases) {
  test('converts ' + JSON.stringify(input) + ' to ' + JSON.stringify(expected), () => {
    const result = toIdentifier(input)
    assert.equal(result, expected)
    assert.equal(isValidIdentifier(result), true)
  })
}

test('camel style produces lower camelCase', () => {
  assert.equal(toIdentifier('hello world', { style: 'camel' }), 'helloWorld')
  assert.equal(toIdentifier('HelloWorld', { style: 'camel' }), 'helloWorld')
  assert.equal(toIdentifier('class', { style: 'camel' }), '_class')
})

test('normalization can be disabled', () => {
  assert.equal(toIdentifier('Ｈｅｌｌｏ', { normalize: false }), 'Ｈｅｌｌｏ')
  assert.equal(toIdentifier('Ｈｅｌｌｏ'), 'Hello')
})

test('identifier validation follows binding-identifier rules', () => {
  for (const value of ['foo', '_foo', '$foo', '你好', 'FooBar']) {
    assert.equal(isValidIdentifier(value), true, value)
  }

  for (const value of ['', '404foo', 'class', 'await', 'yield', 'eval', 'arguments', 'foo-bar']) {
    assert.equal(isValidIdentifier(value), false, value)
  }
})

test('modern output compiles as a strict binding', () => {
  for (const value of ['HelloWorld', '_404NotFound', 'Café', '你好World', '$Value']) {
    assert.doesNotThrow(() => new Function('"use strict"; let ' + value + ' = 1'))
  }
})

test('modern default intentionally differs from legacy behavior', () => {
  assert.notEqual(toIdentifier('hello-world'), toIdentifierLegacy('hello-world'))
  assert.notEqual(toIdentifier('404 not found'), toIdentifierLegacy('404 not found'))
  assert.notEqual(toIdentifier('café'), toIdentifierLegacy('café'))
})

test('legacy helper retains the old behavior', () => {
  assert.equal(toIdentifierLegacy('hello-world'), 'Helloworld')
  assert.equal(toIdentifierLegacy('404 not found'), '404NotFound')
})

test('CommonJS export is a callable modern function', () => {
  const cjs = require('../dist/index.cjs')
  assert.equal(typeof cjs, 'function')
  assert.equal(cjs('hello-world'), 'HelloWorld')
  assert.equal(cjs.toIdentifier('hello-world'), 'HelloWorld')
  assert.equal(cjs.toIdentifierLegacy('hello-world'), 'Helloworld')
  assert.equal(cjs.isValidIdentifier('_404NotFound'), true)
  assert.equal(Object.keys(cjs).length, 0)
})
