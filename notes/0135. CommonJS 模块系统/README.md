# [0135. CommonJS 模块系统](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0135.%20CommonJS%20%E6%A8%A1%E5%9D%97%E7%B3%BB%E7%BB%9F)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 什么是 CommonJS？](#3-什么是-commonjs)
  - [3.1. 基本概念](#31-基本概念)
  - [3.2. 模块特性](#32-模块特性)
  - [3.3. 模块对象](#33-模块对象)
- [4. 如何使用 require 导入模块？](#4-如何使用-require-导入模块)
  - [4.1. 基本导入](#41-基本导入)
  - [4.2. 解构导入](#42-解构导入)
  - [4.3. 动态导入](#43-动态导入)
  - [4.4. 模块解析](#44-模块解析)
- [5. 如何使用 exports 导出模块？](#5-如何使用-exports-导出模块)
  - [5.1. 使用 exports](#51-使用-exports)
  - [5.2. 使用 module.exports](#52-使用-moduleexports)
  - [5.3. 混合导出](#53-混合导出)
- [6. module.exports 和 exports 有什么区别？](#6-moduleexports-和-exports-有什么区别)
  - [6.1. 核心区别](#61-核心区别)
  - [6.2. 常见错误](#62-常见错误)
  - [6.3. 使用建议](#63-使用建议)
- [7. CommonJS 和 ES 模块有什么区别？](#7-commonjs-和-es-模块有什么区别)
  - [7.1. 语法差异](#71-语法差异)
  - [7.2. 加载差异](#72-加载差异)
  - [7.3. 值差异](#73-值差异)
  - [7.4. this 差异](#74-this-差异)
  - [7.5. 对比总结](#75-对比总结)
- [8. 如何在 TypeScript 中使用 CommonJS？](#8-如何在-typescript-中使用-commonjs)
  - [8.1. TypeScript 配置](#81-typescript-配置)
  - [8.2. 类型定义](#82-类型定义)
  - [8.3. 互操作](#83-互操作)
  - [8.4. 编译输出](#84-编译输出)
- [9. 如何处理循环依赖？](#9-如何处理循环依赖)
  - [9.1. 循环依赖问题](#91-循环依赖问题)
  - [9.2. 循环依赖的原因](#92-循环依赖的原因)
  - [9.3. 解决方案](#93-解决方案)
  - [9.4. TypeScript 中的处理](#94-typescript-中的处理)
- [10. CommonJS 的常见模式有哪些？](#10-commonjs-的常见模式有哪些)
  - [10.1. 模式 1：单例模式](#101-模式-1单例模式)
  - [10.2. 模式 2：工厂模式](#102-模式-2工厂模式)
  - [10.3. 模式 3：命名空间模式](#103-模式-3命名空间模式)
  - [10.4. 模式 4：揭示模块模式](#104-模式-4揭示模块模式)
  - [10.5. 模式 5：配置模式](#105-模式-5配置模式)
  - [10.6. 模式 6：插件模式](#106-模式-6插件模式)
  - [10.7. 模式 7：中间件模式](#107-模式-7中间件模式)
  - [10.8. 模式 8：缓存模式](#108-模式-8缓存模式)
  - [10.9. 最佳实践](#109-最佳实践)
- [11. 引用](#11-引用)

<!-- endregion:toc -->

## 1. 本节内容

- CommonJS 模块系统的基本概念
- require 和 exports 的使用方法
- module.exports 与 exports 的区别
- CommonJS 与 ES 模块的对比
- TypeScript 中的 CommonJS 配置
- 循环依赖的处理
- 常见模式和最佳实践

## 2. 评价

CommonJS 是 **Node.js 采用的传统模块系统**。

CommonJS 的特点：

- **同步加载**：运行时同步加载模块
- **动态导入**：可以条件导入
- **缓存机制**：模块只加载一次
- **Node.js 原生**：Node.js 默认支持

CommonJS vs ES 模块：

| 特性             | CommonJS        | ES 模块        |
| ---------------- | --------------- | -------------- |
| **语法**         | require/exports | import/export  |
| **加载时机**     | 运行时          | 编译时         |
| **动态导入**     | 原生支持        | 需要 import()  |
| **Tree-shaking** | 不支持          | 支持           |
| **环境**         | Node.js         | 浏览器/Node.js |
| **this**         | exports 对象    | undefined      |

CommonJS 的优势：

1. **成熟稳定**：生态系统完善
2. **动态特性**：灵活的运行时导入
3. **简单直观**：易于理解和使用
4. **兼容性好**：广泛支持

CommonJS 的劣势：

1. **静态分析难**：不支持 tree-shaking
2. **同步加载**：不适合浏览器
3. **打包体积**：无法优化未使用的代码
4. **正在被淘汰**：ES 模块是未来

理解 CommonJS，能帮助你：

1. 维护旧项目代码
2. 理解 Node.js 模块机制
3. 处理模块互操作问题
4. 迁移到 ES 模块

虽然 ES 模块是未来，但 CommonJS 在 Node.js 生态中仍然广泛使用。

## 3. 什么是 CommonJS？

### 3.1. 基本概念

```ts
// ✅ CommonJS 是 Node.js 的模块系统
// 每个文件都是一个模块，有自己的作用域

// math.js
const PI = 3.14159

function add(a, b) {
  return a + b
}

function subtract(a, b) {
  return a - b
}

// 导出
module.exports = {
  PI,
  add,
  subtract,
}

// main.js
// 导入
const math = require('./math')

console.log(math.PI) // 3.14159
console.log(math.add(1, 2)) // 3
```

### 3.2. 模块特性

```js
// ✅ 1. 模块作用域
// 每个模块有独立作用域
const privateVar = 'secret' // 外部无法访问

// ✅ 2. this 指向 exports
console.log(this === exports) // true
console.log(this === module.exports) // true

// ✅ 3. 模块缓存
// module1.js
console.log('Module 1 loaded')
module.exports = { value: 1 }

// main.js
const m1 = require('./module1') // 输出: Module 1 loaded
const m2 = require('./module1') // 不输出（使用缓存）
console.log(m1 === m2)(
  // true（同一个对象）

  // ✅ 4. 模块包装
  // Node.js 会将模块包装在函数中
  function (exports, require, module, __filename, __dirname) {
    // 模块代码
    const PI = 3.14159
    module.exports = { PI }
  },
)
```

### 3.3. 模块对象

```js
// ✅ module 对象包含模块信息
console.log(module.id) // 模块 ID
console.log(module.filename) // 文件绝对路径
console.log(module.loaded) // 是否已加载
console.log(module.parent) // 父模块
console.log(module.children) // 子模块数组
console.log(module.paths) // 模块搜索路径

// ✅ require 对象
console.log(require.main) // 主模块
console.log(require.cache) // 模块缓存
console.log(require.resolve('./module')) // 解析模块路径
```

## 4. 如何使用 require 导入模块？

### 4.1. 基本导入

```js
// ✅ 1. 导入本地模块
const math = require('./math')
const user = require('./models/user')
const utils = require('../utils')

// ✅ 2. 导入核心模块
const fs = require('fs')
const path = require('path')
const http = require('http')

// ✅ 3. 导入第三方模块
const express = require('express')
const axios = require('axios')
const lodash = require('lodash')

// ✅ 4. 导入 JSON 文件
const config = require('./config.json')
const pkg = require('../package.json')
```

### 4.2. 解构导入

```js
// ✅ 导入部分导出
const { add, subtract } = require('./math')
const { readFile, writeFile } = require('fs')

// ✅ 重命名
const { add: sum } = require('./math')
const { readFile: read } = require('fs')
```

### 4.3. 动态导入

```js
// ✅ 条件导入
let module
if (condition) {
  module = require('./moduleA')
} else {
  module = require('./moduleB')
}

// ✅ 动态路径
const moduleName = 'math'
const module = require(`./${moduleName}`)

// ✅ 循环导入
const modules = ['a', 'b', 'c'].map((name) => require(`./${name}`))

// ✅ 函数内导入
function loadModule(name) {
  return require(`./${name}`)
}
```

### 4.4. 模块解析

```js
// ✅ 1. 相对路径
require('./math') // 当前目录
require('../utils') // 上级目录
require('../../config') // 多级上级

// ✅ 2. 绝对路径
require('/absolute/path/module')

// ✅ 3. 模块名（node_modules）
require('express')
require('lodash')

// ✅ 4. 文件扩展名（可省略）
require('./math') // 自动查找 .js, .json, .node
require('./math.js') // 显式扩展名
require('./config.json')

// ✅ 5. 目录导入
require('./models') // 查找 index.js 或 package.json 的 main
```

## 5. 如何使用 exports 导出模块？

### 5.1. 使用 exports

```js
// ✅ 1. 添加属性到 exports
// math.js
exports.PI = 3.14159
exports.add = function (a, b) {
  return a + b
}
exports.subtract = function (a, b) {
  return a - b
}

// 使用
const math = require('./math')
console.log(math.PI)
console.log(math.add(1, 2))
```

### 5.2. 使用 module.exports

```js
// ✅ 1. 导出对象
module.exports = {
  PI: 3.14159,
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
}

// ✅ 2. 导出函数
module.exports = function (a, b) {
  return a + b
}

// ✅ 3. 导出类
module.exports = class User {
  constructor(name) {
    this.name = name
  }
}

// ✅ 4. 导出实例
class Database {
  connect() {
    console.log('Connected')
  }
}

module.exports = new Database()

// ✅ 5. 导出值
module.exports = 42
module.exports = 'Hello'
module.exports = [1, 2, 3]
```

### 5.3. 混合导出

```js
// ✅ 先添加属性，再替换整个对象
exports.helper = function () {}

module.exports = {
  main: function () {},
  // helper 会丢失
}

// ✅ 正确做法：保留已有属性
exports.helper = function () {}

module.exports = {
  ...exports,
  main: function () {},
}
```

## 6. module.exports 和 exports 有什么区别？

### 6.1. 核心区别

```js
// ✅ exports 是 module.exports 的引用
console.log(exports === module.exports) // true

// ✅ require 返回的是 module.exports
// math.js
exports.add = (a, b) => a + b
module.exports.subtract = (a, b) => a - b

// main.js
const math = require('./math')
// math 实际是 module.exports 对象
```

### 6.2. 常见错误

```js
// ❌ 错误：重新赋值 exports
exports = {
  add: (a, b) => a + b,
}
// exports 现在指向新对象，但 module.exports 没变
// require 得到的是空对象 {}

// ✅ 正确：使用 module.exports
module.exports = {
  add: (a, b) => a + b,
}

// ❌ 错误：混用导致混淆
exports.add = (a, b) => a + b
module.exports = {
  subtract: (a, b) => a - b,
}
// 只有 subtract 被导出，add 丢失

// ✅ 正确：只使用一种方式
// 方式 1：只用 exports
exports.add = (a, b) => a + b
exports.subtract = (a, b) => a - b

// 方式 2：只用 module.exports
module.exports = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
}
```

### 6.3. 使用建议

```js
// ✅ 1. 导出多个命名导出：使用 exports
exports.config = {}
exports.helper = () => {}
exports.constant = 42

// ✅ 2. 导出单个值：使用 module.exports
module.exports = class User {}
module.exports = function main() {}

// ✅ 3. 导出对象：使用 module.exports
module.exports = {
  name: 'app',
  version: '1.0.0',
  start: () => {},
}

// ✅ 4. 保持一致性
// 在一个模块中只使用一种方式
```

## 7. CommonJS 和 ES 模块有什么区别？

### 7.1. 语法差异

```js
// ✅ CommonJS
const math = require('./math')
const { add } = require('./math')
module.exports = { add }
exports.add = add

// ✅ ES 模块
import math from './math'
import { add } from './math'
export { add }
export default add
```

### 7.2. 加载差异

```js
// ✅ CommonJS：运行时加载
// 可以在任何位置 require
if (condition) {
  const module = require('./module')
}

function load() {
  return require('./module')
}

// ✅ ES 模块：编译时加载
// import 必须在顶层
import module from './module'

// 动态导入需要使用 import()
if (condition) {
  const module = await import('./module')
}
```

### 7.3. 值差异

```js
// ✅ CommonJS：导出的是值的拷贝
// counter.js
let count = 0

exports.increment = () => ++count
exports.getCount = () => count
exports.count = count

// main.js
const counter = require('./counter')
console.log(counter.count) // 0
counter.increment()
console.log(counter.count) // 0（拷贝的值不变）
console.log(counter.getCount()) // 1（通过函数获取）

// ✅ ES 模块：导出的是值的引用
// counter.js
export let count = 0

export function increment() {
  count++
}

// main.js
import { count, increment } from './counter'
console.log(count) // 0
increment()
console.log(count) // 1（引用的值改变）
```

### 7.4. this 差异

```js
// ✅ CommonJS：this 指向 exports
console.log(this === exports) // true

// ✅ ES 模块：this 是 undefined
console.log(this) // undefined
```

### 7.5. 对比总结

| 特性             | CommonJS       | ES 模块               |
| ---------------- | -------------- | --------------------- |
| **加载时机**     | 运行时         | 编译时                |
| **导出方式**     | module.exports | export/export default |
| **导入方式**     | require()      | import/import()       |
| **导出类型**     | 值拷贝         | 值引用                |
| **动态导入**     | 原生支持       | 需要 import()         |
| **顶层 this**    | exports        | undefined             |
| **Tree-shaking** | 不支持         | 支持                  |
| **浏览器**       | 不支持         | 原生支持              |
| **严格模式**     | 可选           | 自动                  |

## 8. 如何在 TypeScript 中使用 CommonJS？

### 8.1. TypeScript 配置

```json
// tsconfig.json
{
  "compilerOptions": {
    // 使用 CommonJS 模块系统
    "module": "CommonJS",

    // 目标 ES 版本
    "target": "ES2020",

    // 允许导入 CommonJS 模块
    "esModuleInterop": true,

    // 允许默认导入
    "allowSyntheticDefaultImports": true,

    // 模块解析策略
    "moduleResolution": "node"
  }
}
```

### 8.2. 类型定义

```ts
// ✅ 导出类型
// types.ts
export interface User {
  id: number
  name: string
}

export type Status = 'active' | 'inactive'

// ✅ 使用 CommonJS 导出
module.exports = {
  createUser(name: string): User {
    return { id: 1, name }
  },
}

// ✅ 类型导入
const { createUser } = require('./types')
import type { User, Status } from './types'
```

### 8.3. 互操作

```ts
// ✅ 1. 导入 ES 模块到 CommonJS
// ES 模块
export default function greet(name: string): string {
  return `Hello, ${name}!`
}

// CommonJS 中导入
const greet = require('./greet').default
// 或使用 esModuleInterop
const greet = require('./greet')

// ✅ 2. 导入 CommonJS 到 ES 模块
// CommonJS 模块
module.exports = {
  add: (a, b) => a + b,
}

// ES 模块中导入
import math from './math'
import * as math from './math'
const { add } = math

// ✅ 3. 类型兼容
// CommonJS 类型定义
declare module './legacy' {
  export function oldFunction(): void
}

// 使用
import { oldFunction } from './legacy'
```

### 8.4. 编译输出

```ts
// TypeScript 源码
import { User } from './types'

export function greet(user: User): string {
  return `Hello, ${user.name}!`
}

// 编译为 CommonJS（module: "CommonJS"）
;('use strict')
Object.defineProperty(exports, '__esModule', { value: true })
exports.greet = void 0

const types_1 = require('./types')

function greet(user) {
  return `Hello, ${user.name}!`
}
exports.greet = greet
```

## 9. 如何处理循环依赖？

### 9.1. 循环依赖问题

```js
// ❌ 循环依赖示例
// a.js
const b = require('./b')

function funcA() {
  console.log('Function A')
  b.funcB()
}

module.exports = { funcA }

// b.js
const a = require('./a')

function funcB() {
  console.log('Function B')
  a.funcA() // 可能 undefined
}

module.exports = { funcB }
```

### 9.2. 循环依赖的原因

```js
// ✅ CommonJS 加载机制
// 1. 加载 a.js
// 2. 执行 a.js，遇到 require('./b')
// 3. 加载 b.js
// 4. 执行 b.js，遇到 require('./a')
// 5. 返回 a.js 的部分导出（此时 a.js 未执行完）
// 6. 继续执行 b.js
// 7. 返回 b.js 的导出
// 8. 继续执行 a.js

// 在步骤 5，a 的导出可能不完整
```

### 9.3. 解决方案

```js
// ✅ 1. 重构代码（最佳方案）
// 提取共同依赖
// shared.js
module.exports = {
  helper: () => console.log('Helper'),
}

// a.js
const shared = require('./shared')

function funcA() {
  shared.helper()
}

module.exports = { funcA }

// b.js
const shared = require('./shared')

function funcB() {
  shared.helper()
}

module.exports = { funcB }

// ✅ 2. 延迟 require
// a.js
let b

function funcA() {
  if (!b) b = require('./b')
  b.funcB()
}

module.exports = { funcA }

// ✅ 3. 使用函数包装
// a.js
module.exports = {
  funcA() {
    const b = require('./b')
    b.funcB()
  },
}

// ✅ 4. 改变导入顺序
// main.js
const a = require('./a')
const b = require('./b') // 确保 b 先完全加载

a.init(b)
```

### 9.4. TypeScript 中的处理

```ts
// ✅ 使用接口解耦
// types.ts
export interface ModuleA {
  funcA(): void
}

export interface ModuleB {
  funcB(): void
}

// a.ts
import type { ModuleB } from './types'
import type { ModuleA } from './types'

export const moduleA: ModuleA = {
  funcA() {
    // 延迟导入
    const { moduleB } = require('./b') as { moduleB: ModuleB }
    moduleB.funcB()
  },
}

// b.ts
import type { ModuleA } from './types'
import type { ModuleB } from './types'

export const moduleB: ModuleB = {
  funcB() {
    const { moduleA } = require('./a') as { moduleA: ModuleA }
    moduleA.funcA()
  },
}
```

## 10. CommonJS 的常见模式有哪些？

### 10.1. 模式 1：单例模式

```js
// ✅ 导出单例实例
// database.js
class Database {
  constructor() {
    this.connected = false
  }

  connect() {
    this.connected = true
    console.log('Connected to database')
  }
}

// 导出单例
module.exports = new Database()

// 使用
const db = require('./database')
db.connect()
```

### 10.2. 模式 2：工厂模式

```js
// ✅ 导出工厂函数
// user.js
class User {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
}

function createUser(name, age) {
  return new User(name, age)
}

module.exports = createUser

// 使用
const createUser = require('./user')
const user = createUser('Alice', 30)
```

### 10.3. 模式 3：命名空间模式

```js
// ✅ 导出命名空间对象
// utils.js
module.exports = {
  string: {
    capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
    truncate: (str, len) => str.slice(0, len),
  },
  number: {
    clamp: (num, min, max) => Math.min(Math.max(num, min), max),
    random: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
  },
}

// 使用
const utils = require('./utils')
utils.string.capitalize('hello')
utils.number.clamp(5, 0, 10)
```

### 10.4. 模式 4：揭示模块模式

```js
// ✅ 只导出公共 API
// module.js
function privateFunction() {
  console.log('Private')
}

function publicFunction() {
  console.log('Public')
  privateFunction()
}

module.exports = {
  public: publicFunction,
  // privateFunction 不导出
}

// 使用
const module = require('./module')
module.public() // 可以
// module.privateFunction()  // undefined
```

### 10.5. 模式 5：配置模式

```js
// ✅ 导出配置对象
// config.js
const env = process.env.NODE_ENV || 'development'

const config = {
  development: {
    db: 'localhost:27017',
    port: 3000,
  },
  production: {
    db: process.env.DB_URL,
    port: process.env.PORT,
  },
}

module.exports = config[env]

// 使用
const config = require('./config')
console.log(config.db)
console.log(config.port)
```

### 10.6. 模式 6：插件模式

```js
// ✅ 可扩展的插件系统
// plugin.js
class PluginManager {
  constructor() {
    this.plugins = []
  }

  register(plugin) {
    this.plugins.push(plugin)
    plugin.init()
  }

  execute() {
    this.plugins.forEach((p) => p.run())
  }
}

module.exports = new PluginManager()

// logger-plugin.js
module.exports = {
  name: 'logger',
  init() {
    console.log('Logger plugin initialized')
  },
  run() {
    console.log('Running logger')
  },
}

// 使用
const pluginManager = require('./plugin')
const loggerPlugin = require('./logger-plugin')

pluginManager.register(loggerPlugin)
pluginManager.execute()
```

### 10.7. 模式 7：中间件模式

```js
// ✅ Express 风格中间件
// middleware.js
function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`)
  next()
}

function auth(req, res, next) {
  if (req.headers.authorization) {
    next()
  } else {
    res.status(401).send('Unauthorized')
  }
}

module.exports = { logger, auth }

// 使用
const { logger, auth } = require('./middleware')
app.use(logger)
app.use(auth)
```

### 10.8. 模式 8：缓存模式

```js
// ✅ 利用模块缓存
// cache.js
const cache = new Map()

function get(key) {
  return cache.get(key)
}

function set(key, value) {
  cache.set(key, value)
}

module.exports = { get, set }

// 使用
const cache1 = require('./cache')
const cache2 = require('./cache')

cache1.set('key', 'value')
console.log(cache2.get('key')) // 'value'（同一个 cache）
```

### 10.9. 最佳实践

```js
// ✅ 1. 清晰的导出
// 好
module.exports = {
  add,
  subtract,
  multiply
}

// 不好
module.exports.add = add
module.exports.subtract = subtract
exports.multiply = multiply

// ✅ 2. 避免循环依赖
// 使用依赖注入
module.exports = function(dependencies) {
  return {
    doSomething() {
      dependencies.helper()
    }
  }
}

// ✅ 3. 文档化模块
/**
 * 用户管理模块
 *
 * @module User
 * @example
 * const { createUser } = require('./user')
 * const user = createUser('Alice', 30)
 */

// ✅ 4. 类型定义
// user.d.ts
export interface User {
  name: string
  age: number
}

export function createUser(name: string, age: number): User

// ✅ 5. 错误处理
module.exports = function() {
  try {
    // 初始化逻辑
  } catch (error) {
    console.error('Failed to initialize:', error)
    throw error
  }
}

// ✅ 6. 环境适配
const isNode = typeof module !== 'undefined' && module.exports

if (isNode) {
  module.exports = MyLibrary
} else {
  window.MyLibrary = MyLibrary
}

// ✅ 7. 清除缓存（测试用）
// 删除模块缓存
delete require.cache[require.resolve('./module')]

// 重新加载
const freshModule = require('./module')
```

## 11. 引用

- [Node.js Documentation - Modules][1]
- [CommonJS Specification][2]
- [Understanding module.exports and exports][3]
- [ES Modules vs CommonJS][4]

[1]: https://nodejs.org/api/modules.html
[2]: https://wiki.commonjs.org/wiki/Modules
[3]: https://www.sitepoint.com/understanding-module-exports-exports-node-js/
[4]: https://blog.logrocket.com/commonjs-vs-es-modules-node-js/
