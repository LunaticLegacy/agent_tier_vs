# OpenAI Agents SDK 最小 Demo

Runner + 一个 function tool 的最小 agent。

## 核心概念（4 行版）

- **Agent** = instructions + tools + model，声明式定义。
- **@function_tool**：装饰普通函数，SDK 从类型标注 + docstring 自动生成 JSON Schema。
- **Runner.run_sync**：内置 agent 循环（模型 → tool 执行 → 回填 → 再调模型），结果取 `final_output`。
- 进阶原语 handoff / guardrails / tracing 都挂在同一套对象上，最小例子用不到。

## 安装

```bash
pip install openai-agents
```

## 配置（key 只从环境变量读取）

```bash
export OPENAI_API_KEY=sk-...
export OPENAI_BASE_URL=https://api.deepseek.com  # 可选，任意 OpenAI 兼容 endpoint
export MODEL=deepseek-chat                        # 可选
```

## 运行

```bash
python3 main.py
```

## 预期输出

模型先调用 `add(19, 23)`，再回答：

```
19 加 23 等于 42。
```

仅语法验证，未连接真实 LLM 实机运行。
