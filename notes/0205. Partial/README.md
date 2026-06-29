# [0205. Partial](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0205.%20Partial)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. `Partial<T>` 是什么？](#3-partialt-是什么)
  - [3.1. 源码定义](#31-源码定义)
  - [3.2. 工作原理](#32-工作原理)
  - [3.3. 基本示例](#33-基本示例)
- [4. 如何实现深度 `Partial<T>`？](#4-如何实现深度-partialt)
- [5. 引用](#5-引用)

<!-- endregion:toc -->

## 1. 本节内容

- `Partial<T>` 的定义和实现原理
- 基本使用方法
- 深度 Partial 实现

## 2. 评价

`Partial<T>` 是 TS 中最常用的工具类型之一，它将类型的所有属性变为可选，在表单、配置、API 更新等场景中广泛使用。

## 3. `Partial<T>` 是什么？

`Partial<T>` 将类型 `T` 的所有属性变为可选属性。

- 与 `Required<T>` 互为相反操作
- 只影响第一层属性，嵌套对象需要自定义工具类型实现深度可选的效果

### 3.1. 源码定义

```ts
/**
 * Make all properties in T optional
 */
type Partial<T> = {
  [P in keyof T]?: T[P] | undefined
}
```

### 3.2. 工作原理

```ts
type User = {
  id: number
  name: string
  email: string
}

type PartialUser = Partial<User>
// Partial<User> 的展开过程：
// 1. keyof User = 'id' | 'name' | 'email'
// 2. [P in 'id' | 'name' | 'email']?: User[P] | undefined
// 结果：
// type PartialUser = {
//     id?: number | undefined;
//     name?: string | undefined;
//     email?: string | undefined;
// }
```

### 3.3. 基本示例

```ts
type Product = {
  id: number
  name: string
  price: number
  stock: number
}

type PartialProduct = Partial<Product>

// ✅ 所有属性都是可选的
const product1: PartialProduct = {}
const product2: PartialProduct = { id: 1 }
const product3: PartialProduct = { name: 'iPhone', price: 999 }
const product4: PartialProduct = {
  id: 1,
  name: 'iPhone',
  price: 999,
  stock: 100,
}
```

## 4. 如何实现深度 `Partial<T>`？

`Partial<T>` 本身只支持一层属性的转换，如果需要实现深度转换，需要自定义类型工具来实现。

```ts
type User = {
  id: number
  profile: {
    name: string
    address: {
      street: string
      city: string
    }
  }
}

type PartialUser = Partial<User>
// {
//   id?: number;
//   profile?: {        // ⚠️ profile 是可选的
//     name: string;    // ❌ 但 name 仍然是必需的
//     address: {
//       street: string;
//       city: string;
//     };
//   };
// }

const user: PartialUser = {
  profile: {
    name: 'Foo',
    address: {
      street: '123 Main St',
      // ❌ 错误：city 是必需的
    },
  },
}
```

可以自定义 DeepPartial 工具类，实现深度可选。

```ts
type User = {
  id: number
  profile: {
    name: string
    address: {
      street: string
      city: string
    }
  }
}

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepPartial<T[P]>
    : T[P]
}

type DeepPartialUser = DeepPartial<User>
// type DeepPartialUser = {
//     id?: number | undefined;
//     profile?: DeepPartial<{
//         name: string;
//         address: {
//             street: string;
//             city: string;
//         };
//     }> | undefined;
// }

// ✅ 现在所有层级都是可选的
const user1: DeepPartialUser = {}
const user2: DeepPartialUser = { profile: {} }
const user3: DeepPartialUser = { profile: { address: {} } }
const user4: DeepPartialUser = {
  profile: {
    name: 'Alice',
    address: { city: 'NYC' },
  },
}
```

为了防止无限递归，可以添加深度限制。

```ts
type DeepPartialWithDepth<T, Depth extends number = 5> = Depth extends 0
  ? T
  : {
      [P in keyof T]?: T[P] extends object
        ? T[P] extends Function
          ? T[P]
          : DeepPartialWithDepth<T[P], Decrement<Depth>>
        : T[P]
    }

// 辅助类型：递减数字
type Decrement<N extends number> = N extends 5
  ? 4
  : N extends 4
  ? 3
  : N extends 3
  ? 2
  : N extends 2
  ? 1
  : 0
```

## 5. 引用

- [TypeScript Utility Types - Partial][1]
- [TypeScript Handbook - Mapped Types][2]

[1]: https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype
[2]: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
