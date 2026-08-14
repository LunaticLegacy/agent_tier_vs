# llmfetcher 最小 Demo

用**真实 llmfetcher API** 造一个带自定义工具的 agent：从后端配置到 `agent.run()` 共约 70 行。

## 核心概念（3 行版）

- `LLMFetcher` 是 provider-neutral 的后端 fetcher：`LLMBackendConfig` 描述 provider/model/key/url/超时/重试，可挂多后端。
- `Agent` 拥有模型循环：发消息 → 解析 tool_calls → 执行 handler → 回填，直到模型直接回答；调用方只看到同步的 `run()`。
- `Tool` = 普通 callable + `ToolSchema`，`add_tool` 注册即用，无需继承或装饰器。

## 安装

llmfetcher 未发布 PyPI，需 Python ≥ 3.12，从源码安装：

```bash
git clone https://github.com/LunaticLegacy/llmfetcher.git
cd llmfetcher && pip install -e .
```

## 配置（全部从环境变量读取）

```bash
export LLM_API_KEY=sk-...                     # 必填，任意 OpenAI 兼容 key
export LLM_BASE_URL=https://api.deepseek.com  # 可选，指向兼容 endpoint
export LLM_MODEL=deepseek-chat                # 可选，默认 deepseek-chat
```

## 运行

```bash
python3 main.py
```

## 预期输出

模型先调用 `convert_size("750MB")`，拿到 `750MB = 786,432,000 bytes` 后回答，并打印 token 用量：

```
750MB 等于 786,432,000 字节。
total tokens: 312
```

仅语法验证（py_compile），未连接真实 LLM 实机运行。
