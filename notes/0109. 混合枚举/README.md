# [0109. 混合枚举](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0109.%20%E6%B7%B7%E5%90%88%E6%9E%9A%E4%B8%BE)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 混合枚举是什么？](#3--混合枚举是什么)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 混合枚举

## 2. 🫧 评价

虽然数字和字符串枚举成员可以混合使用，但是并不推荐这么做。

若要使用混合枚举的写法，需要注意未初始化的枚举成员最近的之前成员不能是字符串枚举。

## 3. 🤔 混合枚举是什么？

混合枚举是指同时包含数字枚举和字符串枚举成员的枚举类型。

```ts
// 可以混合使用（不推荐）
enum Mixed {
  No = 0,
  Yes = 'YES',
}

console.log(Mixed.No) // 0
console.log(Mixed.Yes) // 'YES'
```

可能的使用场景：兼容旧代码

```ts
enum Status {
  Unknown = 0, // 数字保持兼容
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}
```

混合枚举的限制：如果成员没有设置初始值，那么该成员之前的最近成员不能是字符串枚举成员。

```ts
// 错误的混合方式：
enum Problem {
  A = 'A',
  B, // ❌ Error: 字符串后的成员必须初始化
  C = 1,
  D, // 2 - 数字后可以自动递增
}
// 报错信息:
// Enum member must have initializer.(1061)

// 正确的混合方式：
enum Correct {
  None = 0,
  First = 'FIRST',
  Second = 'SECOND',
  Third = 3,
  Fourth, // 4
}
```
