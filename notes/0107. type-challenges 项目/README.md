# [0107. type-challenges 项目](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0107.%20type-challenges%20%E9%A1%B9%E7%9B%AE)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 什么是 type-challenges 项目?](#3-什么是-type-challenges-项目)
- [4. type-challenges 都有哪些难度级别?](#4-type-challenges-都有哪些难度级别)
  - [4.1. 热身题 `Warm Up`](#41-热身题-warm-up)
  - [4.2. 简单题 `Easy`](#42-简单题-easy)
  - [4.3. 中等题 `Medium`](#43-中等题-medium)
  - [4.4. 困难题 `Hard`](#44-困难题-hard)
  - [4.5. 地狱题 `Extreme`](#45-地狱题-extreme)
- [5. 如何在 VSCode 中刷题？](#5-如何在-vscode-中刷题)
- [6. 引用](#6-引用)

<!-- endregion:toc -->

## 1. 本节内容

- type-challenges 项目简介

## 2. 评价

`type-challenges` 是一个通过“闯关”、“刷题”的方式来学习 TypeScript 类型系统的开源项目。目前（25.11）该项目在 GitHub 上获得了超过 47k+ 星标，是目前最受欢迎的 TypeScript 类型系统练习项目。

## 3. 什么是 type-challenges 项目?

type-challenges 是一个收集了各种 TypeScript 类型挑战题目的开源项目，主要特点：

- 通过实际问题学习类型系统
- 题目由易到难，循序渐进
- 支持在线练习和本地开发
- 社区驱动，持续更新
- 提供多语言题目说明

## 4. type-challenges 都有哪些难度级别?

项目按难度分为 5 个级别：

- 热身题 `Warm Up`
- 简单题 `Easy`
- 中等题 `Medium`
- 困难题 `Hard`
- 地狱题 `Extreme`

目前（25.11）的题目列表：

![img](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-16-18-01-55.png)

### 4.1. 热身题 `Warm Up`

- 题目数量：1 题
- 适合人群：TypeScript 初学者
- 主要内容：基础类型操作
- 典型题目：`Hello World`

### 4.2. 简单题 `Easy`

- 题目数量：13 题
- 适合人群：有一定 TypeScript 基础
- 主要内容：基础类型工具、简单映射
- 典型题目：`Pick`、`Readonly`、`First of Array`

### 4.3. 中等题 `Medium`

- 题目数量：100+ 题
- 适合人群：熟悉 TypeScript 类型系统
- 主要内容：复杂映射、条件类型、递归类型
- 典型题目：`DeepReadonly`、`Promise.all`、`Type Lookup`

### 4.4. 困难题 `Hard`

- 题目数量：40+ 题
- 适合人群：精通 TypeScript 类型系统
- 主要内容：高级类型技巧、类型体操
- 典型题目：`Simple Vue`、`Currying`、`Parser`

### 4.5. 地狱题 `Extreme`

- 题目数量：10+ 题
- 适合人群：类型系统专家
- 主要内容：极限类型挑战
- 典型题目：`Query String Parser`、`SQL Parser`

## 5. 如何在 VSCode 中刷题？

安装和项目同名的一款插件 `Type Challenges` 即可。

1. 安装插件
2. 在侧边导航区选择题目，点击 `Take the Challenge` 开始刷题
3. 在指定位置按照要求编写类型代码，写完之后保存，通过之后会导航区会给这题自动打勾，表示概题已经通过，并更新完成进度

::: swiper

![1](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-16-18-07-35.png)

![2.1](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-16-18-07-54.png)

![2.2](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-16-18-08-56.png)

![3.1](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-16-18-08-39.png)

![3.2](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-16-18-10-09.png)

:::

::: tip 💡 其他刷题方式

官方还介绍了其他的刷题方式，比如直接在 TS Playground 中刷题，或者直接在本地刷题，具体的说明可以瞅瞅官方文档。

:::

## 6. 引用

- [type-challenges GitHub 仓库][1]
- [type-challenges 题解网站][2]

[1]: https://github.com/type-challenges/type-challenges
[2]: https://ghaiklor.github.io/type-challenges-solutions/
