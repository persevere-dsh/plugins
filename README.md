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
| `perse-updater` | Safely carry DSH to the next version — compatibility preflight, versioned install, and automatic rollback on failure | `persevere-dsh/perse-updater` — _coming soon / 即将上线_ | `npm pack` → `dsh plugin --profile web add <tgz>` |

`perse-updater` is the first plugin in the collection. Its repository does not exist yet;
the link and the status badge will be filled in as soon as it is live.

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
