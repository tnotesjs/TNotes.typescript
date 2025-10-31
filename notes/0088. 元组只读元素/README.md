# [0088. 元组只读元素](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0088.%20%E5%85%83%E7%BB%84%E5%8F%AA%E8%AF%BB%E5%85%83%E7%B4%A0)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是只读元组？](#3--什么是只读元组)
- [4. 🤔 如何声明只读元组？](#4--如何声明只读元组)
  - [4.1. 方式 1：readonly 修饰符](#41-方式-1readonly-修饰符)
  - [4.2. 方式 2：Readonly 工具类型](#42-方式-2readonly-工具类型)
  - [4.3. 方式 3：as const 断言](#43-方式-3as-const-断言)
  - [4.4. 嵌套只读元组](#44-嵌套只读元组)
- [5. 🤔 只读元组的特性](#5--只读元组的特性)
  - [5.1. 禁止修改操作](#51-禁止修改操作)
  - [5.2. 允许读取操作](#52-允许读取操作)
  - [5.3. length 属性](#53-length-属性)
- [6. 🤔 只读元组 vs 只读数组](#6--只读元组-vs-只读数组)
  - [6.1. 对比表](#61-对比表)
  - [6.2. 实际对比](#62-实际对比)
  - [6.3. 类型转换](#63-类型转换)
- [7. 🤔 只读元组的使用场景](#7--只读元组的使用场景)
  - [7.1. 场景 1：函数返回值（防止修改）](#71-场景-1函数返回值防止修改)
  - [7.2. 场景 2：React Hooks](#72-场景-2react-hooks)
  - [7.3. 场景 3：配置常量](#73-场景-3配置常量)
  - [7.4. 场景 4：数据库查询结果](#74-场景-4数据库查询结果)
  - [7.5. 场景 5：类型安全的枚举替代](#75-场景-5类型安全的枚举替代)
  - [7.6. 场景 6：Redux Action](#76-场景-6redux-action)
- [8. 🤔 const 断言与只读元组](#8--const-断言与只读元组)
  - [8.1. const 断言的效果](#81-const-断言的效果)
  - [8.2. 嵌套结构](#82-嵌套结构)
  - [8.3. 函数返回值](#83-函数返回值)
- [9. 🤔 常见错误和最佳实践](#9--常见错误和最佳实践)
  - [9.1. 错误 1：浅只读](#91-错误-1浅只读)
  - [9.2. 错误 2：类型断言错误](#92-错误-2类型断言错误)
  - [9.3. 错误 3：误用 readonly 和 const](#93-错误-3误用-readonly-和-const)
  - [9.4. 最佳实践](#94-最佳实践)
- [10. 🔗 引用](#10--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 只读元组的定义和声明
- readonly 修饰符的使用
- 与只读数组的区别
- const 断言的作用
- 类型兼容性规则
- 实际应用场景

## 2. 🫧 评价

只读元组（Readonly Tuple）是在元组类型前添加 `readonly` 修饰符，使元组的所有元素都**不可修改**。这是 TypeScript 类型系统提供的**编译期保护**，防止意外修改数据。

只读元组结合了**元组的精确类型**和**只读的不可变性**，是函数式编程和不可变数据理念的重要工具。它能帮助你：

1. 防止意外修改固定结构的数据
2. 明确函数不会修改参数
3. 提供更强的类型安全保障
4. 编写更可预测的代码

理解只读元组，特别是与 `as const` 断言的配合使用，是掌握 TypeScript 高级类型的关键。

## 3. 🤔 什么是只读元组？

只读元组是使用 `readonly` 修饰符声明的元组类型，**禁止所有修改操作**。

```ts
// 普通元组：可以修改
type Point = [number, number]
const p1: Point = [10, 20]
p1[0] = 30 // ✅ 允许修改
p1.push(40) // ❌ Error: Property 'push' does not exist

// 只读元组：不能修改
type ReadonlyPoint = readonly [number, number]
const p2: ReadonlyPoint = [10, 20]
p2[0] = 30 // ❌ Error: Cannot assign to '0' because it is a read-only property
p2.push(40) // ❌ Error: Property 'push' does not exist
```

**关键特性**：

- **索引访问只读**：不能通过索引修改元素
- **没有修改方法**：没有 `push`、`pop` 等方法
- **长度只读**：`length` 属性是只读的
- **类型精确**：保持元组的固定长度和类型

## 4. 🤔 如何声明只读元组？

### 4.1. 方式 1：readonly 修饰符

```ts
// ✅ 使用 readonly 修饰符
type Point = readonly [number, number]
type RGB = readonly [number, number, number]
type User = readonly [string, number, boolean]

const point: Point = [10, 20]
const color: RGB = [255, 0, 0]
const user: User = ['Alice', 25, true]
```

### 4.2. 方式 2：Readonly 工具类型

```ts
// ✅ 使用 Readonly 包装
type Point = Readonly<[number, number]>

const point: Point = [10, 20]
// 等价于 readonly [number, number]
```

### 4.3. 方式 3：as const 断言

```ts
// ✅ 使用 as const（最严格）
const point = [10, 20] as const
// 类型：readonly [10, 20]（字面量类型）

const color = [255, 0, 0] as const
// 类型：readonly [255, 0, 0]
```

### 4.4. 嵌套只读元组

```ts
// 只读元组的元组
type Matrix = readonly (readonly number[])[]

const matrix: Matrix = [
  [1, 2, 3],
  [4, 5, 6],
]

// ❌ 不能修改
matrix[0][0] = 10 // Error
matrix.push([7, 8, 9]) // Error

// 只读元组包含对象
type Entry = readonly [string, { value: number }]

const entry: Entry = ['key', { value: 42 }]
entry[0] = 'newKey' // ❌ Error
entry[1] = { value: 100 } // ❌ Error
entry[1].value = 100 // ⚠️ 允许（浅只读）
```

## 5. 🤔 只读元组的特性

### 5.1. 禁止修改操作

```ts
type Point = readonly [number, number, number]
const point: Point = [10, 20, 30]

// ❌ 禁止索引赋值
point[0] = 100 // Error: Cannot assign to '0' because it is a read-only property

// ❌ 禁止修改方法
point.push(40) // Error: Property 'push' does not exist
point.pop() // Error: Property 'pop' does not exist
point.sort() // Error: Property 'sort' does not exist
point.reverse() // Error: Property 'reverse' does not exist
```

### 5.2. 允许读取操作

```ts
type Point = readonly [number, number, number]
const point: Point = [10, 20, 30]

// ✅ 读取操作
const x = point[0] // ✅ 10
const y = point[1] // ✅ 20
const z = point[2] // ✅ 30

// ✅ 解构
const [x1, y1, z1] = point // ✅

// ✅ 迭代
for (const value of point) {
  console.log(value) // ✅
}

// ✅ 不修改原数组的方法
const doubled = point.map((n) => n * 2) // ✅ [20, 40, 60]
const filtered = point.filter((n) => n > 15) // ✅ [20, 30]
const sum = point.reduce((a, b) => a + b, 0) // ✅ 60
```

### 5.3. length 属性

```ts
type Pair = readonly [string, number]
type Triple = readonly [string, number, boolean]

const pair: Pair = ['hello', 42]
const triple: Triple = ['hello', 42, true]

// length 是精确的字面量类型
pair.length // 类型：2
triple.length // 类型：3

// ❌ length 不能修改
pair.length = 5 // Error: Cannot assign to 'length'
```

## 6. 🤔 只读元组 vs 只读数组

### 6.1. 对比表

| 特性 | 只读元组 | 只读数组 |
| --- | --- | --- |
| **类型** | `readonly [T, U, V]` | `readonly T[]` 或 `ReadonlyArray<T>` |
| **长度** | 固定 | 可变 |
| **元素类型** | 可以不同 | 必须相同 |
| **length 类型** | 精确字面量 | `number` |
| **使用场景** | 固定结构 | 列表集合 |

### 6.2. 实际对比

::: code-group

```ts [只读元组]
// 固定长度、不同类型
type Entry = readonly [string, number, boolean]

const entry: Entry = ['key', 42, true]

entry.length // 类型：3（精确）
entry[0] // 类型：string
entry[1] // 类型：number
entry[2] // 类型：boolean

// ❌ 不能添加元素
entry[3] = 'extra' // Error
```

```ts [只读数组]
// 可变长度、相同类型
type List = readonly number[]

const list: List = [1, 2, 3]

list.length // 类型：number（不精确）
list[0] // 类型：number | undefined
list[1] // 类型：number | undefined

// ❌ 不能添加元素
list.push(4) // Error
```

:::

### 6.3. 类型转换

```ts
// 只读元组 → 只读数组
type Tuple = readonly [number, number, number]
type Array = readonly number[]

const tuple: Tuple = [1, 2, 3]
const array: Array = tuple // ✅ 可以赋值（协变）

// 只读数组 → 只读元组
const array2: Array = [1, 2, 3]
const tuple2: Tuple = array2 // ❌ Error: 长度不确定
```

## 7. 🤔 只读元组的使用场景

### 7.1. 场景 1：函数返回值（防止修改）

```ts
// ✅ 返回只读元组，防止调用者修改
function getCoordinates(): readonly [number, number] {
  return [10, 20]
}

const coords = getCoordinates()
coords[0] = 30 // ❌ Error: 不能修改

// 对比：返回普通元组（不安全）
function getBadCoordinates(): [number, number] {
  return [10, 20]
}

const badCoords = getBadCoordinates()
badCoords[0] = 30 // ✅ 允许修改（可能不是预期）
```

### 7.2. 场景 2：React Hooks

```ts
// useState 返回只读元组
function useState<T>(initial: T): readonly [T, (value: T) => void] {
  let value = initial
  const setValue = (newValue: T) => {
    value = newValue
  }
  return [value, setValue]
}

const [count, setCount] = useState(0)

// ❌ 防止意外修改
// count = 10 // 如果不是 readonly，这会编译通过但不生效
setCount(10) // ✅ 正确方式
```

### 7.3. 场景 3：配置常量

```ts
// 配置元组不应该被修改
const API_CONFIG = ['https://api.example.com', 443, true] as const
// 类型：readonly ["https://api.example.com", 443, true]

// ❌ 不能修改
API_CONFIG[0] = 'https://other.com' // Error

// 使用
function makeRequest() {
  const [host, port, useSSL] = API_CONFIG
  console.log(`${useSSL ? 'https' : 'http'}://${host}:${port}`)
}
```

### 7.4. 场景 4：数据库查询结果

```ts
// 数据库行：[id, name, email]
type UserRow = readonly [number, string, string]

function fetchUser(id: number): UserRow {
  // 模拟查询
  return [id, 'Alice', 'alice@example.com']
}

const user = fetchUser(1)
const [userId, userName, userEmail] = user

// ❌ 防止修改查询结果
user[1] = 'Bob' // Error
```

### 7.5. 场景 5：类型安全的枚举替代

```ts
// 使用只读元组作为类型安全的枚举
const STATUSES = ['pending', 'approved', 'rejected'] as const
type Status = (typeof STATUSES)[number] // 'pending' | 'approved' | 'rejected'

// 方向向量
const DIRECTIONS = [
  [0, -1], // 上
  [0, 1], // 下
  [-1, 0], // 左
  [1, 0], // 右
] as const

type Direction = (typeof DIRECTIONS)[number] // readonly [0, -1] | readonly [0, 1] | ...

function move(direction: Direction) {
  const [dx, dy] = direction
  console.log(`Moving by (${dx}, ${dy})`)
}
```

### 7.6. 场景 6：Redux Action

```ts
// Action 类型
type Action =
  | readonly ['increment']
  | readonly ['decrement']
  | readonly ['set', number]

function dispatch(action: Action) {
  const [type, ...payload] = action

  switch (type) {
    case 'increment':
      // payload: []
      break
    case 'decrement':
      // payload: []
      break
    case 'set':
      // payload: [number]
      const [value] = payload
      break
  }
}

// 使用
dispatch(['increment'] as const) // ✅
dispatch(['set', 42] as const) // ✅
```

## 8. 🤔 const 断言与只读元组

### 8.1. const 断言的效果

```ts
// 普通推断：可变元组
const point1 = [10, 20]
// 类型：number[]（不是元组！）

// as const：只读元组 + 字面量类型
const point2 = [10, 20] as const
// 类型：readonly [10, 20]

// 区别
point1[0] = 30 // ✅ 允许
point1.push(30) // ✅ 允许

point2[0] = 30 // ❌ Error
point2.push(30) // ❌ Error
```

### 8.2. 嵌套结构

```ts
// as const 递归应用到所有嵌套结构
const config = {
  server: ['localhost', 3000],
  features: ['auth', 'cache'],
  point: [10, 20],
} as const

// 类型：
// {
//   readonly server: readonly ["localhost", 3000];
//   readonly features: readonly ["auth", "cache"];
//   readonly point: readonly [10, 20];
// }

// ❌ 所有层级都是只读
config.server[0] = 'example.com' // Error
config.features.push('logging') // Error
```

### 8.3. 函数返回值

```ts
// ✅ 使用 as const 返回只读元组
function getRange() {
  return [0, 100] as const
}

const range = getRange()
// 类型：readonly [0, 100]

// ✅ 泛型函数
function tuple<T extends readonly any[]>(...args: T): T {
  return args
}

const t = tuple(1, 'hello', true)
// 类型：[number, string, boolean]
```

## 9. 🤔 常见错误和最佳实践

### 9.1. 错误 1：浅只读

```ts
// ⚠️ readonly 只影响元组本身，不影响元素
type Point = readonly [{ x: number }, { y: number }]

const point: Point = [{ x: 10 }, { y: 20 }]

// ❌ 不能替换元素
point[0] = { x: 30 } // Error

// ⚠️ 但可以修改元素的属性
point[0].x = 30 // ✅ 允许（浅只读）

// ✅ 解决方案：深度只读
type DeepReadonlyPoint = readonly [
  { readonly x: number },
  { readonly y: number }
]

const deepPoint: DeepReadonlyPoint = [{ x: 10 }, { y: 20 }]
deepPoint[0].x = 30 // ❌ Error
```

### 9.2. 错误 2：类型断言错误

```ts
// ⚠️ 类型断言可以绕过只读检查
const point = [10, 20] as readonly [number, number]
const mutable = point as [number, number] // 断言为可变

mutable[0] = 30 // ✅ 编译通过
console.log(point[0]) // 30（被修改了！）

// ✅ 避免使用类型断言绕过只读
```

### 9.3. 错误 3：误用 readonly 和 const

```ts
// ❌ const 不会使元组只读
const point = [10, 20]
point[0] = 30 // ✅ 允许

// ✅ 需要 readonly 或 as const
const readonlyPoint: readonly [number, number] = [10, 20]
readonlyPoint[0] = 30 // ❌ Error

const constPoint = [10, 20] as const
constPoint[0] = 30 // ❌ Error
```

### 9.4. 最佳实践

```ts
// ✅ 1. 函数返回值使用只读元组
function getConfig(): readonly [string, number, boolean] {
  return ['app', 3000, true]
}

// ✅ 2. 常量配置使用 as const
const CONFIG = ['prod', 'us-west-1', true] as const

// ✅ 3. 参数不需要修改时使用只读
function distance(
  p1: readonly [number, number],
  p2: readonly [number, number]
): number {
  const dx = p2[0] - p1[0]
  const dy = p2[1] - p1[1]
  return Math.sqrt(dx * dx + dy * dy)
}

// ✅ 4. 深度只读使用工具类型
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

// ✅ 5. 类型别名提高可读性
type Point = readonly [number, number]
type RGB = readonly [number, number, number]

// ✅ 6. 使用解构避免直接访问
function process(data: readonly [string, number, boolean]) {
  const [name, value, flag] = data // ✅ 清晰
  // 而不是 data[0], data[1], data[2]
}

// ✅ 7. 文档化只读意图
/**
 * @returns 只读元组 [x, y]，不应修改
 */
function getPosition(): readonly [number, number] {
  return [10, 20]
}
```

## 10. 🔗 引用

- [TypeScript Handbook - Tuple Types][1]
- [TypeScript 3.4 - const assertions][2]
- [TypeScript Handbook - readonly modifier][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types
[2]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions
[3]: https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties
