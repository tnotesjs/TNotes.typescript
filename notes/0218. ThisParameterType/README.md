# [0218. ThisParameterType](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0218.%20ThisParameterType)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 `ThisParameterType<T>` 的源码实现是什么？](#3--thisparametertypet-的源码实现是什么)
- [4. 🤔 如何使用 `ThisParameterType<T>` 提取 this 参数类型？](#4--如何使用-thisparametertypet-提取-this-参数类型)
- [5. 🤔 `ThisParameterType<T>` 在方法绑定中如何应用？](#5--thisparametertypet-在方法绑定中如何应用)
- [6. 🤔 使用 `ThisParameterType<T>` 时需要注意哪些问题？](#6--使用-thisparametertypet-时需要注意哪些问题)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- `ThisParameterType<T>` 的源码实现
- 显式 `this` 参数的类型提取
- 方法绑定和上下文验证
- 装饰器中的 `this` 类型处理
- 函数式混入的 `this` 约束

## 2. 🫧 评价

`ThisParameterType<T>` 用于提取函数类型的 `this` 参数类型，主要用于需要明确 `this` 上下文的场景。

- 在方法装饰器中，用于验证 `this` 的类型
- 在函数绑定时，确保上下文类型正确
- 如果函数没有显式声明 `this` 参数，返回 `unknown`
- 常与 `OmitThisParameter<T>` 配合使用
- 需要启用 `strictBindCallApply` 获得更好的类型检查

## 3. 🤔 `ThisParameterType<T>` 的源码实现是什么？

`ThisParameterType<T>` 的源码定义如下：

```ts
type ThisParameterType<T> = T extends (this: infer U, ...args: never) => any
  ? U
  : unknown
```

实现原理：

1. 条件类型：检查 `T` 是否匹配 `(this: infer U, ...args: never) => any`
2. 推断变量：使用 `infer U` 捕获 `this` 参数的类型
3. 忽略参数：使用 `...args: never` 表示忽略其他参数
4. 返回值：提取到 `this` 类型则返回 `U`，否则返回 `unknown`

基本使用：

```ts
interface User {
  name: string
  greet(this: User): void
}

// 提取 this 参数类型
type GreetThis = ThisParameterType<User['greet']>
// type GreetThis = User

// 函数类型的 this 参数
type FunctionWithThis = (this: HTMLElement, event: Event) => void
type ElementThis = ThisParameterType<FunctionWithThis>
// type ElementThis = HTMLElement

// 没有 this 参数的函数
type RegularFunction = (x: number) => string
type NoThis = ThisParameterType<RegularFunction>
// type NoThis = unknown

// 箭头函数没有 this 参数
const arrowFunc = () => {}
type ArrowThis = ThisParameterType<typeof arrowFunc>
// type ArrowThis = unknown
```

与其他类型工具的配合：

```ts
class Calculator {
  value: number = 0

  add(this: Calculator, x: number): Calculator {
    this.value += x
    return this
  }

  multiply(this: Calculator, x: number): Calculator {
    this.value *= x
    return this
  }
}

// 提取 this 类型
type AddThis = ThisParameterType<Calculator['add']>
// Calculator

// 提取参数类型（不包括 this）
type AddParams = Parameters<Calculator['add']>
// [x: number]

// 提取返回类型
type AddReturn = ReturnType<Calculator['add']>
// Calculator

// 完整的函数签名分析
type MethodSignature<T extends (this: any, ...args: any) => any> = {
  thisType: ThisParameterType<T>
  params: Parameters<T>
  returnType: ReturnType<T>
}

type AddSignature = MethodSignature<Calculator['add']>
// {
//   thisType: Calculator;
//   params: [x: number];
//   returnType: Calculator;
// }
```

## 4. 🤔 如何使用 `ThisParameterType<T>` 提取 this 参数类型？

在需要操作或验证函数的 `this` 上下文时，`ThisParameterType<T>` 非常有用：

```ts
// 场景 1：类型安全的事件处理器
interface EventHandler {
  handleClick(this: EventHandler, event: MouseEvent): void
  handleKeyPress(this: EventHandler, event: KeyboardEvent): void
}

// 提取 this 类型并验证
type HandlerThis = ThisParameterType<EventHandler['handleClick']>
// EventHandler

function bindEventHandler<T extends (...args: any) => any>(
  handler: T,
  context: ThisParameterType<T>
): T {
  return handler.bind(context) as T
}

const eventHandler: EventHandler = {
  handleClick(event: MouseEvent) {
    console.log('Clicked', this)
  },
  handleKeyPress(event: KeyboardEvent) {
    console.log('Key pressed', this)
  },
}

// ✅ 类型安全的绑定
const boundHandler = bindEventHandler(eventHandler.handleClick, eventHandler)

// 场景 2：方法调用验证
interface Logger {
  prefix: string
  log(this: Logger, message: string): void
}

function callWithThis<T extends (this: any, ...args: any) => any>(
  fn: T,
  thisArg: ThisParameterType<T>,
  ...args: Parameters<T>
): ReturnType<T> {
  return fn.apply(thisArg, args)
}

const logger: Logger = {
  prefix: '[LOG]',
  log(message: string) {
    console.log(`${this.prefix} ${message}`)
  },
}

// ✅ 类型安全调用
callWithThis(logger.log, logger, 'Hello, World!')

// ❌ 错误：this 类型不匹配
callWithThis(logger.log, { prefix: 123 }, 'Error')

// 场景 3：链式调用的 this 类型
class QueryBuilder {
  private query: string = ''

  select(this: QueryBuilder, fields: string[]): QueryBuilder {
    this.query += `SELECT ${fields.join(', ')} `
    return this
  }

  from(this: QueryBuilder, table: string): QueryBuilder {
    this.query += `FROM ${table} `
    return this
  }

  where(this: QueryBuilder, condition: string): QueryBuilder {
    this.query += `WHERE ${condition}`
    return this
  }

  build(): string {
    return this.query
  }
}

// 验证每个方法的 this 类型
type SelectThis = ThisParameterType<QueryBuilder['select']>
// QueryBuilder

type FromThis = ThisParameterType<QueryBuilder['from']>
// QueryBuilder

// 确保链式调用类型安全
const query = new QueryBuilder()
  .select(['id', 'name'])
  .from('users')
  .where('age > 18')
  .build()

// 场景 4：混入模式的 this 约束
interface Timestamped {
  createdAt: Date
  updatedAt: Date
  touch(this: Timestamped): void
}

interface Named {
  name: string
  setName(this: Named, name: string): void
}

// 组合多个混入
type Combined = Timestamped & Named

function applyMixins<T extends Combined>(target: T) {
  // 提取每个方法的 this 类型
  type TouchThis = ThisParameterType<Timestamped['touch']>
  // Timestamped

  type SetNameThis = ThisParameterType<Named['setName']>
  // Named

  // ✅ target 必须满足所有 this 类型约束
  return target
}
```

## 5. 🤔 `ThisParameterType<T>` 在方法绑定中如何应用？

在处理方法绑定、装饰器和上下文管理时，`ThisParameterType<T>` 提供类型安全保障：

```ts
// 应用 1：装饰器中的 this 类型验证
function LogMethod<T extends (this: any, ...args: any) => any>(
  target: ThisParameterType<T>,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<T>
) {
  const originalMethod = descriptor.value
  if (!originalMethod) return

  descriptor.value = function (
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ) {
    console.log(`Calling ${propertyKey} with`, args)
    const result = originalMethod.apply(this, args)
    console.log(`Result:`, result)
    return result
  } as T
}

class Service {
  name: string = 'Service'

  @LogMethod
  process(this: Service, data: string): string {
    return `${this.name}: ${data}`
  }
}

// 应用 2：自动绑定装饰器
function AutoBind<T extends (this: any, ...args: any) => any>(
  target: any,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<T>
) {
  const originalMethod = descriptor.value
  if (!originalMethod) return

  return {
    configurable: true,
    get() {
      // ✅ 提取并保持 this 类型
      const bound = originalMethod.bind(this) as T
      return bound
    },
  }
}

class Component {
  private count: number = 0

  @AutoBind
  increment(this: Component) {
    this.count++
    console.log(this.count)
  }
}

const component = new Component()
const { increment } = component
increment() // ✅ this 已自动绑定，不会报错

// 应用 3：this 类型守卫
function ensureThis<T extends (this: any, ...args: any) => any>(
  fn: T,
  expectedThis: ThisParameterType<T>
): T {
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (this !== expectedThis) {
      throw new Error('Invalid this context')
    }
    return fn.apply(this, args)
  } as T
}

interface Counter {
  count: number
  increment(this: Counter): void
}

const counter: Counter = {
  count: 0,
  increment() {
    this.count++
  },
}

// ✅ 确保 this 上下文正确
const safeIncrement = ensureThis(counter.increment, counter)
safeIncrement.call(counter) // ✅ 正确的 this
safeIncrement.call({}) // ❌ 抛出错误

// 应用 4：方法提取器
class MethodExtractor {
  static extract<T extends Record<string, any>, K extends keyof T>(
    obj: T,
    methodName: K
  ): T[K] extends (this: any, ...args: any) => any
    ? {
        method: T[K]
        thisType: ThisParameterType<T[K]>
        params: Parameters<T[K]>
        returnType: ReturnType<T[K]>
      }
    : never {
    const method = obj[methodName]

    return {
      method,
      thisType: obj as any,
      params: [] as any,
      returnType: undefined as any,
    }
  }
}

class Calculator2 {
  value: number = 0

  add(this: Calculator2, x: number): number {
    return this.value + x
  }
}

const calc = new Calculator2()
const extracted = MethodExtractor.extract(calc, 'add')
// {
//   method: (this: Calculator2, x: number) => number;
//   thisType: Calculator2;
//   params: [x: number];
//   returnType: number;
// }

// 应用 5：React 类组件的方法绑定
class ReactComponent {
  state = { count: 0 }

  handleClick(this: ReactComponent, event: React.MouseEvent) {
    this.setState({ count: this.state.count + 1 })
  }

  // 使用箭头函数自动绑定
  handleClickAuto = (event: React.MouseEvent) => {
    // ⚠️ 箭头函数没有 this 参数
    this.setState({ count: this.state.count + 1 })
  }

  setState(state: any) {
    this.state = { ...this.state, ...state }
  }
}

// 提取 this 类型
type HandleClickThis = ThisParameterType<ReactComponent['handleClick']>
// ReactComponent

type HandleClickAutoThis = ThisParameterType<ReactComponent['handleClickAuto']>
// unknown，箭头函数没有 this 参数
```

## 6. 🤔 使用 `ThisParameterType<T>` 时需要注意哪些问题？

在使用 `ThisParameterType<T>` 时，有以下几点需要注意：

```ts
// 注意 1：箭头函数没有 this 参数
const arrowFunc = (x: number) => x * 2
type ArrowThis = ThisParameterType<typeof arrowFunc>
// unknown，箭头函数没有 this 参数

// ✅ 只有函数声明和方法才有 this 参数
function regularFunc(this: Window, x: number) {
  return x * 2
}
type RegularThis = ThisParameterType<typeof regularFunc>
// Window

// 注意 2：没有显式 this 参数时返回 unknown
function implicitThis(x: number) {
  // this 是隐式的，类型为 any（非严格模式）
  return x
}
type ImplicitThis = ThisParameterType<typeof implicitThis>
// unknown

// ✅ 需要显式声明 this 参数
function explicitThis(this: string, x: number) {
  return this.repeat(x)
}
type ExplicitThis = ThisParameterType<typeof explicitThis>
// string

// 注意 3：类方法的 this 默认指向实例
class MyClass {
  value: number = 0

  // ⚠️ 没有显式 this 参数
  method1(x: number) {
    return this.value + x
  }

  // ✅ 显式 this 参数
  method2(this: MyClass, x: number) {
    return this.value + x
  }
}

type Method1This = ThisParameterType<MyClass['method1']>
// unknown，没有显式声明

type Method2This = ThisParameterType<MyClass['method2']>
// MyClass

// 注意 4：strictBindCallApply 影响
// tsconfig.json: { "strictBindCallApply": true }

interface Context {
  name: string
}

function greet(this: Context, greeting: string) {
  return `${greeting}, ${this.name}`
}

const context: Context = { name: 'Alice' }

// ✅ strictBindCallApply 开启时类型检查更严格
const bound = greet.bind(context)
bound('Hello') // ✅ 类型安全

// ❌ 错误的 this 类型
const wrongBound = greet.bind({ name: 123 })

// 注意 5：泛型函数的 this 类型
function genericMethod<T>(this: T[], item: T): T[] {
  this.push(item)
  return this
}

type GenericThis = ThisParameterType<typeof genericMethod>
// unknown[]，泛型参数丢失

// ⚠️ 泛型信息会丢失
const numbers: number[] = []
genericMethod.call(numbers, 42) // ✅ 运行时正确

// 注意 6：this 参数不计入 Parameters<T>
function withThis(this: string, x: number, y: string): void {}

type ThisType = ThisParameterType<typeof withThis>
// string

type Params = Parameters<typeof withThis>
// [x: number, y: string]，不包括 this

// 注意 7：与 OmitThisParameter<T> 配合
function methodWithThis(this: { count: number }, increment: number) {
  this.count += increment
}

// 提取 this 类型
type MethodThis = ThisParameterType<typeof methodWithThis>
// { count: number }

// 移除 this 参数
type MethodWithoutThis = OmitThisParameter<typeof methodWithThis>
// (increment: number) => void

// ✅ 可以转换为普通函数
const obj = { count: 0 }
const normalFunc: MethodWithoutThis = methodWithThis.bind(obj)
normalFunc(5) // count 变为 5
```

常见陷阱和解决方案：

```ts
// 陷阱 1：接口方法的 this 类型
interface Service {
  name: string
  execute(): void
}

// ❌ 接口方法默认没有显式 this 参数
type ServiceThis = ThisParameterType<Service['execute']>
// unknown

// ✅ 需要显式声明
interface ServiceWithThis {
  name: string
  execute(this: ServiceWithThis): void
}

type ServiceWithThisType = ThisParameterType<ServiceWithThis['execute']>
// ServiceWithThis

// 陷阱 2：构造函数没有 this 参数
class MyClass2 {
  constructor(public value: number) {}
}

// ❌ 构造函数不适用
type ConstructorThis = ThisParameterType<typeof MyClass2>
// unknown

// ✅ 构造函数使用 InstanceType<T>
type InstanceThis = InstanceType<typeof MyClass2>
// MyClass2

// 陷阱 3：对象字面量方法
const obj2 = {
  value: 42,
  getValue() {
    return this.value
  },
}

// ⚠️ 对象字面量方法的 this 是隐式的
type ObjMethodThis = ThisParameterType<typeof obj2.getValue>
// unknown

// 陷阱 4：回调函数的 this 丢失
class Handler {
  data: string = 'data'

  process(this: Handler) {
    console.log(this.data)
  }
}

const handler = new Handler()

// ❌ 错误：this 上下文丢失
setTimeout(handler.process, 1000) // this 是 undefined

// ✅ 解决方案 1：箭头函数
setTimeout(() => handler.process(), 1000)

// ✅ 解决方案 2：bind
setTimeout(handler.process.bind(handler), 1000)

// ✅ 解决方案 3：箭头函数方法
class Handler2 {
  data: string = 'data'

  process = () => {
    console.log(this.data)
  }
}
```

## 7. 🔗 引用

- [TypeScript Handbook - Utility Types - ThisParameterType][1]
- [TypeScript Deep Dive - this Parameter][2]
- [Understanding this in TypeScript][3]

[1]: https://www.typescriptlang.org/docs/handbook/utility-types.html#thisparametertypetype
[2]: https://basarat.gitbook.io/typescript/type-system/this
[3]: https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function
