# [0069. 函数类型的兼容性规则](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0069.%20%E5%87%BD%E6%95%B0%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%85%BC%E5%AE%B9%E6%80%A7%E8%A7%84%E5%88%99)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 函数类型的兼容性规则是什么？](#3--函数类型的兼容性规则是什么)
  - [3.1. 基本规则](#31-基本规则)
  - [3.2. 理解“源函数”和“目标函数”](#32-理解源函数和目标函数)
- [4. 🤔 参数类型的约束规则是？](#4--参数类型的约束规则是)
- [5. 🤔 参数数量的约束规则是？](#5--参数数量的约束规则是)
- [6. 🤔 剩余参数的检查规则是？](#6--剩余参数的检查规则是)
- [7. 🤔 返回值类型的约束规则是？](#7--返回值类型的约束规则是)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- “逆变”（Contravariance）
- “协变”（Covariance）

## 2. 🫧 评价

- “逆变”（Contravariance）
  - 参数类型的约束规则
  - 源函数的参数可以比目标函数更宽泛
  - 约束少的可以传递给约束多的
- - “协变”（Covariance）
  - 返回类型的约束规则
  - 源函数的返回可以比目标函数更具体
  - 约束多的可以传递给约束少的

## 3. 🤔 函数类型的兼容性规则是什么？

函数兼容性遵循“逆变”（Contravariance）和“协变”（Covariance）规则。

### 3.1. 基本规则

- 参数类型：逆变 → 源函数的参数可以比目标函数更宽泛
- 返回类型：协变 → 源函数的返回可以比目标函数更具体

基于上述基本规则，能衍生出很多场景，以参数类型的逆变约束为例：

- 参数数量多的约束强，参数数量少的约束弱，因此可以将参数数量少的函数传递给参数数量多的函数，反之不行；
- 参数类型更具体的约束强，参数类型更宽泛的约束弱，因此可以将参数类型更宽泛的函数传递给参数类型更具体的函数，反之不行；

### 3.2. 理解“源函数”和“目标函数”

- 源函数表示我们传入的函数；
- 目标函数表示被赋值的函数；

如果用赋值运算符来表示，它们之间的关系如下：

```ts
目标函数 = 源函数
```

## 4. 🤔 参数类型的约束规则是？

- 参数更宽泛的可以赋值给参数更具体的；
- 参数更具体的不能赋值给参数更宽泛的；

```ts
type MouseEventHandler = (event: MouseEvent) => void
type EventHandler = (event: Event) => void

let f1: MouseEventHandler = (event: MouseEvent) => {}
let f2: EventHandler = (event: Event) => {}

f1 = f2 // ✅ 兼容，Event 比 MouseEvent 更宽泛
// f2 = f1 // ❌ 不兼容
// 报错信息如下：
// Type 'MouseEventHandler' is not assignable to type 'EventHandler'.
//   Types of parameters 'event' and 'event' are incompatible.
//     Type 'Event' is missing the following properties from type 'MouseEvent': altKey, button, buttons, clientX, and 23 more.(2322)
```

## 5. 🤔 参数数量的约束规则是？

- 参数少的可以赋值给参数多的
- 参数多的不能赋值给参数少的

```ts
type Func1 = (a: string) => void
type Func2 = (a: string, b: number) => void

let f1: Func1 = (a: string) => {}
let f2: Func2 = (a: string, b: number) => {}

f2 = f1 // ✅ 兼容 - 参数少的可以赋值给参数多的
// f1 = f2  // ❌ 不兼容 - 参数多的不能赋值给参数少的
// 报错信息：
// Type 'Func2' is not assignable to type 'Func1'.
//   Target signature provides too few arguments. Expected 2 or more, but got 1.(2322)
```

## 6. 🤔 剩余参数的检查规则是？

剩余参数无论是赋值还是被赋值都不会检查

- 剩余参数函数可以安全地赋值给固定参数函数
- 固定参数函数也可以安全地赋值给剩余参数函数

```ts
type FuncWithOptional = (a: string, b?: number) => void
type FuncWithRest = (...args: any[]) => void
type FuncRequired = (a: string, b: number) => void

let optional: FuncWithOptional = (a: string, b?: number) => {}
let rest: FuncWithRest = (...args: any[]) => {}
let required: FuncRequired = (a: string, b: number) => {}

rest = optional // ✅ 兼容
rest = required // ✅ 兼容
optional = rest // ✅ 兼容
required = rest // ✅ 兼容
```

## 7. 🤔 返回值类型的约束规则是？

```ts
// 返回值协变
type Factory = () => HTMLElement

const createDiv: Factory = () => {
  return document.createElement('div') // HTMLDivElement
}

// ✅ 兼容！HTMLDivElement 是 HTMLElement 的子类型
```
