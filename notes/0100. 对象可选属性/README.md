# [0100. 对象可选属性](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0100.%20%E5%AF%B9%E8%B1%A1%E5%8F%AF%E9%80%89%E5%B1%9E%E6%80%A7)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是可选属性？](#3--什么是可选属性)
- [4. 🤔 如何声明可选属性？](#4--如何声明可选属性)
  - [4.1. 接口中的可选属性](#41-接口中的可选属性)
  - [4.2. 类型别名中的可选属性](#42-类型别名中的可选属性)
  - [4.3. 类中的可选属性](#43-类中的可选属性)
  - [4.4. 函数参数中的可选属性](#44-函数参数中的可选属性)
- [5. 🤔 可选属性的特性](#5--可选属性的特性)
  - [5.1. 可选属性的类型](#51-可选属性的类型)
  - [5.2. 属性存在性检查](#52-属性存在性检查)
  - [5.3. 默认值处理](#53-默认值处理)
  - [5.4. 解构赋值的默认值](#54-解构赋值的默认值)
- [6. 🤔 Partial 工具类型](#6--partial-工具类型)
  - [6.1. `Partial<T>`](#61-partialt)
  - [6.2. 部分可选](#62-部分可选)
  - [6.3. `Required<T>`](#63-requiredt)
- [7. 🤔 可选属性 vs undefined](#7--可选属性-vs-undefined)
  - [7.1. 类型差异](#71-类型差异)
  - [7.2. 实际对比](#72-实际对比)
  - [7.3. exactOptionalPropertyTypes](#73-exactoptionalpropertytypes)
- [8. 🤔 可选链操作符](#8--可选链操作符)
  - [8.1. 访问可选属性](#81-访问可选属性)
  - [8.2. 可选方法调用](#82-可选方法调用)
  - [8.3. 可选索引访问](#83-可选索引访问)
- [9. 🤔 常见使用场景](#9--常见使用场景)
  - [9.1. 场景 1：配置对象](#91-场景-1配置对象)
  - [9.2. 场景 2：API 请求参数](#92-场景-2api-请求参数)
  - [9.3. 场景 3：部分更新](#93-场景-3部分更新)
  - [9.4. 场景 4：表单数据](#94-场景-4表单数据)
  - [9.5. 场景 5：React 组件 Props](#95-场景-5react-组件-props)
  - [9.6. 场景 6：数据库查询](#96-场景-6数据库查询)
  - [9.7. 场景 7：事件监听器选项](#97-场景-7事件监听器选项)
- [10. 🤔 常见错误和最佳实践](#10--常见错误和最佳实践)
  - [10.1. 错误 1：忘记检查可选属性](#101-错误-1忘记检查可选属性)
  - [10.2. 错误 2：混淆可选属性和 undefined](#102-错误-2混淆可选属性和-undefined)
  - [10.3. 错误 3：过度使用可选属性](#103-错误-3过度使用可选属性)
  - [10.4. 最佳实践](#104-最佳实践)
- [11. 🔗 引用](#11--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 可选属性的定义和语法
- `?` 修饰符的使用
- Partial 工具类型
- 可选属性与 undefined 的关系
- 可选链操作符
- 实际应用场景

## 2. 🫧 评价

可选属性（Optional Property）使用 `?` 修饰符，表示对象的某个属性**可以存在也可以不存在**。

可选属性的特点：

- **灵活性**：属性可有可无
- **类型安全**：访问时需要检查是否存在
- **常见场景**：配置对象、API 参数、部分更新

在 TypeScript 中，可选属性：

- 类型是 `T | undefined`
- 可以不提供该属性
- 访问时可能是 `undefined`
- 需要类型守卫或可选链

理解可选属性，能帮助你：

1. 设计灵活的 API 接口
2. 处理不确定的数据结构
3. 实现部分更新逻辑
4. 编写更健壮的代码

可选属性是 TypeScript 中最常用的特性之一，是构建灵活 API 的基础。

## 3. 🤔 什么是可选属性？

可选属性使用 `?` 修饰符，表示属性**可以不存在**。

```ts
// ✅ 可选属性
interface User {
  name: string // 必需
  age?: number // 可选
  email?: string // 可选
}

// ✅ 可以不提供可选属性
const user1: User = {
  name: 'Alice',
  // age 和 email 可选
}

// ✅ 可以提供可选属性
const user2: User = {
  name: 'Bob',
  age: 25,
  email: 'bob@example.com',
}

// ❌ 必需属性不能省略
const user3: User = {
  age: 30,
} // Error: Property 'name' is missing
```

**关键概念**：

- **可选标记**：`?` 符号
- **类型**：`T | undefined`
- **省略**：可以不提供该属性
- **访问**：可能返回 `undefined`

## 4. 🤔 如何声明可选属性？

### 4.1. 接口中的可选属性

```ts
// ✅ 接口中使用 ?
interface Config {
  host: string
  port?: number
  timeout?: number
  ssl?: boolean
}

const config: Config = {
  host: 'localhost',
  // port, timeout, ssl 都是可选的
}
```

### 4.2. 类型别名中的可选属性

```ts
// ✅ 类型别名中使用 ?
type User = {
  id: number
  name: string
  email?: string
  phone?: string
}

const user: User = {
  id: 1,
  name: 'Alice',
}
```

### 4.3. 类中的可选属性

```ts
// ✅ 类中的可选属性
class User {
  name: string
  age?: number
  email?: string

  constructor(name: string) {
    this.name = name
    // age 和 email 可以不初始化
  }
}

const user = new User('Alice')
console.log(user.age) // undefined
```

### 4.4. 函数参数中的可选属性

```ts
// ✅ 函数参数对象的可选属性
function createUser(options: { name: string; age?: number; email?: string }) {
  return {
    name: options.name,
    age: options.age ?? 18,
    email: options.email ?? '',
  }
}

createUser({ name: 'Alice' }) // ✅
createUser({ name: 'Bob', age: 25 }) // ✅
createUser({ name: 'Charlie', age: 30, email: 'charlie@example.com' }) // ✅
```

## 5. 🤔 可选属性的特性

### 5.1. 可选属性的类型

```ts
interface User {
  name: string
  age?: number
}

// age 的类型是 number | undefined
const user: User = { name: 'Alice' }

type AgeType = User['age'] // number | undefined
```

### 5.2. 属性存在性检查

```ts
interface Config {
  timeout?: number
}

const config: Config = {}

// ✅ 需要检查属性是否存在
if (config.timeout !== undefined) {
  console.log(config.timeout.toFixed(2)) // ✅ 类型收窄为 number
}

// ❌ 直接访问可能出错
console.log(config.timeout.toFixed(2)) // Error: 'config.timeout' is possibly 'undefined'
```

### 5.3. 默认值处理

```ts
interface Options {
  port?: number
  timeout?: number
}

function connect(options: Options) {
  // ✅ 使用默认值
  const port = options.port ?? 3000
  const timeout = options.timeout ?? 5000

  console.log(`Connecting to port ${port} with timeout ${timeout}ms`)
}

connect({}) // port: 3000, timeout: 5000
connect({ port: 8080 }) // port: 8080, timeout: 5000
```

### 5.4. 解构赋值的默认值

```ts
interface Config {
  host?: string
  port?: number
}

function connect({ host = 'localhost', port = 3000 }: Config) {
  console.log(`${host}:${port}`)
}

connect({}) // localhost:3000
connect({ host: '192.168.1.1' }) // 192.168.1.1:3000
connect({ host: '127.0.0.1', port: 8080 }) // 127.0.0.1:8080
```

## 6. 🤔 Partial 工具类型

### 6.1. `Partial<T>`

```ts
// ✅ Partial<T> 将所有属性变为可选
interface User {
  id: number
  name: string
  email: string
}

type PartialUser = Partial<User>
// 等价于
type PartialUser = {
  id?: number
  name?: string
  email?: string
}

// 使用
const user: PartialUser = {
  name: 'Alice',
  // id 和 email 可选
}
```

### 6.2. 部分可选

```ts
// ✅ 让特定属性可选
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

interface User {
  id: number
  name: string
  email: string
}

type UserWithOptionalEmail = PartialBy<User, 'email'>
// {
//   id: number
//   name: string
//   email?: string
// }
```

### 6.3. `Required<T>`

```ts
// ✅ Required<T> 将所有可选属性变为必需
interface Config {
  host?: string
  port?: number
  timeout?: number
}

type RequiredConfig = Required<Config>
// {
//   host: string
//   port: number
//   timeout: number
// }

const config: RequiredConfig = {
  host: 'localhost',
  port: 3000,
  timeout: 5000,
  // 所有属性都必需
}
```

## 7. 🤔 可选属性 vs undefined

### 7.1. 类型差异

```ts
// ✅ 可选属性：属性可以不存在
interface A {
  prop?: string
}

const a1: A = {} // ✅ 不提供 prop
const a2: A = { prop: undefined } // ✅ 明确设置为 undefined
const a3: A = { prop: 'value' } // ✅ 提供值

// ✅ undefined 类型：属性必须存在，但值可以是 undefined
interface B {
  prop: string | undefined
}

const b1: B = {} // ❌ Error: Property 'prop' is missing
const b2: B = { prop: undefined } // ✅ 必须提供，但可以是 undefined
const b3: B = { prop: 'value' } // ✅
```

### 7.2. 实际对比

::: code-group

```ts [可选属性]
// prop? 表示属性可有可无
interface Config {
  timeout?: number
}

const config1: Config = {}
// ✅ 没有 timeout 属性

const config2: Config = { timeout: undefined }
// ✅ 有 timeout 属性，值是 undefined

'timeout' in config1 // false
'timeout' in config2 // true
```

```ts [undefined 类型]
// prop: T | undefined 表示必须有属性
interface Config {
  timeout: number | undefined
}

const config1: Config = {}
// ❌ Error: Property 'timeout' is missing

const config2: Config = { timeout: undefined }
// ✅ 必须提供属性

const config3: Config = { timeout: 5000 }
// ✅
```

:::

### 7.3. exactOptionalPropertyTypes

```ts
// tsconfig.json
{
  "compilerOptions": {
    "exactOptionalPropertyTypes": true
  }
}

interface User {
  name: string
  age?: number
}

const user1: User = {
  name: 'Alice'
} // ✅

const user2: User = {
  name: 'Bob',
  age: undefined
} // ❌ Error: Type 'undefined' is not assignable to type 'number'
// 启用 exactOptionalPropertyTypes 后，不能显式设置为 undefined
```

## 8. 🤔 可选链操作符

### 8.1. 访问可选属性

```ts
interface User {
  name: string
  profile?: {
    age: number
    address?: {
      city: string
    }
  }
}

const user: User = {
  name: 'Alice',
}

// ✅ 使用可选链
const city = user.profile?.address?.city // string | undefined

// ❌ 不使用可选链会报错
const city = user.profile.address.city // Error: 'user.profile' is possibly 'undefined'
```

### 8.2. 可选方法调用

```ts
interface Logger {
  log?: (message: string) => void
}

const logger: Logger = {}

// ✅ 可选方法调用
logger.log?.('Hello') // 如果 log 存在则调用

// ❌ 直接调用会报错
logger.log('Hello') // Error: Cannot invoke an object which is possibly 'undefined'
```

### 8.3. 可选索引访问

```ts
interface Data {
  items?: string[]
}

const data: Data = {}

// ✅ 可选索引访问
const first = data.items?.[0] // string | undefined

// ❌ 直接访问会报错
const first = data.items[0] // Error: 'data.items' is possibly 'undefined'
```

## 9. 🤔 常见使用场景

### 9.1. 场景 1：配置对象

```ts
// ✅ 配置对象通常有很多可选项
interface ServerConfig {
  host: string
  port?: number
  ssl?: boolean
  timeout?: number
  maxConnections?: number
  logLevel?: 'debug' | 'info' | 'warn' | 'error'
}

function createServer(config: ServerConfig) {
  const {
    host,
    port = 3000,
    ssl = false,
    timeout = 5000,
    maxConnections = 100,
    logLevel = 'info',
  } = config

  console.log(`Server running on ${host}:${port}`)
}

createServer({ host: 'localhost' })
createServer({ host: '0.0.0.0', port: 8080, ssl: true })
```

### 9.2. 场景 2：API 请求参数

```ts
// ✅ API 参数大多是可选的
interface FetchUsersParams {
  page?: number
  pageSize?: number
  sortBy?: string
  order?: 'asc' | 'desc'
  filters?: {
    name?: string
    role?: string
    active?: boolean
  }
}

async function fetchUsers(params: FetchUsersParams = {}) {
  const {
    page = 1,
    pageSize = 20,
    sortBy = 'name',
    order = 'asc',
    filters = {},
  } = params

  const url = buildUrl('/api/users', {
    page,
    pageSize,
    sortBy,
    order,
    ...filters,
  })
  return fetch(url)
}

fetchUsers() // 使用默认值
fetchUsers({ page: 2 })
fetchUsers({ page: 1, pageSize: 50, filters: { role: 'admin' } })
```

### 9.3. 场景 3：部分更新

```ts
// ✅ 更新操作只需要部分字段
interface User {
  id: number
  name: string
  email: string
  avatar: string
  bio: string
}

function updateUser(id: number, updates: Partial<User>): User {
  const currentUser = getUserById(id)

  return {
    ...currentUser,
    ...updates,
  }
}

updateUser(1, { name: 'New Name' })
updateUser(2, { email: 'new@example.com', avatar: '/new-avatar.jpg' })
```

### 9.4. 场景 4：表单数据

```ts
// ✅ 表单字段可能为空
interface FormData {
  username: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  address?: {
    street?: string
    city?: string
    country?: string
  }
}

function validateForm(data: FormData): boolean {
  if (!data.username || !data.email) {
    return false
  }

  // 可选字段的验证
  if (data.phone && !isValidPhone(data.phone)) {
    return false
  }

  return true
}
```

### 9.5. 场景 5：React 组件 Props

```ts
// ✅ 组件 props 通常有可选属性
interface ButtonProps {
  text: string
  onClick: () => void
  type?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  icon?: React.ReactNode
  className?: string
}

function Button({
  text,
  onClick,
  type = 'primary',
  size = 'medium',
  disabled = false,
  icon,
  className,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${type} btn-${size} ${className ?? ''}`}
    >
      {icon}
      {text}
    </button>
  )
}
```

### 9.6. 场景 6：数据库查询

```ts
// ✅ 查询条件都是可选的
interface QueryOptions {
  select?: string[]
  where?: Record<string, any>
  orderBy?: string
  limit?: number
  offset?: number
  include?: string[]
}

async function findUsers(options: QueryOptions = {}) {
  const query = buildQuery('users', options)
  return executeQuery(query)
}

findUsers()
findUsers({ where: { active: true } })
findUsers({ where: { role: 'admin' }, orderBy: 'createdAt', limit: 10 })
```

### 9.7. 场景 7：事件监听器选项

```ts
// ✅ 事件选项大多是可选的
interface EventListenerOptions {
  capture?: boolean
  once?: boolean
  passive?: boolean
  signal?: AbortSignal
}

function addEventListener(
  element: Element,
  event: string,
  handler: EventListener,
  options?: EventListenerOptions
) {
  element.addEventListener(event, handler, options)
}

addEventListener(button, 'click', handleClick)
addEventListener(button, 'click', handleClick, { once: true })
addEventListener(window, 'scroll', handleScroll, { passive: true })
```

## 10. 🤔 常见错误和最佳实践

### 10.1. 错误 1：忘记检查可选属性

```ts
interface User {
  name: string
  email?: string
}

const user: User = { name: 'Alice' }

// ❌ 直接访问可能 undefined
console.log(user.email.toLowerCase()) // Error: 'user.email' is possibly 'undefined'

// ✅ 使用可选链
console.log(user.email?.toLowerCase())

// ✅ 使用类型守卫
if (user.email !== undefined) {
  console.log(user.email.toLowerCase())
}
```

### 10.2. 错误 2：混淆可选属性和 undefined

```ts
// ❌ 不理解差异
interface Bad {
  prop: string | undefined // 必须提供属性
}

const bad: Bad = {} // ❌ Error

// ✅ 使用可选属性
interface Good {
  prop?: string // 属性可选
}

const good: Good = {} // ✅
```

### 10.3. 错误 3：过度使用可选属性

```ts
// ❌ 所有属性都可选，类型安全性降低
interface Bad {
  id?: number
  name?: string
  email?: string
  role?: string
}

// 可能创建无效对象
const user: Bad = {} // ✅ 但这是有效的用户吗？

// ✅ 只让真正可选的属性可选
interface Good {
  id: number
  name: string
  email: string
  phone?: string // 真正可选
  bio?: string // 真正可选
}
```

### 10.4. 最佳实践

```ts
// ✅ 1. 只让真正可选的属性可选
interface User {
  id: number // 必需
  name: string // 必需
  email: string // 必需
  phone?: string // 可选
  avatar?: string // 可选
}

// ✅ 2. 使用默认值处理可选属性
interface Config {
  port?: number
  timeout?: number
}

function createServer(config: Config) {
  const port = config.port ?? 3000
  const timeout = config.timeout ?? 5000
}

// ✅ 3. 使用解构的默认值
function connect({
  host = 'localhost',
  port = 3000,
}: {
  host?: string
  port?: number
}) {
  console.log(`${host}:${port}`)
}

// ✅ 4. 使用可选链访问嵌套可选属性
const city = user.profile?.address?.city

// ✅ 5. 为部分更新使用 Partial
function updateUser(id: number, updates: Partial<User>) {
  // 实现
}

// ✅ 6. 文档化可选属性的含义
interface Config {
  /** 服务器端口（默认：3000） */
  port?: number
  /** 超时时间（默认：5000ms） */
  timeout?: number
}

// ✅ 7. 使用类型守卫检查可选属性
if (user.email !== undefined) {
  sendEmail(user.email)
}

// ✅ 8. 避免显式设置为 undefined
const user: User = {
  name: 'Alice',
  email: undefined, // ⚠️ 不推荐
}

// 应该省略属性
const user: User = {
  name: 'Alice',
  // email 省略
}

// ✅ 9. 使用 Required 确保所有属性存在
function validateConfig(config: Required<Config>) {
  // config 的所有属性都存在
}

// ✅ 10. 为可选属性提供类型安全的 getter
class User {
  name: string
  private _email?: string

  get email(): string {
    return this._email ?? ''
  }

  set email(value: string) {
    this._email = value || undefined
  }
}
```

## 11. 🔗 引用

- [TypeScript Handbook - Optional Properties][1]
- [TypeScript Handbook - Partial][2]
- [TypeScript Handbook - Optional Chaining][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/objects.html#optional-properties
[2]: https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype
[3]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#optional-chaining
