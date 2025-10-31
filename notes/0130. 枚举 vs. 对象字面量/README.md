# [0130. 枚举 vs. 对象字面量](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0130.%20%E6%9E%9A%E4%B8%BE%20vs.%20%E5%AF%B9%E8%B1%A1%E5%AD%97%E9%9D%A2%E9%87%8F)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 枚举 vs 对象字面量](#3--枚举-vs-对象字面量)
  - [3.1. 基本对比](#31-基本对比)
  - [3.2. 类型系统差异](#32-类型系统差异)
  - [3.3. 编译产物](#33-编译产物)
- [4. 🤔 使用 as const 的对象字面量](#4--使用-as-const-的对象字面量)
  - [4.1. 基本用法](#41-基本用法)
  - [4.2. 创建类似枚举的类型](#42-创建类似枚举的类型)
  - [4.3. 添加辅助函数](#43-添加辅助函数)
- [5. 🤔 对比分析](#5--对比分析)
  - [5.1. 类型安全性](#51-类型安全性)
  - [5.2. 代码体积](#52-代码体积)
  - [5.3. Tree-shaking 支持](#53-tree-shaking-支持)
  - [5.4. 反向映射](#54-反向映射)
  - [5.5. 命名空间扩展](#55-命名空间扩展)
- [6. 🤔 迁移策略](#6--迁移策略)
  - [6.1. 从枚举迁移到对象字面量](#61-从枚举迁移到对象字面量)
  - [6.2. 从对象字面量迁移到枚举](#62-从对象字面量迁移到枚举)
- [7. 🤔 选择建议](#7--选择建议)
  - [7.1. 使用枚举的场景](#71-使用枚举的场景)
  - [7.2. 使用对象字面量的场景](#72-使用对象字面量的场景)
  - [7.3. 混合使用](#73-混合使用)
- [8. 🤔 实际应用场景](#8--实际应用场景)
  - [8.1. 场景 1：API 状态管理](#81-场景-1api-状态管理)
  - [8.2. 场景 2：主题系统](#82-场景-2主题系统)
  - [8.3. 场景 3：表单验证](#83-场景-3表单验证)
  - [8.4. 场景 4：权限系统](#84-场景-4权限系统)
  - [8.5. 场景 5：路由配置](#85-场景-5路由配置)
- [9. 🤔 常见错误和最佳实践](#9--常见错误和最佳实践)
  - [9.1. 错误 1：忘记 as const](#91-错误-1忘记-as-const)
  - [9.2. 错误 2：类型提取错误](#92-错误-2类型提取错误)
  - [9.3. 错误 3：混淆枚举类型和值类型](#93-错误-3混淆枚举类型和值类型)
  - [9.4. 最佳实践](#94-最佳实践)
- [10. 🔗 引用](#10--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 枚举与对象字面量的对比
- as const 的对象字面量替代方案
- 两种方式的优缺点分析
- 类型系统的差异
- 实际应用场景和选择建议

## 2. 🫧 评价

枚举和对象字面量是 TypeScript 中**定义常量集合的两种主要方式**。

两种方式的特点：

**枚举（Enum）**：

- TypeScript 特有语法
- 自动生成类型
- 数字枚举支持反向映射
- 编译为 JavaScript 对象

**对象字面量 + as const**：

- 标准 JavaScript 语法
- 需要手动定义类型
- 更灵活的结构
- 零运行时开销（配合 const enum）

枚举 vs 对象字面量对比：

| 特性             | 枚举            | 对象字面量 + as const |
| ---------------- | --------------- | --------------------- |
| **语法**         | TypeScript 特有 | 标准 JavaScript       |
| **类型定义**     | 自动            | 手动                  |
| **运行时代码**   | 有（普通枚举）  | 有                    |
| **反向映射**     | 支持（数字）    | 需手动实现            |
| **Tree-shaking** | 较差            | 较好                  |
| **灵活性**       | 有限            | 很高                  |

两种方式的优势：

**枚举优势**：

1. **语法简洁**：声明即类型
2. **自动类型**：无需额外类型定义
3. **反向映射**：数字枚举支持
4. **命名空间**：可扩展功能

**对象字面量优势**：

1. **标准语法**：纯 JavaScript
2. **Tree-shaking**：更好的打包优化
3. **灵活性**：结构更自由
4. **兼容性**：与 JavaScript 代码互操作

理解两者差异，能帮助你：

1. 选择合适的常量定义方式
2. 优化代码体积和性能
3. 提高代码的可维护性
4. 更好地与 JavaScript 生态集成

现代 TypeScript 开发中，对象字面量 + as const 越来越受欢迎，但枚举仍有其独特价值。

## 3. 🤔 枚举 vs 对象字面量

### 3.1. 基本对比

```ts
// ✅ 使用枚举
enum StatusEnum {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING',
}

function handleStatusEnum(status: StatusEnum): void {
  console.log(status)
}

handleStatusEnum(StatusEnum.Active) // ✅
// handleStatusEnum('ACTIVE')        // ❌ Error

// ✅ 使用对象字面量
const StatusObject = {
  Active: 'ACTIVE',
  Inactive: 'INACTIVE',
  Pending: 'PENDING',
} as const

type StatusObject = (typeof StatusObject)[keyof typeof StatusObject]

function handleStatusObject(status: StatusObject): void {
  console.log(status)
}

handleStatusObject(StatusObject.Active) // ✅
handleStatusObject('ACTIVE') // ✅
```

### 3.2. 类型系统差异

```ts
// ✅ 枚举创建新的类型
enum Color {
  Red = 'RED',
  Green = 'GREEN',
}

type ColorType = Color // Color 类型
const red: Color = Color.Red

// ✅ 对象字面量需要手动提取类型
const ColorObj = {
  Red: 'RED',
  Green: 'GREEN',
} as const

type ColorObjType = (typeof ColorObj)[keyof typeof ColorObj] // 'RED' | 'GREEN'
const redObj: ColorObjType = ColorObj.Red

// 差异
const enumValue: Color = Color.Red // 类型: Color
const objValue: ColorObjType = 'RED' // 类型: 'RED' | 'GREEN'
```

### 3.3. 编译产物

```ts
// TypeScript 源码
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
}

const DirectionObj = {
  Up: 'UP',
  Down: 'DOWN',
} as const

// 编译后的 JavaScript
// 枚举
var Direction
;(function (Direction) {
  Direction['Up'] = 'UP'
  Direction['Down'] = 'DOWN'
})(Direction || (Direction = {}))

// 对象字面量
const DirectionObj = {
  Up: 'UP',
  Down: 'DOWN',
}
```

## 4. 🤔 使用 as const 的对象字面量

### 4.1. 基本用法

```ts
// ✅ as const 使对象属性变为只读字面量
const Config = {
  MAX_SIZE: 100,
  TIMEOUT: 5000,
  API_URL: 'https://api.example.com',
} as const

// Config.MAX_SIZE = 200  // ❌ Error: 只读属性

// 提取值类型
type ConfigValue = (typeof Config)[keyof typeof Config]
// 100 | 5000 | 'https://api.example.com'

// 提取键类型
type ConfigKey = keyof typeof Config
// 'MAX_SIZE' | 'TIMEOUT' | 'API_URL'
```

### 4.2. 创建类似枚举的类型

```ts
// ✅ 模拟字符串枚举
const Status = {
  Active: 'ACTIVE',
  Inactive: 'INACTIVE',
  Pending: 'PENDING',
} as const

type Status = (typeof Status)[keyof typeof Status]

function setStatus(status: Status): void {
  console.log(status)
}

setStatus(Status.Active) // ✅
setStatus('ACTIVE') // ✅

// ✅ 模拟数字枚举
const Priority = {
  Low: 1,
  Medium: 2,
  High: 3,
} as const

type Priority = (typeof Priority)[keyof typeof Priority]
```

### 4.3. 添加辅助函数

```ts
// ✅ 为对象字面量添加工具函数
const HttpStatus = {
  OK: 200,
  NotFound: 404,
  ServerError: 500,
} as const

type HttpStatus = (typeof HttpStatus)[keyof typeof HttpStatus]

// 工具函数
namespace HttpStatus {
  export function isValid(value: number): value is HttpStatus {
    return Object.values(HttpStatus).includes(value as any)
  }

  export function getName(value: HttpStatus): string {
    const entry = Object.entries(HttpStatus).find(([_, v]) => v === value)
    return entry ? entry[0] : 'Unknown'
  }

  export const values = Object.values(HttpStatus)
  export const keys = Object.keys(HttpStatus)
}

console.log(HttpStatus.isValid(200)) // true
console.log(HttpStatus.getName(404)) // 'NotFound'
console.log(HttpStatus.values) // [200, 404, 500]
```

## 5. 🤔 对比分析

### 5.1. 类型安全性

```ts
// ✅ 枚举：更严格的类型检查
enum ColorEnum {
  Red = 'RED',
  Green = 'GREEN',
}

function setColorEnum(color: ColorEnum): void {}

setColorEnum(ColorEnum.Red) // ✅
// setColorEnum('RED')       // ❌ Error: 字符串不能赋值给枚举类型

// ✅ 对象字面量：字面量类型联合
const ColorObj = {
  Red: 'RED',
  Green: 'GREEN',
} as const

type ColorObj = (typeof ColorObj)[keyof typeof ColorObj]

function setColorObj(color: ColorObj): void {}

setColorObj(ColorObj.Red) // ✅
setColorObj('RED') // ✅ 字符串字面量可以
```

### 5.2. 代码体积

```ts
// ✅ 枚举（普通）：生成额外代码
enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}
// ~150 bytes (包括 IIFE)

// ✅ const enum：内联，无额外代码
const enum StatusConst {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}
// ~0 bytes (引用处内联为字面量)

// ✅ 对象字面量：最小代码
const StatusObj = {
  Active: 'ACTIVE',
  Inactive: 'INACTIVE',
} as const
// ~60 bytes (仅对象定义)
```

### 5.3. Tree-shaking 支持

```ts
// ❌ 枚举：Tree-shaking 效果差
enum Feature {
  Search = 'SEARCH',
  Filter = 'FILTER',
  Sort = 'SORT',
  Export = 'EXPORT',
}

// 即使只使用一个成员，整个枚举对象都会被打包
const feature = Feature.Search

// ✅ 对象字面量：更好的 Tree-shaking
export const FeatureObj = {
  Search: 'SEARCH',
  Filter: 'FILTER',
  Sort: 'SORT',
  Export: 'EXPORT',
} as const

// 可以被更好地 tree-shake
const feature2 = FeatureObj.Search
```

### 5.4. 反向映射

```ts
// ✅ 枚举：数字枚举自动支持反向映射
enum Priority {
  Low,
  Medium,
  High,
}

console.log(Priority[0]) // 'Low'
console.log(Priority.Low) // 0

// ❌ 对象字面量：需要手动实现反向映射
const PriorityObj = {
  Low: 0,
  Medium: 1,
  High: 2,
} as const

// 手动创建反向映射
const PriorityReverse = {
  0: 'Low',
  1: 'Medium',
  2: 'High',
} as const

console.log(PriorityReverse[0]) // 'Low'
console.log(PriorityObj.Low) // 0
```

### 5.5. 命名空间扩展

```ts
// ✅ 枚举：可以使用命名空间扩展
enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

namespace Status {
  export function parse(value: string): Status | undefined {
    return Object.values(Status).includes(value as Status)
      ? (value as Status)
      : undefined
  }
}

console.log(Status.parse('ACTIVE')) // Status.Active

// ✅ 对象字面量：需要分开定义
const StatusObj = {
  Active: 'ACTIVE',
  Inactive: 'INACTIVE',
} as const

const StatusUtils = {
  parse(value: string) {
    return Object.values(StatusObj).includes(value as any)
      ? (value as (typeof StatusObj)[keyof typeof StatusObj])
      : undefined
  },
}
```

## 6. 🤔 迁移策略

### 6.1. 从枚举迁移到对象字面量

```ts
// 原枚举
enum OldStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING',
}

// ✅ 迁移步骤 1：创建对象字面量
const Status = {
  Active: 'ACTIVE',
  Inactive: 'INACTIVE',
  Pending: 'PENDING',
} as const

// ✅ 步骤 2：定义类型别名
type Status = (typeof Status)[keyof typeof Status]

// ✅ 步骤 3：逐步替换使用
// 旧代码
function oldHandler(status: OldStatus): void {}

// 新代码
function newHandler(status: Status): void {}

// ✅ 步骤 4：添加兼容层（过渡期）
function handler(status: OldStatus | Status): void {
  const statusValue = typeof status === 'string' ? status : OldStatus[status]
  console.log(statusValue)
}
```

### 6.2. 从对象字面量迁移到枚举

```ts
// 原对象字面量
const OldColor = {
  Red: 'RED',
  Green: 'GREEN',
  Blue: 'BLUE',
} as const

type OldColor = (typeof OldColor)[keyof typeof OldColor]

// ✅ 迁移到枚举
enum Color {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE',
}

// ✅ 保持向后兼容
function setColor(color: Color | OldColor): void {
  // 两种类型的值相同，可以直接使用
  console.log(color)
}
```

## 7. 🤔 选择建议

### 7.1. 使用枚举的场景

```ts
// ✅ 1. 需要反向映射
enum ErrorCode {
  NotFound = 404,
  ServerError = 500,
}

console.log(ErrorCode[404]) // 'NotFound'

// ✅ 2. 需要类型名称的语义
enum UserRole {
  Guest,
  User,
  Admin,
}

function checkRole(role: UserRole): boolean {
  // UserRole 类型名称有明确的语义
  return role === UserRole.Admin
}

// ✅ 3. 需要命名空间扩展
enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

namespace Status {
  export function isActive(status: Status): boolean {
    return status === Status.Active
  }
}

// ✅ 4. 数字枚举的位标志
enum Permission {
  None = 0,
  Read = 1 << 0,
  Write = 1 << 1,
  Execute = 1 << 2,
}
```

### 7.2. 使用对象字面量的场景

```ts
// ✅ 1. 需要更好的 Tree-shaking
export const ApiEndpoint = {
  Users: '/api/users',
  Posts: '/api/posts',
  Comments: '/api/comments',
  // ...很多端点
} as const

// 只导入使用的部分
import { ApiEndpoint } from './constants'
fetch(ApiEndpoint.Users)

// ✅ 2. 与 JavaScript 代码互操作
const Config = {
  MAX_SIZE: 100,
  TIMEOUT: 5000,
} as const

// 可以直接在 JS 文件中使用

// ✅ 3. 需要复杂的数据结构
const Theme = {
  colors: {
    primary: '#1890ff',
    success: '#52c41a',
  },
  fonts: {
    size: {
      small: 12,
      medium: 14,
      large: 16,
    },
  },
} as const

// ✅ 4. 优先考虑标准 JavaScript
const EventType = {
  Click: 'click',
  Input: 'input',
} as const

// 使用标准 JS 语法，更容易理解
```

### 7.3. 混合使用

```ts
// ✅ 在同一个项目中根据场景选择

// 枚举：用于状态机、错误码等
enum OrderStatus {
  Pending,
  Processing,
  Completed,
  Cancelled,
}

// 对象字面量：用于配置、常量等
const AppConfig = {
  API_URL: process.env.API_URL || 'https://api.example.com',
  TIMEOUT: 5000,
  MAX_RETRIES: 3,
} as const

// const enum：用于性能敏感的场景
const enum LogLevel {
  Trace,
  Debug,
  Info,
  Warn,
  Error,
}
```

## 8. 🤔 实际应用场景

### 8.1. 场景 1：API 状态管理

```ts
// ✅ 使用枚举：类型安全的状态
enum RequestStatus {
  Idle = 'IDLE',
  Loading = 'LOADING',
  Success = 'SUCCESS',
  Error = 'ERROR',
}

interface RequestState<T> {
  status: RequestStatus
  data?: T
  error?: Error
}

class ApiClient {
  async fetch<T>(url: string): Promise<RequestState<T>> {
    const state: RequestState<T> = {
      status: RequestStatus.Loading,
    }

    try {
      const data = await fetch(url).then((res) => res.json())
      return { status: RequestStatus.Success, data }
    } catch (error) {
      return {
        status: RequestStatus.Error,
        error: error as Error,
      }
    }
  }
}

// ✅ 使用对象字面量：灵活的配置
const ApiConfig = {
  endpoints: {
    users: '/api/users',
    posts: '/api/posts',
  },
  timeout: 5000,
  retries: 3,
} as const
```

### 8.2. 场景 2：主题系统

```ts
// ✅ 对象字面量：复杂嵌套结构
const Theme = {
  light: {
    colors: {
      primary: '#1890ff',
      background: '#ffffff',
      text: '#000000',
    },
    spacing: {
      small: 8,
      medium: 16,
      large: 24,
    },
  },
  dark: {
    colors: {
      primary: '#177ddc',
      background: '#000000',
      text: '#ffffff',
    },
    spacing: {
      small: 8,
      medium: 16,
      large: 24,
    },
  },
} as const

type Theme = typeof Theme
type ThemeMode = keyof Theme
type ThemeColor = Theme[ThemeMode]['colors']

// ✅ 枚举：主题模式类型
enum ThemeMode {
  Light = 'light',
  Dark = 'dark',
  Auto = 'auto',
}
```

### 8.3. 场景 3：表单验证

```ts
// ✅ 枚举：验证规则类型
enum ValidationRule {
  Required = 'REQUIRED',
  Email = 'EMAIL',
  MinLength = 'MIN_LENGTH',
  MaxLength = 'MAX_LENGTH',
  Pattern = 'PATTERN',
}

interface ValidationError {
  rule: ValidationRule
  message: string
}

// ✅ 对象字面量：验证消息
const ValidationMessages = {
  REQUIRED: '此字段为必填项',
  EMAIL: '请输入有效的邮箱地址',
  MIN_LENGTH: '长度不能少于 {min} 个字符',
  MAX_LENGTH: '长度不能超过 {max} 个字符',
  PATTERN: '格式不正确',
} as const
```

### 8.4. 场景 4：权限系统

```ts
// ✅ 枚举：位标志权限
enum Permission {
  None = 0,
  Read = 1 << 0,
  Write = 1 << 1,
  Delete = 1 << 2,
  Admin = Read | Write | Delete,
}

function hasPermission(user: number, perm: Permission): boolean {
  return (user & perm) === perm
}

// ✅ 对象字面量：角色权限映射
const RolePermissions = {
  guest: [Permission.Read],
  user: [Permission.Read, Permission.Write],
  admin: [Permission.Admin],
} as const

type Role = keyof typeof RolePermissions
```

### 8.5. 场景 5：路由配置

```ts
// ✅ 对象字面量：路由配置（更灵活）
const Routes = {
  Home: {
    path: '/',
    component: 'Home',
    meta: { requiresAuth: false },
  },
  Dashboard: {
    path: '/dashboard',
    component: 'Dashboard',
    meta: { requiresAuth: true },
  },
  Profile: {
    path: '/profile/:id',
    component: 'Profile',
    meta: { requiresAuth: true },
  },
} as const

type RouteKey = keyof typeof Routes
type RoutePath = (typeof Routes)[RouteKey]['path']

// ✅ 枚举：路由名称（类型安全）
enum RouteName {
  Home = 'HOME',
  Dashboard = 'DASHBOARD',
  Profile = 'PROFILE',
}

function navigateTo(route: RouteName): void {
  // 类型安全的路由导航
}
```

## 9. 🤔 常见错误和最佳实践

### 9.1. 错误 1：忘记 as const

```ts
// ❌ 没有 as const，类型过于宽泛
const Status = {
  Active: 'ACTIVE',
  Inactive: 'INACTIVE',
}
// 类型: { Active: string; Inactive: string }

type StatusValue = (typeof Status)[keyof typeof Status]
// 类型: string（太宽泛）

// ✅ 使用 as const
const StatusGood = {
  Active: 'ACTIVE',
  Inactive: 'INACTIVE',
} as const
// 类型: { readonly Active: 'ACTIVE'; readonly Inactive: 'INACTIVE' }

type StatusValueGood = (typeof StatusGood)[keyof typeof StatusGood]
// 类型: 'ACTIVE' | 'INACTIVE'（精确）
```

### 9.2. 错误 2：类型提取错误

```ts
const Colors = {
  Red: 'RED',
  Green: 'GREEN',
} as const

// ❌ 错误的类型提取
type ColorWrong = typeof Colors
// 类型: { readonly Red: 'RED'; readonly Green: 'GREEN' }

// ✅ 正确的类型提取
type ColorRight = (typeof Colors)[keyof typeof Colors]
// 类型: 'RED' | 'GREEN'
```

### 9.3. 错误 3：混淆枚举类型和值类型

```ts
enum Status {
  Active = 'ACTIVE',
}

const StatusObj = {
  Active: 'ACTIVE',
} as const

type StatusObjType = (typeof StatusObj)[keyof typeof StatusObj]

// ❌ 类型不兼容
function handle1(status: Status): void {}
// handle1('ACTIVE')  // Error

function handle2(status: StatusObjType): void {}
handle2('ACTIVE') // ✅

// ✅ 理解差异
const enumValue: Status = Status.Active // 类型: Status
const objValue: StatusObjType = StatusObj.Active // 类型: 'ACTIVE'
```

### 9.4. 最佳实践

```ts
// ✅ 1. 为对象字面量提供辅助类型
const Status = {
  Active: 'ACTIVE',
  Inactive: 'INACTIVE',
} as const

// 导出值类型
export type StatusValue = (typeof Status)[keyof typeof Status]

// 导出键类型
export type StatusKey = keyof typeof Status

// 导出整个类型
export type StatusType = typeof Status

// ✅ 2. 创建类型守卫
function isStatus(value: any): value is StatusValue {
  return Object.values(Status).includes(value)
}

// ✅ 3. 提供工具函数
namespace Status {
  export const values = Object.values(Status)
  export const keys = Object.keys(Status) as StatusKey[]

  export function parse(value: string): StatusValue | undefined {
    return isStatus(value) ? value : undefined
  }
}

// ✅ 4. 文档化选择原因
/**
 * API 端点常量
 *
 * @remarks
 * 使用对象字面量而非枚举，原因：
 * - 更好的 tree-shaking
 * - 标准 JavaScript 语法
 * - 与现有 JS 代码兼容
 */
export const ApiEndpoint = {
  Users: '/api/users',
  Posts: '/api/posts',
} as const

// ✅ 5. 统一项目风格
// 在项目中选择一种主要方式，并保持一致

// 方案 A：主要使用枚举
enum Feature {
  Search = 'SEARCH',
  Filter = 'FILTER',
}

// 方案 B：主要使用对象字面量
const Feature = {
  Search: 'SEARCH',
  Filter: 'FILTER',
} as const

// ✅ 6. 使用 eslint 规则
// .eslintrc.js
module.exports = {
  rules: {
    // 推荐使用 const assertion
    '@typescript-eslint/prefer-as-const': 'error',
    // 或禁止枚举
    'no-restricted-syntax': [
      'error',
      {
        selector: 'TSEnumDeclaration',
        message: 'Use const objects with as const instead',
      },
    ],
  },
}

// ✅ 7. 性能考虑
// 性能敏感：使用 const enum
const enum LogLevel {
  Debug,
  Info,
  Error,
}

// 需要运行时对象：使用对象字面量
const LogLevel = {
  Debug: 0,
  Info: 1,
  Error: 2,
} as const

// ✅ 8. 类型导出
// types.ts
export const Status = {
  Active: 'ACTIVE',
  Inactive: 'INACTIVE',
} as const

export type Status = (typeof Status)[keyof typeof Status]

// 使用时
import { Status } from './types'
import type { Status as StatusType } from './types'

const status: StatusType = Status.Active

// ✅ 9. 兼容性考虑
// 库代码：优先使用对象字面量（更兼容）
export const LibraryConstants = {
  VERSION: '1.0.0',
  API_BASE: '/api',
} as const

// 应用代码：根据需要选择枚举或对象字面量

// ✅ 10. 渐进式迁移
// 第一阶段：新代码使用对象字面量
const NewFeature = {
  A: 'A',
  B: 'B',
} as const

// 第二阶段：逐步替换旧枚举
// enum OldFeature { ... }  // 标记为 deprecated

// 第三阶段：完全移除枚举（可选）
```

## 10. 🔗 引用

- [TypeScript Handbook - Enums][1]
- [TypeScript Handbook - Const Assertions][2]
- [TypeScript Deep Dive - Const][3]
- [Why I don't use enums anymore][4]

[1]: https://www.typescriptlang.org/docs/handbook/enums.html
[2]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions
[3]: https://basarat.gitbook.io/typescript/type-system/const
[4]: https://www.youtube.com/watch?v=jjMbPt_H3RQ
