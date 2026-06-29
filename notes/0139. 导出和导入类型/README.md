# [0139. 导出和导入类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0139.%20%E5%AF%BC%E5%87%BA%E5%92%8C%E5%AF%BC%E5%85%A5%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 什么是类型导出？](#3-什么是类型导出)
- [4. 什么是类型导入？](#4-什么是类型导入)
- [5. 类型导入有哪两种语法形式？](#5-类型导入有哪两种语法形式)
- [6. 类型导入与值导入有什么区别？](#6-类型导入与值导入有什么区别)
- [7. 为什么要使用类型导入？](#7-为什么要使用类型导入)
- [8. 如何在实际项目中使用类型导入？](#8-如何在实际项目中使用类型导入)
- [9. 常见问题和注意事项](#9-常见问题和注意事项)
- [10. 引用](#10-引用)

<!-- endregion:toc -->

## 1. 本节内容

本节介绍 TypeScript 中类型的导出和导入机制：

- 如何使用「type」关键字导出和导入类型
- 类型导入与值导入的区别
- 类型导入的两种语法形式
- 类型导入的实际应用场景

## 2. 评价

TypeScript 提供了专门的类型导出和导入语法，用于在模块间共享类型定义。

TypeScript 类型导入的特点：

- 编译消除：类型导入在编译后会被完全移除，不影响运行时代码
- 语法明确：使用 `type` 关键字明确标识类型导入，提高代码可读性
- 与值分离：类型导入与值导入是独立的，可以同时导入同名的类型和值
- 优化支持：帮助构建工具（如 esbuild）正确识别和优化类型代码

TypeScript vs JavaScript 的导入：

| 特性     | TypeScript 类型导入               | JavaScript 值导入 |
| -------- | --------------------------------- | ----------------- |
| 语法     | `import type` / `import { type }` | `import`          |
| 编译后   | 完全移除                          | 保留              |
| 用途     | 导入类型定义                      | 导入运行时值      |
| 性能影响 | 无运行时开销                      | 有运行时开销      |

TypeScript 类型导入的优势：

1. 明确意图：清楚地标识哪些导入是类型，哪些是值
2. 编译优化：帮助编译器和构建工具进行更好的代码优化
3. 避免循环依赖：类型导入不会造成运行时的循环依赖问题
4. 提高可维护性：让代码审查者快速理解模块依赖关系

理解类型的导出和导入，能帮助你：

1. 在大型项目中更好地组织类型定义
2. 避免不必要的运行时依赖
3. 提高代码的可读性和可维护性
4. 优化构建产物的体积

掌握类型导入是编写高质量 TypeScript 代码的重要技能。

## 3. 什么是类型导出？

TypeScript 中，类型可以像值一样被导出，供其他模块使用。

::: code-group

```ts [导出类型别名]
// types.ts
// ✅ 导出类型别名
export type User = {
  id: number
  name: string
  email: string
}

// ✅ 导出接口
export interface Product {
  id: number
  title: string
  price: number
}

// ✅ 导出类型别名和值
export type Status = 'pending' | 'active' | 'inactive'
export const DEFAULT_STATUS: Status = 'pending'
```

```ts [使用 type 关键字导出]
// types.ts
// ✅ 使用 type 关键字明确导出类型
type User = {
  id: number
  name: string
}

export type { User }

// ✅ 导出多个类型
type Product = {
  id: number
  title: string
}

type Category = {
  id: number
  name: string
}

export type { Product, Category }
```

```ts [重命名导出]
// types.ts
type User = {
  id: number
  name: string
}

// ✅ 重命名导出
export type { User as UserType }

// ✅ 导出并重命名多个类型
type Product = { id: number }
type Category = { id: number }

export type { Product as ProductType, Category as CategoryType }
```

:::

关键概念：

- 类型导出：使用 `export type` 或 `export` 关键字导出类型定义
- 重命名导出：使用 `as` 关键字在导出时重命名类型
- 类型与值：可以同时导出同名的类型和值

## 4. 什么是类型导入？

TypeScript 提供了专门的语法来导入类型，与导入值的语法有所区别。

::: code-group

```ts [import type 语法]
// user.ts
// ✅ 使用 import type 导入类型
import type { User, Product } from './types'

// ✅ 这些类型只能用于类型注解，不能用作值
const user: User = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
}

function getProduct(id: number): Product {
  return { id, title: 'Product', price: 100 }
}

// ❌ 错误：不能将类型用作值
// const UserClass = User // Error
```

```ts [import { type } 语法]
// user.ts
// ✅ 使用 import { type } 导入类型
import { type User, type Product } from './types'

// ✅ 可以混合导入类型和值
import { type User, DEFAULT_STATUS } from './types'

const user: User = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
}

console.log(DEFAULT_STATUS) // 'pending'
```

```ts [重命名导入]
// user.ts
// ✅ 导入时重命名类型
import type { User as UserType } from './types'

const user: UserType = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
}

// ✅ 混合语法中的重命名
import { type User as UserType, DEFAULT_STATUS } from './types'
```

:::

关键概念：

- `import type` 语法：导入的标识符只能用作类型
- `import { type }` 语法：在导入列表中使用 `type` 标记单个类型
- 混合导入：可以在同一语句中同时导入类型和值

## 5. 类型导入有哪两种语法形式？

TypeScript 3.8 引入了两种类型导入语法，各有适用场景。

1. `import type` 语法（完整导入）
2. `import { type }` 语法（混合导入）

::: code-group

```ts [import type 完整语法]
// types.ts
export type User = { id: number; name: string }
export type Product = { id: number; title: string }
export const API_URL = 'https://api.example.com'

// user.ts
// ✅ 导入所有标识符都作为类型
import type { User, Product } from './types'

// ✅ 导入默认类型
import type DefaultType from './types'

// ✅ 导入所有类型
import type * as Types from './types'

// ❌ 不能在 import type 中导入值
// import type { API_URL } from './types' // Error: API_URL 是值
```

```ts [import { type } 混合语法]
// types.ts
export type User = { id: number; name: string }
export const API_URL = 'https://api.example.com'
export function fetchUser(id: number): User {
  return { id, name: 'User' }
}

// user.ts
// ✅ 混合导入类型和值
import { type User, API_URL, fetchUser } from './types'

const user: User = fetchUser(1)
console.log(API_URL)

// ✅ 多个类型和值的混合导入
import {
  type User,
  type Product,
  API_URL,
  DEFAULT_STATUS,
  fetchUser,
} from './types'
```

```ts [两种语法的对比]
// ✅ 方式 1: import type（所有都是类型）
import type { User, Product } from './types'

// ✅ 方式 2: import { type }（可以混合）
import { type User, type Product, API_URL } from './types'

// ⚠️ 方式 1 更简洁，适合只导入类型的情况
// ⚠️ 方式 2 更灵活，适合同时导入类型和值的情况

// ❌ 不能混用两种语法
// import type { User }, { API_URL } from './types' // Syntax Error
```

:::

`import type` vs `import { type }` 对比：

| 特性            | `import type` | `import { type }` |
| --------------- | ------------- | ----------------- |
| 导入内容        | 仅类型        | 类型和值混合      |
| 语法简洁性      | 更简洁        | 稍复杂            |
| 使用场景        | 只导入类型    | 同时导入类型和值  |
| TypeScript 版本 | 3.8+          | 4.5+              |

关键概念：

- 完整类型导入：使用 `import type` 语句导入的所有标识符都是类型
- 混合导入：使用 `import { type }` 可以在同一语句中导入类型和值
- 选择建议：只导入类型时使用 `import type`，需要混合导入时使用 `import { type }`

## 6. 类型导入与值导入有什么区别？

类型导入和值导入在语法、编译行为和使用方式上都有显著差异。

::: code-group

```ts [编译行为差异]
// types.ts
export type User = { id: number; name: string }
export const DEFAULT_USER: User = { id: 0, name: 'Guest' }

// user.ts - 编译前
import type { User } from './types'
import { DEFAULT_USER } from './types'

const user: User = DEFAULT_USER

// user.js - 编译后
// ✅ 类型导入被完全移除
import { DEFAULT_USER } from './types'

const user = DEFAULT_USER
// 注意：User 类型导入完全消失了
```

```ts [使用限制差异]
// types.ts
export type User = { id: number; name: string }
export class UserClass {
  constructor(
    public id: number,
    public name: string,
  ) {}
}

// user.ts
import type { User } from './types'
import { UserClass } from './types'

// ✅ 类型导入只能用于类型位置
const user1: User = { id: 1, name: 'Alice' }
function getUser(id: number): User {
  return { id, name: 'User' }
}

// ❌ 类型导入不能用作值
// const UserType = User // Error
// const users: User[] = [new User(1, 'Alice')] // Error

// ✅ 值导入可以用作值
const user2 = new UserClass(1, 'Bob')
const UserConstructor = UserClass
```

```ts [导入同名类型和值]
// types.ts
export type Point = { x: number; y: number }
export const Point = {
  create(x: number, y: number): Point {
    return { x, y }
  },
  origin(): Point {
    return { x: 0, y: 0 }
  },
}

// user.ts
// ✅ 可以同时导入同名的类型和值
import type { Point as PointType } from './types'
import { Point } from './types'

// ✅ PointType 用于类型位置
const p1: PointType = { x: 1, y: 2 }

// ✅ Point 用于值位置
const p2: PointType = Point.create(3, 4)
const origin: PointType = Point.origin()
```

:::

类型导入 vs 值导入：

| 特性       | 类型导入            | 值导入         |
| ---------- | ------------------- | -------------- |
| 语法       | `import type { T }` | `import { V }` |
| 编译后     | 完全移除            | 保留           |
| 使用位置   | 仅类型位置          | 类型和值位置   |
| 运行时开销 | 无                  | 有             |
| 循环依赖   | 不会造成问题        | 可能造成问题   |

关键概念：

- 编译消除：类型导入在编译后会被完全移除
- 使用限制：类型导入只能在类型注解、类型断言等类型位置使用
- 命名空间：类型和值是独立的命名空间，可以有同名的类型和值

## 7. 为什么要使用类型导入？

类型导入提供了多个实际好处，特别是在大型项目中。

::: code-group

```ts [明确意图]
// ❌ 不清楚哪些是类型，哪些是值
import { User, Product, fetchUser, createProduct } from './api'

// ✅ 清楚地标识类型和值
import type { User, Product } from './api'
import { fetchUser, createProduct } from './api'

// ✅ 或者使用混合语法
import { type User, type Product, fetchUser, createProduct } from './api'
```

```ts [避免运行时依赖]
// types.ts
export type Config = {
  apiUrl: string
  timeout: number
}

export const DEFAULT_CONFIG: Config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
}

// module-a.ts
// ✅ 只导入类型，不会引入 DEFAULT_CONFIG 的运行时代码
import type { Config } from './types'

function validateConfig(config: Config): boolean {
  return config.timeout > 0
}

// module-b.ts
// ✅ 导入值，会引入 DEFAULT_CONFIG
import { DEFAULT_CONFIG } from './types'

console.log(DEFAULT_CONFIG.apiUrl)
```

```ts [支持构建优化]
// constants.ts
export type Environment = 'development' | 'production' | 'test'
export const HEAVY_DEPENDENCY = {
  /* 大型对象 */
}

// config.ts
// ✅ 使用 import type，构建工具可以识别并优化
import type { Environment } from './constants'

// ❌ 使用普通 import，可能会包含 HEAVY_DEPENDENCY
// import { Environment } from './constants'

export function getConfig(env: Environment) {
  return { env }
}
```

```ts [避免循环依赖]
// user.ts
import type { Post } from './post'

export type User = {
  id: number
  name: string
  posts: Post[]
}

// post.ts
import type { User } from './user'

export type Post = {
  id: number
  title: string
  author: User
}

// ✅ 类型导入不会造成运行时循环依赖
// 如果使用值导入，可能会出现循环依赖问题
```

:::

使用类型导入的好处：

1. 提高可读性：明确区分类型和值的导入
2. 优化构建：帮助构建工具识别和移除类型代码
3. 减少耦合：避免不必要的运行时依赖
4. 防止错误：在编译时捕获类型和值的混用错误

关键概念：

- 代码意图：使用 `import type` 明确表达只需要类型定义
- 构建优化：某些构建工具（如 esbuild）依赖 `import type` 来正确处理类型
- 循环依赖：类型导入可以安全地在循环依赖的模块中使用

## 8. 如何在实际项目中使用类型导入？

在实际项目中，合理使用类型导入可以提高代码质量和可维护性。

::: code-group

```ts [组织类型定义]
// types/user.ts
export type User = {
  id: number
  name: string
  email: string
}

export type UserRole = 'admin' | 'user' | 'guest'

export type UserWithRole = User & {
  role: UserRole
}

// services/user-service.ts
// ✅ 集中导入所有类型
import type { User, UserRole, UserWithRole } from '@/types/user'

export function createUser(data: User): User {
  return data
}

export function assignRole(user: User, role: UserRole): UserWithRole {
  return { ...user, role }
}
```

```ts [API 响应类型]
// types/api.ts
export type ApiResponse<T> = {
  data: T
  status: number
  message: string
}

export type PaginatedResponse<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
}

// services/api-client.ts
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { User } from '@/types/user'

// ✅ 使用泛型类型组合
export async function fetchUsers(): Promise<
  ApiResponse<PaginatedResponse<User>>
> {
  const response = await fetch('/api/users')
  return response.json()
}
```

```ts [类型守卫和工具函数]
// types/product.ts
export type Product = {
  id: number
  title: string
  price: number
}

// utils/type-guards.ts
import type { Product } from '@/types/product'

// ✅ 类型守卫函数可以混合导入类型
export function isProduct(value: unknown): value is Product {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'title' in value &&
    'price' in value
  )
}

// ✅ 类型断言函数
export function assertProduct(value: unknown): asserts value is Product {
  if (!isProduct(value)) {
    throw new Error('Not a valid product')
  }
}
```

```ts [React 组件类型]
// types/props.ts
export type ButtonProps = {
  label: string
  onClick: () => void
  disabled?: boolean
}

export type InputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

// components/Button.tsx
import type { ButtonProps } from '@/types/props'

// ✅ 在 React 组件中使用类型导入
export function Button({ label, onClick, disabled }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  )
}

// components/Input.tsx
import type { InputProps } from '@/types/props'

export function Input({ value, onChange, placeholder }: InputProps) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  )
}
```

```ts [配置 tsconfig.json]
// tsconfig.json
{
  "compilerOptions": {
    // ✅ 启用 importsNotUsedAsValues 检查
    "importsNotUsedAsValues": "error",

    // ✅ TypeScript 5.0+ 使用 verbatimModuleSyntax
    "verbatimModuleSyntax": true,

    // 其他配置...
    "strict": true,
    "esModuleInterop": true
  }
}

// ⚠️ importsNotUsedAsValues 选项说明：
// - "remove": 移除未使用的导入（默认）
// - "preserve": 保留所有导入
// - "error": 如果值导入仅用作类型，则报错
```

:::

最佳实践：

1. 类型文件组织：将类型定义集中在 `types/` 目录
2. 一致性：团队统一使用 `import type` 或 `import { type }`
3. 配置检查：使用 `verbatimModuleSyntax` 或 `importsNotUsedAsValues` 强制类型导入
4. 工具支持：配合 ESLint 规则检查类型导入使用

关键概念：

- 类型组织：建立清晰的类型定义结构
- 编译选项：使用 TypeScript 配置强制类型导入规范
- 工具链：配合构建工具和 linter 确保代码质量

## 9. 常见问题和注意事项

使用类型导入时需要注意一些常见问题和限制。

::: code-group

```ts [类不能用 import type]
// models/user.ts
export class User {
  constructor(
    public id: number,
    public name: string,
  ) {}

  greet(): string {
    return `Hello, ${this.name}`
  }
}

// ❌ 错误：类既是类型也是值，不能用 import type
// import type { User } from './models/user'
// const user = new User(1, 'Alice') // Error

// ✅ 正确：如果要实例化类，必须用值导入
import { User } from './models/user'
const user = new User(1, 'Alice')

// ✅ 如果只用作类型注解，可以用 import type
import type { User as UserType } from './models/user'
function processUser(user: UserType): void {
  console.log(user.name)
}
```

```ts [枚举不能用 import type]
// constants/status.ts
export enum Status {
  Pending = 'pending',
  Active = 'active',
  Inactive = 'inactive',
}

// ❌ 错误：枚举既是类型也是值
// import type { Status } from './constants/status'
// const status = Status.Pending // Error

// ✅ 正确：使用值导入
import { Status } from './constants/status'
const status = Status.Pending

// ✅ 如果只用作类型注解，可以用 import type
import type { Status as StatusType } from './constants/status'
function checkStatus(status: StatusType): void {
  console.log(status)
}
```

```ts [命名空间的类型导入]
// types/api.ts
export namespace API {
  export type Request = {
    url: string
    method: string
  }

  export type Response = {
    data: unknown
    status: number
  }
}

// ✅ 导入整个命名空间作为类型
import type { API } from './types/api'

function handleRequest(req: API.Request): API.Response {
  return { data: {}, status: 200 }
}

// ✅ 或者导入命名空间中的具体类型
import type { API } from './types/api'
type Request = API.Request
type Response = API.Response
```

```ts [默认导出的类型]
// types/config.ts
type Config = {
  apiUrl: string
  timeout: number
}

export default Config

// user.ts
// ✅ 导入默认类型
import type Config from './types/config'

const config: Config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
}

// ⚠️ 注意：默认导出的类型也可以用 import type
```

```ts [重导出类型]
// types/index.ts
// ✅ 重导出类型
export type { User, UserRole } from './user'
export type { Product } from './product'
export type { ApiResponse } from './api'

// ✅ 使用 export type * 重导出所有类型
export type * from './user'
export type * from './product'

// user.ts
// ✅ 从统一入口导入
import type { User, Product, ApiResponse } from '@/types'
```

:::

常见错误：

1. ❌ 对类和枚举使用 `import type`，然后尝试实例化
2. ❌ 混用 `import type` 和普通 `import` 导入同一标识符
3. ❌ 在 `import type` 语句中导入值
4. ❌ 忘记配置 TypeScript 编译选项来强制类型导入

注意事项：

- 类和枚举：既是类型也是值，根据使用方式选择导入方式
- 命名空间：可以使用 `import type` 导入整个命名空间
- 重导出：可以使用 `export type` 重导出类型
- 配置选项：使用 `verbatimModuleSyntax` 获得更严格的检查

## 10. 引用

- [TypeScript Handbook - Modules - Import Type][1]
- [TypeScript 3.8 Release Notes - Type-Only Imports and Exports][2]
- [TypeScript 4.5 Release Notes - Type Modifiers on Import Names][3]
- [TypeScript Handbook - Module Resolution][4]

[1]: https://www.typescriptlang.org/docs/handbook/modules.html#import-type
[2]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-exports
[3]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html#type-modifiers-on-import-names
[4]: https://www.typescriptlang.org/docs/handbook/module-resolution.html
