# [0022. symbol 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0022.%20symbol%20%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. symbol 类型是什么？](#3-symbol-类型是什么)
- [4. 什么是 unique symbol 类型？](#4-什么是-unique-symbol-类型)
- [5. 为什么需要 unique symbol 类型？](#5-为什么需要-unique-symbol-类型)
- [6. unique symbol 类型的变量有什么限制？](#6-unique-symbol-类型的变量有什么限制)
- [7. const 声明 Symbol 值时的类型推断是怎样的？](#7-const-声明-symbol-值时的类型推断是怎样的)
- [8. 不同的 unique symbol 类型变量之间可以比较吗？](#8-不同的-unique-symbol-类型变量之间可以比较吗)
- [9. unique symbol 类型的变量可以相互赋值吗？](#9-unique-symbol-类型的变量可以相互赋值吗)
- [10. Symbol.for() 方法对 unique symbol 类型有何影响？](#10-symbolfor-方法对-unique-symbol-类型有何影响)
- [11. unique symbol 和 symbol 类型之间有什么关系？](#11-unique-symbol-和-symbol-类型之间有什么关系)
- [12. unique symbol 类型在属性名中有什么作用？](#12-unique-symbol-类型在属性名中有什么作用)
- [13. unique symbol 类型可以用在类的属性中吗？](#13-unique-symbol-类型可以用在类的属性中吗)
- [14. TypeScript 如何推断 Symbol 值变量的类型？](#14-typescript-如何推断-symbol-值变量的类型)
- [15. 引用](#15-引用)

<!-- endregion:toc -->

## 1. 本节内容

- symbol
- unique symbol

## 2. 评价

- symbol 类型了解即可，不常用。
- unique symbol 是 symbol 类型的一个子类型，它表示更具体的 Symbol 值。
- TS 认为如果变量类型是 unique symbol，那么它们是不可能相等的，因此在进行严格相等比较时会抛出错误。
  - 这一点会导致 `Symbol.for()` 的使用存在一定的局限性 => 哪怕我们传入相同的参数，TS 也会从类型层面判定它们是不同的值。

## 3. symbol 类型是什么？

- Symbol 是 ES2015 新引入的一种原始类型的值。它类似于字符串，但是每一个 Symbol 值都是独一无二的，与其他任何值都不相等。
- Symbol 值通过 `Symbol()` 函数生成。在 TypeScript 里面，Symbol 的类型使用 `symbol` 表示。

```ts
// symbol 类型包含所有的 Symbol 值
let x: symbol = Symbol()
let y: symbol = Symbol()

x === y // false
```

上面示例中，变量 x 和 y 的类型都是 symbol，且都用 `Symbol()` 生成，但是它们是不相等的。

## 4. 什么是 unique symbol 类型？

- unique symbol 是 symbol 类型的一个子类型，它表示单个的、某个具体的 Symbol 值。
- 与普通的 symbol 类型不同，unique symbol 代表一个唯一的、不可复制的 Symbol 值类型。

## 5. 为什么需要 unique symbol 类型？

- 因为 symbol 类型包含所有的 Symbol 值，但是无法表示某一个具体的 Symbol 值。
  - 比如，`5` 是一个具体的数值，就用 `5` 这个字面量来表示，这也是它的值类型。
  - 但是，Symbol 值不存在字面量，必须通过变量来引用，所以写不出只包含单个 Symbol 值的那种值类型。
- 为了解决上面提到的这个问题，TypeScript 设计了 unique symbol 类型。

## 6. unique symbol 类型的变量有什么限制？

- unique symbol 类型的变量是不能修改值的，只能用 `const` 命令声明，不能用 `let` 声明。
- 这是因为 unique symbol 表示单个值，需要保证其唯一性和不可变性。

```ts
// 正确
const x: unique symbol = Symbol()

// 报错
let y: unique symbol = Symbol()
// A variable whose type is a 'unique symbol' type must be 'const'.(1332)
```

## 7. const 声明 Symbol 值时的类型推断是怎样的？

- const 命令为变量赋值 Symbol 值时，变量类型默认就是 unique symbol，所以类型可以省略不写。

```ts
const x = Symbol()
// 等同于
// const x: unique symbol = Symbol()
```

## 8. 不同的 unique symbol 类型变量之间可以比较吗？

- 每个声明为 unique symbol 类型的变量，它们的值都是不一样的，其实属于两个值类型。
- 不同类型的值不能使用严格相等运算符进行比较，因为这么做毫无意义，无需比较就能断定是不可能相等的。

```ts
const a: unique symbol = Symbol()
const b: unique symbol = Symbol()

a === b // 报错
// This comparison appears to be unintentional because the types 'typeof a' and 'typeof b' have no overlap.(2367)
// 此比较可能不是有意为之，因为类型 'typeof a' 和 'typeof b' 之间没有交集。(2367)
// TS 看到你写出这样的表达式，会以为你不小心写错了，因为这么做没有意义，因为 a 和 b 永远不可能会相等。
// 就类似于比较不同的字符串字面量类型

const a: 'hello' = 'hello'
const b: 'world' = 'world'

a === b // 报错
// 报错信息是和上边儿一样的。
```

## 9. unique symbol 类型的变量可以相互赋值吗？

- 不能直接将一个 unique symbol 类型的变量赋值给另一个 unique symbol 类型的变量，因为它们实际上是不同的值类型。
- 如果要写成与变量 `a` 同一个 unique symbol 值类型，只能写成类型为 `typeof a`：

```ts
const a: unique symbol = Symbol()
const b: unique symbol = a // 报错
// Type 'typeof a' is not assignable to type 'typeof b'.(2322)

const a: unique symbol = Symbol()
const b: typeof a = a // 正确
```

## 10. Symbol.for() 方法对 unique symbol 类型有何影响？

- 相同参数的 `Symbol.for()` 方法会返回相同的 Symbol 值。
- TypeScript 目前无法识别这种情况，所以可能出现多个 unique symbol 类型的变量，等于同一个 Symbol 值的情况。

```ts
const a: unique symbol = Symbol.for('foo')
const b: unique symbol = Symbol.for('foo')

console.log(a === b) // true
```

上面示例中，变量 `a` 和 `b` 是两个不同的值类型，但是它们的值其实是相等的。

由于 unique symbol 类型不允许进行严格相等比较，因此上述程序会被 TS 判定为类型错误。但是实际上 `Symbol.for()` 又比较特殊，对于相同的入参，会返回相同的 symbol。可以认为这是 TypeScript 类型系统在处理 `Symbol.for()` 时的一个局限性！

## 11. unique symbol 和 symbol 类型之间有什么关系？

- unique symbol 类型是 symbol 类型的子类型，所以可以将前者赋值给后者，但是反过来就不行。

```ts
const a: unique symbol = Symbol()

const b: symbol = a // 正确

const c: unique symbol = b // 报错
// Type 'symbol' is not assignable to type 'unique symbol'.(2322)
```

## 12. unique symbol 类型在属性名中有什么作用？

- unique symbol 类型的一个作用就是用作属性名，这可以保证不会跟其他属性名冲突。
- 在 5.8.3 版本之前，如果要把某一个特定的 Symbol 值当作属性名，TypeScript 只允许它的类型是 unique symbol，不能是 symbol，5.8.3 版本之后没有了这个限制。

```ts
const x: unique symbol = Symbol()
const y: symbol = Symbol()

interface Foo {
  [x]: string // 正确
  [y]: string // 5.8.3 版本之前报错
}
// A computed property name in an interface must refer to an expression whose type is a literal type or a 'unique symbol' type.(1169)
```

![图 0](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-19-21-07-00.png)

## 13. unique symbol 类型可以用在类的属性中吗？

- unique symbol 类型也可以用作类（class）的属性值，但只能赋值给类的 `readonly static` 属性。

```ts
class C {
  static readonly foo: unique symbol = Symbol()
  // 注意，这时 static 和 readonly 两个限定符缺一不可，这是为了保证这个属性是固定不变的。
}
```

## 14. TypeScript 如何推断 Symbol 值变量的类型？

如果变量声明时没有给出类型，TypeScript 会根据声明方式推断某个 Symbol 值变量的类型：

- `let` 命令声明的变量，推断类型为 symbol
- `const` 命令声明的变量，推断类型为 unique symbol

```ts
// 类型为 symbol
let x = Symbol()

// 类型为 unique symbol
const x = Symbol()
```

- `const` 命令声明的变量，如果被赋值为另一个 symbol 类型的变量，则推断类型为 symbol
- `let` 命令声明的变量，如果赋值为另一个 unique symbol 类型的变量，则推断类型还是 symbol

```ts
let x = Symbol()
const y = x // 类型为 symbol

const x = Symbol()
let y = x // 类型为 symbol
```

## 15. 引用

- [Reference - Symbols][1]

[1]: https://www.typescriptlang.org/docs/handbook/symbols.html
