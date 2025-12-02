# [0170. declare 声明函数](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0170.%20declare%20%E5%A3%B0%E6%98%8E%E5%87%BD%E6%95%B0)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 如何使用 declare 声明函数？](#3--如何使用-declare-声明函数)
  - [3.1. 基本语法](#31-基本语法)
  - [3.2. 声明不同返回类型](#32-声明不同返回类型)
  - [3.3. 声明带参数的函数](#33-声明带参数的函数)
  - [3.4. 剩余参数](#34-剩余参数)
- [4. 🤔 如何声明函数重载？](#4--如何声明函数重载)
  - [4.1. 基本重载](#41-基本重载)
  - [4.2. 不同参数类型的重载](#42-不同参数类型的重载)
  - [4.3. 不同参数数量的重载](#43-不同参数数量的重载)
  - [4.4. 复杂重载](#44-复杂重载)
- [5. 🤔 如何声明可选参数和默认参数？](#5--如何声明可选参数和默认参数)
  - [5.1. 可选参数](#51-可选参数)
  - [5.2. 多个可选参数](#52-多个可选参数)
  - [5.3. 默认参数](#53-默认参数)
  - [5.4. 可选参数与联合类型](#54-可选参数与联合类型)
- [6. 🤔 如何声明泛型函数？](#6--如何声明泛型函数)
  - [6.1. 基本泛型](#61-基本泛型)
  - [6.2. 多个类型参数](#62-多个类型参数)
  - [6.3. 泛型约束](#63-泛型约束)
  - [6.4. 泛型数组](#64-泛型数组)
  - [6.5. 泛型 Promise](#65-泛型-promise)
  - [6.6. 函数式编程](#66-函数式编程)
  - [6.7. 实际应用示例](#67-实际应用示例)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- declare 声明函数的基本语法
- 函数重载的声明方式
- 可选参数和默认参数的声明
- 泛型函数的声明
- 函数声明的实际应用

## 2. 🫧 评价

使用 declare 声明函数可以为外部 JavaScript 函数提供类型信息。

- declare 函数声明只包含函数签名，不包含函数体
- 支持函数重载，可以声明多个函数签名
- 可以声明可选参数、剩余参数和泛型参数
- 适用于全局函数、模块函数和命名空间函数
- 是编写 `.d.ts` 类型声明文件的基础

## 3. 🤔 如何使用 declare 声明函数？

declare 声明函数的基本语法非常简单。

### 3.1. 基本语法

```ts
// 声明全局函数
declare function greet(name: string): string

// 使用函数
const message = greet('World')
console.log(message)

// 编译后只保留使用代码
// const message = greet('World');
// console.log(message);
```

### 3.2. 声明不同返回类型

```ts
// 返回字符串
declare function getName(): string

// 返回数字
declare function getAge(): number

// 返回布尔值
declare function isActive(): boolean

// 返回对象
declare function getUser(): { id: number; name: string }

// 返回数组
declare function getList(): string[]

// 无返回值
declare function log(message: string): void

// 返回 Promise
declare function fetchData(): Promise<any>
```

### 3.3. 声明带参数的函数

```ts
// 单个参数
declare function double(num: number): number

// 多个参数
declare function add(a: number, b: number): number

// 不同类型的参数
declare function format(template: string, ...values: any[]): string

// 对象参数
declare function createUser(options: {
  name: string
  age: number
  email?: string
}): void

// 使用
double(5)
add(1, 2)
format('Hello %s', 'World')
createUser({ name: 'Alice', age: 25 })
```

### 3.4. 剩余参数

```ts
// 声明剩余参数
declare function sum(...numbers: number[]): number
declare function combine(...items: (string | number)[]): string

// 使用
sum(1, 2, 3, 4, 5)
combine('a', 1, 'b', 2)
```

## 4. 🤔 如何声明函数重载？

函数重载允许同一个函数接受不同类型或数量的参数。

### 4.1. 基本重载

```ts
// 声明函数重载
declare function parse(value: string): object
declare function parse(value: string, reviver: Function): object

// 使用
const obj1 = parse('{"name":"Alice"}')
const obj2 = parse('{"name":"Bob"}', (key, value) => value)
```

### 4.2. 不同参数类型的重载

```ts
// 根据参数类型返回不同类型
declare function getValue(key: string): string
declare function getValue(key: number): number
declare function getValue(key: boolean): boolean

// 使用
const str = getValue('name') // string
const num = getValue(123) // number
const bool = getValue(true) // boolean
```

### 4.3. 不同参数数量的重载

```ts
// 无参数
declare function random(): number
// 一个参数
declare function random(max: number): number
// 两个参数
declare function random(min: number, max: number): number

// 使用
random() // 0-1 之间的随机数
random(10) // 0-10 之间的随机数
random(5, 10) // 5-10 之间的随机数
```

### 4.4. 复杂重载

```ts
// jQuery 风格的重载
declare function $(selector: string): JQuery
declare function $(element: HTMLElement): JQuery
declare function $(callback: () => void): void
declare function $(html: string, attributes: object): JQuery

interface JQuery {
  html(): string
  html(content: string): JQuery
}

// 使用
$('#app') // 选择器
$(document.body) // DOM 元素
$(() => console.log('ready')) // 回调函数
$('<div>', { class: 'container' }) // 创建元素
```

## 5. 🤔 如何声明可选参数和默认参数？

可选参数和默认参数的声明方式略有不同。

### 5.1. 可选参数

```ts
// 使用 ? 标记可选参数
declare function buildName(firstName: string, lastName?: string): string

// 使用
buildName('John')
buildName('John', 'Doe')
```

### 5.2. 多个可选参数

```ts
declare function createUser(
  name: string,
  age?: number,
  email?: string,
  phone?: string
): void

// 使用
createUser('Alice')
createUser('Bob', 25)
createUser('Charlie', 30, 'charlie@example.com')
```

### 5.3. 默认参数

```ts
// declare 声明中不能直接指定默认值
// 但可以通过重载模拟
declare function greet(name: string, greeting?: string): string

// 或者使用联合类型
declare function setVolume(level: number | undefined): void

// 使用
greet('Alice')
greet('Bob', 'Hi')
setVolume(50)
setVolume(undefined) // 使用默认值
```

### 5.4. 可选参数与联合类型

```ts
// 可选参数
declare function process(value?: string): void

// 等价于联合类型
declare function process(value: string | undefined): void

// 使用
process()
process('value')
process(undefined)
```

## 6. 🤔 如何声明泛型函数？

泛型函数声明可以让函数处理多种类型。

### 6.1. 基本泛型

```ts
// 声明泛型函数
declare function identity<T>(value: T): T

// 使用
const num = identity(123) // number
const str = identity('hello') // string
const arr = identity([1, 2, 3]) // number[]
```

### 6.2. 多个类型参数

```ts
// 多个泛型参数
declare function pair<T, U>(first: T, second: U): [T, U]

// 使用
const p1 = pair('name', 25) // [string, number]
const p2 = pair(true, 'active') // [boolean, string]
```

### 6.3. 泛型约束

```ts
// 约束泛型类型
declare function getLength<T extends { length: number }>(value: T): number

// 使用
getLength('hello') // 正确：string 有 length
getLength([1, 2, 3]) // 正确：array 有 length
getLength({ length: 5 }) // 正确：对象有 length
```

### 6.4. 泛型数组

```ts
// 操作泛型数组
declare function first<T>(arr: T[]): T | undefined
declare function last<T>(arr: T[]): T | undefined
declare function map<T, U>(arr: T[], fn: (item: T) => U): U[]

// 使用
first([1, 2, 3]) // number | undefined
last(['a', 'b', 'c']) // string | undefined
map([1, 2, 3], (x) => x * 2) // number[]
map(['a', 'b'], (s) => s.length) // number[]
```

### 6.5. 泛型 Promise

```ts
// 异步泛型函数
declare function fetchJSON<T>(url: string): Promise<T>
declare function delay<T>(ms: number, value: T): Promise<T>

// 使用
interface User {
  id: number
  name: string
}

fetchJSON<User>('/api/user').then((user) => {
  console.log(user.name) // 类型安全
})

delay(1000, 'done').then((value) => {
  console.log(value) // string
})
```

### 6.6. 函数式编程

```ts
// 声明高阶函数
declare function compose<T, U, V>(f: (x: U) => V, g: (x: T) => U): (x: T) => V

declare function pipe<T, U>(value: T, fn: (x: T) => U): U

// 使用
const addOne = (x: number) => x + 1
const double = (x: number) => x * 2

const addOneAndDouble = compose(double, addOne)
const result = addOneAndDouble(5) // 12

pipe(5, addOne) // 6
```

### 6.7. 实际应用示例

```ts
// 声明常用工具函数
declare function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K>

declare function omit<T, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K>

declare function partial<T extends Function>(fn: T, ...args: any[]): T

// 使用
interface User {
  id: number
  name: string
  email: string
  age: number
}

const user: User = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  age: 25,
}

const nameAndEmail = pick(user, 'name', 'email')
// { name: string; email: string }

const withoutId = omit(user, 'id')
// { name: string; email: string; age: number }
```

## 7. 🔗 引用

- [TypeScript Handbook - Functions][1]
- [Declaration Files - Functions][2]
- [Function Overloads][3]
- [Generic Functions][4]

[1]: https://www.typescriptlang.org/docs/handbook/2/functions.html
[2]: https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html#functions
[3]: https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads
[4]: https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-functions
