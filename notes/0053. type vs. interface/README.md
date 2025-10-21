# [0053. type vs. interface](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0053.%20type%20vs.%20interface)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🆚 `type` vs. `interface`](#3--type-vs-interface)
- [4. 🤔 官方建议如何选择 `type` 或 `interface` 呢？【官方建议】](#4--官方建议如何选择-type-或-interface-呢官方建议)
- [5. 🤔 什么时候使用 `type`，什么时候使用 `interface`？【个人经验】](#5--什么时候使用-type什么时候使用-interface个人经验)
- [6. 🔗 引用](#6--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- type vs. interface

## 2. 🫧 评价

- 如果你能用 `interface`，就用 `interface`；如果不能（比如需要联合类型），就用 `type`。

## 3. 🆚 `type` vs. `interface`

| 特性 | `type` | `interface` |
| --- | --- | --- |
| 定义对象 | ✅ | ✅ |
| 定义联合/交叉类型 | ✅ | ❌ |
| 定义原始类型别名 | ✅ (`type ID = string`) | ❌ |
| 自动合并（declaration merging） | ❌ | ✅（同名 interface 会自动合并） |
| 继承（extends） | 用 `&` 交叉 | 用 `extends` |
| 计算属性（mapped types） | ✅ | ❌ |
| 调试显示 | 显示别名（可展开） | 显示结构 |

官方建议（TypeScript Handbook）： "尽可能使用 `interface`，除非你需要 `type` 的特定功能。"

## 4. 🤔 官方建议如何选择 `type` 或 `interface` 呢？【官方建议】

[Differences Between Type Aliases and Interfaces][1]

For the most part, you can choose based on personal preference, and TypeScript will tell you if it needs something to be the other kind of declaration. If you would like a heuristic, use interface until you need to use features from type.

大多数情况下，你可以根据个人偏好选择，TypeScript 会在需要另一种声明时提示你。如果需要一个启发式方法，可先使用 interface ，直到你需要使用来自 type 的特性为止。

## 5. 🤔 什么时候使用 `type`，什么时候使用 `interface`？【个人经验】

- 用 `interface`：公共 API 的对象结构（尤其是可扩展的）、需要继承或声明合并的场景、描述类实现的契约、……
- 用 `type`：联合类型、元组、原始类型别名、复杂类型操作（如定义工具类型）、一次性类型定义、……

## 6. 🔗 引用

- [handbook - everyday types - Differences Between Type Aliases and Interfaces][1]
  - ts doc -> 类型别名和接口之间的差异

[1]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces
