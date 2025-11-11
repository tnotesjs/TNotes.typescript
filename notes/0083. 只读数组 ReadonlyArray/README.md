# [0083. 只读数组 ReadonlyArray](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0083.%20%E5%8F%AA%E8%AF%BB%E6%95%B0%E7%BB%84%20ReadonlyArray)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是 ReadonlyArray？](#3--什么是-readonlyarray)
- [4. 🆚 `ReadonlyArray<T>` vs. `Array<T>`](#4--readonlyarrayt-vs-arrayt)
  - [4.1. 操作层面](#41-操作层面)
  - [4.2. 类型兼容性层面](#42-类型兼容性层面)
- [5. 🤔 如何声明只读数组？](#5--如何声明只读数组)
  - [5.1. 方式 1：ReadonlyArray 泛型](#51-方式-1readonlyarray-泛型)
  - [5.2. 方式 2：readonly 修饰符（推荐）](#52-方式-2readonly-修饰符推荐)
  - [5.3. 方式 3：const 断言](#53-方式-3const-断言)
  - [5.4. 三种方式对比](#54-三种方式对比)
- [6. 🤔 ReadonlyArray 的使用场景](#6--readonlyarray-的使用场景)
  - [6.1. 场景 1：函数参数（防止意外修改）](#61-场景-1函数参数防止意外修改)
  - [6.2. 场景 2：配置对象](#62-场景-2配置对象)
  - [6.3. 场景 3：React 组件 Props](#63-场景-3react-组件-props)
  - [6.4. 场景 4：类的公共属性](#64-场景-4类的公共属性)
  - [6.5. 场景 5：Redux State](#65-场景-5redux-state)
- [7. 🤔 如何处理只读数组的修改需求？](#7--如何处理只读数组的修改需求)
  - [7.1. 方法 1：创建副本后修改](#71-方法-1创建副本后修改)
  - [7.2. 方法 2：使用不可变操作](#72-方法-2使用不可变操作)
  - [7.3. 方法 3：类型断言（不推荐）](#73-方法-3类型断言不推荐)
- [8. 🤔 常见错误和最佳实践](#8--常见错误和最佳实践)
  - [8.1. 错误 1：浅只读](#81-错误-1浅只读)
  - [8.2. 错误 2：const 断言的误解](#82-错误-2const-断言的误解)
  - [8.3. 最佳实践](#83-最佳实践)
- [9. 🔗 引用](#9--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- ReadonlyArray 的定义和用途
- 只读数组的声明方式
- 与普通数组的区别
- 类型兼容性规则
- 实际应用场景
- 修改只读数组的方法

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

### 5.1. 方式 1：ReadonlyArray 泛型

```ts
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

### 5.2. 方式 2：readonly 修饰符（推荐）

```ts
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

### 5.3. 方式 3：const 断言

```ts
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

### 5.4. 三种方式对比

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

## 6. 🤔 ReadonlyArray 的使用场景

### 6.1. 场景 1：函数参数（防止意外修改）

```ts
// ❌ 不好：函数可能修改参数
function process(items: string[]): void {
  items.sort() // 修改了调用者的数组！
  items.forEach((item) => console.log(item))
}

const myItems = ['c', 'a', 'b']
process(myItems)
console.log(myItems) // ['a', 'b', 'c'] - 被修改了！

// ✅ 好：明确表示不会修改
function processReadonly(items: readonly string[]): void {
  // items.sort() // ❌ Error: 编译器阻止修改

  // 如果需要排序，创建副本
  const sorted = [...items].sort()
  sorted.forEach((item) => console.log(item))
}

const myItems2 = ['c', 'a', 'b']
processReadonly(myItems2)
console.log(myItems2) // ['c', 'a', 'b'] - 未被修改
```

### 6.2. 场景 2：配置对象

```ts
// ✅ 配置不应该被修改
const CONFIG = {
  apiEndpoints: ['https://api1.com', 'https://api2.com'],
  retryAttempts: 3,
  timeout: 5000,
} as const

// CONFIG.apiEndpoints 是 readonly ["https://api1.com", "https://api2.com"]

function makeRequest(endpoint: string) {
  // CONFIG.apiEndpoints.push('https://api3.com') // ❌ Error
  console.log(endpoint)
}
```

### 6.3. 场景 3：React 组件 Props

```tsx
interface ListProps {
  // ✅ 防止子组件修改父组件的数组
  items: readonly string[]
  onItemClick?: (item: string) => void
}

function List({ items, onItemClick }: ListProps) {
  // items.push('new') // ❌ Error

  return (
    <ul>
      {items.map(item => (
        <li key={item} onClick={() => onItemClick?.(item)}>
          {item}
        </li>
      ))}
    </ul>
  )
}

// 使用
const myItems = ['Apple', 'Banana', 'Cherry']
<List items={myItems} />
// myItems 不会被 List 组件修改
```

### 6.4. 场景 4：类的公共属性

```ts
class User {
  private _roles: string[]

  constructor(roles: string[]) {
    this._roles = roles
  }

  // ✅ 返回只读数组，防止外部修改
  get roles(): readonly string[] {
    return this._roles
  }

  addRole(role: string): void {
    this._roles.push(role)
  }
}

const user = new User(['user', 'admin'])
const roles = user.roles

// roles.push('superadmin') // ❌ Error: 不能修改
user.addRole('superadmin') // ✅ 通过方法修改
```

### 6.5. 场景 5：Redux State

```ts
interface State {
  readonly users: readonly User[]
  readonly posts: readonly Post[]
}

// Reducer 不能直接修改 state
function reducer(state: State, action: Action): State {
  // state.users.push(newUser) // ❌ Error

  // ✅ 创建新状态
  return {
    ...state,
    users: [...state.users, newUser],
  }
}
```

## 7. 🤔 如何处理只读数组的修改需求？

### 7.1. 方法 1：创建副本后修改

```ts
const readonly: readonly number[] = [1, 2, 3]

// ✅ 扩展运算符
const mutable = [...readonly]
mutable.push(4) // ✅ [1, 2, 3, 4]

// ✅ Array.from
const mutable2 = Array.from(readonly)
mutable2.push(5) // ✅

// ✅ slice
const mutable3 = readonly.slice()
mutable3.push(6) // ✅
```

### 7.2. 方法 2：使用不可变操作

```ts
const numbers: readonly number[] = [1, 2, 3]

// ✅ 添加元素（返回新数组）
const added = [...numbers, 4] // [1, 2, 3, 4]

// ✅ 删除元素
const removed = numbers.filter((n) => n !== 2) // [1, 3]

// ✅ 修改元素
const updated = numbers.map((n) => (n === 2 ? 20 : n)) // [1, 20, 3]

// ✅ 插入元素
const inserted = [...numbers.slice(0, 1), 99, ...numbers.slice(1)] // [1, 99, 2, 3]

// ✅ 排序
const sorted = [...numbers].sort((a, b) => b - a) // [3, 2, 1]
```

### 7.3. 方法 3：类型断言（不推荐）

```ts
const readonly: readonly number[] = [1, 2, 3]

// ⚠️ 绕过类型检查（危险）
const mutable = readonly as number[]
mutable.push(4) // 编译通过，但破坏了不可变性

// 这会影响原始数组（如果它们引用同一个对象）
console.log(readonly) // [1, 2, 3, 4] - 被修改了！
```

## 8. 🤔 常见错误和最佳实践

### 8.1. 错误 1：浅只读

```ts
interface User {
  id: number
  roles: string[]
}

const users: readonly User[] = [{ id: 1, roles: ['admin'] }]

// ❌ 数组是只读的，但元素不是
users.push({ id: 2, roles: ['user'] }) // ❌ Error

// ⚠️ 但可以修改元素的属性
users[0].roles.push('superadmin') // ✅ 允许（浅只读）

// ✅ 解决方案：深度只读
interface User {
  readonly id: number
  readonly roles: readonly string[]
}

const users: readonly User[] = [{ id: 1, roles: ['admin'] }]

users[0].roles.push('superadmin') // ❌ Error
```

### 8.2. 错误 2：const 断言的误解

```ts
// ⚠️ const 不会使数组只读
const numbers = [1, 2, 3]
numbers.push(4) // ✅ 允许

// ✅ as const 才会使数组只读
const readonlyNumbers = [1, 2, 3] as const
readonlyNumbers.push(4) // ❌ Error
```

### 8.3. 最佳实践

```ts
// ✅ 1. 函数参数默认使用只读
function process(items: readonly string[]): void {
  // 不修改参数
}

// ✅ 2. 返回值考虑使用只读
function getConfig(): readonly Config[] {
  return CONFIG
}

// ✅ 3. 需要修改时创建副本
function addItem(items: readonly string[], newItem: string): string[] {
  return [...items, newItem]
}

// ✅ 4. 类的公共数组属性使用只读
class Store {
  get items(): readonly Item[] {
    return this._items
  }
}

// ✅ 5. 配置常量使用 as const
const ROUTES = ['/home', '/about', '/contact'] as const
```

## 9. 🔗 引用

- [TypeScript Handbook - readonly][1]
- [TypeScript 3.4 - readonly 修饰符][2]

[1]: https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties
[2]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions
