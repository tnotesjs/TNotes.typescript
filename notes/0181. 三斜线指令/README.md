# [0181. 三斜线指令](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0181.%20%E4%B8%89%E6%96%9C%E7%BA%BF%E6%8C%87%E4%BB%A4)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是三斜线指令？](#3--什么是三斜线指令)
  - [3.1. 基本语法](#31-基本语法)
  - [3.2. 使用规则](#32-使用规则)
  - [3.3. 作用域](#33-作用域)
- [4. 🤔 如何使用 reference path 指令？](#4--如何使用-reference-path-指令)
  - [4.1. 基本用法](#41-基本用法)
  - [4.2. 引用多个文件](#42-引用多个文件)
  - [4.3. 相对路径](#43-相对路径)
  - [4.4. 使用场景](#44-使用场景)
  - [4.5. 与 import 的对比](#45-与-import-的对比)
- [5. 🤔 如何使用 reference types 指令？](#5--如何使用-reference-types-指令)
  - [5.1. 基本用法](#51-基本用法)
  - [5.2. 引用多个类型包](#52-引用多个类型包)
  - [5.3. 在 tsconfig.json 中配置](#53-在-tsconfigjson-中配置)
  - [5.4. 实际应用场景](#54-实际应用场景)
  - [5.5. 禁用自动引用](#55-禁用自动引用)
- [6. 🤔 如何使用 reference lib 指令？](#6--如何使用-reference-lib-指令)
  - [6.1. 基本用法](#61-基本用法)
  - [6.2. 引用特定功能库](#62-引用特定功能库)
  - [6.3. 常用库类型](#63-常用库类型)
  - [6.4. 实际应用](#64-实际应用)
  - [6.5. 与 tsconfig.json 的关系](#65-与-tsconfigjson-的关系)
- [7. 🤔 其他三斜线指令有哪些？](#7--其他三斜线指令有哪些)
  - [7.1. reference no-default-lib](#71-reference-no-default-lib)
  - [7.2. amd-module](#72-amd-module)
  - [7.3. amd-dependency](#73-amd-dependency)
  - [7.4. 实际应用示例](#74-实际应用示例)
  - [7.5. 使用建议](#75-使用建议)
  - [7.6. 最佳实践](#76-最佳实践)
  - [7.7. 调试技巧](#77-调试技巧)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 三斜线指令的概念和语法
- reference path 指令的使用
- reference types 指令的使用
- reference lib 指令的使用
- 其他三斜线指令
- 使用注意事项

## 2. 🫧 评价

三斜线指令是 TypeScript 中用于声明文件依赖关系的特殊注释。

- 三斜线指令必须放在文件顶部，之前只能有注释
- 主要用于声明文件之间的依赖关系
- 现代项目中更推荐使用 ES6 import 语句
- 在某些特殊场景下仍然有用，比如引用库类型定义
- 理解三斜线指令有助于维护旧项目和理解类型声明文件

## 3. 🤔 什么是三斜线指令？

三斜线指令的基本概念。

### 3.1. 基本语法

```typescript
/// <reference path="..." />
/// <reference types="..." />
/// <reference lib="..." />
/// <reference no-default-lib="true"/>
```

### 3.2. 使用规则

```typescript
// ✅ 正确：三斜线指令必须在文件顶部
/// <reference types="node" />

import { readFile } from 'fs'

// ❌ 错误：不能放在代码之后
import { readFile } from 'fs'

/// <reference types="node" /> // ❌ 无效

// ✅ 正确：可以有多个三斜线指令
/// <reference types="node" />
/// <reference types="jest" />
/// <reference lib="es2020" />

import { readFile } from 'fs'

// ✅ 正确：之前可以有注释
/**
 * 文件说明
 */

/// <reference types="node" />

import { readFile } from 'fs'
```

### 3.3. 作用域

```typescript
// 三斜线指令只影响当前文件
// file1.d.ts
/// <reference types="node" />

// 这里可以使用 Node.js 类型
export function readConfig(): Buffer

// file2.d.ts
// 这里无法使用 Node.js 类型（除非也添加三斜线指令）
export function processData(): void // ❌ Buffer 未定义
```

## 4. 🤔 如何使用 reference path 指令？

reference path 用于引用其他声明文件。

### 4.1. 基本用法

```typescript
// types/models.d.ts
export interface User {
  id: string
  name: string
}

export interface Post {
  id: string
  title: string
}

// types/api.d.ts
/// <reference path="./models.d.ts" />

// 现在可以使用 models.d.ts 中的类型
export function getUser(id: string): Promise<User>
export function getPost(id: string): Promise<Post>
```

### 4.2. 引用多个文件

```typescript
// types/index.d.ts
/// <reference path="./models.d.ts" />
/// <reference path="./api.d.ts" />
/// <reference path="./utils.d.ts" />

// 汇总所有类型定义
```

### 4.3. 相对路径

```typescript
// 项目结构
/**
 * types/
 * ├── core/
 * │   └── base.d.ts
 * ├── api/
 * │   └── user.d.ts
 * └── index.d.ts
 */

// types/api/user.d.ts
/// <reference path="../core/base.d.ts" />

export interface UserAPI extends BaseAPI {
  getUser(id: string): Promise<User>
}

// types/index.d.ts
/// <reference path="./core/base.d.ts" />
/// <reference path="./api/user.d.ts" />
```

### 4.4. 使用场景

```typescript
// 场景 1：全局声明文件
// types/global.d.ts
/// <reference path="./jquery.d.ts" />
/// <reference path="./lodash.d.ts" />

declare global {
  // 扩展全局对象
  interface Window {
    $: JQueryStatic
    _: LoDashStatic
  }
}

// 场景 2：出口文件
// index.d.ts
/// <reference path="./types/models.d.ts" />
/// <reference path="./types/api.d.ts" />

export * from './types/models'
export * from './types/api'
```

### 4.5. 与 import 的对比

::: code-group

```typescript [使用 reference path]
// types/api.d.ts
/// <reference path="./models.d.ts" />

// User 类型会被隐式导入到全局作用域
export function getUser(id: string): Promise<User>
```

```typescript [使用 import]
// types/api.d.ts
import { User } from './models'

// 需要显式导入类型
export function getUser(id: string): Promise<User>
```

:::

## 5. 🤔 如何使用 reference types 指令？

reference types 用于引用 @types 包。

### 5.1. 基本用法

```typescript
// 引用 @types/node 包
/// <reference types="node" />

// 现在可以使用 Node.js 类型
import { readFile } from 'fs'
import { Server } from 'http'

export function createServer(): Server {
  // 实现
}
```

### 5.2. 引用多个类型包

```typescript
// types/test.d.ts
/// <reference types="node" />
/// <reference types="jest" />
/// <reference types="express" />

// 现在可以使用这些库的类型
import { Server } from 'http'
import { describe, it, expect } from '@jest/globals'
import { Request, Response } from 'express'
```

### 5.3. 在 tsconfig.json 中配置

::: code-group

```typescript [使用三斜线指令]
// types/global.d.ts
/// <reference types="node" />
/// <reference types="jest" />

// 每个文件都需要添加
```

```json [使用 tsconfig.json（推荐）]
{
  "compilerOptions": {
    "types": ["node", "jest"]
  }
}

// 所有文件自动拥有这些类型
```

:::

### 5.4. 实际应用场景

```typescript
// 场景 1：测试文件
// test/user.test.ts
/// <reference types="jest" />

describe('User', () => {
  it('should create user', () => {
    expect(true).toBe(true)
  })
})

// 场景 2：Node.js 脚本
// scripts/build.ts
/// <reference types="node" />

import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const content = readFileSync(resolve(__dirname, 'template.txt'), 'utf-8')
writeFileSync(resolve(__dirname, 'output.txt'), content)

// 场景 3：库声明文件
// types/my-library.d.ts
/// <reference types="node" />

declare module 'my-library' {
  import { EventEmitter } from 'events'

  export class MyClass extends EventEmitter {
    // ...
  }
}
```

### 5.5. 禁用自动引用

```json
// tsconfig.json
{
  "compilerOptions": {
    // 禁用所有 @types 的自动引用
    "types": []
  }
}
```

```typescript
// 需要显式引用
/// <reference types="node" />
/// <reference types="jest" />
```

## 6. 🤔 如何使用 reference lib 指令？

reference lib 用于引用内置库类型定义。

### 6.1. 基本用法

```typescript
// 引用 ES2015 库
/// <reference lib="es2015" />

// 现在可以使用 ES2015 特性
const promise = new Promise((resolve) => {
  resolve(42)
})

const map = new Map<string, number>()
```

### 6.2. 引用特定功能库

```typescript
// 引用 DOM 类型
/// <reference lib="dom" />

// 现在可以使用 DOM API
const element = document.getElementById('app')
element?.addEventListener('click', () => {
  console.log('clicked')
})

// 引用 WebWorker 类型
/// <reference lib="webworker" />

// 现在可以使用 Web Worker API
self.addEventListener('message', (event) => {
  console.log(event.data)
})
```

### 6.3. 常用库类型

```typescript
// ES 标准库
/// <reference lib="es5" />
/// <reference lib="es2015" />
/// <reference lib="es2016" />
/// <reference lib="es2017" />
/// <reference lib="es2018" />
/// <reference lib="es2019" />
/// <reference lib="es2020" />
/// <reference lib="esnext" />

// 分离的 ES 特性库
/// <reference lib="es2015.promise" />
/// <reference lib="es2015.proxy" />
/// <reference lib="es2015.reflect" />
/// <reference lib="es2015.symbol" />
/// <reference lib="es2016.array.include" />
/// <reference lib="es2017.object" />
/// <reference lib="es2017.string" />

// 环境库
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="webworker" />
/// <reference lib="scripthost" />
```

### 6.4. 实际应用

```typescript
// 场景 1：Node.js 环境（不需要 DOM）
/// <reference lib="es2020" />

// 不引用 DOM 库，避免误用浏览器 API
export function processData(data: string): string {
  // document.getElementById('app'); // ❌ 错误：找不到 document
  return data.toUpperCase()
}

// 场景 2：浏览器环境
/// <reference lib="es2020" />
/// <reference lib="dom" />

// 可以使用浏览器 API
export function initApp(): void {
  const app = document.getElementById('app')
  app?.innerHTML = '<h1>Hello</h1>'
}

// 场景 3：Web Worker
/// <reference lib="webworker" />

// Web Worker 上下文
self.addEventListener('message', (event: MessageEvent) => {
  const result = processData(event.data)
  self.postMessage(result)
})

function processData(data: any): any {
  // 处理逻辑
  return data
}
```

### 6.5. 与 tsconfig.json 的关系

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"] // 全局配置
  }
}
```

```typescript
// 文件级别可以覆盖全局配置
/// <reference lib="es2015" />

// 这个文件只使用 ES2015 特性
```

## 7. 🤔 其他三斜线指令有哪些？

其他特殊的三斜线指令。

### 7.1. reference no-default-lib

```typescript
// 禁用默认库
/// <reference no-default-lib="true"/>

// 不会自动包含任何库类型定义
// 需要手动引入所需的库

/// <reference lib="es2015.core" />
/// <reference lib="es2015.promise" />

// 只有这些特定的库可用
```

### 7.2. amd-module

```typescript
// 为 AMD 模块指定模块名
/// <amd-module name="my-module" />

export function hello() {
  return 'Hello'
}

// 编译后的 AMD 模块会使用指定的名称
// define("my-module", ["require", "exports"], ...)
```

### 7.3. amd-dependency

```typescript
// 声明 AMD 依赖
/// <amd-dependency path="legacy-lib" />

export function useLib() {
  // 使用 legacy-lib
}
```

### 7.4. 实际应用示例

```typescript
// 场景 1：创建轻量级声明文件
/// <reference no-default-lib="true"/>
/// <reference lib="es2015.core" />
/// <reference lib="es2015.promise" />

// 只包含必要的类型定义
export function asyncOperation(): Promise<void>

// 场景 2：AMD 模块命名
/// <amd-module name="app/utils" />

export function format(str: string): string {
  return str.trim()
}

// 场景 3：引用外部 AMD 依赖
/// <amd-dependency path="jquery" name="$" />

declare const $: any

export function initUI() {
  $('#app').html('Hello')
}
```

### 7.5. 使用建议

```typescript
// ✅ 现代项目推荐：使用 ES6 模块
import { User } from './models'
import type { ApiResponse } from './types'

export function getUser(): Promise<ApiResponse<User>> {
  // 实现
}

// ⚠️ 特殊场景可以使用三斜线指令
/// <reference types="node" />
/// <reference lib="dom" />

// 但大多数情况下应该在 tsconfig.json 中配置
```

### 7.6. 最佳实践

```typescript
// ❌ 避免：过度使用三斜线指令
/// <reference path="./a.d.ts" />
/// <reference path="./b.d.ts" />
/// <reference path="./c.d.ts" />
/// <reference types="node" />
/// <reference types="jest" />
/// <reference lib="dom" />

// ✅ 推荐：在 tsconfig.json 中统一配置
// tsconfig.json
{
  "compilerOptions": {
    "types": ["node", "jest"],
    "lib": ["ES2020", "DOM"]
  }
}

// 使用 ES6 import
import { something } from './a';
```

### 7.7. 调试技巧

```typescript
// 查看编译器加载的文件
// tsc --listFiles

// 输出示例：
// node_modules/typescript/lib/lib.es2020.d.ts
// node_modules/@types/node/index.d.ts
// src/index.ts
// src/types.d.ts

// 检查三斜线指令是否生效
/// <reference types="node" />

// 使用 --traceResolution 查看模块解析
// tsc --traceResolution
```

## 8. 🔗 引用

- [TypeScript Handbook - Triple-Slash Directives][1]
- [Declaration Files - Triple-Slash Directives][2]
- [tsconfig.json - types][3]
- [Module Resolution][4]

[1]: https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html
[2]: https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html#triple-slash-directives
[3]: https://www.typescriptlang.org/tsconfig#types
[4]: https://www.typescriptlang.org/docs/handbook/module-resolution.html
