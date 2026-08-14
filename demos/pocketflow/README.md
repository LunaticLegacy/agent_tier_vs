# PocketFlow 最小 Demo

99 行框架的 Node + Flow 最小流程，用 mock 函数演示 prep/exec/post 三段式，**不需要任何 API key**。

## 核心概念（3 行版）

- `Node`：`prep(shared)` 读共享 store → `exec()` 干一件可重试的小事 → `post()` 写回 store 并返回 action。
- `Flow`：用 `node_a - "action" >> node_b` 把节点连成图，action 字符串即路由标签。
- 整个框架约 100 行，没有隐藏抽象——LLM 调用只是 exec 里的一个普通函数。

## 安装

```bash
pip install pocketflow
```

## 运行

```bash
python3 main.py
```

## 预期输出

```
answer : [mock answer to] What is an agent harness?
summary: [mock answer to] TL;DR: [mock answer to] What is an agent harness?
```

仅语法验证，未连接真实 LLM 实机运行（mock 函数代替）。
