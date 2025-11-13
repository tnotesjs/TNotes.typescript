# [0095. 构造函数类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0095.%20%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是构造函数类型？](#3--什么是构造函数类型)
  - [3.1. 核心概念](#31-核心概念)
  - [3.2. 声明构造函数类型的基本语法](#32-声明构造函数类型的基本语法)
- [4. 🤔 如何获取一个类的构造函数类型？](#4--如何获取一个类的构造函数类型)
- [5. 🆚 类的实例类型 vs 类类型（类的构造函数类型）](#5--类的实例类型-vs-类类型类的构造函数类型)
- [6. 🤔 如何利用“类的构造函数类型”获取“类的实例类型”？](#6--如何利用类的构造函数类型获取类的实例类型)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 构造函数类型的定义
- new 签名语法
- 类类型与构造函数类型
- `typeof 类名` 获取类的构造函数类型
- `InstanceType<T>` 根据类的构造函数类型获取类的实例类型

## 2. 🫧 评价

关于 TS 中的构造函数类型，涉及到类的相关知识，这里面的类型可能会有些绕。

- 类
- 类的类型
- 类的实例类型
- 构造函数
- 构造函数类型

核心在于理清上述这些概念。这里可以先给出一个比较宽泛的结论：

- 类的类型 = 构造函数类型
- 类 = 类的实例类型（如果类当做类型来用）
- 类 = 构造函数（如果类当做值来用）

## 3. 🤔 什么是构造函数类型？

构造函数类型（Constructor Type）描述一个可以用 `new` 关键字实例化的函数，即构造函数的类型签名。

构造函数类型也被称为类的构造函数类型，该类型主要就是用来描述类的类型的。

```ts
// 类定义
class User {
  constructor(public name: string, public age: number) {}
}

// 构造函数类型
type UserConstructor = new (name: string, age: number) => User
// 提示：TS 中的类有两层含义
// 1. 值层面：也就是 JS 层面，它相当于构造函数
// 2. 类型层面：也就是 TS 层面，它相当于类的实例类型

// 使用
const createUser: UserConstructor = User
const user = new createUser('Alice', 25)
```

### 3.1. 核心概念

- new 签名：表示可以用 `new` 调用
- 参数类型：构造函数的参数
- 返回类型 `User`：实例类型，类本身也可以用作类型，表示类的实例类型
- 类类型 `UserConstructor`：构造函数类型

### 3.2. 声明构造函数类型的基本语法

使用 new 关键字：

```ts
// 在类型别名中声明
type Constructor = new (...args: any[]) => any

// 在接口中声明
interface Constructor {
  new (...args: any[]): any
}
```

具体示例：

```ts
// 声明特定类的构造函数类型
class Point {
  constructor(public x: number, public y: number) {}
}

// 1. 使用类型别名声明
type PointConstructor1 = new (x: number, y: number) => Point
const createPoint: PointConstructor1 = Point
const p = new createPoint(10, 20)

// 2. 使用接口声明
interface PointConstructor2 {
  new (x: number, y: number): Point
}

const PointClass: PointConstructor2 = Point
```

## 4. 🤔 如何获取一个类的构造函数类型？

假设我们已经获取到了一个类，但是不清楚它的构造函数类型是什么？这时候可以利用 `typeof 类名` 来获取类的构造函数类型。

```ts
// 可以利用 typeof 获取类的构造函数类型
class User {
  constructor(public name: string, public age: number) {}

  greet() {
    return `Hello, ${this.name}`
  }
}

// typeof User 是构造函数类型
type UserClass = typeof User

// 等价于
// type UserClass = new (name: string, age: number) => User

// 使用
function createUser(Ctor: typeof User, name: string, age: number): User {
  return new Ctor(name, age)
}
```

## 5. 🆚 类的实例类型 vs 类类型（类的构造函数类型）

```ts
class User {
  constructor(public name: string) {}
}

// 实例类型
type UserInstance = User

// 类类型（构造函数类型）
type UserClass = typeof User

// 使用
const user: UserInstance = new User('Alice') // 实例
const UserConstructor: UserClass = User // 构造函数

// 工厂函数
function factory(Ctor: UserClass): UserInstance {
  return new Ctor('Bob')
}
```

## 6. 🤔 如何利用“类的构造函数类型”获取“类的实例类型”？

假设我们已经获取到了类的构造函数类型，那么应该如何获取到类的实例类型呢？

这是可以通过类型计算得到的，你可以利用 `InstanceType<T>` 工具类型获取构造函数的实例类型，其中 `T` 就是类的构造函数类型。

```ts
// 可以利用 InstanceType<T> 获取构造函数的实例类型
class User {
  constructor(public name: string) {}
}

type UserClass = typeof User
type UserInstance = InstanceType<UserClass> // User

// 等价于
// type UserInstance = User
```

## 7. 🔗 引用

- [TypeScript Handbook - Classes][1]
- [TypeScript Handbook - Generics][2]
- [TypeScript Deep Dive - Mixins][3]
- [TypeScript Handbook - Utility Types][4]

[1]: https://www.typescriptlang.org/docs/handbook/2/classes.html
[2]: https://www.typescriptlang.org/docs/handbook/2/generics.html
[3]: https://basarat.gitbook.io/typescript/type-system/mixins
[4]: https://www.typescriptlang.org/docs/handbook/utility-types.html#instancetypetype
