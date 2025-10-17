# [0042. ts-node-dev 基本使用](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0042.%20ts-node-dev%20%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 ts-node-dev 是什么？](#3--ts-node-dev-是什么)
- [4. 🤔 ts-node-dev 跟 ts-node 之间的关系是？](#4--ts-node-dev-跟-ts-node-之间的关系是)
- [5. 🤔 ts-node-dev 如何使用？](#5--ts-node-dev-如何使用)
- [6. 🤔 开发时监听与重启（ts-node-dev / nodemon）](#6--开发时监听与重启ts-node-dev--nodemon)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- ts-node-dev

## 2. 🫧 评价

- todo

## 3. 🤔 ts-node-dev 是什么？

## 4. 🤔 ts-node-dev 跟 ts-node 之间的关系是？

## 5. 🤔 ts-node-dev 如何使用？

## 6. 🤔 开发时监听与重启（ts-node-dev / nodemon）

- 推荐使用专门的工具实现文件变更自动重启：
- ts-node-dev（内置快速重启与缓存）：

```bash
npm install --save-dev ts-node-dev
npx ts-node-dev --respawn --transpile-only src/server.ts
```

- nodemon 配合 ts-node：

```bash
npx nodemon --watch 'src/**/*.ts' --exec 'npx ts-node --transpile-only' src/server.ts
```

## 7. 🔗 引用

- [nodemon github][1]

[1]: https://github.com/remy/nodemon
