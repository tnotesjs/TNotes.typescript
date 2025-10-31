# [0121. 泛型默认值](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0121.%20%E6%B3%9B%E5%9E%8B%E9%BB%98%E8%AE%A4%E5%80%BC)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是泛型默认值？](#3--什么是泛型默认值)
- [4. 🤔 基本语法](#4--基本语法)
  - [4.1. 简单默认值](#41-简单默认值)
  - [4.2. 函数中的默认值](#42-函数中的默认值)
  - [4.3. 类中的默认值](#43-类中的默认值)
  - [4.4. 类型别名中的默认值](#44-类型别名中的默认值)
- [5. 🤔 多个泛型参数的默认值](#5--多个泛型参数的默认值)
  - [5.1. 部分默认值](#51-部分默认值)
  - [5.2. 依赖前面的参数](#52-依赖前面的参数)
  - [5.3. 链式默认值](#53-链式默认值)
  - [5.4. 顺序要求](#54-顺序要求)
- [6. 🤔 默认值与约束结合](#6--默认值与约束结合)
  - [6.1. 带约束的默认值](#61-带约束的默认值)
  - [6.2. 约束与默认值的关系](#62-约束与默认值的关系)
  - [6.3. 复杂约束场景](#63-复杂约束场景)
- [7. 🤔 默认值的推断规则](#7--默认值的推断规则)
  - [7.1. 推断优先于默认值](#71-推断优先于默认值)
  - [7.2. 无法推断时使用默认值](#72-无法推断时使用默认值)
  - [7.3. 部分推断](#73-部分推断)
- [8. 🤔 常见使用场景](#8--常见使用场景)
  - [8.1. 场景 1：API 响应类型](#81-场景-1api-响应类型)
  - [8.2. 场景 2：状态管理](#82-场景-2状态管理)
  - [8.3. 场景 3：Promise 包装器](#83-场景-3promise-包装器)
  - [8.4. 场景 4：事件发射器](#84-场景-4事件发射器)
  - [8.5. 场景 5：缓存系统](#85-场景-5缓存系统)
  - [8.6. 场景 6：数据验证器](#86-场景-6数据验证器)
  - [8.7. 场景 7：查询构建器](#87-场景-7查询构建器)
- [9. 🤔 常见错误和最佳实践](#9--常见错误和最佳实践)
  - [9.1. 错误 1：默认值不满足约束](#91-错误-1默认值不满足约束)
  - [9.2. 错误 2：默认值顺序错误](#92-错误-2默认值顺序错误)
  - [9.3. 错误 3：过度使用 any](#93-错误-3过度使用-any)
  - [9.4. 错误 4：忽略类型推断](#94-错误-4忽略类型推断)
  - [9.5. 最佳实践](#95-最佳实践)
- [10. 🔗 引用](#10--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 泛型默认值的概念和语法
- 单个和多个默认值
- 默认值与约束的组合
- 类型推断优先级
- 实际应用场景

## 2. 🫧 评价

泛型默认值（Generic Default Parameters）允许为**类型参数指定默认类型**。

泛型默认值的特点：

- **可选类型参数**：不指定时使用默认值
- **简化使用**：减少重复的类型标注
- **向后兼容**：渐进式添加类型参数
- **灵活性**：在需要时可以覆盖默认值

泛型默认值 vs 无默认值：

| 特性           | 有默认值 | 无默认值 |
| -------------- | -------- | -------- |
| **必须指定**   | 否       | 是       |
| **使用便捷性** | 高       | 中       |
| **代码简洁**   | 更简洁   | 较冗长   |
| **灵活性**     | 可覆盖   | 必须指定 |
| **适用场景**   | 常见类型 | 特殊类型 |

泛型默认值的优势：

1. **减少样板代码**：常见情况不需要指定类型
2. **提高可读性**：代码更简洁清晰
3. **渐进增强**：可以逐步添加类型参数
4. **保持兼容性**：不破坏现有 API

理解泛型默认值，能帮助你：

1. 设计更友好的 API
2. 简化常见用例
3. 提高代码可维护性
4. 实现渐进式类型化

泛型默认值是 TypeScript 3.0+ 的重要特性，是构建灵活类型系统的有力工具。

## 3. 🤔 什么是泛型默认值？

泛型默认值在**类型参数声明时指定默认类型**，当使用时不提供类型参数则使用默认值。

```ts
// ❌ 无默认值：必须指定类型
interface Container<T> {
  value: T
}

// const box: Container = { value: 42 }  // ❌ Error: 需要类型参数

// ✅ 有默认值：可以省略类型参数
interface Container<T = any> {
  value: T
}

const box1: Container = { value: 42 } // ✅ T 默认为 any
const box2: Container<number> = { value: 42 } // ✅ 明确指定为 number
const box3: Container<string> = { value: 'hello' } // ✅ 明确指定为 string
```

**关键概念**：

- **= 语法**：使用 `=` 指定默认类型
- **可选**：不提供类型参数时使用默认值
- **可覆盖**：可以显式指定其他类型
- **推断优先**：类型推断优先于默认值

## 4. 🤔 基本语法

### 4.1. 简单默认值

```ts
// ✅ 基本默认值
interface Response<T = unknown> {
  data: T
  status: number
  message: string
}

// 使用默认值
const response1: Response = {
  data: { anything: true },
  status: 200,
  message: 'OK',
}

// 指定具体类型
interface User {
  id: number
  name: string
}

const response2: Response<User> = {
  data: { id: 1, name: 'Alice' },
  status: 200,
  message: 'OK',
}
```

### 4.2. 函数中的默认值

```ts
// ✅ 函数泛型默认值
function wrap<T = string>(value: T): { value: T } {
  return { value }
}

const wrapped1 = wrap('hello') // { value: string }
const wrapped2 = wrap<number>(42) // { value: number }
const wrapped3 = wrap(true) // { value: boolean } - 类型推断
```

### 4.3. 类中的默认值

```ts
// ✅ 类泛型默认值
class Box<T = any> {
  constructor(public value: T) {}

  getValue(): T {
    return this.value
  }
}

const box1 = new Box('hello') // Box<string> - 推断
const box2 = new Box<number>(42) // Box<number> - 明确指定
const box3: Box = new Box(true) // Box<any> - 使用默认值
```

### 4.4. 类型别名中的默认值

```ts
// ✅ 类型别名默认值
type Result<T = void, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E }

const result1: Result = { success: true, data: undefined } // void, Error
const result2: Result<number> = { success: true, data: 42 } // number, Error
const result3: Result<string, string> = {
  success: false,
  error: 'Custom error',
} // string, string
```

## 5. 🤔 多个泛型参数的默认值

### 5.1. 部分默认值

```ts
// ✅ 部分参数有默认值
interface Map<K, V = K> {
  get(key: K): V | undefined
  set(key: K, value: V): void
}

// V 默认与 K 相同
const map1: Map<string> = {
  get(key) {
    return key
  },
  set(key, value) {},
}

// 明确指定不同的 V
const map2: Map<string, number> = {
  get(key) {
    return 0
  },
  set(key, value) {},
}
```

### 5.2. 依赖前面的参数

```ts
// ✅ 默认值依赖前面的类型参数
interface Transformer<T, U = T> {
  transform(input: T): U
}

const identity: Transformer<number> = {
  transform(input) {
    return input
  }, // U 默认为 number
}

const toString: Transformer<number, string> = {
  transform(input) {
    return input.toString()
  },
}
```

### 5.3. 链式默认值

```ts
// ✅ 多层默认值
interface Config<T = string, U = T[], V = Promise<U>> {
  value: T
  list: U
  async: V
}

const config1: Config = {
  value: '',
  list: [],
  async: Promise.resolve([]),
} // string, string[], Promise<string[]>

const config2: Config<number> = {
  value: 0,
  list: [],
  async: Promise.resolve([]),
} // number, number[], Promise<number[]>
```

### 5.4. 顺序要求

```ts
// ✅ 有默认值的参数必须在后面
interface Valid<T, U = string> {
  first: T
  second: U
}

// ❌ 不能在前面的参数后添加必需参数
// interface Invalid<T = string, U> {  // Error
//   first: T
//   second: U
// }

// ✅ 正确：所有默认值参数都在后面
interface Correct<T, U = string, V = number> {
  first: T
  second: U
  third: V
}
```

## 6. 🤔 默认值与约束结合

### 6.1. 带约束的默认值

```ts
// ✅ 默认值必须满足约束
interface Lengthwise {
  length: number
}

interface Container<T extends Lengthwise = string> {
  value: T
  getLength(): number
}

const container1: Container = {
  value: 'hello', // string 满足 Lengthwise
  getLength() {
    return this.value.length
  },
}

const container2: Container<number[]> = {
  value: [1, 2, 3],
  getLength() {
    return this.value.length
  },
}
```

### 6.2. 约束与默认值的关系

```ts
// ✅ 默认值受约束限制
interface Comparable<T extends number | string = number> {
  compare(a: T, b: T): number
}

const numberComp: Comparable = {
  compare(a, b) {
    return a - b
  }, // T 默认为 number
}

const stringComp: Comparable<string> = {
  compare(a, b) {
    return a.localeCompare(b)
  },
}

// ❌ 默认值不满足约束会报错
// interface Invalid<T extends number = string> {}  // Error
```

### 6.3. 复杂约束场景

```ts
// ✅ 复杂约束与默认值
interface Entity {
  id: number
}

interface Repository<T extends Entity = Entity, K extends keyof T = 'id'> {
  findBy(key: K, value: T[K]): T | undefined
}

interface User extends Entity {
  name: string
  email: string
}

const repo1: Repository = {
  findBy(key, value) {
    return undefined
  },
} // Entity, 'id'

const repo2: Repository<User> = {
  findBy(key, value) {
    return undefined
  },
} // User, 'id'

const repo3: Repository<User, 'email'> = {
  findBy(key, value) {
    return undefined
  },
} // User, 'email'
```

## 7. 🤔 默认值的推断规则

### 7.1. 推断优先于默认值

```ts
// ✅ 类型推断优先
function wrap<T = string>(value: T): T {
  return value
}

const wrapped1 = wrap('hello') // T 推断为 string
const wrapped2 = wrap(42) // T 推断为 number
const wrapped3 = wrap(true) // T 推断为 boolean

// 显式指定优先于推断
const wrapped4 = wrap<string>(42 as any) // T 为 string
```

### 7.2. 无法推断时使用默认值

```ts
// ✅ 无法推断时才使用默认值
function create<T = object>(): T {
  return {} as T
}

const obj1 = create() // object - 使用默认值
const obj2 = create<User>() // User - 明确指定

interface User {
  id: number
  name: string
}
```

### 7.3. 部分推断

```ts
// ✅ 部分参数推断，部分使用默认值
function convert<T, U = string>(value: T): U {
  return String(value) as any
}

const result1 = convert(42) // T=number, U=string(默认)
const result2 = convert<number, boolean>(42) // T=number, U=boolean
```

## 8. 🤔 常见使用场景

### 8.1. 场景 1：API 响应类型

```ts
// ✅ 通用 API 响应
interface ApiResponse<T = unknown, E = Error> {
  data?: T
  error?: E
  status: number
  message: string
}

// 简单使用（使用默认值）
const response1: ApiResponse = {
  data: { anything: true },
  status: 200,
  message: 'OK',
}

// 指定数据类型
interface User {
  id: number
  name: string
}

const response2: ApiResponse<User> = {
  data: { id: 1, name: 'Alice' },
  status: 200,
  message: 'OK',
}

// 指定数据和错误类型
interface ValidationError {
  field: string
  message: string
}

const response3: ApiResponse<User[], ValidationError[]> = {
  error: [{ field: 'email', message: 'Invalid format' }],
  status: 400,
  message: 'Validation failed',
}
```

### 8.2. 场景 2：状态管理

```ts
// ✅ Redux 风格的 Action
interface Action<T = any> {
  type: string
  payload?: T
  error?: boolean
  meta?: any
}

// 简单 action
const action1: Action = {
  type: 'RESET',
}

// 带 payload
const action2: Action<User> = {
  type: 'USER_LOADED',
  payload: { id: 1, name: 'Alice' },
}

// 错误 action
const action3: Action<Error> = {
  type: 'LOAD_FAILED',
  payload: new Error('Failed to load'),
  error: true,
}
```

### 8.3. 场景 3：Promise 包装器

```ts
// ✅ 带重试的 Promise
interface RetryOptions {
  maxRetries: number
  delay: number
}

class RetryablePromise<T = void> {
  constructor(
    private executor: () => Promise<T>,
    private options: RetryOptions = { maxRetries: 3, delay: 1000 }
  ) {}

  async execute(): Promise<T> {
    let lastError: Error | undefined

    for (let i = 0; i < this.options.maxRetries; i++) {
      try {
        return await this.executor()
      } catch (error) {
        lastError = error as Error
        await this.delay()
      }
    }

    throw lastError
  }

  private delay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.options.delay))
  }
}

// 使用默认类型
const retry1 = new RetryablePromise(async () => {
  console.log('执行操作')
})

// 指定返回类型
const retry2 = new RetryablePromise<User>(async () => {
  return { id: 1, name: 'Alice' }
})
```

### 8.4. 场景 4：事件发射器

```ts
// ✅ 类型安全的事件发射器
interface EventMap {
  [event: string]: any
}

class TypedEventEmitter<T extends EventMap = EventMap> {
  private handlers = new Map<keyof T, Array<(data: any) => void>>()

  on<K extends keyof T>(event: K, handler: (data: T[K]) => void): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, [])
    }
    this.handlers.get(event)!.push(handler)
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    const handlers = this.handlers.get(event)
    if (handlers) {
      handlers.forEach((handler) => handler(data))
    }
  }
}

// 使用默认类型（any events）
const emitter1 = new TypedEventEmitter()
emitter1.on('any-event', (data) => console.log(data))

// 指定具体事件类型
interface AppEvents {
  'user:login': { userId: number }
  'user:logout': { userId: number }
  'data:updated': { count: number }
}

const emitter2 = new TypedEventEmitter<AppEvents>()
emitter2.on('user:login', (data) => {
  console.log(data.userId) // 类型安全
})
```

### 8.5. 场景 5：缓存系统

```ts
// ✅ 通用缓存
interface CacheOptions {
  ttl?: number
  maxSize?: number
}

class Cache<K = string, V = any> {
  private store = new Map<K, { value: V; expiry: number }>()

  constructor(private options: CacheOptions = {}) {}

  set(key: K, value: V): void {
    const expiry = this.options.ttl ? Date.now() + this.options.ttl : Infinity

    this.store.set(key, { value, expiry })

    if (this.options.maxSize && this.store.size > this.options.maxSize) {
      const firstKey = this.store.keys().next().value
      this.store.delete(firstKey)
    }
  }

  get(key: K): V | undefined {
    const item = this.store.get(key)

    if (!item) return undefined

    if (Date.now() > item.expiry) {
      this.store.delete(key)
      return undefined
    }

    return item.value
  }

  has(key: K): boolean {
    return this.get(key) !== undefined
  }

  clear(): void {
    this.store.clear()
  }
}

// 使用默认类型
const cache1 = new Cache()
cache1.set('key', 'value')

// 指定键值类型
const cache2 = new Cache<number, User>()
cache2.set(1, { id: 1, name: 'Alice' })
```

### 8.6. 场景 6：数据验证器

```ts
// ✅ 通用验证器
type ValidationResult<T = any> = {
  valid: boolean
  data?: T
  errors?: string[]
}

interface Validator<T = any> {
  validate(value: unknown): ValidationResult<T>
}

class StringValidator implements Validator<string> {
  validate(value: unknown): ValidationResult<string> {
    if (typeof value !== 'string') {
      return { valid: false, errors: ['Must be a string'] }
    }
    return { valid: true, data: value }
  }
}

class NumberValidator implements Validator<number> {
  validate(value: unknown): ValidationResult<number> {
    if (typeof value !== 'number') {
      return { valid: false, errors: ['Must be a number'] }
    }
    return { valid: true, data: value }
  }
}

// 使用
const stringValidator = new StringValidator()
const result1 = stringValidator.validate('hello')

const numberValidator = new NumberValidator()
const result2 = numberValidator.validate(42)
```

### 8.7. 场景 7：查询构建器

```ts
// ✅ 类型安全的查询构建器
interface QueryOptions<T = any> {
  filter?: Partial<T>
  sort?: Array<{
    field: keyof T
    order: 'asc' | 'desc'
  }>
  limit?: number
  offset?: number
}

class QueryBuilder<T = any> {
  private options: QueryOptions<T> = {}

  where(filter: Partial<T>): this {
    this.options.filter = { ...this.options.filter, ...filter }
    return this
  }

  orderBy(field: keyof T, order: 'asc' | 'desc' = 'asc'): this {
    if (!this.options.sort) {
      this.options.sort = []
    }
    this.options.sort.push({ field, order })
    return this
  }

  limit(limit: number): this {
    this.options.limit = limit
    return this
  }

  offset(offset: number): this {
    this.options.offset = offset
    return this
  }

  build(): QueryOptions<T> {
    return this.options
  }
}

// 使用默认类型
const query1 = new QueryBuilder().where({ anything: true }).limit(10).build()

// 指定具体类型
interface Product {
  id: number
  name: string
  price: number
}

const query2 = new QueryBuilder<Product>()
  .where({ price: 100 })
  .orderBy('name', 'asc')
  .limit(10)
  .build()
```

## 9. 🤔 常见错误和最佳实践

### 9.1. 错误 1：默认值不满足约束

```ts
// ❌ 默认值不满足约束
// interface Container<T extends number = string> {}  // Error

// ✅ 默认值必须满足约束
interface Container<T extends number = 0> {
  value: T
}
```

### 9.2. 错误 2：默认值顺序错误

```ts
// ❌ 有默认值的参数不能在无默认值的参数之前
// interface Invalid<T = any, U> {}  // Error

// ✅ 正确顺序
interface Valid<T, U = any> {
  first: T
  second: U
}
```

### 9.3. 错误 3：过度使用 any

```ts
// ❌ 默认值为 any 失去类型安全
interface Container<T = any> {
  value: T
}

// ✅ 使用更具体的默认值
interface Container<T = unknown> {
  value: T
}

// ✅ 或使用有意义的默认类型
interface Response<T = void> {
  data: T
  status: number
}
```

### 9.4. 错误 4：忽略类型推断

```ts
// ❌ 不必要的类型标注
function wrap<T = string>(value: T): T {
  return value
}

const result = wrap<string>('hello') // 不必要，会自动推断

// ✅ 让类型推断工作
const result2 = wrap('hello') // 自动推断为 string
```

### 9.5. 最佳实践

```ts
// ✅ 1. 使用 unknown 而不是 any
interface Response<T = unknown> {
  data: T
}

// ✅ 2. 为常见情况提供合理默认值
interface ApiResult<T = void, E = Error> {
  data?: T
  error?: E
}

// ✅ 3. 默认值应该是最通用的情况
interface Collection<T = any[]> {
  items: T
  size: number
}

// ✅ 4. 依赖关系的默认值
interface Converter<TInput, TOutput = TInput> {
  convert(input: TInput): TOutput
}

// ✅ 5. 文档化默认值的选择理由
/**
 * 容器接口
 * @template T - 内容类型，默认为 unknown 以保持类型安全
 */
interface Container<T = unknown> {
  value: T
}

// ✅ 6. 为可选操作提供默认值
interface Options<T = string> {
  format?: (value: T) => string
  validate?: (value: T) => boolean
}

// ✅ 7. 链式默认值
interface Config<T = string, U = T[], V = Promise<U>> {
  value: T
  list: U
  async: V
}

// ✅ 8. 条件默认值
type DefaultType<T> = T extends string ? string[] : T[]

interface Container<T, U = DefaultType<T>> {
  value: T
  list: U
}

// ✅ 9. 与工具类型结合
interface UpdateRequest<T = any> {
  id: number
  data: Partial<T>
}

// ✅ 10. 保持向后兼容
// 添加新的可选类型参数
interface Response<T = void> {
  // 原有
  data: T
}

// 扩展时添加默认值
interface ExtendedResponse<T = void, E = Error> extends Response<T> {
  error?: E
}
```

## 10. 🔗 引用

- [TypeScript Handbook - Generics][1]
- [TypeScript 3.0 - Generic Parameter Defaults][2]
- [TypeScript Deep Dive - Generics][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/generics.html
[2]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#generic-parameter-defaults
[3]: https://basarat.gitbook.io/typescript/type-system/generics
