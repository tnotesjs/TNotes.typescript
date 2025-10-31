# [0270. 类型守卫的使用](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0270.%20%E7%B1%BB%E5%9E%8B%E5%AE%88%E5%8D%AB%E7%9A%84%E4%BD%BF%E7%94%A8)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是类型守卫？](#3--什么是类型守卫)
  - [3.1. 内置类型守卫](#31-内置类型守卫)
  - [3.2. 问题：无法收窄类型](#32-问题无法收窄类型)
- [4. 🤔 is 类型谓词？](#4--is-类型谓词)
  - [4.1. 基本语法](#41-基本语法)
  - [4.2. 原始类型守卫](#42-原始类型守卫)
  - [4.3. 数组类型守卫](#43-数组类型守卫)
- [5. 🤔 自定义类型守卫？](#5--自定义类型守卫)
  - [5.1. 接口类型守卫](#51-接口类型守卫)
  - [5.2. 可选属性处理](#52-可选属性处理)
  - [5.3. 联合类型守卫](#53-联合类型守卫)
  - [5.4. 嵌套对象守卫](#54-嵌套对象守卫)
- [6. 🤔 断言函数？](#6--断言函数)
  - [6.1. 基本断言函数](#61-基本断言函数)
  - [6.2. 类型断言函数](#62-类型断言函数)
  - [6.3. 自定义类型断言](#63-自定义类型断言)
  - [6.4. 非空断言函数](#64-非空断言函数)
- [7. 🤔 类型守卫的最佳实践？](#7--类型守卫的最佳实践)
  - [7.1. 单一职责](#71-单一职责)
  - [7.2. 可组合性](#72-可组合性)
  - [7.3. 性能考虑](#73-性能考虑)
  - [7.4. 错误处理](#74-错误处理)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 类型守卫概念
- is 类型谓词
- 自定义类型守卫
- 断言函数
- 最佳实践

## 2. 🫧 评价

类型守卫是自定义类型收窄逻辑的强大工具，能够创建可复用的类型检查函数。

- 封装类型检查逻辑
- 提高代码复用性
- 增强类型安全
- 改善代码可维护性
- TypeScript 高级特性

## 3. 🤔 什么是类型守卫？

类型守卫是返回布尔值的函数，用于在运行时检查类型并告知 TypeScript 编译器。

### 3.1. 内置类型守卫

```typescript
// typeof 类型守卫
function isString(value: unknown): boolean {
  return typeof value === 'string'
}

// instanceof 类型守卫
function isDate(value: unknown): boolean {
  return value instanceof Date
}

// in 类型守卫
function hasName(obj: unknown): boolean {
  return typeof obj === 'object' && obj !== null && 'name' in obj
}
```

### 3.2. 问题：无法收窄类型

```typescript
function isString(value: unknown): boolean {
  return typeof value === 'string'
}

function process(value: unknown) {
  if (isString(value)) {
    // ❌ value 仍然是 unknown
    // TypeScript 不知道 isString 的返回值意味着什么
    console.log(value.toUpperCase()) // Error
  }
}
```

## 4. 🤔 is 类型谓词？

使用 `is` 关键字告诉 TypeScript 函数的返回值代表的类型信息。

### 4.1. 基本语法

```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function process(value: unknown) {
  if (isString(value)) {
    // ✅ TypeScript 知道 value 是 string
    console.log(value.toUpperCase())
  }
}
```

### 4.2. 原始类型守卫

```typescript
function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value)
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

function isBigInt(value: unknown): value is bigint {
  return typeof value === 'bigint'
}

function isSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol'
}
```

### 4.3. 数组类型守卫

```typescript
function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'number')
}

// 通用数组守卫
function isArrayOf<T>(
  value: unknown,
  guard: (item: unknown) => item is T
): value is T[] {
  return Array.isArray(value) && value.every(guard)
}

// 使用
const data: unknown = [1, 2, 3]
if (isArrayOf(data, isNumber)) {
  // data 的类型：number[]
  console.log(data.map((n) => n.toFixed()))
}
```

## 5. 🤔 自定义类型守卫？

为自定义类型创建类型守卫。

### 5.1. 接口类型守卫

```typescript
interface User {
  name: string
  age: number
  email: string
}

function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    typeof (value as User).name === 'string' &&
    'age' in value &&
    typeof (value as User).age === 'number' &&
    'email' in value &&
    typeof (value as User).email === 'string'
  )
}

// 使用
function processUser(data: unknown) {
  if (isUser(data)) {
    // data 的类型：User
    console.log(data.name, data.age, data.email)
  }
}
```

### 5.2. 可选属性处理

```typescript
interface Config {
  host: string
  port?: number
  timeout?: number
}

function isConfig(value: unknown): value is Config {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const obj = value as Config

  // 必选属性检查
  if (typeof obj.host !== 'string') {
    return false
  }

  // 可选属性检查
  if (obj.port !== undefined && typeof obj.port !== 'number') {
    return false
  }

  if (obj.timeout !== undefined && typeof obj.timeout !== 'number') {
    return false
  }

  return true
}
```

### 5.3. 联合类型守卫

```typescript
interface Circle {
  kind: 'circle'
  radius: number
}

interface Square {
  kind: 'square'
  size: number
}

type Shape = Circle | Square

function isCircle(shape: Shape): shape is Circle {
  return shape.kind === 'circle'
}

function isSquare(shape: Shape): shape is Square {
  return shape.kind === 'square'
}

function getArea(shape: Shape): number {
  if (isCircle(shape)) {
    return Math.PI * shape.radius ** 2
  }

  if (isSquare(shape)) {
    return shape.size ** 2
  }

  const _exhaustive: never = shape
  return _exhaustive
}
```

### 5.4. 嵌套对象守卫

```typescript
interface Address {
  street: string
  city: string
  zipCode: string
}

interface Person {
  name: string
  address: Address
}

function isAddress(value: unknown): value is Address {
  return (
    typeof value === 'object' &&
    value !== null &&
    'street' in value &&
    typeof (value as Address).street === 'string' &&
    'city' in value &&
    typeof (value as Address).city === 'string' &&
    'zipCode' in value &&
    typeof (value as Address).zipCode === 'string'
  )
}

function isPerson(value: unknown): value is Person {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    typeof (value as Person).name === 'string' &&
    'address' in value &&
    isAddress((value as Person).address)
  )
}
```

## 6. 🤔 断言函数？

断言函数用于在运行时断言某个条件，如果条件不满足则抛出错误。

### 6.1. 基本断言函数

```typescript
function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message || '断言失败')
  }
}

function process(value: unknown) {
  assert(typeof value === 'string', 'value 必须是字符串')

  // ✅ TypeScript 知道 value 是 string
  console.log(value.toUpperCase())
}
```

### 6.2. 类型断言函数

```typescript
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new TypeError('值必须是字符串')
  }
}

function assertIsNumber(value: unknown): asserts value is number {
  if (typeof value !== 'number') {
    throw new TypeError('值必须是数字')
  }
}

function process(value: unknown) {
  assertIsString(value)
  // ✅ value 的类型：string
  console.log(value.toUpperCase())
}
```

### 6.3. 自定义类型断言

```typescript
interface User {
  name: string
  age: number
}

function assertIsUser(value: unknown): asserts value is User {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('name' in value) ||
    typeof (value as User).name !== 'string' ||
    !('age' in value) ||
    typeof (value as User).age !== 'number'
  ) {
    throw new TypeError('值必须是 User 类型')
  }
}

function processUser(data: unknown) {
  assertIsUser(data)

  // ✅ data 的类型：User
  console.log(data.name, data.age)
}
```

### 6.4. 非空断言函数

```typescript
function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error('值不能为 null 或 undefined')
  }
}

function process(value: string | null | undefined) {
  assertIsDefined(value)

  // ✅ value 的类型：string
  console.log(value.toUpperCase())
}
```

## 7. 🤔 类型守卫的最佳实践？

### 7.1. 单一职责

```typescript
// ✅ 好：每个守卫只检查一种类型
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0
}

// ❌ 避免：一个守卫做太多事
function isValidInput(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value.length < 100 &&
    /^[a-zA-Z]+$/.test(value)
  )
}
```

### 7.2. 可组合性

```typescript
// ✅ 组合简单的守卫
function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null
}

function hasProperty<K extends string>(
  obj: object,
  key: K
): obj is object & Record<K, unknown> {
  return key in obj
}

function isUser(value: unknown): value is User {
  return (
    isObject(value) &&
    hasProperty(value, 'name') &&
    typeof value.name === 'string' &&
    hasProperty(value, 'age') &&
    typeof value.age === 'number'
  )
}
```

### 7.3. 性能考虑

```typescript
// ✅ 好：先检查最快的条件
function isValidUser(value: unknown): value is User {
  // 快速检查
  if (typeof value !== 'object' || value === null) {
    return false
  }

  // 详细检查
  const obj = value as User
  return (
    typeof obj.name === 'string' && typeof obj.age === 'number' && obj.age >= 0
  )
}

// ❌ 避免：昂贵的正则表达式检查放在前面
function isEmail(value: unknown): value is string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return typeof value === 'string' && emailRegex.test(value) // ⚠️ 先检查类型
}
```

### 7.4. 错误处理

```typescript
// ✅ 类型守卫：返回 boolean
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    typeof (value as User).name === 'string'
  )
}

// ✅ 断言函数：抛出错误
function assertIsUser(value: unknown): asserts value is User {
  if (!isUser(value)) {
    throw new TypeError('无效的 User 对象')
  }
}

// 根据场景选择
function processOptional(value: unknown) {
  if (isUser(value)) {
    // 可选处理
    console.log(value.name)
  }
}

function processRequired(value: unknown) {
  assertIsUser(value)
  // 必须是 User
  console.log(value.name)
}
```

## 8. 🔗 引用

- [Type Predicates][1]
- [Assertion Functions][2]
- [Narrowing][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
[2]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions
[3]: https://www.typescriptlang.org/docs/handbook/2/narrowing.html
