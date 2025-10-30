# [0063. 子类重写父类同名成员](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0063.%20%E5%AD%90%E7%B1%BB%E9%87%8D%E5%86%99%E7%88%B6%E7%B1%BB%E5%90%8C%E5%90%8D%E6%88%90%E5%91%98)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是成员重写（Member Override）？](#3--什么是成员重写member-override)
- [4. 🤔 override 关键字有什么作用？](#4--override-关键字有什么作用)
- [5. 🤔 noImplicitOverride 编译选项是什么？](#5--noimplicitoverride-编译选项是什么)
- [6. 🤔 子类重写成员时有哪些类型约束？](#6--子类重写成员时有哪些类型约束)
  - [6.1. 方法重写约束](#61-方法重写约束)
  - [6.2. 属性重写约束](#62-属性重写约束)
- [7. 🤔 属性重写与方法重写有什么区别？](#7--属性重写与方法重写有什么区别)
- [8. 🤔 什么时候应该使用 override 关键字？](#8--什么时候应该使用-override-关键字)
  - [8.1. 推荐策略](#81-推荐策略)
  - [8.2. 使用场景](#82-使用场景)
  - [8.3. 最佳实践](#83-最佳实践)
- [9. 🤔 访问器（getter/setter）的重写规则是什么？](#9--访问器gettersetter的重写规则是什么)
- [10. 🔗 引用](#10--引用)

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

`override` 关键字用于显式声明"此成员是在重写父类成员"，它提供了两层保护：

1. **编译期检查**：确保父类确实存在同名成员，防止拼写错误
2. **重构安全**：当父类成员被重命名或删除时，编译器会报错

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

**关键场景**：假设父类成员被重命名

```ts
class Animal {
  walk() {
    // 方法重命名（原 move）
    console.log('Animal is walking')
  }
}

class Dog extends Animal {
  override move() {
    // ❌ 有 override 时会报错，立即发现问题
    console.log('Dog is running')
  }
  // This member cannot have an 'override' modifier because it is not declared in the base class 'Animal'.(4113)

  // move() { // ⚠️ 无 override 时不报错，但 move 变成了新方法而非重写
  //   console.log('Dog is running');
  // }
}
```

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

```ts [启用前]
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

```ts [启用后]
class Animal {
  move() {}
  type = 'animal'
}

class Dog extends Animal {
  move() {
    // ❌ 错误：缺少 override 关键字
  }
  // This member must have an 'override' modifier because it overrides a member in the base class 'Animal'.(4114)

  type = 'dog' // ❌ 错误：缺少 override 关键字
  // This member must have an 'override' modifier because it overrides a member in the base class 'Animal'.(4114)

  override move() {
    // ✅ 正确
  }
  override type = 'dog' // ✅ 正确
}
```

:::

## 6. 🤔 子类重写成员时有哪些类型约束？

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

**核心原则**：子类必须遵守"里氏替换原则"（Liskov Substitution Principle）——子类对象必须能替换父类对象而不破坏程序正确性。

## 7. 🤔 属性重写与方法重写有什么区别？

| 特性         | 属性重写                 | 方法重写                 |
| ------------ | ------------------------ | ------------------------ |
| 语义         | 值的覆盖                 | 行为的替换               |
| super 调用   | ❌ 不支持                | ✅ 支持 `super.method()` |
| 初始化时机   | 构造函数执行时按顺序赋值 | 原型链查找               |
| 多态性       | ⚠️ 弱（取决于构造顺序）  | ✅ 强（运行时动态绑定）  |
| 推荐使用场景 | 简单数据覆盖             | 行为扩展或替换           |

::: code-group

```ts [属性重写特性]
class Animal {
  type = 'animal'

  constructor() {
    console.log('Animal constructor:', this.type)
  }
}

class Dog extends Animal {
  override type = 'dog'

  constructor() {
    super() // 此时 this.type 是 'animal'
    console.log('Dog constructor:', this.type) // 'dog'
  }
}

new Dog()
// "Animal constructor: animal"
// "Dog constructor: dog"
```

```ts [方法重写特性]
class Animal {
  getType() {
    return 'animal'
  }

  constructor() {
    console.log('Animal constructor:', this.getType())
  }
}

class Dog extends Animal {
  override getType() {
    return 'dog'
  }
}

new Dog()
// "Animal constructor: dog" ← 多态：调用的是子类方法！
```

:::

**关键差异**：方法重写支持真正的多态（父类构造函数中调用的是子类方法），而属性重写在构造期间会按顺序赋值（父类构造函数中看到的是父类属性值）。

## 8. 🤔 什么时候应该使用 override 关键字？

### 8.1. 推荐策略

1. **新项目**：从一开始就启用 `noImplicitOverride` + 强制使用 `override`
2. **现有项目**：
   - 渐进式迁移：先在新代码中使用
   - 重构关键路径时补充 `override`
3. **库开发**：必须使用，保护用户免受 API 变更影响

### 8.2. 使用场景

| 场景                 | 是否使用 override | 理由                       |
| -------------------- | ----------------- | -------------------------- |
| 重写父类公开成员     | ✅ 强烈推荐       | 明确继承契约               |
| 实现抽象成员         | ❌ 不需要         | 本质是实现而非重写         |
| 重写第三方库类的成员 | ✅ 必须           | 防止库更新导致的破坏性变更 |
| 属性值覆盖           | ✅ 推荐           | 明确意图，避免混淆         |
| 临时测试代码         | ⚠️ 可选           | 看团队规范                 |

### 8.3. 最佳实践

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

## 9. 🤔 访问器（getter/setter）的重写规则是什么？

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

## 10. 🔗 引用

- [noImplicitOverride][1]
- [TypeScript 4.3 Release Notes - override][2]
- [Classes 类][3]

[1]: https://www.typescriptlang.org/tsconfig/#noImplicitOverride
[2]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-3.html#override-and-the-noimplicitoverride-flag
[3]: https://www.typescriptlang.org/docs/handbook/2/classes.html
