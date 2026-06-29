# [0222. @ts-ignore](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0222.%20%40ts-ignore)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. @ts-ignore 的作用是什么？](#3-ts-ignore-的作用是什么)
- [4. 何时应该使用 @ts-ignore？](#4-何时应该使用-ts-ignore)
- [5. 使用 @ts-ignore 会有什么问题？](#5-使用-ts-ignore-会有什么问题)
- [6. 引用](#6-引用)

<!-- endregion:toc -->

## 1. 本节内容

- `@ts-ignore` 注释简介

## 2. 评价

`@ts-ignore` 用于忽略下一行代码的类型错误，但应该谨慎使用，因为它会完全禁用类型检查。

- 只能临时解决类型问题，不是长期方案
- 优先考虑修复类型错误而不是忽略它
- 在无法避免时使用，但需要添加清晰的注释说明原因
- 推荐使用 `@ts-expect-error` 代替，因为更安全
- 定期审查代码中的 `@ts-ignore`，尝试移除它们

## 3. @ts-ignore 的作用是什么？

`@ts-ignore` 注释告诉 TypeScript 编译器忽略下一行代码的所有类型错误：

```ts
// 基本用法
let value: string = 'hello'

// @ts-ignore
value = 123 // ✅ 不会报错，即使类型不匹配

console.log(value) // 123
```

常见示例：

1. 忽略对象属性错误
2. 忽略函数调用错误
3. 忽略类型断言错误

::: code-group

```ts [1]
interface User {
  name: string
  age: number
}

const user: User = {
  name: 'Alice',
  // @ts-ignore
  age: '25', // ✅ 不会报错，即使类型是 string
}
```

```ts [2]
function greet(name: string) {
  return `Hello, ${name}`
}

// @ts-ignore
greet(123) // ✅ 不会报错
```

```ts [3]
const data: unknown = 'some data'

// @ts-ignore
const num: number = data // ✅ 不会报错
```

:::

不支持多行忽略：

```ts
interface Config {
  port: number
  host: string
  debug: boolean
}

// @ts-ignore
const config1: Config = {
  port: '3000', // ❌ 应该是 number，错误不会被忽略
  host: 123, // ❌ 应该是 string，错误不会被忽略
  debug: 'yes', // ❌ 应该是 boolean，错误不会被忽略
}

const config2: Config = {
  // @ts-ignore
  port: '3000', // ✅ 错误被忽略
  // @ts-ignore
  host: 123, // ✅ 错误被忽略
  // @ts-ignore
  debug: 'yes', // ✅ 错误被忽略
}
```

## 4. 何时应该使用 @ts-ignore？

只在特定场景下使用 `@ts-ignore`，且必须有充分理由：

- 场景 1：第三方库类型定义不准确 - 别人写错了
- 场景 2：临时解决方案 - 比如迁移期间
- 场景 3：测试代码中模拟错误状态 - 故意为之

::: code-group

```ts [1]
import someLibrary from 'some-library'

// @ts-ignore - 库的类型定义有误，实际上支持这个用法
someLibrary.undocumentedFeature()
```

```ts [2]
// @ts-ignore - TODO: 重构后移除此注释
legacyFunction({ oldFormat: true }) // 旧代码使用了不兼容的 API
```

```ts [3]
describe('Error handling', () => {
  it('should handle invalid input', () => {
    // @ts-ignore - 故意传入错误类型以测试错误处理
    expect(() => processData(null)).toThrow()
  })
})
```

:::

最佳实践：在使用 `// @ts-ignore` 的时候，同时添加必要上的说明注释，记录你为什么在这里需要使用 `@ts-ignore`

```ts
// ✅ 好：解释为什么需要忽略
// @ts-ignore - React Native 的类型定义缺少 __DEV__ 全局变量
if (__DEV__) {
  console.log('Development mode')
}

// @ts-ignore - 等待 @types/node v18 支持此 API
const file = await fs.promises.opendir('./')

// @ts-ignore - 临时方案，将在 v2.0 重构时修复
const result = legacySystemCall(data)

// ❌ 不好：没有说明原因
// @ts-ignore
someFunction()

// ❌ 不好：说明不清晰
// @ts-ignore - 修复错误
const value = getData()
```

## 5. 使用 @ts-ignore 会有什么问题？

```ts
// ⚠️ 核心问题：维护困难
// @ts-ignore
foo.method()

// 几个月后...
// 🤔 为什么要忽略？原因是什么？
foo.method() // 运行时可能出错

// ✅ 正确：添加详细注释
// @ts-ignore - 等待全局类型定义更新（预计 2025-12）
// 参考 issue: https://github.com/project/issues/123
foo.method()

// ✅ 更加推荐的做法是使用 @ts-expect-error

// ⚠️ 假设在 2025-12 时，foo.method() 的类型问题已经得到修复
// 这意味着此时这条语句的已经是正确的了，我们应该去掉不必要的 // @ts-ignore 注释
// 但编译器不会有任何提醒
// 编译器的正确行为应该是提醒我们删除这不必要的注释命令
// 相较之下，// @ts-expect-error 命令就好的多，它就是专门用来解决这个痛点问题的
// 当类型错误得到修复之后
//   如果我们使用的是 @ts-ignore 命令，那么编译器不会提醒我们删除它
//   如果使用的是 @ts-expect-error 命令，那么编译器会提醒我们删除它
```

审查建议：

1. 定期搜索项目中的 @ts-ignore
2. 在代码审查时特别关注
3. 设置 ESLint 规则限制使用
4. 建立移除计划

eslint 配置示例：

```json
{
  "rules": {
    // 禁止无说明的 @ts-ignore；若使用，必须附 ≥10 字解释（如原因/TODO/issue）
    "@typescript-eslint/ban-ts-comment": [
      "error",
      {
        "ts-ignore": "allow-with-description",
        "minimumDescriptionLength": 10
      }
    ]
  }
}
```

## 6. 引用

- [TypeScript Handbook - Comment Directives][1]
- [TypeScript 3.9 Release Notes - @ts-expect-error][2]
- [ESLint TypeScript - ban-ts-comment][3]

[1]: https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html#ts-check
[2]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#-ts-expect-error-comments
[3]: https://typescript-eslint.io/rules/ban-ts-comment
