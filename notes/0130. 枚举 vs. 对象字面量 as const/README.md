# [0130. 枚举 vs. 对象字面量 as const](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0130.%20%E6%9E%9A%E4%B8%BE%20vs.%20%E5%AF%B9%E8%B1%A1%E5%AD%97%E9%9D%A2%E9%87%8F%20as%20const)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 对象字面量类型和枚举类型怎么选？](#3--对象字面量类型和枚举类型怎么选)
  - [3.1. 🔍 看看 TS 官方的说法](#31--看看-ts-官方的说法)
  - [3.2. 🔍 社区中的一些声音](#32--社区中的一些声音)
- [4. 🆚 枚举 vs 对象字面量](#4--枚举-vs-对象字面量)
- [5. 🤔 为什么对象字面量类型的 Tree-shaking 支持更好？](#5--为什么对象字面量类型的-tree-shaking-支持更好)
- [6. 🤔 如何将项目中的枚举的写法迁移到对象字面量的写法？](#6--如何将项目中的枚举的写法迁移到对象字面量的写法)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 枚举
- 对象字面量 as const

## 2. 🫧 评价

`枚举` 和 `对象字面量 as const` 是 TS 中定义常量集合的两种主要方式，TS 官方和社区都推荐使用后者，而不推荐使用枚举。

## 3. 🤔 对象字面量类型和枚举类型怎么选？

这应该是最先要明确的问题，因为这决定了你是否有必要深入学习“枚举”这一类型。

答案是：不要用枚举，应该选对象字面量类型。

### 3.1. 🔍 看看 TS 官方的说法

![img](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-30-19-01-22.png)

::: tip 吐槽一句……

无奈这部分内容是 Enum 章节的结尾才提到的，早知道 Enum 类型官方都不推荐使用了，这个章节就简单一笔带过完事儿，写到最后才发现这玩意儿在实战中没啥实际作用！唯一的作用可能就是在阅读其他 TS 项目时，看到 enum 类型能理解其特性了。

:::

### 3.2. 🔍 社区中的一些声音

[youtube - Matt Pocock - Why I don't use enums anymore][4] - 这是 youtube 上的一个视频，作者 Matt Pocock 很详细地介绍了为什么不推荐使用 enum 类型。

![img](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-30-19-08-45.png)

[Effective TypeScript - Enums are unions][5] - 这是 《Effective TypeScript》 作者 Dan Vanderkam 的一篇博客。

![img](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-30-19-10-54.png)

![img](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-30-19-11-47.png)

## 4. 🆚 枚举 vs 对象字面量

| 特性         | 枚举                  | 对象字面量 + as const |
| ------------ | --------------------- | --------------------- |
| 语法         | TypeScript 特有       | 标准 JavaScript       |
| 类型定义     | 自动                  | 手动                  |
| 运行时代码   | 有（const enum 没有） | 有                    |
| 反向映射     | 支持（数字）          | 若有需求，可手动实现  |
| Tree-shaking | 较差                  | 较好                  |

::: code-group

```ts [枚举]
enum StatusEnum {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING',
}

function handleStatusEnum(status: StatusEnum): void {
  console.log(status)
}

handleStatusEnum(StatusEnum.Active) // ✅ OK
handleStatusEnum('ACTIVE') // ❌ Error
// Argument of type '"ACTIVE"' is not assignable to parameter of type 'StatusEnum'.(2345)
```

```ts [对象字面量]
const StatusObject = {
  Active: 'ACTIVE',
  Inactive: 'INACTIVE',
  Pending: 'PENDING',
} as const

// 需要手动定义类型：
type StatusObject = (typeof StatusObject)[keyof typeof StatusObject]
// 等效于：
// type StatusObject = "ACTIVE" | "INACTIVE" | "PENDING"

function handleStatusObject(status: StatusObject): void {
  console.log(status)
}

handleStatusObject(StatusObject.Active) // ✅ OK
handleStatusObject('ACTIVE') // ✅ OK
```

:::

## 5. 🤔 为什么对象字面量类型的 Tree-shaking 支持更好？

核心原因：枚举会编译成 IIFE 立即执行函数，而对象字面量是普通的属性访问。

::: code-group

```ts [枚举编译产物]
enum Feature {
  Search = 'SEARCH',
  Filter = 'FILTER',
  Sort = 'SORT',
  Export = 'EXPORT',
}

const feature = Feature.Search

// 编译后的 JS：
// var Feature;
// (function (Feature) {
//     Feature["Search"] = "SEARCH";
//     Feature["Filter"] = "FILTER";
//     Feature["Sort"] = "SORT";
//     Feature["Export"] = "EXPORT";
// })(Feature || (Feature = {}));
//
// const feature = Feature.Search;

// ❌ 问题：整个 IIFE 是一个不可分割的执行单元
// 即使只用了 Search，打包工具也无法安全地移除其他成员
```

```ts [对象字面量编译产物]
export const FeatureObj = {
  Search: 'SEARCH',
  Filter: 'FILTER',
  Sort: 'SORT',
  Export: 'EXPORT',
} as const

const feature2 = FeatureObj.Search

// 编译后的 JS：
// export const FeatureObj = {
//     Search: 'SEARCH',
//     Filter: 'FILTER',
//     Sort: 'SORT',
//     Export: 'EXPORT',
// };
//
// const feature2 = FeatureObj.Search;

// ✅ 优势：普通对象的属性访问
// 打包工具（如 Webpack、Rollup）可以进行更精确的静态分析
// 未使用的属性可以被安全地移除
```

:::

- IIFE 的副作用：枚举编译成的立即执行函数被打包工具视为“有副作用的代码”，不敢轻易删除
- 静态分析难度：函数内部的赋值操作（`Feature["Search"] = "SEARCH"`）难以进行精确的依赖追踪
- 对象字面量的透明性：普通对象结构清晰，打包工具可以准确判断哪些属性被使用

实际对比：

```ts
// 场景：只使用一个成员
import { Feature, FeatureObj } from './constants'

const f1 = Feature.Search
const f2 = FeatureObj.Search

// 打包结果对比：
// 枚举方式：整个 IIFE（约 200+ 字节）
// 对象字面量：可能只保留 `const FeatureObj = { Search: 'SEARCH' }`
```

注意：即使是 `const enum`，虽然会内联值从而避免运行时对象，但它有自己的局限性（默认不支持跨文件、不支持动态访问等，虽然官方后续又添加了一些配置来填这些坑，但 `const enum` 依旧不是推荐的写法），这也是为什么推荐使用对象字面量的原因。

## 6. 🤔 如何将项目中的枚举的写法迁移到对象字面量的写法？

参考的迁移流程：

- 步骤 1：创建对象字面量
- 步骤 2：定义类型别名
- 步骤 3：逐步替换使用
- 步骤 4：添加兼容层（过渡期）

```ts
// 原枚举
enum OldStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING',
}

// 步骤 1：创建对象字面量
const Status = {
  Active: 'ACTIVE',
  Inactive: 'INACTIVE',
  Pending: 'PENDING',
} as const

// 步骤 2：定义类型别名
type Status = (typeof Status)[keyof typeof Status]

// 步骤 3：逐步替换使用
// 旧代码
function oldHandler(status: OldStatus): void {}

// 新代码
function newHandler(status: Status): void {}

// 步骤 4：添加兼容层（过渡期）
function handler(status: OldStatus | Status): void {
  const statusValue = typeof status === 'string' ? status : OldStatus[status]
  console.log(statusValue)
}
```

## 7. 🔗 引用

- [TypeScript Handbook - Enums - Objects vs Enums][1]
- [TypeScript Handbook - Const Assertions][2]
- [TypeScript Deep Dive - Const][3]
- [youtube - Matt Pocock - Why I don't use enums anymore][4]
- [Effective TypeScript - Enums are unions][5]

[1]: https://www.typescriptlang.org/docs/handbook/enums.html#objects-vs-enums
[2]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions
[3]: https://basarat.gitbook.io/typescript/type-system/const
[4]: https://www.youtube.com/watch?v=jjMbPt_H3RQ
[5]: https://effectivetypescript.com/2023/02/07/ts-50-beta/
