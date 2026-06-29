# [0186. UMD 模块的类型声明](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0186.%20UMD%20%E6%A8%A1%E5%9D%97%E7%9A%84%E7%B1%BB%E5%9E%8B%E5%A3%B0%E6%98%8E)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 什么是 UMD 模块？](#3-什么是-umd-模块)
  - [3.1. UMD 模块的工作原理](#31-umd-模块的工作原理)
  - [3.2. UMD 的使用场景](#32-umd-的使用场景)
- [4. 如何为 UMD 模块编写类型声明？](#4-如何为-umd-模块编写类型声明)
  - [4.1. 基本的 UMD 声明结构](#41-基本的-umd-声明结构)
  - [4.2. 使用 export as namespace](#42-使用-export-as-namespace)
- [5. 如何处理不同的使用方式？](#5-如何处理不同的使用方式)
  - [5.1. 作为模块导入](#51-作为模块导入)
  - [5.2. 作为全局变量使用](#52-作为全局变量使用)
  - [5.3. 在 Node.js 中使用](#53-在-nodejs-中使用)
- [6. 实际案例分析](#6-实际案例分析)
  - [6.1. jQuery 的类型声明](#61-jquery-的类型声明)
  - [6.2. Lodash 的类型声明](#62-lodash-的类型声明)
  - [6.3. Moment.js 的类型声明](#63-momentjs-的类型声明)
- [7. UMD 声明的最佳实践](#7-umd-声明的最佳实践)
- [8. 引用](#8-引用)

<!-- endregion:toc -->

## 1. 本节内容

- UMD（Universal Module Definition）模块的概念
- UMD 模块的工作原理
- 为 UMD 模块编写类型声明的方法
- `export as namespace` 语法
- 处理 UMD 模块的不同使用方式
- 实际库的 UMD 声明案例
- UMD 声明的最佳实践

## 2. 评价

这篇笔记详细介绍了如何为 UMD（Universal Module Definition）模块编写 TypeScript 类型声明。UMD 是一种兼容多种模块系统的模式，可以同时支持 AMD、CommonJS 和全局变量。

- 理解 UMD 模块的设计目标是最大化兼容性
- 掌握 `export as namespace` 的使用方法
- 学会为流行的 UMD 库编写类型声明
- 随着 ES 模块的普及，新项目应优先使用 ES 模块
- UMD 主要用于维护老旧库或需要最大兼容性的场景
- 现代构建工具（Webpack、Rollup）可以自动处理不同模块系统的转换

## 3. 什么是 UMD 模块？

### 3.1. UMD 模块的工作原理

UMD（Universal Module Definition）是一种模块模式，目标是让模块能够在各种环境中工作。

**UMD 的基本结构：**

```javascript
// my-lib.js（典型的 UMD 模块）
;(function (root, factory) {
  // 检测 AMD
  if (typeof define === 'function' && define.amd) {
    define([], factory)
  }
  // 检测 CommonJS
  else if (typeof module === 'object' && module.exports) {
    module.exports = factory()
  }
  // 全局变量（浏览器）
  else {
    root.MyLib = factory()
  }
})(typeof self !== 'undefined' ? self : this, function () {
  // 模块的实现
  function greet(name) {
    return 'Hello, ' + name
  }

  function version() {
    return '1.0.0'
  }

  // 导出API
  return {
    greet: greet,
    version: version,
  }
})
```

**UMD 模块的特点：**

| 特性       | 说明                       |
| ---------- | -------------------------- |
| 多环境兼容 | AMD、CommonJS、全局变量    |
| 自动检测   | 根据环境选择合适的模块系统 |
| 向后兼容   | 支持老旧浏览器和模块加载器 |
| 灵活性     | 可以作为模块或全局变量使用 |

### 3.2. UMD 的使用场景

**UMD 适用的场景：**

```ts
// ✅ 适合 UMD 的场景
// 1. 需要同时支持浏览器和 Node.js
// 2. 需要支持 AMD、CommonJS、全局变量
// 3. 库需要在无构建工具的环境中使用
// 4. 维护老旧的库代码

// ❌ 不适合 UMD 的场景
// 1. 纯 Node.js 环境（使用 CommonJS）
// 2. 现代浏览器项目（使用 ES 模块）
// 3. 使用现代构建工具的项目（Webpack/Rollup）
```

**流行的 UMD 库：**

- jQuery
- Lodash
- Moment.js
- Underscore.js
- D3.js

## 4. 如何为 UMD 模块编写类型声明？

### 4.1. 基本的 UMD 声明结构

**方式 1：使用 declare namespace + export as namespace**

```ts
// types/my-lib.d.ts

// 1. 声明命名空间（包含所有 API）
declare namespace MyLib {
  function greet(name: string): string
  function version(): string

  interface Config {
    timeout: number
    debug: boolean
  }

  function init(config: Config): void
}

// 2. 允许作为模块导入
export = MyLib

// 3. 允许作为全局变量使用
export as namespace MyLib
```

**三种使用方式：**

```ts
// ✅ 方式1：ES6 模块导入（需要 esModuleInterop）
import MyLib from 'my-lib'
MyLib.greet('Alice')

// ✅ 方式2：CommonJS 导入
import MyLib = require('my-lib')
MyLib.greet('Alice')

// ✅ 方式3：全局变量（<script> 标签）
// <script src="my-lib.js"></script>
MyLib.greet('Alice')
```

### 4.2. 使用 export as namespace

**`export as namespace` 的作用：**

```ts
// types/calculator.d.ts

// 声明模块内容
export function add(a: number, b: number): number
export function subtract(a: number, b: number): number

export interface Options {
  precision: number
}

// 关键：允许作为全局变量使用
export as namespace Calculator
```

**对比没有 `export as namespace`：**

```ts
// ❌ 没有 export as namespace
export function add(a: number, b: number): number
// 只能作为模块导入：import { add } from 'calculator';
// 不能作为全局变量：Calculator.add(1, 2); // 报错

// ✅ 有 export as namespace
export function add(a: number, b: number): number
export as namespace Calculator
// 可以作为模块导入：import { add } from 'calculator';
// 也可以作为全局变量：Calculator.add(1, 2); // ✅
```

## 5. 如何处理不同的使用方式？

### 5.1. 作为模块导入

**ES6 模块导入：**

```ts
// types/my-lib.d.ts
export function method1(): void
export function method2(): string
export const version: string

export as namespace MyLib
```

**使用：**

```ts
// ✅ 命名导入
import { method1, method2, version } from 'my-lib'
method1()
console.log(version)

// ✅ 命名空间导入
import * as MyLib from 'my-lib'
MyLib.method1()
console.log(MyLib.version)
```

### 5.2. 作为全局变量使用

**全局使用场景：**

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <script src="my-lib.js"></script>
  </head>
  <body>
    <script>
      // ✅ 直接使用全局变量
      MyLib.method1()
      console.log(MyLib.version)
    </script>
  </body>
</html>
```

**TypeScript 中的类型支持：**

```ts
// app.ts

// ✅ 无需导入，直接使用全局变量
// 前提：在 HTML 中已经通过 <script> 标签加载了库
MyLib.method1() // 有类型提示
console.log(MyLib.version) // 有类型提示
```

### 5.3. 在 Node.js 中使用

**CommonJS 导入：**

```ts
// types/my-lib.d.ts
declare namespace MyLib {
  function method(): void
}

export = MyLib
export as namespace MyLib
```

**Node.js 使用：**

```ts
// ✅ CommonJS 导入
const MyLib = require('my-lib')
MyLib.method()

// ✅ TypeScript import = require 语法
import MyLib = require('my-lib')
MyLib.method()

// ✅ ES6 导入（需要 esModuleInterop）
import MyLib from 'my-lib'
MyLib.method()
```

## 6. 实际案例分析

### 6.1. jQuery 的类型声明

**简化的 jQuery 类型声明：**

```ts
// types/jquery.d.ts

// jQuery 对象接口
interface JQuery {
  // DOM 操作
  addClass(className: string): JQuery
  removeClass(className: string): JQuery

  // 事件
  on(event: string, handler: (event: Event) => void): JQuery
  off(event: string): JQuery

  // 内容
  html(): string
  html(content: string): JQuery

  // 链式调用
  each(callback: (index: number, element: Element) => void): JQuery
}

// jQuery 函数接口（选择器）
interface JQueryStatic {
  // 选择器
  (selector: string): JQuery
  (element: Element): JQuery
  (elements: Element[]): JQuery

  // AJAX
  ajax(settings: JQueryAjaxSettings): void

  // 工具方法
  extend<T>(target: T, ...sources: any[]): T
}

interface JQueryAjaxSettings {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  success?: (data: any) => void
  error?: (xhr: any, status: string, error: string) => void
}

// 全局 $ 变量
declare const $: JQueryStatic
declare const jQuery: JQueryStatic

// 模块导出
export = $
export as namespace $
```

**使用 jQuery：**

```ts
// ✅ 全局使用（<script> 标签）
$('#app').addClass('active')

$.ajax({
  url: '/api/users',
  method: 'GET',
  success: (data) => {
    console.log(data)
  },
})

// ✅ 模块导入
import $ from 'jquery'
$('#app').addClass('active')
```

### 6.2. Lodash 的类型声明

**简化的 Lodash 类型声明：**

```ts
// types/lodash.d.ts

// Lodash 命名空间
declare namespace _ {
  // 数组方法
  function chunk<T>(array: T[], size: number): T[][]
  function flatten<T>(array: T[]): T[]
  function uniq<T>(array: T[]): T[]

  // 对象方法
  function merge<T>(object: T, ...sources: any[]): T
  function pick<T, K extends keyof T>(object: T, ...keys: K[]): Pick<T, K>

  // 函数方法
  function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T
  function throttle<T extends (...args: any[]) => any>(func: T, wait: number): T

  // 集合方法
  function map<T, U>(collection: T[], iteratee: (value: T) => U): U[]
  function filter<T>(collection: T[], predicate: (value: T) => boolean): T[]
}

// Lodash 接口
interface LoDashStatic extends _ {}

// 全局变量
declare const _: LoDashStatic

// 模块导出
export = _
export as namespace _
```

**使用 Lodash：**

```ts
// ✅ 全局使用
const chunks = _.chunk([1, 2, 3, 4], 2) // [[1, 2], [3, 4]]
const unique = _.uniq([1, 2, 2, 3]) // [1, 2, 3]

// ✅ 模块导入
import _ from 'lodash'
const chunks = _.chunk([1, 2, 3, 4], 2)

// ✅ 导入特定方法
import { chunk, uniq } from 'lodash'
const chunks = chunk([1, 2, 3, 4], 2)
```

### 6.3. Moment.js 的类型声明

**简化的 Moment.js 类型声明：**

```ts
// types/moment.d.ts

// Moment 对象
interface Moment {
  format(format?: string): string
  add(amount: number, unit: string): Moment
  subtract(amount: number, unit: string): Moment
  isBefore(other: Moment): boolean
  isAfter(other: Moment): boolean
}

// Moment 构造函数
interface MomentStatic {
  (): Moment
  (date: Date): Moment
  (dateString: string): Moment
  (timestamp: number): Moment

  // 工厂方法
  utc(): Moment
  unix(timestamp: number): Moment
}

// 全局变量
declare const moment: MomentStatic

// 模块导出
export = moment
export as namespace moment
```

**使用 Moment.js：**

```ts
// ✅ 全局使用
const now = moment()
const formatted = now.format('YYYY-MM-DD')

// ✅ 模块导入
import moment from 'moment'
const now = moment()
```

## 7. UMD 声明的最佳实践

**1. 完整的 UMD 声明模板**

```ts
// types/my-umd-lib.d.ts

// 1. 声明命名空间
declare namespace MyUMDLib {
  // 类型定义
  interface Config {
    timeout: number
    debug?: boolean
  }

  interface Result {
    success: boolean
    data: any
  }

  // API 声明
  function init(config: Config): void
  function execute(): Promise<Result>
  function destroy(): void

  // 常量
  const version: string
}

// 2. CommonJS/AMD 导出
export = MyUMDLib

// 3. 全局变量支持
export as namespace MyUMDLib
```

**2. 处理重载**

```ts
declare namespace MyLib {
  // 函数重载
  function parse(value: string): any
  function parse(value: number): string
  function parse(value: any): any
}

export = MyLib
export as namespace MyLib
```

**3. 支持链式调用**

```ts
declare namespace ChainLib {
  interface Chain {
    method1(): Chain
    method2(value: string): Chain
    execute(): void
  }

  function create(): Chain
}

export = ChainLib
export as namespace ChainLib
```

**使用链式调用：**

```ts
ChainLib.create().method1().method2('test').execute()
```

**4. 插件系统**

```ts
declare namespace PluginLib {
  interface Plugin {
    name: string
    init(): void
  }

  function use(plugin: Plugin): void
  function plugin(name: string, plugin: Plugin): void
}

export = PluginLib
export as namespace PluginLib
```

**5. 配置文件示例**

```json
// tsconfig.json
{
  "compilerOptions": {
    "module": "umd",
    "target": "es5",
    "declaration": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

**6. package.json 配置**

```json
{
  "name": "my-umd-lib",
  "version": "1.0.0",
  "main": "dist/my-umd-lib.js",
  "types": "dist/my-umd-lib.d.ts",
  "umd:main": "dist/my-umd-lib.umd.js",
  "module": "dist/my-umd-lib.esm.js"
}
```

**7. 测试 UMD 声明**

```ts
// test/umd-test.ts

// 测试模块导入
import MyLib from 'my-umd-lib'
MyLib.init({ timeout: 5000 })

// 测试命名空间导入
import * as MyLib from 'my-umd-lib'
MyLib.init({ timeout: 5000 })

// 测试 CommonJS
import MyLib = require('my-umd-lib')
MyLib.init({ timeout: 5000 })

// 测试全局变量（需要在浏览器环境或配置中）
declare const MyLib: typeof import('my-umd-lib')
MyLib.init({ timeout: 5000 })
```

**8. 迁移建议**

```ts
// ❌ 老项目：UMD 模式
export = MyLib
export as namespace MyLib

// ✅ 新项目：ES 模块
export function method1(): void
export function method2(): string
export default MyLib

// 如果需要兼容，可以使用构建工具生成 UMD 版本
```

## 8. 引用

- [TypeScript Handbook - UMD][1]
- [UMD GitHub Repository][2]
- [TypeScript Handbook - Declaration Files][3]
- [DefinitelyTyped - UMD Examples][4]

[1]: https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html
[2]: https://github.com/umdjs/umd
[3]: https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html
[4]: https://github.com/DefinitelyTyped/DefinitelyTyped
