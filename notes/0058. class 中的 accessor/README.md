# [0058. class 中的 accessor](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0058.%20class%20%E4%B8%AD%E7%9A%84%20accessor)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 “存取器 accessor”是什么？](#3--存取器-accessor是什么)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- accessor => getter/setter

## 2. 🫧 评价

- todo

## 3. 🤔 “存取器 accessor”是什么？

- 存取器（accessor）是特殊的类方法，包括取值器（getter）和存值器（setter）两种方法。
- 命名惯例：通常用下划线前缀（如 \_name）表示内部私有字段，避免与 getter/setter 名称冲突。
- Getter（取值器）
  - 定义当读取某个属性时执行的逻辑。
  - 常用于暴露基于内部状态计算得出的值。
- Setter（存值器）
  - 定义当给某个属性赋值时执行的逻辑。
  - 可以在赋值时进行验证、日志记录、触发事件等
- 只读属性（Read-only）
  - 如果某个属性只有 `get` 方法，没有 `set` 方法，那么该属性自动成为只读属性。

::: code-group

```ts [1]
class C1 {
  _name = ''
  // 通常用下划线前缀（如 _name）表示内部私有字段，避免与 getter/setter 名称冲突。

  get name() {
    return this._name
  }
  set name(value) {
    this._name = value
  }
}
```

```ts [2]
// 下面的 _name 属性被声明为只读属性，不能修改：
class C2 {
  _name = 'foo'

  get name() {
    return this._name
  }
}

const c = new C2()
c.name = 'bar' // ❌ 报错
// Cannot assign to 'name' because it is a read-only property.(2540)
```

```ts [3]
// 暴露内部计算得出的结果：
class Rectangle {
  constructor(private width: number, private height: number) {}

  get area() {
    return this.width * this.height
  }
}

const rect = new Rectangle(4, 5)
console.log(rect.area) // 20
```

```ts [4]
// 在赋值时进行验证、日志记录、触发事件等：
class User {
  private _email = ''

  get email() {
    return this._email
  }

  set email(value: string) {
    if (!value.includes('@')) {
      throw new Error('无效的邮箱格式')
    }
    this._email = value
    console.log(`邮箱已更新为: ${value}`)
  }
}
```

:::
