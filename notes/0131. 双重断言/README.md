# [0131. 双重断言](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0131.%20%E5%8F%8C%E9%87%8D%E6%96%AD%E8%A8%80)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 双重断言是什么？](#3--双重断言是什么)
- [4. 🤔 双重断言的语法是？](#4--双重断言的语法是)
- [5. 🆚 单次断言 vs 双重断言](#5--单次断言-vs-双重断言)
- [6. 🔗 引用](#6--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 双重断言的概念和机制
- 单次断言的限制
- 双重断言的使用场景

## 2. 🫧 评价

双重断言（Double Assertion）是 TS 中通过 unknown 或 any 中转，强制断言到任意类型的技术，不建议使用，少数情况下会用它来纠正一些第三方库的错误类型。

## 3. 🤔 双重断言是什么？

双重断言是先断言到 unknown 或 any，再断言到目标类型的两步断言过程。

- 第一次断言：转为 unknown 或 any
- 第二次断言：从 unknown/any 转为目标类型

这么做可以绕过 TS 的类型检查机制，因为 unknown/any 是 TS 中的顶层类型，是可以代表几乎所有值的类型，这意味着你可以将任意类型的变量断言为 unknown/any，然后再将 unknown/any 断言为目标类型。

::: tip 💡 回顾类型断言的条件

类型断言并不意味着可以把某个值断言为任意类型。类型断言的使用前提是，值的实际类型与断言的类型必须满足一个条件：

```ts
expr as T
```

`expr` 是实际的值，`T` 是类型断言，它们必须满足下面其中一个条件：

- `expr` 是 `T` 的子类型
- `T` 是 `expr` 的子类型
- `expr` 和 `T` 的类型有交集

```ts
// TypeScript 允许断言的条件：
// 1. 类型 A 可以赋值给类型 B
// 2. 类型 B 可以赋值给类型 A
// 3. 两个类型有重叠

// ✅ 允许的断言
const value1 = 'hello' as string // 字面量 → 通用类型
const value2 = 'hello' as 'hello' // 通用类型 → 字面量
const value3 = 123 as number | string // 类型细化

// ❌ 不允许的断言
// const value4 = 123 as string  // ❌ Error: number 和 string 无重叠
```

:::

双重断言是 TypeScript 的"逃生舱口"，应该尽量避免使用，这么干很可能导致运行时的类型错误。

```ts
// ❌ 123 和 string 类型不兼容，且没有交集，不满足类型断言的条件：
// const num = 123
// const str = num as string // ❌ Error
// 报错信息：
// Conversion of type 'number' to type 'string' may be a mistake because neither type sufficiently overlaps with the other.
// If this was intentional, convert the expression to 'unknown' first.(2352)

// ⚠️ 利用双重断言，可以将 123 断言为 string 类型
const num2 = 123
const str2 = num2 as unknown as string // ✅ OK
// 接下来 str2 将被 TS 视作 string 类型
console.log(str2.toLowerCase()) // ✅ OK
```

- 绕过类型检查：可以断言到不相关的类型
- 极度危险：容易引入运行时错误
- 最后手段：只在别无选择时使用
- 需要注释：必须说明使用原因

## 4. 🤔 双重断言的语法是？

有两种写法来实现双重断言：

```ts
const value = 123
// 1. 使用 unknown
const str1 = value as unknown as string
// 2. 使用 any
const str2 = value as any as string
```

🤔 如果非要使用类型断言，那么应该使用 any 中转还是使用 unknown 中转呢？

先说答案：用哪个都一样，根据团队的规范走，保持项目中双重断言的写法统一即可。

如果你学习过 `unknown` 的话，你会了解到这个类型是更加安全的顶层类型，从某种程度上说，它出现就是为了让开发者尽可能减少对 `any` 类型的使用，因此，在这里你可能会想到应该优先使用 `as unknown` 来中转。但是，实际上用哪个效果其实都一样，在双重断言中，没有用哪个更加安全的说法，只要你用了类型断言，就注定是“不安全”的，或者说“安全”问题全全由你承担，而非交由 TS 来承担，放弃了 TS 的类型安全保障。

危险示例：

```ts
interface User {
  name: string
  age: number
}

const data = { name: 'Alice' } // 缺少 age

// 双重断言隐藏了类型错误
const user = data as unknown as User

console.log(user.age.toFixed()) // 运行时错误！undefined.toFixed()
```

如果你非常确定某个变量的类型是错误的（比如第三方库作者写错了），那么可以考虑双重断言来纠正错误的类型。

## 5. 🆚 单次断言 vs 双重断言

| 特性     | 单次断言 | 双重断言 |
| -------- | -------- | -------- |
| 类型限制 | 必须兼容 | 无限制   |
| 安全性   | 相对安全 | 极度危险 |
| 使用场景 | 类型细化 | 类型强转 |
| 推荐度   | 谨慎使用 | 极力避免 |

## 6. 🔗 引用

- [TypeScript Handbook - Type Assertions][1]
- [TypeScript Deep Dive - Type Assertion][2]
- [Effective TypeScript - Item 9: Prefer Type Declarations to Type Assertions][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions
[2]: https://basarat.gitbook.io/typescript/type-system/type-assertion
[3]: https://effectivetypescript.com/
