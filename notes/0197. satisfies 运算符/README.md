# [0197. satisfies 运算符](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0197.%20satisfies%20%E8%BF%90%E7%AE%97%E7%AC%A6)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. `satisfies` 运算符是什么？](#3-satisfies-运算符是什么)
- [4. `satisfies` vs. `类型注解`](#4-satisfies-vs-类型注解)
- [5. `satisfies` vs `as 断言`](#5-satisfies-vs-as-断言)
- [6. 引用](#6-引用)

<!-- endregion:toc -->

## 1. 本节内容

- `satisfies` 运算符的基本概念和语法
- `satisfies` 与类型注解的区别
- `satisfies` 与 `as 断言` 的区别

## 2. 评价

在 TS 4.9 中引入的 `satisfies` 运算符，这是一个在类型安全和类型推断之间取得平衡的重要特性。

## 3. `satisfies` 运算符是什么？

`satisfies` 这个单词的中文含义是“满足”，它是 TS 在 v4.9 中新增的运算符，用于验证表达式是否符合某个类型，同时保持原有的类型推断。

`satisfies` 解决了类型注解导致类型推断的信息丢失的问题。

```ts
// 语法：expression satisfies Type

const value = { x: 10, y: 20 } satisfies { x: number; y: number }
// value 的类型被推断为 { x: number; y: number }

const point = { x: 10, y: 20 } satisfies Record<string, number>
// point 的类型被推断为 { x: number; y: number }

// 基本示例：
type Color = 'red' | 'green' | 'blue'

const color = 'red' satisfies Color // ✅ 通过验证
// color 的类型是 'red'，不是 Color

const invalid = 'yellow' satisfies Color // ❌ 错误：'yellow' 不满足 Color

// 引入背景：在 satisfies 出现之前，我们面临两难选择：
// 问题 1：类型注解会丢失精确类型
type Colors = 'red' | 'green' | 'blue'
const palette: Record<Colors, string> = {
  red: '#ff0000',
  green: '#00ff00',
  blue: '#0000ff',
} as const
const red = palette.red // string（丢失了字面量类型）
/*
原因分析：
【1】类型推断 - 当我们使用 as const 的时候，palette 的类型推断结果如下： 
const palette = {
    red: '#ff0000',
    green: '#00ff00',
    blue: '#0000ff',
};
【2】类型注解 - 当我们使用 Record<Colors, string> 类型注解的时候，palette 的类型被声明为： 
const palette = {
    red: string,
    green: string,
    blue: string,
};
这时候我们很可能更想要的结果是【1】，因为它更加精确
但是实际上【2】会胜出，最终访问 palette.red 得到的类型是 string 而非 '#ff0000'
 */

// 问题 2：不加注解，保留类型推断的结果，又会导致类型注解的校验机制丢失
const palette2 = {
  red123: '#ff0000', // ⚠️ 错误的 red123 键，但没有错误提示
  green: 123, // ⚠️ 错误的 123 值类型，但没有错误提示
  // ⚠️ 缺少 blue，但没有错误提示
} as const

// satisfies 解决了上述遇到的问题
// 它只验证表达式是否符合某个类型，不会改变类型推断的结果

const palette3 = {
  red: '#ff0000',
  green: '#00ff00',
  blue: '#0000ff',
} as const satisfies Record<Colors, string>

const red3 = palette3.red // '#ff0000'（保留字面量类型）
// palette3.red = 123 // ❌ Error 只读约束也会保留
/* 
流程分析：

第一部分：
const palette3 = {
  red: '#ff0000',
  green: '#00ff00',
  blue: '#0000ff',
} as const

得到的类型推断的结果是：
const palette3: {
    readonly red: "#ff0000";
    readonly green: "#00ff00";
    readonly blue: "#0000ff";
}

第二部分：xxx satisfies Record<Colors, string>
表示：xxx（也就是类型推断结果）满足 Record<Colors, string> 类型
Record<Colors, string> 类型是：
{
    red: string;
    green: string;
    blue: string;
}
最终结果显然是满足的
 */

// 缺少属性会报错
const palette4 = {
  red: '#ff0000',
  green: '#00ff00',
  // ❌ 错误：缺少 'blue' 属性
} satisfies Record<Colors, string>
// Type '{ red: string; green: string; }' does not satisfy the expected type 'Record<Colors, string>'.
//   Property 'blue' is missing in type '{ red: string; green: string; }' but required in type 'Record<Colors, string>'.(1360)
```

## 4. `satisfies` vs. `类型注解`

1. 类型注解的问题 -> 类型注解会将变量的类型固定为注解的类型，丢失更精确的信息
2. satisfies 的优势 -> satisfies 保留了推断的精确类型，同时确保类型安全

::: code-group

```ts [1]
type RGB = [red: number, green: number, blue: number]

// 使用类型注解
const color1: RGB = [255, 0, 0] as const
// color1 的类型：RGB（即 [number, number, number]）

// 不是用类型注解，让 TS 自行推断类型
const color2 = [255, 0, 0] as const
// const color2: readonly [255, 0, 0]
// 这个推断结果得到的类型显然是比类型注解的更加精确的

const x1 = color1[0] // number - 更宽泛
const x2 = color2[0] // 255 - 更精确
```

```ts [2]
type RGB = [red: number, green: number, blue: number]

// 1. 保留了推断的精确类型
const color1 = [255, 0, 0] as const satisfies RGB
// color 的类型：[255, 0, 0]（精确的元组字面量类型）

const x = color1[0] // 255

// 2. 同时确保类型安全
const color2 = ['255', 0, 0] as const satisfies RGB // ❌ Error
// Type 'string' is not assignable to type 'number'.(2322)
```

:::

## 5. `satisfies` vs `as 断言`

1. `satisfies` 不改变变量的类型，只验证变量是否满足类型
2. `as 断言` 改变变量的类型

```ts
// as 断言：强制类型转换（不安全）
const value1 = 'hello' as unknown as number // ⚠️ 不安全，但编译通过
// const value1: number

// satisfies：类型验证（安全）
const value2 = 'hello' satisfies number // ❌ 错误：string 不满足 number
// const value2: "hello"
```

## 6. 引用

- [TypeScript 4.9 Release Notes - The satisfies Operator][1]
- [TypeScript PR #46827 - The satisfies operator][2]

[1]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator
[2]: https://github.com/microsoft/TypeScript/pull/46827
