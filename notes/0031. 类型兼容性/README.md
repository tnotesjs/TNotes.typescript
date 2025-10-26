# [0031. 类型兼容性](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0031.%20%E7%B1%BB%E5%9E%8B%E5%85%BC%E5%AE%B9%E6%80%A7)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是 TypeScript 中的类型兼容性？](#3--什么是-typescript-中的类型兼容性)
- [4. 🤔 什么是结构子类型（Structural Typing）？](#4--什么是结构子类型structural-typing)
  - [4.1. 官方描述](#41-官方描述)
  - [4.2. 结构子类型的核心原则](#42-结构子类型的核心原则)
- [5. 🤔 对象类型的兼容性规则是什么？](#5--对象类型的兼容性规则是什么)
  - [5.1. 规则 1：源类型可以有额外属性（超集兼容子集）](#51-规则-1源类型可以有额外属性超集兼容子集)
  - [5.2. 规则 2：对象字面量的“新鲜度检查”（Freshness Checking）](#52-规则-2对象字面量的新鲜度检查freshness-checking)
- [6. 🤔 对象字面量的“新鲜度检查”（Freshness Checking）是什么？](#6--对象字面量的新鲜度检查freshness-checking是什么)
  - [6.1. 思考题](#61-思考题)
  - [6.2. 问题分析](#62-问题分析)
  - [6.3. 场景 1 - 值来源于你的输入 - 优先考虑安全性](#63-场景-1---值来源于你的输入---优先考虑安全性)
  - [6.4. 场景 2 - 值很可能来源于其它地方 - 优先考虑实用性](#64-场景-2---值很可能来源于其它地方---优先考虑实用性)
  - [6.5. 评价](#65-评价)
- [7. 🤔 函数类型的兼容性规则是什么？](#7--函数类型的兼容性规则是什么)
  - [7.1. 基本规则](#71-基本规则)
  - [7.2. 示例：参数逆变](#72-示例参数逆变)
  - [7.3. 示例：返回值协变](#73-示例返回值协变)
- [8. 🤔 泛型类型的兼容性规则是什么？](#8--泛型类型的兼容性规则是什么)
  - [8.1. 简单规则](#81-简单规则)
  - [8.2. 协变（Covariance）](#82-协变covariance)
  - [8.3. 逆变（Contravariance）](#83-逆变contravariance)
  - [8.4. 不变（Invariance）](#84-不变invariance)
  - [8.5. 示例：数组（协变）](#85-示例数组协变)
  - [8.6. 函数类型中的泛型位置分析](#86-函数类型中的泛型位置分析)
  - [8.7. 评价](#87-评价)
- [9. 🤔 类类型的兼容性规则是什么？](#9--类类型的兼容性规则是什么)
- [10. 🤔 结构子类型（Structural Subtyping）原则会带来什么问题？「细节」](#10--结构子类型structural-subtyping原则会带来什么问题细节)
  - [10.1. 问题描述](#101-问题描述)
  - [10.2. 问题分析](#102-问题分析)
  - [10.3. 解决方案](#103-解决方案)
  - [10.4. 「名义子类型（Nominal Subtyping）」存在上述问题吗？](#104-名义子类型nominal-subtyping存在上述问题吗)
  - [10.5. 小结](#105-小结)
- [11. 🔗 引用](#11--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- [Type Compatibility - 类型兼容性][3]
- [Structural Type System - 结构化类型系统][2]
- 对象字面量的“新鲜度检查”（Freshness Checking）
- “逆变”（Contravariance）
- “协变”（Covariance）
- 特殊类型之间的兼容性

## 2. 🫧 评价

- 这节内容特别重要，它决定了「一个类型 A」是否可以赋值给「另一个类型 B」的判断标准。
- 记住一句话：TypeScript 的类型兼容性只管“你有没有我需要的东西”，不“你叫什么名字”。
- 特殊类型的可赋值性
  - TS 中类型众多，特别是涉及到这些“边缘”类型（any、unknown 和 never）时，经常会搞混它们的赋值关系。
  - 比如，什么类型可以赋值给它们？它们又能赋值给什么类型？
  - 如果对此有疑问，可以参考「特殊类型的可赋值性」这篇笔记。

## 3. 🤔 什么是 TypeScript 中的类型兼容性？

- 类型的兼容性（Type Compatibility）是 TypeScript 类型系统的核心机制之一。它决定了"一个类型是否可以赋值给另一个类型"，直接影响代码能否通过编译。理解这一机制，能帮助你写出更灵活、更安全的代码，并避免常见的类型错误。
- TypeScript 的类型兼容性基于结构子类型（Structural Subtyping），而非像 Java/C# 那样的名义子类型（Nominal Subtyping）。这是 TypeScript 与许多传统面向对象语言的关键区别。

## 4. 🤔 什么是结构子类型（Structural Typing）？

### 4.1. 官方描述

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

### 4.2. 结构子类型的核心原则

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

## 5. 🤔 对象类型的兼容性规则是什么？

### 5.1. 规则 1：源类型可以有额外属性（超集兼容子集）

```ts
type A = { x: number }
type B = { x: number; y: string }

let a: A = { x: 1 }
let b: B = { x: 2, y: 'hello' }

a = b // ✅ B 是 A 的超集，兼容
// b = a; // ❌ A 缺少 y，不兼容
```

### 5.2. 规则 2：对象字面量的“新鲜度检查”（Freshness Checking）

```ts
type A = { x: number }

// 场景 1
let a: A = { x: 1, y: 'extra' } // ❌ 错误
// Object literal may only specify known properties, and 'y' does not exist in type 'A'.(2353)
// 对象字面量不能有未知属性
// 这是 TypeScript 的额外保护：防止拼写错误

// 场景 2
// 如果是变量赋值，则允许：
const obj = { x: 1, y: 'extra' }
let a: A = obj // ✅ 允许
```

## 6. 🤔 对象字面量的“新鲜度检查”（Freshness Checking）是什么？

- 对象字面量的“新鲜度检查”（Freshness Checking）也叫“严格字面量检查”。
- TypeScript 对“新鲜”的对象字面量和“已存在”的变量会采用不同的检查策略。

```ts
type A = { x: number }

// 场景 1
let a: A = { x: 1, y: 'extra' } // ❌ 错误
// Object literal may only specify known properties, and 'y' does not exist in type 'A'.(2353)

// 场景 2
const obj = { x: 1, y: 'extra' }
let a: A = obj // ✅ 允许
```

### 6.1. 思考题

1、2 不是等效的吗？为什么 TS 判定 1 错误，2 正确？

### 6.2. 问题分析

等效是指最终运行结果是等效的，但是在 TS 看来，这是两种经典的不同应用场景。

理解这两种场景的特点，更更好的帮我们理解“TS 为何在这块要这么设计”。

### 6.3. 场景 1 - 值来源于你的输入 - 优先考虑安全性

值来源于你的输入，你明确知道你输入的值是什么，这个值是你能控制的。因此，TS 对对象字面量进行了额外的检查，确保它不包含任何未知属性。这时候 TS 会认为你都已经手写字面量了，想必你是知道你写的是什么的，这时候就必须跟 A 保持一致，还能避免你不小心拼错导致错误。

- 当直接将对象字面量赋值给变量时，TypeScript 会进行"新鲜度检查"
- TypeScript 认为这是你刚刚创建的对象，如果有多余属性可能是拼写错误
- 因此会严格检查，不允许有目标类型中未声明的属性

### 6.4. 场景 2 - 值很可能来源于其它地方 - 优先考虑实用性

值很可能来源于其它地方，比如后端 API 接口返回的数据，这个值不是你能控制的。因此，这时候 TS 只关心 obj 是否符合 A 的结构，而不检查 obj 的定义是否包含额外的属性。

- 当通过变量间接赋值时，TypeScript 采用结构化类型检查
- 只要变量包含目标类型所需的所有属性（这里是 `x: number`），就认为兼容
- 多余的属性 `y` 被忽略，不会报错

### 6.5. 评价

- 这么设计挺合理的，在「安全性」和「实用性」方面都兼顾了。
- 防止拼写错误：直接使用对象字面量时，多余的属性很可能是拼写错误
- 保持灵活性：已有变量可能来自 API 返回等场景，多余的属性是合理的

## 7. 🤔 函数类型的兼容性规则是什么？

函数兼容性遵循“逆变”（Contravariance）和“协变”（Covariance）规则。

### 7.1. 基本规则

- 参数类型：逆变 → 源函数的参数类型可以比目标函数更宽泛
- 返回类型：协变 → 源函数的返回类型可以比目标函数更具体

### 7.2. 示例：参数逆变

```ts
type Handler = (event: MouseEvent) => void

const handleClick: Handler = (event: Event) => {
  // event 是 Event（比 MouseEvent 更宽泛）
  console.log(event.timeStamp)
}

// ✅ 兼容！因为 MouseEvent 是 Event 的子类型，
// 传入 MouseEvent 时，Event 类型的参数能安全处理它
```

### 7.3. 示例：返回值协变

```ts
type Factory = () => HTMLElement

const createDiv: Factory = () => {
  return document.createElement('div') // HTMLDivElement
}

// ✅ 兼容！HTMLDivElement 是 HTMLElement 的子类型
```

## 8. 🤔 泛型类型的兼容性规则是什么？

泛型兼容性取决于类型参数的使用位置（协变/逆变/不变）。

### 8.1. 简单规则

- 如果泛型只用于返回值位置 → 协变（子类型兼容）
- 如果泛型只用于参数位置 → 逆变（父类型兼容）
- 如果泛型既用于参数位置又用于返回值位置 → 不变（必须完全相同）

### 8.2. 协变（Covariance）

协变指的是子类型关系在某种变换下得以保持。当泛型类型参数只出现在返回值位置时，类型关系保持不变。

```ts
// 协变示例：泛型只用于返回值位置
interface Producer<T> {
  produce(): T
}

let stringProducer: Producer<string> = {
  produce: () => 'hello',
}

// string 是 unknown 的子类型，Producer<string> 也是 Producer<unknown> 的子类型
let unknownProducer: Producer<unknown> = stringProducer // ✅ 协变允许
```

### 8.3. 逆变（Contravariance）

逆变指的是子类型关系在某种变换下发生逆转。当泛型类型参数只出现在参数位置时，类型关系发生逆转。

```ts
// 逆变示例：泛型只用于参数位置
interface Consumer<T> {
  consume(item: T): void
}

let unknownConsumer: Consumer<unknown> = {
  consume: (item: unknown) => console.log(item),
}

// unknown 是 string 的父类型，Consumer<unknown> 可以安全地赋值给 Consumer<string>
let stringConsumer: Consumer<string> = unknownConsumer // ✅ 逆变允许
```

### 8.4. 不变（Invariance）

不变指的是无论在什么情况下都不能改变原有的类型关系。当泛型类型参数既出现在参数位置又出现在返回值位置时，必须保持类型完全一致。

```ts
// 不变示例：泛型既用于参数又用于返回值
interface Transformer<T> {
  transform(item: T): T
}

let stringTransformer: Transformer<string> = {
  transform: (item: string) => item.toUpperCase(),
}

// 以下两行都会报错，必须保持类型完全一致
let unknownTransformer: Transformer<unknown> = stringTransformer // ❌ 不变禁止
let stringTransformer2: Transformer<string> = unknownTransformer // ❌ 不变禁止
```

### 8.5. 示例：数组（协变）

```ts
class Animal {
  name: string = ''
}
class Dog extends Animal {
  breed: string = ''
}

let animals: Animal[] = [new Animal()]
let dogs: Dog[] = [new Dog()]

animals = dogs // ✅ Dog[] 兼容 Animal[]（因为 Dog 是 Animal 的子类型）
// 这体现了数组类型的协变特性

// ⚠️ 注意：这在可变数组中不安全（可以 animals.push(new Animal())，但实际是 dogs 数组）
// 但 TypeScript 仍允许（出于实用性）
```

### 8.6. 函数类型中的泛型位置分析

```ts
// 函数返回值位置的泛型 - 协变
type FuncReturning<T> = () => T
let getString: FuncReturning<string> = () => 'hello'
let getUnknown: FuncReturning<unknown> = getString // ✅ 协变

// 函数参数位置的泛型 - 逆变
type FuncAccepting<T> = (param: T) => void
let acceptUnknown: FuncAccepting<unknown> = (x: unknown) => console.log(x)
let acceptString: FuncAccepting<string> = acceptUnknown // ✅ 逆变

// 函数参数和返回值都有的泛型 - 不变
type FuncTransform<T> = (param: T) => T
let transformString: FuncTransform<string> = (s: string) => s.toUpperCase()
// let transformUnknown: FuncTransform<unknown> = transformString; // ❌ 不变禁止
```

### 8.7. 评价

- 这些规则确保了类型安全：协变适用于"读取"场景（子类型兼容父类型），逆变适用于"写入"场景（父类型兼容子类型），不变适用于"读写"场景（必须类型完全一致）
- 理解协变、逆变和不变有助于深入掌握 TypeScript 的类型系统
- 在实际开发中，这些规则影响着泛型类型、数组、函数等的赋值兼容性

## 9. 🤔 类类型的兼容性规则是什么？

类也遵循结构子类型，但私有/受保护成员例外！

- 公有成员：结构兼容

```ts
class Point {
  x: number = 1
  y: number = 2
}
class Vector {
  x: number = 3
  y: number = 4
}

let p: Point = new Vector() // ✅ 兼容
```

- 私有/受保护成员：必须来自同一声明

```ts
class Animal {
  private name: string
  constructor(name: string) {
    this.name = name
  }
}

class Dog {
  private name: string // 即使结构相同，也不是 Animal 的私有成员
  constructor(name: string) {
    this.name = name
  }
}

let a: Animal = new Dog('Buddy') // ❌ 错误！私有成员不兼容
// Type 'Dog' is not assignable to type 'Animal'.
//   Types have separate declarations of a private property 'name'.(2322)

// 原因：防止意外继承，保证封装性。
```

## 10. 🤔 结构子类型（Structural Subtyping）原则会带来什么问题？「细节」

### 10.1. 问题描述

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

### 10.2. 问题分析

- `obj[xxx]` 通过索引 `xxx` 访问 `obj` 成员时，要求索引 `xxx` 只能是 `'x'` 或者 `'y'`
- 但是 `Object.keys(obj)` 返回的结果是 `string[]`，这就意味着当我们在使用 `obj[n]` 这种写法时，传入的索引是 `string`，宽泛的 `string` 类型无法赋值给具体的 `'x'` 或 `'y'`，因此就报错了。

明确问题之后，解决起来就简单多了，核心就是要处理 `n` 类型过于宽泛的问题。思考方向 => 让 `n` 类型更具体，只能是 `MyObj` 要求的 `key` 即可。

### 10.3. 解决方案

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

### 10.4. 「名义子类型（Nominal Subtyping）」存在上述问题吗？

很可能不会。

- 【1】名义子类型（Nominal Subtyping） -> 看名字定身份 - 能根据名字 `MyObj` 精确定位它的 `key` 具体都有哪些，不会有多余的 `key` 的可能。
- 【2】结构子类型（Structural Subtyping） -> 看结构定身份 - 根据结构定身份，只要有 `x` 有 `y`，你就是 `MyObj` 类型，`key` 除了 `x`、`y` 之外，还有其它很多可能。

由此可见，【1】、【2】各有特色，并非 TS 采用的策略就是最优的，适配所有场景。

### 10.5. 小结

上面提到的这个细节问题，也只是「结构子类型（Structural Subtyping）」导致的问题中的一个缩影！

在实际开发中，我们可能还会遇到其它各种奇怪的小问题，当遇到这类奇怪的类型问题时，先结合报错信息分析一下错误原因。很多问题，在咱们定位到具体原因之后，处理起来的方案还是很多的。

## 11. 🔗 引用

- [Type Compatibility - 类型兼容性][3]
  - [any, unknown, object, void, undefined, null, and never assignability][1]
- [Structural Type System - 结构化类型系统][2]

[1]: https://www.typescriptlang.org/docs/handbook/type-compatibility.html#any-unknown-object-void-undefined-null-and-never-assignability
[2]: https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html#structural-type-system
[3]: https://www.typescriptlang.org/docs/handbook/type-compatibility.html
