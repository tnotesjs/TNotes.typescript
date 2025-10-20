# [0031. 类型的兼容](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0031.%20%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%85%BC%E5%AE%B9)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是 TypeScript 中的类型兼容性？](#3--什么是-typescript-中的类型兼容性)
- [4. 🤔 什么是结构子类型（Structural Typing）？](#4--什么是结构子类型structural-typing)
- [5. 🤔 TypeScript 中赋值兼容性规则是什么？](#5--typescript-中赋值兼容性规则是什么)
- [6. 🤔 对象类型的兼容性规则是什么？](#6--对象类型的兼容性规则是什么)
- [7. 🤔 函数类型的兼容性规则是什么？](#7--函数类型的兼容性规则是什么)
- [8. 🤔 泛型类型的兼容性规则是什么？](#8--泛型类型的兼容性规则是什么)
- [9. 🤔 特殊类型之间的兼容性如何？](#9--特殊类型之间的兼容性如何)
- [10. 🤔 类类型的兼容性规则是什么？](#10--类类型的兼容性规则是什么)
- [11. 🤔 如何检查类型兼容性？](#11--如何检查类型兼容性)
- [12. 🤔 TypeScript 类型兼容性的最佳实践是什么？](#12--typescript-类型兼容性的最佳实践是什么)
- [13. 🔗 引用](#13--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 类型的兼容性（Type Compatibility）
- 鸭子类型（Duck Typing）

## 2. 🫧 评价

- TypeScript 的类型兼容性只问"你有没有我需要的东西"，不问"你叫什么名字"。

## 3. 🤔 什么是 TypeScript 中的类型兼容性？

类型的兼容性（Type Compatibility）是 TypeScript 类型系统的核心机制之一。它决定了"一个类型是否可以赋值给另一个类型"，直接影响代码能否通过编译。理解这一机制，能帮助你写出更灵活、更安全的代码，并避免常见的类型错误。

TypeScript 的类型兼容性基于结构子类型（Structural Subtyping），而非像 Java/C# 那样的名义子类型（Nominal Subtyping）。这是 TypeScript 与许多传统面向对象语言的关键区别。

## 4. 🤔 什么是结构子类型（Structural Typing）？

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

> 🦆 鸭子类型（Duck Typing）： "如果它走起来像鸭子，叫起来像鸭子，那它就是鸭子。"

## 5. 🤔 TypeScript 中赋值兼容性规则是什么？

TypeScript 的兼容性主要用于赋值场景（包括函数参数、返回值、变量初始化等）。

```ts
// 目标类型（Target） vs. 源类型（Source）
let target: Target = source // source 的类型必须兼容 Target
```

- 目标类型（Target）：变量/参数声明的类型
- 源类型（Source）：实际赋值的值的类型

兼容条件：源类型必须包含目标类型的所有成员（且类型兼容）。

## 6. 🤔 对象类型的兼容性规则是什么？

- 规则 1：源类型可以有额外属性（超集兼容子集）

```ts
type A = { x: number }
type B = { x: number; y: string }

let a: A = { x: 1 }
let b: B = { x: 2, y: 'hello' }

a = b // ✅ B 是 A 的超集，兼容
// b = a; // ❌ A 缺少 y，不兼容
```

- 规则 2：对象字面量的"新鲜度检查"（Freshness Checking）

```ts
let a: A = { x: 1, y: 'extra' } // ❌ 错误！对象字面量不能有未知属性
```

这是 TypeScript 的额外保护：防止拼写错误。但如果是变量赋值，则允许：

```ts
const obj = { x: 1, y: 'extra' }
let a: A = obj // ✅ 允许
```

## 7. 🤔 函数类型的兼容性规则是什么？

函数兼容性遵循"逆变"（Contravariance）和"协变"（Covariance）规则。

基本规则：

- 参数类型：逆变 → 源函数的参数类型可以比目标函数更宽泛
- 返回类型：协变 → 源函数的返回类型可以比目标函数更具体

---

- 示例：参数逆变

```ts
type Handler = (event: MouseEvent) => void

const handleClick: Handler = (event: Event) => {
  // event 是 Event（比 MouseEvent 更宽泛）
  console.log(event.timeStamp)
}

// ✅ 兼容！因为 MouseEvent 是 Event 的子类型，
// 传入 MouseEvent 时，Event 类型的参数能安全处理它
```

- 示例：返回值协变

```ts
type Factory = () => HTMLElement

const createDiv: Factory = () => {
  return document.createElement('div') // HTMLDivElement
}

// ✅ 兼容！HTMLDivElement 是 HTMLElement 的子类型
```

## 8. 🤔 泛型类型的兼容性规则是什么？

泛型兼容性取决于类型参数的使用位置（协变/逆变/不变）。

简单规则：

- 如果泛型只用于返回值 → 协变（子类型兼容）
- 如果泛型只用于参数 → 逆变（父类型兼容）
- 如果泛型既用于参数又用于返回值 → 不变（必须完全相同）

---

- 示例：数组（协变）

```ts
let animals: Animal[] = [{ name: 'Lion' }]
let dogs: Dog[] = [{ name: 'Buddy', breed: 'Lab' }]

animals = dogs // ✅ Dog[] 兼容 Animal[]（因为 Dog 是 Animal 的子类型）
```

注意：这在可变数组中不安全（可以 `animals.push(new Cat())`），但 TypeScript 仍允许（出于实用性）。

## 9. 🤔 特殊类型之间的兼容性如何？

回顾笔记「0017. 特殊类型的可赋值性」中的内容：

🔍 查阅官方文档 -> [any, unknown, object, void, undefined, null, and never assignability][1]

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

## 10. 🤔 类类型的兼容性规则是什么？

类也遵循结构子类型，但私有/受保护成员例外！

- 公有成员：结构兼容

```ts
class Point {
  x: number
  y: number
}
class Vector {
  x: number
  y: number
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

// 原因：防止意外继承，保证封装性。
```

## 11. 🤔 如何检查类型兼容性？

- 使用类型断言（不推荐用于生产）

```ts
// 强制认为兼容（可能运行时错误）
let x = value as Target
```

- 使用类型守卫（推荐）

```ts
if (isTarget(value)) {
  // value 被收窄为 Target
}
```

- 使用工具类型 `extends`（条件类型）

```ts
type IsCompatible<A, B> = A extends B ? true : false
```

## 12. 🤔 TypeScript 类型兼容性的最佳实践是什么？

1. 拥抱结构类型：不要依赖类型名称，关注对象结构。
2. 避免 `any`：用 `unknown` + 类型守卫替代。
3. 理解函数兼容性：参数逆变、返回值协变是常见困惑点。
4. 谨慎使用可变数组的协变：考虑用 `ReadonlyArray<T>` 提升安全性。
5. 利用兼容性设计灵活 API：

```ts
// 接受任何有 name 属性的对象
function greet(obj: { name: string }) {
  console.log(`Hello, ${obj.name}`)
}
```

## 13. 🔗 引用

- [any, unknown, object, void, undefined, null, and never assignability][1]

[1]: https://www.typescriptlang.org/docs/handbook/type-compatibility.html#any-unknown-object-void-undefined-null-and-never-assignability
