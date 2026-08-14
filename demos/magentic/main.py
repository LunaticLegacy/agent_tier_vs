"""magentic 最小 demo —— @prompt 装饰器把 LLM 调用变成类型化函数。

核心抽象：不写 agent 循环、不拼消息列表——给一个**没有函数体**的 Python
函数加上 @prompt 模板，签名（参数 + 返回类型标注）即结构化输出的契约，
调用函数就是调用 LLM，返回值直接是声明的 Python 类型。

配置（key 只从环境变量读取，magentic 使用 openai SDK 的标准变量）:
    export OPENAI_API_KEY=sk-...
    export OPENAI_BASE_URL=https://api.deepseek.com   # 可选，兼容 endpoint

安装:  pip install magentic
运行:  python3 main.py
预期输出: 打印一个 CountryFacts pydantic 对象（国家、首都、人口量级）。
"""
from pydantic import BaseModel, Field

from magentic import prompt


class CountryFacts(BaseModel):
    """一个国家的基本事实卡片。"""

    capital: str = Field(..., description="首都")
    population_millions: float = Field(..., description="人口，单位百万")
    fun_fact: str = Field(..., description="一条有趣的冷知识")


@prompt(
    "给我一张关于 {country} 的事实卡片。",
    model=None,  # None -> 默认 openai 模型；也可传 OpenaiChatModel("gpt-4o-mini")
)
def make_facts(country: str) -> CountryFacts: ...


if __name__ == "__main__":
    # 调用这个"空"函数 = 一次带结构化输出约束的 LLM 请求
    facts = make_facts("日本")
    print(f"首都: {facts.capital}")
    print(f"人口: {facts.population_millions} 百万")
    print(f"冷知识: {facts.fun_fact}")
