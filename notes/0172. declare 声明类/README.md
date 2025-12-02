# [0172. declare 声明类](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0172.%20declare%20%E5%A3%B0%E6%98%8E%E7%B1%BB)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 如何使用 declare 声明类？](#3--如何使用-declare-声明类)
  - [3.1. 基本语法](#31-基本语法)
  - [3.2. 声明构造函数](#32-声明构造函数)
  - [3.3. 声明实例属性](#33-声明实例属性)
- [4. 🤔 如何声明类的属性和方法？](#4--如何声明类的属性和方法)
  - [4.1. 实例方法](#41-实例方法)
  - [4.2. 静态成员](#42-静态成员)
  - [4.3. 访问修饰符](#43-访问修饰符)
  - [4.4. 存取器](#44-存取器)
  - [4.5. 方法重载](#45-方法重载)
- [5. 🤔 如何声明类的继承？](#5--如何声明类的继承)
  - [5.1. 类继承](#51-类继承)
  - [5.2. 实现接口](#52-实现接口)
  - [5.3. 抽象类](#53-抽象类)
  - [5.4. 继承链](#54-继承链)
- [6. 🤔 如何声明抽象类和泛型类？](#6--如何声明抽象类和泛型类)
  - [6.1. 泛型类](#61-泛型类)
  - [6.2. 多个泛型参数](#62-多个泛型参数)
  - [6.3. 泛型约束](#63-泛型约束)
  - [6.4. 泛型继承](#64-泛型继承)
  - [6.5. 实际应用示例](#65-实际应用示例)
  - [6.6. 静态泛型方法](#66-静态泛型方法)
  - [6.7. 混合使用](#67-混合使用)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- declare 声明类的基本语法
- 类的属性、方法和构造函数的声明
- 类的继承和实现
- 抽象类和泛型类的声明
- 静态成员和访问修饰符

## 2. 🫧 评价

使用 declare 声明类可以为外部 JavaScript 类提供类型定义。

- declare 类声明只包含类型信息，没有实现代码
- 支持实例属性、静态属性、方法、构造函数等所有类成员
- 可以声明继承关系、接口实现和泛型参数
- 常用于为第三方库的类提供类型定义
- 是编写 `.d.ts` 文件时不可或缺的技能

## 3. 🤔 如何使用 declare 声明类？

declare 声明类的基本语法与普通类声明类似，但不包含实现。

### 3.1. 基本语法

```ts
// 声明一个简单的类
declare class User {
  name: string
  age: number

  constructor(name: string, age: number)

  greet(): string
}

// 使用类
const user = new User('Alice', 25)
console.log(user.name)
console.log(user.greet())

// 编译后保留使用代码
// const user = new User('Alice', 25);
// console.log(user.name);
// console.log(user.greet());
```

### 3.2. 声明构造函数

```ts
// 基本构造函数
declare class Point {
  constructor(x: number, y: number)
}

// 多个构造函数重载
declare class Rectangle {
  constructor(width: number, height: number)
  constructor(size: number)
}

// 可选参数
declare class Logger {
  constructor(name?: string)
}

// 使用
new Point(10, 20)
new Rectangle(100, 50)
new Rectangle(100)
new Logger()
new Logger('AppLogger')
```

### 3.3. 声明实例属性

```ts
// 各种类型的属性
declare class Product {
  // 必需属性
  id: number
  name: string

  // 可选属性
  description?: string

  // 只读属性
  readonly createdAt: Date

  // 任意类型
  metadata: any
}

// 使用
const product = new Product()
product.id = 1
product.name = 'Laptop'
product.description = 'High-performance laptop'
console.log(product.createdAt)
// product.createdAt = new Date();  // 错误：只读属性
```

## 4. 🤔 如何声明类的属性和方法？

类的属性和方法声明支持各种修饰符和类型。

### 4.1. 实例方法

```ts
// 基本方法
declare class Calculator {
  add(a: number, b: number): number
  subtract(a: number, b: number): number

  // 可选参数
  multiply(a: number, b?: number): number

  // 返回 void
  clear(): void

  // 返回 this（链式调用）
  reset(): this
}

// 使用
const calc = new Calculator()
calc.add(1, 2)
calc.reset().clear() // 链式调用
```

### 4.2. 静态成员

```ts
// 静态属性和方法
declare class MathUtils {
  static PI: number
  static E: number

  static abs(value: number): number
  static max(...values: number[]): number
  static random(): number
}

// 使用
console.log(MathUtils.PI)
MathUtils.abs(-5)
MathUtils.max(1, 2, 3, 4, 5)
```

### 4.3. 访问修饰符

```ts
// public、private、protected
declare class BankAccount {
  // 公共属性（默认）
  public accountNumber: string

  // 私有属性
  private balance: number

  // 受保护属性
  protected owner: string

  // 公共方法
  public deposit(amount: number): void

  // 私有方法
  private validateAmount(amount: number): boolean

  // 受保护方法
  protected calculateInterest(): number
}

// 使用
const account = new BankAccount()
account.accountNumber = '123456'
account.deposit(100)
// account.balance;  // 错误：私有属性
```

### 4.4. 存取器

```ts
// getter 和 setter
declare class Temperature {
  get celsius(): number
  set celsius(value: number)

  get fahrenheit(): number
  set fahrenheit(value: number)
}

// 使用
const temp = new Temperature()
temp.celsius = 25
console.log(temp.fahrenheit)
```

### 4.5. 方法重载

```ts
// 方法重载
declare class DataService {
  fetch(id: number): Promise<any>
  fetch(ids: number[]): Promise<any[]>
  fetch(query: object): Promise<any[]>
}

// 使用
const service = new DataService()
service.fetch(1)
service.fetch([1, 2, 3])
service.fetch({ status: 'active' })
```

## 5. 🤔 如何声明类的继承？

类的继承和接口实现声明与普通类相同。

### 5.1. 类继承

```ts
// 基类
declare class Animal {
  name: string
  constructor(name: string)
  move(distance: number): void
}

// 派生类
declare class Dog extends Animal {
  breed: string
  constructor(name: string, breed: string)
  bark(): void
}

// 使用
const dog = new Dog('Buddy', 'Golden Retriever')
dog.name
dog.breed
dog.move(10)
dog.bark()
```

### 5.2. 实现接口

```ts
// 接口
interface Serializable {
  serialize(): string
}

interface Comparable<T> {
  compareTo(other: T): number
}

// 类实现接口
declare class User implements Serializable, Comparable<User> {
  id: number
  name: string

  serialize(): string
  compareTo(other: User): number
}

// 使用
const user = new User()
const json = user.serialize()
user.compareTo(new User())
```

### 5.3. 抽象类

```ts
// 抽象基类
declare abstract class Shape {
  abstract area(): number
  abstract perimeter(): number

  describe(): string
}

// 具体实现类
declare class Circle extends Shape {
  radius: number

  constructor(radius: number)

  area(): number
  perimeter(): number
}

// 使用
// const shape = new Shape();  // 错误：不能实例化抽象类
const circle = new Circle(5)
console.log(circle.area())
```

### 5.4. 继承链

```ts
// 多层继承
declare class Entity {
  id: string
  createdAt: Date
}

declare class User extends Entity {
  username: string
  email: string
}

declare class AdminUser extends User {
  permissions: string[]
  isSuperAdmin: boolean
}

// 使用
const admin = new AdminUser()
admin.id // 来自 Entity
admin.username // 来自 User
admin.permissions // 来自 AdminUser
```

## 6. 🤔 如何声明抽象类和泛型类？

抽象类和泛型类的声明为类提供更强的表达能力。

### 6.1. 泛型类

```ts
// 基本泛型类
declare class Box<T> {
  value: T

  constructor(value: T)

  getValue(): T
  setValue(value: T): void
}

// 使用
const numberBox = new Box<number>(123)
const stringBox = new Box<string>('hello')

numberBox.getValue() // number
stringBox.getValue() // string
```

### 6.2. 多个泛型参数

```ts
// 多个类型参数
declare class Pair<K, V> {
  key: K
  value: V

  constructor(key: K, value: V)

  getKey(): K
  getValue(): V
}

// 使用
const pair = new Pair<string, number>('age', 25)
pair.getKey() // string
pair.getValue() // number
```

### 6.3. 泛型约束

```ts
// 约束泛型类型
declare class Repository<T extends { id: number }> {
  private items: T[]

  add(item: T): void
  remove(id: number): void
  findById(id: number): T | undefined
  getAll(): T[]
}

// 使用
interface User {
  id: number
  name: string
}

const userRepo = new Repository<User>()
userRepo.add({ id: 1, name: 'Alice' })
```

### 6.4. 泛型继承

```ts
// 泛型基类
declare class Collection<T> {
  protected items: T[]

  add(item: T): void
  remove(item: T): void
  size(): number
}

// 泛型派生类
declare class SortedCollection<T> extends Collection<T> {
  sort(compareFn: (a: T, b: T) => number): void
}

// 使用
const numbers = new SortedCollection<number>()
numbers.add(3)
numbers.add(1)
numbers.sort((a, b) => a - b)
```

### 6.5. 实际应用示例

```ts
// 数据访问层
declare class DataStore<T> {
  constructor(tableName: string)

  find(query: Partial<T>): Promise<T[]>
  findOne(id: string): Promise<T | null>
  create(data: Omit<T, 'id'>): Promise<T>
  update(id: string, data: Partial<T>): Promise<T>
  delete(id: string): Promise<boolean>
}

// 使用
interface Product {
  id: string
  name: string
  price: number
  stock: number
}

const productStore = new DataStore<Product>('products')

// 类型安全的操作
productStore.create({
  name: 'Laptop',
  price: 999,
  stock: 10,
})

productStore.update('123', {
  price: 899,
})
```

### 6.6. 静态泛型方法

```ts
// 类带有静态泛型方法
declare class Utils {
  static clone<T>(obj: T): T
  static merge<T, U>(obj1: T, obj2: U): T & U
  static map<T, U>(array: T[], fn: (item: T) => U): U[]
}

// 使用
const obj = { name: 'Alice' }
const cloned = Utils.clone(obj)

const merged = Utils.merge({ name: 'Bob' }, { age: 25 }) // { name: string; age: number }

const numbers = Utils.map(['1', '2', '3'], (x) => parseInt(x))
```

### 6.7. 混合使用

```ts
// 结合抽象类、泛型、接口
interface Identifiable {
  id: string
}

declare abstract class BaseModel<T extends Identifiable> {
  protected data: T

  constructor(data: T)

  abstract validate(): boolean

  getId(): string
  getData(): T
  setData(data: T): void
}

declare class UserModel extends BaseModel<User> {
  validate(): boolean

  getUsername(): string
}

interface User extends Identifiable {
  username: string
  email: string
}

// 使用
const userModel = new UserModel({
  id: '1',
  username: 'alice',
  email: 'alice@example.com',
})

userModel.validate()
userModel.getUsername()
```

## 7. 🔗 引用

- [TypeScript Handbook - Classes][1]
- [Declaration Files - Classes][2]
- [Generic Classes][3]
- [Abstract Classes][4]

[1]: https://www.typescriptlang.org/docs/handbook/2/classes.html
[2]: https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html#classes
[3]: https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-classes
[4]: https://www.typescriptlang.org/docs/handbook/2/classes.html#abstract-classes-and-members
