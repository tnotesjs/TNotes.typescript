# [0258. tsc 常用参数](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0258.%20tsc%20%E5%B8%B8%E7%94%A8%E5%8F%82%E6%95%B0)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 输出控制参数？](#3-输出控制参数)
  - [3.1. --outDir](#31---outdir)
  - [3.2. --outFile](#32---outfile)
  - [3.3. --removeComments](#33---removecomments)
  - [3.4. --declaration](#34---declaration)
- [4. 类型检查参数？](#4-类型检查参数)
  - [4.1. --strict](#41---strict)
  - [4.2. --noImplicitAny](#42---noimplicitany)
  - [4.3. --strictNullChecks](#43---strictnullchecks)
  - [4.4. --noUnusedLocals](#44---nounusedlocals)
  - [4.5. --noUnusedParameters](#45---nounusedparameters)
- [5. 模块相关参数？](#5-模块相关参数)
  - [5.1. --module](#51---module)
  - [5.2. --moduleResolution](#52---moduleresolution)
  - [5.3. --esModuleInterop](#53---esmoduleinterop)
  - [5.4. --allowSyntheticDefaultImports](#54---allowsyntheticdefaultimports)
- [6. 调试相关参数？](#6-调试相关参数)
  - [6.1. --sourceMap](#61---sourcemap)
  - [6.2. --inlineSourceMap](#62---inlinesourcemap)
  - [6.3. --listFiles](#63---listfiles)
  - [6.4. --diagnostics](#64---diagnostics)
- [7. 项目管理参数？](#7-项目管理参数)
  - [7.1. --project](#71---project)
  - [7.2. --build](#72---build)
  - [7.3. --incremental](#73---incremental)
  - [7.4. --noEmit](#74---noemit)
  - [7.5. --noEmitOnError](#75---noemitonerror)
  - [7.6. --help](#76---help)
  - [7.7. --version](#77---version)
- [8. 引用](#8-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 输出控制参数
- 类型检查参数
- 模块相关参数
- 调试相关参数
- 项目管理参数

## 2. 评价

tsc 提供了丰富的命令行参数，可以灵活控制编译行为。

- 命令行参数优先级高于配置文件
- 适合临时调整编译选项
- 可用于 CI/CD 脚本
- 不同场景需要不同参数组合
- 掌握常用参数提升开发效率

## 3. 输出控制参数？

### 3.1. --outDir

指定输出目录：

```bash
# 输出到 dist 目录
tsc --outDir dist

# 输出到多级目录
tsc --outDir build/output
```

```text
项目结构：
src/
  index.ts
  utils/
    helper.ts

编译后（tsc --outDir dist）：
dist/
  index.js
  utils/
    helper.js
```

### 3.2. --outFile

将所有文件合并输出到单个文件：

```bash
# 合并输出（仅支持 AMD 和 System 模块）
tsc --outFile bundle.js --module amd
```

```ts
// file1.ts
export const a = 1

// file2.ts
export const b = 2
```

```javascript
// bundle.js（合并后）
define('file1', ['require', 'exports'], function (require, exports) {
  exports.a = 1
})
define('file2', ['require', 'exports'], function (require, exports) {
  exports.b = 2
})
```

### 3.3. --removeComments

移除注释：

```bash
tsc --removeComments
```

```ts
// input.ts
/**
 * 用户接口
 */
interface User {
  name: string // 用户名
  age: number // 年龄
}

// ✅ 编译后注释被移除
```

```javascript
// output.js（--removeComments）
// 所有注释被移除
```

### 3.4. --declaration

生成声明文件：

```bash
# 生成 .d.ts 文件
tsc --declaration

# 同时生成声明映射
tsc --declaration --declarationMap
```

```ts
// input.ts
export function greet(name: string): string {
  return `Hello, ${name}!`
}
```

```ts
// output.d.ts
export declare function greet(name: string): string
```

## 4. 类型检查参数？

### 4.1. --strict

启用所有严格检查：

```bash
tsc --strict
```

等同于启用：

- `strictNullChecks`
- `strictFunctionTypes`
- `strictBindCallApply`
- `strictPropertyInitialization`
- `noImplicitAny`
- `noImplicitThis`
- `alwaysStrict`

### 4.2. --noImplicitAny

禁止隐式 any：

```bash
tsc --noImplicitAny
```

```ts
// ❌ 会报错
function greet(name) {
  // Error: Parameter 'name' implicitly has an 'any' type
  return `Hello, ${name}`
}

// ✅ 正确
function greet(name: string) {
  return `Hello, ${name}`
}
```

### 4.3. --strictNullChecks

严格空值检查：

```bash
tsc --strictNullChecks
```

```ts
let name: string = 'Tom'
name = null // ❌ Error: Type 'null' is not assignable to type 'string'

let age: number | null = 25
age = null // ✅ 正确
```

### 4.4. --noUnusedLocals

检查未使用的局部变量：

```bash
tsc --noUnusedLocals
```

```ts
function calculate() {
  const unused = 10 // ❌ Error: 'unused' is declared but never used
  return 5
}
```

### 4.5. --noUnusedParameters

检查未使用的参数：

```bash
tsc --noUnusedParameters
```

```ts
// ❌ 会报错
function greet(name: string, age: number) {
  // Error: 'age' is declared but never used
  return `Hello, ${name}`
}

// ✅ 使用下划线表示有意忽略
function greet(name: string, _age: number) {
  return `Hello, ${name}`
}
```

## 5. 模块相关参数？

### 5.1. --module

指定模块系统：

```bash
# CommonJS（Node.js）
tsc --module commonjs

# ES 模块
tsc --module esnext

# AMD（浏览器，RequireJS）
tsc --module amd

# UMD（通用）
tsc --module umd
```

```ts
// input.ts
export const value = 42
```

```javascript
// CommonJS 输出
exports.value = 42

// ES 模块输出
export const value = 42

// AMD 输出
define(['require', 'exports'], function (require, exports) {
  exports.value = 42
})
```

### 5.2. --moduleResolution

模块解析策略：

```bash
# Node.js 解析
tsc --moduleResolution node

# 经典解析
tsc --moduleResolution classic
```

### 5.3. --esModuleInterop

启用 ES 模块互操作：

```bash
tsc --esModuleInterop
```

```ts
// ✅ 可以使用默认导入
import express from 'express' // 而不是 import * as express

// 等同于
import * as express from 'express'
const express_default = express.default || express
```

### 5.4. --allowSyntheticDefaultImports

允许合成默认导入：

```bash
tsc --allowSyntheticDefaultImports
```

## 6. 调试相关参数？

### 6.1. --sourceMap

生成源码映射：

```bash
tsc --sourceMap
```

```text
生成文件：
output.js
output.js.map  ✅ 源码映射文件
```

### 6.2. --inlineSourceMap

内联源码映射：

```bash
tsc --inlineSourceMap
```

```javascript
// output.js
// ... 编译后的代码
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLC...
```

### 6.3. --listFiles

列出编译的文件：

```bash
tsc --listFiles
```

```text
输出：
/path/to/project/node_modules/typescript/lib/lib.d.ts
/path/to/project/node_modules/typescript/lib/lib.es5.d.ts
/path/to/project/src/index.ts
/path/to/project/src/utils/helper.ts
```

### 6.4. --diagnostics

显示诊断信息：

```bash
tsc --diagnostics
```

```text
输出：
Files:            12
Lines:         45678
Nodes:        123456
Identifiers:   34567
Symbols:       23456
Types:          5678
Instantiations: 8901
Memory used:  89012K
I/O read:      0.02s
I/O write:     0.01s
Parse time:    0.45s
Bind time:     0.23s
Check time:    1.34s
Emit time:     0.67s
Total time:    2.69s
```

## 7. 项目管理参数？

### 7.1. --project

指定配置文件：

```bash
# 指定 tsconfig.json
tsc --project tsconfig.json

# 指定目录（会查找目录下的 tsconfig.json）
tsc --project ./

# 简写
tsc -p tsconfig.json
```

### 7.2. --build

构建项目引用：

```bash
# 构建项目及其依赖
tsc --build

# 简写
tsc -b

# 强制重新构建
tsc --build --force
```

### 7.3. --incremental

增量编译：

```bash
tsc --incremental
```

### 7.4. --noEmit

只检查不输出：

```bash
# 适用于 CI/CD 类型检查
tsc --noEmit
```

### 7.5. --noEmitOnError

有错误时不输出：

```bash
tsc --noEmitOnError
```

### 7.6. --help

显示帮助信息：

```bash
# 显示所有选项
tsc --help

# 显示完整帮助
tsc --help --all
```

### 7.7. --version

显示版本：

```bash
tsc --version
# Version 5.3.3
```

## 8. 引用

- [Compiler Options][1]
- [TSC CLI Reference][2]
- [Project References][3]

[1]: https://www.typescriptlang.org/docs/handbook/compiler-options.html
[2]: https://www.typescriptlang.org/docs/handbook/compiler-options.html
[3]: https://www.typescriptlang.org/docs/handbook/project-references.html
