# [0144. esModuleInterop 配置项](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0144.%20esModuleInterop%20%E9%85%8D%E7%BD%AE%E9%A1%B9)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是 esModuleInterop？](#3--什么是-esmoduleinterop)
- [4. 🤔 为什么需要 esModuleInterop？](#4--为什么需要-esmoduleinterop)
- [5. 🤔 ES 模块和 CommonJS 模块有什么区别？](#5--es-模块和-commonjs-模块有什么区别)
- [6. 🤔 esModuleInterop 解决了什么问题？](#6--esmoduleinterop-解决了什么问题)
- [7. 🤔 esModuleInterop 的工作原理是什么？](#7--esmoduleinterop-的工作原理是什么)
- [8. 🤔 如何配置 esModuleInterop？](#8--如何配置-esmoduleinterop)
- [9. 🤔 esModuleInterop 和 allowSyntheticDefaultImports 有什么关系？](#9--esmoduleinterop-和-allowsyntheticdefaultimports-有什么关系)
- [10. 🤔 启用 esModuleInterop 会有什么影响？](#10--启用-esmoduleinterop-会有什么影响)
- [11. 🤔 什么时候应该启用 esModuleInterop？](#11--什么时候应该启用-esmoduleinterop)
- [12. 🤔 常见的兼容性问题有哪些？](#12--常见的兼容性问题有哪些)
- [13. 🤔 最佳实践是什么？](#13--最佳实践是什么)
- [14. 🔗 引用](#14--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- esModuleInterop 配置项
- ES 模块和 CommonJS 模块的互操作性
- 默认导入和命名空间导入
- allowSyntheticDefaultImports 配置
- 模块兼容性问题

## 2. 🫧 评价

- `esModuleInterop` 是 TypeScript 中一个重要但容易被忽视的配置项，它解决了 ES 模块和 CommonJS 模块之间的互操作性问题。
- 理解这个配置项有助于：
  - 解决导入 CommonJS 模块时的类型错误
  - 理解不同模块系统之间的差异
  - 编写更兼容的 TypeScript 代码
  - 避免运行时错误
- 在现代 TypeScript 项目中，强烈推荐启用 `esModuleInterop: true`，它能让代码更符合直觉，减少模块导入的困扰。

## 3. 🤔 什么是 esModuleInterop？

`esModuleInterop` 是 TypeScript 编译器选项，用于改善 ES 模块和 CommonJS 模块之间的互操作性。

启用此选项后，TypeScript 会：

- 允许使用默认导入语法导入 CommonJS 模块
- 自动生成兼容性辅助代码
- 使模块导入行为更符合 ES 模块规范

```json
// tsconfig.json
{
  "compilerOptions": {
    "esModuleInterop": true
  }
}
```

## 4. 🤔 为什么需要 esModuleInterop？

ES 模块和 CommonJS 模块在导入导出机制上有本质区别，直接混用会导致问题。

问题场景示例：

::: code-group

```js [CommonJS 模块]
// lodash (CommonJS)
module.exports = {
  map: function () {},
  filter: function () {},
  // ...
}
```

```ts [不启用 esModuleInterop]
// ❌ 错误：没有默认导出
import _ from 'lodash'
// 类型错误: Module '"/node_modules/@types/lodash/index"' has no default export.

// ✅ 需要使用命名空间导入
import * as _ from 'lodash'
```

```ts [启用 esModuleInterop]
// ✅ 可以使用默认导入
import _ from 'lodash'
// 正常工作
```

:::

## 5. 🤔 ES 模块和 CommonJS 模块有什么区别？

ES 模块（ESM）

ES6 引入的官方模块系统，使用 `import` 和 `export` 语法。

```ts
// 默认导出
export default class User {}

// 命名导出
export const name = 'Alice'
export function greet() {}

// 导入
import User from './user'
import { name, greet } from './user'
```

CommonJS 模块（CJS）

Node.js 使用的模块系统，使用 `require` 和 `module.exports` 语法。

```js
// 导出
module.exports = class User {}

// 或导出多个成员
module.exports = {
  name: 'Alice',
  greet: function () {},
}

// 导入
const User = require('./user')
const { name, greet } = require('./user')
```

关键区别：

| 特性         | ES 模块            | CommonJS                 |
| ------------ | ------------------ | ------------------------ |
| 语法         | `import/export`    | `require/module.exports` |
| 默认导出     | 有明确的 `default` | 没有默认导出概念         |
| 静态分析     | 支持（编译时确定） | 不支持（运行时确定）     |
| Tree-shaking | 支持               | 不支持                   |
| 异步加载     | 支持               | 同步加载                 |
| 环境         | 浏览器和 Node.js   | 主要是 Node.js           |

## 6. 🤔 esModuleInterop 解决了什么问题？

问题 1：无法使用默认导入 CommonJS 模块

CommonJS 模块没有默认导出的概念，但我们习惯使用默认导入语法。

::: code-group

```ts [不启用 esModuleInterop]
// ❌ 类型错误
import express from 'express'
// Module '"/node_modules/@types/express/index"' has no default export.

// 必须使用命名空间导入
import * as express from 'express'
const app = express() // ✅ 正常
```

```ts [启用 esModuleInterop]
// ✅ 可以使用默认导入
import express from 'express'
const app = express() // ✅ 正常
```

:::

问题 2：命名空间导入不符合规范

在 ES 模块规范中，命名空间导入应该是一个对象，但 CommonJS 模块可能导出函数。

```ts
// moment 是一个函数
import * as moment from 'moment'

// 不启用 esModuleInterop
moment() // ✅ 可以调用（但不符合 ES 规范）

// 启用 esModuleInterop
moment() // ❌ 错误（符合 ES 规范）
moment.default() // ✅ 正确方式
```

问题 3：类型检查和运行时行为不一致

不启用 `esModuleInterop` 时，TypeScript 的类型检查可能通过，但运行时报错。

::: code-group

```ts [TypeScript 代码]
import * as fs from 'fs'
fs.readFileSync('./file.txt') // 类型检查通过
```

```js [编译后的 JavaScript]
const fs = require('fs')
fs.readFileSync('./file.txt') // 运行时正常
```

:::

## 7. 🤔 esModuleInterop 的工作原理是什么？

启用 `esModuleInterop` 后，TypeScript 会插入辅助函数来处理模块互操作。

生成的辅助代码：

::: code-group

```ts [源代码]
import express from 'express'
const app = express()
```

```js [编译后（不启用 esModuleInterop）]
const express = require('express')
const app = express.default() // ❌ express.default 不存在
```

```js [编译后（启用 esModuleInterop）]
const express = __importDefault(require('express'))
const app = express.default()

// 辅助函数
function __importDefault(mod) {
  return mod && mod.__esModule ? mod : { default: mod }
}
```

:::

处理命名空间导入：

::: code-group

```ts [源代码]
import * as fs from 'fs'
fs.readFileSync('./file.txt')
```

```js [编译后（启用 esModuleInterop）]
const fs = __importStar(require('fs'))
fs.readFileSync('./file.txt')

// 辅助函数
function __importStar(mod) {
  if (mod && mod.__esModule) return mod
  var result = {}
  if (mod != null) {
    for (var k in mod) {
      if (Object.hasOwnProperty.call(mod, k)) {
        result[k] = mod[k]
      }
    }
  }
  result.default = mod
  return result
}
```

:::

## 8. 🤔 如何配置 esModuleInterop？

在 tsconfig.json 中启用：

```json
// tsconfig.json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true // 通常一起启用
  }
}
```

使用命令行：

```bash
tsc --esModuleInterop file.ts
```

实际使用示例：

::: code-group

```ts [启用前]
// 导入 CommonJS 模块
import * as express from 'express'
import * as React from 'react'
import * as _ from 'lodash'

const app = express()
const element = React.createElement('div')
const result = _.map([1, 2, 3], (n) => n * 2)
```

```ts [启用后]
// 可以使用默认导入
import express from 'express'
import React from 'react'
import _ from 'lodash'

const app = express()
const element = React.createElement('div')
const result = _.map([1, 2, 3], (n) => n * 2)
```

:::

## 9. 🤔 esModuleInterop 和 allowSyntheticDefaultImports 有什么关系？

这两个配置项经常一起使用，但作用不同：

`allowSyntheticDefaultImports`

只影响类型检查，不影响生成的代码。允许从没有默认导出的模块中进行默认导入。

```json
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true
  }
}
```

`esModuleInterop`

既影响类型检查，又影响生成的代码。自动生成兼容性辅助代码。

```json
{
  "compilerOptions": {
    "esModuleInterop": true
  }
}
```

关系说明：

- 启用 `esModuleInterop` 会自动启用 `allowSyntheticDefaultImports`
- 可以单独启用 `allowSyntheticDefaultImports`（如果使用 Babel 等工具编译）
- 推荐同时启用两者

::: code-group

```json [推荐配置]
{
  "compilerOptions": {
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

```json [仅类型检查（使用 Babel）]
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": false
  }
}
```

:::

## 10. 🤔 启用 esModuleInterop 会有什么影响？

代码体积增加

生成的辅助函数会增加一些代码体积。

```js
// 每个文件都可能包含这些辅助函数
function __importDefault(mod) {
  /* ... */
}
function __importStar(mod) {
  /* ... */
}
```

可以使用 `importHelpers` 配置项从 `tslib` 导入辅助函数，减少重复代码：

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "importHelpers": true
  }
}
```

导入语法变化

需要修改原有的命名空间导入。

::: code-group

```ts [修改前]
import * as React from 'react'
import * as express from 'express'
```

```ts [修改后]
import React from 'react'
import express from 'express'
```

:::

更严格的类型检查

符合 ES 模块规范的行为，可能会发现之前隐藏的类型错误。

```ts
import * as moment from 'moment'

// 不启用 esModuleInterop
moment() // ✅ 类型检查通过

// 启用 esModuleInterop
moment() // ❌ 错误：'moment' refers to a UMD global
moment.default() // ✅ 正确
```

## 11. 🤔 什么时候应该启用 esModuleInterop？

推荐启用的场景

新项目

所有新的 TypeScript 项目都应该启用。

```json
{
  "compilerOptions": {
    "esModuleInterop": true
  }
}
```

使用 CommonJS 库

如果项目中使用了很多 CommonJS 模块（如 express、lodash 等）。

```ts
// 启用后更自然
import express from 'express'
import _ from 'lodash'
```

遵循现代标准

想让代码更符合 ES 模块规范和社区最佳实践。

使用 React

React 官方推荐的导入方式需要启用 `esModuleInterop`。

```tsx
// 官方推荐
import React from 'react'

// 不推荐
import * as React from 'react'
```

不启用的场景

维护旧项目

如果项目已经使用命名空间导入，改动成本较高。

```ts
// 旧项目可能大量使用
import * as _ from 'lodash'
import * as express from 'express'
```

特殊构建配置

如果使用自定义的模块转换工具，可能不需要 TypeScript 生成辅助代码。

## 12. 🤔 常见的兼容性问题有哪些？

问题 1：混用默认导入和命名空间导入

::: code-group

```ts [错误示例]
import moment from 'moment'
import * as momentNS from 'moment'

// 两种导入方式指向不同的东西
console.log(moment === momentNS) // false
```

```ts [正确做法]
import moment from 'moment'

// 统一使用默认导入
const m = moment()
```

:::

问题 2：类型定义和实际导出不匹配

某些库的类型定义可能与实际导出不一致。

```ts
import axios from 'axios'

// 如果 @types/axios 的定义不正确
axios.get('/api') // 可能类型错误

// 解决方案：使用类型断言或更新类型定义
import axios from 'axios'
import type { AxiosInstance } from 'axios'

const client = axios as AxiosInstance
```

问题 3：动态导入的兼容性

```ts
// 动态导入 CommonJS 模块
const moment = await import('moment')

// 启用 esModuleInterop 后
moment.default() // ✅ 正确

// 不启用时
moment() // ✅ 正确
```

问题 4：重导出模块

```ts
// utils.ts
export { default as moment } from 'moment'
export * from 'lodash'

// 启用 esModuleInterop 后，需要注意导出的结构
```

## 13. 🤔 最佳实践是什么？

始终启用 esModuleInterop

在 tsconfig.json 中启用此选项。

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

使用默认导入语法

启用后，优先使用默认导入而不是命名空间导入。

::: code-group

```ts [推荐]
import express from 'express'
import React from 'react'
import _ from 'lodash'
```

```ts [不推荐]
import * as express from 'express'
import * as React from 'react'
import * as _ from 'lodash'
```

:::

配合 importHelpers 使用

减少生成的辅助代码体积。

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "importHelpers": true
  }
}
```

```bash
# 安装 tslib
npm install tslib
```

统一团队编码风格

在团队中统一是否启用 `esModuleInterop`，避免代码风格不一致。

```json
// .eslintrc.json
{
  "rules": {
    "@typescript-eslint/no-require-imports": "error"
  }
}
```

注意第三方库的兼容性

某些库可能对模块系统有特殊要求，查看文档了解推荐的导入方式。

```ts
// 某些库可能推荐特定的导入方式
import * as d3 from 'd3' // D3.js 推荐命名空间导入
import React from 'react' // React 推荐默认导入
```

迁移旧项目时逐步调整

如果要在旧项目中启用，可以逐步迁移。

```ts
// 第一步：启用配置
// tsconfig.json: "esModuleInterop": true

// 第二步：逐个文件修改导入语句
// 从 import * as X from 'X'
// 改为 import X from 'X'

// 第三步：运行测试确保功能正常
```

使用 ESLint 规则辅助

```json
// .eslintrc.json
{
  "rules": {
    // 强制使用默认导入（启用 esModuleInterop 后）
    "import/no-namespace": "warn"
  }
}
```

## 14. 🔗 引用

- [TypeScript 官方文档 - esModuleInterop][1]
- [TypeScript 官方文档 - Module Resolution][2]
- [TypeScript 官方文档 - Compiler Options][3]

[1]: https://www.typescriptlang.org/tsconfig#esModuleInterop
[2]: https://www.typescriptlang.org/docs/handbook/module-resolution.html
[3]: https://www.typescriptlang.org/tsconfig
