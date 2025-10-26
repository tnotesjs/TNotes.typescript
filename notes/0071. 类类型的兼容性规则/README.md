# [0071. 类类型的兼容性规则](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0071.%20%E7%B1%BB%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%85%BC%E5%AE%B9%E6%80%A7%E8%A7%84%E5%88%99)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 类类型的兼容性规则是什么？](#3--类类型的兼容性规则是什么)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- todo

## 2. 🫧 评价

- todo

## 3. 🤔 类类型的兼容性规则是什么？

类也遵循结构子类型，但私有/受保护成员例外！

- 公有成员：结构兼容

```ts
class Point {
  x: number = 1
  y: number = 2
}
class Vector {
  x: number = 3
  y: number = 4
}

let p: Point = new Vector() // ✅ 兼容
```

- 私有/受保护成员：必须来自同一声明

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

// 原因：防止意外继承，保证封装性。
```
