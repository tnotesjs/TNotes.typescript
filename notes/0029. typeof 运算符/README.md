# [0029. typeof 运算符](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0029.%20typeof%20%E8%BF%90%E7%AE%97%E7%AC%A6)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 JavaScript 中的 `typeof` 是什么？【回顾 JS】](#3--javascript-中的-typeof-是什么回顾-js)
- [4. 🤔 JavaScript 中 `typeof null` 为什么会返回 "object"？【回顾 JS】](#4--javascript-中-typeof-null-为什么会返回-object回顾-js)
- [5. 🤔 JavaScript 中 `typeof` 的实际用途有哪些？【回顾 JS】](#5--javascript-中-typeof-的实际用途有哪些回顾-js)
- [6. 🤔 TypeScript 中的 `typeof` 与 JavaScript 有什么不同？](#6--typescript-中的-typeof-与-javascript-有什么不同)
- [7. 🤔 TypeScript 中 `typeof` 有哪些典型用法？](#7--typescript-中-typeof-有哪些典型用法)
- [8. 🆚 `typeof` vs. `instanceof`](#8--typeof-vs-instanceof)
- [9. 🤔 使用 `typeof` 有哪些常见误区？](#9--使用-typeof-有哪些常见误区)
  - [9.1. 误区 1：用 `typeof` 检测数组](#91-误区-1用-typeof-检测数组)
  - [9.2. 误区 2：依赖 `typeof null === "object"`](#92-误区-2依赖-typeof-null--object)
- [10. 🤔 使用 `typeof` 有哪些最佳实践？](#10--使用-typeof-有哪些最佳实践)
  - [10.1. 最佳实践 1：在 TypeScript 中优先使用类型守卫](#101-最佳实践-1在-typescript-中优先使用类型守卫)
  - [10.2. 最佳实践 2：用 `typeof` + `as const` 替代手动写字面量联合类型](#102-最佳实践-2用-typeof--as-const-替代手动写字面量联合类型)
- [11. 🤔 `typeof` 有哪些高级技巧？](#11--typeof-有哪些高级技巧)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- JS 中的 typeof 运算符
- TS 中对 typeof 运算符的增强
- typeof vs. instanceof

## 2. 🫧 评价

- 内容概述：
  - 先是对 JS 中的 `typeof` 运算做了简单的回顾，TS 是 JS 的超集，因此 TS 中的 `typeof` 自然也具备这些特性。
  - 后对 TS 中的 `typeof` 特有的功能做了介绍。「这部分是 TS 特有的，也是学习的重点」

## 3. 🤔 JavaScript 中的 `typeof` 是什么？【回顾 JS】

JavaScript 中的 `typeof` 是一个内置运算符，用于在运行时检测一个值的原始类型（primitive type）。

基本语法：

```js
typeof value
```

返回值都是字符串类型：

| 操作数 | `typeof` 结果 | 说明 |
| --- | --- | --- |
| `undefined` | `"undefined"` | 未定义 |
| `null` | `"object"` | 历史 bug！（ECMAScript 规范保留） |
| `true` / `false` | `"boolean"` | 布尔值 |
| `42`, `3.14` | `"number"` | 数字 |
| `100n` | `"bigint"` | BigInt（ES2020+） |
| `"hello"` | `"string"` | 字符串 |
| `Symbol()` | `"symbol"` | Symbol（ES6+） |
| 函数 | `"function"` | 函数对象（特殊） |
| 其他对象（包括数组、日期等） | `"object"` | 所有非函数对象 |

## 4. 🤔 JavaScript 中 `typeof null` 为什么会返回 "object"？【回顾 JS】

```js
console.log(typeof null) // "object"
```

这是 JavaScript 最著名的 bug 之一。`typeof null` 返回 "object" 是历史原因造成的：早期 JavaScript 实现中，值的类型信息存储在低位，`null` 的机器码全为 0，被误判为对象。

安全检查 `null` 的方式：

```js
// 排除 null
if (value === null) { ... }

// 同时排除 null 和 undefined
if (value == null) { ... } // 因为 null == undefined 为 true
```

## 5. 🤔 JavaScript 中 `typeof` 的实际用途有哪些？【回顾 JS】

检查变量是否已声明（避免 ReferenceError）：

```js
if (typeof myVar !== "undefined") { ... }
```

判断参数类型：

```js
function add(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Both arguments must be numbers')
  }
  return a + b
}
```

## 6. 🤔 TypeScript 中的 `typeof` 与 JavaScript 有什么不同？

TypeScript 扩展了 `typeof` 的能力，使其不仅能在运行时使用，还能在类型层面获取值的类型。

- 运行时 `typeof`（与 JavaScript 完全一致），TypeScript 编译后的 JavaScript 保留了 `typeof` 的原始行为。

```ts
function logType(value: unknown) {
  console.log(typeof value) // 编译后仍是 JS 的 typeof
}
```

- 类型查询（Type Queries）—— TypeScript 特有！

```ts
// 可以在类型上下文中使用 typeof 获取一个值的静态类型。
let myVar = 'hello'

// 语法如下：
type MyType = typeof myVar // MyType === string
```

## 7. 🤔 TypeScript 中 `typeof` 有哪些典型用法？

1. 从变量推导类型
2. 从函数推导函数类型
3. 从模块/命名空间推导类型
4. 与 `as const` 结合保留字面量类型信息，以防泛化

::: code-group

```ts [1]
// 从变量推导类型
const config_1 = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  debug: true,
}

// 查询 config_1 的类型
type ConfigType_1 = typeof config_1
// 等价于：
// type ConfigType = {
//     apiUrl: string;
//     timeout: number;
//     debug: boolean;
// }

// 使用 as const 断言，获取更精确的类型推断。

const config_2 = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  debug: true,
} as const

// 查询 config_2 的类型
type ConfigType_2 = typeof config_2
// 等价于：
// type ConfigType_2 = {
//     readonly apiUrl: "https://api.example.com";
//     readonly timeout: 5000;
//     readonly debug: true;
// }
```

```ts [2]
// 从函数推导函数类型
function greet(name: string): string {
  return `Hello, ${name}`
}

type GreetFn = typeof greet
// 等价于 (name: string) => string

const anotherGreet: GreetFn = (n) => `Hi, ${n}`
```

```ts [3]
// 从模块/命名空间推导类型
// math.ts
export const PI = 3.14159
export function add(a: number, b: number) {
  return a + b
}

// main.ts
import * as math from './math'
type MathLib = typeof math
// 等价于 { PI: 3.14159; add: (a: number, b: number) => number; }
```

```ts [4]
// 默认情况下，TypeScript 会将对象属性推断为宽泛类型：
const directions = ['north', 'south']
// 类型：string[]

// 使用 as const + typeof 保留字面量：
const directions = ['north', 'south'] as const
// 类型：readonly ["north", "south"]

type Direction = (typeof directions)[number]
// "north" | "south"
```

:::

## 8. 🆚 `typeof` vs. `instanceof`

| 运算符 | 用途 | 适用场景 |
| --- | --- | --- |
| `typeof` | 检测原始类型和函数 | `string`, `number`, `boolean`, `function` |
| `instanceof` | 检测对象是否为某构造函数的实例 | `Array`, `Date`, 自定义类 |

示例：

```ts
const arr = [1, 2, 3]

console.log(typeof arr) // "object" ❌ 无法识别数组
console.log(arr instanceof Array) // true ✅

class User {}
const user = new User()
console.log(user instanceof User) // true
console.log(typeof user) // "object"
```

在 TypeScript 类型守卫中：

- 用 `typeof` 收窄原始类型
- 用 `instanceof` 收窄类实例

## 9. 🤔 使用 `typeof` 有哪些常见误区？

### 9.1. 误区 1：用 `typeof` 检测数组

```ts
// 错误！
if (typeof arr === "object") { ... } // 太宽泛，可能是任何对象

// 正确！
if (Array.isArray(arr)) { ... }
// 或
if (arr instanceof Array) { ... }
```

### 9.2. 误区 2：依赖 `typeof null === "object"`

```ts
// 危险！
if (typeof value === "object") {
  // value 可能是 null！
  console.log(value.length); // TypeError!
}

// 安全做法：
if (value !== null && typeof value === "object") { ... }
```

## 10. 🤔 使用 `typeof` 有哪些最佳实践？

### 10.1. 最佳实践 1：在 TypeScript 中优先使用类型守卫

```ts
function process(input: string | number) {
  if (typeof input === 'string') {
    // TypeScript 自动收窄类型
    return input.toUpperCase()
  }
  return input.toFixed(2)
}
```

### 10.2. 最佳实践 2：用 `typeof` + `as const` 替代手动写字面量联合类型

```ts
// 不用手动维护类型
const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
} as const

type Status = (typeof STATUS)[keyof typeof STATUS] // "idle" | "loading" | "success"
```

## 11. 🤔 `typeof` 有哪些高级技巧？

与映射类型结合：

```ts
// 动态生成属性类型
const apiEndpoints = {
  users: '/api/users',
  posts: '/api/posts',
} as const

type EndpointKeys = keyof typeof apiEndpoints // "users" | "posts"
type EndpointPaths = (typeof apiEndpoints)[EndpointKeys] // "/api/users" | "/api/posts"
```
