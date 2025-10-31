# [0161. 装饰器的执行顺序](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0161.%20%E8%A3%85%E9%A5%B0%E5%99%A8%E7%9A%84%E6%89%A7%E8%A1%8C%E9%A1%BA%E5%BA%8F)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 装饰器的基本执行顺序是什么？](#3--装饰器的基本执行顺序是什么)
- [4. 🤔 同一目标上多个装饰器如何执行?](#4--同一目标上多个装饰器如何执行)
  - [4.1. 方法装饰器](#41-方法装饰器)
  - [4.2. 类装饰器](#42-类装饰器)
  - [4.3. 参数装饰器](#43-参数装饰器)
- [5. 🤔 类中不同成员的装饰器如何执行？](#5--类中不同成员的装饰器如何执行)
  - [5.1. 详细执行顺序规则](#51-详细执行顺序规则)
  - [5.2. 执行顺序记忆口诀](#52-执行顺序记忆口诀)
- [6. 🤔 装饰器工厂的执行顺序是什么？](#6--装饰器工厂的执行顺序是什么)
  - [6.1. 工厂参数的传递](#61-工厂参数的传递)
- [7. 🤔 继承类的装饰器如何执行？](#7--继承类的装饰器如何执行)
  - [7.1. 继承链中的完整顺序](#71-继承链中的完整顺序)
- [8. 🤔 为什么理解执行顺序很重要？](#8--为什么理解执行顺序很重要)
  - [8.1. 依赖关系处理](#81-依赖关系处理)
  - [8.2. 装饰器链的正确组合](#82-装饰器链的正确组合)
  - [8.3. 避免循环依赖](#83-避免循环依赖)
  - [8.4. 性能优化考虑](#84-性能优化考虑)
- [9. 🔗 引用](#9--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 装饰器的基本执行顺序
- 同一目标上多个装饰器的执行顺序
- 类中不同成员装饰器的执行顺序
- 装饰器工厂的执行顺序
- 继承类的装饰器执行顺序
- 执行顺序的实际影响

## 2. 🫧 评价

装饰器的执行顺序遵循明确的规则，理解这些规则对于正确使用装饰器至关重要。

- 装饰器在类定义时就会执行，不是在实例化时执行
- 同一位置的多个装饰器遵循「从内到外」的执行顺序
- 不同成员的装饰器执行顺序固定：参数 → 方法/访问器/属性 → 类
- 装饰器工厂会先于装饰器本身执行，顺序为「从外到内」
- 继承链中的装饰器会按照父类到子类的顺序执行

## 3. 🤔 装饰器的基本执行顺序是什么？

装饰器在类定义时立即执行，执行时机早于实例化。

```typescript
console.log('1. 脚本开始')

function ClassDecorator(constructor: Function) {
  console.log('3. 类装饰器执行')
}

function MethodDecorator(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  console.log('2. 方法装饰器执行')
}

console.log('2. 定义类之前')

@ClassDecorator
class Example {
  @MethodDecorator
  method() {
    console.log('5. 方法调用')
  }

  constructor() {
    console.log('4. 构造函数执行')
  }
}

console.log('4. 类定义完成')

const instance = new Example()
instance.method()

console.log('6. 脚本结束')

// 输出顺序：
// 1. 脚本开始
// 2. 定义类之前
// 2. 方法装饰器执行
// 3. 类装饰器执行
// 4. 类定义完成
// 4. 构造函数执行
// 5. 方法调用
// 6. 脚本结束
```

## 4. 🤔 同一目标上多个装饰器如何执行?

同一目标上的多个装饰器按照「从内到外」（从下到上）的顺序执行。

### 4.1. 方法装饰器

```typescript
function First(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  console.log('First 装饰器执行')
}

function Second(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  console.log('Second 装饰器执行')
}

function Third(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  console.log('Third 装饰器执行')
}

class Example {
  @First
  @Second
  @Third
  method() {}
}

// 输出顺序（从下到上）：
// Third 装饰器执行
// Second 装饰器执行
// First 装饰器执行
```

### 4.2. 类装饰器

```typescript
function First<T extends { new (...args: any[]): {} }>(constructor: T) {
  console.log('First 类装饰器执行')
  return constructor
}

function Second<T extends { new (...args: any[]): {} }>(constructor: T) {
  console.log('Second 类装饰器执行')
  return constructor
}

function Third<T extends { new (...args: any[]): {} }>(constructor: T) {
  console.log('Third 类装饰器执行')
  return constructor
}

@First
@Second
@Third
class Example {}

// 输出顺序（从下到上）：
// Third 类装饰器执行
// Second 类装饰器执行
// First 类装饰器执行
```

### 4.3. 参数装饰器

```typescript
function First(
  target: any,
  propertyKey: string | symbol,
  parameterIndex: number
) {
  console.log(`First 参数装饰器执行，索引：${parameterIndex}`)
}

function Second(
  target: any,
  propertyKey: string | symbol,
  parameterIndex: number
) {
  console.log(`Second 参数装饰器执行，索引：${parameterIndex}`)
}

class Example {
  method(@First @Second param: string) {}
}

// 输出顺序（从右到左，即从下到上）：
// Second 参数装饰器执行，索引：0
// First 参数装饰器执行，索引：0
```

## 5. 🤔 类中不同成员的装饰器如何执行？

类中不同成员的装饰器执行顺序固定：参数装饰器 → 成员装饰器 → 类装饰器。

```typescript
function ClassDecorator(constructor: Function) {
  console.log('6. 类装饰器')
}

function PropertyDecorator(target: any, propertyKey: string) {
  console.log(`2. 属性装饰器：${propertyKey}`)
}

function MethodDecorator(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  console.log(`4. 方法装饰器：${propertyKey}`)
}

function ParameterDecorator(
  target: any,
  propertyKey: string | symbol,
  parameterIndex: number
) {
  console.log(`1/3. 参数装饰器：${String(propertyKey)}[${parameterIndex}]`)
}

function AccessorDecorator(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  console.log(`5. 访问器装饰器：${propertyKey}`)
}

@ClassDecorator
class Example {
  @PropertyDecorator
  property: string = 'test'

  @MethodDecorator
  method1(@ParameterDecorator param: string) {}

  @MethodDecorator
  method2(@ParameterDecorator param: string) {}

  @AccessorDecorator
  get value() {
    return this.property
  }
}

// 输出顺序：
// 1/3. 参数装饰器：method1[0]
// 4. 方法装饰器：method1
// 1/3. 参数装饰器：method2[0]
// 4. 方法装饰器：method2
// 2. 属性装饰器：property
// 5. 访问器装饰器：value
// 6. 类装饰器
```

### 5.1. 详细执行顺序规则

```typescript
function logDecorator(type: string) {
  return function (...args: any[]) {
    console.log(`${type} 装饰器执行`)
  }
}

@logDecorator('7. 类')
class CompleteExample {
  // 1. 实例成员的参数装饰器
  @logDecorator('3. 实例方法')
  instanceMethod(@logDecorator('1. 实例方法参数') param: string) {}

  // 2. 实例成员的方法/访问器/属性装饰器
  @logDecorator('2. 实例属性')
  instanceProperty: string = 'test'

  @logDecorator('4. 访问器')
  get accessor() {
    return ''
  }

  // 3. 静态成员的参数装饰器
  @logDecorator('6. 静态方法')
  static staticMethod(@logDecorator('5. 静态方法参数') param: string) {}

  // 4. 静态成员的方法/访问器/属性装饰器
  // （注意：静态成员装饰器在实例成员之后执行）
}

// 完整输出顺序：
// 1. 实例方法参数 装饰器执行
// 3. 实例方法 装饰器执行
// 2. 实例属性 装饰器执行
// 4. 访问器 装饰器执行
// 5. 静态方法参数 装饰器执行
// 6. 静态方法 装饰器执行
// 7. 类 装饰器执行
```

### 5.2. 执行顺序记忆口诀

```typescript
// 执行顺序：
// 1. 实例成员：参数 → 方法/访问器/属性（声明顺序）
// 2. 静态成员：参数 → 方法/访问器/属性（声明顺序）
// 3. 构造函数：参数
// 4. 类装饰器

function P(target: any, key: string | symbol, index: number) {
  console.log(`参数：${String(key)}[${index}]`)
}

function M(target: any, key: string, desc: PropertyDescriptor) {
  console.log(`方法：${key}`)
}

function Prop(target: any, key: string) {
  console.log(`属性：${key}`)
}

function C(constructor: Function) {
  console.log('类装饰器')
}

@C
class Order {
  @Prop prop1: string = '' // 3. 属性：prop1

  @M method1(@P p: string) {} // 1. 参数：method1[0]  2. 方法：method1

  @Prop prop2: string = '' // 4. 属性：prop2

  @M method2(@P p: string) {} // 5. 参数：method2[0]  6. 方法：method2

  @M static staticMethod(@P p: string) {} // 7. 参数：staticMethod[0]  8. 方法：staticMethod

  constructor(@P param: string) {} // 9. 参数：undefined[0]
} // 10. 类装饰器
```

## 6. 🤔 装饰器工厂的执行顺序是什么？

装饰器工厂先执行（从外到内），然后装饰器本身执行（从内到外）。

```typescript
function decoratorFactory(name: string) {
  console.log(`${name} 工厂执行`)

  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log(`${name} 装饰器执行`)
  }
}

class Example {
  @decoratorFactory('First')
  @decoratorFactory('Second')
  @decoratorFactory('Third')
  method() {}
}

// 输出顺序：
// First 工厂执行    （从外到内：工厂调用）
// Second 工厂执行
// Third 工厂执行
// Third 装饰器执行   （从内到外：装饰器执行）
// Second 装饰器执行
// First 装饰器执行
```

### 6.1. 工厂参数的传递

```typescript
function log(message: string) {
  console.log(`1. 工厂被调用，消息：${message}`)

  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log(`2. 装饰器执行，消息：${message}`)
    const originalMethod = descriptor.value

    descriptor.value = function (...args: any[]) {
      console.log(`3. 方法执行前，消息：${message}`)
      const result = originalMethod.apply(this, args)
      console.log(`4. 方法执行后，消息：${message}`)
      return result
    }
  }
}

class Example {
  @log('外层')
  @log('内层')
  method() {
    console.log('方法本身执行')
  }
}

// 输出：
// 1. 工厂被调用，消息：外层
// 1. 工厂被调用，消息：内层
// 2. 装饰器执行，消息：内层
// 2. 装饰器执行，消息：外层

const example = new Example()
example.method()
// 3. 方法执行前，消息：外层
// 3. 方法执行前，消息：内层
// 方法本身执行
// 4. 方法执行后，消息：内层
// 4. 方法执行后，消息：外层
```

## 7. 🤔 继承类的装饰器如何执行？

继承类的装饰器按照父类到子类的顺序执行。

```typescript
function ClassDecorator(name: string) {
  return function (constructor: Function) {
    console.log(`${name} 类装饰器`)
  }
}

function MethodDecorator(name: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log(`${name}.${propertyKey} 方法装饰器`)
  }
}

@ClassDecorator('父类')
class Parent {
  @MethodDecorator('父类')
  parentMethod() {}

  @MethodDecorator('父类')
  overriddenMethod() {}
}

@ClassDecorator('子类')
class Child extends Parent {
  @MethodDecorator('子类')
  childMethod() {}

  @MethodDecorator('子类')
  override overriddenMethod() {}
}

// 输出顺序：
// 父类.parentMethod 方法装饰器
// 父类.overriddenMethod 方法装饰器
// 父类 类装饰器
// 子类.childMethod 方法装饰器
// 子类.overriddenMethod 方法装饰器
// 子类 类装饰器
```

### 7.1. 继承链中的完整顺序

```typescript
function log(target: string) {
  return function (...args: any[]) {
    console.log(target)
  }
}

@log('4. 祖父类装饰器')
class GrandParent {
  @log('1. 祖父方法装饰器')
  method() {}
}

@log('5. 父类装饰器')
class Parent extends GrandParent {
  @log('2. 父类方法装饰器')
  override method() {}
}

@log('6. 子类装饰器')
class Child extends Parent {
  @log('3. 子类方法装饰器')
  override method() {}
}

// 输出顺序：
// 1. 祖父方法装饰器
// 4. 祖父类装饰器
// 2. 父类方法装饰器
// 5. 父类装饰器
// 3. 子类方法装饰器
// 6. 子类装饰器
```

## 8. 🤔 为什么理解执行顺序很重要？

### 8.1. 依赖关系处理

```typescript
import 'reflect-metadata'

// ❌ 错误：方法装饰器依赖参数装饰器的元数据
function WrongOrder() {
  // 这个装饰器假设参数装饰器已经设置了元数据
  function method(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const metadata = Reflect.getMetadata('params', target, propertyKey)
    console.log('方法装饰器读取元数据：', metadata) // 可能为 undefined
  }

  function param(
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number
  ) {
    console.log('参数装饰器设置元数据')
    Reflect.defineMetadata('params', [parameterIndex], target, propertyKey)
  }

  return { method, param }
}

const wrong = WrongOrder()

class Example {
  @wrong.method // 执行时参数元数据还未设置
  test(@wrong.param p: string) {}
}
```

```typescript
// 正确理解：参数装饰器先执行，方法装饰器后执行
function CorrectOrder() {
  function param(
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number
  ) {
    console.log('1. 参数装饰器设置元数据')
    const params = Reflect.getMetadata('params', target, propertyKey) || []
    params.push(parameterIndex)
    Reflect.defineMetadata('params', params, target, propertyKey)
  }

  function method(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log('2. 方法装饰器读取元数据')
    const metadata = Reflect.getMetadata('params', target, propertyKey)
    console.log('读取到的参数索引：', metadata) // [0]
  }

  return { method, param }
}

const correct = CorrectOrder()

class Example {
  @correct.method
  test(@correct.param p: string) {}
}
```

### 8.2. 装饰器链的正确组合

```typescript
// 装饰器按特定顺序组合才能正常工作
function Validate(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value

  descriptor.value = function (...args: any[]) {
    console.log('验证参数')
    return originalMethod.apply(this, args)
  }
}

function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value

  descriptor.value = function (...args: any[]) {
    console.log('记录日志')
    return originalMethod.apply(this, args)
  }
}

function Cache(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value
  const cache = new Map()

  descriptor.value = function (...args: any[]) {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      console.log('返回缓存')
      return cache.get(key)
    }
    const result = originalMethod.apply(this, args)
    cache.set(key, result)
    return result
  }
}

class Service {
  // 正确顺序：Cache → Log → Validate
  // 执行顺序：Validate → Log → Cache（从内到外）
  @Cache // 最外层：先检查缓存
  @Log // 中间层：记录日志
  @Validate // 最内层：先验证参数
  process(data: string) {
    console.log('处理数据：', data)
    return data.toUpperCase()
  }
}

const service = new Service()
service.process('test')
// 输出：
// 验证参数
// 记录日志
// 处理数据：test

service.process('test')
// 输出：
// 返回缓存（直接返回，不会执行验证和日志）
```

### 8.3. 避免循环依赖

```typescript
import 'reflect-metadata'

// ⚠️ 错误：装饰器相互依赖可能导致问题
function A(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const bData = Reflect.getMetadata('b', target, propertyKey)
  console.log('A 读取 B 的数据：', bData)
  Reflect.defineMetadata('a', 'dataA', target, propertyKey)
}

function B(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const aData = Reflect.getMetadata('a', target, propertyKey)
  console.log('B 读取 A 的数据：', aData) // undefined（A 还未执行）
  Reflect.defineMetadata('b', 'dataB', target, propertyKey)
}

class Example {
  @A
  @B
  method() {}
}

// 输出：
// B 读取 A 的数据：undefined
// A 读取 B 的数据：dataB
```

### 8.4. 性能优化考虑

```typescript
// 装饰器在类定义时执行，避免耗时操作
function ExpensiveDecorator(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  // ❌ 错误：在装饰器中执行耗时操作
  for (let i = 0; i < 1000000; i++) {
    Math.random()
  }
  console.log('耗时操作完成')
}

// 多个这样的装饰器会严重影响启动性能
@ExpensiveDecorator
@ExpensiveDecorator
@ExpensiveDecorator
class SlowClass {
  method() {}
}
```

```typescript
// 正确：将耗时操作延迟到运行时
function OptimizedDecorator(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value
  let initialized = false
  let data: any

  descriptor.value = function (...args: any[]) {
    // 在第一次调用时才执行耗时操作
    if (!initialized) {
      console.log('执行耗时初始化')
      // 耗时操作
      data = performExpensiveOperation()
      initialized = true
    }

    return originalMethod.apply(this, args)
  }
}

function performExpensiveOperation() {
  // 耗时操作
  return 'data'
}

class FastClass {
  @OptimizedDecorator
  method() {}
}
```

## 9. 🔗 引用

- [TypeScript Handbook - Decorators][1]
- [Decorator Evaluation Order][2]
- [TC39 Decorator Proposal][3]
- [Understanding Decorator Execution][4]

[1]: https://www.typescriptlang.org/docs/handbook/decorators.html
[2]: https://www.typescriptlang.org/docs/handbook/decorators.html#decorator-evaluation
[3]: https://github.com/tc39/proposal-decorators
[4]: https://www.typescriptlang.org/docs/handbook/decorators.html#decorator-composition
