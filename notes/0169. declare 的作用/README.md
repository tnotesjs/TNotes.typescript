# [0169. declare 的作用](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0169.%20declare%20%E7%9A%84%E4%BD%9C%E7%94%A8)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是 declare 关键字？](#3--什么是-declare-关键字)
  - [3.1. 环境声明](#31-环境声明)
- [4. 🤔 declare 的主要作用是什么？](#4--declare-的主要作用是什么)
  - [4.1. 为全局变量提供类型](#41-为全局变量提供类型)
  - [4.2. 为第三方库提供类型](#42-为第三方库提供类型)
  - [4.3. 为已有的 JavaScript 文件提供类型](#43-为已有的-javascript-文件提供类型)
  - [4.4. 扩展全局作用域](#44-扩展全局作用域)
- [5. 🤔 declare 与普通声明有什么区别？](#5--declare-与普通声明有什么区别)
  - [5.1. 实现 vs 声明](#51-实现-vs-声明)
  - [5.2. 使用场景对比](#52-使用场景对比)
- [6. 🤔 什么时候需要使用 declare？](#6--什么时候需要使用-declare)
  - [6.1. 使用全局库](#61-使用全局库)
  - [6.2. 使用 UMD 模块](#62-使用-umd-模块)
  - [6.3. 为 JavaScript 项目提供类型](#63-为-javascript-项目提供类型)
  - [6.4. 声明模块路径](#64-声明模块路径)
  - [6.5. 扩展现有类型](#65-扩展现有类型)
  - [6.6. 声明命名空间](#66-声明命名空间)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- declare 关键字的基本概念
- declare 的主要作用和用途
- declare 与普通声明的区别
- declare 的使用场景
- 环境声明的概念

## 2. 🫧 评价

declare 关键字用于告诉 TypeScript 某个变量、函数、类等已经在其他地方定义，提供类型信息而不生成实际代码。

- declare 只进行类型声明，不会编译生成任何 JavaScript 代码
- 主要用于为已存在的 JavaScript 代码提供类型信息
- 是连接 TypeScript 和 JavaScript 生态的桥梁
- 通常在 `.d.ts` 类型声明文件中使用
- 理解 declare 是使用第三方库和编写类型声明的基础

## 3. 🤔 什么是 declare 关键字？

declare 关键字用于声明已经存在但 TypeScript 不知道的变量、函数、类等的类型。

```typescript
// declare 告诉 TypeScript：jQuery 已经存在
// 但不会生成任何 JavaScript 代码
declare var jQuery: (selector: string) => any

// 现在可以使用 jQuery
jQuery('#app').hide()

// 编译后的 JavaScript：
// jQuery('#app').hide();
// declare 声明被完全移除
```

### 3.1. 环境声明

declare 声明也称为环境声明（Ambient Declarations），表示声明的内容来自外部环境。

```typescript
// 声明全局变量（来自浏览器环境）
declare var window: Window
declare var document: Document

// 声明全局函数（来自某个 CDN 引入的库）
declare function gtag(command: string, ...args: any[]): void

// 声明模块（来自 npm 包）
declare module 'lodash' {
  export function chunk<T>(array: T[], size: number): T[][]
}
```

## 4. 🤔 declare 的主要作用是什么？

declare 主要用于为 JavaScript 代码提供类型信息。

### 4.1. 为全局变量提供类型

```typescript
// 假设页面通过 script 标签引入了 jQuery
// <script src="jquery.js"></script>

// 不使用 declare 会报错
jQuery('#app') // 错误：找不到名称 'jQuery'

// 使用 declare 声明后可以正常使用
declare var jQuery: any
jQuery('#app') // 正确
```

### 4.2. 为第三方库提供类型

```typescript
// 假设使用了没有类型声明的 npm 包
// npm install some-js-library

// 为其提供类型声明
declare module 'some-js-library' {
  export function doSomething(value: string): void
  export class MyClass {
    constructor(name: string)
    getName(): string
  }
}

// 现在可以安全使用
import { doSomething, MyClass } from 'some-js-library'
doSomething('hello')
const instance = new MyClass('test')
```

### 4.3. 为已有的 JavaScript 文件提供类型

```typescript
// utils.js（已存在的 JavaScript 文件）
function formatDate(date) {
  return date.toISOString()
}

// utils.d.ts（类型声明文件）
declare function formatDate(date: Date): string

// main.ts（TypeScript 文件）
formatDate(new Date()) // 正确
formatDate('2024-01-01') // 错误：类型不匹配
```

### 4.4. 扩展全局作用域

```typescript
// 扩展 Window 接口
declare global {
  interface Window {
    myCustomMethod(): void
    myConfig: {
      apiUrl: string
      timeout: number
    }
  }
}

// 现在可以使用自定义属性
window.myCustomMethod()
console.log(window.myConfig.apiUrl)
```

## 5. 🤔 declare 与普通声明有什么区别？

declare 声明与普通声明在编译行为上完全不同。

::: code-group

```typescript [普通声明]
// 普通声明会生成 JavaScript 代码
const API_URL = 'https://api.example.com'
function greet(name: string): string {
  return `Hello, ${name}`
}
class User {
  constructor(public name: string) {}
}

// 编译后的 JavaScript：
// const API_URL = 'https://api.example.com';
// function greet(name) {
//   return `Hello, ${name}`;
// }
// class User {
//   constructor(name) {
//     this.name = name;
//   }
// }
```

```typescript [declare 声明]
// declare 声明不会生成 JavaScript 代码
declare const API_URL: string
declare function greet(name: string): string
declare class User {
  constructor(name: string)
  name: string
}

// 编译后的 JavaScript：
// （空文件，没有任何输出）
// declare 声明被完全移除
```

:::

### 5.1. 实现 vs 声明

```typescript
// 实现：包含实际代码
function add(a: number, b: number): number {
  return a + b // 有函数体
}

// 声明：只有类型信息
declare function add(a: number, b: number): number // 没有函数体
```

### 5.2. 使用场景对比

```typescript
// 场景1：编写新代码（使用普通声明）
// math.ts
export function multiply(a: number, b: number): number {
  return a * b
}

// 场景2：使用已有的 JavaScript 代码（使用 declare）
// math.js（已存在）
// function multiply(a, b) { return a * b; }

// math.d.ts（类型声明）
declare function multiply(a: number, b: number): number
```

## 6. 🤔 什么时候需要使用 declare？

在以下场景中需要使用 declare。

### 6.1. 使用全局库

```typescript
// 通过 CDN 引入的库
// <script src="https://cdn.example.com/library.js"></script>

declare namespace MyLibrary {
  function init(config: object): void
  function getData(): any[]
}

MyLibrary.init({ apiKey: 'xxx' })
const data = MyLibrary.getData()
```

### 6.2. 使用 UMD 模块

```typescript
// UMD 模块既可以作为模块使用，也可以作为全局变量使用
declare module 'jquery' {
  export = jQuery
}

declare const jQuery: JQueryStatic

interface JQueryStatic {
  (selector: string): JQuery
}

interface JQuery {
  hide(): JQuery
  show(): JQuery
}

// 作为模块使用
import $ from 'jquery'
$('#app').hide()

// 作为全局变量使用
jQuery('#app').show()
```

### 6.3. 为 JavaScript 项目提供类型

```typescript
// 逐步迁移 JavaScript 项目到 TypeScript
// legacy.js（保持为 JavaScript）
function processData(data) {
  return data.map((item) => item.value)
}

// legacy.d.ts（添加类型声明）
interface DataItem {
  value: number
  label: string
}

declare function processData(data: DataItem[]): number[]

// app.ts（新的 TypeScript 代码）
const result = processData([
  { value: 1, label: 'a' },
  { value: 2, label: 'b' },
])
```

### 6.4. 声明模块路径

```typescript
// 为非 TypeScript 模块提供类型
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.png' {
  const value: string
  export default value
}

declare module '*.json' {
  const value: any
  export default value
}

// 现在可以导入这些文件
import styles from './App.module.css'
import logo from './logo.png'
import config from './config.json'
```

### 6.5. 扩展现有类型

```typescript
// 为第三方库添加自定义方法
import 'express'

declare module 'express' {
  interface Request {
    user?: {
      id: string
      name: string
    }
  }
}

// 现在可以使用扩展的属性
import express from 'express'
const app = express()

app.use((req, res, next) => {
  console.log(req.user?.name) // 正确
  next()
})
```

### 6.6. 声明命名空间

```typescript
// 为全局对象添加类型
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    API_URL: string
    PORT: string
  }
}

// 现在环境变量有类型提示
console.log(process.env.NODE_ENV)
console.log(process.env.API_URL)
```

## 7. 🔗 引用

- [TypeScript Handbook - Declaration Files][1]
- [TypeScript Deep Dive - Declaration Spaces][2]
- [Ambient Declarations][3]
- [DefinitelyTyped Repository][4]

[1]: https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html
[2]: https://basarat.gitbook.io/typescript/project/declarationspaces
[3]: https://www.typescriptlang.org/docs/handbook/namespaces.html#ambient-namespaces
[4]: https://github.com/DefinitelyTyped/DefinitelyTyped
