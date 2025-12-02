# [0244. files 选项](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0244.%20files%20%E9%80%89%E9%A1%B9)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 files 选项是什么？](#3--files-选项是什么)
  - [3.1. 基本用法](#31-基本用法)
  - [3.2. 相对路径](#32-相对路径)
  - [3.3. 自动包含依赖](#33-自动包含依赖)
  - [3.4. 不支持 glob](#34-不支持-glob)
- [4. 🆚 files vs. include vs. exclude](#4--files-vs-include-vs-exclude)
  - [4.1. 优先级示例](#41-优先级示例)
- [5. 🤔 何时使用 files？](#5--何时使用-files)
  - [5.1. 小型项目](#51-小型项目)
  - [5.2. 入口文件](#52-入口文件)
  - [5.3. 特定构建场景](#53-特定构建场景)
  - [5.4. 类型声明文件](#54-类型声明文件)
  - [5.5. 多配置文件](#55-多配置文件)
  - [5.6. 避免使用 files 的场景](#56-避免使用-files-的场景)
- [6. 🤔 使用时需要注意什么？](#6--使用时需要注意什么)
  - [6.1. files 为空](#61-files-为空)
  - [6.2. 文件不存在](#62-文件不存在)
  - [6.3. 依赖的自动包含](#63-依赖的自动包含)
  - [6.4. 动态导入](#64-动态导入)
  - [6.5. 类型引用](#65-类型引用)
  - [6.6. 与 include/exclude 结合](#66-与-includeexclude-结合)
  - [6.7. 路径分隔符](#67-路径分隔符)
  - [6.8. 绝对路径](#68-绝对路径)
  - [6.9. 项目引用](#69-项目引用)
  - [6.10. 性能考虑](#610-性能考虑)
  - [6.11. 编辑器集成](#611-编辑器集成)
  - [6.12. 命令行覆盖](#612-命令行覆盖)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- files 选项的作用
- 精确指定文件列表
- 与 include/exclude 的区别
- 使用场景
- 优先级规则

## 2. 🫧 评价

`files` 选项用于精确指定要编译的文件列表，优先级最高，适合小型项目或特定场景。

- 明确列出每个文件
- 不支持 glob 模式
- 优先级最高
- 适合小型精确控制
- 自动包含依赖文件
- 大型项目更适合用 include

## 3. 🤔 files 选项是什么？

### 3.1. 基本用法

`files` 接受一个文件路径数组，精确指定要编译的文件。

```json
{
  "compilerOptions": {
    "outDir": "./dist"
  },
  "files": ["src/index.ts", "src/utils.ts", "src/types.ts"]
}
```

### 3.2. 相对路径

所有路径都相对于 `tsconfig.json` 所在目录。

```text
项目结构：
my-project/
├── src/
│   ├── index.ts
│   ├── utils.ts
│   └── models/
│       └── user.ts
└── tsconfig.json
```

```json
{
  "files": ["src/index.ts", "src/utils.ts", "src/models/user.ts"]
}
```

### 3.3. 自动包含依赖

指定的文件所依赖的文件会自动包含。

```ts
// src/index.ts
import { helper } from './utils'
import { User } from './models/user'

console.log(helper())
```

```json
{
  "files": [
    "src/index.ts" // utils.ts 和 user.ts 自动包含
  ]
}
```

### 3.4. 不支持 glob

```json
{
  "files": [
    "src/*.ts", // ❌ 错误：不支持通配符
    "src/**/*.ts" // ❌ 错误：不支持递归匹配
  ]
}
```

```json
{
  "files": [
    "src/a.ts", // ✅ 正确：明确的文件路径
    "src/b.ts",
    "src/c.ts"
  ]
}
```

## 4. 🆚 files vs. include vs. exclude

| 特性         | files          | include        | exclude                 |
| ------------ | -------------- | -------------- | ----------------------- |
| 文件指定方式 | 精确路径列表   | Glob 模式      | Glob 模式               |
| 支持通配符   | ❌ 否          | ✅ 是          | ✅ 是                   |
| 优先级       | 最高           | 中             | 高（排除）              |
| 自动包含依赖 | ✅ 是          | ✅ 是          | N/A                     |
| 适用场景     | 小型、精确控制 | 大型、模式匹配 | 排除文件                |
| 默认值       | 无             | `["**/*"]`     | `["node_modules", ...]` |

### 4.1. 优先级示例

```json
{
  "files": ["src/main.ts"],
  "include": ["src/**/*"],
  "exclude": [
    "src/main.ts", // ⚠️ 无效，files 优先级更高
    "src/test.ts"
  ]
}
```

```text
编译结果：
✅ src/main.ts    (files 指定，最高优先级)
✅ src/utils.ts   (include 包含)
❌ src/test.ts    (exclude 排除)
```

## 5. 🤔 何时使用 files？

### 5.1. 小型项目

```json
{
  "compilerOptions": {
    "outDir": "./dist"
  },
  "files": ["src/index.ts", "src/config.ts"]
}
```

### 5.2. 入口文件

```json
{
  "compilerOptions": {
    "outDir": "./dist"
  },
  "files": [
    "src/main.ts" // 只指定入口，依赖自动包含
  ]
}
```

### 5.3. 特定构建场景

```json
// 只构建生产代码
{
  "files": [
    "src/index.ts",
    "src/app.ts"
  ]
}

// 只构建测试
{
  "files": [
    "test/index.test.ts"
  ]
}
```

### 5.4. 类型声明文件

```json
{
  "files": ["src/index.ts", "types/custom.d.ts", "types/global.d.ts"]
}
```

### 5.5. 多配置文件

```text
项目结构：
my-project/
├── src/
│   ├── client/
│   └── server/
├── tsconfig.json
├── tsconfig.client.json
└── tsconfig.server.json
```

```json
// tsconfig.client.json
{
  "extends": "./tsconfig.json",
  "files": [
    "src/client/index.ts"
  ]
}

// tsconfig.server.json
{
  "extends": "./tsconfig.json",
  "files": [
    "src/server/index.ts"
  ]
}
```

### 5.6. 避免使用 files 的场景

```json
// ❌ 大型项目（维护困难）
{
  "files": [
    "src/file1.ts",
    "src/file2.ts",
    // ... 100+ 个文件
  ]
}

// ✅ 使用 include 替代
{
  "include": [
    "src/**/*"
  ]
}
```

## 6. 🤔 使用时需要注意什么？

### 6.1. files 为空

```json
{
  "files": [] // ⚠️ 不会编译任何文件
}
```

### 6.2. 文件不存在

```json
{
  "files": [
    "src/index.ts",
    "src/missing.ts" // ❌ 错误：文件不存在
  ]
}
```

```text
编译错误：
error TS6053: File 'src/missing.ts' not found.
```

### 6.3. 依赖的自动包含

```ts
// src/index.ts
import { User } from './models/user'
import { Config } from './config'

// src/models/user.ts
export interface User {
  id: number
  name: string
}

// src/config.ts
export const config = { apiUrl: '...' }
```

```json
{
  "files": ["src/index.ts"]
}
```

```text
实际编译的文件：
✅ src/index.ts      (显式指定)
✅ src/models/user.ts (自动包含，被 index.ts 导入)
✅ src/config.ts     (自动包含，被 index.ts 导入)
```

### 6.4. 动态导入

```ts
// src/index.ts
async function loadModule() {
  const mod = await import('./dynamic') // ⚠️ 动态导入
}
```

```json
{
  "files": [
    "src/index.ts",
    "src/dynamic.ts" // ⚠️ 需要显式包含
  ]
}
```

### 6.5. 类型引用

```ts
// src/index.ts
/// <reference types="node" />

import { User } from './types'
```

```json
{
  "files": [
    "src/index.ts",
    "src/types.ts" // 自动包含（类型导入）
  ]
}
```

### 6.6. 与 include/exclude 结合

```json
{
  "files": [
    "src/main.ts" // 始终包含
  ],
  "include": [
    "src/utils/**/*" // 额外包含
  ],
  "exclude": [
    "src/main.ts", // ⚠️ 无效，files 优先
    "src/utils/test.ts" // ✅ 有效，排除 include 中的文件
  ]
}
```

### 6.7. 路径分隔符

```json
{
  "files": [
    "src/index.ts", // ✅ 推荐：使用正斜杠
    "src\\index.ts" // ⚠️ Windows 反斜杠也可以，但不推荐
  ]
}
```

### 6.8. 绝对路径

```json
{
  "files": [
    "./src/index.ts", // ✅ 推荐：相对路径
    "/Users/name/project/src/a.ts" // ❌ 不推荐：绝对路径
  ]
}
```

### 6.9. 项目引用

```json
// 主项目 tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/utils" }
  ]
}

// packages/core/tsconfig.json
{
  "files": [
    "src/index.ts"
  ]
}
```

### 6.10. 性能考虑

```json
// ⚠️ 每次添加文件都要修改配置
{
  "files": [
    "src/a.ts",
    "src/b.ts",
    // 新增文件需要手动添加
  ]
}

// ✅ 使用 include 自动包含新文件
{
  "include": [
    "src/**/*"
  ]
}
```

### 6.11. 编辑器集成

```json
{
  "files": ["src/index.ts"]
}
```

```text
✅ 编辑器行为：
- 自动完成工作正常
- 类型检查只针对指定文件
- 跳转定义包含依赖文件
```

### 6.12. 命令行覆盖

```bash
# 命令行指定的文件会覆盖 files 配置
tsc src/other.ts

# files 配置失效，只编译 src/other.ts
```

## 7. 🔗 引用

- [TypeScript files][1]
- [tsconfig.json Schema][2]
- [Project Configuration][3]

[1]: https://www.typescriptlang.org/tsconfig#files
[2]: https://json.schemastore.org/tsconfig
[3]: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
