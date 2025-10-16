# typescript

<!-- region:toc -->

- [typescript](#typescript)
  - [1. 学习资料](#1-学习资料)
  - [2. TS 简介](#2-ts-简介)
  - [3. 基本用法](#3-基本用法)
  - [4. 类型边界](#4-类型边界)
  - [5. 类型系统](#5-类型系统)
  - [6. 数组](#6-数组)
  - [7. 元组](#7-元组)
  - [8. symbol 类型](#8-symbol-类型)
  - [9. 函数](#9-函数)
  - [10. 对象](#10-对象)
  - [11. interface](#11-interface)
  - [12. 类](#12-类)
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
  - [28. 空](#28-空)

<!-- endregion:toc -->

## 1. 学习资料

- [x] [0002. TypeScript（阮一峰）](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0002.%20TypeScript%EF%BC%88%E9%98%AE%E4%B8%80%E5%B3%B0%EF%BC%89/README.md)

## 2. TS 简介

- [x] [0008. TS 简介](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0008.%20TS%20%E7%AE%80%E4%BB%8B/README.md)
- [x] [0001. TypeScript 简介](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0001.%20TypeScript%20%E7%AE%80%E4%BB%8B/README.md)
- [x] [0003. TypeScript 发展简史](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0003.%20TypeScript%20%E5%8F%91%E5%B1%95%E7%AE%80%E5%8F%B2/README.md)
- [x] [0005. TypeScript 博客](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0005.%20TypeScript%20%E5%8D%9A%E5%AE%A2/README.md)
- [x] [0004. 类型 vs. 值](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0004.%20%E7%B1%BB%E5%9E%8B%20vs.%20%E5%80%BC/README.md)
- [x] [0006. 面向对象的思维方式](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0006.%20%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%80%9D%E7%BB%B4%E6%96%B9%E5%BC%8F/README.md)
- [x] [0007. 动态类型 vs. 静态类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0007.%20%E5%8A%A8%E6%80%81%E7%B1%BB%E5%9E%8B%20vs.%20%E9%9D%99%E6%80%81%E7%B1%BB%E5%9E%8B/README.md)

## 3. 基本用法

- [x] [0009. 类型声明和类型推断](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0009.%20%E7%B1%BB%E5%9E%8B%E5%A3%B0%E6%98%8E%E5%92%8C%E7%B1%BB%E5%9E%8B%E6%8E%A8%E6%96%AD/README.md)
- [x] [0010. TS 的编译](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0010.%20TS%20%E7%9A%84%E7%BC%96%E8%AF%91/README.md)
- [x] [0011. TS Playground](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0011.%20TS%20Playground/README.md)
- [ ] [0012. tsc 基本使用](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0012.%20tsc%20%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8/README.md)
- [ ] [0013. ts-node 基本使用](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0013.%20ts-node%20%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8/README.md)

## 4. 类型边界

- [ ] [0014. any 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0014.%20any%20%E7%B1%BB%E5%9E%8B/README.md)
- [ ] [0015. unknown 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0015.%20unknown%20%E7%B1%BB%E5%9E%8B/README.md)
- [ ] [0016. never 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0016.%20never%20%E7%B1%BB%E5%9E%8B/README.md)
- [ ] [0017. 特殊类型的可赋值性](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0017.%20%E7%89%B9%E6%AE%8A%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%8F%AF%E8%B5%8B%E5%80%BC%E6%80%A7/README.md)

## 5. 类型系统

- [ ] [0018. boolean 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0018.%20boolean%20%E7%B1%BB%E5%9E%8B/README.md)
- [ ] [0019. string 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0019.%20string%20%E7%B1%BB%E5%9E%8B/README.md)
- [ ] [0020. number 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0020.%20number%20%E7%B1%BB%E5%9E%8B/README.md)
- [ ] [0021. bigint 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0021.%20bigint%20%E7%B1%BB%E5%9E%8B/README.md)
- [ ] [0022. symbol 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0022.%20symbol%20%E7%B1%BB%E5%9E%8B/README.md)
- [ ] [0023. object 类型和 Object 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0023.%20object%20%E7%B1%BB%E5%9E%8B%E5%92%8C%20Object%20%E7%B1%BB%E5%9E%8B/README.md)
- [ ] [0024. undefined 类型和 null 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0024.%20undefined%20%E7%B1%BB%E5%9E%8B%E5%92%8C%20null%20%E7%B1%BB%E5%9E%8B/README.md)
- [ ] [0025. 字面量类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0025.%20%E5%AD%97%E9%9D%A2%E9%87%8F%E7%B1%BB%E5%9E%8B/README.md)
- [ ] [0026. 联合类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0026.%20%E8%81%94%E5%90%88%E7%B1%BB%E5%9E%8B/README.md)
- [ ] [0027. 交叉类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0027.%20%E4%BA%A4%E5%8F%89%E7%B1%BB%E5%9E%8B/README.md)
- [ ] [0028. type 命令](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0028.%20type%20%E5%91%BD%E4%BB%A4/README.md)
- [ ] [0029. typeof 运算符](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0029.%20typeof%20%E8%BF%90%E7%AE%97%E7%AC%A6/README.md)
- [ ] [0030. 类型作用域](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0030.%20%E7%B1%BB%E5%9E%8B%E4%BD%9C%E7%94%A8%E5%9F%9F/README.md)
- [ ] [0031. 类型的兼容](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0031.%20%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%85%BC%E5%AE%B9/README.md)

## 6. 数组

- [ ] [0032. 数组类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0032.%20%E6%95%B0%E7%BB%84%E7%B1%BB%E5%9E%8B/README.md)
- [ ] [0033. 数组的类型推断](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0033.%20%E6%95%B0%E7%BB%84%E7%9A%84%E7%B1%BB%E5%9E%8B%E6%8E%A8%E6%96%AD/README.md)
- [ ] [0034. 只读数组和 const 断言](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0034.%20%E5%8F%AA%E8%AF%BB%E6%95%B0%E7%BB%84%E5%92%8C%20const%20%E6%96%AD%E8%A8%80/README.md)
- [ ] [0035. 多维数组](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0035.%20%E5%A4%9A%E7%BB%B4%E6%95%B0%E7%BB%84/README.md)

## 7. 元组

- [ ] [0036. 元组类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0036.%20%E5%85%83%E7%BB%84%E7%B1%BB%E5%9E%8B/README.md)
- [ ] [0037. 只读元组](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0037.%20%E5%8F%AA%E8%AF%BB%E5%85%83%E7%BB%84/README.md)
- [ ] [0038. 元组的成员数量的推断](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0038.%20%E5%85%83%E7%BB%84%E7%9A%84%E6%88%90%E5%91%98%E6%95%B0%E9%87%8F%E7%9A%84%E6%8E%A8%E6%96%AD/README.md)
- [ ] [0039. 元组和扩展运算符](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0039.%20%E5%85%83%E7%BB%84%E5%92%8C%E6%89%A9%E5%B1%95%E8%BF%90%E7%AE%97%E7%AC%A6/README.md)

## 8. symbol 类型

- [ ] [0040. symbol 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0040.%20symbol%20%E7%B1%BB%E5%9E%8B/README.md)

## 9. 函数

## 10. 对象

## 11. interface

## 12. 类

## 13. 泛型

## 14. Enum 类型

## 15. 类型断言

## 16. 模块

## 17. namespace

## 18. 装饰器

## 19. 装饰器（旧语法）

## 20. declare 关键字

## 21. d.ts 类型声明文件

## 22. 类型运算符

## 23. 类型映射

## 24. 类型工具

## 25. 注释指令

## 26. tsconfig.json 文件

## 27. tsc 命令

## 28. 空
