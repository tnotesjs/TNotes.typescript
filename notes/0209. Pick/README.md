# [0209. Pick](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0209.%20Pick)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 `Pick<T, K>` 是什么？](#3--pickt-k-是什么)
  - [3.1. 源码定义](#31-源码定义)
  - [3.2. 工作原理](#32-工作原理)
  - [3.3. 基本示例](#33-基本示例)
- [4. 🤔 使用 `Pick<T, K>` 提取子集的时候，属性原有的类型修饰符（比如只读 `readonly` 修饰、可选 `?` 修饰）会丢失吗？](#4--使用-pickt-k-提取子集的时候属性原有的类型修饰符比如只读-readonly-修饰可选--修饰会丢失吗)
- [5. 🔗 引用](#5--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- `Pick<T, K>` 的定义和实现原理
- `Pick<T, K>` 的基本用法

## 2. 🫧 评价

`Pick<T, K>` 从类型 `T` 中选取指定的属性 `K`，创建新类型，常用来提取某个类型的子集。

## 3. 🤔 `Pick<T, K>` 是什么？

`Pick<T, K>` 从类型 `T` 中选取属性集合 `K`，构造一个新类型。

- 适用于需要类型子集的场景
- 与 `Omit<T, K>` 互为补充操作
- 键必须是原类型的属性名
- 常用于 API 响应、表单数据等场景

### 3.1. 源码定义

```ts
/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}
```

### 3.2. 工作原理

```ts
type User = {
  id: number
  name: string
  email: string
  age: number
  address: string
}

type UserPreview = Pick<User, 'id' | 'name'>
// Pick<User, 'id' | 'name'> 的展开过程：
// 1. K = 'id' | 'name'（必须是 keyof User -> 'id' | 'name' | 'email' | 'age' | 'address' 的子集）
// 2. [P in 'id' | 'name']: User[P]
// 结果：
// type UserPreview = {
//     id: number;
//     name: string;
// }
```

### 3.3. 基本示例

```ts
type Product = {
  id: number
  name: string
  price: number
  description: string
  stock: number
  category: string
}

// 只选择部分属性
type ProductPreview = Pick<Product, 'id' | 'name' | 'price'>
// type ProductPreview = {
//     id: number;
//     name: string;
//     price: number;
// }

const preview: ProductPreview = {
  id: 1,
  name: 'iPhone',
  price: 999,
}
```

## 4. 🤔 使用 `Pick<T, K>` 提取子集的时候，属性原有的类型修饰符（比如只读 `readonly` 修饰、可选 `?` 修饰）会丢失吗？

类型修饰符不会丢失，会被原样保留。

```ts
type User = {
  readonly id: number
  name?: string
  email: string
}

type UserPick = Pick<User, 'id' | 'name'>
// type UserPick = {
//   readonly id: number; // ✅ readonly 被保留
//   name?: string;       // ✅ 可选修饰符被保留
// }

const user: UserPick = {
  id: 1,
  // name 可选
}

// ❌ id 仍然是只读的
user.id = 2 // 错误
```

## 5. 🔗 引用

- [TypeScript Utility Types - Pick][1]
- [TypeScript Handbook - Mapped Types][2]

[1]: https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys
[2]: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
