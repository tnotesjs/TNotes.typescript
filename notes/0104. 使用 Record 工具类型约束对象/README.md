# [0104. 使用 Record 工具类型约束对象](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0104.%20%E4%BD%BF%E7%94%A8%20Record%20%E5%B7%A5%E5%85%B7%E7%B1%BB%E5%9E%8B%E7%BA%A6%E6%9D%9F%E5%AF%B9%E8%B1%A1)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 什么是 Record 工具类型？](#3-什么是-record-工具类型)
- [4. Record 的实现原理是？](#4-record-的实现原理是)
- [5. Record vs 索引签名](#5-record-vs-索引签名)
  - [5.1. 语法对比](#51-语法对比)
  - [5.2. 完整性检查](#52-完整性检查)
  - [5.3. 经典使用场景差异](#53-经典使用场景差异)
- [6. Record 都有哪些高级用法？](#6-record-都有哪些高级用法)
  - [6.1. 可以嵌套 Record 定义深层对象结构](#61-可以嵌套-record-定义深层对象结构)
  - [6.2. 可以结合泛型传递类型参数](#62-可以结合泛型传递类型参数)
  - [6.3. 可以结合 Partial 实现可选属性](#63-可以结合-partial-实现可选属性)
  - [6.4. 结合 Pick/Omit 筛选/排除特定键](#64-结合-pickomit-筛选排除特定键)
- [7. 引用](#7-引用)

<!-- endregion:toc -->

## 1. 本节内容

- Record 工具类型的定义
- Record 的基本用法
- Record 的实现原理
- Record 与索引签名的区别
- 结合其他工具类型使用

## 2. 评价

`Record<K, T>` 是 TypeScript 提供的工具类型（Utility Type），用于创建键值对类型。

Record 的特点：

- 类型安全：键和值都有明确的类型约束
- 枚举键：可以限定键的范围
- 简洁语法：相比索引签名更简洁
- 完整性检查：确保所有键都存在

## 3. 什么是 Record 工具类型？

`Record<K, T>` 创建一个对象类型，其键的类型为 K，值的类型为 T。

- K：键的类型（通常是字符串字面量联合类型）
- T：值的类型
- 完整性：可以结合联合类型约束 key 的取值范围，但要求所有 K 中的键都必须存在
- 类型安全：键和值都有类型检查，必须满足 K、T 的类型要求

基本使用：

```ts
type Scores = Record<string, number>

const scores: Scores = {
  math: 95,
  english: 88,
  science: 92,
}
```

限定键的范围：

```ts
type Status = 'idle' | 'loading' | 'success' | 'error'
type StatusMessages = Record<Status, string>
// TS 推断结果：
// type StatusMessages = {
//     idle: string;
//     loading: string;
//     success: string;
//     error: string;
// }

const messages: StatusMessages = {
  idle: 'Ready',
  loading: 'Loading...',
  success: 'Success!',
  error: 'Error occurred',
}
```

数字键映射示例：

```ts
type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6
type DayNames = Record<DayOfWeek, string>
// TS 推断结果：
// type DayNames = {
//     0: string;
//     1: string;
//     2: string;
//     3: string;
//     4: string;
//     5: string;
//     6: string;
// }

const days: DayNames = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
}
```

值可以是复杂类型：

```ts
type ApiEndpoint = 'users' | 'posts' | 'comments'

type EndpointConfig = Record<
  ApiEndpoint,
  {
    url: string
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    headers?: Record<string, string>
  }
>
// TS 推断结果：
// type EndpointConfig = {
//     users: {
//         url: string;
//         method: "GET" | "POST" | "PUT" | "DELETE";
//         headers?: Record<string, string>;
//     };
//     posts: {
//         url: string;
//         method: "GET" | "POST" | "PUT" | "DELETE";
//         headers?: Record<string, string>;
//     };
//     comments: {
//         url: string;
//         method: "GET" | "POST" | "PUT" | "DELETE";
//         headers?: Record<string, string>;
//     };
// }

const config: EndpointConfig = {
  users: {
    url: '/api/users',
    method: 'GET',
  },
  posts: {
    url: '/api/posts',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },
  comments: {
    url: '/api/comments',
    method: 'GET',
  },
}
```

## 4. Record 的实现原理是？

Record 的实际定义：

```ts
type Record<K extends keyof any, T> = {
  [P in K]: T
}

// 解释：
// - K extends keyof any: K 必须是可以作为键的类型（string | number | symbol）
// - [P in K]: 映射类型，遍历 K 中的每个键
// - T: 每个键对应的值类型
```

Record 类型的计算过程：

```ts
type Status = 'idle' | 'loading' | 'success'
type Messages = Record<Status, string>

// 等价于
type Messages = {
  [P in 'idle' | 'loading' | 'success']: string
}

// 等价于
type Messages = {
  idle: string
  loading: string
  success: string
}
```

自定义一个可选的或只读的 Record：

```ts
// 创建自定义的 Record 变体
type OptionalRecord<K extends keyof any, T> = {
  [P in K]?: T
}

type PartialMessages = OptionalRecord<Status, string>
// 所有属性都是可选的

type ReadonlyRecord<K extends keyof any, T> = {
  readonly [P in K]: T
}

type ImmutableMessages = ReadonlyRecord<Status, string>
// 所有属性都是只读的
```

## 5. Record vs 索引签名

Record 与索引签名的区别：

| 特性     | Record                   | 索引签名                        |
| -------- | ------------------------ | ------------------------------- |
| 键的范围 | 可以限定为字面量联合类型 | 只能是 string、number 或 symbol |
| 完整性   | 要求所有键都存在         | 不要求                          |
| 语法     | `Record<K, T>`           | `{ [key: string]: T }`          |
| 适用场景 | 固定的键集合             | 动态的键                        |

### 5.1. 语法对比

::: code-group

```ts [Record]
// 使用 Record
type ColorMap = Record<'red' | 'green' | 'blue', string>

const colors: ColorMap = {
  red: '#FF0000',
  green: '#00FF00',
  blue: '#0000FF',
}
```

```ts [索引签名]
// 使用索引签名
type ColorMap = {
  [key in 'red' | 'green' | 'blue']: string
}

// 或者更宽泛的版本
type AnyColorMap = {
  [key: string]: string
}
```

:::

### 5.2. 完整性检查

::: code-group

```ts [Record - 严格]
// Record 要求所有键都存在
type Status = 'idle' | 'loading' | 'success'
type StatusMap = Record<Status, boolean>

const status: StatusMap = {
  idle: true,
  loading: false,
  // ❌ Error: Property 'success' is missing
}
```

```ts [索引签名 - 宽松]
// 索引签名不要求完整性
type StatusMap = {
  [key: string]: boolean
}

const status: StatusMap = {
  idle: true,
  loading: false,
  // 不要求其他键
}
```

:::

### 5.3. 经典使用场景差异

- Record 适合已知固定的键集合 - 比如状态机
- 索引签名适合动态的、未知的键 - 比如配置对象

::: code-group

```ts [Record]
// 状态机
type State = 'idle' | 'running' | 'stopped'
type StateTransitions = Record<State, State[]>
```

```ts [索引签名]
// 配置对象
interface Config {
  host: string
  port: number
  [key: string]: any // 允许额外配置
}
```

:::

## 6. Record 都有哪些高级用法？

### 6.1. 可以嵌套 Record 定义深层对象结构

```ts
// 多层嵌套
type Locale = 'en' | 'zh' | 'ja'
type Section = 'header' | 'footer' | 'sidebar'

type Translations = Record<Locale, Record<Section, Record<string, string>>>

const translations: Translations = {
  en: {
    header: {
      title: 'Welcome',
      subtitle: 'Get started',
    },
    footer: {
      copyright: '© 2024',
    },
    sidebar: {
      menu: 'Menu',
    },
  },
  zh: {
    header: {
      title: '欢迎',
      subtitle: '开始使用',
    },
    footer: {
      copyright: '© 2024',
    },
    sidebar: {
      menu: '菜单',
    },
  },
  ja: {
    header: {
      title: 'ようこそ',
      subtitle: '始める',
    },
    footer: {
      copyright: '© 2024',
    },
    sidebar: {
      menu: 'メニュー',
    },
  },
}
```

### 6.2. 可以结合泛型传递类型参数

```ts
// 泛型 Record
type ApiResponse<T> = {
  data: T
  status: number
}

type ApiEndpoints<T> = Record<string, () => Promise<ApiResponse<T>>>

interface User {
  id: number
  name: string
}

const userApi: ApiEndpoints<User> = {
  getUser: async () => ({
    data: { id: 1, name: 'Alice' },
    status: 200,
  }),
  getCurrentUser: async () => ({
    data: { id: 1, name: 'Alice' },
    status: 200,
  }),
}
```

### 6.3. 可以结合 Partial 实现可选属性

```ts
type Status = 'idle' | 'loading' | 'success' | 'error'
type OptionalStatusMap = Partial<Record<Status, string>>
// TS 推断结果：
// type OptionalStatusMap = {
//     idle?: string;
//     loading?: string;
//     success?: string;
//     error?: string;
// }

const messages: OptionalStatusMap = {
  loading: 'Loading...',
  error: 'Error occurred',
  // idle 和 success 可以省略
}
```

### 6.4. 结合 Pick/Omit 筛选/排除特定键

```ts
type AllStatus = 'idle' | 'loading' | 'success' | 'error' | 'cancelled'

// 选择特定键
type ActiveStatus = Pick<Record<AllStatus, boolean>, 'loading' | 'success'>
// 等价于
// type ActiveStatus = Record<'loading' | 'success', boolean>
// TS 推断结果：
// type ActiveStatus = {
//     loading: boolean;
//     success: boolean;
// }

// 排除特定键
type NonErrorStatus = Omit<Record<AllStatus, boolean>, 'error' | 'cancelled'>
// 等价于
// type NonErrorStatus = Record<'idle' | 'loading' | 'success', boolean>
// TS 推断结果：
// type NonErrorStatus = {
//     idle: boolean;
//     loading: boolean;
//     success: boolean;
// }
```

## 7. 引用

- [TypeScript Handbook - Record][1]
- [TypeScript Handbook - Mapped Types][2]
- [TypeScript Deep Dive - Record][3]

[1]: https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type
[2]: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
[3]: https://basarat.gitbook.io/typescript/type-system/mapped-types
