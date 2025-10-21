# [0052. interface 关键字](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0052.%20interface%20%E5%85%B3%E9%94%AE%E5%AD%97)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是 TypeScript 中的 `interface`？](#3--什么是-typescript-中的-interface)
- [4. 🤔 `interface` 有哪些核心特性？](#4--interface-有哪些核心特性)
  - [4.1. 函数类型与方法](#41-函数类型与方法)
  - [4.2. 索引签名（Index Signatures）](#42-索引签名index-signatures)
- [5. 🤔 `interface` 如何实现继承？](#5--interface-如何实现继承)
- [6. 🤔 如何在类中实现接口？](#6--如何在类中实现接口)
- [7. 🤔 `interface` 有什么高级特性？](#7--interface-有什么高级特性)
  - [7.1. 声明合并（Declaration Merging）—— interface 独有！](#71-声明合并declaration-merging-interface-独有)
  - [7.2. 泛型接口（Generic Interfaces）](#72-泛型接口generic-interfaces)
  - [7.3. 混合类型接口（Hybrid Types）](#73-混合类型接口hybrid-types)
- [8. 🤔 `interface` 和 `type` 有什么区别？](#8--interface-和-type-有什么区别)
- [9. 🤔 使用 `interface` 有哪些最佳实践？](#9--使用-interface-有哪些最佳实践)
  - [9.1. 命名规范](#91-命名规范)
  - [9.2. 保持接口精简](#92-保持接口精简)
  - [9.3. 优先使用组合而非继承](#93-优先使用组合而非继承)
  - [9.4. 为可选属性提供默认值](#94-为可选属性提供默认值)
  - [9.5. 用 `interface` 扩展全局类型](#95-用-interface-扩展全局类型)
- [10. 🤔 使用 `interface` 有哪些常见误区？](#10--使用-interface-有哪些常见误区)
  - [10.1. 误区 1：`interface` 和 `class` 是绑定的](#101-误区-1interface-和-class-是绑定的)
  - [10.2. 误区 2：`interface` 会生成运行时代码](#102-误区-2interface-会生成运行时代码)
  - [10.3. 误区 3：必须用 `implements` 才能使用接口](#103-误区-3必须用-implements-才能使用接口)
- [11. 🤔 如何总结 `interface` 的核心要点？](#11--如何总结-interface-的核心要点)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- interface
- type

## 2. 🫧 评价

- interface 关键字用于定义接口（也是一种类型），跟 type 关键字非常类似。

## 3. 🤔 什么是 TypeScript 中的 `interface`？

`interface` 是 TypeScript 中最核心、最常用的类型声明机制之一，用于描述对象的结构（shape）。它不仅支持面向对象编程，还完美契合 TypeScript 的结构类型系统（Structural Typing），是构建类型安全、可维护代码的基石。

`interface` 用于定义对象的契约（contract），描述一个对象必须包含哪些属性、方法及其类型。

基本使用示例：

```ts
interface User {
  id: string
  name: string
  email: string
  isActive?: boolean // 可选属性
}
// 每一行结尾的分号或逗号，可加可不加

const alice: User = {
  id: '1',
  name: 'Alice',
  email: 'alice@example.com',
  // isActive 可省略（因为是可选的）
}

// 注解：
// 所有必需属性必须存在
// 可选属性（带 ?）可以省略
// 对象可以有额外属性（除非是对象字面量）
```

上面的例子中，`User` 接口定义了一个对象，对象包含 `id`、`name`、`email` 和 `isActive` 四个属性。其中 `isActive` 属性是可选的。

除了可选属性，`interface` 还有很多核心特性，下边儿会一一介绍。

## 4. 🤔 `interface` 有哪些核心特性？

::: code-group

```ts [1]
// 可选属性（Optional Properties）

// 用 ? 标记属性为可选：
interface Config {
  host: string // 必需
  port?: number // 可选
  ssl?: boolean // 可选
}

// 使用时需注意类型收窄：
function connect(config: Config) {
  if (config.port) {
    // 进入这个作用域，TS 就能准确推断：
    // config.port 类型是 number（非 undefined）
  }
}
```

```ts [2]
// 只读属性（Readonly Properties）

// 用 readonly 标记属性为只读（初始化后不可修改）：
interface Point {
  readonly x: number // 只读
  readonly y: number // 只读
}

const p: Point = { x: 10, y: 20 }
p.x = 5 // ❌ 错误！Cannot assign to 'x' because it is a read-only property.
```

:::

### 4.1. 函数类型与方法

`interface` 可以描述函数签名或对象方法：

函数类型接口：

```ts
interface SearchFunc {
  (source: string, subString: string): boolean
}

const mySearch: SearchFunc = (src, sub) => src.includes(sub)
```

对象方法：

```ts
interface User {
  name: string
  greet(): string // 方法签名
}

const user: User = {
  name: 'Alice',
  greet() {
    return `Hello, ${this.name}`
  },
}
```

### 4.2. 索引签名（Index Signatures）

用于描述动态属性的对象（如字典、映射）：

```ts
interface StringArray {
  [index: number]: string // 用数字索引访问 → string
}

const arr: StringArray = ['a', 'b', 'c']
console.log(arr[0]) // "a"

// 字符串索引签名
interface PhoneBook {
  [name: string]: string // 任意字符串键 → string 值
}

const contacts: PhoneBook = {
  Alice: '123-456',
  Bob: '789-012',
}
```

## 5. 🤔 `interface` 如何实现继承？

`interface` 支持多继承，用 `extends` 关键字：

```ts
interface Named {
  name: string
}

interface Aged {
  age: number
}

interface Person extends Named, Aged {
  email: string
}

// 等价于：
// interface Person {
//   name: string;
//   age: number;
//   email: string;
// }
```

优势：清晰表达"组合"关系，避免重复代码。

## 6. 🤔 如何在类中实现接口？

类可以用 `implements` 实现一个或多个接口：

```ts
interface Flyable {
  fly(): void
}

interface Swimmable {
  swim(): void
}

class Duck implements Flyable, Swimmable {
  fly() {
    console.log('Flying!')
  }
  swim() {
    console.log('Swimming!')
  }
}
```

注意：

- `implements` 只检查结构，不强制私有/受保护成员
- 接口不能包含实现（只有签名）

## 7. 🤔 `interface` 有什么高级特性？

### 7.1. 声明合并（Declaration Merging）—— interface 独有！

同名的 `interface` 会自动合并，这是 `interface` 相比 `type` 的最大优势之一。

```ts
// 在同一作用域多次声明
interface User {
  id: string
}

interface User {
  name: string
}

// 合并为：
// interface User {
//   id: string;
//   name: string;
// }
```

实战：扩展第三方库类型

```ts
// global.d.ts
interface Window {
  myApp: {
    version: string
  }
}

// 现在可以在任何地方使用
console.log(window.myApp.version) // ✅ 类型安全
```

### 7.2. 泛型接口（Generic Interfaces）

接口可以接受类型参数，实现灵活复用：

```ts
interface Repository<T> {
  save(entity: T): void
  findById(id: string): T | undefined
}

// 使用
const userRepo: Repository<User> = {
  save(user) {
    /* ... */
  },
  findById(id) {
    /* ... */
  },
}
```

### 7.3. 混合类型接口（Hybrid Types）

一个接口可以同时描述函数和对象（常见于 JS 库）：

```ts
interface Counter {
  (start: number): string // 可调用
  interval: number // 属性
  reset(): void // 方法
}

function getCounter(): Counter {
  const counter = (start: number) => String(start)
  counter.interval = 123
  counter.reset = () => {}
  return counter
}
```

## 8. 🤔 `interface` 和 `type` 有什么区别？

| 特性 | `interface` | `type` |
| --- | --- | --- | --- |
| 定义对象结构 | ✅ | ✅ |
| 继承（`extends`） | ✅ | ❌（需用 `&` 交叉类型） |
| 声明合并 | ✅ | ❌ |
| 定义联合类型 | ❌ | ✅（`type Status = "ok" | "error"`） |
| 定义元组 | ❌ | ✅（`type Point = [number, number]`） |
| 定义原始类型别名 | ❌ | ✅（`type ID = string`） |
| 计算属性（Mapped Types） | ❌ | ✅ |
| 调试显示 | 显示结构 | 显示别名（可展开） |

官方建议（TypeScript Handbook）： "尽可能使用 `interface`，除非你需要 `type` 的特定功能。"

推荐场景：

- 用 `interface`：公共 API 的对象结构、需要继承或声明合并的场景、描述类实现的契约
- 用 `type`：联合类型、元组、原始类型别名、复杂类型操作（如工具类型）、一次性类型定义

## 9. 🤔 使用 `interface` 有哪些最佳实践？

### 9.1. 命名规范

- 使用 PascalCase（如 `UserProfile`, `ApiResponse`）
- 避免前缀 `I`（如 `IUser`）—— 这是 C# 风格，TypeScript 社区不推荐

### 9.2. 保持接口精简

- 一个接口只描述一个职责（单一职责原则）
- 避免巨型接口（>10 个属性）

### 9.3. 优先使用组合而非继承

```ts
// 好：组合
interface User extends Identifiable, Timestamped {
  name: string
}

// 避免深层继承链
```

### 9.4. 为可选属性提供默认值

```ts
function processUser(user: User) {
  const isActive = user.isActive ?? true // 提供默认值
}
```

### 9.5. 用 `interface` 扩展全局类型

```ts
// types/global.d.ts
export {} // 确保是模块

declare global {
  interface Array<T> {
    chunk(size: number): T[][]
  }
}
```

## 10. 🤔 使用 `interface` 有哪些常见误区？

### 10.1. 误区 1：`interface` 和 `class` 是绑定的

→ 错误！`interface` 只是描述结构，任何满足结构的对象都兼容，无论是否是类实例。

### 10.2. 误区 2：`interface` 会生成运行时代码

→ 错误！所有类型信息在编译后都会被擦除，`interface` 零运行时开销。

### 10.3. 误区 3：必须用 `implements` 才能使用接口

→ 错误！结构兼容即可：

```ts
interface Point {
  x: number
  y: number
}
const p = { x: 1, y: 2 } // 无需 implements，直接兼容 Point
```

## 11. 🤔 如何总结 `interface` 的核心要点？

| 关键点         | 说明                                                    |
| -------------- | ------------------------------------------------------- |
| 核心作用       | 描述对象的结构契约                                      |
| 最大优势       | 声明合并 + 继承                                         |
| 适用场景       | 公共 API、类契约、扩展全局类型                          |
| 与 `type` 关系 | 互补：`interface` 用于对象结构，`type` 用于复杂类型组合 |
| 运行时         | 完全擦除，无性能开销                                    |

一句话记住： **`interface` 是 TypeScript 中定义"对象应该长什么样"的标准方式，它让代码既灵活又安全**。
