# [0127. 外部枚举（ambient enum）](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0127.%20%E5%A4%96%E9%83%A8%E6%9E%9A%E4%B8%BE%EF%BC%88ambient%20enum%EF%BC%89)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是外部枚举？](#3--什么是外部枚举)
- [4. 🤔 基本语法](#4--基本语法)
  - [4.1. declare enum](#41-declare-enum)
  - [4.2. declare const enum](#42-declare-const-enum)
- [5. 🤔 使用场景](#5--使用场景)
- [6. 🤔 注意事项与限制](#6--注意事项与限制)
- [7. 🤔 最佳实践](#7--最佳实践)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 解释外部枚举（ambient enum）的概念
- 展示 declare enum / declare const enum 的语法与差异
- 说明常见使用场景（与现有 JS 库或声明文件交互）
- 列出限制与最佳实践

## 2. 🫧 评价

外部枚举是 TypeScript 中用于描述“存在于运行时但由外部提供”的枚举类型声明。它不产生运行时代码，只为类型系统提供信息。

优点：

- 与既有 JavaScript 枚举/常量互操作
- 在 .d.ts 中声明外部接口时非常有用
- 不会重复生成运行时代码

缺点：

- 依赖运行时存在真实值
- 错误使用可能导致运行时异常

适用场景：为已存在的 JS 枚举或第三方库编写类型声明，或在声明文件中暴露枚举类型而不生成实现。

## 3. 🤔 什么是外部枚举？

外部枚举（ambient enum）使用 declare 修饰，表示枚举的实现由外部提供（例如运行时 JavaScript）。TypeScript 只保留类型信息，不生成对应的 JS 枚举对象。

```ts
// 类型层面的声明（不生成 JS）
declare enum Status {
  Ok = 0,
  Error = 1,
}
```

关键点：

- declare 表示“已存在的运行时值”
- TypeScript 使用这些声明进行类型检查，但不会输出枚举实现
- 若运行时不存在对应对象，会报错

## 4. 🤔 基本语法

### 4.1. declare enum

```ts
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

### 4.2. declare const enum

```ts
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

注意：declare const enum 与普通 const enum 的差别在于前者通常出现在声明文件里，表示“外部存在且应当内联”。使用时要确保运行时环境与声明一致。

## 5. 🤔 使用场景

- 为第三方 JS 库提供类型声明（.d.ts），库在运行时已经定义了相应枚举对象。
- 为全局运行时常量（例如通过脚本注入或 CDN 提供的对象）提供类型提示。
- 与旧代码迁移时，先用 declare 声明类型，再逐步引入真实实现。

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

## 6. 🤔 注意事项与限制

- declare enum 不会生成运行时代码：运行时必须确实存在对应对象，否则访问会失败。
- 反向映射：declare enum 的反向映射行为取决于运行时实现；TypeScript 本身不生成反向映射。
- declare const enum 引用通常会被内联：需要确保编译与打包配置（如 preserveConstEnums、isolatedModules）不会破坏内联语义。
- 不适合在库公共 API 中随意导出未实现的枚举：库消费者可能没有对应运行时实现。
- 在模块化环境里，导入/导出 declare enum 需谨慎，必要时在声明文件中明确导出。

## 7. 🤔 最佳实践

- 在 .d.ts 文件中使用 declare enum/declare const enum 来描述运行时已存在的枚举。
- 若需要在 TypeScript 中同时有类型和运行时代码，优先使用普通 enum（有实现）。
- 不要在应用代码中随意 declare 枚举来“跳过实现”；优先提供真实实现或合适的替代（常量对象、字符串字面量联合等）。
- 对于需要内联优化且仅在编译期使用的常量，使用 const enum（并注意编译选项）。
- 在声明文件中为外部枚举添加注释，说明运行时来源与兼容性。
- 测试构建与运行时环境，确保声明与实际运行时值一致。

示例：用对象替代并导出以兼容运行时与类型系统

```ts
// 推荐：提供实际导出的对象 + 类型别名
export const LogLevel = {
  Debug: 0,
  Info: 1,
  Warn: 2,
  Error: 3,
} as const

export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel]
```

## 8. 🔗 引用

- [TypeScript Handbook - Enums][1]
- [TypeScript Declaration Files - Handbook][2]
- [TypeScript Deep Dive - Enums][3]

[1]: https://www.typescriptlang.org/docs/handbook/enums.html
[2]: https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html
[3]: https://basarat.gitbook.io/typescript/type-system/enums
