# [0108. 类型工具的本质](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0108.%20%E7%B1%BB%E5%9E%8B%E5%B7%A5%E5%85%B7%E7%9A%84%E6%9C%AC%E8%B4%A8)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 TS 内置的工具类型，比如 Record 这些，它们本质上都是泛型接口吗？](#3--ts-内置的工具类型比如-record-这些它们本质上都是泛型接口吗)
  - [3.1. 为什么使用 `type` 而不是 `interface`？](#31-为什么使用-type-而不是-interface)
  - [3.2. 常见工具类型的实现](#32-常见工具类型的实现)
  - [3.3. `type` vs `interface` 在工具类型中的对比](#33-type-vs-interface-在工具类型中的对比)
  - [3.4. 使用示例](#34-使用示例)
  - [3.5. 总结](#35-总结)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- todo

## 2. 🫧 评价

- todo

## 3. 🤔 TS 内置的工具类型，比如 Record 这些，它们本质上都是泛型接口吗？

不是。TypeScript 内置的工具类型（如 `Record`、`Partial`、`Pick` 等）本质上是**类型别名（Type Alias）**，而不是接口。

它们使用 `type` 关键字定义，结合了泛型、映射类型、条件类型等高级类型特性来实现类型转换。

### 3.1. 为什么使用 `type` 而不是 `interface`？

| 原因             | 说明                                                |
| :--------------- | :-------------------------------------------------- |
| **需要映射类型** | `interface` 不支持映射类型语法（`[K in keyof T]`）  |
| **需要条件类型** | `interface` 不支持条件类型（`T extends U ? X : Y`） |
| **需要联合类型** | `interface` 无法表示联合类型                        |
| **需要类型运算** | `type` 可以进行复杂的类型运算和组合                 |

### 3.2. 常见工具类型的实现

```ts
// Record：构造对象类型
type Record<K extends keyof any, T> = {
  [P in K]: T
}

// Partial：所有属性变为可选
type Partial<T> = {
  [P in keyof T]?: T[P]
}

// Required：所有属性变为必选
type Required<T> = {
  [P in keyof T]-?: T[P]
}

// Pick：选取部分属性
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

// Omit：排除部分属性
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>

// Exclude：从联合类型中排除
type Exclude<T, U> = T extends U ? never : T

// Extract：从联合类型中提取
type Extract<T, U> = T extends U ? T : never

// NonNullable：排除 null 和 undefined
type NonNullable<T> = T extends null | undefined ? never : T

// ReturnType：获取函数返回值类型
type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any
```

### 3.3. `type` vs `interface` 在工具类型中的对比

```ts
// ❌ interface 无法实现映射类型
// interface Partial<T> {
//   [P in keyof T]?: T[P]  // Error: 'in' 不支持
// }

// ✅ type 可以实现
type Partial<T> = {
  [P in keyof T]?: T[P]
}

// ❌ interface 无法实现条件类型
// interface ReturnType<T> = T extends (...args: any) => infer R ? R : any
// Error: 语法不支持

// ✅ type 可以实现
type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any
```

### 3.4. 使用示例

```ts
interface User {
  id: number
  name: string
  email: string
}

// 使用内置工具类型
type PartialUser = Partial<User> // 所有属性可选
type UserNameAndEmail = Pick<User, 'name' | 'email'> // 只保留 name 和 email
type UserWithoutId = Omit<User, 'id'> // 排除 id
type StringRecord = Record<string, number> // { [key: string]: number }

// 这些都是 type 别名，不是 interface
const user1: PartialUser = { name: 'Alice' } // ✅
const user2: UserNameAndEmail = { name: 'Bob', email: 'bob@example.com' } // ✅
```

### 3.5. 总结

- TypeScript 内置工具类型是**类型别名**（`type`），不是接口（`interface`）
- 它们使用了 `interface` 无法支持的高级类型特性（映射类型、条件类型等）
- 虽然它们使用泛型，但泛型不是接口独有的特性，`type` 同样支持泛型
- 在实际开发中，可以根据需求选择 `type` 或 `interface`，但对于复杂的类型转换，`type` 更加灵活
