# [0091. 函数表达式类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0091.%20%E5%87%BD%E6%95%B0%E8%A1%A8%E8%BE%BE%E5%BC%8F%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是函数表达式类型？](#3--什么是函数表达式类型)
- [4. 🤔 定义函数类型的语法形式都有哪些？](#4--定义函数类型的语法形式都有哪些)
  - [4.1. 箭头式语法](#41-箭头式语法)
  - [4.2. 对象式语法](#42-对象式语法)
- [5. 🆚 函数表达式 vs 函数声明](#5--函数表达式-vs-函数声明)
- [6. 🤔 函数表达式类型在类型别名与接口中有什么差异？](#6--函数表达式类型在类型别名与接口中有什么差异)
  - [6.1. 使用类型别名定义函数表达式类型](#61-使用类型别名定义函数表达式类型)
  - [6.2. 使用接口定义函数表达式类型](#62-使用接口定义函数表达式类型)
  - [6.3. 类型别名 vs 接口](#63-类型别名-vs-接口)
- [7. 🤔 使用函数表达式类型的实践建议都有哪些？](#7--使用函数表达式类型的实践建议都有哪些)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 函数表达式类型的定义
- 函数类型的声明语法
- 在类型别名与接口中声明函数表达式类型的差异
- 函数表达式 vs 函数声明
- 实践建议

## 2. 🫧 评价

函数表达式类型（Function Expression Types）是 TypeScript 中为函数表达式添加类型注解的方式。

与函数声明类型不同，函数表达式类型可以独立抽离出来，保存到类型变量中（比如 `type Add = (a: number, b: number) => number`），因此需要为整个函数定义类型，而函数声明类型则是集成在函数定义语法中，不便于抽离，也不需要写全所有位置（参数、返回值）的类型信息，大多时候依赖 TS 完成类型推断。

## 3. 🤔 什么是函数表达式类型？

函数表达式类型是为函数表达式定义的类型签名，描述函数的参数类型和返回值类型。

```ts
// 函数表达式（没有类型注解）
const add1 = function (a, b) {
  return a + b
}

// 函数表达式类型（完整类型注解）
const add2: (a: number, b: number) => number = function (a, b) {
  return a + b
}

// 箭头函数形式
const add3: (a: number, b: number) => number = (a, b) => a + b
```

基本语法：

- `变量: 函数表达式类型 = 值`
- `(参数类型) => 返回值类型`

```ts
const func: (param1: Type1, param2: Type2) => ReturnType = (
  param1,
  param2
) => {}

// (param1: Type1, param2: Type2) => ReturnType
// 这一部分就是函数表达式类型
```

## 4. 🤔 定义函数类型的语法形式都有哪些？

主要有两种：

1. 箭头式语法 `(参数类型) => 返回值类型`
2. 对象式语法 `{ (参数类型): 函数表达式类型 }`

### 4.1. 箭头式语法

```ts
// 箭头语法
const add1: (a: number, b: number) => number = (a, b) => a + b

// 无参数
const getRandom: () => number = () => Math.random()

// 多个参数
const calculate: (a: number, b: number, op: string) => number = (a, b, op) => {
  // 实现 ...
  switch (op) {
    case '+':
      return a + b
    // ...
  }
  return -1
}

// 使用 type 定义函数类型
type AddFunction = (a: number, b: number) => number

const add2: AddFunction = (a, b) => a + b
const subtract: AddFunction = (a, b) => a - b
```

### 4.2. 对象式语法

```ts
// 使用对象字面量形式
const add1: { (a: number, b: number): number } = (a, b) => a + b

// 等价于箭头语法
const add2: (a: number, b: number) => number = (a, b) => a + b

// 接口定义函数类型也是使用对象式语法
interface AddFunction {
  (a: number, b: number): number
}

const add3: AddFunction = (a, b) => a + b
```

## 5. 🆚 函数表达式 vs 函数声明

| 特性     | 函数声明               | 函数表达式                   |
| -------- | ---------------------- | ---------------------------- |
| 语法     | `function name() {}`   | `const name = function() {}` |
| 类型位置 | 参数和返回值上（内联） | 变量类型注解（抽离）         |
| 使用场景 | 独立函数               | 回调、赋值、高阶函数         |
| 约束程度 | 更严格                 | 更宽松                       |

## 6. 🤔 函数表达式类型在类型别名与接口中有什么差异？

差异主要体现在写法上。

1. 类型别名：`type name = (parameters) => returnType`
2. 接口：`interface name { (parameters): returnType }`

### 6.1. 使用类型别名定义函数表达式类型

```ts
// 使用 type 定义函数类型
type BinaryOperation = (a: number, b: number) => number

const add: BinaryOperation = (a, b) => a + b
const subtract: BinaryOperation = (a, b) => a - b
const multiply: BinaryOperation = (a, b) => a * b
const divide: BinaryOperation = (a, b) => a / b

// 带可选参数
type Formatter = (value: string, uppercase?: boolean) => string

const format: Formatter = (value, uppercase = false) => {
  return uppercase ? value.toUpperCase() : value
}

// 带剩余参数
type Logger = (message: string, ...args: any[]) => void

const log: Logger = (message, ...args) => {
  console.log(message, ...args)
}
```

### 6.2. 使用接口定义函数表达式类型

```ts
// 使用接口定义函数类型
interface BinaryOperation {
  (a: number, b: number): number
}

const add: BinaryOperation = (a, b) => a + b

// 带属性的函数接口
interface Counter {
  (start: number): string
  interval: number
  reset(): void
}

const counter: Counter = ((start: number) => {
  return `Count: ${start}`
}) as Counter

counter.interval = 1000
counter.reset = () => console.log('Reset')
```

### 6.3. 类型别名 vs 接口

```ts
// ✅ 类型别名：简洁，适合纯函数类型
type Add = (a: number, b: number) => number

// ✅ 接口：适合需要属性的函数对象
interface jQuery {
  (selector: string): HTMLElement
  version: string
  ajax(url: string): Promise<any>
}
```

## 7. 🤔 使用函数表达式类型的实践建议都有哪些？

```ts
// ✅ 1. 使用类型别名复用函数类型
type BinaryOp = (a: number, b: number) => number

const add: BinaryOp = (a, b) => a + b
const subtract: BinaryOp = (a, b) => a - b

// ✅ 2. 为复杂函数类型添加注释
/**
 * 异步数据获取函数
 * @param id - 数据 ID
 * @returns Promise 包装的数据
 */
type FetchFunction<T> = (id: string) => Promise<T>

// ✅ 3. 使用泛型提高复用性
type Mapper<T, U> = (item: T, index: number) => U

// ✅ 4. 可选参数放在最后
type Format = (value: string, uppercase?: boolean, trim?: boolean) => string

// ✅ 5. 合理使用剩余参数类型
type Logger = (message: string, ...args: any[]) => void

// ✅ 6. 合理使用 void 类型表示函数无返回值
type Action = () => void // 无返回值

// ✅ 7. 单独抽离出来的函数类型定义推荐使用箭头语法
type Good = (a: number) => number
type Bad = { (a: number): number } // 不推荐

// ✅ 8. 回调函数使用类型别名单独抽离出来以便更好地复用
type Callback = (error: Error | null, result?: any) => void

function fetchData(callback: Callback) {
  // 实现
}
```

## 8. 🔗 引用

- [TypeScript Handbook - Functions][1]
- [TypeScript Handbook - Function Types][2]
- [TypeScript Deep Dive - Function Types][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/functions.html
[2]: https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions
[3]: https://basarat.gitbook.io/typescript/type-system/functions
