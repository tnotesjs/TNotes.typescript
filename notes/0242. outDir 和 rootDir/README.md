# [0242. outDir 和 rootDir](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0242.%20outDir%20%E5%92%8C%20rootDir)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 outDir 和 rootDir 是什么？](#3--outdir-和-rootdir-是什么)
  - [3.1. outDir](#31-outdir)
  - [3.2. rootDir](#32-rootdir)
  - [3.3. 基本示例](#33-基本示例)
- [4. 🤔 为什么需要这两个选项？](#4--为什么需要这两个选项)
  - [4.1. 分离源码和构建产物](#41-分离源码和构建产物)
  - [4.2. 保持目录结构](#42-保持目录结构)
  - [4.3. 避免嵌套输出](#43-避免嵌套输出)
- [5. 🆚 outDir vs. rootDir](#5--outdir-vs-rootdir)
- [6. 🤔 如何配置目录结构？](#6--如何配置目录结构)
  - [6.1. 标准单包项目](#61-标准单包项目)
  - [6.2. 分离开发和生产](#62-分离开发和生产)
  - [6.3. 多入口项目](#63-多入口项目)
  - [6.4. 测试文件分离](#64-测试文件分离)
  - [6.5. 声明文件输出](#65-声明文件输出)
  - [6.6. Monorepo 结构](#66-monorepo-结构)
- [7. 🤔 使用时需要注意什么？](#7--使用时需要注意什么)
  - [7.1. rootDir 自动推断](#71-rootdir-自动推断)
  - [7.2. 路径解析](#72-路径解析)
  - [7.3. 外部文件引用](#73-外部文件引用)
  - [7.4. 相对路径导入](#74-相对路径导入)
  - [7.5. 清理构建产物](#75-清理构建产物)
  - [7.6. outFile 限制](#76-outfile-限制)
  - [7.7. 监听模式](#77-监听模式)
  - [7.8. package.json 配置](#78-packagejson-配置)
  - [7.9. .gitignore 设置](#79-gitignore-设置)
  - [7.10. 绝对路径](#710-绝对路径)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- outDir 输出目录配置
- rootDir 根目录配置
- 目录结构映射规则
- 常见项目结构
- 实际应用场景

## 2. 🫧 评价

`outDir` 和 `rootDir` 控制 TypeScript 编译输出的目录结构，是项目构建配置的基础。

- outDir 指定输出位置
- rootDir 确定源码根目录
- 保持目录结构的映射关系
- 避免输出文件混乱
- 是构建工具链的基础
- 合理配置提高项目可维护性

## 3. 🤔 outDir 和 rootDir 是什么？

### 3.1. outDir

`outDir` 指定编译后 JavaScript 文件的输出目录。

```json
{
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

### 3.2. rootDir

`rootDir` 指定 TypeScript 源文件的根目录，影响输出文件的目录结构。

```json
{
  "compilerOptions": {
    "rootDir": "./src"
  }
}
```

### 3.3. 基本示例

```text
项目结构：
my-project/
├── src/
│   ├── index.ts
│   ├── utils/
│   │   └── helper.ts
│   └── types/
│       └── user.ts
└── tsconfig.json

配置：
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  }
}

编译后：
my-project/
├── src/
│   └── ...
├── dist/
│   ├── index.js
│   ├── utils/
│   │   └── helper.js
│   └── types/
│       └── user.js
└── tsconfig.json
```

## 4. 🤔 为什么需要这两个选项？

### 4.1. 分离源码和构建产物

```text
❌ 不使用 outDir（混乱）：
src/
├── index.ts
├── index.js      ← 编译输出
├── utils/
│   ├── helper.ts
│   └── helper.js ← 编译输出
└── types/
    ├── user.ts
    └── user.js   ← 编译输出

✅ 使用 outDir（清晰）：
src/
├── index.ts
├── utils/
│   └── helper.ts
└── types/
    └── user.ts
dist/
├── index.js
├── utils/
│   └── helper.js
└── types/
    └── user.js
```

### 4.2. 保持目录结构

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

```typescript
// src/utils/helper.ts
export function add(a: number, b: number) {
  return a + b
}

// src/index.ts
import { add } from './utils/helper'
console.log(add(1, 2))
```

```text
编译后保持相对路径：
dist/
├── index.js          // import { add } from "./utils/helper"
└── utils/
    └── helper.js
```

### 4.3. 避免嵌套输出

```text
❌ 不设置 rootDir：
项目结构：
my-project/
├── src/
│   └── index.ts
└── test/
    └── test.ts

编译后（包含完整路径）：
dist/
├── src/
│   └── index.js  ← 多余的 src 层级
└── test/
    └── test.js

✅ 设置 rootDir: "./src"：
dist/
└── index.js      ← 正确的扁平结构
```

## 5. 🆚 outDir vs. rootDir

| 特性     | outDir           | rootDir                    |
| -------- | ---------------- | -------------------------- |
| 作用     | 指定输出目录     | 指定源码根目录             |
| 影响     | 输出文件存放位置 | 输出目录结构               |
| 默认值   | 源文件同目录     | 所有输入文件的最长公共路径 |
| 必需性   | 可选但强烈推荐   | 可选                       |
| 路径类型 | 相对或绝对路径   | 相对或绝对路径             |
| 主要用途 | 清理构建产物     | 控制输出结构               |

## 6. 🤔 如何配置目录结构？

### 6.1. 标准单包项目

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

```text
my-project/
├── src/
│   ├── index.ts
│   ├── models/
│   ├── services/
│   └── utils/
├── dist/          ← 编译输出
├── node_modules/
├── package.json
└── tsconfig.json
```

### 6.2. 分离开发和生产

```json
// tsconfig.json（基础配置）
{
  "compilerOptions": {
    "rootDir": "./src"
  }
}

// tsconfig.build.json（生产构建）
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "removeComments": true,
    "sourceMap": false
  }
}

// tsconfig.dev.json（开发构建）
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./build",
    "sourceMap": true,
    "incremental": true
  }
}
```

### 6.3. 多入口项目

```text
项目结构：
my-project/
├── src/
│   ├── client/
│   │   └── index.ts
│   ├── server/
│   │   └── index.ts
│   └── shared/
│       └── types.ts
└── tsconfig.json
```

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

```text
编译输出：
dist/
├── client/
│   └── index.js
├── server/
│   └── index.js
└── shared/
    └── types.js
```

### 6.4. 测试文件分离

```json
// tsconfig.json（主配置）
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["src/**/*.spec.ts"]
}

// tsconfig.test.json（测试配置）
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist-test"
  },
  "include": ["src/**/*.spec.ts"]
}
```

### 6.5. 声明文件输出

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationDir": "./types" // 类型声明单独目录
  }
}
```

```text
输出结构：
dist/
├── index.js
└── utils/
    └── helper.js
types/
├── index.d.ts
└── utils/
    └── helper.d.ts
```

### 6.6. Monorepo 结构

```text
monorepo/
├── packages/
│   ├── core/
│   │   ├── src/
│   │   ├── dist/
│   │   └── tsconfig.json
│   └── utils/
│       ├── src/
│       ├── dist/
│       └── tsconfig.json
└── tsconfig.base.json
```

```json
// packages/core/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

## 7. 🤔 使用时需要注意什么？

### 7.1. rootDir 自动推断

```text
❌ 不设置 rootDir（自动推断）：
项目：
my-project/
├── src/
│   └── index.ts
└── lib/
    └── helper.ts

// 最长公共路径是项目根目录
编译后：
dist/
├── src/
│   └── index.js
└── lib/
    └── helper.js

✅ 明确设置 rootDir:
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "."  // 明确指定
  }
}
```

### 7.2. 路径解析

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

```typescript
// src/index.ts
import { helper } from '@/utils/helper' // ✅ 编译时解析
// 编译后 dist/index.js 中的路径需要运行时处理
```

### 7.3. 外部文件引用

```text
项目：
my-project/
├── src/
│   └── index.ts
├── shared/        ← 在 rootDir 外
│   └── config.ts
└── tsconfig.json
```

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*", "shared/**/*"] // ⚠️ 包含 rootDir 外的文件
}
```

```text
❌ 编译错误：
error TS6059: File 'shared/config.ts' is not under 'rootDir' 'src'.

✅ 解决方案：
1. 将 shared 移到 src 内
2. 调整 rootDir: "."
3. 使用 typeRoots 或 @types
```

### 7.4. 相对路径导入

```typescript
// src/index.ts
import { config } from '../config' // ⚠️ 超出 rootDir

// ✅ 保持导入在 rootDir 内
import { config } from './config'
```

### 7.5. 清理构建产物

```json
{
  "scripts": {
    "clean": "rm -rf dist",
    "build": "npm run clean && tsc"
  }
}
```

### 7.6. outFile 限制

```json
{
  "compilerOptions": {
    "outDir": "./dist", // ✅ 可以共存
    "outFile": "./bundle.js" // ⚠️ 只适用于 AMD/System
  }
}
```

### 7.7. 监听模式

```bash
# 监听编译，输出到 dist
tsc --watch --outDir ./dist
```

### 7.8. package.json 配置

```json
{
  "name": "my-package",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": [
    "dist" // 发布时只包含 dist
  ],
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  }
}
```

### 7.9. .gitignore 设置

```text
# .gitignore
dist/
build/
*.js
*.d.ts
!src/**/*.js  # 如果有需要保留的 JS 文件
```

### 7.10. 绝对路径

```json
{
  "compilerOptions": {
    // ✅ 相对路径（推荐）
    "outDir": "./dist",
    "rootDir": "./src",

    // ⚠️ 绝对路径（不推荐，影响可移植性）
    "outDir": "/Users/username/project/dist"
  }
}
```

## 8. 🔗 引用

- [TypeScript outDir][1]
- [TypeScript rootDir][2]
- [Project Configuration][3]

[1]: https://www.typescriptlang.org/tsconfig#outDir
[2]: https://www.typescriptlang.org/tsconfig#rootDir
[3]: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
