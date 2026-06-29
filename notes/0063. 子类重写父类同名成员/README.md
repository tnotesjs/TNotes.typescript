# [0063. 子类重写父类同名成员](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0063.%20%E5%AD%90%E7%B1%BB%E9%87%8D%E5%86%99%E7%88%B6%E7%B1%BB%E5%90%8C%E5%90%8D%E6%88%90%E5%91%98)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 什么是成员重写（Member Override）？](#3-什么是成员重写member-override)
- [4. override 关键字有什么作用？](#4-override-关键字有什么作用)
  - [4.1. override 关键字的作用](#41-override-关键字的作用)
  - [4.2. 重构安全保护](#42-重构安全保护)
- [5. 什么时候应该使用 override 关键字？](#5-什么时候应该使用-override-关键字)
- [6. noImplicitOverride 编译选项是什么？](#6-noimplicitoverride-编译选项是什么)
- [7. 子类重写成员时有哪些类型约束？](#7-子类重写成员时有哪些类型约束)
- [8. 访问器（getter/setter）的重写规则是什么？](#8-访问器gettersetter的重写规则是什么)
- [9. 属性重写与方法重写有什么区别？](#9-属性重写与方法重写有什么区别)
- [10. 引用](#10-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 成员重写（Member Override）
- 方法重写（Method Override）
- 属性重写（Property Override）
- override 关键字
- noImplicitOverride 编译选项
- 访问器重写

## 2. 评价

成员重写是面向对象编程中实现多态的重要机制。TypeScript 4.3 引入的 `override` 关键字显著提升了代码的可维护性和安全性，它能够明确表达开发者的重写意图，并在编译期捕获潜在的重构错误。

`override` 关键字不仅适用于方法，也适用于属性和访问器。配合 `noImplicitOverride` 编译选项，可以强制要求所有重写成员都显式标记，这在大型项目中尤其有价值——当父类成员被重命名或删除时，编译器能立即发现问题，避免子类成员“意外变成”新成员。

虽然 `override` 不是必需的，但强烈推荐在团队项目中启用 `noImplicitOverride`，以建立更清晰的继承契约，避免因重构导致的多态行为失效。

## 3. 什么是成员重写（Member Override）？

成员重写是指子类定义一个与父类同名的成员（方法、属性或访问器），从而替换或扩展父类的实现。这是实现运行时多态的基础。

示例：

1. 方法重写
2. 属性重写
3. 访问器重写

::: code-group

```ts [1]
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

```ts [2]
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

```ts [3]
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

## 4. override 关键字有什么作用？

### 4.1. override 关键字的作用

`override` 关键字用于显式声明"此成员是在重写父类成员"，它提供了两层保护：

1. 编译期检查：确保父类确实存在同名成员，防止拼写错误
2. 重构安全：当父类成员被重命名或删除时，编译器会报错

示例：

1. 方法使用 override
2. 属性使用 override
3. 访问器使用 override

::: code-group

```ts [1]
class Animal {
  move() {
    console.log('Animal is moving')
  }
}

class Dog extends Animal {
  // ✅ 明确表明这是重写父类方法
  override move() {
    console.log('Dog is running')
  }

  // ❌ 错误：父类没有 fly 方法
  override fly() {
    console.log('Dogs cannot fly')
  }
  // 报错：
  // This member cannot have an 'override' modifier because it is not declared in the base class 'Animal'.(4113)
}
```

```ts [2]
class Animal {
  kind = 'animal'
}

class Dog extends Animal {
  // ✅ 显式重写属性
  override kind = 'dog'
}

class Cat extends Animal {
  // ❌ 错误：父类没有 color 属性
  override color = 'white'
}
// 报错：
// This member cannot have an 'override' modifier because it is not declared in the base class 'Animal'.(4113)
```

```ts [3]
class Animal {
  get legs(): number {
    return 4
  }
}

class Spider extends Animal {
  // ✅ 重写访问器
  override get legs(): number {
    return 8
  }
}
```

:::

### 4.2. 重构安全保护

经典场景：当父类成员被重命名时，`override` 关键字能立即发现问题。

示例：

1. ⚠️ 没有 override：不会报错
2. 有 override：立即报错

::: code-group

```ts [1]
class Animal {
  // 旧名称：
  // move() {
  //   console.log('Animal is walking')
  // }

  // 方法从 move 重命名为 walk
  walk() {
    console.log('Animal is walking')
  }
}

class Dog extends Animal {
  // ⚠️ 编译通过，但 move 意外变成了新方法
  move() {
    console.log('Dog is running')
  }
}

const dog = new Dog()
dog.walk() // "Animal is walking" ← 预期重写的方法未生效
dog.move() // "Dog is running"    ← 意外的新方法
```

```ts [2]
class Animal {
  // 旧名称：
  // move() {
  //   console.log('Animal is walking')
  // }

  // 方法从 move 重命名为 walk
  walk() {
    console.log('Animal is walking')
  }
}

class Dog extends Animal {
  // ❌ 编译错误：父类没有 move 方法
  override move() {
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

## 5. 什么时候应该使用 override 关键字？

选择策略：

1. 新项目：从一开始就启用 `noImplicitOverride` + 强制使用 `override`
2. 现有项目：
   - 渐进式迁移：先在新代码中使用
   - 重构关键路径时补充 `override`
3. 库开发：必须使用，保护用户免受 API 变更影响

使用场景：

| 场景                 | 是否使用 override | 理由                       |
| -------------------- | ----------------- | -------------------------- |
| 重写父类公开成员     | ✅ 强烈推荐       | 明确继承契约               |
| 实现抽象成员         | ❌ 不需要         | 本质是实现而非重写         |
| 重写第三方库类的成员 | ✅ 必须           | 防止库更新导致的破坏性变更 |
| 属性值覆盖           | ✅ 推荐           | 明确意图，避免混淆         |
| 临时测试代码         | ⚠️ 可选           | 看团队规范                 |

## 6. noImplicitOverride 编译选项是什么？

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

1. 不启用 `noImplicitOverride`
2. 启用 `noImplicitOverride`

::: code-group

```ts [1]
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

```ts [2]
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

// 不使用 override 会报错
class Dog1 extends Animal {
  // ❌ 错误：缺少 override 关键字
  move() {}
  // This member must have an 'override' modifier because it overrides a member in the base class 'Animal'.(4114)

  type = 'dog' // ❌ 错误：缺少 override 关键字
  // This member must have an 'override' modifier because it overrides a member in the base class 'Animal'.(4114)
}

// 重写父类成员必须加上 override 关键字
class Dog2 extends Animal {
  // ✅ 正确
  override move() {}
  // ✅ 正确
  override type = 'dog'
}
```

:::

## 7. 子类重写成员时有哪些类型约束？

核心原则：子类必须遵守“里氏替换原则”（Liskov Substitution Principle - 子类对象必须能够替换其父类对象出现的任何地方） —— 子类对象必须能替换父类对象而不破坏程序正确性。

示例：

```ts
class Animal {
  type: string | number = 'Animal'
}

class Dog extends Animal {
  // number 类型可以赋值给 string | number 类型
  override type: number = 1 // ✅ OK

  // string 类型可以赋值给 string | number 类型
  // override type: string = 'Dog' // ✅ OK

  // boolean类型不可以赋值给 string | number 类型
  // override type: boolean = false // ❌ Error
  // Property 'type' in type 'Dog' is not assignable to the same property in base type 'Animal'.
  // Type 'boolean' is not assignable to type 'string | number'.(2416)
}
```

更多有关方法、属性的具体约束规则：可以参考 `类型兼容性` 相关笔记。

## 8. 访问器（getter/setter）的重写规则是什么？

访问器重写遵循以下核心规则：

| 规则 | 说明 |
| --- | --- |
| 类型兼容性 | getter 返回类型、setter 参数类型必须兼容父类 |
| 只读变可写 | 父类只有 getter，子类可添加 setter |
| 可写变只读的限制 | 父类有 getter + setter，子类只重写 getter 会使该访问器在子类实例上变只读 |
| 独立重写 | getter 和 setter 可以独立重写，但都需要 `override` 关键字 |

示例：

1. ✅ 只读变可写
2. ❌ 返回类型不兼容
3. ⚠️ 可写变只读 - TS 允许，但是 JS 运行时会报错，这是一个 Bug

::: code-group

```ts [1]
class Animal {
  protected _age = 0

  get age(): number {
    return this._age
  }
}

class Dog extends Animal {
  // ✅ 重写 getter
  override get age(): number {
    return this._age * 3
  }

  // ✅ 添加 setter（只读变可写）
  override set age(value: number) {
    this._age = value / 2
  }
}

const dog = new Dog()
dog.age = 14 // 可写 - 写入后 this._age 是 7
console.log(dog.age) // 可读 - 读取后是 this._age * 3 => 21

const animal = new Animal()

// ❌ 只读 age 不能赋值
// animal.age = 1 // 只读 - 会报错
// Cannot assign to 'age' because it is a read-only property.(2540)

console.log(animal.age) // 可读，结果是 0
```

```ts [2]
class Animal {
  protected _age = 0

  get age(): number {
    return this._age
  }

  set age(value: number) {
    this._age = value
  }
}

class Dog extends Animal {
  // ❌ 错误：返回类型不兼容
  override get age(): string {
    return String(this._age)
  }
  // Property 'age' in type 'Dog' is not assignable to the same property in base type 'Animal'.
  //   Type 'string' is not assignable to type 'number'.(2416)
}
```

```ts [3]
class Animal {
  protected _age = 0

  get age(): number {
    return this._age
  }

  set age(value: number) {
    this._age = value
  }
}

class Dog extends Animal {
  // ⚠️ 允许只重写 getter，不重写 setter
  override get age(): number {
    return this._age * 7
  }
  // 缺少 setter
}

// 类型系统允许，但会产生副作用
const animal: Animal = new Dog()
console.log(animal.age) // 0

// ⚠️ 编译通过，类型层面不报错
animal.age = 3 // ❌ 运行时会报错
// Cannot set property age of #<Dog> which has only a getter

// 编译后得到的 JS：
/* 
"use strict";
class Animal {
    constructor() {
        this._age = 0;
    }
    get age() {
        return this._age;
    }
    set age(value) {
        this._age = value;
    }
}
class Dog extends Animal {
    get age() {
        return this._age * 7;
    }
}
const animal = new Dog();
console.log(animal.age);
animal.age = 3;
 */
```

:::

最佳实践：如果父类同时有 getter 和 setter，子类重写时也应该同时重写两者，避免混淆。

::: warning ⚠️ TypeScript 的已知设计缺陷

3 中提到的这个问题在 [Issue #43662][4] 中被提出，但官方决定不修复，主要原因：

1. 修复会导致大量现有代码破坏性变更
2. TypeScript 的类型系统本就接受某些不安全的情况作为权衡
3. 实际开发中影响相对有限

推荐做法：如果父类有 setter，子类重写时也应提供 setter，避免运行时错误。

:::

## 9. 属性重写与方法重写有什么区别？

| 特性         | 属性重写                       | 方法重写                     |
| ------------ | ------------------------------ | ---------------------------- |
| 语义         | 值的覆盖                       | 行为的替换                   |
| super 调用   | ❌ 不支持                      | ✅ 支持 `super.method()`     |
| 初始化时机   | 构造函数执行时按顺序赋值       | 原型链查找                   |
| 多态支持     | ❌ 静态绑定 - 不支持运行时多态 | ✅ 动态绑定 - 支持运行时多态 |
| 推荐使用场景 | 简单数据覆盖                   | 行为扩展或替换               |

关键差异：方法重写支持真正的多态（父类构造函数中调用的是子类方法），而属性重写在构造期间会按顺序赋值（父类构造函数中看到的是父类属性值）。

1. 属性重写的执行时机
2. 方法重写的执行时机
3. 属性重写的静态绑定
4. 方法重写的动态绑定

::: tip 💡 提示

下面的示例可以结合着注释中记录的编译后得到的等效 JS 版来理解。

:::

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

// 编译后的 JS 如下（移除注释后的内容）：
/*
"use strict";
class Animal {
    constructor() {
        this.type = 'animal';
        console.log('Animal constructor:', this.type);
    }
}
class Dog extends Animal {
    constructor() {
        super();
        this.type = 'dog';
        console.log('Dog constructor:', this.type);
    }
}
new Dog();
*/
```

```ts [2]
class Animal {
  getType() {
    return 'animal'
  }

  constructor() {
    console.log('Animal constructor:', this.getType())
    // 这里调用 this.getType() 时：
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
// Dog.prototype { getType: [Function: getType] } ← 如果是从 dog 实例找 getType 的话，找到这里就找到了，不会再继续向后查找。
//   ↓ [[Prototype]]
// Animal.prototype { getType: [Function: getType] }  ← 被子类覆盖，不会被调用
//   ↓ [[Prototype]]
// Object.prototype

// 编译后的 JS 如下（移除注释后的内容）：
/* 
"use strict";
class Animal {
    getType() {
        return 'animal';
    }
    constructor() {
        console.log('Animal constructor:', this.getType());
    }
}
class Dog extends Animal {
    getType() {
        return 'dog';
    }
}
new Dog();
 */
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

// Q：为什么会说“属性重写”是“弱多态”？
// A：因为在父类构造函数执行期间，子类的属性赋值还没有发生，所以父类看到的是自己的属性值，而不是子类的。

// 编译后的 JS 如下（移除注释后的内容）：
/* 
"use strict";
class Animal {
    showType() {
        console.log('Type:', this.type);
    }
    constructor() {
        this.type = 'animal';
        this.showType();
    }
}
class Dog extends Animal {
    constructor() {
        super();
        this.type = 'dog';
    }
}
new Dog();
 */
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

// Q：为什么会说“方法重写”是“强多态”？
// A：因为方法存储在原型链上，this.method() 调用会在运行时动态查找，无论何时调用（包括父类构造函数中），都会找到子类的方法。

// 编译后的 JS 如下（移除注释后的内容）：
/* 
"use strict";
class Animal {
    getType() {
        return 'animal';
    }
    showType() {
        console.log('Type:', this.getType());
    }
    constructor() {
        this.showType();
    }
}
class Dog extends Animal {
    getType() {
        return 'dog';
    }
    constructor() {
        super();
    }
}
new Dog();
 */
```

:::

实战建议：

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

这就是为什么在面向对象设计中，推荐使用“模板方法模式”（通过方法实现多态）而不是“依赖属性值”（容易出现时序问题）的原因！

小结：

属性与方法的多态存在区别的根本原因是：属性赋值的滞后性

| 问题               | 根本原因                                         |
| ------------------ | ------------------------------------------------ |
| 属性重写弱多态     | 属性赋值滞后（在 super() 返回后才执行）          |
| 方法重写强多态     | 方法提前挂载在原型上，调用时动态查找             |
| 为何 TS 要这样设计 | 这是 ES 规范，而 TS 是 JS 的超集，只能按照规范来 |
| 如何避免问题       | 用方法代替属性来实现多态行为                     |

一句话总结：属性是“先父后子”顺序赋值的，所以父类构造函数中看到的是“过时”的值；而方法是"原型链查找"的，所以任何时候都能找到"最新"的子类实现。这就是属性赋值滞后性导致的多态差异！

::: warning ⚠️ 注意

本笔记使用了"弱多态"、"强多态"这两个非标准术语来描述属性和方法的多态差异。在学术和工业界，更准确的表述是：

- 属性重写：采用静态绑定（Static Binding 编译时确定赋值顺序） - 就是笔记中提到的“弱多态”
- 方法重写：支持动态绑定（Dynamic Binding 运行时通过原型链查找） - 就是笔记中提到的“强多态”

:::

## 10. 引用

- [noImplicitOverride][1]
- [TypeScript 4.3 Release Notes - override][2]
- [Classes 类][3]
- [Allow setter type to be incompatible with the getter type #43662][4]

[1]: https://www.typescriptlang.org/tsconfig/#noImplicitOverride
[2]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-3.html#override-and-the-noimplicitoverride-flag
[3]: https://www.typescriptlang.org/docs/handbook/2/classes.html
[4]: https://github.com/microsoft/TypeScript/issues/43662
