# [0223. @ts-expect-error](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0223.%20%40ts-expect-error)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 @ts-expect-error 的作用是什么？](#3--ts-expect-error-的作用是什么)
- [4. 🤔 @ts-expect-error 在测试中如何使用？](#4--ts-expect-error-在测试中如何使用)
- [5. 🤔 如何处理未使用的 @ts-expect-error？](#5--如何处理未使用的-ts-expect-error)
- [6. 🤔 使用 @ts-expect-error 时需要注意哪些问题？](#6--使用-ts-expect-error-时需要注意哪些问题)
- [7. 🔗 引用](#7--引用)

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

`@ts-expect-error` 用于标记预期会有类型错误的代码，并在错误消失时发出警告：

```typescript
// 基本用法
interface User {
  name: string
  age: number
}

// @ts-expect-error
const user: User = {
  name: 'Alice',
  age: '25', // ✅ 预期的错误，被标记
}

// 当错误不存在时的警告
// @ts-expect-error
const validUser: User = {
  name: 'Bob',
  age: 30, // ⚠️ Unused '@ts-expect-error' directive
}

// 对比 @ts-ignore
// @ts-ignore
const anotherUser: User = {
  name: 'Charlie',
  age: 35, // ✅ 即使没有错误也不会警告
}

// 忽略函数调用错误
function greet(name: string): string {
  return `Hello, ${name}`
}

// @ts-expect-error - 参数类型不匹配
greet(123)

// 忽略属性访问错误
interface Config {
  port: number
}

const config: Config = { port: 3000 }

// @ts-expect-error - 属性不存在
console.log(config.host)

// 类型断言场景
const data: unknown = { value: 42 }

// @ts-expect-error - 无法安全断言
const num: number = data

// ✅ 正确的做法是使用类型守卫
if (typeof data === 'object' && data !== null && 'value' in data) {
  const obj = data as { value: number }
  const validNum: number = obj.value
}
```

**自动检测未使用的注释：**

```typescript
// TypeScript 会自动检测
function processString(value: string) {
  return value.toUpperCase()
}

// @ts-expect-error - 预期参数类型错误
processString(123) // ✅ 有错误，注释有效

// 修复代码后
function processFixed(value: string | number) {
  return String(value).toUpperCase()
}

// @ts-expect-error
processFixed(123) // ⚠️ Error: Unused '@ts-expect-error' directive

// 应该移除注释
processFixed(123) // ✅ 现在类型正确
```

## 4. 🤔 @ts-expect-error 在测试中如何使用？

在测试中，`@ts-expect-error` 可以验证类型系统的正确性：

```typescript
// 测试类型约束
function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error('Division by zero')
  }
  return a / b
}

describe('divide function', () => {
  it('should divide two numbers', () => {
    expect(divide(10, 2)).toBe(5)
  })

  it('should reject non-number arguments', () => {
    // @ts-expect-error - 测试类型检查
    expect(() => divide('10', 2)).toThrow()

    // @ts-expect-error - 测试类型检查
    expect(() => divide(10, '2')).toThrow()
  })

  it('should throw on division by zero', () => {
    expect(() => divide(10, 0)).toThrow('Division by zero')
  })
})

// 测试泛型约束
function identity<T extends string | number>(value: T): T {
  return value
}

describe('identity function', () => {
  it('should accept string or number', () => {
    expect(identity('hello')).toBe('hello')
    expect(identity(42)).toBe(42)
  })

  it('should reject other types', () => {
    // @ts-expect-error - boolean 不被接受
    identity(true)

    // @ts-expect-error - 对象不被接受
    identity({ value: 1 })
  })
})

// 测试只读属性
interface ReadonlyUser {
  readonly id: number
  readonly name: string
}

describe('ReadonlyUser', () => {
  it('should not allow property modification', () => {
    const user: ReadonlyUser = {
      id: 1,
      name: 'Alice',
    }

    // @ts-expect-error - 只读属性不能修改
    user.id = 2

    // @ts-expect-error - 只读属性不能修改
    user.name = 'Bob'
  })
})

// 测试类型守卫
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

describe('isString type guard', () => {
  it('should narrow type correctly', () => {
    const value: unknown = 'hello'

    if (isString(value)) {
      // ✅ 类型被收窄为 string
      expect(value.toUpperCase()).toBe('HELLO')
    }
  })

  it('should reject non-string operations before guard', () => {
    const value: unknown = 'hello'

    // @ts-expect-error - unknown 类型不能调用 string 方法
    value.toUpperCase()
  })
})

// 测试函数重载
function format(value: string): string
function format(value: number): string
function format(value: string | number): string {
  return String(value)
}

describe('format function overloads', () => {
  it('should accept string or number', () => {
    expect(format('hello')).toBe('hello')
    expect(format(42)).toBe('42')
  })

  it('should reject boolean', () => {
    // @ts-expect-error - boolean 不在重载签名中
    format(true)
  })
})

// 测试类的访问修饰符
class BankAccount {
  private balance: number = 0

  deposit(amount: number) {
    this.balance += amount
  }

  getBalance() {
    return this.balance
  }
}

describe('BankAccount', () => {
  it('should not allow direct access to private property', () => {
    const account = new BankAccount()

    // @ts-expect-error - private 属性不能直接访问
    account.balance = 1000

    // ✅ 应该使用公共方法
    account.deposit(1000)
    expect(account.getBalance()).toBe(1000)
  })
})
```

## 5. 🤔 如何处理未使用的 @ts-expect-error？

当代码修复后，需要及时移除未使用的 `@ts-expect-error`：

```typescript
// 场景 1：类型定义更新后
// 假设第三方库更新了类型定义
import { SomeAPI } from 'external-library'

// 旧版本需要此注释
// @ts-expect-error - 旧版本类型定义有误
// const api = new SomeAPI({ config: 'value' });

// 新版本修复后
const api = new SomeAPI({ config: 'value' }) // ✅ 移除注释

// 场景 2：代码重构后
// 重构前
function oldFunction(x: string) {
  return x.toUpperCase()
}

// @ts-expect-error - 参数类型不匹配
// oldFunction(123);

// 重构后支持多种类型
function newFunction(x: string | number) {
  return String(x).toUpperCase()
}

// ⚠️ 如果忘记移除注释
// @ts-expect-error
newFunction(123) // Unused '@ts-expect-error' directive

// ✅ 应该移除
newFunction(123)

// 场景 3：接口扩展后
// 原始接口
interface OldConfig {
  port: number
}

// @ts-expect-error - 属性不存在
// const config: OldConfig = {
//   port: 3000,
//   host: 'localhost'
// };

// 扩展接口后
interface NewConfig {
  port: number
  host: string
}

const config: NewConfig = {
  port: 3000,
  host: 'localhost', // ✅ 现在是有效的
}

// 场景 4：使用自动化工具检测
// 配置 ESLint 规则
// .eslintrc.js
module.exports = {
  rules: {
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description',
        minimumDescriptionLength: 10,
      },
    ],
  },
}

// 必须提供描述
// @ts-expect-error - 等待 API v2 类型定义更新
const result = apiCall()

// ❌ 错误：描述太短
// @ts-expect-error - 修复
const result2 = apiCall()

// 场景 5：定期审查
// 使用 grep 或搜索工具查找所有 @ts-expect-error
// 在 CI/CD 中添加检查脚本

// 脚本示例
// scripts/check-expect-errors.js
const fs = require('fs')
const path = require('path')

function findExpectErrors(dir) {
  const files = fs.readdirSync(dir)
  const errors = []

  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      errors.push(...findExpectErrors(filePath))
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const content = fs.readFileSync(filePath, 'utf-8')
      const lines = content.split('\n')

      lines.forEach((line, index) => {
        if (line.includes('@ts-expect-error')) {
          errors.push({
            file: filePath,
            line: index + 1,
            content: line.trim(),
          })
        }
      })
    }
  })

  return errors
}

// 生成报告
const errors = findExpectErrors('./src')
console.log(`Found ${errors.length} @ts-expect-error comments`)
errors.forEach((error) => {
  console.log(`${error.file}:${error.line} - ${error.content}`)
})
```

## 6. 🤔 使用 @ts-expect-error 时需要注意哪些问题？

使用 `@ts-expect-error` 时需要注意以下几点：

```typescript
// 注意 1：只影响下一行
// @ts-expect-error
let x: number = 'hello'; // ✅ 被忽略

let y: number = 'world'; // ❌ 仍然报错，不在作用范围内

// 注意 2：添加说明注释
// ❌ 不好：没有说明原因
// @ts-expect-error
const data = apiCall();

// ✅ 好：清楚说明原因和计划
// @ts-expect-error - 等待 API 类型定义更新（预计 2024-12）
// Issue: https://github.com/project/issues/123
const data = apiCall();

// 注意 3：不要过度使用
// ❌ 不好：大量使用表明设计有问题
// @ts-expect-error
const a = getValue();
// @ts-expect-error
const b = getValue();
// @ts-expect-error
const c = getValue();

// ✅ 好：修复根本问题
function getValue(): any { // 明确返回 any
  return complexOperation();
}
const a = getValue();
const b = getValue();
const c = getValue();

// 注意 4：与类型断言的选择
interface Data {
  value: number;
}

// ⚠️ 使用 @ts-expect-error
const data1: unknown = { value: 42 };
// @ts-expect-error
const typed1: Data = data1;

// ✅ 更好：使用类型断言
const data2: unknown = { value: 42 };
const typed2 = data2 as Data;

// 注意 5：测试之外少用
// ✅ 测试中使用是合适的
describe('Type checking', () => {
  it('should reject invalid types', () => {
    // @ts-expect-error
    expect(() => process(123)).toThrow();
  });
});

// ⚠️ 业务代码中应该修复类型
// @ts-expect-error - 不推荐在业务代码中使用
function businessLogic(data: any) {
  return data.value;
}

// ✅ 应该明确类型
interface BusinessData {
  value: number;
}

function betterBusinessLogic(data: BusinessData) {
  return data.value;
}

// 注意 6：版本控制中的管理
// 提交时应该审查
// git diff 中看到大量 @ts-expect-error 是警告信号

// 注意 7：与团队规范保持一致
// 团队应该统一约定何时使用
// 建议在代码规范文档中明确说明

// 例如：
// 1. 优先修复类型错误
// 2. 无法立即修复时使用 @ts-expect-error
// 3. 必须添加说明和 issue 链接
// 4. 定期审查和清理

// 注意 8：配合 linter 规则
// tsconfig.json
{
  "compilerOptions": {
    "strict": true
  }
}

// .eslintrc.js
module.exports = {
  rules: {
    // 要求 @ts-expect-error 必须有描述
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description',
        'minimumDescriptionLength': 20
      }
    ],

    // 禁止未使用的 @ts-expect-error
    '@typescript-eslint/prefer-ts-expect-error': 'error'
  }
};

// 注意 9：文档化决策
/**
 * 处理遗留系统数据
 *
 * @ts-expect-error - 遗留系统返回的数据结构不一致
 * 等待系统升级到 v3.0 后移除此注释
 * 参考：TECH-DEBT-123
 */
function processLegacyData(data: any) {
  return data.value || data.val || data.v;
}

// 注意 10：监控和度量
// 定期统计项目中的 @ts-expect-error 数量
// 设定目标逐步减少

// 示例：生成统计报告
// scripts/stats.js
const { execSync } = require('child_process');

const count = execSync(
  'grep -r "@ts-expect-error" src/ | wc -l'
).toString().trim();

console.log(`Total @ts-expect-error comments: ${count}`);

// 设定阈值
const threshold = 50;
if (parseInt(count) > threshold) {
  console.error(`Too many @ts-expect-error comments (${count} > ${threshold})`);
  process.exit(1);
}
```

## 7. 🔗 引用

- [TypeScript 3.9 Release Notes - @ts-expect-error][1]
- [TypeScript Handbook - Comment Directives][2]
- [ESLint TypeScript - ban-ts-comment][3]

[1]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#-ts-expect-error-comments
[2]: https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html#ts-check
[3]: https://typescript-eslint.io/rules/ban-ts-comment
