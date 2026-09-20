import { copyFile, mkdir, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const out = resolve(root, 'dist')
const tsc = resolve(root, 'node_modules', 'typescript', 'bin', 'tsc')

await rm(out, { recursive: true, force: true })
await mkdir(out, { recursive: true })

function runCompiler(config, outDir) {
  const args = ['--project', config, '--outDir', outDir]
  const result = spawnSync(process.execPath, [tsc, ...args], {
    cwd: root,
    stdio: 'inherit',
  })

  if (result.status !== 0) process.exit(result.status ?? 1)
}

const esmDir = resolve(root, '.build-esm')
const cjsDir = resolve(root, '.build-cjs')
await rm(esmDir, { recursive: true, force: true })
await rm(cjsDir, { recursive: true, force: true })

runCompiler('tsconfig.json', esmDir)
runCompiler('tsconfig.cjs.json', cjsDir)

await copyFile(resolve(esmDir, 'index.js'), resolve(out, 'index.js'))
await copyFile(resolve(esmDir, 'index.js.map'), resolve(out, 'index.js.map'))
await copyFile(resolve(esmDir, 'index.d.ts'), resolve(out, 'index.d.ts'))
await copyFile(resolve(esmDir, 'index.d.ts.map'), resolve(out, 'index.d.ts.map'))
await copyFile(resolve(cjsDir, 'index.js'), resolve(out, 'index-core.cjs'))

await writeFile(
  resolve(out, 'index.cjs'),
  "'use strict'\n\nconst mod = require('./index-core.cjs')\n\nmodule.exports = mod.default\nmodule.exports.default = mod.default\nmodule.exports.toIdentifier = mod.toIdentifier\n",
  'utf8',
)
