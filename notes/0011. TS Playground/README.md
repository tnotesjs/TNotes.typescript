# [0011. TS Playground](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0011.%20TS%20Playground)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 TS Playground 是什么？](#3--ts-playground-是什么)
- [4. 🤔 官方 Playground 有什么用？](#4--官方-playground-有什么用)
  - [4.1. 核心功能](#41-核心功能)
  - [4.2. 实用场景](#42-实用场景)
  - [4.3. 高级技巧](#43-高级技巧)
- [5. 🤔 TS Playground 页面组成结构是？](#5--ts-playground-页面组成结构是)
  - [5.1. ⚙️ 头部控件区域](#51-️-头部控件区域)
  - [5.2. ⚙️ 左侧区域](#52-️-左侧区域)
  - [5.3. ⚙️ 右侧区域](#53-️-右侧区域)
- [6. 🧠 学会举一反三](#6--学会举一反三)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- TypeScript Playground 简介
- 知道能够使用 TypeScript 快速解决哪些问题

## 2. 🫧 评价

- 学会借助 TypeScript Playground 来速学 TS。
  - `TNotes.typescript` 知识库中的所有示例也都可以直接丢到 TypeScript Playground 中，进行查看和编译。
  - 熟不熟悉 TypeScript Playground 的界面其实不是特别重要，简单了解一下即可。没必要每一个按的功能都记住，能看懂就行。建议的做法是，到 TypeScript Playground 这里边随便点点，体验一波，在线用这个工具去测试一些 TS 程序，还是非常方便的。

## 3. 🤔 TS Playground 是什么？

- [TS Playground][1]
  - TS Playground 是 TypeScript 官方提供的 Playground，是一个在线的、可以实时编译和运行 ts 代码的工具。
  - 只要打开这个网页，把 TypeScript 代码贴进文本框，它就会在当前页面自动编译出 JavaScript 代码，还可以在浏览器执行编译产物。如果编译报错，它也会给出详细的报错信息。
  - 这个页面还具有支持完整的 IDE 支持，可以自动语法提示。此外，它支持把代码片段和编译器设置保存成 URL，分享给他人。
  - TypeScript Playground 能够帮你快速学习、实验、调试和分享 TypeScript 代码。用来调试一些 TS 代码片段还是特别方便的。
- 在线使用：
  - 无需在本地安装或配置任何东西就可以在线使用。
  - 具有支持完整的 IDE 支持，可以自动完成语法提示。
- 快速测试：
  - 这个工具可以帮你快速验证某个 TypeScript 特性。
  - 比如说 TS 发布了啥新功能，你就可以用它来快速体验；
  - 亦或者你想要快速验证某些 tsconfig.json 配置的作用，也可以使用它来快速测试；
- 实时编译和运行：
  - playground 支持实时转义功能，你在写 ts 代码的同时，可以立刻看到侧边编译后的 js 代码。
  - 只要打开这个网页，把 TypeScript 代码贴进文本框，它就会在当前页面自动编译出 JavaScript 代码，还可以在浏览器执行编译产物。
  - 如果编译报错，它也会给出详细的报错信息。
- 切版本：
  - 支持快速切换不同的 TypeScript 版本。
- 分享：
  - playground 支持把代码片段和编译器设置保存成 URL，分享给他人，只需要点击一下 Share 分享按钮，你就可以保存你在 playground 上写的代码，以便分享或稍后再查看。
  - 快捷方式 `ctrl/cmd s`，会自动将 URL 拷贝到剪切板中，直接粘贴即可分享。
- 可视化的配置：
  - 点击 `TS Config`，会弹出配置界面，每个配置项都有简单的注解说明，更加直观。
  - 对于不熟悉的配置，可以点击侧边的感叹号，可以快速查阅相关配置项的详情信息。
- 其它小技巧：
  - 如果你想要把某个 `.ts` 文件转为 `.js` 文件，可以考虑用它，直接把 ts 代码丢进去即可快速生成等效的 js。
  - 如果你已经获取到了某个接口返回的数据，现在需要为它编写类型信息，用它，直接把数据丢进去，在侧边的 `.D.TS` 中拷贝类型信息即可。
  - ![图 0](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-16-07-52-43.png)

## 4. 🤔 官方 Playground 有什么用？

Playground 是 TypeScript 官方提供的在线编辑器，地址：https://www.typescriptlang.org/play

### 4.1. 核心功能

| 功能     | 用途                | 快捷键/位置        |
| -------- | ------------------- | ------------------ |
| 即时编译 | 实时查看编译后的 JS | 右侧面板           |
| 类型检查 | 查看类型错误提示    | 编辑器内红色波浪线 |
| 配置切换 | 调整编译选项        | 右上角 TS Config   |
| 版本切换 | 测试不同 TS 版本    | 右上角版本选择器   |
| 分享代码 | 生成短链接          | 右上角 Share 按钮  |
| 查看类型 | 悬停查看推断类型    | 鼠标悬停           |
| 导出项目 | 下载为 `.zip`       | Export 菜单        |

### 4.2. 实用场景

::: code-group

```ts [场景 1：快速验证语法]
// 问题：这个类型写法对吗？
type Result<T> = T extends Promise<infer U> ? U : T

// 在 Playground 中：
// 1. 输入代码
// 2. 查看是否有红色波浪线
// 3. 悬停查看具体类型
type A = Result<Promise<string>> // 推断为 string ✅
```

```ts [场景 2：对比不同 TS 版本]
// 问题：satisfies 关键字是哪个版本引入的？
const config = { port: 8080 } satisfies Record<string, number>

// 在 Playground 中：
// 1. 切换到 TS 4.8 → 报错（不支持）
// 2. 切换到 TS 4.9 → 通过（新特性）
```

```ts [场景 3：分享问题代码]
// 场景：在 GitHub Issue 中报告 Bug
// 1. 在 Playground 写复现代码
// 2. 点击 Share 生成链接：https://tsplay.dev/abc123
// 3. 粘贴到 Issue 中，方便维护者调试
```

:::

### 4.3. 高级技巧

```ts
// 技巧 1：查看编译产物的 sourceMap
// 右侧面板切换到 `.d.ts` 查看类型声明

// 技巧 2：使用 Playground 插件
// 例如安装 "TS AST Viewer" 查看抽象语法树

// 技巧 3：导出示例项目
// Export > Download 可获得包含 package.json 的完整项目
```

## 5. 🤔 TS Playground 页面组成结构是？

### 5.1. ⚙️ 头部控件区域

![图 3](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-16-07-54-08.png)

⬇️ ⬇️ ⬇️ 下面分为“左侧区域”和“右侧区域”，对各部分做个简单介绍。

### 5.2. ⚙️ 左侧区域

![图 4](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-16-07-54-19.png)

- TS Config：通过图形化界面的方式来配置 TypeScript
- Examples：提供了一些案例，这些案例介绍了为什么 TypeScript 比 JavaScript 更牛逼
  - ![图 5](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-16-07-54-27.png)
  - 可以点进去瞅一瞅，目前看来也就 18 个，不多……
- Help：在线查阅 TypeScript Playground 的帮助信息
- `v5.2.2`：下拉选择切换版本
- Run：在线运行 TypeScript
  - 表现效果跟 ts-node 的功能非常类似，直接在内存中完成 TypeScript 的编译并运行
- Export：导出按钮
  - 可以展开看看，有不少导出选项，大多应该都不会用到
  - ![图 1](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-16-07-53-43.png)
- Share：分享按钮
  - 点击后，会自动保存代码，并将当前站点的 URL 复制到剪切板中
  - 代码会编码到 URL 中，通过此时保存的这个 URL 就可以访问到当时所写的 TypeScript 代码
  - windows 快捷键：`ctrl + s`
  - mac 快捷键：`cmd + s`

### 5.3. ⚙️ 右侧区域

- ![图 2](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-16-07-53-50.png)
- 查看等效的 JavaScript 代码
- 查看自动生成类型声明文件
- 查看错误信息
- 查看日志信息
- 选用插件列表

## 6. 🧠 学会举一反三

- 当你了解了 TS Playground 之后，那么对于其它前端相关技术，比如 vue、react、…… 是不是也有对应的 Playground 呢？
- 答案是：✅ Yes
- 你只需要打开浏览器搜索关键字 `vue Playground` 或者 `react Playground` 就可以找到官方或者社区搭建的 Playground 工具，以便你快速测试和体验 vue、react 的一些功能。

::: swiper

![vue](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-16-08-07-17.png)

![react](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-16-08-07-23.png)

![tailwind css](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-16-08-07-46.png)

:::

## 7. 🔗 引用

- [TS 官方提供的 playground][1]

[1]: https://www.typescriptlang.org/play
