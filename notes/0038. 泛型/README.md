# [0038. 泛型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0038.%20%E6%B3%9B%E5%9E%8B)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 泛型速览](#3-泛型速览)
- [4. 什么是"泛型"？](#4-什么是泛型)
  - [4.1. 核心概念](#41-核心概念)
  - [4.2. 为什么需要泛型？](#42-为什么需要泛型)
  - [4.3. 泛型的基本语法](#43-泛型的基本语法)
  - [4.4. 泛型的优势](#44-泛型的优势)
  - [4.5. 常见的泛型应用场景](#45-常见的泛型应用场景)
  - [4.6. 泛型命名约定](#46-泛型命名约定)

<!-- endregion:toc -->

## 1. 本节内容

- 泛型

## 2. 评价

本节主要对本章泛型的相关内容做一个汇总，对泛型做一个粗略的基本介绍，有关泛型的具体细节内容，见相关笔记。

## 3. 泛型速览

<N :ids="['0115', '0116', '0117', '0118', '0121', '0122']" />

## 4. 什么是"泛型"？

泛型（Generics）是一种参数化类型的机制，允许在定义函数、类或接口时使用类型参数，从而在使用时才指定具体的类型。

### 4.1. 核心概念

泛型就像一个“类型占位符”或“类型变量”，它让我们能够编写可复用的、类型安全的代码，而不需要为每种数据类型都写一遍重复的逻辑。

### 4.2. 为什么需要泛型？

在没有泛型之前，我们面临两难的选择：

1. 使用 `any` 类型：失去类型安全
2. 为每种类型编写重复代码：代码冗余，难以维护

泛型提供了第三种选择：既保持类型安全，又实现代码复用。

示例：

1. 使用 `any`（类型不安全）
2. 重复编写代码（代码冗余）
3. 使用泛型（最佳方案）

::: code-group

```ts [1]
// ❌ 使用 any 类型
function identity(value: any): any {
  return value
}

const num = identity(42)
const str = identity('hello')

// ⚠️ 失去类型安全
num.toFixed(2) // 可以调用，但如果传入的是字符串就会报错
str.toUpperCase() // 可以调用，但如果传入的是数字就会报错
```

```ts [2]
// ❌ 为每种类型编写重复代码
function identityNumber(value: number): number {
  return value
}

function identityString(value: string): string {
  return value
}

function identityBoolean(value: boolean): boolean {
  return value
}

// ⚠️ 代码冗余，难以维护
const num = identityNumber(42)
const str = identityString('hello')
const bool = identityBoolean(true)
```

```ts [3]
// ✅ 使用泛型
function identity<T>(value: T): T {
  return value
}

const num = identity(42) // T 被推断为 number
const str1 = identity('hello') // T 被推断为 "hello"（如果是使用 const 定义的变量，TS 会将字符串推断为更加具体的字面量类型）
// let str2 = identity('hello') // T 被推断为 string
const bool = identity(true) // T 被推断为 boolean

// ✅ 类型安全
num.toFixed(2) // ✅ 正确，num 是 number 类型
str1.toUpperCase() // ✅ 正确，str 是 string 类型
bool && console.log('yes') // ✅ 正确，bool 是 boolean 类型
```

:::

### 4.3. 泛型的基本语法

泛型使用尖括号 `<>` 来定义类型参数，通常使用单个大写字母命名（如 `T`、`K`、`V` 等）。

```ts
// 泛型函数
function func<T>(param: T): T {
  return param
}

// 泛型接口
interface Box<T> {
  value: T
}

// 泛型类
class Container<T> {
  constructor(public value: T) {}
}

// 泛型类型别名
type Pair<T, U> = {
  first: T
  second: U
}
```

### 4.4. 泛型的优势

| 优势     | 说明                                      |
| -------- | ----------------------------------------- |
| 类型安全 | 在编译时捕获类型错误，避免运行时异常      |
| 代码复用 | 一套代码适用于多种类型，减少重复          |
| 类型推断 | TypeScript 能自动推断泛型参数，使用更便捷 |
| 灵活性   | 可以通过泛型约束来限制类型参数的范围      |
| 可读性   | 明确表达代码意图，提升代码的可维护性      |

### 4.5. 常见的泛型应用场景

```ts
// 1. 数组操作
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0]
}

const firstNum = getFirst([1, 2, 3]) // number | undefined
const firstName = getFirst(['a', 'b', 'c']) // string | undefined

// 2. Promise 异步操作
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url)
  return response.json()
}

interface User {
  id: number
  name: string
}

;(async () => {
  const user = await fetchData<User>('/api/user') // user 类型为 User
  console.log(user)
})()

// 3. 数据容器
class Stack<T> {
  private items: T[] = []

  push(item: T): void {
    this.items.push(item)
  }

  pop(): T | undefined {
    return this.items.pop()
  }
}

const numberStack = new Stack<number>()
numberStack.push(1)
numberStack.push(2)

const stringStack = new Stack<string>()
stringStack.push('hello')
stringStack.push('world')
```

### 4.6. 泛型命名约定

| 命名 | 含义            | 使用场景           |
| ---- | --------------- | ------------------ |
| `T`  | Type（类型）    | 通用类型参数       |
| `K`  | Key（键）       | 对象键类型         |
| `V`  | Value（值）     | 对象值类型         |
| `E`  | Element（元素） | 数组或集合元素类型 |
| `R`  | Result（结果）  | 函数返回值类型     |
| `P`  | Props（属性）   | React 组件属性类型 |
| `S`  | State（状态）   | React 组件状态类型 |

虽然可以使用任意名称，但遵循这些约定可以提高代码的可读性。
