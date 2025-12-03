# [0196. 模板字面量类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0196.%20%E6%A8%A1%E6%9D%BF%E5%AD%97%E9%9D%A2%E9%87%8F%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 模板字面量类型是什么？](#3--模板字面量类型是什么)
- [4. 🆚 模板字面量类型 vs 模板字符串](#4--模板字面量类型-vs-模板字符串)
- [5. 🤔 模板字面量类型和联合类型的会如何组合？](#5--模板字面量类型和联合类型的会如何组合)
- [6. 🤔 模板字面量类型中的 `string` 类型有什么特殊性？](#6--模板字面量类型中的-string-类型有什么特殊性)
- [7. 🤔 模板字面量类型都有哪些高级用法？](#7--模板字面量类型都有哪些高级用法)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 模板字面量类型的基本概念和语法
- 与 JS 模板字符串对比
- 与联合类型的组合

## 2. 🫧 评价

TS 4.1+ 引入了模板字面量类型，它是类型系统中进行字符串操作的强大工具，有不少高级用法。

## 3. 🤔 模板字面量类型是什么？

模板字面量类型（Template Literal Types）使用反引号 ` 语法，从写法上看，类似于 JS 中的的模板字符串语法。

- 模板字面量类型使用反引号语法创建基于字符串的类型
- 支持 Intrinsic String Manipulation Types（内置字符串操作类型） `Uppercase`、`Lowercase`、`Capitalize`、`Uncapitalize`
- 可以与联合类型自动组合，生成所有可能的字符串组合
- 支持字符串模式匹配和类型推断
- 在键名重映射、API 类型定义等场景非常有用

```ts
// 基本语法：`string ${Type} string`

type World = 'world'
type Greeting = `hello ${World}` // 'hello world'

// 使用类型参数
type MakeGreeting<T extends string> = `hello ${T}`
type G1 = MakeGreeting<'world'> // 'hello world'
type G2 = MakeGreeting<'TypeScript'> // 'hello TypeScript'

// 插入类型：
type EmailAddress<User extends string> = `${User}@example.com`

type JohnEmail = EmailAddress<'john'> // 'john@example.com'
type JaneEmail = EmailAddress<'jane'> // 'jane@example.com'

// 多个插值：
type Path<Root extends string, Sub extends string> = `${Root}/${Sub}`

type ApiPath = Path<'api', 'users'> // 'api/users'
type DocsPath = Path<'docs', 'guide'> // 'docs/guide'

// 递归实现任意数量的插值：
type Join<T extends string[], D extends string = '/'> = T extends []
  ? ''
  : T extends [infer F]
  ? F
  : T extends [infer F, ...infer R]
  ? F extends string
    ? `${F}${D}${Join<Extract<R, string[]>, D>}`
    : never
  : string

type ApiPath2 = Join<['api', 'users', 'profile']> // 'api/users/profile'
type DeepPath2 = Join<['a', 'b', 'c', 'd', 'e']> // 'a/b/c/d/e'
```

## 4. 🆚 模板字面量类型 vs 模板字符串

- 模板字面量类型是编译时 TS 类型层面的概念
- 模板字符串是运行时 JS 值层面的概念

```ts
// 类型级别：编译时
type Pattern = `get${string}` // 匹配所有以 'get' 开头的字符串

// 值级别：运行时
const pattern = `get${Math.random()}` // 生成实际字符串

// 结合使用
function validateMethod(method: Pattern) {
  console.log(`Calling ${method}`)
}

validateMethod('getName') // ✅ OK
validateMethod('setName') // ❌ Error
// Argument of type '"setName"' is not assignable to parameter of type '`get${string}`'.(2345)
```

## 5. 🤔 模板字面量类型和联合类型的会如何组合？

模板字面量类型与联合类型结合会生成所有可能的组合。

```ts
// 多个联合类型的组合
type Size = 'small' | 'medium' | 'large'
type Color = 'red' | 'blue'
type ClassNames = `${Size}-${Color}`
// type ClassNames = 'small-red'  | 'small-blue'  |
//                   'medium-red' | 'medium-blue' |
//                   'large-red'  | 'large-blue'

// 应用示例 -> 生成 CSS 类名：
type Breakpoint = 'sm' | 'md' | 'lg'
type Property = 'flex' | 'grid'
type ResponsiveClass = `${Breakpoint}:${Property}`
// type ResponsiveClass = 'sm:flex' | 'sm:grid' |
//                        'md:flex' | 'md:grid' |
//                        'lg:flex' | 'lg:grid'
```

也可以结合字符串工具类型一起使用。

```ts
type Direction = 'top' | 'right' | 'bottom' | 'left'
type Margin = `margin${Capitalize<Direction>}`
// type Margin = 'marginTop' | 'marginRight' | 'marginBottom' | 'marginLeft'
```

## 6. 🤔 模板字面量类型中的 `string` 类型有什么特殊性？

模板字面量类型中的 `string` 类型用于表示任意字符串内容，这一特性常用于约束前缀后缀啥的。

```ts
type Test1 = `prefix-${string}` // 匹配所有 'prefix-' 开头的字符串
type Test2 = `${string}-suffix` // 匹配所有 '-suffix' 结尾的字符串

// 注意：不是字面量联合
const s1: Test1 = 'prefix-anything' // ✅ OK
const s2: Test2 = 'anything-suffix' // ✅ OK

const s3: Test1 = '123' // ❌ Error
// Type '"123"' is not assignable to type '`prefix-${string}`'.(2322)
```

## 7. 🤔 模板字面量类型都有哪些高级用法？

1. 字符串推断 -> 使用 `infer` 从模板字面量类型中提取部分
2. 递归模板类型
3. …… （还有很多其他高级用法，都不是很常用，能读懂即可）

::: code-group

```ts [1]
// 提取前缀后的内容
type RemovePrefix<
  S extends string,
  Prefix extends string
> = S extends `${Prefix}${infer Rest}` ? Rest : S

type WithoutGet = RemovePrefix<'getName', 'get'> // 'Name'
type WithoutSet = RemovePrefix<'setAge', 'set'> // 'Age'

// 提取后缀前的内容
type RemoveSuffix<
  S extends string,
  Suffix extends string
> = S extends `${infer Rest}${Suffix}` ? Rest : S

type WithoutHandler = RemoveSuffix<'clickHandler', 'Handler'> // 'click'

// 提取路径参数
type ExtractRouteParams<Route extends string> =
  Route extends `${string}/:${infer Param}/${infer Rest}`
    ? Param | ExtractRouteParams<`/${Rest}`>
    : Route extends `${string}/:${infer Param}`
    ? Param
    : never

type Params = ExtractRouteParams<'/users/:id/posts/:postId'>
// type Params = 'id' | 'postId'
```

```ts [2]
// 字符串反转
type Reverse<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${Reverse<Rest>}${First}`
  : S

type R1 = Reverse<'hello'> // 'olleh'
type R2 = Reverse<'abc'> // 'cba'

// 移除所有空格
type TrimSpaces<S extends string> = S extends ` ${infer Rest}`
  ? TrimSpaces<Rest>
  : S extends `${infer Rest} `
  ? TrimSpaces<Rest>
  : S

type T1 = TrimSpaces<'  hello  '> // 'hello'
```

:::

## 8. 🔗 引用

- [TypeScript 4.1 Release Notes - Template Literal Types][1]
- [TypeScript Handbook - Template Literal Types][2]
- [TypeScript 4.1 Release Notes - Intrinsic String Manipulation Types][3]

[1]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#template-literal-types
[2]: https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html
[3]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#intrinsic-string-manipulation-types
