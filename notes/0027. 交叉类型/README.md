# [0027. 交叉类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0027.%20%E4%BA%A4%E5%8F%89%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是交叉类型？](#3--什么是交叉类型)
- [4. 🆚 交叉类型 vs. 联合类型](#4--交叉类型-vs-联合类型)
- [5. 🤔 同名属性如何处理？](#5--同名属性如何处理)
- [6. 🤔 函数如何处理？](#6--函数如何处理)
- [7. 🤔 交叉类型有哪些典型应用场景？](#7--交叉类型有哪些典型应用场景)
  - [7.1. 混入（Mixins）—— 组合行为](#71-混入mixins-组合行为)
  - [7.2. 扩展接口（比 `extends` 更灵活）](#72-扩展接口比-extends-更灵活)
  - [7.3. 高阶函数与泛型中的约束](#73-高阶函数与泛型中的约束)
  - [7.4. 与工具类型结合（如 `Omit`, `Pick`）](#74-与工具类型结合如-omit-pick)
- [8. 🤔 使用交叉类型时需要注意哪些问题？](#8--使用交叉类型时需要注意哪些问题)
  - [8.1. 同名属性冲突](#81-同名属性冲突)
  - [8.2. 不要滥用交叉原始类型](#82-不要滥用交叉原始类型)
  - [8.3. 交叉类型 ≠ 对象合并](#83-交叉类型--对象合并)
  - [8.4. 可辨识联合中慎用交叉](#84-可辨识联合中慎用交叉)
- [9. 🤔 交叉类型有哪些高级技巧？](#9--交叉类型有哪些高级技巧)
  - [9.1. 条件类型中的交叉](#91-条件类型中的交叉)
  - [9.2. 创建"必填"版本的可选属性](#92-创建必填版本的可选属性)
  - [9.3. 与映射类型结合](#93-与映射类型结合)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 交叉类型（Intersection Types）

## 2. 🫧 评价

- 交叉类型让你能把多个“能力接口”像乐高积木一样拼在一起，构建出功能更丰富的类型。

## 3. 🤔 什么是交叉类型？

交叉类型（Intersection Types）是 TypeScript 类型系统中的一个核心特性，使用 `&`（与符号）将多个类型组合在一起，表示"该值必须同时拥有所有这些类型的属性和方法"。

如果说联合类型表达的是"或"（A 或 B），那么交叉类型表达的就是"与"（A 且 B）——即一个值必须同时满足多个类型的全部要求。

基本语法：交叉类型使用 `&`（与符号）将多个类型组合在一起。

```ts
// 基本用法
type A = { x: string }
type B = { y: number }

type C = A & B
// 等价于 { x: string; y: number; }

const obj: C = {
  x: 'hello',
  y: 42,
} // ✅ 合法

// ----------------------------------------

// 对象类型的交叉（最常见）
interface Name {
  name: string
}

interface Age {
  age: number
}

type Person = Name & Age

const alice: Person = {
  name: 'Alice',
  age: 30,
} // ✅

// ----------------------------------------

// 与原始类型的交叉（较少见，通常无意义）
type Strange = string & number // never（因为没有值能同时是 string 和 number）
```

## 4. 🆚 交叉类型 vs. 联合类型

| 特性     | 交叉类型 (`A & B`)     | 联合类型 (`A \| B`)        |
| -------- | ---------------------- | -------------------------- |
| 逻辑     | "且"（同时满足）       | "或"（满足其一）           |
| 属性     | 包含 A 和 B 的所有属性 | 只能访问 A 和 B 的共有属性 |
| 用途     | 组合能力（Mixins）     | 表示多态（状态、可选值）   |
| 实例化   | 需提供所有属性         | 只需满足一种形态           |
| 典型场景 | 扩展对象、混入         | 状态机、可空值、多类型参数 |

```ts
type A = { x: string }
type B = { y: number }

// 交叉类型：必须同时有 x 和 y
const c: A & B = { x: 'hi', y: 42 }

// 联合类型：可以只有 x 或只有 y
const u1: A | B = { x: 'hi' }
const u2: A | B = { y: 42 }
```

## 5. 🤔 同名属性如何处理？

- 情况 1：属性类型兼容 → 合并为更具体的类型

```ts
type A = { prop: string }
type B = { prop: 'hello' } // "hello" 是 string 的子类型

type C = A & B // { prop: "hello" }
```

- 情况 2：属性类型冲突 → 得到 `never`

```ts
type A = { prop: string }
type B = { prop: number }

type C = A & B // { prop: never } → 整个类型可能无法实例化
```

## 6. 🤔 函数如何处理？

- 函数也会被合并，定义函数时必须满足所有签名。

```ts
type Callable1 = (x: string) => void
type Callable2 = (x: number) => void

type Both = Callable1 & Callable2

// ❌ 错误写法
// const fn: Both = (x: string) => { ... } // ❌ 因为 x 也有可能是 number 类型
// const fn: Both = (x: number) => { ... } // ❌ 因为 x 也有可能是 string 类型

// ✅ 正确
// x 满足了所有的签名。
const fn: Both = (x: string | number) => {
  if (typeof x === 'string') {
    // handle string
  } else {
    // handle number
  }
}

fn('hello') // ✅
fn(42) // ✅
```

## 7. 🤔 交叉类型有哪些典型应用场景？

### 7.1. 混入（Mixins）—— 组合行为

```ts
interface Flyable {
  fly(): void
}

interface Swimmable {
  swim(): void
}

type Duck = { name: string } & Flyable & Swimmable

class MallardDuck implements Duck {
  name = 'Mallard'
  fly() {
    console.log('Flying!')
  }
  swim() {
    console.log('Swimming!')
  }
}
```

### 7.2. 扩展接口（比 `extends` 更灵活）

```ts
type BaseUser = {
  id: string
  email: string
}

type AdminPermissions = {
  role: 'admin'
  canDelete: boolean
}

// 创建 AdminUser 类型
type AdminUser = BaseUser & AdminPermissions

const admin: AdminUser = {
  id: '1',
  email: 'admin@example.com',
  role: 'admin',
  canDelete: true,
}
```

### 7.3. 高阶函数与泛型中的约束

```ts
function extend<T, U>(first: T, second: U): T & U {
  return { ...first, ...second }
}

const person = extend({ name: 'Alice' }, { age: 30 })
// person 类型：{ name: string } & { age: number }
```

### 7.4. 与工具类型结合（如 `Omit`, `Pick`）

```ts
// 为对象添加一个固定属性
type WithId<T> = T & { id: string }

type User = { name: string; email: string }
type UserWithId = WithId<User> // { name: string; email: string; id: string }
```

## 8. 🤔 使用交叉类型时需要注意哪些问题？

### 8.1. 同名属性冲突

```ts
type X = { a: string };
type Y = { a: number };
type Z = X & Y; // { a: never }

const z: Z = { a: ??? }; // 无法创建合法实例！
```

### 8.2. 不要滥用交叉原始类型

```ts
type Bad = string & number // never
```

这没有实际意义，因为原始类型互斥。

### 8.3. 交叉类型 ≠ 对象合并

交叉类型是编译期概念，不处理运行时对象合并逻辑：

```ts
function merge<A, B>(a: A, b: B): A & B {
  return { ...a, ...b } // 这只是浅拷贝，可能丢失方法或原型链
}
```

### 8.4. 可辨识联合中慎用交叉

在状态建模中，通常用联合类型而非交叉类型：

```ts
// ✅ 正确：状态是互斥的
type State = { type: 'loading' } | { type: 'success'; data: string }

// ❌ 错误：交叉类型要求同时满足 loading 和 success
type WrongState = { type: 'loading' } & { type: 'success'; data: string } // type: never
```

## 9. 🤔 交叉类型有哪些高级技巧？

### 9.1. 条件类型中的交叉

```ts
type FlattenIfArray<T> = T extends any[] ? T[number] : T
type Mixed = FlattenIfArray<string[]> & number // string & number → never
```

### 9.2. 创建"必填"版本的可选属性

```ts
type RequiredUser = User & { name: string; email: string }
// 如果 User 中 name 是可选的，这里强制它必须存在
```

### 9.3. 与映射类型结合

```ts
type ReadonlyAndPartial<T> = Readonly<T> & Partial<T>
// 虽然逻辑上矛盾，但语法合法（实际效果以更严格的为准）
```
