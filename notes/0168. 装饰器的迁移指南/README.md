# [0168. 装饰器的迁移指南](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0168.%20%E8%A3%85%E9%A5%B0%E5%99%A8%E7%9A%84%E8%BF%81%E7%A7%BB%E6%8C%87%E5%8D%97)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么时候需要迁移装饰器？](#3--什么时候需要迁移装饰器)
  - [3.1. 适合迁移的场景](#31-适合迁移的场景)
  - [3.2. 不适合迁移的场景](#32-不适合迁移的场景)
  - [3.3. 迁移策略](#33-迁移策略)
- [4. 🤔 如何迁移类装饰器？](#4--如何迁移类装饰器)
  - [4.1. 返回新构造函数](#41-返回新构造函数)
- [5. 🤔 如何迁移方法装饰器？](#5--如何迁移方法装饰器)
  - [5.1. 异步方法装饰器](#51-异步方法装饰器)
- [6. 🤔 如何迁移属性装饰器？](#6--如何迁移属性装饰器)
  - [6.1. 只读属性](#61-只读属性)
- [7. 🤔 如何处理元数据？](#7--如何处理元数据)
  - [7.1. 使用 WeakMap 存储元数据](#71-使用-weakmap-存储元数据)
  - [7.2. 使用类静态属性](#72-使用类静态属性)
- [8. 🤔 迁移中有哪些常见问题？](#8--迁移中有哪些常见问题)
  - [8.1. 参数装饰器不支持](#81-参数装饰器不支持)
  - [8.2. 访问器装饰器变化](#82-访问器装饰器变化)
  - [8.3. 装饰器返回值处理](#83-装饰器返回值处理)
  - [8.4. 兼容性处理](#84-兼容性处理)
- [9. 🔗 引用](#9--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 装饰器迁移的时机和策略
- 不同类型装饰器的迁移方法
- 元数据的替代方案
- 迁移过程中的常见问题
- 兼容性处理技巧

## 2. 🫧 评价

从旧装饰器迁移到新装饰器需要仔细规划，特别是涉及元数据的场景。

- TypeScript 5.0 引入了新装饰器，但旧装饰器仍然可用
- 大部分框架（Angular、NestJS）仍使用旧装饰器，迁移需谨慎
- 新装饰器不支持元数据，需要寻找替代方案
- 参数装饰器和访问器装饰器在新装饰器中被移除
- 建议新项目使用新装饰器，现有项目继续使用旧装饰器

## 3. 🤔 什么时候需要迁移装饰器？

迁移装饰器需要权衡多个因素。

### 3.1. 适合迁移的场景

```ts
// 1. 新项目
// 不依赖旧装饰器的框架

// 2. 简单装饰器
// 不使用元数据的装饰器

// 3. 标准兼容性要求高
// 希望使用 JavaScript 标准的项目

// 4. 性能敏感
// 新装饰器性能更好
```

### 3.2. 不适合迁移的场景

```ts
// 1. 使用 Angular、NestJS 等框架
// 这些框架依赖旧装饰器和元数据

// 2. 大量使用元数据
// 新装饰器不支持元数据反射

// 3. 使用参数装饰器
// 新装饰器不支持参数装饰器

// 4. 迁移成本高
// 代码量大，风险高
```

### 3.3. 迁移策略

```ts
// 策略一：保持现状
// tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}

// 策略二：渐进式迁移
// 新代码使用新装饰器，旧代码保持不变

// 策略三：完全迁移
// 适合小型项目或简单装饰器
```

## 4. 🤔 如何迁移类装饰器？

类装饰器的迁移相对简单。

::: code-group

```ts [旧装饰器]
// 旧装饰器签名
function OldSealed(constructor: Function) {
  Object.seal(constructor)
  Object.seal(constructor.prototype)
}

@OldSealed
class OldService {
  name = 'service'
}
```

```ts [新装饰器]
// 新装饰器签名
function NewSealed(target: Function, context: ClassDecoratorContext) {
  // context 提供额外信息
  console.log('类名：', context.name)

  // 使用 addInitializer 添加初始化逻辑
  context.addInitializer(function () {
    Object.seal(target)
    Object.seal(target.prototype)
  })
}

@NewSealed
class NewService {
  name = 'service'
}
```

:::

### 4.1. 返回新构造函数

::: code-group

```ts [旧装饰器]
function OldLogger(constructor: Function) {
  return class extends (constructor as any) {
    constructor(...args: any[]) {
      super(...args)
      console.log('实例创建')
    }
  }
}

@OldLogger
class OldUser {
  name: string
  constructor(name: string) {
    this.name = name
  }
}
```

```ts [新装饰器]
function NewLogger<T extends new (...args: any[]) => any>(
  target: T,
  context: ClassDecoratorContext
) {
  return class extends target {
    constructor(...args: any[]) {
      super(...args)
      console.log('实例创建')
    }
  }
}

@NewLogger
class NewUser {
  name: string
  constructor(name: string) {
    this.name = name
  }
}
```

:::

## 5. 🤔 如何迁移方法装饰器？

方法装饰器的迁移需要调整参数结构。

::: code-group

```ts [旧装饰器]
function OldLog(
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value

  descriptor.value = function (...args: any[]) {
    console.log(`调用 ${propertyKey}`)
    return originalMethod.apply(this, args)
  }

  return descriptor
}

class OldService {
  @OldLog
  getData() {
    return 'data'
  }
}
```

```ts [新装饰器]
function NewLog(target: Function, context: ClassMethodDecoratorContext) {
  const methodName = String(context.name)

  return function (this: any, ...args: any[]) {
    console.log(`调用 ${methodName}`)
    return target.apply(this, args)
  }
}

class NewService {
  @NewLog
  getData() {
    return 'data'
  }
}
```

:::

### 5.1. 异步方法装饰器

::: code-group

```ts [旧装饰器]
function OldAsync(
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value

  descriptor.value = async function (...args: any[]) {
    console.log('开始')
    const result = await originalMethod.apply(this, args)
    console.log('结束')
    return result
  }

  return descriptor
}

class OldApi {
  @OldAsync
  async fetchData() {
    return 'data'
  }
}
```

```ts [新装饰器]
function NewAsync(target: Function, context: ClassMethodDecoratorContext) {
  return async function (this: any, ...args: any[]) {
    console.log('开始')
    const result = await target.apply(this, args)
    console.log('结束')
    return result
  }
}

class NewApi {
  @NewAsync
  async fetchData() {
    return 'data'
  }
}
```

:::

## 6. 🤔 如何迁移属性装饰器？

属性装饰器在新装饰器中称为字段装饰器。

::: code-group

```ts [旧装饰器]
function OldDefault(value: any) {
  return function (target: Object, propertyKey: string) {
    let val = value

    Object.defineProperty(target, propertyKey, {
      get() {
        return val
      },
      set(newValue: any) {
        val = newValue
      },
      enumerable: true,
      configurable: true,
    })
  }
}

class OldConfig {
  @OldDefault('localhost')
  host: string
}
```

```ts [新装饰器]
function NewDefault(value: any) {
  return function (target: undefined, context: ClassFieldDecoratorContext) {
    return function (this: any, initialValue: any) {
      // initialValue 是初始值
      return initialValue === undefined ? value : initialValue
    }
  }
}

class NewConfig {
  @NewDefault('localhost')
  host: string
}
```

:::

### 6.1. 只读属性

::: code-group

```ts [旧装饰器]
function OldReadonly(target: Object, propertyKey: string) {
  let value: any

  Object.defineProperty(target, propertyKey, {
    get() {
      return value
    },
    set(newValue: any) {
      if (value === undefined) {
        value = newValue
      } else {
        throw new Error(`${String(propertyKey)} 是只读的`)
      }
    },
  })
}

class OldModel {
  @OldReadonly
  id: number = 0
}
```

```ts [新装饰器]
function NewReadonly(target: undefined, context: ClassFieldDecoratorContext) {
  return function (this: any, initialValue: any) {
    // 使用 Object.defineProperty 设置只读
    const fieldName = context.name
    let value = initialValue

    Object.defineProperty(this, fieldName, {
      get() {
        return value
      },
      set() {
        throw new Error(`${String(fieldName)} 是只读的`)
      },
    })

    return initialValue
  }
}

class NewModel {
  @NewReadonly
  id: number = 0
}
```

:::

## 7. 🤔 如何处理元数据？

新装饰器不支持 reflect-metadata，需要替代方案。

### 7.1. 使用 WeakMap 存储元数据

::: code-group

```ts [旧装饰器]
import 'reflect-metadata'

function OldRoute(path: string) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata('route', path, target, propertyKey)
  }
}

class OldController {
  @OldRoute('/users')
  getUsers() {
    return []
  }
}

const route = Reflect.getMetadata('route', OldController.prototype, 'getUsers')
console.log(route) // '/users'
```

```ts [新装饰器]
const routeMetadata = new WeakMap<any, Map<string | symbol, string>>()

function NewRoute(path: string) {
  return function (target: Function, context: ClassMethodDecoratorContext) {
    const className = context.name

    context.addInitializer(function () {
      let methodMap = routeMetadata.get(this.constructor)
      if (!methodMap) {
        methodMap = new Map()
        routeMetadata.set(this.constructor, methodMap)
      }
      methodMap.set(context.name, path)
    })

    return target
  }
}

class NewController {
  @NewRoute('/users')
  getUsers() {
    return []
  }
}

// 读取元数据
const instance = new NewController()
const methodMap = routeMetadata.get(NewController)
const route = methodMap?.get('getUsers')
console.log(route) // '/users'
```

:::

### 7.2. 使用类静态属性

```ts
// 新装饰器：使用静态属性存储元数据
function Route(path: string) {
  return function (target: Function, context: ClassMethodDecoratorContext) {
    const methodName = context.name

    context.addInitializer(function () {
      const constructor = this.constructor as any

      if (!constructor.__routes) {
        constructor.__routes = new Map()
      }

      constructor.__routes.set(methodName, path)
    })

    return target
  }
}

class Controller {
  static __routes: Map<string | symbol, string>

  @Route('/api/users')
  getUsers() {
    return []
  }

  @Route('/api/posts')
  getPosts() {
    return []
  }
}

// 读取路由信息
const routes = (Controller as any).__routes
console.log(routes.get('getUsers')) // '/api/users'
console.log(routes.get('getPosts')) // '/api/posts'
```

## 8. 🤔 迁移中有哪些常见问题？

迁移过程中需要注意以下问题。

### 8.1. 参数装饰器不支持

```ts
// 旧装饰器：支持参数装饰器
function OldParam(target: Object, propertyKey: string, parameterIndex: number) {
  console.log(`参数 ${parameterIndex}`)
}

class OldController {
  getUser(@OldParam id: string) {
    return { id }
  }
}

// 新装饰器：不支持参数装饰器
// 需要改用其他方式，比如方法装饰器配合类型元数据
```

### 8.2. 访问器装饰器变化

```ts
// 旧装饰器：有独立的访问器装饰器
function OldAccessor(
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalGet = descriptor.get

  descriptor.get = function () {
    console.log('getter 调用')
    return originalGet?.call(this)
  }

  return descriptor
}

class OldModel {
  private _name = ''

  @OldAccessor
  get name() {
    return this._name
  }
}

// 新装饰器：访问器被视为方法
function NewAccessor(
  target: Function,
  context: ClassGetterDecoratorContext | ClassSetterDecoratorContext
) {
  return function (this: any) {
    console.log('getter 调用')
    return target.call(this)
  }
}

class NewModel {
  private _name = ''

  @NewAccessor
  get name() {
    return this._name
  }
}
```

### 8.3. 装饰器返回值处理

```ts
// 旧装饰器：可以返回 undefined
function OldDecorator(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  // 修改 descriptor
  const originalMethod = descriptor.value
  descriptor.value = function (...args: any[]) {
    return originalMethod.apply(this, args)
  }
  // 可以不返回
}

// 新装饰器：必须返回函数或 undefined
function NewDecorator(target: Function, context: ClassMethodDecoratorContext) {
  // 必须返回新函数
  return function (this: any, ...args: any[]) {
    return target.apply(this, args)
  }
}
```

### 8.4. 兼容性处理

```ts
// 同时支持新旧装饰器
function UniversalLog(...args: any[]): any {
  // 检测是否为新装饰器
  if (args.length === 2 && typeof args[1] === 'object' && 'kind' in args[1]) {
    // 新装饰器
    const [target, context] = args as [Function, ClassMethodDecoratorContext]
    return function (this: any, ...methodArgs: any[]) {
      console.log(`调用 ${String(context.name)}`)
      return target.apply(this, methodArgs)
    }
  } else {
    // 旧装饰器
    const [target, propertyKey, descriptor] = args as [
      Object,
      string,
      PropertyDescriptor
    ]
    const originalMethod = descriptor.value
    descriptor.value = function (...methodArgs: any[]) {
      console.log(`调用 ${propertyKey}`)
      return originalMethod.apply(this, methodArgs)
    }
    return descriptor
  }
}

// 在旧装饰器模式下使用
class OldService {
  @UniversalLog
  getData() {
    return 'data'
  }
}

// 在新装饰器模式下使用
class NewService {
  @UniversalLog
  getData() {
    return 'data'
  }
}
```

## 9. 🔗 引用

- [TypeScript 5.0 Decorators][1]
- [Migrating to Stage 3 Decorators][2]
- [TC39 Decorator Proposal][3]
- [TypeScript Handbook - Decorators][4]

[1]: https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/#decorators
[2]: https://github.com/microsoft/TypeScript/issues/48885
[3]: https://github.com/tc39/proposal-decorators
[4]: https://www.typescriptlang.org/docs/handbook/decorators.html
