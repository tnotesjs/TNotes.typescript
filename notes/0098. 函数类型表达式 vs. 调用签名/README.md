# [0098. 函数类型表达式 vs. 调用签名](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0098.%20%E5%87%BD%E6%95%B0%E7%B1%BB%E5%9E%8B%E8%A1%A8%E8%BE%BE%E5%BC%8F%20vs.%20%E8%B0%83%E7%94%A8%E7%AD%BE%E5%90%8D)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是函数类型表达式？](#3--什么是函数类型表达式)
  - [3.1. 基本语法](#31-基本语法)
  - [3.2. 特点](#32-特点)
- [4. 🤔 什么是调用签名？](#4--什么是调用签名)
  - [4.1. 基本语法](#41-基本语法)
  - [4.2. 特点](#42-特点)
- [5. 🤔 两者的区别](#5--两者的区别)
  - [5.1. 语法差异](#51-语法差异)
  - [5.2. 功能对比表](#52-功能对比表)
  - [5.3. 实际对比](#53-实际对比)
- [6. 🤔 何时使用哪种方式？](#6--何时使用哪种方式)
  - [6.1. 使用函数类型表达式](#61-使用函数类型表达式)
  - [6.2. 使用调用签名](#62-使用调用签名)
- [7. 🤔 常见使用场景](#7--常见使用场景)
  - [7.1. 场景 1：高阶函数](#71-场景-1高阶函数)
  - [7.2. 场景 2：jQuery 式 API](#72-场景-2jquery-式-api)
  - [7.3. 场景 3：验证器库](#73-场景-3验证器库)
  - [7.4. 场景 4：数组方法](#74-场景-4数组方法)
  - [7.5. 场景 5：函数工厂](#75-场景-5函数工厂)
  - [7.6. 场景 6：中间件](#76-场景-6中间件)
  - [7.7. 场景 7：类型守卫](#77-场景-7类型守卫)
- [8. 🤔 常见错误和最佳实践](#8--常见错误和最佳实践)
  - [8.1. 错误 1：混淆两种语法](#81-错误-1混淆两种语法)
  - [8.2. 错误 2：试图给函数类型表达式添加属性](#82-错误-2试图给函数类型表达式添加属性)
  - [8.3. 错误 3：不必要地使用调用签名](#83-错误-3不必要地使用调用签名)
  - [8.4. 最佳实践](#84-最佳实践)
- [9. 🔗 引用](#9--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 函数类型表达式的语法
- 调用签名的语法
- 两者的区别和适用场景
- 与构造签名的结合
- 实际应用案例

## 2. 🫧 评价

TypeScript 提供了**两种方式**来描述函数类型：

1. **函数类型表达式**（Function Type Expression）：使用箭头语法 `=>`
2. **调用签名**（Call Signature）：在对象类型中使用方法语法

虽然两者看起来相似，但有重要的区别：

- **函数类型表达式**：简洁，适合简单函数类型
- **调用签名**：灵活，可以添加属性、重载、泛型等

理解两者的区别，能帮助你：

1. 选择合适的函数类型定义方式
2. 正确定义带属性的函数
3. 实现函数重载
4. 编写更灵活的类型定义

## 3. 🤔 什么是函数类型表达式？

函数类型表达式使用**箭头语法**来定义函数类型。

```ts
// ✅ 函数类型表达式
type Add = (a: number, b: number) => number

// 使用
const add: Add = (a, b) => a + b

// ✅ 完整示例
type GreetFunction = (name: string) => string

const greet: GreetFunction = (name) => {
  return `Hello, ${name}`
}
```

### 3.1. 基本语法

```ts
// 类型别名
type FunctionType = (param1: Type1, param2: Type2) => ReturnType

// 泛型
type GenericFunction<T> = (value: T) => T

// 可选参数
type OptionalParam = (required: string, optional?: number) => void

// 剩余参数
type RestParams = (...args: number[]) => number
```

### 3.2. 特点

```ts
// ✅ 简洁直观
type Transform = (x: number) => number

// ✅ 易于阅读
type Callback = (error: Error | null, data: any) => void

// ✅ 支持泛型
type Mapper<T, U> = (value: T) => U

// ❌ 不能添加属性
type FuncWithProp = (x: number) => number
// 无法给 FuncWithProp 添加属性
```

## 4. 🤔 什么是调用签名？

调用签名在**对象类型**或**接口**中使用**方法语法**定义函数类型。

```ts
// ✅ 调用签名
type Add = {
  (a: number, b: number): number
}

// 使用
const add: Add = (a, b) => a + b

// ✅ 接口形式
interface GreetFunction {
  (name: string): string
}

const greet: GreetFunction = (name) => {
  return `Hello, ${name}`
}
```

### 4.1. 基本语法

```ts
// 类型别名
type FunctionType = {
  (param1: Type1, param2: Type2): ReturnType
}

// 接口
interface FunctionType {
  (param1: Type1, param2: Type2): ReturnType
}

// 多个调用签名（重载）
type Overloaded = {
  (x: number): number
  (x: string): string
}
```

### 4.2. 特点

```ts
// ✅ 可以添加属性
type FuncWithProp = {
  (x: number): number
  description: string
  version: number
}

const func: FuncWithProp = Object.assign((x: number) => x * 2, {
  description: 'Double',
  version: 1,
})

// ✅ 可以有多个调用签名（重载）
type Process = {
  (x: number): number
  (x: string): string
}

// ✅ 可以结合构造签名
type Constructor = {
  new (name: string): { name: string }
  (name: string): string
}
```

## 5. 🤔 两者的区别

### 5.1. 语法差异

::: code-group

```ts [函数类型表达式]
// 使用箭头语法 =>
type Add = (a: number, b: number) => number

// 简洁
type Transform<T> = (value: T) => T

// 一行定义
type Callback = (error: Error | null) => void
```

```ts [调用签名]
// 使用方法语法 :
type Add = {
  (a: number, b: number): number
}

// 需要对象包裹
type Transform<T> = {
  (value: T): T
}

// 多行定义
type Callback = {
  (error: Error | null): void
}
```

:::

### 5.2. 功能对比表

| 特性         | 函数类型表达式           | 调用签名                   |
| ------------ | ------------------------ | -------------------------- |
| **语法**     | `(params) => ReturnType` | `{ (params): ReturnType }` |
| **简洁性**   | ✅ 更简洁                | ❌ 较繁琐                  |
| **添加属性** | ❌ 不支持                | ✅ 支持                    |
| **函数重载** | ❌ 不支持                | ✅ 支持                    |
| **构造签名** | ❌ 不支持                | ✅ 支持                    |
| **适用场景** | 简单函数类型             | 复杂函数类型               |

### 5.3. 实际对比

::: code-group

```ts [简单函数]
// ✅ 函数类型表达式：简单场景更合适
type Predicate = (value: any) => boolean
type Mapper = (value: any) => any
type Callback = () => void

// 调用签名：过于繁琐
type Predicate = {
  (value: any): boolean
}
```

```ts [带属性的函数]
// ❌ 函数类型表达式：无法添加属性
type Add = (a: number, b: number) => number
// 无法给 Add 添加属性

// ✅ 调用签名：可以添加属性
type Add = {
  (a: number, b: number): number
  description: string
}

const add: Add = Object.assign((a: number, b: number) => a + b, {
  description: 'Addition',
})
```

```ts [函数重载]
// ❌ 函数类型表达式：不支持重载
type Process = (x: number | string) => number | string
// 类型不够精确

// ✅ 调用签名：支持重载
type Process = {
  (x: number): number
  (x: string): string
}

const process: Process = (x: any) => {
  return typeof x === 'number' ? x * 2 : x.toUpperCase()
}
```

:::

## 6. 🤔 何时使用哪种方式？

### 6.1. 使用函数类型表达式

```ts
// ✅ 1. 简单的函数类型
type Predicate<T> = (value: T) => boolean
type Mapper<T, U> = (value: T) => U
type Callback = () => void

// ✅ 2. 回调函数参数
function forEach<T>(
  array: T[],
  callback: (item: T, index: number) => void
): void {
  array.forEach(callback)
}

// ✅ 3. Promise 的回调
type ThenCallback<T, U> = (value: T) => U | Promise<U>
type CatchCallback = (error: Error) => void

// ✅ 4. 事件处理器
type EventHandler = (event: Event) => void
type ClickHandler = (event: MouseEvent) => void
```

### 6.2. 使用调用签名

```ts
// ✅ 1. 带属性的函数
type jQuery = {
  (selector: string): Element
  version: string
  ajax(url: string): Promise<any>
}

// ✅ 2. 函数重载
type Process = {
  (x: number): number
  (x: string): string
  (x: boolean): boolean
}

// ✅ 3. 既可调用又可构造
type DateConstructor = {
  new (value: number): Date
  (): string
  parse(s: string): number
}

// ✅ 4. 复杂的函数类型
type ValidatorFunction = {
  (value: any): boolean
  message?: string
  async?: boolean
}
```

## 7. 🤔 常见使用场景

### 7.1. 场景 1：高阶函数

```ts
// ✅ 函数类型表达式：简洁
type UnaryFunction<T> = (arg: T) => T

function compose<T>(...functions: UnaryFunction<T>[]): UnaryFunction<T> {
  return (arg: T) => {
    return functions.reduceRight((result, fn) => fn(result), arg)
  }
}

// 使用
const addOne = (n: number) => n + 1
const double = (n: number) => n * 2
const composed = compose(double, addOne)
```

### 7.2. 场景 2：jQuery 式 API

```ts
// ✅ 调用签名：支持属性和方法
interface jQuery {
  (selector: string): JQueryObject
  version: string
  ajax(settings: AjaxSettings): Promise<any>
  get(url: string): Promise<any>
}

interface JQueryObject {
  addClass(className: string): this
  removeClass(className: string): this
  text(): string
  text(content: string): this
}

declare const $: jQuery
```

### 7.3. 场景 3：验证器库

```ts
// ✅ 调用签名：带元数据
type Validator = {
  (value: any): boolean
  message: string
  type: 'string' | 'number' | 'email'
}

const emailValidator: Validator = Object.assign(
  (value: any) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  {
    message: 'Invalid email format',
    type: 'email' as const,
  }
)

// 使用
if (!emailValidator('test@example.com')) {
  console.error(emailValidator.message)
}
```

### 7.4. 场景 4：数组方法

```ts
// ✅ 函数类型表达式：标准库风格
interface Array<T> {
  map<U>(callback: (value: T, index: number, array: T[]) => U): U[]
  filter(predicate: (value: T, index: number, array: T[]) => boolean): T[]
  reduce<U>(
    callback: (accumulator: U, value: T, index: number, array: T[]) => U,
    initialValue: U
  ): U
}
```

### 7.5. 场景 5：函数工厂

```ts
// ✅ 调用签名：重载 + 属性
type CreateValidator = {
  (type: 'email'): Validator
  (type: 'phone'): Validator
  (type: 'url'): Validator
  validators: Record<string, Validator>
}

const createValidator: CreateValidator = Object.assign(
  (type: string) => {
    return createValidator.validators[type]
  },
  {
    validators: {
      email: emailValidator,
      phone: phoneValidator,
      url: urlValidator,
    },
  }
)
```

### 7.6. 场景 6：中间件

```ts
// ✅ 函数类型表达式：中间件模式
type Middleware<T> = (context: T, next: () => Promise<void>) => Promise<void>

type MiddlewareChain<T> = {
  use(middleware: Middleware<T>): this
  execute(context: T): Promise<void>
}

class MiddlewareManager<T> implements MiddlewareChain<T> {
  private middlewares: Middleware<T>[] = []

  use(middleware: Middleware<T>): this {
    this.middlewares.push(middleware)
    return this
  }

  async execute(context: T): Promise<void> {
    // 实现中间件链
  }
}
```

### 7.7. 场景 7：类型守卫

```ts
// ✅ 函数类型表达式 + 类型谓词
type TypeGuard<T> = (value: any) => value is T

const isString: TypeGuard<string> = (value): value is string => {
  return typeof value === 'string'
}

const isNumber: TypeGuard<number> = (value): value is number => {
  return typeof value === 'number'
}

// 使用
function process(value: unknown) {
  if (isString(value)) {
    console.log(value.toUpperCase())
  } else if (isNumber(value)) {
    console.log(value.toFixed(2))
  }
}
```

## 8. 🤔 常见错误和最佳实践

### 8.1. 错误 1：混淆两种语法

```ts
// ❌ 混合使用
type Bad = (x: number): number // Error: ';' expected

// ✅ 函数类型表达式使用 =>
type Good1 = (x: number) => number

// ✅ 调用签名使用 :
type Good2 = {
  (x: number): number
}
```

### 8.2. 错误 2：试图给函数类型表达式添加属性

```ts
// ❌ 函数类型表达式不能有属性
type Bad = (x: number) => number & { prop: string }
// 这个类型是不可能实现的

// ✅ 使用调用签名
type Good = {
  (x: number): number
  prop: string
}
```

### 8.3. 错误 3：不必要地使用调用签名

```ts
// ❌ 简单函数使用调用签名过于繁琐
type Bad = {
  (x: number): number
}

// ✅ 使用函数类型表达式更简洁
type Good = (x: number) => number
```

### 8.4. 最佳实践

```ts
// ✅ 1. 简单函数使用函数类型表达式
type Predicate<T> = (value: T) => boolean
type Mapper<T, U> = (value: T) => U

// ✅ 2. 复杂函数使用调用签名
type ComplexFunction = {
  (x: number): number
  (x: string): string
  cache: Map<any, any>
}

// ✅ 3. 回调函数使用函数类型表达式
function forEach<T>(array: T[], callback: (item: T) => void): void {
  // 实现
}

// ✅ 4. 库 API 使用调用签名
interface $ {
  (selector: string): JQuery
  ajax(url: string): Promise<any>
}

// ✅ 5. 类型别名命名清晰
type Callback = () => void // Good
type Fn = () => void // Less clear

// ✅ 6. 函数重载使用调用签名
type Process = {
  (x: number): number
  (x: string): string
}

// ✅ 7. 泛型约束明确
type Transform<T, U> = (value: T) => U
type Validator<T> = (value: T) => boolean

// ✅ 8. 文档化复杂类型
/**
 * 验证器函数，支持同步和异步验证
 */
type Validator = {
  /** 执行验证 */
  (value: any): boolean | Promise<boolean>
  /** 错误消息 */
  message?: string
  /** 是否异步 */
  async?: boolean
}

// ✅ 9. 提取公共类型
type Handler = (event: Event) => void
type AsyncHandler = (event: Event) => Promise<void>

// ✅ 10. 使用工具类型
type AsyncFunction<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => Promise<ReturnType<T>>

type SyncToAsync = AsyncFunction<(x: number) => number>
// (x: number) => Promise<number>
```

## 9. 🔗 引用

- [TypeScript Handbook - Function Types][1]
- [TypeScript Handbook - Call Signatures][2]
- [TypeScript Deep Dive - Function Types][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/functions.html
[2]: https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures
[3]: https://basarat.gitbook.io/typescript/type-system/functions
