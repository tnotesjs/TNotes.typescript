# [0028. type 关键字](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0028.%20type%20%E5%85%B3%E9%94%AE%E5%AD%97)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是 TypeScript 中的 `type` 关键字？](#3--什么是-typescript-中的-type-关键字)
- [4. 🤔 `type` 有哪些常见用法？](#4--type-有哪些常见用法)
- [5. 🆚 `type` vs. `interface`](#5--type-vs-interface)
- [6. 🤔 什么时候使用 `type`，什么时候使用 `interface`？](#6--什么时候使用-type什么时候使用-interface)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- type
- interface

## 2. 🫧 评价

- type 关键字是用来定义类型的，和 interface 关键字非常类似。

## 3. 🤔 什么是 TypeScript 中的 `type` 关键字？

`type` 是 TypeScript 提供的一种声明类型别名（Type Aliases）的方式，让你可以为任意类型（包括原始类型、联合类型、交叉类型、对象字面量等）起一个可读性更强的名字。

`type` 的基本语法：

```ts
type 别名 = 类型
```

## 4. 🤔 `type` 有哪些常见用法？

::: code-group

```ts [1]
// 定义对象结构
type User = {
  id: string
  name: string
  email: string
}

const user: User = {
  id: '1',
  name: 'Alice',
  email: 'alice@example.com',
}
```

```ts [2]
// 定义联合类型/交叉类型（最常用！）

// 联合类型
type Status = 'idle' | 'loading' | 'success' | 'error'
type ID = string | number

// 交叉类型
type A = { x: string }
type B = { y: number }

type C = A & B
```

```ts [3]
// 定义元组（Tuple）
type Point = [number, number]
type RGB = [number, number, number]
```

```ts [4]
// 使用泛型
type ApiResponse<T> = {
  success: boolean
  data: T
  error?: string
}

const userResponse: ApiResponse<User> = {
  success: true,
  data: { id: '1', name: 'Alice', email: '...' },
}
```

```ts [5]
// 定义函数类型
type EventHandler = (event: Event) => void
type Add = (a: number, b: number) => number

const add: Add = (a, b) => a + b
```

```ts [6]
// 用于类型运算 - 与映射类型、条件类型结合（高级用法）

// 将所有属性变为可选
type Partial<T> = {
  [P in keyof T]?: T[P]
}

// 提取对象中值为 string 的属性名
type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never
}[keyof T]
```

:::

## 5. 🆚 `type` vs. `interface`

| 特性 | `type` | `interface` |
| --- | --- | --- |
| 定义对象 | ✅ | ✅ |
| 定义联合/交叉类型 | ✅ | ❌ |
| 定义原始类型别名 | ✅ (`type ID = string`) | ❌ |
| 自动合并（declaration merging） | ❌ | ✅（同名 interface 会自动合并） |
| 继承（extends） | 用 `&` 交叉 | 用 `extends` |
| 计算属性（mapped types） | ✅ | ❌ |
| 调试显示 | 显示别名（可展开） | 显示结构 |

## 6. 🤔 什么时候使用 `type`，什么时候使用 `interface`？

- 优先用 `interface`：定义公共 API、对象结构（尤其是可扩展的）
- 必须用 `type`：联合类型、元组、原始类型别名、映射类型

经验法则：如果你能用 `interface`，就用 `interface`；如果不能（比如需要联合类型），就用 `type`。
