# [0253. 声明空间与变量空间](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0253.%20%E5%A3%B0%E6%98%8E%E7%A9%BA%E9%97%B4%E4%B8%8E%E5%8F%98%E9%87%8F%E7%A9%BA%E9%97%B4)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是声明空间和变量空间？](#3--什么是声明空间和变量空间)
  - [3.1. 类型声明空间](#31-类型声明空间)
  - [3.2. 变量声明空间](#32-变量声明空间)
  - [3.3. 两个空间相互独立](#33-两个空间相互独立)
- [4. 🤔 不同声明的空间归属？](#4--不同声明的空间归属)
  - [4.1. 只存在于类型空间](#41-只存在于类型空间)
  - [4.2. 只存在于变量空间](#42-只存在于变量空间)
  - [4.3. 同时存在于两个空间](#43-同时存在于两个空间)
- [5. � 命名冲突如何处理？](#5--命名冲突如何处理)
  - [5.1. 同一空间的冲突](#51-同一空间的冲突)
  - [5.2. 不同空间可以同名](#52-不同空间可以同名)
  - [5.3. 声明合并](#53-声明合并)
- [6. 🤔 typeof 在两个空间的作用？](#6--typeof-在两个空间的作用)
  - [6.1. 值空间的 typeof](#61-值空间的-typeof)
  - [6.2. 类型空间的 typeof](#62-类型空间的-typeof)
  - [6.3. typeof 的双重用法](#63-typeof-的双重用法)
- [7. 🤔 双重声明的实际应用？](#7--双重声明的实际应用)
  - [7.1. 类型和命名空间组合](#71-类型和命名空间组合)
  - [7.2. 接口和对象组合](#72-接口和对象组合)
  - [7.3. React 组件模式](#73-react-组件模式)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 声明空间与变量空间的概念
- 不同声明的空间归属
- 命名冲突处理
- typeof 的双重含义
- 双重声明的应用场景

## 2. 🫧 评价

TypeScript 维护两个独立的命名空间：类型声明空间和变量声明空间。

- 类型和值可以同名
- 不同声明类型归属不同空间
- 理解空间有助于避免命名冲突
- class 和 enum 同时存在于两个空间
- typeof 在两个空间有不同作用

## 3. 🤔 什么是声明空间和变量空间？

TypeScript 有两个独立的命名空间用于存储不同类型的声明。

### 3.1. 类型声明空间

```typescript
// ✅ 类型声明空间：存储类型信息
interface User {
  name: string
}

type Point = {
  x: number
  y: number
}

// 这些只能在类型位置使用
const user: User = { name: 'Tom' } // ✅
const point: Point = { x: 1, y: 2 } // ✅

// ❌ 不能在值位置使用
// const u = new User();     // 错误：User 只是类型
// const p = Point;          // 错误：Point 只是类型
```

### 3.2. 变量声明空间

```typescript
// ✅ 变量声明空间：存储运行时值
const count = 42

function greet(name: string) {
  return `Hello, ${name}`
}

class Person {
  constructor(public name: string) {}
}

// 这些只能在值位置使用
console.log(count) // ✅
const result = greet('Tom') // ✅
const person = new Person('Tom') // ✅

// ❌ 不能在类型位置使用
// let x: count = 42;        // 错误：count 不是类型
// function process(fn: greet) {}  // 错误：greet 不是类型
```

### 3.3. 两个空间相互独立

```typescript
// ✅ 类型和值可以同名（不同空间）
type Data = {
  value: number
}

const Data = {
  value: 42,
}

// ✅ 类型位置使用类型空间的 Data
const obj: Data = { value: 1 }

// ✅ 值位置使用变量空间的 Data
console.log(Data.value) // 42

// 两个 Data 完全独立，互不影响
```

## 4. 🤔 不同声明的空间归属？

不同的声明方式属于不同的空间。

### 4.1. 只存在于类型空间

```typescript
// ✅ interface：仅类型空间
interface User {
  name: string
}

const user: User = { name: 'Tom' } // ✅ 类型位置
// const u = User;  // ❌ 不能作为值使用

// ✅ type：仅类型空间
type Point = {
  x: number
  y: number
}

const point: Point = { x: 1, y: 2 } // ✅ 类型位置
// const p = Point;  // ❌ 不能作为值使用

// ✅ 类型参数：仅类型空间
function identity<T>(value: T): T {
  // T 仅类型空间
  // const x: T = value;  // ✅ 类型位置
  // const y = T;  // ❌ 不能作为值使用
  return value
}
```

### 4.2. 只存在于变量空间

```typescript
// ✅ let/const/var：仅变量空间
const count = 42
let name = 'Tom'

console.log(count) // ✅ 值位置
// let x: count = 42;  // ❌ 不能作为类型使用

// ✅ 函数表达式：仅变量空间
const add = (a: number, b: number) => a + b

const result = add(1, 2) // ✅ 值位置
// let fn: add;  // ❌ 不能作为类型使用

// ✅ 函数声明：仅变量空间
function greet(name: string) {
  return `Hello, ${name}`
}

greet('World') // ✅ 值位置
// let fn: greet;  // ❌ 不能作为类型使用
```

### 4.3. 同时存在于两个空间

```typescript
// ✅ class：同时存在于两个空间
class Person {
  constructor(public name: string) {}
}

// 类型空间：作为类型使用
const person: Person = new Person('Tom')

// 变量空间：作为构造函数使用
const AnotherPerson = Person
const person2 = new AnotherPerson('Jerry')

// ✅ enum：同时存在于两个空间
enum Color {
  Red,
  Green,
  Blue,
}

// 类型空间：作为类型使用
let color: Color = Color.Red

// 变量空间：作为对象使用
const colors = Object.values(Color).filter((v) => typeof v === 'number')

// ✅ namespace：同时存在于两个空间
namespace Utils {
  export interface Config {
    timeout: number
  }

  export function log(msg: string) {
    console.log(msg)
  }
}

// 类型空间
const config: Utils.Config = { timeout: 1000 }

// 变量空间
Utils.log('Hello')
```

## 5. � 命名冲突如何处理？

同一空间内不能有重名声明，但不同空间可以。

### 5.1. 同一空间的冲突

```typescript
// ❌ 类型空间内冲突
interface User {
  name: string
}

// 错误：Duplicate identifier 'User'
// interface User {
//   age: number;
// }

// ❌ 变量空间内冲突
const count = 42

// 错误：Cannot redeclare block-scoped variable 'count'
// const count = 100;

// ❌ 类型空间内不同声明方式也会冲突
type Point = { x: number }

// 错误：Duplicate identifier 'Point'
// interface Point {
//   y: number;
// }
```

### 5.2. 不同空间可以同名

```typescript
// ✅ 类型空间和变量空间可以同名
type User = {
  name: string
}

const User = {
  create: (name: string): User => ({ name }),
}

// 类型位置使用类型空间的 User
const user: User = { name: 'Tom' }

// 值位置使用变量空间的 User
const newUser = User.create('Jerry')

// ✅ 实际应用：工厂模式
type Product = {
  id: number
  name: string
}

namespace Product {
  export function create(id: number, name: string): Product {
    return { id, name }
  }

  export function isValid(product: unknown): product is Product {
    return (
      typeof product === 'object' &&
      product !== null &&
      'id' in product &&
      'name' in product
    )
  }
}

// 类型空间：类型
const product: Product = { id: 1, name: 'Item' }

// 变量空间：工具函数
const newProduct = Product.create(2, 'Item2')
const valid = Product.isValid(newProduct)
```

### 5.3. 声明合并

```typescript
// ✅ interface 支持声明合并
interface User {
  name: string
}

interface User {
  age: number
}

// 合并为：{ name: string; age: number }
const user: User = {
  name: 'Tom',
  age: 25,
}

// ✅ namespace 支持声明合并
namespace Utils {
  export function log(msg: string) {
    console.log(msg)
  }
}

namespace Utils {
  export function warn(msg: string) {
    console.warn(msg)
  }
}

// 合并为一个 namespace
Utils.log('info')
Utils.warn('warning')
```

## 6. 🤔 typeof 在两个空间的作用？

typeof 在不同位置有不同含义。

### 6.1. 值空间的 typeof

```typescript
// ✅ JavaScript 的 typeof 运算符
const count = 42
const type = typeof count // "number"

const user = { name: 'Tom' }
const objType = typeof user // "object"

// 运行时运算符，返回字符串
console.log(typeof count) // "number"
console.log(typeof user) // "object"
```

### 6.2. 类型空间的 typeof

```typescript
// ✅ TypeScript 的 typeof 类型运算符
const config = {
  host: 'localhost',
  port: 3000,
}

// 获取 config 的类型
type Config = typeof config
// 等价于：
// type Config = {
//   host: string;
//   port: number;
// }

// ✅ 从函数获取类型
function greet(name: string) {
  return `Hello, ${name}`
}

type GreetFn = typeof greet
// 等价于：
// type GreetFn = (name: string) => string

// ✅ 从类获取构造函数类型
class Person {
  constructor(public name: string) {}
}

type PersonConstructor = typeof Person
// 等价于：
// type PersonConstructor = new (name: string) => Person
```

### 6.3. typeof 的双重用法

```typescript
// ✅ 同时使用两种 typeof
const value = 42

// 值空间：JavaScript typeof
if (typeof value === 'number') {
  console.log('是数字')
}

// 类型空间：TypeScript typeof
type ValueType = typeof value // number

// ✅ 结合使用
const config = {
  timeout: 1000,
  retries: 3,
}

// 类型空间
type Config = typeof config

// 值空间
function validateConfig(obj: unknown): obj is Config {
  return (
    typeof obj === 'object' && // 值空间 typeof
    obj !== null &&
    'timeout' in obj &&
    'retries' in obj
  )
}
```

## 7. 🤔 双重声明的实际应用？

利用两个空间可以创建更优雅的 API。

### 7.1. 类型和命名空间组合

```typescript
// ✅ 类型 + 命名空间模式
type Result<T> = { success: true; data: T } | { success: false; error: string }

namespace Result {
  export function ok<T>(data: T): Result<T> {
    return { success: true, data }
  }

  export function err<T>(error: string): Result<T> {
    return { success: false, error }
  }

  export function isOk<T>(
    result: Result<T>
  ): result is { success: true; data: T } {
    return result.success
  }
}

// 使用
function divide(a: number, b: number): Result<number> {
  if (b === 0) {
    return Result.err('除数不能为零')
  }
  return Result.ok(a / b)
}

const result = divide(10, 2)
if (Result.isOk(result)) {
  console.log(result.data) // 5
}
```

### 7.2. 接口和对象组合

```typescript
// ✅ 接口 + 对象字面量
interface Logger {
  log(message: string): void
  error(message: string): void
}

const Logger = {
  create(): Logger {
    return {
      log(message) {
        console.log(`[LOG] ${message}`)
      },
      error(message) {
        console.error(`[ERROR] ${message}`)
      },
    }
  },
}

// 类型位置
const logger: Logger = Logger.create()

// 值位置
logger.log('Hello')
```

### 7.3. React 组件模式

```typescript
// ✅ React 中的常见模式
import React from 'react'

// 类型空间：组件 Props
interface Button {
  onClick: () => void
  children: React.ReactNode
}

// 变量空间：组件函数 + 子组件
const Button: React.FC<Button> & {
  Primary: React.FC<Button>
  Secondary: React.FC<Button>
} = ({ onClick, children }) => {
  return <button onClick={onClick}>{children}</button>
}

Button.Primary = (props) => {
  return <Button {...props} />
}

Button.Secondary = (props) => {
  return <Button {...props} />
}

// 使用
// <Button.Primary onClick={() => {}}>Click</Button.Primary>
```

## 8. 🔗 引用

- [TypeScript Declaration Spaces][1]
- [typeof Type Operator][2]
- [Declaration Merging][3]

[1]: https://basarat.gitbook.io/typescript/project/declarationspaces
[2]: https://www.typescriptlang.org/docs/handbook/2/typeof-types.html
[3]: https://www.typescriptlang.org/docs/handbook/declaration-merging.html
