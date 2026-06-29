# [0084. 数组的类型推断](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0084.%20%E6%95%B0%E7%BB%84%E7%9A%84%E7%B1%BB%E5%9E%8B%E6%8E%A8%E6%96%AD)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. TypeScript 如何推断数组类型？](#3-typescript-如何推断数组类型)
  - [3.1. 基本推断规则](#31-基本推断规则)
  - [3.2. 类型推断示例](#32-类型推断示例)
- [4. 数组的不同初始化方式的类型推断结果是？](#4-数组的不同初始化方式的类型推断结果是)
  - [4.1. 方式 1：字面量初始化](#41-方式-1字面量初始化)
  - [4.2. 方式 2：构造函数](#42-方式-2构造函数)
  - [4.3. 方式 3：Array.of 和 Array.from](#43-方式-3arrayof-和-arrayfrom)
- [5. 混合类型数组的类型推断结果是？](#5-混合类型数组的类型推断结果是)
  - [5.1. 联合类型推断](#51-联合类型推断)
  - [5.2. 对象类型的合并](#52-对象类型的合并)
  - [5.3. null 和 undefined 的处理](#53-null-和-undefined-的处理)
- [6. 空数组的类型推断结果是？](#6-空数组的类型推断结果是)
- [7. const 断言对数组类型推断有什么影响？](#7-const-断言对数组类型推断有什么影响)
  - [7.1. 普通推断 vs const 断言](#71-普通推断-vs-const-断言)
  - [7.2. const 断言的特性](#72-const-断言的特性)
- [8. 何时使用 const 断言？](#8-何时使用-const-断言)
- [9. 数组类型推断的常见问题都有哪些？](#9-数组类型推断的常见问题都有哪些)
  - [9.1. 问题 1：推断类型过于宽松](#91-问题-1推断类型过于宽松)
  - [9.2. 问题 2：对象数组属性不统一](#92-问题-2对象数组属性不统一)
  - [9.3. 问题 3：函数返回数组类型推断](#93-问题-3函数返回数组类型推断)
- [10. 最佳实践总结](#10-最佳实践总结)
- [11. 引用](#11-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 数组类型推断规则
- 空数组的处理
- 混合类型的推断
- const 断言的作用
- 类型推断的最佳实践

## 2. 评价

TS 的类型推断系统能够自动推断数组的类型，大多数情况下不需要手动标注。

- 数组类型推断基于元素的类型自动进行，减少了类型标注的工作量
- 空数组的推断行为受配置影响，可能是 `never[]` 或者 `any[]` 类型，但这两个类型通常都不是我们想要的，最好给空数组显式标注类型
- 混合类型数组会自动推断为联合类型，如 `(string | number)[]`
- 使用 `as const` 断言可以将数组推断为只读元组，获得更精确的字面量类型
- ……

TS 对数组的类型推断还是比较符合直觉的，快速过一遍本文的示例代码，大部分都是很好理解的。

需要注意的是，如果我们依赖 TS 来自动完成数组的类型推断，可能会有类型过于宽泛的问题，如果我们确实需要更精确的类型约束，可以考虑显式指定类型。

## 3. TypeScript 如何推断数组类型？

### 3.1. 基本推断规则

TypeScript 根据数组元素的类型推断数组的类型：

```ts
// 单一类型
const numbers = [1, 2, 3]
// 推断类型：number[]

const strings = ['a', 'b', 'c']
// 推断类型：string[]

const booleans = [true, false, true]
// 推断类型：boolean[]

// 对象类型
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
]
// 推断类型：{ id: number; name: string }[]
```

### 3.2. 类型推断示例

::: code-group

```ts [自动推断]
// ✅ TypeScript 自动推断
const numbers = [1, 2, 3]

numbers.push(4) // ✅ 正确
numbers.push('5') // ❌ Error: Argument of type 'string' is not assignable to parameter of type 'number'

const first: number = numbers[0] // ✅
const second: string = numbers[1] // ❌ Error
```

```ts [显式标注]
// ✅ 手动标注（不推荐，除非必要）
const numbers: number[] = [1, 2, 3]

// 推断结果相同
```

:::

## 4. 数组的不同初始化方式的类型推断结果是？

### 4.1. 方式 1：字面量初始化

```ts
// ✅ 直接从元素推断
const arr1 = [1, 2, 3]
// 类型：number[]

const arr2 = ['a', 'b']
// 类型：string[]

const arr3 = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
]
// 类型：{ id: number; name: string }[]
```

### 4.2. 方式 2：构造函数

```ts
// ⚠️ 需要泛型参数
const arr1 = new Array<number>()
// 类型：number[]

const arr2 = new Array<string>(3)
// 类型：string[]，长度为 3 的数组

// ❌ 不提供泛型，推断为 any[]
const arr3 = new Array()
// 类型：any[]（不推荐）
```

### 4.3. 方式 3：Array.of 和 Array.from

```ts
// ✅ Array.of：从参数推断
const arr1 = Array.of(1, 2, 3)
// 类型：number[]

const arr2 = Array.of('a', 'b')
// 类型：string[]

// ✅ Array.from：从可迭代对象推断
const arr3 = Array.from('hello')
// 类型：string[]

const arr4 = Array.from([1, 2, 3], (x) => x * 2)
// 类型：number[]

const arr5 = Array.from({ length: 3 }, (_, i) => i)
// 类型：number[]
```

## 5. 混合类型数组的类型推断结果是？

### 5.1. 联合类型推断

```ts
// ✅ 自动推断为联合类型
const mixed1 = [1, 'two', 3, 'four']
// 类型：(string | number)[]

const mixed2 = [true, 1, 'hello']
// 类型：(string | number | boolean)[]

const mixed3 = [
  { type: 'user', name: 'Alice' },
  { type: 'admin', level: 5 },
]
// 类型：({ type: string; name: string; level?: undefined } | { type: string; level: number; name?: undefined })[]
```

### 5.2. 对象类型的合并

```ts
// TypeScript 会合并对象的所有属性
const objects = [
  { id: 1, name: 'Alice' },
  { id: 2, email: 'bob@example.com' },
]
// 类型：({ id: number; name: string; email?: undefined } | { id: number; email: string; name?: undefined })[]

// 更好的方式：使用统一的接口
interface User {
  id: number
  name?: string
  email?: string
}

const users: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, email: 'bob@example.com' },
]
```

### 5.3. null 和 undefined 的处理

```ts
// ✅ strictNullChecks: true
const arr1 = [1, 2, null]
// 类型：(number | null)[]

const arr2 = ['a', undefined, 'b']
// 类型：(string | undefined)[]

const arr3 = [1, null, undefined]
// 类型：(number | null | undefined)[]

// ⚠️ 如果 strictNullChecks: false 那么 null 会被忽略
const arr4 = [1, 2, null]
// 类型：number[]（null 被忽略）
```

## 6. 空数组的类型推断结果是？

没有声明类型的空数组，默认会被 TypeScript 视作一个 any 类型的数组。

如果开启了 strictNullChecks 配置，并且关闭了 noImplicitAny 配置，那么 TypeScript 会将没有声明类型的空数组视作一个 never 类型的数组。否则会被推断为 `any[]`。

::: code-group

```ts [any 数组]
// tsconfig.json 不满足：
// {
//   "compilerOptions": {
//     "strictNullChecks": true,
//     "noImplicitAny": false
//   }
// }

const arr = []

// 等效
// const arr: any[]

arr.push(1, 2, 3) // ✅ ok
```

```ts [never 数组]
// tsconfig.json 满足：
// {
//   "compilerOptions": {
//     "strictNullChecks": true,
//     "noImplicitAny": false
//   }
// }

const arr = []

// 等效
// const arr: never[]

arr.push(1, 2, 3) // ❌ error
// Argument of type 'number' is not assignable to parameter of type 'never'.
```

:::

不要让依赖 TS 推断空数组的类型，无论是推断为 `any[]` 还是 `never[]` 通常都不是我们想要的结果，最佳实践：显式标注空数组的类型。

```ts
// ✅ 方法 1：标注变量类型
const numbers: number[] = []
numbers.push(1) // ✅
numbers.push(2) // ✅

// ✅ 方法 2：标注为联合类型
const mixed: (string | number)[] = []
mixed.push(1) // ✅
mixed.push('a') // ✅

// ✅ 方法 3：使用泛型语法
const items: Array<string> = []
items.push('hello') // ✅
```

## 7. const 断言对数组类型推断有什么影响？

### 7.1. 普通推断 vs const 断言

::: code-group

```ts [普通推断]
// 推断为宽松类型
const numbers = [1, 2, 3]
// 类型：number[]

const strings = ['a', 'b', 'c']
// 类型：string[]

const tuple = [1, 'hello', true]
// 类型：(string | number | boolean)[]
```

```ts [const 断言]
// 推断为字面量类型
const numbers = [1, 2, 3] as const
// 类型：readonly [1, 2, 3]

const strings = ['a', 'b', 'c'] as const
// 类型：readonly ["a", "b", "c"]

const tuple = [1, 'hello', true] as const
// 类型：readonly [1, "hello", true]
```

:::

### 7.2. const 断言的特性

```ts
const config = {
  colors: ['red', 'green', 'blue'],
  sizes: [10, 20, 30],
} as const

// colors 类型：readonly ["red", "green", "blue"]
// sizes 类型：readonly [10, 20, 30]

// ❌ 不能修改
config.colors[0] = 'yellow' // ❌ Error
config.colors.push('yellow') // ❌ Error

// ✅ 可以读取，且类型精确
const firstColor: 'red' = config.colors[0] // ✅
const firstSize: 10 = config.sizes[0] // ✅
```

## 8. 何时使用 const 断言？

```ts
// ✅ 场景 1：配置常量
const ROUTES = ['/home', '/about', '/contact'] as const
type Route = (typeof ROUTES)[number] // '/home' | '/about' | '/contact'

// ✅ 场景 2：枚举值
const STATUSES = ['pending', 'approved', 'rejected'] as const
type Status = (typeof STATUSES)[number] // 'pending' | 'approved' | 'rejected'

// ✅ 场景 3：元组
const point = [100, 200] as const
// 类型：readonly [100, 200]

function drawPoint(point: readonly [number, number]) {
  const [x, y] = point
  console.log(`Drawing at (${x}, ${y})`)
}

drawPoint(point) // ✅
```

## 9. 数组类型推断的常见问题都有哪些？

### 9.1. 问题 1：推断类型过于宽松

::: code-group

```ts [问题]
// 推断为 (string | number)[]，但实际想要更精确的类型
const data = ['name', 25, 'email', 'user@example.com']
// 类型：(string | number)[]
```

```ts [解决方案 1：元组]
// 使用元组类型
const data: [string, number, string, string] = [
  'name',
  25,
  'email',
  'user@example.com',
]

// 或使用 as const
const data = ['name', 25, 'email', 'user@example.com'] as const
// 类型：readonly ["name", 25, "email", "user@example.com"]
```

```ts [解决方案 2：结构化]
// 更好的方式：使用对象
const data = {
  name: 'name',
  age: 25,
  email: 'user@example.com',
}
// 类型明确且易读
```

:::

### 9.2. 问题 2：对象数组属性不统一

```ts
// ❌ 推断出的类型复杂且不准确
const items = [
  { id: 1, name: 'Alice' },
  { id: 2, age: 25 },
]
// 类型：({ id: number; name: string; age?: undefined } | { id: number; age: number; name?: undefined })[]

// ✅ 解决方案：定义统一接口
interface Item {
  id: number
  name?: string
  age?: number
}

const items: Item[] = [
  { id: 1, name: 'Alice' },
  { id: 2, age: 25 },
]
```

### 9.3. 问题 3：函数返回数组类型推断

```ts
// ❌ 返回类型推断为 (string | number)[]
function getData() {
  return [1, 'two', 3]
}

const data = getData()
// 类型：(string | number)[]

// ✅ 解决方案 1：显式返回类型
function getData(): [number, string, number] {
  return [1, 'two', 3]
}

// ✅ 解决方案 2：const 断言
function getData() {
  return [1, 'two', 3] as const
}
// 返回类型：readonly [1, "two", 3]
```

## 10. 最佳实践总结

```ts
// ✅ 1. 非空数组让 TypeScript 自动推断
const numbers = [1, 2, 3] // 推荐

// ✅ 2. 空数组显式标注类型
const users: User[] = []

// ✅ 3. 混合类型考虑使用联合类型或接口
const mixed: (string | number)[] = []

// ✅ 4. 常量配置使用 as const
const COLORS = ['red', 'green', 'blue'] as const

// ✅ 5. 需要精确类型时使用元组
const point: [number, number] = [10, 20]

// ✅ 6. 函数返回值考虑显式标注
function getItems(): Item[] {
  return []
}

// ✅ 7. 避免过于复杂的推断，使用明确的类型
interface Config {
  items: Item[]
}
const config: Config = { items: [] }
```

## 11. 引用

- [TypeScript Handbook - Type Inference][1]
- [TypeScript 3.4 - const assertions][2]

[1]: https://www.typescriptlang.org/docs/handbook/type-inference.html
[2]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions
