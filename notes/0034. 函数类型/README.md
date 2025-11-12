# [0034. 函数类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0034.%20%E5%87%BD%E6%95%B0%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🔍 「函数类型」章节速览](#3--函数类型章节速览)
- [4. 🤔 “函数类型声明”是什么？](#4--函数类型声明是什么)
- [5. 🤔 如果在声明函数的时候不指定类型信息，而是交给 TS 自行推断类型，会有什么问题？](#5--如果在声明函数的时候不指定类型信息而是交给-ts-自行推断类型会有什么问题)
- [6. 🤔 如何为变量定义函数类型？](#6--如何为变量定义函数类型)
- [7. 🤔 TS 对函数参数个数有什么约束？](#7--ts-对函数参数个数有什么约束)
- [8. 🤔 如何从现有函数获取其类型信息？](#8--如何从现有函数获取其类型信息)
- [9. 🤔 函数类型可以采用对象写法吗？](#9--函数类型可以采用对象写法吗)
- [10. 🤔 “Function 类型”有什么特点？](#10--function-类型有什么特点)
- [11. 🤔 “箭头函数的类型”如何声明？](#11--箭头函数的类型如何声明)
- [12. 🤔 “可选参数”是什么？](#12--可选参数是什么)
- [13. 🤔 “参数默认值”是什么？](#13--参数默认值是什么)
- [14. 🤔 如何处理“参数解构”时，函数参数的类型信息？](#14--如何处理参数解构时函数参数的类型信息)
- [15. 🤔 “rest 参数”的类型如何声明？](#15--rest-参数的类型如何声明)
- [16. 🤔 “只读参数”如何声明？](#16--只读参数如何声明)
- [17. 🤔 返回值是“void 类型”表示什么意思？](#17--返回值是void-类型表示什么意思)
- [18. 🤔 never 类型有什么用途？](#18--never-类型有什么用途)
- [19. 🤔 “函数重载”是什么？](#19--函数重载是什么)
- [20. 🤔 “构造函数的类型”如何声明？](#20--构造函数的类型如何声明)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 函数的类型声明
- 函数重载
- typeof
- Function
- 构造函数
- 参数
  - 可选参数
  - 参数默认值
  - 参数解构
  - 剩余参数
  - 只读参数
- 返回值
  - void 返回值
  - never 返回值

## 2. 🫧 评价

- 函数类型声明，重点关注俩：参数类型声明 + 返回值类型声明，其中参数类型声明非常得灵活，细节也比较多，因为 JS 原生支持的参数传递就非常灵活，并且 TS 在此基础上还添加了一些扩展，比如只读参数、可选参数、等概念。

## 3. 🔍 「函数类型」章节速览

<N :ids="['0091', '0092', '0093', '0094', '0095', '0096', '0097', '0098']" />

## 4. 🤔 “函数类型声明”是什么？

- 函数的类型声明是 TS 中用于约束「函数参数类型」和「函数返回值类型」的类型声明信息。
- 函数类型声明需要在声明函数时指定参数的类型和返回值的类型。

```ts
function hello(txt: string): void {
  console.log('hello ' + txt)
}
```

在上面的示例中，函数 `hello()` 在声明时需要给出参数 `txt` 的类型（string）以及返回值的类型（`void`），后者写在参数列表的圆括号后面。`void` 类型表示没有返回值。

## 5. 🤔 如果在声明函数的时候不指定类型信息，而是交给 TS 自行推断类型，会有什么问题？

- 函数参数：
  - 通常会被推断为 `any`，因此推荐显式指定参数的类型。
- 函数返回值：
  - 返回值的类型通常可以不写，因为对于函数的返回值而言，TypeScript 推断结果相对来说是比较准的。
  - 如果担心 TS 的推断结果不准确，也可以显式指定返回值的类型。

```ts
function hello(txt) {
  console.log('hello ' + txt)
}

// 推断结果：
// function hello(txt: any): void
```

上面示例中，由于没有 `return` 语句，TypeScript 会推断出函数 `hello()` 没有返回值，也就是 `void`。

## 6. 🤔 如何为变量定义函数类型？

当变量被赋值为一个函数时，变量的类型有两种写法：

```ts
// 写法一：通过等号右边的函数类型推断
const hello = function (txt: string) {
  console.log('hello ' + txt)
}

// 写法二：使用箭头函数形式显式指定类型
const hello: (txt: string) => void = function (txt) {
  console.log('hello ' + txt)
}

// 写法二有两个地方需要注意：
// 1. 函数的参数要放在圆括号里面，不放会报错
// 2. 类型里面的参数名（本例是 txt）是必须的
```

如果函数的类型定义很冗长，或者多个函数使用同一种类型，可以使用 `type` 命令为函数类型定义一个别名。

```ts
type MyFunc = (txt: string) => void
// 这样可以简化后续的使用，变量可以指定为这个类型。

const hello: MyFunc = function (txt) {
  console.log('hello ' + txt)
}
```

定义函数类型的时候，不可以省略形参的名字。形参的名字叫什么不重要，但是不能省略。

```ts
// type MyFunc = (string) => void // ❌ 错误写法
// 如果写成 (string) => void，TypeScript 会理解成函数有一个名叫 string 的参数
// 而 string 这个关键字在 TS 中已经被用作表示字符串类型了，因此会提示错误：
// Parameter has a name but no type. Did you mean 'arg0: string'?(7051)

// 形参的名字不能省略
type MyFunc = (txt: string) => void // ✅ 1 正确写法
type MyFunc = (abc: string) => void // ✅ 2 正确写法

// 1、2 都是正确写法，从程序功能上来看，它们是等效的，不过 1 更推荐，它的语义更好。
```

## 7. 🤔 TS 对函数参数个数有什么约束？

实参数量可以小于等于函数类型要求的参数数量。

- 参数少的可以赋值给参数多的
- 参数多的不能赋值给参数少的

---

函数的实际参数个数可以少于类型指定的参数个数，但是不能多于，即 TypeScript 允许省略参数：

```ts
let myFunc: (a: number, b: number) => number

myFunc = (a: number) => a // ✅ 正确

// myFunc = (a: number, b: number, c: number) => a + b + c // ❌ 报错
// Type '(a: number, b: number, c: number) => number' is not assignable to type '(a: number, b: number) => number'.
// Target signature provides too few arguments. Expected 3 or more, but got 2.(2322)
```

这是因为 JavaScript 函数在声明时往往有多余的参数，实际使用时可以只传入一部分参数。

比如，数组的 `forEach()` 方法的参数是一个函数，该函数默认有三个参数 `(item, index, array) => void`，实际上往往只使用第一个参数 `(item) => void`。因此，TypeScript 允许函数传入的参数不足。

```ts
let x = (a: number) => 0
let y = (b: number, s: string) => 0

y = x // ✅ 正确
x = y // ❌ 报错
// Type '(b: number, s: string) => number' is not assignable to type '(a: number) => number'.
// Target signature provides too few arguments. Expected 2 or more, but got 1.(2322)
```

上面示例中，函数 `x` 只有一个参数，函数 `y` 有两个参数，`x` 可以赋值给 `y`，反过来就不行。

## 8. 🤔 如何从现有函数获取其类型信息？

如果一个变量要套用另一个函数类型，可以使用 `typeof` 运算符：

```ts
function add(x: number, y: number) {
  return x + y
}

const myAdd: typeof add = function (x, y) {
  return x + y
}
```

## 9. 🤔 函数类型可以采用对象写法吗？

函数类型可以采用对象的写法：

```ts
// 函数类型的对象写法如下：
// {
//   (参数列表): 返回值
// }

// 示例：
let add: {
  // (x: number, y: number): number
  // 注意返回值用冒号 : 而非箭头 =>
  // (x: number, y: number) => number // ❌
  // 报错信息：':' expected.(1005)
  // 即便你不小心写错了，报错信息也会很友好地提醒你改为冒号。
}

// 等效：
// let add: (x: number, y: number) => number

add = function (x, y) {
  return x + y
}
```

注意，这种写法的函数参数与返回值之间，间隔符是冒号 `:`，而不是正常写法的箭头 `=>`，因为这里采用的是对象类型的写法，对象的属性名与属性值之间使用的是冒号。

---

这种对象式写法声明函数类型信息 -> 适用于函数本身存在属性的情况。

```ts
function f(x: number) {
  console.log(x)
}

f.version = '1.0'

let foo: {
  (x: number): void
  version: string
} = f
```

## 10. 🤔 “Function 类型”有什么特点？

TypeScript 提供 `Function` 类型表示函数，特点是：「任何函数都属于这个类型」。

```ts
function doSomething(f: Function) {
  return f(1, 2, 3)
}
```

Function 类型的函数可以接受任意数量的参数，每个参数的类型都是 `any`，返回值的类型也是 `any`，代表没有任何约束，所以不建议使用这个类型，给出函数详细的类型声明会更好。

## 11. 🤔 “箭头函数的类型”如何声明？

箭头函数是普通函数的一种简化写法，它的类型写法与普通函数类似：

```ts
// 无类型信息
const repeat = (str, times) => str.repeat(times)

// 加上类型信息
const repeat = (str: string, times: number): string => str.repeat(times)

// 参数是函数
function greet(fn: (a: string) => void): void {
  fn('world')
}
```

---

数组 map 方法使用箭头函数的示例：

```ts
type Person = { name: string }

const people = ['alice', 'bob', 'jan'].map((name): Person => ({ name }))

// 箭头函数：
// (name): Person => ({ name })

// 等效：
// (name: string): Person => ({ name })
```

`map()` 方法的参数是一个箭头函数 `(name):Person => ({name})`

- 该箭头函数的参数 `name` 的类型 `string` 省略了，因为可以从 `map()` 的类型定义推断出来；
- 箭头函数的返回值类型为 `Person`；

`map()` 函数的类型定义：

- `Array<T>.map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];`
- `Array<string>.map<Person>(callbackfn: (value: string, index: number, array: string[]) => Person, thisArg?: any): Person[]`

这里的 `T` 和 `U` 是泛型，它会根据我们使用的数组类型以及指定的 map 返回值类型来关联。

## 12. 🤔 “可选参数”是什么？

如果函数的某个参数可以省略，则在参数名后面加问号表示：

```ts
function f(x?: number) {
  // ...
}

f() // OK
f(10) // OK
```

参数名带有问号，表示该参数的类型实际上是 `显式指定的类型|undefined`。

比如，上例的 `x` 虽然类型声明为 `number`，但是实际上是 `number|undefined`：

---

注意：不要误以为 1 -> `x?: number`、2 -> `x: number | undefined` 是完全等价的。

- 1 表示：`x` 可以传入 `number`，也可以传入 `undefined`，也可以省略；
- 2 表示：`x` 可以传入 `number`，也可以传入 `undefined`，但不能省略；

```ts
// 写法 1
function f(x?: number) {
  return x
}

f(undefined) // ✅ 正确
// 推断结果：
// function f(x?: number): number | undefined

// 但是，反过来就不成立，类型显式设为 undefined 的参数，就不能省略：

// 写法 2
function f(x: number | undefined) {
  return x
}

f() // ❌ 报错
// Expected 1 arguments, but got 0.(2554)
```

---

函数的可选参数只能在参数列表的尾部，跟在必选参数的后面。

这一点很好理解，我们在调用函数的时候，从左往右依次顺序传递参数，先写左边的再写右边的，如果有可以省略的参数，那必然是在最右端。

```ts
let myFunc: (a?: number, b: number) => number // ❌ 报错
// 报错位置是在 b 处，报错信息如下：
// A required parameter cannot follow an optional parameter.(1016)
```

## 13. 🤔 “参数默认值”是什么？

TypeScript 函数的参数默认值写法，与 JavaScript 一致。

设置了默认值的参数，就是可选的。

```ts
function createPoint(x: number = 0, y: number = 0): [number, number] {
  return [x, y]
}

// 这里其实可以省略 x 和 y 的类型声明，因为可以从默认值推断出来：
function createPoint(x = 0, y = 0) {
  return [x, y]
}

createPoint() // [0, 0]
```

---

因为设置了默认值的参数，就意味着是可选的，因此可选参数与默认值不允许同时使用。

```ts
// ❌ 报错
// Parameter cannot have question mark and initializer.(1015)
function f(x?: number = 0) {
  // ...
}
```

---

设有默认值的参数，如果传入 `undefined`，也会触发默认值。

```ts
function f(x = 456) {
  return x
}

f(undefined) // 456
```

## 14. 🤔 如何处理“参数解构”时，函数参数的类型信息？

函数参数如果存在变量解构，类型写法如下：

```ts
function f([x, y]: [number, number]) {
  // ...
}

function sum({ a, b, c }: { a: number; b: number; c: number }) {
  console.log(a + b + c)
}
```

参数解构可以结合类型别名（type 命令）一起使用，代码会看起来简洁一些：

```ts
type ABC = { a: number; b: number; c: number }

function sum({ a, b, c }: ABC) {
  console.log(a + b + c)
}
```

## 15. 🤔 “rest 参数”的类型如何声明？

rest 参数表示函数剩余的所有参数，它可以是数组（剩余参数类型相同），也可能是元组（剩余参数类型不同）：

```ts
// rest 参数为数组
function joinNumbers(...nums: number[]) {
  // ...
}

// rest 参数为元组
function f(...args: [boolean, number]) {
  // ...
}

// 推断结果：
// function f(args_0: boolean, args_1: number): void
```

下面是一个 rest 参数的例子：

```ts
function multiply(n: number, ...m: number[]) {
  return m.map((x) => n * x)
}
```

rest 参数甚至可以嵌套：

```ts
function f(...args: [boolean, ...string[]]) {
  // ...
}

// 推断结果：
// function f(args_0: boolean, ...args: string[]): void
```

rest 参数可以与变量解构结合使用：

```ts
function repeat(...[str, times]: [string, number]): string {
  return str.repeat(times)
}

// 推断结果：
// function repeat(str: string, times: number): string

// 等同于
function repeat(str: string, times: number): string {
  return str.repeat(times)
}
```

## 16. 🤔 “只读参数”如何声明？

如果函数内部不能修改某个参数，可以在函数定义时，在参数类型前面加上 `readonly` 关键字，表示这是只读参数：

```ts
function arraySum(arr: readonly number[]) {
  // ...
  arr[0] = 0 // 报错
  // Index signature in type 'readonly number[]' only permits reading.(2542)
}
```

注意，在约束函数参数时，`readonly` 关键字目前只允许用在数组和元组类型的参数前面，如果用在其他类型的参数前面，就会报错。

## 17. 🤔 返回值是“void 类型”表示什么意思？

```ts
// void 类型表示函数没有返回值：
function f(): void {
  console.log('hello')
}

// 如果返回其他值，就会报错：
function f(): void {
  return 123 // ❌ 报错
  // Type 'number' is not assignable to type 'void'.(2322)
}

// void 类型允许返回 undefined 或 null：
function f(): void {
  return undefined // ✅ 正确
}

function f(): void {
  return null // ✅ 正确
}
```

需要特别注意的是，如果变量、对象方法、函数参数是一个返回值为 void 类型的函数，那么它接受返回任意值的函数。

```ts
type voidFunc = () => void

const f: voidFunc = () => {
  return 123
}
```

这是因为，这时 TypeScript 认为，这里的 void 类型只是表示该函数的返回值没有利用价值，或者说不应该使用该函数的返回值。只要不用到这里的返回值，就不会报错。

## 18. 🤔 never 类型有什么用途？

`never` 类型表示肯定不会出现的值。它用在函数的返回值，就表示某个函数肯定不会返回值，即函数不会正常执行结束。

主要有以下两种情况：

```ts
// 1. 抛出错误的函数：
function fail(msg: string): never {
  throw new Error(msg)
}

// 2. 无限执行的函数：
const sing = function (): never {
  while (true) {
    console.log('sing')
  }
}
```

注意，`never` 类型不同于 `void` 类型。

- 前者表示函数没有执行结束，不可能有返回值；
- 后者表示函数正常执行结束，但是不返回值，或者说返回 `undefined`；

```ts
// ✅ 正确
function sing1(): void {
  console.log('sing')
}

// ❌ 报错
function sing2(): never {
  console.log('sing')
}
// A function returning 'never' cannot have a reachable end point.(2534)
```

## 19. 🤔 “函数重载”是什么？

有些函数可以接受不同类型或不同个数的参数，并且根据参数的不同，会有不同的函数行为。这种根据参数类型不同，执行不同逻辑的行为，称为函数重载（function overload）。

```javascript
reverse('abc') // 'cba'
reverse([1, 2, 3]) // [3, 2, 1]
```

TypeScript 对于"函数重载"的类型声明方法是，逐一定义每一种情况的类型声明（当前调用场景下的参数类型声明和返回值类型声明）。

```ts
function reverse(str: string): string
function reverse(arr: any[]): any[]
function reverse(stringOrArray: string | any[]): string | any[] {
  if (typeof stringOrArray === 'string')
    return stringOrArray.split('').reverse().join('')
  else return stringOrArray.slice().reverse()
}
```

## 20. 🤔 “构造函数的类型”如何声明？

- JavaScript 语言使用构造函数，生成对象的实例。
- 构造函数的最大特点，就是必须使用 `new` 命令调用。
- 构造函数的类型写法，就是在参数列表前面加上 `new` 命令。

```ts
// 构造函数的使用 - 需要使用 new 命令
const d = new Date()

class Animal {
  numLegs: number = 4
}

// 构造函数的类型声明，需要在参数列表前面加上 new 命令
type AnimalConstructor = new () => Animal

function create(c: AnimalConstructor): Animal {
  return new c()
}

const a = create(Animal)
```

- 构造函数的类型写法，也可以采用对象的形式来声明。

```ts
type F = {
  new (s: string): object
}
```

- 如果某些函数既是构造函数，又可以当作普通函数使用，比如 `Date()`。
- 这时，类型声明可以写成下面这样：

```ts
type F = {
  new (s: string): object
  (n?: number): number
}
```
