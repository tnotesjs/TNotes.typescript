# [0138. 模块解析的 baseUrl 和 paths](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0138.%20%E6%A8%A1%E5%9D%97%E8%A7%A3%E6%9E%90%E7%9A%84%20baseUrl%20%E5%92%8C%20paths)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是 baseUrl？](#3--什么是-baseurl)
  - [3.1. 基本概念](#31-基本概念)
  - [3.2. baseUrl 的值](#32-baseurl-的值)
  - [3.3. baseUrl 的作用域](#33-baseurl-的作用域)
  - [3.4. 使用示例](#34-使用示例)
- [4. 🤔 什么是 paths？](#4--什么是-paths)
  - [4.1. 基本概念](#41-基本概念)
  - [4.2. paths 的语法](#42-paths-的语法)
  - [4.3. 模式匹配](#43-模式匹配)
  - [4.4. paths 的依赖](#44-paths-的依赖)
- [5. 🤔 baseUrl 和 paths 如何配合使用？](#5--baseurl-和-paths-如何配合使用)
  - [5.1. 配合原理](#51-配合原理)
  - [5.2. 解析过程](#52-解析过程)
  - [5.3. 常见配置组合](#53-常见配置组合)
- [6. 🤔 如何配置常见的路径映射？](#6--如何配置常见的路径映射)
  - [6.1. 标准项目结构](#61-标准项目结构)
  - [6.2. Monorepo 配置](#62-monorepo-配置)
  - [6.3. 多环境配置](#63-多环境配置)
  - [6.4. 测试配置](#64-测试配置)
  - [6.5. 特殊路径映射](#65-特殊路径映射)
- [7. 🤔 如何在打包工具中同步配置？](#7--如何在打包工具中同步配置)
  - [7.1. Webpack 配置](#71-webpack-配置)
  - [7.2. Vite 配置](#72-vite-配置)
  - [7.3. Rollup 配置](#73-rollup-配置)
  - [7.4. Jest 配置](#74-jest-配置)
  - [7.5. ESLint 配置](#75-eslint-配置)
  - [7.6. 统一配置工具](#76-统一配置工具)
- [8. 🤔 有哪些常见的配置问题？](#8--有哪些常见的配置问题)
  - [8.1. 问题 1：配置不生效](#81-问题-1配置不生效)
  - [8.2. 问题 2：IDE 不识别](#82-问题-2ide-不识别)
  - [8.3. 问题 3：编译通过但运行失败](#83-问题-3编译通过但运行失败)
  - [8.4. 问题 4：相对路径混乱](#84-问题-4相对路径混乱)
  - [8.5. 问题 5：通配符使用错误](#85-问题-5通配符使用错误)
  - [8.6. 问题 6：paths 顺序问题](#86-问题-6paths-顺序问题)
- [9. 🤔 如何优化 paths 配置？](#9--如何优化-paths-配置)
  - [9.1. 合理的别名数量](#91-合理的别名数量)
  - [9.2. 语义化的别名](#92-语义化的别名)
  - [9.3. 统一的别名前缀](#93-统一的别名前缀)
  - [9.4. 分层的路径配置](#94-分层的路径配置)
- [10. 🤔 paths 配置的最佳实践是什么？](#10--paths-配置的最佳实践是什么)
  - [10.1. 文档化配置](#101-文档化配置)
  - [10.2. 保持配置同步](#102-保持配置同步)
  - [10.3. 渐进式采用](#103-渐进式采用)
  - [10.4. 团队规范](#104-团队规范)
  - [10.5. 配置验证](#105-配置验证)
- [11. 🔗 引用](#11--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- baseUrl 的概念和作用
- paths 的配置方法
- baseUrl 和 paths 的配合使用
- 常见路径映射模式
- 打包工具的配置同步
- 常见问题和解决方案
- 配置优化技巧
- 最佳实践

## 2. 🫧 评价

baseUrl 和 paths 是 **TypeScript 模块解析的两个重要配置选项**。

两者的特点：

**baseUrl**：
- 设置非相对模块的基础目录
- 所有非相对导入都相对于这个目录
- 简化模块路径
- 示例：`"baseUrl": "./src"`

**paths**：
- 配置路径映射（别名）
- 支持模式匹配
- 更灵活的路径定义
- 示例：`"@/*": ["src/*"]`

baseUrl vs paths 对比：

| 特性 | baseUrl | paths |
|------|---------|-------|
| **作用** | 设置基础目录 | 配置路径别名 |
| **灵活性** | 较低 | 高 |
| **配置复杂度** | 简单 | 相对复杂 |
| **使用场景** | 简单项目 | 复杂项目 |
| **依赖关系** | 独立 | 依赖 baseUrl |

配置的价值：
1. **简化导入**：避免深层相对路径
2. **提高可维护性**：移动文件不影响导入
3. **增强可读性**：清晰的模块关系
4. **统一风格**：项目导入规范

理解 baseUrl 和 paths，能帮助你：
1. 配置清晰的模块路径
2. 优化项目结构
3. 提升开发体验
4. 解决路径问题

正确配置 baseUrl 和 paths 是 TypeScript 项目的基础工作。

## 3. 🤔 什么是 baseUrl？

### 3.1. 基本概念

```json
// tsconfig.json
{
  "compilerOptions": {
    // baseUrl 指定非相对模块导入的基础目录
    "baseUrl": "."
  }
}
```

```ts
// ✅ 设置 baseUrl 后的效果
// tsconfig.json: "baseUrl": "./src"

// 项目结构
// src/
// ├── models/
// │   └── User.ts
// ├── utils/
// │   └── api.ts
// └── App.tsx

// App.tsx 中可以这样导入
import { User } from 'models/User'      // 相对于 src/
import { api } from 'utils/api'         // 相对于 src/
```

### 3.2. baseUrl 的值

```json
// ✅ 1. 相对于 tsconfig.json 的路径
{
  "compilerOptions": {
    "baseUrl": "."       // tsconfig.json 所在目录
  }
}

{
  "compilerOptions": {
    "baseUrl": "./src"   // tsconfig.json 同级的 src 目录
  }
}

{
  "compilerOptions": {
    "baseUrl": "../"     // tsconfig.json 的上级目录
  }
}

// ✅ 2. 绝对路径（不推荐）
{
  "compilerOptions": {
    "baseUrl": "/absolute/path/to/src"
  }
}
```

### 3.3. baseUrl 的作用域

```ts
// tsconfig.json: "baseUrl": "./src"

// ✅ 影响非相对导入
import { User } from 'models/User'      // ✅ 相对于 baseUrl
import { api } from 'utils/api'         // ✅ 相对于 baseUrl

// ⚠️ 不影响相对导入
import { helper } from './helper'       // 相对于当前文件
import { config } from '../config'      // 相对于当前文件

// ⚠️ 不影响 node_modules
import React from 'react'               // 从 node_modules
import axios from 'axios'               // 从 node_modules
```

### 3.4. 使用示例

```json
// 示例 1：baseUrl 设为项目根目录
{
  "compilerOptions": {
    "baseUrl": "."
  }
}
```

```ts
// 使用（相对于项目根目录）
import { User } from 'src/models/User'
import { api } from 'src/utils/api'
```

```json
// 示例 2：baseUrl 设为 src 目录（推荐）
{
  "compilerOptions": {
    "baseUrl": "./src"
  }
}
```

```ts
// 使用（相对于 src 目录）
import { User } from 'models/User'
import { api } from 'utils/api'
```

## 4. 🤔 什么是 paths？

### 4.1. 基本概念

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      // 路径映射：别名 -> 实际路径
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

```ts
// ✅ 使用路径映射
import { User } from '@/models/User'              // -> src/models/User
import { Button } from '@components/Button'      // -> src/components/Button
import { formatDate } from '@utils/date'         // -> src/utils/date
```

### 4.2. paths 的语法

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      // ✅ 1. 通配符映射
      "@/*": ["src/*"],
      // @ 后面的任何内容会替换 * 位置
      
      // ✅ 2. 精确映射
      "jquery": ["node_modules/jquery/dist/jquery.min.js"],
      
      // ✅ 3. 多个候选路径
      "@shared/*": [
        "src/shared/*",
        "lib/shared/*",
        "../shared/*"
      ],
      // 按顺序查找，找到第一个存在的
      
      // ✅ 4. 映射到根目录
      "~/*": ["./*"],
      
      // ✅ 5. 多级通配符
      "@features/*/components/*": ["src/features/*/components/*"]
    }
  }
}
```

### 4.3. 模式匹配

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      // ✅ * 匹配任意字符
      "@/*": ["src/*"],
      
      // ✅ 使用示例
      // @/models/User -> src/models/User
      // @/utils/date -> src/utils/date
      // @/components/Button/Button -> src/components/Button/Button
    }
  }
}
```

```ts
// ✅ 模式匹配示例
// paths: { "@features/*/models/*": ["src/features/*/models/*"] }

import { User } from '@features/auth/models/User'
// 解析为：src/features/auth/models/User

import { Product } from '@features/shop/models/Product'
// 解析为：src/features/shop/models/Product
```

### 4.4. paths 的依赖

```json
// ❌ 错误：paths 必须配合 baseUrl
{
  "compilerOptions": {
    // "baseUrl": ".",  // 缺少 baseUrl
    "paths": {
      "@/*": ["src/*"]  // 不会生效
    }
  }
}

// ✅ 正确：必须同时配置 baseUrl
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

## 5. 🤔 baseUrl 和 paths 如何配合使用？

### 5.1. 配合原理

```json
// ✅ paths 中的路径相对于 baseUrl
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
      // src/* 相对于 baseUrl（即项目根目录）
      // 实际路径：./src/*
    }
  }
}
```

### 5.2. 解析过程

```ts
// 配置
// baseUrl: "."
// paths: { "@/*": ["src/*"] }

// 导入
import { User } from '@/models/User'

// 解析步骤：
// 1. 匹配 paths 规则：@ 匹配，* 捕获 models/User
// 2. 替换：src/* -> src/models/User
// 3. 相对于 baseUrl 解析：./src/models/User
// 4. 查找文件：
//    - ./src/models/User.ts
//    - ./src/models/User.tsx
//    - ./src/models/User.d.ts
//    - ./src/models/User/index.ts
```

### 5.3. 常见配置组合

```json
// ✅ 组合 1：baseUrl 为根目录
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

```ts
// 使用
import { User } from '@/models/User'
import { Button } from '@components/Button'
import { api } from '@utils/api'
```

```json
// ✅ 组合 2：baseUrl 为 src
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"],           // 相对于 src
      "@components/*": ["components/*"],
      "@utils/*": ["utils/*"]
    }
  }
}
```

```ts
// 使用（效果相同）
import { User } from '@/models/User'
import { Button } from '@components/Button'
import { api } from '@utils/api'
```

```json
// ✅ 组合 3：多级 baseUrl
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"],
      "~/*": ["../*"]  // 上级目录（项目根目录）
    }
  }
}
```

```ts
// 使用
import { User } from '@/models/User'        // src/models/User
import { config } from '~/config'           // ../config（项目根目录）
```

## 6. 🤔 如何配置常见的路径映射？

### 6.1. 标准项目结构

```json
// 项目结构
// ├── src/
// │   ├── components/
// │   ├── features/
// │   ├── hooks/
// │   ├── services/
// │   ├── utils/
// │   ├── models/
// │   ├── types/
// │   └── assets/
// └── tsconfig.json

// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@features/*": ["src/features/*"],
      "@hooks/*": ["src/hooks/*"],
      "@services/*": ["src/services/*"],
      "@utils/*": ["src/utils/*"],
      "@models/*": ["src/models/*"],
      "@types/*": ["src/types/*"],
      "@assets/*": ["src/assets/*"]
    }
  }
}
```

### 6.2. Monorepo 配置

```json
// Monorepo 结构
// ├── packages/
// │   ├── app/
// │   ├── shared/
// │   └── utils/
// └── tsconfig.base.json

// tsconfig.base.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@app/*": ["packages/app/src/*"],
      "@shared/*": ["packages/shared/src/*"],
      "@utils/*": ["packages/utils/src/*"]
    }
  }
}
```

```ts
// 使用
import { Component } from '@app/components/Component'
import { helper } from '@shared/helpers'
import { formatDate } from '@utils/date'
```

### 6.3. 多环境配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@env": ["src/config/env.development.ts"]
    }
  }
}

// tsconfig.production.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"],
      "@env": ["src/config/env.production.ts"]
    }
  }
}
```

### 6.4. 测试配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@test/*": ["test/*"],
      "@mocks/*": ["test/mocks/*"],
      "@fixtures/*": ["test/fixtures/*"]
    }
  }
}
```

```ts
// 测试文件中使用
import { Component } from '@/components/Component'
import { mockUser } from '@mocks/user'
import { userFixture } from '@fixtures/user'
```

### 6.5. 特殊路径映射

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      // ✅ 1. 精确映射第三方库
      "jquery": ["node_modules/jquery/dist/jquery.min.js"],
      
      // ✅ 2. 映射到 CDN（类型定义）
      "react": ["@types/react"],
      
      // ✅ 3. 多个候选路径
      "@shared/*": [
        "src/shared/*",
        "../shared/src/*",
        "../../shared/src/*"
      ],
      
      // ✅ 4. 功能模块映射
      "@auth/*": ["src/features/auth/*"],
      "@dashboard/*": ["src/features/dashboard/*"],
      
      // ✅ 5. 版本映射
      "@v1/*": ["src/api/v1/*"],
      "@v2/*": ["src/api/v2/*"]
    }
  }
}
```

## 7. 🤔 如何在打包工具中同步配置？

### 7.1. Webpack 配置

```js
// webpack.config.js
const path = require('path')

module.exports = {
  resolve: {
    // ✅ 配置别名（对应 tsconfig.json 的 paths）
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@models': path.resolve(__dirname, 'src/models'),
      '@hooks': path.resolve(__dirname, 'src/hooks')
    },
    
    // ✅ 文件扩展名
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  }
}

// ✅ 使用 tsconfig-paths-webpack-plugin（自动同步）
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  resolve: {
    plugins: [new TsconfigPathsPlugin()]
  }
}
```

### 7.2. Vite 配置

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@models': path.resolve(__dirname, './src/models')
    }
  }
})

// ✅ 使用 vite-tsconfig-paths（自动同步）
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()]
})
```

### 7.3. Rollup 配置

```js
// rollup.config.js
import alias from '@rollup/plugin-alias'
import path from 'path'

export default {
  plugins: [
    alias({
      entries: [
        { find: '@', replacement: path.resolve(__dirname, 'src') },
        { find: '@components', replacement: path.resolve(__dirname, 'src/components') },
        { find: '@utils', replacement: path.resolve(__dirname, 'src/utils') }
      ]
    })
  ]
}
```

### 7.4. Jest 配置

```js
// jest.config.js
module.exports = {
  // ✅ 模块名映射（对应 paths）
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@models/(.*)$': '<rootDir>/src/models/$1'
  }
}

// ✅ 使用 ts-jest 预设（自动处理）
module.exports = {
  preset: 'ts-jest',
  // ts-jest 会读取 tsconfig.json
}
```

### 7.5. ESLint 配置

```js
// .eslintrc.js
module.exports = {
  settings: {
    'import/resolver': {
      typescript: {
        // ✅ 使用 tsconfig.json 的配置
        project: './tsconfig.json'
      },
      // 或手动配置
      alias: {
        map: [
          ['@', './src'],
          ['@components', './src/components'],
          ['@utils', './src/utils']
        ],
        extensions: ['.ts', '.tsx', '.js', '.jsx']
      }
    }
  }
}
```

### 7.6. 统一配置工具

```bash
# ✅ 安装 tsconfig-paths（运行时支持）
npm install -D tsconfig-paths

# 在 Node.js 中使用
node -r tsconfig-paths/register src/index.ts
```

```json
// package.json
{
  "scripts": {
    "dev": "node -r tsconfig-paths/register src/index.ts",
    "start": "ts-node -r tsconfig-paths/register src/index.ts"
  }
}
```

## 8. 🤔 有哪些常见的配置问题？

### 8.1. 问题 1：配置不生效

```json
// ❌ 问题：paths 配置但 TypeScript 找不到模块
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"]
    }
  }
}

// ✅ 解决：必须配置 baseUrl
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### 8.2. 问题 2：IDE 不识别

```ts
// ❌ 配置了 paths，但 VS Code 无法跳转
import { User } from '@/models/User'

// ✅ 解决方案：
// 1. 检查 tsconfig.json 位置（必须在项目根目录）
// 2. 重启 TypeScript 服务器
//    VS Code: Ctrl+Shift+P -> "TypeScript: Restart TS Server"
// 3. 检查 VS Code 是否使用了正确的 TypeScript 版本
//    VS Code: Ctrl+Shift+P -> "TypeScript: Select TypeScript Version"
```

### 8.3. 问题 3：编译通过但运行失败

```ts
// ✅ TypeScript 编译通过
import { User } from '@/models/User'

// ❌ 运行时错误：Cannot find module '@/models/User'

// 解决：打包工具也需要配置别名
// webpack.config.js
module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
}
```

### 8.4. 问题 4：相对路径混乱

```json
// ❌ 问题：baseUrl 和 paths 中的路径关系不清
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["src/*"]  // 错误：相对于 baseUrl 再找 src
    }
  }
}

// ✅ 解决：paths 中的路径相对于 baseUrl
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"]  // 正确：相对于 src
    }
  }
}

// 或者
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]  // 正确：相对于项目根
    }
  }
}
```

### 8.5. 问题 5：通配符使用错误

```json
// ❌ 错误：多个 * 不匹配
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/**/*"]  // 错误：** 不支持
    }
  }
}

// ✅ 正确：只用一个 *
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### 8.6. 问题 6：paths 顺序问题

```json
// ⚠️ paths 的匹配是按顺序的
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@/*": ["src/*"]  // 更通用的放后面
    }
  }
}

// ❌ 如果顺序反了
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],  // 会先匹配这个
      "@components/*": ["src/components/*"]  // 永远不会匹配
    }
  }
}
```

## 9. 🤔 如何优化 paths 配置？

### 9.1. 合理的别名数量

```json
// ❌ 过多的别名（难以维护）
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@comp/*": ["src/components/*"],
      "@btn/*": ["src/components/buttons/*"],
      "@input/*": ["src/components/inputs/*"],
      "@modal/*": ["src/components/modals/*"],
      "@util/*": ["src/utils/*"],
      "@str/*": ["src/utils/string/*"],
      "@num/*": ["src/utils/number/*"]
      // ... 太多了
    }
  }
}

// ✅ 合理的别名（清晰易用）
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"],
      "@hooks/*": ["src/hooks/*"],
      "@services/*": ["src/services/*"]
    }
  }
}
```

### 9.2. 语义化的别名

```json
// ❌ 不清晰的别名
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "c/*": ["src/components/*"],  // 太简短
      "u/*": ["src/utils/*"],
      "m/*": ["src/models/*"]
    }
  }
}

// ✅ 清晰的别名
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"],
      "@models/*": ["src/models/*"]
    }
  }
}
```

### 9.3. 统一的别名前缀

```json
// ✅ 推荐：使用 @ 前缀
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}

// ✅ 也可以：使用 ~ 前缀
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~/*": ["src/*"],
      "~components/*": ["src/components/*"],
      "~utils/*": ["src/utils/*"]
    }
  }
}

// ❌ 不推荐：混用前缀
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "~components/*": ["src/components/*"],  // 混乱
      "#utils/*": ["src/utils/*"]             // 混乱
    }
  }
}
```

### 9.4. 分层的路径配置

```json
// ✅ 按功能分层
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      // 通用别名
      "@/*": ["src/*"],
      
      // UI 层
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@pages/*": ["src/pages/*"],
      
      // 业务层
      "@features/*": ["src/features/*"],
      "@services/*": ["src/services/*"],
      
      // 数据层
      "@models/*": ["src/models/*"],
      "@api/*": ["src/api/*"],
      
      // 工具层
      "@utils/*": ["src/utils/*"],
      "@hooks/*": ["src/hooks/*"],
      "@types/*": ["src/types/*"]
    }
  }
}
```

## 10. 🤔 paths 配置的最佳实践是什么？

### 10.1. 文档化配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      // 根目录别名
      "@/*": ["src/*"],
      
      // UI 组件
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      
      // 业务功能
      "@features/*": ["src/features/*"],
      
      // 数据相关
      "@models/*": ["src/models/*"],
      "@services/*": ["src/services/*"],
      
      // 工具函数
      "@utils/*": ["src/utils/*"],
      "@hooks/*": ["src/hooks/*"],
      
      // 类型定义
      "@types/*": ["src/types/*"],
      
      // 静态资源
      "@assets/*": ["src/assets/*"]
    }
  }
}
```

```ts
/**
 * 路径别名使用指南
 * 
 * @/* - src 根目录
 * @components/* - UI 组件
 * @features/* - 业务功能模块
 * @utils/* - 工具函数
 * @hooks/* - React Hooks
 * @models/* - 数据模型
 * @services/* - API 服务
 * @types/* - TypeScript 类型定义
 * @assets/* - 静态资源
 * 
 * 示例：
 * import { Button } from '@components/Button'
 * import { useAuth } from '@hooks/useAuth'
 * import { api } from '@services/api'
 */
```

### 10.2. 保持配置同步

```bash
# ✅ 创建统一的配置文件
# alias.config.js
const path = require('path')

const alias = {
  '@': path.resolve(__dirname, 'src'),
  '@components': path.resolve(__dirname, 'src/components'),
  '@utils': path.resolve(__dirname, 'src/utils'),
  '@hooks': path.resolve(__dirname, 'src/hooks')
}

module.exports = alias
```

```js
// webpack.config.js
const alias = require('./alias.config')

module.exports = {
  resolve: { alias }
}

// vite.config.ts
import alias from './alias.config'

export default {
  resolve: { alias }
}

// jest.config.js
const alias = require('./alias.config')

module.exports = {
  moduleNameMapper: Object.keys(alias).reduce((acc, key) => {
    acc[`^${key}/(.*)$`] = `${alias[key]}/$1`
    return acc
  }, {})
}
```

### 10.3. 渐进式采用

```ts
// ✅ 阶段 1：只配置根目录别名
{
  "paths": {
    "@/*": ["src/*"]
  }
}

// 使用
import { User } from '@/models/User'
import { Button } from '@/components/Button'

// ✅ 阶段 2：添加常用目录别名
{
  "paths": {
    "@/*": ["src/*"],
    "@components/*": ["src/components/*"],
    "@utils/*": ["src/utils/*"]
  }
}

// ✅ 阶段 3：完善所有别名
{
  "paths": {
    "@/*": ["src/*"],
    "@components/*": ["src/components/*"],
    "@features/*": ["src/features/*"],
    "@hooks/*": ["src/hooks/*"],
    "@services/*": ["src/services/*"],
    "@utils/*": ["src/utils/*"]
  }
}
```

### 10.4. 团队规范

```ts
/**
 * 团队导入规范
 * 
 * 1. 优先使用路径别名
 *    ✅ import { User } from '@/models/User'
 *    ❌ import { User } from '../../../models/User'
 * 
 * 2. 同一模块内使用相对路径
 *    ✅ import { helper } from './helper'
 *    ❌ import { helper } from '@/features/auth/helper'
 * 
 * 3. 跨模块使用别名
 *    ✅ import { Button } from '@components/Button'
 * 
 * 4. 类型导入使用 type 关键字
 *    ✅ import type { User } from '@/types'
 * 
 * 5. 导入顺序
 *    - React/框架
 *    - 第三方库
 *    - 别名导入
 *    - 相对导入
 *    - 样式/资源
 */

// ✅ 示例
import React, { useState } from 'react'
import axios from 'axios'
import { Button } from '@components/Button'
import { api } from '@services/api'
import type { User } from '@types'
import { validator } from './validator'
import styles from './styles.module.css'
```

### 10.5. 配置验证

```bash
# ✅ 添加配置验证脚本
# scripts/validate-paths.js
const ts = require('typescript')
const path = require('path')

const configPath = path.resolve(__dirname, '../tsconfig.json')
const config = ts.readConfigFile(configPath, ts.sys.readFile)

if (config.error) {
  console.error('❌ tsconfig.json 解析失败')
  process.exit(1)
}

const { baseUrl, paths } = config.config.compilerOptions

if (!baseUrl) {
  console.error('❌ 缺少 baseUrl 配置')
  process.exit(1)
}

if (paths && Object.keys(paths).length > 10) {
  console.warn('⚠️  路径别名过多，考虑简化')
}

console.log('✅ paths 配置验证通过')
```

```json
// package.json
{
  "scripts": {
    "validate:paths": "node scripts/validate-paths.js",
    "precommit": "npm run validate:paths"
  }
}
```

## 11. 🔗 引用

- [TypeScript Handbook - Module Resolution][1]
- [TypeScript - Path Mapping][2]
- [tsconfig.json - paths][3]
- [Webpack - Resolve Alias][4]

[1]: https://www.typescriptlang.org/docs/handbook/module-resolution.html
[2]: https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping
[3]: https://www.typescriptlang.org/tsconfig#paths
[4]: https://webpack.js.org/configuration/resolve/#resolvealias
