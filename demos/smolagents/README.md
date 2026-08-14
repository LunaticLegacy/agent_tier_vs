# smolagents 最小 Demo

Hugging Face 的极简 agent 库：`CodeAgent` + 一个自定义 `@tool`。

## 核心概念（4 行版）

- **CodeAgent**：模型的动作空间不是 JSON tool call，而是直接生成并在受限解释器中执行 Python 代码。
- **@tool**：一个装饰器，把带 docstring + 类型标注的普通函数注册为模型可用工具。
- Agent 循环 = 写代码 → 执行 → 把观察结果喂回 → 再写代码，直到 `final_answer()`。
- 整个库核心约千行，刻意保持"小到能读完"。

## 安装

```bash
pip install smolagents
```

## 配置

```bash
export HF_TOKEN=hf_...   # https://huggingface.co/settings/tokens ，key 只从环境变量读取
```

## 运行

```bash
python3 main.py
```

## 预期输出

Agent 生成并执行类似 `celsius_to_fahrenheit(37.5)` 的代码，最终打印：

```
99.5 华氏度
```

仅语法验证，未连接真实 LLM 实机运行。
