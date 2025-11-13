# [0226. JSDoc 类型注释](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0226.%20JSDoc%20%E7%B1%BB%E5%9E%8B%E6%B3%A8%E9%87%8A)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 💻 demos.1 - 认识 JSDoc 类型注释](#3--demos1---认识-jsdoc-类型注释)
- [4. 💻 demos.2 - `@type` 标记的经典用法](#4--demos2---type-标记的经典用法)
- [5. 🤔 TS 支持哪些 JSDoc 标记？](#5--ts-支持哪些-jsdoc-标记)
- [6. 🤔 JSDoc 与 TS 有什么区别？](#6--jsdoc-与-ts-有什么区别)
  - [6.1. JSDoc 和 TS 两种写法对比](#61-jsdoc-和-ts-两种写法对比)
  - [6.2. 优势、劣势分析](#62-优势劣势分析)
  - [6.3. 决策建议](#63-决策建议)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- JSDoc 类型注释系统概述
- TS 支持的 JSDoc 标记
- JSDoc 与 TS 的关系和区别

## 2. 🫧 评价

本节介绍的内容，在官方文档有专门的介绍文档：[TS Handbook - JSDoc Reference][1] - 这是在 JS 中渐进引入 TS 类型系统的“桥梁手册”——通过标准 JSDoc 让 .js 文件获得接近 .ts 的类型检查能力。

JSDoc 是 JS 的文档注释标准，TS 扩展了 JSDoc 以支持类型注释，让 JS 项目也能享受类型检查的好处。

- 允许在 JS 中添加类型信息而无需改为 `.ts` 文件
- 配合 `@ts-check` 可以启用类型检查
- 适合渐进式迁移或不想完全转向 TS 的项目
- 编辑器（VS Code）能提供智能提示和类型检查
- 是从 JS 到 TS 的平滑过渡方案

## 3. 💻 demos.1 - 认识 JSDoc 类型注释

JSDoc 是 JS 的文档注释标准，TS 扩展了它以支持类型信息：

::: code-group

<<< ./demos/1/2.js [JSDoc 注释的结构]

<<< ./demos/1/1.js [TS 提供类型支持]

:::

## 4. 💻 demos.2 - `@type` 标记的经典用法

使用 `@type` 标记，可以让我们在指定 JS 模块中为特定变量添加完整类型信息。

背景：比如我们在 `1.js`、`2.js` 中定义了一个变量 `config1`、`config2`，它表示 webpack 的配置，但是配置字段具体都有哪些，我们往往需要一遍看着官方文档，一遍编写配置，深怕写错。

解决方案：使用 `@type` 标记来标注变量的类型，让编辑器（比如 VSCode）知道它是 webpack 配置，并在配置字段名称写错的时候，立刻给予我们提示。

具体做法：

::: code-group

<<< ./demos/2/1.js {}

<<< ./demos/2/2.js {}

<<< ./demos/2/package.json {}

:::

测试结果：

1. 错将 `mode` 写为 `mode111`，会立刻报错
2. 鼠标悬停到 `mode` 上，会有明确的字段类型定义提示，告诉我们都能填入哪些值
3. 如果没有 `@type` 标记，那么写错就是写错了，不会有任何反馈，也不会有任何类型定义的提示

::: swiper

![1](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-13-14-58-35.png)

![2](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-13-14-58-47.png)

![3](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-13-14-58-55.png)

:::

## 5. 🤔 TS 支持哪些 JSDoc 标记？

直接上官方文档查看：

![图 0](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-13-14-10-40.png)

::: warning 🫧 评价

- 这些标记主要用于在 JS 模块中，利用 JSDoc 语法来获取 TS 类型系统提供的一些服务，享受 TS 的一些核心优势。
- 部分标记还算好用，比如 `@type`，但是其它的标记，测试下来 Bug 还是很多的，类型服务的支持效果远没有原生的 TS 来的实在。

:::

## 6. 🤔 JSDoc 与 TS 有什么区别？

### 6.1. JSDoc 和 TS 两种写法对比

```js
// 示例 1：基本类型声明

// JSDoc 方式
/**
 * @param {string} name
 * @param {number} age
 * @returns {string}
 */
function greetJS(name, age) {
  return `Hello, ${name}! You are ${age} years old.`
}

// TS 方式
function greetTS(name: string, age: number): string {
  return `Hello, ${name}! You are ${age} years old.`
}

// 示例 2：接口定义

// JSDoc 方式
/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} email
 */

/**
 * @param {User} user
 */
function displayUserJS(user) {
  console.log(user.name)
}

// TS 方式
interface User {
  id: number;
  name: string;
  email: string;
}

function displayUserTS(user: User): void {
  console.log(user.name)
}

// 示例 ...
```

### 6.2. 优势、劣势分析

- JSDoc 写法的优势：
  - 渐进式引入类型检查
  - 与现有 JS 项目兼容
  - 适合少量个别模块使用
- JSDoc 写法的劣势：
  - 语法冗长，写起来麻烦
  - 类型表达能力有限
  - 缺少一些高级类型特性
  - 编辑器支持不如原生 TS（很多类型检查的行为表现会有异常，简单测试了一下，可以说几乎不可用）
- TS 写法的优势：
  - 语法简洁，类型声明更自然
  - 完整的类型系统支持
  - 更好的编辑器支持
  - 更强大的类型推断
  - 丰富的高级类型特性
- TS 写法的劣势：
  - 需要完全重写为 .ts 文件
  - 可能影响构建流程

### 6.3. 决策建议

- 使用 JSDoc 的场景：
  - 现有大型 JS 项目
  - 不想改变构建流程
  - 团队不熟悉 TS
  - 需要渐进式迁移
  - 库需要同时提供 JS 和类型
- 使用 TS 的场景：
  - 新项目
  - 需要完整类型系统
  - 团队熟悉 TS
  - 追求最佳开发体验
  - 复杂的类型逻辑
- 混合使用：
  - 可以在 TS 项目中导入使用 JSDoc 的 JS 文件
  - 也可以在 JS 项目中逐步添加 JSDoc，最终迁移到 TS

## 7. 🔗 引用

- [TS Handbook - JSDoc Reference][1]
- [JSDoc Official Documentation][2]
- [JSDoc @type Tag][4]
- [VS Code JS Type Checking][3]

[1]: https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
[2]: https://jsdoc.app/
[3]: https://code.visualstudio.com/docs/nodejs/working-with-javascript#_type-checking
[4]: https://jsdoc.app/tags-type.html
