# [0102. 对象的额外属性检查](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0102.%20%E5%AF%B9%E8%B1%A1%E7%9A%84%E9%A2%9D%E5%A4%96%E5%B1%9E%E6%80%A7%E6%A3%80%E6%9F%A5)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是额外属性检查？](#3--什么是额外属性检查)
- [4. 🤔 何时触发额外属性检查？](#4--何时触发额外属性检查)
  - [4.1. 触发条件](#41-触发条件)
  - [4.2. 函数参数](#42-函数参数)
  - [4.3. 返回值](#43-返回值)
  - [4.4. 类型断言](#44-类型断言)
- [5. 🤔 如何绕过额外属性检查？](#5--如何绕过额外属性检查)
  - [5.1. 方法 1：使用变量](#51-方法-1使用变量)
  - [5.2. 方法 2：类型断言](#52-方法-2类型断言)
  - [5.3. 方法 3：添加索引签名](#53-方法-3添加索引签名)
  - [5.4. 方法 4：使用交叉类型](#54-方法-4使用交叉类型)
  - [5.5. 方法 5：使用 Partial 和扩展运算符](#55-方法-5使用-partial-和扩展运算符)
- [6. 🤔 额外属性检查的原理](#6--额外属性检查的原理)
  - [6.1. 结构类型 vs 额外属性检查](#61-结构类型-vs-额外属性检查)
  - [6.2. 新鲜对象类型](#62-新鲜对象类型)
  - [6.3. 检查时机](#63-检查时机)
- [7. 🤔 索引签名与额外属性检查](#7--索引签名与额外属性检查)
  - [7.1. 索引签名允许额外属性](#71-索引签名允许额外属性)
  - [7.2. 索引签名的类型约束](#72-索引签名的类型约束)
  - [7.3. 弱类型检测](#73-弱类型检测)
- [8. 🤔 常见使用场景](#8--常见使用场景)
  - [8.1. 场景 1：配置对象](#81-场景-1配置对象)
  - [8.2. 场景 2：函数选项](#82-场景-2函数选项)
  - [8.3. 场景 3：React Props](#83-场景-3react-props)
  - [8.4. 场景 4：API 请求体](#84-场景-4api-请求体)
  - [8.5. 场景 5：需要灵活性的配置](#85-场景-5需要灵活性的配置)
- [9. 🤔 常见错误和最佳实践](#9--常见错误和最佳实践)
  - [9.1. 错误 1：不理解为什么会报错](#91-错误-1不理解为什么会报错)
  - [9.2. 错误 2：过度使用类型断言](#92-错误-2过度使用类型断言)
  - [9.3. 错误 3：索引签名过于宽泛](#93-错误-3索引签名过于宽泛)
  - [9.4. 错误 4：忽略有用的错误提示](#94-错误-4忽略有用的错误提示)
  - [9.5. 最佳实践](#95-最佳实践)
- [10. 🔗 引用](#10--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 额外属性检查的概念
- 触发条件和时机
- 绕过检查的方法
- 与索引签名的关系
- 实际应用场景
- 类型断言的影响

## 2. 🫧 评价

额外属性检查（Excess Property Checking）是 TypeScript 的一个**特殊类型检查机制**，用于检测对象字面量中的**多余属性**。

这个检查的目的是**捕获拼写错误**和**无效配置**：

```ts
interface Config {
  host: string
  port: number
}

// ❌ 拼写错误：prot 应该是 port
const config: Config = {
  host: 'localhost',
  prot: 3000, // Error: 'prot' does not exist in type 'Config'
}
```

额外属性检查的特点：

- **只针对对象字面量**：直接赋值时触发
- **严格但不总是有效**：可以被绕过
- **帮助发现错误**：特别是拼写错误
- **有时过于严格**：需要绕过机制

理解额外属性检查，能帮助你：

1. 理解为什么某些代码报错
2. 知道如何合理绕过检查
3. 编写更安全的配置对象
4. 避免常见的拼写错误

这是 TypeScript 类型系统中容易让人困惑的特性之一，但理解它能让你更好地使用 TypeScript。

## 3. 🤔 什么是额外属性检查？

额外属性检查会**拒绝对象字面量中的多余属性**。

```ts
interface User {
  name: string
  age: number
}

// ❌ 额外属性检查：email 不在类型定义中
const user: User = {
  name: 'Alice',
  age: 25,
  email: 'alice@example.com', // Error: Object literal may only specify known properties
}

// ✅ 只包含已知属性
const user: User = {
  name: 'Alice',
  age: 25,
}
```

**为什么需要这个检查？**

```ts
interface Config {
  timeout: number
  retries: number
}

// ❌ 捕获拼写错误
const config: Config = {
  timeout: 5000,
  retrys: 3, // Error: 拼写错误，应该是 retries
}
```

## 4. 🤔 何时触发额外属性检查？

### 4.1. 触发条件

额外属性检查**只在对象字面量**直接赋值时触发：

```ts
interface Point {
  x: number
  y: number
}

// ❌ 触发检查：对象字面量直接赋值
const p1: Point = {
  x: 10,
  y: 20,
  z: 30, // Error
}

// ✅ 不触发检查：先赋值给变量
const obj = {
  x: 10,
  y: 20,
  z: 30,
}
const p2: Point = obj // ✅ 不报错
```

### 4.2. 函数参数

```ts
interface Options {
  width: number
  height: number
}

function render(options: Options) {
  // 实现
}

// ❌ 触发检查
render({
  width: 100,
  height: 200,
  color: 'red', // Error
})

// ✅ 不触发检查
const opts = {
  width: 100,
  height: 200,
  color: 'red',
}
render(opts) // ✅ 不报错
```

### 4.3. 返回值

```ts
interface User {
  name: string
  age: number
}

// ❌ 触发检查
function getUser(): User {
  return {
    name: 'Alice',
    age: 25,
    email: 'alice@example.com', // Error
  }
}

// ✅ 不触发检查
function getUser(): User {
  const user = {
    name: 'Alice',
    age: 25,
    email: 'alice@example.com',
  }
  return user // ✅ 不报错
}
```

### 4.4. 类型断言

```ts
interface Point {
  x: number
  y: number
}

// ❌ 触发检查
const p1: Point = {
  x: 10,
  y: 20,
  z: 30, // Error
}

// ✅ 类型断言绕过检查
const p2 = {
  x: 10,
  y: 20,
  z: 30,
} as Point // ✅ 不报错
```

## 5. 🤔 如何绕过额外属性检查？

### 5.1. 方法 1：使用变量

```ts
interface Config {
  host: string
  port: number
}

// ✅ 先赋值给变量
const config = {
  host: 'localhost',
  port: 3000,
  timeout: 5000, // 额外属性
}

const serverConfig: Config = config // ✅ 不报错
```

### 5.2. 方法 2：类型断言

```ts
// ✅ 使用类型断言
const config: Config = {
  host: 'localhost',
  port: 3000,
  timeout: 5000,
} as Config // ✅ 不报错
```

### 5.3. 方法 3：添加索引签名

```ts
// ✅ 添加索引签名允许额外属性
interface Config {
  host: string
  port: number
  [key: string]: any // 允许任意额外属性
}

const config: Config = {
  host: 'localhost',
  port: 3000,
  timeout: 5000, // ✅ 允许
  ssl: true, // ✅ 允许
}
```

### 5.4. 方法 4：使用交叉类型

```ts
interface BaseConfig {
  host: string
  port: number
}

// ✅ 交叉类型允许额外属性
const config: BaseConfig & { timeout: number } = {
  host: 'localhost',
  port: 3000,
  timeout: 5000, // ✅ 明确声明的额外属性
}
```

### 5.5. 方法 5：使用 Partial 和扩展运算符

```ts
interface User {
  name: string
  age: number
}

// ✅ 使用扩展运算符
const user: User = {
  name: 'Alice',
  age: 25,
  ...{ email: 'alice@example.com' }, // ✅ 不报错
}
```

## 6. 🤔 额外属性检查的原理

### 6.1. 结构类型 vs 额外属性检查

TypeScript 使用**结构类型系统**（Structural Typing），但额外属性检查是例外：

```ts
interface Point {
  x: number
  y: number
}

// ✅ 结构类型：多余属性是允许的
function distance(p: Point): number {
  return Math.sqrt(p.x * p.x + p.y * p.y)
}

const point = { x: 3, y: 4, z: 5 }
distance(point) // ✅ 可以传入有额外属性的对象

// ❌ 但对象字面量会检查
distance({
  x: 3,
  y: 4,
  z: 5, // Error
})
```

### 6.2. 新鲜对象类型

TypeScript 将**对象字面量**视为"新鲜对象类型"（Fresh Object Type）：

```ts
// 新鲜对象类型：会进行额外属性检查
const fresh = { x: 1, y: 2, z: 3 }

// 非新鲜对象类型：不会检查
const notFresh = fresh
```

### 6.3. 检查时机

```ts
interface Config {
  host: string
}

// ❌ 创建时检查
const config: Config = { host: 'localhost', port: 3000 } // Error

// ✅ 赋值后不再检查
const obj = { host: 'localhost', port: 3000 }
const config: Config = obj // ✅ obj 不是新鲜对象
```

## 7. 🤔 索引签名与额外属性检查

### 7.1. 索引签名允许额外属性

```ts
// ✅ 有索引签名，允许额外属性
interface FlexibleConfig {
  host: string
  port: number
  [key: string]: any
}

const config: FlexibleConfig = {
  host: 'localhost',
  port: 3000,
  timeout: 5000, // ✅ 允许
  ssl: true, // ✅ 允许
  anything: 'ok', // ✅ 允许
}
```

### 7.2. 索引签名的类型约束

```ts
// ✅ 索引签名限制额外属性的类型
interface StrictConfig {
  host: string
  port: number
  [key: string]: string | number | boolean
}

const config: StrictConfig = {
  host: 'localhost',
  port: 3000,
  ssl: true, // ✅ boolean 允许
  timeout: 5000, // ✅ number 允许
  debug: 'yes', // ✅ string 允许
  // handler: () => {}  // ❌ function 不允许
}
```

### 7.3. 弱类型检测

```ts
// ⚠️ 所有属性都可选的类型（弱类型）仍会检查
interface WeakType {
  name?: string
  age?: number
}

// ❌ 即使所有属性可选，也会检查额外属性
const obj: WeakType = {
  email: 'test@example.com', // Error: 没有共同属性
}

// ✅ 至少要有一个共同属性
const obj: WeakType = {
  name: 'Alice',
  email: 'test@example.com', // ✅ 有 name 属性
}
```

## 8. 🤔 常见使用场景

### 8.1. 场景 1：配置对象

```ts
// ✅ 捕获配置错误
interface ServerConfig {
  host: string
  port: number
  timeout?: number
}

// ❌ 拼写错误
const config: ServerConfig = {
  host: 'localhost',
  prot: 3000, // Error: 应该是 port
  timout: 5000, // Error: 应该是 timeout
}

// ✅ 正确配置
const config: ServerConfig = {
  host: 'localhost',
  port: 3000,
  timeout: 5000,
}
```

### 8.2. 场景 2：函数选项

```ts
interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: any
}

async function fetchData(url: string, options: FetchOptions) {
  // 实现
}

// ❌ 拼写错误
fetchData('/api/users', {
  methd: 'GET', // Error: 应该是 method
  header: {}, // Error: 应该是 headers
})

// ✅ 正确使用
fetchData('/api/users', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
})
```

### 8.3. 场景 3：React Props

```ts
interface ButtonProps {
  text: string
  onClick: () => void
  type?: 'primary' | 'secondary'
  disabled?: boolean
}

// ❌ 无效的 prop
const button = (
  <Button
    text="Click"
    onClick={handleClick}
    typ="primary" // Error: 应该是 type
  />
)

// ✅ 正确的 props
const button = <Button text="Click" onClick={handleClick} type="primary" />
```

### 8.4. 场景 4：API 请求体

```ts
interface CreateUserRequest {
  username: string
  email: string
  password: string
}

async function createUser(data: CreateUserRequest) {
  return fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// ❌ 多余字段
createUser({
  username: 'alice',
  email: 'alice@example.com',
  password: 'secret',
  confirmPassword: 'secret', // Error: 不在类型定义中
})

// ✅ 如果需要额外字段，使用中间变量
const formData = {
  username: 'alice',
  email: 'alice@example.com',
  password: 'secret',
  confirmPassword: 'secret',
}

if (formData.password === formData.confirmPassword) {
  createUser(formData) // ✅ 不报错
}
```

### 8.5. 场景 5：需要灵活性的配置

```ts
// ✅ 使用索引签名允许插件配置
interface PluginConfig {
  name: string
  enabled: boolean
  [key: string]: any // 允许插件特定的配置
}

const eslintConfig: PluginConfig = {
  name: 'eslint',
  enabled: true,
  rules: { 'no-console': 'error' }, // ✅ 插件特定配置
  parserOptions: { ecmaVersion: 2020 }, // ✅ 插件特定配置
}
```

## 9. 🤔 常见错误和最佳实践

### 9.1. 错误 1：不理解为什么会报错

```ts
interface Point {
  x: number
  y: number
}

// ❌ 疑惑：为什么报错？
const p: Point = {
  x: 10,
  y: 20,
  z: 30, // Error
}

// ✅ 理解：对象字面量会进行额外属性检查
// 解决方案 1：移除多余属性
const p: Point = { x: 10, y: 20 }

// 解决方案 2：使用变量
const obj = { x: 10, y: 20, z: 30 }
const p: Point = obj
```

### 9.2. 错误 2：过度使用类型断言

```ts
// ❌ 过度使用断言失去类型安全
const config = {
  host: 'localhost',
  prot: 3000, // 拼写错误
} as Config

// ✅ 应该修复错误而不是断言
const config: Config = {
  host: 'localhost',
  port: 3000, // 修正拼写
}
```

### 9.3. 错误 3：索引签名过于宽泛

```ts
// ❌ 过于宽泛的索引签名
interface Config {
  host: string
  port: number
  [key: string]: any // 任何属性都可以
}

// ✅ 更具体的索引签名
interface Config {
  host: string
  port: number
  [key: string]: string | number | boolean
}
```

### 9.4. 错误 4：忽略有用的错误提示

```ts
interface Options {
  timeout: number
  retries: number
}

// ❌ 忽略错误，错失发现 bug 的机会
const options = {
  timeout: 5000,
  retrys: 3, // 拼写错误
} as Options

// ✅ 注意错误提示
const options: Options = {
  timeout: 5000,
  retries: 3, // 修正拼写
}
```

### 9.5. 最佳实践

```ts
// ✅ 1. 对于严格的类型，不要绕过检查
interface StrictConfig {
  host: string
  port: number
}

const config: StrictConfig = {
  host: 'localhost',
  port: 3000,
  // 不要添加额外属性
}

// ✅ 2. 对于灵活的类型，使用索引签名
interface FlexibleConfig {
  host: string
  port: number
  [key: string]: any
}

// ✅ 3. 使用变量处理复杂情况
const rawConfig = {
  host: 'localhost',
  port: 3000,
  // 其他属性...
}

const config: StrictConfig = extractConfig(rawConfig)

// ✅ 4. 在函数中解构并提供默认值
interface Options {
  timeout?: number
  retries?: number
}

function connect({
  timeout = 5000,
  retries = 3,
  ...extra // 接收额外属性
}: Options & Record<string, any>) {
  // 实现
}

// ✅ 5. 使用类型守卫验证运行时数据
function isValidConfig(obj: any): obj is Config {
  return (
    typeof obj === 'object' &&
    typeof obj.host === 'string' &&
    typeof obj.port === 'number'
  )
}

// ✅ 6. 文档化为什么需要额外属性
/**
 * 配置对象
 * @property host - 主机地址
 * @property port - 端口号
 * @property [key: string] - 插件特定的配置项
 */
interface Config {
  host: string
  port: number
  [key: string]: any
}

// ✅ 7. 对于 API 响应使用索引签名
interface ApiResponse {
  status: number
  data: any
  [key: string]: any // 允许额外的元数据
}

// ✅ 8. 测试时注意额外属性
it('should accept valid config', () => {
  const config: Config = {
    host: 'localhost',
    port: 3000,
  }
  expect(isValidConfig(config)).toBe(true)
})

// ✅ 9. 使用 Pick/Omit 提取子集
type ServerConfig = Pick<FullConfig, 'host' | 'port'>

// ✅ 10. 明确区分内部类型和外部 API
interface InternalConfig {
  host: string
  port: number
  // 严格的内部类型
}

interface ExternalConfig {
  host: string
  port: number
  [key: string]: any // 宽松的外部 API
}

function normalizeConfig(external: ExternalConfig): InternalConfig {
  return {
    host: external.host,
    port: external.port,
  }
}
```

## 10. 🔗 引用

- [TypeScript Handbook - Excess Property Checks][1]
- [TypeScript Handbook - Object Types][2]
- [TypeScript Deep Dive - Freshness][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/objects.html#excess-property-checks
[2]: https://www.typescriptlang.org/docs/handbook/2/objects.html
[3]: https://basarat.gitbook.io/typescript/type-system/freshness
