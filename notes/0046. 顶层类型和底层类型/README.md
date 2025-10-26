# [0046. 顶层类型和底层类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0046.%20%E9%A1%B6%E5%B1%82%E7%B1%BB%E5%9E%8B%E5%92%8C%E5%BA%95%E5%B1%82%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 「顶层类型」、「底层类型」官方有给明确定义吗？](#3--顶层类型底层类型官方有给明确定义吗)
- [4. 🤔 「顶层类型」是什么？](#4--顶层类型是什么)
- [5. 🤔 「底层类型」是什么？](#5--底层类型是什么)
- [6. 🤔 TS 中的顶层类型和底层类型分别是？](#6--ts-中的顶层类型和底层类型分别是)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- any
- unknown
- never
- 顶层类型（top type）
- 底层类型（bottom type）

## 2. 🫧 评价

本章介绍的内容是 TS 类型系统中的一些特殊类型，包括 any、unknown 和 never。

## 3. 🤔 「顶层类型」、「底层类型」官方有给明确定义吗？

- 没有。

在 TypeScript 的类型系统讨论中，经常提到 顶层类型（top type） 和 底层类型（bottom type） 的概念。不过官方文档中并没有专门以 “top type／bottom type” 为标题系统化定义两者，而是散见于不同章节与手册中，以 “unknown = top”“never = bottom” 这样方式提及。比如在 [TS for Functional Programmers - Other important TypeScript types][1] 这一节中出现的：

![图 0](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-19-13-29-14.png)

::: tip 小结

- 也就是说，top type 和 bottom type 其实是社区为了方便 TS 相关问题的沟通而造出来词，虽然官方并没有专门的 doc 来介绍什么是「顶层类型」、「底层类型」。
- 知道这一点还是挺有必要的，这就意味着关于 「顶层类型」、「底层类型」的定义尚未明确，你可以在某篇文章中看到 xxx 是顶层类型，xxx 是底层类型，然后又在其它文章中看到矛盾的说法。
- 因此，我们需要先给「顶层类型」、「底层类型」术语做一个简单的介绍，明确它们的特点，然后咱们再来按照我们下的定义来盘归类。

:::

## 4. 🤔 「顶层类型」是什么？

- “顶层类型 (top type)” 通常指一个类型系统里 可以代表“几乎所有值” 的类型。
- 换句话说，它是 “大至所有类型的超类型（supertype）” 的那个。

## 5. 🤔 「底层类型」是什么？

- “底层类型 (bottom type)” 则是指一个类型系统里 “几乎没有值”或根本不能有值” 的类型。
- 换句话说，它是 “小至所有类型的子类型（subtype）” 的那个。

## 6. 🤔 TS 中的顶层类型和底层类型分别是？

TypeScript 有两个“顶层类型”（any 和 unknown），但是“底层类型”只有 never 唯一一个。

## 7. 🔗 引用

- [TS for Functional Programmers - Other important TypeScript types][1]
  - TypeScript 函数式编程指南 - 其他重要的 TypeScript 类型

[1]: https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#other-important-typescript-types
