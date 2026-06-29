# [0191. infer 关键字](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0191.%20infer%20%E5%85%B3%E9%94%AE%E5%AD%97)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. infer 关键字是什么？](#3-infer-关键字是什么)
  - [3.1. `ReturnType` 工具类型的实现原理](#31-returntype-工具类型的实现原理)
  - [3.2. `infer` 可以出现在“条件类型模式 Pattern”匹配的任何位置](#32-infer-可以出现在条件类型模式-pattern匹配的任何位置)
- [4. 多个 infer 嵌套的类型推断优先级是？](#4-多个-infer-嵌套的类型推断优先级是)
- [5. 引用](#5-引用)

<!-- endregion:toc -->

## 1. 本节内容

- `infer` 关键字的基本概念和语法
- 使用 `infer` 推断各种类型
- 多个 `infer` 嵌套的类型推断优先级

## 2. 评价

TS 中的 `infer` 关键字是 TS 4.7 中新增的关键字，主要在在条件模式匹配过程中提取类型，你可以通过修改模式匹配的写法，提取特定位置的类型信息（比如数组/元组的第一个/最后一个成员类型，指定位置的函数参数类型，等等）。

## 3. infer 关键字是什么？

TS 中的 `infer` 关键字主要在条件类型中用于类型推断。

- `infer` 只能在条件类型的 `extends` 子句中使用，这是因为 `infer` 的语义本质是：在模式匹配过程中提取类型
- `infer` 用于声明一个类型变量，让 TS 自动推断其类型
- `infer` 是实现 `ReturnType`、`Parameters` 等内置工具类型的核心
- 使用 `infer` 可以提取复杂类型中的特定部分
- 支持多个 `infer` 同时使用，可以推断多个类型

`infer` 关键字用于在条件类型中声明一个待推断的类型变量。

### 3.1. `ReturnType` 工具类型的实现原理

分析 `ReturnType` 工具类型的实现原理，以此来了解 `infer` 的工作原理。

```ts
// 基本语法：T extends Pattern ? infer R : FallbackType
// 解释：
// 1. T extends Pattern：检查类型 T 是否符合 Pattern 模式
// 2. infer R：如果匹配成功，则从 Pattern 中提取特定位置，并命名为 R
// 3. ? R : FallbackType：如果匹配成功，返回推断出的 R；否则返回 FallbackType

// TS 内置的工具类型 ReturnType 的定义：
// type ReturnType<T extends (...args: any) => any> =
// T extends (...args: any) => infer R ? R : any
//
// 1. 外层约束：T extends (...args: any) => any
//    - 限制 ReturnType 只能接受函数类型
//    - 这是泛型约束，确保类型安全
// 2. 条件类型：T extends (...args: any) => infer R ? R : any
//    - 检查 T 是否匹配函数模式 (...args: any) => infer R
//    - infer R 表示：“从函数的返回类型位置提取一个类型，命名为 R”
//    - 如果匹配成功 -> 返回推断出的 R（函数返回类型）
//    - 如果匹配失败 -> 返回 any（实际上由于外层约束，这种情况不会发生）
//
// 关键点：
// - infer 是在“模式匹配”过程中工作的
// - (...args: any) => infer R 是一个“带捕获孔的模式”
// - R 的类型是在匹配时动态推断出来的，不是预先声明的

function getString(): string {
  return 'hello'
}

type R = ReturnType<typeof getString> // string
// R 被推断为 string，因为 getString 的返回类型是 string

// ReturnType 的工作过程解析：
// 1. typeof getString -> () => string
// 2. ReturnType<() => string> -> 触发条件类型
// 3. 检查：() => string 是否匹配 (...args: any) => infer R
//    匹配！因为：
//    - 参数模式 (...args: any) 匹配空参数 ()
//    - 返回位置：infer R 捕获到 string
// 4. 推断结果：R = string
// 5. 返回：R（即 string）
```

### 3.2. `infer` 可以出现在“条件类型模式 Pattern”匹配的任何位置

🤔 Pattern 模式是什么？

就是 `extends` 之后 `?` 之前的那一坨内容。

以下是 infer 经常出现的一些位置示例：

1. 函数返回值位置
2. 函数参数位置
3. 数组元素位置
4. 对象属性值位置
5. …… 等等

::: code-group

```ts [1]
// TS 内置的工具类型 ReturnType 的定义：
// type ReturnType<T extends (...args: any) => any> =
// T extends (...args: any) => infer R ? R : any

type T1 = ReturnType<() => string> // string
type T2 = ReturnType<(x: number) => number> // number
```

```ts [2]
type FirstParameter<T> = T extends (arg: infer P, ...args: any[]) => any
  ? P
  : never

type T1 = FirstParameter<(x: string) => void> // string
type T2 = FirstParameter<(x: number, y: string) => void> // number
```

```ts [3]
type ArrayElement<T> = T extends (infer E)[] ? E : never

type T1 = ArrayElement<string[]> // string
type T2 = ArrayElement<number[]> // number
```

```ts [4]
type PropertyType<T> = T extends { value: infer V } ? V : never

type T1 = PropertyType<{ value: string }> // string
type T2 = PropertyType<{ value: number }> // number
type T3 = PropertyType<{ name: string }> // never
```

:::

## 4. 多个 infer 嵌套的类型推断优先级是？

```ts
type NestedArray<T> = T extends (infer U)[]
  ? U extends (infer V)[]
    ? V
    : U
  : T

// 同时满足的情况下，会优先使用内层的推断结果
type T1 = NestedArray<string[][]> // string
// 分析：
// 外层的条件1：T extends (infer U)[]
// 内层的条件2：U extends (infer V)[]
// string[][] 同时满足外层的条件1和内层的条件2
// 外层条件1 中 U 的推断结果是 string[]
// 内层条件2 中 V 的推断结果是 string

type T2 = NestedArray<string[]> // string
type T3 = NestedArray<string> // string
```

## 5. 引用

- [TypeScript Handbook - Type Inference in Conditional Types][1]
- [TypeScript Handbook - Conditional Types][2]
- [TypeScript 4.7 Release Notes - Improved Type Inference][3]
- [Add 'extends' clause to 'infer' type #48112][4]

[1]: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types
[2]: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
[3]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html
[4]: https://github.com/microsoft/TypeScript/pull/48112
