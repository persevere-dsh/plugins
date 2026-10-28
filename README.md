# Persevere with DSH

`perse` = persevere

A collection of DeepSeek Harness plugins.

This repository is the **index** for the collection. It lists the plugins, links to their
repositories, and explains how to install them. It is not a monorepo: there is no shared
skeleton, template, or workspace here. Every plugin lives in its own repository, is built
from its own source, and is published from there. The index repo is never published to npm.

> **perse** is shorthand used in casual conversation and documentation only.
> The brand name is always written in full as **Persevere with DSH**.

---

## Plugins

| Plugin | 说明 | 仓库 | 安装 |
| --- | --- | --- | --- |
| `perse-updater` | Safely carry DSH to the next version — compatibility preflight, versioned install, and automatic rollback on failure | [`persevere-dsh/perse-updater`](https://github.com/persevere-dsh/perse-updater) | `npm pack` → `dsh plugin --profile web add <tgz>` |
| `perse-remote-dev` | Pair and manage remote DSH connections with private saved credentials; native remote sessions are available when the Host has the matching native extension, while older Hosts provide connection settings only | [`persevere-dsh/perse-remote-dev`](https://github.com/persevere-dsh/perse-remote-dev) | `npm pack` → `dsh plugin --profile web add <tgz>` |
| `perse-cua` | Presents cua-driver desktop automation to DSH with concise tool descriptions, filters only deprecated or inert tools by default, and trims accessibility menu subtrees while preserving element references | [`persevere-dsh/perse-cua`](https://github.com/persevere-dsh/perse-cua) | `npm pack` → `dsh plugin --profile web add <tgz>` |
| `perse-proof` | Make every “done” in DSH backed by evidence — frozen acceptance criteria, claim↔evidence reconciliation, an append-only fact ledger, and a reporting contract for user-facing replies | [`persevere-dsh/perse-proof`](https://github.com/persevere-dsh/perse-proof) | `npm pack` → `dsh plugin --profile web add <tgz>` |
| `perse-dashboard` | Native task and session dashboard for DSH — assign and atomically claim workspace tasks, review evidence, and open the real execution Session | [`persevere-dsh/perse-dashboard` 1.9.4](https://github.com/persevere-dsh/perse-dashboard/tree/v1.9.4) | `npm pack` → `dsh plugin --profile web add <tgz>` |

## Install

Every plugin is packed and installed as a tarball:

```sh
npm pack                                  # -> perse-<name>-<version>.tgz
dsh plugin --profile web add ./perse-<name>-<version>.tgz
```

> **Do not install a plugin from a linked directory.** A directory link
> (`dsh plugin --profile web add ../perse-<name>`, a `file:` dependency, or an
> `npm link`-style link) was tested and fails at load time: the host resolves the plugin
> outside the packed `files[]` surface, so peer resolution breaks. Always go through
> `npm pack` → `dsh plugin --profile web add <tgz>`.

## Adding a plugin

Each plugin is developed in its own `persevere-dsh/perse-<name>` repository — never inside
this index. See [`docs/ADDING-A-PLUGIN.md`](docs/ADDING-A-PLUGIN.md) for the per-plugin
checklist and [`docs/BRANDING.md`](docs/BRANDING.md) for the naming rules. Once a plugin
is published, its repository is added as a row in the table above.

## License

MIT — see [`LICENSE`](LICENSE).

---

Part of Persevere with DSH
