# [0112. 类的结构类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0112.%20%E7%B1%BB%E7%9A%84%E7%BB%93%E6%9E%84%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是结构类型系统？](#3--什么是结构类型系统)
  - [3.1. 名义类型对比](#31-名义类型对比)
- [4. 🤔 类的结构兼容性](#4--类的结构兼容性)
  - [4.1. 基本兼容性规则](#41-基本兼容性规则)
  - [4.2. 方法兼容性](#42-方法兼容性)
  - [4.3. 可选属性的兼容性](#43-可选属性的兼容性)
  - [4.4. 额外属性检查](#44-额外属性检查)
- [5. 🤔 私有和保护成员的影响](#5--私有和保护成员的影响)
  - [5.1. 私有成员破坏兼容性](#51-私有成员破坏兼容性)
  - [5.2. 继承类的私有成员兼容](#52-继承类的私有成员兼容)
  - [5.3. 保护成员的规则](#53-保护成员的规则)
  - [5.4. 公共成员和私有成员混合](#54-公共成员和私有成员混合)
- [6. 🤔 类与接口的兼容性](#6--类与接口的兼容性)
  - [6.1. 类实现接口](#61-类实现接口)
  - [6.2. 类自动兼容接口](#62-类自动兼容接口)
  - [6.3. 接口继承类](#63-接口继承类)
  - [6.4. 类和接口的互换](#64-类和接口的互换)
- [7. 🤔 类的继承和结构类型](#7--类的继承和结构类型)
  - [7.1. 子类兼容父类](#71-子类兼容父类)
  - [7.2. 结构兼容但不继承](#72-结构兼容但不继承)
  - [7.3. 多个类的共同结构](#73-多个类的共同结构)
- [8. 🤔 常见使用场景](#8--常见使用场景)
  - [8.1. 场景 1：Mock 对象测试](#81-场景-1mock-对象测试)
  - [8.2. 场景 2：适配器模式](#82-场景-2适配器模式)
  - [8.3. 场景 3：策略模式](#83-场景-3策略模式)
  - [8.4. 场景 4：依赖注入](#84-场景-4依赖注入)
  - [8.5. 场景 5：插件系统](#85-场景-5插件系统)
- [9. 🤔 常见错误和最佳实践](#9--常见错误和最佳实践)
  - [9.1. 错误 1：期望名义类型行为](#91-错误-1期望名义类型行为)
  - [9.2. 错误 2：忽略私有成员的影响](#92-错误-2忽略私有成员的影响)
  - [9.3. 错误 3：过度依赖结构兼容性](#93-错误-3过度依赖结构兼容性)
  - [9.4. 错误 4：忘记方法签名兼容性](#94-错误-4忘记方法签名兼容性)
  - [9.5. 最佳实践](#95-最佳实践)
- [10. 🔗 引用](#10--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 结构类型系统的概念
- 类的结构兼容性规则
- 私有和保护成员对兼容性的影响
- 类与接口的关系
- 类继承中的结构类型
- 实际应用场景

## 2. 🫧 评价

TypeScript 使用**结构类型系统**（Structural Type System），也称为"鸭子类型"（Duck Typing）。在这个系统中，**类型兼容性基于成员结构**，而不是类型的名称。

结构类型系统的特点：

- **基于结构**：看成员是否匹配，不看类型名称
- **灵活性**：不同名称的类型可以兼容
- **类型安全**：保证结构完整性
- **JavaScript 本质**：符合 JavaScript 的动态特性

结构类型 vs 名义类型：

| 特性         | 结构类型 (TypeScript) | 名义类型 (Java/C#) |
| ------------ | --------------------- | ------------------ |
| **判断依据** | 成员结构              | 类型名称           |
| **兼容性**   | 结构相同即兼容        | 必须显式声明关系   |
| **灵活性**   | 更灵活                | 更严格             |
| **适用场景** | 动态语言              | 静态语言           |

结构类型的优势：

1. **灵活**：无需显式声明类型关系
2. **渐进式**：易于迁移 JavaScript 代码
3. **自然**：符合 JavaScript 的使用习惯
4. **实用**：关注实际能力而非名称

理解类的结构类型，能帮助你：

1. 理解 TypeScript 的类型兼容性
2. 正确设计类和接口
3. 避免类型兼容性问题
4. 灵活使用多态

类的结构类型是 TypeScript 类型系统的核心特性，体现了其务实的设计哲学。

## 3. 🤔 什么是结构类型系统？

在结构类型系统中，如果两个类型具有**相同的结构**，则它们是**兼容的**。

```ts
// ✅ 结构类型示例
class Point2D {
  constructor(public x: number, public y: number) {}
}

class Vector2D {
  constructor(public x: number, public y: number) {}
}

// 虽然是不同的类，但结构相同
const point: Point2D = new Vector2D(10, 20) // ✅ 兼容
const vector: Vector2D = new Point2D(30, 40) // ✅ 兼容

// 对象字面量也可以
const point2: Point2D = { x: 5, y: 10 } // ✅ 兼容
```

**关键概念**：

- **结构相同**：成员名称和类型都匹配
- **无需继承**：不需要显式的继承关系
- **鸭子类型**："如果它走起来像鸭子，叫起来像鸭子，那它就是鸭子"
- **类型安全**：仍然保证类型安全

### 3.1. 名义类型对比

```ts
// 对比：Java 的名义类型系统（伪代码）
// class Point2D {
//   int x, y;
// }
//
// class Vector2D {
//   int x, y;
// }
//
// Point2D point = new Vector2D(10, 20);  // ❌ 编译错误
// 必须显式声明关系：class Vector2D extends Point2D

// TypeScript 的结构类型
class Point2D {
  constructor(public x: number, public y: number) {}
}

class Vector2D {
  constructor(public x: number, public y: number) {}
}

const point: Point2D = new Vector2D(10, 20) // ✅ 结构兼容
```

## 4. 🤔 类的结构兼容性

### 4.1. 基本兼容性规则

```ts
// ✅ 子集兼容性：更多成员可以赋值给更少成员
class Person {
  name: string

  constructor(name: string) {
    this.name = name
  }
}

class Employee {
  name: string
  salary: number

  constructor(name: string, salary: number) {
    this.name = name
    this.salary = salary
  }
}

// Employee 有 Person 的所有成员，所以兼容
const person: Person = new Employee('Alice', 50000) // ✅

// 反之不行：Person 缺少 salary
// const employee: Employee = new Person('Bob')  // ❌ Error
```

### 4.2. 方法兼容性

```ts
// ✅ 方法签名必须兼容
class Animal {
  move(distance: number): void {
    console.log(`Moved ${distance}m`)
  }
}

class Dog {
  move(distance: number): void {
    console.log(`Dog moved ${distance}m`)
  }

  bark(): void {
    console.log('Woof!')
  }
}

// Dog 有 Animal 的所有成员（move 方法）
const animal: Animal = new Dog() // ✅
animal.move(10)

// 不能调用 bark，因为 Animal 类型没有
// animal.bark()  // ❌ Error
```

### 4.3. 可选属性的兼容性

```ts
// ✅ 可选属性的兼容性
class Config {
  host: string
  port?: number

  constructor(host: string, port?: number) {
    this.host = host
    this.port = port
  }
}

class FullConfig {
  host: string
  port: number
  timeout: number

  constructor(host: string, port: number, timeout: number) {
    this.host = host
    this.port = port
    this.timeout = timeout
  }
}

// FullConfig 有 Config 的所有必需成员
const config: Config = new FullConfig('localhost', 3000, 5000) // ✅
```

### 4.4. 额外属性检查

```ts
// ⚠️ 对象字面量有额外的属性检查
class Point {
  constructor(public x: number, public y: number) {}
}

// ✅ 通过变量赋值（绕过额外属性检查）
const obj = { x: 10, y: 20, z: 30 }
const point: Point = obj // ✅

// ❌ 直接使用对象字面量（触发额外属性检查）
// const point2: Point = { x: 10, y: 20, z: 30 }  // ❌ Error: z 不存在

// ✅ 使用类型断言
const point3: Point = { x: 10, y: 20, z: 30 } as Point // ✅
```

## 5. 🤔 私有和保护成员的影响

### 5.1. 私有成员破坏兼容性

```ts
// ❌ 私有成员不兼容
class Animal {
  private name: string

  constructor(name: string) {
    this.name = name
  }
}

class Dog {
  private name: string

  constructor(name: string) {
    this.name = name
  }
}

// 虽然结构相同，但 private 成员来自不同的类
// const animal: Animal = new Dog('Buddy')  // ❌ Error
```

### 5.2. 继承类的私有成员兼容

```ts
// ✅ 继承类的私有成员兼容
class Animal {
  private name: string

  constructor(name: string) {
    this.name = name
  }
}

class Dog extends Animal {
  constructor(name: string) {
    super(name)
  }

  bark() {
    console.log('Woof!')
  }
}

// Dog 继承自 Animal，private 成员来自同一声明
const animal: Animal = new Dog('Buddy') // ✅
```

### 5.3. 保护成员的规则

```ts
// ✅ protected 成员的兼容性
class Base {
  protected value: number = 0
}

class Derived1 extends Base {
  getValue() {
    return this.value
  }
}

class Derived2 extends Base {
  setValue(v: number) {
    this.value = v
  }
}

// 都继承自 Base，protected 成员兼容
const d1: Derived1 = new Derived2() // ✅
const d2: Derived2 = new Derived1() // ✅
```

### 5.4. 公共成员和私有成员混合

```ts
// ✅ 只比较公共成员
class Person {
  public name: string
  private age: number

  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
}

class Employee {
  public name: string
  private salary: number

  constructor(name: string, salary: number) {
    this.name = name
    this.salary = salary
  }
}

// 公共成员 (name) 兼容，私有成员不比较
// const person: Person = new Employee('Alice', 50000)  // ❌ Error
// 因为 private 成员来自不同的类

// 但对象字面量可以
const person2: Person = { name: 'Bob' } as any // ✅
```

## 6. 🤔 类与接口的兼容性

### 6.1. 类实现接口

```ts
// ✅ 类可以实现接口
interface Flyable {
  fly(): void
}

class Bird implements Flyable {
  fly() {
    console.log('Flying')
  }
}

class Airplane implements Flyable {
  fly() {
    console.log('Flying with engines')
  }
}

// 都实现了 Flyable
const flyable: Flyable = new Bird() // ✅
const flyable2: Flyable = new Airplane() // ✅
```

### 6.2. 类自动兼容接口

```ts
// ✅ 类自动兼容结构相同的接口（无需 implements）
interface Point {
  x: number
  y: number
}

class Point2D {
  constructor(public x: number, public y: number) {}
}

// Point2D 自动兼容 Point 接口
const point: Point = new Point2D(10, 20) // ✅

// 函数参数也兼容
function printPoint(point: Point) {
  console.log(`(${point.x}, ${point.y})`)
}

printPoint(new Point2D(5, 10)) // ✅
```

### 6.3. 接口继承类

```ts
// ✅ 接口可以继承类
class Control {
  private state: any

  protected getState() {
    return this.state
  }
}

// 接口继承类，包括私有成员
interface SelectableControl extends Control {
  select(): void
}

// 只有 Control 的子类可以实现这个接口
class Button extends Control implements SelectableControl {
  select() {
    console.log('Button selected')
  }
}

// ❌ 其他类不能实现（因为缺少 private state）
// class ImageControl implements SelectableControl {
//   select() {}
// }  // ❌ Error
```

### 6.4. 类和接口的互换

```ts
// ✅ 类和接口可以互换使用
interface IUser {
  name: string
  greet(): string
}

class User {
  constructor(public name: string) {}

  greet(): string {
    return `Hello, ${this.name}`
  }
}

// 类兼容接口
const user1: IUser = new User('Alice') // ✅

// 对象字面量兼容类
const user2: User = {
  name: 'Bob',
  greet() {
    return `Hello, ${this.name}`
  },
} // ✅
```

## 7. 🤔 类的继承和结构类型

### 7.1. 子类兼容父类

```ts
// ✅ 子类总是兼容父类（协变）
class Animal {
  constructor(public name: string) {}

  move() {
    console.log(`${this.name} is moving`)
  }
}

class Dog extends Animal {
  bark() {
    console.log('Woof!')
  }
}

// 子类可以赋值给父类
const animal: Animal = new Dog('Buddy') // ✅
animal.move()

// 不能调用子类特有的方法
// animal.bark()  // ❌ Error
```

### 7.2. 结构兼容但不继承

```ts
// ✅ 结构兼容，无需继承关系
class Shape {
  area(): number {
    return 0
  }
}

class Circle {
  constructor(public radius: number) {}

  area(): number {
    return Math.PI * this.radius ** 2
  }
}

// Circle 没有继承 Shape，但结构兼容
const shape: Shape = new Circle(10) // ✅
console.log(shape.area())
```

### 7.3. 多个类的共同结构

```ts
// ✅ 多个类可以共享接口
interface Drawable {
  draw(): void
}

class Rectangle {
  draw() {
    console.log('Drawing rectangle')
  }
}

class Circle {
  draw() {
    console.log('Drawing circle')
  }
}

// 都兼容 Drawable
const shapes: Drawable[] = [new Rectangle(), new Circle()]

shapes.forEach((shape) => shape.draw())
```

## 8. 🤔 常见使用场景

### 8.1. 场景 1：Mock 对象测试

```ts
// ✅ 使用结构类型创建 Mock
interface UserService {
  getUser(id: number): Promise<User>
  saveUser(user: User): Promise<void>
}

class User {
  constructor(public id: number, public name: string) {}
}

// 真实实现
class RealUserService implements UserService {
  async getUser(id: number): Promise<User> {
    // 数据库查询
    return new User(id, 'Alice')
  }

  async saveUser(user: User): Promise<void> {
    // 保存到数据库
  }
}

// Mock 实现（测试用）
class MockUserService implements UserService {
  async getUser(id: number): Promise<User> {
    return new User(id, 'Mock User')
  }

  async saveUser(user: User): Promise<void> {
    console.log('Mock save')
  }
}

// 函数接受接口类型
function processUser(service: UserService, userId: number) {
  return service.getUser(userId)
}

// 可以传入任何兼容的实现
processUser(new RealUserService(), 1)
processUser(new MockUserService(), 1)
```

### 8.2. 场景 2：适配器模式

```ts
// ✅ 使用结构兼容性实现适配器
interface MediaPlayer {
  play(filename: string): void
}

// 旧的 API
class LegacyAudioPlayer {
  playAudio(filename: string) {
    console.log(`Playing audio: ${filename}`)
  }
}

// 适配器（结构兼容 MediaPlayer）
class AudioPlayerAdapter {
  constructor(private player: LegacyAudioPlayer) {}

  play(filename: string) {
    this.player.playAudio(filename)
  }
}

function playMedia(player: MediaPlayer, file: string) {
  player.play(file)
}

const adapter = new AudioPlayerAdapter(new LegacyAudioPlayer())
playMedia(adapter, 'song.mp3') // ✅
```

### 8.3. 场景 3：策略模式

```ts
// ✅ 结构类型实现策略模式
interface SortStrategy {
  sort(data: number[]): number[]
}

class BubbleSort {
  sort(data: number[]): number[] {
    // 冒泡排序实现
    return [...data].sort((a, b) => a - b)
  }
}

class QuickSort {
  sort(data: number[]): number[] {
    // 快速排序实现
    return [...data].sort((a, b) => a - b)
  }
}

class Sorter {
  constructor(private strategy: SortStrategy) {}

  setStrategy(strategy: SortStrategy) {
    this.strategy = strategy
  }

  sort(data: number[]): number[] {
    return this.strategy.sort(data)
  }
}

const sorter = new Sorter(new BubbleSort())
console.log(sorter.sort([3, 1, 4, 1, 5]))

sorter.setStrategy(new QuickSort())
console.log(sorter.sort([3, 1, 4, 1, 5]))
```

### 8.4. 场景 4：依赖注入

```ts
// ✅ 基于接口的依赖注入
interface Logger {
  log(message: string): void
}

interface Database {
  query(sql: string): Promise<any>
}

class ConsoleLogger {
  log(message: string) {
    console.log(`[LOG] ${message}`)
  }
}

class FileLogger {
  log(message: string) {
    // 写入文件
    console.log(`[FILE] ${message}`)
  }
}

class UserService {
  constructor(private logger: Logger, private db: Database) {}

  async getUser(id: number) {
    this.logger.log(`Getting user ${id}`)
    return this.db.query(`SELECT * FROM users WHERE id = ${id}`)
  }
}

// 可以注入任何兼容的实现
const service1 = new UserService(new ConsoleLogger(), {} as Database)
const service2 = new UserService(new FileLogger(), {} as Database)
```

### 8.5. 场景 5：插件系统

```ts
// ✅ 基于结构类型的插件
interface Plugin {
  name: string
  version: string
  init(): void
  destroy(): void
}

class AuthPlugin {
  name = 'auth'
  version = '1.0.0'

  init() {
    console.log('Auth plugin initialized')
  }

  destroy() {
    console.log('Auth plugin destroyed')
  }
}

class LoggingPlugin {
  name = 'logging'
  version = '2.0.0'

  init() {
    console.log('Logging plugin initialized')
  }

  destroy() {
    console.log('Logging plugin destroyed')
  }
}

class PluginManager {
  private plugins: Plugin[] = []

  register(plugin: Plugin) {
    this.plugins.push(plugin)
    plugin.init()
  }

  unregister(name: string) {
    const index = this.plugins.findIndex((p) => p.name === name)
    if (index > -1) {
      this.plugins[index].destroy()
      this.plugins.splice(index, 1)
    }
  }
}

const manager = new PluginManager()
manager.register(new AuthPlugin())
manager.register(new LoggingPlugin())
```

## 9. 🤔 常见错误和最佳实践

### 9.1. 错误 1：期望名义类型行为

```ts
// ❌ 错误期望：不同类不兼容
class Dog {
  bark() {
    console.log('Woof!')
  }
}

class Cat {
  bark() {
    console.log('Meow!')
  } // 方法名相同
}

// TypeScript 认为它们兼容（结构相同）
const dog: Dog = new Cat() // ✅ 但不符合语义

// ✅ 使用不同的方法名避免混淆
class Dog {
  bark() {
    console.log('Woof!')
  }
}

class Cat {
  meow() {
    console.log('Meow!')
  }
}

// 现在不兼容
// const dog: Dog = new Cat()  // ❌ Error
```

### 9.2. 错误 2：忽略私有成员的影响

```ts
// ❌ 私有成员导致不兼容
class Counter1 {
  private count = 0
  increment() {
    this.count++
  }
}

class Counter2 {
  private count = 0
  increment() {
    this.count++
  }
}

// const c: Counter1 = new Counter2()  // ❌ Error

// ✅ 使用公共成员或继承
class BaseCounter {
  private count = 0
  increment() {
    this.count++
  }
}

class Counter1 extends BaseCounter {}
class Counter2 extends BaseCounter {}

const c: Counter1 = new Counter2() // ✅
```

### 9.3. 错误 3：过度依赖结构兼容性

```ts
// ❌ 不好：过度依赖结构兼容
class Point {
  constructor(public x: number, public y: number) {}
}

class Person {
  constructor(public x: number, public y: number) {} // 意外兼容
}

const point: Point = new Person(1, 2) // ✅ 但语义错误

// ✅ 好：使用更具体的类型
class Point {
  readonly type = 'point'
  constructor(public x: number, public y: number) {}
}

class Person {
  readonly type = 'person'
  constructor(public x: number, public y: number) {}
}

// 现在不兼容
// const point: Point = new Person(1, 2)  // ❌ Error
```

### 9.4. 错误 4：忘记方法签名兼容性

```ts
// ❌ 方法签名不兼容
interface Handler {
  handle(data: string): void
}

class StringHandler {
  handle(data: string | number) {
    // 参数类型更宽
    console.log(data)
  }
}

// const handler: Handler = new StringHandler()  // ❌ Error
// 因为 Handler.handle 只接受 string

// ✅ 确保方法签名兼容
class StringHandler {
  handle(data: string) {
    console.log(data)
  }
}

const handler: Handler = new StringHandler() // ✅
```

### 9.5. 最佳实践

```ts
// ✅ 1. 使用接口定义契约
interface Drawable {
  draw(): void
}

class Circle implements Drawable {
  draw() {
    console.log('Circle')
  }
}

class Rectangle implements Drawable {
  draw() {
    console.log('Rectangle')
  }
}

// ✅ 2. 使用类型守卫区分类
class Dog {
  bark() {}
}

class Cat {
  meow() {}
}

function isDog(animal: Dog | Cat): animal is Dog {
  return 'bark' in animal
}

// ✅ 3. 添加类型标识避免意外兼容
class Point {
  readonly __type = 'Point'
  constructor(public x: number, public y: number) {}
}

class Vector {
  readonly __type = 'Vector'
  constructor(public x: number, public y: number) {}
}

// 现在不兼容
// const point: Point = new Vector(1, 2)  // ❌

// ✅ 4. 使用私有成员保护类型
class UserId {
  private readonly __brand!: 'UserId'
  constructor(public value: number) {}
}

class ProductId {
  private readonly __brand!: 'ProductId'
  constructor(public value: number) {}
}

// 不兼容
// const userId: UserId = new ProductId(1)  // ❌

// ✅ 5. 明确实现接口
class Service implements IService {
  // 明确声明实现，编译器会检查
}

// ✅ 6. 使用抽象类定义基类
abstract class Shape {
  abstract area(): number

  describe() {
    return `Area: ${this.area()}`
  }
}

// ✅ 7. 利用结构类型简化测试
interface DataService {
  getData(): Promise<any>
}

// 测试时使用简单对象
const mockService: DataService = {
  getData: async () => ({ data: 'mock' }),
}

// ✅ 8. 组合优于继承
interface Flyable {
  fly(): void
}

interface Swimmable {
  swim(): void
}

class Duck implements Flyable, Swimmable {
  fly() {}
  swim() {}
}

// ✅ 9. 使用泛型约束
function clone<T extends { clone(): T }>(obj: T): T {
  return obj.clone()
}

// ✅ 10. 文档化类型意图
/**
 * 表示 2D 平面上的点
 * @remarks 不要与 Vector 混用
 */
class Point {
  constructor(public x: number, public y: number) {}
}
```

## 10. 🔗 引用

- [TypeScript Handbook - Type Compatibility][1]
- [TypeScript Handbook - Classes][2]
- [TypeScript Deep Dive - Structural Type System][3]

[1]: https://www.typescriptlang.org/docs/handbook/type-compatibility.html
[2]: https://www.typescriptlang.org/docs/handbook/2/classes.html
[3]: https://basarat.gitbook.io/typescript/type-system/type-compatibility
