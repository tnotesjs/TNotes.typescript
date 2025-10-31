# [0095. 构造函数类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0095.%20%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是构造函数类型？](#3--什么是构造函数类型)
- [4. 🤔 如何声明构造函数类型？](#4--如何声明构造函数类型)
  - [4.1. 基本语法](#41-基本语法)
  - [4.2. 具体示例](#42-具体示例)
  - [4.3. 工厂函数示例](#43-工厂函数示例)
- [5. 🤔 构造函数类型的语法形式](#5--构造函数类型的语法形式)
  - [5.1. 类型别名形式](#51-类型别名形式)
  - [5.2. 接口形式](#52-接口形式)
  - [5.3. 类类型形式](#53-类类型形式)
- [6. 🤔 泛型构造函数类型](#6--泛型构造函数类型)
  - [6.1. 基本泛型构造函数](#61-基本泛型构造函数)
  - [6.2. 约束泛型参数](#62-约束泛型参数)
  - [6.3. 泛型约束实例类型](#63-泛型约束实例类型)
- [7. 🤔 typeof 与构造函数类型](#7--typeof-与构造函数类型)
  - [7.1. typeof 类名](#71-typeof-类名)
  - [7.2. 实例类型 vs 类类型](#72-实例类型-vs-类类型)
  - [7.3. InstanceType 工具类型](#73-instancetype-工具类型)
- [8. 🤔 常见使用场景](#8--常见使用场景)
  - [8.1. 场景 1：工厂模式](#81-场景-1工厂模式)
  - [8.2. 场景 2：Mixin 模式](#82-场景-2mixin-模式)
  - [8.3. 场景 3：依赖注入](#83-场景-3依赖注入)
  - [8.4. 场景 4：抽象工厂](#84-场景-4抽象工厂)
  - [8.5. 场景 5：装饰器工厂](#85-场景-5装饰器工厂)
  - [8.6. 场景 6：单例模式](#86-场景-6单例模式)
  - [8.7. 场景 7：对象池](#87-场景-7对象池)
- [9. 🤔 常见错误和最佳实践](#9--常见错误和最佳实践)
  - [9.1. 错误 1：忘记 new 关键字](#91-错误-1忘记-new-关键字)
  - [9.2. 错误 2：混淆类类型和实例类型](#92-错误-2混淆类类型和实例类型)
  - [9.3. 错误 3：泛型约束不当](#93-错误-3泛型约束不当)
  - [9.4. 最佳实践](#94-最佳实践)
- [10. 🔗 引用](#10--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 构造函数类型的定义
- new 签名语法
- 类类型与构造函数类型
- 泛型构造函数
- 工厂模式的类型定义
- 实际应用场景

## 2. 🫧 评价

构造函数类型（Constructor Type）用于描述**可以用 `new` 关键字调用的函数**，即**构造函数**的类型签名。

在 TypeScript 中，构造函数类型：

- 使用 `new` 关键字标识
- 描述类的构造函数签名
- 常用于工厂模式和依赖注入
- 可以结合泛型使用

理解构造函数类型，能帮助你：

1. 定义工厂函数的参数类型
2. 实现依赖注入容器
3. 编写类型安全的框架代码
4. 处理动态类实例化

构造函数类型是 TypeScript 高级类型系统的重要组成部分，是编写框架和库的必备知识。

## 3. 🤔 什么是构造函数类型？

构造函数类型描述一个可以用 `new` 关键字实例化的函数。

```ts
// 类定义
class User {
  constructor(public name: string, public age: number) {}
}

// 构造函数类型
type UserConstructor = new (name: string, age: number) => User

// 使用
const createUser: UserConstructor = User
const user = new createUser('Alice', 25)
```

**关键概念**：

- **new 签名**：表示可以用 `new` 调用
- **参数类型**：构造函数的参数
- **返回类型**：实例类型
- **类类型**：类本身的类型

## 4. 🤔 如何声明构造函数类型？

### 4.1. 基本语法

```ts
// 语法 1：使用 new 关键字
type Constructor = new (...args: any[]) => any

// 语法 2：使用接口
interface Constructor {
  new (...args: any[]): any
}
```

### 4.2. 具体示例

```ts
// ✅ 声明特定类的构造函数类型
class Point {
  constructor(public x: number, public y: number) {}
}

type PointConstructor = new (x: number, y: number) => Point

// 使用
const createPoint: PointConstructor = Point
const p = new createPoint(10, 20)

// ✅ 使用接口声明
interface PointConstructor {
  new (x: number, y: number): Point
}

const PointClass: PointConstructor = Point
```

### 4.3. 工厂函数示例

```ts
// ✅ 工厂函数接收构造函数类型
function createInstance<T>(Constructor: new () => T): T {
  return new Constructor()
}

class User {
  name = 'Anonymous'
}

const user = createInstance(User) // 类型：User
console.log(user.name) // 'Anonymous'
```

## 5. 🤔 构造函数类型的语法形式

### 5.1. 类型别名形式

```ts
// ✅ 使用 type 定义
type Constructor<T = any> = new (...args: any[]) => T

// 具体类型
type UserConstructor = new (name: string, age: number) => User
type PointConstructor = new (x: number, y: number) => Point

// 使用
function create<T>(Ctor: Constructor<T>): T {
  return new Ctor()
}
```

### 5.2. 接口形式

```ts
// ✅ 使用 interface 定义
interface Constructor<T = any> {
  new (...args: any[]): T
}

// 具体接口
interface UserConstructor {
  new (name: string, age: number): User
}

// 使用
const UserClass: UserConstructor = User
```

### 5.3. 类类型形式

```ts
// ✅ 使用 typeof 获取类类型
class User {
  constructor(public name: string) {}
}

// typeof User 是构造函数类型
function createUser(Ctor: typeof User): User {
  return new Ctor('Alice')
}

createUser(User) // ✅
```

## 6. 🤔 泛型构造函数类型

### 6.1. 基本泛型构造函数

```ts
// ✅ 泛型构造函数类型
type Constructor<T> = new (...args: any[]) => T

function getInstance<T>(Ctor: Constructor<T>): T {
  return new Ctor()
}

class User {
  name = 'User'
}

class Product {
  title = 'Product'
}

const user = getInstance(User) // 类型：User
const product = getInstance(Product) // 类型：Product
```

### 6.2. 约束泛型参数

```ts
// ✅ 约束构造函数参数
type Constructor<T> = new (name: string) => T

class User {
  constructor(public name: string) {}
}

class Product {
  constructor(public name: string) {}
}

function create<T>(Ctor: Constructor<T>, name: string): T {
  return new Ctor(name)
}

create(User, 'Alice') // ✅
create(Product, 'iPhone') // ✅
```

### 6.3. 泛型约束实例类型

```ts
// ✅ 约束实例必须有特定属性
interface Named {
  name: string
}

type NamedConstructor<T extends Named> = new (...args: any[]) => T

function createNamed<T extends Named>(Ctor: NamedConstructor<T>): T {
  const instance = new Ctor()
  console.log(instance.name) // ✅ 保证有 name 属性
  return instance
}

class User implements Named {
  name = 'User'
}

createNamed(User) // ✅
```

## 7. 🤔 typeof 与构造函数类型

### 7.1. typeof 类名

```ts
// ✅ typeof 获取类的构造函数类型
class User {
  constructor(public name: string, public age: number) {}

  greet() {
    return `Hello, ${this.name}`
  }
}

// typeof User 是构造函数类型
type UserClass = typeof User

// 等价于
type UserClass = new (name: string, age: number) => User

// 使用
function createUser(Ctor: typeof User, name: string, age: number): User {
  return new Ctor(name, age)
}
```

### 7.2. 实例类型 vs 类类型

```ts
class User {
  constructor(public name: string) {}
}

// 实例类型
type UserInstance = User

// 类类型（构造函数类型）
type UserClass = typeof User

// 使用
const user: UserInstance = new User('Alice') // 实例
const UserConstructor: UserClass = User // 构造函数

// 工厂函数
function factory(Ctor: UserClass): UserInstance {
  return new Ctor('Bob')
}
```

### 7.3. InstanceType 工具类型

```ts
// ✅ InstanceType<T> 获取构造函数的实例类型
class User {
  constructor(public name: string) {}
}

type UserClass = typeof User
type UserInstance = InstanceType<UserClass> // User

// 等价于
type UserInstance = User
```

## 8. 🤔 常见使用场景

### 8.1. 场景 1：工厂模式

```ts
// ✅ 通用工厂函数
type Constructor<T> = new (...args: any[]) => T

class Container {
  private instances = new Map<Constructor<any>, any>()

  register<T>(Ctor: Constructor<T>): void {
    this.instances.set(Ctor, new Ctor())
  }

  resolve<T>(Ctor: Constructor<T>): T {
    return this.instances.get(Ctor)
  }
}

// 使用
class UserService {
  getUsers() {
    return ['Alice', 'Bob']
  }
}

const container = new Container()
container.register(UserService)
const service = container.resolve(UserService)
console.log(service.getUsers())
```

### 8.2. 场景 2：Mixin 模式

```ts
// ✅ Mixin 构造函数类型
type Constructor<T = {}> = new (...args: any[]) => T

function Timestamped<T extends Constructor>(Base: T) {
  return class extends Base {
    timestamp = Date.now()
  }
}

function Tagged<T extends Constructor>(Base: T) {
  return class extends Base {
    tag = 'default'
  }
}

// 使用
class User {
  constructor(public name: string) {}
}

const TaggedUser = Tagged(User)
const TimestampedUser = Timestamped(User)
const BothUser = Timestamped(Tagged(User))

const user = new BothUser('Alice')
console.log(user.name, user.tag, user.timestamp)
```

### 8.3. 场景 3：依赖注入

```ts
// ✅ 依赖注入容器
type Constructor<T> = new (...args: any[]) => T

class Injector {
  private providers = new Map<Constructor<any>, any>()

  provide<T>(token: Constructor<T>, instance: T): void {
    this.providers.set(token, instance)
  }

  inject<T>(token: Constructor<T>): T {
    const instance = this.providers.get(token)
    if (!instance) {
      throw new Error(`No provider for ${token.name}`)
    }
    return instance
  }
}

// 使用
class Database {
  query(sql: string) {
    return []
  }
}

class UserService {
  constructor(private db: Database) {}

  getUsers() {
    return this.db.query('SELECT * FROM users')
  }
}

const injector = new Injector()
injector.provide(Database, new Database())
injector.provide(UserService, new UserService(injector.inject(Database)))

const userService = injector.inject(UserService)
```

### 8.4. 场景 4：抽象工厂

```ts
// ✅ 抽象工厂模式
interface Product {
  operation(): string
}

class ConcreteProductA implements Product {
  operation() {
    return 'Product A'
  }
}

class ConcreteProductB implements Product {
  operation() {
    return 'Product B'
  }
}

type ProductConstructor = new () => Product

class Factory {
  createProduct(Ctor: ProductConstructor): Product {
    return new Ctor()
  }
}

// 使用
const factory = new Factory()
const productA = factory.createProduct(ConcreteProductA)
const productB = factory.createProduct(ConcreteProductB)
```

### 8.5. 场景 5：装饰器工厂

```ts
// ✅ 类装饰器
type Constructor<T = {}> = new (...args: any[]) => T

function sealed<T extends Constructor>(constructor: T) {
  Object.seal(constructor)
  Object.seal(constructor.prototype)
}

@sealed
class User {
  constructor(public name: string) {}
}

// ✅ 装饰器工厂
function logger<T extends Constructor>(Base: T) {
  return class extends Base {
    constructor(...args: any[]) {
      console.log('Creating instance:', Base.name)
      super(...args)
    }
  }
}

@logger
class Product {
  constructor(public name: string) {}
}

const product = new Product('iPhone') // 输出: Creating instance: Product
```

### 8.6. 场景 6：单例模式

```ts
// ✅ 单例工厂
type Constructor<T> = new (...args: any[]) => T

function singleton<T>(Ctor: Constructor<T>): Constructor<T> {
  let instance: T

  return new Proxy(Ctor, {
    construct(target, args) {
      if (!instance) {
        instance = new target(...args)
      }
      return instance
    },
  })
}

// 使用
class Database {
  constructor(public url: string) {}
}

const SingletonDatabase = singleton(Database)

const db1 = new SingletonDatabase('mongodb://localhost')
const db2 = new SingletonDatabase('mongodb://localhost')

console.log(db1 === db2) // true
```

### 8.7. 场景 7：对象池

```ts
// ✅ 对象池
type Constructor<T> = new (...args: any[]) => T

class ObjectPool<T> {
  private pool: T[] = []

  constructor(private Ctor: Constructor<T>, private size: number) {
    for (let i = 0; i < size; i++) {
      this.pool.push(new Ctor())
    }
  }

  acquire(): T {
    return this.pool.pop() || new this.Ctor()
  }

  release(obj: T): void {
    this.pool.push(obj)
  }
}

// 使用
class Connection {
  connect() {
    console.log('Connected')
  }
}

const pool = new ObjectPool(Connection, 10)
const conn = pool.acquire()
conn.connect()
pool.release(conn)
```

## 9. 🤔 常见错误和最佳实践

### 9.1. 错误 1：忘记 new 关键字

```ts
// ❌ 缺少 new 关键字
type Bad = (...args: any[]) => any

// ✅ 使用 new 关键字
type Good = new (...args: any[]) => any
```

### 9.2. 错误 2：混淆类类型和实例类型

```ts
class User {
  constructor(public name: string) {}
}

// ❌ User 是实例类型，不是构造函数类型
function bad(Ctor: User) {
  return new Ctor('Alice') // Error
}

// ✅ typeof User 是构造函数类型
function good(Ctor: typeof User) {
  return new Ctor('Alice')
}
```

### 9.3. 错误 3：泛型约束不当

```ts
// ❌ 泛型没有约束
function bad<T>(Ctor: T) {
  return new Ctor() // Error: 'new' expression, whose target lacks a construct signature
}

// ✅ 使用构造函数类型约束
function good<T>(Ctor: new () => T): T {
  return new Ctor()
}
```

### 9.4. 最佳实践

```ts
// ✅ 1. 使用泛型构造函数类型
type Constructor<T> = new (...args: any[]) => T

function create<T>(Ctor: Constructor<T>): T {
  return new Ctor()
}

// ✅ 2. 约束构造函数参数
type Constructor<T> = new (name: string) => T

function createNamed<T>(Ctor: Constructor<T>, name: string): T {
  return new Ctor(name)
}

// ✅ 3. 约束实例类型
interface Base {
  id: number
}

type BaseConstructor<T extends Base> = new (...args: any[]) => T

// ✅ 4. 使用 typeof 获取类类型
class User {
  constructor(public name: string) {}
}

function factory(Ctor: typeof User): User {
  return new Ctor('Alice')
}

// ✅ 5. 为工厂函数提供类型
function createInstance<T>(
  Ctor: new () => T,
  initializer?: (instance: T) => void
): T {
  const instance = new Ctor()
  if (initializer) {
    initializer(instance)
  }
  return instance
}

// ✅ 6. 使用 InstanceType 工具类型
type UserClass = typeof User
type UserInstance = InstanceType<UserClass>

// ✅ 7. 支持抽象类
abstract class Animal {
  abstract makeSound(): string
}

type AnimalConstructor = new () => Animal

// ✅ 8. 文档化构造函数类型
/**
 * 创建类的实例
 * @param Ctor - 类的构造函数
 * @returns 类的实例
 */
function create<T>(Ctor: new () => T): T {
  return new Ctor()
}

// ✅ 9. 处理构造函数重载
class User {
  constructor(name: string)
  constructor(name: string, age: number)
  constructor(public name: string, public age?: number) {}
}

type UserConstructor =
  | (new (name: string) => User)
  | (new (name: string, age: number) => User)

// ✅ 10. 使用条件类型增强灵活性
type Constructor<T, Args extends any[] = any[]> = new (...args: Args) => T

function create<T, Args extends any[]>(
  Ctor: Constructor<T, Args>,
  ...args: Args
): T {
  return new Ctor(...args)
}
```

## 10. 🔗 引用

- [TypeScript Handbook - Classes][1]
- [TypeScript Handbook - Generics][2]
- [TypeScript Deep Dive - Mixins][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/classes.html
[2]: https://www.typescriptlang.org/docs/handbook/2/generics.html
[3]: https://basarat.gitbook.io/typescript/type-system/mixins
