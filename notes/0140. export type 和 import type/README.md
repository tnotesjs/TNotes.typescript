# [0140. export type 和 import type](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0140.%20export%20type%20%E5%92%8C%20import%20type)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 为什么需要 export type 和 import type?](#3-为什么需要-export-type-和-import-type)
- [4. export type 和 import type 是什么?](#4-export-type-和-import-type-是什么)
- [5. export type 的使用场景是什么?](#5-export-type-的使用场景是什么)
- [6. import type 的使用场景是什么?](#6-import-type-的使用场景是什么)
- [7. 普通导入导出和类型导入导出有什么区别?](#7-普通导入导出和类型导入导出有什么区别)
- [8. 什么时候必须使用 import type?](#8-什么时候必须使用-import-type)
- [9. 可以混合使用普通导入和类型导入吗?](#9-可以混合使用普通导入和类型导入吗)
- [10. TypeScript 如何判断是类型还是值?](#10-typescript-如何判断是类型还是值)
- [11. tsconfig 中的 isolatedModules 配置与此有什么关系?](#11-tsconfig-中的-isolatedmodules-配置与此有什么关系)
- [12. 最佳实践是什么?](#12-最佳实践是什么)
- [13. 引用](#13-引用)

<!-- endregion:toc -->

## 1. 本节内容

- export type 语法
- import type 语法
- 类型导入导出的应用场景
- isolatedModules 配置

## 2. 评价

- `export type` 和 `import type` 是 TypeScript 3.8 引入的特性,用于明确地导入导出类型。
- 理解这两个语法有助于:
  - 优化编译性能(减少不必要的代码打包)
  - 避免循环依赖问题
  - 让代码意图更清晰
- 在使用 Babel、esbuild 等编译工具时,显式的类型导入导出尤为重要,因为这些工具无法像 TypeScript 编译器那样准确分析类型和值。

## 3. 为什么需要 export type 和 import type?

- TypeScript 中存在两个命名空间:
  - 类型命名空间 - 存放类型、接口、类型别名等
  - 值命名空间 - 存放变量、函数、类等
- 编译为 JavaScript 时:
  - 类型信息会被完全删除(因为 JS 运行时不需要类型)
  - 值会被保留
- 问题场景:

```ts
// user.ts
export interface User {
  name: string
  age: number
}

// app.ts
import { User } from './user'
// 这里 User 只用作类型,编译后这行 import 应该被删除
// 但 TypeScript 编译器需要分析整个模块才能确定 User 没有被当作值使用
```

- 使用 `import type` 可以明确告诉编译器 "这个导入仅用于类型检查",编译时可以安全删除,无需深度分析。

## 4. export type 和 import type 是什么?

- `export type` - 导出类型专用语法
- `import type` - 导入类型专用语法
- 这两个语法明确标识导入导出的内容仅用于类型检查,编译后会被完全移除。

```ts
// types.ts
export type UserType = {
  id: number
  name: string
}

export interface Product {
  id: number
  price: number
}

// app.ts
import type { UserType, Product } from './types'

// 只能用于类型注解
const user: UserType = { id: 1, name: 'Alice' }

// ❌ 错误:不能作为值使用
console.log(UserType) // 'UserType' cannot be used as a value because it was imported using 'import type'.
```

## 5. export type 的使用场景是什么?

- 导出类型定义

```ts
// types.ts
// 明确标识这是类型导出
export type Status = 'pending' | 'success' | 'error'

export type Config = {
  apiUrl: string
  timeout: number
}
```

- 重新导出类型(类型聚合)

```ts
// index.ts
// 从其他模块重新导出类型
export type { User } from './user'
export type { Product } from './product'
```

- 避免值和类型混淆

```ts
// 不使用 type 关键字时,可能引起混淆
export { User } // User 是类型还是类(值)?

// 使用 type 关键字,意图明确
export type { User } // 明确是类型导出
export { User } // 明确是值导出(比如类的构造函数)
```

## 6. import type 的使用场景是什么?

- 导入接口或类型别名

```ts
import type { User, Product } from './types'

function getUser(): User {
  return { name: 'Alice', age: 30 }
}
```

- 导入类(仅作为类型使用)

```ts
// user.ts
export class User {
  name: string
  age: number
}

// app.ts
import type { User } from './user'

// ✅ 可以作为类型注解
const user: User = { name: 'Bob', age: 25 }

// ❌ 不能作为构造函数
const user2 = new User() // 错误!
```

- 避免循环依赖

```ts
// a.ts
import type { B } from './b'
export class A {
  b?: B
}

// b.ts
import type { A } from './a'
export class B {
  a?: A
}

// 如果不使用 import type,可能会出现循环依赖问题
```

## 7. 普通导入导出和类型导入导出有什么区别?

| 特性   | 普通导入/导出        | 类型导入/导出 |
| ------ | -------------------- | ------------- |
| 编译后 | 值会保留             | 完全移除      |
| 用途   | 可作为类型和值       | 仅作为类型    |
| 性能   | 可能包含不必要的代码 | 减少打包体积  |
| 意图   | 不够明确             | 非常明确      |

```ts
// 普通导入
import { User } from './user'
// User 可能是类型,也可能是类(值),需要分析使用场景

// 类型导入
import type { User } from './user'
// User 明确仅用于类型注解,编译后删除
```

## 8. 什么时候必须使用 import type?

- 启用 `isolatedModules` 配置时(后面会详细说明)
- 使用 Babel 或 esbuild 等非 TypeScript 官方编译器时
- 这些工具逐文件编译,无法跨文件分析类型和值,必须显式区分。

```ts
// tsconfig.json
{
  "compilerOptions": {
    "isolatedModules": true // 模拟单文件编译环境
  }
}
```

## 9. 可以混合使用普通导入和类型导入吗?

- 可以,TypeScript 支持在同一行混合导入值和类型。

```ts
// 分开写
import { createUser } from './user' // 值
import type { User } from './user' // 类型

// 混合写法(TypeScript 4.5+)
import { createUser, type User } from './user'
```

- 推荐的写法:

```ts
// 如果主要导入类型,少量导入值
import type { User, Product } from './types'
import { createUser } from './user'

// 如果主要导入值,少量导入类型
import { api, config, type Config } from './api'
```

## 10. TypeScript 如何判断是类型还是值?

- TypeScript 编译器会分析标识符的使用方式:

```ts
import { User } from './user'

// 作为类型使用
const user: User = { name: 'Alice' }
function getUser(): User { ... }

// 作为值使用
const UserClass = User // 赋值给变量
new User() // 作为构造函数
User.prototype // 访问属性
```

- 如果在所有使用场景中,`User` 仅出现在类型位置(类型注解、类型参数等),编译器会在输出的 JavaScript 中移除该导入。
- 但这需要分析整个模块,使用 `import type` 可以跳过这个分析过程。

## 11. tsconfig 中的 isolatedModules 配置与此有什么关系?

- `isolatedModules: true` 强制开发者遵循"单文件编译"的约束
- 这是为了兼容 Babel、esbuild、swc 等快速编译工具,这些工具逐文件编译,不进行跨文件类型分析。

```json
// tsconfig.json
{
  "compilerOptions": {
    "isolatedModules": true
  }
}
```

- 启用后的限制:

```ts
// ❌ 错误:无法判断 User 是类型还是值
import { User } from './user'

// ✅ 正确:明确标识
import type { User } from './user'

// ❌ 错误:不能重新导出类型(除非使用 export type)
export { User } from './user'

// ✅ 正确
export type { User } from './user'
```

- 使用场景:
  - 使用 Babel 编译 TypeScript(如 Create React App、Next.js)
  - 使用 esbuild 或 swc 加速构建
  - 使用 Vite 等现代构建工具

## 12. 最佳实践是什么?

- 对纯类型(interface、type 别名)使用 `import type`

```ts
import type { User, Config } from './types'
```

- 对类(Class)的使用区分场景

```ts
// 仅作为类型注解,使用 import type
import type { User } from './user'
const user: User = { ... }

// 需要实例化或访问静态成员,使用普通 import
import { User } from './user'
const user = new User()
```

- 导出时明确标识类型

```ts
// 明确导出类型
export type { User, Product }

// 导出值
export { createUser, api }
```

- 开启 `isolatedModules` 确保代码兼容多种编译器

```json
{
  "compilerOptions": {
    "isolatedModules": true
  }
}
```

- 使用 ESLint 规则自动检查

```json
// .eslintrc.json
{
  "rules": {
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        "prefer": "type-imports"
      }
    ]
  }
}
```

## 13. 引用

- [TypeScript 官方文档 - Type-Only Imports and Exports][1]
- [TypeScript 3.8 发布说明][2]
- [isolatedModules 配置说明][3]

[1]: https://www.typescriptlang.org/docs/handbook/modules.html#type-only-imports-and-exports
[2]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export
[3]: https://www.typescriptlang.org/tsconfig#isolatedModules
