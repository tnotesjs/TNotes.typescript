# [0080. 协变与逆变](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0080.%20%E5%8D%8F%E5%8F%98%E4%B8%8E%E9%80%86%E5%8F%98)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是协变与逆变？](#3--什么是协变与逆变)
  - [3.1. 核心概念](#31-核心概念)
  - [3.2. 直观理解](#32-直观理解)
- [4. 🤔 为什么需要协变与逆变？](#4--为什么需要协变与逆变)
  - [4.1. 类型安全问题](#41-类型安全问题)
  - [4.2. 函数参数的特殊性](#42-函数参数的特殊性)
- [5. 🤔 协变（Covariance）是什么？](#5--协变covariance是什么)
  - [5.1. 定义](#51-定义)
  - [5.2. 典型场景：函数返回值](#52-典型场景函数返回值)
  - [5.3. 典型场景：数组](#53-典型场景数组)
  - [5.4. 典型场景：Promise](#54-典型场景promise)
- [6. 🤔 逆变（Contravariance）是什么？](#6--逆变contravariance是什么)
  - [6.1. 定义](#61-定义)
  - [6.2. 典型场景：函数参数](#62-典型场景函数参数)
  - [6.3. strictFunctionTypes 选项](#63-strictfunctiontypes-选项)
  - [6.4. 为什么参数是逆变的？](#64-为什么参数是逆变的)
- [7. 🤔 双向协变（Bivariance）是什么？](#7--双向协变bivariance是什么)
  - [7.1. 定义](#71-定义)
  - [7.2. 为什么 TypeScript 默认允许双向协变？](#72-为什么-typescript-默认允许双向协变)
  - [7.3. 建议](#73-建议)
- [8. 🤔 不变（Invariance）是什么？](#8--不变invariance是什么)
  - [8.1. 定义](#81-定义)
  - [8.2. TypeScript 的实际行为](#82-typescript-的实际行为)
- [9. 🤔 实际应用中的协变与逆变](#9--实际应用中的协变与逆变)
  - [9.1. 场景 1：事件处理器](#91-场景-1事件处理器)
  - [9.2. 场景 2：数组方法](#92-场景-2数组方法)
  - [9.3. 场景 3：Promise 链](#93-场景-3promise-链)
  - [9.4. 场景 4：泛型约束](#94-场景-4泛型约束)
- [10. 🤔 如何检查类型的变异性？](#10--如何检查类型的变异性)
  - [10.1. 手动检查技巧](#101-手动检查技巧)
  - [10.2. 编译器选项](#102-编译器选项)
  - [10.3. 实用记忆法](#103-实用记忆法)
- [11. 🔗 引用](#11--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 协变与逆变的概念
- 类型兼容性规则
- 函数参数的逆变
- 返回值的协变
- 实际应用场景
- strictFunctionTypes 选项

## 2. 🫧 评价

协变（Covariance）和逆变（Contravariance）是类型系统中的重要概念，用于描述类型之间的替换关系。虽然这两个术语听起来学术化，但它们解决的是非常实际的问题：什么时候可以用子类型替换父类型。

在 TypeScript 中，协变和逆变主要体现在：

1. 函数参数：逆变（更宽松的类型可以替换更严格的类型）
2. 函数返回值：协变（更严格的类型可以替换更宽松的类型）
3. 泛型：根据使用位置决定

理解协变与逆变，能帮助你：

- 理解为什么某些类型赋值会报错
- 编写更安全的泛型函数
- 理解 `strictFunctionTypes` 选项的作用
- 避免类型安全漏洞

本节将通过大量示例，深入浅出地讲解这个看似复杂的概念。

## 3. 🤔 什么是协变与逆变？

### 3.1. 核心概念

假设有类型关系：`Dog extends Animal`（Dog 是 Animal 的子类型）

| 概念 | 定义 | 记忆口诀 |
| --- | --- | --- |
| 协变（Covariance） | 如果 `Dog extends Animal`，则 `Container<Dog>` 可以赋值给 `Container<Animal>` | 子类型 → 父类型（方向一致） |
| 逆变（Contravariance） | 如果 `Dog extends Animal`，则 `Container<Animal>` 可以赋值给 `Container<Dog>` | 父类型 → 子类型（方向相反） |
| 双向协变（Bivariance） | 两个方向都可以赋值 | 既协变又逆变 |
| 不变（Invariance） | 必须类型完全相同 | 不能赋值 |

### 3.2. 直观理解

```
类型层级：
  Animal (父类型)
    ↑
    |
  Dog (子类型)

协变：方向一致
  Container<Dog> → Container<Animal>  ✅

逆变：方向相反
  Container<Animal> → Container<Dog>  ✅

不变：必须完全相同
  Container<Dog> ≠ Container<Animal>  ❌
```

## 4. 🤔 为什么需要协变与逆变？

### 4.1. 类型安全问题

```ts
interface Animal {
  name: string
}

interface Dog extends Animal {
  bark(): void
}

// 场景：数组是协变的
let animals: Animal[] = []
let dogs: Dog[] = [{ name: 'Buddy', bark: () => console.log('Woof!') }]

animals = dogs // ✅ 协变：可以将 Dog[] 赋值给 Animal[]

// 但这可能导致类型安全问题：
animals.push({ name: 'Cat' }) // ⚠️ 将 Animal 放入实际是 Dog[] 的数组
dogs[1].bark() // ❌ 运行时错误：Cat 没有 bark 方法
```

### 4.2. 函数参数的特殊性

```ts
type AnimalHandler = (animal: Animal) => void
type DogHandler = (dog: Dog) => void

// ❌ 如果函数参数是协变的（错误！）
const handleAnimal: AnimalHandler = (animal) => {
  console.log(animal.name)
}

const handleDog: DogHandler = handleAnimal // 假设允许
handleDog({ name: 'Buddy', bark: () => {} }) // 调用时期望处理 Dog
// 但 handleAnimal 只知道 Animal，可能访问不存在的 bark 方法

// ✅ 函数参数应该是逆变的
const handleDog2: DogHandler = (dog) => {
  console.log(dog.name)
  dog.bark() // 使用 Dog 特有的方法
}

const handleAnimal2: AnimalHandler = handleDog2 // ❌ 应该禁止
// 因为 handleAnimal2 可能接收任何 Animal，而 handleDog2 期望 Dog
```

## 5. 🤔 协变（Covariance）是什么？

### 5.1. 定义

协变：子类型可以赋值给父类型（保持类型层级的方向）

```
如果 Dog extends Animal
则 Container<Dog> 可以赋值给 Container<Animal>
```

### 5.2. 典型场景：函数返回值

::: code-group

```ts [✅ 返回值协变]
interface Animal {
  name: string
}

interface Dog extends Animal {
  bark(): void
}

// 返回更具体的类型是安全的
type GetAnimal = () => Animal
type GetDog = () => Dog

const getDog: GetDog = () => ({ name: 'Buddy', bark: () => {} })
const getAnimal: GetAnimal = getDog // ✅ 协变：Dog → Animal

// 为什么安全？
const animal = getAnimal() // 期望得到 Animal
console.log(animal.name) // ✅ Dog 一定有 name 属性
```

```ts [❌ 反向赋值不安全]
const getAnimal: GetAnimal = () => ({ name: 'Generic Animal' })
const getDog: GetDog = getAnimal // ❌ 不允许

// 为什么不安全？
const dog = getDog() // 期望得到 Dog
dog.bark() // ❌ 运行时错误：Animal 没有 bark 方法
```

:::

### 5.3. 典型场景：数组

```ts
interface Animal {
  name: string
}

interface Dog extends Animal {
  bark(): void
}

// ✅ 数组是协变的（读取是安全的）
let animals: Animal[] = []
let dogs: Dog[] = [{ name: 'Buddy', bark: () => {} }]

animals = dogs // ✅ 协变赋值

// 读取是安全的
const animal = animals[0] // Animal 类型
console.log(animal.name) // ✅ 安全

// ⚠️ 但写入可能不安全（这是协变的代价）
animals.push({ name: 'Cat' }) // 类型系统允许，但运行时不安全
```

### 5.4. 典型场景：Promise

```ts
interface Animal {
  name: string
}

interface Dog extends Animal {
  bark(): void
}

// ✅ Promise 是协变的
async function getDog(): Promise<Dog> {
  return { name: 'Buddy', bark: () => {} }
}

const getAnimal: () => Promise<Animal> = getDog // ✅ 协变

// 使用时安全
const animal = await getAnimal()
console.log(animal.name) // ✅ Dog 一定有 name
```

## 6. 🤔 逆变（Contravariance）是什么？

### 6.1. 定义

逆变：父类型可以赋值给子类型（反转类型层级的方向）

```
如果 Dog extends Animal
则 Handler<Animal> 可以赋值给 Handler<Dog>
```

### 6.2. 典型场景：函数参数

::: code-group

```ts [✅ 参数逆变]
interface Animal {
  name: string
}

interface Dog extends Animal {
  bark(): void
}

type AnimalHandler = (animal: Animal) => void
type DogHandler = (dog: Dog) => void

// 接受更宽泛的参数是安全的
const handleAnimal: AnimalHandler = (animal) => {
  console.log(animal.name) // 只使用 Animal 的属性
}

const handleDog: DogHandler = handleAnimal // ✅ 逆变：Animal → Dog

// 为什么安全？
handleDog({ name: 'Buddy', bark: () => {} }) // 传入 Dog
// handleAnimal 只使用 name，不会访问 bark，所以安全
```

```ts [❌ 反向赋值不安全]
const handleDog: DogHandler = (dog) => {
  console.log(dog.name)
  dog.bark() // 使用 Dog 特有的方法
}

const handleAnimal: AnimalHandler = handleDog // ❌ 不允许

// 为什么不安全？
handleAnimal({ name: 'Cat' }) // 传入 Animal（可能不是 Dog）
// handleDog 会调用 bark()，但 Cat 没有这个方法
```

:::

### 6.3. strictFunctionTypes 选项

```ts
// tsconfig.json
{
  "compilerOptions": {
    "strictFunctionTypes": true // 启用严格函数类型检查
  }
}

// 启用后：
type AnimalHandler = (animal: Animal) => void
type DogHandler = (dog: Dog) => void

const handleDog: DogHandler = (dog) => {
  dog.bark()
}

// ✅ strictFunctionTypes: true
const handleAnimal: AnimalHandler = handleDog
// ❌ 错误：Type '(dog: Dog) => void' is not assignable to type '(animal: Animal) => void'

// ❌ strictFunctionTypes: false（默认行为）
const handleAnimal: AnimalHandler = handleDog
// ⚠️ 允许，但不安全（双向协变）
```

### 6.4. 为什么参数是逆变的？

里氏替换原则（Liskov Substitution Principle）：

```
子类型可以替换父类型

函数角度：
- 如果 f 可以替换 g
- 则 f 的参数应该 >= g 的参数（更宽松）
- 且 f 的返回值应该 <= g 的返回值（更严格）

记忆：
- 参数：消费者视角（我能接受的更多 → 逆变）
- 返回值：生产者视角（我能提供的更具体 → 协变）
```

## 7. 🤔 双向协变（Bivariance）是什么？

### 7.1. 定义

双向协变：既可以协变，也可以逆变

```ts
// 在 strictFunctionTypes: false 时
type AnimalHandler = (animal: Animal) => void
type DogHandler = (dog: Dog) => void

// ✅ 协变
const h1: AnimalHandler = ((dog: Dog) => {}) as DogHandler

// ✅ 逆变
const h2: DogHandler = ((animal: Animal) => {}) as AnimalHandler

// ⚠️ 双向协变是不安全的！
```

### 7.2. 为什么 TypeScript 默认允许双向协变？

历史原因：为了兼容 JavaScript 的灵活性

```ts
// 常见场景：事件处理
interface MouseEvent {
  x: number
  y: number
}

interface ClickEvent extends MouseEvent {
  button: number
}

// 如果严格逆变，这个常见模式会报错：
function handleClick(event: ClickEvent) {
  console.log(event.button)
}

document.addEventListener('click', handleClick)
// addEventListener 期望 (event: Event) => void
// 但 handleClick 是 (event: ClickEvent) => void
// 严格逆变会禁止这个赋值
```

### 7.3. 建议

```ts
// ✅ 推荐：开启严格函数类型检查
{
  "compilerOptions": {
    "strictFunctionTypes": true
  }
}

// 如果确实需要放松限制，使用类型断言：
const handler: EventListener = handleClick as EventListener
```

## 8. 🤔 不变（Invariance）是什么？

### 8.1. 定义

不变：类型必须完全匹配，既不能协变也不能逆变

```ts
// 可变数据结构通常是不变的
class Box<T> {
  value: T

  constructor(value: T) {
    this.value = value
  }

  get(): T {
    return this.value // 协变位置
  }

  set(value: T): void {
    this.value = value // 逆变位置
  }
}

// 因为同时有协变和逆变位置，Box<T> 应该是不变的
let animalBox: Box<Animal> = new Box({ name: 'Generic' })
let dogBox: Box<Dog> = new Box({ name: 'Buddy', bark: () => {} })

animalBox = dogBox // ❌ 应该禁止
dogBox = animalBox // ❌ 应该禁止
```

### 8.2. TypeScript 的实际行为

```ts
// ⚠️ TypeScript 实际上允许这种赋值（不够严格）
let animalBox: Box<Animal> = new Box({ name: 'Generic' })
let dogBox: Box<Dog> = new Box({ name: 'Buddy', bark: () => {} })

animalBox = dogBox // ✅ TypeScript 允许（协变）

// 这可能导致类型不安全：
animalBox.set({ name: 'Cat' }) // 将 Animal 放入 Box<Dog>
dogBox.value.bark() // ❌ 运行时错误
```

## 9. 🤔 实际应用中的协变与逆变

### 9.1. 场景 1：事件处理器

```ts
interface Event {
  timestamp: number
}

interface MouseEvent extends Event {
  x: number
  y: number
}

// ✅ 参数逆变：可以用更通用的处理器
type EventHandler = (event: Event) => void
type MouseEventHandler = (event: MouseEvent) => void

const handleEvent: EventHandler = (event) => {
  console.log(event.timestamp)
}

const handleMouseEvent: MouseEventHandler = handleEvent // ✅ 逆变

// 使用时
handleMouseEvent({ timestamp: Date.now(), x: 100, y: 200 })
// handleEvent 只使用 timestamp，忽略 x 和 y
```

### 9.2. 场景 2：数组方法

```ts
interface Animal {
  name: string
}

interface Dog extends Animal {
  bark(): void
}

const dogs: Dog[] = [{ name: 'Buddy', bark: () => console.log('Woof') }]

// ✅ 协变：可以赋值给父类型数组
const animals: Animal[] = dogs

// ✅ map 返回值协变
const names: string[] = dogs.map((dog) => dog.name)

// ✅ forEach 参数逆变
const logAnimal = (animal: Animal) => console.log(animal.name)
dogs.forEach(logAnimal) // ✅ 可以用 Animal 处理器处理 Dog
```

### 9.3. 场景 3：Promise 链

```ts
interface User {
  id: string
  name: string
}

interface DetailedUser extends User {
  email: string
  phone: string
}

async function getUser(): Promise<User> {
  return { id: '1', name: 'Alice' }
}

async function getDetailedUser(): Promise<DetailedUser> {
  return { id: '1', name: 'Alice', email: 'alice@example.com', phone: '123' }
}

// ✅ Promise 协变
const userPromise: Promise<User> = getDetailedUser()

// ✅ then 回调参数逆变
userPromise.then((user: User) => {
  console.log(user.name) // 只使用 User 属性
})
```

### 9.4. 场景 4：泛型约束

```ts
interface Animal {
  name: string
}

interface Dog extends Animal {
  bark(): void
}

// ✅ 协变：返回子类型
function createArray<T extends Animal>(): T[] {
  return []
}

const dogs: Dog[] = createArray<Dog>() // ✅ 协变

// ✅ 逆变：接受父类型
function processArray<T extends Animal>(
  arr: T[],
  handler: (item: Animal) => void
) {
  arr.forEach(handler) // handler 参数逆变
}

processArray<Dog>(
  [{ name: 'Buddy', bark: () => {} }],
  (animal) => console.log(animal.name) // 只使用 Animal 属性
)
```

## 10. 🤔 如何检查类型的变异性？

### 10.1. 手动检查技巧

```ts
// 定义辅助类型
type Covariant<T> = () => T
type Contravariant<T> = (arg: T) => void
type Invariant<T> = (arg: T) => T

// 测试协变
type TestCovariance<A, B> = Covariant<A> extends Covariant<B> ? true : false

interface Animal {
  name: string
}
interface Dog extends Animal {
  bark(): void
}

type Test1 = TestCovariance<Dog, Animal> // true（Dog → Animal 协变）
type Test2 = TestCovariance<Animal, Dog> // false（Animal → Dog 不协变）

// 测试逆变
type TestContravariance<A, B> = Contravariant<A> extends Contravariant<B>
  ? true
  : false

type Test3 = TestContravariance<Animal, Dog> // true（Animal → Dog 逆变）
type Test4 = TestContravariance<Dog, Animal> // false（Dog → Animal 不逆变）
```

### 10.2. 编译器选项

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "strictFunctionTypes": true, // 启用严格函数类型检查
    "strictNullChecks": true // 启用严格 null 检查
  }
}
```

### 10.3. 实用记忆法

```
PECS 原则（Producer Extends, Consumer Super）：

Producer（生产者）→ 协变 → extends
- 返回值是生产者
- 子类型可以赋值给父类型
- Dog[] → Animal[]

Consumer（消费者）→ 逆变 → super
- 参数是消费者
- 父类型可以赋值给子类型
- (Animal => void) → (Dog => void)
```

## 11. 🔗 引用

- [TypeScript Handbook - Type Compatibility][1]
- [TypeScript FAQ - Covariance and Contravariance][2]
- [Wikipedia - Covariance and Contravariance][3]

[1]: https://www.typescriptlang.org/docs/handbook/type-compatibility.html
[2]: https://github.com/Microsoft/TypeScript/wiki/FAQ#why-are-function-parameters-bivariant
[3]: https://en.wikipedia.org/wiki/Covariance_and_contravariance_(computer_science)
