# [0036. 元组类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0036.%20%E5%85%83%E7%BB%84%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 元组类型章节速览](#3-元组类型章节速览)
- [4. 什么是元组（tuple）类型？](#4-什么是元组tuple类型)
- [5. 元组和数组在语法上有什么区别？](#5-元组和数组在语法上有什么区别)
- [6. 为什么元组必须显式声明类型？](#6-为什么元组必须显式声明类型)
- [7. 元组是否支持可选成员？](#7-元组是否支持可选成员)
- [8. 元组成员数量是否有限制？](#8-元组成员数量是否有限制)
- [9. 扩展运算符在元组中如何使用？](#9-扩展运算符在元组中如何使用)
- [10. 元组成员可以有名称吗？](#10-元组成员可以有名称吗)
- [11. 如何读取元组成员的类型？](#11-如何读取元组成员的类型)
- [12. 如何创建只读元组？](#12-如何创建只读元组)
- [13. 只读元组和普通元组有什么关系？](#13-只读元组和普通元组有什么关系)
- [14. TypeScript 如何推断元组的成员数量？](#14-typescript-如何推断元组的成员数量)
- [15. 扩展运算符在函数调用中会产生什么问题？](#15-扩展运算符在函数调用中会产生什么问题)

<!-- endregion:toc -->

## 1. 本节内容

- 元组类型（tuple）
- 扩展运算符（`...`）
- 元组成员命名

## 2. 评价

- 你可以将元组理解为更具体的数组类型。
- 元组类型在数组类型的基础上对每一个成员的类型以及数组的长度进行了约束。

## 3. 元组类型章节速览

<N :ids="['0086', '0087', '0088', '0089', '0090']" />

## 4. 什么是元组（tuple）类型？

元组（tuple）是 TypeScript 特有的数据类型，JavaScript 没有单独区分这种类型。它表示成员类型可以自由设置的数组，即数组的各个成员的类型可以不同。

```ts
const s: [string, string, boolean] = ['a', 'b', true]
```

上面示例中，元组 s 的前两个成员的类型是 string，最后一个成员的类型是 boolean。

## 5. 元组和数组在语法上有什么区别？

元组类型的写法与数组有一个重大差异：

- 数组的成员类型写在方括号外面：`number[]`
- 元组的成员类型写在方括号里面：`[number]`

```ts
// 数组
let a: number[] = [1]

// 元组
let t: [number] = [1]
```

上面示例中，变量 a 和 t 的值都是`[1]`，但是它们的类型是不一样的。 a 是一个数组，成员类型 number 写在方括号外面；t 是一个元组，成员类型 number 写在方括号里面。

## 6. 为什么元组必须显式声明类型？

使用元组时，必须明确给出类型声明，不能省略，否则 TypeScript 会把一个值自动推断为数组：

```ts
// a 的类型被推断为 (number | boolean)[]
let a = [1, true]

// 正确的元组声明
let b: [number, boolean] = [1, true]
```

上面示例中，变量 a 的值其实是一个元组，但是 TypeScript 会将其推断为一个联合类型的数组，即 a 的类型为 `(number | boolean)[]`。所以，元组必须显式给出类型声明。

---

你也可以使用 `as const` 断言来让 TS 将显式声明的数组推断为更加具体的只读元组类型。

```ts
// a 的类型被推断为 (number | boolean)[]
let a = [1, true]

// b 的类型被推断为 readonly [1, true]
let b = [1, true] as const
```

或许你想要的是 `[number, boolean]` 元组类型，而非这个 `readonly [1, true]` 只读元组类型。

::: tip 💡 建议

当你在声明一个元组类型时，最好加上显示声明，不要交由 TS 推断。

:::

## 7. 元组是否支持可选成员？

是的，元组成员的类型可以添加问号后缀（`?`），表示该成员是可选的。但问号只能用于元组的尾部成员，所有可选成员必须在必选成员之后：

```ts
let a: [number, number?] = [1]
// 可以是 [1] 或 [1, 2]

type myTuple = [number, number, number?, string?]
// 可以有 2、3 或 4 个成员
```

## 8. 元组成员数量是否有限制？

大多数情况下，元组的成员数量是有限的，从类型声明就可以明确知道元组包含多少个成员，越界的成员会报错：

```ts
let x: [string, string] = ['a', 'b']

x[2] = 'c' // 报错：超出元组声明的索引范围
```

但可以使用扩展运算符（`...`）表示不限成员数量的元组：

```ts
type NamedNums = [string, ...number[]]

const a: NamedNums = ['A', 1, 2]
const b: NamedNums = ['B', 1, 2, 3, 4, 5]
```

## 9. 扩展运算符在元组中如何使用？

扩展运算符（`...`）用在元组的任意位置都可以，它的后面只能是一个数组或元组：

```ts
type t1 = [string, number, ...boolean[]] // 扩展在尾部
type t2 = [string, ...boolean[], number] // 扩展在中部
type t3 = [...boolean[], string, number] // 扩展在头部

// 使用示例
const example1: t1 = ['hello', 42, true, false, true]
const example2: t2 = ['hello', true, false, 42]
const example3: t3 = [true, false, 'hello', 42]
```

## 10. 元组成员可以有名称吗？

元组的成员可以添加成员名，这个成员名是说明性的，可以任意取名，没有实际作用：

```ts
type Color = [red: number, green: number, blue: number]

const c: Color = [255, 255, 255]

// 成员名称仅用于说明，没有实际作用
// 仍然通过索引访问
console.log(c[0]) // 255
```

## 11. 如何读取元组成员的类型？

元组可以通过方括号读取成员类型：

```ts
type Tuple = [string, number]
type Age = Tuple[1] // number

// 通过 number 类型读取所有成员的联合类型
type Tuple2 = [string, number, Date]
type TupleEl = Tuple2[number] // string|number|Date
```

## 12. 如何创建只读元组？

元组也可以是只读的，不允许修改，有多种写法：

```ts
// 写法一（类型只读元组）
type t1 = readonly [number, string]

// 写法二（类型只读元组）
type t2 = Readonly<[number, string]>

// 写法三（字面量只读元组）
const readonlyTuple_2 = ['hello', 42] as const
// TS 推断结果：
// readonly ["hello", 42]

// 使用示例
const readonlyTuple: readonly [string, number] = ['hello', 42]
// readonlyTuple[0] = 'world'; // ❌ 报错：无法分配到 "0" ，因为它是只读属性
// Cannot assign to '0' because it is a read-only property.(2540)
```

## 13. 只读元组和普通元组有什么关系？

只读元组是元组的父类型，所以元组可以替代只读元组，而只读元组不能替代元组：

```ts
type ReadonlyTuple = readonly [number, number]
type MutableTuple = [number, number]

let mutable: MutableTuple = [1, 2]
let readonly: ReadonlyTuple = mutable // 正确：子类型赋值给父类型

// readonly = mutable; // ✅ 正确：同一对象
// mutable = readonly; // ❌ 报错：父类型不能赋值给子类型
```

由于只读元组不能替代元组，所以会产生一些令人困惑的报错：

```ts
function distanceFromOrigin([x, y]: [number, number]) {
  return Math.sqrt(x ** 2 + y ** 2)
}

let point = [3, 4] as const // 类型为 readonly [3, 4]

// distanceFromOrigin(point); // ❌ 报错：readonly [3, 4] 不能赋值给 [number, number]

// 解决方法：使用类型断言
distanceFromOrigin(point as [number, number])
```

## 14. TypeScript 如何推断元组的成员数量？

TypeScript 根据元组定义推断成员数量：

```ts
// 没有可选成员和扩展运算符时，TypeScript 会推断出确切的成员数量
function f1(point: [number, number]) {
  point.length
  // point.length 被推断为 2
  // if (point.length === 3) { } // ❌ 报错：条件永远为 false
}

// 包含可选成员时，TypeScript 会推断出可能的成员数量范围
function f2(point: [number, number?, number?]) {
  point.length
  // point.length 被推断为 1|2|3
  // if (point.length === 4) { } // ❌ 报错：条件永远为 false
}

// 使用扩展运算符时，TypeScript 无法推断确切的成员数量
const myTuple: [...string[]] = ['a', 'b', 'c']
// myTuple.length 被推断为 number
if (myTuple.length === 4) {
} // ✅ 正确：条件可能为 true
```

## 15. 扩展运算符在函数调用中会产生什么问题？

扩展运算符将数组转换成参数序列时，TypeScript 会认为参数数量是不确定的，可能导致与函数期望参数数量不匹配的报错：

```ts
const arr = [1, 2]

function add(x: number, y: number) {
  return x + y
}

// add(...arr) // ❌ 报错：TypeScript 认为 arr 可能包含任意数量的元素
// A spread argument must either have a tuple type or be passed to a rest parameter.(2556)

// 解决方法一：声明为确定长度的元组
const arr2: [number, number] = [1, 2]
add(...arr2) // ✅ 正确

// 解决方法二：使用 as const 断言
const arr3 = [1, 2] as const
add(...arr3) // ✅ 正确，类型为 readonly [1, 2]
```

有些函数可以接受任意数量的参数，这时使用扩展运算符就不会报错：

```ts
const arr = [1, 2, 3]

// console.log 可以接受任意数量的参数
console.log(...arr) // ✅ 正确

// Math.max 可以接受任意数量的参数
const max = Math.max(...arr) // ✅ 正确

// 数组的 push 方法可以接受任意数量的参数
const target: number[] = []
target.push(...arr) // ✅ 正确
```
