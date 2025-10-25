# [0057. 抽象类](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0057.%20%E6%8A%BD%E8%B1%A1%E7%B1%BB)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是抽象类和抽象成员？](#3--什么是抽象类和抽象成员)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- abstract class

## 2. 🫧 评价

- todo

## 3. 🤔 什么是抽象类和抽象成员？

TypeScript 允许在类的定义前面，加上关键字 `abstract`，表示该类不能被实例化，只能当作其他类的模板。这种类就叫做"抽象类"（abstract class）：

```ts
abstract class A {
  id = 1
}

const a = new A() // 报错
```

抽象类的内部可以有已经实现好的属性和方法，也可以有还未实现的属性和方法。后者就叫做"抽象成员"（abstract member）：

```ts
abstract class A {
  abstract foo: string
  bar: string = ''
}

class B extends A {
  foo = 'b'
}
```
