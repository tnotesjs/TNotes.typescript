# [0061. 类的静态成员](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0061.%20%E7%B1%BB%E7%9A%84%E9%9D%99%E6%80%81%E6%88%90%E5%91%98)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 “类的静态成员”是什么？](#3--类的静态成员是什么)
- [4. 🤔 静态成员是否可以跟实例成员同名？](#4--静态成员是否可以跟实例成员同名)
- [5. 🤔 “类的静态成员”如何定义？](#5--类的静态成员如何定义)
  - [5.1. static 关键字](#51-static-关键字)
  - [5.2. 可以声明的同时完成初始化](#52-可以声明的同时完成初始化)
  - [5.3. 可以先声明后初始化](#53-可以先声明后初始化)
  - [5.4. 可以使用 `Object.defineProperty` 定义](#54-可以使用-objectdefineproperty-定义)
  - [5.5. 开发建议](#55-开发建议)
- [6. 🤔 静态成员可以是抽象的吗？](#6--静态成员可以是抽象的吗)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 静态成员
- 实例成员
- static 关键字

## 2. 🫧 评价

静态成员是属于类本身的成员，需要在类中使用 static 关键字在类中声明静态成员的类型。

静态成员初始化的不同阶段：

1. 可以在类中完成类型声明的时候同时进行（推荐做法）；
2. 也可以在类中完成类型声明之后再在类的外部对其进行初始化（不推荐）；

## 3. 🤔 “类的静态成员”是什么？

类的静态成员是属于类本身而不是类实例的属性或方法。它们与类的特定实例无关，而是与类整体相关联。

主要特点：

- 属于类本身：静态成员通过类名直接访问，不需要创建类的实例
- 内存唯一性：静态成员在内存中只有一份拷贝
- 访问方式：通过 `类名.成员名` 的方式访问

常见的使用场景包括：

- 工具方法（如数学计算、数据转换等）
- 计数器（统计实例数量）
- 配置信息（全局共享的配置）
- 工厂方法（创建类实例的特殊方法）

与实例成员的区别：

- 实例成员需要通过 `new` 创建实例后才能访问，静态成员直接通过类名访问；
- 实例成员每个实例都有独立的副本，静态成员只有一份，在所有实例间共享；

## 4. 🤔 静态成员是否可以跟实例成员同名？

是的，静态成员可以与实例成员同名。

- 静态成员属于类本身，通过类名访问
- 实例成员属于类的实例，通过实例访问
- 即使名称相同，它们也是完全独立的成员

示例代码：

```ts
class MyClass {
  static x = 0 // 静态属性
  x = 1 // 实例属性（同名）

  static getX() {
    // 静态方法
    return MyClass.x // 访问静态属性
  }

  getX() {
    // 实例方法（同名）
    return this.x // 访问实例属性
  }
}

// 访问静态成员
MyClass.x // 0
MyClass.getX() // 0

// 访问实例成员
const instance = new MyClass()
instance.x // 1
instance.getX() // 1
```

注意：虽然技术上允许同名，但在实际开发中应避免这种做法，因为可能会造成混淆和误解。建议使用清晰明确的命名来区分静态成员和实例成员。

## 5. 🤔 “类的静态成员”如何定义？

“类的静态成员”的定义方式有很多，主要掌握一些常见的写法即可。

### 5.1. static 关键字

类的内部可以使用 `static` 关键字，定义静态成员。

### 5.2. 可以声明的同时完成初始化

```ts
class MyClass {
  static x = 0
  static printX() {
    console.log(MyClass.x)
  }
}
```

编译后的 JS 如下：

```js
'use strict'
class MyClass {
  static printX() {
    console.log(MyClass.x)
  }
}
MyClass.x = 0
```

### 5.3. 可以先声明后初始化

TypeScript 也支持在类声明之后再添加静态成员。

```ts
class MyClass {
  static x = 0

  // 需要提前声明：
  static y: number
  static printValues: () => void
}

// 延迟初始化静态成员：
// 初始化静态属性
MyClass.y = 1
// 初始化静态方法
MyClass.printValues = function () {
  console.log(MyClass.x, MyClass.y)
}
```

编译后的 JS 如下：

```js
'use strict'
class MyClass {}
MyClass.x = 0
// 延迟初始化静态成员：
// 初始化静态属性
MyClass.y = 1
// 初始化静态方法
MyClass.printValues = function () {
  console.log(MyClass.x, MyClass.y)
}
```

注意：类型声明不能少，否则会报错。

```ts
class MyClass {
  static x = 0
}

// ❌ 报错
MyClass.y = 1
// Property 'y' does not exist on type 'typeof MyClass'.(2339)

// ❌ 报错
MyClass.printValues = function () {
  console.log(MyClass.x, MyClass.y)
}
// Property 'printValues' does not exist on type 'typeof MyClass'.(2339)
```

### 5.4. 可以使用 `Object.defineProperty` 定义

```ts
class MyClass {
  static staticProperty: string
}

Object.defineProperty(MyClass, 'staticProperty', {
  value: 'Hello World',
  writable: true,
  enumerable: true,
  configurable: true,
})

console.log(MyClass.staticProperty) // 输出: Hello World

// 如果 MyClass 中没有 staticProperty 的类型定义，会报错：
// Property 'staticProperty' does not exist on type 'typeof MyClass'.(2339)
```

这种原始的做法就尽量不要在 TS 中使用了，TS 语言服务的静态检查不支持这种写法的类型推导。比如，你可以将 `staticProperty` 设置为 `number` 类型，然后观察程序是否会在执行 `Object.defineProperty` 语句的时候报错。

```ts
class MyClass {
  static staticProperty: number
}

// MyClass.staticProperty = 'Hello World' // ❌ 报错
// 这么写会报错：Type 'string' is not assignable to type 'number'.(2322)

// ✅ 不报错
Object.defineProperty(MyClass, 'staticProperty', {
  value: 'Hello World',
  writable: true,
  enumerable: true,
  configurable: true,
})

console.log(MyClass.staticProperty)
```

`Object.defineProperty` 写起来即麻烦又危险，非必要情况，能不用就不用。

### 5.5. 开发建议

1. 建议优先在类声明中直接定义静态成员并完成初始化
2. 延迟定义可能会影响代码的可读性和维护性，非必要尽可能不要将静态类型定义和类的定义分割开

## 6. 🤔 静态成员可以是抽象的吗？

不可以，TypeScript 不支持抽象静态成员。

`static` 和 `abstract` 修饰符不能同时使用在同一成员上，如果组合使用，会报错！

```ts
abstract class BaseClass {
  static abstract typeName: string // ❌ 报错
  // 'static' modifier cannot be used with 'abstract' modifier.(1243)
  static abstract createInstance(): any // ❌ 报错
  // 'static' modifier cannot be used with 'abstract' modifier.(1243)
}
```
