# [0082. 数组的两种类型声明方式](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0082.%20%E6%95%B0%E7%BB%84%E7%9A%84%E4%B8%A4%E7%A7%8D%E7%B1%BB%E5%9E%8B%E5%A3%B0%E6%98%8E%E6%96%B9%E5%BC%8F)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 数组的两种类型声明方式是什么？](#3-数组的两种类型声明方式是什么)
- [4. 两种方式有什么区别？](#4-两种方式有什么区别)
  - [4.1. 对比表](#41-对比表)
  - [4.2. 功能等价性](#42-功能等价性)
  - [4.3. 复杂类型的差异](#43-复杂类型的差异)
  - [4.4. JSX 中的差异](#44-jsx-中的差异)
- [5. 哪种方式更好？](#5-哪种方式更好)
  - [5.1. 推荐原则](#51-推荐原则)
  - [5.2. ESLint 规则](#52-eslint-规则)
  - [5.3. 社区实践](#53-社区实践)
- [6. 引用](#6-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 数组的两种类型声明语法
- 语法差异和使用场景
- JSX 兼容性问题
- 多维数组的声明
- 最佳实践建议

## 2. 评价

TypeScript 提供了两种声明数组类型的方式，方括号语法（`T[]`）和泛型语法（`Array<T>`）在功能上完全等价，编译后的代码和类型检查行为完全一致。

- 方括号语法（`T[]`）简洁直观，是 TypeScript 社区和官方推荐的主流写法
- 泛型语法（`Array<T>`）在处理复杂联合类型时可读性更好
- 两种语法在 JSX/TSX 文件的变量声明中都可以正常使用，不存在语法冲突
- 多维数组使用方括号语法更简洁，如 `number[][]` 比 `Array<Array<number>>` 更易读
- 推荐在项目中统一使用一种风格，通过 ESLint 规则保持一致性

## 3. 数组的两种类型声明方式是什么？

- 方式 1：方括号语法（`T[]`）
- 方式 2：泛型语法（`Array<T>`）

::: code-group

```ts [1]
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

```ts [2]
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

:::

上述两种写法都可以正常运行，且最终起到的约束效果都是一样的。

## 4. 两种方式有什么区别？

### 4.1. 对比表

| 特性            | `T[]`       | `Array<T>`  |
| --------------- | ----------- | ----------- |
| 简洁性          | ✅ 更简洁   | ❌ 稍冗长   |
| 可读性          | ✅ 直观     | ✅ 明确     |
| 复杂类型        | ⚠️ 需要括号 | ✅ 更清晰   |
| 多维数组        | ✅ 简洁     | ❌ 嵌套冗长 |
| 社区偏好        | ✅ 主流     | ❌ 较少     |
| TypeScript 官方 | ✅ 推荐     | -           |

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
type A = string | number[] // 表示「string 或 number[]」

// 表示：字符串类型或者是数字数组类型
type B = string | number[]

// 表示：字符串或数字的数组类型
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
// 在 JSX/TSX 文件中，两种语法在变量声明时都可以正常使用
function Component<T>() {
  const arr1: T[] = [] // ✅ OK
  const arr2: Array<T> = [] // ✅ OK

  return <div>{arr1.length + arr2.length}</div>
}

// 真正的问题在于泛型参数本身可能与 JSX 标签产生歧义
// ❌ TypeScript 可能将 <T> 误解析为 JSX 标签的开始
function GenericComponent<T>() {
  return <div>content</div>
}

// ✅ 解决方案：为泛型参数添加约束
function GenericComponent<T extends unknown>() {
  const items: T[] = [] // ✅ OK
  const items2: Array<T> = [] // ✅ OK
  return <div>{items.length}</div>
}

// ✅ 或使用更具体的约束
function GenericComponent<T extends object>() {
  const items: T[] = []
  return <div>{items.length}</div>
}
```

## 5. 哪种方式更好？

### 5.1. 推荐原则

| 场景         | 推荐       | 原因                                 |
| ------------ | ---------- | ------------------------------------ |
| 一般情况     | `T[]`      | 简洁、主流                           |
| 复杂联合类型 | `Array<T>` | 更清晰                               |
| 函数类型数组 | `Array<T>` | 避免括号嵌套                         |
| 多维数组     | `T[][]`    | 比 `Array<Array<T>>` 更简洁          |
| 只读数组     | 两者皆可   | `readonly T[]` 或 `ReadonlyArray<T>` |

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

// ✅ 特殊场景使用泛型
const complex: Array<string | number> = [1, 'two']
// ✅ 或者也可以考虑包裹一层类型别名
type ComplexItem = string | number
const complex: ComplexItem[] = [1, 'two']
```

## 6. 引用

- [TypeScript Handbook - Arrays][1]
- [TypeScript Style Guide][2]
- [@typescript-eslint/array-type][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays
[2]: https://google.github.io/styleguide/tsguide.html
[3]: https://typescript-eslint.io/rules/array-type/
