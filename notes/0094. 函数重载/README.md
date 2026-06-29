# [0094. 函数重载](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0094.%20%E5%87%BD%E6%95%B0%E9%87%8D%E8%BD%BD)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 什么是函数重载？](#3-什么是函数重载)
  - [3.1. 核心概念](#31-核心概念)
  - [3.2. 基本语法](#32-基本语法)
  - [3.3. 简单示例](#33-简单示例)
  - [3.4. 多个参数的重载](#34-多个参数的重载)
- [4. 重载签名、实现签名是什么？](#4-重载签名实现签名是什么)
  - [4.1. 重载签名（Overload Signatures）](#41-重载签名overload-signatures)
  - [4.2. 实现签名（Implementation Signature）](#42-实现签名implementation-signature)
  - [4.3. 实现签名必须兼容所有重载签名](#43-实现签名必须兼容所有重载签名)
- [5. 如何书写合法的重载签名？](#5-如何书写合法的重载签名)
  - [5.1. 允许的位置（合法书写点）](#51-允许的位置合法书写点)
  - [5.2. 不允许的位置（语法或语义不支持）](#52-不允许的位置语法或语义不支持)
- [6. 函数重载的匹配规则是？](#6-函数重载的匹配规则是)
  - [6.1. 基本流程与直观示例](#61-基本流程与直观示例)
  - [6.2. 更具体的重载优先（与声明顺序无关）](#62-更具体的重载优先与声明顺序无关)
  - [6.3. 声明顺序会影响的情况：无“唯一更具体者”](#63-声明顺序会影响的情况无唯一更具体者)
  - [6.4. 可选参数与参数个数](#64-可选参数与参数个数)
  - [6.5. 仅看参数，不看返回类型](#65-仅看参数不看返回类型)
  - [6.6. 小结](#66-小结)
- [7. 重载 vs 联合类型](#7-重载-vs-联合类型)
- [8. 关于函数重载都有哪些实践建议？](#8-关于函数重载都有哪些实践建议)
- [9. 引用](#9-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 函数重载的定义和语法
- 重载签名与实现签名
- 函数重载的匹配规则（细节较多）
- 函数重载与联合类型的对比
- 函数重载实践指南

## 2. 评价

函数重载（Function Overloading）允许为同一个函数定义多个类型签名，根据不同的参数类型或数量，返回不同的类型。

TypeScript 的函数重载是纯编译期特性：

- 在编译时提供多个类型签名
- 在运行时只有一个实现
- 通过重载签名提供更精确的类型推断

## 3. 什么是函数重载？

函数重载是为同一个函数提供多个类型定义，使其能接受不同类型或数量的参数，并返回相应的类型。

```ts
// 没有重载：返回类型不够精确
function getValue(key: string | number): string | number {
  // 实现
}

const result1 = getValue('name') // 类型：string | number
const result2 = getValue(42) // 类型：string | number

// ✅ 使用重载：精确的类型推断
function getValue(key: string): string
function getValue(key: number): number
function getValue(key: string | number): string | number {
  // 实现
}

const result1 = getValue('name') // 类型：string ✅
const result2 = getValue(42) // 类型：number ✅
```

### 3.1. 核心概念

- 重载签名：多个类型定义（没有实现）
- 实现签名：唯一的实现（有函数体）
- 调用签名匹配：从上到下匹配重载签名
- 类型收窄：根据参数类型返回精确类型

### 3.2. 基本语法

```ts
// 重载签名 1
function func(param: Type1): ReturnType1
// 重载签名 2
function func(param: Type2): ReturnType2
// 实现签名
function func(param: Type1 | Type2): ReturnType1 | ReturnType2 {
  // 实现
}
```

### 3.3. 简单示例

```ts
// ✅ 重载：根据参数类型返回不同类型
function double(value: number): number
function double(value: string): string
function double(value: number | string): number | string {
  if (typeof value === 'number') {
    return value * 2
  } else {
    return value + value
  }
}

const num = double(5) // 类型：number
const str = double('hello') // 类型：string
```

### 3.4. 多个参数的重载

```ts
// ✅ 重载：不同数量的参数
function add(a: number, b: number): number
function add(a: string, b: string): string
function add(a: number, b: number, c: number): number
function add(a: any, b: any, c?: any): any {
  if (c !== undefined) {
    return a + b + c
  }
  return a + b
}

const a = add(1, 2) // 类型：number
const b = add('hello', 'world') // 类型：string
const c = add(1, 2, 3) // 类型：number
```

## 4. 重载签名、实现签名是什么？

示例：

```ts
function add(a: number, b: number): number
function add(a: string, b: string): string
function add(a: number, b: number, c: number): number
function add(a: any, b: any, c?: any): any {
  if (c !== undefined) {
    return a + b + c
  }
  return a + b
}
```

### 4.1. 重载签名（Overload Signatures）

```ts
// 重载签名：只有类型，没有实现
function add(a: number, b: number): number
function add(a: string, b: string): string
function add(a: number, b: number, c: number): number

// 这些签名对外可见，用于类型检查
```

### 4.2. 实现签名（Implementation Signature）

```ts
// 实现签名：包含所有可能的类型
function add(a: any, b: any, c?: any): any {
  if (c !== undefined) {
    return a + b + c
  }
  return a + b
}
```

::: warning ⚠️ 注意 - 实现签名对外不可见

调用者只能看到重载签名，实现签名对于调用者而言是不可见的。

比如你在 IDE 中输入 `add(` 的时候，会自动弹出重载签名的面板。

![img](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-11-12-17-22-36.png)

:::

### 4.3. 实现签名必须兼容所有重载签名

```ts
// ❌ 实现签名必须兼容所有重载签名
function bad(x: string): string // 1 ✅ 兼容
function bad(x: number): number // 2 ❌ 不兼容
function bad(x: string): string {
  // ❌ Error: 实现签名不兼容 2
  return x
}

// ✅ 实现签名类型必须包含所有重载签名
function good(x: string): string
function good(x: number): number
function good(x: string | number): string | number {
  return typeof x === 'string' ? x : String(x)
}

// 💡 小技巧：
// 通常把实现签名写成 any 或 unknown，再在函数体内做类型守卫。
function add(a: number, b: number): number
function add(a: string, b: string): string
function add(a: number[], b: number[]): number[]
// ✅ Good
function add(a: unknown, b: unknown) {
  if (typeof a === 'number' && typeof b === 'number') return a + b
  if (typeof a === 'string' && typeof b === 'string') return a + b
  if (Array.isArray(a) && Array.isArray(b)) return a.concat(b)
  throw new Error('Invalid arguments')
}
// ⚠️ Bad
// function add(a: number | string | number[], b: number | string | number[]): number | string | number[] {
//   if (typeof a === 'number' && typeof b === 'number') return a + b
//   if (typeof a === 'string' && typeof b === 'string') return a + b
//   if (Array.isArray(a) && Array.isArray(b)) return a.concat(b)
//   throw new Error('Invalid arguments')
// }
```

## 5. 如何书写合法的重载签名？

函数重载（多个“同名 + 不同参数列表”的签名）只能出现在“类型层面允许多个同名成员”的特定语法位置；运行时代码里的对象字面量、箭头函数等不支持直接写多条重载签名。下面分允许与不允许两类详细说明，并补充常见替代写法与实践注意点。

### 5.1. 允许的位置（合法书写点）

重载签名只能出现在“声明式类型结构”里（function 声明、接口、类、类型对象字面量、ambient / 合并场景）。这些位置允许多个“无实现签名”并列。

1. 顶层或模块内部的 `function` 声明 - 典型方式：若干“重载签名”后跟一个“实现签名”
2. 接口 (interface) 中的方法重载 - 多个同名方法签名（无实现） + 在具体对象 / 类实现时提供单个实现
3. 接口中的“调用签名”与“构造签名”重载 - 用于描述可调用对象或可用 `new` 实例化的对象的不同参数形态
4. 类型别名里的对象类型（Type Literal）中出现多个调用签名 - 与接口类似，只是用 `type`
5. 类 (class) 中的方法重载 - 写多个签名（无函数体），最后一个实现体必须能兼容全部。包括 `constructor` 的重载
6. 声明文件 / ambient 上下文（`.d.ts`，`declare`）中所有上述位置
7. 模块增强 / 命名空间合并后追加重载 - 通过声明合并给已有函数添加新的重载签名（必须与已有实现兼容）
8. 接口声明合并 (Declaration Merging) 累积重载 - 多次声明同名接口，其方法签名会合并
9. 一组 `function` 声明与同名 `namespace` 合并 - 在 `namespace` 内再导出同名函数重载（少见，通常用于补充额外静态工具）

::: code-group

```ts [1]
// 顶层函数重载
function parse(x: string): number
function parse(x: number): string
function parse(x: string | number): string | number {
  return typeof x === 'string' ? Number(x) : String(x)
}
```

```ts [2]
interface Formatter {
  format(x: string): string
  format(x: number): string
}

const fmt: Formatter = {
  format(x: any) {
    return typeof x === 'number' ? x.toFixed(2) : x.trim()
  },
}
```

```ts [3]
interface Factory {
  (name: string): { name: string }
  (id: number): { id: number }
  new (flag: boolean): { flag: boolean }
}

// 这种同时包含“调用重载”和“构造重载”的接口
// 经常用于统一旧/新两种风格的兼容层

// 场景 1：内建对象差异调用行为
// Date
interface DateConstructor {
  new (): Date
  (): string
}
// new Date() 返回 Date 实例
// Date()（不加 new）返回当前时间的字符串表示
// RegExp / Error / Array 等可以“省略 new”

// 场景 2：重构旧库
// 在重构旧库时，保留旧的 new OldThing() 与新推荐的 OldThing(config)，对外同时开放两种入口，为迁移留窗口。
interface CreateClient {
  (url: string): Client // 直接调用：快路径
  new (opts: { url: string; cache: boolean }): Client // new：可带更多配置
}
```

```ts [4]
type Search = {
  (source: string, sub: string): number
  (source: string, regex: RegExp): number[]
}

const search: Search = (src: any, pattern: any) =>
  pattern instanceof RegExp
    ? [...src.matchAll(pattern)].map((m) => m.index!)
    : src.indexOf(pattern)
```

```ts [5]
class Collection {
  constructor(items: number[])
  constructor(count: number, fill: number)
  constructor(arg1: any, arg2?: any) {
    this.items = Array.isArray(arg1)
      ? arg1
      : Array.from({ length: arg1 }, () => arg2 ?? 0)
  }
  items: number[]

  add(x: number): void
  add(xs: number[]): void
  add(x: any) {
    if (Array.isArray(x)) this.items.push(...x)
    else this.items.push(x)
  }
}
```

```ts [6]
declare function read(path: string): string
declare function read(fd: number): string
```

```ts [7]
// 原始
function load(url: string): Promise<string>
function load(url: string): Promise<string> {
  return fetch(url).then((r) => r.text())
}

// 模块增强 / 再声明
declare function load(file: File): Promise<string>
```

```ts [8]
interface Api {
  request(url: string): Promise<string>
}
interface Api {
  request(cfg: { url: string; timeout: number }): Promise<string>
}
// 合并后 Api.request 有两个重载
```

```ts [9]
function calc(x: number): number
function calc(x: number): number {
  return x * 2
}

namespace calc {
  export function version(): string {
    return '1.0.0'
  }
}
```

:::

### 5.2. 不允许的位置（语法或语义不支持）

下面是能想到的一些经典错误示例：

1. 对象字面量内部直接列出多个同名方法签名 - 对象字面量内部只允许出现唯一的实现签名，重载签名别往里写
2. 箭头函数 / 函数表达式本体直接写多个签名 - 箭头函数和函数表达式本体只能有一个实现签名，如果要写重载签名，请改为函数声明式写法
3. 类方法的重载需要带上修饰符 - 比如，类静态方法也可重载，但别忘记带上修饰符 static，否则会报错
4. 直接在实现签名里写“过窄”导致与重载不兼容

::: code-group

```ts [1]
// ❌ 不合法：对象字面量里不能出现多个同名“无实现”签名
// const obj1 = {
//   run(x: string): void
//   run(x: number): void
//   run(x: any) { /* ... */ }
// }

// ✅ 正确写法：先顶层重载声明再赋值；或用接口约束。
// 1. 可以使用 interface
interface Runner2 {
  run(x: string): void
  run(x: number): void
}

const obj2: Runner2 = {
  run(x: any) {
    /* ... */
  },
}

// 2. 可以使用 type
type Runner3 = {
  run(x: string): void
  run(x: number): void
}

const obj3: Runner3 = {
  run(x: any) {
    /* ... */
  },
}
```

```ts [2]
// ❌ 错误写法：
// const fn = (x: string): number
// const fn = (x: number): string

// ✅ 正确写法：用独立函数重载，再赋值；或用接口/类型别名约束
function fn(x: string): number
function fn(x: number): string
function fn(x: any): any {
  return typeof x === 'string' ? x.length : String(x)
}

const ref = fn
```

```ts [3]
// ❌ 错误写法：静态方法重载没有带上 static 修饰符
class C1 {
  parse(x: string): number
  parse(x: number): string
  static parse(x: any): any {
    return typeof x === 'string' ? x.length : String(x)
  }
}
// 报错
// Function overload must not be static.(2388)

// ✅ 正确写法：
class C2 {
  static parse(x: string): number
  static parse(x: number): string
  static parse(x: any): any {
    return typeof x === 'string' ? x.length : String(x)
  }
}
```

```ts [4]
function read(x: string): string // 1
function read(x: number): string // 2
// ❌ 实现签名过窄，只覆盖 1
function read(x: string): string {
  return x
}

// 2 会报错：
// This overload signature is not compatible with its implementation signature.(2394)
```

:::

## 6. 函数重载的匹配规则是？

重载解析并不是“从上到下匹配第一个就停”，而是：

1. 收集所有“可适配”的重载；
2. 在这些候选中选择“更具体”的那个（narrower 更优于 wider）；
3. 如果不存在唯一更具体的候选（彼此不可比、同等具体），才按声明顺序取最前面的那个。

### 6.1. 基本流程与直观示例

```ts
function convert(value: string): number
function convert(value: number): string
function convert(value: string | number): string | number {
  return typeof value === 'string' ? parseInt(value) : String(value)
}

const foo = convert('123') // number（只有第 1 个可适配）
const bar = convert(123) // string（只有第 2 个可适配）
```

上例中每次调用只有一个候选签名可适配，因此直接选中该签名。

### 6.2. 更具体的重载优先（与声明顺序无关）

当多个候选都可适配时，TS 会选择“更具体”的那个（更窄的参数类型）。即使它排在后面，也会被选中。

```ts
function process(value: string): number
function process(value: 'special'): string
function process(value: string): string | number {
  return value === 'special' ? 'Special case' : value.length
}

const a = process('special') // string（选择字面量重载，较具体）
const b = process('other') // number（选择 string 重载）
```

这里 'special' 是 string 的子类型，因此字面量重载更具体并被选择。

### 6.3. 声明顺序会影响的情况：无“唯一更具体者”

当存在多个“同等具体”的候选（彼此不可比、都能适配），才会按声明顺序取第一个。

```ts
function pick(x: 'a' | 'b'): 1
function pick(x: 'a' | 'c'): 2
function pick(x: 'a' | 'b' | 'c'): 1 | 2 {
  return x === 'c' ? 2 : 1
}

const a1 = pick('a') // 1（两个候选都可适配、无唯一更具体 → 取第一个）
const b1 = pick('b') // 1（只匹配第 1 个）
const c1 = pick('c') // 2（只匹配第 2 个）
```

结构类型示例（注意对象字面量的“多余属性检查”）：

```ts
function f(x: { a: number }): 'A'
function f(x: { b: number }): 'B'
function f(x: { a?: number; b?: number }): 'A' | 'B' {
  return 'a' in x ? 'A' : 'B'
}

// 用变量调用：两个候选都可适配、同等具体 → 取声明顺序第一个
const ab = { a: 1, b: 2 }
const r = f(ab) // 'A'

// 注意：直接用对象字面量会触发“对象多余属性检查”，因此此调用报错：
// f({ a: 1, b: 2 }) // ❌
// No overload matches this call.
//   Overload 1 of 2, '(x: { a: number; }): "A"', gave the following error.
//     Object literal may only specify known properties, and 'b' does not exist in type '{ a: number; }'.
//   Overload 2 of 2, '(x: { b: number; }): "B"', gave the following error.
//     Object literal may only specify known properties, and 'a' does not exist in type '{ b: number; }'.(2769)
```

解释：

- 变量 `ab` 的类型是 `{ a: number; b: number }`，可赋给 `{ a: number }` 和 `{ b: number }`，二者同等具体，按顺序取第一个 → 返回 `'A'`。
- 但对对象字面量会额外进行“多余属性检查”，分别检查成 `{ a: number }` 和 `{ b: number }` 时，`b/a` 被视为多余属性而报错；实现签名不可见，不参与选择。

### 6.4. 可选参数与参数个数

- 可选参数/不同参数个数也参与“可适配性”的判断。
- 通常“参数个数更精确、约束更强”的签名更具体。

```ts
function greet(name: string): string
function greet(name: string, greeting: string): string
function greet(name: string, greeting?: string): string {
  return greeting ? `${greeting}, ${name}` : `Hello, ${name}`
}

greet('Alice') // 选 (name: string)
greet('Bob', 'Hi') // 选 (name: string, greeting: string)
```

### 6.5. 仅看参数，不看返回类型

重载选择仅依据参数类型/个数是否可适配及“更具体性”。

返回类型不参与重载选择。

```ts
// 参数完全相同而仅返回类型不同的两个重载不被允许
function bad(x: string): number
// function bad(x: string): string // ❌ 重复的参数列表，编译错误
function bad(x: string): number {
  return x.length
}
```

### 6.6. 小结

- 写重载时应按“更具体 → 更通用”排序（最佳实践）
- 实际解析以“更具体者优先”为准，只有没有唯一更具体时，声明顺序才决定结果
- 实现签名对外不可见，不参与选择过程

## 7. 重载 vs 联合类型

对比示例：

::: code-group

```ts [重载]
// ✅ 重载：返回类型精确
function getValue(key: 'name'): string
function getValue(key: 'age'): number
function getValue(key: 'name' | 'age'): string | number {
  return key === 'name' ? 'Alice' : 25
}

const name = getValue('name') // string ✅
const age = getValue('age') // number ✅
```

```ts [联合类型]
// ⚠️ 联合类型：返回类型宽松
function getValue(key: 'name' | 'age'): string | number {
  return key === 'name' ? 'Alice' : 25
}

const name = getValue('name') // string | number ⚠️
const age = getValue('age') // string | number ⚠️

// 需要类型断言
const nameStr = getValue('name') as string
```

:::

对比表格：

| 场景                 | 重载        | 联合类型        |
| -------------------- | ----------- | --------------- |
| 返回类型依赖参数类型 | ✅ 适合     | ❌ 类型不够精确 |
| 返回类型固定         | ❌ 过度设计 | ✅ 适合         |
| 多种调用方式         | ✅ 适合     | ❌ 不够灵活     |
| 代码复杂度           | 较高        | 较低            |

决策建议：

::: code-group

```ts [优先使用重载]
// ✅ 重载：参数类型决定返回类型
function process(value: string): number
function process(value: number): string
function process(value: string | number): string | number {
  return typeof value === 'string' ? value.length : String(value)
}

const result1 = process('hello') // 类型：number ✅
const result2 = process(123) // 类型：string ✅
```

```ts [优先使用联合类型]
// ✅ 联合类型：返回类型固定
function process(value: string | number): number {
  return typeof value === 'string' ? value.length : value
}

const result1 = process('hello') // 类型：number
const result2 = process(123) // 类型：number
```

:::

## 8. 关于函数重载都有哪些实践建议？

```ts
// ✅ 1. 当返回类型依赖参数类型时使用重载
function convert(value: string): number
function convert(value: number): string
function convert(value: string | number): string | number {
  return typeof value === 'string' ? parseInt(value) : String(value)
}

// ✅ 2. 具体的重载在前，通用的在后
function process(value: 'special'): string
function process(value: string): number
function process(value: string): string | number {
  // 实现
}

// ✅ 3. 重载签名数量合理（2-5 个）
// Good: 3 个重载
function create(type: 'user'): User
function create(type: 'post'): Post
function create(type: 'comment'): Comment
function create(type: string): any {
  // 实现
}

// ✅ 4. 使用泛型减少重载数量
// Bad: 多个重载
function map1(arr: number[], fn: (x: number) => number): number[]
function map1(arr: string[], fn: (x: string) => string): string[]
function map1(arr: boolean[], fn: (x: boolean) => boolean): boolean[]

// Good: 单个泛型函数
function map<T>(arr: T[], fn: (x: T) => T): T[] {
  return arr.map(fn)
}

// ✅ 5. 为重载添加 JSDoc 注释
/**
 * 解析值为数字
 */
function parse(value: string): number
/**
 * 格式化数字为字符串
 */
function parse(value: number): string
function parse(value: string | number): string | number {
  return typeof value === 'string' ? parseInt(value) : String(value)
}

// ✅ 6. 实现签名使用类型守卫，确保类型安全
function process(value: string): string
function process(value: number): number
function process(value: string | number): string | number {
  if (typeof value === 'string') {
    return value.toUpperCase()
  } else {
    return value * 2
  }
}

// ✅ 7. 返回类型固定的情况下，优先考虑用条件类型替代，不要过度设计
function process(value: string | number): number {
  return typeof value === 'string' ? value.length : value
}

const result1 = process('hello') // 类型：number
const result2 = process(123) // 类型：number
```

## 9. 引用

- [TypeScript Handbook - Function Overloads][1]
- [TypeScript Deep Dive - Function Overloading][2]

[1]: https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads
[2]: https://basarat.gitbook.io/typescript/type-system/functions#overloading
