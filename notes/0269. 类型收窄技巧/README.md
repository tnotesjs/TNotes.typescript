# [0269. 类型收窄技巧](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0269.%20%E7%B1%BB%E5%9E%8B%E6%94%B6%E7%AA%84%E6%8A%80%E5%B7%A7)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是类型收窄？](#3--什么是类型收窄)
  - [3.1. 基本概念](#31-基本概念)
  - [3.2. 控制流分析](#32-控制流分析)
- [4. 🤔 typeof 类型收窄？](#4--typeof-类型收窄)
  - [4.1. 基本类型检查](#41-基本类型检查)
  - [4.2. typeof 的限制](#42-typeof-的限制)
  - [4.3. 实际应用](#43-实际应用)
- [5. 🤔 真值收窄？](#5--真值收窄)
  - [5.1. 基本真值检查](#51-基本真值检查)
  - [5.2. 空字符串问题](#52-空字符串问题)
  - [5.3. 数字 0 的问题](#53-数字-0-的问题)
  - [5.4. 布尔值转换](#54-布尔值转换)
- [6. 🤔 相等性收窄？](#6--相等性收窄)
  - [6.1. 精确相等检查](#61-精确相等检查)
  - [6.2. null/undefined 检查](#62-nullundefined-检查)
  - [6.3. 字面量检查](#63-字面量检查)
- [7. 🤔 in 操作符收窄？](#7--in-操作符收窄)
  - [7.1. 基本用法](#71-基本用法)
  - [7.2. 复杂对象](#72-复杂对象)
  - [7.3. 可选属性](#73-可选属性)
- [8. 🤔 instanceof 收窄？](#8--instanceof-收窄)
  - [8.1. 类实例检查](#81-类实例检查)
  - [8.2. 内置类型](#82-内置类型)
  - [8.3. Error 处理](#83-error-处理)
- [9. 🤔 可辨识联合？](#9--可辨识联合)
  - [9.1. 基本模式](#91-基本模式)
  - [9.2. 网络请求示例](#92-网络请求示例)
  - [9.3. 穷尽性检查](#93-穷尽性检查)
- [10. 🔗 引用](#10--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 类型收窄概念
- typeof 收窄
- 真值收窄
- 相等性收窄
- in 操作符收窄
- instanceof 收窄
- 可辨识联合

## 2. 🫧 评价

类型收窄是 TypeScript 的核心特性，让编译器能够在特定代码分支中推断出更精确的类型。

- TypeScript 类型系统的精髓
- 提供类型安全保障
- 减少类型断言
- 改善代码可读性
- 利用控制流分析

## 3. 🤔 什么是类型收窄？

类型收窄是指 TypeScript 在特定代码路径中将类型范围缩小到更具体类型的过程。

### 3.1. 基本概念

```ts
function process(value: string | number) {
  // 这里 value 的类型是 string | number

  if (typeof value === 'string') {
    // ✅ 在这个代码块中，TypeScript 知道 value 是 string
    console.log(value.toUpperCase())
  } else {
    // ✅ 在这个代码块中，TypeScript 知道 value 是 number
    console.log(value.toFixed(2))
  }
}
```

### 3.2. 控制流分析

```ts
function example(x: string | number | null) {
  if (x === null) {
    // x 的类型：null
    return
  }

  if (typeof x === 'string') {
    // x 的类型：string
    console.log(x.length)
  } else {
    // x 的类型：number（排除了 null 和 string）
    console.log(x.toFixed())
  }
}
```

## 4. 🤔 typeof 类型收窄？

`typeof` 是最常用的类型收窄方式。

### 4.1. 基本类型检查

```ts
function printValue(value: string | number | boolean) {
  if (typeof value === 'string') {
    console.log(value.toUpperCase())
  } else if (typeof value === 'number') {
    console.log(value.toFixed(2))
  } else {
    console.log(value ? 'true' : 'false')
  }
}
```

### 4.2. typeof 的限制

```ts
// ⚠️ typeof 对于 null 返回 "object"
function checkNull(value: string | null) {
  if (typeof value === 'object') {
    // ❌ 这里 value 仍然是 string | null
    // 因为 typeof null === "object"
  }

  // ✅ 正确的 null 检查
  if (value === null) {
    console.log('null')
  } else {
    console.log(value.toUpperCase())
  }
}

// ⚠️ typeof 对数组返回 "object"
function checkArray(value: string[] | string) {
  if (typeof value === 'object') {
    // value 的类型：string[]
    // 但这不是最好的方法
  }

  // ✅ 更好的方法
  if (Array.isArray(value)) {
    console.log(value.length)
  }
}
```

### 4.3. 实际应用

```ts
function formatValue(value: string | number | bigint): string {
  if (typeof value === 'string') {
    return value
  } else if (typeof value === 'number') {
    return value.toString()
  } else {
    // value 的类型：bigint
    return value.toString()
  }
}
```

## 5. 🤔 真值收窄？

利用 JavaScript 的真值/假值特性进行类型收窄。

### 5.1. 基本真值检查

```ts
function printLength(str: string | null | undefined) {
  // ❌ 可能出错
  // console.log(str.length);

  // ✅ 真值检查
  if (str) {
    // str 的类型：string
    console.log(str.length)
  }
}
```

### 5.2. 空字符串问题

```ts
function process(value: string | null) {
  // ⚠️ 注意：空字符串 "" 也是假值
  if (value) {
    // 这里排除了 null 和空字符串
    console.log(value.toUpperCase())
  }

  // ✅ 如果需要保留空字符串
  if (value !== null) {
    console.log(value.toUpperCase()) // 包括空字符串
  }
}
```

### 5.3. 数字 0 的问题

```ts
function printNumber(num: number | null) {
  // ⚠️ 数字 0 是假值
  if (num) {
    console.log(num.toFixed()) // 0 不会被打印
  }

  // ✅ 正确的检查
  if (num !== null) {
    console.log(num.toFixed()) // 包括 0
  }
}
```

### 5.4. 布尔值转换

```ts
function isEmpty(value: string | null | undefined): boolean {
  // ✅ 明确转换为布尔值
  return !value
}

function hasValue(value: string | null | undefined): value is string {
  // ✅ 类型谓词
  return value !== null && value !== undefined
}
```

## 6. 🤔 相等性收窄？

使用 `===`、`!==`、`==`、`!=` 进行类型收窄。

### 6.1. 精确相等检查

```ts
function process(x: string | number, y: string | boolean) {
  if (x === y) {
    // ✅ TypeScript 推断出 x 和 y 都是 string
    console.log(x.toUpperCase())
    console.log(y.toUpperCase())
  }
}
```

### 6.2. null/undefined 检查

```ts
function printValue(value: string | null | undefined) {
  // ✅ 同时排除 null 和 undefined
  if (value != null) {
    // value 的类型：string
    console.log(value.toUpperCase())
  }

  // ✅ 只排除 null
  if (value !== null) {
    // value 的类型：string | undefined
    console.log(value?.toUpperCase())
  }
}
```

### 6.3. 字面量检查

```ts
type Status = 'success' | 'error' | 'pending'

function handleStatus(status: Status) {
  if (status === 'success') {
    // status 的类型：'success'
    console.log('操作成功')
  } else if (status === 'error') {
    // status 的类型：'error'
    console.log('操作失败')
  } else {
    // status 的类型：'pending'
    console.log('处理中')
  }
}
```

## 7. 🤔 in 操作符收窄？

使用 `in` 操作符检查属性是否存在。

### 7.1. 基本用法

```ts
interface Dog {
  bark(): void
}

interface Cat {
  meow(): void
}

function makeSound(animal: Dog | Cat) {
  if ('bark' in animal) {
    // animal 的类型：Dog
    animal.bark()
  } else {
    // animal 的类型：Cat
    animal.meow()
  }
}
```

### 7.2. 复杂对象

```ts
interface Circle {
  kind: 'circle'
  radius: number
}

interface Rectangle {
  kind: 'rectangle'
  width: number
  height: number
}

type Shape = Circle | Rectangle

function getArea(shape: Shape): number {
  if ('radius' in shape) {
    // shape 的类型：Circle
    return Math.PI * shape.radius ** 2
  } else {
    // shape 的类型：Rectangle
    return shape.width * shape.height
  }
}
```

### 7.3. 可选属性

```ts
interface User {
  name: string
  email?: string
}

function printEmail(user: User) {
  if ('email' in user && user.email) {
    // ✅ 检查属性存在且不为 undefined
    console.log(user.email.toLowerCase())
  }
}
```

## 8. 🤔 instanceof 收窄？

使用 `instanceof` 检查对象的原型链。

### 8.1. 类实例检查

```ts
class Dog {
  bark() {
    console.log('Woof!')
  }
}

class Cat {
  meow() {
    console.log('Meow!')
  }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    // animal 的类型：Dog
    animal.bark()
  } else {
    // animal 的类型：Cat
    animal.meow()
  }
}
```

### 8.2. 内置类型

```ts
function process(value: Date | string) {
  if (value instanceof Date) {
    // value 的类型：Date
    console.log(value.toISOString())
  } else {
    // value 的类型：string
    console.log(value.toUpperCase())
  }
}
```

### 8.3. Error 处理

```ts
function handleError(error: unknown) {
  if (error instanceof Error) {
    // error 的类型：Error
    console.log(error.message)
    console.log(error.stack)
  } else if (typeof error === 'string') {
    // error 的类型：string
    console.log(error)
  } else {
    console.log('未知错误')
  }
}
```

## 9. 🤔 可辨识联合？

使用共同的字面量属性来区分联合类型的成员。

### 9.1. 基本模式

```ts
interface Circle {
  kind: 'circle'
  radius: number
}

interface Square {
  kind: 'square'
  size: number
}

interface Rectangle {
  kind: 'rectangle'
  width: number
  height: number
}

type Shape = Circle | Square | Rectangle

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      // shape 的类型：Circle
      return Math.PI * shape.radius ** 2
    case 'square':
      // shape 的类型：Square
      return shape.size ** 2
    case 'rectangle':
      // shape 的类型：Rectangle
      return shape.width * shape.height
  }
}
```

### 9.2. 网络请求示例

```ts
interface SuccessResponse {
  status: 'success'
  data: unknown
}

interface ErrorResponse {
  status: 'error'
  message: string
}

interface LoadingResponse {
  status: 'loading'
}

type ApiResponse = SuccessResponse | ErrorResponse | LoadingResponse

function handleResponse(response: ApiResponse) {
  switch (response.status) {
    case 'success':
      console.log(response.data)
      break
    case 'error':
      console.error(response.message)
      break
    case 'loading':
      console.log('加载中...')
      break
  }
}
```

### 9.3. 穷尽性检查

```ts
type Shape = Circle | Square | Rectangle

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2
    case 'square':
      return shape.size ** 2
    case 'rectangle':
      return shape.width * shape.height
    default:
      // ✅ 穷尽性检查
      const _exhaustive: never = shape
      return _exhaustive
  }
}

// 如果添加新的 Shape 类型但忘记处理，编译器会报错
```

## 10. 🔗 引用

- [Narrowing][1]
- [Type Guards][2]
- [Discriminated Unions][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/narrowing.html
[2]: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
[3]: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions
