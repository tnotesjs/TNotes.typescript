# [0051. 类型断言](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0051.%20%E7%B1%BB%E5%9E%8B%E6%96%AD%E8%A8%80)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🔍 章节速览](#3--章节速览)
- [4. 🤔 类型断言是什么？](#4--类型断言是什么)
- [5. 🤔 类型断言的两种语法是？](#5--类型断言的两种语法是)
- [6. 🤔 类型断言的使用条件是什么？](#6--类型断言的使用条件是什么)
- [7. 🤔 什么是 as const 断言？](#7--什么是-as-const-断言)
- [8. 🤔 什么是非空断言？](#8--什么是非空断言)
- [9. 🤔 什么是断言函数？](#9--什么是断言函数)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 类型断言
- 类型断言的使用条件
- as const 断言
- 非空断言
- 断言函数

## 2. 🫧 评价

类型断言是比较常用的技巧，通常用于那些我们能够明确具体类型，而无需借助 TS 类型推断的场景。

本节是对“类型断言”章节中一些核心知识点的提炼汇总。

## 3. 🔍 章节速览

<N :ids='["0131", "0132", "0133"]' />

## 4. 🤔 类型断言是什么？

类型断言是 TS 提供的一种手段，允许开发者在代码中“断言”某个值的类型，告诉编译器此处的值是什么类型。TS 一旦发现存在类型断言，就不再对该值进行类型推断，而是直接采用断言给出的类型。

```ts
type T = 'a' | 'b' | 'c'
let foo = 'a' // string

let bar: T = foo // ❌ Error
// Type 'string' is not assignable to type 'T'.(2322)
```

上面示例中，TS 推断变量 `foo` 的类型是 `string`，而变量 `bar` 的类型是 `'a'|'b'|'c'`，前者 `string` 是后者 `'a'|'b'|'c'` 的父类型。父类型不能赋值给子类型，所以就报错了。

解决方法就是进行类型断言：

```ts
type T = 'a' | 'b' | 'c'

// 做法 1：将 foo 赋值给 bar 的时候断言
// let foo = 'a'
// let bar: T = foo as T // ✅ OK

// 做法 2：在 foo 变量声明的时候断言
let foo = 'a' as T
let bar: T = foo // ✅ OK
```

做法 1 和做法 2 都 OK。

## 5. 🤔 类型断言的两种语法是？

```ts
// 语法一：<类型>值
<Type>value

// 语法二：值 as 类型
value as Type
```

目前推荐使用语法二，因为它避免了与 JSX 语法的冲突。

## 6. 🤔 类型断言的使用条件是什么？

类型断言并不意味着可以把某个值断言为任意类型。类型断言的使用前提是，值的实际类型与断言的类型必须满足一个条件：

```ts
expr as T
```

`expr` 是实际的值，`T` 是类型断言，它们必须满足下面其中一个条件：

- `expr` 是 `T` 的子类型
- `T` 是 `expr` 的子类型
- `expr` 和 `T` 的类型有交集

也就是说，类型断言要求实际的类型与断言的类型兼容，实际类型可以断言为一个更加宽泛的类型（父类型），也可以断言为一个更加精确的类型（子类型），但不能断言为一个完全无关的类型。

```ts
let foo = 'a' as number // ❌ Error
// Conversion of type 'string' to type 'number' may be a mistake because neither type sufficiently overlaps with the other.
// If this was intentional, convert the expression to 'unknown' first.(2352)
```

如果真的要断言成一个完全无关的类型，可以连续进行两次类型断言：

```ts
expr as unknown as T
// 或者写成 <T><unknown>expr
```

示例：

```ts
let foo = 'a' as unknown as number // ✅ OK
```

## 7. 🤔 什么是 as const 断言？

`as const` 是一种特殊的类型断言，用于告诉编译器，推断类型时，可以将这个值推断为常量：

```ts
let s1 = 'JavaScript'
// s1 被推断为 string 类型

let s2 = 'JavaScript' as const
// s2 被推断为 'JavaScript' 类型
```

使用了 `as const` 断言以后，let 变量就等同于是用 const 命令声明的，变量的类型会被推断为值类型。

比如下面这样的场景：

```ts
type Lang = 'JavaScript' | 'TS' | 'Python'

function setLang(language: Lang) {
  /* ... */
}

// 不使用 as const 断言
// let s1 = 'JavaScript'
// setLang(s1) // ❌ Error
// Argument of type 'string' is not assignable to parameter of type 'Lang'.(2345)
// 此时 s1 会被推断为 string 类型，string 类型是 Lang 的父类型，因此无法将 string 赋值给 Lang 类型。

// 使用 as const 断言
let s2 = 'JavaScript' as const
setLang(s2) // ✅ OK
// 此时 s2 会被推断为 'JavaScript' 类型，满足联合类型 Lang，因此可以直接赋值。
```

需要注意，`as const` 断言只能用于 `enum members, or string, number, boolean, array, or object literals`，不能用于变量。

```ts
type Lang = 'JavaScript' | 'TS' | 'Python'

function setLang(language: Lang) {
  /* ... */
}

let s = 'JavaScript'
setLang(s as const) // ❌ Error
// A 'const' assertions can only be applied to references to enum members, or string, number, boolean, array, or object literals.(1355)
// Argument of type 'string' is not assignable to parameter of type 'Lang'.(2345)
```

`as const` 可以用于整个对象或对象的单个属性：

```ts
const v1 = {
  x: 1,
  y: 2,
}
// 类型是 { x: number; y: number; }

const v2 = {
  x: 1 as const,
  y: 2,
}
// 类型是 { x: 1; y: number; }

const v3 = {
  x: 1,
  y: 2,
} as const
// 类型是 { readonly x: 1; readonly y: 2; }
```

## 8. 🤔 什么是非空断言？

对于那些可能为空的变量（即可能等于 `undefined` 或 `null`），TS 提供了非空断言，保证这些变量不会为空，写法很简单，只需要在变量名后面加上感叹号 `!` 即可。

```ts
function f(x?: number | null) {
  validateNumber(x!) // 断言 x 非空（x 不可能是 null，一定是 number）
}

function validateNumber(x: number) {
  // ...
}
```

非空断言在实际编程中很有用，有时可以省去一些额外的判断：

```ts
const root = document.getElementById('root')!
```

非空断言还可以用于赋值断言，解决类属性必须初始化的问题：

```ts
class Point {
  x!: number // ✅ OK
  y!: number // ✅ OK

  constructor(x: number, y: number) {
    // ...
  }
}
```

## 9. 🤔 什么是断言函数？

断言函数是一种特殊函数，用于在运行时验证某个值的类型，并在编译时收窄类型范围，起到类似“类型守卫”的功能。

核心作用：将类型检查逻辑封装成可复用的函数，同时保持类型收窄能力。

::: code-group

```ts [没有断言函数]
// 问题：类型检查逻辑无法复用
function processValue(value: unknown) {
  if (typeof value !== 'string') {
    throw new Error('Not a string')
  }
  // TS 控制流分析自动收窄
  // 当程序执行完 if 分支后，到这里就能够明确 value 是 string 类型了
  console.log(value.toUpperCase()) // ✅ OK
}

function formatValue(value: unknown) {
  // 必须重复相同的类型检查逻辑
  if (typeof value !== 'string') {
    throw new Error('Not a string')
  }
  return value.toLowerCase() // ✅ OK
}
```

```ts [使用断言函数]
// 优势：将类型检查封装为可复用的断言函数
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error('Not a string')
  }
}

function processValue(value: unknown) {
  assertIsString(value) // 调用断言函数
  console.log(value.toUpperCase()) // OK，value 被收窄为 string
}

function formatValue(value: unknown) {
  assertIsString(value) // 复用断言函数
  return value.toLowerCase() // OK，value 被收窄为 string
}
```

:::

断言函数的两种形式：

```ts
// 形式 1：类型谓词断言（asserts value is Type）
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') throw new Error('Not a string')
}

// 形式 2：真值断言（asserts value）
function assert(value: unknown): asserts value {
  if (!value) throw new Error('Value is falsy')
}
```

实际应用场景：

```ts
// 场景 1：断言参数非空
function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(`${value} is not defined`)
  }
}

function greet(name?: string) {
  assertIsDefined(name)
  // 此时 name 的类型从 string | undefined 收窄为 string
  console.log(name.toUpperCase())
}

// 场景 2：断言数组元素类型
function assertAllStrings(arr: unknown[]): asserts arr is string[] {
  if (!arr.every((item) => typeof item === 'string')) {
    throw new Error('Not all elements are strings')
  }
}

const data: unknown[] = ['a', 'b', 'c']
assertAllStrings(data)
// 此时 data 的类型从 unknown[] 收窄为 string[]
data.forEach((str) => console.log(str.toUpperCase()))
```

断言函数 vs. 类型守卫：

| 特性     | 断言函数                     | 类型守卫                   |
| -------- | ---------------------------- | -------------------------- |
| 返回值   | `void`（抛出错误或无返回）   | `boolean`                  |
| 类型签名 | `asserts value is Type`      | `value is Type`            |
| 使用方式 | 直接调用，不需要 `if` 判断   | 必须在 `if` 条件中使用     |
| 失败行为 | 抛出错误，中断程序执行       | 返回 `false`，继续执行     |
| 适用场景 | 强制要求参数满足某种类型条件 | 需要根据类型做分支处理场景 |

- 类型守卫 ≈ “判断” -> 更广泛、更常用，更偏业务层
- 断言函数 ≈ “保证” -> 更偏底层强校验，更适合框架 / SDK / 核心模块（尤其是一些开源库项目会使用这种强约束来保证用户传入的类型满足库的要求）

```ts
// 类型守卫示例（对比）
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function processValue(value: unknown) {
  if (isString(value)) {
    // 在 if 块内，value 是 string 类型
    console.log(value.toUpperCase())
  }
  // if 块外，value 仍然是 unknown 类型
}
```
