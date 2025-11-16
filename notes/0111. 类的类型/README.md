# [0111. 类的类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0111.%20%E7%B1%BB%E7%9A%84%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 类在 TS 中是“值”还是“类型”？](#3--类在-ts-中是值还是类型)
- [4. 🤔 类作为类型使用时，表示什么？](#4--类作为类型使用时表示什么)
- [5. 🤔 类视作值使用的时候，它的类型是什么？](#5--类视作值使用的时候它的类型是什么)
- [6. 🔗 引用](#6--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 类的类型（类的构造函数类型）
- 类当做类型使用（类的实例类型）

## 2. 🫧 评价

在 TypeScript 中，类（Class）具有双重身份：既是值也是类型，这篇笔记主要讨论 TS 中类的双重身份（值、类型）。

## 3. 🤔 类在 TS 中是“值”还是“类型”？

类在 TS 中拥有双重身份，既是值也是类型。

- 类名作为类型：指类的实例的类型
- typeof 类名：指类的构造函数的类型
- 值空间：运行时的类和实例
- 类型空间：编译时的类型检查

```ts
class Person {
  name: string
  age: number

  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }

  greet() {
    return `Hello, I'm ${this.name}`
  }
}

const person: Person = new Person('Alice', 30)
// 表达式左边 person: Person 作为类型使用 - 表示类的实例类型
// 表达式右边 new Person('Alice', 30) 作为值使用 - 表示类的构造函数，使用 new 来构造一个类的实例

// 作为值使用 - 表示类的构造函数 - 可以独立参与变量的赋值
const PersonClass = Person
// new 一个类实例
const anotherPerson = new PersonClass('Bob', 25)

// 可以使用 typeof 获取类的类型 - 也就是构造函数类型
type PersonConstructor = typeof Person
const factory: PersonConstructor = Person
```

## 4. 🤔 类作为类型使用时，表示什么？

类名直接作为类型时，表示类的实例的类型。

```ts
class User {
  id: number
  name: string

  constructor(id: number, name: string) {
    this.id = id
    this.name = name
  }

  getName(): string {
    return this.name
  }
}

const user: User = new User(1, 'Alice')
// 赋值表达式左边 - const user: User - 此时 User 作为类型，表示 User 的实例

// user: User 函数参数使用实例类型，表示传入的 user 必须是 User 类的实例
function printUser(user: User) {
  console.log(user.getName())
}

printUser(user) // ✅ user 是 new User 的返回结果，是属于 User 类的实例

// 数组中的实例类型
const users: User[] = [new User(1, 'Alice'), new User(2, 'Bob')]
// 赋值表达式左边 - const users: User[] - 表示 users 是一个以 User 类实例组成的数组

// 在结构兼容的情况下，对象字面量也可以直接赋值给类的实例类型
const user3: User = {
  id: 3,
  name: 'Charlie',
  getName() {
    return this.name
  },
} // ✅ 结构兼容

const user4: User = {
  id: 5,
} // ❌ 结构不兼容
// Type '{ id: number; }' is missing the following properties from type 'User': name, getName(2739)
```

类型兼容性规则满足 TS 的结构化类型系统约束。

只要结构满足要求，不同的类实例类型之间或者对象字面量和类实例类型之间可以互相赋值。

```ts
class Point {
  constructor(public x: number, public y: number) {}
}

class Point3D {
  constructor(public x: number, public y: number, public z: number) {}
}

// Point3D 有 Point 的所有成员，所以可以赋值
const point: Point = new Point3D(1, 2, 3) // ✅ OK

// 对象字面量如果结构兼容也可以
const point2: Point = { x: 1, y: 2 } // ✅ OK
```

## 5. 🤔 类视作值使用的时候，它的类型是什么？

在 TS 中，所有值都是有类型的。

类可以作为类型使用，也可以作为值使用。当类作为值使用时，它的类型就是构造函数类型，可以使用 `typeof 类名` 获取类的构造函数类型。

```ts
class Animal {
  name: string

  constructor(name: string) {
    this.name = name
  }

  static species = 'Unknown'

  static describe() {
    return `This is a ${this.species}`
  }
}

// typeof Animal 是构造函数类型
type AnimalConstructor = typeof Animal

// 使用构造函数类型
function createAnimal(Ctor: typeof Animal, name: string): Animal {
  return new Ctor(name)
}

const dog = createAnimal(Animal, 'Dog')

// 访问静态成员
const species: string = Animal.species
const description: string = Animal.describe()
```

可以手动定义类的类型（构造函数类型），类本质上就是一个对象，我们可以使用 `interface` 接口来描述这个对象，它的构造函数签名就是在函数调用签名 `{ (params): ReturnType }` 的基础上加上 `new` 关键字，表示这是一个构造函数，可以用于实例化对象。

```ts
interface PersonConstructor {
  new (name: string, age: number): Person
  species: string
  create(name: string): Person
}

class Person {
  static species = 'Human'

  constructor(public name: string, public age: number) {}

  static create(name: string): Person {
    return new Person(name, 0)
  }
}

// Person 符合 PersonConstructor
const PersonCtor: PersonConstructor = Person

// 使用
const person = new PersonCtor('Alice', 30)
console.log(PersonCtor.species) // 'Human'
```

## 6. 🔗 引用

- [TypeScript Handbook - Classes][1]
- [TypeScript Handbook - Generics][2]
- [TypeScript Deep Dive - Classes][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/classes.html
[2]: https://www.typescriptlang.org/docs/handbook/2/generics.html
[3]: https://basarat.gitbook.io/typescript/future-javascript/classes
