"""LangGraph 最小 demo —— 最小 StateGraph（状态 + 节点 + 边），不依赖 LLM key。

核心抽象：把 agent 流程建模为一张状态机图。State 是一个 TypedDict，节点是
读 state 返回"增量更新"的普通函数，add_edge 决定流转方向，compile() 之后
得到可 invoke 的图。本例用确定性函数代替 LLM 节点，零外部依赖可直接运行。

安装:  pip install langgraph
运行:  python3 main.py
预期输出: 数字流经 double -> decide（条件边），大数走 finalize，打印最终 state。
"""
from typing import TypedDict

from langgraph.graph import END, START, StateGraph


class State(TypedDict):
    """图里流动的共享状态，每个节点返回要合并进去的增量。"""

    value: int
    log: list[str]


def double(state: State) -> dict:
    return {"value": state["value"] * 2, "log": [f"doubled to {state['value'] * 2}"]}


def finalize(state: State) -> dict:
    return {"log": [f"final value {state['value']} is big enough"]}


def route(state: State) -> str:
    """条件边：根据当前 state 决定下一个节点名。"""
    return "finalize" if state["value"] >= 10 else "double"


# 组装图：声明 state 类型 -> 加节点 -> 加边（含条件边）-> 编译
builder = StateGraph(State)
builder.add_node("double", double)
builder.add_node("finalize", finalize)
builder.add_edge(START, "double")
builder.add_conditional_edges("double", route, {"double": "double", "finalize": "finalize"})
builder.add_edge("finalize", END)
graph = builder.compile()

# 让 list 字段可累加需要 Annotated reducers；这里保持最小，直接覆盖即可。
if __name__ == "__main__":
    result = graph.invoke({"value": 3, "log": []})
    print("final state:", result)
