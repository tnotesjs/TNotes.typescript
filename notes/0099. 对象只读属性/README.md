# [0099. 对象只读属性](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0099.%20%E5%AF%B9%E8%B1%A1%E5%8F%AA%E8%AF%BB%E5%B1%9E%E6%80%A7)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 什么是只读属性？](#3-什么是只读属性)
  - [3.1. 初始化时赋值](#31-初始化时赋值)
  - [3.2. 浅只读](#32-浅只读)
  - [3.3. 运行时行为](#33-运行时行为)
- [4. 如何声明只读属性？](#4-如何声明只读属性)
- [5. 如何将对象类型的所有属性变为只读？](#5-如何将对象类型的所有属性变为只读)
- [6. 如何实现深层只读？](#6-如何实现深层只读)
  - [6.1. 做法 1：手写类型工具](#61-做法-1手写类型工具)
  - [6.2. 做法 2：使用 `as const` 断言](#62-做法-2使用-as-const-断言)
- [7. 引用](#7-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 只读属性的定义和语法
- readonly 修饰符
- Readonly 工具类型
- 深层只读的实现

## 2. 评价

只读属性（Readonly Property）使用 `readonly` 修饰符，表示属性初始化后不能被修改。这是 TypeScript 提供的不可变性保障。

只读属性的特点：

- 编译时检查：防止意外修改
- 初始化后不可变：只能在声明或构造函数中赋值
- 浅只读：只保护属性本身，不保护嵌套对象
- 类型层面：运行时仍可修改

## 3. 什么是只读属性？

只读属性使用 `readonly` 修饰符，表示属性不能被重新赋值。

- 初始化：只能在对象创建时或构造函数中赋值，一旦赋值就不能修改
- 编译时检查：只在 TypeScript 编译时有效
- 浅只读：不影响嵌套对象的属性

### 3.1. 初始化时赋值

```ts
// 对象字面量初始化
interface Config {
  readonly port: number
}

const config: Config = {
  port: 3000, // 初始化时赋值
}

// 类构造函数初始化
class Server {
  readonly port: number

  constructor(port: number) {
    this.port = port // 构造函数中赋值
  }
}
```

只读属性可以与可选属性结合，但也必须在初始化时完成赋值，赋值操作不允许滞后。

```ts
// 只读 + 可选
interface Config {
  readonly apiUrl: string
  readonly timeout?: number
}

const config: Config = {
  apiUrl: 'https://api.example.com',
  // timeout 可选
}

config.apiUrl = 'new url' // ❌ Error
config.timeout = 5000 // ❌ Error: 即使可选，一旦初始化就是只读
```

### 3.2. 浅只读

```ts
// ⚠️ readonly 是浅层的
interface User {
  readonly profile: {
    name: string
    age: number
  }
}

const user: User = {
  profile: {
    name: 'Alice',
    age: 25,
  },
}

user.profile = { name: 'Bob', age: 30 } // ❌ Error: 不能重新赋值整个对象
user.profile.name = 'Bob' // ✅ 可以修改嵌套属性
user.profile.age = 30 // ✅ 可以修改嵌套属性
```

### 3.3. 运行时行为

```ts
// ⚠️ readonly 只在编译时有效
interface Point {
  readonly x: number
  readonly y: number
}

const point: Point = { x: 10, y: 20 }
point.x = 30 // ❌ 编译时会报错

// TS 编译后得到的 JS：
// const point = { x: 10, y: 20 }
// point.x = 30 // ✅ JS 运行时可以修改

// 可以使用 Object.freeze 实现真正的不可变
const frozenPoint = Object.freeze({ x: 10, y: 20 })
// TS 类型推断的结果：
// const frozenPoint: Readonly<{
//     x: 10;
//     y: 20;
// }>
frozenPoint.x = 30 // ❌ 编译时和运行时都会报错
```

## 4. 如何声明只读属性？

对象的只读属性可以声明在多个位置，比如：

1. 在接口中的只读属性
2. 在类型别名中的只读属性
3. 在类中的只读属性
4. 在索引签名中的只读属性

::: code-group

```ts [1]
// ✅ 接口中使用 readonly
interface Point {
  readonly x: number
  readonly y: number
}

const point: Point = { x: 10, y: 20 }
point.x = 30 // ❌ Error: Cannot assign to 'x' because it is a read-only property
```

```ts [2]
// ✅ 类型别名中使用 readonly
type Config = {
  readonly apiUrl: string
  readonly timeout: number
}

const config: Config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
}

config.timeout = 3000 // ❌ Error
```

```ts [3]
// ✅ 类中的只读属性
class User {
  readonly id: number
  name: string

  constructor(id: number, name: string) {
    this.id = id // ✅ 构造函数中可以赋值
    this.name = name
  }

  updateId(newId: number) {
    this.id = newId // ❌ Error: Cannot assign to 'id'
  }
}

const user = new User(1, 'Alice')
user.id = 2 // ❌ Error
```

```ts [4]
// ✅ 只读索引签名
interface ReadonlyStringMap {
  readonly [key: string]: string
}

const map: ReadonlyStringMap = {
  name: 'Alice',
  role: 'Admin',
}

map.name = 'Bob' // ❌ Error
map.age = '25' // ❌ Error: Index signature in type 'ReadonlyStringMap' only permits reading
```

:::

## 5. 如何将对象类型的所有属性变为只读？

可以使用 Readonly 工具类型将对象类型的所有属性变为只读。

```ts
// Readonly<T> 将所有属性变为只读
interface User {
  name: string
  age: number
  email: string
}

type ReadonlyUser = Readonly<User>
// 等价于
// type ReadonlyUser = {
//   readonly name: string
//   readonly age: number
//   readonly email: string
// }

// 使用
const user: ReadonlyUser = {
  name: 'Alice',
  age: 25,
  email: 'alice@example.com',
}

user.name = 'Bob' // ❌ Error
```

其实 Readonly 的实现非常简单：

```ts
type Readonly<T> = { readonly [P in keyof T]: T[P] }
```

从 Readonly 的实现不难看出，它提供的只读约束也是浅层的只读约束。

```ts
// Readonly<T> 是浅层的
interface User {
  name: string
  profile: {
    age: number
    city: string
  }
}

type ReadonlyUser = Readonly<User>

const user: ReadonlyUser = {
  name: 'Alice',
  profile: {
    age: 25,
    city: 'New York',
  },
}

user.name = 'Bob' // ❌ Error
user.profile = { age: 30, city: 'LA' } // ❌ Error
user.profile.age = 30 // ✅ 可以修改嵌套属性
```

和其它类型工具结合实现，也可以实现部分只读的效果：

```ts
interface User {
  id: number
  name: string
  email: string
}

// 实现部分只读的效果：
type UserWithReadonlyId_1 = Readonly<Pick<User, 'id'>> & Omit<User, 'id'>
// 等价于
// type UserWithReadonlyId_1 = {
//   readonly id: number
//   name: string
//   email: string
// }

// 或自定义工具类型
type PartialReadonly<T, K extends keyof T> = Readonly<Pick<T, K>> & Omit<T, K>
type UserWithReadonlyId_2 = PartialReadonly<User, 'id'>
```

## 6. 如何实现深层只读？

### 6.1. 做法 1：手写类型工具

```ts
// 递归深层只读
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

interface User {
  name: string
  profile: {
    age: number
    address: {
      city: string
      country: string
    }
  }
}

type ReadonlyUser = DeepReadonly<User>

const user: ReadonlyUser = {
  name: 'Alice',
  profile: {
    age: 25,
    address: {
      city: 'New York',
      country: 'USA',
    },
  },
}

user.name = 'Bob' // ❌ Error
user.profile.age = 30 // ❌ Error
user.profile.address.city = 'LA' // ❌ Error
```

完善数组和函数的处理：

```ts
// 完整的深层只读
type DeepReadonly<T> = T extends (infer R)[]
  ? ReadonlyArray<DeepReadonly<R>>
  : T extends Function
    ? T
    : T extends object
      ? { readonly [P in keyof T]: DeepReadonly<T[P]> }
      : T

interface Data {
  items: Array<{
    id: number
    tags: string[]
  }>
  process: (x: number) => number
}

type ReadonlyData = DeepReadonly<Data>
// TS 类型推断结果：
// type ReadonlyData = {
//     readonly items: readonly {
//         readonly id: number;
//         readonly tags: readonly string[];
//     }[];
//     readonly process: (x: number) => number;
// }
```

### 6.2. 做法 2：使用 `as const` 断言

```ts
const user = {
  name: 'Alice',
  profile: {
    age: 25,
    address: {
      city: 'New York',
      country: 'USA',
    },
  },
} as const
// TS 类型推断结果：
// const user: {
//     readonly name: "Alice";
//     readonly profile: {
//         readonly age: 25;
//         readonly address: {
//             readonly city: "New York";
//             readonly country: "USA";
//         };
//     };
// }

user.name = 'Bob' // ❌ Error
user.profile.age = 30 // ❌ Error
user.profile.address.city = 'LA' // ❌ Error
```

## 7. 引用

- [TypeScript Handbook - readonly][1]
- [TypeScript Handbook - Readonly Utility Type][2]
- [TypeScript Deep Dive - readonly][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties
[2]: https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype
[3]: https://basarat.gitbook.io/typescript/type-system/readonly
