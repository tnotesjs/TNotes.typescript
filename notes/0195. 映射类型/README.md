# [0195. 映射类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0195.%20%E6%98%A0%E5%B0%84%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 映射类型是什么？](#3--映射类型是什么)
- [4. 🤔 映射类型修饰符有哪些？](#4--映射类型修饰符有哪些)
- [5. 🤔 键名重映射是什么？](#5--键名重映射是什么)
- [6. 🤔 同态映射是什么？](#6--同态映射是什么)
- [7. 🤔 在映射类型中，`never` 键会被如何处理？](#7--在映射类型中never-键会被如何处理)
- [8. 🔍 TS 内置映射类型的实现原理](#8--ts-内置映射类型的实现原理)
- [9. 🔗 引用](#9--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 映射类型的基本概念和语法
- 映射类型的修饰符
- 键名重映射（Key Remapping）
- 同态映射类型（homomorphic mapped type）

## 2. 🫧 评价

TS 中的映射类型是类型系统中的一种基于旧类型创建新类型的机制。

本节介绍的相关知识点是自定义 TS 类型工具的基础。

## 3. 🤔 映射类型是什么？

映射类型允许基于旧类型创建新类型，通过遍历键来转换属性。

- 映射类型使用 `[K in Keys]: Type` 语法遍历键并转换类型
- 支持 `readonly` 和可选 `?` 修饰符的添加和移除
- TypeScript 4.1+ 支持键名重映射（`as` 子句）
- 映射类型是实现 `Readonly`、`Partial`、`Required` 等 TS 内置工具类型的基础
  - 你会发现本节提到的一些 TS 的内置工具类型的实现其实都非常简单，即便 TS 没有给我们提供这些工具类型，也完全可以自行封装它们
- 可以与条件类型、模板字面量类型等特性结合使用

```ts
// 基本语法：{ [K in Keys]: Type }

// 各部分说明：
// K：类型变量，代表当前遍历到的键
// in：遍历操作符
// Keys：要遍历的键的联合类型
// Type：新类型中该键对应的值类型

// 核心流程：
// 1. 遍历：遍历类型的所有键
// 2. 转换：对每个键的值类型进行转换
// 3. 生成：生成一个全新的类型

type Keys = 'a' | 'b' | 'c'

type Mapped = {
  [K in Keys]: string
}
// type Mapped = {
//   a: string;
//   b: string;
//   c: string;
// }

// 可以使用 keyof 遍历对象键：
interface Person {
  name: string
  age: number
}

type StringPerson = {
  [K in keyof Person]: string
}
// type StringPerson = {
//   name: string;
//   age: string;
// }
```

## 4. 🤔 映射类型修饰符有哪些？

1. `+readonly` 添加 readonly（`+` 号可以省略）
2. `-readonly` 移除 readonly
3. `+?` 添加可选（`+` 号可以省略）
4. `-?` 移除可选

::: code-group

```ts [1]
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K]
}

interface Mutable {
  x: number
  y: number
}

type Immutable = MyReadonly<Mutable>
// type Immutable = {
//     readonly x: number;
//     readonly y: number;
// }

const point: Immutable = { x: 10, y: 20 }
point.x = 30 // ❌ Error 无法分配到 "x" ，因为它是只读属性
// Cannot assign to 'x' because it is a read-only property.(2540)

// MyReadonly 和 TS 内置的工具类型 Readonly 的定义是一样的
// type Readonly<T> = { readonly [P in keyof T]: T[P]; }
type Immutable2 = Readonly<Mutable>
// type Immutable2 = {
//     readonly x: number;
//     readonly y: number;
// }

const point2: Immutable = { x: 10, y: 20 }
point2.x = 30 // ❌ Error 无法分配到 "x" ，因为它是只读属性
// Cannot assign to 'x' because it is a read-only property.(2540)
```

```ts [2]
type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}

interface ReadonlyPoint {
  readonly x: number
  readonly y: number
}

type MutablePoint = Mutable<ReadonlyPoint>
// type MutablePoint = {
//     x: number;
//     y: number;
// }

const point: MutablePoint = { x: 10, y: 20 }
point.x = 30 // ✅ OK
```

```ts [3]
// TS 内置的工具类型 Partial 的定义：
// type Partial<T> = { [P in keyof T]?: T[P] | undefined; }

interface Todo {
  title: string
  description: string
  completed: boolean
}

type PartialTodo = Partial<Todo>
// type PartialTodo = {
//     title?: string | undefined;
//     description?: string | undefined;
//     completed?: boolean | undefined;
// }

const todo: PartialTodo = { title: 'Learn TypeScript' } // ✅ OK
```

```ts [4]
// TS 内置的工具类型 Required 的定义：
// type Required<T> = { [P in keyof T]-?: T[P]; }

interface Config {
  host?: string
  port?: number
}

type RequiredConfig = Required<Config>
// type RequiredConfig = {
//   host: string;
//   port: number;
// }

const config: RequiredConfig = { host: 'localhost' } // ❌ Error 缺少 port
// Property 'port' is missing in type '{ host: string; }' but required in type 'Required<Config>'.(2741)
```

:::

可以同时使用多个修饰符：

```ts
// 移除 readonly 和可选
type Concrete<T> = {
  -readonly [K in keyof T]-?: T[K]
}

interface MixedProps {
  readonly id?: number
  readonly name?: string
  age?: number
}

type ConcreteProps = Concrete<MixedProps>
// type ConcreteProps = {
//   id: number;
//   name: string;
//   age: number;
// }
```

## 5. 🤔 键名重映射是什么？

TypeScript 4.1+ 支持使用 `as` 子句重新映射键名。

语法结构：

```ts
type MappedType = {
  [K in Keys as NewKey]: ValueType
}
// 各部分说明：
// K：原始键名的类型变量
// in Keys：要遍历的键的联合类型
// as NewKey：新的键名表达式
// ValueType：新类型中该键对应的值类型
```

基本示例：

```ts
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
}

interface Person {
  name: string
  age: number
}

type PersonGetters = Getters<Person>
// type PersonGetters = {
//   getName: () => string;
//   getAge: () => number;
// }
```

常见用法：

1. 过滤属性 - 使用 `as` 子句结合条件类型过滤属性
2. 过滤属性 - 移除特定属性
3. 属性名转换 - 添加前缀
4. 属性名转换 - 转换命名风格

::: code-group

```ts [1]
// 过滤掉值为 never 的键
type OmitByType<T, ValueType> = {
  [K in keyof T as T[K] extends ValueType ? never : K]: T[K]
}

interface Mixed {
  id: number
  name: string
  age: number
  active: boolean
}

type NonNumber = OmitByType<Mixed, number>
// type NonNumber = {
//   name: string;
//   active: boolean;
// }
```

```ts [2]
type OmitKeys<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P]
}

interface User {
  id: number
  name: string
  password: string
  email: string
}

type PublicUser = OmitKeys<User, 'password'>
// type PublicUser = {
//   id: number;
//   name: string;
//   email: string;
// }
```

```ts [3]
type AddPrefix<T, Prefix extends string> = {
  [K in keyof T as `${Prefix}${string & K}`]: T[K]
}

interface Actions {
  click: () => void
  hover: () => void
}

type OnActions = AddPrefix<Actions, 'on'>
// type OnActions = {
//   onclick: () => void;
//   onhover: () => void;
// }
```

```ts [4]
type CamelToSnake<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T> ? '_' : ''}${Lowercase<T>}${CamelToSnake<U>}`
  : S

type SnakeCase<T> = {
  [K in keyof T as CamelToSnake<string & K>]: T[K]
}

interface CamelCase {
  firstName: string
  lastName: string
  phoneNumber: string
}

type SnakeCaseObj = SnakeCase<CamelCase>
// type SnakeCaseObj = {
//   first_name: string;
//   last_name: string;
//   phone_number: string;
// }
```

:::

注意：`as` 子句必须产生 `string | number | symbol` 类型。

```ts
// ❌ 错误：键的类型不合法
type Wrong<T> = {
  [K in keyof T as K extends string ? object : never]: T[K]
}
// 报错信息如下：
// Type 'K extends string ? object : never' is not assignable to type 'string | number | symbol'.
//   Type 'keyof T extends string ? object : never' is not assignable to type 'string | number | symbol'.
//     Type 'object' is not assignable to type 'string | number | symbol'.(2322)

// ✅ 正确：确保结果是有效的键类型
type Correct<T> = {
  [K in keyof T as K extends string ? `prefix_${K}` : never]: T[K]
}
```

## 6. 🤔 同态映射是什么？

同态映射（homomorphic mapped）是指映射类型会保留原类型的修饰符。

```ts
interface Optional {
  a?: number
  b: string
}

// 同态：保留可选修饰符
type Mapped1<T> = {
  [K in keyof T]: T[K]
}
type R1 = Mapped1<Optional>
// type R1 = {
//   a?: number | undefined; // ✅ 保留了可选
//   b: string;
// }

// 非同态：不保留
type Mapped2<T> = {
  [K in keyof T as K]: T[K]
}
type R2 = Mapped2<Optional>
// type R2 = {
//   a?: number | undefined; // ✅ 使用 as 后仍保留
//   b: string;
// }
```

## 7. 🤔 在映射类型中，`never` 键会被如何处理？

never 键会自动被过滤掉，可以自行封装过滤条件。

利用 never 键会自动过滤的特性能实现很多效果，以下是一些实际应用的示例：

1. 留下特定类型的字段
2. 留下必填的字段
3. 留下可选的字段
4. 留下不可能为 null 或 undefined 的字段
5. 按特定的前缀来过滤

::: code-group

```ts [1]
// 留下特定类型的字段
type FilterByValue<T, ValueType> = {
  [K in keyof T as T[K] extends ValueType ? K : never]: T[K]
}

interface Data {
  a: string
  b: number
  c: string
}

type StringOnly = FilterByValue<Data, string>
// type StringOnly = {
//   a: string;
//   c: string;
// }
// b 会被自动过滤掉
```

```ts [2]
// 留下必填的字段
type RequiredKeys<T> = {
  [K in keyof T as T[K] extends Required<T>[K] ? K : never]: T[K]
}

type User = {
  id: number
  name: string
  email?: string
  phone?: string
}

type OnlyRequired = RequiredKeys<User>
// type OnlyRequired = {
//     id: number;
//     name: string;
// }
```

```ts [3]
// 留下可选的字段
type OptionalKeys<T> = {
  [K in keyof T as T[K] extends Required<T>[K] ? never : K]: T[K]
}

type User = {
  id: number
  name: string
  email?: string
  phone?: string
}

type OnlyOptional = OptionalKeys<User>
// type OnlyOptional = {
//     email?: string | undefined;
//     phone?: string | undefined;
// }
```

```ts [4]
// 留下不可能为 null 或 undefined 的字段
type NonNullableProps<T> = {
  [K in keyof T as null extends T[K]
    ? never
    : undefined extends T[K]
    ? never
    : K]: T[K]
}

type Data = {
  a: string
  b: string | null
  c: string | undefined
  d: string | null | undefined
  e: number
}

type Result = NonNullableProps<Data>
// type Result = {
//     a: string;
//     e: number;
// }
```

```ts [5]
// 排除以特定前缀开头的键
type OmitByPrefix<T, Prefix extends string> = {
  [K in keyof T as K extends `${Prefix}${string}` ? never : K]: T[K]
}

type Model = {
  id: number
  _version: number
  name: string
  _internal: string
  email: string
  _metadata: object
}

type PublicProps = OmitByPrefix<Model, '_'>
// type PublicProps = {
//     id: number;
//     name: string;
//     email: string;
// }

// 只保留以特定前缀开头的键
type PickByPrefix<T, Prefix extends string> = {
  [K in keyof T as K extends `${Prefix}${string}` ? K : never]: T[K]
}

type PrivateProps = PickByPrefix<Model, '_'>
// type PrivateProps = {
//     _version: number;
//     _internal: string;
//     _metadata: object;
// }
```

:::

## 8. 🔍 TS 内置映射类型的实现原理

理解 TypeScript 内置映射类型的实现原理可以帮助我们更好地使用它们，并创建自己的工具类型。

本节介绍的类型映射的知识点的主要作用，也就是用来封装这些工具类型用的。

下面我们来简单看几个常见的工具类型：

```ts
type User = {
  id: number
  name: string
  email: string
}

// type Partial<T> = { [P in keyof T]?: T[P] | undefined; }
type PartialUser = Partial<User>
// type PartialUser = {
//     id?: number | undefined;
//     name?: string | undefined;
//     email?: string | undefined;
// }

// type Required<T> = { [P in keyof T]-?: T[P]; }
type RequiredUser = Required<Partial<User>>
// type RequiredUser = {
//     id: number;
//     name: string;
//     email: string;
// }

// type Readonly<T> = { readonly [P in keyof T]: T[P]; }
type ReadonlyUser = Readonly<User>
// type User = {
//     id: number;
//     name: string;
//     email: string;
// }

// type Pick<T, K extends keyof T> = { [P in K]: T[P]; }
type UserPreview = Pick<User, 'id' | 'name'>
// type UserPreview = {
//     id: number;
//     name: string;
// }

// type Omit<T, K extends keyof any> = { [P in Exclude<keyof T, K>]: T[P]; }
// type Exclude<T, U> = T extends U ? never : T
type UserWithoutEmail = Omit<User, 'email'>
// type UserWithoutEmail = {
//     id: number;
//     name: string;
// }

// type Record<K extends keyof any, T> = { [P in K]: T; }
type UserRoles = Record<'admin' | 'user' | 'guest', boolean>
// type UserRoles = {
//     admin: boolean;
//     user: boolean;
//     guest: boolean;
// }

// ... 类似的内置工具类型还有很多
// 仔细观察你会发现它们的实现原理其实就是比较简单的，并没有多么复杂的嵌套结构
```

## 9. 🔗 引用

- [TypeScript Handbook - Mapped Types][1]
- [TypeScript 4.1 Release Notes - Key Remapping in Mapped Types][2]
- [TypeScript Handbook - Utility Types][3]
- [wikipedia - Homomorphism 同态映射][4]
- [stackoverflow - What does "homomorphic mapped type" mean?][5]
- [Improved control over mapped type modifiers #21919][6]

[1]: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
[2]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#key-remapping-in-mapped-types
[3]: https://www.typescriptlang.org/docs/handbook/utility-types.html
[4]: https://en.wikipedia.org/wiki/Homomorphism
[5]: https://stackoverflow.com/questions/59790508/what-does-homomorphic-mapped-type-mean
[6]: https://github.com/microsoft/TypeScript/pull/21919
