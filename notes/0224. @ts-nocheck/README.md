# [0224. @ts-nocheck](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0224.%20%40ts-nocheck)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 @ts-nocheck 的作用是什么？](#3--ts-nocheck-的作用是什么)
- [4. 🤔 @ts-nocheck 必须位于第一行吗？](#4--ts-nocheck-必须位于第一行吗)
- [5. 🤔 何时应该使用 @ts-nocheck？](#5--何时应该使用-ts-nocheck)
- [6. 🆚 @ts-nocheck vs @ts-ignore](#6--ts-nocheck-vs-ts-ignore)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- `@ts-nocheck` 注释的基本用法
- 跳过整个文件的类型检查
- 在迁移项目中的应用

## 2. 🫧 评价

`@ts-nocheck` 是文件级别的类型检查跳过指令，用于完全禁用某个文件的 TypeScript 类型检查。

- 必须放在文件的顶部（注释之前）
- 适合处理遗留代码或生成的代码
- 在 JavaScript 迁移到 TypeScript 的过程中非常有用
- 应该作为临时方案，最终目标是移除它
- 过度使用会失去 TypeScript 的类型安全优势

## 3. 🤔 @ts-nocheck 的作用是什么？

`@ts-nocheck` 跳过整个文件的类型检查：

```typescript
// @ts-nocheck
// ⚠️ 必须位于所有非注释代码之前

// 文件中所有代码都不会进行类型检查
function add(a, b) {
  return a + b
}

// ✅ 不会报错，即使类型不匹配
const result: number = add('hello', 'world')

// ✅ 不会报错，即使属性不存在
interface User {
  name: string
}

const user: User = {
  name: 'Alice',
  age: 30, // 额外属性不会报错
}

// ✅ 不会报错，即使调用不存在的方法
const value: string = 'hello'
value.nonExistentMethod()
```

## 4. 🤔 @ts-nocheck 必须位于第一行吗？

不需要

`// @ts-nocheck` 不必放在文件第一行（从 TypeScript 3.7 起已放宽），只要放在文件顶部、被检查的代码之前即可。

问：“文件顶部”是哪？

你就理解为非注释代码之前即可。

```ts
// 类型错误
let foo: string = 123 // ❌ 会报错
```

```ts
// @ts-nocheck - 位于第一行
// 类型错误
let foo: string = 123 // ✅ 不会报错
```

```ts
// 类型错误
// @ts-nocheck - 位于第二行
let foo: string = 123 // ✅ 不会报错
```

## 5. 🤔 何时应该使用 @ts-nocheck？

合理使用 `@ts-nocheck` 的场景：

- 场景 1：迁移遗留代码
- 场景 2：第三方代码或生成的代码
- 场景 3：临时禁用检查以专注于其他问题
- 场景 4：处理类型定义缺失的外部模块
- 场景 5：测试文件中的特殊情况

::: code-group

```ts [1]
// legacy-utils.js
// @ts-nocheck
// TODO: 逐步迁移到 TypeScript - TASK-123

// 大量复杂的遗留 JavaScript 代码
function complexLegacyLogic(data) {
  // 几百行复杂逻辑
  return processData(data)
}

module.exports = { complexLegacyLogic }
```

```ts [2]
// generated/api-client.ts
// @ts-nocheck
// 此文件由 swagger-codegen 自动生成
// 不要手动编辑

export class ApiClient {
  // 自动生成的代码
}
```

```ts [3]
// problematic-file.ts
// @ts-nocheck
// FIXME: 修复类型错误后移除此注释

// 当前有紧急 bug 需要修复
// 类型错误会稍后处理
function urgentFix() {
  // 临时方案
}
```

```ts [4]
// external-wrapper.ts
// @ts-nocheck
// 包装没有类型定义的外部库

import * as oldLibrary from 'very-old-library'

export function wrapper() {
  return oldLibrary.someFunction()
}
```

```ts [5]
// integration-tests/legacy.test.js
// @ts-nocheck
// 集成测试遗留代码，使用旧的测试框架

describe('Legacy feature', () => {
  it('should work', () => {
    // 旧的测试代码
  })
})
```

:::

## 6. 🆚 @ts-nocheck vs @ts-ignore

| 特性     | @ts-nocheck              | @ts-ignore                |
| -------- | ------------------------ | ------------------------- |
| 作用范围 | 整个文件                 | 下一行代码                |
| 位置要求 | 文件顶部                 | 在目标代码上一行          |
| 使用场景 | 遗留代码、生成的代码     | 个别已知问题              |
| 粒度     | 粗粒度                   | 细粒度                    |
| 维护性   | 难以定位问题             | 容易定位问题              |
| 建议     | 仅用于项目的初期迁移阶段 | 优先使用 @ts-expect-error |

## 7. 🔗 引用

- [TypeScript Handbook - JS Projects Utilizing TypeScript][1]
- [TypeScript Compiler Options - checkJs][2]
- [Migrating from JavaScript][3]
- [// @ts-nocheck in TypeScript Files][4]

[1]: https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html
[2]: https://www.typescriptlang.org/tsconfig#checkJs
[3]: https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html
[4]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#-ts-nocheck-in-typescript-files
