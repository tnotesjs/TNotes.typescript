# [0189. in 运算符](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0189.%20in%20%E8%BF%90%E7%AE%97%E7%AC%A6)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 `in` 是什么？](#3--in-是什么)
- [4. 🤔 如何使用 `in` 创建映射类型？](#4--如何使用-in-创建映射类型)
- [5. 🤔 `in` 运算符如何用于类型守卫？](#5--in-运算符如何用于类型守卫)
- [6. 🔗 引用](#6--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- `in` 运算符在 JavaScript 和 TypeScript 中的不同用途
- 使用 `in` 创建映射类型
- `in` 运算符用于类型守卫

## 2. 🫧 评价

JS 中也有 `in` 运算符，主要用于属性检查是否存在，本节主要介绍 TS 中的 `in` 运算符，重点介绍在类型运算中 `in` 运算符的作用，它是实现 `Partial`、`Required`、`Readonly` 等工具类型的基础。

## 3. 🤔 `in` 是什么？

`in` 运算符在 TypeScript 中的双重作用：

1. 作为 JavaScript 运行时的属性检查运算符，用于检查对象是否包含指定的属性
2. 作为 TypeScript 类型系统中创建映射类型的关键字，用于创建映射类型，遍历联合类型的每个成员

::: code-group

```ts [1]
const person = {
  name: 'Alice',
  age: 25,
}

// 检查属性是否存在
console.log('name' in person) // true
console.log('email' in person) // false

// 也会检查原型链上的属性
console.log('toString' in person) // true（继承自 Object.prototype）
```

```ts [2]
// 语法：[K in Keys]: Type
type Keys = 'a' | 'b' | 'c'

type Obj = {
  [K in Keys]: string
}
// 等同于：
// type Obj = {
//   a: string;
//   b: string;
//   c: string;
// }
```

:::

## 4. 🤔 如何使用 `in` 创建映射类型？

1. 将联合类型转换为对象类型
2. 结合 `keyof` 使用

::: code-group

```ts [1]
type Status = 'pending' | 'success' | 'error'

type StatusMap = {
  [K in Status]: boolean
}
// type StatusMap = {
//   pending: boolean;
//   success: boolean;
//   error: boolean;
// }

// 使用示例
const statusFlags: StatusMap = {
  pending: false,
  success: true,
  error: false,
}
```

```ts [2]
interface Person {
  name: string
  age: number
  email: string
}

// 将所有属性变为可选
type PartialPerson = {
  [K in keyof Person]?: Person[K]
}
// type PartialPerson = {
//     name?: string | undefined;
//     age?: number | undefined;
//     email?: string | undefined;
// }

// 将所有属性变为只读
type ReadonlyPerson = {
  readonly [K in keyof Person]: Person[K]
}
// type ReadonlyPerson = {
//   readonly name: string;
//   readonly age: number;
//   readonly email: string;
// }
```

:::

## 5. 🤔 `in` 运算符如何用于类型守卫？

使用 `in` 运算符可以在运行时检查属性是否存在，TypeScript 会据此收窄类型。

```ts
interface Dog {
  bark(): void
  name: string
}

interface Cat {
  meow(): void
  name: string
}

type Pet = Dog | Cat

function makeSound(pet: Pet) {
  // 使用 in 进行类型守卫
  if ('bark' in pet) {
    // bark 是 Dog 的特有的属性
    // TS 知道这里 pet 是 Dog
    pet.bark() // ✅
  } else {
    // TS 知道这里 pet 是 Cat
    pet.meow() // ✅
  }
}
```

注意，`in` 运算符无法守卫可选属性，因为可选属性的值可能为 undefined。

```ts
interface User {
  name: string
  email?: string
}

const user: User = { name: 'Alice' }

if ('email' in user) {
  // ❌ email 可能是 undefined
  console.log(user.email.length)
  // 'user.email' is possibly 'undefined'.(18048)
}
```

## 6. 🔗 引用

- [TypeScript Handbook - Mapped Types][1]
- [TypeScript Handbook - Type Guards][2]
- [MDN - in operator][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
[2]: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-in-operator-narrowing
[3]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/in
