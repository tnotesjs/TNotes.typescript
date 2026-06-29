# [0237. strictNullChecks](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0237.%20strictNullChecks)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. strictNullChecks 是什么？](#3-strictnullchecks-是什么)
  - [3.1. 基本配置](#31-基本配置)
  - [3.2. 关闭时的行为](#32-关闭时的行为)
  - [3.3. 开启后的行为](#33-开启后的行为)
- [4. 开启后有什么影响？](#4-开启后有什么影响)
  - [4.1. 变量声明](#41-变量声明)
  - [4.2. 函数参数](#42-函数参数)
  - [4.3. 对象属性](#43-对象属性)
  - [4.4. 数组和索引访问](#44-数组和索引访问)
  - [4.5. 函数返回值](#45-函数返回值)
- [5. 如何处理 null 和 undefined？](#5-如何处理-null-和-undefined)
  - [5.1. 类型守卫](#51-类型守卫)
  - [5.2. 可选链](#52-可选链)
  - [5.3. 空值合并运算符](#53-空值合并运算符)
  - [5.4. 非空断言](#54-非空断言)
  - [5.5. 类型保护函数](#55-类型保护函数)
  - [5.6. 可选参数和属性](#56-可选参数和属性)
  - [5.7. 默认参数](#57-默认参数)
- [6. 使用时需要注意什么？](#6-使用时需要注意什么)
  - [6.1. null vs. undefined 的选择](#61-null-vs-undefined-的选择)
  - [6.2. DOM 操作](#62-dom-操作)
  - [6.3. 数组方法](#63-数组方法)
  - [6.4. JSON 解析](#64-json-解析)
  - [6.5. Map 和 Set](#65-map-和-set)
  - [6.6. 第三方库](#66-第三方库)
  - [6.7. 与其他 strict 选项配合](#67-与其他-strict-选项配合)
- [7. 引用](#7-引用)

<!-- endregion:toc -->

## 1. 本节内容

- strictNullChecks 选项的作用
- null 和 undefined 的类型处理
- 可选属性和参数
- 空值检查的最佳实践
- 与其他选项的配合
- 常见问题和解决方案

## 2. 评价

`strictNullChecks` 是 `strict` 模式中最重要的选项之一，能够有效防止空值错误，这是 JavaScript 中最常见的运行时错误来源。

- 防止 `null` 和 `undefined` 引起的运行时错误
- Tony Hoare 称空引用是"十亿美元的错误"
- 开启后需要显式处理所有可能的空值
- 提升代码的健壮性和可维护性
- 新项目强烈建议开启
- 老项目迁移可能需要较多工作

## 3. strictNullChecks 是什么？

`strictNullChecks` 控制 `null` 和 `undefined` 是否可以赋值给其他类型。

### 3.1. 基本配置

```json
{
  "compilerOptions": {
    "strictNullChecks": true
  }
}
```

### 3.2. 关闭时的行为

```ts
// strictNullChecks: false（默认）
let name: string = null // ✅ 允许
let age: number = undefined // ✅ 允许

function greet(name: string) {
  console.log(name.toUpperCase())
}

greet(null) // ✅ 编译通过，但运行时错误
```

### 3.3. 开启后的行为

```ts
// strictNullChecks: true
let name: string = null // ❌ 错误：不能将 null 赋值给 string
let age: number = undefined // ❌ 错误：不能将 undefined 赋值给 number

// ✅ 正确：使用联合类型
let name: string | null = null
let age: number | undefined = undefined

function greet(name: string) {
  console.log(name.toUpperCase())
}

greet(null) // ❌ 错误：类型 null 的参数不能赋给类型 string 的参数
```

## 4. 开启后有什么影响？

### 4.1. 变量声明

```ts
// ❌ 不能将 null/undefined 赋值给非空类型
let str: string = null
let num: number = undefined

// ✅ 使用联合类型
let str: string | null = null
let num: number | undefined = undefined

// ✅ 或使用初始值
let str: string = ''
let num: number = 0
```

### 4.2. 函数参数

```ts
// ❌ 不能传递 null
function process(data: string) {
  return data.length
}
process(null) // 错误

// ✅ 允许 null
function process(data: string | null) {
  if (data === null) {
    return 0
  }
  return data.length
}
process(null) // 正确
```

### 4.3. 对象属性

```ts
interface User {
  name: string
  email: string | null // 可以为 null
  phone?: string // 可选属性，类型为 string | undefined
}

const user: User = {
  name: 'Alice',
  email: null, // ✅ 允许
  // phone 可以省略
}

// ❌ 直接访问可能为 undefined 的属性
console.log(user.phone.length)

// ✅ 使用可选链
console.log(user.phone?.length)

// ✅ 使用类型守卫
if (user.phone !== undefined) {
  console.log(user.phone.length)
}
```

### 4.4. 数组和索引访问

```ts
const arr: string[] = ['a', 'b', 'c']

// ❌ 索引访问可能返回 undefined
const item: string = arr[10]

// ✅ 使用联合类型
const item: string | undefined = arr[10]

// ✅ 或使用可选链和空值合并
const item = arr[10] ?? 'default'
```

### 4.5. 函数返回值

```ts
// ❌ 可能返回 undefined
function find(arr: string[], target: string): string {
  return arr.find((item) => item === target) // 错误：可能返回 undefined
}

// ✅ 明确返回类型
function find(arr: string[], target: string): string | undefined {
  return arr.find((item) => item === target)
}

// ✅ 提供默认值
function find(arr: string[], target: string): string {
  return arr.find((item) => item === target) ?? ''
}
```

## 5. 如何处理 null 和 undefined？

### 5.1. 类型守卫

```ts
function process(value: string | null) {
  // ❌ 直接使用
  console.log(value.length) // 错误

  // ✅ 使用 if 检查
  if (value !== null) {
    console.log(value.length) // value 类型收窄为 string
  }

  // ✅ 使用提前返回
  if (value === null) {
    return
  }
  console.log(value.length) // value 类型收窄为 string
}
```

### 5.2. 可选链

```ts
interface Config {
  server?: {
    port?: number
  }
}

const config: Config = {}

// ❌ 多层检查很繁琐
if (config.server && config.server.port) {
  console.log(config.server.port)
}

// ✅ 使用可选链
console.log(config.server?.port) // undefined

// ✅ 结合空值合并
const port = config.server?.port ?? 3000
```

### 5.3. 空值合并运算符

```ts
const name: string | null = null

// ❌ 使用 || 可能有问题
const result1 = name || 'default' // ⚠️ 空字符串也会被替换

// ✅ 使用 ?? 只处理 null 和 undefined
const result2 = name ?? 'default'

const count: number | null = 0
const value1 = count || 10 // 10（错误：0 被当作 false）
const value2 = count ?? 10 // 0（正确）
```

### 5.4. 非空断言

```ts
// ⚠️ 确定不为 null 时使用
function getElementById(id: string): HTMLElement | null {
  return document.getElementById(id)
}

const element = getElementById('app')! // 使用 ! 断言非空
element.innerHTML = 'Hello' // 不需要检查
```

### 5.5. 类型保护函数

```ts
function isNotNull<T>(value: T | null): value is T {
  return value !== null
}

const values: (string | null)[] = ['a', null, 'b']
const strings: string[] = values.filter(isNotNull) // 类型为 string[]
```

### 5.6. 可选参数和属性

```ts
// 可选参数
function greet(name?: string) {
  // name 类型为 string | undefined
  console.log(name ?? 'Guest')
}

// 可选属性
interface User {
  name: string
  age?: number // number | undefined
}

const user: User = { name: 'Alice' }
console.log(user.age ?? 0)
```

### 5.7. 默认参数

```ts
// 默认参数会移除 undefined
function greet(name: string = 'Guest') {
  // name 类型为 string
  console.log(name.toUpperCase()) // 安全
}

greet() // "GUEST"
greet(undefined) // "GUEST"
greet('Alice') // "ALICE"
```

## 6. 使用时需要注意什么？

### 6.1. null vs. undefined 的选择

```ts
// ✅ 推荐：使用 undefined 表示缺失值
interface User {
  name: string
  email?: string // undefined
  phone?: string // undefined
}

// ⚠️ 避免混用
interface User {
  name: string
  email: string | null // null
  phone?: string // undefined
}
```

### 6.2. DOM 操作

```ts
// ❌ 直接使用可能为 null 的元素
const element = document.getElementById('app')
element.innerHTML = 'Hello' // 错误

// ✅ 检查后使用
const element = document.getElementById('app')
if (element !== null) {
  element.innerHTML = 'Hello'
}

// ✅ 使用可选链
document.getElementById('app')?.classList.add('active')

// ✅ 使用非空断言（确定存在时）
const element = document.getElementById('app')!
element.innerHTML = 'Hello'
```

### 6.3. 数组方法

```ts
const arr = [1, 2, 3]

// ❌ find/findIndex 可能返回 undefined/-1
const item: number = arr.find((x) => x > 5) // 错误

// ✅ 处理可能的 undefined
const item = arr.find((x) => x > 5)
if (item !== undefined) {
  console.log(item)
}

// ✅ 提供默认值
const item = arr.find((x) => x > 5) ?? 0
```

### 6.4. JSON 解析

```ts
// ❌ JSON.parse 返回 any
const data = JSON.parse(jsonString)

// ✅ 添加类型断言
const data: UserData | null = JSON.parse(jsonString)

// ✅ 使用类型守卫
function isUserData(data: any): data is UserData {
  return data && typeof data.name === 'string'
}

const parsed = JSON.parse(jsonString)
if (isUserData(parsed)) {
  console.log(parsed.name)
}
```

### 6.5. Map 和 Set

```ts
const map = new Map<string, number>()

// ❌ get 返回 T | undefined
const value: number = map.get('key') // 错误

// ✅ 处理 undefined
const value = map.get('key')
if (value !== undefined) {
  console.log(value)
}

// ✅ 使用空值合并
const value = map.get('key') ?? 0
```

### 6.6. 第三方库

```ts
// 某些库的类型定义可能不准确
import axios from 'axios'

// ⚠️ 响应数据可能为 null
const response = await axios.get('/api/user')
const user: User = response.data // 可能不安全

// ✅ 添加检查
const user: User | null = response.data
if (user !== null) {
  console.log(user.name)
}
```

### 6.7. 与其他 strict 选项配合

```json
{
  "compilerOptions": {
    "strictNullChecks": true,
    "strictFunctionTypes": true, // 函数参数的 null 检查
    "strictPropertyInitialization": true // 属性初始化检查
  }
}
```

```ts
class User {
  // strictPropertyInitialization 要求初始化
  name: string // ❌ 错误

  // ✅ 解决方案
  name: string = ''
  // 或
  name!: string // 确定赋值断言
  // 或
  name: string | undefined
}
```

## 7. 引用

- [TypeScript strictNullChecks][1]
- [TypeScript Null and Undefined][2]
- [Optional Chaining and Nullish Coalescing][3]

[1]: https://www.typescriptlang.org/tsconfig#strictNullChecks
[2]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#null-and-undefined
[3]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html
