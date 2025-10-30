# [0064. 类的继承](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0064.%20%E7%B1%BB%E7%9A%84%E7%BB%A7%E6%89%BF)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 如何实现类的继承？](#3--如何实现类的继承)
- [4. 🤔 子类如何覆盖基类的同名方法？](#4--子类如何覆盖基类的同名方法)
- [5. 🤔 子类构造函数中必须调用 super() 吗？为什么？【回顾 JS】](#5--子类构造函数中必须调用-super-吗为什么回顾-js)
  - [5.1. 必须调用](#51-必须调用)
  - [5.2. 原因](#52-原因)
  - [5.3. 示例](#53-示例)
- [6. 🤖 在派生类的构造函数中必须先调用 `super()` 的具体原因分析](#6--在派生类的构造函数中必须先调用-super-的具体原因分析)
  - [6.1. `this` 在子类中并非自动存在](#61-this-在子类中并非自动存在)
  - [6.2. 父类负责初始化其自身的属性和状态](#62-父类负责初始化其自身的属性和状态)
  - [6.3. JavaScript 引擎的规范强制要求](#63-javascript-引擎的规范强制要求)
  - [6.4. 原型链与 `this` 绑定的时机](#64-原型链与-this-绑定的时机)
  - [6.5. 总结一句话](#65-总结一句话)
- [7. 🤔 super 关键字有哪些使用场景？](#7--super-关键字有哪些使用场景)
- [8. 🤔 类继承与接口实现有什么区别？](#8--类继承与接口实现有什么区别)
- [9. 🤔 TypeScript 中的类继承是结构类型还是名义类型？](#9--typescript-中的类继承是结构类型还是名义类型)
- [10. 🤔 多重继承如何实现？](#10--多重继承如何实现)
- [11. 🤔 继承时如何处理访问修饰符？](#11--继承时如何处理访问修饰符)
- [12. 🤔 静态成员是否会被继承？](#12--静态成员是否会被继承)
- [13. 🔗 引用](#13--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- extends 关键字
- 构造函数继承
- 方法重写
- super 关键字
- 类继承与接口实现的区别
- 名义类型系统

## 2. 🫧 评价

类继承是面向对象编程的核心特性之一，在 TypeScript 中通过 `extends` 关键字实现。与 JavaScript 一致，TypeScript 的类继承是单继承机制，但通过接口和 mixin 模式可以实现类似多重继承的效果。

需要注意的是，TypeScript 的类继承属于名义类型系统（nominal typing），即类型兼容性基于类名而非结构（这与 TypeScript 默认的结构类型系统不同）。

## 3. 🤔 如何实现类的继承？

类（子类）可以使用 `extends` 关键字继承另一个类（基类）的所有属性和方法：

```ts
class Animal {
  name: string
  constructor(name: string) {
    this.name = name
  }
  move(distance: number = 0) {
    console.log(`${this.name} moved ${distance}m.`)
  }
}

class Dog extends Animal {
  bark() {
    console.log('Woof! Woof!')
  }
}

const dog = new Dog('Rex')
dog.bark() // "Woof! Woof!"
dog.move(5) // "Rex moved 5m."
```

## 4. 🤔 子类如何覆盖基类的同名方法？

```ts
class Animal {
  name: string
  constructor(name: string) {
    this.name = name
  }
  move(distance: number = 0) {
    console.log(`${this.name} moved ${distance}m.`)
  }
}

class Dog extends Animal {
  bark() {
    console.log('Woof! Woof!')
  }
  // 方法重写
  move(distance: number = 5) {
    console.log('Running...')
    super.move(distance) // 调用父类方法
  }
}

const dog = new Dog('Rex')
dog.bark() // "Woof! Woof!"
dog.move(5)
// "Running..."
// "Rex moved 5m."
```

## 5. 🤔 子类构造函数中必须调用 super() 吗？为什么？【回顾 JS】

### 5.1. 必须调用

如果子类定义了构造函数，必须在使用 `this` 前调用 `super()`。

### 5.2. 原因

1. 需要先初始化父类部分的实例
2. JavaScript 规范要求：子类构造函数必须先调用 `super()` 才能使用 `this`
3. 编译器会强制检查，否则报错：`'super' must be called before accessing 'this' in the constructor of a derived class`

### 5.3. 示例

::: code-group

```ts [正确示例]
class Animal {
  name: string
  constructor(name: string) {
    this.name = name
  }
  move(distance: number = 0) {
    console.log(`${this.name} moved ${distance}m.`)
  }
}

class Dog extends Animal {
  breed: string
  constructor(name: string, breed: string) {
    super(name) // 必须先调用
    this.breed = breed
  }
}
```

```ts [错误示例]
class Animal {
  name: string
  constructor(name: string) {
    this.name = name
  }
  move(distance: number = 0) {
    console.log(`${this.name} moved ${distance}m.`)
  }
}

class Dog extends Animal {
  breed: string
  constructor(name: string, breed: string) {
    this.breed = breed // ❌ 错误：必须先调用 super()
    // 'super' must be called before accessing 'this' in the constructor of a derived class.(17009)
    super(name)
  }
}
```

:::

## 6. 🤖 在派生类的构造函数中必须先调用 `super()` 的具体原因分析

回答：

这背后涉及 JavaScript 引擎的对象创建机制 和 原型继承模型。具体原因如下：

### 6.1. `this` 在子类中并非自动存在

在 JavaScript（以及 TypeScript 编译后的代码）中，派生类（子类）的构造函数不会自动创建 `this` 对象。

- 在普通类（非继承类）中，`new` 操作会自动创建一个新对象并绑定为 `this`。
- 但在 派生类 中，`this` 的创建被延迟到 `super()` 被调用之后。

> 📌 简单说：`super()` 的作用之一就是“请求父类帮忙创建并初始化 `this`”。

如果不调用 `super()`，`this` 根本不存在，自然不能访问 `this.xxx`。

### 6.2. 父类负责初始化其自身的属性和状态

父类可能在其构造函数中：

- 初始化自己的属性（如 `this.name = name`）
- 绑定方法、设置内部状态、注册事件等

子类实例 包含父类的全部属性和行为（即“父类部分”）。  
如果跳过 `super()`，父类的初始化逻辑就不会执行，导致：

- 父类属性未定义（`undefined`）
- 父类方法可能因依赖未初始化的状态而崩溃

例如：

```ts
class Animal {
  name: string
  createdAt: Date
  constructor(name: string) {
    this.name = name
    this.createdAt = new Date() // 父类初始化关键状态
  }
}

class Dog extends Animal {
  constructor(name: string) {
    // 如果不调 super(name)，this.createdAt 就不存在！
    super(name)
  }
}
```

### 6.3. JavaScript 引擎的规范强制要求

ECMAScript 规范明确规定：

> 在派生类构造函数中，必须在访问 `this` 或返回对象之前调用 `super()`。

这是语言层面的安全机制，防止开发者在对象未完全构建前就使用它。

TypeScript 编译器在编译期就实施这一规则，即使目标为旧版 JS，也会通过静态检查阻止错误。

### 6.4. 原型链与 `this` 绑定的时机

调用 `super()` 实际上做了两件事：

1. 调用父类构造函数，执行其初始化逻辑；
2. 将新创建的对象（由父类构造函数返回或隐式创建）绑定为当前 `this`，并设置其原型为子类的 prototype。

只有完成这一步，`this` 才是一个完整、合法、具有正确原型链的实例。

### 6.5. 总结一句话

`super()` 是子类“借用”父类来创建和初始化 `this` 的唯一方式。没有它，`this` 不存在，父类状态未建立，对象就不完整。

## 7. 🤔 super 关键字有哪些使用场景？

`super` 关键字有两种主要使用场景：

1. 调用父类构造函数：`super(...args)`
   - 必须在子类构造函数中使用 `this` 前调用
   - 传递参数给父类构造函数
2. 调用父类方法：`super.method(...)`
   - 在方法重写时调用父类实现
   - 可以在静态方法中使用 `super` 调用父类静态方法

示例：

```ts
class Animal {
  static create() {
    return new Animal('Unknown')
  }
  constructor(protected name: string) {}
  move() {
    console.log(`${this.name} is moving`)
  }
}

class Dog extends Animal {
  static create() {
    return super.create() // 调用父类静态方法
  }
  move() {
    console.log('Dog is running')
    super.move() // 调用父类实例方法
  }
}
```

## 8. 🤔 类继承与接口实现有什么区别？

| 特性 | 类继承 (extends) | 接口实现 (implements) |
| --- | --- | --- |
| 关系类型 | "is-a" 关系（狗 is-a 动物） | "has-a/can-do" 关系（类 has-a 特性） |
| 继承数量 | 单继承（只能 extends 一个类） | 多实现（可以 implements 多个接口） |
| 成员实现 | 继承具体实现（属性和方法体） | 仅继承契约（必须实现接口方法） |
| 访问修饰符 | 可修改访问级别（但不能更严格） | 必须保持 public |
| 构造函数 | 继承构造函数逻辑 | 无 |
| 静态成员 | 继承静态成员 | 无 |

## 9. 🤔 TypeScript 中的类继承是结构类型还是名义类型？

结构类型系统（Structural Typing），但有特殊的兼容性规则。

TypeScript 的类继承本质上仍遵循结构类型，但在实例兼容性判断时会考虑私有/受保护成员：

::: code-group

```ts [1]
// 结构完全相同的类可以互相赋值
class Cat {
  name: string = ''
  meow() {}
}

class Dog {
  name: string = ''
  meow() {} // 结构与 Cat 完全相同
}

let animal: Cat = new Dog() // ✅ 允许！因为结构匹配
```

```ts [2]
// 有 private/protected 成员时，必须来自同一声明

// ✅ 正确的情况：
class Animal {
  private id: number = 0
}

class Cat1 extends Animal {}
class Dog1 extends Animal {}

let cat1: Cat1 = new Dog1() // ✅ 允许

// ❌ 错误的情况：
class Cat2 {
  private id: number = 0
}

class Dog2 {
  private id: number = 0
}

let cat2: Cat2 = new Dog2() // ❌ 错误!
// Type 'Dog2' is not assignable to type 'Cat2'.
//   Types have separate declarations of a private property 'id'.(2322)
```

```ts [3]
// 继承关系中的赋值（向上转型）
class Animal {}
class Cat extends Animal {}

let animal: Animal = new Cat() // ✅ 子类可以赋值给父类
```

:::

1. 纯公共成员的类：按结构类型判断（结构相同即可赋值）
2. 含私有/受保护成员的类：要求来自同一类声明（类似名义类型）
3. 继承关系中的类：子类自动兼容父类（协变）

## 10. 🤔 多重继承如何实现？

TypeScript 不支持多继承（一个类不能 extends 多个类），但有以下替代方案：

::: code-group

```ts [1]
// 接口多实现
interface Flyable {
  fly(): void
}
interface Swimmable {
  swim(): void
}

class Bird implements Flyable, Swimmable {
  fly() {
    /*...*/
  }
  swim() {
    /*...*/
  }
}
```

```ts [2]
// Mixin 模式
type Constructor<T = {}> = new (...args: any[]) => T

// 基础类
class Cat {
  constructor(public name: string) {}
  meow() {
    console.log(`${this.name}: Meow!`)
  }
}

// Mixin 函数：为类添加时间戳功能
function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = Date.now()
    getAge() {
      return Date.now() - this.timestamp
    }
  }
}

// Mixin 函数：为类添加激活状态功能
function Activatable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    isActive = false
    activate() {
      this.isActive = true
    }
    deactivate() {
      this.isActive = false
    }
  }
}

// 使用 Mixin
const TimestampedCat = Timestamped(Cat)
const cat1 = new TimestampedCat('Whiskers')
console.log(cat1.timestamp) // 1761810631019 当前时间戳
cat1.meow() // "Whiskers: Meow!"

// 组合多个 Mixin
const SuperCat = Activatable(Timestamped(Cat))
const cat2 = new SuperCat('Felix')
cat2.activate()
console.log(cat2.isActive) // true
console.log(cat2.getAge()) // 1 实例创建后的毫秒数
cat2.meow() // "Felix: Meow!"
```

```ts [3]
// 组合代替继承（Composition over Inheritance）
class Engine {
  private horsepower: number
  constructor(hp: number) {
    this.horsepower = hp
  }
  start() {
    console.log(`Engine started with ${this.horsepower} HP`)
  }
  stop() {
    console.log('Engine stopped')
  }
}

class Transmission {
  shift(gear: number) {
    console.log(`Shifted to gear ${gear}`)
  }
}

// Car 通过组合使用 Engine 和 Transmission
class Car {
  private engine: Engine
  private transmission: Transmission

  constructor(horsepower: number) {
    this.engine = new Engine(horsepower)
    this.transmission = new Transmission()
  }

  start() {
    this.engine.start()
  }

  drive() {
    this.start()
    this.transmission.shift(1)
    console.log('Car is moving')
  }

  stop() {
    this.engine.stop()
  }
}

const myCar = new Car(200)
myCar.drive()
// "Engine started with 200 HP"
// "Shifted to gear 1"
// "Car is moving"
```

:::

## 11. 🤔 继承时如何处理访问修饰符？

基本原则：子类不能降低父类成员的访问级别。

| 父类修饰符  | 子类允许的修饰符      | 结果                    |
| ----------- | --------------------- | ----------------------- |
| `public`    | `public`              | ✅                      |
| `protected` | `protected`、`public` | ✅ (不能设为 `private`) |
| `private`   | 不可访问              | ❌ (子类无法访问)       |

::: code-group

```ts [错误示例]
class Base {
  protected x = 1
}

class Derived extends Base {
  private x = 2 // ❌ 错误：不能将 'protected' 属性更改为 'private'
}
// Class 'Derived' incorrectly extends base class 'Base'.
//  Property 'x' is private in type 'Derived' but not in type 'Base'.(2415)
```

```ts [正确示例]
class Base {
  protected x = 1
}

class Derived extends Base {
  x = 2 // ✅ 默认 public
  // 或
  // protected x = 2 // ✅ 保持 protected
}
```

:::

## 12. 🤔 静态成员是否会被继承？

是的，静态成员会被子类继承：

```ts
class Animal {
  static origin = { x: 0, y: 0 }
  static move() {
    console.log('Moving...')
  }
}

class Dog extends Animal {}

console.log(Dog.origin) // { x: 0, y: 0 }
Dog.move() // "Moving..."
```

但注意：

- 静态成员不会出现在实例上
- 子类可以重写父类的静态成员
- 静态方法中的 `this` 指向当前类（非实例）

## 13. 🔗 引用

- [Classes 类][1]
- [ECMA Script - The Function Constructor][2]
  - 下面是“子类必须先调用 super() 才能在派生构造函数中使用 this”的规范出处
  - ![图 0](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-30-15-29-11.png)
- [（MDN）：constructor 与 super 用法][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/classes.html
[2]: https://tc39.es/ecma262/#sec-function-constructor
[3]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes/constructor
