# [0041. nodemon 基本使用](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0041.%20nodemon%20%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 nodemon 是什么？](#3--nodemon-是什么)
- [4. 🤔 nodemon 的实际应用场景主要是？](#4--nodemon-的实际应用场景主要是)
- [5. 🤔 nodemon 如何搭配 ts-node 一起使用？](#5--nodemon-如何搭配-ts-node-一起使用)
- [6. 💻 demos.1 - nodemon 搭配 ts-node 完成自动编译 ts 并运行](#6--demos1---nodemon-搭配-ts-node-完成自动编译-ts-并运行)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- nodemon

## 2. 🫧 评价

- nodemon 全称 Node Monitor，中文翻译为“Node 监视器”，是一个用于监视 Node.js 应用程序运行时对文件系统的修改，并自动重新启动该应用程序的命令行工具。
- 通常我们在搭建 TypeScript 的基础学习环境的时候，会用到这个工具，目的是更便捷地自动执行我们编写的 ts 文件，省去手动执行 `ts-node` 命令的步骤。

## 3. 🤔 nodemon 是什么？

nodemon 的 LOGO 如下：

![图 0](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-18-19-31-17.png)

- `nodemon` 是一个开发工具，用于监视 Node.js 应用程序中的任何更改并自动重启服务器
- 它可以替代 node 命令来运行你的应用，在开发过程中无需手动重启服务器
- 当检测到文件变化时，`nodemon` 会自动重新加载应用程序，提高开发效率
- 主要用于开发环境，不建议在生产环境中使用
- 支持多种文件类型监视，默认监视 `.js`, `.json`, `.ts` 等文件
- 可以通过配置文件或命令行参数进行自定义配置，如忽略某些文件、指定监听的文件类型等

## 4. 🤔 nodemon 的实际应用场景主要是？

当你想要监听某些模块的变更，在模块变更之后自动化一些操作时，就可以考虑考虑 nodemon，这大概率就是 nodemon 的应用场景。

下面是一些相对比较场景的使用场景：

| 应用场景 | 描述 |
| --- | --- |
| 开发环境下的自动重启 | 这是 nodemon 最核心和最常见的用途，大多数 Node.js 开发者都会在开发过程中使用它来避免手动重启服务器 |
| TypeScript 项目开发 | 随着 TypeScript 在 Node.js 开发中的普及，配合 ts-node 使用 nodemon 已成为 TypeScript 项目的标准开发实践（也可以考虑 ts-node-dev） |
| API 接口开发 | 在后端 API 开发中非常常见，特别是 RESTful API 开发，开发者频繁修改路由和控制器逻辑，nodemon 能显著提升开发体验 |
| 学习和实验环境 | 对于初学者和做技术验证时最为常用，能够快速看到代码修改的结果，降低学习门槛 |

## 5. 🤔 nodemon 如何搭配 ts-node 一起使用？

- 安装依赖：`npm install --save-dev nodemon ts-node`
- 在 `package.json` 中添加脚本：

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node index.ts"
  }
}
```

- 或者使用配置文件 `nodemon.json`：

```json
{
  "watch": ["src"],
  "ext": "ts,json",
  "ignore": ["src/**/*.spec.ts"],
  "exec": "ts-node ./src/index.ts"
}
```

- 运行：`npm run dev` 启动开发服务器

这样配置后，当 TypeScript 文件发生变化时，`nodemon` 会自动使用 ts-node 重新编译并运行应用，无需手动重启服务器，大大提高开发效率。

## 6. 💻 demos.1 - nodemon 搭配 ts-node 完成自动编译 ts 并运行

::: code-group

<<< ./demos/1/package.json {8}

<<< ./demos/1/src/index.ts {}

<<< ./demos/1/tsconfig.json {}

:::

最终表现效果就是执行 `pnpm dev` 之后，只要 nodemon 监听到 `./src/index.ts` 文件有变化，就会自动再次执行 `ts-node ./src/index.ts`，省去了我们每次手动执行 `ts-node ./src/index.ts` 的步骤。

![图 1](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-18-19-31-32.png)

## 7. 🔗 引用

- [ts-node-dev github][1]

[1]: https://github.com/wclr/ts-node-dev
