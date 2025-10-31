# [0182. @types 包的使用](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0182.%20%40types%20%E5%8C%85%E7%9A%84%E4%BD%BF%E7%94%A8)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是 @types 包？](#3--什么是-types-包)
  - [3.1. 基本概念](#31-基本概念)
  - [3.2. DefinitelyTyped 项目](#32-definitelytyped-项目)
  - [3.3. 包的组成](#33-包的组成)
  - [3.4. 自动发现机制](#34-自动发现机制)
- [4. 🤔 如何安装和使用 @types 包？](#4--如何安装和使用-types-包)
  - [4.1. 安装方式](#41-安装方式)
  - [4.2. 批量安装](#42-批量安装)
  - [4.3. 自动使用](#43-自动使用)
  - [4.4. 版本匹配](#44-版本匹配)
  - [4.5. 检查类型包是否需要](#45-检查类型包是否需要)
  - [4.6. tsconfig.json 配置](#46-tsconfigjson-配置)
- [5. 🤔 如何查找和选择 @types 包？](#5--如何查找和选择-types-包)
  - [5.1. 查找方法](#51-查找方法)
  - [5.2. 检查包信息](#52-检查包信息)
  - [5.3. 评估包质量](#53-评估包质量)
  - [5.4. 常用 @types 包](#54-常用-types-包)
  - [5.5. 版本锁定策略](#55-版本锁定策略)
- [6. 🤔 常见问题如何解决？](#6--常见问题如何解决)
  - [6.1. 问题 1：找不到类型定义](#61-问题-1找不到类型定义)
  - [6.2. 问题 2：类型定义过时](#62-问题-2类型定义过时)
  - [6.3. 问题 3：类型冲突](#63-问题-3类型冲突)
  - [6.4. 问题 4：缺少某些类型](#64-问题-4缺少某些类型)
  - [6.5. 问题 5：版本不匹配](#65-问题-5版本不匹配)
  - [6.6. 问题 6：重复的类型定义](#66-问题-6重复的类型定义)
  - [6.7. 调试技巧](#67-调试技巧)
  - [6.8. 最佳实践](#68-最佳实践)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- @types 包的概念和来源
- @types 包的安装和使用
- 如何查找合适的 @types 包
- 版本管理和更新策略
- 常见问题和解决方案

## 2. 🫧 评价

@types 包是 TypeScript 生态系统中为 JavaScript 库提供类型定义的标准方案。

- @types 包托管在 DefinitelyTyped 项目中
- 包名格式为 `@types/库名`，如 `@types/react`
- 安装后会自动被 TypeScript 识别
- 绝大多数流行的 JavaScript 库都有对应的 @types 包
- 优先使用 @types 包，无法满足时才考虑自己编写类型声明

## 3. 🤔 什么是 @types 包？

@types 包的概念和组织方式。

### 3.1. 基本概念

```bash
# @types 包的命名规则
@types/库名

# 示例
@types/react         # React 的类型定义
@types/node          # Node.js 的类型定义
@types/lodash        # Lodash 的类型定义
@types/express       # Express 的类型定义
```

### 3.2. DefinitelyTyped 项目

```typescript
/**
 * DefinitelyTyped 是什么？
 *
 * - 全球最大的 TypeScript 类型定义仓库
 * - GitHub 地址：https://github.com/DefinitelyTyped/DefinitelyTyped
 * - 包含超过 7000+ 个库的类型定义
 * - 社区驱动，任何人都可以贡献
 * - 自动发布到 npm 的 @types 命名空间下
 */

// 文件结构示例
/**
 * DefinitelyTyped/
 * ├── types/
 * │   ├── react/
 * │   │   ├── index.d.ts
 * │   │   ├── package.json
 * │   │   └── tsconfig.json
 * │   ├── node/
 * │   │   ├── index.d.ts
 * │   │   └── ...
 * │   └── lodash/
 * │       ├── index.d.ts
 * │       └── ...
 * └── ...
 */
```

### 3.3. 包的组成

```typescript
// node_modules/@types/react/index.d.ts

/**
 * Type definitions for React 18.0
 * Project: https://reactjs.org/
 * Definitions by: Many Contributors
 * TypeScript Version: 4.1
 */

// React 类型定义
declare namespace React {
  interface ReactElement<P = any> {
    type: string | ComponentType<P>
    props: P
    key: Key | null
  }

  // 更多类型定义...
}

export = React
export as namespace React
```

### 3.4. 自动发现机制

```typescript
// TypeScript 会自动在以下位置查找类型定义：
/**
 * 1. 库自带的类型定义
 *    node_modules/react/package.json -> "types": "./index.d.ts"
 *
 * 2. @types 包
 *    node_modules/@types/react/index.d.ts
 *
 * 3. tsconfig.json 配置的 typeRoots
 *    默认：["./node_modules/@types"]
 */

// 使用示例
import React from 'react' // TypeScript 自动找到 @types/react

const App: React.FC = () => {
  return <div>Hello</div>
}
```

## 4. 🤔 如何安装和使用 @types 包？

@types 包的安装和配置。

### 4.1. 安装方式

```bash
# npm
npm install -D @types/node
npm install -D @types/react
npm install -D @types/lodash

# yarn
yarn add -D @types/node
yarn add -D @types/react

# pnpm
pnpm add -D @types/node
pnpm add -D @types/react
```

### 4.2. 批量安装

```bash
# 一次性安装多个类型包
npm install -D @types/node @types/react @types/react-dom @types/jest

# 使用 package.json
{
  "devDependencies": {
    "@types/node": "^18.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@types/jest": "^29.0.0"
  }
}
```

### 4.3. 自动使用

```typescript
// 安装后无需额外配置，直接使用
// app.ts
import React from 'react'
import _ from 'lodash'
import { readFile } from 'fs'

// TypeScript 会自动加载对应的 @types 包

// React 类型
const App: React.FC = () => <div>Hello</div>

// Lodash 类型
const result = _.debounce(() => {}, 300)

// Node.js 类型
readFile('./file.txt', 'utf-8', (err, data) => {
  console.log(data)
})
```

### 4.4. 版本匹配

```json
// package.json
{
  "dependencies": {
    "react": "^18.2.0",
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    // @types 包的版本应该匹配库的主版本号
    "@types/react": "^18.0.0", // ✅ 匹配 react 18.x
    "@types/lodash": "^4.14.0" // ✅ 匹配 lodash 4.x
  }
}
```

### 4.5. 检查类型包是否需要

```bash
# 某些库自带类型定义，不需要安装 @types 包

# 检查库是否自带类型
npm info <package-name> types

# 示例
npm info axios types
# 输出：dist/index.d.ts（说明 axios 自带类型定义，不需要 @types/axios）

npm info lodash types
# 输出：undefined（说明 lodash 没有自带类型，需要 @types/lodash）
```

### 4.6. tsconfig.json 配置

```json
// tsconfig.json
{
  "compilerOptions": {
    // 指定类型包的查找目录
    "typeRoots": [
      "./node_modules/@types",
      "./types" // 自定义类型目录
    ],

    // 只加载指定的类型包（如果不设置，会加载 typeRoots 下的所有包）
    "types": ["node", "jest", "react"]
  }
}
```

## 5. 🤔 如何查找和选择 @types 包？

查找和评估 @types 包的方法。

### 5.1. 查找方法

```bash
# 方法 1：npm 搜索
npm search @types/库名

# 方法 2：TypeSearch（推荐）
# 访问：https://www.typescriptlang.org/dt/search

# 方法 3：DefinitelyTyped GitHub
# https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types

# 方法 4：npm 网站
# https://www.npmjs.com/search?q=%40types%2F库名

# 方法 5：使用 VSCode
# 当导入没有类型的库时，VSCode 会提示安装对应的 @types 包
```

### 5.2. 检查包信息

```bash
# 查看包的详细信息
npm info @types/react

# 输出示例：
# @types/react@18.0.26 | MIT | deps: 2 | versions: 500
# TypeScript definitions for React
# https://www.npmjs.com/package/@types/react

# Keywords: types, typescript, react

# 查看包的版本列表
npm view @types/react versions

# 查看包的依赖
npm view @types/react dependencies
```

### 5.3. 评估包质量

```typescript
/**
 * 评估 @types 包质量的因素：
 *
 * 1. 下载量
 *    - 高下载量通常意味着更可靠
 *    - npm info @types/react
 *
 * 2. 更新频率
 *    - 查看最后更新时间
 *    - 是否跟上库的版本更新
 *
 * 3. 依赖关系
 *    - 依赖的其他 @types 包是否可用
 *
 * 4. TypeScript 版本要求
 *    - 检查包的 TypeScript 最低版本要求
 *
 * 5. GitHub 的 Issues
 *    - 查看 DefinitelyTyped 仓库中相关的 issues
 */
```

### 5.4. 常用 @types 包

```json
// package.json - 前端项目常用类型包
{
  "devDependencies": {
    // Node.js 环境
    "@types/node": "^18.0.0",

    // React 生态
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@types/react-router-dom": "^6.0.0",

    // 测试
    "@types/jest": "^29.0.0",
    "@types/testing-library__jest-dom": "^5.14.0",

    // 工具库
    "@types/lodash": "^4.14.0",
    "@types/uuid": "^9.0.0",

    // 样式
    "@types/styled-components": "^5.1.0"
  }
}

// package.json - Node.js 项目常用类型包
{
  "devDependencies": {
    // Node.js 核心
    "@types/node": "^18.0.0",

    // Express
    "@types/express": "^4.17.0",
    "@types/cors": "^2.8.0",
    "@types/cookie-parser": "^1.4.0",

    // 数据库
    "@types/mongodb": "^4.0.0",
    "@types/pg": "^8.6.0",

    // 测试
    "@types/jest": "^29.0.0",
    "@types/supertest": "^2.0.0",

    // 工具
    "@types/lodash": "^4.14.0",
    "@types/bcrypt": "^5.0.0"
  }
}
```

### 5.5. 版本锁定策略

```json
// package.json
{
  "devDependencies": {
    // ✅ 推荐：使用 ^ 允许小版本更新
    "@types/react": "^18.0.0",

    // ⚠️ 谨慎：锁定特定版本（可能错过 bug 修复）
    "@types/react": "18.0.26",

    // ❌ 不推荐：使用 * 或 latest（可能引入破坏性变更）
    "@types/react": "*"
  }
}

// package-lock.json 会锁定确切版本
```

## 6. 🤔 常见问题如何解决？

@types 包使用中的常见问题。

### 6.1. 问题 1：找不到类型定义

```typescript
// ❌ 错误：Cannot find module 'some-library' or its corresponding type declarations

// 原因：库没有类型定义，也没有 @types 包

// 解决方案 1：安装 @types 包
npm install -D @types/some-library

// 解决方案 2：自己创建声明文件
// types/some-library.d.ts
declare module 'some-library' {
  export function doSomething(): void;
}

// 解决方案 3：使用 any（临时方案）
// types/some-library.d.ts
declare module 'some-library';  // 整个模块类型为 any
```

### 6.2. 问题 2：类型定义过时

```typescript
// ❌ 库更新了，但 @types 包还是旧版本

// 解决方案 1：更新 @types 包
npm update @types/some-library

// 解决方案 2：安装特定版本
npm install -D @types/some-library@latest

// 解决方案 3：临时覆盖类型
// types/some-library-patch.d.ts
import 'some-library';

declare module 'some-library' {
  // 添加新的类型定义
  export function newMethod(): void;
}
```

### 6.3. 问题 3：类型冲突

```typescript
// ❌ 多个 @types 包之间的类型冲突

// 场景：@types/node 和 @types/dom 的 setTimeout 冲突

// 解决方案 1：使用 skipLibCheck
// tsconfig.json
{
  "compilerOptions": {
    "skipLibCheck": true  // 跳过库文件的类型检查
  }
}

// 解决方案 2：明确指定 lib
// tsconfig.json
{
  "compilerOptions": {
    "lib": ["ES2020"],  // 不包含 DOM
    "types": ["node"]   // 只加载 node 类型
  }
}

// 解决方案 3：使用类型断言
const timeoutId = setTimeout(() => {}, 1000) as NodeJS.Timeout;
```

### 6.4. 问题 4：缺少某些类型

```typescript
// ❌ @types 包不完整，缺少某些 API 的类型

// 解决方案：扩展类型定义
// types/some-library-extend.d.ts
import 'some-library'

declare module 'some-library' {
  export interface ExistingInterface {
    // 添加缺失的属性
    newProperty: string
  }

  // 添加缺失的导出
  export function missingFunction(): void
}
```

### 6.5. 问题 5：版本不匹配

```typescript
// ❌ @types 包版本与库版本不匹配

// 检查版本兼容性
npm info @types/react versions
npm info react version

// 解决方案：安装匹配的版本
npm install -D @types/react@^18.0.0  # 匹配 react@^18.0.0
```

### 6.6. 问题 6：重复的类型定义

```typescript
// ❌ 库自带类型，又安装了 @types 包

// 示例：axios 自带类型定义
npm install axios          // ✅ 自带类型
npm install @types/axios   // ❌ 不需要

// 解决方案：卸载多余的 @types 包
npm uninstall @types/axios

// 检查库是否自带类型
// 查看 package.json 的 types/typings 字段
```

### 6.7. 调试技巧

```bash
# 查看 TypeScript 加载的文件
tsc --listFiles

# 查看模块解析过程
tsc --traceResolution

# 检查类型定义的位置
# VSCode：Cmd/Ctrl + Click 类型名称

# 验证 @types 包是否正确安装
ls node_modules/@types/

# 清理并重新安装
rm -rf node_modules package-lock.json
npm install
```

### 6.8. 最佳实践

```json
// package.json
{
  "scripts": {
    // 安装库时自动检查并安装类型包
    "postinstall": "node scripts/check-types.js"
  }
}
```

```javascript
// scripts/check-types.js
const { execSync } = require('child_process')
const fs = require('fs')

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
const deps = Object.keys(pkg.dependencies || {})

deps.forEach((dep) => {
  try {
    // 检查是否需要 @types 包
    const info = execSync(`npm info ${dep} types`, { encoding: 'utf-8' })
    if (!info.trim()) {
      console.log(`Consider installing @types/${dep}`)
    }
  } catch (e) {
    // 忽略错误
  }
})
```

## 7. 🔗 引用

- [DefinitelyTyped Repository][1]
- [TypeScript Types Search][2]
- [Publishing Declaration Files][3]
- [npm @types Organization][4]

[1]: https://github.com/DefinitelyTyped/DefinitelyTyped
[2]: https://www.typescriptlang.org/dt/search
[3]: https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html
[4]: https://www.npmjs.com/~types
