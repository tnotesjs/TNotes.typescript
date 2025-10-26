# [0069. 函数类型的兼容性规则](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0069.%20%E5%87%BD%E6%95%B0%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%85%BC%E5%AE%B9%E6%80%A7%E8%A7%84%E5%88%99)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 函数类型的兼容性规则是什么？](#3--函数类型的兼容性规则是什么)
  - [3.1. 基本规则](#31-基本规则)
  - [3.2. 示例：参数逆变](#32-示例参数逆变)
  - [3.3. 示例：返回值协变](#33-示例返回值协变)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- “逆变”（Contravariance）
- “协变”（Covariance）

## 2. 🫧 评价

- todo

## 3. 🤔 函数类型的兼容性规则是什么？

函数兼容性遵循“逆变”（Contravariance）和“协变”（Covariance）规则。

### 3.1. 基本规则

- 参数类型：逆变 → 源函数的参数类型可以比目标函数更宽泛
- 返回类型：协变 → 源函数的返回类型可以比目标函数更具体

### 3.2. 示例：参数逆变

```ts
type Handler = (event: MouseEvent) => void

const handleClick: Handler = (event: Event) => {
  // event 是 Event（比 MouseEvent 更宽泛）
  console.log(event.timeStamp)
}

// ✅ 兼容！因为 MouseEvent 是 Event 的子类型，
// 传入 MouseEvent 时，Event 类型的参数能安全处理它
```

### 3.3. 示例：返回值协变

```ts
type Factory = () => HTMLElement

const createDiv: Factory = () => {
  return document.createElement('div') // HTMLDivElement
}

// ✅ 兼容！HTMLDivElement 是 HTMLElement 的子类型
```
