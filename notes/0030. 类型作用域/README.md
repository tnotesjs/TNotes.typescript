# [0030. 类型作用域](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0030.%20%E7%B1%BB%E5%9E%8B%E4%BD%9C%E7%94%A8%E5%9F%9F)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 什么是 TypeScript 中的类型作用域？](#3-什么是-typescript-中的类型作用域)
- [4. TypeScript 中类型作用域遵循什么规则？](#4-typescript-中类型作用域遵循什么规则)
- [5. TypeScript 中模块作用域是如何工作的？](#5-typescript-中模块作用域是如何工作的)
- [6. TypeScript 中全局作用域有什么特点？](#6-typescript-中全局作用域有什么特点)
- [7. 如何安全地扩展全局作用域？](#7-如何安全地扩展全局作用域)
- [8. demos.1 - TypeScript 是如何识别文件是一个模块还是全局脚本的呢？](#8-demos1---typescript-是如何识别文件是一个模块还是全局脚本的呢)
- [9. TypeScript 中 `namespace` 命名空间的作用域是什么样的？](#9-typescript-中-namespace-命名空间的作用域是什么样的)
- [10. TypeScript 中如何处理同一个作用域下的同名的 `interface`、`class`、`type` 呢？](#10-typescript-中如何处理同一个作用域下的同名的-interfaceclasstype-呢)
- [11. 引用](#11-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 类型作用域
- module
- script
- moduleDetection
- namespace
- class
- type
- declare global

## 2. 评价

- 涉及到的关键术语蛮多的，它们大多都跟 TS 的类型作用范围相关，其中很多内容会在后续学习中接触到。
- TS 中类型作用域遵循的规则和 JS 中的 let、const 变量很相似，都具备块级作用域的特性。
- 但是在 TS 中，同一个作用域下的同名成员，有时候会合并（比如 `interface` 跟同名的 `interface`、`class`），有时候会直接报错（比如同名的 `type` 跟 `interface`、`class`）。
- module 和 script 的区别是一个不易发现的细节，需要知道 TS 的模块检测策略是可以通过 `moduleDetection` 进行配置的。

## 3. 什么是 TypeScript 中的类型作用域？

- 本节介绍的类型作用域，主要是指“类型的作用范围”。
- 类型作用域是一个社区概念。
  - 在 TS 官方文档中并没有专门的篇幅来介绍 Type Scope，类型作用域是社区自创的一种概念。
  - 在 TypeScript 中，并没有一个官方术语叫“类型作用域”（Type Scope），但这个说法通常被开发者用来描述类型声明的可见性范围，即：在哪些地方可以访问某个类型（如 `interface`、`type`、`class`、`enum` 等）。
- 虽然 TypeScript 本身没有独立的“类型作用域”机制（类型最终会被编译器擦除，不参与运行时），但类型的作用域规则完全遵循 JavaScript/TypeScript 的词法作用域（Lexical Scope）和模块系统。

## 4. TypeScript 中类型作用域遵循什么规则？

TypeScript 中的类型（`type`、`interface`、`class`、`enum` 等）遵循与变量相同的块级作用域或函数作用域规则。

- 块级作用域（Block Scope）

```ts
{
  type User = { name: string }
  const u: User = { name: 'Alice' } // ✅ 可访问
}

// ❌ 错误：User 仅在块内可见
const v: User = { name: 'Bob' }

// 类似 let/const，type 和 interface 在块内声明时，只在该块内有效。
```

- 函数作用域

```ts
function createProcessor() {
  interface Config {
    timeout: number
  }

  return function (config: Config) {
    // ✅ Config 在函数内部可见
  }
}

// 外部无法访问 createProcessor 内部定义的 Config 接口
const p = createProcessor()
p({ timeout: 1000 }) // ✅ 调用没问题，但不能显式标注类型
// p(config: Config) ❌ Config 未定义
```

## 5. TypeScript 中模块作用域是如何工作的？

TypeScript 默认采用 ES 模块系统（每个文件是一个模块，只要包含 `import`/`export`）。

- 未显式导出的类型是模块内私有的。

```ts
// user.ts
// 此时 User 是 user.ts 模块内私有类型（默认行为）
interface User {
  id: string
  name: string
}

export function createUser(name: string): User {
  return { id: generateId(), name }
}

// 在这个文件中：
// User 是模块私有 的，外部无法直接引用。
// 但返回值类型 User 会被隐式导出，调用者可安全使用，但不能显式声明 User 类型变量。

// main.ts
import { createUser } from './user'

const user = createUser('Alice') // user 类型被推断为 { id: string; name: string }
// const u: User = ...; // ❌ 找不到 User（未显式导出）
```

- 如果外部需要访问模块内的私有类型，可以考虑将类型显式导出。

```ts
// user.ts
// 可以将 User 类型显式导出类型
export interface User {
  id: string
  name: string
}

export type UserId = string

// main.ts
import { User, UserId } from './user'

const u: User = { id: '1', name: 'Alice' } // ✅
```

## 6. TypeScript 中全局作用域有什么特点？

特点：没有 `import` / `export` 的模块

如果没有 `import` / `export` 的模块，将被 TypeScript 默认视为全局脚本。

```ts
// 全局模块存在被全局污染风险

// bad.ts（无 import/export）
interface Config {
  debug: boolean
}

// another.ts（无 import/export）
interface Config {
  apiUrl: string
}

// 这两个 Config 会自动合并（Declaration Merging），变成：
interface Config {
  debug: boolean
  apiUrl: string
}

// 这容易导致意外冲突，现代项目应始终使用模块（即每个文件至少有一个 export）。
```

## 7. 如何安全地扩展全局作用域？

TypeScript 允许通过 `declare global` 安全扩展全局作用域：

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

接下来就可以在任何模块中使用：

```ts
window.myApp.version // ✅ 类型安全
```

## 8. demos.1 - TypeScript 是如何识别文件是一个模块还是全局脚本的呢？

在回答这个问题之前，需要先明确一下，TypeScript 中有两种类型的模块：

- 局部模块 -> 官方的叫法是 `module`
- 全局脚本 -> 官方的叫法是 `script`

我们前面提到的，如果一个模块中含有 `export` 或 `import` 这样的模块化语句，那么按照 TS 的模块解析策略，就会将其识别为 module，反之识别为 script。

```ts
// 问题场景描述：
// 当你在学习 TS 的时候，在本地新建了俩文件，比如叫 1.ts 和 2.ts
// 你在 1.ts 中声明了一个 a 变量

// 1.ts
let a = 1

// 当你在 2.ts 中也声明了一个 a 变量之后（你会发现两个模块都出现了报错）

// 2.ts
let a = 1

// 这时候你往往会遇到这么一个错误：无法重新声明块范围变量“a”。ts(2451)
// 并且该错误同时出现在了 1.ts 和 2.ts 文件中。
```

::: swiper

![1](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-21-19-45-25.png)

![2](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-21-19-46-18.png)

![3](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-21-19-46-35.png)

:::

当你遇到上面这个问题时，在很多教程中，会教你这么做：你只需要在任意模块中添加一条模块化语句即可，比如：`export {}`，这么做确实能够解决报错的问题，但是这么做显得不那么优雅，我这就是一个简单的测试模块，为什么非得在每个模块都加上这样无意义的一条语句呢？

实际上，这个模块检测的策略是支持配置的，并不是非得加模块导入导出语句才能让你的文件被 TS 识别为一个 module。在 TS 配置文件中有这么一个字段 `moduleDetection`，它就是用来控制 TS 如何确定文件是 `script` 还是 `module` 的。

上述报错的主要原因在于，`1.ts`、`2.ts` 都被 TS 视作了 `script`，而不是 `module`，因此 TS 认为你的代码虽然写在两个不同的文件中，但最终会合并到同一个全局上下文中执行，而你重复声明了变量 a，自然就报错了。

以下是官方对于 `moduleDetection` 配置的描述：

![图 0](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-21-19-44-53.png)

## 9. TypeScript 中 `namespace` 命名空间的作用域是什么样的？

- `namespace` 是一种将相关代码组织在一起的方式，中文译为“命名空间”。
- `namespace` 出现在 ES 模块诞生之前，作为 TypeScript 自己的模块格式而发明的。但是，自从有了 ES 模块，官方已经不推荐使用 `namespace` 了。
- 早期 TypeScript 使用 `namespace` 组织代码（类似模块），但现在推荐使用 ES 模块。

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
- 官方文档建议“仅用于描述现有 JS 库的类型”

## 10. TypeScript 中如何处理同一个作用域下的同名的 `interface`、`class`、`type` 呢？

- `interface` 可以与 `interface`、`class` 合并
- `type` 别名不能与任何类型同名

---

- 模块内的同名 `interface` 会自动合并

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

- 跨模块合并 `interface` 的做法

```ts
// global.d.ts
interface User {
  id: string
}

// utils.ts（必须是全局脚本，或通过 declare global）
interface User {
  createdAt: Date
}

// 在不同模块中，这些跨模块的 interface 不会自动合并。
// 解决方案：
// 1. 显式导出并导入
// 2. 显式全局声明 declare global
// 目的都是为了让它们在同一个作用域中
```

- `interface` 可以跟 `class` 合并

```ts
class User {}
interface User {
  age: number
}

const u = new User()

u.age // => number
```

- `type` 别名不能与任何类型同名

```ts
class User {} // 声明了一个类型 User 和一个值 User（构造函数）
// 注意：TS 中的类本身就是一种类型。

type User = string // ❌ 错误！不能与 class 同名（值和类型冲突）
// Duplicate identifier 'User'.(2300)

// -----------------------------------

interface User {
  name: string
}
type User = string // ❌ 错误！Duplicate identifier 'User'.(2300)

// -----------------------------------

// 值（变量 User）和类型（类型别名 User）的名称不会冲突
const User = 'admin'
type User = string // ✅ ok
```

## 11. 引用

- [tsconfig 配置项 moduleDetection][1]

[1]: https://www.typescriptlang.org/tsconfig/#moduleDetection
