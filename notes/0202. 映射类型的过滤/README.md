# [0202. 映射类型的过滤](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0202.%20%E6%98%A0%E5%B0%84%E7%B1%BB%E5%9E%8B%E7%9A%84%E8%BF%87%E6%BB%A4)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是映射类型的过滤？](#3--什么是映射类型的过滤)
  - [3.1. 过滤的本质](#31-过滤的本质)
  - [3.2. 过滤 vs. 可选](#32-过滤-vs-可选)
- [4. 🤔 如何使用 as never 过滤键？](#4--如何使用-as-never-过滤键)
  - [4.1. 基本过滤模式](#41-基本过滤模式)
  - [4.2. 保留指定键](#42-保留指定键)
  - [4.3. 排除指定键](#43-排除指定键)
- [5. 🤔 如何按值类型过滤？](#5--如何按值类型过滤)
  - [5.1. 保留特定类型的属性](#51-保留特定类型的属性)
  - [5.2. 排除特定类型的属性](#52-排除特定类型的属性)
  - [5.3. 过滤可选属性](#53-过滤可选属性)
  - [5.4. 过滤 null/undefined](#54-过滤-nullundefined)
- [6. 🤔 如何按键名模式过滤？](#6--如何按键名模式过滤)
  - [6.1. 过滤前缀](#61-过滤前缀)
  - [6.2. 过滤后缀](#62-过滤后缀)
  - [6.3. 匹配特定模式](#63-匹配特定模式)
  - [6.4. 组合多个过滤条件](#64-组合多个过滤条件)
- [7. 🤔 映射类型过滤有哪些实际应用？](#7--映射类型过滤有哪些实际应用)
  - [7.1. 场景 1：API 响应清理](#71-场景-1api-响应清理)
  - [7.2. 场景 2：表单字段筛选](#72-场景-2表单字段筛选)
  - [7.3. 场景 3：事件处理器提取](#73-场景-3事件处理器提取)
  - [7.4. 场景 4：数据库查询字段](#74-场景-4数据库查询字段)
  - [7.5. 场景 5：配置验证](#75-场景-5配置验证)
  - [7.6. 场景 6：权限过滤](#76-场景-6权限过滤)
- [8. 🤔 使用过滤时需要注意什么？](#8--使用过滤时需要注意什么)
  - [8.1. 注意事项 1：过滤的不可逆性](#81-注意事项-1过滤的不可逆性)
  - [8.2. 注意事项 2：过滤条件的准确性](#82-注意事项-2过滤条件的准确性)
  - [8.3. 注意事项 3：类型安全的边界](#83-注意事项-3类型安全的边界)
  - [8.4. 注意事项 4：过滤可能导致空类型](#84-注意事项-4过滤可能导致空类型)
  - [8.5. 注意事项 5：与可选属性的交互](#85-注意事项-5与可选属性的交互)
  - [8.6. 注意事项 6：性能考虑](#86-注意事项-6性能考虑)
  - [8.7. 注意事项 7：过滤与继承](#87-注意事项-7过滤与继承)
- [9. 🔗 引用](#9--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 映射类型过滤的概念
- `as never` 的过滤机制
- 按值类型过滤
- 按键名模式过滤
- 实际应用场景
- 使用注意事项

## 2. 🫧 评价

映射类型的过滤是通过 `as never` 子句实现的强大功能，允许在类型层面动态地排除不需要的属性。

- 过滤功能使映射类型能够实现复杂的类型转换和提取
- `as never` 是实现类型过滤的核心机制
- 结合条件类型，可以实现基于值类型或键名的灵活过滤
- 理解过滤机制是掌握 `Pick`、`Omit` 等工具类型的关键
- 在实际开发中，过滤常用于 API 数据清理、权限控制等场景

## 3. 🤔 什么是映射类型的过滤？

映射类型的过滤是指在类型转换过程中，根据特定条件排除某些属性，只保留符合条件的属性。

### 3.1. 过滤的本质

过滤通过 `as never` 实现。当键被映射为 `never` 类型时，该键会从结果类型中完全消失。

```ts
type User = {
  id: number
  name: string
  password: string
  email: string
}

// 基本过滤：排除 password 字段
type PublicUser = {
  [K in keyof User as K extends 'password' ? never : K]: User[K]
}
// 结果：{ id: number; name: string; email: string; }

// password 键完全不存在
const user: PublicUser = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  // password 不能出现
}
```

### 3.2. 过滤 vs. 可选

过滤和可选是不同的概念：

```ts
type User = {
  id: number
  name: string
  password: string
}

// 过滤：键完全消失
type Filtered = {
  [K in keyof User as K extends 'password' ? never : K]: User[K]
}
// 结果：{ id: number; name: string; }

// 可选：键存在但可以不提供
type Optional = {
  [K in keyof User]+?: User[K]
}
// 结果：{ id?: number; name?: string; password?: string; }

const filtered: Filtered = {
  id: 1,
  name: 'Alice',
  // password 不能出现
}

const optional: Optional = {
  // 所有键都可以省略
  id: 1,
}
```

## 4. 🤔 如何使用 as never 过滤键？

`as never` 是过滤键的核心机制，通过条件类型判断是否将键映射为 `never`。

### 4.1. 基本过滤模式

```ts
type FilterKeys<T, Condition> = {
  [K in keyof T as K extends Condition ? never : K]: T[K]
}

type User = {
  id: number
  name: string
  password: string
  email: string
}

// 排除单个键
type WithoutPassword = FilterKeys<User, 'password'>
// 结果：{ id: number; name: string; email: string; }

// 排除多个键
type WithoutSensitive = FilterKeys<User, 'password' | 'email'>
// 结果：{ id: number; name: string; }
```

### 4.2. 保留指定键

```ts
// 只保留指定的键
type PickKeys<T, Keys extends keyof T> = {
  [K in keyof T as K extends Keys ? K : never]: T[K]
}

type User = {
  id: number
  name: string
  password: string
  email: string
}

type BasicInfo = PickKeys<User, 'id' | 'name'>
// 结果：{ id: number; name: string; }

// 这实际上就是内置 Pick 类型的实现
type MyPick<T, K extends keyof T> = {
  [P in keyof T as P extends K ? P : never]: T[P]
}
```

### 4.3. 排除指定键

```ts
// 排除指定的键
type OmitKeys<T, Keys extends keyof T> = {
  [K in keyof T as K extends Keys ? never : K]: T[K]
}

type User = {
  id: number
  name: string
  password: string
  email: string
}

type PublicUser = OmitKeys<User, 'password'>
// 结果：{ id: number; name: string; email: string; }

// 这实际上就是内置 Omit 类型的一种实现
type MyOmit<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P]
}
```

## 5. 🤔 如何按值类型过滤？

可以根据属性的值类型来过滤属性。

### 5.1. 保留特定类型的属性

```ts
// 只保留 string 类型的属性
type PickByType<T, ValueType> = {
  [K in keyof T as T[K] extends ValueType ? K : never]: T[K]
}

type User = {
  id: number
  name: string
  age: number
  email: string
  active: boolean
}

type StringProps = PickByType<User, string>
// 结果：{ name: string; email: string; }

type NumberProps = PickByType<User, number>
// 结果：{ id: number; age: number; }

type BooleanProps = PickByType<User, boolean>
// 结果：{ active: boolean; }
```

### 5.2. 排除特定类型的属性

```ts
// 排除特定类型的属性
type OmitByType<T, ValueType> = {
  [K in keyof T as T[K] extends ValueType ? never : K]: T[K]
}

type Data = {
  id: number
  name: string
  age: number
  callback: () => void
  handler: (x: number) => void
}

// 排除所有函数类型的属性
type NonFunctions = OmitByType<Data, Function>
// 结果：{ id: number; name: string; age: number; }

// 排除所有数字类型的属性
type NonNumbers = OmitByType<Data, number>
// 结果：{ name: string; callback: () => void; handler: (x: number) => void; }
```

### 5.3. 过滤可选属性

```ts
// 只保留必需属性
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
// 结果：{ id: number; name: string; }

// 只保留可选属性
type OptionalKeys<T> = {
  [K in keyof T as T[K] extends Required<T>[K] ? never : K]: T[K]
}

type OnlyOptional = OptionalKeys<User>
// 结果：{ email?: string; phone?: string; }
```

### 5.4. 过滤 null/undefined

```ts
// 排除可能为 null 或 undefined 的属性
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

type NonNullable = NonNullableProps<Data>
// 结果：{ a: string; e: number; }
```

## 6. 🤔 如何按键名模式过滤？

可以使用模板字面量类型和字符串匹配来按键名模式过滤。

### 6.1. 过滤前缀

```ts
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
// 结果：{ id: number; name: string; email: string; }

// 只保留以特定前缀开头的键
type PickByPrefix<T, Prefix extends string> = {
  [K in keyof T as K extends `${Prefix}${string}` ? K : never]: T[K]
}

type PrivateProps = PickByPrefix<Model, '_'>
// 结果：{ _version: number; _internal: string; _metadata: object; }
```

### 6.2. 过滤后缀

```ts
// 排除以特定后缀结尾的键
type OmitBySuffix<T, Suffix extends string> = {
  [K in keyof T as K extends `${string}${Suffix}` ? never : K]: T[K]
}

type Handlers = {
  onClick: () => void
  onHover: () => void
  handleSubmit: () => void
  name: string
  id: number
}

type NonHandlers = OmitBySuffix<Handlers, 'Handler' | 'Click' | 'Hover'>
// 结果：{ handleSubmit: () => void; name: string; id: number; }
```

### 6.3. 匹配特定模式

```ts
// 过滤包含特定字符串的键
type OmitMatching<T, Pattern extends string> = {
  [K in keyof T as K extends `${string}${Pattern}${string}` ? never : K]: T[K]
}

type Data = {
  userId: number
  userName: string
  email: string
  userRole: string
  timestamp: Date
}

type WithoutUser = OmitMatching<Data, 'user' | 'User'>
// 结果：{ email: string; timestamp: Date; }

// 只保留匹配模式的键
type PickMatching<T, Pattern extends string> = {
  [K in keyof T as K extends `${string}${Pattern}${string}` ? K : never]: T[K]
}

type UserFields = PickMatching<Data, 'user' | 'User'>
// 结果：{ userId: number; userName: string; userRole: string; }
```

### 6.4. 组合多个过滤条件

```ts
// 组合前缀和类型过滤
type ComplexFilter<T> = {
  [K in keyof T as K extends `_${string}`
    ? never
    : T[K] extends Function
    ? never
    : K]: T[K]
}

type Mixed = {
  id: number
  _internal: string
  name: string
  _cache: object
  handler: () => void
  email: string
  _version: number
  callback: () => void
}

type Filtered = ComplexFilter<Mixed>
// 结果：{ id: number; name: string; email: string; }
```

## 7. 🤔 映射类型过滤有哪些实际应用？

### 7.1. 场景 1：API 响应清理

```ts
// API 返回的完整用户数据
type ApiUser = {
  id: number
  username: string
  password: string // 敏感信息
  email: string
  passwordHash: string // 敏感信息
  salt: string // 敏感信息
  createdAt: Date
  _internal: string // 内部字段
}

// 过滤敏感和内部字段
type PublicUser = {
  [K in keyof ApiUser as K extends 'password' | 'passwordHash' | 'salt'
    ? never
    : K extends `_${string}`
    ? never
    : K]: ApiUser[K]
}
// 结果：{ id: number; username: string; email: string; createdAt: Date; }

// 转换函数
function toPublicUser(apiUser: ApiUser): PublicUser {
  const { password, passwordHash, salt, _internal, ...publicData } = apiUser
  return publicData
}
```

### 7.2. 场景 2：表单字段筛选

```ts
// 完整的模型定义
type UserModel = {
  id: number
  createdAt: Date
  updatedAt: Date
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
}

// 创建表单：排除自动生成的字段
type CreateUserForm = {
  [K in keyof UserModel as K extends 'id' | 'createdAt' | 'updatedAt'
    ? never
    : K]: UserModel[K]
}
// 结果：{ username: string; email: string; password: string; firstName: string; lastName: string; }

// 编辑表单：排除 ID 和密码
type EditUserForm = {
  [K in keyof UserModel as K extends
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'password'
    ? never
    : K]+?: UserModel[K]
}
// 结果：可选的 username、email、firstName、lastName
```

### 7.3. 场景 3：事件处理器提取

```ts
type Component = {
  id: string
  name: string
  onClick: () => void
  onHover: () => void
  onChange: (value: string) => void
  value: string
  disabled: boolean
  onBlur: () => void
}

// 只提取事件处理器
type EventHandlers = {
  [K in keyof Component as K extends `on${string}` ? K : never]: Component[K]
}
// 结果：
// {
//   onClick: () => void;
//   onHover: () => void;
//   onChange: (value: string) => void;
//   onBlur: () => void;
// }

// 只提取非事件属性
type Props = {
  [K in keyof Component as K extends `on${string}` ? never : K]: Component[K]
}
// 结果：{ id: string; name: string; value: string; disabled: boolean; }
```

### 7.4. 场景 4：数据库查询字段

```ts
type User = {
  id: number
  username: string
  password: string
  email: string
  createdAt: Date
  updatedAt: Date
}

// 可查询的字段（排除时间戳）
type QueryableFields = {
  [K in keyof User as K extends 'createdAt' | 'updatedAt' ? never : K]: User[K]
}

// 可排序的字段（只包含可比较类型）
type SortableFields = {
  [K in keyof User as User[K] extends number | string | Date
    ? K
    : never]: User[K]
}

// 可搜索的字段（只包含字符串）
type SearchableFields = {
  [K in keyof User as User[K] extends string ? K : never]: User[K]
}
// 结果：{ username: string; password: string; email: string; }

// 构建查询
function buildQuery<K extends keyof SearchableFields>(field: K, value: string) {
  return { [field]: value }
}

const query = buildQuery('username', 'john')
```

### 7.5. 场景 5：配置验证

```ts
type Config = {
  host: string
  port: number
  _debug: boolean
  _internal: string
  database: string
  username: string
  _cache: object
}

// 只保留公共配置（排除内部配置）
type PublicConfig = {
  [K in keyof Config as K extends `_${string}` ? never : K]: Config[K]
}
// 结果：{ host: string; port: number; database: string; username: string; }

// 验证函数
function validateConfig(config: unknown): config is PublicConfig {
  const publicKeys: (keyof PublicConfig)[] = [
    'host',
    'port',
    'database',
    'username',
  ]
  return publicKeys.every((key) => key in (config as any))
}
```

### 7.6. 场景 6：权限过滤

```ts
type User = {
  id: number
  username: string
  email: string
  password: string
  role: 'admin' | 'user'
  salary: number
  address: string
}

// 根据权限级别过滤字段
type ViewableByUser = {
  [K in keyof User as K extends 'password' | 'salary' ? never : K]: User[K]
}

type ViewableByAdmin = User // 管理员可以查看所有字段

// 权限检查函数
function getUserData<T extends 'admin' | 'user'>(
  user: User,
  role: T
): T extends 'admin' ? User : ViewableByUser {
  if (role === 'admin') {
    return user as any
  }
  const { password, salary, ...userData } = user
  return userData as any
}
```

## 8. 🤔 使用过滤时需要注意什么？

### 8.1. 注意事项 1：过滤的不可逆性

一旦键被过滤掉，就无法从类型中恢复。

```ts
type Original = {
  a: string
  b: number
  c: boolean
}

type Filtered = {
  [K in keyof Original as K extends 'b' ? never : K]: Original[K]
}
// 结果：{ a: string; c: boolean; }

// ❌ 无法从 Filtered 恢复 b 属性
type Recovered = Filtered & { b: number } // 可以添加，但不等于 Original
```

### 8.2. 注意事项 2：过滤条件的准确性

过滤条件必须准确，否则可能过滤掉错误的键。

```ts
type User = {
  name: string
  email: string
  nameValidator: () => boolean
}

// ⚠️ 可能过滤掉意外的键
type NoName = {
  [K in keyof User as K extends `${string}name${string}` ? never : K]: User[K]
}
// 结果：{ email: string; } - nameValidator 也被过滤掉了！

// ✅ 更精确的条件
type NoNameExact = {
  [K in keyof User as K extends 'name' ? never : K]: User[K]
}
// 结果：{ email: string; nameValidator: () => boolean; }
```

### 8.3. 注意事项 3：类型安全的边界

过滤后的类型与原类型不兼容。

```ts
type User = {
  id: number
  name: string
  password: string
}

type PublicUser = {
  [K in keyof User as K extends 'password' ? never : K]: User[K]
}

function useUser(user: User) {
  console.log(user.name)
}

const publicUser: PublicUser = { id: 1, name: 'Alice' }

// ❌ 错误：PublicUser 不能赋值给 User
useUser(publicUser) // 类型不匹配

// 需要类型断言或转换
useUser({ ...publicUser, password: '' })
```

### 8.4. 注意事项 4：过滤可能导致空类型

如果过滤条件过于严格，可能得到空对象类型。

```ts
type User = {
  id: number
  name: string
}

// 过滤掉所有键
type Empty = {
  [K in keyof User as never]: User[K]
}
// 结果：{} - 空对象类型

const empty: Empty = {} // ✅ 只能是空对象
const notEmpty: Empty = { x: 1 } // ❌ 错误
```

### 8.5. 注意事项 5：与可选属性的交互

过滤不会改变属性的可选性。

```ts
type User = {
  id: number
  name?: string
  email?: string
  password: string
}

type Filtered = {
  [K in keyof User as K extends 'password' ? never : K]: User[K]
}
// 结果：{ id: number; name?: string; email?: string; }
// name 和 email 仍然是可选的

const user: Filtered = { id: 1 } // ✅ 合法
```

### 8.6. 注意事项 6：性能考虑

复杂的过滤逻辑可能影响编译性能。

```ts
// ⚠️ 性能影响较大
type ComplexFilter<T> = {
  [K in keyof T as K extends `${infer Prefix}_${infer Suffix}`
    ? Prefix extends 'internal'
      ? never
      : T[K] extends Function
      ? never
      : K
    : T[K] extends object
    ? never
    : K]: T[K]
}

// 建议：简化条件或分步过滤
type Step1<T> = {
  [K in keyof T as K extends `internal_${string}` ? never : K]: T[K]
}
type Step2<T> = {
  [K in keyof T as T[K] extends Function ? never : K]: T[K]
}
type SimplerFilter<T> = Step2<Step1<T>>
```

### 8.7. 注意事项 7：过滤与继承

在继承关系中使用过滤需要小心。

```ts
interface Base {
  id: number
  createdAt: Date
}

interface User extends Base {
  name: string
  email: string
}

// 过滤继承的属性
type WithoutBase<T extends Base> = {
  [K in keyof T as K extends keyof Base ? never : K]: T[K]
}

type UserOnly = WithoutBase<User>
// 结果：{ name: string; email: string; }
```

## 9. 🔗 引用

- [TypeScript Handbook - Mapped Types Filtering][1]
- [TypeScript 4.1 - Key Remapping in Mapped Types][2]
- [TypeScript Deep Dive - Advanced Type Filtering][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
[2]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#key-remapping-in-mapped-types
[3]: https://basarat.gitbook.io/typescript/type-system/mapped-types
