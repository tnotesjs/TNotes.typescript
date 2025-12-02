# [0221. 自定义工具类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0221.%20%E8%87%AA%E5%AE%9A%E4%B9%89%E5%B7%A5%E5%85%B7%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 如何创建基本的自定义工具类型？](#3--如何创建基本的自定义工具类型)
- [4. 🤔 如何使用条件类型创建高级工具类型？](#4--如何使用条件类型创建高级工具类型)
- [5. 🤔 如何创建递归工具类型？](#5--如何创建递归工具类型)
- [6. 🤔 如何创建实用的业务工具类型？](#6--如何创建实用的业务工具类型)
- [7. 🤔 自定义工具类型的最佳实践是什么？](#7--自定义工具类型的最佳实践是什么)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 基本工具类型的创建方法
- 条件类型和映射类型的组合使用
- 递归工具类型的实现
- 常用业务场景的工具类型
- 工具类型的命名和组织规范

## 2. 🫧 评价

自定义工具类型是 TypeScript 高级类型编程的核心技能，通过组合内置类型和高级特性可以创建强大的类型工具。

- 掌握自定义工具类型可以显著提升代码的类型安全性和可维护性
- 常用模式包括属性过滤、深度操作、类型转换等
- 需要平衡类型复杂度和可读性，避免过度设计
- 建议将常用工具类型集中管理，便于复用
- 注意递归深度限制，避免编译器错误

## 3. 🤔 如何创建基本的自定义工具类型？

基本的工具类型通常基于映射类型和条件类型：

```ts
// 工具 1：使所有属性可选并可为 null
type Nullable<T> = {
  [K in keyof T]: T[K] | null
}

interface User {
  id: number
  name: string
  email: string
}

type NullableUser = Nullable<User>
// {
//   id: number | null;
//   name: string | null;
//   email: string | null;
// }

const user: NullableUser = {
  id: 1,
  name: null, // ✅ 允许 null
  email: 'user@example.com',
}

// 工具 2：选择特定类型的属性
type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K]
}

interface Product {
  id: number
  name: string
  price: number
  description: string
  inStock: boolean
}

type StringProps = PickByType<Product, string>
// { name: string; description: string }

type NumberProps = PickByType<Product, number>
// { id: number; price: number }

// 工具 3：排除特定类型的属性
type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K]
}

type NonStringProps = OmitByType<Product, string>
// { id: number; price: number; inStock: boolean }

// 工具 4：提取函数类型的属性
type FunctionProperties<T> = {
  [K in keyof T as T[K] extends Function ? K : never]: T[K]
}

class Calculator {
  value: number = 0

  add(x: number) {
    return this.value + x
  }

  multiply(x: number) {
    return this.value * x
  }

  reset() {
    this.value = 0
  }
}

type CalculatorMethods = FunctionProperties<Calculator>
// {
//   add: (x: number) => number;
//   multiply: (x: number) => number;
//   reset: () => void;
// }

// 工具 5：合并类型
type Merge<T, U> = {
  [K in keyof T | keyof U]: K extends keyof U
    ? U[K]
    : K extends keyof T
    ? T[K]
    : never
}

interface Base {
  id: number
  createdAt: Date
}

interface Extended {
  id: string // 覆盖 Base 的 id 类型
  name: string
}

type Merged = Merge<Base, Extended>
// {
//   id: string;        // ✅ 使用 Extended 的类型
//   createdAt: Date;
//   name: string;
// }

// 工具 6：只读深层类型
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}

interface Config {
  server: {
    host: string
    port: number
    ssl: {
      enabled: boolean
      cert: string
    }
  }
}

type ReadonlyConfig = DeepReadonly<Config>

const config: ReadonlyConfig = {
  server: {
    host: 'localhost',
    port: 3000,
    ssl: {
      enabled: true,
      cert: 'cert.pem',
    },
  },
}

// ❌ 所有层级都是只读的
config.server.port = 8080
config.server.ssl.enabled = false
```

## 4. 🤔 如何使用条件类型创建高级工具类型？

条件类型配合 `infer` 关键字可以创建强大的工具类型：

```ts
// 工具 1：提取 Promise 的值类型（支持嵌套）
type UnwrapPromise<T> = T extends Promise<infer U> ? UnwrapPromise<U> : T

type Test1 = UnwrapPromise<Promise<string>>
// string

type Test2 = UnwrapPromise<Promise<Promise<number>>>
// number

// 工具 2：提取数组元素类型
type ElementType<T> = T extends (infer U)[] ? U : T

type StringArray = ElementType<string[]>
// string

type NestedArray = ElementType<number[][]>
// number[]

// 工具 3：函数参数的首个类型
type FirstParameter<T extends (...args: any) => any> = T extends (
  first: infer F,
  ...rest: any
) => any
  ? F
  : never

function process(id: number, name: string, age: number) {
  return { id, name, age }
}

type FirstParam = FirstParameter<typeof process>
// number

// 工具 4：函数参数的最后一个类型
type LastParameter<T extends (...args: any) => any> = T extends (
  ...args: [...infer Rest, infer Last]
) => any
  ? Last
  : never

type LastParam = LastParameter<typeof process>
// number

// 工具 5：过滤联合类型中的 never
type FilterNever<T> = T extends never ? never : T

type WithNever = string | number | never | boolean
type Filtered = FilterNever<WithNever>
// string | number | boolean

// 工具 6：判断两个类型是否相等
type IsEqual<T, U> = T extends U ? (U extends T ? true : false) : false

type Check1 = IsEqual<string, string>
// true

type Check2 = IsEqual<string, number>
// false

type Check3 = IsEqual<{ a: string }, { a: string }>
// true

// 工具 7：条件类型的分布式特性
type ToArray<T> = T extends any ? T[] : never

type Result1 = ToArray<string | number>
// string[] | number[]，分布式条件类型

// 禁用分布式
type ToArrayNonDistributive<T> = [T] extends [any] ? T[] : never

type Result2 = ToArrayNonDistributive<string | number>
// (string | number)[]

// 工具 8：提取对象值的联合类型
type ValueOf<T> = T[keyof T]

interface Colors {
  red: '#ff0000'
  green: '#00ff00'
  blue: '#0000ff'
}

type ColorValue = ValueOf<Colors>
// '#ff0000' | '#00ff00' | '#0000ff'

// 工具 9：创建联合类型到交叉类型的转换
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

type Union = { a: string } | { b: number }
type Intersection = UnionToIntersection<Union>
// { a: string } & { b: number }

const obj: Intersection = {
  a: 'hello',
  b: 42,
}

// 工具 10：可选属性转必需
type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

interface FormData {
  username?: string
  email?: string
  password?: string
}

type LoginForm = RequiredKeys<FormData, 'username' | 'password'>
// {
//   email?: string;
//   username: string;    // ✅ 变为必需
//   password: string;    // ✅ 变为必需
// }
```

## 5. 🤔 如何创建递归工具类型？

递归工具类型可以处理嵌套结构：

```ts
// 工具 1：深度可选
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

interface NestedConfig {
  database: {
    host: string
    port: number
    credentials: {
      username: string
      password: string
    }
  }
  cache: {
    enabled: boolean
    ttl: number
  }
}

type PartialConfig = DeepPartial<NestedConfig>

const config: PartialConfig = {
  database: {
    host: 'localhost',
    // ✅ 所有属性都是可选的
  },
}

// 工具 2：深度必需
type DeepRequired<T> = {
  [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K]
}

// 工具 3：路径类型生成
type PathsToStringProps<T> = T extends string
  ? []
  : {
      [K in Extract<keyof T, string>]: T[K] extends string
        ? [K]
        : [K, ...PathsToStringProps<T[K]>]
    }[Extract<keyof T, string>]

interface Data {
  user: {
    profile: {
      name: string
      age: number
    }
    email: string
  }
  settings: {
    theme: string
  }
}

type Paths = PathsToStringProps<Data>
// ['user', 'profile', 'name'] | ['user', 'email'] | ['settings', 'theme']

// 工具 4：根据路径获取值类型
type GetByPath<T, P extends any[]> = P extends [infer First, ...infer Rest]
  ? First extends keyof T
    ? Rest extends []
      ? T[First]
      : GetByPath<T[First], Rest>
    : never
  : never

type NameType = GetByPath<Data, ['user', 'profile', 'name']>
// string

type EmailType = GetByPath<Data, ['user', 'email']>
// string

// 工具 5：扁平化对象类型
type FlattenObject<T, Prefix extends string = ''> = {
  [K in keyof T as K extends string
    ? T[K] extends object
      ? never
      : Prefix extends ''
      ? K
      : `${Prefix}.${K}`
    : never]: T[K]
} & {
  [K in keyof T as K extends string
    ? T[K] extends object
      ? K
      : never
    : never]: FlattenObject<T[K], Prefix extends '' ? K : `${Prefix}.${K}`>
}[keyof T & string]

interface Nested {
  a: {
    b: {
      c: string
    }
    d: number
  }
  e: boolean
}

type Flattened = FlattenObject<Nested>
// {
//   'a.b.c': string;
//   'a.d': number;
//   e: boolean;
// }

// 工具 6：数组深度
type ArrayDepth<T> = T extends (infer U)[]
  ? ArrayDepth<U> extends number
    ? ArrayDepth<U> extends 0
      ? 1
      : ArrayDepth<U> extends 1
      ? 2
      : 3 // 限制深度
    : 1
  : 0

type Depth1 = ArrayDepth<number[]>
// 1

type Depth2 = ArrayDepth<number[][]>
// 2

// 工具 7：深度修改属性类型
type DeepModify<T, From, To> = {
  [K in keyof T]: T[K] extends From
    ? To
    : T[K] extends object
    ? DeepModify<T[K], From, To>
    : T[K]
}

interface Original {
  id: string
  data: {
    value: string
    nested: {
      key: string
    }
  }
}

type StringToNumber = DeepModify<Original, string, number>
// {
//   id: number;
//   data: {
//     value: number;
//     nested: {
//       key: number;
//     };
//   };
// }
```

## 6. 🤔 如何创建实用的业务工具类型？

针对常见业务场景的工具类型：

```ts
// 工具 1：API 响应包装
type ApiResponse<T, E = string> =
  | {
      success: true
      data: T
      error?: never
    }
  | {
      success: false
      data?: never
      error: E
    }

type UserResponse = ApiResponse<{ id: number; name: string }>

const success: UserResponse = {
  success: true,
  data: { id: 1, name: 'Alice' },
}

const failure: UserResponse = {
  success: false,
  error: 'User not found',
}

// ❌ 不能同时存在 data 和 error
const invalid: UserResponse = {
  success: true,
  data: { id: 1, name: 'Alice' },
  error: 'Error',
}

// 工具 2：时间戳字段
type WithTimestamps<T> = T & {
  createdAt: Date
  updatedAt: Date
}

interface Article {
  id: number
  title: string
  content: string
}

type ArticleWithTimestamps = WithTimestamps<Article>
// {
//   id: number;
//   title: string;
//   content: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// 工具 3：分页数据
type Paginated<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

type UserList = Paginated<User>

const users: UserList = {
  items: [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
  ],
  total: 100,
  page: 1,
  pageSize: 10,
  totalPages: 10,
}

// 工具 4：表单状态
type FormState<T> = {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
  isValid: boolean
}

interface LoginFormValues {
  username: string
  password: string
}

type LoginFormState = FormState<LoginFormValues>

const formState: LoginFormState = {
  values: {
    username: '',
    password: '',
  },
  errors: {
    username: 'Required',
  },
  touched: {
    username: true,
  },
  isSubmitting: false,
  isValid: false,
}

// 工具 5：加载状态
type Loadable<T, E = Error> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: E }

type UserLoadable = Loadable<User>

function renderUser(state: UserLoadable) {
  switch (state.status) {
    case 'idle':
      return 'Not loaded'
    case 'loading':
      return 'Loading...'
    case 'success':
      return `User: ${state.data.name}` // ✅ 类型安全
    case 'error':
      return `Error: ${state.error.message}`
  }
}

// 工具 6：实体 ID 类型
type EntityId<T extends string> = string & { __brand: T }

type UserId = EntityId<'User'>
type ProductId = EntityId<'Product'>

function getUser(id: UserId) {
  console.log('Getting user', id)
}

function getProduct(id: ProductId) {
  console.log('Getting product', id)
}

const userId = '123' as UserId
const productId = '456' as ProductId

getUser(userId) // ✅
// ❌ 类型不匹配
getUser(productId)

// 工具 7：枚举值类型
type EnumValues<T extends Record<string, any>> = T[keyof T]

enum Status {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending',
}

type StatusValue = EnumValues<typeof Status>
// 'active' | 'inactive' | 'pending'

// 工具 8：环境配置
type Environment = 'development' | 'staging' | 'production'

type EnvironmentConfig<T> = Record<Environment, T>

interface DatabaseConfig {
  host: string
  port: number
}

const dbConfig: EnvironmentConfig<DatabaseConfig> = {
  development: {
    host: 'localhost',
    port: 5432,
  },
  staging: {
    host: 'staging.example.com',
    port: 5432,
  },
  production: {
    host: 'prod.example.com',
    port: 5432,
  },
}

// 工具 9：CRUD 操作类型
type CrudOperations<T> = {
  create: (data: Omit<T, 'id'>) => Promise<T>
  read: (id: number) => Promise<T>
  update: (id: number, data: Partial<T>) => Promise<T>
  delete: (id: number) => Promise<void>
  list: () => Promise<T[]>
}

type UserCrud = CrudOperations<User>

const userCrud: UserCrud = {
  create: async (data) => ({ id: 1, ...data }),
  read: async (id) => ({ id, name: 'User', email: 'user@example.com' }),
  update: async (id, data) => ({
    id,
    name: 'User',
    email: 'user@example.com',
    ...data,
  }),
  delete: async (id) => {},
  list: async () => [],
}
```

## 7. 🤔 自定义工具类型的最佳实践是什么？

在创建和使用自定义工具类型时需要注意以下实践：

````ts
// 实践 1：使用描述性命名
// ❌ 不好：缩写和模糊的名称
type P<T> = Partial<T>
type RO<T> = Readonly<T>

// ✅ 好：清晰描述功能
type MakeOptional<T> = Partial<T>
type MakeReadonly<T> = Readonly<T>

// 实践 2：添加类型约束
// ❌ 不好：没有约束
type GetId<T> = T extends { id: any } ? T['id'] : never

// ✅ 好：明确约束
type GetId<T extends { id: unknown }> = T['id']

interface HasId {
  id: number
}

// 实践 3：提供默认类型参数
// ❌ 不好：总是需要提供所有参数
type Result<T, E> = { success: true; data: T } | { success: false; error: E }

// ✅ 好：提供合理的默认值
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E }

type StringResult = Result<string> // ✅ E 默认为 Error

// 实践 4：避免过度复杂
// ❌ 不好：过度嵌套和复杂
type ComplexType<T> = {
  [K in keyof T]: T[K] extends infer U
    ? U extends object
      ? U extends any[]
        ? U[number] extends infer V
          ? V extends object
            ? ComplexType<V>
            : V
          : never
        : ComplexType<U>
      : U
    : never
}

// ✅ 好：分解为多个简单的工具类型
type ArrayElement<T> = T extends (infer U)[] ? U : T
type DeepTransform<T> = T extends object
  ? { [K in keyof T]: DeepTransform<T[K]> }
  : T

// 实践 5：集中管理工具类型
// types/utils.ts
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type Maybe<T> = T | null | undefined

// types/api.ts
import { Nullable } from './utils'

export type ApiUser = {
  id: number
  name: string
  email: Nullable<string> // ✅ 复用工具类型
}

// 实践 6：添加注释说明
/**
 * 将对象的所有属性变为可选，并递归处理嵌套对象
 * @template T - 要处理的对象类型
 * @example
 * ```ts
 * interface User {
 *   name: string;
 *   profile: {
 *     age: number;
 *   };
 * }
 * type OptionalUser = DeepPartial<User>;
 * // { name?: string; profile?: { age?: number } }
 * ```
 */
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

// 实践 7：处理边界情况
// ❌ 不好：没有处理 null/undefined
type BadNonNullable<T> = T extends null ? never : T

// ✅ 好：处理所有 nullish 类型
type GoodNonNullable<T> = T extends null | undefined ? never : T

// 实践 8：使用辅助类型提高可读性
// ❌ 不好：难以理解
type FilterKeys<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never
}[keyof T]

// ✅ 好：分步骤，更清晰
type _FilterMap<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never
}
type FilterKeys<T, U> = _FilterMap<T, U>[keyof T]

// 实践 9：测试工具类型
// 创建测试用例验证类型行为
type AssertEqual<T, U> = T extends U ? (U extends T ? true : false) : false

// 测试 Nullable 工具类型
type Test1 = AssertEqual<Nullable<string>, string | null> // true
type Test2 = AssertEqual<Nullable<number>, number> // false

// 实践 10：性能考虑
// ⚠️ 注意：深度递归可能导致性能问题
type VeryDeepPartial<T, Depth extends number = 10> = Depth extends 0
  ? T
  : {
      [K in keyof T]?: T[K] extends object
        ? VeryDeepPartial<T[K], /* 减少深度 */ Depth>
        : T[K]
    }

// ✅ 限制递归深度
type SafeDeepPartial<T> = VeryDeepPartial<T, 5>
````

**组织和维护建议：**

```ts
// 文件结构建议
// types/
//   utils/
//     common.ts        - 通用工具类型
//     object.ts        - 对象操作
//     array.ts         - 数组操作
//     function.ts      - 函数操作
//   business/
//     user.ts          - 用户相关类型
//     product.ts       - 产品相关类型
//   index.ts           - 统一导出

// types/utils/common.ts
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type Maybe<T> = T | null | undefined

// types/utils/object.ts
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}

// types/index.ts
export * from './utils/common'
export * from './utils/object'
export * from './business/user'
```

## 8. 🔗 引用

- [TypeScript Handbook - Advanced Types][1]
- [TypeScript Deep Dive - Type System][2]
- [Type Challenges - Practice Custom Utility Types][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/types-from-types.html
[2]: https://basarat.gitbook.io/typescript/type-system
[3]: https://github.com/type-challenges/type-challenges
