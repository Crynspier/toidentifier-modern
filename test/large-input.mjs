import assert from 'node:assert/strict'
import test from 'node:test'
import { createRequire } from 'node:module'
import toIdentifier from '../dist/index.js'

const require = createRequire(import.meta.url)
const legacy = require('toidentifier')

for (const size of [1024, 64 * 1024, 1024 * 1024]) {
  test(`matches legacy for a ${size}-byte input`, () => {
    const input = ('Alpha beta-γ 😀 ' ).repeat(Math.ceil(size / 18)).slice(0, size)
    assert.equal(toIdentifier(input), legacy(input))
  })
}
