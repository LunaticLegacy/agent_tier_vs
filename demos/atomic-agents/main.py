"""atomic-agents 最小 demo —— Pydantic schema 驱动的结构化输入输出。

核心抽象：每个 agent 都是"InputSchema -> BaseAgent -> OutputSchema"的强类型
管道。输入输出都是 Pydantic BaseIOSchema，框架用 schema 自动生成 system
prompt 和结构化响应格式，保证输出可被程序直接消费。

配置（key 只从环境变量读取，指向任意 OpenAI 兼容 endpoint）:
    export OPENAI_API_KEY=sk-...
    export OPENAI_BASE_URL=https://api.deepseek.com   # 可选

安装:  pip install atomic-agents openai instructor
运行:  python3 main.py
预期输出: 打印一个 RecipeOutput Pydantic 对象（菜名 + 步骤列表）。
"""
import os

import instructor
import openai
from pydantic import Field
from atomic_agents.agents.base_agent import BaseAgent, BaseAgentConfig, BaseIOSchema
from atomic_agents.lib.components.system_prompt_generator import SystemPromptGenerator


class RecipeInput(BaseIOSchema):
    """想做一道菜时给出的约束条件。"""

    ingredient: str = Field(..., description="手头的主要食材")
    minutes: int = Field(..., description="可用的烹饪时间（分钟）")


class RecipeOutput(BaseIOSchema):
    """一份可直接执行的最简菜谱。"""

    dish: str = Field(..., description="菜名")
    steps: list[str] = Field(..., description="按顺序排列的烹饪步骤")


def build_agent() -> BaseAgent:
    client = instructor.from_openai(
        openai.OpenAI(
            api_key=os.environ["OPENAI_API_KEY"],  # 绝不硬编码 key
            base_url=os.environ.get("OPENAI_BASE_URL"),
        )
    )
    return BaseAgent(
        config=BaseAgentConfig(
            client=client,
            model=os.environ.get("MODEL", "gpt-4o-mini"),
            input_schema=RecipeInput,
            output_schema=RecipeOutput,
            system_prompt_generator=SystemPromptGenerator(
                background=["你是一位追求极简的家庭厨师。"],
                output_instructions=["只给能在给定时间内完成的菜谱，步骤不超过 5 条。"],
            ),
        )
    )


if __name__ == "__main__":
    agent = build_agent()
    result = agent.run(RecipeInput(ingredient="鸡蛋和番茄", minutes=15))
    print(f"菜名: {result.dish}")
    for i, step in enumerate(result.steps, 1):
        print(f"  {i}. {step}")
