# [0035. class 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0035.%20class%20%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是 TypeScript 中的类（class）？](#3--什么是-typescript-中的类class)
- [4. 🤔 如何声明类的属性类型？](#4--如何声明类的属性类型)
- [5. 🤔 TypeScript 如何处理未初始化的类属性？](#5--typescript-如何处理未初始化的类属性)
- [6. 🤔 readonly 修饰符有什么作用？](#6--readonly-修饰符有什么作用)
- [7. 🤔 类的方法如何声明类型？](#7--类的方法如何声明类型)
- [8. 🤔 什么是存取器方法？](#8--什么是存取器方法)
- [9. 🤔 如何使用 implements 关键字？](#9--如何使用-implements-关键字)
- [10. 🤔 如何获取类的自身类型？](#10--如何获取类的自身类型)
- [11. 🤔 什么是结构类型原则？](#11--什么是结构类型原则)
- [12. 🤔 如何实现类的继承？](#12--如何实现类的继承)
- [13. 🤔 override 关键字有什么作用？](#13--override-关键字有什么作用)
- [14. 🤔 什么是可访问性修饰符？](#14--什么是可访问性修饰符)
- [15. 🤔 如何使用实例属性的简写形式？](#15--如何使用实例属性的简写形式)
- [16. 🤔 如何处理类的静态成员？](#16--如何处理类的静态成员)
- [17. 🤔 什么是抽象类和抽象成员？](#17--什么是抽象类和抽象成员)
- [18. 🤔 如何处理类中的 this 问题？](#18--如何处理类中的-this-问题)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- todo

## 2. 🫧 评价

- todo

## 3. 🤔 什么是 TypeScript 中的类（class）？

类（class）是面向对象编程的基本构件，封装了属性和方法，TypeScript 给予了全面支持。

```typescript
class Point {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  add(point: Point) {
    return new Point(this.x + point.x, this.y + point.y)
  }
}
```

上面示例中定义了一个 Point 类，包含属性 x 和 y，以及构造函数和 add 方法。

## 4. 🤔 如何声明类的属性类型？

类的属性可以在顶层声明，也可以在构造方法内部声明。对于顶层声明的属性，可以在声明时同时给出类型：

```typescript
class Point {
  x: number
  y: number
}
```

如果不给出类型，TypeScript 会认为 x 和 y 的类型都是 any：

```typescript
class Point {
  x
  y
}
```

如果声明时给出初值，可以不写类型，TypeScript 会自行推断属性的类型：

```typescript
class Point {
  x = 0
  y = 0
}
```

上面示例中，属性 x 和 y 的类型都会被推断为 number。

## 5. 🤔 TypeScript 如何处理未初始化的类属性？

TypeScript 有一个配置项 `strictPropertyInitialization`，只要打开（默认是打开的），就会检查属性是否设置了初值，如果没有就报错：

```typescript
// 打开 strictPropertyInitialization
class Point {
  x: number // 报错
  y: number // 报错
}
```

如果不希望出现报错，可以使用非空断言：

```typescript
class Point {
  x!: number
  y!: number
}
```

上面示例中，属性 x 和 y 没有初值，但是属性名后面添加了感叹号，表示这两个属性肯定不会为空，所以 TypeScript 就不报错了。

## 6. 🤔 readonly 修饰符有什么作用？

属性名前面加上 readonly 修饰符，就表示该属性是只读的。实例对象不能修改这个属性：

```typescript
class A {
  readonly id = 'foo'
}

const a = new A()
a.id = 'bar' // 报错
```

readonly 属性的初始值，可以写在顶层属性，也可以写在构造方法里面：

```typescript
class A {
  readonly id: string

  constructor() {
    this.id = 'bar' // 正确
  }
}
```

## 7. 🤔 类的方法如何声明类型？

类的方法就是普通函数，类型声明方式与函数一致：

```typescript
class Point {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  add(point: Point) {
    return new Point(this.x + point.x, this.y + point.y)
  }
}
```

类的方法跟普通函数一样，可以使用参数默认值，以及函数重载。

## 8. 🤔 什么是存取器方法？

存取器（accessor）是特殊的类方法，包括取值器（getter）和存值器（setter）两种方法：

```typescript
class C {
  _name = ''
  get name() {
    return this._name
  }
  set name(value) {
    this._name = value
  }
}
```

如果某个属性只有 `get` 方法，没有 `set` 方法，那么该属性自动成为只读属性：

```typescript
class C {
  _name = 'foo'

  get name() {
    return this._name
  }
}

const c = new C()
c.name = 'bar' // 报错
```

## 9. 🤔 如何使用 implements 关键字？

interface 接口或 type 别名，可以用对象的形式，为 class 指定一组检查条件。然后，类使用 implements 关键字，表示当前类满足这些外部类型条件的限制：

```typescript
interface Country {
  name: string
  capital: string
}

class MyCountry implements Country {
  name = ''
  capital = ''
}
```

类可以实现多个接口（其实是接受多重限制），每个接口之间使用逗号分隔：

```typescript
class Car implements MotorVehicle, Flyable, Swimmable {
  // ...
}
```

## 10. 🤔 如何获取类的自身类型？

要获得一个类的自身类型，一个简便的方法就是使用 typeof 运算符：

```typescript
function createPoint(PointClass: typeof Point, x: number, y: number): Point {
  return new PointClass(x, y)
}
```

类的自身类型可以写成构造函数的形式：

```typescript
function createPoint(
  PointClass: new (x: number, y: number) => Point,
  x: number,
  y: number
): Point {
  return new PointClass(x, y)
}
```

## 11. 🤔 什么是结构类型原则？

Class 也遵循"结构类型原则"。一个对象只要满足 Class 的实例结构，就跟该 Class 属于同一个类型：

```typescript
class Foo {
  id!: number
}

function fn(arg: Foo) {
  // ...
}

const bar = {
  id: 10,
  amount: 100,
}

fn(bar) // 正确
```

## 12. 🤔 如何实现类的继承？

类（这里又称"子类"）可以使用 extends 关键字继承另一个类（这里又称"基类"）的所有属性和方法：

```typescript
class A {
  greet() {
    console.log('Hello, world!')
  }
}

class B extends A {}

const b = new B()
b.greet() // "Hello, world!"
```

子类可以覆盖基类的同名方法：

```typescript
class B extends A {
  greet(name?: string) {
    if (name === undefined) {
      super.greet()
    } else {
      console.log(`Hello, ${name}`)
    }
  }
}
```

## 13. 🤔 override 关键字有什么作用？

TypeScript 4.3 引入了 override 关键字，明确表明作者的意图，就是要覆盖父类里面的同名方法：

```typescript
class B extends A {
  override show() {
    // ...
  }
  override hide() {
    // ...
  }
}
```

TypeScript 又提供了一个编译参数 `noImplicitOverride`。一旦打开这个参数，子类覆盖父类的同名方法就会报错，除非使用了 override 关键字。

## 14. 🤔 什么是可访问性修饰符？

类的内部成员的外部可访问性，由三个可访问性修饰符（access modifiers）控制：`public`、`private` 和 `protected`。

`public` 修饰符表示这是公开成员，外部可以自由访问：

```typescript
class Greeter {
  public greet() {
    console.log('hi!')
  }
}
```

`private` 修饰符表示私有成员，只能用在当前类的内部：

```typescript
class A {
  private x: number = 0
}

const a = new A()
a.x // 报错
```

`protected` 修饰符表示该成员是保护成员，只能在类的内部使用该成员，实例无法使用该成员，但是子类内部可以使用：

```typescript
class A {
  protected x = 1
}

class B extends A {
  getX() {
    return this.x
  }
}
```

## 15. 🤔 如何使用实例属性的简写形式？

实际开发中，很多实例属性的值，是通过构造方法传入的。TypeScript 提供了一种简写形式：

```typescript
class Point {
  constructor(public x: number, public y: number) {}
}

const p = new Point(10, 10)
p.x // 10
p.y // 10
```

除了 `public` 修饰符，构造方法的参数名只要有 `private`、`protected`、`readonly` 修饰符，都会自动声明对应修饰符的实例属性。

## 16. 🤔 如何处理类的静态成员？

类的内部可以使用 `static` 关键字，定义静态成员。静态成员是只能通过类本身使用的成员，不能通过实例对象使用：

```typescript
class MyClass {
  static x = 0
  static printX() {
    console.log(MyClass.x)
  }
}

MyClass.x // 0
MyClass.printX() // 0
```

## 17. 🤔 什么是抽象类和抽象成员？

TypeScript 允许在类的定义前面，加上关键字 `abstract`，表示该类不能被实例化，只能当作其他类的模板。这种类就叫做"抽象类"（abstract class）：

```typescript
abstract class A {
  id = 1
}

const a = new A() // 报错
```

抽象类的内部可以有已经实现好的属性和方法，也可以有还未实现的属性和方法。后者就叫做"抽象成员"（abstract member）：

```typescript
abstract class A {
  abstract foo: string
  bar: string = ''
}

class B extends A {
  foo = 'b'
}
```

## 18. 🤔 如何处理类中的 this 问题？

类的方法经常用到 `this` 关键字，它表示该方法当前所在的对象。TypeScript 允许函数增加一个名为 `this` 的参数，放在参数列表的第一位，用来描述函数内部的 `this` 关键字的类型：

```typescript
class A {
  name = 'A'

  getName(this: A) {
    return this.name
  }
}
```

在类的内部，`this` 本身也可以当作类型使用，表示当前类的实例对象：

```typescript
class Box {
  contents: string = ''

  set(value: string): this {
    this.contents = value
    return this
  }
}
```
