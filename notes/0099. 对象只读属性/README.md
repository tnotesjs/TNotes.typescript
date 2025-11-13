# [0099. 对象只读属性](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0099.%20%E5%AF%B9%E8%B1%A1%E5%8F%AA%E8%AF%BB%E5%B1%9E%E6%80%A7)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是只读属性？](#3--什么是只读属性)
  - [3.1. 初始化时赋值](#31-初始化时赋值)
  - [3.2. 浅只读](#32-浅只读)
  - [3.3. 运行时行为](#33-运行时行为)
- [4. 🤔 如何声明只读属性？](#4--如何声明只读属性)
- [5. 🤔 Readonly 工具类型](#5--readonly-工具类型)
  - [5.1. `Readonly<T>`](#51-readonlyt)
  - [5.2. 部分只读](#52-部分只读)
  - [5.3. 嵌套只读](#53-嵌套只读)
- [6. 🤔 只读数组和元组](#6--只读数组和元组)
  - [6.1. `ReadonlyArray<T>`](#61-readonlyarrayt)
  - [6.2. 数组方法限制](#62-数组方法限制)
  - [6.3. 只读元组](#63-只读元组)
  - [6.4. 数组与只读数组的转换](#64-数组与只读数组的转换)
- [7. 🤔 深层只读](#7--深层只读)
  - [7.1. DeepReadonly 实现](#71-deepreadonly-实现)
  - [7.2. 处理数组和函数](#72-处理数组和函数)
- [8. 🤔 常见使用场景](#8--常见使用场景)
  - [8.1. 场景 1：配置对象](#81-场景-1配置对象)
  - [8.2. 场景 2：常量数据](#82-场景-2常量数据)
  - [8.3. 场景 3：不可变数据结构](#83-场景-3不可变数据结构)
  - [8.4. 场景 4：函数参数](#84-场景-4函数参数)
  - [8.5. 场景 5：React Props](#85-场景-5react-props)
  - [8.6. 场景 6：Redux Action](#86-场景-6redux-action)
  - [8.7. 场景 7：API 响应](#87-场景-7api-响应)
- [9. 🤔 常见错误和最佳实践](#9--常见错误和最佳实践)
  - [9.1. 错误 1：期望运行时不可变](#91-错误-1期望运行时不可变)
  - [9.2. 错误 2：忽略浅只读](#92-错误-2忽略浅只读)
  - [9.3. 错误 3：在构造函数外赋值](#93-错误-3在构造函数外赋值)
  - [9.4. 最佳实践](#94-最佳实践)
- [10. 🔗 引用](#10--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 只读属性的定义和语法
- readonly 修饰符
- Readonly 工具类型
- 只读数组和元组
- 深层只读的实现
- 实际应用场景

## 2. 🫧 评价

只读属性（Readonly Property）使用 `readonly` 修饰符，表示属性初始化后不能被修改。这是 TypeScript 提供的不可变性保障。

只读属性的特点：

- 编译时检查：防止意外修改
- 初始化后不可变：只能在声明或构造函数中赋值
- 浅只读：只保护属性本身，不保护嵌套对象
- 类型层面：运行时仍可修改（JavaScript 不支持）

理解只读属性，能帮助你：

1. 编写更安全的不可变代码
2. 防止意外修改关键数据
3. 实现函数式编程范式
4. 提升代码可维护性

只读属性是 TypeScript 类型系统中实现不可变性的重要工具，是编写健壮代码的基础。

## 3. 🤔 什么是只读属性？

只读属性使用 `readonly` 修饰符，表示属性不能被重新赋值。

- 初始化：只能在对象创建时或构造函数中赋值，一旦赋值就不能修改
- 编译时检查：只在 TypeScript 编译时有效
- 浅只读：不影响嵌套对象的属性

### 3.1. 初始化时赋值

```ts
// 对象字面量初始化
interface Config {
  readonly port: number
}

const config: Config = {
  port: 3000, // 初始化时赋值
}

// 类构造函数初始化
class Server {
  readonly port: number

  constructor(port: number) {
    this.port = port // 构造函数中赋值
  }
}
```

只读属性可以与可选属性结合，但也必须在初始化时完成赋值，赋值操作不允许滞后。

```ts
// 只读 + 可选
interface Config {
  readonly apiUrl: string
  readonly timeout?: number
}

const config: Config = {
  apiUrl: 'https://api.example.com',
  // timeout 可选
}

config.apiUrl = 'new url' // ❌ Error
config.timeout = 5000 // ❌ Error: 即使可选，一旦初始化就是只读
```

### 3.2. 浅只读

```ts
// ⚠️ readonly 是浅层的
interface User {
  readonly profile: {
    name: string
    age: number
  }
}

const user: User = {
  profile: {
    name: 'Alice',
    age: 25,
  },
}

user.profile = { name: 'Bob', age: 30 } // ❌ Error: 不能重新赋值整个对象
user.profile.name = 'Bob' // ✅ 可以修改嵌套属性
user.profile.age = 30 // ✅ 可以修改嵌套属性
```

### 3.3. 运行时行为

```ts
// ⚠️ readonly 只在编译时有效
interface Point {
  readonly x: number
  readonly y: number
}

const point: Point = { x: 10, y: 20 }
point.x = 30 // ❌ 编译时会报错

// TS 编译后得到的 JS：
// const point = { x: 10, y: 20 }
// point.x = 30 // ✅ JS 运行时可以修改

// 可以使用 Object.freeze 实现真正的不可变
const frozenPoint = Object.freeze({ x: 10, y: 20 })
// TS 类型推断的结果：
// const frozenPoint: Readonly<{
//     x: 10;
//     y: 20;
// }>
frozenPoint.x = 30 // ❌ 编译时和运行时都会报错
```

## 4. 🤔 如何声明只读属性？

对象的只读属性可以声明在多个位置，比如：

1. 在接口中的只读属性
2. 在类型别名中的只读属性
3. 在类中的只读属性
4. 在索引签名中的只读属性

::: code-group

```ts [1]
// ✅ 接口中使用 readonly
interface Point {
  readonly x: number
  readonly y: number
}

const point: Point = { x: 10, y: 20 }
point.x = 30 // ❌ Error: Cannot assign to 'x' because it is a read-only property
```

```ts [2]
// ✅ 类型别名中使用 readonly
type Config = {
  readonly apiUrl: string
  readonly timeout: number
}

const config: Config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
}

config.timeout = 3000 // ❌ Error
```

```ts [3]
// ✅ 类中的只读属性
class User {
  readonly id: number
  name: string

  constructor(id: number, name: string) {
    this.id = id // ✅ 构造函数中可以赋值
    this.name = name
  }

  updateId(newId: number) {
    this.id = newId // ❌ Error: Cannot assign to 'id'
  }
}

const user = new User(1, 'Alice')
user.id = 2 // ❌ Error
```

```ts [4]
// ✅ 只读索引签名
interface ReadonlyStringMap {
  readonly [key: string]: string
}

const map: ReadonlyStringMap = {
  name: 'Alice',
  role: 'Admin',
}

map.name = 'Bob' // ❌ Error
map.age = '25' // ❌ Error: Index signature in type 'ReadonlyStringMap' only permits reading
```

:::

## 5. 🤔 Readonly 工具类型

### 5.1. `Readonly<T>`

```ts
// ✅ Readonly<T> 将所有属性变为只读
interface User {
  name: string
  age: number
  email: string
}

type ReadonlyUser = Readonly<User>
// 等价于
type ReadonlyUser = {
  readonly name: string
  readonly age: number
  readonly email: string
}

// 使用
const user: ReadonlyUser = {
  name: 'Alice',
  age: 25,
  email: 'alice@example.com',
}

user.name = 'Bob' // ❌ Error
```

### 5.2. 部分只读

```ts
// ✅ 部分属性只读
interface User {
  id: number
  name: string
  email: string
}

type UserWithReadonlyId = Readonly<Pick<User, 'id'>> & Omit<User, 'id'>
// 等价于
type UserWithReadonlyId = {
  readonly id: number
  name: string
  email: string
}

// 或使用工具类型
type PartialReadonly<T, K extends keyof T> = Readonly<Pick<T, K>> & Omit<T, K>

type UserWithReadonlyId = PartialReadonly<User, 'id'>
```

### 5.3. 嵌套只读

```ts
// ❌ Readonly<T> 是浅层的
interface User {
  name: string
  profile: {
    age: number
    city: string
  }
}

type ReadonlyUser = Readonly<User>

const user: ReadonlyUser = {
  name: 'Alice',
  profile: {
    age: 25,
    city: 'New York',
  },
}

user.name = 'Bob' // ❌ Error
user.profile = { age: 30, city: 'LA' } // ❌ Error
user.profile.age = 30 // ✅ 可以修改嵌套属性
```

## 6. 🤔 只读数组和元组

### 6.1. `ReadonlyArray<T>`

```ts
// ✅ 只读数组
const numbers: ReadonlyArray<number> = [1, 2, 3]

numbers.push(4) // ❌ Error: Property 'push' does not exist
numbers[0] = 10 // ❌ Error: Index signature only permits reading

// ✅ 只读数组字面量语法
const numbers: readonly number[] = [1, 2, 3]

numbers.push(4) // ❌ Error
numbers[0] = 10 // ❌ Error
```

### 6.2. 数组方法限制

```ts
const numbers: readonly number[] = [1, 2, 3]

// ✅ 不修改数组的方法可用
const doubled = numbers.map((n) => n * 2) // ✅
const sum = numbers.reduce((a, b) => a + b, 0) // ✅
const filtered = numbers.filter((n) => n > 1) // ✅

// ❌ 修改数组的方法不可用
numbers.push(4) // ❌ Error
numbers.pop() // ❌ Error
numbers.splice(0, 1) // ❌ Error
numbers.sort() // ❌ Error
```

### 6.3. 只读元组

```ts
// ✅ 只读元组
const point: readonly [number, number] = [10, 20]

point[0] = 30 // ❌ Error
point.push(30) // ❌ Error

// ✅ 具名只读元组
type Point = readonly [x: number, y: number]

const point: Point = [10, 20]
```

### 6.4. 数组与只读数组的转换

```ts
// ✅ 普通数组赋值给只读数组
const mutable: number[] = [1, 2, 3]
const readonly: readonly number[] = mutable // ✅

// ❌ 只读数组赋值给普通数组
const readonly: readonly number[] = [1, 2, 3]
const mutable: number[] = readonly // ❌ Error

// ✅ 需要复制
const mutable: number[] = [...readonly] // ✅
```

## 7. 🤔 深层只读

### 7.1. DeepReadonly 实现

```ts
// ✅ 递归深层只读
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

interface User {
  name: string
  profile: {
    age: number
    address: {
      city: string
      country: string
    }
  }
}

type ReadonlyUser = DeepReadonly<User>

const user: ReadonlyUser = {
  name: 'Alice',
  profile: {
    age: 25,
    address: {
      city: 'New York',
      country: 'USA',
    },
  },
}

user.name = 'Bob' // ❌ Error
user.profile.age = 30 // ❌ Error
user.profile.address.city = 'LA' // ❌ Error
```

### 7.2. 处理数组和函数

```ts
// ✅ 完整的深层只读
type DeepReadonly<T> = T extends (infer R)[]
  ? ReadonlyArray<DeepReadonly<R>>
  : T extends Function
  ? T
  : T extends object
  ? { readonly [P in keyof T]: DeepReadonly<T[P]> }
  : T

interface Data {
  items: Array<{
    id: number
    tags: string[]
  }>
  process: (x: number) => number
}

type ReadonlyData = DeepReadonly<Data>
// {
//   readonly items: ReadonlyArray<{
//     readonly id: number
//     readonly tags: ReadonlyArray<string>
//   }>
//   readonly process: (x: number) => number
// }
```

## 8. 🤔 常见使用场景

### 8.1. 场景 1：配置对象

```ts
// ✅ 配置应该是只读的
interface AppConfig {
  readonly apiUrl: string
  readonly apiKey: string
  readonly timeout: number
  readonly retries: number
}

const config: Readonly<AppConfig> = {
  apiUrl: 'https://api.example.com',
  apiKey: 'secret-key',
  timeout: 5000,
  retries: 3,
}

// 防止意外修改
config.apiUrl = 'https://evil.com' // ❌ Error
```

### 8.2. 场景 2：常量数据

```ts
// ✅ 常量数组
const WEEKDAYS: readonly string[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

WEEKDAYS.push('Funday') // ❌ Error

// ✅ 常量对象
const HTTP_STATUS: Readonly<Record<string, number>> = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
}

HTTP_STATUS.OK = 201 // ❌ Error
```

### 8.3. 场景 3：不可变数据结构

```ts
// ✅ 不可变状态
interface State {
  readonly count: number
  readonly user: Readonly<{
    id: number
    name: string
  }>
}

class Store {
  private state: DeepReadonly<State>

  constructor(initialState: State) {
    this.state = initialState
  }

  // 返回只读状态
  getState(): DeepReadonly<State> {
    return this.state
  }

  // 通过新对象更新状态
  setState(newState: State): void {
    this.state = newState
  }
}
```

### 8.4. 场景 4：函数参数

```ts
// ✅ 函数不应修改参数
function sum(numbers: readonly number[]): number {
  return numbers.reduce((a, b) => a + b, 0)
  // numbers.push(0) // ❌ Error: 防止修改参数
}

function updateUser(user: Readonly<User>): User {
  // user.name = 'New Name' // ❌ Error

  // ✅ 返回新对象
  return {
    ...user,
    name: 'New Name',
  }
}
```

### 8.5. 场景 5：React Props

```ts
// ✅ React 组件的 props 应该是只读的
interface UserCardProps {
  readonly user: Readonly<{
    name: string
    avatar: string
  }>
  readonly onEdit: (user: User) => void
}

function UserCard({ user, onEdit }: UserCardProps) {
  // user.name = 'New Name' // ❌ Error

  return (
    <div>
      <img src={user.avatar} />
      <h2>{user.name}</h2>
    </div>
  )
}
```

### 8.6. 场景 6：Redux Action

```ts
// ✅ Action 应该是只读的
interface Action {
  readonly type: string
  readonly payload?: any
}

interface AddTodoAction extends Action {
  readonly type: 'ADD_TODO'
  readonly payload: Readonly<{
    id: number
    text: string
  }>
}

function reducer(state: State, action: Readonly<Action>): State {
  // action.type = 'NEW_TYPE' // ❌ Error

  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, action.payload],
      }
    default:
      return state
  }
}
```

### 8.7. 场景 7：API 响应

```ts
// ✅ API 响应数据不应被修改
interface ApiResponse<T> {
  readonly data: T
  readonly status: number
  readonly message: string
}

async function fetchUser(id: number): Promise<Readonly<User>> {
  const response = await fetch(`/api/users/${id}`)
  const data = await response.json()
  return data
}

// 使用
const user = await fetchUser(1)
user.name = 'New Name' // ❌ Error
```

## 9. 🤔 常见错误和最佳实践

### 9.1. 错误 1：期望运行时不可变

```ts
// ❌ readonly 只在编译时有效
interface Point {
  readonly x: number
  readonly y: number
}

const point: Point = { x: 10, y: 20 }

// TypeScript 编译后，readonly 消失
// point.x = 30 // 运行时可以修改

// ✅ 使用 Object.freeze 实现运行时不可变
const point = Object.freeze({ x: 10, y: 20 })
point.x = 30 // 运行时也会报错
```

### 9.2. 错误 2：忽略浅只读

```ts
// ❌ 以为嵌套对象也是只读的
interface User {
  readonly profile: {
    name: string
  }
}

const user: User = {
  profile: { name: 'Alice' },
}

user.profile.name = 'Bob' // ✅ 可以修改

// ✅ 使用 DeepReadonly
type DeepReadonlyUser = DeepReadonly<User>

const user: DeepReadonlyUser = {
  profile: { name: 'Alice' },
}

user.profile.name = 'Bob' // ❌ Error
```

### 9.3. 错误 3：在构造函数外赋值

```ts
// ❌ 在构造函数外修改只读属性
class User {
  readonly id: number

  constructor(id: number) {
    this.id = id
  }

  setId(newId: number) {
    this.id = newId // ❌ Error
  }
}

// ✅ 只在构造函数中初始化
class User {
  readonly id: number

  constructor(id: number) {
    this.id = id // ✅
  }
}
```

### 9.4. 最佳实践

```ts
// ✅ 1. 配置对象使用 readonly
interface Config {
  readonly apiUrl: string
  readonly timeout: number
}

// ✅ 2. 常量数组使用 readonly
const COLORS: readonly string[] = ['red', 'green', 'blue']

// ✅ 3. 函数参数使用 readonly
function process(data: readonly number[]): number[] {
  return data.map((n) => n * 2)
}

// ✅ 4. 不可变更新模式
interface State {
  readonly count: number
}

function increment(state: Readonly<State>): State {
  return { ...state, count: state.count + 1 }
}

// ✅ 5. 结合 Readonly 工具类型
type ReadonlyConfig = Readonly<Config>

// ✅ 6. 深层只读使用 DeepReadonly
type DeepReadonlyState = DeepReadonly<State>

// ✅ 7. 类的只读属性在构造函数初始化
class Entity {
  readonly id: number

  constructor(id: number) {
    this.id = id
  }
}

// ✅ 8. 返回只读数据
function getData(): Readonly<Data> {
  return data
}

// ✅ 9. 使用 as const 断言
const config = {
  port: 3000,
  host: 'localhost',
} as const
// 类型：{ readonly port: 3000; readonly host: 'localhost' }

// ✅ 10. 文档化只读意图
/**
 * 获取配置（只读）
 * @returns 只读配置对象
 */
function getConfig(): Readonly<Config> {
  return config
}
```

## 10. 🔗 引用

- [TypeScript Handbook - readonly][1]
- [TypeScript Handbook - Readonly Utility Type][2]
- [TypeScript Deep Dive - readonly][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties
[2]: https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype
[3]: https://basarat.gitbook.io/typescript/type-system/readonly
