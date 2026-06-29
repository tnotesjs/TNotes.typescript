# [0219. OmitThisParameter](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0219.%20OmitThisParameter)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. `OmitThisParameter<T>` 的源码实现是什么？](#3-omitthisparametert-的源码实现是什么)
- [4. 如何使用 `OmitThisParameter<T>` 移除 this 参数？](#4-如何使用-omitthisparametert-移除-this-参数)
- [5. ThisParameterType vs. OmitThisParameter](#5-thisparametertype-vs-omitthisparameter)
- [6. `OmitThisParameter<T>` 在函数绑定中如何应用？](#6-omitthisparametert-在函数绑定中如何应用)
- [7. 使用 `OmitThisParameter<T>` 时需要注意哪些问题？](#7-使用-omitthisparametert-时需要注意哪些问题)
- [8. 引用](#8-引用)

<!-- endregion:toc -->

## 1. 本节内容

- `OmitThisParameter<T>` 的源码实现
- 移除函数的 `this` 参数
- 方法转换为独立函数
- 函数绑定后的类型表示
- 回调函数的类型转换

## 2. 评价

`OmitThisParameter<T>` 用于从函数类型中移除 `this` 参数，返回只包含其他参数的函数类型。

- 在方法绑定后，用于表示绑定后的函数类型
- 将类方法转换为独立函数时很有用
- 常用于回调函数的类型定义
- 与 `ThisParameterType<T>` 是互补的工具类型
- 如果原函数没有 `this` 参数，则返回原类型

## 3. `OmitThisParameter<T>` 的源码实现是什么？

`OmitThisParameter<T>` 的源码定义如下：

```ts
type OmitThisParameter<T> =
  unknown extends ThisParameterType<T>
    ? T
    : T extends (...args: infer A) => infer R
      ? (...args: A) => R
      : T
```

实现原理：

1. 检查 `this` 参数：使用 `unknown extends ThisParameterType<T>` 判断是否有显式 `this` 参数
2. 无 `this` 参数：如果 `ThisParameterType<T>` 返回 `unknown`，说明没有 `this` 参数，直接返回 `T`
3. 有 `this` 参数：使用条件类型 `T extends (...args: infer A) => infer R` 提取参数和返回值
4. 重构函数：返回 `(...args: A) => R`，不包含 `this` 参数

```ts
// 基本使用
function greet(this: { name: string }, greeting: string): string {
  return `${greeting}, ${this.name}`
}

// 移除 this 参数
type GreetWithoutThis = OmitThisParameter<typeof greet>
// (greeting: string) => string

// 验证类型
const boundGreet = greet.bind({ name: 'Alice' })
// boundGreet 的类型是 (greeting: string) => string

// ✅ 类型匹配
const typedBound: GreetWithoutThis = boundGreet
typedBound('Hello') // "Hello, Alice"

// 没有 this 参数的函数
function add(x: number, y: number): number {
  return x + y
}

// 返回原类型
type AddWithoutThis = OmitThisParameter<typeof add>
// (x: number, y: number) => number，与原类型相同
```

工作流程示例：

```ts
// 步骤 1：原始方法类型
class Calculator {
  value: number = 0

  add(this: Calculator, x: number): Calculator {
    this.value += x
    return this
  }
}

type AddMethod = Calculator['add']
// (this: Calculator, x: number) => Calculator

// 步骤 2：检查 this 类型
type AddThis = ThisParameterType<AddMethod>
// Calculator

// 步骤 3：移除 this 参数
type AddWithoutThis = OmitThisParameter<AddMethod>
// (x: number) => Calculator

// 步骤 4：完整转换
const calc = new Calculator()
const boundAdd = calc.add.bind(calc)
// boundAdd: (x: number) => Calculator

// ✅ 类型匹配
const typedAdd: AddWithoutThis = boundAdd
```

与其他工具类型的组合：

```ts
interface Service {
  data: string[]
  process(this: Service, input: string): Promise<string>
}

// 分析方法签名
type ProcessMethod = Service['process']

// 提取各部分
type ProcessThis = ThisParameterType<ProcessMethod>
// Service

type ProcessParams = Parameters<ProcessMethod>
// [input: string]

type ProcessReturn = ReturnType<ProcessMethod>
// Promise<string>

// 移除 this 参数
type ProcessWithoutThis = OmitThisParameter<ProcessMethod>
// (input: string) => Promise<string>

// 重建完整类型
type ReconstructedMethod = (
  this: ProcessThis,
  ...args: ProcessParams
) => ProcessReturn
// (this: Service, input: string) => Promise<string>
```

## 4. 如何使用 `OmitThisParameter<T>` 移除 this 参数？

在需要将方法转换为独立函数或处理绑定后的方法时，`OmitThisParameter<T>` 很有用：

```ts
// 场景 1：方法绑定
class Counter {
  count: number = 0

  increment(this: Counter, step: number = 1): number {
    this.count += step
    return this.count
  }

  decrement(this: Counter, step: number = 1): number {
    this.count -= step
    return this.count
  }
}

// 创建绑定方法
const counter = new Counter()
const increment = counter.increment.bind(counter)
const decrement = counter.decrement.bind(counter)

// ✅ 使用 OmitThisParameter 标注类型
type IncrementFn = OmitThisParameter<Counter['increment']>
// (step?: number) => number

const typedIncrement: IncrementFn = increment
typedIncrement(5) // count = 5

// 场景 2：回调函数类型
interface EventEmitter {
  listeners: Function[]
  on(this: EventEmitter, event: string, handler: Function): void
  emit(this: EventEmitter, event: string, ...args: any[]): void
}

// 将方法作为回调传递
type EmitCallback = OmitThisParameter<EventEmitter['emit']>
// (event: string, ...args: any[]) => void

function executeCallback(callback: EmitCallback) {
  callback('click', { x: 100, y: 200 })
}

const emitter: EventEmitter = {
  listeners: [],
  on(event, handler) {
    this.listeners.push(handler)
  },
  emit(event, ...args) {
    this.listeners.forEach((listener) => listener(...args))
  },
}

// ✅ 绑定后作为回调
executeCallback(emitter.emit.bind(emitter))

// 场景 3：高阶函数
function bindMethod<T extends (this: any, ...args: any) => any>(
  method: T,
  context: ThisParameterType<T>,
): OmitThisParameter<T> {
  return method.bind(context) as OmitThisParameter<T>
}

class Logger {
  prefix: string = '[LOG]'

  log(this: Logger, message: string): void {
    console.log(`${this.prefix} ${message}`)
  }
}

const logger = new Logger()
const boundLog = bindMethod(logger.log, logger)
// boundLog: (message: string) => void

boundLog('Hello') // [LOG] Hello

// 场景 4：方法批量绑定
class TaskManager {
  tasks: string[] = []

  addTask(this: TaskManager, task: string): void {
    this.tasks.push(task)
  }

  removeTask(this: TaskManager, task: string): void {
    const index = this.tasks.indexOf(task)
    if (index > -1) {
      this.tasks.splice(index, 1)
    }
  }

  getTasks(this: TaskManager): string[] {
    return this.tasks
  }
}

// 批量绑定方法
function bindAllMethods<T extends Record<string, any>>(instance: T) {
  type BoundMethods = {
    [K in keyof T]: T[K] extends (this: any, ...args: any) => any
      ? OmitThisParameter<T[K]>
      : T[K]
  }

  const bound = {} as BoundMethods

  for (const key in instance) {
    const value = instance[key]
    if (typeof value === 'function') {
      bound[key] = value.bind(instance) as any
    } else {
      bound[key] = value
    }
  }

  return bound
}

const taskManager = new TaskManager()
const boundMethods = bindAllMethods(taskManager)

// ✅ 所有方法都已绑定，不需要 this
boundMethods.addTask('Task 1')
boundMethods.addTask('Task 2')
console.log(boundMethods.getTasks()) // ['Task 1', 'Task 2']
```

## 5. ThisParameterType vs. OmitThisParameter

这两个工具类型是互补的，用于不同的场景：

| 特性         | `ThisParameterType<T>`           | `OmitThisParameter<T>` |
| ------------ | -------------------------------- | ---------------------- |
| 作用         | 提取 `this` 参数类型             | 移除 `this` 参数       |
| 返回值       | `this` 的类型（如 `Calculator`） | 不含 `this` 的函数类型 |
| 无 `this` 时 | 返回 `unknown`                   | 返回原类型             |
| 使用场景     | 验证 `this` 上下文               | 方法绑定后的类型       |
| 典型应用     | 装饰器、类型守卫                 | 回调函数、独立函数     |
| 配合使用     | 提取 → 验证                      | 提取 → 移除 → 重构     |

```ts
// 对比示例
class DataProcessor {
  data: string[] = []

  process(this: DataProcessor, input: string): string {
    this.data.push(input)
    return input.toUpperCase()
  }
}

type ProcessMethod = DataProcessor['process']
// (this: DataProcessor, input: string) => string

// 使用 ThisParameterType<T>
type ProcessThis = ThisParameterType<ProcessMethod>
// DataProcessor

// 使用 OmitThisParameter<T>
type ProcessWithoutThis = OmitThisParameter<ProcessMethod>
// (input: string) => string

// 配合使用示例
function safeBindMethod<T extends (this: any, ...args: any) => any>(
  method: T,
  context: ThisParameterType<T>,
): OmitThisParameter<T> {
  // 1. 提取 this 类型
  const thisType: ThisParameterType<T> = context

  // 2. 验证上下文
  if (!context) {
    throw new Error('Invalid context')
  }

  // 3. 绑定并返回不含 this 的函数
  return method.bind(context) as OmitThisParameter<T>
}

const processor = new DataProcessor()
const boundProcess = safeBindMethod(processor.process, processor)
// boundProcess: (input: string) => string

console.log(boundProcess('hello')) // "HELLO"

// 完整的类型转换流程
function analyzeMethod<T extends (this: any, ...args: any) => any>(
  method: T,
): {
  withThis: T
  thisType: ThisParameterType<T>
  withoutThis: OmitThisParameter<T>
  params: Parameters<OmitThisParameter<T>>
  returnType: ReturnType<T>
} {
  return {
    withThis: method,
    thisType: undefined as any,
    withoutThis: undefined as any,
    params: undefined as any,
    returnType: undefined as any,
  }
}

const analysis = analyzeMethod(processor.process)
// {
//   withThis: (this: DataProcessor, input: string) => string;
//   thisType: DataProcessor;
//   withoutThis: (input: string) => string;
//   params: [input: string];
//   returnType: string;
// }
```

## 6. `OmitThisParameter<T>` 在函数绑定中如何应用？

在处理函数绑定、回调和方法提取时，`OmitThisParameter<T>` 提供精确的类型表示：

```ts
// 应用 1：React 事件处理器
class ReactComponent {
  state = { count: 0 }

  handleClick(this: ReactComponent, event: React.MouseEvent): void {
    this.setState({ count: this.state.count + 1 })
  }

  setState(newState: any) {
    this.state = { ...this.state, ...newState }
  }

  // 在构造函数中绑定
  constructor() {
    this.handleClick = this.handleClick.bind(this)
  }
}

// 绑定后的类型
type BoundHandleClick = OmitThisParameter<ReactComponent['handleClick']>
// (event: React.MouseEvent) => void

// 应用 2：事件监听器管理
class EventManager {
  handlers: Map<string, Function[]> = new Map()

  addEventListener<T extends (this: any, ...args: any) => any>(
    event: string,
    handler: T,
    context: ThisParameterType<T>,
  ): OmitThisParameter<T> {
    const boundHandler = handler.bind(context) as OmitThisParameter<T>

    if (!this.handlers.has(event)) {
      this.handlers.set(event, [])
    }
    this.handlers.get(event)!.push(boundHandler)

    return boundHandler
  }

  emit(event: string, ...args: any[]): void {
    const handlers = this.handlers.get(event)
    if (handlers) {
      handlers.forEach((handler) => handler(...args))
    }
  }
}

class Button {
  label: string = 'Click me'

  onClick(this: Button, event: MouseEvent): void {
    console.log(`${this.label} clicked at (${event.clientX}, ${event.clientY})`)
  }
}

const eventManager = new EventManager()
const button = new Button()

// ✅ 添加监听器并获取绑定后的函数
const boundClick = eventManager.addEventListener(
  'click',
  button.onClick,
  button,
)
// boundClick: (event: MouseEvent) => void

// 应用 3：方法柯里化
function curry<T extends (this: any, ...args: any) => any>(
  method: T,
  context: ThisParameterType<T>,
): (...args: Parameters<OmitThisParameter<T>>) => ReturnType<T> {
  return (...args: Parameters<OmitThisParameter<T>>) => {
    return method.apply(context, args)
  }
}

class Calculator3 {
  base: number = 10

  add(this: Calculator3, x: number, y: number): number {
    return this.base + x + y
  }
}

const calc = new Calculator3()
const curriedAdd = curry(calc.add, calc)
// curriedAdd: (x: number, y: number) => number

console.log(curriedAdd(5, 3)) // 18

// 应用 4：装饰器模式
function memoize<T extends (this: any, ...args: any) => any>(
  method: T,
  context: ThisParameterType<T>,
): OmitThisParameter<T> {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<OmitThisParameter<T>>) => {
    const key = JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = method.apply(context, args)
    cache.set(key, result)
    return result
  }) as OmitThisParameter<T>
}

class ExpensiveCalculator {
  compute(this: ExpensiveCalculator, n: number): number {
    console.log(`Computing for ${n}`)
    return n * n
  }
}

const expensiveCalc = new ExpensiveCalculator()
const memoizedCompute = memoize(expensiveCalc.compute, expensiveCalc)
// memoizedCompute: (n: number) => number

console.log(memoizedCompute(5)) // Computing for 5, 返回 25
console.log(memoizedCompute(5)) // 直接返回 25，不打印

// 应用 5：Promise 化方法
function promisify<T extends (this: any, ...args: any) => any>(
  method: T,
  context: ThisParameterType<T>,
): (...args: Parameters<OmitThisParameter<T>>) => Promise<ReturnType<T>> {
  return (...args: Parameters<OmitThisParameter<T>>) => {
    return Promise.resolve(method.apply(context, args))
  }
}

class FileReader {
  readFile(this: FileReader, path: string): string {
    return `Content of ${path}`
  }
}

const reader = new FileReader()
const readFileAsync = promisify(reader.readFile, reader)
// readFileAsync: (path: string) => Promise<string>

readFileAsync('file.txt').then((content) => {
  console.log(content) // "Content of file.txt"
})
```

## 7. 使用 `OmitThisParameter<T>` 时需要注意哪些问题？

在使用 `OmitThisParameter<T>` 时，有以下几点需要注意：

```ts
// 注意 1：箭头函数没有影响
const arrowMethod = (x: number) => x * 2
type ArrowWithoutThis = OmitThisParameter<typeof arrowMethod>
// (x: number) => number，与原类型相同

// 注意 2：没有显式 this 参数时返回原类型
function regularFunc(x: number, y: number): number {
  return x + y
}
type RegularWithoutThis = OmitThisParameter<typeof regularFunc>
// (x: number, y: number) => number，与原类型相同

// 注意 3：绑定后类型安全性
class Service {
  data: string = 'data'

  process(this: Service, input: string): string {
    return `${this.data}: ${input}`
  }
}

const service = new Service()
const bound = service.process.bind(service)

// ✅ 类型正确
type BoundType = OmitThisParameter<Service['process']>
const typed: BoundType = bound

// ⚠️ bind 可能绑定错误的上下文
const wrongBound = service.process.bind({ data: 123 })
// TypeScript 无法在运行时检测这个错误

// 注意 4：泛型方法的处理
class GenericService<T> {
  process(this: GenericService<T>, input: T): T {
    return input
  }
}

// ⚠️ 泛型参数会保留
type GenericProcessWithoutThis = OmitThisParameter<
  GenericService<number>['process']
>
// (input: number) => number

// 注意 5：重载函数
class Overloaded {
  process(this: Overloaded, x: number): number
  process(this: Overloaded, x: string): string
  process(this: Overloaded, x: number | string): number | string {
    return typeof x === 'number' ? x * 2 : x.repeat(2)
  }
}

// ⚠️ 只会移除实现签名的 this
type OverloadedWithoutThis = OmitThisParameter<Overloaded['process']>
// (x: number | string) => number | string

// 注意 6：与可选参数
class OptionalParams {
  format(this: OptionalParams, template: string, ...args: any[]): string {
    return template
  }
}

type FormatWithoutThis = OmitThisParameter<OptionalParams['format']>
// (template: string, ...args: any[]) => string

// ✅ 剩余参数保留
const format: FormatWithoutThis = (template, ...args) => template

// 注意 7：方法链式调用
class Builder {
  value: string = ''

  append(this: Builder, text: string): Builder {
    this.value += text
    return this
  }
}

// ⚠️ 移除 this 后失去链式调用能力
type AppendWithoutThis = OmitThisParameter<Builder['append']>
// (text: string) => Builder

const builder = new Builder()
const boundAppend = builder.append.bind(builder)

// ❌ 无法继续链式调用
boundAppend('Hello').append('World') // Error: append 不存在
```

常见陷阱和解决方案：

```ts
// 陷阱 1：丢失方法链
class FluentAPI {
  value: number = 0

  add(this: FluentAPI, x: number): FluentAPI {
    this.value += x
    return this
  }

  multiply(this: FluentAPI, x: number): FluentAPI {
    this.value *= x
    return this
  }
}

// ❌ 绑定后丢失链式调用
const api = new FluentAPI()
const boundAdd = api.add.bind(api)
const boundMultiply = api.multiply.bind(api)

// 无法链式调用
boundAdd(5)
boundMultiply(2) // 需要分别调用

// ✅ 解决方案：保留原对象
const chainableAPI = {
  add: (x: number) => api.add(x),
  multiply: (x: number) => api.multiply(x),
}

chainableAPI.add(5).multiply(2) // ✅ 可以链式调用

// 陷阱 2：异步方法的 this 丢失
class AsyncService {
  data: string = 'data'

  async fetch(this: AsyncService, url: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return `${this.data}: ${url}`
  }
}

const asyncService = new AsyncService()

// ❌ 错误：setTimeout 中 this 丢失
setTimeout(asyncService.fetch, 100, 'https://api.com')

// ✅ 解决方案：使用箭头函数或 bind
setTimeout(() => asyncService.fetch('https://api.com'), 100)
setTimeout(asyncService.fetch.bind(asyncService), 100, 'https://api.com')

// 陷阱 3：类型断言的危险
class UnsafeService {
  id: number = 1

  getId(this: UnsafeService): number {
    return this.id
  }
}

// ⚠️ 强制类型断言可能不安全
const unsafeService = new UnsafeService()
const unsafeGetId = unsafeService.getId.bind({
  id: 'wrong',
}) as OmitThisParameter<UnsafeService['getId']>

// ❌ 运行时错误：this.id 是字符串
console.log(unsafeGetId()) // NaN 或类型错误

// 陷阱 4：构造函数不适用
class MyClass {
  constructor(public value: number) {}
}

// ❌ 构造函数不是普通方法
type CtorWithoutThis = OmitThisParameter<typeof MyClass>
// typeof MyClass，不会移除任何东西

// ✅ 构造函数使用 ConstructorParameters
type CtorParams = ConstructorParameters<typeof MyClass>
// [value: number]
```

## 8. 引用

- [TypeScript Handbook - Utility Types - OmitThisParameter][1]
- [TypeScript Deep Dive - this Types][2]
- [Function Binding and this in TypeScript][3]

[1]: https://www.typescriptlang.org/docs/handbook/utility-types.html#omitthisparametertype
[2]: https://basarat.gitbook.io/typescript/type-system/this
[3]: https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function
