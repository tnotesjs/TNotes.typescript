# [0021. bigint 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0021.%20bigint%20%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 bigint 类型是什么？](#3--bigint-类型是什么)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- bigint

## 2. 🫧 评价

- bigint 类型了解即可，不常用。
- 虽然 bigint 也是数字，但是 bigint 与 number 类型是不兼容的。

## 3. 🤔 bigint 类型是什么？

- bigint 类型包含所有的大整数。
- bigint 类型是 ES2020 标准引入的。如果使用这个类型，TypeScript 编译的目标 JavaScript 版本不能低于 ES2020（即编译参数 target 不低于 es2020）。
- bigint 与 number 类型不兼容。

```ts
const x: bigint = 123n
const y: bigint = 0xffffn
// 注意：若 target 低于 ES2020，那么会抛出错误。
// 报错：BigInt literals are not available when targeting lower than ES2020.(2737)

// ------------------------

// bigint 与 number 类型不兼容
const x2: bigint = 123 // ❌
const y2: bigint = 3.14 // ❌
// 报错：Type 'number' is not assignable to type 'bigint'.(2322)

const x3: number = 123 // ✅
const y3: number = 3.14 // ✅
```
