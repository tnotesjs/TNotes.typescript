# [0115. 泛型类](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0115.%20%E6%B3%9B%E5%9E%8B%E7%B1%BB)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是泛型类？](#3--什么是泛型类)
- [4. 🤔 基本语法](#4--基本语法)
  - [4.1. 单个类型参数](#41-单个类型参数)
  - [4.2. 泛型属性](#42-泛型属性)
  - [4.3. 泛型方法](#43-泛型方法)
  - [4.4. 默认类型参数](#44-默认类型参数)
- [5. 🤔 泛型约束](#5--泛型约束)
  - [5.1. 基本约束](#51-基本约束)
  - [5.2. 约束为对象类型](#52-约束为对象类型)
  - [5.3. 多重约束](#53-多重约束)
  - [5.4. keyof 约束](#54-keyof-约束)
- [6. 🤔 多个类型参数](#6--多个类型参数)
  - [6.1. 两个类型参数](#61-两个类型参数)
  - [6.2. 映射类](#62-映射类)
  - [6.3. 转换类](#63-转换类)
- [7. 🤔 静态成员与泛型](#7--静态成员与泛型)
  - [7.1. 静态成员不能使用类型参数](#71-静态成员不能使用类型参数)
  - [7.2. 工厂模式](#72-工厂模式)
- [8. 🤔 泛型类的继承](#8--泛型类的继承)
  - [8.1. 继承泛型类](#81-继承泛型类)
  - [8.2. 实现泛型接口](#82-实现泛型接口)
  - [8.3. 泛型类继承泛型类](#83-泛型类继承泛型类)
- [9. 🤔 常见使用场景](#9--常见使用场景)
  - [9.1. 场景 1：数据结构](#91-场景-1数据结构)
  - [9.2. 场景 2：响应包装器](#92-场景-2响应包装器)
  - [9.3. 场景 3：状态管理](#93-场景-3状态管理)
  - [9.4. 场景 4：缓存系统](#94-场景-4缓存系统)
  - [9.5. 场景 5：事件发射器](#95-场景-5事件发射器)
  - [9.6. 场景 6：验证器](#96-场景-6验证器)
- [10. 🤔 常见错误和最佳实践](#10--常见错误和最佳实践)
  - [10.1. 错误 1：在静态成员中使用类型参数](#101-错误-1在静态成员中使用类型参数)
  - [10.2. 错误 2：忘记类型约束](#102-错误-2忘记类型约束)
  - [10.3. 错误 3：过度使用泛型](#103-错误-3过度使用泛型)
  - [10.4. 错误 4：泛型参数命名不清晰](#104-错误-4泛型参数命名不清晰)
  - [10.5. 最佳实践](#105-最佳实践)
- [11. 🔗 引用](#11--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 泛型类的定义和使用
- 泛型约束和默认类型
- 多个类型参数
- 静态成员的限制
- 泛型类的继承
- 实际应用场景

## 2. 🫧 评价

泛型类（Generic Class）是使用类型参数的类，可以在实例化时指定具体类型。

泛型类的特点：

- 类型参数化：类的类型可以作为参数传入
- 类型安全：编译时检查类型一致性
- 代码复用：同一个类适用于多种类型
- 灵活性：在使用时指定具体类型

泛型类 vs 普通类：

| 特性       | 泛型类       | 普通类     |
| ---------- | ------------ | ---------- |
| 类型灵活性 | 高           | 低         |
| 代码复用   | 高           | 需要继承   |
| 类型安全   | 编译时检查   | 编译时检查 |
| 复杂度     | 稍高         | 简单       |
| 适用场景   | 容器、工具类 | 业务类     |

泛型类的优势：

1. 类型安全：避免类型转换和运行时错误
2. 代码复用：一套代码适用多种类型
3. 智能提示：IDE 能提供准确的类型提示
4. 约束灵活：可以对类型参数添加约束

理解泛型类，能帮助你：

1. 设计通用的数据结构
2. 构建类型安全的工具类
3. 提高代码的可维护性
4. 实现高级类型模式

泛型类是 TypeScript 最强大的特性之一，是构建可复用代码的核心工具。

## 3. 🤔 什么是泛型类？

泛型类在定义时使用类型参数，在实例化时指定具体类型。

- 类型参数：`<T>` 是类型占位符
- 实例化时确定：创建实例时指定具体类型
- 类型一致性：所有使用 T 的地方类型相同
- 类型推断：可以省略类型参数，由构造函数参数推断

```ts
// ✅ 基本泛型类
class Box<T> {
  private value: T

  constructor(value: T) {
    this.value = value
  }

  getValue(): T {
    return this.value
  }

  setValue(value: T): void {
    this.value = value
  }
}

// 使用时指定类型
const numberBox = new Box<number>(42)
const num: number = numberBox.getValue() // 类型安全

const stringBox = new Box<string>('hello')
const str: string = stringBox.getValue() // 类型安全

// 类型推断
const boolBox = new Box(true) // Box<boolean>
```

## 4. 🤔 基本语法

### 4.1. 单个类型参数

```ts
// ✅ 单个类型参数
class Stack<T> {
  private items: T[] = []

  push(item: T): void {
    this.items.push(item)
  }

  pop(): T | undefined {
    return this.items.pop()
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1]
  }

  isEmpty(): boolean {
    return this.items.length === 0
  }

  size(): number {
    return this.items.length
  }
}

const numberStack = new Stack<number>()
numberStack.push(1)
numberStack.push(2)
console.log(numberStack.pop()) // 2

const stringStack = new Stack<string>()
stringStack.push('a')
stringStack.push('b')
console.log(stringStack.pop()) // 'b'
```

### 4.2. 泛型属性

```ts
// ✅ 泛型属性
class Container<T> {
  // 泛型属性
  public content: T

  constructor(content: T) {
    this.content = content
  }

  getContent(): T {
    return this.content
  }

  setContent(content: T): void {
    this.content = content
  }
}

const container = new Container<number>(100)
console.log(container.content) // 100
```

### 4.3. 泛型方法

```ts
// ✅ 泛型方法
class Mapper<T> {
  constructor(private items: T[]) {}

  // 泛型方法
  map<U>(fn: (item: T) => U): U[] {
    return this.items.map(fn)
  }

  // 类的泛型 + 方法的泛型
  transform<U, V>(fn1: (item: T) => U, fn2: (item: U) => V): V[] {
    return this.items.map((item) => fn2(fn1(item)))
  }
}

const numbers = new Mapper([1, 2, 3])
const strings = numbers.map((n) => n.toString()) // string[]
const doubled = numbers.map((n) => n * 2) // number[]
```

### 4.4. 默认类型参数

```ts
// ✅ 默认类型参数
class Result<T = string> {
  constructor(public success: boolean, public data: T, public error?: string) {}

  isSuccess(): boolean {
    return this.success
  }
}

// 使用默认类型
const result1 = new Result(true, 'success') // Result<string>

// 指定其他类型
const result2 = new Result<number>(true, 42) // Result<number>
```

## 5. 🤔 泛型约束

### 5.1. 基本约束

```ts
// ✅ 使用 extends 约束类型
interface Lengthwise {
  length: number
}

class LengthChecker<T extends Lengthwise> {
  constructor(private value: T) {}

  getLength(): number {
    return this.value.length // ✅ 类型安全
  }

  compare(other: T): number {
    return this.value.length - other.length
  }
}

const checker1 = new LengthChecker('hello') // ✅ string 有 length
const checker2 = new LengthChecker([1, 2, 3]) // ✅ array 有 length
// const checker3 = new LengthChecker(42)  // ❌ Error: number 没有 length
```

### 5.2. 约束为对象类型

```ts
// ✅ 约束为对象类型
interface Identifiable {
  id: number
}

class Repository<T extends Identifiable> {
  private items: T[] = []

  add(item: T): void {
    this.items.push(item)
  }

  findById(id: number): T | undefined {
    return this.items.find((item) => item.id === id)
  }

  remove(id: number): boolean {
    const index = this.items.findIndex((item) => item.id === id)
    if (index > -1) {
      this.items.splice(index, 1)
      return true
    }
    return false
  }
}

interface User {
  id: number
  name: string
}

const userRepo = new Repository<User>()
userRepo.add({ id: 1, name: 'Alice' })
const user = userRepo.findById(1)
```

### 5.3. 多重约束

```ts
// ✅ 使用交叉类型实现多重约束
interface Named {
  name: string
}

interface Aged {
  age: number
}

class PersonManager<T extends Named & Aged> {
  constructor(private person: T) {}

  introduce(): string {
    return `${this.person.name} is ${this.person.age} years old`
  }

  isAdult(): boolean {
    return this.person.age >= 18
  }
}

interface Student {
  name: string
  age: number
  grade: number
}

const manager = new PersonManager<Student>({
  name: 'Alice',
  age: 20,
  grade: 3,
})

console.log(manager.introduce()) // 'Alice is 20 years old'
```

### 5.4. keyof 约束

```ts
// ✅ 使用 keyof 约束
class PropertyGetter<T, K extends keyof T> {
  constructor(private obj: T, private key: K) {}

  getValue(): T[K] {
    return this.obj[this.key]
  }

  setValue(value: T[K]): void {
    this.obj[this.key] = value
  }
}

interface Person {
  name: string
  age: number
}

const person: Person = { name: 'Alice', age: 30 }
const nameGetter = new PropertyGetter(person, 'name')
console.log(nameGetter.getValue()) // 'Alice'

// const invalidGetter = new PropertyGetter(person, 'invalid')  // ❌ Error
```

## 6. 🤔 多个类型参数

### 6.1. 两个类型参数

```ts
// ✅ 两个类型参数
class Pair<K, V> {
  constructor(public key: K, public value: V) {}

  getKey(): K {
    return this.key
  }

  getValue(): V {
    return this.value
  }

  setPair(key: K, value: V): void {
    this.key = key
    this.value = value
  }
}

const pair1 = new Pair<string, number>('age', 30)
const pair2 = new Pair<number, string>(1, 'first')

console.log(pair1.getKey()) // 'age'
console.log(pair1.getValue()) // 30
```

### 6.2. 映射类

```ts
// ✅ 键值对映射
class Dictionary<K extends string | number, V> {
  private items = new Map<K, V>()

  set(key: K, value: V): void {
    this.items.set(key, value)
  }

  get(key: K): V | undefined {
    return this.items.get(key)
  }

  has(key: K): boolean {
    return this.items.has(key)
  }

  delete(key: K): boolean {
    return this.items.delete(key)
  }

  keys(): K[] {
    return Array.from(this.items.keys())
  }

  values(): V[] {
    return Array.from(this.items.values())
  }
}

const dict = new Dictionary<string, number>()
dict.set('one', 1)
dict.set('two', 2)
console.log(dict.get('one')) // 1
```

### 6.3. 转换类

```ts
// ✅ 类型转换器
class Converter<TInput, TOutput> {
  constructor(private converter: (input: TInput) => TOutput) {}

  convert(input: TInput): TOutput {
    return this.converter(input)
  }

  convertAll(inputs: TInput[]): TOutput[] {
    return inputs.map(this.converter)
  }
}

const stringToNumber = new Converter<string, number>((str) => parseInt(str))
console.log(stringToNumber.convert('42')) // 42
console.log(stringToNumber.convertAll(['1', '2', '3'])) // [1, 2, 3]

const numberToString = new Converter<number, string>((num) => num.toString())
console.log(numberToString.convert(42)) // '42'
```

## 7. 🤔 静态成员与泛型

### 7.1. 静态成员不能使用类型参数

```ts
// ❌ 静态成员不能引用类型参数
class Container<T> {
  // ❌ Error: 静态成员不能引用类型参数
  // static defaultValue: T

  private value: T

  constructor(value: T) {
    this.value = value
  }
}

// ✅ 静态成员可以有自己的泛型
class Container<T> {
  private value: T

  constructor(value: T) {
    this.value = value
  }

  // ✅ 静态泛型方法
  static create<U>(value: U): Container<U> {
    return new Container(value)
  }

  // ✅ 静态方法不依赖类的泛型
  static merge<A, B>(a: Container<A>, b: Container<B>): Container<[A, B]> {
    return new Container([a.value, b.value] as [A, B])
  }
}

const container = Container.create(42) // Container<number>
```

### 7.2. 工厂模式

```ts
// ✅ 使用静态方法作为工厂
class Result<T> {
  private constructor(
    public readonly success: boolean,
    public readonly data?: T,
    public readonly error?: string
  ) {}

  static success<T>(data: T): Result<T> {
    return new Result(true, data, undefined)
  }

  static failure<T>(error: string): Result<T> {
    return new Result(false, undefined, error)
  }

  isSuccess(): this is Result<T> & { data: T } {
    return this.success
  }
}

const success = Result.success(42)
const failure = Result.failure<number>('Error occurred')

if (success.isSuccess()) {
  console.log(success.data) // 42
}
```

## 8. 🤔 泛型类的继承

### 8.1. 继承泛型类

```ts
// ✅ 继承泛型类
class Container<T> {
  constructor(protected value: T) {}

  getValue(): T {
    return this.value
  }
}

// 1. 指定具体类型
class StringContainer extends Container<string> {
  getUpperCase(): string {
    return this.value.toUpperCase()
  }
}

// 2. 保持泛型
class NumberContainer<T extends number> extends Container<T> {
  double(): T {
    return (this.value * 2) as T
  }
}

// 3. 添加新的类型参数
class PairContainer<T, U> extends Container<T> {
  constructor(value: T, private secondValue: U) {
    super(value)
  }

  getSecondValue(): U {
    return this.secondValue
  }
}
```

### 8.2. 实现泛型接口

```ts
// ✅ 实现泛型接口
interface Comparable<T> {
  compareTo(other: T): number
}

class Version implements Comparable<Version> {
  constructor(
    public major: number,
    public minor: number,
    public patch: number
  ) {}

  compareTo(other: Version): number {
    if (this.major !== other.major) {
      return this.major - other.major
    }
    if (this.minor !== other.minor) {
      return this.minor - other.minor
    }
    return this.patch - other.patch
  }

  toString(): string {
    return `${this.major}.${this.minor}.${this.patch}`
  }
}

const v1 = new Version(1, 0, 0)
const v2 = new Version(2, 0, 0)
console.log(v1.compareTo(v2)) // -1
```

### 8.3. 泛型类继承泛型类

```ts
// ✅ 泛型类继承泛型类
class Collection<T> {
  protected items: T[] = []

  add(item: T): void {
    this.items.push(item)
  }

  getAll(): T[] {
    return [...this.items]
  }
}

class SortedCollection<T> extends Collection<T> {
  constructor(private compareFn: (a: T, b: T) => number) {
    super()
  }

  add(item: T): void {
    super.add(item)
    this.items.sort(this.compareFn)
  }

  getSorted(): T[] {
    return [...this.items].sort(this.compareFn)
  }
}

const numbers = new SortedCollection<number>((a, b) => a - b)
numbers.add(3)
numbers.add(1)
numbers.add(2)
console.log(numbers.getAll()) // [1, 2, 3]
```

## 9. 🤔 常见使用场景

### 9.1. 场景 1：数据结构

```ts
// ✅ 泛型链表
class ListNode<T> {
  constructor(public value: T, public next: ListNode<T> | null = null) {}
}

class LinkedList<T> {
  private head: ListNode<T> | null = null
  private tail: ListNode<T> | null = null
  private length = 0

  append(value: T): void {
    const node = new ListNode(value)

    if (!this.head) {
      this.head = node
      this.tail = node
    } else {
      this.tail!.next = node
      this.tail = node
    }

    this.length++
  }

  prepend(value: T): void {
    const node = new ListNode(value)
    node.next = this.head
    this.head = node

    if (!this.tail) {
      this.tail = node
    }

    this.length++
  }

  find(predicate: (value: T) => boolean): T | null {
    let current = this.head

    while (current) {
      if (predicate(current.value)) {
        return current.value
      }
      current = current.next
    }

    return null
  }

  toArray(): T[] {
    const result: T[] = []
    let current = this.head

    while (current) {
      result.push(current.value)
      current = current.next
    }

    return result
  }

  getLength(): number {
    return this.length
  }
}

const list = new LinkedList<number>()
list.append(1)
list.append(2)
list.prepend(0)
console.log(list.toArray()) // [0, 1, 2]
```

### 9.2. 场景 2：响应包装器

```ts
// ✅ API 响应包装器
class ApiResponse<T> {
  constructor(
    public readonly status: number,
    public readonly data: T | null,
    public readonly error: string | null,
    public readonly timestamp: Date = new Date()
  ) {}

  static success<T>(data: T, status: number = 200): ApiResponse<T> {
    return new ApiResponse(status, data, null)
  }

  static error<T>(error: string, status: number = 500): ApiResponse<T> {
    return new ApiResponse(status, null, error)
  }

  isSuccess(): boolean {
    return this.status >= 200 && this.status < 300 && this.error === null
  }

  getData(): T {
    if (!this.isSuccess() || this.data === null) {
      throw new Error(this.error || 'No data available')
    }
    return this.data
  }

  getOrDefault(defaultValue: T): T {
    return this.isSuccess() && this.data !== null ? this.data : defaultValue
  }
}

interface User {
  id: number
  name: string
}

const userResponse = ApiResponse.success<User>({ id: 1, name: 'Alice' })
const user = userResponse.getData()

const errorResponse = ApiResponse.error<User>('User not found', 404)
const defaultUser = errorResponse.getOrDefault({ id: 0, name: 'Guest' })
```

### 9.3. 场景 3：状态管理

```ts
// ✅ 泛型状态管理器
type StateListener<T> = (state: T) => void

class Store<T> {
  private state: T
  private listeners: StateListener<T>[] = []

  constructor(initialState: T) {
    this.state = initialState
  }

  getState(): T {
    return this.state
  }

  setState(newState: Partial<T>): void {
    this.state = { ...this.state, ...newState }
    this.notifyListeners()
  }

  subscribe(listener: StateListener<T>): () => void {
    this.listeners.push(listener)

    // 返回取消订阅函数
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.state))
  }
}

interface AppState {
  user: { name: string; age: number } | null
  isLoading: boolean
  error: string | null
}

const store = new Store<AppState>({
  user: null,
  isLoading: false,
  error: null,
})

const unsubscribe = store.subscribe((state) => {
  console.log('State changed:', state)
})

store.setState({ user: { name: 'Alice', age: 30 } })
store.setState({ isLoading: true })
```

### 9.4. 场景 4：缓存系统

```ts
// ✅ 泛型缓存
interface CacheOptions {
  ttl?: number // 过期时间（毫秒）
  maxSize?: number // 最大缓存数
}

class Cache<K extends string | number, V> {
  private cache = new Map<K, { value: V; expiry: number }>()
  private options: Required<CacheOptions>

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl || 60000, // 默认 1 分钟
      maxSize: options.maxSize || 100,
    }
  }

  set(key: K, value: V, ttl?: number): void {
    // 检查缓存大小
    if (this.cache.size >= this.options.maxSize) {
      // 删除最老的条目
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }

    const expiry = Date.now() + (ttl || this.options.ttl)
    this.cache.set(key, { value, expiry })
  }

  get(key: K): V | undefined {
    const item = this.cache.get(key)

    if (!item) {
      return undefined
    }

    // 检查是否过期
    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return undefined
    }

    return item.value
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
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key)
      }
    }
    return this.cache.size
  }
}

interface User {
  id: number
  name: string
}

const userCache = new Cache<number, User>({ ttl: 5000 })
userCache.set(1, { id: 1, name: 'Alice' })
console.log(userCache.get(1)) // { id: 1, name: 'Alice' }
```

### 9.5. 场景 5：事件发射器

```ts
// ✅ 泛型事件发射器
type EventHandler<T> = (data: T) => void

class EventEmitter<T extends Record<string, any>> {
  private handlers = new Map<keyof T, EventHandler<any>[]>()

  on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, [])
    }
    this.handlers.get(event)!.push(handler)
  }

  off<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void {
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

  once<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void {
    const onceHandler = (data: T[K]) => {
      handler(data)
      this.off(event, onceHandler)
    }
    this.on(event, onceHandler)
  }
}

interface AppEvents {
  userLogin: { userId: number; timestamp: Date }
  userLogout: { userId: number }
  dataLoaded: { count: number }
}

const emitter = new EventEmitter<AppEvents>()

emitter.on('userLogin', (data) => {
  console.log(`User ${data.userId} logged in at ${data.timestamp}`)
})

emitter.emit('userLogin', { userId: 1, timestamp: new Date() })
```

### 9.6. 场景 6：验证器

```ts
// ✅ 泛型验证器
type ValidationRule<T> = (value: T) => string | null

class Validator<T> {
  private rules: ValidationRule<T>[] = []

  addRule(rule: ValidationRule<T>): this {
    this.rules.push(rule)
    return this
  }

  validate(value: T): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    for (const rule of this.rules) {
      const error = rule(value)
      if (error) {
        errors.push(error)
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  static required<T>(): ValidationRule<T> {
    return (value: T) => {
      if (value === null || value === undefined || value === '') {
        return 'This field is required'
      }
      return null
    }
  }

  static minLength(min: number): ValidationRule<string> {
    return (value: string) => {
      if (value.length < min) {
        return `Minimum length is ${min}`
      }
      return null
    }
  }

  static range(min: number, max: number): ValidationRule<number> {
    return (value: number) => {
      if (value < min || value > max) {
        return `Value must be between ${min} and ${max}`
      }
      return null
    }
  }
}

const emailValidator = new Validator<string>()
  .addRule(Validator.required())
  .addRule(Validator.minLength(5))
  .addRule((value) => {
    if (!value.includes('@')) {
      return 'Invalid email format'
    }
    return null
  })

const result = emailValidator.validate('test@example.com')
console.log(result) // { valid: true, errors: [] }
```

## 10. 🤔 常见错误和最佳实践

### 10.1. 错误 1：在静态成员中使用类型参数

```ts
// ❌ 静态成员不能使用类型参数
class Container<T> {
  // ❌ Error
  // static defaultValue: T
}

// ✅ 使用静态泛型方法
class Container<T> {
  static create<U>(value: U): Container<U> {
    return new Container(value)
  }

  constructor(private value: T) {}
}
```

### 10.2. 错误 2：忘记类型约束

```ts
// ❌ 没有约束，无法安全使用成员
class Sorter<T> {
  sort(items: T[]): T[] {
    // ❌ 不知道 T 是否有 compareTo 方法
    // return items.sort((a, b) => a.compareTo(b))
    return items
  }
}

// ✅ 添加约束
interface Comparable {
  compareTo(other: this): number
}

class Sorter<T extends Comparable> {
  sort(items: T[]): T[] {
    return items.sort((a, b) => a.compareTo(b))
  }
}
```

### 10.3. 错误 3：过度使用泛型

```ts
// ❌ 不必要的泛型
class UserService<T extends User> {
  getUser(id: number): T {
    return { id, name: 'Alice' } as T
  }
}

// ✅ 简单情况直接使用具体类型
class UserService {
  getUser(id: number): User {
    return { id, name: 'Alice' }
  }
}

interface User {
  id: number
  name: string
}
```

### 10.4. 错误 4：泛型参数命名不清晰

```ts
// ❌ 命名不清晰
class Map<X, Y> {
  constructor(public x: X, public y: Y) {}
}

// ✅ 使用有意义的名称
class Map<TKey, TValue> {
  constructor(public key: TKey, public value: TValue) {}
}

// ✅ 或使用常见约定
// T = Type, K = Key, V = Value, E = Element
class Dictionary<K, V> {
  // ...
}
```

### 10.5. 最佳实践

```ts
// ✅ 1. 使用有意义的类型参数名
class Repository<TEntity extends { id: number }> {
  // TEntity 清楚表明这是实体类型
}

// ✅ 2. 添加必要的约束
class Validator<T extends object> {
  // 约束 T 为对象类型
}

// ✅ 3. 提供默认类型参数
class Response<T = any> {
  constructor(public data: T) {}
}

// ✅ 4. 使用泛型提高可复用性
class Collection<T> {
  private items: T[] = []

  add(item: T): void {
    this.items.push(item)
  }

  filter(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate)
  }

  map<U>(fn: (item: T) => U): U[] {
    return this.items.map(fn)
  }
}

// ✅ 5. 静态工厂方法
class Result<T> {
  private constructor(
    public readonly success: boolean,
    public readonly data?: T
  ) {}

  static ok<T>(data: T): Result<T> {
    return new Result(true, data)
  }

  static fail<T>(): Result<T> {
    return new Result(false)
  }
}

// ✅ 6. 链式调用
class QueryBuilder<T> {
  private conditions: Array<(item: T) => boolean> = []

  where(condition: (item: T) => boolean): this {
    this.conditions.push(condition)
    return this
  }

  execute(items: T[]): T[] {
    return items.filter((item) =>
      this.conditions.every((condition) => condition(item))
    )
  }
}

// ✅ 7. 组合泛型类
class Optional<T> {
  constructor(private value: T | null) {}

  map<U>(fn: (value: T) => U): Optional<U> {
    if (this.value === null) {
      return new Optional<U>(null)
    }
    return new Optional(fn(this.value))
  }

  orElse(defaultValue: T): T {
    return this.value ?? defaultValue
  }
}

// ✅ 8. 文档化泛型参数
/
 * 泛型容器类
 * @template T - 容器中存储的元素类型
 */
class Container<T> {
  constructor(private value: T) {}
}

// ✅ 9. 使用类型推断
class Box<T> {
  constructor(public value: T) {}

  static from<T>(value: T): Box<T> {
    return new Box(value) // 自动推断类型
  }
}

const box = Box.from(42) // Box<number>

// ✅ 10. 避免过度嵌套
// ❌ 难以理解
class Complex<T extends Container<Array<Map<string, Set<T>>>>> {}

// ✅ 使用类型别名简化
type EntityMap<T> = Map<string, Set<T>>
type EntityArray<T> = Array<EntityMap<T>>
type EntityContainer<T> = Container<EntityArray<T>>

class Simple<T extends EntityContainer<T>> {}
```

## 11. 🔗 引用

- [TypeScript Handbook - Generics][1]
- [TypeScript Handbook - Classes][2]
- [TypeScript Deep Dive - Generics][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/generics.html
[2]: https://www.typescriptlang.org/docs/handbook/2/classes.html
[3]: https://basarat.gitbook.io/typescript/type-system/generics
