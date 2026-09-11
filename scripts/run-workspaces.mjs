#!/usr/bin/env node
/**
 * Run one npm script across every workspace package.
 *
 * `npm run <script> --workspaces --if-present` still fails with
 * "No workspaces found!" when `packages/*` matches nothing, so the empty
 * skeleton cannot rely on it. This helper enumerates real packages instead and
 * exits 0 when there is nothing to do.
 *
 * Usage: node scripts/run-workspaces.mjs <script>
 */

import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const script = process.argv[2]
if (script === undefined || script.length === 0) {
  console.error('usage: node scripts/run-workspaces.mjs <script>')
  process.exit(2)
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const packagesDir = join(root, 'packages')
const packages = existsSync(packagesDir)
  ? readdirSync(packagesDir, { withFileTypes: true })
      .filter(entry => entry.isDirectory() || entry.isSymbolicLink())
      .map(entry => {
        const manifestPath = join(packagesDir, entry.name, 'package.json')
        if (!existsSync(manifestPath)) return undefined
        try {
          const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
          if (typeof manifest.name !== 'string' || manifest.name.length === 0) return undefined
          return { name: manifest.name, scripts: manifest.scripts ?? {} }
        } catch {
          return undefined
        }
      })
      .filter(pkg => pkg !== undefined)
      .sort((a, b) => a.name.localeCompare(b.name))
  : []

if (packages.length === 0) {
  console.log(`[run-workspaces] no packages under packages/* — skipping "${script}" (safe no-op)`)
  process.exit(0)
}

const runnable = packages.filter(pkg => typeof pkg.scripts[script] === 'string')
for (const pkg of packages) {
  if (!runnable.includes(pkg)) console.log(`[run-workspaces] note: ${pkg.name} declares no "${script}" script — skipped`)
}
if (runnable.length === 0) {
  console.log(`[run-workspaces] no package declares "${script}" — nothing to run (safe no-op)`)
  process.exit(0)
}

for (const pkg of runnable) {
  console.log(`\n[run-workspaces] ${pkg.name}: npm run ${script}`)
  const result = spawnSync('npm', ['run', script, '--workspace', pkg.name], {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })
  if (result.status !== 0) {
    console.error(`[run-workspaces] ${pkg.name}: "${script}" failed with exit ${result.status ?? 'null'}`)
    process.exit(result.status ?? 1)
  }
}
console.log(`\n[run-workspaces] "${script}" passed for ${runnable.length} package(s)`)
