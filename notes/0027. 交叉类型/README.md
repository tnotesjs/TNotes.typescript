# [0027. 交叉类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0027.%20%E4%BA%A4%E5%8F%89%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 什么是交叉类型？](#3-什么是交叉类型)
- [4. 交叉类型 vs. 联合类型](#4-交叉类型-vs-联合类型)
- [5. 同名属性如何交叉？](#5-同名属性如何交叉)
- [6. 函数如何交叉？](#6-函数如何交叉)
- [7. 交叉类型有哪些典型应用场景？](#7-交叉类型有哪些典型应用场景)
- [8. 使用交叉类型时需要注意的问题主要是？](#8-使用交叉类型时需要注意的问题主要是)
- [9. 同名属性的修饰符如何交叉？【TODO】](#9-同名属性的修饰符如何交叉todo)
- [10. 引用](#10-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 交叉类型（Intersection Types）

## 2. 评价

- 交叉类型表示“且” - 同时满足 A、B、C
- 联合类型表示“或” - 满足 A 或 B 或 C
- 交叉类型使用的时候需要注意，别交叉出 never，这么做通常都是毫无意义的。

## 3. 什么是交叉类型？

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

## 4. 交叉类型 vs. 联合类型

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

## 5. 同名属性如何交叉？

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

## 6. 函数如何交叉？

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

## 7. 交叉类型有哪些典型应用场景？

::: code-group

```ts [1]
// 混入（Mixins）—— 组合行为
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

```ts [2]
// 	扩展接口（比 extends 更灵活）
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

```ts [3]
// 高阶函数与泛型中的约束
function extend<T, U>(first: T, second: U): T & U {
  return { ...first, ...second }
}

const person = extend({ name: 'Alice' }, { age: 30 })
// person 类型：{ name: string } & { age: number }
```

```ts [4]
// 与工具类型结合（如 Omit, Pick）

// 为对象添加一个固定属性
type WithId<T> = T & { id: string }

type User = { name: string; email: string }
type UserWithId = WithId<User> // { name: string; email: string; id: string }
```

```ts [5]
// 条件类型中的交叉
type FlattenIfArray<T> = T extends any[] ? T[number] : T
type ItemType_1 = FlattenIfArray<string[]> // string
type ItemType_2 = FlattenIfArray<number> // number
```

```ts [6]
// 创建"必填"版本的可选属性
type User = {
  name?: string
  email?: string
  age?: number
  isAdmin?: boolean
  createdAt?: Date
  updatedAt?: Date
}
// 在 User 中 name、email 是可选的

type RequiredUser = User & { name: string; email: string }
// 交叉之后得到的 RequiredUser 强制要求 name 和 email 是必须存在的

const u1: RequiredUser = {
  // 如果没有 name 和 email，那么会报错
  name: 'Tdahuyou',
  email: 'dahuyou_top@163.com',
}

const u2: User = {
  // 可以为空，因为 User 的所有属性都是可选的。
}
```

```ts [7]
// 与映射类型结合
type ReadonlyAndPartial<T> = Readonly<T> & Partial<T>
// 虽然逻辑上矛盾，但语法合法（实际效果以更严格的为准）
// - Readonly<T> 要求所有属性都是只读的
// - Partial<T> 要求所有属性都是可选的

interface User {
  name: string
  age: number
}

type UserReadonlyAndPartial = ReadonlyAndPartial<User>
// 等价于：
// {
//   readonly name?: string;
//   readonly age?: number;
// }

const user: UserReadonlyAndPartial = {
  name: 'Alice', // 可选且只读
  // age 可以省略
}

// user.name = "Bob"; // ❌ 错误！属性是只读的
```

:::

## 8. 使用交叉类型时需要注意的问题主要是？

一句话总结 —— 就是别交叉出 never。

- 同名属性冲突。

```ts
type X = { a: string };
type Y = { a: number };
type Z = X & Y; // { a: never }

const z: Z = { a: ??? }; // 无法创建合法实例！
```

- 不要滥用交叉原始类型，这没有实际意义，因为原始类型互斥。

```ts
type Bad = string & number // never
```

- 可辨识联合中慎用交叉，在状态建模中，通常用联合类型而非交叉类型：

```ts
// ✅ 正确：状态是互斥的
type State = { type: 'loading' } | { type: 'success'; data: string }

// ❌ 错误：交叉类型要求同时满足 loading 和 success
type WrongState = { type: 'loading' } & { type: 'success'; data: string } // type: never
```

## 9. 同名属性的修饰符如何交叉？【TODO】

::: warning 叠甲

- 注意，demo 中的解释说明，是根据最终测试的行为表现来倒推的，无佐证依据。
- 可复制 demo 丢到 [TS Playground][1] 中自行测试。

:::

```ts
// 修饰符冲突示例
type ReadonlyAndPartial<T> = Readonly<T> & Partial<T>
// - Readonly<T> 要求所有属性只读
// - Partial<T> 要求所有属性可选

interface User {
  name: string
  age: number
}

type UserReadonlyAndPartial = ReadonlyAndPartial<User> // 【1】
// type UserReadonlyAndPartial = { readonly name: string; readonly age: number } & { name?: string; age?: number } // 【2】行为表现同【1】

// 【1】推断结果：
// type UserReadonlyAndPartial = Readonly<User> & Partial<User>
// 展开后相当于：{ readonly name: string; readonly age: number } & { name?: string; age?: number }

// ❌ 【1】错误的理解：
// type UserReadonlyAndPartial = {
//   readonly name?: string;
//   readonly age?: number;
// }

// ✅ 【1】正确理解：
// type UserReadonlyAndPartial = {
//   name: string;
//   age: number;
// }

// TypeScript 在交叉类型中会合并属性类型，但不会合并修饰符为 readonly + ? 这种组合（属性即是只读、又是可选）。
// 从最终的行为表现来看，TS 是直接将修饰符给丢弃了，只读约束和可选约束都没有起到作用。

// ⚠️ 以下是根据最终行为表现的猜测（没读过 tsc 完整源码）：
// 更像是取了修饰符「readonly 只读」、「? 可选」中的共同“特性”
// 只读是 Readonly<T> 特有的“特性”
// 可选是 Partial<T> 特有的“特性”
// 两者之间的交集 ∩，自然就是既不只读、也不可选

// 丢弃 Partial<T>
const user: UserReadonlyAndPartial = {
  // name，age 都不可以省略
  name: 'Foo',
  age: 18,
}

// ❌ 比如，如果省略 age，那么会报错：
// Type '{ name: string; }' is not assignable to type 'UserReadonlyAndPartial'.
// Property 'age' is missing in type '{ name: string; }' but required in type 'Readonly<User>'.(2322)

// 丢弃 Readonly<T>
// 这里不会报错（readonly 未被严格应用）
user.name = 'Bob' // ✅ 可修改（行为宽松）
```

---

以下是 deepwiki 的 Q&A 记录

https://deepwiki.com/search/-type-readonlyandpartialt-read_a096601d-5e4e-40e4-a992-6f483462739a

::: code-group

<<< ./assets/questions/1/a.md [A]

<<< ./assets/questions/1/q.md [Q]

:::

## 10. 引用

- [TS Playground][1]

[1]: https://www.typescriptlang.org/play/?ts=5.9.3#code/Q
