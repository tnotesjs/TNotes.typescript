# [0056. 类中的参数属性](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0056.%20%E7%B1%BB%E4%B8%AD%E7%9A%84%E5%8F%82%E6%95%B0%E5%B1%9E%E6%80%A7)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 “参数属性 Parameter Properties”是什么？](#3--参数属性-parameter-properties是什么)
- [4. 🤔 “Parameter Properties”是必要的吗？](#4--parameter-properties是必要的吗)
- [5. 🤔 参数属性和普通属性可以共存吗？](#5--参数属性和普通属性可以共存吗)
  - [5.1. 💻 demos.1 - 参数属性和普通属性冲突，听谁的？](#51--demos1---参数属性和普通属性冲突听谁的)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- Parameter Properties 参数属性

## 2. 🫧 评价

Parameter Properties 就是一个 TS 为我们提供的语法糖，你需要写如下代码：

```ts
class Point {
  constructor(public x: number, public y: number) {}
}
```

TS 编译后会转化为下面这样的 JS 程序：

```js
'use strict'
class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}
```

需要注意的小细节：如果普通属性进行了初始化，同时又使用了参数属性，那么普通属性的初始化结果会覆盖参数属性的初始化结果。

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

## 4. 🤔 “Parameter Properties”是必要的吗？

“Parameter Properties”不是必要的，它本质上是 TS 给我们提供的一个语法糖，这颗糖你吃或者不吃都 OK。

- 如果你觉得你的程序中含有大量类似下面写法 1 这样的程序，可以考虑使用 Parameter Properties 语法糖来简化。
- 如果你觉得使用 Parameter Properties 语法糖会影响到程序的可读性，那就用传统写法即可。

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

两种写法是完全等效的，它们编译后得到的 JS 如下：

```js
'use strict'
class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}
```

::: tip 💡 开发建议

在项目中最好统一使用规范，如果确定要使用这种写法，那么在项目里所有类中都优先使用这种写法，反之，则使用传统写法。

:::

## 5. 🤔 参数属性和普通属性可以共存吗？

不允许共存，会报错。

```ts
class Point {
  x: number = 1 // 普通属性
  constructor(
    public x: number, // 参数属性
    // ❌ 报错：Duplicate identifier 'x'.(2300)
    public y: number
  ) {}
}
```

思考一个问题：如果上述程序我们对它进行编译，使用 `tsc` 对它进行编译，最终的 x 是 1 还是创建实例的时候传入的 x 呢？

答案是 `1`

下面我们写一个 demo 来快速验证一下。

### 5.1. 💻 demos.1 - 参数属性和普通属性冲突，听谁的？

初始化：

```bash
# 准备一个空文件夹，将上述示例复制到 1.ts 文件中。
pnpm init # 初始化项目
pnpm i typescript -D # 安装 typescript
npx tsc --init # 初始化 tsconfig.json
tsc 1.ts # 编译 1.ts
```

下面是使用 TS 自动生成的配置文件编译后得到的 JS 程序，以及编译前的 TS 程序。

::: code-group

<<< ./demos/1/1.ts {}

<<< ./demos/1/1.js {}

<<< ./demos/1/tsconfig.json {}

:::

从编译结果来看，你会发现参数属性的写法 `this.x = x;` 生成在前边儿，普通属性的写法 `this.x = 1;` 生成在了后边儿。
