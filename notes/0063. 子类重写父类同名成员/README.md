# [0063. 子类重写父类同名成员](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0063.%20%E5%AD%90%E7%B1%BB%E9%87%8D%E5%86%99%E7%88%B6%E7%B1%BB%E5%90%8C%E5%90%8D%E6%88%90%E5%91%98)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是成员重写（Member Override）？](#3--什么是成员重写member-override)
- [4. 🤔 override 关键字有什么作用？](#4--override-关键字有什么作用)
  - [4.1. override 关键字的作用](#41-override-关键字的作用)
  - [4.2. 重构安全保护](#42-重构安全保护)
- [5. 🤔 noImplicitOverride 编译选项是什么？](#5--noimplicitoverride-编译选项是什么)
- [6. 🤔 子类重写成员时有哪些类型约束？](#6--子类重写成员时有哪些类型约束)
  - [6.1. 方法重写约束](#61-方法重写约束)
  - [6.2. 属性重写约束](#62-属性重写约束)
- [7. 🤔 属性重写与方法重写有什么区别？](#7--属性重写与方法重写有什么区别)
  - [7.1. 特性对比表](#71-特性对比表)
  - [7.2. 示例](#72-示例)
  - [7.3. 开发建议](#73-开发建议)
- [8. 🤔 属性与方法的多态存在区别的根本原因是什么？](#8--属性与方法的多态存在区别的根本原因是什么)
  - [8.1. 类的实际执行顺序](#81-类的实际执行顺序)
  - [8.2. 继承时的执行流程](#82-继承时的执行流程)
  - [8.3. 为什么方法没有这个问题？](#83-为什么方法没有这个问题)
  - [8.4. 示例](#84-示例)
  - [8.5. 建议](#85-建议)
  - [8.6. 小结](#86-小结)
- [9. 🤔 什么时候应该使用 override 关键字？](#9--什么时候应该使用-override-关键字)
  - [9.1. 推荐策略](#91-推荐策略)
  - [9.2. 使用场景](#92-使用场景)
  - [9.3. 最佳实践](#93-最佳实践)
- [10. 🤔 访问器（getter/setter）的重写规则是什么？](#10--访问器gettersetter的重写规则是什么)
- [11. 🔗 引用](#11--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 成员重写（Member Override）
- 方法重写（Method Override）
- 属性重写（Property Override）
- override 关键字
- noImplicitOverride 编译选项
- 访问器重写

## 2. 🫧 评价

成员重写是面向对象编程中实现多态的重要机制。TypeScript 4.3 引入的 `override` 关键字显著提升了代码的可维护性和安全性，它能够明确表达开发者的重写意图，并在编译期捕获潜在的重构错误。

`override` 关键字不仅适用于方法，也适用于属性和访问器。配合 `noImplicitOverride` 编译选项，可以强制要求所有重写成员都显式标记，这在大型项目中尤其有价值——当父类成员被重命名或删除时，编译器能立即发现问题，避免子类成员"意外变成"新成员。

虽然 `override` 不是必需的，但强烈推荐在团队项目中启用 `noImplicitOverride`，以建立更清晰的继承契约。

## 3. 🤔 什么是成员重写（Member Override）？

成员重写是指子类定义一个与父类同名的成员（方法、属性或访问器），从而替换或扩展父类的实现。这是实现运行时多态的基础。

::: code-group

```ts [方法重写]
class Animal {
  move(distance: number = 0) {
    console.log(`Animal moved ${distance}m.`)
  }
}

class Dog extends Animal {
  // 重写父类 move 方法
  move(distance: number = 5) {
    console.log('Dog is running...')
    super.move(distance) // 可选：调用父类实现
  }
}

const dog = new Dog()
dog.move(10)
// "Dog is running..."
// "Animal moved 10m."
```

```ts [属性重写]
class Animal {
  type = 'animal'
  legs = 4
}

class Dog extends Animal {
  // 重写父类 type 属性
  type = 'dog'
}

const dog = new Dog()
console.log(dog.type) // "dog"
console.log(dog.legs) // 4
```

```ts [访问器重写]
class Animal {
  protected _age = 0

  get age(): number {
    return this._age
  }
}

class Dog extends Animal {
  // 重写父类 age 访问器
  get age(): number {
    return this._age * 7 // 狗的年龄换算
  }
}

const dog = new Dog()
dog['_age'] = 2
console.log(dog.age) // 14
```

:::

## 4. 🤔 override 关键字有什么作用？

### 4.1. override 关键字的作用

`override` 关键字用于显式声明"此成员是在重写父类成员"，它提供了两层保护：

1. 编译期检查：确保父类确实存在同名成员，防止拼写错误
2. 重构安全：当父类成员被重命名或删除时，编译器会报错

::: code-group

```ts [方法使用 override]
class Animal {
  move() {
    console.log('Animal is moving')
  }
}

class Dog extends Animal {
  override move() {
    // ✅ 明确表明这是重写父类方法
    console.log('Dog is running')
  }

  override fly() {
    // ❌ 错误：父类没有 fly 方法
    console.log('Dogs cannot fly')
  }
}
// This member cannot have an 'override' modifier because it is not declared in the base class 'Animal'.(4113)
```

```ts [属性使用 override]
class Animal {
  kind = 'animal'
}

class Dog extends Animal {
  override kind = 'dog' // ✅ 显式重写属性
}

class Cat extends Animal {
  override color = 'white' // ❌ 错误：父类没有 color 属性
}
// This member cannot have an 'override' modifier because it is not declared in the base class 'Animal'.(4113)
```

```ts [访问器使用 override]
class Animal {
  get legs(): number {
    return 4
  }
}

class Spider extends Animal {
  override get legs(): number {
    // ✅ 重写访问器
    return 8
  }
}
```

:::

### 4.2. 重构安全保护

经典场景：当父类成员被重命名时，`override` 关键字能立即发现问题。

::: code-group

```ts [❌ 没有 override：静默失败]
class Animal {
  walk() {
    // 方法从 move 重命名为 walk
    console.log('Animal is walking')
  }
}

class Dog extends Animal {
  move() {
    // ⚠️ 编译通过，但 move 意外变成了新方法
    console.log('Dog is running')
  }
}

const dog = new Dog()
dog.walk() // "Animal is walking" ← 预期重写的方法未生效
dog.move() // "Dog is running"    ← 意外的新方法
```

```ts [✅ 有 override：立即报错]
class Animal {
  walk() {
    // 方法从 move 重命名为 walk
    console.log('Animal is walking')
  }
}

class Dog extends Animal {
  override move() {
    // ❌ 编译错误：父类没有 move 方法
    console.log('Dog is running')
  }
}
// This member cannot have an 'override' modifier because it is not declared in the base class 'Animal'.(4113)
```

:::

危害示例：业务逻辑静默失败

```ts
// 场景：权限检查方法被重命名
class BaseService {
  validateAccess() {
    // validateAccess 是新名字，原来是 checkPermission
    return this.hasRole('admin')
  }
  protected hasRole(role: string) {
    return false
  }
}

class AdminService extends BaseService {
  // ⚠️ 没用 override：checkPermission 变成新方法，权限检查失效
  checkPermission() {
    return true
  }
}

const service = new AdminService()

// service.checkPermission() // 这是旧名字

// 开发流程：
// 1. 基类原 checkPermission 重命名为 validateAccess
// 2. 修改派生类中的 checkPermission 为 validateAccess（⚠️ 由于没有错误提示，这一步可能会被你不小心忽略掉）
// 3. 修改派生类实例中的 checkPermission 为 validateAccess

service.validateAccess() // ❌ 返回 false，预期的重写未生效
```

核心价值：`override` 将"重写意图"显式化，避免因重构导致的多态行为失效。

## 5. 🤔 noImplicitOverride 编译选项是什么？

`noImplicitOverride` 是 TypeScript 4.3 引入的编译选项，启用后会强制要求所有重写成员必须显式使用 `override` 关键字。

配置方式：

```json
{
  "compilerOptions": {
    "noImplicitOverride": true
  }
}
```

效果对比：

::: code-group

```ts [不启用 noImplicitOverride]
// tsconfig.json
// {
//   "compilerOptions": {
//     "noImplicitOverride": false
//   }
// }
class Animal {
  move() {}
  type = 'animal'
}

class Dog extends Animal {
  move() {
    // ✅ 不报错，但无法确认是重写还是新方法
  }
  type = 'dog' // ✅ 不报错，但无法确认是重写还是新属性
}
```

```ts [启用 noImplicitOverride]
// tsconfig.json
// {
//   "compilerOptions": {
//     "noImplicitOverride": true
//   }
// }
class Animal {
  move() {}
  type = 'animal'
}

// ❌ 不使用 override 会报错
class Dog1 extends Animal {
  move() {
    // ❌ 错误：缺少 override 关键字
  }
  // This member must have an 'override' modifier because it overrides a member in the base class 'Animal'.(4114)

  type = 'dog' // ❌ 错误：缺少 override 关键字
  // This member must have an 'override' modifier because it overrides a member in the base class 'Animal'.(4114)
}

// ✅ 重写父类成员必须加上 override 关键字
class Dog2 extends Animal {
  override move() {
    // ✅ 正确
  }
  override type = 'dog' // ✅ 正确
}
```

:::

## 6. 🤔 子类重写成员时有哪些类型约束？

核心原则：子类必须遵守"里氏替换原则"（Liskov Substitution Principle）——子类对象必须能替换父类对象而不破坏程序正确性。

方法、属性的具体约束规则：可以参考 `类型兼容性` 相关笔记。

### 6.1. 方法重写约束

| 可修改项 | 规则 | 示例 |
| --- | --- | --- |
| 参数类型 | ❌ 不可改变（必须完全一致或更宽泛） | `(x: number)` → `(x: any)` ✅ |
| 参数数量 | ✅ 可减少（可选参数） | `(a, b)` → `(a)` ✅ |
| 返回值类型 | ✅ 可返回子类型（协变） | `Animal` → `Dog` ✅ |
| 访问修饰符 | ✅ 可放宽（不能变严格） | `protected` → `public` ✅ |
| 可选性 | ❌ 必填参数不能变可选 | `(x: number)` → `(x?: number)` ❌ |

::: code-group

```ts [✅ 合法方法重写]
class Animal {
  protected move(distance: number): Animal {
    return this
  }
}

class Dog extends Animal {
  // ✅ 返回值协变 + 访问级别放宽 + 参数变可选
  override move(distance?: number): Dog {
    return this
  }
}
```

```ts [❌ 非法方法重写]
class Animal {
  move(distance: number): void {}
}

class Dog extends Animal {
  override move(distance: string): void {}
  // ❌ 错误：参数类型不兼容
}
// Property 'move' in type 'Dog' is not assignable to the same property in base type 'Animal'.
//   Type '(distance: string) => void' is not assignable to type '(distance: number) => void'.
//     Types of parameters 'distance' and 'distance' are incompatible.
//       Type 'number' is not assignable to type 'string'.(2416)
```

:::

### 6.2. 属性重写约束

| 可修改项   | 规则                      | 示例                          |
| ---------- | ------------------------- | ----------------------------- |
| 属性类型   | ✅ 可使用子类型（协变）   | `Animal` → `Dog` ✅           |
| 访问修饰符 | ✅ 可放宽（不能变严格）   | `protected` → `public` ✅     |
| 可选性     | ✅ 必填可变可选，反之不可 | `x: number` → `x?: number` ✅ |

::: code-group

```ts [✅ 合法属性重写]
class Animal {
  protected type: string = 'animal'
  owner?: string
}

class Dog extends Animal {
  override type: 'dog' = 'dog' // ✅ 类型收窄（字面量类型是 string 的子类型）
  override owner: string = 'John' // ✅ 可选变必填
}
```

```ts [❌ 非法属性重写]
class Animal {
  type: string = 'animal'
}

class Dog extends Animal {
  override type: number = 1 // ❌ 错误：类型不兼容
}
// Property 'type' in type 'Dog' is not assignable to the same property in base type 'Animal'.
//   Type 'number' is not assignable to type 'string'.(2416)
```

:::

## 7. 🤔 属性重写与方法重写有什么区别？

### 7.1. 特性对比表

| 特性         | 属性重写                 | 方法重写                 |
| ------------ | ------------------------ | ------------------------ |
| 语义         | 值的覆盖                 | 行为的替换               |
| super 调用   | ❌ 不支持                | ✅ 支持 `super.method()` |
| 初始化时机   | 构造函数执行时按顺序赋值 | 原型链查找               |
| 多态性       | ⚠️ 弱（取决于构造顺序）  | ✅ 强（运行时动态绑定）  |
| 推荐使用场景 | 简单数据覆盖             | 行为扩展或替换           |

### 7.2. 示例

1. 属性重写特性
2. 方法重写特性
3. 属性重写：弱多态（取决于构造顺序）
4. 方法重写：强多态（运行时动态绑定）

::: code-group

```ts [1]
class Animal {
  type = 'animal' // ← 这行代码会在构造函数中执行

  constructor() {
    // 实际执行顺序：
    // 1. 先执行 this.type = 'animal'
    // 2. 然后执行下面的代码
    console.log('Animal constructor:', this.type)
  }
}

class Dog extends Animal {
  override type = 'dog' // ← 这行代码也会在构造函数中执行

  constructor() {
    super() // ← 调用父类构造函数
    // 实际执行顺序：
    // 1. super() 内部：this.type = 'animal' (父类的属性初始化)
    // 2. super() 返回后：this.type = 'dog' (子类的属性初始化，覆盖父类的值)
    console.log('Dog constructor:', this.type)
  }
}

new Dog()
// 输出：
// "Animal constructor: animal" ← 父类构造函数执行时，子类的 type 还没赋值
// "Dog constructor: dog"       ← 子类构造函数执行时，type 已经被覆盖为 'dog'
```

```ts [2]
class Animal {
  getType() {
    return 'animal'
  }

  constructor() {
    console.log('Animal constructor:', this.getType())
    // ↑ 这里调用 this.getType() 时：
    // 1. 在当前实例上查找 getType 方法 → 没有
    // 2. 沿着原型链向上查找 → 找到 Dog.prototype.getType
    // 3. 调用的是 Dog 的 getType 方法！
  }
}

class Dog extends Animal {
  override getType() {
    return 'dog'
  }
}

new Dog()
// 输出：
// "Animal constructor: dog" ← 多态！调用的是子类的 getType 方法

// 原型链结构：
// dog 实例
//   ↓ [[Prototype]]
// Dog.prototype { getType: [Function: getType] }
//   ↓ [[Prototype]]
// Animal.prototype { getType: [Function: getType] }  ← 被子类覆盖，不会被调用
//   ↓ [[Prototype]]
// Object.prototype
```

```ts [3]
class Animal {
  type = 'animal'

  showType() {
    // ⚠️ 在构造期间调用这个方法
    console.log('Type:', this.type)
  }

  constructor() {
    this.showType() // 在这里调用
  }
}

class Dog extends Animal {
  override type = 'dog'

  constructor() {
    super() // ← 关键时刻
    // super() 执行时：
    // 1. Animal 的 this.type = 'animal' 执行
    // 2. Animal 的 constructor() 执行 → this.showType() → 此时 type 是 'animal'
    // 3. super() 返回
    // 4. Dog 的 this.type = 'dog' 执行 ← 这一步太晚了！
  }
}

new Dog()
// 输出：
// "Type: animal" ← ⚠️ 不是 'dog'！

// Q：为什么说是"弱多态"？
// A：因为在父类构造函数执行期间，子类的属性赋值还没有发生，所以父类看到的是自己的属性值，而不是子类的。
```

```ts [4]
class Animal {
  getType() {
    return 'animal'
  }

  showType() {
    // ✅ 调用 this.getType() 会动态查找
    console.log('Type:', this.getType())
  }

  constructor() {
    this.showType() // 在这里调用
  }
}

class Dog extends Animal {
  override getType() {
    return 'dog'
  }

  constructor() {
    super()
    // super() 执行时：
    // 1. Animal 的 constructor() 执行
    // 2. 调用 this.showType()
    // 3. showType() 内部调用 this.getType()
    // 4. ✅ 通过原型链找到 Dog.prototype.getType
    // 5. 返回 'dog'
  }
}

new Dog()
// 输出：
// "Type: dog" ← ✅ 正确！调用的是子类的 getType

// 为什么说是"强多态"？
// 因为方法存储在原型链上，this.method() 调用会在运行时动态查找，无论何时调用（包括父类构造函数中），都会找到子类的方法。
```

:::

关键差异：方法重写支持真正的多态（父类构造函数中调用的是子类方法），而属性重写在构造期间会按顺序赋值（父类构造函数中看到的是父类属性值）。

### 7.3. 开发建议

1. ❌ 不推荐：在父类构造函数中依赖子类属性
2. ✅ 推荐：在父类构造函数中调用可被重写的方法

::: code-group

```ts [1]
class Animal {
  type = 'animal'

  constructor() {
    console.log(this.type) // ⚠️ 不可靠，取决于调用时机
  }
}
```

```ts [2]
class Animal {
  constructor() {
    this.init() // ✅ 子类可以重写 init 方法
  }

  protected init() {
    // 默认实现
  }
}

class Dog extends Animal {
  override init() {
    // ✅ 即使在父类构造函数中调用，也会执行这里的代码
  }
}
```

:::

这就是为什么在面向对象设计中，使用“模板方法模式”而不是“模板属性模式”的原因！

## 8. 🤔 属性与方法的多态存在区别的根本原因是什么？

根本原因：属性赋值的滞后性

### 8.1. 类的实际执行顺序

当你写这样的代码时：

```ts
class Animal {
  type = 'animal' // ← 看起来是"声明"

  constructor() {
    console.log(this.type)
  }
}
```

实际编译后的 JavaScript 是：

```js
class Animal {
  constructor() {
    this.type = 'animal' // ← 实际是在构造函数里赋值！
    console.log(this.type)
  }
}
```

### 8.2. 继承时的执行流程

```ts
class Dog extends Animal {
  override type = 'dog'

  constructor() {
    super() // ← 关键点
  }
}
```

实际执行顺序：

```txt
1. 调用 super()
   ↓
2. 进入父类 Animal 构造函数
   ↓
3. 执行父类的属性赋值：this.type = 'animal'
   ↓
4. 执行父类构造函数的其他代码
   ↓
5. super() 返回
   ↓
6. 执行子类的属性赋值：this.type = 'dog'  ← 滞后在这里！
   ↓
7. 执行子类构造函数的其他代码
```

### 8.3. 为什么方法没有这个问题？

方法存储在原型上，不需要"赋值"。

方法在类定义时就已经挂载到原型链上，而属性是在实例创建时才赋值。

```js
// 方法的实际结构
Dog.prototype.getType = function () {
  return 'dog'
}
Animal.prototype.getType = function () {
  return 'animal'
}

// 调用 this.getType() 时，会沿着原型链查找：
// 1. 在实例上找 → 没有
// 2. 在 Dog.prototype 上找 → 找到了！
// 3. 调用 Dog.prototype.getType
```

### 8.4. 示例

```ts
class Animal {
  type = 'animal'

  constructor() {
    console.log('1. Animal constructor start')
    console.log('2. this.type =', this.type) // 'animal'
    console.log('3. Animal constructor end')
  }
}

class Dog extends Animal {
  override type = 'dog'

  constructor() {
    console.log('A. Dog constructor start')
    super()
    console.log('B. After super()')
    console.log('C. this.type =', this.type) // 'dog'
    console.log('D. Dog constructor end')
  }
}

new Dog()

// 输出：
// A. Dog constructor start
// 1. Animal constructor start
// 2. this.type = animal        ← 父类看到的是父类的值
// 3. Animal constructor end
// B. After super()
// C. this.type = dog           ← 子类的属性赋值在 super() 之后
// D. Dog constructor end
```

### 8.5. 建议

❌ 不要依赖构造期间的属性重写

```ts
class Animal {
  type = 'animal'

  constructor() {
    this.logType() // ⚠️ 危险
  }

  logType() {
    console.log(this.type) // 可能看不到子类的值
  }
}
```

✅ 使用方法重写

```ts
class Animal {
  constructor() {
    this.logType() // ✅ 安全
  }

  logType() {
    console.log(this.getType()) // 动态查找
  }

  protected getType() {
    return 'animal'
  }
}

class Dog extends Animal {
  override getType() {
    return 'dog' // ✅ 即使在父类构造函数中调用，也能获取到
  }
}
```

### 8.6. 小结

| 问题               | 根本原因                                         |
| ------------------ | ------------------------------------------------ |
| 属性重写弱多态     | ✅ 属性赋值滞后（在 super() 返回后才执行）       |
| 方法重写强多态     | 方法提前挂载在原型上，调用时动态查找             |
| 为何 TS 要这样设计 | 这是 ES 规范，而 TS 是 JS 的超集，只能按照规范来 |
| 如何避免问题       | 用方法代替属性来实现多态行为                     |

一句话总结：属性是“先父后子”顺序赋值的，所以父类构造函数中看到的是“过时”的值；而方法是"原型链查找"的，所以任何时候都能找到"最新"的子类实现。这就是属性赋值滞后性导致的多态差异！

## 9. 🤔 什么时候应该使用 override 关键字？

### 9.1. 推荐策略

1. 新项目：从一开始就启用 `noImplicitOverride` + 强制使用 `override`
2. 现有项目：
   - 渐进式迁移：先在新代码中使用
   - 重构关键路径时补充 `override`
3. 库开发：必须使用，保护用户免受 API 变更影响

### 9.2. 使用场景

| 场景                 | 是否使用 override | 理由                       |
| -------------------- | ----------------- | -------------------------- |
| 重写父类公开成员     | ✅ 强烈推荐       | 明确继承契约               |
| 实现抽象成员         | ❌ 不需要         | 本质是实现而非重写         |
| 重写第三方库类的成员 | ✅ 必须           | 防止库更新导致的破坏性变更 |
| 属性值覆盖           | ✅ 推荐           | 明确意图，避免混淆         |
| 临时测试代码         | ⚠️ 可选           | 看团队规范                 |

### 9.3. 最佳实践

::: code-group

```ts [✅ 推荐：清晰的继承意图]
class Dog extends Animal {
  override type = 'dog'

  override move() {
    super.move()
    console.log('Running fast!')
  }

  override get age() {
    return super.age * 7
  }
}
```

```ts [❌ 不推荐：意图不明]
class Dog extends Animal {
  type = 'dog' // 是重写？还是新属性？

  move() {
    // 是重写？还是碰巧同名？
    console.log('Running fast!')
  }
}
```

:::

## 10. 🤔 访问器（getter/setter）的重写规则是什么？

访问器遵循特殊的重写规则：

| 规则 | 说明 | 示例 |
| --- | --- | --- |
| getter/setter 成对性 | 如果父类同时有 getter 和 setter，子类也要 | 父类 `get x()` + `set x()` → 子类同样 |
| 只读变可写 | ✅ 父类只有 getter，子类可添加 setter | 父类 `get x()` → 子类 `get x()` + `set x()` |
| 可写变只读 | ❌ 父类有 setter，子类不能只有 getter | 违反里氏替换原则 |
| 返回值/参数类型 | 遵循协变/逆变规则 | 与方法重写相同 |

::: code-group

```ts [✅ 合法访问器重写]
class Animal {
  protected _age = 0

  get age(): number {
    return this._age
  }
}

class Dog extends Animal {
  // ✅ 只读变可写
  override get age(): number {
    return this._age * 7
  }

  set age(value: number) {
    this._age = value / 7
  }
}
```

```ts [❌ 非法访问器重写]
class Animal {
  protected _name = ''

  get name(): string {
    return this._name
  }

  set name(value: string) {
    this._name = value
  }
}

class Dog extends Animal {
  // ❌ 错误：父类有 setter，子类不能只有 getter
  override get name(): string {
    return `Dog: ${this._name}`
  }
}
// 'get' accessor must have a corresponding 'set' accessor.(2380)
```

```ts [返回值类型协变]
class Animal {
  get self(): Animal {
    return this
  }
}

class Dog extends Animal {
  // ✅ 返回值协变
  override get self(): Dog {
    return this
  }
}
```

:::

## 11. 🔗 引用

- [noImplicitOverride][1]
- [TypeScript 4.3 Release Notes - override][2]
- [Classes 类][3]

[1]: https://www.typescriptlang.org/tsconfig/#noImplicitOverride
[2]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-3.html#override-and-the-noimplicitoverride-flag
[3]: https://www.typescriptlang.org/docs/handbook/2/classes.html
