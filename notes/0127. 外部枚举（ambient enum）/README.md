# [0127. 外部枚举（ambient enum）](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0127.%20%E5%A4%96%E9%83%A8%E6%9E%9A%E4%B8%BE%EF%BC%88ambient%20enum%EF%BC%89)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🔍 TS 官方对 Ambient enums 的介绍](#3--ts-官方对-ambient-enums-的介绍)
- [4. 🤔 外部枚举是什么？](#4--外部枚举是什么)
- [5. 🆚 `declare const enum` vs `const enum`](#5--declare-const-enum-vs-const-enum)
- [6. 🤔 使用外部枚举的主要场景是什么？](#6--使用外部枚举的主要场景是什么)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 外部枚举（ambient enum）的概念
- declare const enum 和 const enum 的差异

## 2. 🫧 评价

外部枚举是 TypeScript 中用于描述“存在于运行时但由外部提供”的枚举类型声明，它不产生运行时代码，只为类型系统提供信息。

## 3. 🔍 TS 官方对 Ambient enums 的介绍

Ambient enums - 外部枚举

Ambient enums are used to describe the shape of already existing enum types.

外部枚举用于描述已存在枚举类型的形态。

```ts
declare enum Enum {
  A = 1,
  B, // 不会自动自增
  C = 2,
}
```

One important difference between ambient and non-ambient enums is that, in regular enums, members that don’t have an initializer will be considered constant if its preceding enum member is considered constant. By contrast, an ambient (and non-const) enum member that does not have an initializer is always considered computed.

外部枚举与非外部枚举的一个重要区别在于：在常规枚举中，若前置枚举成员被视作常量，则没有初始化器的成员也会被视为常量。相比之下，在外部（且非常量）枚举中，没有初始化器的成员始终被视为需计算值。

## 4. 🤔 外部枚举是什么？

外部枚举（ambient enum）使用 declare 修饰，表示枚举的实现由外部提供（例如运行时 JS）。TS 只保留类型信息，不生成对应的 JS 枚举对象。

- 在 .d.ts 中声明外部枚举时非常有用
- 需确保依赖运行时存在真实值，否则可能会导致运行时异常

适用场景：为已存在的 JS 枚举或第三方库编写类型声明，或在声明文件中暴露枚举类型而不生成实现。

```ts
// 类型层面的声明（不生成 JS）
declare enum Status {
  Ok = 0,
  Error = 1,
}
// declare 表示“已存在的运行时值”
// TypeScript 使用这些声明进行类型检查，但不会输出枚举实现
// 若运行时不存在对应对象，会报错
```

基本语法

1. declare enum
2. declare const enum

::: code-group

```ts [1]
// .d.ts 或声明文件中
declare enum LogLevel {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3,
}

// 使用处（编译时类型安全），但不会生成 LogLevel 对象
function log(level: LogLevel, msg: string) {
  // 依赖运行时有对应实现
  // 比如全局 JS 已经定义了 LogLevel 对象
}
```

```ts [2]
// 声明为 const enum（编译器会把引用处内联为字面量，且不生成对象）
declare const enum Direction {
  Up = 0,
  Down = 1,
  Left = 2,
  Right = 3,
}

// 调用处会被内联为数字字面量（取决于编译选项）
const d = Direction.Up // 编译为 0（或带注释的 0）
```

:::

注意：declare const enum 与普通 const enum 的差别在于前者通常出现在声明文件里，表示“外部存在且应当内联”。使用时要确保运行时环境与声明一致。

## 5. 🆚 `declare const enum` vs `const enum`

1. `declare const enum Direction { Up = 0, Down = 1, Left = 2, Right = 3 }`
2. `const enum Direction { Up = 0, Down = 1, Left = 2, Right = 3 }`

在使用效果上几乎完全一致，两者在代码编译后产生的 JavaScript 结果是一样的（即什么都没有），且在使用该枚举成员时，都会直接替换为对应的数字常量（如 0、1）。

因为 `const enum` 的特性就是“编译时擦除，使用时内联”，这恰好和 `declare` “不生成代码，只做类型检查”的特性重合了。

所以，对于常量枚举来说，加不加 `declare` 对最终运行的 JS 代码没有影响，区别仅在于你是正在“定义它”还是在“描述它”。

两者的区别主要体现在语义和书写位置上。

1. `declare const enum`
   - `declare const enum`（有 declare）这是声明一个环境（Ambient）常量枚举。
   - 通常用于 `.d.ts` 类型声明文件中，或者在 `.ts` 文件中描述一个全局已存在的对象。
   - 如果你是在写类型声明文件（.d.ts 或者在 namespace 中 export const enum）或者编写库给别人用，那么需要使用这种写法。这样做可以让引用你库的人，在编译他们的代码时，也能享受到内联替换的优化。
   - 你是在告诉编译器：“相信我，这个枚举在别的地方定义了（或者它纯粹用于编译时内联），请按照这个结构来处理类型检查和值替换。”
2. `const enum`
   - `const enum`（无 declare）这是定义一个常量枚举。
   - 通常用于普通的 `.ts` 源代码文件中。
   - 如果你是在写业务逻辑代码（.ts / .tsx）那么需要使用使用这种写法。
   - 你是在告诉编译器：“我要创建一个枚举，请在编译时把它内联掉。”

## 6. 🤔 使用外部枚举的主要场景是什么？

- 为第三方 JS 库提供类型声明（.d.ts），库在运行时已经定义了相应枚举对象。
- 为全局运行时常量（例如通过脚本注入或 CDN 提供的对象）提供类型提示。
- 与旧代码迁移时，先用 `declare` 声明类型，再逐步引入真实实现。

示例：假设某脚本在运行时定义全局 MyEnum：

```ts
// typings/global.d.ts
declare enum MyEnum {
  A = 1,
  B = 2,
}

// 使用处
function use(v: MyEnum) {
  // 编译器知道 MyEnum 的成员及类型
}
```

这其实也正是 `declare` 声明的使用场景。

## 7. 🔗 引用

- [TypeScript Handbook - Enums][1]
- [TypeScript Declaration Files - Handbook][2]
- [TypeScript Deep Dive - Enums][3]

[1]: https://www.typescriptlang.org/docs/handbook/enums.html
[2]: https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html
[3]: https://basarat.gitbook.io/typescript/type-system/enums
