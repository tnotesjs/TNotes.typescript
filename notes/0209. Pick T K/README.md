# [0209. Pick T K](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0209.%20Pick%20T%20K)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 Pick\<T, K\> 是什么？](#3--pickt-k-是什么)
  - [3.1. 源码定义](#31-源码定义)
  - [3.2. 工作原理](#32-工作原理)
  - [3.3. 基本示例](#33-基本示例)
- [4. 🤔 如何使用 Pick\<T, K\>？](#4--如何使用-pickt-k)
  - [4.1. 场景 1：API 响应精简](#41-场景-1api-响应精简)
  - [4.2. 场景 2：表单数据类型](#42-场景-2表单数据类型)
  - [4.3. 场景 3：配置对象子集](#43-场景-3配置对象子集)
  - [4.4. 场景 4：组件 Props 提取](#44-场景-4组件-props-提取)
- [5. 🤔 Pick\<T, K\> 的实际应用场景有哪些？](#5--pickt-k-的实际应用场景有哪些)
  - [5.1. 应用 1：数据库模型与 DTO 分离](#51-应用-1数据库模型与-dto-分离)
  - [5.2. 应用 2：事件负载类型](#52-应用-2事件负载类型)
  - [5.3. 应用 3：查询构建器](#53-应用-3查询构建器)
  - [5.4. 应用 4：缓存键类型](#54-应用-4缓存键类型)
  - [5.5. 应用 5：权限检查](#55-应用-5权限检查)
- [6. 🤔 使用 Pick\<T, K\> 需要注意什么？](#6--使用-pickt-k-需要注意什么)
  - [6.1. 注意事项 1：键必须存在](#61-注意事项-1键必须存在)
  - [6.2. 注意事项 2：保留修饰符](#62-注意事项-2保留修饰符)
  - [6.3. 注意事项 3：与 Partial 的组合顺序](#63-注意事项-3与-partial-的组合顺序)
  - [6.4. 注意事项 4：空键集合](#64-注意事项-4空键集合)
  - [6.5. 注意事项 5：与联合类型的交互](#65-注意事项-5与联合类型的交互)
  - [6.6. 注意事项 6：与泛型的结合](#66-注意事项-6与泛型的结合)
  - [6.7. 注意事项 7：性能考虑](#67-注意事项-7性能考虑)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- `Pick<T, K>` 的定义和实现原理
- 基本使用方法
- 实际应用场景
- 使用注意事项

## 2. 🫧 评价

`Pick<T, K>` 从类型 `T` 中选取指定的属性 `K`，创建新类型。

- 适用于需要类型子集的场景
- 与 `Omit<T, K>` 互为补充操作
- 键必须是原类型的属性名
- 常用于 API 响应、表单数据等场景
- 可以与其他工具类型组合使用

## 3. 🤔 Pick\<T, K\> 是什么？

`Pick<T, K>` 从类型 `T` 中选取属性集合 `K`，构造一个新类型。

### 3.1. 源码定义

```typescript
// TypeScript lib.es5.d.ts 中的定义
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}
```

### 3.2. 工作原理

```typescript
type User = {
  id: number
  name: string
  email: string
  age: number
  address: string
}

// Pick<User, 'id' | 'name'> 的展开过程：
// 1. K = 'id' | 'name'（必须是 keyof User 的子集）
// 2. [P in 'id' | 'name']: User[P]
// 3. 结果：
type UserPreview = Pick<User, 'id' | 'name'>
// {
//   id: number;
//   name: string;
// }
```

### 3.3. 基本示例

```typescript
type Product = {
  id: number
  name: string
  price: number
  description: string
  stock: number
  category: string
}

// 只选择部分属性
type ProductPreview = Pick<Product, 'id' | 'name' | 'price'>
// { id: number; name: string; price: number; }

const preview: ProductPreview = {
  id: 1,
  name: 'iPhone',
  price: 999,
}

// ❌ 不能包含未选择的属性
const invalid: ProductPreview = {
  id: 1,
  name: 'iPhone',
  price: 999,
  description: 'A phone', // 错误
}
```

## 4. 🤔 如何使用 Pick\<T, K\>？

### 4.1. 场景 1：API 响应精简

```typescript
type User = {
  id: number
  username: string
  email: string
  password: string
  salt: string
  createdAt: Date
  updatedAt: Date
  lastLoginAt: Date
}

// 公开 API 只返回部分信息
type PublicUser = Pick<User, 'id' | 'username'>

async function getPublicUsers(): Promise<PublicUser[]> {
  const users = await db.users.findAll()
  return users.map((user) => ({
    id: user.id,
    username: user.username,
  }))
}

declare const db: any
```

### 4.2. 场景 2：表单数据类型

```typescript
type User = {
  id: number
  username: string
  email: string
  password: string
  avatar: string
  bio: string
  createdAt: Date
}

// 创建用户表单只需要部分字段
type CreateUserForm = Pick<User, 'username' | 'email' | 'password'>

// 更新用户表单字段不同
type UpdateUserForm = Pick<User, 'username' | 'email' | 'avatar' | 'bio'>

function createUser(data: CreateUserForm): Promise<User> {
  return fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }).then((res) => res.json())
}

function updateUser(id: number, data: UpdateUserForm): Promise<User> {
  return fetch(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }).then((res) => res.json())
}
```

### 4.3. 场景 3：配置对象子集

```typescript
type AppConfig = {
  server: {
    host: string
    port: number
    ssl: boolean
  }
  database: {
    url: string
    poolSize: number
  }
  redis: {
    host: string
    port: number
  }
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error'
    file: string
  }
}

// 只暴露部分配置
type PublicConfig = Pick<AppConfig, 'server' | 'logging'>

function getPublicConfig(): PublicConfig {
  return {
    server: config.server,
    logging: config.logging,
  }
}

declare const config: AppConfig
```

### 4.4. 场景 4：组件 Props 提取

```typescript
type ButtonProps = {
  text: string
  onClick: () => void
  type: 'primary' | 'secondary' | 'danger'
  size: 'small' | 'medium' | 'large'
  disabled: boolean
  loading: boolean
  icon?: string
}

// 图标按钮只需要部分属性
type IconButtonProps = Pick<ButtonProps, 'onClick' | 'type' | 'size' | 'icon'>

function IconButton(props: IconButtonProps): JSX.Element {
  return (
    <button onClick={props.onClick} className={`${props.type} ${props.size}`}>
      <i className={props.icon}></i>
    </button>
  )
}
```

## 5. 🤔 Pick\<T, K\> 的实际应用场景有哪些？

### 5.1. 应用 1：数据库模型与 DTO 分离

```typescript
type UserModel = {
  id: number
  username: string
  email: string
  passwordHash: string
  salt: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

// 创建用户 DTO
type CreateUserDto = Pick<UserModel, 'username' | 'email'> & {
  password: string // 明文密码
}

// 用户响应 DTO
type UserResponseDto = Pick<
  UserModel,
  'id' | 'username' | 'email' | 'isActive' | 'createdAt'
>

// 更新用户 DTO
type UpdateUserDto = Partial<Pick<UserModel, 'username' | 'email' | 'isActive'>>

class UserService {
  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const { password, ...userData } = dto
    const passwordHash = await hash(password)
    const user = await db.users.create({
      ...userData,
      passwordHash,
      salt: generateSalt(),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    })
    return this.toResponseDto(user)
  }

  private toResponseDto(user: UserModel): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      isActive: user.isActive,
      createdAt: user.createdAt,
    }
  }
}

declare function hash(password: string): Promise<string>
declare function generateSalt(): string
declare const db: any
```

### 5.2. 应用 2：事件负载类型

```typescript
type Todo = {
  id: string
  title: string
  description: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate: Date
  createdAt: Date
  updatedAt: Date
}

// 不同事件包含不同的数据
type TodoCreatedEvent = {
  type: 'TODO_CREATED'
  payload: Pick<Todo, 'id' | 'title' | 'priority' | 'dueDate'>
}

type TodoCompletedEvent = {
  type: 'TODO_COMPLETED'
  payload: Pick<Todo, 'id' | 'completed'>
}

type TodoUpdatedEvent = {
  type: 'TODO_UPDATED'
  payload: Pick<Todo, 'id'> &
    Partial<Pick<Todo, 'title' | 'description' | 'priority'>>
}

type TodoEvent = TodoCreatedEvent | TodoCompletedEvent | TodoUpdatedEvent

function handleTodoEvent(event: TodoEvent): void {
  switch (event.type) {
    case 'TODO_CREATED':
      console.log('Created:', event.payload.title)
      break
    case 'TODO_COMPLETED':
      console.log('Completed:', event.payload.id)
      break
    case 'TODO_UPDATED':
      console.log('Updated:', event.payload.id)
      break
  }
}
```

### 5.3. 应用 3：查询构建器

```typescript
type User = {
  id: number
  username: string
  email: string
  age: number
  role: 'admin' | 'user'
  active: boolean
  createdAt: Date
}

// 查询条件只包含可搜索的字段
type UserSearchCriteria = Partial<
  Pick<User, 'username' | 'email' | 'role' | 'active'>
>

// 排序字段
type UserSortField = keyof Pick<User, 'username' | 'createdAt' | 'age'>

type UserQuery = {
  where?: UserSearchCriteria
  orderBy?: UserSortField
  order?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

async function findUsers(query: UserQuery): Promise<User[]> {
  // 构建数据库查询...
  return []
}

// 使用
await findUsers({
  where: { role: 'admin', active: true },
  orderBy: 'createdAt',
  order: 'desc',
  limit: 10,
})
```

### 5.4. 应用 4：缓存键类型

```typescript
type Article = {
  id: string
  title: string
  content: string
  author: string
  tags: string[]
  viewCount: number
  publishedAt: Date
  updatedAt: Date
}

// 缓存键只使用标识信息
type ArticleCacheKey = Pick<Article, 'id' | 'updatedAt'>

class ArticleCache {
  private cache = new Map<string, Article>()

  private generateKey(key: ArticleCacheKey): string {
    return `article:${key.id}:${key.updatedAt.getTime()}`
  }

  set(article: Article): void {
    const key = this.generateKey({
      id: article.id,
      updatedAt: article.updatedAt,
    })
    this.cache.set(key, article)
  }

  get(key: ArticleCacheKey): Article | undefined {
    return this.cache.get(this.generateKey(key))
  }
}
```

### 5.5. 应用 5：权限检查

```typescript
type Permission = {
  id: string
  resource: string
  action: 'create' | 'read' | 'update' | 'delete'
  scope: 'own' | 'team' | 'all'
  conditions?: Record<string, any>
}

// 权限检查只需要部分信息
type PermissionCheck = Pick<Permission, 'resource' | 'action' | 'scope'>

function hasPermission(
  userPermissions: Permission[],
  required: PermissionCheck
): boolean {
  return userPermissions.some(
    (p) =>
      p.resource === required.resource &&
      p.action === required.action &&
      (p.scope === 'all' || p.scope === required.scope)
  )
}

// 使用
const permissions: Permission[] = [
  {
    id: '1',
    resource: 'articles',
    action: 'create',
    scope: 'own',
  },
  {
    id: '2',
    resource: 'articles',
    action: 'read',
    scope: 'all',
  },
]

hasPermission(permissions, {
  resource: 'articles',
  action: 'create',
  scope: 'own',
}) // true
```

## 6. 🤔 使用 Pick\<T, K\> 需要注意什么？

### 6.1. 注意事项 1：键必须存在

```typescript
type User = {
  id: number
  name: string
}

// ❌ 键必须是 keyof User 的子集
type Invalid = Pick<User, 'id' | 'nonexistent'> // 错误

// ✅ 正确
type Valid = Pick<User, 'id' | 'name'>
```

### 6.2. 注意事项 2：保留修饰符

```typescript
type User = {
  readonly id: number
  name?: string
  email: string
}

type UserPick = Pick<User, 'id' | 'name'>
// {
//   readonly id: number; // ✅ readonly 被保留
//   name?: string;       // ✅ 可选修饰符被保留
// }

const user: UserPick = {
  id: 1,
  // name 可选
}

// ❌ id 仍然是只读的
user.id = 2 // 错误
```

### 6.3. 注意事项 3：与 Partial 的组合顺序

```typescript
type User = {
  id: number
  name: string
  email: string
}

// 先 Pick 再 Partial
type PartialPick = Partial<Pick<User, 'name' | 'email'>>
// { name?: string; email?: string; }

// 先 Partial 再 Pick
type PickPartial = Pick<Partial<User>, 'name' | 'email'>
// { name?: string; email?: string; }

// 两者结果相同
```

### 6.4. 注意事项 4：空键集合

```typescript
type User = {
  id: number
  name: string
}

// ⚠️ 空键集合会产生空对象类型
type EmptyPick = Pick<User, never>
// {}

const empty: EmptyPick = {} // ✅
const withData: EmptyPick = { anything: 'value' } // ✅ 空对象类型接受任何对象
```

### 6.5. 注意事项 5：与联合类型的交互

```typescript
type A = { a: number; b: string }
type B = { b: string; c: boolean }

type Union = A | B

// Pick 会分发到联合类型的每个成员
type PickedUnion = Pick<Union, 'b'>
// Pick<A, 'b'> | Pick<B, 'b'>
// { b: string; } | { b: string; }
// { b: string; }
```

### 6.6. 注意事项 6：与泛型的结合

```typescript
// 通用的属性选择函数
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>
  keys.forEach((key) => {
    result[key] = obj[key]
  })
  return result
}

type User = {
  id: number
  name: string
  email: string
  age: number
}

const user: User = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  age: 25,
}

const picked = pick(user, ['id', 'name'])
// 类型：Pick<User, 'id' | 'name'>
// 值：{ id: 1, name: 'Alice' }
```

### 6.7. 注意事项 7：性能考虑

```typescript
// ⚠️ 过度使用 Pick 可能影响类型检查性能
type Complex = {
  /* 100 个属性 */
}

type Pick1 = Pick<Complex, 'prop1'>
type Pick2 = Pick<Complex, 'prop2'>
// ... 多次 Pick

// ✅ 考虑直接定义新类型
type Simplified = {
  prop1: string
  prop2: number
}
```

## 7. 🔗 引用

- [TypeScript Utility Types - Pick][1]
- [TypeScript Handbook - Mapped Types][2]
- [TypeScript lib.es5.d.ts Source][3]

[1]: https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys
[2]: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
[3]: https://github.com/microsoft/TypeScript/blob/main/lib/lib.es5.d.ts
