# [0100. 对象可选属性](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0100.%20%E5%AF%B9%E8%B1%A1%E5%8F%AF%E9%80%89%E5%B1%9E%E6%80%A7)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是可选属性？](#3--什么是可选属性)
- [4. 🤔 如何声明可选属性？](#4--如何声明可选属性)
- [5. 🤔 可选属性的类型是？](#5--可选属性的类型是)
- [6. 🤔 在访问可选属性之前，如何检查可选属性是否存在？](#6--在访问可选属性之前如何检查可选属性是否存在)
- [7. 🤔 可选属性如何设置默认值？](#7--可选属性如何设置默认值)
- [8. 🤔 如何让一个对象的所有属性变为可选？](#8--如何让一个对象的所有属性变为可选)
- [9. 🤔 如何让一个对象的所有属性变为必填？](#9--如何让一个对象的所有属性变为必填)
- [10. 🤔 如何自定义类型工具，实现指定字段可选的效果？](#10--如何自定义类型工具实现指定字段可选的效果)
- [11. 🆚 可选属性 vs undefined](#11--可选属性-vs-undefined)
- [12. 🤔 可选属性默认允许赋 undefined 值，如何通过配置规避该行为？](#12--可选属性默认允许赋-undefined-值如何通过配置规避该行为)
- [13. 🤔 在不使用类型守卫的情况下，如何安全访问可选属性？](#13--在不使用类型守卫的情况下如何安全访问可选属性)
- [14. 🤔 关于可选属性的一些实践建议都有哪些？](#14--关于可选属性的一些实践建议都有哪些)
- [15. 🔗 引用](#15--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 可选属性的定义和语法
- `?` 修饰符的使用
- Partial 工具类型
- Required 工具类型
- 可选属性与 undefined 的关系
- 可选链操作符
- `exactOptionalPropertyTypes` 配置

## 2. 🫧 评价

可选属性（Optional Property）使用 `?` 修饰符，表示对象的某个属性可以存在也可以不存在。

可选属性的特点：

- 灵活性：属性可有可无
- 类型安全：访问时需要检查是否存在
- 常见场景：配置对象、API 参数、部分更新

在 TypeScript 中，可选属性：

- 类型是 `T | undefined`
- 可以不提供该属性
- 访问时可能是 `undefined`
- 需要类型守卫或可选链

## 3. 🤔 什么是可选属性？

对象的可选属性需要使用 `?` 修饰符修饰，表示属性允许不存在。

- 可选标记：`?` 符号，表示可以不提供该属性
- 类型：`T | undefined`，访问可能返回 `undefined`，为了使用安全，在使用前需要校验类型

```ts
// 可选属性
interface User {
  name: string // 必需
  age?: number // 可选
  email?: string // 可选
}

// 可以不提供可选属性
const user1: User = {
  name: 'Alice',
  // age 和 email 可选
}

// 可以提供可选属性
const user2: User = {
  name: 'Bob',
  age: 25,
  email: 'bob@example.com',
}

// ❌ 必需属性不能省略
const user3: User = {
  age: 30,
}
// Property 'name' is missing in type '{ age: number; }' but required in type 'User'.(2741)
```

## 4. 🤔 如何声明可选属性？

只读属性可以声明在多个位置：

1. 在接口中的可选属性
2. 在类型别名中的可选属性
3. 在类中的可选属性
4. 在函数参数中的可选属性

::: code-group

```ts [1]
// 接口中使用 ?
interface Config {
  host: string
  port?: number
  timeout?: number
  ssl?: boolean
}

const config: Config = {
  host: 'localhost',
  // port, timeout, ssl 都是可选的
}
```

```ts [2]
// 类型别名中使用 ?
type User = {
  id: number
  name: string
  email?: string
  phone?: string
}

const user: User = {
  id: 1,
  name: 'Alice',
}
```

```ts [3]
// 类中的可选属性
class User {
  name: string
  age?: number
  email?: string

  constructor(name: string) {
    this.name = name
    // age 和 email 可以不初始化
  }
}

const user = new User('Alice')
console.log(user.age) // undefined
```

```ts [4]
// 函数参数对象的可选属性
function createUser(options: { name: string; age?: number; email?: string }) {
  return {
    name: options.name,
    age: options.age ?? 18,
    email: options.email ?? '',
  }
}

createUser({ name: 'Alice' }) // ✅
createUser({ name: 'Bob', age: 25 }) // ✅
createUser({ name: 'Charlie', age: 30, email: 'charlie@example.com' }) // ✅
```

:::

## 5. 🤔 可选属性的类型是？

相当于和 `undefined` 类型联合。

```ts
interface User {
  name: string
  age?: number
}

// age 的类型是 number | undefined
const user: User = { name: 'Alice' }

type AgeType = User['age'] // number | undefined
```

## 6. 🤔 在访问可选属性之前，如何检查可选属性是否存在？

```ts
interface Config {
  timeout?: number
}

const config: Config = {}

// ✅ 在访问可选属性之前，需要检查属性是否存在
if (config.timeout !== undefined) {
  const timeout = config.timeout
  // TS 类型推断结果：
  // const timeout: number
  // 类型收窄为 number 可以安全使用
  console.log(timeout.toFixed(2))
}

// ❌ 直接访问会报错
console.log(config.timeout.toFixed(2))
// 'config.timeout' is possibly 'undefined'.(18048)
```

## 7. 🤔 可选属性如何设置默认值？

做法很简单，是纯 JS 的思路，跟 TS 没关系。

只需要在访问可选属性之前，做一个检查，如果是 undefined，则使用默认值。

```ts
interface Options {
  port?: number
  timeout?: number
}

function connect(options: Options) {
  // 如果成员为空，就使用默认值
  const port = options.port ?? 3000
  const timeout = options.timeout ?? 5000

  console.log(`Connecting to port ${port} with timeout ${timeout}ms`)
}

connect({}) // port: 3000, timeout: 5000
connect({ port: 8080 }) // port: 8080, timeout: 5000
```

解构赋值的默认值写法：

```ts
interface Config {
  host?: string
  port?: number
}

function connect({ host = 'localhost', port = 3000 }: Config) {
  console.log(`${host}:${port}`)
}

connect({}) // localhost:3000
connect({ host: '192.168.1.1' }) // 192.168.1.1:3000
connect({ host: '127.0.0.1', port: 8080 }) // 127.0.0.1:8080
```

## 8. 🤔 如何让一个对象的所有属性变为可选？

使用 `Partial<T>` 类型工具，可以让一个对象的所有属性变为可选。

```ts
// Partial<T> 将所有属性变为可选
interface User {
  id: number
  name: string
  email: string
}

type PartialUser = Partial<User>
// TS 的类型推断结果：
// type PartialUser = {
//     id?: number | undefined;
//     name?: string | undefined;
//     email?: string | undefined;
// }

// 使用
const user: PartialUser = {
  name: 'Alice',
  // id 和 email 可选
}
```

`Partial<T>` 的实现原理：

```ts
type Partial<T> = { [P in keyof T]?: T[P] | undefined }
```

## 9. 🤔 如何让一个对象的所有属性变为必填？

使用 `Required<T>` 类型工具，可以让一个对象的所有属性变为必填。

```ts
// Required<T> 将所有可选属性变为必填
interface Config {
  host?: string
  port?: number
  timeout?: number
}

type RequiredConfig = Required<Config>
// TS 类型推断结果：
// type RequiredConfig = {
//     host: string;
//     port: number;
//     timeout: number;
// }

const config: RequiredConfig = {
  host: 'localhost',
  port: 3000,
  timeout: 5000,
  // 所有属性都必需
}
```

## 10. 🤔 如何自定义类型工具，实现指定字段可选的效果？

```ts
// 让指定属性可选
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

interface User {
  id: number
  name: string
  email: string
}

type UserWithOptionalEmail = PartialBy<User, 'email'>
// {
//   id: number
//   name: string
//   email?: string
// }

const u: UserWithOptionalEmail = {
  id: 123,
  name: 'foo',
  // email 可选
}
```

## 11. 🆚 可选属性 vs undefined

核心差异：

- 可选属性：属性可以不存在
- undefined 类型：属性必须存在，但值可以是 undefined

```ts
// 可选属性：属性可以不存在
interface A {
  prop?: string
}

const a1: A = {} // ✅ 允许不提供 prop
const a2: A = { prop: undefined } // ⚠️ 允许明确设置为 undefined
const a3: A = { prop: 'value' } // ✅ 允许提供值

// undefined 类型：属性必须存在，但值可以是 undefined
interface B {
  prop: string | undefined
}

const b1: B = {} // ❌ Error: Property 'prop' is missing
const b2: B = { prop: undefined } // ✅ 必须提供，但可以是 undefined
const b3: B = { prop: 'value' } // ✅
```

## 12. 🤔 可选属性默认允许赋 undefined 值，如何通过配置规避该行为？

开启 `exactOptionalPropertyTypes` 这个配置，TS 会对带有 `type` 或 `interfaces` 前缀的属性执行更严格的规则处理。

```ts
// tsconfig.json
// {
//   "compilerOptions": {
//     "exactOptionalPropertyTypes": true
//   }
// }

interface User {
  name: string
  age?: number
}

const user1: User = {
  name: 'Alice',
} // ✅

const user2: User = {
  name: 'Bob',
  age: undefined,
} // ❌
// 启用 exactOptionalPropertyTypes 后，不能显式设置为 undefined
// 报错：
// Type '{ name: string; age: undefined; }' is not assignable to type 'User' with 'exactOptionalPropertyTypes: true'. Consider adding 'undefined' to the types of the target's properties.
//   Types of property 'age' are incompatible.
//     Type 'undefined' is not assignable to type 'number'.(2375)
```

## 13. 🤔 在不使用类型守卫的情况下，如何安全访问可选属性？

可以使用可选链操作符 `?.` 的形式访问。

1. 可选成员访问
2. 可选方法调用
3. 可选索引访问

::: code-group

```ts [1]
interface User {
  name: string
  profile?: {
    age: number
    address?: {
      city: string
    }
  }
}

const user: User = {
  name: 'Alice',
}

// ✅ 使用可选链
const city1 = user.profile?.address?.city // string | undefined

// ❌ 不使用可选链会报错
const city2 = user.profile.address.city // Error: 'user.profile' is possibly 'undefined'
```

```ts [2]
interface Logger {
  log?: (message: string) => void
}

const logger: Logger = {}

// ✅ 可选方法调用
logger.log?.('Hello') // 如果 log 存在则调用

// ❌ 直接调用会报错
logger.log('Hello') // Error: Cannot invoke an object which is possibly 'undefined'
```

```ts [3]
interface Data {
  items?: string[]
}

const data: Data = {}

// ✅ 可选索引访问
const first1 = data.items?.[0] // string | undefined

// ❌ 直接访问会报错
const first2 = data.items[0] // Error: 'data.items' is possibly 'undefined'
```

:::

## 14. 🤔 关于可选属性的一些实践建议都有哪些？

```ts
// ✅ 1. 只让真正可选的属性可选
interface User {
  id: number // 必需
  name: string // 必需
  email: string // 必需
  phone?: string // 可选
  avatar?: string // 可选
}

// ✅ 2. 使用默认值处理可选属性
interface Config {
  port?: number
  timeout?: number
}

function createServer(config: Config) {
  const port = config.port ?? 3000
  const timeout = config.timeout ?? 5000
}

// ✅ 3. 使用解构的默认值
function connect({
  host = 'localhost',
  port = 3000,
}: {
  host?: string
  port?: number
}) {
  console.log(`${host}:${port}`)
}

// ✅ 4. 使用可选链访问嵌套可选属性
const city = user.profile?.address?.city

// ✅ 5. 为部分更新使用 Partial
function updateUser(id: number, updates: Partial<User>) {
  // 实现
}

// ✅ 6. 文档化可选属性的含义
interface Config {
  /** 服务器端口（默认：3000） */
  port?: number
  /** 超时时间（默认：5000ms） */
  timeout?: number
}

// ✅ 7. 使用类型守卫检查可选属性
if (user.email !== undefined) {
  sendEmail(user.email)
}

// ✅ 8. 避免显式设置为 undefined
const user: User = {
  name: 'Alice',
  email: undefined, // ⚠️ 不推荐
}

// 应该省略属性
const user: User = {
  name: 'Alice',
  // email 省略
}
// 可以开启 exactOptionalPropertyTypes 配置来禁止显式赋 undefined 的问题。

// ✅ 9. 使用 Required 确保所有属性存在
function validateConfig(config: Required<Config>) {
  // config 的所有属性都存在
}

// ✅ 10. 为可选属性提供类型安全的 getter
class User {
  name: string
  private _email?: string

  get email(): string {
    return this._email ?? ''
  }

  set email(value: string) {
    this._email = value || undefined
  }
}
```

## 15. 🔗 引用

- [TypeScript Handbook - Optional Properties][1]
- [TypeScript Handbook - Partial][2]
- [TypeScript Handbook - Optional Chaining][3]
- [TypeScript Handbook - TSConfig Reference - exactOptionalPropertyTypes][4]

[1]: https://www.typescriptlang.org/docs/handbook/2/objects.html#optional-properties
[2]: https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype
[3]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#optional-chaining
[4]: https://www.typescriptlang.org/tsconfig/#exactOptionalPropertyTypes
