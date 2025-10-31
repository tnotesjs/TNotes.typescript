# [0109. 接口的构造签名](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0109.%20%E6%8E%A5%E5%8F%A3%E7%9A%84%E6%9E%84%E9%80%A0%E7%AD%BE%E5%90%8D)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是构造签名？](#3--什么是构造签名)
- [4. 🤔 基本构造签名](#4--基本构造签名)
  - [4.1. 简单构造函数](#41-简单构造函数)
  - [4.2. 可选参数](#42-可选参数)
  - [4.3. 剩余参数](#43-剩余参数)
- [5. 🤔 构造签名重载](#5--构造签名重载)
  - [5.1. 多个构造签名](#51-多个构造签名)
  - [5.2. 不同参数类型](#52-不同参数类型)
- [6. 🤔 构造签名与调用签名](#6--构造签名与调用签名)
  - [6.1. 同时支持两种调用方式](#61-同时支持两种调用方式)
  - [6.2. 可调用的类](#62-可调用的类)
- [7. 🤔 泛型构造签名](#7--泛型构造签名)
  - [7.1. 基本泛型构造函数](#71-基本泛型构造函数)
  - [7.2. 带约束的泛型](#72-带约束的泛型)
  - [7.3. 泛型类工厂](#73-泛型类工厂)
- [8. 🤔 抽象构造签名](#8--抽象构造签名)
  - [8.1. 抽象类类型](#81-抽象类类型)
  - [8.2. 混入模式](#82-混入模式)
- [9. 🤔 常见使用场景](#9--常见使用场景)
  - [9.1. 场景 1：依赖注入](#91-场景-1依赖注入)
  - [9.2. 场景 2：工厂模式](#92-场景-2工厂模式)
  - [9.3. 场景 3：插件系统](#93-场景-3插件系统)
  - [9.4. 场景 4：ORM 模型](#94-场景-4orm-模型)
  - [9.5. 场景 5：测试工厂](#95-场景-5测试工厂)
  - [9.6. 场景 6：装饰器工厂](#96-场景-6装饰器工厂)
  - [9.7. 场景 7：类型安全的事件发射器](#97-场景-7类型安全的事件发射器)
- [10. 🤔 常见错误和最佳实践](#10--常见错误和最佳实践)
  - [10.1. 错误 1：忘记 new 关键字](#101-错误-1忘记-new-关键字)
  - [10.2. 错误 2：构造函数参数不匹配](#102-错误-2构造函数参数不匹配)
  - [10.3. 错误 3：混淆类类型和构造函数类型](#103-错误-3混淆类类型和构造函数类型)
  - [10.4. 错误 4：抽象类的构造签名](#104-错误-4抽象类的构造签名)
  - [10.5. 最佳实践](#105-最佳实践)
- [11. 🔗 引用](#11--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 构造签名的语法
- 基本构造签名定义
- 构造签名重载
- 构造签名与调用签名的组合
- 泛型构造签名
- 类类型和构造函数类型

## 2. 🫧 评价

构造签名（Construct Signature）用于在接口中**描述构造函数的类型**，定义使用 `new` 关键字创建实例的方式。

构造签名的特点：

- **描述构造函数**：定义类或构造函数的类型
- **new 关键字**：使用 `new` 操作符创建实例
- **支持重载**：可以定义多个构造签名
- **泛型支持**：可以使用泛型参数

构造签名 vs 调用签名：

| 特性         | 构造签名             | 调用签名         |
| ------------ | -------------------- | ---------------- |
| **语法**     | `new (params): Type` | `(params): Type` |
| **调用方式** | `new Fn()`           | `Fn()`           |
| **用途**     | 描述类/构造函数      | 描述普通函数     |
| **返回值**   | 实例对象             | 任意类型         |

理解构造签名，能帮助你：

1. 定义类的类型约束
2. 创建工厂函数
3. 实现依赖注入
4. 设计可扩展的类系统

构造签名是 TypeScript 类型系统中描述构造函数的核心工具，特别适合处理类和工厂模式。

## 3. 🤔 什么是构造签名？

构造签名定义**如何使用 new 关键字创建对象实例**。

```ts
// ✅ 基本构造签名
interface PointConstructor {
  new (x: number, y: number): Point
}

interface Point {
  x: number
  y: number
}

class PointClass implements Point {
  constructor(public x: number, public y: number) {}
}

// PointClass 符合 PointConstructor
const PointCtor: PointConstructor = PointClass

const point = new PointCtor(10, 20)
console.log(point.x, point.y) // 10 20
```

**关键概念**：

- **new 关键字**：构造签名必须使用 `new`
- **构造函数类型**：描述类或构造函数
- **实例类型**：返回值是实例对象
- **参数类型**：构造函数的参数

## 4. 🤔 基本构造签名

### 4.1. 简单构造函数

```ts
// ✅ 无参数构造函数
interface DateConstructor {
  new (): Date
}

// ✅ 带参数的构造函数
interface PersonConstructor {
  new (name: string, age: number): Person
}

interface Person {
  name: string
  age: number
}

class PersonClass implements Person {
  constructor(public name: string, public age: number) {}
}

const PersonCtor: PersonConstructor = PersonClass
const person = new PersonCtor('Alice', 30)
```

### 4.2. 可选参数

```ts
// ✅ 可选构造参数
interface LoggerConstructor {
  new (name?: string, level?: 'info' | 'warn' | 'error'): Logger
}

interface Logger {
  name: string
  level: string
  log(message: string): void
}

class LoggerClass implements Logger {
  constructor(public name: string = 'default', public level: string = 'info') {}

  log(message: string) {
    console.log(`[${this.level}] ${this.name}: ${message}`)
  }
}

const LoggerCtor: LoggerConstructor = LoggerClass
const logger1 = new LoggerCtor()
const logger2 = new LoggerCtor('app', 'warn')
```

### 4.3. 剩余参数

```ts
// ✅ 构造函数的剩余参数
interface ArrayConstructor<T> {
  new (...items: T[]): T[]
}

// 使用内置的 Array 构造函数
const nums = new Array(1, 2, 3, 4, 5)
```

## 5. 🤔 构造签名重载

### 5.1. 多个构造签名

```ts
// ✅ 构造函数重载
interface DateConstructor {
  new (): Date
  new (value: number): Date
  new (value: string): Date
  new (year: number, month: number, day?: number): Date
}

// JavaScript 的 Date 构造函数支持多种调用方式
const date1 = new Date()
const date2 = new Date(1234567890000)
const date3 = new Date('2024-01-01')
const date4 = new Date(2024, 0, 1)
```

### 5.2. 不同参数类型

```ts
// ✅ 根据参数类型创建不同实例
interface ShapeConstructor {
  new (radius: number): Circle
  new (width: number, height: number): Rectangle
}

interface Circle {
  type: 'circle'
  radius: number
}

interface Rectangle {
  type: 'rectangle'
  width: number
  height: number
}

// 实现时需要处理所有重载
class Shape {
  type: 'circle' | 'rectangle'
  radius?: number
  width?: number
  height?: number

  constructor(radiusOrWidth: number, height?: number) {
    if (height === undefined) {
      this.type = 'circle'
      this.radius = radiusOrWidth
    } else {
      this.type = 'rectangle'
      this.width = radiusOrWidth
      this.height = height
    }
  }
}
```

## 6. 🤔 构造签名与调用签名

### 6.1. 同时支持两种调用方式

```ts
// ✅ 既可以 new 也可以直接调用
interface DateLike {
  // 调用签名：作为函数调用
  (): string

  // 构造签名：使用 new 调用
  new (): Date
  new (value: number): Date
  new (value: string): Date

  // 静态方法
  now(): number
  parse(s: string): number
}

// JavaScript 的 Date 就是这样的例子
const dateString = Date() // string
const dateObject = new Date() // Date
const timestamp = Date.now() // number
```

### 6.2. 可调用的类

```ts
// ✅ 类既可以实例化也可以调用
interface CounterConstructor {
  // 构造签名
  new (initial?: number): Counter

  // 调用签名
  (initial?: number): Counter

  // 静态属性
  instances: Counter[]
}

interface Counter {
  count: number
  increment(): void
  decrement(): void
}

const CounterImpl: CounterConstructor = Object.assign(
  function (initial = 0) {
    if (new.target) {
      // 使用 new 调用
      const counter = {
        count: initial,
        increment() {
          this.count++
        },
        decrement() {
          this.count--
        },
      }
      CounterImpl.instances.push(counter)
      return counter
    } else {
      // 直接调用，转发到构造函数
      return new (CounterImpl as any)(initial)
    }
  } as any,
  { instances: [] }
)

const c1 = new CounterImpl() // 使用 new
const c2 = CounterImpl(10) // 直接调用
```

## 7. 🤔 泛型构造签名

### 7.1. 基本泛型构造函数

```ts
// ✅ 泛型构造签名
interface Constructor<T> {
  new (...args: any[]): T
}

// 使用泛型构造签名
function create<T>(Ctor: Constructor<T>, ...args: any[]): T {
  return new Ctor(...args)
}

class Person {
  constructor(public name: string, public age: number) {}
}

const person = create(Person, 'Alice', 30)
```

### 7.2. 带约束的泛型

```ts
// ✅ 约束泛型必须有特定属性
interface Constructor<T extends { id: number }> {
  new (id: number): T
}

interface Entity {
  id: number
}

class User implements Entity {
  constructor(public id: number, public name?: string) {}
}

class Product implements Entity {
  constructor(public id: number, public price?: number) {}
}

function createEntity<T extends Entity>(Ctor: Constructor<T>, id: number): T {
  return new Ctor(id)
}

const user = createEntity(User, 1)
const product = createEntity(Product, 2)
```

### 7.3. 泛型类工厂

```ts
// ✅ 创建泛型类的工厂
interface Repository<T> {
  items: T[]
  add(item: T): void
  find(predicate: (item: T) => boolean): T | undefined
}

interface RepositoryConstructor {
  new <T>(): Repository<T>
}

class RepositoryClass<T> implements Repository<T> {
  items: T[] = []

  add(item: T) {
    this.items.push(item)
  }

  find(predicate: (item: T) => boolean): T | undefined {
    return this.items.find(predicate)
  }
}

const RepoCtor: RepositoryConstructor = RepositoryClass

const userRepo = new RepoCtor<User>()
const productRepo = new RepoCtor<Product>()
```

## 8. 🤔 抽象构造签名

### 8.1. 抽象类类型

```ts
// ✅ 描述抽象类的构造函数
interface AbstractConstructor<T> {
  prototype: T
}

abstract class Animal {
  abstract makeSound(): void

  move() {
    console.log('Moving...')
  }
}

class Dog extends Animal {
  makeSound() {
    console.log('Woof!')
  }
}

// 不能实例化抽象类
// const animal = new Animal()  // ❌ Error

// 但可以引用抽象类类型
function processAnimal(AnimalClass: AbstractConstructor<Animal>) {
  // 可以访问原型
  console.log(AnimalClass.prototype)
}

processAnimal(Animal)
processAnimal(Dog)
```

### 8.2. 混入模式

```ts
// ✅ 使用构造签名实现混入
type Constructor<T = {}> = new (...args: any[]) => T

function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = new Date()
  }
}

function Tagged<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    tags: string[] = []
    addTag(tag: string) {
      this.tags.push(tag)
    }
  }
}

class User {
  constructor(public name: string) {}
}

// 应用混入
const TimestampedUser = Timestamped(User)
const TaggedUser = Tagged(User)
const EnhancedUser = Tagged(Timestamped(User))

const user = new EnhancedUser('Alice')
console.log(user.name) // 'Alice'
console.log(user.timestamp) // Date
user.addTag('admin')
console.log(user.tags) // ['admin']
```

## 9. 🤔 常见使用场景

### 9.1. 场景 1：依赖注入

```ts
// ✅ 依赖注入容器
interface ServiceConstructor<T> {
  new (...args: any[]): T
}

class Container {
  private services = new Map<string, any>()

  register<T>(name: string, Service: ServiceConstructor<T>) {
    this.services.set(name, Service)
  }

  resolve<T>(name: string): T {
    const Service = this.services.get(name)
    if (!Service) {
      throw new Error(`Service ${name} not found`)
    }
    return new Service()
  }
}

class Logger {
  log(message: string) {
    console.log(message)
  }
}

class UserService {
  constructor(private logger: Logger = new Logger()) {}

  getUser(id: number) {
    this.logger.log(`Getting user ${id}`)
    return { id, name: 'Alice' }
  }
}

const container = new Container()
container.register('logger', Logger)
container.register('userService', UserService)

const userService = container.resolve<UserService>('userService')
```

### 9.2. 场景 2：工厂模式

```ts
// ✅ 通用工厂函数
interface Factory<T> {
  create(...args: any[]): T
}

class GenericFactory<T> implements Factory<T> {
  constructor(private Ctor: new (...args: any[]) => T) {}

  create(...args: any[]): T {
    return new this.Ctor(...args)
  }
}

class Car {
  constructor(public brand: string, public model: string) {}
}

const carFactory = new GenericFactory(Car)
const car = carFactory.create('Toyota', 'Camry')
```

### 9.3. 场景 3：插件系统

```ts
// ✅ 插件接口
interface Plugin {
  name: string
  version: string
  init(): void
}

interface PluginConstructor {
  new (config?: any): Plugin
}

class PluginManager {
  private plugins: Plugin[] = []

  register(PluginClass: PluginConstructor, config?: any) {
    const plugin = new PluginClass(config)
    this.plugins.push(plugin)
    plugin.init()
  }

  getPlugin(name: string): Plugin | undefined {
    return this.plugins.find((p) => p.name === name)
  }
}

class LoggerPlugin implements Plugin {
  name = 'logger'
  version = '1.0.0'

  constructor(private config: { level?: string } = {}) {}

  init() {
    console.log(
      `Logger plugin initialized with level: ${this.config.level || 'info'}`
    )
  }
}

const manager = new PluginManager()
manager.register(LoggerPlugin, { level: 'debug' })
```

### 9.4. 场景 4：ORM 模型

```ts
// ✅ ORM 模型基类
interface ModelConstructor<T> {
  new (data?: Partial<T>): T
  tableName: string
  find(id: number): Promise<T | null>
  findAll(): Promise<T[]>
}

abstract class Model {
  static tableName: string

  static async find(id: number) {
    // 数据库查询逻辑
    return null
  }

  static async findAll() {
    // 数据库查询逻辑
    return []
  }

  async save() {
    // 保存逻辑
  }
}

class User extends Model {
  static tableName = 'users'

  constructor(public id?: number, public name?: string, public email?: string) {
    super()
  }
}

// 使用
async function getUser(id: number) {
  return await User.find(id)
}
```

### 9.5. 场景 5：测试工厂

```ts
// ✅ 测试数据工厂
interface FactoryConstructor<T> {
  new (): Factory<T>
}

interface Factory<T> {
  build(overrides?: Partial<T>): T
  buildList(count: number, overrides?: Partial<T>): T[]
}

class UserFactory implements Factory<User> {
  private sequence = 0

  build(overrides?: Partial<User>): User {
    this.sequence++
    return {
      id: this.sequence,
      name: `User${this.sequence}`,
      email: `user${this.sequence}@example.com`,
      ...overrides,
    }
  }

  buildList(count: number, overrides?: Partial<User>): User[] {
    return Array.from({ length: count }, () => this.build(overrides))
  }
}

// 使用
const userFactory = new UserFactory()
const user = userFactory.build({ name: 'Alice' })
const users = userFactory.buildList(5)
```

### 9.6. 场景 6：装饰器工厂

```ts
// ✅ 类装饰器
type ClassDecorator = <T extends Constructor>(target: T) => T | void

interface DecoratorFactory {
  (options?: any): ClassDecorator
}

function Entity(tableName: string): ClassDecorator {
  return function <T extends Constructor>(target: T) {
    return class extends target {
      static tableName = tableName
    }
  }
}

@Entity('users')
class User {
  constructor(public name: string) {}
}

console.log((User as any).tableName) // 'users'
```

### 9.7. 场景 7：类型安全的事件发射器

```ts
// ✅ 带类型的事件发射器
interface EventMap {
  [event: string]: any
}

interface EventEmitterConstructor {
  new <T extends EventMap>(): EventEmitter<T>
}

class EventEmitter<T extends EventMap> {
  private listeners = new Map<keyof T, Function[]>()

  on<K extends keyof T>(event: K, listener: (data: T[K]) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(listener)
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    const listeners = this.listeners.get(event)
    if (listeners) {
      listeners.forEach((listener) => listener(data))
    }
  }
}

// 使用
interface AppEvents {
  userLogin: { userId: number; timestamp: Date }
  userLogout: { userId: number }
  error: { message: string; code: number }
}

const emitter = new EventEmitter<AppEvents>()

emitter.on('userLogin', (data) => {
  console.log(`User ${data.userId} logged in at ${data.timestamp}`)
})

emitter.emit('userLogin', { userId: 1, timestamp: new Date() })
```

## 10. 🤔 常见错误和最佳实践

### 10.1. 错误 1：忘记 new 关键字

```ts
// ❌ 调用签名和构造签名不同
interface Bad {
  (x: number): Point // 调用签名，不能用 new
}

// ✅ 使用构造签名
interface Good {
  new (x: number): Point // 构造签名，使用 new
}
```

### 10.2. 错误 2：构造函数参数不匹配

```ts
// ❌ 实现不匹配构造签名
interface PersonConstructor {
  new (name: string, age: number): Person
}

class PersonClass {
  constructor(name: string) {} // ❌ 缺少 age 参数
}

// ✅ 参数匹配
class PersonClass {
  constructor(public name: string, public age: number) {}
}
```

### 10.3. 错误 3：混淆类类型和构造函数类型

```ts
// ❌ 类类型不是构造函数类型
function create(Ctor: Person) {
  // Person 是实例类型
  return new Ctor() // ❌ Error
}

// ✅ 使用构造函数类型
function create(Ctor: new () => Person) {
  return new Ctor()
}

// ✅ 或使用泛型
function create<T>(Ctor: new () => T): T {
  return new Ctor()
}
```

### 10.4. 错误 4：抽象类的构造签名

```ts
abstract class Animal {
  abstract makeSound(): void
}

// ❌ 不能实例化抽象类
function createAnimal(Ctor: new () => Animal) {
  return new Ctor() // ❌ 如果传入 Animal 会报错
}

// ✅ 使用抽象构造类型
type AbstractConstructor<T> = Function & { prototype: T }

function processAnimal(AnimalClass: AbstractConstructor<Animal>) {
  // 不实例化，只访问原型
}
```

### 10.5. 最佳实践

```ts
// ✅ 1. 使用泛型约束
interface Constructor<T = {}> {
  new (...args: any[]): T
}

// ✅ 2. 为构造函数添加文档
interface UserConstructor {
  /**
   * 创建用户实例
   * @param name - 用户名
   * @param email - 邮箱地址
   */
  new (name: string, email: string): User
}

// ✅ 3. 提取公共构造签名
interface EntityConstructor<T> {
  new (id: number): T
  tableName: string
}

// ✅ 4. 使用类型别名简化
type Ctor<T> = new (...args: any[]) => T

function create<T>(Ctor: Ctor<T>): T {
  return new Ctor()
}

// ✅ 5. 支持构造函数重载
interface FlexibleConstructor<T> {
  new (): T
  new (config: Partial<T>): T
}

// ✅ 6. 结合静态成员
interface ServiceConstructor<T> {
  new (): T
  readonly serviceName: string
  getInstance(): T
}

// ✅ 7. 使用 typeof 获取类的构造签名
class User {
  constructor(public name: string) {}
}

// typeof User 是构造函数类型
function createUser(Ctor: typeof User) {
  return new Ctor('Alice')
}

// ✅ 8. 为工厂函数使用构造签名
interface Factory<T> {
  create(Ctor: new (...args: any[]) => T, ...args: any[]): T
}

// ✅ 9. 混入模式的类型定义
type Constructor<T = {}> = new (...args: any[]) => T

function Mixin<T extends Constructor>(Base: T) {
  return class extends Base {
    // 混入逻辑
  }
}

// ✅ 10. 测试构造函数类型
type AssertConstructor<T> = T extends new (...args: any[]) => any ? T : never

// 确保类型是构造函数
type Test = AssertConstructor<typeof User> // ✅
```

## 11. 🔗 引用

- [TypeScript Handbook - Construct Signatures][1]
- [TypeScript Handbook - Classes][2]
- [TypeScript Deep Dive - Constructor][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/functions.html#construct-signatures
[2]: https://www.typescriptlang.org/docs/handbook/2/classes.html
[3]: https://basarat.gitbook.io/typescript/type-system/callable
