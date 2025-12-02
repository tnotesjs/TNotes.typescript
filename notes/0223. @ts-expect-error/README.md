# [0223. @ts-expect-error](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0223.%20%40ts-expect-error)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 @ts-expect-error 的作用是什么？](#3--ts-expect-error-的作用是什么)
- [4. 🔗 引用](#4--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- `@ts-expect-error` 注释的基本用法
- 在测试代码中的应用
- 未使用指令的检测和处理
- 与 `@ts-ignore` 的区别和优势

## 2. 🫧 评价

`@ts-expect-error` 是 TypeScript 3.9 引入的注释指令，用于标记预期会出现类型错误的代码，比 `@ts-ignore` 更安全。

- 当下一行没有错误时会发出警告，帮助及时清理无用注释
- 在测试中非常有用，可以验证类型系统的行为
- 适合标记已知的类型问题，等待修复
- 推荐优先使用它而不是 `@ts-ignore`
- 配合 ESLint 规则可以强制使用说明注释

## 3. 🤔 @ts-expect-error 的作用是什么？

`@ts-expect-error` 用于标记预期会有类型错误的代码，并在错误消失时发出警告。

基本用法：

```ts
interface User {
  name: string
  age: number
}

const user: User = {
  name: 'Alice',
  // @ts-expect-error
  age: '25', // ✅ 这一行本该是要报错的，符合预期
}

// 当错误不存在时的警告
const validUser: User = {
  name: 'Bob',
  // @ts-expect-error
  age: 30, // ❌ 这一行的错误已经修复了，现在本身就没有错误，不符合预期。
  // 此时再使用 @ts-expect-error 会警告：Unused '@ts-expect-error' directive.(2578)
}

// 对比 @ts-ignore
const anotherUser: User = {
  name: 'Charlie',
  // @ts-ignore
  age: 35, // ✅ 即使修复错误也不会有任何警告
}
```

## 4. 🔗 引用

- [TypeScript 3.9 Release Notes - @ts-expect-error][1]
- [TypeScript Handbook - Comment Directives][2]
- [ESLint TypeScript - ban-ts-comment][3]

[1]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#-ts-expect-error-comments
[2]: https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html#ts-check
[3]: https://typescript-eslint.io/rules/ban-ts-comment
