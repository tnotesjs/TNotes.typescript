# [0067. 结构子类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0067.%20%E7%BB%93%E6%9E%84%E5%AD%90%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是结构子类型（Structural Typing）？](#3--什么是结构子类型structural-typing)
  - [3.1. 官方描述](#31-官方描述)
  - [3.2. 结构子类型的核心原则](#32-结构子类型的核心原则)
- [4. 🤔 结构子类型（Structural Subtyping）原则会带来什么问题？「细节」](#4--结构子类型structural-subtyping原则会带来什么问题细节)
  - [4.1. 问题描述](#41-问题描述)
  - [4.2. 问题分析](#42-问题分析)
  - [4.3. 解决方案](#43-解决方案)
  - [4.4. 「名义子类型（Nominal Subtyping）」存在上述问题吗？](#44-名义子类型nominal-subtyping存在上述问题吗)
  - [4.5. 小结](#45-小结)
- [5. 🔗 引用](#5--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- [Structural Type System - 结构化类型系统][1]

## 2. 🫧 评价

- TypeScript 的类型兼容性基于结构子类型（Structural Subtyping），而非像 Java/C# 那样的名义子类型（Nominal Subtyping）。这是 TypeScript 与许多传统面向对象语言的关键区别。
- 记住一句话：TypeScript 的类型兼容性只管“你有没有我需要的东西”，不“你叫什么名字”。

## 3. 🤔 什么是结构子类型（Structural Typing）？

### 3.1. 官方描述

One of TypeScript’s core principles is that type checking focuses on the shape that values have. This is sometimes called “duck typing” or “structural typing”.

TypeScript 的核心原则之一是类型检查侧重于值的结构（shape）。这有时被称为“鸭子类型”或“结构性类型”。

In a structural type system, if two objects have the same shape, they are considered to be of the same type.

在结构性类型系统中，如果两个对象具有相同的结构，那么它们被视为相同的类型。

```ts
interface Point {
  x: number
  y: number
}

function logPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`)
}

// logs "12, 26"
const point = { x: 12, y: 26 }
logPoint(point)
```

The point variable is never declared to be a Point type. However, TypeScript compares the shape of point to the shape of Point in the type-check. They have the same shape, so the code passes.

point 变量从未被声明为 Point 类型。然而，TypeScript 在类型检查时会比较 point 的结构与 Point 的结构。它们具有相同的结构，因此代码通过了检查。

The shape-matching only requires a subset of the object’s fields to match.

结构匹配只要求对象的一部分字段匹配。

```ts
const point3 = { x: 12, y: 26, z: 89 }
logPoint(point3) // logs "12, 26"

const rect = { x: 33, y: 3, width: 30, height: 80 }
logPoint(rect) // logs "33, 3"

const color = { hex: '#187ABF' }
logPoint(color) // ❌
// Argument of type '{ hex: string; }' is not assignable to parameter of type 'Point'.
//   Type '{ hex: string; }' is missing the following properties from type 'Point': x, y
// color 必须要需要具备 x, y 才行。
```

There is no difference between how classes and objects conform to shapes:

类和对象符合形状的方式没有区别：

```ts
class VirtualPoint {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

const newVPoint = new VirtualPoint(13, 56)
logPoint(newVPoint) // logs "13, 56"
```

If the object or class has all the required properties, TypeScript will say they match, regardless of the implementation details.

只要对象或类具有所有必需的属性，TypeScript 就会认为它们匹配，而不考虑实现细节。

### 3.2. 结构子类型的核心原则

结构子类型的核心原则是："如果 A 拥有 B 所需的所有属性和方法，那么 A 就兼容 B。"

换句话说，TypeScript 只关心类型的结构（shape），而不关心类型的名称或声明方式。

- 示例 1：不同名称，相同结构 → 兼容

```ts
interface Point2D {
  x: number
  y: number
}

interface Vector {
  x: number
  y: number
}

const p: Point2D = { x: 1, y: 2 }
const v: Vector = p // ✅ 兼容！因为结构相同
```

- 示例 2：额外属性 → 兼容（"鸭子类型"）

```ts
interface Animal {
  name: string
}

const dog = {
  name: 'Buddy',
  breed: 'Golden Retriever', // 额外属性
}

const a: Animal = dog // ✅ 兼容！dog 至少满足 Animal 的要求
```

- 🦆 鸭子类型（Duck Typing）： "如果它走起来像鸭子，叫起来像鸭子，那它就是鸭子。"
- 注：鸭子类型（Duck Typing）也叫结构子类型（Structural Typing）

## 4. 🤔 结构子类型（Structural Subtyping）原则会带来什么问题？「细节」

### 4.1. 问题描述

结构子类型原则有时会导致令人惊讶的结果，因为它只管“你有没有我需要的东西”，不管“你有没有多余的东西”，这就会导致一些细节问题，特别是在使用索引访问时。

```ts
interface MyObj {
  x: number
  y: number
}

// 问题示例：使用 Object.keys 遍历时类型不安全
function getSum(obj: MyObj) {
  let sum = 0

  for (const n of Object.keys(obj)) {
    const v = obj[n] // ❌ 报错：类型不安全
    // Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'MyObj'.
    sum += Math.abs(v)
  }

  return sum
}
```

### 4.2. 问题分析

- `obj[xxx]` 通过索引 `xxx` 访问 `obj` 成员时，要求索引 `xxx` 只能是 `'x'` 或者 `'y'`
- 但是 `Object.keys(obj)` 返回的结果是 `string[]`，这就意味着当我们在使用 `obj[n]` 这种写法时，传入的索引是 `string`，宽泛的 `string` 类型无法赋值给具体的 `'x'` 或 `'y'`，因此就报错了。

明确问题之后，解决起来就简单多了，核心就是要处理 `n` 类型过于宽泛的问题。思考方向 => 让 `n` 类型更具体，只能是 `MyObj` 要求的 `key` 即可。

### 4.3. 解决方案

```ts
interface MyObj {
  x: number
  y: number
}

// 正确写法示例 - 1：使用断言
function getSumSafe_1(obj: MyObj) {
  let sum = 0

  for (const n of Object.keys(obj) as ['x', 'y']) {
    const v = obj[n]
    sum += Math.abs(v)
  }

  return sum
}

// 正确写法示例 - 2：使用泛型
function getSumSafe_2<T extends Record<string, number>>(obj: T): number {
  let sum = 0

  // 注意：这里用 Object.keys(obj) as (keyof T)[]
  for (const n of Object.keys(obj) as (keyof T)[]) {
    const v = obj[n]
    sum += Math.abs(v)
  }

  return sum
}

// 正确写法示例 - 3：封装辅助的类型函数
function typedKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[]
}

function getSumSafe_3(obj: MyObj) {
  let sum = 0
  for (const n of typedKeys(obj)) {
    sum += Math.abs(obj[n])
  }
  return sum
}

// 正确写法示例 - 4：使用具体的索引名
function getSumSafe_4(obj: MyObj) {
  return Math.abs(obj.x) + Math.abs(obj.y)
}

// ……
```

### 4.4. 「名义子类型（Nominal Subtyping）」存在上述问题吗？

很可能不会。

- 【1】名义子类型（Nominal Subtyping） -> 看名字定身份 - 能根据名字 `MyObj` 精确定位它的 `key` 具体都有哪些，不会有多余的 `key` 的可能。
- 【2】结构子类型（Structural Subtyping） -> 看结构定身份 - 根据结构定身份，只要有 `x` 有 `y`，你就是 `MyObj` 类型，`key` 除了 `x`、`y` 之外，还有其它很多可能。

由此可见，【1】、【2】各有特色，并非 TS 采用的策略就是最优的，适配所有场景。

### 4.5. 小结

上面提到的这个细节问题，也只是「结构子类型（Structural Subtyping）」导致的问题中的一个缩影！

在实际开发中，我们可能还会遇到其它各种奇怪的小问题，当遇到这类奇怪的类型问题时，先结合报错信息分析一下错误原因。很多问题，在咱们定位到具体原因之后，处理起来的方案还是很多的。

## 5. 🔗 引用

- [Structural Type System - 结构化类型系统][1]

[1]: https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html#structural-type-system
