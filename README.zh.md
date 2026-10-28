# Persevere with DSH

`perse` = persevere

DeepSeek Harness 插件合集。

本仓库是合集的**索引页**：列出各个插件、指向它们的仓库，并说明如何安装。这里不是
monorepo —— 没有共享骨架、没有模板、没有工作区。每个插件都独立成仓，在各自的仓库里
开发、构建和发布。索引仓本身永远不会发布到 npm。

> **perse** 只是口语与文档中的简写。品牌语在任何正式文本里始终完整写作
> **Persevere with DSH**。

---

## 插件

| Plugin | 说明 | 仓库 | 安装 |
| --- | --- | --- | --- |
| `perse-updater` | 安全地把 DSH 带到下一个版本（预检兼容性、版本化安装、失败自动回滚） | [`persevere-dsh/perse-updater`](https://github.com/persevere-dsh/perse-updater) | `npm pack` → `dsh plugin --profile web add <tgz>` |
| `perse-remote-dev` | 配对并管理远程 DSH 连接，凭据保存在私有存储中；Host 具备匹配的原生扩展时可使用原生远程会话，旧版 Host 仅提供连接设置 | [`persevere-dsh/perse-remote-dev`](https://github.com/persevere-dsh/perse-remote-dev) | `npm pack` → `dsh plugin --profile web add <tgz>` |
| `perse-cua` | 将 cua-driver 桌面自动化能力提供给 DSH，精简工具描述，默认仅过滤已弃用或无效工具，并裁去无障碍树中的菜单子树且保留元素引用 | [`persevere-dsh/perse-cua`](https://github.com/persevere-dsh/perse-cua) | `npm pack` → `dsh plugin --profile web add <tgz>` |
| `perse-proof` | 让 DSH 的每一句“已完成”都有据可查：冻结验收判据、结论与证据机械对账、只追加的事实台账，以及面向用户回复的汇报契约 | [`persevere-dsh/perse-proof`](https://github.com/persevere-dsh/perse-proof) | `npm pack` → `dsh plugin --profile web add <tgz>` |
| `perse-dashboard` | DSH 原生任务与会话仪表板：分派并原子领取工作区任务、审阅证据、打开实际执行会话 | [`persevere-dsh/perse-dashboard` 1.9.4](https://github.com/persevere-dsh/perse-dashboard/tree/v1.9.4) | `npm pack` → `dsh plugin --profile web add <tgz>` |

## 安装

每个插件都以 tarball 形式打包安装：

```sh
npm pack                                  # -> perse-<name>-<version>.tgz
dsh plugin --profile web add ./perse-<name>-<version>.tgz
```

> **不要用目录 link 安装插件。** 目录 link（`dsh plugin --profile web add ../perse-<name>`、
> `file:` 依赖，或 `npm link` 式链接）经过实测会在加载阶段失败：宿主会在打包后的
> `files[]` 边界之外解析插件，导致 peer 解析失败。请始终使用
> `npm pack` → `dsh plugin --profile web add <tgz>`。

## 新增插件

每个插件都在自己的 `persevere-dsh/perse-<name>` 仓库中开发，**不**放在本索引仓里。
逐插件清单见 [`docs/ADDING-A-PLUGIN.md`](docs/ADDING-A-PLUGIN.md)，命名规则见
[`docs/BRANDING.md`](docs/BRANDING.md)。插件发布后，把它的仓库作为一行加入上面的表格。

## 许可证

MIT —— 见 [`LICENSE`](LICENSE)。

---

Part of Persevere with DSH
