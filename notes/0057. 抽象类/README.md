# [0057. 抽象类](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0057.%20%E6%8A%BD%E8%B1%A1%E7%B1%BB)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是抽象类和抽象成员？](#3--什么是抽象类和抽象成员)
- [4. 🤔 抽象类与接口有什么区别？](#4--抽象类与接口有什么区别)
- [5. 🤔 抽象类可以包含构造函数吗？](#5--抽象类可以包含构造函数吗)
- [6. 🤔 抽象方法必须被子类实现吗？](#6--抽象方法必须被子类实现吗)
- [7. 🤔 抽象类可以有静态成员吗？](#7--抽象类可以有静态成员吗)
- [8. 🤔 什么时候应该使用抽象类？](#8--什么时候应该使用抽象类)
  - [8.1. 适用场景](#81-适用场景)
  - [8.2. 不适用场景](#82-不适用场景)
- [9. 🤔 抽象类可以实现接口吗？](#9--抽象类可以实现接口吗)
- [10. 🔗 引用](#10--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- abstract class（抽象类）
- abstract member（抽象成员）
- 抽象类与接口的区别
- 抽象类的使用场景

## 2. 🫧 评价

抽象类是面向对象编程中实现代码复用和强制规范的重要工具。它介于普通类和接口之间：既可以包含具体实现（像普通类），又可以定义必须由子类实现的契约（像接口）。

TypeScript 的抽象类是纯编译时特性，编译后会变成普通的 JavaScript 类，但编译器会阻止直接实例化抽象类。这在设计框架、库或大型应用的基础架构时特别有用——可以为子类提供公共逻辑，同时强制子类实现特定行为。

相比接口，抽象类的优势在于可以包含实现细节和状态；相比普通类，抽象类的优势在于可以强制子类实现特定方法。合理使用抽象类能显著提升代码的可维护性和扩展性。

## 3. 🤔 什么是抽象类和抽象成员？

TypeScript 允许在类的定义前面，加上关键字 `abstract`，表示该类不能被实例化，只能当作其他类的模板。这种类就叫做"抽象类"（abstract class）。

::: code-group

```ts [抽象类基础]
abstract class Animal {
  id = 1
  name: string

  constructor(name: string) {
    this.name = name
  }

  move() {
    console.log(`${this.name} is moving`)
  }
}

const animal = new Animal('Cat') // ❌ 错误：不能实例化抽象类
// Cannot create an instance of an abstract class.(2511)

// ✅ 正确：通过子类使用
class Dog extends Animal {}
const dog = new Dog('Buddy') // ✅ 允许
```

```ts [抽象成员]
abstract class Animal {
  abstract makeSound(): void // 抽象方法（无实现）
  abstract legs: number // 抽象属性（无初始值）

  move() {
    // 具体方法（有实现）
    console.log('Moving...')
  }
}

class Dog extends Animal {
  legs = 4 // ✅ 必须实现抽象属性

  makeSound() {
    // ✅ 必须实现抽象方法
    console.log('Woof!')
  }
}
```

:::

**关键规则**：

1. 抽象类不能被 `new` 实例化
2. 抽象成员不能有具体实现
3. 子类必须实现所有抽象成员（除非子类也是抽象类）
4. 抽象类可以包含非抽象成员

## 4. 🤔 抽象类与接口有什么区别？

| 特性          | 抽象类（abstract class）      | 接口（interface）      |
| ------------- | ----------------------------- | ---------------------- |
| 实现          | 可包含具体实现                | 只能定义契约（无实现） |
| 构造函数      | 可以有                        | 不能有                 |
| 访问修饰符    | 支持 public/protected/private | 只能是 public          |
| 继承/实现方式 | 单继承（extends）             | 多实现（implements）   |
| 实例属性      | 可以有                        | 不能有                 |
| 静态成员      | 可以有                        | 不能有                 |
| 编译后        | 保留为类                      | 完全擦除               |
| 适用场景      | 共享代码 + 强制规范           | 纯粹的类型契约         |

::: code-group

```ts [抽象类]
abstract class Animal {
  protected name: string // ✅ 实例属性

  constructor(name: string) {
    // ✅ 构造函数
    this.name = name
  }

  move() {
    // ✅ 具体实现
    console.log(`${this.name} is moving`)
  }

  abstract makeSound(): void // 抽象方法
}

class Dog extends Animal {
  // 只需实现抽象方法
  makeSound() {
    console.log('Woof!')
  }
}
```

```ts [接口]
interface IAnimal {
  name: string // 只定义类型

  move(): void // 无实现
  makeSound(): void
}

class Dog implements IAnimal {
  name: string

  constructor(name: string) {
    this.name = name
  }

  // 必须实现所有方法
  move() {
    console.log(`${this.name} is moving`)
  }

  makeSound() {
    console.log('Woof!')
  }
}
```

:::

**选择建议**：

- 需要共享代码逻辑 → 使用抽象类
- 只需要类型约束 → 使用接口
- 需要多继承 → 使用接口（一个类可以 implements 多个接口）

## 5. 🤔 抽象类可以包含构造函数吗？

可以。抽象类的构造函数主要用于：

1. 初始化抽象类自身的属性
2. 被子类通过 `super()` 调用

::: code-group

```ts [基础用法]
abstract class Animal {
  protected name: string
  protected age: number

  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }

  abstract makeSound(): void
}

class Dog extends Animal {
  constructor(name: string, age: number) {
    super(name, age) // ✅ 调用抽象类构造函数
  }

  makeSound() {
    console.log(`${this.name} (${this.age} years old) says: Woof!`)
  }
}

const dog = new Dog('Buddy', 3)
dog.makeSound() // "Buddy (3 years old) says: Woof!"
```

```ts [protected 构造函数]
abstract class Animal {
  protected constructor(protected name: string) {
    // protected 构造函数：只能被子类调用
  }

  abstract makeSound(): void
}

class Dog extends Animal {
  constructor(name: string) {
    super(name) // ✅ 子类可以调用
  }

  makeSound() {
    console.log('Woof!')
  }
}

// const animal = new Animal('Cat'); // ❌ 错误：抽象类不能实例化
```

:::

## 6. 🤔 抽象方法必须被子类实现吗？

是的，除非子类也是抽象类。

::: code-group

```ts [✅ 正确实现]
abstract class Animal {
  abstract makeSound(): void
  abstract move(): void
}

class Dog extends Animal {
  makeSound() {
    console.log('Woof!')
  }

  move() {
    console.log('Running')
  }
}
```

```ts [❌ 缺少实现]
abstract class Animal {
  abstract makeSound(): void
  abstract move(): void
}

class Dog extends Animal {
  makeSound() {
    console.log('Woof!')
  }
  // ❌ 错误：缺少 move() 实现
}
// Non-abstract class 'Dog' does not implement all abstract members of 'Animal'(18052)
```

```ts [✅ 子类也是抽象类]
abstract class Animal {
  abstract makeSound(): void
  abstract move(): void
}

abstract class Mammal extends Animal {
  // ✅ 允许：抽象类可以不实现父类的抽象方法
  abstract breathe(): void // 还可以添加新的抽象方法
}

class Dog extends Mammal {
  // 必须实现所有抽象方法
  makeSound() {
    console.log('Woof!')
  }
  move() {
    console.log('Running')
  }
  breathe() {
    console.log('Breathing')
  }
}
```

:::

## 7. 🤔 抽象类可以有静态成员吗？

可以。抽象类可以包含静态属性和静态方法：

::: code-group

```ts [静态成员]
abstract class Animal {
  static kingdom = 'Animalia' // 静态属性

  static classify() {
    // 静态方法
    return `Kingdom: ${Animal.kingdom}`
  }

  abstract makeSound(): void
}

class Dog extends Animal {
  makeSound() {
    console.log('Woof!')
  }
}

console.log(Animal.kingdom) // "Animalia"
console.log(Animal.classify()) // "Kingdom: Animalia"
console.log(Dog.kingdom) // "Animalia" (继承自父类)
```

```ts [抽象静态方法不存在]
abstract class Animal {
  // ❌ 错误：不存在"抽象静态方法"这种语法
  // abstract static create(): Animal;

  // ✅ 正确：只能定义具体的静态方法
  static create(name: string): Animal {
    throw new Error('Must be implemented by subclass')
  }
}
```

:::

**注意**：TypeScript 不支持"抽象静态方法"，因为静态成员不参与多态机制。

## 8. 🤔 什么时候应该使用抽象类？

### 8.1. 适用场景

1. **框架/库设计**：定义扩展点

```ts
// 插件系统基类
abstract class Plugin {
  abstract name: string
  abstract version: string

  // 公共逻辑
  init() {
    console.log(`Initializing ${this.name} v${this.version}`)
  }

  abstract execute(): void // 强制子类实现
}

class LoggerPlugin extends Plugin {
  name = 'Logger'
  version = '1.0.0'

  execute() {
    console.log('Logging...')
  }
}
```

2. **业务模板方法模式**：定义流程骨架

```ts
abstract class DataProcessor {
  // 模板方法（定义处理流程）
  process(data: unknown) {
    this.validate(data)
    const result = this.transform(data)
    this.save(result)
  }

  protected abstract validate(data: unknown): void
  protected abstract transform(data: unknown): unknown
  protected abstract save(data: unknown): void
}

class UserDataProcessor extends DataProcessor {
  protected validate(data: unknown) {
    /* ... */
  }
  protected transform(data: unknown) {
    /* ... */
  }
  protected save(data: unknown) {
    /* ... */
  }
}
```

3. **组件基类**：共享生命周期逻辑

```ts
abstract class Component {
  protected mounted = false

  mount() {
    console.log('Mounting component...')
    this.onMount()
    this.mounted = true
  }

  protected abstract onMount(): void // 子类实现具体挂载逻辑
}
```

### 8.2. 不适用场景

- 纯类型约束（用接口）
- 需要多继承（用接口 + 组合）
- 工具函数集合（用命名空间或模块）

## 9. 🤔 抽象类可以实现接口吗？

可以。抽象类可以 `implements` 接口，但不必实现接口的所有成员（可以声明为抽象成员）：

```ts
interface IAnimal {
  name: string
  makeSound(): void
  move(): void
}

abstract class Animal implements IAnimal {
  name: string

  constructor(name: string) {
    this.name = name
  }

  // ✅ 实现部分成员
  move() {
    console.log(`${this.name} is moving`)
  }

  // ✅ 将部分成员声明为抽象的
  abstract makeSound(): void
}

class Dog extends Animal {
  makeSound() {
    console.log('Woof!')
  }
}
```

这种模式常用于：

- 接口定义完整契约
- 抽象类提供部分实现
- 具体类完成剩余实现

## 10. 🔗 引用

- [Classes 类][1]
- [Abstract Classes and Members][2]

[1]: https://www.typescriptlang.org/docs/handbook/2/classes.html
[2]: https://www.typescriptlang.org/docs/handbook/2/classes.html#abstract-classes-and-members
