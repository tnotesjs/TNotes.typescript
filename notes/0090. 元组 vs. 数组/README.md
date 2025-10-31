# [0090. 元组 vs. 数组](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0090.%20%E5%85%83%E7%BB%84%20vs.%20%E6%95%B0%E7%BB%84)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 元组和数组的核心区别](#3--元组和数组的核心区别)
  - [3.1. 对比表](#31-对比表)
  - [3.2. 可视化对比](#32-可视化对比)
- [4. 🤔 类型定义的差异](#4--类型定义的差异)
  - [4.1. 数组类型定义](#41-数组类型定义)
  - [4.2. 元组类型定义](#42-元组类型定义)
- [5. 🤔 类型安全性对比](#5--类型安全性对比)
  - [5.1. 长度检查](#51-长度检查)
  - [5.2. 索引访问类型](#52-索引访问类型)
  - [5.3. 类型推断](#53-类型推断)
- [6. 🤔 操作方法的差异](#6--操作方法的差异)
  - [6.1. 修改方法](#61-修改方法)
  - [6.2. 读取方法](#62-读取方法)
- [7. 🤔 使用场景选择](#7--使用场景选择)
  - [7.1. 数组的使用场景](#71-数组的使用场景)
  - [7.2. 元组的使用场景](#72-元组的使用场景)
  - [7.3. 错误的使用场景](#73-错误的使用场景)
- [8. 🤔 性能考虑](#8--性能考虑)
  - [8.1. 运行时表现](#81-运行时表现)
  - [8.2. 编译后的代码](#82-编译后的代码)
  - [8.3. 内存占用](#83-内存占用)
- [9. 🤔 何时使用元组 vs 数组](#9--何时使用元组-vs-数组)
  - [9.1. 决策流程图](#91-决策流程图)
  - [9.2. 选择建议](#92-选择建议)
  - [9.3. 混合使用](#93-混合使用)
  - [9.4. 特殊情况](#94-特殊情况)
- [10. 🔗 引用](#10--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 元组和数组的定义差异
- 类型安全性对比
- 操作方法的区别
- 使用场景分析
- 性能影响
- 选择建议

## 2. 🫧 评价

元组（Tuple）和数组（Array）是 TypeScript 中两种重要的集合类型，虽然在运行时它们都是 JavaScript 数组，但在类型系统层面有本质区别：

- 数组：同类型元素的可变长度集合
- 元组：不同类型元素的固定长度集合

理解它们的区别，能帮助你：

1. 选择正确的数据结构
2. 编写更类型安全的代码
3. 提升代码的可读性
4. 避免运行时错误

本节将系统对比元组和数组的差异，帮助你在实际开发中做出正确选择。

## 3. 🤔 元组和数组的核心区别

### 3.1. 对比表

| 特性        | 元组           | 数组                        |
| ----------- | -------------- | --------------------------- |
| 长度        | 固定           | 可变                        |
| 元素类型    | 可以不同       | 必须相同                    |
| length 类型 | 精确字面量     | `number`                    |
| 索引访问    | 精确类型       | 联合类型或 `T \| undefined` |
| 使用场景    | 固定结构的数据 | 列表、集合                  |
| 语法        | `[T, U, V]`    | `T[]` 或 `Array<T>`         |

### 3.2. 可视化对比

```ts
// 数组：可变长度，同类型
const numbers: number[] = [1, 2, 3]
numbers.push(4) // ✅ 可以添加
numbers.length // 类型：number

// 元组：固定长度，不同类型
const tuple: [string, number] = ['hello', 42]
tuple.push(true) // ❌ Error: Argument of type 'boolean' is not assignable
tuple.length // 类型：2（字面量）
```

## 4. 🤔 类型定义的差异

### 4.1. 数组类型定义

```ts
// ✅ 数组：所有元素类型相同
const numbers: number[] = [1, 2, 3, 4, 5]
const strings: Array<string> = ['a', 'b', 'c']

// 联合类型数组
const mixed: (string | number)[] = [1, 'two', 3, 'four']

// 对象数组
interface User {
  id: number
  name: string
}
const users: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
]
```

### 4.2. 元组类型定义

```ts
// ✅ 元组：每个位置类型可以不同
const point: [number, number] = [10, 20]
const user: [string, number, boolean] = ['Alice', 25, true]

// 具名元组
const config: [host: string, port: number] = ['localhost', 3000]

// 可选元素
const optional: [string, number?] = ['hello']

// 剩余元素
const rest: [string, ...number[]] = ['count', 1, 2, 3]

// 只读元组
const readonly: readonly [number, number] = [10, 20]
```

## 5. 🤔 类型安全性对比

### 5.1. 长度检查

::: code-group

```ts [数组]
// 数组：长度不固定
const arr: number[] = [1, 2, 3]

arr.length // 类型：number（不精确）

// ⚠️ 可以任意改变长度
arr.push(4) // ✅
arr.pop() // ✅
arr.length = 10 // ✅

// ⚠️ 访问越界不会报错
const value = arr[100] // 类型：number | undefined（宽松）
```

```ts [元组]
// 元组：长度固定
const tuple: [number, number, number] = [1, 2, 3]

tuple.length // 类型：3（精确）

// ❌ 不能改变长度
tuple.push(4) // Error: Property 'push' does not exist
tuple.pop() // Error: Property 'pop' does not exist
tuple.length = 10 // Error: Cannot assign to 'length'

// ✅ 访问越界会报错
const value = tuple[3] // Error: Tuple type has no element at index '3'
```

:::

### 5.2. 索引访问类型

::: code-group

```ts [数组]
// 数组：索引访问返回 T | undefined
const arr: string[] = ['a', 'b', 'c']

const first = arr[0] // 类型：string | undefined
const second = arr[1] // 类型：string | undefined
const tenth = arr[10] // 类型：string | undefined（编译通过）

// ⚠️ 需要运行时检查
if (first) {
  console.log(first.toUpperCase()) // 必须检查
}
```

```ts [元组]
// 元组：索引访问返回精确类型
const tuple: [string, number, boolean] = ['hello', 42, true]

const first = tuple[0] // 类型：string（精确）
const second = tuple[1] // 类型：number（精确）
const third = tuple[2] // 类型：boolean（精确）
const fourth = tuple[3] // Error: Tuple type has no element at index '3'

// ✅ 不需要额外检查
console.log(first.toUpperCase()) // ✅ 直接使用
```

:::

### 5.3. 类型推断

::: code-group

```ts [数组]
// 数组：推断为宽松类型
const arr = [1, 2, 3]
// 类型：number[]

const mixed = [1, 'two', true]
// 类型：(string | number | boolean)[]

// 添加不同类型元素
arr.push('string') // ❌ Error
mixed.push('three') // ✅
mixed.push(4) // ✅
mixed.push(false) // ✅
```

```ts [元组]
// 元组：需要显式声明或使用 as const
const tuple1 = [1, 2, 3]
// 类型：number[]（不是元组！）

const tuple2: [number, number, number] = [1, 2, 3]
// 类型：[number, number, number]

const tuple3 = [1, 2, 3] as const
// 类型：readonly [1, 2, 3]
```

:::

## 6. 🤔 操作方法的差异

### 6.1. 修改方法

::: code-group

```ts [数组]
const arr: number[] = [1, 2, 3]

// ✅ 所有修改方法都可用
arr.push(4) // ✅ [1, 2, 3, 4]
arr.pop() // ✅ [1, 2, 3]
arr.shift() // ✅ [2, 3]
arr.unshift(0) // ✅ [0, 2, 3]
arr.splice(1, 1) // ✅ [0, 3]
arr.reverse() // ✅ [3, 0]
arr.sort() // ✅ [0, 3]
```

```ts [元组]
type Triple = [number, number, number]
const tuple: Triple = [1, 2, 3]

// ❌ 修改方法不可用
tuple.push(4) // Error
tuple.pop() // Error
tuple.shift() // Error
tuple.unshift(0) // Error
tuple.splice(1, 1) // Error
tuple.reverse() // Error
tuple.sort() // Error

// ✅ 只能索引赋值（不改变长度）
tuple[0] = 10 // ✅
tuple[1] = 20 // ✅
```

:::

### 6.2. 读取方法

::: code-group

```ts [数组]
const arr: number[] = [1, 2, 3, 4, 5]

// ✅ 所有读取方法都可用
arr.slice(1, 3) // ✅ [2, 3]
arr.concat([6, 7]) // ✅ [1, 2, 3, 4, 5, 6, 7]
arr.join(',') // ✅ '1,2,3,4,5'
arr.indexOf(3) // ✅ 2
arr.includes(4) // ✅ true
arr.find((x) => x > 2) // ✅ 3
arr.filter((x) => x > 2) // ✅ [3, 4, 5]
arr.map((x) => x * 2) // ✅ [2, 4, 6, 8, 10]
arr.reduce((a, b) => a + b, 0) // ✅ 15
```

```ts [元组]
const tuple: [number, number, number] = [1, 2, 3]

// ✅ 读取方法也可用
tuple.slice(1, 3) // ✅ [2, 3]，但返回 number[]
tuple.concat([4, 5]) // ✅ [1, 2, 3, 4, 5]，返回 number[]
tuple.join(',') // ✅ '1,2,3'
tuple.indexOf(2) // ✅ 1
tuple.includes(3) // ✅ true

// ⚠️ 返回类型可能丢失元组信息
tuple.map((x) => x * 2) // 类型：number[]（不是元组）
tuple.filter((x) => x > 1) // 类型：number[]（不是元组）
```

:::

## 7. 🤔 使用场景选择

### 7.1. 数组的使用场景

```ts
// ✅ 场景 1：列表数据（长度可变）
const userIds: number[] = [1, 2, 3, 4, 5]

// ✅ 场景 2：同类型集合
const products: Product[] = [
  { id: 1, name: 'Laptop' },
  { id: 2, name: 'Phone' },
]

// ✅ 场景 3：需要动态添加/删除
const todoList: string[] = []
todoList.push('Task 1')
todoList.push('Task 2')

// ✅ 场景 4：需要数组方法
const scores: number[] = [85, 90, 78, 92]
const average = scores.reduce((a, b) => a + b) / scores.length
```

### 7.2. 元组的使用场景

```ts
// ✅ 场景 1：固定结构的数据
type Point = [x: number, y: number]
const point: Point = [10, 20]

// ✅ 场景 2：函数返回多个值
function getUser(id: string): [User, Error | null] {
  try {
    const user = fetchUser(id)
    return [user, null]
  } catch (error) {
    return [null as any, error as Error]
  }
}

// ✅ 场景 3：不同类型的组合
type UserInfo = [name: string, age: number, isActive: boolean]
const user: UserInfo = ['Alice', 25, true]

// ✅ 场景 4：React Hooks 风格 API
function useState<T>(initial: T): [T, (value: T) => void] {
  let value = initial
  return [
    value,
    (newValue: T) => {
      value = newValue
    },
  ]
}

// ✅ 场景 5：坐标系统
type RGB = [red: number, green: number, blue: number]
const color: RGB = [255, 0, 0]
```

### 7.3. 错误的使用场景

```ts
// ❌ 不要用数组表示固定结构
const user: any[] = ['Alice', 25, true] // 类型不安全
user[0] = 123 // ✅ 编译通过但不合理

// ✅ 应该用元组
const userTuple: [string, number, boolean] = ['Alice', 25, true]
userTuple[0] = 123 // ❌ Error

// ❌ 不要用元组表示列表
const scores: [number, number, number] = [85, 90, 78] // 不灵活
// 如果需要添加第 4 个分数？

// ✅ 应该用数组
const scoresList: number[] = [85, 90, 78]
scoresList.push(92) // ✅ 灵活
```

## 8. 🤔 性能考虑

### 8.1. 运行时表现

```ts
// 元组和数组在运行时都是 JavaScript 数组
const arr: number[] = [1, 2, 3]
const tuple: [number, number, number] = [1, 2, 3]

console.log(Array.isArray(arr)) // true
console.log(Array.isArray(tuple)) // true

// 性能完全相同
arr[0] === tuple[0] // 都是 O(1) 访问
```

### 8.2. 编译后的代码

```ts
// TypeScript 代码
const arr: number[] = [1, 2, 3]
const tuple: [number, number, number] = [1, 2, 3]

// 编译后（完全相同）
const arr = [1, 2, 3]
const tuple = [1, 2, 3]
```

### 8.3. 内存占用

```ts
// 内存占用相同
const arr: number[] = [1, 2, 3]
const tuple: [number, number, number] = [1, 2, 3]

// 都是 JavaScript 数组，没有额外开销
```

结论：性能不是选择依据，应该基于类型安全和语义来选择。

## 9. 🤔 何时使用元组 vs 数组

### 9.1. 决策流程图

```
开始
  ↓
元素数量固定吗？
  ├─ 是 → 元素类型相同吗？
  │       ├─ 是 → 需要修改吗？
  │       │       ├─ 是 → 数组 (const arr: T[])
  │       │       └─ 否 → 元组或数组都可以
  │       └─ 否 → 元组 (const tuple: [T, U, V])
  └─ 否 → 数组 (const arr: T[])
```

### 9.2. 选择建议

```ts
// ✅ 使用元组：
// 1. 固定数量的元素
type Point = [number, number]

// 2. 不同类型的元素
type User = [string, number, boolean]

// 3. 函数返回多个值
function divmod(a: number, b: number): [quotient: number, remainder: number] {
  return [Math.floor(a / b), a % b]
}

// 4. React Hooks 风格
function useToggle(): [boolean, () => void] {
  // ...
}

// 5. 配置参数（少量固定）
type ServerConfig = [host: string, port: number, ssl: boolean]

// ✅ 使用数组：
// 1. 可变数量的元素
const items: string[] = []
items.push('new item')

// 2. 同类型集合
const numbers: number[] = [1, 2, 3, 4, 5]

// 3. 需要数组方法
const scores: number[] = [85, 90, 78]
const average = scores.reduce((a, b) => a + b) / scores.length

// 4. 列表数据
const users: User[] = fetchUsers()

// 5. 迭代处理
const words: string[] = ['hello', 'world']
words.forEach((word) => console.log(word))
```

### 9.3. 混合使用

```ts
// ✅ 元组的数组
const points: [number, number][] = [
  [10, 20],
  [30, 40],
  [50, 60],
]

// ✅ 元组包含数组
type Data = [name: string, values: number[]]
const data: Data = ['scores', [85, 90, 78]]

// ✅ 数组转元组（类型断言）
const arr = [1, 2, 3]
const tuple = arr as [number, number, number]
```

### 9.4. 特殊情况

```ts
// 场景：2-4 个元素，结构固定
// 选择：元组（更精确）
type RGB = [red: number, green: number, blue: number]

// 场景：5+ 个元素，结构固定
// 选择：对象（更清晰）
interface User {
  id: number
  name: string
  email: string
  age: number
  isActive: boolean
}

// 场景：元素数量可能变化
// 选择：数组（更灵活）
const items: string[] = []

// 场景：需要解构，顺序重要
// 选择：元组（更明确）
const [x, y] = getCoordinates() // 清晰

// 场景：需要遍历，顺序不重要
// 选择：数组（更自然）
users.forEach((user) => console.log(user.name))
```

## 10. 🔗 引用

- [TypeScript Handbook - Tuple Types][1]
- [TypeScript Handbook - Array Types][2]
- [TypeScript Deep Dive - Tuple vs Array][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types
[2]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays
[3]: https://basarat.gitbook.io/typescript/type-system/tuple
