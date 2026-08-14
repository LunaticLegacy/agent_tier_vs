"""AG2 最小 demo —— 两个 agent 接力对话（AG2 v1.0 新 API，以官方 README 为准）。

核心抽象：AG2 v1.0（`import ag2`，不再是 `import autogen`）以 `Agent` 为唯一
构建块——`agent.ask(...)` 发起一轮对话并返回 `AgentReply`，对 reply 再调用
`.ask(...)` 会在**同一对话历史**上继续。两个 agent 的对话就是把一方的回复
喂给另一方。AG2 全程 async。

配置（key 只从环境变量读取，provider config 自动读取标准环境变量）:
    export OPENAI_API_KEY=sk-...

安装:  pip install 'ag2[openai]'   # 需要 Python >= 3.10
运行:  python3 main.py
预期输出: planner 给出 3 步计划，critic 针对计划给出一条改进意见。
"""
import asyncio

from ag2 import Agent
from ag2.config import OpenAIConfig  # 默认读取环境变量 OPENAI_API_KEY

config = OpenAIConfig(model="gpt-4o-mini")

planner = Agent(
    "planner",
    prompt="你是计划者：把任务拆成 3 步以内的最小行动计划，只输出计划。",
    config=config,
)
critic = Agent(
    "critic",
    prompt="你是评审：指出计划中最薄弱的一步并给出一条具体改进建议，一句话以内。",
    config=config,
)


async def main() -> None:
    # 第 1 棒：planner 产出计划
    plan = await planner.ask("任务：为一个开源库写一篇发布公告。")
    print("[planner]", plan.body)

    # 第 2 棒：把 planner 的输出作为 critic 的输入，完成一轮接力对话
    review = await critic.ask(f"请评审这份计划：\n{plan.body}")
    print("[critic ]", review.body)


if __name__ == "__main__":
    asyncio.run(main())
