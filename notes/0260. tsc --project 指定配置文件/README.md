# [0260. tsc --project 指定配置文件](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0260.%20tsc%20--project%20%E6%8C%87%E5%AE%9A%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 --project 参数的作用？](#3----project-参数的作用)
  - [3.1. 默认行为](#31-默认行为)
  - [3.2. 指定配置文件](#32-指定配置文件)
  - [3.3. 指定目录](#33-指定目录)
- [4. 🤔 如何使用 --project？](#4--如何使用---project)
  - [4.1. 基本用法](#41-基本用法)
  - [4.2. 指定不同配置](#42-指定不同配置)
  - [4.3. 项目结构示例](#43-项目结构示例)
  - [4.4. 配置文件示例](#44-配置文件示例)
  - [4.5. 编译不同环境](#45-编译不同环境)
- [5. 🤔 多环境配置？](#5--多环境配置)
  - [5.1. 环境分离策略](#51-环境分离策略)
  - [5.2. package.json 脚本](#52-packagejson-脚本)
  - [5.3. Monorepo 配置](#53-monorepo-配置)
- [6. � 如何与其他参数配合？](#6--如何与其他参数配合)
  - [6.1. 覆盖配置选项](#61-覆盖配置选项)
  - [6.2. 组合使用](#62-组合使用)
  - [6.3. 构建模式](#63-构建模式)
  - [6.4. CI/CD 使用](#64-cicd-使用)
  - [6.5. 实际案例](#65-实际案例)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- --project 参数作用
- 基本使用方法
- 多环境配置
- 参数组合使用

## 2. 🫧 评价

`--project` 参数允许指定配置文件，支持多环境和灵活的项目配置。

- 支持多配置文件
- 适用于多环境构建
- 简化 CI/CD 配置
- 可与其他参数组合
- 提供配置灵活性

## 3. 🤔 --project 参数的作用？

`--project`（简写 `-p`）用于指定 TypeScript 配置文件或包含配置文件的目录。

### 3.1. 默认行为

```bash
# 不指定 --project 时
tsc

# TypeScript 会：
# 1. 在当前目录查找 tsconfig.json
# 2. 如果找不到，向上级目录查找
# 3. 找到后使用该配置文件
```

### 3.2. 指定配置文件

```bash
# 指定具体配置文件
tsc --project tsconfig.prod.json

# 简写
tsc -p tsconfig.prod.json
```

### 3.3. 指定目录

```bash
# 指定目录（会查找目录下的 tsconfig.json）
tsc --project ./

# 指定子目录
tsc --project ./packages/core/
```

## 4. 🤔 如何使用 --project？

### 4.1. 基本用法

```bash
# 使用默认配置
tsc

# 等同于
tsc --project tsconfig.json

# 或
tsc --project ./
```

### 4.2. 指定不同配置

```bash
# 开发环境
tsc --project tsconfig.dev.json

# 生产环境
tsc --project tsconfig.prod.json

# 测试环境
tsc --project tsconfig.test.json
```

### 4.3. 项目结构示例

```text
project/
├── src/
│   └── index.ts
├── tsconfig.json           # 基础配置
├── tsconfig.dev.json       # 开发配置
├── tsconfig.prod.json      # 生产配置
└── tsconfig.test.json      # 测试配置
```

### 4.4. 配置文件示例

```json
// tsconfig.json（基础配置）
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}

// tsconfig.dev.json（开发配置）
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./dev",
    "sourceMap": true,
    "incremental": true
  }
}

// tsconfig.prod.json（生产配置）
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "sourceMap": false,
    "removeComments": true,
    "declaration": true
  }
}
```

### 4.5. 编译不同环境

```bash
# 开发构建
tsc -p tsconfig.dev.json

# 生产构建
tsc -p tsconfig.prod.json
```

## 5. 🤔 多环境配置？

### 5.1. 环境分离策略

```text
项目结构：
project/
├── configs/
│   ├── tsconfig.base.json      # 基础配置
│   ├── tsconfig.dev.json       # 开发环境
│   ├── tsconfig.prod.json      # 生产环境
│   └── tsconfig.test.json      # 测试环境
├── src/
└── tsconfig.json               # 默认（指向 dev）
```

```json
// configs/tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "rootDir": "../src"
  },
  "include": ["../src/**/*"],
  "exclude": ["../node_modules"]
}

// configs/tsconfig.dev.json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "outDir": "../dev",
    "sourceMap": true,
    "incremental": true
  }
}

// configs/tsconfig.prod.json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "outDir": "../dist",
    "sourceMap": false,
    "removeComments": true,
    "declaration": true
  }
}
```

### 5.2. package.json 脚本

```json
{
  "scripts": {
    "build": "tsc -p configs/tsconfig.prod.json",
    "build:dev": "tsc -p configs/tsconfig.dev.json",
    "watch": "tsc -p configs/tsconfig.dev.json --watch",
    "type-check": "tsc -p configs/tsconfig.prod.json --noEmit"
  }
}
```

```bash
# 使用脚本
npm run build         # 生产构建
npm run build:dev     # 开发构建
npm run watch         # 监听模式
npm run type-check    # 类型检查
```

### 5.3. Monorepo 配置

```text
monorepo/
├── packages/
│   ├── core/
│   │   ├── src/
│   │   └── tsconfig.json
│   ├── utils/
│   │   ├── src/
│   │   └── tsconfig.json
│   └── app/
│       ├── src/
│       └── tsconfig.json
├── tsconfig.base.json
└── tsconfig.json
```

```bash
# 编译特定包
tsc --project packages/core/tsconfig.json

# 构建所有包
tsc --build packages/*/tsconfig.json

# 使用项目引用
tsc --build
```

## 6. � 如何与其他参数配合？

### 6.1. 覆盖配置选项

```bash
# 使用配置文件，但覆盖 target
tsc --project tsconfig.json --target ES2015

# 使用配置文件，但覆盖 outDir
tsc -p tsconfig.prod.json --outDir ./custom-dist
```

```text
优先级：
命令行参数 > 配置文件 > 默认值
```

### 6.2. 组合使用

```bash
# watch 模式 + 指定配置
tsc --project tsconfig.dev.json --watch

# 只检查类型 + 指定配置
tsc -p tsconfig.prod.json --noEmit

# 增量编译 + 指定配置
tsc --project tsconfig.json --incremental

# 详细输出 + 指定配置
tsc -p tsconfig.json --listFiles --diagnostics
```

### 6.3. 构建模式

```bash
# 构建项目引用
tsc --build --project packages/core

# 强制重新构建
tsc --build --project packages/core --force

# 构建 + watch
tsc --build --watch --project packages/core
```

### 6.4. CI/CD 使用

```bash
# .gitlab-ci.yml 或 .github/workflows
- name: Type Check
  run: tsc --project tsconfig.prod.json --noEmit

- name: Build
  run: tsc --project tsconfig.prod.json

- name: Generate Declarations
  run: tsc --project tsconfig.json --emitDeclarationOnly
```

### 6.5. 实际案例

```json
// package.json
{
  "scripts": {
    "dev": "tsc -p tsconfig.dev.json -w",
    "build": "tsc -p tsconfig.prod.json",
    "build:types": "tsc -p tsconfig.json --emitDeclarationOnly",
    "check": "tsc -p tsconfig.prod.json --noEmit",
    "clean": "rm -rf dist dev"
  }
}
```

```bash
# 开发
npm run dev

# 生产构建
npm run build

# 只生成类型声明
npm run build:types

# 类型检查
npm run check

# 清理
npm run clean
```

## 7. 🔗 引用

- [Compiler Options][1]
- [Project References][2]
- [TSConfig Reference][3]

[1]: https://www.typescriptlang.org/docs/handbook/compiler-options.html
[2]: https://www.typescriptlang.org/docs/handbook/project-references.html
[3]: https://www.typescriptlang.org/tsconfig
