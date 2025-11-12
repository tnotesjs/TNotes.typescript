# [0089. 具名元组](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0089.%20%E5%85%B7%E5%90%8D%E5%85%83%E7%BB%84)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是具名元组？](#3--什么是具名元组)
  - [3.1. 关键特性](#31-关键特性)
  - [3.2. 声明具名元组的基本语法](#32-声明具名元组的基本语法)
  - [3.3. 具名元组与普通元组的区别](#33-具名元组与普通元组的区别)
  - [3.4. 允许部分标签](#34-允许部分标签)
  - [3.5. 允许剩余元素具名](#35-允许剩余元素具名)
- [4. 🤔 具名元组和对象如何选择？](#4--具名元组和对象如何选择)
- [5. 🤔 关于具名元组的使用都有哪些实践建议？](#5--关于具名元组的使用都有哪些实践建议)
- [6. 🔗 引用](#6--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 具名元组的定义和语法
- 标签的作用
- 最佳实践建议

## 2. 🫧 评价

具名元组（Labeled Tuple Elements）是 TypeScript 4.0 引入的特性，允许为元组的每个位置添加标签。标签仅用于文档和工具提示，不影响运行时行为或类型检查。

具名元组解决了元组类型的一个主要痛点：可读性。

## 3. 🤔 什么是具名元组？

具名元组是在元组的每个位置添加标签名称，使类型更具描述性。

```ts
// 普通元组：不知道每个位置的含义
type Point = [number, number]

const p1: Point = [10, 20]
// 哪个是 x？哪个是 y？需要查文档

// 具名元组：清晰的语义
type NamedPoint = [x: number, y: number]

const p2: NamedPoint = [10, 20]

const foo = p2[0] // IDE 会显示：(property) 0: number (x)
const bar = p2[1] // IDE 会显示：(property) 1: number (y)
```

### 3.1. 关键特性

- 标签仅用于文档：不影响类型兼容性
- 提升 IDE 体验：鼠标悬停显示标签
- 改善可读性：无需注释即可理解

### 3.2. 声明具名元组的基本语法

```ts
// 语法：[label: Type, ...]
type User = [name: string, age: number, isActive: boolean]

const user: User = ['Alice', 25, true]

// IDE 提示：
// user[0] → name: string
// user[1] → age: number
// user[2] → isActive: boolean
```

### 3.3. 具名元组与普通元组的区别

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

### 3.4. 允许部分标签

```ts
// ✅ 允许部分标签
type Valid1 = [string, age: number]

// ✅ 允许全部有标签
type Valid2 = [name: string, age: number]

// ✅ 允许全部无标签
type Valid3 = [string, number]
```

### 3.5. 允许剩余元素具名

::: code-group

```ts [结尾]
// 剩余元素也可以有标签
type LogParams = [message: string, ...args: any[]]

function log(...params: LogParams) {
  const [message, ...rest] = params
  console.log(message, rest)
}

log('Count:', 1, 2, 3) // ✅
log('Empty:') // ✅
```

```ts [开头]
type PathAndQuery = [...path: string[], query: string]

const route1: PathAndQuery = ['users', 'list', '?page=1'] // ✅
const route2: PathAndQuery = ['?search=query'] // ✅
```

```ts [中间]
type DataPacket = [header: string, ...payload: number[], checksum: number]

const packet: DataPacket = ['HEADER', 1, 2, 3, 99] // ✅
```

:::

## 4. 🤔 具名元组和对象如何选择？

具名元组的名称，就好比对象的 key 字段，给 val 添加了一个名称，让它的可读性更友好。

但是和对象不同，具名元组的名称并没有实际作用，只在 TS 类型层面提供更友好的提示。

可以根据个人习惯来选择，比如笔者就更倾向于使用对象的形式。

以下是一些决策时的参考建议：

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

## 5. 🤔 关于具名元组的使用都有哪些实践建议？

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

## 6. 🔗 引用

- [TypeScript 4.0 Release Notes - Labeled Tuple Elements][1]
- [TypeScript Handbook - Tuple Types][2]

[1]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#labeled-tuple-elements
[2]: https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types
