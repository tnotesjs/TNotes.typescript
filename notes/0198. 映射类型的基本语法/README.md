# [0198. 映射类型的基本语法](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0198.%20%E6%98%A0%E5%B0%84%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%9F%BA%E6%9C%AC%E8%AF%AD%E6%B3%95)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是映射类型？](#3--什么是映射类型)
  - [3.1. 映射类型的核心思想](#31-映射类型的核心思想)
- [4. 🤔 映射类型的基本语法是什么？](#4--映射类型的基本语法是什么)
  - [4.1. 基本示例](#41-基本示例)
  - [4.2. 语法变体](#42-语法变体)
- [5. 🤔 映射类型如何遍历键？](#5--映射类型如何遍历键)
  - [5.1. 遍历字面量联合](#51-遍历字面量联合)
  - [5.2. 遍历对象键](#52-遍历对象键)
  - [5.3. 遍历时使用键](#53-遍历时使用键)
  - [5.4. 条件遍历](#54-条件遍历)
- [6. 🤔 如何在映射类型中使用不同的键源？](#6--如何在映射类型中使用不同的键源)
  - [6.1. 使用 keyof 获取对象键](#61-使用-keyof-获取对象键)
  - [6.2. 使用联合类型作为键源](#62-使用联合类型作为键源)
  - [6.3. 使用泛型参数作为键源](#63-使用泛型参数作为键源)
  - [6.4. 使用枚举作为键源](#64-使用枚举作为键源)
  - [6.5. 组合多个键源](#65-组合多个键源)
- [7. 🤔 映射类型有哪些实际应用场景？](#7--映射类型有哪些实际应用场景)
  - [7.1. 场景 1：创建配置对象类型](#71-场景-1创建配置对象类型)
  - [7.2. 场景 2：表单状态管理](#72-场景-2表单状态管理)
  - [7.3. 场景 3：事件处理器映射](#73-场景-3事件处理器映射)
  - [7.4. 场景 4：数据库模型转换](#74-场景-4数据库模型转换)
  - [7.5. 场景 5：API 响应类型生成](#75-场景-5api-响应类型生成)
  - [7.6. 场景 6：响应式数据代理](#76-场景-6响应式数据代理)
- [8. 🤔 使用映射类型时需要注意什么？](#8--使用映射类型时需要注意什么)
  - [8.1. 注意事项 1：键类型的约束](#81-注意事项-1键类型的约束)
  - [8.2. 注意事项 2：映射类型不能有额外的属性](#82-注意事项-2映射类型不能有额外的属性)
  - [8.3. 注意事项 3：保持属性修饰符](#83-注意事项-3保持属性修饰符)
  - [8.4. 注意事项 4：循环引用问题](#84-注意事项-4循环引用问题)
  - [8.5. 注意事项 5：联合类型的分发](#85-注意事项-5联合类型的分发)
  - [8.6. 注意事项 6：性能考虑](#86-注意事项-6性能考虑)
  - [8.7. 注意事项 7：与 `keyof any` 的关系](#87-注意事项-7与-keyof-any-的关系)
- [9. 🔗 引用](#9--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 映射类型的定义和作用
- 基本语法结构
- 键的遍历机制
- 不同键源的使用方式
- 实际应用场景
- 使用注意事项

## 2. 🫧 评价

映射类型是 TypeScript 类型系统中最强大的特性之一，它允许基于现有类型创建新类型。

- 映射类型是实现所有工具类型（`Partial`、`Required`、`Readonly` 等）的基础
- 理解映射类型的遍历机制是掌握高级类型编程的关键
- 在实际开发中，映射类型可以大幅减少重复的类型定义
- 结合泛型和条件类型，映射类型可以实现非常复杂的类型转换
- 建议先熟悉 `keyof` 和 `in` 运算符，这是理解映射类型的前提

## 3. 🤔 什么是映射类型？

映射类型（Mapped Types）是一种通过遍历键来创建新类型的方式。它类似于 JavaScript 中的 `Array.map()` 方法，但作用于类型层面。

```ts
// JavaScript 中的 map
const numbers = [1, 2, 3]
const doubled = numbers.map((n) => n * 2) // [2, 4, 6]

// TypeScript 中的映射类型
type User = {
  name: string
  age: number
}

// 将所有属性变为可选
type PartialUser = {
  [K in keyof User]?: User[K]
}
// 结果：{ name?: string; age?: number; }
```

### 3.1. 映射类型的核心思想

映射类型允许我们：

- **遍历**：遍历类型的所有键
- **转换**：对每个键的值类型进行转换
- **生成**：生成一个全新的类型

```ts
// 遍历并转换
type Original = {
  x: number
  y: string
}

// 将所有属性类型转换为 boolean
type Transformed = {
  [K in keyof Original]: boolean
}
// 结果：{ x: boolean; y: boolean; }
```

## 4. 🤔 映射类型的基本语法是什么？

映射类型的基本语法结构如下：

```ts
type MappedType = {
  [K in Keys]: Type
}
```

各部分说明：

- `K`：类型变量，代表当前遍历到的键
- `in`：遍历操作符
- `Keys`：要遍历的键的联合类型
- `Type`：新类型中该键对应的值类型

### 4.1. 基本示例

```ts
// 1. 最简单的映射
type SimpleMap = {
  [K in 'a' | 'b' | 'c']: string
}
// 结果：{ a: string; b: string; c: string; }

// 2. 使用 keyof 获取键
type Person = {
  name: string
  age: number
  email: string
}

type PersonKeys = {
  [K in keyof Person]: K // 键映射到自身
}
// 结果：{ name: 'name'; age: 'age'; email: 'email'; }

// 3. 保持原类型
type Clone<T> = {
  [K in keyof T]: T[K]
}

type ClonedPerson = Clone<Person>
// 结果：{ name: string; age: number; email: string; }
```

### 4.2. 语法变体

```ts
// 添加可选修饰符
type Optional<T> = {
  [K in keyof T]?: T[K]
}

// 添加只读修饰符
type ReadonlyType<T> = {
  [K in keyof T]: readonly T[K]
}

// 同时使用多个修饰符
type PartialReadonly<T> = {
  readonly [K in keyof T]?: T[K]
}
```

## 5. 🤔 映射类型如何遍历键？

映射类型使用 `in` 运算符来遍历键的联合类型。

### 5.1. 遍历字面量联合

```ts
// 直接遍历字符串字面量联合
type Status = {
  [K in 'pending' | 'success' | 'error']: boolean
}
// 结果：
// {
//   pending: boolean;
//   success: boolean;
//   error: boolean;
// }

// 遍历数字字面量联合
type NumberMap = {
  [K in 1 | 2 | 3]: `num-${K}`
}
// 结果：
// {
//   1: "num-1";
//   2: "num-2";
//   3: "num-3";
// }
```

### 5.2. 遍历对象键

```ts
type Product = {
  id: number
  name: string
  price: number
  description: string
}

// 遍历所有键，映射为验证函数类型
type Validators = {
  [K in keyof Product]: (value: Product[K]) => boolean
}
// 结果：
// {
//   id: (value: number) => boolean;
//   name: (value: string) => boolean;
//   price: (value: number) => boolean;
//   description: (value: string) => boolean;
// }
```

### 5.3. 遍历时使用键

```ts
// 在映射中使用键本身
type KeyValuePairs<T> = {
  [K in keyof T]: {
    key: K
    value: T[K]
  }
}

type UserPairs = KeyValuePairs<{
  name: string
  age: number
}>
// 结果：
// {
//   name: { key: 'name'; value: string };
//   age: { key: 'age'; value: number };
// }
```

### 5.4. 条件遍历

```ts
// 只遍历特定类型的键
type StringKeys<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K]
}

type User = {
  name: string
  age: number
  email: string
  active: boolean
}

type UserStrings = StringKeys<User>
// 结果：{ name: string; email: string; }
```

## 6. 🤔 如何在映射类型中使用不同的键源？

映射类型可以从多种来源获取键。

### 6.1. 使用 keyof 获取对象键

```ts
type User = {
  id: number
  name: string
  email: string
}

// 从对象类型获取键
type UserLabels = {
  [K in keyof User]: string
}
// 结果：{ id: string; name: string; email: string; }
```

### 6.2. 使用联合类型作为键源

```ts
// 从联合类型创建对象类型
type Actions = 'create' | 'read' | 'update' | 'delete'

type Permissions = {
  [K in Actions]: boolean
}
// 结果：
// {
//   create: boolean;
//   read: boolean;
//   update: boolean;
//   delete: boolean;
// }
```

### 6.3. 使用泛型参数作为键源

```ts
// 泛型键源
type RecordType<K extends string | number | symbol, T> = {
  [P in K]: T
}

type ColorMap = RecordType<'red' | 'green' | 'blue', string>
// 结果：{ red: string; green: string; blue: string; }

// 这实际上就是内置 Record 类型的实现
type MyRecord<K extends keyof any, T> = {
  [P in K]: T
}
```

### 6.4. 使用枚举作为键源

```ts
enum Color {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE',
}

// 使用枚举键
type ColorValues = {
  [K in Color]: number
}
// 结果：
// {
//   [Color.Red]: number;
//   [Color.Green]: number;
//   [Color.Blue]: number;
// }
```

### 6.5. 组合多个键源

```ts
type BaseKeys = 'id' | 'createdAt'
type CustomKeys = 'name' | 'email'

// 组合多个键源
type CombinedType = {
  [K in BaseKeys | CustomKeys]: K extends BaseKeys ? number : string
}
// 结果：
// {
//   id: number;
//   createdAt: number;
//   name: string;
//   email: string;
// }
```

## 7. 🤔 映射类型有哪些实际应用场景？

### 7.1. 场景 1：创建配置对象类型

```ts
// API 端点配置
type Endpoints = 'users' | 'posts' | 'comments'

type ApiConfig = {
  [K in Endpoints]: {
    url: string
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  }
}

const config: ApiConfig = {
  users: { url: '/api/users', method: 'GET' },
  posts: { url: '/api/posts', method: 'GET' },
  comments: { url: '/api/comments', method: 'GET' },
}
```

### 7.2. 场景 2：表单状态管理

```ts
// 表单字段定义
type FormFields = {
  username: string
  email: string
  age: number
  agreed: boolean
}

// 字段状态
type FieldStates = {
  [K in keyof FormFields]: {
    value: FormFields[K]
    error: string | null
    touched: boolean
  }
}

// 字段验证器
type FieldValidators = {
  [K in keyof FormFields]: (value: FormFields[K]) => string | null
}

// 使用示例
const fieldStates: FieldStates = {
  username: { value: '', error: null, touched: false },
  email: { value: '', error: null, touched: false },
  age: { value: 0, error: null, touched: false },
  agreed: { value: false, error: null, touched: false },
}
```

### 7.3. 场景 3：事件处理器映射

```ts
type Events = {
  click: MouseEvent
  keypress: KeyboardEvent
  scroll: Event
}

// 为每个事件创建处理器类型
type EventHandlers = {
  [K in keyof Events]: (event: Events[K]) => void
}

const handlers: EventHandlers = {
  click: (e) => console.log('Clicked', e.clientX),
  keypress: (e) => console.log('Key pressed', e.key),
  scroll: (e) => console.log('Scrolled'),
}
```

### 7.4. 场景 4：数据库模型转换

```ts
// 数据库模型
type DbUser = {
  id: number
  name: string
  email: string
  password: string
  createdAt: Date
}

// API 响应类型（排除敏感字段）
type ApiUser = {
  [K in keyof DbUser as K extends 'password' ? never : K]: DbUser[K]
}
// 结果：Omit<DbUser, 'password'>

// 创建表单类型（排除自动生成字段）
type UserForm = {
  [K in keyof DbUser as K extends 'id' | 'createdAt' ? never : K]: DbUser[K]
}
// 结果：{ name: string; email: string; password: string; }
```

### 7.5. 场景 5：API 响应类型生成

```ts
type Resource = {
  id: string
  name: string
  data: unknown
}

// 为每个资源类型创建 CRUD 操作
type ResourceOperations<T> = {
  [K in 'create' | 'read' | 'update' | 'delete']: (data: T) => Promise<T>
}

type UserOperations = ResourceOperations<Resource>
// 结果：
// {
//   create: (data: Resource) => Promise<Resource>;
//   read: (data: Resource) => Promise<Resource>;
//   update: (data: Resource) => Promise<Resource>;
//   delete: (data: Resource) => Promise<Resource>;
// }
```

### 7.6. 场景 6：响应式数据代理

```ts
type User = {
  name: string
  age: number
  email: string
}

// 为每个属性创建 getter 和 setter
type Reactive<T> = {
  [K in keyof T]: {
    get: () => T[K]
    set: (value: T[K]) => void
  }
}

type ReactiveUser = Reactive<User>
// 结果：
// {
//   name: { get: () => string; set: (value: string) => void };
//   age: { get: () => number; set: (value: number) => void };
//   email: { get: () => string; set: (value: string) => void };
// }
```

## 8. 🤔 使用映射类型时需要注意什么？

### 8.1. 注意事项 1：键类型的约束

映射类型的键必须是 `string | number | symbol` 类型。

```ts
// ✅ 正确：有效的键类型
type Valid1 = {
  [K in string]: any
}

type Valid2 = {
  [K in 'a' | 'b' | 'c']: any
}

type Valid3<T> = {
  [K in keyof T]: T[K]
}

// ❌ 错误：无效的键类型
type Invalid = {
  [K in boolean]: any // 错误：boolean 不能作为键
}
```

### 8.2. 注意事项 2：映射类型不能有额外的属性

映射类型定义中不能添加固定的属性。

```ts
// ❌ 错误：不能混合映射和固定属性
type Invalid<T> = {
  id: string; // 错误
  [K in keyof T]: T[K];
};

// ✅ 正确：使用交叉类型
type Valid<T> = {
  id: string;
} & {
  [K in keyof T]: T[K];
};

// 或者使用两个独立的类型
type Base = { id: string };
type Extended<T> = Base & {
  [K in keyof T]: T[K];
};
```

### 8.3. 注意事项 3：保持属性修饰符

映射类型默认会保留原类型的 `readonly` 和可选（`?`）修饰符。

```ts
type Original = {
  readonly name: string
  age?: number
}

// 默认保留修饰符
type Mapped = {
  [K in keyof Original]: Original[K]
}
// 结果：{ readonly name: string; age?: number; }

// 需要显式移除修饰符
type WithoutModifiers = {
  -readonly [K in keyof Original]-?: Original[K]
}
// 结果：{ name: string; age: number; }
```

### 8.4. 注意事项 4：循环引用问题

映射类型可能导致循环引用，需要小心处理。

```ts
// ⚠️ 可能导致无限递归
type DeepPartial<T> = {
  [K in keyof T]: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

type Node = {
  value: number
  next?: Node // 自引用
}

type PartialNode = DeepPartial<Node> // TypeScript 可以处理，但要注意性能
```

### 8.5. 注意事项 5：联合类型的分发

映射类型不会自动分发联合类型。

```ts
type A = { a: string }
type B = { b: number }

// 映射类型不分发
type Mapped<T> = {
  [K in keyof T]: T[K]
}

type Result = Mapped<A | B>
// 结果：{ a: string } | { b: number }
// 而不是：{ [K in 'a' | 'b']: ... }

// 如果需要合并，使用交叉类型
type Union = A | B
type Intersection = A & B
type MappedIntersection = Mapped<Intersection>
// 结果：{ a: string; b: number; }
```

### 8.6. 注意事项 6：性能考虑

复杂的映射类型可能影响编译性能。

```ts
// ✅ 简单高效
type Simple<T> = {
  [K in keyof T]: T[K] | null
}

// ⚠️ 复杂，可能影响性能
type Complex<T> = {
  [K in keyof T]: T[K] extends infer R
    ? R extends object
      ? Complex<R>
      : R | null
    : never
}

// 建议：分解复杂类型
type Step1<T> = { [K in keyof T]: T[K] | null }
type Step2<T> = { [K in keyof T]: T[K] extends object ? Step1<T[K]> : T[K] }
```

### 8.7. 注意事项 7：与 `keyof any` 的关系

`keyof any` 等价于 `string | number | symbol`。

```ts
// 这两个定义等价
type Dict1<T> = {
  [K in string | number | symbol]: T
}

type Dict2<T> = {
  [K in keyof any]: T
}

// 实际使用
type StringDict = Dict1<string>
// 可以接受任何键
const dict: StringDict = {
  a: 'hello',
  1: 'world',
  [Symbol('key')]: 'symbol',
}
```

## 9. 🔗 引用

- [TypeScript Handbook - Mapped Types][1]
- [TypeScript 中文手册 - 映射类型][2]
- [深入理解 TypeScript - 映射类型][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
[2]: https://typescript.bootcss.com/2/mapped-types.html
[3]: https://jkchao.github.io/typescript-book-chinese/typings/mappedTypes.html
