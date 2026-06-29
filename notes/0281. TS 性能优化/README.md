# [0281. TS 性能优化](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0281.%20TS%20%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 运行时性能优化？](#3-运行时性能优化)
  - [3.1. 避免类型转换开销](#31-避免类型转换开销)
  - [3.2. 优化循环和迭代](#32-优化循环和迭代)
  - [3.3. 对象池模式](#33-对象池模式)
- [4. 包体积优化？](#4-包体积优化)
  - [4.1. Tree-shaking](#41-tree-shaking)
  - [4.2. 代码分割](#42-代码分割)
  - [4.3. 配置优化](#43-配置优化)
- [5. 类型计算性能？](#5-类型计算性能)
  - [5.1. 避免深度递归](#51-避免深度递归)
  - [5.2. 缓存类型计算](#52-缓存类型计算)
  - [5.3. 简化联合类型](#53-简化联合类型)
- [6. 开发体验优化？](#6-开发体验优化)
  - [6.1. 减小项目引用范围](#61-减小项目引用范围)
  - [6.2. 使用项目引用](#62-使用项目引用)
  - [6.3. 禁用不必要的检查](#63-禁用不必要的检查)
- [7. 监控和度量？](#7-监控和度量)
  - [7.1. 编译时间分析](#71-编译时间分析)
  - [7.2. 包体积分析](#72-包体积分析)
  - [7.3. 运行时性能监控](#73-运行时性能监控)
  - [7.4. 性能预算](#74-性能预算)
- [8. 引用](#8-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 运行时性能优化
- 包体积优化
- 类型计算性能
- 开发体验优化
- 监控和度量

## 2. 评价

TypeScript 本身不影响运行时性能，但可以通过类型系统指导优化。

- TypeScript 编译后就是 JavaScript
- 类型擦除意味着零运行时开销
- Tree-shaking 减小包体积
- 避免复杂类型计算提升编译速度
- 使用工具监控性能指标

## 3. 运行时性能优化？

TypeScript 的类型可以帮助避免性能陷阱。

### 3.1. 避免类型转换开销

```ts
// ❌ 频繁的类型检查和转换
function process(data: unknown) {
  if (typeof data === 'string') {
    // 字符串处理
  } else if (typeof data === 'number') {
    // 数字处理
  } else if (Array.isArray(data)) {
    // 数组处理
  }
}

// ✅ 使用明确的类型
function processString(data: string) {
  // 字符串处理
}

function processNumber(data: number) {
  // 数字处理
}

function processArray(data: any[]) {
  // 数组处理
}
```

### 3.2. 优化循环和迭代

```ts
// ❌ 创建中间数组
function sumEven(numbers: number[]): number {
  return numbers
    .filter((n) => n % 2 === 0) // 创建新数组
    .reduce((sum, n) => sum + n, 0)
}

// ✅ 单次遍历
function sumEvenOptimized(numbers: number[]): number {
  let sum = 0
  for (const n of numbers) {
    if (n % 2 === 0) {
      sum += n
    }
  }
  return sum
}

// ✅ 使用 readonly 提示不可变性
function processReadonly(data: readonly number[]) {
  // 编译器知道 data 不会被修改
  // 可以做更激进的优化
  return data.reduce((sum, n) => sum + n, 0)
}
```

### 3.3. 对象池模式

```ts
// ✅ 对象池减少 GC 压力
class ObjectPool<T> {
  private available: T[] = []

  constructor(
    private factory: () => T,
    private reset: (obj: T) => void,
    initialSize: number = 10,
  ) {
    for (let i = 0; i < initialSize; i++) {
      this.available.push(factory())
    }
  }

  acquire(): T {
    return this.available.pop() || this.factory()
  }

  release(obj: T) {
    this.reset(obj)
    this.available.push(obj)
  }
}

// 使用
interface Point {
  x: number
  y: number
}

const pointPool = new ObjectPool<Point>(
  () => ({ x: 0, y: 0 }),
  (point) => {
    point.x = 0
    point.y = 0
  },
)

function calculateDistance(p1: Point, p2: Point): number {
  const temp = pointPool.acquire()
  temp.x = p2.x - p1.x
  temp.y = p2.y - p1.y
  const distance = Math.sqrt(temp.x ** 2 + temp.y ** 2)
  pointPool.release(temp)
  return distance
}
```

## 4. 包体积优化？

减小最终打包文件的体积。

### 4.1. Tree-shaking

```ts
// ✅ 使用 ES 模块以启用 tree-shaking
// utils.ts
export function usedFunction() {
  return 'used'
}

export function unusedFunction() {
  return 'unused'
}

// main.ts
import { usedFunction } from './utils'
console.log(usedFunction())

// 打包后 unusedFunction 会被移除

// ❌ 避免导入整个库
import * as _ from 'lodash' // 导入全部

// ✅ 只导入需要的部分
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
```

### 4.2. 代码分割

```ts
// ✅ 动态导入实现代码分割
async function loadModule() {
  const module = await import('./heavy-module')
  module.doSomething()
}

// ✅ 路由级别的代码分割
const routes = [
  {
    path: '/home',
    component: () => import('./pages/Home'),
  },
  {
    path: '/about',
    component: () => import('./pages/About'),
  },
]
```

### 4.3. 配置优化

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020", // 更现代的目标减少 polyfill
    "module": "ESNext", // 使用 ES 模块
    "moduleResolution": "node",
    "importHelpers": true, // 使用 tslib 共享辅助函数
    "removeComments": true, // 移除注释
    "declaration": false, // 生产环境不需要声明文件
    "sourceMap": false // 生产环境可以关闭 source map
  }
}
```

## 5. 类型计算性能？

避免复杂的类型计算影响编译速度。

### 5.1. 避免深度递归

```ts
// ❌ 无限递归
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? DeepReadonly<T[K]>  // 可能无限递归
    : T[K];
};

// ✅ 限制递归深度
type DeepReadonlyLimited<T, Depth extends number = 5> = {
  readonly [K in keyof T]: Depth extends 0
    ? T[K]
    : T[K] extends object
    ? DeepReadonlyLimited<T[K], Prev<Depth>>
    : T[K];
};

type Prev<N extends number> = N extends 0 ? 0 : N extends 1 ? 0 : /* ... */;
```

### 5.2. 缓存类型计算

```ts
// ❌ 重复计算
function fn1(data: Omit<User, 'password'>) {}
function fn2(data: Omit<User, 'password'>) {}
function fn3(data: Omit<User, 'password'>) {}

// ✅ 缓存结果
type PublicUser = Omit<User, 'password'>

function fn1(data: PublicUser) {}
function fn2(data: PublicUser) {}
function fn3(data: PublicUser) {}
```

### 5.3. 简化联合类型

```ts
// ❌ 超大联合类型
type AllColors = "red" | "blue" | /* 100+ 种颜色 */;

// ✅ 使用 string 加品牌
type Color = string & { __brand: "Color" };
```

## 6. 开发体验优化？

提升开发时的编辑器性能。

### 6.1. 减小项目引用范围

```json
// tsconfig.json
{
  "include": [
    "src/**/*" // 只包含 src
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.spec.ts", // 开发时排除测试
    "**/*.test.ts"
  ]
}
```

### 6.2. 使用项目引用

```json
// 根目录 tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/ui" }
  ]
}

// packages/core/tsconfig.json
{
  "compilerOptions": {
    "composite": true,    // 启用项目引用
    "incremental": true
  }
}
```

### 6.3. 禁用不必要的检查

```json
// tsconfig.json（开发环境）
{
  "compilerOptions": {
    "skipLibCheck": true, // 跳过库文件检查
    "noUnusedLocals": false, // 开发时允许未使用的变量
    "noUnusedParameters": false
  }
}
```

## 7. 监控和度量？

使用工具监控性能指标。

### 7.1. 编译时间分析

```bash
# ✅ 测量编译时间
tsc --diagnostics

# ✅ 详细跟踪
tsc --generateTrace trace
# 在 Chrome DevTools 中打开 trace/trace.json
```

### 7.2. 包体积分析

```bash
# ✅ 使用 webpack-bundle-analyzer
npm install -D webpack-bundle-analyzer

# webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
};
```

### 7.3. 运行时性能监控

```ts
// ✅ 性能标记
function measurePerformance<T>(name: string, fn: () => T): T {
  const start = performance.now()
  try {
    return fn()
  } finally {
    const duration = performance.now() - start
    console.log(`${name} took ${duration.toFixed(2)}ms`)
  }
}

// 使用
const result = measurePerformance('heavyComputation', () => {
  // 复杂计算
  return Array.from({ length: 1000000 }, (_, i) => i * 2)
})

// ✅ 内存使用监控
function measureMemory<T>(name: string, fn: () => T): T {
  if (performance.memory) {
    const before = performance.memory.usedJSHeapSize
    const result = fn()
    const after = performance.memory.usedJSHeapSize
    const used = ((after - before) / 1024 / 1024).toFixed(2)
    console.log(`${name} used ${used}MB`)
    return result
  }
  return fn()
}
```

### 7.4. 性能预算

```json
// package.json
{
  "size-limit": [
    {
      "path": "dist/index.js",
      "limit": "10 KB"
    },
    {
      "path": "dist/vendor.js",
      "limit": "50 KB"
    }
  ]
}
```

## 8. 引用

- [TypeScript Performance][1]
- [webpack Performance][2]
- [size-limit][3]

[1]: https://github.com/microsoft/TypeScript/wiki/Performance
[2]: https://webpack.js.org/guides/build-performance/
[3]: https://github.com/ai/size-limit
