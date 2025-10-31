# [0093. 剩余参数](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0093.%20%E5%89%A9%E4%BD%99%E5%8F%82%E6%95%B0)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是剩余参数？](#3--什么是剩余参数)
- [4. 🤔 如何声明剩余参数？](#4--如何声明剩余参数)
  - [4.1. 基本语法](#41-基本语法)
  - [4.2. 示例](#42-示例)
  - [4.3. 与其他参数结合](#43-与其他参数结合)
- [5. 🤔 剩余参数的类型](#5--剩余参数的类型)
  - [5.1. 数组类型](#51-数组类型)
  - [5.2. 元组类型（TypeScript 4.0+）](#52-元组类型typescript-40)
  - [5.3. 泛型剩余参数](#53-泛型剩余参数)
- [6. 🤔 剩余参数的规则和限制](#6--剩余参数的规则和限制)
  - [6.1. 规则 1：必须是最后一个参数](#61-规则-1必须是最后一个参数)
  - [6.2. 规则 2：只能有一个剩余参数](#62-规则-2只能有一个剩余参数)
  - [6.3. 规则 3：类型必须是数组或元组](#63-规则-3类型必须是数组或元组)
  - [6.4. 规则 4：可以与可选参数结合](#64-规则-4可以与可选参数结合)
- [7. 🤔 剩余参数与元组](#7--剩余参数与元组)
  - [7.1. 元组剩余元素](#71-元组剩余元素)
  - [7.2. 解构元组剩余参数](#72-解构元组剩余参数)
  - [7.3. 展开元组到剩余参数](#73-展开元组到剩余参数)
- [8. 🤔 常见使用场景](#8--常见使用场景)
  - [8.1. 场景 1：数学计算](#81-场景-1数学计算)
  - [8.2. 场景 2：字符串拼接](#82-场景-2字符串拼接)
  - [8.3. 场景 3：日志函数](#83-场景-3日志函数)
  - [8.4. 场景 4：函数组合](#84-场景-4函数组合)
  - [8.5. 场景 5：事件发射器](#85-场景-5事件发射器)
  - [8.6. 场景 6：批量操作](#86-场景-6批量操作)
  - [8.7. 场景 7：路径拼接](#87-场景-7路径拼接)
- [9. 🤔 常见错误和最佳实践](#9--常见错误和最佳实践)
  - [9.1. 错误 1：剩余参数位置错误](#91-错误-1剩余参数位置错误)
  - [9.2. 错误 2：多个剩余参数](#92-错误-2多个剩余参数)
  - [9.3. 错误 3：类型注解错误](#93-错误-3类型注解错误)
  - [9.4. 最佳实践](#94-最佳实践)
- [10. 🔗 引用](#10--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 剩余参数的定义和语法
- 剩余参数的类型注解
- 与数组和元组的关系
- 位置规则和限制
- 实际应用场景
- 类型安全实践

## 2. 🫧 评价

剩余参数（Rest Parameters）使用 `...` 语法，允许函数接收**任意数量的参数**，并将它们收集到一个**数组**中。这是 ES6 引入的特性，TypeScript 为其添加了类型支持。

剩余参数解决了 JavaScript 中处理可变参数的问题，在 TypeScript 中：

- 剩余参数必须是**数组类型**或**元组类型**
- 必须是**最后一个参数**
- 只能有**一个**剩余参数

理解剩余参数，能帮助你：

1. 编写灵活的可变参数函数
2. 安全地处理不定数量的输入
3. 替代 `arguments` 对象
4. 实现函数柯里化和组合

## 3. 🤔 什么是剩余参数？

剩余参数使用 `...` 语法，将**多个参数**收集到一个**数组**中。

```ts
// 普通参数：固定数量
function add(a: number, b: number): number {
  return a + b
}
add(1, 2) // ✅ 必须传 2 个参数

// 剩余参数：可变数量
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0)
}
sum(1, 2) // ✅ 2 个参数
sum(1, 2, 3) // ✅ 3 个参数
sum(1, 2, 3, 4, 5) // ✅ 5 个参数
```

**关键特性**：

- **收集参数**：将多个参数收集到数组
- **类型安全**：每个参数都有类型检查
- **位置固定**：必须是最后一个参数
- **数组操作**：可以使用所有数组方法

## 4. 🤔 如何声明剩余参数？

### 4.1. 基本语法

```ts
// 语法：...参数名: 类型[]
function func(...args: Type[]) {
  // args 是 Type[] 类型的数组
}
```

### 4.2. 示例

```ts
// ✅ 数字数组
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0)
}

// ✅ 字符串数组
function concat(...strings: string[]): string {
  return strings.join('')
}

// ✅ 混合类型（使用联合类型）
function log(...messages: (string | number)[]): void {
  console.log(...messages)
}

// ✅ 对象数组
interface User {
  name: string
  age: number
}

function saveUsers(...users: User[]): void {
  users.forEach((user) => {
    console.log(`Saving ${user.name}`)
  })
}
```

### 4.3. 与其他参数结合

```ts
// ✅ 固定参数 + 剩余参数
function greet(greeting: string, ...names: string[]): string {
  return `${greeting}, ${names.join(' and ')}!`
}

greet('Hello', 'Alice') // 'Hello, Alice!'
greet('Hello', 'Alice', 'Bob') // 'Hello, Alice and Bob!'
greet('Hello', 'Alice', 'Bob', 'Charlie') // 'Hello, Alice and Bob and Charlie!'
```

## 5. 🤔 剩余参数的类型

### 5.1. 数组类型

```ts
// ✅ 基本类型数组
function sum(...numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0)
}

// ✅ 联合类型数组
function print(...values: (string | number | boolean)[]): void {
  console.log(...values)
}

// ✅ 对象数组
interface Point {
  x: number
  y: number
}

function distance(...points: Point[]): number {
  // 计算路径长度
  let total = 0
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x
    const dy = points[i].y - points[i - 1].y
    total += Math.sqrt(dx * dx + dy * dy)
  }
  return total
}
```

### 5.2. 元组类型（TypeScript 4.0+）

```ts
// ✅ 固定前几个参数，后面任意数量
function log(message: string, ...args: [number, ...string[]]): void {
  // args[0] 是 number
  // args[1]... 是 string
}

log('Message', 42, 'a', 'b', 'c') // ✅

// ✅ 元组剩余元素
function configure(
  ...config: [host: string, port: number, ...options: boolean[]]
): void {
  const [host, port, ...opts] = config
  console.log(host, port, opts)
}

configure('localhost', 3000, true, false, true) // ✅
```

### 5.3. 泛型剩余参数

```ts
// ✅ 泛型数组
function first<T>(...items: T[]): T | undefined {
  return items[0]
}

first(1, 2, 3) // 类型：number | undefined
first('a', 'b', 'c') // 类型：string | undefined

// ✅ 泛型元组
function tuple<T extends any[]>(...args: T): T {
  return args
}

const result = tuple(1, 'hello', true)
// 类型：[number, string, boolean]
```

## 6. 🤔 剩余参数的规则和限制

### 6.1. 规则 1：必须是最后一个参数

```ts
// ✅ 剩余参数在最后
function good(a: string, b: number, ...rest: string[]) {}

// ❌ 剩余参数不是最后一个
function bad(...rest: string[], a: string) {}
// Error: A rest parameter must be last in a parameter list
```

### 6.2. 规则 2：只能有一个剩余参数

```ts
// ❌ 不能有多个剩余参数
function bad(...nums: number[], ...strs: string[]) {}
// Error: A rest parameter must be last in a parameter list

// ✅ 使用联合类型
function good(...items: (number | string)[]) {}
```

### 6.3. 规则 3：类型必须是数组或元组

```ts
// ❌ 不能是非数组类型
function bad(...args: number) {}
// Error: A rest parameter must be of an array type

// ✅ 数组类型
function good1(...args: number[]) {}

// ✅ 元组类型
function good2(...args: [string, number]) {}

// ✅ 只读数组
function good3(...args: readonly number[]) {}
```

### 6.4. 规则 4：可以与可选参数结合

```ts
// ✅ 可选参数 + 剩余参数
function process(required: string, optional?: number, ...rest: string[]) {
  console.log(required, optional, rest)
}

process('a') // ✅
process('a', 1) // ✅
process('a', 1, 'b', 'c') // ✅
```

## 7. 🤔 剩余参数与元组

### 7.1. 元组剩余元素

```ts
// ✅ 元组剩余元素（TypeScript 4.0+）
function configure(
  ...config: [host: string, port: number, ...flags: boolean[]]
): void {
  const [host, port, ...flags] = config
  console.log(host, port, flags)
}

configure('localhost', 3000) // ✅
configure('localhost', 3000, true) // ✅
configure('localhost', 3000, true, false, true) // ✅
```

### 7.2. 解构元组剩余参数

```ts
// ✅ 解构固定部分和剩余部分
function handleData(...data: [string, number, ...boolean[]]): void {
  const [name, age, ...flags] = data
  // name: string
  // age: number
  // flags: boolean[]
}

handleData('Alice', 25, true, false) // ✅
```

### 7.3. 展开元组到剩余参数

```ts
// ✅ 元组可以展开到剩余参数
type Args = [string, number, boolean]

function process(...args: Args): void {
  const [a, b, c] = args
  console.log(a, b, c)
}

const tuple: Args = ['hello', 42, true]
process(...tuple) // ✅ 展开元组
```

## 8. 🤔 常见使用场景

### 8.1. 场景 1：数学计算

```ts
// ✅ 求和
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0)
}

sum(1, 2, 3, 4, 5) // 15

// ✅ 求平均值
function average(...numbers: number[]): number {
  if (numbers.length === 0) return 0
  return sum(...numbers) / numbers.length
}

average(10, 20, 30) // 20

// ✅ 求最大值
function max(...numbers: number[]): number {
  return Math.max(...numbers)
}

max(5, 2, 8, 1, 9) // 9
```

### 8.2. 场景 2：字符串拼接

```ts
// ✅ 连接字符串
function concat(separator: string, ...strings: string[]): string {
  return strings.join(separator)
}

concat(' ', 'Hello', 'World') // 'Hello World'
concat(', ', 'Alice', 'Bob', 'Charlie') // 'Alice, Bob, Charlie'

// ✅ 格式化输出
function format(template: string, ...values: (string | number)[]): string {
  return template.replace(/{(\d+)}/g, (match, index) => {
    return String(values[index])
  })
}

format('Hello, {0}! You are {1} years old.', 'Alice', 25)
// 'Hello, Alice! You are 25 years old.'
```

### 8.3. 场景 3：日志函数

```ts
// ✅ 多参数日志
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

function log(level: LogLevel, ...messages: any[]): void {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] [${level.toUpperCase()}]`, ...messages)
}

log('info', 'Application started')
log('error', 'Failed to connect:', { host: 'localhost', port: 3000 })

// ✅ 带格式化的日志
function logFormat(level: LogLevel, format: string, ...args: any[]): void {
  const message = format.replace(/{(\d+)}/g, (_, index) => String(args[index]))
  log(level, message)
}

logFormat('info', 'User {0} logged in from {1}', 'Alice', '192.168.1.1')
```

### 8.4. 场景 4：函数组合

```ts
// ✅ 组合多个函数
type UnaryFunction<T> = (arg: T) => T

function compose<T>(...functions: UnaryFunction<T>[]): UnaryFunction<T> {
  return (arg: T) => {
    return functions.reduceRight((result, fn) => fn(result), arg)
  }
}

const addOne = (n: number) => n + 1
const double = (n: number) => n * 2
const square = (n: number) => n * n

const composed = compose(square, double, addOne)
console.log(composed(5)) // ((5 + 1) * 2)² = 144
```

### 8.5. 场景 5：事件发射器

```ts
// ✅ 事件监听器
type Listener = (...args: any[]) => void

class EventEmitter {
  private events = new Map<string, Listener[]>()

  on(event: string, listener: Listener): void {
    const listeners = this.events.get(event) ?? []
    listeners.push(listener)
    this.events.set(event, listeners)
  }

  emit(event: string, ...args: any[]): void {
    const listeners = this.events.get(event) ?? []
    listeners.forEach((listener) => listener(...args))
  }
}

const emitter = new EventEmitter()
emitter.on('data', (msg, code) => console.log(msg, code))
emitter.emit('data', 'Hello', 200)
```

### 8.6. 场景 6：批量操作

```ts
// ✅ 批量创建
interface User {
  id: number
  name: string
}

function createUsers(...names: string[]): User[] {
  return names.map((name, index) => ({
    id: index + 1,
    name,
  }))
}

const users = createUsers('Alice', 'Bob', 'Charlie')

// ✅ 批量更新
function updateUsers(updates: Partial<User>, ...ids: number[]): void {
  ids.forEach((id) => {
    console.log(`Updating user ${id}`, updates)
  })
}

updateUsers({ name: 'New Name' }, 1, 2, 3)
```

### 8.7. 场景 7：路径拼接

```ts
// ✅ 路径片段拼接
function joinPath(...segments: string[]): string {
  return segments
    .filter((s) => s.length > 0)
    .join('/')
    .replace(/\/+/g, '/') // 移除重复的 /
}

joinPath('api', 'users', '123') // 'api/users/123'
joinPath('/api/', '/users/', '/123/') // 'api/users/123'

// ✅ URL 构建
function buildUrl(base: string, ...paths: string[]): string {
  return base.replace(/\/$/, '') + '/' + joinPath(...paths)
}

buildUrl('https://api.example.com', 'v1', 'users', '123')
// 'https://api.example.com/v1/users/123'
```

## 9. 🤔 常见错误和最佳实践

### 9.1. 错误 1：剩余参数位置错误

```ts
// ❌ 剩余参数不是最后一个
function bad(...rest: string[], other: number) {}

// ✅ 剩余参数在最后
function good(other: number, ...rest: string[]) {}
```

### 9.2. 错误 2：多个剩余参数

```ts
// ❌ 不能有多个剩余参数
function bad(...nums: number[], ...strs: string[]) {}

// ✅ 使用联合类型
function good(...items: (number | string)[]) {
  const nums = items.filter((x) => typeof x === 'number') as number[]
  const strs = items.filter((x) => typeof x === 'string') as string[]
}
```

### 9.3. 错误 3：类型注解错误

```ts
// ❌ 剩余参数必须是数组类型
function bad(...args: number) {}

// ✅ 使用数组类型
function good(...args: number[]) {}
```

### 9.4. 最佳实践

```ts
// ✅ 1. 使用具体的类型而不是 any
// Bad
function bad(...args: any[]) {}

// Good
function good(...args: (string | number)[]) {}

// ✅ 2. 结合类型守卫使用
function process(...items: (string | number)[]): void {
  items.forEach((item) => {
    if (typeof item === 'string') {
      console.log(item.toUpperCase())
    } else {
      console.log(item.toFixed(2))
    }
  })
}

// ✅ 3. 使用元组类型提供更精确的类型
// 第一个参数是 string，后面都是 number
function log(message: string, ...values: number[]): void {
  console.log(message, values)
}

// ✅ 4. 文档化剩余参数
/**
 * 计算多个数字的总和
 * @param numbers - 任意数量的数字
 * @returns 所有数字的和
 */
function sum(...numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0)
}

// ✅ 5. 检查空数组
function average(...numbers: number[]): number {
  if (numbers.length === 0) {
    throw new Error('At least one number is required')
  }
  return numbers.reduce((a, b) => a + b, 0) / numbers.length
}

// ✅ 6. 使用泛型增加灵活性
function merge<T>(...objects: T[]): T {
  return Object.assign({}, ...objects)
}

// ✅ 7. 剩余参数与解构结合
function configure(
  ...[host, port, ...options]: [string, number, ...boolean[]]
): void {
  console.log(host, port, options)
}

// ✅ 8. 替代 arguments 对象
// Bad: 使用 arguments（不推荐）
function badSum() {
  return Array.from(arguments).reduce((a, b) => a + b, 0)
}

// Good: 使用剩余参数
function goodSum(...numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0)
}
```

## 10. 🔗 引用

- [TypeScript Handbook - Rest Parameters][1]
- [MDN - Rest Parameters][2]
- [TypeScript 4.0 - Variadic Tuple Types][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/functions.html#rest-parameters
[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters
[3]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types
