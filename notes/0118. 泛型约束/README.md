# [0118. 泛型约束](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0118.%20%E6%B3%9B%E5%9E%8B%E7%BA%A6%E6%9D%9F)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是泛型约束?](#3--什么是泛型约束)
- [4. 🆚 有约束的泛型 vs 无约束的泛型](#4--有约束的泛型-vs-无约束的泛型)
- [5. 🤔 泛型约束的常见约束类型都有那些？](#5--泛型约束的常见约束类型都有那些)
- [6. 🤔 泛型参数之间如何互相约束？](#6--泛型参数之间如何互相约束)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 泛型约束的概念和语法
- extends 关键字的使用
- 类型参数之间的约束

## 2. 🫧 评价

泛型约束（Generic Constraints）使用 `extends` 关键字限制泛型参数的范围。

## 3. 🤔 什么是泛型约束?

泛型约束使用 `extends` 关键字限制类型参数必须满足某些条件，从而在编译时确保类型安全并支持对约束类型成员的访问。

```ts
// ❌ 无约束:无法安全访问 length
function getLength1<T>(arg: T): number {
  // return arg.length  // ❌ Error: T 可能没有 length
  return 0
}

// ✅ 有约束:可以安全访问 length
interface Lengthwise {
  length: number
}

function getLength2<T extends Lengthwise>(arg: T): number {
  return arg.length // ✅ 安全访问
}

getLength2('hello') // ✅ string 有 length
getLength2([1, 2, 3]) // ✅ array 有 length
getLength2({ length: 10, value: 'test' }) // ✅ 对象有 length
// getLength2(42)  // ❌ Error: number 没有 length
// Argument of type 'number' is not assignable to parameter of type 'Lengthwise'.(2345)
```

## 4. 🆚 有约束的泛型 vs 无约束的泛型

| 特性     | 有约束的泛型                 | 无约束的泛型 |
| -------- | ---------------------------- | ------------ |
| 类型安全 | 高                           | 中           |
| 可用操作 | 受约束类型支持               | 极少         |
| 灵活性   | 受限但可控                   | 最大         |
| 适用场景 | 需要使用类型，并访问特定成员 | 只做关联     |
| 类型推断 | 更精确                       | 更宽泛       |

## 5. 🤔 泛型约束的常见约束类型都有那些？

以下是一些相对来说比较常见的泛型约束的类型，比如将泛型参数约束为：

1. 接口
2. 类
3. 基本类型
4. 对象类型
5. 数组
6. 函数
7. Promise
8. 交叉类型
9. 构造函数

::: code-group

```ts [1]
// 约束为交叉类型
interface Named {
  name: string
}

function greet<T extends Named>(obj: T): string {
  return `Hello, ${obj.name}`
}

greet({ name: 'Alice', age: 30 }) // ✅
// greet({ age: 30 })  // ❌ Error: 缺少 name
```

```ts [2]
// 约束为类
class Animal {
  name: string
  constructor(name: string) {
    this.name = name
  }

  makeSound(): string {
    return 'Some sound'
  }
}

function playWithAnimal<T extends Animal>(animal: T): void {
  console.log(animal.name)
  console.log(animal.makeSound())
}

class Dog extends Animal {
  makeSound(): string {
    return 'Woof!'
  }
}

playWithAnimal(new Dog('Buddy')) // ✅

// ⚠️ 注意，由于 TS 在类型兼容性方面采用的是结构子类型策略
// 因此这里直接传入一个满足 Animal 结构的对象类型也是允许的
playWithAnimal({
  name: 'Not an animal',
  makeSound() {
    return ''
  },
}) // ✅
```

```ts [3]
// 约束为原始类型
function double<T extends number>(value: T): number {
  return value * 2
}

double(21) // ✅ 42
// double('21')  // ❌ Error: string 不满足约束

// 约束为联合类型
function format<T extends string | number>(value: T): string {
  return String(value)
}

format(42) // ✅
format('hello') // ✅
// format(true)  // ❌ Error: boolean 不满足约束
```

```ts [4]
// 约束为对象
function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 }
}

const result = merge({ a: 1 }, { b: 2 }) // { a: 1, b: 2 }
// merge(42, { b: 2 })  // ❌ Error: 42 不是 object 类型
```

```ts [5]
// 约束为数组
function first<T extends any[]>(arr: T): T[number] | undefined {
  return arr[0]
}

const num = first([1, 2, 3]) // number | undefined
const str = first(['a', 'b']) // string ｜ undefined
// first(42)  // ❌ Error: 42 不满足 any[]
```

```ts [6]
// 约束为函数
function callTwice<T extends (...args: any[]) => any>(fn: T): void {
  fn()
  fn()
}

callTwice(() => console.log('Hello')) // ✅
// callTwice(42)  // ❌ Error: 42 不兼容 (...args: any[]) => any 类型
```

```ts [7]
// 约束为 Promise
async function unwrap<T extends Promise<any>>(promise: T): Promise<Awaited<T>> {
  return await promise
}

;(async () => {
  const result = await unwrap(Promise.resolve(42)) // number
  console.log(result) // 42
})()
// unwrap(42)  // ❌ Error: 42 不兼容 Promise<any> 类型
```

```ts [8]
// 约束必须有特定属性
interface Identifiable {
  id: number
}

interface Timestamped {
  createdAt: Date
  updatedAt: Date
}

// 具体使用时，可以使用交叉类型 & 组合多个接口，要求泛型 T 同时满足这些接口。
function logEntity<T extends Identifiable & Timestamped>(entity: T): void {
  console.log(`Entity ${entity.id}`)
  console.log(`Created: ${entity.createdAt}`)
  console.log(`Updated: ${entity.updatedAt}`)
}

logEntity({
  // 必须的属性
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  // 也允许有其他额外的属性
  name: 'Test',
  foo: 123,
  bar: 'abc',
})
```

```ts [9]
// 约束为构造函数类型
interface Constructor<T = any> {
  new (...args: any[]): T
}

function createInstance<T>(ctor: Constructor<T>, ...args: any[]): T {
  return new ctor(...args)
}

class Person {
  constructor(public name: string) {}
}

const person = createInstance(Person, 'Alice') // Person
console.log(person.name) // 'Alice'
```

:::

## 6. 🤔 泛型参数之间如何互相约束？

泛型参数本身也是类型，类型和类型之间也是可以互相约束的。

示例：

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const person = { name: 'Alice', age: 30 }
const personName = getProperty(person, 'name') // string
const personAge = getProperty(person, 'age') // number
// getProperty(person, 'email')  // ❌ Error: 'email' 不是 person 的键
```

上述示例中的 `K extends keyof T` 这种写法，就是两个泛型参数之间的互相约束，要求 `K` 必须是 `T` 的键。

## 7. 🔗 引用

- [TypeScript Handbook - Generics][1]
- [TypeScript Handbook - Type Constraints][2]
- [TypeScript Deep Dive - Generics][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/generics.html
[2]: https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints
[3]: https://basarat.gitbook.io/typescript/type-system/generics
