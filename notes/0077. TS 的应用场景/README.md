# [0077. TS 的应用场景](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0077.%20TS%20%E7%9A%84%E5%BA%94%E7%94%A8%E5%9C%BA%E6%99%AF)

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
- [5. 🤔 TypeScript 在全栈开发中的应用场景有哪些？](#5--typescript-在全栈开发中的应用场景有哪些)
  - [5.1. Monorepo 全栈架构](#51-monorepo-全栈架构)
  - [5.2. tRPC：端到端类型安全](#52-trpc端到端类型安全)
- [6. 🤔 TypeScript 在工具开发中的应用场景有哪些？](#6--typescript-在工具开发中的应用场景有哪些)
  - [6.1. 编辑器与 IDE](#61-编辑器与-ide)
  - [6.2. 构建工具](#62-构建工具)
  - [6.3. CLI 工具](#63-cli-工具)
  - [6.4. VS Code 插件](#64-vs-code-插件)
- [7. 🤔 各领域对 TypeScript 的采用情况如何？](#7--各领域对-typescript-的采用情况如何)
  - [7.1. 主流框架采用情况](#71-主流框架采用情况)
  - [7.2. 知名项目采用情况](#72-知名项目采用情况)
  - [7.3. 企业采用情况](#73-企业采用情况)
  - [7.4. 趋势分析](#74-趋势分析)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 前端框架与 TypeScript
- 后端开发与 TypeScript
- 全栈应用与 TypeScript
- 工具链与 TypeScript
- 各领域采用情况

## 2. 🫧 评价

TypeScript 的应用场景已经从最初的前端开发扩展到几乎所有 JavaScript 可以运行的领域。从 React/Vue 等前端框架，到 Node.js 后端服务，再到 VS Code 等桌面应用，TypeScript 都展现出了强大的适应性。

特别是在企业级应用、开源项目和工具链开发中，TypeScript 已经成为事实标准。主流框架如 Angular、Vue 3、Nest.js 都采用 TypeScript 作为首选语言，大量知名项目如 VS Code、Deno、Prisma 也都基于 TypeScript 构建。

本节将系统梳理 TypeScript 在各个领域的应用场景，帮助你了解 TypeScript 的实际价值和最佳实践。

## 3. 🤔 TypeScript 在前端开发中的应用场景有哪些？

### 3.1. React 生态

| 场景 | 技术栈 | TypeScript 支持 | 示例 |
| --- | --- | --- | --- |
| UI 开发 | React | ✅ 官方支持 | [React TypeScript Cheatsheet][1] |
| 状态管理 | Redux Toolkit | ✅ 完整类型推断 | `createSlice<State>()` |
| 路由 | React Router | ✅ 类型安全路由 | `useParams<{ id: string }>()` |
| 表单 | React Hook Form | ✅ 类型校验 | `register<FormData>()` |
| 数据请求 | React Query | ✅ 泛型支持 | `useQuery<User>()` |

::: code-group

```tsx [React 组件]
import { FC, useState } from 'react'

interface UserCardProps {
  user: {
    id: number
    name: string
    avatar?: string
  }
  onEdit?: (id: number) => void
}

export const UserCard: FC<UserCardProps> = ({ user, onEdit }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3>{user.name}</h3>
      {isHovered && onEdit && (
        <button onClick={() => onEdit(user.id)}>编辑</button>
      )}
    </div>
  )
}
```

```ts [Redux Toolkit]
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TodoState {
  items: Array<{ id: string; text: string; done: boolean }>
  filter: 'all' | 'active' | 'completed'
}

const todoSlice = createSlice({
  name: 'todos',
  initialState: { items: [], filter: 'all' } as TodoState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.items.push({
        id: Date.now().toString(),
        text: action.payload,
        done: false,
      })
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.items.find((t) => t.id === action.payload)
      if (todo) todo.done = !todo.done
    },
  },
})

// 自动推断 action 类型
export const { addTodo, toggleTodo } = todoSlice.actions
```

:::

### 3.2. Vue 生态

| 场景     | 技术栈     | TypeScript 支持 | 示例                      |
| -------- | ---------- | --------------- | ------------------------- |
| UI 开发  | Vue 3      | ✅ 原生支持     | `defineComponent()`       |
| 状态管理 | Pinia      | ✅ 完整类型推断 | `defineStore<State>()`    |
| 路由     | Vue Router | ✅ 类型安全     | `useRoute<'/user/:id'>()` |
| 构建工具 | Vite       | ✅ 内置支持     | 开箱即用                  |

::: code-group

```vue [Vue 3 组件]
<script setup lang="ts">
import { ref, computed } from 'vue'

interface Todo {
  id: number
  text: string
  done: boolean
}

const props = defineProps<{
  initialTodos?: Todo[]
}>()

const emit = defineEmits<{
  (e: 'update', todos: Todo[]): void
}>()

const todos = ref<Todo[]>(props.initialTodos || [])

const activeTodos = computed(() => todos.value.filter((t) => !t.done))

function addTodo(text: string) {
  todos.value.push({
    id: Date.now(),
    text,
    done: false,
  })
  emit('update', todos.value)
}
</script>
```

```ts [Pinia Store]
import { defineStore } from 'pinia'

interface User {
  id: string
  name: string
  role: 'admin' | 'user'
}

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null as User | null,
    isLoading: false,
  }),

  getters: {
    isAdmin: (state) => state.currentUser?.role === 'admin',
  },

  actions: {
    async fetchUser(id: string) {
      this.isLoading = true
      try {
        const user = await api.getUser(id)
        this.currentUser = user
      } finally {
        this.isLoading = false
      }
    },
  },
})

// 使用时自动推断类型
const store = useUserStore()
store.currentUser?.name // string | undefined
```

:::

### 3.3. Angular 生态

Angular 从一开始就采用 TypeScript 作为首选语言：

```ts
import { Component, Input, Output, EventEmitter } from '@angular/core'

interface Product {
  id: number
  name: string
  price: number
}

@Component({
  selector: 'app-product-list',
  template: `
    <div *ngFor="let product of products">
      <h3>{{ product.name }}</h3>
      <button (click)="onSelect(product)">选择</button>
    </div>
  `,
})
export class ProductListComponent {
  @Input() products: Product[] = []
  @Output() productSelected = new EventEmitter<Product>()

  onSelect(product: Product) {
    this.productSelected.emit(product)
  }
}
```

## 4. 🤔 TypeScript 在后端开发中的应用场景有哪些？

### 4.1. Node.js 框架

| 框架    | 特点       | TypeScript 支持 | 适用场景     |
| ------- | ---------- | --------------- | ------------ |
| Express | 轻量灵活   | ✅ 通过 @types  | RESTful API  |
| Nest.js | 企业级框架 | ✅ 原生支持     | 大型后端应用 |
| Fastify | 高性能     | ✅ 官方支持     | 性能敏感场景 |
| Koa     | 中间件驱动 | ✅ 通过 @types  | 定制化需求   |

::: code-group

```ts [Express + TypeScript]
import express, { Request, Response } from 'express'

interface CreateUserDto {
  name: string
  email: string
}

interface User extends CreateUserDto {
  id: string
  createdAt: Date
}

const app = express()
app.use(express.json())

app.post('/users', (req: Request<{}, {}, CreateUserDto>, res: Response) => {
  const { name, email } = req.body

  // 类型安全的业务逻辑
  const user: User = {
    id: Math.random().toString(36),
    name,
    email,
    createdAt: new Date(),
  }

  res.json(user)
})

app.listen(3000)
```

```ts [Nest.js（原生 TypeScript）]
import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { IsEmail, IsString } from 'class-validator'

// DTO 自动验证
export class CreateUserDto {
  @IsString()
  name: string

  @IsEmail()
  email: string
}

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findById(id)
  }

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.create(dto)
  }
}
```

:::

### 4.2. ORM/数据库

| 工具    | TypeScript 支持 | 特点                     |
| ------- | --------------- | ------------------------ |
| Prisma  | ✅ 类型生成     | 自动生成类型安全的客户端 |
| TypeORM | ✅ 装饰器       | 类似 Hibernate 的体验    |
| Drizzle | ✅ 类型安全     | SQL-like API             |

```ts
// Prisma 示例
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 完全类型安全
const user = await prisma.user.create({
  data: {
    name: 'Alice',
    email: 'alice@example.com',
    posts: {
      create: [{ title: 'Hello World' }, { title: 'TypeScript is awesome' }],
    },
  },
  include: {
    posts: true, // 自动推断返回类型包含 posts
  },
})

// user 类型：User & { posts: Post[] }
```

## 5. 🤔 TypeScript 在全栈开发中的应用场景有哪些？

### 5.1. Monorepo 全栈架构

```
my-app/
├── packages/
│   ├── shared/           # 共享类型定义
│   │   └── types/
│   │       └── User.ts
│   ├── frontend/         # React/Vue 前端
│   │   └── src/
│   └── backend/          # Node.js 后端
│       └── src/
└── package.json
```

::: code-group

```ts [shared/types/User.ts]
// 前后端共享的类型定义
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

export interface CreateUserDto {
  name: string
  email: string
}

export interface LoginDto {
  email: string
  password: string
}
```

```ts [backend/src/user.controller.ts]
import { CreateUserDto, User } from '@my-app/shared'

export class UserController {
  async create(dto: CreateUserDto): Promise<User> {
    // ✅ 类型安全：dto 和返回值都有类型保证
    return this.userService.create(dto)
  }
}
```

```ts [frontend/src/api/user.ts]
import { CreateUserDto, User } from '@my-app/shared'

export async function createUser(dto: CreateUserDto): Promise<User> {
  // ✅ 类型安全：请求和响应都有类型保证
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(dto),
  })
  return response.json()
}
```

:::

### 5.2. tRPC：端到端类型安全

```ts
// server/router.ts
import { initTRPC } from '@trpc/server'
import { z } from 'zod'

const t = initTRPC.create()

export const appRouter = t.router({
  getUser: t.procedure.input(z.string()).query(({ input }) => {
    return { id: input, name: 'Alice' }
  }),

  createUser: t.procedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
      })
    )
    .mutation(({ input }) => {
      return { id: '123', ...input }
    }),
})

export type AppRouter = typeof appRouter

// client/api.ts
import { createTRPCProxyClient } from '@trpc/client'
import type { AppRouter } from '../server/router'

const client = createTRPCProxyClient<AppRouter>({
  // ...
})

// ✅ 完全类型安全，无需手动定义接口
const user = await client.getUser.query('123')
// user 类型自动推断为：{ id: string; name: string }

const newUser = await client.createUser.mutate({
  name: 'Bob',
  email: 'bob@example.com',
})
// newUser 类型自动推断
```

## 6. 🤔 TypeScript 在工具开发中的应用场景有哪些？

### 6.1. 编辑器与 IDE

| 项目          | 用途       | TypeScript 占比 |
| ------------- | ---------- | --------------- |
| VS Code       | 代码编辑器 | ~95% TypeScript |
| Monaco Editor | Web 编辑器 | 100% TypeScript |
| Theia         | 云端 IDE   | ~90% TypeScript |

### 6.2. 构建工具

| 工具      | 用途           | TypeScript 支持 |
| --------- | -------------- | --------------- |
| Vite      | 前端构建       | ✅ 内置支持     |
| esbuild   | 极速打包       | ✅ 支持编译     |
| Turbopack | Next.js 打包器 | ✅ Rust + TS    |
| Rollup    | 库打包         | ✅ 插件支持     |

### 6.3. CLI 工具

```ts
// 使用 Commander.js 构建 CLI
import { Command } from 'commander'
import { z } from 'zod'

const program = new Command()

// 类型安全的选项定义
interface DeployOptions {
  env: 'dev' | 'prod'
  force?: boolean
}

program
  .command('deploy')
  .option('-e, --env <env>', '环境', 'dev')
  .option('-f, --force', '强制部署')
  .action((options: DeployOptions) => {
    // ✅ options 有完整类型提示
    console.log(`部署到 ${options.env}`)
  })

program.parse()
```

### 6.4. VS Code 插件

```ts
// extension.ts
import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  // ✅ 完整的 API 类型定义
  const disposable = vscode.commands.registerCommand(
    'myExtension.helloWorld',
    () => {
      vscode.window.showInformationMessage('Hello from TypeScript!')
    }
  )

  context.subscriptions.push(disposable)
}
```

## 7. 🤔 各领域对 TypeScript 的采用情况如何？

### 7.1. 主流框架采用情况

| 框架/库 | 原生支持 TypeScript | 迁移时间 | 备注                    |
| ------- | ------------------- | -------- | ----------------------- |
| Angular | ✅ 从一开始         | 2016     | 完全基于 TS             |
| Vue 3   | ✅ 重写             | 2020     | 从 Flow 迁移            |
| React   | ⚠️ 官方类型定义     | -        | 本身是 JS，@types/react |
| Svelte  | ✅ 官方支持         | 2020     | 通过预处理器            |
| Nest.js | ✅ 从一开始         | 2017     | 完全基于 TS             |
| Next.js | ✅ 官方支持         | 2019     | 开箱即用                |
| Nuxt 3  | ✅ 原生支持         | 2022     | 完全重写                |

### 7.2. 知名项目采用情况

| 项目    | 领域       | TypeScript 使用 |
| ------- | ---------- | --------------- |
| VS Code | 编辑器     | 95%+            |
| Deno    | 运行时     | 100%            |
| Prisma  | ORM        | 100%            |
| Redux   | 状态管理   | 100% (4.x+)     |
| RxJS    | 响应式编程 | 100%            |
| TypeORM | ORM        | 100%            |
| Jest    | 测试框架   | 部分            |

### 7.3. 企业采用情况

```
顶级科技公司 TypeScript 采用率：
──────────────────────────────
Microsoft    ████████████ 100%
Google       ██████████░░  85%
Meta         ████████░░░░  70%
Airbnb       ██████████░░  85%
Slack        ████████████ 100%
Shopify      ██████████░░  85%

中国互联网公司：
──────────────────────────────
阿里巴巴      ████████░░░░  70%
腾讯         ██████░░░░░░  50%
字节跳动      ██████████░░  85%
美团         ████████░░░░  70%
```

### 7.4. 趋势分析

```
npm 下载量趋势（相对于 JavaScript 总量）：
──────────────────────────────
2018    ████░░░░░░░░░░░  20%
2019    ██████░░░░░░░░░  30%
2020    ████████░░░░░░░  45%
2021    ██████████░░░░░  60%
2022    ████████████░░░  70%
2023    ██████████████░  80%
2024    ███████████████  85%

Stack Overflow 调查：
──────────────────────────────
开发者最想使用的语言
TypeScript 连续多年前三
```

## 8. 🔗 引用

- [React TypeScript Cheatsheet][1]
- [Vue 3 TypeScript 支持][2]
- [Nest.js 官方文档][3]
- [Prisma 文档][4]
- [tRPC 文档][5]

[1]: https://react-typescript-cheatsheet.netlify.app/
[2]: https://vuejs.org/guide/typescript/overview.html
[3]: https://docs.nestjs.com/
[4]: https://www.prisma.io/docs
[5]: https://trpc.io/
