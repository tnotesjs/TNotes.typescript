# [0291. @ts-ignore vs @ts-expect-error](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0291.%20%40ts-ignore%20vs%20%40ts-expect-error)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🆚 `@ts-ignore` vs `@ts-expect-error`](#3--ts-ignore-vs-ts-expect-error)
  - [3.1. 对比表格](#31-对比表格)
  - [3.2. 语义对比](#32-语义对比)
  - [3.3. 应用场景对比](#33-应用场景对比)
- [4. 🔍 官方文档 - `ts-ignore` or `ts-expect-error`?](#4--官方文档---ts-ignore-or-ts-expect-error)
- [5. 🔗 引用](#5--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- @ts-ignore vs @ts-expect-error

## 2. 🫧 评价

`@ts-expect-error` 和 `@ts-ignore` 都是 TypeScript 提供的指令注释（directive comments），用于在特定情况下抑制类型检查错误，但它们的语义和使用场景有本质区别，主要体现在意图表达和错误行为上。

如果你想要忽略某一行的类型错误，并且这个错误你无法立刻修复（比如是第三方库自身的类型声明错误），当你不知道应该选择 `@ts-ignore` 还是 `@ts-expect-error`，应该优先考虑使用 `@ts-expect-error`。（⚠️ 这只是个人建议，你也可以参考笔记中记录的官方建议来决策）

## 3. 🆚 `@ts-ignore` vs `@ts-expect-error`

### 3.1. 对比表格

| 特性     | `@ts-ignore`         | `@ts-expect-error`         |
| -------- | -------------------- | -------------------------- |
| 作用     | 忽略下一行的所有错误 | 预期下一行有错误           |
| 有错误时 | 不报警告             | 不报警告                   |
| 无错误时 | 不报警告             | 报警 `Unexpected no error` |
| 推荐度   | 较低                 | 较高                       |
| 适用场景 | 临时解决方案         | 测试、已知问题             |
| 安全性   | 较低                 | 较高                       |

### 3.2. 语义对比

- `@ts-expect-error` 告诉 TS 编译器：“我预期此处会报错，如果真的报错了，就忽略它；但如果此处没报错，反而要报一个错误！”
  - 抑制下一行（或下一块）的类型错误（如果存在）
  - 但如果该行实际上没有类型错误，TypeScript 会报一个“Unexpected no error”错误
- `@ts-ignore` 告诉 TS 编译器：“无论有没有错，都别管这一行”。
  - 无条件忽略下一行（或下一块）的所有类型检查错误
  - 即使该行本就正确，加了它也不会报错——静默掩盖问题

### 3.3. 应用场景对比

`@ts-expect-error`：用于显式测试类型错误场景，比如单元测试中验证类型不兼容、断言某用法应被禁止等，能防止“误抑制”。

```ts
// @ts-expect-error: should fail because 'x' is not a number
const n: number = 'hello' // ✅ 正常：此行有类型错误 → 被抑制

// @ts-expect-error
const m: number = 42 // ❌ 报错：Unexpected error suppression: no error occurs here
```

`@ts-ignore`：用于忽略错误，哪怕是正确的，也不会有特殊处理。

风险：容易隐藏真正的问题（比如拼写错误、过时 API 调用），破坏类型安全。

```ts
// @ts-ignore
const n: number = 'hello' // ✅ 被忽略（但类型不安全！）

// @ts-ignore
const m: number = 42 // ✅ 也被忽略 —— 没报错，但毫无必要，反而掩盖了意图
```

- 场景 1：都能忽略错误
- 场景 2：代码修复后的不同表现
- 场景 3：测试错误处理
- 场景 4：第三方库的类型问题

::: code-group

```ts [1]
interface User {
  name: string
}

// @ts-ignore
const user1: User = { name: 123 } // ✅ 不报错

// @ts-expect-error
const user2: User = { name: 123 } // ✅ 不报错
```

```ts [2]
interface FixedUser {
  name: string
}

// @ts-ignore
const fixed1: FixedUser = { name: 'Alice' } // ✅ 不会提示此注释已无用

// @ts-expect-error
const fixed2: FixedUser = { name: 'Alice' } // ❌ Error: Unused '@ts-expect-error' directive
```

```ts [3]
function process(data: string) {
  return data.toUpperCase()
}

describe('Error handling', () => {
  it('should reject invalid input', () => {
    // ✅ 推荐：@ts-expect-error 更明确表达意图
    // @ts-expect-error - 测试类型错误处理
    expect(() => process(123)).toThrow()
  })

  it('should reject invalid input', () => {
    // ⚠️ 不推荐：@ts-ignore 过于宽泛
    // @ts-ignore
    expect(() => process(123)).toThrow()
  })
})
```

```ts [4]
import externalLib from 'external-lib'

// ⚠️ @ts-ignore：如果库更新修复了类型，不会提示
// @ts-ignore - 库的类型定义有问题
externalLib.buggyMethod()

// ✅ @ts-expect-error：库修复后会提示移除注释
// @ts-expect-error - 库的类型定义有问题
externalLib.buggyMethod()
```

:::

## 4. 🔍 官方文档 - `ts-ignore` or `ts-expect-error`?

In some ways `// @ts-expect-error` can act as a suppression comment, similar to `// @ts-ignore`. The difference is that `// @ts-ignore` will do nothing if the following line is error-free.

在某些方面， `// @ts-expect-error` 可以起到类似 `// @ts-ignore` 的抑制注释作用。不同之处在于，如果下一行没有错误， `// @ts-ignore` 将不会执行任何操作。

You might be tempted to switch existing `// @ts-ignore` comments over to `// @ts-expect-error`, and you might be wondering which is appropriate for future code. While it’s entirely up to you and your team, we have some ideas of which to pick in certain situations.

你可能会想把现有的 `// @ts-ignore` 注释改成 `// @ts-expect-error` ，同时也在思考哪种方式更适合未来的代码。虽然这完全取决于你和你的团队，但我们针对某些场景有一些选择建议。

- Pick `ts-expect-error` if:
- 选择 `ts-expect-error` 的情况：
  - you’re writing test code where you actually want the type system to error on an operation
  - 当你编写的测试代码确实需要类型系统对某个操作报错时
  - you expect a fix to be coming in fairly quickly and you just need a quick workaround
  - 当你预计问题会很快被修复，只需要一个临时解决方案时
  - you’re in a reasonably-sized project with a proactive team that wants to remove suppression comments as soon as affected code is valid again
  - 你们正在开发一个规模适中的项目，团队积极主动，希望一旦受影响代码重新有效后立即移除抑制注释
- Pick `ts-ignore` if:
- 选择 `ts-ignore` 的情况：
  - you have a larger project and new errors have appeared in code with no clear owner
  - 你们有一个较大的项目，代码中出现了新的错误但无法明确责任人
  - you are in the middle of an upgrade between two different versions of TypeScript, and a line of code errors in one version but not another.
  - 你们正处于 TypeScript 两个不同版本之间的升级过程中，某行代码在一个版本报错而另一个版本不报错
  - you honestly don’t have the time to decide which of these options is better.
  - 你确实没时间来决定哪个选项更好。

## 5. 🔗 引用

- [官方文档 - 使用 ts-ignore 还是 ts-expect-error][1]

[1]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#ts-ignore-or-ts-expect-error
