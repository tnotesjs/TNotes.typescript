# [0241. alwaysStrict](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0241.%20alwaysStrict)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. alwaysStrict 是什么？](#3-alwaysstrict-是什么)
  - [3.1. 基本配置](#31-基本配置)
  - [3.2. 关闭时的行为](#32-关闭时的行为)
  - [3.3. 开启后的行为](#33-开启后的行为)
- [4. 为什么需要这个选项？](#4-为什么需要这个选项)
  - [4.1. 避免隐式全局变量](#41-避免隐式全局变量)
  - [4.2. 禁止八进制字面量](#42-禁止八进制字面量)
  - [4.3. 禁止删除变量](#43-禁止删除变量)
  - [4.4. 禁止重复参数](#44-禁止重复参数)
- [5. 它如何影响代码？](#5-它如何影响代码)
  - [5.1. 编译输出](#51-编译输出)
  - [5.2. 模块文件自动严格](#52-模块文件自动严格)
  - [5.3. this 绑定](#53-this-绑定)
  - [5.4. 只读属性](#54-只读属性)
  - [5.5. arguments 对象](#55-arguments-对象)
- [6. 使用时需要注意什么？](#6-使用时需要注意什么)
  - [6.1. 与 strict 选项的关系](#61-与-strict-选项的关系)
  - [6.2. 模块 vs. 脚本](#62-模块-vs-脚本)
  - [6.3. target 的影响](#63-target-的影响)
  - [6.4. 第三方库](#64-第三方库)
  - [6.5. 浏览器兼容性](#65-浏览器兼容性)
  - [6.6. 与 Babel 配合](#66-与-babel-配合)
  - [6.7. 全局代码](#67-全局代码)
  - [6.8. 开发建议](#68-开发建议)
  - [6.9. 性能影响](#69-性能影响)
- [7. 引用](#7-引用)

<!-- endregion:toc -->

## 1. 本节内容

- alwaysStrict 的作用
- 严格模式的好处
- 编译输出的影响
- 与其他选项的关系
- 实际应用场景

## 2. 评价

`alwaysStrict` 确保所有源文件以严格模式解析，并在输出中添加 `"use strict"`，是现代 JavaScript 开发的标准实践。

- 启用 JavaScript 严格模式
- 捕获更多潜在错误
- 是 strict 模式的组成部分
- 对模块文件自动生效
- 影响编译输出代码
- 建议始终启用

## 3. alwaysStrict 是什么？

`alwaysStrict` 确保所有 TypeScript 文件以 ECMAScript 严格模式解析，并在输出的 JavaScript 文件顶部添加 `"use strict"`。

### 3.1. 基本配置

```json
{
  "compilerOptions": {
    "alwaysStrict": true
  }
}
```

### 3.2. 关闭时的行为

```ts
// alwaysStrict: false
// 源文件：example.ts
function test() {
  x = 10 // ⚠️ 允许隐式全局变量
  return x
}

// 编译输出：example.js
function test() {
  x = 10 // ⚠️ 在非严格模式下运行
  return x
}
```

### 3.3. 开启后的行为

```ts
// alwaysStrict: true
// 源文件：example.ts
function test() {
  x = 10 // ❌ 错误：找不到名称 'x'
  return x
}

// 编译输出：example.js（非模块）
;('use strict')
function test() {
  x = 10 // 运行时错误：x is not defined
  return x
}
```

## 4. 为什么需要这个选项？

### 4.1. 避免隐式全局变量

```ts
// alwaysStrict: false
function calculate() {
  result = 100 // ⚠️ 创建全局变量
  return result
}

calculate()
console.log(result) // ⚠️ 100（全局变量）

// alwaysStrict: true
function calculate() {
  result = 100 // ❌ 编译错误
  return result
}

// ✅ 正确写法
function calculate() {
  const result = 100
  return result
}
```

### 4.2. 禁止八进制字面量

```ts
// alwaysStrict: false
const num = 0123 // ⚠️ 八进制：83
console.log(num) // 83

// alwaysStrict: true
const num = 0123 // ❌ 严格模式下不允许八进制
console.log(num)

// ✅ 正确写法
const num1 = 0o123 // ES6 八进制语法
const num2 = 83 // 十进制
```

### 4.3. 禁止删除变量

```ts
// alwaysStrict: false
let x = 10
delete x // ⚠️ 非严格模式下静默失败

// alwaysStrict: true
let x = 10
delete x // ❌ 严格模式下报错

// ✅ 只能删除对象属性
const obj = { x: 10 }
delete obj.x // ✅ 正确
```

### 4.4. 禁止重复参数

```ts
// alwaysStrict: false
function sum(a, a, c) {
  // ⚠️ 允许重复参数名
  return a + a + c // ⚠️ 使用最后一个 a
}

// alwaysStrict: true
function sum(a, a, c) {
  // ❌ 错误：重复参数名
  return a + a + c
}

// ✅ 正确写法
function sum(a, b, c) {
  return a + b + c
}
```

## 5. 它如何影响代码？

### 5.1. 编译输出

```ts
// 源文件：math.ts
export function add(a: number, b: number) {
  return a + b
}

// alwaysStrict: false
// 输出：math.js
Object.defineProperty(exports, '__esModule', { value: true })
exports.add = void 0
function add(a, b) {
  return a + b
}
exports.add = add

// alwaysStrict: true
// 输出：math.js
;('use strict') // ✅ 添加 "use strict"
Object.defineProperty(exports, '__esModule', { value: true })
exports.add = void 0
function add(a, b) {
  return a + b
}
exports.add = add
```

### 5.2. 模块文件自动严格

```ts
// ES 模块自动是严格模式
export function hello() {
  x = 10 // ❌ 错误（即使 alwaysStrict: false）
}

// 非模块文件需要 alwaysStrict
function hello() {
  x = 10 // ⚠️ 如果 alwaysStrict: false 则允许
}
```

### 5.3. this 绑定

```ts
// alwaysStrict: true
function showThis() {
  console.log(this) // 严格模式下 this 为 undefined
}

showThis() // undefined（严格模式）

// 非严格模式
function showThis() {
  console.log(this) // 非严格模式下 this 为全局对象
}

showThis() // window/global（非严格模式）
```

### 5.4. 只读属性

```ts
// alwaysStrict: true
const obj = {}
Object.defineProperty(obj, 'x', {
  value: 10,
  writable: false,
})

obj.x = 20 // ❌ 严格模式下抛出错误

// 非严格模式下静默失败
```

### 5.5. arguments 对象

```ts
// alwaysStrict: true
function test(a) {
  arguments[0] = 100
  console.log(a) // 10（严格模式下不同步）
}

test(10)

// 非严格模式下
function test(a) {
  arguments[0] = 100
  console.log(a) // 100（非严格模式下同步）
}

test(10)
```

## 6. 使用时需要注意什么？

### 6.1. 与 strict 选项的关系

```json
{
  "compilerOptions": {
    // strict: true 会自动启用 alwaysStrict
    "strict": true

    // 等同于
    "alwaysStrict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    // ...其他 strict 子选项
  }
}
```

### 6.2. 模块 vs. 脚本

```ts
// math.ts（模块文件，有 import/export）
export function add(a: number, b: number) {
  return a + b
}
// ✅ 自动严格模式，无需 "use strict"

// script.ts（脚本文件，无 import/export）
function add(a: number, b: number) {
  return a + b
}
// ⚠️ 需要 alwaysStrict 或手动添加 "use strict"
```

### 6.3. target 的影响

```json
{
  "compilerOptions": {
    "target": "ES2015", // 或更高版本
    "module": "ES2015",
    "alwaysStrict": true
  }
}
```

```ts
// 源码
function test() {
  return 42
}

// target: ES2015, module: ES2015, alwaysStrict: true
// 输出：模块格式，不需要显式 "use strict"
export function test() {
  return 42
}

// target: ES5, module: CommonJS, alwaysStrict: true
// 输出：需要显式 "use strict"
;('use strict')
Object.defineProperty(exports, '__esModule', { value: true })
function test() {
  return 42
}
```

### 6.4. 第三方库

```ts
// ✅ 使用严格模式兼容的库
import _ from 'lodash' // lodash 支持严格模式

// ⚠️ 注意旧库可能不兼容严格模式
import oldLib from 'old-library' // 可能依赖非严格模式行为
```

### 6.5. 浏览器兼容性

```ts
// alwaysStrict: true 输出
'use strict'
// 所有现代浏览器都支持严格模式
// IE 10+ 完全支持

// ✅ 安全使用
```

### 6.6. 与 Babel 配合

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "alwaysStrict": true
  }
}

// babel.config.js
{
  "presets": [
    ["@babel/preset-env", {
      // Babel 会保留 "use strict"
      "modules": "commonjs"
    }]
  ]
}
```

### 6.7. 全局代码

```ts
// 脚本文件（不是模块）
// alwaysStrict: true

// ❌ 错误：严格模式下不允许
with (Math) {
  console.log(sqrt(16))
}

// ✅ 正确
console.log(Math.sqrt(16))
```

### 6.8. 开发建议

```json
{
  "compilerOptions": {
    // ✅ 推荐配置
    "strict": true, // 包含 alwaysStrict
    "target": "ES2015",
    "module": "ESNext",

    // 或单独启用
    "alwaysStrict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### 6.9. 性能影响

```ts
// alwaysStrict 对性能影响微乎其微
// 主要影响编译时检查和运行时行为

// ✅ 好处远大于微小的性能开销
// - 捕获更多错误
// - 代码更可靠
// - 便于优化
```

## 7. 引用

- [TypeScript alwaysStrict][1]
- [ECMAScript Strict Mode][2]
- [MDN Strict Mode][3]

[1]: https://www.typescriptlang.org/tsconfig#alwaysStrict
[2]: https://tc39.es/ecma262/#sec-strict-mode-code
[3]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
