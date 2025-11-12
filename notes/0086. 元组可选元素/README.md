# [0086. 元组可选元素](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0086.%20%E5%85%83%E7%BB%84%E5%8F%AF%E9%80%89%E5%85%83%E7%B4%A0)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是元组可选元素？](#3--什么是元组可选元素)
  - [3.1. 基本语法](#31-基本语法)
  - [3.2. 与 undefined 的对比](#32-与-undefined-的对比)
  - [3.3. 多个可选元素](#33-多个可选元素)
- [4. 🤔 可选元素的位置有什么要求？](#4--可选元素的位置有什么要求)
- [5. 🤔 可选元素对 length 有什么影响？](#5--可选元素对-length-有什么影响)
- [6. 🤔 关于可选元素的实践建议都有哪些？](#6--关于可选元素的实践建议都有哪些)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 元组可选元素的定义
- 可选元素的声明语法
- 与 `| undefined` 联合类型的区别
- 最佳实践建议

## 2. 🫧 评价

元组可选元素（Optional Tuple Elements）是 TypeScript 3.0 引入的特性，允许元组的某些位置可以存在或不存在。通过在类型后添加 `?`，可以标记元组元素为可选的。

## 3. 🤔 什么是元组可选元素？

元组可选元素允许元组的某些位置可以不存在（而不是必须为 `undefined`）。

```ts
// 普通元组：3 个必需元素
type Point3D = [number, number, number]
const p1: Point3D = [10, 20, 30] // ✅
const p2: Point3D = [10, 20] // ❌
// Type '[number, number]' is not assignable to type 'Point3D'.
//   Source has 2 element(s) but target requires 3.(2322)

// 可选元素：第 3 个元素可选
type Point = [number, number, number?]
const p3: Point = [10, 20, 30] // ✅
const p4: Point = [10, 20] // ✅ 第 3 个元素可以省略
const p5: Point = [10] // ❌
// Type '[number]' is not assignable to type 'Point'.
//   Source has 1 element(s) but target requires 2.(2322)

// 类型
const z1: number | undefined = p3[2] // number | undefined
const z2: number | undefined = p4[2] // number | undefined
```

### 3.1. 基本语法

```ts
// 在类型后添加 ?
type Tuple1 = [string, number?]
type Tuple2 = [string, number?, boolean?]
type Tuple3 = [string, number, boolean?]

// 示例
const t1: Tuple1 = ['hello'] // ✅
const t2: Tuple1 = ['hello', 42] // ✅

const t3: Tuple2 = ['hello'] // ✅
const t4: Tuple2 = ['hello', 42] // ✅
const t5: Tuple2 = ['hello', 42, true] // ✅

const t6: Tuple3 = ['hello', 42] // ✅
const t7: Tuple3 = ['hello', 42, true] // ✅
const t8: Tuple3 = ['hello'] // ❌
// Type '[string]' is not assignable to type 'Tuple3'.
// Source has 1 element(s) but target requires 2.(2322)
```

### 3.2. 与 undefined 的对比

关键区别：

- 可选元素：可以不存在（length 可以更短）
- `undefined` 联合：必须存在，但值可以是 `undefined`

| 特性     | 可选元素       | undefined 联合           |
| -------- | -------------- | ------------------------ |
| 语法     | `[T, U?]`      | `[T, U \| undefined]`    |
| length   | 可变（1 或 2） | 固定（2）                |
| 必须提供 | 否             | 是（但可以是 undefined） |
| 语义     | 元素可能不存在 | 元素存在但可能未定义     |
| 使用场景 | 可变长度参数   | 可能为 undefined 的值    |

::: code-group

```ts [可选元素]
// 可选元素：可以不存在
type Tuple = [string, number?]

const t1: Tuple = ['hello'] // ✅ length = 1
const t2: Tuple = ['hello', 42] // ✅ length = 2

console.log(t1.length) // 1
console.log(t2.length) // 2
```

```ts [undefined 联合]
// undefined 联合：必须存在，但可以是 undefined
type Tuple = [string, number | undefined]

const t1: Tuple = ['hello'] // ❌ Error: Property '1' is missing
const t2: Tuple = ['hello', undefined] // ✅ length = 2
const t3: Tuple = ['hello', 42] // ✅ length = 2

console.log(t2.length) // 2
console.log(t3.length) // 2
```

:::

### 3.3. 多个可选元素

```ts
// 多个连续的可选元素
type Config = [string, number?, boolean?, string?]

const c1: Config = ['app'] // ✅
const c2: Config = ['app', 42] // ✅
const c3: Config = ['app', 42, true] // ✅
const c4: Config = ['app', 42, true, 'production'] // ✅

// 访问可选元素
const name: string = c1[0] // string
const port: number | undefined = c1[1] // number | undefined
const debug: boolean | undefined = c1[2] // boolean | undefined
const env: string | undefined = c1[3] // string | undefined
```

## 4. 🤔 可选元素的位置有什么要求？

可选元素必须在必需元素之后

```ts
// ✅ 正确：可选元素在后
type Good1 = [string, number?]
type Good2 = [string, number, boolean?]
type Good3 = [string, number?, boolean?, string?]

// ❌ 错误：可选元素之后不能有必需元素
type Bad1 = [string, number?, boolean] // ❌ Error
// A required element cannot follow an optional element.(1257)

type Bad2 = [string?, number] // ❌ Error
// A required element cannot follow an optional element.(1257)
```

## 5. 🤔 可选元素对 length 有什么影响？

可选元素影响 length 类型的推断。

```ts
type Tuple1 = [string, number] // 必需 2 个
type Tuple2 = [string, number?] // 1 或 2 个
type Tuple3 = [string, number?, boolean?] // 1、2 或 3 个

const t1: Tuple1 = ['a', 1]
t1.length // 类型：2

const t2: Tuple2 = ['a']
t2.length // 类型：1 | 2

const t3: Tuple3 = ['a', 1]
t3.length // 类型：1 | 2 | 3
```

## 6. 🤔 关于可选元素的实践建议都有哪些？

```ts
// ✅ 1. 使用可选元素而不是 undefined 联合表示可变长度
type Good = [string, number?]
type Bad = [string, number | undefined]

// ✅ 2. 提供默认值
function parse(input: [string, number?, boolean?]): Config {
  const [name, port = 3000, debug = false] = input
  return { name, port, debug }
}

// ✅ 3. 使用类型别名提高可读性
type Coordinate2D = [number, number]
type Coordinate3D = [number, number, number]
type Coordinate = [number, number, number?] // 通用类型

// ✅ 4. 检查 length 来确定元素存在性
function process(coord: Coordinate) {
  if (coord.length === 3) {
    const z: number = coord[2] // ✅ TypeScript 知道 z 一定存在
  }
}

// ✅ 5. 使用空值合并运算符
function getZ(coord: Coordinate): number {
  return coord[2] ?? 0 // 如果不存在，返回 0
}

// ✅ 6. 函数重载提供更精确的类型
function createPoint(x: number, y: number): [number, number]
function createPoint(x: number, y: number, z: number): [number, number, number]
function createPoint(
  x: number,
  y: number,
  z?: number
): [number, number, number?] {
  return z !== undefined ? [x, y, z] : [x, y]
}
```

## 7. 🔗 引用

- [TypeScript 3.0 Release Notes - Optional Elements in Tuple Types][1]
- [TypeScript Handbook - Tuple Types][2]

[1]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#optional-elements-in-tuple-types
[2]: https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types
