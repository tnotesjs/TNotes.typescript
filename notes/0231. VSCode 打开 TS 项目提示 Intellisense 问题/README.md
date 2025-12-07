# [0231. VSCode 打开 TS 项目提示 Intellisense 问题](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0231.%20VSCode%20%E6%89%93%E5%BC%80%20TS%20%E9%A1%B9%E7%9B%AE%E6%8F%90%E7%A4%BA%20Intellisense%20%E9%97%AE%E9%A2%98)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 该问题的具体行为表现是？](#3--该问题的具体行为表现是)
- [4. 🤔 如何解决 TS 语言服务一直卡在 Intellisense 阶段的问题？](#4--如何解决-ts-语言服务一直卡在-intellisense-阶段的问题)
  - [4.1. 插件问题](#41-插件问题)
  - [4.2. copilot 聊天记录问题](#42-copilot-聊天记录问题)
- [5. 🔗 引用](#5--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- VSCode 中的一个 TS 服务问题

## 2. 🫧 评价

记录一个在 VSCode 中打开 TS 项目时，TS 服务长时间卡死在 Intellisense 阶段的问题。

最终在删除 vue 插件并清空 copilot 聊天记录后，问题得以解决。

## 3. 🤔 该问题的具体行为表现是？

具体行为是打开一个 TS 项目时，VSCode 的 TS 语言服务一直提示正在加载中（可以在底部的状态栏中查看语言服务的加载状态），规模不大的项目，也需要加载几十秒甚至几分钟。

并且在项目开发过程中，TS 服务经常会异常或者直接挂掉（比如快速跳转到引用等功能突然失效），需要不断重启 TS 服务来解决。

这个问题会导致 TS 项目的开发体验极差，如果语言服务废了，TS 基本也就没啥价值了，还不如直接上 JS。

## 4. 🤔 如何解决 TS 语言服务一直卡在 Intellisense 阶段的问题？

可能是以下原因导致的，可以挨个尝试：

### 4.1. 插件问题

![img](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-12-07-10-01-24.png)

可以将 vue 相关的插件给禁用或删除后，重启 VSCode 试试。

### 4.2. copilot 聊天记录问题

![img](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-12-07-10-07-52.png)

可以禁用 copilot 插件或者将 copilot 的历史聊天记录都清空，再重启 VSCode 试试。

## 5. 🔗 引用

- [stackoverflow - VS Code Intellisense loading forever in typescript project][1]
- [typescript 一直提示：正在加载 IntelliSense 状态 #206758][2]

[1]: https://stackoverflow.com/questions/79187742/vs-code-intellisense-loading-forever-in-typescript-project
[2]: https://github.com/microsoft/vscode/issues/206758
