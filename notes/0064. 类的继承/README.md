# [0064. 类的继承](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0064.%20%E7%B1%BB%E7%9A%84%E7%BB%A7%E6%89%BF)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 如何实现类的继承？](#3--如何实现类的继承)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- todo

## 2. 🫧 评价

- todo

## 3. 🤔 如何实现类的继承？

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
