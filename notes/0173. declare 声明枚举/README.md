# [0173. declare 声明枚举](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0173.%20declare%20%E5%A3%B0%E6%98%8E%E6%9E%9A%E4%B8%BE)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 如何使用 declare 声明枚举？](#3--如何使用-declare-声明枚举)
  - [3.1. 基本语法](#31-基本语法)
  - [3.2. 数字枚举](#32-数字枚举)
  - [3.3. 字符串枚举](#33-字符串枚举)
  - [3.4. 混合枚举](#34-混合枚举)
  - [3.5. 实际应用场景](#35-实际应用场景)
- [4. 🤔 如何声明常量枚举？](#4--如何声明常量枚举)
  - [4.1. 基本常量枚举](#41-基本常量枚举)
  - [4.2. 字符串常量枚举](#42-字符串常量枚举)
  - [4.3. 常量枚举的优势](#43-常量枚举的优势)
  - [4.4. 常量枚举的限制](#44-常量枚举的限制)
- [5. 🤔 declare enum 有什么特殊性？](#5--declare-enum-有什么特殊性)
  - [5.1. 普通枚举 vs declare 枚举](#51-普通枚举-vs-declare-枚举)
  - [5.2. 需要运行时支持](#52-需要运行时支持)
  - [5.3. 与类型断言配合](#53-与类型断言配合)
  - [5.4. 最佳实践](#54-最佳实践)
  - [5.5. 使用建议](#55-使用建议)
- [6. 🔗 引用](#6--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- declare 声明枚举的基本语法
- 数字枚举和字符串枚举的声明
- 常量枚举的声明
- declare enum 的特殊行为
- 实际应用场景

## 2. 🫧 评价

使用 declare 声明枚举可以为外部定义的枚举提供类型信息。

- declare enum 只声明枚举结构，不生成枚举对象代码
- 支持数字枚举和字符串枚举
- declare const enum 是完全的编译时常量
- 主要用于为 JavaScript 常量提供枚举类型
- 使用时需要确保运行时环境存在对应的值

## 3. 🤔 如何使用 declare 声明枚举？

declare 枚举声明用于描述已存在的枚举值。

### 3.1. 基本语法

```typescript
// 声明数字枚举
declare enum Direction {
  Up,
  Down,
  Left,
  Right,
}

// 使用枚举
const move = Direction.Up
console.log(Direction.Down)

// 编译后保留使用代码
// const move = Direction.Up;
// console.log(Direction.Down);
```

### 3.2. 数字枚举

```typescript
// 默认从 0 开始
declare enum Status {
  Pending, // 0
  Active, // 1
  Completed, // 2
  Cancelled, // 3
}

// 指定起始值
declare enum Priority {
  Low = 1,
  Medium, // 2
  High, // 3
  Critical, // 4
}

// 自定义所有值
declare enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  ServerError = 500,
}

// 使用
const status: Status = Status.Active
const priority: Priority = Priority.High
const httpStatus: HttpStatus = HttpStatus.OK
```

### 3.3. 字符串枚举

```typescript
// 字符串枚举
declare enum Color {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE',
}

declare enum LogLevel {
  Error = 'ERROR',
  Warning = 'WARNING',
  Info = 'INFO',
  Debug = 'DEBUG',
}

// 使用
const color = Color.Red // 'RED'
const level = LogLevel.Error // 'ERROR'
```

### 3.4. 混合枚举

```typescript
// 数字和字符串混合（不推荐）
declare enum Mixed {
  No = 0,
  Yes = 'YES',
  Unknown = 1,
}

// 使用
const value1 = Mixed.No // 0
const value2 = Mixed.Yes // 'YES'
const value3 = Mixed.Unknown // 1
```

### 3.5. 实际应用场景

```typescript
// 场景1：为外部 JavaScript 常量提供枚举类型
// constants.js
// const UserRole = {
//   Admin: 'admin',
//   User: 'user',
//   Guest: 'guest'
// };

declare enum UserRole {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest',
}

// 现在可以类型安全地使用
function checkPermission(role: UserRole) {
  if (role === UserRole.Admin) {
    return true
  }
  return false
}

// 场景2：API 响应状态
declare enum ApiStatus {
  Idle = 'idle',
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}

interface ApiResponse<T> {
  status: ApiStatus
  data?: T
  error?: string
}
```

## 4. 🤔 如何声明常量枚举？

常量枚举在编译时会被完全内联。

### 4.1. 基本常量枚举

```typescript
// 声明常量枚举
declare const enum Direction {
  Up,
  Down,
  Left,
  Right,
}

// 使用
const dir = Direction.Up

// 编译后会被内联为具体的值
// const dir = 0;
```

### 4.2. 字符串常量枚举

```typescript
// 字符串常量枚举
declare const enum Color {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE',
}

// 使用
const color = Color.Red

// 编译后
// const color = 'RED';
```

### 4.3. 常量枚举的优势

```typescript
// 运行时不需要枚举对象
declare const enum FileType {
  Image = 'image',
  Video = 'video',
  Audio = 'audio',
  Document = 'document',
}

function processFile(type: FileType) {
  switch (type) {
    case FileType.Image:
      return 'Processing image'
    case FileType.Video:
      return 'Processing video'
    case FileType.Audio:
      return 'Processing audio'
    case FileType.Document:
      return 'Processing document'
  }
}

// 编译后的代码中不包含 FileType 对象
// 所有引用都被替换为实际的字符串值
```

### 4.4. 常量枚举的限制

```typescript
// 常量枚举不能作为对象使用
declare const enum Size {
  Small,
  Medium,
  Large,
}

// 可以作为类型使用
const size: Size = Size.Medium

// 不能作为值使用
// const sizes = Object.values(Size);  // 错误
// const sizeNames = Object.keys(Size);  // 错误
```

## 5. 🤔 declare enum 有什么特殊性？

declare enum 与普通 enum 在编译行为上有重要区别。

### 5.1. 普通枚举 vs declare 枚举

::: code-group

```typescript [普通枚举]
// 普通枚举会生成运行时对象
enum Status {
  Pending,
  Active,
  Completed,
}

// 编译后生成完整的枚举对象
// var Status;
// (function (Status) {
//   Status[Status["Pending"] = 0] = "Pending";
//   Status[Status["Active"] = 1] = "Active";
//   Status[Status["Completed"] = 2] = "Completed";
// })(Status || (Status = {}));
```

```typescript [declare 枚举]
// declare 枚举不生成运行时代码
declare enum Status {
  Pending,
  Active,
  Completed,
}

// 编译后不生成任何代码
// 假设运行时已经存在 Status 对象
```

:::

### 5.2. 需要运行时支持

```typescript
// declare enum 要求运行时已经存在对应的对象
declare enum ApiEndpoint {
  Users = '/api/users',
  Posts = '/api/posts',
  Comments = '/api/comments',
}

// 使用前需要确保 ApiEndpoint 对象存在
// 例如通过全局脚本定义：
// window.ApiEndpoint = {
//   Users: '/api/users',
//   Posts: '/api/posts',
//   Comments: '/api/comments'
// };

const endpoint = ApiEndpoint.Users
```

### 5.3. 与类型断言配合

```typescript
// 在运行时对象不存在时，可以使用类型断言
declare enum Theme {
  Light = 'light',
  Dark = 'dark',
  Auto = 'auto',
}

// 手动创建对应的对象
const ThemeValues = {
  Light: 'light',
  Dark: 'dark',
  Auto: 'auto',
} as const

// 类型兼容
const theme: Theme = ThemeValues.Light as Theme
```

### 5.4. 最佳实践

```typescript
// 推荐：使用 declare const enum
// 编译时内联，无需运行时对象
declare const enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

// 避免：使用 declare enum 但运行时无对应对象
// 这会导致运行时错误

// 替代方案：使用对象字面量 + as const
const Environment = {
  Development: 'development',
  Production: 'production',
  Test: 'test',
} as const

type Environment = (typeof Environment)[keyof typeof Environment]
```

### 5.5. 使用建议

```typescript
// 场景1：外部库已经定义了枚举对象
// 使用 declare enum
declare enum ExternalEnum {
  Value1 = 1,
  Value2 = 2,
}

// 场景2：纯 TypeScript 项目
// 使用 declare const enum（性能更好）
declare const enum InternalConfig {
  MaxRetries = 3,
  Timeout = 5000,
}

// 场景3：需要枚举对象本身
// 不使用 declare，使用普通 enum
enum RuntimeEnum {
  Option1,
  Option2,
  Option3,
}

// 可以获取所有枚举值
const options = Object.values(RuntimeEnum)
```

## 6. 🔗 引用

- [TypeScript Handbook - Enums][1]
- [Declaration Files - Enums][2]
- [Const Enums][3]
- [Ambient Enums][4]

[1]: https://www.typescriptlang.org/docs/handbook/enums.html
[2]: https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html#enums
[3]: https://www.typescriptlang.org/docs/handbook/enums.html#const-enums
[4]: https://www.typescriptlang.org/docs/handbook/enums.html#ambient-enums
