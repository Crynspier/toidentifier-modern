import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const node = process.execPath
const npmCli = process.env.npm_execpath
const tsc = resolve(root, 'node_modules', 'typescript', 'bin', 'tsc')

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  })

  if (result.status !== 0) {
    const error = result.error ? '\n' + result.error.message : ''
    throw new Error(
      command + ' ' + args.join(' ') + ' failed (exit ' + result.status + '):' + error + '\n' + result.stdout + '\n' + result.stderr,
    )
  }

  return result.stdout
}

function runNpm(args, options = {}) {
  if (!npmCli) {
    throw new Error('npm_execpath is unavailable; run this test through npm so the npm CLI can be invoked portably.')
  }

  return run(node, [npmCli, ...args], options)
}

const packJson = runNpm(['pack', '--json', '--ignore-scripts'])
const packResult = JSON.parse(packJson)[0]
assert.ok(packResult?.filename, 'npm pack did not return a tarball filename')

const requiredFiles = new Set([
  'package.json',
  'README.md',
  'COMPATIBILITY.md',
  'MIGRATION.md',
  'MODERN_SPEC.md',
  'SECURITY.md',
  'LICENSE',
  'CHANGELOG.md',
  'dist/index.js',
  'dist/index.cjs',
  'dist/index.d.ts',
])

for (const file of requiredFiles) {
  assert.ok(packResult.files.some((entry) => entry.path === file), 'missing packed file: ' + file)
}

for (const file of packResult.files.map((entry) => entry.path)) {
  assert.equal(file.startsWith('test/'), false, 'tests leaked into package: ' + file)
  assert.equal(file.startsWith('scripts/'), false, 'scripts leaked into package: ' + file)
  assert.equal(file.startsWith('.github/'), false, 'CI files leaked into package: ' + file)
  assert.equal(file.startsWith('node_modules/'), false, 'node_modules leaked into package: ' + file)
}

const consumer = await mkdtemp(resolve(root, '.tmp-packed-consumer-'))
const tarball = resolve(root, packResult.filename)

const tsconfig = {
  compilerOptions: {
    strict: true,
    noEmit: true,
    module: 'NodeNext',
    moduleResolution: 'NodeNext',
    skipLibCheck: true,
  },
  files: ['types.ts'],
}

try {
  await writeFile(
    resolve(consumer, 'package.json'),
    JSON.stringify({ name: 'packed-consumer', private: true, type: 'module' }, null, 2) + '\n',
  )

  runNpm(['install', tarball, '--ignore-scripts', '--package-lock=false'], { cwd: consumer })

  await writeFile(
    resolve(consumer, 'esm-test.mjs'),
    "import assert from 'node:assert/strict'\n" +
      "import toIdentifier, { isValidIdentifier, toIdentifierLegacy } from 'toidentifier-modern'\n\n" +
      "assert.equal(toIdentifier('hello-world'), 'HelloWorld')\nassert.equal(toIdentifier.toIdentifier('hello-world'), 'HelloWorld')\nassert.equal(toIdentifier.toIdentifierLegacy('hello-world'), 'Helloworld')\nassert.equal(toIdentifier.isValidIdentifier('_404NotFound'), true)\n" +
      "assert.equal(isValidIdentifier(toIdentifier('404 not found')), true)\n" +
      "assert.equal(toIdentifierLegacy('hello-world'), 'Helloworld')\n",
  )

  await writeFile(
    resolve(consumer, 'cjs-test.cjs'),
    "const assert = require('node:assert/strict')\n" +
      "const toIdentifier = require('toidentifier-modern')\n\n" +
      "assert.equal(typeof toIdentifier, 'function')\n" +
      "assert.equal(Object.keys(toIdentifier).length, 0)\n" +
      "assert.equal(toIdentifier('hello-world'), 'HelloWorld')\n",
  )

  await writeFile(
    resolve(consumer, 'types.ts'),
    "import toIdentifier, { isValidIdentifier, toIdentifierLegacy, type ToIdentifierOptions } from 'toidentifier-modern'\n\n" +
      "const a: string = toIdentifier('Bad Request')\n" +
      "const b: string = toIdentifier('Bad Request', { style: 'camel' })\n" +
      "const c: boolean = isValidIdentifier(a)\n" +
      "const d: string = toIdentifierLegacy('Bad Request')\n" +
      "const options: ToIdentifierOptions = { style: 'pascal', normalize: true }\n\n" +
      "void a\nvoid b\nvoid c\nvoid d\nvoid options\n",
  )

  await writeFile(resolve(consumer, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2) + '\n')

  run(node, [resolve(consumer, 'esm-test.mjs')], { cwd: consumer })
  run(node, [resolve(consumer, 'cjs-test.cjs')], { cwd: consumer })
  run(node, [tsc, '--project', resolve(consumer, 'tsconfig.json')], { cwd: consumer })

  const installedPackageJson = JSON.parse(
    await readFile(resolve(consumer, 'node_modules', 'toidentifier-modern', 'package.json'), 'utf8'),
  )
  assert.equal(installedPackageJson.version, packResult.version)
  assert.equal(installedPackageJson.version, '0.2.0')
} finally {
  await rm(tarball, { force: true })
  await rm(consumer, { recursive: true, force: true })
}
