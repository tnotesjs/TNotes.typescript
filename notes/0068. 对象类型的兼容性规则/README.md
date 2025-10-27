# [0068. 对象类型的兼容性规则](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0068.%20%E5%AF%B9%E8%B1%A1%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%85%BC%E5%AE%B9%E6%80%A7%E8%A7%84%E5%88%99)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 对象类型的兼容性规则是什么？](#3--对象类型的兼容性规则是什么)
  - [3.1. 规则 1：源类型可以有额外属性（超集兼容子集）](#31-规则-1源类型可以有额外属性超集兼容子集)
  - [3.2. 规则 2：对象字面量的“新鲜度检查”（Freshness Checking）](#32-规则-2对象字面量的新鲜度检查freshness-checking)
- [4. 🤔 对象字面量的“新鲜度检查”（Freshness Checking）是什么？](#4--对象字面量的新鲜度检查freshness-checking是什么)
  - [4.1. 思考题](#41-思考题)
  - [4.2. 如何理解“等效”？](#42-如何理解等效)
  - [4.3. 场景 1 - 值来源于你的输入 - 优先考虑安全性](#43-场景-1---值来源于你的输入---优先考虑安全性)
  - [4.4. 场景 2 - 值很可能来源于其它地方 - 优先考虑实用性](#44-场景-2---值很可能来源于其它地方---优先考虑实用性)
  - [4.5. 评价](#45-评价)
- [5. 🤔 `readonly` 修饰符是否会影响对象类型的兼容性检查？](#5--readonly-修饰符是否会影响对象类型的兼容性检查)
- [6. 🤔 可选属性是否会影响对象类型的兼容性检查？](#6--可选属性是否会影响对象类型的兼容性检查)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 对象类型的兼容性规则
- Freshness Checking
- 只读属性
- 可选属性

## 2. 🫧 评价

对象的类型兼容性，大多数情况下满足“结构子类型”原则。特殊情况：直接赋值字面量。

需要注意对象字面量的“新鲜度检查”（Freshness Checking）原则，最好能理解 TS 为何如此设计。

`readonly` 属性不会影响兼容性检查逻辑，可选属性会影响兼容性检查逻辑。

## 3. 🤔 对象类型的兼容性规则是什么？

### 3.1. 规则 1：源类型可以有额外属性（超集兼容子集）

```ts
type A = { x: number }
type B = { x: number; y: string }

let a: A = { x: 1 }
let b: B = { x: 2, y: 'hello' }

a = b // ✅ B 是 A 的超集，兼容
// b = a; // ❌ A 缺少 y，不兼容
```

### 3.2. 规则 2：对象字面量的“新鲜度检查”（Freshness Checking）

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

## 4. 🤔 对象字面量的“新鲜度检查”（Freshness Checking）是什么？

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

### 4.1. 思考题

1、2 不是等效的吗？为什么 TS 判定 1 错误，2 正确？

### 4.2. 如何理解“等效”？

- 如果从最终运行结果来看，是等效的；
- 如果从应用场景来看，两者是有差异的；

在 TS 看来，1、2 是两种经典的不同应用场景，优先考虑的侧重点是不同的。理解这两种场景的特点，更更好的帮我们理解“TS 为何在这块要这么设计”。

### 4.3. 场景 1 - 值来源于你的输入 - 优先考虑安全性

值来源于你的输入，你明确知道你输入的值是什么，这个值是你能控制的。因此，TS 对对象字面量进行了更严格的检查，确保它不包含任何未知属性。

这时候 TS 会认为你都已经手写字面量了，想必你是知道你写的是什么的，这时候就必须跟 A 保持一致，还能避免你不小心拼错导致错误。

小结：

- 当直接将对象字面量赋值给变量时，TypeScript 会进行"新鲜度检查"
- TypeScript 认为这是你刚刚创建的对象，如果有多余属性可能是拼写错误
- 因此会严格检查，不允许有目标类型中未声明的属性

### 4.4. 场景 2 - 值很可能来源于其它地方 - 优先考虑实用性

值很可能来源于其它地方，比如后端 API 接口返回的数据，这个值不是你能控制的。因此，这时候 TS 只关心 obj 是否符合 A 的结构，而不检查 obj 的定义是否包含额外的属性。

小结：

- 当通过变量间接赋值时，TypeScript 采用结构化类型检查
- 只要变量包含目标类型所需的所有属性（这里是 `x: number`），就认为兼容
- 多余的属性 `y` 被忽略，不会报错

### 4.5. 评价

- 这么设计挺合理的，在「安全性」和「实用性」方面都兼顾了。
- 防止拼写错误：直接使用对象字面量时，多余的属性很可能是拼写错误
- 保持灵活性：已有变量可能来自 API 返回等场景，多余的属性是合理的

## 5. 🤔 `readonly` 修饰符是否会影响对象类型的兼容性检查？

不会。

```ts
type A = { readonly x: number }
type B = { x: number }

let a: A = { x: 1 }
let b: B = { x: 2 }

a = b // ✅ 兼容
b = a // ✅ 兼容
```

这就意味着你可以取巧地修改只读属性的值。（但是最好不要这么做）

```ts
type A = { readonly x: number }
type B = { x: number }

let a: A = { x: 1 }
let b: B = { x: 2 }

// a.x = 123 // ❌ 报错
// Cannot assign to 'x' because it is a read-only property.(2540)

b = a // ✅ 兼容

b.x = 123 // ✅ 允许

console.log(a.x) // 123
```

## 6. 🤔 可选属性是否会影响对象类型的兼容性检查？

会。

`T ⊆ T | undefined`

- 非空类型小，是子类型，可以赋值给可空类型
- 可空类型大，是父类型，无法赋值给非空类型

```ts
type RequiredProp = { x: number }
type OptionalProp = { x?: number }

let required: RequiredProp = { x: 1 }
let optional: OptionalProp = { x: 2 }

optional = required // ✅ 兼容 - required.x 满足 optional.x 的要求
// required = optional // ❌ 不兼容 - optional.x 可能是 undefined
// 报错信息如下：
// Type 'OptionalProp' is not assignable to type 'RequiredProp'.
//   Types of property 'x' are incompatible.
//     Type 'number | undefined' is not assignable to type 'number'.
//       Type 'undefined' is not assignable to type 'number'.(2322)
```
