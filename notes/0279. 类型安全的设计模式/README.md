# [0279. 类型安全的设计模式](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0279.%20%E7%B1%BB%E5%9E%8B%E5%AE%89%E5%85%A8%E7%9A%84%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 单例模式？](#3-单例模式)
  - [3.1. 基本实现](#31-基本实现)
  - [3.2. 泛型单例](#32-泛型单例)
- [4. 工厂模式？](#4-工厂模式)
  - [4.1. 简单工厂](#41-简单工厂)
  - [4.2. 抽象工厂](#42-抽象工厂)
- [5. 观察者模式？](#5-观察者模式)
  - [5.1. 类型安全的观察者](#51-类型安全的观察者)
  - [5.2. 事件发射器](#52-事件发射器)
- [6. 装饰器模式？](#6-装饰器模式)
  - [6.1. 函数装饰器](#61-函数装饰器)
  - [6.2. 类装饰器](#62-类装饰器)
- [7. 策略模式？](#7-策略模式)
  - [7.1. 类型安全的策略](#71-类型安全的策略)
  - [7.2. 函数式策略](#72-函数式策略)
- [8. 引用](#8-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 单例模式
- 工厂模式
- 观察者模式
- 装饰器模式
- 策略模式

## 2. 评价

TypeScript 的类型系统可以让经典设计模式更加类型安全。

- 泛型提供通用性
- 接口定义契约
- 类型约束确保正确使用
- 避免运行时错误
- 提供更好的 IDE 支持

## 3. 单例模式？

确保类只有一个实例并提供全局访问点。

### 3.1. 基本实现

```ts
// ✅ 类型安全的单例
class Singleton {
  private static instance: Singleton | null = null

  private constructor() {
    // 私有构造函数防止外部实例化
  }

  static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton()
    }
    return Singleton.instance
  }

  public someMethod() {
    console.log('Singleton method')
  }
}

// 使用
const instance1 = Singleton.getInstance()
const instance2 = Singleton.getInstance()
console.log(instance1 === instance2) // true

// ❌ 无法直接实例化
// const instance = new Singleton();  // 构造函数是私有的
```

### 3.2. 泛型单例

```ts
// ✅ 泛型单例基类
abstract class GenericSingleton<T> {
  private static instances: Map<any, any> = new Map()

  protected constructor() {}

  static getInstance<T>(this: new () => T): T {
    if (!GenericSingleton.instances.has(this)) {
      GenericSingleton.instances.set(this, new this())
    }
    return GenericSingleton.instances.get(this)
  }
}

// 使用
class ConfigManager extends GenericSingleton<ConfigManager> {
  private config: Record<string, any> = {}

  setConfig(key: string, value: any) {
    this.config[key] = value
  }

  getConfig(key: string) {
    return this.config[key]
  }
}

class Logger extends GenericSingleton<Logger> {
  log(message: string) {
    console.log(`[LOG] ${message}`)
  }
}

const config1 = ConfigManager.getInstance()
const config2 = ConfigManager.getInstance()
console.log(config1 === config2) // true

const logger1 = Logger.getInstance()
const logger2 = Logger.getInstance()
console.log(logger1 === logger2) // true
```

## 4. 工厂模式？

创建对象而不暴露创建逻辑。

### 4.1. 简单工厂

```ts
// ✅ 类型安全的工厂
interface Product {
  getName(): string
  getPrice(): number
}

class Book implements Product {
  constructor(private name: string, private price: number) {}

  getName() {
    return this.name
  }

  getPrice() {
    return this.price
  }
}

class Electronics implements Product {
  constructor(private name: string, private price: number) {}

  getName() {
    return this.name
  }

  getPrice() {
    return this.price
  }
}

type ProductType = 'book' | 'electronics'

class ProductFactory {
  static createProduct(
    type: ProductType,
    name: string,
    price: number
  ): Product {
    switch (type) {
      case 'book':
        return new Book(name, price)
      case 'electronics':
        return new Electronics(name, price)
    }
  }
}

// 使用
const book = ProductFactory.createProduct('book', 'TypeScript Book', 39.99)
const phone = ProductFactory.createProduct('electronics', 'Phone', 999)
```

### 4.2. 抽象工厂

```ts
// ✅ 抽象工厂模式
interface Button {
  render(): string
}

interface Checkbox {
  render(): string
}

interface UIFactory {
  createButton(): Button
  createCheckbox(): Checkbox
}

// Windows 风格
class WindowsButton implements Button {
  render() {
    return '<button>Windows Button</button>'
  }
}

class WindowsCheckbox implements Checkbox {
  render() {
    return "<input type='checkbox' />Windows"
  }
}

class WindowsFactory implements UIFactory {
  createButton() {
    return new WindowsButton()
  }

  createCheckbox() {
    return new WindowsCheckbox()
  }
}

// Mac 风格
class MacButton implements Button {
  render() {
    return "<button class='mac'>Mac Button</button>"
  }
}

class MacCheckbox implements Checkbox {
  render() {
    return "<input type='checkbox' class='mac' />Mac"
  }
}

class MacFactory implements UIFactory {
  createButton() {
    return new MacButton()
  }

  createCheckbox() {
    return new MacCheckbox()
  }
}

// 使用
function renderUI(factory: UIFactory) {
  const button = factory.createButton()
  const checkbox = factory.createCheckbox()

  console.log(button.render())
  console.log(checkbox.render())
}

renderUI(new WindowsFactory())
renderUI(new MacFactory())
```

## 5. 观察者模式？

定义对象间的一对多依赖，当一个对象改变状态时通知所有依赖者。

### 5.1. 类型安全的观察者

```ts
// ✅ 泛型观察者模式
type Observer<T> = (data: T) => void

class Observable<T> {
  private observers: Set<Observer<T>> = new Set()

  subscribe(observer: Observer<T>): () => void {
    this.observers.add(observer)

    // 返回取消订阅函数
    return () => {
      this.observers.delete(observer)
    }
  }

  notify(data: T) {
    this.observers.forEach((observer) => observer(data))
  }
}

// 使用
interface UserData {
  id: number
  name: string
}

const userObservable = new Observable<UserData>()

const unsubscribe1 = userObservable.subscribe((user) => {
  console.log(`Observer 1: ${user.name}`)
})

const unsubscribe2 = userObservable.subscribe((user) => {
  console.log(`Observer 2: ${user.name}`)
})

userObservable.notify({ id: 1, name: 'Tom' })

// 取消订阅
unsubscribe1()
userObservable.notify({ id: 2, name: 'Jerry' }) // 只有 Observer 2 收到
```

### 5.2. 事件发射器

```ts
// ✅ 类型安全的事件发射器
type EventMap = Record<string, any>

type EventKey<T extends EventMap> = keyof T & string
type EventHandler<T> = (event: T) => void

class EventEmitter<T extends EventMap> {
  private listeners: {
    [K in keyof T]?: Set<EventHandler<T[K]>>
  } = {}

  on<K extends EventKey<T>>(event: K, handler: EventHandler<T[K]>): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = new Set()
    }
    this.listeners[event]!.add(handler)

    // 返回移除监听器函数
    return () => {
      this.listeners[event]?.delete(handler)
    }
  }

  emit<K extends EventKey<T>>(event: K, data: T[K]) {
    this.listeners[event]?.forEach((handler) => handler(data))
  }
}

// 使用
interface Events {
  userLogin: { userId: number; timestamp: Date }
  userLogout: { userId: number }
  dataUpdate: { data: string }
}

const emitter = new EventEmitter<Events>()

emitter.on('userLogin', (event) => {
  console.log(`User ${event.userId} logged in at ${event.timestamp}`)
})

emitter.on('userLogout', (event) => {
  console.log(`User ${event.userId} logged out`)
})

emitter.emit('userLogin', { userId: 1, timestamp: new Date() })
emitter.emit('userLogout', { userId: 1 })

// ❌ 类型错误
// emitter.emit("userLogin", { userId: "1" });  // userId 必须是 number
```

## 6. 装饰器模式？

动态地给对象添加职责。

### 6.1. 函数装饰器

```ts
// ✅ 日志装饰器
function logged<T extends (...args: any[]) => any>(target: T): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    console.log(`Calling function with args:`, args)
    const result = target(...args)
    console.log(`Function returned:`, result)
    return result
  }) as T
}

// 使用
const add = logged((a: number, b: number) => a + b)
add(1, 2)
// Calling function with args: [1, 2]
// Function returned: 3

// ✅ 性能监控装饰器
function timed<T extends (...args: any[]) => any>(target: T): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    const start = performance.now()
    const result = target(...args)
    const end = performance.now()
    console.log(`Execution time: ${end - start}ms`)
    return result
  }) as T
}
```

### 6.2. 类装饰器

```ts
// ✅ 类装饰器
function Serializable<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    toJSON() {
      return JSON.stringify(this)
    }

    static fromJSON(json: string) {
      return Object.assign(new constructor(), JSON.parse(json))
    }
  }
}

@Serializable
class User {
  constructor(public name: string, public age: number) {}
}

const user = new User('Tom', 25)
const json = (user as any).toJSON()
console.log(json) // {"name":"Tom","age":25}
```

## 7. 策略模式？

定义一系列算法，把它们封装起来，并使它们可以互相替换。

### 7.1. 类型安全的策略

```ts
// ✅ 策略接口
interface PaymentStrategy {
  pay(amount: number): void
}

class CreditCardPayment implements PaymentStrategy {
  constructor(private cardNumber: string, private cvv: string) {}

  pay(amount: number) {
    console.log(`Paid ${amount} using credit card ${this.cardNumber}`)
  }
}

class PayPalPayment implements PaymentStrategy {
  constructor(private email: string) {}

  pay(amount: number) {
    console.log(`Paid ${amount} using PayPal ${this.email}`)
  }
}

class CryptoPayment implements PaymentStrategy {
  constructor(private walletAddress: string) {}

  pay(amount: number) {
    console.log(`Paid ${amount} using crypto wallet ${this.walletAddress}`)
  }
}

// 上下文
class PaymentContext {
  constructor(private strategy: PaymentStrategy) {}

  setStrategy(strategy: PaymentStrategy) {
    this.strategy = strategy
  }

  executePayment(amount: number) {
    this.strategy.pay(amount)
  }
}

// 使用
const context = new PaymentContext(
  new CreditCardPayment('1234-5678-9012-3456', '123')
)
context.executePayment(100)

context.setStrategy(new PayPalPayment('user@example.com'))
context.executePayment(200)

context.setStrategy(new CryptoPayment('0x1234...'))
context.executePayment(300)
```

### 7.2. 函数式策略

```ts
// ✅ 使用函数的策略模式
type SortStrategy<T> = (a: T, b: T) => number

class Sorter<T> {
  constructor(private strategy: SortStrategy<T>) {}

  sort(array: T[]): T[] {
    return [...array].sort(this.strategy)
  }
}

// 策略函数
const numberAscending: SortStrategy<number> = (a, b) => a - b
const numberDescending: SortStrategy<number> = (a, b) => b - a

const stringAscending: SortStrategy<string> = (a, b) => a.localeCompare(b)

// 使用
const numberSorter = new Sorter(numberAscending)
console.log(numberSorter.sort([3, 1, 4, 1, 5])) // [1, 1, 3, 4, 5]

const stringSorter = new Sorter(stringAscending)
console.log(stringSorter.sort(['banana', 'apple', 'cherry']))
// ["apple", "banana", "cherry"]
```

## 8. 引用

- [Design Patterns][1]
- [TypeScript Design Patterns][2]
- [Decorators][3]

[1]: https://refactoring.guru/design-patterns
[2]: https://www.patterns.dev/posts/classic-design-patterns/
[3]: https://www.typescriptlang.org/docs/handbook/decorators.html
