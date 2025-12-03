# [0214. ReturnType](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0214.%20ReturnType)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 `ReturnType<T>` 是什么？](#3--returntypet-是什么)
  - [3.1. 源码定义](#31-源码定义)
  - [3.2. infer 关键字](#32-infer-关键字)
  - [3.3. 工作原理](#33-工作原理)
  - [3.4. 基本示例](#34-基本示例)
- [4. 🤔 如何使用 `ReturnType<T>`？](#4--如何使用-returntypet)
  - [4.1. 场景 1：从函数推导类型](#41-场景-1从函数推导类型)
  - [4.2. 场景 2：高阶函数类型推导](#42-场景-2高阶函数类型推导)
  - [4.3. 场景 3：工厂函数类型](#43-场景-3工厂函数类型)
  - [4.4. 场景 4：异步函数返回值](#44-场景-4异步函数返回值)
- [5. 🤔 `ReturnType<T>` 的实际应用场景有哪些？](#5--returntypet-的实际应用场景有哪些)
  - [5.1. 应用 1：Redux Action Creator](#51-应用-1redux-action-creator)
  - [5.2. 应用 2：API 客户端类型推导](#52-应用-2api-客户端类型推导)
  - [5.3. 应用 3：数据处理管道](#53-应用-3数据处理管道)
  - [5.4. 应用 4：React Hooks 返回类型](#54-应用-4react-hooks-返回类型)
  - [5.5. 应用 5：数据库查询构建器](#55-应用-5数据库查询构建器)
- [6. 🤔 使用 `ReturnType<T>` 需要注意什么？](#6--使用-returntypet-需要注意什么)
  - [6.1. 注意事项 1：泛型函数的返回类型](#61-注意事项-1泛型函数的返回类型)
  - [6.2. 注意事项 2：重载函数](#62-注意事项-2重载函数)
  - [6.3. 注意事项 3：void 返回类型](#63-注意事项-3void-返回类型)
  - [6.4. 注意事项 4：never 返回类型](#64-注意事项-4never-返回类型)
  - [6.5. 注意事项 5：异步函数](#65-注意事项-5异步函数)
  - [6.6. 注意事项 6：条件类型中的使用](#66-注意事项-6条件类型中的使用)
  - [6.7. 注意事项 7：构造函数](#67-注意事项-7构造函数)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- `ReturnType<T>` 的定义和实现原理
- `infer` 关键字的使用
- 基本使用方法
- 实际应用场景
- 使用注意事项

## 2. 🫧 评价

`ReturnType<T>` 提取函数类型 `T` 的返回值类型。

## 3. 🤔 `ReturnType<T>` 是什么？

`ReturnType<T>` 从函数类型 `T` 中提取返回值的类型。

- 基于条件类型和 `infer` 关键字实现
- 适用于任何函数类型
- 常用于类型推导和函数组合
- 与泛型配合使用非常灵活
- 是函数类型元编程的基础工具

### 3.1. 源码定义

```ts
type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any
```

### 3.2. infer 关键字

```ts
// infer 用于在条件类型中声明类型变量
// R 是推断出的返回类型

type GetReturn<T> = T extends (...args: any) => infer R ? R : never

// 示例
type Func = () => string
type Return = GetReturn<Func> // string
```

### 3.3. 工作原理

```ts
function getUser(): { id: number; name: string } {
  return { id: 1, name: 'Alice' }
}

// ReturnType 的推导过程
type UserReturn = ReturnType<typeof getUser>

// 展开：
// typeof getUser = () => { id: number; name: string }
// (...args: any) => infer R 匹配
// R = { id: number; name: string }

// 结果：{ id: number; name: string }
```

### 3.4. 基本示例

```ts
// 普通函数
function add(a: number, b: number): number {
  return a + b
}
type AddReturn = ReturnType<typeof add> // number

// 箭头函数
const multiply = (a: number, b: number): number => a * b
type MultiplyReturn = ReturnType<typeof multiply> // number

// 返回对象
function createUser() {
  return {
    id: 1,
    name: 'Alice',
    email: 'alice@example.com',
  }
}
type User = ReturnType<typeof createUser>
// { id: number; name: string; email: string; }

// 返回 Promise
async function fetchData(): Promise<string> {
  return 'data'
}
type FetchReturn = ReturnType<typeof fetchData> // Promise<string>
```

## 4. 🤔 如何使用 `ReturnType<T>`？

### 4.1. 场景 1：从函数推导类型

```ts
// API 响应函数
function getUsers() {
  return [
    { id: 1, name: 'Alice', role: 'admin' as const },
    { id: 2, name: 'Bob', role: 'user' as const },
  ]
}

// 从函数返回值推导类型
type Users = ReturnType<typeof getUsers>
// Array<{ id: number; name: string; role: 'admin' | 'user' }>

type User = Users[number]
// { id: number; name: string; role: 'admin' | 'user' }

// 使用推导的类型
function displayUser(user: User): void {
  console.log(`${user.name} (${user.role})`)
}
```

### 4.2. 场景 2：高阶函数类型推导

```ts
function createLogger(prefix: string) {
  return {
    log: (message: string) => console.log(`[${prefix}] ${message}`),
    error: (message: string) => console.error(`[${prefix}] ${message}`),
    warn: (message: string) => console.warn(`[${prefix}] ${message}`),
  }
}

// 推导 logger 的类型
type Logger = ReturnType<typeof createLogger>
// {
//   log: (message: string) => void;
//   error: (message: string) => void;
//   warn: (message: string) => void;
// }

function useLogger(logger: Logger): void {
  logger.log('Hello')
  logger.error('Error occurred')
}

const logger = createLogger('APP')
useLogger(logger)
```

### 4.3. 场景 3：工厂函数类型

```ts
class UserService {
  getUser(id: number) {
    return {
      id,
      name: 'User',
      permissions: ['read', 'write'] as const,
    }
  }

  getUsers() {
    return [this.getUser(1), this.getUser(2)]
  }
}

const service = new UserService()

// 从方法推导类型
type User = ReturnType<typeof service.getUser>
// { id: number; name: string; permissions: readonly ['read', 'write'] }

type Users = ReturnType<typeof service.getUsers>
// User[]

// 使用类型
function processUser(user: User): void {
  console.log(user.permissions) // readonly ['read', 'write']
}
```

### 4.4. 场景 4：异步函数返回值

```ts
async function fetchUser(id: number) {
  const response = await fetch(`/api/users/${id}`)
  return response.json() as {
    id: number
    name: string
    email: string
  }
}

// ReturnType 返回 Promise 类型
type FetchUserReturn = ReturnType<typeof fetchUser>
// Promise<{ id: number; name: string; email: string; }>

// 提取 Promise 内部类型需要 Awaited
type User = Awaited<ReturnType<typeof fetchUser>>
// { id: number; name: string; email: string; }

async function processUser(): Promise<void> {
  const user: User = await fetchUser(1)
  console.log(user.name)
}
```

## 5. 🤔 `ReturnType<T>` 的实际应用场景有哪些？

### 5.1. 应用 1：Redux Action Creator

```ts
// Action creators
const userActions = {
  login: (username: string, password: string) => ({
    type: 'USER_LOGIN' as const,
    payload: { username, password },
  }),

  logout: () => ({
    type: 'USER_LOGOUT' as const,
  }),

  updateProfile: (data: { name: string; email: string }) => ({
    type: 'USER_UPDATE_PROFILE' as const,
    payload: data,
  }),
}

// 从 action creators 推导 action 类型
type UserAction =
  | ReturnType<typeof userActions.login>
  | ReturnType<typeof userActions.logout>
  | ReturnType<typeof userActions.updateProfile>

// UserAction =
// | { type: 'USER_LOGIN'; payload: { username: string; password: string } }
// | { type: 'USER_LOGOUT' }
// | { type: 'USER_UPDATE_PROFILE'; payload: { name: string; email: string } }

function userReducer(state: any, action: UserAction): any {
  switch (action.type) {
    case 'USER_LOGIN':
      return { ...state, user: action.payload }
    case 'USER_LOGOUT':
      return { ...state, user: null }
    case 'USER_UPDATE_PROFILE':
      return { ...state, user: { ...state.user, ...action.payload } }
    default:
      return state
  }
}
```

### 5.2. 应用 2：API 客户端类型推导

```ts
class ApiClient {
  async get<T>(url: string): Promise<{ data: T; status: number }> {
    const response = await fetch(url)
    return {
      data: await response.json(),
      status: response.status,
    }
  }

  async post<T>(url: string, body: any): Promise<{ data: T; status: number }> {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
    })
    return {
      data: await response.json(),
      status: response.status,
    }
  }
}

const api = new ApiClient()

// 推导 API 响应类型
type GetResponse<T> = Awaited<ReturnType<typeof api.get<T>>>
// { data: T; status: number; }

type PostResponse<T> = Awaited<ReturnType<typeof api.post<T>>>
// { data: T; status: number; }

// 使用
async function fetchUser(id: number): Promise<void> {
  const response: GetResponse<{ id: number; name: string }> = await api.get(
    `/users/${id}`
  )
  console.log(response.data.name)
}
```

### 5.3. 应用 3：数据处理管道

```ts
// 处理函数
const pipeline = {
  parse: (raw: string) => JSON.parse(raw),

  validate: (data: any) => {
    if (!data.id || !data.name) {
      throw new Error('Invalid data')
    }
    return { id: data.id as number, name: data.name as string }
  },

  transform: (user: { id: number; name: string }) => ({
    ...user,
    displayName: user.name.toUpperCase(),
    createdAt: new Date(),
  }),
}

// 推导每个阶段的类型
type ParseResult = ReturnType<typeof pipeline.parse> // any
type ValidateResult = ReturnType<typeof pipeline.validate> // { id: number; name: string }
type TransformResult = ReturnType<typeof pipeline.transform>
// { id: number; name: string; displayName: string; createdAt: Date }

// 类型安全的管道执行
function processPipeline(raw: string): TransformResult {
  const parsed = pipeline.parse(raw)
  const validated = pipeline.validate(parsed)
  const transformed = pipeline.transform(validated)
  return transformed
}
```

### 5.4. 应用 4：React Hooks 返回类型

```ts
function useUser(id: number) {
  const [user, setUser] = React.useState<{ id: number; name: string } | null>(
    null
  )
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    fetchUser(id)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [id])

  return {
    user,
    loading,
    error,
    refetch: () => fetchUser(id).then(setUser),
  }
}

// 推导 Hook 返回类型
type UseUserReturn = ReturnType<typeof useUser>
// {
//   user: { id: number; name: string } | null;
//   loading: boolean;
//   error: Error | null;
//   refetch: () => Promise<void>;
// }

function UserProfile({ userId }: { userId: number }): JSX.Element {
  const { user, loading, error, refetch }: UseUserReturn = useUser(userId)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!user) return <div>User not found</div>

  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={refetch}>Refresh</button>
    </div>
  )
}

declare function fetchUser(id: number): Promise<{ id: number; name: string }>
declare const React: any
```

### 5.5. 应用 5：数据库查询构建器

```ts
class QueryBuilder<T> {
  where(condition: string) {
    return {
      orderBy: (field: keyof T) => ({
        limit: (count: number) => ({
          execute: async () => [] as T[],
        }),
      }),
    }
  }
}

const userQuery = new QueryBuilder<{
  id: number
  name: string
  email: string
}>()

// 推导查询链的返回类型
type WhereReturn = ReturnType<typeof userQuery.where>
// { orderBy: (field: string) => ... }

type QueryChain = ReturnType<
  ReturnType<ReturnType<typeof userQuery.where>['orderBy']>['limit']
>
// { execute: () => Promise<T[]> }

type ExecuteReturn = ReturnType<QueryChain['execute']>
// Promise<Array<{ id: number; name: string; email: string }>>

// 使用
async function findUsers(): Promise<void> {
  const users: Awaited<ExecuteReturn> = await userQuery
    .where('age > 18')
    .orderBy('name')
    .limit(10)
    .execute()

  users.forEach((user) => console.log(user.name))
}
```

## 6. 🤔 使用 `ReturnType<T>` 需要注意什么？

### 6.1. 注意事项 1：泛型函数的返回类型

```ts
function identity<T>(value: T): T {
  return value
}

// ⚠️ ReturnType 会丢失泛型信息
type IdentityReturn = ReturnType<typeof identity>
// unknown (因为 T 未指定)

// ✅ 需要明确指定泛型参数
type IdentityStringReturn = ReturnType<typeof identity<string>>
// string (错误：typeof 不接受泛型参数)

// ✅ 正确方式：使用类型别名
type Identity = typeof identity
type IdentityReturn2 = ReturnType<Identity> // unknown
```

### 6.2. 注意事项 2：重载函数

```ts
function process(value: string): string
function process(value: number): number
function process(value: string | number): string | number {
  return value
}

// ⚠️ ReturnType 只提取最后一个签名的返回类型
type ProcessReturn = ReturnType<typeof process>
// string | number (实现签名)

// 如果需要特定重载的返回类型，需要类型断言
type ProcessStringReturn = ReturnType<(value: string) => string> // string
```

### 6.3. 注意事项 3：void 返回类型

```ts
function log(message: string): void {
  console.log(message)
}

// void 类型被保留
type LogReturn = ReturnType<typeof log> // void

// ⚠️ void 不是 undefined
const result: LogReturn = undefined // ✅ 可以
const result2: LogReturn = log('test') // ✅ 可以
```

### 6.4. 注意事项 4：never 返回类型

```ts
function throwError(): never {
  throw new Error('Error')
}

// never 类型被保留
type ThrowReturn = ReturnType<typeof throwError> // never

// ⚠️ never 类型的函数永不返回
const result: ThrowReturn = throwError() // 永不执行到这里
```

### 6.5. 注意事项 5：异步函数

```ts
async function fetchData(): Promise<string> {
  return 'data'
}

// ReturnType 返回 Promise 类型
type FetchReturn = ReturnType<typeof fetchData> // Promise<string>

// ⚠️ 需要 Awaited 提取 Promise 内部类型
type UnwrappedReturn = Awaited<ReturnType<typeof fetchData>> // string

// 或使用类型推导
async function useData(): Promise<void> {
  const data: Awaited<FetchReturn> = await fetchData()
  console.log(data.toUpperCase())
}
```

### 6.6. 注意事项 6：条件类型中的使用

```ts
// ✅ ReturnType 可以在条件类型中使用
type IsVoidFunction<T> = T extends (...args: any) => any
  ? ReturnType<T> extends void
    ? true
    : false
  : false

type Check1 = IsVoidFunction<() => void> // true
type Check2 = IsVoidFunction<() => string> // false
```

### 6.7. 注意事项 7：构造函数

```ts
class User {
  constructor(public name: string) {}
}

// ❌ ReturnType 不适用于构造函数
type UserReturn = ReturnType<typeof User> // 错误

// ✅ 使用 InstanceType
type UserInstance = InstanceType<typeof User> // User
```

## 7. 🔗 引用

- [TypeScript Utility Types - ReturnType][1]
- [TypeScript Handbook - Conditional Types][2]
- [TypeScript Handbook - Infer Keyword][3]

[1]: https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype
[2]: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
[3]: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types
