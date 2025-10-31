# [0104. 使用 Record 工具类型约束对象](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0104.%20%E4%BD%BF%E7%94%A8%20Record%20%E5%B7%A5%E5%85%B7%E7%B1%BB%E5%9E%8B%E7%BA%A6%E6%9D%9F%E5%AF%B9%E8%B1%A1)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是 Record 工具类型？](#3--什么是-record-工具类型)
- [4. 🤔 Record 的基本用法](#4--record-的基本用法)
  - [4.1. 字符串键映射](#41-字符串键映射)
  - [4.2. 字面量联合类型键](#42-字面量联合类型键)
  - [4.3. 数字键映射](#43-数字键映射)
  - [4.4. 复杂值类型](#44-复杂值类型)
- [5. 🤔 Record 的实现原理](#5--record-的实现原理)
  - [5.1. 类型定义](#51-类型定义)
  - [5.2. 展开过程](#52-展开过程)
  - [5.3. 自定义 Record](#53-自定义-record)
- [6. 🤔 Record vs 索引签名](#6--record-vs-索引签名)
  - [6.1. 语法对比](#61-语法对比)
  - [6.2. 完整性检查](#62-完整性检查)
  - [6.3. 使用场景对比](#63-使用场景对比)
- [7. 🤔 Record 的高级用法](#7--record-的高级用法)
  - [7.1. 嵌套 Record](#71-嵌套-record)
  - [7.2. 结合泛型](#72-结合泛型)
  - [7.3. 结合 Partial](#73-结合-partial)
  - [7.4. 结合 Pick/Omit](#74-结合-pickomit)
  - [7.5. 动态键生成](#75-动态键生成)
- [8. 🤔 常见使用场景](#8--常见使用场景)
  - [8.1. 场景 1：状态管理](#81-场景-1状态管理)
  - [8.2. 场景 2：路由配置](#82-场景-2路由配置)
  - [8.3. 场景 3：错误消息](#83-场景-3错误消息)
  - [8.4. 场景 4：表单验证](#84-场景-4表单验证)
  - [8.5. 场景 5：API 端点配置](#85-场景-5api-端点配置)
  - [8.6. 场景 6：主题配置](#86-场景-6主题配置)
  - [8.7. 场景 7：权限管理](#87-场景-7权限管理)
- [9. 🤔 常见错误和最佳实践](#9--常见错误和最佳实践)
  - [9.1. 错误 1：键类型过于宽泛](#91-错误-1键类型过于宽泛)
  - [9.2. 错误 2：忘记所有键都必需](#92-错误-2忘记所有键都必需)
  - [9.3. 错误 3：值类型不一致](#93-错误-3值类型不一致)
  - [9.4. 错误 4：过度使用 any](#94-错误-4过度使用-any)
  - [9.5. 最佳实践](#95-最佳实践)
- [10. 🔗 引用](#10--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- Record 工具类型的定义
- Record 的基本用法
- Record 的实现原理
- Record 与索引签名的区别
- 结合其他工具类型使用
- 实际应用场景

## 2. 🫧 评价

`Record<K, T>` 是 TypeScript 提供的**工具类型**（Utility Type），用于创建**键值对类型**。

Record 的特点：

- **类型安全**：键和值都有明确的类型约束
- **枚举键**：可以限定键的范围
- **简洁语法**：相比索引签名更简洁
- **完整性检查**：确保所有键都存在

Record 与索引签名的区别：

| 特性         | Record                   | 索引签名                        |
| ------------ | ------------------------ | ------------------------------- |
| **键的范围** | 可以限定为字面量联合类型 | 只能是 string、number 或 symbol |
| **完整性**   | 要求所有键都存在         | 不要求                          |
| **语法**     | `Record<K, T>`           | `{ [key: string]: T }`          |
| **适用场景** | 固定的键集合             | 动态的键                        |

理解 Record 工具类型，能帮助你：

1. 创建类型安全的映射对象
2. 限定对象的键范围
3. 确保对象的完整性
4. 编写更清晰的类型定义

Record 是最常用的工具类型之一，是构建类型安全字典和映射的首选工具。

## 3. 🤔 什么是 Record 工具类型？

`Record<K, T>` 创建一个对象类型，其**键的类型为 K**，**值的类型为 T**。

```ts
// ✅ 基本使用
type Scores = Record<string, number>

const scores: Scores = {
  math: 95,
  english: 88,
  science: 92,
}

// ✅ 限定键的范围
type Status = 'idle' | 'loading' | 'success' | 'error'
type StatusMessages = Record<Status, string>

const messages: StatusMessages = {
  idle: 'Ready',
  loading: 'Loading...',
  success: 'Success!',
  error: 'Error occurred',
}
```

**关键概念**：

- **K**：键的类型（通常是字符串字面量联合类型）
- **T**：值的类型
- **完整性**：所有 K 中的键都必须存在
- **类型安全**：键和值都有类型检查

## 4. 🤔 Record 的基本用法

### 4.1. 字符串键映射

```ts
// ✅ 字符串键到数字值
type StringToNumber = Record<string, number>

const ages: StringToNumber = {
  alice: 25,
  bob: 30,
  charlie: 35,
}
```

### 4.2. 字面量联合类型键

```ts
// ✅ 限定键为特定字面量
type Color = 'red' | 'green' | 'blue'
type ColorCodes = Record<Color, string>

const colors: ColorCodes = {
  red: '#FF0000',
  green: '#00FF00',
  blue: '#0000FF',
  // 必须包含所有三个键
}

// ❌ 缺少键会报错
const incomplete: ColorCodes = {
  red: '#FF0000',
  green: '#00FF00',
  // Error: Property 'blue' is missing
}
```

### 4.3. 数字键映射

```ts
// ✅ 数字键
type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6
type DayNames = Record<DayOfWeek, string>

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

### 4.4. 复杂值类型

```ts
// ✅ 值可以是复杂类型
type ApiEndpoint = 'users' | 'posts' | 'comments'

type EndpointConfig = Record<
  ApiEndpoint,
  {
    url: string
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    headers?: Record<string, string>
  }
>

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

## 5. 🤔 Record 的实现原理

### 5.1. 类型定义

```ts
// ✅ Record 的实际定义
type Record<K extends keyof any, T> = {
  [P in K]: T
}

// 解释：
// - K extends keyof any: K 必须是可以作为键的类型（string | number | symbol）
// - [P in K]: 映射类型，遍历 K 中的每个键
// - T: 每个键对应的值类型
```

### 5.2. 展开过程

```ts
// ✅ Record 如何工作
type Status = 'idle' | 'loading' | 'success'
type Messages = Record<Status, string>

// 等价于
type Messages = {
  [P in 'idle' | 'loading' | 'success']: string
}

// 进一步展开
type Messages = {
  idle: string
  loading: string
  success: string
}
```

### 5.3. 自定义 Record

```ts
// ✅ 创建自定义的 Record 变体
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

## 6. 🤔 Record vs 索引签名

### 6.1. 语法对比

::: code-group

```ts [Record]
// ✅ 使用 Record
type ColorMap = Record<'red' | 'green' | 'blue', string>

const colors: ColorMap = {
  red: '#FF0000',
  green: '#00FF00',
  blue: '#0000FF',
}
```

```ts [索引签名]
// ✅ 使用索引签名
type ColorMap = {
  [key in 'red' | 'green' | 'blue']: string
}

// 或者更宽泛的版本
type AnyColorMap = {
  [key: string]: string
}
```

:::

### 6.2. 完整性检查

::: code-group

```ts [Record - 严格]
// ✅ Record 要求所有键都存在
type Status = 'idle' | 'loading' | 'success'
type StatusMap = Record<Status, boolean>

const status: StatusMap = {
  idle: true,
  loading: false,
  // ❌ Error: Property 'success' is missing
}
```

```ts [索引签名 - 宽松]
// ✅ 索引签名不要求完整性
type StatusMap = {
  [key: string]: boolean
}

const status: StatusMap = {
  idle: true,
  loading: false,
  // ✅ 不要求其他键
}
```

:::

### 6.3. 使用场景对比

```ts
// ✅ Record：已知固定的键集合
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type MethodHandlers = Record<HttpMethod, (req: Request) => Response>

// ✅ 索引签名：动态的、未知的键
interface Cache {
  [key: string]: any
}

// ✅ Record：状态机
type State = 'idle' | 'running' | 'stopped'
type StateTransitions = Record<State, State[]>

// ✅ 索引签名：配置对象
interface Config {
  host: string
  port: number
  [key: string]: any // 允许额外配置
}
```

## 7. 🤔 Record 的高级用法

### 7.1. 嵌套 Record

```ts
// ✅ 多层嵌套
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

### 7.2. 结合泛型

```ts
// ✅ 泛型 Record
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

### 7.3. 结合 Partial

```ts
// ✅ 部分可选的 Record
type Status = 'idle' | 'loading' | 'success' | 'error'
type OptionalStatusMap = Partial<Record<Status, string>>

const messages: OptionalStatusMap = {
  loading: 'Loading...',
  error: 'Error occurred',
  // idle 和 success 可以省略
}
```

### 7.4. 结合 Pick/Omit

```ts
// ✅ 选择特定键
type AllStatus = 'idle' | 'loading' | 'success' | 'error' | 'cancelled'
type ActiveStatus = Pick<Record<AllStatus, boolean>, 'loading' | 'success'>

// 等价于
type ActiveStatus = Record<'loading' | 'success', boolean>

// ✅ 排除特定键
type NonErrorStatus = Omit<Record<AllStatus, boolean>, 'error' | 'cancelled'>
```

### 7.5. 动态键生成

```ts
// ✅ 从枚举生成 Record
enum Color {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE',
}

type ColorValues = Record<Color, string>

const colorHex: ColorValues = {
  [Color.Red]: '#FF0000',
  [Color.Green]: '#00FF00',
  [Color.Blue]: '#0000FF',
}
```

## 8. 🤔 常见使用场景

### 8.1. 场景 1：状态管理

```ts
// ✅ Redux reducer 状态
type ActionType = 'INCREMENT' | 'DECREMENT' | 'RESET'

type ActionHandlers = Record<ActionType, (state: number) => number>

const handlers: ActionHandlers = {
  INCREMENT: (state) => state + 1,
  DECREMENT: (state) => state - 1,
  RESET: () => 0,
}

function reducer(state: number, action: { type: ActionType }): number {
  return handlers[action.type](state)
}
```

### 8.2. 场景 2：路由配置

```ts
// ✅ 路由映射
type Route = '/' | '/about' | '/contact' | '/blog'

type RouteConfig = Record<
  Route,
  {
    component: React.ComponentType
    title: string
    requiresAuth?: boolean
  }
>

const routes: RouteConfig = {
  '/': {
    component: HomePage,
    title: 'Home',
  },
  '/about': {
    component: AboutPage,
    title: 'About',
  },
  '/contact': {
    component: ContactPage,
    title: 'Contact',
  },
  '/blog': {
    component: BlogPage,
    title: 'Blog',
    requiresAuth: true,
  },
}
```

### 8.3. 场景 3：错误消息

```ts
// ✅ 错误码到消息的映射
type ErrorCode =
  | 'INVALID_EMAIL'
  | 'PASSWORD_TOO_SHORT'
  | 'USER_NOT_FOUND'
  | 'UNAUTHORIZED'

type ErrorMessages = Record<ErrorCode, string>

const errorMessages: ErrorMessages = {
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
  USER_NOT_FOUND: 'User not found',
  UNAUTHORIZED: 'You are not authorized to perform this action',
}

function getErrorMessage(code: ErrorCode): string {
  return errorMessages[code]
}
```

### 8.4. 场景 4：表单验证

```ts
// ✅ 字段验证器
type FormField = 'username' | 'email' | 'password' | 'confirmPassword'

type Validator = (value: string) => string | null

type FieldValidators = Record<FormField, Validator[]>

const validators: FieldValidators = {
  username: [
    (value) => (value.length < 3 ? 'Too short' : null),
    (value) => (/^[a-zA-Z0-9]+$/.test(value) ? null : 'Invalid characters'),
  ],
  email: [
    (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Invalid email',
  ],
  password: [(value) => (value.length < 8 ? 'Too short' : null)],
  confirmPassword: [
    (value) => (value === formData.password ? null : 'Passwords do not match'),
  ],
}
```

### 8.5. 场景 5：API 端点配置

```ts
// ✅ API 端点定义
type Endpoint = 'users' | 'posts' | 'comments' | 'likes'

type EndpointConfig = Record<
  Endpoint,
  {
    baseUrl: string
    methods: {
      list: string
      get: string
      create: string
      update: string
      delete: string
    }
  }
>

const apiConfig: EndpointConfig = {
  users: {
    baseUrl: '/api/users',
    methods: {
      list: 'GET /',
      get: 'GET /:id',
      create: 'POST /',
      update: 'PUT /:id',
      delete: 'DELETE /:id',
    },
  },
  posts: {
    baseUrl: '/api/posts',
    methods: {
      list: 'GET /',
      get: 'GET /:id',
      create: 'POST /',
      update: 'PUT /:id',
      delete: 'DELETE /:id',
    },
  },
  comments: {
    baseUrl: '/api/comments',
    methods: {
      list: 'GET /',
      get: 'GET /:id',
      create: 'POST /',
      update: 'PUT /:id',
      delete: 'DELETE /:id',
    },
  },
  likes: {
    baseUrl: '/api/likes',
    methods: {
      list: 'GET /',
      get: 'GET /:id',
      create: 'POST /',
      update: 'PUT /:id',
      delete: 'DELETE /:id',
    },
  },
}
```

### 8.6. 场景 6：主题配置

```ts
// ✅ 主题颜色
type ThemeColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'

type ColorShades = Record<
  ThemeColor,
  {
    light: string
    main: string
    dark: string
  }
>

const theme: ColorShades = {
  primary: {
    light: '#64B5F6',
    main: '#2196F3',
    dark: '#1976D2',
  },
  secondary: {
    light: '#FF4081',
    main: '#F50057',
    dark: '#C51162',
  },
  success: {
    light: '#81C784',
    main: '#4CAF50',
    dark: '#388E3C',
  },
  warning: {
    light: '#FFB74D',
    main: '#FF9800',
    dark: '#F57C00',
  },
  error: {
    light: '#E57373',
    main: '#F44336',
    dark: '#D32F2F',
  },
  info: {
    light: '#64B5F6',
    main: '#2196F3',
    dark: '#1976D2',
  },
}
```

### 8.7. 场景 7：权限管理

```ts
// ✅ 角色权限映射
type Permission = 'read' | 'write' | 'delete' | 'admin'
type Role = 'guest' | 'user' | 'moderator' | 'admin'

type RolePermissions = Record<Role, Permission[]>

const permissions: RolePermissions = {
  guest: ['read'],
  user: ['read', 'write'],
  moderator: ['read', 'write', 'delete'],
  admin: ['read', 'write', 'delete', 'admin'],
}

function hasPermission(role: Role, permission: Permission): boolean {
  return permissions[role].includes(permission)
}
```

## 9. 🤔 常见错误和最佳实践

### 9.1. 错误 1：键类型过于宽泛

```ts
// ❌ 使用 string 失去了 Record 的优势
type Bad = Record<string, number>

// ✅ 使用具体的字面量联合类型
type Good = Record<'a' | 'b' | 'c', number>
```

### 9.2. 错误 2：忘记所有键都必需

```ts
type Status = 'idle' | 'loading' | 'success'
type StatusMap = Record<Status, boolean>

// ❌ 缺少键
const status: StatusMap = {
  idle: true,
  loading: false,
  // Error: Property 'success' is missing
}

// ✅ 使用 Partial 如果键可选
type OptionalStatusMap = Partial<Record<Status, boolean>>

const status: OptionalStatusMap = {
  idle: true,
  loading: false,
  // ✅ 可以省略 success
}
```

### 9.3. 错误 3：值类型不一致

```ts
type Config = Record<string, string | number>

// ❌ 不能精确推断值类型
const config: Config = {
  host: 'localhost',
  port: 3000,
}

const port = config.port // string | number，不是 number

// ✅ 使用更精确的类型
type Config = {
  host: string
  port: number
  [key: string]: string | number
}
```

### 9.4. 错误 4：过度使用 any

```ts
// ❌ 使用 any 失去类型安全
type Bad = Record<string, any>

// ✅ 使用联合类型
type Good = Record<string, string | number | boolean>

// ✅ 或使用泛型
type Better<T> = Record<string, T>
```

### 9.5. 最佳实践

````ts
// ✅ 1. 使用字面量联合类型作为键
type Status = 'idle' | 'loading' | 'success' | 'error'
type StatusMap = Record<Status, string>

// ✅ 2. 为值提供具体类型
type Config = Record<
  string,
  {
    value: string | number
    description: string
  }
>

// ✅ 3. 使用 Partial 处理可选键
type OptionalConfig = Partial<Record<string, string>>

// ✅ 4. 结合其他工具类型
type ReadonlyConfig = Readonly<Record<string, string>>
type RequiredConfig = Required<Partial<Record<string, string>>>

// ✅ 5. 使用泛型增加灵活性
type ApiEndpoints<T> = Record<string, () => Promise<T>>

// ✅ 6. 嵌套 Record 表示多层映射
type Translations = Record<Locale, Record<string, string>>

// ✅ 7. 从枚举生成 Record
enum Status {
  Idle,
  Loading,
  Success,
  Error,
}
type StatusMap = Record<Status, string>

// ✅ 8. 文档化键的含义
/**
 * HTTP 状态码到消息的映射
 * @example
 * ```ts
 * const messages: StatusMessages = {
 *   200: 'OK',
 *   404: 'Not Found',
 *   500: 'Server Error'
 * }
 * ```
 */
type StatusMessages = Record<number, string>

// ✅ 9. 使用辅助函数确保完整性
function createStatusMap<T extends string>(
  statuses: readonly T[],
  mapper: (status: T) => string
): Record<T, string> {
  const result = {} as Record<T, string>
  for (const status of statuses) {
    result[status] = mapper(status)
  }
  return result
}

const statuses = ['idle', 'loading', 'success'] as const
const messages = createStatusMap(statuses, (s) => `Status: ${s}`)

// ✅ 10. 测试 Record 的完整性
type AssertComplete<T extends Record<Status, any>> = T

const completeMap: AssertComplete<StatusMap> = {
  idle: 'Idle',
  loading: 'Loading',
  success: 'Success',
  error: 'Error',
}
````

## 10. 🔗 引用

- [TypeScript Handbook - Record][1]
- [TypeScript Handbook - Mapped Types][2]
- [TypeScript Deep Dive - Record][3]

[1]: https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type
[2]: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
[3]: https://basarat.gitbook.io/typescript/type-system/mapped-types
