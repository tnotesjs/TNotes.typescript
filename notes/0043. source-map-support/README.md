# [0043. source-map-support](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0043.%20source-map-support)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 node-source-map-support 是什么？](#3--node-source-map-support-是什么)
- [4. 🤔 在使用 ts-node 执行 ts 模块的时候，如何更好地调试并获取 sourcemap 支持？](#4--在使用-ts-node-执行-ts-模块的时候如何更好地调试并获取-sourcemap-支持)
- [5. 🔗 引用](#5--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- node-source-map-support

## 2. 🫧 评价

- todo

## 3. 🤔 node-source-map-support 是什么？

## 4. 🤔 在使用 ts-node 执行 ts 模块的时候，如何更好地调试并获取 sourcemap 支持？

- 启用 source-map 支持以便调试 stack trace：

```bash
npm install --save-dev source-map-support
# 在启动前 require
node -r source-map-support/register -r ts-node/register src/app.ts
# 或通过 ts-node 的 --require 选项
npx ts-node -r source-map-support/register src/app.ts
```

- 在 VS Code 中可创建 launch 配置直接运行 ts-node 或先编译再运行以获得更稳定的调试体验。

## 5. 🔗 引用

- [node-source-map-support github][1]

[1]: https://github.com/evanw/node-source-map-support
