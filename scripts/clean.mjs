import { rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

for (const path of ['dist', '.build-esm', '.build-cjs']) {
  await rm(resolve(root, path), { recursive: true, force: true })
}
