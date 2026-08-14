# atomic-agents 最小 Demo

Pydantic schema 驱动结构化输入输出的最小 agent。

## 核心概念（4 行版）

- **BaseIOSchema**：输入和输出都是带 docstring 的 Pydantic 模型，docstring 本身即给 LLM 的说明文档。
- **BaseAgent** = `input_schema -> LLM -> output_schema` 的强类型管道，输出是可以 `.run()` 直接拿到的 Pydantic 对象。
- instructor 负责把 schema 变成结构化响应约束，杜绝"解析模型自由文本"。
- 组合哲学：像搭乐高一样用小 agent 拼系统，而不是一个万能 prompt。

## 安装

```bash
pip install atomic-agents openai instructor
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

```
菜名: 番茄炒蛋
  1. 番茄切块，鸡蛋打散
  2. 热油炒蛋至凝固盛出
  ...
```

仅语法验证，未连接真实 LLM 实机运行。
