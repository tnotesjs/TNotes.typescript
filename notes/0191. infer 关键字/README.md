# [0191. infer 关键字](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0191.%20infer%20%E5%85%B3%E9%94%AE%E5%AD%97)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是 infer 关键字?](#3--什么是-infer-关键字)
  - [3.1. 基本语法](#31-基本语法)
  - [3.2. infer 的位置](#32-infer-的位置)
- [4. 🤔 如何使用 infer 推断类型？](#4--如何使用-infer-推断类型)
  - [4.1. 推断函数返回值](#41-推断函数返回值)
  - [4.2. 推断函数参数](#42-推断函数参数)
  - [4.3. 推断数组元素类型](#43-推断数组元素类型)
- [5. 🤔 infer 的高级用法](#5--infer-的高级用法)
  - [5.1. 推断 Promise 值类型](#51-推断-promise-值类型)
  - [5.2. 推断构造函数类型](#52-推断构造函数类型)
  - [5.3. 推断元组类型](#53-推断元组类型)
- [6. 🤔 infer 的实际应用场景](#6--infer-的实际应用场景)
  - [6.1. 实现工具类型](#61-实现工具类型)
  - [6.2. 类型转换](#62-类型转换)
  - [6.3. 深度类型提取](#63-深度类型提取)
- [7. 🤔 infer 有哪些注意事项？](#7--infer-有哪些注意事项)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- `infer` 关键字的基本概念和语法
- 使用 `infer` 推断各种类型
- `infer` 的高级用法和技巧
- `infer` 在实际开发中的应用场景
- 使用注意事项和最佳实践

## 2. 🫧 评价

这篇笔记详细介绍了 TypeScript 中的 `infer` 关键字，这是条件类型中用于类型推断的强大工具。

- `infer` 只能在条件类型的 `extends` 子句中使用
- `infer` 用于声明一个类型变量，让 TypeScript 自动推断其类型
- `infer` 是实现 `ReturnType`、`Parameters` 等内置工具类型的核心
- 合理使用 `infer` 可以提取复杂类型中的特定部分
- 支持多个 `infer` 同时使用，可以推断多个类型
- 掌握 `infer` 是编写高级类型工具的关键技能

## 3. 🤔 什么是 infer 关键字?

### 3.1. 基本语法

`infer` 关键字用于在条件类型中声明一个待推断的类型变量。

```ts
// 基本语法：T extends Pattern ? infer R : FallbackType
// infer R 表示：如果 T 匹配 Pattern，则推断出类型 R

type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

function getString(): string {
  return 'hello'
}

type R = ReturnType<typeof getString> // string
```

**工作原理：**

```ts
// 1. TypeScript 检查 T 是否 extends Pattern
// 2. 如果匹配，infer R 会捕获对应位置的类型
// 3. 返回推断的类型 R

type ElementType<T> = T extends (infer E)[] ? E : never

type T1 = ElementType<string[]> // string
type T2 = ElementType<number[]> // number
type T3 = ElementType<string> // never (不匹配数组模式)
```

### 3.2. infer 的位置

`infer` 可以出现在条件类型模式匹配的任何位置。

**函数返回值位置：**

```ts
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

type T1 = ReturnType<() => string> // string
type T2 = ReturnType<(x: number) => number> // number
```

**函数参数位置：**

```ts
type FirstParameter<T> = T extends (arg: infer P, ...args: any[]) => any
  ? P
  : never

type T1 = FirstParameter<(x: string) => void> // string
type T2 = FirstParameter<(x: number, y: string) => void> // number
```

**数组元素位置：**

```ts
type ArrayElement<T> = T extends (infer E)[] ? E : never

type T1 = ArrayElement<string[]> // string
type T2 = ArrayElement<number[]> // number
```

**对象属性值位置：**

```ts
type PropertyType<T> = T extends { value: infer V } ? V : never

type T1 = PropertyType<{ value: string }> // string
type T2 = PropertyType<{ value: number }> // number
type T3 = PropertyType<{ name: string }> // never
```

## 4. 🤔 如何使用 infer 推断类型？

### 4.1. 推断函数返回值

**基本返回类型：**

```ts
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never

function add(a: number, b: number): number {
  return a + b
}

function greet(name: string): string {
  return `Hello, ${name}`
}

type T1 = MyReturnType<typeof add> // number
type T2 = MyReturnType<typeof greet> // string
```

**异步函数返回类型：**

```ts
type AsyncReturnType<T> = T extends (...args: any[]) => Promise<infer R>
  ? R
  : never

async function fetchUser(): Promise<{ id: number; name: string }> {
  const response = await fetch('/api/user')
  return response.json()
}

type User = AsyncReturnType<typeof fetchUser>
// type User = {
//   id: number;
//   name: string;
// }
```

### 4.2. 推断函数参数

**所有参数：**

```ts
type MyParameters<T> = T extends (...args: infer P) => any ? P : never

function calculate(a: number, b: number, op: string): number {
  return a + b
}

type CalcParams = MyParameters<typeof calculate>
// type CalcParams = [a: number, b: number, op: string]
```

**第一个参数：**

```ts
type FirstArg<T> = T extends (first: infer F, ...args: any[]) => any ? F : never

function log(message: string, level: number): void {
  console.log(message, level)
}

type FirstParam = FirstArg<typeof log> // string
```

**最后一个参数：**

```ts
type LastArg<T> = T extends (...args: [...any[], infer L]) => any ? L : never

type LastParam = LastArg<typeof log> // number
```

### 4.3. 推断数组元素类型

**一维数组：**

```ts
type ElementOf<T> = T extends (infer E)[] ? E : never

type T1 = ElementOf<string[]> // string
type T2 = ElementOf<number[]> // number
type T3 = ElementOf<(string | number)[]> // string | number
```

**二维数组：**

```ts
type MatrixElement<T> = T extends (infer E)[][] ? E : never

type T1 = MatrixElement<string[][]> // string
type T2 = MatrixElement<number[][]> // number
```

**只读数组：**

```ts
type ReadonlyArrayElement<T> = T extends ReadonlyArray<infer E> ? E : never

type T1 = ReadonlyArrayElement<readonly string[]> // string
type T2 = ReadonlyArrayElement<readonly number[]> // number
```

## 5. 🤔 infer 的高级用法

### 5.1. 推断 Promise 值类型

**基本 Promise：**

```ts
type Awaited<T> = T extends Promise<infer U> ? U : T

type T1 = Awaited<Promise<string>> // string
type T2 = Awaited<Promise<number>> // number
type T3 = Awaited<string> // string
```

**嵌套 Promise：**

```ts
type DeepAwaited<T> = T extends Promise<infer U> ? DeepAwaited<U> : T

type T1 = DeepAwaited<Promise<Promise<string>>> // string
type T2 = DeepAwaited<Promise<Promise<Promise<number>>>> // number
```

**Promise 数组：**

```ts
type PromiseArrayValue<T> = T extends Promise<infer U>[] ? U : never

type T1 = PromiseArrayValue<Promise<string>[]> // string
type T2 = PromiseArrayValue<Promise<number>[]> // number
```

### 5.2. 推断构造函数类型

**构造函数参数：**

```ts
type ConstructorParameters<T> = T extends new (...args: infer P) => any
  ? P
  : never

class Person {
  constructor(public name: string, public age: number) {}
}

type PersonParams = ConstructorParameters<typeof Person>
// type PersonParams = [name: string, age: number]
```

**构造函数实例类型：**

```ts
type InstanceType<T> = T extends new (...args: any[]) => infer R ? R : never

type PersonInstance = InstanceType<typeof Person>
// type PersonInstance = Person
```

**抽象构造函数：**

```ts
type AbstractConstructorParameters<T> = T extends abstract new (
  ...args: infer P
) => any
  ? P
  : never

abstract class Animal {
  constructor(public name: string) {}
}

type AnimalParams = AbstractConstructorParameters<typeof Animal>
// type AnimalParams = [name: string]
```

### 5.3. 推断元组类型

**元组第一个元素：**

```ts
type First<T> = T extends [infer F, ...any[]] ? F : never

type T1 = First<[string, number, boolean]> // string
type T2 = First<[number]> // number
type T3 = First<[]> // never
```

**元组最后一个元素：**

```ts
type Last<T> = T extends [...any[], infer L] ? L : never

type T1 = Last<[string, number, boolean]> // boolean
type T2 = Last<[number]> // number
type T3 = Last<[]> // never
```

**元组剩余部分：**

```ts
type Tail<T> = T extends [any, ...infer Rest] ? Rest : never

type T1 = Tail<[string, number, boolean]> // [number, boolean]
type T2 = Tail<[number]> // []
type T3 = Tail<[]> // never
```

**元组转联合类型：**

```ts
type TupleToUnion<T> = T extends (infer E)[] ? E : never

type T1 = TupleToUnion<[string, number, boolean]> // string | number | boolean
type T2 = TupleToUnion<[1, 2, 3]> // 1 | 2 | 3
```

## 6. 🤔 infer 的实际应用场景

### 6.1. 实现工具类型

**提取对象所有函数的返回类型：**

```ts
type FunctionReturnTypes<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => infer R ? R : never
}

interface API {
  getUser: () => { id: number; name: string }
  getPosts: () => { id: number; title: string }[]
  deletePost: (id: number) => boolean
}

type APIReturnTypes = FunctionReturnTypes<API>
// type APIReturnTypes = {
//   getUser: { id: number; name: string };
//   getPosts: { id: number; title: string }[];
//   deletePost: boolean;
// }
```

**提取事件处理器的参数类型：**

```ts
type EventPayload<T> = T extends (event: infer E) => any ? E : never

interface EventHandlers {
  onClick: (event: MouseEvent) => void
  onKeyDown: (event: KeyboardEvent) => void
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

type ClickEvent = EventPayload<EventHandlers['onClick']> // MouseEvent
type KeyDownEvent = EventPayload<EventHandlers['onKeyDown']> // KeyboardEvent
```

### 6.2. 类型转换

**扁平化嵌套数组类型：**

```ts
type Flatten<T> = T extends (infer U)[] ? (U extends any[] ? Flatten<U> : U) : T

type T1 = Flatten<number[]> // number
type T2 = Flatten<number[][]> // number
type T3 = Flatten<number[][][]> // number
type T4 = Flatten<string> // string
```

**提取联合类型中的函数：**

```ts
type ExtractFunction<T> = T extends (...args: any[]) => infer R ? T : never

type Mixed = string | number | ((x: number) => string) | boolean
type Funcs = ExtractFunction<Mixed>
// type Funcs = (x: number) => string
```

### 6.3. 深度类型提取

**深度获取属性类型：**

```ts
type DeepPropertyType<
  T,
  Path extends string
> = Path extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? DeepPropertyType<T[Key], Rest>
    : never
  : Path extends keyof T
  ? T[Path]
  : never

interface User {
  profile: {
    address: {
      city: string
      zip: number
    }
  }
}

type City = DeepPropertyType<User, 'profile.address.city'> // string
type Zip = DeepPropertyType<User, 'profile.address.zip'> // number
```

**提取泛型类型的参数：**

```ts
type UnboxPromise<T> = T extends Promise<infer U> ? U : T
type UnboxArray<T> = T extends Array<infer U> ? U : T
type UnboxMap<T> = T extends Map<any, infer V> ? V : T

type T1 = UnboxPromise<Promise<string>> // string
type T2 = UnboxArray<string[]> // string
type T3 = UnboxMap<Map<string, number>> // number
```

## 7. 🤔 infer 有哪些注意事项？

**1. infer 只能在条件类型中使用**

```ts
// ❌ 错误：infer 不能单独使用
type Wrong = infer R

// ❌ 错误：infer 必须在 extends 子句中
type Wrong2<T> = infer R extends T ? R : never

// ✅ 正确：在条件类型的 extends 子句中使用
type Correct<T> = T extends (infer R)[] ? R : never
```

**2. 多个 infer 的协变位置**

```ts
// 多个 infer 在协变位置（返回值）会推断为联合类型
type ReturnTypes<T> = T extends {
  foo: (...args: any[]) => infer R
  bar: (...args: any[]) => infer R
}
  ? R
  : never

type T = ReturnTypes<{
  foo: () => string
  bar: () => number
}>
// type T = string | number (联合类型)
```

**3. 多个 infer 的逆变位置**

```ts
// 多个 infer 在逆变位置（参数）会推断为交叉类型
type ParamTypes<T> = T extends {
  foo: (arg: infer P) => void
  bar: (arg: infer P) => void
}
  ? P
  : never

type T = ParamTypes<{
  foo: (arg: string) => void
  bar: (arg: number) => void
}>
// type T = string & number (交叉类型，实际上是 never)
```

**4. infer 的作用域**

```ts
// infer 声明的类型变量只在条件类型的真值分支中可用
type Test<T> = T extends (infer R)[]
  ? R // ✅ 可以使用 R
  : R // ❌ 错误：找不到名称 'R'

// 正确：为假值分支使用不同的逻辑
type Correct<T> = T extends (infer R)[] ? R : never
```

**5. infer 与分布式条件类型**

```ts
// 当 T 是联合类型时，infer 会分别应用
type ExtractReturnType<T> = T extends (...args: any[]) => infer R ? R : never

type Funcs = (() => string) | (() => number)
type Returns = ExtractReturnType<Funcs>
// type Returns = string | number

// 阻止分发
type NonDistributive<T> = [T] extends [(...args: any[]) => infer R] ? R : never
type Returns2 = NonDistributive<Funcs>
// type Returns2 = never (因为联合类型不匹配单个函数签名)
```

**6. 嵌套 infer 的推断优先级**

```ts
type NestedArray<T> = T extends (infer U)[]
  ? U extends (infer V)[]
    ? V
    : U
  : T

type T1 = NestedArray<string[][]> // string (内层 infer 优先)
type T2 = NestedArray<string[]> // string
type T3 = NestedArray<string> // string
```

**7. infer 与泛型约束**

```ts
// ❌ 错误：不能为 infer 添加约束
type Wrong<T> = T extends (infer R extends string)[] ? R : never

// ✅ 正确：使用额外的条件类型添加约束
type Correct<T> = T extends (infer R)[] ? (R extends string ? R : never) : never
```

## 8. 🔗 引用

- [TypeScript Handbook - Type Inference in Conditional Types][1]
- [TypeScript Handbook - Conditional Types][2]
- [TypeScript 4.7 Release Notes - Improved Type Inference][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types
[2]: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
[3]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html
