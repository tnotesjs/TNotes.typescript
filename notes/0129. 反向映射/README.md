# [0129. 反向映射](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0129.%20%E5%8F%8D%E5%90%91%E6%98%A0%E5%B0%84)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 反向映射是什么？](#3--反向映射是什么)
- [4. 🤔 反向映射的工作原理是什么？](#4--反向映射的工作原理是什么)
- [5. 🤔 不同类型的枚举的反向映射支持情况如何？](#5--不同类型的枚举的反向映射支持情况如何)
- [6. 🔗 引用](#6--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 反向映射

## 2. 🫧 评价

反向映射（Reverse Mapping）是 TS 中数字枚举独有的特性，允许通过枚举值获取枚举名称。

## 3. 🤔 反向映射是什么？

反向映射是指数字枚举自动创建从值到名称的映射，使得可以通过枚举值反向获取枚举成员的名称。

- 双向映射：名称 ↔ 值双向查找，既可以名称 → 值，也可以值 → 名称
- 仅数字枚举：只有数字枚举支持
- 自动生成：编译器自动创建反向映射
- 运行时对象：编译为包含双向映射的对象

```ts
// 数字枚举的反向映射：
enum Status {
  Active, // 0
  Inactive, // 1
  Pending, // 2
}

// 正向映射：名称 -> 值
console.log(Status.Active) // 0
console.log(Status.Inactive) // 1
console.log(Status.Pending) // 2

// 反向映射：值 -> 名称
console.log(Status[0]) // 'Active'
console.log(Status[1]) // 'Inactive'
console.log(Status[2]) // 'Pending'
```

## 4. 🤔 反向映射的工作原理是什么？

TS 源码：

```ts
enum Direction {
  Up,
  Down,
  Left,
  Right,
}
```

编译后的 JS：

```js
'use strict'
var Direction
;(function (Direction) {
  Direction[(Direction['Up'] = 0)] = 'Up'
  Direction[(Direction['Down'] = 1)] = 'Down'
  Direction[(Direction['Left'] = 2)] = 'Left'
  Direction[(Direction['Right'] = 3)] = 'Right'
})(Direction || (Direction = {}))
```

等价于：

```js
const Direction = {
  Up: 0,
  Down: 1,
  Left: 2,
  Right: 3,
  0: 'Up',
  1: 'Down',
  2: 'Left',
  3: 'Right',
}
```

## 5. 🤔 不同类型的枚举的反向映射支持情况如何？

| 枚举类型       | 支持情况                              |
| -------------- | ------------------------------------- |
| `1` 数字枚举   | ✅ 支持                               |
| `2` 字符串枚举 | ❌ 不支持                             |
| `3` 常量枚举   | ❌ 不支持                             |
| `4` 异构枚举   | ⚠️ 部分支持（只有数字成员有反向映射） |

::: code-group

```ts [1]
// 数字枚举的反向映射：
enum Status {
  Active, // 0
  Inactive, // 1
  Pending, // 2
}

// 正向映射：名称 -> 值
console.log(Status.Active) // 0
console.log(Status.Inactive) // 1
console.log(Status.Pending) // 2

// 反向映射：值 -> 名称
console.log(Status[0]) // 'Active'
console.log(Status[1]) // 'Inactive'
console.log(Status[2]) // 'Pending'
```

```ts [2]
// ❌ 字符串枚举没有反向映射
enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

console.log(Status.Active) // 'ACTIVE' ✅
console.log(Status['ACTIVE']) // undefined ❌

// 编译结果（只有单向映射）
var Status
;(function (Status) {
  Status['Active'] = 'ACTIVE'
  Status['Inactive'] = 'INACTIVE'
})(Status || (Status = {}))

// 等价于
const Status = {
  Active: 'ACTIVE',
  Inactive: 'INACTIVE',
  // 没有 'ACTIVE': 'Active'
}
```

```ts [3]
// ❌ 常量枚举没有反向映射（因为没有运行时对象）
const enum Direction {
  Up,
  Down,
}

const dir = Direction.Up // 编译为: const dir = 0
// console.log(Direction[0])  // Error: 常量枚举没有运行时对象
```

```ts [4]
// ⚠️ 异构枚举只有数字成员有反向映射
enum Mixed {
  NumA = 1,
  NumB = 2,
  StrA = 'STRING_A',
  StrB = 'STRING_B',
}

// 数字成员的反向映射 ✅
console.log(Mixed[1]) // 'NumA'
console.log(Mixed[2]) // 'NumB'

// 字符串成员没有反向映射 ❌
console.log(Mixed['STRING_A']) // undefined
console.log(Mixed['STRING_B']) // undefined

// 编译结果
var Mixed
;(function (Mixed) {
  Mixed[(Mixed['NumA'] = 1)] = 'NumA'
  Mixed[(Mixed['NumB'] = 2)] = 'NumB'
  Mixed['StrA'] = 'STRING_A'
  Mixed['StrB'] = 'STRING_B'
})(Mixed || (Mixed = {}))
```

:::

## 6. 🔗 引用

- [TypeScript Handbook - Enums][1]
- [TypeScript Deep Dive - Reverse Mapping][2]
- [TypeScript Handbook - Enums at Runtime][3]

[1]: https://www.typescriptlang.org/docs/handbook/enums.html
[2]: https://basarat.gitbook.io/typescript/type-system/enums#enums-are-open-ended
[3]: https://www.typescriptlang.org/docs/handbook/enums.html#reverse-mappings
