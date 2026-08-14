# magentic 最小 Demo

`@prompt` 装饰器：把 LLM 调用写成类型化 Python 函数。

## 核心概念（4 行版）

- **@prompt**：给无函数体的函数挂一个模板字符串，`{arg}` 插值进 prompt。
- **函数签名即契约**：参数是 LLM 的输入，返回类型标注（含 Pydantic 模型）是结构化输出的 schema。
- 调用函数 = 发起一次 LLM 请求，返回值已解析成声明的 Python 类型，无需手工 parse。
- 链式/流式/function-calling 也以同样方式表达，保持"LLM 只是函数"的心智模型。

## 安装

```bash
pip install magentic
```

## 配置（key 只从环境变量读取）

```bash
export OPENAI_API_KEY=sk-...
export OPENAI_BASE_URL=https://api.deepseek.com  # 可选，任意 OpenAI 兼容 endpoint
```

## 运行

```bash
python3 main.py
```

## 预期输出

```
首都: 东京
人口: 125.7 百万
冷知识: 日本由 14000 多个岛屿组成...
```

仅语法验证，未连接真实 LLM 实机运行。
