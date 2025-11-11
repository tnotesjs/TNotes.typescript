# [0081. 双向协变问题](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0081.%20%E5%8F%8C%E5%90%91%E5%8D%8F%E5%8F%98%E9%97%AE%E9%A2%98)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是双向协变问题？](#3--什么是双向协变问题)
  - [3.1. 定义](#31-定义)
  - [3.2. 问题核心](#32-问题核心)
- [4. 🤔 双向协变会导致什么问题？](#4--双向协变会导致什么问题)
  - [4.1. 问题 1：数组操作不安全](#41-问题-1数组操作不安全)
  - [4.2. 问题 2：事件处理器不安全](#42-问题-2事件处理器不安全)
  - [4.3. 问题 3：泛型函数不安全](#43-问题-3泛型函数不安全)
- [5. 🤔 为什么 TypeScript 默认允许双向协变？](#5--为什么-typescript-默认允许双向协变)
  - [5.1. 历史原因](#51-历史原因)
  - [5.2. 常见场景：事件监听](#52-常见场景事件监听)
  - [5.3. 方法的特殊处理](#53-方法的特殊处理)
- [6. 🤔 如何解决双向协变问题？](#6--如何解决双向协变问题)
  - [6.1. 解决方案 1：启用 strictFunctionTypes](#61-解决方案-1启用-strictfunctiontypes)
  - [6.2. 解决方案 2：使用函数声明而非方法](#62-解决方案-2使用函数声明而非方法)
  - [6.3. 解决方案 3：类型断言（谨慎使用）](#63-解决方案-3类型断言谨慎使用)
  - [6.4. 解决方案 4：泛型约束](#64-解决方案-4泛型约束)
- [7. 🤔 strictFunctionTypes 的影响范围](#7--strictfunctiontypes-的影响范围)
  - [7.1. 受影响的代码](#71-受影响的代码)
  - [7.2. 不受影响的代码](#72-不受影响的代码)
  - [7.3. 对比表](#73-对比表)
- [8. 🤔 实际案例分析](#8--实际案例分析)
  - [8.1. 案例 1：数组方法](#81-案例-1数组方法)
  - [8.2. 案例 2：React 事件处理](#82-案例-2react-事件处理)
  - [8.3. 案例 3：高阶函数](#83-案例-3高阶函数)
- [9. 🔗 引用](#9--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 双向协变的定义和问题
- TypeScript 的历史设计决策
- `strictFunctionTypes` 选项
- 类型安全的最佳实践
- 实际应用场景分析

## 2. 🫧 评价

双向协变（Bivariance）是 TypeScript 类型系统中一个有意为之的妥协设计。在 `strictFunctionTypes: false`（默认行为）时，函数参数既可以协变也可以逆变，这虽然提供了灵活性，但也牺牲了类型安全。

这个问题在 TypeScript 社区引发了长期讨论，最终在 TypeScript 2.6 引入了 `strictFunctionTypes` 选项，允许开发者选择更严格的类型检查。

理解双向协变问题，能帮助你：

1. 理解为什么某些看似合理的代码会通过类型检查却在运行时报错
2. 知道何时应该启用 `strictFunctionTypes`
3. 避免常见的类型安全陷阱
4. 编写更健壮的类型声明

## 3. 🤔 什么是双向协变问题？

### 3.1. 定义

双向协变：函数参数类型既可以协变（子类型 → 父类型），也可以逆变（父类型 → 子类型）

```ts
interface Animal {
  name: string
}

interface Dog extends Animal {
  bark(): void
}

type AnimalHandler = (animal: Animal) => void
type DogHandler = (dog: Dog) => void

// 双向协变（strictFunctionTypes: false）
const handleAnimal: AnimalHandler = (animal) => {
  console.log(animal.name)
}

const handleDog: DogHandler = (dog) => {
  console.log(dog.name)
  dog.bark()
}

// ✅ 逆变（安全）
const handler1: DogHandler = handleAnimal

// ⚠️ 协变（不安全！）
const handler2: AnimalHandler = handleDog
```

### 3.2. 问题核心

```ts
// 场景：双向协变导致的类型不安全
const handleDog: DogHandler = (dog) => {
  dog.bark() // 假设 dog 一定有 bark 方法
}

// ⚠️ 双向协变允许这个赋值
const handleAnimal: AnimalHandler = handleDog

// 💥 运行时错误！
handleAnimal({ name: 'Cat' }) // Cat 没有 bark 方法
// TypeError: dog.bark is not a function
```

## 4. 🤔 双向协变会导致什么问题？

### 4.1. 问题 1：数组操作不安全

::: code-group

```ts [❌ 双向协变的危险]
interface Animal {
  name: string
}

interface Dog extends Animal {
  bark(): void
}

interface Cat extends Animal {
  meow(): void
}

// strictFunctionTypes: false
const dogs: Dog[] = [{ name: 'Buddy', bark: () => console.log('Woof!') }]

// ⚠️ 双向协变允许这个操作
const processDog = (dog: Dog) => {
  dog.bark() // 假设参数一定是 Dog
}

const processAnimal: (animal: Animal) => void = processDog

// 💥 类型系统允许，但运行时崩溃！
dogs.forEach(processAnimal) // ✅ 类型检查通过
dogs.push({ name: 'Kitty', meow: () => {} } as any)
dogs.forEach(processAnimal) // ❌ 运行时错误：bark is not a function
```

```ts [✅ 严格函数类型的保护]
// strictFunctionTypes: true
const processDog = (dog: Dog) => {
  dog.bark()
}

const processAnimal: (animal: Animal) => void = processDog
// ❌ 编译错误：Type '(dog: Dog) => void' is not assignable to type '(animal: Animal) => void'
//   Types of parameters 'dog' and 'animal' are incompatible.
```

:::

### 4.2. 问题 2：事件处理器不安全

```ts
interface BaseEvent {
  timestamp: number
}

interface ClickEvent extends BaseEvent {
  button: number
  x: number
  y: number
}

// ⚠️ 双向协变允许
function handleClick(event: ClickEvent) {
  console.log(`Clicked button ${event.button} at (${event.x}, ${event.y})`)
}

const handleEvent: (event: BaseEvent) => void = handleClick
// strictFunctionTypes: false 时允许

// 💥 运行时错误
handleEvent({ timestamp: Date.now() })
// TypeError: Cannot read property 'button' of undefined
```

### 4.3. 问题 3：泛型函数不安全

```ts
interface Box<T> {
  value: T
}

// ⚠️ 双向协变导致泛型不安全
function processBox<T>(box: Box<T>, handler: (value: T) => void) {
  handler(box.value)
}

interface Animal {
  name: string
}
interface Dog extends Animal {
  bark(): void
}

const dogBox: Box<Dog> = {
  value: { name: 'Buddy', bark: () => console.log('Woof') },
}

const handleDog = (dog: Dog) => {
  dog.bark() // 假设参数一定是 Dog
}

// strictFunctionTypes: false
const handleAnimal: (animal: Animal) => void = handleDog // ⚠️ 允许

processBox(dogBox, handleAnimal) // ✅ 类型检查通过

// 如果 dogBox.value 实际是 Animal 而非 Dog
dogBox.value = { name: 'Generic Animal' } as any
processBox(dogBox, handleAnimal) // 💥 运行时错误
```

## 5. 🤔 为什么 TypeScript 默认允许双向协变？

### 5.1. 历史原因

1. 兼容 JavaScript 生态：大量现有代码依赖这种灵活性
2. 方法的特殊性：类方法在 TypeScript 早期被特殊处理
3. 实用主义：完全的类型安全会导致很多常见模式无法使用

### 5.2. 常见场景：事件监听

```ts
// 现实场景：DOM 事件
interface Event {
  target: EventTarget | null
  type: string
}

interface MouseEvent extends Event {
  clientX: number
  clientY: number
}

// 如果严格逆变，这个常见模式会报错
function handleMouseClick(event: MouseEvent) {
  console.log(`Clicked at (${event.clientX}, ${event.clientY})`)
}

// addEventListener 的类型签名
declare function addEventListener(
  type: string,
  listener: (event: Event) => void
): void

// ❌ 严格逆变会禁止这个赋值
addEventListener('click', handleMouseClick)
// 但这是非常常见的模式！
```

### 5.3. 方法的特殊处理

```ts
class Animal {
  name: string
  constructor(name: string) {
    this.name = name
  }
}

class Dog extends Animal {
  bark() {
    console.log('Woof!')
  }
}

class AnimalShelter {
  // 方法参数：即使 strictFunctionTypes: true 也允许协变
  adopt(animal: Animal) {
    console.log(`Adopted ${animal.name}`)
  }
}

class DogShelter extends AnimalShelter {
  // ✅ 方法重写允许更具体的参数类型（协变）
  override adopt(dog: Dog) {
    console.log(`Adopted dog ${dog.name}`)
    dog.bark()
  }
}

// TypeScript 允许这个，因为方法被特殊对待
const shelter: AnimalShelter = new DogShelter()
```

## 6. 🤔 如何解决双向协变问题？

### 6.1. 解决方案 1：启用 strictFunctionTypes

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true, // 包含 strictFunctionTypes
    // 或单独启用
    "strictFunctionTypes": true
  }
}
```

### 6.2. 解决方案 2：使用函数声明而非方法

::: code-group

```ts [❌ 方法（双向协变）]
class Handler {
  // 方法不受 strictFunctionTypes 影响
  handle(dog: Dog) {
    dog.bark()
  }
}

const handler: { handle(animal: Animal): void } = new Handler()
// ⚠️ 即使 strictFunctionTypes: true 也允许
```

```ts [✅ 函数属性（严格检查）]
class Handler {
  // 使用函数属性
  handle: (dog: Dog) => void = (dog) => {
    dog.bark()
  }
}

const handler: { handle: (animal: Animal) => void } = new Handler()
// ❌ strictFunctionTypes: true 时报错
// Error: Types of property 'handle' are incompatible
```

:::

### 6.3. 解决方案 3：类型断言（谨慎使用）

```ts
interface Animal {
  name: string
}
interface Dog extends Animal {
  bark(): void
}

const handleDog = (dog: Dog) => {
  dog.bark()
}

// ⚠️ 使用断言绕过检查（明确表示"我知道这不安全"）
const handleAnimal = handleDog as (animal: Animal) => void

// 使用时需要确保类型安全
handleAnimal({ name: 'Buddy', bark: () => {} } as Dog) // 手动保证
```

### 6.4. 解决方案 4：泛型约束

```ts
interface Animal {
  name: string
}
interface Dog extends Animal {
  bark(): void
}

// ✅ 使用泛型保持类型安全
function createHandler<T extends Animal>(
  handler: (item: T) => void
): (item: T) => void {
  return handler
}

const handleDog = (dog: Dog) => {
  dog.bark()
}

const typedHandler = createHandler(handleDog)
// typedHandler 的类型是 (item: Dog) => void

// ✅ 类型安全
typedHandler({ name: 'Buddy', bark: () => {} })

// ❌ 类型错误
typedHandler({ name: 'Generic Animal' })
// Error: Property 'bark' is missing
```

## 7. 🤔 strictFunctionTypes 的影响范围

### 7.1. 受影响的代码

```ts
interface Animal {
  name: string
}
interface Dog extends Animal {
  bark(): void
}

// ✅ 受 strictFunctionTypes 影响
type Handler1 = (animal: Animal) => void
const h1: Handler1 = (dog: Dog) => {} // ❌ 错误

// ✅ 受影响：函数类型别名
type Callback = (x: Animal) => void

// ✅ 受影响：接口中的函数属性
interface Config {
  onEvent: (event: Animal) => void
}

// ✅ 受影响：箭头函数
const handler = (animal: Animal) => {}
```

### 7.2. 不受影响的代码

```ts
// ❌ 不受 strictFunctionTypes 影响
class Handler {
  // 方法声明
  handle(animal: Animal) {}
}

interface IHandler {
  // 方法签名（不是函数类型）
  handle(animal: Animal): void
}

// ❌ 不受影响：构造函数
class Animal {
  constructor(name: string) {}
}
```

### 7.3. 对比表

| 语法         | strictFunctionTypes | 示例                             |
| ------------ | ------------------- | -------------------------------- |
| 函数类型     | ✅ 影响             | `type F = (x: T) => void`        |
| 箭头函数属性 | ✅ 影响             | `{ fn: (x: T) => void }`         |
| 方法声明     | ❌ 不影响           | `{ fn(x: T): void }`             |
| 方法签名     | ❌ 不影响           | `interface I { fn(x: T): void }` |
| 构造函数     | ❌ 不影响           | `constructor(x: T)`              |

## 8. 🤔 实际案例分析

### 8.1. 案例 1：数组方法

::: code-group

```ts [问题代码]
// strictFunctionTypes: false
interface Animal {
  name: string
}
interface Dog extends Animal {
  bark(): void
}

const dogs: Dog[] = [{ name: 'Buddy', bark: () => {} }]

// ⚠️ 危险：期望处理 Dog，但接受 Animal
const handleDog = (dog: Dog) => {
  dog.bark()
}

const handleAnimal: (animal: Animal) => void = handleDog

// 💥 如果数组中有非 Dog 的 Animal，会崩溃
dogs.forEach(handleAnimal)
```

```ts [修复方案]
// strictFunctionTypes: true
const handleDog = (dog: Dog) => {
  dog.bark()
}

// ❌ 编译错误
const handleAnimal: (animal: Animal) => void = handleDog

// ✅ 正确做法：使用泛型
function processDogs<T extends Dog>(dogs: T[], handler: (dog: T) => void) {
  dogs.forEach(handler)
}

processDogs(dogs, handleDog) // ✅ 类型安全
```

:::

### 8.2. 案例 2：React 事件处理

```ts
import React from 'react'

interface Props {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

// ❌ 不安全（双向协变）
function Button({ onClick }: Props) {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // 期望 HTMLDivElement 的事件，但可能收到 HTMLButtonElement
    event.currentTarget.style.color = 'red'
  }

  // ⚠️ 类型不匹配但双向协变允许
  return <button onClick={handleClick as any}>Click</button>
}

// ✅ 安全做法
function Button({ onClick }: Props) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.style.color = 'red' // ✅ 类型正确
  }

  return <button onClick={handleClick}>Click</button>
}
```

### 8.3. 案例 3：高阶函数

```ts
interface Animal {
  name: string
}
interface Dog extends Animal {
  bark(): void
}

// ❌ 不安全的高阶函数
function createLogger<T>(handler: (item: T) => void) {
  return (item: T) => {
    console.log('Logging...')
    handler(item)
  }
}

const logDog = (dog: Dog) => {
  dog.bark()
}

// ⚠️ 双向协变允许
const logAnimal: (animal: Animal) => void = createLogger(logDog)

// 💥 运行时错误
logAnimal({ name: 'Cat' })

// ✅ 安全的高阶函数
function createLogger<T extends Animal>(
  handler: (item: T) => void
): (item: T) => void {
  return (item: T) => {
    console.log('Logging...')
    handler(item)
  }
}

const logDog2 = createLogger((dog: Dog) => {
  dog.bark()
})

// ✅ 类型安全
logDog2({ name: 'Buddy', bark: () => {} })

// ❌ 编译错误
logDog2({ name: 'Cat' })
```

## 9. 🔗 引用

- [TypeScript 2.6 Release Notes][1]
- [strictFunctionTypes 文档][2]
- [TypeScript FAQ - Bivariance][3]

[1]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-6.html
[2]: https://www.typescriptlang.org/tsconfig#strictFunctionTypes
[3]: https://github.com/Microsoft/TypeScript/wiki/FAQ#why-are-function-parameters-bivariant
