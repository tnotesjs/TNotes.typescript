# [0236. strict 模式](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0236.%20strict%20%E6%A8%A1%E5%BC%8F)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 strict 模式是什么？](#3--strict-模式是什么)
  - [3.1. 基本配置](#31-基本配置)
  - [3.2. strict 的作用](#32-strict-的作用)
- [4. 🤔 strict 包含哪些子选项？](#4--strict-包含哪些子选项)
  - [4.1. 完整列表](#41-完整列表)
  - [4.2. noImplicitAny](#42-noimplicitany)
  - [4.3. strictNullChecks](#43-strictnullchecks)
  - [4.4. strictFunctionTypes](#44-strictfunctiontypes)
  - [4.5. strictBindCallApply](#45-strictbindcallapply)
  - [4.6. strictPropertyInitialization](#46-strictpropertyinitialization)
  - [4.7. noImplicitThis](#47-noimplicitthis)
  - [4.8. alwaysStrict](#48-alwaysstrict)
  - [4.9. useUnknownInCatchVariables](#49-useunknownincatchvariables)
- [5. 🤔 是否应该开启 strict？](#5--是否应该开启-strict)
  - [5.1. 新项目：强烈推荐开启](#51-新项目强烈推荐开启)
  - [5.2. 老项目：渐进式启用](#52-老项目渐进式启用)
  - [5.3. 对比](#53-对比)
- [6. 🤔 如何渐进式启用 strict？](#6--如何渐进式启用-strict)
  - [6.1. 阶段 1：开启 noImplicitAny](#61-阶段-1开启-noimplicitany)
  - [6.2. 阶段 2：开启 strictNullChecks](#62-阶段-2开启-strictnullchecks)
  - [6.3. 阶段 3：开启其他选项](#63-阶段-3开启其他选项)
  - [6.4. 阶段 4：完全开启 strict](#64-阶段-4完全开启-strict)
  - [6.5. 迁移策略](#65-迁移策略)
- [7. 🤔 使用 strict 时需要注意什么？](#7--使用-strict-时需要注意什么)
  - [7.1. 显式类型注解](#71-显式类型注解)
  - [7.2. 处理 null 和 undefined](#72-处理-null-和-undefined)
  - [7.3. 函数参数类型](#73-函数参数类型)
  - [7.4. 类属性初始化](#74-类属性初始化)
  - [7.5. catch 错误处理](#75-catch-错误处理)
  - [7.6. 第三方库类型](#76-第三方库类型)
  - [7.7. 使用类型断言（谨慎）](#77-使用类型断言谨慎)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- strict 选项的作用
- strict 包含的子选项
- 每个子选项的具体影响
- 开启 strict 的利弊
- 渐进式启用策略
- 新旧项目的不同处理方式

## 2. 🫧 评价

`strict` 是 TypeScript 中最重要的配置选项之一，启用后可以获得最严格的类型检查，显著提升代码质量和安全性。

- 强烈建议所有新项目开启 strict
- strict 是一个主开关，包含多个子选项
- 开启后会捕获更多潜在的运行时错误
- 可能需要修改大量现有代码
- 对代码质量的提升是巨大的
- 老项目可以渐进式启用

## 3. 🤔 strict 模式是什么？

`strict` 是一个总开关，启用所有严格类型检查选项。

### 3.1. 基本配置

```json
{
  "compilerOptions": {
    "strict": true // 启用所有严格检查
  }
}
```

### 3.2. strict 的作用

```ts
// strict: false（默认行为）
function greet(name) {
  // ✅ 允许，name 类型为 any
  return 'Hello ' + name.toUpperCase()
}

const result = greet(null) // ⚠️ 运行时错误

// strict: true
function greet(name) {
  // ❌ 错误：参数隐式具有 any 类型
  return 'Hello ' + name.toUpperCase()
}

function greet(name: string) {
  // ✅ 必须指定类型
  return 'Hello ' + name.toUpperCase()
}
```

## 4. 🤔 strict 包含哪些子选项？

`strict: true` 等同于开启以下所有选项。

### 4.1. 完整列表

```json
{
  "compilerOptions": {
    "strict": true,

    // 等同于：
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "useUnknownInCatchVariables": true
  }
}
```

### 4.2. noImplicitAny

禁止隐式 `any` 类型。

```ts
// noImplicitAny: false
function add(a, b) {
  // ✅ 允许，a 和 b 是 any
  return a + b
}

// noImplicitAny: true
function add(a, b) {
  // ❌ 错误：参数隐式具有 any 类型
  return a + b
}

function add(a: number, b: number) {
  // ✅ 必须指定类型
  return a + b
}
```

### 4.3. strictNullChecks

严格的 `null` 和 `undefined` 检查。

```ts
// strictNullChecks: false
const name: string = null // ✅ 允许
const age: number = undefined // ✅ 允许

function greet(name: string) {
  console.log(name.toUpperCase()) // ⚠️ 可能运行时错误
}
greet(null) // ✅ 允许

// strictNullChecks: true
const name: string = null // ❌ 错误
const name: string | null = null // ✅ 正确

function greet(name: string) {
  console.log(name.toUpperCase())
}
greet(null) // ❌ 错误：类型 null 不能赋值给类型 string
```

### 4.4. strictFunctionTypes

严格的函数类型检查。

```ts
// 函数参数的逆变检查
type Callback = (value: string | number) => void

// strictFunctionTypes: false
const cb: Callback = (value: string) => {
  // ✅ 允许（不安全）
  console.log(value.toUpperCase())
}

// strictFunctionTypes: true
const cb: Callback = (value: string) => {
  // ❌ 错误
  console.log(value.toUpperCase())
}

const cb: Callback = (value: string | number) => {
  // ✅ 正确
  if (typeof value === 'string') {
    console.log(value.toUpperCase())
  }
}
```

### 4.5. strictBindCallApply

严格检查 `bind`、`call`、`apply`。

```ts
function greet(name: string, age: number) {
  console.log(`${name} is ${age} years old`)
}

// strictBindCallApply: false
greet.call(null, 'Alice') // ✅ 允许（缺少参数）

// strictBindCallApply: true
greet.call(null, 'Alice') // ❌ 错误：缺少参数 age
greet.call(null, 'Alice', 30) // ✅ 正确
greet.apply(null, ['Alice', 30]) // ✅ 正确
const bound = greet.bind(null, 'Alice')
bound(30) // ✅ 正确
```

### 4.6. strictPropertyInitialization

严格检查类属性初始化。

```ts
// strictPropertyInitialization: false
class User {
  name: string // ✅ 允许（未初始化）
  age: number // ✅ 允许（未初始化）
}

// strictPropertyInitialization: true
class User {
  name: string // ❌ 错误：属性未初始化
  age: number // ❌ 错误：属性未初始化
}

// 解决方案1：构造函数初始化
class User {
  name: string
  age: number

  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
}

// 解决方案2：声明时初始化
class User {
  name: string = ''
  age: number = 0
}

// 解决方案3：确定赋值断言
class User {
  name!: string // 断言会被赋值
  age!: number

  initialize() {
    this.name = 'Alice'
    this.age = 30
  }
}
```

### 4.7. noImplicitThis

禁止 `this` 的隐式 `any` 类型。

```ts
// noImplicitThis: false
const obj = {
  name: 'Alice',
  greet() {
    console.log(this.name) // ✅ 允许
  },
}

// noImplicitThis: true
const obj = {
  name: 'Alice',
  greet() {
    console.log(this.name) // ❌ 错误：this 隐式具有 any 类型
  },
}

// 解决方案：指定 this 类型
interface Obj {
  name: string
  greet(this: Obj): void
}

const obj: Obj = {
  name: 'Alice',
  greet() {
    console.log(this.name) // ✅ 正确
  },
}
```

### 4.8. alwaysStrict

始终以严格模式解析并输出 `"use strict"`。

```ts
// alwaysStrict: false
// 输出文件不包含 "use strict"

// alwaysStrict: true
// 输出文件包含 "use strict"
'use strict'
// 编译后的代码
```

### 4.9. useUnknownInCatchVariables

`catch` 变量使用 `unknown` 而非 `any`。

```ts
// useUnknownInCatchVariables: false
try {
  throw new Error('error')
} catch (error) {
  // error 类型为 any
  console.log(error.message) // ✅ 允许
}

// useUnknownInCatchVariables: true
try {
  throw new Error('error')
} catch (error) {
  // error 类型为 unknown
  console.log(error.message) // ❌ 错误

  if (error instanceof Error) {
    console.log(error.message) // ✅ 正确
  }
}
```

## 5. 🤔 是否应该开启 strict？

### 5.1. 新项目：强烈推荐开启

```json
{
  "compilerOptions": {
    "strict": true, // ✅ 新项目直接开启
    "target": "ES2020",
    "module": "esnext"
  }
}
```

优势：

- 从一开始就有最佳类型安全
- 避免累积技术债务
- 捕获更多潜在错误
- 提升代码质量和可维护性

### 5.2. 老项目：渐进式启用

```json
{
  "compilerOptions": {
    "strict": false, // 暂时关闭

    // 逐步开启各个选项
    "noImplicitAny": true,
    "strictNullChecks": false
    // ...
  }
}
```

挑战：

- 可能需要修改大量代码
- 需要时间和资源
- 可能影响开发进度

建议：

- 采用渐进式策略
- 按模块逐步迁移
- 配合代码审查

### 5.3. 对比

| 场景     | strict: true          | strict: false |
| -------- | --------------------- | ------------- |
| 新项目   | ⭐⭐⭐⭐⭐ 强烈推荐   | ❌ 不推荐     |
| 老项目   | ⭐⭐⭐ 推荐（渐进式） | ⭐⭐ 可接受   |
| 学习阶段 | ⭐⭐⭐⭐ 推荐         | ⭐⭐⭐ 可选   |
| 快速原型 | ⭐⭐ 可选             | ⭐⭐⭐⭐ 方便 |
| 生产项目 | ⭐⭐⭐⭐⭐ 必须       | ❌ 不推荐     |

## 6. 🤔 如何渐进式启用 strict？

### 6.1. 阶段 1：开启 noImplicitAny

```json
{
  "compilerOptions": {
    "strict": false,
    "noImplicitAny": true // ✅ 第一步
  }
}
```

```ts
// 修复所有隐式 any
function process(data) {
  // ❌ 需要修复
  return data
}

function process(data: any) {
  // ✅ 临时方案
  return data
}

function process(data: unknown) {
  // ✅ 更好的方案
  return data
}
```

### 6.2. 阶段 2：开启 strictNullChecks

```json
{
  "compilerOptions": {
    "noImplicitAny": true,
    "strictNullChecks": true // ✅ 第二步
  }
}
```

```ts
// 修复所有 null/undefined 问题
function getName(user: User): string {
  return user.name // ❌ 如果 name 可能为 null
}

function getName(user: User): string {
  return user.name ?? 'Unknown' // ✅ 处理 null
}

function getName(user: User): string | null {
  return user.name // ✅ 允许返回 null
}
```

### 6.3. 阶段 3：开启其他选项

```json
{
  "compilerOptions": {
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true, // ✅ 第三步
    "strictBindCallApply": true // ✅ 第四步
  }
}
```

### 6.4. 阶段 4：完全开启 strict

```json
{
  "compilerOptions": {
    "strict": true // ✅ 最终目标
  }
}
```

### 6.5. 迁移策略

```json
// 为新代码使用 strict
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "strict": true
  },
  "include": ["src/new-feature/**/*"]
}

// 老代码保持宽松
{
  "compilerOptions": {
    "strict": false
  },
  "include": ["src/legacy/**/*"]
}
```

## 7. 🤔 使用 strict 时需要注意什么？

### 7.1. 显式类型注解

```ts
// ❌ 依赖类型推断可能不够
const data = JSON.parse(response) // any 类型

// ✅ 添加类型注解
const data: UserData = JSON.parse(response)

// ✅ 或使用类型断言
const data = JSON.parse(response) as UserData
```

### 7.2. 处理 null 和 undefined

```ts
// ❌ 直接访问可能为 null 的属性
const name = user.profile.name

// ✅ 使用可选链
const name = user.profile?.name

// ✅ 使用空值合并
const name = user.profile?.name ?? 'Unknown'

// ✅ 使用类型守卫
if (user.profile) {
  const name = user.profile.name
}
```

### 7.3. 函数参数类型

```ts
// ❌ 缺少类型
function handleEvent(event) {
  console.log(event.target)
}

// ✅ 明确类型
function handleEvent(event: MouseEvent) {
  console.log(event.target)
}

// ✅ 使用联合类型
function handleEvent(event: MouseEvent | KeyboardEvent) {
  console.log(event.target)
}
```

### 7.4. 类属性初始化

```ts
// ❌ 未初始化
class Component {
  element: HTMLElement
}

// ✅ 构造函数初始化
class Component {
  element: HTMLElement

  constructor(selector: string) {
    this.element = document.querySelector(selector)!
  }
}

// ✅ 使用确定赋值断言
class Component {
  element!: HTMLElement

  mount(selector: string) {
    this.element = document.querySelector(selector)!
  }
}
```

### 7.5. catch 错误处理

```ts
// ❌ 假设 error 是 Error 类型
try {
  throw new Error('error')
} catch (error) {
  console.log(error.message) // 错误
}

// ✅ 使用类型守卫
try {
  throw new Error('error')
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message)
  } else {
    console.log(String(error))
  }
}
```

### 7.6. 第三方库类型

```bash
# 安装类型声明
npm install --save-dev @types/lodash
npm install --save-dev @types/react
npm install --save-dev @types/node
```

```ts
// ✅ 有类型声明
import _ from 'lodash'
import React from 'react'

// ⚠️ 没有类型声明
import someLib from 'some-lib' // any 类型
```

### 7.7. 使用类型断言（谨慎）

```ts
// ⚠️ 类型断言绕过检查
const element = document.getElementById('app') as HTMLDivElement

// ✅ 使用非空断言（确定不为 null）
const element = document.getElementById('app')!

// ✅ 更安全的方式
const element = document.getElementById('app')
if (element) {
  // 使用 element
}
```

## 8. 🔗 引用

- [TypeScript strict 配置][1]
- [TypeScript Strict Mode][2]
- [Strict Compiler Options][3]

[1]: https://www.typescriptlang.org/tsconfig#strict
[2]: https://www.typescriptlang.org/docs/handbook/2/basic-types.html#strictness
[3]: https://www.typescriptlang.org/docs/handbook/compiler-options.html
