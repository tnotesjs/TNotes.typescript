# [0277. 高级类型技巧](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0277.%20%E9%AB%98%E7%BA%A7%E7%B1%BB%E5%9E%8B%E6%8A%80%E5%B7%A7)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 品牌类型（Branded Types）？](#3-品牌类型branded-types)
  - [3.1. 基本实现](#31-基本实现)
  - [3.2. 实际应用](#32-实际应用)
- [4. 幻影类型（Phantom Types）？](#4-幻影类型phantom-types)
  - [4.1. 基本实现](#41-基本实现)
  - [4.2. 已解析 vs. 未解析](#42-已解析-vs-未解析)
- [5. Builder 模式的类型安全实现？](#5-builder-模式的类型安全实现)
  - [5.1. 类型安全 Builder](#51-类型安全-builder)
  - [5.2. 可选和必需属性](#52-可选和必需属性)
- [6. 状态机的类型建模？](#6-状态机的类型建模)
  - [6.1. 基本状态机](#61-基本状态机)
  - [6.2. 带上下文的状态机](#62-带上下文的状态机)
- [7. 高阶类型操作？](#7-高阶类型操作)
  - [7.1. 递归类型](#71-递归类型)
  - [7.2. 类型级函数](#72-类型级函数)
  - [7.3. 类型级计算](#73-类型级计算)
- [8. 引用](#8-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 品牌类型
- 幻影类型
- Builder 模式
- 状态机建模
- 高阶类型操作

## 2. 评价

高级类型技巧可以实现更强的类型安全和更好的 API 设计。

- 品牌类型防止原始类型误用
- 幻影类型携带编译时信息
- Builder 模式提供类型安全的构建过程
- 状态机确保状态转换合法
- 高阶类型提升类型系统表达力

## 3. 品牌类型（Branded Types）？

品牌类型为原始类型添加标记，防止误用。

### 3.1. 基本实现

```ts
// ✅ 品牌类型模式
type Brand<K, T> = K & { __brand: T }

// 创建品牌类型
type UserId = Brand<number, 'UserId'>
type ProductId = Brand<number, 'ProductId'>
type Email = Brand<string, 'Email'>

// 类型守卫
function isUserId(value: number): value is UserId {
  // 实际验证逻辑
  return value > 0 && Number.isInteger(value)
}

function isEmail(value: string): value is Email {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

// 工厂函数
function createUserId(value: number): UserId {
  if (!isUserId(value)) {
    throw new Error('Invalid user ID')
  }
  return value as UserId
}

function createEmail(value: string): Email {
  if (!isEmail(value)) {
    throw new Error('Invalid email')
  }
  return value as Email
}

// 使用
const userId = createUserId(123)
const productId = 456 as ProductId

function getUserById(id: UserId) {
  console.log(`Getting user ${id}`)
}

function getProductById(id: ProductId) {
  console.log(`Getting product ${id}`)
}

getUserById(userId) // ✅
// getUserById(productId);  // ❌ 类型错误：ProductId 不能赋值给 UserId
```

### 3.2. 实际应用

```ts
// ✅ 货币类型
type USD = Brand<number, 'USD'>
type EUR = Brand<number, 'EUR'>
type CNY = Brand<number, 'CNY'>

function createUSD(amount: number): USD {
  return amount as USD
}

function convertUSDToEUR(usd: USD, rate: number): EUR {
  return (usd * rate) as EUR
}

const price = createUSD(100)
const eurPrice = convertUSDToEUR(price, 0.85)

// ❌ 防止货币混用
// const total: USD = eurPrice;  // 类型错误

// ✅ URL 类型
type URL = Brand<string, 'URL'>
type FilePath = Brand<string, 'FilePath'>

function fetchFromURL(url: URL): Promise<string> {
  return fetch(url).then((res) => res.text())
}

function readFile(path: FilePath): string {
  // 文件读取逻辑
  return ''
}

const url = 'https://example.com' as URL
const path = '/path/to/file' as FilePath

fetchFromURL(url) // ✅
// fetchFromURL(path);  // ❌ FilePath 不能赋值给 URL
```

## 4. 幻影类型（Phantom Types）？

幻影类型携带编译时信息但不影响运行时。

### 4.1. 基本实现

```ts
// ✅ 幻影类型：类型参数不出现在值中
type Validated<T, V> = T & { __validation: V }

type NotValidated = 'NotValidated'
type IsValidated = 'IsValidated'

// 未验证的数据
type UnvalidatedUser = Validated<
  { email: string; password: string },
  NotValidated
>

// 已验证的数据
type ValidatedUser = Validated<{ email: string; password: string }, IsValidated>

// 验证函数
function validate(user: UnvalidatedUser): ValidatedUser {
  // 执行验证逻辑
  if (user.email && user.password.length >= 8) {
    return user as ValidatedUser
  }
  throw new Error('Validation failed')
}

// 只接受已验证的数据
function saveUser(user: ValidatedUser) {
  console.log('Saving user:', user.email)
}

// 使用
const unvalidated: UnvalidatedUser = {
  email: 'user@example.com',
  password: 'password123',
} as UnvalidatedUser

// saveUser(unvalidated);  // ❌ 类型错误

const validated = validate(unvalidated)
saveUser(validated) // ✅
```

### 4.2. 已解析 vs. 未解析

```ts
// ✅ 追踪数据解析状态
type Parsed = 'Parsed'
type Unparsed = 'Unparsed'

type JSONString<S = Unparsed> = string & { __state: S }

function parseJSON<T>(json: JSONString<Unparsed>): T {
  return JSON.parse(json)
}

// 只接受已解析的 JSON
function processData<T>(data: T, _source: JSONString<Parsed>) {
  console.log('Processing:', data)
}

const rawJSON = '{"name":"Tom"}' as JSONString<Unparsed>
// processData(rawJSON, rawJSON);  // ❌ Unparsed 不能赋值给 Parsed

const data = parseJSON<{ name: string }>(rawJSON)
processData(data, rawJSON as JSONString<Parsed>) // ✅
```

## 5. Builder 模式的类型安全实现？

Builder 模式可以确保必需属性被设置。

### 5.1. 类型安全 Builder

```ts
// ✅ 使用幻影类型跟踪已设置的属性
type Builder<T, K extends keyof T = never> = {
  [P in Exclude<keyof T, K>]: (value: T[P]) => Builder<T, K | P>
} & {
  build: K extends keyof T ? () => T : never
}

interface User {
  name: string
  email: string
  age: number
}

function createUserBuilder(): Builder<User> {
  const data: Partial<User> = {}

  const builder: any = {
    name: (value: string) => {
      data.name = value
      return builder
    },
    email: (value: string) => {
      data.email = value
      return builder
    },
    age: (value: number) => {
      data.age = value
      return builder
    },
    build: () => {
      if (!data.name || !data.email || data.age === undefined) {
        throw new Error('Missing required fields')
      }
      return data as User
    },
  }

  return builder
}

// 使用
const user = createUserBuilder()
  .name('Tom')
  .email('tom@example.com')
  .age(25)
  .build() // ✅

// ❌ 缺少必需属性时 build() 不可用
// const incomplete = createUserBuilder()
//   .name("Tom")
//   .build();  // 类型错误：build 不存在
```

### 5.2. 可选和必需属性

```ts
// ✅ 区分可选和必需属性
type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T]

type OptionalKeys<T> = Exclude<keyof T, RequiredKeys<T>>

type SmartBuilder<T, Set extends keyof T = never> = {
  [K in Exclude<keyof T, Set>]: (value: T[K]) => SmartBuilder<T, Set | K>
} & {
  build: RequiredKeys<T> extends Set ? () => T : never
}

interface Config {
  host: string // 必需
  port: number // 必需
  timeout?: number // 可选
  retries?: number // 可选
}

declare function createConfigBuilder(): SmartBuilder<Config>

// 只设置必需属性即可 build
const config = createConfigBuilder().host('localhost').port(3000).build() // ✅

// 也可以设置可选属性
const fullConfig = createConfigBuilder()
  .host('localhost')
  .port(3000)
  .timeout(5000)
  .retries(3)
  .build() // ✅
```

## 6. 状态机的类型建模？

类型系统可以确保状态转换的合法性。

### 6.1. 基本状态机

```ts
// ✅ 状态机类型
type State = 'idle' | 'loading' | 'success' | 'error'

type Event =
  | { type: 'FETCH' }
  | { type: 'RESOLVE'; data: string }
  | { type: 'REJECT'; error: Error }
  | { type: 'RETRY' }

// 合法的状态转换
type Transitions = {
  idle: { FETCH: 'loading' }
  loading: { RESOLVE: 'success'; REJECT: 'error' }
  success: {}
  error: { RETRY: 'loading' }
}

// 状态机实现
class StateMachine<S extends State> {
  constructor(private state: S) {}

  // 类型安全的转换
  send<E extends Event>(
    event: E,
  ): E['type'] extends keyof Transitions[S]
    ? StateMachine<Transitions[S][E['type']]>
    : never {
    // 实现状态转换逻辑
    // ...
    return this as any
  }

  getState(): S {
    return this.state
  }
}

// 使用
const machine = new StateMachine('idle' as const)

const loading = machine.send({ type: 'FETCH' }) // ✅ idle -> loading
const success = loading.send({ type: 'RESOLVE', data: 'result' }) // ✅
// const invalid = machine.send({ type: "RESOLVE", data: "" });  // ❌ idle 不能 RESOLVE
```

### 6.2. 带上下文的状态机

```ts
// ✅ 状态机带上下文
type Context<S extends State> = S extends 'success'
  ? { data: string }
  : S extends 'error'
    ? { error: Error }
    : {}

class ContextualStateMachine<S extends State> {
  constructor(
    private state: S,
    private context: Context<S>,
  ) {}

  getContext(): Context<S> {
    return this.context
  }

  send<E extends Event>(event: E): ContextualStateMachine<any> {
    // 根据事件更新状态和上下文
    // ...
    return this as any
  }
}

// 使用zoom
const machine2 = new ContextualStateMachine('idle' as const, {})
const successMachine = machine2.send({ type: 'FETCH' }).send({
  type: 'RESOLVE',
  data: 'result',
})

// successMachine.getContext() 的类型是 { data: string }
```

## 7. 高阶类型操作？

高级的类型级编程技巧。

### 7.1. 递归类型

```ts
// ✅ 深度只读
type DeepReadonly<T> = T extends (infer R)[]
  ? DeepReadonlyArray<R>
  : T extends Function
    ? T
    : T extends object
      ? DeepReadonlyObject<T>
      : T

type DeepReadonlyArray<T> = readonly DeepReadonly<T>[]

type DeepReadonlyObject<T> = {
  readonly [K in keyof T]: DeepReadonly<T[K]>
}

// 使用
interface Nested {
  a: {
    b: {
      c: number
    }
  }
  arr: number[]
}

type ReadonlyNested = DeepReadonly<Nested>
// {
//   readonly a: {
//     readonly b: {
//       readonly c: number;
//     };
//   };
//   readonly arr: readonly number[];
// }
```

### 7.2. 类型级函数

```ts
// ✅ Curry 类型
type Curry<P extends any[], R> = P extends [infer First, ...infer Rest]
  ? (arg: First) => Rest extends [] ? R : Curry<Rest, R>
  : R

// 示例
type Add = (a: number, b: number, c: number) => number
type CurriedAdd = Curry<Parameters<Add>, ReturnType<Add>>
// (arg: number) => (arg: number) => (arg: number) => number

// ✅ Pipe 类型
type Pipe<Fns extends Function[], Acc = never> = Fns extends [
  infer First,
  ...infer Rest,
]
  ? First extends (arg: infer A) => infer B
    ? Rest extends Function[]
      ? Pipe<Rest, [Acc] extends [never] ? (arg: A) => B : (arg: A) => any>
      : never
    : never
  : Acc

// 使用
type Fn1 = (x: number) => string
type Fn2 = (x: string) => boolean
type Fn3 = (x: boolean) => number

type Composed = Pipe<[Fn1, Fn2, Fn3]>
// (arg: number) => number
```

### 7.3. 类型级计算

```ts
// ✅ 类型级加法
type Length<T extends any[]> = T['length']

type Push<T extends any[], V> = [...T, V]

type Add<A extends any[], B extends any[]> = [...A, ...B]

// 使用
type Three = [1, 2, 3]
type Two = [1, 2]

type Five = Add<Three, Two> // [1, 2, 3, 1, 2]
type FiveLength = Length<Five> // 5

// ✅ 类型级比较
type IsEqual<A, B> = A extends B ? (B extends A ? true : false) : false

type Test1 = IsEqual<number, number> // true
type Test2 = IsEqual<number, string> // false
```

## 8. 引用

- [Advanced Types][1]
- [Branded Types][2]
- [Type-Level Programming][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/types-from-types.html
[2]: https://egghead.io/blog/using-branded-types-in-typescript
[3]: https://github.com/type-challenges/type-challenges
