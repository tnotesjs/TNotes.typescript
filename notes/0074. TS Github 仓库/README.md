# [0074. TS Github 仓库](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0074.%20TS%20Github%20%E4%BB%93%E5%BA%93)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 TypeScript GitHub 仓库包含哪些内容？](#3--typescript-github-仓库包含哪些内容)
  - [3.1. 核心组成部分](#31-核心组成部分)
  - [3.2. 重要文件和目录](#32-重要文件和目录)
- [4. 🤔 如何利用 Issues 模块？](#4--如何利用-issues-模块)
  - [4.1. Issue 标签分类](#41-issue-标签分类)
  - [4.2. 搜索 Issue 的技巧](#42-搜索-issue-的技巧)
    - [查看已知的 Bug](#查看已知的-bug)
    - [查看已批准但未实现的特性](#查看已批准但未实现的特性)
    - [查找已知的性能问题](#查找已知的性能问题)
    - [查看社区投票最多的提议](#查看社区投票最多的提议)
    - [更多查询技巧](#更多查询技巧)
  - [4.3. 提交 Issue 的最佳实践](#43-提交-issue-的最佳实践)
- [5. 🤔 给 TS 项目贡献代码流程是？](#5--给-ts-项目贡献代码流程是)
- [6. 🤔 如何查看、撰写 TypeScript 设计提案（Design Proposals）？](#6--如何查看撰写-typescript-设计提案design-proposals)
- [7. 🤔 如何查看 TS 新版的开发进度？](#7--如何查看-ts-新版的开发进度)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- TypeScript GitHub 仓库结构
- Issues 的使用简介
- 贡献流程简介
- 设计提案（Design Proposals）
- 里程碑（Milestones）

## 2. 🫧 评价

TypeScript 的 GitHub 仓库（[microsoft/TypeScript][16]）是了解 TypeScript 发展动态、报告问题、参与社区的核心平台。

相比官方文档，GitHub 仓库的价值在于：

1. 透明度：可以看到所有开发决策的讨论过程
2. 实时性：新特性的提案和进度都在这里公开
3. 互动性：可以直接向核心团队反馈问题
4. 学习性：阅读源码和 PR 是深入理解 TS 的最佳途径

虽然仓库内容偏技术性，但它是解决疑难问题、了解设计理念的最佳资源。建议进阶开发者定期关注 Issues 和 Discussions。

## 3. 🤔 TypeScript GitHub 仓库包含哪些内容？

### 3.1. 核心组成部分

| 组成部分      | 用途                  | 访问地址  |
| ------------- | --------------------- | --------- |
| Issues        | Bug 报告、功能请求    | [链接][1] |
| Pull Requests | 代码提交、功能开发    | [链接][3] |
| Projects      | 开发路线图、完成进度  | [链接][4] |
| Wiki          | 贡献指南、架构文档    | [链接][5] |
| Releases      | 版本发布历史          | [链接][6] |
| src/          | TypeScript 编译器源码 | [链接][7] |

### 3.2. 重要文件和目录

```txt
TypeScript/
├── src/                            # 源代码目录
│   ├── compiler/                   # 编译器核心
│   │   ├── parser.ts               # 语法解析器
│   │   ├── scanner.ts              # 词法扫描器
│   │   ├── binder.ts               # 符号绑定
│   │   ├── checker.ts              # 类型检查器
│   │   ├── emitter.ts              # 代码生成器
│   │   ├── program.ts              # 程序管理
│   │   ├── types.ts                # 类型定义
│   │   ├── utilities.ts            # 工具函数
│   │   ├── moduleNameResolver.ts   # 模块解析
│   │   ├── commandLineParser.ts    # 命令行解析
│   │   ├── diagnosticMessages.json # 诊断消息
│   │   └── sys.ts                  # 系统接口
│   │
│   ├── services/                   # 语言服务(IDE支持)
│   │   ├── services.ts             # 语言服务主入口
│   │   ├── completions.ts          # 代码补全
│   │   ├── goToDefinition.ts       # 跳转定义
│   │   ├── findAllReferences.ts    # 查找引用
│   │   ├── utilities.ts            # 服务工具函数
│   │   ├── types.ts                # 服务类型定义
│   │   └── codefixes/              # 代码修复
│   │       ├── importFixes.ts
│   │       └── fixCannotFindModule.ts
│   │
│   ├── server/                     # TSServer(编辑器服务器)
│   │   ├── session.ts              # 会话管理
│   │   ├── editorServices.ts       # 编辑器服务
│   │   ├── project.ts              # 项目管理
│   │   └── protocol.ts             # 通信协议
│   │
│   ├── tsc/                        # 命令行编译器入口
│   │   └── tsc.ts
│   │
│   ├── tsserver/                   # TSServer入口
│   ├── lib/                        # 内置类型声明文件
│   ├── harness/                    # 测试框架
│   └── testRunner/                 # 测试运行器
│
├── tests/                          # 测试用例
│   ├── cases/                      # 测试案例
│   │   ├── compiler/               # 编译器测试
│   │   ├── conformance/            # 规范测试
│   │   └── fourslash/              # 语言服务测试
│   └── baselines/                  # 基准输出
│
├── built/                          # 构建输出目录
│   └── local/                      # 本地构建
│
├── scripts/                        # 构建脚本
├── Herebyfile.mjs                  # 构建配置
├── package.json                    # 项目配置
├── CONTRIBUTING.md                 # 贡献指南
└── README.md                       # 项目说明
```

## 4. 🤔 如何利用 Issues 模块？

### 4.1. Issue 标签分类

| Label 标签          | 含义       | 适用场景                                 |
| ------------------- | ---------- | ---------------------------------------- |
| Bug                 | 编译器 Bug | 遇到明确的错误行为                       |
| Suggestion          | 功能建议   | 提议新特性或改进                         |
| Question            | 使用疑问   | 不确定是否是 Bug（应优先去 Discussions） |
| Design Limitation   | 设计限制   | TypeScript 有意为之的行为                |
| Working as Intended | 按预期工作 | 不是 Bug，是正确行为                     |
| Duplicate           | 重复问题   | 已有相同 Issue                           |

你可以在 Issues 面板中输入 `label:xxx` 来查看都有哪些 Label，可以在 Label 面板中查看关于该 Label 的描述信息。

![img](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-02-13-56-45.png)

### 4.2. 搜索 Issue 的技巧

#### 查看已知的 Bug

`is:issue label:Bug is:open`，查询现在的一些已知问题。

![img](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-05-07-55-02.png)

也可以加上更加具体的关键字，比如 generics，`is:issue label:Bug is:open generics`，这样就是查询具体查询跟泛型相关的 bug。

![img](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-05-07-55-31.png)

#### 查看已批准但未实现的特性

`is:issue label:Suggestion label:Committed`，查询接下来会实现的新特性。

![img](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-05-07-58-11.png)

#### 查找已知的性能问题

`is:issue label:"Domain: Performance"`

![img](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-05-07-59-25.png)

#### 查看社区投票最多的提议

`is:issue label:Suggestion sort:reactions-+1-desc`

![img](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-05-08-00-04.png)

目前（25.11）排名第一的是 [#6579][20]

![img](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-02-14-09-30.png)

#### 更多查询技巧

更多查询技巧，可以参考 [GitHub 搜索技巧][18]。

### 4.3. 提交 Issue 的最佳实践

::: code-group

<<< ./assets/1.txt {md} [✅ 好的 Bug 报告]

<<< ./assets/2.txt {md} [❌ 坏的 Bug 报告]

:::

好的报告能让你的问题更好的被维护人员理解，并更快得到解决。

其实，如果你确实有问题需要反馈，只需要点击【New Issue】按钮，然后按照官方提供的 Issues 模板填写信息就行了，不需要刻意去记怎么写才更加规范。

## 5. 🤔 给 TS 项目贡献代码流程是？

通用的 PR 流程：

1. Fork 仓库
2. 创建分支
3. 修改代码
4. 添加测试
5. 运行测试
6. 提交 PR
7. 代码审查
8. 合并

准备工作：

```bash
# 1. Fork 并克隆仓库
git clone https://github.com/YOUR_USERNAME/TypeScript.git
cd TypeScript

# 2. 安装依赖
npm install

# 3. 构建项目
npm run build

# 4. 运行测试
npm test
```

## 6. 🤔 如何查看、撰写 TypeScript 设计提案（Design Proposals）？

重要提案通常以 Issue 形式存在，标签为 `Suggestion` + `Committed`，你可以在 Issue 中查看社区成员的交流讨论。一定程度上可以帮你更好地了解 TS 某个新特性具体是如何被提出、讨论、并落地实现的。

经典提案示例：

| 提案                   | Issue        | 版本 | 核心内容         |
| ---------------------- | ------------ | ---- | ---------------- |
| Template Literal Types | [#40336][8]  | 4.1  | 模板字符串类型   |
| Variadic Tuple Types   | [#39094][9]  | 4.0  | 可变元组类型     |
| `satisfies` Operator   | [#47920][10] | 4.9  | satisfies 关键字 |
| Const Type Parameters  | [#51865][11] | 5.0  | const 泛型参数   |

如果你也有好的提案，想要让 TS 提供支持的话，可以参考官方的这篇文档：[Writing Good Design Proposals][19]，可以帮你了解撰写提案的一些规范。

## 7. 🤔 如何查看 TS 新版的开发进度？

每个 TypeScript 版本都有对应的 Milestones（里程碑），可以查看：

- 计划包含的功能
- 已完成的 PR
- 待解决的 Issue

访问链接 👉 [Milestones 页面][13]

![Milestones](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-31-13-47-12.png)

## 8. 🔗 引用

- [TypeScript GitHub 仓库][16]
- [Issues][1]
- [Design Meeting Notes][12]
- [贡献指南][17]

[1]: https://github.com/microsoft/TypeScript/issues
[3]: https://github.com/microsoft/TypeScript/pulls
[4]: https://github.com/microsoft/TypeScript/projects
[5]: https://github.com/microsoft/TypeScript/wiki
[6]: https://github.com/microsoft/TypeScript/releases
[7]: https://github.com/microsoft/TypeScript/tree/main/src
[8]: https://github.com/microsoft/TypeScript/issues/40336
[9]: https://github.com/microsoft/TypeScript/issues/39094
[10]: https://github.com/microsoft/TypeScript/issues/47920
[11]: https://github.com/microsoft/TypeScript/issues/51865
[12]: https://github.com/microsoft/TypeScript/wiki/Design-Meeting-Notes
[13]: https://github.com/microsoft/TypeScript/milestones
[16]: https://github.com/microsoft/TypeScript
[17]: https://github.com/microsoft/TypeScript/blob/main/CONTRIBUTING.md
[18]: https://docs.github.com/en/search-github/getting-started-with-searching-on-github/about-searching-on-github
[19]: https://github.com/microsoft/TypeScript/wiki/Writing-Good-Design-Proposals
[20]: https://github.com/microsoft/TypeScript/issues/6579
