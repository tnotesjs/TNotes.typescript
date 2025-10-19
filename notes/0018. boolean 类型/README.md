# [0018. boolean 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0018.%20boolean%20%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 boolean 类型是什么？](#3--boolean-类型是什么)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- boolean

## 2. 🫧 评价

- boolean 类型很简单也很常用

## 3. 🤔 boolean 类型是什么？

在 TypeScript 中，boolean 是基本数据类型之一，用于表示逻辑值：真 (true) 或假 (false)。boolean 类型是 TypeScript 和 JavaScript 中用于控制逻辑流程的关键数据类型，如条件语句、循环控制等。

以下是一些基本的 boolean 类型使用示例：

```ts
// 声明一个 boolean 类型的变量：
let isDone: boolean = false

// 在条件语句中使用 boolean 类型：
if (isDone) {
  console.log('The task is done.')
} else {
  console.log('The task is not done yet.')
}
```

在 TypeScript 中，在不考虑类型污染的情况下，boolean 类型的值只能是 true 或 false，不能是其他任何值，包括 truthy 或 falsy 值。

```ts
const x: boolean = true // ok
const y: boolean = false // ok
// 变量 x 和 y 就属于 boolean 类型

// any 类型可能会污染 boolean 类型实际的值
const anyVal: any = 123
const x: boolean = anyVal // ok
```

在 JavaScript 中，许多值可以隐式转换为 boolean 类型，例如在条件语句中，但在 TypeScript 中，当你的变量被显式声明为 boolean 类型时，你必须使用 true 或 false 赋值。

```ts
let x: boolean = true // ✅
let y: boolean = 1 // ❌ Type 'number' is not assignable to type 'boolean'.(2322)

// 虽然 1 可以隐式转换为 boolean，并且被判定为 truthy 真值
// 但像上面这样显式声明的写法故意附非 true 或 false 的值，TypeScript 会报错
```

如果你需要将一个非布尔值转换为布尔类型，你可以使用 Boolean 函数或者双重否定运算符 `!!`：

```ts
let n: number = 0
let x1: boolean = Boolean(n) // 转换为 false
let x2: boolean = !!n // 同样转换为 false
```
