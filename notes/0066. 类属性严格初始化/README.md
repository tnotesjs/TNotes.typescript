# [0066. 类属性严格初始化](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0066.%20%E7%B1%BB%E5%B1%9E%E6%80%A7%E4%B8%A5%E6%A0%BC%E5%88%9D%E5%A7%8B%E5%8C%96)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 `strictPropertyInitialization` 配置有什么用？](#3--strictpropertyinitialization-配置有什么用)
- [4. 🔗 引用](#4--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- strictPropertyInitialization

## 2. 🫧 评价

- todo

## 3. 🤔 `strictPropertyInitialization` 配置有什么用？

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

## 4. 🔗 引用

- [strictPropertyInitialization][1]

[1]: https://www.typescriptlang.org/tsconfig/#strictPropertyInitialization
