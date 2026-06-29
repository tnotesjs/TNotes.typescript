# [0055. 类中的 this](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0055.%20%E7%B1%BB%E4%B8%AD%E7%9A%84%20this)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. `this 参数` 是什么？](#3-this-参数-是什么)
  - [3.1. 问题背景](#31-问题背景)
  - [3.2. 解决方案 1：使用箭头函数（非最优解）](#32-解决方案-1使用箭头函数非最优解)
  - [3.3. 解决方案 2：显示声明 this 参数](#33-解决方案-2显示声明-this-参数)
  - [3.4. ⚠️ 注意事项](#34-️-注意事项)
- [4. `this 类型` 是什么？](#4-this-类型-是什么)
- [5. `this is Type` 是什么？](#5-this-is-type-是什么)
- [6. 引用](#6-引用)

<!-- endregion:toc -->

## 1. 本节内容

- this 参数（用于约束方法调用时的上下文绑定）
- this 类型（随继承自动收窄为最具体子类的自引用类型）
- this is Type（基于 this 的类型守卫机制）

## 2. 评价

`this` 参数、`this` 类型和 `this is Type` 是 TypeScript 类系统中三个独立但相关的特性，它们从不同角度解决了类型安全问题。

| 概念 | 位置 | 核心作用 |
| --- | --- | --- |
| `this` 参数 | 方法参数列表首位的伪参数 | 编译期约束调用上下文，防止 `this` 绑定错误 |
| `this` 类型 | 方法参数/返回值的类型标注 | 继承时自动收窄为最具体子类，实现类型安全多态 |
| `this is Type` | 方法返回类型的类型谓词 | 将运行时检查结果映射为编译期类型收窄，安全访问子类特有属性/方法 |

三者协同工作，共同构建 TypeScript 类系统中强大而安全的 `this` 处理机制，是编写类型安全、可维护的面向对象代码的关键基础。

## 3. `this 参数` 是什么？

跟函数中的 this 参数非常像，它也是一个伪参数，编译后会被移除，主要起一个类型约束的作用。

核心作用：使用“this 参数”处理运行时类中的 this 指向问题。

### 3.1. 问题背景

在 TypeScript（以及 JavaScript）中，类的方法内部经常使用 `this` 关键字来访问实例属性或方法。然而，`this` 的实际指向取决于函数的调用方式，而不是定义位置。这可能导致运行时错误（如 `this` 为 `undefined`）或类型不安全。

```ts
class MyClass {
  name = 'MyClass'
  getName() {
    return this.name
  }
}
const c = new MyClass()
const obj = {
  name: 'obj',
  getName: c.getName,
}

// ⚠️ Prints "obj", not "MyClass"
console.log(obj.getName()) // "obj"
```

### 3.2. 解决方案 1：使用箭头函数（非最优解）

```ts
class MyClass {
  name = 'MyClass'
  getName = () => {
    return this.name
  }
}
const c = new MyClass()
const obj = {
  name: 'obj',
  getName: c.getName,
}

console.log(obj.getName()) // "MyClass"
```

### 3.3. 解决方案 2：显示声明 this 参数

显式声明 `this: Type` 参数类型（控制调用上下文） -> 约束调用上下文，防止 `this` 丢失。

```ts
class MyClass {
  name = 'MyClass'
  getName(this: MyClass) {
    return this.name
  }
}
const c = new MyClass()
// OK
c.getName()

const g = c.getName
console.log(g()) // ❌ Error, would crash
// The 'this' context of type 'void' is not assignable to method's 'this' of type 'MyClass'.(2684)
```

TypeScript 允许在函数或方法的参数列表最前面添加一个名为 `this` 的虚拟参数，用于显式指定该函数内部 `this` 的预期类型。

```ts
class A {
  className = 'A'

  // this: A 明确将 this 限定为 A 类型
  printName(this: A) {
    console.log('this.className =>', this.className)
  }
}
```

`this: A` 声明也不是全能的，有些情况它也无法检测出来。

- 情况 1：编译期检查 `this` 上下文
  - 如果方法被“解构”调用（脱离原对象）。
  - 这种情况加上 this 约束之后，TS 能帮我们检查出来，并会及时报错。
- 情况 2：运行时 `this` 丢失
  - 常见于事件回调、高阶函数、setTimeout 等场景。
  - 这种情况 TS 还检查不出来，如果有类型安全检查的需要，我们可以借助泛型工具，自行对这些情况中的调用场景进行二次封装，使其类型变得更加安全。

示例：

1. 不加 this 声明
2. 加上 this 声明
3. 更安全的 setTimeout

::: code-group

```ts [1]
class A {
  className = 'A'

  printName() {
    console.log('this.className =>', this.className)
  }
}

const a = new A()
const fn = a.printName
fn() // ⚠️ 不会报错，但这里这么调用是错误的，我们更希望行为是这里要有报错提示
```

```ts [2]
class A {
  className = 'A'

  printName(this: A) {
    console.log('this.className =>', this.className)
  }
}

const a = new A()

// 脱离原对象的情况：

// 情况1：
// const fn1 = a.printName // 只取方法，不绑定对象
// fn1() // ❌ 报错
// The 'this' context of type 'void' is not assignable to method's 'this' of type 'A'.(2684)

const fn2 = a.printName.bind(a) // ✅ 推荐做法
fn2()
// "this.className =>",  "A"

// 情况2：
setTimeout(a.printName, 1000) // ⚠️ 编译通过，但运行时 this 为 undefined，导致报错。
// "this.className =>",  undefined

setTimeout(a.printName.bind(a), 1000) // ✅ 推荐做法
// "this.className =>",  "A"
```

```ts [3]
class A {
  className = 'A'

  printName(this: A) {
    console.log('this.className =>', this.className)
  }
}

const a = new A()

setTimeout(a.printName, 1000) // 不安全
// "this.className =>"
// undefined

safeSetTimeout(a.printName, a, 1000) // 安全
// "this.className =>"
// "A"

// 通过前面的示例，我们知道 setTimeout(a.printName, 1000) 这么写 TS 是不会给予错误提示的。
// 根本原因在于 setTimeout 函数的类型约束，本身比较宽泛：你只要给它传递的是一个 Function 类型它都会直接放行。
// 下面是 setTimeout 的类型定义：
// declare function setTimeout(handler: TimerHandler, timeout?: number, ...arguments: any[]): number;
// type TimerHandler = string | Function;
// 类型安全的 setTimeout 包装器
function safeSetTimeout<T extends (this: This, ...args: any[]) => void, This>(
  callback: T,
  thisArg: This,
  ms: number,
  ...args: Parameters<T>
) {
  return setTimeout(callback.bind(thisArg, ...args), ms)
}
```

:::

### 3.4. ⚠️ 注意事项

- `this` 参数不生成实际的 JavaScript 代码，仅用于类型检查。
- 必须放在参数列表第一位，且不能与其他参数混淆。
- 在普通类方法中，TS 通常能自动推断 `this` 为当前类类型，显式声明主要用于增强安全性或库开发。

## 4. `this 类型` 是什么？

类中的 this 类型是一个特殊类型，用于表示当前类实例的类型。通常用在方法参数/返回值的类型标注位置。

核心作用：继承时自动收窄为最具体子类，实现类型安全多态。

官方描述如下：

In classes, a special type called this refers dynamically to the type of the current class.

在类中，`this` 是一个特殊的类型，`this` 动态指向“当前实例所属的最具体的类类型”（即多态的 this / F-bounded Polymorphism）。

以下是一个官方示例：

```ts
class Box {
  content: string = ''
  sameAs(other: this) {
    return other.content === this.content
  }
}

class DerivedBox extends Box {
  otherContent: string = '?'
}

const base = new Box()
const derived = new DerivedBox()

derived.sameAs(base) // ❌
// Argument of type 'Box' is not assignable to parameter of type 'DerivedBox'.
```

- 在 `Box` 中，`sameAs(other: this)` 的 `this` = `Box`
- 在 `DerivedBox` 中继承后，`sameAs` 的 `this` 重新解释为 `DerivedBox`
- 所以 `derived.sameAs(base)` 传入的 `base`（类型为 `Box`）不再满足 `DerivedBox`

如果把签名改成 `sameAs(other: Box)`，就不会报错，但也失去了“派生类自动精确化”的好处。

## 5. `this is Type` 是什么？

`this is Type` 表示 this 基于类型的守卫（this based type guards），是用于方法返回类型的类型谓词。

`this is Type` 形式的类型守卫是一种特殊的类型谓词，用于在类的方法中根据运行时检查来收窄 `this` 的类型。这种机制可以实现运行时类型识别和类型安全的访问。

- 语法：`this is Type` 作为方法的返回类型；
- 作用：在条件语句中根据运行时检查动态确定对象的具体类型；
  - 无需手动类型断言，TS 自动处理类型推断
  - 在继承体系中能够正确识别具体子类类型
  - 将运行时检查（如 `instanceof`）的结果转换为编译期类型信息，安全访问子类特有属性/方法
- 用法：通常结合 `instanceof` 或其他运行时检查实现动态类型识别；

```ts
class FileSystemObject {
  // this is FileRep 是一个类型守卫
  // 当返回 true 时，TypeScript 知道 this 是 FileRep 类型
  isFile(): this is FileRep {
    return this instanceof FileRep
  }

  // 同样，这个守卫告诉 TypeScript 当返回 true 时 this 是 Directory 类型
  isDirectory(): this is Directory {
    return this instanceof Directory
  }

  // 这个守卫结合了接口和 this 类型
  // 当返回 true 时，this 同时具有 Networked 接口的特性
  isNetworked(): this is Networked & this {
    return this.networked
  }

  // 构造函数中定义了公共 path 属性和私有 networked 属性
  constructor(
    public path: string,
    private networked: boolean,
  ) {}
}

class FileRep extends FileSystemObject {
  // FileRep 特有的 content 属性
  constructor(
    path: string,
    public content: string,
  ) {
    super(path, false) // 调用父类构造函数
  }
}

class Directory extends FileSystemObject {
  // Directory 特有的 children 属性
  children: FileSystemObject[] = []
}

// 定义网络化对象应该具有的属性
interface Networked {
  host: string
}

// 创建一个 FileRep 实例，但类型声明为基类 FileSystemObject
const fso: FileSystemObject = new FileRep('foo/bar.txt', 'foo')

// 使用类型守卫进行类型收窄
if (fso.isFile()) {
  // 在这个代码块中，TypeScript 知道 fso 是 FileRep 类型
  // 因此可以安全访问 content 属性
  fso.content
  // const fso: FileRep
} else if (fso.isDirectory()) {
  // 在这个代码块中，TypeScript 知道 fso 是 Directory 类型
  // 可以安全访问 children 属性
  fso.children
  // const fso: Directory
} else if (fso.isNetworked()) {
  // 在这个代码块中，TypeScript 知道 fso 具有 Networked 接口的特性
  // 可以安全访问 host 属性
  fso.host
  // const fso: Networked & FileSystemObject
}
```

这种模式特别适用于需要处理具有不同特性的同类对象集合的场景，比如文件系统、UI 组件树或状态管理等。

`this is Type` 也可以用来对特定字段进行延迟验证。

```ts
class Box<T> {
  value?: T

  hasValue(): this is { value: T } {
    return this.value !== undefined
  }
}

const box = new Box<string>()
box.value = 'Gameboy'

box.value
// (property) Box<string>.value?: string
// 此时 box.value 的类型是 string | undefined

if (box.hasValue()) {
  box.value
  // (property) value: string

  // 进入到这个分支之后， box.value 就是确定的 string 类型了。
}
```

## 6. 引用

- [Classes 类][1]

[1]: https://www.typescriptlang.org/docs/handbook/2/classes.html
