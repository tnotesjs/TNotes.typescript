# [0234. target 和 lib](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0234.%20target%20%E5%92%8C%20lib)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 target 选项是什么？](#3--target-选项是什么)
  - [3.1. 基本使用](#31-基本使用)
  - [3.2. 可选值](#32-可选值)
  - [3.3. 编译示例](#33-编译示例)
  - [3.4. 降级转换示例](#34-降级转换示例)
  - [3.5. target 影响的特性](#35-target-影响的特性)
- [4. 🤔 lib 选项是什么？](#4--lib-选项是什么)
  - [4.1. 基本使用](#41-基本使用)
  - [4.2. 常用 lib 值](#42-常用-lib-值)
  - [4.3. lib 提供的类型](#43-lib-提供的类型)
  - [4.4. 不同 lib 的影响](#44-不同-lib-的影响)
  - [4.5. 默认 lib](#45-默认-lib)
- [5. 🆚 target vs. lib](#5--target-vs-lib)
  - [5.1. 关系说明](#51-关系说明)
  - [5.2. 独立配置的原因](#52-独立配置的原因)
- [6. 🤔 如何选择合适的配置？](#6--如何选择合适的配置)
  - [6.1. 现代浏览器项目](#61-现代浏览器项目)
  - [6.2. 兼容老浏览器项目](#62-兼容老浏览器项目)
  - [6.3. Node.js 项目](#63-nodejs-项目)
  - [6.4. React 项目](#64-react-项目)
  - [6.5. 库项目](#65-库项目)
  - [6.6. 使用打包工具的项目](#66-使用打包工具的项目)
- [7. � 使用时需要注意什么？](#7--使用时需要注意什么)
  - [7.1. target 不提供 Polyfill](#71-target-不提供-polyfill)
  - [7.2. lib 不影响运行时](#72-lib-不影响运行时)
  - [7.3. 检查目标环境支持](#73-检查目标环境支持)
  - [7.4. 使用 Polyfill](#74-使用-polyfill)
  - [7.5. target 影响输出体积](#75-target-影响输出体积)
  - [7.6. lib 的依赖关系](#76-lib-的依赖关系)
  - [7.7. 使用 Browserslist](#77-使用-browserslist)
  - [7.8. 类型定义的来源](#78-类型定义的来源)
  - [7.9. Module 和 Target 的配合](#79-module-和-target-的配合)
  - [7.10. downlevelIteration 选项](#710-downleveliteration-选项)
  - [7.11. importHelpers 减小体积](#711-importhelpers-减小体积)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- target 编译目标版本
- lib 类型定义库
- target 的可选值和对应特性
- lib 的常用组合
- target 和 lib 的关系
- 不同运行环境的配置策略
- 降级编译的影响

## 2. 🫧 评价

`target` 和 `lib` 是 TypeScript 配置中最基础也最重要的两个选项，直接决定了代码的编译目标和可用的 API。

- target 控制输出代码的 JavaScript 版本
- lib 控制代码中可以使用的 JavaScript API
- 两者配合使用才能达到最佳效果
- 选择错误会导致运行时错误或编译失败
- 根据目标运行环境合理配置非常重要
- 现代项目通常选择较新的 target 以减少降级代码

## 3. 🤔 target 选项是什么？

`target` 指定 TypeScript 编译后的 JavaScript 版本，控制代码降级和转换。

### 3.1. 基本使用

```json
{
  "compilerOptions": {
    "target": "ES2020"
  }
}
```

### 3.2. 可选值

```json
{
  "compilerOptions": {
    // ECMAScript 标准版本
    "target": "ES3"      // 1999年，非常老旧
    "target": "ES5"      // 2009年，IE9+ 支持
    "target": "ES6"      // 等同于 ES2015
    "target": "ES2015"   // 2015年，箭头函数、类等
    "target": "ES2016"   // 2016年，includes、指数运算符
    "target": "ES2017"   // 2017年，async/await
    "target": "ES2018"   // 2018年，rest/spread、异步迭代
    "target": "ES2019"   // 2019年，Array.flat、Object.fromEntries
    "target": "ES2020"   // 2020年，可选链、空值合并
    "target": "ES2021"   // 2021年，逻辑赋值运算符
    "target": "ES2022"   // 2022年，类字段、顶层 await
    "target": "ESNext"   // 最新草案特性
  }
}
```

### 3.3. 编译示例

```typescript
// 源代码
const greet = (name: string) => {
  console.log(`Hello, ${name}`)
}

class Person {
  constructor(public name: string) {}
}
```

```javascript
// target: "ES2015" 输出
const greet = (name) => {
  console.log(`Hello, ${name}`)
}

class Person {
  constructor(name) {
    this.name = name
  }
}
```

```javascript
// target: "ES5" 输出
var greet = function (name) {
  console.log('Hello, ' + name)
}

var Person = /** @class */ (function () {
  function Person(name) {
    this.name = name
  }
  return Person
})()
```

### 3.4. 降级转换示例

```typescript
// 可选链（ES2020）
const value = obj?.property?.nested

// target: "ES2020" 保持原样
const value = obj?.property?.nested

// target: "ES2019" 降级
const value =
  obj === null || obj === void 0
    ? void 0
    : (_a = obj.property) === null || _a === void 0
    ? void 0
    : _a.nested
```

```typescript
// async/await（ES2017）
async function fetchData() {
  const response = await fetch('/api')
  return response.json()
}

// target: "ES2017" 保持原样
async function fetchData() {
  const response = await fetch('/api')
  return response.json()
}

// target: "ES5" 使用生成器降级
function fetchData() {
  return __awaiter(this, void 0, void 0, function* () {
    const response = yield fetch('/api')
    return response.json()
  })
}
```

### 3.5. target 影响的特性

```typescript
// ES2015+ 特性
const arrow = () => {} // 箭头函数
class MyClass {} // 类
let x = 1
const y = 2 // let/const
const [a, b] = [1, 2] // 解构
const obj = { x, y } // 简写属性
for (const item of arr) {
} // for-of

// ES2017+ 特性
async function fn() {} // async/await
obj.hasOwnProperty('key') // Object 方法

// ES2020+ 特性
const val = obj?.prop // 可选链
const val2 = value ?? 'default' // 空值合并
const big = 100n // BigInt

// ES2022+ 特性
class C {
  #private = 1 // 私有字段
}
```

## 4. 🤔 lib 选项是什么？

`lib` 指定编译时包含的类型定义库，控制可以使用的 JavaScript API。

### 4.1. 基本使用

```json
{
  "compilerOptions": {
    "lib": ["ES2020", "DOM"]
  }
}
```

### 4.2. 常用 lib 值

```json
{
  "compilerOptions": {
    "lib": [
      // ECMAScript 标准库
      "ES5", // ES5 API
      "ES6", // 等同于 ES2015
      "ES2015", // ES2015 API
      "ES2016", // Array.includes 等
      "ES2017", // Object.values/entries 等
      "ES2018", // Promise.finally 等
      "ES2019", // Array.flat/flatMap 等
      "ES2020", // Promise.allSettled、String.matchAll 等
      "ES2021", // String.replaceAll 等
      "ES2022", // Array.at、Object.hasOwn 等
      "ESNext", // 最新提案 API

      // DOM 相关
      "DOM", // document、window、HTMLElement 等
      "DOM.Iterable", // NodeList、HTMLCollection 迭代器

      // Web Workers
      "WebWorker", // Worker API
      "WebWorker.ImportScripts",

      // Script Host
      "ScriptHost" // WSH API
    ]
  }
}
```

### 4.3. lib 提供的类型

```typescript
// lib: ["ES2019"]
const arr = [1, [2, [3, 4]]]
const flat = arr.flat(2) // ✅ Array.flat 可用
const entries = Object.entries({}) // ✅ Object.entries 可用

// lib: ["DOM"]
const div = document.createElement('div') // ✅ document 可用
const width = window.innerWidth // ✅ window 可用
div.addEventListener('click', () => {}) // ✅ DOM 事件可用
```

### 4.4. 不同 lib 的影响

```typescript
// 没有 "DOM" 时
document.getElementById('app') // ❌ 错误：找不到名称 document

// 有 "DOM" 时
document.getElementById('app') // ✅ 正常

// 没有 "ES2019" 时
;[1, [2, 3]].flat() // ❌ 错误：类型 number[][] 上不存在属性 flat

// 有 "ES2019" 时
;[1, [2, 3]].flat() // ✅ 正常
```

### 4.5. 默认 lib

```json
// 如果不指定 lib，根据 target 自动选择

// target: "ES5"
// 默认 lib: ["DOM", "ES5", "ScriptHost"]

// target: "ES6"/ES2015
// 默认 lib: ["DOM", "ES6", "DOM.Iterable", "ScriptHost"]

// target: "ES2020"
// 默认 lib: ["DOM", "ES2020", "DOM.Iterable", "ScriptHost"]
```

## 5. 🆚 target vs. lib

| 对比项 | target | lib |
| --- | --- | --- |
| 作用 | 控制输出代码的 JavaScript 版本 | 控制可以使用的 JavaScript API |
| 影响编译 | 影响语法转换和降级 | 不影响编译输出 |
| 影响类型检查 | 不直接影响类型检查 | 提供类型定义 |
| 默认值 | ES3/ES5 | 根据 target 自动推断 |
| 运行时 | 影响运行时代码 | 不影响运行时（仅类型） |
| Polyfill | 不提供 Polyfill | 不提供 Polyfill |

### 5.1. 关系说明

```typescript
// target: 控制语法如何编译
// 源码
const fn = async () => {
  const result = await getData()
  return result?.value ?? 0
}

// target: "ES2020" - 保持现代语法
const fn = async () => {
  const result = await getData()
  return result?.value ?? 0
}

// target: "ES5" - 降级所有语法
var fn = function () {
  return __awaiter(this, void 0, void 0, function* () {
    var _a, _b
    const result = yield getData()
    return (_b =
      (_a = result) === null || _a === void 0 ? void 0 : _a.value) !== null &&
      _b !== void 0
      ? _b
      : 0
  })
}
```

```typescript
// lib: 控制可以使用哪些 API（编译时检查）

// lib: ["ES2019"]
const flat = [1, [2, 3]].flat() // ✅ 类型检查通过

// lib: ["ES2015"]
const flat = [1, [2, 3]].flat() // ❌ 错误：ES2015 没有 flat

// 但编译输出相同，运行时需要环境支持
```

### 5.2. 独立配置的原因

```json
{
  "compilerOptions": {
    // 场景1：使用 Polyfill
    "target": "ES5", // 降级到 ES5
    "lib": ["ES2020"] // 但可以使用 ES2020 API
    // 需要配合 core-js 等 Polyfill 库
  }
}
```

```json
{
  "compilerOptions": {
    // 场景2：Node.js 环境
    "target": "ES2020", // 输出 ES2020 代码
    "lib": ["ES2020"] // 不包含 DOM
    // Node.js 不需要 DOM API
  }
}
```

## 6. 🤔 如何选择合适的配置？

### 6.1. 现代浏览器项目

```json
{
  "compilerOptions": {
    "target": "ES2020", // 现代浏览器支持
    "lib": ["ES2020", "DOM", "DOM.Iterable"]
  }
}
```

```typescript
// ✅ 可以使用现代特性
const value = obj?.prop ?? 'default'
const promise = Promise.allSettled([])
document.querySelectorAll('div').forEach((el) => {})
```

### 6.2. 兼容老浏览器项目

```json
{
  "compilerOptions": {
    "target": "ES5", // 兼容 IE11
    "lib": ["ES2015", "DOM"]
  }
}
```

```typescript
// TypeScript 会降级语法
const fn = () => {} // 编译为 function

// 使用 Polyfill 提供 API 支持
import 'core-js/stable'
import 'regenerator-runtime/runtime'
```

### 6.3. Node.js 项目

```json
{
  "compilerOptions": {
    "target": "ES2020", // Node.js 14+ 支持
    "lib": ["ES2020"] // 不需要 DOM
    // 或者完全不指定 lib，使用默认值
  }
}
```

```typescript
// ✅ 可以使用 Node.js API（通过 @types/node）
import * as fs from 'fs'
import * as path from 'path'

// ❌ 不能使用 DOM API
// document.getElementById('app');  // 错误
```

### 6.4. React 项目

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx" // React 17+ JSX 转换
  }
}
```

### 6.5. 库项目

```json
{
  "compilerOptions": {
    "target": "ES2015", // 更好的兼容性
    "lib": ["ES2015"], // 最小化 API 依赖
    "declaration": true // 生成类型声明
  }
}
```

### 6.6. 使用打包工具的项目

```json
{
  "compilerOptions": {
    "target": "ESNext", // 让打包工具处理降级
    "lib": ["ESNext", "DOM"],
    "module": "ESNext"
  }
}
```

Webpack/Vite 等打包工具会使用 Babel/SWC 进行最终的降级处理。

## 7. � 使用时需要注意什么？

### 7.1. target 不提供 Polyfill

```typescript
// target: "ES5"
const promise = Promise.resolve(1) // ✅ 编译通过

// ❌ 运行时错误：ES5 环境没有 Promise
// 需要手动引入 Polyfill
import 'core-js/es/promise'
```

### 7.2. lib 不影响运行时

```typescript
// lib: ["ES2020"]
const result = [1, [2, 3]].flat() // ✅ 编译通过

// target: "ES5"
// 编译为 ES5 代码，但不会添加 flat 的实现
// 如果运行环境不支持 flat，会报错
```

### 7.3. 检查目标环境支持

```json
{
  "compilerOptions": {
    // ⚠️ 不匹配的配置
    "target": "ES5",
    "lib": ["ES2020"]
    // 可能会使用运行环境不支持的 API
  }
}
```

```typescript
// 编译通过，但运行时可能出错
const result = str.matchAll(/pattern/g) // ES2020 API
```

### 7.4. 使用 Polyfill

```typescript
// 安装 core-js
// npm install core-js

// 在入口文件引入
import 'core-js/stable'
import 'regenerator-runtime/runtime'

// 或按需引入
import 'core-js/es/promise'
import 'core-js/es/array/flat'
```

### 7.5. target 影响输出体积

```typescript
// 源代码
const fn = async () => {
  const [a, b] = await getData()
  return a?.value ?? b
}

// target: "ES2020" - 输出简洁
// 约 50 字节

// target: "ES5" - 输出冗长
// 约 200+ 字节（包含辅助函数）
```

### 7.6. lib 的依赖关系

```json
{
  "compilerOptions": {
    // ❌ 不完整
    "lib": ["ES2020"] // 缺少 DOM
  }
}
```

```typescript
// ❌ 错误：找不到名称 document
document.getElementById('app')
```

```json
{
  "compilerOptions": {
    // ✅ 完整
    "lib": ["ES2020", "DOM", "DOM.Iterable"]
  }
}
```

### 7.7. 使用 Browserslist

```json
// package.json
{
  "browserslist": ["> 0.5%", "last 2 versions", "not dead"]
}
```

让打包工具根据 Browserslist 自动处理兼容性，TypeScript 使用较新的 target。

### 7.8. 类型定义的来源

```typescript
// lib 提供标准 API 类型
const arr: Array<number> = [] // lib: ES2015+

// @types 包提供第三方类型
import * as fs from 'fs' // @types/node

// 自定义类型
interface User {
  name: string
}
```

### 7.9. Module 和 Target 的配合

```json
{
  "compilerOptions": {
    // Node.js 环境
    "target": "ES2020",
    "module": "commonjs", // Node.js 使用 CommonJS
    "lib": ["ES2020"]
  }
}
```

```json
{
  "compilerOptions": {
    // 现代浏览器
    "target": "ES2020",
    "module": "es2020", // 使用 ES 模块
    "lib": ["ES2020", "DOM"]
  }
}
```

### 7.10. downlevelIteration 选项

```typescript
// 使用迭代器
for (const char of 'hello') {
  console.log(char)
}

const arr = [...new Set([1, 2, 3])]
```

```json
{
  "compilerOptions": {
    "target": "ES5",
    "downlevelIteration": true // ✅ 生成 ES5 兼容的迭代代码
  }
}
```

### 7.11. importHelpers 减小体积

```json
{
  "compilerOptions": {
    "target": "ES5",
    "importHelpers": true // 从 tslib 导入辅助函数
  }
}
```

```bash
npm install tslib
```

```typescript
// 多个文件共享辅助函数，减小总体积
```

## 8. 🔗 引用

- [TypeScript target 配置][1]
- [TypeScript lib 配置][2]
- [TypeScript Compiler Options][3]

[1]: https://www.typescriptlang.org/tsconfig#target
[2]: https://www.typescriptlang.org/tsconfig#lib
[3]: https://www.typescriptlang.org/docs/handbook/compiler-options.html
