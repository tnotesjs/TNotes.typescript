# [0285. TS 错误码](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0285.%20TS%20%E9%94%99%E8%AF%AF%E7%A0%81)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 如何查询 TS 错误码？](#3-如何查询-ts-错误码)
  - [3.1. 错误的查询方式](#31-错误的查询方式)
  - [3.2. 被动的方式](#32-被动的方式)
  - [3.3. 主动的方式](#33-主动的方式)
- [4. 引用](#4-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 查询 TS 错误码

## 2. 评价

文中记录的根据错误码查询错误消息的需求，大概率是一个伪需求，实际情况下，我们都是借助 IDE 报错或者 tsc 编译错误来查看错误信息的。一般当我们看到状态码的时候，都能看到对应的错误描述。文中记录的这个内容，更多是想要介绍 TS 源码仓库中定义错误码的位置。

## 3. 如何查询 TS 错误码？

需求：你知道错误码（比如 TS2322），但是不知道错误详细描述，想要查询这个错误码对应的详细描述是什么。

### 3.1. 错误的查询方式

直接到官方文档中搜索 2322。

- 官方 TypeScript 文档目前没有“按错误码可检索的完整列表”页面。
- 查询 TS2322 等错误的权威来源是 TypeScript 源码里的错误消息表。

### 3.2. 被动的方式

日常开发中，我们只需要借助编辑器提示或 Playground 即可查看到错误完整的描述。比如：

- 在 VS Code 的问题面板或悬浮提示里点击错误码（如 TS2322）即可查看完整报错信息。
- 在 TypeScript Playground 复现代码，直接查看报错详情。

这种查询方式是在遇到错误之后，通过 IDE 的智能提示来查看错误的相关信息。

### 3.3. 主动的方式

比如你现在遇到的错误是 TS2322，那么你可以通过以下方式查询：

[诊断消息定义文件 `diagnosticMessages.json`][1] -> 官方源码（最权威），打开链接后搜索 2322，能看到模板消息：`Type '{0}' is not assignable to type '{1}'.`

```json
{
  // ...
  "Type '{0}' is not assignable to type '{1}'.": {
    "category": "Error",
    "code": 2322
  }
  // ...
}
```

## 4. 引用

- [诊断消息定义文件 `diagnosticMessages.json`][1]

[1]: https://github.com/microsoft/TypeScript/blob/main/src/compiler/diagnosticMessages.json
