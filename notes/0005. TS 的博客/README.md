# [0005. TS 的博客](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0005.%20TS%20%E7%9A%84%E5%8D%9A%E5%AE%A2)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 微软官方推出的 TypeScript 博客链接是？](#3--微软官方推出的-typescript-博客链接是)
- [4. 🔗 引用](#4--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 记录一些 TS 相关的博客链接

## 2. 🫧 评价

在官方团队维护的博客中，可以帮你快速了解有关 TypeScript 的一些重大事件。

## 3. 🤔 微软官方推出的 TypeScript 博客链接是？

https://devblogs.microsoft.com/typescript/

![图 0](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-07-20-55-34.png)

在这里边儿可以帮你快速了解到一些有关 TS 的重大事件。比如 [A 10x Faster TypeScript][2] 这篇文章就提到了：TS v6、v7 的变革 —— v6 用的是 TypeScript/JavaScript 自己写的编译器，v7 之后的新体系，将迁移为 Go 语言 编译的原生程序，测试结果表示编译速度将提升 10 倍左右。

以下是 AI 的总结：

| 层面 | v6 及之前（旧体系） | v7 及之后（新体系） |
| --- | --- | --- |
| 实现语言 | TypeScript/JavaScript 自己写的编译器 | 迁移为 **Go 语言** 编译的原生程序 |
| 执行环境 | Node.js（解释执行） | 原生可执行（无需 Node，性能更高） |
| 编译性能 | 受限于 JS 单线程与解释执行 | 提升约 **10×**（编译、类型检查、语言服务） |
| 启动速度 | 慢，尤其大型项目 | 启动与增量更新速度显著提升 |
| 内存占用 | 较高 | 约为旧版的一半左右 |
| 发布路线 | TypeScript 6 系列持续维护 | TypeScript 7 将基于 Native Port 发布 |

## 4. 🔗 引用

- [微软官方推出的 TypeScript 博客][1]
- [A 10x Faster TypeScript][2]

[1]: https://devblogs.microsoft.com/typescript/
[2]: https://devblogs.microsoft.com/typescript/typescript-native-port/
