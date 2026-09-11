#!/usr/bin/env node
/**
 * Shared Typert codegen for the Persevere with DSH plugin collection.
 *
 * Generalized from `dsh-update-center/scripts/gen-typert.mjs` (single package,
 * hard-coded `EXPECTED_PACKAGES`) into a multi-package workspace pass:
 *
 *   - every real workspace package is discovered from `<root>/packages/<name>/package.json`
 *     instead of a hand-maintained list;
 *   - the published `@deepseek-ai/dsh-typert-generator` is called directly, so the
 *     build never touches the DSH harness checkout;
 *   - the ZERO-package state (this skeleton) is a safe no-op: it logs and exits 0
 *     without importing the generator, so `npm run codegen` and CI pass on day one;
 *   - a package that publishes no Typert face is reported, not treated as an error.
 *
 * The generator's own `validateExport()` still runs on every pass: it refuses to
 * emit unless `exports["./typert"]` / `exports["./remote"]` and `files[]` already
 * match the exact paths written here.
 *
 * Artifacts, exactly as the generator's `tsdown-plugin.ts#emitArtifacts` names
 * them, and only ever under `<pkg>/lib/` (never `src/`):
 *
 *   lib/typert.host.js
 *   lib/typert.host.d.ts
 *   lib/typert.remote-client.js
 *   lib/typert.remote-client.d.ts
 *   lib/typert.remote-client.d.ts.map
 *
 * Usage:
 *   node scripts/gen-typert.mjs           # generate (safe no-op with zero packages)
 *   node scripts/gen-typert.mjs --clean   # remove generated Typert artifacts only
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/** Independently compiled faces analyzed by the generator. */
const FACES = ['host']

/** Artifact paths owned by codegen, relative to a package root. */
const GENERATED = [
  'lib/typert.host.js',
  'lib/typert.host.d.ts',
  'lib/typert.remote-client.js',
  'lib/typert.remote-client.d.ts',
  'lib/typert.remote-client.d.ts.map',
]

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const clean = process.argv.slice(2).includes('--clean')
const packages = discoverWorkspacePackages()

if (clean) {
  const removed = []
  for (const pkg of packages) {
    for (const rel of GENERATED) {
      const target = join(root, 'packages', pkg.dir, rel)
      if (existsSync(target)) {
        rmSync(target, { force: true })
        removed.push(relative(root, target))
      }
    }
  }
  console.log(`[gen-typert] removed ${removed.length} generated artifact(s)`)
  for (const file of removed) console.log(`  ${file}`)
  process.exit(0)
}

if (packages.length === 0) {
  console.log('[gen-typert] no package under packages/* with a package.json — nothing to generate (safe no-op)')
  process.exit(0)
}

console.log(`[gen-typert] workspace root: ${root}`)
console.log(`[gen-typert] workspace packages: ${packages.map(pkg => pkg.name).join(', ')}`)

let WorkspaceTypertGenerator
try {
  ;({ WorkspaceTypertGenerator } = await import('@deepseek-ai/dsh-typert-generator'))
} catch (cause) {
  console.error('[gen-typert] cannot load @deepseek-ai/dsh-typert-generator — run `npm install` first')
  console.error(String(cause))
  process.exit(1)
}

const generator = new WorkspaceTypertGenerator(root, {
  // `npm run build` runs `tsc -b tsconfig.host.json` first, which is exactly the
  // precondition the generator documents for checkDiagnostics: false. Keeping it
  // false here makes codegen independent of tsc's project-reference ordering.
  checkDiagnostics: false,
})

const discovered = generator.discover(FACES)
const names = discovered.map(entry => entry.package)
console.log(`[gen-typert] discovered Typert contributors: ${names.length === 0 ? '(none)' : names.join(', ')}`)

for (const pkg of packages) {
  if (!names.includes(pkg.name)) {
    console.log(`[gen-typert] note: ${pkg.name} publishes no Typert face — skipped`)
  }
}

if (names.length === 0) {
  console.log('[gen-typert] no package contributes a Typert face — nothing to emit (safe no-op)')
  process.exit(0)
}

const artifacts = generator.generate(names, FACES)
const written = []
for (const artifact of artifacts) {
  const packageRoot = join(root, artifact.packageRoot)
  written.push(emit(packageRoot, `lib/typert.${artifact.face}.js`, artifact.js))
  written.push(emit(packageRoot, `lib/typert.${artifact.face}.d.ts`, artifact.dts))
  if (artifact.remote === undefined) {
    console.log(`[gen-typert] note: ${artifact.package} emitted no Remote artifact (no @Remote methods)`)
    continue
  }
  written.push(emit(packageRoot, 'lib/typert.remote-client.js', artifact.remote.js))
  written.push(emit(packageRoot, 'lib/typert.remote-client.d.ts', artifact.remote.dts))
  written.push(emit(packageRoot, 'lib/typert.remote-client.d.ts.map', artifact.remote.dtsMap))
}

console.log(`[gen-typert] wrote ${written.length} artifact(s)`)
for (const file of written) console.log(`  ${relative(root, file)}`)

/**
 * List real workspace packages, in stable package-name order.
 *
 * A directory counts only when it carries a readable `package.json` with a
 * non-empty `name`, so scratch directories under `packages/` are ignored.
 *
 * @returns {{ dir: string, name: string }[]} workspace packages, name-sorted.
 */
function discoverWorkspacePackages() {
  const packagesDir = join(root, 'packages')
  if (!existsSync(packagesDir)) return []
  return readdirSync(packagesDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory() || entry.isSymbolicLink())
    .map(entry => {
      const manifestPath = join(packagesDir, entry.name, 'package.json')
      if (!existsSync(manifestPath)) return undefined
      try {
        const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
        if (typeof manifest.name !== 'string' || manifest.name.length === 0) return undefined
        return { dir: entry.name, name: manifest.name }
      } catch {
        return undefined
      }
    })
    .filter(pkg => pkg !== undefined)
    .sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Write one artifact under its package root, creating `lib/` when it is absent.
 *
 * @param packageRoot - absolute package directory.
 * @param relativePath - artifact path relative to the package directory.
 * @param content - generated file content.
 * @returns the absolute path written.
 */
function emit(packageRoot, relativePath, content) {
  const target = join(packageRoot, relativePath)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, content, 'utf8')
  return target
}
