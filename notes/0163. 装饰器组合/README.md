# [0163. 装饰器组合](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0163.%20%E8%A3%85%E9%A5%B0%E5%99%A8%E7%BB%84%E5%90%88)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是装饰器组合？](#3--什么是装饰器组合)
- [4. 🤔 装饰器组合的执行顺序是什么？](#4--装饰器组合的执行顺序是什么)
  - [4.1. 求值顺序（工厂函数）](#41-求值顺序工厂函数)
  - [4.2. 执行顺序（装饰器函数）](#42-执行顺序装饰器函数)
  - [4.3. 顺序的重要性](#43-顺序的重要性)
- [5. 🤔 如何设计可组合的装饰器？](#5--如何设计可组合的装饰器)
  - [5.1. 单一职责](#51-单一职责)
  - [5.2. 保持原方法签名](#52-保持原方法签名)
  - [5.3. 避免副作用](#53-避免副作用)
- [6. 🤔 装饰器组合有哪些常见模式？](#6--装饰器组合有哪些常见模式)
  - [6.1. 洋葱模型](#61-洋葱模型)
  - [6.2. 管道模式](#62-管道模式)
  - [6.3. 条件链模式](#63-条件链模式)
  - [6.4. 增强模式](#64-增强模式)
- [7. 🤔 使用装饰器组合需要注意什么？](#7--使用装饰器组合需要注意什么)
  - [7.1. 顺序依赖](#71-顺序依赖)
  - [7.2. 返回值处理](#72-返回值处理)
  - [7.3. 异步方法处理](#73-异步方法处理)
  - [7.4. 装饰器数量](#74-装饰器数量)
  - [7.5. 装饰器冲突](#75-装饰器冲突)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 装饰器组合的概念
- 装饰器组合的执行顺序
- 可组合装饰器的设计原则
- 装饰器组合的常见模式
- 装饰器组合的使用注意事项
- 装饰器组合的最佳实践

## 2. 🫧 评价

装饰器组合是将多个装饰器应用到同一个目标上，实现功能的叠加和增强。

- 装饰器组合遵循「从下到上」的执行顺序，类似函数组合
- 合理的装饰器顺序能确保功能正确执行，顺序错误可能导致失效
- 装饰器应该保持单一职责，通过组合实现复杂功能
- 需要注意装饰器之间的依赖关系和副作用
- 使用组合模式可以创建灵活可重用的装饰器系统

## 3. 🤔 什么是装饰器组合？

装饰器组合是将多个装饰器叠加应用到同一个目标上，实现功能的复合。

```ts
// 多个装饰器组合
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value
  descriptor.value = function (...args: any[]) {
    console.log(`调用 ${propertyKey}`)
    return originalMethod.apply(this, args)
  }
}

function measureTime(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value
  descriptor.value = function (...args: any[]) {
    const start = Date.now()
    const result = originalMethod.apply(this, args)
    console.log(`耗时：${Date.now() - start}ms`)
    return result
  }
}

function validate(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value
  descriptor.value = function (...args: any[]) {
    if (args.length === 0) {
      throw new Error('参数不能为空')
    }
    return originalMethod.apply(this, args)
  }
}

class Service {
  // 组合三个装饰器
  @log
  @measureTime
  @validate
  processData(data: string) {
    console.log('处理数据：', data)
    return data.toUpperCase()
  }
}

const service = new Service()
service.processData('hello')
// 输出：
// 调用 processData
// 处理数据：hello
// 耗时：1ms
```

## 4. 🤔 装饰器组合的执行顺序是什么？

装饰器组合遵循「从下到上」求值，「从上到下」执行的规则。

### 4.1. 求值顺序（工厂函数）

```ts
function first() {
  console.log('1. first 工厂被调用')
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log('4. first 装饰器执行')
  }
}

function second() {
  console.log('2. second 工厂被调用')
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log('3. second 装饰器执行')
  }
}

class Example {
  @first()
  @second()
  method() {}
}

// 输出：
// 1. first 工厂被调用（从上到下求值）
// 2. second 工厂被调用
// 3. second 装饰器执行（从下到上执行）
// 4. first 装饰器执行
```

### 4.2. 执行顺序（装饰器函数）

```ts
function outer(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  console.log('外层装饰器执行')
  const originalMethod = descriptor.value

  descriptor.value = function (...args: any[]) {
    console.log('外层：方法调用前')
    const result = originalMethod.apply(this, args)
    console.log('外层：方法调用后')
    return result
  }
}

function inner(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  console.log('内层装饰器执行')
  const originalMethod = descriptor.value

  descriptor.value = function (...args: any[]) {
    console.log('内层：方法调用前')
    const result = originalMethod.apply(this, args)
    console.log('内层：方法调用后')
    return result
  }
}

class Example {
  @outer
  @inner
  method() {
    console.log('方法本身执行')
  }
}

// 装饰器执行顺序：
// 内层装饰器执行
// 外层装饰器执行

const example = new Example()
example.method()
// 运行时执行顺序：
// 外层：方法调用前
// 内层：方法调用前
// 方法本身执行
// 内层：方法调用后
// 外层：方法调用后
```

### 4.3. 顺序的重要性

```ts
// 装饰器顺序会影响最终行为
function cache(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value
  const cacheMap = new Map()

  descriptor.value = function (...args: any[]) {
    const key = JSON.stringify(args)
    if (cacheMap.has(key)) {
      console.log('返回缓存')
      return cacheMap.get(key)
    }
    const result = originalMethod.apply(this, args)
    cacheMap.set(key, result)
    return result
  }
}

function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value
  descriptor.value = function (...args: any[]) {
    console.log(`调用 ${propertyKey}，参数：`, args)
    return originalMethod.apply(this, args)
  }
}

class Service {
  // 正确顺序：cache 在外层
  @cache
  @log
  method1(n: number) {
    console.log('计算中...')
    return n * 2
  }

  // 错误顺序：log 在外层
  @log
  @cache
  method2(n: number) {
    console.log('计算中...')
    return n * 2
  }
}

const service = new Service()

console.log('=== method1 ===')
service.method1(5) // 调用 method1，参数：[5]  计算中...
service.method1(5) // 返回缓存（不会记录日志）

console.log('=== method2 ===')
service.method2(5) // 调用 method2，参数：[5]  计算中...
service.method2(5) // 调用 method2，参数：[5]  返回缓存
```

## 5. 🤔 如何设计可组合的装饰器？

可组合的装饰器应该遵循单一职责原则，不依赖其他装饰器的存在。

### 5.1. 单一职责

```ts
// 每个装饰器只做一件事
function readonly(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  descriptor.writable = false
  return descriptor
}

function enumerable(value: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.enumerable = value
    return descriptor
  }
}

function configurable(value: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.configurable = value
    return descriptor
  }
}

class Example {
  @readonly
  @enumerable(false)
  @configurable(false)
  get value() {
    return 'constant'
  }
}
```

### 5.2. 保持原方法签名

```ts
// 装饰器应该保持原方法的类型签名
function decorator(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value

  // 保持原方法的 this 上下文和参数类型
  descriptor.value = function (this: any, ...args: any[]) {
    // 装饰逻辑
    return originalMethod.apply(this, args)
  }

  return descriptor
}
```

### 5.3. 避免副作用

```ts
// 避免修改全局状态或影响其他方法
const globalState = { count: 0 }

// ❌ 不好的设计：有全局副作用
function badDecorator(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  globalState.count++ // 污染全局状态
}

// 正确设计：使用 WeakMap 隔离状态
const decoratorState = new WeakMap()

function goodDecorator(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  if (!decoratorState.has(target)) {
    decoratorState.set(target, { count: 0 })
  }
  const state = decoratorState.get(target)
  state.count++
}
```

## 6. 🤔 装饰器组合有哪些常见模式？

### 6.1. 洋葱模型

```ts
// 装饰器像洋葱层一样包裹方法
function middleware1(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value
  descriptor.value = function (...args: any[]) {
    console.log('中间件1：进入')
    const result = originalMethod.apply(this, args)
    console.log('中间件1：退出')
    return result
  }
}

function middleware2(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value
  descriptor.value = function (...args: any[]) {
    console.log('中间件2：进入')
    const result = originalMethod.apply(this, args)
    console.log('中间件2：退出')
    return result
  }
}

function middleware3(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value
  descriptor.value = function (...args: any[]) {
    console.log('中间件3：进入')
    const result = originalMethod.apply(this, args)
    console.log('中间件3：退出')
    return result
  }
}

class Service {
  @middleware1
  @middleware2
  @middleware3
  process() {
    console.log('核心逻辑执行')
  }
}

const service = new Service()
service.process()
// 输出：
// 中间件1：进入
// 中间件2：进入
// 中间件3：进入
// 核心逻辑执行
// 中间件3：退出
// 中间件2：退出
// 中间件1：退出
```

### 6.2. 管道模式

```ts
// 装饰器形成数据处理管道
function trim(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value
  descriptor.value = function (input: string) {
    console.log('管道1：去除空格')
    const result = originalMethod.call(this, input.trim())
    return result
  }
}

function lowercase(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value
  descriptor.value = function (input: string) {
    console.log('管道2：转小写')
    const result = originalMethod.call(this, input.toLowerCase())
    return result
  }
}

function removeDuplicates(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value
  descriptor.value = function (input: string) {
    console.log('管道3：去重')
    const unique = Array.from(new Set(input.split(''))).join('')
    return originalMethod.call(this, unique)
  }
}

class TextProcessor {
  @trim
  @lowercase
  @removeDuplicates
  process(text: string) {
    console.log('最终处理：', text)
    return text
  }
}

const processor = new TextProcessor()
processor.process('  HELLO WORLD  ')
// 输出：
// 管道1：去除空格
// 管道2：转小写
// 管道3：去重
// 最终处理：helo wrd
```

### 6.3. 条件链模式

```ts
// 装饰器形成条件判断链
function requireAuth(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value
  descriptor.value = function (this: any, ...args: any[]) {
    if (!this.isAuthenticated()) {
      throw new Error('未认证')
    }
    return originalMethod.apply(this, args)
  }
}

function requireRole(role: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value
    descriptor.value = function (this: any, ...args: any[]) {
      if (this.getRole() !== role) {
        throw new Error(`需要 ${role} 角色`)
      }
      return originalMethod.apply(this, args)
    }
  }
}

function requirePermission(permission: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value
    descriptor.value = function (this: any, ...args: any[]) {
      if (!this.hasPermission(permission)) {
        throw new Error(`需要 ${permission} 权限`)
      }
      return originalMethod.apply(this, args)
    }
  }
}

class AdminController {
  isAuthenticated() {
    return true
  }
  getRole() {
    return 'admin'
  }
  hasPermission(perm: string) {
    return true
  }

  @requireAuth
  @requireRole('admin')
  @requirePermission('delete:users')
  deleteUser(id: number) {
    console.log(`删除用户 ${id}`)
  }
}
```

### 6.4. 增强模式

```ts
// 装饰器逐步增强方法功能
function retry(times: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value
    descriptor.value = async function (...args: any[]) {
      for (let i = 0; i < times; i++) {
        try {
          return await originalMethod.apply(this, args)
        } catch (error) {
          if (i === times - 1) throw error
          console.log(`重试 ${i + 1}/${times}`)
        }
      }
    }
  }
}

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
          setTimeout(() => reject(new Error('超时')), ms)
        ),
      ])
    }
  }
}

function cache(ttl: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value
    const cacheMap = new Map()

    descriptor.value = async function (...args: any[]) {
      const key = JSON.stringify(args)
      const cached = cacheMap.get(key)

      if (cached && Date.now() - cached.timestamp < ttl) {
        return cached.value
      }

      const value = await originalMethod.apply(this, args)
      cacheMap.set(key, { value, timestamp: Date.now() })
      return value
    }
  }
}

class ApiService {
  // 组合多个增强功能
  @cache(60000) // 缓存1分钟
  @timeout(5000) // 5秒超时
  @retry(3) // 重试3次
  async fetchData(url: string) {
    const response = await fetch(url)
    return response.json()
  }
}
```

## 7. 🤔 使用装饰器组合需要注意什么？

### 7.1. 顺序依赖

::: code-group

```ts [❌ 错误顺序]
// 缓存应该在最外层，否则会缓存日志输出
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value
  descriptor.value = function (...args: any[]) {
    console.log('执行中...')
    return originalMethod.apply(this, args)
  }
}

function cache(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value
  const cacheMap = new Map()

  descriptor.value = function (...args: any[]) {
    const key = JSON.stringify(args)
    if (cacheMap.has(key)) {
      return cacheMap.get(key)
    }
    const result = originalMethod.apply(this, args)
    cacheMap.set(key, result)
    return result
  }
}

class Service {
  // ❌ 错误：每次都会记录日志，即使返回缓存
  @log
  @cache
  method(n: number) {
    return n * 2
  }
}
```

```ts [✅ 正确顺序]
// 缓存在最外层
class Service {
  @cache
  @log
  method(n: number) {
    return n * 2
  }
}

const service = new Service()
service.method(5) // 执行中...
service.method(5) // 无输出（直接返回缓存）
```

:::

### 7.2. 返回值处理

```ts
// 确保所有装饰器正确传递返回值
function decorator1(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value
  descriptor.value = function (...args: any[]) {
    const result = originalMethod.apply(this, args)
    // 必须返回结果
    return result
  }
}

function decorator2(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value
  descriptor.value = function (...args: any[]) {
    const result = originalMethod.apply(this, args)
    // ❌ 如果忘记返回，会导致方法返回 undefined
    return result
  }
}
```

### 7.3. 异步方法处理

```ts
// 异步装饰器需要正确处理 Promise
function asyncDecorator(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value

  descriptor.value = async function (...args: any[]) {
    console.log('开始')
    // 必须 await 或返回 Promise
    const result = await originalMethod.apply(this, args)
    console.log('结束')
    return result
  }
}

class Service {
  @asyncDecorator
  async fetchData() {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return 'data'
  }
}
```

### 7.4. 装饰器数量

```ts
// 避免过度使用装饰器
class Service {
  // ⚠️ 太多装饰器可能降低可读性和性能
  @decorator1
  @decorator2
  @decorator3
  @decorator4
  @decorator5
  @decorator6
  @decorator7
  method() {}
}

// 考虑将相关装饰器组合成一个
function combined(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  // 内部组合多个装饰器的逻辑
}

class Service {
  @combined
  method() {}
}
```

### 7.5. 装饰器冲突

```ts
// 避免装饰器之间的冲突
function makeReadonly(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  descriptor.writable = false
}

function makeWritable(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  descriptor.writable = true
}

class Example {
  // ⚠️ 冲突：两个装饰器互相覆盖
  @makeReadonly // 后执行，最终生效
  @makeWritable // 先执行，被覆盖
  method() {}
}
```

## 8. 🔗 引用

- [TypeScript Handbook - Decorator Composition][1]
- [TC39 Decorator Proposal][2]
- [Design Patterns - Decorator Pattern][3]
- [Functional Composition][4]

[1]: https://www.typescriptlang.org/docs/handbook/decorators.html#decorator-composition
[2]: https://github.com/tc39/proposal-decorators
[3]: https://refactoring.guru/design-patterns/decorator
[4]: https://en.wikipedia.org/wiki/Function_composition
