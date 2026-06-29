# [0117. 泛型接口](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0117.%20%E6%B3%9B%E5%9E%8B%E6%8E%A5%E5%8F%A3)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 什么是泛型接口？](#3-什么是泛型接口)
  - [3.1. 泛型接口](#31-泛型接口)
  - [3.2. 泛型接口 vs 普通接口](#32-泛型接口-vs-普通接口)
  - [3.3. 基本写法](#33-基本写法)
- [4. 如何给泛型接口添加约束？](#4-如何给泛型接口添加约束)
- [5. 如何继承泛型接口？](#5-如何继承泛型接口)
- [6. 引用](#6-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 泛型接口的定义和语法

## 2. 评价

泛型接口（Generic Interface）是使用类型参数的接口，可以在使用时指定具体类型。

本节介绍的“泛型接口”和“泛型类”有很多共同点（比如添加约束、继承操作等）。

## 3. 什么是泛型接口？

### 3.1. 泛型接口

泛型接口使用类型参数定义结构，在使用时指定具体类型。

- 类型参数：`<T>` 是类型占位符，接口的类型可以作为参数传入
- 灵活性高：在使用接口时提供具体类型，同一个接口适用于多种类型，避免重复定义相似接口
- 类型一致性：所有使用 T 的地方类型相同，编译时检查类型一致性，类型错误可以在编译时就暴露

```ts
// ❌ 普通接口：每种类型需要单独定义
interface NumberBox {
  value: number
}

interface StringBox {
  value: string
}

// ✅ 泛型接口：一个定义适用多种类型
interface Box<T> {
  value: T
}

const numberBox: Box<number> = { value: 42 }
const stringBox: Box<string> = { value: 'hello' }
const boolBox: Box<boolean> = { value: true }
```

### 3.2. 泛型接口 vs 普通接口

| 特性 | 泛型接口 | 普通接口 |
| --- | --- | --- |
| 类型灵活性 | 高 | 低 |
| 代码复用 | 高 | 低（需要多个接口） |
| 类型关联 | 高（可以利用泛型参数关联接口内部多个位置的类型） | 低（每个位置的类型信息互相独立） |
| 复杂度 | 稍高 | 简单 |
| 适用场景 | 通用数据结构 | 特定领域，不考虑多类型的通用性 |

### 3.3. 基本写法

下面是常见的一些基本写法：

1. 接口定义
2. 泛型属性
3. 泛型方法
4. 默认类型参数

::: code-group

```ts [1]
// 基本泛型接口
interface Container<T> {
  value: T
  getValue(): T
  setValue(value: T): void
}

// 使用时指定类型
const numberContainer: Container<number> = {
  value: 42,
  getValue() {
    return this.value
  },
  setValue(value) {
    this.value = value
  },
}
```

```ts [2]
// 泛型属性
interface Result<T> {
  success: boolean
  data: T
  error?: string
  timestamp: Date
}

interface User {
  id: number
  name: string
}

const userResult: Result<User> = {
  success: true,
  data: { id: 1, name: 'Alice' },
  timestamp: new Date(),
}

const numberResult: Result<number> = {
  success: false,
  data: 0,
  error: 'Invalid input',
  timestamp: new Date(),
}
```

```ts [3]
// 接口中的泛型方法
interface Mapper<T> {
  // 使用接口的类型参数
  transform(item: T): T

  // 方法也可以有自己的类型参数
  map<U>(fn: (item: T) => U): U
}
```

```ts [4]
// 默认类型参数
interface BaseResponse<T = any> {
  status: number
  data: T
}

interface User {
  id: number
  name: string
}

// 使用默认类型
const response1: BaseResponse = {
  status: 200,
  data: { message: 'ok' }, // any
}

// 指定具体类型
const response2: BaseResponse<User> = {
  status: 200,
  data: { id: 1, name: 'Alice' }, // User
}
```

:::

## 4. 如何给泛型接口添加约束？

和给类的泛型添加约束非常相似。

1. 可以使用 extends 约束
2. 可以使用 `&` 交叉类型实现多重约束
3. 可以使用 keyof 约束

::: code-group

```ts [1]
// 约束类型必须有特定属性
interface Identifiable {
  id: number
}

interface Repository<T extends Identifiable> {
  items: T[]
  findById(id: number): T | undefined
  add(item: T): void
  remove(id: number): boolean
}

interface User {
  id: number
  name: string
}

const userRepo: Repository<User> = {
  items: [],
  findById(id) {
    return this.items.find((item) => item.id === id)
  },
  add(item) {
    this.items.push(item)
  },
  remove(id) {
    const index = this.items.findIndex((item) => item.id === id)
    if (index > -1) {
      this.items.splice(index, 1)
      return true
    }
    return false
  },
}
```

```ts [2]
// 使用交叉类型实现多重约束
interface Named {
  name: string
}

interface Aged {
  age: number
}

interface PersonService<T extends Named & Aged> {
  people: T[]
  findByName(name: string): T[]
  findByAge(age: number): T[]
  getAverageAge(): number
}
```

```ts [3]
// 使用 keyof 约束键
interface KeyValueStore<T> {
  get<K extends keyof T>(key: K): T[K]
  set<K extends keyof T>(key: K, value: T[K]): void
  has<K extends keyof T>(key: K): boolean
}

interface Config {
  host: string
  port: number
  ssl: boolean
}

class ConfigStore implements KeyValueStore<Config> {
  private data: Config = {
    host: 'localhost',
    port: 3000,
    ssl: false,
  }

  get<K extends keyof Config>(key: K): Config[K] {
    return this.data[key]
  }

  set<K extends keyof Config>(key: K, value: Config[K]): void {
    this.data[key] = value
  }

  has<K extends keyof Config>(key: K): boolean {
    return key in this.data
  }
}

const config = new ConfigStore()
console.log(config.get('host')) // 'localhost'
config.set('port', 8080)
console.log(config.has('ssl')) // true
```

:::

## 5. 如何继承泛型接口？

泛型接口的继承跟泛型类的继承非常相似。

1. 继承泛型接口
   - 可以指定具体类型
   - 可以保持泛型
   - 可以添加新的类型参数
2. 同时继承多个泛型接口

::: code-group

```ts [1]
// 继承泛型接口
interface Container<T> {
  value: T
  getValue(): T
}

// 1. 指定具体类型
interface StringContainer extends Container<string> {
  toUpperCase(): string
}

// 2. 保持泛型
interface ExtendedContainer<T> extends Container<T> {
  setValue(value: T): void
  reset(): void
}

// 3. 添加新的类型参数
interface PairContainer<T, U> extends Container<T> {
  secondValue: U
  getSecondValue(): U
}
```

```ts [2]
// 继承多个泛型接口
interface Readable<T> {
  data: T
  read(): T
}

interface Writable<T> {
  write(value: T): void
}

interface ReadWritable<T> extends Readable<T>, Writable<T> {
  clear(): void
}

const storage: ReadWritable<string> = {
  data: '',

  read() {
    return this.data
  },

  write(value) {
    this.data = value
  },

  clear() {
    this.data = ''
  },
}
```

:::

## 6. 引用

- [TypeScript Handbook - Generics][1]
- [TypeScript Handbook - Interfaces][2]
- [TypeScript Deep Dive - Generics][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/generics.html
[2]: https://www.typescriptlang.org/docs/handbook/2/objects.html
[3]: https://basarat.gitbook.io/typescript/type-system/generics
