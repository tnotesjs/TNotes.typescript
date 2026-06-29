# [0160. 参数装饰器](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0160.%20%E5%8F%82%E6%95%B0%E8%A3%85%E9%A5%B0%E5%99%A8)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 什么是参数装饰器？](#3-什么是参数装饰器)
- [4. 参数装饰器的基本语法是什么？](#4-参数装饰器的基本语法是什么)
  - [4.1. 参数说明](#41-参数说明)
  - [4.2. 类型定义](#42-类型定义)
- [5. 参数装饰器如何收集元数据？](#5-参数装饰器如何收集元数据)
  - [5.1. 基本元数据收集](#51-基本元数据收集)
  - [5.2. 收集参数类型信息](#52-收集参数类型信息)
- [6. 参数装饰器有哪些实际应用场景？](#6-参数装饰器有哪些实际应用场景)
  - [6.1. 依赖注入](#61-依赖注入)
  - [6.2. 参数验证](#62-参数验证)
  - [6.3. 路由参数绑定](#63-路由参数绑定)
  - [6.4. 日志记录](#64-日志记录)
- [7. 使用参数装饰器时需要注意什么？](#7-使用参数装饰器时需要注意什么)
  - [7.1. 返回值会被忽略](#71-返回值会被忽略)
  - [7.2. 必须配合方法装饰器使用](#72-必须配合方法装饰器使用)
  - [7.3. 装饰器执行顺序](#73-装饰器执行顺序)
  - [7.4. 类型信息获取](#74-类型信息获取)
- [8. 引用](#8-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 参数装饰器的定义和本质
- 参数装饰器的基本语法
- 参数装饰器的参数说明
- 参数装饰器收集元数据的方式
- 参数装饰器的实际应用场景
- 参数装饰器的使用注意事项

## 2. 评价

参数装饰器主要用于标记和收集参数元数据，配合方法装饰器实现参数验证、依赖注入等功能。

- 参数装饰器本身不能修改参数行为，主要用于存储元数据
- 常与方法装饰器结合使用，方法装饰器读取参数元数据进行处理
- 广泛应用于依赖注入框架（NestJS、Angular 等）和参数验证
- 需要使用 `reflect-metadata` 库来存储和读取元数据
- 参数装饰器的返回值会被忽略，不影响程序执行

## 3. 什么是参数装饰器？

参数装饰器是应用在方法参数上的函数，用于标记参数并收集元数据。

```ts
// 参数装饰器的本质
function logParameter(
  target: any,
  propertyKey: string | symbol,
  parameterIndex: number,
) {
  console.log('类：', target.constructor.name)
  console.log('方法：', propertyKey)
  console.log('参数索引：', parameterIndex)
}

class UserService {
  getUser(@logParameter id: number) {
    return { id, name: 'Alice' }
  }
}

// 输出：
// 类：UserService
// 方法：getUser
// 参数索引：0
```

## 4. 参数装饰器的基本语法是什么？

参数装饰器接收三个参数，返回值会被忽略。

### 4.1. 参数说明

```ts
// 参数装饰器的完整签名
function parameterDecorator(
  target: any, // 静态方法是类的构造函数，实例方法是类的原型对象
  propertyKey: string | symbol, // 方法的名称
  parameterIndex: number, // 参数在函数参数列表中的索引
): void {
  // 装饰器逻辑
}

class Example {
  // 实例方法的参数装饰器
  instanceMethod(
    @parameterDecorator param1: string,
    @parameterDecorator param2: number,
  ) {}

  // 静态方法的参数装饰器
  static staticMethod(@parameterDecorator param: string) {}
}
```

### 4.2. 类型定义

```ts
// TypeScript 中的参数装饰器类型
type ParameterDecorator = (
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number,
) => void

// 示例装饰器
const LogParam: ParameterDecorator = (target, propertyKey, parameterIndex) => {
  console.log(`参数 ${parameterIndex} 在方法 ${String(propertyKey)} 中`)
}

class Demo {
  test(@LogParam a: number, @LogParam b: string) {
    return a + b
  }
}
```

## 5. 参数装饰器如何收集元数据？

参数装饰器通常使用 `reflect-metadata` 存储参数信息，供方法装饰器读取。

### 5.1. 基本元数据收集

```ts
import 'reflect-metadata'

// 存储参数元数据
function Required(
  target: any,
  propertyKey: string | symbol,
  parameterIndex: number,
) {
  const existingRequiredParameters: number[] =
    Reflect.getOwnMetadata('required', target, propertyKey) || []

  existingRequiredParameters.push(parameterIndex)
  Reflect.defineMetadata(
    'required',
    existingRequiredParameters,
    target,
    propertyKey,
  )
}

// 方法装饰器读取并验证
function ValidateRequired(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value

  descriptor.value = function (...args: any[]) {
    const requiredParameters: number[] =
      Reflect.getOwnMetadata('required', target, propertyKey) || []

    for (const index of requiredParameters) {
      if (args[index] === undefined || args[index] === null) {
        throw new Error(`参数 ${index} 是必需的`)
      }
    }

    return originalMethod.apply(this, args)
  }
}

class UserService {
  @ValidateRequired
  createUser(@Required name: string, age?: number) {
    return { name, age }
  }
}

const service = new UserService()
console.log(service.createUser('Alice', 30)) // 正常执行
// service.createUser(null as any);            // ❌ Error: 参数 0 是必需的
```

### 5.2. 收集参数类型信息

```ts
import 'reflect-metadata'

// 存储参数类型
function Type(type: any) {
  return function (
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number,
  ) {
    const existingTypes: any[] =
      Reflect.getOwnMetadata('paramTypes', target, propertyKey) || []

    existingTypes[parameterIndex] = type
    Reflect.defineMetadata('paramTypes', existingTypes, target, propertyKey)
  }
}

// 验证参数类型
function ValidateTypes(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value

  descriptor.value = function (...args: any[]) {
    const types: any[] =
      Reflect.getOwnMetadata('paramTypes', target, propertyKey) || []

    args.forEach((arg, index) => {
      const expectedType = types[index]
      if (expectedType && !(arg instanceof expectedType)) {
        throw new TypeError(
          `参数 ${index} 类型错误，期望 ${
            expectedType.name
          }，实际 ${typeof arg}`,
        )
      }
    })

    return originalMethod.apply(this, args)
  }
}

class DataService {
  @ValidateTypes
  saveData(@Type(String) key: string, @Type(Object) data: any) {
    console.log(`保存 ${key}:`, data)
  }
}

const service = new DataService()
service.saveData('user', { name: 'Alice' }) // 正常执行
// service.saveData(123 as any, {});          // ❌ TypeError
```

## 6. 参数装饰器有哪些实际应用场景？

### 6.1. 依赖注入

```ts
import 'reflect-metadata'

// 存储依赖注入标记
function Inject(token: string) {
  return function (
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number,
  ) {
    const existingInjections: Array<{ index: number; token: string }> =
      Reflect.getOwnMetadata('injections', target, propertyKey) || []

    existingInjections.push({ index: parameterIndex, token })
    Reflect.defineMetadata(
      'injections',
      existingInjections,
      target,
      propertyKey,
    )
  }
}

// 简单的依赖注入容器
class Container {
  private static services = new Map<string, any>()

  static register(token: string, service: any) {
    this.services.set(token, service)
  }

  static resolve(token: string) {
    return this.services.get(token)
  }
}

// 方法装饰器实现依赖注入
function InjectDependencies(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value

  descriptor.value = function (...args: any[]) {
    const injections: Array<{ index: number; token: string }> =
      Reflect.getOwnMetadata('injections', target, propertyKey) || []

    // 注入依赖
    injections.forEach(({ index, token }) => {
      args[index] = Container.resolve(token)
    })

    return originalMethod.apply(this, args)
  }
}

// 注册服务
class Logger {
  log(message: string) {
    console.log(`[LOG] ${message}`)
  }
}

Container.register('Logger', new Logger())

class UserController {
  @InjectDependencies
  getUser(@Inject('Logger') logger: Logger, id: number) {
    logger.log(`获取用户 ${id}`)
    return { id, name: 'Alice' }
  }
}

const controller = new UserController()
controller.getUser(undefined as any, 123) // Logger 会被自动注入
// 输出：[LOG] 获取用户 123
```

### 6.2. 参数验证

```ts
import 'reflect-metadata'

// 验证装饰器
function Min(min: number) {
  return function (
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number,
  ) {
    const validators =
      Reflect.getOwnMetadata('validators', target, propertyKey) || []
    validators.push({
      index: parameterIndex,
      validate: (value: any) => {
        if (typeof value !== 'number' || value < min) {
          throw new Error(`参数 ${parameterIndex} 必须大于等于 ${min}`)
        }
      },
    })
    Reflect.defineMetadata('validators', validators, target, propertyKey)
  }
}

function Max(max: number) {
  return function (
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number,
  ) {
    const validators =
      Reflect.getOwnMetadata('validators', target, propertyKey) || []
    validators.push({
      index: parameterIndex,
      validate: (value: any) => {
        if (typeof value !== 'number' || value > max) {
          throw new Error(`参数 ${parameterIndex} 必须小于等于 ${max}`)
        }
      },
    })
    Reflect.defineMetadata('validators', validators, target, propertyKey)
  }
}

// 方法装饰器执行验证
function Validate(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value

  descriptor.value = function (...args: any[]) {
    const validators =
      Reflect.getOwnMetadata('validators', target, propertyKey) || []

    validators.forEach(({ index, validate }: any) => {
      validate(args[index])
    })

    return originalMethod.apply(this, args)
  }
}

class ProductService {
  @Validate
  setPrice(@Min(0) @Max(10000) price: number) {
    console.log(`设置价格：${price}`)
  }
}

const service = new ProductService()
service.setPrice(100) // 正常执行
// service.setPrice(-1);    // ❌ Error: 参数 0 必须大于等于 0
// service.setPrice(20000); // ❌ Error: 参数 0 必须小于等于 10000
```

### 6.3. 路由参数绑定

```ts
import 'reflect-metadata'

// 参数来源装饰器
function Param(name: string) {
  return function (
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number,
  ) {
    const params = Reflect.getOwnMetadata('params', target, propertyKey) || []
    params.push({ index: parameterIndex, name, type: 'param' })
    Reflect.defineMetadata('params', params, target, propertyKey)
  }
}

function Query(name: string) {
  return function (
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number,
  ) {
    const params = Reflect.getOwnMetadata('params', target, propertyKey) || []
    params.push({ index: parameterIndex, name, type: 'query' })
    Reflect.defineMetadata('params', params, target, propertyKey)
  }
}

function Body() {
  return function (
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number,
  ) {
    const params = Reflect.getOwnMetadata('params', target, propertyKey) || []
    params.push({ index: parameterIndex, type: 'body' })
    Reflect.defineMetadata('params', params, target, propertyKey)
  }
}

// 模拟请求对象
interface Request {
  params: Record<string, any>
  query: Record<string, any>
  body: any
}

// 方法装饰器处理请求
function HandleRequest(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value

  descriptor.value = function (request: Request) {
    const params = Reflect.getOwnMetadata('params', target, propertyKey) || []
    const args: any[] = []

    params.forEach(({ index, name, type }: any) => {
      switch (type) {
        case 'param':
          args[index] = request.params[name]
          break
        case 'query':
          args[index] = request.query[name]
          break
        case 'body':
          args[index] = request.body
          break
      }
    })

    return originalMethod.apply(this, args)
  }
}

class UserController {
  @HandleRequest
  getUser(@Param('id') id: string, @Query('include') include?: string) {
    console.log(`获取用户 ${id}，包含：${include}`)
    return { id, include }
  }

  @HandleRequest
  createUser(@Body() userData: any) {
    console.log('创建用户：', userData)
    return userData
  }
}

const controller = new UserController()

// 模拟请求
controller.getUser({
  params: { id: '123' },
  query: { include: 'profile' },
  body: null,
})
// 输出：获取用户 123，包含：profile

controller.createUser({
  params: {},
  query: {},
  body: { name: 'Alice', age: 30 },
})
// 输出：创建用户：{ name: 'Alice', age: 30 }
```

### 6.4. 日志记录

```ts
import 'reflect-metadata'

// 标记敏感参数
function Sensitive(
  target: any,
  propertyKey: string | symbol,
  parameterIndex: number,
) {
  const sensitiveParams =
    Reflect.getOwnMetadata('sensitive', target, propertyKey) || []
  sensitiveParams.push(parameterIndex)
  Reflect.defineMetadata('sensitive', sensitiveParams, target, propertyKey)
}

// 方法装饰器记录日志
function LogMethod(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value

  descriptor.value = function (...args: any[]) {
    const sensitiveParams: number[] =
      Reflect.getOwnMetadata('sensitive', target, propertyKey) || []

    // 隐藏敏感参数
    const logArgs = args.map((arg, index) =>
      sensitiveParams.includes(index) ? '***' : arg,
    )

    console.log(`[LOG] 调用 ${String(propertyKey)}，参数：`, logArgs)

    const result = originalMethod.apply(this, args)
    console.log(`[LOG] ${String(propertyKey)} 返回：`, result)

    return result
  }
}

class AuthService {
  @LogMethod
  login(username: string, @Sensitive password: string) {
    // 实际的登录逻辑
    return { token: 'abc123', username }
  }
}

const auth = new AuthService()
auth.login('alice', 'secret123')
// 输出：
// [LOG] 调用 login，参数：['alice', '***']
// [LOG] login 返回：{ token: 'abc123', username: 'alice' }
```

## 7. 使用参数装饰器时需要注意什么？

### 7.1. 返回值会被忽略

::: code-group

```ts [❌ 错误示例]
// 返回值不会被使用
function WrongDecorator(
  target: any,
  propertyKey: string | symbol,
  parameterIndex: number,
) {
  // ❌ 返回值会被忽略
  return function (value: any) {
    console.log('这个函数永远不会执行')
  }
}

class Example {
  method(@WrongDecorator param: string) {}
}
```

```ts [✅ 正确示例]
// 使用元数据存储信息
function CorrectDecorator(
  target: any,
  propertyKey: string | symbol,
  parameterIndex: number,
) {
  // 存储元数据供其他装饰器使用
  const metadata =
    Reflect.getOwnMetadata('decorator', target, propertyKey) || []
  metadata.push(parameterIndex)
  Reflect.defineMetadata('decorator', metadata, target, propertyKey)
}

class Example {
  method(@CorrectDecorator param: string) {}
}
```

:::

### 7.2. 必须配合方法装饰器使用

```ts
import 'reflect-metadata'

// ⚠️ 单独使用参数装饰器没有实际效果
function Validate(
  target: any,
  propertyKey: string | symbol,
  parameterIndex: number,
) {
  console.log('装饰器执行了，但不影响方法行为')
}

class Example {
  // ⚠️ 参数装饰器单独使用时，不会对方法行为产生任何影响
  method(@Validate param: string) {
    console.log(param)
  }
}

const example = new Example()
example.method('test') // 正常执行，装饰器没有任何作用
```

```ts
// 正确用法：配合方法装饰器
function ValidateParam(
  target: any,
  propertyKey: string | symbol,
  parameterIndex: number,
) {
  const validators =
    Reflect.getOwnMetadata('validators', target, propertyKey) || []
  validators.push(parameterIndex)
  Reflect.defineMetadata('validators', validators, target, propertyKey)
}

function ValidateMethod(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value

  descriptor.value = function (...args: any[]) {
    const validators: number[] =
      Reflect.getOwnMetadata('validators', target, propertyKey) || []

    validators.forEach((index) => {
      if (!args[index]) {
        throw new Error(`参数 ${index} 不能为空`)
      }
    })

    return originalMethod.apply(this, args)
  }
}

class Example {
  @ValidateMethod
  method(@ValidateParam param: string) {
    console.log(param)
  }
}
```

### 7.3. 装饰器执行顺序

```ts
import 'reflect-metadata'

// 参数装饰器从右到左执行
function First(
  target: any,
  propertyKey: string | symbol,
  parameterIndex: number,
) {
  console.log('First 装饰器执行，参数索引：', parameterIndex)
}

function Second(
  target: any,
  propertyKey: string | symbol,
  parameterIndex: number,
) {
  console.log('Second 装饰器执行，参数索引：', parameterIndex)
}

class Example {
  method(@First @Second param1: string, @First param2: number) {
    console.log('方法执行')
  }
}

// 输出顺序：
// First 装饰器执行，参数索引：1
// Second 装饰器执行，参数索引：0
// First 装饰器执行，参数索引：0
```

### 7.4. 类型信息获取

```ts
import 'reflect-metadata'

// ⚠️ 参数装饰器本身无法直接获取参数类型
function LogType(
  target: any,
  propertyKey: string | symbol,
  parameterIndex: number,
) {
  // ⚠️ 这里无法直接获取参数的 TypeScript 类型
  console.log(`参数 ${parameterIndex} 的类型信息需要通过 reflect-metadata 获取`)
}

// 启用 emitDecoratorMetadata 后可以获取类型
function GetParamType(
  target: any,
  propertyKey: string | symbol,
  parameterIndex: number,
) {
  // 获取方法的参数类型数组
  const paramTypes = Reflect.getMetadata(
    'design:paramtypes',
    target,
    propertyKey,
  )
  if (paramTypes) {
    console.log(
      `参数 ${parameterIndex} 的类型：`,
      paramTypes[parameterIndex].name,
    )
  }
}

class Example {
  method(@GetParamType name: string, @GetParamType age: number) {
    return { name, age }
  }
}

// 需要在 tsconfig.json 中配置：
// {
//   "compilerOptions": {
//     "experimentalDecorators": true,
//     "emitDecoratorMetadata": true
//   }
// }
```

## 8. 引用

- [TypeScript Handbook - Parameter Decorators][1]
- [Reflect Metadata][2]
- [TC39 Decorator Proposal][3]
- [NestJS - Custom Decorators][4]

[1]: https://www.typescriptlang.org/docs/handbook/decorators.html#parameter-decorators
[2]: https://github.com/rbuckton/reflect-metadata
[3]: https://github.com/tc39/proposal-decorators
[4]: https://docs.nestjs.com/custom-decorators
