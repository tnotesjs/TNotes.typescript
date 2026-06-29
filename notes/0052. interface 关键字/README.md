# [0052. interface 关键字](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0052.%20interface%20%E5%85%B3%E9%94%AE%E5%AD%97)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 什么是 TypeScript 中的 `interface`？](#3-什么是-typescript-中的-interface)
- [4. `interface` 有哪些功能？](#4-interface-有哪些功能)
- [5. 使用 `interface` 有哪些最佳实践？](#5-使用-interface-有哪些最佳实践)
- [6. 引用](#6-引用)

<!-- endregion:toc -->

## 1. 本节内容

- interface
- type
- extends

## 2. 评价

- interface 关键字用于定义接口（也是一种类型），跟 type 关键字非常类似。

## 3. 什么是 TypeScript 中的 `interface`？

- `interface` 是 TypeScript 中最核心、最常用的类型声明机制之一，用于描述对象的结构（shape）。它不仅支持面向对象编程，还完美契合 TypeScript 的结构类型系统（Structural Typing），是构建类型安全、可维护代码的基石。
- `interface` 是 TypeScript 中定义"对象应该长什么样"的标准方式，它让代码既灵活又安全。
- `interface` 用于定义对象的契约（contract），描述一个对象必须包含哪些属性、方法及其类型。
- `interface` 相关的代码在 tsc 编译后会自动被移除。

核心要点：

| 关键点 | 说明 |
| --- | --- |
| 核心作用 | 描述对象的结构契约 |
| 最大优势（相较于 type） | 声明合并 + 继承 |
| 适用场景 | 公共 API、类契约、扩展全局类型 |
| 与 `type` 关系 | 互补：`interface` 用于对象结构，`type` 用于复杂类型组合 |
| 运行时 | 完全擦除，无性能开销 |

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

除了可选属性，`interface` 还有很多常见功能，下边儿会一一介绍。

## 4. `interface` 有哪些功能？

| 功能类别 | 语法示例 | 说明 | 备注 / 易错点 |
| --- | --- | --- | --- |
| `1` 可选属性 | `port?: number` | 属性可缺省 | 访问前最好收窄 |
| `2` 只读属性 | `readonly x: number` | 初始化后不可再赋值 | 仅编译期限制 |
| `3` 函数签名 | `interface F { (x: string): boolean }` | 描述可调用结构 | 可与对象属性并存 |
| `3` 方法签名 | `greet(): string` | 对象内部行为 | 不含实现体 |
| `4` 数字索引 | `[index: number]: string` | 数组 / 类数组 | 与数组类型等价语义 |
| `4` 字符串索引 | `[key: string]: string` | 字典 / 映射 | 注意与已有显式属性兼容性 |
| `5` 继承 extends | `interface A extends B, C {}` | 组合多个接口结构 | 多继承自动合并属性（还支持继承 type、class） |
| `6` 类实现 implements | `class D implements A {}` | 校验类结构契约 | 不注入运行时代码 |
| `7` 声明合并 | `interface X {a: string} interface X {b: number}` | 同名接口自动合并 | type 不支持 |
| `7` 类型扩展 | `interface Window { myApp: {...} }` | 增补环境类型，无需修改源码即可加属性，扩展第三方库 | 可能需放在 \*.d.ts |
| `8` 泛型接口 | `interface Box<T> { value: T }` | 抽象可复用结构 | 可配合约束 `T extends ...` |
| `9` 混合类型 | `interface Counter { (n: number): string; reset(): void; interval: number }` | 函数 + 属性 + 方法 | 常见于库设计 |
| `9` Hybrid 工厂 | `function getCounter(): Counter { ... }` | 返回复合形状 | 运行时需手动赋属性 |

::: code-group

```ts [1]
// 定义可选属性（Optional Properties）

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
// 定义只读属性（Readonly Properties）

// 用 readonly 标记属性为只读（初始化后不可修改）：
interface Point {
  readonly x: number // 只读
  readonly y: number // 只读
}

const p: Point = { x: 10, y: 20 }
p.x = 5 // ❌ 错误！Cannot assign to 'x' because it is a read-only property.
```

```ts [3]
// 定义函数签名或对象方法

// 函数类型接口：
interface SearchFunc {
  (source: string, subString: string): boolean
}

const mySearch: SearchFunc = (src, sub) => src.includes(sub)

// 对象方法：
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

```ts [4]
// 定义索引签名（Index Signatures）

// 用于描述动态属性的对象（如字典、映射）：
interface StringArray {
  [index: number]: string // 用数字索引访问 → string
  // 这里的 index 可以是 a、b、……
  // 没有任何实际的作用，只是提到一个语义提醒的目的，表示这是一个索引。
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

```ts [5]
// 【1】接口支持通过 extends 关键字继承其他接口

// 可以清晰表达接口之间的关系，更好地实现类型复用，避免重复代码。

interface Named {
  name: string
}

interface Aged {
  age: number
}

// 继承一个接口
interface Person_1 extends Named {
  email: string
}

// 等价于：
// interface Person_1 {
//   name: string
//   name: string
// }

// 继承多个接口
interface Person_2 extends Named, Aged {
  email: string
}

// 等价于：
// interface Person_2 {
//   name: string
//   age: number
//   email: string
// }

// ------------------------------------------------

// 【2】接口还可以继承 type

type Country = {
  name: string
  capital: string
}

interface CountryWithPop extends Country {
  population: number
}

// 等价于：
// interface CountryWithPop {
//   name: string;
//   capital: string;
//   population: number;
// }

// ------------------------------------------------

// 【3】接口还可以继承 class

class A {
  x: string = ''

  y(): boolean {
    return true
  }
}

interface B extends A {
  z: number
}

// 等价于：
// interface B {
//   x: string
//   y(): boolean
//   z: number
// }
```

```ts [6]
// 类可以用 implements 实现一个或多个接口
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
// 注意：
// implements 只检查结构，不强制私有/受保护成员
// 接口不能包含实现（只有签名）
```

```ts [7]
// 声明合并（Declaration Merging） —— interface 独有！

// 同名的 interface 会自动合并，这是 interface 相比 type 的最大优势之一。

// 在同一作用域多次声明
interface User {
  id: string
}

interface User {
  name: string
}

// 合并为：
// interface User {
//   id: string
//   name: string
// }

interface User {
  age: string
}
// 合并为：
// interface User {
//   age: string
//   id: string
//   name: string
// }

// 注意：如果出现重名属性，TS 要求必须是 same type 相同的类型，否则会报错。
interface User {
  // age: number // ❌
  // Subsequent property declarations must have the same type.  Property 'age' must be of type 'string', but here has type 'number'.(2717)
}

// 实战示例：扩展第三方库类型
// global.d.ts
interface Window {
  myApp: {
    version: string
  }
}

// 现在可以在任何地方使用
console.log(window.myApp.version) // ✅ 类型安全
```

```ts [8]
// 泛型接口（Generic Interfaces）

// 接口可以接受类型参数，实现灵活复用：
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

```ts [9]
// 混合类型工厂函数（Hybrid Factory）

// 定义混合类型接口
interface Counter {
  (start: number): string // 可调用
  interval: number // 属性
  reset(): void // 方法
}

// 工厂函数返回混合类型对象
function getCounter(): Counter {
  // 创建函数
  const counter = function (start: number) {
    return `Count: ${start}`
  } as Counter

  // 手动添加属性和方法
  counter.interval = 1000
  counter.reset = function () {
    console.log('Reset!')
  }

  return counter
}

// 使用
const myCounter = getCounter()
console.log(myCounter(5)) // "Count: 5" - 作为函数调用
console.log(myCounter.interval) // 1000 - 访问属性
myCounter.reset() // "Reset!" - 调用方法
```

:::

## 5. 使用 `interface` 有哪些最佳实践？

- 命名规范
  - 使用 PascalCase（如 `UserProfile`, `ApiResponse`）
  - 避免前缀 `I`（如 `IUser`）—— 这是 `C#` 风格，`TypeScript` 社区不推荐。
    - 关于这个前缀问题的讨论，在结尾有记录 Issues 链接，感兴趣可一去看看。
- 保持接口精简，一个接口只描述一个职责（单一职责原则），避免巨型接口（比如尽量避免 >10 个属性的接口）。
- 利用同名接口自动合并的功能，扩展接口（尤其是第三方接口），而不是直接修改接口源码模块。
- 为可选属性提供默认值，以免访问到空值。
- 避免深层继承链，优先使用组合（多继承）而非多个单继承。

```ts
// 组合（多继承） 推荐
interface A extends B, C {
  name: string
}

// 多个单继承 不推荐
interface B extends C {}
interface A extends B {}
```

## 6. 引用

- [TypeScript-Handbook][2]
- [Prohibition against prefixing interfaces with "I"][1]
  - 禁止在接口名前加前缀 "I"
- [阮一峰 - TypeScript 的 interface 接口][3]

[1]: https://github.com/microsoft/TypeScript-Handbook/issues/121
[2]: https://github.com/microsoft/TypeScript-Handbook
[3]: https://wangdoc.com/typescript/interface
