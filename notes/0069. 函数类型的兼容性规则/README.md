# [0069. 函数类型的兼容性规则](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0069.%20%E5%87%BD%E6%95%B0%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%85%BC%E5%AE%B9%E6%80%A7%E8%A7%84%E5%88%99)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 函数类型的兼容性规则是什么？](#3--函数类型的兼容性规则是什么)
  - [3.1. 基本规则](#31-基本规则)
  - [3.2. 理解“源函数”和“目标函数”](#32-理解源函数和目标函数)
- [4. 🤔 参数的兼容性规则是？](#4--参数的兼容性规则是)
  - [4.1. 参数类型](#41-参数类型)
  - [4.2. 参数数量](#42-参数数量)
  - [4.3. 剩余参数](#43-剩余参数)
  - [4.4. 可选参数](#44-可选参数)
- [5. 🤔 返回值类型的约束规则是？](#5--返回值类型的约束规则是)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- “逆变”（Contravariance）
- “协变”（Covariance）

## 2. 🫧 评价

- “逆变”（Contravariance）
  - 参数类型的约束规则
  - 源函数的参数可以比目标函数更宽泛
  - 约束少的可以传递给约束多的
- “协变”（Covariance）
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

## 4. 🤔 参数的兼容性规则是？

### 4.1. 参数类型

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

### 4.2. 参数数量

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

### 4.3. 剩余参数

剩余参数 `...args: any[]` 无论是赋值还是被赋值都不会检查。

- 剩余参数函数可以安全地赋值给固定参数函数；
- 固定参数函数也可以安全地赋值给剩余参数函数；

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

如果类型不匹配，会报错。

```ts
type FuncWithOptional = (a: string, b?: number) => void
type FuncWithRest = (...args: string[]) => void
type FuncRequired = (a: string, b: number) => void

let optional: FuncWithOptional = (a: string, b?: number) => {}
let rest: FuncWithRest = (...args: string[]) => {}
let required: FuncRequired = (a: string, b: number) => {}

rest = optional // ❌ 不兼容
rest = required // ❌ 不兼容
optional = rest // ❌ 不兼容
required = rest // ❌ 不兼容
```

### 4.4. 可选参数

类型不兼容就不用考虑了，如果类型不兼容会直接报错，下面我们来看同类型的情况。

先说答案：

- 约束少的可以赋值给约束多的 -> 可选的可以赋给必填的
- 约束多的不能赋值给约束少的 -> 必填的不能赋给可选的

那么如何判断可选属性和必填属性的约束谁多谁少呢？

可选参数可以视作 `| undefined` 类型，比如 `b?: string` 类型是 `b: string | undefined`。

- 可选属性 - `string | undefined` - 约束少 - 可以是字符串也可以是空
- 必填属性 - `string` - 约束多 - 只能是字符串

示例：

```ts
type FuncWithOptional = (a: string, b?: string) => void
type FuncWithRest = (...args: string[]) => void
type FuncRequired = (a: string, b: string) => void

let optional: FuncWithOptional = (a: string, b?: string) => {}
let rest: FuncWithRest = (...args: string[]) => {}
let required: FuncRequired = (a: string, b: string) => {}

optional = rest // ❌ 不兼容 - string 不能赋值给 string | undefined
optional = required // ❌ 不兼容 - string 不能赋值给 string | undefined
rest = optional // ✅ 兼容 - string | undefined 可以赋值给 string
required = optional // ✅ 兼容 - string | undefined 可以赋值给 string
```

## 5. 🤔 返回值类型的约束规则是？

```ts
// 返回值协变
type Factory = () => HTMLElement

const createDiv: Factory = () => {
  return document.createElement('div') // HTMLDivElement
}

// ✅ 兼容！HTMLDivElement 是 HTMLElement 的子类型
```
