# [0079. void 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0079.%20void%20%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 什么是 void 类型？](#3-什么是-void-类型)
- [4. TS 在什么情况下会将类型推断为 void？](#4-ts-在什么情况下会将类型推断为-void)
- [5. void 与 undefined 有什么区别？](#5-void-与-undefined-有什么区别)
  - [5.1. 对比表](#51-对比表)
  - [5.2. 关键区别：函数返回值](#52-关键区别函数返回值)
  - [5.3. 实际应用场景差异](#53-实际应用场景差异)
- [6. void 类型的常见使用场景有哪些？](#6-void-类型的常见使用场景有哪些)
- [7. void 类型有哪些特殊行为？](#7-void-类型有哪些特殊行为)
  - [7.1. 特殊行为 1：函数类型赋值](#71-特殊行为-1函数类型赋值)
  - [7.2. 特殊行为 2：方法重写](#72-特殊行为-2方法重写)
  - [7.3. 特殊行为 3：类型保护无效](#73-特殊行为-3类型保护无效)
  - [7.4. 特殊行为 4：Promise 返回值](#74-特殊行为-4promise-返回值)
- [8. void 类型的常见错误有哪些？](#8-void-类型的常见错误有哪些)
- [9. 引用](#9-引用)

<!-- endregion:toc -->

## 1. 本节内容

- void 类型的定义和用途
- void 与 undefined 的区别
- void 类型的使用场景
- void 类型的特殊行为
- 常见错误和最佳实践

## 2. 评价

void 类型的特殊行为很多，但我们只需要知道两点：

1. void 类型主要用来约束返回的返回值，其它地方大概率不会用到 void 类型
2. void 类型表达的含义是：函数没有返回值或返回值不应该被使用
   - 写：当你需要使用 void 来约束函数返回值时，请记住不要返回任何值，哪怕显式写了返回值也不会报错
   - 读：当你看到使用 void 类型来约束函数返回值时，就当这个函数没有返回值即可

## 3. 什么是 void 类型？

- `void` 是 TypeScript 中一个特殊的类型，它源自 C/C++ 等语言，但在 TypeScript 中有独特的语义。
- `void` 类型表示函数没有返回值或返回值不应该被使用。
- 虽然 `void` 看起来简单，但它与 `undefined` 的关系、在回调函数中的行为、以及类型兼容性规则都容易让人困惑。理解 `void` 的正确用法，对于编写类型安全的函数签名至关重要。

::: code-group

```ts [常见写法]
// 函数声明写法：
// 明确声明无返回值
function logMessage(msg: string): void {
  console.log(msg)
  // 没有 return 语句，或者 return 后不跟值
}

function doSomething(): void {
  console.log('doing something')
  return // 允许单独的 return
}

// 函数表达式写法：
// 箭头函数
const notify: (msg: string) => void = (msg) => {
  alert(msg)
}

// 类型别名
type LogFunction = (msg: string) => void

const log: LogFunction = (msg) => {
  console.log(msg)
}

// 方法签名写法：
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

如果函数没有返回值，那么返回值就是 void 类型，它的值是 undefined。

```ts
function test(): void {
  console.log('test')
}

const result = test() // result 的类型是 void
console.log(result) // 输出：undefined
```

## 4. TS 在什么情况下会将类型推断为 void？

下面是官方的描述：

void represents the return value of functions which don’t return a value. It’s the inferred type any time a function doesn’t have any return statements, or doesn’t return any explicit value from those return statements:

void 表示不返回任何值的函数的返回值类型。当函数没有任何 return 语句，或者从这些 return 语句中没有返回任何显式值时，推断出的类型就是 void：

```ts
// The inferred return type is void
function noop() {
  return
}
// TS 类型推断结果：
// function noop(): void
```

In JavaScript, a function that doesn’t return any value will implicitly return the value undefined. However, void and undefined are not the same thing in TypeScript.

在 JavaScript 中，不返回任何值的函数会隐式返回 undefined 。但在 TypeScript 中， void 和 undefined 并非同一概念。

void is not the same as undefined.

void 与 undefined 是不同的类型。

## 5. void 与 undefined 有什么区别？

### 5.1. 对比表

| 特性     | void           | undefined            |
| -------- | -------------- | -------------------- |
| 语义     | 表示"无返回值" | 表示"未定义的值"     |
| 使用场景 | 函数返回值类型 | 变量类型、可选属性   |
| 函数返回 | 忽略返回值     | 必须返回 `undefined` |

### 5.2. 关键区别：函数返回值

::: code-group

```ts [void：忽略返回值]
// void 类型的函数可以返回任何值（会被忽略）
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
// undefined 类型的函数必须返回 undefined
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

### 5.3. 实际应用场景差异

- 场景 1：回调函数（推荐用 void）
- 场景 2：可选属性（推荐用 undefined）

::: code-group

```ts [1]
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
```

```ts [2]
interface User {
  name: string
  age?: number // 等价于 age: number | undefined
}

const user: User = { name: 'Alice' }
console.log(user.age) // undefined
```

:::

## 6. void 类型的常见使用场景有哪些？

主要都是用于函数的返回值。

- 场景 1：事件处理器
- 场景 2：副作用函数
- 场景 3：回调函数
- 场景 4：接口定义
- ……

::: code-group

```ts [1]
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

```ts [2]
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

```ts [3]
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

```ts [4]
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

:::

## 7. void 类型有哪些特殊行为？

### 7.1. 特殊行为 1：函数类型赋值

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

### 7.2. 特殊行为 2：方法重写

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
    // ⚠️ 注意，这里如果不断言，会报错。
    // Type 'number' is not assignable to type 'void'.
  }
}
```

### 7.3. 特殊行为 3：类型保护无效

虽然函数返回值如果是 void 类型，通常意味着它的值是 undefined，但是 void 和 undefined 是不同的类型。

```ts
// ❌ 错误做法
function process1(value: string | void) {
  if (value !== undefined) {
    // ⚠️ 这个检查对 void 类型无意义
    console.log(value) // undefined，还是 undefined 还是 undefined
    // value 仍然是 string | void，不是 string
    console.log(value.toUpperCase()) // ❌ 错误
    // Property 'toUpperCase' does not exist on type 'string | void'.
    // Property 'toUpperCase' does not exist on type 'void'.(2339)
  } else {
    console.log('undefined')
  }
}
process1()

// ✅ 正确做法
function process2(value: string | undefined) {
  if (value === undefined) {
    console.log('undefined')
  } else {
    console.log(value.toUpperCase()) // ✅ 正确
  }
}
process2()
```

### 7.4. 特殊行为 4：Promise 返回值

```ts
;(async () => {
  // Promise<void> 表示 Promise 解析但没有值
  async function saveData(): Promise<void> {
    // await database.save()
    // 不返回任何值
  }

  // 使用
  const result1 = await saveData() // result 类型是 void
  const result2 = saveData() // result 类型是 Promise<void>
})()
```

## 8. void 类型的常见错误有哪些？

- 错误 1：试图使用 void 返回值
- 错误 2：void 与 undefined 语义混淆，在约束函数返回值时，前者表示函数没有返回值，后者表示返回值可能是 undefined
- 错误 3：期望返回 void 但实际有返回值
- 错误 4：在联合类型中使用 void

::: code-group

```ts [1]
// ❌ 错误示例
function log(msg: string): void {
  console.log(msg)
}

const result = log('hello')
console.log(result.length) // ❌ 错误：Property 'length' does not exist on type 'void'

// ✅ 正确做法
function log(msg: string): void {
  console.log(msg)
}

log('hello') // 不使用返回值
```

```ts [2]
// ❌ 错误示例
function getData(): string | void {
  if (condition) {
    return undefined // ✅ 语法正确，但语义不清
  }
  // 实际上想表达：可能有值，也可能没有
  return 'data'
}

// 或者使用可选链
const data = getData()
console.log(data?.toUpperCase()) // ❌ 这里会报错

// ✅ 正确做法
function getData(): string | undefined {
  if (condition) {
    return undefined
  }
  return 'data'
}

// 或者使用可选链
const data = getData()
console.log(data?.toUpperCase()) // ✅ 正确
```

```ts [3]
// ⚠️ 潜在问题
type Callback = () => void

// 这个函数返回 number，但赋值给 void 类型
const callback: Callback = () => {
  return Math.random() // 返回值被忽略，可能不是你想要的
}

// 调用者无法获取返回值
const result = callback() // result 是 void，不是 number

// ✅ 明确意图
// 如果需要返回值，不要用 void
type Callback = () => number

const callback: Callback = () => {
  return Math.random()
}

const result = callback() // result 是 number
```

```ts [4]
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

:::

最佳实践总结：

| 场景         | 推荐                  | 不推荐                |
| ------------ | --------------------- | --------------------- |
| 函数无返回值 | `() => void`          | `() => undefined`     |
| 可选值       | `string \| undefined` | `string \| void`      |
| 回调函数     | `(x: T) => void`      | `(x: T) => undefined` |
| Promise 无值 | `Promise<void>`       | `Promise<undefined>`  |
| 方法声明     | `method(): void`      | `method(): undefined` |

## 9. 引用

- [TypeScript Handbook - Functions][1]
- [void][2]
- [Why are functions returning non-void assignable to function returning void? - “为什么返回非 void 的函数可以赋值给返回 void 的函数？”][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/functions.html
[2]: https://www.typescriptlang.org/docs/handbook/2/functions.html#void
[3]: https://github.com/Microsoft/TypeScript/wiki/FAQ#why-are-functions-returning-non-void-assignable-to-function-returning-void
