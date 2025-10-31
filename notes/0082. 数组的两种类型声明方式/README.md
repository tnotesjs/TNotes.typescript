# [0082. 数组的两种类型声明方式](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0082.%20%E6%95%B0%E7%BB%84%E7%9A%84%E4%B8%A4%E7%A7%8D%E7%B1%BB%E5%9E%8B%E5%A3%B0%E6%98%8E%E6%96%B9%E5%BC%8F)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 数组的两种类型声明方式是什么？](#3--数组的两种类型声明方式是什么)
  - [3.1. 方式 1：方括号语法（`T[]`）](#31-方式-1方括号语法t)
  - [3.2. 方式 2：泛型语法（`Array<T>`）](#32-方式-2泛型语法arrayt)
- [4. 🤔 两种方式有什么区别？](#4--两种方式有什么区别)
  - [4.1. 对比表](#41-对比表)
  - [4.2. 功能等价性](#42-功能等价性)
  - [4.3. 复杂类型的差异](#43-复杂类型的差异)
  - [4.4. JSX 中的差异](#44-jsx-中的差异)
- [5. 🤔 哪种方式更好？](#5--哪种方式更好)
  - [5.1. 推荐原则](#51-推荐原则)
  - [5.2. ESLint 规则](#52-eslint-规则)
  - [5.3. 社区实践](#53-社区实践)
- [6. 🤔 特殊场景的选择](#6--特殊场景的选择)
  - [6.1. 场景 1：多维数组](#61-场景-1多维数组)
  - [6.2. 场景 2：元组](#62-场景-2元组)
  - [6.3. 场景 3：只读数组](#63-场景-3只读数组)
  - [6.4. 场景 4：类型别名](#64-场景-4类型别名)
- [7. 🤔 常见错误和最佳实践](#7--常见错误和最佳实践)
  - [7.1. 错误 1：联合类型的括号遗漏](#71-错误-1联合类型的括号遗漏)
  - [7.2. 错误 2：函数类型数组的括号](#72-错误-2函数类型数组的括号)
  - [7.3. 错误 3：只读数组的修改](#73-错误-3只读数组的修改)
  - [7.4. 最佳实践](#74-最佳实践)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 数组的两种类型声明语法
- 语法差异和使用场景
- JSX 兼容性问题
- 多维数组的声明
- 最佳实践建议

## 2. 🫧 评价

TypeScript 提供了两种声明数组类型的方式：**方括号语法**（`T[]`）和**泛型语法**（`Array<T>`）。虽然它们在功能上完全等价，但在实际使用中有细微差异。

**方括号语法**简洁直观，是 TypeScript 社区最常用的方式。**泛型语法**更加明确，在某些场景下（如 JSX）是唯一选择。

理解这两种方式的差异，能帮助你：

1. 在合适的场景选择正确的语法
2. 避免 JSX 中的语法冲突
3. 编写更易读的类型声明
4. 理解 TypeScript 的类型系统设计

## 3. 🤔 数组的两种类型声明方式是什么？

### 3.1. 方式 1：方括号语法（`T[]`）

```ts
// 基础类型数组
const numbers: number[] = [1, 2, 3]
const strings: string[] = ['a', 'b', 'c']
const booleans: boolean[] = [true, false]

// 对象类型数组
interface User {
  id: number
  name: string
}

const users: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
]

// 联合类型数组
const mixed: (string | number)[] = [1, 'two', 3, 'four']

// 只读数组
const readonlyNumbers: readonly number[] = [1, 2, 3]
```

### 3.2. 方式 2：泛型语法（`Array<T>`）

```ts
// 基础类型数组
const numbers: Array<number> = [1, 2, 3]
const strings: Array<string> = ['a', 'b', 'c']
const booleans: Array<boolean> = [true, false]

// 对象类型数组
interface User {
  id: number
  name: string
}

const users: Array<User> = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
]

// 联合类型数组
const mixed: Array<string | number> = [1, 'two', 3, 'four']

// 只读数组
const readonlyNumbers: ReadonlyArray<number> = [1, 2, 3]
```

## 4. 🤔 两种方式有什么区别？

### 4.1. 对比表

| 特性                | `T[]`       | `Array<T>`  |
| ------------------- | ----------- | ----------- |
| **简洁性**          | ✅ 更简洁   | ❌ 稍冗长   |
| **可读性**          | ✅ 直观     | ✅ 明确     |
| **JSX 兼容**        | ⚠️ 可能冲突 | ✅ 完全兼容 |
| **复杂类型**        | ⚠️ 需要括号 | ✅ 更清晰   |
| **社区偏好**        | ✅ 主流     | ❌ 较少     |
| **TypeScript 官方** | ✅ 推荐     | -           |

### 4.2. 功能等价性

```ts
// 完全等价
type A = number[]
type B = Array<number>

// 类型检查结果相同
const a: A = [1, 2, 3]
const b: B = [1, 2, 3]

a[0] = 4 // ✅
b[0] = 4 // ✅

// 编译后的 JavaScript 完全相同
```

### 4.3. 复杂类型的差异

::: code-group

```ts [联合类型数组]
// ❌ 括号位置容易混淆
type A = string | number[] // string | number[] 还是 (string | number)[]？

// ✅ 明确：字符串或数字数组
type B = string | number[]

// ✅ 明确：字符串或数字的数组
type C = (string | number)[]

// 使用泛型语法更清晰
type D = Array<string | number> // 一眼就看出是联合类型的数组
```

```ts [函数类型数组]
// ⚠️ 需要括号
type FunctionArray1 = (() => void)[]

// ✅ 泛型语法更清晰
type FunctionArray2 = Array<() => void>

// 对比
const funcs1: FunctionArray1 = [() => console.log('a'), () => console.log('b')]

const funcs2: FunctionArray2 = [() => console.log('a'), () => console.log('b')]
```

:::

### 4.4. JSX 中的差异

```tsx
// ❌ 在 JSX 中，<> 会被解析为标签
function Component<T>() {
  // 语法错误：JSX 无法区分泛型和标签
  const arr: T[] = [] // ✅ 可以
  const arr2: Array<T> = [] // ✅ 可以

  // 在 JSX 返回值中
  return (
    <div>
      {/* ❌ 错误：<T> 被当作标签 */}
      {/* const x: T[] = [] */}

      {/* ✅ 正确：使用泛型语法 */}
      {(() => {
        const x: Array<T> = []
        return x.length
      })()}
    </div>
  )
}

// ✅ 解决方案：使用泛型语法
function GenericComponent<T>() {
  const items: Array<T> = []
  return <div>{items.length}</div>
}
```

## 5. 🤔 哪种方式更好？

### 5.1. 推荐原则

| 场景             | 推荐       | 原因                                 |
| ---------------- | ---------- | ------------------------------------ |
| **一般情况**     | `T[]`      | 简洁、主流                           |
| **JSX 文件**     | `Array<T>` | 避免语法冲突                         |
| **复杂联合类型** | `Array<T>` | 更清晰                               |
| **函数类型数组** | `Array<T>` | 避免括号嵌套                         |
| **只读数组**     | 两者皆可   | `readonly T[]` 或 `ReadonlyArray<T>` |

### 5.2. ESLint 规则

```json
// .eslintrc.json
{
  "rules": {
    "@typescript-eslint/array-type": [
      "error",
      {
        "default": "array", // 默认使用 T[]
        "readonly": "array" // readonly T[]
      }
    ]
  }
}

// 或者强制使用泛型
{
  "rules": {
    "@typescript-eslint/array-type": [
      "error",
      {
        "default": "generic", // Array<T>
        "readonly": "generic" // ReadonlyArray<T>
      }
    ]
  }
}
```

### 5.3. 社区实践

```ts
// ✅ TypeScript 官方手册推荐
const numbers: number[] = [1, 2, 3]

// ✅ Airbnb 风格指南推荐
const strings: string[] = ['a', 'b']

// ✅ Google TypeScript 风格指南推荐
const booleans: boolean[] = [true, false]

// ⚠️ 特殊场景使用泛型
const complex: Array<string | number> = [1, 'two']
```

## 6. 🤔 特殊场景的选择

### 6.1. 场景 1：多维数组

::: code-group

```ts [方括号语法]
// ✅ 直观
const matrix: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
]

// 三维数组
const cube: number[][][] = [
  [
    [1, 2],
    [3, 4],
  ],
  [
    [5, 6],
    [7, 8],
  ],
]
```

```ts [泛型语法]
// ⚠️ 嵌套较深
const matrix: Array<Array<number>> = [
  [1, 2, 3],
  [4, 5, 6],
]

// 三维数组（可读性下降）
const cube: Array<Array<Array<number>>> = [
  [
    [1, 2],
    [3, 4],
  ],
  [
    [5, 6],
    [7, 8],
  ],
]
```

:::

**推荐**：多维数组使用 `T[][]`，更简洁直观

### 6.2. 场景 2：元组

```ts
// ✅ 元组没有泛型语法，只能用方括号
type Point = [number, number]
type RGB = [number, number, number]

const point: Point = [10, 20]
const color: RGB = [255, 0, 0]

// ❌ 不存在 Tuple<number, number>
```

### 6.3. 场景 3：只读数组

::: code-group

```ts [方括号语法]
// ✅ 简洁
const numbers: readonly number[] = [1, 2, 3]

// ❌ 禁止修改
numbers.push(4) // Error: Property 'push' does not exist on type 'readonly number[]'
numbers[0] = 10 // Error: Index signature in type 'readonly number[]' only permits reading
```

```ts [泛型语法]
// ✅ 明确
const numbers: ReadonlyArray<number> = [1, 2, 3]

// ❌ 禁止修改
numbers.push(4) // Error
numbers[0] = 10 // Error
```

:::

**推荐**：看团队偏好，两者功能完全相同

### 6.4. 场景 4：类型别名

```ts
// ✅ 简洁明了
type StringArray = string[]
type UserArray = User[]

// ✅ 复杂类型更清晰
type CallbackArray = Array<(data: string) => void>
type ComplexArray = Array<{
  id: number
  callback: () => void
}>

// ⚠️ 方括号需要括号
type CallbackArray2 = ((data: string) => void)[]
```

## 7. 🤔 常见错误和最佳实践

### 7.1. 错误 1：联合类型的括号遗漏

::: code-group

```ts [❌ 错误示例]
// 错误：string | number[] 表示 "字符串 或 数字数组"
type Mixed = string | number[]

const a: Mixed = 'hello' // ✅
const b: Mixed = [1, 2, 3] // ✅
const c: Mixed = ['a', 'b'] // ❌ Error
```

```ts [✅ 正确做法]
// 正确：(string | number)[] 表示 "字符串或数字 的数组"
type Mixed = (string | number)[]

const a: Mixed = ['hello', 1, 'world', 2] // ✅
const b: Mixed = [1, 2, 3] // ✅
const c: Mixed = ['a', 'b'] // ✅

// 或使用泛型语法（更清晰）
type Mixed2 = Array<string | number>
```

:::

### 7.2. 错误 2：函数类型数组的括号

```ts
// ❌ 错误：这是一个返回数组的函数
type Wrong = () => string[]

// ✅ 正确：这是函数的数组
type Correct1 = (() => string)[]
type Correct2 = Array<() => string>

// 使用
const funcs: Correct2 = [() => 'hello', () => 'world']

funcs.forEach((fn) => console.log(fn()))
```

### 7.3. 错误 3：只读数组的修改

```ts
const numbers: readonly number[] = [1, 2, 3]

// ❌ 所有修改操作都被禁止
numbers.push(4) // Error
numbers.pop() // Error
numbers[0] = 10 // Error
numbers.sort() // Error

// ✅ 只读操作可以
const first = numbers[0] // ✅
const length = numbers.length // ✅
numbers.forEach((n) => console.log(n)) // ✅
numbers.map((n) => n * 2) // ✅ 返回新数组

// ✅ 如果需要修改，创建副本
const mutable = [...numbers]
mutable.push(4) // ✅
```

### 7.4. 最佳实践

```ts
// ✅ 1. 一般情况用方括号
const users: User[] = []

// ✅ 2. 复杂联合类型用泛型
const mixed: Array<string | number | boolean> = []

// ✅ 3. JSX 中用泛型
function Component<T>() {
  const items: Array<T> = []
  return <div>{items.length}</div>
}

// ✅ 4. 函数类型数组用泛型
const callbacks: Array<(data: string) => void> = []

// ✅ 5. 多维数组用方括号
const matrix: number[][] = [
  [1, 2],
  [3, 4],
]

// ✅ 6. 保持团队风格一致（配置 ESLint）
```

## 8. 🔗 引用

- [TypeScript Handbook - Arrays][1]
- [TypeScript Style Guide][2]
- [@typescript-eslint/array-type][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays
[2]: https://google.github.io/styleguide/tsguide.html
[3]: https://typescript-eslint.io/rules/array-type/
