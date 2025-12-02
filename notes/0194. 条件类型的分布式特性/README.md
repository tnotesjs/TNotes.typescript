# [0194. 条件类型的分布式特性](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0194.%20%E6%9D%A1%E4%BB%B6%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%88%86%E5%B8%83%E5%BC%8F%E7%89%B9%E6%80%A7)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是分布式条件类型？](#3--什么是分布式条件类型)
  - [3.1. 基本概念](#31-基本概念)
  - [3.2. 分布式行为](#32-分布式行为)
- [4. 🤔 分布式条件类型如何工作？](#4--分布式条件类型如何工作)
  - [4.1. 自动分发](#41-自动分发)
  - [4.2. 分发的条件](#42-分发的条件)
  - [4.3. 阻止分发](#43-阻止分发)
- [5. 🤔 分布式条件类型的实际应用](#5--分布式条件类型的实际应用)
  - [5.1. Exclude 和 Extract](#51-exclude-和-extract)
  - [5.2. NonNullable](#52-nonnullable)
  - [5.3. 过滤联合类型](#53-过滤联合类型)
- [6. 🤔 分布式条件类型的高级技巧](#6--分布式条件类型的高级技巧)
  - [6.1. 条件分发与映射类型](#61-条件分发与映射类型)
  - [6.2. 保留联合类型结构](#62-保留联合类型结构)
  - [6.3. 复杂类型转换](#63-复杂类型转换)
- [7. 🤔 分布式条件类型有哪些注意事项？](#7--分布式条件类型有哪些注意事项)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 分布式条件类型的基本概念
- 分布式条件类型的工作原理
- 分布式条件类型的实际应用
- 如何控制和阻止分布式行为
- 使用注意事项和最佳实践

## 2. 🫧 评价

这篇笔记详细介绍了 TypeScript 中条件类型的分布式特性，这是一个强大但容易被误解的特性。

- 当条件类型作用于联合类型时会自动分发
- 分发是将联合类型的每个成员单独应用条件类型，然后合并结果
- 这是 `Exclude`、`Extract`、`NonNullable` 等工具类型的实现基础
- 可以通过元组包裹的方式阻止分布式行为
- 理解分布式特性对于编写正确的类型工具至关重要
- 错误使用可能导致意外的类型结果

## 3. 🤔 什么是分布式条件类型？

### 3.1. 基本概念

分布式条件类型是指当条件类型作用于联合类型时，会自动将联合类型的每个成员分别应用条件类型。

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

**对比非分布式：**

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

### 3.2. 分布式行为

**发生分发的过程：**

```ts
type Boxed<T> = T extends any ? { value: T } : never

// 对联合类型应用
type Result = Boxed<string | number | boolean>

// TypeScript 的处理过程：
// 1. 将 string | number | boolean 拆分
// 2. 分别应用：
//    Boxed<string>  → { value: string }
//    Boxed<number>  → { value: number }
//    Boxed<boolean> → { value: boolean }
// 3. 合并结果：
//    { value: string } | { value: number } | { value: boolean }
```

**实际结果：**

```ts
type Result = Boxed<string | number | boolean>
// type Result = { value: string } | { value: number } | { value: boolean }

// 使用示例
const box1: Result = { value: 'hello' } // ✅
const box2: Result = { value: 42 } // ✅
const box3: Result = { value: true } // ✅
```

## 4. 🤔 分布式条件类型如何工作？

### 4.1. 自动分发

只有当条件类型中的类型参数是裸类型（naked type parameter）时才会分发。

```ts
// ✅ 裸类型参数 - 会分发
type Dist1<T> = T extends string ? T : never
type R1 = Dist1<'a' | 'b' | 1>
// 分发：Dist1<'a'> | Dist1<'b'> | Dist1<1>
// 结果：'a' | 'b' | never
// 简化：'a' | 'b'

// ❌ 非裸类型参数 - 不会分发
type Dist2<T> = [T] extends [string] ? T : never
type R2 = Dist2<'a' | 'b' | 1>
// 不分发，整体判断：['a' | 'b' | 1] extends [string]
// 结果：never
```

**裸类型 vs 包裹类型：**

```ts
// 裸类型：直接使用 T
type Naked<T> = T extends number ? 'yes' : 'no'
type R1 = Naked<1 | 2 | 'a'>
// 分发：Naked<1> | Naked<2> | Naked<'a'>
// 结果：'yes' | 'yes' | 'no'
// 简化：'yes' | 'no'

// 包裹类型：T 被包裹在数组、元组或对象中
type Wrapped<T> = [T] extends [number] ? 'yes' : 'no'
type R2 = Wrapped<1 | 2 | 'a'>
// 不分发：[1 | 2 | 'a'] extends [number] ?
// 结果：'no'
```

### 4.2. 分发的条件

**满足分发的条件：**

1. 类型参数是裸露的（直接使用，未被包裹）
2. 在条件类型的 `extends` 左侧
3. 作用于联合类型

```ts
// 条件 1：裸类型参数
type Check1<T> = T extends string ? true : false // ✅ 会分发

// 条件 2：在 extends 左侧
type Check2<T> = string extends T ? true : false // ❌ 不会分发（T 在右侧）

// 条件 3：作用于联合类型
type R1 = Check1<string | number> // ✅ 分发
type R2 = Check1<string> // ✅ 不分发（不是联合类型，但结果相同）
```

**更多示例：**

```ts
// ✅ 会分发
type Test1<T> = T extends any ? T[] : never
type R1 = Test1<string | number> // string[] | number[]

// ❌ 不会分发 - T 被包裹
type Test2<T> = { value: T } extends { value: string } ? T : never
type R2 = Test2<string | number> // never

// ❌ 不会分发 - T 在右侧
type Test3<T> = string extends T ? T : never
type R3 = Test3<string | number> // string | number（没有过滤效果）
```

### 4.3. 阻止分发

有时我们希望将联合类型作为整体处理，需要阻止分发。

**方法 1：使用元组包裹**

```ts
type NoDistribute<T> = [T] extends [any] ? T : never

type T1 = NoDistribute<string | number>
// 结果：string | number (保持原样)

// 应用：创建联合类型数组
type UnionToArray<T> = [T] extends [any] ? T[] : never
type Arr = UnionToArray<string | number>
// 结果：(string | number)[]
// 而不是：string[] | number[]
```

**方法 2：使用对象包裹**

```ts
type NoDistribute<T> = { value: T } extends { value: any } ? T : never

type T2 = NoDistribute<string | number>
// 结果：string | number
```

**实际对比：**

```ts
// 分布式
type Distribute<T> = T extends any ? T[] : never
type D1 = Distribute<'a' | 'b'> // 'a'[] | 'b'[]

// 非分布式
type NonDistribute<T> = [T] extends [any] ? T[] : never
type D2 = NonDistribute<'a' | 'b'> // ('a' | 'b')[]

// 使用
const d1: D1 = ['a'] // ✅ 只包含 'a'
const d2: D2 = ['a', 'b'] // ✅ 可以混合
const d3: D1 = ['a', 'b'] // ❌ 错误：类型不匹配
```

## 5. 🤔 分布式条件类型的实际应用

### 5.1. Exclude 和 Extract

**Exclude 的实现：**

```ts
type MyExclude<T, U> = T extends U ? never : T

// 使用
type T1 = MyExclude<'a' | 'b' | 'c', 'a'> // 'b' | 'c'
type T2 = MyExclude<string | number, string> // number

// 分发过程：
// MyExclude<'a' | 'b' | 'c', 'a'>
// → MyExclude<'a', 'a'> | MyExclude<'b', 'a'> | MyExclude<'c', 'a'>
// → never | 'b' | 'c'
// → 'b' | 'c'
```

**Extract 的实现：**

```ts
type MyExtract<T, U> = T extends U ? T : never

// 使用
type T3 = MyExtract<'a' | 'b' | 'c', 'a' | 'c'> // 'a' | 'c'
type T4 = MyExtract<string | number, string> // string

// 分发过程：
// MyExtract<'a' | 'b' | 'c', 'a' | 'c'>
// → MyExtract<'a', 'a' | 'c'> | MyExtract<'b', 'a' | 'c'> | MyExtract<'c', 'a' | 'c'>
// → 'a' | never | 'c'
// → 'a' | 'c'
```

### 5.2. NonNullable

```ts
type MyNonNullable<T> = T extends null | undefined ? never : T

// 使用
type T1 = MyNonNullable<string | null | undefined> // string
type T2 = MyNonNullable<number | null> // number
type T3 = MyNonNullable<boolean | undefined> // boolean

// 分发过程：
// MyNonNullable<string | null | undefined>
// → MyNonNullable<string> | MyNonNullable<null> | MyNonNullable<undefined>
// → string | never | never
// → string
```

### 5.3. 过滤联合类型

**提取函数类型：**

```ts
type ExtractFunction<T> = T extends (...args: any[]) => any ? T : never

type Mixed = string | number | (() => void) | ((x: number) => string)
type Funcs = ExtractFunction<Mixed>
// type Funcs = (() => void) | ((x: number) => string)
```

**提取对象类型：**

```ts
type ExtractObject<T> = T extends object ? T : never

type Mixed = string | number | { id: number } | { name: string }
type Objects = ExtractObject<Mixed>
// type Objects = { id: number } | { name: string }
```

**按属性过滤：**

```ts
type ExtractWithId<T> = T extends { id: any } ? T : never

type Items =
  | { id: number; name: string }
  | { name: string }
  | { id: string; value: number }
  | string

type WithId = ExtractWithId<Items>
// type WithId = { id: number; name: string } | { id: string; value: number }
```

## 6. 🤔 分布式条件类型的高级技巧

### 6.1. 条件分发与映射类型

```ts
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never
}[keyof T]

interface Example {
  name: string
  age: number
  getName(): string
  setAge(age: number): void
}

type FuncKeys = FunctionPropertyNames<Example>
// type FuncKeys = 'getName' | 'setAge'
```

### 6.2. 保留联合类型结构

```ts
// 为联合类型的每个成员添加属性
type AddTimestamp<T> = T extends any ? T & { timestamp: number } : never

type Data = { name: string } | { age: number }
type WithTimestamp = AddTimestamp<Data>
// type WithTimestamp =
//   | { name: string; timestamp: number }
//   | { age: number; timestamp: number }
```

### 6.3. 复杂类型转换

**深度可选：**

```ts
type DeepPartial<T> = T extends object
  ? T extends (infer U)[]
    ? DeepPartial<U>[]
    : { [K in keyof T]?: DeepPartial<T[K]> }
  : T

interface Nested {
  user: {
    profile: {
      name: string
      age: number
    }
  }
  tags: string[]
}

type PartialNested = DeepPartial<Nested>
// type PartialNested = {
//   user?: {
//     profile?: {
//       name?: string;
//       age?: number;
//     };
//   };
//   tags?: string[];
// }
```

**提取所有 Promise 值类型：**

```ts
type AwaitedUnion<T> = T extends Promise<infer U> ? U : T

type Promises = Promise<string> | Promise<number> | boolean
type Values = AwaitedUnion<Promises>
// type Values = string | number | boolean
```

## 7. 🤔 分布式条件类型有哪些注意事项？

**1. never 的特殊行为**

```ts
type Test<T> = T extends string ? true : false

// never 是空联合类型，分发后仍然是 never
type R1 = Test<never> // never (而不是 false)

// 解决：使用元组包裹
type TestFixed<T> = [T] extends [string] ? true : false
type R2 = TestFixed<never> // false
```

**2. 分发与 infer 的交互**

```ts
// 分发会影响 infer 的推断
type UnboxArray<T> = T extends (infer U)[] ? U : T

type T1 = UnboxArray<string[] | number[]>
// 分发：UnboxArray<string[]> | UnboxArray<number[]>
// 结果：string | number

// 不分发
type UnboxArrayNonDist<T> = [T] extends [(infer U)[]] ? U : T
type T2 = UnboxArrayNonDist<string[] | number[]>
// 结果：string[] | number[] (没有展开)
```

**3. 联合类型的扁平化**

```ts
// 分发会自动扁平化联合类型
type Flatten<T> = T extends any ? T : never

type T1 = Flatten<(string | number) | boolean>
// 结果：string | number | boolean (已扁平化)
```

**4. 与对象类型的交互**

```ts
// 对象类型不会自动分发
type Test<T> = T extends { value: infer V } ? V : never

type T1 = Test<{ value: string } | { value: number }>
// 分发：Test<{ value: string }> | Test<{ value: number }>
// 结果：string | number

// 但整个对象作为联合不会分发内部属性
type T2 = { value: string | number }
type R = Test<T2> // string | number (value 的联合类型)
```

**5. 性能考虑**

```ts
// ❌ 不好：复杂的分发可能影响性能
type Complex<T> = T extends A
  ? T extends B
    ? T extends C
      ? TypeA
      : TypeB
    : TypeC
  : TypeD

// ✅ 好：简化逻辑
type Simplified<T> = T extends A & B & C
  ? TypeA
  : T extends A & B
  ? TypeB
  : T extends A
  ? TypeC
  : TypeD
```

**6. 避免意外分发**

```ts
// 如果不想要分发，记得包裹
type UnionToTuple<T> = [T] extends [never] ? [] : [T] // ⚠️ 这里仍然会分发

// 正确：完全阻止分发
type UnionToTupleSafe<T> = [T] extends [never] ? [] : [[T]] // 使用嵌套包裹
```

## 8. 🔗 引用

- [TypeScript Handbook - Distributive Conditional Types][1]
- [TypeScript Handbook - Conditional Types][2]
- [TypeScript PR #21316 - Conditional Types][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
[2]: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
[3]: https://github.com/microsoft/TypeScript/pull/21316
