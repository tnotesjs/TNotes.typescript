# [0157. 方法装饰器](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0157.%20%E6%96%B9%E6%B3%95%E8%A3%85%E9%A5%B0%E5%99%A8)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 什么是方法装饰器？](#3-什么是方法装饰器)
- [4. 方法装饰器的基本语法是什么？](#4-方法装饰器的基本语法是什么)
  - [4.1. 参数说明](#41-参数说明)
  - [4.2. 属性描述符详解](#42-属性描述符详解)
- [5. 方法装饰器如何修改方法行为？](#5-方法装饰器如何修改方法行为)
  - [5.1. 添加日志记录](#51-添加日志记录)
  - [5.2. 性能监控](#52-性能监控)
  - [5.3. 参数验证](#53-参数验证)
  - [5.4. 方法缓存](#54-方法缓存)
  - [5.5. 异常处理](#55-异常处理)
- [6. 方法装饰器有哪些实际应用场景？](#6-方法装饰器有哪些实际应用场景)
  - [6.1. 权限控制](#61-权限控制)
  - [6.2. 重试机制](#62-重试机制)
  - [6.3. 防抖和节流](#63-防抖和节流)
  - [6.4. 废弃警告](#64-废弃警告)
- [7. 使用方法装饰器时需要注意什么？](#7-使用方法装饰器时需要注意什么)
  - [7.1. 保持 this 上下文](#71-保持-this-上下文)
  - [7.2. 处理异步方法](#72-处理异步方法)
  - [7.3. 类型安全](#73-类型安全)
  - [7.4. 装饰器执行顺序](#74-装饰器执行顺序)
  - [7.5. 避免修改原型](#75-避免修改原型)
- [8. 引用](#8-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 方法装饰器的定义和本质
- 方法装饰器的基本语法
- 方法装饰器的参数说明
- 修改方法行为的方式
- 方法装饰器的实际应用场景
- 方法装饰器的使用注意事项

## 2. 评价

方法装饰器是最常用的装饰器类型，主要用于对类方法进行增强和修改。

- 方法装饰器广泛应用于日志记录、性能监控、权限控制、缓存等场景
- 通过修改属性描述符可以完全控制方法的行为
- 装饰器在类定义时执行，不会影响运行时性能
- 可以通过装饰器工厂传递参数，实现更灵活的配置
- 注意保持 `this` 上下文和原方法的返回值类型

## 3. 什么是方法装饰器？

方法装饰器是应用在类方法声明上的函数，用于观察、修改或替换方法定义。

```ts
// 方法装饰器的本质
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  console.log('装饰的类：', target.constructor.name)
  console.log('装饰的方法：', propertyKey)
  console.log('方法描述符：', descriptor)
}

class Calculator {
  @log
  add(a: number, b: number) {
    return a + b
  }
}

// 输出：
// 装饰的类：Calculator
// 装饰的方法：add
// 方法描述符：{ value: [Function: add], writable: true, enumerable: false, configurable: true }
```

## 4. 方法装饰器的基本语法是什么？

方法装饰器接收三个参数，可以返回新的属性描述符来替换原有方法。

### 4.1. 参数说明

```ts
// 方法装饰器的完整参数
function methodDecorator(
  target: any, // 静态方法是类的构造函数，实例方法是类的原型对象
  propertyKey: string | symbol, // 方法的名称
  descriptor: PropertyDescriptor, // 方法的属性描述符
): PropertyDescriptor | void {
  // 装饰器逻辑
}

class Example {
  // 实例方法
  @methodDecorator
  instanceMethod() {}

  // 静态方法
  @methodDecorator
  static staticMethod() {}
}
```

### 4.2. 属性描述符详解

```ts
// 属性描述符的结构
interface PropertyDescriptor {
  configurable?: boolean // 是否可以修改描述符或删除属性
  enumerable?: boolean // 是否可枚举
  value?: any // 属性的值（方法函数）
  writable?: boolean // 是否可写
  get?(): any // getter 函数
  set?(v: any): void // setter 函数
}

function inspectDescriptor(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  console.log({
    configurable: descriptor.configurable, // true
    enumerable: descriptor.enumerable, // false（类方法默认不可枚举）
    writable: descriptor.writable, // true
    value: descriptor.value, // 方法函数本身
  })
}

class User {
  @inspectDescriptor
  greet() {
    return 'Hello'
  }
}
```

## 5. 方法装饰器如何修改方法行为？

通过修改属性描述符可以完全控制方法的行为。

### 5.1. 添加日志记录

```ts
// 记录方法调用
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value

  descriptor.value = function (...args: any[]) {
    console.log(`[LOG] 调用 ${propertyKey}`)
    console.log('[LOG] 参数：', args)

    const result = originalMethod.apply(this, args)

    console.log('[LOG] 返回值：', result)
    return result
  }

  return descriptor
}

class Calculator {
  @log
  add(a: number, b: number) {
    return a + b
  }
}

const calc = new Calculator()
calc.add(2, 3)
// 输出：
// [LOG] 调用 add
// [LOG] 参数：[2, 3]
// [LOG] 返回值：5
```

### 5.2. 性能监控

```ts
// 测量方法执行时间
function measureTime(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value

  descriptor.value = function (...args: any[]) {
    const start = performance.now()
    const result = originalMethod.apply(this, args)
    const end = performance.now()

    console.log(`${propertyKey} 执行耗时：${(end - start).toFixed(2)}ms`)
    return result
  }

  return descriptor
}

class DataProcessor {
  @measureTime
  processLargeArray(size: number) {
    const arr = Array.from({ length: size }, (_, i) => i)
    return arr.reduce((sum, n) => sum + n, 0)
  }
}

const processor = new DataProcessor()
processor.processLargeArray(1000000)
// 输出：processLargeArray 执行耗时：15.23ms
```

### 5.3. 参数验证

```ts
// 验证方法参数
function validate(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value

  descriptor.value = function (...args: any[]) {
    // 验证参数是否为数字
    if (args.some((arg) => typeof arg !== 'number')) {
      throw new TypeError(`${propertyKey} 的参数必须是数字`)
    }

    // 验证参数是否为正数
    if (args.some((arg) => arg <= 0)) {
      throw new RangeError(`${propertyKey} 的参数必须是正数`)
    }

    return originalMethod.apply(this, args)
  }

  return descriptor
}

class MathOperations {
  @validate
  divide(a: number, b: number) {
    return a / b
  }
}

const math = new MathOperations()
console.log(math.divide(10, 2)) // 5
// math.divide(10, -2);              // ❌ RangeError
// math.divide(10, '2' as any);      // ❌ TypeError
```

### 5.4. 方法缓存

```ts
// 缓存方法结果
function memoize(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value
  const cache = new Map<string, any>()

  descriptor.value = function (...args: any[]) {
    const key = JSON.stringify(args)

    if (cache.has(key)) {
      console.log(`[CACHE] 返回缓存结果 ${propertyKey}(${key})`)
      return cache.get(key)
    }

    const result = originalMethod.apply(this, args)
    cache.set(key, result)
    console.log(`[CACHE] 缓存结果 ${propertyKey}(${key})`)

    return result
  }

  return descriptor
}

class Fibonacci {
  @memoize
  calculate(n: number): number {
    if (n <= 1) return n
    return this.calculate(n - 1) + this.calculate(n - 2)
  }
}

const fib = new Fibonacci()
console.log(fib.calculate(10)) // 第一次计算并缓存
console.log(fib.calculate(10)) // 直接返回缓存结果
```

### 5.5. 异常处理

```ts
// 统一异常处理
function catchError(errorHandler?: (error: Error) => void) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args)
      } catch (error) {
        console.error(`[ERROR] ${propertyKey} 方法执行失败：`, error)

        if (errorHandler) {
          errorHandler(error as Error)
        }

        throw error
      }
    }

    return descriptor
  }
}

class ApiService {
  @catchError((error) => {
    // 发送错误日志到监控系统
    console.log('发送错误到监控系统')
  })
  async fetchData(url: string) {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    return response.json()
  }
}
```

## 6. 方法装饰器有哪些实际应用场景？

### 6.1. 权限控制

```ts
// 检查用户权限
interface User {
  role: string
}

function requireRole(role: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value

    descriptor.value = function (this: any, ...args: any[]) {
      // 假设 this.currentUser 包含当前用户信息
      const user: User = this.currentUser

      if (!user || user.role !== role) {
        throw new Error(`权限不足，需要 ${role} 角色`)
      }

      return originalMethod.apply(this, args)
    }

    return descriptor
  }
}

class AdminPanel {
  currentUser: User = { role: 'user' }

  @requireRole('admin')
  deleteUser(userId: number) {
    console.log(`删除用户 ${userId}`)
  }

  @requireRole('admin')
  updateSettings(settings: any) {
    console.log('更新设置', settings)
  }
}

const panel = new AdminPanel()
try {
  panel.deleteUser(123)
} catch (error) {
  console.error(error.message) // 权限不足，需要 admin 角色
}
```

### 6.2. 重试机制

```ts
// 失败自动重试
function retry(times: number = 3, delay: number = 1000) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      let lastError: Error

      for (let i = 0; i < times; i++) {
        try {
          return await originalMethod.apply(this, args)
        } catch (error) {
          lastError = error as Error
          console.log(`[RETRY] ${propertyKey} 第 ${i + 1} 次尝试失败`)

          if (i < times - 1) {
            await new Promise((resolve) => setTimeout(resolve, delay))
          }
        }
      }

      throw lastError!
    }

    return descriptor
  }
}

class NetworkService {
  @retry(3, 1000)
  async fetchData(url: string) {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    return response.json()
  }
}
```

### 6.3. 防抖和节流

```ts
// 防抖装饰器
function debounce(delay: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value
    let timeoutId: NodeJS.Timeout

    descriptor.value = function (...args: any[]) {
      clearTimeout(timeoutId)

      timeoutId = setTimeout(() => {
        originalMethod.apply(this, args)
      }, delay)
    }

    return descriptor
  }
}

// 节流装饰器
function throttle(delay: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value
    let lastCall = 0

    descriptor.value = function (...args: any[]) {
      const now = Date.now()

      if (now - lastCall >= delay) {
        lastCall = now
        return originalMethod.apply(this, args)
      }
    }

    return descriptor
  }
}

class SearchBox {
  @debounce(300)
  onSearch(keyword: string) {
    console.log('搜索：', keyword)
  }

  @throttle(1000)
  onScroll(position: number) {
    console.log('滚动位置：', position)
  }
}
```

### 6.4. 废弃警告

```ts
// 标记废弃方法
function deprecated(message?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value

    descriptor.value = function (...args: any[]) {
      console.warn(
        `[DEPRECATED] ${target.constructor.name}.${propertyKey} 已废弃。` +
          (message ? ` ${message}` : ''),
      )

      return originalMethod.apply(this, args)
    }

    return descriptor
  }
}

class OldApi {
  @deprecated('请使用 getUsers() 方法')
  getUserList() {
    return ['Alice', 'Bob']
  }

  getUsers() {
    return ['Alice', 'Bob']
  }
}

const api = new OldApi()
api.getUserList() // 警告：[DEPRECATED] OldApi.getUserList 已废弃。请使用 getUsers() 方法
```

## 7. 使用方法装饰器时需要注意什么？

### 7.1. 保持 this 上下文

::: code-group

```ts [❌ 错误示例]
// 丢失 this 上下文
function badDecorator(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value

  // ❌ 使用箭头函数会丢失 this
  descriptor.value = (...args: any[]) => {
    console.log(this) // undefined
    return originalMethod(...args)
  }
}
```

```ts [✅ 正确示例]
// 保持 this 上下文
function goodDecorator(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value

  // 使用普通函数保持 this
  descriptor.value = function (...args: any[]) {
    console.log(this) // 指向实例
    return originalMethod.apply(this, args)
  }
}
```

:::

### 7.2. 处理异步方法

```ts
// 正确处理异步方法
function asyncLog(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value

  descriptor.value = async function (...args: any[]) {
    console.log(`[START] ${propertyKey}`)

    try {
      const result = await originalMethod.apply(this, args)
      console.log(`[SUCCESS] ${propertyKey}`)
      return result
    } catch (error) {
      console.error(`[ERROR] ${propertyKey}:`, error)
      throw error
    }
  }

  return descriptor
}

class AsyncService {
  @asyncLog
  async fetchData() {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return 'data'
  }
}
```

### 7.3. 类型安全

```ts
// 使用泛型保持类型安全
function typedDecorator<T extends (...args: any[]) => any>() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>,
  ): TypedPropertyDescriptor<T> {
    const originalMethod = descriptor.value!

    descriptor.value = function (...args: Parameters<T>): ReturnType<T> {
      console.log('调用方法')
      return originalMethod.apply(this, args) as ReturnType<T>
    } as T

    return descriptor
  }
}

class TypedClass {
  @typedDecorator<(a: number, b: number) => number>()
  add(a: number, b: number) {
    return a + b
  }
}
```

### 7.4. 装饰器执行顺序

```ts
// 多个装饰器的执行顺序
function first() {
  console.log('first 装饰器工厂调用')
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    console.log('first 装饰器执行')
  }
}

function second() {
  console.log('second 装饰器工厂调用')
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    console.log('second 装饰器执行')
  }
}

class Example {
  @first()
  @second()
  method() {}
}

// 输出顺序：
// first 装饰器工厂调用
// second 装饰器工厂调用
// second 装饰器执行（从下到上）
// first 装饰器执行
```

### 7.5. 避免修改原型

::: code-group

```ts [❌ 错误示例]
// 直接修改原型可能影响其他实例
function badModify(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  target[propertyKey] = function () {
    console.log('修改了原型')
  }
}
```

```ts [✅ 正确示例]
// 通过描述符修改
function goodModify(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value

  descriptor.value = function (...args: any[]) {
    console.log('通过描述符修改')
    return originalMethod.apply(this, args)
  }

  return descriptor
}
```

:::

## 8. 引用

- [TypeScript Handbook - Method Decorators][1]
- [TC39 Decorator Proposal][2]
- [Understanding Method Decorators][3]
- [Decorator Design Pattern][4]

[1]: https://www.typescriptlang.org/docs/handbook/decorators.html#method-decorators
[2]: https://github.com/tc39/proposal-decorators
[3]: https://www.typescriptlang.org/docs/handbook/decorators.html
[4]: https://refactoring.guru/design-patterns/decorator
