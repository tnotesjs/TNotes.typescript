# [0228. 注释指令](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0228.%20%E6%B3%A8%E9%87%8A%E6%8C%87%E4%BB%A4)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 章节速览](#3-章节速览)
- [4. 引用](#4-引用)

<!-- endregion:toc -->

## 1. 本节内容

- TS 注释指令

## 2. 评价

在 TS 官方文档中，并没有专门介绍注释指令的章节，类似 `@ts-ignore`、`@ts-expect-error`、`@ts-nocheck` …… 这些注释指令的内容大多都分散在各个版本更新的说明文档中。比如：

- [TypeScript 3.7 中提到了 // @ts-nocheck in TypeScript files][2]
- [TypeScript 3.9 中提到了 // @ts-expect-error Comments][1]
- ……

这些指令大多跟 JS 项目迁移到 TS 版本相关，比如在迁移的过程中，临时关闭一些未迁移模块的类型检查，在迁移完成之后再开启严格的 TS 类型检查。

## 3. 章节速览

<N :ids="['0222', '0223', '0291', '0224', '0225', '0226']" />

## 4. 引用

- [TypeScript 3.7 // @ts-nocheck in TypeScript files][2]
- [TypeScript 3.9 // @ts-expect-error Comments][1]

[1]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#-ts-expect-error-comments
[2]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#-ts-nocheck-in-typescript-files
