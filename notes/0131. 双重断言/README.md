# [0131. 双重断言](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0131.%20%E5%8F%8C%E9%87%8D%E6%96%AD%E8%A8%80)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是双重断言？](#3--什么是双重断言)
- [4. 🤔 为什么需要双重断言？](#4--为什么需要双重断言)
  - [4.1. 单次断言的限制](#41-单次断言的限制)
  - [4.2. TypeScript 的断言规则](#42-typescript-的断言规则)
- [5. 🤔 双重断言的语法](#5--双重断言的语法)
  - [5.1. 使用 unknown 中转](#51-使用-unknown-中转)
  - [5.2. 使用 any 中转](#52-使用-any-中转)
  - [5.3. as const 与双重断言](#53-as-const-与双重断言)
- [6. 🤔 使用场景](#6--使用场景)
  - [6.1. 场景 1：处理第三方库类型错误](#61-场景-1处理第三方库类型错误)
  - [6.2. 场景 2：处理 DOM API 限制](#62-场景-2处理-dom-api-限制)
  - [6.3. 场景 3：测试和 Mock](#63-场景-3测试和-mock)
  - [6.4. 场景 4：类型迁移](#64-场景-4类型迁移)
- [7. 🤔 危险性和替代方案](#7--危险性和替代方案)
  - [7.1. 危险示例](#71-危险示例)
  - [7.2. 替代方案 1：类型守卫](#72-替代方案-1类型守卫)
  - [7.3. 替代方案 2：Zod 等运行时验证](#73-替代方案-2zod-等运行时验证)
  - [7.4. 替代方案 3：重构类型设计](#74-替代方案-3重构类型设计)
  - [7.5. 替代方案 4：使用泛型](#75-替代方案-4使用泛型)
  - [7.6. 替代方案 5：显式的不安全函数](#76-替代方案-5显式的不安全函数)
- [8. 🤔 常见错误和最佳实践](#8--常见错误和最佳实践)
  - [8.1. 错误 1：滥用双重断言](#81-错误-1滥用双重断言)
  - [8.2. 错误 2：隐藏类型错误](#82-错误-2隐藏类型错误)
  - [8.3. 错误 3：不必要的断言](#83-错误-3不必要的断言)
  - [8.4. 最佳实践](#84-最佳实践)
- [9. 🔗 引用](#9--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 双重断言的概念和机制
- 单次断言的限制
- 双重断言的使用场景
- 潜在危险和替代方案
- 最佳实践和建议

## 2. 🫧 评价

双重断言（Double Assertion）是 TypeScript 中**通过 unknown 或 any 中转，强制断言到任意类型**的技术。

双重断言的特点：

- **绕过类型检查**：可以断言到不相关的类型
- **极度危险**：容易引入运行时错误
- **最后手段**：只在别无选择时使用
- **需要注释**：必须说明使用原因

单次断言 vs 双重断言：

| 特性         | 单次断言 | 双重断言 |
| ------------ | -------- | -------- |
| **类型限制** | 必须兼容 | 无限制   |
| **安全性**   | 相对安全 | 极度危险 |
| **使用场景** | 类型细化 | 类型强转 |
| **推荐度**   | 谨慎使用 | 极力避免 |

双重断言的问题：

1. **运行时错误**：类型不匹配导致崩溃
2. **失去类型保护**：绕过类型系统
3. **维护困难**：隐藏真实的类型问题
4. **代码异味**：通常表示设计问题

理解双重断言，能帮助你：

1. 识别代码中的危险模式
2. 寻找更好的替代方案
3. 重构不合理的类型断言
4. 提高代码的类型安全性

双重断言是 TypeScript 的"逃生舱口"，应该**极力避免使用**。

## 3. 🤔 什么是双重断言？

双重断言是**先断言到 unknown 或 any，再断言到目标类型**的两步断言过程。

```ts
// ✅ 单次断言（类型兼容）
const num = 123
const str = num as unknown as string // 不推荐但可行

// ❌ 直接断言不兼容的类型会报错
interface Cat {
  meow(): void
}

interface Dog {
  bark(): void
}

const cat: Cat = { meow: () => console.log('meow') }
// const dog = cat as Dog  // ❌ Error: Cat 和 Dog 不兼容

// ⚠️ 双重断言可以绕过限制（危险）
const dog = cat as unknown as Dog // 编译通过，但运行时危险
// dog.bark()  // 运行时错误：bark is not a function
```

**关键概念**：

- **第一次断言**：转为 unknown 或 any
- **第二次断言**：从 unknown/any 转为目标类型
- **绕过检查**：TypeScript 不再验证类型兼容性
- **运行时风险**：可能导致运行时错误

## 4. 🤔 为什么需要双重断言？

### 4.1. 单次断言的限制

```ts
// ✅ 单次断言要求类型重叠
interface Person {
  name: string
  age: number
}

interface Employee {
  name: string
  id: number
}

const person: Person = { name: 'Alice', age: 30 }

// ❌ 直接断言失败（类型不重叠）
// const employee = person as Employee  // Error

// ✅ 有重叠属性的类型可以断言
const partialEmployee = person as Partial<Employee> // ✅
```

### 4.2. TypeScript 的断言规则

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
// const value4 = 123 as string  // Error: number 和 string 无重叠
// const value5 = {} as number  // Error: {} 和 number 无重叠

// ⚠️ 双重断言绕过限制
const value6 = 123 as unknown as string // 危险但可行
```

## 5. 🤔 双重断言的语法

### 5.1. 使用 unknown 中转

```ts
// ✅ 推荐：使用 unknown（更安全）
const value = 123
const str1 = value as unknown as string

// unknown 是类型安全的顶层类型
// 必须进行类型检查才能使用
```

### 5.2. 使用 any 中转

```ts
// ⚠️ 不推荐：使用 any（更危险）
const value = 123
const str2 = value as any as string

// any 会完全关闭类型检查
// 更容易引入错误
```

### 5.3. as const 与双重断言

```ts
// ✅ as const 不需要双重断言
const config = {
  port: 3000,
  host: 'localhost',
} as const

// ❌ 错误用法
// const mutable = config as unknown as { port: number; host: string }

// ✅ 正确做法：移除 readonly
type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}

const mutable: Mutable<typeof config> = { ...config }
```

## 6. 🤔 使用场景

### 6.1. 场景 1：处理第三方库类型错误

```ts
// ⚠️ 第三方库类型定义错误或过时
import { SomeLibraryType } from 'old-library'

interface CorrectType {
  id: number
  name: string
  // 实际运行时有这个属性，但类型定义没有
  email: string
}

const data: SomeLibraryType = getDataFromLibrary()

// 双重断言修复类型
const corrected = data as unknown as CorrectType

// ✅ 更好的做法：扩展类型定义
declare module 'old-library' {
  interface SomeLibraryType {
    email: string
  }
}
```

### 6.2. 场景 2：处理 DOM API 限制

```ts
// ⚠️ DOM API 返回通用类型
const element = document.getElementById('myCanvas')

// ❌ 直接断言可能失败
// const canvas = element as HTMLCanvasElement  // 可能 null

// ⚠️ 双重断言
const canvas = element as unknown as HTMLCanvasElement

// ✅ 更好的做法：类型守卫
function isHTMLCanvasElement(el: Element | null): el is HTMLCanvasElement {
  return el !== null && el.tagName === 'CANVAS'
}

if (element && isHTMLCanvasElement(element)) {
  const ctx = element.getContext('2d')
}
```

### 6.3. 场景 3：测试和 Mock

```ts
// ⚠️ 测试中模拟复杂对象
interface ComplexService {
  method1(): void
  method2(): void
  method3(): void
  // ...很多方法
}

// 只需要模拟部分方法
const mockService = {
  method1: jest.fn(),
} as unknown as ComplexService

// ✅ 更好的做法：使用 Partial
const mockService2: Partial<ComplexService> = {
  method1: jest.fn(),
}

function useService(service: ComplexService) {
  // 确保使用的方法存在
  if (service.method1) {
    service.method1()
  }
}
```

### 6.4. 场景 4：类型迁移

```ts
// ⚠️ 从旧类型迁移到新类型
interface OldUser {
  username: string
  password: string
}

interface NewUser {
  email: string
  hashedPassword: string
}

const oldUser: OldUser = {
  username: 'alice',
  password: 'secret',
}

// 临时转换（迁移期间）
const newUser = oldUser as unknown as NewUser

// ✅ 更好的做法：编写转换函数
function migrateUser(old: OldUser): NewUser {
  return {
    email: `${old.username}@example.com`,
    hashedPassword: hashPassword(old.password),
  }
}

function hashPassword(password: string): string {
  return `hashed_${password}`
}
```

## 7. 🤔 危险性和替代方案

### 7.1. 危险示例

```ts
// ❌ 极度危险的双重断言
interface User {
  name: string
  age: number
}

const data = { name: 'Alice' } // 缺少 age

// 双重断言隐藏了类型错误
const user = data as unknown as User

console.log(user.age.toFixed()) // 运行时错误！undefined.toFixed()
```

### 7.2. 替代方案 1：类型守卫

```ts
// ✅ 使用类型守卫
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    'age' in value &&
    typeof (value as any).name === 'string' &&
    typeof (value as any).age === 'number'
  )
}

const data: unknown = { name: 'Alice', age: 30 }

if (isUser(data)) {
  console.log(data.age.toFixed()) // 类型安全 ✅
}
```

### 7.3. 替代方案 2：Zod 等运行时验证

```ts
// ✅ 使用 Zod 进行运行时验证
import { z } from 'zod'

const UserSchema = z.object({
  name: z.string(),
  age: z.number(),
})

type User = z.infer<typeof UserSchema>

const data: unknown = { name: 'Alice', age: 30 }

// 运行时验证
const result = UserSchema.safeParse(data)

if (result.success) {
  const user: User = result.data
  console.log(user.age.toFixed()) // 安全 ✅
} else {
  console.error('Invalid data:', result.error)
}
```

### 7.4. 替代方案 3：重构类型设计

```ts
// ❌ 需要双重断言的设计
interface Shape {
  type: 'circle' | 'square'
}

interface Circle {
  type: 'circle'
  radius: number
}

interface Square {
  type: 'square'
  side: number
}

const shape: Shape = getShape()
const circle = shape as unknown as Circle // 危险

// ✅ 使用判别联合类型
type ShapeUnion = Circle | Square

function getArea(shape: ShapeUnion): number {
  if (shape.type === 'circle') {
    return Math.PI * shape.radius ** 2
  } else {
    return shape.side ** 2
  }
}
```

### 7.5. 替代方案 4：使用泛型

```ts
// ❌ 双重断言处理 API 响应
async function fetchData(url: string) {
  const response = await fetch(url)
  const data = await response.json()
  return data as unknown as User // 危险
}

// ✅ 使用泛型 + 验证
async function fetchData<T>(
  url: string,
  validator: (data: unknown) => data is T
): Promise<T> {
  const response = await fetch(url)
  const data = await response.json()

  if (validator(data)) {
    return data
  }

  throw new Error('Invalid data format')
}

// 使用
const user = await fetchData('/api/user', isUser)
```

### 7.6. 替代方案 5：显式的不安全函数

```ts
// ✅ 封装双重断言，明确标记为不安全
/**
 * 不安全的类型转换
 * @warning 这个函数绕过类型检查，使用时需要确保类型正确
 */
function unsafeCast<T>(value: unknown): T {
  return value as T
}

// 使用时明确知道风险
const user = unsafeCast<User>(data)

// 或者添加运行时检查
function safeCast<T>(value: unknown, validator: (v: unknown) => v is T): T {
  if (!validator(value)) {
    throw new TypeError('Type validation failed')
  }
  return value
}
```

## 8. 🤔 常见错误和最佳实践

### 8.1. 错误 1：滥用双重断言

```ts
// ❌ 过度使用双重断言
function process(data: unknown) {
  const user = data as unknown as User
  const order = data as unknown as Order
  const product = data as unknown as Product
  // 类型完全失控
}

// ✅ 使用判别联合
type Data = User | Order | Product

function process(data: Data) {
  if ('name' in data && 'age' in data) {
    // User
  } else if ('orderId' in data) {
    // Order
  } else {
    // Product
  }
}
```

### 8.2. 错误 2：隐藏类型错误

```ts
// ❌ 用双重断言掩盖设计问题
interface ApiResponse {
  data: string // 类型定义错误，实际是对象
}

const response: ApiResponse = await fetch('/api')
const user = response.data as unknown as User // 掩盖问题

// ✅ 修复类型定义
interface ApiResponse<T> {
  data: T
}

const response: ApiResponse<User> = await fetch('/api')
const user = response.data // 类型正确
```

### 8.3. 错误 3：不必要的断言

```ts
// ❌ 不需要双重断言的场景
const value: unknown = 123
const num = value as unknown as number // 多余

// ✅ 一次断言就够
const num2 = value as number

// ✅ 或使用类型守卫
if (typeof value === 'number') {
  const num3 = value // 自动推断
}
```

### 8.4. 最佳实践

```ts
// ✅ 1. 永远优先考虑其他方案
// 检查清单：
// - 可以重构类型设计吗？
// - 可以使用类型守卫吗？
// - 可以使用泛型吗？
// - 可以使用判别联合吗？
// - 真的没有其他办法了吗？

// ✅ 2. 如果必须使用，添加详细注释
/**
 * 使用双重断言的原因：
 * - 第三方库类型定义错误
 * - 实际返回的数据比类型定义更完整
 * - 已在运行时验证数据结构
 *
 * @see https://github.com/library/issues/123
 */
const data = response as unknown as CorrectType

// ✅ 3. 封装到函数中
function convertToUser(data: unknown): User {
  // 添加运行时检查
  if (!isValidUserData(data)) {
    throw new Error('Invalid user data')
  }
  return data as unknown as User
}

function isValidUserData(data: unknown): boolean {
  // 验证逻辑
  return true
}

// ✅ 4. 使用 lint 规则限制
// .eslintrc.js
module.exports = {
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/consistent-type-assertions': [
      'error',
      {
        assertionStyle: 'as',
        objectLiteralTypeAssertions: 'never',
      },
    ],
  },
}

// ✅ 5. 记录技术债务
// TODO: 移除双重断言，重构类型定义
// @ts-expect-error - 临时解决方案，计划在 v2.0 移除
const temp = data as unknown as TempType

// ✅ 6. 创建类型安全的包装
class SafeConverter<T> {
  constructor(private validator: (value: unknown) => value is T) {}

  convert(value: unknown): T {
    if (this.validator(value)) {
      return value
    }
    throw new TypeError('Type conversion failed')
  }

  tryConvert(value: unknown): T | null {
    return this.validator(value) ? value : null
  }
}

const userConverter = new SafeConverter(isUser)
const user = userConverter.convert(data)

// ✅ 7. 单元测试覆盖
describe('type conversion', () => {
  it('should handle valid data', () => {
    const data = { name: 'Alice', age: 30 }
    const user = convertToUser(data)
    expect(user.name).toBe('Alice')
  })

  it('should throw on invalid data', () => {
    const data = { name: 'Alice' } // 缺少 age
    expect(() => convertToUser(data)).toThrow()
  })
})

// ✅ 8. 使用 branded types 增加安全性
type Brand<K, T> = K & { __brand: T }
type UserId = Brand<number, 'UserId'>

function createUserId(value: number): UserId {
  // 验证逻辑
  if (value <= 0) {
    throw new Error('Invalid user ID')
  }
  return value as UserId
}

// ✅ 9. 文档化类型假设
/**
 * 假设：
 * - API 返回的数据已经过后端验证
 * - 数据结构与 User 接口完全匹配
 * - 如果假设不成立，会在运行时检查中捕获
 */
function parseUserData(raw: unknown): User {
  // 运行时检查
  if (!isUser(raw)) {
    throw new Error('Invalid user data')
  }
  return raw
}

// ✅ 10. 渐进式重构
// 步骤 1：标记需要重构的双重断言
const user = data as unknown as User // REFACTOR: 添加类型验证

// 步骤 2：添加运行时验证
const user2 = (() => {
  const temp = data as unknown as User
  if (!isUser(temp)) {
    throw new Error('Invalid user')
  }
  return temp
})()

// 步骤 3：重构为类型安全的方案
const user3 = safeCast(data, isUser)
```

## 9. 🔗 引用

- [TypeScript Handbook - Type Assertions][1]
- [TypeScript Deep Dive - Type Assertion][2]
- [Effective TypeScript - Item 9: Prefer Type Declarations to Type Assertions][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions
[2]: https://basarat.gitbook.io/typescript/type-system/type-assertion
[3]: https://effectivetypescript.com/
