# [0037. Enum 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0037.%20Enum%20%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是 TypeScript 中的 Enum 类型？](#3--什么是-typescript-中的-enum-类型)
- [4. 🤔 Enum 既是一种类型又是一个值吗？](#4--enum-既是一种类型又是一个值吗)
- [5. 🤔 Enum 成员的默认值是什么？](#5--enum-成员的默认值是什么)
- [6. 🤔 可以为 Enum 成员设置什么样的值？](#6--可以为-enum-成员设置什么样的值)
- [7. 🤔 什么是 const Enum，它有什么优势？](#7--什么是-const-enum它有什么优势)
- [8. 🤔 多个同名 Enum 会如何处理？](#8--多个同名-enum-会如何处理)
- [9. 🤔 什么是字符串 Enum？](#9--什么是字符串-enum)
- [10. 🤔 如何使用 keyof 运算符处理 Enum？](#10--如何使用-keyof-运算符处理-enum)
- [11. 🤔 什么是 Enum 的反向映射？](#11--什么是-enum-的反向映射)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- todo

## 2. 🫧 评价

- todo

## 3. 🤔 什么是 TypeScript 中的 Enum 类型？

Enum 是 TypeScript 新增的一种数据结构和类型，中文译为"枚举"。实际开发中，经常需要定义一组相关的常量：

```ts
const RED = 1
const GREEN = 2
const BLUE = 3

let color = userInput()

if (color === RED) {
  /* */
}
if (color === GREEN) {
  /* */
}
if (color === BLUE) {
  /* */
}

throw new Error('wrong color')
```

TypeScript 设计了 Enum 结构，用来将相关常量放在一个容器里面，方便使用：

```ts
enum Color {
  Red, // 0
  Green, // 1
  Blue, // 2
}
```

使用时，调用 Enum 的某个成员，与调用对象属性的写法一样，可以使用点运算符，也可以使用方括号运算符：

```ts
let c = Color.Green // 1
// 等同于
let c = Color['Green'] // 1
```

## 4. 🤔 Enum 既是一种类型又是一个值吗？

是的，Enum 结构本身也是一种类型。比如，上例的变量`c`等于`1`，它的类型可以是 Color，也可以是`number`：

```ts
let c: Color = Color.Green // 正确
let c: number = Color.Green // 正确
```

Enum 结构的特别之处在于，它既是一种类型，也是一个值。绝大多数 TypeScript 语法都是类型语法，编译后会全部去除，但是 Enum 结构是一个值，编译后会变成 JavaScript 对象，留在代码中：

```ts
// 编译前
enum Color {
  Red, // 0
  Green, // 1
  Blue, // 2
}

// 编译后
let Color = {
  Red: 0,
  Green: 1,
  Blue: 2,
}
```

由于这个原因，Enum 结构比较适合的场景是，成员的值不重要，名字更重要，从而增加代码的可读性和可维护性：

```ts
enum Operator {
  ADD,
  DIV,
  MUL,
  SUB,
}

function compute(op: Operator, a: number, b: number) {
  switch (op) {
    case Operator.ADD:
      return a + b
    case Operator.DIV:
      return a / b
    case Operator.MUL:
      return a * b
    case Operator.SUB:
      return a - b
    default:
      throw new Error('wrong operator')
  }
}

compute(Operator.ADD, 1, 3) // 4
```

## 5. 🤔 Enum 成员的默认值是什么？

Enum 成员默认不必赋值，系统会从零开始逐一递增，按照顺序为每个成员赋值，比如 0、1、2……：

```ts
enum Color {
  Red,
  Green,
  Blue,
}

// 等同于
enum Color {
  Red = 0,
  Green = 1,
  Blue = 2,
}
```

如果只设定第一个成员的值，后面成员的值就会从这个值开始递增：

```ts
enum Color {
  Red = 7,
  Green, // 8
  Blue, // 9
}

// 或者
enum Color {
  Red, // 0
  Green = 7,
  Blue, // 8
}
```

## 6. 🤔 可以为 Enum 成员设置什么样的值？

成员的值可以是任意数值，但不能是大整数（Bigint）：

```ts
enum Color {
  Red = 90,
  Green = 0.5,
  Blue = 7n, // 报错
}
```

成员的值甚至可以相同：

```ts
enum Color {
  Red = 0,
  Green = 0,
  Blue = 0,
}
```

Enum 成员的值也可以使用计算式：

```ts
enum Permission {
  UserRead = 1 << 8,
  UserWrite = 1 << 7,
  UserExecute = 1 << 6,
  GroupRead = 1 << 5,
  GroupWrite = 1 << 4,
  GroupExecute = 1 << 3,
  AllRead = 1 << 2,
  AllWrite = 1 << 1,
  AllExecute = 1 << 0,
}

enum Bool {
  No = 123,
  Yes = Math.random(),
}
```

## 7. 🤔 什么是 const Enum，它有什么优势？

为了让 Enum 成员值更醒目，通常会在 enum 关键字前面加上`const`修饰，表示这是常量，不能再次赋值：

```ts
const enum Color {
  Red,
  Green,
  Blue,
}
```

加上`const`还有一个好处，就是编译为 JavaScript 代码后，代码中 Enum 成员会被替换成对应的值，这样能提高性能表现：

```ts
const enum Color {
  Red,
  Green,
  Blue,
}

const x = Color.Red
const y = Color.Green
const z = Color.Blue

// 编译后
const x = 0 /* Color.Red */
const y = 1 /* Color.Green */
const z = 2 /* Color.Blue */
```

如果希望加上`const`关键词后，运行时还能访问 Enum 结构（即编译后依然将 Enum 转成对象），需要在编译时打开`preserveConstEnums`编译选项。

## 8. 🤔 多个同名 Enum 会如何处理？

多个同名的 Enum 结构会自动合并：

```ts
enum Foo {
  A,
}

enum Foo {
  B = 1,
}

enum Foo {
  C = 2,
}

// 等同于
enum Foo {
  A,
  B = 1,
  C = 2,
}
```

Enum 结构合并时，只允许其中一个的首成员省略初始值，否则报错：

```ts
enum Foo {
  A,
}

enum Foo {
  B, // 报错
}
```

同名 Enum 合并时，不能有同名成员，否则报错：

```ts
enum Foo {
  A,
  B,
}

enum Foo {
  B = 1, // 报错
  C,
}
```

## 9. 🤔 什么是字符串 Enum？

Enum 成员的值除了设为数值，还可以设为字符串。也就是说，Enum 也可以用作一组相关字符串的集合：

```ts
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}
```

字符串枚举的所有成员值，都必须显式设置。如果没有设置，成员值默认为数值，且位置必须在字符串成员之前：

```ts
enum Foo {
  A, // 0
  B = 'hello',
  C, // 报错
}
```

Enum 成员可以是字符串和数值混合赋值：

```ts
enum Enum {
  One = 'One',
  Two = 'Two',
  Three = 3,
  Four = 4,
}
```

## 10. 🤔 如何使用 keyof 运算符处理 Enum？

keyof 运算符可以取出 Enum 结构的所有成员名，作为联合类型返回：

```ts
enum MyEnum {
  A = 'a',
  B = 'b',
}

// 'A'|'B'
type Foo = keyof typeof MyEnum
```

注意，这里的`typeof`是必需的，否则`keyof MyEnum`相当于`keyof string`。

如果要返回 Enum 所有的成员值，可以使用`in`运算符：

```ts
enum MyEnum {
  A = 'a',
  B = 'b',
}

// { a: any, b: any }
type Foo = { [key in MyEnum]: any }
```

## 11. 🤔 什么是 Enum 的反向映射？

数值 Enum 存在反向映射，即可以通过成员值获得成员名：

```ts
enum Weekdays {
  Monday = 1,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}

console.log(Weekdays[3]) // Wednesday
```

这是因为 TypeScript 会将上面的 Enum 结构，编译成下面的 JavaScript 代码：

```javascript
var Weekdays
;(function (Weekdays) {
  Weekdays[(Weekdays['Monday'] = 1)] = 'Monday'
  Weekdays[(Weekdays['Tuesday'] = 2)] = 'Tuesday'
  Weekdays[(Weekdays['Wednesday'] = 3)] = 'Wednesday'
  Weekdays[(Weekdays['Thursday'] = 4)] = 'Thursday'
  Weekdays[(Weekdays['Friday'] = 5)] = 'Friday'
  Weekdays[(Weekdays['Saturday'] = 6)] = 'Saturday'
  Weekdays[(Weekdays['Sunday'] = 7)] = 'Sunday'
})(Weekdays || (Weekdays = {}))
```

注意，这种情况只发生在数值 Enum，对于字符串 Enum，不存在反向映射。这是因为字符串 Enum 编译后只有一组赋值。
