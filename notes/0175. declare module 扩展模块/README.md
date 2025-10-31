# [0175. declare module 扩展模块](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0175.%20declare%20module%20%E6%89%A9%E5%B1%95%E6%A8%A1%E5%9D%97)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 如何使用 declare module 声明模块？](#3--如何使用-declare-module-声明模块)
  - [3.1. 基本语法](#31-基本语法)
  - [3.2. 默认导出](#32-默认导出)
  - [3.3. 混合导出](#33-混合导出)
  - [3.4. UMD 模块](#34-umd-模块)
- [4. 🤔 如何扩展现有模块？](#4--如何扩展现有模块)
  - [4.1. 扩展第三方库](#41-扩展第三方库)
  - [4.2. 扩展 Vue](#42-扩展-vue)
  - [4.3. 扩展 Node.js 全局对象](#43-扩展-nodejs-全局对象)
  - [4.4. 扩展第三方类型](#44-扩展第三方类型)
- [5. 🤔 如何声明通配符模块？](#5--如何声明通配符模块)
  - [5.1. CSS 模块](#51-css-模块)
  - [5.2. 图片资源](#52-图片资源)
  - [5.3. JSON 文件](#53-json-文件)
  - [5.4. 其他资源](#54-其他资源)
  - [5.5. Web Worker](#55-web-worker)
  - [5.6. 实际应用示例](#56-实际应用示例)
  - [5.7. 复杂模块声明](#57-复杂模块声明)
- [6. 🔗 引用](#6--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- declare module 的基本用法
- 为没有类型的模块提供声明
- 扩展现有模块的类型
- 通配符模块声明
- 实际应用场景

## 2. 🫧 评价

declare module 是为模块提供类型声明的关键语法。

- declare module 用于为 JavaScript 模块提供类型定义
- 可以为第三方库添加缺失的类型声明
- 支持模块扩展，为现有模块添加新的类型
- 支持通配符，可以批量声明非代码资源的导入
- 是处理缺少类型定义的第三方库的主要手段

## 3. 🤔 如何使用 declare module 声明模块？

declare module 用于为模块提供类型信息。

### 3.1. 基本语法

```typescript
// 为没有类型声明的 npm 包提供类型
declare module 'some-library' {
  export function doSomething(value: string): void
  export function doAnother(value: number): number

  export interface Options {
    timeout: number
    retries: number
  }

  export class MyClass {
    constructor(options: Options)
    method(): void
  }
}

// 现在可以安全使用
import { doSomething, MyClass } from 'some-library'

doSomething('test')
const instance = new MyClass({ timeout: 5000, retries: 3 })
```

### 3.2. 默认导出

```typescript
// 声明默认导出的模块
declare module 'default-export-lib' {
  const lib: {
    version: string
    init(config: object): void
    process(data: any): any
  }

  export default lib
}

// 使用
import lib from 'default-export-lib'

console.log(lib.version)
lib.init({ apiKey: 'xxx' })
```

### 3.3. 混合导出

```typescript
// 既有命名导出又有默认导出
declare module 'mixed-exports' {
  export interface Config {
    apiUrl: string
    timeout: number
  }

  export function helper(value: string): string

  export default class MainClass {
    constructor(config: Config)
    process(): void
  }
}

// 使用
import MainClass, { Config, helper } from 'mixed-exports'

const config: Config = { apiUrl: 'https://api.example.com', timeout: 5000 }
const instance = new MainClass(config)
helper('test')
```

### 3.4. UMD 模块

```typescript
// 声明 UMD 模块（可作为模块或全局变量使用）
declare module 'umd-library' {
  export = UMDLibrary
}

declare global {
  const UMDLibrary: {
    version: string
    method(value: string): void
  }
}

// 作为模块使用
import lib from 'umd-library'
lib.method('test')

// 作为全局变量使用
UMDLibrary.method('test')
```

## 4. 🤔 如何扩展现有模块？

可以通过 declare module 扩展已有模块的类型。

### 4.1. 扩展第三方库

```typescript
// 扩展 Express 的 Request 接口
import 'express'

declare module 'express' {
  interface Request {
    // 添加自定义属性
    user?: {
      id: string
      name: string
      role: string
    }

    // 添加自定义方法
    isAuthenticated(): boolean
  }

  interface Response {
    // 添加自定义方法
    sendSuccess(data: any): void
    sendError(error: string): void
  }
}

// 现在可以使用扩展的类型
import express from 'express'

const app = express()

app.use((req, res, next) => {
  // 类型安全
  if (req.user) {
    console.log(req.user.name)
  }

  if (req.isAuthenticated()) {
    next()
  } else {
    res.sendError('Unauthorized')
  }
})
```

### 4.2. 扩展 Vue

```typescript
// 扩展 Vue 实例
import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    // 添加实例属性
    $api: {
      get(url: string): Promise<any>
      post(url: string, data: any): Promise<any>
    }

    // 添加实例方法
    $notify(message: string, type: 'success' | 'error'): void
  }
}

// 使用
export default Vue.extend({
  mounted() {
    this.$api.get('/users').then((users) => {
      console.log(users)
    })

    this.$notify('操作成功', 'success')
  },
})
```

### 4.3. 扩展 Node.js 全局对象

```typescript
// 扩展 global 对象
declare module 'global' {
  global {
    namespace NodeJS {
      interface Global {
        // 添加自定义全局变量
        appConfig: {
          env: string
          debug: boolean
        }

        // 添加全局函数
        logger: {
          info(message: string): void
          error(error: Error): void
        }
      }
    }
  }
}

// 使用
global.appConfig = {
  env: 'production',
  debug: false,
}

global.logger.info('Application started')
```

### 4.4. 扩展第三方类型

```typescript
// 扩展 lodash
import 'lodash'

declare module 'lodash' {
  interface LoDashStatic {
    // 添加自定义方法
    customMethod<T>(array: T[]): T[]
  }
}

// 使用
import _ from 'lodash'

_.customMethod([1, 2, 3])
```

## 5. 🤔 如何声明通配符模块？

通配符模块用于批量声明非代码资源。

### 5.1. CSS 模块

```typescript
// 声明 CSS 模块
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.scss' {
  const content: { [className: string]: string }
  export default content
}

// 使用
import styles from './App.module.css'
import './global.css'

const className = styles.container
```

### 5.2. 图片资源

```typescript
// 声明图片模块
declare module '*.png' {
  const value: string
  export default value
}

declare module '*.jpg' {
  const value: string
  export default value
}

declare module '*.svg' {
  import React from 'react'
  const SVG: React.FC<React.SVGProps<SVGSVGElement>>
  export default SVG
}

// 使用
import logo from './logo.png'
import avatar from './avatar.jpg'
import Icon from './icon.svg'

const img = <img src={logo} alt="Logo" />
const iconComponent = <Icon width={24} height={24} />
```

### 5.3. JSON 文件

```typescript
// 声明 JSON 模块
declare module '*.json' {
  const value: any
  export default value
}

// 或者更具体的类型
declare module '*.json' {
  const value: Record<string, any>
  export default value
}

// 使用
import config from './config.json'
import data from './data.json'

console.log(config.apiUrl)
```

### 5.4. 其他资源

```typescript
// 视频文件
declare module '*.mp4' {
  const src: string
  export default src
}

// 音频文件
declare module '*.mp3' {
  const src: string
  export default src
}

// 字体文件
declare module '*.woff' {
  const src: string
  export default src
}

declare module '*.woff2' {
  const src: string
  export default src
}

// Markdown 文件
declare module '*.md' {
  const content: string
  export default content
}

// 使用
import video from './demo.mp4'
import audio from './music.mp3'
import font from './font.woff2'
import readme from './README.md'
```

### 5.5. Web Worker

```typescript
// 声明 Worker 模块
declare module '*.worker.ts' {
  class WebpackWorker extends Worker {
    constructor()
  }

  export default WebpackWorker
}

// 使用
import Worker from './my.worker.ts'

const worker = new Worker()
worker.postMessage({ type: 'start' })
```

### 5.6. 实际应用示例

```typescript
// types/modules.d.ts

// 样式文件
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.less' {
  const content: { [className: string]: string }
  export default content
}

// 图片文件
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.svg' {
  import React from 'react'
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}

// 数据文件
declare module '*.json' {
  const value: any
  export default value
}

declare module '*.yaml' {
  const value: any
  export default value
}

// 文本文件
declare module '*.txt' {
  const content: string
  export default content
}

declare module '*.md' {
  const content: string
  export default content
}

// Webpack 特殊模块
declare module '*.worker.ts' {
  class WebpackWorker extends Worker {
    constructor()
  }
  export default WebpackWorker
}
```

### 5.7. 复杂模块声明

```typescript
// 为复杂的第三方库提供类型
declare module 'complex-library' {
  // 命名空间
  export namespace Utils {
    function formatDate(date: Date, format: string): string
    function parseDate(str: string): Date
  }

  // 接口
  export interface Options {
    timeout?: number
    retries?: number
    onSuccess?: (data: any) => void
    onError?: (error: Error) => void
  }

  // 类
  export class Client {
    constructor(options: Options)
    connect(): Promise<void>
    disconnect(): Promise<void>
    send(data: any): Promise<any>
  }

  // 类型别名
  export type Status = 'connected' | 'disconnected' | 'connecting'

  // 枚举
  export enum EventType {
    Connect = 'connect',
    Disconnect = 'disconnect',
    Error = 'error',
  }

  // 常量
  export const VERSION: string
  export const DEFAULT_TIMEOUT: number

  // 函数
  export function createClient(options: Options): Client
}
```

## 6. 🔗 引用

- [TypeScript Handbook - Modules][1]
- [Declaration Files - Module][2]
- [Module Augmentation][3]
- [Wildcard Module Declarations][4]

[1]: https://www.typescriptlang.org/docs/handbook/modules.html
[2]: https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html
[3]: https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
[4]: https://www.typescriptlang.org/docs/handbook/modules.html#wildcard-module-declarations
