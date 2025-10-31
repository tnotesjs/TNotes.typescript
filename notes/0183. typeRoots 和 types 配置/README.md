# [0183. typeRoots 和 types 配置](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0183.%20typeRoots%20%E5%92%8C%20types%20%E9%85%8D%E7%BD%AE)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 typeRoots 配置的作用是什么？](#3--typeroots-配置的作用是什么)
  - [3.1. 默认行为](#31-默认行为)
  - [3.2. 自定义 typeRoots](#32-自定义-typeroots)
  - [3.3. 相对路径与绝对路径](#33-相对路径与绝对路径)
  - [3.4. 覆盖默认行为](#34-覆盖默认行为)
  - [3.5. 实际应用场景](#35-实际应用场景)
- [4. 🤔 types 配置的作用是什么？](#4--types-配置的作用是什么)
  - [4.1. 默认行为](#41-默认行为)
  - [4.2. 指定类型包](#42-指定类型包)
  - [4.3. 空数组配置](#43-空数组配置)
  - [4.4. 实际应用场景](#44-实际应用场景)
- [5. 🤔 typeRoots 和 types 的区别是什么？](#5--typeroots-和-types-的区别是什么)
  - [5.1. 核心区别](#51-核心区别)
  - [5.2. 对比表格](#52-对比表格)
  - [5.3. 组合使用](#53-组合使用)
  - [5.4. 使用决策](#54-使用决策)
  - [5.5. 常见配置模式](#55-常见配置模式)
- [6. 🤔 如何配置多个类型目录？](#6--如何配置多个类型目录)
  - [6.1. Monorepo 配置](#61-monorepo-配置)
  - [6.2. 分层类型管理](#62-分层类型管理)
  - [6.3. 多配置文件](#63-多配置文件)
  - [6.4. 动态类型加载](#64-动态类型加载)
  - [6.5. 调试配置](#65-调试配置)
  - [6.6. 最佳实践](#66-最佳实践)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- typeRoots 配置项的作用
- types 配置项的作用
- typeRoots 与 types 的区别
- 多类型目录的配置
- 实际应用场景

## 2. 🫧 评价

typeRoots 和 types 是控制 TypeScript 类型定义加载的重要配置项。

- typeRoots 指定类型定义文件的查找目录
- types 指定要包含的类型包列表
- 理解两者的区别对于大型项目的类型管理很重要
- 默认情况下不需要配置，TypeScript 会自动查找 @types 目录
- 正确配置可以优化编译性能和避免类型冲突

## 3. 🤔 typeRoots 配置的作用是什么？

typeRoots 指定类型声明文件的根目录。

### 3.1. 默认行为

```json
// tsconfig.json
// 不配置 typeRoots 时的默认行为
{
  "compilerOptions": {
    // 默认值：["./node_modules/@types"]
    // TypeScript 会自动查找 node_modules/@types 下的所有包
  }
}
```

```typescript
// 默认情况下，所有 @types 包都会被自动包含
// node_modules/@types/node/index.d.ts      ✅ 自动包含
// node_modules/@types/react/index.d.ts     ✅ 自动包含
// node_modules/@types/lodash/index.d.ts    ✅ 自动包含

import { readFile } from 'fs' // 使用 @types/node
import React from 'react' // 使用 @types/react
import _ from 'lodash' // 使用 @types/lodash
```

### 3.2. 自定义 typeRoots

```json
// tsconfig.json
{
  "compilerOptions": {
    "typeRoots": [
      "./node_modules/@types", // npm @types 包
      "./types", // 项目自定义类型
      "./typings" // 第三方类型
    ]
  }
}
```

```typescript
// 项目结构
/**
 * project/
 * ├── node_modules/
 * │   └── @types/
 * │       ├── node/
 * │       └── react/
 * ├── types/            ← 自定义类型目录
 * │   ├── global.d.ts
 * │   └── custom-lib/
 * │       └── index.d.ts
 * ├── typings/          ← 第三方类型目录
 * │   └── legacy-lib/
 * │       └── index.d.ts
 * └── tsconfig.json
 */

// types/global.d.ts
declare const APP_VERSION: string

// types/custom-lib/index.d.ts
declare module 'custom-lib' {
  export function doSomething(): void
}

// typings/legacy-lib/index.d.ts
declare module 'legacy-lib' {
  export function oldMethod(): void
}

// 使用
import 'custom-lib'
import 'legacy-lib'
console.log(APP_VERSION)
```

### 3.3. 相对路径与绝对路径

```json
// tsconfig.json
{
  "compilerOptions": {
    // 相对路径（相对于 tsconfig.json 文件）
    "typeRoots": ["./node_modules/@types", "./types"],

    // 绝对路径
    "typeRoots": [
      "/Users/username/project/node_modules/@types",
      "/Users/username/project/types"
    ]
  }
}
```

### 3.4. 覆盖默认行为

```json
// ⚠️ 一旦配置了 typeRoots，默认的 node_modules/@types 不会自动包含
{
  "compilerOptions": {
    "typeRoots": [
      "./types"  // ❌ 只会查找 ./types，不会查找 node_modules/@types
    ]
  }
}

// ✅ 正确做法：显式包含 node_modules/@types
{
  "compilerOptions": {
    "typeRoots": [
      "./node_modules/@types",  // ✅ 必须显式包含
      "./types"
    ]
  }
}
```

### 3.5. 实际应用场景

```json
// 场景 1：monorepo 项目
{
  "compilerOptions": {
    "typeRoots": [
      "./node_modules/@types",
      "./packages/shared/types",  // 共享类型
      "./types"                   // 项目特定类型
    ]
  }
}

// 场景 2：多环境类型隔离
{
  "compilerOptions": {
    "typeRoots": [
      "./node_modules/@types",
      "./types/common",    // 通用类型
      "./types/browser"    // 浏览器环境类型
      // 不包含 ./types/node（Node.js 环境）
    ]
  }
}

// 场景 3：Legacy 项目迁移
{
  "compilerOptions": {
    "typeRoots": [
      "./node_modules/@types",
      "./types",           // 新的类型定义
      "./legacy-types"     // 旧的类型定义
    ]
  }
}
```

## 4. 🤔 types 配置的作用是什么？

types 指定要包含的具体类型包。

### 4.1. 默认行为

```json
// tsconfig.json
// 不配置 types 时的默认行为
{
  "compilerOptions": {
    // 默认：包含 typeRoots 下的所有类型包
  }
}
```

```typescript
// 默认情况下，typeRoots 下的所有包都会被包含
// node_modules/@types/node     ✅ 包含
// node_modules/@types/react    ✅ 包含
// node_modules/@types/jest     ✅ 包含
// node_modules/@types/lodash   ✅ 包含
```

### 4.2. 指定类型包

```json
// tsconfig.json
{
  "compilerOptions": {
    "types": [
      "node", // 只包含 @types/node
      "jest" // 只包含 @types/jest
    ]
    // ❌ @types/react 不会被包含
    // ❌ @types/lodash 不会被包含
  }
}
```

```typescript
// ✅ 可以使用 @types/node
import { readFile } from 'fs'

// ✅ 可以使用 @types/jest
describe('test', () => {
  it('works', () => {
    expect(true).toBe(true)
  })
})

// ❌ 不能使用 @types/react（因为没有在 types 中指定）
import React from 'react' // ❌ 错误：找不到模块
```

### 4.3. 空数组配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "types": [] // 不自动包含任何 @types 包
  }
}
```

```typescript
// ❌ 所有 @types 包都不会自动包含
import { readFile } from 'fs' // ❌ 找不到类型
import React from 'react' // ❌ 找不到类型

// ✅ 可以通过三斜线指令手动引入
/// <reference types="node" />

import { readFile } from 'fs' // ✅ 现在可以用了
```

### 4.4. 实际应用场景

```json
// 场景 1：Node.js 项目（不需要浏览器类型）
{
  "compilerOptions": {
    "types": [
      "node"
    ]
  }
}

// 场景 2：浏览器项目（不需要 Node.js 类型）
{
  "compilerOptions": {
    "types": []  // 不包含 @types/node，避免 Node.js 类型污染
  }
}

// 场景 3：测试文件配置
// tsconfig.test.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "types": [
      "node",
      "jest"  // 测试文件需要 jest 类型
    ]
  }
}

// 场景 4：多环境配置
// tsconfig.browser.json
{
  "compilerOptions": {
    "types": []  // 纯浏览器环境
  }
}

// tsconfig.node.json
{
  "compilerOptions": {
    "types": ["node"]  // Node.js 环境
  }
}
```

## 5. 🤔 typeRoots 和 types 的区别是什么？

两个配置项的对比和使用场景。

### 5.1. 核心区别

```json
// typeRoots：WHERE to look（在哪里查找）
{
  "compilerOptions": {
    "typeRoots": [
      "./node_modules/@types",  // 查找目录 1
      "./types"                  // 查找目录 2
    ]
  }
}

// types：WHAT to include（包含什么）
{
  "compilerOptions": {
    "types": [
      "node",   // 包含 node
      "jest"    // 包含 jest
    ]
  }
}
```

### 5.2. 对比表格

| 特性     | typeRoots                   | types                     |
| -------- | --------------------------- | ------------------------- |
| 作用     | 指定类型定义的查找目录      | 指定要包含的类型包        |
| 默认值   | `["./node_modules/@types"]` | 包含 typeRoots 下的所有包 |
| 配置后   | 覆盖默认查找路径            | 只包含指定的包            |
| 适用场景 | 添加自定义类型目录          | 精确控制包含的类型        |
| 常见用途 | monorepo、自定义类型        | 环境隔离、性能优化        |

### 5.3. 组合使用

```json
// 同时配置 typeRoots 和 types
{
  "compilerOptions": {
    // 1. 先在这些目录中查找
    "typeRoots": ["./node_modules/@types", "./types"],
    // 2. 然后只包含这些包
    "types": [
      "node",
      "custom-lib" // 来自 ./types/custom-lib
    ]
  }
}
```

### 5.4. 使用决策

```typescript
/**
 * 何时使用 typeRoots？
 *
 * ✅ 需要添加自定义类型目录
 * ✅ monorepo 项目需要共享类型
 * ✅ 需要从非标准位置加载类型
 */

// 示例：添加共享类型目录
{
  "compilerOptions": {
    "typeRoots": [
      "./node_modules/@types",
      "./shared/types"
    ]
  }
}

/**
 * 何时使用 types？
 *
 * ✅ 需要精确控制包含的类型
 * ✅ 避免环境类型污染（Node.js vs Browser）
 * ✅ 优化编译性能（减少类型检查）
 * ✅ 解决类型冲突
 */

// 示例：Node.js 项目
{
  "compilerOptions": {
    "types": ["node"]  // 只包含 Node.js 类型
  }
}
```

### 5.5. 常见配置模式

::: code-group

```json [模式 1：默认配置（推荐）]
// 不配置，使用默认行为
{
  "compilerOptions": {
    // typeRoots: ["./node_modules/@types"]（默认）
    // types: 所有包（默认）
  }
}
```

```json [模式 2：添加自定义目录]
{
  "compilerOptions": {
    "typeRoots": ["./node_modules/@types", "./types"]
    // types: 默认包含所有
  }
}
```

```json [模式 3：环境隔离]
{
  "compilerOptions": {
    "types": ["node"] // 只包含 Node.js
  }
}
```

```json [模式 4：完全控制]
{
  "compilerOptions": {
    "typeRoots": ["./node_modules/@types", "./types"],
    "types": ["node", "custom-lib"]
  }
}
```

:::

## 6. 🤔 如何配置多个类型目录？

复杂项目的类型目录管理。

### 6.1. Monorepo 配置

```json
// packages/shared/tsconfig.json
{
  "compilerOptions": {
    "typeRoots": [
      "../../node_modules/@types",  // 根目录的 @types
      "./types"                      // 共享类型
    ]
  }
}

// packages/app/tsconfig.json
{
  "compilerOptions": {
    "typeRoots": [
      "../../node_modules/@types",
      "../shared/types",  // 引用共享类型
      "./types"           // 应用特定类型
    ]
  }
}
```

### 6.2. 分层类型管理

```json
// tsconfig.json
{
  "compilerOptions": {
    "typeRoots": [
      "./node_modules/@types", // 第三方类型
      "./types/global", // 全局类型
      "./types/modules", // 模块类型
      "./types/assets" // 资源类型
    ]
  }
}
```

```typescript
// 目录结构
/**
 * types/
 * ├── global/
 * │   ├── window.d.ts      // 全局 Window 扩展
 * │   └── process.d.ts     // 全局 Process 扩展
 * ├── modules/
 * │   ├── custom-lib/
 * │   │   └── index.d.ts   // 自定义模块类型
 * │   └── legacy-lib/
 * │       └── index.d.ts
 * └── assets/
 *     ├── images.d.ts      // 图片资源类型
 *     └── styles.d.ts      // 样式资源类型
 */

// types/global/window.d.ts
declare global {
  interface Window {
    APP_CONFIG: {
      apiUrl: string
    }
  }
}

export {}

// types/modules/custom-lib/index.d.ts
declare module 'custom-lib' {
  export function doSomething(): void
}

// types/assets/images.d.ts
declare module '*.png' {
  const src: string
  export default src
}
```

### 6.3. 多配置文件

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "typeRoots": [
      "./node_modules/@types",
      "./types/common"
    ]
  }
}

// tsconfig.browser.json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "typeRoots": [
      "./node_modules/@types",
      "./types/common",
      "./types/browser"  // 浏览器特定类型
    ],
    "types": []  // 不包含 Node.js 类型
  }
}

// tsconfig.node.json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "typeRoots": [
      "./node_modules/@types",
      "./types/common",
      "./types/node"  // Node.js 特定类型
    ],
    "types": ["node"]
  }
}
```

### 6.4. 动态类型加载

```json
// tsconfig.json
{
  "compilerOptions": {
    "typeRoots": ["./node_modules/@types", "./types"]
  }
}
```

```typescript
// 文件级别动态引入
/// <reference types="node" />
/// <reference path="./types/custom.d.ts" />

import { readFile } from 'fs'
```

### 6.5. 调试配置

```bash
# 查看 TypeScript 加载的文件
tsc --listFiles

# 查看类型解析过程
tsc --traceResolution

# 验证配置
tsc --showConfig
```

```json
// 输出示例
{
  "compilerOptions": {
    "typeRoots": ["./node_modules/@types", "./types"]
  },
  "files": [
    "./node_modules/@types/node/index.d.ts",
    "./types/global.d.ts",
    "./src/index.ts"
  ]
}
```

### 6.6. 最佳实践

```json
// ✅ 推荐配置
{
  "compilerOptions": {
    // 1. 保持简单，使用默认配置
    // 不配置 typeRoots 和 types

    // 2. 或者只添加必要的自定义目录
    "typeRoots": [
      "./node_modules/@types",
      "./types"
    ]

    // 3. 只在必要时使用 types
    // 如：环境隔离、性能优化
  }
}

// ❌ 避免过度配置
{
  "compilerOptions": {
    "typeRoots": [
      "./node_modules/@types",
      "./types",
      "./typings",
      "./declarations",
      "./type-definitions",
      // ... 过多目录
    ],
    "types": [
      "node",
      "react",
      "jest",
      // ... 过多包
    ]
  }
}
```

## 7. 🔗 引用

- [TypeScript Compiler Options - typeRoots][1]
- [TypeScript Compiler Options - types][2]
- [Module Resolution][3]
- [Declaration Files][4]

[1]: https://www.typescriptlang.org/tsconfig#typeRoots
[2]: https://www.typescriptlang.org/tsconfig#types
[3]: https://www.typescriptlang.org/docs/handbook/module-resolution.html
[4]: https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html
