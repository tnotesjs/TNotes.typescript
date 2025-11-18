# typescript

## 📖 关于本文档

本文档是 TypeScript 知识库的目录结构，系统地整理了 TypeScript 学习所需的各类知识点。

### 文档内容概览

这篇文档涵盖了以下 TypeScript 学习主题：

- **学习资料**：收录了官方文档、优质教程、开源项目等学习资源
- **TS 简介**：介绍 TypeScript 的基本概念、发展历史和应用场景
- **学前准备**：包含编译工具、配置文件等基础知识
- **类型系统**：
  - 顶层类型和底层类型（`any`、`unknown`、`never`、`void`）
  - 基础类型（`boolean`、`string`、`number`、`bigint`、`symbol` 等）
  - 复合类型（数组、元组、函数、对象、接口、类）
  - 高级类型（泛型、枚举、类型断言）
- **模块系统**：ES 模块、CommonJS、命名空间等
- **装饰器**：新旧装饰器语法及应用
- **类型声明**：`declare` 关键字、`.d.ts` 文件
- **类型运算**：类型运算符、类型映射、类型工具
- **配置与命令**：`tsconfig.json` 配置、`tsc` 命令使用
- **实战技巧**：常见错误处理、类型守卫、框架集成等
- **深入原理**：编译流程、类型检查、AST 等底层实现
- **进阶话题**：类型体操、性能优化、大型项目组织

### 文档结构说明

- 每个主题下包含多篇独立的笔记文章
- `- [x]` 表示已完成的笔记，`- [ ]` 表示待完成的笔记
- 每篇笔记都有对应的 GitHub 链接，可直接访问详细内容

<!-- region:toc -->

