# [0272. 避免类型断言的滥用](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0272.%20%E9%81%BF%E5%85%8D%E7%B1%BB%E5%9E%8B%E6%96%AD%E8%A8%80%E7%9A%84%E6%BB%A5%E7%94%A8)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 类型断言的问题？](#3-类型断言的问题)
  - [3.1. 基本问题](#31-基本问题)
  - [3.2. 隐藏的类型错误](#32-隐藏的类型错误)
  - [3.3. 维护困难](#33-维护困难)
- [4. 何时应该使用类型断言？](#4-何时应该使用类型断言)
  - [4.1. 你确实比编译器知道得更多](#41-你确实比编译器知道得更多)
  - [4.2. 窄化类型](#42-窄化类型)
  - [4.3. const 断言](#43-const-断言)
  - [4.4. 类型兼容性](#44-类型兼容性)
- [5. 更安全的替代方案？](#5-更安全的替代方案)
  - [5.1. 使用类型守卫](#51-使用类型守卫)
  - [5.2. 使用类型声明](#52-使用类型声明)
  - [5.3. 使用泛型](#53-使用泛型)
  - [5.4. 使用类型谓词](#54-使用类型谓词)
- [6. 避免双重断言？](#6-避免双重断言)
  - [6.1. 双重断言的危险](#61-双重断言的危险)
  - [6.2. 为什么会用双重断言](#62-为什么会用双重断言)
  - [6.3. 正确的解决方案](#63-正确的解决方案)
- [7. DOM 操作中的类型安全？](#7-dom-操作中的类型安全)
  - [7.1. querySelector 的问题](#71-queryselector-的问题)
  - [7.2. 类型安全的 DOM 辅助函数](#72-类型安全的-dom-辅助函数)
  - [7.3. 可选的元素查询](#73-可选的元素查询)
  - [7.4. 事件处理](#74-事件处理)
- [8. 引用](#8-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 类型断言的问题
- 合理使用场景
- 更安全的替代方案
- 避免双重断言
- DOM 操作类型安全

## 2. 评价

类型断言虽然方便，但过度使用会破坏 TypeScript 的类型安全保障。

- 绕过类型检查的风险
- 运行时错误隐患
- 代码维护困难
- 优先使用类型守卫
- 保持类型安全

## 3. 类型断言的问题？

类型断言告诉编译器"我比你更了解这个类型"，但这可能导致运行时错误。

### 3.1. 基本问题

```ts
// ❌ 危险：断言可能不正确
function processValue(value: unknown) {
  const str = value as string
  console.log(str.toUpperCase()) // 运行时可能出错
}

processValue(123) // 运行时错误！

// ✅ 安全：使用类型守卫
function processValue(value: unknown) {
  if (typeof value === 'string') {
    console.log(value.toUpperCase())
  } else {
    console.log('不是字符串')
  }
}
```

### 3.2. 隐藏的类型错误

```ts
interface User {
  name: string
  age: number
}

// ❌ 断言掩盖了类型错误
const user = {
  name: 'Tom',
  // 缺少 age 属性
} as User

console.log(user.age.toFixed()) // 运行时错误：undefined

// ✅ 让 TypeScript 检查
const user: User = {
  name: 'Tom',
  age: 25, // 必须提供
}
```

### 3.3. 维护困难

```ts
// ❌ 断言使重构变得困难
interface OldUser {
  name: string
}

interface NewUser {
  firstName: string
  lastName: string
}

function getUser(): unknown {
  return { firstName: 'Tom', lastName: 'Smith' }
}

// 这个断言在重构后不会报错，但是错误的
const user = getUser() as OldUser
console.log(user.name) // undefined

// ✅ 使用类型守卫
function isNewUser(user: unknown): user is NewUser {
  return (
    typeof user === 'object' &&
    user !== null &&
    'firstName' in user &&
    'lastName' in user
  )
}

const userData = getUser()
if (isNewUser(userData)) {
  console.log(userData.firstName)
}
```

## 4. 何时应该使用类型断言？

类型断言在某些情况下是必要的，但应该谨慎使用。

### 4.1. 你确实比编译器知道得更多

```ts
// ✅ 合理：从第三方库获取数据
import { parseJSON } from 'some-library'

interface Config {
  apiUrl: string
  timeout: number
}

// 你知道 JSON 的结构
const config = parseJSON(jsonString) as Config
```

### 4.2. 窄化类型

```ts
// ✅ 合理：从宽类型窄化到窄类型
function processElement(element: Element) {
  // 你确定这是一个 HTMLInputElement
  if (element.tagName === 'INPUT') {
    const input = element as HTMLInputElement
    console.log(input.value)
  }
}
```

### 4.3. const 断言

```ts
// ✅ 好：使用 as const
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
} as const
// 类型：{ readonly apiUrl: "https://api.example.com"; readonly timeout: 5000 }

const colors = ['red', 'green', 'blue'] as const
// 类型：readonly ["red", "green", "blue"]
```

### 4.4. 类型兼容性

```ts
// ✅ 合理：处理类型系统的限制
interface Base {
  id: number
}

interface Extended extends Base {
  name: string
}

const base: Base = { id: 1 }
// 你确定这个对象有 name 属性
const extended = base as Extended
```

## 5. 更安全的替代方案？

### 5.1. 使用类型守卫

```ts
// ❌ 断言
function processValue(value: unknown) {
  const str = value as string
  return str.toUpperCase()
}

// ✅ 类型守卫
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function processValue(value: unknown) {
  if (isString(value)) {
    return value.toUpperCase()
  }
  throw new Error('值必须是字符串')
}
```

### 5.2. 使用类型声明

```ts
// ❌ 断言
const user = {
  name: 'Tom',
  age: 25,
} as User

// ✅ 类型声明
const user: User = {
  name: 'Tom',
  age: 25,
}
```

### 5.3. 使用泛型

```ts
// ❌ 断言
function parseJSON(json: string): unknown {
  return JSON.parse(json)
}

const user = parseJSON(userJson) as User

// ✅ 泛型
function parseJSON<T>(json: string): T {
  return JSON.parse(json)
}

const user = parseJSON<User>(userJson)
```

### 5.4. 使用类型谓词

```ts
// ❌ 断言
function getUser(data: unknown): User {
  return data as User
}

// ✅ 类型谓词
function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'name' in data &&
    typeof (data as User).name === 'string' &&
    'age' in data &&
    typeof (data as User).age === 'number'
  )
}

function getUser(data: unknown): User {
  if (isUser(data)) {
    return data
  }
  throw new Error('无效的用户数据')
}
```

## 6. 避免双重断言？

双重断言（通过 unknown）是非常危险的做法。

### 6.1. 双重断言的危险

```ts
// ❌ 非常危险：双重断言
const value = 'hello' as unknown as number
console.log(value.toFixed()) // 运行时错误

// ❌ 绕过所有类型检查
interface A {
  a: string
}

interface B {
  b: number
}

const a: A = { a: 'hello' }
const b = a as unknown as B
console.log(b.b.toFixed()) // 运行时错误
```

### 6.2. 为什么会用双重断言

```ts
// 情况：类型不兼容
interface Cat {
  meow(): void
}

interface Dog {
  bark(): void
}

const cat: Cat = { meow: () => console.log('meow') }

// ❌ 直接断言会报错
// const dog = cat as Dog;  // Error

// ❌ 双重断言"解决"了问题
const dog = cat as unknown as Dog
dog.bark() // 运行时错误！
```

### 6.3. 正确的解决方案

```ts
// ✅ 重新思考设计
interface Animal {
  makeSound(): void
}

interface Cat extends Animal {
  meow(): void
}

interface Dog extends Animal {
  bark(): void
}

function handleAnimal(animal: Animal) {
  animal.makeSound()
}

// ✅ 使用类型守卫
function isCat(animal: Animal): animal is Cat {
  return 'meow' in animal
}

function isDog(animal: Animal): animal is Dog {
  return 'bark' in animal
}

function handleAnimal(animal: Animal) {
  if (isCat(animal)) {
    animal.meow()
  } else if (isDog(animal)) {
    animal.bark()
  }
}
```

## 7. DOM 操作中的类型安全？

DOM 操作是常见的需要类型断言的场景，但有更安全的方法。

### 7.1. querySelector 的问题

```ts
// ❌ 不安全：可能返回 null
const input = document.querySelector('#username') as HTMLInputElement
input.value = 'Tom' // 如果元素不存在，运行时错误

// ⚠️ 稍好：检查 null
const input = document.querySelector('#username') as HTMLInputElement | null
if (input) {
  input.value = 'Tom'
}

// ✅ 最好：不使用断言
const input = document.querySelector('#username')
if (input instanceof HTMLInputElement) {
  input.value = 'Tom'
}
```

### 7.2. 类型安全的 DOM 辅助函数

```ts
// ✅ 创建类型安全的辅助函数
function getElement<T extends HTMLElement>(
  selector: string,
  type: new () => T
): T {
  const element = document.querySelector(selector)
  if (element instanceof type) {
    return element
  }
  throw new Error(`未找到元素：${selector}`)
}

// 使用
try {
  const input = getElement('#username', HTMLInputElement)
  input.value = 'Tom'

  const button = getElement('#submit', HTMLButtonElement)
  button.disabled = false
} catch (error) {
  console.error(error)
}
```

### 7.3. 可选的元素查询

```ts
// ✅ 返回可选类型
function queryElement<T extends HTMLElement>(
  selector: string,
  type: new () => T
): T | null {
  const element = document.querySelector(selector)
  return element instanceof type ? element : null
}

// 使用
const input = queryElement('#username', HTMLInputElement)
if (input) {
  input.value = 'Tom'
}
```

### 7.4. 事件处理

```ts
// ❌ 不安全
button.addEventListener('click', (event) => {
  const target = event.target as HTMLButtonElement
  target.disabled = true
})

// ✅ 安全
button.addEventListener('click', (event) => {
  if (event.target instanceof HTMLButtonElement) {
    event.target.disabled = true
  }
})

// ✅ 使用 currentTarget
button.addEventListener('click', (event) => {
  const button = event.currentTarget
  if (button instanceof HTMLButtonElement) {
    button.disabled = true
  }
})
```

## 8. 引用

- [Type Assertions][1]
- [Narrowing][2]
- [Type Guards][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions
[2]: https://www.typescriptlang.org/docs/handbook/2/narrowing.html
[3]: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
