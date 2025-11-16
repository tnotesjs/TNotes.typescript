# [0106. 接口的合并（声明合并）](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0106.%20%E6%8E%A5%E5%8F%A3%E7%9A%84%E5%90%88%E5%B9%B6%EF%BC%88%E5%A3%B0%E6%98%8E%E5%90%88%E5%B9%B6%EF%BC%89)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是声明合并？](#3--什么是声明合并)
- [4. 🤔 接口合并的时候出现类型冲突怎么办？](#4--接口合并的时候出现类型冲突怎么办)
- [5. 🤔 索引签名接口可以合并吗？](#5--索引签名接口可以合并吗)
- [6. 🤔 泛型接口可以合并吗？](#6--泛型接口可以合并吗)
- [7. 🤔 函数重载可以合并吗？](#7--函数重载可以合并吗)
  - [7.1. 函数签名自动合并](#71-函数签名自动合并)
  - [7.2. 重载匹配和接口顺序的关系](#72-重载匹配和接口顺序的关系)
    - [错误的思维方式](#错误的思维方式)
    - [真实结论](#真实结论)
    - [示例 1：顺序不影响（有唯一更具体者）](#示例-1顺序不影响有唯一更具体者)
    - [示例 2：存在“平局”时，后声明者优先](#示例-2存在平局时后声明者优先)
- [8. 🤔 合并可以跨越模块吗？](#8--合并可以跨越模块吗)
  - [8.1. 先说结论](#81-先说结论)
  - [8.2. 示例一：全局脚本之间会自动合并](#82-示例一全局脚本之间会自动合并)
  - [8.3. 示例二：模块之间不会自动合并](#83-示例二模块之间不会自动合并)
  - [8.4. 示例三：用模块增强在“目标模块命名空间内”合并](#84-示例三用模块增强在目标模块命名空间内合并)
  - [8.5. 示例四：为第三方包做模块增强](#85-示例四为第三方包做模块增强)
  - [8.6. 小结](#86-小结)
- [9. 🤔 关于接口合并的一些开发建议都有哪些？](#9--关于接口合并的一些开发建议都有哪些)
- [10. 🔗 引用](#10--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 声明合并的概念
- 接口合并的冲突处理
- 属性和方法的合并
- 函数重载的合并

## 2. 🫧 评价

声明合并（Declaration Merging）是 TypeScript 的一个独特特性，允许多个同名的声明自动合并为一个声明，是扩展现有类型的主要方式。

这篇笔记中介绍的内容，在官方文档中有专门的文章说明 -> [TypeScript Handbook - Declaration Merging][1]。

## 3. 🤔 什么是声明合并？

声明合并是指 TypeScript 编译器会将多个同名的声明合并为一个声明。

自动合并：

- 顺序无关：声明顺序不影响结果
- 累加属性：所有属性都被保留
- 接口专属：类型别名不支持

接口合并的特点：

- 自动合并：同名接口会自动合并
- 属性累加：所有属性都会被包含
- 方法重载：同名方法会形成重载
- 类型扩展：可以扩展第三方库的类型

声明合并最常见的用途：

1. 扩展第三方库：为库添加类型定义
2. 模块扩展：扩展模块的导出类型
3. 全局类型扩展：扩展全局对象
4. 代码组织：将大型接口拆分为多个部分

与类型别名的区别：

| 特性     | 接口        | 类型别名                |
| -------- | ----------- | ----------------------- |
| 声明合并 | ✅ 支持     | ❌ 不支持               |
| 扩展方式 | `extends`   | `&`                     |
| 重复声明 | ✅ 自动合并 | ❌ 报错（相同作用域下） |

```ts
// 多个同名接口会自动合并
interface User {
  name: string
}

interface User {
  age: number
}

interface User {
  email: string
}

// 自动合并为
// interface User {
//   name: string
//   age: number
//   email: string
// }

const user: User = {
  name: 'Alice',
  age: 30,
  email: 'alice@example.com',
}
```

## 4. 🤔 接口合并的时候出现类型冲突怎么办？

如果同一个字段，类型不同，会直接报错。

```ts
interface Document {
  title: string
}

// ❌ 不同类型会报错
interface Document {
  title: number // ❌
}
// Subsequent property declarations must have the same type.
// Property 'title' must be of type 'string', but here has type 'number'.(2717)
```

注意：同字段的类型必须相同，即便是在类型兼容（为父子关系）的情况下，也是会报错的。

```ts
interface Document {
  title: string
}

interface Document {
  title: string | number // ❌
}
// Subsequent property declarations must have the same type.
// Property 'title' must be of type 'string', but here has type 'string | number'.(2717)
```

虽然类型兼容，但是 `string | number` 和 `string` 不是相同的类型，还是会报错。

可选属性也是同样的道理。

```ts
interface Document {
  title: string
}

interface Document {
  title?: string // ❌
  // 相当于：
  // title: string | undefined
}
// All declarations of 'title' must have identical modifiers.(2687)
// Subsequent property declarations must have the same type.
// Property 'title' must be of type 'string', but here has type 'string | undefined'.(2717)
```

## 5. 🤔 索引签名接口可以合并吗？

可以合并。

1. 索引签名可以跟普通接口合并
2. 索引签名可以跟索引签名合并

::: code-group

```ts [1]
// 索引签名
interface StringMap {
  [key: string]: string | number
}

// 普通接口
interface StringMap {
  count: number // 必须符合索引签名
}

// 合并后：
// interface StringMap {
//   [key: string]: string | number
//   count: number
// }

const map: StringMap = {
  count: 1, // 必填
  name: 'Alice', // 可选
  extra: 'data', // 可选
}
```

```ts [2]
// 索引签名 - 以 string 作为 key
interface TestMap {
  [key: string]: string | number
}

// 索引签名 - 以 number 作为 key
interface TestMap {
  [key: number]: string
}
// ⚠️ number 作为 key 的索引签名的类型必须是 string 作为 key 的索引签名的子级
// string 是 string | number 的子级

// 索引签名 - 以 symbol 作为 key
interface TestMap {
  [key: symbol]: 'foo'
}

// 合并后：
// interface TestMap {
//   [key: string]: string | number
//   [key: number]: string
//   [key: symbol]: "foo"
// }

const map: TestMap = {
  // key 是 string 类型，值可以是 string 或者 number
  name: 'Alice',
  age: 123,
  // key 是 number 类型，值要求必须是 string 类型
  [123]: 'bar',
  // key 是 symbol 类型，值只能是字面量类型 'foo'
  [Symbol.for('test')]: 'foo',
}
```

:::

## 6. 🤔 泛型接口可以合并吗？

可以合并。

```ts
interface Container<T> {
  value: T
}

interface Container<T> {
  getValue(): T
}

// 合并后：
// interface Container<T> {
//   value: T
//   getValue(): T
// }

const container: Container<number> = {
  value: 42,
  getValue() {
    return this.value
  },
}
```

## 7. 🤔 函数重载可以合并吗？

不同接口中的同名函数签名会自动合并为函数重载。

### 7.1. 函数签名自动合并

```ts
// 同名函数的签名会形成重载
interface Calculator {
  add(a: number, b: number): number
}

interface Calculator {
  add(a: string, b: string): string
}

interface Calculator {
  add(a: number[], b: number[]): number[]
}

// 合并后：
// interface Calculator {
//   add(a: number, b: number): number
//   add(a: string, b: string): string
//   add(a: number[], b: number[]): number[]
// }

// 先声明重载
function add(a: number, b: number): number
function add(a: string, b: string): string
function add(a: number[], b: number[]): number[]
function add(a: unknown, b: unknown) {
  if (typeof a === 'number' && typeof b === 'number') return a + b
  if (typeof a === 'string' && typeof b === 'string') return a + b
  if (Array.isArray(a) && Array.isArray(b)) return a.concat(b)
  throw new Error('Invalid arguments')
}

// 合并后形成重载
const calc: Calculator = {
  add,
}

const x1 = calc.add(1, 2) // const x1: number
const x2 = calc.add('a', 'b') // const x2: string
const x3 = calc.add([1], [2]) // const x3: number[]
```

### 7.2. 重载匹配和接口顺序的关系

#### 错误的思维方式

直接套用之前的惯性思维，认为后者优先级高会覆盖前者（比如对象的展开合并），因此写在后面的会优先匹配。

#### 真实结论

- 重载匹配主要看“谁更具体”（more specific）。有唯一更具体者时，和声明顺序无关。
- 只有在“没有唯一更具体者（同等具体、彼此不可比）”时，才用“声明顺序”打破平局。
- 接口声明合并后，TypeScript 会把“后声明的重载”排在“前面”，因此在平局时“后声明者优先”。

#### 示例 1：顺序不影响（有唯一更具体者）

```ts
// 1 写前面：
// 1
interface A {
  process(data: 'a'): 'A'
}

// 2
interface A {
  process(data: string): 'S'
}

declare const a: A
// 声明一个变量 a，告诉 TS 它的类型就是 A

const r1 = a.process('a')
// TS 推断结果：匹配 1
// const r1: "A"

const r2 = a.process('x')
// TS 推断结果：匹配 2
// const r2: "S"

// 字面量重载更具体，顺序无关
// 无论是 1 写在前面还是 2 写在前面，最终匹配结果都是一样的。
```

把顺序反过来得到的结果是一样的：

```ts
// 2 写前面：
// 2
interface A {
  process(data: string): 'S'
}

// 1
interface A {
  process(data: 'a'): 'A'
}

declare const a: A
// 声明一个变量 a，告诉 TS 它的类型就是 A

const r1 = a.process('a')
// TS 推断结果：匹配 1
// const r1: "A"

const r2 = a.process('x')
// TS 推断结果：匹配 2
// const r2: "S"
```

#### 示例 2：存在“平局”时，后声明者优先

```ts
interface P {
  f(x: 'a' | 'b'): 1
}

interface P {
  f(x: 'a' | 'c'): 2 // 后声明 - 平局时它优先
}

// 合并后：
// interface P {
//   f(x: 'a' | 'b'): 1
//   f(x: 'a' | 'c'): 2
// }

declare const p: P

const r = p.f('a')
// TS 推断结果：
// const r: 2

// 两个重载都适配
// 没有唯一更具体者（同等具体、彼此不可比）
// 用“声明顺序”打破平局
// “后声明”的优先级高
```

把顺序反过来会得到相反结果：

```ts
interface P {
  f(x: 'a' | 'c'): 2
}

interface P {
  f(x: 'a' | 'b'): 1 // 后声明 - 平局时它优先
}

// 合并后：
// interface P {
//   f(x: 'a' | 'c'): 2
//   f(x: 'a' | 'b'): 1
// }

declare const p: P

const r = p.f('a')
// TS 推断结果：
// const r: 1
```

## 8. 🤔 合并可以跨越模块吗？

::: tip 💡 温馨提示

- 下面说的“模块”是指带有 import/export 语句的文件
- 下面说的“全局脚本”是指没有 import/export 的文件

TS 将一个文件识别为“模块”还是“全局脚本”是可以通过配置文件 `tsconfig.json` 中的 `moduleDetection` 来配置的，在默认值 `moduleDetection: "auto"` 配置下，TS 会按照上述这样的逻辑来确定文件是脚本还是模块。

:::

### 8.1. 先说结论

- 不能“自动”跨模块合并 - 同名接口在不同 ES 模块的导出里不会合并
- 可以跨“全局脚本”合并
- 想要跨模块扩展，使用 Module Augmentation（模块增强）：`declare module '...' { ... }`
- 想要向全局增加类型，使用 Global Augmentation（全局增强）：`declare global { ... }`

### 8.2. 示例一：全局脚本之间会自动合并

```ts
// a.d.ts（无 import/export）
interface Person {
  name: string
}

// b.d.ts（无 import/export）
interface Person {
  age: number
}

// 任意文件
const p: Person = { name: 'Ada', age: 37 } // OK，已合并
```

### 8.3. 示例二：模块之间不会自动合并

```ts
// a.ts（模块）
export interface Person {
  name: string
}

// b.ts（模块）
export interface Person {
  age: number
}

// use.ts
import { Person as APerson } from './a'
import { Person as BPerson } from './b'

let a: APerson = { name: 'Ada' } // OK
let b: BPerson = { age: 37 } // OK
// 它们是两个不同的类型，不会合并
```

### 8.4. 示例三：用模块增强在“目标模块命名空间内”合并

```ts
// a.ts
export interface Person {
  name: string
}

// augment-a.d.ts
export {} // 确保本文件是模块
declare module './a' {
  interface Person {
    age: number
  } // 扩展 a.ts 导出的 Person
}

// use.ts
import { Person } from './a'
const p: Person = { name: 'Ada', age: 37 } // OK（已合并）
```

### 8.5. 示例四：为第三方包做模块增强

```ts
// types/express.d.ts
export {}
declare module 'express-serve-static-core' {
  interface Request {
    user?: { id: number; role: string }
  }
}
// 确保该 .d.ts 被 tsconfig 的 include/types 收录
```

### 8.6. 小结

- 模块增强文件必须是“模块文件”（包含任意 import/export，常用 export {}）。
- 只能增强可合并的实体（interface、namespace、enum、类的实例成员等）；type 别名不可合并。
- 增强只影响类型层面；若改动涉及运行时行为，需配套运行时代码。
- 声明顺序一般无关；仅在重载“无唯一更具体者”时，合并后的先后顺序才影响选择（后声明者通常排在前面）。

## 9. 🤔 关于接口合并的一些开发建议都有哪些？

```ts
// ✅ 1. 使用接口而非类型别名进行扩展
interface User {
  name: string
}

interface User {
  age: number
}

// ✅ 2. 将扩展放在单独的类型定义文件
// types/express.d.ts
import 'express'

declare module 'express-serve-static-core' {
  interface Request {
    user?: User
  }
}

// ✅ 3. 文档化扩展
/**
 * 扩展 Express Request
 * 添加用户认证信息
 */
declare module 'express-serve-static-core' {
  interface Request {
    /** 当前登录用户 */
    user?: {
      id: number
      role: string
    }
  }
}

// ✅ 4. 使用命名空间组织扩展
declare global {
  namespace MyApp {
    interface Config {
      apiUrl: string
    }
  }
}

declare global {
  namespace MyApp {
    interface Config {
      timeout: number
    }
  }
}

// ✅ 5. 避免扩展内置类型
// ❌ 不推荐
declare global {
  interface Array<T> {
    myMethod(): void
  }
}

// ✅ 使用工具函数
function arrayMyMethod<T>(arr: T[]): void {
  // 实现
}

// ✅ 6. 模块扩展时保持类型一致
declare module './types' {
  interface User {
    email: string // 与现有属性风格一致
  }
}

// ✅ 7. 使用 export {} 确保文件是模块
// global.d.ts
declare global {
  interface Window {
    myApp: any
  }
}

export {} // 确保是模块

// ✅ 8. 合并时考虑可选性
interface Config {
  host: string
}

interface Config {
  port?: number // 可选属性
}

// ✅ 9. 为第三方库扩展创建单独文件
// types/
//   express.d.ts
//   vue.d.ts
//   react.d.ts
```

## 10. 🔗 引用

- [TypeScript Handbook - Declaration Merging][1]
- [TypeScript Handbook - Module Augmentation][2]
- [TypeScript Deep Dive - Declaration Merging][3]

[1]: https://www.typescriptlang.org/docs/handbook/declaration-merging.html
[2]: https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
[3]: https://basarat.gitbook.io/typescript/type-system/declaration-merging
