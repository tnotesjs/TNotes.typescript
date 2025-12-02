# [0185. 全局类型声明](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0185.%20%E5%85%A8%E5%B1%80%E7%B1%BB%E5%9E%8B%E5%A3%B0%E6%98%8E)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是全局类型声明？](#3--什么是全局类型声明)
  - [3.1. 全局声明的特点](#31-全局声明的特点)
  - [3.2. 全局声明 vs. 模块声明](#32-全局声明-vs-模块声明)
- [4. 🤔 如何声明全局变量？](#4--如何声明全局变量)
  - [4.1. 声明全局常量](#41-声明全局常量)
  - [4.2. 声明全局对象](#42-声明全局对象)
- [5. 🤔 如何声明全局函数？](#5--如何声明全局函数)
  - [5.1. 简单函数声明](#51-简单函数声明)
  - [5.2. 函数重载声明](#52-函数重载声明)
- [6. 🤔 如何声明全局类和接口？](#6--如何声明全局类和接口)
  - [6.1. 全局类声明](#61-全局类声明)
  - [6.2. 全局接口声明](#62-全局接口声明)
- [7. 🤔 如何扩展全局对象？](#7--如何扩展全局对象)
  - [7.1. 扩展 Window 对象](#71-扩展-window-对象)
  - [7.2. 扩展 Global 对象](#72-扩展-global-对象)
  - [7.3. 扩展内置对象原型](#73-扩展内置对象原型)
- [8. 🤔 如何在模块中添加全局声明？](#8--如何在模块中添加全局声明)
  - [8.1. declare global 语法](#81-declare-global-语法)
  - [8.2. 导出与全局声明共存](#82-导出与全局声明共存)
- [9. 🤔 全局类型声明有哪些最佳实践？](#9--全局类型声明有哪些最佳实践)
- [10. 🔗 引用](#10--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 全局类型声明的概念和特点
- 全局变量、函数、类、接口的声明方式
- 扩展全局对象（Window、Global 等）
- 在模块中使用 `declare global`
- 全局声明的最佳实践和注意事项

## 2. 🫧 评价

这篇笔记详细介绍了 TypeScript 中全局类型声明的方法，包括如何声明全局变量、函数、类，以及如何扩展内置的全局对象。

- 理解全局声明与模块声明的区别
- 掌握声明全局变量、函数、类、接口的方法
- 学会扩展浏览器和 Node.js 环境的全局对象
- 了解 `declare global` 在模块文件中的作用
- 在实际项目中，优先使用模块化而非全局声明
- 只有在处理第三方库或扩展运行时环境时才使用全局声明
- 全局声明会污染全局命名空间，需谨慎使用

## 3. 🤔 什么是全局类型声明？

### 3.1. 全局声明的特点

全局类型声明是指在全局作用域中声明类型，使其在整个项目的任何地方都可以使用，无需导入。

**全局声明的基本形式：**

```ts
// types/global.d.ts

// ⚠️ 注意：此文件不能有 import/export 语句，否则会变成模块

// 声明全局变量
declare const API_URL: string

// 声明全局函数
declare function showAlert(message: string): void

// 声明全局类
declare class Logger {
  log(message: string): void
}

// 声明全局接口
declare interface User {
  id: number
  name: string
}
```

**使用全局声明：**

```ts
// ✅ 无需导入，直接使用
console.log(API_URL)

showAlert('Hello')

const logger = new Logger()
logger.log('Info')

const user: User = {
  id: 1,
  name: 'Alice',
}
```

### 3.2. 全局声明 vs. 模块声明

**对比表格：**

| 特性         | 全局声明             | 模块声明           |
| ------------ | -------------------- | ------------------ |
| 作用域       | 整个项目             | 仅导入的文件       |
| 导入         | 不需要               | 需要 import        |
| 文件标识     | 无 import/export     | 有 import/export   |
| 命名空间污染 | 会污染               | 不会污染           |
| 使用场景     | 第三方库、运行时环境 | 业务代码、工具函数 |
| 推荐度       | 谨慎使用             | 优先使用           |

**示例对比：**

```ts
// ===== 全局声明 =====
// types/global.d.ts
declare function greet(name: string): string

// 使用（任何文件）
const message = greet('Alice') // ✅ 直接可用

// ===== 模块声明 =====
// utils/greet.ts
export function greet(name: string): string {
  return `Hello, ${name}`
}

// 使用（需要导入）
import { greet } from './utils/greet'
const message = greet('Alice') // ✅ 需要先导入
```

## 4. 🤔 如何声明全局变量？

### 4.1. 声明全局常量

**场景：声明构建时注入的全局常量**

```ts
// types/env.d.ts

// 声明单个变量
declare const __DEV__: boolean
declare const __VERSION__: string
declare const __API_URL__: string

// 声明 Node.js 环境变量
declare const process: {
  env: {
    NODE_ENV: 'development' | 'production' | 'test'
    API_KEY: string
  }
}
```

**使用：**

```ts
// ✅ 可以直接使用，有类型提示
if (__DEV__) {
  console.log('开发模式')
}

console.log(__VERSION__) // string
console.log(__API_URL__) // string

// Node.js 环境
console.log(process.env.NODE_ENV) // 'development' | 'production' | 'test'
```

### 4.2. 声明全局对象

**场景：声明第三方库注入的全局对象**

```ts
// types/jquery.d.ts

// 声明 jQuery 的 $ 对象
declare const $: {
  (selector: string): {
    addClass(className: string): void
    removeClass(className: string): void
    on(event: string, handler: () => void): void
  }
  ajax(options: {
    url: string
    method?: 'GET' | 'POST'
    data?: any
    success?: (data: any) => void
  }): void
}

// 或使用命名空间
declare namespace $ {
  function ajax(options: AjaxOptions): void

  interface AjaxOptions {
    url: string
    method?: 'GET' | 'POST'
    data?: any
    success?: (data: any) => void
  }
}
```

**使用：**

```ts
// ✅ 使用全局 $ 对象
$('#app').addClass('active')

$.ajax({
  url: '/api/users',
  method: 'GET',
  success: (data) => {
    console.log(data)
  },
})
```

## 5. 🤔 如何声明全局函数？

### 5.1. 简单函数声明

**场景：声明全局工具函数**

```ts
// types/utils.d.ts

// 简单函数
declare function formatDate(date: Date): string

// 带可选参数的函数
declare function log(message: string, level?: 'info' | 'warn' | 'error'): void

// 带默认参数的函数
declare function createId(prefix?: string): string

// 返回 Promise 的函数
declare function fetchData(url: string): Promise<any>
```

**使用：**

```ts
// ✅ 直接调用全局函数
const formatted = formatDate(new Date()) // string

log('消息') // 不传 level
log('警告', 'warn') // 传入 level

const id = createId() // 不传 prefix
const id2 = createId('user-') // 传入 prefix

fetchData('/api/users').then((data) => {
  console.log(data)
})
```

### 5.2. 函数重载声明

**场景：声明具有多个签名的全局函数**

```ts
// types/overload.d.ts

// 函数重载
declare function createElement(tag: 'div'): HTMLDivElement
declare function createElement(tag: 'span'): HTMLSpanElement
declare function createElement(tag: string): HTMLElement

// 复杂重载示例
declare function request(url: string): Promise<any>
declare function request(url: string, options: RequestOptions): Promise<any>
declare function request(config: FullRequestConfig): Promise<any>

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: any
}

interface FullRequestConfig extends RequestOptions {
  url: string
  timeout?: number
  retries?: number
}
```

**使用：**

```ts
// ✅ 根据参数类型匹配不同的重载
const div = createElement('div') // HTMLDivElement
const span = createElement('span') // HTMLSpanElement
const custom = createElement('my-element') // HTMLElement

// 不同的调用方式
request('/api/users')

request('/api/users', {
  method: 'POST',
  body: { name: 'Alice' },
})

request({
  url: '/api/users',
  method: 'GET',
  timeout: 5000,
})
```

## 6. 🤔 如何声明全局类和接口？

### 6.1. 全局类声明

**场景：声明全局可用的类**

```ts
// types/classes.d.ts

// 简单类
declare class EventEmitter {
  on(event: string, handler: (...args: any[]) => void): void
  off(event: string, handler: (...args: any[]) => void): void
  emit(event: string, ...args: any[]): void
}

// 带泛型的类
declare class Storage<T> {
  get(key: string): T | null
  set(key: string, value: T): void
  remove(key: string): void
  clear(): void
}

// 带静态成员的类
declare class Utils {
  static version: string
  static random(): number
  static uuid(): string
}

// 带构造函数重载的类
declare class Point {
  constructor(x: number, y: number)
  constructor(coords: { x: number; y: number })
  x: number
  y: number
}
```

**使用：**

```ts
// ✅ 实例化全局类
const emitter = new EventEmitter()
emitter.on('change', (data) => {
  console.log(data)
})

const storage = new Storage<User>()
storage.set('currentUser', { id: 1, name: 'Alice' })

// 访问静态成员
console.log(Utils.version)
const randomNum = Utils.random()

// 构造函数重载
const p1 = new Point(10, 20)
const p2 = new Point({ x: 10, y: 20 })
```

### 6.2. 全局接口声明

**场景：声明全局接口**

```ts
// types/interfaces.d.ts

// 简单接口
declare interface User {
  id: number
  name: string
  email: string
}

// 可选属性
declare interface Config {
  timeout: number
  retries?: number
  debug?: boolean
}

// 索引签名
declare interface Dictionary {
  [key: string]: any
}

// 函数接口
declare interface Formatter {
  (value: any): string
}

// 可调用接口
declare interface Logger {
  (message: string): void
  level: 'info' | 'warn' | 'error'
  setLevel(level: Logger['level']): void
}
```

**使用：**

```ts
// ✅ 使用全局接口作为类型
const user: User = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
}

const config: Config = {
  timeout: 5000,
  retries: 3,
}

const dict: Dictionary = {
  key1: 'value1',
  key2: 123,
}

const formatter: Formatter = (value) => String(value)

const logger: Logger = (message) => {
  console.log(message)
}
logger.level = 'info'
```

## 7. 🤔 如何扩展全局对象？

### 7.1. 扩展 Window 对象

**场景：为浏览器 window 对象添加自定义属性**

```ts
// types/window.d.ts

// 扩展 Window 接口
declare global {
  interface Window {
    // 添加自定义配置
    APP_CONFIG: {
      apiUrl: string
      version: string
    }

    // 添加第三方库
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: Record<string, any>
    ) => void

    // 添加自定义方法
    showNotification(message: string, type?: 'success' | 'error'): void
  }
}

// ⚠️ 必须导出，使其成为模块
export {}
```

**使用：**

```ts
// ✅ window 对象现在有类型提示
console.log(window.APP_CONFIG.apiUrl)

window.gtag('config', 'GA_MEASUREMENT_ID')

window.showNotification('操作成功', 'success')
```

### 7.2. 扩展 Global 对象

**场景：为 Node.js global 对象添加属性**

```ts
// types/global.d.ts

declare global {
  // Node.js global 命名空间
  namespace NodeJS {
    interface Global {
      // 添加缓存
      cache: Map<string, any>

      // 添加自定义方法
      logger: {
        info(message: string): void
        error(message: string): void
      }
    }

    // 扩展环境变量
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      DATABASE_URL: string
      API_KEY: string
      PORT: string
    }
  }

  // 添加 global 变量
  var cache: Map<string, any>
  var logger: {
    info(message: string): void
    error(message: string): void
  }
}

export {}
```

**使用：**

```ts
// ✅ 使用扩展的 global 对象
global.cache = new Map()
global.cache.set('key', 'value')

global.logger.info('Application started')

// ✅ 使用扩展的环境变量
console.log(process.env.NODE_ENV) // 'development' | 'production' | 'test'
console.log(process.env.DATABASE_URL) // string
```

### 7.3. 扩展内置对象原型

**场景：扩展 Array、String 等内置对象**

```ts
// types/extensions.d.ts

declare global {
  interface Array<T> {
    // 添加自定义方法
    first(): T | undefined
    last(): T | undefined
    shuffle(): T[]
  }

  interface String {
    // 添加字符串方法
    capitalize(): string
    truncate(maxLength: number): string
  }

  interface Number {
    // 添加数字方法
    toPercent(): string
    clamp(min: number, max: number): number
  }
}

export {}
```

**使用：**

```ts
// ✅ 使用扩展的原型方法
const arr = [1, 2, 3, 4, 5]
console.log(arr.first()) // 1 | undefined
console.log(arr.last()) // 5 | undefined
console.log(arr.shuffle()) // 随机排序

const str = 'hello world'
console.log(str.capitalize()) // 'Hello world'
console.log(str.truncate(5)) // 'hello...'

const num = 0.5
console.log(num.toPercent()) // '50%'
console.log((100).clamp(0, 50)) // 50
```

**⚠️ 实现扩展方法：**

```javascript
// extensions.js（实现文件）

Array.prototype.first = function () {
  return this[0]
}

Array.prototype.last = function () {
  return this[this.length - 1]
}

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

Number.prototype.toPercent = function () {
  return (this * 100).toFixed(0) + '%'
}
```

## 8. 🤔 如何在模块中添加全局声明？

### 8.1. declare global 语法

当文件包含 `import` 或 `export` 语句时，它会被视为模块。此时需要使用 `declare global` 来添加全局声明。

**场景：在模块文件中声明全局类型**

```ts
// types/augmentations.d.ts

// ✅ 有 import 语句，是模块文件
import { SomeType } from './some-module'

// 使用 declare global 添加全局声明
declare global {
  // 全局变量
  const BUILD_TIME: string

  // 全局函数
  function track(event: string, data?: any): void

  // 全局接口
  interface AppConfig {
    apiUrl: string
    timeout: number
  }

  // 扩展 Window
  interface Window {
    myApp: {
      version: string
      config: AppConfig
    }
  }
}

// 导出本模块的类型
export interface LocalType {
  id: number
}
```

**使用：**

```ts
// ✅ 可以使用全局声明
console.log(BUILD_TIME)

track('page_view', { page: '/home' })

const config: AppConfig = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
}

window.myApp.version = '1.0.0'

// 也可以导入模块的类型
import { LocalType } from './types/augmentations'
const local: LocalType = { id: 1 }
```

### 8.2. 导出与全局声明共存

**场景：同时提供模块导出和全局声明**

```ts
// lib/utils.d.ts

// 模块导出
export function moduleHelper(value: string): string

export interface ModuleOptions {
  debug: boolean
}

// 全局声明
declare global {
  namespace Utils {
    function globalHelper(value: string): string

    interface GlobalOptions {
      timeout: number
    }
  }
}
```

**使用：**

```ts
// 使用模块导出
import { moduleHelper, ModuleOptions } from './lib/utils'

const result = moduleHelper('test')
const options: ModuleOptions = { debug: true }

// 使用全局声明
Utils.globalHelper('test')
const globalOpts: Utils.GlobalOptions = { timeout: 5000 }
```

## 9. 🤔 全局类型声明有哪些最佳实践？

**1. 尽量避免全局声明**

```ts
// ❌ 不推荐：过度使用全局声明
declare function utility1(): void
declare function utility2(): void
declare function utility3(): void

// ✅ 推荐：使用模块
// utils.ts
export function utility1(): void
export function utility2(): void
export function utility3(): void
```

**2. 使用命名空间组织全局声明**

```ts
// ✅ 好：使用命名空间避免命名冲突
declare namespace MyApp {
  function init(): void
  function destroy(): void

  namespace Utils {
    function format(value: any): string
  }
}

// 使用
MyApp.init()
MyApp.Utils.format(123)

// ❌ 避免：直接声明在全局
declare function init(): void
declare function destroy(): void
declare function format(value: any): string
```

**3. 将全局声明集中管理**

```ts
// types/global.d.ts - 统一管理全局声明

// 环境变量
declare const __DEV__: boolean
declare const __VERSION__: string

// 第三方库
declare const $: any
declare const gtag: (...args: any[]) => void

// Window 扩展
declare global {
  interface Window {
    APP_CONFIG: AppConfig
  }
}

export interface AppConfig {
  apiUrl: string
}
```

**4. 为全局声明添加文档**

````ts
/**
 * 全局应用配置
 * 在构建时注入
 */
declare const APP_CONFIG: {
  /** API 服务器地址 */
  apiUrl: string

  /** 请求超时时间（毫秒） */
  timeout: number

  /** 是否启用调试模式 */
  debug: boolean
}

/**
 * 全局事件追踪函数
 * @param event - 事件名称
 * @param data - 事件数据
 * @example
 * ```ts
 * track('button_click', { buttonId: 'submit' });
 * ```
 */
declare function track(event: string, data?: Record<string, any>): void
````

**5. 区分不同环境的全局声明**

```ts
// types/browser.d.ts - 浏览器环境
declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}

export {}

// types/node.d.ts - Node.js 环境
declare global {
  namespace NodeJS {
    interface Global {
      cache: Map<string, any>
    }
  }
}

export {}
```

**6. 使用条件类型处理平台差异**

```ts
// types/platform.d.ts

type Platform = 'browser' | 'node'

declare global {
  const PLATFORM: Platform

  // 根据平台提供不同的 API
  const storage: Platform extends 'browser' ? Storage : NodeStorage
}

interface NodeStorage {
  get(key: string): Promise<string | null>
  set(key: string, value: string): Promise<void>
}

export {}
```

**7. 避免覆盖内置类型**

```ts
// ❌ 不好：完全覆盖内置类型
declare interface Array<T> {
  customMethod(): T[]
}

// ✅ 好：仅扩展，不覆盖
declare global {
  interface Array<T> {
    customMethod(): T[]
  }
}

export {}
```

**8. 全局声明的版本管理**

```ts
// types/legacy.d.ts - 旧版本兼容
declare global {
  /** @deprecated 使用 newAPI 替代 */
  function oldAPI(value: string): void

  function newAPI(value: string): Promise<void>
}

export {}
```

## 10. 🔗 引用

- [TypeScript Handbook - Global][1]
- [TypeScript Handbook - Declaration Merging][2]
- [TypeScript Handbook - Namespaces and Modules][3]
- [Global Augmentation][4]

[1]: https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html#global-libraries
[2]: https://www.typescriptlang.org/docs/handbook/declaration-merging.html
[3]: https://www.typescriptlang.org/docs/handbook/namespaces-and-modules.html
[4]: https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html
