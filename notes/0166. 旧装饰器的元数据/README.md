# [0166. 旧装饰器的元数据](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0166.%20%E6%97%A7%E8%A3%85%E9%A5%B0%E5%99%A8%E7%9A%84%E5%85%83%E6%95%B0%E6%8D%AE)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是装饰器元数据？](#3--什么是装饰器元数据)
  - [3.1. 配置元数据](#31-配置元数据)
- [4. 🤔 如何使用设计时类型元数据？](#4--如何使用设计时类型元数据)
  - [4.1. design:type（属性类型）](#41-designtype属性类型)
  - [4.2. design:paramtypes（参数类型）](#42-designparamtypes参数类型)
  - [4.3. design:returntype（返回类型）](#43-designreturntype返回类型)
- [5. 🤔 如何自定义元数据？](#5--如何自定义元数据)
  - [5.1. 基本使用](#51-基本使用)
  - [5.2. 多个元数据](#52-多个元数据)
- [6. 🤔 元数据的实际应用场景有哪些？](#6--元数据的实际应用场景有哪些)
  - [6.1. 依赖注入](#61-依赖注入)
  - [6.2. ORM 字段映射](#62-orm-字段映射)
  - [6.3. 验证器](#63-验证器)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 装饰器元数据的概念
- 设计时类型元数据的使用
- 自定义元数据的存储和读取
- 元数据在依赖注入中的应用
- 元数据在 ORM 中的应用

## 2. 🫧 评价

装饰器元数据是旧装饰器（Stage 2）的重要特性，支持运行时反射。

- 元数据需要 `emitDecoratorMetadata: true` 和 `reflect-metadata` 库
- TypeScript 可以自动生成三种设计时类型元数据
- 元数据是 Angular、NestJS 等框架实现依赖注入的基础
- 新装饰器（Stage 3）不支持元数据，需要等待新的元数据提案
- 理解元数据机制有助于深入掌握框架的实现原理

## 3. 🤔 什么是装饰器元数据？

装饰器元数据是附加在类、方法、属性上的类型信息，可以在运行时读取。

### 3.1. 配置元数据

```ts
// tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true  // 启用元数据支持
  }
}
```

```ts
// 安装 reflect-metadata
// npm install reflect-metadata
import 'reflect-metadata'

// 简单示例
function logType(target: any, propertyKey: string) {
  const type = Reflect.getMetadata('design:type', target, propertyKey)
  console.log(`${propertyKey} 的类型：${type.name}`)
}

class Example {
  @logType
  name: string = ''

  @logType
  age: number = 0
}

// 输出：
// name 的类型：String
// age 的类型：Number
```

## 4. 🤔 如何使用设计时类型元数据？

TypeScript 会自动生成三种设计时类型元数据。

### 4.1. design:type（属性类型）

```ts
import 'reflect-metadata'

function ShowType(target: any, propertyKey: string) {
  const type = Reflect.getMetadata('design:type', target, propertyKey)
  console.log(`${propertyKey} 类型：${type.name}`)
}

class User {
  @ShowType
  name: string = ''

  @ShowType
  age: number = 0

  @ShowType
  active: boolean = true
}

// 输出：
// name 类型：String
// age 类型：Number
// active 类型：Boolean
```

### 4.2. design:paramtypes（参数类型）

```ts
import 'reflect-metadata'

function ShowParams(target: any) {
  const types = Reflect.getMetadata('design:paramtypes', target)
  console.log(
    '构造函数参数类型：',
    types.map((t: any) => t.name)
  )
}

class Logger {}
class Database {}

@ShowParams
class UserService {
  constructor(
    private logger: Logger,
    private db: Database,
    private timeout: number
  ) {}
}

// 输出：构造函数参数类型：['Logger', 'Database', 'Number']
```

### 4.3. design:returntype（返回类型）

```ts
import 'reflect-metadata'

function ShowReturn(target: any, propertyKey: string) {
  const returnType = Reflect.getMetadata(
    'design:returntype',
    target,
    propertyKey
  )
  console.log(`${propertyKey} 返回类型：${returnType.name}`)
}

class Calculator {
  @ShowReturn
  add(a: number, b: number): number {
    return a + b
  }

  @ShowReturn
  getName(): string {
    return 'Calculator'
  }
}

// 输出：
// add 返回类型：Number
// getName 返回类型：String
```

## 5. 🤔 如何自定义元数据？

可以使用 `Reflect.defineMetadata` 和 `Reflect.getMetadata` 自定义元数据。

### 5.1. 基本使用

```ts
import 'reflect-metadata'

// 定义元数据
function Route(path: string) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata('route', path, target, propertyKey)
  }
}

// 读取元数据
function getRoutes(target: any) {
  const routes: Array<{ method: string; path: string }> = []

  for (const propertyKey of Object.getOwnPropertyNames(target.prototype)) {
    const path = Reflect.getMetadata('route', target.prototype, propertyKey)
    if (path) {
      routes.push({ method: propertyKey, path })
    }
  }

  return routes
}

class UserController {
  @Route('/users')
  getUsers() {
    return []
  }

  @Route('/users/:id')
  getUser() {
    return {}
  }
}

const routes = getRoutes(UserController)
console.log(routes)
// [
//   { method: 'getUsers', path: '/users' },
//   { method: 'getUser', path: '/users/:id' }
// ]
```

### 5.2. 多个元数据

```ts
import 'reflect-metadata'

function Method(method: string) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata('http:method', method, target, propertyKey)
  }
}

function Path(path: string) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata('http:path', path, target, propertyKey)
  }
}

class ApiController {
  @Method('GET')
  @Path('/api/data')
  getData() {
    return { data: [] }
  }
}

const method = Reflect.getMetadata(
  'http:method',
  ApiController.prototype,
  'getData'
)
const path = Reflect.getMetadata(
  'http:path',
  ApiController.prototype,
  'getData'
)

console.log(`${method} ${path}`) // GET /api/data
```

## 6. 🤔 元数据的实际应用场景有哪些？

元数据在框架开发中有重要应用。

### 6.1. 依赖注入

```ts
import 'reflect-metadata'

// 简化的依赖注入容器
class Container {
  private services = new Map<any, any>()

  register(serviceClass: any) {
    this.services.set(serviceClass, null)
  }

  resolve<T>(serviceClass: new (...args: any[]) => T): T {
    let instance = this.services.get(serviceClass)

    if (instance) {
      return instance
    }

    // 获取构造函数参数类型
    const paramTypes =
      Reflect.getMetadata('design:paramtypes', serviceClass) || []

    // 递归解析依赖
    const params = paramTypes.map((paramType: any) => this.resolve(paramType))

    // 创建实例
    instance = new serviceClass(...params)
    this.services.set(serviceClass, instance)

    return instance
  }
}

// 使用示例
class Logger {
  log(message: string) {
    console.log(message)
  }
}

class Database {
  query(sql: string) {
    console.log('执行查询：', sql)
  }
}

class UserService {
  constructor(private logger: Logger, private db: Database) {}

  getUser(id: number) {
    this.logger.log(`获取用户 ${id}`)
    this.db.query(`SELECT * FROM users WHERE id = ${id}`)
  }
}

const container = new Container()
container.register(Logger)
container.register(Database)
container.register(UserService)

const userService = container.resolve(UserService)
userService.getUser(1)
```

### 6.2. ORM 字段映射

```ts
import 'reflect-metadata'

function Column(options?: { name?: string; type?: string }) {
  return function (target: any, propertyKey: string) {
    const columns = Reflect.getMetadata('columns', target.constructor) || []

    const designType = Reflect.getMetadata('design:type', target, propertyKey)

    columns.push({
      property: propertyKey,
      column: options?.name || propertyKey,
      type: options?.type || designType.name.toLowerCase(),
    })

    Reflect.defineMetadata('columns', columns, target.constructor)
  }
}

function Table(name: string) {
  return function (target: Function) {
    Reflect.defineMetadata('table', name, target)
  }
}

@Table('users')
class User {
  @Column({ name: 'user_id', type: 'int' })
  id: number = 0

  @Column()
  name: string = ''

  @Column({ name: 'email_address' })
  email: string = ''
}

// 生成 SQL
function generateCreateTable(modelClass: any) {
  const tableName = Reflect.getMetadata('table', modelClass)
  const columns = Reflect.getMetadata('columns', modelClass)

  const columnDefs = columns
    .map((col: any) => {
      return `${col.column} ${col.type.toUpperCase()}`
    })
    .join(', ')

  return `CREATE TABLE ${tableName} (${columnDefs})`
}

console.log(generateCreateTable(User))
// CREATE TABLE users (user_id INT, name STRING, email_address STRING)
```

### 6.3. 验证器

```ts
import 'reflect-metadata'

function MinLength(length: number) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata('validation:minLength', length, target, propertyKey)
  }
}

function MaxLength(length: number) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata('validation:maxLength', length, target, propertyKey)
  }
}

function Required(target: any, propertyKey: string) {
  Reflect.defineMetadata('validation:required', true, target, propertyKey)
}

class CreateUserDto {
  @Required
  @MinLength(3)
  @MaxLength(20)
  username: string = ''

  @Required
  @MinLength(6)
  password: string = ''
}

// 验证函数
function validate(obj: any): string[] {
  const errors: string[] = []

  for (const key of Object.keys(obj)) {
    const value = obj[key]

    // 检查必填
    const required = Reflect.getMetadata('validation:required', obj, key)
    if (required && !value) {
      errors.push(`${key} 是必填项`)
      continue
    }

    // 检查最小长度
    const minLength = Reflect.getMetadata('validation:minLength', obj, key)
    if (minLength && value.length < minLength) {
      errors.push(`${key} 最小长度为 ${minLength}`)
    }

    // 检查最大长度
    const maxLength = Reflect.getMetadata('validation:maxLength', obj, key)
    if (maxLength && value.length > maxLength) {
      errors.push(`${key} 最大长度为 ${maxLength}`)
    }
  }

  return errors
}

const dto = new CreateUserDto()
dto.username = 'ab'
dto.password = '123'

console.log(validate(dto))
// [
//   'username 最小长度为 3',
//   'password 最小长度为 6'
// ]
```

## 7. 🔗 引用

- [Reflect Metadata][1]
- [TypeScript Decorators][2]
- [Metadata Reflection API][3]
- [TC39 Decorator Metadata Proposal][4]

[1]: https://github.com/rbuckton/reflect-metadata
[2]: https://www.typescriptlang.org/docs/handbook/decorators.html
[3]: https://rbuckton.github.io/reflect-metadata/
[4]: https://github.com/tc39/proposal-decorator-metadata
