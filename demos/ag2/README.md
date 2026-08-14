# AG2 最小 Demo

两个 agent 接力对话，使用 **AG2 v1.0 新 API**（`import ag2`，以官方仓库 README 为准）。

> 注意：`ConversableAgent` / `GroupChat` / `import autogen` 已迁移到 AG2 Classic（`pip install ag2-classic`），本 demo 用的是 v1.0 的 `Agent` + `ask()`。

## 核心概念（4 行版）

- **Agent** 是唯一构建块：名字 + prompt + provider config。
- **`agent.ask(...)`** 发起一轮对话，返回 `AgentReply`（文本在 `reply.body`）；对 reply 继续 `.ask()` 会在同一历史续聊。
- 多 agent 对话 = 把 A 的回复喂给 B；更复杂的编排用 Network（hub + channels）。
- 全程 async，入口用 `asyncio.run`。

## 安装

```bash
pip install 'ag2[openai]'   # Python >= 3.10
```

## 配置

```bash
export OPENAI_API_KEY=sk-...   # key 只从环境变量读取，OpenAIConfig 自动拾取
```

## 运行

```bash
python3 main.py
```

## 预期输出

```
[planner] 1. 撰写更新亮点 ... 2. ... 3. ...
[critic ] 缺少发布渠道与时间的确认步骤，建议......
```

仅语法验证，未连接真实 LLM 实机运行。
