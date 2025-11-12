# [0087. 元组剩余元素](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0087.%20%E5%85%83%E7%BB%84%E5%89%A9%E4%BD%99%E5%85%83%E7%B4%A0)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是元组剩余元素？](#3--什么是元组剩余元素)
  - [3.1. 关键特性](#31-关键特性)
  - [3.2. 基本语法](#32-基本语法)
  - [3.3. 结尾的剩余元素](#33-结尾的剩余元素)
  - [3.4. 开头的剩余元素](#34-开头的剩余元素)
  - [3.5. 中间的剩余元素](#35-中间的剩余元素)
  - [3.6. 多种类型的剩余元素](#36-多种类型的剩余元素)
  - [3.7. TypeScript 3.0 - 3.9：只能在结尾](#37-typescript-30---39只能在结尾)
  - [3.8. TypeScript 4.0+：可以在任意位置](#38-typescript-40可以在任意位置)
  - [3.9. 多个剩余元素的限制](#39-多个剩余元素的限制)
  - [3.10. 可选元素与剩余元素](#310-可选元素与剩余元素)
- [4. 🤔 剩余元素与扩展运算符](#4--剩余元素与扩展运算符)
  - [4.1. 解构赋值](#41-解构赋值)
  - [4.2. 函数参数](#42-函数参数)
  - [4.3. 数组扩展](#43-数组扩展)
  - [4.4. 类型合并](#44-类型合并)
- [5. 🔗 引用](#5--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 元组剩余元素的定义
- 剩余元素的声明语法
- 位置规则和限制

## 2. 🫧 评价

元组剩余元素（Rest Elements in Tuple Types）是 TypeScript 3.0 引入的特性，允许元组类型使用剩余参数语法（`...Type[]`）来表示不定数量的元素。

## 3. 🤔 什么是元组剩余元素？

剩余元素使用 `...Type[]` 语法，表示元组中不定数量的元素。

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

### 3.1. 关键特性

- 剩余元素可以匹配任意数量的元素（包括 0 个）
- 剩余元素的类型必须是数组类型
- 剩余元素可以出现在开头、中间或结尾（TypeScript 4.0+）

### 3.2. 基本语法

```ts
// 语法：...Type[]
type Tuple1 = [string, ...number[]]
type Tuple2 = [string, ...number[], boolean]
type Tuple3 = [...string[], number]
```

### 3.3. 结尾的剩余元素

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

### 3.4. 开头的剩余元素

```ts
// TypeScript 4.0+：剩余元素在开头
type NumbersAndString = [...number[], string]

const t1: NumbersAndString = ['hello'] // ✅
const t2: NumbersAndString = [1, 'hello'] // ✅
const t3: NumbersAndString = [1, 2, 3, 'hello'] // ✅
```

### 3.5. 中间的剩余元素

```ts
// TypeScript 4.0+：剩余元素在中间
type StringNumbersBoolean = [string, ...number[], boolean]

const t1: StringNumbersBoolean = ['hello', true] // ✅
const t2: StringNumbersBoolean = ['hello', 1, true] // ✅
const t3: StringNumbersBoolean = ['hello', 1, 2, 3, true] // ✅
```

### 3.6. 多种类型的剩余元素

```ts
// 剩余元素可以是联合类型数组
type Mixed = [string, ...(number | boolean)[]]

const t1: Mixed = ['hello', 1, true, 2, false] // ✅

// 剩余元素可以是元组数组
type Pairs = [string, ...[number, number][]]

const p1: Pairs = ['data', [1, 2], [3, 4]] // ✅
```

### 3.7. TypeScript 3.0 - 3.9：只能在结尾

```ts
// ✅ 允许：剩余元素在结尾
type Good1 = [string, ...number[]]
type Good2 = [string, number, ...boolean[]]

// ❌ 错误：剩余元素不在结尾
type Bad1 = [...number[], string] // Error (TypeScript 3.x)
type Bad2 = [string, ...number[], boolean] // Error (TypeScript 3.x)
```

### 3.8. TypeScript 4.0+：可以在任意位置

```ts
// ✅ 允许：剩余元素在开头
type Start = [...number[], string]

// ✅ 允许：剩余元素在中间
type Middle = [string, ...number[], boolean]

// ✅ 允许：剩余元素在结尾
type End = [string, ...number[]]
```

### 3.9. 多个剩余元素的限制

```ts
// ❌ 不能有多个剩余元素
type Invalid = [string, ...number[], ...boolean[]]
// Error: A rest element cannot follow another rest element

// ✅ 只能有一个剩余元素
type Valid = [string, ...(number | boolean)[]]
```

### 3.10. 可选元素与剩余元素

```ts
// ✅ 可选元素可以在剩余元素之前
type Good1 = [string, number?, ...boolean[]]

// ❌ 可选元素不能在剩余元素之后
type Bad1 = [string, ...boolean[], number?]
// Error: A required element cannot follow an optional element
```

## 4. 🤔 剩余元素与扩展运算符

### 4.1. 解构赋值

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

### 4.2. 函数参数

```ts
// 函数签名使用剩余元素
function process(...args: [string, ...number[]]): void {
  const [name, ...values] = args
  console.log(name, values)
}

process('total', 1, 2, 3) // ✅
```

### 4.3. 数组扩展

```ts
type Tuple1 = [string, number]
type Tuple2 = [...Tuple1, boolean]

const t1: Tuple1 = ['hello', 42]
const t2: Tuple2 = [...t1, true] // ✅
// t2: [string, number, boolean]
```

### 4.4. 类型合并

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

## 5. 🔗 引用

- [TypeScript 3.0 Release Notes - Rest Elements in Tuple Types][1]
- [TypeScript 4.0 Release Notes - Variadic Tuple Types][2]
- [TypeScript Handbook - Tuple Types][3]

[1]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#rest-elements-in-tuple-types
[2]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types
[3]: https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types
