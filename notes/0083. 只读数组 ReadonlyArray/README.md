# [0083. 只读数组 ReadonlyArray](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0083.%20%E5%8F%AA%E8%AF%BB%E6%95%B0%E7%BB%84%20ReadonlyArray)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是 ReadonlyArray？](#3--什么是-readonlyarray)
- [4. 🆚 `ReadonlyArray<T>` vs. `Array<T>`](#4--readonlyarrayt-vs-arrayt)
  - [4.1. 操作层面](#41-操作层面)
  - [4.2. 类型兼容性层面](#42-类型兼容性层面)
- [5. 🤔 如何声明只读数组？](#5--如何声明只读数组)
- [6. 🤔 只读约束是深只读还是浅只读？](#6--只读约束是深只读还是浅只读)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- ReadonlyArray 的定义和用途
- 只读数组的声明方式
- 与普通数组的区别
- 浅只读约束

## 2. 🫧 评价

`ReadonlyArray<T>` 是 TypeScript 提供的内置类型，用于创建不可变数组。它通过类型系统阻止所有修改操作（如 `push`、`pop`、索引赋值等），从而在编译期保证数组的不可变性。

只读数组是函数式编程和不可变数据理念在 TypeScript 中的体现。它能帮助你：

1. 防止意外修改共享数据
2. 明确函数的副作用
3. 提高代码的可预测性
4. 避免并发问题

虽然 `ReadonlyArray` 只是编译期约束（运行时仍可修改），但它为代码提供了重要的类型安全保障和文档价值。

## 3. 🤔 什么是 ReadonlyArray？

`ReadonlyArray<T>` 是 TypeScript 内置的泛型类型，表示只读数组。

`ReadonlyArray<T>` 的简化版定义：

```ts
interface ReadonlyArray<T> {
  readonly length: number
  readonly [n: number]: T

  // ✅ 只读方法
  forEach(
    callbackfn: (value: T, index: number, array: readonly T[]) => void
  ): void
  map<U>(callbackfn: (value: T, index: number, array: readonly T[]) => U): U[]
  filter(
    predicate: (value: T, index: number, array: readonly T[]) => boolean
  ): T[]
  // ...更多只读方法

  // ❌ 没有修改方法
  // push(item: T): number  // 不存在
  // pop(): T | undefined   // 不存在
  // sort(): this           // 不存在
}
```

核心特性：

```ts
const numbers: ReadonlyArray<number> = [1, 2, 3]

// ✅ 读取操作
console.log(numbers[0]) // 1
console.log(numbers.length) // 3

// ❌ 修改操作（编译错误）
numbers[0] = 10 // Error: Index signature in type 'readonly number[]' only permits reading
numbers.push(4) // Error: Property 'push' does not exist on type 'readonly number[]'
numbers.pop() // Error: Property 'pop' does not exist
numbers.sort() // Error: Property 'sort' does not exist

// ✅ 返回新数组的方法
const doubled = numbers.map((n) => n * 2) // [2, 4, 6]
const filtered = numbers.filter((n) => n > 1) // [2, 3]

// 返回的数组是可读可写的。
```

## 4. 🆚 `ReadonlyArray<T>` vs. `Array<T>`

### 4.1. 操作层面

| 操作类型 | `ReadonlyArray<T>`                   | `Array<T>` |
| -------- | ------------------------------------ | ---------- |
| 读取元素 | ✅ 允许                              | ✅ 允许    |
| 修改元素 | ❌ 禁止                              | ✅ 允许    |
| 添加元素 | ❌ 禁止 (`push`, `unshift`)          | ✅ 允许    |
| 删除元素 | ❌ 禁止 (`pop`, `shift`, `splice`)   | ✅ 允许    |
| 排序     | ❌ 禁止 (`sort`, `reverse`)          | ✅ 允许    |
| 映射     | ✅ 允许 (`map`, `filter`, `slice`)   | ✅ 允许    |
| 遍历     | ✅ 允许 (`forEach`, `every`, `some`) | ✅ 允许    |

```ts
const numbers: ReadonlyArray<number> = [1, 2, 3, 4, 5]

// ✅ 不修改原数组的方法
numbers.forEach((n) => console.log(n)) // ✅
numbers.map((n) => n * 2) // ✅ [2, 4, 6, 8, 10]
numbers.filter((n) => n > 2) // ✅ [3, 4, 5]
numbers.slice(1, 3) // ✅ [2, 3]
numbers.concat([6, 7]) // ✅ [1, 2, 3, 4, 5, 6, 7]
numbers.find((n) => n > 3) // ✅ 4
numbers.findIndex((n) => n > 3) // ✅ 3
numbers.every((n) => n > 0) // ✅ true
numbers.some((n) => n > 3) // ✅ true
numbers.reduce((sum, n) => sum + n, 0) // ✅ 15

// ❌ 修改原数组的方法
numbers.push(6) // ❌ Error
numbers.pop() // ❌ Error
numbers.shift() // ❌ Error
numbers.unshift(0) // ❌ Error
numbers.splice(0, 1) // ❌ Error
numbers.sort() // ❌ Error
numbers.reverse() // ❌ Error
numbers.fill(0) // ❌ Error
```

### 4.2. 类型兼容性层面

```ts
// ✅ 普通数组可以赋值给只读数组（协变）
const mutable: number[] = [1, 2, 3]
const readonly: readonly number[] = mutable // ✅ 安全

// ❌ 只读数组不能赋值给普通数组
const readonly2: readonly number[] = [1, 2, 3]
const mutable2: number[] = readonly2 // ❌ Error
// 原因：如果允许，可能破坏不可变性
// mutable2.push(4) // 会修改 readonly2
```

## 5. 🤔 如何声明只读数组？

- 方式 1：ReadonlyArray 泛型
- 方式 2：readonly 修饰符（推荐）
- 方式 3：const 断言（声明的是只读元组，也算是特殊的只读数组）

::: code-group

```ts [1]
// 基础类型
const numbers: ReadonlyArray<number> = [1, 2, 3]
const strings: ReadonlyArray<string> = ['a', 'b', 'c']

// 对象类型
interface User {
  id: number
  name: string
}

const users: ReadonlyArray<User> = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
]

// 联合类型
const mixed: ReadonlyArray<string | number> = [1, 'two', 3, 'four']
```

```ts [2]
// ✅ 更简洁
const numbers: readonly number[] = [1, 2, 3]
const strings: readonly string[] = ['a', 'b', 'c']

// 对象类型
const users: readonly User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
]

// 联合类型
const mixed: readonly (string | number)[] = [1, 'two', 3, 'four']
```

```ts [3]
// as const 使整个结构只读
const numbers = [1, 2, 3] as const
// 类型：readonly [1, 2, 3]（只读元组）

const config = {
  colors: ['red', 'green', 'blue'],
  sizes: [10, 20, 30],
} as const
// colors 类型：readonly ["red", "green", "blue"]
// sizes 类型：readonly [10, 20, 30]
```

:::

三种方式对比：

::: code-group

```ts [ReadonlyArray T]
// ✅ 明确的泛型
const arr: ReadonlyArray<number> = [1, 2, 3]

// 类型：ReadonlyArray<number>
// 特点：明确、冗长
```

```ts [readonly T[]]
// ✅ 简洁（推荐）
const arr: readonly number[] = [1, 2, 3]

// 类型：readonly number[]
// 特点：简洁、主流
```

```ts [as const]
// ✅ 更严格（元组）
const arr = [1, 2, 3] as const

// 类型：readonly [1, 2, 3]
// 特点：字面量类型、最严格
```

:::

## 6. 🤔 只读约束是深只读还是浅只读？

浅只读

readonly 只能保证数组的第一层成员是只读的，但是无法约束更深层次的成员。

```ts
interface User {
  id: number
  roles: string[]
}

const users: readonly User[] = [{ id: 1, roles: ['admin'] }]

// ❌ 数组是只读的，但元素不是
users.push({ id: 2, roles: ['user'] }) // ❌ Error

// ⚠️ 允许修改元素的属性
users[0].roles.push('superadmin') // ✅ 允许（浅只读）

// ✅ 深度只读的写法：
interface User2 {
  readonly id: number
  readonly roles: readonly string[]
}

const users2: readonly User2[] = [{ id: 1, roles: ['admin'] }]

users2[0].roles.push('superadmin') // ❌ Error
```

## 7. 🔗 引用

- [TypeScript Handbook - readonly][1]
- [TypeScript 3.4 - readonly 修饰符][2]

[1]: https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties
[2]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions
