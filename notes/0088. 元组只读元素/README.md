# [0088. 元组只读元素](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0088.%20%E5%85%83%E7%BB%84%E5%8F%AA%E8%AF%BB%E5%85%83%E7%B4%A0)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 什么是只读元组？](#3-什么是只读元组)
  - [3.1. 关键特性](#31-关键特性)
  - [3.2. 使用 readonly 修饰符声明只读元组](#32-使用-readonly-修饰符声明只读元组)
  - [3.3. 使用 Readonly 工具类型声明只读元组](#33-使用-readonly-工具类型声明只读元组)
  - [3.4. 使用 as const 断言声明只读元组](#34-使用-as-const-断言声明只读元组)
  - [3.5. 嵌套只读元组的声明](#35-嵌套只读元组的声明)
  - [3.6. 禁止修改操作](#36-禁止修改操作)
  - [3.7. 允许读取操作](#37-允许读取操作)
  - [3.8. length 属性只读](#38-length-属性只读)
- [4. 只读元组 vs. 只读数组](#4-只读元组-vs-只读数组)
  - [4.1. 对比表](#41-对比表)
  - [4.2. 实际对比](#42-实际对比)
  - [4.3. 类型兼容性](#43-类型兼容性)
- [5. const 断言在声明只读元组时有什么效果？](#5-const-断言在声明只读元组时有什么效果)
  - [5.1. const 断言的效果](#51-const-断言的效果)
  - [5.2. 嵌套结构深层只读](#52-嵌套结构深层只读)
- [6. 关于只读元素的一些实践建议都有哪些？](#6-关于只读元素的一些实践建议都有哪些)
- [7. 引用](#7-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 只读元组的定义和声明
- readonly 修饰符的使用
- 与只读数组的区别
- const 断言的作用
- 类型兼容性规则
- 最佳实践建议

## 2. 评价

只读元组（Readonly Tuple）是在元组类型前添加 `readonly` 修饰符，使元组的所有元素都不可修改。这是 TypeScript 类型系统提供的编译期保护，防止意外修改数据。

只读元组结合了元组的精确类型和只读的不可变性，是函数式编程和不可变数据理念的重要工具。

## 3. 什么是只读元组？

只读元组是使用 `readonly` 修饰符声明的元组类型，禁止所有修改操作。

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

### 3.1. 关键特性

- 索引访问只读：不能通过索引修改元素
- 没有修改方法：没有 `push`、`pop` 等方法
- 长度只读：`length` 属性是只读的
- 类型精确：保持元组的固定长度和类型

### 3.2. 使用 readonly 修饰符声明只读元组

```ts
// ✅ 使用 readonly 修饰符
type Point = readonly [number, number]
type RGB = readonly [number, number, number]
type User = readonly [string, number, boolean]

const point: Point = [10, 20]
const color: RGB = [255, 0, 0]
const user: User = ['Alice', 25, true]
```

### 3.3. 使用 Readonly 工具类型声明只读元组

```ts
// ✅ 使用 Readonly 包装
type Point = Readonly<[number, number]>

const point: Point = [10, 20]
// 等价于 readonly [number, number]
```

### 3.4. 使用 as const 断言声明只读元组

```ts
// ✅ 使用 as const（最严格）
const point = [10, 20] as const
// 类型：readonly [10, 20]（字面量类型）

const color = [255, 0, 0] as const
// 类型：readonly [255, 0, 0]
```

### 3.5. 嵌套只读元组的声明

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

### 3.6. 禁止修改操作

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

### 3.7. 允许读取操作

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

### 3.8. length 属性只读

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

## 4. 只读元组 vs. 只读数组

### 4.1. 对比表

| 特性        | 只读元组             | 只读数组                             |
| ----------- | -------------------- | ------------------------------------ |
| 类型        | `readonly [T, U, V]` | `readonly T[]` 或 `ReadonlyArray<T>` |
| 长度        | 固定                 | 可变                                 |
| 元素类型    | 可以不同             | 必须相同                             |
| length 类型 | 精确字面量           | `number`                             |
| 使用场景    | 固定结构             | 列表集合                             |

### 4.2. 实际对比

::: code-group

```ts [只读元组]
// 固定长度、不同类型
type Entry = readonly [string, number, boolean]

const entry: Entry = ['key', 42, true]

entry.length // 类型：3（精确）
entry[0] // 类型：string
entry[1] // 类型：number
entry[2] // 类型：boolean

// ❌ 不允许修改操作
entry[3] = 'extra' // Error
```

```ts [只读数组]
// 可变长度、相同类型
type List = readonly number[]

const list: List = [1, 2, 3]

list.length // 类型：number（不精确）
list[0] // 类型：number | undefined
list[1] // 类型：number | undefined

// ❌ 不允许修改操作
list.push(4) // Error
```

:::

### 4.3. 类型兼容性

```ts
// ✅ 只读数组 = 只读元组
type MyTuple = readonly [number, number, number]
type MyArray = readonly number[]

const tuple: MyTuple = [1, 2, 3]
const array: MyArray = tuple // ✅ 可以赋值（协变）

// ❌ 只读元组 = 只读数组
const array2: MyArray = [1, 2, 3]
const tuple2: MyTuple = array2 // ❌ Error: 长度不确定
```

## 5. const 断言在声明只读元组时有什么效果？

const 断言在声明只读元组时，会更精确地深度约束具体的类型。

可以理解为使用 const 断言的玩意儿，就相当于被冻结了，类似于一个常量。

### 5.1. const 断言的效果

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

### 5.2. 嵌套结构深层只读

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

## 6. 关于只读元素的一些实践建议都有哪些？

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
  p2: readonly [number, number],
): number {
  const dx = p2[0] - p1[0]
  const dy = p2[1] - p1[1]
  return Math.sqrt(dx * dx + dy * dy)
}

// ✅ 4. 深度只读除了 const 断言，也可以考虑封装工具类型
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

## 7. 引用

- [TypeScript Handbook - Tuple Types][1]
- [TypeScript 3.4 - const assertions][2]
- [TypeScript Handbook - readonly modifier][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types
[2]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions
[3]: https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties
