# Adding a plugin to the Persevere with DSH collection

Every plugin is an **independent repository** under the `persevere-dsh` organisation, named
`persevere-dsh/perse-<name>`. Nothing is shared with the collection index repo
[`persevere-dsh/plugins`](https://github.com/persevere-dsh/plugins): there is no skeleton,
no template, and no workspace to join. A new plugin repo must be self-contained — its own
manifest, its own TypeScript config, its own codegen script, its own CI, its own tests.

Read [`BRANDING.md`](BRANDING.md) before naming anything. For a working example of the
out-of-tree DSH plugin shape, see the `dsh-update-center` checkout on the maintainer's
machine; reference its manifest/tsconfig structure, never its business code.

## 0. Decide the name

| Artifact | Value |
| --- | --- |
| Plugin name | `perse-<name>` (lowercase kebab-case, e.g. `perse-updater`) |
| Repository | `persevere-dsh/perse-<name>` |
| npm package | `perse-<name>` |
| CLI / plugin id | `perse-<name>` |

`<name>` describes the plugin, not the brand: `updater`, not `perse-perse-updater`.

## 1. Create the repository

Create `persevere-dsh/perse-<name>` (public), default branch `main`, and clone it locally.
Set the author identity to `Xilong Liu <49407218+Deslord319@users.noreply.github.com>`.

## 2. Required files

A plugin repo must ship, at minimum:

- `package.json` — `name: "perse-<name>"`, `type: "module"`, `license: "MIT"`, the
  `exports` map (including `"./typert"` and `"./remote"`), the exact `files[]` list,
  `dsh.bundle.patch` / `dsh.client` blocks when the plugin has a host patch or a web
  client, `peerDependencies` for the harness packages, and `scripts.build` /
  `scripts.test` / `scripts.codegen`.
- `tsconfig.json` — **self-contained** (`rootDir: "src"`, `outDir: "lib/types"`,
  `noEmit: false`). Do not extend a file from another repository; there is no shared base.
- `src/` — the host-side source. Exported reference objects, Cordis services/events, and
  `@Remote` methods are what codegen turns into artifacts.
- `typert-protocol.d.ts` — only when the plugin imports the Typert protocol type shim.
- `test/` — host-side tests (see step 5).
- `README.md` and `README.zh.md` — the dual README convention (see step 6).
- `LICENSE` — MIT, copyright `Xilong Liu`.
- `.gitignore` — at least `node_modules/`, `lib/`, `dist/`, `*.tgz`.

## 3. Self-owned codegen

Codegen belongs to the plugin repo and depends on nothing in this collection:

- commit `scripts/gen-typert.mjs` inside the plugin repo, calling the published
  `@deepseek-ai/dsh-typert-generator`;
- run it as `npm run codegen`; it must work in a plain clone with no sibling checkouts.

It writes, under `lib/`:

```
lib/typert.host.js
lib/typert.host.d.ts
lib/typert.remote-client.js
lib/typert.remote-client.d.ts
lib/typert.remote-client.d.ts.map
```

The generator's `validateExport()` refuses to emit unless `exports["./typert"]`,
`exports["./remote"]`, and `files[]` already match those exact paths — fix the manifest,
not the script. Paths live only under `lib/`, never `src/`. `lib/` is **not committed**.

## 4. Self-owned CI

Commit `.github/workflows/ci.yml` **in the plugin repo** running:

- `npm ci`
- `npm run typecheck`
- `npm run codegen`
- `npm run build`
- `npm test`

No workflow, script, or config is inherited from the index repo.

## 5. Tests

Add a `test` script that runs without the DSH harness checkout, e.g.
`node --test test/*.test.mjs`, and cover:

- the exported reference objects and their schema shapes;
- every host method that codegen exposes through the Typert Gateway;
- error/edge paths of the host service, with no network and no `~/.dsh` access.

## 6. Dual README

Every plugin repository ships both languages, each containing the full brand phrase and
ending with the footer line `Part of Persevere with DSH`:

- `README.md` (English, primary)
- `README.zh.md` (Chinese)

Both must satisfy the [`BRANDING.md`](BRANDING.md) self-check.

## 7. Client bundle (web profile plugins only)

If the plugin ships a web UI:

- add the client entry (`client.js`) and declare it in `exports["./client"]` and `files[]`;
- declare `dsh.client.platform: "web"` and the `inject` list in `package.json`;
- build the bundle with `tsdown` and verify the built bundle is declared by the manifest
  before packing.

## 8. Pack and install

```sh
npm ci
npm run build
npm pack                                   # -> perse-<name>-<version>.tgz
dsh plugin --profile web add ./perse-<name>-<version>.tgz
```

Do **not** link the directory into the profile: a directory link was tested and fails at
load time because the host resolves the plugin outside the packed `files[]` surface and
peer resolution breaks. Always install from the packed tarball.

## 9. Register in the index

Open a pull request against [`persevere-dsh/plugins`](https://github.com/persevere-dsh/plugins)
adding one row to the plugin table in both `README.md` and `README.zh.md`
(`Plugin / 说明 / 仓库 / 安装`), and paste the status badge once the repo is public. The
index repo holds no plugin code — only the table and these docs.

## 10. Publish (separate step)

npm publishing, if any, is done by hand from the plugin repo after the name and namespace
are confirmed. The index repo is never published.

## Checklist

- [ ] Repository `persevere-dsh/perse-<name>` exists, branch `main`
- [ ] `package.json` uses `perse-<name>` and an exact `files[]`
- [ ] `tsconfig.json` is self-contained (no cross-repo `extends`)
- [ ] `scripts/gen-typert.mjs` is committed and `npm run codegen` emits all five artifacts
- [ ] `.github/workflows/ci.yml` runs typecheck + codegen + build + test
- [ ] Host tests pass via `npm test`, with no network or `~/.dsh` access
- [ ] Client bundle builds and is declared (web plugins)
- [ ] `README.md` + `README.zh.md` with the `Part of Persevere with DSH` footer
- [ ] Branding self-check passes (no `PWD`, no abbreviated brand, `perse = persevere`)
- [ ] Packed tarball installs into a profile via `npm pack` → `dsh plugin add <tgz>`
- [ ] A row is added to the index repo's README tables
