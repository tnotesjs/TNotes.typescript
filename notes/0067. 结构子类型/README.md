# [0067. 结构子类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0067.%20%E7%BB%93%E6%9E%84%E5%AD%90%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🔍 查看官方对 “Structural Type” 的描述？](#3--查看官方对-structural-type-的描述)
- [4. 🤔 结构子类型的核心原则是什么？](#4--结构子类型的核心原则是什么)
- [5. 🆚 结构子类型 vs. 名义子类型](#5--结构子类型-vs-名义子类型)
  - [5.1. 结构子类型（Structural Subtyping）](#51-结构子类型structural-subtyping)
  - [5.2. 名义子类型（Nominal Subtyping）](#52-名义子类型nominal-subtyping)
- [6. 🤔 TS 可以模拟名义子类型，增强语义的安全性吗？](#6--ts-可以模拟名义子类型增强语义的安全性吗)
- [7. 🤔 结构子类型导致的“索引访问问题”是什么？](#7--结构子类型导致的索引访问问题是什么)
  - [7.1. 问题描述](#71-问题描述)
  - [7.2. 问题分析](#72-问题分析)
  - [7.3. 解决方案](#73-解决方案)
  - [7.4. 「名义子类型（Nominal Subtyping）」存在上述问题吗？](#74-名义子类型nominal-subtyping存在上述问题吗)
  - [7.5. 小结](#75-小结)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 结构子类型
- 名义子类型

## 2. 🫧 评价

TypeScript 的类型兼容性基于结构子类型（Structural Subtyping），而非像 Java/C# 那样的名义子类型（Nominal Subtyping）。这是 TypeScript 与许多传统面向对象语言的关键区别。

结构子类型和名义子类型各有特点，可以认为结构子类型策略具备更简洁的写法、更灵活的应用场景，但是也存在意外兼容的风险，以及常见的索引访问问题。

## 3. 🔍 查看官方对 “Structural Type” 的描述？

[Structural Type System - 结构化类型系统][1] 官方描述如下：

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

## 4. 🤔 结构子类型的核心原则是什么？

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

## 5. 🆚 结构子类型 vs. 名义子类型

结构子类型（Structural Subtyping）和名义子类型（Nominal Subtyping）是两种不同的类型兼容性判断方式，它们在类型系统设计中有根本区别：

| 特性             | 结构子类型               | 名义子类型             |
| ---------------- | ------------------------ | ---------------------- |
| 兼容依据         | 类型结构（成员是否匹配） | 类型名称和显式声明关系 |
| 是否需要显式实现 | 否                       | 是                     |
| 灵活性           | 高                       | 低                     |
| 意外兼容风险     | 有                       | 无                     |
| 代码简洁性       | 更简洁                   | 需要更多声明           |
| 代表语言         | TypeScript, Go           | Java, C#, C++          |

- 结构子类型 = 看“长什么样”
- 名义子类型 = 看“叫什么名字”和“谁生的”

### 5.1. 结构子类型（Structural Subtyping）

- 核心思想：
  - “如果它走起来像鸭子，叫起来也像鸭子，那它就是鸭子。”
  - 类型兼容性由类型的结构（成员、属性、方法等）决定，而不是由类型名称或显式声明的关系决定。
- 判断标准：
  - 如果类型 `A` 包含类型 `B` 所需的所有成员（且类型兼容），那么 `A` 就是 `B` 的子类型。
- 代表语言：
  - TypeScript、Go、OCaml（部分）、Rust（在 trait 实现中也有结构化思想）。
- 示例（TypeScript）：

```ts
interface Bird {
  fly(): void
}

class Sparrow {
  fly() {
    console.log('Flying!')
  }
}

function launch(b: Bird) {
  b.fly()
}

launch(new Sparrow()) // ✅ 合法！Sparrow 结构上兼容 Bird
```

尽管 `Sparrow` 没有显式实现 `Bird`，但结构匹配即可。

- 优点：
  - 灵活，无需显式声明继承或实现。
  - 更适合动态或组合式编程风格。
  - 减少样板代码。
- 缺点：
  - 可能导致意外兼容（例如两个不相关的类型碰巧结构相同）。
  - 类型意图不够明确（仅靠结构无法表达设计语义）。

### 5.2. 名义子类型（Nominal Subtyping）

- 核心思想：
  - 类型兼容性由类型名称和显式声明的继承/实现关系决定。
- 判断标准：
  - 即使两个类型结构完全相同，如果没有显式声明继承或实现关系，它们就不兼容。
- 代表语言：
  - Java、C#、C++、Kotlin、Swift。
- 示例（Java）：

```java
interface Bird {
    void fly();
}

class Sparrow {
    public void fly() { System.out.println("Flying!"); }
}

// 编译错误！Sparrow 没有 implements Bird
Bird b = new Sparrow(); // ❌ 不合法
```

必须写成：

```java
class Sparrow implements Bird { ... }
```

- 优点：
  - 类型关系明确，意图清晰。
  - 避免意外兼容，增强类型安全。
  - 更适合大型项目和团队协作。
- 缺点：
  - 需要更多样板代码（如 `implements`、`extends`）。
  - 灵活性较低，难以处理“巧合兼容”的场景。

## 6. 🤔 TS 可以模拟名义子类型，增强语义的安全性吗？

虽然 TypeScript 默认是结构子类型，但可以通过一些技巧模拟名义类型（例如使用“品牌类型”/branded types）：

```ts
type Email = string & { __brand: 'email' }
type UserID = string & { __brand: 'userid' }
// Email 和 UserID 虽然底层都是 string，但 TypeScript 视为不同类型

const email = 'user@example.com' as Email
const id = '123' as UserID

function sendEmail(to: Email) {
  console.log('Sending to:', to)
}

sendEmail(email) // ✅ OK
sendEmail(id) // ❌ Error: UserID 不能赋值给 Email
// 报错信息如下：
// Argument of type 'UserID' is not assignable to parameter of type 'Email'.
//   Type 'UserID' is not assignable to type '{ __brand: "email"; }'.
//     Types of property '__brand' are incompatible.
//       Type '"userid"' is not assignable to type '"email"'.(2345)
```

这说明结构类型系统也可以通过设计增强语义安全性。

## 7. 🤔 结构子类型导致的“索引访问问题”是什么？

### 7.1. 问题描述

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

### 7.2. 问题分析

- `obj[xxx]` 通过索引 `xxx` 访问 `obj` 成员时，要求索引 `xxx` 只能是 `'x'` 或者 `'y'`
- 但是 `Object.keys(obj)` 返回的结果是 `string[]`，这就意味着当我们在使用 `obj[n]` 这种写法时，传入的索引是 `string`，宽泛的 `string` 类型无法赋值给具体的 `'x'` 或 `'y'`，因此就报错了。

明确问题之后，解决起来就简单多了，核心就是要处理 `n` 类型过于宽泛的问题。思考方向 => 让 `n` 类型更具体，只能是 `MyObj` 要求的 `key` 即可。

### 7.3. 解决方案

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

### 7.4. 「名义子类型（Nominal Subtyping）」存在上述问题吗？

很可能不会。

- 【1】名义子类型（Nominal Subtyping） -> 看名字定身份 - 能根据名字 `MyObj` 精确定位它的 `key` 具体都有哪些，不会有多余的 `key` 的可能。
- 【2】结构子类型（Structural Subtyping） -> 看结构定身份 - 根据结构定身份，只要有 `x` 有 `y`，你就是 `MyObj` 类型，`key` 除了 `x`、`y` 之外，还有其它很多可能。

由此可见，【1】、【2】各有特色，并非 TS 采用的策略就是最优的，适配所有场景。

### 7.5. 小结

上面提到的这个细节问题，也只是「结构子类型（Structural Subtyping）」导致的问题中的一个缩影！

在实际开发中，我们可能还会遇到其它各种奇怪的小问题，当遇到这类奇怪的类型问题时，先结合报错信息分析一下错误原因。很多问题，在咱们定位到具体原因之后，处理起来的方案还是很多的。

## 8. 🔗 引用

- [Structural Type System - 结构化类型系统][1]

[1]: https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html#structural-type-system
