# [0110. 混合类型接口](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0110.%20%E6%B7%B7%E5%90%88%E7%B1%BB%E5%9E%8B%E6%8E%A5%E5%8F%A3)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是混合类型接口？](#3--什么是混合类型接口)
- [4. 🤔 函数对象](#4--函数对象)
  - [4.1. 函数 + 属性](#41-函数--属性)
  - [4.2. 函数 + 方法](#42-函数--方法)
  - [4.3. 函数 + 静态属性](#43-函数--静态属性)
- [5. 🤔 可调用和可构造](#5--可调用和可构造)
  - [5.1. 同时支持两种调用方式](#51-同时支持两种调用方式)
  - [5.2. 工厂 + 构造函数](#52-工厂--构造函数)
  - [5.3. jQuery 风格的 API](#53-jquery-风格的-api)
- [6. 🤔 复杂的混合类型](#6--复杂的混合类型)
  - [6.1. 索引签名 + 具名成员](#61-索引签名--具名成员)
  - [6.2. 泛型混合类型](#62-泛型混合类型)
  - [6.3. 嵌套混合类型](#63-嵌套混合类型)
- [7. 🤔 常见使用场景](#7--常见使用场景)
  - [7.1. 场景 1：事件发射器](#71-场景-1事件发射器)
  - [7.2. 场景 2：链式 API 构建器](#72-场景-2链式-api-构建器)
  - [7.3. 场景 3：可配置的验证器](#73-场景-3可配置的验证器)
  - [7.4. 场景 4：状态管理器](#74-场景-4状态管理器)
  - [7.5. 场景 5：HTTP 客户端](#75-场景-5http-客户端)
- [8. 🤔 常见错误和最佳实践](#8--常见错误和最佳实践)
  - [8.1. 错误 1：忘记类型断言](#81-错误-1忘记类型断言)
  - [8.2. 错误 2：属性访问时机错误](#82-错误-2属性访问时机错误)
  - [8.3. 错误 3：this 绑定问题](#83-错误-3this-绑定问题)
  - [8.4. 错误 4：过度复杂的混合类型](#84-错误-4过度复杂的混合类型)
  - [8.5. 最佳实践](#85-最佳实践)
- [9. 🔗 引用](#9--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 混合类型接口的概念
- 函数对象的定义
- 同时支持调用和构造
- 混合索引签名和属性
- 实际应用场景

## 2. 🫧 评价

混合类型接口（Hybrid Type Interface）允许一个接口同时包含多种类型特性，如调用签名、构造签名、属性和方法。

混合类型接口的特点：

- 多重角色：对象可以同时是函数、构造函数和对象
- 灵活组合：结合调用签名、构造签名、属性、方法
- JavaScript 模式：反映 JavaScript 中函数也是对象的特性
- 类型安全：为复杂对象提供完整的类型定义

常见的混合类型模式：

1. 函数 + 属性：函数携带额外属性
2. 函数 + 方法：函数对象有方法
3. 可调用 + 可构造：既能调用又能 new
4. 索引签名 + 具名成员：动态属性 + 固定成员

理解混合类型接口，能帮助你：

1. 定义复杂的 JavaScript 对象
2. 正确描述第三方库的类型
3. 实现灵活的 API 设计
4. 理解 JavaScript 函数的本质

混合类型接口是 TypeScript 类型系统的高级特性，体现了对 JavaScript 动态特性的完整支持。

## 3. 🤔 什么是混合类型接口？

混合类型接口将调用签名、构造签名、属性和方法组合在一起。

```ts
// ✅ 基本的混合类型
interface Counter {
  // 调用签名：可以作为函数调用
  (start: number): string

  // 属性
  interval: number

  // 方法
  reset(): void
}

function getCounter(): Counter {
  const counter = function (start: number): string {
    return `Count: ${start}`
  } as Counter

  counter.interval = 1000
  counter.reset = function () {
    console.log('Counter reset')
  }

  return counter
}

const counter = getCounter()
console.log(counter(10)) // 'Count: 10' (作为函数)
console.log(counter.interval) // 1000 (访问属性)
counter.reset() // 'Counter reset' (调用方法)
```

关键概念：

- 可调用对象：对象本身可以被调用
- 额外成员：同时拥有属性和方法
- 类型组合：多种类型特征的组合
- JavaScript 本质：函数是对象

## 4. 🤔 函数对象

### 4.1. 函数 + 属性

```ts
// ✅ 函数携带配置属性
interface Logger {
  (message: string): void
  level: 'info' | 'warn' | 'error'
  prefix: string
}

function createLogger(): Logger {
  const logger = ((message: string) => {
    console.log(`[${logger.level}] ${logger.prefix} ${message}`)
  }) as Logger

  logger.level = 'info'
  logger.prefix = 'APP'

  return logger
}

const log = createLogger()
log('Hello') // [info] APP Hello
log.level = 'error'
log('Error occurred') // [error] APP Error occurred
```

### 4.2. 函数 + 方法

```ts
// ✅ 函数对象带方法
interface Formatter {
  (value: any): string
  setFormat(format: string): void
  getFormat(): string
}

function createFormatter(): Formatter {
  let format = 'default'

  const formatter = ((value: any): string => {
    return `[${format}] ${value}`
  }) as Formatter

  formatter.setFormat = (f: string) => {
    format = f
  }

  formatter.getFormat = () => {
    return format
  }

  return formatter
}

const fmt = createFormatter()
console.log(fmt('test')) // '[default] test'
fmt.setFormat('custom')
console.log(fmt('test')) // '[custom] test'
```

### 4.3. 函数 + 静态属性

```ts
// ✅ 模拟类的静态成员
interface MathUtil {
  (x: number, y: number): number
  PI: number
  E: number
  max(...numbers: number[]): number
  min(...numbers: number[]): number
}

const MathUtil: MathUtil = Object.assign((x: number, y: number) => x + y, {
  PI: Math.PI,
  E: Math.E,
  max: Math.max,
  min: Math.min,
})

console.log(MathUtil(1, 2)) // 3 (作为函数)
console.log(MathUtil.PI) // 3.14159...
console.log(MathUtil.max(1, 5, 3)) // 5
```

## 5. 🤔 可调用和可构造

### 5.1. 同时支持两种调用方式

```ts
// ✅ 既可以调用也可以 new
interface DateLike {
  // 调用签名
  (): string

  // 构造签名
  new (): DateObject
  new (timestamp: number): DateObject

  // 静态方法
  now(): number
  parse(dateString: string): number
}

interface DateObject {
  getTime(): number
  toString(): string
}

// JavaScript 的 Date 就是这样的混合类型
const dateStr = Date() // string (调用)
const dateObj = new Date() // Date (构造)
const timestamp = Date.now() // number (静态方法)
```

### 5.2. 工厂 + 构造函数

```ts
// ✅ 灵活的创建模式
interface UserFactory {
  // 作为工厂函数
  (name: string): User

  // 作为构造函数
  new (name: string, age: number): User

  // 静态方法
  fromJSON(json: string): User
  create(data: Partial<User>): User
}

interface User {
  name: string
  age: number
}

const UserFactory: UserFactory = Object.assign(
  function (this: any, name: string, age?: number) {
    if (new.target) {
      // 使用 new 调用
      this.name = name
      this.age = age || 0
      return this
    } else {
      // 直接调用
      return { name, age: 0 }
    }
  },
  {
    fromJSON(json: string): User {
      return JSON.parse(json)
    },
    create(data: Partial<User>): User {
      return { name: '', age: 0, ...data }
    },
  }
) as UserFactory

const user1 = UserFactory('Alice') // 工厂模式
const user2 = new UserFactory('Bob', 30) // 构造函数
const user3 = UserFactory.fromJSON('{"name":"Charlie","age":25}')
```

### 5.3. jQuery 风格的 API

```ts
// ✅ jQuery 风格的混合类型
interface JQuery {
  // 选择器调用
  (selector: string): JQueryObject

  // 构造函数
  new (element: HTMLElement): JQueryObject

  // 工具方法
  ajax(options: AjaxOptions): Promise<any>
  get(url: string): Promise<any>
  post(url: string, data: any): Promise<any>

  // 扩展方法
  fn: JQueryPlugin
}

interface JQueryObject {
  addClass(className: string): JQueryObject
  removeClass(className: string): JQueryObject
  on(event: string, handler: Function): JQueryObject
}

interface JQueryPlugin {
  [name: string]: Function
}

interface AjaxOptions {
  url: string
  method?: string
  data?: any
}
```

## 6. 🤔 复杂的混合类型

### 6.1. 索引签名 + 具名成员

```ts
// ✅ 动态属性 + 固定成员
interface Config {
  // 调用签名
  (key: string): any

  // 索引签名
  [key: string]: any

  // 具名属性
  host: string
  port: number

  // 方法
  get(key: string): any
  set(key: string, value: any): void
}

function createConfig(): Config {
  const data: any = {
    host: 'localhost',
    port: 3000,
  }

  const config = ((key: string) => data[key]) as Config

  config.host = data.host
  config.port = data.port

  config.get = (key: string) => data[key]
  config.set = (key: string, value: any) => {
    data[key] = value
  }

  return new Proxy(config, {
    get(target, prop) {
      return target[prop as string] ?? data[prop as string]
    },
    set(target, prop, value) {
      data[prop as string] = value
      return true
    },
  })
}

const config = createConfig()
console.log(config('host')) // 'localhost' (调用)
console.log(config.port) // 3000 (属性)
config.set('timeout', 5000) // 方法
console.log(config['timeout']) // 5000 (索引)
```

### 6.2. 泛型混合类型

```ts
// ✅ 泛型的混合类型
interface Container<T> {
  // 调用签名
  (): T

  // 属性
  value: T

  // 方法
  map<U>(fn: (value: T) => U): Container<U>
  flatMap<U>(fn: (value: T) => Container<U>): Container<U>
}

function createContainer<T>(initial: T): Container<T> {
  let value = initial

  const container = (() => value) as Container<T>

  Object.defineProperty(container, 'value', {
    get() {
      return value
    },
    set(v) {
      value = v
    },
  })

  container.map = function <U>(fn: (value: T) => U): Container<U> {
    return createContainer(fn(value))
  }

  container.flatMap = function <U>(
    fn: (value: T) => Container<U>
  ): Container<U> {
    return fn(value)
  }

  return container
}

const num = createContainer(42)
console.log(num()) // 42
console.log(num.value) // 42
const str = num.map((n) => n.toString())
console.log(str()) // '42'
```

### 6.3. 嵌套混合类型

```ts
// ✅ 嵌套的混合类型对象
interface API {
  // 调用签名
  (endpoint: string): Promise<any>

  // 嵌套的命名空间
  users: {
    (id: number): Promise<User>
    list(): Promise<User[]>
    create(user: Partial<User>): Promise<User>
  }

  posts: {
    (id: number): Promise<Post>
    list(): Promise<Post[]>
    byUser(userId: number): Promise<Post[]>
  }

  // 配置
  config: {
    baseURL: string
    timeout: number
  }
}

interface User {
  id: number
  name: string
}

interface Post {
  id: number
  title: string
  userId: number
}
```

## 7. 🤔 常见使用场景

### 7.1. 场景 1：事件发射器

```ts
// ✅ 可调用的事件发射器
interface EventEmitter {
  // 作为函数调用发射事件
  (event: string, ...args: any[]): void

  // 方法
  on(event: string, listener: Function): void
  off(event: string, listener: Function): void
  once(event: string, listener: Function): void

  // 属性
  maxListeners: number

  // 静态方法
  listenerCount(event: string): number
}

function createEmitter(): EventEmitter {
  const listeners = new Map<string, Function[]>()

  const emitter = ((event: string, ...args: any[]) => {
    const handlers = listeners.get(event)
    if (handlers) {
      handlers.forEach((handler) => handler(...args))
    }
  }) as EventEmitter

  emitter.maxListeners = 10

  emitter.on = (event, listener) => {
    if (!listeners.has(event)) {
      listeners.set(event, [])
    }
    listeners.get(event)!.push(listener)
  }

  emitter.off = (event, listener) => {
    const handlers = listeners.get(event)
    if (handlers) {
      const index = handlers.indexOf(listener)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  emitter.once = (event, listener) => {
    const wrapper = (...args: any[]) => {
      listener(...args)
      emitter.off(event, wrapper)
    }
    emitter.on(event, wrapper)
  }

  emitter.listenerCount = (event) => {
    return listeners.get(event)?.length || 0
  }

  return emitter
}

const emitter = createEmitter()
emitter.on('data', (data) => console.log(data))
emitter('data', { value: 42 }) // 直接调用发射事件
```

### 7.2. 场景 2：链式 API 构建器

```ts
// ✅ 可调用的查询构建器
interface QueryBuilder<T> {
  // 执行查询
  (): Promise<T[]>

  // 链式方法
  where(field: keyof T, value: any): QueryBuilder<T>
  orderBy(field: keyof T, direction?: 'asc' | 'desc'): QueryBuilder<T>
  limit(count: number): QueryBuilder<T>
  offset(count: number): QueryBuilder<T>

  // 转换方法
  first(): Promise<T | null>
  count(): Promise<number>

  // 调试
  toSQL(): string
}

function query<T>(table: string): QueryBuilder<T> {
  const conditions: any[] = []
  let limitValue: number | null = null
  let offsetValue: number | null = null

  const builder = (async () => {
    // 执行查询逻辑
    return []
  }) as QueryBuilder<T>

  builder.where = (field, value) => {
    conditions.push({ field, value })
    return builder
  }

  builder.limit = (count) => {
    limitValue = count
    return builder
  }

  builder.first = async () => {
    const results = await builder()
    return results[0] || null
  }

  builder.toSQL = () => {
    return `SELECT * FROM ${table}`
  }

  return builder
}

// 使用
const users = await query<User>('users').where('age', 18).limit(10)() // 最后调用执行查询
```

### 7.3. 场景 3：可配置的验证器

```ts
// ✅ 函数验证器带配置
interface Validator<T> {
  // 验证函数
  (value: T): boolean

  // 配置
  options: {
    message?: string
    strict?: boolean
  }

  // 方法
  validate(value: T): ValidationResult
  test(value: T): boolean

  // 组合验证器
  and(other: Validator<T>): Validator<T>
  or(other: Validator<T>): Validator<T>
}

interface ValidationResult {
  valid: boolean
  message?: string
}

function createValidator<T>(
  fn: (value: T) => boolean,
  message?: string
): Validator<T> {
  const validator = ((value: T) => fn(value)) as Validator<T>

  validator.options = { message, strict: false }

  validator.validate = (value) => ({
    valid: fn(value),
    message: fn(value) ? undefined : message,
  })

  validator.test = (value) => fn(value)

  validator.and = (other) => {
    return createValidator(
      (value) => validator(value) && other(value),
      `Both validations must pass`
    )
  }

  validator.or = (other) => {
    return createValidator(
      (value) => validator(value) || other(value),
      `At least one validation must pass`
    )
  }

  return validator
}

const isEmail = createValidator(
  (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  'Invalid email'
)

const isNotEmpty = createValidator(
  (value: string) => value.length > 0,
  'Cannot be empty'
)

const emailValidator = isNotEmpty.and(isEmail)

console.log(emailValidator('test@example.com')) // true
console.log(emailValidator.validate('invalid')) // { valid: false, message: '...' }
```

### 7.4. 场景 4：状态管理器

```ts
// ✅ 可调用的状态管理
interface Store<T> {
  // 获取状态
  (): T

  // 设置状态
  (newState: Partial<T>): void

  // 方法
  getState(): T
  setState(newState: Partial<T>): void
  subscribe(listener: (state: T) => void): () => void

  // 选择器
  select<K extends keyof T>(key: K): T[K]
}

function createStore<T>(initialState: T): Store<T> {
  let state = initialState
  const listeners: Array<(state: T) => void> = []

  const store = function (newState?: Partial<T>) {
    if (newState === undefined) {
      return state
    }
    state = { ...state, ...newState }
    listeners.forEach((listener) => listener(state))
  } as Store<T>

  store.getState = () => state

  store.setState = (newState) => {
    store(newState)
  }

  store.subscribe = (listener) => {
    listeners.push(listener)
    return () => {
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  store.select = (key) => state[key]

  return store
}

const store = createStore({ count: 0, name: 'App' })

console.log(store()) // { count: 0, name: 'App' }
store({ count: 1 }) // 更新状态
console.log(store.select('count')) // 1

const unsubscribe = store.subscribe((state) => {
  console.log('State changed:', state)
})
```

### 7.5. 场景 5：HTTP 客户端

```ts
// ✅ 灵活的 HTTP 客户端
interface HttpClient {
  // 通用请求
  (url: string, options?: RequestOptions): Promise<Response>

  // 快捷方法
  get(url: string, options?: RequestOptions): Promise<Response>
  post(url: string, data?: any, options?: RequestOptions): Promise<Response>
  put(url: string, data?: any, options?: RequestOptions): Promise<Response>
  delete(url: string, options?: RequestOptions): Promise<Response>

  // 配置
  defaults: {
    baseURL: string
    timeout: number
    headers: Record<string, string>
  }

  // 拦截器
  interceptors: {
    request: Interceptor[]
    response: Interceptor[]
  }

  // 实例创建
  create(config: Partial<HttpClient['defaults']>): HttpClient
}

interface RequestOptions {
  method?: string
  headers?: Record<string, string>
  body?: any
}

interface Response {
  data: any
  status: number
  headers: Record<string, string>
}

interface Interceptor {
  onFulfilled?: (value: any) => any
  onRejected?: (error: any) => any
}
```

## 8. 🤔 常见错误和最佳实践

### 8.1. 错误 1：忘记类型断言

```ts
// ❌ 没有类型断言
interface Counter {
  (): number
  count: number
}

const counter = function () {
  return counter.count++
}
// counter 是 Function 类型，缺少 count 属性

// ✅ 使用类型断言
const counter = function () {
  return counter.count++
} as Counter

counter.count = 0
```

### 8.2. 错误 2：属性访问时机错误

```ts
// ❌ 在对象创建前访问属性
const logger = ((message: string) => {
  console.log(`[${logger.level}] ${message}`) // logger.level 可能未定义
}) as Logger

// ✅ 确保属性先初始化
const logger = ((message: string) => {
  console.log(`[${logger.level || 'info'}] ${message}`)
}) as Logger

logger.level = 'info'
```

### 8.3. 错误 3：this 绑定问题

```ts
// ❌ 箭头函数中 this 不正确
interface Counter {
  (): number
  count: number
  reset(): void
}

const counter = (() => counter.count++) as Counter
counter.count = 0
counter.reset = () => {
  this.count = 0 // ❌ 箭头函数中 this 不指向 counter
}

// ✅ 使用普通函数或显式引用
counter.reset = function () {
  counter.count = 0
}
```

### 8.4. 错误 4：过度复杂的混合类型

```ts
// ❌ 过于复杂，难以维护
interface OverlyComplex {
  (): void
  (x: number): void
  (x: string): void
  new (): OverlyComplex
  new (x: number): OverlyComplex
  [key: string]: any
  prop1: string
  prop2: number
  method1(): void
  method2(): void
}

// ✅ 拆分为更清晰的接口
interface SimpleCallable {
  (): void
  (x: number | string): void
}

interface SimpleConstructable {
  new (x?: number): Instance
}

type SimpleMixed = SimpleCallable &
  SimpleConstructable & {
    prop1: string
    prop2: number
  }
```

### 8.5. 最佳实践

```ts
// ✅ 1. 为混合类型添加清晰的文档
/
 * 计数器函数，可以直接调用获取当前计数
 * @example
 * counter() // 返回当前计数
 * counter.increment() // 增加计数
 */
interface Counter {
  (): number
  count: number
  increment(): void
  decrement(): void
}

// ✅ 2. 使用工厂函数创建混合类型
function createCounter(initial = 0): Counter {
  const counter = (() => counter.count) as Counter
  counter.count = initial
  counter.increment = () => counter.count++
  counter.decrement = () => counter.count--
  return counter
}

// ✅ 3. 保持接口职责单一
// ❌ 不好：功能太多
interface Bad {
  (): any
  new (): any
  [key: string]: any
  // 太多功能
}

// ✅ 好：职责明确
interface Logger {
  (message: string): void
  level: string
  setLevel(level: string): void
}

// ✅ 4. 使用 Proxy 实现复杂行为
function createProxy<T extends object>(target: T): T {
  return new Proxy(target, {
    get(target, prop) {
      // 自定义获取逻辑
      return target[prop as keyof T]
    },
    set(target, prop, value) {
      // 自定义设置逻辑
      return Reflect.set(target, prop, value)
    },
  })
}

// ✅ 5. 为常用模式创建类型别名
type CallableWithProps<T, P> = T & P

interface MyFunc {
  (x: number): number
}

interface MyProps {
  version: string
}

type MyCallable = CallableWithProps<MyFunc, MyProps>

// ✅ 6. 使用 Object.assign 组合功能
const func = Object.assign((x: number) => x * 2, {
  version: '1.0.0',
  double: (x: number) => x * 2,
})

// ✅ 7. 测试混合类型的各个方面
const counter = createCounter()
console.assert(typeof counter === 'function')
console.assert(typeof counter.count === 'number')
console.assert(typeof counter.increment === 'function')

// ✅ 8. 避免在生产代码中过度使用
// 混合类型适合特定场景，不要滥用

// ✅ 9. 提供类型守卫
function isCallable(value: any): value is Function {
  return typeof value === 'function'
}

function isCounter(value: any): value is Counter {
  return isCallable(value) && 'count' in value && 'increment' in value
}

// ✅ 10. 考虑使用类代替复杂混合类型
// 如果混合类型过于复杂，考虑使用类
class CounterClass {
  count = 0

  call() {
    return this.count
  }

  increment() {
    this.count++
  }
}
```

## 9. 🔗 引用

- [TypeScript Handbook - Interfaces][1]
- [TypeScript Handbook - Hybrid Types][2]
- [TypeScript Deep Dive - Callable][3]

[1]: https://www.typescriptlang.org/docs/handbook/interfaces.html
[2]: https://www.typescriptlang.org/docs/handbook/interfaces.html#hybrid-types
[3]: https://basarat.gitbook.io/typescript/type-system/callable
