# [0125. 异构枚举](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0125.%20%E5%BC%82%E6%9E%84%E6%9E%9A%E4%B8%BE)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. TS 官方对于异构枚举的说明](#3-ts-官方对于异构枚举的说明)
- [4. 什么是异构枚举？](#4-什么是异构枚举)
- [5. 异构枚举的初始化有什么限制？](#5-异构枚举的初始化有什么限制)
- [6. 异构枚举 vs 纯枚举](#6-异构枚举-vs-纯枚举)
- [7. 异构枚举的使用建议是？](#7-异构枚举的使用建议是)
- [8. 引用](#8-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 异构枚举的定义
- 数字和字符串混合使用的规则
- 初始化限制（核心考点）
- 部分反向映射的行为
- 最佳实践与替代方案

## 2. 评价

异构枚举（Heterogeneous Enum）允许 TypeScript 枚举类型中同时包含“数字”和“字符串”成员。虽然技术上可行，但 TypeScript 官方不推荐使用 。

通常只在需要兼容旧的运行时系统（如旧 API 返回数字，新 API 需要字符串）时才会考虑使用。

## 3. TS 官方对于异构枚举的说明

Heterogeneous enums - 异构枚举

Technically enums can be mixed with string and numeric members, but it’s not clear why you would ever want to do so:

从技术上讲，枚举可以混合使用字符串和数字成员，但这样做的好处并不明显：

```ts
enum BooleanLikeHeterogeneousEnum {
  No = 0,
  Yes = 'YES',
}
```

Unless you’re really trying to take advantage of JavaScript’s runtime behavior in a clever way, it’s advised that you don’t do this.

除非您确实想要巧妙地利用 JavaScript 的运行时行为，否则建议不要这样做。

## 4. 什么是异构枚举？

异构枚举是同时包含数字和字符串成员值的枚举类型。

异构枚举示例：

```ts
enum Heterogeneous {
  No = 0,
  Yes = 'YES',
}

console.log(Heterogeneous.No) // 0
console.log(Heterogeneous.Yes) // 'YES'
```

编译结果分析：TypeScript 会为数字成员生成反向映射，但字符串成员则不会。

编译后的 JavaScript：

```js
;('use strict')
var Heterogeneous
;(function (Heterogeneous) {
  // 数字成员：双向赋值
  Heterogeneous[(Heterogeneous['No'] = 0)] = 'No'
  // 字符串成员：单向赋值
  Heterogeneous['Yes'] = 'YES'
})(Heterogeneous || (Heterogeneous = {}))
console.log(Heterogeneous.No) // 0
console.log(Heterogeneous.Yes) // 'YES'
```

异构枚举表现出“部分反向映射”的特性：只有数字成员拥有反向映射，字符串成员没有。

```ts
enum Heterogeneous {
  No = 0,
  Yes = 'YES',
}

// ✅ 数字成员有反向映射
console.log(Heterogeneous['0']) // 'No'

// ❌ 字符串成员无反向映射
// console.log(Heterogeneous['YES']) // ❌ 报错
// Element implicitly has an 'any' type because index expression is not of type 'number'.(7015)
```

## 5. 异构枚举的初始化有什么限制？

如果一个枚举成员的前一个成员是字符串，那么该成员无法自动获得初始值，必须手动赋值。

这是异构枚举最容易出错的地方。TypeScript 的枚举自动递增特性仅适用于数字。

```ts
// ❌ 错误示例
enum Problem {
  A = 'A',
  B, // ❌ Error: 字符串枚举成员后面的成员必须初始化
  C = 1,
  D, // ✅ 2 - 数字成员后面可以自动递增
}
// 报错信息: Enum member must have initializer.
```

建议将所有数字成员放在前面，或者确保每个紧跟在字符串后的成员都有显式赋值。

```ts
// ✅ 正确示例：分段定义
enum Correct {
  // 数字部分（可以利用自动递增）
  None = 0,
  First, // 1
  Second, // 2

  // 字符串部分（必须显式赋值）
  Role = 'ADMIN',
  Status = 'ACTIVE',
}

// ✅ 正确示例：显式赋值
enum Mixed {
  A = 'A',
  B = 1, // 显式赋值，打断字符串链条
  C, // 2 (自动递增)
}
```

## 6. 异构枚举 vs 纯枚举

| 特性     | 异构枚举             | 纯数字枚举 | 纯字符串枚举 |
| -------- | -------------------- | ---------- | ------------ |
| 值类型   | 混合                 | 数字       | 字符串       |
| 自动递增 | 部分支持（仅数字后） | 完全支持   | 不支持       |
| 反向映射 | 部分支持（仅数字）   | 支持       | 不支持       |
| 推荐度   | 不推荐               | 推荐       | 最推荐       |

异构枚举有时也会被称为混合枚举，虽然叫法不同，但是指代的都是同一个东西。

## 7. 异构枚举的使用建议是？

尽管不推荐，但在特定场景中异构枚举可能是必要的妥协。

兼容遗留系统：比如正在迁移系统，旧接口使用数字状态码，而新接口倾向于使用可读性更强的字符串标识符时。

```ts
enum LegacyStatus {
  // 保持向后兼容的数字代码
  Unknown = 0,
  SystemError = 1,

  // 新增的字符串业务状态
  AuthError = 'AUTH_ERROR',
  ValidationError = 'VALIDATION_ERROR',
}
```

避免混用：最清晰的代码通常是将数字和字符串分开定义。

```ts
// 推荐：拆分为两个独立的枚举
enum StatusCode {
  Unknown = 0,
  Error = 1,
}

enum StatusMessage {
  Unknown = 'UNKNOWN',
  Error = 'ERROR',
}
```

使用联合类型替代：如果只是为了类型安全，使用联合类型往往比异构枚举更灵活、更轻量。

```ts
// 联合类型
type Status =
  | { type: 'code'; value: number }
  | { type: 'message'; value: string }

function handleStatus(s: Status) {
  if (s.type === 'code') {
    console.log(s.value) // number
  } else {
    console.log(s.value) // string
  }
}
```

## 8. 引用

- [TypeScript Handbook - Enums](https://www.typescriptlang.org/docs/handbook/enums.html)
- [TypeScript Deep Dive - Heterogeneous Enums](https://basarat.gitbook.io/typescript/type-system/enums#heterogeneous-enums)
