# [0096. 函数的 void 返回类型的特殊性](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0096.%20%E5%87%BD%E6%95%B0%E7%9A%84%20void%20%E8%BF%94%E5%9B%9E%E7%B1%BB%E5%9E%8B%E7%9A%84%E7%89%B9%E6%AE%8A%E6%80%A7)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 void 的基本概念](#3--void-的基本概念)
  - [3.1. void 的定义](#31-void-的定义)
  - [3.2. void 的值](#32-void-的值)
  - [3.3. void vs never](#33-void-vs-never)
- [4. 🤔 void 返回类型的特殊规则](#4--void-返回类型的特殊规则)
  - [4.1. 规则 1：函数声明中的 void 很严格](#41-规则-1函数声明中的-void-很严格)
  - [4.2. 规则 2：函数类型中的 void 很宽松](#42-规则-2函数类型中的-void-很宽松)
  - [4.3. 为什么有这个差异？](#43-为什么有这个差异)
- [5. 🤔 void vs undefined](#5--void-vs-undefined)
  - [5.1. 类型差异](#51-类型差异)
  - [5.2. 实际对比](#52-实际对比)
  - [5.3. 何时使用 void vs undefined](#53-何时使用-void-vs-undefined)
- [6. 🤔 上下文类型推断中的 void](#6--上下文类型推断中的-void)
  - [6.1. 回调函数的特殊行为](#61-回调函数的特殊行为)
  - [6.2. 函数表达式 vs 函数声明](#62-函数表达式-vs-函数声明)
  - [6.3. 高阶函数中的 void](#63-高阶函数中的-void)
- [7. 🤔 实际应用场景](#7--实际应用场景)
  - [7.1. 场景 1：事件监听器](#71-场景-1事件监听器)
  - [7.2. 场景 2：数组方法](#72-场景-2数组方法)
  - [7.3. 场景 3：Promise 回调](#73-场景-3promise-回调)
  - [7.4. 场景 4：定时器回调](#74-场景-4定时器回调)
  - [7.5. 场景 5：函数式编程](#75-场景-5函数式编程)
  - [7.6. 场景 6：观察者模式](#76-场景-6观察者模式)
- [8. 🤔 常见错误和最佳实践](#8--常见错误和最佳实践)
  - [8.1. 错误 1：期望使用 void 函数的返回值](#81-错误-1期望使用-void-函数的返回值)
  - [8.2. 错误 2：混淆 void 和 undefined](#82-错误-2混淆-void-和-undefined)
  - [8.3. 错误 3：在函数声明中返回值](#83-错误-3在函数声明中返回值)
  - [8.4. 最佳实践](#84-最佳实践)
- [9. 🔗 引用](#9--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- void 类型的基本概念
- void 返回类型的特殊规则
- void 与 undefined 的区别
- 上下文类型推断中的 void
- 回调函数中的 void
- 实际应用场景

## 2. 🫧 评价

`void` 是 TypeScript 中表示**没有返回值**的特殊类型。与其他类型不同，`void` 返回类型有一些**反直觉的特殊行为**。

`void` 的特殊性体现在：

- 声明为 `void` 的函数**可以返回任何值**（但返回值会被忽略）
- 类型为 `() => void` 的变量**可以赋值给返回任何类型的函数**
- 这是为了支持常见的**回调函数模式**

理解 `void` 的特殊性，能帮助你：

1. 正确理解回调函数的类型
2. 避免类型错误
3. 编写更灵活的高阶函数
4. 理解 TypeScript 的类型系统设计

这是 TypeScript 类型系统中最容易被误解的特性之一，但也是最实用的设计。

## 3. 🤔 void 的基本概念

### 3.1. void 的定义

```ts
// void 表示函数没有返回值
function log(message: string): void {
  console.log(message)
  // 没有 return 语句，或者 return undefined
}

// ✅ 可以不写 return
function notify(): void {
  alert('Notification')
}

// ✅ 可以 return（不返回值）
function save(): void {
  // 保存数据
  return
}

// ✅ 可以 return undefined
function clear(): void {
  return undefined
}
```

### 3.2. void 的值

```ts
// void 类型的值只能是 undefined
let value: void

value = undefined // ✅
value = null // ❌ Error（strictNullChecks 下）
value = 123 // ❌ Error
```

### 3.3. void vs never

```ts
// void：函数执行完成，但没有返回值
function doSomething(): void {
  console.log('Done')
}

// never：函数永远不会执行完成（抛出错误或无限循环）
function throwError(): never {
  throw new Error('Error')
}

function infiniteLoop(): never {
  while (true) {}
}
```

## 4. 🤔 void 返回类型的特殊规则

### 4.1. 规则 1：函数声明中的 void 很严格

```ts
// ❌ 函数声明：不能返回非 undefined 的值
function strict(): void {
  return 123 // Error: Type 'number' is not assignable to type 'void'
}

// ✅ 只能返回 undefined 或不返回
function correct1(): void {
  return undefined
}

function correct2(): void {
  return // 隐式返回 undefined
}

function correct3(): void {
  // 没有 return 语句
}
```

### 4.2. 规则 2：函数类型中的 void 很宽松

```ts
// ✅ 函数类型：可以返回任何值！
type VoidFunc = () => void

// 这个函数返回 number，但可以赋值给 VoidFunc
const fn: VoidFunc = () => {
  return 123 // ✅ 不报错！
}

const result = fn()
result // 类型：void（但实际值是 123）
```

### 4.3. 为什么有这个差异？

```ts
// 场景：数组的 forEach 方法
const numbers = [1, 2, 3]

// forEach 的回调函数类型是 (value: number) => void
numbers.forEach((n) => {
  return n * 2 // ✅ 可以返回值，但会被忽略
})

// 如果不允许返回值，下面的代码就不能工作了
const doubled = numbers.map((n) => n * 2)
numbers.forEach(doubled.push.bind(doubled)) // ✅ push 返回 number，但这里需要 void
```

## 5. 🤔 void vs undefined

### 5.1. 类型差异

```ts
// void：表示不关心返回值
type VoidFunc = () => void

// undefined：必须返回 undefined
type UndefinedFunc = () => undefined

// 赋值行为不同
const voidFn: VoidFunc = () => {
  return 123 // ✅ 允许
}

const undefinedFn: UndefinedFunc = () => {
  return 123 // ❌ Error: Type 'number' is not assignable to type 'undefined'
}

// ✅ undefined 函数必须显式返回
const correctUndefined: UndefinedFunc = () => {
  return undefined
}
```

### 5.2. 实际对比

::: code-group

```ts [void 类型]
// void：不关心返回值
function forEach(callback: (item: number) => void): void {
  // callback 可以返回任何值，但会被忽略
}

// ✅ 可以传入返回 number 的函数
forEach((n) => n * 2)

// ✅ 可以传入返回 string 的函数
forEach((n) => String(n))

// ✅ 可以传入返回 boolean 的函数
forEach((n) => n > 5)
```

```ts [undefined 类型]
// undefined：必须返回 undefined
function forEach(callback: (item: number) => undefined): void {
  // callback 必须返回 undefined
}

// ❌ 不能传入返回 number 的函数
forEach((n) => n * 2) // Error

// ❌ 不能传入返回 string 的函数
forEach((n) => String(n)) // Error

// ✅ 只能传入不返回值的函数
forEach((n) => {
  console.log(n)
})
```

:::

### 5.3. 何时使用 void vs undefined

```ts
// ✅ 使用 void：回调函数，不关心返回值
type Callback = (data: any) => void

// ✅ 使用 undefined：必须显式返回 undefined
function getValue(): undefined {
  // 必须返回 undefined
  return undefined
}

// ✅ 使用 void：事件处理器
type EventHandler = (event: Event) => void

// ✅ 使用 undefined：可选的返回值
function find(predicate: (item: any) => boolean): any | undefined {
  // 可能返回 undefined
}
```

## 6. 🤔 上下文类型推断中的 void

### 6.1. 回调函数的特殊行为

```ts
// forEach 的类型签名
interface Array<T> {
  forEach(callback: (value: T, index: number, array: T[]) => void): void
}

const numbers = [1, 2, 3]

// ✅ 回调可以返回任何值
numbers.forEach((n) => {
  return n * 2 // 返回 number，但类型是 void
})

// ✅ 可以使用 map 的返回值
numbers.forEach(numbers.map((n) => n * 2).push.bind(numbers))
```

### 6.2. 函数表达式 vs 函数声明

::: code-group

```ts [函数表达式]
// ✅ 函数表达式：遵循上下文类型，可以返回值
type VoidFunc = () => void

const fn1: VoidFunc = () => {
  return 123 // ✅ 允许
}

const fn2: VoidFunc = function () {
  return 'hello' // ✅ 允许
}
```

```ts [函数声明]
// ❌ 函数声明：严格检查返回类型
function fn1(): void {
  return 123 // ❌ Error
}

function fn2(): void {
  return 'hello' // ❌ Error
}
```

:::

### 6.3. 高阶函数中的 void

```ts
// ✅ 高阶函数返回 void 函数
function createHandler(message: string): () => void {
  return () => {
    return message.length // ✅ 可以返回值
  }
}

const handler = createHandler('hello')
const result = handler()
result // 类型：void（实际值是 5）

// ⚠️ 不能使用返回值
console.log(result.toFixed(2)) // Error: Property 'toFixed' does not exist on type 'void'
```

## 7. 🤔 实际应用场景

### 7.1. 场景 1：事件监听器

```ts
// ✅ 事件监听器返回值会被忽略
type EventListener = (event: Event) => void

const button = document.querySelector('button')

// ✅ 可以返回值，但会被忽略
button?.addEventListener('click', (event) => {
  return event.target // 返回值被忽略
})

// ✅ 可以使用 preventDefault 的返回值
button?.addEventListener('click', (event) => {
  return event.preventDefault() // 返回 void
})
```

### 7.2. 场景 2：数组方法

```ts
const numbers = [1, 2, 3, 4, 5]

// ✅ forEach：回调返回 void
numbers.forEach((n) => {
  return n * 2 // 返回值被忽略
})

// ✅ 可以传入返回值的函数
const doubled: number[] = []
numbers.forEach(doubled.push.bind(doubled))

// ✅ 可以链式调用
numbers
  .filter((n) => n > 2)
  .forEach((n) => {
    return console.log(n) // console.log 返回 undefined
  })
```

### 7.3. 场景 3：Promise 回调

```ts
// ✅ Promise.then 的 onFinally 返回 void
Promise.resolve(42)
  .then((value) => {
    return value * 2 // 返回 number
  })
  .finally(() => {
    return 'cleanup' // 返回值被忽略
  })

// ✅ 错误处理器
Promise.reject(new Error('Failed')).catch((error) => {
  return console.error(error) // 返回 void
})
```

### 7.4. 场景 4：定时器回调

```ts
// ✅ setTimeout/setInterval 回调返回 void
setTimeout(() => {
  return 'done' // 返回值被忽略
}, 1000)

setInterval(() => {
  return Date.now() // 返回值被忽略
}, 1000)

// ✅ requestAnimationFrame
requestAnimationFrame(() => {
  return performance.now() // 返回值被忽略
})
```

### 7.5. 场景 5：函数式编程

```ts
// ✅ 高阶函数返回 void
function tap<T>(fn: (value: T) => void): (value: T) => T {
  return (value: T) => {
    fn(value) // 执行副作用，忽略返回值
    return value
  }
}

// 使用
const numbers = [1, 2, 3]
const result = numbers
  .map((n) => n * 2)
  .map(
    tap((n) => {
      return console.log(n) // 返回 void
    })
  )
  .filter((n) => n > 2)
```

### 7.6. 场景 6：观察者模式

```ts
// ✅ 订阅者回调返回 void
type Subscriber<T> = (value: T) => void

class Observable<T> {
  private subscribers: Subscriber<T>[] = []

  subscribe(subscriber: Subscriber<T>): () => void {
    this.subscribers.push(subscriber)

    // 返回取消订阅函数
    return () => {
      const index = this.subscribers.indexOf(subscriber)
      this.subscribers.splice(index, 1)
    }
  }

  notify(value: T): void {
    this.subscribers.forEach((subscriber) => {
      subscriber(value) // 返回值被忽略
    })
  }
}

// 使用
const observable = new Observable<number>()

observable.subscribe((value) => {
  return value * 2 // 返回值被忽略
})

observable.notify(42)
```

## 8. 🤔 常见错误和最佳实践

### 8.1. 错误 1：期望使用 void 函数的返回值

```ts
// ❌ 不能使用 void 类型的返回值
type VoidFunc = () => void

const fn: VoidFunc = () => {
  return 123
}

const result = fn()
console.log(result.toFixed(2)) // ❌ Error: Property 'toFixed' does not exist on type 'void'

// ✅ 如果需要返回值，不要使用 void
type NumberFunc = () => number

const fn2: NumberFunc = () => {
  return 123
}

const result2 = fn2()
console.log(result2.toFixed(2)) // ✅
```

### 8.2. 错误 2：混淆 void 和 undefined

```ts
// ❌ 需要 undefined 时使用了 void
function getValue(): undefined {
  // 必须显式返回 undefined
}

const value: undefined = getValue()

// ❌ 不能用 void
function getVoid(): void {}
const value2: undefined = getVoid() // ❌ Error

// ✅ 明确返回 undefined
function getValue2(): undefined {
  return undefined
}
```

### 8.3. 错误 3：在函数声明中返回值

```ts
// ❌ 函数声明：不能返回非 undefined 值
function process(): void {
  return 123 // ❌ Error
}

// ✅ 使用函数表达式
type VoidFunc = () => void
const process: VoidFunc = () => {
  return 123 // ✅ 允许
}
```

### 8.4. 最佳实践

```ts
// ✅ 1. 回调函数使用 void
type Callback = (value: any) => void

function forEach(callback: Callback): void {
  // 实现
}

// ✅ 2. 不关心返回值时使用 void
type EventListener = (event: Event) => void

// ✅ 3. 需要返回值时不要用 void
type Transform = (value: number) => number // 而不是 void

// ✅ 4. 异步函数的返回类型
async function fetchData(): Promise<void> {
  // 没有返回值的异步函数
}

// ✅ 5. 泛型函数中的 void
function tap<T>(fn: (value: T) => void): (value: T) => T {
  return (value: T) => {
    fn(value)
    return value
  }
}

// ✅ 6. 文档化 void 的用途
/**
 * 执行回调函数，忽略返回值
 * @param callback - 回调函数，返回值会被忽略
 */
function execute(callback: () => void): void {
  callback()
}

// ✅ 7. 明确函数的副作用
function logAndReturn<T>(value: T): T {
  console.log(value) // 副作用
  return value // 返回值
}

function logOnly<T>(value: T): void {
  console.log(value) // 只有副作用
}

// ✅ 8. 使用类型守卫区分
function isVoid(value: any): value is void {
  return value === undefined
}

// ✅ 9. 处理可选的返回值
type OptionalReturn = () => number | void

const fn: OptionalReturn = () => {
  if (Math.random() > 0.5) {
    return 123
  }
  // 隐式返回 undefined (void)
}

// ✅ 10. 函数类型别名
type SideEffect = () => void // 只有副作用
type Computation<T> = () => T // 有返回值
type OptionalComputation<T> = () => T | void // 可能有返回值
```

## 9. 🔗 引用

- [TypeScript Handbook - Functions][1]
- [TypeScript Handbook - void][2]
- [TypeScript Deep Dive - void][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/functions.html
[2]: https://www.typescriptlang.org/docs/handbook/2/functions.html#void
[3]: https://basarat.gitbook.io/typescript/type-system/never#void
