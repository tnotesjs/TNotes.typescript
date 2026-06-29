# [0143. 模块的类型声明](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0143.%20%E6%A8%A1%E5%9D%97%E7%9A%84%E7%B1%BB%E5%9E%8B%E5%A3%B0%E6%98%8E)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 什么是模块的类型声明？](#3-什么是模块的类型声明)
- [4. 为什么需要类型声明文件？](#4-为什么需要类型声明文件)
- [5. 类型声明文件的基本语法是什么？](#5-类型声明文件的基本语法是什么)
- [6. 如何为第三方模块添加类型声明？](#6-如何为第三方模块添加类型声明)
- [7. 模块类型声明的查找规则是什么？](#7-模块类型声明的查找规则是什么)
- [8. 如何声明全局模块？](#8-如何声明全局模块)
- [9. 如何声明命名空间模块？](#9-如何声明命名空间模块)
- [10. 如何扩展现有模块的类型？](#10-如何扩展现有模块的类型)
- [11. 如何处理非 JS/TS 文件的导入？](#11-如何处理非-jsts-文件的导入)
- [12. declare module 和 declare namespace 有什么区别？](#12-declare-module-和-declare-namespace-有什么区别)
- [13. @types 包是什么？](#13-types-包是什么)
- [14. 如何编写可发布的类型声明文件？](#14-如何编写可发布的类型声明文件)
- [15. 最佳实践是什么？](#15-最佳实践是什么)
- [16. 引用](#16-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 类型声明文件（`.d.ts`）
- `declare module` 语法
- 为第三方模块添加类型
- 模块扩展（Module Augmentation）
- 全局模块声明
- @types 包

## 2. 评价

- 类型声明文件是 TypeScript 项目中不可或缺的一部分，它为 JavaScript 代码提供类型信息。
- 理解模块的类型声明有助于：
  - 为没有类型定义的第三方库添加类型支持
  - 声明非代码文件（如图片、CSS）的类型
  - 扩展现有模块的类型定义
  - 发布自己的类型安全的库
- 在实际开发中，我们经常需要编写或修改类型声明文件，掌握这个知识点能够显著提升开发体验。

## 3. 什么是模块的类型声明？

模块的类型声明是使用 `.d.ts` 文件来描述模块的类型信息，而不包含实际的实现代码。这些文件只在 TypeScript 编译时使用，编译后会被删除。

类型声明文件的作用：

- 为 JavaScript 模块提供类型信息
- 声明全局变量、函数、类等的类型
- 扩展现有模块的类型定义
- 声明非代码资源（CSS、图片等）的类型

::: code-group

```ts [user.js]
// JavaScript 实现文件
export class User {
  constructor(name, age) {
    this.name = name
    this.age = age
  }

  greet() {
    return `Hello, ${this.name}`
  }
}
```

```ts [user.d.ts]
// 类型声明文件
export declare class User {
  constructor(name: string, age: number)
  name: string
  age: number
  greet(): string
}
```

```ts [app.ts]
// 使用时有完整的类型信息
import { User } from './user'

const user = new User('Alice', 25) // 类型检查正常
user.greet() // 返回 string
```

:::

## 4. 为什么需要类型声明文件？

为 JavaScript 库提供类型支持

很多第三方库是用 JavaScript 编写的，没有类型信息。

```ts
// 没有类型声明时
import _ from 'lodash'
_.map([1, 2, 3], (n) => n * 2) // TypeScript 不知道 _.map 的类型

// 安装 @types/lodash 后
import _ from 'lodash'
_.map([1, 2, 3], (n) => n * 2) // 有完整的类型提示和检查
```

分离类型定义和实现

在发布 npm 包时，可以将类型定义和实现分离。

::: code-group

```ts [lib.js]
// 实现文件
export function add(a, b) {
  return a + b
}
```

```ts [lib.d.ts]
// 类型声明文件
export declare function add(a: number, b: number): number
```

:::

声明全局类型

为全局变量、函数提供类型定义。

```ts
// global.d.ts
declare const APP_VERSION: string
declare function initApp(): void

// 使用时
console.log(APP_VERSION) // string 类型
initApp() // 无需导入，直接使用
```

## 5. 类型声明文件的基本语法是什么？

声明变量

```ts
// types.d.ts
declare const version: string
declare let count: number
declare var config: { apiUrl: string }
```

声明函数

```ts
// types.d.ts
declare function add(a: number, b: number): number
declare function greet(name: string): void

// 函数重载
declare function createElement(tag: 'div'): HTMLDivElement
declare function createElement(tag: 'span'): HTMLSpanElement
declare function createElement(tag: string): HTMLElement
```

声明类

```ts
// types.d.ts
declare class User {
  constructor(name: string, age: number)
  name: string
  age: number
  greet(): string
}
```

声明接口和类型别名

```ts
// types.d.ts
declare interface Config {
  apiUrl: string
  timeout: number
}

declare type Status = 'pending' | 'success' | 'error'
```

声明模块

```ts
// types.d.ts
declare module 'my-module' {
  export function doSomething(): void
  export const version: string
}
```

## 6. 如何为第三方模块添加类型声明？

为没有类型定义的 npm 包添加类型

假设使用的第三方库 `awesome-lib` 没有类型定义。

::: code-group

```ts [方式1: 在项目中创建声明文件]
// types/awesome-lib.d.ts
declare module 'awesome-lib' {
  export function doSomething(param: string): void
  export class AwesomeClass {
    constructor(config: { name: string })
    getName(): string
  }
}
```

```ts [方式2: 使用通配符声明]
// types/awesome-lib.d.ts
// 允许导入但不提供类型检查
declare module 'awesome-lib'
```

```ts [使用示例]
// app.ts
import { doSomething, AwesomeClass } from 'awesome-lib'

doSomething('test') // 有类型检查
const instance = new AwesomeClass({ name: 'test' })
```

:::

配置 TypeScript 识别类型声明

```json
// tsconfig.json
{
  "compilerOptions": {
    "typeRoots": ["./node_modules/@types", "./types"],
    "types": ["node", "jest"]
  }
}
```

## 7. 模块类型声明的查找规则是什么？

TypeScript 按以下顺序查找模块的类型声明：

1. 查找同名的 `.d.ts` 文件

::: code-group

```ts [math.js]
export function add(a, b) {
  return a + b
}
```

```ts [math.d.ts]
export declare function add(a: number, b: number): number
```

:::

2. 查找 package.json 中的 types 或 typings 字段

```json
// package.json
{
  "name": "my-lib",
  "main": "dist/index.js",
  "types": "dist/index.d.ts"
}
```

3. 查找 node_modules/@types 目录

```bash
node_modules/
  @types/
    lodash/
      index.d.ts
    react/
      index.d.ts
```

4. 查找 typeRoots 配置的目录

```json
// tsconfig.json
{
  "compilerOptions": {
    "typeRoots": ["./types", "./node_modules/@types"]
  }
}
```

## 8. 如何声明全局模块？

声明全局变量

```ts
// global.d.ts
declare global {
  const APP_VERSION: string
  const DEBUG: boolean

  interface Window {
    myCustomProperty: string
  }
}

export {}
```

使用全局声明：

```ts
// app.ts
console.log(APP_VERSION) // string
console.log(window.myCustomProperty) // string
```

注意事项：

- 在包含 `import` 或 `export` 的文件中，需要使用 `declare global` 块
- 如果文件中没有 `import` 或 `export`，整个文件会被视为全局作用域，可以直接使用 `declare`

::: code-group

```ts [有导入导出的文件]
// types.d.ts
import { User } from './user'

declare global {
  const currentUser: User
}

export {}
```

```ts [没有导入导出的文件]
// types.d.ts
declare const APP_VERSION: string
declare const DEBUG: boolean
```

:::

## 9. 如何声明命名空间模块？

使用 `declare module` 声明模块

```ts
// types.d.ts
declare module 'my-library' {
  export interface Config {
    apiUrl: string
  }

  export function init(config: Config): void

  export class Client {
    constructor(config: Config)
    request(url: string): Promise<any>
  }
}
```

使用声明的模块：

```ts
// app.ts
import { init, Client, Config } from 'my-library'

const config: Config = { apiUrl: 'https://api.example.com' }
init(config)

const client = new Client(config)
```

声明具有子路径的模块

```ts
// types.d.ts
declare module 'my-library' {
  export function main(): void
}

declare module 'my-library/utils' {
  export function helper(): void
}

declare module 'my-library/types' {
  export interface User {
    name: string
  }
}
```

使用子路径模块：

```ts
// app.ts
import { main } from 'my-library'
import { helper } from 'my-library/utils'
import type { User } from 'my-library/types'
```

## 10. 如何扩展现有模块的类型？

模块扩展（Module Augmentation）允许我们为现有模块添加新的类型定义。

扩展第三方库

::: code-group

```ts [扩展 Express]
// types/express.d.ts
import 'express'

declare module 'express' {
  interface Request {
    user?: {
      id: string
      name: string
    }
  }
}
```

```ts [使用扩展后的类型]
// app.ts
import express from 'express'

const app = express()

app.get('/', (req, res) => {
  // req.user 现在有类型定义
  console.log(req.user?.name)
})
```

:::

扩展全局接口

```ts
// types/global.d.ts
declare global {
  interface Window {
    myApp: {
      version: string
      init(): void
    }
  }

  interface Array<T> {
    myCustomMethod(): T[]
  }
}

export {}
```

使用扩展：

```ts
// app.ts
window.myApp.version // string
window.myApp.init() // 方法调用

const arr = [1, 2, 3]
arr.myCustomMethod() // number[]
```

扩展命名空间

```ts
// types.d.ts
import * as _ from 'lodash'

declare module 'lodash' {
  interface LoDashStatic {
    myCustomFunction(input: string): string
  }
}
```

## 11. 如何处理非 JS/TS 文件的导入？

声明 CSS 模块

::: code-group

```ts [types/css.d.ts]
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}
```

```ts [使用 CSS 模块]
// app.ts
import styles from './app.module.css'

console.log(styles.container) // string
```

:::

声明图片资源

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
  import React from 'react'
  const SVG: React.FC<React.SVGProps<SVGSVGElement>>
  export default SVG
}
```

使用图片：

```ts
// app.ts
import logo from './logo.png'
import Icon from './icon.svg'

console.log(logo) // string (图片 URL)
<Icon width={24} height={24} /> // React 组件
```

声明 JSON 文件

```ts
// types/json.d.ts
declare module '*.json' {
  const value: any
  export default value
}
```

使用 JSON：

```ts
// app.ts
import config from './config.json'

console.log(config.apiUrl) // any 类型
```

声明其他资源

```ts
// types/assets.d.ts
declare module '*.mp4' {
  const src: string
  export default src
}

declare module '*.woff' {
  const src: string
  export default src
}

declare module '*.woff2' {
  const src: string
  export default src
}
```

## 12. declare module 和 declare namespace 有什么区别？

`declare module` 用于模块声明

用于声明 ES6 模块或外部模块。

```ts
// types.d.ts
declare module 'my-library' {
  export function doSomething(): void
  export class MyClass {}
}

// 使用
import { doSomething, MyClass } from 'my-library'
```

`declare namespace` 用于命名空间声明

用于声明全局命名空间或内部模块（旧式模块系统）。

```ts
// types.d.ts
declare namespace MyNamespace {
  function doSomething(): void
  class MyClass {}

  namespace Nested {
    function helper(): void
  }
}

// 使用（无需导入）
MyNamespace.doSomething()
const instance = new MyNamespace.MyClass()
MyNamespace.Nested.helper()
```

区别对比：

| 特性     | declare module | declare namespace    |
| -------- | -------------- | -------------------- |
| 用途     | ES6 模块       | 全局命名空间         |
| 导入     | 需要 import    | 不需要导入           |
| 作用域   | 模块作用域     | 全局作用域           |
| 推荐使用 | 是（现代开发） | 否（旧式，向后兼容） |

## 13. @types 包是什么？

@types 是 DefinitelyTyped 项目的 npm 组织，为没有类型定义的 JavaScript 库提供类型声明。

安装 @types 包

```bash
# 为 lodash 安装类型定义
npm install --save-dev @types/lodash

# 为 node 安装类型定义
npm install --save-dev @types/node

# 为 react 安装类型定义
npm install --save-dev @types/react
```

使用 @types 包：

```ts
// 安装 @types/lodash 后
import _ from 'lodash'

// 现在有完整的类型提示
_.map([1, 2, 3], (n) => n * 2) // number[]
_.chunk([1, 2, 3, 4], 2) // number[][]
```

查找可用的 @types 包：

- 访问 [DefinitelyTyped 仓库][1]
- 访问 [TypeSearch][2] 网站搜索
- 在 npm 上搜索 `@types/库名`

自动安装类型

某些包管理器支持自动安装类型：

```bash
# pnpm 自动安装 @types
pnpm install lodash

# yarn 也可以配置自动安装
```

## 14. 如何编写可发布的类型声明文件？

项目结构

```
my-library/
├── src/
│   ├── index.ts
│   ├── user.ts
│   └── utils.ts
├── dist/
│   ├── index.js
│   ├── index.d.ts
│   ├── user.js
│   ├── user.d.ts
│   └── ...
├── package.json
└── tsconfig.json
```

配置 tsconfig.json

```json
// tsconfig.json
{
  "compilerOptions": {
    "declaration": true, // 生成 .d.ts 文件
    "declarationMap": true, // 生成 .d.ts.map 源映射
    "outDir": "./dist", // 输出目录
    "rootDir": "./src",
    "module": "ESNext",
    "target": "ES2020"
  },
  "include": ["src/**/*"]
}
```

配置 package.json

```json
// package.json
{
  "name": "my-library",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./utils": {
      "types": "./dist/utils.d.ts",
      "import": "./dist/utils.js"
    }
  },
  "files": ["dist"]
}
```

编写源代码

::: code-group

```ts [src/index.ts]
export { User } from './user'
export * from './utils'

export interface Config {
  apiUrl: string
  timeout?: number
}

export function init(config: Config): void {
  console.log('初始化', config)
}
```

```ts [src/user.ts]
export class User {
  constructor(
    public name: string,
    public age: number,
  ) {}

  greet(): string {
    return `Hello, ${this.name}`
  }
}
```

```ts [src/utils.ts]
export function add(a: number, b: number): number {
  return a + b
}

export function subtract(a: number, b: number): number {
  return a - b
}
```

:::

编译和发布

```bash
# 编译生成 .js 和 .d.ts 文件
npm run build  # 执行 tsc

# 发布到 npm
npm publish
```

使用发布的库：

```ts
// 其他项目中使用
import { User, init, add } from 'my-library'
import { subtract } from 'my-library/utils'

// 有完整的类型支持
const user = new User('Alice', 25)
init({ apiUrl: 'https://api.example.com' })
```

## 15. 最佳实践是什么？

使用 `declare` 关键字

在 `.d.ts` 文件中始终使用 `declare` 关键字。

```ts
// ✅ 推荐
declare function add(a: number, b: number): number
declare class User {
  name: string
}

// ❌ 不推荐（在 .d.ts 中可能导致问题）
function add(a: number, b: number): number
class User {
  name: string
}
```

分离类型定义

将类型定义和实现分离，便于维护和理解。

::: code-group

```ts [types/index.d.ts]
export interface User {
  id: string
  name: string
}

export interface Config {
  apiUrl: string
}
```

```ts [src/index.ts]
import type { User, Config } from '../types'

export function createUser(name: string): User {
  return { id: '1', name }
}
```

:::

使用命名空间组织复杂类型

```ts
// types.d.ts
declare namespace API {
  interface User {
    id: string
    name: string
  }

  interface Post {
    id: string
    title: string
    author: User
  }

  namespace Request {
    interface GetUser {
      userId: string
    }

    interface CreatePost {
      title: string
      content: string
    }
  }
}
```

为第三方库创建独立的类型文件

```
types/
├── express.d.ts
├── lodash.d.ts
└── my-custom-lib.d.ts
```

使用三斜线指令引用其他声明文件

```ts
// types.d.ts
/// <reference types="node" />
/// <reference path="./custom.d.ts" />

declare module 'my-module' {
  // 可以使用 node 和 custom.d.ts 中的类型
}
```

避免使用 `any`

在类型声明中尽量避免使用 `any`，使用更具体的类型。

```ts
// ❌ 不推荐
declare function process(data: any): any

// ✅ 推荐
declare function process<T>(data: T): T

// ✅ 或使用 unknown
declare function process(data: unknown): unknown
```

提供完整的文档注释

````ts
// types.d.ts
/**
 * 创建新用户
 * @param name - 用户名
 * @param age - 用户年龄
 * @returns 用户对象
 * @example
 * ```ts
 * const user = createUser('Alice', 25)
 * ```
 */
declare function createUser(name: string, age: number): User
````

## 16. 引用

- [TypeScript 官方文档 - Declaration Files][3]
- [DefinitelyTyped][1]
- [TypeSearch][2]
- [TypeScript 官方文档 - Module Augmentation][4]

[1]: https://github.com/DefinitelyTyped/DefinitelyTyped
[2]: https://www.typescriptlang.org/dt/search
[3]: https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html
[4]: https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
