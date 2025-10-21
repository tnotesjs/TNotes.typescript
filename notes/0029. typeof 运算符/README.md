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
- [9. 🤔 使用 `typeof` 来检查引用类型会存在什么问题？](#9--使用-typeof-来检查引用类型会存在什么问题)
- [10. 🤔 可以使用 `typeof` 来获取表达式的类型吗？](#10--可以使用-typeof-来获取表达式的类型吗)
- [11. 🤔 可以使用 `typeof` 来获取类型的类型吗？](#11--可以使用-typeof-来获取类型的类型吗)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 回顾 JS 中的 typeof 运算符
- 学习 TS 中对 typeof 运算符的增强
- typeof vs. instanceof

## 2. 🫧 评价

- 内容概述：
  - 先是对 JS 中的 `typeof` 运算做了简单的回顾，TS 是 JS 的超集，因此 TS 中的 `typeof` 自然也具备这些特性。
  - 后对 TS 中的 `typeof` 特有的功能做了介绍。「这部分是 TS 特有的，也是学习的重点」
- Type Narrowing 类型收窄
  - 原始类型 - 用 typeof 检测
  - 实例（引用）类型 - 用 instanceof 检测

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
4. `as const` + `typeof` 替代手动写字面量联合类型
   - 先使用 `as const` 保留字面量类型信息，以防泛化；
   - 再使用 typeof 提取字面量类型信息

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
const directions_1 = ['north', 'south']
// 类型：string[]

type Direction_1 = (typeof directions_1)[number]
// type Direction_1 = string

// 使用 as const + typeof 保留字面量：
const directions_2 = ['north', 'south'] as const
// 类型：readonly ["north", "south"]

type Direction = (typeof directions_2)[number]
// type Direction = "north" | "south"

// 状态提取
const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
} as const

type Status = (typeof STATUS)[keyof typeof STATUS] // "idle" | "loading" | "success"

// API 路径提取
const apiEndpoints = {
  users: '/api/users',
  posts: '/api/posts',
} as const

type EndpointKeys = keyof typeof apiEndpoints // "users" | "posts"
type EndpointPaths = (typeof apiEndpoints)[EndpointKeys] // "/api/users" | "/api/posts"

// ……
```

:::

`typeof` 也可以用来做类型守卫、类型收窄。

```ts
function process(input: string | number) {
  if (typeof input === 'string') {
    // TypeScript 自动收窄类型
    return input.toUpperCase()
  }
  return input.toFixed(2)
}
// 不过这里的 typeof 并非 TS 中的 typeof 运算符，在编译后会保留在结果 JS 中。
```

## 8. 🆚 `typeof` vs. `instanceof`

| 运算符 | 用途 | 适用场景 |
| --- | --- | --- |
| `typeof` | 检测原始类型和函数 | `string`、`number`、`boolean`、`function` |
| `instanceof` | 检测对象是否为某构造函数的实例 | `Array`、`Date`、自定义类 |

在 TypeScript 类型守卫中的应用：

- 用 `typeof` 收窄原始类型
- 用 `instanceof` 收窄类实例

```ts
// typeof 收窄原始类型
function printId(id: string | number) {
  if (typeof id === 'string') {
    // 在这个分支中，id 被收窄为 string
    console.log(id.toUpperCase()) // ✅ 安全
  } else {
    // 在这个分支中，id 被收窄为 number
    console.log(id.toFixed(2)) // ✅ 安全
  }
}

// instanceof 收窄类实例
const arr = [1, 2, 3]

console.log(typeof arr) // "object" ❌ 无法识别数组
console.log(arr instanceof Array) // true ✅

class User {}
const user = new User()
console.log(user instanceof User) // true
console.log(typeof user) // "object"
```

## 9. 🤔 使用 `typeof` 来检查引用类型会存在什么问题？

问题：会检测不准，太宽泛了。

::: code-group

```ts [1]
// 用 typeof 检测数组
// ❌ 错误
if (typeof arr === "object") { ... } // 太宽泛，可能是任何对象

// ✅ 正确
if (Array.isArray(arr)) { ... }
// 或
if (arr instanceof Array) { ... }
```

```ts [2]
// 特殊的 null
const getVal = () => {
  return Math.random() > 0.5 ? [1, 2, 3] : null
}
// 推断结果：
// const getVal: () => number[] | null

const arr = getVal()
// 推断结果：
// const arr: number[] | null

// ❌ 错误 - 未排除 null
// if (typeof arr === 'object') {
//   console.log(arr.length)
//   // 'arr' is possibly 'null'.(18047)
// }

// ✅ 正确 - 排除 null
if (arr !== null && typeof arr === 'object') {
  console.log(arr.length)
}
```

:::

## 10. 🤔 可以使用 `typeof` 来获取表达式的类型吗？

```ts
type T = typeof 1 + 1 // 报错
type T = typeof Date() // 报错
// ……
```

由于编译时不会进行 JavaScript 的值运算，所以 TypeScript 规定，`typeof` 的参数只能是标识符，不能是需要运算的表达式。

## 11. 🤔 可以使用 `typeof` 来获取类型的类型吗？

先说结轮：基本上都不行，可以直接暴力认为就是“TS 禁止 🚫 使用 `typeof` 来获取类型的类型”

---

判断规律：

- 如果类型 `xxx` 在 TS 中只能作为类型使用，那么不行；🚫
- 如果类型 `xxx` 在 TS 中能够同时作为类型和值使用，那么 OK；✅
  - 特例 `null` 除外

---

TS 中的类型包括很多，比如：`number`、`string`、`boolean`、`bigint`、`symbol`、`null`、`undefined`、`type`、`interface`、`class` …… 其中像是 `null`、`undefined`、`class` 这些就必要特殊，它们在 TS 中可以是类型，也可以是值。

按前面的结论，可以推断出 `null`、`undefined`、`class` 是可以使用 `typeof` 获取类型的，但是这里边儿 `null` 就比较特殊（不愧是 JS 的历史 bug 类型），它不能用 `typeof` 获取类型。

```ts
type MyNumber = typeof number // ❌
// 'number' only refers to a type, but is being used as a value here.(2693)

type MyString = typeof string // ❌
// 'string' only refers to a type, but is being used as a value here.(2693)

type MyBoolean = typeof boolean // ❌
// 'boolean' only refers to a type, but is being used as a value here.(2693)

type MyBigint = typeof bigint // ❌
// 'Cannot find name 'bigint'.(2304)

type MySymbol = typeof symbol // ❌
// Cannot find name 'symbol'. Did you mean 'Symbol'?(2552)

type myNull = typeof null // ❌
// Cannot find name 'null'.(2304)

type MyUndefined = typeof undefined // ✅

type Age = number
type MyAge = typeof Age // ❌
// 'Age' only refers to a type, but is being used as a value here.(2693)

interface User_1 {}
type MyUser_1 = typeof User_1 // ❌
// 'User_1' only refers to a type, but is being used as a value here.(2693)

class User_2 {}
type MyUser_2 = typeof User_2 // ✅
```

报错类型还各不相同……

![图 0](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-21-22-21-44.png)
