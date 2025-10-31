# [0141. 默认导出 vs. 命名导出](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0141.%20%E9%BB%98%E8%AE%A4%E5%AF%BC%E5%87%BA%20vs.%20%E5%91%BD%E5%90%8D%E5%AF%BC%E5%87%BA)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是默认导出和命名导出？](#3--什么是默认导出和命名导出)
- [4. 🤔 默认导出和命名导出的语法是什么？](#4--默认导出和命名导出的语法是什么)
  - [4.1. 默认导出语法](#41-默认导出语法)
  - [4.2. 命名导出语法](#42-命名导出语法)
- [5. 🤔 默认导出和命名导出有什么区别？](#5--默认导出和命名导出有什么区别)
- [6. 🤔 可以混合使用默认导出和命名导出吗？](#6--可以混合使用默认导出和命名导出吗)
- [7. 🤔 默认导出有什么优缺点？](#7--默认导出有什么优缺点)
- [8. 🤔 命名导出有什么优缺点？](#8--命名导出有什么优缺点)
- [9. 🤔 什么时候使用默认导出？](#9--什么时候使用默认导出)
- [10. 🤔 什么时候使用命名导出？](#10--什么时候使用命名导出)
- [11. 🤔 为什么很多项目推荐使用命名导出？](#11--为什么很多项目推荐使用命名导出)
- [12. 🤔 TypeScript 对默认导出和命名导出有特殊处理吗？](#12--typescript-对默认导出和命名导出有特殊处理吗)
- [13. 🤔 最佳实践是什么？](#13--最佳实践是什么)
- [14. 🔗 引用](#14--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 默认导出（Default Export）
- 命名导出（Named Export）
- 两种导出方式的对比
- 使用场景和最佳实践

## 2. 🫧 评价

- 默认导出和命名导出是 ES6 模块系统中的两种导出方式，TypeScript 完全支持这两种方式。
- 理解它们的区别有助于：
  - 编写更清晰、可维护的代码
  - 选择合适的模块导出方式
  - 避免命名冲突和重构困难
- 虽然两种方式都可以使用，但在 TypeScript 项目中，命名导出通常更受推荐，因为它提供了更好的类型提示和重构支持。

## 3. 🤔 什么是默认导出和命名导出？

ES6 模块系统提供了两种导出方式：

默认导出（Default Export）

每个模块只能有一个默认导出，导入时可以使用任意名称。

```ts
// user.ts
export default class User {
  name: string
}

// app.ts
import MyUser from './user' // 可以使用任意名称
```

命名导出（Named Export）

每个模块可以有多个命名导出，导入时必须使用相同的名称（或使用 `as` 重命名）。

```ts
// user.ts
export class User {
  name: string
}
export const userConfig = {}

// app.ts
import { User, userConfig } from './user' // 必须使用相同名称
import { User as MyUser } from './user' // 或使用 as 重命名
```

## 4. 🤔 默认导出和命名导出的语法是什么？

### 4.1. 默认导出语法

导出方式

```ts
// 方式 1: 直接导出声明
export default class User {
  name: string
}

// 方式 2: 先声明后导出
class User {
  name: string
}
export default User

// 方式 3: 导出表达式
export default {
  name: 'config',
  version: '1.0.0',
}

// 方式 4: 导出函数
export default function createUser() {
  return { name: 'Alice' }
}
```

导入方式

```ts
// 可以使用任意名称
import User from './user'
import MyUser from './user'
import Whatever from './user'

// 也可以与命名导入混合
import User, { userConfig } from './user'
```

### 4.2. 命名导出语法

导出方式

```ts
// 方式 1: 直接导出声明
export class User {
  name: string
}
export const userConfig = {}
export function createUser() {}

// 方式 2: 先声明后导出
class User {
  name: string
}
const userConfig = {}
function createUser() {}

export { User, userConfig, createUser }

// 方式 3: 导出时重命名
export { User as UserClass, userConfig as config }

// 方式 4: 重新导出（聚合导出）
export { User } from './user'
export * from './config'
```

导入方式

```ts
// 必须使用相同名称
import { User, userConfig } from './user'

// 导入时重命名
import { User as MyUser } from './user'

// 导入全部命名导出
import * as userModule from './user'
userModule.User
userModule.userConfig

// 混合导入
import DefaultExport, { User, userConfig } from './user'
```

## 5. 🤔 默认导出和命名导出有什么区别？

| 特性         | 默认导出                   | 命名导出                  |
| ------------ | -------------------------- | ------------------------- |
| 数量限制     | 每个模块只能有 1 个        | 每个模块可以有多个        |
| 导入名称     | 可以使用任意名称           | 必须使用导出时的名称      |
| 导入语法     | `import X from './m'`      | `import { X } from './m'` |
| 重命名       | 不需要 `as`                | 需要 `as` 关键字          |
| 类型提示     | 较弱（IDE 无法推断导入名） | 较强（IDE 可以自动补全）  |
| 重构支持     | 较差（重命名时需手动修改） | 较好（IDE 可以自动重构）  |
| Tree-shaking | 支持，但不够精确           | 支持，更精确              |

示例对比

```ts
// 默认导出
// user.ts
export default class User {}

// app.ts
import User from './user' // ✅
import MyUser from './user' // ✅ 也可以
import Whatever from './user' // ✅ 还可以，但容易混淆

// 命名导出
// user.ts
export class User {}

// app.ts
import { User } from './user' // ✅
import { MyUser } from './user' // ❌ 错误
import { User as MyUser } from './user' // ✅ 需要显式重命名
```

## 6. 🤔 可以混合使用默认导出和命名导出吗？

可以，一个模块可以同时包含默认导出和命名导出。

```ts
// user.ts
export default class User {
  name: string
}

export const userConfig = {
  maxAge: 100,
}

export function createUser(name: string) {
  return new User()
}

// app.ts
// 导入默认导出和命名导出
import User, { userConfig, createUser } from './user'

// 或者分开写
import User from './user'
import { userConfig, createUser } from './user'
```

但这种混合方式可能会让代码变得复杂，通常不推荐。

## 7. 🤔 默认导出有什么优缺点？

优点

导入时语法简洁，不需要大括号。

```ts
import User from './user'
```

适合模块只有一个主要导出的场景。

```ts
// React 组件常用默认导出
export default function Button() {
  return <button>Click</button>
}
```

缺点

导入时可以使用任意名称，容易造成混淆。

```ts
// 同一个模块在不同文件中被导入为不同名称
import User from './user'
import Person from './user' // 同一个东西，不同名称
```

IDE 的自动补全和重构支持较弱。当你输入 `import` 时，IDE 无法推断你要导入的默认导出的名称。

重命名导出时，需要手动修改所有导入处。

```ts
// user.ts 中将 User 重命名为 Person
// 需要手动找到所有导入 User 的地方并修改
```

不利于 Tree-shaking。虽然现代打包工具支持，但命名导出的 Tree-shaking 效果更好。

## 8. 🤔 命名导出有什么优缺点？

优点

强制使用统一的名称，避免混淆。

```ts
import { User } from './user' // 所有地方都使用 User
```

IDE 的自动补全和重构支持更好。当你输入 `import { }` 时，IDE 可以列出所有可用的命名导出。

更好的 Tree-shaking 支持。打包工具可以精确分析哪些导出被使用，哪些未使用。

```ts
// utils.ts
export function add() {}
export function subtract() {}

// app.ts
import { add } from './utils'
// subtract 不会被打包，因为没有被使用
```

便于导出多个成员。

```ts
export { User, userConfig, createUser, deleteUser }
```

缺点

导入时需要使用大括号，语法稍显繁琐。

```ts
import { User } from './user'
```

如果需要重命名，必须显式使用 `as`。

```ts
import { User as MyUser } from './user'
```

## 9. 🤔 什么时候使用默认导出？

模块只有一个主要功能或导出。

```ts
// Button.tsx (React 组件)
export default function Button() {
  return <button>Click</button>
}
```

导出的是类或函数，且名称已经很明确。

```ts
// User.ts
export default class User {
  name: string
}
```

遵循某些框架或库的约定。例如，Next.js 的页面组件使用默认导出。

```ts
// pages/index.tsx
export default function Home() {
  return <div>Home</div>
}
```

## 10. 🤔 什么时候使用命名导出？

模块有多个导出。

```ts
// utils.ts
export function add() {}
export function subtract() {}
export function multiply() {}
```

需要更好的 IDE 支持和重构能力。

```ts
// types.ts
export interface User {}
export interface Product {}
export type Status = 'pending' | 'success'
```

希望保持代码库中命名的一致性。

```ts
// user.ts
export class User {}

// app.ts
import { User } from './user' // 所有地方都使用 User
```

需要精确的 Tree-shaking。

```ts
// 大型工具库
export { function1, function2, function3, ... }
```

## 11. 🤔 为什么很多项目推荐使用命名导出？

现代 TypeScript 项目（特别是大型项目）更倾向于使用命名导出，主要原因包括：

更好的类型安全

命名导出确保导入和导出使用相同的名称，减少错误。

```ts
// 默认导出可能导致命名不一致
import User from './user'
import Person from './user' // 同一个类，不同名称

// 命名导出确保一致性
import { User } from './user'
import { User as Person } from './user' // 需要显式重命名
```

更好的开发体验

IDE 可以提供更好的自动补全、跳转和重构支持。

```ts
// 输入 import { } 时，IDE 自动列出所有可用导出
import { User, userConfig } from './user'
```

更好的可维护性

重命名时，IDE 可以自动重构所有引用。

```ts
// 将 User 重命名为 Person
// IDE 会自动更新所有 import { User } 为 import { Person }
```

更好的 Tree-shaking

打包工具可以更精确地移除未使用的代码。

```ts
// 只导入需要的函数
import { add } from './math'
// subtract, multiply 等未使用的函数不会被打包
```

## 12. 🤔 TypeScript 对默认导出和命名导出有特殊处理吗？

TypeScript 对两种导出方式提供了相同的类型支持，但在某些场景下，命名导出的类型推断更准确。

类型导入导出

两种方式都支持 `import type` 和 `export type`。

```ts
// 默认导出类型
// types.ts
export default interface User {
  name: string
}

// app.ts
import type User from './types'

// 命名导出类型
// types.ts
export interface User {
  name: string
}

// app.ts
import type { User } from './types'
```

命名空间导出

命名导出可以配合命名空间使用，默认导出不支持。

```ts
// types.ts
export namespace User {
  export interface Config {
    maxAge: number
  }
}

// app.ts
import { User } from './types'
const config: User.Config = { maxAge: 100 }
```

声明合并

命名导出支持声明合并，默认导出不支持。

```ts
// user.ts
export interface User {
  name: string
}

export interface User {
  age: number
}

// 两个声明会合并为一个
// interface User { name: string; age: number }
```

## 13. 🤔 最佳实践是什么？

优先使用命名导出

除非有特殊理由，否则优先使用命名导出。

```ts
// ✅ 推荐
export class User {}
export const userConfig = {}

// ❌ 不推荐
export default class User {}
```

保持一致性

在同一个项目中，保持导出方式的一致性。如果团队约定使用命名导出，就全部使用命名导出。

框架约定优先

如果使用的框架有特定约定（如 Next.js 的页面组件使用默认导出），遵循框架约定。

```ts
// Next.js 页面组件
// pages/index.tsx
export default function Home() {
  return <div>Home</div>
}
```

避免混合导出

除非必要，避免在同一个模块中混合使用默认导出和命名导出。

```ts
// ❌ 不推荐
export default class User {}
export const userConfig = {}

// ✅ 推荐：全部使用命名导出
export class User {}
export const userConfig = {}
```

类型导出使用命名导出

类型定义总是使用命名导出，便于管理和导入。

```ts
// types.ts
export interface User {
  name: string
}
export type Status = 'pending' | 'success'

// app.ts
import type { User, Status } from './types'
```

使用 ESLint 规则

可以通过 ESLint 规则强制使用命名导出。

```json
// .eslintrc.json
{
  "rules": {
    "import/no-default-export": "error",
    "import/prefer-default-export": "off"
  }
}
```

## 14. 🔗 引用

- [MDN - export][1]
- [MDN - import][2]
- [TypeScript 官方文档 - Modules][3]
- [Basarat's TypeScript Book - Avoid Export Default][4]

[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
[3]: https://www.typescriptlang.org/docs/handbook/modules.html
[4]: https://basarat.gitbook.io/typescript/main-1/defaultisbad
