# [0093. 剩余参数](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0093.%20%E5%89%A9%E4%BD%99%E5%8F%82%E6%95%B0)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是剩余参数？](#3--什么是剩余参数)
  - [3.1. 关键特性](#31-关键特性)
  - [3.2. 声明剩余参数的基本语法](#32-声明剩余参数的基本语法)
  - [3.3. 剩余参数的元组类型（TypeScript 4.0+）](#33-剩余参数的元组类型typescript-40)
  - [3.4. 泛型剩余参数](#34-泛型剩余参数)
  - [3.5. 必须是最后一个参数](#35-必须是最后一个参数)
  - [3.6. 只能有一个剩余参数](#36-只能有一个剩余参数)
  - [3.7. 类型必须是数组或元组](#37-类型必须是数组或元组)
  - [3.8. 剩余参数可以与可选参数结合](#38-剩余参数可以与可选参数结合)
- [4. 🤔 关于剩余参数的使用都有哪些实践建议？](#4--关于剩余参数的使用都有哪些实践建议)
- [5. 🔗 引用](#5--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 剩余参数的定义和语法
- 剩余参数的类型、操作、数量、位置约束
- 剩余参数的实践指南

## 2. 🫧 评价

剩余参数（Rest Parameters）使用 `...` 语法，允许函数接收任意数量的参数，并将它们收集到一个数组中。这是 ES6 引入的特性，TypeScript 为其添加了类型支持。

剩余参数解决了 JavaScript 中处理可变参数的问题，在 TypeScript 中：

- 剩余参数必须是数组类型或元组类型
- 必须是最后一个参数
- 只能有一个剩余参数

## 3. 🤔 什么是剩余参数？

剩余参数使用 `...` 语法，将多个参数收集到一个数组中。

```ts
// 普通参数：固定数量
function add(a: number, b: number): number {
  return a + b
}
add(1, 2) // ✅ 必须传 2 个参数

// 剩余参数：可变数量
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0)
}
sum(1, 2) // ✅ 2 个参数
sum(1, 2, 3) // ✅ 3 个参数
sum(1, 2, 3, 4, 5) // ✅ 5 个参数
```

### 3.1. 关键特性

- 收集参数：将多个参数收集到数组
- 类型约束：类型必须是数组或元组
- 操作约束：几乎无约束，可以使用所有数组方法
- 数量约束：只能有一个剩余参数
- 位置约束：必须是最后一个参数
  - 如果剩余参数不是位于结尾，则会报 1014 错误 `A rest parameter must be last in a parameter list.(1014)`
  - 如果剩余参数和可选参数同时出现，那么剩余参数必须位于可选参数之后

### 3.2. 声明剩余参数的基本语法

```ts
// 语法：...参数名: 类型[]
function func(...args: Type[]) {
  // args 是 Type[] 类型的数组
}
```

示例：

```ts
// ✅ 数字数组
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0)
}

// ✅ 字符串数组
function concat(...strings: string[]): string {
  return strings.join('')
}

// ✅ 混合类型（使用联合类型）
function log(...messages: (string | number)[]): void {
  console.log(...messages)
}

// ✅ 对象数组
interface User {
  name: string
  age: number
}

function saveUsers(...users: User[]): void {
  users.forEach((user) => {
    console.log(`Saving ${user.name}`)
  })
}

// ✅ 与其他参数结合（固定参数 + 剩余参数）
function greet(greeting: string, ...names: string[]): string {
  return `${greeting}, ${names.join(' and ')}!`
}

greet('Hello', 'Alice') // 'Hello, Alice!'
greet('Hello', 'Alice', 'Bob') // 'Hello, Alice and Bob!'
greet('Hello', 'Alice', 'Bob', 'Charlie') // 'Hello, Alice and Bob and Charlie!'
```

### 3.3. 剩余参数的元组类型（TypeScript 4.0+）

```ts
// ✅ 固定前几个参数，后面任意数量
function log(message: string, ...args: [number, ...string[]]): void {
  const foo = args[0] // foo: number - args[0] 是 number
  const bar = args[1] // bar: string - args[1]... 是 string
}

log('Message', 42, 'a', 'b', 'c') // ✅

// ✅ 元组剩余元素
function configure(
  ...config: [host: string, port: number, ...options: boolean[]]
): void {
  const [host, port, ...opts] = config
  // 类型推断结果：
  // host: string
  // port: number
  // options: boolean[]
  console.log(host, port, opts)
}

configure('localhost', 3000, true, false, true) // ✅

// ✅ 元组可以展开到剩余参数
type Args = [string, number, boolean]

function process(...args: Args): void {
  const [a, b, c] = args
  console.log(a, b, c)
}

const tuple: Args = ['hello', 42, true]
process(...tuple) // ✅ 展开元组
```

### 3.4. 泛型剩余参数

::: code-group

```ts [泛型数组]
function first<T>(...items: T[]): T | undefined {
  return items[0]
}

const foo = first(1, 2, 3)
// const foo: 1 | 2 | 3 | undefined

const bar = first('a', 'b', 'c')
// const bar: "a" | "b" | "c" | undefined

let foo2 = first(1, 2, 3)
// let foo2: number | undefined

let bar2 = first('a', 'b', 'c')
// let bar2: string | undefined
```

```ts [泛型元组]
function tuple<T extends any[]>(...args: T): T {
  return args
}

const result = tuple(1, 'hello', true)
// 类型：[number, string, boolean]
```

:::

### 3.5. 必须是最后一个参数

```ts
// ✅ 剩余参数在最后
function good(a: string, b: number, ...rest: string[]) {}

// ❌ 剩余参数不是最后一个
function bad(...rest: string[], a: string) {}
// Error: A rest parameter must be last in a parameter list
```

### 3.6. 只能有一个剩余参数

```ts
// ❌ 不能有多个剩余参数
function bad(...nums: number[], ...strs: string[]) {}
// Error: A rest parameter must be last in a parameter list

// ✅ 使用联合类型
function good(...items: (number | string)[]) {}
```

### 3.7. 类型必须是数组或元组

```ts
// ❌ 不能是非数组类型
function bad(...args: number) {}
// Error: A rest parameter must be of an array type

// ✅ 数组类型
function good1(...args: number[]) {}

// ✅ 元组类型
function good2(...args: [string, number]) {}

// ✅ 只读数组
function good3(...args: readonly number[]) {}
```

### 3.8. 剩余参数可以与可选参数结合

如果剩余参数和可选参数同时出现，那么剩余参数必须位于可选参数之后。

```ts
// ✅ 可选参数 + 剩余参数
function process(required: string, optional?: number, ...rest: string[]) {
  console.log(required, optional, rest)
}

process('a') // ✅
process('a', 1) // ✅
process('a', 1, 'b', 'c') // ✅
```

## 4. 🤔 关于剩余参数的使用都有哪些实践建议？

```ts
// ✅ 1. 使用具体的类型而不是 any
// Bad
function bad(...args: any[]) {}

// Good
function good(...args: (string | number)[]) {}

// ✅ 2. 结合类型守卫使用
function process(...items: (string | number)[]): void {
  items.forEach((item) => {
    if (typeof item === 'string') {
      console.log(item.toUpperCase())
    } else {
      console.log(item.toFixed(2))
    }
  })
}

// ✅ 3. 使用元组类型提供更精确的类型
// 第一个参数是 string，后面都是 number
function log(message: string, ...values: number[]): void {
  console.log(message, values)
}

// ✅ 4. 文档化剩余参数
/**
 * 计算多个数字的总和
 * @param numbers - 任意数量的数字
 * @returns 所有数字的和
 */
function sum(...numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0)
}

// ✅ 5. 检查空数组
function average(...numbers: number[]): number {
  if (numbers.length === 0) {
    throw new Error('At least one number is required')
  }
  return numbers.reduce((a, b) => a + b, 0) / numbers.length
}

// ✅ 6. 使用泛型增加灵活性
function merge<T>(...objects: T[]): T {
  return Object.assign({}, ...objects)
}

// ✅ 7. 剩余参数与解构结合
function configure(
  ...[host, port, ...options]: [string, number, ...boolean[]]
): void {
  console.log(host, port, options)
}

// ✅ 8. 替代 arguments 对象
// Bad: 使用 arguments（不推荐）
function badSum() {
  return Array.from(arguments).reduce((a, b) => a + b, 0)
}

// Good: 使用剩余参数
function goodSum(...numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0)
}
```

## 5. 🔗 引用

- [TypeScript Handbook - Rest Parameters][1]
- [MDN - Rest Parameters][2]
- [TypeScript 4.0 - Variadic Tuple Types][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/functions.html#rest-parameters
[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters
[3]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types
