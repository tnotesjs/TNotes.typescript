# [0192. 索引访问类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0192.%20%E7%B4%A2%E5%BC%95%E8%AE%BF%E9%97%AE%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 索引访问类型是什么？](#3--索引访问类型是什么)
- [4. 🤔 索引访问类型如何使用？](#4--索引访问类型如何使用)
- [5. 🔗 引用](#5--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 索引访问类型的基本概念和语法
- 索引访问类型的使用方法
- 联合类型的分发机制

## 2. 🫧 评价

TS 中的索引访问类型是一种通过索引获取其他类型的子类型的机制。

相关笔记：`0101. 对象索引签名`

## 3. 🤔 索引访问类型是什么？

索引访问类型允许通过索引获取另一个类型的子类型。

- 索引访问类型使用 `T[K]` 语法访问类型 `T` 中键 `K` 对应的类型
- 索引是指 `string | number | symbol` 类型，或者它们的子类型
- 可以与 `keyof`、联合类型等其他类型特性结合使用
- 支持嵌套访问，可以深入获取复杂结构中的类型

```ts
// 基本语法：Type[Key]
// 作用：获取 Type 类型中 Key 对应的类型

interface Person {
  name: string
  age: number
  email: string
}

type NameType = Person['name'] // string
type AgeType = Person['age'] // number
type EmailType = Person['email'] // string
```

索引访问类型是类型层面的操作，不能和运行时的值操作混用。

```ts
interface Product {
  id: number
  name: string
  price: number
}

// TS 类型层面：访问类型
type ProductName = Product['name'] // string

// JS 值层面：访问属性值
const product: Product = { id: 1, name: 'Book', price: 20 }
const productName = product['name'] // 'Book'

const obj = { x: 10, y: 20 }

// ❌ 错误：类型和值不能混用
// type Wrong = obj['x'] // ❌ Error - 'obj' 仅表示值，但在此处用作类型
// 'obj' refers to a value, but is being used as a type here. Did you mean 'typeof obj'?(2749)

// ✅ 正确：使用 typeof 将值转为类型
type XType = (typeof obj)['x'] // number

// ❌ 错误：类型和值不能混用
// const key = 'x'
// type Wrong2 = (typeof obj)[key] // ❌ Error - key 是值层面的
// Type 'key' cannot be used as an index type.(2538)

// ✅ 正确：使用 typeof 将值转为类型
const key = 'x'
type XType2 = (typeof obj)[typeof key] // number
```

## 4. 🤔 索引访问类型如何使用？

索引访问通常用于以下这些类型：

1. 访问对象属性类型
2. 访问数组元素类型
3. 访问元组元素类型

::: code-group

```ts [1]
// 基本属性访问：
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

// 访问可选属性：
interface Config {
  host: string
  port: number
  ssl?: boolean
}

type SSLType = Config['ssl'] // boolean | undefined

// 访问只读属性：
interface ReadonlyData {
  readonly id: number
  readonly created: Date
}

type IdType = ReadonlyData['id'] // number (readonly 在类型中不保留)
type CreatedType = ReadonlyData['created'] // Date
```

```ts [2]
// 普通数组：
type StringArray = string[]
type StringArrayElement = StringArray[number] // string

type NumberArray = number[]
type NumberArrayElement = NumberArray[number] // number

// 混合类型数组：
type MixedArray = (string | number)[]
type MixedElement = MixedArray[number] // string | number

// 对象数组：
type UserArray = Array<{ id: number; name: string }>
type UserElement = UserArray[number]
// type UserElement = { id: number; name: string; }
```

```ts [3]
// 按索引访问：
type Tuple = [string, number, boolean]

type First = Tuple[0] // string
type Second = Tuple[1] // number
type Third = Tuple[2] // boolean

// 使用 number 访问所有元素：
type TupleElement = Tuple[number] // string | number | boolean

// 具名元组：这个名称只起到一个语义提示的作用，没有任何实际作用，当名称不存在即可。
type NamedTuple = [name: string, age: number, active: boolean]

type NameType = NamedTuple[0] // string
type AgeType = NamedTuple[1] // number
type AllTypes = NamedTuple[number] // string | number | boolean
```

:::

一些常见的高级用法：

1. 使用联合类型索引访问多个属性
2. 结合 keyof 使用
3. 嵌套索引访问

::: code-group

```ts [1]
interface User {
  id: number
  name: string
  email: string
  age: number
}

type UserStringFields = User['name' | 'email'] // string
type UserIdOrAge = User['id' | 'age'] // number
type AllFields = User['id' | 'name' | 'email' | 'age'] // string | number

// AllFields 的获取可以利用 keyof 简写：
type AllFields2 = User[keyof User] // string | number
```

```ts [2]
// 获取所有属性值类型的联合：
interface Person {
  name: string
  age: number
  email: string
}

type PersonValue = Person[keyof Person] // string | number

// 泛型函数中的应用：
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const person = { name: 'Alice', age: 25 }
const person_name = getProperty(person, 'name') // string
const person_age = getProperty(person, 'age') // number

// 复杂示例：
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

```ts [3]
// 多层访问：
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
// type AddressType = {
//     street: string;
//     city: string;
//     country: {
//         name: string;
//         code: string;
//     };
// }

type CityType = Organization['address']['city']
// type CityType = string

type CountryNameType = Organization['address']['country']['name']
// type CountryNameType = string

// 数组嵌套访问：
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
// type DepartmentType = {
//     name: string;
//     employees: Array<{
//         id: number;
//         name: string;
//     }>;
// }

type EmployeeType = Company['departments'][number]['employees'][number]
// type EmployeeType = {
//     id: number;
//     name: string;
// }
```

:::

注意：联合类型的分发机制

```ts
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

## 5. 🔗 引用

- [TypeScript Handbook - Indexed Access Types][1]
- [TypeScript Handbook - keyof Type Operator][2]
- [TypeScript Deep Dive - Index Signatures][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html
[2]: https://www.typescriptlang.org/docs/handbook/2/keyof-types.html
[3]: https://basarat.gitbook.io/typescript/type-system/index-signatures
