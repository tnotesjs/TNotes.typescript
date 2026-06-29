# [0032. 数组类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0032.%20%E6%95%B0%E7%BB%84%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. JavaScript 数组在 TypeScript 中分为哪两种类型？](#3-javascript-数组在-typescript-中分为哪两种类型)
- [4. TypeScript 数组类型有哪几种写法？](#4-typescript-数组类型有哪几种写法)
- [5. 数组成员类型可以是联合类型吗？](#5-数组成员类型可以是联合类型吗)
- [6. 数组成员可以是任意类型吗？](#6-数组成员可以是任意类型吗)
- [7. 数组声明后成员数量有限制吗？](#7-数组声明后成员数量有限制吗)
- [8. 如何读取数组成员的类型？](#8-如何读取数组成员的类型)
- [9. TypeScript 如何推断空数组的类型？](#9-typescript-如何推断空数组的类型)
- [10. TypeScript 如何推断非空数组的类型？](#10-typescript-如何推断非空数组的类型)
- [11. 如何声明只读数组？](#11-如何声明只读数组)
- [12. 只读数组有哪些限制？](#12-只读数组有哪些限制)
- [13. 只读数组和普通数组有什么关系？](#13-只读数组和普通数组有什么关系)
- [14. 为什么只读数组不能作为普通数组参数传递？](#14-为什么只读数组不能作为普通数组参数传递)
- [15. 如何声明多维数组？](#15-如何声明多维数组)

<!-- endregion:toc -->

## 1. 本节内容

- 数组（array）
- 只读数组（read-only array）
  - readonly 修饰符
  - ReadonlyArray 泛型工具
  - Readonly 泛型工具
  - as const 断言
- 只读数组和普通数组的关系
- 多维数组
- 元组（tuple）

## 2. 评价

- 在 JS 中，给你一个列表 `[ ... ]`，它的类型就是 array。
- 在 TS 中，对数组进行了细分：
  - 类型统一且长度不定的列表，叫数组（array）
  - 类型不定且数量固定的列表，叫元组（tuple）
- 本节主要介绍 TS 中的 array 类型。

## 3. JavaScript 数组在 TypeScript 中分为哪两种类型？

JavaScript 数组在 TypeScript 中分为两种类型：数组（array）和元组（tuple）。

- array：组要求所有成员类型相同但数量不确定
  - 同类型：
    - ❌ 错误理解：数组所有成员的类型必须相同
    - ✅ 正确理解：数组所有成员的类型只写一次，比如 `any []` 类型的数组，表示数组每一项都是 `any` 类型，`number []` 表示数组每一项都是 `number` 类型。
  - 长度不定：数组可以有无限数量的成员，也可以是零成员（空数组）
- tuple：允许成员类型可以不同但数量固定
  - 多类型：每一个成员的类型都可以自行配置，允许不同
  - 长度固定：需要将每个成员都列出来

## 4. TypeScript 数组类型有哪几种写法？

TypeScript 数组类型的写法有很多，下面两种写法是比较常见的：

1. 在数组成员类型后加方括号：`number[]`
2. 使用 TypeScript 内置的 Array 接口：`Array<number>`

```ts
// 写法一：方括号语法
let arr1: number[] = [1, 2, 3]

// 写法二：Array 接口语法
let arr2: Array<number> = [1, 2, 3]
```

## 5. 数组成员类型可以是联合类型吗？

- 可以，但要注意 -> 别忘记给联合类型加上括号！
- 当数组成员类型是联合类型时，需要使用括号来明确运算优先级。
  - `let arr1: number | string[]` ❌
  - `let arr2: (number | string)[]` ✅
  - 因为竖杠 `|` 的优先级低于 `[]`，所以 `number|string[]` 会被理解成 `number` 和 `string[]` 的联合类型，而不是数组成员类型为 `number|string` 的数组。

```ts
// 错误写法：会被理解为 number 和 string[] 的联合类型
let arr1: number | string[] = [1, 'a'] // 类型错误

// 正确写法：使用括号明确优先级
let arr2: (number | string)[] = [1, 'a'] // 正确

// 同样适用于 Array 接口写法
let arr3: Array<number | string> = [1, 'a']
```

## 6. 数组成员可以是任意类型吗？

- 可以，但不推荐使用。
- 可以使用 `any[]` 表示数组成员可以是任意类型，但这种写法应该避免使用，因为它失去了类型检查的意义。
- 推荐使用联合类型，比如 `(number | string | boolean | object)[]`，这样就可以在一定程度上限制数组成员的类型，更加安全一些。

```ts
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

## 7. 数组声明后成员数量有限制吗？

- 数组类型声明后，成员数量是不限制的，可以是任意数量的成员，包括空数组。数组成员可以动态变化。
- 越界访问不会警告错误（兼容 JavaScript 的行为）。

```ts
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

// 越界访问不会警告错误
arr2[999] // ok
```

## 8. 如何读取数组成员的类型？

- TypeScript 允许使用方括号 `[]` 读取数组成员的类型，有两种方式：

```ts
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

## 9. TypeScript 如何推断空数组的类型？

::: warning ⚠️ 注意：IDE 误推断

- 下面示例中的 TS IDE 类型推断有些是错误的；
- 详细说明记录在了 `0007. 动态类型 vs. 静态类型` 中的 `demos.3` 示例中；

:::

- 在默认配置下，如果数组变量的初始值是空数组，TypeScript 会推断数组类型是 `any[]`。

```ts
// 初始为空数组，推断为 any[]
const arr = []
// arr 的类型为 any[] - arr 的类型确定后将不再改变

arr.push(123)
// arr 的类型更新为 number[] - 这是 IDE 的错误推断

console.log(arr) // [123]

arr.push('abc')
// arr 的类型更新为 (string|number)[] - 这是 IDE 的错误推断

console.log(arr) // [123, 'abc']
```

- 如果关闭 `noImplicitAny` 配置并开启 `strictNullChecks` 配置，那么空数组将被推断为 `never[]`。
  - 这意味着这就是一个空数组，并且每一个成员都是 `never` 空集。
  - 只有 `never` 类型才能赋值给 `never` 类型，其它任何类型都与 `never` 不兼容。

::: tip 💡 提示：开发建议

- 不应该：记这些细节。
- 不应该：交给 TS 来推断空数组的类型。
- 应该：如果你要定义一个数组，最好在定义的时候就明确成员的类型，不要交给 TS 来推断类型。如果你就要定义一个可以容纳任何类型的数组，可以显示地写成 `const arr: any[] = []`。

:::

## 10. TypeScript 如何推断非空数组的类型？

如果数组变量的初始值不是空数组，TypeScript 会根据初始值确定类型。

```ts
const arr = [123]
// arr 根据初始值被 TS 推断为 number[]

arr.push(456) // 正确
// arr.push('abc') // 报错：类型不匹配

// 如果需要多种类型，应在声明时明确指定
const arr2: (number | string)[] = [123]
arr2.push('abc') // 正确

const arr3 = [123, '123']
// arr3 根据初始值被 TS 推断为 (string | number)[]

const arr4 = [123, '123', false, 456, true]
// arr4 根据初始值被 TS 推断为 (string | number | boolean)[]
```

## 11. 如何声明只读数组？

有多种方式可以声明只读数组：

```ts
// 方式一：使用 readonly 关键字
const arr1: readonly number[] = [0, 1]

// 方式二：使用 ReadonlyArray 泛型
const arr2: ReadonlyArray<number> = [0, 1]

// 方式三：使用 Readonly 工具类型
const arr3: Readonly<number[]> = [0, 1]

// 方式四：使用 const 断言
const arr4 = [0, 1] as const
```

`readonly` 关键字不能与数组的泛型写法一起使用：

```ts
// ❌ 报错：readonly 不能与 Array<number> 一起使用
// const arr:readonly Array<number> = [0, 1];
// 'readonly' type modifier is only permitted on array and tuple literal types.(1354)

// 正确的写法
const arr1: readonly number[] = [0, 1]
const arr2: ReadonlyArray<number> = [0, 1]
const arr3: Readonly<number[]> = [0, 1]
```

使用 `ReadonlyArray<T>` 和 `Readonly<T[]>` 生成只读数组之间的区别：两者都可以生成只读数组类型，但语法不同

```ts
// ReadonlyArray<T>：尖括号内是数组成员类型
const arr1: ReadonlyArray<number> = [0, 1]

// Readonly<T[]>：尖括号内是整个数组类型
const arr2: Readonly<number[]> = [0, 1]

// 两者效果相同，只是语法不同
```

使用 `as const` 可以创建只读数组，并且 TypeScript 会推断为具体的只读元组类型：

```ts
const arr = [0, 1] as const
// 类型被推断为 readonly [0, 1]

arr[0] = 2 // 报错：不能修改只读数组成员

// 更复杂的示例
const complex = [1, 'hello', true] as const
// 类型被推断为 readonly [1, "hello", true]
```

## 12. 只读数组有哪些限制？

只读数组不允许修改、新增或删除成员：

```ts
const arr: readonly number[] = [0, 1]

arr[1] = 2 // ❌ 报错：不能修改
arr.push(3) // ❌ 报错：不能添加
arr.pop() // ❌ 报错：不能删除
delete arr[0] // ❌ 报错：不能删除
```

## 13. 只读数组和普通数组有什么关系？

`readonly number[]` 是 `number[]` 的父类型。

类比：一个能读写的文件可以当作只读文件来用（安全）；但只读文件不能当作可写文件来用（不安全）。

`number[] ⊆ readonly number[]` TS 允许你把“可写的数组”当成“只读的数组”使用（因为读取安全），但不能反过来。

```ts
let mutable: number[] = [0, 1]
let readonlyArr: readonly number[] = [2, 3]

readonlyArr = mutable // ✅ 正确：子类型赋值给父类型
mutable = readonlyArr // ❌ 报错：父类型不能赋值给子类型
// The type 'readonly number[]' is 'readonly' and cannot be assigned to the mutable type 'number[]'.(4104)

// 子类型可以赋值给父类型，但父类型不能赋值给子类型。
```

## 14. 为什么只读数组不能作为普通数组参数传递？

因为只读数组是普通数组的父类型，父类型不能替代子类型：

```ts
function processArray(s: number[]) {
  s.push(4) // 函数内部可能修改数组
}

const readonlyArr: readonly number[] = [1, 2, 3]

// ❌ 报错：只读数组不能传递给要求可变数组的函数
// processArray(readonlyArr);
// Argument of type 'readonly number[]' is not assignable to parameter of type 'number[]'.
// The type 'readonly number[]' is 'readonly' and cannot be assigned to the mutable type 'number[]'.(2345)

// ✅ 解决方法：使用类型断言
processArray(readonlyArr as number[])
```

## 15. 如何声明多维数组？

TypeScript 使用 `T[][]` 的形式表示二维数组，`T` 是最底层数组成员的类型：

```ts
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

多维数组通过多重索引访问元素：

```ts
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
