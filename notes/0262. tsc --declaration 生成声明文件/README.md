# [0262. tsc --declaration 生成声明文件](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0262.%20tsc%20--declaration%20%E7%94%9F%E6%88%90%E5%A3%B0%E6%98%8E%E6%96%87%E4%BB%B6)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 声明文件是什么？](#3-声明文件是什么)
  - [3.1. 作用](#31-作用)
  - [3.2. 示例](#32-示例)
- [4. 如何生成声明文件？](#4-如何生成声明文件)
  - [4.1. 命令行方式](#41-命令行方式)
  - [4.2. 配置文件方式](#42-配置文件方式)
  - [4.3. 目录结构](#43-目录结构)
  - [4.4. 完整示例](#44-完整示例)
- [5. 相关配置选项？](#5-相关配置选项)
  - [5.1. declarationMap](#51-declarationmap)
  - [5.2. declarationDir](#52-declarationdir)
  - [5.3. emitDeclarationOnly](#53-emitdeclarationonly)
  - [5.4. stripInternal](#54-stripinternal)
- [6. 如何发布带类型的库？](#6-如何发布带类型的库)
  - [6.1. 项目配置](#61-项目配置)
  - [6.2. package.json 配置](#62-packagejson-配置)
  - [6.3. 目录结构](#63-目录结构)
  - [6.4. 使用库](#64-使用库)
  - [6.5. 多格式发布](#65-多格式发布)
- [7. 引用](#7-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 声明文件概念
- 生成声明文件
- 相关配置选项
- 库项目发布

## 2. 评价

声明文件（`.d.ts`）为 JavaScript 代码提供类型信息，是库项目的必备输出。

- 库项目必须生成
- 提供类型智能提示
- 支持类型检查
- 提升开发体验
- TypeScript 生态基础

## 3. 声明文件是什么？

声明文件（`.d.ts`）包含类型定义，不包含实现代码。

### 3.1. 作用

```text
1. 类型信息
   - 提供函数签名
   - 提供类型定义
   - 提供接口定义

2. 编辑器支持
   - 自动补全
   - 类型提示
   - 参数提示

3. 类型检查
   - 编译时检查
   - 类型安全保证
```

### 3.2. 示例

```ts
// greet.ts（源代码）
export function greet(name: string): string {
  return `Hello, ${name}!`
}

export interface User {
  name: string
  age: number
}
```

生成的声明文件：

```ts
// greet.d.ts（声明文件）
export declare function greet(name: string): string

export interface User {
  name: string
  age: number
}
```

## 4. 如何生成声明文件？

### 4.1. 命令行方式

```bash
# 生成声明文件
tsc --declaration

# 简写
tsc -d

# 指定输出目录
tsc --declaration --outDir dist
```

### 4.2. 配置文件方式

```json
// tsconfig.json
{
  "compilerOptions": {
    "declaration": true,
    "outDir": "./dist"
  }
}
```

```bash
# 使用配置文件
tsc
```

### 4.3. 目录结构

```text
项目结构：
src/
├── index.ts
├── utils/
│   └── helper.ts
└── types/
    └── custom.ts

编译后：
dist/
├── index.js
├── index.d.ts        ✅ 声明文件
├── utils/
│   ├── helper.js
│   └── helper.d.ts   ✅ 声明文件
└── types/
    └── custom.d.ts   ✅ 声明文件（只有接口/类型，无 .js）
```

### 4.4. 完整示例

```ts
// src/calculator.ts
export function add(a: number, b: number): number {
  return a + b
}

export function subtract(a: number, b: number): number {
  return a - b
}

export type Operation = 'add' | 'subtract'

export interface CalculatorOptions {
  precision?: number
}
```

生成的声明文件：

```ts
// dist/calculator.d.ts
export declare function add(a: number, b: number): number
export declare function subtract(a: number, b: number): number
export type Operation = 'add' | 'subtract'
export interface CalculatorOptions {
  precision?: number
}
```

## 5. 相关配置选项？

### 5.1. declarationMap

生成声明文件的源映射：

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true
  }
}
```

```text
生成文件：
dist/
├── index.js
├── index.d.ts
└── index.d.ts.map    ✅ 声明文件源映射
```

作用：

- 在编辑器中跳转到 TypeScript 源码
- 而不是跳转到 `.d.ts` 文件

### 5.2. declarationDir

指定声明文件输出目录：

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "declaration": true,
    "declarationDir": "./types" // ✅ 单独输出目录
  }
}
```

```text
dist/
├── index.js
└── utils/
    └── helper.js

types/
├── index.d.ts
└── utils/
    └── helper.d.ts
```

### 5.3. emitDeclarationOnly

只生成声明文件，不生成 JavaScript：

```bash
# 只生成 .d.ts
tsc --emitDeclarationOnly
```

```json
{
  "compilerOptions": {
    "declaration": true,
    "emitDeclarationOnly": true
  }
}
```

```text
适用场景：
✅ 库项目已有构建工具（Babel/Webpack）
✅ 只需要 TypeScript 生成类型
✅ JavaScript 由其他工具生成
```

### 5.4. stripInternal

从声明文件中移除 `@internal` 注释的内容：

```ts
// src/api.ts
export function publicAPI(): void {
  // 公开 API
}

/**
 * @internal
 */
export function internalAPI(): void {
  // 内部 API
}
```

```json
{
  "compilerOptions": {
    "declaration": true,
    "stripInternal": true
  }
}
```

```ts
// dist/api.d.ts（stripInternal: true）
export declare function publicAPI(): void
// ✅ internalAPI 被移除
```

## 6. 如何发布带类型的库？

### 6.1. 项目配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2015",
    "module": "commonjs",
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### 6.2. package.json 配置

```json
{
  "name": "my-awesome-library",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts", // ✅ 指向声明文件
  "files": [
    "dist" // ✅ 发布时包含 dist 目录
  ],
  "scripts": {
    "build": "tsc",
    "prepublishOnly": "npm run build"
  }
}
```

### 6.3. 目录结构

```text
my-library/
├── src/
│   ├── index.ts
│   └── utils/
│       └── helper.ts
├── dist/                    ✅ 编译输出
│   ├── index.js
│   ├── index.d.ts
│   ├── index.d.ts.map
│   └── utils/
│       ├── helper.js
│       ├── helper.d.ts
│       └── helper.d.ts.map
├── package.json
└── tsconfig.json
```

### 6.4. 使用库

```ts
// 用户项目中
import { greet } from 'my-awesome-library'

// ✅ 自动获得类型提示
greet('TypeScript') // TypeScript 知道 greet 的类型签名
```

### 6.5. 多格式发布

```json
// package.json（支持 ESM 和 CJS）
{
  "name": "my-library",
  "main": "./dist/cjs/index.js",
  "module": "./dist/esm/index.js",
  "types": "./dist/esm/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/esm/index.js",
      "require": "./dist/cjs/index.js",
      "types": "./dist/esm/index.d.ts"
    }
  }
}
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true
  }
}

// tsconfig.esm.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "esnext",
    "outDir": "./dist/esm"
  }
}

// tsconfig.cjs.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "commonjs",
    "outDir": "./dist/cjs"
  }
}
```

```json
// package.json scripts
{
  "scripts": {
    "build": "npm run build:esm && npm run build:cjs",
    "build:esm": "tsc -p tsconfig.esm.json",
    "build:cjs": "tsc -p tsconfig.cjs.json"
  }
}
```

## 7. 引用

- [Declaration Files][1]
- [Publishing][2]
- [Library Structures][3]

[1]: https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html
[2]: https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html
[3]: https://www.typescriptlang.org/docs/handbook/declaration-files/library-structures.html
