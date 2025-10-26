# [0065. 类的类型兼容性](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0065.%20%E7%B1%BB%E7%9A%84%E7%B1%BB%E5%9E%8B%E5%85%BC%E5%AE%B9%E6%80%A7)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 如何判断 Class 的类型兼容性？](#3--如何判断-class-的类型兼容性)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 结构子类型（鸭子类型）

## 2. 🫧 评价

- todo

## 3. 🤔 如何判断 Class 的类型兼容性？

- Class 也遵循"结构类型原则"。（详细说明见笔记 `0031. 类型的兼容`）

```ts
class Foo {
  id!: number
}

function fn(arg: Foo) {
  // ...
}

const bar = {
  id: 10,
  amount: 100,
}

// 一个对象只要满足 Class 的实例结构，就跟该 Class 属于同一个类型：
fn(bar) // ✅ 正确
```
