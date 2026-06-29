# [0059. 类实现接口](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0059.%20%E7%B1%BB%E5%AE%9E%E7%8E%B0%E6%8E%A5%E5%8F%A3)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. implements 是什么？](#3-implements-是什么)
- [4. 类（class）实现（implements）的接口必须是使用 interface 来定义的吗？](#4-类class实现implements的接口必须是使用-interface-来定义的吗)
- [5. 一个类（class）实现多个接口的语法规则是？](#5-一个类class实现多个接口的语法规则是)
  - [5.1. 基本语法](#51-基本语法)
  - [5.2. 示例：常见用法](#52-示例常见用法)
  - [5.3. 示例：特殊情况 - 多个接口中有同名但类型不兼容的成员](#53-示例特殊情况---多个接口中有同名但类型不兼容的成员)
  - [5.4. 注意事项](#54-注意事项)

<!-- endregion:toc -->

## 1. 本节内容

- implements 关键字
- 实现多个接口时同名字段冲突的处理方案

## 2. 评价

- 掌握 implements 的基本用法即可。
- implements 的基本用法很简单，但是在特殊情况下，也就是在实现多个接口时，可能会存在相同字段类型不兼容的特殊情况，此时需要对这些冲突的字段做特殊处理才行。

## 3. implements 是什么？

`implements` 是 TypeScript 中的一个关键字，用于表示一个类遵循或实现了一个或多个接口的契约。它的主要含义包括：

- 实现契约：`implements` 表示当前类承诺实现接口中定义的所有属性和方法
- 类型检查：TypeScript 编译器会检查该类是否真正实现了接口要求的所有成员
- 多重约束：一个类可以同时实现多个接口，以满足不同的类型要求

```ts
interface Country {
  name: string
  capital: string
}

// 使用 implements 关键字表明 MyCountry 类实现了 Country 接口
class MyCountry implements Country {
  name = ''
  capital = ''
}
```

在这个例子中，`MyCountry` 类通过 `implements Country` 声明它将实现 `Country` 接口中定义的所有属性（`name` 和 `capital`）。如果类没有正确实现接口的所有成员，TypeScript 会在编译时报错。

## 4. 类（class）实现（implements）的接口必须是使用 interface 来定义的吗？

不是的，class 实现的接口不仅可以是使用 `interface` 定义的，也可以是使用 `type` 关键字定义的类型别名。

具体来说：

- interface 定义的接口：这是最常见的形式，专门用于定义对象的结构
- type 定义的类型别名：只要该类型别名描述的是一个对象结构，也可以被 class 实现

```ts
// 使用 interface 定义接口
interface Country {
  name: string
  capital: string
}

// 使用 type 定义类型别名
type Person = {
  name: string
  age: number
}

// class 可以同时 implements interface 和 type
class MyCountry implements Country, Person {
  name = ''
  capital = ''
  age = 0
}
```

需要注意的是，如果 `type` 定义的是原始类型（如 `string`、`number`）或者联合类型等非对象结构，则不能被 class 实现：

```ts
type Name = string

// 下面这样是不允许的：
class MyName implements Name {} // ❌ 错误！
// A class can only implement an object type or intersection of object types with statically known members.(2422)
```

## 5. 一个类（class）实现多个接口的语法规则是？

一个类实现多个接口的语法规则如下：

- 使用 `implements` 关键字后跟多个接口名称
- 多个接口之间使用逗号 `,` 分隔
- 类必须实现所有接口中定义的属性和方法

### 5.1. 基本语法

```ts
class ClassName implements Interface1, Interface2, Interface3 {
  // 实现所有接口中的成员
}
```

### 5.2. 示例：常见用法

```ts
interface Flyable {
  fly(): void
}

interface Swimmable {
  swim(): void
}

interface Walkable {
  walk(): void
}

// 实现多个接口
class Duck implements Flyable, Swimmable, Walkable {
  fly() {
    console.log('Duck is flying')
  }

  swim() {
    console.log('Duck is swimming')
  }

  walk() {
    console.log('Duck is walking')
  }

  // 缺少任何一个都会导致报错，比如将 walk 注释掉，会报错提示：
  // Class 'Duck' incorrectly implements interface 'Walkable'.
  // Property 'walk' is missing in type 'Duck' but required in type 'Walkable'.(2420)
}
```

### 5.3. 示例：特殊情况 - 多个接口中有同名但类型不兼容的成员

当一个类实现多个接口时，如果这些接口中有同名但类型不兼容的成员，会导致编译错误。以下是一个具体示例：

```ts
interface A {
  name: string
  age: number
}

interface B {
  name: number // 与接口 A 中的 name 类型不兼容
  height: number
}

// ❌ 错误：无法同时实现这两个接口，因为 name 属性类型冲突
/* class MyClass implements A, B {
  name: string = 'Tom' // ❌
  // Property 'name' in type 'MyClass' is not assignable to the same property in base type 'B'.
  // Type 'string' is not assignable to type 'number'.(2416)
  age: number = 18
  height: number = 180
} */
```

解决方案：

1. 修改接口定义：确保同名属性具有兼容的类型
2. 使用类型交集：通过更复杂的类型操作解决冲突

::: code-group

```ts [1]
// 方案1：统一类型
interface A1 {
  name: string
  age: number
}

interface B1 {
  name: string // 类型保持一致
  height: number
}

class MyClass1 implements A1, B1 {
  name: string = 'Tom'
  age: number = 18
  height: number = 180
}
```

```ts [2]
// 方案2：使用联合类型
interface A2 {
  name: string | number // 支持多种类型
  age: number
}

interface B2 {
  name: string | number // 类型保持一致
  height: number
}

class MyClass2 implements A2, B2 {
  name: string | number = 'Tom'
  age: number = 18
  height: number = 180
}
```

:::

关键点：

- 同名属性必须具有兼容的类型才能在同一个类中实现

### 5.4. 注意事项

- 类必须实现所有被 implements 的接口中的所有成员
- 如果有同名但类型不兼容的成员，需要特别处理
- 可以同时使用 `interface` 和 `type` 定义的类型进行 implements
