# [0204. 内置映射类型解析](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0204.%20%E5%86%85%E7%BD%AE%E6%98%A0%E5%B0%84%E7%B1%BB%E5%9E%8B%E8%A7%A3%E6%9E%90)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 TypeScript 内置了哪些映射类型？](#3--typescript-内置了哪些映射类型)
  - [3.1. 核心映射类型列表](#31-核心映射类型列表)
  - [3.2. 使用示例](#32-使用示例)
- [4. 🤔 Partial 和 Required 的实现原理是什么？](#4--partial-和-required-的实现原理是什么)
  - [4.1. Partial 的实现](#41-partial-的实现)
  - [4.2. Partial 的深层实现](#42-partial-的深层实现)
  - [4.3. Required 的实现](#43-required-的实现)
  - [4.4. Required 的实际应用](#44-required-的实际应用)
- [5. 🤔 Readonly 和 Record 的实现原理是什么？](#5--readonly-和-record-的实现原理是什么)
  - [5.1. Readonly 的实现](#51-readonly-的实现)
  - [5.2. Readonly 的深层实现](#52-readonly-的深层实现)
  - [5.3. Record 的实现](#53-record-的实现)
  - [5.4. Record 的实际应用](#54-record-的实际应用)
  - [5.5. Record 的变体](#55-record-的变体)
- [6. 🤔 Pick 和 Omit 的实现原理是什么？](#6--pick-和-omit-的实现原理是什么)
  - [6.1. Pick 的实现](#61-pick-的实现)
  - [6.2. Pick 的实际应用](#62-pick-的实际应用)
  - [6.3. Omit 的实现](#63-omit-的实现)
  - [6.4. Omit 的实际应用](#64-omit-的实际应用)
  - [6.5. Pick 和 Omit 的对比](#65-pick-和-omit-的对比)
- [7. 🤔 如何组合使用内置映射类型？](#7--如何组合使用内置映射类型)
  - [7.1. 基本组合模式](#71-基本组合模式)
  - [7.2. 创建自定义工具类型](#72-创建自定义工具类型)
  - [7.3. 实际应用场景](#73-实际应用场景)
  - [7.4. 高级组合模式](#74-高级组合模式)
- [8. 🤔 使用内置映射类型需要注意什么？](#8--使用内置映射类型需要注意什么)
  - [8.1. 注意事项 1：浅层转换](#81-注意事项-1浅层转换)
  - [8.2. 注意事项 2：类型约束](#82-注意事项-2类型约束)
  - [8.3. 注意事项 3：与索引签名的交互](#83-注意事项-3与索引签名的交互)
  - [8.4. 注意事项 4：函数类型的处理](#84-注意事项-4函数类型的处理)
  - [8.5. 注意事项 5：性能考虑](#85-注意事项-5性能考虑)
  - [8.6. 注意事项 6：与泛型的结合](#86-注意事项-6与泛型的结合)
  - [8.7. 注意事项 7：循环引用](#87-注意事项-7循环引用)
- [9. 🔗 引用](#9--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- TypeScript 内置映射类型概览
- Partial 和 Required 的实现
- Readonly 和 Record 的实现
- Pick 和 Omit 的实现
- 内置类型的组合使用
- 使用注意事项

## 2. 🫧 评价

理解 TypeScript 内置映射类型的实现原理可以帮助我们更好地使用它们，并创建自己的工具类型。

- 内置映射类型是 TypeScript 类型系统的基础工具
- 它们的实现代码简洁而强大，是学习映射类型的最佳示例
- 掌握这些类型的原理能帮助理解更复杂的类型操作
- 实际开发中，优先使用内置类型而非重新实现
- 了解实现细节有助于调试类型错误和优化类型定义

## 3. 🤔 TypeScript 内置了哪些映射类型？

TypeScript 在 `lib.es5.d.ts` 中定义了多个常用的映射类型工具。

### 3.1. 核心映射类型列表

```typescript
// 1. Partial<T> - 将所有属性变为可选
type Partial<T> = {
  [P in keyof T]?: T[P]
}

// 2. Required<T> - 将所有属性变为必需
type Required<T> = {
  [P in keyof T]-?: T[P]
}

// 3. Readonly<T> - 将所有属性变为只读
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

// 4. Pick<T, K> - 选取指定的属性
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

// 5. Omit<T, K> - 排除指定的属性
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>

// 6. Record<K, T> - 创建键值对类型
type Record<K extends keyof any, T> = {
  [P in K]: T
}
```

### 3.2. 使用示例

```typescript
type User = {
  id: number
  name: string
  email: string
}

// 使用 Partial
type PartialUser = Partial<User>
// { id?: number; name?: string; email?: string; }

// 使用 Required
type RequiredUser = Required<Partial<User>>
// { id: number; name: string; email: string; }

// 使用 Readonly
type ReadonlyUser = Readonly<User>
// { readonly id: number; readonly name: string; readonly email: string; }

// 使用 Pick
type UserPreview = Pick<User, 'id' | 'name'>
// { id: number; name: string; }

// 使用 Omit
type UserWithoutEmail = Omit<User, 'email'>
// { id: number; name: string; }

// 使用 Record
type UserRoles = Record<'admin' | 'user' | 'guest', boolean>
// { admin: boolean; user: boolean; guest: boolean; }
```

## 4. 🤔 Partial 和 Required 的实现原理是什么？

### 4.1. Partial 的实现

```typescript
// TypeScript 源码中的定义
type Partial<T> = {
  [P in keyof T]?: T[P]
}

// 工作原理演示
type User = {
  id: number
  name: string
}

// 展开过程：
// 1. keyof User = 'id' | 'name'
// 2. [P in 'id' | 'name']?: User[P]
// 3. { id?: number; name?: string; }

type PartialUser = Partial<User>

const user1: PartialUser = {} // ✅ 合法
const user2: PartialUser = { id: 1 } // ✅ 合法
const user3: PartialUser = { id: 1, name: 'Alice' } // ✅ 合法
```

### 4.2. Partial 的深层实现

```typescript
// TypeScript 自带的 Partial 只处理第一层
type ShallowPartial<T> = {
  [P in keyof T]?: T[P]
}

// 深层 Partial 需要递归实现
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepPartial<T[P]>
    : T[P]
}

type Config = {
  server: {
    host: string
    port: number
  }
}

type PartialConfig1 = Partial<Config>
// { server?: { host: string; port: number; } }

type PartialConfig2 = DeepPartial<Config>
// { server?: { host?: string; port?: number; } }
```

### 4.3. Required 的实现

```typescript
// TypeScript 源码中的定义
type Required<T> = {
  [P in keyof T]-?: T[P]
}

// -? 表示移除可选修饰符

type PartialUser = {
  id?: number
  name?: string
}

// 展开过程：
// 1. keyof PartialUser = 'id' | 'name'
// 2. [P in 'id' | 'name']-?: PartialUser[P]
// 3. { id: number; name: string; }

type RequiredUser = Required<PartialUser>

// ❌ 现在所有属性都是必需的
const user: RequiredUser = { id: 1 } // 错误：缺少 name
```

### 4.4. Required 的实际应用

```typescript
// 场景：表单数据验证
type FormData = {
  username?: string
  email?: string
  password?: string
}

function validateForm(data: FormData): data is Required<FormData> {
  return (
    typeof data.username === 'string' &&
    typeof data.email === 'string' &&
    typeof data.password === 'string'
  )
}

function submitForm(data: FormData) {
  if (validateForm(data)) {
    // 这里 data 的类型是 Required<FormData>
    console.log(data.username.toUpperCase()) // ✅ 安全访问
  }
}
```

## 5. 🤔 Readonly 和 Record 的实现原理是什么？

### 5.1. Readonly 的实现

```typescript
// TypeScript 源码中的定义
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

// 工作原理
type User = {
  id: number
  name: string
}

type ReadonlyUser = Readonly<User>
// { readonly id: number; readonly name: string; }

const user: ReadonlyUser = { id: 1, name: 'Alice' }
// ❌ 所有属性都不能修改
user.id = 2 // 错误
user.name = 'Bob' // 错误
```

### 5.2. Readonly 的深层实现

```typescript
// 浅层只读
type ShallowReadonly<T> = {
  readonly [P in keyof T]: T[P]
}

// 深层只读（递归）
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends Function
    ? T[P]
    : T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P]
}

type Config = {
  server: {
    host: string
    port: number
  }
}

type Config1 = Readonly<Config>
// { readonly server: { host: string; port: number; } }
// server 属性只读，但 server.host 可以修改

type Config2 = DeepReadonly<Config>
// { readonly server: { readonly host: string; readonly port: number; } }
// 所有层级都只读
```

### 5.3. Record 的实现

```typescript
// TypeScript 源码中的定义
type Record<K extends keyof any, T> = {
  [P in K]: T
}

// keyof any = string | number | symbol
// 这是所有可能的对象键类型

// 使用示例
type Status = 'pending' | 'success' | 'error'
type StatusMessages = Record<Status, string>
// { pending: string; success: string; error: string; }

const messages: StatusMessages = {
  pending: 'Loading...',
  success: 'Done!',
  error: 'Failed!',
}
```

### 5.4. Record 的实际应用

```typescript
// 场景 1：配置对象
type Environment = 'development' | 'staging' | 'production'
type Config = Record<
  Environment,
  {
    apiUrl: string
    debug: boolean
  }
>

const config: Config = {
  development: {
    apiUrl: 'http://localhost:3000',
    debug: true,
  },
  staging: {
    apiUrl: 'https://staging.example.com',
    debug: true,
  },
  production: {
    apiUrl: 'https://api.example.com',
    debug: false,
  },
}

// 场景 2：映射表
type UserRole = 'admin' | 'user' | 'guest'
type Permissions = Record<UserRole, string[]>

const permissions: Permissions = {
  admin: ['read', 'write', 'delete'],
  user: ['read', 'write'],
  guest: ['read'],
}

// 场景 3：索引签名的替代
// ❌ 使用索引签名（不够精确）
type BadCache = {
  [key: string]: any
}

// ✅ 使用 Record（更精确）
type GoodCache = Record<string, { value: any; timestamp: number }>
```

### 5.5. Record 的变体

```typescript
// 部分键的 Record
type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T
}

type OptionalStatus = PartialRecord<'pending' | 'success', string>
// { pending?: string; success?: string; }

// 只读 Record
type ReadonlyRecord<K extends keyof any, T> = {
  readonly [P in K]: T
}
```

## 6. 🤔 Pick 和 Omit 的实现原理是什么？

### 6.1. Pick 的实现

```typescript
// TypeScript 源码中的定义
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

// 工作原理
type User = {
  id: number
  name: string
  email: string
  age: number
}

// 展开过程：
// 1. K = 'id' | 'name'（必须是 keyof User 的子集）
// 2. [P in 'id' | 'name']: User[P]
// 3. { id: number; name: string; }

type UserPreview = Pick<User, 'id' | 'name'>

const preview: UserPreview = {
  id: 1,
  name: 'Alice',
  // ❌ email 和 age 不允许出现
}
```

### 6.2. Pick 的实际应用

```typescript
// 场景 1：API 响应精简
type FullUser = {
  id: number
  username: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
  lastLoginAt: Date
}

// 只返回公开信息
type PublicUser = Pick<FullUser, 'id' | 'username'>

// 场景 2：表单字段选择
type CreateUserForm = Pick<FullUser, 'username' | 'email' | 'password'>

// 场景 3：更新字段
type UpdateUserForm = Partial<Pick<FullUser, 'username' | 'email'>>
```

### 6.3. Omit 的实现

```typescript
// TypeScript 源码中的定义
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>

// 依赖的 Exclude 定义
type Exclude<T, U> = T extends U ? never : T

// 工作原理
type User = {
  id: number
  name: string
  email: string
  password: string
}

// 展开过程：
// 1. keyof User = 'id' | 'name' | 'email' | 'password'
// 2. Exclude<keyof User, 'password'> = 'id' | 'name' | 'email'
// 3. Pick<User, 'id' | 'name' | 'email'>
// 4. { id: number; name: string; email: string; }

type UserWithoutPassword = Omit<User, 'password'>
```

### 6.4. Omit 的实际应用

```typescript
// 场景 1：移除敏感信息
type User = {
  id: number
  username: string
  email: string
  password: string
  secretKey: string
}

type SafeUser = Omit<User, 'password' | 'secretKey'>

// 场景 2：继承并修改类型
type BaseEntity = {
  id: number
  createdAt: Date
  updatedAt: Date
}

type CreateDto<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>

type CreateUserDto = CreateDto<User> & {
  // 创建时不需要 id 和时间戳
  password: string
}

// 场景 3：类型替换
type Article = {
  id: number
  title: string
  author: User
}

// 将 author 从对象改为 ID
type ArticleWithAuthorId = Omit<Article, 'author'> & {
  authorId: number
}
```

### 6.5. Pick 和 Omit 的对比

```typescript
type User = {
  id: number
  name: string
  email: string
  age: number
  address: string
}

// Pick：明确指定要保留的属性
type Method1 = Pick<User, 'id' | 'name'>

// Omit：明确指定要排除的属性
type Method2 = Omit<User, 'email' | 'age' | 'address'>

// Method1 和 Method2 结果相同
// 选择哪个取决于：
// - 要保留的属性少 → 用 Pick
// - 要排除的属性少 → 用 Omit
```

## 7. 🤔 如何组合使用内置映射类型？

### 7.1. 基本组合模式

```typescript
type User = {
  id: number
  name: string
  email: string
  password: string
}

// 组合 1：Partial + Pick
type PartialUserUpdate = Partial<Pick<User, 'name' | 'email'>>
// { name?: string; email?: string; }

// 组合 2：Readonly + Omit
type SafeUser = Readonly<Omit<User, 'password'>>
// { readonly id: number; readonly name: string; readonly email: string; }

// 组合 3：Required + Partial
type EnsureId<T> = Required<Pick<T, 'id'>> & Partial<Omit<T, 'id'>>
type UserWithId = EnsureId<User>
// { id: number; name?: string; email?: string; password?: string; }
```

### 7.2. 创建自定义工具类型

```typescript
// 只读 + 可选
type ReadonlyPartial<T> = Readonly<Partial<T>>

// 选取 + 必需
type PickRequired<T, K extends keyof T> = Required<Pick<T, K>>

// 排除 + 只读
type OmitReadonly<T, K extends keyof T> = Readonly<Omit<T, K>>

// 使用示例
type User = {
  id?: number
  name?: string
  email?: string
}

type RequiredIdUser = PickRequired<User, 'id'>
// { id: number; }
```

### 7.3. 实际应用场景

```typescript
// 场景 1：表单状态管理
type FormState<T> = {
  values: Partial<T>
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
}

type User = {
  username: string
  email: string
  password: string
}

type UserFormState = FormState<User>
// {
//   values: { username?: string; email?: string; password?: string; };
//   errors: { username?: string; email?: string; password?: string; };
//   touched: { username?: boolean; email?: boolean; password?: boolean; };
// }

// 场景 2：API 响应类型
type ApiResponse<T> = {
  data: T
  error: string | null
  loading: boolean
}

type UserResponse = ApiResponse<Omit<User, 'password'>>

// 场景 3：数据库模型
type Entity = {
  id: number
  createdAt: Date
  updatedAt: Date
}

type CreateDto<T extends Entity> = Omit<T, keyof Entity>
type UpdateDto<T extends Entity> = Partial<CreateDto<T>>

type Product = Entity & {
  name: string
  price: number
  stock: number
}

type CreateProduct = CreateDto<Product>
// { name: string; price: number; stock: number; }

type UpdateProduct = UpdateDto<Product>
// { name?: string; price?: number; stock?: number; }
```

### 7.4. 高级组合模式

```typescript
// 深度转换
type DeepPartialReadonly<T> = {
  readonly [P in keyof T]?: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepPartialReadonly<T[P]>
    : T[P]
}

// 条件组合
type ConditionalReadonly<T, Keys extends keyof T> = Readonly<Pick<T, Keys>> &
  Omit<T, Keys>

type User = {
  id: number
  name: string
  email: string
}

// id 只读，其他可变
type UserWithReadonlyId = ConditionalReadonly<User, 'id'>

// 选择性必需
type SelectiveRequired<T, K extends keyof T> = Required<Pick<T, K>> &
  Partial<Omit<T, K>>
```

## 8. 🤔 使用内置映射类型需要注意什么？

### 8.1. 注意事项 1：浅层转换

内置映射类型都是浅层的，只影响第一层属性。

```typescript
type User = {
  id: number
  profile: {
    name: string
    age: number
  }
}

type PartialUser = Partial<User>
// {
//   id?: number;
//   profile?: { name: string; age: number; }; // ⚠️ profile 内部不是可选的
// }

const user: PartialUser = {
  profile: {
    name: 'Alice',
    // ❌ 错误：age 是必需的
  },
}

// ✅ 需要深层 Partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepPartial<T[P]>
    : T[P]
}
```

### 8.2. 注意事项 2：类型约束

某些组合可能导致类型错误。

```typescript
type User = {
  id: number
  name: string
}

// ❌ 错误：K 必须是 keyof T 的子集
type Bad = Pick<User, 'id' | 'nonexistent'> // 类型错误

// ✅ 正确使用
type Good = Pick<User, 'id' | 'name'>
```

### 8.3. 注意事项 3：与索引签名的交互

```typescript
type Dict = {
  [key: string]: any
  id: number
}

type PartialDict = Partial<Dict>
// {
//   [key: string]: any; // ⚠️ 索引签名不受影响
//   id?: number;
// }

// 索引签名的属性不会被 Partial 影响
```

### 8.4. 注意事项 4：函数类型的处理

```typescript
type Mixed = {
  name: string
  handler: () => void
}

type ReadonlyMixed = Readonly<Mixed>
// {
//   readonly name: string;
//   readonly handler: () => void; // ⚠️ 函数本身只读，但可以调用
// }

const obj: ReadonlyMixed = {
  name: 'test',
  handler: () => console.log('hello'),
}

// ❌ 不能重新赋值函数
obj.handler = () => {} // 错误

// ✅ 但可以调用函数
obj.handler() // 正确
```

### 8.5. 注意事项 5：性能考虑

复杂的类型组合可能影响 TypeScript 编译性能。

```typescript
// ⚠️ 复杂嵌套可能影响性能
type Complex<T> = Readonly<Required<Partial<Pick<Omit<T, 'a'>, 'b' | 'c'>>>>

// ✅ 简化类型定义
type Simple<T> = Readonly<Required<Pick<T, 'b' | 'c'>>>
```

### 8.6. 注意事项 6：与泛型的结合

```typescript
// 确保类型参数的约束正确
function updateUser<T extends User, K extends keyof T>(
  user: T,
  updates: Pick<T, K>
): T {
  return { ...user, ...updates }
}

// ❌ 可能导致类型不匹配
function badUpdate<T>(user: T, updates: Partial<T>): T {
  return { ...user, ...updates } // updates 可能缺少必需属性
}
```

### 8.7. 注意事项 7：循环引用

```typescript
type Node = {
  value: number
  next?: Node
}

// Readonly 可以处理循环引用
type ReadonlyNode = Readonly<Node>

// 但自定义递归类型需要小心
type DeepReadonlyNode = DeepReadonly<Node> // 可能导致无限递归
```

## 9. 🔗 引用

- [TypeScript lib.es5.d.ts Source Code][1]
- [TypeScript Utility Types Documentation][2]
- [TypeScript Handbook - Mapped Types][3]

[1]: https://github.com/microsoft/TypeScript/blob/main/lib/lib.es5.d.ts
[2]: https://www.typescriptlang.org/docs/handbook/utility-types.html
[3]: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
