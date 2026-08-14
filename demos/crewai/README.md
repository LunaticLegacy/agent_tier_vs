# crewAI 最小 Demo

两个 role agent（研究员 + 写作者）组成的最小 Crew。

## 核心概念（4 行版）

- **Agent** = role / goal / backstory 三件套，拟人化"岗位"。
- **Task** = description + expected_output，声明要交付什么，绑定到某个 Agent。
- **Crew** 把 agents 和 tasks 编成剧组，`Process.sequential` 表示按顺序接力执行。
- 后一个 task 自动拿到前一个 task 的产出作为上下文。

## 安装

```bash
pip install crewai
```

## 配置（key 只从环境变量读取）

```bash
export OPENAI_API_KEY=sk-...
export OPENAI_API_BASE=https://api.deepseek.com  # 可选，crewAI/litellm 读取
export MODEL=deepseek-chat                        # 可选，需带 provider 前缀如 openai/...
```

## 运行

```bash
python3 main.py
```

## 预期输出

研究员先产出 3 条要点，写作者据此输出一段不超过 100 字的科普短文。

仅语法验证，未连接真实 LLM 实机运行。
