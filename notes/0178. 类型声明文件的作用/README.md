# [0178. 类型声明文件的作用](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0178.%20%E7%B1%BB%E5%9E%8B%E5%A3%B0%E6%98%8E%E6%96%87%E4%BB%B6%E7%9A%84%E4%BD%9C%E7%94%A8)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是类型声明文件？](#3--什么是类型声明文件)
  - [3.1. 基本特征](#31-基本特征)
  - [3.2. 声明文件的特点](#32-声明文件的特点)
  - [3.3. 声明文件的内容](#33-声明文件的内容)
- [4. 🤔 类型声明文件有什么作用？](#4--类型声明文件有什么作用)
  - [4.1. 为 JavaScript 代码提供类型](#41-为-javascript-代码提供类型)
  - [4.2. 为第三方库提供类型](#42-为第三方库提供类型)
  - [4.3. 类型复用和共享](#43-类型复用和共享)
  - [4.4. 代码提示和自动补全](#44-代码提示和自动补全)
  - [4.5. 文档作用](#45-文档作用)
- [5. 🤔 类型声明文件的分类有哪些？](#5--类型声明文件的分类有哪些)
  - [5.1. 库声明文件](#51-库声明文件)
  - [5.2. 全局声明文件](#52-全局声明文件)
  - [5.3. 模块扩展文件](#53-模块扩展文件)
  - [5.4. 项目声明文件](#54-项目声明文件)
  - [5.5. 资源声明文件](#55-资源声明文件)
- [6. 🤔 类型声明文件的查找规则是什么？](#6--类型声明文件的查找规则是什么)
  - [6.1. 查找顺序](#61-查找顺序)
  - [6.2. 相对路径导入](#62-相对路径导入)
  - [6.3. 非相对路径导入](#63-非相对路径导入)
  - [6.4. 配置查找路径](#64-配置查找路径)
  - [6.5. 实际案例](#65-实际案例)
  - [6.6. 声明文件的优先级](#66-声明文件的优先级)
  - [6.7. 类型查找的配置选项](#67-类型查找的配置选项)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 类型声明文件的基本概念
- 类型声明文件的作用和价值
- 类型声明文件的分类
- 类型声明文件的查找规则
- 实际应用场景

## 2. 🫧 评价

类型声明文件是 TypeScript 类型系统的核心组成部分。

- 类型声明文件使用 `.d.ts` 扩展名，只包含类型信息
- 主要用于为 JavaScript 代码提供类型定义
- 是连接 TypeScript 与 JavaScript 生态系统的桥梁
- 可以自动生成或手动编写
- 良好的类型声明能显著提升开发体验和代码质量

## 3. 🤔 什么是类型声明文件？

类型声明文件是扩展名为 `.d.ts` 的文件，只包含类型声明，不包含实现。

### 3.1. 基本特征

```ts
// math.ts - 实现文件
export function add(a: number, b: number): number {
  return a + b
}

export function subtract(a: number, b: number): number {
  return a - b
}

// math.d.ts - 类型声明文件
export function add(a: number, b: number): number
export function subtract(a: number, b: number): number
```

### 3.2. 声明文件的特点

::: code-group

```ts [❌ 不能包含实现]
// error.d.ts
export function greet(name: string): string {
  return `Hello, ${name}` // ❌ 声明文件不能包含实现
}

export const PI = 3.14159 // ❌ 不能有初始化器
```

```ts [✅ 只能包含类型声明]
// correct.d.ts
export function greet(name: string): string

export const PI: number

export interface User {
  id: string
  name: string
}

export type Status = 'active' | 'inactive'
```

:::

### 3.3. 声明文件的内容

```ts
// types.d.ts - 完整示例

// 变量声明
declare const VERSION: string
declare let currentUser: User | null

// 函数声明
declare function fetchData(url: string): Promise<any>
declare function formatDate(date: Date, format?: string): string

// 类声明
declare class Logger {
  constructor(name: string)
  log(message: string): void
  error(error: Error): void
}

// 接口声明
interface User {
  id: string
  name: string
  email: string
}

// 类型别名
type Status = 'pending' | 'success' | 'error'
type Callback<T> = (data: T) => void

// 命名空间
declare namespace Utils {
  function clone<T>(obj: T): T
  function merge<T>(target: T, source: Partial<T>): T
}

// 模块声明
declare module 'my-library' {
  export function init(config: any): void
}

// 全局扩展
declare global {
  interface Window {
    myGlobal: string
  }
}
```

## 4. 🤔 类型声明文件有什么作用？

类型声明文件的核心价值和实际应用。

### 4.1. 为 JavaScript 代码提供类型

```javascript
// utils.js - JavaScript 实现
export function formatPrice(price) {
  return `$${price.toFixed(2)}`
}

export function calculateDiscount(price, percent) {
  return price * (1 - percent / 100)
}
```

```ts
// utils.d.ts - 类型声明
export function formatPrice(price: number): string
export function calculateDiscount(price: number, percent: number): number
```

```ts
// main.ts - 使用时有类型检查
import { formatPrice, calculateDiscount } from './utils.js'

const price = formatPrice(99.99) // ✅ 类型安全
const discount = calculateDiscount(100, 20) // ✅ 类型安全

formatPrice('invalid') // ❌ 类型错误
```

### 4.2. 为第三方库提供类型

```ts
// 场景：使用没有类型的 npm 包
// node_modules/awesome-lib/index.js
module.exports = {
  init(config) {
    /* ... */
  },
  process(data) {
    /* ... */
  },
}

// types/awesome-lib.d.ts - 添加类型声明
declare module 'awesome-lib' {
  export interface Config {
    apiKey: string
    timeout?: number
  }

  export function init(config: Config): void
  export function process(data: any): Promise<any>
}

// app.ts - 现在有类型支持
import { init, process } from 'awesome-lib'

init({ apiKey: 'xxx' }) // ✅ 类型检查
init({ timeout: 5000 }) // ❌ 缺少 apiKey
```

### 4.3. 类型复用和共享

```ts
// types/models.d.ts - 共享的类型定义
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

export interface Post {
  id: string
  title: string
  content: string
  authorId: string
  createdAt: Date
}

export interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

// api.ts - 使用共享类型
import type { User, Post, ApiResponse } from './types/models'

export async function getUser(id: string): Promise<ApiResponse<User>> {
  // 实现
}

export async function getPosts(): Promise<ApiResponse<Post[]>> {
  // 实现
}

// components/UserProfile.tsx - 使用共享类型
import type { User } from './types/models'

interface Props {
  user: User
}

export function UserProfile({ user }: Props) {
  return <div>{user.name}</div>
}
```

### 4.4. 代码提示和自动补全

```ts
// api.d.ts
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  timeout?: number
  retries?: number
}

export function request(url: string, options?: RequestOptions): Promise<any>

// 使用时会有完整的代码提示
import { request } from './api'

request('/api/users', {
  method: 'GET', // ✅ IDE 会提示可用的方法
  timeout: 5000, // ✅ IDE 会提示可用的选项
  // ✅ IDE 会自动补全属性名
})
```

### 4.5. 文档作用

````ts
// logger.d.ts - 类型声明本身就是文档
/**
 * 日志记录器
 * @example
 * ```ts
 * const logger = new Logger('MyApp');
 * logger.info('Application started');
 * logger.error('An error occurred', error);
 * ```
 */
export class Logger {
  /**
   * 创建日志记录器实例
   * @param name - 日志记录器名称
   */
  constructor(name: string)

  /**
   * 记录信息日志
   * @param message - 日志消息
   * @param meta - 附加元数据
   */
  info(message: string, meta?: Record<string, any>): void

  /**
   * 记录错误日志
   * @param message - 错误消息
   * @param error - 错误对象
   */
  error(message: string, error?: Error): void

  /**
   * 记录警告日志
   * @param message - 警告消息
   */
  warn(message: string): void
}
````

## 5. 🤔 类型声明文件的分类有哪些？

类型声明文件的不同类型和用途。

### 5.1. 库声明文件

为库提供类型声明。

```ts
// node_modules/@types/lodash/index.d.ts
declare module 'lodash' {
  export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait?: number
  ): T

  export function throttle<T extends (...args: any[]) => any>(
    func: T,
    wait?: number
  ): T

  // ... 更多声明
}
```

### 5.2. 全局声明文件

声明全局变量、函数、类型。

```ts
// types/global.d.ts
declare const __DEV__: boolean
declare const __VERSION__: string

declare function gtag(
  command: 'config' | 'event',
  targetId: string,
  config?: any
): void

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    API_URL: string
  }
}
```

### 5.3. 模块扩展文件

扩展现有模块的类型。

```ts
// types/express.d.ts
import 'express'

declare module 'express' {
  interface Request {
    user?: {
      id: string
      name: string
    }
  }

  interface Response {
    sendSuccess(data: any): void
    sendError(error: string): void
  }
}
```

### 5.4. 项目声明文件

项目内部的类型定义。

```ts
// src/types/index.d.ts
export interface User {
  id: string
  name: string
  email: string
}

export interface Post {
  id: string
  title: string
  content: string
}

export type ApiResponse<T> = {
  data: T
  status: number
  message: string
}
```

### 5.5. 资源声明文件

声明非代码资源的类型。

```ts
// types/assets.d.ts
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.svg' {
  import React from 'react'
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}

declare module '*.json' {
  const value: any
  export default value
}
```

## 6. 🤔 类型声明文件的查找规则是什么？

TypeScript 如何查找和加载类型声明文件。

### 6.1. 查找顺序

```ts
// 当导入模块时：import { something } from 'my-library';
// TypeScript 按以下顺序查找类型：

/**
 * 1. package.json 的 types/typings 字段
 *    node_modules/my-library/package.json:
 *    {
 *      "types": "./index.d.ts"  // 或 "typings"
 *    }
 *
 * 2. package.json 的 main 字段对应的 .d.ts 文件
 *    如果 "main": "./dist/index.js"
 *    会查找 ./dist/index.d.ts
 *
 * 3. 包根目录的 index.d.ts
 *    node_modules/my-library/index.d.ts
 *
 * 4. @types 目录
 *    node_modules/@types/my-library/index.d.ts
 *
 * 5. tsconfig.json 的 typeRoots 配置的目录
 */
```

### 6.2. 相对路径导入

```ts
// src/utils/math.ts
export function add(a: number, b: number): number {
  return a + b
}

// 查找顺序：
// 1. src/utils/math.d.ts
// 2. src/utils/math.ts（如果没有 .d.ts）

// src/main.ts
import { add } from './utils/math' // 找到类型定义
```

### 6.3. 非相对路径导入

```ts
// import 'lodash';
// 查找顺序：
// 1. node_modules/lodash/package.json 的 types 字段
// 2. node_modules/lodash/index.d.ts
// 3. node_modules/@types/lodash/index.d.ts
// 4. tsconfig.json 的 typeRoots 指定的目录
```

### 6.4. 配置查找路径

```json
// tsconfig.json
{
  "compilerOptions": {
    // 指定类型声明文件的根目录
    "typeRoots": ["./node_modules/@types", "./types"],

    // 只加载指定的类型包
    "types": ["node", "jest", "react"],

    // 路径映射
    "paths": {
      "@/*": ["src/*"],
      "@types/*": ["types/*"]
    },

    // 基础路径
    "baseUrl": "."
  }
}
```

### 6.5. 实际案例

```ts
// 项目结构
/**
 * project/
 * ├── node_modules/
 * │   ├── @types/
 * │   │   ├── node/
 * │   │   └── react/
 * │   └── lodash/
 * │       ├── package.json (types: "./index.d.ts")
 * │       └── index.d.ts
 * ├── types/
 * │   ├── global.d.ts
 * │   └── custom-lib.d.ts
 * ├── src/
 * │   ├── types/
 * │   │   └── models.d.ts
 * │   └── main.ts
 * └── tsconfig.json
 */

// src/main.ts
import lodash from 'lodash' // ✅ 找到 node_modules/lodash/index.d.ts
import React from 'react' // ✅ 找到 node_modules/@types/react
import { User } from './types/models' // ✅ 找到 src/types/models.d.ts
import 'custom-lib' // ✅ 找到 types/custom-lib.d.ts
```

### 6.6. 声明文件的优先级

```ts
// 同时存在多个声明文件时的优先级

// 1. 最高优先级：项目内的声明文件
// src/utils/helper.d.ts
export function help(): void

// 2. 中等优先级：@types 包
// node_modules/@types/helper/index.d.ts
export function help(): string

// 3. 最低优先级：库自带的类型
// node_modules/helper/index.d.ts
export function help(): number

// TypeScript 会使用优先级最高的声明
import { help } from './utils/helper' // 使用 src/utils/helper.d.ts
```

### 6.7. 类型查找的配置选项

```json
// tsconfig.json
{
  "compilerOptions": {
    // 禁用自动引入 @types 包
    "types": [],

    // 自定义类型根目录
    "typeRoots": ["./custom-types"],

    // 跳过库文件的类型检查（加快编译速度）
    "skipLibCheck": true,

    // 允许从没有默认导出的模块中默认导入
    "allowSyntheticDefaultImports": true,

    // 启用 CommonJS 和 ES 模块之间的互操作性
    "esModuleInterop": true,

    // 解析 JSON 模块
    "resolveJsonModule": true
  }
}
```

## 7. 🔗 引用

- [TypeScript Handbook - Declaration Files][1]
- [Declaration Files - Introduction][2]
- [Module Resolution][3]
- [Type Declaration Files][4]

[1]: https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html
[2]: https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html
[3]: https://www.typescriptlang.org/docs/handbook/module-resolution.html
[4]: https://www.typescriptlang.org/docs/handbook/2/type-declarations.html
