# [0220. Awaited](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0220.%20Awaited)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. `Awaited<T>` 的源码实现是什么？](#3-awaitedt-的源码实现是什么)
- [4. 如何使用 `Awaited<T>` 解包 Promise 类型？](#4-如何使用-awaitedt-解包-promise-类型)
- [5. `Awaited<T>` 在异步编程中如何应用？](#5-awaitedt-在异步编程中如何应用)
- [6. `Awaited<T>` 如何处理嵌套 Promise？](#6-awaitedt-如何处理嵌套-promise)
- [7. 使用 `Awaited<T>` 时需要注意哪些问题？](#7-使用-awaitedt-时需要注意哪些问题)
- [8. 引用](#8-引用)

<!-- endregion:toc -->

## 1. 本节内容

- `Awaited<T>` 的源码实现
- `Promise` 类型的递归解包
- 异步函数返回值的类型推断
- `Promise.all` 和 `Promise.race` 的类型处理
- `thenable` 对象的支持

## 2. 评价

`Awaited<T>` 是 TypeScript 4.5 引入的工具类型，用于递归解包 `Promise` 类型，模拟 `await` 关键字的类型行为。

- 在处理异步函数返回值时非常有用
- 可以递归解包嵌套的 `Promise` 类型
- 支持 `thenable` 对象（实现了 `then` 方法的对象）
- 与 `ReturnType<T>` 配合可以获取异步函数的实际返回值类型
- 在 `Promise.all`、`Promise.race` 等场景中自动应用

## 3. `Awaited<T>` 的源码实现是什么？

`Awaited<T>` 的源码定义如下：

```ts
type Awaited<T> = T extends null | undefined
  ? T
  : T extends object & { then(onfulfilled: infer F, ...args: infer _): any }
    ? F extends (value: infer V, ...args: infer _) => any
      ? Awaited<V>
      : never
    : T
```

实现原理：

1. 基础类型检查：如果 `T` 是 `null` 或 `undefined`，直接返回 `T`
2. `thenable` 检测：检查 `T` 是否是对象且有 `then` 方法
3. 提取 `onfulfilled` 参数：使用 `infer F` 捕获 `then` 的第一个参数类型
4. 提取成功值类型：从 `onfulfilled` 函数的参数中提取值类型 `V`
5. 递归解包：递归调用 `Awaited<V>` 处理嵌套的 `Promise`
6. 兜底返回：如果不匹配上述情况，返回 `T` 本身

```ts
// 基本使用
type PromiseString = Promise<string>
type UnwrappedString = Awaited<PromiseString>
// string

// 嵌套 Promise
type NestedPromise = Promise<Promise<number>>
type UnwrappedNested = Awaited<NestedPromise>
// number

// 非 Promise 类型
type NotPromise = string
type StillString = Awaited<NotPromise>
// string，直接返回原类型

// null 和 undefined
type NullType = Awaited<null>
// null

type UndefinedType = Awaited<undefined>
// undefined
```

工作流程示例：

```ts
// 示例 1：单层 Promise
type Step1 = Promise<string>
type Result1 = Awaited<Step1>
// 1. Step1 是 Promise<string>
// 2. 匹配 thenable 模式
// 3. 提取 onfulfilled: (value: string) => any
// 4. 提取 V = string
// 5. Awaited<string> = string

// 示例 2：双层 Promise
type Step2 = Promise<Promise<number>>
type Result2 = Awaited<Step2>
// 1. Step2 是 Promise<Promise<number>>
// 2. 匹配 thenable 模式
// 3. 提取 onfulfilled: (value: Promise<number>) => any
// 4. 提取 V = Promise<number>
// 5. 递归: Awaited<Promise<number>>
//    5.1. 匹配 thenable 模式
//    5.2. 提取 V = number
//    5.3. Awaited<number> = number
// 6. 最终结果 = number

// 示例 3：thenable 对象
interface CustomThenable {
  then(
    onfulfilled: (value: boolean) => void,
    onrejected?: (reason: any) => void,
  ): void
}

type ThenableResult = Awaited<CustomThenable>
// boolean
```

与 ReturnType 配合使用：

```ts
// 异步函数
async function fetchUser(): Promise<{ id: number; name: string }> {
  return { id: 1, name: 'Alice' }
}

// 提取返回值类型（包含 Promise）
type FetchUserReturn = ReturnType<typeof fetchUser>
// Promise<{ id: number; name: string }>

// 解包 Promise，获取实际值类型
type User = Awaited<FetchUserReturn>
// { id: number; name: string }

// 或者一步到位
type UserDirect = Awaited<ReturnType<typeof fetchUser>>
// { id: number; name: string }

// 嵌套异步函数
async function getNestedData(): Promise<Promise<string>> {
  return Promise.resolve('data')
}

type NestedData = Awaited<ReturnType<typeof getNestedData>>
// string，自动解包多层 Promise
```

## 4. 如何使用 `Awaited<T>` 解包 Promise 类型？

在处理异步操作和 `Promise` 类型时，`Awaited<T>` 提供了类型安全的解包：

```ts
// 场景 1：API 响应类型
interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

async function fetchData(): Promise<ApiResponse<{ users: string[] }>> {
  return {
    data: { users: ['Alice', 'Bob'] },
    status: 200,
    message: 'Success',
  }
}

// 提取响应数据类型
type ResponseType = Awaited<ReturnType<typeof fetchData>>
// ApiResponse<{ users: string[] }>

type DataType = ResponseType['data']
// { users: string[] }

// 场景 2：Promise 工厂函数
function createPromise<T>(value: T): Promise<T> {
  return Promise.resolve(value)
}

type NumberPromise = ReturnType<typeof createPromise<number>>
// Promise<number>

type UnwrappedNumber = Awaited<NumberPromise>
// number

// 场景 3：条件类型中的使用
type UnwrapPromise<T> = T extends Promise<any> ? Awaited<T> : T

type Test1 = UnwrapPromise<Promise<string>>
// string

type Test2 = UnwrapPromise<number>
// number

type Test3 = UnwrapPromise<Promise<Promise<boolean>>>
// boolean

// 场景 4：联合类型的解包
type MixedPromises = Promise<string> | Promise<number> | boolean
type UnwrappedMixed = Awaited<MixedPromises>
// string | number | boolean

// 场景 5：数组元素的解包
type PromiseArray = Array<Promise<number>>
type ElementType = Awaited<PromiseArray[number]>
// number

// 映射数组中的每个 Promise
type UnwrapArray<T extends any[]> = {
  [K in keyof T]: Awaited<T[K]>
}

type PromiseTuple = [Promise<string>, Promise<number>, Promise<boolean>]
type UnwrappedTuple = UnwrapArray<PromiseTuple>
// [string, number, boolean]
```

## 5. `Awaited<T>` 在异步编程中如何应用？

在实际异步编程场景中，`Awaited<T>` 确保类型安全：

```ts
// 应用 1：Promise.all 类型推断
async function fetchUserAndPosts() {
  const [user, posts] = await Promise.all([
    fetch('/api/user').then((r) => r.json()),
    fetch('/api/posts').then((r) => r.json()),
  ])

  return { user, posts }
}

type FetchResult = Awaited<ReturnType<typeof fetchUserAndPosts>>
// { user: any; posts: any }

// 改进：显式类型标注
interface User {
  id: number
  name: string
}

interface Post {
  id: number
  title: string
  content: string
}

async function fetchUserAndPostsTyped(): Promise<{
  user: User
  posts: Post[]
}> {
  const [user, posts] = await Promise.all([
    fetch('/api/user').then((r) => r.json() as User),
    fetch('/api/posts').then((r) => r.json() as Post[]),
  ])

  return { user, posts }
}

type TypedResult = Awaited<ReturnType<typeof fetchUserAndPostsTyped>>
// { user: User; posts: Post[] }

// 应用 2：Promise.race 类型处理
async function raceRequests() {
  return Promise.race([
    fetch('/api/fast').then(() => 'fast'),
    fetch('/api/slow').then(() => 'slow'),
    new Promise<'timeout'>((_, reject) =>
      setTimeout(() => reject('timeout'), 5000),
    ),
  ])
}

type RaceResult = Awaited<ReturnType<typeof raceRequests>>
// "fast" | "slow" | "timeout"

// 应用 3：异步生成器
async function* asyncGenerator() {
  yield Promise.resolve(1)
  yield Promise.resolve(2)
  yield Promise.resolve(3)
}

type GeneratorType = ReturnType<typeof asyncGenerator>
// AsyncGenerator<Promise<number>, void, unknown>

type YieldedType = Awaited<
  Awaited<GeneratorType> extends AsyncGenerator<infer T> ? T : never
>
// 复杂，建议直接使用类型标注

// 应用 4：缓存装饰器
function memoizeAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  const cache = new Map<string, Awaited<ReturnType<T>>>()

  return async (...args: Parameters<T>) => {
    const key = JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = await fn(...args)
    cache.set(key, result)
    return result
  }
}

async function expensiveOperation(x: number): Promise<number> {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return x * x
}

const memoized = memoizeAsync(expensiveOperation)
// memoized: (x: number) => Promise<number>

// 应用 5：重试逻辑
async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
): Promise<Awaited<T>> {
  let lastError: Error

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)))
    }
  }

  throw lastError!
}

async function unreliableApi(): Promise<{ data: string }> {
  if (Math.random() > 0.5) {
    throw new Error('API Error')
  }
  return { data: 'success' }
}

const result = await retry(unreliableApi)
// result: { data: string }

// 应用 6：并发控制
async function mapAsync<T, R>(
  items: T[],
  mapper: (item: T) => Promise<R>,
  concurrency: number = 5,
): Promise<Awaited<R>[]> {
  const results: Awaited<R>[] = []
  const executing: Promise<void>[] = []

  for (const item of items) {
    const promise = mapper(item).then((result) => {
      results.push(result)
    })

    executing.push(promise)

    if (executing.length >= concurrency) {
      await Promise.race(executing)
      executing.splice(
        executing.findIndex((p) => p === promise),
        1,
      )
    }
  }

  await Promise.all(executing)
  return results
}

const numbers = [1, 2, 3, 4, 5]
const squared = await mapAsync(numbers, async (n) => n * n)
// squared: number[]
```

## 6. `Awaited<T>` 如何处理嵌套 Promise？

`Awaited<T>` 的递归特性使其能够处理任意深度的 `Promise` 嵌套：

```ts
// 基本嵌套
type Level1 = Promise<number>
type Unwrap1 = Awaited<Level1>
// number

type Level2 = Promise<Promise<number>>
type Unwrap2 = Awaited<Level2>
// number

type Level3 = Promise<Promise<Promise<number>>>
type Unwrap3 = Awaited<Level3>
// number

// 深层嵌套示例
async function deeplyNested(): Promise<Promise<Promise<{ value: string }>>> {
  return Promise.resolve(Promise.resolve(Promise.resolve({ value: 'deep' })))
}

type DeepResult = Awaited<ReturnType<typeof deeplyNested>>
// { value: string }

// 混合嵌套
type MixedNested = Promise<{
  user: Promise<{ id: number }>
  posts: Promise<Array<Promise<{ title: string }>>>
}>

// 第一层解包
type FirstLevel = Awaited<MixedNested>
// {
//   user: Promise<{ id: number }>;
//   posts: Promise<Array<Promise<{ title: string }>>>;
// }

// 需要递归处理每个属性
type DeepUnwrap<T> =
  T extends Promise<infer U>
    ? DeepUnwrap<U>
    : T extends object
      ? { [K in keyof T]: DeepUnwrap<T[K]> }
      : T

type FullyUnwrapped = DeepUnwrap<MixedNested>
// {
//   user: { id: number };
//   posts: Array<{ title: string }>;
// }

// 实际应用：复杂 API 响应
interface NestedApiResponse {
  data: Promise<{
    user: {
      profile: Promise<{
        name: string
        avatar: string
      }>
    }
    settings: Promise<{
      theme: string
    }>
  }>
}

async function fetchComplexData(): Promise<NestedApiResponse> {
  return {
    data: Promise.resolve({
      user: {
        profile: Promise.resolve({
          name: 'Alice',
          avatar: 'avatar.jpg',
        }),
      },
      settings: Promise.resolve({
        theme: 'dark',
      }),
    }),
  }
}

// 逐层解包
type Step1 = Awaited<ReturnType<typeof fetchComplexData>>
// NestedApiResponse

type Step2 = Awaited<Step1['data']>
// {
//   user: {
//     profile: Promise<{ name: string; avatar: string }>;
//   };
//   settings: Promise<{ theme: string }>;
// }

// 完全展开的工具类型
type AwaitedDeep<T> =
  T extends Promise<infer U>
    ? AwaitedDeep<U>
    : T extends (...args: any[]) => Promise<infer U>
      ? AwaitedDeep<U>
      : T extends object
        ? { [K in keyof T]: AwaitedDeep<T[K]> }
        : T

type FullData = AwaitedDeep<ReturnType<typeof fetchComplexData>>
// {
//   data: {
//     user: {
//       profile: { name: string; avatar: string };
//     };
//     settings: { theme: string };
//   };
// }

// 辅助函数：深度 await
async function awaitDeep<T>(value: T): Promise<AwaitedDeep<T>> {
  if (value instanceof Promise) {
    return awaitDeep(await value) as any
  }

  if (value && typeof value === 'object') {
    const result: any = Array.isArray(value) ? [] : {}

    for (const key in value) {
      result[key] = await awaitDeep(value[key])
    }

    return result
  }

  return value as any
}

// 使用
const complexData = await fetchComplexData()
const fullyAwaited = await awaitDeep(complexData)
// fullyAwaited 的所有嵌套 Promise 都已解包
```

## 7. 使用 `Awaited<T>` 时需要注意哪些问题？

在使用 `Awaited<T>` 时，有以下几点需要注意：

```ts
// 注意 1：只在 TypeScript 4.5+ 可用
// 低版本需要自己实现或使用 polyfill
type CustomAwaited<T> = T extends Promise<infer U> ? CustomAwaited<U> : T;

// 注意 2：非 Promise 类型直接返回
type NotPromise = Awaited<number>;
// number

type ObjectType = Awaited<{ value: string }>;
// { value: string }

// 注意 3：thenable 对象也会被解包
interface CustomThenable {
  then(onfulfilled: (value: number) => void): void;
}

type ThenableValue = Awaited<CustomThenable>;
// number

// ⚠️ 但自定义 thenable 可能不被所有环境支持
const customTh: CustomThenable = {
  then(onfulfilled) {
    onfulfilled(42);
  }
};

// 注意 4：联合类型的处理
type UnionPromises = Promise<string> | Promise<number>;
type UnionResult = Awaited<UnionPromises>;
// string | number

// ⚠️ 混合 Promise 和非 Promise
type MixedUnion = Promise<string> | number;
type MixedResult = Awaited<MixedUnion>;
// string | number

// 注意 5：void 和 undefined
type VoidPromise = Promise<void>;
type VoidResult = Awaited<VoidPromise>;
// void

type UndefinedPromise = Promise<undefined>;
type UndefinedResult = Awaited<UndefinedPromise>;
// undefined

// 注意 6：never 类型
type NeverPromise = Promise<never>;
type NeverResult = Awaited<NeverPromise>;
// never

// ⚠️ Promise.reject 的类型
async function alwaysRejects(): Promise<never> {
  throw new Error('Always fails');
}

type RejectResult = Awaited<ReturnType<typeof alwaysRejects>>;
// never

// 注意 7：递归深度限制
// TypeScript 有递归深度限制，极深的嵌套可能导致错误
type VeryDeep = Promise<Promise<Promise<Promise<Promise<
  Promise<Promise<Promise<Promise<Promise<
    Promise<Promise<Promise<Promise<Promise<
      Promise<Promise<Promise<Promise<Promise<
        number
      >>>>>>>>>>>>>>>>>>>>>;

// ⚠️ 可能导致编译器错误："Type instantiation is excessively deep"
// type Result = Awaited<VeryDeep>;
```

常见陷阱和解决方案：

```ts
// 陷阱 1：泛型约束丢失
function processAsync<T extends string>(
  value: Promise<T>,
): Awaited<Promise<T>> {
  return value as any
}

// ⚠️ T 的约束信息可能丢失
type Result = ReturnType<typeof processAsync<'literal'>>
// string，而不是 'literal'

// ✅ 解决方案：保持泛型
function processAsyncBetter<T extends string>(value: Promise<T>): Promise<T> {
  return value
}

// 陷阱 2：条件类型中的使用
type ExtractPromise<T> = T extends Promise<any> ? Awaited<T> : never

type Test1 = ExtractPromise<Promise<number>>
// number ✅

type Test2 = ExtractPromise<number>
// never ✅

// ⚠️ 但在分布式条件类型中可能不符合预期
type Test3 = ExtractPromise<Promise<number> | string>
// number，string 被过滤掉

// 陷阱 3：类型守卫不适用
async function getValue(): Promise<string | number> {
  return 'value'
}

const result = await getValue()

// ❌ Awaited 不是运行时类型守卫
if (typeof (result as Awaited<ReturnType<typeof getValue>>) === 'string') {
  // 类型断言不会影响运行时
}

// ✅ 正确的类型守卫
if (typeof result === 'string') {
  console.log(result.toUpperCase())
}

// 陷阱 4：与其他工具类型组合
type AsyncReturnType<T extends (...args: any) => any> = Awaited<ReturnType<T>>

async function getUser(): Promise<{ id: number }> {
  return { id: 1 }
}

type UserType = AsyncReturnType<typeof getUser>
// { id: number } ✅

// ⚠️ 非异步函数
function syncGetUser() {
  return { id: 1 }
}

type SyncUserType = AsyncReturnType<typeof syncGetUser>
// { id: number }，虽然不是 Promise 也能工作

// 陷阱 5：Promise 构造函数类型
type PromiseConstructorType = typeof Promise
type InstanceType = InstanceType<PromiseConstructorType>
// Promise<unknown>

// ❌ 无法直接解包构造函数
type WrongUnwrap = Awaited<PromiseConstructorType>
// typeof Promise，不会解包

// ✅ 需要先实例化
type CorrectUnwrap = Awaited<InstanceType<PromiseConstructorType>>
// unknown

// 陷阱 6：类型别名与 Awaited
type AsyncData<T> = Promise<{ data: T }>

// ⚠️ 使用别名时的解包
type UnwrappedAlias = Awaited<AsyncData<string>>
// { data: string } ✅

// 但嵌套别名可能复杂
type NestedAlias<T> = Promise<AsyncData<T>>
type UnwrappedNested = Awaited<NestedAlias<number>>
// { data: number } ✅，递归解包
```

## 8. 引用

- [TypeScript Handbook - Utility Types - Awaited][1]
- [TypeScript 4.5 Release Notes - Awaited Type][2]
- [Understanding Awaited Type in TypeScript][3]

[1]: https://www.typescriptlang.org/docs/handbook/utility-types.html#awaitedtype
[2]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html#the-awaited-type-and-promise-improvements
[3]: https://www.totaltypescript.com/concepts/awaited-type
