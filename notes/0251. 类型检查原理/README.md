# [0251. 类型检查原理](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0251.%20%E7%B1%BB%E5%9E%8B%E6%A3%80%E6%9F%A5%E5%8E%9F%E7%90%86)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 类型检查的基本原理？](#3-类型检查的基本原理)
  - [3.1. 结构类型系统](#31-结构类型系统)
  - [3.2. 类型的内部表示](#32-类型的内部表示)
  - [3.3. 类型检查步骤](#33-类型检查步骤)
- [4. 类型推断如何工作？](#4-类型推断如何工作)
  - [4.1. 基本类型推断](#41-基本类型推断)
  - [4.2. 最佳公共类型](#42-最佳公共类型)
  - [4.3. 上下文类型推断](#43-上下文类型推断)
  - [4.4. 返回类型推断](#44-返回类型推断)
  - [4.5. 泛型类型推断](#45-泛型类型推断)
- [5. 类型兼容性检查？](#5-类型兼容性检查)
  - [5.1. 对象类型兼容性](#51-对象类型兼容性)
  - [5.2. 函数类型兼容性](#52-函数类型兼容性)
  - [5.3. 可选属性兼容性](#53-可选属性兼容性)
- [6. 控制流分析？](#6-控制流分析)
  - [6.1. 类型守卫收窄](#61-类型守卫收窄)
  - [6.2. 赋值收窄](#62-赋值收窄)
  - [6.3. 可辨识联合](#63-可辨识联合)
  - [6.4. 非空断言影响](#64-非空断言影响)
- [7. 类型缓存机制？](#7-类型缓存机制)
  - [7.1. 类型缓存](#71-类型缓存)
  - [7.2. 增量编译](#72-增量编译)
  - [7.3. 性能优化建议](#73-性能优化建议)
- [8. 引用](#8-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 类型检查基本原理
- 类型推断机制
- 类型兼容性检查
- 控制流分析
- 类型缓存机制

## 2. 评价

理解 TypeScript 类型检查原理有助于编写更高质量的代码和理解编译错误。

- 结构类型系统
- 类型推断算法
- 控制流敏感
- 渐进式类型检查
- 编译器优化

## 3. 类型检查的基本原理？

TypeScript 使用结构类型系统和渐进式类型检查。

### 3.1. 结构类型系统

```ts
// ✅ 结构类型：只看结构，不看名称
interface Point {
  x: number
  y: number
}

interface Coordinate {
  x: number
  y: number
}

const point: Point = { x: 1, y: 2 }
const coord: Coordinate = point // ✅ 可以赋值，因为结构相同

// 类型检查过程：
// 1. Point 类型：{ x: number; y: number }
// 2. Coordinate 类型：{ x: number; y: number }
// 3. 结构相同 → 兼容
```

### 3.2. 类型的内部表示

```ts
// TypeScript 编译器内部的类型表示（简化）

// 源代码
const x: number = 42

// 类型信息
/*
Symbol {
  name: "x",
  declarations: [VariableDeclaration],
  type: {
    kind: TypeKind.Number,
    flags: TypeFlags.Number
  }
}
*/

// 复杂类型
interface User {
  name: string
  age: number
}

// 类型表示
/*
Type {
  kind: TypeKind.Object,
  properties: {
    name: {
      kind: TypeKind.String,
      flags: TypeFlags.String
    },
    age: {
      kind: TypeKind.Number,
      flags: TypeFlags.Number
    }
  }
}
*/
```

### 3.3. 类型检查步骤

```ts
// 源代码
function add(a: number, b: number): number {
  return a + b
}

add(1, 2) // ✅
add(1, '2') // ❌

// 类型检查步骤：
// 1. 分析函数签名
//    - 参数类型：(a: number, b: number)
//    - 返回类型：number

// 2. 检查调用 add(1, 2)
//    - 实参 1 的类型：number
//    - 形参 a 的类型：number
//    - 检查：number 可以赋值给 number ✅
//    - 实参 2 的类型：number
//    - 形参 b 的类型：number
//    - 检查：number 可以赋值给 number ✅

// 3. 检查调用 add(1, "2")
//    - 实参 "2" 的类型：string
//    - 形参 b 的类型：number
//    - 检查：string 不能赋值给 number ❌
//    - 报错：Argument of type 'string' is not assignable to parameter of type 'number'
```

## 4. 类型推断如何工作？

TypeScript 使用多种推断算法来确定类型。

### 4.1. 基本类型推断

```ts
// ✅ 从初始值推断
const x = 42 // 推断为：42（字面量类型）
let y = 42 // 推断为：number
const str = 'hello' // 推断为："hello"
let str2 = 'hello' // 推断为：string

// 推断规则：
// - const：推断为字面量类型
// - let/var：推断为基本类型
```

### 4.2. 最佳公共类型

```ts
// ✅ 联合类型推断
const arr = [1, 'hello', true]
// 推断为：(number | string | boolean)[]

// 推断过程：
// 1. 元素类型：number, string, boolean
// 2. 计算最佳公共类型：number | string | boolean
// 3. 数组类型：(number | string | boolean)[]
```

### 4.3. 上下文类型推断

```ts
// ✅ 从上下文推断参数类型
const numbers = [1, 2, 3]

numbers.forEach((n) => {
  // n 的类型从 forEach 的类型签名推断为 number
  console.log(n.toFixed())
})

// 推断过程：
// 1. numbers 的类型：number[]
// 2. forEach 签名：(callbackfn: (value: number) => void) => void
// 3. 从签名推断 n 的类型：number
```

### 4.4. 返回类型推断

```ts
// ✅ 从返回语句推断返回类型
function greet(name: string) {
  return `Hello, ${name}`
  // 推断返回类型：string
}

function process(flag: boolean) {
  if (flag) {
    return 42
  }
  return 'default'
}
// 推断返回类型：number | string

// 推断过程：
// 1. 收集所有 return 语句的类型
// 2. 计算联合类型
// 3. 确定函数返回类型
```

### 4.5. 泛型类型推断

```ts
// ✅ 泛型参数推断
function identity<T>(value: T): T {
  return value
}

const num = identity(42) // T 推断为 number
const str = identity('hello') // T 推断为 string

// 推断过程：
// 1. 从实参推断类型参数 T
// 2. identity(42)：T = number
// 3. identity("hello")：T = string

// 复杂示例
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn)
}

const lengths = map([1, 2, 3], (n) => n.toString())
// T 推断为 number
// U 推断为 string
// 返回类型：string[]
```

## 5. 类型兼容性检查？

TypeScript 使用结构类型系统检查类型兼容性。

### 5.1. 对象类型兼容性

```ts
// ✅ 结构兼容性
interface Named {
  name: string
}

class Person {
  name: string
  constructor(name: string) {
    this.name = name
  }
}

const p: Named = new Person('Tom') // ✅ 兼容

// 检查过程：
// 1. Named 需要：{ name: string }
// 2. Person 有：{ name: string }
// 3. 结构匹配 → 兼容

// ⚠️ 额外属性
interface Point {
  x: number
  y: number
}

const point: Point = { x: 1, y: 2, z: 3 } // ❌ 字面量额外属性检查

const obj = { x: 1, y: 2, z: 3 }
const point2: Point = obj // ✅ 非字面量允许额外属性
```

### 5.2. 函数类型兼容性

```ts
// ✅ 函数参数逆变
type Handler1 = (a: string | number) => void
type Handler2 = (a: string) => void

const h1: Handler1 = () => {}
const h2: Handler2 = h1 // ✅ 参数类型可以更宽泛

// 检查过程：
// 1. Handler2 接受 string
// 2. Handler1 可以处理 string | number（包含 string）
// 3. 安全 → 兼容

// ✅ 返回值协变
type Getter1 = () => string
type Getter2 = () => string | number

const g1: Getter1 = () => 'hello'
const g2: Getter2 = g1 // ✅ 返回值可以更具体

// 检查过程：
// 1. Getter1 返回 string
// 2. Getter2 期望 string | number
// 3. string 是 string | number 的子类型
// 4. 安全 → 兼容
```

### 5.3. 可选属性兼容性

```ts
// ✅ 可选属性
interface Config {
  host: string
  port?: number
}

const config1: Config = { host: 'localhost' } // ✅
const config2: Config = { host: 'localhost', port: 3000 } // ✅

// 检查过程：
// 1. 必需属性 host：存在且类型正确 ✅
// 2. 可选属性 port：可以不存在 ✅
```

## 6. 控制流分析？

TypeScript 通过控制流分析自动收窄类型。

### 6.1. 类型守卫收窄

```ts
// ✅ typeof 类型守卫
function process(value: string | number) {
  if (typeof value === 'string') {
    // 这里 value 的类型被收窄为 string
    console.log(value.toUpperCase())
  } else {
    // 这里 value 的类型被收窄为 number
    console.log(value.toFixed())
  }
}

// 控制流分析：
// 1. 初始：value: string | number
// 2. if (typeof value === "string")
//    - true 分支：value: string
//    - false 分支：value: number
```

### 6.2. 赋值收窄

```ts
// ✅ 赋值后类型收窄
let value: string | number | boolean

value = 'hello'
// 这里 value 的类型被收窄为 string
console.log(value.toUpperCase())

value = 42
// 这里 value 的类型被收窄为 number
console.log(value.toFixed())

// 控制流图：
// value: string | number | boolean
//   ↓ value = "hello"
// value: string
//   ↓ value = 42
// value: number
```

### 6.3. 可辨识联合

```ts
// ✅ 可辨识联合的控制流分析
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; size: number }

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      // shape: { kind: "circle"; radius: number }
      return Math.PI * shape.radius ** 2
    case 'square':
      // shape: { kind: "square"; size: number }
      return shape.size ** 2
  }
}

// 控制流分析：
// 1. 初始：shape: Shape
// 2. case "circle"：shape.kind === "circle"
//    → shape: { kind: "circle"; radius: number }
// 3. case "square"：shape.kind === "square"
//    → shape: { kind: "square"; size: number }
```

### 6.4. 非空断言影响

```ts
// ✅ 非空断言收窄
function process(value: string | null | undefined) {
  if (value) {
    // value 的类型被收窄为 string
    console.log(value.toUpperCase())
  }
}

// ⚠️ 空字符串问题
function process2(value: string | null) {
  if (value) {
    // value: string（但排除了 ""）
  } else {
    // value: null | ""（字符串类型的假值）
  }
}
```

## 7. 类型缓存机制？

TypeScript 使用缓存来优化类型检查性能。

### 7.1. 类型缓存

```ts
// TypeScript 内部的类型缓存机制

// ✅ 相同结构的类型只创建一次
interface User1 {
  name: string
  age: number
}

interface User2 {
  name: string
  age: number
}

// User1 和 User2 在内部可能共享相同的类型表示

// ✅ 泛型实例化缓存
type Box<T> = { value: T }

const box1: Box<number> = { value: 1 }
const box2: Box<number> = { value: 2 }

// Box<number> 只会被实例化一次并缓存
```

### 7.2. 增量编译

```ts
// TypeScript 的增量编译优化

// ✅ 文件依赖图
// moduleA.ts → moduleB.ts → moduleC.ts
//
// 修改 moduleC.ts 时：
// - 只重新检查 moduleC.ts
// - moduleA.ts 和 moduleB.ts 使用缓存

// tsconfig.json
{
  "compilerOptions": {
    "incremental": true,        // 启用增量编译
    "tsBuildInfoFile": ".tsbuildinfo"  // 缓存文件
  }
}
```

### 7.3. 性能优化建议

```ts
// ✅ 避免复杂的类型计算
// ❌ 慢：每次都重新计算
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}

// ✅ 快：使用缓存
type CachedDeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: CachedDeepReadonly<T[K]> }
  : T

// ✅ 使用类型别名减少重复计算
type UserId = number
type UserName = string

interface User {
  id: UserId // 比直接用 number 更易缓存
  name: UserName // 比直接用 string 更易缓存
}
```

## 8. 引用

- [TypeScript Type System][1]
- [Control Flow Analysis][2]
- [Type Checking Performance][3]

[1]: https://github.com/microsoft/TypeScript/wiki/Type-System
[2]: https://www.typescriptlang.org/docs/handbook/2/narrowing.html
[3]: https://github.com/microsoft/TypeScript/wiki/Performance
