# [0035. class 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0035.%20class%20%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. Class 类型速览](#3-class-类型速览)
- [4. 什么是 TypeScript 中的类（class）？](#4-什么是-typescript-中的类class)
- [5. 如何声明类的属性类型？](#5-如何声明类的属性类型)
- [6. “类的方法类型”如何声明？](#6-类的方法类型如何声明)
- [7. 如何获取类的自身类型？](#7-如何获取类的自身类型)
- [8. 引用](#8-引用)

<!-- endregion:toc -->

## 1. 本节内容

- class 类型

## 2. 评价

本章主要介绍跟 Class 类相关的知识点。

## 3. Class 类型速览

<N :ids="['0066', '0056', '0057', '0058', '0059', '0060', '0061', '0062', '0064', '0063', '0055', '0065', '0111', '0114']" />

## 4. 什么是 TypeScript 中的类（class）？

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

## 5. 如何声明类的属性类型？

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

## 6. “类的方法类型”如何声明？

- 类的方法就是普通函数，类型声明方式与函数一致。
- 跟普通函数一样，可以使用可选参数、参数默认值、函数重载 …… 等写法。
- 函数类型声明的具体语法可以参考 `函数类型` 的相关笔记。

## 7. 如何获取类的自身类型？

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
  y: number,
): Point {
  return new PointClass(x, y)
}
```

## 8. 引用

- [Classes 类][1]

[1]: https://www.typescriptlang.org/docs/handbook/2/classes.html
