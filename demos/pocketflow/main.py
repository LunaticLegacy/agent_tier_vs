"""PocketFlow 最小 demo —— 不依赖 LLM key，用 mock 函数演示三段式节点。

核心抽象：一切皆 Node(prep/exec/post) + Flow(边)。节点共享一个 dict 作为
store，prep 读、exec 算（可重试）、post 写并返回 action 字符串决定下一条边。
本例用 mock_llm 代替真实 LLM 调用，因此可直接运行、零外部服务依赖。

安装:  pip install pocketflow
运行:  python3 main.py
预期输出: store 从 {"question": ...} 流经两个节点，最终打印出 answer。
"""
from pocketflow import Node, Flow


def mock_llm(prompt: str) -> str:
    """假的 LLM：真实场景在这里调用 OpenAI/Anthropic，key 从环境变量读取。"""
    return f"[mock answer to] {prompt}"


class AskNode(Node):
    """prep 读问题 -> exec 调 LLM -> post 写答案。"""

    def prep(self, shared):
        return shared["question"]

    def exec(self, question):
        return mock_llm(question)

    def post(self, shared, prep_res, exec_res):
        shared["answer"] = exec_res
        return "summarize"  # action -> 下一条边


class SummarizeNode(Node):
    """把答案压缩成一句话。"""

    def prep(self, shared):
        return shared["answer"]

    def exec(self, answer):
        return mock_llm(f"TL;DR: {answer}")

    def post(self, shared, prep_res, exec_res):
        shared["summary"] = exec_res
        return "default"


if __name__ == "__main__":
    ask = AskNode()
    summarize = SummarizeNode()
    ask - "summarize" >> summarize  # PocketFlow 用运算符重载声明边

    flow = Flow(start=ask)
    shared = {"question": "What is an agent harness?"}
    flow.run(shared)
    print("answer :", shared["answer"])
    print("summary:", shared["summary"])
