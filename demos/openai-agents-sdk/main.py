"""OpenAI Agents SDK 最小 demo —— Runner + 一个 function tool。

核心抽象：官方 SDK 的三件套——`Agent`（instructions + tools）、
`@function_tool`（从类型标注和 docstring 自动生成 tool schema）、
`Runner.run_sync`（内置 agent 循环：调模型 -> 执行 tool -> 回填直到出结果）。

配置（key 只从环境变量读取；接兼容 endpoint 需另设 OPENAI_BASE_URL）:
    export OPENAI_API_KEY=sk-...
    export OPENAI_BASE_URL=https://api.deepseek.com   # 可选

安装:  pip install openai-agents
运行:  python3 main.py
预期输出: 模型调用 add 工具计算 19+23，然后回答 "19 加 23 等于 42"。
"""
import os

from agents import Agent, Runner, function_tool

# SDK 自动读取环境变量 OPENAI_API_KEY / OPENAI_BASE_URL，无需也不应硬编码 key。
assert os.environ.get("OPENAI_API_KEY"), "请先 export OPENAI_API_KEY=sk-..."


@function_tool
def add(a: int, b: int) -> int:
    """计算两个整数的和。"""
    return a + b


agent = Agent(
    name="calculator",
    instructions="你是计算器助手。涉及加法时必须先调用 add 工具，不许心算。",
    tools=[add],
    model=os.environ.get("MODEL", "gpt-4o-mini"),
)

if __name__ == "__main__":
    result = Runner.run_sync(agent, "19 加 23 等于多少？")
    print(result.final_output)
