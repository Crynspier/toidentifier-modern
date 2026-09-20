import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const node = process.execPath
const tsc = resolve(root, 'node_modules', 'typescript', 'bin', 'tsc')

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  })

  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(' ')} failed (exit ${result.status}):\n${result.stdout}\n${result.stderr}`,
    )
  }

  return result.stdout
}

const packJson = run(npm, ['pack', '--json', '--ignore-scripts'])
const packResult = JSON.parse(packJson)[0]
assert.ok(packResult?.filename, 'npm pack did not return a tarball filename')

const requiredFiles = new Set([
  'package.json',
  'README.md',
  'COMPATIBILITY.md',
  'SECURITY.md',
  'LICENSE',
  'CHANGELOG.md',
  'dist/index.js',
  'dist/index.cjs',
  'dist/index.d.ts',
])

for (const file of requiredFiles) {
  assert.ok(packResult.files.some((entry) => entry.path === file), `missing packed file: ${file}`)
}

for (const file of packResult.files.map((entry) => entry.path)) {
  assert.equal(file.startsWith('test/'), false, `tests leaked into package: ${file}`)
  assert.equal(file.startsWith('scripts/'), false, `scripts leaked into package: ${file}`)
  assert.equal(file.startsWith('.github/'), false, `CI files leaked into package: ${file}`)
  assert.equal(file.startsWith('node_modules/'), false, `node_modules leaked into package: ${file}`)
}

const consumer = await mkdtemp(resolve(root, '.tmp-packed-consumer-'))
const tarball = resolve(root, packResult.filename)

try {
  await writeFile(
    resolve(consumer, 'package.json'),
    JSON.stringify({
      name: 'packed-consumer',
      private: true,
      type: 'module',
    }, null, 2) + '\n',
  )

  run(npm, ['install', tarball, '--ignore-scripts', '--package-lock=false'], { cwd: consumer })

  await writeFile(
    resolve(consumer, 'esm-test.mjs'),
    `import assert from 'node:assert/strict'
import toIdentifier, { toIdentifier as named } from 'toidentifier-modern'

assert.equal(toIdentifier, named)
assert.equal(toIdentifier('Bad Request'), 'BadRequest')
`,
  )

  await writeFile(
    resolve(consumer, 'cjs-test.cjs'),
    `const assert = require('node:assert/strict')
const toIdentifier = require('toidentifier-modern')

assert.equal(typeof toIdentifier, 'function')
assert.equal(Object.keys(toIdentifier).length, 0)
assert.equal(toIdentifier('Bad Request'), 'BadRequest')
`,
  )

  await writeFile(
    resolve(consumer, 'types.ts'),
    `import toIdentifier, { toIdentifier as named } from 'toidentifier-modern'

const a: string = toIdentifier('Bad Request')
const b: string = named('Bad Request')

void a
void b
`,
  )

  await writeFile(resolve(consumer, 'tsconfig.json'), tsconfigConsumer)\n\n  run(node, [resolve(consumer, 'esm-test.mjs')], { cwd: consumer })
  run(node, [resolve(consumer, 'cjs-test.cjs')], { cwd: consumer })
  run(node, [tsc, '--project', resolve(consumer, 'tsconfig.json')], { cwd: consumer })

  const installedPackageJson = JSON.parse(
    await readFile(resolve(consumer, 'node_modules', 'toidentifier-modern', 'package.json'), 'utf8'),
  )
  assert.equal(installedPackageJson.version, packResult.version)
  assert.equal(installedPackageJson.version, '0.1.1')
} finally {
  await rm(tarball, { force: true })
  await rm(consumer, { recursive: true, force: true })
}
