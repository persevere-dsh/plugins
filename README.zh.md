# Persevere with DSH

`perse` = persevere

**Persevere with DSH** 项目维护的 DSH（DeepSeek Harness）插件合集。

本仓库是一个 monorepo 工作区，用来承载各个插件的源码。每个插件都在这里开发、在这里
生成代码，并作为独立包发布 —— 合集仓库本身是私有的，永远不会发布到 npm。

> **perse** 只是口语与文档中的简写。品牌语在任何正式文本里始终完整写作
> **Persevere with DSH**。

---

## 插件目录

目前工作区中还没有任何插件。骨架刻意保持为空，以便第一个插件能直接落在一个可运行、
有 CI 覆盖的基线上。

| 插件 | 包名 | 仓库 | 状态 |
| --- | --- | --- | --- |
| — | — | — | _即将加入_ |

每个插件都将位于 `persevere-dsh/dsh-<name>`，以 `@persevere-dsh/<name>` 发布，
并在本合集内的 `packages/<name>/` 下开发。

## 环境要求

- Node.js 24 或更高版本
- npm 11 或更高版本（工作区使用 `workspaces: ["packages/*"]`）

## 工作区结构

```
packages/           每个插件一个目录（当前为空 —— 见上方插件目录）
scripts/gen-typert.mjs   所有插件共用的 Typert codegen
tsconfig.base.json   共享编译选项
tsconfig.host.json   codegen 使用的 host face 工程图
docs/                品牌规范与新增插件清单
```

## 安装插件

插件通过打包后的 tarball 安装，**不要**使用目录 link：

```sh
# 1. 构建插件，然后打包成 tarball
npm run build --workspaces --if-present
cd packages/<name> && npm pack          # -> persevere-dsh-<name>-<version>.tgz

# 2. 把 tarball 安装进 DSH web profile
dsh plugin --profile web add ./persevere-dsh-<name>-<version>.tgz
```

> **不要**把插件目录直接 link 进 profile（`dsh plugin add ../packages/<name>`，
> 或 `npm link` 式的目录依赖）。目录 link 经过实测会在加载阶段失败：profile 会绕过
> 打包后的 `files[]` 边界去解析插件，因此实际加载到的生成物与客户端 bundle 并不是
> manifest 所声明的那一份。请始终使用 `npm pack` → `dsh plugin --profile web add <tgz>`。

## 开发

```sh
npm install

npm run typecheck   # tsc -b tsconfig.host.json
npm run codegen     # 生成 Typert 产物（packages/ 为空时安全 no-op）
npm run build       # typecheck + codegen + 逐包构建
npm test            # 逐包测试（packages/ 为空时跳过）
```

当 `packages/*` 下没有插件包时，上述命令都会成功执行且不做任何事，因此空骨架上的 CI
始终保持绿色。

### 生成物不入库

`lib/**`（Typert 产物以及逐包 TypeScript 输出）与 `dist/**`（客户端 bundle）属于
**生成物，不入库**：由本地和 CI 的 `npm run codegen` / `npm run build` 产生。每个插件的
`files[]` 清单正好等于 `npm pack` 会发布的生成物范围。因此 clone 工作区后必须先构建才能
打包插件。

## 新增插件

新增步骤清单见 [`docs/ADDING-A-PLUGIN.md`](docs/ADDING-A-PLUGIN.md)，所有插件都必须
遵守的命名规则见 [`docs/BRANDING.md`](docs/BRANDING.md)。

## 许可证

MIT —— 见 [`LICENSE`](LICENSE)。

---

Part of Persevere with DSH
