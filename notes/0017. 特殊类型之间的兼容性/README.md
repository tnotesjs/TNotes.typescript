# [0017. 特殊类型之间的兼容性](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0017.%20%E7%89%B9%E6%AE%8A%E7%B1%BB%E5%9E%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%85%BC%E5%AE%B9%E6%80%A7)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 官方文档 - any, unknown, object, void, undefined, null, and never assignability](#3-官方文档---any-unknown-object-void-undefined-null-and-never-assignability)
- [4. 引用](#4-引用)

<!-- endregion:toc -->

## 1. 本节内容

- any、unknown、object、void、undefined、null 和 never 的可赋值性

## 2. 评价

本节记录的是 TS 中的 any、unknown、object、void、undefined、null 和 never 的可赋值性，引用了官方文档中的一张表格，清晰地展示了这些特殊类型之间的可赋值性，如果有不清楚的，就多来看看这张表。

## 3. 官方文档 - any, unknown, object, void, undefined, null, and never assignability

|             | any | unknown | object | void | undefined | null | never |
| ----------- | --- | ------- | ------ | ---- | --------- | ---- | ----- |
| any →       |     | ✓       | ✓      | ✓    | ✓         | ✓    | ✕     |
| unknown →   | ✓   |         | ✕      | ✕    | ✕         | ✕    | ✕     |
| object →    | ✓   | ✓       |        | ✕    | ✕         | ✕    | ✕     |
| void →      | ✓   | ✓       | ✕      |      | ✕         | ✕    | ✕     |
| undefined → | ✓   | ✓       | ✅     | ✓    |           | ✅   | ✕     |
| null →      | ✓   | ✓       | ✅     | ✅   | ✅        |      | ✕     |
| never →     | ✓   | ✓       | ✓      | ✓    | ✓         | ✓    |       |

- "✅" 表示当 strictNullChecks 关闭时，两种类型之间是兼容的。
- 行，主动，表示该类型可以赋值给哪些类型
- 列，被动，表示该类型可以被哪些类型赋值
- 表格中的 object 类型代表所有非原始类型的类型，即数组、对象与函数类型
- 每个类型都可以赋值给其本身

## 4. 引用

- [any, unknown, object, void, undefined, null, and never assignability][1]

[1]: https://www.typescriptlang.org/docs/handbook/type-compatibility.html#any-unknown-object-void-undefined-null-and-never-assignability
