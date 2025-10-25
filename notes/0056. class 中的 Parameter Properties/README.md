# [0056. class 中的 Parameter Properties](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0056.%20class%20%E4%B8%AD%E7%9A%84%20Parameter%20Properties)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 “参数属性 Parameter Properties”是什么？](#3--参数属性-parameter-properties是什么)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- Parameter Properties

## 2. 🫧 评价

- Parameter Properties 就是一个 TS 为我们提供的语法糖

## 3. 🤔 “参数属性 Parameter Properties”是什么？

官方描述：

TypeScript offers special syntax for turning a constructor parameter into a class property with the same name and value. These are called parameter properties and are created by prefixing a constructor argument with one of the visibility modifiers public, private, protected, or readonly. The resulting field gets those modifier(s):

TypeScript 提供了一种特殊语法，可将构造函数参数转换为具有相同名称和值的类属性。这些被称为参数属性，通过在构造函数参数前添加可见性修饰符 public 、 private 、 protected 或 readonly 来创建。生成的字段将继承这些修饰符：

```ts
class Params {
  constructor(
    public readonly x: number,
    protected y: number,
    private z: number
  ) {
    // No body necessary
  }
}
const a = new Params(1, 2, 3)
console.log(a.x)
// 推断出 x 的类型是：
// (property) Params.x: number

console.log(a.z) // ❌ 报错
// Property 'z' is private and only accessible within class 'Params'.
```

---

实际开发中，很多实例属性的值，是通过构造方法传入的，传入之后再做初始化操作，比如下面这样：

```ts
// 写法 1
class Point {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}
```

由于日常开发中类似这样的代码实在太多了，显得太过冗余，为此，TypeScript 提供了一个语法糖：

```ts
// 写法 2
class Point {
  constructor(public x: number, public y: number) {}
}
```

两种写法是完全等效的。
