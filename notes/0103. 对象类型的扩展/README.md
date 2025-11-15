# [0103. 对象类型的扩展](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0103.%20%E5%AF%B9%E8%B1%A1%E7%B1%BB%E5%9E%8B%E7%9A%84%E6%89%A9%E5%B1%95)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是对象类型扩展？](#3--什么是对象类型扩展)
- [4. 🤔 如何使用接口继承 extends 来扩展对象类型？](#4--如何使用接口继承-extends-来扩展对象类型)
  - [4.1. 基本用法](#41-基本用法)
  - [4.2. 多重继承](#42-多重继承)
  - [4.3. 覆盖属性类型](#43-覆盖属性类型)
- [5. 🤔 如何使用交叉类型 & 来扩展对象类型？](#5--如何使用交叉类型--来扩展对象类型)
  - [5.1. 基本用法](#51-基本用法)
  - [5.2. 组合多个类型](#52-组合多个类型)
  - [5.3. 类型冲突](#53-类型冲突)
  - [5.4. 混合对象类型和原始类型](#54-混合对象类型和原始类型)
- [6. 🆚 接口扩展 vs 交叉类型](#6--接口扩展-vs-交叉类型)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 接口扩展（extends）
- 交叉类型（Intersection Types）
- 继承和交叉两种扩展方式的区别

## 2. 🫧 评价

对象类型扩展是 TypeScript 中组合和复用类型的重要机制。有两种主要方式：

1. 接口扩展（extends）：使用 `extends` 关键字
2. 交叉类型（&）：使用 `&` 操作符

两种方式都能实现类型的组合，但有细微差别：

| 特性     | 接口扩展                | 交叉类型          |
| -------- | ----------------------- | ----------------- |
| 语法     | `interface A extends B` | `type A = B & C`  |
| 冲突处理 | 编译时错误              | 形成 `never` 类型 |
| 合并     | 自动声明合并            | 不支持声明合并    |

## 3. 🤔 什么是对象类型扩展？

对象类型扩展允许你基于已有类型创建新类型，继承原有类型的所有属性。

对象类型扩展的主要操作包括：

- 继承：新类型包含基类型的所有属性
- 扩展：可以添加新属性
- 覆盖：可以收窄基类型的属性类型
- 组合：可以组合多个类型

继承是最为常见的扩展方式之一，其基本写法如下：

```ts
// 基础类型
interface Animal {
  name: string
  age: number
}

// 扩展类型继承基础类型的所有属性并添加新的属性
interface Dog extends Animal {
  breed: string
  bark(): void
}

const dog: Dog = {
  name: 'Buddy',
  age: 3,
  breed: 'Golden Retriever',
  bark() {
    console.log('Woof!')
  },
}
```

## 4. 🤔 如何使用接口继承 extends 来扩展对象类型？

### 4.1. 基本用法

```ts
// 单一继承
interface Person {
  name: string
  age: number
}

interface Employee extends Person {
  employeeId: number
  department: string
}

const employee: Employee = {
  name: 'Alice',
  age: 30,
  employeeId: 12345,
  department: 'Engineering',
}
```

### 4.2. 多重继承

```ts
// 接口可以继承多个接口
interface Printable {
  print(): void
}

interface Serializable {
  serialize(): string
}

interface Document extends Printable, Serializable {
  title: string
  content: string
}

const doc: Document = {
  title: 'TypeScript Guide',
  content: '...',
  print() {
    console.log(this.content)
  },
  serialize() {
    return JSON.stringify(this)
  },
}
```

### 4.3. 覆盖属性类型

注意：在覆盖属性类型的时候

- 可以收窄类型
- 不能扩宽类型

```ts
interface Base {
  value: string | number
}

// ✅ 可以收窄类型
interface Derived extends Base {
  value: string // 收窄为 string
}

// ❌ 不能扩宽类型
interface Invalid extends Base {
  value: string | number | boolean // ❌ Error
}
// 报错信息如下：
// Interface 'Invalid' incorrectly extends interface 'Base'.
//   Types of property 'value' are incompatible.
//     Type 'string | number | boolean' is not assignable to type 'string | number'.
//       Type 'boolean' is not assignable to type 'string | number'.(2430)
```

## 5. 🤔 如何使用交叉类型 & 来扩展对象类型？

### 5.1. 基本用法

```ts
// 使用 & 组合类型
type Person = {
  name: string
  age: number
}

type Contact = {
  email: string
  phone: string
}

type PersonWithContact = Person & Contact

const person: PersonWithContact = {
  name: 'Alice',
  age: 30,
  email: 'alice@example.com',
  phone: '123-456-7890',
}
```

### 5.2. 组合多个类型

```ts
// 组合任意数量的类型
type A = { a: string }
type B = { b: number }
type C = { c: boolean }

type ABC = A & B & C

const obj: ABC = {
  a: 'hello',
  b: 42,
  c: true,
}
```

### 5.3. 类型冲突

```ts
// ⚠️ 属性类型冲突会产生 never
type A = { value: string }
type B = { value: number }

type Conflict = A & B
// { value: never } - string & number = never

const obj: Conflict = {
  value: 'test' as never, // 必须断言为 never 类型
  // value: 'test' // ❌ 无法赋值有效值
}
// 报错信息如下：
// Type 'string' is not assignable to type 'never'.(2322)
```

### 5.4. 混合对象类型和原始类型

```ts
// 交叉类型可以包含非对象类型
type StringWithLength = string & { length: number }
// 但这在实践中很少用，因为 string 已经有 length

// 实用的例子：品牌类型 - 模拟名义子类型的效果
type UserId = number & { readonly brand: unique symbol }
type ProductId = number & { readonly brand: unique symbol }

// 不能混用
function getUser(id: UserId) {}
function getProduct(id: ProductId) {}

const userId = 1 as UserId
const productId = 1 as ProductId

getUser(userId) // ✅
getUser(productId) // ❌ Error
```

## 6. 🆚 接口扩展 vs 交叉类型

语法差异：

::: code-group

```ts [接口扩展]
// 使用 extends 关键字
interface Animal {
  name: string
}

interface Dog extends Animal {
  breed: string
}
```

```ts [交叉类型]
// 使用 & 操作符
type Animal = {
  name: string
}

type Dog = Animal & {
  breed: string
}
```

:::

同字段但类型不同：

::: code-group

```ts [接口扩展]
// ❌ 接口扩展：编译时立即报错
interface A {
  prop: string
}

interface B extends A {
  prop: number // ❌ Error: Interface 'B' incorrectly extends interface 'A'
}
```

```ts [交叉类型]
// ⚠️ 交叉类型：创建 never 类型
type A = {
  prop: string
}

type B = A & {
  prop: number
}

// B 的 prop 类型是 never
const obj: B = {
  prop: 'test' as never, // 无法赋值
}
```

:::

类型名称相同：

::: code-group

```ts [接口扩展]
// ✅ 接口支持声明合并
interface User {
  name: string
}

interface User {
  age: number
}

// 自动合并
const user: User = {
  name: 'Alice',
  age: 30,
}
```

```ts [交叉类型]
// ❌ 类型别名不支持声明合并
type User = {
  name: string
}

type User = {
  // ❌ Error: Duplicate identifier
  age: number
}
```

:::

## 7. 🔗 引用

- [TypeScript Handbook - Interfaces][1]
- [TypeScript Handbook - Intersection Types][2]
- [TypeScript Deep Dive - Interfaces][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/objects.html#extending-types
[2]: https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types
[3]: https://basarat.gitbook.io/typescript/type-system/interfaces
