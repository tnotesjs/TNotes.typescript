# [0259. tsc --watch 模式](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0259.%20tsc%20--watch%20%E6%A8%A1%E5%BC%8F)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 watch 模式是什么？](#3--watch-模式是什么)
  - [3.1. 主要特点](#31-主要特点)
  - [3.2. 适用场景](#32-适用场景)
- [4. 🤔 如何启动 watch 模式？](#4--如何启动-watch-模式)
  - [4.1. 基本用法](#41-基本用法)
  - [4.2. 监听单个文件](#42-监听单个文件)
  - [4.3. 监听项目](#43-监听项目)
  - [4.4. watch 模式输出](#44-watch-模式输出)
  - [4.5. 项目引用 watch](#45-项目引用-watch)
- [5. 🤔 watch 模式的工作原理？](#5--watch-模式的工作原理)
  - [5.1. 文件监听机制](#51-文件监听机制)
  - [5.2. 示例演示](#52-示例演示)
- [6. 🤔 如何配置 watch 选项？](#6--如何配置-watch-选项)
  - [6.1. watchOptions 配置](#61-watchoptions-配置)
  - [6.2. watchFile 策略](#62-watchfile-策略)
  - [6.3. watchDirectory 策略](#63-watchdirectory-策略)
  - [6.4. 排除监听](#64-排除监听)
- [7. 🤔 如何优化 watch 性能？](#7--如何优化-watch-性能)
  - [7.1. 排除不必要的目录](#71-排除不必要的目录)
  - [7.2. 使用项目引用](#72-使用项目引用)
  - [7.3. 启用增量编译](#73-启用增量编译)
  - [7.4. 使用 skipLibCheck](#74-使用-skiplibcheck)
  - [7.5. 性能对比](#75-性能对比)
  - [7.6. 配合 nodemon 使用](#76-配合-nodemon-使用)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- watch 模式概念
- 启动 watch 模式
- 工作原理
- 配置选项
- 性能优化

## 2. 🫧 评价

watch 模式是开发时的必备功能，可以自动监听文件变化并重新编译。

- 开发必备功能
- 自动监听文件变化
- 增量编译提升速度
- 可配置监听策略
- 节省手动编译时间
- 提升开发体验

## 3. 🤔 watch 模式是什么？

watch 模式会持续监听文件变化，当文件改变时自动重新编译。

### 3.1. 主要特点

```text
1. 自动监听
   - 监听源文件变化
   - 监听配置文件变化
   - 自动触发重新编译

2. 增量编译
   - 只编译变化的文件
   - 利用增量缓存
   - 编译速度更快

3. 实时反馈
   - 显示编译进度
   - 显示错误信息
   - 显示编译时间

4. 持续运行
   - 后台持续运行
   - 等待文件变化
   - Ctrl+C 退出
```

### 3.2. 适用场景

```text
✅ 适合使用 watch 模式：
- 本地开发
- 调试代码
- 实时预览
- 前端开发
- 全栈开发

❌ 不适合使用 watch 模式：
- CI/CD 构建
- 生产构建
- 一次性编译
- 服务器部署
```

## 4. 🤔 如何启动 watch 模式？

### 4.1. 基本用法

```bash
# 启动 watch 模式
tsc --watch

# 简写
tsc -w
```

### 4.2. 监听单个文件

```bash
# 监听指定文件
tsc --watch index.ts
```

```ts
// index.ts
console.log('Hello, TypeScript!')

// 修改文件后自动重新编译
console.log('Hello, TypeScript! Updated')
```

### 4.3. 监听项目

```bash
# 监听整个项目（使用 tsconfig.json）
tsc --watch

# 指定配置文件
tsc --watch --project tsconfig.json
```

### 4.4. watch 模式输出

```bash
$ tsc --watch

[上午10:30:45] Starting compilation in watch mode...

[上午10:30:48] Found 0 errors. Watching for file changes.

# 修改文件后
[上午10:31:23] File change detected. Starting incremental compilation...

[上午10:31:24] Found 0 errors. Watching for file changes.
```

### 4.5. 项目引用 watch

```bash
# 监听项目引用
tsc --build --watch

# 简写
tsc -b -w
```

## 5. 🤔 watch 模式的工作原理？

### 5.1. 文件监听机制

```text
1. 初始编译
   ├── 读取配置文件
   ├── 解析所有源文件
   ├── 执行类型检查
   └── 生成输出文件

2. 监听文件系统
   ├── 使用文件系统监听 API
   ├── 监听 include 中的文件
   └── 监听 tsconfig.json

3. 检测到变化
   ├── 确定变化的文件
   ├── 分析依赖关系
   ├── 标记需要重新编译的文件
   └── 执行增量编译

4. 增量编译
   ├── 只处理变化的文件
   ├── 重用未变化文件的缓存
   ├── 更新类型信息
   └── 生成新的输出
```

### 5.2. 示例演示

```ts
// utils.ts
export function add(a: number, b: number): number {
  return a + b
}

// index.ts
import { add } from './utils'
console.log(add(1, 2))
```

```text
启动 watch：
$ tsc --watch

1. 初始编译：
   - 编译 utils.ts → utils.js
   - 编译 index.ts → index.js
   - 分析依赖关系

2. 修改 utils.ts：
   - 检测到 utils.ts 变化
   - 重新编译 utils.ts
   - 检查 index.ts 是否需要重新编译（依赖 utils）
   - 必要时重新编译 index.ts

3. 修改 index.ts：
   - 检测到 index.ts 变化
   - 只重新编译 index.ts
   - utils.ts 不受影响
```

## 6. 🤔 如何配置 watch 选项？

### 6.1. watchOptions 配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "outDir": "./dist",
    "sourceMap": true
  },
  "watchOptions": {
    "watchFile": "useFsEvents",
    "watchDirectory": "useFsEvents",
    "fallbackPolling": "dynamicPriority",
    "synchronousWatchDirectory": true,
    "excludeDirectories": ["**/node_modules", "_build"],
    "excludeFiles": ["build/fileWhichChangesOften.ts"]
  }
}
```

### 6.2. watchFile 策略

```json
{
  "watchOptions": {
    "watchFile": "useFsEvents" // 推荐：使用文件系统事件
  }
}
```

可选值：

- `fixedPollingInterval`：固定间隔轮询
- `priorityPollingInterval`：优先级轮询
- `dynamicPriorityPolling`：动态优先级轮询
- `useFsEvents`：使用文件系统事件（推荐）
- `useFsEventsOnParentDirectory`：监听父目录事件

### 6.3. watchDirectory 策略

```json
{
  "watchOptions": {
    "watchDirectory": "useFsEvents" // 推荐
  }
}
```

可选值：

- `fixedPollingInterval`：固定间隔轮询
- `dynamicPriorityPolling`：动态优先级轮询
- `useFsEvents`：使用文件系统事件（推荐）

### 6.4. 排除监听

```json
{
  "watchOptions": {
    "excludeDirectories": [
      "**/node_modules", // 排除 node_modules
      "**/dist", // 排除构建目录
      "**/.git" // 排除 git 目录
    ],
    "excludeFiles": [
      "src/generated/**/*" // 排除自动生成的文件
    ]
  }
}
```

## 7. 🤔 如何优化 watch 性能？

### 7.1. 排除不必要的目录

```json
{
  "exclude": ["node_modules", "dist", "build", "coverage"],
  "watchOptions": {
    "excludeDirectories": ["**/node_modules", "**/dist"]
  }
}
```

### 7.2. 使用项目引用

```json
// packages/core/tsconfig.json
{
  "compilerOptions": {
    "composite": true,
    "incremental": true
  }
}

// packages/app/tsconfig.json
{
  "references": [
    { "path": "../core" }
  ]
}
```

```bash
# 使用构建模式 watch
tsc --build --watch

# 好处：
# - 只重新构建变化的项目
# - 利用项目间的增量编译
# - 大幅提升大型项目性能
```

### 7.3. 启用增量编译

```json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo"
  }
}
```

### 7.4. 使用 skipLibCheck

```json
{
  "compilerOptions": {
    "skipLibCheck": true // ✅ 跳过库文件检查
  }
}
```

### 7.5. 性能对比

```text
大型项目（1000+ 文件）：

不使用 watch：
- 每次修改需要手动运行 tsc
- 每次全量编译：30-60 秒

使用 watch（无优化）：
- 首次编译：30-60 秒
- 增量编译：10-20 秒

使用 watch（优化后）：
- 首次编译：30-60 秒
- 增量编译：2-5 秒  ✅ 提升 80%+

优化措施：
✅ 项目引用
✅ incremental: true
✅ skipLibCheck: true
✅ 排除不必要的目录
✅ useFsEvents 监听策略
```

### 7.6. 配合 nodemon 使用

```json
// nodemon.json
{
  "watch": ["dist"],
  "ext": "js",
  "exec": "node dist/index.js"
}
```

```json
// package.json
{
  "scripts": {
    "dev": "concurrently \"tsc --watch\" \"nodemon\""
  }
}
```

```bash
# 安装依赖
npm install --save-dev nodemon concurrently

# 运行开发模式
npm run dev

# 效果：
# - tsc --watch 监听 TS 文件，自动编译
# - nodemon 监听 JS 文件，自动重启
```

## 8. 🔗 引用

- [Watch Options][1]
- [Compiler Options][2]
- [Project References][3]

[1]: https://www.typescriptlang.org/tsconfig#watchOptions
[2]: https://www.typescriptlang.org/docs/handbook/compiler-options.html
[3]: https://www.typescriptlang.org/docs/handbook/project-references.html
