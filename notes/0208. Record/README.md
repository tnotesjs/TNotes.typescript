# [0208. Record](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0208.%20Record)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. `Record<K, T>` 是什么？](#3-recordk-t-是什么)
  - [3.1. 源码定义](#31-源码定义)
  - [3.2. 工作原理](#32-工作原理)
  - [3.3. 基本示例](#33-基本示例)
- [4. `Record<K, T>` vs 索引签名](#4-recordk-t-vs-索引签名)
- [5. 引用](#5-引用)

<!-- endregion:toc -->

## 1. 本节内容

- `Record<K, T>` 的定义和实现原理
- 基本使用方法
- 与索引签名的对比

## 2. 评价

`Record<K, T>` 创建一个对象类型，其属性键为 `K`，属性值为 `T`，其中 `K` 的类型必须兼容 `string | number | symbol`。

## 3. `Record<K, T>` 是什么？

`Record<K, T>` 创建一个对象类型，其属性键为 `K`，属性值为 `T`。

- 键类型必须是 `string | number | symbol`
- 比索引签名更加精确和类型安全
- 常用于创建枚举值映射、配置对象等
- 可以与联合类型结合创建精确的对象结构
- 在处理字典、映射表等数据结构时特别有用

### 3.1. 源码定义

```ts
/**
 * Construct a type with a set of properties K of type T
 */
type Record<K extends keyof any, T> = {
  [P in K]: T
}
```

`keyof any` 表示 `string | number | symbol`，这是所有对象键的类型。

```ts
type ALL_KEY = keyof any
// type ALL_KEY = string | number | symbol
```

### 3.2. 工作原理

```ts
// 使用字符串字面量联合类型作为键
type Status = 'pending' | 'success' | 'error'

type StatusMessages = Record<Status, string>
// 展开过程：
// 1. K = 'pending' | 'success' | 'error'
// 2. [P in K]: string
// 结果：
// type StatusMessages = {
//     pending: string;
//     success: string;
//     error: string;
// }
```

### 3.3. 基本示例

```ts
type Status = 'idle' | 'loading' | 'success' | 'error'
type StatusMessages = Record<Status, string>
// type StatusMessages = {
//     idle: string;
//     loading: string;
//     success: string;
//     error: string;
// }

// ✅ 包含所有 Status，不多也不少
const messages: StatusMessages = {
  idle: 'Ready',
  loading: 'Loading...',
  success: 'Done!',
  error: 'Failed',
}

// ❌ 必须包含所有键
const incomplete: StatusMessages = {
  idle: 'Ready',
  loading: 'Loading...',
  // 错误：缺少 success 和 error
}

// ❌ 不能有额外的键
const extra: StatusMessages = {
  idle: 'Ready',
  loading: 'Loading...',
  success: 'Done!',
  error: 'Failed',
  warning: 'Warning', // 错误：多余的键
}
```

## 4. `Record<K, T>` vs 索引签名

1. 索引签名 `[key: string]: number`：灵活但不精确，允许任意字符串 key
2. Record `Record<Status, number>`：精确且严格，key 必须是 `Status`，不能多也不能少

::: code-group

```ts [1]
type Dictionary = {
  [key: string]: number
}

const dict: Dictionary = {
  a: 1,
  b: 2,
  c: 3,
  anything: 999, // ✅ 任意键都可以
}

// ⚠️ 类型不够精确
console.log(dict.nonexistent) // 类型是 number，但实际是 undefined
```

```ts [2]
type Status = 'success' | 'error' | 'pending'
type StatusCode = Record<Status, number>

const codes: StatusCode = {
  success: 200,
  error: 500,
  pending: 102,
}

// ❌ 必须包含所有键
const incomplete: StatusCode = {
  success: 200,
  error: 500,
  // 错误：缺少 pending
}

// ❌ 不能有额外的键
const extra: StatusCode = {
  success: 200,
  error: 500,
  pending: 102,
  warning: 400, // 错误
}

// ✅ 类型安全访问
console.log(codes.success) // number
console.log(codes.nonexistent) // ❌ 编译错误
```

:::

选择建议：

- 键数量未知或动态 -> 使用索引签名
- 键是固定的联合类型 -> 使用 Record

你也可以使用 `Record<string, number>` 来模拟字符串索引签名 `Dictionary` 的效果。

```ts
type Dictionary = {
  [key: string]: number
}
```

## 5. 引用

- [TypeScript Utility Types - Record][1]
- [TypeScript Handbook - Index Signatures][2]
- [TypeScript Deep Dive - Record][3]

[1]: https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type
[2]: https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures
[3]: https://basarat.gitbook.io/typescript/type-system/index-signatures
