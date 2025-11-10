# [0077. TS 在前、后端领域的应用](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0077.%20TS%20%E5%9C%A8%E5%89%8D%E3%80%81%E5%90%8E%E7%AB%AF%E9%A2%86%E5%9F%9F%E7%9A%84%E5%BA%94%E7%94%A8)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 TypeScript 在前端开发中的应用场景有哪些？](#3--typescript-在前端开发中的应用场景有哪些)
  - [3.1. React 生态](#31-react-生态)
  - [3.2. Vue 生态](#32-vue-生态)
  - [3.3. Angular 生态](#33-angular-生态)
- [4. 🤔 TypeScript 在后端开发中的应用场景有哪些？](#4--typescript-在后端开发中的应用场景有哪些)
  - [4.1. Node.js 框架](#41-nodejs-框架)
  - [4.2. ORM/数据库](#42-orm数据库)
- [5. 🔗 引用](#5--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- TS 在前、后端领域的应用

## 2. 🫧 评价

TypeScript 的应用场景已经从最初的前端开发扩展到几乎所有 JavaScript 可以运行的领域。从 React/Vue 等前端框架，到 Node.js 后端服务，再到 VS Code 等桌面应用，TypeScript 都展现出了强大的适应性。

特别是在企业级应用、开源项目和工具链开发中，TypeScript 已经成为事实标准。主流框架如 Angular、Vue 3、Nest.js 都采用 TypeScript 作为首选语言，大量知名项目如 VS Code、Deno、Prisma 也都基于 TypeScript 构建。

本节将系统梳理 TypeScript 在前、后端领域的应用场景，帮助你了解 TypeScript 的实际价值和最佳实践。

## 3. 🤔 TypeScript 在前端开发中的应用场景有哪些？

### 3.1. React 生态

| 技术栈 | 简介 | TS 支持 |
| --- | --- | --- |
| [React][8] | JavaScript UI 库，用于构建组件化用户界面，特别适合构建单页应用程序 | ✅ 官方支持 |
| [Redux Toolkit][7] | Redux 的官方推荐工具集，简化状态管理，提供更好的开发体验和代码结构 | ✅ 官方支持 |
| [React Router][6] | React 的路由管理库，用于实现客户端路由和导航功能 | ✅ 官方支持 |
| [React Hook Form][9] | 基于 React Hooks 的高性能表单管理库，提供类型安全的表单处理和验证 | ✅ 官方支持 |
| [React Query][10] | 用于数据获取和服务器状态管理的库，提供缓存、同步和后台更新等强大功能 | ✅ 官方支持 |

### 3.2. Vue 生态

| 技术栈 | 简介 | TS 支持 |
| --- | --- | --- |
| [Vue 3][11] | JavaScript 框架，用于构建用户界面和单页应用，采用响应式数据绑定和组件化架构 | ✅ 官方支持 |
| [Pinia][12] | Vue 的官方状态管理库，替代 Vuex，提供更简洁的 API 和更好的 TS 支持 | ✅ 官方支持 |
| [Vue Router][13] | Vue 的官方路由管理库，用于构建单页应用的路由系统 | ✅ 官方支持 |
| [Vite][14] | 下一代前端构建工具，提供快速的冷启动和即时的热更新 | ✅ 官方支持 |

### 3.3. Angular 生态

Angular 2 及更高版本从一开始就采用 TypeScript 作为首选语言。

- AngularJS（1.x）：最初的 Angular 版本（2010 年发布）是用 JavaScript 编写的，不使用 TypeScript
- Angular（2+）：从 Angular 2 开始（2016 年 9 月正式发布），Google 团队完全重写了框架，并从一开始就采用 TypeScript 作为主要开发语言

历史背景：

- 2014 年：Google 宣布正在开发 Angular 2，并决定采用 TypeScript（当时称为 AtScript）
- 2016 年：Angular 2 正式发布，TypeScript 成为其官方推荐语言
- Angular 团队甚至参与了 TypeScript 的开发，与 Microsoft 密切合作

Angular 团队选择 TypeScript 的原因包括：

- 更好的工具支持
- 静态类型检查
- 面向对象编程能力
- 装饰器语法对框架设计的支持
- 与 ECMAScript 标准的兼容性

## 4. 🤔 TypeScript 在后端开发中的应用场景有哪些？

### 4.1. Node.js 框架

| 框架 | 简介 | TS 支持 |
| --- | --- | --- |
| [Express][15] | 轻量灵活的 Node.js Web 应用框架，提供强大的特性用于开发 Web 和移动应用 | ✅ 通过 @types |
| [Nest.js][16] | 企业级框架，基于 TypeScript 构建，采用模块化设计，支持依赖注入 | ✅ 官方支持 |
| [Fastify][17] | 高性能 Web 框架，注重速度和低开销，提供优秀的插件架构 | ✅ 官方支持 |
| [Koa][18] | 由 Express 团队开发的下一代框架，利用 async 函数简化错误处理 | ✅ 通过 @types |
| [Egg][19] | 企业级 Node.js 框架，由阿里巴巴团队开发，提供完整解决方案 | ✅ 官方支持 |

### 4.2. ORM/数据库

| 工具 | 简介 | TS 支持 |
| --- | --- | --- |
| [Prisma][20] | 现代化的 ORM，通过类型安全的查询构建器和自动生成的客户端提供数据库访问 | ✅ 官方支持 |
| [TypeORM][21] | 受 Hibernate 启发的 ORM，支持 Active Record 和 Data Mapper 模式，提供装饰器 API | ✅ 官方支持 |
| [Drizzle][22] | 轻量级 SQL 查询构建器，提供类型安全的 SQL-like API，注重性能和类型推断 | ✅ 官方支持 |

## 5. 🔗 引用

- [React TypeScript Cheatsheet][1]
- [Vue 3 TS 支持][2]
- [Nest.js 官方文档][3]
- [Prisma 文档][4]
- [tRPC 文档][5]
- [React Router GitHub 仓库][6]
- [Redux Toolkit GitHub 仓库][7]
- [React GitHub 仓库][8]
- [React Hook Form GitHub 仓库][9]
- [TanStack Query（原 React Query） GitHub 仓库][10]

[1]: https://react-typescript-cheatsheet.netlify.app/
[2]: https://vuejs.org/guide/typescript/overview.html
[3]: https://docs.nestjs.com/
[4]: https://www.prisma.io/docs
[5]: https://trpc.io/
[6]: https://github.com/remix-run/react-router
[7]: https://github.com/reduxjs/redux-toolkit
[8]: https://github.com/facebook/react
[9]: https://github.com/react-hook-form/react-hook-form
[10]: https://github.com/TanStack/query
[11]: https://github.com/vuejs/core
[12]: https://github.com/vuejs/pinia
[13]: https://github.com/vitejs/vite
[14]: https://github.com/vuejs/router
[15]: https://github.com/expressjs/express
[16]: https://github.com/nestjs/nest
[17]: https://github.com/fastify/fastify
[18]: https://github.com/koajs/koa
[19]: https://github.com/eggjs/egg
[20]: https://github.com/prisma/prisma
[21]: https://github.com/typeorm/typeorm
[22]: https://github.com/drizzle-team/drizzle-orm
