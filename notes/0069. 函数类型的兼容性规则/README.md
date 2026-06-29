# [0069. 函数类型的兼容性规则](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0069.%20%E5%87%BD%E6%95%B0%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%85%BC%E5%AE%B9%E6%80%A7%E8%A7%84%E5%88%99)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 核心原则](#3-核心原则)
- [4. 函数类型的兼容性规则是什么？](#4-函数类型的兼容性规则是什么)
  - [4.1. 基本规则](#41-基本规则)
  - [4.2. 明确“源函数”和“目标函数”](#42-明确源函数和目标函数)
- [5. 参数的兼容性规则是？](#5-参数的兼容性规则是)
  - [5.1. 参数类型](#51-参数类型)
  - [5.2. 可选参数](#52-可选参数)
  - [5.3. 参数数量](#53-参数数量)
  - [5.4. 剩余参数](#54-剩余参数)
  - [5.5. 只读参数](#55-只读参数)
- [6. 返回值类型的约束规则是？](#6-返回值类型的约束规则是)
- [7. `strictFunctionTypes` 对函数参数检查的有什么影响？](#7-strictfunctiontypes-对函数参数检查的有什么影响)
- [8. 类、接口方法的宽松双变规则是？](#8-类接口方法的宽松双变规则是)
  - [8.1. 类、接口方法的宽松双变规则](#81-类接口方法的宽松双变规则)
  - [8.2. 🔍 来看看官方是怎么说的](#82--来看看官方是怎么说的)
- [9. 引用](#9-引用)

<!-- endregion:toc -->

## 1. 本节内容

- “逆变”（Contravariance）
  - 也叫“反变”
- “双变”（Bivariant）
- “协变”（Covariance）
- strictFunctionTypes

## 2. 评价

函数类型的兼容性比较复杂，它需要多绕一下，不能直接暴力走父子类型那一套，需要具体看是约束函数参数还是约束函数返回值，参数的约束和返回值的约束规则正好是相反的。

先回顾一下正常的父子类型的可赋值逻辑：

```ts
父类型 = 子类型 // ✅ 兼容
子类型 = 父类型 // ❌ 不兼容
```

函数类型的兼容性判断规则如下：

```ts
// 返回值 “协变”（Covariance） - 正常
父类型 = 子类型 // ✅ 兼容
子类型 = 父类型 // ❌ 不兼容
// 参数 “逆变”（Contravariance） - 相反
父类型 = 子类型 // ❌ 不兼容
子类型 = 父类型 // ✅ 兼容
```

- “协变”（Covariance）
  - 返回类型的约束规则
  - 源函数的返回可以比目标函数更具体
  - 和父子类型的可赋值性相同（源函数的返回值类型要求是子类型）
- “逆变”（Contravariance）
  - 参数类型的约束规则
  - 源函数的参数可以比目标函数更宽泛
  - 和父子类型的可赋值性正好相反（源函数的参数类型要求是父类型）

## 3. 核心原则

函数类型的兼容性规则，记住核心原则可以帮我们更好地判断两个函数类型是是否兼容。

函数的约束无非就俩位置：

1. 返回值位置
   - “协变”（Covariance）
   - 我们还是按照正常的“子可以冒充父”那套兼容性规则来判断即可
   - `父类型 = 子类型 // ✅ 兼容`
   - `子类型 = 父类型 // ❌ 不兼容`
2. 参数位置
   - “逆变”（Contravariance）
   - 兼容性判断规则和我们理解的正常规则恰好是相反的
   - `父类型 = 子类型 // ❌ 不兼容`
   - `子类型 = 父类型 // ✅ 兼容`

“双变”（Bivariant）也是用来描述“函数参数”的，相当于协变、逆变的结合体。

- `父类型 = 子类型 // ✅ 兼容`
- `子类型 = 父类型 // ✅ 兼容`

如果是普通函数，当我们关闭 `strictFunctionTypes` 时，参数类型检查会采用双变策略，当我们开启 `strictFunctionTypes` 时，参数类型检查会采用逆变策略。

还有一个注意点就是类和接口中的方法，它们的参数始终都采用双变策略。

## 4. 函数类型的兼容性规则是什么？

函数兼容性遵循“逆变”（Contravariance）和“协变”（Covariance）规则。

### 4.1. 基本规则

- 参数类型：逆变 -> 源函数的参数可以比目标函数更宽泛
- 返回类型：协变 -> 源函数的返回可以比目标函数更具体

基于上述基本规则，能衍生出很多场景，以参数类型的逆变约束为例：

- 参数数量：参数数量多的更具体，参数数量少的更宽泛，因此可以将参数数量少的函数传递给参数数量多的函数，反之不行；
- 参数类型：可以将参数类型更宽泛的函数传递给参数类型更具体的函数，反之不行；

### 4.2. 明确“源函数”和“目标函数”

- 源函数表示我们传入的函数；
- 目标函数表示被赋值的函数；

如果用赋值运算符来表示，它们之间的关系如下：

```ts
目标函数 = 源函数
```

## 5. 参数的兼容性规则是？

其实很简单，你只需要把常规的逻辑逆转一下就行了。

示例：

- 常规逻辑：`"hello"` 是 `string` 的子类型，`string` 是 `"hello"` 的父类型，因此 `"hello"` 可以赋给 `string`，但是 `string` 不能赋给 `"hello"`。
- 函数参数：如果用于函数参数，则正好是常规逻辑的反面。

::: code-group

```ts [常规逻辑]
// 普通赋值：子类型 → 父类型 ✅
let s: string = 'hello'
let literal: 'hello' = 'hello'
// s = literal // ✅ OK
// literal = s // ❌ Error: Type 'string' is not assignable to type '"hello"'
```

```ts [函数参数]
// 函数参数：父类型 → 子类型 ✅（参数类型是反变的）
type FnLiteral = (x: 'hello') => void
type FnStriing = (x: string) => void

let f1: FnLiteral = (x: 'hello') => console.log(x)
let f2: FnStriing = (x: string) => console.log(x)

// string 可以赋值给 'hello'
f1 = f2 // ✅ OK

// 'hello' 不能赋值给 string
// f2 = f1 // ❌ Error

// Type 'FnLiteral' is not assignable to type 'FnStriing'.
//   Types of parameters 'x' and 'x' are incompatible.
//     Type 'string' is not assignable to type '"hello"'.(2322)
```

:::

对于函数参数，具体的约束原则是：

- 参数更宽泛的（父类型）可以赋值给参数更具体的（子类型）；
- 参数更具体的（子类型）不能赋值给参数更宽泛的（父类型）；

### 5.1. 参数类型

```ts
type MouseEventHandler = (event: MouseEvent) => void
type EventHandler = (event: Event) => void

let f1: MouseEventHandler = (event: MouseEvent) => {}
let f2: EventHandler = (event: Event) => {}

f1 = f2 // ✅ 兼容，Event 比 MouseEvent 更宽泛
// f2 = f1 // ❌ 不兼容
// 报错信息如下：
// Type 'MouseEventHandler' is not assignable to type 'EventHandler'.
//   Types of parameters 'event' and 'event' are incompatible.
//     Type 'Event' is missing the following properties from type 'MouseEvent': altKey, button, buttons, clientX, and 23 more.(2322)
```

- 宽泛的父类型：`Event`（父）
- 具体的子类型：`MouseEvent`（子）

### 5.2. 可选参数

<!-- 类型不兼容就不用考虑了，如果类型不兼容会直接报错，下面我们来看同类型的情况。

先说答案：

- 约束少的可以赋值给约束多的 -> 可选的可以赋给必填的
- 约束多的不能赋值给约束少的 -> 必填的不能赋给可选的

那么如何判断可选属性和必填属性的约束谁多谁少呢？

可选参数可以视作 `| undefined` 类型，比如 `b?: string` 类型是 `b: string | undefined`。

- 可选属性 - `string | undefined` - 约束少 - 可以是字符串也可以是空
- 必填属性 - `string` - 约束多 - 只能是字符串

示例： -->

```ts
type FuncWithOptional = (a: string, b?: string) => void
type FuncWithRest = (...args: string[]) => void
type FuncRequired = (a: string, b: string) => void

let optional: FuncWithOptional = (a: string, b?: string) => {}
let rest: FuncWithRest = (...args: string[]) => {}
let required: FuncRequired = (a: string, b: string) => {}

rest = optional // ✅ 兼容 - string | undefined 可以赋值给 string
required = optional // ✅ 兼容 - string | undefined 可以赋值给 string
// optional = rest // ❌ 不兼容 - string 不能赋值给 string | undefined
// optional = required // ❌ 不兼容 - string 不能赋值给 string | undefined
```

- 宽泛的父类型：`string | undefined`（父）
- 具体的子类型：`string`（子）

### 5.3. 参数数量

```ts
type Func1 = (a: string) => void
type Func2 = (a: string, b: number) => void

let f1: Func1 = (a: string) => {}
let f2: Func2 = (a: string, b: number) => {}

f2 = f1 // ✅ 兼容 - 参数少的可以赋值给参数多的
// f1 = f2  // ❌ 不兼容 - 参数多的不能赋值给参数少的
// 报错信息：
// Type 'Func2' is not assignable to type 'Func1'.
//   Target signature provides too few arguments. Expected 2 or more, but got 1.(2322)
```

- 宽泛的是：参数数量少的（父）
- 具体的是：参数数量多的（子）

### 5.4. 剩余参数

剩余参数又是一个比较特殊的存在，得看具体的类型。

比如，如果剩余参数是 `...args: any[]`，那么无论是赋值还是被赋值都不会检查。

- 剩余参数 `...args: any[]` 函数可以安全地赋值给固定参数函数；
- 固定参数函数也可以安全地赋值给剩余参数 `...args: any[]` 函数；

```ts
type FuncWithOptional = (a: string, b?: number) => void
type FuncWithRest = (...args: any[]) => void
type FuncRequired = (a: string, b: number) => void

let optional: FuncWithOptional = (a: string, b?: number) => {}
let rest: FuncWithRest = (...args: any[]) => {}
let required: FuncRequired = (a: string, b: number) => {}

rest = optional // ✅ 兼容
rest = required // ✅ 兼容
optional = rest // ✅ 兼容
required = rest // ✅ 兼容
```

如果剩余参数是 `string[]`，那么只要参数类型不匹配，就会报错。

::: code-group

```ts [1]
type FuncWithOptional = (a: string, b?: number) => void
type FuncWithRest = (...args: string[]) => void
type FuncRequired = (a: string, b: number) => void

let optional: FuncWithOptional = (a: string, b?: number) => {}
let rest: FuncWithRest = (...args: string[]) => {}
let required: FuncRequired = (a: string, b: number) => {}

rest = optional // ❌ 不兼容
rest = required // ❌ 不兼容
optional = rest // ❌ 不兼容
required = rest // ❌ 不兼容
```

```ts [2]
type FuncWithOptional = (a: string, b?: string) => void
type FuncWithRest = (...args: string[]) => void
type FuncRequired = (a: string, b: string) => void

let optional: FuncWithOptional = (a: string, b?: string) => {}
let rest: FuncWithRest = (...args: string[]) => {}
let required: FuncRequired = (a: string, b: string) => {}

rest = optional // ✅ 兼容
rest = required // ✅ 兼容
optional = rest // ❌ 不兼容 具体的 string 不能赋值给宽泛的 string | undefined
required = rest // ✅ 兼容
```

:::

### 5.5. 只读参数

```ts
type FuncWithReadonly = (a: readonly string[]) => void
type Func = (a: string[]) => void

let f1: FuncWithReadonly = (a: readonly string[]) => {}
let f2: Func = (a: string[]) => {}

f2 = f1 // ✅ 兼容
// f1 = f2 // ❌ 不兼容
// 报错信息：
// Type 'Func' is not assignable to type 'FuncWithReadonly'.
//   Types of parameters 'a' and 'a' are incompatible.
//     The type 'readonly string[]' is 'readonly' and cannot be assigned to the mutable type 'string[]'.(2322)
```

常规逻辑：

- 父类型是：`readonly string[]`
- 子类型是：`string[]`
- `readonly string[] = string[]` ✅
  - 类比：可读可写的编辑器可以被用作只读的编辑器；
- `string[] = readonly string[]` ❌
  - 只读的编辑器无法被用作可读可写的编辑器；

用在函数参数层面，正好反转：

- `readonly string[] = string[]` ❌
- `string[] = readonly string[]` ✅

## 6. 返回值类型的约束规则是？

返回值的类型约束规则（“协变” Covariance）就正常多了，和我们前面提到的笔记 `类型的父子关系` 中描述的是一样的逻辑。

- `父类型 = 子类型` ✅
- `子类型 = 父类型` ❌

```ts
type F1 = () => HTMLElement
type F2 = () => HTMLDivElement

const createDiv: F2 = () => {
  return document.createElement('div') // HTMLDivElement
}

const createEle: F1 = createDiv // ✅ 兼容
const createDiv2: F2 = createEle // ❌ 不兼容
// 报错信息：
// Type 'F1' is not assignable to type 'F2'.
//   Property 'align' is missing in type 'HTMLElement' but required in type 'HTMLDivElement'.(2322)
```

- `HTMLDivElement` 是子类型
- `HTMLElement` 是父类型

## 7. `strictFunctionTypes` 对函数参数检查的有什么影响？

TypeScript 的【函数参数“逆变”（Contravariance）原则】在概念上是正确的，但实际的类型检查行为受到编译选项的影响。

- 当 `strictFunctionTypes: true` 时
  - 参数类型会被严格地按 逆变 规则检查
  - 这意味着函数类型兼容性和上面提到的内容完全一致
- 当 `strictFunctionTypes: false` 时
  - TypeScript 会采用一种【双变（Bivariant）策略】，即参数既可以协变也可以逆变（更宽松但可能不安全）。
  - 这样做是为了兼容旧版本或减少误报，但可能隐藏类型问题。

::: code-group

```ts [strictFunctionTypes 开启]
// 使用逆变策略
type FnLiteral = (x: 'hello') => void
type FnStriing = (x: string) => void

let f1: FnLiteral = (x: 'hello') => console.log(x)
let f2: FnStriing = (x: string) => console.log(x)

// string 可以赋值给 'hello'
f1 = f2 // ✅ OK

// 逆变策略生效：
// 'hello' 不能赋值给 string
// f2 = f1 // ❌ Error

// Type 'FnLiteral' is not assignable to type 'FnStriing'.
//   Types of parameters 'x' and 'x' are incompatible.
//     Type 'string' is not assignable to type '"hello"'.(2322)
```

```ts [strictFunctionTypes 关闭]
// 使用双变策略
type FnLiteral = (x: 'hello') => void
type FnStriing = (x: string) => void

let f1: FnLiteral = (x: 'hello') => console.log(x)
let f2: FnStriing = (x: string) => console.log(x)

// 符合逆变规则：string 可以赋值给 'hello'
f1 = f2 // ✅ OK

// 符合协变规则：'hello' 可以赋值给 string
f2 = f1 // ✅ OK
```

:::

建议：在实际项目中，确保在 `tsconfig.json` 中启用严格模式

```json
{
  "compilerOptions": {
    // 开启 strict
    "strict": true
    // 或单独启用：
    // "strictFunctionTypes": true
  }
}
```

## 8. 类、接口方法的宽松双变规则是？

### 8.1. 类、接口方法的宽松双变规则

来自类或接口的方法不会应用严格的函数参数检查（即使开启了 `strictFunctionTypes`），依旧会采用宽松的双变策略，这是出于历史兼容性考虑。

| 场景         | 参数检查行为 | 是否受 `strictFunctionTypes` 影响 |
| ------------ | ------------ | --------------------------------- |
| 普通函数类型 | 严格反变     | ✅ 是                             |
| 类、接口方法 | 宽松双变     | ❌ 否                             |

::: code-group

```ts [普通函数类型]
// strictFunctionTypes 启用

type Animal = { name: string }
type Dog = { name: string; breed: string }

type FuncA = (arg: Animal) => void
type FuncB = (arg: Dog) => void

let fA: FuncA = (x) => console.log(x.name)
let fB: FuncB = (x) => console.log(x.name, x.breed)

// 参数逆变检查生效
// fA = fB // ❌ Error（子不能赋值给父）
fB = fA // ✅ OK（父可以赋值给子）
```

```ts [类、接口方法]
// strictFunctionTypes 启用

type Animal = { name: string }
type Dog = { name: string; breed: string }

interface HandlerA {
  handle(x: Animal): void
}
interface HandlerB {
  handle(x: Dog): void
}

let hA: HandlerA = {
  handle: (x) => console.log(x.name),
}
let hB: HandlerB = {
  handle: (x) => console.log(x.name, x.breed),
}

// 不会触发逆变检查规则，而是
hA = hB // ✅ OK
hB = hA // ✅ OK
hA.handle = hB.handle // ✅ OK
hB.handle = hA.handle // ✅ OK
```

:::

### 8.2. 🔍 来看看官方是怎么说的

Strict Function Types - 严格函数类型 `strictFunctionTypes`

When enabled, this flag causes functions parameters to be checked more correctly.

启用此标志后，函数参数将得到更严格的类型检查。

Here’s a basic example with strictFunctionTypes off:

这是一个关闭 strictFunctionTypes 的基本示例：

```ts
function fn(x: string) {
  console.log('Hello, ' + x.toLowerCase())
}

type StringOrNumberFunc = (ns: string | number) => void

// Unsafe assignment
// 不安全的赋值操作
let func: StringOrNumberFunc = fn

// Unsafe call - will crash
// 不安全的调用，这会导致程序崩溃。
func(10)
```

With strictFunctionTypes on, the error is correctly detected:

当开启 strictFunctionTypes 时，错误会被正确检测到：

```ts
function fn(x: string) {
  console.log('Hello, ' + x.toLowerCase())
}

type StringOrNumberFunc = (ns: string | number) => void

// Unsafe assignment is prevented
// 不安全的赋值操作将会被避免
let func: StringOrNumberFunc = fn // ❌ 报错
// Type '(x: string) => void' is not assignable to type 'StringOrNumberFunc'.
//   Types of parameters 'x' and 'ns' are incompatible.
//     Type 'string | number' is not assignable to type 'string'.
//       Type 'number' is not assignable to type 'string'.
```

During development of this feature, we discovered a large number of inherently unsafe class hierarchies, including some in the DOM. Because of this, the setting only applies to functions written in function syntax, not to those in method syntax:

在开发此功能的过程中，我们发现大量本质上不安全的类层次结构，包括 DOM 中的一些。因此，此设置仅适用于使用函数语法编写的函数，而不适用于使用方法语法编写的函数：

```ts
type Methodish = {
  func(x: string | number): void
}

function fn(x: string) {
  console.log('Hello, ' + x.toLowerCase())
}

// Ultimately an unsafe assignment, but not detected
// 这是一个不安全的赋值操作，但最终并未被检测出来。
const m: Methodish = {
  func: fn,
}
m.func(10)
```

## 9. 引用

- [strictFunctionTypes][1]

[1]: https://www.typescriptlang.org/tsconfig/#strictFunctionTypes
