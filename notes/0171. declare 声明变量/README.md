# [0171. declare 声明变量](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0171.%20declare%20%E5%A3%B0%E6%98%8E%E5%8F%98%E9%87%8F)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 如何使用 declare 声明变量？](#3-如何使用-declare-声明变量)
  - [3.1. 基本语法](#31-基本语法)
  - [3.2. 声明不同类型的变量](#32-声明不同类型的变量)
  - [3.3. 实际使用场景](#33-实际使用场景)
- [4. var、let 和 const 在 declare 中的区别？](#4-varlet-和-const-在-declare-中的区别)
  - [4.1. var 声明](#41-var-声明)
  - [4.2. let 声明](#42-let-声明)
  - [4.3. const 声明](#43-const-声明)
  - [4.4. 实际应用对比](#44-实际应用对比)
  - [4.5. 选择建议](#45-选择建议)
- [5. 如何声明复杂类型的变量？](#5-如何声明复杂类型的变量)
  - [5.1. 对象类型](#51-对象类型)
  - [5.2. 数组和元组](#52-数组和元组)
  - [5.3. 函数类型](#53-函数类型)
  - [5.4. 联合和交叉类型](#54-联合和交叉类型)
  - [5.5. 泛型类型](#55-泛型类型)
  - [5.6. 复杂嵌套类型](#56-复杂嵌套类型)
- [6. 如何声明全局变量？](#6-如何声明全局变量)
  - [6.1. 浏览器环境](#61-浏览器环境)
  - [6.2. Node.js 环境](#62-nodejs-环境)
  - [6.3. 通用全局变量](#63-通用全局变量)
  - [6.4. 第三方库的全局变量](#64-第三方库的全局变量)
  - [6.5. 模块环境中的全局声明](#65-模块环境中的全局声明)
  - [6.6. 环境变量示例](#66-环境变量示例)
- [7. 引用](#7-引用)

<!-- endregion:toc -->

## 1. 本节内容

- declare 声明变量的基本语法
- var、let、const 的使用区别
- 复杂类型变量的声明
- 全局变量的声明方式
- 实际应用场景

## 2. 评价

使用 declare 声明变量可以为外部定义的全局变量提供类型信息。

- declare 变量声明只有类型，没有初始值
- 支持 `var`、`let`、`const` 三种声明方式
- 主要用于声明全局变量和外部脚本定义的变量
- 在浏览器环境中常用于声明 window 对象上的属性
- 在 Node.js 环境中常用于声明 process、global 等全局对象的属性

## 3. 如何使用 declare 声明变量？

declare 声明变量的基本语法与普通变量声明类似，但不能赋初始值。

### 3.1. 基本语法

```ts
// 声明全局变量
declare var version: string
declare let currentUser: string
declare const API_URL: string

// 使用变量
console.log(version)
console.log(currentUser)
console.log(API_URL)

// 编译后
// console.log(version);
// console.log(currentUser);
// console.log(API_URL);
```

### 3.2. 声明不同类型的变量

```ts
// 基本类型
declare var count: number
declare var isActive: boolean
declare var message: string

// 数组类型
declare var items: string[]
declare var numbers: Array<number>

// 对象类型
declare var config: {
  apiUrl: string
  timeout: number
}

// 联合类型
declare var status: 'pending' | 'success' | 'error'

// 任意类型
declare var data: any
```

### 3.3. 实际使用场景

```ts
// 场景1：CDN 引入的库定义了全局变量
// <script src="config.js"></script>
// config.js 定义了：window.APP_CONFIG = { ... }

declare var APP_CONFIG: {
  apiEndpoint: string
  environment: 'development' | 'production'
  features: string[]
}

// 现在可以安全使用
console.log(APP_CONFIG.apiEndpoint)

// 场景2：在 HTML 中内联定义的变量
// <script>
//   var INITIAL_DATA = { users: [], posts: [] };
// </script>

declare var INITIAL_DATA: {
  users: Array<{ id: number; name: string }>
  posts: Array<{ id: number; title: string }>
}

// 现在可以使用
INITIAL_DATA.users.forEach((user) => {
  console.log(user.name)
})
```

## 4. var、let 和 const 在 declare 中的区别？

在 declare 声明中，var、let、const 的区别主要体现在语义上。

### 4.1. var 声明

```ts
// var 声明的变量可以被重新赋值
declare var mutableValue: number

// 使用时可以修改
mutableValue = 10
mutableValue = 20 // 正确
```

### 4.2. let 声明

```ts
// let 声明的变量可以被重新赋值（语义上与 var 相同）
declare let currentPage: number

// 使用时可以修改
currentPage = 1
currentPage = 2 // 正确
```

### 4.3. const 声明

```ts
// const 声明的变量不能被重新赋值
declare const VERSION: string
declare const MAX_SIZE: number

// 使用时不能修改
console.log(VERSION)
// VERSION = '2.0';  // 错误：无法分配到 'VERSION'，因为它是常量

// 但对象属性可以修改
declare const CONFIG: {
  apiUrl: string
  timeout: number
}

CONFIG.timeout = 5000 // 正确：可以修改属性
// CONFIG = {};  // 错误：不能重新赋值
```

### 4.4. 实际应用对比

::: code-group

```ts [var 声明]
// 全局可变状态
declare var userToken: string | null

// 可以随时修改
userToken = 'abc123'
userToken = null
```

```ts [let 声明]
// 块级作用域变量（虽然 declare 中作用域相同）
declare let selectedId: number

// 可以修改
selectedId = 1
selectedId = 2
```

```ts [const 声明]
// 常量配置
declare const ENV: {
  readonly NODE_ENV: string
  readonly API_URL: string
}

// 只能读取，不能修改
console.log(ENV.NODE_ENV)
// ENV = {};  // 错误
```

:::

### 4.5. 选择建议

```ts
// 使用 const：已知是常量
declare const API_BASE_URL: string
declare const MAX_RETRIES: number

// 使用 let/var：可能会改变
declare let currentLanguage: string
declare var isAuthenticated: boolean

// 对象用 const，但属性可修改
declare const window: Window & typeof globalThis
```

## 5. 如何声明复杂类型的变量？

复杂类型的变量声明需要使用接口、类型别名或内联类型。

### 5.1. 对象类型

```ts
// 内联对象类型
declare var user: {
  id: number
  name: string
  email?: string
}

// 使用接口
interface User {
  id: number
  name: string
  email?: string
}

declare var currentUser: User

// 使用类型别名
type Config = {
  apiUrl: string
  timeout: number
  retries: number
}

declare var appConfig: Config
```

### 5.2. 数组和元组

```ts
// 数组
declare var items: string[]
declare var users: Array<{ id: number; name: string }>

// 元组
declare var coordinate: [number, number]
declare var rgb: [number, number, number]

// 使用
coordinate = [10, 20]
rgb = [255, 0, 128]
```

### 5.3. 函数类型

```ts
// 函数类型变量
declare var callback: (value: string) => void
declare var validator: (input: any) => boolean
declare var transformer: <T>(value: T) => T

// 使用
callback('hello')
const isValid = validator({ name: 'test' })
const result = transformer(123)
```

### 5.4. 联合和交叉类型

```ts
// 联合类型
declare var status: 'idle' | 'loading' | 'success' | 'error'
declare var result: string | number | boolean

// 交叉类型
type BaseUser = { id: number; name: string }
type Timestamps = { createdAt: Date; updatedAt: Date }

declare var user: BaseUser & Timestamps

// 使用
user.id
user.name
user.createdAt
user.updatedAt
```

### 5.5. 泛型类型

```ts
// 泛型变量
declare var cache: Map<string, any>
declare var queue: Set<number>
declare var promise: Promise<string>

// 使用
cache.set('key', 'value')
queue.add(1)
promise.then((value) => console.log(value))
```

### 5.6. 复杂嵌套类型

```ts
// API 响应类型
declare var apiResponse: {
  data: {
    users: Array<{
      id: number
      profile: {
        name: string
        avatar: string
        settings: {
          theme: 'light' | 'dark'
          notifications: boolean
        }
      }
    }>
  }
  meta: {
    page: number
    total: number
  }
}

// 使用
apiResponse.data.users.forEach((user) => {
  console.log(user.profile.name)
  console.log(user.profile.settings.theme)
})
```

## 6. 如何声明全局变量？

全局变量的声明方式取决于运行环境。

### 6.1. 浏览器环境

```ts
// 扩展 Window 接口
declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void
    dataLayer: any[]
    APP_VERSION: string
  }
}

// 使用
window.gtag('event', 'page_view')
window.dataLayer.push({ event: 'custom' })
console.log(window.APP_VERSION)

// 也可以直接使用
gtag('config', 'GA_MEASUREMENT_ID')
```

### 6.2. Node.js 环境

```ts
// 扩展 NodeJS 命名空间
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      DATABASE_URL: string
      API_KEY: string
      PORT?: string
    }

    interface Global {
      customCache: Map<string, any>
    }
  }
}

// 使用
console.log(process.env.NODE_ENV)
console.log(process.env.DATABASE_URL)

global.customCache = new Map()
```

### 6.3. 通用全局变量

```ts
// 直接声明全局变量
declare var DEBUG: boolean
declare var VERSION: string
declare var API_ENDPOINT: string

// 使用
if (DEBUG) {
  console.log('调试模式')
}

console.log(`版本：${VERSION}`)
```

### 6.4. 第三方库的全局变量

```ts
// jQuery
declare var $: JQueryStatic
declare var jQuery: JQueryStatic

interface JQueryStatic {
  (selector: string): JQuery
  ajax(settings: any): any
}

interface JQuery {
  html(content?: string): any
  css(prop: string, value: string): JQuery
}

// 使用
$('#app').html('Hello')
jQuery.ajax({ url: '/api/data' })

// Lodash
declare var _: {
  map<T, U>(array: T[], iteratee: (value: T) => U): U[]
  filter<T>(array: T[], predicate: (value: T) => boolean): T[]
  debounce<T extends Function>(func: T, wait: number): T
}

// 使用
_.map([1, 2, 3], (x) => x * 2)
_.debounce(() => console.log('search'), 300)
```

### 6.5. 模块环境中的全局声明

```ts
// 在模块文件中声明全局变量
export {} // 标记为模块

declare global {
  var customGlobal: {
    utils: {
      formatDate(date: Date): string
      parseJson(str: string): any
    }
  }
}

// 使用
customGlobal.utils.formatDate(new Date())
```

### 6.6. 环境变量示例

```ts
// .env 文件的类型声明
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // 必需的环境变量
      DATABASE_URL: string
      JWT_SECRET: string

      // 可选的环境变量
      PORT?: string
      LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error'

      // 特定值
      NODE_ENV: 'development' | 'production' | 'test'
    }
  }
}

// 使用时有类型检查
const dbUrl = process.env.DATABASE_URL // string
const port = process.env.PORT || '3000' // string | undefined
const env = process.env.NODE_ENV // 'development' | 'production' | 'test'
```

## 7. 引用

- [TypeScript Handbook - Variable Declarations][1]
- [Declaration Files - Variables][2]
- [Global Variables][3]
- [Ambient Declarations][4]

[1]: https://www.typescriptlang.org/docs/handbook/variable-declarations.html
[2]: https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html#global-variables
[3]: https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-d-ts.html
[4]: https://www.typescriptlang.org/docs/handbook/namespaces.html#ambient-namespaces
