# [0117. 泛型接口](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0117.%20%E6%B3%9B%E5%9E%8B%E6%8E%A5%E5%8F%A3)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是泛型接口？](#3--什么是泛型接口)
- [4. 🤔 基本语法](#4--基本语法)
  - [4.1. 接口定义](#41-接口定义)
  - [4.2. 泛型属性](#42-泛型属性)
  - [4.3. 泛型方法](#43-泛型方法)
  - [4.4. 默认类型参数](#44-默认类型参数)
- [5. 🤔 泛型接口的两种形式](#5--泛型接口的两种形式)
  - [5.1. 接口级泛型](#51-接口级泛型)
  - [5.2. 方法级泛型](#52-方法级泛型)
  - [5.3. 混合使用](#53-混合使用)
- [6. 🤔 泛型约束](#6--泛型约束)
  - [6.1. extends 约束](#61-extends-约束)
  - [6.2. 多重约束](#62-多重约束)
  - [6.3. keyof 约束](#63-keyof-约束)
- [7. 🤔 多个类型参数](#7--多个类型参数)
  - [7.1. 两个类型参数](#71-两个类型参数)
  - [7.2. 键值对接口](#72-键值对接口)
  - [7.3. 转换接口](#73-转换接口)
- [8. 🤔 泛型接口继承](#8--泛型接口继承)
  - [8.1. 继承泛型接口](#81-继承泛型接口)
  - [8.2. 多继承](#82-多继承)
  - [8.3. 类型参数传递](#83-类型参数传递)
- [9. 🤔 常见使用场景](#9--常见使用场景)
  - [9.1. 场景 1：API 响应接口](#91-场景-1api-响应接口)
  - [9.2. 场景 2：数据仓储接口](#92-场景-2数据仓储接口)
  - [9.3. 场景 3：状态管理接口](#93-场景-3状态管理接口)
  - [9.4. 场景 4：事件系统接口](#94-场景-4事件系统接口)
  - [9.5. 场景 5：缓存接口](#95-场景-5缓存接口)
  - [9.6. 场景 6：验证器接口](#96-场景-6验证器接口)
  - [9.7. 场景 7：查询构建器接口](#97-场景-7查询构建器接口)
- [10. 🤔 常见错误和最佳实践](#10--常见错误和最佳实践)
  - [10.1. 错误 1：忘记指定类型参数](#101-错误-1忘记指定类型参数)
  - [10.2. 错误 2：类型参数过于宽泛](#102-错误-2类型参数过于宽泛)
  - [10.3. 错误 3：混淆接口级和方法级泛型](#103-错误-3混淆接口级和方法级泛型)
  - [10.4. 错误 4：过度使用泛型](#104-错误-4过度使用泛型)
  - [10.5. 最佳实践](#105-最佳实践)
- [11. 🔗 引用](#11--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 泛型接口的定义和语法
- 接口级泛型 vs 方法级泛型
- 泛型约束的使用
- 多个类型参数
- 泛型接口的继承
- 实际应用场景

## 2. 🫧 评价

泛型接口（Generic Interface）是使用**类型参数**的接口，可以在使用时指定具体类型。

泛型接口的特点：

- **类型参数化**：接口的类型可以作为参数传入
- **灵活性高**：同一个接口适用于多种类型
- **类型安全**：编译时检查类型一致性
- **代码复用**：避免重复定义相似接口

泛型接口 vs 普通接口：

| 特性           | 泛型接口     | 普通接口     |
| -------------- | ------------ | ------------ |
| **类型灵活性** | 高           | 低           |
| **代码复用**   | 高           | 需要多个接口 |
| **类型安全**   | 保持类型关系 | 固定类型     |
| **复杂度**     | 稍高         | 简单         |
| **适用场景**   | 通用数据结构 | 特定领域     |

泛型接口的优势：

1. **统一定义**：一个接口描述多种类型的结构
2. **类型关系**：保持类型之间的关联
3. **智能提示**：IDE 提供准确的类型提示
4. **约束灵活**：可以对类型参数添加约束

理解泛型接口，能帮助你：

1. 设计通用的 API 接口
2. 定义灵活的数据结构
3. 实现类型安全的容器
4. 构建可复用的类型系统

泛型接口是 TypeScript 类型系统的核心特性，是构建可扩展架构的基础。

## 3. 🤔 什么是泛型接口？

泛型接口使用**类型参数**定义结构，在使用时指定具体类型。

```ts
// ❌ 普通接口：每种类型需要单独定义
interface NumberBox {
  value: number
}

interface StringBox {
  value: string
}

// ✅ 泛型接口：一个定义适用多种类型
interface Box<T> {
  value: T
}

const numberBox: Box<number> = { value: 42 }
const stringBox: Box<string> = { value: 'hello' }
const boolBox: Box<boolean> = { value: true }
```

**关键概念**：

- **类型参数**：`<T>` 是类型占位符
- **使用时指定**：在使用接口时提供具体类型
- **类型一致性**：所有使用 T 的地方类型相同
- **编译时检查**：类型错误在编译时发现

## 4. 🤔 基本语法

### 4.1. 接口定义

```ts
// ✅ 基本泛型接口
interface Container<T> {
  value: T
  getValue(): T
  setValue(value: T): void
}

// 使用时指定类型
const numberContainer: Container<number> = {
  value: 42,
  getValue() {
    return this.value
  },
  setValue(value: number) {
    this.value = value
  },
}
```

### 4.2. 泛型属性

```ts
// ✅ 泛型属性
interface Result<T> {
  success: boolean
  data: T
  error?: string
  timestamp: Date
}

const userResult: Result<User> = {
  success: true,
  data: { id: 1, name: 'Alice' },
  timestamp: new Date(),
}

const numberResult: Result<number> = {
  success: false,
  data: 0,
  error: 'Invalid input',
  timestamp: new Date(),
}

interface User {
  id: number
  name: string
}
```

### 4.3. 泛型方法

```ts
// ✅ 接口中的泛型方法
interface Mapper<T> {
  // 使用接口的类型参数
  transform(item: T): T

  // 方法自己的类型参数
  map<U>(fn: (item: T) => U): U

  // 组合使用
  flatMap<U>(fn: (item: T) => U[]): U[]
}
```

### 4.4. 默认类型参数

```ts
// ✅ 默认类型参数
interface Response<T = any> {
  status: number
  data: T
}

// 使用默认类型
const response1: Response = {
  status: 200,
  data: { message: 'ok' },
}

// 指定具体类型
const response2: Response<User> = {
  status: 200,
  data: { id: 1, name: 'Alice' },
}
```

## 5. 🤔 泛型接口的两种形式

### 5.1. 接口级泛型

```ts
// ✅ 在接口级别定义泛型
interface Stack<T> {
  items: T[]
  push(item: T): void
  pop(): T | undefined
  peek(): T | undefined
}

// 使用时指定类型
const numberStack: Stack<number> = {
  items: [],
  push(item: number) {
    this.items.push(item)
  },
  pop() {
    return this.items.pop()
  },
  peek() {
    return this.items[this.items.length - 1]
  },
}
```

### 5.2. 方法级泛型

```ts
// ✅ 在方法级别定义泛型
interface GenericMethods {
  // 每个方法独立的泛型
  identity<T>(arg: T): T
  map<T, U>(arr: T[], fn: (item: T) => U): U[]
  filter<T>(arr: T[], predicate: (item: T) => boolean): T[]
}

const utils: GenericMethods = {
  identity(arg) {
    return arg
  },
  map(arr, fn) {
    return arr.map(fn)
  },
  filter(arr, predicate) {
    return arr.filter(predicate)
  },
}

// 每次调用时推断类型
const num = utils.identity(42) // number
const str = utils.identity('hello') // string
```

### 5.3. 混合使用

```ts
// ✅ 接口级和方法级泛型混合
interface Collection<T> {
  items: T[]

  // 使用接口的泛型
  add(item: T): void
  remove(item: T): boolean

  // 方法自己的泛型
  map<U>(fn: (item: T) => U): Collection<U>
  filter(predicate: (item: T) => boolean): Collection<T>
}

class ArrayCollection<T> implements Collection<T> {
  constructor(public items: T[] = []) {}

  add(item: T): void {
    this.items.push(item)
  }

  remove(item: T): boolean {
    const index = this.items.indexOf(item)
    if (index > -1) {
      this.items.splice(index, 1)
      return true
    }
    return false
  }

  map<U>(fn: (item: T) => U): Collection<U> {
    return new ArrayCollection(this.items.map(fn))
  }

  filter(predicate: (item: T) => boolean): Collection<T> {
    return new ArrayCollection(this.items.filter(predicate))
  }
}
```

## 6. 🤔 泛型约束

### 6.1. extends 约束

```ts
// ✅ 约束类型必须有特定属性
interface Identifiable {
  id: number
}

interface Repository<T extends Identifiable> {
  items: T[]
  findById(id: number): T | undefined
  add(item: T): void
  remove(id: number): boolean
}

interface User {
  id: number
  name: string
}

const userRepo: Repository<User> = {
  items: [],
  findById(id) {
    return this.items.find((item) => item.id === id)
  },
  add(item) {
    this.items.push(item)
  },
  remove(id) {
    const index = this.items.findIndex((item) => item.id === id)
    if (index > -1) {
      this.items.splice(index, 1)
      return true
    }
    return false
  },
}
```

### 6.2. 多重约束

```ts
// ✅ 使用交叉类型实现多重约束
interface Named {
  name: string
}

interface Aged {
  age: number
}

interface PersonService<T extends Named & Aged> {
  people: T[]
  findByName(name: string): T[]
  findByAge(age: number): T[]
  getAverageAge(): number
}
```

### 6.3. keyof 约束

```ts
// ✅ 使用 keyof 约束键
interface KeyValueStore<T> {
  get<K extends keyof T>(key: K): T[K]
  set<K extends keyof T>(key: K, value: T[K]): void
  has<K extends keyof T>(key: K): boolean
}

interface Config {
  host: string
  port: number
  ssl: boolean
}

const config: KeyValueStore<Config> & Config = {
  host: 'localhost',
  port: 3000,
  ssl: false,

  get(key) {
    return this[key]
  },

  set(key, value) {
    this[key] = value
  },

  has(key) {
    return key in this
  },
}
```

## 7. 🤔 多个类型参数

### 7.1. 两个类型参数

```ts
// ✅ 两个类型参数
interface Pair<K, V> {
  key: K
  value: V
}

const pair1: Pair<string, number> = {
  key: 'age',
  value: 30,
}

const pair2: Pair<number, string> = {
  key: 1,
  value: 'first',
}
```

### 7.2. 键值对接口

```ts
// ✅ 映射接口
interface Map<K, V> {
  size: number
  get(key: K): V | undefined
  set(key: K, value: V): void
  has(key: K): boolean
  delete(key: K): boolean
  clear(): void
  keys(): K[]
  values(): V[]
  entries(): Array<[K, V]>
}
```

### 7.3. 转换接口

```ts
// ✅ 类型转换接口
interface Converter<TInput, TOutput> {
  convert(input: TInput): TOutput
  convertAll(inputs: TInput[]): TOutput[]
  canConvert(input: any): input is TInput
}

const stringToNumber: Converter<string, number> = {
  convert(input) {
    return parseInt(input)
  },
  convertAll(inputs) {
    return inputs.map(this.convert)
  },
  canConvert(input): input is string {
    return typeof input === 'string'
  },
}
```

## 8. 🤔 泛型接口继承

### 8.1. 继承泛型接口

```ts
// ✅ 继承泛型接口
interface Container<T> {
  value: T
  getValue(): T
}

// 1. 指定具体类型
interface StringContainer extends Container<string> {
  toUpperCase(): string
}

// 2. 保持泛型
interface ExtendedContainer<T> extends Container<T> {
  setValue(value: T): void
  reset(): void
}

// 3. 添加新的类型参数
interface PairContainer<T, U> extends Container<T> {
  secondValue: U
  getSecondValue(): U
}
```

### 8.2. 多继承

```ts
// ✅ 继承多个泛型接口
interface Readable<T> {
  read(): T
}

interface Writable<T> {
  write(value: T): void
}

interface ReadWritable<T> extends Readable<T>, Writable<T> {
  clear(): void
}

const storage: ReadWritable<string> = {
  data: '',

  read() {
    return this.data
  },

  write(value) {
    this.data = value
  },

  clear() {
    this.data = ''
  },
}
```

### 8.3. 类型参数传递

```ts
// ✅ 在继承中传递类型参数
interface BaseRepository<T> {
  items: T[]
  findAll(): T[]
}

interface FilterableRepository<T> extends BaseRepository<T> {
  filter(predicate: (item: T) => boolean): T[]
}

interface SortableRepository<T> extends FilterableRepository<T> {
  sort(compareFn: (a: T, b: T) => number): T[]
}
```

## 9. 🤔 常见使用场景

### 9.1. 场景 1：API 响应接口

```ts
// ✅ 统一的 API 响应格式
interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp: number
}

interface PagedResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  pageSize: number
}

// 使用
interface User {
  id: number
  name: string
  email: string
}

const userResponse: ApiResponse<User> = {
  code: 200,
  message: 'Success',
  data: { id: 1, name: 'Alice', email: 'alice@example.com' },
  timestamp: Date.now(),
}

const usersResponse: PagedResponse<User> = {
  code: 200,
  message: 'Success',
  data: [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
  ],
  total: 100,
  page: 1,
  pageSize: 10,
  timestamp: Date.now(),
}
```

### 9.2. 场景 2：数据仓储接口

```ts
// ✅ 通用仓储模式
interface Entity {
  id: number | string
}

interface Repository<T extends Entity> {
  findById(id: T['id']): Promise<T | null>
  findAll(): Promise<T[]>
  create(entity: Omit<T, 'id'>): Promise<T>
  update(id: T['id'], entity: Partial<T>): Promise<T>
  delete(id: T['id']): Promise<boolean>
}

interface QueryOptions<T> {
  filter?: Partial<T>
  sort?: Array<{
    field: keyof T
    order: 'asc' | 'desc'
  }>
  limit?: number
  offset?: number
}

interface AdvancedRepository<T extends Entity> extends Repository<T> {
  findMany(options: QueryOptions<T>): Promise<T[]>
  count(filter?: Partial<T>): Promise<number>
  exists(id: T['id']): Promise<boolean>
}

// 实现
interface User extends Entity {
  id: number
  name: string
  email: string
  age: number
}

class UserRepository implements AdvancedRepository<User> {
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

  async findMany(options: QueryOptions<User>): Promise<User[]> {
    return []
  }

  async count(filter?: Partial<User>): Promise<number> {
    return 0
  }

  async exists(id: number): Promise<boolean> {
    return false
  }
}
```

### 9.3. 场景 3：状态管理接口

```ts
// ✅ 状态管理器接口
interface State<T> {
  value: T
  setValue(value: T): void
  subscribe(listener: (value: T) => void): () => void
}

interface ComputedState<T, U> extends State<T> {
  compute(fn: (value: T) => U): ComputedState<T, U>
}

interface Store<T> {
  getState(): T
  setState(updater: Partial<T> | ((prev: T) => T)): void
  subscribe(listener: (state: T) => void): () => void
  select<K extends keyof T>(key: K): State<T[K]>
}

// 使用
interface AppState {
  user: User | null
  isLoading: boolean
  error: string | null
}

class SimpleStore<T> implements Store<T> {
  private state: T
  private listeners: Array<(state: T) => void> = []

  constructor(initialState: T) {
    this.state = initialState
  }

  getState(): T {
    return this.state
  }

  setState(updater: Partial<T> | ((prev: T) => T)): void {
    if (typeof updater === 'function') {
      this.state = updater(this.state)
    } else {
      this.state = { ...this.state, ...updater }
    }
    this.listeners.forEach((listener) => listener(this.state))
  }

  subscribe(listener: (state: T) => void): () => void {
    this.listeners.push(listener)
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  select<K extends keyof T>(key: K): State<T[K]> {
    const self = this
    return {
      value: this.state[key],
      setValue(value: T[K]) {
        self.setState({ [key]: value } as Partial<T>)
      },
      subscribe(listener: (value: T[K]) => void) {
        return self.subscribe((state) => listener(state[key]))
      },
    }
  }
}
```

### 9.4. 场景 4：事件系统接口

```ts
// ✅ 类型安全的事件系统
interface EventMap {
  [eventName: string]: any
}

interface EventEmitter<T extends EventMap> {
  on<K extends keyof T>(event: K, handler: (data: T[K]) => void): void
  off<K extends keyof T>(event: K, handler: (data: T[K]) => void): void
  emit<K extends keyof T>(event: K, data: T[K]): void
  once<K extends keyof T>(event: K, handler: (data: T[K]) => void): void
}

// 定义应用的事件类型
interface AppEvents {
  'user:login': { userId: number; timestamp: Date }
  'user:logout': { userId: number }
  'data:loaded': { count: number; source: string }
  error: { message: string; code: number }
}

class TypedEventEmitter<T extends EventMap> implements EventEmitter<T> {
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

  once<K extends keyof T>(event: K, handler: (data: T[K]) => void): void {
    const onceHandler = (data: T[K]) => {
      handler(data)
      this.off(event, onceHandler)
    }
    this.on(event, onceHandler)
  }
}

const emitter = new TypedEventEmitter<AppEvents>()

// 类型安全的事件处理
emitter.on('user:login', (data) => {
  console.log(`User ${data.userId} logged in at ${data.timestamp}`)
})

emitter.emit('user:login', { userId: 1, timestamp: new Date() })
```

### 9.5. 场景 5：缓存接口

```ts
// ✅ 泛型缓存接口
interface CacheEntry<T> {
  value: T
  expiry: number
}

interface Cache<K extends string | number, V> {
  get(key: K): V | undefined
  set(key: K, value: V, ttl?: number): void
  has(key: K): boolean
  delete(key: K): boolean
  clear(): void
  size(): number
  keys(): K[]
  values(): V[]
}

interface CacheWithStats<K extends string | number, V> extends Cache<K, V> {
  hits: number
  misses: number
  getStats(): {
    hits: number
    misses: number
    hitRate: number
  }
  resetStats(): void
}

class MemoryCache<K extends string | number, V>
  implements CacheWithStats<K, V>
{
  private cache = new Map<K, CacheEntry<V>>()
  hits = 0
  misses = 0
  private defaultTTL = 60000 // 1 分钟

  get(key: K): V | undefined {
    const entry = this.cache.get(key)

    if (!entry) {
      this.misses++
      return undefined
    }

    if (Date.now() > entry.expiry) {
      this.cache.delete(key)
      this.misses++
      return undefined
    }

    this.hits++
    return entry.value
  }

  set(key: K, value: V, ttl?: number): void {
    const expiry = Date.now() + (ttl || this.defaultTTL)
    this.cache.set(key, { value, expiry })
  }

  has(key: K): boolean {
    return this.get(key) !== undefined
  }

  delete(key: K): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    // 清理过期条目
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key)
      }
    }
    return this.cache.size
  }

  keys(): K[] {
    return Array.from(this.cache.keys())
  }

  values(): V[] {
    return Array.from(this.cache.values()).map((entry) => entry.value)
  }

  getStats() {
    const total = this.hits + this.misses
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? this.hits / total : 0,
    }
  }

  resetStats(): void {
    this.hits = 0
    this.misses = 0
  }
}
```

### 9.6. 场景 6：验证器接口

```ts
// ✅ 类型安全的验证器
interface ValidationResult {
  valid: boolean
  errors: string[]
}

interface Validator<T> {
  validate(value: T): ValidationResult
  validateAsync(value: T): Promise<ValidationResult>
}

interface Rule<T> {
  check(value: T): boolean
  message: string
}

interface ValidatorBuilder<T> {
  addRule(rule: Rule<T>): ValidatorBuilder<T>
  required(message?: string): ValidatorBuilder<T>
  custom(check: (value: T) => boolean, message: string): ValidatorBuilder<T>
  build(): Validator<T>
}

// 字符串验证器
interface StringValidator extends Validator<string> {
  minLength(min: number): StringValidator
  maxLength(max: number): StringValidator
  pattern(regex: RegExp, message?: string): StringValidator
  email(message?: string): StringValidator
}

// 数字验证器
interface NumberValidator extends Validator<number> {
  min(value: number): NumberValidator
  max(value: number): NumberValidator
  integer(message?: string): NumberValidator
  positive(message?: string): NumberValidator
}

// 对象验证器
interface ObjectValidator<T extends object> extends Validator<T> {
  shape<K extends keyof T>(validators: {
    [P in K]: Validator<T[P]>
  }): ObjectValidator<T>
}
```

### 9.7. 场景 7：查询构建器接口

```ts
// ✅ 类型安全的查询构建器
interface QueryBuilder<T> {
  where(condition: Partial<T> | ((item: T) => boolean)): QueryBuilder<T>
  select<K extends keyof T>(...keys: K[]): QueryBuilder<Pick<T, K>>
  orderBy<K extends keyof T>(key: K, order?: 'asc' | 'desc'): QueryBuilder<T>
  limit(count: number): QueryBuilder<T>
  offset(count: number): QueryBuilder<T>
  execute(): Promise<T[]>
  first(): Promise<T | null>
  count(): Promise<number>
}

interface JoinableQueryBuilder<T> extends QueryBuilder<T> {
  join<U, K extends keyof T>(
    other: QueryBuilder<U>,
    on: (left: T, right: U) => boolean
  ): QueryBuilder<T & U>

  leftJoin<U, K extends keyof T>(
    other: QueryBuilder<U>,
    on: (left: T, right: U) => boolean
  ): QueryBuilder<T & Partial<U>>
}
```

## 10. 🤔 常见错误和最佳实践

### 10.1. 错误 1：忘记指定类型参数

```ts
// ❌ 忘记指定类型参数
interface Box<T> {
  value: T
}

// const box: Box = { value: 42 }  // ❌ Error: 需要类型参数

// ✅ 指定类型参数
const box: Box<number> = { value: 42 }

// ✅ 或使用默认类型
interface Box<T = any> {
  value: T
}

const box2: Box = { value: 42 } // ✅
```

### 10.2. 错误 2：类型参数过于宽泛

```ts
// ❌ 没有约束，无法安全使用
interface Comparator<T> {
  compare(a: T, b: T): number
}

// const comparator: Comparator<any> = {
//   compare(a, b) {
//     return a - b  // ❌ any 类型不一定能相减
//   }
// }

// ✅ 添加约束
interface Comparator<T extends number | string> {
  compare(a: T, b: T): number
}
```

### 10.3. 错误 3：混淆接口级和方法级泛型

```ts
// ❌ 混淆
interface Container<T> {
  // 这里的 T 是接口的 T，不是方法的
  getValue<T>(): T // 这个 T 会覆盖接口的 T
}

// ✅ 明确区分
interface Container<T> {
  getValue(): T // 使用接口的 T

  // 方法的泛型用不同的名称
  transform<U>(fn: (value: T) => U): U
}
```

### 10.4. 错误 4：过度使用泛型

```ts
// ❌ 不必要的泛型
interface UserService<T extends User> {
  getUser(id: number): Promise<T>
}

// ✅ 直接使用具体类型
interface UserService {
  getUser(id: number): Promise<User>
}

// 只在真正需要灵活性时使用泛型
interface Repository<T> {
  findAll(): Promise<T[]>
  findById(id: number): Promise<T | null>
}
```

### 10.5. 最佳实践

```ts
// ✅ 1. 使用有意义的类型参数名
interface Repository<TEntity> {
  // TEntity 清楚表明这是实体类型
}

// ✅ 2. 添加必要的约束
interface Sortable<T extends { id: number }> {
  sort(items: T[]): T[]
}

// ✅ 3. 提供默认类型参数
interface Response<T = unknown> {
  data: T
}

// ✅ 4. 继承泛型接口
interface ReadonlyRepository<T> {
  findAll(): Promise<T[]>
}

interface Repository<T> extends ReadonlyRepository<T> {
  save(item: T): Promise<T>
}

// ✅ 5. 使用工具类型
interface UpdateData<T> {
  update(id: number, data: Partial<T>): Promise<T>
  replace(id: number, data: Required<T>): Promise<T>
}

// ✅ 6. 文档化泛型参数
/**
 * 泛型容器接口
 * @template T - 容器中存储的元素类型
 */
interface Container<T> {
  items: T[]
}

// ✅ 7. 类型安全的键访问
interface KeyValueAccess<T> {
  get<K extends keyof T>(key: K): T[K]
  set<K extends keyof T>(key: K, value: T[K]): void
}

// ✅ 8. 条件类型
interface Unwrap<T> {
  unwrap(): T extends Promise<infer U> ? U : T
}

// ✅ 9. 组合多个泛型接口
interface Readable<T> {
  read(): T
}

interface Writable<T> {
  write(value: T): void
}

interface ReadWrite<T> extends Readable<T>, Writable<T> {}

// ✅ 10. 保持简单
// 简单情况使用具体类型
interface UserData {
  user: User
  timestamp: Date
}

// 需要灵活性时使用泛型
interface ApiData<T> {
  data: T
  timestamp: Date
}
```

## 11. 🔗 引用

- [TypeScript Handbook - Generics][1]
- [TypeScript Handbook - Interfaces][2]
- [TypeScript Deep Dive - Generics][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/generics.html
[2]: https://www.typescriptlang.org/docs/handbook/2/objects.html
[3]: https://basarat.gitbook.io/typescript/type-system/generics
