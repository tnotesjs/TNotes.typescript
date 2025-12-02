# [0217. InstanceType T](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0217.%20InstanceType%20T)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 `InstanceType<T>` 的源码实现是什么？](#3--instancetypet-的源码实现是什么)
- [4. 🤔 如何使用 `InstanceType<T>` 提取类的实例类型？](#4--如何使用-instancetypet-提取类的实例类型)
- [5. 🤔 `InstanceType<T>` 在工厂模式中如何应用？](#5--instancetypet-在工厂模式中如何应用)
- [6. 🤔 `InstanceType<T>` 在依赖注入中如何使用？](#6--instancetypet-在依赖注入中如何使用)
- [7. 🤔 使用 `InstanceType<T>` 时需要注意哪些问题？](#7--使用-instancetypet-时需要注意哪些问题)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- `InstanceType<T>` 的源码实现
- 类实例类型的提取
- 工厂函数的返回类型
- 依赖注入容器的类型推断
- 抽象类的实例类型处理

## 2. 🫧 评价

`InstanceType<T>` 用于从构造函数类型中提取实例类型，与 `ConstructorParameters<T>` 配合使用可以完整描述类的类型信息。

## 3. 🤔 `InstanceType<T>` 的源码实现是什么？

- 在工厂模式中，常用于推断工厂函数的返回类型
- 在依赖注入容器中，用于类型安全的实例解析
- 与 `typeof` 配合使用时需要注意类型和值的区别
- 对于泛型类，`InstanceType<T>` 会丢失泛型参数信息
- 抽象类可以提取实例类型，但不能直接实例化

`InstanceType<T>` 的源码定义如下：

```ts
type InstanceType<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: any) => infer R ? R : any
```

**实现原理：**

1. 泛型约束：`T extends abstract new (...args: any) => any` 确保 `T` 是构造函数类型
2. 条件类型：使用 `T extends ... => infer R` 提取构造函数的返回类型
3. 推断变量：`infer R` 捕获实例类型
4. 兜底类型：如果不匹配，返回 `any`

```ts
// 基本使用
class User {
  constructor(public id: number, public name: string) {}

  greet() {
    return `Hello, ${this.name}`
  }
}

// 提取实例类型
type UserInstance = InstanceType<typeof User>
// 等价于 User 类型

// 验证类型
const user: UserInstance = new User(1, 'Alice')
console.log(user.greet()) // ✅ 可以访问实例方法

// ❌ 错误：typeof User 是构造函数类型，不是实例类型
const wrongUser: typeof User = new User(1, 'Alice')
```

**与 `ConstructorParameters<T>` 的关系：**

```ts
class Product {
  constructor(public id: number, public name: string, public price: number) {}
}

// 提取构造函数参数
type ProductParams = ConstructorParameters<typeof Product>
// [id: number, name: string, price: number]

// 提取实例类型
type ProductInstance = InstanceType<typeof Product>
// Product

// 完整的类型描述
function createProduct(...args: ProductParams): ProductInstance {
  return new Product(...args)
}

const product = createProduct(1, 'Laptop', 999) // ✅ 类型安全
console.log(product.id) // ✅ 可以访问实例属性
```

## 4. 🤔 如何使用 `InstanceType<T>` 提取类的实例类型？

在需要引用类的实例类型但不直接使用类名的场景中，`InstanceType<T>` 非常有用：

```ts
// 场景 1：泛型工厂函数
class Database {
  constructor(public connectionString: string) {}

  connect() {
    console.log(`Connecting to ${this.connectionString}`)
  }
}

class Cache {
  constructor(public ttl: number) {}

  set(key: string, value: any) {
    console.log(`Setting ${key} with TTL ${this.ttl}`)
  }
}

// 泛型工厂函数
function createService<T extends new (...args: any) => any>(
  ServiceClass: T,
  ...args: ConstructorParameters<T>
): InstanceType<T> {
  return new ServiceClass(...args)
}

// ✅ 类型推断正确
const db = createService(Database, 'localhost:5432')
db.connect() // ✅ 可以调用方法

const cache = createService(Cache, 3600)
cache.set('key', 'value') // ✅ 可以调用方法

// 场景 2：类型映射
type ServiceMap = {
  database: typeof Database
  cache: typeof Cache
}

// 将构造函数类型映射为实例类型
type ServiceInstanceMap = {
  [K in keyof ServiceMap]: InstanceType<ServiceMap[K]>
}

// ServiceInstanceMap = {
//   database: Database;
//   cache: Cache;
// }

const services: ServiceInstanceMap = {
  database: new Database('localhost'),
  cache: new Cache(3600),
}

// 场景 3：抽象类的实例类型
abstract class Shape {
  abstract area(): number

  describe() {
    return `Area: ${this.area()}`
  }
}

class Circle extends Shape {
  constructor(public radius: number) {
    super()
  }

  area() {
    return Math.PI * this.radius ** 2
  }
}

// ✅ 可以提取抽象类的实例类型
type ShapeInstance = InstanceType<typeof Shape>

// ✅ 实际使用具体类的实例
const shape: ShapeInstance = new Circle(5)
console.log(shape.describe())

// 场景 4：联合类型的实例提取
type AnimalConstructor = typeof Dog | typeof Cat

class Dog {
  bark() {
    console.log('Woof!')
  }
}

class Cat {
  meow() {
    console.log('Meow!')
  }
}

// 提取联合类型的实例
type AnimalInstance = InstanceType<AnimalConstructor>
// Dog | Cat

function getAnimal(type: 'dog' | 'cat'): AnimalInstance {
  return type === 'dog' ? new Dog() : new Cat()
}

const animal = getAnimal('dog')
if (animal instanceof Dog) {
  animal.bark() // ✅ 类型收窄
}
```

## 5. 🤔 `InstanceType<T>` 在工厂模式中如何应用？

在工厂模式中，`InstanceType<T>` 用于类型安全的实例创建：

```ts
// 应用 1：抽象工厂
abstract class Vehicle {
  abstract startEngine(): void
}

class Car extends Vehicle {
  constructor(public model: string) {
    super()
  }

  startEngine() {
    console.log(`${this.model} engine started`)
  }
}

class Motorcycle extends Vehicle {
  constructor(public brand: string) {
    super()
  }

  startEngine() {
    console.log(`${this.brand} engine started`)
  }
}

// 工厂类型
type VehicleFactory<T extends new (...args: any) => Vehicle> = {
  create(...args: ConstructorParameters<T>): InstanceType<T>
}

// 实现工厂
function createVehicleFactory<T extends new (...args: any) => Vehicle>(
  VehicleClass: T
): VehicleFactory<T> {
  return {
    create(...args: ConstructorParameters<T>): InstanceType<T> {
      return new VehicleClass(...args)
    },
  }
}

const carFactory = createVehicleFactory(Car)
const car = carFactory.create('Tesla Model 3') // ✅ 类型为 Car
car.startEngine()

const motorcycleFactory = createVehicleFactory(Motorcycle)
const motorcycle = motorcycleFactory.create('Harley') // ✅ 类型为 Motorcycle
motorcycle.startEngine()

// 应用 2：单例工厂
class Singleton {
  private static instances = new Map<any, any>()

  static getInstance<T extends new (...args: any) => any>(
    Class: T,
    ...args: ConstructorParameters<T>
  ): InstanceType<T> {
    if (!this.instances.has(Class)) {
      this.instances.set(Class, new Class(...args))
    }
    return this.instances.get(Class)
  }
}

class Config {
  constructor(public env: string) {}
}

const config1 = Singleton.getInstance(Config, 'production')
const config2 = Singleton.getInstance(Config, 'development')
console.log(config1 === config2) // true，单例模式

// 应用 3：对象池工厂
class ObjectPool<T extends new (...args: any) => any> {
  private pool: InstanceType<T>[] = []

  constructor(private Class: T, private createArgs: ConstructorParameters<T>) {}

  acquire(): InstanceType<T> {
    if (this.pool.length > 0) {
      return this.pool.pop()!
    }
    return new this.Class(...this.createArgs)
  }

  release(instance: InstanceType<T>) {
    this.pool.push(instance)
  }
}

class Connection {
  constructor(public url: string) {}

  query(sql: string) {
    console.log(`Query: ${sql}`)
  }
}

const connectionPool = new ObjectPool(Connection, ['localhost:5432'])
const conn = connectionPool.acquire() // ✅ 类型为 Connection
conn.query('SELECT * FROM users')
connectionPool.release(conn)
```

## 6. 🤔 `InstanceType<T>` 在依赖注入中如何使用？

在依赖注入容器中，`InstanceType<T>` 用于类型安全的服务解析：

```ts
// 应用 1：简单的依赖注入容器
class Container {
  private services = new Map<any, any>()

  // 注册服务
  register<T extends new (...args: any) => any>(
    token: T,
    factory: () => InstanceType<T>
  ): void {
    this.services.set(token, factory)
  }

  // 解析服务
  resolve<T extends new (...args: any) => any>(token: T): InstanceType<T> {
    const factory = this.services.get(token)
    if (!factory) {
      throw new Error(`Service not registered: ${token.name}`)
    }
    return factory()
  }
}

// 服务类
class Logger {
  log(message: string) {
    console.log(`[LOG] ${message}`)
  }
}

class UserService {
  constructor(private logger: Logger) {}

  getUser(id: number) {
    this.logger.log(`Getting user ${id}`)
    return { id, name: 'Alice' }
  }
}

// 使用容器
const container = new Container()

container.register(Logger, () => new Logger())
container.register(
  UserService,
  () => new UserService(container.resolve(Logger))
)

const userService = container.resolve(UserService) // ✅ 类型为 UserService
userService.getUser(1)

// 应用 2：带有作用域的依赖注入
type Scope = 'singleton' | 'transient'

class ScopedContainer {
  private singletons = new Map<any, any>()
  private factories = new Map<any, { factory: Function; scope: Scope }>()

  register<T extends new (...args: any) => any>(
    token: T,
    factory: () => InstanceType<T>,
    scope: Scope = 'singleton'
  ): void {
    this.factories.set(token, { factory, scope })
  }

  resolve<T extends new (...args: any) => any>(token: T): InstanceType<T> {
    const registration = this.factories.get(token)
    if (!registration) {
      throw new Error(`Service not registered: ${token.name}`)
    }

    if (registration.scope === 'singleton') {
      if (!this.singletons.has(token)) {
        this.singletons.set(token, registration.factory())
      }
      return this.singletons.get(token)
    }

    return registration.factory()
  }
}

// 应用 3：自动依赖解析
class AutoContainer {
  private instances = new Map<any, any>()

  resolve<T extends new (...args: any) => any>(Class: T): InstanceType<T> {
    if (this.instances.has(Class)) {
      return this.instances.get(Class)
    }

    // ⚠️ 简化示例，实际需要使用反射获取依赖
    const instance = new Class()
    this.instances.set(Class, instance)
    return instance
  }

  // 批量解析
  resolveAll<T extends new (...args: any) => any>(
    Classes: T[]
  ): InstanceType<T>[] {
    return Classes.map((Class) => this.resolve(Class))
  }
}

class EmailService {
  send(to: string, message: string) {
    console.log(`Sending email to ${to}: ${message}`)
  }
}

class NotificationService {
  notify(userId: number) {
    console.log(`Notifying user ${userId}`)
  }
}

const autoContainer = new AutoContainer()
const [emailService, notificationService] = autoContainer.resolveAll([
  EmailService,
  NotificationService,
])

emailService.send('user@example.com', 'Hello') // ✅ 类型安全
notificationService.notify(1)
```

## 7. 🤔 使用 `InstanceType<T>` 时需要注意哪些问题？

在使用 `InstanceType<T>` 时，有以下几点需要注意：

```ts
// 注意 1：必须使用 typeof 获取构造函数类型
class User {
  constructor(public name: string) {}
}

// ❌ 错误：User 是实例类型，不是构造函数类型
type WrongType = InstanceType<User>

// ✅ 正确：typeof User 是构造函数类型
type CorrectType = InstanceType<typeof User>

// 注意 2：泛型类会丢失泛型参数
class Box<T> {
  constructor(public value: T) {}
}

// ⚠️ 泛型参数会丢失，T 变为 unknown
type BoxInstance = InstanceType<typeof Box>
// Box<unknown>

// ✅ 需要显式指定泛型参数
type NumberBox = InstanceType<typeof Box<number>>
// ❌ 这样写是错误的，typeof Box 已经是构造函数类型

// 正确的做法是直接使用类型
type NumberBox2 = Box<number>

// 注意 3：抽象类可以提取类型但不能实例化
abstract class Animal {
  abstract makeSound(): void
}

class Dog extends Animal {
  makeSound() {
    console.log('Woof!')
  }
}

// ✅ 可以提取抽象类的实例类型
type AnimalInstance = InstanceType<typeof Animal>

// ❌ 但不能直接实例化抽象类
const animal = new Animal() // Error

// ✅ 需要使用具体类
const dog: AnimalInstance = new Dog()

// 注意 4：接口不能使用 InstanceType<T>
interface IUser {
  name: string
}

// ❌ 错误：接口不是构造函数类型
type UserFromInterface = InstanceType<IUser>

// ✅ 接口直接使用即可
type UserType = IUser

// 注意 5：函数类型不适用
function createUser(name: string) {
  return { name }
}

// ❌ 错误：普通函数不是构造函数
type UserFromFunction = InstanceType<typeof createUser>

// ✅ 应该使用 ReturnType<T>
type CorrectUserType = ReturnType<typeof createUser>

// 注意 6：构造签名的使用
type Constructor<T = any> = new (...args: any[]) => T

function createInstance<T>(ctor: Constructor<T>): T {
  return new ctor()
}

// ✅ 此时不需要 InstanceType，泛型 T 已经是实例类型
const user = createInstance(User)

// 注意 7：与联合类型一起使用
class Cat {
  meow() {}
}

class Dog2 {
  bark() {}
}

type PetConstructor = typeof Cat | typeof Dog2
type PetInstance = InstanceType<PetConstructor>
// Cat | Dog2

// ⚠️ 需要类型收窄才能调用具体方法
function playWithPet(pet: PetInstance) {
  // ❌ 错误：联合类型上不存在 meow
  pet.meow()

  // ✅ 需要类型守卫
  if (pet instanceof Cat) {
    pet.meow()
  }
}
```

**常见陷阱和解决方案：**

```ts
// 陷阱 1：在泛型约束中使用
function processClass<T extends new (...args: any) => any>(
  Class: T
): InstanceType<T> {
  // ✅ 这样可以工作
  return new Class()
}

// 陷阱 2：与条件类型结合
type IsClass<T> = T extends new (...args: any) => any ? InstanceType<T> : never

class MyClass {}
type Result1 = IsClass<typeof MyClass> // MyClass
type Result2 = IsClass<string> // never

// 陷阱 3：私有构造函数
class PrivateConstructor {
  private constructor() {}

  static create() {
    return new PrivateConstructor()
  }
}

// ⚠️ 可以提取类型，但不能直接实例化
type PrivateInstance = InstanceType<typeof PrivateConstructor>
const instance1 = new PrivateConstructor() // ❌ Error
const instance2 = PrivateConstructor.create() // ✅ 通过静态方法创建
```

## 8. 🔗 引用

- [TypeScript Handbook - Utility Types - InstanceType][1]
- [TypeScript 源码 - InstanceType 实现][2]
- [Understanding InstanceType in TypeScript][3]

[1]: https://www.typescriptlang.org/docs/handbook/utility-types.html#instancetypetype
[2]: https://github.com/microsoft/TypeScript/blob/main/src/lib/es5.d.ts
[3]: https://www.totaltypescript.com/concepts/instance-type
