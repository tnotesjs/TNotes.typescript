# [0042. ts-node-dev 快速入门](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0042.%20ts-node-dev%20%E5%BF%AB%E9%80%9F%E5%85%A5%E9%97%A8)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 `ts-node-dev` 是什么？](#3--ts-node-dev-是什么)
- [4. 🤔 `ts-node-dev` 跟 `ts-node` 之间的关系是？](#4--ts-node-dev-跟-ts-node-之间的关系是)
- [5. 🤔 ts-node-dev 如何使用？](#5--ts-node-dev-如何使用)
- [6. 💻 demos.1 - 体验 ts-node-dev](#6--demos1---体验-ts-node-dev)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- `ts-node-dev`

## 2. 🫧 评价

- 从使用体验上看，`ts-node-dev` 类似于 `ts-node` + `nodemon`。
- `ts-node-dev` 也是一个非常适合用来自动执行 `*.ts` 模块的工具，做好简单的配置后，我们只管去写 `*.ts` 模块的小 demo 即可。
- 学习阶段用 「`ts-node-dev` 方案」 或者 「`ts-node` + `nodemon` 方案」 来自动执行 `*.ts` 模块都可以。性能优化啥的，对学习 `*.ts` 语法阶段，影响不大，写的 demo 基本都没几行代码，看不出啥明显区别。

## 3. 🤔 `ts-node-dev` 是什么？

- `ts-node-dev` 是一个专门为 TypeScript 开发设计的开发工具，用于监听文件变化并自动重启应用
- 它结合了 `ts-node` 和 `node-dev` 的功能，专门针对 TypeScript 项目进行了优化
- 当检测到 `.ts` 或 `.tsx` 文件发生变化时，会自动重新编译和运行应用程序
- 相比于 `nodemon` 配合 `ts-node` 的方案，`ts-node-dev` 提供了更好的性能和更快的重启速度
- 内置了编译缓存机制，只重新编译发生变化的文件，提高开发效率
- 支持 source map，便于调试 TypeScript 代码
- 主要用于开发环境，能够显著提升 TypeScript 项目的开发体验
- 提供了诸如 `--respawn`、`--transpile-only` 等专门针对开发场景的选项
- 可以监听特定目录或文件，并支持忽略某些文件或目录的变化

## 4. 🤔 `ts-node-dev` 跟 `ts-node` 之间的关系是？

- `ts-node-dev` 是基于 `ts-node` 构建的开发工具，可以看作是 `ts-node` 的增强版
- `ts-node` 是一个运行时编译和执行 TypeScript 文件的工具，可以直接运行 `.ts` 文件而无需预先编译
- `ts-node-dev` 在 `ts-node` 的基础上增加了文件监听和自动重启功能，专门用于开发环境
- 两者都支持 TypeScript 的实时编译执行，但 `ts-node-dev` 针对开发场景进行了优化
- `ts-node` 本身不提供监听功能，而 `ts-node-dev` 内置了文件变化监听机制
- `ts-node-dev` 提供了更好的缓存机制和更快的重启速度，适合频繁修改代码的开发场景
- 在功能上，`ts-node-dev` 包含了 `ts-node` 的所有功能，并额外提供了开发时的便利特性
- 使用 `ts-node` 时通常需要配合 nodemon 等工具实现自动重启，而 `ts-node-dev` 将这些功能集成在一起

## 5. 🤔 ts-node-dev 如何使用？

- 安装依赖：`npm install --save-dev ts-node-dev`
- 在 `package.json` 中添加开发脚本：

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts"
  }
}
```

- 或者直接通过 npx 运行：`npx ts-node-dev --respawn --transpile-only src/index.ts`
- 常用参数说明：
  - `--respawn`：监听子进程崩溃并重新启动
  - `--transpile-only`：只进行转译而不进行类型检查，提高编译速度
  - `--watch`：指定需要监听的目录或文件
  - `--ignore`：指定不需要监听的目录或文件
  - `--exit-child`：确保子进程在重启前正确退出
- 运行开发服务器：`npm run dev`
- 当 TypeScript 文件发生变化时，`ts-node-dev` 会自动重新编译并重启应用
- 支持 source map，可以在浏览器或调试工具中直接调试 TypeScript 源码
- 适用于各种 TypeScript 项目，包括 Node.js 应用、CLI 工具等

## 6. 💻 demos.1 - 体验 ts-node-dev

::: code-group

<<< ./demos/1/package.json {8}

<<< ./demos/1/src/index.ts {}

<<< ./demos/1/tsconfig.json {}

:::

最终表现效果跟 ts-node + nodemon 的效果类似，就是执行 `pnpm dev` 之后，只要 `ts-node-dev` 监听到 `./src/index.ts` 文件有变化，就会自动再次执行 `./src/index.ts` 模块。

![图 0](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-18-19-51-57.png)

## 7. 🔗 引用

- [ts-node-dev github][1]

[1]: https://github.com/wclr/ts-node-dev
