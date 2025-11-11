# [0085. 多维数组](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0085.%20%E5%A4%9A%E7%BB%B4%E6%95%B0%E7%BB%84)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是多维数组？](#3--什么是多维数组)
- [4. 🤔 如何声明多维数组？](#4--如何声明多维数组)
  - [4.1. 二维数组](#41-二维数组)
  - [4.2. 三维数组](#42-三维数组)
  - [4.3. 不规则数组（Jagged Array）](#43-不规则数组jagged-array)
  - [4.4. 只读多维数组](#44-只读多维数组)
- [5. 🤔 多维数组的类型推断行为是？](#5--多维数组的类型推断行为是)
  - [5.1. 自动推断](#51-自动推断)
  - [5.2. 不规则数组的推断](#52-不规则数组的推断)
  - [5.3. const 断言](#53-const-断言)
- [6. 🤔 多维数组的常见用途都有哪些？](#6--多维数组的常见用途都有哪些)
  - [6.1. 用途 1：矩阵运算](#61-用途-1矩阵运算)
  - [6.2. 用途 2：表格数据](#62-用途-2表格数据)
  - [6.3. 用途 3：游戏地图](#63-用途-3游戏地图)
  - [6.4. 用途 4：图像数据](#64-用途-4图像数据)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 多维数组的定义和声明
- 类型推断规则
- 实际应用场景

## 2. 🫧 评价

多维数组（Multidimensional Arrays）是数组的数组，在 TypeScript 中，多维数组本质上是嵌套的一维数组。

虽然 JavaScript/TypeScript 没有原生的多维数组类型（不像 C/C++ 等语言），但通过数组嵌套可以实现相同的功能。

多维数组常用于表示矩阵、表格、立方体等多维数据结构。（关于多维数组的用途和操作是属于 JS 层面的知识点，本文不会过多介绍）

## 3. 🤔 什么是多维数组？

多维数组是数组的数组，每个元素本身也是一个数组。

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
matrix[0][0] = 10 // ❌ Error
matrix.push([7, 8, 9]) // ❌ Error

// 简化写法（需要 TypeScript 3.4+）
type ReadonlyMatrix = readonly (readonly number[])[]
```

## 5. 🤔 多维数组的类型推断行为是？

### 5.1. 自动推断

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

### 5.2. 不规则数组的推断

```ts
// ⚠️ 不规则数组
const jagged = [[1, 2, 3], [4, 5], [6]]
// 推断类型：number[][]（但长度不一致）

// ✅ 更安全的方式：使用元组
type JaggedArray = [[number, number, number], [number, number], [number]]

const jagged2: JaggedArray = [[1, 2, 3], [4, 5], [6]]
```

### 5.3. const 断言

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
// 类型：const GRID: readonly [readonly ["A", "B", "C"], readonly ["D", "E", "F"]]

// 小技巧：多维数组类型展开
type CellValue = (typeof GRID)[number][number]
// 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
```

## 6. 🤔 多维数组的常见用途都有哪些？

### 6.1. 用途 1：矩阵运算

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

### 6.2. 用途 2：表格数据

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

### 6.3. 用途 3：游戏地图

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

### 6.4. 用途 4：图像数据

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

## 7. 🔗 引用

- [MDN - Array][1]
- [TypeScript Handbook - Arrays][2]

[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[2]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays
