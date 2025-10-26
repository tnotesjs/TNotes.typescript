# [0063. 子类重写父类同名方法](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0063.%20%E5%AD%90%E7%B1%BB%E9%87%8D%E5%86%99%E7%88%B6%E7%B1%BB%E5%90%8C%E5%90%8D%E6%96%B9%E6%B3%95)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 override 关键字有什么作用？](#3--override-关键字有什么作用)
- [4. 🔗 引用](#4--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- override
- noImplicitOverride

## 2. 🫧 评价

- todo

## 3. 🤔 override 关键字有什么作用？

TypeScript 4.3 引入了 override 关键字，明确表明作者的意图，就是要覆盖父类里面的同名方法：

```ts
class B extends A {
  override show() {
    // ...
  }
  override hide() {
    // ...
  }
}
```

TypeScript 又提供了一个编译参数 `noImplicitOverride`。一旦打开这个参数，子类覆盖父类的同名方法就会报错，除非使用了 override 关键字。

## 4. 🔗 引用

- [noImplicitOverride][1]

[1]: https://www.typescriptlang.org/tsconfig/#noImplicitOverride
