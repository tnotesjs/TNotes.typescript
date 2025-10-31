# [0092. 可选参数与默认参数](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0092.%20%E5%8F%AF%E9%80%89%E5%8F%82%E6%95%B0%E4%B8%8E%E9%BB%98%E8%AE%A4%E5%8F%82%E6%95%B0)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是可选参数？](#3--什么是可选参数)
  - [3.1. 基本语法](#31-基本语法)
  - [3.2. 类型推断](#32-类型推断)
  - [3.3. 可选参数的位置](#33-可选参数的位置)
- [4. 🤔 什么是默认参数？](#4--什么是默认参数)
  - [4.1. 基本语法](#41-基本语法)
  - [4.2. 类型推断](#42-类型推断)
  - [4.3. 默认参数的位置](#43-默认参数的位置)
- [5. 🤔 可选参数 vs 默认参数](#5--可选参数-vs-默认参数)
  - [5.1. 对比表](#51-对比表)
  - [5.2. 实际对比](#52-实际对比)
  - [5.3. 类型差异](#53-类型差异)
- [6. 🤔 可选参数的规则和限制](#6--可选参数的规则和限制)
  - [6.1. 规则 1：必须在必需参数之后](#61-规则-1必须在必需参数之后)
  - [6.2. 规则 2：可以有多个可选参数](#62-规则-2可以有多个可选参数)
  - [6.3. 规则 3：类型必须包含 undefined](#63-规则-3类型必须包含-undefined)
  - [6.4. 规则 4：与解构结合](#64-规则-4与解构结合)
- [7. 🤔 默认参数的特性](#7--默认参数的特性)
  - [7.1. 特性 1：类型推断](#71-特性-1类型推断)
  - [7.2. 特性 2：可以使用表达式](#72-特性-2可以使用表达式)
  - [7.3. 特性 3：位置灵活](#73-特性-3位置灵活)
  - [7.4. 特性 4：与解构结合](#74-特性-4与解构结合)
- [8. 🤔 与 undefined 的关系](#8--与-undefined-的关系)
  - [8.1. 传递 undefined](#81-传递-undefined)
  - [8.2. 类型检查差异](#82-类型检查差异)
- [9. 🤔 常见使用场景](#9--常见使用场景)
  - [9.1. 场景 1：配置对象](#91-场景-1配置对象)
  - [9.2. 场景 2：日志函数](#92-场景-2日志函数)
  - [9.3. 场景 3：数组操作](#93-场景-3数组操作)
  - [9.4. 场景 4：格式化函数](#94-场景-4格式化函数)
  - [9.5. 场景 5：分页参数](#95-场景-5分页参数)
  - [9.6. 场景 6：重试逻辑](#96-场景-6重试逻辑)
- [10. 🤔 常见错误和最佳实践](#10--常见错误和最佳实践)
  - [10.1. 错误 1：可选参数位置错误](#101-错误-1可选参数位置错误)
  - [10.2. 错误 2：忘记检查 undefined](#102-错误-2忘记检查-undefined)
  - [10.3. 错误 3：默认值类型不匹配](#103-错误-3默认值类型不匹配)
  - [10.4. 最佳实践](#104-最佳实践)
- [11. 🔗 引用](#11--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 可选参数的定义和语法
- 默认参数的定义和语法
- 可选参数与默认参数的区别
- 类型推断规则
- 使用限制和规则
- 实际应用场景

## 2. 🫧 评价

可选参数（Optional Parameters）和默认参数（Default Parameters）是 TypeScript 函数中两种让参数变得灵活的机制：

- **可选参数**：使用 `?` 标记，表示参数**可以不传递**，类型为 `T | undefined`
- **默认参数**：使用 `= value` 赋值，表示参数**有默认值**，不传递时使用默认值

虽然它们都能让参数变得可选，但有重要区别：

- 可选参数没有默认值，值为 `undefined`
- 默认参数有明确的默认值

理解可选参数和默认参数，能帮助你：

1. 设计灵活的函数 API
2. 减少函数重载
3. 提供更好的类型推断
4. 编写更简洁的代码

## 3. 🤔 什么是可选参数？

可选参数使用 `?` 标记，表示调用时**可以不传递**该参数。

### 3.1. 基本语法

```ts
// 语法：参数名?: 类型
function greet(name: string, greeting?: string) {
  if (greeting) {
    return `${greeting}, ${name}`
  }
  return `Hello, ${name}`
}

// 调用
greet('Alice') // ✅ 'Hello, Alice'
greet('Bob', 'Hi') // ✅ 'Hi, Bob'
```

### 3.2. 类型推断

```ts
function log(message: string, level?: 'info' | 'warn' | 'error') {
  // level 的类型：'info' | 'warn' | 'error' | undefined
  console.log(`[${level ?? 'info'}] ${message}`)
}

log('Hello') // ✅
log('Warning', 'warn') // ✅
```

### 3.3. 可选参数的位置

```ts
// ✅ 可选参数必须在必需参数之后
function good(a: string, b?: number, c?: boolean) {}

// ❌ 可选参数之后不能有必需参数
function bad(a: string, b?: number, c: boolean) {}
// Error: A required parameter cannot follow an optional parameter
```

## 4. 🤔 什么是默认参数？

默认参数使用 `= value` 赋值，当调用时不传递该参数时，使用默认值。

### 4.1. 基本语法

```ts
// 语法：参数名: 类型 = 默认值
function greet(name: string, greeting: string = 'Hello') {
  return `${greeting}, ${name}`
}

// 调用
greet('Alice') // ✅ 'Hello, Alice'
greet('Bob', 'Hi') // ✅ 'Hi, Bob'
```

### 4.2. 类型推断

```ts
// ✅ 类型可以从默认值推断
function createUser(name: string, age = 18) {
  // age 自动推断为 number
  return { name, age }
}

// ✅ 显式指定类型
function createUser(name: string, age: number = 18) {
  return { name, age }
}
```

### 4.3. 默认参数的位置

```ts
// ✅ 默认参数可以在任意位置
function good1(a: string, b: number = 0, c: boolean) {}
function good2(a: string = 'default', b: number, c: boolean) {}

// 调用时需要显式传递 undefined
good1('hello', undefined, true) // b 使用默认值 0
good2(undefined, 42, true) // a 使用默认值 'default'
```

## 5. 🤔 可选参数 vs 默认参数

### 5.1. 对比表

| 特性         | 可选参数            | 默认参数               |
| ------------ | ------------------- | ---------------------- |
| **语法**     | `param?: Type`      | `param: Type = value`  |
| **值**       | `undefined`         | 默认值                 |
| **类型**     | `Type \| undefined` | `Type`                 |
| **位置限制** | 必须在必需参数后    | 任意位置               |
| **调用**     | 可省略              | 可省略或传 `undefined` |

### 5.2. 实际对比

::: code-group

```ts [可选参数]
// 可选参数
function greet(name: string, greeting?: string) {
  // greeting 类型：string | undefined
  if (greeting) {
    return `${greeting}, ${name}`
  }
  return `Hello, ${name}`
}

greet('Alice') // ✅ greeting 是 undefined
greet('Bob', 'Hi') // ✅ greeting 是 'Hi'
greet('Charlie', undefined) // ✅ greeting 是 undefined

// ⚠️ 需要检查 undefined
console.log(greeting.toUpperCase()) // ❌ Error: Object is possibly 'undefined'
```

```ts [默认参数]
// 默认参数
function greet(name: string, greeting: string = 'Hello') {
  // greeting 类型：string（不是 string | undefined）
  return `${greeting}, ${name}`
}

greet('Alice') // ✅ greeting 是 'Hello'
greet('Bob', 'Hi') // ✅ greeting 是 'Hi'
greet('Charlie', undefined) // ✅ greeting 是 'Hello'

// ✅ 不需要检查 undefined
console.log(greeting.toUpperCase()) // ✅ 安全
```

:::

### 5.3. 类型差异

```ts
// 可选参数：类型包含 undefined
function optional(value?: number) {
  value // 类型：number | undefined

  // 需要类型守卫
  if (value !== undefined) {
    console.log(value.toFixed(2)) // ✅
  }
}

// 默认参数：类型不包含 undefined
function defaultParam(value: number = 0) {
  value // 类型：number

  // 直接使用
  console.log(value.toFixed(2)) // ✅
}
```

## 6. 🤔 可选参数的规则和限制

### 6.1. 规则 1：必须在必需参数之后

```ts
// ❌ 可选参数之后不能有必需参数
function bad(a: string, b?: number, c: string) {}
// Error: A required parameter cannot follow an optional parameter

// ✅ 可选参数在最后
function good(a: string, c: string, b?: number) {}
```

### 6.2. 规则 2：可以有多个可选参数

```ts
// ✅ 多个连续的可选参数
function create(name: string, age?: number, email?: string, phone?: string) {
  return { name, age, email, phone }
}

create('Alice') // ✅
create('Bob', 25) // ✅
create('Charlie', 30, 'charlie@example.com') // ✅
```

### 6.3. 规则 3：类型必须包含 undefined

```ts
// 可选参数自动包含 undefined
function process(value?: number) {
  value // 类型：number | undefined
}

// 等价于
function process(value: number | undefined) {
  value // 类型：number | undefined
}
```

### 6.4. 规则 4：与解构结合

```ts
// ✅ 解构参数可选
function configure({ host, port }: { host: string; port?: number } = {}) {
  console.log(host, port)
}

configure({ host: 'localhost' }) // ✅
configure({ host: 'localhost', port: 3000 }) // ✅
```

## 7. 🤔 默认参数的特性

### 7.1. 特性 1：类型推断

```ts
// ✅ 类型从默认值推断
function add(a: number, b = 0) {
  // b 自动推断为 number
  return a + b
}

// 复杂类型也可以推断
function createConfig(options = { host: 'localhost', port: 3000 }) {
  // options 推断为 { host: string; port: number }
  return options
}
```

### 7.2. 特性 2：可以使用表达式

```ts
// ✅ 默认值可以是表达式
function log(message: string, timestamp = Date.now()) {
  console.log(`[${timestamp}] ${message}`)
}

// ✅ 默认值可以引用前面的参数
function greet(
  firstName: string,
  lastName: string,
  fullName = `${firstName} ${lastName}`
) {
  return `Hello, ${fullName}`
}
```

### 7.3. 特性 3：位置灵活

```ts
// ✅ 默认参数可以在任意位置（但需要传 undefined）
function configure(
  host: string = 'localhost',
  port: number,
  ssl: boolean = false
) {
  return { host, port, ssl }
}

// 使用
configure(undefined, 3000) // { host: 'localhost', port: 3000, ssl: false }
configure('example.com', 443, true) // { host: 'example.com', port: 443, ssl: true }
```

### 7.4. 特性 4：与解构结合

```ts
// ✅ 解构参数默认值
function configure({
  host = 'localhost',
  port = 3000,
  ssl = false,
}: {
  host?: string
  port?: number
  ssl?: boolean
} = {}) {
  return { host, port, ssl }
}

configure() // ✅ 使用所有默认值
configure({ port: 8080 }) // ✅ host 和 ssl 使用默认值
```

## 8. 🤔 与 undefined 的关系

### 8.1. 传递 undefined

```ts
// 可选参数：可以显式传递 undefined
function optional(value?: number) {
  console.log(value)
}

optional() // undefined
optional(undefined) // undefined
optional(null) // ❌ Error: Type 'null' is not assignable

// 默认参数：传递 undefined 会使用默认值
function defaultParam(value: number = 42) {
  console.log(value)
}

defaultParam() // 42
defaultParam(undefined) // 42
defaultParam(null) // ❌ Error: Type 'null' is not assignable
```

### 8.2. 类型检查差异

```ts
// 可选参数：需要检查 undefined
function optional(value?: number) {
  // ❌ 直接使用会报错
  // console.log(value.toFixed(2)) // Error: Object is possibly 'undefined'

  // ✅ 需要检查
  if (value !== undefined) {
    console.log(value.toFixed(2))
  }
}

// 默认参数：不需要检查
function defaultParam(value: number = 0) {
  // ✅ 直接使用
  console.log(value.toFixed(2))
}
```

## 9. 🤔 常见使用场景

### 9.1. 场景 1：配置对象

```ts
// ✅ 使用默认参数提供配置
interface ServerConfig {
  host: string
  port: number
  ssl: boolean
  timeout: number
}

function createServer({
  host = 'localhost',
  port = 3000,
  ssl = false,
  timeout = 30000,
}: Partial<ServerConfig> = {}) {
  return { host, port, ssl, timeout }
}

// 使用
createServer() // 所有默认值
createServer({ port: 8080 }) // 只覆盖 port
```

### 9.2. 场景 2：日志函数

```ts
// ✅ 可选的日志级别
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

function log(message: string, level: LogLevel = 'info') {
  console.log(`[${level.toUpperCase()}] ${message}`)
}

log('Application started') // [INFO] Application started
log('Debug info', 'debug') // [DEBUG] Debug info
```

### 9.3. 场景 3：数组操作

```ts
// ✅ 可选的起始索引
function findIndex<T>(
  array: T[],
  predicate: (item: T) => boolean,
  fromIndex: number = 0
): number {
  for (let i = fromIndex; i < array.length; i++) {
    if (predicate(array[i])) {
      return i
    }
  }
  return -1
}

// 使用
const numbers = [1, 2, 3, 4, 5]
findIndex(numbers, (n) => n > 3) // 从索引 0 开始
findIndex(numbers, (n) => n > 3, 2) // 从索引 2 开始
```

### 9.4. 场景 4：格式化函数

```ts
// ✅ 可选的格式化选项
function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

formatCurrency(1234.56) // $1,234.56
formatCurrency(1234.56, 'EUR') // €1,234.56
formatCurrency(1234.56, 'EUR', 'de-DE') // 1.234,56 €
```

### 9.5. 场景 5：分页参数

```ts
// ✅ 可选的分页参数
interface PaginationParams {
  page?: number
  pageSize?: number
  sortBy?: string
  order?: 'asc' | 'desc'
}

function fetchData({
  page = 1,
  pageSize = 10,
  sortBy = 'id',
  order = 'asc',
}: PaginationParams = {}) {
  return {
    page,
    pageSize,
    sortBy,
    order,
  }
}

fetchData() // 使用所有默认值
fetchData({ page: 2 }) // 只修改 page
fetchData({ pageSize: 20, order: 'desc' }) // 修改多个
```

### 9.6. 场景 6：重试逻辑

```ts
// ✅ 可选的重试配置
async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error
      }
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
  throw new Error('Retry failed')
}

// 使用
retry(() => fetchData()) // 默认 3 次，间隔 1 秒
retry(() => fetchData(), 5) // 5 次，间隔 1 秒
retry(() => fetchData(), 5, 2000) // 5 次，间隔 2 秒
```

## 10. 🤔 常见错误和最佳实践

### 10.1. 错误 1：可选参数位置错误

```ts
// ❌ 可选参数之后有必需参数
function bad(a: string, b?: number, c: string) {}

// ✅ 可选参数在最后
function good(a: string, c: string, b?: number) {}

// ✅ 或使用默认参数
function better(a: string, b: number = 0, c: string) {}
```

### 10.2. 错误 2：忘记检查 undefined

```ts
// ❌ 可选参数没有检查
function bad(value?: number) {
  return value.toFixed(2) // Error: Object is possibly 'undefined'
}

// ✅ 检查 undefined
function good(value?: number) {
  if (value !== undefined) {
    return value.toFixed(2)
  }
  return '0.00'
}

// ✅ 或使用默认参数
function better(value: number = 0) {
  return value.toFixed(2)
}
```

### 10.3. 错误 3：默认值类型不匹配

```ts
// ❌ 默认值类型不匹配
function bad(value: number = 'zero') {}
// Error: Type 'string' is not assignable to type 'number'

// ✅ 默认值类型匹配
function good(value: number = 0) {}
```

### 10.4. 最佳实践

```ts
// ✅ 1. 优先使用默认参数而不是可选参数
// Good: 有明确的默认值
function createUser(name: string, age: number = 18) {}

// Less good: 需要在函数内部处理 undefined
function createUser(name: string, age?: number) {
  const finalAge = age ?? 18
}

// ✅ 2. 可选参数放在最后
function good(required: string, optional?: number) {}

// ✅ 3. 使用解构提供默认值
function configure({
  host = 'localhost',
  port = 3000
}: {
  host?: string
  port?: number
} = {}) {
  return { host, port }
}

// ✅ 4. 复杂对象使用 Partial
interface Config {
  host: string
  port: number
  ssl: boolean
}

function setup(config: Partial<Config> = {}) {
  const defaults: Config = {
    host: 'localhost',
    port: 3000,
    ssl: false,
  }
  return { ...defaults, ...config }
}

// ✅ 5. 布尔参数使用默认值
function toggle(enabled: boolean = false) {
  // 明确的默认行为
}

// ✅ 6. 数组/对象默认值小心处理
// ❌ Bad: 所有调用共享同一个数组
function bad(items = []) {
  items.push('new')
  return items
}

// ✅ Good: 每次调用创建新数组
function good(items?: string[]) {
  const arr = items ?? []
  arr.push('new')
  return arr
}

// ✅ 7. 文档化参数含义
/**
 * 创建用户
 * @param name - 用户名（必需）
 * @param age - 年龄（可选，默认 18）
 * @param email - 邮箱（可选）
 */
function createUser(
  name: string,
  age: number = 18,
  email?: string
) {
  return { name, age, email }
}

// ✅ 8. 使用 strictNullChecks
// 确保 tsconfig.json 中启用
{
  "compilerOptions": {
    "strictNullChecks": true
  }
}
```

## 11. 🔗 引用

- [TypeScript Handbook - Functions][1]
- [TypeScript Handbook - Optional Parameters][2]
- [MDN - Default Parameters][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/functions.html
[2]: https://www.typescriptlang.org/docs/handbook/2/functions.html#optional-parameters
[3]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters
