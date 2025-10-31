# [0118. 泛型约束](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0118.%20%E6%B3%9B%E5%9E%8B%E7%BA%A6%E6%9D%9F)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是泛型约束？](#3--什么是泛型约束)
- [4. 🤔 基本约束语法](#4--基本约束语法)
  - [4.1. extends 基本用法](#41-extends-基本用法)
  - [4.2. 约束为类](#42-约束为类)
  - [4.3. 约束为基本类型](#43-约束为基本类型)
  - [4.4. 约束为对象类型](#44-约束为对象类型)
- [5. 🤔 常见约束类型](#5--常见约束类型)
  - [5.1. 约束为数组](#51-约束为数组)
  - [5.2. 约束为函数](#52-约束为函数)
  - [5.3. 约束为 Promise](#53-约束为-promise)
  - [5.4. 约束有特定属性](#54-约束有特定属性)
  - [5.5. 约束为构造函数](#55-约束为构造函数)
- [6. 🤔 多重约束](#6--多重约束)
  - [6.1. 使用交叉类型](#61-使用交叉类型)
  - [6.2. 组合多个接口](#62-组合多个接口)
  - [6.3. 约束数组元素](#63-约束数组元素)
- [7. 🤔 类型参数之间的约束](#7--类型参数之间的约束)
  - [7.1. 一个参数约束另一个](#71-一个参数约束另一个)
  - [7.2. 确保类型兼容](#72-确保类型兼容)
  - [7.3. 约束为另一个参数的属性](#73-约束为另一个参数的属性)
- [8. 🤔 keyof 约束](#8--keyof-约束)
  - [8.1. 基本 keyof 约束](#81-基本-keyof-约束)
  - [8.2. 约束多个键](#82-约束多个键)
  - [8.3. 约束为特定类型的键](#83-约束为特定类型的键)
  - [8.4. 约束嵌套属性](#84-约束嵌套属性)
- [9. 🤔 常见使用场景](#9--常见使用场景)
  - [9.1. 场景 1：数据库操作](#91-场景-1数据库操作)
  - [9.2. 场景 2：表单验证](#92-场景-2表单验证)
  - [9.3. 场景 3：事件处理](#93-场景-3事件处理)
  - [9.4. 场景 4：状态管理](#94-场景-4状态管理)
  - [9.5. 场景 5：API 客户端](#95-场景-5api-客户端)
  - [9.6. 场景 6：深度只读](#96-场景-6深度只读)
- [10. 🤔 常见错误和最佳实践](#10--常见错误和最佳实践)
  - [10.1. 错误 1：约束过于严格](#101-错误-1约束过于严格)
  - [10.2. 错误 2：忘记添加必要约束](#102-错误-2忘记添加必要约束)
  - [10.3. 错误 3：约束类型不兼容](#103-错误-3约束类型不兼容)
  - [10.4. 错误 4：过度使用约束](#104-错误-4过度使用约束)
  - [10.5. 最佳实践](#105-最佳实践)
- [11. 🔗 引用](#11--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 泛型约束的概念和语法
- extends 关键字的使用
- 多重约束和交叉类型
- 类型参数之间的约束
- keyof 约束和属性访问
- 实际应用场景

## 2. 🫧 评价

泛型约束（Generic Constraints）使用 `extends` 关键字**限制类型参数**的范围。

泛型约束的特点：

- **类型限制**：确保类型参数满足特定条件
- **安全访问**：可以安全使用约束类型的属性和方法
- **灵活可控**：在灵活性和类型安全之间取得平衡
- **编译时检查**：在编译时验证类型约束

泛型约束 vs 无约束泛型：

| 特性         | 有约束泛型       | 无约束泛型   |
| ------------ | ---------------- | ------------ |
| **类型安全** | 高               | 中           |
| **可用操作** | 受约束类型支持   | 极少         |
| **灵活性**   | 受限但可控       | 最大         |
| **适用场景** | 需要访问特定成员 | 只传递不使用 |
| **类型推断** | 更精确           | 可能过于宽泛 |

泛型约束的优势：

1. **类型安全**：确保类型参数具有所需的属性
2. **智能提示**：IDE 能提供准确的自动完成
3. **避免运行时错误**：在编译时发现问题
4. **文档作用**：明确表达类型要求

理解泛型约束，能帮助你：

1. 编写更安全的泛型代码
2. 精确控制类型参数的范围
3. 实现复杂的类型关系
4. 提高代码的可维护性

泛型约束是 TypeScript 泛型系统的核心特性，是构建类型安全代码的重要工具。

## 3. 🤔 什么是泛型约束？

泛型约束使用 `extends` 关键字**限制类型参数必须满足某些条件**。

```ts
// ❌ 无约束：无法安全访问 length
function getLength<T>(arg: T): number {
  // return arg.length  // ❌ Error: T 可能没有 length
  return 0
}

// ✅ 有约束：可以安全访问 length
interface Lengthwise {
  length: number
}

function getLength<T extends Lengthwise>(arg: T): number {
  return arg.length // ✅ 安全访问
}

getLength('hello') // ✅ string 有 length
getLength([1, 2, 3]) // ✅ array 有 length
getLength({ length: 10, value: 'test' }) // ✅ 对象有 length
// getLength(42)  // ❌ Error: number 没有 length
```

**关键概念**：

- **extends 关键字**：指定类型必须满足的条件
- **约束类型**：可以是接口、类、基本类型等
- **安全访问**：可以使用约束类型的成员
- **编译时检查**：不满足约束会编译错误

## 4. 🤔 基本约束语法

### 4.1. extends 基本用法

```ts
// ✅ 约束为接口
interface Named {
  name: string
}

function greet<T extends Named>(obj: T): string {
  return `Hello, ${obj.name}`
}

greet({ name: 'Alice', age: 30 }) // ✅
// greet({ age: 30 })  // ❌ Error: 缺少 name
```

### 4.2. 约束为类

```ts
// ✅ 约束为类
class Animal {
  name: string
  constructor(name: string) {
    this.name = name
  }

  makeSound(): string {
    return 'Some sound'
  }
}

function playWithAnimal<T extends Animal>(animal: T): void {
  console.log(animal.name)
  console.log(animal.makeSound())
}

class Dog extends Animal {
  makeSound(): string {
    return 'Woof!'
  }
}

playWithAnimal(new Dog('Buddy')) // ✅
// playWithAnimal({ name: 'Not an animal' })  // ❌ Error
```

### 4.3. 约束为基本类型

```ts
// ✅ 约束为原始类型
function double<T extends number>(value: T): number {
  return value * 2
}

double(21) // ✅ 42
// double('21')  // ❌ Error: string 不满足约束

// ✅ 约束为联合类型
function format<T extends string | number>(value: T): string {
  return String(value)
}

format(42) // ✅
format('hello') // ✅
// format(true)  // ❌ Error: boolean 不满足约束
```

### 4.4. 约束为对象类型

```ts
// ✅ 约束为对象
function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 }
}

const result = merge({ a: 1 }, { b: 2 }) // { a: 1, b: 2 }
// merge(42, { b: 2 })  // ❌ Error: 42 不是对象
```

## 5. 🤔 常见约束类型

### 5.1. 约束为数组

```ts
// ✅ 约束为数组
function first<T extends any[]>(arr: T): T[number] | undefined {
  return arr[0]
}

const num = first([1, 2, 3]) // number
const str = first(['a', 'b']) // string
// first(42)  // ❌ Error: 不是数组
```

### 5.2. 约束为函数

```ts
// ✅ 约束为函数
function callTwice<T extends (...args: any[]) => any>(fn: T): void {
  fn()
  fn()
}

callTwice(() => console.log('Hello')) // ✅
// callTwice(42)  // ❌ Error: 不是函数
```

### 5.3. 约束为 Promise

```ts
// ✅ 约束为 Promise
async function unwrap<T extends Promise<any>>(promise: T): Promise<Awaited<T>> {
  return await promise
}

const result = await unwrap(Promise.resolve(42)) // number
// unwrap(42)  // ❌ Error: 不是 Promise
```

### 5.4. 约束有特定属性

```ts
// ✅ 约束必须有特定属性
interface Identifiable {
  id: number
}

interface Timestamped {
  createdAt: Date
  updatedAt: Date
}

function logEntity<T extends Identifiable & Timestamped>(entity: T): void {
  console.log(`Entity ${entity.id}`)
  console.log(`Created: ${entity.createdAt}`)
  console.log(`Updated: ${entity.updatedAt}`)
}

logEntity({
  id: 1,
  name: 'Test',
  createdAt: new Date(),
  updatedAt: new Date(),
}) // ✅
```

### 5.5. 约束为构造函数

```ts
// ✅ 约束为构造函数类型
interface Constructor<T = any> {
  new (...args: any[]): T
}

function createInstance<T, C extends Constructor<T>>(
  ctor: C,
  ...args: any[]
): T {
  return new ctor(...args)
}

class Person {
  constructor(public name: string) {}
}

const person = createInstance(Person, 'Alice') // Person
```

## 6. 🤔 多重约束

### 6.1. 使用交叉类型

```ts
// ✅ 多重约束
interface Named {
  name: string
}

interface Aged {
  age: number
}

function describe<T extends Named & Aged>(person: T): string {
  return `${person.name} is ${person.age} years old`
}

describe({ name: 'Alice', age: 30 }) // ✅
// describe({ name: 'Bob' })  // ❌ Error: 缺少 age
// describe({ age: 30 })  // ❌ Error: 缺少 name
```

### 6.2. 组合多个接口

```ts
// ✅ 组合约束
interface Readable {
  read(): string
}

interface Writable {
  write(data: string): void
}

interface Closeable {
  close(): void
}

function processStream<T extends Readable & Writable & Closeable>(
  stream: T
): void {
  const data = stream.read()
  stream.write(data.toUpperCase())
  stream.close()
}
```

### 6.3. 约束数组元素

```ts
// ✅ 约束数组中的元素类型
interface Comparable {
  compareTo(other: this): number
}

function sort<T extends Comparable>(items: T[]): T[] {
  return items.sort((a, b) => a.compareTo(b))
}

class Version implements Comparable {
  constructor(public major: number, public minor: number) {}

  compareTo(other: Version): number {
    if (this.major !== other.major) {
      return this.major - other.major
    }
    return this.minor - other.minor
  }
}

const versions = [new Version(2, 0), new Version(1, 5), new Version(1, 10)]

const sorted = sort(versions)
```

## 7. 🤔 类型参数之间的约束

### 7.1. 一个参数约束另一个

```ts
// ✅ U 必须是 T 的子类型
function copyProperties<T extends U, U>(target: T, source: U): T {
  return Object.assign(target, source)
}

const result = copyProperties(
  { id: 1, name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 }
) // { id: 1, name: 'Bob', age: 25 }
```

### 7.2. 确保类型兼容

```ts
// ✅ 确保返回类型是输入类型的子集
function pick<T, K extends T>(source: T, picked: K): K {
  return picked
}

interface Person {
  name: string
  age: number
  email: string
}

interface PersonName {
  name: string
}

const person: Person = { name: 'Alice', age: 30, email: 'alice@example.com' }
const name: PersonName = { name: 'Alice' }

const result = pick(person, name) // PersonName
```

### 7.3. 约束为另一个参数的属性

```ts
// ✅ K 必须是 T 的键
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const person = { name: 'Alice', age: 30 }
const name = getProperty(person, 'name') // string
const age = getProperty(person, 'age') // number
// getProperty(person, 'email')  // ❌ Error: 'email' 不是 person 的键
```

## 8. 🤔 keyof 约束

### 8.1. 基本 keyof 约束

```ts
// ✅ 约束为对象的键
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user = { id: 1, name: 'Alice', email: 'alice@example.com' }
const id = getValue(user, 'id') // number
const name = getValue(user, 'name') // string
// getValue(user, 'invalid')  // ❌ Error
```

### 8.2. 约束多个键

```ts
// ✅ 约束为多个键
function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>
  keys.forEach((key) => {
    result[key] = obj[key]
  })
  return result
}

const user = { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 }
const picked = pick(user, 'name', 'email') // { name: string; email: string }
```

### 8.3. 约束为特定类型的键

```ts
// ✅ 约束为特定值类型的键
function getNumberKeys<T>(obj: T): Array<keyof T> {
  return Object.keys(obj).filter(
    (key) => typeof obj[key as keyof T] === 'number'
  ) as Array<keyof T>
}

// ✅ 更精确的类型
type NumberKeysOf<T> = {
  [K in keyof T]: T[K] extends number ? K : never
}[keyof T]

function incrementNumbers<T, K extends NumberKeysOf<T>>(obj: T, key: K): void {
  ;(obj[key] as any)++
}

const stats = { count: 10, name: 'test', score: 95 }
incrementNumbers(stats, 'count') // ✅
incrementNumbers(stats, 'score') // ✅
// incrementNumbers(stats, 'name')  // ❌ Error: name 不是 number 类型
```

### 8.4. 约束嵌套属性

```ts
// ✅ 约束嵌套路径
type PathOf<T> = {
  [K in keyof T]: T[K] extends object
    ? K | `${K & string}.${PathOf<T[K]> & string}`
    : K
}[keyof T]

function getNestedValue<T, P extends PathOf<T>>(obj: T, path: P): any {
  const keys = (path as string).split('.')
  let value: any = obj
  for (const key of keys) {
    value = value[key]
  }
  return value
}

const user = {
  name: 'Alice',
  address: {
    city: 'New York',
    zip: '10001',
  },
}

const city = getNestedValue(user, 'address.city') // 'New York'
```

## 9. 🤔 常见使用场景

### 9.1. 场景 1：数据库操作

```ts
// ✅ 带约束的数据库仓储
interface Entity {
  id: number
}

interface Repository<T extends Entity> {
  findById(id: number): Promise<T | null>
  findAll(): Promise<T[]>
  create(entity: Omit<T, 'id'>): Promise<T>
  update(id: number, entity: Partial<T>): Promise<T>
  delete(id: number): Promise<boolean>
}

interface User extends Entity {
  name: string
  email: string
  age: number
}

class UserRepository implements Repository<User> {
  async findById(id: number): Promise<User | null> {
    // 实现
    return null
  }

  async findAll(): Promise<User[]> {
    return []
  }

  async create(entity: Omit<User, 'id'>): Promise<User> {
    return { id: 1, ...entity }
  }

  async update(id: number, entity: Partial<User>): Promise<User> {
    return { id, name: '', email: '', age: 0, ...entity }
  }

  async delete(id: number): Promise<boolean> {
    return true
  }
}
```

### 9.2. 场景 2：表单验证

```ts
// ✅ 类型安全的表单验证
type ValidationRule<T> = {
  validate: (value: T) => boolean
  message: string
}

interface Validator<T extends object> {
  rules: {
    [K in keyof T]?: Array<ValidationRule<T[K]>>
  }

  validate(data: T): {
    valid: boolean
    errors: Partial<Record<keyof T, string[]>>
  }
}

interface LoginForm {
  email: string
  password: string
}

const loginValidator: Validator<LoginForm> = {
  rules: {
    email: [
      {
        validate: (value) => value.includes('@'),
        message: 'Invalid email format',
      },
      {
        validate: (value) => value.length > 0,
        message: 'Email is required',
      },
    ],
    password: [
      {
        validate: (value) => value.length >= 8,
        message: 'Password must be at least 8 characters',
      },
    ],
  },

  validate(data) {
    const errors: Partial<Record<keyof LoginForm, string[]>> = {}
    let valid = true

    for (const key in this.rules) {
      const rules = this.rules[key as keyof LoginForm]
      if (rules) {
        const fieldErrors: string[] = []
        for (const rule of rules) {
          if (!rule.validate(data[key as keyof LoginForm])) {
            fieldErrors.push(rule.message)
            valid = false
          }
        }
        if (fieldErrors.length > 0) {
          errors[key as keyof LoginForm] = fieldErrors
        }
      }
    }

    return { valid, errors }
  },
}
```

### 9.3. 场景 3：事件处理

```ts
// ✅ 类型安全的事件系统
interface EventMap {
  [key: string]: any
}

interface TypedEventEmitter<T extends EventMap> {
  on<K extends keyof T>(event: K, handler: (data: T[K]) => void): void

  off<K extends keyof T>(event: K, handler: (data: T[K]) => void): void

  emit<K extends keyof T>(event: K, data: T[K]): void
}

interface AppEvents {
  'user:login': { userId: number; timestamp: Date }
  'user:logout': { userId: number }
  'data:updated': { count: number }
}

class EventEmitter<T extends EventMap> implements TypedEventEmitter<T> {
  private handlers = new Map<keyof T, Array<(data: any) => void>>()

  on<K extends keyof T>(event: K, handler: (data: T[K]) => void): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, [])
    }
    this.handlers.get(event)!.push(handler)
  }

  off<K extends keyof T>(event: K, handler: (data: T[K]) => void): void {
    const handlers = this.handlers.get(event)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    const handlers = this.handlers.get(event)
    if (handlers) {
      handlers.forEach((handler) => handler(data))
    }
  }
}

const emitter = new EventEmitter<AppEvents>()
emitter.on('user:login', (data) => {
  console.log(`User ${data.userId} logged in`)
})
```

### 9.4. 场景 4：状态管理

```ts
// ✅ 类型安全的状态更新
interface State {
  [key: string]: any
}

interface StateManager<T extends State> {
  getState(): T
  setState<K extends keyof T>(key: K, value: T[K]): void
  updateState(updates: Partial<T>): void
  select<K extends keyof T>(key: K): T[K]
  subscribe<K extends keyof T>(
    key: K,
    listener: (value: T[K]) => void
  ): () => void
}

class Store<T extends State> implements StateManager<T> {
  private state: T
  private listeners = new Map<keyof T, Array<(value: any) => void>>()

  constructor(initialState: T) {
    this.state = initialState
  }

  getState(): T {
    return this.state
  }

  setState<K extends keyof T>(key: K, value: T[K]): void {
    this.state[key] = value
    this.notifyListeners(key, value)
  }

  updateState(updates: Partial<T>): void {
    Object.assign(this.state, updates)
    for (const key in updates) {
      this.notifyListeners(key as keyof T, updates[key])
    }
  }

  select<K extends keyof T>(key: K): T[K] {
    return this.state[key]
  }

  subscribe<K extends keyof T>(
    key: K,
    listener: (value: T[K]) => void
  ): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, [])
    }
    this.listeners.get(key)!.push(listener)

    return () => {
      const listeners = this.listeners.get(key)!
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  private notifyListeners<K extends keyof T>(key: K, value: T[K]): void {
    const listeners = this.listeners.get(key)
    if (listeners) {
      listeners.forEach((listener) => listener(value))
    }
  }
}
```

### 9.5. 场景 5：API 客户端

```ts
// ✅ 类型安全的 API 路由
interface ApiRoutes {
  [endpoint: string]: {
    request: any
    response: any
  }
}

interface ApiClient<T extends ApiRoutes> {
  get<K extends keyof T>(
    endpoint: K,
    params?: T[K]['request']
  ): Promise<T[K]['response']>

  post<K extends keyof T>(
    endpoint: K,
    data: T[K]['request']
  ): Promise<T[K]['response']>

  put<K extends keyof T>(
    endpoint: K,
    data: T[K]['request']
  ): Promise<T[K]['response']>

  delete<K extends keyof T>(endpoint: K): Promise<T[K]['response']>
}

interface MyApiRoutes extends ApiRoutes {
  '/users': {
    request: { page?: number; limit?: number }
    response: User[]
  }
  '/users/:id': {
    request: { id: number }
    response: User
  }
  '/posts': {
    request: { title: string; content: string }
    response: Post
  }
}

interface User {
  id: number
  name: string
}

interface Post {
  id: number
  title: string
  content: string
}

class HttpClient<T extends ApiRoutes> implements ApiClient<T> {
  async get<K extends keyof T>(
    endpoint: K,
    params?: T[K]['request']
  ): Promise<T[K]['response']> {
    // 实现
    return null as any
  }

  async post<K extends keyof T>(
    endpoint: K,
    data: T[K]['request']
  ): Promise<T[K]['response']> {
    return null as any
  }

  async put<K extends keyof T>(
    endpoint: K,
    data: T[K]['request']
  ): Promise<T[K]['response']> {
    return null as any
  }

  async delete<K extends keyof T>(endpoint: K): Promise<T[K]['response']> {
    return null as any
  }
}

const client = new HttpClient<MyApiRoutes>()
const users = await client.get('/users', { page: 1, limit: 10 }) // User[]
```

### 9.6. 场景 6：深度只读

```ts
// ✅ 深度只读约束
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

function freeze<T extends object>(obj: T): DeepReadonly<T> {
  Object.freeze(obj)
  Object.keys(obj).forEach((key) => {
    const value = obj[key as keyof T]
    if (typeof value === 'object' && value !== null) {
      freeze(value)
    }
  })
  return obj as DeepReadonly<T>
}

const config = freeze({
  database: {
    host: 'localhost',
    port: 5432,
    credentials: {
      username: 'admin',
      password: 'secret',
    },
  },
})

// config.database.host = 'newhost'  // ❌ Error: readonly
// config.database.credentials.password = 'new'  // ❌ Error: readonly
```

## 10. 🤔 常见错误和最佳实践

### 10.1. 错误 1：约束过于严格

```ts
// ❌ 约束过严，限制了灵活性
function process<T extends { id: number; name: string; email: string }>(
  item: T
): void {
  console.log(item.id, item.name, item.email)
}

// ✅ 只约束必要的属性
function process<T extends { id: number }>(item: T): void {
  console.log(item.id)
}
```

### 10.2. 错误 2：忘记添加必要约束

```ts
// ❌ 没有约束，无法安全访问属性
function compare<T>(a: T, b: T): number {
  // return a - b  // ❌ Error: T 可能不支持减法
  return 0
}

// ✅ 添加约束
function compare<T extends number>(a: T, b: T): number {
  return a - b
}
```

### 10.3. 错误 3：约束类型不兼容

```ts
// ❌ 约束冲突
interface A {
  value: string
}

interface B {
  value: number
}

// function merge<T extends A & B>(item: T): void {}  // ❌ A & B 不可能

// ✅ 使用联合类型或重新设计
interface C {
  value: string | number
}

function process<T extends C>(item: T): void {
  console.log(item.value)
}
```

### 10.4. 错误 4：过度使用约束

```ts
// ❌ 不必要的约束
function identity<T extends any>(arg: T): T {
  return arg
}

// ✅ 简化
function identity<T>(arg: T): T {
  return arg
}
```

### 10.5. 最佳实践

```ts
// ✅ 1. 只约束必要的属性
function sortById<T extends { id: number }>(items: T[]): T[] {
  return items.sort((a, b) => a.id - b.id)
}

// ✅ 2. 使用接口定义复杂约束
interface Comparable<T> {
  compareTo(other: T): number
}

function sort<T extends Comparable<T>>(items: T[]): T[] {
  return items.sort((a, b) => a.compareTo(b))
}

// ✅ 3. 组合约束
interface Named {
  name: string
}

interface Aged {
  age: number
}

function describeEntity<T extends Named & Aged>(entity: T): string {
  return `${entity.name}, ${entity.age}`
}

// ✅ 4. keyof 确保键存在
function pluck<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>
  keys.forEach((key) => {
    result[key] = obj[key]
  })
  return result
}

// ✅ 5. 约束类型参数关系
function assign<T extends U, U>(target: T, source: U): T {
  return Object.assign(target, source)
}

// ✅ 6. 使用条件类型细化约束
type NonNullableKeys<T> = {
  [K in keyof T]: null extends T[K] ? never : K
}[keyof T]

function requireNonNull<T, K extends NonNullableKeys<T>>(
  obj: T,
  key: K
): NonNullable<T[K]> {
  const value = obj[key]
  if (value === null || value === undefined) {
    throw new Error(`${String(key)} is null`)
  }
  return value as NonNullable<T[K]>
}

// ✅ 7. 文档化约束原因
/**
 * 处理可迭代对象
 * @template T - 必须是可迭代的，以便使用 for...of
 */
function processIterable<T extends Iterable<any>>(items: T): void {
  for (const item of items) {
    console.log(item)
  }
}

// ✅ 8. 递归约束
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

function merge<T extends object>(target: T, source: DeepPartial<T>): T {
  return Object.assign({}, target, source) as T
}

// ✅ 9. 约束构造函数
interface Constructable<T> {
  new (...args: any[]): T
}

function instantiate<T>(ctor: Constructable<T>, ...args: any[]): T {
  return new ctor(...args)
}

// ✅ 10. 保持约束简单明了
// 复杂约束使用类型别名
type Serializable =
  | string
  | number
  | boolean
  | null
  | Serializable[]
  | { [key: string]: Serializable }

function serialize<T extends Serializable>(value: T): string {
  return JSON.stringify(value)
}
```

## 11. 🔗 引用

- [TypeScript Handbook - Generics][1]
- [TypeScript Handbook - Type Constraints][2]
- [TypeScript Deep Dive - Generics][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/generics.html
[2]: https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints
[3]: https://basarat.gitbook.io/typescript/type-system/generics
