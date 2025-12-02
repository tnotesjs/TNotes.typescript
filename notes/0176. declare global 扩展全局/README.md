# [0176. declare global 扩展全局](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0176.%20declare%20global%20%E6%89%A9%E5%B1%95%E5%85%A8%E5%B1%80)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 declare global 的作用是什么？](#3--declare-global-的作用是什么)
  - [3.1. 基本语法](#31-基本语法)
  - [3.2. 为什么需要 declare global](#32-为什么需要-declare-global)
  - [3.3. 与普通 declare 的区别](#33-与普通-declare-的区别)
- [4. 🤔 如何扩展浏览器全局对象？](#4--如何扩展浏览器全局对象)
  - [4.1. 扩展 Window 对象](#41-扩展-window-对象)
  - [4.2. 扩展 Document 对象](#42-扩展-document-对象)
  - [4.3. 扩展 globalThis](#43-扩展-globalthis)
  - [4.4. 扩展 Navigator](#44-扩展-navigator)
  - [4.5. 添加全局事件类型](#45-添加全局事件类型)
- [5. 🤔 如何扩展 Node.js 全局对象？](#5--如何扩展-nodejs-全局对象)
  - [5.1. 扩展 global 对象](#51-扩展-global-对象)
  - [5.2. 扩展 process 对象](#52-扩展-process-对象)
  - [5.3. 扩展 console](#53-扩展-console)
  - [5.4. 扩展 Buffer](#54-扩展-buffer)
- [6. 🤔 模块内如何使用 declare global？](#6--模块内如何使用-declare-global)
  - [6.1. 基本模式](#61-基本模式)
  - [6.2. 多个声明块](#62-多个声明块)
  - [6.3. 结合类型导出](#63-结合类型导出)
  - [6.4. 实际应用示例](#64-实际应用示例)
  - [6.5. Vue 插件示例](#65-vue-插件示例)
  - [6.6. React Context 全局化](#66-react-context-全局化)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- declare global 的基本概念
- 扩展浏览器全局对象
- 扩展 Node.js 全局对象
- 在模块中使用 declare global
- 实际应用场景

## 2. 🫧 评价

declare global 用于在模块文件中向全局作用域添加类型声明。

- declare global 必须在模块文件中使用
- 用于扩展 Window、Document、globalThis 等全局对象
- 可以添加全局变量、函数、接口等
- 常用于为全局脚本、polyfill、第三方库添加类型
- 是连接模块系统与全局作用域的桥梁

## 3. 🤔 declare global 的作用是什么？

declare global 用于在模块文件中向全局作用域添加声明。

### 3.1. 基本语法

```ts
// 在模块文件中使用 declare global
export {} // 使文件成为模块

declare global {
  // 添加全局变量
  const APP_VERSION: string

  // 添加全局函数
  function debugLog(message: string): void

  // 添加全局接口
  interface Window {
    myCustomProperty: string
  }
}

// 现在可以全局使用
console.log(APP_VERSION)
debugLog('test')
window.myCustomProperty = 'value'
```

### 3.2. 为什么需要 declare global

::: code-group

```ts [❌ 错误：非模块文件]
// 在非模块文件中直接声明全局
const APP_VERSION: string // ❌ 这会创建模块级别的声明，不是全局的

interface Window {
  myProperty: string // ❌ 这不会扩展全局 Window
}
```

```ts [✅ 正确：使用 declare global]
// global.d.ts
export {} // 重要：使文件成为模块

declare global {
  const APP_VERSION: string

  interface Window {
    myProperty: string
  }
}

// 现在在任何文件中都可以使用
console.log(APP_VERSION)
window.myProperty = 'test'
```

:::

### 3.3. 与普通 declare 的区别

```ts
// types/global.d.ts
export {}

// 普通 declare - 声明全局命名空间
declare namespace MyLib {
  function doSomething(): void
}

// declare global - 扩展全局对象
declare global {
  // 扩展 Window
  interface Window {
    MyLib: typeof MyLib
  }

  // 添加全局变量
  const ENV: 'development' | 'production'
}

// 使用
MyLib.doSomething() // 通过命名空间
window.MyLib.doSomething() // 通过 Window
console.log(ENV) // 直接访问全局变量
```

## 4. 🤔 如何扩展浏览器全局对象？

常见的浏览器全局对象扩展场景。

### 4.1. 扩展 Window 对象

```ts
// types/window.d.ts
export {}

declare global {
  interface Window {
    // 添加全局配置
    APP_CONFIG: {
      apiUrl: string
      debug: boolean
      version: string
    }

    // 添加第三方库
    gtag?: (command: 'config' | 'event', targetId: string, config?: any) => void

    // 添加自定义方法
    showNotification(message: string, type: 'info' | 'error'): void

    // 添加数据层
    dataLayer?: any[]
  }
}

// 使用
window.APP_CONFIG = {
  apiUrl: 'https://api.example.com',
  debug: true,
  version: '1.0.0',
}

window.showNotification('操作成功', 'info')

if (window.gtag) {
  window.gtag('event', 'page_view')
}
```

### 4.2. 扩展 Document 对象

```ts
export {}

declare global {
  interface Document {
    // 添加自定义属性
    theme: 'light' | 'dark'

    // 添加自定义方法
    setTitle(title: string): void
  }
}

// 使用
document.theme = 'dark'
document.setTitle('My App - Home')
```

### 4.3. 扩展 globalThis

```ts
export {}

declare global {
  // globalThis 在浏览器和 Node.js 中都可用
  var globalThis: typeof globalThis & {
    // 添加环境变量
    ENV: {
      NODE_ENV: 'development' | 'production' | 'test'
      API_URL: string
    }

    // 添加全局工具
    utils: {
      formatDate(date: Date): string
      parseJSON<T>(str: string): T | null
    }
  }
}

// 使用
globalThis.ENV = {
  NODE_ENV: 'production',
  API_URL: 'https://api.example.com',
}

const formatted = globalThis.utils.formatDate(new Date())
```

### 4.4. 扩展 Navigator

```ts
export {}

declare global {
  interface Navigator {
    // 添加实验性 API
    getBattery?(): Promise<{
      level: number
      charging: boolean
    }>

    // 添加自定义属性
    customProperty: string
  }
}

// 使用
if (navigator.getBattery) {
  navigator.getBattery().then((battery) => {
    console.log(`电池电量: ${battery.level * 100}%`)
  })
}
```

### 4.5. 添加全局事件类型

```ts
export {}

declare global {
  // 添加自定义事件
  interface WindowEventMap {
    'app:ready': CustomEvent<{ version: string }>
    'user:login': CustomEvent<{ userId: string }>
    'user:logout': CustomEvent
  }

  interface Window {
    addEventListener<K extends keyof WindowEventMap>(
      type: K,
      listener: (this: Window, ev: WindowEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions
    ): void
  }
}

// 使用
window.addEventListener('app:ready', (event) => {
  console.log('App version:', event.detail.version)
})

window.dispatchEvent(
  new CustomEvent('app:ready', {
    detail: { version: '1.0.0' },
  })
)
```

## 5. 🤔 如何扩展 Node.js 全局对象？

Node.js 环境下的全局对象扩展。

### 5.1. 扩展 global 对象

```ts
// types/global.d.ts
export {}

declare global {
  namespace NodeJS {
    interface Global {
      // 添加应用配置
      appConfig: {
        port: number
        env: string
        dbUrl: string
      }

      // 添加日志工具
      logger: {
        info(message: string, meta?: any): void
        error(error: Error, meta?: any): void
        warn(message: string, meta?: any): void
      }

      // 添加缓存
      cache: Map<string, any>
    }
  }

  // 简化访问
  var appConfig: NodeJS.Global['appConfig']
  var logger: NodeJS.Global['logger']
  var cache: NodeJS.Global['cache']
}

// 使用
global.appConfig = {
  port: 3000,
  env: 'production',
  dbUrl: 'mongodb://localhost:27017',
}

logger.info('Server started', { port: appConfig.port })
cache.set('user:1', { name: 'John' })
```

### 5.2. 扩展 process 对象

```ts
export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // 声明环境变量
      NODE_ENV: 'development' | 'production' | 'test'
      PORT: string
      DATABASE_URL: string
      API_KEY: string
      SECRET_KEY: string

      // 可选环境变量
      DEBUG?: string
      LOG_LEVEL?: 'info' | 'warn' | 'error'
    }

    interface Process {
      // 添加自定义属性
      isDevelopment: boolean
      isProduction: boolean
    }
  }
}

// 使用
const port = parseInt(process.env.PORT, 10)
const dbUrl = process.env.DATABASE_URL

// 类型安全
process.isDevelopment = process.env.NODE_ENV === 'development'
```

### 5.3. 扩展 console

```ts
export {}

declare global {
  interface Console {
    // 添加自定义日志方法
    success(message: string, ...args: any[]): void
    debug(message: string, ...args: any[]): void

    // 添加分组日志
    group(label: string): void
    groupEnd(): void
  }
}

// 实现
console.success = (message, ...args) => {
  console.log('✅', message, ...args)
}

// 使用
console.success('操作成功', { id: 1 })
```

### 5.4. 扩展 Buffer

```ts
export {}

declare global {
  interface BufferConstructor {
    // 添加静态方法
    fromBase64(str: string): Buffer
    toBase64(buffer: Buffer): string
  }

  interface Buffer {
    // 添加实例方法
    toJSON(): { type: 'Buffer'; data: number[] }
  }
}

// 实现
Buffer.fromBase64 = (str: string) => Buffer.from(str, 'base64')
Buffer.toBase64 = (buffer: Buffer) => buffer.toString('base64')

// 使用
const buffer = Buffer.fromBase64('SGVsbG8=')
const base64 = Buffer.toBase64(buffer)
```

## 6. 🤔 模块内如何使用 declare global？

在模块文件中正确使用 declare global。

### 6.1. 基本模式

```ts
// utils/global-setup.ts

// 导出某些内容，使其成为模块
export const setupGlobals = () => {
  // 设置全局变量
  window.APP_VERSION = '1.0.0'
}

// 声明全局类型
declare global {
  interface Window {
    APP_VERSION: string
  }
}
```

### 6.2. 多个声明块

```ts
// types/global.d.ts
export {}

// 第一个全局声明块
declare global {
  interface Window {
    myLib: {
      init(): void
      destroy(): void
    }
  }
}

// 第二个全局声明块
declare global {
  const VERSION: string

  function trackEvent(name: string, data?: any): void
}

// 第三个全局声明块
declare global {
  namespace App {
    interface User {
      id: string
      name: string
    }

    interface Config {
      apiUrl: string
    }
  }
}
```

### 6.3. 结合类型导出

```ts
// types/index.ts

// 导出类型供模块使用
export interface User {
  id: string
  name: string
  email: string
}

export interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

// 同时扩展全局
declare global {
  interface Window {
    // 使用导出的类型
    currentUser: User | null

    // 全局 API 客户端
    api: {
      get<T>(url: string): Promise<ApiResponse<T>>
      post<T>(url: string, data: any): Promise<ApiResponse<T>>
    }
  }
}
```

### 6.4. 实际应用示例

```ts
// src/plugins/analytics.ts

export interface AnalyticsConfig {
  trackingId: string
  debug?: boolean
}

export class Analytics {
  constructor(private config: AnalyticsConfig) {}

  trackPageView(path: string): void {
    console.log('Track page view:', path)
  }

  trackEvent(event: string, data?: any): void {
    console.log('Track event:', event, data)
  }
}

// 扩展全局 Window
declare global {
  interface Window {
    analytics: Analytics
  }
}

// 初始化函数
export function setupAnalytics(config: AnalyticsConfig): void {
  window.analytics = new Analytics(config)
}

// 使用
// main.ts
import { setupAnalytics } from './plugins/analytics'

setupAnalytics({ trackingId: 'UA-XXXXX-Y' })

// 在任何地方使用
window.analytics.trackPageView('/home')
window.analytics.trackEvent('button_click', { buttonId: 'submit' })
```

### 6.5. Vue 插件示例

```ts
// plugins/toast.ts
import Vue from 'vue'

export interface ToastOptions {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

export class Toast {
  show(options: ToastOptions): void {
    console.log('Show toast:', options)
  }
}

// 扩展 Vue 实例
declare module 'vue/types/vue' {
  interface Vue {
    $toast: Toast
  }
}

// 同时扩展全局
declare global {
  interface Window {
    $toast: Toast
  }
}

// Vue 插件
export default {
  install(vue: typeof Vue): void {
    const toast = new Toast()
    vue.prototype.$toast = toast
    window.$toast = toast
  },
}
```

### 6.6. React Context 全局化

```ts
// context/AppContext.tsx
import React from 'react'

export interface AppContextValue {
  user: User | null
  theme: 'light' | 'dark'
  setTheme(theme: 'light' | 'dark'): void
}

interface User {
  id: string
  name: string
}

export const AppContext = React.createContext<AppContextValue>(
  {} as AppContextValue
)

// 导出 hook
export const useApp = () => React.useContext(AppContext)

// 扩展全局，方便调试
declare global {
  interface Window {
    __APP_CONTEXT__: AppContextValue
  }
}

// Provider
export const AppProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light')
  const [user, setUser] = React.useState<User | null>(null)

  const value: AppContextValue = {
    user,
    theme,
    setTheme,
  }

  // 调试时暴露到全局
  if (process.env.NODE_ENV === 'development') {
    window.__APP_CONTEXT__ = value
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
```

## 7. 🔗 引用

- [TypeScript Handbook - Global Augmentation][1]
- [Declaration Merging - Global Augmentation][2]
- [Modules - Global Augmentation][3]

[1]: https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html
[2]: https://www.typescriptlang.org/docs/handbook/declaration-merging.html#global-augmentation
[3]: https://www.typescriptlang.org/docs/handbook/modules.html#global-augmentation
