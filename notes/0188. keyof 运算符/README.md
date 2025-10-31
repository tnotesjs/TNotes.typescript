# [0188. keyof 运算符](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0188.%20keyof%20%E8%BF%90%E7%AE%97%E7%AC%A6)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是 keyof 运算符？](#3--什么是-keyof-运算符)
  - [3.1. 基本语法](#31-基本语法)
  - [3.2. 返回的类型](#32-返回的类型)
- [4. 🤔 keyof 如何处理不同类型？](#4--keyof-如何处理不同类型)
  - [4.1. 对象类型](#41-对象类型)
  - [4.2. 数组类型](#42-数组类型)
  - [4.3. 元组类型](#43-元组类型)
  - [4.4. 类类型](#44-类类型)
- [5. 🤔 keyof 在实际开发中有哪些应用场景？](#5--keyof-在实际开发中有哪些应用场景)
  - [5.1. 属性访问约束](#51-属性访问约束)
  - [5.2. 泛型约束](#52-泛型约束)
  - [5.3. 映射类型](#53-映射类型)
  - [5.4. 工具类型实现](#54-工具类型实现)
- [6. 🤔 keyof 与索引签名如何配合？](#6--keyof-与索引签名如何配合)
- [7. 🤔 keyof 有哪些注意事项？](#7--keyof-有哪些注意事项)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- `keyof` 运算符的基本概念和语法
- `keyof` 对不同类型的处理
- `keyof` 在属性访问约束中的应用
- `keyof` 与泛型、映射类型的结合
- `keyof` 与索引签名的关系
- 实际开发中的最佳实践

## 2. 🫧 评价

这篇笔记详细介绍了 TypeScript 中 `keyof` 运算符的使用方法和应用场景。`keyof` 是 TypeScript 类型系统中最强大的工具之一。

- `keyof` 能够获取对象类型的所有键组成的联合类型
- 配合泛型使用可以实现类型安全的属性访问
- 是实现高级类型工具的基础
- 在实际开发中广泛用于约束函数参数、实现类型安全的对象操作
- 理解 `keyof` 是掌握 TypeScript 高级类型的关键
- 配合其他类型运算符使用能够创建强大的类型工具

## 3. 🤔 什么是 keyof 运算符？

### 3.1. 基本语法

`keyof` 是 TypeScript 的类型运算符，用于获取对象类型的所有键（key）组成的联合类型。

**基本用法：**

```typescript
// 定义一个对象类型
interface Person {
  name: string
  age: number
  email: string
}

// 使用 keyof 获取所有键
type PersonKeys = keyof Person
// 等同于: type PersonKeys = "name" | "age" | "email"

// 使用示例
const key1: PersonKeys = 'name' // ✅ 正确
const key2: PersonKeys = 'age' // ✅ 正确
const key3: PersonKeys = 'email' // ✅ 正确
const key4: PersonKeys = 'address' // ❌ 错误：不存在的键
```

### 3.2. 返回的类型

`keyof` 返回的是字符串字面量类型或数字字面量类型的联合类型。

**字符串键：**

```typescript
interface User {
  id: number
  name: string
}

type UserKeys = keyof User
// type UserKeys = "id" | "name"
```

**数字键：**

```typescript
interface NumericKeys {
  [key: number]: string
}

type Keys = keyof NumericKeys
// type Keys = number
```

**混合键：**

```typescript
interface MixedKeys {
  name: string
  [key: number]: string
}

type Keys = keyof MixedKeys
// type Keys = "name" | number
```

## 4. 🤔 keyof 如何处理不同类型？

### 4.1. 对象类型

**接口类型：**

```typescript
interface Book {
  title: string
  author: string
  year: number
  isbn?: string // 可选属性也会被包含
}

type BookKeys = keyof Book
// type BookKeys = "title" | "author" | "year" | "isbn"

// 使用示例
function getBookProperty(book: Book, key: BookKeys) {
  return book[key]
}

const myBook: Book = {
  title: 'TypeScript入门',
  author: '张三',
  year: 2023,
}

getBookProperty(myBook, 'title') // ✅ 正确
getBookProperty(myBook, 'price') // ❌ 错误
```

**类型别名：**

```typescript
type Product = {
  id: number
  name: string
  price: number
}

type ProductKeys = keyof Product
// type ProductKeys = "id" | "name" | "price"
```

### 4.2. 数组类型

对数组使用 `keyof` 会得到数组所有方法和属性的键。

```typescript
type ArrayKeys = keyof any[]
// 包含所有数组方法和属性：
// "length" | "toString" | "push" | "pop" | "concat" | "join" | ...

type Arr = string[]
type ArrKeys = keyof Arr
// type ArrKeys = number | "length" | "toString" | "push" | ...

// 实际使用
const arr: string[] = ['a', 'b', 'c']
const key: ArrKeys = 'length' // ✅
const key2: ArrKeys = 'push' // ✅
const key3: ArrKeys = 0 // ✅ 数字索引
```

### 4.3. 元组类型

元组的 `keyof` 包含索引和数组方法。

```typescript
type Tuple = [string, number, boolean]

type TupleKeys = keyof Tuple
// type TupleKeys = "0" | "1" | "2" | "length" | "toString" | "push" | ...

// 使用示例
function getTupleValue<T extends any[]>(
  tuple: T,
  index: keyof T
): T[typeof index] {
  return tuple[index]
}

const myTuple: [string, number] = ['hello', 42]
getTupleValue(myTuple, '0') // ✅ 'hello'
getTupleValue(myTuple, '1') // ✅ 42
getTupleValue(myTuple, 0) // ✅ 也可以用数字
```

### 4.4. 类类型

对类使用 `keyof` 只会获取公开属性和方法。

```typescript
class Person {
  public name: string
  private age: number
  protected email: string

  constructor(name: string, age: number, email: string) {
    this.name = name
    this.age = age
    this.email = email
  }

  public greet(): void {
    console.log(`Hello, I'm ${this.name}`)
  }

  private getAge(): number {
    return this.age
  }
}

type PersonKeys = keyof Person
// type PersonKeys = "name" | "greet"
// ⚠️ 只包含 public 成员，不包含 private 和 protected
```

## 5. 🤔 keyof 在实际开发中有哪些应用场景？

### 5.1. 属性访问约束

**类型安全的属性获取：**

```typescript
interface User {
  id: number
  name: string
  email: string
  age: number
}

// ❌ 不安全的写法
function getProperty(obj: User, key: string) {
  return obj[key] // any 类型
}

// ✅ 使用 keyof 约束
function getPropertySafe<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user: User = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  age: 25,
}

const name = getPropertySafe(user, 'name') // string
const age = getPropertySafe(user, 'age') // number
const invalid = getPropertySafe(user, 'xxx') // ❌ 编译错误
```

**类型安全的属性设置：**

```typescript
function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): void {
  obj[key] = value
}

const user: User = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  age: 25,
}

setProperty(user, 'name', 'Bob') // ✅ 正确
setProperty(user, 'age', 30) // ✅ 正确
setProperty(user, 'age', '30') // ❌ 错误：类型不匹配
setProperty(user, 'invalid', 'test') // ❌ 错误：属性不存在
```

### 5.2. 泛型约束

**约束泛型参数必须是对象的键：**

```typescript
interface Product {
  id: number
  name: string
  price: number
  stock: number
}

// 排序函数
function sortBy<T, K extends keyof T>(arr: T[], key: K): T[] {
  return arr.sort((a, b) => {
    if (a[key] < b[key]) return -1
    if (a[key] > b[key]) return 1
    return 0
  })
}

const products: Product[] = [
  { id: 1, name: 'Apple', price: 5, stock: 100 },
  { id: 2, name: 'Banana', price: 3, stock: 50 },
  { id: 3, name: 'Orange', price: 4, stock: 75 },
]

sortBy(products, 'price') // ✅ 按价格排序
sortBy(products, 'name') // ✅ 按名称排序
sortBy(products, 'invalid') // ❌ 错误
```

### 5.3. 映射类型

**结合映射类型创建新类型：**

```typescript
interface Person {
  name: string
  age: number
  email: string
}

// 将所有属性变为可选
type Partial<T> = {
  [K in keyof T]?: T[K]
}

type PartialPerson = Partial<Person>
// type PartialPerson = {
//   name?: string;
//   age?: number;
//   email?: string;
// }

// 将所有属性变为只读
type Readonly<T> = {
  readonly [K in keyof T]: T[K]
}

type ReadonlyPerson = Readonly<Person>
// type ReadonlyPerson = {
//   readonly name: string;
//   readonly age: number;
//   readonly email: string;
// }
```

### 5.4. 工具类型实现

**Pick 实现：**

```typescript
// Pick 从类型中选择指定的属性
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}

interface User {
  id: number
  name: string
  email: string
  age: number
}

type UserBasic = MyPick<User, 'id' | 'name'>
// type UserBasic = {
//   id: number;
//   name: string;
// }
```

**Omit 实现：**

```typescript
// Omit 从类型中排除指定的属性
type MyOmit<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P]
}

type UserWithoutEmail = MyOmit<User, 'email'>
// type UserWithoutEmail = {
//   id: number;
//   name: string;
//   age: number;
// }
```

**Record 实现：**

```typescript
// Record 创建具有指定键和值类型的对象类型
type MyRecord<K extends keyof any, T> = {
  [P in K]: T
}

type Roles = 'admin' | 'user' | 'guest'
type Permissions = MyRecord<Roles, boolean>
// type Permissions = {
//   admin: boolean;
//   user: boolean;
//   guest: boolean;
// }
```

## 6. 🤔 keyof 与索引签名如何配合？

**字符串索引签名：**

```typescript
interface StringMap {
  [key: string]: any
}

type Keys = keyof StringMap
// type Keys = string | number
// ⚠️ 包含 number 是因为 JavaScript 会将数字键转为字符串
```

**数字索引签名：**

```typescript
interface NumberMap {
  [key: number]: string
}

type Keys = keyof NumberMap
// type Keys = number
```

**混合使用：**

```typescript
interface MixedMap {
  name: string // 明确的属性
  [key: string]: any // 字符串索引签名
}

type Keys = keyof MixedMap
// type Keys = string | number
// ⚠️ 索引签名会覆盖明确的属性键

// 实际应用
function getValue<T extends { [key: string]: any }>(
  obj: T,
  key: keyof T
): T[typeof key] {
  return obj[key]
}
```

**限制索引签名：**

```typescript
// 只允许已知的键
interface StrictObject {
  id: number
  name: string
  // 不添加索引签名
}

type StrictKeys = keyof StrictObject
// type StrictKeys = "id" | "name"

// 允许任意字符串键
interface FlexibleObject {
  id: number
  [key: string]: any
}

type FlexibleKeys = keyof FlexibleObject
// type FlexibleKeys = string | number
```

## 7. 🤔 keyof 有哪些注意事项？

**1. keyof 与联合类型**

```typescript
interface A {
  a: string
  common: string
}

interface B {
  b: number
  common: string
}

type UnionKeys = keyof (A | B)
// type UnionKeys = "common"
// ⚠️ 只保留共同的键

type IntersectionKeys = keyof (A & B)
// type IntersectionKeys = "a" | "b" | "common"
// ✅ 包含所有键
```

**2. keyof 不能用于值**

```typescript
const obj = {
  name: 'Alice',
  age: 25,
}

// ❌ 错误：keyof 只能用于类型
type Keys = keyof obj

// ✅ 正确：使用 typeof 转换
type Keys = keyof typeof obj
// type Keys = "name" | "age"
```

**3. 可选属性也会被包含**

```typescript
interface User {
  id: number
  name: string
  email?: string // 可选属性
}

type Keys = keyof User
// type Keys = "id" | "name" | "email"
// ✅ 包含可选属性
```

**4. 与 never 类型**

```typescript
interface Empty {}

type Keys = keyof Empty
// type Keys = never
// 空对象的 keyof 是 never

// 实际应用
type NonEmptyKeys<T> = keyof T extends never ? 'empty' : keyof T

type Test1 = NonEmptyKeys<Empty> // 'empty'
type Test2 = NonEmptyKeys<{ a: 1 }> // 'a'
```

**5. 性能考虑**

```typescript
// ❌ 不好：在循环中重复计算
function processObjects<T>(objects: T[]) {
  for (const obj of objects) {
    const keys: (keyof T)[] = Object.keys(obj) as (keyof T)[]
    // 处理...
  }
}

// ✅ 好：提前计算
function processObjectsBetter<T>(objects: T[]) {
  const keys: (keyof T)[] = Object.keys(objects[0]) as (keyof T)[]
  for (const obj of objects) {
    // 使用 keys...
  }
}
```

**6. 实际案例：类型安全的深度路径访问**

```typescript
type DeepKeys<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? K | `${K}.${DeepKeys<T[K]>}`
          : K
        : never
    }[keyof T]
  : never

interface NestedObject {
  user: {
    profile: {
      name: string
      age: number
    }
    settings: {
      theme: string
    }
  }
  posts: Array<{ title: string }>
}

type Paths = DeepKeys<NestedObject>
// type Paths = "user" | "posts" | "user.profile" | "user.settings"
//            | "user.profile.name" | "user.profile.age"
//            | "user.settings.theme"
```

## 8. 🔗 引用

- [TypeScript Handbook - Keyof Type Operator][1]
- [TypeScript Handbook - Indexed Access Types][2]
- [TypeScript Deep Dive - keyof][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/keyof-types.html
[2]: https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html
[3]: https://basarat.gitbook.io/typescript/type-system/index-signatures
