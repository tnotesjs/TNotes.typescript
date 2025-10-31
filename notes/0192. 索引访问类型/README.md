# [0192. 索引访问类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0192.%20%E7%B4%A2%E5%BC%95%E8%AE%BF%E9%97%AE%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是索引访问类型？](#3--什么是索引访问类型)
  - [3.1. 基本语法](#31-基本语法)
  - [3.2. 与 JavaScript 的区别](#32-与-javascript-的区别)
- [4. 🤔 索引访问类型如何使用？](#4--索引访问类型如何使用)
  - [4.1. 访问对象属性类型](#41-访问对象属性类型)
  - [4.2. 访问数组元素类型](#42-访问数组元素类型)
  - [4.3. 访问元组元素类型](#43-访问元组元素类型)
- [5. 🤔 索引访问类型的高级用法](#5--索引访问类型的高级用法)
  - [5.1. 使用联合类型索引](#51-使用联合类型索引)
  - [5.2. 结合 keyof 使用](#52-结合-keyof-使用)
  - [5.3. 嵌套索引访问](#53-嵌套索引访问)
- [6. 🤔 索引访问类型的实际应用](#6--索引访问类型的实际应用)
  - [6.1. 提取特定属性类型](#61-提取特定属性类型)
  - [6.2. 构建工具类型](#62-构建工具类型)
  - [6.3. 类型安全的属性访问](#63-类型安全的属性访问)
- [7. 🤔 索引访问类型有哪些注意事项？](#7--索引访问类型有哪些注意事项)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 索引访问类型的基本概念和语法
- 索引访问类型的使用方法
- 索引访问类型的高级用法
- 索引访问类型在实际开发中的应用
- 使用注意事项和最佳实践

## 2. 🫧 评价

这篇笔记详细介绍了 TypeScript 中的索引访问类型，这是一种通过索引获取其他类型的子类型的机制。

- 索引访问类型使用 `T[K]` 语法访问类型 `T` 中键 `K` 对应的类型
- 这是类型级别的操作，类似于 JavaScript 中的属性访问
- 索引访问类型是构建复杂类型工具的基础
- 可以与 `keyof`、联合类型等其他类型特性结合使用
- 支持嵌套访问，可以深入获取复杂结构中的类型
- 理解索引访问类型是编写类型安全代码的重要技能

## 3. 🤔 什么是索引访问类型？

### 3.1. 基本语法

索引访问类型允许通过索引获取另一个类型的子类型。

```typescript
// 语法：Type[Key]
// 获取 Type 类型中 Key 对应的类型

interface Person {
  name: string
  age: number
  email: string
}

type NameType = Person['name'] // string
type AgeType = Person['age'] // number
type EmailType = Person['email'] // string
```

**工作原理：**

```typescript
// TypeScript 在编译时查找类型中的属性
interface User {
  id: number
  profile: {
    name: string
    avatar: string
  }
}

type UserId = User['id'] // number
type UserProfile = User['profile'] // { name: string; avatar: string; }
```

### 3.2. 与 JavaScript 的区别

索引访问类型是类型级别的操作，不是运行时的值访问。

```typescript
interface Product {
  id: number
  name: string
  price: number
}

// 类型级别：访问类型
type ProductName = Product['name'] // string

// 值级别：访问属性值
const product: Product = { id: 1, name: 'Book', price: 20 }
const productName = product['name'] // 'Book'
```

**对比：**

```typescript
// ❌ 错误：类型和值不能混用
const obj = { x: 10, y: 20 }
type Wrong = obj['x'] // 错误：'obj' 仅表示值,但在此处用作类型

// ✅ 正确：使用 typeof 将值转为类型
type ObjType = typeof obj
type XType = ObjType['x'] // number
```

## 4. 🤔 索引访问类型如何使用？

### 4.1. 访问对象属性类型

**基本属性访问：**

```typescript
interface User {
  id: number
  name: string
  email: string
  isActive: boolean
}

type UserId = User['id'] // number
type UserName = User['name'] // string
type UserEmail = User['email'] // string
type IsActive = User['isActive'] // boolean
```

**访问可选属性：**

```typescript
interface Config {
  host: string
  port: number
  ssl?: boolean
}

type SSLType = Config['ssl'] // boolean | undefined
```

**访问只读属性：**

```typescript
interface ReadonlyData {
  readonly id: number
  readonly created: Date
}

type IdType = ReadonlyData['id'] // number (readonly 在类型中不保留)
type CreatedType = ReadonlyData['created'] // Date
```

### 4.2. 访问数组元素类型

**普通数组：**

```typescript
type StringArray = string[]
type StringArrayElement = StringArray[number] // string

type NumberArray = number[]
type NumberArrayElement = NumberArray[number] // number
```

**混合类型数组：**

```typescript
type MixedArray = (string | number)[]
type MixedElement = MixedArray[number] // string | number
```

**对象数组：**

```typescript
type UserArray = Array<{ id: number; name: string }>
type UserElement = UserArray[number]
// type UserElement = { id: number; name: string; }
```

### 4.3. 访问元组元素类型

**按索引访问：**

```typescript
type Tuple = [string, number, boolean]

type First = Tuple[0] // string
type Second = Tuple[1] // number
type Third = Tuple[2] // boolean
```

**使用 number 访问所有元素：**

```typescript
type Tuple = [string, number, boolean]
type TupleElement = Tuple[number] // string | number | boolean
```

**具名元组：**

```typescript
type NamedTuple = [name: string, age: number, active: boolean]

type NameType = NamedTuple[0] // string
type AgeType = NamedTuple[1] // number
type AllTypes = NamedTuple[number] // string | number | boolean
```

## 5. 🤔 索引访问类型的高级用法

### 5.1. 使用联合类型索引

**访问多个属性：**

```typescript
interface User {
  id: number
  name: string
  email: string
  age: number
}

type UserStringFields = User['name' | 'email'] // string
type UserIdOrAge = User['id' | 'age'] // number
type AllFields = User['id' | 'name' | 'email' | 'age'] // string | number
```

**实际应用：**

```typescript
interface ApiResponse {
  data: {
    users: User[]
    total: number
  }
  error?: {
    code: number
    message: string
  }
}

type DataOrError = ApiResponse['data' | 'error']
// type DataOrError = { users: User[]; total: number; } | { code: number; message: string; } | undefined
```

### 5.2. 结合 keyof 使用

**获取所有属性值类型的联合：**

```typescript
interface Person {
  name: string
  age: number
  email: string
}

type PersonValue = Person[keyof Person] // string | number
```

**泛型函数中的应用：**

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const person = { name: 'Alice', age: 25 }
const name = getProperty(person, 'name') // string
const age = getProperty(person, 'age') // number
```

**复杂示例：**

```typescript
interface Data {
  id: number
  name: string
  metadata: {
    created: Date
    updated: Date
  }
}

type ValueTypes = Data[keyof Data]
// type ValueTypes = number | string | { created: Date; updated: Date; }
```

### 5.3. 嵌套索引访问

**多层访问：**

```typescript
interface Organization {
  name: string
  address: {
    street: string
    city: string
    country: {
      name: string
      code: string
    }
  }
}

type AddressType = Organization['address']
// type AddressType = { street: string; city: string; country: { name: string; code: string; }; }

type CityType = Organization['address']['city']
// type CityType = string

type CountryNameType = Organization['address']['country']['name']
// type CountryNameType = string
```

**数组嵌套访问：**

```typescript
interface Company {
  departments: Array<{
    name: string
    employees: Array<{
      id: number
      name: string
    }>
  }>
}

type DepartmentType = Company['departments'][number]
// type DepartmentType = { name: string; employees: Array<{ id: number; name: string; }>; }

type EmployeeType = Company['departments'][number]['employees'][number]
// type EmployeeType = { id: number; name: string; }
```

## 6. 🤔 索引访问类型的实际应用

### 6.1. 提取特定属性类型

**提取函数类型属性：**

```typescript
interface EventHandlers {
  onClick: (event: MouseEvent) => void
  onInput: (value: string) => void
  onSubmit: (data: FormData) => Promise<void>
}

type OnClickHandler = EventHandlers['onClick']
// type OnClickHandler = (event: MouseEvent) => void

type OnSubmitHandler = EventHandlers['onSubmit']
// type OnSubmitHandler = (data: FormData) => Promise<void>
```

**提取数据结构：**

```typescript
interface State {
  user: {
    id: number
    profile: {
      name: string
      avatar: string
    }
  }
  posts: Array<{
    id: number
    title: string
    content: string
  }>
}

type UserProfile = State['user']['profile']
// type UserProfile = { name: string; avatar: string; }

type Post = State['posts'][number]
// type Post = { id: number; title: string; content: string; }
```

### 6.2. 构建工具类型

**实现 Pick：**

```typescript
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}

interface User {
  id: number
  name: string
  email: string
  password: string
}

type PublicUser = MyPick<User, 'id' | 'name'>
// type PublicUser = { id: number; name: string; }
```

**获取特定类型的属性：**

```typescript
type PickByType<T, ValueType> = {
  [K in keyof T as T[K] extends ValueType ? K : never]: T[K]
}

interface Mixed {
  id: number
  name: string
  count: number
  active: boolean
  description: string
}

type StringProps = PickByType<Mixed, string>
// type StringProps = { name: string; description: string; }

type NumberProps = PickByType<Mixed, number>
// type NumberProps = { id: number; count: number; }
```

### 6.3. 类型安全的属性访问

**深度路径访问：**

```typescript
type PathValue<T, Path extends string> = Path extends keyof T
  ? T[Path]
  : Path extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : never
  : never

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

type HostType = PathValue<Config, 'server.host'> // string
type PortType = PathValue<Config, 'server.port'> // number
type SSLEnabled = PathValue<Config, 'server.ssl.enabled'> // boolean
```

**类型安全的 getter：**

```typescript
function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

function getDeep<T, K1 extends keyof T, K2 extends keyof T[K1]>(
  obj: T,
  key1: K1,
  key2: K2
): T[K1][K2] {
  return obj[key1][key2]
}

interface Data {
  user: {
    name: string
    age: number
  }
}

const data: Data = { user: { name: 'Alice', age: 25 } }
const user = get(data, 'user') // { name: string; age: number; }
const name = getDeep(data, 'user', 'name') // string
```

## 7. 🤔 索引访问类型有哪些注意事项？

**1. 索引必须是类型**

```typescript
interface User {
  name: string
  age: number
}

// ❌ 错误：使用值作为索引
const key = 'name'
type Wrong = User[key] // 错误

// ✅ 正确：使用类型作为索引
type KeyType = 'name'
type Correct = User[KeyType] // string

// ✅ 正确：使用 typeof 将值转为类型
type AlsoCorrect = User[typeof key] // string
```

**2. 索引超出范围**

```typescript
interface User {
  name: string
  age: number
}

// ❌ 错误：访问不存在的属性
type Wrong = User['email'] // 错误：类型 "User" 上不存在属性 "email"

// ✅ 正确：使用联合类型处理可能不存在的属性
type Safe = User extends { email: infer E } ? E : never // never
```

**3. 数组索引的特殊性**

```typescript
// 使用 number 访问数组元素类型
type Arr = string[]
type Element = Arr[number] // string

// ❌ 错误：不能使用具体数字索引
type Wrong = Arr[0] // 错误

// 元组可以使用具体数字
type Tuple = [string, number]
type First = Tuple[0] // ✅ string
```

**4. 联合类型的分发**

```typescript
interface A {
  x: string
  y: number
}

interface B {
  x: number
  z: boolean
}

type Union = A | B
type XType = Union['x'] // string | number (分发到两个类型)
```

**5. 可选属性的处理**

```typescript
interface User {
  name: string
  email?: string
}

type EmailType = User['email'] // string | undefined

// 如果需要去除 undefined
type RequiredEmail = NonNullable<User['email']> // string
```

**6. 循环引用问题**

```typescript
// ❌ 可能导致类型实例化过深
interface Tree {
  value: number
  children: Tree[]
}

type ChildValue = Tree['children'][number]['value'] // ✅ 可以工作

// 但是深度嵌套可能出问题
type DeepNested =
  Tree['children'][number]['children'][number]['children'][number]
// 如果递归太深会报错
```

**7. 与映射类型结合**

```typescript
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
}

interface State {
  count: number
  name: string
}

type StateGetters = Getters<State>
// type StateGetters = {
//   getCount: () => number;
//   getName: () => string;
// }
```

## 8. 🔗 引用

- [TypeScript Handbook - Indexed Access Types][1]
- [TypeScript Handbook - keyof Type Operator][2]
- [TypeScript Deep Dive - Index Signatures][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html
[2]: https://www.typescriptlang.org/docs/handbook/2/keyof-types.html
[3]: https://basarat.gitbook.io/typescript/type-system/index-signatures
