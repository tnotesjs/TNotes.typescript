# [0245. extends 继承配置](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0245.%20extends%20%E7%BB%A7%E6%89%BF%E9%85%8D%E7%BD%AE)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. extends 是什么？](#3-extends-是什么)
  - [3.1. 基本概念](#31-基本概念)
  - [3.2. 实际效果](#32-实际效果)
- [4. 如何使用 extends？](#4-如何使用-extends)
  - [4.1. 相对路径](#41-相对路径)
  - [4.2. npm 包](#42-npm-包)
  - [4.3. 常用预设包](#43-常用预设包)
  - [4.4. 多层继承](#44-多层继承)
- [5. 继承规则和覆盖机制？](#5-继承规则和覆盖机制)
  - [5.1. compilerOptions 合并](#51-compileroptions-合并)
  - [5.2. files/include/exclude 完全覆盖](#52-filesincludeexclude-完全覆盖)
  - [5.3. 相对路径解析](#53-相对路径解析)
- [6. 常见配置模式？](#6-常见配置模式)
  - [6.1. 基础配置 + 环境配置](#61-基础配置--环境配置)
  - [6.2. Monorepo 配置](#62-monorepo-配置)
  - [6.3. 测试配置](#63-测试配置)
  - [6.4. 构建工具特定配置](#64-构建工具特定配置)
  - [6.5. 库项目配置](#65-库项目配置)
- [7. 使用时需要注意什么？](#7-使用时需要注意什么)
  - [7.1. 路径解析](#71-路径解析)
  - [7.2. 循环继承](#72-循环继承)
  - [7.3. files/include/exclude 不合并](#73-filesincludeexclude-不合并)
  - [7.4. compilerOptions 细粒度覆盖](#74-compileroptions-细粒度覆盖)
  - [7.5. 预设包版本](#75-预设包版本)
  - [7.6. 相对路径基准](#76-相对路径基准)
  - [7.7. 命令行选项优先级](#77-命令行选项优先级)
  - [7.8. 编辑器支持](#78-编辑器支持)
  - [7.9. package.json scripts](#79-packagejson-scripts)
  - [7.10. 调试配置](#710-调试配置)
- [8. 引用](#8-引用)

<!-- endregion:toc -->

## 1. 本节内容

- extends 配置继承
- 继承规则
- 覆盖机制
- 多环境配置
- 预设配置包
- 实际应用场景

## 2. 评价

`extends` 允许 tsconfig.json 继承其他配置文件，实现配置复用和多环境管理。

- 避免配置重复
- 支持多环境配置
- 可使用社区预设
- 配置覆盖灵活
- 简化项目管理
- 是大型项目的标准实践

## 3. extends 是什么？

### 3.1. 基本概念

`extends` 允许一个配置文件继承另一个配置文件的选项。

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true
  }
}

// tsconfig.json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

### 3.2. 实际效果

```json
// tsconfig.json 等同于：
{
  "compilerOptions": {
    "target": "ES2020", // 继承自 base
    "module": "commonjs", // 继承自 base
    "strict": true, // 继承自 base
    "outDir": "./dist" // 自己定义
  }
}
```

## 4. 如何使用 extends？

### 4.1. 相对路径

```text
项目结构：
my-project/
├── config/
│   └── tsconfig.base.json
├── src/
└── tsconfig.json
```

```json
// tsconfig.json
{
  "extends": "./config/tsconfig.base.json"
}
```

### 4.2. npm 包

```bash
npm install --save-dev @tsconfig/node16
```

```json
{
  "extends": "@tsconfig/node16/tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

### 4.3. 常用预设包

```bash
# Node.js 16
npm install @tsconfig/node16

# React
npm install @tsconfig/react-native

# Deno
npm install @tsconfig/deno
```

```json
// Node.js 16 配置
{
  "extends": "@tsconfig/node16/tsconfig.json"
}

// React Native 配置
{
  "extends": "@tsconfig/react-native/tsconfig.json"
}
```

### 4.4. 多层继承

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "strict": true
  }
}

// tsconfig.common.json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2020"
  }
}

// tsconfig.json
{
  "extends": "./tsconfig.common.json",
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

## 5. 继承规则和覆盖机制？

### 5.1. compilerOptions 合并

```json
// base
{
  "compilerOptions": {
    "target": "ES2015",
    "strict": true,
    "module": "commonjs"
  }
}

// child（覆盖）
{
  "extends": "./base",
  "compilerOptions": {
    "target": "ES2020",    // ✅ 覆盖
    "outDir": "./dist"     // ✅ 新增
    // strict 和 module 继承
  }
}

// 最终结果
{
  "compilerOptions": {
    "target": "ES2020",    // 覆盖
    "strict": true,        // 继承
    "module": "commonjs",  // 继承
    "outDir": "./dist"     // 新增
  }
}
```

### 5.2. files/include/exclude 完全覆盖

```json
// base
{
  "include": ["src/**/*"]
}

// child
{
  "extends": "./base",
  "include": ["lib/**/*"]  // ⚠️ 完全覆盖，不合并
}

// 最终结果
{
  "include": ["lib/**/*"]  // 只包含 lib，不包含 src
}
```

### 5.3. 相对路径解析

```text
项目结构：
my-project/
├── config/
│   └── tsconfig.base.json  (include: ["../src/**/*"])
└── tsconfig.json           (extends: "./config/tsconfig.base.json")
```

```json
// config/tsconfig.base.json
{
  "include": ["../src/**/*"],  // 相对于 config/
  "compilerOptions": {
    "outDir": "../dist"        // 相对于 config/
  }
}

// tsconfig.json
{
  "extends": "./config/tsconfig.base.json"
  // include 和 outDir 的相对路径相对于 config/
}
```

## 6. 常见配置模式？

### 6.1. 基础配置 + 环境配置

```json
// tsconfig.base.json（通用配置）
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}

// tsconfig.json（开发环境）
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "sourceMap": true,
    "incremental": true
  }
}

// tsconfig.prod.json（生产环境）
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./build",
    "sourceMap": false,
    "removeComments": true,
    "declaration": true
  }
}
```

### 6.2. Monorepo 配置

```text
monorepo/
├── tsconfig.base.json
├── packages/
│   ├── core/
│   │   └── tsconfig.json
│   ├── utils/
│   │   └── tsconfig.json
│   └── types/
│       └── tsconfig.json
```

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "declaration": true,
    "declarationMap": true
  }
}

// packages/core/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

### 6.3. 测试配置

```json
// tsconfig.json（主配置）
{
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["**/*.spec.ts"]
}

// tsconfig.test.json（测试配置）
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist-test",
    "types": ["jest", "node"]
  },
  "include": ["src/**/*", "test/**/*"]
}
```

### 6.4. 构建工具特定配置

```json
// tsconfig.webpack.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "bundler"
  }
}

// tsconfig.esbuild.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "esnext",
    "target": "esnext"
  }
}
```

### 6.5. 库项目配置

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2015",
    "strict": true
  }
}

// tsconfig.esm.json（ESM 构建）
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "module": "esnext",
    "outDir": "./dist/esm"
  }
}

// tsconfig.cjs.json（CommonJS 构建）
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "module": "commonjs",
    "outDir": "./dist/cjs"
  }
}
```

## 7. 使用时需要注意什么？

### 7.1. 路径解析

```text
项目：
my-project/
├── config/
│   └── tsconfig.base.json
└── tsconfig.json
```

```json
// ✅ 相对路径（推荐）
{
  "extends": "./config/tsconfig.base.json"
}

// ✅ npm 包
{
  "extends": "@tsconfig/node16/tsconfig.json"
}

// ❌ 绝对路径（不推荐）
{
  "extends": "/Users/username/project/config/base.json"
}
```

### 7.2. 循环继承

```json
// a.json
{
  "extends": "./b.json"  // ❌ 错误：循环继承
}

// b.json
{
  "extends": "./a.json"
}
```

```text
编译错误：
error TS18028: Cannot find base config file 'a.json'.
```

### 7.3. files/include/exclude 不合并

```json
// base
{
  "include": ["src/**/*"],
  "exclude": ["**/*.spec.ts"]
}

// child
{
  "extends": "./base",
  "include": ["lib/**/*"]
  // ⚠️ exclude 被丢弃，需要重新指定
}

// ✅ 正确做法
{
  "extends": "./base",
  "include": ["lib/**/*"],
  "exclude": ["**/*.spec.ts"]  // 重新指定
}
```

### 7.4. compilerOptions 细粒度覆盖

```json
// base
{
  "compilerOptions": {
    "lib": ["ES2015", "DOM"]
  }
}

// child
{
  "extends": "./base",
  "compilerOptions": {
    "lib": ["ES2020"]  // ⚠️ 完全覆盖，不合并
  }
}

// 结果：只有 ES2020，没有 DOM
```

### 7.5. 预设包版本

```json
{
  "devDependencies": {
    "@tsconfig/node16": "^1.0.0" // ⚠️ 注意版本
  }
}
```

```json
{
  "extends": "@tsconfig/node16/tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

### 7.6. 相对路径基准

```json
// config/base.json
{
  "compilerOptions": {
    "outDir": "../dist"  // 相对于 config/
  }
}

// tsconfig.json
{
  "extends": "./config/base.json"
  // outDir 解析为 config/../dist = dist
}
```

### 7.7. 命令行选项优先级

```bash
# 命令行选项优先级最高
tsc --strict false

# 即使配置中 strict: true，命令行也会覆盖
```

### 7.8. 编辑器支持

```json
{
  "extends": "./config/base.json"
  // ✅ VS Code 支持跳转到基础配置
  // ✅ 智能提示包含继承的选项
}
```

### 7.9. package.json scripts

```json
{
  "scripts": {
    "build": "tsc",
    "build:prod": "tsc -p tsconfig.prod.json",
    "build:test": "tsc -p tsconfig.test.json"
  }
}
```

### 7.10. 调试配置

```bash
# 查看最终合并的配置
tsc --showConfig

# 查看特定配置文件
tsc -p tsconfig.prod.json --showConfig
```

## 8. 引用

- [TypeScript extends][1]
- [TSConfig Bases][2]
- [Configuration Inheritance][3]

[1]: https://www.typescriptlang.org/tsconfig#extends
[2]: https://github.com/tsconfig/bases
[3]: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
