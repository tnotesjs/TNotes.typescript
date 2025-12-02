# [0278. 类型体操](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0278.%20%E7%B1%BB%E5%9E%8B%E4%BD%93%E6%93%8D)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 常见类型体操模式？](#3--常见类型体操模式)
  - [3.1. 模式匹配](#31-模式匹配)
  - [3.2. 条件类型递归](#32-条件类型递归)
  - [3.3. 映射类型](#33-映射类型)
- [4. 🤔 字符串操作类型？](#4--字符串操作类型)
  - [4.1. 字符串拆分和拼接](#41-字符串拆分和拼接)
  - [4.2. 字符串模式匹配](#42-字符串模式匹配)
- [5. 🤔 数组和元组操作？](#5--数组和元组操作)
  - [5.1. 数组操作](#51-数组操作)
  - [5.2. 元组操作](#52-元组操作)
- [6. 🤔 对象类型转换？](#6--对象类型转换)
  - [6.1. 键值转换](#61-键值转换)
  - [6.2. 深度操作](#62-深度操作)
- [7. 🤔 类型挑战实践？](#7--类型挑战实践)
  - [7.1. Easy 难度](#71-easy-难度)
  - [7.2. Medium 难度](#72-medium-难度)
  - [7.3. Hard 难度](#73-hard-难度)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 常见类型体操模式
- 字符串操作类型
- 数组和元组操作
- 对象类型转换
- 类型挑战实践

## 2. 🫧 评价

类型体操是 TypeScript 类型系统的高级应用，可以实现复杂的类型转换。

- 模式匹配是核心技巧
- 递归是常用策略
- 模板字面量类型提供字符串操作能力
- 条件类型实现类型级别的逻辑
- type-challenges 是很好的练习资源

## 3. 🤔 常见类型体操模式？

掌握基本模式是类型体操的基础。

### 3.1. 模式匹配

```ts
// ✅ 提取数组第一个元素类型
type First<T extends any[]> = T extends [infer F, ...any[]] ? F : never

type Test1 = First<[1, 2, 3]> // 1
type Test2 = First<[]> // never

// ✅ 提取数组最后一个元素类型
type Last<T extends any[]> = T extends [...any[], infer L] ? L : never

type Test3 = Last<[1, 2, 3]> // 3

// ✅ 提取函数返回类型
type MyReturnType<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => infer R
  ? R
  : never

function fn() {
  return { a: 1, b: 2 }
}

type FnReturn = MyReturnType<typeof fn> // { a: number; b: number }
```

### 3.2. 条件类型递归

```ts
// ✅ 深度展开 Promise
type Awaited<T> = T extends Promise<infer U>
  ? Awaited<U> // 递归展开嵌套的 Promise
  : T

type Test4 = Awaited<Promise<string>> // string
type Test5 = Awaited<Promise<Promise<number>>> // number

// ✅ 递归计算数组长度
type LengthOfTuple<T extends any[]> = T['length']

type Arr = [1, 2, 3]
type Len = LengthOfTuple<Arr> // 3
```

### 3.3. 映射类型

```ts
// ✅ 自定义 Readonly
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K]
}

// ✅ 深度 Readonly
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}

interface Nested {
  a: {
    b: {
      c: number
    }
  }
}

type ReadonlyNested = DeepReadonly<Nested>
// {
//   readonly a: {
//     readonly b: {
//       readonly c: number;
//     };
//   };
// }
```

## 4. 🤔 字符串操作类型？

模板字面量类型支持字符串级别的操作。

### 4.1. 字符串拆分和拼接

```ts
// ✅ 首字母大写
type Capitalize<S extends string> = S extends `${infer F}${infer R}`
  ? `${Uppercase<F>}${R}`
  : S

type Test6 = Capitalize<'hello'> // "Hello"

// ✅ 驼峰转连字符
type KebabCase<S extends string> = S extends `${infer F}${infer R}`
  ? R extends Uncapitalize<R>
    ? `${Lowercase<F>}${KebabCase<R>}`
    : `${Lowercase<F>}-${KebabCase<Uncapitalize<R>>}`
  : S

type Test7 = KebabCase<'fooBarBaz'> // "foo-bar-baz"

// ✅ 连字符转驼峰
type CamelCase<S extends string> = S extends `${infer F}-${infer R}`
  ? `${F}${Capitalize<CamelCase<R>>}`
  : S

type Test8 = CamelCase<'foo-bar-baz'> // "fooBarBaz"
```

### 4.2. 字符串模式匹配

```ts
// ✅ 提取路由参数
type ExtractRouteParams<T extends string> =
  T extends `${infer _Start}:${infer Param}/${infer Rest}`
    ? Param | ExtractRouteParams<`/${Rest}`>
    : T extends `${infer _Start}:${infer Param}`
    ? Param
    : never

type Params = ExtractRouteParams<'/users/:id/posts/:postId'>
// "id" | "postId"

// ✅ 替换字符串
type Replace<
  S extends string,
  From extends string,
  To extends string
> = S extends `${infer Prefix}${From}${infer Suffix}`
  ? `${Prefix}${To}${Suffix}`
  : S

type Test9 = Replace<'hello world', 'world', 'typescript'>
// "hello typescript"

// ✅ 全部替换
type ReplaceAll<
  S extends string,
  From extends string,
  To extends string
> = S extends `${infer Prefix}${From}${infer Suffix}`
  ? `${Prefix}${To}${ReplaceAll<Suffix, From, To>}`
  : S

type Test10 = ReplaceAll<'foo bar foo baz foo', 'foo', 'qux'>
// "qux bar qux baz qux"
```

## 5. 🤔 数组和元组操作？

数组类型的各种转换操作。

### 5.1. 数组操作

```ts
// ✅ 移除数组中的某个类型
type Exclude<T, U> = T extends U ? never : T

type Filter<Arr extends any[], Item> = Arr extends [infer F, ...infer R]
  ? F extends Item
    ? Filter<R, Item>
    : [F, ...Filter<R, Item>]
  : []

type Test11 = Filter<[1, 'a', 2, 'b', 3], string> // [1, 2, 3]

// ✅ 数组展平
type Flatten<T extends any[]> = T extends [infer F, ...infer R]
  ? F extends any[]
    ? [...Flatten<F>, ...Flatten<R>]
    : [F, ...Flatten<R>]
  : []

type Test12 = Flatten<[1, [2, 3], [4, [5, 6]]]> // [1, 2, 3, 4, 5, 6]

// ✅ 数组去重
type Unique<T extends any[], Result extends any[] = []> = T extends [
  infer F,
  ...infer R
]
  ? F extends Result[number]
    ? Unique<R, Result>
    : Unique<R, [...Result, F]>
  : Result

type Test13 = Unique<[1, 2, 1, 3, 2, 4]> // [1, 2, 3, 4]
```

### 5.2. 元组操作

```ts
// ✅ 元组转联合
type TupleToUnion<T extends any[]> = T[number]

type Test14 = TupleToUnion<[1, 2, 3]> // 1 | 2 | 3

// ✅ 元组反转
type Reverse<T extends any[]> = T extends [infer F, ...infer R]
  ? [...Reverse<R>, F]
  : []

type Test15 = Reverse<[1, 2, 3]> // [3, 2, 1]

// ✅ 元组拼接
type Concat<T extends any[], U extends any[]> = [...T, ...U]

type Test16 = Concat<[1, 2], [3, 4]> // [1, 2, 3, 4]
```

## 6. 🤔 对象类型转换？

复杂的对象类型操作。

### 6.1. 键值转换

```ts
// ✅ 获取所有必需键
type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T]

interface User {
  name: string
  age: number
  email?: string
}

type Required1 = RequiredKeys<User> // "name" | "age"

// ✅ 获取所有可选键
type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never
}[keyof T]

type Optional = OptionalKeys<User> // "email"

// ✅ 互换键值
type Flip<T extends Record<string, string | number | symbol>> = {
  [K in keyof T as T[K]]: K
}

type Status = {
  pending: 0
  success: 1
  error: 2
}

type StatusCode = Flip<Status>
// {
//   0: "pending";
//   1: "success";
//   2: "error";
// }
```

### 6.2. 深度操作

```ts
// ✅ 深度获取类型
type DeepGet<T, Path extends string> = Path extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? DeepGet<T[K], R>
    : never
  : Path extends keyof T
  ? T[Path]
  : never

interface Nested2 {
  a: {
    b: {
      c: number
    }
  }
}

type C = DeepGet<Nested2, 'a.b.c'> // number

// ✅ 深度设置类型
type DeepSet<
  T,
  Path extends string,
  Value
> = Path extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? Omit<T, K> & { [P in K]: DeepSet<T[K], R, Value> }
    : T
  : Path extends keyof T
  ? Omit<T, Path> & { [P in Path]: Value }
  : T

type Updated = DeepSet<Nested2, 'a.b.c', string>
// {
//   a: {
//     b: {
//       c: string;
//     };
//   };
// }
```

## 7. 🤔 类型挑战实践？

来自 type-challenges 的经典题目。

### 7.1. Easy 难度

```ts
// ✅ Pick 的实现
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}

// ✅ Readonly 的实现
type MyReadonly2<T> = {
  readonly [K in keyof T]: T[K]
}

// ✅ 元组转对象
type TupleToObject<T extends readonly (string | number | symbol)[]> = {
  [K in T[number]]: K
}

const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const
type Result = TupleToObject<typeof tuple>
// {
//   tesla: "tesla";
//   "model 3": "model 3";
//   "model X": "model X";
//   "model Y": "model Y";
// }
```

### 7.2. Medium 难度

```ts
// ✅ Promise 类型
type MyAwaited<T> = T extends Promise<infer U>
  ? U extends Promise<any>
    ? MyAwaited<U>
    : U
  : T

// ✅ 链式调用
type Chainable<T = {}> = {
  option<K extends string, V>(
    key: K extends keyof T ? never : K,
    value: V
  ): Chainable<T & { [P in K]: V }>
  get(): T
}

declare const config: Chainable

const result = config
  .option('foo', 123)
  .option('bar', 'hello')
  .option('baz', true)
  .get()

// result 的类型：
// {
//   foo: number;
//   bar: string;
//   baz: boolean;
// }

// ✅ 最后一个元素
type MyLast<T extends any[]> = T extends [...infer _, infer L] ? L : never

type Test17 = MyLast<[1, 2, 3]> // 3
```

### 7.3. Hard 难度

```ts
// ✅ 联合类型转交叉类型
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

type Test18 = UnionToIntersection<{ a: 1 } | { b: 2 }>
// { a: 1 } & { b: 2 }

// ✅ 字符串长度
type StringLength<
  S extends string,
  Acc extends any[] = []
> = S extends `${infer _}${infer R}`
  ? StringLength<R, [...Acc, any]>
  : Acc['length']

type Test19 = StringLength<'hello'> // 5

// ✅ 类型级 Fibonacci
type Fibonacci<
  N extends number,
  Current extends any[] = [1],
  Next extends any[] = [1],
  Index extends any[] = []
> = Index['length'] extends N
  ? Current['length']
  : Fibonacci<N, Next, [...Current, ...Next], [...Index, 1]>

type Test20 = Fibonacci<10> // 55
```

## 8. 🔗 引用

- [Type Challenges][1]
- [Template Literal Types][2]
- [Conditional Types][3]

[1]: https://github.com/type-challenges/type-challenges
[2]: https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html
[3]: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
