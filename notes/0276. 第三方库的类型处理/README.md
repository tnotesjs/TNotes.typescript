# [0276. 第三方库的类型处理](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0276.%20%E7%AC%AC%E4%B8%89%E6%96%B9%E5%BA%93%E7%9A%84%E7%B1%BB%E5%9E%8B%E5%A4%84%E7%90%86)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. @types 包的使用？](#3-types-包的使用)
  - [3.1. 安装 @types 包](#31-安装-types-包)
  - [3.2. 自动安装类型](#32-自动安装类型)
  - [3.3. 类型版本匹配](#33-类型版本匹配)
  - [3.4. typeRoots 配置](#34-typeroots-配置)
- [4. 没有类型定义的库？](#4-没有类型定义的库)
  - [4.1. 快速解决方案](#41-快速解决方案)
  - [4.2. 基本类型声明](#42-基本类型声明)
  - [4.3. 默认导出声明](#43-默认导出声明)
  - [4.4. 命名空间声明](#44-命名空间声明)
- [5. 类型声明文件？](#5-类型声明文件)
  - [5.1. 创建 .d.ts 文件](#51-创建-dts-文件)
  - [5.2. 模块声明文件](#52-模块声明文件)
  - [5.3. 资源文件声明](#53-资源文件声明)
- [6. 模块增强？](#6-模块增强)
  - [6.1. 扩展第三方模块](#61-扩展第三方模块)
  - [6.2. 扩展全局对象](#62-扩展全局对象)
  - [6.3. 扩展库的类型](#63-扩展库的类型)
  - [6.4. 合并声明](#64-合并声明)
- [7. 发布类型定义？](#7-发布类型定义)
  - [7.1. 包内类型定义](#71-包内类型定义)
  - [7.2. 发布到 DefinitelyTyped](#72-发布到-definitelytyped)
  - [7.3. 版本管理](#73-版本管理)
  - [7.4. 测试类型定义](#74-测试类型定义)
  - [7.5. 文档和示例](#75-文档和示例)
- [8. 引用](#8-引用)

<!-- endregion:toc -->

## 1. 本节内容

- @types 包使用
- 无类型库处理
- 自定义类型声明
- 模块增强
- 发布类型定义

## 2. 评价

正确处理第三方库的类型是 TypeScript 项目开发的重要技能。

- DefinitelyTyped 生态丰富
- 类型安全保障
- 改善开发体验
- 减少运行时错误
- 社区协作

## 3. @types 包的使用？

### 3.1. 安装 @types 包

```bash
# ✅ 安装常用库的类型定义
npm install --save-dev @types/node
npm install --save-dev @types/express
npm install --save-dev @types/react
npm install --save-dev @types/lodash

# ✅ 检查是否需要类型包
npm install lodash
# 如果 TypeScript 报错，安装对应的 @types 包
npm install --save-dev @types/lodash
```

### 3.2. 自动安装类型

```json
// package.json
{
  "scripts": {
    "postinstall": "typesync"
  },
  "devDependencies": {
    "typesync": "^0.12.0"
  }
}
```

### 3.3. 类型版本匹配

```bash
# ⚠️ 注意版本对应
npm install express@4.18.0
npm install --save-dev @types/express@4.17.21

# ✅ 检查类型包版本
npm info @types/express versions
```

### 3.4. typeRoots 配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "typeRoots": ["./node_modules/@types", "./types"]
  }
}
```

## 4. 没有类型定义的库？

### 4.1. 快速解决方案

```ts
// ✅ 声明为 any 类型模块
declare module 'some-untyped-library'

// 使用
import something from 'some-untyped-library'
// something 的类型是 any
```

### 4.2. 基本类型声明

```ts
// types/some-library.d.ts

// ✅ 声明模块的基本结构
declare module 'some-library' {
  export function doSomething(value: string): number

  export class MyClass {
    constructor(config: { name: string })
    method(): void
  }

  export const VERSION: string
}
```

### 4.3. 默认导出声明

```ts
// ✅ 默认导出
declare module 'some-library' {
  interface Config {
    apiKey: string
    timeout?: number
  }

  class Library {
    constructor(config: Config)
    fetch(url: string): Promise<unknown>
  }

  export default Library
}

// 使用
import Library from 'some-library'
const lib = new Library({ apiKey: 'xxx' })
```

### 4.4. 命名空间声明

```ts
// ✅ 全局库声明
declare namespace MyLibrary {
  interface Options {
    debug: boolean
  }

  function init(options: Options): void
  function destroy(): void

  const version: string
}

// 使用
MyLibrary.init({ debug: true })
console.log(MyLibrary.version)
```

## 5. 类型声明文件？

### 5.1. 创建 .d.ts 文件

```ts
// types/custom.d.ts

// ✅ 环境声明
declare const API_URL: string
declare const VERSION: string

// ✅ 全局函数
declare function gtag(
  command: 'config' | 'event',
  targetId: string,
  config?: object
): void

// ✅ 全局变量
interface Window {
  myCustomProperty: string
}
```

### 5.2. 模块声明文件

```ts
// types/my-module.d.ts

// ✅ 完整的模块类型
declare module 'my-module' {
  export interface User {
    id: number
    name: string
  }

  export function getUser(id: number): Promise<User>
  export function updateUser(id: number, data: Partial<User>): Promise<User>

  export default class API {
    constructor(baseUrl: string)
    request<T>(path: string): Promise<T>
  }
}
```

### 5.3. 资源文件声明

```ts
// types/assets.d.ts

// ✅ 图片文件
declare module '*.png' {
  const value: string
  export default value
}

declare module '*.jpg' {
  const value: string
  export default value
}

declare module '*.svg' {
  import * as React from 'react'
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >
  const src: string
  export default src
}

// ✅ CSS 模块
declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}

// ✅ JSON 文件
declare module '*.json' {
  const value: unknown
  export default value
}
```

## 6. 模块增强？

### 6.1. 扩展第三方模块

```ts
// types/express.d.ts

// ✅ 扩展 Express Request
import 'express'

declare module 'express' {
  interface Request {
    user?: {
      id: number
      email: string
    }
  }
}

// 使用
import { Request, Response } from 'express'

app.get('/profile', (req: Request, res: Response) => {
  console.log(req.user?.email) // ✅ 有类型
})
```

### 6.2. 扩展全局对象

```ts
// types/global.d.ts

// ✅ 扩展 Window 对象
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: object) => void
    dataLayer: unknown[]
  }
}

export {} // 确保这是模块

// 使用
window.gtag('event', 'click')
```

### 6.3. 扩展库的类型

```ts
// types/lodash.d.ts

// ✅ 添加自定义方法到 lodash
import 'lodash'

declare module 'lodash' {
  interface LoDashStatic {
    customMethod(value: string): string
  }
}

// 使用
import _ from 'lodash'
_.customMethod('test') // ✅ 有类型
```

### 6.4. 合并声明

```ts
// ✅ 接口合并
interface User {
  id: number
  name: string
}

interface User {
  email: string
}

// User 现在有三个属性
const user: User = {
  id: 1,
  name: 'Tom',
  email: 'tom@example.com',
}
```

## 7. 发布类型定义？

### 7.1. 包内类型定义

```json
// package.json
{
  "name": "my-library",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"]
}
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "outDir": "dist"
  }
}
```

### 7.2. 发布到 DefinitelyTyped

```ts
// types/my-library/index.d.ts

// ✅ 类型定义
declare module 'my-library' {
  export interface Config {
    apiKey: string
  }

  export default class MyLibrary {
    constructor(config: Config)
    doSomething(): void
  }
}
```

```json
// types/my-library/tsconfig.json
{
  "compilerOptions": {
    "module": "commonjs",
    "lib": ["es6"],
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictNullChecks": true,
    "baseUrl": "../",
    "typeRoots": ["../"],
    "types": [],
    "noEmit": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### 7.3. 版本管理

```ts
// types/my-library/index.d.ts

// Type definitions for my-library 2.3
// Project: https://github.com/user/my-library
// Definitions by: Your Name <https://github.com/yourname>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

export = MyLibrary

declare class MyLibrary {
  constructor(config: MyLibrary.Config)
  doSomething(): void
}

declare namespace MyLibrary {
  interface Config {
    apiKey: string
  }
}
```

### 7.4. 测试类型定义

```ts
// types/my-library/my-library-tests.ts

import MyLibrary from 'my-library'

// ✅ 测试基本用法
const lib = new MyLibrary({ apiKey: 'test' })
lib.doSomething()

// ❌ 测试错误用法
// const lib2 = new MyLibrary({ invalid: "test" });  // Error
```

### 7.5. 文档和示例

````ts
// types/my-library/index.d.ts

/**
 * My Library - 一个示例库
 * @example
 * ```ts
 * import MyLibrary from "my-library";
 *
 * const lib = new MyLibrary({
 *   apiKey: "your-api-key"
 * });
 *
 * lib.doSomething();
 * ```
 */
export default class MyLibrary {
  /**
   * 创建一个新的实例
   * @param config - 配置对象
   */
  constructor(config: MyLibrary.Config)

  /**
   * 执行某个操作
   * @returns 操作结果
   */
  doSomething(): void
}

export namespace MyLibrary {
  /**
   * 配置选项
   */
  export interface Config {
    /**
     * API 密钥
     */
    apiKey: string

    /**
     * 超时时间（毫秒）
     * @default 5000
     */
    timeout?: number
  }
}
````

## 8. 引用

- [DefinitelyTyped][1]
- [TypeScript Module Resolution][2]
- [Publishing Declaration Files][3]

[1]: https://github.com/DefinitelyTyped/DefinitelyTyped
[2]: https://www.typescriptlang.org/docs/handbook/module-resolution.html
[3]: https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html
