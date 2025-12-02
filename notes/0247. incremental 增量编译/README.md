# [0247. incremental 增量编译](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0247.%20incremental%20%E5%A2%9E%E9%87%8F%E7%BC%96%E8%AF%91)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 增量编译是什么？](#3--增量编译是什么)
  - [3.1. 基本概念](#31-基本概念)
  - [3.2. 工作原理](#32-工作原理)
  - [3.3. tsbuildinfo 文件](#33-tsbuildinfo-文件)
- [4. 🤔 为什么需要增量编译？](#4--为什么需要增量编译)
  - [4.1. 性能对比](#41-性能对比)
  - [4.2. 实际场景](#42-实际场景)
  - [4.3. 开发体验提升](#43-开发体验提升)
- [5. 🤔 如何配置增量编译？](#5--如何配置增量编译)
  - [5.1. 基本配置](#51-基本配置)
  - [5.2. 自定义缓存文件位置](#52-自定义缓存文件位置)
  - [5.3. 与 outDir 配合](#53-与-outdir-配合)
  - [5.4. 项目引用中使用](#54-项目引用中使用)
  - [5.5. 多环境配置](#55-多环境配置)
  - [5.6. 监听模式](#56-监听模式)
- [6. 🤔 使用时需要注意什么？](#6--使用时需要注意什么)
  - [6.1. .tsbuildinfo 文件管理](#61-tsbuildinfo-文件管理)
  - [6.2. 清理缓存](#62-清理缓存)
  - [6.3. 何时重新构建](#63-何时重新构建)
  - [6.4. 与项目引用结合](#64-与项目引用结合)
  - [6.5. 性能影响](#65-性能影响)
  - [6.6. 内存占用](#66-内存占用)
  - [6.7. 构建工具集成](#67-构建工具集成)
  - [6.8. CI/CD 环境](#68-cicd-环境)
  - [6.9. 监听模式优化](#69-监听模式优化)
  - [6.10. 文件系统事件](#610-文件系统事件)
  - [6.11. 调试信息](#611-调试信息)
  - [6.12. 多进程构建](#612-多进程构建)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- incremental 选项
- tsBuildInfoFile 配置
- 构建信息缓存
- 性能优化
- 实际应用场景

## 2. 🫧 评价

增量编译通过缓存构建信息，只重新编译修改的文件，显著提升大型项目的构建速度。

- 缓存上次构建信息
- 只编译变化的文件
- 大幅提升构建速度
- 适合开发和 CI 环境
- 生成 .tsbuildinfo 文件
- 是大型项目的必备优化

## 3. 🤔 增量编译是什么？

### 3.1. 基本概念

`incremental` 启用增量编译，TypeScript 会保存上次编译的信息，下次只编译修改的文件。

```json
{
  "compilerOptions": {
    "incremental": true
  }
}
```

### 3.2. 工作原理

```text
首次编译：
1. 编译所有文件
2. 生成 .tsbuildinfo 文件（缓存构建信息）

后续编译：
1. 读取 .tsbuildinfo 文件
2. 对比文件修改时间
3. 只编译变化的文件
4. 更新 .tsbuildinfo 文件
```

### 3.3. tsbuildinfo 文件

```text
项目结构：
my-project/
├── src/
│   ├── index.ts
│   └── utils.ts
├── dist/
│   ├── index.js
│   └── utils.js
├── tsconfig.json
└── tsconfig.tsbuildinfo  ← 构建信息缓存
```

```json
// tsconfig.tsbuildinfo 内容示例（简化）
{
  "program": {
    "fileNames": ["./src/index.ts", "./src/utils.ts"],
    "fileInfos": {
      "./src/index.ts": {
        "version": "8a7c9...",
        "signature": "3d4f2..."
      }
    }
  }
}
```

## 4. 🤔 为什么需要增量编译？

### 4.1. 性能对比

```text
❌ 不使用增量编译：
修改 1 个文件 → 编译 1000 个文件 → 耗时 30 秒

✅ 使用增量编译：
修改 1 个文件 → 编译 1 个文件 + 依赖 → 耗时 2 秒
```

### 4.2. 实际场景

```ts
// 项目有 500 个文件

// 修改 src/utils/helper.ts
export function helper() {
  return 'updated' // 只修改这一行
}

// 不启用增量编译：
// - 重新编译全部 500 个文件
// - 耗时 20-30 秒

// 启用增量编译：
// - 只编译 helper.ts 和导入它的文件
// - 耗时 1-3 秒
```

### 4.3. 开发体验提升

```bash
# 监听模式 + 增量编译
tsc --watch

# 修改文件后：
# ✅ 快速反馈（< 1 秒）
# ✅ 即时看到结果
# ✅ 提高开发效率
```

## 5. 🤔 如何配置增量编译？

### 5.1. 基本配置

```json
{
  "compilerOptions": {
    "incremental": true,
    "outDir": "./dist"
  }
}
```

### 5.2. 自定义缓存文件位置

```json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "./cache/.tsbuildinfo"
  }
}
```

```text
输出结构：
my-project/
├── cache/
│   └── .tsbuildinfo  ← 自定义位置
├── dist/
└── src/
```

### 5.3. 与 outDir 配合

```json
{
  "compilerOptions": {
    "incremental": true,
    "outDir": "./dist",
    "tsBuildInfoFile": "./dist/.tsbuildinfo"
  }
}
```

### 5.4. 项目引用中使用

```json
{
  "compilerOptions": {
    "composite": true, // composite 自动启用 incremental
    "outDir": "./dist"
  }
}
```

### 5.5. 多环境配置

```json
// tsconfig.json（开发环境）
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "./cache/dev.tsbuildinfo"
  }
}

// tsconfig.prod.json（生产环境）
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "./cache/prod.tsbuildinfo"
  }
}
```

### 5.6. 监听模式

```json
{
  "compilerOptions": {
    "incremental": true
  },
  "watchOptions": {
    "watchFile": "useFsEvents",
    "watchDirectory": "useFsEvents"
  }
}
```

## 6. 🤔 使用时需要注意什么？

### 6.1. .tsbuildinfo 文件管理

```text
# .gitignore
*.tsbuildinfo
.tsbuildinfo
cache/*.tsbuildinfo
dist/.tsbuildinfo

# ⚠️ 不要提交到 git
# ✅ 每个开发者本地生成
# ✅ CI 环境每次全新构建
```

### 6.2. 清理缓存

```bash
# 删除缓存文件
rm tsconfig.tsbuildinfo

# 或通过脚本
npm run clean

# package.json
{
  "scripts": {
    "clean": "rm -rf dist *.tsbuildinfo",
    "build": "npm run clean && tsc"
  }
}
```

### 6.3. 何时重新构建

```text
✅ 需要完全重新构建的情况：
- tsconfig.json 配置更改
- 依赖包版本更新
- 切换 git 分支
- CI/CD 环境
- 构建结果异常

❌ 不需要重新构建：
- 修改源文件
- 添加新文件
- 删除文件
```

### 6.4. 与项目引用结合

```json
// 根 tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/app" }
  ]
}

// packages/core/tsconfig.json
{
  "compilerOptions": {
    "composite": true,  // 自动启用 incremental
    "outDir": "./dist"
  }
}
```

```bash
# 使用 --build 模式
tsc --build  # 自动增量编译所有项目
```

### 6.5. 性能影响

```text
首次编译：
- 需要生成 .tsbuildinfo 文件
- 稍慢于普通编译（+5-10%）

后续编译：
- 读取缓存，快速判断
- 显著提升速度（50-90%）

文件大小：
- .tsbuildinfo 文件较小（几 KB 到几 MB）
- 与项目规模成正比
```

### 6.6. 内存占用

```json
{
  "compilerOptions": {
    "incremental": true
  },
  "watchOptions": {
    "excludeDirectories": ["**/node_modules", "dist"]
  }
}
```

### 6.7. 构建工具集成

```json
// webpack.config.js
{
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,  // 配合增量编译
          experimentalWatchApi: true
        }
      }
    }]
  }
}
```

### 6.8. CI/CD 环境

```yaml
# .github/workflows/build.yml
name: Build
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      # ❌ 不推荐：CI 中使用增量编译
      # - run: npm run build

      # ✅ 推荐：CI 中完全重新构建
      - run: npm run clean && npm run build
```

### 6.9. 监听模式优化

```bash
# 开发环境
tsc --watch --incremental

# 快速反馈循环：
# 1. 修改文件
# 2. 自动增量编译（< 1秒）
# 3. 查看结果
```

### 6.10. 文件系统事件

```json
{
  "compilerOptions": {
    "incremental": true
  },
  "watchOptions": {
    "watchFile": "useFsEvents", // 使用文件系统事件
    "fallbackPolling": "dynamicPriority"
  }
}
```

### 6.11. 调试信息

```bash
# 查看增量编译信息
tsc --incremental --extendedDiagnostics

# 输出示例：
# Files: 245
# Lines: 48932
# Nodes: 201837
# Identifiers: 75843
# Symbols: 52941
# Types: 18234
# Instantiations: 45621
# I/O Read time: 0.15s
# Parse time: 0.73s
# Bind time: 0.34s
# Check time: 2.45s
# Emit time: 0.58s
# Total time: 4.25s
```

### 6.12. 多进程构建

```bash
# 使用项目引用 + 增量编译
tsc --build --incremental

# TypeScript 自动优化：
# - 并行编译独立项目
# - 增量编译每个项目
# - 最大化构建效率
```

## 7. 🔗 引用

- [TypeScript incremental][1]
- [Build Mode][2]
- [Performance Guide][3]

[1]: https://www.typescriptlang.org/tsconfig#incremental
[2]: https://www.typescriptlang.org/docs/handbook/project-references.html#build-mode-for-typescript
[3]: https://github.com/microsoft/TypeScript/wiki/Performance
