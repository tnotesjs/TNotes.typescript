# [0037. Enum 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0037.%20Enum%20%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 章节速览](#3-章节速览)
- [4. 什么是 TS 中的 Enum 类型？](#4-什么是-ts-中的-enum-类型)
- [5. Enum 类型的使用场景是？](#5-enum-类型的使用场景是)
- [6. 数字 Enum 成员需要初始化吗？](#6-数字-enum-成员需要初始化吗)
- [7. 可以为 Enum 成员设置什么样的值？](#7-可以为-enum-成员设置什么样的值)
- [8. 什么是 const Enum，它有什么优势？](#8-什么是-const-enum它有什么优势)
- [9. 多个同名 Enum 会如何处理？](#9-多个同名-enum-会如何处理)
- [10. 什么是字符串 Enum？](#10-什么是字符串-enum)
- [11. 数字 Enum、字符串 Enum 可以写在一起吗？](#11-数字-enum字符串-enum-可以写在一起吗)
- [12. 如何提取 Enum 结构的所有成员名作为联合类型返回？](#12-如何提取-enum-结构的所有成员名作为联合类型返回)
- [13. 如何遍历 Enum 结构所有成员值作为新类型的 key？](#13-如何遍历-enum-结构所有成员值作为新类型的-key)
- [14. 什么是 Enum 的反向映射？](#14-什么是-enum-的反向映射)

<!-- endregion:toc -->

## 1. 本节内容

- Enum 结构的特点和生明语法
- Enum 类型的使用场景
- const Enum
- 同名 Enum
- 数字 Enum、字符串 Enum
- keyof typeof Enum 提取所有成员名
- key in Enum 遍历枚举成员
- Enum 的反向映射

## 2. 评价

Enum 是 TS 中为数不多的会产生运行时代码的特性之一（不仅仅是类型层面，还包括运行时 JS 的值层面）。

虽然它提供了便利的常量管理，但由于其特殊的运行时行为和潜在的代码体积增加，现代 TS 开发中常被联合类型（Union Types）或 `as const` 对象替代。

非必要不建议使用 Enum，因为这个新增的类型在给我们新增了很多特性的同时，也带来了不少的问题。

在后续的笔记顺序上也把 `枚举 vs. 对象字面量` 提到了前面，先熟悉 `as const` 对象字面量类型的解决方案更加重要，这是目前社区的主要实践方案。

## 3. 章节速览

<N :ids='["0130", "0123", "0124", "0227", "0125", "0126", "0127", "0129"]' />

## 4. 什么是 TS 中的 Enum 类型？

Enum 是 TS 新增的一种数据结构和类型，中文译为"枚举"。

实际开发中，经常需要定义一组相关的常量：

```ts
const RED = 1
const GREEN = 2
const BLUE = 3

function userInput(): any {
  /* ... */
}

let color = userInput()

if (color === RED) {
  /* ... */
}
if (color === GREEN) {
  /* ... */
}
if (color === BLUE) {
  /* ... */
}

throw new Error('wrong color')
```

TS 设计了 Enum 结构，用来将相关常量放在一个容器里面，方便使用：

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

Enum 既是一种类型又是一个值。比如，上例的变量 `c` 等于 `1`，它的类型可以是 Color，也可以是 `number`：

```ts
let c: Color = Color.Green // 正确
let c: number = Color.Green // 正确
```

绝大多数 TS 语法都是类型语法，编译后会全部去除，但是 Enum 结构是一个值，编译后会变成 JavaScript 对象，留在代码中：

```ts
enum Color {
  Red, // 0
  Green, // 1
  Blue, // 2
}
// 编译后得到的 JS 如下：
/* 
"use strict";
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 2] = "Blue";
})(Color || (Color = {}));
 */
```

## 5. Enum 类型的使用场景是？

Enum 类型适合用于那些需要逐一列举出一系列的可能性的场景。

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

const result = compute(Operator.ADD, 1, 3)
console.log(result) // 4
```

## 6. 数字 Enum 成员需要初始化吗？

Enum 成员默认不必显示初始化，系统会从零开始逐一递增，按照顺序为每个成员赋值，比如 0、1、2……：

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

## 7. 可以为 Enum 成员设置什么样的值？

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
// 注意，这么做是毫无意义的
```

Enum 成员的值也可以使用计算式来动态计算：

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

除了数字之外，枚举值也可以是字符串类型。

```ts
enum Color {
  Red = 'Red',
  Green = 'Green',
  Blue = 'Blue',
}

// 编译后的 JS：
/* 
"use strict";
var Color;
(function (Color) {
    Color["Red"] = "Red";
    Color["Green"] = "Green";
    Color["Blue"] = "Blue";
})(Color || (Color = {}));
 */
```

## 8. 什么是 const Enum，它有什么优势？

为了让 Enum 成员值更醒目，通常会在 enum 关键字前面加上 `const` 修饰，表示这是常量，不能再次赋值：

```ts
const enum Color {
  Red,
  Green,
  Blue,
}
```

加上 `const` 还有一个好处，就是编译为 JavaScript 代码后，代码中 Enum 成员会被替换成对应的值，这样能提高性能表现：

```ts
const enum Color {
  Red,
  Green,
  Blue,
}

const x = Color.Red
const y = Color.Green
const z = Color.Blue

// 编译后的 JS 如下：
// "use strict";
// const x = 0 /* Color.Red */;
// const y = 1 /* Color.Green */;
// const z = 2 /* Color.Blue */;
```

如果希望加上 `const` 关键词后，运行时还能访问 Enum 结构（即编译后依然将 Enum 转成对象），需要在编译时打开 `preserveConstEnums` 编译选项。

## 9. 多个同名 Enum 会如何处理？

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
// enum Foo {
//   A,
//   B = 1,
//   C = 2,
// }

// 编译后的 JS：
/* "use strict";
var Foo;
(function (Foo) {
    Foo[Foo["A"] = 0] = "A";
})(Foo || (Foo = {}));
(function (Foo) {
    Foo[Foo["B"] = 1] = "B";
})(Foo || (Foo = {}));
(function (Foo) {
    Foo[Foo["C"] = 2] = "C";
})(Foo || (Foo = {}));
 */
```

注意事项：

1. Enum 结构合并时，只允许其中一个的首成员省略初始值
2. 同名 Enum 合并时，不能有同名成员

::: code-group

```ts [1]
enum Foo {
  A,
}

enum Foo {
  B, // ❌ 报错
}
// In an enum with multiple declarations, only one declaration can omit an initializer for its first enum element.(2432)

// 此时如果忽略错误，强制编译，得到的 JS 如下：
/* 
"use strict";
var Foo;
(function (Foo) {
    Foo[Foo["A"] = 0] = "A";
})(Foo || (Foo = {}));
(function (Foo) {
    Foo[Foo["B"] = 0] = "B";
})(Foo || (Foo = {}));
*/

// 你会发现两个枚举的 value 都被初始化为了 0，这将被 TS 视作无意义的错误行为
```

```ts [2]
enum Foo {
  A,
  B,
}

enum Foo {
  B = 1, // ❌ 报错
  C,
}
// Duplicate identifier 'B'.(2300)

// 此时如果忽略错误，强制编译，得到的 JS 如下：
/* 
"use strict";
var Foo;
(function (Foo) {
    Foo[Foo["A"] = 0] = "A";
    Foo[Foo["B"] = 1] = "B";
})(Foo || (Foo = {}));
(function (Foo) {
    Foo[Foo["B"] = 1] = "B";
    Foo[Foo["C"] = 2] = "C";
})(Foo || (Foo = {}));
 */

// 你会发现 Foo[Foo["B"] = 1] = "B"; 执行了两遍，第二遍显然是没意义的操作
```

:::

## 10. 什么是字符串 Enum？

Enum 成员的值除了设为数值，还可以设为字符串，字符串枚举的所有成员值，都必须显式设置。

也就是说，Enum 也可以用作一组相关字符串的集合：

```ts
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}

// 编译后得到的 JS 如下：
/* 
"use strict";
var Direction;
(function (Direction) {
    Direction["Up"] = "UP";
    Direction["Down"] = "DOWN";
    Direction["Left"] = "LEFT";
    Direction["Right"] = "RIGHT";
})(Direction || (Direction = {}));
 */
```

## 11. 数字 Enum、字符串 Enum 可以写在一起吗？

可以，但是有一些约束条件。

如果成员没有设置初始值，那么该成员之前的最近成员不能是字符串枚举成员。

```ts
enum Foo {
  A, // 0
  B = 'hello',
  C, // ❌ 报错
}
// Enum member must have initializer.(1061)

// 如果数字枚举出现在字符串枚举之后的话，必须显示初始化
enum Enum {
  One = 'One',
  Two = 'Two',
  Three = 3,
  Four, // 4
}
```

## 12. 如何提取 Enum 结构的所有成员名作为联合类型返回？

keyof 运算符可以取出 Enum 结构的所有成员名，作为联合类型返回：

```ts
enum MyEnum {
  A = 'a',
  B = 'b',
}

type Foo = keyof typeof MyEnum
// TS 推断结果：
// type Foo = "A" | "B"
```

注意，这里的 `typeof` 是必需的，否则 `keyof MyEnum` 取出的是 Enum 成员类型的属性名（如 `toString`、`toFixed` 等），而不是 Enum 成员名。

如果省略 `typeof`，将得到以下内容：

```ts
type Foo =
  | number
  | typeof Symbol.iterator
  | 'toString'
  | 'charAt'
  | 'charCodeAt'
  | 'concat'
  | 'indexOf'
  | 'lastIndexOf'
  | 'localeCompare'
  | 'match'
  | 'replace'
  | 'search'
  | 'slice'
  | 'split'
  | 'substring'
  | 'toLowerCase'
  | 'toLocaleLowerCase'
  | 'toUpperCase'
  | 'toLocaleUpperCase'
  | 'trim'
  | 'length'
  | 'substr'
  | 'valueOf'
  | 'codePointAt'
  | 'includes'
  | 'endsWith'
  | 'normalize'
  | 'repeat'
  | 'startsWith'
  | 'anchor'
  | 'big'
  | 'blink'
  | 'bold'
  | 'fixed'
  | 'fontcolor'
  | 'fontsize'
  | 'italics'
  | 'link'
  | 'small'
  | 'strike'
  | 'sub'
  | 'sup'
  | 'padStart'
  | 'padEnd'
```

这是因为 `MyEnum` 作为类型使用时，表示的是枚举成员的类型（在这个例子中是字符串枚举，所以是 `string` 类型）。因此 `keyof MyEnum` 实际上是在获取 `string` 类型的所有属性名。

而 `typeof MyEnum` 获取的是枚举对象本身的类型，所以 `keyof typeof MyEnum` 才能获取到枚举对象上的键（即枚举成员名）。

## 13. 如何遍历 Enum 结构所有成员值作为新类型的 key？

如果要遍历 Enum 所有的成员值，可以使用 `in` 运算符：

```ts
enum MyEnum {
  A = 'a',
  B = 'b',
}

type Foo = { [key in MyEnum]: string }
// TS 推断结果：
/* 
type Foo = {
    a: string;
    b: string;
}
 */
```

## 14. 什么是 Enum 的反向映射？

- 可以 key -> value
- 可以 value -> key

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

这是因为 TS 会将上面的 Enum 结构，编译成下面的 JavaScript 代码：

```javascript
'use strict'
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
console.log(Weekdays[3]) // Wednesday
```

注意，这种情况只发生在数值 Enum，对于字符串 Enum，不存在反向映射。这是因为字符串 Enum 编译后只有一组赋值。

这一特性只需要略微留意编译后的 JS 代码便可知晓。
