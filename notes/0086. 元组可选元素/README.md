# [0086. 元组可选元素](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0086.%20%E5%85%83%E7%BB%84%E5%8F%AF%E9%80%89%E5%85%83%E7%B4%A0)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是元组可选元素？](#3--什么是元组可选元素)
- [4. 🤔 如何声明可选元素？](#4--如何声明可选元素)
  - [4.1. 基本语法](#41-基本语法)
  - [4.2. 与 undefined 的对比](#42-与-undefined-的对比)
  - [4.3. 多个可选元素](#43-多个可选元素)
- [5. 🤔 可选元素的规则和限制](#5--可选元素的规则和限制)
  - [5.1. 规则 1：可选元素必须在必需元素之后](#51-规则-1可选元素必须在必需元素之后)
  - [5.2. 规则 2：可选元素影响 length 类型](#52-规则-2可选元素影响-length-类型)
  - [5.3. 规则 3：解构时的行为](#53-规则-3解构时的行为)
- [6. 🤔 可选元素的类型推断](#6--可选元素的类型推断)
  - [6.1. 自动推断](#61-自动推断)
  - [6.2. 函数返回值推断](#62-函数返回值推断)
  - [6.3. 泛型中的可选元素](#63-泛型中的可选元素)
- [7. 🤔 可选元素的使用场景](#7--可选元素的使用场景)
  - [7.1. 场景 1：函数参数元组](#71-场景-1函数参数元组)
  - [7.2. 场景 2：React Hooks 返回值](#72-场景-2react-hooks-返回值)
  - [7.3. 场景 3：坐标系统](#73-场景-3坐标系统)
  - [7.4. 场景 4：API 响应](#74-场景-4api-响应)
  - [7.5. 场景 5：配置元组](#75-场景-5配置元组)
- [8. 🤔 可选元素 vs 联合类型](#8--可选元素-vs-联合类型)
  - [8.1. 对比表](#81-对比表)
  - [8.2. 实际差异](#82-实际差异)
- [9. 🤔 常见错误和最佳实践](#9--常见错误和最佳实践)
  - [9.1. 错误 1：可选元素顺序错误](#91-错误-1可选元素顺序错误)
  - [9.2. 错误 2：误用 undefined 联合](#92-错误-2误用-undefined-联合)
  - [9.3. 错误 3：忽略 length 类型](#93-错误-3忽略-length-类型)
  - [9.4. 最佳实践](#94-最佳实践)
- [10. 🔗 引用](#10--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 元组可选元素的定义
- 可选元素的声明语法
- 类型推断规则
- 与联合类型的区别
- 实际应用场景
- 最佳实践

## 2. 🫧 评价

元组可选元素（Optional Tuple Elements）是 TypeScript 3.0 引入的特性，允许元组的某些位置可以**存在或不存在**。通过在类型后添加 `?`，可以标记元组元素为可选的。

可选元素让元组更加灵活，能够表示**长度可变但类型固定**的数据结构，例如：

- 函数参数列表（部分参数可选）
- API 响应（某些字段可能缺失）
- 配置元组（可选配置项）

理解元组可选元素，能帮助你：

1. 编写更灵活的函数签名
2. 准确描述可变长度的数据结构
3. 避免使用 `undefined` 的联合类型
4. 提高代码的可读性和类型安全

## 3. 🤔 什么是元组可选元素？

元组可选元素允许元组的某些位置**可以不存在**（而不是必须为 `undefined`）。

```ts
// 普通元组：3 个必需元素
type Point3D = [number, number, number]
const p1: Point3D = [10, 20, 30] // ✅
const p2: Point3D = [10, 20] // ❌ Error: Property '2' is missing

// 可选元素：第 3 个元素可选
type Point = [number, number, number?]
const p3: Point = [10, 20, 30] // ✅
const p4: Point = [10, 20] // ✅ 第 3 个元素可以省略
const p5: Point = [10] // ❌ Error: Property '1' is missing

// 类型
const z1: number | undefined = p3[2] // number | undefined
const z2: number | undefined = p4[2] // number | undefined
```

**关键区别**：

- **可选元素**：可以不存在（length 可以更短）
- **`undefined` 联合**：必须存在，但值可以是 `undefined`

## 4. 🤔 如何声明可选元素？

### 4.1. 基本语法

```ts
// 在类型后添加 ?
type Tuple1 = [string, number?]
type Tuple2 = [string, number?, boolean?]
type Tuple3 = [string, number, boolean?]

// 示例
const t1: Tuple1 = ['hello'] // ✅
const t2: Tuple1 = ['hello', 42] // ✅

const t3: Tuple2 = ['hello'] // ✅
const t4: Tuple2 = ['hello', 42] // ✅
const t5: Tuple2 = ['hello', 42, true] // ✅

const t6: Tuple3 = ['hello', 42] // ✅
const t7: Tuple3 = ['hello', 42, true] // ✅
const t8: Tuple3 = ['hello'] // ❌ Error: Property '1' is missing
```

### 4.2. 与 undefined 的对比

::: code-group

```ts [可选元素]
// 可选元素：可以不存在
type Tuple = [string, number?]

const t1: Tuple = ['hello'] // ✅ length = 1
const t2: Tuple = ['hello', 42] // ✅ length = 2

console.log(t1.length) // 1
console.log(t2.length) // 2
```

```ts [undefined 联合]
// undefined 联合：必须存在，但可以是 undefined
type Tuple = [string, number | undefined]

const t1: Tuple = ['hello'] // ❌ Error: Property '1' is missing
const t2: Tuple = ['hello', undefined] // ✅ length = 2
const t3: Tuple = ['hello', 42] // ✅ length = 2

console.log(t2.length) // 2
console.log(t3.length) // 2
```

:::

### 4.3. 多个可选元素

```ts
// 多个连续的可选元素
type Config = [string, number?, boolean?, string?]

const c1: Config = ['app'] // ✅
const c2: Config = ['app', 42] // ✅
const c3: Config = ['app', 42, true] // ✅
const c4: Config = ['app', 42, true, 'production'] // ✅

// 访问可选元素
const name: string = c1[0] // string
const port: number | undefined = c1[1] // number | undefined
const debug: boolean | undefined = c1[2] // boolean | undefined
const env: string | undefined = c1[3] // string | undefined
```

## 5. 🤔 可选元素的规则和限制

### 5.1. 规则 1：可选元素必须在必需元素之后

```ts
// ✅ 正确：可选元素在后
type Good1 = [string, number?]
type Good2 = [string, number, boolean?]
type Good3 = [string, number?, boolean?, string?]

// ❌ 错误：可选元素之后不能有必需元素
type Bad1 = [string, number?, boolean] // ❌ Error
type Bad2 = [string?, number] // ❌ Error
```

### 5.2. 规则 2：可选元素影响 length 类型

```ts
type Tuple1 = [string, number] // 必需 2 个
type Tuple2 = [string, number?] // 1 或 2 个
type Tuple3 = [string, number?, boolean?] // 1、2 或 3 个

const t1: Tuple1 = ['a', 1]
t1.length // 类型：2

const t2: Tuple2 = ['a']
t2.length // 类型：1 | 2

const t3: Tuple3 = ['a', 1]
t3.length // 类型：1 | 2 | 3
```

### 5.3. 规则 3：解构时的行为

```ts
type Point = [number, number, number?]

const p1: Point = [10, 20]
const p2: Point = [10, 20, 30]

// 解构
const [x1, y1, z1] = p1
// x1: number
// y1: number
// z1: number | undefined

const [x2, y2, z2] = p2
// x2: number
// y2: number
// z2: number | undefined

// 使用默认值
const [x3, y3, z3 = 0] = p1
// z3: number（有默认值）
```

## 6. 🤔 可选元素的类型推断

### 6.1. 自动推断

```ts
// TypeScript 不会自动推断可选元素
const tuple = ['hello', 42]
// 推断类型：(string | number)[]（不是元组）

// 需要显式标注或使用 as const
const tuple2 = ['hello', 42] as const
// 推断类型：readonly ["hello", 42]

// 或者显式标注
const tuple3: [string, number?] = ['hello', 42]
```

### 6.2. 函数返回值推断

```ts
// 返回可选元组
function parseCoordinate(input: string): [number, number, number?] {
  const parts = input.split(',').map(Number)

  if (parts.length === 2) {
    return [parts[0], parts[1]] // ✅ 2 个元素
  }

  return [parts[0], parts[1], parts[2]] // ✅ 3 个元素
}

const coord1 = parseCoordinate('10,20') // [number, number, number?]
const coord2 = parseCoordinate('10,20,30') // [number, number, number?]
```

### 6.3. 泛型中的可选元素

```ts
// 泛型元组
type OptionalTuple<T, U> = [T, U?]

const t1: OptionalTuple<string, number> = ['hello'] // ✅
const t2: OptionalTuple<string, number> = ['hello', 42] // ✅

// 条件可选
type MaybeWithZ<T extends any[]> = [...T, number?]

type Point2D = [number, number]
type Point3D = MaybeWithZ<Point2D> // [number, number, number?]
```

## 7. 🤔 可选元素的使用场景

### 7.1. 场景 1：函数参数元组

```ts
// 表示函数参数列表
type FunctionArgs = [string, number?, boolean?]

function createUser(...args: FunctionArgs): User {
  const [name, age = 0, isActive = true] = args

  return {
    name,
    age,
    isActive,
  }
}

// 使用
createUser('Alice') // ✅
createUser('Bob', 25) // ✅
createUser('Charlie', 30, false) // ✅
```

### 7.2. 场景 2：React Hooks 返回值

```ts
// 模拟 useState 的返回值
type StateHook<T> = [T, (value: T) => void, (() => void)?]

function useState<T>(initial: T): StateHook<T> {
  let value = initial

  const setValue = (newValue: T) => {
    value = newValue
  }

  const reset = () => {
    value = initial
  }

  return [value, setValue, reset]
}

// 使用
const [count, setCount] = useState(0)
const [name, setName, resetName] = useState('Alice')
```

### 7.3. 场景 3：坐标系统

```ts
// 2D/3D 通用坐标类型
type Coordinate = [number, number, number?]

function distance(p1: Coordinate, p2: Coordinate): number {
  const dx = p2[0] - p1[0]
  const dy = p2[1] - p1[1]
  const dz = (p2[2] ?? 0) - (p1[0] ?? 0)

  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

// 2D 点
const point2D: Coordinate = [10, 20]

// 3D 点
const point3D: Coordinate = [10, 20, 30]

distance(point2D, point3D) // ✅ 可以混合使用
```

### 7.4. 场景 4：API 响应

```ts
// API 响应：[data, error?, metadata?]
type ApiResponse<T> = [T, Error?, { timestamp: number }?]

async function fetchUser(id: string): Promise<ApiResponse<User>> {
  try {
    const user = await api.getUser(id)
    return [user, undefined, { timestamp: Date.now() }]
  } catch (error) {
    return [null as any, error as Error]
  }
}

// 使用
const [user, error, meta] = await fetchUser('123')

if (error) {
  console.error('Error:', error)
} else {
  console.log('User:', user)
  console.log('Fetched at:', meta?.timestamp)
}
```

### 7.5. 场景 5：配置元组

```ts
// 配置：[host, port?, protocol?]
type ServerConfig = [string, number?, 'http' | 'https'?]

function createServer(...config: ServerConfig) {
  const [host, port = 3000, protocol = 'http'] = config

  console.log(`Server: ${protocol}://${host}:${port}`)
}

createServer('localhost') // http://localhost:3000
createServer('localhost', 8080) // http://localhost:8080
createServer('example.com', 443, 'https') // https://example.com:443
```

## 8. 🤔 可选元素 vs 联合类型

### 8.1. 对比表

| 特性         | 可选元素       | undefined 联合           |
| ------------ | -------------- | ------------------------ |
| **语法**     | `[T, U?]`      | `[T, U \| undefined]`    |
| **length**   | 可变（1 或 2） | 固定（2）                |
| **必须提供** | 否             | 是（但可以是 undefined） |
| **语义**     | 元素可能不存在 | 元素存在但可能未定义     |
| **使用场景** | 可变长度参数   | 可能为 undefined 的值    |

### 8.2. 实际差异

::: code-group

```ts [可选元素]
type Tuple = [string, number?]

const t1: Tuple = ['hello'] // ✅
const t2: Tuple = ['hello', undefined] // ✅
const t3: Tuple = ['hello', 42] // ✅

console.log(t1.length) // 1
console.log(t2.length) // 2
console.log(t3.length) // 2

// 迭代
for (const item of t1) {
  console.log(item) // 只迭代 'hello'
}
```

```ts [undefined 联合]
type Tuple = [string, number | undefined]

const t1: Tuple = ['hello'] // ❌ Error
const t2: Tuple = ['hello', undefined] // ✅
const t3: Tuple = ['hello', 42] // ✅

console.log(t2.length) // 2
console.log(t3.length) // 2

// 迭代
for (const item of t2) {
  console.log(item) // 迭代 'hello' 和 undefined
}
```

:::

## 9. 🤔 常见错误和最佳实践

### 9.1. 错误 1：可选元素顺序错误

```ts
// ❌ 可选元素后不能有必需元素
type Bad = [string, number?, boolean]
// Error: A required element cannot follow an optional element

// ✅ 正确顺序
type Good = [string, number, boolean?]
```

### 9.2. 错误 2：误用 undefined 联合

```ts
// ❌ 想要可选，但写成了 undefined 联合
function process(args: [string, number | undefined]) {
  // 必须提供 2 个参数
}

process(['hello']) // ❌ Error

// ✅ 使用可选元素
function process(args: [string, number?]) {
  // 可以提供 1 或 2 个参数
}

process(['hello']) // ✅
process(['hello', 42]) // ✅
```

### 9.3. 错误 3：忽略 length 类型

```ts
type Tuple = [string, number?, boolean?]

function process(tuple: Tuple) {
  // ⚠️ length 类型是 1 | 2 | 3，不是 number
  if (tuple.length === 2) {
    // TypeScript 知道第 2 个元素存在
    const second: number = tuple[1] // ✅ number（不是 number | undefined）
  }

  // ❌ 不检查 length
  const third: boolean = tuple[2] // ❌ 类型是 boolean | undefined
}
```

### 9.4. 最佳实践

```ts
// ✅ 1. 使用可选元素而不是 undefined 联合表示可变长度
type Good = [string, number?]
type Bad = [string, number | undefined]

// ✅ 2. 提供默认值
function parse(input: [string, number?, boolean?]): Config {
  const [name, port = 3000, debug = false] = input
  return { name, port, debug }
}

// ✅ 3. 使用类型别名提高可读性
type Coordinate2D = [number, number]
type Coordinate3D = [number, number, number]
type Coordinate = [number, number, number?] // 通用类型

// ✅ 4. 检查 length 来确定元素存在性
function process(coord: Coordinate) {
  if (coord.length === 3) {
    const z: number = coord[2] // ✅ TypeScript 知道 z 一定存在
  }
}

// ✅ 5. 使用空值合并运算符
function getZ(coord: Coordinate): number {
  return coord[2] ?? 0 // 如果不存在，返回 0
}

// ✅ 6. 函数重载提供更精确的类型
function createPoint(x: number, y: number): [number, number]
function createPoint(x: number, y: number, z: number): [number, number, number]
function createPoint(
  x: number,
  y: number,
  z?: number
): [number, number, number?] {
  return z !== undefined ? [x, y, z] : [x, y]
}
```

## 10. 🔗 引用

- [TypeScript 3.0 Release Notes - Optional Elements in Tuple Types][1]
- [TypeScript Handbook - Tuple Types][2]

[1]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#optional-elements-in-tuple-types
[2]: https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types
