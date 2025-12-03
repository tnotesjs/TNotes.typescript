# [0200. readonly 和 ？ 修饰符](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0200.%20readonly%20%E5%92%8C%20%EF%BC%9F%20%E4%BF%AE%E9%A5%B0%E7%AC%A6)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 readonly 修饰符的作用是什么？](#3--readonly-修饰符的作用是什么)
  - [3.1. 基本用法](#31-基本用法)
  - [3.2. readonly 的特性](#32-readonly-的特性)
  - [3.3. readonly 数组](#33-readonly-数组)
  - [3.4. readonly 元组](#34-readonly-元组)
- [4. 🤔 可选修饰符（？）的作用是什么？](#4--可选修饰符的作用是什么)
  - [4.1. 基本用法](#41-基本用法)
  - [4.2. 可选属性的类型](#42-可选属性的类型)
  - [4.3. 可选属性 vs. undefined 类型](#43-可选属性-vs-undefined-类型)
  - [4.4. 可选参数](#44-可选参数)
- [5. 🤔 如何在映射类型中使用 readonly？](#5--如何在映射类型中使用-readonly)
  - [5.1. 添加 readonly](#51-添加-readonly)
  - [5.2. 移除 readonly](#52-移除-readonly)
  - [5.3. 深度 readonly](#53-深度-readonly)
  - [5.4. 条件 readonly](#54-条件-readonly)
- [6. 🤔 如何在映射类型中使用 ？](#6--如何在映射类型中使用-)
  - [6.1. 添加可选修饰符](#61-添加可选修饰符)
  - [6.2. 移除可选修饰符](#62-移除可选修饰符)
  - [6.3. 深度可选](#63-深度可选)
  - [6.4. 选择性可选](#64-选择性可选)
- [7. 🤔 readonly 和 ？ 修饰符有哪些实际应用？](#7--readonly-和--修饰符有哪些实际应用)
  - [7.1. 场景 1：不可变状态管理](#71-场景-1不可变状态管理)
  - [7.2. 场景 2：API 响应类型](#72-场景-2api-响应类型)
  - [7.3. 场景 3：配置对象](#73-场景-3配置对象)
  - [7.4. 场景 4：表单数据](#74-场景-4表单数据)
  - [7.5. 场景 5：事件处理](#75-场景-5事件处理)
  - [7.6. 场景 6：数据库查询选项](#76-场景-6数据库查询选项)
- [8. 🤔 使用这两个修饰符需要注意什么？](#8--使用这两个修饰符需要注意什么)
  - [8.1. 注意事项 1：readonly 是浅层的](#81-注意事项-1readonly-是浅层的)
  - [8.2. 注意事项 2：可选属性的类型包含 undefined](#82-注意事项-2可选属性的类型包含-undefined)
  - [8.3. 注意事项 3：可选属性 vs. undefined 联合类型](#83-注意事项-3可选属性-vs-undefined-联合类型)
  - [8.4. 注意事项 4：strictNullChecks 的影响](#84-注意事项-4strictnullchecks-的影响)
  - [8.5. 注意事项 5：readonly 不影响类型兼容性](#85-注意事项-5readonly-不影响类型兼容性)
  - [8.6. 注意事项 6：数组和元组的 readonly](#86-注意事项-6数组和元组的-readonly)
  - [8.7. 注意事项 7：解构和可选属性](#87-注意事项-7解构和可选属性)
- [9. 🔗 引用](#9--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- `readonly` 修饰符的含义和用法
- 可选修饰符（`?`）的含义和用法
- 在映射类型中操作修饰符
- 修饰符的实际应用场景
- 使用注意事项

## 2. 🫧 评价

`readonly` 和 `?` 是 TypeScript 中两个最常用的属性修饰符，它们分别控制属性的可变性和必需性。

- `readonly` 修饰符用于创建不可变数据结构，是函数式编程的重要工具
- `?` 修饰符使属性变为可选，提供了更灵活的类型约束
- 理解这两个修饰符是掌握 TypeScript 类型系统的基础
- 在映射类型中，可以通过 `+` 和 `-` 操作符灵活添加或移除这些修饰符
- 实际开发中，合理使用这两个修饰符能够提高代码的类型安全性和可维护性

## 3. 🤔 readonly 修饰符的作用是什么？

`readonly` 修饰符用于标记属性为只读，一旦赋值后就不能再修改。

### 3.1. 基本用法

```ts
type User = {
  readonly id: number
  name: string
  readonly createdAt: Date
}

const user: User = {
  id: 1,
  name: 'Alice',
  createdAt: new Date(),
}

// ✅ 可以读取
console.log(user.id) // 1
console.log(user.createdAt) // Date 对象

// ✅ 可以修改非 readonly 属性
user.name = 'Bob'

// ❌ 不能修改 readonly 属性
user.id = 2 // 错误：无法分配到 "id"，因为它是只读属性
user.createdAt = new Date() // 错误：无法分配到 "createdAt"，因为它是只读属性
```

### 3.2. readonly 的特性

1. 编译时检查：`readonly` 只在编译时生效，运行时没有任何限制。

```ts
type Point = {
  readonly x: number
  readonly y: number
}

const point: Point = { x: 10, y: 20 }

// TypeScript 编译错误
point.x = 30 // ❌ 错误

// 但 JavaScript 运行时可以修改（不推荐）
;(point as any).x = 30 // ✅ 运行时不报错，但破坏了类型安全
```

2. 浅只读：`readonly` 只作用于直接属性，不会递归到嵌套对象。

```ts
type Config = {
  readonly server: {
    host: string
    port: number
  }
}

const config: Config = {
  server: {
    host: 'localhost',
    port: 3000,
  },
}

// ❌ 不能重新赋值整个 server 对象
config.server = { host: '0.0.0.0', port: 8080 } // 错误

// ✅ 可以修改 server 内部的属性
config.server.host = '0.0.0.0' // 合法
config.server.port = 8080 // 合法
```

3. 与 const 的区别：

```ts
// const 用于变量
const x = 10
x = 20 // ❌ 错误：无法分配到 "x"，因为它是常量

// readonly 用于对象属性
type Person = {
  readonly name: string
}

const person: Person = { name: 'Alice' }
person.name = 'Bob' // ❌ 错误：无法分配到 "name"，因为它是只读属性

// const 对象的属性仍可修改
const obj = { value: 10 }
obj.value = 20 // ✅ 合法
```

### 3.3. readonly 数组

```ts
// 只读数组
type ReadonlyArray1 = readonly number[]
type ReadonlyArray2 = ReadonlyArray<number>

const arr1: ReadonlyArray1 = [1, 2, 3]
const arr2: ReadonlyArray2 = [1, 2, 3]

// ✅ 可以读取
console.log(arr1[0]) // 1
console.log(arr1.length) // 3

// ❌ 不能修改
arr1[0] = 10 // 错误：类型"readonly number[]"中的索引签名仅允许读取
arr1.push(4) // 错误：类型"readonly number[]"上不存在属性"push"
arr1.sort() // 错误：类型"readonly number[]"上不存在属性"sort"

// ✅ 可以使用不修改原数组的方法
const filtered = arr1.filter((x) => x > 1) // [2, 3]
const mapped = arr1.map((x) => x * 2) // [2, 4, 6]
```

### 3.4. readonly 元组

```ts
type Point = readonly [number, number]

const point: Point = [10, 20]

// ❌ 不能修改
point[0] = 30 // 错误
point.push(40) // 错误

// ✅ 可以读取
console.log(point[0]) // 10
console.log(point.length) // 2
```

## 4. 🤔 可选修饰符（？）的作用是什么？

可选修饰符（`?`）用于标记属性为可选，表示该属性可以不存在。

### 4.1. 基本用法

```ts
type User = {
  id: number
  name: string
  email?: string // 可选属性
  phone?: string // 可选属性
}

// ✅ 所有情况都合法
const user1: User = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  phone: '123-456-7890',
}

const user2: User = {
  id: 2,
  name: 'Bob',
  email: 'bob@example.com',
  // phone 可以省略
}

const user3: User = {
  id: 3,
  name: 'Charlie',
  // email 和 phone 都可以省略
}

// ❌ 缺少必需属性会报错
const user4: User = {
  name: 'David',
  // 错误：缺少属性 "id"
}
```

### 4.2. 可选属性的类型

可选属性的类型实际上是 `T | undefined`。

```ts
type User = {
  name: string
  age?: number
}

// age 的类型实际上是 number | undefined
function printAge(user: User) {
  // ✅ 可以检查是否存在
  if (user.age !== undefined) {
    console.log(user.age.toFixed(2)) // 此时 age 是 number
  }

  // ✅ 可以使用可选链
  console.log(user.age?.toFixed(2))

  // ✅ 可以使用空值合并
  const age = user.age ?? 0
}
```

### 4.3. 可选属性 vs. undefined 类型

```ts
type A = {
  x?: number // 可选属性
}

type B = {
  x: number | undefined // 必需属性，但值可以是 undefined
}

const a1: A = {} // ✅ 合法
const a2: A = { x: undefined } // ✅ 合法
const a3: A = { x: 10 } // ✅ 合法

const b1: B = {} // ❌ 错误：缺少属性 "x"
const b2: B = { x: undefined } // ✅ 合法
const b3: B = { x: 10 } // ✅ 合法
```

### 4.4. 可选参数

```ts
// 函数参数也可以是可选的
function greet(name: string, greeting?: string) {
  console.log(`${greeting ?? 'Hello'}, ${name}!`)
}

greet('Alice') // Hello, Alice!
greet('Bob', 'Hi') // Hi, Bob!

// 可选参数必须在必需参数之后
function invalid(optional?: string, required: string) {
  // ❌ 错误：必需参数不能跟在可选参数后面
}
```

## 5. 🤔 如何在映射类型中使用 readonly？

在映射类型中，可以使用 `+readonly` 添加或 `-readonly` 移除 `readonly` 修饰符。

### 5.1. 添加 readonly

```ts
// 将所有属性变为只读
type Readonly<T> = {
  +readonly [K in keyof T]: T[K]
}

type User = {
  id: number
  name: string
  email: string
}

type ReadonlyUser = Readonly<User>
// 结果：
// {
//   readonly id: number;
//   readonly name: string;
//   readonly email: string;
// }

const user: ReadonlyUser = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
}

user.name = 'Bob' // ❌ 错误：无法分配到 "name"
```

### 5.2. 移除 readonly

```ts
// 移除所有 readonly 修饰符
type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}

type ReadonlyConfig = {
  readonly host: string
  readonly port: number
}

type MutableConfig = Mutable<ReadonlyConfig>
// 结果：
// {
//   host: string;
//   port: number;
// }

const config: MutableConfig = {
  host: 'localhost',
  port: 3000,
}

config.host = '0.0.0.0' // ✅ 可以修改
config.port = 8080 // ✅ 可以修改
```

### 5.3. 深度 readonly

```ts
// 递归地将所有嵌套属性变为只读
type DeepReadonly<T> = {
  +readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}

type Config = {
  server: {
    host: string
    port: number
  }
  database: {
    url: string
  }
}

type ReadonlyConfig = DeepReadonly<Config>
// 结果：
// {
//   readonly server: {
//     readonly host: string;
//     readonly port: number;
//   };
//   readonly database: {
//     readonly url: string;
//   };
// }

const config: ReadonlyConfig = {
  server: { host: 'localhost', port: 3000 },
  database: { url: 'mongodb://localhost' },
}

config.server = { host: '0.0.0.0', port: 8080 } // ❌ 错误
config.server.host = '0.0.0.0' // ❌ 错误
config.server.port = 8080 // ❌ 错误
```

### 5.4. 条件 readonly

```ts
// 只将特定类型的属性变为只读
type ReadonlyStrings<T> = {
  [K in keyof T]: T[K] extends string ? readonly T[K] : T[K]
}

type Data = {
  name: string
  age: number
  email: string
}

type Result = ReadonlyStrings<Data>
// 结果：{ name: string; age: number; email: string; }
// 注意：readonly 只能用于对象属性，不能用于基本类型值

// 正确的方式：对属性本身应用 readonly
type ReadonlyStringProps<T> = {
  readonly [K in keyof T as T[K] extends string ? K : never]: T[K]
} & {
  [K in keyof T as T[K] extends string ? never : K]: T[K]
}
```

## 6. 🤔 如何在映射类型中使用 ？

在映射类型中，可以使用 `+?` 添加或 `-?` 移除可选修饰符。

### 6.1. 添加可选修饰符

```ts
// 将所有属性变为可选
type Partial<T> = {
  [K in keyof T]+?: T[K]
}

type User = {
  id: number
  name: string
  email: string
}

type PartialUser = Partial<User>
// 结果：
// {
//   id?: number;
//   name?: string;
//   email?: string;
// }

const user1: PartialUser = {} // ✅ 合法
const user2: PartialUser = { name: 'Alice' } // ✅ 合法
const user3: PartialUser = { id: 1, name: 'Bob', email: 'bob@example.com' } // ✅ 合法
```

### 6.2. 移除可选修饰符

```ts
// 将所有属性变为必需
type Required<T> = {
  [K in keyof T]-?: T[K]
}

type PartialUser = {
  id?: number
  name?: string
  email?: string
}

type RequiredUser = Required<PartialUser>
// 结果：
// {
//   id: number;
//   name: string;
//   email: string;
// }

const user: RequiredUser = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
} // ✅ 必须提供所有属性

const incompleteUser: RequiredUser = {
  name: 'Bob',
} // ❌ 错误：缺少属性 "id" 和 "email"
```

### 6.3. 深度可选

```ts
// 递归地将所有嵌套属性变为可选
type DeepPartial<T> = {
  [K in keyof T]+?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

type Config = {
  server: {
    host: string
    port: number
  }
  database: {
    url: string
    poolSize: number
  }
}

type PartialConfig = DeepPartial<Config>
// 结果：
// {
//   server?: {
//     host?: string;
//     port?: number;
//   };
//   database?: {
//     url?: string;
//     poolSize?: number;
//   };
// }

// ✅ 所有组合都合法
const config1: PartialConfig = {}
const config2: PartialConfig = { server: {} }
const config3: PartialConfig = { server: { host: 'localhost' } }
const config4: PartialConfig = {
  server: { host: 'localhost', port: 3000 },
  database: { url: 'mongodb://localhost' },
}
```

### 6.4. 选择性可选

```ts
// 只将特定属性变为可选
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

type User = {
  id: number
  name: string
  email: string
  phone: string
}

type UserWithOptionalContacts = PartialBy<User, 'email' | 'phone'>
// 结果：
// {
//   id: number;
//   name: string;
//   email?: string;
//   phone?: string;
// }

const user: UserWithOptionalContacts = {
  id: 1,
  name: 'Alice',
  // email 和 phone 可选
}
```

## 7. 🤔 readonly 和 ？ 修饰符有哪些实际应用？

### 7.1. 场景 1：不可变状态管理

```ts
// Redux Store 状态类型
type AppState = {
  user: {
    id: number
    name: string
    permissions: string[]
  }
  settings: {
    theme: 'light' | 'dark'
    language: string
  }
}

// 使用 DeepReadonly 确保状态不可变
type ReadonlyState = DeepReadonly<AppState>

function reducer(state: ReadonlyState, action: any): ReadonlyState {
  // state 是只读的，不能直接修改
  // 必须返回新对象
  return {
    ...state,
    user: {
      ...state.user,
      name: 'Updated Name',
    },
  }
}
```

### 7.2. 场景 2：API 响应类型

```ts
// API 返回的数据是只读的
type ApiResponse<T> = {
  readonly data: T
  readonly timestamp: Date
  readonly status: number
}

// 使用示例
async function fetchUser(id: number): Promise<ApiResponse<User>> {
  const response = await fetch(`/api/users/${id}`)
  const json = await response.json()
  return {
    data: json,
    timestamp: new Date(),
    status: response.status,
  }
}

const response = await fetchUser(1)
response.status = 404 // ❌ 错误：无法修改
```

### 7.3. 场景 3：配置对象

```ts
// 配置类型定义
type DatabaseConfig = {
  host: string
  port: number
  username: string
  password: string
  database: string
  poolSize?: number // 可选配置
  ssl?: boolean // 可选配置
}

// 运行时配置是只读的
type RuntimeConfig = Readonly<DatabaseConfig>

// 初始化配置
function initDatabase(config: DatabaseConfig): RuntimeConfig {
  // 验证并返回只读配置
  const runtimeConfig: RuntimeConfig = {
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    database: config.database,
    poolSize: config.poolSize ?? 10,
    ssl: config.ssl ?? false,
  }

  return runtimeConfig
}

const config = initDatabase({
  host: 'localhost',
  port: 5432,
  username: 'admin',
  password: 'secret',
  database: 'myapp',
})

config.port = 3306 // ❌ 错误：无法修改运行时配置
```

### 7.4. 场景 4：表单数据

```ts
// 表单字段定义
type FormData = {
  username: string
  email: string
  password: string
  confirmPassword: string
  age: number
  agreeToTerms: boolean
}

// 初始状态：所有字段可选
type InitialFormData = Partial<FormData>

// 提交的数据：某些字段必需，某些可选
type SubmitFormData = Required<
  Pick<FormData, 'username' | 'email' | 'password'>
> &
  Partial<Pick<FormData, 'age'>>

// 使用示例
const initial: InitialFormData = {} // ✅ 空对象合法

const submit: SubmitFormData = {
  username: 'john_doe',
  email: 'john@example.com',
  password: 'secret123',
  // age 可选
}
```

### 7.5. 场景 5：事件处理

```ts
// 事件对象是只读的
type MouseEventData = {
  readonly x: number
  readonly y: number
  readonly button: number
  readonly timestamp: Date
}

function handleClick(event: MouseEventData) {
  console.log(`Clicked at (${event.x}, ${event.y})`)

  // ❌ 不能修改事件数据
  event.x = 100 // 错误：无法分配到 "x"
}

// 创建事件
const event: MouseEventData = {
  x: 50,
  y: 100,
  button: 0,
  timestamp: new Date(),
}

handleClick(event)
```

### 7.6. 场景 6：数据库查询选项

```ts
// 查询选项
type QueryOptions = {
  select?: string[] // 选择字段
  where?: Record<string, any> // 过滤条件
  orderBy?: string // 排序
  limit?: number // 限制数量
  offset?: number // 偏移量
}

// 所有选项都是可选的
function findUsers(options: QueryOptions = {}) {
  const {
    select = ['*'],
    where = {},
    orderBy = 'id',
    limit = 10,
    offset = 0,
  } = options

  // 执行查询...
}

// 使用示例
findUsers() // ✅ 不传参数合法
findUsers({ limit: 20 }) // ✅ 只传部分参数合法
findUsers({ where: { active: true }, orderBy: 'createdAt' }) // ✅ 合法
```

## 8. 🤔 使用这两个修饰符需要注意什么？

### 8.1. 注意事项 1：readonly 是浅层的

`readonly` 只保护直接属性，不会递归到嵌套对象。

```ts
type Config = {
  readonly server: {
    host: string
  }
}

const config: Config = {
  server: { host: 'localhost' },
}

// ❌ 不能重新赋值
config.server = { host: '0.0.0.0' } // 错误

// ✅ 可以修改嵌套属性
config.server.host = '0.0.0.0' // 合法（但不推荐）

// 解决方案：使用 DeepReadonly
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}

type DeepReadonlyConfig = DeepReadonly<Config>
```

### 8.2. 注意事项 2：可选属性的类型包含 undefined

可选属性的类型自动包含 `undefined`。

```ts
type User = {
  name: string
  age?: number
}

function getAge(user: User): number {
  // ❌ 错误：类型"number | undefined"不能赋给类型"number"
  return user.age

  // ✅ 正确：需要处理 undefined
  return user.age ?? 0
}
```

### 8.3. 注意事项 3：可选属性 vs. undefined 联合类型

```ts
type A = {
  x?: number
}

type B = {
  x: number | undefined
}

// 区别：
const a: A = {} // ✅ x 可以不存在
const b: B = {} // ❌ 错误：必须提供 x 属性

const a2: A = { x: undefined } // ✅ 合法
const b2: B = { x: undefined } // ✅ 合法
```

### 8.4. 注意事项 4：strictNullChecks 的影响

`strictNullChecks` 编译选项会影响可选属性的行为。

```ts
// strictNullChecks: true
type User = {
  name?: string
}

function getName(user: User): string {
  // ❌ 错误：类型"string | undefined"不能赋给类型"string"
  return user.name
}

// strictNullChecks: false
// 上面的代码不会报错（但不安全）
```

### 8.5. 注意事项 5：readonly 不影响类型兼容性

`readonly` 属性可以赋值给非 `readonly` 属性，反之则不行。

```ts
type ReadonlyPoint = {
  readonly x: number
  readonly y: number
}

type MutablePoint = {
  x: number
  y: number
}

const ro: ReadonlyPoint = { x: 10, y: 20 }
const mu: MutablePoint = { x: 10, y: 20 }

// ✅ readonly 可以赋值给非 readonly
const mu2: MutablePoint = ro // 合法

// ✅ 非 readonly 也可以赋值给 readonly
const ro2: ReadonlyPoint = mu // 合法

// 但赋值后的行为不同
mu2.x = 30 // ✅ 合法，因为 mu2 的类型是 MutablePoint
```

### 8.6. 注意事项 6：数组和元组的 readonly

```ts
// readonly 数组
const arr1: readonly number[] = [1, 2, 3]
arr1.push(4) // ❌ 错误：类型"readonly number[]"上不存在属性"push"

// 普通数组
const arr2: number[] = [1, 2, 3]
arr2.push(4) // ✅ 合法

// 类型兼容性
const arr3: readonly number[] = arr2 // ✅ 合法
const arr4: number[] = arr1 // ❌ 错误：readonly 数组不能赋值给可变数组
```

### 8.7. 注意事项 7：解构和可选属性

```ts
type User = {
  name: string
  age?: number
}

const user: User = { name: 'Alice' }

// 解构时需要提供默认值
const { name, age = 0 } = user // age 是 number 类型

// 不提供默认值时，age 是 number | undefined
const { name: n, age: a } = user // a 是 number | undefined
```

## 9. 🔗 引用

- [TypeScript Handbook - Readonly Properties][1]
- [TypeScript Handbook - Optional Properties][2]
- [TypeScript Deep Dive - Readonly][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties
[2]: https://www.typescriptlang.org/docs/handbook/2/objects.html#optional-properties
[3]: https://basarat.gitbook.io/typescript/type-system/readonly
