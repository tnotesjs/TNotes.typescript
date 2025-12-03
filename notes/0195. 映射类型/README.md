# [0195. 映射类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0195.%20%E6%98%A0%E5%B0%84%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是映射类型？](#3--什么是映射类型)
  - [3.1. 基本语法](#31-基本语法)
  - [3.2. 工作原理](#32-工作原理)
- [4. 🤔 映射类型修饰符有哪些？](#4--映射类型修饰符有哪些)
  - [4.1. readonly 修饰符](#41-readonly-修饰符)
  - [4.2. 可选修饰符](#42-可选修饰符)
  - [4.3. 添加和移除修饰符](#43-添加和移除修饰符)
- [5. 🤔 如何使用键名重映射？](#5--如何使用键名重映射)
  - [5.1. as 子句](#51-as-子句)
  - [5.2. 过滤属性](#52-过滤属性)
  - [5.3. 属性名转换](#53-属性名转换)
- [6. 🤔 映射类型的实际应用](#6--映射类型的实际应用)
  - [6.1. 实现工具类型](#61-实现工具类型)
  - [6.2. 类型转换](#62-类型转换)
  - [6.3. 条件映射](#63-条件映射)
- [7. 🤔 映射类型有哪些注意事项？](#7--映射类型有哪些注意事项)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 映射类型的基本概念和语法
- 映射类型的修饰符使用
- 键名重映射（Key Remapping）
- 映射类型的实际应用场景
- 使用注意事项和最佳实践

## 2. 🫧 评价

这篇笔记全面介绍了 TypeScript 中的映射类型，这是类型系统中创建新类型的强大工具。

- 映射类型使用 `[K in Keys]: Type` 语法遍历键并转换类型
- 支持 `readonly` 和可选 `?` 修饰符的添加和移除
- TypeScript 4.1+ 支持键名重映射（`as` 子句）
- 映射类型是实现 `Partial`、`Required`、`Readonly`、`Pick` 等工具类型的基础
- 可以与条件类型、模板字面量类型等特性结合使用
- 理解映射类型是编写高级类型工具的关键

## 3. 🤔 什么是映射类型？

### 3.1. 基本语法

映射类型允许基于旧类型创建新类型，通过遍历键来转换属性。

```ts
// 基本语法：{ [K in Keys]: Type }

type Keys = 'a' | 'b' | 'c'

type Mapped = {
  [K in Keys]: string
}
// type Mapped = {
//   a: string;
//   b: string;
//   c: string;
// }
```

使用 keyof 遍历对象键：

```ts
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

### 3.2. 工作原理

映射类型的执行过程：

```ts
// 1. 获取键的联合类型
type Keys = keyof Person // 'name' | 'age'

// 2. 遍历每个键
// K = 'name'  → name: string
// K = 'age'   → age: string

// 3. 创建新对象类型
type Result = {
  name: string
  age: string
}
```

保留原类型：

```ts
type Clone<T> = {
  [K in keyof T]: T[K]
}

interface User {
  id: number
  name: string
  email: string
}

type ClonedUser = Clone<User>
// type ClonedUser = {
//   id: number;
//   name: string;
//   email: string;
// }
```

## 4. 🤔 映射类型修饰符有哪些？

### 4.1. readonly 修饰符

添加 readonly：

```ts
type Readonly<T> = {
  readonly [K in keyof T]: T[K]
}

interface Mutable {
  x: number
  y: number
}

type Immutable = Readonly<Mutable>
// type Immutable = {
//   readonly x: number;
//   readonly y: number;
// }

const point: Immutable = { x: 10, y: 20 }
point.x = 30 // ❌ 错误：无法分配到 "x" ，因为它是只读属性
```

移除 readonly：

```ts
type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}

interface ReadonlyPoint {
  readonly x: number
  readonly y: number
}

type MutablePoint = Mutable<ReadonlyPoint>
// type MutablePoint = {
//   x: number;
//   y: number;
// }

const point: MutablePoint = { x: 10, y: 20 }
point.x = 30 // ✅ 可以修改
```

### 4.2. 可选修饰符

添加可选：

```ts
type Partial<T> = {
  [K in keyof T]?: T[K]
}

interface Todo {
  title: string
  description: string
  completed: boolean
}

type PartialTodo = Partial<Todo>
// type PartialTodo = {
//   title?: string;
//   description?: string;
//   completed?: boolean;
// }

const todo: PartialTodo = { title: 'Learn TypeScript' } // ✅
```

移除可选：

```ts
type Required<T> = {
  [K in keyof T]-?: T[K]
}

interface Config {
  host?: string
  port?: number
}

type RequiredConfig = Required<Config>
// type RequiredConfig = {
//   host: string;
//   port: number;
// }

const config: RequiredConfig = { host: 'localhost' } // ❌ 缺少 port
```

### 4.3. 添加和移除修饰符

同时使用多个修饰符：

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

修饰符的符号：

```ts
// + 表示添加修饰符（默认行为）
type AddReadonly<T> = {
  +readonly [K in keyof T]: T[K]
}

// - 表示移除修饰符
type RemoveReadonly<T> = {
  -readonly [K in keyof T]: T[K]
}

// 可选修饰符同理
type AddOptional<T> = {
  [K in keyof T]+?: T[K]
}

type RemoveOptional<T> = {
  [K in keyof T]-?: T[K]
}
```

## 5. 🤔 如何使用键名重映射？

### 5.1. as 子句

TypeScript 4.1+ 支持使用 `as` 子句重新映射键名。

```ts
// 语法：[K in Keys as NewK]: Type

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

### 5.2. 过滤属性

使用 `as` 子句结合条件类型过滤属性：

```ts
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

移除特定属性：

```ts
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

### 5.3. 属性名转换

添加前缀：

```ts
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

转换命名风格：

```ts
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

## 6. 🤔 映射类型的实际应用

### 6.1. 实现工具类型

Pick 的实现：

```ts
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}

interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'>
// type TodoPreview = {
//   title: string;
//   completed: boolean;
// }
```

Record 的实现：

```ts
type MyRecord<K extends keyof any, T> = {
  [P in K]: T
}

type PageInfo = MyRecord<
  'home' | 'about' | 'contact',
  { title: string; url: string }
>
// type PageInfo = {
//   home: { title: string; url: string };
//   about: { title: string; url: string };
//   contact: { title: string; url: string };
// }
```

### 6.2. 类型转换

深度只读：

```ts
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? T[K] extends (...args: any[]) => any
      ? T[K]
      : DeepReadonly<T[K]>
    : T[K]
}

interface Nested {
  user: {
    profile: {
      name: string
      age: number
    }
  }
}

type ReadonlyNested = DeepReadonly<Nested>
// type ReadonlyNested = {
//   readonly user: {
//     readonly profile: {
//       readonly name: string;
//       readonly age: number;
//     };
//   };
// }
```

类型值包装：

```ts
type Boxed<T> = {
  [K in keyof T]: { value: T[K] }
}

interface Data {
  x: number
  y: string
}

type BoxedData = Boxed<Data>
// type BoxedData = {
//   x: { value: number };
//   y: { value: string };
// }
```

### 6.3. 条件映射

根据类型条件转换：

```ts
type Nullish<T> = {
  [K in keyof T]: T[K] extends object ? T[K] | null : T[K]
}

interface User {
  name: string
  profile: {
    avatar: string
  }
}

type NullableUser = Nullish<User>
// type NullableUser = {
//   name: string;
//   profile: { avatar: string } | null;
// }
```

提取特定类型的属性：

```ts
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never
}[keyof T]

type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>

interface Example {
  id: number
  getName(): string
  setName(name: string): void
  age: number
}

type ExampleFunctions = FunctionProperties<Example>
// type ExampleFunctions = {
//   getName: () => string;
//   setName: (name: string) => void;
// }
```

## 7. 🤔 映射类型有哪些注意事项？

1. 映射类型是同态的

同态映射会保留原类型的修饰符：

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
//   a?: number;  // ✅ 保留了可选
//   b: string;
// }

// 非同态：不保留
type Mapped2<T> = {
  [K in keyof T as K]: T[K]
}
type R2 = Mapped2<Optional>
// type R2 = {
//   a?: number;  // 使用 as 后仍保留
//   b: string;
// }
```

2. 键名重映射的限制

```ts
// ❌ 错误：as 子句必须产生字符串、数字或 symbol 类型
type Wrong<T> = {
  [K in keyof T as T[K]]: string // 错误
}

// ✅ 正确：确保结果是有效的键类型
type Correct<T> = {
  [K in keyof T as K extends string ? `prefix_${K}` : never]: T[K]
}
```

3. never 键会被过滤

```ts
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
// } // b 被过滤掉了
```

4. 循环引用问题

```ts
// ❌ 可能导致类型实例化过深
type DeepReadonly<T> = {
  readonly [K in keyof T]: DeepReadonly<T[K]>
}

// ✅ 添加终止条件
type SafeDeepReadonly<T> = T extends object
  ? T extends (...args: any[]) => any
    ? T
    : { readonly [K in keyof T]: SafeDeepReadonly<T[K]> }
  : T
```

5. 联合类型的处理

```ts
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

// 映射联合类型
type MappedUnion = {
  [K in 'a' | 'b']: K
}
// type MappedUnion = {
//   a: 'a';
//   b: 'b';
// }
```

6. 性能考虑

```ts
// ❌ 不好：复杂的嵌套映射
type Complex<T> = {
  [K in keyof T]: {
    [P in keyof T[K]]: {
      [Q in keyof T[K][P]]: T[K][P][Q]
    }
  }
}

// ✅ 好：简化或分步处理
type Inner<T> = { [K in keyof T]: T[K] }
type Middle<T> = { [K in keyof T]: Inner<T[K]> }
type Simplified<T> = { [K in keyof T]: Middle<T[K]> }
```

## 8. 🔗 引用

- [TypeScript Handbook - Mapped Types][1]
- [TypeScript 4.1 Release Notes - Key Remapping in Mapped Types][2]
- [TypeScript Handbook - Utility Types][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
[2]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#key-remapping-in-mapped-types
[3]: https://www.typescriptlang.org/docs/handbook/utility-types.html
