# [0092. 可选参数与默认参数](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0092.%20%E5%8F%AF%E9%80%89%E5%8F%82%E6%95%B0%E4%B8%8E%E9%BB%98%E8%AE%A4%E5%8F%82%E6%95%B0)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 什么是可选参数？](#3-什么是可选参数)
  - [3.1. 基本语法](#31-基本语法)
  - [3.2. 类型推断](#32-类型推断)
  - [3.3. 可选参数的位置](#33-可选参数的位置)
  - [3.4. 可以有多个可选参数](#34-可以有多个可选参数)
  - [3.5. 剩余参数可以与可选参数结合](#35-剩余参数可以与可选参数结合)
- [4. 什么是默认参数？](#4-什么是默认参数)
  - [4.1. 基本语法](#41-基本语法)
  - [4.2. 类型推断](#42-类型推断)
  - [4.3. 默认参数的位置](#43-默认参数的位置)
- [5. 可选参数 vs 默认参数](#5-可选参数-vs-默认参数)
- [6. 可选参数和 `| undefined` 联合类型的区别是？](#6-可选参数和--undefined-联合类型的区别是)
- [7. 默认参数和可选参数的实践建议都有哪些？](#7-默认参数和可选参数的实践建议都有哪些)
- [8. 引用](#8-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 可选参数的定义和语法
- 默认参数的定义和语法
- 可选参数与默认参数的特点和区别
- 实践建议

## 2. 评价

可选参数（Optional Parameters）和默认参数（Default Parameters）是 TypeScript 函数中两种让参数变得灵活的机制：

- 可选参数：使用 `?` 标记，表示参数可以不传递，类型为 `T | undefined`
- 默认参数：使用 `= value` 赋值，表示参数有默认值，不传递时使用默认值

虽然它们都能让参数变得可选，但有重要区别：

- 可选参数没有默认值，值为 `undefined`
- 默认参数有明确的默认值

实际使用时，应该优先考虑使用“参数默认值”，而非“可选参数”。

## 3. 什么是可选参数？

可选参数使用 `?` 标记，表示调用时可以不传递该参数。

### 3.1. 基本语法

```ts
// 语法：参数名?: 类型
function greet(name: string, greeting?: string) {
  if (greeting) {
    return `${greeting}, ${name}`
  }
  return `Hello, ${name}`
}

// 调用
greet('Alice') // ✅ 'Hello, Alice'
greet('Bob', 'Hi') // ✅ 'Hi, Bob'
```

### 3.2. 类型推断

```ts
function log(message: string, level?: 'info' | 'warn' | 'error') {
  // level 的类型：'info' | 'warn' | 'error' | undefined
  console.log(`[${level ?? 'info'}] ${message}`)
}

log('Hello') // ✅
log('Warning', 'warn') // ✅
```

### 3.3. 可选参数的位置

```ts
// ✅ 可选参数必须在必需参数之后
function good(a: string, b?: number, c?: boolean) {}

// ❌ 可选参数之后不能有必需参数
function bad(a: string, b?: number, c: boolean) {}
// Error: A required parameter cannot follow an optional parameter
```

### 3.4. 可以有多个可选参数

```ts
// 允许有多个连续的可选参数，但必须位于结尾
function create(name: string, age?: number, email?: string, phone?: string) {
  return { name, age, email, phone }
}

create('Alice') // ✅
create('Bob', 25) // ✅
create('Charlie', 30, 'charlie@example.com') // ✅
```

### 3.5. 剩余参数可以与可选参数结合

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

## 4. 什么是默认参数？

默认参数使用 `= value` 赋值，当调用时不传递该参数时，使用默认值。

### 4.1. 基本语法

```ts
// 语法：参数名: 类型 = 默认值
function greet(name: string, greeting: string = 'Hello') {
  return `${greeting}, ${name}`
}

// 调用
greet('Alice') // ✅ 'Hello, Alice'
greet('Bob', 'Hi') // ✅ 'Hi, Bob'
```

### 4.2. 类型推断

```ts
// ✅ 类型可以从默认值推断
function createUser(name: string, age = 18) {
  // age 自动推断为 number
  return { name, age }
}

// ✅ 显式指定类型
function createUser(name: string, age: number = 18) {
  return { name, age }
}
```

### 4.3. 默认参数的位置

```ts
// 默认参数可以在任意位置
function good1(a: string, b: number = 0, c: boolean) {}
function good2(a: string = 'default', b: number, c: boolean) {}

// 调用时可以显式传递 undefined 来触发参数默认值
good1('hello', undefined, true) // b 使用默认值 0
good2(undefined, 42, true) // a 使用默认值 'default'
```

## 5. 可选参数 vs 默认参数

| 特性           | 可选参数            | 默认参数               |
| -------------- | ------------------- | ---------------------- |
| 语法           | `param?: Type`      | `param: Type = value`  |
| 值（未传参时） | `undefined`         | 指定的默认值 `value`   |
| 类型           | `Type \| undefined` | `Type`                 |
| 位置限制       | 必须在必需参数后    | 任意位置               |
| 调用           | 可省略              | 可省略或传 `undefined` |

## 6. 可选参数和 `| undefined` 联合类型的区别是？

从类型推断角度来看，两者是一样的：

```ts
// 可选参数自动包含 undefined
function process1(value?: number) {
  value // 类型：number | undefined
}

// 等价于
function process2(value: number | undefined) {
  value // 类型：number | undefined
}
```

从调用就高度来看，process2 不能省略参数。

```ts
function process1(value?: number) {
  value
}
process1() // ✅ 允许

function process2(value: number | undefined) {
  value
}
process2() // ❌ 错误
// Expected 1 arguments, but got 0.(2554)

process2(undefined) // ✅ 可以显式传入 undefined
```

## 7. 默认参数和可选参数的实践建议都有哪些？

```ts
// ✅ 1. 优先使用默认参数而不是可选参数
// Good: 有明确的默认值
function createUser(name: string, age: number = 18) {}

// Less good: 需要在函数内部处理 undefined
function createUser(name: string, age?: number) {
  const finalAge = age ?? 18
}

// ✅ 2. 可选参数放在最后
function good(required: string, optional?: number) {}

// ✅ 3. 使用解构提供默认值
function configure({
  host = 'localhost',
  port = 3000,
}: {
  host?: string
  port?: number
} = {}) {
  return { host, port }
}

// ✅ 4. 复杂对象使用 Partial
interface Config {
  host: string
  port: number
  ssl: boolean
}

function setup(config: Partial<Config> = {}) {
  const defaults: Config = {
    host: 'localhost',
    port: 3000,
    ssl: false,
  }
  return { ...defaults, ...config }
}

// ✅ 5. 布尔参数使用默认值
function toggle(enabled: boolean = false) {
  // 明确的默认行为
}
```

## 8. 引用

- [TypeScript Handbook - Functions][1]
- [TypeScript Handbook - Optional Parameters][2]
- [MDN - Default Parameters][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/functions.html
[2]: https://www.typescriptlang.org/docs/handbook/2/functions.html#optional-parameters
[3]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters
