# [0184. 模块的类型声明](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0184.%20%E6%A8%A1%E5%9D%97%E7%9A%84%E7%B1%BB%E5%9E%8B%E5%A3%B0%E6%98%8E)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 什么是模块的类型声明？](#3-什么是模块的类型声明)
  - [3.1. 基本概念](#31-基本概念)
  - [3.2. 模块声明的必要性](#32-模块声明的必要性)
- [4. 如何为 ES 模块编写类型声明？](#4-如何为-es-模块编写类型声明)
  - [4.1. 命名导出的声明](#41-命名导出的声明)
  - [4.2. 默认导出的声明](#42-默认导出的声明)
  - [4.3. 混合导出的声明](#43-混合导出的声明)
- [5. 如何为 CommonJS 模块编写类型声明？](#5-如何为-commonjs-模块编写类型声明)
  - [5.1. export = 语法](#51-export--语法)
  - [5.2. module.exports 的声明](#52-moduleexports-的声明)
  - [5.3. CommonJS 与 ES 模块的兼容](#53-commonjs-与-es-模块的兼容)
- [6. 如何进行模块扩展（Module Augmentation）？](#6-如何进行模块扩展module-augmentation)
  - [6.1. 扩展第三方模块](#61-扩展第三方模块)
  - [6.2. 扩展 Node.js 内置模块](#62-扩展-nodejs-内置模块)
  - [6.3. 扩展全局模块](#63-扩展全局模块)
- [7. 如何声明通配符模块？](#7-如何声明通配符模块)
  - [7.1. 通配符模块的使用场景](#71-通配符模块的使用场景)
  - [7.2. 常见的通配符模块声明](#72-常见的通配符模块声明)
- [8. 模块的类型声明有哪些最佳实践？](#8-模块的类型声明有哪些最佳实践)
- [9. 引用](#9-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 模块的类型声明的基本概念
- ES 模块的类型声明方式
- CommonJS 模块的类型声明方式
- 模块扩展（Module Augmentation）
- 通配符模块的声明
- 模块类型声明的最佳实践

## 2. 评价

这篇笔记详细介绍了 TypeScript 中模块的类型声明方法，包括 ES 模块和 CommonJS 模块的不同声明方式。

- 掌握为第三方 JavaScript 库编写类型声明的能力
- 理解不同模块系统的类型声明差异
- 学会扩展已有模块的类型定义
- 了解通配符模块在处理非标准模块格式时的作用
- 在实际项目中优先使用 ES 模块语法，它更符合现代标准
- 为 CommonJS 库编写声明时注意 `esModuleInterop` 配置的影响

## 3. 什么是模块的类型声明？

### 3.1. 基本概念

模块的类型声明是指为一个模块（ES 模块或 CommonJS 模块）编写 `.d.ts` 文件，描述该模块导出的类型信息。

**模块声明的基本语法：**

```ts
// types/my-module.d.ts

// 方式1：使用 declare module 包裹
declare module 'my-module' {
  export function greet(name: string): string
  export const version: string
}

// 方式2：直接导出（文件名对应模块名）
// types/my-module/index.d.ts
export function greet(name: string): string
export const version: string
```

**使用模块：**

```ts
// 使用者可以获得类型提示
import { greet, version } from 'my-module'

const message = greet('TypeScript') // message: string
console.log(version) // version: string
```

### 3.2. 模块声明的必要性

**为什么需要模块的类型声明：**

| 场景          | 说明                     | 示例              |
| ------------- | ------------------------ | ----------------- |
| JavaScript 库 | 为纯 JS 编写的库提供类型 | lodash、jQuery    |
| 第三方模块    | 没有官方类型的 npm 包    | 老旧的 npm 包     |
| 内部模块      | 公司内部的 JS 模块       | 内部工具库        |
| 非标准模块    | JSON、CSS 等资源文件     | `*.json`、`*.css` |

**模块声明的位置：**

```ts
// 方式1：项目根目录的 types 目录
// types/my-module/index.d.ts
export function method(): void;

// 方式2：与模块同级
// my-module.d.ts（对应 my-module.js）
export function method(): void;

// 方式3：发布到 @types
// node_modules/@types/my-module/index.d.ts
export function method(): void;

// tsconfig.json 配置
{
  "compilerOptions": {
    "typeRoots": ["./types", "./node_modules/@types"]
  }
}
```

## 4. 如何为 ES 模块编写类型声明？

### 4.1. 命名导出的声明

**JavaScript 模块（ES6）：**

```javascript
// math.js
export function add(a, b) {
  return a + b
}

export function subtract(a, b) {
  return a - b
}

export const PI = 3.14159
```

**类型声明：**

```ts
// math.d.ts
export function add(a: number, b: number): number
export function subtract(a: number, b: number): number
export const PI: number
```

**使用：**

```ts
// 使用者获得完整类型支持
import { add, subtract, PI } from './math'

const sum = add(1, 2) // sum: number
const diff = subtract(5, 3) // diff: number
console.log(PI) // PI: number
```

### 4.2. 默认导出的声明

**JavaScript 模块：**

```javascript
// user.js
export default class User {
  constructor(name, age) {
    this.name = name
    this.age = age
  }

  greet() {
    return `Hello, I'm ${this.name}`
  }
}
```

**类型声明：**

```ts
// user.d.ts
export default class User {
  constructor(name: string, age: number)
  name: string
  age: number
  greet(): string
}
```

**使用：**

```ts
import User from './user'

const user = new User('Alice', 25)
console.log(user.greet()) // string
```

### 4.3. 混合导出的声明

**JavaScript 模块：**

```javascript
// logger.js
export default function log(message) {
  console.log(message)
}

export function warn(message) {
  console.warn(message)
}

export function error(message) {
  console.error(message)
}

export const levels = {
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
}
```

**类型声明：**

```ts
// logger.d.ts
export default function log(message: string): void

export function warn(message: string): void
export function error(message: string): void

export const levels: {
  INFO: 'info'
  WARN: 'warn'
  ERROR: 'error'
}
```

**使用：**

```ts
import log, { warn, error, levels } from './logger'

log('Info message')
warn('Warning message')
error('Error message')
console.log(levels.INFO) // 'info'
```

## 5. 如何为 CommonJS 模块编写类型声明？

### 5.1. export = 语法

**JavaScript 模块（CommonJS）：**

```javascript
// calculator.js
function Calculator() {
  this.value = 0
}

Calculator.prototype.add = function (n) {
  this.value += n
  return this
}

Calculator.prototype.getValue = function () {
  return this.value
}

module.exports = Calculator
```

**类型声明（使用 export =）：**

```ts
// calculator.d.ts
declare class Calculator {
  constructor()
  value: number
  add(n: number): this
  getValue(): number
}

// export = 用于 CommonJS 的默认导出
export = Calculator
```

**使用（需要特殊导入）：**

```ts
// ❌ 错误：不能使用 ES6 导入（除非开启 esModuleInterop）
// import Calculator from './calculator';

// ✅ 正确：使用 import = require() 语法
import Calculator = require('./calculator')

const calc = new Calculator()
calc.add(5).add(3)
console.log(calc.getValue()) // 8

// 或者开启 esModuleInterop 后可以使用：
// import Calculator from './calculator';
```

**tsconfig.json 配置：**

```json
{
  "compilerOptions": {
    "esModuleInterop": true, // 允许使用 ES6 导入 CommonJS 模块
    "allowSyntheticDefaultImports": true
  }
}
```

### 5.2. module.exports 的声明

**JavaScript 模块：**

```javascript
// utils.js
module.exports = {
  trim: function (str) {
    return str.trim()
  },

  capitalize: function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  },

  version: '1.0.0',
}
```

**类型声明：**

```ts
// utils.d.ts
declare namespace Utils {
  function trim(str: string): string
  function capitalize(str: string): string
  const version: string
}

export = Utils
```

**使用：**

```ts
import utils = require('./utils')

const trimmed = utils.trim('  hello  ') // string
const capitalized = utils.capitalize('world') // string
console.log(utils.version) // string
```

### 5.3. CommonJS 与 ES 模块的兼容

**同时支持两种导入方式：**

```ts
// types/my-lib.d.ts

// 命名空间包含所有导出
declare namespace MyLib {
  interface Config {
    timeout: number
    retries: number
  }

  function init(config: Config): void
  function destroy(): void

  const version: string
}

// CommonJS 默认导出
export = MyLib

// 同时支持 ES6 命名导出（需要配合 esModuleInterop）
export as namespace MyLib
```

**两种使用方式：**

```ts
// 方式1：CommonJS 导入
import MyLib = require('my-lib')
MyLib.init({ timeout: 5000, retries: 3 })

// 方式2：ES6 导入（需要 esModuleInterop: true）
import * as MyLib from 'my-lib'
MyLib.init({ timeout: 5000, retries: 3 })
```

## 6. 如何进行模块扩展（Module Augmentation）？

### 6.1. 扩展第三方模块

**场景：为 express 添加自定义属性**

```ts
// types/express.d.ts

// 导入原始模块的类型
import 'express'

// 使用 declare module 扩展模块
declare module 'express' {
  // 扩展 Request 接口
  interface Request {
    user?: {
      id: string
      name: string
      role: string
    }
  }
}
```

**使用扩展后的类型：**

```ts
import express from 'express'

const app = express()

app.use((req, res, next) => {
  // ✅ 现在可以访问 req.user，并有类型提示
  req.user = {
    id: '123',
    name: 'Alice',
    role: 'admin',
  }
  next()
})

app.get('/', (req, res) => {
  // TypeScript 知道 req.user 的类型
  if (req.user) {
    res.json({ message: `Hello, ${req.user.name}` })
  }
})
```

**场景：为 Vue 3 添加全局属性**

```ts
// types/vue.d.ts

import 'vue'

declare module 'vue' {
  interface ComponentCustomProperties {
    $api: {
      get(url: string): Promise<any>
      post(url: string, data: any): Promise<any>
    }
  }
}
```

**使用：**

```vue
<script setup lang="ts">
import { getCurrentInstance } from 'vue'

const instance = getCurrentInstance()

// ✅ 有类型提示
instance?.proxy?.$api.get('/users')
</script>
```

### 6.2. 扩展 Node.js 内置模块

**扩展 global 对象：**

```ts
// types/global.d.ts

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      DATABASE_URL: string
      API_KEY: string
    }

    interface Global {
      myCustomCache: Map<string, any>
    }
  }
}

// ⚠️ 必须有 export，否则不是模块
export {}
```

**使用：**

```ts
// ✅ process.env 现在有类型提示
console.log(process.env.NODE_ENV) // 'development' | 'production' | 'test'
console.log(process.env.DATABASE_URL) // string

// ✅ global 对象也有类型
global.myCustomCache = new Map()
```

### 6.3. 扩展全局模块

**场景：为 window 对象添加属性**

```ts
// types/window.d.ts

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: Record<string, any>,
    ) => void

    dataLayer: any[]
  }
}

export {}
```

**使用：**

```ts
// ✅ window 对象有类型提示
window.gtag('config', 'GA_MEASUREMENT_ID')
window.dataLayer.push({ event: 'page_view' })
```

## 7. 如何声明通配符模块？

### 7.1. 通配符模块的使用场景

通配符模块用于声明一类模块的类型，常用于非 JavaScript 资源文件。

**常见场景：**

| 资源类型  | 通配符模式       | 用途           |
| --------- | ---------------- | -------------- |
| JSON 文件 | `*.json`         | 导入 JSON 数据 |
| CSS 模块  | `*.module.css`   | CSS Modules    |
| 图片      | `*.png`, `*.jpg` | 图片资源       |
| SVG       | `*.svg`          | SVG 图标       |
| 文本      | `*.txt`, `*.md`  | 文本文件       |

### 7.2. 常见的通配符模块声明

**JSON 文件：**

```ts
// types/json.d.ts

declare module '*.json' {
  const value: any
  export default value
}

// 或者更严格的类型
declare module '*.json' {
  const value: Record<string, any>
  export default value
}
```

**使用：**

```ts
// ✅ 可以导入 JSON 文件
import config from './config.json'

console.log(config.version)
```

**CSS Modules：**

```ts
// types/css-modules.d.ts

declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}
```

**使用：**

```ts
import styles from './App.module.css'

// ✅ styles 有类型提示
;<div className={styles.container}>
  <h1 className={styles.title}>Hello</h1>
</div>
```

**图片资源：**

```ts
// types/images.d.ts

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.svg' {
  const content: string
  export default content
}

// React 项目可以更具体
declare module '*.svg' {
  import React from 'react'
  const SVGComponent: React.FC<React.SVGProps<SVGSVGElement>>
  export default SVGComponent
}
```

**使用：**

```ts
import logo from './logo.png';
import icon from './icon.svg';

// Webpack/Vite 会处理这些导入
<img src={logo} alt="Logo" />
<Icon />  // SVG 作为组件
```

**文本文件：**

```ts
// types/text.d.ts

declare module '*.txt' {
  const content: string
  export default content
}

declare module '*.md' {
  const content: string
  export default content
}
```

**完整的资源声明文件示例：**

```ts
// types/resources.d.ts

// JSON
declare module '*.json' {
  const value: Record<string, any>
  export default value
}

// Styles
declare module '*.css' {
  const content: { readonly [key: string]: string }
  export default content
}

declare module '*.scss' {
  const content: { readonly [key: string]: string }
  export default content
}

// Images
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.svg' {
  const content: any
  export default content
}

// Fonts
declare module '*.woff'
declare module '*.woff2'
declare module '*.ttf'
declare module '*.eot'

// Other
declare module '*.txt' {
  const content: string
  export default content
}
```

## 8. 模块的类型声明有哪些最佳实践？

**1. 优先使用 ES 模块语法**

```ts
// ✅ 推荐：使用 ES 模块
export function greet(name: string): string
export default class User {}

// ❌ 避免：除非必须支持 CommonJS
export = MyModule
```

**2. 模块声明的组织**

```ts
// ✅ 好的组织：按功能分组
// types/my-lib/index.d.ts
export interface Config {}
export interface Options {}

export function init(config: Config): void
export function destroy(): void

export class Service {}

export namespace Utils {
  function helper1(): void
  function helper2(): void
}

// ❌ 避免：所有内容混在一起
```

**3. 模块扩展的位置**

```ts
// ✅ 推荐：单独的扩展文件
// types/express-extensions.d.ts
import 'express'
declare module 'express' {
  interface Request {
    user?: User
  }
}

// ❌ 避免：在业务代码中扩展
```

**4. 使用命名空间组织类型**

```ts
// ✅ 好的实践：使用命名空间
declare module 'my-lib' {
  export namespace HTTP {
    interface Request {}
    interface Response {}
  }

  export namespace WebSocket {
    interface Message {}
    interface Connection {}
  }
}

// 使用时层次清晰
import { HTTP, WebSocket } from 'my-lib'
const req: HTTP.Request = {}
const msg: WebSocket.Message = {}
```

**5. 为通配符模块提供准确类型**

```ts
// ❌ 不好：过于宽泛
declare module '*.svg' {
  const content: any
  export default content
}

// ✅ 好：根据使用场景提供准确类型
declare module '*.svg' {
  const content: string // 如果是 URL
  export default content
}

// 或
declare module '*.svg' {
  import { FC, SVGProps } from 'react'
  const Component: FC<SVGProps<SVGSVGElement>> // 如果是组件
  export default Component
}
```

**6. 模块声明的版本管理**

```ts
// types/my-lib-v1.d.ts
declare module 'my-lib' {
  export function oldMethod(): void
}

// types/my-lib-v2.d.ts
declare module 'my-lib' {
  export function newMethod(): Promise<void>
  /** @deprecated 使用 newMethod 替代 */
  export function oldMethod(): void
}
```

**7. 文档注释**

```ts
/**
 * 用户认证模块
 * @module auth
 */
declare module 'auth' {
  /**
   * 登录用户
   * @param username - 用户名
   * @param password - 密码
   * @returns 认证令牌
   * @throws {AuthError} 认证失败时抛出
   */
  export function login(username: string, password: string): Promise<string>

  /**
   * 认证错误类
   */
  export class AuthError extends Error {
    code: number
  }
}
```

**8. 配合 package.json**

```json
{
  "name": "my-lib",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "require": "./dist/index.js",
      "import": "./dist/index.mjs"
    },
    "./utils": {
      "types": "./dist/utils.d.ts",
      "require": "./dist/utils.js",
      "import": "./dist/utils.mjs"
    }
  }
}
```

## 9. 引用

- [TypeScript Handbook - Modules][1]
- [TypeScript Handbook - Module Augmentation][2]
- [TypeScript Handbook - Declaration Files][3]
- [Module Resolution][4]

[1]: https://www.typescriptlang.org/docs/handbook/modules.html
[2]: https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
[3]: https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html
[4]: https://www.typescriptlang.org/docs/handbook/module-resolution.html
