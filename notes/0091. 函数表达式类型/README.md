# [0091. 函数表达式类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0091.%20%E5%87%BD%E6%95%B0%E8%A1%A8%E8%BE%BE%E5%BC%8F%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是函数表达式类型？](#3--什么是函数表达式类型)
- [4. 🤔 如何声明函数表达式类型？](#4--如何声明函数表达式类型)
  - [4.1. 基本语法](#41-基本语法)
  - [4.2. 示例](#42-示例)
- [5. 🤔 函数类型的语法形式](#5--函数类型的语法形式)
  - [5.1. 箭头语法（推荐）](#51-箭头语法推荐)
  - [5.2. 对象字面量语法](#52-对象字面量语法)
  - [5.3. 类型别名](#53-类型别名)
  - [5.4. 接口定义](#54-接口定义)
- [6. 🤔 函数表达式 vs 函数声明](#6--函数表达式-vs-函数声明)
  - [6.1. 对比表](#61-对比表)
  - [6.2. 实际对比](#62-实际对比)
  - [6.3. 何时使用哪种？](#63-何时使用哪种)
- [7. 🤔 类型别名与接口](#7--类型别名与接口)
  - [7.1. 类型别名（推荐）](#71-类型别名推荐)
  - [7.2. 接口定义](#72-接口定义)
  - [7.3. 类型别名 vs 接口](#73-类型别名-vs-接口)
- [8. 🤔 常见使用场景](#8--常见使用场景)
  - [8.1. 场景 1：回调函数](#81-场景-1回调函数)
  - [8.2. 场景 2：事件处理器](#82-场景-2事件处理器)
  - [8.3. 场景 3：高阶函数](#83-场景-3高阶函数)
  - [8.4. 场景 4：工厂函数](#84-场景-4工厂函数)
  - [8.5. 场景 5：函数组合](#85-场景-5函数组合)
  - [8.6. 场景 6：Promise 处理](#86-场景-6promise-处理)
  - [8.7. 场景 7：中间件模式](#87-场景-7中间件模式)
- [9. 🤔 常见错误和最佳实践](#9--常见错误和最佳实践)
  - [9.1. 错误 1：忘记返回值类型](#91-错误-1忘记返回值类型)
  - [9.2. 错误 2：参数数量不匹配](#92-错误-2参数数量不匹配)
  - [9.3. 错误 3：this 上下文问题](#93-错误-3this-上下文问题)
  - [9.4. 最佳实践](#94-最佳实践)
- [10. 🔗 引用](#10--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 函数表达式类型的定义
- 函数类型的声明语法
- 类型别名与接口的使用
- 与函数声明的对比
- 回调函数的类型定义
- 实际应用场景

## 2. 🫧 评价

函数表达式类型（Function Expression Types）是 TypeScript 中为**函数表达式**添加类型注解的方式。与函数声明不同，函数表达式可以被赋值给变量，因此需要为整个函数定义类型。

理解函数表达式类型，能帮助你：

1. 编写类型安全的回调函数
2. 定义高阶函数的参数类型
3. 创建可复用的函数类型
4. 提升代码的可维护性

函数表达式类型是 TypeScript 函数类型系统的核心，掌握它是编写高质量 TypeScript 代码的基础。

## 3. 🤔 什么是函数表达式类型？

函数表达式类型是为**函数表达式**定义的类型签名，描述函数的**参数类型**和**返回值类型**。

```ts
// 函数表达式（没有类型注解）
const add = function (a, b) {
  return a + b
}

// ✅ 函数表达式类型（完整类型注解）
const add: (a: number, b: number) => number = function (a, b) {
  return a + b
}

// ✅ 箭头函数形式
const add: (a: number, b: number) => number = (a, b) => a + b
```

**关键概念**：

- **类型在左侧**：`变量: 类型 = 值`
- **箭头表示返回值**：`(参数) => 返回值`
- **类型推断**：可以省略右侧函数的类型注解

## 4. 🤔 如何声明函数表达式类型？

### 4.1. 基本语法

```ts
// 语法：(参数列表) => 返回值类型
const func: (param1: Type1, param2: Type2) => ReturnType = (param1, param2) => {
  // 实现
}
```

### 4.2. 示例

::: code-group

```ts [无类型]
// ❌ 没有类型注解
const greet = function (name) {
  return `Hello, ${name}`
}
// 参数 'name' 隐式具有 'any' 类型
```

```ts [内联类型]
// ✅ 完整的类型注解
const greet: (name: string) => string = function (name) {
  return `Hello, ${name}`
}

// ✅ 箭头函数形式
const greet: (name: string) => string = (name) => {
  return `Hello, ${name}`
}
```

```ts [类型推断]
// ✅ 右侧函数可以省略类型（类型推断）
const greet: (name: string) => string = function (name) {
  return `Hello, ${name}`
  // name 自动推断为 string
}

// ✅ 更简洁
const greet: (name: string) => string = (name) => `Hello, ${name}`
```

:::

## 5. 🤔 函数类型的语法形式

### 5.1. 箭头语法（推荐）

```ts
// ✅ 箭头语法（最常用）
const add: (a: number, b: number) => number = (a, b) => a + b

// 无参数
const getRandom: () => number = () => Math.random()

// 多个参数
const calculate: (a: number, b: number, op: string) => number = (a, b, op) => {
  // 实现
}
```

### 5.2. 对象字面量语法

```ts
// 使用对象字面量形式
const add: { (a: number, b: number): number } = (a, b) => a + b

// 等价于箭头语法
const add: (a: number, b: number) => number = (a, b) => a + b
```

### 5.3. 类型别名

```ts
// ✅ 使用 type 定义函数类型（推荐）
type AddFunction = (a: number, b: number) => number

const add: AddFunction = (a, b) => a + b
const subtract: AddFunction = (a, b) => a - b
```

### 5.4. 接口定义

```ts
// 使用接口定义函数类型
interface AddFunction {
  (a: number, b: number): number
}

const add: AddFunction = (a, b) => a + b
```

## 6. 🤔 函数表达式 vs 函数声明

### 6.1. 对比表

| 特性         | 函数声明             | 函数表达式                   |
| ------------ | -------------------- | ---------------------------- |
| **语法**     | `function name() {}` | `const name = function() {}` |
| **类型位置** | 参数和返回值上       | 变量类型注解                 |
| **提升**     | 是                   | 否（const/let）              |
| **赋值**     | 不可以               | 可以                         |
| **使用场景** | 独立函数             | 回调、赋值、高阶函数         |

### 6.2. 实际对比

::: code-group

```ts [函数声明]
// 函数声明：类型在参数和返回值上
function add(a: number, b: number): number {
  return a + b
}

// ✅ 会被提升
console.log(add(1, 2)) // 可以在声明前调用

// ❌ 不能赋值
// add = function() {} // Error
```

```ts [函数表达式]
// 函数表达式：类型在变量上
const add: (a: number, b: number) => number = (a, b) => a + b

// ❌ 不会被提升
// console.log(add(1, 2)) // Error: Cannot access 'add' before initialization

// ✅ 可以重新赋值（如果用 let）
let multiply: (a: number, b: number) => number
multiply = (a, b) => a * b
```

:::

### 6.3. 何时使用哪种？

```ts
// ✅ 函数声明：顶层独立函数
function calculateTotal(items: Item[]): number {
  // 实现
}

// ✅ 函数表达式：赋值给变量
const handleClick: (event: MouseEvent) => void = (event) => {
  console.log(event)
}

// ✅ 函数表达式：作为参数
const numbers = [1, 2, 3, 4, 5]
const doubled = numbers.map((n: number): number => n * 2)

// ✅ 函数表达式：立即执行函数
const result = ((x: number): number => x * 2)(5)
```

## 7. 🤔 类型别名与接口

### 7.1. 类型别名（推荐）

```ts
// ✅ 使用 type 定义函数类型
type BinaryOperation = (a: number, b: number) => number

const add: BinaryOperation = (a, b) => a + b
const subtract: BinaryOperation = (a, b) => a - b
const multiply: BinaryOperation = (a, b) => a * b
const divide: BinaryOperation = (a, b) => a / b

// 带可选参数
type Formatter = (value: string, uppercase?: boolean) => string

const format: Formatter = (value, uppercase = false) => {
  return uppercase ? value.toUpperCase() : value
}

// 带剩余参数
type Logger = (message: string, ...args: any[]) => void

const log: Logger = (message, ...args) => {
  console.log(message, ...args)
}
```

### 7.2. 接口定义

```ts
// 使用接口定义函数类型
interface BinaryOperation {
  (a: number, b: number): number
}

const add: BinaryOperation = (a, b) => a + b

// 带属性的函数接口
interface Counter {
  (start: number): string
  interval: number
  reset(): void
}

const counter: Counter = ((start: number) => {
  return `Count: ${start}`
}) as Counter

counter.interval = 1000
counter.reset = () => console.log('Reset')
```

### 7.3. 类型别名 vs 接口

```ts
// ✅ 类型别名：简洁，适合纯函数类型
type Add = (a: number, b: number) => number

// ✅ 接口：适合需要属性的函数对象
interface jQuery {
  (selector: string): HTMLElement
  version: string
  ajax(url: string): Promise<any>
}
```

## 8. 🤔 常见使用场景

### 8.1. 场景 1：回调函数

```ts
// 定义回调函数类型
type Callback = (error: Error | null, result?: any) => void

function fetchData(url: string, callback: Callback): void {
  // 模拟异步操作
  setTimeout(() => {
    callback(null, { data: 'result' })
  }, 1000)
}

// 使用
fetchData('/api/data', (error, result) => {
  if (error) {
    console.error(error)
  } else {
    console.log(result)
  }
})
```

### 8.2. 场景 2：事件处理器

```ts
// 事件处理器类型
type EventHandler = (event: Event) => void
type MouseEventHandler = (event: MouseEvent) => void
type KeyboardEventHandler = (event: KeyboardEvent) => void

// 使用
const handleClick: MouseEventHandler = (event) => {
  console.log('Clicked at:', event.clientX, event.clientY)
}

const handleKeyPress: KeyboardEventHandler = (event) => {
  console.log('Key pressed:', event.key)
}

// React 风格
type ReactMouseEvent = (event: React.MouseEvent<HTMLButtonElement>) => void

const onClick: ReactMouseEvent = (event) => {
  event.preventDefault()
  console.log('Button clicked')
}
```

### 8.3. 场景 3：高阶函数

```ts
// 高阶函数：接收函数作为参数
type Predicate<T> = (item: T) => boolean
type Mapper<T, U> = (item: T) => U

function filter<T>(array: T[], predicate: Predicate<T>): T[] {
  return array.filter(predicate)
}

function map<T, U>(array: T[], mapper: Mapper<T, U>): U[] {
  return array.map(mapper)
}

// 使用
const numbers = [1, 2, 3, 4, 5]
const evens = filter(numbers, (n) => n % 2 === 0)
const doubled = map(numbers, (n) => n * 2)
```

### 8.4. 场景 4：工厂函数

```ts
// 工厂函数类型
type Factory<T> = () => T
type FactoryWithConfig<T, C> = (config: C) => T

// 使用
const createUser: Factory<User> = () => ({
  id: Math.random(),
  name: 'Anonymous',
  email: '',
})

const createLogger: FactoryWithConfig<Logger, LogConfig> = (config) => ({
  log: (message: string) => {
    if (config.level >= LogLevel.Info) {
      console.log(message)
    }
  },
})
```

### 8.5. 场景 5：函数组合

```ts
// 函数组合类型
type UnaryFunction<T, U> = (arg: T) => U

function compose<A, B, C>(
  f: UnaryFunction<B, C>,
  g: UnaryFunction<A, B>
): UnaryFunction<A, C> {
  return (arg: A) => f(g(arg))
}

// 使用
const addOne: UnaryFunction<number, number> = (n) => n + 1
const double: UnaryFunction<number, number> = (n) => n * 2

const addOneThenDouble = compose(double, addOne)
console.log(addOneThenDouble(5)) // 12
```

### 8.6. 场景 6：Promise 处理

```ts
// Promise 相关函数类型
type AsyncFunction<T, U> = (arg: T) => Promise<U>
type ErrorHandler = (error: Error) => void
type SuccessHandler<T> = (result: T) => void

// 使用
const fetchUser: AsyncFunction<string, User> = async (id) => {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

const handleError: ErrorHandler = (error) => {
  console.error('Error:', error.message)
}

const handleSuccess: SuccessHandler<User> = (user) => {
  console.log('User:', user.name)
}
```

### 8.7. 场景 7：中间件模式

```ts
// Express 风格中间件
type Request = { url: string; method: string }
type Response = { status: number; send: (data: any) => void }
type NextFunction = () => void
type Middleware = (req: Request, res: Response, next: NextFunction) => void

// 使用
const logger: Middleware = (req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
}

const auth: Middleware = (req, res, next) => {
  // 验证逻辑
  next()
}
```

## 9. 🤔 常见错误和最佳实践

### 9.1. 错误 1：忘记返回值类型

```ts
// ❌ 没有指定返回值类型
const add: (a: number, b: number) => void = (a, b) => a + b
// 返回值被忽略！

// ✅ 指定返回值类型
const add: (a: number, b: number) => number = (a, b) => a + b
```

### 9.2. 错误 2：参数数量不匹配

```ts
// ❌ 类型定义 2 个参数，实现只有 1 个
const add: (a: number, b: number) => number = (a) => a + 1
// Error: Type '(a: number) => number' is not assignable to type '(a: number, b: number) => number'

// ✅ 参数数量匹配
const add: (a: number, b: number) => number = (a, b) => a + b
```

### 9.3. 错误 3：this 上下文问题

```ts
// ⚠️ 箭头函数没有自己的 this
const obj = {
  value: 42,
  getValue: () => this.value, // this 指向外层
}

// ✅ 使用普通函数
const obj = {
  value: 42,
  getValue: function () {
    return this.value
  },
}

// ✅ 或使用 this 类型注解
type GetValue = (this: { value: number }) => number
```

### 9.4. 最佳实践

```ts
// ✅ 1. 使用类型别名复用函数类型
type BinaryOp = (a: number, b: number) => number

const add: BinaryOp = (a, b) => a + b
const subtract: BinaryOp = (a, b) => a - b

// ✅ 2. 为复杂函数类型添加注释
/**
 * 异步数据获取函数
 * @param id - 数据 ID
 * @returns Promise 包装的数据
 */
type FetchFunction<T> = (id: string) => Promise<T>

// ✅ 3. 使用泛型提高复用性
type Mapper<T, U> = (item: T, index: number) => U

// ✅ 4. 可选参数放在最后
type Format = (value: string, uppercase?: boolean, trim?: boolean) => string

// ✅ 5. 使用剩余参数类型
type Logger = (message: string, ...args: any[]) => void

// ✅ 6. 明确 void 返回类型
type Action = () => void // 无返回值

// ✅ 7. 函数类型使用箭头语法
type Good = (a: number) => number
type Bad = { (a: number): number } // 不推荐

// ✅ 8. 回调函数使用具名类型
type Callback = (error: Error | null, result?: any) => void

function fetchData(callback: Callback) {
  // 实现
}

// ✅ 9. 事件处理器类型明确
type ClickHandler = (event: MouseEvent) => void

const onClick: ClickHandler = (event) => {
  console.log('Clicked')
}

// ✅ 10. 高阶函数类型清晰
type Factory<T> = () => T
type Transform<T, U> = (value: T) => U
```

## 10. 🔗 引用

- [TypeScript Handbook - Functions][1]
- [TypeScript Handbook - Function Types][2]
- [TypeScript Deep Dive - Function Types][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/functions.html
[2]: https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions
[3]: https://basarat.gitbook.io/typescript/type-system/functions
