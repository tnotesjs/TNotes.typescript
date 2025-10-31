# [0012. tsc 快速入门](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0012.%20tsc%20%E5%BF%AB%E9%80%9F%E5%85%A5%E9%97%A8)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 tsc 是什么？](#3--tsc-是什么)
- [4. 🤔 如何安装和验证 tsc 编译器？](#4--如何安装和验证-tsc-编译器)
- [5. 🤔 如何获取 tsc 命令的帮助信息？](#5--如何获取-tsc-命令的帮助信息)
- [6. 🤔 如何使用 tsc 编译单个或多个 TypeScript 文件？](#6--如何使用-tsc-编译单个或多个-typescript-文件)
- [7. 🤔 tsc 有哪些常用的编译选项？](#7--tsc-有哪些常用的编译选项)
- [8. 🤔 TypeScript 编译出错时会发生什么？](#8--typescript-编译出错时会发生什么)
- [9. 🤔 如何使用 tsconfig.json 配置文件？](#9--如何使用-tsconfigjson-配置文件)
- [10. 🤔 tsconfig.json 配置文件的作用是什么？](#10--tsconfigjson-配置文件的作用是什么)
- [11. 🤔 tsconfig.json 和 tsc 之间的关系是？](#11--tsconfigjson-和-tsc-之间的关系是)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- tsc
- tsconfig.json

## 2. 🫧 评价

- 本节主要对 tsc 和 tsconfig.json 做一个简单的介绍，接下来的学习过程中会接触到 ts 配置和 ts 编译相关的知识点。
- 对于 tsc 和 tsconfig.json 的具体细节，比如都有哪些配置，每个配置的具体作用，会在后续内容中详细介绍。

## 3. 🤔 tsc 是什么？

- tsc 是 TypeScript Compiler 的缩写，是 TypeScript 官方提供的编译器工具。它的主要作用是将 TypeScript 代码编译成 JavaScript 代码，使 TypeScript 能够在各种 JavaScript 运行环境中执行。
- TypeScript 是 JavaScript 的超集，添加了静态类型检查等功能，但浏览器和 Node.js 等环境无法直接执行 TypeScript 代码，因此需要使用 tsc 将其编译为标准的 JavaScript 代码。
- tsc 不仅仅是一个简单的编译器，它还提供了丰富的编译选项和配置功能，允许开发者根据项目需求定制编译行为，如指定目标 JavaScript 版本、模块系统、输出目录等。

## 4. 🤔 如何安装和验证 tsc 编译器？

- tsc 是 TypeScript 官方提供的编译器，需要通过 npm 进行安装。可以使用以下命令全局安装：

```bash
npm install -g typescript
# 安装 typescript 会自动安装它的编译器 tsc
```

- 安装完成后，可以通过以下命令验证是否安装成功：

```bash
tsc -v
# 或者
tsc --version
```

- 示例：
- ![图 0](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-16-12-22-19.png)

## 5. 🤔 如何获取 tsc 命令的帮助信息？

- tsc 提供了帮助命令来查看可用选项：

```bash
tsc -h
# 或者
tsc --help
```

::: details 输出示例

<<< ./assets/tsc.help.output.txt {bash}

:::

- 如果需要查看完整的帮助信息，可以使用：

```bash
tsc --all
```

::: details 输出示例

<<< ./assets/tsc.all.output.txt {bash}

:::

## 6. 🤔 如何使用 tsc 编译单个或多个 TypeScript 文件？

- 编译单个 TypeScript 文件非常简单，只需执行：

```bash
tsc app.ts
# 这将在当前目录生成对应的 app.js 文件
```

- 编译多个文件可以一次性指定多个文件：

```bash
tsc file1.ts file2.ts file3.ts
# 这将分别生成 file1.js、file2.js 和 file3.js 文件
```

## 7. 🤔 tsc 有哪些常用的编译选项？

- tsc 提供了多个编译选项来控制编译行为，这里先简单认识几个常用的：

```bash
# --outFile 将多个 TypeScript 文件编译成一个 JavaScript 文件
tsc file1.ts file2.ts --outFile app.js

# --outDir 指定编译结果的输出目录
tsc app.ts --outDir dist

# --target 指定编译后的 JavaScript 版本
tsc --target es2015 app.ts

# --module 指定生成的模块系统类型
tsc --module commonjs app.ts

# --watch 或 -w 监听文件变化并自动重新编译
tsc --watch app.ts

# --strict 启用所有严格的类型检查选项
tsc --strict app.ts

# --lib 指定要包含在编译中的库文件
tsc --lib es2015,dom app.ts

# --declaration 生成相应的 .d.ts 声明文件
tsc --declaration app.ts

# --sourceMap 生成相应的 .map 文件，便于调试
tsc --sourceMap app.ts

# --noEmit 只进行类型检查，不生成输出文件
tsc --noEmit app.ts

# --esModuleInterop 允许从没有设置默认导出的模块中导入
tsc --esModuleInterop app.ts

# --allowJs 允许编译 JavaScript 文件
tsc --allowJs app.js

# --checkJs 报告 JavaScript 文件中的错误（与 --allowJs 配合使用）
tsc --allowJs --checkJs app.js
```

## 8. 🤔 TypeScript 编译出错时会发生什么？

- 当 TypeScript 代码存在类型错误时，`tsc` 命令会显示错误信息，但仍会生成 JavaScript 文件。例如：

```ts
let foo: number = 123
foo = 'abc' // 类型错误
```

- 编译时会显示错误信息，但仍然生成 `app.js` 文件。
- 如果希望在出错时停止编译并不生成文件，可以使用：

```bash
tsc --noEmitOnError app.ts
```

- 如果只想检查类型错误而不生成文件，可以使用：

```bash
tsc --noEmit app.ts
```

## 9. 🤔 如何使用 tsconfig.json 配置文件？

- TypeScript 支持使用 tsconfig.json 文件来配置编译选项。当目录中存在此文件时，直接运行 `tsc` 命令即可自动读取配置。
- 例如，将以下命令：

```bash
tsc file1.ts file2.ts --outFile dist/app.js
```

- 转换为 tsconfig.json 配置：

```json
{
  "files": ["file1.ts", "file2.ts"],
  "compilerOptions": {
    "outFile": "dist/app.js"
  }
}
```

- 然后只需运行：

```bash
tsc
```

## 10. 🤔 tsconfig.json 配置文件的作用是什么？

tsconfig.json 是 TypeScript 项目的配置文件，它的主要作用包括：

- 集中管理编译选项：将所有编译配置集中在一个文件中，避免每次编译时都需要输入大量命令行参数
- 项目级配置：为整个 TypeScript 项目提供统一的编译设置，确保团队成员使用相同的编译配置
- 自动化编译：当目录中存在 tsconfig.json 文件时，直接运行 `tsc` 命令即可自动读取配置并编译项目
- IDE 支持：现代编辑器和 IDE 会读取 tsconfig.json 来提供智能提示、错误检查和自动补全等功能
- 构建工具集成：与其他构建工具（如 webpack、gulp 等）集成时，这些工具会参考 tsconfig.json 的配置

通过 tsconfig.json，开发者可以配置包括编译目标、模块系统、输出目录、包含/排除文件、严格模式等在内的各种选项，实现项目级的 TypeScript 编译管理。

## 11. 🤔 tsconfig.json 和 tsc 之间的关系是？

- 配置与执行的关系：tsconfig.json 是配置文件，定义了编译选项和项目设置；tsc 是执行引擎，读取并应用这些配置来完成实际的编译工作
- 默认读取机制：当运行 `tsc` 命令时，如果当前目录存在 tsconfig.json 文件，tsc 会自动读取其中的配置，无需手动指定编译选项
- 命令行优先级：命令行参数的优先级高于 tsconfig.json 中的配置，可以在运行 tsc 时通过命令行参数覆盖配置文件中的设置
- 项目管理：tsconfig.json 使得 tsc 能够理解项目的整体结构，包括哪些文件需要编译、如何处理模块、使用什么 JavaScript 版本等
- 简化操作：通过 tsconfig.json，开发者只需要运行简单的 `tsc` 命令就能完成复杂的编译任务，而不需要每次都输入长串的命令行参数
- 团队协作：tsconfig.json 确保团队成员使用一致的编译配置，tsc 则保证在不同环境下都能按照相同规则执行编译

总的来说，tsconfig.json 提供配置，tsc 执行编译，两者配合实现了 TypeScript 项目的标准化编译流程。
