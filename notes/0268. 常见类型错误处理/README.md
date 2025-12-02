# [0268. 常见类型错误处理](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0268.%20%E5%B8%B8%E8%A7%81%E7%B1%BB%E5%9E%8B%E9%94%99%E8%AF%AF%E5%A4%84%E7%90%86)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 类型不匹配错误？](#3--类型不匹配错误)
  - [3.1. 基本类型不匹配](#31-基本类型不匹配)
  - [3.2. 函数参数类型](#32-函数参数类型)
  - [3.3. 返回类型不匹配](#33-返回类型不匹配)
  - [3.4. 对象属性类型](#34-对象属性类型)
- [4. 🤔 undefined/null 错误？](#4--undefinednull-错误)
  - [4.1. 可能为 undefined](#41-可能为-undefined)
  - [4.2. 数组方法返回 undefined](#42-数组方法返回-undefined)
  - [4.3. 对象属性可能不存在](#43-对象属性可能不存在)
- [5. 🤔 any 类型滥用？](#5--any-类型滥用)
  - [5.1. any 的问题](#51-any-的问题)
  - [5.2. unknown 替代 any](#52-unknown-替代-any)
  - [5.3. 渐进式类型化](#53-渐进式类型化)
- [6. 🤔 类型收窄问题？](#6--类型收窄问题)
  - [6.1. typeof 类型守卫](#61-typeof-类型守卫)
  - [6.2. instanceof 类型守卫](#62-instanceof-类型守卫)
  - [6.3. in 操作符类型守卫](#63-in-操作符类型守卫)
  - [6.4. 自定义类型守卫](#64-自定义类型守卫)
- [7. 🤔 泛型错误？](#7--泛型错误)
  - [7.1. 泛型约束](#71-泛型约束)
  - [7.2. 泛型默认值](#72-泛型默认值)
  - [7.3. 泛型类型推断](#73-泛型类型推断)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 类型不匹配处理
- undefined/null 处理
- any 类型问题
- 类型收窄技巧
- 泛型错误处理

## 2. 🫧 评价

TypeScript 开发中会遇到各种类型错误，掌握常见错误的处理方法能显著提升开发效率。

- 快速定位错误原因
- 掌握正确解决方案
- 避免使用 any 逃避
- 提升类型安全性
- 减少运行时错误

## 3. 🤔 类型不匹配错误？

### 3.1. 基本类型不匹配

```ts
// ❌ 错误
let age: number = '25'
// Error: Type 'string' is not assignable to type 'number'

// ✅ 正确
let age: number = 25
// 或使用类型转换
let age: number = Number('25')
let age: number = parseInt('25', 10)
```

### 3.2. 函数参数类型

```ts
function greet(name: string): string {
  return `Hello, ${name}`
}

// ❌ 错误
greet(123)
// Error: Argument of type 'number' is not assignable to parameter of type 'string'

// ✅ 正确
greet('Tom')
greet(String(123))
```

### 3.3. 返回类型不匹配

```ts
// ❌ 错误
function getAge(): number {
  return '25' // Error: Type 'string' is not assignable to type 'number'
}

// ✅ 正确
function getAge(): number {
  return 25
}

// ✅ 或修改返回类型
function getAge(): string | number {
  return '25'
}
```

### 3.4. 对象属性类型

```ts
interface User {
  name: string
  age: number
}

// ❌ 错误
const user: User = {
  name: 'Tom',
  age: '25', // Error
}

// ✅ 正确
const user: User = {
  name: 'Tom',
  age: 25,
}
```

## 4. 🤔 undefined/null 错误？

### 4.1. 可能为 undefined

```ts
function getUserName(user?: { name: string }): string {
  // ❌ 错误
  return user.name
  // Error: 'user' is possibly 'undefined'

  // ✅ 正确方法1：可选链
  return user?.name ?? 'Guest'

  // ✅ 正确方法2：类型守卫
  if (user) {
    return user.name
  }
  return 'Guest'

  // ✅ 正确方法3：非空断言（确定不为 undefined 时）
  return user!.name
}
```

### 4.2. 数组方法返回 undefined

```ts
const numbers = [1, 2, 3]

// ❌ 错误
const first: number = numbers.find((n) => n > 5)
// Error: Type 'number | undefined' is not assignable to type 'number'

// ✅ 正确方法1：联合类型
const first: number | undefined = numbers.find((n) => n > 5)

// ✅ 正确方法2：提供默认值
const first: number = numbers.find((n) => n > 5) ?? 0

// ✅ 正确方法3：类型守卫
const found = numbers.find((n) => n > 5)
if (found !== undefined) {
  const first: number = found
}
```

### 4.3. 对象属性可能不存在

```ts
interface Config {
  port?: number
}

function startServer(config: Config) {
  // ❌ 错误
  const port: number = config.port
  // Error: Type 'number | undefined' is not assignable to type 'number'

  // ✅ 正确方法1：提供默认值
  const port: number = config.port ?? 3000

  // ✅ 正确方法2：类型断言（确定存在时）
  const port: number = config.port!

  // ✅ 正确方法3：类型守卫
  if (config.port !== undefined) {
    const port: number = config.port
  }
}
```

## 5. 🤔 any 类型滥用？

### 5.1. any 的问题

```ts
// ❌ 使用 any 失去类型检查
function process(data: any) {
  return data.value.toString() // 运行时可能出错，但编译不报错
}

// ✅ 使用具体类型
interface Data {
  value: number
}

function process(data: Data) {
  return data.value.toString()
}

// ✅ 或使用泛型
function process<T extends { value: unknown }>(data: T) {
  return String(data.value)
}
```

### 5.2. unknown 替代 any

```ts
// ❌ any 不安全
function parse(json: string): any {
  return JSON.parse(json)
}

const result = parse('{"name":"Tom"}')
console.log(result.age.toString()) // 运行时错误

// ✅ unknown 更安全
function parse(json: string): unknown {
  return JSON.parse(json)
}

const result = parse('{"name":"Tom"}')
// console.log(result.age);  // ❌ Error: 'result' is of type 'unknown'

// ✅ 需要类型检查
if (typeof result === 'object' && result !== null && 'name' in result) {
  console.log(result.name)
}
```

### 5.3. 渐进式类型化

```ts
// 阶段1：使用 any（临时）
function legacy(): any {
  return { value: 42 }
}

// 阶段2：定义接口
interface LegacyResult {
  value: number
}

function legacy(): LegacyResult {
  return { value: 42 }
}
```

## 6. 🤔 类型收窄问题？

### 6.1. typeof 类型守卫

```ts
function process(value: string | number) {
  // ❌ 错误
  return value.toUpperCase()
  // Error: Property 'toUpperCase' does not exist on type 'number'

  // ✅ 正确
  if (typeof value === 'string') {
    return value.toUpperCase()
  }
  return value.toString()
}
```

### 6.2. instanceof 类型守卫

```ts
class Dog {
  bark() {
    console.log('Woof!')
  }
}

class Cat {
  meow() {
    console.log('Meow!')
  }
}

function makeSound(animal: Dog | Cat) {
  // ❌ 错误
  animal.bark() // Error

  // ✅ 正确
  if (animal instanceof Dog) {
    animal.bark()
  } else {
    animal.meow()
  }
}
```

### 6.3. in 操作符类型守卫

```ts
interface Bird {
  fly(): void
}

interface Fish {
  swim(): void
}

function move(animal: Bird | Fish) {
  // ❌ 错误
  animal.fly() // Error

  // ✅ 正确
  if ('fly' in animal) {
    animal.fly()
  } else {
    animal.swim()
  }
}
```

### 6.4. 自定义类型守卫

```ts
interface User {
  name: string
  age: number
}

// ❌ 类型断言不安全
function isUser(value: unknown): value is User {
  return true // ⚠️ 不检查就返回 true
}

// ✅ 正确的类型守卫
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    typeof (value as User).name === 'string' &&
    'age' in value &&
    typeof (value as User).age === 'number'
  )
}

function process(value: unknown) {
  if (isUser(value)) {
    console.log(value.name, value.age) // ✅ 类型安全
  }
}
```

## 7. 🤔 泛型错误？

### 7.1. 泛型约束

```ts
// ❌ 错误：没有约束
function getProperty<T>(obj: T, key: string) {
  return obj[key] // Error: Type 'string' cannot be used to index type 'T'
}

// ✅ 正确：使用 keyof 约束
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user = { name: 'Tom', age: 25 }
const name = getProperty(user, 'name') // ✅ 类型安全
```

### 7.2. 泛型默认值

```ts
// ❌ 可能的问题
function createArray<T>(length: number, value: T): T[] {
  return Array(length).fill(value)
}

// 调用时必须指定类型
createArray<number>(3, 0)

// ✅ 提供默认值
function createArray<T = number>(length: number, value: T): T[] {
  return Array(length).fill(value)
}

// 可以省略类型参数
createArray(3, 0) // ✅ 类型推断为 number[]
```

### 7.3. 泛型类型推断

```ts
// ❌ 推断失败
function identity<T>(value: T): T {
  return value
}

const result = identity({ name: 'Tom' })
// result 类型：{ name: string }

// ✅ 显式指定更精确的类型
const result = identity<{ name: string; age?: number }>({ name: 'Tom' })
```

## 8. 🔗 引用

- [TypeScript Handbook][1]
- [Type Narrowing][2]
- [Type Guards][3]

[1]: https://www.typescriptlang.org/docs/handbook/intro.html
[2]: https://www.typescriptlang.org/docs/handbook/2/narrowing.html
[3]: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
