# [0271. 类型推断的最佳实践](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0271.%20%E7%B1%BB%E5%9E%8B%E6%8E%A8%E6%96%AD%E7%9A%84%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 何时依赖类型推断？](#3-何时依赖类型推断)
  - [3.1. 变量初始化](#31-变量初始化)
  - [3.2. 函数参数默认值](#32-函数参数默认值)
  - [3.3. 简单的函数返回值](#33-简单的函数返回值)
  - [3.4. 对象字面量](#34-对象字面量)
- [4. 何时显式声明类型？](#4-何时显式声明类型)
  - [4.1. 函数参数](#41-函数参数)
  - [4.2. 复杂的返回类型](#42-复杂的返回类型)
  - [4.3. 公共 API](#43-公共-api)
  - [4.4. 类型约束](#44-类型约束)
  - [4.5. 空值初始化](#45-空值初始化)
- [5. 函数返回值推断？](#5-函数返回值推断)
  - [5.1. 简单函数](#51-简单函数)
  - [5.2. 多分支函数](#52-多分支函数)
  - [5.3. 递归函数](#53-递归函数)
  - [5.4. Promise 返回](#54-promise-返回)
- [6. const vs let 推断？](#6-const-vs-let-推断)
  - [6.1. const 字面量推断](#61-const-字面量推断)
  - [6.2. const 断言](#62-const-断言)
  - [6.3. 数组推断](#63-数组推断)
  - [6.4. 对象推断差异](#64-对象推断差异)
- [7. 泛型推断技巧？](#7-泛型推断技巧)
  - [7.1. 函数泛型推断](#71-函数泛型推断)
  - [7.2. 约束泛型推断](#72-约束泛型推断)
  - [7.3. 多个类型参数](#73-多个类型参数)
  - [7.4. 泛型工厂函数](#74-泛型工厂函数)
  - [7.5. 条件类型推断](#75-条件类型推断)
- [8. 引用](#8-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 依赖类型推断的时机
- 显式类型声明的场景
- 函数返回值推断
- const vs let 推断差异
- 泛型推断技巧

## 2. 评价

合理利用 TypeScript 的类型推断能力可以减少冗余代码，同时保持类型安全。

- 减少类型标注
- 保持代码简洁
- 利用编译器智能
- 平衡可读性与简洁性
- 提升开发效率

## 3. 何时依赖类型推断？

### 3.1. 变量初始化

```ts
// ✅ 推断：类型明显
const name = 'Tom' // string
const age = 25 // number
const isActive = true // boolean

// ❌ 冗余：不必要的类型标注
const name: string = 'Tom'
const age: number = 25
const isActive: boolean = true
```

### 3.2. 函数参数默认值

```ts
// ✅ 推断：从默认值推断类型
function greet(name = 'Guest') {
  // name 的类型：string
  return `Hello, ${name}`
}

// ❌ 冗余
function greet(name: string = 'Guest') {
  return `Hello, ${name}`
}
```

### 3.3. 简单的函数返回值

```ts
// ✅ 推断：返回类型明显
function add(a: number, b: number) {
  return a + b // 推断为 number
}

function getName() {
  return 'Tom' // 推断为 string
}

// ❌ 冗余
function add(a: number, b: number): number {
  return a + b
}
```

### 3.4. 对象字面量

```ts
// ✅ 推断：结构清晰
const user = {
  name: 'Tom',
  age: 25,
  email: 'tom@example.com',
}
// 推断类型：{ name: string; age: number; email: string }

// ❌ 冗余
const user: { name: string; age: number; email: string } = {
  name: 'Tom',
  age: 25,
  email: 'tom@example.com',
}
```

## 4. 何时显式声明类型？

### 4.1. 函数参数

```ts
// ✅ 必须：函数参数需要类型标注
function greet(name: string) {
  return `Hello, ${name}`
}

// ❌ 错误：缺少类型标注
function greet(name) {
  // Error: Parameter 'name' implicitly has an 'any' type
  return `Hello, ${name}`
}
```

### 4.2. 复杂的返回类型

```ts
// ✅ 显式：返回类型复杂或有多个分支
function processData(input: string): { value: string; timestamp: number } {
  if (input.length === 0) {
    return { value: '', timestamp: Date.now() }
  }
  return { value: input.toUpperCase(), timestamp: Date.now() }
}

// ❌ 推断：类型不够明确
function processData(input: string) {
  if (input.length === 0) {
    return { value: '', timestamp: Date.now() }
  }
  return { value: input.toUpperCase(), timestamp: Date.now() }
}
```

### 4.3. 公共 API

```ts
// ✅ 显式：导出的函数应该有明确的类型签名
export function calculate(a: number, b: number): number {
  return a + b
}

// ❌ 推断：不够明确
export function calculate(a: number, b: number) {
  return a + b
}
```

### 4.4. 类型约束

```ts
// ✅ 显式：需要特定的类型约束
const config: { readonly apiUrl: string; timeout?: number } = {
  apiUrl: 'https://api.example.com',
}

// ❌ 推断：类型过于宽松
const config = {
  apiUrl: 'https://api.example.com',
}
// config.apiUrl 可以被修改
```

### 4.5. 空值初始化

```ts
// ✅ 显式：初始值为 undefined 或 null
let user: User | null = null
let data: string | undefined = undefined

// ❌ 推断：类型为 null 或 undefined，过于限制
let user = null // 类型：null
let data = undefined // 类型：undefined
```

## 5. 函数返回值推断？

### 5.1. 简单函数

```ts
// ✅ 推断：单一返回语句
function double(n: number) {
  return n * 2 // 推断为 number
}

function getName() {
  return 'Tom' // 推断为 string
}
```

### 5.2. 多分支函数

```ts
// ⚠️ 小心：可能推断为联合类型
function getValue(flag: boolean) {
  if (flag) {
    return 42
  }
  return 'default'
}
// 推断类型：string | number

// ✅ 显式：明确预期的返回类型
function getValue(flag: boolean): number {
  if (flag) {
    return 42
  }
  return 0 // 而不是 "default"
}
```

### 5.3. 递归函数

```ts
// ✅ 显式：递归函数需要明确返回类型
function factorial(n: number): number {
  if (n <= 1) return 1
  return n * factorial(n - 1)
}

// ❌ 推断：可能导致循环类型推断
function factorial(n: number) {
  if (n <= 1) return 1
  return n * factorial(n - 1)
}
```

### 5.4. Promise 返回

```ts
// ✅ 显式：异步函数的返回类型
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

// ⚠️ 推断：返回 Promise<any>
async function fetchUser(id: number) {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}
```

## 6. const vs let 推断？

### 6.1. const 字面量推断

```ts
// const 推断为字面量类型
const name = 'Tom' // 类型："Tom"
const age = 25 // 类型：25
const flag = true // 类型：true

// let 推断为基本类型
let name = 'Tom' // 类型：string
let age = 25 // 类型：number
let flag = true // 类型：boolean
```

### 6.2. const 断言

```ts
// ✅ as const：推断为字面量
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
} as const
// 类型：{ readonly apiUrl: "https://api.example.com"; readonly timeout: 5000 }

// 不使用 as const
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
}
// 类型：{ apiUrl: string; timeout: number }
```

### 6.3. 数组推断

```ts
// const 推断为可变数组
const numbers = [1, 2, 3] // 类型：number[]

// ✅ as const：推断为只读元组
const numbers = [1, 2, 3] as const // 类型：readonly [1, 2, 3]

// 应用场景：枚举值
const STATUS = ['pending', 'success', 'error'] as const
type Status = (typeof STATUS)[number] // "pending" | "success" | "error"
```

### 6.4. 对象推断差异

```ts
// let：属性可变
let user = { name: 'Tom', age: 25 }
user.name = 'Jerry' // ✅ 可以修改

// const：对象引用不可变，但属性可变
const user = { name: 'Tom', age: 25 }
user.name = 'Jerry' // ✅ 属性仍可修改

// as const：深层只读
const user = { name: 'Tom', age: 25 } as const
user.name = 'Jerry' // ❌ Error: Cannot assign to 'name' because it is a read-only property
```

## 7. 泛型推断技巧？

### 7.1. 函数泛型推断

```ts
// ✅ 推断：从参数推断泛型类型
function identity<T>(value: T): T {
  return value
}

const result1 = identity(42) // T 推断为 number
const result2 = identity('hello') // T 推断为 string

// ❌ 冗余：显式指定泛型类型
const result = identity<number>(42)
```

### 7.2. 约束泛型推断

```ts
// ✅ 约束：帮助推断更精确的类型
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user = { name: 'Tom', age: 25 }
const name = getProperty(user, 'name') // 推断为 string
const age = getProperty(user, 'age') // 推断为 number
```

### 7.3. 多个类型参数

```ts
// ✅ 部分推断：可以指定部分泛型类型
function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b]
}

const result1 = pair(1, 'hello') // [number, string]
const result2 = pair<number, string>(1, 'hello') // 显式指定（冗余）
const result3 = pair<number>(1, 'hello') // 只指定第一个（通常不需要）
```

### 7.4. 泛型工厂函数

```ts
// ✅ 推断：从工厂函数推断类型
function createArray<T>(...items: T[]): T[] {
  return items
}

const numbers = createArray(1, 2, 3) // number[]
const strings = createArray('a', 'b') // string[]

// ⚠️ 混合类型
const mixed = createArray(1, 'a') // (string | number)[]

// ✅ 显式指定：当需要特定类型时
const numbers = createArray<number>(1, 2, 3)
```

### 7.5. 条件类型推断

```ts
// ✅ 利用条件类型推断
type Unpromise<T> = T extends Promise<infer U> ? U : T

type A = Unpromise<Promise<number>> // number
type B = Unpromise<string> // string

async function fetchData() {
  return { id: 1, name: 'Tom' }
}

type DataType = Unpromise<ReturnType<typeof fetchData>>
// 类型：{ id: number; name: string }
```

## 8. 引用

- [Type Inference][1]
- [Type Compatibility][2]
- [Generics][3]

[1]: https://www.typescriptlang.org/docs/handbook/type-inference.html
[2]: https://www.typescriptlang.org/docs/handbook/type-compatibility.html
[3]: https://www.typescriptlang.org/docs/handbook/2/generics.html
