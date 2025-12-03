# [0196. 模板字面量类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0196.%20%E6%A8%A1%E6%9D%BF%E5%AD%97%E9%9D%A2%E9%87%8F%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 模板字面量类型是什么？](#3--模板字面量类型是什么)
- [4. 🤔 模板字面量类型的高级用法](#4--模板字面量类型的高级用法)
  - [4.1. 联合类型的组合](#41-联合类型的组合)
  - [4.2. 字符串推断](#42-字符串推断)
  - [4.3. 递归模板类型](#43-递归模板类型)
- [5. 🤔 模板字面量类型的实际应用](#5--模板字面量类型的实际应用)
  - [5.1. 事件处理器类型](#51-事件处理器类型)
  - [5.2. CSS 属性类型](#52-css-属性类型)
  - [5.3. 路由路径类型](#53-路由路径类型)
- [6. 🤔 模板字面量类型有哪些注意事项？](#6--模板字面量类型有哪些注意事项)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 模板字面量类型的基本概念和语法
- 内置字符串操作类型的使用
- 模板字面量类型的高级用法
- 模板字面量类型的实际应用场景
- 使用注意事项和最佳实践

## 2. 🫧 评价

这篇笔记详细介绍了 TypeScript 4.1+ 引入的模板字面量类型，这是类型系统中进行字符串操作的强大工具。

## 3. 🤔 模板字面量类型是什么？

模板字面量类型使用反引号 ` 语法，从写法上看，类似于 JS 中的的模板字符串语法。

- 模板字面量类型使用反引号语法创建基于字符串的类型
- 支持 `Uppercase`、`Lowercase`、`Capitalize`、`Uncapitalize` 内置操作
- 可以与联合类型结合生成所有可能的字符串组合
- 支持字符串模式匹配和类型推断
- 在键名重映射、API 类型定义等场景非常有用
- 是构建类型安全的字符串操作 API 的关键特性

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

对比 JS 模板字符串：

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

## 4. 🤔 模板字面量类型的高级用法

### 4.1. 联合类型的组合

模板字面量类型与联合类型结合会生成所有可能的组合。

```ts
type Direction = 'top' | 'right' | 'bottom' | 'left'
type Margin = `margin${Capitalize<Direction>}`
// type Margin = 'marginTop' | 'marginRight' | 'marginBottom' | 'marginLeft'

// 多个联合类型的组合
type Size = 'small' | 'medium' | 'large'
type Color = 'red' | 'blue'
type ClassNames = `${Size}-${Color}`
// type ClassNames = 'small-red' | 'small-blue' | 'medium-red' |
//                   'medium-blue' | 'large-red' | 'large-blue'
```

生成 CSS 类名：

```ts
type Breakpoint = 'sm' | 'md' | 'lg'
type Property = 'flex' | 'grid'
type ResponsiveClass = `${Breakpoint}:${Property}`
// type ResponsiveClass = 'sm:flex' | 'sm:grid' | 'md:flex' | 'md:grid' | 'lg:flex' | 'lg:grid'
```

### 4.2. 字符串推断

使用 `infer` 从模板字面量类型中提取部分。

```ts
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
```

提取路径参数：

```ts
type ExtractRouteParams<Route extends string> =
  Route extends `${infer Start}/:${infer Param}/${infer Rest}`
    ? Param | ExtractRouteParams<`/${Rest}`>
    : Route extends `${infer Start}/:${infer Param}`
    ? Param
    : never

type Params = ExtractRouteParams<'/users/:id/posts/:postId'>
// type Params = 'id' | 'postId'
```

### 4.3. 递归模板类型

```ts
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

## 5. 🤔 模板字面量类型的实际应用

### 5.1. 事件处理器类型

```ts
type EventName = 'click' | 'focus' | 'blur' | 'change'
type EventHandler<T extends EventName> = `on${Capitalize<T>}`

type Handlers = {
  [K in EventName as EventHandler<K>]: (event: Event) => void
}
// type Handlers = {
//   onClick: (event: Event) => void;
//   onFocus: (event: Event) => void;
//   onBlur: (event: Event) => void;
//   onChange: (event: Event) => void;
// }

// 使用
const handlers: Handlers = {
  onClick: (e) => console.log('clicked'),
  onFocus: (e) => console.log('focused'),
  onBlur: (e) => console.log('blurred'),
  onChange: (e) => console.log('changed'),
}
```

### 5.2. CSS 属性类型

```ts
type CSSUnit = 'px' | 'em' | 'rem' | '%'
type Size = `${number}${CSSUnit}`

interface Spacing {
  margin: Size
  padding: Size
}

const spacing: Spacing = {
  margin: '10px', // ✅
  padding: '2rem', // ✅
  // margin: '10'    // ❌ 错误
}

// CSS 属性变体
type Property = 'margin' | 'padding'
type Side = 'Top' | 'Right' | 'Bottom' | 'Left'
type CSSProperty = Property | `${Property}${Side}`
// type CSSProperty = 'margin' | 'padding' | 'marginTop' | 'marginRight' | ...
```

### 5.3. 路由路径类型

```ts
// 定义路由模式
type Route = '/users/:id' | '/posts/:postId/comments/:commentId'

// 提取路径参数
type ExtractParams<Path extends string> =
  Path extends `${infer _Start}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof ExtractParams<Rest>]: string }
    : Path extends `${infer _Start}:${infer Param}`
    ? { [K in Param]: string }
    : {}

type UserParams = ExtractParams<'/users/:id'>
// type UserParams = { id: string }

type CommentParams = ExtractParams<'/posts/:postId/comments/:commentId'>
// type CommentParams = { postId: string; commentId: string }
```

类型安全的路由函数：

```ts
declare function navigate<Path extends Route>(
  path: Path,
  params: ExtractParams<Path>
): void

// 使用
navigate('/users/:id', { id: '123' }) // ✅
navigate('/users/:id', { postId: '123' }) // ❌ 错误：类型不匹配
```

## 6. 🤔 模板字面量类型有哪些注意事项？

1. 类型数量爆炸

```ts
// ⚠️ 警告：联合类型组合会指数增长
type A = 'a' | 'b' | 'c' | 'd' | 'e'
type B = 'x' | 'y' | 'z'
type C = 'p' | 'q'

type Combined = `${A}-${B}-${C}`
// 生成 5 × 3 × 2 = 30 种组合

// 更多联合会导致类型检查变慢
// ❌ 避免过多组合
type TooMany = `${A}-${B}-${C}-${A}-${B}` // 5×3×2×5×3 = 450 种组合
```

2. string 类型的特殊性

```ts
// string 类型在模板中的行为
type Test1 = `prefix-${string}` // 匹配所有 'prefix-' 开头的字符串
type Test2 = `${string}-suffix` // 匹配所有 '-suffix' 结尾的字符串

// 注意：不是字面量联合
const s1: Test1 = 'prefix-anything' // ✅
const s2: Test1 = 'prefix-xyz' // ✅
```

3. 推断的限制

```ts
// infer 只能捕获字符串字面量
type Extract<S> = S extends `${infer A}-${infer B}` ? A : never

type R1 = Extract<'hello-world'> // 'hello'
type R2 = Extract<string> // string (无法精确推断)
```

4. 递归深度限制

```ts
// ❌ 递归太深可能导致错误
type DeepRecursive<S extends string, N extends number = 50> = N extends 0
  ? S
  : S extends `${infer First}${infer Rest}`
  ? `${First}${DeepRecursive<Rest /* N-1 */>}`
  : S

// ✅ 添加深度限制
type SafeRecursive<S extends string> = S extends `${infer First}${infer Rest}`
  ? Rest extends ``
    ? First
    : `${First}${SafeRecursive<Rest>}`
  : S
```

5. 类型检查性能

```ts
// ❌ 不好：复杂的嵌套模板类型
type Complex<T> = T extends `${infer A}_${infer B}_${infer C}_${infer D}`
  ? /* 复杂处理 */
  : never;

// ✅ 好：简化逻辑
type Simplified<T> = T extends `${infer First}_${infer Rest}`
  ? { first: First; rest: Rest }
  : never;
```

6. 与其他类型特性的结合

```ts
// 结合映射类型
type PropGetters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
}

interface User {
  name: string
  age: number
}

type UserGetters = PropGetters<User>
// type UserGetters = {
//   getName: () => string;
//   getAge: () => number;
// }

// 注意：需要 string & K 确保 K 是字符串类型
```

## 7. 🔗 引用

- [TypeScript 4.1 Release Notes - Template Literal Types][1]
- [TypeScript Handbook - Template Literal Types][2]
- [TypeScript 4.1 Release Notes - Intrinsic String Manipulation Types][3]

[1]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#template-literal-types
[2]: https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html
[3]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#intrinsic-string-manipulation-types
