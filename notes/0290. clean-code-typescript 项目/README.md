# [0290. clean-code-typescript 项目](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0290.%20clean-code-typescript%20%E9%A1%B9%E7%9B%AE)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是 clean-code-typescript 项目?](#3--什么是-clean-code-typescript-项目)
- [4. 🤔 clean-code-typescript 都涵盖了哪些内容?](#4--clean-code-typescript-都涵盖了哪些内容)
  - [4.1. 变量](#41-变量)
  - [4.2. 函数](#42-函数)
  - [4.3. 对象和数据结构](#43-对象和数据结构)
  - [4.4. 类](#44-类)
  - [4.5. 测试](#45-测试)
  - [4.6. 并发](#46-并发)
  - [4.7. 错误处理](#47-错误处理)
  - [4.8. 格式化](#48-格式化)
  - [4.9. 注释](#49-注释)
- [5. 🔗 引用](#5--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- clean-code-typescript 项目简介

## 2. 🫧 评价

`clean-code-typescript` 是受《代码整洁之道》启发的 TypeScript 代码规范指南，专注于教授如何编写清晰、可维护的 TypeScript 代码。

该项目目前（25.11）在 GitHub 上获得了 9k+ 星标，通过大量实际代码示例对比展示好的和坏的编程实践，是学习 TypeScript 编码规范的优质参考资料。

## 3. 🤔 什么是 clean-code-typescript 项目?

clean-code-typescript 是一个开源的 TypeScript 代码规范指南项目，主要特点：

- 基于《代码整洁之道》的理念
- 通过对比示例展示最佳实践
- 涵盖变量、函数、类、错误处理等多个方面
- 社区驱动，持续更新
- 提供多语言版本

项目访问方式：

- GitHub 仓库：https://github.com/labs42io/clean-code-typescript
- 在线阅读：通过 GitHub README 直接查看
  - 项目就一个分支，4 个文件，所有核心内容都记录在了 README.md 文件中。
  - ![img](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-16-17-41-39.png)
  - 在文档的底部，提供了不同的语言版本：
  - ![img](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-16-17-43-09.png)

## 4. 🤔 clean-code-typescript 都涵盖了哪些内容?

主要内容模块：

### 4.1. 变量

- 使用有意义的变量名
- 使用可搜索的名称
- 使用解释性变量
- 避免隐式类型转换
- 不要添加不必要的上下文

### 4.2. 函数

- 函数参数控制
- 函数单一职责
- 函数名应该说明做什么
- 函数应该只做一层抽象
- 移除重复代码
- 使用默认参数
- 避免副作用

### 4.3. 对象和数据结构

- 使用 getter 和 setter
- 对象应该有私有成员
- 使用方法链
- 组合优于继承

### 4.4. 类

- 类应该小而专注
- 单一职责原则
- 开闭原则
- 里氏替换原则
- 接口隔离原则
- 依赖倒置原则

### 4.5. 测试

- 每个测试一个概念
- 测试名称要有意义
- 使用 AAA 模式

### 4.6. 并发

- Promise 优于回调
- async/await 优于 Promise
- 错误处理

### 4.7. 错误处理

- 不要忽略捕获的错误
- 不要忽略被拒绝的 Promise
- 使用类型安全的错误处理

### 4.8. 格式化

- 使用一致的大小写
- 函数调用者和被调用者应该靠近
- 保持一致的格式

### 4.9. 注释

- 只注释业务逻辑复杂的地方
- 不要在代码库中保留注释掉的代码
- 不要有日志式的注释
- 避免位置标记

## 5. 🔗 引用

- [clean-code-typescript GitHub 仓库][1]
- [《代码整洁之道》原书][2]
- [TypeScript ESLint 配置][3]

[1]: https://github.com/labs42io/clean-code-typescript
[2]: https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882
[3]: https://typescript-eslint.io/
