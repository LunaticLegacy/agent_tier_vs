"""llmfetcher 最小 demo —— 用真实 llmfetcher API 造一个带自定义工具的 agent。

核心抽象（三层，刚好对应下面三段代码）:
- LLMFetcher: provider-neutral 的后端 fetcher。一张 LLMBackendConfig 表描述
  provider/model/key/url/超时/重试，屏蔽各家 SDK 差异，可挂多后端做容错。
- Agent: 拥有模型循环（model loop）——发消息、解析 tool_calls、执行 handler、
  回填结果，直到模型直接回答。调用方只看到一个同步的 run()。
- Tool = 普通 callable + ToolSchema（参数描述）。add_tool 注册即用，无需继承。

配置（全部走环境变量，指向任意 OpenAI 兼容 endpoint）:
    export LLM_API_KEY=sk-...                       # 必填
    export LLM_BASE_URL=https://api.deepseek.com    # 可选
    export LLM_MODEL=deepseek-chat                  # 可选

安装（未发 PyPI，需 Python>=3.12，从源码安装）:
    git clone https://github.com/LunaticLegacy/llmfetcher.git
    cd llmfetcher && pip install -e .
运行: python3 main.py
预期输出: 模型先调用 convert_size 工具，再用结果回答，最后打印 token 用量。
"""
import os

from llmfetcher import Agent, LLMBackendConfig, LLMFetcher, Tool
from llmfetcher.llm_types import ToolParameter, ToolSchema

# 1) provider-neutral fetcher：key 只从环境变量读取，绝不硬编码
fetcher = LLMFetcher([
    LLMBackendConfig(
        name="primary",
        provider="openai",  # OpenAI 兼容协议，api_url 可指向任意兼容 endpoint
        model=os.environ.get("LLM_MODEL", "deepseek-chat"),
        api_key=os.environ["LLM_API_KEY"],
        api_url=os.environ.get("LLM_BASE_URL", "https://api.deepseek.com"),
        timeout=90,
        max_retries=1,
    )
])

# 2) Agent 拥有模型循环：rounds/tokens 上限在这里收口
agent = Agent(
    llm_fetcher=fetcher,
    system_prompt="你是助手，需要换算存储尺寸时调用 convert_size 工具。",
    default_max_rounds=6,
    default_max_tokens=2048,
)


def convert_size(size: str) -> str:
    """自定义 tool：普通同步函数。真实场景可换成任意 HTTP fetch / DB 查询。"""
    units = {"KB": 1024, "MB": 1024**2, "GB": 1024**3}
    num, unit = float(size[:-2]), size[-2:].upper()
    return f"{size} = {int(num * units[unit]):,} bytes"


# 3) Tool = callable + schema，add_tool 注册
agent.add_tool(Tool(
    name="convert_size",
    description="把带单位的存储尺寸（如 750MB）换算成字节数",
    schemas=ToolSchema(properties=[
        ToolParameter(name="size", type="string", description="带 KB/MB/GB 单位的尺寸，如 '750MB'"),
    ]),
    handler=convert_size,
))

if __name__ == "__main__":
    result = agent.run("我的视频是 750MB，等于多少字节？")  # 同步，返回 LLMOutput
    print(result.content)
    print(f"total tokens: {agent.usage.total_tokens}")
