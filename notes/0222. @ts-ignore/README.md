# [0222. @ts-ignore](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0222.%20%40ts-ignore)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 @ts-ignore 的作用是什么？](#3--ts-ignore-的作用是什么)
- [4. 🤔 何时应该使用 @ts-ignore？](#4--何时应该使用-ts-ignore)
- [5. 🆚 @ts-ignore vs. @ts-expect-error](#5--ts-ignore-vs-ts-expect-error)
- [6. 🤔 使用 @ts-ignore 时需要注意哪些问题？](#6--使用-ts-ignore-时需要注意哪些问题)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- `@ts-ignore` 注释的基本用法
- 适用场景和最佳实践
- 与其他注释指令的对比
- 潜在风险和替代方案

## 2. 🫧 评价

`@ts-ignore` 用于忽略下一行代码的类型错误，但应该谨慎使用，因为它会完全禁用类型检查。

- 只能临时解决类型问题，不是长期方案
- 优先考虑修复类型错误而不是忽略它
- 在无法避免时使用，但需要添加清晰的注释说明原因
- 推荐使用 `@ts-expect-error` 代替，因为更安全
- 定期审查代码中的 `@ts-ignore`，尝试移除它们

## 3. 🤔 @ts-ignore 的作用是什么？

`@ts-ignore` 注释告诉 TypeScript 编译器忽略下一行代码的所有类型错误：

```typescript
// 基本用法
let value: string = 'hello'

// @ts-ignore
value = 123 // ✅ 不会报错，即使类型不匹配

console.log(value) // 123

// 忽略对象属性错误
interface User {
  name: string
  age: number
}

const user: User = {
  name: 'Alice',
  // @ts-ignore
  age: '25', // ✅ 不会报错，即使类型是 string
}

// 忽略函数调用错误
function greet(name: string) {
  return `Hello, ${name}`
}

// @ts-ignore
greet(123) // ✅ 不会报错

// 忽略类型断言错误
const data: unknown = 'some data'

// @ts-ignore
const num: number = data // ✅ 不会报错

// 多行忽略
// @ts-ignore
const config = {
  port: '3000', // 应该是 number，但被忽略
  host: 123, // 应该是 string，但被忽略
  debug: 'yes', // 应该是 boolean，但被忽略
}
```

**作用范围：**

```typescript
// ❌ 错误：@ts-ignore 只影响下一行
let x: number = 'hello' // Error: Type 'string' is not assignable to type 'number'
// @ts-ignore
let y: number = 'world' // ✅ 被忽略

// ⚠️ 注意：不能忽略块级错误
// @ts-ignore
{
  let a: number = 'test' // ✅ 被忽略
  let b: number = 'test' // ❌ 仍然报错
}

// ✅ 正确：分别忽略
// @ts-ignore
let a: number = 'test'
// @ts-ignore
let b: number = 'test'
```

## 4. 🤔 何时应该使用 @ts-ignore？

只在特定场景下使用 `@ts-ignore`，且必须有充分理由：

```typescript
// 场景 1：第三方库类型定义不准确
import someLibrary from 'some-library'

// @ts-ignore - 库的类型定义有误，实际上支持这个用法
someLibrary.undocumentedFeature()

// 场景 2：临时解决方案（迁移期间）
// @ts-ignore - TODO: 重构后移除此注释
// 旧代码使用了不兼容的 API
legacyFunction({ oldFormat: true })

// 场景 3：测试代码中模拟错误状态
describe('Error handling', () => {
  it('should handle invalid input', () => {
    // @ts-ignore - 故意传入错误类型以测试错误处理
    expect(() => processData(null)).toThrow()
  })
})

// 场景 4：与动态生成的代码交互
// @ts-ignore - 属性由代码生成工具添加
window.__GENERATED_CONFIG__ = config

// 场景 5：临时绕过严格的类型检查
interface StrictConfig {
  readonly apiKey: string
  readonly endpoint: string
}

const config: StrictConfig = {
  apiKey: 'key',
  endpoint: 'https://api.example.com',
}

// @ts-ignore - 开发环境需要修改配置
config.endpoint = 'http://localhost:3000'

// ❌ 不好的使用示例
// @ts-ignore
function badFunction(x: any) {
  // 使用 any 就不需要 @ts-ignore
  return x.toString()
}

// @ts-ignore
let whatever = 'I give up' // ❌ 放弃类型检查不是解决方案
```

**添加说明注释的最佳实践：**

```typescript
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

## 5. 🆚 @ts-ignore vs. @ts-expect-error

这两个指令的对比和选择建议：

| 特性     | `@ts-ignore`         | `@ts-expect-error` |
| -------- | -------------------- | ------------------ |
| 作用     | 忽略下一行的所有错误 | 预期下一行有错误   |
| 无错误时 | 不报警告             | 报告未使用的指令   |
| 推荐度   | 较低                 | 较高               |
| 适用场景 | 临时解决方案         | 测试、已知问题     |
| 安全性   | 较低                 | 较高               |

```typescript
// 示例对比
interface User {
  name: string
}

// 场景 1：都能忽略错误
// @ts-ignore
const user1: User = { name: 123 } // ✅ 不报错

// @ts-expect-error
const user2: User = { name: 123 } // ✅ 不报错

// 场景 2：代码修复后的不同表现
interface FixedUser {
  name: string
}

// @ts-ignore
const fixed1: FixedUser = { name: 'Alice' } // ⚠️ 不会提示此注释已无用

// @ts-expect-error
const fixed2: FixedUser = { name: 'Alice' } // ✅ Error: Unused '@ts-expect-error' directive

// 场景 3：测试错误处理
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

// 场景 4：第三方库的类型问题
import externalLib from 'external-lib'

// ⚠️ @ts-ignore：如果库更新修复了类型，不会提示
// @ts-ignore - 库的类型定义有问题
externalLib.buggyMethod()

// ✅ @ts-expect-error：库修复后会提示移除注释
// @ts-expect-error - 库的类型定义有问题
externalLib.buggyMethod()

// 场景 5：选择建议
// ✅ 使用 @ts-expect-error 当：
// - 你期望有类型错误
// - 在测试中故意传入错误类型
// - 已知的类型问题，等待修复

// @ts-expect-error
const expected: number = 'will fix later'

// ⚠️ 使用 @ts-ignore 当：
// - 临时绕过类型检查（不推荐）
// - 无法立即修复的遗留代码

// @ts-ignore - TODO: 重构遗留系统
legacySystem.call()
```

## 6. 🤔 使用 @ts-ignore 时需要注意哪些问题？

使用 `@ts-ignore` 存在多个潜在问题：

```typescript
// 问题 1：隐藏真正的 bug
function calculateTotal(items: Array<{ price: number }>) {
  // @ts-ignore - ⚠️ 危险：可能隐藏空数组的问题
  return items.reduce((sum, item) => sum + item.price)
  // 正确做法：处理空数组情况
  // return items.reduce((sum, item) => sum + item.price, 0);
}

// 问题 2：阻止类型演进
interface OldApi {
  getData(): string
}

class Service {
  // @ts-ignore
  getData(): number {
    // ⚠️ 类型不匹配但被忽略，接口更新时不会发现
    return 123
  }
}

// ✅ 正确：明确表达类型变化
interface NewApi {
  getData(): number
}

// 问题 3：维护困难
// @ts-ignore
let globalVar = something

// 几个月后...
// ❌ 为什么要忽略？原因是什么？
globalVar.method() // 运行时可能出错

// ✅ 正确：添加详细注释
// @ts-ignore - 等待全局类型定义更新（预计 2024-12）
// 参考 issue: https://github.com/project/issues/123
let globalVar = something

// 问题 4：作用域意外
// @ts-ignore
function problematic() {
  let x: number = 'oops' // ✅ 被忽略
  return x
}

// ⚠️ 误以为整个函数的类型都被忽略
function notIgnored() {
  let y: number = 'error' // ❌ 仍然报错
  return y
}

// 问题 5：与类型断言混淆
// ❌ 不好：滥用 @ts-ignore
// @ts-ignore
const data = apiResponse as UserData

// ✅ 好：使用适当的类型断言
const data = apiResponse as unknown as UserData

// 或更好：类型守卫
function isUserData(data: unknown): data is UserData {
  return typeof data === 'object' && data !== null && 'name' in data
}

if (isUserData(apiResponse)) {
  const data = apiResponse // ✅ 类型安全
}

// 问题 6：影响重构
class OldClass {
  // @ts-ignore
  method(x: string) {
    return x.toUpperCase()
  }
}

// 重构时可能遗漏
class NewClass {
  method(x: number) {
    // ⚠️ 参数类型改变，但调用处被 @ts-ignore 隐藏
    return x.toString()
  }
}

// 问题 7：团队协作问题
// 开发者 A
// @ts-ignore
function processData(data: any) {
  return data.value
}

// 开发者 B（不知道为什么要忽略）
// @ts-ignore
processData(null) // ❌ 运行时错误
```

**替代方案和改进建议：**

```typescript
// 替代方案 1：使用类型断言
// ❌ 不好
// @ts-ignore
const value: number = unknownValue

// ✅ 好：明确的类型转换
const value = unknownValue as number

// 替代方案 2：使用类型守卫
// ❌ 不好
// @ts-ignore
if (typeof value === 'string') {
  value.toUpperCase()
}

// ✅ 好：TypeScript 会自动推断
if (typeof value === 'string') {
  value.toUpperCase() // ✅ 类型安全
}

// 替代方案 3：修复类型定义
// ❌ 不好
import { BuggyType } from 'buggy-lib'
// @ts-ignore
const instance: BuggyType = create()

// ✅ 好：创建类型补丁
declare module 'buggy-lib' {
  interface BuggyType {
    // 添加缺失的属性
    newProperty: string
  }
}

// 替代方案 4：使用 any（明确放弃类型检查）
// ❌ 不好：隐含放弃
// @ts-ignore
const data = complexOperation()

// ✅ 好：明确表示暂时不处理类型
const data: any = complexOperation() // 明确知道是 any

// 替代方案 5：重构代码结构
// ❌ 不好
// @ts-ignore
function legacy(x: string | number) {
  if (typeof x === 'string') {
    return x.toUpperCase()
  }
  return x.toFixed(2)
}

// ✅ 好：函数重载
function modern(x: string): string
function modern(x: number): string
function modern(x: string | number): string {
  if (typeof x === 'string') {
    return x.toUpperCase()
  }
  return x.toFixed(2)
}

// 审查建议
// 1. 定期搜索项目中的 @ts-ignore
// 2. 在代码审查时特别关注
// 3. 设置 ESLint 规则限制使用
// 4. 建立移除计划

// eslint 配置示例
// {
//   "rules": {
//     "@typescript-eslint/ban-ts-comment": [
//       "error",
//       {
//         "ts-ignore": "allow-with-description",
//         "minimumDescriptionLength": 10
//       }
//     ]
//   }
// }
```

## 7. 🔗 引用

- [TypeScript Handbook - Comment Directives][1]
- [TypeScript 3.9 Release Notes - @ts-expect-error][2]
- [ESLint TypeScript - ban-ts-comment][3]

[1]: https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html#ts-check
[2]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#-ts-expect-error-comments
[3]: https://typescript-eslint.io/rules/ban-ts-comment
