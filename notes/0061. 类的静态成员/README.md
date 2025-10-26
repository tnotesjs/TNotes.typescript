# [0061. 类的静态成员](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0061.%20%E7%B1%BB%E7%9A%84%E9%9D%99%E6%80%81%E6%88%90%E5%91%98)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 “类的静态成员”如何定义？](#3--类的静态成员如何定义)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- static

## 2. 🫧 评价

- todo

## 3. 🤔 “类的静态成员”如何定义？

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
