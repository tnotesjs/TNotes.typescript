# [0252. 类型擦除](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0252.%20%E7%B1%BB%E5%9E%8B%E6%93%A6%E9%99%A4)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 什么是类型擦除？](#3-什么是类型擦除)
  - [3.1. 基本示例](#31-基本示例)
  - [3.2. 接口擦除](#32-接口擦除)
  - [3.3. 类型别名擦除](#33-类型别名擦除)
- [4. 类型擦除的过程？](#4-类型擦除的过程)
  - [4.1. 编译流程中的类型擦除](#41-编译流程中的类型擦除)
  - [4.2. 保留的内容 vs. 删除的内容](#42-保留的内容-vs-删除的内容)
- [5. 类型擦除的影响？](#5-类型擦除的影响)
  - [5.1. 无法在运行时检查类型](#51-无法在运行时检查类型)
  - [5.2. 泛型类型参数擦除](#52-泛型类型参数擦除)
  - [5.3. typeof 的限制](#53-typeof-的限制)
- [6. 如何在运行时保留类型信息？](#6-如何在运行时保留类型信息)
  - [6.1. 使用 class 代替 interface](#61-使用-class-代替-interface)
  - [6.2. 使用判别式联合](#62-使用判别式联合)
  - [6.3. 使用 enum](#63-使用-enum)
  - [6.4. 使用运行时验证库](#64-使用运行时验证库)
- [7. 类型擦除的优缺点？](#7-类型擦除的优缺点)
  - [7.1. 优点](#71-优点)
  - [7.2. 缺点](#72-缺点)
  - [7.3. 对比其他语言](#73-对比其他语言)
- [8. 引用](#8-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 类型擦除的概念
- 类型擦除的过程
- 类型擦除的影响
- 运行时类型检查
- 类型擦除的优缺点

## 2. 评价

TypeScript 的类型擦除意味着类型信息只在编译时存在，运行时全部消失。

- 类型信息不占用运行时空间
- 无需类型系统运行时开销
- 与 JavaScript 完全兼容
- 需要其他方式实现运行时类型检查
- 理解类型擦除可以避免常见错误

## 3. 什么是类型擦除？

类型擦除是指 TypeScript 编译成 JavaScript 时删除所有类型信息。

### 3.1. 基本示例

```ts
// TypeScript 源代码
function greet(name: string): string {
  return `Hello, ${name}`
}

const result: string = greet('World')

// 编译后的 JavaScript
function greet(name) {
  return `Hello, ${name}`
}

const result = greet('World')

// 类型信息完全消失：
// - 参数类型 string 被删除
// - 返回类型 string 被删除
// - 变量类型 string 被删除
```

### 3.2. 接口擦除

```ts
// TypeScript
interface User {
  name: string
  age: number
}

const user: User = {
  name: 'Tom',
  age: 25,
}

// 编译后的 JavaScript
const user = {
  name: 'Tom',
  age: 25,
}

// interface User 完全消失
// 只剩下普通的对象字面量
```

### 3.3. 类型别名擦除

```ts
// TypeScript
type Point = {
  x: number
  y: number
}

type Callback = (value: string) => void

const point: Point = { x: 1, y: 2 }
const cb: Callback = (value) => console.log(value)

// 编译后的 JavaScript
const point = { x: 1, y: 2 }
const cb = (value) => console.log(value)

// type Point 和 type Callback 完全消失
```

## 4. 类型擦除的过程？

TypeScript 编译器在 Emitter 阶段执行类型擦除。

### 4.1. 编译流程中的类型擦除

```ts
// 源代码
function add(a: number, b: number): number {
  return a + b
}

// 编译流程：
// 1. Scanner：分词
//    function, add, (, a, :, number, ...

// 2. Parser：生成 AST
//    FunctionDeclaration {
//      name: "add",
//      parameters: [
//        { name: "a", type: NumberKeyword },
//        { name: "b", type: NumberKeyword }
//      ],
//      returnType: NumberKeyword,
//      body: ...
//    }

// 3. Binder：创建符号表
//    Symbol { name: "add", declarations: [...] }

// 4. Checker：类型检查
//    验证类型正确性

// 5. Emitter：生成 JavaScript（类型擦除）
//    移除所有类型注解，生成纯 JavaScript
function add(a, b) {
  return a + b
}
```

### 4.2. 保留的内容 vs. 删除的内容

```ts
// TypeScript
enum Color {
  Red,
  Green,
  Blue,
}

class Point {
  constructor(
    public x: number,
    public y: number,
  ) {}

  distance(other: Point): number {
    return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2)
  }
}

// 编译后的 JavaScript

// ✅ enum 被转换为对象（保留）
var Color
;(function (Color) {
  Color[(Color['Red'] = 0)] = 'Red'
  Color[(Color['Green'] = 1)] = 'Green'
  Color[(Color['Blue'] = 2)] = 'Blue'
})(Color || (Color = {}))

// ✅ class 被转换为函数（保留）
class Point {
  constructor(x, y) {
    this.x = x // ✅ 参数属性转换为赋值
    this.y = y
  }

  distance(other) {
    // ❌ 类型注解删除
    return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2)
  }
}

// 规则：
// - 有运行时值的：保留并转换（enum, class, namespace）
// - 纯类型信息：完全删除（interface, type, 类型注解）
```

## 5. 类型擦除的影响？

类型擦除导致运行时无法进行类型检查。

### 5.1. 无法在运行时检查类型

```ts
// ❌ 接口在运行时不存在
interface User {
  name: string
  age: number
}

function process(value: unknown) {
  // ❌ 错误：'User' only refers to a type, but is being used as a value here
  if (value instanceof User) {
    console.log(value.name)
  }
}

// ✅ 正确做法：使用类型守卫
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    typeof (value as User).name === 'string' &&
    'age' in value &&
    typeof (value as User).age === 'number'
  )
}

function process2(value: unknown) {
  if (isUser(value)) {
    console.log(value.name) // ✅ 类型守卫收窄
  }
}
```

### 5.2. 泛型类型参数擦除

```ts
// ❌ 泛型参数在运行时不存在
function createArray<T>(length: number): T[] {
  // ❌ 错误：Cannot create an instance of type parameter 'T'
  // return new Array(length).fill(new T());

  // ✅ 只能创建空数组
  return new Array(length)
}

// ✅ 需要传入构造函数
function createArray2<T>(ctor: new () => T, length: number): T[] {
  return new Array(length).fill(null).map(() => new ctor())
}

class User {
  name = 'default'
}

const users = createArray2(User, 3) // ✅ 正确
```

### 5.3. typeof 的限制

```ts
// ✅ typeof 只能检查 JavaScript 类型
function process(value: string | number) {
  if (typeof value === 'string') {
    console.log(value.toUpperCase())
  } else {
    console.log(value.toFixed())
  }
}

// ❌ 自定义类型无法用 typeof
interface Point {
  x: number
  y: number
}

function isPoint(value: unknown) {
  // ❌ 错误：'Point' only refers to a type
  // if (typeof value === "Point") { }

  // ✅ 需要手动检查结构
  return (
    typeof value === 'object' &&
    value !== null &&
    'x' in value &&
    'y' in value &&
    typeof (value as Point).x === 'number' &&
    typeof (value as Point).y === 'number'
  )
}
```

## 6. 如何在运行时保留类型信息？

有几种方法可以在运行时保留类型信息。

### 6.1. 使用 class 代替 interface

```ts
// ❌ interface 会被擦除
interface User {
  name: string
  age: number
}

// ✅ class 在运行时存在
class User {
  constructor(
    public name: string,
    public age: number,
  ) {}
}

function process(value: unknown) {
  if (value instanceof User) {
    // ✅ 可以使用 instanceof
    console.log(value.name)
  }
}
```

### 6.2. 使用判别式联合

```ts
// ✅ 使用字面量类型作为判别式
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; size: number }

function getArea(shape: Shape): number {
  // ✅ 运行时可以检查 kind 属性
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2
    case 'square':
      return shape.size ** 2
  }
}

// 判别式（kind）在运行时存在
const circle: Shape = { kind: 'circle', radius: 10 }
console.log(circle.kind) // "circle"
```

### 6.3. 使用 enum

```ts
// ✅ enum 在运行时存在
enum Status {
  Pending,
  Success,
  Failed,
}

function process(status: Status) {
  // ✅ 可以在运行时检查
  if (status === Status.Success) {
    console.log('成功')
  }
}

// enum 编译后是对象
console.log(Status.Success) // 1
console.log(Status[1]) // "Success"
```

### 6.4. 使用运行时验证库

```ts
// ✅ 使用 zod 进行运行时验证
import { z } from 'zod'

const UserSchema = z.object({
  name: z.string(),
  age: z.number(),
})

// ✅ 从 schema 推断类型
type User = z.infer<typeof UserSchema>

function processUser(data: unknown) {
  // ✅ 运行时验证
  const result = UserSchema.safeParse(data)

  if (result.success) {
    const user: User = result.data
    console.log(user.name)
  } else {
    console.error(result.error)
  }
}

// ✅ 既有编译时类型检查，又有运行时验证
```

## 7. 类型擦除的优缺点？

类型擦除带来了性能优势但也有局限性。

### 7.1. 优点

```ts
// ✅ 1. 零运行时开销
// TypeScript
function add(a: number, b: number): number {
  return a + b
}

// JavaScript（完全相同的性能）
function add(a, b) {
  return a + b
}

// 类型检查在编译时完成，运行时无任何开销

// ✅ 2. 完全兼容 JavaScript
// 任何 JavaScript 代码都是合法的 TypeScript

// ✅ 3. 产物体积小
// 类型信息不占用最终代码体积
```

### 7.2. 缺点

```ts
// ❌ 1. 无法运行时类型检查
function process(data: unknown) {
  // 需要手动验证
  if (typeof data === 'object' && data !== null && 'name' in data) {
    // 类型收窄
  }
}

// ❌ 2. 泛型类型信息丢失
function createInstance<T>(ctor: new () => T): T {
  return new ctor() // 只能传构造函数
}

// ❌ 3. 需要额外的运行时验证
// 对于来自外部的数据（API、用户输入等），
// 需要使用验证库（zod、io-ts 等）

import { z } from 'zod'

const schema = z.object({
  name: z.string(),
  age: z.number(),
})

// 需要同时维护类型和验证逻辑
```

### 7.3. 对比其他语言

```ts
// TypeScript：类型擦除
function process<T>(value: T): T {
  // ❌ 无法检查 T 的类型
  // ❌ 无法创建 T 的实例
  return value
}

// Java：类型保留（部分）
// public <T> T process(T value) {
//   // ✅ 可以通过反射获取类型信息
//   // ❌ 仍有类型擦除（泛型擦除）
// }

// C#：完整的运行时类型信息
// public T Process<T>(T value) {
//   // ✅ 可以获取 T 的完整类型信息
//   // ✅ 可以使用 typeof(T)
//   // ✅ 可以创建 T 的实例
// }
```

## 8. 引用

- [Type Erasure in TypeScript][1]
- [TypeScript Compiler Emitter][2]
- [Runtime Type Validation][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/classes.html#type-erasure
[2]: https://github.com/microsoft/TypeScript/wiki/Architectural-Overview#emitter
[3]: https://github.com/colinhacks/zod
