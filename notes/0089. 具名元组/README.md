# [0089. 具名元组](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0089.%20%E5%85%B7%E5%90%8D%E5%85%83%E7%BB%84)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是具名元组？](#3--什么是具名元组)
- [4. 🤔 如何声明具名元组？](#4--如何声明具名元组)
  - [4.1. 基本语法](#41-基本语法)
  - [4.2. 与普通元组的对比](#42-与普通元组的对比)
  - [4.3. 部分标签](#43-部分标签)
- [5. 🤔 具名元组的特性](#5--具名元组的特性)
  - [5.1. 类型兼容性](#51-类型兼容性)
  - [5.2. 解构赋值](#52-解构赋值)
  - [5.3. IDE 提示](#53-ide-提示)
- [6. 🤔 具名元组与可选元素](#6--具名元组与可选元素)
  - [6.1. 基本用法](#61-基本用法)
  - [6.2. 函数参数](#62-函数参数)
- [7. 🤔 具名元组与剩余元素](#7--具名元组与剩余元素)
  - [7.1. 结尾的剩余元素](#71-结尾的剩余元素)
  - [7.2. 开头的剩余元素](#72-开头的剩余元素)
  - [7.3. 中间的剩余元素](#73-中间的剩余元素)
- [8. 🤔 具名元组的使用场景](#8--具名元组的使用场景)
  - [8.1. 场景 1：函数返回值](#81-场景-1函数返回值)
  - [8.2. 场景 2：React Hooks](#82-场景-2react-hooks)
  - [8.3. 场景 3：坐标系统](#83-场景-3坐标系统)
  - [8.4. 场景 4：数据库查询结果](#84-场景-4数据库查询结果)
  - [8.5. 场景 5：API 响应](#85-场景-5api-响应)
  - [8.6. 场景 6：配置元组](#86-场景-6配置元组)
  - [8.7. 场景 7：几何计算](#87-场景-7几何计算)
- [9. 🤔 常见错误和最佳实践](#9--常见错误和最佳实践)
  - [9.1. 错误 1：部分标签](#91-错误-1部分标签)
  - [9.2. 错误 2：过度依赖标签](#92-错误-2过度依赖标签)
  - [9.3. 错误 3：标签命名不当](#93-错误-3标签命名不当)
  - [9.4. 最佳实践](#94-最佳实践)
  - [9.5. 何时使用具名元组 vs 对象](#95-何时使用具名元组-vs-对象)
- [10. 🔗 引用](#10--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 具名元组的定义和语法
- 标签的作用和限制
- 与可选元素的结合
- 与剩余元素的结合
- 实际应用场景
- 最佳实践

## 2. 🫧 评价

具名元组（Labeled Tuple Elements）是 TypeScript 4.0 引入的特性，允许为元组的每个位置**添加标签**。标签仅用于**文档和工具提示**，不影响运行时行为或类型检查。

具名元组解决了元组类型的一个主要痛点：**可读性**。通过标签，你可以：

1. 清晰表达每个位置的语义
2. 提升 IDE 的代码提示
3. 改善函数签名的可读性
4. 无需额外注释即可理解参数含义

虽然标签只是"语法糖"，但它大大提升了代码的**自文档化**能力，是编写清晰 API 的重要工具。

## 3. 🤔 什么是具名元组？

具名元组是在元组的每个位置添加**标签名称**，使类型更具描述性。

```ts
// 普通元组：不知道每个位置的含义
type Point = [number, number]

const p1: Point = [10, 20]
// 哪个是 x？哪个是 y？需要查文档

// 具名元组：清晰的语义
type NamedPoint = [x: number, y: number]

const p2: NamedPoint = [10, 20]
// IDE 会显示：[x: 10, y: 20]
```

**关键特性**：

- **标签仅用于文档**：不影响类型兼容性
- **提升 IDE 体验**：鼠标悬停显示标签
- **改善可读性**：无需注释即可理解
- **类型安全不变**：仍然是位置访问

## 4. 🤔 如何声明具名元组？

### 4.1. 基本语法

```ts
// 语法：[label: Type, ...]
type User = [name: string, age: number, isActive: boolean]

const user: User = ['Alice', 25, true]

// IDE 提示：
// user[0] → name: string
// user[1] → age: number
// user[2] → isActive: boolean
```

### 4.2. 与普通元组的对比

::: code-group

```ts [普通元组]
// 没有标签
type RGB = [number, number, number]

const color: RGB = [255, 0, 0]

// 不知道每个数字的含义
console.log(color[0]) // 这是 R、G 还是 B？
```

```ts [具名元组]
// 有标签
type RGB = [red: number, green: number, blue: number]

const color: RGB = [255, 0, 0]

// 清晰的语义
console.log(color[0]) // IDE 显示：red: 255
```

:::

### 4.3. 部分标签

```ts
// ❌ 不能部分标签
type Invalid = [string, age: number] // Error: Tuple members must all have names or all not have names

// ✅ 全部有标签
type Valid1 = [name: string, age: number]

// ✅ 全部无标签
type Valid2 = [string, number]
```

## 5. 🤔 具名元组的特性

### 5.1. 类型兼容性

```ts
// 标签不影响类型兼容性
type Point1 = [x: number, y: number]
type Point2 = [a: number, b: number]

const p1: Point1 = [10, 20]
const p2: Point2 = p1 // ✅ 兼容（标签不同但类型相同）

// 与无标签元组也兼容
type Point3 = [number, number]
const p3: Point3 = p1 // ✅ 兼容
```

### 5.2. 解构赋值

```ts
type User = [name: string, age: number]

const user: User = ['Alice', 25]

// 解构时可以使用任意变量名
const [userName, userAge] = user // ✅
const [n, a] = user // ✅

// 标签只是提示，不强制使用相同名称
```

### 5.3. IDE 提示

```ts
type Config = [host: string, port: number, ssl: boolean]

function connect(...config: Config) {
  // IDE 会显示参数为：host: string, port: number, ssl: boolean
}

// 调用时 IDE 提示
connect('localhost', 3000, true)
//      ↑ host       ↑ port  ↑ ssl
```

## 6. 🤔 具名元组与可选元素

### 6.1. 基本用法

```ts
// 结合可选元素
type ServerConfig = [host: string, port?: number, ssl?: boolean]

const config1: ServerConfig = ['localhost'] // ✅
const config2: ServerConfig = ['localhost', 3000] // ✅
const config3: ServerConfig = ['localhost', 3000, true] // ✅

// IDE 提示：
// config1[0] → host: string
// config1[1] → port?: number
// config1[2] → ssl?: boolean
```

### 6.2. 函数参数

```ts
// 表达可选参数
type FetchOptions = [
  url: string,
  method?: 'GET' | 'POST',
  headers?: Record<string, string>
]

function fetch(...options: FetchOptions) {
  const [url, method = 'GET', headers = {}] = options
  console.log(`${method} ${url}`, headers)
}

fetch('/api/users') // ✅
fetch('/api/users', 'POST') // ✅
fetch('/api/users', 'POST', { 'Content-Type': 'application/json' }) // ✅
```

## 7. 🤔 具名元组与剩余元素

### 7.1. 结尾的剩余元素

```ts
// 剩余元素也可以有标签
type LogParams = [message: string, ...args: any[]]

function log(...params: LogParams) {
  const [message, ...rest] = params
  console.log(message, rest)
}

log('Count:', 1, 2, 3) // ✅
log('Empty:') // ✅
```

### 7.2. 开头的剩余元素

```ts
// TypeScript 4.0+
type PathAndQuery = [...path: string[], query: string]

const route1: PathAndQuery = ['users', 'list', '?page=1'] // ✅
const route2: PathAndQuery = ['?search=query'] // ✅
```

### 7.3. 中间的剩余元素

```ts
// TypeScript 4.0+
type DataPacket = [header: string, ...payload: number[], checksum: number]

const packet: DataPacket = ['HEADER', 1, 2, 3, 99] // ✅
```

## 8. 🤔 具名元组的使用场景

### 8.1. 场景 1：函数返回值

```ts
// ❌ 不清晰
function getUserInfo(id: string): [string, number, boolean] {
  return ['Alice', 25, true]
}

const [?, ?, ?] = getUserInfo('123') // 哪个是哪个？

// ✅ 清晰
function getUserInfo(id: string): [name: string, age: number, isActive: boolean] {
  return ['Alice', 25, true]
}

// IDE 提示明确
const [name, age, isActive] = getUserInfo('123')
```

### 8.2. 场景 2：React Hooks

```ts
// useState 风格的自定义 Hook
function useCounter(
  initial = 0
): [
  count: number,
  increment: () => void,
  decrement: () => void,
  reset: () => void
] {
  let count = initial

  return [count, () => count++, () => count--, () => (count = initial)]
}

// 使用
const [count, increment, decrement, reset] = useCounter(0)
// IDE 清晰显示每个返回值的含义
```

### 8.3. 场景 3：坐标系统

```ts
// 2D 坐标
type Point2D = [x: number, y: number]

// 3D 坐标
type Point3D = [x: number, y: number, z: number]

// 极坐标
type PolarPoint = [radius: number, angle: number]

function distance(p1: Point2D, p2: Point2D): number {
  const dx = p2[0] - p1[0]
  const dy = p2[1] - p1[1]
  return Math.sqrt(dx * dx + dy * dy)
}

// 调用时 IDE 提示参数名称
distance([10, 20], [30, 40])
//       ↑x  ↑y    ↑x  ↑y
```

### 8.4. 场景 4：数据库查询结果

```ts
// 数据库行类型
type UserRow = [id: number, name: string, email: string, createdAt: Date]

function fetchUsers(): UserRow[] {
  return [
    [1, 'Alice', 'alice@example.com', new Date()],
    [2, 'Bob', 'bob@example.com', new Date()],
  ]
}

// 处理结果
const users = fetchUsers()
users.forEach(([id, name, email, createdAt]) => {
  console.log(`${id}: ${name} (${email})`)
})
```

### 8.5. 场景 5：API 响应

```ts
// API 响应格式：[data, error, metadata]
type ApiResponse<T> = [
  data: T | null,
  error: Error | null,
  meta: { timestamp: number; duration: number }
]

async function fetchUser(id: string): Promise<ApiResponse<User>> {
  try {
    const start = Date.now()
    const user = await api.getUser(id)
    const duration = Date.now() - start

    return [user, null, { timestamp: Date.now(), duration }]
  } catch (error) {
    return [null, error as Error, { timestamp: Date.now(), duration: 0 }]
  }
}

// 使用
const [data, error, meta] = await fetchUser('123')
// IDE 清晰显示每个位置的含义
```

### 8.6. 场景 6：配置元组

```ts
// 服务器配置
type ServerConfig = [
  host: string,
  port: number,
  protocol: 'http' | 'https',
  maxConnections?: number
]

function startServer(...config: ServerConfig) {
  const [host, port, protocol, maxConnections = 100] = config
  console.log(`Starting ${protocol}://${host}:${port}`)
  console.log(`Max connections: ${maxConnections}`)
}

startServer('localhost', 3000, 'https')
//          ↑ host       ↑ port ↑ protocol
```

### 8.7. 场景 7：几何计算

```ts
// 矩形：[x, y, width, height]
type Rect = [x: number, y: number, width: number, height: number]

// 圆形：[centerX, centerY, radius]
type Circle = [centerX: number, centerY: number, radius: number]

function drawRect(rect: Rect) {
  const [x, y, width, height] = rect
  console.log(`Rectangle at (${x}, ${y}) with size ${width}x${height}`)
}

function drawCircle(circle: Circle) {
  const [centerX, centerY, radius] = circle
  console.log(`Circle at (${centerX}, ${centerY}) with radius ${radius}`)
}
```

## 9. 🤔 常见错误和最佳实践

### 9.1. 错误 1：部分标签

```ts
// ❌ 不能部分标签
type Invalid = [name: string, number, boolean]
// Error: Tuple members must all have names or all not have names

// ✅ 全部有标签或全部无标签
type Valid1 = [name: string, age: number, isActive: boolean]
type Valid2 = [string, number, boolean]
```

### 9.2. 错误 2：过度依赖标签

```ts
// ⚠️ 标签不强制变量名
type Point = [x: number, y: number]

const point: Point = [10, 20]

// 可以使用任意变量名
const [a, b] = point // ✅ 合法，但不清晰
const [x, y] = point // ✅ 更好

// 标签只是提示，不是约束
```

### 9.3. 错误 3：标签命名不当

```ts
// ❌ 标签太简单
type Bad = [a: string, b: number, c: boolean]

// ✅ 标签有意义
type Good = [name: string, age: number, isActive: boolean]
```

### 9.4. 最佳实践

```ts
// ✅ 1. 使用描述性标签
type Good = [firstName: string, lastName: string, age: number]
type Bad = [str1: string, str2: string, num: number]

// ✅ 2. 函数返回值使用具名元组
function parseDate(date: string): [year: number, month: number, day: number] {
  const parts = date.split('-')
  return [+parts[0], +parts[1], +parts[2]]
}

// ✅ 3. 复杂结构使用具名元组
type HttpRequest = [
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  headers?: Record<string, string>,
  body?: any
]

// ✅ 4. 结合类型别名
type Coordinate = [x: number, y: number]
type BoundingBox = [topLeft: Coordinate, bottomRight: Coordinate]

// ✅ 5. 使用有意义的解构变量名
function process(data: [name: string, value: number]) {
  // ✅ 使用与标签对应的变量名
  const [name, value] = data

  // ⚠️ 避免使用无意义的变量名
  // const [x, y] = data
}

// ✅ 6. 文档化复杂元组
/**
 * 用户信息元组
 * @returns [用户名, 年龄, 是否激活, 注册时间]
 */
function getUserInfo(): [
  username: string,
  age: number,
  isActive: boolean,
  registeredAt: Date
] {
  return ['alice', 25, true, new Date()]
}

// ✅ 7. 避免过长的元组
// ❌ 太长，考虑使用对象
type TooLong = [
  a: string,
  b: number,
  c: boolean,
  d: string,
  e: number,
  f: boolean
]

// ✅ 使用对象更合适
interface BetterStructure {
  a: string
  b: number
  c: boolean
  d: string
  e: number
  f: boolean
}

// ✅ 8. 对于只有 2-4 个元素的结构，元组很合适
type Point = [x: number, y: number] // ✅ 合适
type RGB = [red: number, green: number, blue: number] // ✅ 合适
```

### 9.5. 何时使用具名元组 vs 对象

```ts
// ✅ 使用具名元组：
// - 固定顺序重要
// - 元素较少（2-4 个）
// - 需要数组操作（map, filter 等）
type Point = [x: number, y: number]
type RGB = [red: number, green: number, blue: number]

// ✅ 使用对象：
// - 元素较多（5+ 个）
// - 顺序不重要
// - 需要部分访问
interface User {
  id: number
  name: string
  email: string
  age: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

## 10. 🔗 引用

- [TypeScript 4.0 Release Notes - Labeled Tuple Elements][1]
- [TypeScript Handbook - Tuple Types][2]

[1]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#labeled-tuple-elements
[2]: https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types
