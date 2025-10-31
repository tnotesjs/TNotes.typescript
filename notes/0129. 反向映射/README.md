# [0129. 反向映射](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0129.%20%E5%8F%8D%E5%90%91%E6%98%A0%E5%B0%84)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是反向映射？](#3--什么是反向映射)
- [4. 🤔 反向映射的工作原理](#4--反向映射的工作原理)
  - [4.1. 编译结果](#41-编译结果)
  - [4.2. 实现机制](#42-实现机制)
  - [4.3. 手动初始化的反向映射](#43-手动初始化的反向映射)
  - [4.4. 计算成员的反向映射](#44-计算成员的反向映射)
- [5. 🤔 反向映射的限制](#5--反向映射的限制)
  - [5.1. 字符串枚举不支持](#51-字符串枚举不支持)
  - [5.2. 常量枚举不支持](#52-常量枚举不支持)
  - [5.3. 异构枚举的部分反向映射](#53-异构枚举的部分反向映射)
  - [5.4. 值冲突问题](#54-值冲突问题)
- [6. 🤔 实际应用场景](#6--实际应用场景)
  - [6.1. 场景 1：调试和日志](#61-场景-1调试和日志)
  - [6.2. 场景 2：错误消息](#62-场景-2错误消息)
  - [6.3. 场景 3：动态枚举处理](#63-场景-3动态枚举处理)
  - [6.4. 场景 4：枚举验证](#64-场景-4枚举验证)
  - [6.5. 场景 5：枚举到对象的转换](#65-场景-5枚举到对象的转换)
  - [6.6. 场景 6：国际化](#66-场景-6国际化)
  - [6.7. 场景 7：枚举序列化](#67-场景-7枚举序列化)
  - [6.8. 场景 8：枚举工具函数](#68-场景-8枚举工具函数)
- [7. 🤔 常见错误和最佳实践](#7--常见错误和最佳实践)
  - [7.1. 错误 1：期望字符串枚举有反向映射](#71-错误-1期望字符串枚举有反向映射)
  - [7.2. 错误 2：忽略类型安全](#72-错误-2忽略类型安全)
  - [7.3. 错误 3：混淆键类型](#73-错误-3混淆键类型)
  - [7.4. 最佳实践](#74-最佳实践)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 反向映射的概念和机制
- 数字枚举的反向映射特性
- 字符串枚举为何不支持反向映射
- 反向映射的编译结果
- 实际应用场景和最佳实践

## 2. 🫧 评价

反向映射（Reverse Mapping）是 TypeScript 中**数字枚举独有的特性**，允许通过枚举值获取枚举名称。

反向映射的特点：

- **双向访问**：既可以名称 → 值，也可以值 → 名称
- **仅数字枚举**：只有数字枚举支持
- **自动生成**：编译器自动创建反向映射
- **运行时对象**：编译为包含双向映射的对象

数字枚举 vs 字符串枚举的映射：

| 特性         | 数字枚举 | 字符串枚举 |
| ------------ | -------- | ---------- |
| **正向映射** | 支持     | 支持       |
| **反向映射** | 支持     | 不支持     |
| **编译产物** | 双向对象 | 单向对象   |
| **用途**     | 名称查找 | 直接使用值 |

反向映射的优势：

1. **调试方便**：可以通过值查找名称
2. **日志友好**：输出可读的枚举名
3. **动态查询**：运行时获取枚举信息
4. **错误提示**：显示有意义的名称

理解反向映射，能帮助你：

1. 更好地调试枚举相关代码
2. 实现动态的枚举处理
3. 理解枚举的编译机制
4. 选择合适的枚举类型

反向映射是数字枚举的重要特性，是调试和日志记录的有力工具。

## 3. 🤔 什么是反向映射？

反向映射是指**数字枚举自动创建从值到名称的映射**，使得可以通过枚举值反向获取枚举成员的名称。

```ts
// ✅ 数字枚举的反向映射
enum Status {
  Active, // 0
  Inactive, // 1
  Pending, // 2
}

// 正向映射：名称 -> 值
console.log(Status.Active) // 0
console.log(Status.Inactive) // 1
console.log(Status.Pending) // 2

// 反向映射：值 -> 名称
console.log(Status[0]) // 'Active'
console.log(Status[1]) // 'Inactive'
console.log(Status[2]) // 'Pending'

// ❌ 字符串枚举没有反向映射
enum StringStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

console.log(StringStatus.Active) // 'ACTIVE' ✅
console.log(StringStatus['ACTIVE']) // undefined ❌
```

**关键概念**：

- **双向映射**：名称 ↔ 值双向查找
- **仅数字枚举**：字符串枚举不支持
- **自动生成**：编译器自动创建
- **运行时对象**：存在于运行时

## 4. 🤔 反向映射的工作原理

### 4.1. 编译结果

```ts
// TypeScript 源码
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

// 编译后的 JavaScript
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

### 4.2. 实现机制

```ts
// ✅ 理解双向赋值
enum Color {
  Red,
  Green,
  Blue,
}

// Direction["Up"] = 0 返回 0
// Direction[0] = "Up" 使用返回值作为键

// 展开过程：
// 1. Direction["Up"] = 0     → { Up: 0 }
// 2. Direction[0] = "Up"     → { Up: 0, 0: "Up" }
// 3. Direction["Down"] = 1   → { Up: 0, 0: "Up", Down: 1 }
// 4. Direction[1] = "Down"   → { Up: 0, 0: "Up", Down: 1, 1: "Down" }
```

### 4.3. 手动初始化的反向映射

```ts
// ✅ 自定义起始值
enum HttpStatus {
  OK = 200,
  NotFound = 404,
  ServerError = 500,
}

console.log(HttpStatus.OK) // 200
console.log(HttpStatus[200]) // 'OK'
console.log(HttpStatus.NotFound) // 404
console.log(HttpStatus[404]) // 'NotFound'

// 编译结果
var HttpStatus
;(function (HttpStatus) {
  HttpStatus[(HttpStatus['OK'] = 200)] = 'OK'
  HttpStatus[(HttpStatus['NotFound'] = 404)] = 'NotFound'
  HttpStatus[(HttpStatus['ServerError'] = 500)] = 'ServerError'
})(HttpStatus || (HttpStatus = {}))
```

### 4.4. 计算成员的反向映射

```ts
// ✅ 计算成员也有反向映射
enum Permission {
  None = 0,
  Read = 1 << 0, // 1
  Write = 1 << 1, // 2
  Execute = 1 << 2, // 4
}

console.log(Permission.Read) // 1
console.log(Permission[1]) // 'Read'
console.log(Permission.Execute) // 4
console.log(Permission[4]) // 'Execute'
```

## 5. 🤔 反向映射的限制

### 5.1. 字符串枚举不支持

```ts
// ❌ 字符串枚举没有反向映射
enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

console.log(Status.Active) // 'ACTIVE' ✅
console.log(Status['ACTIVE']) // undefined ❌

// 编译结果（只有单向映射）
var Status
;(function (Status) {
  Status['Active'] = 'ACTIVE'
  Status['Inactive'] = 'INACTIVE'
})(Status || (Status = {}))

// 等价于
const Status = {
  Active: 'ACTIVE',
  Inactive: 'INACTIVE',
  // 没有 'ACTIVE': 'Active'
}
```

### 5.2. 常量枚举不支持

```ts
// ❌ 常量枚举没有反向映射（因为没有运行时对象）
const enum Direction {
  Up,
  Down,
}

const dir = Direction.Up // 编译为: const dir = 0
// console.log(Direction[0])  // Error: 常量枚举没有运行时对象
```

### 5.3. 异构枚举的部分反向映射

```ts
// ⚠️ 异构枚举只有数字成员有反向映射
enum Mixed {
  NumA = 1,
  NumB = 2,
  StrA = 'STRING_A',
  StrB = 'STRING_B',
}

// 数字成员的反向映射 ✅
console.log(Mixed[1]) // 'NumA'
console.log(Mixed[2]) // 'NumB'

// 字符串成员没有反向映射 ❌
console.log(Mixed['STRING_A']) // undefined
console.log(Mixed['STRING_B']) // undefined

// 编译结果
var Mixed
;(function (Mixed) {
  Mixed[(Mixed['NumA'] = 1)] = 'NumA'
  Mixed[(Mixed['NumB'] = 2)] = 'NumB'
  Mixed['StrA'] = 'STRING_A'
  Mixed['StrB'] = 'STRING_B'
})(Mixed || (Mixed = {}))
```

### 5.4. 值冲突问题

```ts
// ⚠️ 相同的值会导致反向映射覆盖
enum Bad {
  A = 1,
  B = 2,
  C = 1, // 与 A 的值相同
}

console.log(Bad.A) // 1
console.log(Bad.C) // 1
console.log(Bad[1]) // 'C' - 后定义的覆盖前面的

// ✅ 确保值唯一
enum Good {
  A = 1,
  B = 2,
  C = 3,
}
```

## 6. 🤔 实际应用场景

### 6.1. 场景 1：调试和日志

```ts
enum LogLevel {
  Trace,
  Debug,
  Info,
  Warn,
  Error,
  Fatal,
}

class Logger {
  log(level: LogLevel, message: string): void {
    // ✅ 使用反向映射获取日志级别名称
    const levelName = LogLevel[level]
    console.log(`[${levelName}] ${message}`)
  }
}

const logger = new Logger()
logger.log(LogLevel.Error, 'Something went wrong')
// 输出: [Error] Something went wrong
```

### 6.2. 场景 2：错误消息

```ts
enum ErrorCode {
  NotFound = 404,
  Unauthorized = 401,
  ServerError = 500,
  BadRequest = 400,
}

class ApiError extends Error {
  constructor(public code: ErrorCode, message?: string) {
    // ✅ 使用反向映射生成默认消息
    super(message || `Error: ${ErrorCode[code]} (${code})`)
  }
}

const error = new ApiError(ErrorCode.NotFound)
console.log(error.message) // 'Error: NotFound (404)'
```

### 6.3. 场景 3：动态枚举处理

```ts
enum Status {
  Draft,
  Review,
  Published,
  Archived,
}

// ✅ 获取所有枚举名称
function getStatusNames(): string[] {
  return Object.keys(Status).filter((key) => isNaN(Number(key)))
}

// ✅ 获取所有枚举值
function getStatusValues(): number[] {
  return Object.keys(Status)
    .filter((key) => !isNaN(Number(key)))
    .map((key) => Number(key))
}

// ✅ 遍历枚举
function printAllStatuses(): void {
  const values = getStatusValues()
  values.forEach((value) => {
    const name = Status[value]
    console.log(`${name} = ${value}`)
  })
}

printAllStatuses()
// Draft = 0
// Review = 1
// Published = 2
// Archived = 3
```

### 6.4. 场景 4：枚举验证

```ts
enum Priority {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4,
}

// ✅ 验证值是否是有效的枚举值
function isValidPriority(value: number): value is Priority {
  return value in Priority && typeof Priority[value] === 'string'
}

// ✅ 安全地获取枚举名称
function getPriorityName(value: number): string | undefined {
  if (isValidPriority(value)) {
    return Priority[value]
  }
  return undefined
}

console.log(isValidPriority(2)) // true
console.log(isValidPriority(99)) // false
console.log(getPriorityName(3)) // 'High'
console.log(getPriorityName(99)) // undefined
```

### 6.5. 场景 5：枚举到对象的转换

```ts
enum Status {
  Active,
  Inactive,
  Pending,
}

// ✅ 创建枚举选项列表
interface EnumOption {
  value: number
  label: string
}

function getEnumOptions(enumObj: any): EnumOption[] {
  return Object.keys(enumObj)
    .filter((key) => !isNaN(Number(key)))
    .map((key) => ({
      value: Number(key),
      label: enumObj[key],
    }))
}

const statusOptions = getEnumOptions(Status)
console.log(statusOptions)
// [
//   { value: 0, label: 'Active' },
//   { value: 1, label: 'Inactive' },
//   { value: 2, label: 'Pending' }
// ]
```

### 6.6. 场景 6：国际化

```ts
enum Language {
  English,
  Chinese,
  Japanese,
  Korean,
}

// ✅ 使用反向映射作为翻译键
const translations: Record<string, Record<string, string>> = {
  English: {
    greeting: 'Hello',
    farewell: 'Goodbye',
  },
  Chinese: {
    greeting: '你好',
    farewell: '再见',
  },
}

function translate(lang: Language, key: string): string {
  const langName = Language[lang]
  return translations[langName]?.[key] || key
}

console.log(translate(Language.English, 'greeting')) // 'Hello'
console.log(translate(Language.Chinese, 'greeting')) // '你好'
```

### 6.7. 场景 7：枚举序列化

```ts
enum UserRole {
  Guest,
  User,
  Moderator,
  Admin,
}

interface User {
  id: number
  name: string
  role: UserRole
}

// ✅ 序列化时包含枚举名称
function serializeUser(user: User): string {
  return JSON.stringify({
    ...user,
    roleName: UserRole[user.role], // 添加可读的角色名
  })
}

const user: User = {
  id: 1,
  name: 'Alice',
  role: UserRole.Admin,
}

console.log(serializeUser(user))
// {"id":1,"name":"Alice","role":3,"roleName":"Admin"}
```

### 6.8. 场景 8：枚举工具函数

```ts
enum Direction {
  North,
  East,
  South,
  West,
}

namespace Direction {
  // ✅ 获取所有方向名称
  export function getNames(): string[] {
    return Object.keys(Direction).filter((k) => isNaN(Number(k)))
  }

  // ✅ 获取所有方向值
  export function getValues(): number[] {
    return getNames().map((name) => Direction[name as keyof typeof Direction])
  }

  // ✅ 从名称获取值
  export function fromName(name: string): Direction | undefined {
    const key = name as keyof typeof Direction
    return Direction[key]
  }

  // ✅ 从值获取名称
  export function toName(value: number): string | undefined {
    return Direction[value]
  }

  // ✅ 验证值
  export function isValid(value: number): value is Direction {
    return value in Direction && typeof Direction[value] === 'string'
  }
}

console.log(Direction.getNames()) // ['North', 'East', 'South', 'West']
console.log(Direction.getValues()) // [0, 1, 2, 3]
console.log(Direction.toName(0)) // 'North'
console.log(Direction.fromName('East')) // 1
console.log(Direction.isValid(2)) // true
```

## 7. 🤔 常见错误和最佳实践

### 7.1. 错误 1：期望字符串枚举有反向映射

```ts
enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

// ❌ 字符串枚举没有反向映射
// console.log(Status['ACTIVE'])  // undefined

// ✅ 手动创建反向映射
const StatusReverse: Record<string, keyof typeof Status> = {}
for (const key in Status) {
  const value = Status[key as keyof typeof Status]
  StatusReverse[value] = key as keyof typeof Status
}

console.log(StatusReverse['ACTIVE']) // 'Active'
```

### 7.2. 错误 2：忽略类型安全

```ts
enum Color {
  Red,
  Green,
  Blue,
}

// ❌ 不安全的访问
function getColorName1(value: number): string {
  return Color[value] // 可能返回 undefined
}

// ✅ 类型安全的访问
function getColorName2(value: number): string | undefined {
  if (value in Color && typeof Color[value] === 'string') {
    return Color[value]
  }
  return undefined
}

// ✅ 使用类型守卫
function isColor(value: number): value is Color {
  return value in Color && typeof Color[value] === 'string'
}

function getColorName3(value: number): string | undefined {
  return isColor(value) ? Color[value] : undefined
}
```

### 7.3. 错误 3：混淆键类型

```ts
enum Status {
  Active,
  Inactive,
}

// ❌ 数字字符串不是枚举键
const name1 = Status['0'] // undefined (字符串 '0')

// ✅ 使用数字索引
const name2 = Status[0] // 'Active' (数字 0)

// ✅ 类型安全的访问
function getName(value: number): string | undefined {
  return Status[value]
}
```

### 7.4. 最佳实践

````ts
// ✅ 1. 创建通用的枚举工具
function createEnumHelpers<T extends Record<string, number>>(enumObj: T) {
  return {
    // 获取所有名称
    getNames(): string[] {
      return Object.keys(enumObj).filter((k) => isNaN(Number(k)))
    },

    // 获取所有值
    getValues(): number[] {
      return Object.keys(enumObj)
        .filter((k) => !isNaN(Number(k)))
        .map(Number)
    },

    // 值转名称
    toName(value: number): string | undefined {
      return enumObj[value as any]
    },

    // 名称转值
    fromName(name: string): number | undefined {
      return enumObj[name as keyof T]
    },

    // 验证值
    isValid(value: number): value is T[keyof T] {
      return value in enumObj && typeof enumObj[value as any] === 'string'
    },

    // 创建选项数组
    toOptions(): Array<{ value: number; label: string }> {
      return this.getValues().map((value) => ({
        value,
        label: this.toName(value)!,
      }))
    },
  }
}

enum Status {
  Draft,
  Published,
  Archived,
}

const statusHelpers = createEnumHelpers(Status)
console.log(statusHelpers.toName(0)) // 'Draft'
console.log(statusHelpers.fromName('Published')) // 1
console.log(statusHelpers.isValid(2)) // true
console.log(statusHelpers.toOptions())
// [
//   { value: 0, label: 'Draft' },
//   { value: 1, label: 'Published' },
//   { value: 2, label: 'Archived' }
// ]

// ✅ 2. 类型安全的反向查找
function reverseMap<T extends Record<string, number>>(
  enumObj: T,
  value: number
): keyof T | undefined {
  if (value in enumObj && typeof enumObj[value as any] === 'string') {
    return enumObj[value as any] as keyof T
  }
  return undefined
}

// ✅ 3. 创建枚举映射表
function createEnumMap<T extends Record<string, number>>(enumObj: T) {
  const map = new Map<number, string>()

  for (const key in enumObj) {
    if (isNaN(Number(key))) {
      const value = enumObj[key]
      map.set(value, key)
    }
  }

  return map
}

const statusMap = createEnumMap(Status)
console.log(statusMap.get(0)) // 'Draft'
console.log(statusMap.get(1)) // 'Published'

// ✅ 4. 文档化反向映射的使用
/**
 * 状态枚举
 *
 * @remarks
 * 支持反向映射，可以通过值获取名称
 *
 * @example
 * ```ts
 * const name = Status[0]  // 'Active'
 * const value = Status.Active  // 0
 * ```
 */
enum Status {
  Active,
  Inactive,
}

// ✅ 5. 避免值冲突
enum Priority {
  Low = 1,
  Medium = 2,
  High = 3,
  // Critical = 1  // ❌ 避免重复值
}

// ✅ 6. 使用 namespace 扩展枚举功能
enum HttpStatus {
  OK = 200,
  NotFound = 404,
  ServerError = 500,
}

namespace HttpStatus {
  export function getName(code: number): string {
    return HttpStatus[code] || 'Unknown'
  }

  export function isSuccess(code: number): boolean {
    return code >= 200 && code < 300
  }

  export function isError(code: number): boolean {
    return code >= 400
  }
}

console.log(HttpStatus.getName(200)) // 'OK'
console.log(HttpStatus.isSuccess(200)) // true
console.log(HttpStatus.isError(404)) // true

// ✅ 7. 缓存反向映射结果
class EnumCache<T extends Record<string, number>> {
  private reverseMap: Map<number, string>

  constructor(private enumObj: T) {
    this.reverseMap = new Map()
    this.buildReverseMap()
  }

  private buildReverseMap(): void {
    for (const key in this.enumObj) {
      if (isNaN(Number(key))) {
        const value = this.enumObj[key]
        this.reverseMap.set(value, key)
      }
    }
  }

  getName(value: number): string | undefined {
    return this.reverseMap.get(value)
  }

  hasValue(value: number): boolean {
    return this.reverseMap.has(value)
  }
}

const cache = new EnumCache(Status)
console.log(cache.getName(0)) // 'Draft'
console.log(cache.hasValue(1)) // true

// ✅ 8. 类型安全的枚举迭代
function forEachEnum<T extends Record<string, number>>(
  enumObj: T,
  callback: (name: string, value: number) => void
): void {
  Object.keys(enumObj)
    .filter((key) => isNaN(Number(key)))
    .forEach((key) => {
      const value = enumObj[key as keyof T]
      callback(key, value)
    })
}

forEachEnum(Status, (name, value) => {
  console.log(`${name} = ${value}`)
})

// ✅ 9. 错误处理
function getEnumName(enumObj: Record<string, number>, value: number): string {
  const name = enumObj[value]
  if (name === undefined) {
    throw new Error(`Invalid enum value: ${value}`)
  }
  return name
}

// ✅ 10. 测试反向映射
describe('Status enum', () => {
  it('should have reverse mapping', () => {
    expect(Status[Status.Active]).toBe('Active')
    expect(Status[0]).toBe('Active')
  })

  it('should not have reverse mapping for strings', () => {
    expect(Status['ACTIVE' as any]).toBeUndefined()
  })
})
````

## 8. 🔗 引用

- [TypeScript Handbook - Enums][1]
- [TypeScript Deep Dive - Reverse Mapping][2]
- [TypeScript Handbook - Enums at Runtime][3]

[1]: https://www.typescriptlang.org/docs/handbook/enums.html
[2]: https://basarat.gitbook.io/typescript/type-system/enums#enums-are-open-ended
[3]: https://www.typescriptlang.org/docs/handbook/enums.html#reverse-mappings
