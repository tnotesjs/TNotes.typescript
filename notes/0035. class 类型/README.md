# [0035. class 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0035.%20class%20%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是 TypeScript 中的类（class）？](#3--什么是-typescript-中的类class)
- [4. 🤔 如何声明类的属性类型？](#4--如何声明类的属性类型)
- [5. 🤔 `strictPropertyInitialization` 配置有什么用？](#5--strictpropertyinitialization-配置有什么用)
- [6. 🤔 “只读属性”如何声明？](#6--只读属性如何声明)
- [7. 🤔 “类的方法类型”如何声明？](#7--类的方法类型如何声明)
- [8. 🤔 如何获取类的自身类型？](#8--如何获取类的自身类型)
- [9. 🤔 如何判断 Class 的类型兼容性？](#9--如何判断-class-的类型兼容性)
- [10. 🤔 如何实现类的继承？](#10--如何实现类的继承)
- [11. 🤔 override 关键字有什么作用？](#11--override-关键字有什么作用)
- [12. 🤔 什么是可访问性修饰符？](#12--什么是可访问性修饰符)
- [13. 🤔 “类的静态成员”如何定义？](#13--类的静态成员如何定义)
- [14. 🔗 引用](#14--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- class
- readonly
- static
- typeof
- extends
- override
- abstract member
- Parameter Properties
- access modifiers
  - public
  - private
  - protected
- tsconfig
  - [strictPropertyInitialization][1]
  - [noImplicitOverride][2]

## 2. 🫧 评价

- todo

## 3. 🤔 什么是 TypeScript 中的类（class）？

类（class）是面向对象编程的基本构件，封装了属性和方法，TypeScript 给予了全面支持。

```ts
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

```ts
class Point {
  x: number
  y: number
}
```

如果不给出类型，TypeScript 会认为 x 和 y 的类型都是 any：

```ts
class Point {
  x
  y
}
```

如果声明时给出初值，可以不写类型，TypeScript 会自行推断属性的类型：

```ts
class Point {
  x = 0
  y = 0
}
```

上面示例中，属性 x 和 y 的类型都会被推断为 number。

## 5. 🤔 `strictPropertyInitialization` 配置有什么用？

- `strictPropertyInitialization` 配置决定了 TypeScript 如何处理未初始化的类属性。
- `strictPropertyInitialization` 默认是打开的，实际开发中也是推荐打开的。
- `strictPropertyInitialization` 会检查属性是否设置了初值，如果没有就报错。
- 设置初始值的位置可以是在构造函数中，也可以在顶层声明时直接完成初始化。

```ts
// 打开 strictPropertyInitialization
class Point {
  x: number // ❌ 报错
  // Property 'x' has no initializer and is not definitely assigned in the constructor.(2564)
  y: number // ❌ 报错
  // Property 'y' has no initializer and is not definitely assigned in the constructor.(2564)
}

// 如果不希望出现报错，可以使用非空断言：
class Point {
  x!: number // ✅ 正确
  y!: number // ✅ 正确
}

// 也可以在构造函数中进行初始化
class Point {
  x: number // ✅ 正确
  y: number // ✅ 正确

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

// 或者直接在顶层声明时初始化
class Point {
  x: number = 0 // ✅ 正确
  y: number = 0 // ✅ 正确
}
// 等效：
class Point {
  x = 0 // ✅ 正确
  y = 0 // ✅ 正确
}
```

## 6. 🤔 “只读属性”如何声明？

- 属性名前面加上 readonly 修饰符，就表示该属性是只读的，实例对象不能修改这个属性。

```ts
class A {
  readonly id = 'foo'
}

const a = new A()
a.id = 'bar' // ❌ 报错
// Cannot assign to 'id' because it is a read-only property.(2540)
```

## 7. 🤔 “类的方法类型”如何声明？

- 类的方法就是普通函数，类型声明方式与函数一致。
- 跟普通函数一样，可以使用可选参数、参数默认值、函数重载 …… 等写法。
- 函数类型声明的具体语法可以参考 `0034. 函数类型`。

## 8. 🤔 如何获取类的自身类型？

要获得一个类的自身类型，一个简便的方法就是使用 typeof 运算符：

```ts
function createPoint(PointClass: typeof Point, x: number, y: number): Point {
  return new PointClass(x, y)
}
```

类的自身类型可以写成构造函数的形式：

```ts
function createPoint(
  PointClass: new (x: number, y: number) => Point,
  x: number,
  y: number
): Point {
  return new PointClass(x, y)
}
```

## 9. 🤔 如何判断 Class 的类型兼容性？

- Class 也遵循"结构类型原则"。（详细说明见笔记 `0031. 类型的兼容`）

```ts
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

// 一个对象只要满足 Class 的实例结构，就跟该 Class 属于同一个类型：
fn(bar) // ✅ 正确
```

## 10. 🤔 如何实现类的继承？

类（这里又称"子类"）可以使用 extends 关键字继承另一个类（这里又称"基类"）的所有属性和方法：

```ts
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

```ts
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

## 11. 🤔 override 关键字有什么作用？

TypeScript 4.3 引入了 override 关键字，明确表明作者的意图，就是要覆盖父类里面的同名方法：

```ts
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

## 12. 🤔 什么是可访问性修饰符？

类的内部成员的外部可访问性，由三个可访问性修饰符（access modifiers）控制：`public`、`private` 和 `protected`。

`public` 修饰符表示这是公开成员，外部可以自由访问：

```ts
class Greeter {
  public greet() {
    console.log('hi!')
  }
}
```

`private` 修饰符表示私有成员，只能用在当前类的内部：

```ts
class A {
  private x: number = 0
}

const a = new A()
a.x // 报错
```

`protected` 修饰符表示该成员是保护成员，只能在类的内部使用该成员，实例无法使用该成员，但是子类内部可以使用：

```ts
class A {
  protected x = 1
}

class B extends A {
  getX() {
    return this.x
  }
}
```

## 13. 🤔 “类的静态成员”如何定义？

- 类的内部可以使用 `static` 关键字，定义静态成员。

```ts
class MyClass {
  static x = 0
  static printX() {
    console.log(MyClass.x)
    // 静态成员是只能通过类本身使用的成员，不能通过实例对象使用。
  }
}

MyClass.x // 0
MyClass.printX() // 0
```

## 14. 🔗 引用

- [Classes 类][3]
- [strictPropertyInitialization][1]
- [noImplicitOverride][2]

[1]: https://www.typescriptlang.org/tsconfig/#strictPropertyInitialization
[2]: https://www.typescriptlang.org/tsconfig/#noImplicitOverride
[3]: https://www.typescriptlang.org/docs/handbook/2/classes.html
