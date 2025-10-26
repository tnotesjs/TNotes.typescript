# [0069. 函数类型的兼容性规则](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0069.%20%E5%87%BD%E6%95%B0%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%85%BC%E5%AE%B9%E6%80%A7%E8%A7%84%E5%88%99)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 函数类型的兼容性规则是什么？](#3--函数类型的兼容性规则是什么)
  - [3.1. 示例：参数逆变](#31-示例参数逆变)
  - [3.2. 示例：返回值协变](#32-示例返回值协变)
- [4. 🤔 “参数逆变（Contravariance）规则” 是什么？](#4--参数逆变contravariance规则-是什么)
  - [4.1. 参数数量的检查](#41-参数数量的检查)
  - [4.2. 剩余参数的检查](#42-剩余参数的检查)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- “逆变”（Contravariance）
- “协变”（Covariance）

## 2. 🫧 评价

- todo

## 3. 🤔 函数类型的兼容性规则是什么？

函数兼容性遵循“逆变”（Contravariance）和“协变”（Covariance）规则。

基本规则如下：

- 参数类型：逆变 → 源函数的参数类型可以比目标函数更宽泛
- 返回类型：协变 → 源函数的返回类型可以比目标函数更具体

### 3.1. 示例：参数逆变

```ts
type Handler = (event: MouseEvent) => void

const handleClick: Handler = (event: Event) => {
  // event 是 Event（比 MouseEvent 更宽泛）
  console.log(event.timeStamp)
}

// ✅ 兼容！因为 MouseEvent 是 Event 的子类型，
// 传入 MouseEvent 时，Event 类型的参数能安全处理它
```

### 3.2. 示例：返回值协变

```ts
type Factory = () => HTMLElement

const createDiv: Factory = () => {
  return document.createElement('div') // HTMLDivElement
}

// ✅ 兼容！HTMLDivElement 是 HTMLElement 的子类型
```

## 4. 🤔 “参数逆变（Contravariance）规则” 是什么？

参数逆变（Contravariance）规则指的是：源函数的参数类型可以比目标函数更宽泛。

### 4.1. 参数数量的检查

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

### 4.2. 剩余参数的检查

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