- [1. 学习资料](#1-学习资料)
- [2. TS 简介](#2-ts-简介)
- [3. 学前准备](#3-学前准备)
- [4. 顶层类型和底层类型](#4-顶层类型和底层类型)
- [5. 类型系统基础知识](#5-类型系统基础知识)
- [6. 类型兼容性](#6-类型兼容性)
- [7. 数组类型](#7-数组类型)
- [8. 元组类型](#8-元组类型)
- [9. 函数类型](#9-函数类型)
- [10. 对象类型](#10-对象类型)
- [11. 接口类型](#11-接口类型)
- [12. Class 类型](#12-class-类型)
- [13. 泛型](#13-泛型)
- [14. Enum 类型](#14-enum-类型)
- [15. 类型断言](#15-类型断言)
- [16. 模块](#16-模块)
- [17. namespace](#17-namespace)
- [18. 装饰器](#18-装饰器)
- [19. 装饰器（旧语法）](#19-装饰器旧语法)
- [20. declare 关键字](#20-declare-关键字)
- [21. d.ts 类型声明文件](#21-dts-类型声明文件)
- [22. 类型运算符](#22-类型运算符)
- [23. 类型映射](#23-类型映射)
- [24. 类型工具](#24-类型工具)
- [25. 注释指令](#25-注释指令)
- [26. tsconfig.json 文件](#26-tsconfigjson-文件)
- [27. tsc 命令](#27-tsc-命令)
- [28. 实战技巧](#28-实战技巧)
- [29. 深入原理](#29-深入原理)
- [30. 进阶话题](#30-进阶话题)
- [31. TS 7.0](#31-ts-70)
- [xxx](#xxx)

<!-- endregion:toc -->

## 1. 学习资料

- [x] [0286. 学习资料](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0286.%20%E5%AD%A6%E4%B9%A0%E8%B5%84%E6%96%99/README.md)
- [x] [0002. TypeScript（阮一峰）](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0002.%20TypeScript%EF%BC%88%E9%98%AE%E4%B8%80%E5%B3%B0%EF%BC%89/README.md)
- [x] [0289. typescript-book 项目](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0289.%20typescript-book%20%E9%A1%B9%E7%9B%AE/README.md)
- [x] [0290. clean-code-typescript 项目](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0290.%20clean-code-typescript%20%E9%A1%B9%E7%9B%AE/README.md)
- [x] [0107. type-challenges 项目](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0107.%20type-challenges%20%E9%A1%B9%E7%9B%AE/README.md)
- [x] [0054. 术语表](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0054.%20%E6%9C%AF%E8%AF%AD%E8%A1%A8/README.md)
- [x] [0039. roadmap](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0039.%20roadmap/README.md)
- [x] [0073. TS 官方文档](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0073.%20TS%20%E5%AE%98%E6%96%B9%E6%96%87%E6%A1%A3/README.md)
- [x] [0074. TS Github 仓库](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0074.%20TS%20Github%20%E4%BB%93%E5%BA%93/README.md)
- [x] [0017. 特殊类型之间的兼容性](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0017.%20%E7%89%B9%E6%AE%8A%E7%B1%BB%E5%9E%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%85%BC%E5%AE%B9%E6%80%A7/README.md)
- [x] [0285. TS 错误码](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0285.%20TS%20%E9%94%99%E8%AF%AF%E7%A0%81/README.md)
- [x] [0075. DefinitelyTyped 项目](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0075.%20DefinitelyTyped%20%E9%A1%B9%E7%9B%AE/README.md)

## 2. TS 简介

- [x] [0008. TS 简介](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0008.%20TS%20%E7%AE%80%E4%BB%8B/README.md)
- [x] [0001. TS 是什么](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0001.%20TS%20%E6%98%AF%E4%BB%80%E4%B9%88/README.md)
- [x] [0003. TS 的发展简史](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0003.%20TS%20%E7%9A%84%E5%8F%91%E5%B1%95%E7%AE%80%E5%8F%B2/README.md)
- [x] [0005. TS 的博客](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0005.%20TS%20%E7%9A%84%E5%8D%9A%E5%AE%A2/README.md)
- [x] [0006. 面向对象的思维方式](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0006.%20%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%80%9D%E7%BB%B4%E6%96%B9%E5%BC%8F/README.md)
- [x] [0007. 动态类型 vs. 静态类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0007.%20%E5%8A%A8%E6%80%81%E7%B1%BB%E5%9E%8B%20vs.%20%E9%9D%99%E6%80%81%E7%B1%BB%E5%9E%8B/README.md)
- [x] [0076. TS 的优势与劣势](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0076.%20TS%20%E7%9A%84%E4%BC%98%E5%8A%BF%E4%B8%8E%E5%8A%A3%E5%8A%BF/README.md)
- [x] [0077. TS 在前、后端领域的应用](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0077.%20TS%20%E5%9C%A8%E5%89%8D%E3%80%81%E5%90%8E%E7%AB%AF%E9%A2%86%E5%9F%9F%E7%9A%84%E5%BA%94%E7%94%A8/README.md)

## 3. 学前准备

- [x] [0044. 学前准备](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0044.%20%E5%AD%A6%E5%89%8D%E5%87%86%E5%A4%87/README.md)
- [x] [0004. 类型 vs. 值](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0004.%20%E7%B1%BB%E5%9E%8B%20vs.%20%E5%80%BC/README.md)
- [x] [0009. 类型声明和类型推断](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0009.%20%E7%B1%BB%E5%9E%8B%E5%A3%B0%E6%98%8E%E5%92%8C%E7%B1%BB%E5%9E%8B%E6%8E%A8%E6%96%AD/README.md)
- [x] [0010. TS 的编译](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0010.%20TS%20%E7%9A%84%E7%BC%96%E8%AF%91/README.md)
- [x] [0011. TS Playground](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0011.%20TS%20Playground/README.md)
- [x] [0012. tsc 快速入门](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0012.%20tsc%20%E5%BF%AB%E9%80%9F%E5%85%A5%E9%97%A8/README.md)
- [x] [0078. tsconfig.json 快速入门](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0078.%20tsconfig.json%20%E5%BF%AB%E9%80%9F%E5%85%A5%E9%97%A8/README.md)
- [x] [0013. ts-node 快速入门](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0013.%20ts-node%20%E5%BF%AB%E9%80%9F%E5%85%A5%E9%97%A8/README.md)
- [x] [0041. nodemon 快速入门](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0041.%20nodemon%20%E5%BF%AB%E9%80%9F%E5%85%A5%E9%97%A8/README.md)
- [x] [0042. ts-node-dev 快速入门](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0042.%20ts-node-dev%20%E5%BF%AB%E9%80%9F%E5%85%A5%E9%97%A8/README.md)

## 4. 顶层类型和底层类型

- [x] [0046. 顶层类型和底层类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0046.%20%E9%A1%B6%E5%B1%82%E7%B1%BB%E5%9E%8B%E5%92%8C%E5%BA%95%E5%B1%82%E7%B1%BB%E5%9E%8B/README.md)
- [x] [0014. any 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0014.%20any%20%E7%B1%BB%E5%9E%8B/README.md)
- [x] [0015. unknown 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0015.%20unknown%20%E7%B1%BB%E5%9E%8B/README.md)
- [x] [0016. never 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0016.%20never%20%E7%B1%BB%E5%9E%8B/README.md)
- [x] [0079. void 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0079.%20void%20%E7%B1%BB%E5%9E%8B/README.md)
- [x] [0017. 特殊类型之间的兼容性](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0017.%20%E7%89%B9%E6%AE%8A%E7%B1%BB%E5%9E%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%85%BC%E5%AE%B9%E6%80%A7/README.md)

## 5. 类型系统基础知识

- [x] [0287. 类型系统基础知识](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0287.%20%E7%B1%BB%E5%9E%8B%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86/README.md)
- [x] [0018. boolean 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0018.%20boolean%20%E7%B1%BB%E5%9E%8B/README.md)
- [x] [0019. string 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0019.%20string%20%E7%B1%BB%E5%9E%8B/README.md)
- [x] [0020. number 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0020.%20number%20%E7%B1%BB%E5%9E%8B/README.md)
- [x] [0021. bigint 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0021.%20bigint%20%E7%B1%BB%E5%9E%8B/README.md)
- [x] [0022. symbol 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0022.%20symbol%20%E7%B1%BB%E5%9E%8B/README.md)
- [x] [0023. object 类型和 Object 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0023.%20object%20%E7%B1%BB%E5%9E%8B%E5%92%8C%20Object%20%E7%B1%BB%E5%9E%8B/README.md)
- [x] [0024. undefined 类型和 null 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0024.%20undefined%20%E7%B1%BB%E5%9E%8B%E5%92%8C%20null%20%E7%B1%BB%E5%9E%8B/README.md)
- [x] [0047. 包装对象类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0047.%20%E5%8C%85%E8%A3%85%E5%AF%B9%E8%B1%A1%E7%B1%BB%E5%9E%8B/README.md)
- [x] [0025. 字面量类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0025.%20%E5%AD%97%E9%9D%A2%E9%87%8F%E7%B1%BB%E5%9E%8B/README.md)
- [x] [0026. 联合类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0026.%20%E8%81%94%E5%90%88%E7%B1%BB%E5%9E%8B/README.md)
- [x] [0027. 交叉类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0027.%20%E4%BA%A4%E5%8F%89%E7%B1%BB%E5%9E%8B/README.md)
- [x] [0028. type 关键字](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0028.%20type%20%E5%85%B3%E9%94%AE%E5%AD%97/README.md)
- [x] [0029. typeof 运算符](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0029.%20typeof%20%E8%BF%90%E7%AE%97%E7%AC%A6/README.md)
- [x] [0030. 类型作用域](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0030.%20%E7%B1%BB%E5%9E%8B%E4%BD%9C%E7%94%A8%E5%9F%9F/README.md)

## 6. 类型兼容性

- [x] [0031. 类型兼容性](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0031.%20%E7%B1%BB%E5%9E%8B%E5%85%BC%E5%AE%B9%E6%80%A7/README.md)
- [x] [0067. 结构子类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0067.%20%E7%BB%93%E6%9E%84%E5%AD%90%E7%B1%BB%E5%9E%8B/README.md)
- [x] [0072. 类型的父子关系](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0072.%20%E7%B1%BB%E5%9E%8B%E7%9A%84%E7%88%B6%E5%AD%90%E5%85%B3%E7%B3%BB/README.md)
- [x] [0068. 对象类型的兼容性规则](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0068.%20%E5%AF%B9%E8%B1%A1%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%85%BC%E5%AE%B9%E6%80%A7%E8%A7%84%E5%88%99/README.md)
- [x] [0069. 函数类型的兼容性规则](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0069.%20%E5%87%BD%E6%95%B0%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%85%BC%E5%AE%B9%E6%80%A7%E8%A7%84%E5%88%99/README.md)
- [x] [0071. 类类型的兼容性规则](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0071.%20%E7%B1%BB%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%85%BC%E5%AE%B9%E6%80%A7%E8%A7%84%E5%88%99/README.md)
- [ ] [0070. 泛型类型的兼容性规则](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0070.%20%E6%B3%9B%E5%9E%8B%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%85%BC%E5%AE%B9%E6%80%A7%E8%A7%84%E5%88%99/README.md)
- [x] [0017. 特殊类型之间的兼容性](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0017.%20%E7%89%B9%E6%AE%8A%E7%B1%BB%E5%9E%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%85%BC%E5%AE%B9%E6%80%A7/README.md)
- [ ] [0080. 协变与逆变](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0080.%20%E5%8D%8F%E5%8F%98%E4%B8%8E%E9%80%86%E5%8F%98/README.md)
- [ ] [0081. 双向协变问题](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0081.%20%E5%8F%8C%E5%90%91%E5%8D%8F%E5%8F%98%E9%97%AE%E9%A2%98/README.md)

## 7. 数组类型

- [x] [0032. 数组类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0032.%20%E6%95%B0%E7%BB%84%E7%B1%BB%E5%9E%8B/README.md)
- [x] [0082. 数组的两种类型声明方式](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0082.%20%E6%95%B0%E7%BB%84%E7%9A%84%E4%B8%A4%E7%A7%8D%E7%B1%BB%E5%9E%8B%E5%A3%B0%E6%98%8E%E6%96%B9%E5%BC%8F/README.md)
- [x] [0083. 只读数组 ReadonlyArray](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0083.%20%E5%8F%AA%E8%AF%BB%E6%95%B0%E7%BB%84%20ReadonlyArray/README.md)
- [x] [0288. readonly 数组在函数参数中的兼容性差异分析](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0288.%20readonly%20%E6%95%B0%E7%BB%84%E5%9C%A8%E5%87%BD%E6%95%B0%E5%8F%82%E6%95%B0%E4%B8%AD%E7%9A%84%E5%85%BC%E5%AE%B9%E6%80%A7%E5%B7%AE%E5%BC%82%E5%88%86%E6%9E%90/README.md)
- [x] [0084. 数组的类型推断](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0084.%20%E6%95%B0%E7%BB%84%E7%9A%84%E7%B1%BB%E5%9E%8B%E6%8E%A8%E6%96%AD/README.md)
- [x] [0085. 多维数组](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0085.%20%E5%A4%9A%E7%BB%B4%E6%95%B0%E7%BB%84/README.md)

## 8. 元组类型

- [x] [0036. 元组类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0036.%20%E5%85%83%E7%BB%84%E7%B1%BB%E5%9E%8B/README.md)
- [x] [0086. 元组可选元素](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0086.%20%E5%85%83%E7%BB%84%E5%8F%AF%E9%80%89%E5%85%83%E7%B4%A0/README.md)
- [x] [0087. 元组剩余元素](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0087.%20%E5%85%83%E7%BB%84%E5%89%A9%E4%BD%99%E5%85%83%E7%B4%A0/README.md)
- [x] [0088. 元组只读元素](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0088.%20%E5%85%83%E7%BB%84%E5%8F%AA%E8%AF%BB%E5%85%83%E7%B4%A0/README.md)
- [x] [0089. 具名元组](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0089.%20%E5%85%B7%E5%90%8D%E5%85%83%E7%BB%84/README.md)
- [x] [0090. 元组 vs. 数组](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0090.%20%E5%85%83%E7%BB%84%20vs.%20%E6%95%B0%E7%BB%84/README.md)

## 9. 函数类型

- [x] [0034. 函数类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0034.%20%E5%87%BD%E6%95%B0%E7%B1%BB%E5%9E%8B/README.md)
- [x] [0091. 函数表达式类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0091.%20%E5%87%BD%E6%95%B0%E8%A1%A8%E8%BE%BE%E5%BC%8F%E7%B1%BB%E5%9E%8B/README.md)
- [x] [0092. 可选参数与默认参数](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0092.%20%E5%8F%AF%E9%80%89%E5%8F%82%E6%95%B0%E4%B8%8E%E9%BB%98%E8%AE%A4%E5%8F%82%E6%95%B0/README.md)
- [x] [0093. 剩余参数](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0093.%20%E5%89%A9%E4%BD%99%E5%8F%82%E6%95%B0/README.md)
- [x] [0094. 函数重载](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0094.%20%E5%87%BD%E6%95%B0%E9%87%8D%E8%BD%BD/README.md)
- [x] [0095. 构造函数类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0095.%20%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0%E7%B1%BB%E5%9E%8B/README.md)
- [x] [0096. 函数的 2 个特殊返回类型 void、never](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0096.%20%E5%87%BD%E6%95%B0%E7%9A%84%202%20%E4%B8%AA%E7%89%B9%E6%AE%8A%E8%BF%94%E5%9B%9E%E7%B1%BB%E5%9E%8B%20void%E3%80%81never/README.md)
- [x] [0097. 函数的 this 参数](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0097.%20%E5%87%BD%E6%95%B0%E7%9A%84%20this%20%E5%8F%82%E6%95%B0/README.md)
- [x] [0098. 函数类型的多种声明方式](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0098.%20%E5%87%BD%E6%95%B0%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%A4%9A%E7%A7%8D%E5%A3%B0%E6%98%8E%E6%96%B9%E5%BC%8F/README.md)

## 10. 对象类型

- [x] [0033. 对象类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0033.%20%E5%AF%B9%E8%B1%A1%E7%B1%BB%E5%9E%8B/README.md)
- [x] [0099. 对象只读属性](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0099.%20%E5%AF%B9%E8%B1%A1%E5%8F%AA%E8%AF%BB%E5%B1%9E%E6%80%A7/README.md)
- [x] [0100. 对象可选属性](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0100.%20%E5%AF%B9%E8%B1%A1%E5%8F%AF%E9%80%89%E5%B1%9E%E6%80%A7/README.md)
- [x] [0101. 对象索引签名](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0101.%20%E5%AF%B9%E8%B1%A1%E7%B4%A2%E5%BC%95%E7%AD%BE%E5%90%8D/README.md)
- [x] [0102. 对象的额外属性检查](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0102.%20%E5%AF%B9%E8%B1%A1%E7%9A%84%E9%A2%9D%E5%A4%96%E5%B1%9E%E6%80%A7%E6%A3%80%E6%9F%A5/README.md)
- [x] [0103. 对象类型的扩展](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0103.%20%E5%AF%B9%E8%B1%A1%E7%B1%BB%E5%9E%8B%E7%9A%84%E6%89%A9%E5%B1%95/README.md)
- [x] [0104. 使用 Record 工具类型约束对象](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0104.%20%E4%BD%BF%E7%94%A8%20Record%20%E5%B7%A5%E5%85%B7%E7%B1%BB%E5%9E%8B%E7%BA%A6%E6%9D%9F%E5%AF%B9%E8%B1%A1/README.md)

## 11. 接口类型

- [x] [0052. interface 关键字](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0052.%20interface%20%E5%85%B3%E9%94%AE%E5%AD%97/README.md)
- [x] [0105. 接口的继承](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0105.%20%E6%8E%A5%E5%8F%A3%E7%9A%84%E7%BB%A7%E6%89%BF/README.md)
- [x] [0106. 接口的合并（声明合并）](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0106.%20%E6%8E%A5%E5%8F%A3%E7%9A%84%E5%90%88%E5%B9%B6%EF%BC%88%E5%A3%B0%E6%98%8E%E5%90%88%E5%B9%B6%EF%BC%89/README.md)
- [x] [0053. type vs. interface](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0053.%20type%20vs.%20interface/README.md)

## 12. Class 类型

- [ ] [0035. class 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0035.%20class%20%E7%B1%BB%E5%9E%8B/README.md)
- [x] [0066. 类属性严格初始化](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0066.%20%E7%B1%BB%E5%B1%9E%E6%80%A7%E4%B8%A5%E6%A0%BC%E5%88%9D%E5%A7%8B%E5%8C%96/README.md)
- [x] [0056. 类中的参数属性](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0056.%20%E7%B1%BB%E4%B8%AD%E7%9A%84%E5%8F%82%E6%95%B0%E5%B1%9E%E6%80%A7/README.md)
- [x] [0057. 抽象类](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0057.%20%E6%8A%BD%E8%B1%A1%E7%B1%BB/README.md)
- [x] [0058. 类中的存取器](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0058.%20%E7%B1%BB%E4%B8%AD%E7%9A%84%E5%AD%98%E5%8F%96%E5%99%A8/README.md)
- [x] [0059. 类实现接口](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0059.%20%E7%B1%BB%E5%AE%9E%E7%8E%B0%E6%8E%A5%E5%8F%A3/README.md)
- [x] [0060. 类中的只读属性](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0060.%20%E7%B1%BB%E4%B8%AD%E7%9A%84%E5%8F%AA%E8%AF%BB%E5%B1%9E%E6%80%A7/README.md)
- [x] [0061. 类的静态成员](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0061.%20%E7%B1%BB%E7%9A%84%E9%9D%99%E6%80%81%E6%88%90%E5%91%98/README.md)
- [x] [0062. 类的三个可访问性修饰符](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0062.%20%E7%B1%BB%E7%9A%84%E4%B8%89%E4%B8%AA%E5%8F%AF%E8%AE%BF%E9%97%AE%E6%80%A7%E4%BF%AE%E9%A5%B0%E7%AC%A6/README.md)
- [x] [0064. 类的继承](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0064.%20%E7%B1%BB%E7%9A%84%E7%BB%A7%E6%89%BF/README.md)
- [ ] [0063. 子类重写父类同名成员](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0063.%20%E5%AD%90%E7%B1%BB%E9%87%8D%E5%86%99%E7%88%B6%E7%B1%BB%E5%90%8C%E5%90%8D%E6%88%90%E5%91%98/README.md)
- [x] [0055. 类中的 this 参数和 this 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0055.%20%E7%B1%BB%E4%B8%AD%E7%9A%84%20this%20%E5%8F%82%E6%95%B0%E5%92%8C%20this%20%E7%B1%BB%E5%9E%8B/README.md)
- [x] [0065. 类与函数的选择](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0065.%20%E7%B1%BB%E4%B8%8E%E5%87%BD%E6%95%B0%E7%9A%84%E9%80%89%E6%8B%A9/README.md)
- [x] [0111. 类的类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0111.%20%E7%B1%BB%E7%9A%84%E7%B1%BB%E5%9E%8B/README.md)
- [ ] [0114. 类的静态块](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0114.%20%E7%B1%BB%E7%9A%84%E9%9D%99%E6%80%81%E5%9D%97/README.md)

## 13. 泛型

- [ ] [0038. 泛型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0038.%20%E6%B3%9B%E5%9E%8B/README.md)
- [ ] [0115. 泛型类](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0115.%20%E6%B3%9B%E5%9E%8B%E7%B1%BB/README.md)
- [ ] [0116. 泛型函数](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0116.%20%E6%B3%9B%E5%9E%8B%E5%87%BD%E6%95%B0/README.md)
- [ ] [0117. 泛型接口](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0117.%20%E6%B3%9B%E5%9E%8B%E6%8E%A5%E5%8F%A3/README.md)
- [ ] [0118. 泛型约束](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0118.%20%E6%B3%9B%E5%9E%8B%E7%BA%A6%E6%9D%9F/README.md)
- [ ] [0119. 在泛型约束中使用类型参数](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0119.%20%E5%9C%A8%E6%B3%9B%E5%9E%8B%E7%BA%A6%E6%9D%9F%E4%B8%AD%E4%BD%BF%E7%94%A8%E7%B1%BB%E5%9E%8B%E5%8F%82%E6%95%B0/README.md)
- [ ] [0120. 在泛型中使用类类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0120.%20%E5%9C%A8%E6%B3%9B%E5%9E%8B%E4%B8%AD%E4%BD%BF%E7%94%A8%E7%B1%BB%E7%B1%BB%E5%9E%8B/README.md)
- [ ] [0121. 泛型默认值](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0121.%20%E6%B3%9B%E5%9E%8B%E9%BB%98%E8%AE%A4%E5%80%BC/README.md)
- [ ] [0122. 泛型的最佳实践](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0122.%20%E6%B3%9B%E5%9E%8B%E7%9A%84%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5/README.md)

## 14. Enum 类型

- [ ] [0037. Enum 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0037.%20Enum%20%E7%B1%BB%E5%9E%8B/README.md)
- [ ] [0123. 数字枚举](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0123.%20%E6%95%B0%E5%AD%97%E6%9E%9A%E4%B8%BE/README.md)
- [ ] [0124. 字符串枚举](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0124.%20%E5%AD%97%E7%AC%A6%E4%B8%B2%E6%9E%9A%E4%B8%BE/README.md)
- [ ] [0125. 异构枚举](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0125.%20%E5%BC%82%E6%9E%84%E6%9E%9A%E4%B8%BE/README.md)
- [ ] [0126. 常量枚举（const enum）](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0126.%20%E5%B8%B8%E9%87%8F%E6%9E%9A%E4%B8%BE%EF%BC%88const%20enum%EF%BC%89/README.md)
- [ ] [0127. 外部枚举（ambient enum）](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0127.%20%E5%A4%96%E9%83%A8%E6%9E%9A%E4%B8%BE%EF%BC%88ambient%20enum%EF%BC%89/README.md)
- [ ] [0128. 枚举成员的类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0128.%20%E6%9E%9A%E4%B8%BE%E6%88%90%E5%91%98%E7%9A%84%E7%B1%BB%E5%9E%8B/README.md)
- [ ] [0129. 反向映射](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0129.%20%E5%8F%8D%E5%90%91%E6%98%A0%E5%B0%84/README.md)
- [ ] [0130. 枚举 vs. 对象字面量](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0130.%20%E6%9E%9A%E4%B8%BE%20vs.%20%E5%AF%B9%E8%B1%A1%E5%AD%97%E9%9D%A2%E9%87%8F/README.md)

## 15. 类型断言

- [ ] [0051. 类型断言](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0051.%20%E7%B1%BB%E5%9E%8B%E6%96%AD%E8%A8%80/README.md)
- [ ] [0040. 类型断言的条件](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0040.%20%E7%B1%BB%E5%9E%8B%E6%96%AD%E8%A8%80%E7%9A%84%E6%9D%A1%E4%BB%B6/README.md)
- [ ] [0048. as const 断言](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0048.%20as%20const%20%E6%96%AD%E8%A8%80/README.md)
- [ ] [0049. 非空断言](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0049.%20%E9%9D%9E%E7%A9%BA%E6%96%AD%E8%A8%80/README.md)
- [ ] [0050. 断言函数](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0050.%20%E6%96%AD%E8%A8%80%E5%87%BD%E6%95%B0/README.md)
- [ ] [0131. 双重断言](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0131.%20%E5%8F%8C%E9%87%8D%E6%96%AD%E8%A8%80/README.md)
- [ ] [0132. 类型断言的使用场景](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0132.%20%E7%B1%BB%E5%9E%8B%E6%96%AD%E8%A8%80%E7%9A%84%E4%BD%BF%E7%94%A8%E5%9C%BA%E6%99%AF/README.md)
- [ ] [0133. 类型断言 vs. 类型声明](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0133.%20%E7%B1%BB%E5%9E%8B%E6%96%AD%E8%A8%80%20vs.%20%E7%B1%BB%E5%9E%8B%E5%A3%B0%E6%98%8E/README.md)

## 16. 模块

- [ ] [0134. ES 模块系统](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0134.%20ES%20%E6%A8%A1%E5%9D%97%E7%B3%BB%E7%BB%9F/README.md)
- [ ] [0135. CommonJS 模块系统](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0135.%20CommonJS%20%E6%A8%A1%E5%9D%97%E7%B3%BB%E7%BB%9F/README.md)
- [ ] [0136. 模块解析策略](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0136.%20%E6%A8%A1%E5%9D%97%E8%A7%A3%E6%9E%90%E7%AD%96%E7%95%A5/README.md)
- [ ] [0137. 相对导入 vs. 非相对导入](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0137.%20%E7%9B%B8%E5%AF%B9%E5%AF%BC%E5%85%A5%20vs.%20%E9%9D%9E%E7%9B%B8%E5%AF%B9%E5%AF%BC%E5%85%A5/README.md)
- [ ] [0138. 模块解析的 baseUrl 和 paths](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0138.%20%E6%A8%A1%E5%9D%97%E8%A7%A3%E6%9E%90%E7%9A%84%20baseUrl%20%E5%92%8C%20paths/README.md)
- [ ] [0139. 导出和导入类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0139.%20%E5%AF%BC%E5%87%BA%E5%92%8C%E5%AF%BC%E5%85%A5%E7%B1%BB%E5%9E%8B/README.md)
- [ ] [0140. export type 和 import type](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0140.%20export%20type%20%E5%92%8C%20import%20type/README.md)
- [ ] [0141. 默认导出 vs. 命名导出](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0141.%20%E9%BB%98%E8%AE%A4%E5%AF%BC%E5%87%BA%20vs.%20%E5%91%BD%E5%90%8D%E5%AF%BC%E5%87%BA/README.md)
- [ ] [0142. 动态导入](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0142.%20%E5%8A%A8%E6%80%81%E5%AF%BC%E5%85%A5/README.md)
- [ ] [0143. 模块的类型声明](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0143.%20%E6%A8%A1%E5%9D%97%E7%9A%84%E7%B1%BB%E5%9E%8B%E5%A3%B0%E6%98%8E/README.md)
- [ ] [0144. esModuleInterop 配置项](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0144.%20esModuleInterop%20%E9%85%8D%E7%BD%AE%E9%A1%B9/README.md)
- [ ] [0145. allowSyntheticDefaultImports 配置项](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0145.%20allowSyntheticDefaultImports%20%E9%85%8D%E7%BD%AE%E9%A1%B9/README.md)

## 17. namespace

- [ ] [0146. namespace 关键字](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0146.%20namespace%20%E5%85%B3%E9%94%AE%E5%AD%97/README.md)
- [ ] [0147. 命名空间的基本使用](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0147.%20%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4%E7%9A%84%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8/README.md)
- [ ] [0148. 嵌套命名空间](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0148.%20%E5%B5%8C%E5%A5%97%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4/README.md)
- [ ] [0149. 命名空间的合并](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0149.%20%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4%E7%9A%84%E5%90%88%E5%B9%B6/README.md)
- [ ] [0150. 命名空间 vs. 模块](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0150.%20%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4%20vs.%20%E6%A8%A1%E5%9D%97/README.md)
- [ ] [0151. 何时使用命名空间](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0151.%20%E4%BD%95%E6%97%B6%E4%BD%BF%E7%94%A8%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4/README.md)
- [ ] [0152. 命名空间的别名](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0152.%20%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4%E7%9A%84%E5%88%AB%E5%90%8D/README.md)
- [ ] [0153. 命名空间的导出](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0153.%20%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4%E7%9A%84%E5%AF%BC%E5%87%BA/README.md)

## 18. 装饰器

- [ ] [0154. 装饰器的概念](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0154.%20%E8%A3%85%E9%A5%B0%E5%99%A8%E7%9A%84%E6%A6%82%E5%BF%B5/README.md)
- [ ] [0155. 装饰器的启用（experimentalDecorators）](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0155.%20%E8%A3%85%E9%A5%B0%E5%99%A8%E7%9A%84%E5%90%AF%E7%94%A8%EF%BC%88experimentalDecorators%EF%BC%89/README.md)
- [ ] [0156. 类装饰器](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0156.%20%E7%B1%BB%E8%A3%85%E9%A5%B0%E5%99%A8/README.md)
- [ ] [0157. 方法装饰器](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0157.%20%E6%96%B9%E6%B3%95%E8%A3%85%E9%A5%B0%E5%99%A8/README.md)
- [ ] [0158. 访问器装饰器](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0158.%20%E8%AE%BF%E9%97%AE%E5%99%A8%E8%A3%85%E9%A5%B0%E5%99%A8/README.md)
- [ ] [0159. 属性装饰器](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0159.%20%E5%B1%9E%E6%80%A7%E8%A3%85%E9%A5%B0%E5%99%A8/README.md)
- [ ] [0160. 参数装饰器](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0160.%20%E5%8F%82%E6%95%B0%E8%A3%85%E9%A5%B0%E5%99%A8/README.md)
- [ ] [0161. 装饰器的执行顺序](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0161.%20%E8%A3%85%E9%A5%B0%E5%99%A8%E7%9A%84%E6%89%A7%E8%A1%8C%E9%A1%BA%E5%BA%8F/README.md)
- [ ] [0162. 装饰器工厂](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0162.%20%E8%A3%85%E9%A5%B0%E5%99%A8%E5%B7%A5%E5%8E%82/README.md)
- [ ] [0163. 装饰器组合](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0163.%20%E8%A3%85%E9%A5%B0%E5%99%A8%E7%BB%84%E5%90%88/README.md)

## 19. 装饰器（旧语法）

- [ ] [0164. Stage 2 装饰器提案](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0164.%20Stage%202%20%E8%A3%85%E9%A5%B0%E5%99%A8%E6%8F%90%E6%A1%88/README.md)
- [ ] [0165. 旧装饰器 vs. 新装饰器](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0165.%20%E6%97%A7%E8%A3%85%E9%A5%B0%E5%99%A8%20vs.%20%E6%96%B0%E8%A3%85%E9%A5%B0%E5%99%A8/README.md)
- [ ] [0166. 旧装饰器的元数据](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0166.%20%E6%97%A7%E8%A3%85%E9%A5%B0%E5%99%A8%E7%9A%84%E5%85%83%E6%95%B0%E6%8D%AE/README.md)
- [ ] [0167. reflect-metadata 库](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0167.%20reflect-metadata%20%E5%BA%93/README.md)
- [ ] [0168. 装饰器的迁移指南](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0168.%20%E8%A3%85%E9%A5%B0%E5%99%A8%E7%9A%84%E8%BF%81%E7%A7%BB%E6%8C%87%E5%8D%97/README.md)

## 20. declare 关键字

- [ ] [0169. declare 的作用](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0169.%20declare%20%E7%9A%84%E4%BD%9C%E7%94%A8/README.md)
- [ ] [0170. declare 声明函数](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0170.%20declare%20%E5%A3%B0%E6%98%8E%E5%87%BD%E6%95%B0/README.md)
- [ ] [0171. declare 声明变量](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0171.%20declare%20%E5%A3%B0%E6%98%8E%E5%8F%98%E9%87%8F/README.md)
- [ ] [0172. declare 声明类](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0172.%20declare%20%E5%A3%B0%E6%98%8E%E7%B1%BB/README.md)
- [ ] [0173. declare 声明枚举](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0173.%20declare%20%E5%A3%B0%E6%98%8E%E6%9E%9A%E4%B8%BE/README.md)
- [ ] [0174. declare 声明命名空间](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0174.%20declare%20%E5%A3%B0%E6%98%8E%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4/README.md)
- [ ] [0175. declare module 扩展模块](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0175.%20declare%20module%20%E6%89%A9%E5%B1%95%E6%A8%A1%E5%9D%97/README.md)
- [ ] [0176. declare global 扩展全局](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0176.%20declare%20global%20%E6%89%A9%E5%B1%95%E5%85%A8%E5%B1%80/README.md)
- [ ] [0177. 环境声明的使用场景](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0177.%20%E7%8E%AF%E5%A2%83%E5%A3%B0%E6%98%8E%E7%9A%84%E4%BD%BF%E7%94%A8%E5%9C%BA%E6%99%AF/README.md)

## 21. d.ts 类型声明文件

- [ ] [0178. 类型声明文件的作用](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0178.%20%E7%B1%BB%E5%9E%8B%E5%A3%B0%E6%98%8E%E6%96%87%E4%BB%B6%E7%9A%84%E4%BD%9C%E7%94%A8/README.md)
- [ ] [0179. 自动生成 d.ts 文件](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0179.%20%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%20d.ts%20%E6%96%87%E4%BB%B6/README.md)
- [ ] [0180. 手动编写 d.ts 文件](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0180.%20%E6%89%8B%E5%8A%A8%E7%BC%96%E5%86%99%20d.ts%20%E6%96%87%E4%BB%B6/README.md)
- [ ] [0181. 三斜线指令](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0181.%20%E4%B8%89%E6%96%9C%E7%BA%BF%E6%8C%87%E4%BB%A4/README.md)
- [ ] [0182. @types 包的使用](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0182.%20%40types%20%E5%8C%85%E7%9A%84%E4%BD%BF%E7%94%A8/README.md)
- [ ] [0183. typeRoots 和 types 配置](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0183.%20typeRoots%20%E5%92%8C%20types%20%E9%85%8D%E7%BD%AE/README.md)
- [ ] [0184. 模块的类型声明](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0184.%20%E6%A8%A1%E5%9D%97%E7%9A%84%E7%B1%BB%E5%9E%8B%E5%A3%B0%E6%98%8E/README.md)
- [ ] [0185. 全局类型声明](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0185.%20%E5%85%A8%E5%B1%80%E7%B1%BB%E5%9E%8B%E5%A3%B0%E6%98%8E/README.md)
- [ ] [0186. UMD 模块的类型声明](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0186.%20UMD%20%E6%A8%A1%E5%9D%97%E7%9A%84%E7%B1%BB%E5%9E%8B%E5%A3%B0%E6%98%8E/README.md)
- [ ] [0187. 发布类型声明文件](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0187.%20%E5%8F%91%E5%B8%83%E7%B1%BB%E5%9E%8B%E5%A3%B0%E6%98%8E%E6%96%87%E4%BB%B6/README.md)

## 22. 类型运算符

- [ ] [0188. keyof 运算符](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0188.%20keyof%20%E8%BF%90%E7%AE%97%E7%AC%A6/README.md)
- [ ] [0189. in 运算符](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0189.%20in%20%E8%BF%90%E7%AE%97%E7%AC%A6/README.md)
- [ ] [0190. extends 条件类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0190.%20extends%20%E6%9D%A1%E4%BB%B6%E7%B1%BB%E5%9E%8B/README.md)
- [ ] [0191. infer 关键字](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0191.%20infer%20%E5%85%B3%E9%94%AE%E5%AD%97/README.md)
- [ ] [0192. 索引访问类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0192.%20%E7%B4%A2%E5%BC%95%E8%AE%BF%E9%97%AE%E7%B1%BB%E5%9E%8B/README.md)
- [ ] [0193. 条件类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0193.%20%E6%9D%A1%E4%BB%B6%E7%B1%BB%E5%9E%8B/README.md)
- [ ] [0194. 条件类型的分布式特性](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0194.%20%E6%9D%A1%E4%BB%B6%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%88%86%E5%B8%83%E5%BC%8F%E7%89%B9%E6%80%A7/README.md)
- [ ] [0195. 映射类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0195.%20%E6%98%A0%E5%B0%84%E7%B1%BB%E5%9E%8B/README.md)
- [ ] [0196. 模板字面量类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0196.%20%E6%A8%A1%E6%9D%BF%E5%AD%97%E9%9D%A2%E9%87%8F%E7%B1%BB%E5%9E%8B/README.md)
- [ ] [0197. satisfies 运算符](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0197.%20satisfies%20%E8%BF%90%E7%AE%97%E7%AC%A6/README.md)

## 23. 类型映射

- [ ] [0198. 映射类型的基本语法](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0198.%20%E6%98%A0%E5%B0%84%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%9F%BA%E6%9C%AC%E8%AF%AD%E6%B3%95/README.md)
- [ ] [0199. 映射修饰符（+ 和 -）](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0199.%20%E6%98%A0%E5%B0%84%E4%BF%AE%E9%A5%B0%E7%AC%A6%EF%BC%88%2B%20%E5%92%8C%20-%EF%BC%89/README.md)
- [ ] [0200. readonly 和 ？ 修饰符](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0200.%20readonly%20%E5%92%8C%20%EF%BC%9F%20%E4%BF%AE%E9%A5%B0%E7%AC%A6/README.md)
- [ ] [0201. 键名重映射（as 子句）](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0201.%20%E9%94%AE%E5%90%8D%E9%87%8D%E6%98%A0%E5%B0%84%EF%BC%88as%20%E5%AD%90%E5%8F%A5%EF%BC%89/README.md)
- [ ] [0202. 映射类型的过滤](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0202.%20%E6%98%A0%E5%B0%84%E7%B1%BB%E5%9E%8B%E7%9A%84%E8%BF%87%E6%BB%A4/README.md)
- [ ] [0203. 基于映射类型创建新类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0203.%20%E5%9F%BA%E4%BA%8E%E6%98%A0%E5%B0%84%E7%B1%BB%E5%9E%8B%E5%88%9B%E5%BB%BA%E6%96%B0%E7%B1%BB%E5%9E%8B/README.md)
- [ ] [0204. 内置映射类型解析](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0204.%20%E5%86%85%E7%BD%AE%E6%98%A0%E5%B0%84%E7%B1%BB%E5%9E%8B%E8%A7%A3%E6%9E%90/README.md)

## 24. 类型工具

- [ ] [0205. Partial T](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0205.%20Partial%20T/README.md)
- [ ] [0206. Required T](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0206.%20Required%20T/README.md)
- [ ] [0207. Readonly T](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0207.%20Readonly%20T/README.md)
- [ ] [0208. Record T](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0208.%20Record%20T/README.md)
- [ ] [0209. Pick T K](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0209.%20Pick%20T%20K/README.md)
- [ ] [0210. Omit T K](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0210.%20Omit%20T%20K/README.md)
- [ ] [0211. Exclude T U](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0211.%20Exclude%20T%20U/README.md)
- [ ] [0212. Extract T U](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0212.%20Extract%20T%20U/README.md)
- [ ] [0213. NonNullable T](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0213.%20NonNullable%20T/README.md)
- [ ] [0214. ReturnType T](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0214.%20ReturnType%20T/README.md)
- [ ] [0215. Parameters T](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0215.%20Parameters%20T/README.md)
- [ ] [0216. ConstructorParameters T](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0216.%20ConstructorParameters%20T/README.md)
- [ ] [0217. InstanceType T](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0217.%20InstanceType%20T/README.md)
- [ ] [0218. ThisParameterType T](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0218.%20ThisParameterType%20T/README.md)
- [ ] [0219. OmitThisParameter T](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0219.%20OmitThisParameter%20T/README.md)
- [ ] [0220. Awaited T](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0220.%20Awaited%20T/README.md)
- [ ] [0221. 自定义工具类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0221.%20%E8%87%AA%E5%AE%9A%E4%B9%89%E5%B7%A5%E5%85%B7%E7%B1%BB%E5%9E%8B/README.md)

## 25. 注释指令

- [x] [0222. @ts-ignore](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0222.%20%40ts-ignore/README.md)
- [x] [0223. @ts-expect-error](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0223.%20%40ts-expect-error/README.md)
- [x] [0291. @ts-ignore vs @ts-expect-error](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0291.%20%40ts-ignore%20vs%20%40ts-expect-error/README.md)
- [x] [0224. @ts-nocheck](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0224.%20%40ts-nocheck/README.md)
- [x] [0225. @ts-check](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0225.%20%40ts-check/README.md)
- [x] [0226. JSDoc 类型注释](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0226.%20JSDoc%20%E7%B1%BB%E5%9E%8B%E6%B3%A8%E9%87%8A/README.md)

## 26. tsconfig.json 文件

- [ ] [0232. tsconfig.json 的作用](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0232.%20tsconfig.json%20%E7%9A%84%E4%BD%9C%E7%94%A8/README.md)
- [ ] [0233. 编译选项分类概览](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0233.%20%E7%BC%96%E8%AF%91%E9%80%89%E9%A1%B9%E5%88%86%E7%B1%BB%E6%A6%82%E8%A7%88/README.md)
- [ ] [0234. target 和 lib](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0234.%20target%20%E5%92%8C%20lib/README.md)
- [ ] [0235. module 和 moduleResolution](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0235.%20module%20%E5%92%8C%20moduleResolution/README.md)
- [ ] [0236. strict 模式](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0236.%20strict%20%E6%A8%A1%E5%BC%8F/README.md)
- [ ] [0237. strictNullChecks](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0237.%20strictNullChecks/README.md)
- [ ] [0238. strictFunctionTypes](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0238.%20strictFunctionTypes/README.md)
- [ ] [0239. noImplicitAny](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0239.%20noImplicitAny/README.md)
- [ ] [0240. noImplicitThis](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0240.%20noImplicitThis/README.md)
- [ ] [0241. alwaysStrict](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0241.%20alwaysStrict/README.md)
- [ ] [0242. outDir 和 rootDir](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0242.%20outDir%20%E5%92%8C%20rootDir/README.md)
- [ ] [0243. include 和 exclude](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0243.%20include%20%E5%92%8C%20exclude/README.md)
- [ ] [0244. files 选项](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0244.%20files%20%E9%80%89%E9%A1%B9/README.md)
- [ ] [0245. extends 继承配置](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0245.%20extends%20%E7%BB%A7%E6%89%BF%E9%85%8D%E7%BD%AE/README.md)
- [ ] [0246. references 项目引用](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0246.%20references%20%E9%A1%B9%E7%9B%AE%E5%BC%95%E7%94%A8/README.md)
- [ ] [0247. incremental 增量编译](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0247.%20incremental%20%E5%A2%9E%E9%87%8F%E7%BC%96%E8%AF%91/README.md)
- [ ] [0248. 常用编译配置组合](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0248.%20%E5%B8%B8%E7%94%A8%E7%BC%96%E8%AF%91%E9%85%8D%E7%BD%AE%E7%BB%84%E5%90%88/README.md)

## 27. tsc 命令

- [ ] [0257. tsc 命令的基本用法](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0257.%20tsc%20%E5%91%BD%E4%BB%A4%E7%9A%84%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95/README.md)
- [ ] [0258. tsc 常用参数](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0258.%20tsc%20%E5%B8%B8%E7%94%A8%E5%8F%82%E6%95%B0/README.md)
- [ ] [0259. tsc --watch 模式](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0259.%20tsc%20--watch%20%E6%A8%A1%E5%BC%8F/README.md)
- [ ] [0260. tsc --project 指定配置文件](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0260.%20tsc%20--project%20%E6%8C%87%E5%AE%9A%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6/README.md)
- [ ] [0261. tsc --outDir 和 --outFile](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0261.%20tsc%20--outDir%20%E5%92%8C%20--outFile/README.md)
- [ ] [0262. tsc --declaration 生成声明文件](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0262.%20tsc%20--declaration%20%E7%94%9F%E6%88%90%E5%A3%B0%E6%98%8E%E6%96%87%E4%BB%B6/README.md)
- [ ] [0263. tsc --sourceMap 生成源码映射](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0263.%20tsc%20--sourceMap%20%E7%94%9F%E6%88%90%E6%BA%90%E7%A0%81%E6%98%A0%E5%B0%84/README.md)
- [ ] [0264. tsc --noEmit 只检查不输出](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0264.%20tsc%20--noEmit%20%E5%8F%AA%E6%A3%80%E6%9F%A5%E4%B8%8D%E8%BE%93%E5%87%BA/README.md)
- [ ] [0265. tsc --showConfig 显示配置](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0265.%20tsc%20--showConfig%20%E6%98%BE%E7%A4%BA%E9%85%8D%E7%BD%AE/README.md)
- [ ] [0266. tsc --listFiles 列出编译文件](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0266.%20tsc%20--listFiles%20%E5%88%97%E5%87%BA%E7%BC%96%E8%AF%91%E6%96%87%E4%BB%B6/README.md)
- [ ] [0267. tsc --init 初始化配置](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0267.%20tsc%20--init%20%E5%88%9D%E5%A7%8B%E5%8C%96%E9%85%8D%E7%BD%AE/README.md)

## 28. 实战技巧

- [ ] [0268. 常见类型错误处理](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0268.%20%E5%B8%B8%E8%A7%81%E7%B1%BB%E5%9E%8B%E9%94%99%E8%AF%AF%E5%A4%84%E7%90%86/README.md)
- [ ] [0269. 类型收窄技巧](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0269.%20%E7%B1%BB%E5%9E%8B%E6%94%B6%E7%AA%84%E6%8A%80%E5%B7%A7/README.md)
- [ ] [0270. 类型守卫的使用](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0270.%20%E7%B1%BB%E5%9E%8B%E5%AE%88%E5%8D%AB%E7%9A%84%E4%BD%BF%E7%94%A8/README.md)
- [ ] [0271. 类型推断的最佳实践](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0271.%20%E7%B1%BB%E5%9E%8B%E6%8E%A8%E6%96%AD%E7%9A%84%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5/README.md)
- [ ] [0272. 避免类型断言的滥用](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0272.%20%E9%81%BF%E5%85%8D%E7%B1%BB%E5%9E%8B%E6%96%AD%E8%A8%80%E7%9A%84%E6%BB%A5%E7%94%A8/README.md)
- [ ] [0273. React 中的 TypeScript](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0273.%20React%20%E4%B8%AD%E7%9A%84%20TypeScript/README.md)
- [ ] [0274. Vue 中的 TypeScript](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0274.%20Vue%20%E4%B8%AD%E7%9A%84%20TypeScript/README.md)
- [ ] [0275. Node.js 中的 TypeScript](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0275.%20Node.js%20%E4%B8%AD%E7%9A%84%20TypeScript/README.md)
- [ ] [0276. 第三方库的类型处理](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0276.%20%E7%AC%AC%E4%B8%89%E6%96%B9%E5%BA%93%E7%9A%84%E7%B1%BB%E5%9E%8B%E5%A4%84%E7%90%86/README.md)

## 29. 深入原理

- [ ] [0045. 深入原理](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0045.%20%E6%B7%B1%E5%85%A5%E5%8E%9F%E7%90%86/README.md)
- [x] [0043. Source Map 的基本概念和原理](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0043.%20Source%20Map%20%E7%9A%84%E5%9F%BA%E6%9C%AC%E6%A6%82%E5%BF%B5%E5%92%8C%E5%8E%9F%E7%90%86/README.md)
- [ ] [0249. TS 编译流程](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0249.%20TS%20%E7%BC%96%E8%AF%91%E6%B5%81%E7%A8%8B/README.md)
- [ ] [0250. AST 抽象语法树](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0250.%20AST%20%E6%8A%BD%E8%B1%A1%E8%AF%AD%E6%B3%95%E6%A0%91/README.md)
- [ ] [0251. 类型检查原理](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0251.%20%E7%B1%BB%E5%9E%8B%E6%A3%80%E6%9F%A5%E5%8E%9F%E7%90%86/README.md)
- [ ] [0252. 类型擦除](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0252.%20%E7%B1%BB%E5%9E%8B%E6%93%A6%E9%99%A4/README.md)
- [ ] [0253. 声明空间与变量空间](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0253.%20%E5%A3%B0%E6%98%8E%E7%A9%BA%E9%97%B4%E4%B8%8E%E5%8F%98%E9%87%8F%E7%A9%BA%E9%97%B4/README.md)
- [ ] [0254. 类型系统的健全性](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0254.%20%E7%B1%BB%E5%9E%8B%E7%B3%BB%E7%BB%9F%E7%9A%84%E5%81%A5%E5%85%A8%E6%80%A7/README.md)
- [ ] [0255. 结构类型系统的实现](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0255.%20%E7%BB%93%E6%9E%84%E7%B1%BB%E5%9E%8B%E7%B3%BB%E7%BB%9F%E7%9A%84%E5%AE%9E%E7%8E%B0/README.md)
- [ ] [0256. 编译性能优化](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0256.%20%E7%BC%96%E8%AF%91%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96/README.md)

## 30. 进阶话题

- [ ] [0277. 高级类型技巧](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0277.%20%E9%AB%98%E7%BA%A7%E7%B1%BB%E5%9E%8B%E6%8A%80%E5%B7%A7/README.md)
- [ ] [0278. 类型体操](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0278.%20%E7%B1%BB%E5%9E%8B%E4%BD%93%E6%93%8D/README.md)
- [ ] [0279. 类型安全的设计模式](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0279.%20%E7%B1%BB%E5%9E%8B%E5%AE%89%E5%85%A8%E7%9A%84%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/README.md)
- [ ] [0280. TS 与函数式编程](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0280.%20TS%20%E4%B8%8E%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BC%96%E7%A8%8B/README.md)
- [ ] [0281. TS 性能优化](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0281.%20TS%20%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96/README.md)
- [ ] [0282. 大型项目的类型组织](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0282.%20%E5%A4%A7%E5%9E%8B%E9%A1%B9%E7%9B%AE%E7%9A%84%E7%B1%BB%E5%9E%8B%E7%BB%84%E7%BB%87/README.md)
- [ ] [0283. monorepo 中的 TypeScript](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0283.%20monorepo%20%E4%B8%AD%E7%9A%84%20TypeScript/README.md)

## 31. TS 7.0

- [ ] [0284. typescript-go 项目](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0284.%20typescript-go%20%E9%A1%B9%E7%9B%AE/README.md)

## xxx

- [ ] [0108. new](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0108.%20new/README.md)
- [ ] [0109. new](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0109.%20new/README.md)
- [ ] [0227. new](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0227.%20new/README.md)
- [ ] [0228. new](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0228.%20new/README.md)
- [ ] [0229. new](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0229.%20new/README.md)
- [ ] [0230. new](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0230.%20new/README.md)
- [ ] [0231. new](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0231.%20new/README.md)
- [ ] [0292. new](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0292.%20new/README.md)
- [ ] [0293. new](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0293.%20new/README.md)
