# [0203. 基于映射类型创建新类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0203.%20%E5%9F%BA%E4%BA%8E%E6%98%A0%E5%B0%84%E7%B1%BB%E5%9E%8B%E5%88%9B%E5%BB%BA%E6%96%B0%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是基于映射类型创建新类型？](#3--什么是基于映射类型创建新类型)
  - [3.1. 基本创建模式](#31-基本创建模式)
  - [3.2. 创建新类型的常见模式](#32-创建新类型的常见模式)
- [4. 🤔 如何实现深度类型转换？](#4--如何实现深度类型转换)
  - [4.1. 深度只读](#41-深度只读)
  - [4.2. 深度可选](#42-深度可选)
  - [4.3. 深度必需](#43-深度必需)
  - [4.4. 深度可空](#44-深度可空)
- [5. 🤔 如何组合多个映射类型？](#5--如何组合多个映射类型)
  - [5.1. 使用交叉类型组合](#51-使用交叉类型组合)
  - [5.2. 分步应用映射类型](#52-分步应用映射类型)
  - [5.3. 条件组合](#53-条件组合)
  - [5.4. 创建辅助工具类型](#54-创建辅助工具类型)
- [6. 🤔 如何实现条件类型转换？](#6--如何实现条件类型转换)
  - [6.1. 基于类型的条件转换](#61-基于类型的条件转换)
  - [6.2. 基于键名的条件转换](#62-基于键名的条件转换)
  - [6.3. 多条件组合转换](#63-多条件组合转换)
  - [6.4. 分支类型转换](#64-分支类型转换)
- [7. 🤔 基于映射类型的实际应用有哪些？](#7--基于映射类型的实际应用有哪些)
  - [7.1. 场景 1：API 客户端生成](#71-场景-1api-客户端生成)
  - [7.2. 场景 2：状态管理](#72-场景-2状态管理)
  - [7.3. 场景 3：表单构建器](#73-场景-3表单构建器)
  - [7.4. 场景 4：ORM 模型生成](#74-场景-4orm-模型生成)
  - [7.5. 场景 5：响应式数据](#75-场景-5响应式数据)
- [8. 🤔 创建复杂映射类型需要注意什么？](#8--创建复杂映射类型需要注意什么)
  - [8.1. 注意事项 1：递归深度限制](#81-注意事项-1递归深度限制)
  - [8.2. 注意事项 2：函数类型的特殊处理](#82-注意事项-2函数类型的特殊处理)
  - [8.3. 注意事项 3：保持类型信息](#83-注意事项-3保持类型信息)
  - [8.4. 注意事项 4：循环引用](#84-注意事项-4循环引用)
  - [8.5. 注意事项 5：性能影响](#85-注意事项-5性能影响)
  - [8.6. 注意事项 6：类型推断的限制](#86-注意事项-6类型推断的限制)
  - [8.7. 注意事项 7：与内置类型的兼容性](#87-注意事项-7与内置类型的兼容性)
- [9. 🔗 引用](#9--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 基于映射类型创建新类型的方法
- 深度递归映射
- 映射类型的组合
- 条件类型转换
- 实际应用场景
- 使用注意事项

## 2. 🫧 评价

基于映射类型创建新类型是 TypeScript 高级类型编程的核心技能，它允许我们动态地构建复杂的类型结构。

- 映射类型是构建工具类型和类型转换的基础
- 递归映射可以处理任意深度的嵌套结构
- 组合多个映射类型能实现复杂的类型转换逻辑
- 理解映射类型的创建模式是掌握类型体操的关键
- 实际开发中，自定义映射类型可以大幅提升类型安全性和开发效率

## 3. 🤔 什么是基于映射类型创建新类型？

基于映射类型创建新类型是指利用映射类型的机制，从现有类型派生出具有特定特征的新类型。

### 3.1. 基本创建模式

```ts
// 模式 1：属性值类型转换
type Stringify<T> = {
  [K in keyof T]: string
}

type User = {
  id: number
  age: number
  active: boolean
}

type StringUser = Stringify<User>
// 结果：{ id: string; age: string; active: string; }

// 模式 2：属性包装
type Nullable<T> = {
  [K in keyof T]: T[K] | null
}

type NullableUser = Nullable<User>
// 结果：{ id: number | null; age: number | null; active: boolean | null; }

// 模式 3：属性转换为 Promise
type Promisify<T> = {
  [K in keyof T]: Promise<T[K]>
}

type AsyncUser = Promisify<User>
// 结果：{ id: Promise<number>; age: Promise<number>; active: Promise<boolean>; }
```

### 3.2. 创建新类型的常见模式

```ts
type原始类型 = {
  name: string;
  age: number;
};

// 1. 值类型转换
type ToArray<T> = {
  [K in keyof T]: T[K][];
};

// 2. 函数包装
type ToGetter<T> = {
  [K in keyof T]: () => T[K];
};

// 3. 验证器生成
type ToValidator<T> = {
  [K in keyof T]: (value: T[K]) => boolean;
};

// 4. 事件处理器生成
type ToEventHandler<T> = {
  [K in keyof T as `on${Capitalize<K & string>}Change`]: (value: T[K]) => void;
};
```

## 4. 🤔 如何实现深度类型转换？

深度类型转换使用递归映射来处理嵌套对象。

### 4.1. 深度只读

```ts
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? T[K] extends Function
      ? T[K]
      : DeepReadonly<T[K]>
    : T[K]
}

type Config = {
  server: {
    host: string
    port: number
    ssl: {
      enabled: boolean
      cert: string
    }
  }
  database: {
    url: string
  }
}

type ReadonlyConfig = DeepReadonly<Config>
// 所有层级的属性都是只读的

const config: ReadonlyConfig = {
  server: {
    host: 'localhost',
    port: 3000,
    ssl: {
      enabled: true,
      cert: '/path/to/cert',
    },
  },
  database: {
    url: 'mongodb://localhost',
  },
}

// ❌ 所有层级都不能修改
config.server = {} as any // 错误
config.server.host = '' // 错误
config.server.ssl.enabled = false // 错误
```

### 4.2. 深度可选

```ts
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
    ? T[K] extends Function
      ? T[K]
      : DeepPartial<T[K]>
    : T[K]
}

type User = {
  profile: {
    name: string
    address: {
      street: string
      city: string
    }
  }
  settings: {
    theme: string
  }
}

type PartialUser = DeepPartial<User>

// 所有层级都是可选的
const user1: PartialUser = {}
const user2: PartialUser = { profile: {} }
const user3: PartialUser = { profile: { address: {} } }
const user4: PartialUser = {
  profile: {
    name: 'Alice',
    address: { city: 'NYC' },
  },
}
```

### 4.3. 深度必需

```ts
type DeepRequired<T> = {
  [K in keyof T]-?: T[K] extends object
    ? T[K] extends Function
      ? T[K]
      : DeepRequired<T[K]>
    : T[K]
}

type PartialConfig = {
  server?: {
    host?: string
    port?: number
  }
  database?: {
    url?: string
  }
}

type RequiredConfig = DeepRequired<PartialConfig>
// 所有层级都是必需的

const config: RequiredConfig = {
  server: {
    host: 'localhost',
    port: 3000,
  },
  database: {
    url: 'mongodb://localhost',
  },
}
```

### 4.4. 深度可空

```ts
type DeepNullable<T> = {
  [K in keyof T]: T[K] extends object
    ? T[K] extends Function
      ? T[K] | null
      : DeepNullable<T[K]> | null
    : T[K] | null
}

type Data = {
  user: {
    name: string
    profile: {
      age: number
    }
  }
}

type NullableData = DeepNullable<Data>
// 所有层级都可以是 null

const data: NullableData = {
  user: null, // ✅ 合法
}

const data2: NullableData = {
  user: {
    name: 'Alice',
    profile: null, // ✅ 合法
  },
}
```

## 5. 🤔 如何组合多个映射类型？

可以通过交叉类型、联合类型等方式组合多个映射类型。

### 5.1. 使用交叉类型组合

```ts
type User = {
  id: number
  name: string
  email: string
}

// 组合多个映射
type ReadonlyPartial<T> = Readonly<T> & Partial<T>

// 这等价于：
type ReadonlyPartialManual<T> = {
  readonly [K in keyof T]?: T[K]
}

type FlexibleUser = ReadonlyPartial<User>
// 结果：{ readonly id?: number; readonly name?: string; readonly email?: string; }
```

### 5.2. 分步应用映射类型

```ts
type User = {
  readonly id: number
  name?: string
  email?: string
}

// 第一步：移除 readonly
type Step1<T> = {
  -readonly [K in keyof T]: T[K]
}

// 第二步：移除可选
type Step2<T> = {
  [K in keyof T]-?: T[K]
}

// 组合应用
type MutableRequired<T> = Step2<Step1<T>>

type CleanUser = MutableRequired<User>
// 结果：{ id: number; name: string; email: string; }
```

### 5.3. 条件组合

```ts
type Data = {
  id: number
  name: string
  age: number
  email: string
}

// 为 string 类型添加验证器，其他类型保持不变
type WithValidators<T> = {
  [K in keyof T]: T[K]
} & {
  [K in keyof T as T[K] extends string ? `${K & string}Validator` : never]: (
    value: string
  ) => boolean
}

type DataWithValidators = WithValidators<Data>
// 结果：
// {
//   id: number;
//   name: string;
//   age: number;
//   email: string;
//   nameValidator: (value: string) => boolean;
//   emailValidator: (value: string) => boolean;
// }
```

### 5.4. 创建辅助工具类型

```ts
// 合并类型并解决冲突
type Merge<T, U> = {
  [K in keyof T | keyof U]: K extends keyof U
    ? U[K]
    : K extends keyof T
    ? T[K]
    : never
}

type A = { a: number; b: string }
type B = { b: number; c: boolean }

type Merged = Merge<A, B>
// 结果：{ a: number; b: number; c: boolean; }

// 差集类型
type Diff<T, U> = {
  [K in Exclude<keyof T, keyof U>]: T[K]
}

type OnlyInA = Diff<A, B>
// 结果：{ a: number; }
```

## 6. 🤔 如何实现条件类型转换？

条件类型转换根据属性的类型或其他条件来决定如何转换。

### 6.1. 基于类型的条件转换

```ts
// 将对象类型转换为 Promise，基本类型保持不变
type Asyncify<T> = {
  [K in keyof T]: T[K] extends object
    ? T[K] extends Function
      ? T[K]
      : Promise<T[K]>
    : T[K]
}

type Service = {
  id: number
  fetchUser: () => User
  config: {
    timeout: number
  }
}

type AsyncService = Asyncify<Service>
// 结果：
// {
//   id: number;
//   fetchUser: () => User;
//   config: Promise<{ timeout: number }>;
// }
```

### 6.2. 基于键名的条件转换

```ts
// 为私有属性（以 _ 开头）添加特殊处理
type TransformPrivate<T> = {
  [K in keyof T as K extends `_${string}` ? never : K]: T[K]
} & {
  [K in keyof T as K extends `_${infer Name}` ? Name : never]: () => T[K]
}

type Class = {
  _internal: string
  _cache: object
  public: number
}

type Transformed = TransformPrivate<Class>
// 结果：
// {
//   public: number;
//   internal: () => string;
//   cache: () => object;
// }
```

### 6.3. 多条件组合转换

```ts
// 根据多个条件决定属性处理方式
type SmartTransform<T> = {
  [K in keyof T]: K extends `_${string}`
    ? never // 移除私有属性
    : T[K] extends Function
    ? T[K] // 保持函数
    : T[K] extends object
    ? Readonly<T[K]> // 对象变只读
    : T[K] | null // 基本类型可空
}

type Mixed = {
  _private: string
  name: string
  config: { port: number }
  handler: () => void
  count: number
}

type SmartMixed = SmartTransform<Mixed>
// 结果：
// {
//   name: string | null;
//   config: Readonly<{ port: number }>;
//   handler: () => void;
//   count: number | null;
// }
```

### 6.4. 分支类型转换

```ts
// 根据属性类型应用不同的转换
type ConditionalTransform<T> = {
  [K in keyof T]: T[K] extends string
    ? `String: ${T[K]}` // 字符串添加前缀
    : T[K] extends number
    ? { value: T[K]; doubled: number } // 数字包装为对象
    : T[K] extends boolean
    ? T[K] extends true
      ? 1
      : 0 // 布尔值转数字
    : T[K] // 其他保持不变
}
```

## 7. 🤔 基于映射类型的实际应用有哪些？

### 7.1. 场景 1：API 客户端生成

```ts
// API 端点定义
type ApiEndpoints = {
  getUser: { id: number }
  createUser: { name: string; email: string }
  updateUser: { id: number; name?: string; email?: string }
  deleteUser: { id: number }
}

// 生成类型安全的 API 客户端
type ApiClient<T> = {
  [K in keyof T]: (params: T[K]) => Promise<any>
}

type Client = ApiClient<ApiEndpoints>
// 结果：
// {
//   getUser: (params: { id: number }) => Promise<any>;
//   createUser: (params: { name: string; email: string }) => Promise<any>;
//   updateUser: (params: { id: number; name?: string; email?: string }) => Promise<any>;
//   deleteUser: (params: { id: number }) => Promise<any>;
// }

// 使用示例
declare const client: Client

client.getUser({ id: 1 })
client.createUser({ name: 'Alice', email: 'alice@example.com' })
```

### 7.2. 场景 2：状态管理

```ts
// 状态定义
type State = {
  count: number
  user: { name: string; age: number }
  items: string[]
}

// 生成 actions
type Actions<T> = {
  [K in keyof T as `set${Capitalize<K & string>}`]: (value: T[K]) => void
} & {
  [K in keyof T as `reset${Capitalize<K & string>}`]: () => void
}

type StateActions = Actions<State>
// 结果：
// {
//   setCount: (value: number) => void;
//   resetCount: () => void;
//   setUser: (value: { name: string; age: number }) => void;
//   resetUser: () => void;
//   setItems: (value: string[]) => void;
//   resetItems: () => void;
// }
```

### 7.3. 场景 3：表单构建器

```ts
type FormField = {
  username: string
  email: string
  age: number
  agreed: boolean
}

// 生成表单配置
type FormConfig<T> = {
  [K in keyof T]: {
    label: string
    type: T[K] extends string
      ? 'text' | 'email'
      : T[K] extends number
      ? 'number'
      : T[K] extends boolean
      ? 'checkbox'
      : 'text'
    value: T[K]
    validator?: (value: T[K]) => string | null
    required: boolean
  }
}

type Config = FormConfig<FormField>

const formConfig: Config = {
  username: {
    label: 'Username',
    type: 'text',
    value: '',
    required: true,
  },
  email: {
    label: 'Email',
    type: 'email',
    value: '',
    required: true,
  },
  age: {
    label: 'Age',
    type: 'number',
    value: 0,
    required: false,
  },
  agreed: {
    label: 'Agree to terms',
    type: 'checkbox',
    value: false,
    required: true,
  },
}
```

### 7.4. 场景 4：ORM 模型生成

```ts
type User = {
  id: number
  name: string
  email: string
  createdAt: Date
}

// 生成查询方法
type QueryMethods<T> = {
  findAll: () => Promise<T[]>
  findById: (id: T extends { id: infer ID } ? ID : never) => Promise<T | null>
} & {
  [K in keyof T as `findBy${Capitalize<K & string>}`]: (
    value: T[K]
  ) => Promise<T[]>
}

type UserModel = QueryMethods<User>
// 包含：findAll, findById, findByName, findByEmail, findByCreatedAt 等方法
```

### 7.5. 场景 5：响应式数据

```ts
type Data = {
  count: number
  name: string
  items: string[]
}

// 生成响应式包装
type Reactive<T> = {
  [K in keyof T]: {
    get value(): T[K]
    set value(v: T[K])
    subscribe(callback: (value: T[K]) => void): () => void
  }
}

type ReactiveData = Reactive<Data>

declare const reactiveData: ReactiveData

// 使用
reactiveData.count.value = 10
console.log(reactiveData.count.value)
reactiveData.count.subscribe((value) => console.log('Count changed:', value))
```

## 8. 🤔 创建复杂映射类型需要注意什么？

### 8.1. 注意事项 1：递归深度限制

TypeScript 有递归深度限制（通常是 50 层）。

```ts
// ⚠️ 可能超过递归深度限制
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}

// ✅ 更安全：添加深度限制
type DeepReadonlyWithDepth<T, Depth extends number = 5> = Depth extends 0
  ? T
  : {
      readonly [K in keyof T]: T[K] extends object
        ? DeepReadonlyWithDepth<T[K], Decrement<Depth>>
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

### 8.2. 注意事项 2：函数类型的特殊处理

函数类型是对象，需要特殊处理避免错误转换。

```ts
// ❌ 错误：会错误地转换函数
type BadDeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? BadDeepReadonly<T[K]> : T[K]
}

// ✅ 正确：排除函数类型
type GoodDeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends Function
    ? T[K]
    : T[K] extends object
    ? GoodDeepReadonly<T[K]>
    : T[K]
}
```

### 8.3. 注意事项 3：保持类型信息

某些转换可能丢失类型信息。

```ts
type User = {
  id: number
  name: string
}

// ❌ 丢失了具体类型信息
type Bad<T> = {
  [K in keyof T]: any
}

// ✅ 保持类型信息
type Good<T> = {
  [K in keyof T]: T[K]
}
```

### 8.4. 注意事项 4：循环引用

处理自引用类型需要特别小心。

```ts
type Node = {
  value: number
  next?: Node
}

// TypeScript 可以处理，但要注意性能
type DeepReadonlyNode = DeepReadonly<Node>
```

### 8.5. 注意事项 5：性能影响

复杂的映射类型会影响编译性能。

```ts
// ⚠️ 性能影响较大
type ComplexTransform<T> = {
  [K in keyof T]: T[K] extends infer U
    ? U extends object
      ? U extends Function
        ? U
        : ComplexTransform<U>
      : U | null
    : never
}

// 建议：简化逻辑或使用分步转换
```

### 8.6. 注意事项 6：类型推断的限制

某些复杂转换可能导致类型推断失败。

```ts
// 可能需要显式类型注解
type Complex<T> = {
  [K in keyof T as K extends `${infer Prefix}_${infer Suffix}`
    ? `${Prefix}${Capitalize<Suffix>}`
    : K]: T[K]
}

// 使用时可能需要类型断言
const result = complexFunction() as Complex<SomeType>
```

### 8.7. 注意事项 7：与内置类型的兼容性

确保自定义类型与内置工具类型兼容。

```ts
// 确保与 Partial、Readonly 等兼容
type MyTransform<T> = {
  [K in keyof T]: T[K]
}

type Test = MyTransform<Partial<User>> // 应该能正常工作
```

## 9. 🔗 引用

- [TypeScript Handbook - Advanced Mapped Types][1]
- [TypeScript Deep Dive - Creating New Types][2]
- [TypeScript 类型体操][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
[2]: https://basarat.gitbook.io/typescript/type-system/mapped-types
[3]: https://github.com/type-challenges/type-challenges
