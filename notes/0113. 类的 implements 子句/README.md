# [0113. 类的 implements 子句](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0113.%20%E7%B1%BB%E7%9A%84%20implements%20%E5%AD%90%E5%8F%A5)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是 implements 子句？](#3--什么是-implements-子句)
- [4. 🤔 基本用法](#4--基本用法)
  - [4.1. 实现接口属性](#41-实现接口属性)
  - [4.2. 实现接口方法](#42-实现接口方法)
  - [4.3. 可选成员的实现](#43-可选成员的实现)
  - [4.4. 只读属性的实现](#44-只读属性的实现)
- [5. 🤔 实现多个接口](#5--实现多个接口)
  - [5.1. 合并多个接口](#51-合并多个接口)
  - [5.2. 接口冲突处理](#52-接口冲突处理)
- [6. 🤔 接口继承与类实现](#6--接口继承与类实现)
  - [6.1. 接口继承接口](#61-接口继承接口)
  - [6.2. 类实现继承的接口](#62-类实现继承的接口)
  - [6.3. 接口继承类](#63-接口继承类)
- [7. 🤔 implements 的类型检查](#7--implements-的类型检查)
  - [7.1. 检查所有成员](#71-检查所有成员)
  - [7.2. 参数兼容性](#72-参数兼容性)
  - [7.3. 返回值兼容性](#73-返回值兼容性)
  - [7.4. 访问修饰符](#74-访问修饰符)
- [8. 🤔 implements vs extends](#8--implements-vs-extends)
  - [8.1. 功能对比](#81-功能对比)
  - [8.2. 同时使用 extends 和 implements](#82-同时使用-extends-和-implements)
  - [8.3. 选择使用场景](#83-选择使用场景)
- [9. 🤔 常见使用场景](#9--常见使用场景)
  - [9.1. 场景 1：定义服务接口](#91-场景-1定义服务接口)
  - [9.2. 场景 2：策略模式](#92-场景-2策略模式)
  - [9.3. 场景 3：观察者模式](#93-场景-3观察者模式)
  - [9.4. 场景 4：适配器模式](#94-场景-4适配器模式)
  - [9.5. 场景 5：命令模式](#95-场景-5命令模式)
  - [9.6. 场景 6：依赖注入](#96-场景-6依赖注入)
- [10. 🤔 常见错误和最佳实践](#10--常见错误和最佳实践)
  - [10.1. 错误 1：忘记实现所有成员](#101-错误-1忘记实现所有成员)
  - [10.2. 错误 2：方法签名不匹配](#102-错误-2方法签名不匹配)
  - [10.3. 错误 3：混淆 implements 和 extends](#103-错误-3混淆-implements-和-extends)
  - [10.4. 错误 4：接口成员访问级别错误](#104-错误-4接口成员访问级别错误)
  - [10.5. 最佳实践](#105-最佳实践)
- [11. 🔗 引用](#11--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- implements 子句的语法和作用
- 实现单个和多个接口
- 接口继承与类实现的关系
- implements 的类型检查机制
- implements 与 extends 的区别
- 实际应用场景

## 2. 🫧 评价

`implements` 子句用于声明类**实现某个接口的契约**，确保类包含接口定义的所有成员。

implements 的特点：

- **契约检查**：编译时验证类是否满足接口
- **不提供实现**：只检查，不继承任何实现
- **多重实现**：一个类可以实现多个接口
- **类型约束**：确保类遵循接口规范

implements vs extends：

| 特性         | implements   | extends  |
| ------------ | ------------ | -------- |
| **作用**     | 实现接口契约 | 继承父类 |
| **数量**     | 可以多个     | 只能一个 |
| **继承实现** | 否           | 是       |
| **类型检查** | 是           | 是       |
| **用途**     | 定义能力     | 代码复用 |

implements 的优势：

1. **契约设计**：明确类的公共接口
2. **解耦**：依赖接口而非具体类
3. **多态**：不同类实现相同接口
4. **类型安全**：编译时检查完整性

理解 implements，能帮助你：

1. 设计清晰的类接口
2. 实现面向接口编程
3. 提高代码的可测试性
4. 构建灵活的系统架构

implements 是面向接口编程的核心工具，体现了"依赖抽象而非具体"的设计原则。

## 3. 🤔 什么是 implements 子句？

`implements` 声明类**必须实现接口定义的所有成员**。

```ts
// ✅ 基本 implements
interface Printable {
  print(): void
}

class Document implements Printable {
  print() {
    console.log('Printing document...')
  }
}

// ✅ 类必须实现接口的所有成员
class Report implements Printable {
  // ❌ 如果缺少 print 方法会报错
  // Class 'Report' incorrectly implements interface 'Printable'
  print() {
    console.log('Printing report...')
  }
}
```

**关键概念**：

- **契约声明**：声明类遵循某个接口
- **编译时检查**：TypeScript 验证实现完整性
- **不继承实现**：只检查类型，不提供代码
- **公共接口**：定义类对外暴露的 API

## 4. 🤔 基本用法

### 4.1. 实现接口属性

```ts
// ✅ 实现接口的属性
interface Person {
  name: string
  age: number
}

class Student implements Person {
  name: string
  age: number
  grade: number

  constructor(name: string, age: number, grade: number) {
    this.name = name
    this.age = age
    this.grade = grade
  }
}

const student = new Student('Alice', 20, 3)
```

### 4.2. 实现接口方法

```ts
// ✅ 实现接口的方法
interface Comparable<T> {
  compareTo(other: T): number
}

class Version implements Comparable<Version> {
  constructor(
    public major: number,
    public minor: number,
    public patch: number
  ) {}

  compareTo(other: Version): number {
    if (this.major !== other.major) {
      return this.major - other.major
    }
    if (this.minor !== other.minor) {
      return this.minor - other.minor
    }
    return this.patch - other.patch
  }
}

const v1 = new Version(1, 2, 3)
const v2 = new Version(1, 2, 4)
console.log(v1.compareTo(v2)) // -1
```

### 4.3. 可选成员的实现

```ts
// ✅ 接口的可选成员
interface Config {
  host: string
  port: number
  timeout?: number // 可选
}

class ServerConfig implements Config {
  host: string
  port: number
  // timeout 可以不实现

  constructor(host: string, port: number) {
    this.host = host
    this.port = port
  }
}

// ✅ 也可以实现可选成员
class FullConfig implements Config {
  host: string
  port: number
  timeout: number

  constructor(host: string, port: number, timeout: number) {
    this.host = host
    this.port = port
    this.timeout = timeout
  }
}
```

### 4.4. 只读属性的实现

```ts
// ✅ 实现只读属性
interface Identifiable {
  readonly id: number
}

class User implements Identifiable {
  readonly id: number
  name: string

  constructor(id: number, name: string) {
    this.id = id
    this.name = name
  }
}

const user = new User(1, 'Alice')
// user.id = 2  // ❌ Error: readonly
```

## 5. 🤔 实现多个接口

类可以实现**多个接口**，用逗号分隔。

```ts
// ✅ 实现多个接口
interface Drawable {
  draw(): void
}

interface Movable {
  move(x: number, y: number): void
}

interface Resizable {
  resize(width: number, height: number): void
}

class Shape implements Drawable, Movable, Resizable {
  constructor(
    private x: number,
    private y: number,
    private width: number,
    private height: number
  ) {}

  draw() {
    console.log('Drawing shape')
  }

  move(x: number, y: number) {
    this.x = x
    this.y = y
  }

  resize(width: number, height: number) {
    this.width = width
    this.height = height
  }
}

const shape = new Shape(0, 0, 100, 100)
shape.draw()
shape.move(10, 20)
shape.resize(200, 200)
```

### 5.1. 合并多个接口

```ts
// ✅ 接口可以合并
interface Named {
  name: string
}

interface Aged {
  age: number
}

interface Contactable {
  email: string
  phone: string
}

// 实现所有接口
class Person implements Named, Aged, Contactable {
  constructor(
    public name: string,
    public age: number,
    public email: string,
    public phone: string
  ) {}
}

// ✅ 或使用接口继承合并
interface FullPerson extends Named, Aged, Contactable {}

class Employee implements FullPerson {
  constructor(
    public name: string,
    public age: number,
    public email: string,
    public phone: string
  ) {}
}
```

### 5.2. 接口冲突处理

```ts
// ⚠️ 多个接口有同名成员
interface A {
  value: string
}

interface B {
  value: number // 类型不同
}

// ❌ 无法同时实现（类型冲突）
// class C implements A, B {
//   value: string | number  // 不满足任何一个接口
// }

// ✅ 确保接口兼容
interface A {
  value: string
}

interface B {
  value: string // 类型相同
}

class C implements A, B {
  value: string = 'test' // ✅
}
```

## 6. 🤔 接口继承与类实现

### 6.1. 接口继承接口

```ts
// ✅ 接口继承接口
interface Animal {
  name: string
  eat(): void
}

interface Mammal extends Animal {
  warmBlooded: boolean
}

interface Pet extends Mammal {
  owner: string
  play(): void
}

// 实现继承链的最终接口
class Dog implements Pet {
  constructor(
    public name: string,
    public warmBlooded: boolean,
    public owner: string
  ) {}

  eat() {
    console.log(`${this.name} is eating`)
  }

  play() {
    console.log(`${this.name} is playing`)
  }
}
```

### 6.2. 类实现继承的接口

```ts
// ✅ 类实现继承的接口
interface Shape {
  area(): number
}

interface ColoredShape extends Shape {
  color: string
}

class Circle implements ColoredShape {
  constructor(public radius: number, public color: string) {}

  area(): number {
    return Math.PI * this.radius ** 2
  }
}
```

### 6.3. 接口继承类

```ts
// ✅ 接口可以继承类
class Point {
  x: number = 0
  y: number = 0
}

interface Point3D extends Point {
  z: number
}

class Vector implements Point3D {
  x: number = 0
  y: number = 0
  z: number = 0
}

// ✅ 继承 Point 的类自动实现 Point3D 的部分
class ColoredPoint extends Point implements Point3D {
  z: number = 0
  color: string = 'black'
}
```

## 7. 🤔 implements 的类型检查

### 7.1. 检查所有成员

```ts
// ✅ 必须实现所有必需成员
interface Repository<T> {
  findAll(): Promise<T[]>
  findById(id: number): Promise<T | null>
  save(item: T): Promise<T>
  delete(id: number): Promise<boolean>
}

class UserRepository implements Repository<User> {
  async findAll(): Promise<User[]> {
    return []
  }

  async findById(id: number): Promise<User | null> {
    return null
  }

  async save(item: User): Promise<User> {
    return item
  }

  async delete(id: number): Promise<boolean> {
    return true
  }

  // ✅ 可以有额外的方法
  async findByEmail(email: string): Promise<User | null> {
    return null
  }
}

interface User {
  id: number
  name: string
}
```

### 7.2. 参数兼容性

```ts
// ✅ 方法参数必须兼容
interface Handler {
  handle(data: string): void
}

// ✅ 参数类型可以更宽松（逆变）
class LogHandler implements Handler {
  handle(data: string | number) {
    // ✅ 接受更多类型
    console.log(data)
  }
}

// ❌ 参数类型不能更严格
// class StrictHandler implements Handler {
//   handle(data: 'a' | 'b') {  // ❌ Error: 更严格
//     console.log(data)
//   }
// }
```

### 7.3. 返回值兼容性

```ts
// ✅ 返回值类型必须兼容
interface Factory {
  create(): Animal
}

interface Animal {
  name: string
}

interface Dog extends Animal {
  bark(): void
}

// ✅ 返回值可以更具体（协变）
class DogFactory implements Factory {
  create(): Dog {
    // ✅ Dog 是 Animal 的子类型
    return { name: 'Buddy', bark: () => console.log('Woof!') }
  }
}

// ❌ 返回值不能更宽泛
// class BadFactory implements Factory {
//   create(): object {  // ❌ Error: object 比 Animal 更宽
//     return {}
//   }
// }
```

### 7.4. 访问修饰符

```ts
// ✅ 实现的成员必须是公共的
interface Service {
  process(): void
}

class MyService implements Service {
  // ✅ public（默认）
  process() {
    console.log('Processing')
  }

  // ❌ 不能是 private 或 protected
  // private process() {}  // ❌ Error
}

// ✅ 可以有私有辅助方法
class ComplexService implements Service {
  process() {
    this.doProcess()
  }

  private doProcess() {
    console.log('Internal processing')
  }
}
```

## 8. 🤔 implements vs extends

### 8.1. 功能对比

```ts
// ✅ extends - 继承实现
class Animal {
  name: string

  constructor(name: string) {
    this.name = name
  }

  move() {
    console.log(`${this.name} is moving`)
  }
}

class Dog extends Animal {
  // 继承了 name 和 move
  bark() {
    console.log('Woof!')
  }
}

// ✅ implements - 只检查类型
interface IAnimal {
  name: string
  move(): void
}

class Cat implements IAnimal {
  name: string

  constructor(name: string) {
    this.name = name
  }

  // 必须自己实现
  move() {
    console.log(`${this.name} is moving`)
  }

  meow() {
    console.log('Meow!')
  }
}
```

### 8.2. 同时使用 extends 和 implements

```ts
// ✅ 可以同时使用
interface Flyable {
  fly(): void
}

class Animal {
  constructor(public name: string) {}

  move() {
    console.log(`${this.name} is moving`)
  }
}

class Bird extends Animal implements Flyable {
  // 继承 Animal 的实现
  // 实现 Flyable 的契约

  fly() {
    console.log(`${this.name} is flying`)
  }
}

const bird = new Bird('Tweety')
bird.move() // 继承自 Animal
bird.fly() // 实现 Flyable
```

### 8.3. 选择使用场景

```ts
// ✅ 使用 extends：代码复用，is-a 关系
class Employee extends Person {
  // Employee 是一种 Person
  // 复用 Person 的实现
}

// ✅ 使用 implements：定义能力，can-do 关系
class Duck implements Flyable, Swimmable {
  // Duck 可以飞、可以游泳
  // 描述能力而非继承关系
}

// ✅ 组合使用：继承基类 + 实现接口
class Manager extends Employee implements Leader {
  // Manager 是一种 Employee（继承）
  // Manager 有领导能力（实现）
}
```

## 9. 🤔 常见使用场景

### 9.1. 场景 1：定义服务接口

```ts
// ✅ 服务层接口
interface UserService {
  getUser(id: number): Promise<User>
  createUser(data: CreateUserDto): Promise<User>
  updateUser(id: number, data: UpdateUserDto): Promise<User>
  deleteUser(id: number): Promise<boolean>
}

interface User {
  id: number
  name: string
  email: string
}

interface CreateUserDto {
  name: string
  email: string
}

interface UpdateUserDto {
  name?: string
  email?: string
}

// 实现服务
class UserServiceImpl implements UserService {
  async getUser(id: number): Promise<User> {
    // 数据库查询
    return { id, name: 'Alice', email: 'alice@example.com' }
  }

  async createUser(data: CreateUserDto): Promise<User> {
    // 创建用户
    return { id: 1, ...data }
  }

  async updateUser(id: number, data: UpdateUserDto): Promise<User> {
    // 更新用户
    return { id, name: 'Updated', email: 'updated@example.com' }
  }

  async deleteUser(id: number): Promise<boolean> {
    // 删除用户
    return true
  }
}

// Mock 实现（测试用）
class MockUserService implements UserService {
  async getUser(id: number): Promise<User> {
    return { id, name: 'Mock User', email: 'mock@example.com' }
  }

  async createUser(data: CreateUserDto): Promise<User> {
    return { id: 999, ...data }
  }

  async updateUser(id: number, data: UpdateUserDto): Promise<User> {
    return { id, name: 'Mock', email: 'mock@example.com' }
  }

  async deleteUser(id: number): Promise<boolean> {
    return true
  }
}
```

### 9.2. 场景 2：策略模式

```ts
// ✅ 策略接口
interface PaymentStrategy {
  pay(amount: number): Promise<boolean>
  refund(amount: number): Promise<boolean>
}

class CreditCardPayment implements PaymentStrategy {
  constructor(private cardNumber: string) {}

  async pay(amount: number): Promise<boolean> {
    console.log(`Paid ${amount} with credit card ${this.cardNumber}`)
    return true
  }

  async refund(amount: number): Promise<boolean> {
    console.log(`Refunded ${amount} to credit card ${this.cardNumber}`)
    return true
  }
}

class PayPalPayment implements PaymentStrategy {
  constructor(private email: string) {}

  async pay(amount: number): Promise<boolean> {
    console.log(`Paid ${amount} via PayPal (${this.email})`)
    return true
  }

  async refund(amount: number): Promise<boolean> {
    console.log(`Refunded ${amount} to PayPal (${this.email})`)
    return true
  }
}

class PaymentProcessor {
  constructor(private strategy: PaymentStrategy) {}

  setStrategy(strategy: PaymentStrategy) {
    this.strategy = strategy
  }

  async processPayment(amount: number) {
    return this.strategy.pay(amount)
  }
}

const processor = new PaymentProcessor(
  new CreditCardPayment('1234-5678-9012-3456')
)
await processor.processPayment(100)

processor.setStrategy(new PayPalPayment('user@example.com'))
await processor.processPayment(50)
```

### 9.3. 场景 3：观察者模式

```ts
// ✅ 观察者接口
interface Observer {
  update(data: any): void
}

interface Subject {
  attach(observer: Observer): void
  detach(observer: Observer): void
  notify(): void
}

class ConcreteSubject implements Subject {
  private observers: Observer[] = []
  private state: any

  attach(observer: Observer): void {
    this.observers.push(observer)
  }

  detach(observer: Observer): void {
    const index = this.observers.indexOf(observer)
    if (index > -1) {
      this.observers.splice(index, 1)
    }
  }

  notify(): void {
    this.observers.forEach((observer) => {
      observer.update(this.state)
    })
  }

  setState(state: any) {
    this.state = state
    this.notify()
  }
}

class ConcreteObserver implements Observer {
  constructor(private name: string) {}

  update(data: any): void {
    console.log(`${this.name} received update:`, data)
  }
}

const subject = new ConcreteSubject()
const observer1 = new ConcreteObserver('Observer 1')
const observer2 = new ConcreteObserver('Observer 2')

subject.attach(observer1)
subject.attach(observer2)

subject.setState({ message: 'Hello' })
```

### 9.4. 场景 4：适配器模式

```ts
// ✅ 目标接口
interface MediaPlayer {
  play(filename: string): void
  pause(): void
  stop(): void
}

// 旧的 API
class LegacyAudioPlayer {
  playAudioFile(filename: string) {
    console.log(`Playing audio: ${filename}`)
  }

  pauseAudio() {
    console.log('Audio paused')
  }

  stopAudio() {
    console.log('Audio stopped')
  }
}

// 适配器
class AudioPlayerAdapter implements MediaPlayer {
  constructor(private player: LegacyAudioPlayer) {}

  play(filename: string): void {
    this.player.playAudioFile(filename)
  }

  pause(): void {
    this.player.pauseAudio()
  }

  stop(): void {
    this.player.stopAudio()
  }
}

function playMedia(player: MediaPlayer, file: string) {
  player.play(file)
  player.pause()
  player.stop()
}

const adapter = new AudioPlayerAdapter(new LegacyAudioPlayer())
playMedia(adapter, 'song.mp3')
```

### 9.5. 场景 5：命令模式

```ts
// ✅ 命令接口
interface Command {
  execute(): void
  undo(): void
}

class Light {
  turnOn() {
    console.log('Light is ON')
  }

  turnOff() {
    console.log('Light is OFF')
  }
}

class LightOnCommand implements Command {
  constructor(private light: Light) {}

  execute(): void {
    this.light.turnOn()
  }

  undo(): void {
    this.light.turnOff()
  }
}

class LightOffCommand implements Command {
  constructor(private light: Light) {}

  execute(): void {
    this.light.turnOff()
  }

  undo(): void {
    this.light.turnOn()
  }
}

class RemoteControl {
  private history: Command[] = []

  submit(command: Command) {
    command.execute()
    this.history.push(command)
  }

  undo() {
    const command = this.history.pop()
    if (command) {
      command.undo()
    }
  }
}

const light = new Light()
const remote = new RemoteControl()

remote.submit(new LightOnCommand(light))
remote.submit(new LightOffCommand(light))
remote.undo() // 撤销最后一个命令
```

### 9.6. 场景 6：依赖注入

```ts
// ✅ 定义依赖接口
interface Logger {
  log(message: string): void
  error(message: string): void
}

interface Database {
  query(sql: string): Promise<any>
  execute(sql: string): Promise<void>
}

interface Cache {
  get(key: string): Promise<any>
  set(key: string, value: any): Promise<void>
}

// 实现
class ConsoleLogger implements Logger {
  log(message: string) {
    console.log(`[LOG] ${message}`)
  }

  error(message: string) {
    console.error(`[ERROR] ${message}`)
  }
}

class MySQLDatabase implements Database {
  async query(sql: string): Promise<any> {
    console.log(`Querying: ${sql}`)
    return []
  }

  async execute(sql: string): Promise<void> {
    console.log(`Executing: ${sql}`)
  }
}

class RedisCache implements Cache {
  async get(key: string): Promise<any> {
    console.log(`Getting ${key} from cache`)
    return null
  }

  async set(key: string, value: any): Promise<void> {
    console.log(`Setting ${key} in cache`)
  }
}

// 服务使用接口
class UserService {
  constructor(
    private logger: Logger,
    private db: Database,
    private cache: Cache
  ) {}

  async getUser(id: number) {
    this.logger.log(`Getting user ${id}`)

    const cached = await this.cache.get(`user:${id}`)
    if (cached) {
      return cached
    }

    const user = await this.db.query(`SELECT * FROM users WHERE id = ${id}`)
    await this.cache.set(`user:${id}`, user)

    return user
  }
}

// 依赖注入
const userService = new UserService(
  new ConsoleLogger(),
  new MySQLDatabase(),
  new RedisCache()
)
```

## 10. 🤔 常见错误和最佳实践

### 10.1. 错误 1：忘记实现所有成员

```ts
// ❌ 缺少实现
interface Repository {
  findAll(): Promise<any[]>
  findById(id: number): Promise<any>
  save(item: any): Promise<any>
}

class UserRepository implements Repository {
  async findAll(): Promise<any[]> {
    return []
  }
  // ❌ Error: 缺少 findById 和 save
}

// ✅ 实现所有成员
class UserRepository implements Repository {
  async findAll(): Promise<any[]> {
    return []
  }

  async findById(id: number): Promise<any> {
    return null
  }

  async save(item: any): Promise<any> {
    return item
  }
}
```

### 10.2. 错误 2：方法签名不匹配

```ts
// ❌ 方法签名不匹配
interface Calculator {
  add(a: number, b: number): number
}

class MyCalculator implements Calculator {
  add(a: number, b: number): string {
    // ❌ 返回类型错误
    return String(a + b)
  }
}

// ✅ 匹配方法签名
class MyCalculator implements Calculator {
  add(a: number, b: number): number {
    return a + b
  }
}
```

### 10.3. 错误 3：混淆 implements 和 extends

```ts
// ❌ 期望继承实现
interface Animal {
  name: string
  move(): void
}

class Dog implements Animal {
  // ❌ name 不会自动获得值
  name: string

  constructor() {
    // 必须自己初始化
    this.name = ''
  }

  move() {
    console.log('Moving')
  }
}

// ✅ 如果需要复用实现，使用 extends
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
```

### 10.4. 错误 4：接口成员访问级别错误

```ts
// ❌ 试图使用私有成员实现接口
interface Service {
  process(): void
}

class MyService implements Service {
  private process() {
    // ❌ Error: 必须是 public
    console.log('Processing')
  }
}

// ✅ 使用 public 成员
class MyService implements Service {
  process() {
    console.log('Processing')
  }

  // 可以有私有辅助方法
  private doProcess() {
    console.log('Internal')
  }
}
```

### 10.5. 最佳实践

```ts
// ✅ 1. 使用接口定义契约
interface UserRepository {
  findById(id: number): Promise<User | null>
  save(user: User): Promise<User>
}

// ✅ 2. 接口隔离原则 - 小而专注的接口
interface Readable {
  read(): Promise<any>
}

interface Writable {
  write(data: any): Promise<void>
}

// 根据需要实现
class ReadOnlyFile implements Readable {
  async read(): Promise<any> {
    return {}
  }
}

class File implements Readable, Writable {
  async read(): Promise<any> {
    return {}
  }

  async write(data: any): Promise<void> {
    // 写入
  }
}

// ✅ 3. 依赖接口而非具体类
class Service {
  constructor(private repo: UserRepository) {} // 依赖接口
}

// ✅ 4. 使用泛型接口提高复用性
interface Repository<T> {
  findAll(): Promise<T[]>
  findById(id: number): Promise<T | null>
  save(item: T): Promise<T>
  delete(id: number): Promise<boolean>
}

class UserRepository implements Repository<User> {
  // 实现
}

// ✅ 5. 为接口添加文档
/**
 * 用户服务接口
 * 提供用户相关的业务操作
 */
interface UserService {
  /**
   * 获取用户信息
   * @param id - 用户 ID
   * @returns 用户对象或 null
   */
  getUser(id: number): Promise<User | null>
}

// ✅ 6. 组合接口定义复杂类型
interface Named {
  name: string
}

interface Aged {
  age: number
}

interface Person extends Named, Aged {
  email: string
}

// ✅ 7. 使用 readonly 保护数据
interface Config {
  readonly apiUrl: string
  readonly timeout: number
}

class AppConfig implements Config {
  readonly apiUrl: string
  readonly timeout: number

  constructor(apiUrl: string, timeout: number) {
    this.apiUrl = apiUrl
    this.timeout = timeout
  }
}

// ✅ 8. 异步方法使用 Promise
interface AsyncService {
  fetchData(): Promise<any>
  saveData(data: any): Promise<void>
}

// ✅ 9. 测试时使用 Mock 实现
interface EmailService {
  send(to: string, subject: string, body: string): Promise<void>
}

class MockEmailService implements EmailService {
  async send(to: string, subject: string, body: string): Promise<void> {
    console.log(`Mock email sent to ${to}`)
  }
}

// ✅ 10. 保持接口稳定
// 接口是契约，变更会影响所有实现
// 考虑版本化或使用新接口
interface UserServiceV1 {
  getUser(id: number): Promise<User>
}

interface UserServiceV2 extends UserServiceV1 {
  getUserByEmail(email: string): Promise<User>
}
```

## 11. 🔗 引用

- [TypeScript Handbook - Classes][1]
- [TypeScript Handbook - Interfaces][2]
- [TypeScript Deep Dive - Interfaces][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/classes.html
[2]: https://www.typescriptlang.org/docs/handbook/2/objects.html
[3]: https://basarat.gitbook.io/typescript/type-system/interfaces
