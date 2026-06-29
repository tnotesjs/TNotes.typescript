# [0062. 类的三个可访问性修饰符](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0062.%20%E7%B1%BB%E7%9A%84%E4%B8%89%E4%B8%AA%E5%8F%AF%E8%AE%BF%E9%97%AE%E6%80%A7%E4%BF%AE%E9%A5%B0%E7%AC%A6)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. TypeScript 类中的 public、private 和 protected 修饰符有什么作用？](#3-typescript-类中的-publicprivate-和-protected-修饰符有什么作用)
- [4. 访问性修饰符书写在什么位置？](#4-访问性修饰符书写在什么位置)
  - [4.1. 写在声明前面](#41-写在声明前面)
  - [4.2. 在类的构造函数参数中直接使用 public/private/protected](#42-在类的构造函数参数中直接使用-publicprivateprotected)
- [5. public 是不是必须显式写出？不写访问修饰符默认是什么？](#5-public-是不是必须显式写出不写访问修饰符默认是什么)
- [6. private 修饰的成员真的完全无法从外部访问吗？](#6-private-修饰的成员真的完全无法从外部访问吗)
- [7. “TS 的 private” vs. “ES 的 `#私有字段`”](#7-ts-的-private-vs-es-的-私有字段)
  - [7.1. 对比](#71-对比)
  - [7.2. ES `#私有字段` 对 `target` 编译目标的要求](#72-es-私有字段-对-target-编译目标的要求)
- [8. 社区目前（2025）更推荐使用 `#私有字段` 还是 TypeScript 的 `private` 修饰符？](#8-社区目前2025更推荐使用-私有字段-还是-typescript-的-private-修饰符)
  - [8.1. 决策指南](#81-决策指南)
  - [8.2. 实践趋势](#82-实践趋势)
  - [8.3. 最佳实践](#83-最佳实践)
- [9. protected 和 private 有什么区别？什么时候用 protected？](#9-protected-和-private-有什么区别什么时候用-protected)
- [10. 构造函数也可以用 private 或 protected 吗？有什么用？](#10-构造函数也可以用-private-或-protected-吗有什么用)
- [11. 接口或类型定义中能使用 private/protected 吗？](#11-接口或类型定义中能使用-privateprotected-吗)
- [12. 引用](#12-引用)

<!-- endregion:toc -->

## 1. 本节内容

- access modifiers
- public
- private
- protected
- 参数属性 - parameter property

## 2. 评价

public、private 和 protected 是访问修饰符（access modifiers），它们是 TS 中特有的，编译产物 JS 中会自动移除。

访问修饰符提供的约束也仅仅停留在 TS 层面，对运行时的 JS 无影响。

当你在开发 TS 项目时，书写类的时候可以利用这些修饰符来约束相关成员的访问权限。

## 3. TypeScript 类中的 public、private 和 protected 修饰符有什么作用？

在 TypeScript 中，public、private 和 protected 是访问修饰符（access modifiers），用于控制类成员（属性和方法）的可见性和可访问性。它们帮助开发者封装数据、隐藏实现细节，并明确类的使用契约。

- public（默认）：成员可以在任何地方被访问，包括类内部、子类和类的实例。
- private：成员只能在声明它的类内部访问，不能在子类或类外部访问。
- protected：成员可以在声明它的类内部以及其子类中访问，但不能在类外部（包括实例）访问。

这些修饰符只在 TypeScript 编译期起作用，编译成 JavaScript 后不会保留访问限制（因为 JavaScript 本身在较新标准前没有原生私有成员支持，不过现代 JS 有 #private 语法，但 TS 的 private 与之不同）。

## 4. 访问性修饰符书写在什么位置？

1. 写在声明前面（常见）
2. 在类的构造函数参数中直接使用 public/private/protected（TS 提供的语法糖，可根据团队开发规范选择是否在项目中使用）

### 4.1. 写在声明前面

可以在类中定义成员变量的时候，将访问修饰符书写在成员名称前面。

```ts
// public 修饰符表示这是公开成员，外部可以自由访问：
class Greeter {
  public greet() {
    console.log('hi!')
  }
}
```

```ts
// private 修饰符表示私有成员，只能用在当前类的内部：
class A {
  private x: number = 0
}

const a = new A()
a.x // 报错
```

```ts
// protected 修饰符表示该成员是保护成员，只能在类的内部使用该成员，
// 实例无法使用该成员，但是子类内部可以使用：
class A {
  protected x = 1
}

class B extends A {
  getX() {
    return this.x
  }
}
```

也可以在类的方法参数中直接使用 public/private/protected，这是 TS 提供的定义属性的语法糖 - 参数属性。

### 4.2. 在类的构造函数参数中直接使用 public/private/protected

TypeScript 支持在构造函数参数上直接添加访问修饰符，这称为参数属性（parameter properties）。它会自动在类中声明同名属性并初始化。

例如：

```ts
class User {
  constructor(
    public name: string, // 等价于 this.name = name; 且声明 public name: string
    private email: string, // 等价于 this.email = email; 且声明 private email: string
  ) {}
}
```

这相当于：

```ts
class User {
  public name: string
  private email: string
  constructor(name: string, email: string) {
    this.name = name
    this.email = email
  }
}
```

这种写法简洁高效，常用于依赖注入或初始化大量属性的场景。是 TS 给我们提供的语法糖。

## 5. public 是不是必须显式写出？不写访问修饰符默认是什么？

public 必显式写出，写或者不写 public 效果都是一样的。

在 TypeScript 中，如果不显式指定访问修饰符，默认就是 public。

例如：

```ts
class Person {
  name: string // 等价于 public name: string;
  public age: number // 显式声明为 public
}
```

这两种写法在行为上完全一致，都可以在类内外自由访问。

具体是否要显式写出 public，需要根据团队项目开发规范来定：

- 如果确定要给所有的成员都加上显式的访问修饰符声明，那跟着规范走，统一将 public 都写出来就行了；
- 如果认为写 public 有些冗余，那就统一都不写 public；

## 6. private 修饰的成员真的完全无法从外部访问吗？

在 TypeScript 编译期，private 成员确实无法从类外部访问，编译器会报错：

```ts
class Secret {
  private code = '1234'
}

const s = new Secret()
console.log(s.code) // ❌ 报错
// Property 'code' is private and only accessible within class 'Secret'.(2341)

// 小提示：如果不想要报错，可以利用方括号的动态属性语法来访问
// 比如：s['code']
// 这种语法 TS 检查不出来，自然就不会报错了。
```

但要注意：TypeScript 的 private 是编译时的约束，不是运行时的保护。编译后的 JavaScript 代码中，该属性仍然存在且可被访问（除非使用 ECMAScript 的 `#私有字段` 语法）。例如，上述代码忽略编译报错的话，最终编译后会得到如下 JS 程序：

```js
'use strict'
class Secret {
  constructor() {
    this.code = '1234'
  }
}
const s = new Secret()
console.log(s.code)
```

很显然，在运行时通过 `s.code` 是可以访问的。因此，private 主要用于开发时的类型安全和设计意图表达，而非安全隔离。

## 7. “TS 的 private” vs. “ES 的 `#私有字段`”

### 7.1. 对比

TypeScript 的 `private` 是编译时的类型系统概念，仅在 TypeScript 编译阶段提供访问检查，编译后的 JavaScript 代码中该成员仍是普通属性。并且 TS 中的 `private` 检查，是可以通过方括号的动态属性语法（如 `obj["prop"]`）绕过。

而 ECMAScript 的 `#私有字段`（例如 `#name`）是运行时的真正私有成员，由 JavaScript 引擎原生支持，无法从类外部以任何方式访问，即使使用 `obj["#name"]` 也不行。

示例对比：

```ts
// TypeScript private（编译后变为普通属性）
class A {
  private x = 1
}
const a = new A()
console.log(a['x']) // ✅ 运行时可访问（但 TS 编译时报错）

// ECMAScript #私有字段（TS 也支持）
class B {
  #y = 2
}
const b = new B()
console.log(b['#y']) // ❌ undefined，运行时也无法访问
```

小结：

- 若需要真正的运行时私有性，应使用 `#` 语法；
- 若仅需开发期类型安全和封装意图表达，`private` 也行；

### 7.2. ES `#私有字段` 对 `target` 编译目标的要求

target 要求大于 ES2021，如果小于等于 ES2021 的话，TS 会使用 `WeakMaps` 替代 `#` 来实现。

来看一下官方提供的示例：

```ts
// TS 源码
class Dog {
  #barkAmount = 0
  personality = 'happy'

  constructor() {}
}
```

```js
// target > ES2021
// 编译后的 JS
'use strict'
class Dog {
  #barkAmount = 0
  personality = 'happy'
  constructor() {}
}
```

```js
// target <= ES2021
// 编译后的 JS
'use strict'
var _Dog_barkAmount
class Dog {
  constructor() {
    _Dog_barkAmount.set(this, 0)
    this.personality = 'happy'
  }
}
_Dog_barkAmount = new WeakMap()
```

## 8. 社区目前（2025）更推荐使用 `#私有字段` 还是 TypeScript 的 `private` 修饰符？

截至 2025 年，社区已形成明确的实践共识：根据私有性需求的严格程度选择适当的机制。

### 8.1. 决策指南

| 场景 | 推荐方案 | 理由 |
| --- | --- | --- |
| 需要运行时真正私有性（防止通过 `obj["prop"]`、反射、调试工具等访问） | `#私有字段` | 提供语言级运行时保护，不可绕过 |
| 开发库/框架，需严格封装内部实现 | `#私有字段` | 防止用户依赖非公开 API，增强版本兼容性 |
| 目标环境支持 ES2022+ | `#私有字段` | 原生支持，编译后代码更简洁 |
| 需要在接口中描述的成员 | `private` | 接口无法包含私有成员 |
| 仅需编译期类型检查 | `private` | 语法更简洁，符合 TS 设计哲学 |
| 需要调试可见性 | `private` | `#字段` 在调试器中不可见 |

### 8.2. 实践趋势

- 库作者：普遍采用 `#私有字段` 保护核心实现，确保 API 边界清晰
- 应用开发者：80% 以上场景使用 `private`，仅在关键安全/封装场景使用 `#`
- 框架演进：Angular 17+、React 19+ 在内部实现中广泛采用 `#字段`
- 工具链：TypeScript 5.5+ 提供更完善的 `#字段` 类型推导和错误提示

### 8.3. 最佳实践

1. 明确需求：先确定是否需要运行时私有性，而非编译期检查
2. 保持一致性：项目内统一选择一种模式，避免混用
3. 渐进采用：新项目可直接使用 `#字段`；旧项目可逐步迁移关键私有成员
4. 文档说明：对使用 `#字段` 的 API 明确标注"此为严格私有实现，不得依赖"

关键区别：`private` 是类型系统契约（编译期检查），`#字段` 是语言运行时特性（不可绕过的私有性）。选择应基于实际需求，而非单纯追求"更私有"。

## 9. protected 和 private 有什么区别？什么时候用 protected？

区别在于继承时的可访问性：

- private：仅在当前类内部可访问，子类也无法访问。
- protected：当前类和所有子类内部可访问，但类外部（包括实例）不可访问。

使用场景：当你希望某些成员被子类继承并使用，但又不希望外部代码直接调用时，就用 protected。

例如：

```ts
class Animal {
  protected name: string
  constructor(name: string) {
    this.name = name
  }
}

class Dog extends Animal {
  bark() {
    console.log(`${this.name} barks!`) // ✅ 允许：子类可访问 protected 成员
  }
}

const dog = new Dog('Buddy')
console.log(dog.name) // ❌ 错误：外部不能访问 protected 成员
// Property 'name' is protected and only accessible within class 'Animal' and its subclasses.(2445)
```

## 10. 构造函数也可以用 private 或 protected 吗？有什么用？

可以。将构造函数标记为 private 或 protected 是一种控制类实例化方式的设计模式。

- private constructor：禁止外部直接 `new` 创建实例，常用于单例模式或静态工厂方法。
- protected constructor：允许子类继承并调用构造函数，但禁止外部直接实例化，常用于抽象基类或确保通过子类创建实例。

示例（单例）：

```ts
class Singleton {
  private static instance: Singleton
  private constructor() {} // 外部无法 new

  static getInstance() {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton()
    }
    return Singleton.instance
  }
}

// const s = new Singleton(); // ❌ 错误做法
// Constructor of class 'Singleton' is private and only accessible within the class declaration.(2673)

const s = Singleton.getInstance() // ✅ 正确做法
```

示例（protected 构造函数）：

```ts
class Base {
  protected constructor() {}
}

class Derived extends Base {
  constructor() {
    super() // ✅ 子类可以调用
  }
}

// new Base(); // ❌ 错误
new Derived() // ✅ 正确
```

## 11. 接口或类型定义中能使用 private/protected 吗？

不能。

接口（interface）和类型别名（type）描述的是公共契约（public API），只关心外部可访问的部分。因此：

- 接口中不能包含 `private` 或 `protected` 成员。
- 类实现接口时，接口只检查其 public 成员是否匹配。

例如：

```ts
interface HasName {
  name: string // 隐含 public
}

class Person implements HasName {
  private name: string // ❌ 错误！接口要求 public name
  // 必须写成 public name 或不加修饰符
}
// Class 'Person' incorrectly implements interface 'HasName'.
//   Property 'name' is private in type 'Person' but not in type 'HasName'.(2420)
```

这也体现了 TypeScript 的设计哲学：接口用于描述“外部如何看待一个对象”，而访问修饰符用于控制“内部如何组织实现”。

## 12. 引用

- [Classes 类][1]
- [JavaScript’s private fields (#)][2]

[1]: https://www.typescriptlang.org/docs/handbook/2/classes.html
[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_elements
