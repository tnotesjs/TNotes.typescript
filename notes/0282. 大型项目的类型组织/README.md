# [0282. 大型项目的类型组织](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0282.%20%E5%A4%A7%E5%9E%8B%E9%A1%B9%E7%9B%AE%E7%9A%84%E7%B1%BB%E5%9E%8B%E7%BB%84%E7%BB%87)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 类型文件组织？](#3--类型文件组织)
  - [3.1. 按功能域划分](#31-按功能域划分)
  - [3.2. 类型文件示例](#32-类型文件示例)
  - [3.3. 使用路径别名](#33-使用路径别名)
- [4. 🤔 模块边界管理？](#4--模块边界管理)
  - [4.1. 定义公共接口](#41-定义公共接口)
  - [4.2. 避免循环依赖](#42-避免循环依赖)
  - [4.3. 使用依赖注入](#43-使用依赖注入)
- [5. 🤔 共享类型库？](#5--共享类型库)
  - [5.1. 创建类型包](#51-创建类型包)
  - [5.2. 版本化发布](#52-版本化发布)
  - [5.3. 在项目中使用](#53-在项目中使用)
- [6. 🤔 类型版本管理？](#6--类型版本管理)
  - [6.1. 向后兼容的更改](#61-向后兼容的更改)
  - [6.2. 破坏性更改](#62-破坏性更改)
  - [6.3. 使用版本命名空间](#63-使用版本命名空间)
- [7. � 最佳实践？](#7--最佳实践)
  - [7.1. 文档化类型](#71-文档化类型)
  - [7.2. 使用工具类型](#72-使用工具类型)
  - [7.3. 类型测试](#73-类型测试)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 类型文件组织
- 模块边界管理
- 共享类型库
- 类型版本管理
- 最佳实践

## 2. 🫧 评价

大型项目需要清晰的类型组织策略。

- 按功能域划分类型
- 避免循环依赖
- 使用命名空间隔离
- 共享类型独立包管理
- 版本化类型定义

## 3. 🤔 类型文件组织？

清晰的文件结构便于维护。

### 3.1. 按功能域划分

```
src/
├── types/
│   ├── index.ts           # 导出所有类型
│   ├── common/            # 通用类型
│   │   ├── index.ts
│   │   ├── http.ts        # HTTP 相关
│   │   ├── errors.ts      # 错误类型
│   │   └── utils.ts       # 工具类型
│   ├── user/              # 用户域
│   │   ├── index.ts
│   │   ├── models.ts      # 用户模型
│   │   ├── api.ts         # API 类型
│   │   └── events.ts      # 事件类型
│   └── product/           # 产品域
│       ├── index.ts
│       ├── models.ts
│       └── api.ts
├── modules/
│   ├── user/
│   │   ├── UserService.ts
│   │   └── UserRepository.ts
│   └── product/
│       ├── ProductService.ts
│       └── ProductRepository.ts
```

### 3.2. 类型文件示例

```typescript
// types/common/http.ts
export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

// types/common/errors.ts
export enum ErrorCode {
  ValidationError = 'VALIDATION_ERROR',
  NotFound = 'NOT_FOUND',
  Unauthorized = 'UNAUTHORIZED',
}

export interface AppError {
  code: ErrorCode
  message: string
  details?: unknown
}

// types/user/models.ts
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: Date
}

export enum UserRole {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest',
}

// types/user/api.ts
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from '../common'
import type { User } from './models'

export interface CreateUserRequest {
  email: string
  name: string
  password: string
}

export type CreateUserResponse = ApiResponse<User>

export interface ListUsersRequest extends PaginationParams {
  role?: UserRole
}

export type ListUsersResponse = PaginatedResponse<User>

// types/index.ts
export * from './common'
export * from './user'
export * from './product'
```

### 3.3. 使用路径别名

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/types/*": ["src/types/*"],
      "@/modules/*": ["src/modules/*"],
      "@/utils/*": ["src/utils/*"]
    }
  }
}
```

```typescript
// ✅ 清晰的导入路径
import type { User, CreateUserRequest } from '@/types/user'
import type { ApiResponse } from '@/types/common'

// ❌ 相对路径复杂
import type { User } from '../../../types/user/models'
```

## 4. 🤔 模块边界管理？

明确的模块边界避免耦合。

### 4.1. 定义公共接口

```typescript
// modules/user/public.ts
export interface IUserService {
  createUser(data: CreateUserRequest): Promise<User>
  getUser(id: string): Promise<User | null>
  deleteUser(id: string): Promise<void>
}

// modules/user/UserService.ts
import type { IUserService } from './public'

class UserService implements IUserService {
  // 实现细节
}

export default UserService

// ❌ 外部不应直接访问内部实现
// import UserService from "@/modules/user/UserService";

// ✅ 通过公共接口访问
import type { IUserService } from '@/modules/user/public'
```

### 4.2. 避免循环依赖

```typescript
// ❌ 循环依赖
// user/types.ts
import { Product } from '../product/types'

export interface User {
  id: string
  favoriteProducts: Product[] // 依赖 Product
}

// product/types.ts
import { User } from '../user/types'

export interface Product {
  id: string
  creator: User // 依赖 User
}

// ✅ 提取共享类型
// types/common/ids.ts
export type UserId = string & { __brand: 'UserId' }
export type ProductId = string & { __brand: 'ProductId' }

// user/types.ts
import type { UserId, ProductId } from '@/types/common/ids'

export interface User {
  id: UserId
  favoriteProducts: ProductId[] // 只依赖 ID
}

// product/types.ts
import type { UserId, ProductId } from '@/types/common/ids'

export interface Product {
  id: ProductId
  creatorId: UserId // 只依赖 ID
}
```

### 4.3. 使用依赖注入

```typescript
// ✅ 接口定义
export interface ILogger {
  log(message: string): void
  error(message: string, error: Error): void
}

export interface IDatabase {
  query<T>(sql: string): Promise<T[]>
}

// ✅ 依赖注入
class UserService {
  constructor(private logger: ILogger, private db: IDatabase) {}

  async getUser(id: string) {
    this.logger.log(`Fetching user ${id}`)
    const users = await this.db.query<User>(`SELECT * FROM users WHERE id = ?`)
    return users[0]
  }
}

// ✅ 创建容器
interface Container {
  logger: ILogger
  database: IDatabase
  userService: UserService
}

function createContainer(): Container {
  const logger = new ConsoleLogger()
  const database = new PostgresDatabase()
  const userService = new UserService(logger, database)

  return { logger, database, userService }
}
```

## 5. 🤔 共享类型库？

独立的类型包供多个项目使用。

### 5.1. 创建类型包

```
@company/types/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts
│   ├── common.ts
│   ├── user.ts
│   └── product.ts
└── dist/
    ├── index.d.ts
    └── ...
```

```json
// package.json
{
  "name": "@company/types",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsc",
    "prepublishOnly": "npm run build"
  }
}
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "declaration": true, // 生成 .d.ts
    "declarationMap": true, // 生成 .d.ts.map
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

### 5.2. 版本化发布

```typescript
// src/user.ts
/**
 * User model
 * @since 1.0.0
 */
export interface User {
  id: string
  email: string
  name: string

  /**
   * @since 1.1.0
   */
  avatar?: string

  /**
   * @deprecated Use email instead
   * @since 1.0.0
   */
  username?: string
}
```

### 5.3. 在项目中使用

```json
// 项目 package.json
{
  "dependencies": {
    "@company/types": "^1.1.0"
  }
}
```

```typescript
// 项目中使用
import type { User, Product } from '@company/types'

function getUser(): User {
  return {
    id: '1',
    email: 'user@example.com',
    name: 'John Doe',
  }
}
```

## 6. 🤔 类型版本管理？

管理类型定义的演进。

### 6.1. 向后兼容的更改

```typescript
// ✅ 添加可选属性
export interface User {
  id: string
  email: string
  name: string
  avatar?: string // 新增，不破坏现有代码
}

// ✅ 扩展联合类型
export type UserRole = 'admin' | 'user' | 'guest' | 'moderator' // 新增 moderator

// ✅ 使用泛型增加灵活性
export interface ApiResponse<T = unknown> {
  // 添加默认类型
  data: T
  status: number
}
```

### 6.2. 破坏性更改

```typescript
// ❌ 删除属性（破坏性）
export interface User {
  id: string
  // email: string;  // 删除会破坏现有代码
}

// ✅ 先标记为废弃
export interface User {
  id: string
  /**
   * @deprecated Use emailAddress instead
   */
  email?: string
  emailAddress: string
}

// ✅ 下个主版本再删除
```

### 6.3. 使用版本命名空间

```typescript
// types/v1/user.ts
export namespace V1 {
  export interface User {
    id: string
    username: string
  }
}

// types/v2/user.ts
export namespace V2 {
  export interface User {
    id: string
    email: string // 改用 email
    name: string
  }
}

// 使用
import { V1, V2 } from '@/types'

function migrateUser(oldUser: V1.User): V2.User {
  return {
    id: oldUser.id,
    email: `${oldUser.username}@example.com`,
    name: oldUser.username,
  }
}
```

## 7. � 最佳实践？

大型项目的类型管理建议。

### 7.1. 文档化类型

````typescript
/**
 * 用户模型
 *
 * @example
 * ```typescript
 * const user: User = {
 *   id: "123",
 *   email: "user@example.com",
 *   name: "John Doe",
 *   role: UserRole.User
 * };
 * ```
 */
export interface User {
  /** 唯一标识符 */
  id: string

  /** 邮箱地址，用于登录 */
  email: string

  /** 显示名称 */
  name: string

  /** 用户角色，决定权限 */
  role: UserRole
}
````

### 7.2. 使用工具类型

```typescript
// ✅ 提取公共模式
type WithTimestamps = {
  createdAt: Date
  updatedAt: Date
}

export interface User extends WithTimestamps {
  id: string
  email: string
}

export interface Product extends WithTimestamps {
  id: string
  name: string
}

// ✅ 创建派生类型
export type CreateUserDTO = Omit<User, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateUserDTO = Partial<CreateUserDTO>
export type UserResponse = Pick<User, 'id' | 'email' | 'name'>
```

### 7.3. 类型测试

```typescript
// types/__tests__/user.test.ts
import type { User, CreateUserDTO } from '../user'

// ✅ 编译时类型测试
type AssertEqual<T, U> = T extends U ? (U extends T ? true : false) : false

// 测试：CreateUserDTO 应该不包含 id
type Test1 = AssertEqual<keyof CreateUserDTO, 'email' | 'name'>

// 如果类型不匹配，会导致编译错误
const test1: Test1 = true

// ✅ 运行时类型验证
import { z } from 'zod'

const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(1),
})

// 从 schema 推导类型，保持同步
type UserFromSchema = z.infer<typeof UserSchema>

// 验证类型兼容性
const testUser: User = {} as UserFromSchema // 应该兼容
```

## 8. 🔗 引用

- [TypeScript Project References][1]
- [API Extractor][2]
- [Type-only imports][3]

[1]: https://www.typescriptlang.org/docs/handbook/project-references.html
[2]: https://api-extractor.com/
[3]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export
