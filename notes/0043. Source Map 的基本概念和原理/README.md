# [0043. Source Map 的基本概念和原理](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0043.%20Source%20Map%20%E7%9A%84%E5%9F%BA%E6%9C%AC%E6%A6%82%E5%BF%B5%E5%92%8C%E5%8E%9F%E7%90%86)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 source map 是什么？](#3--source-map-是什么)
- [4. 🤔 source map 的概念最先是由谁提出的？](#4--source-map-的概念最先是由谁提出的)
- [5. 🤔 TypeScript 是如何实现 source map 功能的呢？](#5--typescript-是如何实现-source-map-功能的呢)
- [6. 🤔 谁在读 source map？](#6--谁在读-source-map)
- [7. 🤔 source-map-support 是什么？](#7--source-map-support-是什么)
- [8. 🤔 为什么在介绍 TypeScript 的教程中要提到 source-map-support 呢？](#8--为什么在介绍-typescript-的教程中要提到-source-map-support-呢)
- [9. 🤔 前面提到的 ts-node、ts-node-dev 这些工具的 source map 支持是如何实现的呢？](#9--前面提到的-ts-nodets-node-dev-这些工具的-source-map-支持是如何实现的呢)
- [10. 💻 demos.1 - 开启、关闭 source map 的区别对比](#10--demos1---开启关闭-source-map-的区别对比)
- [11. 🔗 引用](#11--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- source map
- TypeScript 工具链中 source map 的工作原理
- 解决调试时错误定位不准确的实际问题

## 2. 🫧 评价

- 这篇笔记详细介绍了 source map 的概念、TypeScript 及其相关工具（ts-node、ts-node-dev）如何生成和使用 source map 来实现 TypeScript 源码的精准错误定位和调试支持。
- 以 ts 项目开发为例，`source-map-support` 解决的问题是 -> `*.ts` 项目需要先编译再运行，但是运行时跑的是 `*.js`，那么如果出现了错误，如何精确定位到源码 `*.ts` 的报错位置呢？

## 3. 🤔 source map 是什么？

- Source map 是一种映射文件，用于将编译、转换或压缩后的代码位置映射回原始源代码位置
- 它是一个 JSON 格式的文件，包含了编译后代码与原始代码之间的位置对应关系
- 当源代码经过编译器（如 TypeScript 编译器）或打包工具（如 Webpack、Babel）处理后，会生成对应的 source map 文件
- 该文件记录了编译后代码的每一行、每一列与原始源代码文件中对应位置的映射关系
- 浏览器或 Node.js 等运行环境可以通过读取 source map 文件，在调试时显示原始源代码而非编译后的代码
- Source map 文件通常以 `.map` 为扩展名，例如 `app.js.map` 对应 `app.js` 文件
- 它不仅支持 JavaScript，还支持各种编译到 JavaScript 的语言，如 TypeScript、CoffeeScript 等
- Source map 包含了版本信息、源文件列表、编译后文件列表以及位置映射等关键信息
- 在开发阶段启用 source map 可以显著提升调试体验，让开发者能够直接在原始源代码上设置断点和查看错误信息

## 4. 🤔 source map 的概念最先是由谁提出的？

- Source map 的概念最初是由 Mozilla 提出的
- Mozilla 在 2011 年左右开始开发这个概念，主要目的是为了解决调试经过压缩和混淆的 JavaScript 代码的问题
- 最初是为了配合 Firefox 浏览器的开发者工具，使得开发者能够在原始源代码上进行调试，而不是在压缩后的代码上调试
- Mozilla 创建了 source map 规范，并开发了相应的工具来生成和解析 source map 文件
- 这个概念后来被广泛采用，成为了行业标准，被各种浏览器、构建工具和编译器所支持
- 随着前端开发的复杂化，source map 成为了现代 Web 开发中不可或缺的一部分
- 不仅 JavaScript 生态系统采用了 source map，其他编译到 JavaScript 的语言（如 TypeScript、CoffeeScript）也广泛使用 source map 来改善开发体验

## 5. 🤔 TypeScript 是如何实现 source map 功能的呢？

这个问题的回答需要分两个阶段来看。

---

TypeScript 开发环境

- 基于 `source-map-support` 来实现，`source-map-support` 是 TypeScript 内置的一个开发依赖 `devDependencies`。
- TypeScript 编译器本身在开发和测试过程中需要处理各种错误情况，使用 `source-map-support` 来提供更好的调试体验，方便 TypeScript 开发团队进行调试和错误定位

---

TypeScript 生产环境

- TypeScript 编译器本身并不依赖 `source-map-support` 来运行
- TypeScript 开启 sourceMap 选项后生成的 map 文件是 TypeScript 编译器（tsc）本身生成的
- 当在 tsconfig.json 中启用 `"sourceMap": true` 选项后，TypeScript 编译器在将 `.ts` 文件编译为 `.js` 文件的同时，会自动生成对应的 `.js.map` 文件
- 这个过程是 TypeScript 编译器内置的功能，不需要依赖外部库来完成
- TypeScript 编译器内部实现了 source map 格式的生成逻辑，遵循标准的 source map 规范
  - 核心逻辑参考：`src/compiler/sourcemap.ts` 模块中的 `createSourceMapGenerator` 的实现。
- 生成的 `.map` 文件包含了编译后代码与原始 TypeScript 代码之间的位置映射关系
- 每个编译输出的 JavaScript 文件都会对应生成一个 source map 文件（除非另有配置）
- TypeScript 编译器负责的是 source map 的生成，而不负责 source map 的解析
- 生成的 source map 文件格式符合 Mozilla 提出的 source map 标准规范
- 编译器会根据代码转换的复杂程度，在 source map 中记录详细的映射信息，确保准确的定位能力

## 6. 🤔 谁在读 source map？

| 读者 | 用途 |
| --- | --- |
| 浏览器开发者工具 | 现代浏览器（如 Chrome、Firefox、Edge）的开发者工具会自动读取和解析 source map，以便在调试时显示原始源代码而不是编译后的代码 |
| Node.js 运行时 | 通过 source-map-support 等模块，Node.js 可以在运行时读取 source map 文件，将错误堆栈信息映射回原始源代码位置 |
| 调试器 | 各种 IDE 和编辑器（如 VS Code、WebStorm）的调试器会读取 source map 来支持断点调试和变量检查 |
| 错误监控服务 | 像 Sentry、Bugsnag 这样的错误监控平台会读取 source map 来将生产环境中的错误堆栈映射回原始源代码位置 |
| 构建工具 | Webpack、Rollup、Vite 等构建工具在开发模式下会生成和读取 source map，以提供更好的开发体验 |
| 编译器 | TypeScript 编译器、Babel 等工具在生成编译后代码的同时也会生成对应的 source map 文件 |
| 测试框架 | Jest、Mocha 等测试框架在显示测试失败信息时会利用 source map 定位到原始源代码位置 |
| 性能分析工具 | Chrome DevTools 的 Performance 面板等性能分析工具会使用 source map 来显示准确的函数调用栈信息 |

## 7. 🤔 source-map-support 是什么？

来自 [node-source-map-support][1] 官方的介绍：

This module provides source map support for stack traces in node via the V8 stack trace API. It uses the source-map module to replace the paths and line numbers of source-mapped files with their original paths and line numbers. The output mimics node's stack trace format with the goal of making every compile-to-JS language more of a first-class citizen. Source maps are completely general (not specific to any one language) so you can use source maps with multiple compile-to-JS languages in the same node process.

该模块通过 V8 堆栈跟踪 API 为 Node.js 中的堆栈跟踪提供 source map 支持。它使用 source-map 模块将经过 source map 映射的文件的路径和行号替换为它们的原始路径和行号。输出模仿 Node.js 的堆栈跟踪格式，目标是让每种编译到 JavaScript 的语言都成为更"一等公民"。Source maps 是完全通用的（不特定于任何一种语言），因此你可以在同一个 Node.js 进程中对多种编译到 JavaScript 的语言使用 source maps。

---

- `source-map-support` 是一个 Node.js 模块，用于在运行时启用 source map 支持
- 它可以让 Node.js 在抛出错误或显示堆栈跟踪（stack trace）时，显示原始源代码的位置而不是编译后代码的位置
- 主要用于调试经过转换或编译的 JavaScript 代码，例如 TypeScript、CoffeeScript 或经过压缩混淆的代码
- 通过解析 source map 文件，将编译后的代码位置映射回原始源代码位置
- 支持各种构建工具生成的 source map，包括 Webpack、Babel、TypeScript 编译器等
- 可以作为全局 hook 注入到 Node.js 运行时中，自动处理所有的堆栈跟踪信息
- 提供了命令行接口和编程接口两种使用方式
- 在开发和调试阶段非常有用，能显著提升调试体验和问题定位效率
- 特别是在 TypeScript 项目中，能够让开发者直接看到 TypeScript 源文件中的错误位置而非编译后的 JavaScript 代码位置

## 8. 🤔 为什么在介绍 TypeScript 的教程中要提到 source-map-support 呢？

- TypeScript 代码需要编译成 JavaScript 才能在 Node.js 环境中运行，这个编译过程会产生源代码和编译后代码的差异
- 当 TypeScript 代码出现错误时，如果没有 source map 支持，错误堆栈会指向编译后的 JavaScript 代码位置，而不是原始的 TypeScript 代码位置
- source-map-support 能够让错误堆栈信息映射回原始的 TypeScript 源代码，使开发者能够准确定位问题所在
- 在 TypeScript 开发过程中，良好的调试体验是非常重要的，source-map-support 提供了这种关键的支持
- 特别是在使用 ts-node 直接运行 TypeScript 代码时，source-map-support 能够显著提升开发和调试效率
- 大多数 TypeScript 教程都希望给学习者提供完整的开发体验，包括调试支持，因此会介绍 source-map-support
- 它解决了 TypeScript 开发中的一个核心痛点：如何在保持高效开发的同时获得准确的错误定位
- 对于初学者来说，能够直接看到 TypeScript 源码中的错误位置比看到编译后的 JavaScript 代码更容易理解和排查问题
- source-map-support 是 TypeScript 生态系统中常用的辅助工具，了解它的使用有助于构建完整的 TypeScript 开发环境

## 9. 🤔 前面提到的 ts-node、ts-node-dev 这些工具的 source map 支持是如何实现的呢？

- 如果你仔细观察过使用 `ts-node` 或者 `ts-node-dev` 运行的 TS 模块报错信息，会发现它们也是直接将错误定位到对应的 TS 模块的。
- 那么，它们是如何实现 source map 支持的呢？
- 以 `ts-node` 为例，在 `src/configuration.ts` 中可以看到这么一段代码：

```ts
/**
 * TypeScript compiler option values required by `ts-node` which cannot be overridden.
 */
const TS_NODE_COMPILER_OPTIONS = {
  sourceMap: true,
  inlineSourceMap: false,
  inlineSources: true,
  declaration: false,
  noEmit: false,
  outDir: '.ts-node',
}

// ...

// Merge compilerOptions from all sources
config.compilerOptions = Object.assign(
  {},
  // automatically-applied options from @tsconfig/bases
  defaultCompilerOptionsForNodeVersion,
  // tsconfig.json "compilerOptions"
  config.compilerOptions,
  // from env var
  DEFAULTS.compilerOptions,
  // tsconfig.json "ts-node": "compilerOptions"
  tsNodeOptionsFromTsconfig.compilerOptions,
  // passed programmatically
  rawApiOptions.compilerOptions,
  // overrides required by ts-node, cannot be changed
  TS_NODE_COMPILER_OPTIONS
)
```

- 翻译翻译就是 `ts-node` 强制帮我们开启了 `source map`，你想关也关不掉。
- TS 配置的解析，那自然就是 tsc 的活儿了，后续的流程也就跟 TS 的 source map 原理一样了。
- `ts-node-dev` 当然也支持 `source map`，那是因为它依赖 `ts-node`，处理逻辑就是上面这段强制开启 `sourceMap` 的逻辑。

## 10. 💻 demos.1 - 开启、关闭 source map 的区别对比

- 这个 demo 主要是用来体验 source map 的作用的。

::: code-group

<<< ./demos/1/src/index.ts {4}

<<< ./demos/1/package.json {7-12}

<<< ./demos/1/README.md

:::

- 有关该 demo 的更多描述，可以参考 `README.md` 文件。（通过 github 打开这节笔记，预览效果更好）

::: swiper

![1](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-18-23-45-39.png)

![2](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-18-23-45-57.png)

![3](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-18-23-46-13.png)

:::

- 1 `无 map` 报错位置 `dist/index.js`
- 2 `有 map` 错误位置 `src/index.ts`
- 3 `ts-node-dev` 错误位置 `src/index.ts`
  - 因为 `ts-node-dev` 也安装了 `source-map-support` 依赖，并启用了 source map。

## 11. 🔗 引用

- [node-source-map-support github][1]

[1]: https://github.com/evanw/node-source-map-support
