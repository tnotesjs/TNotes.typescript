# [0120. 在泛型中使用类类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0120.%20%E5%9C%A8%E6%B3%9B%E5%9E%8B%E4%B8%AD%E4%BD%BF%E7%94%A8%E7%B1%BB%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是类类型？](#3--什么是类类型)
- [4. 🤔 构造函数类型](#4--构造函数类型)
  - [4.1. 基本构造函数类型](#41-基本构造函数类型)
  - [4.2. 带参数的构造函数](#42-带参数的构造函数)
  - [4.3. 使用 ConstructorParameters](#43-使用-constructorparameters)
  - [4.4. 抽象构造函数](#44-抽象构造函数)
- [5. 🤔 类类型参数](#5--类类型参数)
  - [5.1. 泛型类工厂](#51-泛型类工厂)
  - [5.2. 带约束的类类型](#52-带约束的类类型)
  - [5.3. 类类型的继承关系](#53-类类型的继承关系)
- [6. 🤔 工厂模式](#6--工厂模式)
  - [6.1. 简单工厂](#61-简单工厂)
  - [6.2. 单例工厂](#62-单例工厂)
  - [6.3. 注册工厂](#63-注册工厂)
  - [6.4. 抽象工厂](#64-抽象工厂)
- [7. 🤔 类的原型](#7--类的原型)
  - [7.1. 访问原型方法](#71-访问原型方法)
  - [7.2. 混入模式](#72-混入模式)
  - [7.3. 装饰器模式](#73-装饰器模式)
- [8. 🤔 常见使用场景](#8--常见使用场景)
  - [8.1. 场景 1：依赖注入容器](#81-场景-1依赖注入容器)
  - [8.2. 场景 2：对象池](#82-场景-2对象池)
  - [8.3. 场景 3：序列化器](#83-场景-3序列化器)
  - [8.4. 场景 4：ORM 模型](#84-场景-4orm-模型)
  - [8.5. 场景 5：插件系统](#85-场景-5插件系统)
  - [8.6. 场景 6：测试工具](#86-场景-6测试工具)
- [9. 🤔 常见错误和最佳实践](#9--常见错误和最佳实践)
  - [9.1. 错误 1：忘记 new 关键字](#91-错误-1忘记-new-关键字)
  - [9.2. 错误 2：类型断言不当](#92-错误-2类型断言不当)
  - [9.3. 错误 3：忽略构造函数参数](#93-错误-3忽略构造函数参数)
  - [9.4. 错误 4：混淆类和实例](#94-错误-4混淆类和实例)
  - [9.5. 最佳实践](#95-最佳实践)
- [10. 🔗 引用](#10--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 类类型的概念和表示
- 构造函数类型签名
- 使用类作为泛型参数
- 工厂函数和依赖注入
- 类的原型操作
- 实际应用场景

## 2. 🫧 评价

在泛型中使用类类型是指**将类本身（而不是实例）作为类型参数**使用。

类类型的特点：

- **构造函数类型**：使用 `new` 关键字表示
- **实例化能力**：可以通过类类型创建实例
- **类型推断**：自动推断实例类型
- **灵活创建**：支持工厂模式和依赖注入

类类型 vs 实例类型：

| 特性         | 类类型           | 实例类型     |
| ------------ | ---------------- | ------------ |
| **表示**     | 构造函数         | 对象实例     |
| **创建实例** | 可以             | 不可以       |
| **类型签名** | `new (...) => T` | `T`          |
| **使用场景** | 工厂、注入       | 普通操作     |
| **泛型表达** | `<T>`            | `<T>` 的实例 |

类类型的优势：

1. **动态实例化**：可以在运行时创建不同类的实例
2. **工厂模式**：实现灵活的对象创建
3. **依赖注入**：支持 IoC 容器
4. **原型操作**：访问类的原型链

理解类类型，能帮助你：

1. 实现高级设计模式
2. 构建灵活的框架
3. 实现依赖注入系统
4. 创建通用工厂函数

类类型是 TypeScript 面向对象编程的高级特性，是构建企业级应用的重要工具。

## 3. 🤔 什么是类类型？

类类型表示**类本身**，而不是类的实例，通常用于需要动态创建实例的场景。

```ts
// ✅ 类定义
class Person {
  constructor(public name: string, public age: number) {}

  greet(): string {
    return `Hello, I'm ${this.name}`
  }
}

// ❌ 这是实例类型
function processPerson(person: Person): void {
  console.log(person.greet())
}

// ✅ 这是类类型（构造函数类型）
function createInstance(ctor: typeof Person): Person {
  return new ctor('Alice', 30)
}

// ✅ 或使用泛型表示类类型
function createGeneric<T>(ctor: new (...args: any[]) => T): T {
  return new ctor()
}
```

**关键概念**：

- **typeof Class**：获取类的构造函数类型
- **new (...args) => T**：构造函数签名
- **实例化**：通过 `new` 创建实例
- **类型推断**：自动推断返回的实例类型

## 4. 🤔 构造函数类型

### 4.1. 基本构造函数类型

```ts
// ✅ 构造函数类型签名
interface Constructor<T = any> {
  new (...args: any[]): T
}

// 使用
class Animal {
  constructor(public name: string) {}
}

function createAnimal(ctor: Constructor<Animal>, name: string): Animal {
  return new ctor(name)
}

const dog = createAnimal(Animal, 'Buddy')
```

### 4.2. 带参数的构造函数

```ts
// ✅ 指定构造函数参数类型
interface ConstructorWithArgs<T, Args extends any[] = any[]> {
  new (...args: Args): T
}

class Person {
  constructor(public name: string, public age: number) {}
}

function create<T, Args extends any[]>(
  ctor: ConstructorWithArgs<T, Args>,
  ...args: Args
): T {
  return new ctor(...args)
}

const person = create(Person, 'Alice', 30) // Person
```

### 4.3. 使用 ConstructorParameters

```ts
// ✅ 使用内置工具类型
class User {
  constructor(public id: number, public name: string, public email: string) {}
}

function instantiate<T>(
  ctor: new (...args: any[]) => T,
  ...args: ConstructorParameters<typeof ctor>
): T {
  return new ctor(...args)
}

const user = instantiate(User, 1, 'Alice', 'alice@example.com')
```

### 4.4. 抽象构造函数

```ts
// ✅ 抽象类的构造函数
abstract class Shape {
  abstract area(): number
}

class Circle extends Shape {
  constructor(public radius: number) {
    super()
  }

  area(): number {
    return Math.PI * this.radius ** 2
  }
}

class Rectangle extends Shape {
  constructor(public width: number, public height: number) {
    super()
  }

  area(): number {
    return this.width * this.height
  }
}

// 只能实例化具体类
function createShape<T extends Shape>(
  ctor: new (...args: any[]) => T,
  ...args: any[]
): T {
  return new ctor(...args)
}

const circle = createShape(Circle, 5)
const rectangle = createShape(Rectangle, 4, 6)
```

## 5. 🤔 类类型参数

### 5.1. 泛型类工厂

```ts
// ✅ 接受类作为泛型参数
function createFactory<T>(ctor: new () => T) {
  return {
    create(): T {
      return new ctor()
    },
    createMany(count: number): T[] {
      return Array.from({ length: count }, () => new ctor())
    },
  }
}

class Product {
  id = 0
  name = 'Product'
}

const factory = createFactory(Product)
const product = factory.create() // Product
const products = factory.createMany(5) // Product[]
```

### 5.2. 带约束的类类型

```ts
// ✅ 约束类必须实现特定接口
interface Identifiable {
  id: number
}

class Entity implements Identifiable {
  constructor(public id: number, public name: string) {}
}

function createWithId<T extends Identifiable>(
  ctor: new (id: number, ...args: any[]) => T,
  id: number,
  ...args: any[]
): T {
  return new ctor(id, ...args)
}

const entity = createWithId(Entity, 1, 'Test')
```

### 5.3. 类类型的继承关系

```ts
// ✅ 确保类型继承关系
class Animal {
  constructor(public name: string) {}
  makeSound(): string {
    return 'Some sound'
  }
}

class Dog extends Animal {
  makeSound(): string {
    return 'Woof!'
  }
}

class Cat extends Animal {
  makeSound(): string {
    return 'Meow!'
  }
}

function createAnimal<T extends Animal>(
  ctor: new (name: string) => T,
  name: string
): T {
  return new ctor(name)
}

const dog = createAnimal(Dog, 'Buddy') // Dog
const cat = createAnimal(Cat, 'Whiskers') // Cat
```

## 6. 🤔 工厂模式

### 6.1. 简单工厂

```ts
// ✅ 简单工厂模式
class SimpleFactory {
  static create<T>(ctor: new (...args: any[]) => T, ...args: any[]): T {
    console.log(`Creating instance of ${ctor.name}`)
    return new ctor(...args)
  }
}

class User {
  constructor(public name: string) {}
}

const user = SimpleFactory.create(User, 'Alice')
```

### 6.2. 单例工厂

```ts
// ✅ 单例工厂
class Singleton {
  private static instances = new Map<any, any>()

  static getInstance<T>(ctor: new () => T): T {
    if (!this.instances.has(ctor)) {
      this.instances.set(ctor, new ctor())
    }
    return this.instances.get(ctor)
  }
}

class Config {
  setting = 'default'
}

const config1 = Singleton.getInstance(Config)
const config2 = Singleton.getInstance(Config)
console.log(config1 === config2) // true
```

### 6.3. 注册工厂

```ts
// ✅ 带注册机制的工厂
class Registry {
  private static types = new Map<string, new (...args: any[]) => any>()

  static register<T>(name: string, ctor: new (...args: any[]) => T): void {
    this.types.set(name, ctor)
  }

  static create<T>(name: string, ...args: any[]): T | undefined {
    const ctor = this.types.get(name)
    if (!ctor) {
      return undefined
    }
    return new ctor(...args) as T
  }
}

class EmailService {
  send(to: string, message: string): void {
    console.log(`Sending email to ${to}: ${message}`)
  }
}

class SmsService {
  send(to: string, message: string): void {
    console.log(`Sending SMS to ${to}: ${message}`)
  }
}

Registry.register('email', EmailService)
Registry.register('sms', SmsService)

const emailService = Registry.create<EmailService>('email')
const smsService = Registry.create<SmsService>('sms')
```

### 6.4. 抽象工厂

```ts
// ✅ 抽象工厂模式
interface Button {
  render(): string
}

interface Dialog {
  show(): string
}

class WindowsButton implements Button {
  render(): string {
    return 'Windows Button'
  }
}

class MacButton implements Button {
  render(): string {
    return 'Mac Button'
  }
}

class WindowsDialog implements Dialog {
  show(): string {
    return 'Windows Dialog'
  }
}

class MacDialog implements Dialog {
  show(): string {
    return 'Mac Dialog'
  }
}

interface GUIFactory {
  createButton(): Button
  createDialog(): Dialog
}

class WindowsFactory implements GUIFactory {
  createButton(): Button {
    return new WindowsButton()
  }

  createDialog(): Dialog {
    return new WindowsDialog()
  }
}

class MacFactory implements GUIFactory {
  createButton(): Button {
    return new MacButton()
  }

  createDialog(): Dialog {
    return new MacDialog()
  }
}

function createUI(factory: GUIFactory): void {
  const button = factory.createButton()
  const dialog = factory.createDialog()
  console.log(button.render(), dialog.show())
}

createUI(new WindowsFactory())
createUI(new MacFactory())
```

## 7. 🤔 类的原型

### 7.1. 访问原型方法

```ts
// ✅ 访问和操作原型
class Counter {
  count = 0

  increment(): void {
    this.count++
  }

  decrement(): void {
    this.count--
  }
}

function addLogging<T>(ctor: new () => T): void {
  const proto = ctor.prototype

  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key === 'constructor') continue

    const descriptor = Object.getOwnPropertyDescriptor(proto, key)
    if (descriptor && typeof descriptor.value === 'function') {
      const original = descriptor.value

      descriptor.value = function (this: any, ...args: any[]) {
        console.log(`Calling ${key} with`, args)
        return original.apply(this, args)
      }

      Object.defineProperty(proto, key, descriptor)
    }
  }
}

addLogging(Counter)

const counter = new Counter()
counter.increment() // 输出日志
```

### 7.2. 混入模式

```ts
// ✅ 类型安全的混入
type Constructor<T = {}> = new (...args: any[]) => T

function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = new Date()

    getTimestamp(): Date {
      return this.timestamp
    }
  }
}

function Identifiable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    id = Math.random()

    getId(): number {
      return this.id
    }
  }
}

class User {
  constructor(public name: string) {}
}

const TimestampedUser = Timestamped(User)
const IdentifiableUser = Identifiable(User)
const EnhancedUser = Timestamped(Identifiable(User))

const user = new EnhancedUser('Alice')
console.log(user.name)
console.log(user.getId())
console.log(user.getTimestamp())
```

### 7.3. 装饰器模式

```ts
// ✅ 类装饰器
function sealed<T extends Constructor>(ctor: T): T {
  Object.seal(ctor)
  Object.seal(ctor.prototype)
  return ctor
}

function logged<T extends Constructor>(ctor: T): T {
  return class extends ctor {
    constructor(...args: any[]) {
      console.log(`Creating instance of ${ctor.name}`)
      super(...args)
    }
  }
}

@logged
@sealed
class Service {
  execute(): void {
    console.log('Executing service')
  }
}
```

## 8. 🤔 常见使用场景

### 8.1. 场景 1：依赖注入容器

```ts
// ✅ 简单的 IoC 容器
class Container {
  private services = new Map<any, any>()

  register<T>(token: new (...args: any[]) => T, instance?: T): void {
    this.services.set(token, instance || new token())
  }

  resolve<T>(token: new (...args: any[]) => T): T {
    const instance = this.services.get(token)
    if (!instance) {
      throw new Error(`Service ${token.name} not registered`)
    }
    return instance
  }
}

class Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`)
  }
}

class UserService {
  constructor(private logger: Logger) {}

  createUser(name: string): void {
    this.logger.log(`Creating user: ${name}`)
  }
}

const container = new Container()
container.register(Logger)
container.register(UserService, new UserService(container.resolve(Logger)))

const userService = container.resolve(UserService)
userService.createUser('Alice')
```

### 8.2. 场景 2：对象池

```ts
// ✅ 对象池模式
class ObjectPool<T> {
  private available: T[] = []
  private inUse = new Set<T>()

  constructor(private ctor: new () => T, private maxSize: number = 10) {}

  acquire(): T {
    let obj = this.available.pop()

    if (!obj) {
      if (this.inUse.size < this.maxSize) {
        obj = new this.ctor()
      } else {
        throw new Error('Pool exhausted')
      }
    }

    this.inUse.add(obj)
    return obj
  }

  release(obj: T): void {
    if (this.inUse.has(obj)) {
      this.inUse.delete(obj)
      this.available.push(obj)
    }
  }

  clear(): void {
    this.available = []
    this.inUse.clear()
  }
}

class Connection {
  id = Math.random()

  connect(): void {
    console.log(`Connection ${this.id} established`)
  }

  disconnect(): void {
    console.log(`Connection ${this.id} closed`)
  }
}

const pool = new ObjectPool(Connection, 5)
const conn1 = pool.acquire()
const conn2 = pool.acquire()
pool.release(conn1)
```

### 8.3. 场景 3：序列化器

```ts
// ✅ 类型安全的序列化
interface Serializable {
  toJSON(): object
}

class Serializer {
  static serialize<T extends Serializable>(obj: T): string {
    return JSON.stringify(obj.toJSON())
  }

  static deserialize<T extends Serializable>(
    json: string,
    ctor: new (...args: any[]) => T
  ): T {
    const data = JSON.parse(json)
    return Object.assign(new ctor(), data)
  }
}

class User implements Serializable {
  constructor(
    public id: number = 0,
    public name: string = '',
    public email: string = ''
  ) {}

  toJSON(): object {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
    }
  }
}

const user = new User(1, 'Alice', 'alice@example.com')
const json = Serializer.serialize(user)
const restored = Serializer.deserialize(json, User)
```

### 8.4. 场景 4：ORM 模型

```ts
// ✅ 简单的 ORM 基类
abstract class Model {
  static tableName: string

  static async find<T extends Model>(
    this: new () => T,
    id: number
  ): Promise<T | null> {
    // 模拟数据库查询
    console.log(`SELECT * FROM ${this.name} WHERE id = ${id}`)
    return new this()
  }

  static async findAll<T extends Model>(this: new () => T): Promise<T[]> {
    console.log(`SELECT * FROM ${this.name}`)
    return [new this()]
  }

  async save(): Promise<void> {
    const tableName = (this.constructor as typeof Model).tableName
    console.log(`SAVE to ${tableName}`, this)
  }
}

class User extends Model {
  static tableName = 'users'

  id: number = 0
  name: string = ''
  email: string = ''
}

class Post extends Model {
  static tableName = 'posts'

  id: number = 0
  title: string = ''
  content: string = ''
}

async function example() {
  const user = await User.find(1)
  const users = await User.findAll()

  const post = new Post()
  post.title = 'Hello'
  await post.save()
}
```

### 8.5. 场景 5：插件系统

```ts
// ✅ 可扩展的插件系统
interface Plugin {
  name: string
  initialize(): void
  execute(): void
}

class PluginManager {
  private plugins = new Map<string, Plugin>()

  register<T extends Plugin>(ctor: new () => T): void {
    const plugin = new ctor()
    this.plugins.set(plugin.name, plugin)
    plugin.initialize()
  }

  get(name: string): Plugin | undefined {
    return this.plugins.get(name)
  }

  executeAll(): void {
    for (const plugin of this.plugins.values()) {
      plugin.execute()
    }
  }
}

class LoggingPlugin implements Plugin {
  name = 'logging'

  initialize(): void {
    console.log('Logging plugin initialized')
  }

  execute(): void {
    console.log('Logging plugin executed')
  }
}

class CachePlugin implements Plugin {
  name = 'cache'

  initialize(): void {
    console.log('Cache plugin initialized')
  }

  execute(): void {
    console.log('Cache plugin executed')
  }
}

const manager = new PluginManager()
manager.register(LoggingPlugin)
manager.register(CachePlugin)
manager.executeAll()
```

### 8.6. 场景 6：测试工具

```ts
// ✅ 测试对象创建器
class TestFactory {
  static create<T>(ctor: new (...args: any[]) => T, overrides?: Partial<T>): T {
    const instance = new ctor()
    if (overrides) {
      Object.assign(instance, overrides)
    }
    return instance
  }

  static createMany<T>(
    ctor: new (...args: any[]) => T,
    count: number,
    overrides?: Array<Partial<T>>
  ): T[] {
    return Array.from({ length: count }, (_, i) => {
      return this.create(ctor, overrides?.[i])
    })
  }
}

class User {
  id = 0
  name = 'Test User'
  email = 'test@example.com'
  active = true
}

// 测试中使用
const user = TestFactory.create(User, { name: 'Alice' })
const users = TestFactory.createMany(User, 3, [
  { name: 'Alice' },
  { name: 'Bob' },
  { name: 'Charlie' },
])
```

## 9. 🤔 常见错误和最佳实践

### 9.1. 错误 1：忘记 new 关键字

```ts
// ❌ 缺少 new 关键字
function create<T>(ctor: (...args: any[]) => T): T {
  // return ctor()  // ❌ 这不会创建实例
  return null as any
}

// ✅ 正确的构造函数类型
function create<T>(ctor: new (...args: any[]) => T): T {
  return new ctor()
}
```

### 9.2. 错误 2：类型断言不当

```ts
// ❌ 不安全的类型断言
function create<T>(ctor: any): T {
  return new ctor() as T // 危险
}

// ✅ 使用正确的类型
function create<T>(ctor: new () => T): T {
  return new ctor()
}
```

### 9.3. 错误 3：忽略构造函数参数

```ts
// ❌ 没有考虑构造函数参数
function create<T>(ctor: new () => T): T {
  return new ctor() // 如果构造函数需要参数会报错
}

// ✅ 接受任意参数
function create<T>(ctor: new (...args: any[]) => T, ...args: any[]): T {
  return new ctor(...args)
}
```

### 9.4. 错误 4：混淆类和实例

```ts
// ❌ 类型混淆
class User {
  name: string = ''
}

// 这是实例类型
function processUser(user: User): void {}

// 这是类类型
function createUser(ctor: typeof User): User {
  return new ctor()
}
```

### 9.5. 最佳实践

```ts
// ✅ 1. 定义清晰的构造函数类型
interface Constructor<T = any, Args extends any[] = any[]> {
  new (...args: Args): T
}

// ✅ 2. 使用约束确保类型安全
function createInstance<T extends object>(ctor: Constructor<T>): T {
  return new ctor()
}

// ✅ 3. 处理构造函数参数
function instantiate<T>(
  ctor: Constructor<T>,
  ...args: ConstructorParameters<Constructor<T>>
): T {
  return new ctor(...args)
}

// ✅ 4. 使用工厂封装复杂逻辑
class Factory {
  static cache = new Map<any, any>()

  static create<T>(ctor: Constructor<T>, useSingleton = false): T {
    if (useSingleton && this.cache.has(ctor)) {
      return this.cache.get(ctor)
    }

    const instance = new ctor()

    if (useSingleton) {
      this.cache.set(ctor, instance)
    }

    return instance
  }
}

// ✅ 5. 文档化类类型参数
/**
 * 创建类的实例
 * @template T - 要创建的类的实例类型
 * @param ctor - 类的构造函数
 * @returns 类的新实例
 */
function create<T>(ctor: Constructor<T>): T {
  return new ctor()
}

// ✅ 6. 使用混入增强功能
type GConstructor<T = {}> = new (...args: any[]) => T

function Timestamped<TBase extends GConstructor>(Base: TBase) {
  return class extends Base {
    timestamp = Date.now()
  }
}

// ✅ 7. 实现类型安全的注册表
class TypeRegistry {
  private types = new Map<string, Constructor>()

  register<T>(name: string, ctor: Constructor<T>): void {
    this.types.set(name, ctor)
  }

  create<T>(name: string, ...args: any[]): T {
    const ctor = this.types.get(name) as Constructor<T>
    if (!ctor) {
      throw new Error(`Type ${name} not registered`)
    }
    return new ctor(...args)
  }
}

// ✅ 8. 抽象工厂模式
abstract class AbstractFactory<T> {
  abstract create(...args: any[]): T

  createMany(count: number, ...args: any[]): T[] {
    return Array.from({ length: count }, () => this.create(...args))
  }
}

class UserFactory extends AbstractFactory<User> {
  create(name: string): User {
    return new User(name)
  }
}

// ✅ 9. 类型守卫
function isConstructor<T>(value: any): value is Constructor<T> {
  return typeof value === 'function' && value.prototype
}

// ✅ 10. 组合模式
class CompositeFactory<T> {
  private factories: Array<() => T> = []

  add(factory: () => T): void {
    this.factories.push(factory)
  }

  addConstructor(ctor: Constructor<T>, ...args: any[]): void {
    this.factories.push(() => new ctor(...args))
  }

  createAll(): T[] {
    return this.factories.map((factory) => factory())
  }
}
```

## 10. 🔗 引用

- [TypeScript Handbook - Generics][1]
- [TypeScript Handbook - Classes][2]
- [TypeScript Deep Dive - Classes][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/generics.html
[2]: https://www.typescriptlang.org/docs/handbook/2/classes.html
[3]: https://basarat.gitbook.io/typescript/future-javascript/classes
