# [0137. 相对导入 vs. 非相对导入](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0137.%20%E7%9B%B8%E5%AF%B9%E5%AF%BC%E5%85%A5%20vs.%20%E9%9D%9E%E7%9B%B8%E5%AF%B9%E5%AF%BC%E5%85%A5)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 什么是相对导入？](#3-什么是相对导入)
  - [3.1. 基本概念](#31-基本概念)
  - [3.2. 相对导入的类型](#32-相对导入的类型)
  - [3.3. 文件扩展名](#33-文件扩展名)
  - [3.4. 相对导入示例](#34-相对导入示例)
- [4. 什么是非相对导入？](#4-什么是非相对导入)
  - [4.1. 基本概念](#41-基本概念)
  - [4.2. 外部模块导入](#42-外部模块导入)
  - [4.3. 路径别名导入](#43-路径别名导入)
  - [4.4. baseUrl 相对导入](#44-baseurl-相对导入)
- [5. 相对导入和非相对导入有什么区别？](#5-相对导入和非相对导入有什么区别)
  - [5.1. 解析机制差异](#51-解析机制差异)
  - [5.2. 模块解析策略](#52-模块解析策略)
  - [5.3. 用途差异](#53-用途差异)
  - [5.4. 可维护性差异](#54-可维护性差异)
  - [5.5. 性能差异](#55-性能差异)
- [6. 如何选择导入方式？](#6-如何选择导入方式)
  - [6.1. 选择标准](#61-选择标准)
  - [6.2. 使用场景](#62-使用场景)
  - [6.3. 项目规模考虑](#63-项目规模考虑)
- [7. 相对导入有哪些常见问题？](#7-相对导入有哪些常见问题)
  - [7.1. 问题 1：相对路径地狱](#71-问题-1相对路径地狱)
  - [7.2. 问题 2：移动文件破坏导入](#72-问题-2移动文件破坏导入)
  - [7.3. 问题 3：难以理解文件关系](#73-问题-3难以理解文件关系)
  - [7.4. 问题 4：重复的长路径](#74-问题-4重复的长路径)
- [8. 非相对导入有哪些常见问题？](#8-非相对导入有哪些常见问题)
  - [8.1. 问题 1：配置不一致](#81-问题-1配置不一致)
  - [8.2. 问题 2：IDE 不识别路径](#82-问题-2ide-不识别路径)
  - [8.3. 问题 3：测试工具不识别](#83-问题-3测试工具不识别)
  - [8.4. 问题 4：别名冲突](#84-问题-4别名冲突)
- [9. 如何优化导入路径？](#9-如何优化导入路径)
  - [9.1. 使用路径别名](#91-使用路径别名)
  - [9.2. 使用桶文件](#92-使用桶文件)
  - [9.3. 组织导入顺序](#93-组织导入顺序)
  - [9.4. 使用 ESLint 规则](#94-使用-eslint-规则)
- [10. 导入的最佳实践是什么？](#10-导入的最佳实践是什么)
  - [10.1. 统一导入风格](#101-统一导入风格)
  - [10.2. 路径别名命名规范](#102-路径别名命名规范)
  - [10.3. 避免循环依赖](#103-避免循环依赖)
  - [10.4. 按需导入](#104-按需导入)
  - [10.5. 文档化导入策略](#105-文档化导入策略)
  - [10.6. 代码审查清单](#106-代码审查清单)
  - [10.7. 工具配置](#107-工具配置)
- [11. 引用](#11-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 相对导入的概念和用法
- 非相对导入的概念和用法
- 两种导入方式的区别
- 选择导入方式的建议
- 常见问题和解决方案
- 导入路径优化技巧
- 最佳实践

## 2. 评价

相对导入和非相对导入是 **TypeScript 中两种不同的模块引用方式**。

两种导入方式的特点：

**相对导入（Relative Import）**：

- 语法：以 `./` 或 `../` 开头
- 用途：导入项目内部模块
- 解析：相对于当前文件位置
- 示例：`import { User } from './models/User'`

**非相对导入（Non-relative Import）**：

- 语法：不以 `./` 或 `../` 开头
- 用途：导入外部依赖或配置的路径
- 解析：相对于 baseUrl 或 node_modules
- 示例：`import React from 'react'`

相对导入 vs 非相对导入对比：

| 特性         | 相对导入    | 非相对导入           |
| ------------ | ----------- | -------------------- |
| **语法**     | `./`, `../` | 模块名或别名         |
| **用途**     | 项目内部    | 外部依赖/别名        |
| **解析方式** | 相对路径    | baseUrl/node_modules |
| **可移植性** | 依赖位置    | 更灵活               |
| **可读性**   | 可能冗长    | 更简洁               |
| **重构**     | 需要调整    | 不受影响             |

两种方式的使用场景：

1. **相对导入**：同一功能模块内
2. **非相对导入**：跨模块、外部库
3. **路径别名**：简化深层导入
4. **混合使用**：根据情况选择

理解两种导入方式，能帮助你：

1. 组织项目结构
2. 提高代码可维护性
3. 避免路径混乱
4. 优化导入体验

正确使用导入方式能让项目结构更清晰、代码更易维护。

## 3. 什么是相对导入？

### 3.1. 基本概念

```ts
// ✅ 相对导入：使用 ./ 或 ../ 开头的路径
// 相对于当前文件位置解析

// 当前目录
import { User } from './User'
import { Product } from './models/Product'

// 上级目录
import { config } from '../config'
import { utils } from '../../utils'

// 多级上级目录
import { shared } from '../../../shared/constants'
```

### 3.2. 相对导入的类型

```ts
// ✅ 1. 同级导入（当前目录）
// src/models/User.ts
import { validate } from './validator'
import { BaseModel } from './BaseModel'

// ✅ 2. 子级导入（子目录）
// src/models/index.ts
import { User } from './User/User'
import { Product } from './Product/Product'

// ✅ 3. 父级导入（上级目录）
// src/models/User/User.ts
import { config } from '../../config'

// ✅ 4. 兄弟级导入（同级目录的其他目录）
// src/features/auth/Login.ts
import { Button } from '../common/Button'
```

### 3.3. 文件扩展名

```ts
// ✅ TypeScript 不需要文件扩展名
import { User } from './User' // 自动查找 User.ts, User.tsx, User.d.ts
import { config } from './config' // 自动查找 config.ts, config.json

// ⚠️ 显式扩展名（通常不需要）
import { User } from './User.ts'
import { config } from './config.json'

// ✅ 目录导入（自动查找 index）
import { models } from './models' // 查找 models/index.ts
```

### 3.4. 相对导入示例

```ts
// 项目结构
// src/
// ├── features/
// │   ├── auth/
// │   │   ├── Login.tsx
// │   │   └── Register.tsx
// │   └── dashboard/
// │       └── Dashboard.tsx
// ├── components/
// │   └── Button.tsx
// ├── utils/
// │   └── api.ts
// └── App.tsx

// ✅ Login.tsx 中的导入
// src/features/auth/Login.tsx
import { Button } from '../../components/Button' // 组件
import { api } from '../../utils/api' // 工具
import { validateEmail } from './validators' // 同目录

// ✅ Dashboard.tsx 中的导入
// src/features/dashboard/Dashboard.tsx
import { Button } from '../../components/Button'
import { api } from '../../utils/api'

// ✅ App.tsx 中的导入
// src/App.tsx
import { Login } from './features/auth/Login'
import { Dashboard } from './features/dashboard/Dashboard'
```

## 4. 什么是非相对导入？

### 4.1. 基本概念

```ts
// ✅ 非相对导入：不以 ./ 或 ../ 开头
// 解析方式：
// 1. node_modules 中的包
// 2. tsconfig.json 中配置的 paths
// 3. 相对于 baseUrl 的路径

// 外部依赖
import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import _ from 'lodash'

// 路径别名（需要配置）
import { User } from '@/models/User'
import { Button } from '@components/Button'
```

### 4.2. 外部模块导入

```ts
// ✅ 1. 默认导出
import React from 'react'
import express from 'express'
import axios from 'axios'

// ✅ 2. 命名导出
import { useState, useEffect } from 'react'
import { Router } from 'express'
import { AxiosResponse } from 'axios'

// ✅ 3. 命名空间导入
import * as React from 'react'
import * as fs from 'fs'
import * as path from 'path'

// ✅ 4. 混合导入
import React, { Component, useState } from 'react'
import express, { Router, Request, Response } from 'express'

// ✅ 5. 副作用导入
import 'reflect-metadata'
import './polyfills'
import 'zone.js'
```

### 4.3. 路径别名导入

```ts
// tsconfig.json 配置
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"],
      "@models/*": ["src/models/*"],
      "@features/*": ["src/features/*"]
    }
  }
}

// ✅ 使用路径别名
import { User } from '@/models/User'
import { Button } from '@components/Button'
import { api } from '@utils/api'
import { Login } from '@features/auth/Login'
```

### 4.4. baseUrl 相对导入

```ts
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "./src"
  }
}

// ✅ 相对于 baseUrl 的导入
// 文件：src/features/auth/Login.tsx
import { User } from 'models/User'           // src/models/User
import { Button } from 'components/Button'   // src/components/Button
import { api } from 'utils/api'              // src/utils/api
```

## 5. 相对导入和非相对导入有什么区别？

### 5.1. 解析机制差异

```ts
// ✅ 相对导入：基于文件位置
// src/features/auth/Login.tsx
import { User } from '../../models/User'
// 解析：src/models/User.ts

// ✅ 非相对导入：基于配置
// src/features/auth/Login.tsx
import { User } from '@/models/User'
// 解析：根据 paths 配置找到 src/models/User.ts

import React from 'react'
// 解析：node_modules/react
```

### 5.2. 模块解析策略

```ts
// ✅ 相对导入的解析
// 文件：/root/src/features/auth/Login.tsx
import { User } from './User'

// 解析顺序：
// 1. /root/src/features/auth/User.ts
// 2. /root/src/features/auth/User.tsx
// 3. /root/src/features/auth/User.d.ts
// 4. /root/src/features/auth/User/index.ts
// 5. /root/src/features/auth/User/index.tsx
// 6. /root/src/features/auth/User/index.d.ts

// ✅ 非相对导入的解析
// 文件：/root/src/features/auth/Login.tsx
import { User } from 'User'

// Node 解析策略查找 node_modules：
// 1. /root/src/features/auth/node_modules/User
// 2. /root/src/features/node_modules/User
// 3. /root/src/node_modules/User
// 4. /root/node_modules/User
// 5. /node_modules/User
```

### 5.3. 用途差异

```ts
// ✅ 相对导入：项目内部模块
// 特点：明确的文件关系
import { User } from './models/User'
import { config } from '../config'
import { helper } from './helpers/stringHelper'

// ✅ 非相对导入：外部依赖或别名
// 特点：简洁、独立于文件位置
import React from 'react' // 外部库
import { User } from '@/models/User' // 路径别名
import { shared } from 'shared/constants' // baseUrl 相对
```

### 5.4. 可维护性差异

```ts
// ❌ 相对导入：深层嵌套问题
// src/features/auth/components/forms/LoginForm.tsx
import { User } from '../../../../models/User'
import { api } from '../../../../utils/api'
import { Button } from '../../../../components/Button'
// 问题：
// - 路径冗长
// - 移动文件需要更新所有导入
// - 难以阅读

// ✅ 非相对导入：使用别名
// src/features/auth/components/forms/LoginForm.tsx
import { User } from '@/models/User'
import { api } from '@/utils/api'
import { Button } from '@/components/Button'
// 优点：
// - 路径简洁
// - 移动文件不需要更新导入
// - 易于阅读
```

### 5.5. 性能差异

```ts
// ✅ 相对导入：解析更快
// 直接基于文件系统路径，无需额外查找
import { User } from './User'

// ⚠️ 非相对导入：可能较慢
// 需要查找 node_modules 或解析 paths 配置
import { User } from '@/models/User'

// 💡 实际影响很小，可以忽略
// TypeScript 有缓存机制
```

## 6. 如何选择导入方式？

### 6.1. 选择标准

```ts
// ✅ 1. 同一功能模块内：使用相对导入
// src/features/auth/
// ├── Login.tsx
// ├── Register.tsx
// └── validators.ts

// Login.tsx
import { validateEmail } from './validators' // 同目录
import { Register } from './Register' // 同目录

// ✅ 2. 跨功能模块：使用非相对导入（别名）
// src/features/auth/Login.tsx
import { Button } from '@/components/Button' // 共享组件
import { api } from '@/utils/api' // 共享工具
import { User } from '@/models/User' // 数据模型

// ✅ 3. 外部依赖：使用非相对导入
import React from 'react'
import axios from 'axios'
import _ from 'lodash'
```

### 6.2. 使用场景

```ts
// ✅ 场景 1：紧密相关的文件（相对导入）
// src/features/user/
// ├── UserList.tsx
// ├── UserDetail.tsx
// └── userService.ts

// UserList.tsx
import { userService } from './userService'
import { UserDetail } from './UserDetail'

// ✅ 场景 2：共享资源（非相对导入）
// 任意文件
import { Button } from '@/components/Button'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/services/api'

// ✅ 场景 3：配置文件（相对导入更清晰）
// src/config/database.ts
import { envConfig } from './env'
import { loggerConfig } from './logger'

// ✅ 场景 4：测试文件（混合使用）
// src/features/auth/__tests__/Login.test.tsx
import { Login } from '../Login' // 相对：被测试组件
import { render, screen } from '@testing-library/react' // 非相对：测试库
import { mockUser } from '@/mocks/user' // 非相对：测试数据
```

### 6.3. 项目规模考虑

```ts
// ✅ 小型项目（< 50 文件）：相对导入为主
// 结构简单，相对路径不会太深
import { User } from './models/User'
import { api } from '../utils/api'

// ✅ 中型项目（50-200 文件）：混合使用
// 模块内相对导入，跨模块使用别名
import { validator } from './validator' // 模块内
import { Button } from '@/components/Button' // 跨模块

// ✅ 大型项目（> 200 文件）：非相对导入为主
// 配置完善的路径别名系统
import { User } from '@/models/User'
import { Button } from '@/components/Button'
import { api } from '@/services/api'
```

## 7. 相对导入有哪些常见问题？

### 7.1. 问题 1：相对路径地狱

```ts
// ❌ 深层嵌套导致路径冗长
// src/features/dashboard/components/widgets/Chart/ChartComponent.tsx
import { User } from '../../../../../models/User'
import { api } from '../../../../../services/api'
import { formatDate } from '../../../../../utils/date'

// ✅ 解决方案：使用路径别名
import { User } from '@/models/User'
import { api } from '@/services/api'
import { formatDate } from '@/utils/date'
```

### 7.2. 问题 2：移动文件破坏导入

```ts
// ❌ 移动文件后需要更新所有相对路径
// 原位置：src/components/Button.tsx
// 新位置：src/components/common/Button.tsx

// 所有引用都需要更新
// 之前：import { Button } from './Button'
// 之后：import { Button } from './common/Button'

// ✅ 解决方案：使用路径别名
import { Button } from '@/components/Button'
// 移动后只需要更新一处配置
```

### 7.3. 问题 3：难以理解文件关系

```ts
// ❌ 复杂的相对路径难以理解
import { A } from '../../moduleA'
import { B } from '../../../moduleB'
import { C } from './submodule/moduleC'

// ✅ 解决方案：使用明确的别名
import { A } from '@/features/moduleA'
import { B } from '@/shared/moduleB'
import { C } from './submodule/moduleC' // 同模块内可以保持相对
```

### 7.4. 问题 4：重复的长路径

```ts
// ❌ 多次导入相同路径
import { User } from '../../models/User'
import { Product } from '../../models/Product'
import { Order } from '../../models/Order'

// ✅ 解决方案 1：使用别名
import { User } from '@/models/User'
import { Product } from '@/models/Product'
import { Order } from '@/models/Order'

// ✅ 解决方案 2：使用桶文件
// models/index.ts
export { User } from './User'
export { Product } from './Product'
export { Order } from './Order'

// 使用
import { User, Product, Order } from '@/models'
```

## 8. 非相对导入有哪些常见问题？

### 8.1. 问题 1：配置不一致

```ts
// ❌ tsconfig.json 配置了别名，但打包工具没有配置
// TypeScript 编译通过，但运行时找不到模块
import { User } from '@/models/User'

// ✅ 解决方案：同步配置
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}

// webpack.config.js
module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
}

// vite.config.ts
export default {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
}
```

### 8.2. 问题 2：IDE 不识别路径

```ts
// ❌ 配置了 paths，但 IDE 无法跳转
import { User } from '@/models/User'

// ✅ 解决方案：
// 1. 重启 TypeScript 服务器
// VS Code: Ctrl+Shift+P -> "TypeScript: Restart TS Server"

// 2. 检查 tsconfig.json 被 IDE 正确加载
// 确保在项目根目录

// 3. 检查 baseUrl 和 paths 配置正确
{
  "compilerOptions": {
    "baseUrl": ".",  // 必须有
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### 8.3. 问题 3：测试工具不识别

```ts
// ❌ Jest 测试中找不到路径别名
import { User } from '@/models/User' // Error in tests

// ✅ 解决方案：配置 Jest
// jest.config.js
module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}
```

### 8.4. 问题 4：别名冲突

```ts
// ❌ 别名与 npm 包名冲突
// tsconfig.json
{
  "paths": {
    "react/*": ["src/react/*"]  // 与 npm 的 react 冲突
  }
}

// ✅ 解决方案：使用特殊前缀
{
  "paths": {
    "@/*": ["src/*"],
    "@react/*": ["src/react/*"]  // 明确的前缀
  }
}
```

## 9. 如何优化导入路径？

### 9.1. 使用路径别名

```json
// tsconfig.json - 推荐的路径别名配置
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      // 通用别名
      "@/*": ["src/*"],

      // 功能别名
      "@components/*": ["src/components/*"],
      "@features/*": ["src/features/*"],
      "@hooks/*": ["src/hooks/*"],
      "@utils/*": ["src/utils/*"],
      "@services/*": ["src/services/*"],
      "@models/*": ["src/models/*"],
      "@types/*": ["src/types/*"],
      "@assets/*": ["src/assets/*"],

      // 共享库别名
      "~/*": ["../shared/*"]
    }
  }
}
```

### 9.2. 使用桶文件

```ts
// ✅ 创建桶文件（index.ts）聚合导出
// src/components/index.ts
export { Button } from './Button'
export { Input } from './Input'
export { Modal } from './Modal'
export { Select } from './Select'

// 使用
import { Button, Input, Modal } from '@/components'

// ✅ 类型桶文件
// src/types/index.ts
export type { User, UserProps } from './User'
export type { Product, ProductProps } from './Product'
export type { Order, OrderProps } from './Order'

// 使用
import type { User, Product, Order } from '@/types'

// ⚠️ 注意：避免过度使用桶文件
// 可能导致：
// - 循环依赖
// - Tree-shaking 失效
// - 增加包体积
```

### 9.3. 组织导入顺序

```ts
// ✅ 推荐的导入顺序
// 1. React/框架
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// 2. 第三方库
import axios from 'axios'
import _ from 'lodash'
import classNames from 'classnames'

// 3. 内部别名导入（按字母排序）
import { Button } from '@/components/Button'
import { useAuth } from '@/hooks/useAuth'
import { User } from '@/models/User'
import { api } from '@/services/api'
import { formatDate } from '@/utils/date'

// 4. 相对导入
import { validator } from './validator'
import { helpers } from '../helpers'

// 5. 样式
import styles from './Component.module.css'
import './global.css'

// 6. 类型导入（可选：单独分组）
import type { UserProps } from '@/types'
```

### 9.4. 使用 ESLint 规则

```js
// .eslintrc.js
module.exports = {
  plugins: ['import'],
  rules: {
    // 强制导入顺序
    'import/order': [
      'error',
      {
        groups: [
          'builtin', // Node.js 内置模块
          'external', // npm 包
          'internal', // 内部别名
          'parent', // 父目录
          'sibling', // 同级目录
          'index', // index 文件
          'object',
          'type',
        ],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@/**',
            group: 'internal',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],

    // 禁止相对父级导入超过一定层级
    'import/no-relative-parent-imports': 'off',

    // 优先使用绝对导入
    'import/no-relative-packages': 'off',
  },
}
```

## 10. 导入的最佳实践是什么？

### 10.1. 统一导入风格

```ts
// ✅ 制定项目导入规范
/**
 * 导入规范：
 * 1. 同一模块内：使用相对导入
 * 2. 跨模块：使用路径别名
 * 3. 外部库：直接导入包名
 * 4. 类型：使用 type 关键字
 */

// ✅ 好的示例
// src/features/auth/Login.tsx
import React from 'react'
import { Button } from '@/components/Button'
import { useAuth } from '@/hooks/useAuth'
import type { LoginProps } from '@/types'
import { validator } from './validator'

// ❌ 避免混乱的导入
import { Button } from '../../components/Button' // 应该用别名
import * as React from 'react' // 不一致的导入方式
```

### 10.2. 路径别名命名规范

```json
// ✅ 清晰的别名命名
{
  "compilerOptions": {
    "paths": {
      // @ 前缀表示项目根目录
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@features/*": ["src/features/*"],

      // ~ 前缀表示共享库
      "~/*": ["../shared/*"],

      // # 前缀表示测试相关
      "#/*": ["test/*"]
    }
  }
}

// ❌ 避免不清晰的别名
{
  "paths": {
    "c/*": ["src/components/*"],  // 太简短
    "comp/*": ["src/components/*"], // 缩写不清晰
    "components": ["src/components/index"] // 混淆
  }
}
```

### 10.3. 避免循环依赖

```ts
// ❌ 循环依赖
// a.ts
import { b } from './b'
export const a = b + 1

// b.ts
import { a } from './a'
export const b = a + 1

// ✅ 解决方案 1：提取共同依赖
// shared.ts
export const base = 10

// a.ts
import { base } from './shared'
export const a = base + 1

// b.ts
import { base } from './shared'
export const b = base + 2

// ✅ 解决方案 2：使用类型导入
// a.ts
import type { B } from './b'
export interface A extends B {}

// b.ts
import type { A } from './a'
export interface B extends A {}
```

### 10.4. 按需导入

```ts
// ✅ 从大型库按需导入
// 好
import { debounce } from 'lodash/debounce'
import { Button } from '@mui/material/Button'

// 不好（导入整个库）
import _ from 'lodash'
import * as MUI from '@mui/material'

// ✅ Tree-shaking 友好的导入
import { useState, useEffect } from 'react' // 好
import * as React from 'react' // 不利于 tree-shaking
```

### 10.5. 文档化导入策略

```ts
/**
 * 项目导入指南
 *
 * ## 导入规则
 *
 * ### 1. 相对导入
 * - 用于同一功能模块内的文件
 * - 示例：`import { helper } from './helper'`
 *
 * ### 2. 别名导入
 * - 用于跨模块引用
 * - 别名说明：
 *   - `@/*` - src 目录
 *   - `@components/*` - 组件目录
 *   - `@hooks/*` - Hooks 目录
 *
 * ### 3. 导入顺序
 * 1. React/框架
 * 2. 第三方库
 * 3. 内部别名
 * 4. 相对导入
 * 5. 样式/资源
 *
 * ### 4. 类型导入
 * - 使用 `import type` 导入类型
 * - 示例：`import type { User } from '@/types'`
 */

// 使用示例
import React, { useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/Button'
import type { User } from '@/types'
import { validator } from './validator'
import styles from './styles.module.css'
```

### 10.6. 代码审查清单

```ts
// ✅ 导入审查清单

// 1. 检查导入是否必要
// ❌ 未使用的导入
import { unused } from '@/utils/unused'

// 2. 检查导入方式是否一致
// ❌ 混用相对和绝对路径
import { A } from '../../components/A'
import { B } from '@/components/B'

// ✅ 统一使用别名
import { A } from '@/components/A'
import { B } from '@/components/B'

// 3. 检查是否可以使用别名简化
// ❌ 深层相对路径
import { User } from '../../../models/User'

// ✅ 使用别名
import { User } from '@/models/User'

// 4. 检查导入顺序
// ❌ 混乱的顺序
import { helper } from './helper'
import React from 'react'
import { Button } from '@/components/Button'

// ✅ 正确的顺序
import React from 'react'
import { Button } from '@/components/Button'
import { helper } from './helper'

// 5. 检查类型导入
// ❌ 混用类型和值导入
import { User, api } from '@/services'

// ✅ 分离类型导入
import type { User } from '@/types'
import { api } from '@/services'
```

### 10.7. 工具配置

```json
// package.json - 添加导入检查脚本
{
  "scripts": {
    "lint:imports": "eslint . --ext .ts,.tsx --rule 'import/order: error'",
    "fix:imports": "eslint . --ext .ts,.tsx --fix --rule 'import/order: error'"
  }
}

// VS Code settings.json - 自动格式化导入
{
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "non-relative"
}
```

## 11. 引用

- [TypeScript Handbook - Module Resolution][1]
- [Absolute vs Relative Imports][2]
- [Path Mapping Best Practices][3]
- [ESLint Import Plugin][4]

[1]: https://www.typescriptlang.org/docs/handbook/module-resolution.html
[2]: https://www.typescriptlang.org/docs/handbook/module-resolution.html#relative-vs-non-relative-module-imports
[3]: https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping
[4]: https://github.com/import-js/eslint-plugin-import
