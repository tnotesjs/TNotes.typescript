# [0216. ConstructorParameters](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0216.%20ConstructorParameters)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. `ConstructorParameters<T>` 是什么？](#3-constructorparameterst-是什么)
  - [3.1. 源码定义](#31-源码定义)
  - [3.2. 基本示例](#32-基本示例)
- [4. 如何使用 `ConstructorParameters<T>`？](#4-如何使用-constructorparameterst)
  - [4.1. 场景 1：工厂函数](#41-场景-1工厂函数)
  - [4.2. 场景 2：依赖注入容器](#42-场景-2依赖注入容器)
  - [4.3. 场景 3：对象池模式](#43-场景-3对象池模式)
- [5. `ConstructorParameters<T>` 的实际应用场景有哪些？](#5-constructorparameterst-的实际应用场景有哪些)
  - [5.1. 应用 1：测试工厂](#51-应用-1测试工厂)
  - [5.2. 应用 2：装饰器工厂](#52-应用-2装饰器工厂)
  - [5.3. 应用 3：ORM 模型工厂](#53-应用-3orm-模型工厂)
- [6. 使用 `ConstructorParameters<T>` 需要注意什么？](#6-使用-constructorparameterst-需要注意什么)
  - [6.1. 注意事项 1：抽象类](#61-注意事项-1抽象类)
  - [6.2. 注意事项 2：私有构造函数](#62-注意事项-2私有构造函数)
  - [6.3. 注意事项 3：默认参数](#63-注意事项-3默认参数)
  - [6.4. 注意事项 4：重载构造函数](#64-注意事项-4重载构造函数)
- [7. 引用](#7-引用)

<!-- endregion:toc -->

## 1. 本节内容

- `ConstructorParameters<T>` 的定义和实现
- 构造函数类型的提取
- 基本使用方法
- 实际应用场景

## 2. 评价

`ConstructorParameters<T>` 提取类构造函数的参数类型组成的元组。

- 专门用于类构造函数
- 与 `Parameters<T>` 类似但针对构造函数
- 常用于工厂模式和依赖注入
- 配合 `InstanceType<T>` 使用

## 3. `ConstructorParameters<T>` 是什么？

`ConstructorParameters<T>` 从类构造函数类型 `T` 中提取参数类型元组。

### 3.1. 源码定义

```ts
// TypeScript lib.es5.d.ts 中的定义
type ConstructorParameters<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: infer P) => any ? P : never
```

### 3.2. 基本示例

```ts
class User {
  constructor(public name: string, public age: number, public email?: string) {}
}

type UserParams = ConstructorParameters<typeof User>
// [name: string, age: number, email?: string]

// 使用
const params: UserParams = ['Alice', 25, 'alice@example.com']
const user = new User(...params)
```

## 4. 如何使用 `ConstructorParameters<T>`？

### 4.1. 场景 1：工厂函数

```ts
class Product {
  constructor(public id: number, public name: string, public price: number) {}
}

function createProduct(
  ...args: ConstructorParameters<typeof Product>
): Product {
  console.log('Creating product...')
  return new Product(...args)
}

const product = createProduct(1, 'iPhone', 999)
```

### 4.2. 场景 2：依赖注入容器

```ts
class Container {
  private instances = new Map<any, any>()

  register<T extends new (...args: any[]) => any>(
    Class: T,
    ...args: ConstructorParameters<T>
  ): void {
    this.instances.set(Class, new Class(...args))
  }

  resolve<T extends new (...args: any[]) => any>(Class: T): InstanceType<T> {
    return this.instances.get(Class)
  }
}

class Database {
  constructor(public connectionString: string) {}
}

const container = new Container()
container.register(Database, 'mongodb://localhost')
const db = container.resolve(Database)
```

### 4.3. 场景 3：对象池模式

```ts
class Connection {
  constructor(public host: string, public port: number) {}

  connect(): void {
    console.log(`Connecting to ${this.host}:${this.port}`)
  }
}

class ConnectionPool {
  private pool: Connection[] = []
  private params: ConstructorParameters<typeof Connection>

  constructor(...params: ConstructorParameters<typeof Connection>) {
    this.params = params
  }

  acquire(): Connection {
    if (this.pool.length > 0) {
      return this.pool.pop()!
    }
    return new Connection(...this.params)
  }

  release(connection: Connection): void {
    this.pool.push(connection)
  }
}

const pool = new ConnectionPool('localhost', 5432)
const conn = pool.acquire()
```

## 5. `ConstructorParameters<T>` 的实际应用场景有哪些？

### 5.1. 应用 1：测试工厂

```ts
class UserService {
  constructor(private apiUrl: string, private timeout: number = 5000) {}

  async getUser(id: number): Promise<any> {
    // 实现...
    return {}
  }
}

class ServiceFactory {
  static create<T extends new (...args: any[]) => any>(
    Service: T,
    ...args: ConstructorParameters<T>
  ): InstanceType<T> {
    return new Service(...args)
  }

  static createForTest<T extends new (...args: any[]) => any>(
    Service: T,
    overrides?: Partial<ConstructorParameters<T>>
  ): InstanceType<T> {
    const defaultArgs: ConstructorParameters<T> = [
      'http://test-api',
      1000,
    ] as ConstructorParameters<T>
    const args = overrides ? { ...defaultArgs, ...overrides } : defaultArgs
    return new Service(...(Object.values(args) as ConstructorParameters<T>))
  }
}

// 使用
const service = ServiceFactory.createForTest(UserService)
```

### 5.2. 应用 2：装饰器工厂

```ts
function Singleton<T extends new (...args: any[]) => any>(Class: T) {
  let instance: InstanceType<T> | null = null
  let savedArgs: ConstructorParameters<T> | null = null

  return class extends Class {
    constructor(...args: ConstructorParameters<T>) {
      if (instance) {
        return instance as any
      }
      super(...args)
      instance = this as InstanceType<T>
      savedArgs = args
    }

    static getInstance(): InstanceType<T> {
      if (!instance && savedArgs) {
        instance = new Class(...savedArgs) as InstanceType<T>
      }
      return instance!
    }
  }
}

@Singleton
class Config {
  constructor(public env: string) {}
}

const config1 = new Config('production')
const config2 = new Config('development')
console.log(config1 === config2) // true
```

### 5.3. 应用 3：ORM 模型工厂

```ts
abstract class Model {
  constructor(public id: number) {}
}

class User extends Model {
  constructor(id: number, public name: string, public email: string) {
    super(id)
  }
}

class ModelFactory {
  static createMany<T extends typeof Model>(
    ModelClass: T,
    count: number,
    generator: (index: number) => ConstructorParameters<T>
  ): Array<InstanceType<T>> {
    return Array.from(
      { length: count },
      (_, i) => new ModelClass(...generator(i))
    )
  }
}

const users = ModelFactory.createMany(User, 3, (i) => [
  i + 1,
  `User${i}`,
  `user${i}@example.com`,
])
```

## 6. 使用 `ConstructorParameters<T>` 需要注意什么？

### 6.1. 注意事项 1：抽象类

```ts
abstract class Animal {
  constructor(public name: string) {}
  abstract makeSound(): void
}

// ✅ ConstructorParameters 支持抽象类
type AnimalParams = ConstructorParameters<typeof Animal>
// [name: string]

// ❌ 但不能直接实例化抽象类
const animal = new Animal('Dog') // 错误
```

### 6.2. 注意事项 2：私有构造函数

```ts
class Singleton {
  private static instance: Singleton
  private constructor(private value: string) {}

  static getInstance(value: string): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton(value)
    }
    return Singleton.instance
  }
}

// ⚠️ 可以提取参数类型
type SingletonParams = ConstructorParameters<typeof Singleton>
// [value: string]

// ❌ 但不能从外部实例化
const s = new Singleton('test') // 错误：构造函数是私有的
```

### 6.3. 注意事项 3：默认参数

```ts
class Config {
  constructor(
    public env: string = 'development',
    public debug: boolean = false
  ) {}
}

type ConfigParams = ConstructorParameters<typeof Config>
// [env?: string, debug?: boolean]

// ✅ 可以省略参数
const config1 = new Config()
const config2 = new Config('production')
const config3 = new Config('production', true)
```

### 6.4. 注意事项 4：重载构造函数

```ts
class Point {
  constructor(x: number, y: number)
  constructor(coords: { x: number; y: number })
  constructor(xOrCoords: number | { x: number; y: number }, y?: number) {
    // 实现...
  }
}

// ⚠️ 只提取实现签名
type PointParams = ConstructorParameters<typeof Point>
// [xOrCoords: number | { x: number; y: number }, y?: number]
```

## 7. 引用

- [TypeScript Utility Types - ConstructorParameters][1]
- [TypeScript Handbook - Classes][2]
- [TypeScript Deep Dive - Constructor Parameters][3]

[1]: https://www.typescriptlang.org/docs/handbook/utility-types.html#constructorparameterstype
[2]: https://www.typescriptlang.org/docs/handbook/2/classes.html
[3]: https://basarat.gitbook.io/typescript/type-system/constructorparameters
