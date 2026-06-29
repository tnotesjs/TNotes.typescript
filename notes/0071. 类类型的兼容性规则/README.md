# [0071. 类类型的兼容性规则](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0071.%20%E7%B1%BB%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%85%BC%E5%AE%B9%E6%80%A7%E8%A7%84%E5%88%99)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 兼容性规则速记表](#3-兼容性规则速记表)
- [4. 公有成员的兼容性规则是什么？](#4-公有成员的兼容性规则是什么)
- [5. 私有、受保护成员的兼容性规则是什么？](#5-私有受保护成员的兼容性规则是什么)
- [6. 静态成员的兼容性规则是？](#6-静态成员的兼容性规则是)
- [7. 构造函数签名的兼容性是？](#7-构造函数签名的兼容性是)
- [8. 类可以跟对象字面量兼容吗？](#8-类可以跟对象字面量兼容吗)

<!-- endregion:toc -->

## 1. 本节内容

- 类类型的兼容性规则

## 2. 评价

类同时具备对象和函数的特性，比如：

- 类的成员属性 - 就好比对象的成员属性
- 类的成员方法 - 就好比函数

因此，对类的类型兼容性介绍，可以重点看看 `对象类型的兼容性规则`、`函数类型的兼容性规则`，它们有很多都是共通的。

该笔记重点介绍类中特有的一些兼容性判定规则。

## 3. 兼容性规则速记表

| 类型 | 检查规则 | 备注 |
| --- | --- | --- |
| 公有成员 | 结构子类型规则 | 名字不重要，只看结构。 |
| 私有成员 | 必须同一类或其子类 | 封装安全 |
| 受保护成员 | 必须同一类或其子类 | 封装安全 |
| 静态成员 | 放行 | 随便什么类型都 OK，对兼容性检查无影响。 |
| 构造函数 | 放行 | 如果用到了 TS 提供的“类参数属性的语法糖”，则按照结构子类型规则来处理。 |

## 4. 公有成员的兼容性规则是什么？

走结构子类型那一套。

::: code-group

```ts [1]
class Point {
  x: number = 1
  y: number = 2
}
class Vector {
  x: number = 3
  y: number = 4
}

// 只关注结构，不关注名字。
let p: Point = new Vector() // ✅ 兼容
```

```ts [2]
class Point {
  x: number = 1
  y: number = 2
}
class Point3D {
  x: number = 3
  y: number = 4
  z: number = 5
}

let p: Point = new Point()
let p3: Point3D = new Point3D()

// Point3D 有 Point 需要的所有成员
p = p3 // ✅ 兼容

// p3 = p // ❌ 不兼容
// Property 'z' is missing in type 'Point' but required in type 'Point3D'.(2741)
```

:::

## 5. 私有、受保护成员的兼容性规则是什么？

为了防止破坏封装性，TypeScript 要求如果类中包含私有或受保护成员，则两个类实例的类型只有在它们来自同一个类声明或其子类时才兼容。

::: code-group

```ts [1]
class Animal {
  private name: string
  constructor(name: string) {
    this.name = name
  }
}

class Dog {
  private name: string // 即使结构相同，也不是 Animal 的私有成员
  constructor(name: string) {
    this.name = name
  }
}

let a: Animal = new Dog('Buddy') // ❌ 错误！私有成员不兼容
// Type 'Dog' is not assignable to type 'Animal'.
//   Types have separate declarations of a private property 'name'.(2322)
```

```ts [2]
// 基类（父类）
class Base {
  protected name = 'base'
}
// 派生类（子类）
class Derived extends Base {
  protected name = 'derived'
}

let base: Base = new Base()
let derived: Derived = new Derived()

// 子类可以赋值给父类
base = derived // ✅ 兼容

// 父类无法赋值给子类
derived = base // ❌ 不兼容
// Type 'Base' is not assignable to type 'Derived'.
//   Property 'name' is protected but type 'Base' is not a class derived from 'Derived'.(2322)
```

:::

## 6. 静态成员的兼容性规则是？

静态成员不参与类实例的兼容性检查。

即使两个类的静态成员完全不同，只要实例成员兼容，也可以赋值。

```ts
class A {
  static version = 1
  static readonly name_a = 'A'
}
class B {
  static readonly version: 'v1' = 'v1'
  static name_b = undefined
}

let b: B = new B()
let a: A = new A()

// 不会检查静态成员
a = b // ✅ OK
b = a // ✅ OK
```

## 7. 构造函数签名的兼容性是？

得看具体情况：

1. 通常情况：类的构造函数（即类类型的“构造签名”）在比较时，不会进行类型检查；
2. 特殊情况：在构造函数参数中使用了参数属性的简写，会按照结构子类型规则来检查；

::: code-group

```ts [1]
class A {
  constructor(x: number) {}
}
class B {
  constructor(x: number, y: number, z?: readonly string[]) {}
}

let a = new A(1)
let b = new B(1, 2, ['1', '2', '3'])

a = b // ✅ 兼容
b = a // ✅ 兼容
```

```ts [2]
// 参数属性的简写语法糖：
class A {
  constructor(public x: number) {}
}
class B {
  constructor(public x: number, public y: number) {}
}

// 如果你看不懂上述的语法糖形式，可以看看下面的等效写法：
// 等效写法：
// class A {
//   x: number

//   constructor( x: number) {
//     this.x = x
//   }
// }
// class B {
//   x: number
//   y: number

//   constructor( x: number,  y: number) {
//     this.x = x
//     this.y = y
//   }
// }

let a = new A(1)
let b = new B(1, 2)

a = b // ✅ 兼容 - a 要的，b 都有
// b = a // ❌ 不兼容 - a 没有 b 要的 y
// Property 'y' is missing in type 'A' but required in type 'B'.(2741)
```

:::

## 8. 类可以跟对象字面量兼容吗？

可以，只要结构匹配就行。

```ts
class Point {
  x = 1
  y = 2
}

const p: Point = new Point() // ✅ OK

// 会触发对象的“新鲜度检查”（Freshness Checking）规则：要求结构必须完全一致
// const p1: Point = { x: 1, y: 2, z: 3 } // ❌ 报错
// Object literal may only specify known properties, and 'z' does not exist in type 'Point'.(2353)

// 避开 Freshness Checking 规则：
const p2 = { x: 1, y: 2, z: 3 }
const p3: Point = p2

// 会触发对象的“新鲜度检查”（Freshness Checking）规则：要求结构必须完全一致
const p4: Point = { x: 1, y: 2 } // ✅ OK
```
