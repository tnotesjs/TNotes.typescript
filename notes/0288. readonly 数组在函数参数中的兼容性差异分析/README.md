# [0288. readonly 数组在函数参数中的兼容性差异分析](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0288.%20readonly%20%E6%95%B0%E7%BB%84%E5%9C%A8%E5%87%BD%E6%95%B0%E5%8F%82%E6%95%B0%E4%B8%AD%E7%9A%84%E5%85%BC%E5%AE%B9%E6%80%A7%E5%B7%AE%E5%BC%82%E5%88%86%E6%9E%90)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 如果使用只读数组约束函数参数，那么该参数可以接收普通数组吗？](#3--如果使用只读数组约束函数参数那么该参数可以接收普通数组吗)
  - [3.1. 先说答案](#31-先说答案)
  - [3.2. 知识点回顾](#32-知识点回顾)
  - [3.3. 示例 1 - 满足结论](#33-示例-1---满足结论)
  - [3.4. 示例 2 - 与结论冲突](#34-示例-2---与结论冲突)
  - [3.5. 现象分析](#35-现象分析)
  - [3.6. 解释说明](#36-解释说明)
- [4. 🔗 引用](#4--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- readonly 数组在函数参数中的类型兼容规则

## 2. 🫧 评价

这篇笔记的核心只探讨一个问题：“如果使用只读数组约束函数参数，那么该参数可以接收普通数组吗？”

理清楚这个问题，可以帮我们更好地理解逆变策略。

先给出结论：函数参数的“逆变”只在函数类型赋值时生效。而在函数调用时，TypeScript 采用“单向兼容”检查，因此允许将 `number[]` 传给 `readonly number[]` 参数。

## 3. 🤔 如果使用只读数组约束函数参数，那么该参数可以接收普通数组吗？

### 3.1. 先说答案

答：得具体看是函数赋值还是参数赋值。

- 函数赋值：只读数组参数「不可以」接收普通数组
- 参数赋值：只读数组参数「可以」接收普通数组

### 3.2. 知识点回顾

::: tip 💡 知识点回顾：

1. 协变策略：子可以赋值给父，父不能赋值给子；
2. 逆变策略：父可以赋值给子，子不能赋值给父；
3. 函数的参数采用的是逆变策略；
4. `readonly number[]` 是父，`number[]` 是子；

:::

根据上述知识点，我们会得到这样一条结论：逆变策略下，子（`number[]`）不能赋值给父（`readonly number[]`），因此如果在函数参数中使用只读数组进行约束，不能传入普通数组。

### 3.3. 示例 1 - 满足结论

```ts
type FuncWithReadonly = (a: readonly string[]) => void
type Func = (a: string[]) => void

let f1: FuncWithReadonly = (a: readonly string[]) => {}
let f2: Func = (a: string[]) => {}

f2 = f1 // ✅ 兼容
// f1 = f2 // ❌ 不兼容
// 报错信息：
// Type 'Func' is not assignable to type 'FuncWithReadonly'.
//   Types of parameters 'a' and 'a' are incompatible.
//     The type 'readonly string[]' is 'readonly' and cannot be assigned to the mutable type 'string[]'.(2322)
```

常规逻辑：

- 父类型是：`readonly string[]`
- 子类型是：`string[]`
- `readonly string[] = string[]` ✅
  - 类比：可读可写的编辑器可以被用作只读的编辑器；
- `string[] = readonly string[]` ❌
  - 只读的编辑器无法被用作可读可写的编辑器；

用在函数参数层面，正好反转：

- `readonly string[] = string[]` ❌
- `string[] = readonly string[]` ✅

### 3.4. 示例 2 - 与结论冲突

```ts
// 参数约束为只读数组
function sum(numbers: readonly number[]): number {
  return numbers.reduce((total, n) => total + n, 0)
}

// 参数约束为普通数组
function badSum(numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0)
}

const arr1 = [1, 2, 3]
const arr2: readonly number[] = [1, 2, 3]

sum(arr1) // ✅ 可以传入普通数组【⚠️ 注意：这里和我们得出的结论冲突】
sum(arr2) // ✅ 可以传入只读数组

badSum(arr1) // ✅ 可以传入普通数组
// badSum(arr2) // ❌ Error: readonly 不能赋值给 mutable
```

官方原话：`when we see a function that consumes ReadonlyArrays, it tells us that we can pass any array into that function without worrying that it will change its contents.`

![官方原话](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-11-14-47-54.png)

### 3.5. 现象分析

在前面的示例中，我们发现了一个看似“违反类型系统逻辑”的现象：

- 函数类型层面（示例 1）
  - `(a: readonly string[]) => void` 和 `(a: string[]) => void` 互不完全兼容。
  - 参数位置受逆变规则约束，因此：
    - ✅ `string[] = readonly string[]` （子赋给父）是允许的；
    - ❌ `readonly string[] = string[]` （父赋给子）是不允许的。
- 调用层面（示例 2）
  - `function sum(numbers: readonly number[])` 竟然可以被传入一个 `number[]`。
  - 这似乎与“逆变”相矛盾。

### 3.6. 解释说明

这是“函数类型赋值”与“函数调用传参”的概念差异导致的。

- “函数类型赋值”：这是两个函数签名之间的兼容性问题 -> 要遵循“逆变策略”
- “函数调用传参”：这是值层面的赋值问题 -> 要遵循“协变策略”

二者的关键区别：

| 对比点                            | 函数类型赋值   | 函数调用传参     |
| --------------------------------- | -------------- | ---------------- |
| 赋值对象                          | 函数与函数之间 | 值与函数参数之间 |
| 检查策略                          | 逆变           | 协变             |
| `readonly T[]` 参数能否接受 `T[]` | ❌ 不行        | ✅ 可以          |

## 4. 🔗 引用

- [Handbook: Object Types - The ReadonlyArray Type][1]

[1]: https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties
