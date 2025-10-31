# [0126. 常量枚举（const enum）](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0126.%20%E5%B8%B8%E9%87%8F%E6%9E%9A%E4%B8%BE%EF%BC%88const%20enum%EF%BC%89)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是常量枚举？](#3--什么是常量枚举)
- [4. 🤔 基本语法](#4--基本语法)
  - [4.1. 声明常量枚举](#41-声明常量枚举)
  - [4.2. 使用常量枚举](#42-使用常量枚举)
- [5. 🤔 编译行为](#5--编译行为)
  - [5.1. 内联替换](#51-内联替换)
  - [5.2. 保留注释](#52-保留注释)
  - [5.3. 计算成员](#53-计算成员)
- [6. 🤔 常量枚举的限制](#6--常量枚举的限制)
  - [6.1. 不支持反向映射](#61-不支持反向映射)
  - [6.2. 不支持动态访问](#62-不支持动态访问)
  - [6.3. 不能作为对象使用](#63-不能作为对象使用)
  - [6.4. 跨模块限制](#64-跨模块限制)
- [7. 🤔 性能优化](#7--性能优化)
  - [7.1. 代码体积对比](#71-代码体积对比)
  - [7.2. 运行时性能](#72-运行时性能)
  - [7.3. 打包优化](#73-打包优化)
- [8. 🤔 使用场景](#8--使用场景)
  - [8.1. 场景 1：配置常量](#81-场景-1配置常量)
  - [8.2. 场景 2：状态码](#82-场景-2状态码)
  - [8.3. 场景 3：标志位](#83-场景-3标志位)
  - [8.4. 场景 4：事件类型](#84-场景-4事件类型)
  - [8.5. 场景 5：颜色常量](#85-场景-5颜色常量)
  - [8.6. 场景 6：键盘键码](#86-场景-6键盘键码)
  - [8.7. 场景 7：正则表达式标志](#87-场景-7正则表达式标志)
- [9. 🤔 常见错误和最佳实践](#9--常见错误和最佳实践)
  - [9.1. 错误 1：尝试反向映射](#91-错误-1尝试反向映射)
  - [9.2. 错误 2：动态访问](#92-错误-2动态访问)
  - [9.3. 错误 3：导出问题](#93-错误-3导出问题)
  - [9.4. 最佳实践](#94-最佳实践)
- [10. 🔗 引用](#10--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 常量枚举的定义和特性
- 编译时内联机制
- 与普通枚举的区别
- 性能优势和限制
- 实际应用场景

## 2. 🫧 评价

常量枚举（const enum）是 TypeScript 中**编译时内联的枚举类型**。

常量枚举的特点：

- **编译时内联**：使用时直接替换为值
- **零运行时开销**：不生成枚举对象
- **性能优化**：减少代码体积
- **有限制**：不支持某些特性

常量枚举 vs 普通枚举：

| 特性           | 常量枚举 | 普通枚举     |
| -------------- | -------- | ------------ |
| **运行时代码** | 无       | 有           |
| **反向映射**   | 不支持   | 支持（数字） |
| **代码体积**   | 更小     | 更大         |
| **动态访问**   | 不支持   | 支持         |
| **编译输出**   | 内联值   | 对象         |

常量枚举的优势：

1. **零开销**：不生成额外代码
2. **更小体积**：减少打包大小
3. **更快执行**：避免对象查找
4. **类型安全**：保持编译时检查

理解常量枚举，能帮助你：

1. 优化应用性能
2. 减少打包体积
3. 理解编译行为
4. 选择合适的枚举类型

常量枚举是 TypeScript 性能优化的重要工具，适合对性能敏感的场景。

## 3. 🤔 什么是常量枚举？

常量枚举是**在编译时完全内联的枚举**，使用 `const enum` 关键字声明。

```ts
// ✅ 常量枚举
const enum Direction {
  Up,
  Down,
  Left,
  Right,
}

const dir = Direction.Up

// 编译后
const dir = 0 /* Direction.Up */

// ✅ 普通枚举（对比）
enum NormalDirection {
  Up,
  Down,
  Left,
  Right,
}

const normalDir = NormalDirection.Up

// 编译后
var NormalDirection
;(function (NormalDirection) {
  NormalDirection[(NormalDirection['Up'] = 0)] = 'Up'
  NormalDirection[(NormalDirection['Down'] = 1)] = 'Down'
  NormalDirection[(NormalDirection['Left'] = 2)] = 'Left'
  NormalDirection[(NormalDirection['Right'] = 3)] = 'Right'
})(NormalDirection || (NormalDirection = {}))

const normalDir = NormalDirection.Up
```

**关键概念**：

- **const 声明**：使用 `const enum` 关键字
- **编译时内联**：引用处替换为实际值
- **无运行时对象**：不生成枚举对象
- **类型检查**：编译时仍有类型安全

## 4. 🤔 基本语法

### 4.1. 声明常量枚举

```ts
// ✅ 数字常量枚举
const enum Status {
  Pending,
  Active,
  Completed,
}

// ✅ 字符串常量枚举
const enum Color {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE',
}

// ✅ 混合常量枚举（不推荐）
const enum Mixed {
  None = 0,
  Name = 'NAME',
}
```

### 4.2. 使用常量枚举

```ts
const enum HttpStatus {
  OK = 200,
  NotFound = 404,
  ServerError = 500,
}

// ✅ 直接使用
function handleStatus(status: HttpStatus): void {
  if (status === HttpStatus.OK) {
    console.log('Success')
  }
}

// 编译后
function handleStatus(status: HttpStatus): void {
  if (status === 200 /* HttpStatus.OK */) {
    console.log('Success')
  }
}

// ✅ switch 语句
function getStatusMessage(status: HttpStatus): string {
  switch (status) {
    case HttpStatus.OK:
      return 'Success'
    case HttpStatus.NotFound:
      return 'Not Found'
    case HttpStatus.ServerError:
      return 'Server Error'
  }
}

// 编译后
function getStatusMessage(status: HttpStatus): string {
  switch (status) {
    case 200 /* HttpStatus.OK */:
      return 'Success'
    case 404 /* HttpStatus.NotFound */:
      return 'Not Found'
    case 500 /* HttpStatus.ServerError */:
      return 'Server Error'
  }
}
```

## 5. 🤔 编译行为

### 5.1. 内联替换

```ts
const enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}

// TypeScript 代码
const a = Direction.Up
const b = Direction.Down
const arr = [Direction.Left, Direction.Right]

// 编译后的 JavaScript
const a = 'UP' /* Direction.Up */
const b = 'DOWN' /* Direction.Down */
const arr = ['LEFT' /* Direction.Left */, 'RIGHT' /* Direction.Right */]
```

### 5.2. 保留注释

```ts
// ✅ 默认保留枚举成员注释
const enum Level {
  Low = 1,
  Medium = 2,
  High = 3,
}

const level = Level.Medium

// 编译后（默认）
const level = 2 /* Level.Medium */

// 编译后（--removeComments）
const level = 2
```

### 5.3. 计算成员

```ts
// ✅ 常量表达式会内联
const enum Size {
  Small = 10,
  Medium = Small * 2, // 20
  Large = Medium * 2, // 40
  XLarge = Large + 10, // 50
}

const size = Size.Large

// 编译后
const size = 40 /* Size.Large */
```

## 6. 🤔 常量枚举的限制

### 6.1. 不支持反向映射

```ts
const enum Color {
  Red,
  Green,
  Blue,
}

// ❌ 无法使用反向映射
// const name = Color[0]  // Error: 常量枚举不支持

// ✅ 只能正向访问
const color = Color.Red // 0
```

### 6.2. 不支持动态访问

```ts
const enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

// ❌ 不能动态访问成员
// const key = 'Active'
// const value = Status[key]  // Error

// ✅ 只能静态访问
const value = Status.Active
```

### 6.3. 不能作为对象使用

```ts
const enum Direction {
  Up,
  Down,
  Left,
  Right,
}

// ❌ 不能遍历枚举
// for (const key in Direction) {}  // Error
// Object.keys(Direction)           // Error

// ❌ 不能传递枚举对象
// function process(enumObj: typeof Direction) {}  // Error
```

### 6.4. 跨模块限制

```ts
// module1.ts
export const enum Status {
  Active,
  Inactive,
}

// module2.ts
import { Status } from './module1'

// ⚠️ 需要 --preserveConstEnums 或 --isolatedModules
const status = Status.Active

// 或者使用 import type
import type { Status } from './module1'
```

## 7. 🤔 性能优化

### 7.1. 代码体积对比

```ts
// ✅ 常量枚举 - 更小
const enum ConstColor {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE',
}

const colors = [ConstColor.Red, ConstColor.Green, ConstColor.Blue]

// 编译后（约 80 字节）
const colors = [
  'RED' /* ConstColor.Red */,
  'GREEN' /* ConstColor.Green */,
  'BLUE' /* ConstColor.Blue */,
]

// ✅ 普通枚举 - 更大
enum NormalColor {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE',
}

const normalColors = [NormalColor.Red, NormalColor.Green, NormalColor.Blue]

// 编译后（约 200 字节）
var NormalColor
;(function (NormalColor) {
  NormalColor['Red'] = 'RED'
  NormalColor['Green'] = 'GREEN'
  NormalColor['Blue'] = 'BLUE'
})(NormalColor || (NormalColor = {}))

const normalColors = [NormalColor.Red, NormalColor.Green, NormalColor.Blue]
```

### 7.2. 运行时性能

```ts
const enum ConstStatus {
  Active = 1,
  Inactive = 2,
}

enum NormalStatus {
  Active = 1,
  Inactive = 2,
}

// ✅ 常量枚举 - 直接比较
function checkConst(status: ConstStatus): boolean {
  return status === ConstStatus.Active
}
// 编译为: return status === 1

// ✅ 普通枚举 - 对象访问
function checkNormal(status: NormalStatus): boolean {
  return status === NormalStatus.Active
}
// 编译为: return status === NormalStatus.Active
// 需要对象查找
```

### 7.3. 打包优化

```ts
// ✅ 使用常量枚举减少打包体积
const enum ApiEndpoint {
  Users = '/api/users',
  Posts = '/api/posts',
  Comments = '/api/comments',
}

// 大量使用不会增加打包体积
fetch(ApiEndpoint.Users)
fetch(ApiEndpoint.Posts)
fetch(ApiEndpoint.Comments)

// 编译后都是直接的字符串字面量
fetch('/api/users' /* ApiEndpoint.Users */)
fetch('/api/posts' /* ApiEndpoint.Posts */)
fetch('/api/comments' /* ApiEndpoint.Comments */)
```

## 8. 🤔 使用场景

### 8.1. 场景 1：配置常量

```ts
// ✅ 应用配置
const enum AppConfig {
  DefaultPageSize = 20,
  MaxPageSize = 100,
  CacheTimeout = 3600,
  MaxRetries = 3,
}

class DataService {
  async fetchData(page: number = 1): Promise<any> {
    const pageSize = AppConfig.DefaultPageSize
    const maxRetries = AppConfig.MaxRetries

    // 编译为直接的数字值
    return this.fetch(`/data?page=${page}&size=${pageSize}`)
  }

  private fetch(url: string): Promise<any> {
    return fetch(url).then((res) => res.json())
  }
}
```

### 8.2. 场景 2：状态码

```ts
// ✅ HTTP 状态码
const enum HttpStatus {
  OK = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  ServerError = 500,
}

async function handleResponse(response: Response): Promise<any> {
  switch (response.status) {
    case HttpStatus.OK:
      return response.json()
    case HttpStatus.NoContent:
      return null
    case HttpStatus.NotFound:
      throw new Error('Not found')
    case HttpStatus.ServerError:
      throw new Error('Server error')
    default:
      throw new Error('Unknown error')
  }
}
```

### 8.3. 场景 3：标志位

```ts
// ✅ 位标志
const enum Permission {
  None = 0,
  Read = 1 << 0, // 1
  Write = 1 << 1, // 2
  Execute = 1 << 2, // 4
  Delete = 1 << 3, // 8
  Admin = Read | Write | Execute | Delete,
}

function hasPermission(user: number, perm: Permission): boolean {
  return (user & perm) === perm
}

// 编译后都是直接的数字运算
const canRead = hasPermission(userPerms, 1 /* Permission.Read */)
const canWrite = hasPermission(userPerms, 2 /* Permission.Write */)
```

### 8.4. 场景 4：事件类型

```ts
// ✅ 事件名称
const enum EventType {
  Click = 'click',
  Input = 'input',
  Change = 'change',
  Submit = 'submit',
  Focus = 'focus',
  Blur = 'blur',
}

class EventManager {
  on(type: EventType, handler: () => void): void {
    document.addEventListener(type, handler)
  }

  off(type: EventType, handler: () => void): void {
    document.removeEventListener(type, handler)
  }
}

const manager = new EventManager()
manager.on(EventType.Click, () => {})
// 编译为: manager.on("click", () => {})
```

### 8.5. 场景 5：颜色常量

```ts
// ✅ 颜色值
const enum Color {
  Primary = '#1890ff',
  Success = '#52c41a',
  Warning = '#faad14',
  Error = '#f5222d',
  Info = '#1890ff',
}

function setThemeColor(type: 'primary' | 'success' | 'warning'): void {
  let color: string

  switch (type) {
    case 'primary':
      color = Color.Primary
      break
    case 'success':
      color = Color.Success
      break
    case 'warning':
      color = Color.Warning
      break
  }

  document.documentElement.style.setProperty('--theme-color', color)
}
```

### 8.6. 场景 6：键盘键码

```ts
// ✅ 键盘事件
const enum KeyCode {
  Enter = 13,
  Escape = 27,
  Space = 32,
  ArrowUp = 38,
  ArrowDown = 40,
  ArrowLeft = 37,
  ArrowRight = 39,
}

function handleKeyDown(event: KeyboardEvent): void {
  switch (event.keyCode) {
    case KeyCode.Enter:
      console.log('Enter pressed')
      break
    case KeyCode.Escape:
      console.log('Escape pressed')
      break
    case KeyCode.ArrowUp:
      console.log('Arrow Up pressed')
      break
  }
}

// 编译为直接的数字比较
```

### 8.7. 场景 7：正则表达式标志

```ts
// ✅ 正则标志
const enum RegExpFlag {
  Global = 'g',
  IgnoreCase = 'i',
  Multiline = 'm',
  Sticky = 'y',
  Unicode = 'u',
}

function createRegExp(pattern: string): RegExp {
  return new RegExp(pattern, RegExpFlag.Global + RegExpFlag.IgnoreCase)
}

// 编译为
function createRegExp(pattern: string): RegExp {
  return new RegExp(
    pattern,
    'g' /* RegExpFlag.Global */ + 'i' /* RegExpFlag.IgnoreCase */
  )
}
```

## 9. 🤔 常见错误和最佳实践

### 9.1. 错误 1：尝试反向映射

```ts
const enum Status {
  Active,
  Inactive,
}

// ❌ 常量枚举不支持反向映射
// const name = Status[0]  // Error

// ✅ 如需反向映射，使用普通枚举
enum NormalStatus {
  Active,
  Inactive,
}

const name = NormalStatus[0] // 'Active'
```

### 9.2. 错误 2：动态访问

```ts
const enum Color {
  Red = 'RED',
  Green = 'GREEN',
}

// ❌ 不能动态访问
// const key = 'Red'
// const value = Color[key]  // Error

// ✅ 使用类型映射
type ColorMap = {
  [K in keyof typeof Color]: string
}

const colorMap: ColorMap = {
  Red: Color.Red,
  Green: Color.Green,
}
```

### 9.3. 错误 3：导出问题

```ts
// ❌ 跨模块使用可能有问题
export const enum Status {
  Active,
  Inactive,
}

// ✅ 使用 preserveConstEnums 编译选项
// 或者不导出常量枚举
const enum InternalStatus {
  Active,
  Inactive,
}

export enum Status {
  Active,
  Inactive,
}
```

### 9.4. 最佳实践

```ts
// ✅ 1. 用于内部常量
const enum InternalConfig {
  CacheSize = 100,
  Timeout = 5000
}

// ✅ 2. 大量重复使用的值
const enum ApiRoute {
  Users = '/api/users',
  Posts = '/api/posts',
  Comments = '/api/comments'
}

// 多处使用不增加代码体积
fetch(ApiRoute.Users)
fetch(ApiRoute.Posts)
fetch(ApiRoute.Comments)

// ✅ 3. 性能敏感的场景
const enum Operation {
  Add = 1,
  Subtract = 2,
  Multiply = 3,
  Divide = 4
}

function calculate(op: Operation, a: number, b: number): number {
  switch (op) {
    case Operation.Add: return a + b
    case Operation.Subtract: return a - b
    case Operation.Multiply: return a * b
    case Operation.Divide: return a / b
  }
}

// ✅ 4. 配合类型守卫
const enum Status {
  Pending = 'PENDING',
  Success = 'SUCCESS',
  Error = 'ERROR'
}

function isSuccess(status: Status): status is Status.Success {
  return status === Status.Success
}

// ✅ 5. 文档化使用场景
/**
 * API 端点常量枚举
 *
 * @remarks
 * 使用常量枚举以减少打包体积，
 * 因为这些值会在整个应用中大量使用
 */
const enum ApiEndpoint {
  Users = '/api/users',
  Posts = '/api/posts'
}

// ✅ 6. 与普通枚举的选择
// 需要反向映射：使用普通枚举
enum WithReverse {
  A, B, C
}

// 不需要反向映射：使用常量枚举
const enum WithoutReverse {
  A, B, C
}

// ✅ 7. preserveConstEnums 配置
// tsconfig.json
{
  "compilerOptions": {
    "preserveConstEnums": true  // 保留枚举对象
  }
}

// ✅ 8. 避免在库中导出
// ❌ 不推荐在公共 API 中导出
// export const enum LibraryStatus {}

// ✅ 推荐导出普通枚举
export enum LibraryStatus {
  Active,
  Inactive
}

// ✅ 9. 与字面量类型的选择
// 简单场景用字面量
type Direction = 'up' | 'down' | 'left' | 'right'

// 复杂场景用常量枚举
const enum ComplexDirection {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT'
}

// ✅ 10. 测试注意事项
// 测试文件中可能需要使用实际值
describe('Status', () => {
  it('should handle active status', () => {
    // 使用实际值而不是枚举成员
    expect(getStatus()).toBe('ACTIVE')
    // 而不是: expect(getStatus()).toBe(Status.Active)
  })
})
```

## 10. 🔗 引用

- [TypeScript Handbook - Const Enums][1]
- [TypeScript Deep Dive - Const Enums][2]
- [TypeScript Compiler Options - preserveConstEnums][3]

[1]: https://www.typescriptlang.org/docs/handbook/enums.html#const-enums
[2]: https://basarat.gitbook.io/typescript/type-system/enums#const-enums
[3]: https://www.typescriptlang.org/tsconfig#preserveConstEnums
