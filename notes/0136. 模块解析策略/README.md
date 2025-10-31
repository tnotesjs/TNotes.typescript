# [0136. 模块解析策略](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0136.%20%E6%A8%A1%E5%9D%97%E8%A7%A3%E6%9E%90%E7%AD%96%E7%95%A5)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是模块解析？](#3--什么是模块解析)
  - [3.1. 基本概念](#31-基本概念)
  - [3.2. 解析过程](#32-解析过程)
  - [3.3. 模块标识符类型](#33-模块标识符类型)
- [4. 🤔 TypeScript 有哪些模块解析策略？](#4--typescript-有哪些模块解析策略)
  - [4.1. 两种策略对比](#41-两种策略对比)
  - [4.2. 选择策略](#42-选择策略)
  - [4.3. 默认值](#43-默认值)
- [5. 🤔 Classic 解析策略是如何工作的？](#5--classic-解析策略是如何工作的)
  - [5.1. 相对导入](#51-相对导入)
  - [5.2. 非相对导入](#52-非相对导入)
  - [5.3. Classic 的问题](#53-classic-的问题)
- [6. 🤔 Node 解析策略是如何工作的？](#6--node-解析策略是如何工作的)
  - [6.1. 相对导入](#61-相对导入)
  - [6.2. 非相对导入](#62-非相对导入)
  - [6.3. package.json 解析](#63-packagejson-解析)
  - [6.4. 目录导入](#64-目录导入)
- [7. 🤔 如何配置路径映射？](#7--如何配置路径映射)
  - [7.1. baseUrl 配置](#71-baseurl-配置)
  - [7.2. paths 配置](#72-paths-配置)
  - [7.3. 使用路径映射](#73-使用路径映射)
  - [7.4. 打包工具配置](#74-打包工具配置)
- [8. 🤔 如何处理第三方库的类型？](#8--如何处理第三方库的类型)
  - [8.1. @types 包](#81-types-包)
  - [8.2. typeRoots 配置](#82-typeroots-配置)
  - [8.3. types 配置](#83-types-配置)
  - [8.4. 自定义类型声明](#84-自定义类型声明)
  - [8.5. 模块扩展](#85-模块扩展)
- [9. 🤔 常见的模块解析问题有哪些？](#9--常见的模块解析问题有哪些)
  - [9.1. 问题 1：找不到模块](#91-问题-1找不到模块)
  - [9.2. 问题 2：路径别名不工作](#92-问题-2路径别名不工作)
  - [9.3. 问题 3：类型声明找不到](#93-问题-3类型声明找不到)
  - [9.4. 问题 4：循环依赖](#94-问题-4循环依赖)
  - [9.5. 问题 5：node_modules 类型冲突](#95-问题-5node_modules-类型冲突)
  - [9.6. 问题 6：相对路径过长](#96-问题-6相对路径过长)
- [10. 🤔 如何优化模块解析性能？](#10--如何优化模块解析性能)
  - [10.1. 配置优化](#101-配置优化)
  - [10.2. 项目结构优化](#102-项目结构优化)
  - [10.3. 调试工具](#103-调试工具)
  - [10.4. 监控和分析](#104-监控和分析)
  - [10.5. 最佳实践](#105-最佳实践)
- [11. 🔗 引用](#11--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 模块解析的概念和原理
- Classic 和 Node 解析策略
- 相对路径和非相对路径的解析
- 路径映射和别名配置
- 第三方库类型解析
- 常见问题和解决方案
- 性能优化技巧

## 2. 🫧 评价

模块解析策略是 TypeScript 如何定位和加载模块的机制。

模块解析的特点：

- 编译时解析：在编译阶段确定模块位置
- 多种策略：支持不同的解析方式
- 可配置：通过 tsconfig.json 配置
- 影响构建：直接影响编译和打包

TypeScript 的两种解析策略：

| 策略         | Classic     | Node              |
| ------------ | ----------- | ----------------- |
| 使用场景     | 旧项目、AMD | 现代项目、Node.js |
| 复杂度       | 简单        | 复杂              |
| node_modules | 不支持      | 支持              |
| package.json | 不支持      | 支持              |
| 推荐度       | 不推荐      | 推荐              |

模块解析的影响：

1. 开发体验：影响 IDE 提示
2. 构建速度：影响编译性能
3. 错误诊断：影响错误提示
4. 代码组织：影响项目结构

理解模块解析，能帮助你：

1. 配置正确的解析策略
2. 解决模块找不到的问题
3. 优化项目结构
4. 提高构建性能

模块解析是 TypeScript 项目配置的重要部分，理解它能避免很多常见问题。

## 3. 🤔 什么是模块解析？

### 3.1. 基本概念

```ts
// ✅ 模块解析就是将模块标识符转换为文件路径的过程
import { User } from './models/User'
// TypeScript 需要找到 './models/User.ts' 文件

import express from 'express'
// TypeScript 需要在 node_modules 中找到 express

import { utils } from '@/utils'
// TypeScript 需要通过路径映射找到实际文件
```

### 3.2. 解析过程

```ts
// ✅ 模块解析的步骤
// 1. 确定模块标识符类型（相对 vs 非相对）
// 2. 根据解析策略查找文件
// 3. 检查文件扩展名
// 4. 查找类型声明文件
// 5. 返回解析结果或错误

// 相对导入
import { foo } from './foo'
// 解析：当前目录下的 foo.ts, foo.tsx, foo.d.ts

// 非相对导入
import { bar } from 'bar'
// 解析：node_modules/bar
```

### 3.3. 模块标识符类型

```ts
// ✅ 1. 相对模块（以 ./ 或 ../ 开头）
import { A } from './moduleA' // 当前目录
import { B } from '../moduleB' // 上级目录
import { C } from '../../moduleC' // 多级上级

// ✅ 2. 非相对模块（不以 ./ 或 ../ 开头）
import React from 'react' // node_modules
import { Component } from '@angular/core'
import { utils } from 'my-utils'

// ✅ 3. 绝对路径（不推荐）
import { D } from '/root/src/moduleD'

// ✅ 4. 路径映射（需要配置）
import { E } from '@/models/moduleE'
import { F } from '@components/moduleF'
```

## 4. 🤔 TypeScript 有哪些模块解析策略？

### 4.1. 两种策略对比

```json
// tsconfig.json
{
  "compilerOptions": {
    // Classic 策略（不推荐）
    "moduleResolution": "classic",

    // Node 策略（推荐）
    "moduleResolution": "node",

    // Node16 / NodeNext（Node.js ESM）
    "moduleResolution": "node16",
    "moduleResolution": "nodenext"
  }
}
```

### 4.2. 选择策略

```ts
// ✅ 使用 Node 策略（推荐）
// 适用于：
// - 现代 TypeScript 项目
// - 使用 npm/yarn 管理依赖
// - Node.js 或打包工具（webpack/vite）

// ⚠️ 使用 Classic 策略
// 适用于：
// - 旧项目迁移
// - AMD 模块系统
// - 不使用 node_modules

// ✅ 使用 Node16/NodeNext
// 适用于：
// - Node.js ESM 项目
// - package.json 设置 "type": "module"
// - 需要区分 .js 和 .mjs
```

### 4.3. 默认值

```json
{
  "compilerOptions": {
    // 默认值取决于 module 选项
    "module": "commonjs",
    // 默认 moduleResolution: "node"

    "module": "amd",
    // 默认 moduleResolution: "classic"

    "module": "esnext"
    // 默认 moduleResolution: "node"
  }
}
```

## 5. 🤔 Classic 解析策略是如何工作的？

### 5.1. 相对导入

```ts
// 源文件：/root/src/folder/A.ts
import { B } from './moduleB'

// ✅ Classic 解析顺序：
// 1. /root/src/folder/moduleB.ts
// 2. /root/src/folder/moduleB.d.ts
```

### 5.2. 非相对导入

```ts
// 源文件：/root/src/folder/A.ts
import { B } from 'moduleB'

// ✅ Classic 解析顺序（向上查找）：
// 1. /root/src/folder/moduleB.ts
// 2. /root/src/folder/moduleB.d.ts
// 3. /root/src/moduleB.ts
// 4. /root/src/moduleB.d.ts
// 5. /root/moduleB.ts
// 6. /root/moduleB.d.ts
// 7. /moduleB.ts
// 8. /moduleB.d.ts
```

### 5.3. Classic 的问题

```ts
// ❌ 不支持 node_modules
import express from 'express'
// 找不到：Classic 不会查找 node_modules

// ❌ 不支持 package.json
// 无法使用 main、types 等字段

// ❌ 不支持目录导入
import { User } from './models'
// 不会自动查找 ./models/index.ts
```

## 6. 🤔 Node 解析策略是如何工作的？

### 6.1. 相对导入

```ts
// 源文件：/root/src/moduleA.ts
import { B } from './moduleB'

// ✅ Node 解析顺序：
// 1. /root/src/moduleB.ts
// 2. /root/src/moduleB.tsx
// 3. /root/src/moduleB.d.ts
// 4. /root/src/moduleB/package.json（types 字段）
// 5. /root/src/moduleB/index.ts
// 6. /root/src/moduleB/index.tsx
// 7. /root/src/moduleB/index.d.ts
```

### 6.2. 非相对导入

```ts
// 源文件：/root/src/moduleA.ts
import { B } from 'moduleB'

// ✅ Node 解析顺序（向上查找 node_modules）：
// 1. /root/src/node_modules/moduleB.ts
// 2. /root/src/node_modules/moduleB.tsx
// 3. /root/src/node_modules/moduleB.d.ts
// 4. /root/src/node_modules/moduleB/package.json（types 或 main）
// 5. /root/src/node_modules/moduleB/index.ts
// 6. /root/src/node_modules/moduleB/index.tsx
// 7. /root/src/node_modules/moduleB/index.d.ts

// 然后继续向上查找：
// 8. /root/node_modules/moduleB/...
// 9. /node_modules/moduleB/...
```

### 6.3. package.json 解析

```json
// node_modules/mylib/package.json
{
  "name": "mylib",
  // 优先级 1：types 字段（TypeScript 类型）
  "types": "./dist/index.d.ts",

  // 优先级 2：typings 字段（别名）
  "typings": "./dist/index.d.ts",

  // 优先级 3：main 字段（JavaScript 入口）
  "main": "./dist/index.js",

  // 优先级 4：exports 字段（现代）
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  }
}
```

### 6.4. 目录导入

```ts
// ✅ 导入目录（自动查找 index）
import { User } from './models'

// 解析顺序：
// 1. ./models/package.json（types）
// 2. ./models/index.ts
// 3. ./models/index.tsx
// 4. ./models/index.d.ts

// ✅ 实际项目示例
// src/models/index.ts（桶文件）
export { User } from './User'
export { Product } from './Product'

// 使用
import { User, Product } from './models'
```

## 7. 🤔 如何配置路径映射？

### 7.1. baseUrl 配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "."
    // 所有非相对导入都相对于 baseUrl
  }
}
```

```ts
// 项目结构
// ├── src/
// │   ├── models/
// │   │   └── User.ts
// │   └── app.ts
// └── tsconfig.json

// baseUrl: "."
import { User } from 'src/models/User'

// baseUrl: "./src"
import { User } from 'models/User'
```

### 7.2. paths 配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      // @ 映射到 src
      "@/*": ["src/*"],

      // 模块别名
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"],
      "@models/*": ["src/models/*"],

      // 多个候选路径
      "@shared/*": ["src/shared/*", "lib/shared/*"],

      // 精确匹配
      "jquery": ["node_modules/jquery/dist/jquery"]
    }
  }
}
```

### 7.3. 使用路径映射

```ts
// ✅ 使用 @ 别名
import { User } from '@/models/User'
import { Button } from '@/components/Button'
import { formatDate } from '@/utils/date'

// ✅ 使用模块别名
import { Modal } from '@components/Modal'
import { api } from '@utils/api'
import { Product } from '@models/Product'

// ✅ 避免相对路径地狱
// ❌ 不好
import { User } from '../../../models/User'
import { helper } from '../../../../utils/helper'

// ✅ 好
import { User } from '@/models/User'
import { helper } from '@/utils/helper'
```

### 7.4. 打包工具配置

```js
// ✅ webpack.config.js
module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
}

// ✅ vite.config.ts
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
    },
  },
})

// ✅ jest.config.js
module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
  },
}
```

## 8. 🤔 如何处理第三方库的类型？

### 8.1. @types 包

```bash
# ✅ 安装类型定义
npm install --save-dev @types/node
npm install --save-dev @types/react
npm install --save-dev @types/lodash

# 使用
import * as fs from 'fs'           # @types/node
import React from 'react'          # @types/react
import _ from 'lodash'             # @types/lodash
```

### 8.2. typeRoots 配置

```json
// tsconfig.json
{
  "compilerOptions": {
    // 默认查找所有 node_modules/@types
    "typeRoots": ["./node_modules/@types"],

    // 自定义类型目录
    "typeRoots": ["./node_modules/@types", "./typings"]
  }
}
```

### 8.3. types 配置

```json
// tsconfig.json
{
  "compilerOptions": {
    // 只包含指定的类型包
    "types": ["node", "jest", "express"],

    // 不自动包含所有 @types
    "types": []
  }
}
```

### 8.4. 自定义类型声明

```ts
// ✅ 1. 在项目中声明类型
// src/types/custom.d.ts
declare module 'my-untyped-library' {
  export function doSomething(): void
}

// 使用
import { doSomething } from 'my-untyped-library'

// ✅ 2. 声明全局类型
// src/types/global.d.ts
declare global {
  interface Window {
    myGlobal: string
  }
}

export {}

// 使用
window.myGlobal = 'value'

// ✅ 3. 声明模块格式
// src/types/modules.d.ts
declare module '*.svg' {
  const content: string
  export default content
}

declare module '*.css' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.json' {
  const value: any
  export default value
}
```

### 8.5. 模块扩展

```ts
// ✅ 扩展第三方库类型
// src/types/express.d.ts
import { User } from '@/models/User'

declare module 'express-serve-static-core' {
  interface Request {
    user?: User
  }
}

// 使用
app.get('/profile', (req, res) => {
  const user = req.user // 类型正确
})
```

## 9. 🤔 常见的模块解析问题有哪些？

### 9.1. 问题 1：找不到模块

```ts
// ❌ 错误：Cannot find module './User'
import { User } from './User'

// ✅ 解决方案：
// 1. 检查文件是否存在
// 2. 检查文件扩展名（TypeScript 不需要扩展名）
// 3. 检查大小写（区分大小写）
import { User } from './user'  // 如果文件是 user.ts

// 4. 检查 tsconfig.json 配置
{
  "compilerOptions": {
    "moduleResolution": "node"
  }
}
```

### 9.2. 问题 2：路径别名不工作

```ts
// ❌ 错误：Cannot find module '@/models/User'
import { User } from '@/models/User'

// ✅ 解决方案：
// 1. 配置 tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}

// 2. 配置打包工具（webpack/vite）
// 3. 配置测试工具（jest）
// 4. 重启 IDE 或 TypeScript 服务器
```

### 9.3. 问题 3：类型声明找不到

```ts
// ❌ 错误：Could not find a declaration file for module 'my-lib'
import myLib from 'my-lib'

// ✅ 解决方案：
// 1. 安装 @types 包
npm install --save-dev @types/my-lib

// 2. 自己声明类型
// src/types/my-lib.d.ts
declare module 'my-lib' {
  const myLib: any
  export default myLib
}

// 3. 使用 skipLibCheck
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

### 9.4. 问题 4：循环依赖

```ts
// ❌ 循环依赖导致类型错误
// a.ts
import { B } from './b'
export interface A {
  b: B
}

// b.ts
import { A } from './a'
export interface B {
  a: A
}

// ✅ 解决方案：
// 1. 提取共同类型
// types.ts
export interface A {
  b: B
}
export interface B {
  a: A
}

// 2. 使用类型导入
// a.ts
import type { B } from './b'
export interface A {
  b: B
}
```

### 9.5. 问题 5：node_modules 类型冲突

```ts
// ❌ 多个版本的类型定义冲突
// node_modules/@types/react (v17)
// node_modules/some-lib/node_modules/@types/react (v16)

// ✅ 解决方案：
// 1. 统一版本
npm dedupe

// 2. 使用 yarn resolutions 或 npm overrides
{
  "resolutions": {
    "@types/react": "^18.0.0"
  }
}

// 3. 排除冲突的类型
{
  "compilerOptions": {
    "typeRoots": ["./node_modules/@types"],
    "types": ["node", "jest"]  // 只包含需要的
  }
}
```

### 9.6. 问题 6：相对路径过长

```ts
// ❌ 相对路径地狱
import { User } from '../../../models/User'
import { api } from '../../../../services/api'

// ✅ 解决方案：使用路径映射
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}

// 使用
import { User } from '@/models/User'
import { api } from '@/services/api'
```

## 10. 🤔 如何优化模块解析性能？

### 10.1. 配置优化

```json
// tsconfig.json
{
  "compilerOptions": {
    // ✅ 1. 跳过库检查（显著提升速度）
    "skipLibCheck": true,

    // ✅ 2. 增量编译
    "incremental": true,
    "tsBuildInfoFile": "./.tsbuildinfo",

    // ✅ 3. 精确的 types
    "types": ["node", "jest"], // 只包含需要的

    // ✅ 4. 合理的 moduleResolution
    "moduleResolution": "node",

    // ✅ 5. 使用 project references
    "composite": true
  },

  // ✅ 6. 排除不需要的文件
  "exclude": ["node_modules", "dist", "build", "/*.spec.ts"]
}
```

### 10.2. 项目结构优化

```ts
// ✅ 1. 使用桶文件（但不要过度）
// models/index.ts
export { User } from './User'
export { Product } from './Product'

// 使用
import { User, Product } from '@/models'

// ⚠️ 注意：大型项目中避免过度使用桶文件
// 可能导致循环依赖和性能问题

// ✅ 2. 分离类型定义
// types/index.ts
export interface User {}
export interface Product {}

// implementations/User.ts
import type { User } from '@/types'

// ✅ 3. 合理的目录结构
// src/
// ├── features/      # 功能模块
// │   ├── auth/
// │   └── dashboard/
// ├── shared/        # 共享代码
// │   ├── components/
// │   ├── utils/
// │   └── types/
// └── core/          # 核心代码
```

### 10.3. 调试工具

```bash
# ✅ 1. 查看模块解析过程
tsc --traceResolution

# ✅ 2. 显示扩展诊断
tsc --extendedDiagnostics

# ✅ 3. 生成诊断文件
tsc --generateTrace ./trace

# ✅ 4. 列出编译文件
tsc --listFiles
```

### 10.4. 监控和分析

```json
// ✅ 使用 TypeScript 性能分析
// tsconfig.json
{
  "compilerOptions": {
    "diagnostics": true,
    "extendedDiagnostics": true
  }
}
```

```bash
# ✅ 分析编译时间
tsc --diagnostics

# 输出示例：
# Files:           250
# Lines:           45000
# Nodes:           180000
# Identifiers:     60000
# Symbols:         50000
# Types:           15000
# I/O Read time:   0.15s
# I/O Write time:  0.08s
# Parse time:      0.50s
# Bind time:       0.30s
# Check time:      1.20s
# Emit time:       0.40s
# Total time:      2.63s
```

### 10.5. 最佳实践

```ts
// ✅ 1. 明确的导入导出
// 好：明确导出
export { User, createUser }

// 不好：导出所有
export * from './user'

// ✅ 2. 避免深层嵌套
// 好
import { User } from '@/models/User'

// 不好
import { User } from '../../../models/User'

// ✅ 3. 按需导入
// 好
import { debounce } from 'lodash/debounce'

// 不好
import _ from 'lodash'
_.debounce(...)

// ✅ 4. 类型导入使用 type
// 好
import type { User } from '@/types'
import { UserService } from '@/services'

// 不好
import { User, UserService } from '@/services'

// ✅ 5. 合理使用 skipLibCheck
{
  "compilerOptions": {
    // 开发时可以启用加速
    "skipLibCheck": true,

    // 生产构建时可以禁用确保类型正确
    // "skipLibCheck": false
  }
}

// ✅ 6. 使用 paths 简化导入
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "~/*": ["../shared/*"]
    }
  }
}

// ✅ 7. 文档化路径配置
/
 * 路径别名说明：
 * @/* - src 目录
 * @components/* - src/components
 * @utils/* - src/utils
 * ~/* - 共享库目录
 */
```

## 11. 🔗 引用

- [TypeScript Handbook - Module Resolution][1]
- [TypeScript - Module Resolution Strategies][2]
- [Understanding TypeScript's Module Resolution][3]
- [TypeScript Performance][4]

[1]: https://www.typescriptlang.org/docs/handbook/module-resolution.html
[2]: https://www.typescriptlang.org/docs/handbook/modules.html#module-resolution
[3]: https://www.typescriptlang.org/docs/handbook/module-resolution.html
[4]: https://github.com/microsoft/TypeScript/wiki/Performance
