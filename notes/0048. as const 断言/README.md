# [0048. as const 断言](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0048.%20as%20const%20%E6%96%AD%E8%A8%80)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 const 断言（`as const`）有什么用？](#3--const-断言as-const有什么用)
- [4. 🤔 `as const` 断言如何配合字面量类型使用？](#4--as-const-断言如何配合字面量类型使用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- as const

## 2. 🫧 评价

- `as const` 断言可以让 TS 宽泛的推导结果更加具体，可以配合字面量类型一起使用。

<!--

🎯 类型泛化

可以考虑在【类型系统】中新建一篇笔记，或者直接写入到 as const 这篇笔记中。

// math.ts
export const PI = 3.14159 // 不会泛化，就是精确的字面量类型 const PI: 3.14159
export function add(a: number, b: number) {
  return a + b
}
export const a = 1 + 1 // 表达式会被泛化
export let b = 3.14159 // let 会被泛化
export const obj = {
  a: 1,
  b: 2,
} // 对象字面量的属性会被泛化
// const obj: {
//     a: number;
//     b: number;
// }
export const obj2 = {
  a: 1,
  b: 2,
} as const // 使用 as const 不会被泛化
// const obj2: {
//     readonly a: 1;
//     readonly b: 2;
// }

 -->

## 3. 🤔 const 断言（`as const`）有什么用？

`as const` 的作用：可以让 TS 「宽泛」 的类型推导结果更「准确」

- 将数组推断为 readonly 元组
- 将对象属性推断为 只读字面量类型
- 将字符串/数字推断为 字面量类型而非 string/number

```ts
const a = [1, 2, 3]
// 推断结果
// const a: number[]

const b = [1, 2, 3] as const
// 推断结果
// const b: readonly [1, 2, 3]

const c = {
  timeout: 5000,
  retry: true,
  mode: 'strict',
}

// 推断结果
// const c: {
//     timeout: number;
//     retry: boolean;
//     mode: string;
// }

const d = {
  timeout: 5000,
  retry: true,
  mode: 'strict',
} as const

// 推断结果
// const d: {
//     readonly timeout: 5000;
//     readonly retry: true;
//     readonly mode: "strict";
// }
```

## 4. 🤔 `as const` 断言如何配合字面量类型使用？

这俩配合使用，通常是为了解决 TS 默认推断行为得到的结果过于宽泛的问题。

::: code-group

```ts [问题背景]
// TS 的默认推导结果过于宽泛
const directions = ['north', 'south', 'east', 'west']
// TypeScript 推断为: string[]
// 而非 readonly ["north", "south", "east", "west"] 元组类型
// 因此下面的调用会报错

function go(dir: "north" | "south" | "east" | "west") { ... }
go(directions[0]); // ❌ 类型 string 不能赋值给字面量联合类型
// Argument of type 'string' is not assignable to parameter of type '"north" | "south" | "east" | "west"'.(2345)
```

```ts [解决方案]
// 使用 as const
const directions = ["north", "south", "east", "west"] as const;
// 推断为 readonly ["north", "south", "east", "west"]

type Direction = typeof directions[number]; // "north" | "south" | "east" | "west"

function go(dir: Direction) { ... }
go(directions[0]); // ✅ 安全！
```

:::
