# deepseek-harness (dsh) 最小使用

DeepSeek 官方 agent harness："一切皆插件"（Cordis 内核）。本目录不含可执行
Python 代码——dsh 是 TypeScript/Node 项目，最小使用就是一条 npx 命令 +
一份 cordis patch 配置。

## 核心概念（5 行版）

- **Agent = Model + Harness**：模型只产出文本，harness 提供工作区、工具、权限、会话记忆和驱动循环。
- **Cordis 内核**：只做一件事——挂载/卸载插件并追踪依赖；模型、工具、session、沙箱、agent loop 本身全是插件。
- **一切皆插件**：换掉模型适配器、把文件系统指向远程沙箱、替换 agent loop，都只是换插件，不改核心。
- **Patch 分层**：bundle patch → profile 的 `cordis.patch.yml` → 机器级 patch → `--patch` 覆盖，后层整行覆盖前层。
- 会话日志 append-only：resume / fork / replay 都基于同一条事件流。

## 安装与启动

```bash
# 需要 Node.js；一条命令启动本地 Web UI（http://127.0.0.1:3080）
npx @deepseek-ai/dsh web
```

首次启动后在 Web UI 的 Settings → Models 里填入模型 API key（也可
`export DEEPSEEK_API_KEY=sk-...`，key 只从环境变量读取，不要写进配置）。

查看当前机器实际组合出的插件树（不启动）：

```bash
npx @deepseek-ai/dsh web --dump-config
```

## 最小 cordis patch 配置

见 [`cordis.patch.yml`](./cordis.patch.yml)：往运行的 dsh 里插入一个最小
hello 插件（仅演示 patch 行格式与 `!!js process.env` 凭据引用写法）。

```bash
# 以源码 checkout 开发时用 --patch 叠加（插件文件需为绝对路径）
pnpm dsh web --patch ./cordis.patch.yml
```

> dsh 处于 developer preview（0.1.0-rc.x），官方声明会有破坏性变更；本示例
> 仅按官方 README/文档格式给出最小配置，未实机验证。
