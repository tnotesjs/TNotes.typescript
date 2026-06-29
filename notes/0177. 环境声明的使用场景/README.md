# [0177. 环境声明的使用场景](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0177.%20%E7%8E%AF%E5%A2%83%E5%A3%B0%E6%98%8E%E7%9A%84%E4%BD%BF%E7%94%A8%E5%9C%BA%E6%99%AF)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 什么时候需要环境声明?](#3-什么时候需要环境声明)
  - [3.1. 常见场景](#31-常见场景)
  - [3.2. 判断流程](#32-判断流程)
  - [3.3. 不需要环境声明的情况](#33-不需要环境声明的情况)
- [4. 如何为第三方库添加类型？](#4-如何为第三方库添加类型)
  - [4.1. 检查 @types 包](#41-检查-types-包)
  - [4.2. 创建类型声明文件](#42-创建类型声明文件)
  - [4.3. 实际案例：jQuery](#43-实际案例jquery)
  - [4.4. 实际案例：Web Component](#44-实际案例web-component)
- [5. 如何处理全局脚本？](#5-如何处理全局脚本)
  - [5.1. 内联脚本变量](#51-内联脚本变量)
  - [5.2. CDN 脚本](#52-cdn-脚本)
  - [5.3. 环境变量注入](#53-环境变量注入)
  - [5.4. Vite 环境变量](#54-vite-环境变量)
- [6. 如何迁移 JavaScript 项目？](#6-如何迁移-javascript-项目)
  - [6.1. 阶段 1：启用基础配置](#61-阶段-1启用基础配置)
  - [6.2. 阶段 2：添加基础类型](#62-阶段-2添加基础类型)
  - [6.3. 阶段 3：逐步严格化](#63-阶段-3逐步严格化)
  - [6.4. 阶段 4：完整类型化](#64-阶段-4完整类型化)
- [7. 实际项目中的最佳实践是什么？](#7-实际项目中的最佳实践是什么)
  - [7.1. 目录结构](#71-目录结构)
  - [7.2. 类型声明文件组织](#72-类型声明文件组织)
  - [7.3. 类型声明最佳实践](#73-类型声明最佳实践)
  - [7.4. 维护和更新策略](#74-维护和更新策略)
- [8. 引用](#8-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 环境声明的使用时机
- 第三方库类型处理
- 全局脚本的类型声明
- JavaScript 迁移策略
- 类型声明的最佳实践

## 2. 评价

环境声明是 TypeScript 与 JavaScript 生态系统集成的关键技术。

- 环境声明用于为没有类型的代码提供类型信息
- 主要用于第三方库、全局脚本、遗留代码的类型化
- 通过 declare 关键字声明，不产生实际代码
- 应当优先使用 @types 包，无法满足时才编写自定义声明
- 良好的类型声明能显著提升开发体验和代码质量

## 3. 什么时候需要环境声明?

识别需要环境声明的场景。

### 3.1. 常见场景

```ts
// 场景 1：第三方库没有类型定义
// ❌ 找不到模块"some-library"的声明文件
import someLib from 'some-library'

// ✅ 添加环境声明
// types/some-library.d.ts
declare module 'some-library' {
  export default function someLib(config: any): void
}

// 场景 2：使用全局变量
// ❌ 找不到名称"jQuery"
$('#app').html('Hello')

// ✅ 声明全局变量
declare const $: any
declare const jQuery: any

// 场景 3：HTML 中的内联脚本定义了全局对象
// ❌ 找不到名称"APP_CONFIG"
console.log(APP_CONFIG.apiUrl)

// ✅ 声明全局对象
declare const APP_CONFIG: {
  apiUrl: string
  version: string
}

// 场景 4：Webpack 等工具注入的全局变量
// ❌ 找不到名称"process"
if (process.env.NODE_ENV === 'production') {
  // ...
}

// ✅ 声明环境变量
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'
    }
  }
}
```

### 3.2. 判断流程

```ts
// 决策树
/**
 * 是否需要环境声明？
 *
 * 1. 是否是第三方库？
 *    是 → 检查 @types 包
 *         有 @types 包 → 安装 @types 包
 *         无 @types 包 → 编写 declare module
 *
 * 2. 是否是全局变量/函数？
 *    是 → 使用 declare const/function/namespace
 *
 * 3. 是否是模块？
 *    是 → 使用 declare module
 *
 * 4. 是否需要扩展已有类型？
 *    是 → 使用 declare module 或 declare global
 *
 * 5. 是否是类型定义？
 *    是 → 使用 interface/type（不需要 declare）
 */
```

### 3.3. 不需要环境声明的情况

```ts
// ❌ 不要对自己的代码使用 declare
// 错误示例
declare function myFunction(): void // ❌ 应该直接实现

// ✅ 直接实现
export function myFunction(): void {
  // 实现
}

// ❌ 不要对已有类型的库使用 declare
// 错误示例
declare module 'react' {
  // ❌ React 已有官方类型
  // ...
}

// ✅ 直接使用
import React from 'react' // 类型已存在

// ❌ 不要声明 TypeScript 内置类型
// 错误示例
declare interface Array<T> {
  // ❌ Array 是内置类型
  myMethod(): void
}

// ✅ 使用接口扩展
interface Array<T> {
  myMethod(): void
}
```

## 4. 如何为第三方库添加类型？

处理没有类型定义的第三方库。

### 4.1. 检查 @types 包

```bash
# 1. 首先检查是否有 @types 包
npm search @types/库名

# 2. 如果有，直接安装
npm install -D @types/lodash

# 3. 如果没有，需要自己编写类型定义
```

### 4.2. 创建类型声明文件

```ts
// types/library-name.d.ts

// 方案 1：简单声明（快速原型）
declare module 'library-name' {
  const lib: any
  export default lib
}

// 方案 2：部分类型（只声明使用的部分）
declare module 'library-name' {
  export interface Options {
    timeout?: number
    retries?: number
  }

  export function request(url: string, options?: Options): Promise<any>
  export function get(url: string): Promise<any>
  export function post(url: string, data: any): Promise<any>
}

// 方案 3：完整类型（生产级别）
declare module 'library-name' {
  // 配置接口
  export interface RequestConfig {
    url: string
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    headers?: Record<string, string>
    timeout?: number
    data?: any
  }

  // 响应接口
  export interface Response<T = any> {
    data: T
    status: number
    statusText: string
    headers: Record<string, string>
  }

  // 错误类
  export class RequestError extends Error {
    constructor(message: string, code?: string)
    code?: string
    response?: Response
  }

  // 主类
  export class HttpClient {
    constructor(config?: Partial<RequestConfig>)
    request<T = any>(config: RequestConfig): Promise<Response<T>>
    get<T = any>(
      url: string,
      config?: Partial<RequestConfig>,
    ): Promise<Response<T>>
    post<T = any>(
      url: string,
      data?: any,
      config?: Partial<RequestConfig>,
    ): Promise<Response<T>>
  }

  // 默认导出
  const client: HttpClient
  export default client
}
```

### 4.3. 实际案例：jQuery

```ts
// types/jquery.d.ts
declare const jQuery: JQueryStatic
declare const $: JQueryStatic

interface JQueryStatic {
  (selector: string): JQuery
  ajax(settings: JQueryAjaxSettings): JQueryXHR
  get(url: string, success?: (data: any) => void): JQueryXHR
  post(url: string, data?: any, success?: (data: any) => void): JQueryXHR
}

interface JQuery {
  html(): string
  html(content: string): JQuery
  text(): string
  text(content: string): JQuery
  css(propertyName: string): string
  css(propertyName: string, value: string): JQuery
  on(event: string, handler: (event: Event) => void): JQuery
  off(event: string): JQuery
  addClass(className: string): JQuery
  removeClass(className: string): JQuery
}

interface JQueryAjaxSettings {
  url?: string
  method?: string
  data?: any
  success?: (data: any) => void
  error?: (xhr: JQueryXHR, status: string, error: string) => void
}

interface JQueryXHR {
  then(success: (data: any) => void, error?: (error: any) => void): JQueryXHR
  done(callback: (data: any) => void): JQueryXHR
  fail(callback: (error: any) => void): JQueryXHR
}
```

### 4.4. 实际案例：Web Component

```ts
// types/my-component.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    'my-button': MyButtonAttributes
    'my-modal': MyModalAttributes
  }
}

interface MyButtonAttributes {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  onClick?: (event: CustomEvent) => void
}

interface MyModalAttributes {
  open?: boolean
  title?: string
  onClose?: (event: CustomEvent) => void
}

// 使用
// <my-button variant="primary" size="large" />
// <my-modal open={true} title="Dialog" />
```

## 5. 如何处理全局脚本？

为全局脚本提供类型声明。

### 5.1. 内联脚本变量

```ts
// public/index.html
/**
 * <script>
 *   window.APP_CONFIG = {
 *     apiUrl: 'https://api.example.com',
 *     version: '1.0.0'
 *   };
 * </script>
 */

// types/global.d.ts
export {}

declare global {
  interface Window {
    APP_CONFIG: {
      apiUrl: string
      version: string
      features?: {
        analytics: boolean
        experimental: boolean
      }
    }
  }
}

// 使用
const apiUrl = window.APP_CONFIG.apiUrl
```

### 5.2. CDN 脚本

```ts
// index.html 引入了 CDN 脚本
/**
 * <script src="https://cdn.example.com/analytics.js"></script>
 */

// types/analytics.d.ts
declare global {
  interface Window {
    analytics: {
      track(event: string, properties?: Record<string, any>): void
      identify(userId: string, traits?: Record<string, any>): void
      page(name?: string, properties?: Record<string, any>): void
    }
  }
}

// 使用
window.analytics.track('Page Viewed', {
  page: 'Home',
  referrer: document.referrer,
})
```

### 5.3. 环境变量注入

```ts
// Webpack DefinePlugin 或 Vite define 注入的变量
// types/env.d.ts

declare const __DEV__: boolean
declare const __PROD__: boolean
declare const __VERSION__: string
declare const __BUILD_TIME__: string

// 使用
if (__DEV__) {
  console.log('Development mode')
  console.log('Version:', __VERSION__)
  console.log('Built at:', __BUILD_TIME__)
}
```

### 5.4. Vite 环境变量

```ts
// types/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_SOCKET_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// 使用
const apiUrl = import.meta.env.VITE_API_URL
const title = import.meta.env.VITE_APP_TITLE
```

## 6. 如何迁移 JavaScript 项目？

渐进式迁移策略。

### 6.1. 阶段 1：启用基础配置

```json
// tsconfig.json - 宽松配置
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "allowJs": true, // 允许 JS 文件
    "checkJs": false, // 暂不检查 JS
    "strict": false, // 暂不启用严格模式
    "noImplicitAny": false, // 允许隐式 any
    "skipLibCheck": true // 跳过库检查
  }
}
```

### 6.2. 阶段 2：添加基础类型

```ts
// 1. 为全局变量添加类型
// types/global.d.ts
declare const API_URL: string
declare const VERSION: string

declare global {
  interface Window {
    $: any // 暂时使用 any
    gtag: any
  }
}

// 2. 为第三方库添加基础类型
// types/legacy-lib.d.ts
declare module 'legacy-lib' {
  const lib: any // 暂时使用 any
  export default lib
}

// 3. 为旧代码添加类型
// utils/old-utils.js → utils/old-utils.d.ts
export function formatDate(date: Date): string
export function parseJSON(str: string): any
```

### 6.3. 阶段 3：逐步严格化

```json
// tsconfig.json - 逐步严格
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true, // ✅ 开始检查 JS
    "strict": false,
    "noImplicitAny": true, // ✅ 禁止隐式 any
    "strictNullChecks": false // 暂不检查 null
  }
}
```

```ts
// 改进类型声明
// types/global.d.ts
declare const API_URL: string
declare const VERSION: string

declare global {
  interface Window {
    // ✅ 提供具体类型
    $: JQueryStatic
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: Record<string, any>,
    ) => void
  }
}

// types/legacy-lib.d.ts
declare module 'legacy-lib' {
  // ✅ 提供部分类型
  export interface Config {
    timeout?: number
  }

  export function init(config: Config): void
  export function process(data: any): any
}
```

### 6.4. 阶段 4：完整类型化

```json
// tsconfig.json - 严格模式
{
  "compilerOptions": {
    "strict": true, // ✅ 完全严格
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

```ts
// 完整类型定义
// types/legacy-lib.d.ts
declare module 'legacy-lib' {
  export interface Config {
    timeout: number
    retries?: number
    onSuccess?: (result: Result) => void
    onError?: (error: Error) => void
  }

  export interface Result {
    status: 'success' | 'failure'
    data: any
    timestamp: number
  }

  export function init(config: Config): void
  export function process<T = any>(data: any): Promise<Result>
  export function reset(): void

  export default {
    init,
    process,
    reset,
  }
}
```

## 7. 实际项目中的最佳实践是什么？

类型声明的组织和管理。

### 7.1. 目录结构

```
project/
├── src/
│   ├── types/              # 项目类型定义
│   │   ├── index.ts       # 导出所有类型
│   │   ├── api.ts         # API 相关类型
│   │   ├── models.ts      # 数据模型类型
│   │   └── utils.ts       # 工具类型
│   └── ...
├── types/                  # 环境声明
│   ├── global.d.ts        # 全局类型
│   ├── modules.d.ts       # 模块声明
│   ├── env.d.ts           # 环境变量
│   └── vendor/            # 第三方库类型
│       ├── library-a.d.ts
│       └── library-b.d.ts
└── tsconfig.json
```

### 7.2. 类型声明文件组织

```ts
// types/global.d.ts - 全局类型
export {}

declare global {
  // 环境变量
  const __DEV__: boolean
  const __VERSION__: string

  // Window 扩展
  interface Window {
    APP_CONFIG: AppConfig
    analytics?: AnalyticsInstance
  }

  // 全局命名空间
  namespace App {
    interface User {
      id: string
      name: string
      email: string
    }

    interface Config {
      apiUrl: string
      features: Record<string, boolean>
    }
  }
}

// 类型别名
type AppConfig = App.Config

// types/modules.d.ts - 模块声明
// 样式模块
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}

// 资源模块
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

// 第三方库
declare module 'untyped-library' {
  export function doSomething(value: string): void
}

// types/env.d.ts - 环境变量
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_ENABLE_MOCK: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// types/vendor/jquery.d.ts - 第三方库
declare const $: JQueryStatic
// ... jQuery 类型定义
```

### 7.3. 类型声明最佳实践

````ts
// ✅ 推荐：组织清晰
// types/api.d.ts
export {}

declare global {
  namespace API {
    interface User {
      id: string
      username: string
      email: string
    }

    interface UserResponse {
      data: User
      status: number
      message: string
    }

    namespace Auth {
      interface LoginRequest {
        username: string
        password: string
      }

      interface LoginResponse {
        token: string
        user: User
      }
    }
  }
}

// ✅ 推荐：版本化管理
// types/vendor/library-name.d.ts
/**
 * Type definitions for library-name v2.0.0
 * Project: https://github.com/org/library-name
 * Definitions by: Your Name <https://github.com/yourusername>
 */

declare module 'library-name' {
  // 类型定义...
}

// ✅ 推荐：文档注释
declare global {
  /**
   * 全局应用配置
   * @example
   * ```ts
   * const apiUrl = window.APP_CONFIG.apiUrl;
   * ```
   */
  interface Window {
    APP_CONFIG: {
      /** API 基础 URL */
      apiUrl: string
      /** 应用版本号 */
      version: string
      /** 是否启用调试模式 */
      debug: boolean
    }
  }
}

// ❌ 避免：过于宽泛
declare module '*' {
  // ❌ 不要这样做
  const content: any
  export default content
}

// ❌ 避免：重复声明
// file1.d.ts
declare const VERSION: string

// file2.d.ts
declare const VERSION: string // ❌ 重复声明会报错
````

### 7.4. 维护和更新策略

```ts
// 1. 版本管理
/**
 * 在类型声明文件中记录版本信息
 */
// types/vendor/library-name.d.ts
/**
 * Type definitions for library-name v2.0.0
 * Last updated: 2024-01-01
 *
 * Changes:
 * - v2.0.0: Added new method xyz()
 * - v1.5.0: Deprecated method abc()
 */

// 2. TODO 标记
declare module 'partial-types' {
  // TODO: 完善返回类型
  export function someMethod(): any

  // TODO: 添加泛型支持
  export function anotherMethod(data: any): void
}

// 3. 注释说明
declare global {
  interface Window {
    // FIXME: 应该使用更具体的类型而不是 any
    legacyApi: any

    // NOTE: 这个属性由旧的全局脚本注入
    oldGlobalVar: string
  }
}

// 4. 贡献指南
/**
 * 如何添加新的类型声明:
 *
 * 1. 在 types/vendor/ 目录下创建新文件
 * 2. 使用 declare module 'library-name' 包裹
 * 3. 添加必要的注释和示例
 * 4. 在 PR 中说明变更原因
 */
```

## 8. 引用

- [TypeScript Handbook - Declaration Files][1]
- [DefinitelyTyped Repository][2]
- [Publishing Declaration Files][3]
- [Declaration File Best Practices][4]

[1]: https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html
[2]: https://github.com/DefinitelyTyped/DefinitelyTyped
[3]: https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html
[4]: https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html
