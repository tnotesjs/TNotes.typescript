# [0010. TS 的编译](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0010.%20TS%20%E7%9A%84%E7%BC%96%E8%AF%91)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 “TypeScript 的编译”是什么？](#3--typescript-的编译是什么)
- [4. 🤔 “TypeScript 的实时类型检查”是什么？不是还没有手动执行 tsc 对 `*.ts` 进行编译吗？为何就出现类型错误的提示呢？【扩展】](#4--typescript-的实时类型检查是什么不是还没有手动执行-tsc-对-ts-进行编译吗为何就出现类型错误的提示呢扩展)
- [5. 🤔 “语言服务”是什么？【扩展】](#5--语言服务是什么扩展)
  - [5.1. 什么是 Language Server（语言服务器）？](#51-什么是-language-server语言服务器)
  - [5.2. VS Code 如何与语言服务器协作？](#52-vs-code-如何与语言服务器协作)
  - [5.3. 举个例子：TypeScript 在 VS Code 中的工作流程](#53-举个例子typescript-在-vs-code-中的工作流程)
  - [5.4. 延伸知识](#54-延伸知识)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- TS 的编译
- TS 的实时类型检查
- TS 语言服务【扩展】

## 2. 🫧 评价

- 本节介绍 TS 中与“编译”这个词有关的，概念性的一些内容。理解本节介绍的点还是蛮重要的，能够帮助我们理解 TS 在跑之前，需要做什么。
- 文中介绍到了“TS 语言服务”可以当做一个扩展知识来看，这个知识点是可以举一反三的，跟 VSCode 的组成原理相关了，在 VSCode 中，很多语言都有对应的服务，以助于开发者在编写对应语言的项目时提供一些便利。

## 3. 🤔 “TypeScript 的编译”是什么？

- JavaScript 的运行环境（浏览器和 Node.js）不认识 TypeScript 代码。所以，TypeScript 项目要想运行，必须先转为 JavaScript 代码，这个代码转换的过程就叫做“TypeScript 的编译”（compile）。
- TypeScript 官方没有提供自己的运行时；它依赖现有的 JavaScript 运行环境（如浏览器、Node.js），官方只提供编译器。编译时，会将类型声明和类型相关的代码全部删除，只留下能运行的 JavaScript 代码，并且不会改变 JavaScript 的运行结果。
- 因此，TypeScript 的类型检查只是编译时的类型检查，而不是运行时的类型检查。一旦代码编译为 JavaScript，运行时就不再检查类型了。

## 4. 🤔 “TypeScript 的实时类型检查”是什么？不是还没有手动执行 tsc 对 `*.ts` 进行编译吗？为何就出现类型错误的提示呢？【扩展】

- 现象描述：
- 在 `*.ts` 模块中，如果出现了类型错误，很多都会立刻就反馈出来，而不是在使用 tsc 将 `*.ts` 转为 `*.js` 时才反馈出来。
- 这些实时错误提示又是怎么来的呢？也是 TS 编译器 tsc 在起作用吗？

---

- 以 VSCode 为例来解释一下上述现象：
- VSCode 默认带有 TS 语言服务，你可以通过命令来重启 TS 服务，比如 ctrl shift p 唤起命令面板 + TypeScript: Restart TS Server 重启 TS 服务器，在重启服务的过程中，观察那些实时报错的类型错误，你会发现服务重启期间，不会有类型报错提示，在服务重启后才会出现。上面提到的这些实时错误提示，就是这个内置的 TS 语言服务在起作用。
- ![图 0](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-16-07-20-47.png)
- 这个 TS 语言服务会根据你的 TS 配置完成初始化，然后实时扫描你编译的 `*.ts` 模块，以便给你实时的类型错误信息，这样就不用等你手动执行 tsc 了，才能发现这些错误。
- 🤔 在 VSCode 中有办法彻底关闭这个服务吗？
- 有
- 在插件面板中搜索：`@builtin typescript`
- ![图 1](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-16-07-20-56.png)
- 然后把它给禁用了，这将彻底关闭 JS 和 TS 的语言服务。
- 也可以在 vscode 的配置文件（比如 .vscode/settings.json）中加上 `"typescript.validate.enable": false`，这将禁用语言检查功能。
- 但是「强烈不推荐」你这么做，猜测你这么干的原因可能是正在迁移 `*.js` 项目到 `*.ts` 项目，但是又不想看到一堆的类型报错信息，这时候你有很多路子来解决“隐藏这些类型报错信息”的问题。比如最简单的，你可以在报错的行前边儿加上 `// @ts-ignore` 那么 TS 服务就不会检查这一行，或者直接在整个模块头部加上 `// @ts-nocheck`，那么 TS 服务就不会检查这个模块。更好一些的做法自然是通过 `tsconfig.json` 配置文件中的 `exclude` 来配置忽略的模块，等你处理完类型问题之后，再将这些模块从 `exclude` 中移除。

---

- 以下是原因分析：
- 这种情况是 TypeScript 的实时类型检查功能，它通常是通过集成开发环境（IDE）或者代码编辑器插件来实现的。这些工具在你编写代码的过程中就实时地进行类型检查，并且在检测到类型错误或其他问题时「立即提供反馈」。这种类型检查是在编译之前的一个步骤，可以看作是"预编译"阶段的类型检查。
- 实时类型检查和 tsc 使用的是同一个 TypeScript 编译器核心，但它们是两个独立的调用方式：
  - tsc 是命令行批处理编译；
  - VS Code 调用的是语言服务（Language Service）API，用于增量、交互式分析；
  - 实时类型检查由 TypeScript 编译器提供的语言服务实现，与 tsc 共享相同的类型检查规则，但发生在开发过程中，而非构建流程中。
  - 因此，实时类型检查反馈的错误信息和你在执行 tsc 时看到的报错的描述信息几乎都是一样的。
- 实时类型检查的这个过程不会更改代码，只是用来提示开发者潜在的错误，帮助你在代码运行之前就捕捉到错误。
- 因此，你可以将这种实时的错误反馈看作是编译阶段的一部分，尽管它发生在你手动触发完整编译过程之前。这是 TypeScript 提供的一个优势，可以加快开发过程并提高代码质量。然而，最终要将 TypeScript 代码转换为 JavaScript 代码，以便在运行环境中执行，这一步仍然需要使用 TypeScript 编译器（tsc）来完成。

## 5. 🤔 “语言服务”是什么？【扩展】

- 这涉及到了 VS Code 的核心架构设计的相关内容。
- TypeScript 语言服务只是 VS Code “语言智能支持”生态中的一个实例。
- 语言服务背后依赖的是一个标准化的协议：Language Server Protocol (LSP)。
- “编辑器 + LSP + 语言服务器” = 可扩展、多语言支持的现代 IDE 架构
  - 这种模式已被广泛采用：
  - Neovim 通过 `nvim-lspconfig` 支持 LSP
  - Sublime Text、Atom、Vim 等也支持 LSP
  - 甚至 GitHub Codespaces、Cursor 等云端/ AI 编辑器也基于此

### 5.1. 什么是 Language Server（语言服务器）？

- 语言服务器是一个独立的进程（通常由语言官方或社区提供），负责理解某种编程语言的语法、语义、类型系统等。
- 它提供诸如以下功能：
  - 语法/语义错误检查（如 TS 的类型错误）
  - 智能补全（IntelliSense）
  - 跳转到定义（Go to Definition）
  - 查找所有引用（Find All References）
  - 重命名符号（Rename）
  - 代码格式化（Formatting）
  - 悬停提示（Hover documentation）
  - 代码折叠、缩进建议
  - …… 等
- 通过 Language Server Protocol (LSP)，VS Code 能够以统一方式集成各种语言的智能功能，实现“一个编辑器，支持所有语言”的愿景。

### 5.2. VS Code 如何与语言服务器协作？

VS Code 本身不直接理解任何编程语言。它通过 Language Server Protocol (LSP) 与各种语言服务器通信：

| 语言 | 对应的语言服务器 | 提供方 |
| --- | --- | --- |
| TypeScript / JavaScript | TypeScript Server (`tsserver`) | TypeScript 官方（Microsoft） |
| Python | Pyright 或 Pylsp | Microsoft / 社区 |
| Go | gopls | Go 官方 |
| Rust | rust-analyzer | Rust 社区 |
| Java | Eclipse JDT.LS | Eclipse |
| C/C++ | clangd 或 C++ IntelliSense (by MS) | LLVM / Microsoft |

这就是为什么 VS Code 能“轻量”却支持上百种语言——语言智能逻辑被抽离到独立服务中，编辑器只负责 UI 和协议通信。

### 5.3. 举个例子：TypeScript 在 VS Code 中的工作流程

1. 你打开一个 `.ts` 文件。
2. VS Code 启动内置的 TypeScript Language Server（即 `tsserver`，来自 TypeScript 编译器包）。
3. 当你输入代码时，VS Code 通过 LSP 发送“文本变更”事件给 `tsserver`。
4. `tsserver` 分析代码，返回：
   - 错误诊断（Diagnostics）
   - 可补全项（Completion Items）
   - 定义位置（Definition Location）等
5. VS Code 渲染这些信息（红线、提示框、跳转等）。

这就是前面提到的：“重启 TS Server 时错误提示消失”——因为语言服务进程被重启了！

### 5.4. 延伸知识

- LSP 是由 Microsoft 在 2016 年提出并开源的，现已成为行业标准。
- 除了 LSP，还有：
  - DAP（Debug Adapter Protocol）：统一调试接口
  - Notebook API：支持 Jupyter 等交互式文档
- VS Code 的成功，很大程度上归功于这些协议驱动的插件化架构。
