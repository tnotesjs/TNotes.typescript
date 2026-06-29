# [0257. tsc 命令的基本用法](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0257.%20tsc%20%E5%91%BD%E4%BB%A4%E7%9A%84%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. tsc 是什么？](#3-tsc-是什么)
  - [3.1. 主要功能](#31-主要功能)
  - [3.2. 安装 tsc](#32-安装-tsc)
- [4. 如何编译单个文件？](#4-如何编译单个文件)
  - [4.1. 最简单的编译](#41-最简单的编译)
  - [4.2. 指定输出文件](#42-指定输出文件)
  - [4.3. 指定目标版本](#43-指定目标版本)
  - [4.4. 指定模块系统](#44-指定模块系统)
- [5. 如何编译整个项目？](#5-如何编译整个项目)
  - [5.1. 使用 tsconfig.json](#51-使用-tsconfigjson)
  - [5.2. 项目结构示例](#52-项目结构示例)
  - [5.3. 编译多个文件](#53-编译多个文件)
  - [5.4. 只检查不输出](#54-只检查不输出)
- [6. 如何指定编译选项？](#6-如何指定编译选项)
  - [6.1. 命令行选项优先级](#61-命令行选项优先级)
  - [6.2. 常用组合](#62-常用组合)
  - [6.3. 多个选项组合](#63-多个选项组合)
  - [6.4. 覆盖 tsconfig.json](#64-覆盖-tsconfigjson)
- [7. 如何处理编译错误？](#7-如何处理编译错误)
  - [7.1. 查看详细错误](#71-查看详细错误)
  - [7.2. 常见错误示例](#72-常见错误示例)

<!-- endregion:toc -->

## 1. 本节内容

- tsc 命令概述
- 编译单个文件
- 编译整个项目
- 命令行选项
- 错误处理

## 2. 评价

tsc 是 TypeScript 编译器的命令行工具，是 TypeScript 开发的核心工具。

- 掌握 tsc 是 TypeScript 开发基础
- 支持单文件和项目编译
- 命令行选项可覆盖配置文件
- 了解编译流程有助于排错
- 开发时常配合 watch 模式使用

## 3. tsc 是什么？

`tsc` 是 TypeScript Compiler 的缩写，是 TypeScript 的官方编译器。

### 3.1. 主要功能

```text
1. 类型检查
   - 检查代码中的类型错误
   - 提供类型推断
   - 报告类型不匹配

2. 代码转换
   - 将 TypeScript 转换为 JavaScript
   - 支持多种目标版本（ES5/ES6/ESNext）
   - 支持多种模块系统（CommonJS/ESM）

3. 生成声明文件
   - 生成 .d.ts 类型声明文件
   - 生成 .d.ts.map 声明映射文件
   - 支持库项目发布

4. 生成源码映射
   - 生成 .map 文件
   - 支持调试源代码
   - 映射到原始 TypeScript 代码
```

### 3.2. 安装 tsc

```bash
# 全局安装
npm install -g typescript

# 项目内安装（推荐）
npm install --save-dev typescript

# 验证安装
tsc --version
# Version 5.3.3
```

## 4. 如何编译单个文件？

### 4.1. 最简单的编译

```bash
# 编译单个文件
tsc hello.ts

# 生成 hello.js
```

```ts
// hello.ts
function greet(name: string): string {
  return `Hello, ${name}!`
}

console.log(greet('TypeScript'))
```

编译后：

```javascript
// hello.js
function greet(name) {
  return 'Hello, ' + name + '!'
}
console.log(greet('TypeScript'))
```

### 4.2. 指定输出文件

```bash
# 指定输出文件名
tsc hello.ts --outFile output.js

# 指定输出目录
tsc hello.ts --outDir dist
```

### 4.3. 指定目标版本

```bash
# 编译为 ES5
tsc hello.ts --target ES5

# 编译为 ES2020
tsc hello.ts --target ES2020
```

```ts
// hello.ts
const greet = (name: string) => `Hello, ${name}!`
```

```javascript
// ES5 输出
var greet = function (name) {
  return 'Hello, ' + name + '!'
}

// ES2020 输出
const greet = (name) => `Hello, ${name}!`
```

### 4.4. 指定模块系统

```bash
# 使用 CommonJS
tsc hello.ts --module commonjs

# 使用 ES 模块
tsc hello.ts --module esnext
```

```ts
// hello.ts
export function greet(name: string): string {
  return `Hello, ${name}!`
}
```

```javascript
// CommonJS 输出
'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.greet = greet
function greet(name) {
  return 'Hello, ' + name + '!'
}

// ES 模块输出
export function greet(name) {
  return `Hello, ${name}!`
}
```

## 5. 如何编译整个项目？

### 5.1. 使用 tsconfig.json

```bash
# 在项目根目录执行
tsc

# 会读取 tsconfig.json 并编译所有文件
```

```json
// tsconfig.json
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

### 5.2. 项目结构示例

```text
project/
├── src/
│   ├── index.ts
│   ├── utils/
│   │   └── helper.ts
│   └── types/
│       └── custom.d.ts
├── dist/          ✅ 编译输出
│   ├── index.js
│   └── utils/
│       └── helper.js
├── tsconfig.json
└── package.json
```

### 5.3. 编译多个文件

```bash
# 编译指定的多个文件
tsc file1.ts file2.ts file3.ts

# 使用通配符（需要引号）
tsc "src/**/*.ts"
```

### 5.4. 只检查不输出

```bash
# 只进行类型检查，不生成 JavaScript 文件
tsc --noEmit

# 适用场景：CI/CD 中的类型检查
```

## 6. 如何指定编译选项？

### 6.1. 命令行选项优先级

```text
命令行选项 > tsconfig.json > 默认值
```

### 6.2. 常用组合

```bash
# 开发模式：生成源码映射
tsc --sourceMap

# 生产模式：严格检查 + 移除注释
tsc --strict --removeComments

# 库开发：生成声明文件
tsc --declaration --declarationMap

# 调试模式：保留注释 + 源码映射
tsc --sourceMap --removeComments false
```

### 6.3. 多个选项组合

```bash
tsc \
  --target ES2020 \
  --module commonjs \
  --outDir dist \
  --sourceMap \
  --declaration \
  --strict
```

### 6.4. 覆盖 tsconfig.json

```bash
# tsconfig.json 中 target 是 ES5
# 命令行覆盖为 ES2020
tsc --target ES2020
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES5", // ⚠️ 会被命令行覆盖
    "module": "commonjs"
  }
}
```

## 7. 如何处理编译错误？

### 7.1. 查看详细错误

```bash
# 显示详细错误信息
tsc --listFiles

# 显示编译过程
tsc --diagnostics

# 显示扩展诊断信息
tsc --extendedDiagnostics
```

### 7.2. 常见错误示例

```ts
// error.ts
function greet(name: string): number {
  // ❌ 返回类型错误
  return `Hello, ${name}!`
}

const age: number = '25' // ❌ 类型不匹配

interface User {
  name: string
  age: number
}

const user: User = {
  // ❌ 缺少 age 属性
  name: 'Tom',
}
```

编译输出：

```bash
$ tsc error.ts

error.ts:2:10 - error TS2322: Type 'string' is not assignable to type 'number'.
2   return `Hello, ${name}!`;
           ~~~~~~~~~~~~~~~~~~

error.ts:5:7 - error TS2322: Type 'string' is not assignable to type 'number'.
5 const age: number = "25";
        ~~~

error.ts:12:7 - error TS2741: Property 'age' is missing in type '{ name: string; }' but required in type 'User'.
12 const user: User = {
         ~~~~

Found 3 errors in the same file, starting at: error.ts:2
```

### 7.3. 强制编译（不推荐）

```bash
# 即使有错误也生成 JavaScript 文件
tsc --noEmitOnError false

# ⚠️ 不推荐在生产环境使用
```

### 7.4. 跳过库检查

```bash
# 跳过 .d.ts 文件的类型检查（提升编译速度）
tsc --skipLibCheck
```

### 7.5. 增量编译

```bash
# 启用增量编译（提升后续编译速度）
tsc --incremental

# 会生成 tsconfig.tsbuildinfo 缓存文件
```

## 8.  引用

- [TypeScript Compiler Options][1]
- [TSC CLI Options][2]
- [Compiler API][3]

[1]: https://www.typescriptlang.org/docs/handbook/compiler-options.html
[2]: https://www.typescriptlang.org/docs/handbook/compiler-options.html
[3]: https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
