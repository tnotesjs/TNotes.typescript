# [0060. 类中的只读属性](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0060.%20%E7%B1%BB%E4%B8%AD%E7%9A%84%E5%8F%AA%E8%AF%BB%E5%B1%9E%E6%80%A7)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 “只读属性”如何声明？](#3--只读属性如何声明)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- readonly

## 2. 🫧 评价

- 知道“只读属性”如何声明即可。

## 3. 🤔 “只读属性”如何声明？

- 属性名前面加上 readonly 修饰符，就表示该属性是只读的，实例对象不能修改这个属性。

```ts
class A {
  readonly id = 'foo'
}

const a = new A()
a.id = 'bar' // ❌ 报错
// Cannot assign to 'id' because it is a read-only property.(2540)
```
