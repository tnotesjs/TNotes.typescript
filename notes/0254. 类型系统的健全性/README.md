# [0254. 类型系统的健全性](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0254.%20%E7%B1%BB%E5%9E%8B%E7%B3%BB%E7%BB%9F%E7%9A%84%E5%81%A5%E5%85%A8%E6%80%A7)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是类型系统健全性？](#3--什么是类型系统健全性)
  - [3.1. 健全性的定义](#31-健全性的定义)
  - [3.2. 不健全的表现](#32-不健全的表现)
  - [3.3. 健全 vs. 不健全](#33-健全-vs-不健全)
- [4. 🤔 TypeScript 的非健全性设计？](#4--typescript-的非健全性设计)
  - [4.1. any 类型](#41-any-类型)
  - [4.2. 类型断言](#42-类型断言)
  - [4.3. 函数参数双向协变](#43-函数参数双向协变)
  - [4.4. 数组协变](#44-数组协变)
  - [4.5. 空值检查的不完整性](#45-空值检查的不完整性)
- [5. 🤔 为什么 TypeScript 不追求完全健全？](#5--为什么-typescript-不追求完全健全)
  - [5.1. 与 JavaScript 兼容](#51-与-javascript-兼容)
  - [5.2. 表达常见模式](#52-表达常见模式)
  - [5.3. 渐进式采用](#53-渐进式采用)
  - [5.4. 开发者生产力](#54-开发者生产力)
- [6. 🤔 如何避免不健全性带来的问题？](#6--如何避免不健全性带来的问题)
  - [6.1. 启用严格模式](#61-启用严格模式)
  - [6.2. 避免使用 any](#62-避免使用-any)
  - [6.3. 谨慎使用类型断言](#63-谨慎使用类型断言)
  - [6.4. 使用只读数组](#64-使用只读数组)
- [7. 🤔 健全性与实用性的权衡？](#7--健全性与实用性的权衡)
  - [7.1. 不同语言的权衡](#71-不同语言的权衡)
  - [7.2. TypeScript 的设计哲学](#72-typescript-的设计哲学)
  - [7.3. 实践建议](#73-实践建议)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 类型系统健全性的概念
- TypeScript 的非健全性设计
- 不追求完全健全的原因
- 避免不健全性问题的方法
- 健全性与实用性的权衡

## 2. 🫧 评价

TypeScript 是一个非健全的类型系统，这是设计上的权衡。

- 优先实用性而非理论健全性
- 与 JavaScript 生态系统兼容
- 提供逃生舱口（any、类型断言）
- 理解非健全性有助于避免问题
- 通过最佳实践可以接近健全性

## 3. 🤔 什么是类型系统健全性？

健全的类型系统保证编译通过的程序在运行时不会发生类型错误。

### 3.1. 健全性的定义

```typescript
// 健全类型系统的保证：
// 如果程序通过类型检查，则运行时不会发生类型错误

// ✅ 理想的健全类型系统
function add(a: number, b: number): number {
  return a + b
}

add(1, 2) // ✅ 编译通过，运行时正确
// add(1, "2");  // ❌ 编译错误，避免运行时错误

// 健全性保证：
// 1. 类型检查通过 → 运行时类型安全
// 2. 不存在编译通过但运行时类型错误的情况
```

### 3.2. 不健全的表现

```typescript
// ⚠️ TypeScript 允许的不健全行为

// 示例 1：数组协变
const numbers: number[] = [1, 2, 3]
const values: (number | string)[] = numbers // ✅ 允许

values.push('hello') // ✅ 编译通过
// numbers 现在包含字符串：[1, 2, 3, "hello"]
// ❌ 运行时：numbers[3].toFixed() 会报错

// 示例 2：函数参数双向协变（在非 strict 模式下）
type Handler = (value: string | number) => void

const handler: Handler = (value: string) => {
  console.log(value.toUpperCase()) // ⚠️ 假设是 string
}

handler(42) // ✅ 编译通过（非 strict 模式）
// ❌ 运行时：value.toUpperCase() 报错
```

### 3.3. 健全 vs. 不健全

```typescript
// 健全类型系统（Haskell、ML 等）
// 严格保证：编译通过 = 运行时类型安全

// 不健全类型系统（TypeScript、Flow 等）
// 权衡：编译通过 ≈ 运行时类型安全（有例外）

// TypeScript 的立场：
// "TypeScript 的类型系统允许某些在编译时无法确认其安全性的操作"
```

## 4. 🤔 TypeScript 的非健全性设计？

TypeScript 有意引入了一些不健全的特性。

### 4.1. any 类型

```typescript
// ⚠️ any 破坏类型安全
let value: any = 'hello'

value.toFixed() // ✅ 编译通过
// ❌ 运行时错误：value.toFixed is not a function

// any 的传染性
function process(x: any) {
  return x.foo.bar.baz // ✅ 编译通过
}

const result = process({ foo: {} })
// ❌ 运行时错误：Cannot read property 'bar' of undefined
```

### 4.2. 类型断言

```typescript
// ⚠️ 类型断言绕过类型检查
const value = 'hello' as unknown as number

value.toFixed() // ✅ 编译通过
// ❌ 运行时错误：value.toFixed is not a function

// 双重断言
interface User {
  name: string
}

const obj = {} as User
console.log(obj.name.toUpperCase()) // ✅ 编译通过
// ❌ 运行时错误：Cannot read property 'toUpperCase' of undefined
```

### 4.3. 函数参数双向协变

```typescript
// ⚠️ 函数参数的双向协变（非 strictFunctionTypes）
interface Animal {
  name: string
}

interface Dog extends Animal {
  bark(): void
}

type AnimalHandler = (animal: Animal) => void
type DogHandler = (dog: Dog) => void

const handleAnimal: AnimalHandler = (animal) => {
  console.log(animal.name)
}

const handleDog: DogHandler = (dog) => {
  dog.bark() // ⚠️ 假设是 Dog
}

// ⚠️ 允许赋值（不健全）
const handler: DogHandler = handleAnimal

const dog: Dog = { name: 'Rex', bark: () => console.log('Woof!') }
handler(dog) // ✅ 正常工作

// 但可能导致问题：
// handleDog({ name: "Generic" } as Dog);
// ❌ 运行时错误：bark is not a function
```

### 4.4. 数组协变

```typescript
// ⚠️ 数组的协变性
const dogs: Dog[] = [{ name: 'Rex', bark: () => {} }]
const animals: Animal[] = dogs // ✅ 允许

animals.push({ name: 'Cat' }) // ✅ 编译通过
// dogs 现在包含 Cat（不是 Dog）

dogs[1].bark() // ❌ 运行时错误：bark is not a function
```

### 4.5. 空值检查的不完整性

```typescript
// ⚠️ strictNullChecks 的局限
interface User {
  name: string
  email?: string
}

function getEmail(user: User): string {
  return user.email! // ✅ 非空断言绕过检查
}

const user: User = { name: 'Tom' }
const email = getEmail(user)
console.log(email.toUpperCase()) // ❌ 运行时错误
```

## 5. 🤔 为什么 TypeScript 不追求完全健全？

TypeScript 为了实用性有意做出权衡。

### 5.1. 与 JavaScript 兼容

```typescript
// ✅ TypeScript 需要兼容 JavaScript 的动态特性

// JavaScript 的动态行为
const obj: any = JSON.parse('{"name": "Tom"}')
console.log(obj.name) // 运行时才知道类型

// 如果要求完全健全，很多 JavaScript 模式无法表达
```

### 5.2. 表达常见模式

```typescript
// ✅ 数组协变支持常见模式
class Animal {}
class Dog extends Animal {}

function printAnimals(animals: Animal[]) {
  animals.forEach((a) => console.log(a))
}

const dogs: Dog[] = [new Dog(), new Dog()]
printAnimals(dogs) // ✅ 这是安全的读取操作

// 如果完全健全，这种常见用法会被禁止
```

### 5.3. 渐进式采用

```typescript
// ✅ any 允许渐进式迁移
// 从 JavaScript 迁移到 TypeScript

// 阶段 1：添加基本类型
let count: any = 42 // 先用 any
count = 'hello' // 允许

// 阶段 2：细化类型
let count2: number | string = 42
count2 = 'hello'

// 如果要求完全健全，迁移成本会很高
```

### 5.4. 开发者生产力

```typescript
// ✅ 类型断言提供逃生舱口
const input = document.getElementById('input') as HTMLInputElement
console.log(input.value) // 开发者知道这是安全的

// 完全健全的系统可能需要冗长的类型守卫：
const input2 = document.getElementById('input')
if (input2 instanceof HTMLInputElement) {
  console.log(input2.value)
}
```

## 6. 🤔 如何避免不健全性带来的问题？

通过最佳实践可以接近健全性。

### 6.1. 启用严格模式

```typescript
// ✅ tsconfig.json
{
  "compilerOptions": {
    "strict": true,                      // 启用所有严格检查
    "strictNullChecks": true,           // 严格空值检查
    "strictFunctionTypes": true,        // 严格函数类型检查
    "noImplicitAny": true,              // 禁止隐式 any
    "strictPropertyInitialization": true // 严格属性初始化
  }
}
```

### 6.2. 避免使用 any

```typescript
// ❌ 使用 any
function process(data: any) {
  return data.value
}

// ✅ 使用 unknown + 类型守卫
function process2(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: unknown }).value
  }
  throw new Error('Invalid data')
}

// ✅ 使用具体类型
interface Data {
  value: number
}

function process3(data: Data) {
  return data.value
}
```

### 6.3. 谨慎使用类型断言

```typescript
// ❌ 不安全的断言
const value = input as number

// ✅ 使用类型守卫
function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

if (isNumber(input)) {
  const value: number = input // ✅ 安全
}

// ✅ 使用运行时验证
import { z } from 'zod'

const schema = z.number()
const value = schema.parse(input) // 运行时验证
```

### 6.4. 使用只读数组

```typescript
// ⚠️ 可变数组的协变问题
const numbers: number[] = [1, 2, 3]
const values: any[] = numbers
values.push('hello') // ❌ 破坏 numbers 的类型

// ✅ 使用 readonly 避免修改
const numbers2: readonly number[] = [1, 2, 3]
// const values2: readonly any[] = numbers2;
// values2.push("hello");  // ❌ 编译错误：push 不存在

// ✅ 函数参数使用 readonly
function sum(numbers: readonly number[]): number {
  // numbers.push(0);  // ❌ 编译错误
  return numbers.reduce((a, b) => a + b, 0)
}
```

## 7. 🤔 健全性与实用性的权衡？

TypeScript 在健全性和实用性之间找到平衡。

### 7.1. 不同语言的权衡

```typescript
// Haskell：完全健全
// - 优点：类型安全绝对保证
// - 缺点：学习曲线陡峭，表达某些模式困难

// Java/C#：较健全（有逃生舱口）
// - 有类型擦除、反射等不健全特性
// - 平衡了安全性和实用性

// TypeScript：实用优先
// - 与 JavaScript 完全兼容
// - 提供多种逃生舱口
// - 渐进式类型检查
```

### 7.2. TypeScript 的设计哲学

```typescript
// TypeScript 设计目标（按优先级）：
// 1. 与 JavaScript 的兼容性
// 2. 捕获常见错误
// 3. 保持编译速度
// 4. 类型系统的表达力
// 5. 健全性（最低优先级）

// 这意味着：
// - 不是为了理论完美
// - 是为了实际开发体验
// - 允许开发者在需要时绕过类型系统
```

### 7.3. 实践建议

```typescript
// ✅ 平衡安全性和生产力

// 1. 默认使用严格模式
// 2. 尽量避免 any
// 3. 谨慎使用类型断言
// 4. 对外部数据进行运行时验证
// 5. 使用 readonly 保护数据
// 6. 信任类型系统，但在关键路径添加运行时检查

// 示例：API 数据验证
import { z } from 'zod'

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
})

type User = z.infer<typeof UserSchema>

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`)
  const data = await response.json()

  // ✅ 运行时验证确保类型安全
  return UserSchema.parse(data)
}
```

## 8. 🔗 引用

- [TypeScript Design Goals][1]
- [Type System Soundness][2]
- [Strictness in TypeScript][3]

[1]: https://github.com/Microsoft/TypeScript/wiki/TypeScript-Design-Goals
[2]: https://www.typescriptlang.org/docs/handbook/type-compatibility.html
[3]: https://www.typescriptlang.org/tsconfig#strict
