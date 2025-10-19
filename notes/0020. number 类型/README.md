# [0020. number 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0020.%20number%20%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 number 类型是什么？](#3--number-类型是什么)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- number

## 2. 🫧 评价

- number 类型很简单也很常用

## 3. 🤔 number 类型是什么？

- 在 TypeScript 中，number 是一种基本数据类型，用于表示数字，包含所有整数和浮点数。
- 我们可以对 number 类型的变量进行各种数学运算，如加法、减法、乘法和除法等。
- TypeScript 中的 number 类型还支持特殊的数字值，如 Infinity、-Infinity 和 NaN（Not a Number）。

```ts
let age: number = 25

// --------------------

const x1: number = 123
const y1: number = 3.14
const z1: number = 0xffff

// --------------------

let x2: number = 10
let y2: number = 20
let sum: number = x2 + y2

// --------------------

const x3: number = Infinity
const y3: number = -Infinity
const z3: number = NaN
```
