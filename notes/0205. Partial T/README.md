# [0205. Partial T](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0205.%20Partial%20T)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 Partial\<T\> 是什么？](#3--partialt-是什么)
  - [3.1. 源码定义](#31-源码定义)
  - [3.2. 工作原理](#32-工作原理)
  - [3.3. 基本示例](#33-基本示例)
- [4. 🤔 如何使用 Partial\<T\>？](#4--如何使用-partialt)
  - [4.1. 场景 1：函数参数的部分更新](#41-场景-1函数参数的部分更新)
  - [4.2. 场景 2：对象合并](#42-场景-2对象合并)
  - [4.3. 场景 3：表单状态管理](#43-场景-3表单状态管理)
  - [4.4. 场景 4：可选的构造参数](#44-场景-4可选的构造参数)
- [5. 🤔 Partial\<T\> 的实际应用场景有哪些？](#5--partialt-的实际应用场景有哪些)
  - [5.1. 应用 1：REST API 更新端点](#51-应用-1rest-api-更新端点)
  - [5.2. 应用 2：React/Vue 组件 Props](#52-应用-2reactvue-组件-props)
  - [5.3. 应用 3：数据库查询过滤器](#53-应用-3数据库查询过滤器)
  - [5.4. 应用 4：状态管理中的动作](#54-应用-4状态管理中的动作)
  - [5.5. 应用 5：缓存和 Memoization](#55-应用-5缓存和-memoization)
- [6. 🤔 如何实现深度 Partial？](#6--如何实现深度-partial)
  - [6.1. 问题说明](#61-问题说明)
  - [6.2. DeepPartial 实现](#62-deeppartial-实现)
  - [6.3. 处理数组的 DeepPartial](#63-处理数组的-deeppartial)
  - [6.4. 限制深度的 Partial](#64-限制深度的-partial)
- [7. 🤔 使用 Partial\<T\> 需要注意什么？](#7--使用-partialt-需要注意什么)
  - [7.1. 注意事项 1：只影响第一层](#71-注意事项-1只影响第一层)
  - [7.2. 注意事项 2：运行时仍需验证](#72-注意事项-2运行时仍需验证)
  - [7.3. 注意事项 3：与 Required 的配合](#73-注意事项-3与-required-的配合)
  - [7.4. 注意事项 4：与索引签名的交互](#74-注意事项-4与索引签名的交互)
  - [7.5. 注意事项 5：函数参数的类型推断](#75-注意事项-5函数参数的类型推断)
  - [7.6. 注意事项 6：默认值处理](#76-注意事项-6默认值处理)
  - [7.7. 注意事项 7：类型守卫的必要性](#77-注意事项-7类型守卫的必要性)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- `Partial<T>` 的定义和实现原理
- 基本使用方法
- 实际应用场景
- 深度 Partial 实现
- 使用注意事项

## 2. 🫧 评价

`Partial<T>` 是 TypeScript 中最常用的工具类型之一，它将类型的所有属性变为可选。

- 适用于需要部分更新对象的场景
- 实现简单但功能强大
- 只影响第一层属性，嵌套对象需要深度实现
- 与 `Required<T>` 互为相反操作
- 在表单、配置、API 更新等场景中广泛使用

## 3. 🤔 Partial\<T\> 是什么？

`Partial<T>` 将类型 `T` 的所有属性变为可选属性。

### 3.1. 源码定义

```typescript
// TypeScript lib.es5.d.ts 中的定义
type Partial<T> = {
  [P in keyof T]?: T[P]
}
```

### 3.2. 工作原理

```typescript
type User = {
  id: number
  name: string
  email: string
}

// Partial<User> 的展开过程：
// 1. keyof User = 'id' | 'name' | 'email'
// 2. [P in 'id' | 'name' | 'email']?: User[P]
// 3. 结果：
type PartialUser = Partial<User>
// {
//   id?: number;
//   name?: string;
//   email?: string;
// }
```

### 3.3. 基本示例

```typescript
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

## 4. 🤔 如何使用 Partial\<T\>？

### 4.1. 场景 1：函数参数的部分更新

```typescript
type User = {
  id: number
  name: string
  email: string
  age: number
}

// 更新用户信息，只需要提供要更改的字段
function updateUser(id: number, updates: Partial<User>): User {
  const currentUser = getUserById(id)
  return { ...currentUser, ...updates }
}

// ✅ 只更新 name
updateUser(1, { name: 'Alice' })

// ✅ 只更新 email 和 age
updateUser(1, { email: 'alice@example.com', age: 25 })

// ✅ 可以不更新任何字段
updateUser(1, {})

// ❌ 不能提供不存在的属性
updateUser(1, { nickname: 'Ali' }) // 错误

declare function getUserById(id: number): User
```

### 4.2. 场景 2：对象合并

```typescript
type Config = {
  host: string
  port: number
  timeout: number
  retries: number
}

const defaultConfig: Config = {
  host: 'localhost',
  port: 3000,
  timeout: 5000,
  retries: 3,
}

// 允许用户覆盖部分配置
function createConfig(userConfig: Partial<Config>): Config {
  return { ...defaultConfig, ...userConfig }
}

const config1 = createConfig({ port: 8080 })
// { host: 'localhost', port: 8080, timeout: 5000, retries: 3 }

const config2 = createConfig({ host: '0.0.0.0', timeout: 10000 })
// { host: '0.0.0.0', port: 3000, timeout: 10000, retries: 3 }
```

### 4.3. 场景 3：表单状态管理

```typescript
type FormData = {
  username: string
  email: string
  password: string
  confirmPassword: string
}

type FormState = {
  values: Partial<FormData> // 表单值可能不完整
  errors: Partial<Record<keyof FormData, string>> // 错误信息
  touched: Partial<Record<keyof FormData, boolean>> // 是否被访问
}

const initialState: FormState = {
  values: {},
  errors: {},
  touched: {},
}

// 更新表单字段
function updateField(
  state: FormState,
  field: keyof FormData,
  value: string
): FormState {
  return {
    ...state,
    values: { ...state.values, [field]: value },
    touched: { ...state.touched, [field]: true },
  }
}
```

### 4.4. 场景 4：可选的构造参数

```typescript
type UserConfig = {
  theme: 'light' | 'dark'
  language: 'en' | 'zh'
  notifications: boolean
  autoSave: boolean
}

class UserSettings {
  private config: UserConfig

  constructor(config: Partial<UserConfig> = {}) {
    // 提供默认值
    this.config = {
      theme: 'light',
      language: 'en',
      notifications: true,
      autoSave: false,
      ...config, // 用户配置覆盖默认值
    }
  }

  getConfig(): UserConfig {
    return this.config
  }
}

// ✅ 可以不提供任何参数
const settings1 = new UserSettings()

// ✅ 只提供部分配置
const settings2 = new UserSettings({ theme: 'dark' })
const settings3 = new UserSettings({ theme: 'dark', autoSave: true })
```

## 5. 🤔 Partial\<T\> 的实际应用场景有哪些？

### 5.1. 应用 1：REST API 更新端点

```typescript
type User = {
  id: number
  username: string
  email: string
  avatar: string
  createdAt: Date
}

// PATCH 端点，允许部分更新
async function patchUser(id: number, updates: Partial<User>): Promise<User> {
  const response = await fetch(`/api/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  return response.json()
}

// ✅ 只更新用户名
await patchUser(1, { username: 'newname' })

// ✅ 更新多个字段
await patchUser(1, {
  username: 'alice',
  email: 'alice@example.com',
  avatar: '/avatars/alice.jpg',
})
```

### 5.2. 应用 2：React/Vue 组件 Props

```typescript
type ButtonProps = {
  text: string
  onClick: () => void
  type: 'primary' | 'secondary' | 'danger'
  disabled: boolean
  loading: boolean
  size: 'small' | 'medium' | 'large'
}

// 提供默认值，用户只需传入需要覆盖的 props
function Button(props: Partial<ButtonProps>): JSX.Element {
  const {
    text = 'Click me',
    onClick = () => {},
    type = 'primary',
    disabled = false,
    loading = false,
    size = 'medium',
  } = props

  // 组件实现...
  return <button>{text}</button>
}

// ✅ 可以不传任何 props
;<Button />

// ✅ 只传部分 props
;<Button text="Submit" type="primary" />
```

### 5.3. 应用 3：数据库查询过滤器

```typescript
type User = {
  id: number
  username: string
  email: string
  age: number
  role: 'admin' | 'user'
  active: boolean
}

// 查询条件是可选的
type UserFilter = Partial<User>

async function findUsers(filter: UserFilter): Promise<User[]> {
  // 构建查询
  const query = Object.entries(filter)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${key} = ${value}`)
    .join(' AND ')

  // 执行查询...
  return []
}

// ✅ 根据不同条件查询
await findUsers({ role: 'admin' })
await findUsers({ active: true, age: 25 })
await findUsers({ username: 'alice', email: 'alice@example.com' })
```

### 5.4. 应用 4：状态管理中的动作

```typescript
type State = {
  user: User | null
  isLoading: boolean
  error: string | null
  data: any[]
}

// 状态更新可以是部分的
type UpdateStateAction = {
  type: 'UPDATE_STATE'
  payload: Partial<State>
}

function reducer(state: State, action: UpdateStateAction): State {
  if (action.type === 'UPDATE_STATE') {
    return { ...state, ...action.payload }
  }
  return state
}

// ✅ 只更新部分状态
reducer(state, {
  type: 'UPDATE_STATE',
  payload: { isLoading: true },
})

reducer(state, {
  type: 'UPDATE_STATE',
  payload: { user: newUser, isLoading: false },
})
```

### 5.5. 应用 5：缓存和 Memoization

```typescript
type ExpensiveComputationParams = {
  input: string
  options: {
    caseInsensitive: boolean
    trimWhitespace: boolean
    maxLength: number
  }
}

// 缓存键可能不包含所有参数
type CacheKey = Partial<ExpensiveComputationParams>

const cache = new Map<string, any>()

function getCacheKey(key: CacheKey): string {
  return JSON.stringify(key)
}

function memoize(params: ExpensiveComputationParams): any {
  const key = getCacheKey(params)
  if (cache.has(key)) {
    return cache.get(key)
  }
  const result = expensiveComputation(params)
  cache.set(key, result)
  return result
}

declare function expensiveComputation(params: ExpensiveComputationParams): any
```

## 6. 🤔 如何实现深度 Partial？

### 6.1. 问题说明

```typescript
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
    // ❌ 错误：name 是必需的
    address: {
      street: '123 Main St',
      // ❌ 错误：city 是必需的
    },
  },
}
```

### 6.2. DeepPartial 实现

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepPartial<T[P]>
    : T[P]
}

type DeepPartialUser = DeepPartial<User>
// {
//   id?: number;
//   profile?: {
//     name?: string;
//     address?: {
//       street?: string;
//       city?: string;
//     };
//   };
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

### 6.3. 处理数组的 DeepPartial

```typescript
type DeepPartialWithArray<T> = T extends Array<infer U>
  ? Array<DeepPartialWithArray<U>>
  : T extends object
  ? T extends Function
    ? T
    : { [P in keyof T]?: DeepPartialWithArray<T[P]> }
  : T

type UserWithTags = {
  id: number
  name: string
  tags: Array<{ id: number; name: string }>
}

type DeepPartialUserWithTags = DeepPartialWithArray<UserWithTags>
// {
//   id?: number;
//   name?: string;
//   tags?: Array<{ id?: number; name?: string; }>;
// }
```

### 6.4. 限制深度的 Partial

```typescript
// 防止无限递归
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

## 7. 🤔 使用 Partial\<T\> 需要注意什么？

### 7.1. 注意事项 1：只影响第一层

```typescript
type Config = {
  server: {
    host: string
    port: number
  }
  database: {
    url: string
    timeout: number
  }
}

type PartialConfig = Partial<Config>

// ❌ server 内部的属性仍然是必需的
const config: PartialConfig = {
  server: {
    host: 'localhost',
    // 错误：缺少 port
  },
}

// ✅ 正确：要么不提供 server，要么提供完整的 server
const config1: PartialConfig = {}
const config2: PartialConfig = {
  server: { host: 'localhost', port: 3000 },
}
```

### 7.2. 注意事项 2：运行时仍需验证

```typescript
type User = {
  id: number
  name: string
  email: string
}

function updateUser(updates: Partial<User>): void {
  // ⚠️ 虽然类型上 name 可能不存在，但运行时可能有值
  if (updates.name) {
    console.log(updates.name.toUpperCase()) // 需要检查
  }

  // ❌ 错误：可能是 undefined
  console.log(updates.name.toUpperCase()) // 类型错误
}
```

### 7.3. 注意事项 3：与 Required 的配合

```typescript
type User = {
  id: number
  name?: string // 原本就是可选的
  email: string
}

type PartialUser = Partial<User>
// { id?: number; name?: string; email?: string; }

type RequiredUser = Required<User>
// { id: number; name: string; email: string; }

// 先 Partial 再 Required 会使所有属性必需
type AllRequired = Required<Partial<User>>
// { id: number; name: string; email: string; }
```

### 7.4. 注意事项 4：与索引签名的交互

```typescript
type Dict = {
  [key: string]: number
  count: number
}

type PartialDict = Partial<Dict>
// {
//   [key: string]: number; // ⚠️ 索引签名不受影响
//   count?: number;
// }

const dict: PartialDict = {
  count: 10,
  other: 20, // ✅ 索引签名仍然有效
}
```

### 7.5. 注意事项 5：函数参数的类型推断

```typescript
type User = {
  id: number
  name: string
}

// ❌ 可能导致类型丢失
function bad<T>(obj: Partial<T>): T {
  return obj as T // 不安全的断言
}

// ✅ 更安全的做法
function good<T>(base: T, updates: Partial<T>): T {
  return { ...base, ...updates }
}
```

### 7.6. 注意事项 6：默认值处理

```typescript
type Config = {
  host: string
  port: number
  timeout: number
}

// ⚠️ 需要确保所有必需属性都有默认值
function createConfig(options: Partial<Config> = {}): Config {
  return {
    host: options.host ?? 'localhost',
    port: options.port ?? 3000,
    timeout: options.timeout ?? 5000,
  }
}

// 或者使用对象展开和默认值
function createConfig2(options: Partial<Config> = {}): Config {
  const defaults: Config = {
    host: 'localhost',
    port: 3000,
    timeout: 5000,
  }
  return { ...defaults, ...options }
}
```

### 7.7. 注意事项 7：类型守卫的必要性

```typescript
type User = {
  id: number
  name: string
  email: string
}

// 类型守卫：检查是否是完整的 User
function isFullUser(user: Partial<User>): user is User {
  return (
    typeof user.id === 'number' &&
    typeof user.name === 'string' &&
    typeof user.email === 'string'
  )
}

function processUser(user: Partial<User>): void {
  if (isFullUser(user)) {
    // ✅ 这里 user 是完整的 User 类型
    console.log(user.name.toUpperCase())
    console.log(user.email.toLowerCase())
  } else {
    console.log('Incomplete user data')
  }
}
```

## 8. 🔗 引用

- [TypeScript Utility Types - Partial][1]
- [TypeScript Handbook - Mapped Types][2]
- [TypeScript lib.es5.d.ts Source][3]

[1]: https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype
[2]: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
[3]: https://github.com/microsoft/TypeScript/blob/main/lib/lib.es5.d.ts
