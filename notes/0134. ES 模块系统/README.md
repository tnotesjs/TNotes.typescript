# [0134. ES 模块系统](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0134.%20ES%20%E6%A8%A1%E5%9D%97%E7%B3%BB%E7%BB%9F)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. ES 模块是什么？](#3-es-模块是什么)
  - [3.1. ES 模块基础](#31-es-模块基础)
    - [模块的概念](#模块的概念)
    - [模块的特性](#模块的特性)
  - [3.2. ES 模块 vs 其他模块系统](#32-es-模块-vs-其他模块系统)
  - [3.3. ES 模块的优势](#33-es-模块的优势)
- [4. 导出（Export）](#4-导出export)
  - [4.1. 命名导出](#41-命名导出)
  - [4.2. 默认导出](#42-默认导出)
  - [4.3. 重新导出](#43-重新导出)
- [5. 导入（Import）](#5-导入import)
  - [5.1. 命名导入](#51-命名导入)
  - [5.2. 默认导入](#52-默认导入)
  - [5.3. 副作用导入](#53-副作用导入)
  - [5.4. 动态导入](#54-动态导入)
- [6. 默认导出 vs 命名导出](#6-默认导出-vs-命名导出)
  - [6.1. 对比分析](#61-对比分析)
  - [6.2. 优缺点对比](#62-优缺点对比)
  - [6.3. 使用建议](#63-使用建议)
- [7. 动态导入](#7-动态导入)
  - [7.1. 基本用法](#71-基本用法)
  - [7.2. 代码分割](#72-代码分割)
  - [7.3. 条件加载](#73-条件加载)
  - [7.4. 预加载](#74-预加载)
- [8. 模块解析](#8-模块解析)
  - [8.1. 解析策略](#81-解析策略)
  - [8.2. 模块解析配置](#82-模块解析配置)
  - [8.3. 文件扩展名](#83-文件扩展名)
- [9. TypeScript 模块配置](#9-typescript-模块配置)
  - [9.1. tsconfig.json 模块选项](#91-tsconfigjson-模块选项)
  - [9.2. 模块类型](#92-模块类型)
  - [9.3. package.json 配置](#93-packagejson-配置)
- [10. 常见模式和最佳实践](#10-常见模式和最佳实践)
  - [10.1. 模式 1：桶文件（Barrel）](#101-模式-1桶文件barrel)
  - [10.2. 模式 2：命名空间模式](#102-模式-2命名空间模式)
  - [10.3. 模式 3：类型与实现分离](#103-模式-3类型与实现分离)
  - [10.4. 模式 4：插件模式](#104-模式-4插件模式)
  - [10.5. 模式 5：懒加载工厂](#105-模式-5懒加载工厂)
  - [10.6. 最佳实践](#106-最佳实践)
- [11. 引用](#11-引用)

<!-- endregion:toc -->

## 1. 本节内容

- ES 模块的基本语法
- 导出和导入的各种方式
- 默认导出与命名导出
- 动态导入和代码分割
- 模块解析机制
- TypeScript 中的模块配置
- 模块系统最佳实践

## 2. 评价

ES 模块（ES Modules，ESM）是 JavaScript 官方的模块系统标准。

## 3. ES 模块是什么？

ES 模块（ES Modules，ESM）是 JavaScript 官方的模块系统标准。

### 3.1. ES 模块基础

#### 模块的概念

模块就是一个个文件，每个文件都是一个模块，每个模块都有自己的作用域。

```ts
// math.ts
export function add(a: number, b: number): number {
  return a + b
}

export function subtract(a: number, b: number): number {
  return a - b
}

// main.ts
import { add, subtract } from './math'

console.log(add(1, 2)) // 3
console.log(subtract(5, 3)) // 2
```

#### 模块的特性

```ts
// 1. 严格模式自动启用
// 模块中的代码自动运行在严格模式下
// 无需 'use strict'

// 2. 顶层 this 是 undefined
console.log(this) // undefined（非模块中是 window 或 global）

// 3. 模块作用域
const privateVar = 'secret' // 只在模块内可见

export const publicVar = 'public' // 导出后外部可见

// 4. 单例模式：模块只执行一次
// 一个模块中的代码只有一份儿，不会因为被多次引入而出现多份儿。
// counter.ts
let count = 0

export function increment(): number {
  return ++count
}

export function getCount(): number {
  return count
}

// main.ts
import { increment, getCount } from './counter'
import { increment as inc } from './counter'

increment() // 1
inc() // 2
getCount() // 2（同一个 count）
```

- 静态结构：编译时确定依赖
- 严格模式：自动启用 strict mode
- 异步加载：支持按需加载
- 单例模式：模块只执行一次

### 3.2. ES 模块 vs 其他模块系统

| 特性         | ES 模块        | CommonJS        | AMD            |
| ------------ | -------------- | --------------- | -------------- |
| 语法         | import/export  | require/exports | define/require |
| 加载时机     | 编译时         | 运行时          | 运行时         |
| 环境         | 浏览器/Node.js | Node.js         | 浏览器         |
| Tree-shaking | 支持           | 不支持          | 不支持         |
| 异步         | 原生支持       | 不支持          | 支持           |

### 3.3. ES 模块的优势

1. 标准化：官方标准，统一生态
2. 静态分析：支持 tree-shaking
3. 性能优化：编译时优化
4. 现代化：适合现代开发

ES 模块是现代 JavaScript 开发的基础，TypeScript 完全支持 ES 模块语法。

## 4. 导出（Export）

### 4.1. 命名导出

```ts
// 1. 直接导出声明
export const PI = 3.14159
export let count = 0
export var name = 'TypeScript'

export function greet(name: string): string {
  return `Hello, ${name}!`
}

export class User {
  constructor(public name: string) {}
}

export interface Config {
  url: string
  timeout: number
}

export type Status = 'active' | 'inactive'

export enum Color {
  Red,
  Green,
  Blue,
}

// 2. 先声明后导出
const MAX_SIZE = 100
const MIN_SIZE = 10

function validate(value: number): boolean {
  return value >= MIN_SIZE && value <= MAX_SIZE
}

class Logger {
  log(message: string): void {
    console.log(message)
  }
}

export { MAX_SIZE, MIN_SIZE, validate, Logger }

// 3. 重命名导出
const internalName = 'secret'
export { internalName as publicName }
```

### 4.2. 默认导出

```ts
// 1. 默认导出函数
// utils.ts
export default function formatDate(date: Date): string {
  return date.toISOString()
}

// 2. 默认导出类
// User.ts
export default class User {
  constructor(
    public name: string,
    public age: number,
  ) {}
}

// 3. 默认导出对象
// config.ts
export default {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
}

// 4. 默认导出表达式
// math.ts
export default {
  add: (a: number, b: number) => a + b,
  subtract: (a: number, b: number) => a - b,
}

// 5. 混合导出
// module.ts
export default class DefaultClass {}
export const namedExport = 'value'
export function helperFunction(): void {}
```

### 4.3. 重新导出

```ts
// 1. 重新导出全部
// index.ts
export * from './user'
export * from './product'
export * from './order'

// 2. 重新导出部分
export { User, createUser } from './user'
export { Product as ProductModel } from './product'

// 3. 重新导出默认
export { default as User } from './user'
export { default } from './mainComponent'

// 4. 重新导出并重命名
export { User as UserModel, Product as ProductModel } from './models'

// 5. 聚合导出
// models/index.ts
export { User } from './User'
export { Product } from './Product'
export { Order } from './Order'
export type { UserProps, ProductProps, OrderProps } from './types'
```

## 5. 导入（Import）

### 5.1. 命名导入

```ts
// 1. 基本导入
import { add, subtract } from './math'

// 2. 导入多个
import { User, Product, Order } from './models'

// 3. 重命名导入
import { User as UserModel } from './models'
import { add as sum } from './math'

// 4. 导入全部（命名空间导入）
import * as Math from './math'

Math.add(1, 2)
Math.subtract(5, 3)

// 5. 导入类型（仅类型导入）
import type { User, Product } from './types'
import { type Config, validateConfig } from './config'
```

### 5.2. 默认导入

```ts
// 1. 导入默认导出
import formatDate from './utils'
import User from './User'
import config from './config'

// 2. 同时导入默认和命名
import React, { useState, useEffect } from 'react'
import User, { createUser, deleteUser } from './user'

// 3. 重命名默认导入
import { default as UserClass } from './User'
```

### 5.3. 副作用导入

```ts
// 仅执行模块，不导入任何内容
import './polyfills'
import './styles.css'
import './init'

// 模块会执行，但不导入任何变量
```

### 5.4. 动态导入

```ts
// 1. 基本动态导入
async function loadModule() {
  const math = await import('./math')
  console.log(math.add(1, 2))
}

// 2. 条件导入
async function loadFeature(name: string) {
  if (name === 'advanced') {
    const module = await import('./advanced-features')
    return module.default
  }
  return null
}

// 3. 懒加载
button.addEventListener('click', async () => {
  const { heavyFunction } = await import('./heavy-module')
  heavyFunction()
})

// 4. 动态路径
async function loadLocale(lang: string) {
  const module = await import(`./locales/${lang}.ts`)
  return module.default
}
```

## 6. 默认导出 vs 命名导出

### 6.1. 对比分析

```ts
// 命名导出
// utils.ts
export function add(a: number, b: number): number {
  return a + b
}

export function subtract(a: number, b: number): number {
  return a - b
}

// 使用
import { add, subtract } from './utils'
import { add as sum } from './utils' // 可重命名
import * as Utils from './utils' // 命名空间

// 默认导出
// calculator.ts
export default class Calculator {
  add(a: number, b: number): number {
    return a + b
  }
}

// 使用
import Calculator from './calculator'
import Calc from './calculator' // 可以任意命名
```

### 6.2. 优缺点对比

| 特性         | 命名导出 | 默认导出 |
| ------------ | -------- | -------- |
| 重命名       | 需要 as  | 自动     |
| 自动补全     | 更好     | 较差     |
| Tree-shaking | 更好     | 较差     |
| 重构         | 更安全   | 较危险   |
| 多个导出     | 支持     | 只能一个 |

### 6.3. 使用建议

```ts
// 1. 优先使用命名导出
// user.ts
export class User {}
export function createUser() {}
export function deleteUser() {}

// 2. 默认导出用于主要导出
// App.tsx
export default function App() {
  return <div>App</div>
}

// ❌ 避免混用（容易混淆）
// bad.ts
export default class User {}
export const helper = () => {}

// 保持一致性
// good.ts
export class User {}
export const helper = () => {}
```

## 7. 动态导入

### 7.1. 基本用法

```ts
// 1. Promise 形式
import('./module').then((module) => {
  module.doSomething()
})

// 2. async/await 形式
async function loadModule() {
  const module = await import('./module')
  return module.default
}

// 3. 错误处理
async function safeImport() {
  try {
    const module = await import('./module')
    return module
  } catch (error) {
    console.error('Failed to load module:', error)
    return null
  }
}
```

### 7.2. 代码分割

```ts
// React 懒加载
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  )
}

// 路由懒加载
const routes = [
  {
    path: '/dashboard',
    component: () => import('./pages/Dashboard'),
  },
  {
    path: '/settings',
    component: () => import('./pages/Settings'),
  },
]
```

### 7.3. 条件加载

```ts
// 根据条件加载不同模块
async function loadTheme(theme: 'light' | 'dark') {
  if (theme === 'dark') {
    return import('./themes/dark')
  } else {
    return import('./themes/light')
  }
}

// 特性检测
async function loadPolyfills() {
  if (!('IntersectionObserver' in window)) {
    await import('intersection-observer')
  }
}

// 按需加载
async function loadFeature(featureName: string) {
  const features = {
    charts: () => import('./features/charts'),
    maps: () => import('./features/maps'),
    editor: () => import('./features/editor'),
  }

  const loader = features[featureName as keyof typeof features]
  return loader ? loader() : null
}
```

### 7.4. 预加载

```ts
// 1. 预加载（空闲时加载）
function preloadModule() {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      import('./heavy-module')
    })
  }
}

// 2. 用户交互前预加载
button.addEventListener('mouseenter', () => {
  import('./tooltip') // 预加载，不等待
})

button.addEventListener('click', async () => {
  const { showTooltip } = await import('./tooltip')
  showTooltip()
})

// 3. webpack 魔法注释
const module = await import(
  /* webpackChunkName: "my-chunk" */
  /* webpackPrefetch: true */
  './module'
)
```

## 8. 模块解析

### 8.1. 解析策略

```ts
// 1. 相对路径
import { User } from './models/User' // 相对当前文件
import { Config } from '../config' // 上级目录
import { Utils } from '../../utils' // 多级上级

// 2. 绝对路径（Node.js）
import { User } from '/absolute/path/User'

// 3. 非相对路径（node_modules）
import React from 'react'
import { useState } from 'react'
import axios from 'axios'

// 4. 路径别名（需要配置）
import { User } from '@/models/User'
import { API } from '@/services/api'
import { utils } from '@utils'
```

### 8.2. 模块解析配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"],
      "@models/*": ["src/models/*"]
    }
  }
}
```

### 8.3. 文件扩展名

```ts
// TypeScript 支持的扩展名
import { User } from './User' // 自动查找 .ts, .tsx, .d.ts
import { Config } from './config' // 自动查找 .ts, .tsx

// 显式扩展名
import { User } from './User.ts'
import { Component } from './Component.tsx'

// JSON 导入
import config from './config.json'
import packageInfo from '../package.json'

// 声明文件
import type { CustomType } from './types.d.ts'
```

## 9. TypeScript 模块配置

### 9.1. tsconfig.json 模块选项

```json
{
  "compilerOptions": {
    // 模块系统
    "module": "ESNext", // ES2015, ES2020, CommonJS, AMD, UMD

    // 模块解析策略
    "moduleResolution": "node", // node, classic

    // 基础路径
    "baseUrl": ".",

    // 路径映射
    "paths": {
      "@/*": ["src/*"]
    },

    // 允许 JSON 导入
    "resolveJsonModule": true,

    // ES 模块互操作
    "esModuleInterop": true,

    // 允许默认导入
    "allowSyntheticDefaultImports": true,

    // 保留导入
    "isolatedModules": true,

    // 生成声明文件
    "declaration": true
  }
}
```

### 9.2. 模块类型

```json
// 1. ESNext（推荐）
{
  "compilerOptions": {
    "module": "ESNext",
    "target": "ES2020"
  }
}

// 2. CommonJS（Node.js）
{
  "compilerOptions": {
    "module": "CommonJS",
    "target": "ES2020"
  }
}

// 3. ES2020（原生 ESM）
{
  "compilerOptions": {
    "module": "ES2020",
    "target": "ES2020"
  }
}
```

### 9.3. package.json 配置

```json
{
  "name": "my-package",
  "version": "1.0.0",

  // ES 模块
  "type": "module",

  // 导出映射
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./utils": {
      "import": "./dist/utils.js",
      "types": "./dist/utils.d.ts"
    }
  },

  // 主入口
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts"
}
```

## 10. 常见模式和最佳实践

### 10.1. 模式 1：桶文件（Barrel）

```ts
// 统一导出（index.ts）
// models/index.ts
export { User } from './User'
export { Product } from './Product'
export { Order } from './Order'
export type { UserProps, ProductProps } from './types'

// 使用
import { User, Product, Order } from './models'

// ⚠️ 注意：可能影响 tree-shaking
// 避免导出过多未使用的内容
```

### 10.2. 模式 2：命名空间模式

```ts
// 使用对象组织相关功能
// math.ts
export const MathUtils = {
  add: (a: number, b: number) => a + b,
  subtract: (a: number, b: number) => a - b,
  multiply: (a: number, b: number) => a * b,
  divide: (a: number, b: number) => a / b,
}

// 使用
import { MathUtils } from './math'
MathUtils.add(1, 2)

// 或使用命名空间导入
import * as Math from './math'
Math.MathUtils.add(1, 2)
```

### 10.3. 模式 3：类型与实现分离

```ts
// 分离类型定义
// types.ts
export interface User {
  id: number
  name: string
}

export interface Product {
  id: number
  title: string
  price: number
}

// services.ts
import type { User, Product } from './types'

export class UserService {
  async getUser(id: number): Promise<User> {
    // 实现
  }
}

// 使用
import type { User } from './types'
import { UserService } from './services'
```

### 10.4. 模式 4：插件模式

```ts
// 可扩展的插件系统
// plugin.ts
export interface Plugin {
  name: string
  init(): void
}

// plugins/logger.ts
export const loggerPlugin: Plugin = {
  name: 'logger',
  init() {
    console.log('Logger initialized')
  },
}

// app.ts
import type { Plugin } from './plugin'

class App {
  private plugins: Plugin[] = []

  use(plugin: Plugin): this {
    this.plugins.push(plugin)
    plugin.init()
    return this
  }
}

// 使用
import { loggerPlugin } from './plugins/logger'
const app = new App().use(loggerPlugin)
```

### 10.5. 模式 5：懒加载工厂

```ts
// 懒加载工厂函数
type ModuleLoader<T> = () => Promise<{ default: T }>

class LazyModule<T> {
  private instance: T | null = null

  constructor(private loader: ModuleLoader<T>) {}

  async getInstance(): Promise<T> {
    if (!this.instance) {
      const module = await this.loader()
      this.instance = module.default
    }
    return this.instance
  }
}

// 使用
const heavyModule = new LazyModule(() => import('./heavy-module'))

// 需要时才加载
const instance = await heavyModule.getInstance()
```

### 10.6. 最佳实践

````ts
// 1. 使用命名导出（优先）
export function createUser() {}
export class User {}
export const CONFIG = {}

// 2. 一个文件一个主要导出
// User.ts - 只导出 User 相关
export class User {}
export function createUser() {}
export function validateUser() {}

// 3. 避免循环依赖
// ❌ 不好
// a.ts
import { b } from './b'
export const a = b + 1

// b.ts
import { a } from './a'
export const b = a + 1

// 好：提取共同依赖
// shared.ts
export const base = 10

// a.ts
import { base } from './shared'
export const a = base + 1

// b.ts
import { base } from './shared'
export const b = base + 2

// 4. 使用路径别名
import { User } from '@/models/User'
import { api } from '@/services/api'
import { formatDate } from '@/utils/date'

// 5. 类型导入使用 type 关键字
import type { User, Product } from './types'
import { UserService } from './services'

// 6. 按需导入
// ❌ 不好
import * as lodash from 'lodash'

// 好
import { debounce, throttle } from 'lodash'

// 7. 文档化模块
/
 * 用户管理模块
 *
 * @module User
 * @example
 * ```ts
 * import { User, createUser } from './User'
 *
 * const user = createUser('Alice', 30)
 * ```
 */

// 8. 使用 ESLint 检查
// .eslintrc.js
module.exports = {
  rules: {
    'import/no-default-export': 'error',
    'import/prefer-default-export': 'off',
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        alphabetize: { order: 'asc' },
      },
    ],
  },
}

// 9. 组织导入顺序
// React
import React, { useState } from 'react'

// 第三方库
import axios from 'axios'
import { debounce } from 'lodash'

// 内部模块
import { User } from '@/models/User'
import { api } from '@/services/api'

// 相对导入
import { helper } from '../utils'
import { Component } from './Component'

// 样式
import './styles.css'

// 10. 声明模块类型
// custom.d.ts
declare module '*.svg' {
  const content: string
  export default content
}

declare module '*.css' {
  const classes: { [key: string]: string }
  export default classes
}

// 使用
import logo from './logo.svg'
import styles from './App.module.css'
````

## 11. 引用

- [MDN - JavaScript modules][1]
- [TypeScript Handbook - Modules][2]
- [ES Modules: A cartoon deep-dive][3]
- [Node.js ES Modules][4]

[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
[2]: https://www.typescriptlang.org/docs/handbook/modules.html
[3]: https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/
[4]: https://nodejs.org/api/esm.html
