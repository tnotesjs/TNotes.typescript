# [0243. include 和 exclude](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0243.%20include%20%E5%92%8C%20exclude)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. include 和 exclude 是什么？](#3-include-和-exclude-是什么)
  - [3.1. include](#31-include)
  - [3.2. exclude](#32-exclude)
  - [3.3. 基本示例](#33-基本示例)
- [4. 如何使用 glob 模式？](#4-如何使用-glob-模式)
  - [4.1. 基本通配符](#41-基本通配符)
  - [4.2. ? 单字符匹配](#42--单字符匹配)
  - [4.3. \*\* 递归目录](#43--递归目录)
  - [4.4. 多种扩展名](#44-多种扩展名)
  - [4.5. 排除特定文件](#45-排除特定文件)
- [5. include vs. exclude](#5-include-vs-exclude)
  - [5.1. 优先级规则](#51-优先级规则)
- [6. 常见配置场景？](#6-常见配置场景)
  - [6.1. 标准项目](#61-标准项目)
  - [6.2. 多源目录](#62-多源目录)
  - [6.3. Monorepo](#63-monorepo)
  - [6.4. 包含测试文件](#64-包含测试文件)
  - [6.5. 类型声明文件](#65-类型声明文件)
  - [6.6. 脚本和配置](#66-脚本和配置)
  - [6.7. 文档和示例](#67-文档和示例)
- [7. 使用时需要注意什么？](#7-使用时需要注意什么)
  - [7.1. 默认 exclude](#71-默认-exclude)
  - [7.2. include 和 files 的关系](#72-include-和-files-的关系)
  - [7.3. 路径解析](#73-路径解析)
  - [7.4. 性能优化](#74-性能优化)
  - [7.5. 隐藏文件](#75-隐藏文件)
  - [7.6. 符号链接](#76-符号链接)
  - [7.7. 与 tsconfig.json 位置](#77-与-tsconfigjson-位置)
  - [7.8. 构建工具集成](#78-构建工具集成)
  - [7.9. 类型检查范围](#79-类型检查范围)
  - [7.10. extends 继承](#710-extends-继承)
- [8. 引用](#8-引用)

<!-- endregion:toc -->

## 1. 本节内容

- include 包含规则
- exclude 排除规则
- glob 模式语法
- 优先级规则
- 默认行为
- 常见配置模式

## 2. 评价

`include` 和 `exclude` 控制哪些文件被编译，是项目文件管理的核心配置。

- include 指定要编译的文件
- exclude 排除不需要的文件
- 支持 glob 模式匹配
- 有明确的优先级规则
- 默认值需要注意
- 合理配置提高编译效率

## 3. include 和 exclude 是什么？

### 3.1. include

指定要包含在编译中的文件或目录模式。

```json
{
  "include": ["src/**/*", "types/**/*"]
}
```

### 3.2. exclude

指定要排除的文件或目录模式。

```json
{
  "exclude": ["node_modules", "dist", "**/*.spec.ts"]
}
```

### 3.3. 基本示例

```text
项目结构：
my-project/
├── src/
│   ├── index.ts
│   ├── utils.ts
│   └── test.spec.ts
├── dist/
├── node_modules/
└── tsconfig.json
```

```json
{
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["**/*.spec.ts", "node_modules", "dist"]
}
```

```text
编译文件：
✅ src/index.ts
✅ src/utils.ts
❌ src/test.spec.ts (被 exclude)
❌ node_modules/**
❌ dist/**
```

## 4. 如何使用 glob 模式？

### 4.1. 基本通配符

```json
{
  "include": [
    "*", // 匹配当前目录所有文件
    "*.ts", // 匹配所有 .ts 文件
    "src/*", // 匹配 src 下一层文件
    "src/**/*", // 匹配 src 下所有文件（递归）
    "**/*.ts" // 匹配所有 .ts 文件（递归）
  ]
}
```

### 4.2. ? 单字符匹配

```json
{
  "include": [
    "src/file?.ts" // 匹配 file1.ts, fileA.ts
  ]
}
```

### 4.3. \*\* 递归目录

```json
{
  "include": [
    "src/**/*.ts", // 匹配 src 下所有 .ts 文件
    "**/components/*" // 匹配任意深度的 components 目录
  ]
}
```

### 4.4. 多种扩展名

```json
{
  "include": [
    "src/**/*.{ts,tsx}" // 匹配 .ts 和 .tsx
  ]
}
```

### 4.5. 排除特定文件

```json
{
  "exclude": [
    "**/*.spec.ts", // 所有测试文件
    "**/*.test.ts", // 所有测试文件
    "**/__tests__/**" // 测试目录
  ]
}
```

## 5. include vs. exclude

| 特性 | include | exclude |
| --- | --- | --- |
| 作用 | 指定包含的文件 | 指定排除的文件 |
| 默认值 | `["**/*"]` | `["node_modules", "bower_components", "jspm_packages", outDir]` |
| 优先级 | 低于 files | 高于 include |
| 必需性 | 可选 | 可选 |
| 适用范围 | 主动选择文件 | 过滤不需要的文件 |
| 常见用途 | 指定源码目录 | 排除构建产物、依赖 |

### 5.1. 优先级规则

```text
files > exclude > include

1. files 明确指定的文件，始终包含
2. exclude 排除的文件，不会编译
3. include 包含的文件，但可被 exclude 排除
```

## 6. 常见配置场景？

### 6.1. 标准项目

```json
{
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.spec.ts"]
}
```

### 6.2. 多源目录

```json
{
  "include": ["src/**/*", "lib/**/*", "types/**/*"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
```

### 6.3. Monorepo

```json
{
  "include": ["packages/*/src/**/*"],
  "exclude": ["packages/*/dist", "packages/*/node_modules", "**/*.spec.ts"]
}
```

### 6.4. 包含测试文件

```json
// 开发环境
{
  "include": [
    "src/**/*",
    "test/**/*"
  ]
}

// 生产构建
{
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "**/*.spec.ts",
    "test/**/*"
  ]
}
```

### 6.5. 类型声明文件

```json
{
  "include": [
    "src/**/*",
    "types/**/*.d.ts" // 包含自定义类型声明
  ],
  "exclude": [
    "node_modules/@types" // 排除特定类型包
  ]
}
```

### 6.6. 脚本和配置

```json
{
  "include": ["src/**/*"],
  "exclude": [
    "scripts/**/*", // 排除构建脚本
    "config/**/*", // 排除配置文件
    "*.config.js" // 排除根配置
  ]
}
```

### 6.7. 文档和示例

```json
{
  "include": ["src/**/*"],
  "exclude": ["docs/**/*", "examples/**/*", "**/*.md"]
}
```

## 7. 使用时需要注意什么？

### 7.1. 默认 exclude

```json
// 如果不指定 exclude，默认为：
{
  "exclude": [
    "node_modules",
    "bower_components",
    "jspm_packages",
    "./dist"  // 如果设置了 outDir
  ]
}

// ⚠️ 一旦指定 exclude，默认值失效
{
  "exclude": [
    "**/*.spec.ts"  // ❌ node_modules 不再自动排除
  ]
}

// ✅ 正确做法：显式包含默认值
{
  "exclude": [
    "node_modules",
    "dist",
    "**/*.spec.ts"
  ]
}
```

### 7.2. include 和 files 的关系

```json
{
  "files": [
    "src/main.ts" // 始终包含，不受 exclude 影响
  ],
  "include": ["src/**/*"],
  "exclude": [
    "src/main.ts" // ⚠️ 无效，files 优先级更高
  ]
}
```

### 7.3. 路径解析

```json
{
  // ✅ 相对于 tsconfig.json 所在目录
  "include": [
    "./src/**/*", // 推荐显式相对路径
    "src/**/*" // 也可以省略 ./
  ],

  // ❌ 不支持绝对路径
  "include": [
    "/Users/username/project/src/**/*" // 影响可移植性
  ]
}
```

### 7.4. 性能优化

```json
{
  // ✅ 精确的 include 提高性能
  "include": ["src/**/*.ts", "src/**/*.tsx"],

  // ⚠️ 过于宽泛影响性能
  "include": [
    "**/*" // 扫描所有文件
  ]
}
```

### 7.5. 隐藏文件

```json
{
  "include": ["src/**/*"],
  // ✅ 默认排除以 . 开头的文件
  // .cache/
  // .temp/

  // 如需包含，需显式指定
  "include": ["src/**/*", ".config/**/*"]
}
```

### 7.6. 符号链接

```text
项目：
src/
  utils/ -> ../shared/utils  (符号链接)
shared/
  utils/
```

```json
{
  "compilerOptions": {
    "preserveSymlinks": true // 保留符号链接
  },
  "include": [
    "src/**/*",
    "shared/**/*" // 需要包含实际目录
  ]
}
```

### 7.7. 与 tsconfig.json 位置

```text
项目结构：
my-project/
├── frontend/
│   ├── src/
│   └── tsconfig.json
└── backend/
    ├── src/
    └── tsconfig.json
```

```json
// frontend/tsconfig.json
{
  "include": [
    "src/**/*"  // 相对于 frontend/
  ]
}

// backend/tsconfig.json
{
  "include": [
    "src/**/*"  // 相对于 backend/
  ]
}
```

### 7.8. 构建工具集成

```json
// 与 webpack 配合
{
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "webpack.config.js"
  ]
}

// 与 Jest 配合
{
  "include": [
    "src/**/*",
    "test/**/*"
  ],
  "exclude": [
    "**/*.spec.ts"  // Jest 单独处理
  ]
}
```

### 7.9. 类型检查范围

```json
{
  // ✅ 只检查源码
  "include": ["src/**/*"],

  // ⚠️ 包含太多文件降低性能
  "include": [
    "src/**/*",
    "node_modules/**/*" // 通常不需要
  ]
}
```

### 7.10. extends 继承

```json
// tsconfig.base.json
{
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules"
  ]
}

// tsconfig.json
{
  "extends": "./tsconfig.base.json",
  // ⚠️ include/exclude 不会合并，会完全覆盖
  "include": [
    "src/**/*",
    "test/**/*"  // 覆盖基础配置
  ]
}
```

## 8. 引用

- [TypeScript include][1]
- [TypeScript exclude][2]
- [File Inclusion][3]

[1]: https://www.typescriptlang.org/tsconfig#include
[2]: https://www.typescriptlang.org/tsconfig#exclude
[3]: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#details
