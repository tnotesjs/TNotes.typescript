# [0111. 类的类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0111.%20%E7%B1%BB%E7%9A%84%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 类的双重身份](#3--类的双重身份)
- [4. 🤔 实例类型](#4--实例类型)
  - [4.1. 结构化类型系统](#41-结构化类型系统)
- [5. 🤔 类类型（构造函数类型）](#5--类类型构造函数类型)
  - [5.1. 构造签名](#51-构造签名)
  - [5.2. 类作为参数](#52-类作为参数)
- [6. 🤔 类的成员类型](#6--类的成员类型)
  - [6.1. 属性类型](#61-属性类型)
  - [6.2. 方法类型](#62-方法类型)
  - [6.3. 访问器类型](#63-访问器类型)
  - [6.4. 静态成员类型](#64-静态成员类型)
- [7. 🤔 类的继承和类型](#7--类的继承和类型)
  - [7.1. 基本继承](#71-基本继承)
  - [7.2. 类型兼容性](#72-类型兼容性)
  - [7.3. 保护类型](#73-保护类型)
- [8. 🤔 抽象类的类型](#8--抽象类的类型)
  - [8.1. 基本抽象类](#81-基本抽象类)
  - [8.2. 抽象类类型](#82-抽象类类型)
  - [8.3. 抽象构造签名](#83-抽象构造签名)
- [9. 🤔 泛型类](#9--泛型类)
  - [9.1. 基本泛型类](#91-基本泛型类)
  - [9.2. 泛型约束](#92-泛型约束)
  - [9.3. 多个泛型参数](#93-多个泛型参数)
  - [9.4. 泛型类的静态成员](#94-泛型类的静态成员)
- [10. 🔗 引用](#10--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 类的实例类型和构造函数类型
- 类成员的类型定义
- 类的继承和类型关系
- 抽象类的类型
- 泛型类的使用
- 类类型的实际应用

## 2. 🫧 评价

在 TypeScript 中，类（Class）具有双重身份：既是值也是类型。

类的双重特性：

- 作为值：可以实例化、继承、作为构造函数
- 作为类型：描述实例的结构和行为
- 类型检查：编译时验证类的使用
- 结构化类型：基于成员而非名称

类类型的关键概念：

| 概念     | 说明                 | 示例                             |
| -------- | -------------------- | -------------------------------- |
| 实例类型 | 类实例的类型         | `const p: Person = new Person()` |
| 类类型   | 构造函数的类型       | `typeof Person`                  |
| 静态成员 | 类本身的属性和方法   | `Person.species`                 |
| 实例成员 | 实例对象的属性和方法 | `person.name`                    |

类与接口的关系：

- 类实现接口：`class C implements I`
- 接口继承类：`interface I extends C`
- 结构兼容：类和接口可以相互兼容

理解类的类型，能帮助你：

1. 正确使用类作为类型注解
2. 理解实例类型和构造函数类型的区别
3. 掌握类的继承和多态
4. 实现类型安全的工厂模式

类是 TypeScript 面向对象编程的核心，理解类的类型系统是掌握 TypeScript 的关键。

## 3. 🤔 类的双重身份

类在 TypeScript 中既是值也是类型。

```ts
// ✅ 定义一个类
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

// 作为类型使用 - 表示实例类型
const person: Person = new Person('Alice', 30)

// 作为值使用 - 表示构造函数
const PersonClass = Person
const anotherPerson = new PersonClass('Bob', 25)

// typeof 获取构造函数类型
type PersonConstructor = typeof Person
const factory: PersonConstructor = Person
```

关键概念：

- 类名作为类型：指实例的类型
- typeof 类名：指构造函数的类型
- 值空间：运行时的类和实例
- 类型空间：编译时的类型检查

## 4. 🤔 实例类型

类名直接作为类型时，表示实例的类型。

```ts
// ✅ 实例类型
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

// User 作为类型，表示 User 的实例
const user: User = new User(1, 'Alice')

// 函数参数使用实例类型
function printUser(user: User) {
  console.log(user.getName())
}

printUser(user) // ✅

// 数组中的实例类型
const users: User[] = [new User(1, 'Alice'), new User(2, 'Bob')]

// 对象字面量不能直接赋值给类类型（除非结构兼容）
const user2: User = {
  id: 3,
  name: 'Charlie',
  getName() {
    return this.name
  },
} // ✅ 结构兼容
```

### 4.1. 结构化类型系统

```ts
// ✅ TypeScript 使用结构化类型系统
class Point {
  constructor(public x: number, public y: number) {}
}

class Point3D {
  constructor(public x: number, public y: number, public z: number) {}
}

// Point3D 有 Point 的所有成员，所以可以赋值
const point: Point = new Point3D(1, 2, 3) // ✅

// 对象字面量如果结构兼容也可以
const point2: Point = { x: 1, y: 2 } // ✅
```

## 5. 🤔 类类型（构造函数类型）

使用 `typeof` 获取类的构造函数类型。

```ts
// ✅ 构造函数类型
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

### 5.1. 构造签名

```ts
// ✅ 手动定义构造函数类型
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

### 5.2. 类作为参数

```ts
// ✅ 接受类作为参数
function instantiate<T>(Ctor: new () => T): T {
  return new Ctor()
}

class Empty {}
const instance = instantiate(Empty)

// ✅ 带参数的构造函数
function create<T>(Ctor: new (...args: any[]) => T, ...args: any[]): T {
  return new Ctor(...args)
}

class Point {
  constructor(public x: number, public y: number) {}
}

const point = create(Point, 10, 20)
```

## 6. 🤔 类的成员类型

类的成员包括属性、方法、访问器。

### 6.1. 属性类型

```ts
// ✅ 属性类型
class User {
  // 显式类型注解
  id: number
  name: string
  email: string

  // 可选属性
  phone?: string

  // 只读属性
  readonly createdAt: Date

  // 类型推断
  isActive = true // boolean

  constructor(id: number, name: string, email: string) {
    this.id = id
    this.name = name
    this.email = email
    this.createdAt = new Date()
  }
}

const user = new User(1, 'Alice', 'alice@example.com')
// user.createdAt = new Date()  // ❌ Error: readonly
```

### 6.2. 方法类型

```ts
// ✅ 方法类型
class Calculator {
  // 普通方法
  add(a: number, b: number): number {
    return a + b
  }

  // 方法重载
  format(value: number): string
  format(value: string): string
  format(value: number | string): string {
    return String(value)
  }

  // 箭头函数属性（保持 this 绑定）
  multiply = (a: number, b: number): number => {
    return a * b
  }
}

const calc = new Calculator()
const sum: number = calc.add(1, 2)
const formatted: string = calc.format(42)
```

### 6.3. 访问器类型

```ts
// ✅ getter 和 setter
class Temperature {
  private _celsius: number = 0

  get celsius(): number {
    return this._celsius
  }

  set celsius(value: number) {
    this._celsius = value
  }

  get fahrenheit(): number {
    return (this._celsius * 9) / 5 + 32
  }

  set fahrenheit(value: number) {
    this._celsius = ((value - 32) * 5) / 9
  }
}

const temp = new Temperature()
temp.celsius = 25
console.log(temp.fahrenheit) // 77

temp.fahrenheit = 77
console.log(temp.celsius) // 25
```

### 6.4. 静态成员类型

```ts
// ✅ 静态成员
class MathUtil {
  // 静态属性
  static PI: number = 3.14159
  static readonly E: number = 2.71828

  // 静态方法
  static max(...numbers: number[]): number {
    return Math.max(...numbers)
  }

  // 实例方法
  double(n: number): number {
    return n * 2
  }
}

// 访问静态成员
const pi: number = MathUtil.PI
const max: number = MathUtil.max(1, 5, 3)

// 实例成员
const util = new MathUtil()
const doubled: number = util.double(21)
```

## 7. 🤔 类的继承和类型

子类继承父类的类型定义。

### 7.1. 基本继承

```ts
// ✅ 类的继承
class Animal {
  constructor(public name: string) {}

  move(distance: number = 0) {
    console.log(`${this.name} moved ${distance}m`)
  }
}

class Dog extends Animal {
  constructor(name: string) {
    super(name)
  }

  bark() {
    console.log('Woof!')
  }

  // 重写父类方法
  move(distance: number = 5) {
    console.log('Running...')
    super.move(distance)
  }
}

// Dog 实例同时具有 Animal 和 Dog 的类型
const dog: Dog = new Dog('Buddy')
dog.move() // Dog 的方法
dog.bark() // Dog 的方法

// 子类可以赋值给父类类型
const animal: Animal = new Dog('Max')
animal.move()
// animal.bark()  // ❌ Error: Animal 类型没有 bark
```

### 7.2. 类型兼容性

```ts
// ✅ 子类型可以赋值给父类型
class Person {
  constructor(public name: string) {}
}

class Employee extends Person {
  constructor(name: string, public salary: number) {
    super(name)
  }
}

// ✅ 协变：子类 -> 父类
const person: Person = new Employee('Alice', 50000)

// ❌ 逆变不成立
// const employee: Employee = new Person('Bob')  // Error

// 函数参数是逆变的
function greetPerson(person: Person) {
  console.log(person.name)
}

function greetEmployee(employee: Employee) {
  console.log(`${employee.name}: $${employee.salary}`)
}

greetPerson(new Employee('Alice', 50000)) // ✅
// greetEmployee(new Person('Bob'))  // ❌
```

### 7.3. 保护类型

```ts
// ✅ protected 成员
class Base {
  protected value: number = 0

  protected getValue(): number {
    return this.value
  }
}

class Derived extends Base {
  increment() {
    this.value++ // ✅ 子类可以访问
    return this.getValue()
  }
}

const derived = new Derived()
// derived.value  // ❌ Error: protected
// derived.getValue()  // ❌ Error: protected
derived.increment() // ✅
```

## 8. 🤔 抽象类的类型

抽象类定义不完整的类，必须被继承。

### 8.1. 基本抽象类

```ts
// ✅ 抽象类
abstract class Shape {
  constructor(public color: string) {}

  // 抽象方法
  abstract getArea(): number
  abstract getPerimeter(): number

  // 具体方法
  describe(): string {
    return `A ${this.color} shape with area ${this.getArea()}`
  }
}

// ❌ 不能实例化抽象类
// const shape = new Shape('red')  // Error

// ✅ 必须实现所有抽象方法
class Circle extends Shape {
  constructor(color: string, public radius: number) {
    super(color)
  }

  getArea(): number {
    return Math.PI * this.radius  2
  }

  getPerimeter(): number {
    return 2 * Math.PI * this.radius
  }
}

const circle = new Circle('red', 10)
console.log(circle.describe())
```

### 8.2. 抽象类类型

```ts
// ✅ 抽象类作为类型
abstract class Vehicle {
  abstract move(): void
}

class Car extends Vehicle {
  move() {
    console.log('Driving')
  }
}

class Bicycle extends Vehicle {
  move() {
    console.log('Pedaling')
  }
}

// 使用抽象类类型
function startVehicle(vehicle: Vehicle) {
  vehicle.move()
}

startVehicle(new Car()) // ✅
startVehicle(new Bicycle()) // ✅
```

### 8.3. 抽象构造签名

```ts
// ✅ 抽象类的构造函数类型
abstract class Component {
  abstract render(): string
}

// 不能直接使用 typeof Component
// 因为抽象类不能被实例化

// 使用抽象构造签名
type AbstractConstructor<T> = abstract new (...args: any[]) => T

function processComponent(Ctor: AbstractConstructor<Component>) {
  // 只能访问原型，不能实例化
  console.log(Ctor.prototype)
}

processComponent(Component) // ✅
```

## 9. 🤔 泛型类

类可以使用泛型参数。

### 9.1. 基本泛型类

```ts
// ✅ 泛型类
class Box<T> {
  private value: T

  constructor(value: T) {
    this.value = value
  }

  getValue(): T {
    return this.value
  }

  setValue(value: T): void {
    this.value = value
  }
}

const numberBox = new Box<number>(42)
const num: number = numberBox.getValue()

const stringBox = new Box<string>('hello')
const str: string = stringBox.getValue()

// 类型推断
const autoBox = new Box(true) // Box<boolean>
```

### 9.2. 泛型约束

```ts
// ✅ 泛型约束
interface Identifiable {
  id: number
}

class Repository<T extends Identifiable> {
  private items: T[] = []

  add(item: T): void {
    this.items.push(item)
  }

  findById(id: number): T | undefined {
    return this.items.find((item) => item.id === id)
  }

  getAll(): T[] {
    return [...this.items]
  }
}

interface User {
  id: number
  name: string
}

const userRepo = new Repository<User>()
userRepo.add({ id: 1, name: 'Alice' })
const user = userRepo.findById(1)
```

### 9.3. 多个泛型参数

```ts
// ✅ 多个泛型参数
class Pair<K, V> {
  constructor(public key: K, public value: V) {}

  getKey(): K {
    return this.key
  }

  getValue(): V {
    return this.value
  }
}

const pair = new Pair<string, number>('age', 30)
const key: string = pair.getKey()
const value: number = pair.getValue()
```

### 9.4. 泛型类的静态成员

```ts
// ✅ 静态成员不能使用类的泛型
class Container<T> {
  private value: T

  // ❌ 静态成员不能引用类型参数
  // static defaultValue: T

  // ✅ 静态泛型方法
  static create<U>(value: U): Container<U> {
    return new Container(value)
  }

  constructor(value: T) {
    this.value = value
  }
}

const container = Container.create(42) // Container<number>
```

## 10. 🔗 引用

- [TypeScript Handbook - Classes][1]
- [TypeScript Handbook - Generics][2]
- [TypeScript Deep Dive - Classes][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/classes.html
[2]: https://www.typescriptlang.org/docs/handbook/2/generics.html
[3]: https://basarat.gitbook.io/typescript/future-javascript/classes
