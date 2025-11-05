# [0073. TS 官方文档](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0073.%20TS%20%E5%AE%98%E6%96%B9%E6%96%87%E6%A1%A3)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 TypeScript 官方文档有哪些主要部分？](#3--typescript-官方文档有哪些主要部分)
  - [3.1. 核心模块](#31-核心模块)
  - [3.2. 核心内容详解](#32-核心内容详解)
- [4. 🤔 如何高效使用官方文档？](#4--如何高效使用官方文档)
  - [4.1. 学习路径建议](#41-学习路径建议)
  - [4.2. 使用技巧](#42-使用技巧)
  - [4.3. 一些常见的查询场景](#43-一些常见的查询场景)
- [5. 🤔 官方文档与第三方教程的区别是什么？](#5--官方文档与第三方教程的区别是什么)
  - [5.1. 对比表格](#51-对比表格)
  - [5.2. 第三方教程的典型错误示例](#52-第三方教程的典型错误示例)
  - [5.3. 使用建议](#53-使用建议)
- [6. 🔗 引用](#6--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- TypeScript 官方文档的结构简介
- TypeScript 官方文档的一些使用技巧

## 2. 🫧 评价

TypeScript 官方文档是学习和使用 TypeScript 的权威资源。它不仅覆盖了语言的所有特性，还提供了编译器选项、工具链集成、迁移指南等实用内容。

相比第三方教程，官方文档的优势在于：

1. 权威性：所有信息都经过核心团队审核
2. 完整性：涵盖从基础到高级的所有特性
3. 时效性：每次版本更新都会同步更新文档
4. 可验证性：提供 Playground 可以立即验证示例代码

虽然官方文档风格偏技术性，但它是解决复杂问题、深入理解 TypeScript 的最佳途径。建议将其作为常备参考手册，而非入门教程。

如果入门直接上官方文档，容易失去信心，可以找一些短平快的教程来作为 TypeScript 的入门教程。比如，B 站上就有很多几分钟快速入门 TypeScript 的教程，里面讲解的大多是 TypeScript 日常开发中最常用到的一些特性，可以帮助你快速了解 TypeScript 是什么？

## 3. 🤔 TypeScript 官方文档有哪些主要部分？

### 3.1. 核心模块

TypeScript 官方文档分为以下核心模块：

| 模块 | 用途 | 备注 | 链接 |
| --- | --- | --- | --- |
| Get Started | 快速入门指南 | 新手上手、环境搭建 | [链接][1] |
| Handbook | 语言核心手册 | 学习 TS 语法和类型系统 | [链接][2] |
| Reference | 详细参考资料 | 查询工具类型、装饰器等细节 | [链接][3] |
| Tutorials | 实战教程 | 学习与框架（React/Vue）集成 | [链接][4] |
| Release Notes | 版本更新日志 | 了解新特性和破坏性变更 | [链接][5] |
| TSConfig Reference | 编译器配置参考 | 配置 `tsconfig.json` | [链接][6] |
| Declaration Files | 声明文件指南 | 编写 `.d.ts` 类型声明 | [链接][7] |
| Playground | 在线编辑器 | 快速验证代码、分享示例 | [链接][8] |

### 3.2. 核心内容详解

::: code-group

```md [Handbook（必读）]
核心内容：

- The Basics：类型基础
- Everyday Types：常用类型
- Narrowing：类型收窄
- Functions：函数
- Object Types：对象类型
- Type Manipulation：类型操作（泛型、映射类型等）
- Classes：类
- Modules：模块系统

适合：系统学习 TypeScript 语言特性
```

```md [Reference（速查）]
核心内容：

- Utility Types：内置工具类型（Partial、Pick 等）
- Decorators：装饰器
- Mixins：混入模式
- Symbols：符号类型
- Iterators and Generators：迭代器

适合：需要查询特定 API 用法时
```

```md [Release Notes（追新）]
核心内容：

- 每个版本的新特性详解
- Breaking Changes（破坏性变更）
- 性能改进
- Bug 修复

适合：升级 TS 版本时必看
```

:::

## 4. 🤔 如何高效使用官方文档？

### 4.1. 学习路径建议

| 阶段     | 内容                           |
| -------- | ------------------------------ |
| 入门阶段 | Get Started + Handbook 前 3 章 |
| 实战阶段 | 结合项目查阅 Reference         |
| 进阶阶段 | 深入 Handbook 高级章节         |
| 持续更新 | 关注 Release Notes             |

### 4.2. 使用技巧

| 技巧 | 说明 | 示例 |
| --- | --- | --- |
| 善用搜索 | 官方文档支持全文搜索 | 搜索 `conditional types`（条件类型） 快速定位 |
| 查看示例 | 每个特性都有可运行示例 | 可以点击 `Try` 按钮跳转到 Playground |
| 对比版本 | Release Notes 按版本组织 | 如果遇到版本问题，可以在 `What's New` 章节中，查看 1.1 → 5.9 所有主要版本迭代的重大变更 |

1. 通过关键术语精确定位，快速查询相关内容的介绍说明；
   - 前提是你需要熟悉 TS 的核心特性，并清楚相关术语（也就是知道你想要搜的东西，它叫什么）；
   - 在后续学习过程中，可以留意一下所学概念的官方叫法；
2. 所有官方示例都有一个对应的 Try 按钮，点击后会自动跳转到 Playground，并自动填充代码；
3. 可以在 `What's New` 章节，查看过往的 TS 主要版本迭代的重大变更说明；

::: swiper

![1](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-02-10-51-46.png)

![2-1](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-02-10-52-53.png)

![2-2](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-02-10-53-35.png)

![3](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-02-10-54-21.png)

:::

### 4.3. 一些常见的查询场景

1. 查询工具类型用法
2. 查询配置编译选项
3. 查询类型收窄
4. 查询泛型约束
5. 查询配置路径别名
6. 查询类型谓词

::: code-group

```ts [1]
// 问题：如何让对象的所有属性变为可选？
// 查找：Reference > Utility Types > Partial

interface User {
  name: string
  age: number
}

// 查到答案：
type PartialUser = Partial<User>
// 等价于 { name?: string; age?: number }
```

```ts [2]
// 问题：如何开启严格模式？
// 查找：Project Configuration > TSConfig Reference > strict

// tsconfig.json
{
  "compilerOptions": {
    "strict": true // 等价于开启所有严格检查
  }
}
```

```ts [3]
// 问题：typeof 守卫如何工作？
// 查找：Handbook > Narrowing > typeof type guards

function print(value: string | number) {
  if (typeof value === 'string') {
    // 这里 value 被收窄为 string
    console.log(value.toUpperCase())
  }
}
```

```ts [4]
// 问题：如何限制泛型必须有某个属性？
// 查找：Handbook > Generics > Generic Constraints

function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
  return obj[key]
}

let x = { a: 1, b: 2, c: 3, d: 4 }

getProperty(x, 'a')
// getProperty(x, "m"); // ❌ 报错
// Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.

// 文档中会解释 `extends keyof` 的含义
```

```json [5]
// 问题：如何配置 @/ 别名？
// 查找：Project Configuration > TSConfig Reference > paths

{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

```ts [6]
// 问题：is 关键字是什么？
// 查找：Handbook > Narrowing > Using type predicates

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

// 文档会说明这是"用户定义的类型守卫"
```

:::

没事儿多翻翻官方文档，找到规律之后，查起来还是比较快的。

搜索技巧：

1. 使用英文关键词搜索（中文可能搜不到）
2. 搜索具体特性名称（如 "conditional types"）

查找策略：

| 需求类型 | 查找路径 | 示例 |
| --- | --- | --- |
| 语法问题 | Handbook 对应章节 | "如何定义泛型？" → Handbook > Generics |
| 编译选项 | TSConfig Reference | "strict 包含哪些选项？" → TSConfig > strict |
| 内置类型 | Reference > Utility Types | "Omit 怎么用？" → Utility Types > Omit |
| 新特性 | Release Notes | "5.0 有什么新功能？" → Release Notes > 5.0 |

## 5. 🤔 官方文档与第三方教程的区别是什么？

### 5.1. 对比表格

| 对比维度 | 官方文档         | 第三方教程        |
| -------- | ---------------- | ----------------- |
| 权威性   | ✅ 100% 权威     | ❌ 可能过时或有误 |
| 更新速度 | ✅ 与版本同步    | ❌ 往往都是滞后的 |
| 完整性   | 覆盖所有特性     | 通常只讲常用部分  |
| 深度     | 深入到编译器行为 | 多为应用层讲解    |
| 易读性   | 偏技术性         | 通常更友好        |
| 实战性   | 示例偏理论       | 更贴近实际项目    |

注意：虽说官方文档是 100% 权威的，但不意味着 100% 是正确的。

官方文档也有可能出错，如果你怀疑官方文档出错了，可以先到 Issues 面板中看看是否已经有人反馈过了，或者直接给官方提 Issues。

### 5.2. 第三方教程的典型错误示例

```ts
// ❌ 第三方教程中常见的过时写法
namespace MyNamespace {
  export function doSomething() {}
}
// 官方文档明确指出：优先使用 ES6 模块而非 namespace

// ✅ 官方推荐写法
export function doSomething() {}
```

如果你在 TS 学习过程中，看到了一些有争议的描述或者程序示例，这时候就可以重点翻翻官方文档，看看官方是咋说的。

### 5.3. 使用建议

| 阶段 | 学习方式 | 目的 |
| --- | --- | --- |
| 入门阶段 | 第三方教程（快速上手） + 官方 Get Started（验证理解） | 快速上手并验证基础理解 |
| 进阶阶段 | 官方 Handbook（系统学习） + Reference（深入细节） | 系统学习语言特性并深入了解细节 |
| 工作阶段 | 官方文档为主（解决具体问题）+ 社区文章为辅（获取最佳实践） | 解决实际问题并获取最佳实践 |

## 6. 🔗 引用

- [TypeScript Documentation][9]
- [TypeScript Handbook][2]
- [TSConfig Reference][6]
- [TypeScript Playground][8]
- [Release Notes][5]

<!-- typescript-5-9 是目前（2025年10月31日）的最新版 -->

[1]: https://www.typescriptlang.org/docs/handbook/intro.html
[2]: https://www.typescriptlang.org/docs/handbook/
[3]: https://www.typescriptlang.org/docs/handbook/utility-types.html
[4]: https://www.typescriptlang.org/docs/handbook/react.html
[5]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html
[6]: https://www.typescriptlang.org/tsconfig
[7]: https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html
[8]: https://www.typescriptlang.org/play
[9]: https://www.typescriptlang.org/docs/
