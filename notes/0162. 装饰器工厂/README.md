# [0162. 装饰器工厂](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0162.%20%E8%A3%85%E9%A5%B0%E5%99%A8%E5%B7%A5%E5%8E%82)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是装饰器工厂？](#3--什么是装饰器工厂)
  - [3.1. 装饰器工厂的本质](#31-装饰器工厂的本质)
- [4. 🤔 装饰器工厂的基本语法是什么？](#4--装饰器工厂的基本语法是什么)
  - [4.1. 类装饰器工厂](#41-类装饰器工厂)
  - [4.2. 方法装饰器工厂](#42-方法装饰器工厂)
  - [4.3. 属性装饰器工厂](#43-属性装饰器工厂)
  - [4.4. 参数装饰器工厂](#44-参数装饰器工厂)
- [5. 🤔 装饰器工厂如何传递参数？](#5--装饰器工厂如何传递参数)
  - [5.1. 单个参数](#51-单个参数)
  - [5.2. 多个参数](#52-多个参数)
  - [5.3. 对象参数](#53-对象参数)
  - [5.4. 可选参数](#54-可选参数)
- [6. 🤔 装饰器工厂有哪些应用场景？](#6--装饰器工厂有哪些应用场景)
  - [6.1. 条件装饰](#61-条件装饰)
  - [6.2. 权限控制](#62-权限控制)
  - [6.3. 参数转换](#63-参数转换)
  - [6.4. 元数据配置](#64-元数据配置)
- [7. 🤔 使用装饰器工厂需要注意什么？](#7--使用装饰器工厂需要注意什么)
  - [7.1. 必须调用工厂函数](#71-必须调用工厂函数)
  - [7.2. 返回正确的装饰器类型](#72-返回正确的装饰器类型)
  - [7.3. 闭包变量的生命周期](#73-闭包变量的生命周期)
  - [7.4. 参数验证](#74-参数验证)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 装饰器工厂的定义和本质
- 装饰器工厂的基本语法
- 装饰器工厂的参数传递
- 装饰器工厂的应用场景
- 装饰器工厂的使用注意事项
- 装饰器工厂与普通装饰器的区别

## 2. 🫧 评价

装饰器工厂是返回装饰器函数的函数，主要用于实现可配置的装饰器功能。

- 装饰器工厂允许在应用装饰器时传递参数，增强装饰器的灵活性
- 是实现可配置装饰器的唯一方式，广泛应用于框架和库中
- 装饰器工厂先于装饰器执行，按照从外到内的顺序调用
- 需要注意返回正确签名的装饰器函数
- 合理使用闭包可以在装饰器间共享配置和状态

## 3. 🤔 什么是装饰器工厂？

装饰器工厂是一个返回装饰器的函数，用于创建可配置的装饰器。

```typescript
// 普通装饰器
function simpleDecorator(target: any) {
  console.log('简单装饰器')
}

@simpleDecorator
class Example1 {}

// 装饰器工厂
function decoratorFactory(config: string) {
  console.log('装饰器工厂被调用，配置：', config)

  // 返回真正的装饰器
  return function (target: any) {
    console.log('装饰器执行，配置：', config)
  }
}

@decoratorFactory('my-config')
class Example2 {}

// 输出：
// 简单装饰器
// 装饰器工厂被调用，配置：my-config
// 装饰器执行，配置：my-config
```

### 3.1. 装饰器工厂的本质

```typescript
// 装饰器工厂的本质是高阶函数
function createLogger(prefix: string) {
  // 这是工厂函数
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    // 这才是真正的装饰器
    const originalMethod = descriptor.value

    descriptor.value = function (...args: any[]) {
      console.log(`${prefix} 调用方法 ${propertyKey}`)
      return originalMethod.apply(this, args)
    }
  }
}

class Service {
  @createLogger('[DEBUG]')
  method1() {
    console.log('方法1执行')
  }

  @createLogger('[INFO]')
  method2() {
    console.log('方法2执行')
  }
}

const service = new Service()
service.method1() // [DEBUG] 调用方法 method1
service.method2() // [INFO] 调用方法 method2
```

## 4. 🤔 装饰器工厂的基本语法是什么？

装饰器工厂返回对应类型的装饰器函数。

### 4.1. 类装饰器工厂

```typescript
// 类装饰器工厂
function Entity(tableName: string) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      tableName = tableName

      save() {
        console.log(`保存到表 ${tableName}`)
      }
    }
  }
}

@Entity('users')
class User {
  constructor(public name: string) {}
}

const user = new User('Alice')
user.save() // 保存到表 users
```

### 4.2. 方法装饰器工厂

```typescript
// 方法装饰器工厂
function timeout(ms: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      return Promise.race([
        originalMethod.apply(this, args),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`超时 ${ms}ms`)), ms)
        ),
      ])
    }
  }
}

class ApiService {
  @timeout(3000)
  async fetchData(url: string) {
    const response = await fetch(url)
    return response.json()
  }
}
```

### 4.3. 属性装饰器工厂

```typescript
// 属性装饰器工厂
function defaultValue(value: any) {
  return function (target: any, propertyKey: string) {
    let val = value

    Object.defineProperty(target, propertyKey, {
      get() {
        return val
      },
      set(newValue: any) {
        val = newValue !== undefined ? newValue : value
      },
      enumerable: true,
      configurable: true,
    })
  }
}

class Config {
  @defaultValue('localhost')
  host!: string

  @defaultValue(3000)
  port!: number
}

const config = new Config()
console.log(config.host) // 'localhost'
console.log(config.port) // 3000
```

### 4.4. 参数装饰器工厂

```typescript
import 'reflect-metadata'

// 参数装饰器工厂
function validate(rule: (value: any) => boolean, message: string) {
  return function (
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number
  ) {
    const validators =
      Reflect.getOwnMetadata('validators', target, propertyKey) || []
    validators.push({ index: parameterIndex, rule, message })
    Reflect.defineMetadata('validators', validators, target, propertyKey)
  }
}

function validateMethod(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value

  descriptor.value = function (...args: any[]) {
    const validators =
      Reflect.getOwnMetadata('validators', target, propertyKey) || []

    validators.forEach(({ index, rule, message }: any) => {
      if (!rule(args[index])) {
        throw new Error(message)
      }
    })

    return originalMethod.apply(this, args)
  }
}

class UserService {
  @validateMethod
  createUser(
    @validate((v) => v.length >= 3, '用户名至少3个字符') name: string,
    @validate((v) => v >= 18, '年龄必须大于等于18') age: number
  ) {
    return { name, age }
  }
}

const service = new UserService()
console.log(service.createUser('Alice', 25))
// service.createUser('AB', 25);  // ❌ Error: 用户名至少3个字符
// service.createUser('Alice', 16);  // ❌ Error: 年龄必须大于等于18
```

## 5. 🤔 装饰器工厂如何传递参数？

装饰器工厂可以接收任意类型和数量的参数。

### 5.1. 单个参数

```typescript
// 接收单个参数
function log(enabled: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    if (!enabled) {
      return descriptor
    }

    const originalMethod = descriptor.value

    descriptor.value = function (...args: any[]) {
      console.log(`调用 ${propertyKey}，参数：`, args)
      return originalMethod.apply(this, args)
    }
  }
}

class Calculator {
  @log(true)
  add(a: number, b: number) {
    return a + b
  }

  @log(false)
  subtract(a: number, b: number) {
    return a - b
  }
}

const calc = new Calculator()
calc.add(2, 3) // 调用 add，参数：[2, 3]
calc.subtract(5, 2) // 无输出
```

### 5.2. 多个参数

```typescript
// 接收多个参数
function retry(times: number, delay: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      let lastError: Error

      for (let i = 0; i < times; i++) {
        try {
          return await originalMethod.apply(this, args)
        } catch (error) {
          lastError = error as Error
          console.log(`重试 ${i + 1}/${times}`)

          if (i < times - 1) {
            await new Promise((resolve) => setTimeout(resolve, delay))
          }
        }
      }

      throw lastError!
    }
  }
}

class NetworkService {
  @retry(3, 1000)
  async fetchData(url: string) {
    console.log('尝试获取数据')
    // 模拟随机失败
    if (Math.random() > 0.5) {
      throw new Error('网络错误')
    }
    return 'data'
  }
}
```

### 5.3. 对象参数

```typescript
// 接收配置对象
interface CacheOptions {
  ttl: number
  key?: (args: any[]) => string
}

function cache(options: CacheOptions) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value
    const cacheMap = new Map<string, { value: any; timestamp: number }>()

    descriptor.value = function (...args: any[]) {
      const cacheKey = options.key ? options.key(args) : JSON.stringify(args)

      const cached = cacheMap.get(cacheKey)
      const now = Date.now()

      if (cached && now - cached.timestamp < options.ttl) {
        console.log('返回缓存数据')
        return cached.value
      }

      const result = originalMethod.apply(this, args)
      cacheMap.set(cacheKey, { value: result, timestamp: now })

      return result
    }
  }
}

class DataService {
  @cache({
    ttl: 5000,
    key: (args) => `user:${args[0]}`,
  })
  getUser(id: number) {
    console.log('从数据库获取用户')
    return { id, name: 'Alice' }
  }
}

const service = new DataService()
service.getUser(1) // 从数据库获取用户
service.getUser(1) // 返回缓存数据
```

### 5.4. 可选参数

```typescript
// 带默认值的可选参数
function measure(unit: string = 'ms') {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = function (...args: any[]) {
      const start = performance.now()
      const result = originalMethod.apply(this, args)
      const end = performance.now()

      const duration = end - start
      console.log(`${propertyKey} 执行时间：${duration.toFixed(2)}${unit}`)

      return result
    }
  }
}

class Service {
  @measure()
  method1() {
    // 一些操作
  }

  @measure('秒')
  method2() {
    // 一些操作
  }
}
```

## 6. 🤔 装饰器工厂有哪些应用场景？

### 6.1. 条件装饰

```typescript
// 根据环境条件应用装饰器
function debugOnly(enabled: boolean = process.env.NODE_ENV === 'development') {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    if (!enabled) {
      return descriptor
    }

    const originalMethod = descriptor.value

    descriptor.value = function (...args: any[]) {
      console.log(`[DEBUG] ${propertyKey}`, {
        args,
        timestamp: new Date().toISOString(),
      })

      return originalMethod.apply(this, args)
    }
  }
}

class UserService {
  @debugOnly(true)
  createUser(name: string) {
    return { name }
  }
}
```

### 6.2. 权限控制

```typescript
// 基于角色的访问控制
function requireRole(...roles: string[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = function (this: any, ...args: any[]) {
      const userRole = this.getCurrentUserRole()

      if (!roles.includes(userRole)) {
        throw new Error(`需要以下角色之一：${roles.join(', ')}`)
      }

      return originalMethod.apply(this, args)
    }
  }
}

class AdminController {
  getCurrentUserRole() {
    return 'user'
  }

  @requireRole('admin')
  deleteUser(id: number) {
    console.log(`删除用户 ${id}`)
  }

  @requireRole('admin', 'moderator')
  updateUser(id: number, data: any) {
    console.log(`更新用户 ${id}`)
  }
}

const controller = new AdminController()
try {
  controller.deleteUser(123)
} catch (error) {
  console.error(error.message) // 需要以下角色之一：admin
}
```

### 6.3. 参数转换

```typescript
// 自动转换参数类型
function transform(transformer: (value: any) => any, ...indices: number[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = function (...args: any[]) {
      const transformedArgs = args.map((arg, index) =>
        indices.includes(index) ? transformer(arg) : arg
      )

      return originalMethod.apply(this, transformedArgs)
    }
  }
}

class DataService {
  @transform(String, 0)
  processId(id: any) {
    console.log('ID 类型：', typeof id)
    console.log('ID 值：', id)
  }

  @transform(Number, 0, 1)
  calculate(a: any, b: any) {
    console.log('计算：', a + b, '类型：', typeof (a + b))
  }
}

const service = new DataService()
service.processId(123) // ID 类型：string
service.calculate('10', '20') // 计算：30 类型：number
```

### 6.4. 元数据配置

```typescript
import 'reflect-metadata'

// 存储路由元数据
function Route(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET'
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata('route:path', path, target, propertyKey)
    Reflect.defineMetadata('route:method', method, target, propertyKey)
  }
}

function Controller(basePath: string) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    Reflect.defineMetadata('controller:basePath', basePath, constructor)
    return constructor
  }
}

@Controller('/api/users')
class UserController {
  @Route('/', 'GET')
  getAll() {
    return ['user1', 'user2']
  }

  @Route('/:id', 'GET')
  getOne() {
    return { id: 1, name: 'Alice' }
  }

  @Route('/', 'POST')
  create() {
    return { id: 1 }
  }
}

// 读取元数据
function getRoutes(controller: any) {
  const basePath = Reflect.getMetadata('controller:basePath', controller)
  const prototype = controller.prototype
  const methods = Object.getOwnPropertyNames(prototype).filter(
    (m) => m !== 'constructor'
  )

  return methods.map((method) => ({
    path: basePath + Reflect.getMetadata('route:path', prototype, method),
    method: Reflect.getMetadata('route:method', prototype, method),
    handler: method,
  }))
}

console.log(getRoutes(UserController))
// [
//   { path: '/api/users/', method: 'GET', handler: 'getAll' },
//   { path: '/api/users/:id', method: 'GET', handler: 'getOne' },
//   { path: '/api/users/', method: 'POST', handler: 'create' }
// ]
```

## 7. 🤔 使用装饰器工厂需要注意什么？

### 7.1. 必须调用工厂函数

::: code-group

```typescript [❌ 错误示例]
// 忘记调用装饰器工厂
function log(message: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log(message)
  }
}

class Example {
  // ❌ 错误：没有调用工厂函数
  @log // 这会导致类型错误
  method() {}
}
```

```typescript [✅ 正确示例]
// 调用装饰器工厂
function log(message: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log(message)
  }
}

class Example {
  @log('日志消息') // 调用工厂函数
  method() {}
}
```

:::

### 7.2. 返回正确的装饰器类型

```typescript
// 确保返回正确签名的装饰器
function classDecoratorFactory(config: any) {
  // 返回类装饰器
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return constructor
  }
}

function methodDecoratorFactory(config: any) {
  // 返回方法装饰器
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    return descriptor
  }
}

@classDecoratorFactory({ option: 'value' })
class MyClass {
  @methodDecoratorFactory({ option: 'value' })
  myMethod() {}
}
```

### 7.3. 闭包变量的生命周期

```typescript
// 注意闭包变量在多个实例间的共享
function counter() {
  let count = 0 // 所有实例共享这个变量

  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = function (...args: any[]) {
      count++
      console.log(`调用次数：${count}`)
      return originalMethod.apply(this, args)
    }
  }
}

class Service {
  @counter()
  method() {
    console.log('方法执行')
  }
}

const s1 = new Service()
const s2 = new Service()

s1.method() // 调用次数：1
s2.method() // 调用次数：2（共享计数器）
s1.method() // 调用次数：3
```

```typescript
// 如果需要实例独立的计数，使用 WeakMap
function instanceCounter() {
  const counts = new WeakMap<any, number>()

  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = function (...args: any[]) {
      const count = (counts.get(this) || 0) + 1
      counts.set(this, count)
      console.log(`实例调用次数：${count}`)
      return originalMethod.apply(this, args)
    }
  }
}

class Service {
  @instanceCounter()
  method() {
    console.log('方法执行')
  }
}

const s1 = new Service()
const s2 = new Service()

s1.method() // 实例调用次数：1
s2.method() // 实例调用次数：1（独立计数）
s1.method() // 实例调用次数：2
s2.method() // 实例调用次数：2
```

### 7.4. 参数验证

```typescript
// 在装饰器工厂中验证参数
function timeout(ms: number) {
  if (typeof ms !== 'number' || ms <= 0) {
    throw new Error('timeout 必须是正数')
  }

  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      return Promise.race([
        originalMethod.apply(this, args),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('超时')), ms)
        ),
      ])
    }
  }
}

class Service {
  @timeout(3000)
  async validMethod() {}

  // @timeout(-1000)  // ❌ Error: timeout 必须是正数
  // async invalidMethod() {}
}
```

## 8. 🔗 引用

- [TypeScript Handbook - Decorator Factories][1]
- [TC39 Decorator Proposal][2]
- [Understanding Decorator Factories][3]
- [Decorator Patterns][4]

[1]: https://www.typescriptlang.org/docs/handbook/decorators.html#decorator-factories
[2]: https://github.com/tc39/proposal-decorators
[3]: https://www.typescriptlang.org/docs/handbook/decorators.html
[4]: https://refactoring.guru/design-patterns/decorator
