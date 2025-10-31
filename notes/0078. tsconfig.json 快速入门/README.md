# [0078. tsconfig.json 快速入门](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0078.%20tsconfig.json%20%E5%BF%AB%E9%80%9F%E5%85%A5%E9%97%A8)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是 tsconfig.json？](#3--什么是-tsconfigjson)
  - [3.1. `tsconfig.json` 简介](#31-tsconfigjson-简介)
  - [3.2. 作用](#32-作用)
- [4. 🤔 如何创建 tsconfig.json？](#4--如何创建-tsconfigjson)
  - [4.1. 方法 1：自动生成](#41-方法-1自动生成)
  - [4.2. 方法 2：使用社区模板](#42-方法-2使用社区模板)
  - [4.3. 方法 3：手动创建](#43-方法-3手动创建)
- [5. 🤔 tsconfig.json 的基本结构是什么？](#5--tsconfigjson-的基本结构是什么)
  - [5.1. 核心字段](#51-核心字段)
  - [5.2. 字段优先级](#52-字段优先级)
- [6. 🤔 常用编译选项有哪些？](#6--常用编译选项有哪些)
  - [6.1. 必知选项（按重要性排序）](#61-必知选项按重要性排序)
  - [6.2. strict 包含的选项](#62-strict-包含的选项)
  - [6.3. 场景化选项](#63-场景化选项)
- [7. 🤔 不同项目如何配置 tsconfig.json？](#7--不同项目如何配置-tsconfigjson)
  - [7.1. Vite + React 项目](#71-vite--react-项目)
  - [7.2. Next.js 项目](#72-nextjs-项目)
  - [7.3. Nest.js 项目](#73-nestjs-项目)
  - [7.4. Monorepo 项目](#74-monorepo-项目)
- [8. 🤔 如何调试 tsconfig.json 配置？](#8--如何调试-tsconfigjson-配置)
  - [8.1. 查看实际生效的配置](#81-查看实际生效的配置)
  - [8.2. 检查哪些文件会被编译](#82-检查哪些文件会被编译)
  - [8.3. 查看模块解析过程](#83-查看模块解析过程)
  - [8.4. 常见问题排查](#84-常见问题排查)
  - [8.5. 配置验证工具](#85-配置验证工具)
- [9. 🔗 引用](#9--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- tsconfig.json 的作用
- 基本配置项说明
- 常见场景配置模板
- 配置调试技巧
- 最佳实践建议

## 2. 🫧 评价

`tsconfig.json` 是 TypeScript 项目的配置文件，它决定了编译器的行为、类型检查的严格程度以及输出文件的结构。虽然 TypeScript 可以在没有配置文件的情况下工作，但在实际项目中，合理的 `tsconfig.json` 配置是必不可少的。

该配置文件的复杂度在于：它有 **100+ 个配置选项**，每个选项都会影响编译行为。新手常见的问题是：

1. 不知道哪些选项是必需的
2. 不理解选项之间的依赖关系
3. 照搬网上的配置导致问题

本节将从**实用角度**出发，介绍最常用的配置选项，并提供不同场景的配置模板。掌握这些内容后，你就能根据项目需求定制合适的 TypeScript 配置。

## 3. 🤔 什么是 tsconfig.json？

### 3.1. `tsconfig.json` 简介

`tsconfig.json` 是 TypeScript 项目的配置文件，用于指定：

| 配置类别 | 用途 | 示例选项 |
| --- | --- | --- |
| **编译选项** | 控制编译器行为 | `target`, `module`, `strict` |
| **文件包含/排除** | 指定哪些文件需要编译 | `include`, `exclude`, `files` |
| **路径映射** | 配置模块解析 | `paths`, `baseUrl` |
| **类型检查** | 控制类型检查严格度 | `strictNullChecks`, `noImplicitAny` |
| **输出配置** | 控制编译产物 | `outDir`, `declaration` |

### 3.2. 作用

```txt
有 tsconfig.json：
  tsc                # 按配置文件编译项目
  tsc --watch        # 监听模式

没有 tsconfig.json：
  tsc file.ts        # 只能编译单个文件
  tsc file.ts --target ES2020  # 需要手动指定所有选项
```

## 4. 🤔 如何创建 tsconfig.json？

### 4.1. 方法 1：自动生成

```bash
# 生成默认配置
tsc --init

# 生成内容（简化版）：
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### 4.2. 方法 2：使用社区模板

```bash
# 安装基础配置
npm install --save-dev @tsconfig/node18

# 继承配置
{
  "extends": "@tsconfig/node18/tsconfig.json",
  "compilerOptions": {
    // 自定义覆盖
  }
}
```

### 4.3. 方法 3：手动创建

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 5. 🤔 tsconfig.json 的基本结构是什么？

### 5.1. 核心字段

::: code-group

```json [完整结构]
{
  // 继承其他配置
  "extends": "./base-config.json",

  // 编译选项
  "compilerOptions": {
    /* 基础选项 */
    "target": "ES2020", // 目标 JS 版本
    "module": "ESNext", // 模块系统
    "lib": ["ES2020", "DOM"], // 包含的类型库

    /* 严格检查 */
    "strict": true, // 开启所有严格检查

    /* 模块解析 */
    "moduleResolution": "node", // 模块解析策略
    "baseUrl": "./", // 基础路径
    "paths": {
      // 路径映射
      "@/*": ["src/*"]
    },

    /* 输出 */
    "outDir": "./dist", // 输出目录
    "declaration": true, // 生成 .d.ts
    "sourceMap": true // 生成 source map
  },

  // 包含的文件
  "include": ["src/**/*"],

  // 排除的文件
  "exclude": ["node_modules", "dist"],

  // 精确指定文件（不常用）
  "files": ["src/main.ts"]
}
```

```json [最小配置]
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src"]
}
```

:::

### 5.2. 字段优先级

```
files > include/exclude > compilerOptions
```

- `files`：精确指定，优先级最高
- `include`/`exclude`：通配符匹配
- `compilerOptions`：编译行为配置

## 6. 🤔 常用编译选项有哪些？

### 6.1. 必知选项（按重要性排序）

| 选项 | 作用 | 推荐值 | 说明 |
| --- | --- | --- | --- |
| **strict** | 开启所有严格检查 | `true` | 包含 7 个子选项 |
| **target** | 编译目标 | `ES2020` | 根据运行环境选择 |
| **module** | 模块系统 | `ESNext` | 现代项目用 ESNext |
| **lib** | 包含的类型库 | `["ES2020", "DOM"]` | 浏览器项目需要 DOM |
| **outDir** | 输出目录 | `"./dist"` | 编译产物位置 |
| **rootDir** | 源码根目录 | `"./src"` | 保持目录结构 |
| **moduleResolution** | 模块解析策略 | `"node"` | Node.js 风格解析 |
| **esModuleInterop** | ESM/CJS 互操作 | `true` | 兼容默认导入 |
| **skipLibCheck** | 跳过库文件检查 | `true` | 加快编译速度 |

### 6.2. strict 包含的选项

```json
{
  "compilerOptions": {
    "strict": true
    // 等价于：
    // "noImplicitAny": true,           // 禁止隐式 any
    // "strictNullChecks": true,        // 严格 null 检查
    // "strictFunctionTypes": true,     // 严格函数类型
    // "strictBindCallApply": true,     // 严格 bind/call/apply
    // "strictPropertyInitialization": true,  // 类属性必须初始化
    // "noImplicitThis": true,          // 禁止隐式 this
    // "alwaysStrict": true             // 生成 "use strict"
  }
}
```

### 6.3. 场景化选项

::: code-group

```json [React 项目]
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx", // React 17+ 新 JSX 转换
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

```json [Node.js 项目]
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs", // Node.js 使用 CJS
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "types": ["node"] // 包含 Node.js 类型
  }
}
```

```json [库开发]
{
  "compilerOptions": {
    "target": "ES2015", // 兼容性考虑
    "module": "ESNext",
    "declaration": true, // 生成 .d.ts
    "declarationMap": true, // 生成 .d.ts.map
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "skipLibCheck": true
  }
}
```

:::

## 7. 🤔 不同项目如何配置 tsconfig.json？

### 7.1. Vite + React 项目

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 7.2. Next.js 项目

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 7.3. Nest.js 项目

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false
  }
}
```

### 7.4. Monorepo 项目

```json
// 根目录 tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "composite": true,              // 启用项目引用
    "declaration": true,
    "declarationMap": true
  },
  "references": [
    { "path": "./packages/shared" },
    { "path": "./packages/frontend" },
    { "path": "./packages/backend" }
  ]
}

// packages/shared/tsconfig.json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

## 8. 🤔 如何调试 tsconfig.json 配置？

### 8.1. 查看实际生效的配置

```bash
# 查看编译器使用的配置
tsc --showConfig

# 输出示例：
{
  "compilerOptions": {
    "target": "es2020",
    "module": "esnext",
    "strict": true,
    ...
  },
  "files": [],
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 8.2. 检查哪些文件会被编译

```bash
# 列出所有会被编译的文件
tsc --listFiles

# 输出示例：
/path/to/project/src/index.ts
/path/to/project/src/utils.ts
/path/to/project/node_modules/typescript/lib/lib.es2020.d.ts
...
```

### 8.3. 查看模块解析过程

```bash
# 查看模块如何被解析
tsc --traceResolution

# 输出示例：
======== Resolving module 'lodash' from '/path/to/project/src/index.ts'. ========
Module resolution kind is not specified, using 'NodeJs'.
Loading module 'lodash' from 'node_modules' folder, target file type 'TypeScript'.
File '/path/to/project/node_modules/lodash.ts' does not exist.
File '/path/to/project/node_modules/lodash.tsx' does not exist.
...
```

### 8.4. 常见问题排查

::: code-group

```bash [问题 1：文件未被编译]
# 检查 include/exclude 配置
tsc --listFiles | grep "your-file.ts"

# 解决方案：
# 1. 确认文件路径在 include 中
# 2. 确认文件未在 exclude 中
```

```bash [问题 2：模块找不到]
# 检查模块解析
tsc --traceResolution > resolution.log

# 解决方案：
# 1. 检查 moduleResolution 设置
# 2. 检查 paths 配置
# 3. 检查 baseUrl 设置
```

```bash [问题 3：类型错误太多]
# 逐步开启严格检查
{
  "strict": false,
  "noImplicitAny": true,        // 先开启这个
  "strictNullChecks": false     // 逐步开启其他
}
```

:::

### 8.5. 配置验证工具

```json
// 使用 JSON Schema 验证
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    // VS Code 会提供自动补全和错误检查
  }
}
```

## 9. 🔗 引用

- [TSConfig Reference][1]
- [TypeScript 编译选项][2]
- [@tsconfig/bases][3]

[1]: https://www.typescriptlang.org/tsconfig
[2]: https://www.typescriptlang.org/docs/handbook/compiler-options.html
[3]: https://github.com/tsconfig/bases
