# [0108. 类型工具](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0108.%20%E7%B1%BB%E5%9E%8B%E5%B7%A5%E5%85%B7)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🔍 章节速览](#3--章节速览)
- [4. 🤔 TS 内置的工具类型本质上是类型别名（Type Alias）还是接口（interface）？](#4--ts-内置的工具类型本质上是类型别名type-alias还是接口interface)
- [5. 🤔 TS 内置的类型工具（Utility Types）都有哪些？](#5--ts-内置的类型工具utility-types都有哪些)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 类型工具

## 2. 🫧 评价

类型工具是实际开发中常用的一种工具，用于对类型进行转换、过滤、映射等操作，TS 提供了一些内置的工具类型，如 `Partial`、`Required`、`Pick`、`Omit`、`Record` 等，也支持根据需求自定义工具类型。

## 3. 🔍 章节速览

<N :ids="['0205', '0206', '0207', '0208', '0209', '0210', '0211', '0212', '0213', '0214', '0215', '0216', '0217', '0218', '0219', '0220', '0221']" />

## 4. 🤔 TS 内置的工具类型本质上是类型别名（Type Alias）还是接口（interface）？

TS 内置的工具类型（如 `Record`、`Partial`、`Pick` 等）本质上是类型别名（Type Alias），而不是接口。

它们使用 `type` 关键字定义，结合了泛型、映射类型、条件类型等高级类型特性来实现类型转换，对于复杂的类型转换，`type` 更加灵活。

| 对比项   | 说明                                                |
| -------- | --------------------------------------------------- |
| 映射类型 | `interface` 不支持映射类型语法（`[K in keyof T]`）  |
| 条件类型 | `interface` 不支持条件类型（`T extends U ? X : Y`） |
| 联合类型 | `interface` 无法表示联合类型                        |
| 类型运算 | `type` 可以进行复杂的类型运算和组合                 |

## 5. 🤔 TS 内置的类型工具（Utility Types）都有哪些？

目前 `25.12` TS 的最新版是：`v5.9`，有以下内置的工具类型：

- `Awaited<Type>`
- `Partial<Type>`
- `Required<Type>`
- `Readonly<Type>`
- `Record<Keys, Type>`
- `Pick<Type, Keys>`
- `Omit<Type, Keys>`
- `Exclude<UnionType, ExcludedMembers>`
- `Extract<Type, Union>`
- `NonNullable<Type>`
- `Parameters<Type>`
- `ConstructorParameters<Type>`
- `ReturnType<Type>`
- `InstanceType<Type>`
- `NoInfer<Type>`
- `ThisParameterType<Type>`
- `OmitThisParameter<Type>`
- `ThisType<Type>`
- Intrinsic String Manipulation Types 内置字符串操作类型
  - `Uppercase<StringType>`
  - `Lowercase<StringType>`
  - `Capitalize<StringType>`
  - `Uncapitalize<StringType>`
