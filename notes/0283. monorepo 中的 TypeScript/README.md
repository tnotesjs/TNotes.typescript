# [0283. monorepo 中的 TypeScript](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0283.%20monorepo%20%E4%B8%AD%E7%9A%84%20TypeScript)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 什么是 monorepo？](#3-什么是-monorepo)
  - [3.1. monorepo vs. polyrepo](#31-monorepo-vs-polyrepo)
  - [3.2. 常见工具](#32-常见工具)
- [4. 如何搭建 TypeScript monorepo？](#4-如何搭建-typescript-monorepo)
  - [4.1. 目录结构](#41-目录结构)
  - [4.2. workspace 配置](#42-workspace-配置)
  - [4.3. 包配置](#43-包配置)
- [5. 项目引用如何配置？](#5-项目引用如何配置)
  - [5.1. 根 tsconfig.json](#51-根-tsconfigjson)
  - [5.2. 包的 tsconfig.json](#52-包的-tsconfigjson)
  - [5.3. 构建命令](#53-构建命令)
- [6. 跨包类型共享？](#6-跨包类型共享)
  - [6.1. 共享包导出](#61-共享包导出)
  - [6.2. 使用共享类型](#62-使用共享类型)
  - [6.3. 路径映射](#63-路径映射)
- [7. 构建和发布？](#7-构建和发布)
  - [7.1. 使用 Turborepo](#71-使用-turborepo)
  - [7.2. 版本管理](#72-版本管理)
  - [7.3. CI/CD 配置](#73-cicd-配置)
  - [7.4. 选择性发布](#74-选择性发布)
- [8. 引用](#8-引用)

<!-- endregion:toc -->

## 1. 本节内容

- monorepo 概念
- TypeScript monorepo 搭建
- 项目引用配置
- 跨包类型共享
- 构建和发布

## 2. 评价

monorepo 是大型项目的有效组织方式。

- 统一管理多个包
- 共享 TypeScript 配置
- 项目引用实现增量编译
- 类型安全的跨包依赖
- 统一的构建和测试流程

## 3. 什么是 monorepo？

单一仓库管理多个项目。

### 3.1. monorepo vs. polyrepo

| 特性     | monorepo       | polyrepo       |
| -------- | -------------- | -------------- |
| 代码组织 | 单一仓库多个包 | 每个包独立仓库 |
| 依赖管理 | 统一版本       | 各自管理       |
| 代码共享 | 容易           | 需要发布       |
| 构建工具 | 需要专门工具   | 独立构建       |
| CI/CD    | 统一流程       | 各自配置       |

### 3.2. 常见工具

```ts
// ✅ 主流 monorepo 工具
interface MonorepoTool {
  name: string
  features: string[]
}

const tools: MonorepoTool[] = [
  {
    name: 'pnpm workspaces',
    features: ['快速', '节省空间', '严格依赖'],
  },
  {
    name: 'npm workspaces',
    features: ['原生支持', '简单易用'],
  },
  {
    name: 'Yarn workspaces',
    features: ['成熟稳定', '插件生态'],
  },
  {
    name: 'Turborepo',
    features: ['增量构建', '远程缓存', '任务编排'],
  },
  {
    name: 'Nx',
    features: ['智能构建', '代码生成', '依赖图'],
  },
  {
    name: 'Lerna',
    features: ['版本管理', '发布流程', '传统工具'],
  },
]
```

## 4. 如何搭建 TypeScript monorepo？

使用 pnpm workspaces 搭建。

### 4.1. 目录结构

```plaintext
monorepo/
├── package.json              # 根 package.json
├── pnpm-workspace.yaml       # workspace 配置
├── tsconfig.json             # 根 tsconfig
├── packages/
│   ├── shared/               # 共享包
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts
│   │       └── types.ts
│   ├── web/                  # Web 应用
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       └── index.ts
│   └── api/                  # API 服务
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           └── index.ts
└── apps/
    └── admin/                # 管理后台
        ├── package.json
        ├── tsconfig.json
        └── src/
            └── index.ts
```

### 4.2. workspace 配置

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

```json
// 根 package.json
{
  "name": "my-monorepo",
  "private": true,
  "scripts": {
    "build": "pnpm -r run build",
    "test": "pnpm -r run test",
    "dev": "pnpm -r --parallel run dev"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

### 4.3. 包配置

```json
// packages/shared/package.json
{
  "name": "@monorepo/shared",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  }
}

// packages/web/package.json
{
  "name": "@monorepo/web",
  "version": "1.0.0",
  "dependencies": {
    "@monorepo/shared": "workspace:*"  // workspace 协议
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  }
}
```

## 5. 项目引用如何配置？

使用 TypeScript 项目引用。

### 5.1. 根 tsconfig.json

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "composite": true, // 启用复合项目
    "incremental": true // 增量编译
  },
  "files": [],
  "references": [
    { "path": "./packages/shared" },
    { "path": "./packages/web" },
    { "path": "./packages/api" },
    { "path": "./apps/admin" }
  ]
}
```

### 5.2. 包的 tsconfig.json

```json
// packages/shared/tsconfig.json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "composite": true          // 必须启用
  },
  "include": ["src"]
}

// packages/web/tsconfig.json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "composite": true
  },
  "include": ["src"],
  "references": [
    { "path": "../shared" }    // 引用 shared 包
  ]
}
```

### 5.3. 构建命令

```bash
# ✅ 构建所有项目（自动按依赖顺序）
tsc --build

# ✅ 增量构建
tsc --build --incremental

# ✅ 强制重新构建
tsc --build --force

# ✅ 清理构建输出
tsc --build --clean

# ✅ 构建特定项目
tsc --build packages/web

# ✅ 查看详细信息
tsc --build --verbose
```

## 6. 跨包类型共享？

类型安全的跨包依赖。

### 6.1. 共享包导出

```ts
// packages/shared/src/types.ts
export interface User {
  id: string
  email: string
  name: string
}

export interface Product {
  id: string
  name: string
  price: number
}

export type ApiResponse<T> = {
  data: T
  status: number
}

// packages/shared/src/index.ts
export * from './types'
export { default as utils } from './utils'
```

### 6.2. 使用共享类型

```ts
// packages/web/src/index.ts
import type { User, ApiResponse } from '@monorepo/shared'

async function fetchUser(id: string): Promise<ApiResponse<User>> {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

// packages/api/src/index.ts
import type { User } from '@monorepo/shared'

function createUser(data: Omit<User, 'id'>): User {
  return {
    id: generateId(),
    ...data,
  }
}
```

### 6.3. 路径映射

```json
// packages/web/tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@monorepo/shared": ["../shared/src"], // 开发时指向源码
      "@monorepo/shared/*": ["../shared/src/*"]
    }
  },
  "references": [{ "path": "../shared" }]
}
```

```ts
// ✅ 开发时使用源码（无需构建 shared）
import { User } from '@monorepo/shared'

// TypeScript 会自动：
// 1. 检查 references 中的 shared
// 2. 使用 paths 映射到 ../shared/src
// 3. 提供完整的类型检查和跳转
```

## 7. 构建和发布？

统一的构建和发布流程。

### 7.1. 使用 Turborepo

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"], // 依赖的包先构建
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false
    }
  }
}
```

```json
// package.json
{
  "scripts": {
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "dev": "turbo run dev --parallel"
  }
}
```

### 7.2. 版本管理

```bash
# ✅ 使用 changesets
pnpm add -Dw @changesets/cli
pnpm changeset init

# 添加变更
pnpm changeset

# 生成版本号
pnpm changeset version

# 发布
pnpm changeset publish
```

```markdown
## 8. <!-- .changeset/cool-feature.md -->

"@monorepo/web": minor "@monorepo/shared": patch

---

Added cool new feature
```

### 7.3. CI/CD 配置

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - run: pnpm run build

      - run: pnpm run test

      - run: pnpm run lint
```

### 7.4. 选择性发布

```ts
// scripts/publish.ts
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

interface Package {
  name: string
  version: string
  changed: boolean
}

async function getChangedPackages(): Promise<Package[]> {
  const { stdout } = await execAsync('pnpm ls --json --depth=-1')
  const packages = JSON.parse(stdout)

  // 检查每个包是否有变更
  const changed: Package[] = []
  for (const pkg of packages) {
    const { stdout: diff } = await execAsync(
      `git diff HEAD^ HEAD -- ${pkg.path}`,
    )
    if (diff.trim()) {
      changed.push({
        name: pkg.name,
        version: pkg.version,
        changed: true,
      })
    }
  }

  return changed
}

async function publishPackages() {
  const changed = await getChangedPackages()

  for (const pkg of changed) {
    console.log(`Publishing ${pkg.name}@${pkg.version}`)
    await execAsync(`pnpm publish --filter ${pkg.name} --no-git-checks`)
  }
}

publishPackages()
```

## 8. 引用

- [TypeScript Project References][1]
- [pnpm Workspaces][2]
- [Turborepo][3]

[1]: https://www.typescriptlang.org/docs/handbook/project-references.html
[2]: https://pnpm.io/workspaces
[3]: https://turbo.build/repo
