# [0128. 枚举成员的类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0128.%20%E6%9E%9A%E4%B8%BE%E6%88%90%E5%91%98%E7%9A%84%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是枚举成员的类型？](#3--什么是枚举成员的类型)
- [4. 🤔 字面量枚举成员](#4--字面量枚举成员)
  - [4.1. 什么是字面量枚举成员](#41-什么是字面量枚举成员)
  - [4.2. 字面量枚举成员的条件](#42-字面量枚举成员的条件)
  - [4.3. 字面量枚举的特性](#43-字面量枚举的特性)
- [5. 🤔 枚举成员作为类型](#5--枚举成员作为类型)
  - [5.1. 单个成员类型](#51-单个成员类型)
  - [5.2. 成员类型的值](#52-成员类型的值)
  - [5.3. 成员类型的兼容性](#53-成员类型的兼容性)
- [6. 🤔 枚举类型的行为](#6--枚举类型的行为)
  - [6.1. 类型收窄](#61-类型收窄)
  - [6.2. 详尽性检查](#62-详尽性检查)
  - [6.3. 枚举 vs 字面量类型](#63-枚举-vs-字面量类型)
- [7. 🤔 联合枚举类型](#7--联合枚举类型)
  - [7.1. 创建联合类型](#71-创建联合类型)
  - [7.2. 条件类型与枚举](#72-条件类型与枚举)
  - [7.3. 映射枚举类型](#73-映射枚举类型)
- [8. 🤔 实际应用场景](#8--实际应用场景)
  - [8.1. 场景 1：状态机](#81-场景-1状态机)
  - [8.2. 场景 2：权限控制](#82-场景-2权限控制)
  - [8.3. 场景 3：API 响应类型](#83-场景-3api-响应类型)
  - [8.4. 场景 4：配置选项](#84-场景-4配置选项)
  - [8.5. 场景 5：表单验证](#85-场景-5表单验证)
- [9. 🤔 常见错误和最佳实践](#9--常见错误和最佳实践)
  - [9.1. 错误 1：混淆枚举类型和成员类型](#91-错误-1混淆枚举类型和成员类型)
  - [9.2. 错误 2：不当的类型断言](#92-错误-2不当的类型断言)
  - [9.3. 错误 3：忽略详尽性检查](#93-错误-3忽略详尽性检查)
  - [9.4. 最佳实践](#94-最佳实践)
- [10. 🔗 引用](#10--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 枚举成员的类型特性
- 字面量枚举成员的定义
- 枚举成员作为独立类型
- 联合枚举类型
- 类型收窄和类型守卫
- 实际应用场景

## 2. 🫧 评价

枚举成员的类型是 TypeScript 中枚举成员本身可以作为类型使用的特性。

枚举成员类型的特点：

- 字面量类型：特定枚举成员是字面量类型
- 类型收窄：可以精确到单个成员
- 联合类型：多个成员形成联合
- 类型安全：编译时精确检查

枚举成员类型 vs 枚举类型：

| 特性     | 枚举成员类型 | 枚举类型   |
| -------- | ------------ | ---------- |
| 范围     | 单个成员     | 所有成员   |
| 精确度   | 最精确       | 较宽泛     |
| 用途     | 特定值检查   | 通用枚举值 |
| 类型收窄 | 自动收窄     | 需要判断   |

枚举成员类型的优势：

1. 精确性：类型更加精确
2. 安全性：防止错误的值
3. 可读性：意图更清晰
4. 智能提示：更好的 IDE 支持

## 3. 🤔 什么是枚举成员的类型？

枚举成员的类型是指枚举的单个成员可以作为独立的类型使用。

```ts
// ✅ 枚举定义
enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING',
}

// ✅ 使用整个枚举作为类型
function setStatus1(status: Status): void {
  // status 可以是 Status 的任何成员
}

// ✅ 使用单个枚举成员作为类型
function setActive(status: Status.Active): void {
  // status 只能是 Status.Active
  console.log(status) // 类型: Status.Active
}

// ✅ 使用多个枚举成员的联合
function setActiveOrPending(status: Status.Active | Status.Pending): void {
  // status 只能是这两个值之一
}

setActive(Status.Active) // ✅
// setActive(Status.Inactive)   // ❌ Error
```

关键概念：

- 成员类型：枚举成员本身是类型
- 字面量类型：成员类型是字面量类型
- 类型收窄：可以收窄到具体成员
- 联合类型：多个成员可以组合

## 4. 🤔 字面量枚举成员

### 4.1. 什么是字面量枚举成员

字面量枚举成员是在编译时就能确定值的枚举成员。

```ts
// ✅ 字面量枚举成员
enum Literal {
  A, // 无初始化器（默认 0）
  B = 1, // 数字字面量
  C = 'C', // 字符串字面量
  D = B + 2, // 常量表达式
  E = 1 << 2, // 位运算表达式
}

// ❌ 非字面量枚举成员
const value = 10
enum NonLiteral {
  A = value, // 引用外部变量
  B = Math.random(), // 运行时计算
  C = getValue(), // 函数调用
}

function getValue() {
  return 1
}
```

### 4.2. 字面量枚举成员的条件

```ts
// ✅ 满足字面量条件的场景

// 1. 无初始化器
enum E1 {
  A, // 字面量（默认 0）
}

// 2. 数字字面量
enum E2 {
  A = 100, // 字面量
}

// 3. 字符串字面量
enum E3 {
  A = 'VALUE', // 字面量
}

// 4. 一元 - 运算符
enum E4 {
  A = -100, // 字面量
}

// 5. 引用其他字面量枚举成员
enum E5 {
  A = 1,
  B = A + 2, // 字面量（常量表达式）
}

// 6. 位运算
enum E6 {
  A = 1 << 0,
  B = 1 << 1,
  C = A | B, // 字面量
}
```

### 4.3. 字面量枚举的特性

```ts
// ✅ 字面量枚举的所有成员都是字面量
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

// 每个成员都可以作为类型
type UpType = Direction.Up // 0
type DownType = Direction.Down // 1

// ✅ 字面量枚举类型可以被收窄
function move(dir: Direction): void {
  if (dir === Direction.Up) {
    // 这里 dir 的类型被收窄为 Direction.Up
    const specific: Direction.Up = dir // ✅
  }
}
```

## 5. 🤔 枚举成员作为类型

### 5.1. 单个成员类型

```ts
// ✅ 使用单个枚举成员作为类型
enum Status {
  Draft = 'DRAFT',
  Published = 'PUBLISHED',
  Archived = 'ARCHIVED',
}

// 只接受 Draft 状态
function saveDraft(status: Status.Draft): void {
  console.log('Saving draft')
}

saveDraft(Status.Draft) // ✅
// saveDraft(Status.Published)  // ❌ Error

// ✅ 用于对象属性
interface Article {
  title: string
  status: Status.Published // 只能是 Published
}

const article: Article = {
  title: 'Hello',
  status: Status.Published, // ✅
  // status: Status.Draft   // ❌ Error
}
```

### 5.2. 成员类型的值

```ts
// ✅ 枚举成员类型的实际值
enum Color {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE',
}

// Color.Red 既是值，也是类型
type RedType = Color.Red // 类型: Color.Red
const redValue = Color.Red // 值: 'RED'

// 类型检查
function setRed(color: Color.Red): void {
  console.log(color) // 'RED'
}

// ✅ typeof 获取枚举成员的类型
type RedValueType = typeof Color.Red // Color.Red
```

### 5.3. 成员类型的兼容性

```ts
enum Priority {
  Low = 1,
  Medium = 2,
  High = 3,
}

// ✅ 枚举成员类型是严格的
function setHigh(p: Priority.High): void {}

setHigh(Priority.High) // ✅
// setHigh(3)           // ❌ Error: 数字 3 不兼容 Priority.High
// setHigh(Priority.Medium)  // ❌ Error

// ✅ 但枚举类型本身接受数字
function setPriority(p: Priority): void {}

setPriority(Priority.High) // ✅
setPriority(3) // ✅ (对于数字枚举)
```

## 6. 🤔 枚举类型的行为

### 6.1. 类型收窄

```ts
enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING',
}

function handleStatus(status: Status): void {
  // ✅ 类型收窄
  if (status === Status.Active) {
    // 这里 status 类型被收窄为 Status.Active
    const active: Status.Active = status // ✅
  } else if (status === Status.Inactive) {
    // 这里 status 类型被收窄为 Status.Inactive
    const inactive: Status.Inactive = status // ✅
  } else {
    // 这里 status 类型被收窄为 Status.Pending
    const pending: Status.Pending = status // ✅
  }
}
```

### 6.2. 详尽性检查

```ts
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

// ✅ 详尽性检查
function move(dir: Direction): string {
  switch (dir) {
    case Direction.Up:
      return 'Moving up'
    case Direction.Down:
      return 'Moving down'
    case Direction.Left:
      return 'Moving left'
    case Direction.Right:
      return 'Moving right'
    // 所有情况都覆盖了
  }
}

// ✅ 使用 never 确保详尽
function moveStrict(dir: Direction): string {
  switch (dir) {
    case Direction.Up:
      return 'Moving up'
    case Direction.Down:
      return 'Moving down'
    case Direction.Left:
      return 'Moving left'
    case Direction.Right:
      return 'Moving right'
    default:
      // 如果漏掉任何情况，这里会报错
      const exhaustive: never = dir
      throw new Error(`Unhandled direction: ${exhaustive}`)
  }
}
```

### 6.3. 枚举 vs 字面量类型

```ts
// ✅ 枚举类型
enum Color {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE',
}

function setColorEnum(color: Color): void {}

// ✅ 字符串字面量联合类型
type ColorLiteral = 'RED' | 'GREEN' | 'BLUE'

function setColorLiteral(color: ColorLiteral): void {}

// 区别
setColorEnum(Color.Red) // ✅
// setColorEnum('RED')   // ❌ Error: 字符串不兼容枚举

setColorLiteral('RED') // ✅
// setColorLiteral(Color.Red)  // ✅ 可以工作（值是 'RED'）
```

## 7. 🤔 联合枚举类型

### 7.1. 创建联合类型

```ts
enum Status {
  Draft = 'DRAFT',
  Review = 'REVIEW',
  Published = 'PUBLISHED',
  Archived = 'ARCHIVED',
}

// ✅ 枚举成员的联合类型
type EditableStatus = Status.Draft | Status.Review
type ReadonlyStatus = Status.Published | Status.Archived

function edit(status: EditableStatus): void {
  // status 只能是 Draft 或 Review
  console.log(`Editing with status: ${status}`)
}

edit(Status.Draft) // ✅
edit(Status.Review) // ✅
// edit(Status.Published)  // ❌ Error

function view(status: ReadonlyStatus): void {
  // status 只能是 Published 或 Archived
  console.log(`Viewing with status: ${status}`)
}
```

### 7.2. 条件类型与枚举

```ts
enum UserRole {
  Guest = 'GUEST',
  User = 'USER',
  Admin = 'ADMIN',
  SuperAdmin = 'SUPER_ADMIN',
}

// ✅ 根据角色提取权限类型
type AdminRoles = Extract<UserRole, UserRole.Admin | UserRole.SuperAdmin>
type NonAdminRoles = Exclude<UserRole, UserRole.Admin | UserRole.SuperAdmin>

function adminOnly(role: AdminRoles): void {
  console.log('Admin access')
}

adminOnly(UserRole.Admin) // ✅
adminOnly(UserRole.SuperAdmin) // ✅
// adminOnly(UserRole.User)     // ❌ Error
```

### 7.3. 映射枚举类型

```ts
enum Feature {
  Search = 'SEARCH',
  Filter = 'FILTER',
  Sort = 'SORT',
  Export = 'EXPORT',
}

// ✅ 映射枚举到对象类型
type FeatureFlags = {
  [K in Feature]: boolean
}

const flags: FeatureFlags = {
  [Feature.Search]: true,
  [Feature.Filter]: false,
  [Feature.Sort]: true,
  [Feature.Export]: false,
}

// ✅ 映射部分枚举成员
type CoreFeatures = Feature.Search | Feature.Filter
type CoreFeatureFlags = {
  [K in CoreFeatures]: boolean
}

const coreFlags: CoreFeatureFlags = {
  [Feature.Search]: true,
  [Feature.Filter]: false,
}
```

## 8. 🤔 实际应用场景

### 8.1. 场景 1：状态机

```ts
enum OrderStatus {
  Pending = 'PENDING',
  Confirmed = 'CONFIRMED',
  Processing = 'PROCESSING',
  Shipped = 'SHIPPED',
  Delivered = 'DELIVERED',
  Cancelled = 'CANCELLED',
}

// ✅ 不同状态下的允许操作
type CancellableStatus =
  | OrderStatus.Pending
  | OrderStatus.Confirmed
  | OrderStatus.Processing

type ShippableStatus = OrderStatus.Processing
type DeliverableStatus = OrderStatus.Shipped

class Order {
  constructor(private status: OrderStatus) {}

  getStatus(): OrderStatus {
    return this.status
  }

  // 只在可取消状态下允许取消
  cancel(currentStatus: CancellableStatus): void {
    if (this.status === currentStatus) {
      this.status = OrderStatus.Cancelled
    }
  }

  // 只在处理中状态下允许发货
  ship(currentStatus: ShippableStatus): void {
    if (this.status === currentStatus) {
      this.status = OrderStatus.Shipped
    }
  }

  // 只在已发货状态下允许确认送达
  deliver(currentStatus: DeliverableStatus): void {
    if (this.status === currentStatus) {
      this.status = OrderStatus.Delivered
    }
  }
}
```

### 8.2. 场景 2：权限控制

```ts
enum Permission {
  ReadPublic = 'READ_PUBLIC',
  ReadPrivate = 'READ_PRIVATE',
  Write = 'WRITE',
  Delete = 'DELETE',
  Admin = 'ADMIN',
}

// ✅ 定义不同级别的权限组合
type PublicPermissions = Permission.ReadPublic
type UserPermissions =
  | Permission.ReadPublic
  | Permission.ReadPrivate
  | Permission.Write
type ModeratorPermissions = UserPermissions | Permission.Delete
type AdminPermissions = Permission // 所有权限

class PermissionChecker {
  hasPermission<P extends Permission>(
    userPermissions: Set<Permission>,
    required: P
  ): boolean {
    return userPermissions.has(required)
  }

  requirePermission<P extends Permission>(
    userPermissions: Set<Permission>,
    required: P
  ): asserts userPermissions is Set<Permission> & { has(p: P): true } {
    if (!userPermissions.has(required)) {
      throw new Error(`Missing permission: ${required}`)
    }
  }
}

// ✅ 根据权限类型限制操作
function deleteContent(permission: Permission.Delete | Permission.Admin): void {
  console.log('Deleting content')
}

deleteContent(Permission.Delete) // ✅
deleteContent(Permission.Admin) // ✅
// deleteContent(Permission.Write)  // ❌ Error
```

### 8.3. 场景 3：API 响应类型

```ts
enum ResponseType {
  Success = 'SUCCESS',
  Error = 'ERROR',
  Warning = 'WARNING',
  Info = 'INFO',
}

// ✅ 根据响应类型定义不同的响应结构
interface SuccessResponse {
  type: ResponseType.Success
  data: any
}

interface ErrorResponse {
  type: ResponseType.Error
  error: {
    code: string
    message: string
  }
}

interface WarningResponse {
  type: ResponseType.Warning
  warnings: string[]
}

interface InfoResponse {
  type: ResponseType.Info
  info: string
}

type ApiResponse =
  | SuccessResponse
  | ErrorResponse
  | WarningResponse
  | InfoResponse

// ✅ 类型守卫
function isSuccess(res: ApiResponse): res is SuccessResponse {
  return res.type === ResponseType.Success
}

function isError(res: ApiResponse): res is ErrorResponse {
  return res.type === ResponseType.Error
}

// ✅ 处理响应
function handleResponse(response: ApiResponse): void {
  if (isSuccess(response)) {
    console.log('Data:', response.data)
  } else if (isError(response)) {
    console.error('Error:', response.error.message)
  } else if (response.type === ResponseType.Warning) {
    console.warn('Warnings:', response.warnings)
  } else {
    console.info('Info:', response.info)
  }
}
```

### 8.4. 场景 4：配置选项

```ts
enum LogLevel {
  Trace = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Fatal = 5,
}

// ✅ 不同环境使用不同的日志级别
type DevelopmentLogLevel = LogLevel.Trace | LogLevel.Debug | LogLevel.Info

type ProductionLogLevel = LogLevel.Warn | LogLevel.Error | LogLevel.Fatal

interface LoggerConfig<L extends LogLevel> {
  minLevel: L
  output: 'console' | 'file'
}

class Logger<L extends LogLevel> {
  constructor(private config: LoggerConfig<L>) {}

  log(level: L, message: string): void {
    if (level >= this.config.minLevel) {
      console.log(`[${LogLevel[level]}] ${message}`)
    }
  }
}

// 开发环境
const devLogger = new Logger<DevelopmentLogLevel>({
  minLevel: LogLevel.Debug,
  output: 'console',
})

// 生产环境
const prodLogger = new Logger<ProductionLogLevel>({
  minLevel: LogLevel.Warn,
  output: 'file',
})
```

### 8.5. 场景 5：表单验证

```ts
enum ValidationStatus {
  Valid = 'VALID',
  Invalid = 'INVALID',
  Pending = 'PENDING',
  Unknown = 'UNKNOWN',
}

// ✅ 根据验证状态定义不同的字段状态
interface ValidField {
  status: ValidationStatus.Valid
  value: string
}

interface InvalidField {
  status: ValidationStatus.Invalid
  value: string
  errors: string[]
}

interface PendingField {
  status: ValidationStatus.Pending
  value: string
}

type FieldState = ValidField | InvalidField | PendingField

// ✅ 类型守卫
function isValid(field: FieldState): field is ValidField {
  return field.status === ValidationStatus.Valid
}

function isInvalid(field: FieldState): field is InvalidField {
  return field.status === ValidationStatus.Invalid
}

// ✅ 处理字段状态
function submitIfValid(field: FieldState): void {
  if (isValid(field)) {
    console.log('Submitting:', field.value)
  } else if (isInvalid(field)) {
    console.error('Validation errors:', field.errors)
  } else {
    console.log('Validation pending')
  }
}
```

## 9. 🤔 常见错误和最佳实践

### 9.1. 错误 1：混淆枚举类型和成员类型

```ts
enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

// ❌ 期望单个成员但声明为整个枚举
function setActive(status: Status): void {
  // 这里 status 可能是任何 Status 值
  const active: Status.Active = status // ❌ Error
}

// ✅ 使用成员类型
function setActive(status: Status.Active): void {
  // 保证 status 是 Active
  const active: Status.Active = status // ✅
}
```

### 9.2. 错误 2：不当的类型断言

```ts
enum Color {
  Red = 'RED',
  Green = 'GREEN',
}

// ❌ 强制断言可能导致运行时错误
function getColor(): Color.Red {
  return 'GREEN' as Color.Red // 编译通过但运行时不正确
}

// ✅ 使用类型守卫
function getColor(color: Color): Color.Red | null {
  if (color === Color.Red) {
    return color // 类型安全
  }
  return null
}
```

### 9.3. 错误 3：忽略详尽性检查

```ts
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

// ❌ 没有处理所有情况
function move1(dir: Direction): string {
  if (dir === Direction.Up) return 'up'
  if (dir === Direction.Down) return 'down'
  // 遗漏了 Left 和 Right
  return '' // 不安全
}

// ✅ 详尽性检查
function move2(dir: Direction): string {
  switch (dir) {
    case Direction.Up:
      return 'up'
    case Direction.Down:
      return 'down'
    case Direction.Left:
      return 'left'
    case Direction.Right:
      return 'right'
    default:
      const _exhaustive: never = dir
      throw new Error(`Unhandled: ${_exhaustive}`)
  }
}
```

### 9.4. 最佳实践

```ts
// ✅ 1. 使用成员类型限制函数参数
enum Status {
  Draft = 'DRAFT',
  Published = 'PUBLISHED',
}

// 好：明确只接受 Draft
function saveDraft(status: Status.Draft): void {}

// 不好：接受所有状态但只处理 Draft
function saveDraft2(status: Status): void {
  if (status !== Status.Draft) return
}

// ✅ 2. 使用联合类型组合相关成员
type EditableStatus = Status.Draft | Status.Published

function edit(status: EditableStatus): void {}

// ✅ 3. 利用类型收窄
function process(status: Status): void {
  if (status === Status.Draft) {
    // status 类型: Status.Draft
    const draft: Status.Draft = status
  }
}

// ✅ 4. 使用泛型约束枚举成员
function setState<S extends Status>(status: S): S {
  return status
}

const draft = setState(Status.Draft) // 类型: Status.Draft

// ✅ 5. 映射枚举到其他类型
type StatusConfig = {
  [K in Status]: {
    label: string
    color: string
  }
}

const config: StatusConfig = {
  [Status.Draft]: { label: '草稿', color: 'gray' },
  [Status.Published]: { label: '已发布', color: 'green' },
}

// ✅ 6. 使用 Extract 和 Exclude
enum Permission {
  Read = 'READ',
  Write = 'WRITE',
  Delete = 'DELETE',
  Admin = 'ADMIN',
}

type BasicPermissions = Exclude<Permission, Permission.Admin>
type SpecialPermissions = Extract<Permission, Permission.Admin>

// ✅ 7. 枚举成员作为 discriminated union
enum EventType {
  Click = 'CLICK',
  Input = 'INPUT',
}

interface ClickEvent {
  type: EventType.Click
  x: number
  y: number
}

interface InputEvent {
  type: EventType.Input
  value: string
}

type Event = ClickEvent | InputEvent

function handleEvent(event: Event): void {
  switch (event.type) {
    case EventType.Click:
      console.log(event.x, event.y)
      break
    case EventType.Input:
      console.log(event.value)
      break
  }
}

// ✅ 8. 使用 const assertion 配合枚举
const actions = {
  save: Status.Draft,
  publish: Status.Published,
} as const

type ActionStatus = (typeof actions)[keyof typeof actions]

// ✅ 9. 文档化枚举成员的用途
enum UserRole {
  / 游客，只能查看公开内容 */
  Guest = 'GUEST',

  / 普通用户，可以创建和编辑自己的内容 */
  User = 'USER',

  / 管理员，可以管理所有内容 */
  Admin = 'ADMIN',
}

// ✅ 10. 使用辅助函数
enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

namespace Status {
  export function isActive(status: Status): status is Status.Active {
    return status === Status.Active
  }

  export function isInactive(status: Status): status is Status.Inactive {
    return status === Status.Inactive
  }
}

function check(status: Status): void {
  if (Status.isActive(status)) {
    // status 类型: Status.Active
  }
}
```

## 10. 🔗 引用

- [TypeScript Handbook - Enums][1]
- [TypeScript Deep Dive - Literal Enums][2]
- [TypeScript Handbook - Discriminated Unions][3]

[1]: https://www.typescriptlang.org/docs/handbook/enums.html
[2]: https://basarat.gitbook.io/typescript/type-system/enums#enums-are-open-ended
[3]: https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#discriminating-unions
