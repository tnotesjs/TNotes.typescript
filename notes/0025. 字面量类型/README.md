# [0025. 字面量类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0025.%20%E5%AD%97%E9%9D%A2%E9%87%8F%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 什么是字面量类型（Literal Types）？](#3-什么是字面量类型literal-types)
- [4. 字面量类型的常见使用场景都有哪些？](#4-字面量类型的常见使用场景都有哪些)
- [5. const 断言（`as const`）有什么用？](#5-const-断言as-const有什么用)
- [6. `as const` 断言如何配合字面量类型使用？](#6-as-const-断言如何配合字面量类型使用)
- [7. 什么是模板字符串字面量类型 `Template Literal Types` （TS 4.1+）？](#7-什么是模板字符串字面量类型-template-literal-types-ts-41)
- [8. 字面量类型 vs. 枚举（enum）](#8-字面量类型-vs-枚举enum)
- [9. 引用](#9-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 字面量类型（Literal Types）
- 模板字符串字面量类型（Template Literal Types）
- `as const` 断言
- 枚举（enum）

## 2. 评价

- 字面量类型（Literal Types）很简单也很常用，通常会配合联合类型一起使用。
- 字面量类型让 TypeScript 能更精确描述具体的类型。
  - 没有字面量类型，TS 只能判定“这是个字符串”
  - 有了字面量类型，TS 可以具体判定“这必须是 `'success'` 字符串”
- `as const` 断言可以让 TS 宽泛的推导结果更加具体，可以配合字面量类型一起使用。

## 3. 什么是字面量类型（Literal Types）？

字面量类型（Literal Types） 是 TypeScript 中一个强大而精巧的特性，它允许你将具体的值（如 `"success"`、`42`、`true`）用作类型。这使得类型系统不仅能描述"是什么类型"，还能精确描述"必须是哪个值"，从而实现更严格的类型安全和更智能的代码提示。

---

字面量类型是指类型等于某个具体的字面量值。TypeScript 支持以下几种字面量类型：

| 类型                            | 示例                                |
| ------------------------------- | ----------------------------------- |
| 字符串字面量类型                | `"success"`, `"error"`, `"loading"` |
| 数字字面量类型                  | `0`, `1`, `42`, `-1`                |
| 布尔字面量类型                  | `true`, `false`                     |
| 模板字符串字面量类型（TS 4.1+） | `` `user-${number}` ``              |
| bigint 字面量类型               | `100n`                              |
| null / undefined 字面量类型     | `null`, `undefined`（较少单独使用） |

---

字面量类型是子类型（subtype）：

- `"success"` 是 `string` 的子类型，
- `42` 是 `number` 的子类型，
- `true` 是 `boolean` 的子类型。

---

字面量类型的基本写法：

::: code-group

```ts [1]
// 字符串字面量类型（最常用）
let status: 'success' = 'success'
status = 'error' // ❌ 错误！Type '"error"' is not assignable to type '"success"'

// 通常与联合类型结合使用：
type Status = 'idle' | 'loading' | 'success' | 'error'

let currentStatus: Status = 'loading'
currentStatus = 'success' // ✅
currentStatus = 'unknown' // ❌ 不在联合类型中
```

```ts [2]
// 数字字面量类型
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6

function rollDice(): DiceRoll {
  return (Math.floor(Math.random() * 6) + 1) as DiceRoll // 需要类型断言
}
```

```ts [3]
// 布尔字面量类型（很少见）
type IsAdmin = true // 表示"必须是 true"

function grantAccess(isAdmin: IsAdmin) {
  // 只有传入 true 才能调用
}
grantAccess(true) // ✅
grantAccess(false) // ❌
```

:::

## 4. 字面量类型的常见使用场景都有哪些？

::: code-group

```ts [1]
// 精确建模状态机
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: string }
  | { status: 'error'; message: string }

function handleState(state: RequestState) {
  switch (state.status) {
    case 'idle':
      // 此时 state 没有 data 或 message
      console.log(state.message) // ❌
      // 报错：Property 'message' does not exist on type '{ status: "idle"; }'.(2339)
      break
    case 'success':
      console.log(state.data) // ✅ 安全！TS 知道此时有 data
      break
  }
}
```

```ts [2]
// 限制函数参数取值
function alignContent(direction: 'left' | 'center' | 'right') {
  // 只接受这三个值
}

alignContent('center') // ✅
alignContent('middle') // ❌ 编译错误
```

```ts [3]
// 实现"字符串枚举"（比 enum 更轻量）
// 特点：生成的 JS 更小，没有运行时对象。

// 传统 enum
enum Theme {
  Light,
  Dark,
}

// 字面量类型 + const 断言（更现代）
const Theme = {
  Light: 'light',
  Dark: 'dark',
} as const

type ThemeType = (typeof Theme)[keyof typeof Theme] // "light" | "dark"
```

:::

## 5. const 断言（`as const`）有什么用？

`as const` 的作用：可以让 TS 「宽泛」 的类型推导结果更「准确」

- 将数组推断为 readonly 元组
- 将对象属性推断为 只读字面量类型
- 将字符串/数字推断为 字面量类型而非 string/number

```ts
const a = [1, 2, 3]
// 推断结果
// const a: number[]

const b = [1, 2, 3] as const
// 推断结果
// const b: readonly [1, 2, 3]

const c = {
  timeout: 5000,
  retry: true,
  mode: 'strict',
}

// 推断结果
// const c: {
//     timeout: number;
//     retry: boolean;
//     mode: string;
// }

const d = {
  timeout: 5000,
  retry: true,
  mode: 'strict',
} as const

// 推断结果
// const d: {
//     readonly timeout: 5000;
//     readonly retry: true;
//     readonly mode: "strict";
// }
```

## 6. `as const` 断言如何配合字面量类型使用？

这俩配合使用，通常是为了解决 TS 默认推断行为得到的结果过于宽泛的问题。

::: code-group

```ts [问题背景]
// TS 的默认推导结果过于宽泛
const directions = ['north', 'south', 'east', 'west']
// TypeScript 推断为: string[]
// 而非 readonly ["north", "south", "east", "west"] 元组类型
// 因此下面的调用会报错

function go(dir: "north" | "south" | "east" | "west") { ... }
go(directions[0]); // ❌ 类型 string 不能赋值给字面量联合类型
// Argument of type 'string' is not assignable to parameter of type '"north" | "south" | "east" | "west"'.(2345)
```

```ts [解决方案]
// 使用 as const
const directions = ["north", "south", "east", "west"] as const;
// 推断为 readonly ["north", "south", "east", "west"]

type Direction = typeof directions[number]; // "north" | "south" | "east" | "west"

function go(dir: Direction) { ... }
go(directions[0]); // ✅ 安全！
```

:::

## 7. 什么是模板字符串字面量类型 `Template Literal Types` （TS 4.1+）？

官方描述：

Template literal types build on string literal types, and have the ability to expand into many strings via unions.

模板字面量类型建立在字符串字面量类型之上，并具有通过联合扩展为许多字符串的能力。

---

翻译翻译：

就是可以基于其他字面量类型动态生成新字面量类型！

```ts
type MyEvent = 'click' | 'hover' | 'focus'
type AnalyticsEvent = `track_${MyEvent}`
// 推断结果
// type AnalyticsEvent = "track_click" | "track_hover" | "track_focus"

function logEvent(event: AnalyticsEvent) {
  //...
}
logEvent('track_click') // ✅
logEvent('track_scroll') // ❌
// Argument of type '"track_scroll"' is not assignable to parameter of type '"track_click" | "track_hover" | "track_focus"'.(2345)
```

---

实际应用场景示例：生成 CSS 类名

```ts
type Size = 'small' | 'medium' | 'large'
type Variant = 'primary' | 'secondary'

type ButtonClass = `btn--${Size}--${Variant}`
// 推断结果
// type ButtonClass = "btn--small--primary" | "btn--small--secondary" | "btn--medium--primary" | "btn--medium--secondary" | "btn--large--primary" | "btn--large--secondary"

// 排列组合共计 2 * 3 = 6 个
// 如果还有更多的变体，可以继续扩展
// 交给 TS 动态计算，省去你自行排列组合的工作

const className: ButtonClass = 'btn--large--primary' // ✅
```

## 8. 字面量类型 vs. 枚举（enum）

| 特性     | 字面量类型 + `as const`  | `enum`                     |
| -------- | ------------------------ | -------------------------- |
| 运行时   | 无额外开销（纯类型）     | 生成 JS 对象（有运行时）   |
| 反向映射 | 不支持                   | 支持（`Enum[Enum.Value]`） |
| 调试     | 值直接可见               | 需查 enum 对象             |
| 扩展性   | 可轻松组合（联合、模板） | 较难组合                   |
| 推荐场景 | 大多数情况               | 需要运行时查找或数字枚举   |

现代 TypeScript 项目更推荐字面量类型，除非你需要 enum 的运行时特性（比如你要读值）。

## 9. 引用

- [typescript - Handbook - Everyday Types - Literal Types][2]
- [typescript - Handbook - Type Manipulation - Template Literal Types][1]

[1]: https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#handbook-content
[2]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types
