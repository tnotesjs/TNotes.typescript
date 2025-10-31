# [0261. tsc --outDir 和 --outFile](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0261.%20tsc%20--outDir%20%E5%92%8C%20--outFile)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 --outDir 的作用？](#3----outdir-的作用)
  - [3.1. 基本用法](#31-基本用法)
  - [3.2. 目录结构保持](#32-目录结构保持)
  - [3.3. 配置文件使用](#33-配置文件使用)
  - [3.4. rootDir 配合使用](#34-rootdir-配合使用)
  - [3.5. 实际示例](#35-实际示例)
  - [3.6. 清理输出目录](#36-清理输出目录)
- [4. 🤔 --outFile 的作用？](#4----outfile-的作用)
  - [4.1. 基本用法](#41-基本用法)
  - [4.2. 模块限制](#42-模块限制)
  - [4.3. AMD 模块示例](#43-amd-模块示例)
  - [4.4. System 模块示例](#44-system-模块示例)
  - [4.5. 使用限制](#45-使用限制)
- [5. 🆚 --outDir vs. --outFile？](#5----outdir-vs---outfile)
  - [5.1. 功能对比](#51-功能对比)
  - [5.2. 输出对比](#52-输出对比)
  - [5.3. 配置示例](#53-配置示例)
- [6. 🤔 如何选择使用？](#6--如何选择使用)
  - [6.1. 选择流程](#61-选择流程)
  - [6.2. 推荐配置](#62-推荐配置)
  - [6.3. 不推荐配置](#63-不推荐配置)
  - [6.4. 最佳实践](#64-最佳实践)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- --outDir 参数
- --outFile 参数
- 两者对比
- 使用场景

## 2. 🫧 评价

`--outDir` 和 `--outFile` 控制编译输出位置，适用于不同的构建场景。

- --outDir 用于多文件输出
- --outFile 用于单文件打包
- 保持目录结构 vs. 合并文件
- 现代项目多用 --outDir
- 了解限制避免错误使用

## 3. 🤔 --outDir 的作用？

`--outDir` 指定编译输出的目录，保持源文件的目录结构。

### 3.1. 基本用法

```bash
# 输出到 dist 目录
tsc --outDir dist

# 输出到多级目录
tsc --outDir build/output
```

### 3.2. 目录结构保持

```text
源代码结构：
src/
├── index.ts
├── utils/
│   ├── helper.ts
│   └── format.ts
└── types/
    └── custom.ts

编译后（tsc --outDir dist）：
dist/
├── index.js
├── utils/
│   ├── helper.js
│   └── format.js
└── types/
    └── custom.js

✅ 目录结构完全保持
```

### 3.3. 配置文件使用

```json
// tsconfig.json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

```bash
# 使用配置文件
tsc
```

### 3.4. rootDir 配合使用

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src" // ✅ 确定源代码根目录
  }
}
```

```text
不指定 rootDir：
src/
  index.ts        → dist/src/index.js  ❌ 多了 src 层级

指定 rootDir：
src/
  index.ts        → dist/index.js      ✅ 正确映射
```

### 3.5. 实际示例

```typescript
// src/index.ts
import { greet } from './utils/helper'

console.log(greet('TypeScript'))

// src/utils/helper.ts
export function greet(name: string): string {
  return `Hello, ${name}!`
}
```

```bash
tsc --outDir dist --rootDir src
```

```javascript
// dist/index.js
var helper_1 = require('./utils/helper')
console.log((0, helper_1.greet)('TypeScript'))

// dist/utils/helper.js
exports.greet = greet
function greet(name) {
  return 'Hello, ' + name + '!'
}
```

### 3.6. 清理输出目录

```json
// package.json
{
  "scripts": {
    "clean": "rm -rf dist",
    "build": "npm run clean && tsc --outDir dist"
  }
}
```

## 4. 🤔 --outFile 的作用？

`--outFile` 将所有文件合并输出到单个文件中。

### 4.1. 基本用法

```bash
# 合并输出到单个文件
tsc --outFile bundle.js

# 完整路径
tsc --outFile dist/bundle.js
```

### 4.2. 模块限制

```text
⚠️ 只支持以下模块系统：
- AMD
- System

❌ 不支持：
- CommonJS
- ES6 模块
- UMD
```

### 4.3. AMD 模块示例

```bash
# 必须指定 AMD 模块
tsc --outFile bundle.js --module amd
```

```typescript
// file1.ts
export const message = 'Hello'

// file2.ts
export const value = 42

// file3.ts
import { message } from './file1'
import { value } from './file2'

console.log(message, value)
```

编译后：

```javascript
// bundle.js
define('file1', ['require', 'exports'], function (require, exports) {
  exports.message = 'Hello'
})
define('file2', ['require', 'exports'], function (require, exports) {
  exports.value = 42
})
define('file3', ['require', 'exports', './file1', './file2'], function (
  require,
  exports,
  file1_1,
  file2_1
) {
  console.log(file1_1.message, file2_1.value)
})
```

### 4.4. System 模块示例

```bash
tsc --outFile bundle.js --module system
```

```javascript
// bundle.js
System.register('file1', [], function (exports_1) {
  var message
  return {
    execute: function () {
      exports_1('message', (message = 'Hello'))
    },
  }
})
// ... 其他模块
```

### 4.5. 使用限制

```text
❌ 不适用场景：
- Node.js 项目（使用 CommonJS）
- 现代前端项目（使用 ES 模块）
- 需要代码分割的项目
- 需要按需加载的项目

✅ 适用场景：
- 旧浏览器支持（AMD/RequireJS）
- 简单的浏览器脚本
- 特殊的构建需求
```

## 5. 🆚 --outDir vs. --outFile？

### 5.1. 功能对比

| 特性     | --outDir | --outFile      |
| -------- | -------- | -------------- |
| 输出方式 | 多个文件 | 单个文件       |
| 目录结构 | 保持     | 无             |
| 模块系统 | 全部支持 | 仅 AMD/System  |
| 现代项目 | ✅ 推荐  | ❌ 少用        |
| Node.js  | ✅ 支持  | ❌ 不支持      |
| 浏览器   | ✅ 支持  | ✅ 支持（AMD） |
| 代码分割 | ✅ 支持  | ❌ 不支持      |
| 按需加载 | ✅ 支持  | ❌ 不支持      |

### 5.2. 输出对比

```text
使用 --outDir：
dist/
├── index.js
├── utils/
│   └── helper.js
└── types/
    └── custom.js

✅ 多个文件
✅ 保持结构
✅ 支持模块化
✅ 适合现代项目

使用 --outFile：
dist/
└── bundle.js

✅ 单个文件
❌ 无目录结构
⚠️ 仅支持 AMD/System
❌ 不适合现代项目
```

### 5.3. 配置示例

```json
// 使用 --outDir（推荐）
{
  "compilerOptions": {
    "module": "commonjs",
    "outDir": "./dist"
  }
}

// 使用 --outFile（少用）
{
  "compilerOptions": {
    "module": "amd",         // ⚠️ 必须是 AMD 或 System
    "outFile": "./dist/bundle.js"
  }
}
```

## 6. 🤔 如何选择使用？

### 6.1. 选择流程

```text
1. 项目类型？
   ├── Node.js 项目
   │   → 使用 --outDir
   │   → module: commonjs
   │
   ├── 现代前端项目
   │   → 使用 --outDir + 打包工具（Webpack/Vite）
   │   → module: esnext
   │
   └── 旧浏览器项目（RequireJS）
       → 可考虑 --outFile
       → module: amd

2. 需要代码分割？
   ├── 是 → 使用 --outDir
   └── 否 → 可考虑 --outFile

3. 需要按需加载？
   ├── 是 → 使用 --outDir
   └── 否 → 可考虑 --outFile
```

### 6.2. 推荐配置

```json
// Node.js 项目
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src"
  }
}

// 前端项目（配合 Webpack/Vite）
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "esnext",
    "outDir": "./dist",
    "rootDir": "./src"
  }
}

// 库项目
{
  "compilerOptions": {
    "target": "ES2015",
    "module": "esnext",
    "outDir": "./dist",
    "declaration": true
  }
}
```

### 6.3. 不推荐配置

```json
// ❌ 避免：现代项目使用 --outFile
{
  "compilerOptions": {
    "module": "commonjs",     // ❌ CommonJS 不支持 outFile
    "outFile": "./bundle.js"  // ❌ 会报错
  }
}

// ❌ 避免：Node.js 项目使用 AMD
{
  "compilerOptions": {
    "module": "amd",          // ❌ Node.js 不支持 AMD
    "outFile": "./bundle.js"
  }
}
```

### 6.4. 最佳实践

```text
✅ 推荐做法：
1. 现代项目使用 --outDir
2. 配合打包工具处理最终输出
3. TypeScript 只负责类型检查和转译
4. 打包工具负责合并和优化

❌ 避免做法：
1. 在现代项目中使用 --outFile
2. 混用 --outDir 和 --outFile
3. 在不支持的模块系统使用 --outFile
```

## 7. 🔗 引用

- [Compiler Options][1]
- [Module Resolution][2]
- [Project Configuration][3]

[1]: https://www.typescriptlang.org/docs/handbook/compiler-options.html
[2]: https://www.typescriptlang.org/docs/handbook/module-resolution.html
[3]: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
