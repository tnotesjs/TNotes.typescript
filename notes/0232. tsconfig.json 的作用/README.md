# [0232. tsconfig.json 的作用](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0232.%20tsconfig.json%20%E7%9A%84%E4%BD%9C%E7%94%A8)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是 tsconfig.json？](#3--什么是-tsconfigjson)
  - [3.1. 文件位置和作用](#31-文件位置和作用)
  - [3.2. 基本结构](#32-基本结构)
  - [3.3. 简单示例](#33-简单示例)
- [4. 🤔 tsconfig.json 有哪些核心功能？](#4--tsconfigjson-有哪些核心功能)
  - [4.1. 标识项目根目录](#41-标识项目根目录)
  - [4.2. 控制编译行为](#42-控制编译行为)
  - [4.3. 指定编译范围](#43-指定编译范围)
  - [4.4. 配置类型检查严格度](#44-配置类型检查严格度)
  - [4.5. 配置模块解析](#45-配置模块解析)
  - [4.6. 支持配置继承](#46-支持配置继承)
  - [4.7. 支持项目引用](#47-支持项目引用)
  - [4.8. 影响 IDE 行为](#48-影响-ide-行为)
- [5. 🤔 如何创建和使用 tsconfig.json？](#5--如何创建和使用-tsconfigjson)
  - [5.1. 自动生成配置文件](#51-自动生成配置文件)
  - [5.2. 手动创建基础配置](#52-手动创建基础配置)
  - [5.3. 使用预设配置](#53-使用预设配置)
  - [5.4. 运行编译器](#54-运行编译器)
  - [5.5. 在代码中引用](#55-在代码中引用)
  - [5.6. 多环境配置](#56-多环境配置)
- [6. 🤔 有哪些常用的配置项？](#6--有哪些常用的配置项)
  - [6.1. 编译目标和模块](#61-编译目标和模块)
  - [6.2. 输出配置](#62-输出配置)
  - [6.3. 声明文件](#63-声明文件)
  - [6.4. Source Map](#64-source-map)
  - [6.5. 严格检查](#65-严格检查)
  - [6.6. 额外检查](#66-额外检查)
  - [6.7. 模块解析](#67-模块解析)
  - [6.8. 互操作性](#68-互操作性)
  - [6.9. 实验性功能](#69-实验性功能)
  - [6.10. 文件包含](#610-文件包含)
- [7. 🤔 使用 tsconfig.json 时需要注意什么？](#7--使用-tsconfigjson-时需要注意什么)
  - [7.1. 配置文件位置](#71-配置文件位置)
  - [7.2. 选项覆盖顺序](#72-选项覆盖顺序)
  - [7.3. include 和 exclude 的优先级](#73-include-和-exclude-的优先级)
  - [7.4. files 选项的优先级最高](#74-files-选项的优先级最高)
  - [7.5. 默认排除规则](#75-默认排除规则)
  - [7.6. 路径解析](#76-路径解析)
  - [7.7. strict 模式的影响](#77-strict-模式的影响)
  - [7.8. 增量编译](#78-增量编译)
  - [7.9. 项目引用注意事项](#79-项目引用注意事项)
  - [7.10. 配置文件注释](#710-配置文件注释)
  - [7.11. 与 package.json 的配合](#711-与-packagejson-的配合)
  - [7.12. 监听模式下的文件监控](#712-监听模式下的文件监控)
  - [7.13. 编译性能优化](#713-编译性能优化)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- tsconfig.json 配置文件的作用
- 项目根目录标识
- 编译选项配置
- 文件包含和排除规则
- 项目引用和继承
- 编译器行为控制
- IDE 支持和类型检查

## 2. 🫧 评价

`tsconfig.json` 是 TypeScript 项目的核心配置文件，定义了编译器的行为和项目结构，是 TypeScript 项目必不可少的组成部分。

- 所有 TypeScript 项目都应该有这个文件
- 统一团队的编译规则和代码风格
- 控制类型检查的严格程度
- 配置模块解析和输出目录
- 支持继承和项目引用实现配置复用
- 直接影响开发体验和代码质量

## 3. 🤔 什么是 tsconfig.json？

`tsconfig.json` 是 TypeScript 项目的配置文件，用于指定编译选项和项目设置。

### 3.1. 文件位置和作用

```bash
project/
├── tsconfig.json       # ✅ 项目根目录
├── src/
│   ├── index.ts
│   └── utils.ts
└── dist/
```

当目录中存在 `tsconfig.json` 文件时：

- 表明该目录是 TypeScript 项目的根目录
- `tsc` 命令会自动读取该配置文件
- IDE 会根据配置提供智能提示和类型检查
- 定义项目的编译范围和编译选项

### 3.2. 基本结构

```json
{
  "compilerOptions": {
    // 编译选项
  },
  "include": [
    // 包含的文件
  ],
  "exclude": [
    // 排除的文件
  ],
  "files": [
    // 明确指定的文件
  ]
}
```

### 3.3. 简单示例

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 4. 🤔 tsconfig.json 有哪些核心功能？

### 4.1. 标识项目根目录

```bash
# 有 tsconfig.json 的目录
project/
├── tsconfig.json       # ✅ TypeScript 会识别这是项目根目录
├── src/
│   └── index.ts
```

```bash
# 运行 tsc 命令
cd project
tsc  # ✅ 自动读取 tsconfig.json

# 或指定配置文件
tsc -p tsconfig.json
tsc --project tsconfig.json
```

### 4.2. 控制编译行为

```json
{
  "compilerOptions": {
    "target": "ES2020", // 编译目标
    "module": "commonjs", // 模块系统
    "outDir": "./dist", // 输出目录
    "sourceMap": true, // 生成 source map
    "declaration": true, // 生成 .d.ts 文件
    "removeComments": true, // 移除注释
    "noEmitOnError": true // 有错误时不输出
  }
}
```

### 4.3. 指定编译范围

```json
{
  "include": [
    "src/**/*", // 包含 src 目录下所有文件
    "tests/**/*" // 包含 tests 目录下所有文件
  ],
  "exclude": [
    "node_modules", // 排除 node_modules
    "**/*.spec.ts", // 排除所有测试文件
    "dist" // 排除输出目录
  ]
}
```

### 4.4. 配置类型检查严格度

```json
{
  "compilerOptions": {
    "strict": true, // 启用所有严格检查
    "noImplicitAny": true, // 禁止隐式 any
    "strictNullChecks": true, // 严格的 null 检查
    "strictFunctionTypes": true, // 严格的函数类型检查
    "noUnusedLocals": true, // 检查未使用的局部变量
    "noUnusedParameters": true // 检查未使用的参数
  }
}
```

### 4.5. 配置模块解析

```json
{
  "compilerOptions": {
    "moduleResolution": "node", // 模块解析策略
    "baseUrl": "./", // 基础路径
    "paths": {
      // 路径映射
      "@/*": ["src/*"],
      "@utils/*": ["src/utils/*"]
    },
    "esModuleInterop": true, // ES 模块互操作
    "allowSyntheticDefaultImports": true // 允许合成默认导入
  }
}
```

### 4.6. 支持配置继承

```json
// tsconfig.base.json - 基础配置
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true
  }
}

// tsconfig.json - 继承基础配置
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist"  // 覆盖或添加选项
  },
  "include": ["src/**/*"]
}
```

### 4.7. 支持项目引用

```json
// tsconfig.json - 主项目
{
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/utils" }
  ]
}

// packages/core/tsconfig.json
{
  "compilerOptions": {
    "composite": true,    // 启用项目引用
    "outDir": "./dist"
  }
}
```

### 4.8. 影响 IDE 行为

```json
{
  "compilerOptions": {
    "lib": ["ES2020", "DOM"], // 提供类型定义
    "types": ["node", "jest"], // 引入类型包
    "skipLibCheck": true // 跳过库文件检查
  }
}
```

编辑器会根据这些配置：

- 提供准确的代码补全
- 显示类型错误和警告
- 支持智能重构
- 提供导入路径提示

## 5. 🤔 如何创建和使用 tsconfig.json？

### 5.1. 自动生成配置文件

```bash
# 生成默认配置
tsc --init

# 生成的 tsconfig.json 包含所有常用选项的注释
```

生成的文件示例：

```json
{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig.json to read more about this file */

    /* Language and Environment */
    "target": "es2016",

    /* Modules */
    "module": "commonjs",
    "rootDir": "./src",

    /* Emit */
    "outDir": "./dist",

    /* Type Checking */
    "strict": true,
    "skipLibCheck": true
  }
}
```

### 5.2. 手动创建基础配置

```json
// 最小化配置
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "strict": true
  }
}
```

### 5.3. 使用预设配置

```bash
# 安装官方预设配置包
npm install --save-dev @tsconfig/node16
npm install --save-dev @tsconfig/react
```

```json
// 继承预设配置
{
  "extends": "@tsconfig/node16/tsconfig.json",
  "compilerOptions": {
    // 自定义选项
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

### 5.4. 运行编译器

```bash
# 使用默认 tsconfig.json
tsc

# 指定配置文件
tsc -p tsconfig.prod.json

# 监听模式
tsc --watch

# 仅检查不输出
tsc --noEmit
```

### 5.5. 在代码中引用

```typescript
// TypeScript 会根据 tsconfig.json 解析路径别名
import { utils } from '@/utils' // 根据 paths 配置解析
import type { User } from '@types/user' // 根据 typeRoots 解析
```

### 5.6. 多环境配置

```json
// tsconfig.json - 基础配置
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true
  }
}

// tsconfig.dev.json - 开发环境
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "sourceMap": true,
    "incremental": true
  }
}

// tsconfig.prod.json - 生产环境
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "removeComments": true,
    "declaration": true,
    "sourceMap": false
  }
}
```

```bash
# 使用不同配置
tsc -p tsconfig.dev.json
tsc -p tsconfig.prod.json
```

## 6. 🤔 有哪些常用的配置项？

### 6.1. 编译目标和模块

```json
{
  "compilerOptions": {
    "target": "ES2020", // ES5, ES6, ES2015-ES2022, ESNext
    "module": "commonjs", // commonjs, es6, es2015, esnext, amd, umd
    "lib": ["ES2020", "DOM"], // 包含的库文件
    "moduleResolution": "node" // node 或 classic
  }
}
```

### 6.2. 输出配置

```json
{
  "compilerOptions": {
    "outDir": "./dist", // 输出目录
    "rootDir": "./src", // 输入目录
    "outFile": "./bundle.js", // 输出单个文件（仅限 AMD 和 System）
    "removeComments": true, // 移除注释
    "noEmit": true, // 不输出文件（仅检查）
    "noEmitOnError": true // 有错误时不输出
  }
}
```

### 6.3. 声明文件

```json
{
  "compilerOptions": {
    "declaration": true, // 生成 .d.ts
    "declarationMap": true, // 生成声明文件的 source map
    "declarationDir": "./types", // 声明文件输出目录
    "emitDeclarationOnly": true // 仅输出声明文件
  }
}
```

### 6.4. Source Map

```json
{
  "compilerOptions": {
    "sourceMap": true, // 生成 .js.map
    "inlineSourceMap": true, // 内联 source map
    "sourceRoot": "/src", // 源文件根目录
    "mapRoot": "/maps" // map 文件根目录
  }
}
```

### 6.5. 严格检查

```json
{
  "compilerOptions": {
    "strict": true, // 启用所有严格选项

    // strict 包含以下选项
    "noImplicitAny": true, // 禁止隐式 any
    "strictNullChecks": true, // 严格的 null 检查
    "strictFunctionTypes": true, // 严格的函数类型
    "strictBindCallApply": true, // 严格的 bind/call/apply
    "strictPropertyInitialization": true, // 严格的属性初始化
    "noImplicitThis": true, // 禁止隐式 this
    "alwaysStrict": true // 始终使用严格模式
  }
}
```

### 6.6. 额外检查

```json
{
  "compilerOptions": {
    "noUnusedLocals": true, // 检查未使用的局部变量
    "noUnusedParameters": true, // 检查未使用的参数
    "noImplicitReturns": true, // 检查隐式返回
    "noFallthroughCasesInSwitch": true, // 检查 switch 穿透
    "noUncheckedIndexedAccess": true // 检查索引访问
  }
}
```

### 6.7. 模块解析

```json
{
  "compilerOptions": {
    "baseUrl": "./", // 基础路径
    "paths": {
      // 路径映射
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"]
    },
    "rootDirs": ["src", "generated"], // 虚拟根目录
    "typeRoots": ["./types", "./node_modules/@types"], // 类型根目录
    "types": ["node", "jest"] // 包含的类型包
  }
}
```

### 6.8. 互操作性

```json
{
  "compilerOptions": {
    "esModuleInterop": true, // ES 模块互操作
    "allowSyntheticDefaultImports": true, // 允许合成默认导入
    "isolatedModules": true, // 每个文件作为独立模块
    "allowJs": true, // 允许编译 JS
    "checkJs": true // 检查 JS 文件
  }
}
```

### 6.9. 实验性功能

```json
{
  "compilerOptions": {
    "experimentalDecorators": true, // 启用装饰器
    "emitDecoratorMetadata": true // 输出装饰器元数据
  }
}
```

### 6.10. 文件包含

```json
{
  "include": [
    "src/**/*", // 包含 src 下所有文件
    "tests/**/*"
  ],
  "exclude": [
    "node_modules", // 默认排除
    "**/*.spec.ts", // 排除测试文件
    "dist",
    "build"
  ],
  "files": [
    // 明确指定的文件列表
    "src/index.ts",
    "src/main.ts"
  ]
}
```

## 7. 🤔 使用 tsconfig.json 时需要注意什么？

### 7.1. 配置文件位置

```bash
# ✅ 推荐：放在项目根目录
project/
├── tsconfig.json
├── package.json
├── src/
└── dist/

# ❌ 避免：放在子目录
project/
├── package.json
├── src/
│   ├── tsconfig.json    # ⚠️ 可能导致路径解析问题
│   └── index.ts
```

### 7.2. 选项覆盖顺序

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2020",
    "strict": true
  }
}

// tsconfig.json - 继承会覆盖
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2015"    // ✅ 覆盖基础配置的 target
  }
}
```

### 7.3. include 和 exclude 的优先级

```json
{
  "include": ["src/**/*"],
  "exclude": ["**/*.spec.ts"]

  // ✅ 结果：包含 src 下所有非测试文件
  // src/index.ts        - 包含
  // src/utils.ts        - 包含
  // src/test.spec.ts    - 排除
}
```

### 7.4. files 选项的优先级最高

```json
{
  "files": ["src/main.ts"],
  "include": ["src/**/*"],
  "exclude": ["src/main.ts"]

  // ✅ src/main.ts 依然会被编译
  // files 优先级 > exclude > include
}
```

### 7.5. 默认排除规则

```json
{
  // 即使不配置 exclude，以下目录也会被自动排除
  // - node_modules
  // - bower_components
  // - jspm_packages
  // - outDir 指定的目录
}
```

### 7.6. 路径解析

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

```typescript
// ✅ TypeScript 可以解析
import { utils } from '@/utils'

// ⚠️ 运行时需要额外配置
// Node.js 不认识路径别名，需要使用 tsconfig-paths 或打包工具
```

### 7.7. strict 模式的影响

```json
{
  "compilerOptions": {
    "strict": true

    // ✅ 等同于启用以下所有选项
    // "noImplicitAny": true
    // "strictNullChecks": true
    // "strictFunctionTypes": true
    // "strictBindCallApply": true
    // "strictPropertyInitialization": true
    // "noImplicitThis": true
    // "alwaysStrict": true
  }
}
```

### 7.8. 增量编译

```json
{
  "compilerOptions": {
    "incremental": true, // 启用增量编译
    "tsBuildInfoFile": "./.tsbuildinfo" // 构建信息文件
  }
}
```

```bash
# ✅ 第二次编译会更快
tsc  # 首次编译
tsc  # 增量编译（只编译修改的文件）
```

### 7.9. 项目引用注意事项

```json
// 使用项目引用时必须启用 composite
{
  "compilerOptions": {
    "composite": true, // ✅ 必须
    "declaration": true // ✅ composite 要求 declaration
  }
}
```

### 7.10. 配置文件注释

```json
{
  // ✅ JSON 文件通常不支持注释
  // 但 TypeScript 允许在 tsconfig.json 中使用注释
  "compilerOptions": {
    "target": "ES2020" // 这是一个注释
  }
}
```

### 7.11. 与 package.json 的配合

```json
// package.json
{
  "scripts": {
    "build": "tsc", // 使用默认 tsconfig.json
    "build:dev": "tsc -p tsconfig.dev.json",
    "build:prod": "tsc -p tsconfig.prod.json",
    "type-check": "tsc --noEmit" // 仅检查类型
  }
}
```

### 7.12. 监听模式下的文件监控

```json
{
  "compilerOptions": {
    // ...
  },
  "watchOptions": {
    "watchFile": "useFsEvents", // 使用文件系统事件
    "watchDirectory": "useFsEvents",
    "fallbackPolling": "dynamicPriority",
    "synchronousWatchDirectory": true,
    "excludeDirectories": ["**/node_modules", "_build"]
  }
}
```

### 7.13. 编译性能优化

```json
{
  "compilerOptions": {
    "skipLibCheck": true, // ✅ 跳过库文件检查
    "incremental": true, // ✅ 启用增量编译
    "disableSourceOfProjectReferenceRedirect": true // 优化项目引用
  }
}
```

## 8. 🔗 引用

- [TypeScript tsconfig.json 文档][1]
- [TSConfig Reference][2]
- [TypeScript Compiler Options][3]

[1]: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
[2]: https://www.typescriptlang.org/tsconfig
[3]: https://www.typescriptlang.org/docs/handbook/compiler-options.html
