# [0179. 自动生成 d.ts 文件](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0179.%20%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%20d.ts%20%E6%96%87%E4%BB%B6)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 如何配置自动生成声明文件？](#3--如何配置自动生成声明文件)
  - [3.1. 基本配置](#31-基本配置)
  - [3.2. 项目示例](#32-项目示例)
  - [3.3. 命令行使用](#33-命令行使用)
  - [3.4. npm scripts 配置](#34-npm-scripts-配置)
- [4. 🤔 declaration 相关的配置选项有哪些？](#4--declaration-相关的配置选项有哪些)
  - [4.1. declaration](#41-declaration)
  - [4.2. declarationDir](#42-declarationdir)
  - [4.3. declarationMap](#43-declarationmap)
  - [4.4. emitDeclarationOnly](#44-emitdeclarationonly)
  - [4.5. composite](#45-composite)
  - [4.6. stripInternal](#46-stripinternal)
  - [4.7. 完整配置示例](#47-完整配置示例)
- [5. 🤔 如何生成符合规范的声明文件？](#5--如何生成符合规范的声明文件)
  - [5.1. 导出规范](#51-导出规范)
  - [5.2. 类型导出](#52-类型导出)
  - [5.3. 泛型保留](#53-泛型保留)
  - [5.4. 保留 JSDoc 注释](#54-保留-jsdoc-注释)
  - [5.5. 私有成员处理](#55-私有成员处理)
- [6. 🤔 常见问题如何解决？](#6--常见问题如何解决)
  - [6.1. 问题 1：私有字段报错](#61-问题-1私有字段报错)
  - [6.2. 问题 2：类型引用丢失](#62-问题-2类型引用丢失)
  - [6.3. 问题 3：循环引用](#63-问题-3循环引用)
  - [6.4. 问题 4：路径别名](#64-问题-4路径别名)
  - [6.5. 问题 5：声明文件位置错误](#65-问题-5声明文件位置错误)
  - [6.6. 问题 6：重复声明](#66-问题-6重复声明)
  - [6.7. 实用工具脚本](#67-实用工具脚本)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 声明文件自动生成的配置
- declaration 相关编译选项
- 生成高质量声明文件的技巧
- 常见问题和解决方案
- 实际项目配置示例

## 2. 🫧 评价

TypeScript 编译器可以自动从 TS 代码生成声明文件。

- 使用 `declaration: true` 启用声明文件生成
- 自动生成的声明文件与源代码保持同步
- 适合库开发和 npm 包发布
- 配合 `declarationMap` 可以支持类型定义的跳转
- 正确的配置能确保生成符合规范的声明文件

## 3. 🤔 如何配置自动生成声明文件？

基础配置和使用方法。

### 3.1. 基本配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "declaration": true, // 生成 .d.ts 文件
    "outDir": "./dist", // 输出目录
    "declarationDir": "./types" // 声明文件输出目录（可选）
  },
  "include": ["src/**/*"]
}
```

### 3.2. 项目示例

```typescript
// src/math.ts - 源文件
/**
 * 加法函数
 * @param a - 第一个数字
 * @param b - 第二个数字
 * @returns 两数之和
 */
export function add(a: number, b: number): number {
  return a + b
}

/**
 * 乘法函数
 */
export function multiply(a: number, b: number): number {
  return a * b
}

/**
 * 计算器类
 */
export class Calculator {
  private value: number = 0

  constructor(initialValue?: number) {
    if (initialValue !== undefined) {
      this.value = initialValue
    }
  }

  add(n: number): this {
    this.value += n
    return this
  }

  getValue(): number {
    return this.value
  }
}
```

编译后自动生成：

```typescript
// dist/math.d.ts - 自动生成的声明文件
/**
 * 加法函数
 * @param a - 第一个数字
 * @param b - 第二个数字
 * @returns 两数之和
 */
export declare function add(a: number, b: number): number

/**
 * 乘法函数
 */
export declare function multiply(a: number, b: number): number

/**
 * 计算器类
 */
export declare class Calculator {
  private value

  constructor(initialValue?: number)

  add(n: number): this

  getValue(): number
}
```

### 3.3. 命令行使用

```bash
# 生成声明文件
tsc --declaration

# 指定输出目录
tsc --declaration --outDir ./dist

# 只生成声明文件，不生成 JS
tsc --declaration --emitDeclarationOnly

# 同时生成声明映射文件
tsc --declaration --declarationMap
```

### 3.4. npm scripts 配置

```json
// package.json
{
  "name": "my-library",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "build:types": "tsc --emitDeclarationOnly",
    "watch": "tsc --watch",
    "prepublishOnly": "npm run build"
  },
  "files": ["dist"]
}
```

## 4. 🤔 declaration 相关的配置选项有哪些？

详细的配置选项说明。

### 4.1. declaration

```json
{
  "compilerOptions": {
    // 生成 .d.ts 声明文件
    "declaration": true
  }
}
```

```typescript
// 示例
// src/index.ts
export const version = '1.0.0'
export function init() {}

// 生成 dist/index.d.ts
export declare const version: string
export declare function init(): void
```

### 4.2. declarationDir

```json
{
  "compilerOptions": {
    "declaration": true,
    "outDir": "./dist",
    "declarationDir": "./types" // 将声明文件输出到单独的目录
  }
}
```

```typescript
// 目录结构
// src/
//   index.ts
//   utils.ts
// dist/        (JS 文件)
//   index.js
//   utils.js
// types/       (声明文件)
//   index.d.ts
//   utils.d.ts
```

### 4.3. declarationMap

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true // 生成 .d.ts.map 文件
  }
}
```

```typescript
// 生成的文件
// dist/
//   index.js
//   index.d.ts
//   index.d.ts.map  // ✅ 支持跳转到 TypeScript 源码

// 在 IDE 中使用库时，点击类型可以跳转到原始 .ts 文件而不是 .d.ts
```

### 4.4. emitDeclarationOnly

```json
{
  "compilerOptions": {
    "declaration": true,
    "emitDeclarationOnly": true // 只生成声明文件，不生成 JS
  }
}
```

```bash
# 使用场景：使用其他工具（如 Babel）编译 JS，但需要 TypeScript 生成类型
tsc --emitDeclarationOnly
babel src --out-dir dist
```

### 4.5. composite

```json
{
  "compilerOptions": {
    "declaration": true,
    "composite": true, // 启用项目引用
    "declarationMap": true
  }
}
```

### 4.6. stripInternal

```json
{
  "compilerOptions": {
    "declaration": true,
    "stripInternal": true // 移除带 @internal 标记的声明
  }
}
```

```typescript
// src/api.ts
/**
 * 公开 API
 */
export function publicApi() {}

/**
 * @internal
 * 内部 API，不会出现在声明文件中
 */
export function internalApi() {}

// 生成的 api.d.ts
export declare function publicApi(): void
// internalApi 不会被导出
```

### 4.7. 完整配置示例

```json
// tsconfig.json - 库项目完整配置
{
  "compilerOptions": {
    // 基础配置
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],

    // 声明文件配置
    "declaration": true, // ✅ 生成声明文件
    "declarationMap": true, // ✅ 生成声明映射
    "declarationDir": "./types", // ✅ 声明文件目录
    "emitDeclarationOnly": false, // 同时生成 JS 和声明文件
    "stripInternal": true, // ✅ 移除内部 API

    // 输出配置
    "outDir": "./dist",
    "rootDir": "./src",

    // 类型检查
    "strict": true,
    "skipLibCheck": true,

    // 模块解析
    "moduleResolution": "node",
    "esModuleInterop": true,
    "resolveJsonModule": true,

    // Source Map
    "sourceMap": true,

    // 其他
    "removeComments": false // ✅ 保留注释以便生成文档
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
```

## 5. 🤔 如何生成符合规范的声明文件？

最佳实践和规范。

### 5.1. 导出规范

```typescript
// ✅ 推荐：明确的命名导出
// src/index.ts
export { add, subtract } from './math'
export { User, Post } from './models'
export type { ApiResponse, ErrorResponse } from './types'

// 生成的 index.d.ts
export { add, subtract } from './math'
export { User, Post } from './models'
export type { ApiResponse, ErrorResponse } from './types'

// ❌ 避免：export * 会导致声明不明确
export * from './math' // 不推荐
```

### 5.2. 类型导出

```typescript
// ✅ 推荐：使用 export type 导出纯类型
// src/types.ts
export type Status = 'pending' | 'success' | 'error'

export interface User {
  id: string
  name: string
}

// 如果需要导出值和类型，分开导出
export const DEFAULT_STATUS: Status = 'pending'
export type { Status }

// ❌ 避免：混淆类型和值的导出
export { Status } // 如果 Status 是纯类型，应该用 export type
```

### 5.3. 泛型保留

```typescript
// src/container.ts
export class Container<T> {
  private items: T[] = []

  add(item: T): void {
    this.items.push(item)
  }

  get(index: number): T | undefined {
    return this.items[index]
  }
}

// 生成的 container.d.ts - 泛型完整保留
export declare class Container<T> {
  private items

  add(item: T): void

  get(index: number): T | undefined
}
```

### 5.4. 保留 JSDoc 注释

````typescript
// src/logger.ts
/**
 * 日志级别
 */
export enum LogLevel {
  /** 调试信息 */
  Debug = 0,
  /** 一般信息 */
  Info = 1,
  /** 警告信息 */
  Warn = 2,
  /** 错误信息 */
  Error = 3,
}

/**
 * 日志记录器
 * @example
 * ```typescript
 * const logger = new Logger(LogLevel.Info);
 * logger.log('Hello');
 * ```
 */
export class Logger {
  /**
   * 创建日志记录器
   * @param level - 最小日志级别
   */
  constructor(level: LogLevel) {}

  /**
   * 记录日志
   * @param message - 日志消息
   * @param level - 日志级别
   */
  log(message: string, level?: LogLevel): void {}
}

// 生成的 logger.d.ts - 完整保留注释
/**
 * 日志级别
 */
export declare enum LogLevel {
  /** 调试信息 */
  Debug = 0,
  /** 一般信息 */
  Info = 1,
  /** 警告信息 */
  Warn = 2,
  /** 错误信息 */
  Error = 3,
}

/**
 * 日志记录器
 * @example
 * ```typescript
 * const logger = new Logger(LogLevel.Info);
 * logger.log('Hello');
 * ```
 */
export declare class Logger {
  /**
   * 创建日志记录器
   * @param level - 最小日志级别
   */
  constructor(level: LogLevel)

  /**
   * 记录日志
   * @param message - 日志消息
   * @param level - 日志级别
   */
  log(message: string, level?: LogLevel): void
}
````

### 5.5. 私有成员处理

```typescript
// src/service.ts
export class UserService {
  // public 成员会出现在声明文件中
  public version = '1.0.0'

  // private 成员在声明文件中只显示类型，不显示实现
  private apiKey: string

  // protected 成员类似 private
  protected cache: Map<string, any>

  constructor(apiKey: string) {
    this.apiKey = apiKey
    this.cache = new Map()
  }

  // 私有方法
  private fetchFromApi(): Promise<any> {
    return Promise.resolve()
  }

  // 公开方法
  public async getUser(id: string): Promise<any> {
    return this.fetchFromApi()
  }
}

// 生成的 service.d.ts
export declare class UserService {
  version: string
  private apiKey
  protected cache

  constructor(apiKey: string)

  private fetchFromApi

  getUser(id: string): Promise<any>
}
```

## 6. 🤔 常见问题如何解决？

常见问题和解决方案。

### 6.1. 问题 1：私有字段报错

```typescript
// ❌ 使用 # 私有字段会导致声明文件生成失败
export class User {
  #password: string // ❌ 错误

  constructor(password: string) {
    this.#password = password
  }
}

// ✅ 解决方案：使用 private 关键字
export class User {
  private password: string // ✅ 正确

  constructor(password: string) {
    this.password = password
  }
}
```

### 6.2. 问题 2：类型引用丢失

```typescript
// ❌ 问题：内部类型不会被导出
// src/api.ts
interface ApiOptions {
  // 没有导出
  timeout: number
}

export function request(options: ApiOptions): Promise<any> {
  return Promise.resolve()
}

// 生成的 api.d.ts - ApiOptions 未定义
export declare function request(options: ApiOptions): Promise<any>
// ❌ 错误：找不到 ApiOptions

// ✅ 解决方案 1：导出类型
export interface ApiOptions {
  timeout: number
}

export function request(options: ApiOptions): Promise<any> {
  return Promise.resolve()
}

// ✅ 解决方案 2：内联类型
export function request(options: { timeout: number }): Promise<any> {
  return Promise.resolve()
}
```

### 6.3. 问题 3：循环引用

```typescript
// ❌ 问题：循环引用
// src/user.ts
import { Post } from './post'

export interface User {
  id: string
  posts: Post[]
}

// src/post.ts
import { User } from './user'

export interface Post {
  id: string
  author: User
}

// ✅ 解决方案：使用类型导入
// src/user.ts
import type { Post } from './post'

export interface User {
  id: string
  posts: Post[]
}

// src/post.ts
import type { User } from './user'

export interface Post {
  id: string
  author: User
}
```

### 6.4. 问题 4：路径别名

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"]
    }
  }
}

// src/index.ts
import { User } from '@/models/user';  // 使用路径别名

// ❌ 生成的声明文件中路径别名不会被解析
// dist/index.d.ts
import { User } from '@/models/user';  // ❌ 路径无效

// ✅ 解决方案：使用 tsc-alias 或相对路径
npm install -D tsc-alias

// package.json
{
  "scripts": {
    "build": "tsc && tsc-alias"
  }
}

// 或者直接使用相对路径
import { User } from './models/user';
```

### 6.5. 问题 5：声明文件位置错误

```json
// ❌ 问题：package.json 中的 types 字段指向错误
{
  "name": "my-library",
  "main": "./dist/index.js",
  "types": "./src/index.ts"  // ❌ 应该指向 .d.ts 文件
}

// ✅ 解决方案
{
  "name": "my-library",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts"  // ✅ 指向生成的声明文件
}
```

### 6.6. 问题 6：重复声明

```typescript
// ❌ 问题：同时存在手动编写和自动生成的声明文件
// src/
//   index.ts
//   index.d.ts  // ❌ 手动编写的声明文件
// dist/
//   index.js
//   index.d.ts  // 自动生成的声明文件

// ✅ 解决方案：删除手动编写的声明文件，只保留自动生成的
// 或者禁用自动生成
{
  "compilerOptions": {
    "declaration": false
  }
}
```

### 6.7. 实用工具脚本

```json
// package.json
{
  "scripts": {
    // 清理旧文件后重新构建
    "clean": "rm -rf dist types",
    "prebuild": "npm run clean",
    "build": "tsc",

    // 验证声明文件
    "validate:types": "tsc --noEmit --declaration false",

    // 只生成声明文件（用于调试）
    "build:types": "tsc --emitDeclarationOnly",

    // 监听模式
    "dev": "tsc --watch",

    // 发布前检查
    "prepublishOnly": "npm run validate:types && npm run build"
  }
}
```

## 7. 🔗 引用

- [TypeScript Compiler Options - declaration][1]
- [Publishing Declaration Files][2]
- [Project References][3]
- [Declaration Files - Library Structures][4]

[1]: https://www.typescriptlang.org/tsconfig#declaration
[2]: https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html
[3]: https://www.typescriptlang.org/docs/handbook/project-references.html
[4]: https://www.typescriptlang.org/docs/handbook/declaration-files/library-structures.html
