# [0125. 异构枚举](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0125.%20%E5%BC%82%E6%9E%84%E6%9E%9A%E4%B8%BE)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是异构枚举？](#3--什么是异构枚举)
- [4. 🤔 基本语法](#4--基本语法)
  - [4.1. 简单混合](#41-简单混合)
  - [4.2. 数字和字符串交替](#42-数字和字符串交替)
  - [4.3. 分段定义](#43-分段定义)
- [5. 🤔 初始化规则](#5--初始化规则)
  - [5.1. 字符串后必须初始化](#51-字符串后必须初始化)
  - [5.2. 数字后可以自动递增](#52-数字后可以自动递增)
  - [5.3. 初始化顺序](#53-初始化顺序)
- [6. 🤔 异构枚举的特性](#6--异构枚举的特性)
  - [6.1. 部分反向映射](#61-部分反向映射)
  - [6.2. 类型检查](#62-类型检查)
  - [6.3. 枚举成员类型](#63-枚举成员类型)
- [7. 🤔 使用场景](#7--使用场景)
  - [7.1. 场景 1：兼容旧代码](#71-场景-1兼容旧代码)
  - [7.2. 场景 2：特殊标记值](#72-场景-2特殊标记值)
  - [7.3. 场景 3：错误码系统](#73-场景-3错误码系统)
- [8. 🤔 常见错误和最佳实践](#8--常见错误和最佳实践)
  - [8.1. 错误 1：忘记字符串后的初始化](#81-错误-1忘记字符串后的初始化)
  - [8.2. 错误 2：期望字符串成员有反向映射](#82-错误-2期望字符串成员有反向映射)
  - [8.3. 错误 3：类型不一致导致的问题](#83-错误-3类型不一致导致的问题)
  - [8.4. 最佳实践](#84-最佳实践)
- [9. 🔗 引用](#9--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 异构枚举的定义和特性
- 数字和字符串混合使用
- 初始化规则和限制
- 反向映射的行为
- 实际应用场景

## 2. 🫧 评价

异构枚举（Heterogeneous Enum）是 TypeScript 中混合使用数字和字符串值的枚举类型。

异构枚举的特点：

- 混合值：同时包含数字和字符串成员
- 复杂性：规则比纯数字或纯字符串枚举复杂
- 部分反向映射：只有数字成员有反向映射
- 不推荐：官方不推荐使用

异构枚举 vs 纯枚举：

| 特性     | 异构枚举 | 纯数字枚举 | 纯字符串枚举 |
| -------- | -------- | ---------- | ------------ |
| 值类型   | 混合     | 数字       | 字符串       |
| 自动递增 | 部分支持 | 支持       | 不支持       |
| 反向映射 | 部分支持 | 支持       | 不支持       |
| 可读性   | 较差     | 中等       | 较好         |
| 推荐度   | 不推荐   | 推荐       | 最推荐       |

异构枚举的问题：

1. 混淆性：不同类型的值容易混淆
2. 维护困难：规则复杂难以维护
3. 可读性差：代码意图不清晰
4. 兼容性：某些场景下行为不一致

理解异构枚举，能帮助你：

1. 识别和重构遗留代码
2. 理解枚举的底层机制
3. 避免使用的陷阱
4. 选择更好的替代方案

异构枚举虽然技术上可行，但在实践中应该避免使用，优先选择纯数字或纯字符串枚举。

## 3. 🤔 什么是异构枚举？

异构枚举是同时包含数字和字符串成员值的枚举类型。

```ts
// ✅ 异构枚举示例
enum Mixed {
  No = 0,
  Yes = 'YES',
}

console.log(Mixed.No) // 0
console.log(Mixed.Yes) // 'YES'

// 部分反向映射
console.log(Mixed[0]) // 'No' - 数字成员有反向映射
console.log(Mixed['YES']) // undefined - 字符串成员无反向映射

// ✅ 编译结果
var Mixed
;(function (Mixed) {
  Mixed[(Mixed['No'] = 0)] = 'No'
  Mixed['Yes'] = 'YES'
})(Mixed || (Mixed = {}))

// 等价于
const Mixed = {
  No: 0,
  Yes: 'YES',
  0: 'No', // 只有数字成员有反向映射
}
```

关键概念：

- 混合值：包含不同类型的值
- 部分反向映射：只有数字成员支持反向映射
- 复杂规则：初始化规则比纯枚举复杂
- 不推荐：TypeScript 官方不推荐使用

## 4. 🤔 基本语法

### 4.1. 简单混合

```ts
// ✅ 基本的异构枚举
enum Status {
  Unknown = 0,
  Success = 'SUCCESS',
  Error = 'ERROR',
}

function handleStatus(status: Status): void {
  if (typeof status === 'number') {
    console.log('Numeric status:', status)
  } else {
    console.log('String status:', status)
  }
}

handleStatus(Status.Unknown) // Numeric status: 0
handleStatus(Status.Success) // String status: SUCCESS
```

### 4.2. 数字和字符串交替

```ts
// ✅ 交替使用数字和字符串
enum Mixed {
  First = 1,
  Second = 'SECOND',
  Third = 3,
  Fourth = 'FOURTH',
}

console.log(Mixed.First) // 1
console.log(Mixed.Second) // 'SECOND'
console.log(Mixed.Third) // 3
console.log(Mixed.Fourth) // 'FOURTH'
```

### 4.3. 分段定义

```ts
// ✅ 按类型分组
enum Config {
  // 数字配置
  Port = 3000,
  Timeout = 5000,
  MaxConnections = 100,

  // 字符串配置
  Host = 'localhost',
  Protocol = 'http',
  Path = '/api',
}
```

## 5. 🤔 初始化规则

### 5.1. 字符串后必须初始化

```ts
// ❌ 字符串成员后不能自动递增
enum Bad {
  A = 1,
  B = 'B',
  // C  // Error: 必须初始化
}

// ✅ 字符串后必须显式初始化
enum Good {
  A = 1,
  B = 'B',
  C = 2, // 必须手动赋值
}
```

### 5.2. 数字后可以自动递增

```ts
// ✅ 数字成员后可以自动递增
enum Status {
  Unknown = 0,
  Pending, // 1 - 自动递增
  Active, // 2 - 自动递增
  Success = 'SUCCESS',
  Error = 'ERROR',
  Retry = 10,
  Timeout, // 11 - 自动递增
}

console.log(Status.Pending) // 1
console.log(Status.Active) // 2
console.log(Status.Timeout) // 11
```

### 5.3. 初始化顺序

```ts
// ✅ 推荐：数字成员在前，字符串成员在后
enum Recommended {
  // 数字部分
  None = 0,
  Low = 1,
  Medium = 2,
  High = 3,

  // 字符串部分
  Info = 'INFO',
  Warning = 'WARNING',
  Error = 'ERROR',
}

// ❌ 不推荐：交替混合
enum NotRecommended {
  First = 1,
  Second = 'SECOND',
  Third = 3,
  Fourth = 'FOURTH',
}
```

## 6. 🤔 异构枚举的特性

### 6.1. 部分反向映射

```ts
// ✅ 只有数字成员有反向映射
enum Mixed {
  NumA = 1,
  NumB = 2,
  StrA = 'STRING_A',
  StrB = 'STRING_B',
}

// 数字成员的反向映射
console.log(Mixed[1]) // 'NumA'
console.log(Mixed[2]) // 'NumB'

// 字符串成员无反向映射
console.log(Mixed['STRING_A']) // undefined
console.log(Mixed['STRING_B']) // undefined

// 正向映射都可用
console.log(Mixed.NumA) // 1
console.log(Mixed.StrA) // 'STRING_A'
```

### 6.2. 类型检查

```ts
// ✅ 类型系统处理
enum Status {
  Code = 200,
  Message = 'OK',
}

function process(status: Status): void {
  if (typeof status === 'number') {
    console.log('Status code:', status)
  } else {
    console.log('Status message:', status)
  }
}

process(Status.Code) // Status code: 200
process(Status.Message) // Status message: OK

// ✅ 类型守卫
function isNumericStatus(status: Status): status is Status.Code {
  return typeof status === 'number'
}

function isStringStatus(status: Status): status is Status.Message {
  return typeof status === 'string'
}
```

### 6.3. 枚举成员类型

```ts
// ✅ 枚举成员有不同的类型
enum Mixed {
  Num = 42,
  Str = 'STRING',
}

type NumType = typeof Mixed.Num // 42
type StrType = typeof Mixed.Str // 'STRING'

// ✅ 联合类型
type MixedType = Mixed // 42 | 'STRING'
```

## 7. 🤔 使用场景

### 7.1. 场景 1：兼容旧代码

```ts
// ✅ 迁移遗留系统
enum LegacyStatus {
  // 旧的数字代码（保持兼容）
  Unknown = 0,
  Pending = 1,
  Active = 2,

  // 新的字符串值（更可读）
  Success = 'SUCCESS',
  Warning = 'WARNING',
  Error = 'ERROR',
}

// 处理两种格式
function handleLegacyStatus(status: LegacyStatus | number | string): void {
  if (typeof status === 'number') {
    // 处理旧格式
    console.log('Legacy numeric status:', status)
  } else {
    // 处理新格式
    console.log('New string status:', status)
  }
}
```

### 7.2. 场景 2：特殊标记值

```ts
// ✅ 特殊值 + 常规值
enum ResponseType {
  // 特殊标记（数字）
  None = 0,
  Unknown = -1,

  // 常规响应类型（字符串）
  Json = 'application/json',
  Xml = 'application/xml',
  Html = 'text/html',
  Text = 'text/plain',
}

function getContentType(type: ResponseType): string {
  if (type === ResponseType.None || type === ResponseType.Unknown) {
    return ''
  }
  return type
}
```

### 7.3. 场景 3：错误码系统

```ts
// ✅ 数字错误码 + 字符串消息
enum ErrorInfo {
  // 错误码（数字）
  NotFound = 404,
  ServerError = 500,
  BadRequest = 400,

  // 错误类型（字符串）
  ValidationError = 'VALIDATION_ERROR',
  NetworkError = 'NETWORK_ERROR',
  DatabaseError = 'DATABASE_ERROR',
}

class AppError extends Error {
  constructor(public code: ErrorInfo, message?: string) {
    super(message || String(code))
  }

  isHttpError(): boolean {
    return typeof this.code === 'number'
  }

  isApplicationError(): boolean {
    return typeof this.code === 'string'
  }
}

const error1 = new AppError(ErrorInfo.NotFound)
const error2 = new AppError(ErrorInfo.ValidationError)
```

## 8. 🤔 常见错误和最佳实践

### 8.1. 错误 1：忘记字符串后的初始化

```ts
// ❌ 字符串后必须初始化
enum Bad {
  A = 1,
  B = 'B',
  // C  // Error
}

// ✅ 显式初始化
enum Good {
  A = 1,
  B = 'B',
  C = 2,
}
```

### 8.2. 错误 2：期望字符串成员有反向映射

```ts
// ❌ 假设所有成员都有反向映射
enum Mixed {
  Num = 1,
  Str = 'STR',
}

console.log(Mixed[1]) // 'Num' ✅
console.log(Mixed['STR']) // undefined ❌

// ✅ 只对数字成员使用反向映射
function getNumericName(value: number): string | undefined {
  return Mixed[value]
}
```

### 8.3. 错误 3：类型不一致导致的问题

```ts
// ❌ 比较时的类型问题
enum Status {
  None = 0,
  Active = 'ACTIVE',
}

const status: Status = Status.Active

// 类型不匹配
if (status === 0) {
  // 比较 string 和 number
  // 永远不会执行
}

// ✅ 使用枚举成员比较
if (status === Status.None) {
  // 正确
}
```

### 8.4. 最佳实践

```ts
// ✅ 1. 避免使用异构枚举（最佳实践）
// 使用两个独立的枚举
enum StatusCode {
  Unknown = 0,
  Success = 1,
  Error = 2,
}

enum StatusMessage {
  Unknown = 'UNKNOWN',
  Success = 'SUCCESS',
  Error = 'ERROR',
}

// ✅ 2. 如必须使用，分组定义
enum Config {
  // 数字配置
  Port = 3000,
  Timeout = 5000,
  MaxRetries = 3,

  // 字符串配置
  Host = 'localhost',
  Protocol = 'http',
  Endpoint = '/api',
}

// ✅ 3. 提供辅助函数
enum Mixed {
  Num = 1,
  Str = 'STR',
}

namespace Mixed {
  export function isNumeric(value: Mixed): value is 1 {
    return typeof value === 'number'
  }

  export function isString(value: Mixed): value is 'STR' {
    return typeof value === 'string'
  }

  export function getType(value: Mixed): 'number' | 'string' {
    return typeof value === 'number' ? 'number' : 'string'
  }
}

// ✅ 4. 文档化混合原因
/
 * 配置枚举
 *
 * @remarks
 * 使用异构枚举是为了兼容旧系统：
 * - 数字值：旧系统使用的代码
 * - 字符串值：新系统使用的标识符
 *
 * @deprecated 计划在 v3.0 中移除数字值
 */
enum LegacyConfig {
  OldCode = 100,
  NewId = 'NEW_ID',
}

// ✅ 5. 使用映射对象代替
// 更好的替代方案
const StatusMap = {
  codes: {
    Unknown: 0,
    Success: 1,
    Error: 2,
  },
  messages: {
    Unknown: 'UNKNOWN',
    Success: 'SUCCESS',
    Error: 'ERROR',
  },
} as const

type StatusCode = (typeof StatusMap.codes)[keyof typeof StatusMap.codes]
type StatusMessage =
  (typeof StatusMap.messages)[keyof typeof StatusMap.messages]

// ✅ 6. 迁移策略
// 旧枚举
enum OldEnum {
  Value1 = 1,
  Value2 = 'TWO',
}

// 新的独立枚举
enum NewNumeric {
  Value1 = 1,
}

enum NewString {
  Value2 = 'TWO',
}

// 兼容层
type OldEnumCompat = NewNumeric | NewString

// ✅ 7. 类型守卫
function processValue(value: Mixed): void {
  if (Mixed.isNumeric(value)) {
    // 处理数字
    console.log('Numeric:', value)
  } else {
    // 处理字符串
    console.log('String:', value)
  }
}

// ✅ 8. 使用联合类型替代
type StatusValue =
  | { type: 'code'; value: number }
  | { type: 'message'; value: string }

function createStatus(code: number): StatusValue
function createStatus(message: string): StatusValue
function createStatus(value: number | string): StatusValue {
  if (typeof value === 'number') {
    return { type: 'code', value }
  }
  return { type: 'message', value }
}

// ✅ 9. 重构建议
// 不好：异构枚举
enum Bad {
  Code = 200,
  Status = 'OK',
}

// 好：分离关注点
interface Response {
  code: number
  status: string
}

enum HttpCode {
  OK = 200,
  NotFound = 404,
}

enum HttpStatus {
  OK = 'OK',
  NotFound = 'Not Found',
}

// ✅ 10. 团队约定
/
 * 团队规范：禁止使用异构枚举
 *
 * ❌ 禁止
 * enum Mixed { A = 1, B = 'B' }
 *
 * ✅ 推荐
 * enum Numeric { A = 1, B = 2 }
 * enum String { A = 'A', B = 'B' }
 */
```

## 9. 🔗 引用

- [TypeScript Handbook - Enums][1]
- [TypeScript Deep Dive - Heterogeneous Enums][2]
- [TypeScript Best Practices - Avoid Heterogeneous Enums][3]

[1]: https://www.typescriptlang.org/docs/handbook/enums.html
[2]: https://basarat.gitbook.io/typescript/type-system/enums#heterogeneous-enums
[3]: https://www.typescriptlang.org/docs/handbook/enums.html#heterogeneous-enums
