# [0071. 类类型的兼容性规则](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0071.%20%E7%B1%BB%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%85%BC%E5%AE%B9%E6%80%A7%E8%A7%84%E5%88%99)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 公有成员成员的兼容性规则是什么？](#3--公有成员成员的兼容性规则是什么)
- [4. 🤔 私有、受保护成员的兼容性规则是什么？](#4--私有受保护成员的兼容性规则是什么)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 类类型的兼容性规则

## 2. 🫧 评价

类同时具备对象和函数的特性，比如：

- 类的成员属性 - 就好比对象的成员属性
- 类的成员方法 - 就好比函数

因此，对类的类型兼容性介绍，可以重点看看 `对象类型的兼容性规则`、`函数类型的兼容性规则`，它们有很多都是共通的。

该笔记重点介绍类中特有的一些兼容性判定规则。

## 3. 🤔 公有成员成员的兼容性规则是什么？

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

## 4. 🤔 私有、受保护成员的兼容性规则是什么？

为了防止意外继承，保证封装性，要求私有、受保护成员必须来源于同一类声明。

```ts
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
