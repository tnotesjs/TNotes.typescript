# [0246. references 项目引用](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0246.%20references%20%E9%A1%B9%E7%9B%AE%E5%BC%95%E7%94%A8)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 项目引用是什么？](#3--项目引用是什么)
  - [3.1. 基本概念](#31-基本概念)
  - [3.2. composite 选项](#32-composite-选项)
  - [3.3. references 配置](#33-references-配置)
- [4. 🤔 为什么需要项目引用？](#4--为什么需要项目引用)
  - [4.1. 构建性能](#41-构建性能)
  - [4.2. 代码组织](#42-代码组织)
  - [4.3. 强制依赖关系](#43-强制依赖关系)
- [5. 🤔 如何配置项目引用？](#5--如何配置项目引用)
  - [5.1. 基础配置](#51-基础配置)
  - [5.2. Monorepo 完整示例](#52-monorepo-完整示例)
  - [5.3. path 选项](#53-path-选项)
  - [5.4. prepend 选项](#54-prepend-选项)
- [6. 🤔 如何构建项目引用？](#6--如何构建项目引用)
  - [6.1. 使用 --build 模式](#61-使用---build-模式)
  - [6.2. 增量构建](#62-增量构建)
  - [6.3. 监听模式](#63-监听模式)
  - [6.4. 并行构建](#64-并行构建)
  - [6.5. package.json 脚本](#65-packagejson-脚本)
- [7. 🤔 使用时需要注意什么？](#7--使用时需要注意什么)
  - [7.1. composite 必需选项](#71-composite-必需选项)
  - [7.2. declaration 自动启用](#72-declaration-自动启用)
  - [7.3. 输出文件位置](#73-输出文件位置)
  - [7.4. 循环依赖检测](#74-循环依赖检测)
  - [7.5. rootDir 限制](#75-rootdir-限制)
  - [7.6. tsbuildinfo 文件](#76-tsbuildinfo-文件)
  - [7.7. 导入路径](#77-导入路径)
  - [7.8. path 别名](#78-path-别名)
  - [7.9. 构建顺序](#79-构建顺序)
  - [7.10. .gitignore 配置](#710-gitignore-配置)
  - [7.11. 编辑器支持](#711-编辑器支持)
  - [7.12. 性能优化](#712-性能优化)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 项目引用（Project References）
- composite 选项
- 依赖关系管理
- 增量构建
- Monorepo 应用
- 构建模式选项

## 2. 🫧 评价

项目引用允许将 TypeScript 项目拆分为多个独立部分，实现更快的构建和更好的代码组织。

- 支持大型项目拆分
- 实现增量构建
- 强制执行依赖关系
- 提高构建性能
- 是 Monorepo 的基础
- 需要合理的项目结构

## 3. 🤔 项目引用是什么？

### 3.1. 基本概念

项目引用允许 TypeScript 项目依赖其他 TypeScript 项目，每个项目可以独立构建。

```text
项目结构：
my-workspace/
├── packages/
│   ├── core/
│   │   ├── src/
│   │   ├── dist/
│   │   └── tsconfig.json
│   ├── utils/
│   │   ├── src/
│   │   ├── dist/
│   │   └── tsconfig.json
│   └── app/
│       ├── src/
│       ├── dist/
│       └── tsconfig.json
└── tsconfig.json
```

### 3.2. composite 选项

要使用项目引用，被引用的项目必须启用 `composite`。

```json
// packages/core/tsconfig.json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

### 3.3. references 配置

```json
// packages/app/tsconfig.json
{
  "compilerOptions": {
    "outDir": "./dist"
  },
  "references": [{ "path": "../core" }, { "path": "../utils" }]
}
```

## 4. 🤔 为什么需要项目引用？

### 4.1. 构建性能

```text
❌ 单体项目（慢）：
- 每次都编译所有文件
- 修改一个文件，全部重新编译

✅ 项目引用（快）：
- 只编译修改的项目
- 依赖项使用缓存的构建结果
- 并行构建独立项目
```

### 4.2. 代码组织

```typescript
// ❌ 没有项目引用（混乱）
import { User } from '../../core/src/models/user'
import { helper } from '../../utils/src/helper'

// ✅ 使用项目引用（清晰）
import { User } from '@my-workspace/core'
import { helper } from '@my-workspace/utils'
```

### 4.3. 强制依赖关系

```text
项目引用强制执行依赖方向：

core (无依赖)
  ↑
utils (依赖 core)
  ↑
app (依赖 core 和 utils)

❌ 不允许：core 依赖 app（循环依赖）
```

## 5. 🤔 如何配置项目引用？

### 5.1. 基础配置

```text
项目结构：
workspace/
├── packages/
│   ├── shared/
│   │   ├── src/index.ts
│   │   └── tsconfig.json
│   └── main/
│       ├── src/index.ts
│       └── tsconfig.json
└── tsconfig.json
```

```json
// packages/shared/tsconfig.json（被引用项目）
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}

// packages/main/tsconfig.json（引用项目）
{
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "references": [
    { "path": "../shared" }
  ],
  "include": ["src/**/*"]
}

// 根 tsconfig.json（协调器）
{
  "files": [],
  "references": [
    { "path": "./packages/shared" },
    { "path": "./packages/main" }
  ]
}
```

### 5.2. Monorepo 完整示例

```text
my-monorepo/
├── packages/
│   ├── types/           (共享类型)
│   ├── utils/           (工具函数)
│   ├── core/            (核心逻辑)
│   ├── ui/              (UI 组件)
│   └── app/             (应用入口)
└── tsconfig.json
```

```json
// packages/types/tsconfig.json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "outDir": "./dist"
  }
}

// packages/utils/tsconfig.json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "outDir": "./dist"
  },
  "references": [
    { "path": "../types" }
  ]
}

// packages/core/tsconfig.json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "outDir": "./dist"
  },
  "references": [
    { "path": "../types" },
    { "path": "../utils" }
  ]
}

// packages/app/tsconfig.json
{
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist"
  },
  "references": [
    { "path": "../types" },
    { "path": "../utils" },
    { "path": "../core" },
    { "path": "../ui" }
  ]
}

// 根 tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./packages/types" },
    { "path": "./packages/utils" },
    { "path": "./packages/core" },
    { "path": "./packages/ui" },
    { "path": "./packages/app" }
  ]
}
```

### 5.3. path 选项

```json
{
  "references": [
    { "path": "../shared" }, // 相对路径
    { "path": "./packages/core" }, // 相对路径
    { "path": "../utils/tsconfig.json" } // 指定配置文件
  ]
}
```

### 5.4. prepend 选项

```json
{
  "references": [
    {
      "path": "../shared",
      "prepend": true // 将依赖的输出添加到此项目输出之前
    }
  ]
}
```

## 6. 🤔 如何构建项目引用？

### 6.1. 使用 --build 模式

```bash
# 构建整个项目（包括依赖）
tsc --build

# 或使用简写
tsc -b

# 指定配置文件
tsc -b tsconfig.json

# 构建特定项目
tsc -b packages/app
```

### 6.2. 增量构建

```bash
# 增量构建（只构建修改的部分）
tsc -b

# 强制完全重新构建
tsc -b --force

# 清理构建产物
tsc -b --clean

# 查看会构建什么（不实际构建）
tsc -b --dry
```

### 6.3. 监听模式

```bash
# 监听模式
tsc -b --watch

# 或简写
tsc -b -w
```

### 6.4. 并行构建

TypeScript 自动并行构建独立的项目。

```bash
# 自动并行构建
tsc -b

# packages/types 和 packages/utils 可能同时构建
# packages/core 等待它们完成后构建
```

### 6.5. package.json 脚本

```json
{
  "scripts": {
    "build": "tsc -b",
    "build:force": "tsc -b --force",
    "clean": "tsc -b --clean",
    "watch": "tsc -b --watch",
    "dev": "tsc -b -w"
  }
}
```

## 7. 🤔 使用时需要注意什么？

### 7.1. composite 必需选项

```json
// ❌ 错误：被引用的项目必须启用 composite
{
  "compilerOptions": {
    "outDir": "./dist"
  }
}

// ✅ 正确
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,  // composite 要求启用
    "outDir": "./dist"
  }
}
```

### 7.2. declaration 自动启用

```json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true // composite 强制启用此选项
  }
}
```

### 7.3. 输出文件位置

```json
{
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist",
    "declarationDir": "./types"  // ❌ composite 不允许分离
  }
}

// ✅ 正确：声明文件和 JS 文件在同一目录
{
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist"
  }
}
```

### 7.4. 循环依赖检测

```text
A → B → C → A

❌ 错误：检测到循环依赖
error TS6202: Project references may not form a circular graph.
```

### 7.5. rootDir 限制

```json
{
  "compilerOptions": {
    "composite": true,
    "rootDir": "./src" // ✅ 明确指定
  },
  "include": ["src/**/*"]
}
```

### 7.6. tsbuildinfo 文件

```text
项目构建时生成 .tsbuildinfo 文件：

packages/core/
├── dist/
│   └── index.js
└── tsconfig.tsbuildinfo  ← 增量构建信息
```

```json
{
  "compilerOptions": {
    "composite": true,
    "incremental": true,
    "tsBuildInfoFile": "./dist/.tsbuildinfo" // 自定义位置
  }
}
```

### 7.7. 导入路径

```typescript
// ❌ 不要直接导入源文件
import { User } from "../shared/src/user";

// ✅ 通过构建产物导入
import { User } from "../shared";

// package.json
{
  "name": "@workspace/shared",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts"
}
```

### 7.8. path 别名

```json
// 根 tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@workspace/*": ["packages/*/src"]
    }
  }
}

// 使用
import { User } from "@workspace/core";
```

### 7.9. 构建顺序

```text
TypeScript 自动确定构建顺序：

依赖关系：
types → utils → core → app

构建顺序：
1. types (无依赖，先构建)
2. utils (依赖 types)
3. core (依赖 types 和 utils)
4. app (依赖所有)
```

### 7.10. .gitignore 配置

```text
# .gitignore
*.tsbuildinfo
packages/*/dist
packages/*/.tsbuildinfo
```

### 7.11. 编辑器支持

```json
// VS Code 自动识别项目引用
// 提供跨项目的类型检查和导航
```

### 7.12. 性能优化

```bash
# 只构建修改的项目
tsc -b

# 使用 --verbose 查看构建过程
tsc -b --verbose

# 示例输出：
# Projects in this build:
#   * packages/types/tsconfig.json
#   * packages/utils/tsconfig.json
#   * packages/core/tsconfig.json
# Project 'types' is up to date
# Project 'utils' is up to date
# Building project 'core'...
```

## 8. 🔗 引用

- [TypeScript Project References][1]
- [Project References Guide][2]
- [Composite Projects][3]

[1]: https://www.typescriptlang.org/docs/handbook/project-references.html
[2]: https://www.typescriptlang.org/tsconfig#references
[3]: https://www.typescriptlang.org/tsconfig#composite
