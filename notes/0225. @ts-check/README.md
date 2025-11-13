# [0225. @ts-check](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0225.%20%40ts-check)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 💻 demos.1 - 体验 `@ts-check` 的作用](#3--demos1---体验-ts-check-的作用)
- [4. 🤔 @ts-check 如何与 tsconfig.json 配合使用？](#4--ts-check-如何与-tsconfigjson-配合使用)
  - [4.1. 单个 JS 文件启用检查](#41-单个-js-文件启用检查)
  - [4.2. 全局 JS 文件启用检查](#42-全局-js-文件启用检查)
- [5. 🤔 `checkJs` 配置的作用是？](#5--checkjs-配置的作用是)
- [6. 🔗 引用](#6--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- `@ts-check` 注释的基本用法
- 在 JS 文件中启用类型检查
- 与 JSDoc 的配合使用

## 2. 🫧 评价

`@ts-check` 允许在 JS 文件中启用 TS 类型检查，无需将文件改为 `.ts` 扩展名。

- 适合在 JS 项目中逐步引入类型检查
- 位置和 `@ts-nocheck` 一样，必须位于文件顶部才能生效
- JS 项目可以配合 JSDoc 注释提供类型信息
- 将项目从 JS 迁移到 TS 初期常用，比直接迁移到 TS 风险更低，更好地完成渐进式迁移

## 3. 💻 demos.1 - 体验 `@ts-check` 的作用

`@ts-check` 在 JS 文件中启用 TS 类型检查。

::: code-group

<<< ./demos/1/1.js {}

<<< ./demos/1/2.js {}

:::

在 1.js 中，我们可以使用 JSDoc 语法来声明一个未初始化的变量的类型，在开启 `@ts-check` 检查之后，TS 能够解析出变量 foo 的类型是 number，由于 bar 没有使用 JSDoc 来声明其类型，并且也没有赋初始值，因此默认会被推断为 any 类型。

在 2.js 中，当我们开启 `@ts-check` 检查之后，`let count = 0` 会根据变量 count 的初始值 `0` 自动完成类型推断，相当于`let count: number = 0`。

::: swiper

![1 有 @ts-check](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-13-13-08-18.png)

![1 无 @ts-check](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-13-13-08-28.png)

![2 有 @ts-check](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-13-13-12-32.png)

![2 无 @ts-check](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-13-13-12-46.png)

:::

## 4. 🤔 @ts-check 如何与 tsconfig.json 配合使用？

常见有两种模式：

1. 单个 JS 文件启用检查，JS 文件默认不启用检查，需要检查的 JS 模块手动添加 `@ts-check` 注释
2. 全局 JS 文件启用检查，JS 文件默认启用检查，需要关闭检查的 JS 模块手动添加 `@ts-nocheck` 注释

### 4.1. 单个 JS 文件启用检查

::: code-group

```json [tsconfig.json]
{
  "compilerOptions": {
    "allowJs": true, // 允许编译 JS 文件
    "checkJs": false, // 全局不检查 JS 文件
    "noEmit": true // 不生成输出文件
  },
  "include": ["src//*"]
}
```

```js [启用检查]
// src/utils.js
// @ts-check

function multiply(a, b) {
  return a * b
}
```

```js [关闭检查]
// 下面这个文件不会被检查（没有 @ts-check）
// src/helpers.js
function divide(a, b) {
  return a / b // 不会报错
}
```

:::

### 4.2. 全局 JS 文件启用检查

::: code-group

```json [tsconfig.json]
{
  "compilerOptions": {
    "checkJs": true // 全局检查所有 JS 文件
  }
}
```

```js [关闭检查]
// legacy-code.js
// 这时候如果想要让某个文件关闭检查，需要结合 @ts-nocheck 注释命令。
// @ts-nocheck

function oldFunction() {
  // 不进行类型检查
}
```

```js [开启检查]
// new-code.js
// 自动检查（因为 checkJs: true）

function newFunction(x) {
  return x * 2
}
```

:::

## 5. 🤔 `checkJs` 配置的作用是？

- 当启用 `checkJs` 时，JS 文件中的错误将被报告。
- 这相当于在所有项目包含的 JS 文件顶部添加 `// @ts-check` 。

## 6. 🔗 引用

- [TS Handbook - Type Checking JS Files][1]
- [JSDoc Reference][2]
- [VS Code - JS Type Checking][3]

[1]: https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html
[2]: https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
[3]: https://code.visualstudio.com/docs/nodejs/working-with-javascript
