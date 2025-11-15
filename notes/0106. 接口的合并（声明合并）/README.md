# [0106. 接口的合并（声明合并）](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0106.%20%E6%8E%A5%E5%8F%A3%E7%9A%84%E5%90%88%E5%B9%B6%EF%BC%88%E5%A3%B0%E6%98%8E%E5%90%88%E5%B9%B6%EF%BC%89)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是声明合并？](#3--什么是声明合并)
- [4. 🤔 接口合并的时候出现类型冲突怎么办？](#4--接口合并的时候出现类型冲突怎么办)
- [5. 🤔 索引签名接口可以合并吗？](#5--索引签名接口可以合并吗)
- [6. 🤔 泛型接口可以合并吗？](#6--泛型接口可以合并吗)
- [7. 🤔 函数重载合并](#7--函数重载合并)
  - [7.1. 方法重载](#71-方法重载)
  - [7.2. 重载顺序](#72-重载顺序)
  - [7.3. 构造函数重载](#73-构造函数重载)
- [8. 🤔 模块扩展](#8--模块扩展)
  - [8.1. 扩展模块导出](#81-扩展模块导出)
  - [8.2. 扩展第三方库](#82-扩展第三方库)
  - [8.3. 扩展命名空间](#83-扩展命名空间)
- [9. 🤔 全局扩展](#9--全局扩展)
  - [9.1. 扩展全局对象](#91-扩展全局对象)
  - [9.2. 扩展全局类型](#92-扩展全局类型)
  - [9.3. 扩展全局命名空间](#93-扩展全局命名空间)
- [10. 🤔 常见使用场景](#10--常见使用场景)
  - [10.1. 场景 1：组织大型接口](#101-场景-1组织大型接口)
  - [10.2. 场景 2：扩展 Express](#102-场景-2扩展-express)
  - [10.3. 场景 3：扩展 Vue](#103-场景-3扩展-vue)
  - [10.4. 场景 4：扩展 React Props](#104-场景-4扩展-react-props)
  - [10.5. 场景 5：扩展 Jest](#105-场景-5扩展-jest)
  - [10.6. 场景 6：环境变量类型](#106-场景-6环境变量类型)
  - [10.7. 场景 7：CSS Modules](#107-场景-7css-modules)
- [11. 🤔 常见错误和最佳实践](#11--常见错误和最佳实践)
  - [11.1. 错误 1：类型别名不支持合并](#111-错误-1类型别名不支持合并)
  - [11.2. 错误 2：属性类型冲突](#112-错误-2属性类型冲突)
  - [11.3. 错误 3：忘记 declare module](#113-错误-3忘记-declare-module)
  - [11.4. 错误 4：全局污染](#114-错误-4全局污染)
  - [11.5. 最佳实践](#115-最佳实践)
- [12. 🔗 引用](#12--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 声明合并的概念
- 接口合并的规则
- 属性和方法的合并
- 函数重载的合并
- 模块和命名空间扩展
- 全局类型扩展

## 2. 🫧 评价

声明合并（Declaration Merging）是 TypeScript 的一个独特特性，允许多个同名的声明自动合并为一个声明。

接口合并的特点：

- 自动合并：同名接口会自动合并
- 属性累加：所有属性都会被包含
- 方法重载：同名方法会形成重载
- 类型扩展：可以扩展第三方库的类型

声明合并最常见的用途：

1. 扩展第三方库：为库添加类型定义
2. 模块扩展：扩展模块的导出类型
3. 全局类型扩展：扩展全局对象
4. 代码组织：将大型接口拆分为多个部分

与类型别名的区别：

| 特性     | 接口      | 类型别名  |
| -------- | --------- | --------- |
| 声明合并 | ✅ 支持   | ❌ 不支持 |
| 扩展方式 | `extends` | `&`       |
| 重复声明 | 自动合并  | 报错      |

理解声明合并，能帮助你：

1. 正确扩展第三方库的类型
2. 理解接口和类型别名的区别
3. 组织大型类型定义
4. 解决类型定义冲突

声明合并是 TypeScript 类型系统的强大特性，是扩展现有类型的主要方式。

## 3. 🤔 什么是声明合并？

声明合并是指 TypeScript 编译器会将多个同名的声明合并为一个声明。

自动合并：

- 顺序无关：声明顺序不影响结果
- 累加属性：所有属性都被保留
- 接口专属：类型别名不支持

```ts
// 多个同名接口会自动合并
interface User {
  name: string
}

interface User {
  age: number
}

interface User {
  email: string
}

// 自动合并为
// interface User {
//   name: string
//   age: number
//   email: string
// }

const user: User = {
  name: 'Alice',
  age: 30,
  email: 'alice@example.com',
}
```

## 4. 🤔 接口合并的时候出现类型冲突怎么办？

如果同一个字段，类型不同，会直接报错。

```ts
interface Document {
  title: string
}

// ❌ 不同类型会报错
interface Document {
  title: number // ❌
}
// Subsequent property declarations must have the same type.
// Property 'title' must be of type 'string', but here has type 'number'.(2717)
```

注意：同字段的类型必须相同，即便是在类型兼容（为父子关系）的情况下，也是会报错的。

```ts
interface Document {
  title: string
}

interface Document {
  title: string | number // ❌
}
// Subsequent property declarations must have the same type.
// Property 'title' must be of type 'string', but here has type 'string | number'.(2717)
```

虽然类型兼容，但是 `string | number` 和 `string` 不是相同的类型，还是会报错。

可选属性也是同样的道理。

```ts
interface Document {
  title: string
}

interface Document {
  title?: string // ❌
  // 相当于：
  // title: string | undefined
}
// All declarations of 'title' must have identical modifiers.(2687)
// Subsequent property declarations must have the same type.
// Property 'title' must be of type 'string', but here has type 'string | undefined'.(2717)
```

## 5. 🤔 索引签名接口可以合并吗？

可以合并。

1. 索引签名可以跟普通接口合并
2. 索引签名可以跟索引签名合并

::: code-group

```ts [1]
// 索引签名
interface StringMap {
  [key: string]: string | number
}

// 普通接口
interface StringMap {
  count: number // 必须符合索引签名
}

// 合并后：
// interface StringMap {
//   [key: string]: string | number
//   count: number
// }

const map: StringMap = {
  count: 1, // 必填
  name: 'Alice', // 可选
  extra: 'data', // 可选
}
```

```ts [2]
// 索引签名 - 以 string 作为 key
interface TestMap {
  [key: string]: string | number
}

// 索引签名 - 以 number 作为 key
interface TestMap {
  [key: number]: string
}
// ⚠️ number 作为 key 的索引签名的类型必须是 string 作为 key 的索引签名的子级
// string 是 string | number 的子级

// 索引签名 - 以 symbol 作为 key
interface TestMap {
  [key: symbol]: 'foo'
}

// 合并后：
// interface TestMap {
//   [key: string]: string | number
//   [key: number]: string
//   [key: symbol]: "foo"
// }

const map: TestMap = {
  // key 是 string 类型，值可以是 string 或者 number
  name: 'Alice',
  age: 123,
  // key 是 number 类型，值要求必须是 string 类型
  [123]: 'bar',
  // key 是 symbol 类型，值只能是字面量类型 'foo'
  [Symbol.for('test')]: 'foo',
}
```

:::

## 6. 🤔 泛型接口可以合并吗？

可以合并。

```ts
interface Container<T> {
  value: T
}

interface Container<T> {
  getValue(): T
}

// 合并后：
// interface Container<T> {
//   value: T
//   getValue(): T
// }

const container: Container<number> = {
  value: 42,
  getValue() {
    return this.value
  },
}
```

## 7. 🤔 函数重载合并

### 7.1. 方法重载

```ts
// 函数签名会形成重载
interface Calculator {
  add(a: number, b: number): number
}

interface Calculator {
  add(a: string, b: string): string
}

interface Calculator {
  add(a: number[], b: number[]): number[]
}

// 合并后：
// interface Calculator {
//   add(a: number, b: number): number
//   add(a: string, b: string): string
//   add(a: number[], b: number[]): number[]
// }

// 先声明重载
function add(a: number, b: number): number
function add(a: string, b: string): string
function add(a: number[], b: number[]): number[]
function add(a: unknown, b: unknown) {
  if (typeof a === 'number' && typeof b === 'number') return a + b
  if (typeof a === 'string' && typeof b === 'string') return a + b
  if (Array.isArray(a) && Array.isArray(b)) return a.concat(b)
  throw new Error('Invalid arguments')
}

// 合并后形成重载
const calc: Calculator = {
  add,
}

const x1 = calc.add(1, 2) // const x1: number
const x2 = calc.add('a', 'b') // const x2: string
const x3 = calc.add([1], [2]) // const x3: number[]
```

### 7.2. 重载顺序

```ts
// ✅ 后声明的重载优先级更高
interface Processor {
  process(data: string): string
}

interface Processor {
  process(data: number): number // 优先匹配
}

// 实现时按照重载顺序
const processor: Processor = {
  process(data: any): any {
    if (typeof data === 'number') {
      return data * 2
    }
    return data.toUpperCase()
  },
}
```

### 7.3. 构造函数重载

```ts
// ✅ 构造函数也可以重载
interface DateConstructor {
  new (): Date
}

interface DateConstructor {
  new (value: number): Date
}

interface DateConstructor {
  new (value: string): Date
}
```

## 8. 🤔 模块扩展

### 8.1. 扩展模块导出

```ts
// ✅ 扩展已有模块
// types.ts
export interface User {
  id: number
  name: string
}

// extensions.ts
import { User } from './types'

declare module './types' {
  interface User {
    email: string
    age: number
  }
}

// 使用时 User 包含所有属性
import { User } from './types'

const user: User = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  age: 30,
}
```

### 8.2. 扩展第三方库

```ts
// ✅ 扩展 Express Request
import { Request } from 'express'

declare module 'express' {
  interface Request {
    user?: {
      id: number
      username: string
    }
  }
}

// 使用扩展后的类型
app.get('/profile', (req, res) => {
  if (req.user) {
    res.json({ username: req.user.username })
  }
})
```

### 8.3. 扩展命名空间

```ts
// ✅ 扩展命名空间
namespace MyLib {
  export interface Config {
    host: string
  }
}

namespace MyLib {
  export interface Config {
    port: number
  }
}

// Config 包含 host 和 port
const config: MyLib.Config = {
  host: 'localhost',
  port: 3000,
}
```

## 9. 🤔 全局扩展

### 9.1. 扩展全局对象

```ts
// ✅ 扩展 Window 对象
declare global {
  interface Window {
    myApp: {
      version: string
      config: Record<string, any>
    }
  }
}

// 使用
window.myApp = {
  version: '1.0.0',
  config: {},
}
```

### 9.2. 扩展全局类型

```ts
// ✅ 扩展 Array
declare global {
  interface Array<T> {
    first(): T | undefined
    last(): T | undefined
  }
}

// 实现
Array.prototype.first = function () {
  return this[0]
}

Array.prototype.last = function () {
  return this[this.length - 1]
}

// 使用
const arr = [1, 2, 3]
arr.first() // 1
arr.last() // 3
```

### 9.3. 扩展全局命名空间

```ts
// ✅ 扩展 NodeJS 命名空间
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string
      API_KEY: string
      NODE_ENV: 'development' | 'production' | 'test'
    }
  }
}

// 使用时有类型检查
const dbUrl = process.env.DATABASE_URL // string
const nodeEnv = process.env.NODE_ENV // 'development' | 'production' | 'test'
```

## 10. 🤔 常见使用场景

### 10.1. 场景 1：组织大型接口

```ts
// ✅ 将大型接口拆分为多个部分
// base.ts
interface User {
  id: number
  username: string
  email: string
}

// profile.ts
interface User {
  firstName: string
  lastName: string
  avatar: string
  bio: string
}

// settings.ts
interface User {
  theme: 'light' | 'dark'
  language: string
  notifications: boolean
}

// 自动合并为完整的 User 接口
```

### 10.2. 场景 2：扩展 Express

```ts
// ✅ 为 Express 添加自定义属性
import express from 'express'

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: number
      role: 'admin' | 'user'
    }
    requestId: string
  }

  interface Response {
    success(data: any): void
    error(message: string): void
  }
}

// 实现辅助方法
const app = express()

app.use((req, res, next) => {
  req.requestId = Math.random().toString(36)

  res.success = (data) => {
    res.json({ success: true, data })
  }

  res.error = (message) => {
    res.status(400).json({ success: false, error: message })
  }

  next()
})

// 使用
app.get('/api/user', (req, res) => {
  if (!req.user) {
    return res.error('Unauthorized')
  }
  res.success({ username: req.user.id })
})
```

### 10.3. 场景 3：扩展 Vue

```ts
// ✅ 扩展 Vue 组件实例
import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $api: {
      get(url: string): Promise<any>
      post(url: string, data: any): Promise<any>
    }
    $user: {
      id: number
      name: string
    } | null
  }
}

// 安装插件
Vue.prototype.$api = {
  get: async (url) => fetch(url).then((r) => r.json()),
  post: async (url, data) =>
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
    }).then((r) => r.json()),
}

// 在组件中使用
export default Vue.extend({
  mounted() {
    this.$api.get('/api/user').then((user) => {
      this.$user = user
    })
  },
})
```

### 10.4. 场景 4：扩展 React Props

```ts
// ✅ 为所有组件添加通用 props
import 'react'

declare module 'react' {
  interface HTMLAttributes<T> {
    // 为所有 HTML 元素添加 data-testid
    'data-testid'?: string
  }

  interface FunctionComponent<P = {}> {
    // 为函数组件添加 displayName
    displayName?: string
  }
}

// 使用
const Button: React.FC<{ text: string }> = ({ text, ...props }) => (
  <button data-testid="my-button" {...props}>
    {text}
  </button>
)

Button.displayName = 'Button'
```

### 10.5. 场景 5：扩展 Jest

```ts
// ✅ 添加自定义匹配器
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeWithinRange(min: number, max: number): R
    }
  }
}

// 实现匹配器
expect.extend({
  toBeWithinRange(received: number, min: number, max: number) {
    const pass = received >= min && received <= max
    return {
      pass,
      message: () => `expected ${received} to be within range ${min} - ${max}`,
    }
  },
})

// 使用
test('value is within range', () => {
  expect(10).toBeWithinRange(5, 15)
})
```

### 10.6. 场景 6：环境变量类型

```ts
// ✅ 为环境变量添加类型
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // 必需的环境变量
      DATABASE_URL: string
      REDIS_URL: string
      JWT_SECRET: string

      // 可选的环境变量
      PORT?: string
      LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error'

      // 特定值的环境变量
      NODE_ENV: 'development' | 'production' | 'test'
    }
  }
}

// 使用时有完整的类型检查
const config = {
  database: process.env.DATABASE_URL, // string
  port: parseInt(process.env.PORT || '3000'),
  nodeEnv: process.env.NODE_ENV, // 'development' | 'production' | 'test'
}
```

### 10.7. 场景 7：CSS Modules

```ts
// ✅ 为 CSS Modules 添加类型
declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}

// 使用
import styles from './Button.module.css'

const Button = () => <button className={styles.button}>Click me</button>
```

## 11. 🤔 常见错误和最佳实践

### 11.1. 错误 1：类型别名不支持合并

```ts
// ❌ 类型别名不能合并
type User = {
  name: string
}

type User = {
  // ❌ Error: Duplicate identifier
  age: number
}

// ✅ 使用接口
interface User {
  name: string
}

interface User {
  // ✅ 自动合并
  age: number
}
```

### 11.2. 错误 2：属性类型冲突

```ts
// ❌ 非函数属性类型必须相同
interface Config {
  port: number
}

interface Config {
  port: string // ❌ Error
}

// ✅ 使用联合类型
interface Config {
  port: number | string
}

interface Config {
  port: number // ✅ number 是子类型
}
```

### 11.3. 错误 3：忘记 declare module

```ts
// ❌ 直接扩展不会生效
interface Request {
  user: User
}

// ✅ 需要使用 declare module
declare module 'express-serve-static-core' {
  interface Request {
    user: User
  }
}
```

### 11.4. 错误 4：全局污染

```ts
// ❌ 不必要的全局扩展
declare global {
  interface String {
    myMethod(): void
  }
}

// ✅ 尽量避免扩展内置类型
// 使用工具函数代替
function myStringMethod(str: string): void {
  // 实现
}
```

### 11.5. 最佳实践

```ts
// ✅ 1. 使用接口而非类型别名进行扩展
interface User {
  name: string
}

interface User {
  age: number
}

// ✅ 2. 将扩展放在单独的类型定义文件
// types/express.d.ts
import 'express'

declare module 'express-serve-static-core' {
  interface Request {
    user?: User
  }
}

// ✅ 3. 文档化扩展
/
 * 扩展 Express Request
 * 添加用户认证信息
 */
declare module 'express-serve-static-core' {
  interface Request {
    / 当前登录用户 */
    user?: {
      id: number
      role: string
    }
  }
}

// ✅ 4. 使用命名空间组织扩展
declare global {
  namespace MyApp {
    interface Config {
      apiUrl: string
    }
  }
}

declare global {
  namespace MyApp {
    interface Config {
      timeout: number
    }
  }
}

// ✅ 5. 避免扩展内置类型
// ❌ 不推荐
declare global {
  interface Array<T> {
    myMethod(): void
  }
}

// ✅ 使用工具函数
function arrayMyMethod<T>(arr: T[]): void {
  // 实现
}

// ✅ 6. 模块扩展时保持类型一致
declare module './types' {
  interface User {
    email: string // 与现有属性风格一致
  }
}

// ✅ 7. 使用 export {} 确保文件是模块
// global.d.ts
declare global {
  interface Window {
    myApp: any
  }
}

export {} // 确保是模块

// ✅ 8. 合并时考虑可选性
interface Config {
  host: string
}

interface Config {
  port?: number // 可选属性
}

// ✅ 9. 为第三方库扩展创建单独文件
// types/
//   express.d.ts
//   vue.d.ts
//   react.d.ts

// ✅ 10. 测试扩展是否生效
// 创建测试用例验证类型
const req: Request = {} as any
req.user // 应该有类型提示

const config: MyApp.Config = {
  apiUrl: 'http://api.example.com',
  timeout: 5000,
}
```

## 12. 🔗 引用

- [TypeScript Handbook - Declaration Merging][1]
- [TypeScript Handbook - Module Augmentation][2]
- [TypeScript Deep Dive - Declaration Merging][3]

[1]: https://www.typescriptlang.org/docs/handbook/declaration-merging.html
[2]: https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
[3]: https://basarat.gitbook.io/typescript/type-system/declaration-merging
