# [0064. 类的继承](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0064.%20%E7%B1%BB%E7%9A%84%E7%BB%A7%E6%89%BF)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 如何实现类的继承？](#3--如何实现类的继承)
- [4. 🤔 子类构造函数中必须调用 super() 吗？为什么？](#4--子类构造函数中必须调用-super-吗为什么)
- [5. 🤔 super 关键字有哪些使用场景？](#5--super-关键字有哪些使用场景)
- [6. 🤔 类继承与接口实现有什么区别？](#6--类继承与接口实现有什么区别)
- [7. 🤔 TypeScript 中的类继承是结构类型还是名义类型？](#7--typescript-中的类继承是结构类型还是名义类型)
- [8. 🤔 多重继承如何实现？](#8--多重继承如何实现)
- [9. 🤔 继承时如何处理访问修饰符？](#9--继承时如何处理访问修饰符)
- [10. 🤔 静态成员是否会被继承？](#10--静态成员是否会被继承)
- [11. 🔗 引用](#11--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- extends 关键字
- 构造函数继承
- 方法重写
- super 关键字
- 类继承与接口实现的区别
- 名义类型系统

## 2. 🫧 评价

类继承是面向对象编程的核心特性之一，在 TypeScript 中通过 `extends` 关键字实现。与 JavaScript 一致，TypeScript 的类继承是**单继承**机制，但通过接口和 mixin 模式可以实现类似多重继承的效果。

需要注意的是，TypeScript 的类继承属于**名义类型系统**（nominal typing），即类型兼容性基于类名而非结构（这与 TypeScript 默认的结构类型系统不同）。

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

子类可以覆盖基类的同名方法（方法重写）：

```ts
class Dog extends Animal {
  bark() {
    console.log('Woof! Woof!')
  }
  move(distance: number = 5) {
    console.log('Running...')
    super.move(distance) // 调用父类方法
  }
}
```

## 4. 🤔 子类构造函数中必须调用 super() 吗？为什么？

**必须调用**，如果子类定义了构造函数，必须在使用 `this` 前调用 `super()`。

原因：

1. 需要先初始化父类部分的实例
2. JavaScript 规范要求：子类构造函数必须先调用 `super()` 才能使用 `this`
3. 编译器会强制检查，否则报错：`'super' must be called before accessing 'this' in the constructor of a derived class`

正确示例：

```ts
class Dog extends Animal {
  breed: string
  constructor(name: string, breed: string) {
    super(name) // 必须先调用
    this.breed = breed
  }
}
```

错误示例：

```ts
class Dog extends Animal {
  constructor(name: string) {
    this.name = name // ❌ 错误：必须先调用 super()
    super(name)
  }
}
```

## 5. 🤔 super 关键字有哪些使用场景？

`super` 关键字有两种主要使用场景：

1. **调用父类构造函数**：`super(...args)`

   - 必须在子类构造函数中使用 `this` 前调用
   - 传递参数给父类构造函数

2. **调用父类方法**：`super.method(...)`
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

## 6. 🤔 类继承与接口实现有什么区别？

| 特性 | 类继承 (extends) | 接口实现 (implements) |
| --- | --- | --- |
| **关系类型** | "is-a" 关系（狗 is-a 动物） | "has-a/can-do" 关系（类 has-a 特性） |
| **继承数量** | 单继承（只能 extends 一个类） | 多实现（可以 implements 多个接口） |
| **成员实现** | 继承具体实现（属性和方法体） | 仅继承契约（必须实现接口方法） |
| **访问修饰符** | 可修改访问级别（但不能更严格） | 必须保持 public |
| **构造函数** | 继承构造函数逻辑 | 不继承构造函数 |
| **静态成员** | 继承静态成员 | 不继承静态成员 |

关键区别：类继承是**实现继承**，接口实现是**契约继承**。

## 7. 🤔 TypeScript 中的类继承是结构类型还是名义类型？

**名义类型系统（Nominal Typing）**。

虽然 TypeScript 默认使用**结构类型系统**（只要结构匹配即可赋值），但**类继承**是个例外：

```ts
class Cat {
  meow() {}
}

class Dog {
  bark() {}
}

let animal: Cat = new Dog() // ❌ 结构匹配但类型名不同，报错
```

但在类继承中：

```ts
class Animal {}
class Cat extends Animal {}
class Dog extends Animal {}

let cat: Animal = new Cat() // ✅
let dog: Animal = new Dog() // ✅
```

这是因为类继承创建了明确的类型层次关系，TypeScript 通过类名（名义）而非结构来确定继承关系。

## 8. 🤔 多重继承如何实现？

TypeScript **不支持多继承**（一个类不能 extends 多个类），但有以下替代方案：

1. **接口多实现**：

   ```ts
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

2. **Mixin 模式**：

   ```ts
   type Constructor<T = {}> = new (...args: any[]) => T

   function Timestamped<TBase extends Constructor>(Base: TBase) {
     return class extends Base {
       timestamp = Date.now()
     }
   }

   const TimestampedCat = Timestamped(Cat)
   ```

3. **组合代替继承**：

   ```ts
   class Engine {
     start() {
       /*...*/
     }
   }

   class Car {
     engine = new Engine()
     start() {
       this.engine.start()
     }
   }
   ```

## 9. 🤔 继承时如何处理访问修饰符？

子类不能**降低**父类成员的访问级别：

| 父类修饰符  | 子类允许的修饰符      | 示例                    |
| ----------- | --------------------- | ----------------------- |
| `public`    | `public`              | ✅                      |
| `protected` | `protected`, `public` | ✅ (不能设为 `private`) |
| `private`   | 不可访问              | ❌ (子类无法访问)       |

错误示例：

```ts
class Base {
  protected x = 1
}

class Derived extends Base {
  private x = 2 // ❌ 错误：不能将 'protected' 属性更改为 'private'
}
```

正确示例：

```ts
class Base {
  protected x = 1
}

class Derived extends Base {
  x = 2 // ✅ 默认 public
  // 或
  protected x = 2 // ✅ 保持 protected
}
```

## 10. 🤔 静态成员是否会被继承？

**是的**，静态成员会被子类继承：

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

- 静态成员**不会**出现在实例上
- 子类可以**重写**父类的静态成员
- 静态方法中的 `this` 指向当前类（非实例）

## 11. 🔗 引用

- [Classes 类][1]
- [继承与派生类][2]

[1]: https://www.typescriptlang.org/docs/handbook/2/classes.html
[2]: https://www.typescriptlang.org/docs/handbook/2/classes.html#inheritance

```
</code>
```
