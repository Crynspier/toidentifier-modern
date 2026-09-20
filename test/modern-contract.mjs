import assert from 'node:assert/strict'
import test from 'node:test'
import toIdentifier, { isValidIdentifier } from '../dist/index.js'

const conversions = [
  ['hello-world', 'HelloWorld'],
  ['hello_world', 'HelloWorld'],
  ['foo.bar/baz::qux', 'FooBarBazQux'],
  ['foo—bar…baz', 'FooBarBaz'],
  ['---foo---', 'Foo'],
  ['foo---bar', 'FooBar'],
  ['foo\tbar\nbar', 'FooBarBar'],
  ['foo\r\nbar', 'FooBar'],
  ['foo\u00a0bar\u2003baz', 'FooBarBaz'],
  ['XMLHttpRequest', 'XmlHttpRequest'],
  ['HTTPServer', 'HttpServer'],
  ['JSONParser', 'JsonParser'],
  ['XMLHTTP', 'Xmlhttp'],
  ['ABCDef', 'AbcDef'],
  ['fooBAR', 'FooBar'],
  ['hello你好', 'Hello你好'],
  ['你好world', '你好World'],
  ['مرحبا world', 'مرحباWorld'],
  ['שלום world', 'שלוםWorld'],
  ['Москва world', 'МоскваWorld'],
  ['e\u0301 test', 'ÉTest'],
  ['𝔘𝔫𝔦𝔠𝔬𝔡𝔢 test', 'UnicodeTest'],
  ['ß', 'SS'],
  ['İstanbul', 'I\u0307stanbul'],
  ['!!!', '_'],
  ['///', '_'],
  ['💩', '_'],
  ['   ', '_'],
  ['123', '_123'],
  ['404 not found', '_404NotFound'],
  ['123abc', '_123Abc'],
  ['١٢٣', '_١٢٣'],
  ['$value', '$Value'],
  ['foo$bar', 'Foo$Bar'],
  ['foo\u200Cbar', 'Foo\u200Cbar'],
  ['foo\u200Dbar', 'Foo\u200Dbar'],
  ['\u200Cfoo', 'Foo'],
  ['foo\u200C', 'Foo\u200C'],
]

for (const [input, expected] of conversions) {
  test('modern conversion ' + JSON.stringify(input), () => {
    assert.equal(toIdentifier(input), expected)
    assert.equal(isValidIdentifier(expected), true)
  })
}

test('camelCase uses lowercase first word and PascalCase remaining words', () => {
  assert.equal(toIdentifier('hello world', { style: 'camel' }), 'helloWorld')
  assert.equal(toIdentifier('HelloWorld', { style: 'camel' }), 'helloWorld')
  assert.equal(toIdentifier('404 not found', { style: 'camel' }), '_404NotFound')
  assert.equal(toIdentifier('Hello', { style: 'camel' }), 'hello')
})

test('default options are PascalCase with normalization enabled', () => {
  assert.equal(toIdentifier('hello world'), 'HelloWorld')
  assert.equal(toIdentifier('Ｈｅｌｌｏ　ｗｏｒｌｄ'), 'HelloWorld')
})

test('normalization can be disabled', () => {
  assert.equal(toIdentifier('Ｈｅｌｌｏ', { normalize: false }), 'Ｈｅｌｌｏ')
  assert.equal(toIdentifier('e\u0301 test', { normalize: false }), 'E\u0301Test')
})

test('runtime validation rejects invalid input and options', () => {
  assert.throws(() => toIdentifier(123), /input must be a string/)
  assert.throws(() => toIdentifier(null), /input must be a string/)
  assert.throws(() => toIdentifier('x', null), /options must be an object/)
  assert.throws(() => toIdentifier('x', []), /options must be an object/)
  assert.throws(() => toIdentifier('x', { style: 'wat' }), /style must be "pascal" or "camel"/)
  assert.throws(() => toIdentifier('x', { style: null }), /style must be "pascal" or "camel"/)
  assert.throws(() => toIdentifier('x', { normalize: 'yes' }), /normalize must be a boolean/)
  assert.throws(() => toIdentifier('x', { normalize: null }), /normalize must be a boolean/)
})

test('reserved and strict-sensitive words are never returned as binding identifiers', () => {
  const words = [
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

  for (const word of words) {
    const output = toIdentifier(word)
    assert.notEqual(output, word)
    assert.equal(isValidIdentifier(output), true)
  }
})

test('NFKC collisions are deterministic and documented as possible', () => {
  assert.equal(toIdentifier('①'), toIdentifier('1'))
  assert.equal(toIdentifier('Å'), toIdentifier('Å'))
  assert.equal(toIdentifier('ﬁ'), toIdentifier('fi'))
  assert.equal(toIdentifier('Ｈｅｌｌｏ'), toIdentifier('Hello'))
})

test('isValidIdentifier accepts Unicode identifier continuation marks but not zero-width space', () => {
  assert.equal(isValidIdentifier('foo\u200Cbar'), true)
  assert.equal(isValidIdentifier('foo\u200Dbar'), true)
  assert.equal(isValidIdentifier('foo\u0301'), true)
  assert.equal(isValidIdentifier('foo\u200Bbar'), false)
})

test('modern output is non-unique by design', () => {
  assert.equal(toIdentifier('hello-world'), toIdentifier('hello_world'))
  assert.equal(toIdentifier('hello world'), toIdentifier('hello.world'))
})
