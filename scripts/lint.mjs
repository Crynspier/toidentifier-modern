import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const files = [
  'scripts/build.mjs',
  'scripts/clean.mjs',
  'scripts/lint.mjs',
  'test/basic.mjs',
  'test/differential.mjs',
  'test/fuzz.mjs',
  'test/large-input.mjs',
  'test/validator-oracle.mjs',
  'test/packed-package.mjs',
]

for (const relative of files) {
  const content = await readFile(resolve(relative), 'utf8')
  if (content.includes('\r\n')) {
    throw new Error(`CRLF line endings detected in ${relative}`)
  }
}

console.log(`format check passed for ${files.length} JavaScript files`)
