# [0030. 类型作用域](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0030.%20%E7%B1%BB%E5%9E%8B%E4%BD%9C%E7%94%A8%E5%9F%9F)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是 TypeScript 中的类型作用域？](#3--什么是-typescript-中的类型作用域)
- [4. 🤔 TypeScript 中类型作用域遵循什么规则？](#4--typescript-中类型作用域遵循什么规则)
  - [4.1. 块级作用域（Block Scope）](#41-块级作用域block-scope)
  - [4.2. 函数作用域](#42-函数作用域)
- [5. 🤔 TypeScript 中模块作用域是如何工作的？](#5--typescript-中模块作用域是如何工作的)
  - [5.1. 模块内私有类型（默认行为）](#51-模块内私有类型默认行为)
  - [5.2. 显式导出类型](#52-显式导出类型)
- [6. 🤔 TypeScript 中全局作用域有什么特点？](#6--typescript-中全局作用域有什么特点)
  - [6.1. 全局污染风险](#61-全局污染风险)
  - [6.2. 安全扩展全局类型（如 DOM）](#62-安全扩展全局类型如-dom)
- [7. 🤔 TypeScript 中命名空间的作用域是什么样的？](#7--typescript-中命名空间的作用域是什么样的)
- [8. 🤔 TypeScript 中声明合并与作用域有什么关系？](#8--typescript-中声明合并与作用域有什么关系)
  - [8.1. 模块内合并](#81-模块内合并)
  - [8.2. 跨文件合并（仅限全局作用域或显式 declare）](#82-跨文件合并仅限全局作用域或显式-declare)
- [9. 🤔 TypeScript 中类型作用域和值作用域有什么区别？](#9--typescript-中类型作用域和值作用域有什么区别)
- [10. 🤔 TypeScript 中类型作用域的最佳实践是什么？](#10--typescript-中类型作用域的最佳实践是什么)
- [11. 🤔 为什么导出了函数，但它的返回类型在外部不能用？](#11--为什么导出了函数但它的返回类型在外部不能用)
- [12. 🤔 如何让类型只在测试文件中可见？](#12--如何让类型只在测试文件中可见)
- [13. 🤔 `type` 和 `interface` 的作用域规则一样吗？](#13--type-和-interface-的作用域规则一样吗)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 类型作用域

## 2. 🫧 评价

- 在 TS 官方文档中并没有专门的篇幅来介绍 Type Scope，本节介绍的类型作用域，主要是指“类型的作用范围”。

## 3. 🤔 什么是 TypeScript 中的类型作用域？

在 TypeScript 中，并没有一个官方术语叫"类型作用域"（Type Scope），但这个说法通常被开发者用来描述类型声明的可见性范围，即：在哪些地方可以访问某个类型（如 `interface`、`type`、`class`、`enum` 等）。

虽然 TypeScript 本身没有独立的"类型作用域"机制（类型最终会被编译器擦除，不参与运行时），但类型的作用域规则完全遵循 JavaScript/TypeScript 的词法作用域（Lexical Scope）和模块系统。

## 4. 🤔 TypeScript 中类型作用域遵循什么规则？

TypeScript 中的类型（`type`、`interface`、`class`、`enum` 等）遵循与变量相同的块级作用域或函数作用域规则。

### 4.1. 块级作用域（Block Scope）

```ts
{
  type User = { name: string }
  const u: User = { name: 'Alice' } // ✅ 可访问
}

// ❌ 错误：User 仅在块内可见
const v: User = { name: 'Bob' }
```

类似 `let/const`，`type` 和 `interface` 在块内声明时，只在该块内有效。

### 4.2. 函数作用域

```ts
function createProcessor() {
  interface Config {
    timeout: number
  }

  return function (config: Config) {
    // ✅ Config 在函数内部可见
  }
}

// ❌ 外部无法访问 Config
const p = createProcessor()
p({ timeout: 1000 }) // ✅ 调用没问题，但不能显式标注类型
// p(config: Config) ❌ Config 未定义
```

## 5. 🤔 TypeScript 中模块作用域是如何工作的？

TypeScript 默认采用 ES 模块系统（每个文件是一个模块，只要包含 `import`/`export`）。

### 5.1. 模块内私有类型（默认行为）

```ts
// user.ts
interface User {
  id: string
  name: string
}

export function createUser(name: string): User {
  return { id: generateId(), name }
}
```

在这个文件中：

- User 是模块私有 的，外部无法直接引用。
- 但返回值类型 User 会被隐式导出，调用者可安全使用，但不能显式声明 User 类型变量。

```ts
// main.ts
import { createUser } from './user'

const user = createUser('Alice') // user 类型被推断为 { id: string; name: string }
// const u: User = ...; // ❌ 找不到 User（未显式导出）
```

### 5.2. 显式导出类型

```ts
// user.ts
export interface User {
  // ✅ 显式导出
  id: string
  name: string
}

export type UserId = string

// main.ts
import { User, UserId } from './user'

const u: User = { id: '1', name: 'Alice' } // ✅
```

## 6. 🤔 TypeScript 中全局作用域有什么特点？

如果没有 `import`/`export`，TypeScript 文件被视为全局脚本（不推荐）。

### 6.1. 全局污染风险

```ts
// bad.ts（无 import/export）
interface Config {
  debug: boolean
}
```

```ts
// another.ts（无 import/export）
interface Config {
  apiUrl: string
}
```

这两个 `Config` 会自动合并（Declaration Merging），变成：

```ts
interface Config {
  debug: boolean
  apiUrl: string
}
```

这容易导致意外冲突，现代项目应始终使用模块（即每个文件至少有一个 export）。

### 6.2. 安全扩展全局类型（如 DOM）

TypeScript 允许通过 `declare global` 扩展全局作用域：

```ts
// global.d.ts
export {} // 确保这是模块

declare global {
  interface Window {
    myApp: {
      version: string
    }
  }
}
```

现在可以在任何地方使用：

```ts
window.myApp.version // ✅ 类型安全
```

## 7. 🤔 TypeScript 中命名空间的作用域是什么样的？

早期 TypeScript 使用 `namespace` 组织代码（类似模块），但现在推荐使用 ES 模块。

```ts
namespace API {
  export interface User {
    id: string;
  }

  export function fetchUser(): User { ... }
}

// 使用
const u: API.User = ...;
```

❌ 不推荐原因：

- 与现代模块系统（ESM/CommonJS）不兼容
- 打包工具（如 Webpack）支持差
- 官方文档建议"仅用于描述现有 JS 库的类型"

## 8. 🤔 TypeScript 中声明合并与作用域有什么关系？

TypeScript 的强大特性：同名的 `interface` 或 `namespace` 会自动合并，但必须在同一作用域。

### 8.1. 模块内合并

```ts
// 在同一文件
interface User {
  name: string
}

interface User {
  email: string
}

// 合并为 { name: string; email: string }
```

### 8.2. 跨文件合并（仅限全局作用域或显式 declare）

```ts
// global.d.ts
interface User {
  id: string
}

// utils.ts（必须是全局脚本，或通过 declare global）
interface User {
  createdAt: Date
}
```

在模块中，跨文件的 `interface` 不会自动合并，必须显式导出并导入。

## 9. 🤔 TypeScript 中类型作用域和值作用域有什么区别？

TypeScript 中，类型和值是两个独立的命名空间：

```ts
class User {} // 声明了一个类型 User 和一个值 User（构造函数）
type User = string // ❌ 错误！不能与 class 同名（值和类型冲突）

interface User {} // ✅ 可以与 class 合并
```

但 `type` 别名不能与值同名：

```ts
const User = 'admin'
type User = string // ❌ Duplicate identifier 'User'
```

规则：

- `interface` 可以与 `class`、`namespace` 合并
- `type` 别名不能与任何值或类型同名

## 10. 🤔 TypeScript 中类型作用域的最佳实践是什么？

| 场景         | 建议                                       |
| ------------ | ------------------------------------------ |
| 项目结构     | 始终使用 ES 模块（每个文件有 `export`）    |
| 类型可见性   | 私有类型不导出，公共类型显式 `export`      |
| 避免全局污染 | 不要写无 `import`/`export` 的文件          |
| 扩展全局类型 | 使用 `declare global`（在 `.d.ts` 文件中） |
| 组织大型类型 | 用文件夹 + 模块导出，而非 `namespace`      |
| 类型命名     | 避免与变量/函数同名（尤其用 `type` 时）    |

## 11. 🤔 为什么导出了函数，但它的返回类型在外部不能用？

```ts
// api.ts
interface Response {
  data: any
}
export function fetch() {
  return { data: {} } as Response
}
```

→ 因为 `Response` 没有 `export`。外部只能推断返回类型结构，但不能引用 `Response` 名称。

解决方案：`export interface Response`

## 12. 🤔 如何让类型只在测试文件中可见？

```ts
// user.test.ts
import { createUser } from './user'

// 测试专用类型，无需导出
type TestUser = ReturnType<typeof createUser>

describe('createUser', () => {
  it('...', () => {
    const u: TestUser = createUser('test')
  })
})
```

## 13. 🤔 `type` 和 `interface` 的作用域规则一样吗？

完全一样！作用域只与声明位置有关，与类型声明方式无关。
