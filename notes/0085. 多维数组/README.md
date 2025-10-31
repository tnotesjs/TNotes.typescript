# [0085. 多维数组](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0085.%20%E5%A4%9A%E7%BB%B4%E6%95%B0%E7%BB%84)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是多维数组？](#3--什么是多维数组)
  - [3.1. 可视化理解](#31-可视化理解)
- [4. 🤔 如何声明多维数组？](#4--如何声明多维数组)
  - [4.1. 二维数组](#41-二维数组)
  - [4.2. 三维数组](#42-三维数组)
  - [4.3. 不规则数组（Jagged Array）](#43-不规则数组jagged-array)
  - [4.4. 只读多维数组](#44-只读多维数组)
- [5. 🤔 多维数组的常见用途](#5--多维数组的常见用途)
  - [5.1. 用途 1：矩阵运算](#51-用途-1矩阵运算)
  - [5.2. 用途 2：表格数据](#52-用途-2表格数据)
  - [5.3. 用途 3：游戏地图](#53-用途-3游戏地图)
  - [5.4. 用途 4：图像数据](#54-用途-4图像数据)
- [6. 🤔 如何操作多维数组？](#6--如何操作多维数组)
  - [6.1. 遍历二维数组](#61-遍历二维数组)
  - [6.2. 映射（map）](#62-映射map)
  - [6.3. 过滤（filter）](#63-过滤filter)
  - [6.4. 展平（flat）](#64-展平flat)
  - [6.5. 归约（reduce）](#65-归约reduce)
- [7. 🤔 多维数组的类型推断](#7--多维数组的类型推断)
  - [7.1. 自动推断](#71-自动推断)
  - [7.2. 不规则数组的推断](#72-不规则数组的推断)
  - [7.3. const 断言](#73-const-断言)
- [8. 🤔 常见错误和最佳实践](#8--常见错误和最佳实践)
  - [8.1. 错误 1：未检查数组长度](#81-错误-1未检查数组长度)
  - [8.2. 错误 2：浅拷贝陷阱](#82-错误-2浅拷贝陷阱)
  - [8.3. 错误 3：性能问题](#83-错误-3性能问题)
  - [8.4. 最佳实践](#84-最佳实践)
- [9. 🔗 引用](#9--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 多维数组的定义和声明
- 二维数组、三维数组的使用
- 多维数组的遍历和操作
- 类型推断规则
- 实际应用场景
- 性能优化建议

## 2. 🫧 评价

多维数组（Multidimensional Arrays）是**数组的数组**，用于表示矩阵、表格、立方体等多维数据结构。在 TypeScript 中，多维数组本质上是嵌套的一维数组。

虽然 JavaScript/TypeScript 没有原生的多维数组类型（不像 C/C++ 等语言），但通过**数组嵌套**可以实现相同的功能。理解多维数组的使用，对于处理表格数据、矩阵运算、游戏地图等场景至关重要。

本节将介绍多维数组的声明、操作和最佳实践，帮助你在 TypeScript 中高效处理多维数据。

## 3. 🤔 什么是多维数组？

多维数组是**数组的数组**，每个元素本身也是一个数组。

```ts
// 一维数组
const array1D: number[] = [1, 2, 3, 4, 5]

// 二维数组（矩阵）
const array2D: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
]

// 三维数组（立方体）
const array3D: number[][][] = [
  [
    [1, 2],
    [3, 4],
  ],
  [
    [5, 6],
    [7, 8],
  ],
]
```

### 3.1. 可视化理解

```
一维数组：
[1, 2, 3, 4, 5]

二维数组（3×3 矩阵）：
[
  [1, 2, 3],  ← 第 0 行
  [4, 5, 6],  ← 第 1 行
  [7, 8, 9]   ← 第 2 行
]
  ↑  ↑  ↑
  列 列 列
  0  1  2

三维数组（2×2×2 立方体）：
[
  [           ← 第 0 层
    [1, 2],   ← 第 0 层第 0 行
    [3, 4]    ← 第 0 层第 1 行
  ],
  [           ← 第 1 层
    [5, 6],   ← 第 1 层第 0 行
    [7, 8]    ← 第 1 层第 1 行
  ]
]
```

## 4. 🤔 如何声明多维数组？

### 4.1. 二维数组

::: code-group

```ts [方括号语法（推荐）]
// ✅ 简洁直观
const matrix: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
]

// 字符串二维数组
const grid: string[][] = [
  ['A', 'B', 'C'],
  ['D', 'E', 'F'],
]

// 对象二维数组
interface Cell {
  value: number
  color: string
}

const table: Cell[][] = [
  [
    { value: 1, color: 'red' },
    { value: 2, color: 'blue' },
  ],
  [
    { value: 3, color: 'green' },
    { value: 4, color: 'yellow' },
  ],
]
```

```ts [泛型语法]
// 使用 Array<Array<T>>
const matrix: Array<Array<number>> = [
  [1, 2, 3],
  [4, 5, 6],
]

// ⚠️ 嵌套较深，可读性下降
const grid: Array<Array<string>> = [
  ['A', 'B'],
  ['C', 'D'],
]
```

:::

### 4.2. 三维数组

```ts
// ✅ 方括号语法
const cube: number[][][] = [
  [
    [1, 2],
    [3, 4],
  ],
  [
    [5, 6],
    [7, 8],
  ],
]

// 访问元素
const value = cube[0][1][0] // 3
//                 ↑  ↑  ↑
//              层 行 列
```

### 4.3. 不规则数组（Jagged Array）

```ts
// JavaScript/TypeScript 支持不规则数组
const jagged: number[][] = [
  [1, 2, 3], // 长度 3
  [4, 5], // 长度 2
  [6, 7, 8, 9, 10], // 长度 5
]

// 访问时需要检查长度
jagged[0][2] // ✅ 3
jagged[1][2] // ⚠️ undefined（越界）
```

### 4.4. 只读多维数组

```ts
// 只读二维数组
const matrix: readonly (readonly number[])[] = [
  [1, 2, 3],
  [4, 5, 6],
]

// ❌ 不能修改
matrix[0][0] = 10 // Error
matrix.push([7, 8, 9]) // Error

// 简化写法（需要 TypeScript 3.4+）
type ReadonlyMatrix = readonly (readonly number[])[]
```

## 5. 🤔 多维数组的常见用途

### 5.1. 用途 1：矩阵运算

```ts
// 数学矩阵
type Matrix = number[][]

function createMatrix(rows: number, cols: number, defaultValue = 0): Matrix {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => defaultValue)
  )
}

// 创建 3×3 零矩阵
const matrix = createMatrix(3, 3)
// [[0, 0, 0], [0, 0, 0], [0, 0, 0]]

// 矩阵加法
function addMatrices(a: Matrix, b: Matrix): Matrix {
  const rows = a.length
  const cols = a[0].length

  return a.map((row, i) => row.map((val, j) => val + b[i][j]))
}

// 矩阵转置
function transpose(matrix: Matrix): Matrix {
  const rows = matrix.length
  const cols = matrix[0].length

  return Array.from({ length: cols }, (_, j) =>
    Array.from({ length: rows }, (_, i) => matrix[i][j])
  )
}
```

### 5.2. 用途 2：表格数据

```ts
// 表格数据表示
interface TableData {
  headers: string[]
  rows: (string | number)[][]
}

const salesData: TableData = {
  headers: ['Product', 'Q1', 'Q2', 'Q3', 'Q4'],
  rows: [
    ['Laptop', 100, 120, 150, 180],
    ['Phone', 200, 220, 240, 260],
    ['Tablet', 80, 90, 100, 110],
  ],
}

// 获取特定单元格
function getCell(data: TableData, row: number, col: number) {
  return data.rows[row][col]
}

// 获取某列数据
function getColumn(data: TableData, colIndex: number): (string | number)[] {
  return data.rows.map((row) => row[colIndex])
}
```

### 5.3. 用途 3：游戏地图

```ts
// 2D 游戏地图
enum TileType {
  Empty = 0,
  Wall = 1,
  Player = 2,
  Enemy = 3,
  Treasure = 4,
}

type GameMap = TileType[][]

const map: GameMap = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 2, 0, 3, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 4, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1],
]

// 检查位置是否可通行
function isWalkable(map: GameMap, x: number, y: number): boolean {
  if (y < 0 || y >= map.length || x < 0 || x >= map[0].length) {
    return false
  }
  return map[y][x] !== TileType.Wall
}
```

### 5.4. 用途 4：图像数据

```ts
// RGB 图像（3 通道）
type RGBImage = number[][][] // [height][width][3]

function createImage(width: number, height: number): RGBImage {
  return Array.from(
    { length: height },
    () => Array.from({ length: width }, () => [0, 0, 0]) // [R, G, B]
  )
}

// 设置像素颜色
function setPixel(
  image: RGBImage,
  x: number,
  y: number,
  rgb: [number, number, number]
) {
  image[y][x] = rgb
}

// 获取像素颜色
function getPixel(
  image: RGBImage,
  x: number,
  y: number
): [number, number, number] {
  return image[y][x] as [number, number, number]
}
```

## 6. 🤔 如何操作多维数组？

### 6.1. 遍历二维数组

::: code-group

```ts [for 循环]
const matrix: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
]

// 嵌套 for 循环
for (let i = 0; i < matrix.length; i++) {
  for (let j = 0; j < matrix[i].length; j++) {
    console.log(`matrix[${i}][${j}] = ${matrix[i][j]}`)
  }
}
```

```ts [forEach]
const matrix: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
]

// forEach 嵌套
matrix.forEach((row, i) => {
  row.forEach((value, j) => {
    console.log(`matrix[${i}][${j}] = ${value}`)
  })
})
```

```ts [for...of]
const matrix: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
]

// for...of 嵌套
for (const [i, row] of matrix.entries()) {
  for (const [j, value] of row.entries()) {
    console.log(`matrix[${i}][${j}] = ${value}`)
  }
}
```

:::

### 6.2. 映射（map）

```ts
const matrix: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
]

// 所有元素 ×2
const doubled = matrix.map((row) => row.map((value) => value * 2))
// [[2, 4, 6], [8, 10, 12]]

// 转换为字符串
const stringMatrix = matrix.map((row) => row.map((value) => value.toString()))
// [['1', '2', '3'], ['4', '5', '6']]
```

### 6.3. 过滤（filter）

```ts
const matrix: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
]

// 过滤行（保留和 > 10 的行）
const filteredRows = matrix.filter(
  (row) => row.reduce((sum, val) => sum + val, 0) > 10
)
// [[4, 5, 6], [7, 8, 9]]

// 过滤每行的元素（保留偶数）
const filteredValues = matrix.map((row) =>
  row.filter((value) => value % 2 === 0)
)
// [[2], [4, 6], [8]]
```

### 6.4. 展平（flat）

```ts
const matrix: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
]

// 展平为一维数组
const flat = matrix.flat()
// [1, 2, 3, 4, 5, 6, 7, 8, 9]

// 三维数组展平
const cube: number[][][] = [
  [
    [1, 2],
    [3, 4],
  ],
  [
    [5, 6],
    [7, 8],
  ],
]

const flat1 = cube.flat() // 展平一层
// [[1, 2], [3, 4], [5, 6], [7, 8]]

const flat2 = cube.flat(2) // 展平两层
// [1, 2, 3, 4, 5, 6, 7, 8]
```

### 6.5. 归约（reduce）

```ts
const matrix: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
]

// 计算矩阵所有元素的和
const sum = matrix.reduce(
  (total, row) => total + row.reduce((rowSum, val) => rowSum + val, 0),
  0
)
// 45

// 找出最大值
const max = matrix.reduce((maxVal, row) => Math.max(maxVal, ...row), -Infinity)
// 9
```

## 7. 🤔 多维数组的类型推断

### 7.1. 自动推断

```ts
// ✅ TypeScript 自动推断
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
]
// 推断类型：number[][]

const mixed = [
  [1, 'a'],
  [2, 'b'],
]
// 推断类型：(string | number)[][]
```

### 7.2. 不规则数组的推断

```ts
// ⚠️ 不规则数组
const jagged = [[1, 2, 3], [4, 5], [6]]
// 推断类型：number[][]（但长度不一致）

// ✅ 更安全的方式：使用元组
type JaggedArray = [[number, number, number], [number, number], [number]]

const jagged2: JaggedArray = [[1, 2, 3], [4, 5], [6]]
```

### 7.3. const 断言

```ts
// 普通推断
const matrix1 = [
  [1, 2],
  [3, 4],
]
// 类型：number[][]

// const 断言
const matrix2 = [
  [1, 2],
  [3, 4],
] as const
// 类型：readonly [readonly [1, 2], readonly [3, 4]]

// 应用场景：常量配置
const GRID = [
  ['A', 'B', 'C'],
  ['D', 'E', 'F'],
] as const

type CellValue = (typeof GRID)[number][number]
// 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
```

## 8. 🤔 常见错误和最佳实践

### 8.1. 错误 1：未检查数组长度

```ts
const matrix: number[][] = [
  [1, 2, 3],
  [4, 5],
]

// ❌ 假设所有行长度相同
function getColumn(matrix: number[][], col: number): number[] {
  return matrix.map((row) => row[col]) // 可能返回 undefined
}

// ✅ 检查长度
function getColumnSafe(matrix: number[][], col: number): number[] {
  return matrix.map((row) => row[col] ?? 0) // 使用默认值
}

// 或者验证矩阵规整性
function validateMatrix(matrix: number[][]): boolean {
  if (matrix.length === 0) return true
  const expectedLength = matrix[0].length
  return matrix.every((row) => row.length === expectedLength)
}
```

### 8.2. 错误 2：浅拷贝陷阱

```ts
const original: number[][] = [
  [1, 2],
  [3, 4],
]

// ❌ 浅拷贝（修改会影响原数组）
const copy1 = original.slice()
copy1[0][0] = 99
console.log(original[0][0]) // 99（被修改了！）

// ✅ 深拷贝
const copy2 = original.map((row) => [...row])
copy2[0][0] = 99
console.log(original[0][0]) // 1（未被修改）

// ✅ 使用 JSON（简单但有限制）
const copy3 = JSON.parse(JSON.stringify(original))

// ✅ 使用库（推荐）
import { cloneDeep } from 'lodash'
const copy4 = cloneDeep(original)
```

### 8.3. 错误 3：性能问题

```ts
// ❌ 创建大型数组的低效方式
function createMatrixBad(rows: number, cols: number): number[][] {
  const matrix: number[][] = []
  for (let i = 0; i < rows; i++) {
    matrix[i] = []
    for (let j = 0; j < cols; j++) {
      matrix[i][j] = 0
    }
  }
  return matrix
}

// ✅ 高效方式
function createMatrixGood(rows: number, cols: number): number[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 0)
  )
}

// ✅ 或使用 fill + map
function createMatrixFill(rows: number, cols: number): number[][] {
  return Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(0))
}
```

### 8.4. 最佳实践

```ts
// ✅ 1. 使用类型别名提高可读性
type Matrix = number[][]
type Point = [number, number]

// ✅ 2. 创建辅助函数
function getRows(matrix: Matrix): number {
  return matrix.length
}

function getCols(matrix: Matrix): number {
  return matrix[0]?.length ?? 0
}

function isValidIndex(matrix: Matrix, row: number, col: number): boolean {
  return (
    row >= 0 &&
    row < matrix.length &&
    col >= 0 &&
    col < (matrix[row]?.length ?? 0)
  )
}

// ✅ 3. 使用 const 断言保护常量
const DIRECTIONS = [
  [-1, 0], // 上
  [1, 0], // 下
  [0, -1], // 左
  [0, 1], // 右
] as const

// ✅ 4. 提供默认值
function getCell(
  matrix: Matrix,
  row: number,
  col: number,
  defaultValue = 0
): number {
  return matrix[row]?.[col] ?? defaultValue
}

// ✅ 5. 使用泛型函数
function createEmptyMatrix<T>(
  rows: number,
  cols: number,
  defaultValue: T
): T[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => defaultValue)
  )
}
```

## 9. 🔗 引用

- [MDN - Array][1]
- [TypeScript Handbook - Arrays][2]

[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[2]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays
