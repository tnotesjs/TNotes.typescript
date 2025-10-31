# [0210. Omit T K](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0210.%20Omit%20T%20K)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 Omit\<T, K\> 是什么？](#3--omitt-k-是什么)
  - [3.1. 源码定义](#31-源码定义)
  - [3.2. 工作原理](#32-工作原理)
  - [3.3. 基本示例](#33-基本示例)
- [4. 🤔 如何使用 Omit\<T, K\>？](#4--如何使用-omitt-k)
  - [4.1. 场景 1：移除敏感信息](#41-场景-1移除敏感信息)
  - [4.2. 场景 2：类型继承与修改](#42-场景-2类型继承与修改)
  - [4.3. 场景 3：修改现有类型](#43-场景-3修改现有类型)
  - [4.4. 场景 4：表单数据处理](#44-场景-4表单数据处理)
- [5. 🤔 Omit\<T, K\> 的实际应用场景有哪些？](#5--omitt-k-的实际应用场景有哪些)
  - [5.1. 应用 1：GraphQL 查询响应](#51-应用-1graphql-查询响应)
  - [5.2. 应用 2：ORM 模型与 DTO](#52-应用-2orm-模型与-dto)
  - [5.3. 应用 3：Redux State 管理](#53-应用-3redux-state-管理)
  - [5.4. 应用 4：微服务间通信](#54-应用-4微服务间通信)
  - [5.5. 应用 5：测试数据构建](#55-应用-5测试数据构建)
- [6. 🤔 使用 Omit\<T, K\> 需要注意什么？](#6--使用-omitt-k-需要注意什么)
  - [6.1. 注意事项 1：键约束比 Pick 宽松](#61-注意事项-1键约束比-pick-宽松)
  - [6.2. 注意事项 2：Omit never 的行为](#62-注意事项-2omit-never-的行为)
  - [6.3. 注意事项 3：保留修饰符](#63-注意事项-3保留修饰符)
  - [6.4. 注意事项 4：与 Pick 的性能差异](#64-注意事项-4与-pick-的性能差异)
  - [6.5. 注意事项 5：索引签名的处理](#65-注意事项-5索引签名的处理)
  - [6.6. 注意事项 6：与联合类型的分布](#66-注意事项-6与联合类型的分布)
  - [6.7. 注意事项 7：类型推断陷阱](#67-注意事项-7类型推断陷阱)
- [7. 🆚 Pick vs. Omit](#7--pick-vs-omit)
  - [7.1. 使用场景对比](#71-使用场景对比)
  - [7.2. 选择指南](#72-选择指南)
  - [7.3. 互相转换](#73-互相转换)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- `Omit<T, K>` 的定义和实现原理
- 基本使用方法
- 实际应用场景
- 使用注意事项
- `Pick` 与 `Omit` 的对比

## 2. 🫧 评价

`Omit<T, K>` 从类型 `T` 中排除指定的属性 `K`，创建新类型。

- 与 `Pick<T, K>` 互为反向操作
- 键约束比 `Pick` 更宽松
- 适用于排除敏感信息的场景
- 实现基于 `Pick` 和 `Exclude` 的组合
- 常用于类型继承和修改

## 3. 🤔 Omit\<T, K\> 是什么？

`Omit<T, K>` 从类型 `T` 中移除属性集合 `K`，构造一个新类型。

### 3.1. 源码定义

```typescript
// TypeScript lib.es5.d.ts 中的定义
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>

// 展开来看：
// 1. Exclude<keyof T, K>：从 T 的所有键中排除 K
// 2. Pick<T, 剩余的键>：选择剩余的键
```

### 3.2. 工作原理

```typescript
type User = {
  id: number
  name: string
  email: string
  password: string
  salt: string
}

// Omit<User, 'password' | 'salt'> 的展开过程：
// 1. keyof User = 'id' | 'name' | 'email' | 'password' | 'salt'
// 2. Exclude<'id' | 'name' | 'email' | 'password' | 'salt', 'password' | 'salt'>
//    = 'id' | 'name' | 'email'
// 3. Pick<User, 'id' | 'name' | 'email'>
// 4. 结果：
type PublicUser = Omit<User, 'password' | 'salt'>
// {
//   id: number;
//   name: string;
//   email: string;
// }
```

### 3.3. 基本示例

```typescript
type Product = {
  id: number
  name: string
  price: number
  internalCost: number
  supplierInfo: string
}

// 排除内部信息
type PublicProduct = Omit<Product, 'internalCost' | 'supplierInfo'>
// { id: number; name: string; price: number; }

const product: PublicProduct = {
  id: 1,
  name: 'iPhone',
  price: 999,
  // ❌ 不能包含被排除的属性
  // internalCost: 500, // 错误
}
```

## 4. 🤔 如何使用 Omit\<T, K\>？

### 4.1. 场景 1：移除敏感信息

```typescript
type User = {
  id: number
  username: string
  email: string
  password: string
  passwordHash: string
  salt: string
  secretQuestion: string
  secretAnswer: string
}

// API 响应时移除所有敏感信息
type UserResponse = Omit<
  User,
  'password' | 'passwordHash' | 'salt' | 'secretQuestion' | 'secretAnswer'
>

async function getUser(id: number): Promise<UserResponse> {
  const user = await db.users.findById(id)
  const {
    password,
    passwordHash,
    salt,
    secretQuestion,
    secretAnswer,
    ...safeUser
  } = user
  return safeUser
}

declare const db: any
```

### 4.2. 场景 2：类型继承与修改

```typescript
type BaseEntity = {
  id: number
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

// 创建实体时不需要这些字段
type CreateEntity = Omit<
  BaseEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

type User = BaseEntity & {
  username: string
  email: string
}

// 创建用户表单
type CreateUserForm = Omit<User, keyof BaseEntity>
// { username: string; email: string; }

function createUser(data: CreateUserForm): Promise<User> {
  return db.users.create({
    ...data,
    id: generateId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  })
}

declare function generateId(): number
```

### 4.3. 场景 3：修改现有类型

```typescript
type User = {
  id: string
  name: string
  email: string
  age: number
}

// 更改某个字段的类型
type UserWithOptionalEmail = Omit<User, 'email'> & {
  email?: string
}

// 批量修改类型
type UserWithStringFields = Omit<User, 'age'> & {
  age: string // 将 number 改为 string
}
```

### 4.4. 场景 4：表单数据处理

```typescript
type Article = {
  id: string
  title: string
  content: string
  author: string
  slug: string
  viewCount: number
  publishedAt: Date
  createdAt: Date
  updatedAt: Date
}

// 创建文章表单（排除自动生成的字段）
type CreateArticleForm = Omit<
  Article,
  'id' | 'slug' | 'viewCount' | 'publishedAt' | 'createdAt' | 'updatedAt'
>

// 更新文章表单（排除不可修改的字段）
type UpdateArticleForm = Partial<
  Omit<Article, 'id' | 'author' | 'slug' | 'viewCount' | 'createdAt'>
>

function createArticle(data: CreateArticleForm): Promise<Article> {
  return fetch('/api/articles', {
    method: 'POST',
    body: JSON.stringify(data),
  }).then((res) => res.json())
}

function updateArticle(id: string, data: UpdateArticleForm): Promise<Article> {
  return fetch(`/api/articles/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }).then((res) => res.json())
}
```

## 5. 🤔 Omit\<T, K\> 的实际应用场景有哪些？

### 5.1. 应用 1：GraphQL 查询响应

```typescript
type FullUser = {
  id: string
  username: string
  email: string
  password: string
  profile: {
    firstName: string
    lastName: string
    avatar: string
    bio: string
  }
  settings: {
    theme: 'light' | 'dark'
    notifications: boolean
    language: string
  }
  internal: {
    roles: string[]
    permissions: string[]
    lastLoginIp: string
  }
}

// 公开 API 响应（排除内部数据和密码）
type PublicUserResponse = Omit<FullUser, 'password' | 'internal'>

// 管理员 API 响应（只排除密码）
type AdminUserResponse = Omit<FullUser, 'password'>

function getPublicUser(id: string): Promise<PublicUserResponse> {
  return graphql(`
    query GetUser($id: ID!) {
      user(id: $id) {
        id
        username
        email
        profile {
          firstName
          lastName
          avatar
          bio
        }
        settings {
          theme
          notifications
          language
        }
      }
    }
  `).then((res) => res.data.user)
}

declare function graphql(query: string): Promise<any>
```

### 5.2. 应用 2：ORM 模型与 DTO

```typescript
type UserModel = {
  id: number
  username: string
  email: string
  passwordHash: string
  salt: string
  isActive: boolean
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

// 数据库查询结果（排除敏感字段）
type UserDto = Omit<UserModel, 'passwordHash' | 'salt'>

// 注册请求（排除所有自动生成的字段）
type RegisterDto = Omit<
  UserModel,
  | 'id'
  | 'passwordHash'
  | 'salt'
  | 'isActive'
  | 'emailVerified'
  | 'createdAt'
  | 'updatedAt'
> & {
  password: string // 明文密码
}

class UserRepository {
  async findById(id: number): Promise<UserDto | null> {
    const user = await db.users.findOne({ where: { id } })
    if (!user) return null

    const { passwordHash, salt, ...dto } = user
    return dto
  }

  async register(dto: RegisterDto): Promise<UserDto> {
    const { password, ...userData } = dto
    const { passwordHash, salt } = await this.hashPassword(password)

    const user = await db.users.create({
      ...userData,
      passwordHash,
      salt,
      isActive: true,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return this.findById(user.id) as Promise<UserDto>
  }

  private async hashPassword(
    password: string
  ): Promise<{ passwordHash: string; salt: string }> {
    // 实现密码哈希...
    return { passwordHash: '', salt: '' }
  }
}

declare const db: any
```

### 5.3. 应用 3：Redux State 管理

```typescript
type TodoState = {
  items: Todo[]
  filter: 'all' | 'active' | 'completed'
  loading: boolean
  error: string | null
}

type Todo = {
  id: string
  text: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

// Action payload 不需要所有字段
type AddTodoPayload = Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>
type UpdateTodoPayload = { id: string } & Partial<Omit<Todo, 'id'>>

type TodoAction =
  | { type: 'ADD_TODO'; payload: AddTodoPayload }
  | { type: 'UPDATE_TODO'; payload: UpdateTodoPayload }
  | { type: 'DELETE_TODO'; payload: { id: string } }

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        items: [
          ...state.items,
          {
            ...action.payload,
            id: generateId(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      }
    case 'UPDATE_TODO':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, ...action.payload, updatedAt: new Date() }
            : item
        ),
      }
    case 'DELETE_TODO':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      }
  }
}

declare function generateId(): string
```

### 5.4. 应用 4：微服务间通信

```typescript
type Order = {
  id: string
  userId: string
  items: OrderItem[]
  totalPrice: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  paymentInfo: {
    method: 'credit_card' | 'paypal'
    transactionId: string
    cardLastFour: string
  }
  shippingAddress: Address
  billingAddress: Address
  internalNotes: string
  createdAt: Date
  updatedAt: Date
}

type OrderItem = {
  productId: string
  quantity: number
  price: number
}

type Address = {
  street: string
  city: string
  state: string
  zipCode: string
}

// 订单服务 -> 库存服务（只需要商品信息）
type InventoryUpdateEvent = {
  orderId: string
  items: Array<Pick<OrderItem, 'productId' | 'quantity'>>
}

// 订单服务 -> 物流服务（排除支付和内部信息）
type ShippingEvent = Omit<
  Order,
  'paymentInfo' | 'billingAddress' | 'internalNotes'
>

// 订单服务 -> 用户通知服务（最小化信息）
type OrderNotificationEvent = Pick<Order, 'id' | 'status' | 'totalPrice'> & {
  userId: string
}

function publishShippingEvent(order: Order): void {
  const { paymentInfo, billingAddress, internalNotes, ...shippingData } = order
  messageBus.publish('shipping.order_created', shippingData)
}

declare const messageBus: any
```

### 5.5. 应用 5：测试数据构建

```typescript
type User = {
  id: number
  username: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

// 测试用户工厂（排除自动生成的字段）
type UserFactoryInput = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>

class UserFactory {
  private static counter = 0

  static create(input: UserFactoryInput = {}): User {
    return {
      id: ++this.counter,
      username: input.username || `user${this.counter}`,
      email: input.email || `user${this.counter}@example.com`,
      password: input.password || 'password123',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  static createMany(count: number, input: UserFactoryInput = {}): User[] {
    return Array.from({ length: count }, () => this.create(input))
  }
}

// 使用
const testUser = UserFactory.create({ username: 'alice' })
const testUsers = UserFactory.createMany(5, { password: 'test123' })
```

## 6. 🤔 使用 Omit\<T, K\> 需要注意什么？

### 6.1. 注意事项 1：键约束比 Pick 宽松

```typescript
type User = {
  id: number
  name: string
}

// ✅ Omit 的 K 可以包含不存在的键
type OmitWithExtra = Omit<User, 'id' | 'nonexistent'>
// { name: string; } - nonexistent 被忽略

// ❌ Pick 的 K 必须是 keyof T 的子集
type PickWithExtra = Pick<User, 'id' | 'nonexistent'> // 错误
```

### 6.2. 注意事项 2：Omit never 的行为

```typescript
type User = {
  id: number
  name: string
}

// Omit<T, never> 返回完整类型
type FullUser = Omit<User, never>
// { id: number; name: string; }

// 这在条件类型中很有用
type OmitIfString<T, K extends keyof T> = T[K] extends string ? Omit<T, K> : T
```

### 6.3. 注意事项 3：保留修饰符

```typescript
type User = {
  readonly id: number
  name?: string
  email: string
}

type UserOmit = Omit<User, 'email'>
// {
//   readonly id: number; // ✅ readonly 保留
//   name?: string;       // ✅ 可选保留
// }
```

### 6.4. 注意事项 4：与 Pick 的性能差异

```typescript
// Omit 实现基于 Pick 和 Exclude
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

// 对于大型类型，Omit 需要额外的类型计算
type LargeType = {
  /* 100 个属性 */
}

// ⚠️ 排除少量键时，Pick 可能更高效
type OmitFew = Omit<LargeType, 'prop1' | 'prop2'> // 计算成本：100 - 2 = 98 个键
type PickMany = Pick<LargeType /* 98 个键 */>

// ✅ 排除大量键时，Omit 更直观
type OmitMany = Omit<LargeType /* 50 个键 */>
```

### 6.5. 注意事项 5：索引签名的处理

```typescript
type WithIndex = {
  id: number
  name: string
  [key: string]: any
}

// Omit 会保留索引签名
type OmittedWithIndex = Omit<WithIndex, 'id'>
// {
//   name: string;
//   [key: string]: any; // ✅ 索引签名保留
// }

// 但无法通过 Omit 移除索引签名
type TryOmitIndex = Omit<WithIndex, string> // 不会移除索引签名
```

### 6.6. 注意事项 6：与联合类型的分布

```typescript
type A = { a: number; b: string; c: boolean }
type B = { b: string; c: boolean; d: number }

type Union = A | B

// Omit 会分发到联合类型的每个成员
type OmittedUnion = Omit<Union, 'b'>
// Omit<A, 'b'> | Omit<B, 'b'>
// { a: number; c: boolean; } | { c: boolean; d: number; }
```

### 6.7. 注意事项 7：类型推断陷阱

```typescript
type User = {
  id: number
  name: string
  email: string
}

// ⚠️ 运行时对象仍可能包含被排除的属性
function processUser(user: Omit<User, 'email'>): void {
  console.log(user.email) // 类型错误，但运行时可能存在
}

const fullUser: User = { id: 1, name: 'Alice', email: 'alice@example.com' }
processUser(fullUser) // ✅ 类型兼容（结构类型）

// ✅ 运行时确保移除属性
function safeProcessUser(user: Omit<User, 'email'>): void {
  const { email, ...rest } = user as any
  // 使用 rest，不会访问 email
}
```

## 7. 🆚 Pick vs. Omit

### 7.1. 使用场景对比

| 特性          | Pick<T, K>                 | Omit<T, K>                 |
| ------------- | -------------------------- | -------------------------- |
| 操作方式      | 选择指定属性               | 排除指定属性               |
| 键约束        | K 必须是 keyof T 的子集    | K 可以包含不存在的键       |
| 适用场景      | 需要的属性较少             | 需要排除的属性较少         |
| 类型安全性    | 更严格（编译时检查键存在） | 更宽松（不存在的键被忽略） |
| 实现复杂度    | 直接映射                   | 基于 Pick + Exclude        |
| 常见用途      | 提取子集                   | 移除敏感信息               |
| 性能          | 直接选择                   | 需要计算排除               |
| 可读性        | 明确列出需要的属性         | 明确列出不需要的属性       |
| 维护性        | 添加新属性需要更新 K       | 新属性自动包含             |
| 与 never 交互 | Pick<T, never> = {}        | Omit<T, never> = T         |

### 7.2. 选择指南

```typescript
type User = {
  id: number
  username: string
  email: string
  password: string
  salt: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  isActive: boolean
  lastLoginAt: Date
}

// ✅ 使用 Pick：需要的字段少
type UserPreview = Pick<User, 'id' | 'username'>

// ✅ 使用 Omit：排除的字段少
type PublicUser = Omit<User, 'password' | 'salt'>

// ⚠️ 不推荐：需要多数字段却用 Pick
type AlmostFullUser = Pick<
  User,
  | 'id'
  | 'username'
  | 'email'
  | 'createdAt'
  | 'updatedAt'
  | 'isActive'
  | 'lastLoginAt'
>

// ✅ 推荐：使用 Omit 更清晰
type AlmostFullUserBetter = Omit<User, 'password' | 'salt' | 'deletedAt'>
```

### 7.3. 互相转换

```typescript
type User = {
  id: number
  name: string
  email: string
}

// Pick 可以实现 Omit 的效果
type OmitUsingPick<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

type WithoutEmail1 = Omit<User, 'email'>
type WithoutEmail2 = OmitUsingPick<User, 'email'>
// 两者等价

// Omit 可以实现 Pick 的效果
type PickUsingOmit<T, K extends keyof T> = Omit<T, Exclude<keyof T, K>>

type OnlyId1 = Pick<User, 'id'>
type OnlyId2 = PickUsingOmit<User, 'id'>
// 两者等价
```

## 8. 🔗 引用

- [TypeScript Utility Types - Omit][1]
- [TypeScript Handbook - Mapped Types][2]
- [TypeScript Deep Dive - Utility Types][3]

[1]: https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys
[2]: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
[3]: https://basarat.gitbook.io/typescript/type-system/utility-types
