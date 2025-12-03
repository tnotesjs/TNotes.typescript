# [0194. 条件类型的分布式特性](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0194.%20%E6%9D%A1%E4%BB%B6%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%88%86%E5%B8%83%E5%BC%8F%E7%89%B9%E6%80%A7)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是分布式条件类型？](#3--什么是分布式条件类型)
- [4. 🆚 裸类型 vs 包裹类型](#4--裸类型-vs-包裹类型)
- [5. 🔍 TS 内置工具类型 `Exclude`、`Extract`、`NonNullable` 的实现原理](#5--ts-内置工具类型-excludeextractnonnullable-的实现原理)
- [6. 🔗 引用](#6--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 分布式条件类型的基本概念
- 分布式条件类型的工作原理
- 分布式条件类型的实际应用（`Exclude`、`Extract`、`NonNullable` 内置工具类型的实现原理解析）
- 裸类型和包裹类型
- 阻止分布的写法

## 2. 🫧 评价

TS 中条件类型的分布式特性是 `Exclude`、`Extract`、`NonNullable` 等工具类型的实现基础。

## 3. 🤔 什么是分布式条件类型？

分布式条件类型是指当条件类型作用于联合类型时，会自动将联合类型的每个成员分别应用条件类型。

- 当条件类型作用于联合类型时会自动分发
- 分发是将联合类型的每个成员单独应用条件类型，然后合并结果
- 这是 `Exclude`、`Extract`、`NonNullable` 等工具类型的实现基础
- 可以通过元组包裹的方式阻止分布式行为
- 理解分布式特性对于编写正确的类型工具至关重要，是你自行封装一些类型工具的基础

```ts
// 基本示例
type ToArray<T> = T extends any ? T[] : never

// 对单个类型
type T1 = ToArray<string> // string[]

// 对联合类型 - 发生分发
type T2 = ToArray<string | number>
// 等同于：ToArray<string> | ToArray<number>
// 结果：string[] | number[]
```

使用元组包裹避免分布式：

```ts
// 非分布式（使用元组包裹）
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never

type T3 = ToArrayNonDist<string | number>
// 结果：(string | number)[]
// 注意：这是一个数组，元素可以是 string 或 number

// 分布式
type T4 = ToArray<string | number>
// 结果：string[] | number[]
// 注意：这是两种数组类型的联合
```

发生分发的过程：

```ts
type Boxed<T> = T extends any ? { value: T } : never

// 对联合类型应用
type Result = Boxed<string | number | boolean>

// TypeScript 的处理过程：
// 1. 将 string | number | true | false 拆分，boolean 是 true | false 的联合类型
// 2. 分别应用：
//    Boxed<string> -> { value: string }
//    Boxed<number> -> { value: number }
//    Boxed<true>   -> { value: true }
//    Boxed<false>  -> { value: false }
// 3. 合并结果：
//    { value: string } | { value: number } | { value: true } | { value: false }

// 使用示例
const box1: Result = { value: 'hello' } // ✅ OK
const box2: Result = { value: 42 } // ✅ OK
const box3: Result = { value: true } // ✅ OK
const box4: Result = { value: false } // ✅ OK
const box5: Result = { value: { foo: 1 } } // ❌ Error
// Type '{ foo: number; }' is not assignable to type 'string | number | boolean'.(2322)
```

需要注意 never 的特殊行为 - 被视作空的联合类型，默认也会分发，可以通过包裹类型来避免分发。

```ts
type Test<T> = T extends string ? true : false

// never 是空联合类型，分发后仍然是 never
type R1 = Test<never> // never

// 解决：使用元组包裹，避免分发
type TestFixed<T> = [T] extends [string] ? true : false
type R2 = TestFixed<never> // true
// never 是空集，是所有类型的子类型
```

## 4. 🆚 裸类型 vs 包裹类型

```ts
// 裸类型参数 - 会分发
type Dist1<T> = T extends string ? T : never
type R1 = Dist1<'a' | 'b' | 1>
// 分发：Dist1<'a'> | Dist1<'b'> | Dist1<1>
// 结果：'a' | 'b' | never
// 由于 never 是空集
// 等价：'a' | 'b'

// 非裸类型参数 - 不会分发
type Dist2<T> = [T] extends [string] ? T : never
type R2 = Dist2<'a' | 'b' | 1>
// 不分发，整体判断：['a' | 'b' | 1] extends [string]
// 结果：never
```

有时我们希望将联合类型作为整体处理，需要阻止分发。

- 方法 1：使用元组包裹
- 方法 2：使用对象包裹

::: code-group

```ts [1]
type NoDistribute<T> = [T] extends [any] ? T : never

type T1 = NoDistribute<string | number>
// 结果：string | number
```

```ts [2]
type NoDistribute<T> = { value: T } extends { value: any } ? T : never

type T2 = NoDistribute<string | number>
// 结果：string | number
```

:::

## 5. 🔍 TS 内置工具类型 `Exclude`、`Extract`、`NonNullable` 的实现原理

1. `Exclude`
2. `Extract`
3. `NonNullable`

::: code-group

```ts [1]
type MyExclude<T, U> = T extends U ? never : T

type T1 = MyExclude<'a' | 'b' | 'c', 'a'> // 'b' | 'c'
type T2 = MyExclude<string | number, string> // number

// T1 分发过程：
// MyExclude<'a' | 'b' | 'c', 'a'>
// → MyExclude<'a', 'a'> | MyExclude<'b', 'a'> | MyExclude<'c', 'a'>
// → never | 'b' | 'c'
// → 'b' | 'c'

// 内置工具类型 Exclude 的定义：
// type Exclude<T, U> = T extends U ? never : T
type T3 = Exclude<'a' | 'b' | 'c', 'a'> // 'b' | 'c'
type T4 = Exclude<string | number, string> // number
```

```ts [2]
type MyExtract<T, U> = T extends U ? T : never

type T1 = MyExtract<'a' | 'b' | 'c', 'a' | 'c'> // 'a' | 'c'
type T2 = MyExtract<string | number, string> // string

// T1 分发过程：
// MyExtract<'a' | 'b' | 'c', 'a' | 'c'>
// → MyExtract<'a', 'a' | 'c'> | MyExtract<'b', 'a' | 'c'> | MyExtract<'c', 'a' | 'c'>
// → 'a' | never | 'c'
// → 'a' | 'c'

// 内置工具类型 Extract 的定义：
// type Extract<T, U> = T extends U ? T : never
type T3 = Extract<'a' | 'b' | 'c', 'a'> // 'b' | 'c'
type T4 = Extract<string | number, string> // number
```

```ts [3]
type MyNonNullable<T> = T extends null | undefined ? never : T

type T1 = MyNonNullable<string | null | undefined> // string
type T2 = MyNonNullable<number | null> // number
type T3 = MyNonNullable<boolean | undefined> // boolean

// T1 分发过程：
// MyNonNullable<string | null | undefined>
// → MyNonNullable<string> | MyNonNullable<null> | MyNonNullable<undefined>
// → string | never | never
// → string

// 内置工具类型 NonNullable 的定义：
// type NonNullable<T> = T & {}
type T4 = NonNullable<string | null | undefined> // string
type T5 = NonNullable<number | null> // number
type T6 = NonNullable<boolean | undefined> // boolean

// 分析：MyNonNullable 的实现原理
// {} 其实是 Object 的简写形式，Object 表示的是所有非 null/undefined 的类型
// NonNullable (T & {}) 方式：
// 1. 计算交集：
//    - string & {} -> string
//    - null & {} -> never
//    - undefined & {} -> never
// 2. 合并：string | never | never -> string
```

:::

使用类似的思路，我们可以自行封装工具类型，实现联合类型的过滤。

1. 提取函数类型
2. 提取对象类型
3. 按属性过滤

::: code-group

```ts [1]
type ExtractFunction<T> = T extends (...args: any[]) => any ? T : never

type Mixed = string | number | (() => void) | ((x: number) => string)
type Funcs = ExtractFunction<Mixed>
// type Funcs = (() => void) | ((x: number) => string)
```

```ts [2]
type ExtractObject<T> = T extends object ? T : never

type Mixed = string | number | { id: number } | { name: string }
type Objects = ExtractObject<Mixed>
// type Objects = { id: number } | { name: string }
```

```ts [3]
type ExtractWithId<T> = T extends { id: any } ? T : never

type Items =
  | { id: number; name: string }
  | { name: string }
  | { id: string; value: number }
  | string

type WithId = ExtractWithId<Items>
// type WithId = { id: number; name: string } | { id: string; value: number }
```

:::

## 6. 🔗 引用

- [TypeScript Handbook - Distributive Conditional Types][1]
- [TypeScript Handbook - Conditional Types][2]
- [TypeScript PR #21316 - Conditional Types][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
[2]: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
[3]: https://github.com/microsoft/TypeScript/pull/21316
