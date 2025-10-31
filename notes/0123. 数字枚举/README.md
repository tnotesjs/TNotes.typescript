# [0123. 数字枚举](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0123.%20%E6%95%B0%E5%AD%97%E6%9E%9A%E4%B8%BE)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是数字枚举？](#3--什么是数字枚举)
- [4. 🤔 基本语法](#4--基本语法)
  - [4.1. 默认从 0 开始](#41-默认从-0-开始)
  - [4.2. 自定义起始值](#42-自定义起始值)
  - [4.3. 完全手动赋值](#43-完全手动赋值)
  - [4.4. 编译结果](#44-编译结果)
- [5. 🤔 初始化规则](#5--初始化规则)
  - [5.1. 自动递增](#51-自动递增)
  - [5.2. 多段递增](#52-多段递增)
  - [5.3. 负数和间隔](#53-负数和间隔)
- [6. 🤔 反向映射](#6--反向映射)
  - [6.1. 双向访问](#61-双向访问)
  - [6.2. 实际应用](#62-实际应用)
  - [6.3. 类型安全的反向映射](#63-类型安全的反向映射)
- [7. 🤔 计算成员](#7--计算成员)
  - [7.1. 常量表达式](#71-常量表达式)
  - [7.2. 运算表达式](#72-运算表达式)
  - [7.3. 常量成员 vs 计算成员](#73-常量成员-vs-计算成员)
- [8. 🤔 常见使用场景](#8--常见使用场景)
  - [8.1. 场景 1：状态码](#81-场景-1状态码)
  - [8.2. 场景 2：优先级和等级](#82-场景-2优先级和等级)
  - [8.3. 场景 3：状态机](#83-场景-3状态机)
  - [8.4. 场景 4：权限管理](#84-场景-4权限管理)
  - [8.5. 场景 5：游戏开发](#85-场景-5游戏开发)
  - [8.6. 场景 6：配置选项](#86-场景-6配置选项)
  - [8.7. 场景 7：错误代码](#87-场景-7错误代码)
- [9. 🤔 常见错误和最佳实践](#9--常见错误和最佳实践)
  - [9.1. 错误 1：枚举值冲突](#91-错误-1枚举值冲突)
  - [9.2. 错误 2：混用计算和非计算成员](#92-错误-2混用计算和非计算成员)
  - [9.3. 错误 3：反向映射的误用](#93-错误-3反向映射的误用)
  - [9.4. 错误 4：枚举比较错误](#94-错误-4枚举比较错误)
  - [9.5. 最佳实践](#95-最佳实践)
- [10. 🔗 引用](#10--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 数字枚举的定义和特性
- 自动递增和手动赋值
- 反向映射机制
- 计算成员和常量成员
- 实际应用场景

## 2. 🫧 评价

数字枚举（Numeric Enum）是 TypeScript 中**使用数字作为值的枚举类型**。

数字枚举的特点：

- **自动递增**：成员值自动递增
- **反向映射**：支持从值获取名称
- **类型安全**：编译时检查
- **编译产物**：编译为 JavaScript 对象

数字枚举 vs 字符串枚举：

| 特性         | 数字枚举 | 字符串枚举 |
| ------------ | -------- | ---------- |
| **值类型**   | 数字     | 字符串     |
| **自动递增** | 支持     | 不支持     |
| **反向映射** | 支持     | 不支持     |
| **可读性**   | 较差     | 较好       |
| **序列化**   | 数字     | 字符串     |

数字枚举的优势：

1. **简洁性**：不需要为每个成员赋值
2. **性能**：数字比较更快
3. **兼容性**：与 JavaScript 数字无缝集成
4. **反向查找**：可以通过值获取名称

理解数字枚举，能帮助你：

1. 定义有序的常量集合
2. 实现状态码和错误码
3. 表示优先级和等级
4. 处理需要数字值的场景

数字枚举是 TypeScript 最基础的枚举类型，是组织常量的重要工具。

## 3. 🤔 什么是数字枚举？

数字枚举是**成员值为数字的枚举类型**，默认从 0 开始自动递增。

```ts
// ✅ 基本数字枚举
enum Direction {
  Up, // 0
  Down, // 1
  Left, // 2
  Right, // 3
}

const dir: Direction = Direction.Up
console.log(dir) // 0
console.log(Direction[0]) // 'Up' - 反向映射

// ✅ 手动指定起始值
enum Status {
  Pending = 1,
  Active, // 2
  Inactive, // 3
  Deleted, // 4
}

// ✅ 使用枚举
function getStatusName(status: Status): string {
  return Status[status]
}

console.log(getStatusName(Status.Active)) // 'Active'
```

**关键概念**：

- **自动递增**：未赋值的成员自动递增
- **数字值**：成员值是数字类型
- **反向映射**：既可以通过名称访问值，也可以通过值访问名称
- **编译结果**：编译为双向映射的对象

## 4. 🤔 基本语法

### 4.1. 默认从 0 开始

```ts
// ✅ 默认从 0 开始递增
enum Color {
  Red, // 0
  Green, // 1
  Blue, // 2
}

console.log(Color.Red) // 0
console.log(Color.Green) // 1
console.log(Color.Blue) // 2

// 反向映射
console.log(Color[0]) // 'Red'
console.log(Color[1]) // 'Green'
console.log(Color[2]) // 'Blue'
```

### 4.2. 自定义起始值

```ts
// ✅ 从 1 开始
enum Month {
  January = 1,
  February, // 2
  March, // 3
  April, // 4
  May, // 5
  June, // 6
  July, // 7
  August, // 8
  September, // 9
  October, // 10
  November, // 11
  December, // 12
}

console.log(Month.January) // 1
console.log(Month.December) // 12
```

### 4.3. 完全手动赋值

```ts
// ✅ 每个成员手动赋值
enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  InternalServerError = 500,
}

function handleStatus(status: HttpStatus): void {
  switch (status) {
    case HttpStatus.OK:
      console.log('Success')
      break
    case HttpStatus.NotFound:
      console.log('Not found')
      break
    default:
      console.log('Other status')
  }
}
```

### 4.4. 编译结果

```ts
// TypeScript 代码
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

// 编译为 JavaScript
var Direction
;(function (Direction) {
  Direction[(Direction['Up'] = 0)] = 'Up'
  Direction[(Direction['Down'] = 1)] = 'Down'
  Direction[(Direction['Left'] = 2)] = 'Left'
  Direction[(Direction['Right'] = 3)] = 'Right'
})(Direction || (Direction = {}))

// 等价于
const Direction = {
  Up: 0,
  Down: 1,
  Left: 2,
  Right: 3,
  0: 'Up',
  1: 'Down',
  2: 'Left',
  3: 'Right',
}
```

## 5. 🤔 初始化规则

### 5.1. 自动递增

```ts
// ✅ 从第一个初始化成员开始递增
enum Level {
  Low, // 0
  Medium, // 1
  High = 5, // 5
  Critical, // 6 - 从 5 开始递增
}

console.log(Level.Low) // 0
console.log(Level.Medium) // 1
console.log(Level.High) // 5
console.log(Level.Critical) // 6
```

### 5.2. 多段递增

```ts
// ✅ 可以有多个初始化点
enum Priority {
  Lowest = 0,
  Low, // 1
  Medium = 5,
  High, // 6
  Highest = 10,
}

console.log(Priority.Low) // 1
console.log(Priority.High) // 6
console.log(Priority.Highest) // 10
```

### 5.3. 负数和间隔

```ts
// ✅ 可以使用负数
enum Temperature {
  FreezingPoint = -10,
  Cold, // -9
  Cool, // -8
  Warm = 10,
  Hot, // 11
  Boiling = 100,
}

// ✅ 可以有间隔
enum ErrorCode {
  Success = 0,
  Warning = 100,
  Error = 200,
  Critical = 300,
}
```

## 6. 🤔 反向映射

### 6.1. 双向访问

```ts
// ✅ 数字枚举支持反向映射
enum Status {
  Draft,
  Published,
  Archived,
}

// 正向映射：名称 -> 值
console.log(Status.Draft) // 0
console.log(Status.Published) // 1

// 反向映射：值 -> 名称
console.log(Status[0]) // 'Draft'
console.log(Status[1]) // 'Published'
```

### 6.2. 实际应用

```ts
// ✅ 动态获取枚举名称
enum UserRole {
  Guest = 1,
  User,
  Admin,
  SuperAdmin,
}

function getRoleName(role: UserRole): string {
  return UserRole[role]
}

console.log(getRoleName(UserRole.Admin)) // 'Admin'
console.log(getRoleName(3)) // 'Admin'

// ✅ 遍历枚举
function getAllRoles(): string[] {
  return Object.keys(UserRole).filter((key) => isNaN(Number(key)))
}

console.log(getAllRoles()) // ['Guest', 'User', 'Admin', 'SuperAdmin']
```

### 6.3. 类型安全的反向映射

```ts
// ✅ 类型安全的反向查找
enum Color {
  Red,
  Green,
  Blue,
}

function getColorName(value: number): string | undefined {
  if (value in Color && typeof Color[value] === 'string') {
    return Color[value]
  }
  return undefined
}

console.log(getColorName(0)) // 'Red'
console.log(getColorName(99)) // undefined
```

## 7. 🤔 计算成员

### 7.1. 常量表达式

```ts
// ✅ 使用常量表达式
enum FileAccess {
  None = 0,
  Read = 1 << 0, // 1
  Write = 1 << 1, // 2
  ReadWrite = Read | Write, // 3
  Execute = 1 << 2, // 4
}

console.log(FileAccess.Read) // 1
console.log(FileAccess.Write) // 2
console.log(FileAccess.ReadWrite) // 3
```

### 7.2. 运算表达式

```ts
// ✅ 数学运算
enum Size {
  Small = 10,
  Medium = Small * 2, // 20
  Large = Medium * 2, // 40
  XLarge = Large + 10, // 50
}

// ✅ 位运算
enum Permissions {
  None = 0,
  Read = 1 << 0, // 1
  Write = 1 << 1, // 2
  Delete = 1 << 2, // 4
  Admin = Read | Write | Delete, // 7
}

function hasPermission(user: number, permission: Permissions): boolean {
  return (user & permission) === permission
}

const userPerms = Permissions.Read | Permissions.Write
console.log(hasPermission(userPerms, Permissions.Read)) // true
console.log(hasPermission(userPerms, Permissions.Delete)) // false
```

### 7.3. 常量成员 vs 计算成员

```ts
// ✅ 常量成员
enum ConstantEnum {
  A = 1,
  B = A * 2, // 常量表达式
  C = 1 + 2, // 常量表达式
}

// ❌ 计算成员（需要运行时计算）
const value = 10
enum ComputedEnum {
  A = 1,
  // B = value,        // Error: 需要常量表达式
  // C = Math.random() // Error: 需要常量表达式
}

// ✅ 使用函数（const enum 不支持）
function getValue() {
  return 10
}

enum MixedEnum {
  A = 1,
  B = 2,
  // C = getValue()  // Error in const enum
}
```

## 8. 🤔 常见使用场景

### 8.1. 场景 1：状态码

```ts
// ✅ HTTP 状态码
enum HttpStatusCode {
  // 2xx Success
  OK = 200,
  Created = 201,
  Accepted = 202,
  NoContent = 204,

  // 3xx Redirection
  MovedPermanently = 301,
  Found = 302,
  NotModified = 304,

  // 4xx Client Error
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,

  // 5xx Server Error
  InternalServerError = 500,
  BadGateway = 502,
  ServiceUnavailable = 503,
}

function handleResponse(status: HttpStatusCode): void {
  if (status >= 200 && status < 300) {
    console.log('Success')
  } else if (status >= 400 && status < 500) {
    console.log('Client error')
  } else if (status >= 500) {
    console.log('Server error')
  }
}
```

### 8.2. 场景 2：优先级和等级

```ts
// ✅ 日志级别
enum LogLevel {
  Trace,
  Debug,
  Info,
  Warn,
  Error,
  Fatal,
}

class Logger {
  constructor(private minLevel: LogLevel = LogLevel.Info) {}

  log(level: LogLevel, message: string): void {
    if (level >= this.minLevel) {
      console.log(`[${LogLevel[level]}] ${message}`)
    }
  }

  trace(message: string): void {
    this.log(LogLevel.Trace, message)
  }

  debug(message: string): void {
    this.log(LogLevel.Debug, message)
  }

  info(message: string): void {
    this.log(LogLevel.Info, message)
  }

  error(message: string): void {
    this.log(LogLevel.Error, message)
  }
}

const logger = new Logger(LogLevel.Warn)
logger.info('Info message') // 不输出
logger.error('Error message') // 输出
```

### 8.3. 场景 3：状态机

```ts
// ✅ 订单状态
enum OrderStatus {
  Pending,
  Confirmed,
  Processing,
  Shipped,
  Delivered,
  Cancelled,
}

class Order {
  constructor(private status: OrderStatus = OrderStatus.Pending) {}

  getStatus(): OrderStatus {
    return this.status
  }

  getStatusName(): string {
    return OrderStatus[this.status]
  }

  canTransitionTo(newStatus: OrderStatus): boolean {
    const transitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.Pending]: [OrderStatus.Confirmed, OrderStatus.Cancelled],
      [OrderStatus.Confirmed]: [OrderStatus.Processing, OrderStatus.Cancelled],
      [OrderStatus.Processing]: [OrderStatus.Shipped, OrderStatus.Cancelled],
      [OrderStatus.Shipped]: [OrderStatus.Delivered],
      [OrderStatus.Delivered]: [],
      [OrderStatus.Cancelled]: [],
    }

    return transitions[this.status].includes(newStatus)
  }

  transitionTo(newStatus: OrderStatus): boolean {
    if (this.canTransitionTo(newStatus)) {
      this.status = newStatus
      return true
    }
    return false
  }
}

const order = new Order()
console.log(order.getStatusName()) // 'Pending'
order.transitionTo(OrderStatus.Confirmed)
console.log(order.getStatusName()) // 'Confirmed'
```

### 8.4. 场景 4：权限管理

```ts
// ✅ 位标志权限
enum Permission {
  None = 0,
  Read = 1 << 0, // 1
  Write = 1 << 1, // 2
  Delete = 1 << 2, // 4
  Execute = 1 << 3, // 8
  Admin = Read | Write | Delete | Execute, // 15
}

class PermissionManager {
  constructor(private permissions: Permission = Permission.None) {}

  grant(permission: Permission): void {
    this.permissions |= permission
  }

  revoke(permission: Permission): void {
    this.permissions &= ~permission
  }

  has(permission: Permission): boolean {
    return (this.permissions & permission) === permission
  }

  hasAny(...permissions: Permission[]): boolean {
    return permissions.some((p) => this.has(p))
  }

  hasAll(...permissions: Permission[]): boolean {
    return permissions.every((p) => this.has(p))
  }

  getPermissions(): string[] {
    const perms: string[] = []
    for (const key in Permission) {
      if (isNaN(Number(key))) {
        const value = Permission[key as keyof typeof Permission]
        if (typeof value === 'number' && value !== Permission.None) {
          if (this.has(value)) {
            perms.push(key)
          }
        }
      }
    }
    return perms
  }
}

const pm = new PermissionManager()
pm.grant(Permission.Read)
pm.grant(Permission.Write)

console.log(pm.has(Permission.Read)) // true
console.log(pm.has(Permission.Delete)) // false
console.log(pm.getPermissions()) // ['Read', 'Write']
```

### 8.5. 场景 5：游戏开发

```ts
// ✅ 游戏方向
enum Direction {
  North,
  East,
  South,
  West,
}

interface Position {
  x: number
  y: number
}

class Character {
  constructor(private position: Position = { x: 0, y: 0 }) {}

  move(direction: Direction, steps: number = 1): void {
    switch (direction) {
      case Direction.North:
        this.position.y += steps
        break
      case Direction.East:
        this.position.x += steps
        break
      case Direction.South:
        this.position.y -= steps
        break
      case Direction.West:
        this.position.x -= steps
        break
    }
  }

  getPosition(): Position {
    return { ...this.position }
  }

  turnRight(current: Direction): Direction {
    return (current + 1) % 4
  }

  turnLeft(current: Direction): Direction {
    return (current + 3) % 4
  }
}

const player = new Character()
player.move(Direction.North, 5)
player.move(Direction.East, 3)
console.log(player.getPosition()) // { x: 3, y: 5 }
```

### 8.6. 场景 6：配置选项

```ts
// ✅ 缓存策略
enum CacheStrategy {
  NoCache,
  Memory,
  Disk,
  Distributed,
}

interface CacheConfig {
  strategy: CacheStrategy
  ttl: number
  maxSize?: number
}

class Cache {
  constructor(private config: CacheConfig) {}

  set(key: string, value: any): void {
    switch (this.config.strategy) {
      case CacheStrategy.NoCache:
        // 不缓存
        break
      case CacheStrategy.Memory:
        console.log('Caching in memory')
        break
      case CacheStrategy.Disk:
        console.log('Caching on disk')
        break
      case CacheStrategy.Distributed:
        console.log('Caching in distributed cache')
        break
    }
  }

  getStrategyName(): string {
    return CacheStrategy[this.config.strategy]
  }
}

const cache = new Cache({
  strategy: CacheStrategy.Memory,
  ttl: 3600,
})

console.log(cache.getStrategyName()) // 'Memory'
```

### 8.7. 场景 7：错误代码

```ts
// ✅ 应用错误码
enum ErrorCode {
  // 系统错误 1000-1999
  SystemError = 1000,
  DatabaseError = 1001,
  NetworkError = 1002,

  // 业务错误 2000-2999
  ValidationError = 2000,
  AuthenticationError = 2001,
  AuthorizationError = 2002,
  NotFoundError = 2003,

  // 用户错误 3000-3999
  InvalidInput = 3000,
  DuplicateEntry = 3001,
  ResourceLocked = 3002,
}

class AppError extends Error {
  constructor(public code: ErrorCode, message: string) {
    super(message)
    this.name = ErrorCode[code]
  }

  isSystemError(): boolean {
    return this.code >= 1000 && this.code < 2000
  }

  isBusinessError(): boolean {
    return this.code >= 2000 && this.code < 3000
  }

  isUserError(): boolean {
    return this.code >= 3000 && this.code < 4000
  }
}

function handleError(error: AppError): void {
  console.log(`Error ${error.code} (${error.name}): ${error.message}`)

  if (error.isSystemError()) {
    console.log('System error occurred')
  } else if (error.isUserError()) {
    console.log('User error occurred')
  }
}

const error = new AppError(ErrorCode.InvalidInput, 'Invalid email format')
handleError(error)
```

## 9. 🤔 常见错误和最佳实践

### 9.1. 错误 1：枚举值冲突

```ts
// ❌ 不同成员具有相同的值
enum Bad {
  A = 1,
  B, // 2
  C = 2, // 与 B 冲突
}

console.log(Bad.B === Bad.C) // true
console.log(Bad[2]) // 'C' - 后者覆盖前者

// ✅ 确保值唯一
enum Good {
  A = 1,
  B = 2,
  C = 3,
}
```

### 9.2. 错误 2：混用计算和非计算成员

```ts
// ❌ 计算成员后必须初始化
enum Bad {
  A = 1,
  B = 2 * 2,
  // C           // Error: 需要初始化
}

// ✅ 正确的顺序
enum Good {
  A = 1,
  B, // 2 - 在计算成员之前
  C = 2 * 2, // 4
  D = 5, // 计算成员后需要初始化
}
```

### 9.3. 错误 3：反向映射的误用

```ts
// ❌ 假设所有枚举都有反向映射
enum StringEnum {
  A = 'a',
  B = 'b',
}

// console.log(StringEnum['a'])  // undefined - 字符串枚举没有反向映射

// ✅ 只对数字枚举使用反向映射
enum NumberEnum {
  A,
  B,
}

console.log(NumberEnum[0]) // 'A'
```

### 9.4. 错误 4：枚举比较错误

```ts
// ❌ 直接比较枚举和数字
enum Status {
  Active = 1,
  Inactive = 2,
}

const value = 1
// if (value === Status.Active) {}  // 虽然可以，但不推荐

// ✅ 使用枚举成员
const status: Status = Status.Active
if (status === Status.Active) {
  console.log('Active')
}
```

### 9.5. 最佳实践

```ts
// ✅ 1. 显式指定所有值或只指定第一个
enum Explicit {
  A = 0,
  B = 1,
  C = 2,
}

enum FirstOnly {
  A = 1, // 显式指定第一个
  B, // 2
  C, // 3
}

// ✅ 2. 使用有意义的起始值
enum Month {
  January = 1, // 月份从 1 开始更自然
  February,
  March,
}

enum HttpStatus {
  OK = 200, // 使用标准的 HTTP 状态码
  NotFound = 404,
  InternalServerError = 500,
}

// ✅ 3. 分组相关的值
enum ErrorLevel {
  // 信息级别 0-99
  Info = 0,
  Debug = 1,

  // 警告级别 100-199
  Warning = 100,
  Deprecated = 101,

  // 错误级别 200-299
  Error = 200,
  Critical = 201,
  Fatal = 202,
}

// ✅ 4. 使用位标志表示组合权限
enum Flags {
  None = 0,
  Flag1 = 1 << 0, // 1
  Flag2 = 1 << 1, // 2
  Flag3 = 1 << 2, // 4
  All = Flag1 | Flag2 | Flag3, // 7
}

// ✅ 5. 提供辅助函数
enum Status {
  Draft,
  Published,
  Archived,
}

namespace Status {
  export function isValid(value: number): value is Status {
    return value in Status && typeof Status[value] === 'string'
  }

  export function parse(value: string): Status | undefined {
    return Status[value as keyof typeof Status]
  }

  export function getAll(): Status[] {
    return Object.keys(Status)
      .filter((key) => !isNaN(Number(Status[key as keyof typeof Status])))
      .map((key) => Status[key as keyof typeof Status]) as Status[]
  }
}

console.log(Status.isValid(0)) // true
console.log(Status.parse('Draft')) // 0
console.log(Status.getAll()) // [0, 1, 2]

// ✅ 6. 文档化枚举成员
/**
 * 用户角色枚举
 */
enum UserRole {
  /** 访客用户，只读权限 */
  Guest = 1,

  /** 普通用户，基本操作权限 */
  User = 2,

  /** 管理员，完全控制权限 */
  Admin = 3,

  /** 超级管理员，系统级权限 */
  SuperAdmin = 4,
}

// ✅ 7. 使用 const enum 优化性能（编译时内联）
const enum Direction {
  Up,
  Down,
  Left,
  Right,
}

const dir = Direction.Up // 编译为: const dir = 0

// ✅ 8. 类型守卫
function isStatus(value: any): value is Status {
  return typeof value === 'number' && value in Status
}

function processStatus(value: unknown): void {
  if (isStatus(value)) {
    console.log(Status[value])
  }
}

// ✅ 9. 避免魔法数字
// ❌ 不好
function setLevel(level: number) {
  if (level === 0) {
  }
  if (level === 1) {
  }
}

// ✅ 好
enum Level {
  Low,
  Medium,
  High,
}

function setLevel(level: Level) {
  if (level === Level.Low) {
  }
}

// ✅ 10. 枚举作为对象键
enum Key {
  First,
  Second,
  Third,
}

type Config = {
  [K in Key]: string
}

const config: Config = {
  [Key.First]: 'first',
  [Key.Second]: 'second',
  [Key.Third]: 'third',
}
```

## 10. 🔗 引用

- [TypeScript Handbook - Enums][1]
- [TypeScript Deep Dive - Enums][2]
- [TypeScript Enum Best Practices][3]

[1]: https://www.typescriptlang.org/docs/handbook/enums.html
[2]: https://basarat.gitbook.io/typescript/type-system/enums
[3]: https://www.typescriptlang.org/docs/handbook/enums.html#enums-at-runtime
