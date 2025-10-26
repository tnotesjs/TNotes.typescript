# [0062. 类的三个可访问性修饰符](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0062.%20%E7%B1%BB%E7%9A%84%E4%B8%89%E4%B8%AA%E5%8F%AF%E8%AE%BF%E9%97%AE%E6%80%A7%E4%BF%AE%E9%A5%B0%E7%AC%A6)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是可访问性修饰符？](#3--什么是可访问性修饰符)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- public
- private
- protected

## 2. 🫧 评价

- todo

## 3. 🤔 什么是可访问性修饰符？

类的内部成员的外部可访问性，由三个可访问性修饰符（access modifiers）控制：`public`、`private` 和 `protected`。

`public` 修饰符表示这是公开成员，外部可以自由访问：

```ts
class Greeter {
  public greet() {
    console.log('hi!')
  }
}
```

`private` 修饰符表示私有成员，只能用在当前类的内部：

```ts
class A {
  private x: number = 0
}

const a = new A()
a.x // 报错
```

`protected` 修饰符表示该成员是保护成员，只能在类的内部使用该成员，实例无法使用该成员，但是子类内部可以使用：

```ts
class A {
  protected x = 1
}

class B extends A {
  getX() {
    return this.x
  }
}
```
