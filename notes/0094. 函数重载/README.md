# [0094. 函数重载](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0094.%20%E5%87%BD%E6%95%B0%E9%87%8D%E8%BD%BD)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是函数重载？](#3--什么是函数重载)
- [4. 🤔 如何声明函数重载？](#4--如何声明函数重载)
  - [4.1. 基本语法](#41-基本语法)
  - [4.2. 简单示例](#42-简单示例)
  - [4.3. 多个参数的重载](#43-多个参数的重载)
- [5. 🤔 重载签名与实现签名](#5--重载签名与实现签名)
  - [5.1. 重载签名（Overload Signatures）](#51-重载签名overload-signatures)
  - [5.2. 实现签名（Implementation Signature）](#52-实现签名implementation-signature)
  - [5.3. 完整示例](#53-完整示例)
  - [5.4. 重要规则](#54-重要规则)
- [6. 🤔 函数重载的匹配规则](#6--函数重载的匹配规则)
  - [6.1. 从上到下匹配](#61-从上到下匹配)
  - [6.2. 更具体的重载在前](#62-更具体的重载在前)
  - [6.3. 可选参数的匹配](#63-可选参数的匹配)
- [7. 🤔 常见使用场景](#7--常见使用场景)
  - [7.1. 场景 1：不同参数类型返回不同类型](#71-场景-1不同参数类型返回不同类型)
  - [7.2. 场景 2：不同参数数量](#72-场景-2不同参数数量)
  - [7.3. 场景 3：数组操作](#73-场景-3数组操作)
  - [7.4. 场景 4：Promise 重载](#74-场景-4promise-重载)
  - [7.5. 场景 5：React 组件工厂](#75-场景-5react-组件工厂)
  - [7.6. 场景 6：数据库查询](#76-场景-6数据库查询)
- [8. 🤔 重载 vs 联合类型](#8--重载-vs-联合类型)
  - [8.1. 何时使用重载](#81-何时使用重载)
  - [8.2. 何时使用联合类型](#82-何时使用联合类型)
  - [8.3. 对比表](#83-对比表)
  - [8.4. 实际对比](#84-实际对比)
- [9. 🤔 常见错误和最佳实践](#9--常见错误和最佳实践)
  - [9.1. 错误 1：实现签名不兼容](#91-错误-1实现签名不兼容)
  - [9.2. 错误 2：重载顺序错误](#92-错误-2重载顺序错误)
  - [9.3. 错误 3：过度使用重载](#93-错误-3过度使用重载)
  - [9.4. 最佳实践](#94-最佳实践)
- [10. 🔗 引用](#10--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 函数重载的定义和语法
- 重载签名与实现签名
- 函数重载的匹配规则
- 实际应用场景
- 与联合类型的对比
- 最佳实践

## 2. 🫧 评价

函数重载（Function Overloading）允许为**同一个函数**定义**多个类型签名**，根据不同的参数类型或数量，返回不同的类型。

TypeScript 的函数重载是**纯编译期特性**：

- 在编译时提供**多个类型签名**
- 在运行时只有**一个实现**
- 通过重载签名提供更**精确的类型推断**

理解函数重载，能帮助你：

1. 为同一函数提供不同的调用方式
2. 实现更精确的类型推断
3. 提升 API 的可用性
4. 避免类型断言

函数重载是 TypeScript 类型系统中的高级特性，合理使用能显著提升代码的类型安全性和可读性。

## 3. 🤔 什么是函数重载？

函数重载是为**同一个函数**提供**多个类型定义**，使其能接受不同类型或数量的参数，并返回相应的类型。

```ts
// 没有重载：返回类型不够精确
function getValue(key: string | number): string | number {
  // 实现
}

const result1 = getValue('name') // 类型：string | number
const result2 = getValue(42) // 类型：string | number

// ✅ 使用重载：精确的类型推断
function getValue(key: string): string
function getValue(key: number): number
function getValue(key: string | number): string | number {
  // 实现
}

const result1 = getValue('name') // 类型：string ✅
const result2 = getValue(42) // 类型：number ✅
```

**关键概念**：

- **重载签名**：多个类型定义（没有实现）
- **实现签名**：唯一的实现（有函数体）
- **调用签名匹配**：从上到下匹配重载签名
- **类型收窄**：根据参数类型返回精确类型

## 4. 🤔 如何声明函数重载？

### 4.1. 基本语法

```ts
// 重载签名 1
function func(param: Type1): ReturnType1
// 重载签名 2
function func(param: Type2): ReturnType2
// 实现签名
function func(param: Type1 | Type2): ReturnType1 | ReturnType2 {
  // 实现
}
```

### 4.2. 简单示例

```ts
// ✅ 重载：根据参数类型返回不同类型
function double(value: number): number
function double(value: string): string
function double(value: number | string): number | string {
  if (typeof value === 'number') {
    return value * 2
  } else {
    return value + value
  }
}

const num = double(5) // 类型：number
const str = double('hello') // 类型：string
```

### 4.3. 多个参数的重载

```ts
// ✅ 重载：不同数量的参数
function add(a: number, b: number): number
function add(a: string, b: string): string
function add(a: number, b: number, c: number): number
function add(a: any, b: any, c?: any): any {
  if (c !== undefined) {
    return a + b + c
  }
  return a + b
}

add(1, 2) // 类型：number
add('hello', 'world') // 类型：string
add(1, 2, 3) // 类型：number
```

## 5. 🤔 重载签名与实现签名

### 5.1. 重载签名（Overload Signatures）

```ts
// 重载签名：只有类型，没有实现
function process(value: string): string
function process(value: number): number
function process(value: boolean): boolean

// 这些签名对外可见，用于类型检查
```

### 5.2. 实现签名（Implementation Signature）

```ts
// 实现签名：包含所有可能的类型
function process(value: string | number | boolean): string | number | boolean {
  // 唯一的实现
  if (typeof value === 'string') {
    return value.toUpperCase()
  } else if (typeof value === 'number') {
    return value * 2
  } else {
    return !value
  }
}

// 实现签名对外不可见
```

### 5.3. 完整示例

```ts
// ✅ 完整的函数重载
// 重载签名 1：处理字符串
function format(value: string): string
// 重载签名 2：处理数字
function format(value: number): string
// 重载签名 3：处理日期
function format(value: Date): string
// 实现签名：兼容所有重载签名
function format(value: string | number | Date): string {
  if (typeof value === 'string') {
    return value.toUpperCase()
  } else if (typeof value === 'number') {
    return value.toFixed(2)
  } else {
    return value.toISOString()
  }
}

// 使用
format('hello') // 类型：string
format(123.456) // 类型：string
format(new Date()) // 类型：string
// format(true) // ❌ Error: No overload matches
```

### 5.4. 重要规则

```ts
// ❌ 实现签名必须兼容所有重载签名
function bad(x: string): string
function bad(x: number): number
function bad(x: string): string {
  // ❌ Error: 实现签名不兼容
  return x
}

// ✅ 实现签名类型必须包含所有重载签名
function good(x: string): string
function good(x: number): number
function good(x: string | number): string | number {
  return typeof x === 'string' ? x : String(x)
}
```

## 6. 🤔 函数重载的匹配规则

### 6.1. 从上到下匹配

```ts
// 重载签名的顺序很重要！
function convert(value: string): number
function convert(value: number): string
function convert(value: string | number): string | number {
  return typeof value === 'string' ? parseInt(value) : String(value)
}

// TypeScript 从上到下匹配第一个符合的重载
convert('123') // 匹配第 1 个重载 → number
convert(123) // 匹配第 2 个重载 → string
```

### 6.2. 更具体的重载在前

```ts
// ✅ 具体的重载在前，通用的在后
function process(value: 'special'): string
function process(value: string): number
function process(value: string): string | number {
  if (value === 'special') {
    return 'Special case'
  }
  return value.length
}

process('special') // 类型：string（匹配第 1 个）
process('other') // 类型：number（匹配第 2 个）

// ❌ 如果顺序反了
function badProcess(value: string): number
function badProcess(value: 'special'): string
// Error: This overload signature is not compatible with its implementation signature
```

### 6.3. 可选参数的匹配

```ts
// ✅ 可选参数的重载
function greet(name: string): string
function greet(name: string, greeting: string): string
function greet(name: string, greeting?: string): string {
  return greeting ? `${greeting}, ${name}` : `Hello, ${name}`
}

greet('Alice') // 匹配第 1 个重载
greet('Bob', 'Hi') // 匹配第 2 个重载
```

## 7. 🤔 常见使用场景

### 7.1. 场景 1：不同参数类型返回不同类型

```ts
// ✅ 根据输入类型返回对应类型
function parse(value: string): number
function parse(value: number): string
function parse(value: boolean): string
function parse(value: string | number | boolean): string | number {
  if (typeof value === 'string') {
    return parseInt(value, 10)
  } else if (typeof value === 'number') {
    return String(value)
  } else {
    return String(value)
  }
}

const num = parse('123') // 类型：number
const str = parse(456) // 类型：string
const bool = parse(true) // 类型：string
```

### 7.2. 场景 2：不同参数数量

```ts
// ✅ 根据参数数量提供不同功能
function createElement(tag: string): HTMLElement
function createElement(tag: string, props: Record<string, any>): HTMLElement
function createElement(
  tag: string,
  props: Record<string, any>,
  children: HTMLElement[]
): HTMLElement
function createElement(
  tag: string,
  props?: Record<string, any>,
  children?: HTMLElement[]
): HTMLElement {
  const element = document.createElement(tag)

  if (props) {
    Object.assign(element, props)
  }

  if (children) {
    children.forEach((child) => element.appendChild(child))
  }

  return element
}

createElement('div') // ✅
createElement('div', { className: 'container' }) // ✅
createElement('div', { id: 'app' }, []) // ✅
```

### 7.3. 场景 3：数组操作

```ts
// ✅ reverse 函数重载
function reverse(value: string): string
function reverse<T>(value: T[]): T[]
function reverse<T>(value: string | T[]): string | T[] {
  if (typeof value === 'string') {
    return value.split('').reverse().join('')
  } else {
    return value.slice().reverse()
  }
}

reverse('hello') // 类型：string
reverse([1, 2, 3]) // 类型：number[]
reverse(['a', 'b', 'c']) // 类型：string[]
```

### 7.4. 场景 4：Promise 重载

```ts
// ✅ fetch 函数重载
function fetch(url: string): Promise<string>
function fetch(url: string, options: { json: true }): Promise<any>
function fetch(url: string, options: { blob: true }): Promise<Blob>
function fetch(
  url: string,
  options?: { json?: boolean; blob?: boolean }
): Promise<string | any | Blob> {
  return window.fetch(url).then((response) => {
    if (options?.json) {
      return response.json()
    } else if (options?.blob) {
      return response.blob()
    } else {
      return response.text()
    }
  })
}

fetch('/api/data') // Promise<string>
fetch('/api/data', { json: true }) // Promise<any>
fetch('/api/image', { blob: true }) // Promise<Blob>
```

### 7.5. 场景 5：React 组件工厂

```ts
// ✅ 组件创建重载
interface ComponentProps {
  onClick?: () => void
}

function component(type: 'button'): (props: ComponentProps) => HTMLButtonElement
function component(type: 'input'): (props: ComponentProps) => HTMLInputElement
function component(type: 'div'): (props: ComponentProps) => HTMLDivElement
function component(type: string): (props: ComponentProps) => HTMLElement {
  return (props: ComponentProps) => {
    const element = document.createElement(type)
    if (props.onClick) {
      element.addEventListener('click', props.onClick)
    }
    return element as any
  }
}

const createButton = component('button') // (props) => HTMLButtonElement
const createInput = component('input') // (props) => HTMLInputElement
```

### 7.6. 场景 6：数据库查询

```ts
// ✅ 数据库查询重载
interface User {
  id: number
  name: string
}

function find(id: number): Promise<User | null>
function find(query: { name: string }): Promise<User[]>
function find(query: number | { name: string }): Promise<User | User[] | null> {
  if (typeof query === 'number') {
    // 根据 ID 查询单个用户
    return Promise.resolve({ id: query, name: 'User' })
  } else {
    // 根据条件查询多个用户
    return Promise.resolve([{ id: 1, name: query.name }])
  }
}

find(1) // Promise<User | null>
find({ name: 'Alice' }) // Promise<User[]>
```

## 8. 🤔 重载 vs 联合类型

### 8.1. 何时使用重载

```ts
// ✅ 重载：参数类型决定返回类型
function process(value: string): number
function process(value: number): string
function process(value: string | number): string | number {
  return typeof value === 'string' ? value.length : String(value)
}

const result1 = process('hello') // 类型：number ✅
const result2 = process(123) // 类型：string ✅
```

### 8.2. 何时使用联合类型

```ts
// ✅ 联合类型：返回类型固定
function process(value: string | number): number {
  return typeof value === 'string' ? value.length : value
}

const result1 = process('hello') // 类型：number
const result2 = process(123) // 类型：number
```

### 8.3. 对比表

| 场景                     | 重载        | 联合类型        |
| ------------------------ | ----------- | --------------- |
| **返回类型依赖参数类型** | ✅ 适合     | ❌ 类型不够精确 |
| **返回类型固定**         | ❌ 过度设计 | ✅ 适合         |
| **多种调用方式**         | ✅ 适合     | ❌ 不够灵活     |
| **代码复杂度**           | 较高        | 较低            |

### 8.4. 实际对比

::: code-group

```ts [使用重载]
// ✅ 重载：返回类型精确
function getValue(key: 'name'): string
function getValue(key: 'age'): number
function getValue(key: 'name' | 'age'): string | number {
  return key === 'name' ? 'Alice' : 25
}

const name = getValue('name') // string ✅
const age = getValue('age') // number ✅
```

```ts [使用联合类型]
// ⚠️ 联合类型：返回类型宽松
function getValue(key: 'name' | 'age'): string | number {
  return key === 'name' ? 'Alice' : 25
}

const name = getValue('name') // string | number ⚠️
const age = getValue('age') // string | number ⚠️

// 需要类型断言
const nameStr = getValue('name') as string
```

:::

## 9. 🤔 常见错误和最佳实践

### 9.1. 错误 1：实现签名不兼容

```ts
// ❌ 实现签名必须兼容所有重载签名
function bad(x: string): string
function bad(x: number): number
function bad(x: string): string {
  // Error: 实现签名类型不匹配
  return x
}

// ✅ 实现签名包含所有类型
function good(x: string): string
function good(x: number): number
function good(x: string | number): string | number {
  return typeof x === 'string' ? x : String(x)
}
```

### 9.2. 错误 2：重载顺序错误

```ts
// ❌ 更通用的重载在前，会覆盖具体的重载
function bad(value: string): number
function bad(value: 'special'): string // Error: 永远不会匹配
function bad(value: string): string | number {
  return value === 'special' ? 'Special' : value.length
}

// ✅ 更具体的重载在前
function good(value: 'special'): string
function good(value: string): number
function good(value: string): string | number {
  return value === 'special' ? 'Special' : value.length
}
```

### 9.3. 错误 3：过度使用重载

```ts
// ❌ 不需要重载，联合类型就够了
function bad(value: string): string
function bad(value: number): string
function bad(value: boolean): string
function bad(value: string | number | boolean): string {
  return String(value)
}

// ✅ 使用联合类型更简单
function good(value: string | number | boolean): string {
  return String(value)
}
```

### 9.4. 最佳实践

```ts
// ✅ 1. 当返回类型依赖参数类型时使用重载
function convert(value: string): number
function convert(value: number): string
function convert(value: string | number): string | number {
  return typeof value === 'string' ? parseInt(value) : String(value)
}

// ✅ 2. 具体的重载在前，通用的在后
function process(value: 'special'): string
function process(value: string): number
function process(value: string): string | number {
  // 实现
}

// ✅ 3. 重载签名数量合理（2-5 个）
// Good: 3 个重载
function create(type: 'user'): User
function create(type: 'post'): Post
function create(type: 'comment'): Comment
function create(type: string): any {
  // 实现
}

// ✅ 4. 使用泛型减少重载数量
// Bad: 多个重载
function map1(arr: number[], fn: (x: number) => number): number[]
function map1(arr: string[], fn: (x: string) => string): string[]
function map1(arr: boolean[], fn: (x: boolean) => boolean): boolean[]

// Good: 单个泛型函数
function map<T>(arr: T[], fn: (x: T) => T): T[] {
  return arr.map(fn)
}

// ✅ 5. 为重载添加 JSDoc 注释
/**
 * 解析值为数字
 */
function parse(value: string): number
/**
 * 格式化数字为字符串
 */
function parse(value: number): string
function parse(value: string | number): string | number {
  return typeof value === 'string' ? parseInt(value) : String(value)
}

// ✅ 6. 实现签名使用类型守卫
function process(value: string): string
function process(value: number): number
function process(value: string | number): string | number {
  if (typeof value === 'string') {
    return value.toUpperCase()
  } else {
    return value * 2
  }
}

// ✅ 7. 考虑是否可以用条件类型替代
// 重载方式
function getValue(key: 'name'): string
function getValue(key: 'age'): number
function getValue(key: string): string | number

// 条件类型方式（更灵活）
type ValueType<K extends string> = K extends 'name'
  ? string
  : K extends 'age'
  ? number
  : never

function getValue<K extends 'name' | 'age'>(key: K): ValueType<K> {
  // 实现
  return null as any
}
```

## 10. 🔗 引用

- [TypeScript Handbook - Function Overloads][1]
- [TypeScript Deep Dive - Function Overloading][2]
- [Effective TypeScript - Prefer Type-Safe Approaches to Overloaded Functions][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads
[2]: https://basarat.gitbook.io/typescript/type-system/functions#overloading
[3]: https://effectivetypescript.com/
