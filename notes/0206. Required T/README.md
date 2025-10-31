# [0206. Required T](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0206.%20Required%20T)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 Required\<T\> 是什么？](#3--requiredt-是什么)
  - [3.1. 源码定义](#31-源码定义)
  - [3.2. 工作原理](#32-工作原理)
  - [3.3. 基本示例](#33-基本示例)
  - [3.4. Required 与 Partial 的对比](#34-required-与-partial-的对比)
- [4. 🤔 如何使用 Required\<T\>？](#4--如何使用-requiredt)
  - [4.1. 场景 1：表单验证](#41-场景-1表单验证)
  - [4.2. 场景 2：配置对象的完整性检查](#42-场景-2配置对象的完整性检查)
  - [4.3. 场景 3：API 响应处理](#43-场景-3api-响应处理)
  - [4.4. 场景 4：状态初始化](#44-场景-4状态初始化)
- [5. 🤔 Required\<T\> 的实际应用场景有哪些？](#5--requiredt-的实际应用场景有哪些)
  - [5.1. 应用 1：环境变量验证](#51-应用-1环境变量验证)
  - [5.2. 应用 2：ORM 模型验证](#52-应用-2orm-模型验证)
  - [5.3. 应用 3：测试工厂函数](#53-应用-3测试工厂函数)
  - [5.4. 应用 4：构建器模式](#54-应用-4构建器模式)
  - [5.5. 应用 5：数据迁移和转换](#55-应用-5数据迁移和转换)
- [6. 🤔 如何实现深度 Required？](#6--如何实现深度-required)
  - [6.1. 问题说明](#61-问题说明)
  - [6.2. DeepRequired 实现](#62-deeprequired-实现)
  - [6.3. 处理数组的 DeepRequired](#63-处理数组的-deeprequired)
  - [6.4. 选择性 Required](#64-选择性-required)
- [7. 🤔 使用 Required\<T\> 需要注意什么？](#7--使用-requiredt-需要注意什么)
  - [7.1. 注意事项 1：只影响第一层](#71-注意事项-1只影响第一层)
  - [7.2. 注意事项 2：运行时类型守卫](#72-注意事项-2运行时类型守卫)
  - [7.3. 注意事项 3：与 Partial 的组合](#73-注意事项-3与-partial-的组合)
  - [7.4. 注意事项 4：readonly 属性的保留](#74-注意事项-4readonly-属性的保留)
  - [7.5. 注意事项 5：undefined 的处理](#75-注意事项-5undefined-的处理)
  - [7.6. 注意事项 6：函数类型的处理](#76-注意事项-6函数类型的处理)
  - [7.7. 注意事项 7：联合类型的处理](#77-注意事项-7联合类型的处理)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- `Required<T>` 的定义和实现原理
- 基本使用方法
- 实际应用场景
- 深度 Required 实现
- 使用注意事项

## 2. 🫧 评价

`Required<T>` 是 `Partial<T>` 的反向操作，将类型的所有可选属性变为必需。

- 适用于需要确保所有属性都存在的场景
- 使用 `-?` 修饰符移除可选标记
- 只影响第一层属性，嵌套对象需要深度实现
- 常用于表单验证、数据完整性检查等场景
- 与类型守卫配合可以实现运行时验证

## 3. 🤔 Required\<T\> 是什么？

`Required<T>` 将类型 `T` 的所有可选属性变为必需属性。

### 3.1. 源码定义

```typescript
// TypeScript lib.es5.d.ts 中的定义
type Required<T> = {
  [P in keyof T]-?: T[P]
}
```

### 3.2. 工作原理

```typescript
type User = {
  id?: number
  name?: string
  email?: string
}

// Required<User> 的展开过程：
// 1. keyof User = 'id' | 'name' | 'email'
// 2. [P in 'id' | 'name' | 'email']-?: User[P]
// 3. -? 表示移除可选修饰符
// 4. 结果：
type RequiredUser = Required<User>
// {
//   id: number;
//   name: string;
//   email: string;
// }
```

### 3.3. 基本示例

```typescript
type Config = {
  host?: string
  port?: number
  timeout?: number
}

type RequiredConfig = Required<Config>
// { host: string; port: number; timeout: number; }

// ❌ 所有属性都是必需的
const config1: RequiredConfig = { host: 'localhost' } // 错误：缺少 port 和 timeout

// ✅ 必须提供所有属性
const config2: RequiredConfig = {
  host: 'localhost',
  port: 3000,
  timeout: 5000,
}
```

### 3.4. Required 与 Partial 的对比

```typescript
type User = {
  id: number
  name?: string
  email?: string
}

// Partial：所有属性变为可选
type PartialUser = Partial<User>
// { id?: number; name?: string; email?: string; }

// Required：所有属性变为必需
type RequiredUser = Required<User>
// { id: number; name: string; email: string; }

// 组合使用
type AllOptional = Partial<RequiredUser>
// { id?: number; name?: string; email?: string; }

type AllRequired = Required<PartialUser>
// { id: number; name: string; email: string; }
```

## 4. 🤔 如何使用 Required\<T\>？

### 4.1. 场景 1：表单验证

```typescript
type FormData = {
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
}

// 验证函数：确保所有字段都已填写
function validateForm(data: FormData): data is Required<FormData> {
  return (
    typeof data.username === 'string' &&
    data.username.length > 0 &&
    typeof data.email === 'string' &&
    data.email.includes('@') &&
    typeof data.password === 'string' &&
    data.password.length >= 8 &&
    data.password === data.confirmPassword
  )
}

function submitForm(data: FormData): void {
  if (validateForm(data)) {
    // ✅ 这里 data 是 Required<FormData> 类型
    console.log('Username:', data.username.toUpperCase())
    console.log('Email:', data.email.toLowerCase())
    // 可以安全访问所有属性
  } else {
    console.error('Form validation failed')
  }
}
```

### 4.2. 场景 2：配置对象的完整性检查

```typescript
type DatabaseConfig = {
  host?: string
  port?: number
  username?: string
  password?: string
  database?: string
}

// 运行时需要完整的配置
function connectToDatabase(config: Required<DatabaseConfig>): void {
  console.log(`Connecting to ${config.host}:${config.port}`)
  console.log(`Database: ${config.database}`)
  console.log(`User: ${config.username}`)
  // 所有属性都保证存在
}

// 构建配置时可以是部分的
const partialConfig: DatabaseConfig = {
  host: 'localhost',
  port: 5432,
}

// 添加默认值生成完整配置
function buildFullConfig(partial: DatabaseConfig): Required<DatabaseConfig> {
  return {
    host: partial.host ?? 'localhost',
    port: partial.port ?? 5432,
    username: partial.username ?? 'admin',
    password: partial.password ?? '',
    database: partial.database ?? 'mydb',
  }
}

const fullConfig = buildFullConfig(partialConfig)
connectToDatabase(fullConfig)
```

### 4.3. 场景 3：API 响应处理

```typescript
type ApiUser = {
  id: number
  username: string
  email?: string
  avatar?: string
  bio?: string
}

// API 返回的可能是部分数据
function fetchUser(id: number): Promise<ApiUser> {
  return fetch(`/api/users/${id}`).then((res) => res.json())
}

// 确保用户资料完整后才显示
async function displayFullProfile(userId: number): Promise<void> {
  const user = await fetchUser(userId)

  // 类型守卫：检查是否有完整信息
  if (isCompleteProfile(user)) {
    // ✅ user 是 Required<ApiUser> 类型
    renderProfile({
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
    })
  } else {
    console.log('Profile incomplete, redirecting to settings...')
  }
}

function isCompleteProfile(user: ApiUser): user is Required<ApiUser> {
  return Boolean(user.email && user.avatar && user.bio)
}

declare function renderProfile(user: Required<ApiUser>): void
```

### 4.4. 场景 4：状态初始化

```typescript
type AppState = {
  user?: {
    id: number
    name: string
  }
  theme?: 'light' | 'dark'
  language?: string
  isAuthenticated?: boolean
}

// 初始化应用需要完整的状态
function initializeApp(state: Required<AppState>): void {
  console.log('User:', state.user.name)
  console.log('Theme:', state.theme)
  console.log('Language:', state.language)
  console.log('Authenticated:', state.isAuthenticated)
}

// 提供默认状态
const defaultState: Required<AppState> = {
  user: { id: 0, name: 'Guest' },
  theme: 'light',
  language: 'en',
  isAuthenticated: false,
}

// 用户配置可能是部分的
const userPreferences: AppState = {
  theme: 'dark',
  language: 'zh',
}

// 合并后初始化
const initialState: Required<AppState> = {
  ...defaultState,
  ...userPreferences,
}

initializeApp(initialState)
```

## 5. 🤔 Required\<T\> 的实际应用场景有哪些？

### 5.1. 应用 1：环境变量验证

```typescript
type EnvConfig = {
  NODE_ENV?: string
  PORT?: string
  DATABASE_URL?: string
  API_KEY?: string
  SECRET_KEY?: string
}

// 确保所有必需的环境变量都存在
function validateEnv(env: EnvConfig): env is Required<EnvConfig> {
  const required: Array<keyof Required<EnvConfig>> = [
    'NODE_ENV',
    'PORT',
    'DATABASE_URL',
    'API_KEY',
    'SECRET_KEY',
  ]

  for (const key of required) {
    if (!env[key]) {
      console.error(`Missing required environment variable: ${key}`)
      return false
    }
  }

  return true
}

// 启动应用前验证
function startApp(env: EnvConfig): void {
  if (!validateEnv(env)) {
    throw new Error('Invalid environment configuration')
  }

  // ✅ env 现在是 Required<EnvConfig> 类型
  const port = parseInt(env.PORT, 10)
  console.log(`Starting server on port ${port}`)
  console.log(`Environment: ${env.NODE_ENV}`)
  console.log(`Database: ${env.DATABASE_URL}`)
}
```

### 5.2. 应用 2：ORM 模型验证

```typescript
type UserModel = {
  id?: number
  username?: string
  email?: string
  createdAt?: Date
  updatedAt?: Date
}

// 从数据库查询返回的是完整的记录
type UserRecord = Required<UserModel>

// 创建时某些字段是可选的（如 id 和时间戳由数据库生成）
type CreateUserDto = Pick<UserModel, 'username' | 'email'>

class UserRepository {
  async findById(id: number): Promise<UserRecord | null> {
    // 数据库查询...
    const row = await db.query('SELECT * FROM users WHERE id = ?', [id])
    return row as UserRecord // 保证返回完整记录
  }

  async create(data: CreateUserDto): Promise<UserRecord> {
    const now = new Date()
    const record: UserRecord = {
      id: generateId(),
      username: data.username!,
      email: data.email!,
      createdAt: now,
      updatedAt: now,
    }
    await db.insert('users', record)
    return record
  }
}

declare const db: any
declare function generateId(): number
```

### 5.3. 应用 3：测试工厂函数

```typescript
type User = {
  id?: number
  username?: string
  email?: string
  role?: 'admin' | 'user'
  active?: boolean
}

// 测试时需要完整的用户对象
function createTestUser(overrides: User = {}): Required<User> {
  const defaults: Required<User> = {
    id: Math.floor(Math.random() * 10000),
    username: `user_${Date.now()}`,
    email: `user_${Date.now()}@test.com`,
    role: 'user',
    active: true,
  }

  return { ...defaults, ...overrides }
}

// 测试中使用
describe('User Service', () => {
  it('should create a user', () => {
    const user = createTestUser({ username: 'alice', role: 'admin' })
    // user 是完整的 Required<User> 类型
    expect(user.id).toBeDefined()
    expect(user.username).toBe('alice')
    expect(user.email).toContain('@test.com')
  })
})

declare function describe(name: string, fn: () => void): void
declare function it(name: string, fn: () => void): void
declare const expect: any
```

### 5.4. 应用 4：构建器模式

```typescript
type Product = {
  id?: number
  name?: string
  price?: number
  category?: string
  description?: string
}

class ProductBuilder {
  private product: Product = {}

  setId(id: number): this {
    this.product.id = id
    return this
  }

  setName(name: string): this {
    this.product.name = name
    return this
  }

  setPrice(price: number): this {
    this.product.price = price
    return this
  }

  setCategory(category: string): this {
    this.product.category = category
    return this
  }

  setDescription(description: string): this {
    this.product.description = description
    return this
  }

  // 确保所有属性都已设置
  build(): Required<Product> {
    if (
      !this.product.id ||
      !this.product.name ||
      !this.product.price ||
      !this.product.category ||
      !this.product.description
    ) {
      throw new Error('Product is incomplete')
    }

    return this.product as Required<Product>
  }
}

// 使用
const product = new ProductBuilder()
  .setId(1)
  .setName('iPhone')
  .setPrice(999)
  .setCategory('Electronics')
  .setDescription('A smartphone')
  .build() // 返回 Required<Product>
```

### 5.5. 应用 5：数据迁移和转换

```typescript
type LegacyUser = {
  id: number
  name?: string
  mail?: string // 旧字段名
}

type ModernUser = {
  id: number
  username: string
  email: string
}

// 迁移函数：确保转换后的数据完整
function migrateUser(legacy: LegacyUser): Required<ModernUser> | null {
  // 验证必需字段
  if (!legacy.name || !legacy.mail) {
    console.error(`Cannot migrate user ${legacy.id}: missing data`)
    return null
  }

  return {
    id: legacy.id,
    username: legacy.name,
    email: legacy.mail,
  }
}

// 批量迁移
function migrateUsers(legacyUsers: LegacyUser[]): Required<ModernUser>[] {
  return legacyUsers
    .map(migrateUser)
    .filter((user): user is Required<ModernUser> => user !== null)
}
```

## 6. 🤔 如何实现深度 Required？

### 6.1. 问题说明

```typescript
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
// {
//   id: number;
//   profile: {        // ✅ profile 是必需的
//     name?: string;  // ❌ 但 name 仍然是可选的
//     address?: {
//       city?: string;
//       country?: string;
//     };
//   };
// }
```

### 6.2. DeepRequired 实现

```typescript
type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepRequired<T[P]>
    : T[P]
}

type DeepRequiredUser = DeepRequired<User>
// {
//   id: number;
//   profile: {
//     name: string;
//     address: {
//       city: string;
//       country: string;
//     };
//   };
// }

const user: DeepRequiredUser = {
  id: 1,
  profile: {
    name: 'Alice',
    address: {
      city: 'NYC',
      country: 'USA',
    },
  },
}
```

### 6.3. 处理数组的 DeepRequired

```typescript
type DeepRequiredWithArray<T> = T extends Array<infer U>
  ? Array<DeepRequiredWithArray<U>>
  : T extends object
  ? T extends Function
    ? T
    : { [P in keyof T]-?: DeepRequiredWithArray<T[P]> }
  : T

type UserWithTags = {
  id?: number
  name?: string
  tags?: Array<{ id?: number; name?: string }>
}

type DeepRequiredUserWithTags = DeepRequiredWithArray<UserWithTags>
// {
//   id: number;
//   name: string;
//   tags: Array<{ id: number; name: number; }>;
// }
```

### 6.4. 选择性 Required

```typescript
// 只让指定的属性变为必需
type RequireKeys<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>

type User = {
  id?: number
  name?: string
  email?: string
  age?: number
}

// 只让 id 和 name 变为必需
type UserWithRequiredIdName = RequireKeys<User, 'id' | 'name'>
// { id: number; name: string; email?: string; age?: number; }

const user: UserWithRequiredIdName = {
  id: 1,
  name: 'Alice',
  // email 和 age 仍然是可选的
}
```

## 7. 🤔 使用 Required\<T\> 需要注意什么？

### 7.1. 注意事项 1：只影响第一层

```typescript
type Config = {
  server?: {
    host?: string
    port?: number
  }
}

type RequiredConfig = Required<Config>
// {
//   server: {        // ✅ server 必需
//     host?: string; // ❌ host 仍然可选
//     port?: number;
//   };
// }

// ✅ 必须提供 server
const config: RequiredConfig = {
  server: {}, // 可以是空对象
}
```

### 7.2. 注意事项 2：运行时类型守卫

```typescript
type User = {
  id?: number
  name?: string
}

function processUser(user: User): void {
  // ❌ 类型守卫需要运行时检查
  if (user.id && user.name) {
    // 这里 user 不会自动变为 Required<User>
    const id: number = user.id // ✅ 类型收窄有效
    const name: string = user.name // ✅ 类型收窄有效
  }
}

// ✅ 使用显式类型守卫
function isCompleteUser(user: User): user is Required<User> {
  return typeof user.id === 'number' && typeof user.name === 'string'
}

function processUser2(user: User): void {
  if (isCompleteUser(user)) {
    // ✅ user 是 Required<User> 类型
    const id: number = user.id
    const name: string = user.name
  }
}
```

### 7.3. 注意事项 3：与 Partial 的组合

```typescript
type User = {
  id?: number
  name: string // 原本就是必需的
}

type AllRequired = Required<User>
// { id: number; name: string; }

type AllOptional = Partial<Required<User>>
// { id?: number; name?: string; }

// 组合顺序很重要
type Step1 = Required<User> // { id: number; name: string; }
type Step2 = Partial<Step1> // { id?: number; name?: string; }
```

### 7.4. 注意事项 4：readonly 属性的保留

```typescript
type User = {
  readonly id?: number
  name?: string
}

type RequiredUser = Required<User>
// { readonly id: number; name: string; }
// ⚠️ readonly 修饰符被保留

const user: RequiredUser = {
  id: 1,
  name: 'Alice',
}

// ❌ id 仍然是只读的
user.id = 2 // 错误
```

### 7.5. 注意事项 5：undefined 的处理

```typescript
type User = {
  id?: number
  name?: string
}

type RequiredUser = Required<User>

// ❌ undefined 不满足 Required
const user1: RequiredUser = {
  id: undefined, // 错误：类型是 undefined
  name: 'Alice',
}

// ✅ 必须提供实际值
const user2: RequiredUser = {
  id: 1,
  name: 'Alice',
}
```

### 7.6. 注意事项 6：函数类型的处理

```typescript
type Mixed = {
  name?: string
  handler?: () => void
}

type RequiredMixed = Required<Mixed>
// { name: string; handler: () => void; }

const obj: RequiredMixed = {
  name: 'test',
  handler: () => console.log('hello'),
}

// ✅ handler 必须存在
obj.handler() // 安全调用
```

### 7.7. 注意事项 7：联合类型的处理

```typescript
type A = { a?: number }
type B = { b?: string }

type UnionType = A | B

type RequiredUnion = Required<UnionType>
// Required<A> | Required<B>
// { a: number; } | { b: string; }

const value1: RequiredUnion = { a: 1 } // ✅
const value2: RequiredUnion = { b: 'x' } // ✅
const value3: RequiredUnion = { a: 1, b: 'x' } // ❌ 不匹配任何一个
```

## 8. 🔗 引用

- [TypeScript Utility Types - Required][1]
- [TypeScript Handbook - Mapped Types][2]
- [TypeScript lib.es5.d.ts Source][3]

[1]: https://www.typescriptlang.org/docs/handbook/utility-types.html#requiredtype
[2]: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
[3]: https://github.com/microsoft/TypeScript/blob/main/lib/lib.es5.d.ts
