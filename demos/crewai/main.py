"""crewAI 最小 demo —— 两个 role agent 组成的最小 Crew。

核心抽象：crewAI 用"剧组"隐喻组织 agent——Agent 有 role/goal/backstory，
Task 描述要交付什么，Crew 按 process 把 task 依次分派给 agent（顺序执行时
后一个 task 能看到前一个的产出）。

配置（key 只从环境变量读取，指向任意 OpenAI 兼容 endpoint）:
    export OPENAI_API_KEY=sk-...
    export OPENAI_API_BASE=https://api.deepseek.com   # 可选，crewAI 读这个变量
    export MODEL=deepseek-chat                        # 可选

安装:  pip install crewai
运行:  python3 main.py
预期输出: 研究员先产出要点列表，写作者据此输出一段短文。
"""
import os

from crewai import Agent, Crew, Process, Task

# crewAI 经 litellm 调模型；OPENAI_API_KEY / OPENAI_API_BASE 从环境变量读取，
# 绝不硬编码。MODEL 需带 provider 前缀，如 "openai/gpt-4o-mini"。
MODEL = os.environ.get("MODEL", "openai/gpt-4o-mini")

researcher = Agent(
    role="技术研究员",
    goal="把复杂主题提炼成 3 个准确要点",
    backstory="你擅长快速阅读资料并抓住本质，讨厌废话。",
    llm=MODEL,
    verbose=False,
)
writer = Agent(
    role="科普写作者",
    goal="把要点改写成 100 字以内的通俗短文",
    backstory="你能把任何技术话题讲给外行听懂。",
    llm=MODEL,
    verbose=False,
)

research_task = Task(
    description="提炼「什么是 agent harness」的 3 个核心要点。",
    expected_output="3 条要点，每条一句话。",
    agent=researcher,
)
write_task = Task(
    description="根据研究员的要点写一段不超过 100 字的科普短文。",
    expected_output="一段通俗短文，无术语堆砌。",
    agent=writer,
)

crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    process=Process.sequential,  # 最小流程：按顺序接力
)

if __name__ == "__main__":
    print(crew.kickoff())
