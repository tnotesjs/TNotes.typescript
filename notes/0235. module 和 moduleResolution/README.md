# [0235. module 和 moduleResolution](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0235.%20module%20%E5%92%8C%20moduleResolution)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 module 选项是什么？](#3--module-选项是什么)
  - [3.1. 可选值](#31-可选值)
  - [3.2. CommonJS 格式](#32-commonjs-格式)
  - [3.3. ES2015/ES6 格式](#33-es2015es6-格式)
  - [3.4. AMD 格式](#34-amd-格式)
  - [3.5. UMD 格式](#35-umd-格式)
- [4. 🤔 moduleResolution 选项是什么？](#4--moduleresolution-选项是什么)
  - [4.1. 可选值](#41-可选值)
  - [4.2. Node 解析策略](#42-node-解析策略)
  - [4.3. Classic 解析策略](#43-classic-解析策略)
  - [4.4. Node16/NodeNext 解析](#44-node16nodenext-解析)
  - [4.5. Bundler 解析策略](#45-bundler-解析策略)
- [5. 🆚 module vs. moduleResolution](#5--module-vs-moduleresolution)
  - [5.1. 关系说明](#51-关系说明)
  - [5.2. 推荐的配置组合](#52-推荐的配置组合)
- [6. 🤔 如何选择合适的配置？](#6--如何选择合适的配置)
  - [6.1. Node.js 项目（CommonJS）](#61-nodejs-项目commonjs)
  - [6.2. Node.js 项目（ES 模块）](#62-nodejs-项目es-模块)
  - [6.3. React/Vue 项目](#63-reactvue-项目)
  - [6.4. 库项目](#64-库项目)
  - [6.5. 纯类型项目](#65-纯类型项目)
- [7. 🤔 使用时需要注意什么？](#7--使用时需要注意什么)
  - [7.1. 模块格式必须匹配运行环境](#71-模块格式必须匹配运行环境)
  - [7.2. Node16/NodeNext 必须包含扩展名](#72-node16nodenext-必须包含扩展名)
  - [7.3. esModuleInterop 建议开启](#73-esmoduleinterop-建议开启)
  - [7.4. resolveJsonModule 允许导入 JSON](#74-resolvejsonmodule-允许导入-json)
  - [7.5. 路径别名配置](#75-路径别名配置)
  - [7.6. isolatedModules 与打包工具](#76-isolatedmodules-与打包工具)
  - [7.7. 混合使用 CommonJS 和 ES 模块](#77-混合使用-commonjs-和-es-模块)
  - [7.8. package.json 的 exports 字段](#78-packagejson-的-exports-字段)
  - [7.9. 类型声明文件的位置](#79-类型声明文件的位置)
  - [7.10. 解析非 TypeScript 文件](#710-解析非-typescript-文件)
  - [7.11. 检查模块解析](#711-检查模块解析)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- module 模块系统格式
- moduleResolution 模块解析策略
- 不同模块格式的特点
- Node.js 和浏览器的模块解析
- 模块配置的最佳实践
- 常见问题和解决方案

## 2. 🫧 评价

`module` 和 `moduleResolution` 决定了 TypeScript 如何处理模块的输出格式和导入解析，是项目配置的关键选项。

- module 控制编译后的模块格式
- moduleResolution 控制如何查找模块文件
- 两者必须配合目标运行环境正确配置
- 配置错误会导致运行时模块加载失败
- Node.js 和浏览器项目配置差异较大
- 现代项目通常使用 ES 模块格式

## 3. 🤔 module 选项是什么？

`module` 指定编译后输出的模块格式。

### 3.1. 可选值

```json
{
  "compilerOptions": {
    "module": "commonjs", // Node.js 传统格式
    "module": "es6", // 等同于 es2015
    "module": "es2015", // ES 模块格式
    "module": "es2020", // ES2020 模块特性
    "module": "es2022", // ES2022 模块特性
    "module": "esnext", // 最新 ES 模块特性
    "module": "none", // 无模块系统
    "module": "amd", // AMD 格式（浏览器）
    "module": "umd", // UMD 格式（通用）
    "module": "system", // SystemJS 格式
    "module": "node16", // Node.js 16+ 格式
    "module": "nodenext" // Node.js 最新格式
  }
}
```

### 3.2. CommonJS 格式

```typescript
// 源代码
export const name = 'Alice'
export function greet() {
  console.log('Hello')
}
```

```javascript
// module: "commonjs" 输出
'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.greet = exports.name = void 0

exports.name = 'Alice'

function greet() {
  console.log('Hello')
}
exports.greet = greet
```

```typescript
// 导入
import { name, greet } from './module'

// 编译为
const module_1 = require('./module')
console.log(module_1.name)
module_1.greet()
```

### 3.3. ES2015/ES6 格式

```typescript
// 源代码
export const name = 'Alice'
export function greet() {
  console.log('Hello')
}
```

```javascript
// module: "es2015" 输出（保持原样）
export const name = 'Alice'
export function greet() {
  console.log('Hello')
}
```

```typescript
// 导入也保持原样
import { name, greet } from './module'
```

### 3.4. AMD 格式

```javascript
// module: "amd" 输出
define(['require', 'exports'], function (require, exports) {
  'use strict'
  Object.defineProperty(exports, '__esModule', { value: true })
  exports.greet = exports.name = void 0

  exports.name = 'Alice'

  function greet() {
    console.log('Hello')
  }
  exports.greet = greet
})
```

### 3.5. UMD 格式

```javascript
// module: "umd" 输出（支持多种环境）
;(function (factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    // CommonJS
    factory(require, exports)
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['require', 'exports'], factory)
  }
})(function (require, exports) {
  'use strict'
  exports.name = 'Alice'
  function greet() {
    console.log('Hello')
  }
  exports.greet = greet
})
```

## 4. 🤔 moduleResolution 选项是什么？

`moduleResolution` 指定 TypeScript 如何查找模块文件。

### 4.1. 可选值

```json
{
  "compilerOptions": {
    "moduleResolution": "node", // Node.js 解析策略
    "moduleResolution": "classic", // 经典解析策略（已废弃）
    "moduleResolution": "node16", // Node.js 16+ 解析
    "moduleResolution": "nodenext", // Node.js 最新解析
    "moduleResolution": "bundler" // 打包工具解析（TypeScript 5.0+）
  }
}
```

### 4.2. Node 解析策略

```typescript
// import { something } from "module-name";

// 解析顺序：
// 1. node_modules/module-name/package.json (查找 "types" 或 "typings")
// 2. node_modules/module-name/index.d.ts
// 3. node_modules/module-name/index.ts
// 4. node_modules/@types/module-name/index.d.ts
```

```typescript
// import { utils } from "./utils";

// 相对路径解析顺序：
// 1. ./utils.ts
// 2. ./utils.tsx
// 3. ./utils.d.ts
// 4. ./utils/index.ts
// 5. ./utils/index.tsx
// 6. ./utils/index.d.ts
```

### 4.3. Classic 解析策略

```typescript
// import { something } from "module-name";

// 解析顺序：
// 1. /root/src/module-name.ts
// 2. /root/src/module-name.d.ts
// 3. /root/module-name.ts
// 4. /root/module-name.d.ts
// 5. /module-name.ts
// 6. /module-name.d.ts

// ⚠️ 不推荐使用，已废弃
```

### 4.4. Node16/NodeNext 解析

```json
// package.json
{
  "type": "module" // 使用 ES 模块
}
```

```typescript
// 必须包含文件扩展名
import { utils } from './utils.js' // ✅ 正确
import { utils } from './utils' // ❌ 错误
```

### 4.5. Bundler 解析策略

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "module": "esnext"
  }
}
```

```typescript
// 类似 Webpack/Vite 的解析方式
import { utils } from './utils' // ✅ 可以省略扩展名
import styles from './styles.css' // ✅ 可以导入非 TS 文件
import data from './data.json' // ✅ 支持 JSON 导入
```

## 5. 🆚 module vs. moduleResolution

| 对比项       | module             | moduleResolution |
| ------------ | ------------------ | ---------------- |
| 作用         | 控制输出的模块格式 | 控制如何查找模块 |
| 影响编译输出 | 影响               | 不影响           |
| 影响类型检查 | 不影响             | 影响             |
| 运行时       | 影响运行时代码     | 仅编译时使用     |
| 默认值       | 根据 target 推断   | 根据 module 推断 |

### 5.1. 关系说明

```json
{
  "compilerOptions": {
    // module 决定输出格式
    "module": "commonjs",

    // moduleResolution 决定如何查找
    "moduleResolution": "node"
  }
}
```

```typescript
// 源代码
import { helper } from './helper'
import * as lodash from 'lodash'

// module: "commonjs" - 输出格式
const helper_1 = require('./helper')
const lodash = require('lodash')

// moduleResolution: "node" - 查找位置
// 1. ./helper.ts
// 2. node_modules/lodash/index.js
// 3. node_modules/@types/lodash/index.d.ts
```

### 5.2. 推荐的配置组合

```json
// Node.js 传统项目
{
  "compilerOptions": {
    "module": "commonjs",
    "moduleResolution": "node"
  }
}

// Node.js 16+ ES 模块项目
{
  "compilerOptions": {
    "module": "node16",
    "moduleResolution": "node16"
  }
}

// 浏览器项目（使用打包工具）
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "bundler"
  }
}

// 库项目
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "node"
  }
}
```

## 6. 🤔 如何选择合适的配置？

### 6.1. Node.js 项目（CommonJS）

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

```typescript
// 使用 require 和 module.exports
const express = require('express')
module.exports = app

// 也可以使用 ES 模块语法，编译为 CommonJS
import express from 'express'
export default app
```

### 6.2. Node.js 项目（ES 模块）

```json
// package.json
{
  "type": "module"
}

// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "node16",
    "moduleResolution": "node16"
  }
}
```

```typescript
// 必须使用 .js 扩展名
import { utils } from './utils.js'
export { helper } from './helper.js'
```

### 6.3. React/Vue 项目

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "lib": ["ES2020", "DOM"]
  }
}
```

```typescript
// Webpack/Vite 会处理模块
import React from 'react'
import styles from './App.module.css'
import { Button } from '@/components/Button'
```

### 6.4. 库项目

```json
{
  "compilerOptions": {
    "target": "ES2015",
    "module": "esnext",
    "moduleResolution": "node",
    "declaration": true,
    "outDir": "./dist"
  }
}
```

```typescript
// 输出 ES 模块，让使用者选择打包方式
export { createApp } from './app'
export type { AppOptions } from './types'
```

### 6.5. 纯类型项目

```json
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "bundler",
    "noEmit": true // 不输出文件
  }
}
```

## 7. 🤔 使用时需要注意什么？

### 7.1. 模块格式必须匹配运行环境

```json
// ❌ 错误配置
{
  "compilerOptions": {
    "module": "es2015" // Node.js 不支持 ES 模块（旧版本）
  }
}
```

```bash
# 运行时错误
node dist/index.js
# Error: Unexpected token 'export'
```

```json
// ✅ 正确配置
{
  "compilerOptions": {
    "module": "commonjs" // Node.js 支持 CommonJS
  }
}
```

### 7.2. Node16/NodeNext 必须包含扩展名

```typescript
// module: "node16"

// ❌ 错误
import { utils } from './utils'

// ✅ 正确
import { utils } from './utils.js' // 即使源文件是 .ts

// ✅ 正确
import type { User } from './types.js'
```

### 7.3. esModuleInterop 建议开启

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "esModuleInterop": true // ✅ 推荐开启
  }
}
```

```typescript
// esModuleInterop: true
import React from 'react' // ✅ 可以使用默认导入

// esModuleInterop: false
import * as React from 'react' // ❌ 必须使用命名空间导入
```

### 7.4. resolveJsonModule 允许导入 JSON

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "resolveJsonModule": true // 允许导入 JSON
  }
}
```

```typescript
// ✅ 可以导入 JSON 文件
import config from './config.json'
console.log(config.apiUrl)
```

### 7.5. 路径别名配置

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"]
    }
  }
}
```

```typescript
// ✅ TypeScript 可以解析
import { Button } from '@components/Button'

// ⚠️ 运行时需要配置
// Node.js 需要 tsconfig-paths
// Webpack 需要配置 resolve.alias
```

### 7.6. isolatedModules 与打包工具

```json
{
  "compilerOptions": {
    "isolatedModules": true // Babel/SWC 需要
  }
}
```

```typescript
// ❌ 错误：isolatedModules 不允许
export { SomeType } // 仅导出类型

// ✅ 正确
export type { SomeType } // 明确标记为类型导出
```

### 7.7. 混合使用 CommonJS 和 ES 模块

```typescript
// 在 ES 模块中使用 CommonJS 模块
import express from 'express' // CommonJS 模块

// 需要 esModuleInterop: true
```

```typescript
// 在 CommonJS 中使用 ES 模块（动态导入）
async function loadModule() {
  const { default: chalk } = await import('chalk') // ES 模块
  console.log(chalk.blue('Hello'))
}
```

### 7.8. package.json 的 exports 字段

```json
// package.json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  }
}
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "node16" // 支持 package.json exports
  }
}
```

### 7.9. 类型声明文件的位置

```json
// package.json
{
  "types": "./dist/index.d.ts", // 类型入口
  "typings": "./dist/index.d.ts" // 同 types
}
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "declaration": true, // 生成 .d.ts
    "declarationDir": "./dist" // 声明文件目录
  }
}
```

### 7.10. 解析非 TypeScript 文件

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowArbitraryExtensions": true // 允许任意扩展名
  }
}
```

```typescript
// ✅ 可以导入
import styles from './App.module.css'
import data from './data.json'
import template from './template.html'
```

### 7.11. 检查模块解析

```bash
# 查看模块解析过程
tsc --traceResolution

# 输出详细的模块查找信息
```

## 8. 🔗 引用

- [TypeScript Module Resolution][1]
- [TypeScript Modules Documentation][2]
- [Node.js ECMAScript Modules][3]

[1]: https://www.typescriptlang.org/docs/handbook/module-resolution.html
[2]: https://www.typescriptlang.org/docs/handbook/modules.html
[3]: https://nodejs.org/api/esm.html
