# [0215. Parameters T](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0215.%20Parameters%20T)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 Parameters\<T\> 是什么？](#3--parameterst-是什么)
  - [3.1. 源码定义](#31-源码定义)
  - [3.2. 工作原理](#32-工作原理)
  - [3.3. 基本示例](#33-基本示例)
- [4. 🤔 如何使用 Parameters\<T\>？](#4--如何使用-parameterst)
  - [4.1. 场景 1：函数包装器](#41-场景-1函数包装器)
  - [4.2. 场景 2：函数参数类型复用](#42-场景-2函数参数类型复用)
  - [4.3. 场景 3：高阶函数类型](#43-场景-3高阶函数类型)
  - [4.4. 场景 4：类型安全的事件处理](#44-场景-4类型安全的事件处理)
- [5. 🤔 Parameters\<T\> 的实际应用场景有哪些？](#5--parameterst-的实际应用场景有哪些)
  - [5.1. 应用 1：Redux 中间件](#51-应用-1redux-中间件)
  - [5.2. 应用 2：API 客户端方法重载](#52-应用-2api-客户端方法重载)
  - [5.3. 应用 3：函数组合](#53-应用-3函数组合)
  - [5.4. 应用 4：测试辅助函数](#54-应用-4测试辅助函数)
  - [5.5. 应用 5：柯里化函数](#55-应用-5柯里化函数)
- [6. 🤔 使用 Parameters\<T\> 需要注意什么？](#6--使用-parameterst-需要注意什么)
  - [6.1. 注意事项 1：元组类型的结构](#61-注意事项-1元组类型的结构)
  - [6.2. 注意事项 2：剩余参数](#62-注意事项-2剩余参数)
  - [6.3. 注意事项 3：泛型函数](#63-注意事项-3泛型函数)
  - [6.4. 注意事项 4：重载函数](#64-注意事项-4重载函数)
  - [6.5. 注意事项 5：this 参数](#65-注意事项-5this-参数)
  - [6.6. 注意事项 6：解构赋值](#66-注意事项-6解构赋值)
  - [6.7. 注意事项 7：与展开运算符配合](#67-注意事项-7与展开运算符配合)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- `Parameters<T>` 的定义和实现原理
- 元组类型的应用
- 基本使用方法
- 实际应用场景
- 使用注意事项

## 2. 🫧 评价

`Parameters<T>` 提取函数类型 `T` 的参数类型组成的元组。

- 基于 `infer` 关键字实现
- 返回元组类型
- 常用于函数包装和高阶函数
- 与 `ReturnType<T>` 配套使用
- 保留参数的顺序和可选性

## 3. 🤔 Parameters\<T\> 是什么？

`Parameters<T>` 从函数类型 `T` 中提取参数类型，返回一个元组类型。

### 3.1. 源码定义

```ts
// TypeScript lib.es5.d.ts 中的定义
type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never
```

### 3.2. 工作原理

```ts
function greet(name: string, age: number): string {
  return `Hello, ${name}! You are ${age} years old.`
}

// Parameters 的推导过程
type GreetParams = Parameters<typeof greet>

// 展开：
// typeof greet = (name: string, age: number) => string
// (...args: infer P) => any 匹配
// P = [name: string, age: number]

// 结果：[string, number]
```

### 3.3. 基本示例

```ts
// 基本函数
function add(a: number, b: number): number {
  return a + b
}
type AddParams = Parameters<typeof add> // [number, number]

// 可选参数
function greet(name: string, greeting?: string): void {
  console.log(greeting ? `${greeting}, ${name}` : `Hello, ${name}`)
}
type GreetParams = Parameters<typeof greet> // [string, string?]

// 剩余参数
function sum(...numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0)
}
type SumParams = Parameters<typeof sum> // [... number[]]

// 无参数
function getCurrentTime(): Date {
  return new Date()
}
type TimeParams = Parameters<typeof getCurrentTime> // []
```

## 4. 🤔 如何使用 Parameters\<T\>？

### 4.1. 场景 1：函数包装器

```ts
function log(message: string, level: 'info' | 'warn' | 'error'): void {
  console.log(`[${level}] ${message}`)
}

// 创建包装函数
function createLogger(prefix: string) {
  return (...args: Parameters<typeof log>): ReturnType<typeof log> => {
    const [message, level] = args
    return log(`${prefix}: ${message}`, level)
  }
}

const appLogger = createLogger('APP')
appLogger('Server started', 'info') // [APP]: Server started
```

### 4.2. 场景 2：函数参数类型复用

```ts
function fetchUser(
  id: number,
  options?: { cache?: boolean; retry?: number }
): Promise<User> {
  // 实现...
  return Promise.resolve({} as User)
}

// 复用参数类型
type FetchUserParams = Parameters<typeof fetchUser>
// [number, { cache?: boolean; retry?: number } | undefined]

// 使用相同的参数类型创建新函数
function cacheFetchUser(...params: FetchUserParams): Promise<User> {
  const [id, options] = params
  console.log(`Caching fetch for user ${id}`)
  return fetchUser(...params)
}

type User = { id: number; name: string }
```

### 4.3. 场景 3：高阶函数类型

```ts
function createMemoized<T extends (...args: any[]) => any>(fn: T) {
  const cache = new Map<string, ReturnType<T>>()

  return (...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)!
    }
    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}

// 使用
function expensiveCalculation(a: number, b: number, c: string): number {
  return a + b + c.length
}

const memoized = createMemoized(expensiveCalculation)
memoized(1, 2, 'hello') // 计算
memoized(1, 2, 'hello') // 从缓存返回
```

### 4.4. 场景 4：类型安全的事件处理

```ts
type EventMap = {
  click: (x: number, y: number) => void
  keypress: (key: string, ctrl: boolean) => void
  resize: (width: number, height: number) => void
}

class EventEmitter {
  on<K extends keyof EventMap>(
    event: K,
    handler: (...args: Parameters<EventMap[K]>) => void
  ): void {
    // 实现...
  }

  emit<K extends keyof EventMap>(
    event: K,
    ...args: Parameters<EventMap[K]>
  ): void {
    // 实现...
  }
}

const emitter = new EventEmitter()

// ✅ 类型安全
emitter.on('click', (x, y) => {
  console.log(`Clicked at (${x}, ${y})`)
})

emitter.emit('click', 100, 200)

// ❌ 参数类型错误
emitter.emit('click', 'invalid', true) // 错误
```

## 5. 🤔 Parameters\<T\> 的实际应用场景有哪些？

### 5.1. 应用 1：Redux 中间件

```ts
type Dispatch = (action: any) => any
type Middleware = (dispatch: Dispatch) => (action: any) => any

function createLogger(): Middleware {
  return (dispatch: Dispatch) => {
    return (action: any) => {
      console.log('Action:', action)
      return dispatch(action)
    }
  }
}

// 提取中间件参数类型
type MiddlewareParams = Parameters<Middleware>
// [dispatch: Dispatch]

type MiddlewareReturnParams = Parameters<ReturnType<Middleware>>
// [action: any]
```

### 5.2. 应用 2：API 客户端方法重载

```ts
class ApiClient {
  request(method: 'GET', url: string): Promise<any>
  request(method: 'POST', url: string, body: any): Promise<any>
  request(method: string, url: string, body?: any): Promise<any> {
    // 实现...
    return Promise.resolve()
  }
}

const api = new ApiClient()

// 提取特定重载的参数
type GetParams = Parameters<(method: 'GET', url: string) => Promise<any>>
// ['GET', string]

type PostParams = Parameters<
  (method: 'POST', url: string, body: any) => Promise<any>
>
// ['POST', string, any]
```

### 5.3. 应用 3：函数组合

```ts
function compose<T extends any[], U, V>(
  f: (x: U) => V,
  g: (...args: T) => U
): (...args: T) => V {
  return (...args: T) => f(g(...args))
}

const double = (x: number) => x * 2
const addOne = (x: number) => x + 1

const doublePlusOne = compose(addOne, double)
doublePlusOne(5) // 11

// 参数类型从 g 推导
type DoublePlusOneParams = Parameters<typeof doublePlusOne> // [number]
```

### 5.4. 应用 4：测试辅助函数

```ts
function createMockFunction<T extends (...args: any[]) => any>() {
  const calls: Array<Parameters<T>> = []

  const mock = (...args: Parameters<T>): ReturnType<T> => {
    calls.push(args)
    return undefined as ReturnType<T>
  }

  return {
    mock,
    calls,
    calledWith: (...args: Parameters<T>) => {
      return calls.some((call) => JSON.stringify(call) === JSON.stringify(args))
    },
  }
}

// 使用
function add(a: number, b: number): number {
  return a + b
}

const mockAdd = createMockFunction<typeof add>()
mockAdd.mock(1, 2)
mockAdd.mock(3, 4)

console.log(mockAdd.calledWith(1, 2)) // true
console.log(mockAdd.calls) // [[1, 2], [3, 4]]
```

### 5.5. 应用 5：柯里化函数

```ts
function curry<T extends any[], R>(fn: (...args: T) => R) {
  return function curried(...args: Partial<T>): any {
    if (args.length >= fn.length) {
      return fn(...(args as T))
    }
    return (...nextArgs: any[]) => curried(...args, ...nextArgs)
  }
}

function add3(a: number, b: number, c: number): number {
  return a + b + c
}

const curriedAdd = curry(add3)
curriedAdd(1)(2)(3) // 6
curriedAdd(1, 2)(3) // 6
curriedAdd(1, 2, 3) // 6

// 参数类型
type Add3Params = Parameters<typeof add3> // [number, number, number]
```

## 6. 🤔 使用 Parameters\<T\> 需要注意什么？

### 6.1. 注意事项 1：元组类型的结构

```ts
function example(a: string, b: number, c?: boolean): void {}

type Params = Parameters<typeof example>
// [a: string, b: number, c?: boolean]

// 访问特定参数
type FirstParam = Params[0] // string
type SecondParam = Params[1] // number
type ThirdParam = Params[2] // boolean | undefined
```

### 6.2. 注意事项 2：剩余参数

```ts
function spread(...args: number[]): void {}

type SpreadParams = Parameters<typeof spread>
// [... number[]]

// ⚠️ 剩余参数在元组中的表示
const params: SpreadParams = [1, 2, 3, 4, 5] // ✅
```

### 6.3. 注意事项 3：泛型函数

```ts
function identity<T>(value: T): T {
  return value
}

// ⚠️ 泛型信息丢失
type IdentityParams = Parameters<typeof identity>
// [value: unknown]
```

### 6.4. 注意事项 4：重载函数

```ts
function process(value: string): string
function process(value: number): number
function process(value: string | number): string | number {
  return value
}

// ⚠️ 只提取实现签名的参数
type ProcessParams = Parameters<typeof process>
// [value: string | number]
```

### 6.5. 注意事项 5：this 参数

```ts
function method(this: { count: number }, value: string): void {
  console.log(this.count, value)
}

// ⚠️ this 参数被忽略
type MethodParams = Parameters<typeof method>
// [value: string]
```

### 6.6. 注意事项 6：解构赋值

```ts
type Params = Parameters<typeof greet>
// [string, number?]

// ✅ 使用解构
function useGreet(): void {
  const [name, age]: Params = ['Alice', 25]
  greet(name, age)
}

function greet(name: string, age?: number): void {
  console.log(name, age)
}
```

### 6.7. 注意事项 7：与展开运算符配合

```ts
function example(a: number, b: string, c: boolean): void {}

type ExampleParams = Parameters<typeof example>

// ✅ 使用展开运算符
function wrapper(...args: ExampleParams): void {
  example(...args)
}

// ✅ 部分参数应用
function partial(a: number): (...args: [string, boolean]) => void {
  return (b, c) => example(a, b, c)
}
```

## 7. 🔗 引用

- [TypeScript Utility Types - Parameters][1]
- [TypeScript Handbook - Conditional Types][2]
- [TypeScript Handbook - Tuple Types][3]

[1]: https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterstype
[2]: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
[3]: https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types
