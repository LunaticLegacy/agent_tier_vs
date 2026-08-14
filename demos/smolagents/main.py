"""smolagents 最小 demo —— CodeAgent + 一个自定义 @tool。

核心抽象：CodeAgent 不让模型输出 JSON 形式的 tool call，而是让它**直接写
Python 代码**，在受限解释器里执行；@tool 装饰器把普通函数（带 docstring 和
类型标注）注册为模型可调用的工具。模型即代码，代码即动作。

配置（Hugging Face 免费推理 endpoint，key 从环境变量读取）:
    export HF_TOKEN=hf_...    # https://huggingface.co/settings/tokens

安装:  pip install smolagents
运行:  python3 main.py
预期输出: agent 写并执行调用 celsius_to_fahrenheit 的代码，打印转换结果。
"""
import os

from smolagents import CodeAgent, InferenceClientModel, tool


@tool
def celsius_to_fahrenheit(celsius: float) -> float:
    """把摄氏温度转换为华氏温度。

    Args:
        celsius: 摄氏温度值。
    """
    return celsius * 9 / 5 + 32


def main() -> None:
    # key 只从环境变量读取；InferenceClientModel 走 HF 免费推理 endpoint，
    # 也可换成 OpenAIServerModel(api_base=..., api_key=os.environ[...]) 接兼容端点。
    model = InferenceClientModel(
        model_id="Qwen/Qwen2.5-Coder-32B-Instruct",
        token=os.environ["HF_TOKEN"],
    )
    agent = CodeAgent(
        tools=[celsius_to_fahrenheit],
        model=model,
        max_steps=4,
        add_base_tools=False,  # 最小化：只保留我们自己的工具
    )
    result = agent.run("把 37.5 摄氏度转换成华氏度，并告诉我结果。")
    print(result)


if __name__ == "__main__":
    main()
