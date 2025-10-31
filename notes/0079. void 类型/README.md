# [0079. void 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0079.%20void%20%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是 void 类型？](#3--什么是-void-类型)
  - [3.1. 基本用法](#31-基本用法)
  - [3.2. void 的实际值](#32-void-的实际值)
- [4. 🤔 void 与 undefined 有什么区别？](#4--void-与-undefined-有什么区别)
  - [4.1. 对比表](#41-对比表)
  - [4.2. 关键区别：函数返回值](#42-关键区别函数返回值)
  - [4.3. 实际应用场景差异](#43-实际应用场景差异)
- [5. 🤔 void 类型的常见使用场景有哪些？](#5--void-类型的常见使用场景有哪些)
  - [5.1. 场景 1：事件处理器](#51-场景-1事件处理器)
  - [5.2. 场景 2：副作用函数](#52-场景-2副作用函数)
  - [5.3. 场景 3：回调函数](#53-场景-3回调函数)
  - [5.4. 场景 4：接口定义](#54-场景-4接口定义)
- [6. 🤔 void 类型有哪些特殊行为？](#6--void-类型有哪些特殊行为)
  - [6.1. 特殊行为 1：函数类型赋值](#61-特殊行为-1函数类型赋值)
  - [6.2. 特殊行为 2：方法重写](#62-特殊行为-2方法重写)
  - [6.3. 特殊行为 3：类型保护无效](#63-特殊行为-3类型保护无效)
  - [6.4. 特殊行为 4：Promise 返回值](#64-特殊行为-4promise-返回值)
- [7. 🤔 void 类型的常见错误有哪些？](#7--void-类型的常见错误有哪些)
  - [7.1. 错误 1：试图使用 void 返回值](#71-错误-1试图使用-void-返回值)
  - [7.2. 错误 2：void 与 undefined 混淆](#72-错误-2void-与-undefined-混淆)
  - [7.3. 错误 3：期望返回 void 但实际返回值](#73-错误-3期望返回-void-但实际返回值)
  - [7.4. 错误 4：在联合类型中使用 void](#74-错误-4在联合类型中使用-void)
  - [7.5. 最佳实践总结](#75-最佳实践总结)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- void 类型的定义和用途
- void 与 undefined 的区别
- void 类型的使用场景
- void 类型的特殊行为
- 常见错误和最佳实践

## 2. 🫧 评价

`void` 是 TypeScript 中一个特殊的类型，用于表示没有返回值的函数。它源自 C/C++ 等语言，但在 TypeScript 中有独特的语义。

虽然 `void` 看起来简单，但它与 `undefined` 的关系、在回调函数中的行为、以及类型兼容性规则都容易让人困惑。理解 `void` 的正确用法，对于编写类型安全的函数签名至关重要。

## 3. 🤔 什么是 void 类型？

`void` 类型表示函数没有返回值或返回值不应该被使用。

### 3.1. 基本用法

::: code-group

```ts [函数声明]
// ✅ 明确声明无返回值
function logMessage(msg: string): void {
  console.log(msg)
  // 没有 return 语句，或者 return 后不跟值
}

function doSomething(): void {
  console.log('doing something')
  return // ✅ 允许单独的 return
}
```

```ts [函数表达式]
// ✅ 箭头函数
const notify: (msg: string) => void = (msg) => {
  alert(msg)
}

// ✅ 类型别名
type LogFunction = (msg: string) => void

const log: LogFunction = (msg) => {
  console.log(msg)
}
```

```ts [方法签名]
interface Logger {
  log(msg: string): void
  error(msg: string): void
}

class ConsoleLogger implements Logger {
  log(msg: string): void {
    console.log(msg)
  }

  error(msg: string): void {
    console.error(msg)
  }
}
```

:::

### 3.2. void 的实际值

```ts
function test(): void {
  console.log('test')
}

const result = test() // result 的类型是 void
console.log(result) // 输出：undefined

// void 类型的变量只能赋值为 undefined（或 null，在非严格模式下）
let value: void = undefined
```

## 4. 🤔 void 与 undefined 有什么区别？

### 4.1. 对比表

| 特性     | void                 | undefined            |
| -------- | -------------------- | -------------------- |
| 语义     | 表示"无返回值"       | 表示"未定义的值"     |
| 使用场景 | 函数返回值类型       | 变量类型、可选属性   |
| 可赋值性 | 只能赋值 `undefined` | 可以是实际的值       |
| 函数返回 | 忽略返回值           | 必须返回 `undefined` |
| 类型兼容 | 更宽松               | 更严格               |

### 4.2. 关键区别：函数返回值

::: code-group

```ts [void：忽略返回值]
// ✅ void 类型的函数可以返回任何值（会被忽略）
type VoidFunc = () => void

const f1: VoidFunc = () => {
  return 123 // ✅ 允许！返回值被忽略
}

const f2: VoidFunc = () => {
  return 'hello' // ✅ 允许！返回值被忽略
}

const result1 = f1() // result1 类型是 void，不是 number
const result2 = f2() // result2 类型是 void，不是 string
```

```ts [undefined：必须返回 undefined]
// ❌ undefined 类型的函数必须返回 undefined
type UndefinedFunc = () => undefined

const f1: UndefinedFunc = () => {
  return undefined // ✅ 正确
}

const f2: UndefinedFunc = () => {
  return 123 // ❌ 错误：Type 'number' is not assignable to type 'undefined'
}

const f3: UndefinedFunc = () => {
  // ❌ 错误：A function whose declared type is neither 'void' nor 'any' must return a value
}
```

:::

### 4.3. 实际应用场景差异

```ts
// 场景 1：回调函数（推荐用 void）
function forEach(arr: number[], callback: (item: number) => void) {
  for (const item of arr) {
    callback(item)
  }
}

// ✅ 可以传入有返回值的函数
forEach([1, 2, 3], (item) => {
  return item * 2 // 返回值被忽略
})

forEach([1, 2, 3], (item) => {
  console.log(item) // 没有返回值也可以
})

// 场景 2：可选属性（推荐用 undefined）
interface User {
  name: string
  age?: number // 等价于 age: number | undefined
}

const user: User = { name: 'Alice' }
console.log(user.age) // undefined
```

## 5. 🤔 void 类型的常见使用场景有哪些？

### 5.1. 场景 1：事件处理器

```ts
// DOM 事件
button.addEventListener('click', (event: MouseEvent): void => {
  console.log('Button clicked')
  // 不关心返回值
})

// React 事件
interface ButtonProps {
  onClick: (event: React.MouseEvent) => void
}

const Button: React.FC<ButtonProps> = ({ onClick }) => {
  return <button onClick={onClick}>Click me</button>
}
```

### 5.2. 场景 2：副作用函数

```ts
// 日志函数
function logError(message: string, error: Error): void {
  console.error(message, error)
  // 发送到错误追踪系统
  trackError(error)
}

// 缓存更新
function updateCache(key: string, value: any): void {
  cache.set(key, value)
  localStorage.setItem(key, JSON.stringify(value))
}
```

### 5.3. 场景 3：回调函数

```ts
// Array 方法
const numbers = [1, 2, 3, 4, 5]

numbers.forEach((num: number): void => {
  console.log(num)
})

// 定时器
setTimeout((): void => {
  console.log('Time is up!')
}, 1000)

// Promise
promise.then((data): void => {
  processData(data)
})
```

### 5.4. 场景 4：接口定义

```ts
interface EventEmitter {
  on(event: string, listener: (...args: any[]) => void): void
  off(event: string, listener: (...args: any[]) => void): void
  emit(event: string, ...args: any[]): void
}

interface Disposable {
  dispose(): void
}

class Resource implements Disposable {
  dispose(): void {
    // 清理资源
  }
}
```

## 6. 🤔 void 类型有哪些特殊行为？

### 6.1. 特殊行为 1：函数类型赋值

```ts
// ✅ void 函数可以接受有返回值的函数
type VoidFunc = () => void

const f1: VoidFunc = () => 123 // ✅ 允许
const f2: VoidFunc = () => 'hello' // ✅ 允许
const f3: VoidFunc = () => {
  return true
} // ✅ 允许

// 原因：TypeScript 认为调用者不关心返回值
```

### 6.2. 特殊行为 2：方法重写

```ts
class Base {
  execute(): void {
    console.log('Base execute')
  }
}

class Derived extends Base {
  // ✅ 可以返回值，但会被忽略
  override execute(): void {
    console.log('Derived execute')
    return 123 as any // 类型系统允许，但返回值被忽略
  }
}
```

### 6.3. 特殊行为 3：类型保护无效

```ts
function process(value: string | void) {
  if (value === undefined) {
    // ⚠️ 这个检查对 void 类型无意义
    console.log('undefined')
  } else {
    // value 仍然是 string | void，不是 string
    console.log(value.toUpperCase()) // ❌ 错误
  }
}

// 正确做法：
function process(value: string | undefined) {
  if (value === undefined) {
    console.log('undefined')
  } else {
    console.log(value.toUpperCase()) // ✅ 正确
  }
}
```

### 6.4. 特殊行为 4：Promise 返回值

```ts
// ✅ Promise<void> 表示 Promise 解析但没有值
async function saveData(): Promise<void> {
  await database.save()
  // 不返回任何值
}

// 使用
const result = await saveData() // result 类型是 void
```

## 7. 🤔 void 类型的常见错误有哪些？

### 7.1. 错误 1：试图使用 void 返回值

::: code-group

```ts [❌ 错误示例]
function log(msg: string): void {
  console.log(msg)
}

const result = log('hello')
console.log(result.length) // ❌ 错误：Property 'length' does not exist on type 'void'
```

```ts [✅ 正确做法]
function log(msg: string): void {
  console.log(msg)
}

log('hello') // 不使用返回值
```

:::

### 7.2. 错误 2：void 与 undefined 混淆

::: code-group

```ts [❌ 错误示例]
function getData(): void {
  if (condition) {
    return undefined // ✅ 语法正确，但语义不清
  }
  // 实际上想表达：可能有值，也可能没有
}
```

```ts [✅ 正确做法]
function getData(): string | undefined {
  if (condition) {
    return undefined
  }
  return 'data'
}

// 或者使用可选链
const data = getData()
console.log(data?.toUpperCase())
```

:::

### 7.3. 错误 3：期望返回 void 但实际返回值

::: code-group

```ts [⚠️ 潜在问题]
type Callback = () => void

// 这个函数返回 number，但赋值给 void 类型
const callback: Callback = () => {
  return Math.random() // 返回值被忽略，可能不是你想要的
}

// 调用者无法获取返回值
const result = callback() // result 是 void，不是 number
```

```ts [✅ 明确意图]
// 如果需要返回值，不要用 void
type Callback = () => number

const callback: Callback = () => {
  return Math.random()
}

const result = callback() // result 是 number
```

:::

### 7.4. 错误 4：在联合类型中使用 void

```ts
// ❌ 不推荐：void 在联合类型中很少有意义
type Result = string | void

function process(): Result {
  if (condition) {
    return 'success'
  }
  // 隐式返回 undefined，但类型是 void
}

// ✅ 推荐：使用 undefined 或 null
type Result = string | undefined

function process(): Result {
  if (condition) {
    return 'success'
  }
  return undefined // 明确返回 undefined
}
```

### 7.5. 最佳实践总结

| 场景         | 推荐                  | 不推荐                |
| ------------ | --------------------- | --------------------- |
| 函数无返回值 | `() => void`          | `() => undefined`     |
| 可选值       | `string \| undefined` | `string \| void`      |
| 回调函数     | `(x: T) => void`      | `(x: T) => undefined` |
| Promise 无值 | `Promise<void>`       | `Promise<undefined>`  |
| 方法声明     | `method(): void`      | `method(): undefined` |

## 8. 🔗 引用

- [TypeScript Handbook - Functions][1]
- [TypeScript Deep Dive - void][2]

[1]: https://www.typescriptlang.org/docs/handbook/2/functions.html
[2]: https://basarat.gitbook.io/typescript/type-system/never#void
