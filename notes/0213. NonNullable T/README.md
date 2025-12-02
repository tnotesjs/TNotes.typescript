# [0213. NonNullable T](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0213.%20NonNullable%20T)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 `NonNullable<T>` 是什么？](#3--nonnullablet-是什么)
  - [3.1. 源码定义](#31-源码定义)
  - [3.2. 工作原理](#32-工作原理)
  - [3.3. 基本示例](#33-基本示例)
  - [3.4. 与 strictNullChecks 的关系](#34-与-strictnullchecks-的关系)
- [4. 🤔 如何使用 `NonNullable<T>`？](#4--如何使用-nonnullablet)
  - [4.1. 场景 1：函数参数类型收窄](#41-场景-1函数参数类型收窄)
  - [4.2. 场景 2：数组过滤空值](#42-场景-2数组过滤空值)
  - [4.3. 场景 3：可选链结果处理](#43-场景-3可选链结果处理)
  - [4.4. 场景 4：Promise 结果处理](#44-场景-4promise-结果处理)
- [5. 🤔 `NonNullable<T>` 的实际应用场景有哪些？](#5--nonnullablet-的实际应用场景有哪些)
  - [5.1. 应用 1：表单验证](#51-应用-1表单验证)
  - [5.2. 应用 2：数据库查询结果](#52-应用-2数据库查询结果)
  - [5.3. 应用 3：配置对象合并](#53-应用-3配置对象合并)
  - [5.4. 应用 4：React 组件 Props](#54-应用-4react-组件-props)
  - [5.5. 应用 5：API 响应处理](#55-应用-5api-响应处理)
- [6. 🤔 使用 `NonNullable<T>` 需要注意什么？](#6--使用-nonnullablet-需要注意什么)
  - [6.1. 注意事项 1：仅编译时检查](#61-注意事项-1仅编译时检查)
  - [6.2. 注意事项 2：不移除 void 类型](#62-注意事项-2不移除-void-类型)
  - [6.3. 注意事项 3：对象属性的处理](#63-注意事项-3对象属性的处理)
  - [6.4. 注意事项 4：undefined vs. 可选属性](#64-注意事项-4undefined-vs-可选属性)
  - [6.5. 注意事项 5：泛型约束](#65-注意事项-5泛型约束)
  - [6.6. 注意事项 6：与其他工具类型结合](#66-注意事项-6与其他工具类型结合)
  - [6.7. 注意事项 7：类型守卫的必要性](#67-注意事项-7类型守卫的必要性)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- `NonNullable<T>` 的定义和实现原理
- 与 `null` 和 `undefined` 的关系
- 基本使用方法
- 实际应用场景
- 使用注意事项

## 2. 🫧 评价

`NonNullable<T>` 从类型 `T` 中排除 `null` 和 `undefined`。

## 3. 🤔 `NonNullable<T>` 是什么？

`NonNullable<T>` 从类型 `T` 中移除 `null` 和 `undefined`，构造一个新类型。

- 实现基于 `Exclude<T, null | undefined>`
- 与 `strictNullChecks` 配合使用
- 常用于类型收窄和空值处理
- 不影响运行时行为
- 是类型守卫的补充工具

### 3.1. 源码定义

```ts
type NonNullable<T> = T extends null | undefined ? never : T

// 等价于使用 Exclude
type NonNullable<T> = Exclude<T, null | undefined>
```

### 3.2. 工作原理

```ts
// 展开过程
type Example = NonNullable<string | number | null | undefined>

// 使用 Exclude 的实现
// Exclude<string | number | null | undefined, null | undefined>

// 分布式条件类型
// string extends null | undefined ? never : string     → string
// number extends null | undefined ? never : number     → number
// null extends null | undefined ? never : null         → never
// undefined extends null | undefined ? never : undefined → never

// 结果：string | number
```

### 3.3. 基本示例

```ts
// 移除 null 和 undefined
type MaybeString = string | null | undefined
type DefiniteString = NonNullable<MaybeString> // string

// 联合类型
type MixedUnion = string | number | null | boolean | undefined
type NonNullUnion = NonNullable<MixedUnion> // string | number | boolean

// 保持其他类型不变
type WithVoid = string | null | void
type NonNullWithVoid = NonNullable<WithVoid> // string | void (void 保留)
```

### 3.4. 与 strictNullChecks 的关系

```ts
// 开启 strictNullChecks
// tsconfig.json: { "strictNullChecks": true }

function getValue(): string | null {
  return Math.random() > 0.5 ? 'value' : null
}

const value = getValue()
// value 的类型是 string | null

const nonNullValue: NonNullable<typeof value> = value // ❌ 错误
// 类型 'string | null' 不能赋值给 'string'

// ✅ 需要运行时检查
if (value !== null) {
  const safe: NonNullable<typeof value> = value // string
}
```

## 4. 🤔 如何使用 `NonNullable<T>`？

### 4.1. 场景 1：函数参数类型收窄

```ts
type User = {
  id: number
  name: string
  email: string | null
  phone?: string
}

// 确保 email 不为 null
function sendEmail(user: User & { email: NonNullable<User['email']> }): void {
  console.log('Sending email to:', user.email.toLowerCase())
  // ✅ email 保证是 string
}

const user: User = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
}

// ✅ 有 email
if (user.email !== null) {
  sendEmail({ ...user, email: user.email })
}

// ❌ email 为 null
const userWithoutEmail: User = { id: 2, name: 'Bob', email: null }
sendEmail(userWithoutEmail) // 错误
```

### 4.2. 场景 2：数组过滤空值

```ts
type Item = {
  id: number
  value: string | null
}

const items: Item[] = [
  { id: 1, value: 'a' },
  { id: 2, value: null },
  { id: 3, value: 'c' },
  { id: 4, value: null },
]

// 过滤出非空值
const nonNullItems = items.filter(
  (item): item is Item & { value: NonNullable<Item['value']> } =>
    item.value !== null
)
// 类型：Array<Item & { value: string }>

nonNullItems.forEach((item) => {
  console.log(item.value.toUpperCase()) // ✅ value 保证是 string
})
```

### 4.3. 场景 3：可选链结果处理

```ts
type Config = {
  api?: {
    url?: string
    timeout?: number
  }
}

const config: Config = {
  api: {
    url: 'https://api.example.com',
  },
}

// 可选链返回 string | undefined
const url = config.api?.url
// 类型：string | undefined

// 使用 NonNullable 声明期望的类型
function useUrl(url: NonNullable<typeof url>): void {
  console.log('URL:', url.toUpperCase())
}

// ✅ 运行时检查后使用
if (url !== undefined) {
  useUrl(url)
}

// 或使用断言（确定有值时）
useUrl(url!) // 非空断言
```

### 4.4. 场景 4：Promise 结果处理

```ts
async function fetchUser(id: number): Promise<User | null> {
  // 可能返回 null
  return null
}

async function processUser(id: number): Promise<void> {
  const user = await fetchUser(id)
  // user 的类型是 User | null

  // 使用类型守卫
  if (user !== null) {
    handleValidUser(user) // user 类型被收窄为 User
  }
}

function handleValidUser(user: NonNullable<User | null>): void {
  // user 的类型是 User
  console.log(user.name)
}
```

## 5. 🤔 `NonNullable<T>` 的实际应用场景有哪些？

### 5.1. 应用 1：表单验证

```ts
type FormData = {
  username: string | null
  email: string | null
  password: string | null
  age: number | null
}

// 验证后的表单数据（所有字段都非空）
type ValidatedFormData = {
  [K in keyof FormData]: NonNullable<FormData[K]>
}

class FormValidator {
  validate(data: FormData): ValidatedFormData | null {
    // 验证所有字段非空
    if (
      data.username === null ||
      data.email === null ||
      data.password === null ||
      data.age === null
    ) {
      return null
    }

    return {
      username: data.username,
      email: data.email,
      password: data.password,
      age: data.age,
    }
  }

  submit(data: ValidatedFormData): Promise<void> {
    // 保证所有字段都有值
    console.log('Submit:', {
      username: data.username.trim(),
      email: data.email.toLowerCase(),
      password: data.password,
      age: data.age + 1,
    })
    return Promise.resolve()
  }
}

const validator = new FormValidator()
const formData: FormData = {
  username: 'alice',
  email: 'alice@example.com',
  password: 'secret',
  age: 25,
}

const validated = validator.validate(formData)
if (validated !== null) {
  validator.submit(validated)
}
```

### 5.2. 应用 2：数据库查询结果

```ts
type QueryResult<T> = T | null | undefined

type User = {
  id: number
  name: string
}

class Database {
  async findUser(id: number): Promise<QueryResult<User>> {
    // 可能返回 null 或 undefined
    return { id, name: 'Alice' }
  }

  async requireUser(id: number): Promise<NonNullable<QueryResult<User>>> {
    const user = await this.findUser(id)

    if (user === null || user === undefined) {
      throw new Error(`User ${id} not found`)
    }

    return user
  }

  // 批量查询并过滤空值
  async findMultipleUsers(
    ids: number[]
  ): Promise<NonNullable<QueryResult<User>>[]> {
    const results = await Promise.all(ids.map((id) => this.findUser(id)))

    return results.filter(
      (user): user is NonNullable<QueryResult<User>> => user != null
    )
  }
}

// 使用
const db = new Database()

// 方式 1：手动检查
const maybeUser = await db.findUser(1)
if (maybeUser !== null && maybeUser !== undefined) {
  console.log(maybeUser.name)
}

// 方式 2：使用保证非空的方法
const user = await db.requireUser(1)
console.log(user.name) // ✅ 保证不为 null
```

### 5.3. 应用 3：配置对象合并

```ts
type PartialConfig = {
  host: string | null
  port: number | null
  ssl: boolean | null
  timeout: number | null
}

type RequiredConfig = {
  [K in keyof PartialConfig]: NonNullable<PartialConfig[K]>
}

const defaultConfig: RequiredConfig = {
  host: 'localhost',
  port: 3000,
  ssl: false,
  timeout: 5000,
}

function mergeConfig(partial: PartialConfig): RequiredConfig {
  return {
    host: partial.host ?? defaultConfig.host,
    port: partial.port ?? defaultConfig.port,
    ssl: partial.ssl ?? defaultConfig.ssl,
    timeout: partial.timeout ?? defaultConfig.timeout,
  }
}

// 使用
const userConfig: PartialConfig = {
  host: null,
  port: 8080,
  ssl: null,
  timeout: null,
}

const config = mergeConfig(userConfig)
// config 的类型是 RequiredConfig
console.log(config.host) // 'localhost'
console.log(config.port) // 8080
```

### 5.4. 应用 4：React 组件 Props

```ts
type ComponentProps = {
  title: string | null
  description?: string | null
  onClick?: (() => void) | null
}

// 移除所有 null
type CleanProps = {
  [K in keyof ComponentProps]: NonNullable<ComponentProps[K]>
}

function Component(props: ComponentProps): JSX.Element {
  // 需要检查空值
  const title = props.title ?? 'Default Title'
  const description = props.description ?? ''

  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      <button onClick={props.onClick ?? undefined}>Click</button>
    </div>
  )
}

function ComponentWithCleanProps(props: CleanProps): JSX.Element {
  // 不需要检查空值
  return (
    <div>
      <h1>{props.title}</h1>
      <p>{props.description}</p>
      <button onClick={props.onClick}>Click</button>
    </div>
  )
}

// 包装器确保 props 非空
function withNonNullProps<P extends Record<string, any>>(
  Component: (props: { [K in keyof P]: NonNullable<P[K]> }) => JSX.Element
) {
  return (props: P) => {
    // 过滤 null 值
    const cleanProps = Object.entries(props).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined) {
        acc[key] = value
      }
      return acc
    }, {} as any)

    return Component(cleanProps)
  }
}
```

### 5.5. 应用 5：API 响应处理

```ts
type ApiResponse<T> = {
  data: T | null
  error: string | null
  loading: boolean
}

// 成功响应（data 非空）
type SuccessResponse<T> = ApiResponse<T> & {
  data: NonNullable<T>
  error: null
}

// 错误响应（error 非空）
type ErrorResponse<T> = ApiResponse<T> & {
  data: null
  error: NonNullable<string>
}

class ApiClient {
  async request<T>(url: string): Promise<ApiResponse<T>> {
    return {
      data: null,
      error: null,
      loading: false,
    }
  }

  isSuccess<T>(response: ApiResponse<T>): response is SuccessResponse<T> {
    return response.data !== null && response.error === null
  }

  isError<T>(response: ApiResponse<T>): response is ErrorResponse<T> {
    return response.error !== null
  }

  async fetch<T>(url: string): Promise<T> {
    const response = await this.request<T>(url)

    if (this.isSuccess(response)) {
      return response.data // 类型是 NonNullable<T>
    }

    if (this.isError(response)) {
      throw new Error(response.error) // 类型是 NonNullable<string>
    }

    throw new Error('Invalid response')
  }
}

// 使用
const api = new ApiClient()

const response = await api.request<User>('/api/user/1')

if (api.isSuccess(response)) {
  console.log(response.data.name) // ✅ data 保证非空
}

if (api.isError(response)) {
  console.error(response.error.toUpperCase()) // ✅ error 保证非空
}
```

## 6. 🤔 使用 `NonNullable<T>` 需要注意什么？

### 6.1. 注意事项 1：仅编译时检查

```ts
type MaybeString = string | null

function process(value: NonNullable<MaybeString>): void {
  console.log(value.toUpperCase())
}

// ⚠️ 类型断言不会进行运行时检查
const value: MaybeString = null
process(value as NonNullable<MaybeString>) // 运行时报错

// ✅ 需要运行时检查
if (value !== null) {
  process(value) // 类型收窄后安全
}
```

### 6.2. 注意事项 2：不移除 void 类型

```ts
type WithVoid = string | null | void

type NonNull = NonNullable<WithVoid>
// string | void (void 不会被移除)

// 原因：void 不是 null 或 undefined
// void 表示函数无返回值，是独立的类型
```

### 6.3. 注意事项 3：对象属性的处理

```ts
type User = {
  name: string | null
  email: string | null
}

// ⚠️ NonNullable 只作用于类型本身
type NonNullUser = NonNullable<User> // User (对象本身不是 null)

// ✅ 需要对每个属性应用
type NonNullUserProps = {
  [K in keyof User]: NonNullable<User[K]>
}
// { name: string; email: string; }
```

### 6.4. 注意事项 4：undefined vs. 可选属性

```ts
type WithOptional = {
  required: string | null
  optional?: string | null
}

type NonNullRequired = {
  required: NonNullable<WithOptional['required']>
}
// { required: string }

type NonNullOptional = {
  optional: NonNullable<WithOptional['optional']>
}
// { optional: string } (移除了 | undefined)

// ⚠️ 但可选标记 ? 仍然存在
type MappedNonNull = {
  [K in keyof WithOptional]: NonNullable<WithOptional[K]>
}
// {
//   required: string;
//   optional?: string; // ? 保留，但移除了 | null
// }
```

### 6.5. 注意事项 5：泛型约束

```ts
// ⚠️ 泛型可能已经排除了 null
function process<T extends string>(value: NonNullable<T>): void {
  console.log(value.toUpperCase())
}

// T 已经是 string，NonNullable<T> 还是 string
process('hello')

// ✅ 当泛型可能为 null 时才有用
function processNullable<T extends string | null>(value: NonNullable<T>): void {
  console.log(value.toUpperCase())
}

processNullable<string | null>('hello') // ✅
```

### 6.6. 注意事项 6：与其他工具类型结合

```ts
type User = {
  name: string | null
  age: number | null
}

// Partial + NonNullable
type PartialNonNull = {
  [K in keyof Partial<User>]: NonNullable<Partial<User>[K]>
}
// { name?: string; age?: number; }

// Required + NonNullable
type RequiredNonNull = {
  [K in keyof Required<User>]: NonNullable<User[K]>
}
// { name: string; age: number; }

// ⚠️ 注意应用顺序
type NonNullPartial = Partial<{
  [K in keyof User]: NonNullable<User[K]>
}>
// { name?: string; age?: number; }
```

### 6.7. 注意事项 7：类型守卫的必要性

```ts
type Result = string | null | undefined

function processResult(result: Result): void {
  // ❌ 直接使用不安全
  const nonNull: NonNullable<Result> = result // 编译错误

  // ✅ 方式 1：类型守卫
  if (result !== null && result !== undefined) {
    const safe: NonNullable<Result> = result
    console.log(safe.toUpperCase())
  }

  // ✅ 方式 2：使用 ?? 运算符
  const safe = result ?? 'default'
  console.log(safe.toUpperCase())

  // ✅ 方式 3：类型守卫函数
  function isNonNull<T>(value: T): value is NonNullable<T> {
    return value !== null && value !== undefined
  }

  if (isNonNull(result)) {
    console.log(result.toUpperCase())
  }
}
```

## 7. 🔗 引用

- [TypeScript Utility Types - NonNullable][1]
- [TypeScript Handbook - Null and Undefined][2]
- [TypeScript Deep Dive - Null Checking][3]

[1]: https://www.typescriptlang.org/docs/handbook/utility-types.html#nonnullabletype
[2]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#null-and-undefined
[3]: https://basarat.gitbook.io/typescript/intro/strictnullchecks
