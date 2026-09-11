# Persevere with DSH

`perse` = persevere

The DSH (DeepSeek Harness) plugin collection maintained under the **Persevere with DSH** project.

This repository is a monorepo workspace that hosts the plugin sources. Every plugin is
developed here, code-generated here, and published as its own package — the collection
repo itself is private and is never published to npm.

> **perse** is shorthand used in casual conversation and documentation only.
> The brand name is always written in full as **Persevere with DSH**.

---

## Plugin catalog

No plugin has landed in this workspace yet. The skeleton is intentionally empty so that
the first plugin can be added against a working, CI-covered baseline.

| Plugin | Package | Repository | Status |
| --- | --- | --- | --- |
| — | — | — | _coming soon_ |

Each plugin will live at `persevere-dsh/dsh-<name>`, be published as
`@persevere-dsh/<name>`, and be developed inside this collection under `packages/<name>/`.

## Requirements

- Node.js 24 or newer
- npm 11 or newer (the workspace uses `workspaces: ["packages/*"]`)

## Workspace layout

```
packages/            one directory per plugin (currently empty — see the catalog above)
scripts/gen-typert.mjs   shared Typert codegen for every plugin
tsconfig.base.json   shared compiler options
tsconfig.host.json   host-face project graph used by codegen
docs/                branding rules and the plugin checklist
```

## Install a plugin

Plugins are installed from a packed tarball, never from a linked directory:

```sh
# 1. build the plugin, then pack it into a tarball
npm run build --workspaces --if-present
cd packages/<name> && npm pack          # -> persevere-dsh-<name>-<version>.tgz

# 2. install the tarball into the DSH web profile
dsh plugin --profile web add ./persevere-dsh-<name>-<version>.tgz
```

> **Do not link the plugin directory into the profile** (`dsh plugin add ../packages/<name>`
> or an `npm link`-style directory dependency). A directory link was tested and fails at
> load time: the profile resolves the plugin outside the packed `files[]` surface, so the
> generated Typert artifacts and the client bundle are not the ones the manifest declares.
> Always go through `npm pack` → `dsh plugin --profile web add <tgz>`.

## Development

```sh
npm install

npm run typecheck   # tsc -b tsconfig.host.json
npm run codegen     # generate Typert artifacts (safe no-op while packages/ is empty)
npm run build       # typecheck + codegen + per-package build
npm test            # per-package tests (skipped while packages/ is empty)
```

With zero plugin packages under `packages/*`, each of these commands succeeds and simply
does no work, so CI stays green on the empty skeleton.

### Generated artifacts are not committed

`lib/**` (Typert output plus per-package TypeScript emit) and `dist/**` (client bundles)
are **generated, not committed**. They are produced by `npm run codegen` / `npm run build`
locally and by CI, and each plugin's `files[]` list is exactly the generated surface that
`npm pack` ships. Cloning the workspace therefore requires a build before packing a plugin.

## Adding a plugin

See [`docs/ADDING-A-PLUGIN.md`](docs/ADDING-A-PLUGIN.md) for the step-by-step checklist and
[`docs/BRANDING.md`](docs/BRANDING.md) for the naming rules that every plugin must follow.

## License

MIT — see [`LICENSE`](LICENSE).

---

Part of Persevere with DSH
