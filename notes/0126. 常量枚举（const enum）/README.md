# [0126. 常量枚举（const enum）](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0126.%20%E5%B8%B8%E9%87%8F%E6%9E%9A%E4%B8%BE%EF%BC%88const%20enum%EF%BC%89)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是常量枚举？](#3--什么是常量枚举)
- [4. 🆚 常量枚举 vs 普通枚举](#4--常量枚举-vs-普通枚举)
- [5. 🤔 常量枚举的类型有？](#5--常量枚举的类型有)
- [6. 🤔 常量枚举的编译行为是？](#6--常量枚举的编译行为是)
- [7. 🤔 使用常量枚举的注意事项有？](#7--使用常量枚举的注意事项有)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 常量枚举的定义和特性
- 编译时内联机制
- 与普通枚举的区别
- 性能优势和限制
- 使用时的注意事项

## 2. 🫧 评价

常量枚举（const enum）是 TypeScript 中编译时内联的枚举类型。

## 3. 🤔 什么是常量枚举？

常量枚举是在编译时完全内联的枚举，使用 `const enum` 关键字声明。

- const 声明：使用 `const enum` 关键字
- 编译时内联：引用处替换为实际值
- 无运行时对象：不生成枚举对象
- 更小体积：减少打包大小
- 更快执行：避免对象查找，可适当优化性能
- 有限制：不支持某些特性（比如反向映射）
- 类型检查：编译时仍有类型安全

::: code-group

```ts [常量枚举]
const enum Direction {
  Up,
  Down,
  Left,
  Right,
}

const dir = Direction.Up

// 编译后的 JS：
// "use strict";
// const dir = 0 /* Direction.Up */;
```

```ts [普通枚举]
enum NormalDirection {
  Up,
  Down,
  Left,
  Right,
}

const normalDir = NormalDirection.Up

// 编译后的 JS：
// "use strict";
// var NormalDirection;
// (function (NormalDirection) {
//     NormalDirection[NormalDirection["Up"] = 0] = "Up";
//     NormalDirection[NormalDirection["Down"] = 1] = "Down";
//     NormalDirection[NormalDirection["Left"] = 2] = "Left";
//     NormalDirection[NormalDirection["Right"] = 3] = "Right";
// })(NormalDirection || (NormalDirection = {}));
// const normalDir = NormalDirection.Up;
```

:::

## 4. 🆚 常量枚举 vs 普通枚举

| 特性       | 常量枚举 | 普通枚举     |
| ---------- | -------- | ------------ |
| 运行时代码 | 无       | 有           |
| 反向映射   | 不支持   | 支持（数字） |
| 代码体积   | 更小     | 更大         |
| 动态访问   | 不支持   | 支持         |
| 编译输出   | 内联值   | 对象         |

```ts
const enum Direction {
  Up,
  Down,
  Left,
  Right,
}

// 常量枚举不支持动态访问
const key = 'Up'
const dir = Direction[key] // ❌ 报错
// A const enum member can only be accessed using a string literal.(2476)

console.log(dir)
```

## 5. 🤔 常量枚举的类型有？

1. 数字常量枚举
2. 字符串常量枚举
3. 异构常量枚举，也称混合常量枚举（不推荐使用）

::: code-group

```ts [1]
const enum Status {
  Pending,
  Active,
  Completed,
}
```

```ts [2]
const enum Color {
  RED = 'RED',
  GREEN = 'GREEN',
  BLUE = 'BLUE',
}
```

```ts [3]
const enum Mixed {
  NONE = 0,
  NAME = 'NAME',
}
```

:::

## 6. 🤔 常量枚举的编译行为是？

在编译阶段内联替换，不会在编译产物中生成对象。

```ts
// 常量枚举：
const enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}

// TS 代码：
const a = Direction.Up
const b = Direction.Down
const arr = [Direction.Left, Direction.Right]

// 编译后的 JS：
// "use strict";
// const a = 'UP' /* Direction.Up */
// const b = 'DOWN' /* Direction.Down */
// const arr = ['LEFT' /* Direction.Left */, 'RIGHT' /* Direction.Right */]
```

默认会保留注释，比如：

- 编译前：`const a = Direction.Up`
- 编译后：`const a = 'UP' /* Direction.Up */`

可以通过 `removeComments` 配置项移除产物中的所有注释内容：

```ts
// 常量枚举：
const enum Level {
  Low = 1,
  Medium = 2,
  High = 3,
}

// TS 代码：
const level = Level.Medium

// 编译后的 JS（默认）：
// "use strict";
// const level = 2 /* Level.Medium */

// 编译后的 JS（开启 --removeComments 的情况下）：
// "use strict";
// const level = 2
```

如果枚举成员中有计算成员，也会自动完成内联。

```ts
const enum Size {
  Small = 10,
  Medium = Small * 2, // 20
  Large = Medium * 2, // 40
  XLarge = Large + 10, // 50
}

const size = Size.Large

// 编译后的 JS：
// "use strict";
// const size = 40 /* Size.Large */
```

## 7. 🤔 使用常量枚举的注意事项有？

不支持反向映射，无法反向访问。

```ts
const enum Color {
  Red,
  Green,
  Blue,
}

// 只能正向访问
// const color = Color.Red // 0

// ❌ 无法使用反向映射，反向访问
// const key = Color[0]  // ❌ Error: 常量枚举不支持
// 报错信息：
// A const enum member can only be accessed using a string literal.(2476)
```

不支持动态访问。

```ts
const enum Color {
  Red,
  Green,
  Blue,
}

// 只能静态访问
Color.Red // 0

// ❌ 无法通过动态成员的方式来访问枚举值：
// const key = 'Red'
// Color[key] // ❌ Error：常量枚举不支持
// A const enum member can only be accessed using a string literal.(2476)
```

不能作为对象使用，因为编译后是直接内联替换，产物中并没有生成对象。

```ts
const enum Direction {
  Up,
  Down,
  Left,
  Right,
}

// ❌ 不能遍历枚举
// for (const key in Direction) {}  // ❌ Error
// Object.keys(Direction) // ❌ Error

// 上述做法都会抛出以下错误：
// 'const' enums can only be used in property or index access expressions or the right hand side of an import declaration or export assignment or type query.(2475)
```

跨模块访问的时候，需要开启 `--preserveConstEnums` 或 `--isolatedModules` 配置。

```ts
// module1.ts
export const enum Status {
  Active,
  Inactive,
}

// module2.ts
import { Status } from './module1'

// ⚠️ 需要 --preserveConstEnums 或 --isolatedModules
const status = Status.Active

// 或者使用 import type
import type { Status } from './module1'
```

## 8. 🔗 引用

- [TypeScript Handbook - Const Enums][1]
- [TypeScript Deep Dive - Const Enums][2]
- [TypeScript Compiler Options - preserveConstEnums][3]

[1]: https://www.typescriptlang.org/docs/handbook/enums.html#const-enums
[2]: https://basarat.gitbook.io/typescript/type-system/enums#const-enums
[3]: https://www.typescriptlang.org/tsconfig#preserveConstEnums
