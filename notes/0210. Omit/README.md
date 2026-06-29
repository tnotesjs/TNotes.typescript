# [0210. Omit](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0210.%20Omit)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. `Omit<T, K>` 是什么？](#3-omitt-k-是什么)
  - [3.1. 源码定义](#31-源码定义)
  - [3.2. 工作原理](#32-工作原理)
  - [3.3. 基本示例](#33-基本示例)
- [4. 使用 `Omit<T, K>` 需要注意什么？](#4-使用-omitt-k-需要注意什么)
  - [4.1. 注意事项 1：键约束比 Pick 宽松](#41-注意事项-1键约束比-pick-宽松)
  - [4.2. 注意事项 2：Omit never 的行为](#42-注意事项-2omit-never-的行为)
  - [4.3. 注意事项 3：保留修饰符](#43-注意事项-3保留修饰符)
  - [4.4. 注意事项 4：与 Pick 的性能差异](#44-注意事项-4与-pick-的性能差异)
  - [4.5. 注意事项 5：索引签名的处理](#45-注意事项-5索引签名的处理)
  - [4.6. 注意事项 6：与联合类型的分布](#46-注意事项-6与联合类型的分布)
  - [4.7. 注意事项 7：类型推断陷阱](#47-注意事项-7类型推断陷阱)
- [5. Pick vs. Omit](#5-pick-vs-omit)
  - [5.1. 使用场景对比](#51-使用场景对比)
  - [5.2. 选择指南](#52-选择指南)
  - [5.3. 互相转换](#53-互相转换)
- [6. 引用](#6-引用)

<!-- endregion:toc -->

## 1. 本节内容

- `Omit<T, K>` 的定义和实现原理
- 基本使用方法
- 实际应用场景
- 使用注意事项
- `Pick` 与 `Omit` 的对比

## 2. 评价

`Omit<T, K>` 从类型 `T` 中排除指定的属性 `K`，创建新类型。

## 3. `Omit<T, K>` 是什么？

`Omit<T, K>` 从类型 `T` 中移除属性集合 `K`，构造一个新类型。

- 与 `Pick<T, K>` 互为反向操作
- 键约束比 `Pick` 更宽松
- 适用于排除敏感信息的场景
- 实现基于 `Pick` 和 `Exclude` 的组合
- 常用于类型继承和修改

### 3.1. 源码定义

```ts
/**
 * Construct a type with the properties of T except for those in type K.
 */
type Omit<T, K extends keyof any> = {
  [P in Exclude<keyof T, K>]: T[P]
}

// 展开来看：
// 1. Exclude<keyof T, K>：从 T 的所有键中排除 K
// 2. Pick<T, 剩余的键>：选择剩余的键
```

### 3.2. 工作原理

```ts
type User = {
  id: number
  name: string
  email: string
  password: string
  salt: string
}

// Omit<User, 'password' | 'salt'> 的展开过程：
// 1. keyof User = 'id' | 'name' | 'email' | 'password' | 'salt'
// 2. Exclude<'id' | 'name' | 'email' | 'password' | 'salt', 'password' | 'salt'>
//    = 'id' | 'name' | 'email'
// 3. Pick<User, 'id' | 'name' | 'email'>
// 4. 结果：
type PublicUser = Omit<User, 'password' | 'salt'>
// {
//   id: number;
//   name: string;
//   email: string;
// }
```

### 3.3. 基本示例

```ts
type Product = {
  id: number
  name: string
  price: number
  internalCost: number
  supplierInfo: string
}

// 排除内部信息
type PublicProduct = Omit<Product, 'internalCost' | 'supplierInfo'>
// { id: number; name: string; price: number; }

const product: PublicProduct = {
  id: 1,
  name: 'iPhone',
  price: 999,
  // ❌ 不能包含被排除的属性
  // internalCost: 500, // 错误
}
```

## 4. 使用 `Omit<T, K>` 需要注意什么？

### 4.1. 注意事项 1：键约束比 Pick 宽松

```ts
type User = {
  id: number
  name: string
}

// ✅ Omit 的 K 可以包含不存在的键
type OmitWithExtra = Omit<User, 'id' | 'nonexistent'>
// { name: string; } - nonexistent 被忽略

// ❌ Pick 的 K 必须是 keyof T 的子集
type PickWithExtra = Pick<User, 'id' | 'nonexistent'> // 错误
```

### 4.2. 注意事项 2：Omit never 的行为

```ts
type User = {
  id: number
  name: string
}

// Omit<T, never> 返回完整类型
type FullUser = Omit<User, never>
// { id: number; name: string; }

// 这在条件类型中很有用
type OmitIfString<T, K extends keyof T> = T[K] extends string ? Omit<T, K> : T
```

### 4.3. 注意事项 3：保留修饰符

```ts
type User = {
  readonly id: number
  name?: string
  email: string
}

type UserOmit = Omit<User, 'email'>
// {
//   readonly id: number; // ✅ readonly 保留
//   name?: string;       // ✅ 可选保留
// }
```

### 4.4. 注意事项 4：与 Pick 的性能差异

```ts
// Omit 实现基于 Pick 和 Exclude
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

// 对于大型类型，Omit 需要额外的类型计算
type LargeType = {
  /* 100 个属性 */
}

// ⚠️ 排除少量键时，Pick 可能更高效
type OmitFew = Omit<LargeType, 'prop1' | 'prop2'> // 计算成本：100 - 2 = 98 个键
type PickMany = Pick<LargeType /* 98 个键 */>

// ✅ 排除大量键时，Omit 更直观
type OmitMany = Omit<LargeType /* 50 个键 */>
```

### 4.5. 注意事项 5：索引签名的处理

```ts
type WithIndex = {
  id: number
  name: string
  [key: string]: any
}

// Omit 会保留索引签名
type OmittedWithIndex = Omit<WithIndex, 'id'>
// {
//   name: string;
//   [key: string]: any; // ✅ 索引签名保留
// }

// 但无法通过 Omit 移除索引签名
type TryOmitIndex = Omit<WithIndex, string> // 不会移除索引签名
```

### 4.6. 注意事项 6：与联合类型的分布

```ts
type A = { a: number; b: string; c: boolean }
type B = { b: string; c: boolean; d: number }

type Union = A | B

// Omit 会分发到联合类型的每个成员
type OmittedUnion = Omit<Union, 'b'>
// Omit<A, 'b'> | Omit<B, 'b'>
// { a: number; c: boolean; } | { c: boolean; d: number; }
```

### 4.7. 注意事项 7：类型推断陷阱

```ts
type User = {
  id: number
  name: string
  email: string
}

// ⚠️ 运行时对象仍可能包含被排除的属性
function processUser(user: Omit<User, 'email'>): void {
  console.log(user.email) // 类型错误，但运行时可能存在
}

const fullUser: User = { id: 1, name: 'Alice', email: 'alice@example.com' }
processUser(fullUser) // ✅ 类型兼容（结构类型）

// ✅ 运行时确保移除属性
function safeProcessUser(user: Omit<User, 'email'>): void {
  const { email, ...rest } = user as any
  // 使用 rest，不会访问 email
}
```

## 5. Pick vs. Omit

### 5.1. 使用场景对比

| 特性          | Pick<T, K>                 | Omit<T, K>                 |
| ------------- | -------------------------- | -------------------------- |
| 操作方式      | 选择指定属性               | 排除指定属性               |
| 键约束        | K 必须是 keyof T 的子集    | K 可以包含不存在的键       |
| 适用场景      | 需要的属性较少             | 需要排除的属性较少         |
| 类型安全性    | 更严格（编译时检查键存在） | 更宽松（不存在的键被忽略） |
| 实现复杂度    | 直接映射                   | 基于 Pick + Exclude        |
| 常见用途      | 提取子集                   | 移除敏感信息               |
| 性能          | 直接选择                   | 需要计算排除               |
| 可读性        | 明确列出需要的属性         | 明确列出不需要的属性       |
| 维护性        | 添加新属性需要更新 K       | 新属性自动包含             |
| 与 never 交互 | Pick<T, never> = {}        | Omit<T, never> = T         |

### 5.2. 选择指南

```ts
type User = {
  id: number
  username: string
  email: string
  password: string
  salt: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  isActive: boolean
  lastLoginAt: Date
}

// ✅ 使用 Pick：需要的字段少
type UserPreview = Pick<User, 'id' | 'username'>

// ✅ 使用 Omit：排除的字段少
type PublicUser = Omit<User, 'password' | 'salt'>

// ⚠️ 不推荐：需要多数字段却用 Pick
type AlmostFullUser = Pick<
  User,
  | 'id'
  | 'username'
  | 'email'
  | 'createdAt'
  | 'updatedAt'
  | 'isActive'
  | 'lastLoginAt'
>

// ✅ 推荐：使用 Omit 更清晰
type AlmostFullUserBetter = Omit<User, 'password' | 'salt' | 'deletedAt'>
```

### 5.3. 互相转换

```ts
type User = {
  id: number
  name: string
  email: string
}

// Pick 可以实现 Omit 的效果
type OmitUsingPick<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

type WithoutEmail1 = Omit<User, 'email'>
type WithoutEmail2 = OmitUsingPick<User, 'email'>
// 两者等价

// Omit 可以实现 Pick 的效果
type PickUsingOmit<T, K extends keyof T> = Omit<T, Exclude<keyof T, K>>

type OnlyId1 = Pick<User, 'id'>
type OnlyId2 = PickUsingOmit<User, 'id'>
// 两者等价
```

## 6. 引用

- [TypeScript Utility Types - Omit][1]
- [TypeScript Handbook - Mapped Types][2]
- [TypeScript Deep Dive - Utility Types][3]

[1]: https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys
[2]: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
[3]: https://basarat.gitbook.io/typescript/type-system/utility-types
