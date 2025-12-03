# [0190. extends 条件类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0190.%20extends%20%E6%9D%A1%E4%BB%B6%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 `extends` 是什么？](#3--extends-是什么)
- [4. 🤔 条件类型是什么？](#4--条件类型是什么)
- [5. 🤔 分布式条件类型是什么？](#5--分布式条件类型是什么)
- [6. 🔗 引用](#6--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- `extends` 关键字
- 条件类型的基本语法
- 分布式条件类型

## 2. 🫧 评价

TS 条件类型是通过 `extends` 检查一个类型是否满足约束，然后根据结果为 `true` 或 `false` 选择不同类型分支的类型运算技术。

`extends` 并非 TS 特有的，在 JS 中也存在这个关键字，主要用于表示类之间的继承关系，在 TS 中，对 `extends` 关键字进行了扩展，除了表达类的继承关系之外，它可以用于类型约束。

## 3. 🤔 `extends` 是什么？

`extends` 关键字在 TS 中有两层含义：

1. JS 运行时层面 - 类继承
2. TS 类型系统层面 - 类型约束条件

::: code-group

```ts [1]
// JS 层面 - 运行时层面的 extends（类继承）
class Animal {
  name: string

  constructor(name: string) {
    this.name = name
  }

  move(distance: number = 0) {
    console.log(`${this.name} moved ${distance}m.`)
  }
}

// Dog 继承 Animal
class Dog extends Animal {
  bark() {
    console.log('Woof! Woof!')
  }
}

const dog = new Dog('Buddy')
dog.move(10) // 继承的方法
dog.bark() // 自己的方法
```

```ts [2]
// TS 层面 - 使用 extends 添加约束条件
// T extends { length: number }
// 这么写表示传入的类型必须具备 length 属性
function logLength<T extends { length: number }>(arg: T): T {
  console.log(arg.length)
  return arg
}

logLength([1, 2, 3]) // ✅ 数组有 length
logLength('hello') // ✅ 字符串有 length
logLength({ length: 5 }) // ✅ 对象有 length 属性
// logLength(42) // ❌ 数字没有 length
```

:::

## 4. 🤔 条件类型是什么？

条件类型允许根据类型之间的关系选择不同的类型，类似于 JavaScript 中的三元运算符。

- 条件类型使用 `T extends U ? X : Y` 语法进行类型分支判断
- `extends` 在条件类型中表示类型兼容性检查，而非继承
- 条件类型是实现高级工具类型的基础，如 `Exclude`、`Extract`、`NonNullable` 等
- 结合 `infer` 关键字可以在条件类型中提取类型信息
- 条件类型支持嵌套，可以实现复杂的类型逻辑

```ts
// 语法：T extends U ? X : Y
// 如果 T 可以赋值给 U，则类型为 X，否则为 Y

type IsString<T> = T extends string ? true : false

// 示例：
type A = IsString<string> // type A = true
type B = IsString<number> // type B = false
type C = IsString<'hello'> // type C = true (字面量类型也是 string 的子类型)
```

在条件类型中，`extends` 表示类型兼容性关系，不是类继承的意思。比如 `T extends U`，意思是：`T` 可以赋值给 `U`。

```ts
type IsNumber<T> = T extends number ? 'yes' : 'no'

type R1 = IsNumber<42> // type R1 = "yes"
type R2 = IsNumber<string> // type R2 = "no"
```

## 5. 🤔 分布式条件类型是什么？

分布式条件类型（Distributive Conditional Types）是 TypeScript 中条件类型的一个重要特性，它会在联合类型上自动“分布”执行。

当条件类型检查的是裸类型参数时，如果传入的是联合类型，TypeScript 会自动将条件类型应用到联合类型的每个成员上，然后将结果组合成新的联合类型。

- 裸类型参数（Naked Type Parameter）：指没有被其他类型包装的类型参数，例如直接使用 `T` 而不是 `Array<T>`、`[T]`、`Promise<T>` 等
- 联合类型输入：只有当输入是联合类型时，分布式特性才会生效

示例：当条件类型作用于联合类型时，会自动分发；可以使用元组包裹来阻止自动分发机制。

```ts
type ToArray<T> = T extends any ? T[] : never

type T1 = ToArray<string | number>
// 分发：ToArray<string> | ToArray<number>
// 结果：string[] | number[]

// 阻止分发：使用元组包裹
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never

type T2 = ToArrayNonDist<string | number>
// 结果：(string | number)[]
```

never 类型的特殊性：

```ts
type Test<T> = T extends string ? true : false

type T1 = Test<never> // never

// 原因：never 会被 TS 视作是空的联合类型，分发后得到 never
// 解决：使用元组包裹
type TestFixed<T> = [T] extends [string] ? true : false
type T2 = TestFixed<never> // true
// never 是空集，它是所有类型的子类型，因此这里返回的 T2 是 true
```

## 6. 🔗 引用

- [TypeScript Handbook - Conditional Types][1]
- [TypeScript Handbook - Type Inference in Conditional Types][2]
- [TypeScript Handbook - Distributive Conditional Types][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
[2]: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types
[3]: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
