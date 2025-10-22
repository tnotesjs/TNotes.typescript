# [0032. 数组类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0032.%20%E6%95%B0%E7%BB%84%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 JavaScript 数组在 TypeScript 中分为哪两种类型？](#3--javascript-数组在-typescript-中分为哪两种类型)
- [4. 🤔 TypeScript 数组的根本特征是什么？](#4--typescript-数组的根本特征是什么)
- [5. 🤔 TypeScript 数组类型有哪几种写法？](#5--typescript-数组类型有哪几种写法)
- [6. 🤔 复杂类型的数组声明为什么需要使用括号？](#6--复杂类型的数组声明为什么需要使用括号)
- [7. 🤔 数组成员可以是任意类型吗？](#7--数组成员可以是任意类型吗)
- [8. 🤔 数组声明后成员数量有限制吗？](#8--数组声明后成员数量有限制吗)
- [9. 🤔 TypeScript 会对数组边界进行检查吗？](#9--typescript-会对数组边界进行检查吗)
- [10. 🤔 如何读取数组成员的类型？](#10--如何读取数组成员的类型)
- [11. 🤔 TypeScript 如何推断空数组的类型？](#11--typescript-如何推断空数组的类型)
- [12. 🤔 TypeScript 如何推断非空数组的类型？](#12--typescript-如何推断非空数组的类型)
- [13. 🤔 JavaScript 中 const 声明的数组可以修改吗？](#13--javascript-中-const-声明的数组可以修改吗)
- [14. 🤔 如何声明只读数组？](#14--如何声明只读数组)
- [15. 🤔 只读数组有哪些限制？](#15--只读数组有哪些限制)
- [16. 🤔 只读数组和普通数组有什么关系？](#16--只读数组和普通数组有什么关系)
- [17. 🤔 为什么只读数组不能作为普通数组参数传递？](#17--为什么只读数组不能作为普通数组参数传递)
- [18. 🤔 readonly 关键字能与 Array 泛型一起使用吗？](#18--readonly-关键字能与-array-泛型一起使用吗)
- [19. 🤔 ReadonlyArray 和 Readonly 有什么区别？](#19--readonlyarray-和-readonly-有什么区别)
- [20. 🤔 const 断言如何创建只读数组？](#20--const-断言如何创建只读数组)
- [21. 🤔 如何声明多维数组？](#21--如何声明多维数组)
- [22. 🤔 多维数组如何访问元素？](#22--多维数组如何访问元素)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- todo

## 2. 🫧 评价

- todo

## 3. 🤔 JavaScript 数组在 TypeScript 中分为哪两种类型？

JavaScript 数组在 TypeScript 中分为两种类型：数组（array）和元组（tuple）。数组要求所有成员类型相同但数量不确定，元组则允许成员类型不同但数量固定。

## 4. 🤔 TypeScript 数组的根本特征是什么？

TypeScript 数组的根本特征是所有成员的类型必须相同，但成员数量是不确定的。数组可以有无限数量的成员，也可以是零成员（空数组）。

```typescript
let arr: number[] = [1, 2, 3]
// 所有成员类型都是 number，数量可以变化
```

## 5. 🤔 TypeScript 数组类型有哪几种写法？

TypeScript 数组类型有两种主要写法：

1. 在数组成员类型后加方括号：`number[]`
2. 使用 TypeScript 内置的 Array 接口：`Array<number>`

```typescript
// 写法一：方括号语法
let arr1: number[] = [1, 2, 3]

// 写法二：Array 接口语法
let arr2: Array<number> = [1, 2, 3]
```

## 6. 🤔 复杂类型的数组声明为什么需要使用括号？

当数组成员类型是联合类型时，需要使用括号来明确运算优先级。因为竖杠 `|` 的优先级低于 `[]`，所以 `number|string[]` 会被理解成 `number` 和 `string[]` 的联合类型，而不是数组成员类型为 `number|string` 的数组。

```typescript
// 错误写法：会被理解为 number 和 string[] 的联合类型
let arr1: number | string[] = [1, 'a'] // 类型错误

// 正确写法：使用括号明确优先级
let arr2: (number | string)[] = [1, 'a'] // 正确

// 同样适用于 Array 接口写法
let arr3: Array<number | string> = [1, 'a']
```

## 7. 🤔 数组成员可以是任意类型吗？

可以使用 `any[]` 表示数组成员可以是任意类型，但这种写法应该避免使用，因为它失去了类型检查的意义。

```typescript
// 不推荐的写法
let arr: any[] = [1, 'hello', true, { name: 'Tom' }]

// 推荐的写法：使用联合类型
let arr2: (number | string | boolean | object)[] = [
  1,
  'hello',
  true,
  { name: 'Tom' },
]
```

## 8. 🤔 数组声明后成员数量有限制吗？

数组类型声明后，成员数量是不限制的，可以是任意数量的成员，包括空数组。数组成员可以动态变化。

```typescript
let arr: number[]
arr = [] // 空数组
arr = [1] // 一个成员
arr = [1, 2] // 两个成员
arr = [1, 2, 3] // 三个成员
// 都是正确的

// 数组成员可以动态变化
let arr2: number[] = [1, 2, 3]
arr2[3] = 4 // 增加成员
arr2.length = 2 // 减少成员
```

## 9. 🤔 TypeScript 会对数组边界进行检查吗？

TypeScript 不会对数组边界进行检查，越界访问数组并不会报错。这是为了兼容 JavaScript 的行为。

```typescript
let arr: number[] = [1, 2, 3]
let foo = arr[3] // 正确，不会报错，foo 的值为 undefined

// 实际运行时行为
console.log(arr[3]) // undefined
console.log(arr[100]) // undefined
```

## 10. 🤔 如何读取数组成员的类型？

TypeScript 允许使用方括号读取数组成员的类型，有两种方式：

```typescript
type Names = string[]

// 方式一：通过具体索引读取类型
type Name = Names[0] // string

// 方式二：通过 number 类型读取所有成员的联合类型
type AllNames = Names[number] // string

// 更复杂的示例
type MixedArray = (string | number)[]
type MixedType = MixedArray[number] // string|number
type FirstType = MixedArray[0] // string|number
```

## 11. 🤔 TypeScript 如何推断空数组的类型？

如果数组变量的初始值是空数组，TypeScript 会推断数组类型是 `any[]`，并在后续赋值时自动更新类型推断。

```typescript
// 初始为空数组，推断为 any[]
const arr = []
// arr 的类型为 any[]

arr.push(123)
// arr 的类型更新为 number[]

arr.push('abc')
// arr 的类型更新为 (string|number)[]

console.log(arr) // [123, 'abc']
```

## 12. 🤔 TypeScript 如何推断非空数组的类型？

如果数组变量的初始值不是空数组，TypeScript 会根据初始值确定类型，且不会自动更新类型推断。

```typescript
// 根据初始值推断为 number[]
const arr = [123]

arr.push(456) // 正确
arr.push('abc') // 报错：类型不匹配

// 如果需要多种类型，应在声明时明确指定
const arr2: (number | string)[] = [123]
arr2.push('abc') // 正确
```

## 13. 🤔 JavaScript 中 const 声明的数组可以修改吗？

JavaScript 规定，`const` 命令声明的数组变量是可以改变成员的，`const` 只是防止重新赋值变量本身。

```typescript
const arr = [0, 1]
arr[0] = 2 // 允许：修改数组成员
arr.push(3) // 允许：添加数组成员
// arr = [3, 4]; // 不允许：重新赋值变量会报错
```

## 14. 🤔 如何声明只读数组？

有多种方式可以声明只读数组：

```typescript
// 方式一：使用 readonly 关键字
const arr1: readonly number[] = [0, 1]

// 方式二：使用 ReadonlyArray 泛型
const arr2: ReadonlyArray<number> = [0, 1]

// 方式三：使用 Readonly 工具类型
const arr3: Readonly<number[]> = [0, 1]

// 方式四：使用 const 断言
const arr4 = [0, 1] as const
```

## 15. 🤔 只读数组有哪些限制？

只读数组不允许修改、新增或删除成员：

```typescript
const arr: readonly number[] = [0, 1]

arr[1] = 2 // 报错：不能修改
arr.push(3) // 报错：不能添加
arr.pop() // 报错：不能删除
delete arr[0] // 报错：不能删除
```

## 16. 🤔 只读数组和普通数组有什么关系？

`readonly number[]` 是 `number[]` 的父类型。子类型可以赋值给父类型，但父类型不能赋值给子类型。

```typescript
let mutable: number[] = [0, 1]
let readonly: readonly number[] = mutable // 正确：子类型赋值给父类型

// readonly = mutable; // 正确：同一对象
// mutable = readonly; // 报错：父类型不能赋值给子类型
```

## 17. 🤔 为什么只读数组不能作为普通数组参数传递？

因为只读数组是普通数组的父类型，父类型不能替代子类型：

```typescript
function processArray(s: number[]) {
  s.push(4) // 函数内部可能修改数组
}

const readonlyArr: readonly number[] = [1, 2, 3]

// 报错：只读数组不能传递给要求可变数组的函数
// processArray(readonlyArr);

// 解决方法：使用类型断言
processArray(readonlyArr as number[])
```

## 18. 🤔 readonly 关键字能与 Array 泛型一起使用吗？

不能，`readonly` 关键字不能与数组的泛型写法一起使用：

```typescript
// 报错：readonly 不能与 Array<number> 一起使用
// const arr:readonly Array<number> = [0, 1];

// 正确的写法
const arr1: readonly number[] = [0, 1]
const arr2: ReadonlyArray<number> = [0, 1]
const arr3: Readonly<number[]> = [0, 1]
```

## 19. 🤔 ReadonlyArray 和 Readonly 有什么区别？

`ReadonlyArray<T>` 和 `Readonly<T[]>` 都可以生成只读数组类型，但语法不同：

```typescript
// ReadonlyArray<T>：尖括号内是数组成员类型
const arr1: ReadonlyArray<number> = [0, 1]

// Readonly<T[]>：尖括号内是整个数组类型
const arr2: Readonly<number[]> = [0, 1]

// 两者效果相同，只是语法不同
```

## 20. 🤔 const 断言如何创建只读数组？

使用 `as const` 可以创建只读数组，TypeScript 会推断为具体的只读元组类型：

```typescript
const arr = [0, 1] as const
// 类型被推断为 readonly [0, 1]

arr[0] = 2 // 报错：不能修改只读数组成员

// 更复杂的示例
const complex = [1, 'hello', true] as const
// 类型被推断为 readonly [1, "hello", true]
```

## 21. 🤔 如何声明多维数组？

TypeScript 使用 `T[][]` 的形式表示二维数组，`T` 是最底层数组成员的类型：

```typescript
// 二维数组：number[][]
var multi: number[][] = [
  [1, 2, 3],
  [23, 24, 25],
]

// 三维数组：string[][][]
var three: string[][][] = [[['a', 'b'], ['c']], [['d', 'e', 'f']]]

// 不规则多维数组
var irregular: number[][] = [[1, 2], [3, 4, 5], [6]]
```

## 22. 🤔 多维数组如何访问元素？

多维数组通过多重索引访问元素：

```typescript
var multi: number[][] = [
  [1, 2, 3],
  [23, 24, 25],
]

// 访问第一行第三列的元素
let element = multi[0][2] // 3

// 访问第二行第一列的元素
let element2 = multi[1][0] // 23

// 类型安全检查
console.log(multi[0][100]) // undefined，但不报错
```
