# [0059. class 中的 implements](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0059.%20class%20%E4%B8%AD%E7%9A%84%20implements)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 如何在 class 中使用 implements？](#3--如何在-class-中使用-implements)
- [4. 🤔 可以一次实现多个接口吗？](#4--可以一次实现多个接口吗)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- implements 关键字

## 2. 🫧 评价

- 掌握 implements 的基本用法即可。

## 3. 🤔 如何在 class 中使用 implements？

- interface 接口或 type 别名，可以用对象的形式，为 class 指定一组检查条件。
- 然后，类使用 implements 关键字，表示当前类满足这些外部类型条件的限制。

```ts
interface Country {
  name: string
  capital: string
}

class MyCountry implements Country {
  name = ''
  capital = ''
}
```

## 4. 🤔 可以一次实现多个接口吗？

- 类可以实现多个接口（其实是接受多重限制），每个接口之间使用逗号分隔。

```ts
class Car implements MotorVehicle, Flyable, Swimmable {
  // ...
}
```
