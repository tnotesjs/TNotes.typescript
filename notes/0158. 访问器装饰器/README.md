# [0158. 访问器装饰器](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0158.%20%E8%AE%BF%E9%97%AE%E5%99%A8%E8%A3%85%E9%A5%B0%E5%99%A8)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是访问器装饰器？](#3--什么是访问器装饰器)
- [4. 🤔 访问器装饰器的基本语法是什么？](#4--访问器装饰器的基本语法是什么)
  - [4.1. 参数说明](#41-参数说明)
  - [4.2. 属性描述符详解](#42-属性描述符详解)
- [5. 🤔 访问器装饰器如何修改访问器行为？](#5--访问器装饰器如何修改访问器行为)
  - [5.1. 添加日志记录](#51-添加日志记录)
  - [5.2. 数据验证](#52-数据验证)
  - [5.3. 属性缓存](#53-属性缓存)
  - [5.4. 只读属性](#54-只读属性)
- [6. 🤔 访问器装饰器有哪些实际应用场景？](#6--访问器装饰器有哪些实际应用场景)
  - [6.1. 自动通知变化](#61-自动通知变化)
  - [6.2. 延迟计算](#62-延迟计算)
  - [6.3. 访问控制](#63-访问控制)
  - [6.4. 格式化输出](#64-格式化输出)
- [7. 🤔 使用访问器装饰器时需要注意什么？](#7--使用访问器装饰器时需要注意什么)
  - [7.1. 不能同时装饰 getter 和 setter](#71-不能同时装饰-getter-和-setter)
  - [7.2. 装饰器应用顺序](#72-装饰器应用顺序)
  - [7.3. 保持 this 上下文](#73-保持-this-上下文)
  - [7.4. 处理缺失的访问器](#74-处理缺失的访问器)
  - [7.5. 访问器与属性的区别](#75-访问器与属性的区别)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 访问器装饰器的定义和本质
- 访问器装饰器的基本语法
- 访问器装饰器的参数说明
- 修改访问器行为的方式
- 访问器装饰器的实际应用场景
- 访问器装饰器的使用注意事项

## 2. 🫧 评价

访问器装饰器应用于类的 getter 或 setter 访问器，用于监控、修改或替换访问器定义。

- 访问器装饰器常用于属性验证、缓存、日志记录等场景
- 不能同时为一个属性的 getter 和 setter 添加装饰器
- 装饰器优先应用于文档顺序中的第一个访问器
- 通过修改属性描述符可以完全控制属性的读写行为
- 访问器装饰器的语法和方法装饰器完全相同

## 3. 🤔 什么是访问器装饰器？

访问器装饰器是应用在类访问器声明上的函数，用于观察、修改或替换访问器定义。

```ts
// 访问器装饰器的本质
function enumerable(value: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.enumerable = value
  }
}

class Person {
  private _name: string = ''

  @enumerable(true)
  get name() {
    return this._name
  }

  set name(value: string) {
    this._name = value
  }
}

const person = new Person()
person.name = 'Alice'
console.log(Object.keys(person)) // ['_name', 'name']
```

## 4. 🤔 访问器装饰器的基本语法是什么？

访问器装饰器接收三个参数，与方法装饰器的参数完全相同。

### 4.1. 参数说明

```ts
// 访问器装饰器的完整参数
function accessorDecorator(
  target: any, // 静态访问器是类的构造函数，实例访问器是类的原型对象
  propertyKey: string | symbol, // 访问器的名称
  descriptor: PropertyDescriptor // 访问器的属性描述符
): PropertyDescriptor | void {
  // 装饰器逻辑
}

class Example {
  private _value: number = 0

  // 实例访问器
  @accessorDecorator
  get value() {
    return this._value
  }

  // 静态访问器
  @accessorDecorator
  static get config() {
    return { version: '1.0' }
  }
}
```

### 4.2. 属性描述符详解

```ts
// 访问器的属性描述符
function logAccessor(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  console.log({
    get: descriptor.get, // getter 函数
    set: descriptor.set, // setter 函数
    enumerable: descriptor.enumerable, // false
    configurable: descriptor.configurable, // true
  })
}

class User {
  private _age: number = 0

  @logAccessor
  get age() {
    return this._age
  }

  set age(value: number) {
    this._age = value
  }
}
```

## 5. 🤔 访问器装饰器如何修改访问器行为？

通过修改属性描述符可以完全控制访问器的行为。

### 5.1. 添加日志记录

```ts
// 记录属性访问
function logAccess(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalGet = descriptor.get
  const originalSet = descriptor.set

  if (originalGet) {
    descriptor.get = function () {
      const result = originalGet.call(this)
      console.log(`[GET] ${propertyKey} = ${result}`)
      return result
    }
  }

  if (originalSet) {
    descriptor.set = function (value: any) {
      console.log(`[SET] ${propertyKey} = ${value}`)
      originalSet.call(this, value)
    }
  }

  return descriptor
}

class Product {
  private _price: number = 0

  @logAccess
  get price() {
    return this._price
  }

  set price(value: number) {
    this._price = value
  }
}

const product = new Product()
product.price = 100 // [SET] price = 100
console.log(product.price) // [GET] price = 100
```

### 5.2. 数据验证

```ts
// 验证属性值
function validate(min: number, max: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalSet = descriptor.set

    if (originalSet) {
      descriptor.set = function (value: number) {
        if (typeof value !== 'number') {
          throw new TypeError(`${propertyKey} 必须是数字`)
        }

        if (value < min || value > max) {
          throw new RangeError(`${propertyKey} 必须在 ${min} 到 ${max} 之间`)
        }

        originalSet.call(this, value)
      }
    }

    return descriptor
  }
}

class Score {
  private _value: number = 0

  get value() {
    return this._value
  }

  @validate(0, 100)
  set value(score: number) {
    this._value = score
  }
}

const score = new Score()
score.value = 95 // 正常
// score.value = 150;  // ❌ RangeError
// score.value = -10;  // ❌ RangeError
```

### 5.3. 属性缓存

```ts
// 缓存计算结果
function memoize(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalGet = descriptor.get

  if (!originalGet) {
    return descriptor
  }

  let cachedValue: any
  let isCached = false

  descriptor.get = function () {
    if (isCached) {
      console.log(`[CACHE] 返回缓存的 ${propertyKey}`)
      return cachedValue
    }

    cachedValue = originalGet.call(this)
    isCached = true
    console.log(`[CACHE] 缓存 ${propertyKey}`)

    return cachedValue
  }

  return descriptor
}

class Circle {
  constructor(public radius: number) {}

  @memoize
  get area() {
    console.log('计算面积')
    return Math.PI * this.radius * this.radius
  }
}

const circle = new Circle(5)
console.log(circle.area) // 计算面积 + 缓存
console.log(circle.area) // 直接返回缓存
```

### 5.4. 只读属性

```ts
// 将 setter 设置为不可用
function readonly(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  descriptor.writable = false

  if (descriptor.set) {
    descriptor.set = function () {
      throw new Error(`${propertyKey} 是只读属性`)
    }
  }

  return descriptor
}

class Config {
  private _apiUrl: string = 'https://api.example.com'

  @readonly
  get apiUrl() {
    return this._apiUrl
  }

  set apiUrl(value: string) {
    this._apiUrl = value
  }
}

const config = new Config()
console.log(config.apiUrl)
// config.apiUrl = 'new-url';  // ❌ Error: apiUrl 是只读属性
```

## 6. 🤔 访问器装饰器有哪些实际应用场景？

### 6.1. 自动通知变化

```ts
// 属性变化时自动通知观察者
function observable(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalSet = descriptor.set

  if (!originalSet) {
    return descriptor
  }

  descriptor.set = function (value: any) {
    const oldValue = (this as any)[`_${propertyKey}`]
    originalSet.call(this, value)

    if (oldValue !== value) {
      // 触发变化事件
      if (typeof (this as any).notifyChange === 'function') {
        ;(this as any).notifyChange(propertyKey, oldValue, value)
      }
    }
  }

  return descriptor
}

class Store {
  private _count: number = 0

  @observable
  get count() {
    return this._count
  }

  set count(value: number) {
    this._count = value
  }

  notifyChange(prop: string, oldValue: any, newValue: any) {
    console.log(`${prop} 从 ${oldValue} 变为 ${newValue}`)
  }
}

const store = new Store()
store.count = 1 // count 从 0 变为 1
store.count = 2 // count 从 1 变为 2
```

### 6.2. 延迟计算

```ts
// 延迟计算属性值
function lazy(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalGet = descriptor.get

  if (!originalGet) {
    return descriptor
  }

  const cacheKey = `_lazy_${propertyKey}`

  descriptor.get = function () {
    if (!(cacheKey in this)) {
      console.log(`首次计算 ${propertyKey}`)
      Object.defineProperty(this, cacheKey, {
        value: originalGet.call(this),
        writable: false,
        configurable: false,
        enumerable: false,
      })
    }

    return (this as any)[cacheKey]
  }

  return descriptor
}

class ExpensiveComputation {
  constructor(public data: number[]) {}

  @lazy
  get sum() {
    console.log('计算总和')
    return this.data.reduce((a, b) => a + b, 0)
  }

  @lazy
  get average() {
    console.log('计算平均值')
    return this.sum / this.data.length
  }
}

const comp = new ExpensiveComputation([1, 2, 3, 4, 5])
console.log(comp.sum) // 首次计算并缓存
console.log(comp.sum) // 直接返回缓存
console.log(comp.average) // 使用缓存的 sum
```

### 6.3. 访问控制

```ts
// 检查访问权限
function requireAuth(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalGet = descriptor.get

  if (!originalGet) {
    return descriptor
  }

  descriptor.get = function () {
    if (!(this as any).isAuthenticated) {
      throw new Error(`访问 ${propertyKey} 需要身份验证`)
    }

    return originalGet.call(this)
  }

  return descriptor
}

class SecureData {
  isAuthenticated: boolean = false
  private _secret: string = 'top-secret'

  @requireAuth
  get secret() {
    return this._secret
  }
}

const data = new SecureData()
// console.log(data.secret);  // ❌ Error: 访问 secret 需要身份验证

data.isAuthenticated = true
console.log(data.secret) // 'top-secret'
```

### 6.4. 格式化输出

```ts
// 格式化属性值
function format(formatter: (value: any) => any) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalGet = descriptor.get

    if (!originalGet) {
      return descriptor
    }

    descriptor.get = function () {
      const value = originalGet.call(this)
      return formatter(value)
    }

    return descriptor
  }
}

class User {
  constructor(private firstName: string, private lastName: string) {}

  @format((name: string) => name.toUpperCase())
  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }
}

const user = new User('john', 'doe')
console.log(user.fullName) // 'JOHN DOE'
```

## 7. 🤔 使用访问器装饰器时需要注意什么？

### 7.1. 不能同时装饰 getter 和 setter

::: code-group

```ts [❌ 错误示例]
// 不能同时为 getter 和 setter 添加装饰器
class Example {
  private _value: number = 0

  @log // ❌ 错误
  get value() {
    return this._value
  }

  @log // ❌ 错误：重复的装饰器
  set value(v: number) {
    this._value = v
  }
}
```

```ts [✅ 正确示例]
// 只装饰一个访问器
class Example {
  private _value: number = 0

  @log
  get value() {
    return this._value
  }

  set value(v: number) {
    this._value = v
  }
}
```

:::

### 7.2. 装饰器应用顺序

```ts
// 装饰器按照文档顺序应用于第一个访问器
class Example {
  private _value: number = 0

  // 装饰器应用于 getter
  @log
  get value() {
    return this._value
  }

  // 这个 setter 也会被装饰器影响
  set value(v: number) {
    this._value = v
  }
}
```

### 7.3. 保持 this 上下文

```ts
// 确保正确处理 this
function decorator(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalGet = descriptor.get

  if (originalGet) {
    descriptor.get = function () {
      // 使用 call 保持 this 上下文
      return originalGet.call(this)
    }
  }
}
```

### 7.4. 处理缺失的访问器

```ts
// 检查访问器是否存在
function safeDecorator(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  if (!descriptor.get && !descriptor.set) {
    console.warn(`${propertyKey} 没有 getter 或 setter`)
    return descriptor
  }

  if (descriptor.get) {
    const originalGet = descriptor.get
    descriptor.get = function () {
      return originalGet.call(this)
    }
  }

  return descriptor
}
```

### 7.5. 访问器与属性的区别

::: code-group

```ts [访问器]
// 访问器可以添加逻辑
class Example {
  private _value: number = 0

  @decorator
  get value() {
    // 可以添加逻辑
    console.log('getting value')
    return this._value
  }

  set value(v: number) {
    // 可以添加验证
    if (v < 0) throw new Error('负数无效')
    this._value = v
  }
}
```

```ts [普通属性]
// 普通属性不能直接添加装饰器来修改行为
class Example {
  @decorator // 这是属性装饰器，功能有限
  value: number = 0
}
```

:::

## 8. 🔗 引用

- [TypeScript Handbook - Accessor Decorators][1]
- [TC39 Decorator Proposal][2]
- [Property Descriptors][3]
- [Accessor vs Property Decorators][4]

[1]: https://www.typescriptlang.org/docs/handbook/decorators.html#accessor-decorators
[2]: https://github.com/tc39/proposal-decorators
[3]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
[4]: https://www.typescriptlang.org/docs/handbook/decorators.html
