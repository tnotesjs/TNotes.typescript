# [0116. 泛型函数](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0116.%20%E6%B3%9B%E5%9E%8B%E5%87%BD%E6%95%B0)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是泛型函数？](#3--什么是泛型函数)
- [4. 🆚 泛型函数 vs 普通函数](#4--泛型函数-vs-普通函数)
- [5. 🤔 如何使用类型别名 `type`、接口 `interface` 声明泛型函数的类型？](#5--如何使用类型别名-type接口-interface-声明泛型函数的类型)
- [6. 🔗 引用](#6--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 泛型函数的定义和语法

## 2. 🫧 评价

泛型函数（Generic Function）是使用类型参数的函数，可以在调用时显式指定具体类型，也可以通过传入的数据来自动完成类型推断，主要作用是利用“类型变量”将函数内部“多个位置”的类型关联起来。

## 3. 🤔 什么是泛型函数？

泛型函数使用类型参数，可以处理多种类型的数据并保持类型安全。

- 类型参数：`<T>` 是类型占位符
- 类型推断：通常 TS 能根据传入的参数自动推断类型参数，无需显式传入类型
- 类型安全：编译时检查类型一致性，类型错误在编译时就能发现
- 代码复用：一个函数适用于多种类型，避免重复编写相似函数，适应多种类型的场景

```ts
// ❌ 没有泛型：丢失类型信息
function identityAny(arg: any): any {
  return arg
}

const result1 = identityAny(42) // any 类型
const result2 = identityAny('hello') // any 类型

// ✅ 使用泛型：保持类型
function identity<T>(arg: T): T {
  return arg
}

const num = identity(42) //  字面量 42 类型
let num2 = identity(42) // number 类型
const str = identity('hello') //  字面量 'hello' 类型
let str2 = identity('hello') // string 类型
const arr = identity([1, 2, 3]) // number[] 类型
```

基本写法：

1. 函数声明式写法
2. 箭头函数式写法

::: code-group

```ts [1]
// 函数声明语法
function identity<T>(arg: T): T {
  return arg
}

// 调用方式 1：显式指定类型
let result1 = identity<string>('hello')

// 调用方式 2：类型推断（推荐）
let result2 = identity('hello') // 自动推断为 string

// 上述两种调用的写法是等效的，推荐更加简洁的写法 2
```

```ts [2]
const identity1 = <T extends unknown>(arg: T): T => {
  return arg
}

const identity2: <T extends unknown>(arg: T) => T = (arg) => {
  return arg
}

const identity3 = <T, _>(arg: T): T => {
  return arg
}

const identity4: <T, _>(arg: T) => T = (arg) => {
  return arg
}

// ⚠️ 注意：
// 在 .tsx 文件中，为了避免箭头函数的泛型 <T> 避免被识别为 JSX 标签
// 有两种常见的解决方案：
// 1. 加逗号 <T,> 这是最常用的技巧，能强制编译器将其识别为泛型。
//    同时需要注意格式化插件的配置，比如 prettier 在格式化之后，可能会自动将 <T,> 格式化为 <T>
//    或者你也可以写成 <T,_> 这样的形式，_ 在这里也是一个泛型参数，唯一的作用就是为了避免箭头函数的泛型 <T> 避免被识别为 JSX 标签
// 2. 添加 extends 约束：写成 <T extends unknown>，也能消除歧义。

// ❌ 可能存在问题的写法示例：
/* 
const identity5 = <T>(arg: T): T => {
  return arg
}

const identity6: <T>(arg: T) => T = (arg) => {
  return arg
}

上述写法会报错：
Cannot find name 'T'.(2304)
This JSX tag requires 'React' to be in scope, but it could not be found.(2874)
JSX element 'T' has no corresponding closing tag.(17008)
 */
```

:::

## 4. 🆚 泛型函数 vs 普通函数

| 特性 | 泛型函数 | 普通函数 |
| --- | --- | --- |
| 类型灵活性 | 高（支持多种类型） | 低（仅支持特定类型） |
| 类型关联 | 高（可以通过传入的参数自动推断泛型的具体类型，还可以在函数内部的多个位置利用泛型来保持类型的统一） | 低（每个位置的泛型需要独立约束） |
| 代码复用 | 高（一套逻辑适用于多种类型） | 低（不同类型需重复编写或使用重载） |
| 类型安全 | 高（编译时检查，且保留具体类型） | 中（若使用 `any` 模拟通用性则不安全） |

## 5. 🤔 如何使用类型别名 `type`、接口 `interface` 声明泛型函数的类型？

1. 类型别名中的泛型函数
2. 接口中的泛型函数

::: code-group

```ts [1]
// 泛型函数类型
type IdentityFn = <T>(arg: T) => T

const identity: IdentityFn = (arg) => arg

let num = identity(42) // number
let str = identity('hello') // string
```

```ts [2]
// 接口定义泛型函数
interface GenericIdentityFn {
  <T>(arg: T): T
}

const identity: GenericIdentityFn = (arg) => arg

// 接口本身是泛型
interface GenericIdentityFn2<T> {
  (arg: T): T
}

const numberIdentity: GenericIdentityFn2<number> = (arg) => arg
const stringIdentity: GenericIdentityFn2<string> = (arg) => arg
```

:::

## 6. 🔗 引用

- [TypeScript Handbook - Generics][1]
- [TypeScript Handbook - More on Functions][2]
- [TypeScript Deep Dive - Generics][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/generics.html
[2]: https://www.typescriptlang.org/docs/handbook/2/functions.html
[3]: https://basarat.gitbook.io/typescript/type-system/generics
