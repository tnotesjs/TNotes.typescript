# [0188. keyof 运算符](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0188.%20keyof%20%E8%BF%90%E7%AE%97%E7%AC%A6)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. `keyof` 是什么？](#3-keyof-是什么)
- [4. `keyof` 如何处理不同类型？](#4-keyof-如何处理不同类型)
- [5. 如何利用 `keyof` 创建映射类型？](#5-如何利用-keyof-创建映射类型)
- [6. keyof 与索引签名如何配合？](#6-keyof-与索引签名如何配合)
- [7. `keyof any` 的结果是什么？](#7-keyof-any-的结果是什么)
- [8. keyof 的使用都有哪些需要留意的细节？](#8-keyof-的使用都有哪些需要留意的细节)
- [9. 引用](#9-引用)

<!-- endregion:toc -->

## 1. 本节内容

- `keyof` 运算符的基本概念和语法
- `keyof` 对不同类型的处理
- `keyof` 映射类型的结合
- `keyof` 与索引签名配合使用

## 2. 评价

`keyof` 能够获取对象类型的所有键组成的联合类型，是实现高级类型工具的基础，TS 中的大多内置类型，比如 `Partial<T>`、`Required<T>`、`Readonly<T>` 等，都是利用 `keyof` 创建的映射类型。

## 3. `keyof` 是什么？

`keyof` 是 TypeScript 的类型运算符，用于获取对象类型的所有键（key）组成的联合类型。

基本用法：

```ts
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
const key1: PersonKeys = 'name' // ✅ OK
const key2: PersonKeys = 'age' // ✅ OK
const key3: PersonKeys = 'email' // ✅ OK
const key4: PersonKeys = 'address' // ❌ Error 不存在的键
```

`keyof` 返回的是“键”的联合类型。

1. 字符串键
2. 数字键
3. 混合键

::: code-group

```ts [1]
interface User {
  id: number
  name: string
}

type UserKeys = keyof User
// type UserKeys = "id" | "name"

const key1: UserKeys = 'id' // ✅ OK
const key2: UserKeys = 'name' // ✅ ok
const key3: UserKeys = 'xxx' // ❌ Error
// Type '"xxx"' is not assignable to type 'keyof User'.(2322)
```

```ts [2]
interface NumericKeys {
  [key: number]: string
}

type Keys = keyof NumericKeys
// type Keys = number

const key1: Keys = 123 // ✅ OK
const key2: Keys = '123' // ❌ Error
// Type 'string' is not assignable to type 'number'.(2322)
```

```ts [3]
interface MixedKeys {
  name: string
  [key: number]: string
}

type Keys = keyof MixedKeys
// type Keys = "name" | number

const key1: Keys = 123 // ✅ OK
const key2: Keys = 'name' // ✅ OK
const key3: Keys = '123' // ❌ Error
// Type '"123"' is not assignable to type 'keyof MixedKeys'.(2322)
```

:::

## 4. `keyof` 如何处理不同类型？

总的来说，`keyof` 对不同类型的处理，还是比较符合直觉的，简单推断一下，基本就能得知 `keyof` 的返回结果。

1. 接口
2. 类型别名
3. 数组类型，对数组使用 `keyof` 会得到数组所有方法和属性的键
4. 元组类型，元组的 `keyof` 包含索引和数组方法
5. 类类型，对类使用 `keyof` 只会获取公开属性和方法
6. ……

::: code-group

```ts [1]
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

getBookProperty(myBook, 'title') // ✅ OK
getBookProperty(myBook, 'price') // ❌ Error
```

```ts [2]
type Product = {
  id: number
  name: string
  price: number
}

type ProductKeys = keyof Product
// type ProductKeys = "id" | "name" | "price"
```

```ts [3]
type ArrayKeys = keyof any[]
// 包含所有数组方法和属性：
// "length" | "toString" | "push" | "pop" | "concat" | "join" | ...

type Arr = string[]
type ArrKeys = keyof Arr
// type ArrKeys = number | "length" | "toString" | "push" | ...

const key1: ArrKeys = 'length' // ✅ OK
const key2: ArrKeys = 'push' // ✅ OK
const key3: ArrKeys = 123 // ✅ OK 数字索引
const key4: ArrKeys = 'xxx' // ❌ Error
// Type '"xxx"' is not assignable to type 'keyof Arr'.(2322)
```

```ts [4]
type Tuple = [string, number, boolean]

type TupleKeys = keyof Tuple
// type TupleKeys = "0" | "1" | "2" | "length" | "toString" | "push" | ...

const key1: TupleKeys = '0' // ✅ OK
const key2: TupleKeys = '1' // ✅ OK
const key3: TupleKeys = '2' // ✅ OK

const key4: TupleKeys = '3' // ❌ Error
// Type '"3"' is not assignable to type 'keyof Tuple'.(2322)

const key5: TupleKeys = 'length' // ✅ OK
const key6: TupleKeys = 'push' // ✅ OK
```

```ts [5]
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
// ⚠️ 注意，只包含 public 成员，不包含 private 和 protected

const key1: PersonKeys = 'name' // ✅ OK
const key2: PersonKeys = 'greet' // ✅ OK

const key3: PersonKeys = 'getAge' // ❌ Error
// Type '"getAge"' is not assignable to type 'keyof Person'.(2322)

const key4: PersonKeys = 'email' // ❌ Error
// Type '"email"' is not assignable to type 'keyof Person'.(2322)
```

:::

## 5. 如何利用 `keyof` 创建映射类型？

```ts
interface Person {
  name: string
  age: number
  email: string
}

// 将所有属性变为可选
type MyPartial<T> = {
  [K in keyof T]?: T[K]
}

type PartialPerson = Partial<Person>
// type PartialPerson = {
//     name?: string | undefined;
//     age?: number | undefined;
//     email?: string | undefined;
// }

// 将所有属性变为只读
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K]
}

type ReadonlyPerson = Readonly<Person>
// type ReadonlyPerson = {
//     readonly name: string;
//     readonly age: number;
//     readonly email: string;
// }
```

这个示例中定义的两个工具类型 `MyPartial`、`MyReadonly` 其实就是 TS 内置的工具类型 `Partial`、`Readonly` 的实现逻辑，那些 TS 中内置的工具类型，本质上也是这样通过类型运算来实现的。

## 6. keyof 与索引签名如何配合？

1. 字符串索引签名，如果只有字符串索引签名，在提取的时候会自动联合上 `| number` 类型，因为 JS 会将数字键转为字符串
2. 数字索引签名
3. 混合使用，索引签名会覆盖明确的属性键（父集包含子集）

::: code-group

```ts [1]
interface StringMap {
  [key: string]: any
}

type Keys = keyof StringMap
// type Keys = string | number
// ⚠️ 包含 number 是因为 JS 会将数字键转为字符串

const key1: Keys = 'xxx' // ✅ OK
const key2: Keys = 123 // ✅ OK
```

```ts [2]
interface NumberMap {
  [key: number]: string
}

type Keys = keyof NumberMap
// type Keys = number

// const key1: Keys = 'xxx' // ❌ Error
// Type 'string' is not assignable to type 'number'.(2322)

const key2: Keys = 123 // ✅ OK
```

```ts [3]
// [key: string]
// 有索引签名，意味着可以有任意键
// 只要满足键的类型是 string 或者 number 即可
interface MixedMap {
  name: string // 明确的属性
  [key: string]: any // 字符串索引签名
}

type Keys = keyof MixedMap
// type Keys = string | number
// ⚠️ 索引签名会覆盖明确的属性键

const key1: Keys = 'name' // ✅ OK
const key2: Keys = 'xxx' // ✅ OK
const key3: Keys = 123 // ✅ OK

// 没有索引签名的情况下，只允许已知的键
interface StrictObject {
  id: number
  name: string
}

type StrictKeys = keyof StrictObject
// type StrictKeys = "id" | "name"

const key4: StrictKeys = 'id' // ✅ OK
const key5: StrictKeys = 'name' // ✅ OK

const key6: StrictKeys = 'xxx' // ❌ Error
// Type '"xxx"' is not assignable to type 'keyof StrictObject'.(2322)

const key7: StrictKeys = 123 // ❌ Error
// Type '123' is not assignable to type 'keyof StrictObject'.(2322)
```

:::

## 7. `keyof any` 的结果是什么？

`keyof any` 等价于 `string | number | symbol`。

```ts
type Result = keyof any
// type Result = string | number | symbol

// 下面两个定义是等价的
type Dict1<T> = { [K in string | number | symbol]: T }
type Dict2<T> = { [K in keyof any]: T }

type StringDict = Dict1<string>
// type StringDict = {
//     [x: string]: string;
//     [x: number]: string;
//     [x: symbol]: string;
// }

const dict: StringDict = {
  a: 'hello',
  1: 'world',
  [Symbol('key')]: 'symbol',
}
```

## 8. keyof 的使用都有哪些需要留意的细节？

1. `keyof` 与联合类型一起使用，只保留共同的键；与交叉类型一起使用，包含所有键
2. `keyof` 不能用于值，在提取值的 key 时，可以先使用 `typeof` 提取值的类型，然后再由 `keyof` 提取 key
3. `keyof` 也会提取可选属性的 key
4. `keyof` 提取空对象时，会得到 `never` 类型

::: code-group

```ts [1]
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

```ts [2]
const obj = {
  name: 'Alice',
  age: 25,
}

// ❌ Error：keyof 只能用于类型
// type Keys = keyof obj
// 报错信息：
// 'obj' refers to a value, but is being used as a type here.
// Did you mean 'typeof obj'?(2749)

// 报错信息中提醒我们，这里的 obj 是一个值
// keyof 后面跟的应该是一个类型
// 你是不是应该写 typeof obj 呢？

// ✅ OK：使用 typeof 转换
type Keys = keyof typeof obj
// type Keys = "name" | "age"
```

```ts [3]
interface User {
  id: number
  name: string
  email?: string // 可选属性
}

type Keys = keyof User
// type Keys = "id" | "name" | "email"

const key1: Keys = 'id'
const key2: Keys = 'name'
const key3: Keys = 'email'

const key4: Keys = 'xxx'
// Type '"xxx"' is not assignable to type 'keyof User'.(2322)
```

```ts [4]
interface Empty {}

type Keys = keyof Empty
// type Keys = never
// 空对象的 keyof 是 never

// 如果不想提取到 never 类型，那么可以自定义一个工具类型来对空对象做一个特殊处理。
// keyof T extends never 假如提取的结果是 never 类型
// 'empty' 就返回字面量 'empty' 类型
// keyof T 否则就返回 keyof 返回的类型
type NonEmptyKeys<T> = keyof T extends never ? 'empty' : keyof T

type Test1 = NonEmptyKeys<Empty> // 'empty'
type Test2 = NonEmptyKeys<{ a: 1 }> // 'a'
```

:::

## 9. 引用

- [TypeScript Handbook - Keyof Type Operator][1]
- [TypeScript Handbook - Indexed Access Types][2]
- [TypeScript Deep Dive - keyof][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/keyof-types.html
[2]: https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html
[3]: https://basarat.gitbook.io/typescript/type-system/index-signatures
