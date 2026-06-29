# [0156. 类装饰器](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0156.%20%E7%B1%BB%E8%A3%85%E9%A5%B0%E5%99%A8)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 什么是类装饰器？](#3-什么是类装饰器)
- [4. 类装饰器的基本语法是什么？](#4-类装饰器的基本语法是什么)
  - [4.1. 基本形式](#41-基本形式)
  - [4.2. 类型定义](#42-类型定义)
- [5. 类装饰器如何修改类的行为？](#5-类装饰器如何修改类的行为)
  - [5.1. 添加属性和方法](#51-添加属性和方法)
  - [5.2. 修改构造函数行为](#52-修改构造函数行为)
  - [5.3. 实现单例模式](#53-实现单例模式)
- [6. 类装饰器工厂有什么用？](#6-类装饰器工厂有什么用)
  - [6.1. 基本装饰器工厂](#61-基本装饰器工厂)
  - [6.2. 带验证的装饰器工厂](#62-带验证的装饰器工厂)
  - [6.3. 配置元数据](#63-配置元数据)
- [7. 类装饰器的执行时机是什么？](#7-类装饰器的执行时机是什么)
  - [7.1. 多个装饰器的执行顺序](#71-多个装饰器的执行顺序)
- [8. 类装饰器有哪些实际应用场景？](#8-类装饰器有哪些实际应用场景)
  - [8.1. 依赖注入](#81-依赖注入)
  - [8.2. 性能监控](#82-性能监控)
  - [8.3. 自动序列化](#83-自动序列化)
  - [8.4. 访问控制](#84-访问控制)
- [9. 使用类装饰器时需要注意什么？](#9-使用类装饰器时需要注意什么)
  - [9.1. 类型安全问题](#91-类型安全问题)
  - [9.2. 继承问题](#92-继承问题)
  - [9.3. 性能考虑](#93-性能考虑)
  - [9.4. 装饰器顺序](#94-装饰器顺序)
- [10. 引用](#10-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 类装饰器的定义和本质
- 类装饰器的基本语法
- 类装饰器修改类行为的方式
- 类装饰器工厂模式
- 类装饰器的执行时机
- 类装饰器的实际应用场景
- 类装饰器的使用注意事项

## 2. 评价

类装饰器是装饰器系统中最常用的类型，可以在类定义时对类进行增强或修改。

- 类装饰器主要用于框架级功能，如依赖注入、日志记录、性能监控等
- 装饰器在类定义时执行一次，不是在实例化时执行
- 可以通过返回新的构造函数来替换原有类
- 使用装饰器工厂可以传递参数，实现更灵活的配置
- TypeScript 5.0 之前需要启用 `experimentalDecorators` 配置

## 3. 什么是类装饰器？

类装饰器是应用在类声明上的特殊函数，用于观察、修改或替换类定义。

```ts
// ✅ 类装饰器的本质
function Logger(constructor: Function) {
  console.log('装饰器执行了')
  console.log('类名：', constructor.name)
}

@Logger
class User {
  constructor(public name: string) {}
}

// 输出：
// 装饰器执行了
// 类名：User

const user = new User('Alice') // 装饰器不会再次执行
```

## 4. 类装饰器的基本语法是什么？

类装饰器接收类的构造函数作为唯一参数，可以返回新的构造函数来替换原有类。

### 4.1. 基本形式

```ts
// ✅ 简单的类装饰器
function Sealed(constructor: Function) {
  Object.seal(constructor)
  Object.seal(constructor.prototype)
}

@Sealed
class Product {
  name: string = 'Product'
}

// 类和原型被密封，无法添加新属性
```

### 4.2. 类型定义

::: code-group

```ts [新版装饰器（Stage 3）]
// ✅ TypeScript 5.0+ 标准装饰器
type ClassDecorator = <T extends { new (...args: any[]): {} }>(
  target: T,
  context: ClassDecoratorContext
) => T | void

function LogClass<T extends { new (...args: any[]): {} }>(
  target: T,
  context: ClassDecoratorContext
) {
  console.log('类名：', context.name)
  return target
}

@LogClass
class User {
  constructor(public name: string) {}
}
```

```ts [旧版装饰器（Stage 2）]
// ✅ TypeScript 5.0 之前的装饰器
type ClassDecorator = <TFunction extends Function>(
  target: TFunction
) => TFunction | void

function LogClass<T extends Function>(target: T): T {
  console.log('类名：', target.name)
  return target
}

@LogClass
class User {
  constructor(public name: string) {}
}
```

:::

## 5. 类装饰器如何修改类的行为？

类装饰器可以通过返回新的构造函数来替换或增强原有类。

### 5.1. 添加属性和方法

```ts
// ✅ 为类添加时间戳属性
function Timestamped<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    createdAt = new Date()

    getTimestamp() {
      return this.createdAt.toISOString()
    }
  }
}

@Timestamped
class Document {
  constructor(public title: string) {}
}

const doc = new Document('Report')
console.log(doc.title) // 'Report'
console.log(doc.createdAt) // 当前时间
console.log(doc.getTimestamp()) // ISO 时间字符串
```

### 5.2. 修改构造函数行为

```ts
// ✅ 在构造函数执行前后添加逻辑
function TrackInstances<T extends { new (...args: any[]): {} }>(
  constructor: T
) {
  let instances = 0

  return class extends constructor {
    constructor(...args: any[]) {
      super(...args)
      instances++
      console.log(`创建了第 ${instances} 个实例`)
    }

    static getInstanceCount() {
      return instances
    }
  }
}

@TrackInstances
class User {
  constructor(public name: string) {}
}

const user1 = new User('Alice') // 创建了第 1 个实例
const user2 = new User('Bob') // 创建了第 2 个实例
console.log(User.getInstanceCount()) // 2
```

### 5.3. 实现单例模式

```ts
// ✅ 使用装饰器实现单例
function Singleton<T extends { new (...args: any[]): {} }>(constructor: T) {
  let instance: any

  return class extends constructor {
    constructor(...args: any[]) {
      if (instance) {
        return instance
      }
      super(...args)
      instance = this
    }
  }
}

@Singleton
class Database {
  constructor(public url: string) {}

  connect() {
    console.log(`连接到 ${this.url}`)
  }
}

const db1 = new Database('localhost:5432')
const db2 = new Database('remote:5432')

console.log(db1 === db2) // true
console.log(db2.url) // 'localhost:5432'（使用第一次的参数）
```

## 6. 类装饰器工厂有什么用？

装饰器工厂是返回装饰器的函数，允许传递参数来配置装饰器行为。

### 6.1. 基本装饰器工厂

```ts
// ✅ 装饰器工厂接收参数
function Component(config: { selector: string; template: string }) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      selector = config.selector
      template = config.template

      render() {
        console.log(`渲染 ${this.selector}：${this.template}`)
      }
    }
  }
}

@Component({
  selector: 'app-root',
  template: '<h1>Hello World</h1>',
})
class AppComponent {
  title = 'My App'
}

const app = new AppComponent()
app.render() // 渲染 app-root：<h1>Hello World</h1>
```

### 6.2. 带验证的装饰器工厂

```ts
// ✅ 根据环境启用不同行为
function Logger(enabled: boolean) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    if (!enabled) {
      return constructor
    }

    return class extends constructor {
      constructor(...args: any[]) {
        super(...args)
        console.log(`[LOG] 创建 ${constructor.name} 实例`)
        console.log('[LOG] 参数：', args)
      }
    }
  }
}

@Logger(true) // 启用日志
class UserService {
  constructor(public name: string) {}
}

@Logger(false) // 禁用日志
class AdminService {
  constructor(public name: string) {}
}

const user = new UserService('user-service')
// 输出：
// [LOG] 创建 UserService 实例
// [LOG] 参数：['user-service']

const admin = new AdminService('admin-service')
// 无输出
```

### 6.3. 配置元数据

```ts
// ✅ 存储元数据供框架使用
interface RouteConfig {
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
}

function Controller(basePath: string) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    // 存储元数据
    Reflect.defineMetadata('basePath', basePath, constructor)

    return class extends constructor {
      getBasePath() {
        return basePath
      }
    }
  }
}

@Controller('/api/users')
class UserController {
  getUsers() {
    return ['Alice', 'Bob']
  }
}

const controller = new UserController()
console.log(controller.getBasePath()) // '/api/users'
```

## 7. 类装饰器的执行时机是什么？

类装饰器在类定义时立即执行，而不是在实例化时执行。

```ts
// ✅ 装饰器执行时机演示
console.log('1. 脚本开始执行')

function LogExecutionTime(constructor: Function) {
  console.log('3. 装饰器执行')
  console.log('4. 类定义完成')
}

console.log('2. 准备定义类')

@LogExecutionTime
class User {
  constructor(public name: string) {
    console.log('6. 构造函数执行')
  }
}

console.log('5. 类已定义，准备实例化')

const user = new User('Alice')

console.log('7. 实例化完成')

// 输出顺序：
// 1. 脚本开始执行
// 2. 准备定义类
// 3. 装饰器执行
// 4. 类定义完成
// 5. 类已定义，准备实例化
// 6. 构造函数执行
// 7. 实例化完成
```

### 7.1. 多个装饰器的执行顺序

```ts
// ✅ 多个装饰器从下到上执行
function First() {
  console.log('First 工厂被调用')
  return function (constructor: Function) {
    console.log('First 装饰器执行')
  }
}

function Second() {
  console.log('Second 工厂被调用')
  return function (constructor: Function) {
    console.log('Second 装饰器执行')
  }
}

@First()
@Second()
class Example {}

// 输出顺序：
// First 工厂被调用
// Second 工厂被调用
// Second 装饰器执行（从下到上）
// First 装饰器执行
```

## 8. 类装饰器有哪些实际应用场景？

### 8.1. 依赖注入

```ts
// ✅ 实现简单的依赖注入
const serviceRegistry = new Map<string, any>()

function Injectable(serviceName: string) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    serviceRegistry.set(serviceName, constructor)
    return constructor
  }
}

function Inject(serviceName: string) {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    // 标记需要注入的参数
    const existingInjections = Reflect.getMetadata('injections', target) || []
    existingInjections.push({ index: parameterIndex, serviceName })
    Reflect.defineMetadata('injections', existingInjections, target)
  }
}

@Injectable('Logger')
class Logger {
  log(message: string) {
    console.log(`[LOG] ${message}`)
  }
}

@Injectable('UserService')
class UserService {
  constructor(private logger: Logger) {}

  getUser(id: number) {
    this.logger.log(`获取用户 ${id}`)
    return { id, name: 'Alice' }
  }
}
```

### 8.2. 性能监控

```ts
// ✅ 监控类方法的执行时间
function PerformanceMonitor<T extends { new (...args: any[]): {} }>(
  constructor: T
) {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args)

      // 为所有方法添加性能监控
      Object.getOwnPropertyNames(constructor.prototype).forEach(
        (methodName) => {
          if (methodName === 'constructor') return

          const originalMethod = (this as any)[methodName]
          if (typeof originalMethod === 'function') {
            ;(this as any)[methodName] = function (...args: any[]) {
              const start = performance.now()
              const result = originalMethod.apply(this, args)
              const end = performance.now()
              console.log(
                `${constructor.name}.${methodName} 耗时：${(
                  end - start
                ).toFixed(2)}ms`
              )
              return result
            }
          }
        }
      )
    }
  }
}

@PerformanceMonitor
class DataProcessor {
  process(data: number[]) {
    return data.map((x) => x * 2)
  }

  aggregate(data: number[]) {
    return data.reduce((sum, x) => sum + x, 0)
  }
}

const processor = new DataProcessor()
processor.process([1, 2, 3, 4, 5])
// 输出：DataProcessor.process 耗时：0.12ms
processor.aggregate([1, 2, 3, 4, 5])
// 输出：DataProcessor.aggregate 耗时：0.08ms
```

### 8.3. 自动序列化

```ts
// ✅ 为类添加序列化能力
interface SerializableClass {
  toJSON(): any
  fromJSON(json: string): any
}

function Serializable<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor implements SerializableClass {
    toJSON() {
      const obj: any = {}
      Object.keys(this).forEach((key) => {
        obj[key] = (this as any)[key]
      })
      return obj
    }

    fromJSON(json: string) {
      const obj = JSON.parse(json)
      Object.keys(obj).forEach((key) => {
        ;(this as any)[key] = obj[key]
      })
      return this
    }
  }
}

@Serializable
class User {
  constructor(public name: string, public age: number, public email: string) {}
}

const user = new User('Alice', 30, 'alice@example.com')
const json = JSON.stringify(user.toJSON())
console.log(json)
// {"name":"Alice","age":30,"email":"alice@example.com"}

const newUser = new User('', 0, '').fromJSON(json)
console.log(newUser.name) // 'Alice'
```

### 8.4. 访问控制

```ts
// ✅ 实现权限控制
function RequireAuth(roles: string[]) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args)

        // 检查当前用户权限
        const userRole = this.getCurrentUserRole()
        if (!roles.includes(userRole)) {
          throw new Error(`权限不足，需要以下角色之一：${roles.join(', ')}`)
        }
      }

      getCurrentUserRole(): string {
        // 实际应用中从认证系统获取
        return 'user'
      }
    }
  }
}

@RequireAuth(['admin', 'moderator'])
class AdminPanel {
  deleteUser(userId: number) {
    console.log(`删除用户 ${userId}`)
  }
}

try {
  const panel = new AdminPanel()
} catch (error) {
  console.error(error.message)
  // 输出：权限不足，需要以下角色之一：admin, moderator
}
```

## 9. 使用类装饰器时需要注意什么？

### 9.1. 类型安全问题

```ts
// ❌ 装饰器返回的新类可能导致类型丢失
function AddMethod<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    newMethod() {
      console.log('新方法')
    }
  }
}

@AddMethod
class User {
  name: string = 'Alice'
}

const user = new User()
// user.newMethod(); // ❌ 类型错误：Property 'newMethod' does not exist
```

```ts
// ✅ 使用类型断言或重新定义类型
function AddMethod<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    newMethod() {
      console.log('新方法')
    }
  }
}

@AddMethod
class User {
  name: string = 'Alice'
}

const user = new User() as User & { newMethod(): void }
user.newMethod() // ✅ 正常工作
```

### 9.2. 继承问题

```ts
// ❌ 装饰器修改可能影响继承
function Frozen<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args)
      Object.freeze(this)
    }
  }
}

@Frozen
class Base {
  value: number = 1
}

class Derived extends Base {
  extraValue: number = 2

  setValue(v: number) {
    this.value = v // ❌ 运行时错误：Cannot assign to read only property
  }
}
```

### 9.3. 性能考虑

```ts
// ❌ 避免在装饰器中执行耗时操作
function ExpensiveDecorator<T extends { new (...args: any[]): {} }>(
  constructor: T
) {
  // ❌ 每次定义类时都会执行
  for (let i = 0; i < 1000000; i++) {
    Math.random()
  }
  return constructor
}

@ExpensiveDecorator
class User {}
```

```ts
// ✅ 将耗时操作延迟到实例化或方法调用时
function LazyInit<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    private initialized = false

    private init() {
      if (this.initialized) return

      // 耗时操作
      console.log('执行初始化')
      this.initialized = true
    }

    constructor(...args: any[]) {
      super(...args)
      // 在构造时延迟初始化
      this.init()
    }
  }
}

@LazyInit
class User {
  name: string = 'Alice'
}
```

### 9.4. 装饰器顺序

```ts
// ✅ 注意装饰器的执行顺序
function Validate<T extends { new (...args: any[]): {} }>(constructor: T) {
  console.log('验证装饰器')
  return constructor
}

function Log<T extends { new (...args: any[]): {} }>(constructor: T) {
  console.log('日志装饰器')
  return constructor
}

@Validate // 后执行
@Log // 先执行
class User {}

// 输出：
// 日志装饰器
// 验证装饰器
```

## 10. 引用

- [TypeScript Handbook - Decorators][1]
- [TC39 Decorator Proposal][2]
- [TypeScript 5.0 - Decorators][3]
- [Decorator Metadata][4]

[1]: https://www.typescriptlang.org/docs/handbook/decorators.html#class-decorators
[2]: https://github.com/tc39/proposal-decorators
[3]: https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/#decorators
[4]: https://github.com/tc39/proposal-decorator-metadata
