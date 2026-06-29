# [0256. 编译性能优化](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0256.%20%E7%BC%96%E8%AF%91%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 编译性能的常见问题？](#3-编译性能的常见问题)
  - [3.1. 全量重编译](#31-全量重编译)
  - [3.2. 复杂类型计算](#32-复杂类型计算)
  - [3.3. 类型断言滥用](#33-类型断言滥用)
- [4. 配置选项优化？](#4-配置选项优化)
  - [4.1. 增量编译](#41-增量编译)
  - [4.2. 类型检查范围](#42-类型检查范围)
  - [4.3. 模块解析](#43-模块解析)
  - [4.4. 输出配置](#44-输出配置)
- [5. 项目结构优化？](#5-项目结构优化)
  - [5.1. 项目引用（Project References）](#51-项目引用project-references)
  - [5.2. 模块化设计](#52-模块化设计)
  - [5.3. 按功能分包](#53-按功能分包)
- [6. 类型使用优化？](#6-类型使用优化)
  - [6.1. 避免复杂类型计算](#61-避免复杂类型计算)
  - [6.2. 使用类型别名缓存](#62-使用类型别名缓存)
  - [6.3. 简化泛型](#63-简化泛型)
  - [6.4. 限制联合类型大小](#64-限制联合类型大小)
- [7. 诊断和监控？](#7-诊断和监控)
  - [7.1. 编译时间统计](#71-编译时间统计)
  - [7.2. 详细跟踪](#72-详细跟踪)
  - [7.3. 扩展的诊断信息](#73-扩展的诊断信息)
  - [7.4. 使用 TypeScript Language Server](#74-使用-typescript-language-server)
  - [7.5. 性能优化工具](#75-性能优化工具)
- [8. 引用](#8-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 编译性能的常见问题
- 配置选项优化
- 项目结构优化
- 类型使用优化
- 诊断和监控工具

## 2. 评价

编译性能直接影响开发体验，优化可以显著提升效率。

- 增量编译减少重复工作
- 合理的项目引用结构
- 避免复杂的类型计算
- 使用性能分析工具定位问题
- 权衡严格检查与速度

## 3. 编译性能的常见问题？

大型项目常遇到的性能瓶颈。

### 3.1. 全量重编译

```ts
// ⚠️ 每次修改都重新编译所有文件

// 项目结构
// src/
//   ├── utils/      (100 个文件)
//   ├── components/ (500 个文件)
//   ├── services/   (200 个文件)
//   └── index.ts

// 修改 utils/helper.ts 后
// ❌ 没有增量编译：重新编译所有 800 个文件
// ✅ 增量编译：只重新编译 helper.ts 及其依赖
```

### 3.2. 复杂类型计算

```ts
// ⚠️ 过度复杂的类型导致编译慢

// ❌ 深度递归类型
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

// 在大型对象上使用会很慢
interface LargeObject {
  a: { b: { c: { d: { e: string } } } };
  // ... 许多嵌套层级
}

type PartialLarge = DeepPartial<LargeObject>;  // ⚠️ 编译慢

// ✅ 限制递归深度
type DeepPartial<T, Depth extends number = 5> = Depth extends 0
  ? T
  : T extends object
  ? { [K in keyof T]?: DeepPartial<T[K], Prev<Depth>> }
  : T;

type Prev<T extends number> = T extends 1 ? 0 : /* ... */;
```

### 3.3. 类型断言滥用

```ts
// ⚠️ 过多的类型断言降低性能

// ❌ 每次都重新断言
function process(data: unknown) {
  const user = data as User
  console.log(user.name)
  console.log((data as User).age) // 重复断言
  console.log((data as User).email) // 重复断言
}

// ✅ 一次断言后使用
function process2(data: unknown) {
  const user = data as User
  console.log(user.name)
  console.log(user.age)
  console.log(user.email)
}
```

## 4. 配置选项优化？

通过 tsconfig.json 优化编译性能。

### 4.1. 增量编译

```json
// ✅ 启用增量编译
{
  "compilerOptions": {
    "incremental": true, // 启用增量编译
    "tsBuildInfoFile": ".tsbuildinfo", // 缓存文件位置
    "skipLibCheck": true, // 跳过库文件类型检查
    "skipDefaultLibCheck": true // 跳过默认库检查
  }
}

// 首次编译：生成 .tsbuildinfo
// 后续编译：只重新编译修改的文件
```

### 4.2. 类型检查范围

```json
// ✅ 优化类型检查范围
{
  "compilerOptions": {
    "skipLibCheck": true, // 跳过 node_modules 中的 .d.ts
    "noUnusedLocals": false, // 开发时关闭未使用变量检查
    "noUnusedParameters": false // 开发时关闭未使用参数检查
  },
  "include": [
    "src/**/*" // 只检查 src 目录
  ],
  "exclude": [
    "node_modules", // 排除 node_modules
    "dist", // 排除输出目录
    "**/*.spec.ts" // 开发时排除测试文件
  ]
}
```

### 4.3. 模块解析

```json
// ✅ 优化模块解析
{
  "compilerOptions": {
    "moduleResolution": "node", // 使用 Node 解析策略
    "resolveJsonModule": false, // 不需要时关闭 JSON 解析
    "esModuleInterop": true, // 改善兼容性
    "allowSyntheticDefaultImports": true,

    // 路径映射（避免相对路径）
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

### 4.4. 输出配置

```json
// ✅ 优化输出
{
  "compilerOptions": {
    "declaration": false, // 开发时不生成 .d.ts
    "declarationMap": false, // 开发时不生成声明映射
    "sourceMap": true, // 保留 source map 用于调试
    "inlineSourceMap": false, // 不内联（文件更小）
    "removeComments": true, // 移除注释
    "importHelpers": true, // 使用 tslib 减小体积
    "noEmitOnError": false // 有错误时也生成文件
  }
}
```

## 5. 项目结构优化？

合理的项目结构可以提升编译速度。

### 5.1. 项目引用（Project References）

```json
// ✅ 将大型项目拆分为多个子项目

// 根目录 tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/utils" },
    { "path": "./packages/ui" }
  ]
}

// packages/core/tsconfig.json
{
  "compilerOptions": {
    "composite": true,              // 启用项目引用
    "declaration": true,            // 必须生成声明文件
    "outDir": "./dist",
    "rootDir": "./src"
  }
}

// packages/ui/tsconfig.json
{
  "compilerOptions": {
    "composite": true
  },
  "references": [
    { "path": "../core" }           // 引用其他项目
  ]
}

// 编译命令
// tsc --build                      // 按依赖顺序编译
// tsc --build --watch              // 监听模式
```

### 5.2. 模块化设计

```ts
// ✅ 避免循环依赖

// ❌ 循环依赖降低性能
// a.ts
import { B } from './b'
export class A {
  b: B
}

// b.ts
import { A } from './a'
export class B {
  a: A
}

// ✅ 使用接口解耦
// types.ts
export interface IA {
  b: IB
}
export interface IB {
  a: IA
}

// a.ts
import { IA, IB } from './types'
export class A implements IA {
  b: IB
}

// b.ts
import { IA, IB } from './types'
export class B implements IB {
  a: IA
}
```

### 5.3. 按功能分包

```ts
// ✅ 合理的目录结构

// 项目结构
// packages/
//   ├── core/           // 核心功能（稳定，很少修改）
//   ├── utils/          // 工具函数（稳定）
//   ├── components/     // UI 组件（频繁修改）
//   └── app/            // 应用代码（频繁修改）

// 优势：
// - 修改 app/ 不会触发 core/ 重编译
// - 不同包可以并行编译
// - 缓存更有效
```

## 6. 类型使用优化？

优化类型定义可以提升编译速度。

### 6.1. 避免复杂类型计算

```ts
// ❌ 复杂的条件类型
type DeepRequired<T> = T extends object
  ? { [K in keyof T]-?: DeepRequired<T[K]> }
  : T

interface Config {
  database: {
    host: string
    port?: number
    credentials?: {
      username?: string
      password?: string
    }
  }
}

type RequiredConfig = DeepRequired<Config> // ⚠️ 慢

// ✅ 直接定义具体类型
interface RequiredConfig {
  database: {
    host: string
    port: number
    credentials: {
      username: string
      password: string
    }
  }
}
```

### 6.2. 使用类型别名缓存

```ts
// ❌ 重复计算
function process1(data: Omit<User, 'password' | 'token'>) {}
function process2(data: Omit<User, 'password' | 'token'>) {}
function process3(data: Omit<User, 'password' | 'token'>) {}

// ✅ 缓存类型
type PublicUser = Omit<User, 'password' | 'token'>

function process1(data: PublicUser) {}
function process2(data: PublicUser) {}
function process3(data: PublicUser) {}
```

### 6.3. 简化泛型

```ts
// ❌ 过多的泛型参数
function complex<T1, T2, T3, T4, T5>(a: T1, b: T2, c: T3, d: T4, e: T5) {
  // ...
}

// ✅ 使用对象参数
interface Params<T> {
  data: T
  options: {
    timeout: number
    retries: number
  }
}

function simple<T>(params: Params<T>) {
  // ...
}
```

### 6.4. 限制联合类型大小

```ts
// ⚠️ 过大的联合类型
type AllColors =
  | "red" | "green" | "blue" | "yellow" | "orange"
  | "purple" | "pink" | "brown" | "gray" | "black"
  | "white" | /* ... 100+ 种颜色 */;

// ✅ 使用 string 加上品牌
type Color = string & { __brand: "Color" };

const red: Color = "red" as Color;

// 或者使用枚举
enum Color {
  Red = "red",
  Green = "green",
  Blue = "blue"
  // ...
}
```

## 7. 诊断和监控？

使用工具分析和优化性能。

### 7.1. 编译时间统计

```bash
# ✅ 查看编译时间
tsc --diagnostics

# 输出示例：
# Files:              500
# Lines:              100000
# Nodes:              500000
# Identifiers:        200000
# Symbols:            150000
# Types:              50000
# Instantiations:     30000
# Memory used:        200 MB
# I/O read:          0.5s
# I/O write:         0.2s
# Parse time:        2.3s
# Bind time:         1.1s
# Check time:        5.6s
# Emit time:         1.2s
# Total time:        10.2s
```

### 7.2. 详细跟踪

```bash
# ✅ 生成性能跟踪文件
tsc --generateTrace trace

# 生成 trace 目录：
# trace/
#   ├── trace.json          # Chrome DevTools 格式
#   ├── types.json          # 类型信息
#   └── legend.json         # 图例

# 在 Chrome DevTools 中打开 trace.json：
# 1. 打开 Chrome DevTools
# 2. Performance 标签
# 3. Load Profile
# 4. 选择 trace.json

# 可以看到：
# - 每个文件的编译时间
# - 类型检查瓶颈
# - 热点函数
```

### 7.3. 扩展的诊断信息

```bash
# ✅ 更详细的诊断
tsc --extendedDiagnostics

# 输出额外信息：
# - 模块解析时间
# - 文件读取时间
# - 符号查找时间
# - 类型实例化时间
```

### 7.4. 使用 TypeScript Language Server

```ts
// ✅ VS Code 性能监控

// 1. 命令面板：TypeScript: Restart TS Server
// 2. 输出面板：TypeScript
// 3. 查看日志：
//    - 文件重新检查
//    - 内存使用
//    - 响应时间

// tsconfig.json 中启用日志
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "typescript-plugin-performance",
        "logFile": "ts-performance.log"
      }
    ]
  }
}
```

### 7.5. 性能优化工具

```bash
# ✅ 使用 ts-prune 找出未使用的导出
npm install -g ts-prune
ts-prune

# 输出示例：
# src/utils/helper.ts:10 - unusedFunction
# src/types/old.ts:5 - OldInterface

# ✅ 使用 dpdm 检查循环依赖
npm install -g dpdm
dpdm src/index.ts

# ✅ 使用 size-limit 监控包体积
npm install -D size-limit
size-limit
```

## 8. 引用

- [Performance][1]
- [Project References][2]
- [Compiler Options][3]

[1]: https://github.com/microsoft/TypeScript/wiki/Performance
[2]: https://www.typescriptlang.org/docs/handbook/project-references.html
[3]: https://www.typescriptlang.org/tsconfig
