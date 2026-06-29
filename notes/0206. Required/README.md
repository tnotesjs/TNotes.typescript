# [0206. Required](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0206.%20Required)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. `Required<T>` 是什么？](#3-requiredt-是什么)
  - [3.1. 源码定义](#31-源码定义)
  - [3.2. 工作原理](#32-工作原理)
  - [3.3. 基本示例](#33-基本示例)
  - [3.4. Required 与 Partial 的对比](#34-required-与-partial-的对比)
- [4. 如何实现深度 `Required<T>`？](#4-如何实现深度-requiredt)
- [5. 如何实现选择性必填属性的工具类型？](#5-如何实现选择性必填属性的工具类型)
- [6. 引用](#6-引用)

<!-- endregion:toc -->

## 1. 本节内容

- `Required<T>` 的定义和实现原理
- 基本使用方法
- 深度 Required 实现

## 2. 评价

`Required<T>` 是 `Partial<T>` 的反向操作，用于将类型的所有可选属性变为必需。

## 3. `Required<T>` 是什么？

`Required<T>` 将类型 `T` 的所有可选属性变为必需属性。

- 适用于需要确保所有属性都存在的场景
- 使用 `-?` 修饰符移除可选标记
- 只影响第一层属性，嵌套对象需要深度实现
- 常用于表单验证、数据完整性检查等场景

### 3.1. 源码定义

```ts
/**
 * Make all properties in T required
 */
type Required<T> = {
  [P in keyof T]-?: T[P]
}
```

### 3.2. 工作原理

```ts
type User = {
  id?: number
  name?: string
  email?: string
}

type RequiredUser = Required<User>
// Required<User> 的展开过程：
// 1. keyof User = 'id' | 'name' | 'email'
// 2. [P in 'id' | 'name' | 'email']-?: User[P]
// 修饰符 -? 表示移除可选修饰符
// 结果：
// type RequiredUser = {
//   id: number;
//   name: string;
//   email: string;
// }
```

### 3.3. 基本示例

```ts
type Config = {
  host?: string
  port?: number
  timeout?: number
}

type RequiredConfig = Required<Config>
// { host: string; port: number; timeout: number; }

// ❌ 缺少必填属性会报错
// const config1: RequiredConfig = { host: 'localhost' } // 错误：缺少 port 和 timeout
// Type '{ host: string; }' is missing the following properties
// from type 'Required<Config>': port, timeout(2739)

// ✅ 必须提供所有属性
const config2: RequiredConfig = {
  host: 'localhost',
  port: 3000,
  timeout: 5000,
}
```

### 3.4. Required 与 Partial 的对比

```ts
type User = {
  id: number
  name?: string
  email?: string
}

// Partial：所有属性变为可选
type PartialUser = Partial<User>
// type PartialUser = {
//     id?: number | undefined;
//     name?: string | undefined;
//     email?: string | undefined;
// }

// Required：所有属性变为必需
type RequiredUser = Required<User>
// type RequiredUser = {
//     id: number;
//     name: string;
//     email: string;
// }

// 组合使用
type AllOptional = Partial<RequiredUser>
// type AllOptional = {
//     id?: number | undefined;
//     name?: string | undefined;
//     email?: string | undefined;
// }

type AllRequired = Required<PartialUser>
// type AllRequired = {
//     id: number;
//     name: string;
//     email: string;
// }
```

## 4. 如何实现深度 `Required<T>`？

`Required<T>` 将类型 `T` 的所有可选属性变为必需属性，但是它只能影响第一层属性，对于嵌套对象的深层属性无效。

```ts
type User = {
  id?: number
  profile?: {
    name?: string
    address?: {
      city?: string
      country?: string
    }
  }
}

type RequiredUser = Required<User>
// type RequiredUser = {
//     id: number;
//     profile: { // ✅ profile 是必需的
//         name?: string; // ❌ 但深层的属性仍然是可选的
//         address?: {
//             city?: string;
//             country?: string;
//         };
//     };
// }
```

如果需要实现深度 Required，可以自定义工具类型来实现。

```ts
type User = {
  id?: number
  profile?: {
    name?: string
    address?: {
      city?: string
      country?: string
    }
  }
}

type DeepRequired<T> = T extends object
  ? T extends Function
    ? T
    : {
        [P in keyof T]-?: DeepRequired<T[P]>
      }
  : T

type DeepRequiredUser = DeepRequired<User>
// type DeepRequiredUser = {
//     id: number;
//     profile: {
//         name: string;
//         address: {
//             city: string;
//             country: string;
//         };
//     };
// }

// ❌ 所有嵌套属性都是必需的
// const user1: DeepRequiredUser = {
//   id: 1,
//   profile: {}, // 错误：缺少 name 和 address
// }

// ✅ 必须提供所有深层属性
const user2: DeepRequiredUser = {
  id: 1,
  profile: {
    name: 'Alice',
    address: {
      city: 'Beijing',
      country: 'China',
    },
  },
}
```

## 5. 如何实现选择性必填属性的工具类型？

```ts
// 只让指定的属性变为必需
type RequireKeys<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>
// 实现原理：
// 1. Pick<T, K>：提取指定的属性 K
// 2. Required<Pick<T, K>>：将提取的属性变为必需
// 3. Omit<T, K>：保留未指定的属性（保持原样）
// 4. & 交叉类型：合并必需属性和剩余属性

type User = {
  id?: number
  name?: string
  email?: string
  age?: number
}

// 只让 id 和 name 变为必需
type UserWithRequiredIdName = RequireKeys<User, 'id' | 'name'>
// 展开过程：
// 1. Pick<User, 'id' | 'name'> = { id?: number; name?: string; }
// 2. Required<{ id?: number; name?: string; }> = { id: number; name: string; }
// 3. Omit<User, 'id' | 'name'> = { email?: string; age?: number; }
// 4. { id: number; name: string; } & { email?: string; age?: number; }
//    = { id: number; name: string; email?: string; age?: number; }

const user: UserWithRequiredIdName = {
  id: 1,
  name: 'Alice',
  // email 和 age 仍然是可选的
}
```

上面示例中用到的 `Pick` 和 `Omit` 工具类型，也是 TS 的内置工具类型，它们的作用分别是提取和删除指定的属性，会在对应的笔记中介绍其他的具体用法。

## 6. 引用

- [TypeScript Utility Types - Required][1]
- [TypeScript Handbook - Mapped Types][2]

[1]: https://www.typescriptlang.org/docs/handbook/utility-types.html#requiredtype
[2]: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
