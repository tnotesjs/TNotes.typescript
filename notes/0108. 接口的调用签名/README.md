# [0108. 接口的调用签名](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0108.%20%E6%8E%A5%E5%8F%A3%E7%9A%84%E8%B0%83%E7%94%A8%E7%AD%BE%E5%90%8D)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是调用签名？](#3--什么是调用签名)
- [4. 🤔 基本调用签名](#4--基本调用签名)
  - [4.1. 简单函数](#41-简单函数)
  - [4.2. 多参数函数](#42-多参数函数)
  - [4.3. 可选参数](#43-可选参数)
  - [4.4. 剩余参数](#44-剩余参数)
- [5. 🤔 函数重载](#5--函数重载)
  - [5.1. 基本重载](#51-基本重载)
  - [5.2. 不同参数数量的重载](#52-不同参数数量的重载)
  - [5.3. 复杂重载](#53-复杂重载)
- [6. 🤔 可调用对象](#6--可调用对象)
  - [6.1. 函数带属性](#61-函数带属性)
  - [6.2. jQuery 风格的 API](#62-jquery-风格的-api)
  - [6.3. 构造函数式对象](#63-构造函数式对象)
- [7. 🤔 泛型调用签名](#7--泛型调用签名)
  - [7.1. 基本泛型](#71-基本泛型)
  - [7.2. 泛型约束](#72-泛型约束)
  - [7.3. 多个泛型参数](#73-多个泛型参数)
  - [7.4. 泛型接口级别](#74-泛型接口级别)
- [8. 🤔 调用签名 vs 函数类型](#8--调用签名-vs-函数类型)
  - [8.1. 语法对比](#81-语法对比)
  - [8.2. 适用场景](#82-适用场景)
  - [8.3. 互操作性](#83-互操作性)
- [9. 🤔 常见使用场景](#9--常见使用场景)
  - [9.1. 场景 1：事件处理器](#91-场景-1事件处理器)
  - [9.2. 场景 2：中间件](#92-场景-2中间件)
  - [9.3. 场景 3：装饰器工厂](#93-场景-3装饰器工厂)
  - [9.4. 场景 4：验证器](#94-场景-4验证器)
  - [9.5. 场景 5：链式 API](#95-场景-5链式-api)
  - [9.6. 场景 6：工厂函数](#96-场景-6工厂函数)
  - [9.7. 场景 7：转换器](#97-场景-7转换器)
- [10. 🤔 常见错误和最佳实践](#10--常见错误和最佳实践)
  - [10.1. 错误 1：忘记实现所有重载](#101-错误-1忘记实现所有重载)
  - [10.2. 错误 2：重载顺序错误](#102-错误-2重载顺序错误)
  - [10.3. 错误 3：调用签名与箭头函数混淆](#103-错误-3调用签名与箭头函数混淆)
  - [10.4. 错误 4：泛型位置错误](#104-错误-4泛型位置错误)
  - [10.5. 最佳实践](#105-最佳实践)
- [11. 🔗 引用](#11--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 调用签名的语法
- 基本调用签名定义
- 函数重载
- 可调用对象
- 泛型调用签名
- 调用签名与函数类型的区别

## 2. 🫧 评价

调用签名（Call Signature）用于在接口中**描述函数的类型**，定义函数的参数和返回值类型。

调用签名的特点：

- **描述函数**：定义可调用对象的类型
- **支持重载**：可以定义多个调用签名
- **携带属性**：函数可以有额外的属性
- **灵活组合**：与其他接口成员组合使用

两种定义函数类型的方式：

| 方式         | 语法                                    | 特点           |
| ------------ | --------------------------------------- | -------------- |
| **调用签名** | `(param: Type): ReturnType`             | 可以与属性组合 |
| **函数类型** | `type Fn = (param: Type) => ReturnType` | 简洁直观       |

调用签名的优势：

- **可以添加属性**：函数可以有额外属性
- **支持重载**：定义多个调用签名
- **接口组合**：与其他成员一起定义

理解调用签名，能帮助你：

1. 定义复杂的函数类型
2. 实现函数重载
3. 创建带属性的函数对象
4. 设计灵活的 API

调用签名是 TypeScript 中描述函数类型的重要工具，特别适合定义复杂的可调用对象。

## 3. 🤔 什么是调用签名？

调用签名在接口中定义**对象可以像函数一样被调用**。

```ts
// ✅ 使用调用签名
interface Add {
  (a: number, b: number): number
}

const add: Add = (a, b) => a + b

console.log(add(1, 2)) // 3

// ✅ 等价的函数类型
type AddType = (a: number, b: number) => number

const add2: AddType = (a, b) => a + b
```

**关键概念**：

- **可调用对象**：对象可以像函数一样调用
- **参数类型**：定义每个参数的类型
- **返回类型**：定义返回值类型
- **接口成员**：可以与其他成员组合

## 4. 🤔 基本调用签名

### 4.1. 简单函数

```ts
// ✅ 基本调用签名
interface Greeter {
  (name: string): string
}

const greet: Greeter = (name) => {
  return `Hello, ${name}!`
}

console.log(greet('Alice')) // "Hello, Alice!"
```

### 4.2. 多参数函数

```ts
// ✅ 多个参数
interface Calculator {
  (a: number, b: number, operation: '+' | '-' | '*' | '/'): number
}

const calculate: Calculator = (a, b, operation) => {
  switch (operation) {
    case '+':
      return a + b
    case '-':
      return a - b
    case '*':
      return a * b
    case '/':
      return a / b
  }
}

console.log(calculate(10, 5, '+')) // 15
```

### 4.3. 可选参数

```ts
// ✅ 可选参数
interface Logger {
  (message: string, level?: 'info' | 'warn' | 'error'): void
}

const log: Logger = (message, level = 'info') => {
  console.log(`[${level.toUpperCase()}] ${message}`)
}

log('Hello') // [INFO] Hello
log('Warning!', 'warn') // [WARN] Warning!
```

### 4.4. 剩余参数

```ts
// ✅ 剩余参数
interface Sum {
  (...numbers: number[]): number
}

const sum: Sum = (...numbers) => {
  return numbers.reduce((acc, n) => acc + n, 0)
}

console.log(sum(1, 2, 3, 4, 5)) // 15
```

## 5. 🤔 函数重载

### 5.1. 基本重载

```ts
// ✅ 定义多个调用签名（重载）
interface Processor {
  (data: string): string
  (data: number): number
  (data: boolean): string
}

// 实现必须兼容所有重载
const process: Processor = (data: any): any => {
  if (typeof data === 'string') {
    return data.toUpperCase()
  }
  if (typeof data === 'number') {
    return data * 2
  }
  if (typeof data === 'boolean') {
    return data ? 'yes' : 'no'
  }
}

process('hello') // 'HELLO'
process(10) // 20
process(true) // 'yes'
```

### 5.2. 不同参数数量的重载

```ts
// ✅ 不同数量的参数
interface Builder {
  (width: number): string
  (width: number, height: number): string
  (width: number, height: number, depth: number): string
}

const build: Builder = (
  width: number,
  height?: number,
  depth?: number
): string => {
  if (depth !== undefined) {
    return `Box: ${width}x${height}x${depth}`
  }
  if (height !== undefined) {
    return `Rectangle: ${width}x${height}`
  }
  return `Line: ${width}`
}

build(10) // 'Line: 10'
build(10, 20) // 'Rectangle: 10x20'
build(10, 20, 30) // 'Box: 10x20x30'
```

### 5.3. 复杂重载

```ts
// ✅ 不同类型的参数组合
interface Formatter {
  (value: string, uppercase: boolean): string
  (value: number, precision: number): string
  (value: Date, format: string): string
}

const format: Formatter = (
  value: string | number | Date,
  option: boolean | number | string
): string => {
  if (typeof value === 'string' && typeof option === 'boolean') {
    return option ? value.toUpperCase() : value.toLowerCase()
  }
  if (typeof value === 'number' && typeof option === 'number') {
    return value.toFixed(option)
  }
  if (value instanceof Date && typeof option === 'string') {
    // 简化的日期格式化
    return value.toISOString()
  }
  return String(value)
}
```

## 6. 🤔 可调用对象

### 6.1. 函数带属性

```ts
// ✅ 函数 + 属性
interface Counter {
  (step?: number): number // 调用签名
  count: number // 属性
  reset(): void // 方法
}

function createCounter(): Counter {
  const counter = ((step = 1) => {
    counter.count += step
    return counter.count
  }) as Counter

  counter.count = 0
  counter.reset = () => {
    counter.count = 0
  }

  return counter
}

const counter = createCounter()
console.log(counter()) // 1
console.log(counter(5)) // 6
console.log(counter.count) // 6
counter.reset()
console.log(counter.count) // 0
```

### 6.2. jQuery 风格的 API

```ts
// ✅ jQuery 风格：既可调用又有方法
interface Query {
  (selector: string): QueryResult
  ajax(url: string): Promise<any>
  get(url: string): Promise<any>
  post(url: string, data: any): Promise<any>
}

interface QueryResult {
  addClass(className: string): QueryResult
  removeClass(className: string): QueryResult
  on(event: string, handler: Function): QueryResult
}
```

### 6.3. 构造函数式对象

```ts
// ✅ 可以作为构造函数调用，也可以作为普通函数调用
interface DateConstructor {
  // 作为函数调用
  (): string
  // 作为构造函数调用
  new (): Date
  new (value: number): Date
  new (value: string): Date

  // 静态方法
  now(): number
  parse(s: string): number
}
```

## 7. 🤔 泛型调用签名

### 7.1. 基本泛型

```ts
// ✅ 泛型调用签名
interface Identity {
  <T>(value: T): T
}

const identity: Identity = (value) => value

const num = identity(42) // number
const str = identity('hello') // string
const arr = identity([1, 2, 3]) // number[]
```

### 7.2. 泛型约束

```ts
// ✅ 带约束的泛型
interface Mapper {
  <T extends { id: number }>(items: T[]): number[]
}

const mapper: Mapper = (items) => {
  return items.map((item) => item.id)
}

const ids = mapper([
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
]) // number[]
```

### 7.3. 多个泛型参数

```ts
// ✅ 多个泛型
interface Pair {
  <T, U>(first: T, second: U): [T, U]
}

const pair: Pair = (first, second) => [first, second]

const p1 = pair(1, 'hello') // [number, string]
const p2 = pair(true, [1, 2, 3]) // [boolean, number[]]
```

### 7.4. 泛型接口级别

```ts
// ✅ 接口级别的泛型
interface Container<T> {
  (value: T): T
  value: T
  map<U>(fn: (value: T) => U): Container<U>
}

function createContainer<T>(initial: T): Container<T> {
  const container = ((value: T) => {
    container.value = value
    return value
  }) as Container<T>

  container.value = initial
  container.map = function <U>(fn: (value: T) => U): Container<U> {
    return createContainer(fn(this.value))
  }

  return container
}

const numContainer = createContainer(42)
const strContainer = numContainer.map((n) => n.toString())
```

## 8. 🤔 调用签名 vs 函数类型

### 8.1. 语法对比

::: code-group

```ts [调用签名]
// ✅ 使用接口 + 调用签名
interface Add {
  (a: number, b: number): number
}

// 可以添加属性
interface AddWithHistory {
  (a: number, b: number): number
  history: number[]
}
```

```ts [函数类型]
// ✅ 使用类型别名 + 箭头函数
type Add = (a: number, b: number) => number

// 不能直接添加属性
// 需要使用交叉类型
type AddWithHistory = {
  (a: number, b: number): number
  history: number[]
}
```

:::

### 8.2. 适用场景

::: code-group

```ts [调用签名 - 复杂函数]
// ✅ 适合：带属性的函数
interface Logger {
  (message: string): void
  level: 'info' | 'warn' | 'error'
  history: string[]
  clear(): void
}

// ✅ 适合：函数重载
interface Parser {
  (data: string): object
  (data: Buffer): object
  (data: ArrayBuffer): object
}
```

```ts [函数类型 - 简单函数]
// ✅ 适合：简单函数类型
type Add = (a: number, b: number) => number
type Predicate<T> = (value: T) => boolean
type Mapper<T, U> = (value: T) => U

// ✅ 适合：回调函数
type Callback = (error: Error | null, data?: any) => void
type EventHandler = (event: Event) => void
```

:::

### 8.3. 互操作性

```ts
// ✅ 两种方式可以互相赋值
interface AddInterface {
  (a: number, b: number): number
}

type AddType = (a: number, b: number) => number

const add1: AddInterface = (a, b) => a + b
const add2: AddType = add1 // ✅ 兼容

const add3: AddType = (a, b) => a + b
const add4: AddInterface = add3 // ✅ 兼容
```

## 9. 🤔 常见使用场景

### 9.1. 场景 1：事件处理器

```ts
// ✅ 事件处理器接口
interface EventHandler<T = Event> {
  (event: T): void
  once?: boolean
  passive?: boolean
}

interface EventEmitter {
  on(event: string, handler: EventHandler): void
  off(event: string, handler: EventHandler): void
}

const handler: EventHandler<MouseEvent> = (event) => {
  console.log(event.clientX, event.clientY)
}

handler.once = true
```

### 9.2. 场景 2：中间件

```ts
// ✅ Express 风格的中间件
interface Middleware {
  (req: Request, res: Response, next: NextFunction): void
  name?: string
  priority?: number
}

const authMiddleware: Middleware = (req, res, next) => {
  if (req.headers.authorization) {
    next()
  } else {
    res.status(401).send('Unauthorized')
  }
}

authMiddleware.name = 'auth'
authMiddleware.priority = 1
```

### 9.3. 场景 3：装饰器工厂

```ts
// ✅ 装饰器工厂
interface DecoratorFactory {
  (options?: any): MethodDecorator
  defaults: any
}

const createDecorator = (): DecoratorFactory => {
  const factory = ((options = {}) => {
    return (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) => {
      // 装饰器逻辑
    }
  }) as DecoratorFactory

  factory.defaults = {}

  return factory
}

const log = createDecorator()

class MyClass {
  @log({ level: 'debug' })
  method() {}
}
```

### 9.4. 场景 4：验证器

```ts
// ✅ 可配置的验证器
interface Validator<T> {
  (value: T): boolean
  message: string
  validate(value: T): { valid: boolean; message?: string }
}

function createValidator<T>(
  validate: (value: T) => boolean,
  message: string
): Validator<T> {
  const validator = ((value: T) => validate(value)) as Validator<T>

  validator.message = message
  validator.validate = (value) => ({
    valid: validate(value),
    message: validate(value) ? undefined : message,
  })

  return validator
}

const isEmail = createValidator(
  (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  'Invalid email address'
)

console.log(isEmail('test@example.com')) // true
console.log(isEmail.validate('invalid')) // { valid: false, message: '...' }
```

### 9.5. 场景 5：链式 API

```ts
// ✅ 链式调用
interface Query<T> {
  (collection: string): QueryChain<T>
  create<U>(collection: string): Query<U>
}

interface QueryChain<T> {
  where(field: string, value: any): QueryChain<T>
  limit(n: number): QueryChain<T>
  sort(field: string, order: 'asc' | 'desc'): QueryChain<T>
  execute(): Promise<T[]>
}

// 使用
const query: Query<User> = (collection) => {
  // 返回 QueryChain
  return {} as QueryChain<User>
}

query('users').where('age', 18).limit(10).sort('name', 'asc').execute()
```

### 9.6. 场景 6：工厂函数

```ts
// ✅ 带配置的工厂
interface Factory<T> {
  (): T
  (config: Partial<T>): T
  defaults: T
  create(config?: Partial<T>): T
}

function createFactory<T>(defaults: T): Factory<T> {
  const factory = ((config?: Partial<T>) => {
    return { ...defaults, ...config }
  }) as Factory<T>

  factory.defaults = defaults
  factory.create = (config) => factory(config)

  return factory
}

const createUser = createFactory({
  id: 0,
  name: '',
  age: 0,
})

const user1 = createUser()
const user2 = createUser({ name: 'Alice' })
```

### 9.7. 场景 7：转换器

```ts
// ✅ 双向转换器
interface Transformer<T, U> {
  (value: T): U
  inverse(value: U): T
  compose<V>(other: Transformer<U, V>): Transformer<T, V>
}

const numberToString: Transformer<number, string> = Object.assign(
  (value: number) => value.toString(),
  {
    inverse: (value: string) => parseInt(value, 10),
    compose<V>(other: Transformer<string, V>): Transformer<number, V> {
      return Object.assign((value: number) => other(numberToString(value)), {
        inverse: (value: V) => numberToString.inverse(other.inverse(value)),
        compose: (next: any) => next,
      }) as any
    },
  }
)
```

## 10. 🤔 常见错误和最佳实践

### 10.1. 错误 1：忘记实现所有重载

```ts
// ❌ 实现不兼容所有重载
interface Parser {
  (data: string): object
  (data: number): object
}

const parse: Parser = (data: string) => {
  // ❌ Error: 缺少 number 重载
  return JSON.parse(data)
}

// ✅ 使用联合类型实现
const parse: Parser = (data: string | number): object => {
  if (typeof data === 'string') {
    return JSON.parse(data)
  }
  return { value: data }
}
```

### 10.2. 错误 2：重载顺序错误

```ts
// ❌ 更具体的重载应该在前面
interface Bad {
  (value: any): string // 太宽泛，会匹配所有类型
  (value: string): string
  (value: number): string
}

// ✅ 具体的重载在前
interface Good {
  (value: string): string
  (value: number): string
  (value: any): string // 通用重载在最后
}
```

### 10.3. 错误 3：调用签名与箭头函数混淆

```ts
// ❌ 在接口中使用箭头函数语法
interface Bad {
  sum: (a: number, b: number) => number // 这是属性，不是调用签名
}

// ✅ 使用调用签名
interface Good {
  (a: number, b: number): number
}

// ✅ 或者明确定义为属性
interface AlsoGood {
  sum(a: number, b: number): number
}
```

### 10.4. 错误 4：泛型位置错误

```ts
// ❌ 泛型应该在调用签名上
interface Bad<T> {
  (value: T): T
}

const identity: Bad<number> = (value) => value
// 必须指定 T 的类型

// ✅ 泛型在调用签名上更灵活
interface Good {
  <T>(value: T): T
}

const identity: Good = (value) => value
// 调用时自动推断 T
identity(42) // T = number
identity('hello') // T = string
```

### 10.5. 最佳实践

```ts
// ✅ 1. 简单函数使用函数类型
type SimpleAdd = (a: number, b: number) => number

// ✅ 2. 复杂函数使用调用签名
interface ComplexLogger {
  (message: string, level?: string): void
  history: string[]
  clear(): void
}

// ✅ 3. 重载从具体到通用
interface Processor {
  (data: string): string
  (data: number): number
  (data: any): any // 最后
}

// ✅ 4. 为调用签名添加文档
interface Calculator {
  /**
   * 执行数学运算
   * @param a - 第一个操作数
   * @param b - 第二个操作数
   * @param op - 运算符
   * @returns 运算结果
   */
  (a: number, b: number, op: '+' | '-' | '*' | '/'): number
}

// ✅ 5. 使用泛型提供灵活性
interface Mapper {
  <T, U>(value: T, fn: (value: T) => U): U
}

// ✅ 6. 组合调用签名和属性
interface StatefulFunction {
  (input: string): string
  state: { count: number }
  reset(): void
}

// ✅ 7. 使用类型守卫处理重载
function isString(value: any): value is string {
  return typeof value === 'string'
}

interface Processor {
  (value: string | number): string
}

const process: Processor = (value) => {
  if (isString(value)) {
    return value.toUpperCase()
  }
  return value.toString()
}

// ✅ 8. 为工厂函数使用调用签名
interface Factory<T> {
  (): T
  (config: Partial<T>): T
  defaults: T
}

// ✅ 9. 保持接口职责单一
// ❌ 不好：太多功能
interface Bad {
  (value: any): any
  process(): void
  validate(): boolean
  transform(): any
  // 太多职责
}

// ✅ 好：职责明确
interface Validator {
  (value: any): boolean
  message: string
}

// ✅ 10. 测试类型正确性
type AssertCallable<T extends (...args: any[]) => any> = T

// 确保类型是可调用的
type Test = AssertCallable<Calculator>
```

## 11. 🔗 引用

- [TypeScript Handbook - Call Signatures][1]
- [TypeScript Handbook - Function Types][2]
- [TypeScript Deep Dive - Callable][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures
[2]: https://www.typescriptlang.org/docs/handbook/2/functions.html
[3]: https://basarat.gitbook.io/typescript/type-system/callable
