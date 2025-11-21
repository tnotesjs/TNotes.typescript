# [0116. 泛型函数](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0116.%20%E6%B3%9B%E5%9E%8B%E5%87%BD%E6%95%B0)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是泛型函数？](#3--什么是泛型函数)
- [4. 🤔 基本语法](#4--基本语法)
  - [4.1. 函数声明](#41-函数声明)
  - [4.2. 函数表达式](#42-函数表达式)
  - [4.3. 箭头函数](#43-箭头函数)
  - [4.4. 方法中的泛型](#44-方法中的泛型)
- [5. 🤔 类型推断](#5--类型推断)
  - [5.1. 自动推断](#51-自动推断)
  - [5.2. 部分推断](#52-部分推断)
  - [5.3. 推断限制](#53-推断限制)
- [6. 🤔 泛型约束](#6--泛型约束)
  - [6.1. extends 约束](#61-extends-约束)
  - [6.2. 约束为对象类型](#62-约束为对象类型)
  - [6.3. 多重约束](#63-多重约束)
  - [6.4. 约束类型参数](#64-约束类型参数)
- [7. 🤔 多个类型参数](#7--多个类型参数)
  - [7.1. 两个类型参数](#71-两个类型参数)
  - [7.2. 多个独立参数](#72-多个独立参数)
  - [7.3. 参数间的关系](#73-参数间的关系)
- [8. 🤔 泛型函数类型](#8--泛型函数类型)
  - [8.1. 函数类型声明](#81-函数类型声明)
  - [8.2. 接口中的泛型函数](#82-接口中的泛型函数)
  - [8.3. 回调函数类型](#83-回调函数类型)
  - [8.4. 高阶函数](#84-高阶函数)
- [9. 🤔 常见错误和最佳实践](#9--常见错误和最佳实践)
  - [9.1. 错误 1：过度使用泛型](#91-错误-1过度使用泛型)
  - [9.2. 错误 2：泛型参数过多](#92-错误-2泛型参数过多)
  - [9.3. 错误 3：忽略类型约束](#93-错误-3忽略类型约束)
  - [9.4. 错误 4：类型推断不准确](#94-错误-4类型推断不准确)
  - [9.5. 最佳实践](#95-最佳实践)
- [10. 🔗 引用](#10--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 泛型函数的定义和语法
- 类型推断机制
- 泛型约束的使用
- 多个类型参数
- 泛型函数类型
- 实际应用场景

## 2. 🫧 评价

泛型函数（Generic Function）是使用**类型参数**的函数，可以在调用时指定具体类型。

泛型函数的特点：

- **类型参数化**：函数的类型可以作为参数传入
- **类型推断**：通常可以自动推断类型参数
- **类型安全**：编译时检查类型一致性
- **代码复用**：一个函数适用于多种类型

泛型函数 vs 普通函数：

| 特性           | 泛型函数     | 普通函数     |
| -------------- | ------------ | ------------ |
| **类型灵活性** | 高           | 低           |
| **类型安全**   | 保持类型关系 | 可能丢失类型 |
| **代码复用**   | 高           | 需要重载     |
| **复杂度**     | 稍高         | 简单         |
| **类型推断**   | 支持         | 不需要       |

泛型函数的优势：

1. **类型安全**：保持输入输出类型关系
2. **自动推断**：多数情况不需要显式指定类型
3. **代码简洁**：避免重复编写相似函数
4. **灵活性**：适应多种类型的场景

理解泛型函数，能帮助你：

1. 编写更通用的工具函数
2. 保持类型安全的同时提高复用性
3. 利用类型推断简化代码
4. 实现高级类型模式

泛型函数是 TypeScript 函数式编程的核心特性，是编写可复用代码的重要工具。

## 3. 🤔 什么是泛型函数？

泛型函数使用**类型参数**，可以处理多种类型的数据并保持类型安全。

```ts
// ❌ 没有泛型：丢失类型信息
function identityAny(arg: any): any {
  return arg
}

const result1 = identityAny(42) // any 类型
const result2 = identityAny('hello') // any 类型

// ✅ 使用泛型：保持类型
function identity<T>(arg: T): T {
  return arg
}

const num = identity(42) // number 类型
const str = identity('hello') // string 类型
const arr = identity([1, 2, 3]) // number[] 类型
```

**关键概念**：

- **类型参数**：`<T>` 是类型占位符
- **类型推断**：通常自动推断类型参数
- **类型保持**：输入输出类型关系不丢失
- **编译时检查**：类型错误在编译时发现

## 4. 🤔 基本语法

### 4.1. 函数声明

```ts
// ✅ 函数声明语法
function identity<T>(arg: T): T {
  return arg
}

// 调用方式 1：显式指定类型
const result1 = identity<string>('hello')

// 调用方式 2：类型推断（推荐）
const result2 = identity('hello') // 自动推断为 string
```

### 4.2. 函数表达式

```ts
// ✅ 函数表达式
const identity = <T>(arg: T): T => {
  return arg
}

// ✅ 或使用类型注解
const identity: <T>(arg: T) => T = (arg) => {
  return arg
}
```

### 4.3. 箭头函数

```ts
// ✅ 箭头函数
const map = <T, U>(arr: T[], fn: (item: T) => U): U[] => {
  return arr.map(fn)
}

const numbers = [1, 2, 3]
const strings = map(numbers, (n) => n.toString()) // string[]
```

### 4.4. 方法中的泛型

```ts
// ✅ 对象方法
const utils = {
  first<T>(arr: T[]): T | undefined {
    return arr[0]
  },

  last<T>(arr: T[]): T | undefined {
    return arr[arr.length - 1]
  },
}

const firstNum = utils.first([1, 2, 3]) // number | undefined
const lastStr = utils.last(['a', 'b', 'c']) // string | undefined
```

## 5. 🤔 类型推断

### 5.1. 自动推断

```ts
// ✅ TypeScript 自动推断类型参数
function toArray<T>(arg: T): T[] {
  return [arg]
}

const arr1 = toArray(42) // number[]
const arr2 = toArray('hello') // string[]
const arr3 = toArray({ id: 1 }) // { id: number }[]

// ✅ 从多个参数推断
function pair<T>(first: T, second: T): [T, T] {
  return [first, second]
}

const p1 = pair(1, 2) // [number, number]
const p2 = pair('a', 'b') // [string, string]
// const p3 = pair(1, 'a')  // ❌ Error: 类型不一致
```

### 5.2. 部分推断

```ts
// ✅ 部分推断
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn)
}

// T 从 arr 推断，U 从 fn 返回值推断
const result = map([1, 2, 3], (n) => n.toString()) // string[]

// ✅ 显式指定某些类型
function convert<T, U>(value: T, converter: (v: T) => U): U {
  return converter(value)
}

// 只指定 U，T 自动推断
const result2 = convert<number, string>(42, (n) => n.toString())
```

### 5.3. 推断限制

```ts
// ⚠️ 无法推断时需要显式指定
function createArray<T>(): T[] {
  return []
}

// ❌ 无法推断 T
// const arr1 = createArray()  // unknown[]

// ✅ 显式指定
const arr2 = createArray<number>() // number[]
const arr3 = createArray<string>() // string[]

// ✅ 或提供默认值
function createArrayWithDefault<T = string>(): T[] {
  return []
}

const arr4 = createArrayWithDefault() // string[]
```

## 6. 🤔 泛型约束

### 6.1. extends 约束

```ts
// ✅ 约束类型必须有 length 属性
interface Lengthwise {
  length: number
}

function getLength<T extends Lengthwise>(arg: T): number {
  return arg.length // ✅ 安全访问 length
}

getLength('hello') // ✅ string 有 length
getLength([1, 2, 3]) // ✅ array 有 length
getLength({ length: 10 }) // ✅ 对象有 length
// getLength(42)  // ❌ Error: number 没有 length
```

### 6.2. 约束为对象类型

```ts
// ✅ 约束为对象
function getProperty<T extends object, K extends keyof T>(
  obj: T,
  key: K
): T[K] {
  return obj[key]
}

const person = { name: 'Alice', age: 30 }
const name = getProperty(person, 'name') // string
const age = getProperty(person, 'age') // number
// const invalid = getProperty(person, 'invalid')  // ❌ Error
```

### 6.3. 多重约束

```ts
// ✅ 使用交叉类型实现多重约束
interface Named {
  name: string
}

interface Aged {
  age: number
}

function describe<T extends Named & Aged>(person: T): string {
  return `${person.name} is ${person.age} years old`
}

describe({ name: 'Alice', age: 30 }) // ✅
// describe({ name: 'Bob' })  // ❌ Error: 缺少 age
```

### 6.4. 约束类型参数

```ts
// ✅ 一个类型参数约束另一个
function copyProperties<T extends U, U>(target: T, source: U): T {
  return Object.assign(target, source)
}

const result = copyProperties({ id: 1, name: 'Alice' }, { name: 'Bob' }) // { id: 1, name: 'Bob' }
```

## 7. 🤔 多个类型参数

### 7.1. 两个类型参数

```ts
// ✅ 两个类型参数
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn)
}

const numbers = [1, 2, 3]
const strings = map(numbers, (n) => n.toString()) // string[]
const doubled = map(numbers, (n) => n * 2) // number[]
```

### 7.2. 多个独立参数

```ts
// ✅ 多个独立的类型参数
function merge<T, U, V>(a: T, b: U, c: V): [T, U, V] {
  return [a, b, c]
}

const result = merge(1, 'hello', true) // [number, string, boolean]
```

### 7.3. 参数间的关系

```ts
// ✅ 类型参数之间有关系
function filterAndMap<T, U extends T>(
  arr: T[],
  predicate: (item: T) => item is U,
  mapper: (item: U) => any
): any[] {
  return arr.filter(predicate).map(mapper)
}

type Animal = { type: string }
type Dog = Animal & { bark: () => void }

const animals: Animal[] = [{ type: 'dog' }, { type: 'cat' }]

function isDog(animal: Animal): animal is Dog {
  return animal.type === 'dog'
}

const result = filterAndMap(animals, isDog, (dog) => dog.bark())
```

## 8. 🤔 泛型函数类型

### 8.1. 函数类型声明

```ts
// ✅ 泛型函数类型
type IdentityFn = <T>(arg: T) => T

const identity: IdentityFn = (arg) => arg

const num = identity(42) // number
const str = identity('hello') // string
```

### 8.2. 接口中的泛型函数

```ts
// ✅ 接口定义泛型函数
interface GenericIdentityFn {
  <T>(arg: T): T
}

const identity: GenericIdentityFn = (arg) => arg

// ✅ 接口本身是泛型
interface GenericIdentityFn<T> {
  (arg: T): T
}

const numberIdentity: GenericIdentityFn<number> = (arg) => arg
const stringIdentity: GenericIdentityFn<string> = (arg) => arg
```

### 8.3. 回调函数类型

```ts
// ✅ 泛型回调函数
function forEach<T>(
  arr: T[],
  callback: (item: T, index: number) => void
): void {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i)
  }
}

forEach([1, 2, 3], (num, index) => {
  console.log(`${index}: ${num}`)
})

forEach(['a', 'b', 'c'], (str, index) => {
  console.log(`${index}: ${str}`)
})
```

### 8.4. 高阶函数

```ts
// ✅ 返回泛型函数的函数
function createGetter<T>() {
  return function <K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key]
  }
}

const getter = createGetter<{ name: string; age: number }>()
const person = { name: 'Alice', age: 30 }
const name = getter(person, 'name') // string
const age = getter(person, 'age') // number
```

## 9. 🤔 常见错误和最佳实践

### 9.1. 错误 1：过度使用泛型

```ts
// ❌ 不必要的泛型
function add<T extends number>(a: T, b: T): T {
  return (a + b) as T // 类型断言很危险
}

// ✅ 直接使用具体类型
function add(a: number, b: number): number {
  return a + b
}
```

### 9.2. 错误 2：泛型参数过多

```ts
// ❌ 泛型参数过多，难以理解
function complex<T, U, V, W, X>(a: T, b: U, c: V, d: W, e: X): [T, U, V, W, X] {
  return [a, b, c, d, e]
}

// ✅ 使用对象或简化逻辑
type Params = {
  a: string
  b: number
  c: boolean
}

function simple(params: Params): Params {
  return params
}
```

### 9.3. 错误 3：忽略类型约束

```ts
// ❌ 没有约束，无法安全使用
function getLength<T>(arg: T): number {
  // return arg.length  // ❌ Error: T 可能没有 length
  return 0
}

// ✅ 添加约束
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length // ✅
}
```

### 9.4. 错误 4：类型推断不准确

```ts
// ❌ 推断为 any[]
function createArray<T>() {
  return [] // T[] 但无法推断 T
}

const arr = createArray() // unknown[]

// ✅ 提供默认类型或要求参数
function createArray<T = string>() {
  return [] as T[]
}

function createArrayFrom<T>(item: T) {
  return [item] // T[] 可以推断
}
```

### 9.5. 最佳实践

```ts
// ✅ 1. 使用有意义的类型参数名
function map<TInput, TOutput>(
  arr: TInput[],
  fn: (item: TInput) => TOutput
): TOutput[] {
  return arr.map(fn)
}

// ✅ 2. 添加必要的约束
function sortBy<T, K extends keyof T>(arr: T[], key: K): T[] {
  return arr.sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
  })
}

// ✅ 3. 利用类型推断
function identity<T>(arg: T): T {
  return arg
}

// 不需要显式指定类型
const num = identity(42) // 自动推断为 number

// ✅ 4. 使用默认类型参数
function createState<T = any>(initialValue: T) {
  let value = initialValue
  return {
    get: () => value,
    set: (newValue: T) => {
      value = newValue
    },
  }
}

// ✅ 5. 返回类型使用泛型
function filter<T>(arr: T[], predicate: (item: T) => boolean): T[] {
  return arr.filter(predicate)
}

// ✅ 6. 高阶函数的泛型
function createMapper<T, U>(transform: (item: T) => U) {
  return function (arr: T[]): U[] {
    return arr.map(transform)
  }
}

// ✅ 7. 类型守卫
function isNotNull<T>(value: T | null): value is T {
  return value !== null
}

const values = [1, null, 2, null, 3]
const numbers = values.filter(isNotNull) // number[]

// ✅ 8. 条件类型
function wrap<T>(value: T): T extends Array<infer U> ? U[] : T[] {
  return (Array.isArray(value) ? value : [value]) as any
}

// ✅ 9. 文档化泛型参数
/**
 * 映射数组元素
 * @template T - 输入元素类型
 * @template U - 输出元素类型
 * @param arr - 输入数组
 * @param fn - 转换函数
 * @returns 转换后的数组
 */
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn)
}

// ✅ 10. 保持简单
// 能用具体类型就用具体类型
// 只在真正需要灵活性时使用泛型
function getUser(id: number): Promise<User> {
  // 不需要泛型
  return fetch(`/api/users/${id}`).then((r) => r.json())
}

// 需要灵活性时使用泛型
function fetchData<T>(url: string): Promise<T> {
  return fetch(url).then((r) => r.json())
}
```

## 10. 🔗 引用

- [TypeScript Handbook - Generics][1]
- [TypeScript Handbook - More on Functions][2]
- [TypeScript Deep Dive - Generics][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/generics.html
[2]: https://www.typescriptlang.org/docs/handbook/2/functions.html
[3]: https://basarat.gitbook.io/typescript/type-system/generics
