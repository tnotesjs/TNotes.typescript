# [0066. 类属性严格初始化](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0066.%20%E7%B1%BB%E5%B1%9E%E6%80%A7%E4%B8%A5%E6%A0%BC%E5%88%9D%E5%A7%8B%E5%8C%96)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 如何配置 TS 中类属性的严格初始化检查？](#3--如何配置-ts-中类属性的严格初始化检查)
- [4. 🤔 如何绕过严格初始化检查的报错？](#4--如何绕过严格初始化检查的报错)
  - [4.1. 在构造函数中初始化](#41-在构造函数中初始化)
  - [4.2. 在顶层声明时直接完成初始化](#42-在顶层声明时直接完成初始化)
  - [4.3. 使用非空断言](#43-使用非空断言)
  - [4.4. 使用可选属性](#44-使用可选属性)
  - [4.5. 使用 `| undefined`](#45-使用--undefined)
- [5. 🤔 `strictPropertyInitialization` 和 `strictNullChecks` 有什么关系？](#5--strictpropertyinitialization-和-strictnullchecks-有什么关系)
- [6. 🤔 抽象类中的抽象属性也会被严格初始化检查吗？](#6--抽象类中的抽象属性也会被严格初始化检查吗)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- strictPropertyInitialization
- strictNullChecks
- 抽象属性的特殊性

## 2. 🫧 评价

`strictPropertyInitialization` 是 TypeScript 中一个非常有用的严格模式选项，建议在实际开发中保持开启。

一些开发建议：

1. 保持开启：除非有特殊需求，否则建议保持 `strictPropertyInitialization: true` 和 `strictNullChecks: true`
2. 明确初始化：在构造函数或声明时明确初始化所有属性
3. 合理使用非空断言：仅在确实知道属性会被正确初始化时使用 `!` 断言
4. 考虑可选属性：对于真正可选的属性，使用 `?` 或 `| undefined` 更语义化

这样既能享受类型安全的好处，又能避免运行时的未定义错误。

## 3. 🤔 如何配置 TS 中类属性的严格初始化检查？

`strictPropertyInitialization` 配置决定了 TypeScript 如何处理未初始化的类属性。

无需配置，因为 `strictPropertyInitialization` 默认是打开的（实际开发中也是推荐开启的配置），因此默认就会检查类属性是否设置了初值，如果没有就报错。

```ts
class Point {
  x: number // ❌ 报错
  // Property 'x' has no initializer and is not definitely assigned in the constructor.(2564)
  y: number // ❌ 报错
  // Property 'y' has no initializer and is not definitely assigned in the constructor.(2564)
}
```

## 4. 🤔 如何绕过严格初始化检查的报错？

做法有很多，两种做法思路：

1. 按照要求对属性进行初始化
2. 告诉 TS 这个属性允许为空

### 4.1. 在构造函数中初始化

```ts
class Point {
  x: number // ✅ 正确
  y: number // ✅ 正确

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}
```

也可以使用类的参数属性语法来写：

```ts
class Point {
  constructor(public x: number, public y: number) {}
}
```

上述两种方式编译后得到的 JS 是一样的：

```js
'use strict'
class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}
```

### 4.2. 在顶层声明时直接完成初始化

```ts
class Point {
  x: number = 0 // ✅ 正确
  y: number = 0 // ✅ 正确
}

// 或者等效的简写形式：
class Point {
  x = 0 // ✅ 正确
  y = 0 // ✅ 正确
}
```

编译后的 JS 如下：

```js
'use strict'
class Point {
  constructor() {
    this.x = 0 // ✅ 正确
    this.y = 0 // ✅ 正确
  }
}
```

### 4.3. 使用非空断言

```ts
class Point {
  x!: number // ✅ 正确
  y!: number // ✅ 正确
}
```

### 4.4. 使用可选属性

```ts
class Point {
  x?: number // ✅ 正确
  y?: number // ✅ 正确
}
```

### 4.5. 使用 `| undefined`

```ts
class Point {
  x: number | undefined // ✅ 正确
  y: number | undefined // ✅ 正确
}
```

## 5. 🤔 `strictPropertyInitialization` 和 `strictNullChecks` 有什么关系？

`strictPropertyInitialization` 依赖于 `strictNullChecks`，当 `strictNullChecks` 关闭时，`strictPropertyInitialization` 也会失效。

`strictNullChecks` 的默认值也是 `true`。

```ts
// 当 strictNullChecks 关闭时
class Point {
  x: number // 不会报错
  y: number // 不会报错
}
```

## 6. 🤔 抽象类中的抽象属性也会被严格初始化检查吗？

抽象属性不受严格初始化检查，但非抽象属性仍然需要遵循初始化规则。

```ts
abstract class Base {
  abstract prop: string // 抽象属性不受严格初始化检查

  // 非抽象属性仍需初始化
  concreteProp: number // ❌ 报错
  // Property 'concreteProp' has no initializer and is not definitely assigned in the constructor.(2564)
}
```

在抽象类中：

1. 抽象成员必须在子类中实现，在抽象类中不允许实现抽象成员，只提供类型定义
2. 具体成员（非抽象成员）必须在抽象类中提供实现

上述规则跟是否启用类属性的严格初始化检查没有关系。

## 7. 🔗 引用

- [strictPropertyInitialization][1]

[1]: https://www.typescriptlang.org/tsconfig/#strictPropertyInitialization
