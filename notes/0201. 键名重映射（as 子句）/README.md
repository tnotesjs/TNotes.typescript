# [0201. 键名重映射（as 子句）](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0201.%20%E9%94%AE%E5%90%8D%E9%87%8D%E6%98%A0%E5%B0%84%EF%BC%88as%20%E5%AD%90%E5%8F%A5%EF%BC%89)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是键名重映射？](#3--什么是键名重映射)
  - [3.1. 传统映射类型的局限](#31-传统映射类型的局限)
  - [3.2. 键名重映射的作用](#32-键名重映射的作用)
- [4. 🤔 as 子句的基本语法是什么？](#4--as-子句的基本语法是什么)
  - [4.1. 语法结构](#41-语法结构)
  - [4.2. 基本示例](#42-基本示例)
  - [4.3. 使用字符串操作](#43-使用字符串操作)
- [5. 🤔 如何使用 as 子句转换键名？](#5--如何使用-as-子句转换键名)
  - [5.1. 添加前缀和后缀](#51-添加前缀和后缀)
  - [5.2. 替换和转换](#52-替换和转换)
  - [5.3. 条件键名转换](#53-条件键名转换)
  - [5.4. 动态生成键名](#54-动态生成键名)
- [6. 🤔 如何使用 as never 过滤键？](#6--如何使用-as-never-过滤键)
  - [6.1. 基本过滤](#61-基本过滤)
  - [6.2. 按类型过滤](#62-按类型过滤)
  - [6.3. 按命名模式过滤](#63-按命名模式过滤)
  - [6.4. 组合过滤条件](#64-组合过滤条件)
- [7. 🤔 键名重映射有哪些实际应用？](#7--键名重映射有哪些实际应用)
  - [7.1. 场景 1：API 数据适配](#71-场景-1api-数据适配)
  - [7.2. 场景 2：生成事件处理器类型](#72-场景-2生成事件处理器类型)
  - [7.3. 场景 3：创建响应式对象](#73-场景-3创建响应式对象)
  - [7.4. 场景 4：数据库模型生成](#74-场景-4数据库模型生成)
  - [7.5. 场景 5：权限控制](#75-场景-5权限控制)
  - [7.6. 场景 6：类型安全的配置](#76-场景-6类型安全的配置)
- [8. 🤔 使用键名重映射需要注意什么？](#8--使用键名重映射需要注意什么)
  - [8.1. 注意事项 1：键名必须是有效的标识符](#81-注意事项-1键名必须是有效的标识符)
  - [8.2. 注意事项 2：as never 会完全移除键](#82-注意事项-2as-never-会完全移除键)
  - [8.3. 注意事项 3：键名冲突](#83-注意事项-3键名冲突)
  - [8.4. 注意事项 4：类型推断的限制](#84-注意事项-4类型推断的限制)
  - [8.5. 注意事项 5：性能考虑](#85-注意事项-5性能考虑)
  - [8.6. 注意事项 6：与其他类型操作的组合](#86-注意事项-6与其他类型操作的组合)
  - [8.7. 注意事项 7：字符串字面量类型的限制](#87-注意事项-7字符串字面量类型的限制)
- [9. 🔗 引用](#9--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 键名重映射的概念
- `as` 子句的语法结构
- 键名转换的方法
- 使用 `as never` 过滤键
- 实际应用场景
- 使用注意事项

## 2. 🫧 评价

键名重映射（Key Remapping）是 TypeScript 4.1 引入的强大特性，通过 `as` 子句可以在映射类型中动态地转换或过滤键名。

- `as` 子句极大地增强了映射类型的灵活性和表达能力
- 结合模板字面量类型，可以实现复杂的键名转换
- 使用 `as never` 可以优雅地过滤掉不需要的键
- 理解键名重映射是掌握高级类型编程的关键
- 实际开发中，键名重映射常用于 API 适配、数据转换等场景

## 3. 🤔 什么是键名重映射？

键名重映射允许在映射类型中改变键的名称，而不仅仅是改变键对应的值类型。

### 3.1. 传统映射类型的局限

在 TypeScript 4.1 之前，映射类型只能保持键名不变：

```ts
type Person = {
  name: string
  age: number
  email: string
}

// 传统方式：只能改变值类型，不能改变键名
type ReadonlyPerson = {
  readonly [K in keyof Person]: Person[K]
}
// 结果：{ readonly name: string; readonly age: number; readonly email: string; }

// 如果想改变键名，需要复杂的类型操作
type Getters = {
  [K in keyof Person as `get${Capitalize<K>}`]: () => Person[K]
}
// TypeScript 4.1+ 支持这种语法
```

### 3.2. 键名重映射的作用

通过 `as` 子句，可以：

1. **转换键名**：如添加前缀、后缀、改变大小写等
2. **过滤键**：使用 `as never` 排除某些键
3. **条件映射**：根据条件决定键的最终名称

```ts
type User = {
  id: number
  name: string
  email: string
}

// 转换键名：添加 'get' 前缀并首字母大写
type Getters = {
  [K in keyof User as `get${Capitalize<K>}`]: () => User[K]
}
// 结果：
// {
//   getId: () => number;
//   getName: () => string;
//   getEmail: () => string;
// }
```

## 4. 🤔 as 子句的基本语法是什么？

`as` 子句位于映射类型的键名位置，用于指定新的键名。

### 4.1. 语法结构

```ts
type MappedType = {
  [K in Keys as NewKey]: ValueType
}
```

各部分说明：

- `K`：原始键名的类型变量
- `in Keys`：要遍历的键的联合类型
- `as NewKey`：新的键名表达式
- `ValueType`：新类型中该键对应的值类型

### 4.2. 基本示例

```ts
type Original = {
  firstName: string
  lastName: string
  age: number
}

// 将所有键名转换为大写
type UppercaseKeys = {
  [K in keyof Original as Uppercase<K>]: Original[K]
}
// 结果：
// {
//   FIRSTNAME: string;
//   LASTNAME: string;
//   AGE: number;
// }

// 添加前缀
type PrefixedKeys = {
  [K in keyof Original as `user_${K}`]: Original[K]
}
// 结果：
// {
//   user_firstName: string;
//   user_lastName: string;
//   user_age: number;
// }
```

### 4.3. 使用字符串操作

```ts
type Person = {
  name: string
  age: number
  email: string
}

// 首字母大写
type CapitalizedKeys = {
  [K in keyof Person as Capitalize<K>]: Person[K]
}
// 结果：{ Name: string; Age: number; Email: string; }

// 首字母小写
type LowercaseFirstKeys = {
  [K in keyof Person as Uncapitalize<K>]: Person[K]
}
// 如果原本就是小写，则保持不变

// 全部大写
type UpperKeys = {
  [K in keyof Person as Uppercase<K>]: Person[K]
}
// 结果：{ NAME: string; AGE: number; EMAIL: string; }

// 全部小写
type LowerKeys = {
  [K in keyof Person as Lowercase<K>]: Person[K]
}
// 结果：{ name: string; age: number; email: string; }
```

## 5. 🤔 如何使用 as 子句转换键名？

`as` 子句可以结合各种字符串操作和模板字面量类型来转换键名。

### 5.1. 添加前缀和后缀

```ts
type User = {
  id: number
  name: string
  email: string
}

// 添加 'get' 前缀
type Getters = {
  [K in keyof User as `get${Capitalize<K>}`]: () => User[K]
}
// 结果：
// {
//   getId: () => number;
//   getName: () => string;
//   getEmail: () => string;
// }

// 添加 'set' 前缀
type Setters = {
  [K in keyof User as `set${Capitalize<K>}`]: (value: User[K]) => void
}
// 结果：
// {
//   setId: (value: number) => void;
//   setName: (value: string) => void;
//   setEmail: (value: string) => void;
// }

// 组合 getters 和 setters
type Accessors<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K]
} & {
  [K in keyof T as `set${Capitalize<K & string>}`]: (value: T[K]) => void
}

type UserAccessors = Accessors<User>
// 结果：
// {
//   getId: () => number;
//   getName: () => string;
//   getEmail: () => string;
//   setId: (value: number) => void;
//   setName: (value: string) => void;
//   setEmail: (value: string) => void;
// }
```

### 5.2. 替换和转换

```ts
type ApiResponse = {
  user_id: number
  user_name: string
  user_email: string
}

// 移除 'user_' 前缀
type CleanKeys<T> = {
  [K in keyof T as K extends `user_${infer Rest}` ? Rest : K]: T[K]
}

type CleanResponse = CleanKeys<ApiResponse>
// 结果：{ id: number; name: string; email: string; }

// 将下划线命名转换为驼峰命名
type ToCamelCase<S extends string> = S extends `${infer First}_${infer Rest}`
  ? `${First}${Capitalize<ToCamelCase<Rest>>}`
  : S

type CamelCaseKeys<T> = {
  [K in keyof T as ToCamelCase<K & string>]: T[K]
}

type SnakeCase = {
  first_name: string
  last_name: string
  email_address: string
}

type CamelCase = CamelCaseKeys<SnakeCase>
// 结果：{ firstName: string; lastName: string; emailAddress: string; }
```

### 5.3. 条件键名转换

```ts
type Data = {
  id: number
  name: string
  age: number
  email: string
  active: boolean
}

// 只为 string 类型的属性添加验证器后缀
type Validators<T> = {
  [K in keyof T as T[K] extends string
    ? `${K & string}Validator`
    : K]: T[K] extends string ? (value: string) => boolean : T[K]
}

type DataValidators = Validators<Data>
// 结果：
// {
//   id: number;
//   nameValidator: (value: string) => boolean;
//   age: number;
//   emailValidator: (value: string) => boolean;
//   active: boolean;
// }
```

### 5.4. 动态生成键名

```ts
// 为每个属性生成多个相关键
type EventHandlers<T> = {
  [K in keyof T as `on${Capitalize<K & string>}Change`]: (value: T[K]) => void
} & {
  [K in keyof T as `on${Capitalize<K & string>}Reset`]: () => void
}

type FormFields = {
  username: string
  password: string
}

type FormHandlers = EventHandlers<FormFields>
// 结果：
// {
//   onUsernameChange: (value: string) => void;
//   onUsernameReset: () => void;
//   onPasswordChange: (value: string) => void;
//   onPasswordReset: () => void;
// }
```

## 6. 🤔 如何使用 as never 过滤键？

使用 `as never` 可以在映射类型中排除特定的键。

### 6.1. 基本过滤

```ts
type User = {
  id: number
  name: string
  password: string
  email: string
}

// 排除 password 字段
type PublicUser = {
  [K in keyof User as K extends 'password' ? never : K]: User[K]
}
// 结果：{ id: number; name: string; email: string; }

// 这实际上等同于 Omit<User, 'password'>
```

### 6.2. 按类型过滤

```ts
type Data = {
  id: number
  name: string
  age: number
  email: string
  active: boolean
}

// 只保留 string 类型的属性
type StringProps<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K]
}

type StringData = StringProps<Data>
// 结果：{ name: string; email: string; }

// 只保留 number 类型的属性
type NumberProps<T> = {
  [K in keyof T as T[K] extends number ? K : never]: T[K]
}

type NumberData = NumberProps<Data>
// 结果：{ id: number; age: number; }

// 排除所有函数属性
type NonFunctionProps<T> = {
  [K in keyof T as T[K] extends Function ? never : K]: T[K]
}
```

### 6.3. 按命名模式过滤

```ts
type ApiData = {
  id: number
  _internal: string
  _cache: unknown
  name: string
  _timestamp: Date
  email: string
}

// 排除以下划线开头的私有属性
type PublicProps<T> = {
  [K in keyof T as K extends `_${string}` ? never : K]: T[K]
}

type PublicData = PublicProps<ApiData>
// 结果：{ id: number; name: string; email: string; }

// 只保留以下划线开头的私有属性
type PrivateProps<T> = {
  [K in keyof T as K extends `_${string}` ? K : never]: T[K]
}

type PrivateData = PrivateProps<ApiData>
// 结果：{ _internal: string; _cache: unknown; _timestamp: Date; }
```

### 6.4. 组合过滤条件

```ts
type Model = {
  id: number
  _version: number
  name: string
  _metadata: object
  email: string
  _createdAt: Date
  age: number
}

// 排除私有属性和特定字段
type FilteredModel<T> = {
  [K in keyof T as K extends `_${string}`
    ? never
    : K extends 'id'
    ? never
    : K]: T[K]
}

type CleanModel = FilteredModel<Model>
// 结果：{ name: string; email: string; age: number; }

// 使用多个条件
type ComplexFilter<T> = {
  [K in keyof T as K extends `_${string}`
    ? never
    : T[K] extends Function
    ? never
    : T[K] extends object
    ? never
    : K]: T[K]
}
```

## 7. 🤔 键名重映射有哪些实际应用？

### 7.1. 场景 1：API 数据适配

```ts
// 后端 API 返回的数据格式（snake_case）
type ApiUser = {
  user_id: number
  first_name: string
  last_name: string
  email_address: string
  created_at: string
}

// 将 snake_case 转换为 camelCase
type ToCamelCase<S extends string> = S extends `${infer First}_${infer Rest}`
  ? `${First}${Capitalize<ToCamelCase<Rest>>}`
  : S

type CamelCaseKeys<T> = {
  [K in keyof T as ToCamelCase<K & string>]: T[K]
}

type User = CamelCaseKeys<ApiUser>
// 结果：
// {
//   userId: number;
//   firstName: string;
//   lastName: string;
//   emailAddress: string;
//   createdAt: string;
// }

// 转换函数
function adaptApiUser(apiUser: ApiUser): User {
  return {
    userId: apiUser.user_id,
    firstName: apiUser.first_name,
    lastName: apiUser.last_name,
    emailAddress: apiUser.email_address,
    createdAt: apiUser.created_at,
  }
}
```

### 7.2. 场景 2：生成事件处理器类型

```ts
// 表单字段
type FormFields = {
  username: string
  email: string
  password: string
  age: number
}

// 为每个字段生成 onChange 处理器
type FieldHandlers<T> = {
  [K in keyof T as `on${Capitalize<K & string>}Change`]: (value: T[K]) => void
}

type FormHandlers = FieldHandlers<FormFields>
// 结果：
// {
//   onUsernameChange: (value: string) => void;
//   onEmailChange: (value: string) => void;
//   onPasswordChange: (value: string) => void;
//   onAgeChange: (value: number) => void;
// }

// 使用示例
const handlers: FormHandlers = {
  onUsernameChange: (value) => console.log('Username:', value),
  onEmailChange: (value) => console.log('Email:', value),
  onPasswordChange: (value) => console.log('Password:', value),
  onAgeChange: (value) => console.log('Age:', value),
}
```

### 7.3. 场景 3：创建响应式对象

```ts
// 原始数据类型
type State = {
  count: number
  name: string
  items: string[]
}

// 为每个属性生成 getter 和 setter
type Reactive<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K]
} & {
  [K in keyof T as `set${Capitalize<K & string>}`]: (value: T[K]) => void
} & {
  [K in keyof T]: T[K]
}

type ReactiveState = Reactive<State>
// 结果：
// {
//   count: number;
//   name: string;
//   items: string[];
//   getCount: () => number;
//   getName: () => string;
//   getItems: () => string[];
//   setCount: (value: number) => void;
//   setName: (value: string) => void;
//   setItems: (value: string[]) => void;
// }
```

### 7.4. 场景 4：数据库模型生成

```ts
type User = {
  id: number
  name: string
  email: string
  password: string
}

// 生成列名类型（添加表前缀）
type ColumnNames<T, Prefix extends string> = {
  [K in keyof T as `${Prefix}_${K & string}`]: T[K]
}

type UserColumns = ColumnNames<User, 'users'>
// 结果：
// {
//   users_id: number;
//   users_name: string;
//   users_email: string;
//   users_password: string;
// }

// 生成查询方法
type QueryMethods<T> = {
  [K in keyof T as `findBy${Capitalize<K & string>}`]: (
    value: T[K]
  ) => Promise<T>
}

type UserQueries = QueryMethods<User>
// 结果：
// {
//   findById: (value: number) => Promise<User>;
//   findByName: (value: string) => Promise<User>;
//   findByEmail: (value: string) => Promise<User>;
//   findByPassword: (value: string) => Promise<User>;
// }
```

### 7.5. 场景 5：权限控制

```ts
type Resources = {
  users: unknown
  posts: unknown
  comments: unknown
  settings: unknown
}

// 为每个资源生成权限类型
type Permissions<T> = {
  [K in keyof T as `can${Capitalize<K & string>}Read`]: boolean
} & {
  [K in keyof T as `can${Capitalize<K & string>}Write`]: boolean
} & {
  [K in keyof T as `can${Capitalize<K & string>}Delete`]: boolean
}

type UserPermissions = Permissions<Resources>
// 结果：
// {
//   canUsersRead: boolean;
//   canUsersWrite: boolean;
//   canUsersDelete: boolean;
//   canPostsRead: boolean;
//   canPostsWrite: boolean;
//   canPostsDelete: boolean;
//   canCommentsRead: boolean;
//   canCommentsWrite: boolean;
//   canCommentsDelete: boolean;
//   canSettingsRead: boolean;
//   canSettingsWrite: boolean;
//   canSettingsDelete: boolean;
// }

// 使用示例
const permissions: UserPermissions = {
  canUsersRead: true,
  canUsersWrite: true,
  canUsersDelete: false,
  canPostsRead: true,
  canPostsWrite: true,
  canPostsDelete: true,
  canCommentsRead: true,
  canCommentsWrite: false,
  canCommentsDelete: false,
  canSettingsRead: true,
  canSettingsWrite: false,
  canSettingsDelete: false,
}
```

### 7.6. 场景 6：类型安全的配置

```ts
type Env = {
  database_url: string
  api_key: string
  port: number
  debug_mode: boolean
}

// 生成环境变量访问器（添加 'get' 前缀并转换为驼峰命名）
type EnvGetters<T> = {
  [K in keyof T as `get${Capitalize<ToCamelCase<K & string>>}`]: () => T[K]
}

type ToCamelCase<S extends string> = S extends `${infer First}_${infer Rest}`
  ? `${First}${Capitalize<ToCamelCase<Rest>>}`
  : S

type EnvAccessors = EnvGetters<Env>
// 结果：
// {
//   getDatabaseUrl: () => string;
//   getApiKey: () => string;
//   getPort: () => number;
//   getDebugMode: () => boolean;
// }
```

## 8. 🤔 使用键名重映射需要注意什么？

### 8.1. 注意事项 1：键名必须是有效的标识符

重映射后的键名必须是有效的 TypeScript 标识符。

```ts
type Invalid = {
  name: string
}

// ❌ 错误：生成的键名包含空格
type BadKeys = {
  [K in keyof Invalid as `my ${K}`]: Invalid[K]
}

// ✅ 正确：使用下划线或驼峰命名
type GoodKeys = {
  [K in keyof Invalid as `my_${K}`]: Invalid[K]
}
```

### 8.2. 注意事项 2：as never 会完全移除键

使用 `as never` 后，该键会从结果类型中完全消失。

```ts
type User = {
  id: number
  name: string
  password: string
}

type Filtered = {
  [K in keyof User as K extends 'password' ? never : K]: User[K]
}
// password 键完全不存在于 Filtered 类型中

const user: Filtered = {
  id: 1,
  name: 'Alice',
  // password 不能出现
}
```

### 8.3. 注意事项 3：键名冲突

重映射可能导致多个原始键映射到同一个新键名，造成冲突。

```ts
type Data = {
  firstName: string
  first_name: string
}

// ⚠️ 可能产生冲突
type Unified = {
  [K in keyof Data as Lowercase<K & string>]: Data[K]
}
// 两个键都会映射到 'firstname'，后者会覆盖前者
```

### 8.4. 注意事项 4：类型推断的限制

在复杂的重映射中，TypeScript 的类型推断可能无法完美工作。

```ts
type Original = {
  aaa: string
  bbb: number
}

// 复杂的模板字面量可能难以推断
type Complex<T> = {
  [K in keyof T as `${K & string}_${K & string}`]: T[K]
}

type Result = Complex<Original>
// 可能需要显式类型断言才能正确使用
```

### 8.5. 注意事项 5：性能考虑

复杂的键名重映射可能影响编译性能，特别是在大型类型上。

```ts
// ⚠️ 性能影响较大
type LargeType = {
  // ... 数百个属性
}

type ComplexTransform<T> = {
  [K in keyof T as K extends `${infer Prefix}_${infer Suffix}`
    ? `${Capitalize<Prefix>}${Capitalize<Suffix>}`
    : K]: T[K]
}

// 建议：简化类型转换逻辑或分步处理
```

### 8.6. 注意事项 6：与其他类型操作的组合

键名重映射需要正确地与其他类型操作（如修饰符）组合使用。

```ts
type User = {
  id: number
  name: string
  readonly createdAt: Date
}

// ✅ 正确：先重映射，再应用修饰符
type Getters = {
  readonly [K in keyof User as `get${Capitalize<K & string>}`]: () => User[K]
}

// 注意修饰符的位置
type Setters = {
  [K in keyof User as `set${Capitalize<K & string>}`]+?: (
    value: User[K]
  ) => void
}
```

### 8.7. 注意事项 7：字符串字面量类型的限制

键名重映射依赖于字符串字面量类型，有一定的限制。

```ts
// ❌ 不支持运行时字符串操作
type Invalid<T, Prefix extends string> = {
  [K in keyof T as `${Prefix}${K}`]: T[K]
  // Prefix 必须是字面量类型，不能是 string
}

// ✅ 正确：使用字面量类型
type Valid<T> = {
  [K in keyof T as `prefix_${K & string}`]: T[K]
}
```

## 9. 🔗 引用

- [TypeScript 4.1 Release Notes - Key Remapping][1]
- [TypeScript Handbook - Mapped Types with Key Remapping][2]
- [TypeScript Deep Dive - Advanced Mapped Types][3]

[1]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#key-remapping-in-mapped-types
[2]: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as
[3]: https://basarat.gitbook.io/typescript/type-system/mapped-types
