# LangGraph 最小 Demo

最小 StateGraph：状态 + 节点 + 条件边，用确定性函数代替 LLM，**零 API key 可直接运行**。

## 核心概念（4 行版）

- **State**：一个 TypedDict，是在图里流动的共享状态；节点返回的是要合并的增量。
- **节点**：`state -> dict` 的普通函数，真实场景里这里放 LLM 调用或工具执行。
- **边**：`add_edge` 固定流转，`add_conditional_edges` 用路由函数按 state 决定去向。
- `compile()` 得到可 `invoke` 的图；持久化、中断、human-in-the-loop 都挂在图这一层。

## 安装

```bash
pip install langgraph
```

## 运行

```bash
python3 main.py
```

## 预期输出

value=3 经 double 循环翻倍到 12 后走 finalize：

```
final state: {'value': 12, 'log': ['final value 12 is big enough']}
```

仅语法验证，未连接真实 LLM 实机运行（节点为确定性函数）。
