# [0285. TS 错误码](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0285.%20TS%20%E9%94%99%E8%AF%AF%E7%A0%81)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 如何“被动”查询 TS 错误码？](#3--如何被动查询-ts-错误码)
- [4. 🤔 如何“主动”查询 TS 错误码？](#4--如何主动查询-ts-错误码)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 诊断消息定义文件：diagnosticMessages.json

## 2. 🫧 评价

TS 官方文档中可以查询错误码吗？比如错误 ts 2322，我应该如何查询这个报错的详细描述？

- 官方 TypeScript 文档目前没有“按错误码可检索的完整列表”页面。
- 查询 TS2322 等错误的权威来源是 TypeScript 源码里的错误消息表。

## 3. 🤔 如何“被动”查询 TS 错误码？

日常开发中，我们只需要借助编辑器提示或 Playground 即可查看到错误完整的描述。比如：

- 在 VS Code 的问题面板或悬浮提示里点击错误码（如 TS2322）即可查看完整报错信息。
- 在 TypeScript Playground 复现代码，直接查看报错详情。

## 4. 🤔 如何“主动”查询 TS 错误码？

官方源码（最权威）

- 诊断消息定义文件：diagnosticMessages.json
  - https://github.com/microsoft/TypeScript/blob/main/src/compiler/diagnosticMessages.json
  - 打开后搜索 2322，能看到模板消息：Type '{0}' is not assignable to type '{1}'.
- 生成的映射文件（也便于检索）：diagnosticInformationMap.generated.ts
  - https://github.com/microsoft/TypeScript/blob/main/src/compiler/diagnosticInformationMap.generated.ts

<!-- 3. 社区/资料

- 在搜索引擎或 StackOverflow 搜索“TS2322 TypeScript”可找到常见场景与解决思路。
- 一些非官方的文档站会对常见错误做延伸解释。

实用排错小贴士

- 为了获得更完整的错误类型展开，建议在 tsconfig.json 中开启 "noErrorTruncation": true，这样复杂类型不会被截断，更利于定位 TS2322 的具体不兼容原因。

TS2322 是什么？

- 含义：把类型 A 的值赋给预期为类型 B 的位置，但 A 与 B 不兼容。
- 经典信息：Type 'A' is not assignable to type 'B'.

以下为搜索结果原文（含引用和来源）：

The official TypeScript documentation does not provide a direct, searchable web page listing all error codes like TS2322. However, here are the main avenues you can use to look up TypeScript error codes and their detailed descriptions:

1. TypeScript GitHub Repository (Source of Truth)
   The most definitive list of all TypeScript error codes and their detailed messages is in the TypeScript compiler source, specifically the diagnosticMessages.json file. You can search for your error code (e.g., TS2322) in this file. For example:

- [diagnosticMessages.json (TypeScript GitHub, for v5.x)](https://github.com/microsoft/TypeScript/blob/main/src/compiler/diagnosticMessages.json)
  This resource provides the official message text that TypeScript prints for each error code[[1]](https://stackoverflow.com/questions/33410124/complete-list-of-typescript-error-codes-and-their-fixes).

2. TypeScriptDocs.com and Other Documentation Bridges
   Some unofficial documentation sites, such as TypeScriptDocs, offer guides to understanding common errors. They often re-explain the messages in more human-friendly language, but they do not always list each possible error code[[2]](https://typescriptdocs.com/handbook/understanding-errors.html)[[3]](https://typescriptdocs.com/).

3. Community Resources
   Blog posts and tutorial aggregators sometimes compile error code lists and explanations—for example, webdevtutor's blog entry on common TypeScript error codes. These can be helpful to supplement official messages with solutions and more context[[4]](https://www.webdevtutor.net/blog/typescript-error-code-list)[[5]](https://www.exchangetuts.com/index.php/complete-list-of-typescript-error-codes-and-their-fixes-1640098504137051).

4. Stack Overflow and Q&A Threads
   Stack Overflow often surfaces common error codes in questions and answers, sometimes with copy-pasted explanations and solutions labeled by error code. Searching there for "TS2322" will usually yield both the official message and community insights on resolving it[[1]](https://stackoverflow.com/questions/33410124/complete-list-of-typescript-error-codes-and-their-fixes).

5. TypeScript Playground and In-Editor Tooling
   In many editors (like VS Code), you can click the error code directly in the error popup or message, which sometimes deep-links to documentation or provides a search prompt. The TypeScript Playground also provides a direct interface that shows the error text when you reproduce the error in code[[6]](https://www.typescriptlang.org/docs/).

 How to Look Up TS2322 Specifically

- Search diagnosticMessages.json on GitHub:
  Go to the [TypeScript diagnosticMessages.json](https://github.com/microsoft/TypeScript/blob/main/src/compiler/diagnosticMessages.json) file and use the browser's search function for "2322". For TS2322 you’d see a message like:

  ```
  "2322": {
      "category": "error",
      "code": 2322,
      "key": "Type '{0}' is not assignable to type '{1}'.",
      ...
  }
  ```

  This gives you the template message; when you see TS2322 in your project, the message is usually something like:
   `Type 'A' is not assignable to type 'B'.`
   This error means you are trying to assign a value of type A to something TypeScript was expecting to be type B and they are incompatible[[1]](https://stackoverflow.com/questions/33410124/complete-list-of-typescript-error-codes-and-their-fixes)[[5]](https://www.exchangetuts.com/index.php/complete-list-of-typescript-error-codes-and-their-fixes-1640098504137051).

- Community and Q&A lookup:
  A search for “TS2322 TypeScript” in Stack Overflow or Google also quickly finds not only the error message but common causes and solutions (such as type mismatches in assignments, prop types, etc.)[[1]](https://stackoverflow.com/questions/33410124/complete-list-of-typescript-error-codes-and-their-fixes)[[4]](https://www.webdevtutor.net/blog/typescript-error-code-list).

---

1. [Complete list of Typescript error codes and their fixes](https://stackoverflow.com/questions/33410124/complete-list-of-typescript-error-codes-and-their-fixes)
2. [Understanding Errors | Typescript Docs](https://typescriptdocs.com/handbook/understanding-errors.html)
3. [TypeScript Docs | The Modern TypeScript Documentation](https://typescriptdocs.com/)
4. [A Comprehensive List of TypeScript Error Codes: Understanding and ...](https://www.webdevtutor.net/blog/typescript-error-code-list)
5. [Complete list of Typescript error codes and their fixes](https://www.exchangetuts.com/index.php/complete-list-of-typescript-error-codes-and-their-fixes-1640098504137051)
6. [The starting point for learning TypeScript](https://www.typescriptlang.org/docs/) -->
