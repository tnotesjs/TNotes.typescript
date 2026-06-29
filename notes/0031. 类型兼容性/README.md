# [0031. 类型兼容性](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0031.%20%E7%B1%BB%E5%9E%8B%E5%85%BC%E5%AE%B9%E6%80%A7)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 什么是 TypeScript 中的类型兼容性？](#3-什么是-typescript-中的类型兼容性)
- [4. 引用](#4-引用)

<!-- endregion:toc -->

## 1. 本节内容

- Type Compatibility
- Structural Type System
- 特殊类型之间的兼容性

## 2. 评价

这章内容特别重要，它决定了「一个类型 A」是否可以赋值给「另一个类型 B」的判断标准。

记住一句话：TypeScript 的类型兼容性只管“你有没有我需要的东西”，不“你叫什么名字”。

特殊类型的可赋值性：

- TS 中类型众多，特别是涉及到这些“边缘”类型（any、unknown 和 never）时，经常会搞混它们的赋值关系。
- 比如，什么类型可以赋值给它们？它们又能赋值给什么类型？
- 如果对此有疑问，可以参考「特殊类型的可赋值性」这篇笔记。

本章内容速览：

<N :ids="[
  '0067',
  '0072',
  '0068',
  '0069',
  '0071',
  '0070',
  '0017',
  '0080',
  '0081'
]" />

## 3. 什么是 TypeScript 中的类型兼容性？

类型的兼容性（Type Compatibility）是 TypeScript 类型系统的核心机制之一。它决定了"一个类型是否可以赋值给另一个类型"，直接影响代码能否通过编译。理解这一机制至关重要，它能帮助你写出更灵活、更安全的代码，并避免常见的类型错误。

## 4. 引用

- [Type Compatibility - 类型兼容性][3]
  - [any, unknown, object, void, undefined, null, and never assignability][1]
- [Structural Type System - 结构化类型系统][2]

[1]: https://www.typescriptlang.org/docs/handbook/type-compatibility.html#any-unknown-object-void-undefined-null-and-never-assignability
[2]: https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html#structural-type-system
[3]: https://www.typescriptlang.org/docs/handbook/type-compatibility.html
