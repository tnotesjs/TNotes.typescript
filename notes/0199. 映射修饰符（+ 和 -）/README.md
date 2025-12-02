# [0199. 映射修饰符（+ 和 -）](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0199.%20%E6%98%A0%E5%B0%84%E4%BF%AE%E9%A5%B0%E7%AC%A6%EF%BC%88%2B%20%E5%92%8C%20-%EF%BC%89)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是映射修饰符？](#3--什么是映射修饰符)
  - [3.1. 默认行为](#31-默认行为)
- [4. 🤔 如何使用 + 修饰符？](#4--如何使用--修饰符)
  - [4.1. 添加可选修饰符（+?）](#41-添加可选修饰符)
  - [4.2. 添加只读修饰符（+readonly）](#42-添加只读修饰符readonly)
  - [4.3. 同时添加两个修饰符](#43-同时添加两个修饰符)
  - [4.4. 条件添加修饰符](#44-条件添加修饰符)
- [5. 🤔 如何使用 - 修饰符？](#5--如何使用---修饰符)
  - [5.1. 移除可选修饰符（-?）](#51-移除可选修饰符-)
  - [5.2. 移除只读修饰符（-readonly）](#52-移除只读修饰符-readonly)
  - [5.3. 同时移除两个修饰符](#53-同时移除两个修饰符)
  - [5.4. 选择性移除修饰符](#54-选择性移除修饰符)
- [6. 🤔 + 和 - 修饰符如何组合使用？](#6---和---修饰符如何组合使用)
  - [6.1. 反转修饰符](#61-反转修饰符)
  - [6.2. 条件应用修饰符](#62-条件应用修饰符)
  - [6.3. 分组处理修饰符](#63-分组处理修饰符)
  - [6.4. 链式转换](#64-链式转换)
- [7. 🤔 映射修饰符有哪些实际应用？](#7--映射修饰符有哪些实际应用)
  - [7.1. 场景 1：表单状态管理](#71-场景-1表单状态管理)
  - [7.2. 场景 2：API 数据转换](#72-场景-2api-数据转换)
  - [7.3. 场景 3：配置对象的不同阶段](#73-场景-3配置对象的不同阶段)
  - [7.4. 场景 4：数据库模型转换](#74-场景-4数据库模型转换)
  - [7.5. 场景 5：不可变数据结构](#75-场景-5不可变数据结构)
- [8. 🤔 使用映射修饰符需要注意什么？](#8--使用映射修饰符需要注意什么)
  - [8.1. 注意事项 1：修饰符的优先级](#81-注意事项-1修饰符的优先级)
  - [8.2. 注意事项 2：修饰符不会递归应用](#82-注意事项-2修饰符不会递归应用)
  - [8.3. 注意事项 3：可选修饰符与 undefined 的区别](#83-注意事项-3可选修饰符与-undefined-的区别)
  - [8.4. 注意事项 4：修饰符与联合类型](#84-注意事项-4修饰符与联合类型)
  - [8.5. 注意事项 5：不能部分应用修饰符](#85-注意事项-5不能部分应用修饰符)
  - [8.6. 注意事项 6：与内置类型的关系](#86-注意事项-6与内置类型的关系)
  - [8.7. 注意事项 7：性能影响](#87-注意事项-7性能影响)
- [9. 🔗 引用](#9--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 映射修饰符的概念
- `+` 修饰符的用法
- `-` 修饰符的用法
- 修饰符的组合使用
- 实际应用场景
- 使用注意事项

## 2. 🫧 评价

映射修饰符是控制映射类型中属性特性的关键机制，通过 `+` 和 `-` 可以精确控制属性的只读性和可选性。

- `+` 和 `-` 修饰符是实现 `Partial`、`Required`、`Readonly` 等工具类型的核心
- 理解修饰符的作用是掌握类型转换的基础
- 在实际开发中，修饰符能够灵活地调整类型的严格程度
- 修饰符可以与条件类型结合，实现更复杂的类型转换
- 建议优先使用内置工具类型，只在必要时自定义映射修饰符

## 3. 🤔 什么是映射修饰符？

映射修饰符是在映射类型中用于添加或移除属性修饰符的操作符。TypeScript 支持两种修饰符操作：

- `+`：添加修饰符（默认行为）
- `-`：移除修饰符

可以操作的属性修饰符包括：

- `readonly`：只读修饰符
- `?`：可选修饰符

```ts
// 基本语法
type AddModifier<T> = {
  +readonly [K in keyof T]+?: T[K] // 添加 readonly 和 ?
}

type RemoveModifier<T> = {
  -readonly [K in keyof T]-?: T[K] // 移除 readonly 和 ?
}
```

### 3.1. 默认行为

当不指定 `+` 或 `-` 时，默认是添加修饰符（`+`）。

```ts
type User = {
  name: string;
  age: number;
};

// 这两个类型定义是等价的
type Optional1<T> = {
  [K in keyof T]?: T[K]; // 默认是 +?
};

type Optional2<T> = {
  +? [K in keyof T]: T[K]; // 显式指定 +
};

type PartialUser = Optional1<User>;
// 结果：{ name?: string; age?: number; }
```

## 4. 🤔 如何使用 + 修饰符？

`+` 修饰符用于添加 `readonly` 或 `?` 修饰符到属性上。

### 4.1. 添加可选修饰符（+?）

```ts
type User = {
  name: string
  age: number
  email: string
}

// 将所有属性变为可选
type Optional<T> = {
  [K in keyof T]+?: T[K]
}

type PartialUser = Optional<User>
// 结果：{ name?: string; age?: number; email?: string; }

// 使用示例
const user1: PartialUser = {} // ✅ 合法
const user2: PartialUser = { name: 'Alice' } // ✅ 合法
const user3: PartialUser = { name: 'Bob', age: 30 } // ✅ 合法
```

### 4.2. 添加只读修饰符（+readonly）

```ts
type Product = {
  id: number
  name: string
  price: number
}

// 将所有属性变为只读
type ReadonlyType<T> = {
  +readonly [K in keyof T]: T[K]
}

type ReadonlyProduct = ReadonlyType<Product>
// 结果：{ readonly id: number; readonly name: string; readonly price: number; }

// 使用示例
const product: ReadonlyProduct = {
  id: 1,
  name: 'Book',
  price: 29.99,
}

product.price = 19.99 // ❌ 错误：无法分配到 "price" ，因为它是只读属性
```

### 4.3. 同时添加两个修饰符

```ts
type Config = {
  apiUrl: string
  timeout: number
  retries: number
}

// 同时添加 readonly 和可选修饰符
type PartialReadonly<T> = {
  +readonly [K in keyof T]+?: T[K]
}

type PartialReadonlyConfig = PartialReadonly<Config>
// 结果：
// {
//   readonly apiUrl?: string;
//   readonly timeout?: number;
//   readonly retries?: number;
// }

// 使用示例
const config: PartialReadonlyConfig = {
  apiUrl: 'https://api.example.com',
}

config.timeout = 5000 // ❌ 错误：无法分配到 "timeout"，因为它是只读属性
```

### 4.4. 条件添加修饰符

```ts
// 只为特定类型的属性添加可选修饰符
type OptionalStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]+?: T[K]
} & {
  [K in keyof T as T[K] extends string ? never : K]: T[K]
}

type Data = {
  name: string
  age: number
  email: string
}

type Result = OptionalStrings<Data>
// 结果：{ name?: string; email?: string; age: number; }
```

## 5. 🤔 如何使用 - 修饰符？

`-` 修饰符用于移除 `readonly` 或 `?` 修饰符。

### 5.1. 移除可选修饰符（-?）

```ts
type PartialUser = {
  name?: string
  age?: number
  email?: string
}

// 将所有可选属性变为必需
type Required<T> = {
  [K in keyof T]-?: T[K]
}

type RequiredUser = Required<PartialUser>
// 结果：{ name: string; age: number; email: string; }

// 使用示例
const user: RequiredUser = {
  name: 'Alice',
  age: 30,
  email: 'alice@example.com',
} // ✅ 必须提供所有属性

const incompleteUser: RequiredUser = {
  name: 'Bob',
} // ❌ 错误：缺少属性 "age" 和 "email"
```

### 5.2. 移除只读修饰符（-readonly）

```ts
type ReadonlyConfig = {
  readonly host: string
  readonly port: number
  readonly ssl: boolean
}

// 将所有只读属性变为可写
type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}

type MutableConfig = Mutable<ReadonlyConfig>
// 结果：{ host: string; port: number; ssl: boolean; }

// 使用示例
const config: MutableConfig = {
  host: 'localhost',
  port: 3000,
  ssl: false,
}

config.port = 8080 // ✅ 可以修改
config.ssl = true // ✅ 可以修改
```

### 5.3. 同时移除两个修饰符

```ts
type PartialReadonlyUser = {
  readonly name?: string
  readonly age?: number
  readonly email?: string
}

// 同时移除 readonly 和可选修饰符
type MutableRequired<T> = {
  -readonly [K in keyof T]-?: T[K]
}

type NormalUser = MutableRequired<PartialReadonlyUser>
// 结果：{ name: string; age: number; email: string; }

// 使用示例
const user: NormalUser = {
  name: 'Charlie',
  age: 25,
  email: 'charlie@example.com',
}

user.name = 'Charles' // ✅ 可以修改
user.age = 26 // ✅ 可以修改
```

### 5.4. 选择性移除修饰符

```ts
type Data = {
  readonly id: number
  readonly name?: string
  age?: number
  email: string
}

// 只移除 readonly 修饰符，保留 ?
type RemoveReadonly<T> = {
  -readonly [K in keyof T]: T[K]
}

type Result = RemoveReadonly<Data>
// 结果：{ id: number; name?: string; age?: number; email: string; }

// 只移除 ? 修饰符，保留 readonly
type RemoveOptional<T> = {
  [K in keyof T]-?: T[K]
}

type Result2 = RemoveOptional<Data>
// 结果：{ readonly id: number; readonly name: string; age: number; email: string; }
```

## 6. 🤔 + 和 - 修饰符如何组合使用？

可以灵活组合使用 `+` 和 `-` 修饰符来实现复杂的类型转换。

### 6.1. 反转修饰符

```ts
type User = {
  readonly name: string
  age?: number
}

// 交换 readonly 和可选修饰符
type Swap<T> = {
  -readonly [K in keyof T]+?: T[K]
}

type SwappedUser = Swap<User>
// 结果：{ name?: string; age?: number; }
```

### 6.2. 条件应用修饰符

```ts
// 为对象类型添加 readonly，为基本类型保持不变
type DeepReadonly<T> = {
  +readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}

type Data = {
  user: {
    name: string
    profile: {
      age: number
    }
  }
  count: number
}

type ReadonlyData = DeepReadonly<Data>
// 结果：
// {
//   readonly user: {
//     readonly name: string;
//     readonly profile: {
//       readonly age: number;
//     };
//   };
//   readonly count: number;
// }
```

### 6.3. 分组处理修饰符

```ts
type ApiResponse = {
  readonly id: string
  data?: unknown
  readonly timestamp: Date
  error?: Error
}

// 移除只读属性的 readonly，保持可选属性的 ?
type EditableResponse<T> = {
  -readonly [K in keyof T]: T[K]
}

type MutableResponse = EditableResponse<ApiResponse>
// 结果：{ id: string; data?: unknown; timestamp: Date; error?: Error; }

// 移除可选属性的 ?，保持 readonly
type CompleteResponse<T> = {
  [K in keyof T]-?: T[K]
}

type FullResponse = CompleteResponse<ApiResponse>
// 结果：{ readonly id: string; data: unknown; readonly timestamp: Date; error: Error; }
```

### 6.4. 链式转换

```ts
type Original = {
  readonly name?: string
  readonly age?: number
}

// 第一步：移除 readonly
type Step1<T> = {
  -readonly [K in keyof T]: T[K]
}

// 第二步：移除 ?
type Step2<T> = {
  [K in keyof T]-?: T[K]
}

// 组合使用
type Final = Step2<Step1<Original>>
// 结果：{ name: string; age: number; }

// 或者一步完成
type DirectTransform<T> = {
  -readonly [K in keyof T]-?: T[K]
}

type Result = DirectTransform<Original>
// 结果：{ name: string; age: number; }
```

## 7. 🤔 映射修饰符有哪些实际应用？

### 7.1. 场景 1：表单状态管理

```ts
// 表单字段定义
type FormFields = {
  username: string
  email: string
  password: string
  confirmPassword: string
}

// 初始状态：所有字段可选且可编辑
type FormState = {
  [K in keyof FormFields]+?: FormFields[K]
}

// 提交后状态：所有字段必需且只读
type SubmittedForm = {
  -readonly [K in keyof FormFields]-?: FormFields[K]
} & {
  readonly submittedAt: Date
}

// 使用示例
let form: FormState = {}

form.username = 'john_doe' // ✅ 可以设置
form.email = 'john@example.com' // ✅ 可以设置

// 提交后
const submitted: SubmittedForm = {
  username: 'john_doe',
  email: 'john@example.com',
  password: '***',
  confirmPassword: '***',
  submittedAt: new Date(),
}

submitted.username = 'new_name' // ❌ 错误：无法修改已提交的表单
```

### 7.2. 场景 2：API 数据转换

```ts
// API 响应类型（所有字段都是只读的）
type ApiUser = {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly createdAt: Date
}

// 编辑表单类型（移除只读，某些字段可选）
type UserEditForm = {
  -readonly [K in keyof Omit<ApiUser, 'id' | 'createdAt'>]+?: ApiUser[K]
}

// 使用示例
const apiUser: ApiUser = {
  id: '123',
  name: 'Alice',
  email: 'alice@example.com',
  createdAt: new Date(),
}

const editForm: UserEditForm = {
  name: 'Alice Updated',
}

editForm.email = 'newemail@example.com' // ✅ 可以修改
```

### 7.3. 场景 3：配置对象的不同阶段

```ts
// 配置定义（所有字段必需）
type Config = {
  host: string
  port: number
  ssl: boolean
  timeout: number
}

// 用户输入阶段（所有字段可选）
type ConfigInput = {
  [K in keyof Config]+?: Config[K]
}

// 验证后阶段（所有字段必需且只读）
type ValidatedConfig = {
  +readonly [K in keyof Config]-?: Config[K]
}

// 使用示例
const userInput: ConfigInput = {
  host: 'localhost',
} // ✅ 可以只提供部分配置

const validated: ValidatedConfig = {
  host: 'localhost',
  port: 3000,
  ssl: false,
  timeout: 5000,
}

validated.port = 8080 // ❌ 错误：无法修改已验证的配置
```

### 7.4. 场景 4：数据库模型转换

```ts
// 数据库模型（带有自动生成字段）
type DbModel = {
  readonly id: number
  name: string
  email: string
  readonly createdAt: Date
  readonly updatedAt: Date
}

// 创建输入类型（排除自动生成字段，其他可选）
type CreateInput<T> = {
  [K in keyof T as K extends 'id' | 'createdAt' | 'updatedAt'
    ? never
    : K]+?: T[K]
}

// 更新输入类型（排除 id 和时间戳，其他可选）
type UpdateInput<T> = {
  -readonly [K in keyof T as K extends 'id' | 'createdAt' | 'updatedAt'
    ? never
    : K]+?: T[K]
}

type CreateUserInput = CreateInput<DbModel>
// 结果：{ name?: string; email?: string; }

type UpdateUserInput = UpdateInput<DbModel>
// 结果：{ name?: string; email?: string; }

// 使用示例
const createUser: CreateUserInput = {
  name: 'Bob',
  email: 'bob@example.com',
}

const updateUser: UpdateUserInput = {
  email: 'newemail@example.com',
}
```

### 7.5. 场景 5：不可变数据结构

```ts
type Todo = {
  id: number
  title: string
  completed: boolean
}

// 深度只读
type DeepReadonly<T> = {
  +readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}

// 深度可变
type DeepMutable<T> = {
  -readonly [K in keyof T]: T[K] extends object ? DeepMutable<T[K]> : T[K]
}

type ReadonlyTodo = DeepReadonly<Todo>
type MutableTodo = DeepMutable<ReadonlyTodo>

// 使用示例
const immutableTodo: ReadonlyTodo = {
  id: 1,
  title: 'Learn TypeScript',
  completed: false,
}

immutableTodo.completed = true // ❌ 错误：无法修改

const mutableTodo: MutableTodo = {
  id: 1,
  title: 'Learn TypeScript',
  completed: false,
}

mutableTodo.completed = true // ✅ 可以修改
```

## 8. 🤔 使用映射修饰符需要注意什么？

### 8.1. 注意事项 1：修饰符的优先级

修饰符的应用顺序会影响结果。

```ts
type Original = {
  readonly name?: string
}

// 先移除 readonly，再添加 ?
type Step1 = {
  -readonly [K in keyof Original]+?: Original[K]
}
// 结果：{ name?: string; }

// 先移除 ?，再添加 readonly
type Step2 = {
  +readonly [K in keyof Original]-?: Original[K]
}
// 结果：{ readonly name: string; }
```

### 8.2. 注意事项 2：修饰符不会递归应用

修饰符只作用于第一层属性，不会自动递归到嵌套对象。

```ts
type Nested = {
  user: {
    name: string
    profile: {
      age: number
    }
  }
}

type Readonly1 = {
  +readonly [K in keyof Nested]: Nested[K]
}
// 结果：{ readonly user: { name: string; profile: { age: number; } } }
// 只有 user 是只读的，name 和 age 仍可修改

// 需要递归处理
type DeepReadonly<T> = {
  +readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}

type Readonly2 = DeepReadonly<Nested>
// 所有层级都是只读的
```

### 8.3. 注意事项 3：可选修饰符与 undefined 的区别

移除可选修饰符后，属性必须存在，但可以是 `undefined`。

```ts
type Optional = {
  name?: string
}

type Required = {
  [K in keyof Optional]-?: Optional[K]
}

const obj1: Required = {} // ❌ 错误：缺少属性 "name"
const obj2: Required = { name: undefined } // ✅ 合法
const obj3: Required = { name: 'Alice' } // ✅ 合法
```

### 8.4. 注意事项 4：修饰符与联合类型

修饰符会应用到联合类型的每个成员。

```ts
type Union = { a: string } | { b: number }

type ReadonlyUnion = {
  +readonly [K in keyof Union]: Union[K]
}
// 结果：{ readonly a: string } | { readonly b: number }
```

### 8.5. 注意事项 5：不能部分应用修饰符

不能对某些属性应用修饰符而其他属性不应用（在同一个映射类型中）。

```ts
type User = {
  name: string
  age: number
  email: string
}

// ❌ 错误：不能在同一映射类型中部分应用修饰符
type Invalid = {
  +readonly [K in 'name' | 'email']: User[K] // 这样不行
}

// ✅ 正确：使用交叉类型
type Valid = {
  +readonly [K in 'name' | 'email']: User[K]
} & {
  [K in 'age']: User[K]
}
// 结果：{ readonly name: string; readonly email: string; age: number; }
```

### 8.6. 注意事项 6：与内置类型的关系

理解修饰符有助于理解内置工具类型的实现。

```ts
// Partial 的实现
type MyPartial<T> = {
  [K in keyof T]+?: T[K]
}

// Required 的实现
type MyRequired<T> = {
  [K in keyof T]-?: T[K]
}

// Readonly 的实现
type MyReadonly<T> = {
  +readonly [K in keyof T]: T[K]
}

// Mutable（TypeScript 没有内置，但可以自己实现）
type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}
```

### 8.7. 注意事项 7：性能影响

复杂的递归修饰符操作可能影响编译性能。

```ts
// ⚠️ 深度递归可能影响性能
type DeepPartial<T> = {
  [K in keyof T]+?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

// 建议：限制递归深度
type DeepPartialLimited<T, D extends number = 5> = D extends 0
  ? T
  : {
      [K in keyof T]+?: T[K] extends object
        ? DeepPartialLimited<T[K], Decrement<D>>
        : T[K]
    }

type Decrement<N extends number> = N extends 5
  ? 4
  : N extends 4
  ? 3
  : N extends 3
  ? 2
  : N extends 2
  ? 1
  : 0
```

## 9. 🔗 引用

- [TypeScript Handbook - Mapping Modifiers][1]
- [TypeScript Deep Dive - Mapped Types][2]
- [TypeScript 中文手册 - 映射修饰符][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#mapping-modifiers
[2]: https://basarat.gitbook.io/typescript/type-system/mapped-types
[3]: https://typescript.bootcss.com/2/mapped-types.html
