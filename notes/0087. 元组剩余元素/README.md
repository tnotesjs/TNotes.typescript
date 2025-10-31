# [0087. 元组剩余元素](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0087.%20%E5%85%83%E7%BB%84%E5%89%A9%E4%BD%99%E5%85%83%E7%B4%A0)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是元组剩余元素？](#3--什么是元组剩余元素)
- [4. 🤔 如何声明剩余元素？](#4--如何声明剩余元素)
  - [4.1. 基本语法](#41-基本语法)
  - [4.2. 结尾的剩余元素](#42-结尾的剩余元素)
  - [4.3. 开头的剩余元素](#43-开头的剩余元素)
  - [4.4. 中间的剩余元素](#44-中间的剩余元素)
  - [4.5. 多种类型的剩余元素](#45-多种类型的剩余元素)
- [5. 🤔 剩余元素的位置规则](#5--剩余元素的位置规则)
  - [5.1. TypeScript 3.0 - 3.9：只能在结尾](#51-typescript-30---39只能在结尾)
  - [5.2. TypeScript 4.0+：可以在任意位置](#52-typescript-40可以在任意位置)
  - [5.3. 多个剩余元素的限制](#53-多个剩余元素的限制)
  - [5.4. 可选元素与剩余元素](#54-可选元素与剩余元素)
- [6. 🤔 剩余元素的使用场景](#6--剩余元素的使用场景)
  - [6.1. 场景 1：可变参数函数](#61-场景-1可变参数函数)
  - [6.2. 场景 2：concat 类型](#62-场景-2concat-类型)
  - [6.3. 场景 3：头部/尾部类型提取](#63-场景-3头部尾部类型提取)
  - [6.4. 场景 4：路由参数](#64-场景-4路由参数)
  - [6.5. 场景 5：Promise 链](#65-场景-5promise-链)
  - [6.6. 场景 6：事件处理器](#66-场景-6事件处理器)
- [7. 🤔 剩余元素与扩展运算符](#7--剩余元素与扩展运算符)
  - [7.1. 解构赋值](#71-解构赋值)
  - [7.2. 函数参数](#72-函数参数)
  - [7.3. 数组扩展](#73-数组扩展)
  - [7.4. 类型合并](#74-类型合并)
- [8. 🤔 常见错误和最佳实践](#8--常见错误和最佳实践)
  - [8.1. 错误 1：多个剩余元素](#81-错误-1多个剩余元素)
  - [8.2. 错误 2：剩余元素后的可选元素](#82-错误-2剩余元素后的可选元素)
  - [8.3. 错误 3：类型推断错误](#83-错误-3类型推断错误)
  - [8.4. 最佳实践](#84-最佳实践)
  - [8.5. 性能考虑](#85-性能考虑)
- [9. 🔗 引用](#9--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 元组剩余元素的定义
- 剩余元素的声明语法
- 位置规则和限制
- 与扩展运算符的配合
- 实际应用场景
- 类型推断规则

## 2. 🫧 评价

元组剩余元素（Rest Elements in Tuple Types）是 TypeScript 3.0 引入的特性，允许元组类型使用**剩余参数语法**（`...Type[]`）来表示**不定数量的元素**。

剩余元素让元组能够表达**部分固定、部分可变**的类型模式，例如：

- 函数参数列表（前几个固定，后面任意多个）
- 数据结构（头部固定，尾部可变）
- 泛型约束（灵活的元组操作）

理解元组剩余元素，能帮助你：

1. 编写更灵活的函数签名
2. 准确描述可变参数的类型
3. 实现类型安全的工具函数
4. 进行高级的元组类型操作

## 3. 🤔 什么是元组剩余元素？

剩余元素使用 `...Type[]` 语法，表示元组中**不定数量的元素**。

```ts
// 普通元组：固定 3 个元素
type Fixed = [string, number, boolean]

// 剩余元素：第 1 个固定，后面任意多个 number
type WithRest = [string, ...number[]]

const t1: WithRest = ['hello', 1, 2, 3] // ✅
const t2: WithRest = ['hello', 1] // ✅
const t3: WithRest = ['hello'] // ✅
const t4: WithRest = ['hello', 1, 2, 3, 4, 5] // ✅
```

**关键特性**：

- 剩余元素可以匹配**任意数量**的元素（包括 0 个）
- 剩余元素的类型必须是**数组类型**
- 剩余元素可以出现在**开头、中间或结尾**（TypeScript 4.0+）

## 4. 🤔 如何声明剩余元素？

### 4.1. 基本语法

```ts
// 语法：...Type[]
type Tuple1 = [string, ...number[]]
type Tuple2 = [string, ...number[], boolean]
type Tuple3 = [...string[], number]
```

### 4.2. 结尾的剩余元素

```ts
// 最常见：剩余元素在结尾
type StringAndNumbers = [string, ...number[]]

const t1: StringAndNumbers = ['hello'] // ✅
const t2: StringAndNumbers = ['hello', 1] // ✅
const t3: StringAndNumbers = ['hello', 1, 2, 3] // ✅

// 多个固定元素 + 剩余元素
type Config = [string, number, ...boolean[]]

const c1: Config = ['app', 3000] // ✅
const c2: Config = ['app', 3000, true] // ✅
const c3: Config = ['app', 3000, true, false, true] // ✅
```

### 4.3. 开头的剩余元素

```ts
// TypeScript 4.0+：剩余元素在开头
type NumbersAndString = [...number[], string]

const t1: NumbersAndString = ['hello'] // ✅
const t2: NumbersAndString = [1, 'hello'] // ✅
const t3: NumbersAndString = [1, 2, 3, 'hello'] // ✅
```

### 4.4. 中间的剩余元素

```ts
// TypeScript 4.0+：剩余元素在中间
type StringNumbersBoolean = [string, ...number[], boolean]

const t1: StringNumbersBoolean = ['hello', true] // ✅
const t2: StringNumbersBoolean = ['hello', 1, true] // ✅
const t3: StringNumbersBoolean = ['hello', 1, 2, 3, true] // ✅
```

### 4.5. 多种类型的剩余元素

```ts
// 剩余元素可以是联合类型数组
type Mixed = [string, ...(number | boolean)[]]

const t1: Mixed = ['hello', 1, true, 2, false] // ✅

// 剩余元素可以是元组数组
type Pairs = [string, ...[number, number][]]

const p1: Pairs = ['data', [1, 2], [3, 4]] // ✅
```

## 5. 🤔 剩余元素的位置规则

### 5.1. TypeScript 3.0 - 3.9：只能在结尾

```ts
// ✅ 允许：剩余元素在结尾
type Good1 = [string, ...number[]]
type Good2 = [string, number, ...boolean[]]

// ❌ 错误：剩余元素不在结尾
type Bad1 = [...number[], string] // Error (TypeScript 3.x)
type Bad2 = [string, ...number[], boolean] // Error (TypeScript 3.x)
```

### 5.2. TypeScript 4.0+：可以在任意位置

```ts
// ✅ 允许：剩余元素在开头
type Start = [...number[], string]

// ✅ 允许：剩余元素在中间
type Middle = [string, ...number[], boolean]

// ✅ 允许：剩余元素在结尾
type End = [string, ...number[]]
```

### 5.3. 多个剩余元素的限制

```ts
// ❌ 不能有多个剩余元素
type Invalid = [string, ...number[], ...boolean[]]
// Error: A rest element cannot follow another rest element

// ✅ 只能有一个剩余元素
type Valid = [string, ...(number | boolean)[]]
```

### 5.4. 可选元素与剩余元素

```ts
// ✅ 可选元素可以在剩余元素之前
type Good1 = [string, number?, ...boolean[]]

// ❌ 可选元素不能在剩余元素之后
type Bad1 = [string, ...boolean[], number?]
// Error: A required element cannot follow an optional element
```

## 6. 🤔 剩余元素的使用场景

### 6.1. 场景 1：可变参数函数

```ts
// 表示函数参数：第一个是 string，后面任意多个 number
type LogArgs = [string, ...number[]]

function log(...args: LogArgs): void {
  const [message, ...values] = args
  console.log(message, values)
}

log('Count:', 1, 2, 3) // ✅
log('Total:', 42) // ✅
log('Empty:') // ✅
```

### 6.2. 场景 2：concat 类型

```ts
// 实现类型安全的 concat
type Concat<T extends any[], U extends any[]> = [...T, ...U]

type Result1 = Concat<[1, 2], [3, 4]> // [1, 2, 3, 4]
type Result2 = Concat<[string], [number, boolean]> // [string, number, boolean]

// 使用示例
function concat<T extends any[], U extends any[]>(
  arr1: [...T],
  arr2: [...U]
): Concat<T, U> {
  return [...arr1, ...arr2] as Concat<T, U>
}

const result = concat([1, 2], [3, 4]) // 类型：[1, 2, 3, 4]
```

### 6.3. 场景 3：头部/尾部类型提取

```ts
// 提取头部元素类型
type Head<T extends any[]> = T extends [infer First, ...any[]] ? First : never

type H1 = Head<[string, number, boolean]> // string
type H2 = Head<[number]> // number
type H3 = Head<[]> // never

// 提取尾部元素类型
type Tail<T extends any[]> = T extends [any, ...infer Rest] ? Rest : never

type T1 = Tail<[string, number, boolean]> // [number, boolean]
type T2 = Tail<[number]> // []
type T3 = Tail<[]> // never
```

### 6.4. 场景 4：路由参数

```ts
// 路由：路径 + 任意多个查询参数
type RouteParams = [string, ...[string, string | number][]]

function navigate(...params: RouteParams): void {
  const [path, ...queryPairs] = params
  const query = Object.fromEntries(queryPairs)
  console.log(`Navigate to ${path}`, query)
}

navigate('/users') // ✅
navigate('/users', ['page', 1]) // ✅
navigate('/users', ['page', 1], ['limit', 10]) // ✅
```

### 6.5. 场景 5：Promise 链

```ts
// Promise 链的类型
type PromiseChain<T extends any[]> = [
  Promise<unknown>,
  ...((...args: any[]) => Promise<any>)[]
]

function chain<T extends any[]>(...promises: PromiseChain<T>): Promise<any> {
  return promises.reduce((acc, fn) =>
    typeof fn === 'function' ? acc.then(fn) : acc
  ) as Promise<any>
}
```

### 6.6. 场景 6：事件处理器

```ts
// 事件类型 + 任意多个处理器
type EventConfig<T = any> = [string, ...(((event: T) => void)[]]

function addEventListener<T>(...config: EventConfig<T>): void {
  const [eventName, ...handlers] = config
  handlers.forEach(handler => {
    // 注册处理器
    console.log(`Registering ${eventName} handler`)
  })
}

addEventListener('click',
  (e) => console.log('Handler 1', e),
  (e) => console.log('Handler 2', e)
)
```

## 7. 🤔 剩余元素与扩展运算符

### 7.1. 解构赋值

```ts
type Data = [string, ...number[]]

const data: Data = ['hello', 1, 2, 3]

// 解构
const [first, ...rest] = data
// first: string
// rest: number[]

console.log(first) // 'hello'
console.log(rest) // [1, 2, 3]
```

### 7.2. 函数参数

```ts
// 函数签名使用剩余元素
function process(...args: [string, ...number[]]): void {
  const [name, ...values] = args
  console.log(name, values)
}

process('total', 1, 2, 3) // ✅
```

### 7.3. 数组扩展

```ts
type Tuple1 = [string, number]
type Tuple2 = [...Tuple1, boolean]

const t1: Tuple1 = ['hello', 42]
const t2: Tuple2 = [...t1, true] // ✅
// t2: [string, number, boolean]
```

### 7.4. 类型合并

```ts
// 合并多个元组
type Merge<T extends any[], U extends any[]> = [...T, ...U]

type A = [string, number]
type B = [boolean, symbol]
type C = Merge<A, B> // [string, number, boolean, symbol]

// 实现
function merge<T extends any[], U extends any[]>(
  arr1: T,
  arr2: U
): [...T, ...U] {
  return [...arr1, ...arr2]
}

const result = merge(['a', 1], [true, Symbol()]) // ✅
```

## 8. 🤔 常见错误和最佳实践

### 8.1. 错误 1：多个剩余元素

```ts
// ❌ 不能有多个剩余元素
type Invalid = [string, ...number[], ...boolean[]]

// ✅ 使用联合类型
type Valid = [string, ...(number | boolean)[]]
```

### 8.2. 错误 2：剩余元素后的可选元素

```ts
// ❌ 剩余元素后不能有可选元素
type Invalid = [string, ...number[], boolean?]

// ✅ 调整顺序
type Valid = [string, boolean?, ...number[]]
```

### 8.3. 错误 3：类型推断错误

```ts
// ⚠️ 自动推断不会产生剩余元素
function bad(...args: any[]) {
  return args
}
// 返回类型：any[]

// ✅ 显式标注
function good(...args: [string, ...number[]]): [string, ...number[]] {
  return args
}
// 返回类型：[string, ...number[]]
```

### 8.4. 最佳实践

```ts
// ✅ 1. 明确剩余元素的类型
type Good = [string, ...number[]]
type Bad = [string, ...any[]] // 避免使用 any

// ✅ 2. 使用泛型提高复用性
type WithPrefix<T, Prefix extends any[]> = [...Prefix, ...T[]]

// ✅ 3. 提供类型别名
type LogParams = [string, ...any[]]
function log(...args: LogParams) {}

// ✅ 4. 结合可选元素
type Config = [string, number?, ...boolean[]]

// ✅ 5. 使用条件类型处理剩余元素
type Last<T extends any[]> = T extends [...any[], infer L] ? L : never
type L = Last<[1, 2, 3]> // 3

// ✅ 6. 限制剩余元素的数量（使用递归类型）
type MaxLength<T extends any[], Max extends number> = T['length'] extends Max
  ? T
  : never

// ✅ 7. 文档化剩余元素的用途
/**
 * @param args - [name, ...scores]
 * name: 学生姓名
 * scores: 任意数量的成绩
 */
function calculateAverage(...args: [string, ...number[]]): number {
  const [, ...scores] = args
  return scores.reduce((a, b) => a + b, 0) / scores.length
}
```

### 8.5. 性能考虑

```ts
// ⚠️ 剩余元素会创建新数组
function inefficient(...args: [string, ...number[]]) {
  const [name, ...values] = args // 创建新数组
  return values
}

// ✅ 如果不需要解构，直接使用
function efficient(...args: [string, ...number[]]) {
  const name = args[0]
  const values = args.slice(1) // 更明确
  return values
}
```

## 9. 🔗 引用

- [TypeScript 3.0 Release Notes - Rest Elements in Tuple Types][1]
- [TypeScript 4.0 Release Notes - Variadic Tuple Types][2]
- [TypeScript Handbook - Tuple Types][3]

[1]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#rest-elements-in-tuple-types
[2]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types
[3]: https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types
