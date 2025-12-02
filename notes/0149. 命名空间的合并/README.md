# [0149. 命名空间的合并](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0149.%20%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4%E7%9A%84%E5%90%88%E5%B9%B6)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是命名空间的合并?](#3--什么是命名空间的合并)
- [4. 🤔 如何合并命名空间?](#4--如何合并命名空间)
  - [4.1. 合并规则对比](#41-合并规则对比)
- [5. 🤔 命名空间与类的合并有什么规则?](#5--命名空间与类的合并有什么规则)
- [6. 🤔 命名空间与函数的合并有什么特点?](#6--命名空间与函数的合并有什么特点)
  - [6.1. 函数合并的特点](#61-函数合并的特点)
- [7. 🤔 命名空间与枚举的合并如何实现?](#7--命名空间与枚举的合并如何实现)
- [8. 🤔 命名空间合并有哪些实际应用场景?](#8--命名空间合并有哪些实际应用场景)
  - [8.1. 常见错误与解决方案](#81-常见错误与解决方案)
  - [8.2. 最佳实践建议](#82-最佳实践建议)
- [9. 🔗 引用](#9--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 命名空间合并的定义和基本规则
- 命名空间之间的合并机制
- 命名空间与类、函数、枚举的合并
- 合并时的成员可见性规则
- 实际应用场景与最佳实践

## 2. 🫧 评价

命名空间的合并是 TypeScript 声明合并机制的一部分,允许同名命名空间在不同位置声明并自动合并。这在扩展现有库、组织大型代码库时很有用,但在现代开发中,ES6 模块系统已经成为主流。

建议:

- 新项目优先使用 ES6 模块,避免使用命名空间
- 理解命名空间合并机制主要用于维护遗留代码或编写类型声明文件
- 命名空间合并遵循后声明覆盖前声明的原则,注意导出成员的可见性
- 命名空间可以与类、函数、枚举合并,实现静态成员扩展等功能

核心内容总结:命名空间合并通过相同名称自动合并声明,导出的成员在合并后可相互访问,未导出的成员仅在当前命名空间可见。命名空间还可以与其他声明类型合并,创建具有附加属性的复杂结构。

## 3. 🤔 什么是命名空间的合并?

命名空间的合并是指当多个同名命名空间在同一作用域内声明时,TypeScript 会自动将它们合并为一个命名空间,所有导出的成员都可以相互访问。

::: code-group

```ts [基本合并示例]
// ✅ 第一个命名空间声明
namespace Animals {
  export class Dog {
    bark() {
      return 'Woof!'
    }
  }
}

// ✅ 第二个命名空间声明(同名)
namespace Animals {
  export class Cat {
    meow() {
      return 'Meow!'
    }
  }
}

// 合并后可以访问所有导出的成员
const dog = new Animals.Dog()
const cat = new Animals.Cat()
console.log(dog.bark()) // Woof!
console.log(cat.meow()) // Meow!
```

```ts [非导出成员不合并]
namespace Utilities {
  export function publicMethod() {
    return 'Public'
  }

  // ❌ 未导出的函数
  function privateMethod() {
    return 'Private'
  }
}

namespace Utilities {
  export function anotherMethod() {
    // ❌ 无法访问另一个命名空间中未导出的成员
    // privateMethod(); // 编译错误
    return publicMethod() // ✅ 可以访问导出的成员
  }
}
```

```ts [合并顺序影响]
namespace Config {
  export let value = 10

  export function getValue() {
    return value
  }
}

namespace Config {
  // ✅ 后声明的覆盖前面的
  export let value = 20
}

console.log(Config.getValue()) // 20(使用最后声明的值)
```

:::

::: warning ⚠️ 注意事项

- 只有导出的成员才会在合并后的命名空间中可见
- 非导出成员只能在各自的命名空间内部访问
- 后声明的同名成员会覆盖之前的声明
- 命名空间合并是在编译时进行的

:::

## 4. 🤔 如何合并命名空间?

命名空间合并遵循特定的规则,包括接口合并、类型合并和值合并。

::: code-group

```ts [接口合并]
namespace Shapes {
  // ✅ 第一个接口声明
  export interface Circle {
    radius: number
  }
}

namespace Shapes {
  // ✅ 同名接口会自动合并
  export interface Circle {
    color: string
  }
}

// 合并后的接口包含所有属性
const circle: Shapes.Circle = {
  radius: 10,
  color: 'red',
}
```

```ts [类型别名不合并]
namespace Types {
  export type ID = string
}

// ❌ 类型别名不能合并,会报错
// namespace Types {
//   export type ID = number; // 编译错误:重复的标识符
// }
```

```ts [值的合并]
namespace Logger {
  export const version = '1.0.0'

  export function log(msg: string) {
    console.log(`[${version}] ${msg}`)
  }
}

namespace Logger {
  // ✅ 添加新的函数
  export function warn(msg: string) {
    console.log(`[WARN] ${msg}`)
  }

  // ✅ 添加新的常量
  export const maxLevel = 5
}

// 合并后可以访问所有成员
Logger.log('Info message')
Logger.warn('Warning message')
console.log(Logger.version) // 1.0.0
console.log(Logger.maxLevel) // 5
```

```ts [嵌套命名空间合并]
namespace Company {
  export namespace HR {
    export class Employee {
      constructor(public name: string) {}
    }
  }
}

namespace Company {
  export namespace HR {
    // ✅ 扩展嵌套的命名空间
    export class Manager extends Employee {
      constructor(name: string, public department: string) {
        super(name)
      }
    }
  }
}

// 嵌套命名空间也会合并
const emp = new Company.HR.Employee('张三')
const mgr = new Company.HR.Manager('李四', 'IT')
```

:::

### 4.1. 合并规则对比

| 成员类型 | 是否合并 | 规则说明                   |
| -------- | -------- | -------------------------- |
| 接口     | ✅ 是    | 同名接口自动合并所有成员   |
| 类型别名 | ❌ 否    | 不允许同名类型别名         |
| 函数     | ✅ 是    | 可以添加重载签名           |
| 变量     | ⚠️ 覆盖  | 后声明的覆盖前面的         |
| 类       | ❌ 否    | 不允许同名类声明           |
| 枚举     | ✅ 是    | 同名枚举成员合并(不能重复) |

## 5. 🤔 命名空间与类的合并有什么规则?

命名空间可以与类合并,为类添加静态成员,但必须在类声明之后。

::: code-group

```ts [为类添加静态成员]
// ✅ 先声明类
class Album {
  constructor(public title: string) {}
}

// ✅ 再声明同名命名空间(为类添加静态成员)
namespace Album {
  export class AlbumLabel {
    constructor(public name: string) {}
  }

  export function create(title: string) {
    return new Album(title)
  }
}

// 使用
const album = new Album('Greatest Hits')
const label = new Album.AlbumLabel('Sony Music')
const newAlbum = Album.create('New Album')
```

```ts [错误的声明顺序]
// ❌ 命名空间必须在类之后声明
namespace Product {
  export const version = '1.0'
}

// ❌ 这样会报错
// class Product {
//   constructor(public name: string) {}
// }
```

```ts [实际应用:工厂模式]
class User {
  constructor(public name: string, public role: string) {}
}

namespace User {
  // ✅ 添加工厂方法
  export function createAdmin(name: string) {
    return new User(name, 'admin')
  }

  export function createGuest(name: string) {
    return new User(name, 'guest')
  }

  // ✅ 添加类型定义
  export interface Config {
    maxUsers: number
    timeout: number
  }
}

// 使用工厂方法
const admin = User.createAdmin('Admin')
const guest = User.createGuest('Guest')

// 使用类型
const config: User.Config = {
  maxUsers: 100,
  timeout: 3000,
}
```

:::

::: tip 💡 使用场景

类与命名空间合并主要用于:

- 为类添加静态工厂方法
- 为类添加相关的类型定义
- 组织与类相关的辅助功能
- 创建类的配置对象类型

:::

## 6. 🤔 命名空间与函数的合并有什么特点?

命名空间可以与函数合并,为函数添加属性,实现类似闭包的效果。

::: code-group

```ts [为函数添加属性]
// ✅ 先声明函数
function buildLabel(name: string): string {
  return buildLabel.prefix + name + buildLabel.suffix
}

// ✅ 通过命名空间为函数添加属性
namespace buildLabel {
  export let prefix = '['
  export let suffix = ']'
}

// 使用
console.log(buildLabel('TypeScript')) // [TypeScript]

// 修改属性
buildLabel.prefix = '《'
buildLabel.suffix = '》'
console.log(buildLabel('TypeScript')) // 《TypeScript》
```

```ts [计数器函数示例]
function counter() {
  return counter.count++
}

namespace counter {
  export let count = 0

  export function reset() {
    count = 0
  }
}

console.log(counter()) // 0
console.log(counter()) // 1
console.log(counter()) // 2
counter.reset()
console.log(counter()) // 0
```

```ts [配置函数示例]
function request(url: string) {
  return fetch(url, request.config)
}

namespace request {
  export interface RequestConfig {
    method: string
    headers: Record<string, string>
  }

  export let config: RequestConfig = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }

  export function setConfig(newConfig: Partial<RequestConfig>) {
    config = { ...config, ...newConfig }
  }
}

// 使用
request.setConfig({ method: 'POST' })
request('/api/data')
```

:::

### 6.1. 函数合并的特点

| 特性       | 说明                           |
| ---------- | ------------------------------ |
| 声明顺序   | 函数必须在命名空间之前声明     |
| 添加属性   | 可以为函数添加静态属性和方法   |
| 类型定义   | 可以定义与函数相关的接口和类型 |
| 状态保持   | 可以实现类似闭包的状态管理     |
| JavaScript | 编译后就是普通的对象属性       |

## 7. 🤔 命名空间与枚举的合并如何实现?

命名空间可以与枚举合并,为枚举添加静态方法或辅助函数。

::: code-group

```ts [为枚举添加方法]
// ✅ 先声明枚举
enum Color {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE',
}

// ✅ 通过命名空间为枚举添加方法
namespace Color {
  export function parse(value: string): Color | undefined {
    switch (value.toUpperCase()) {
      case 'RED':
        return Color.Red
      case 'GREEN':
        return Color.Green
      case 'BLUE':
        return Color.Blue
      default:
        return undefined
    }
  }

  export function toHex(color: Color): string {
    switch (color) {
      case Color.Red:
        return '#FF0000'
      case Color.Green:
        return '#00FF00'
      case Color.Blue:
        return '#0000FF'
    }
  }
}

// 使用
const color = Color.parse('red')
if (color) {
  console.log(Color.toHex(color)) // #FF0000
}
```

```ts [为枚举添加验证]
enum Status {
  Pending = 0,
  Active = 1,
  Completed = 2,
  Cancelled = 3,
}

namespace Status {
  export function isValid(value: number): boolean {
    return value >= Status.Pending && value <= Status.Cancelled
  }

  export function getLabel(status: Status): string {
    const labels: Record<Status, string> = {
      [Status.Pending]: '待处理',
      [Status.Active]: '进行中',
      [Status.Completed]: '已完成',
      [Status.Cancelled]: '已取消',
    }
    return labels[status]
  }
}

// 使用
console.log(Status.isValid(1)) // true
console.log(Status.isValid(99)) // false
console.log(Status.getLabel(Status.Active)) // 进行中
```

```ts [为枚举添加常量]
enum LogLevel {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3,
}

namespace LogLevel {
  export const DEFAULT = LogLevel.Info
  export const MAX_LEVEL = LogLevel.Error

  export function shouldLog(level: LogLevel, threshold: LogLevel): boolean {
    return level >= threshold
  }
}

// 使用
const currentLevel = LogLevel.DEFAULT
console.log(LogLevel.shouldLog(LogLevel.Error, currentLevel)) // true
```

:::

::: tip 💡 最佳实践

为枚举添加命名空间时:

- 添加类型安全的辅助函数
- 提供枚举值的转换方法
- 定义枚举相关的常量
- 实现枚举值的验证逻辑

:::

## 8. 🤔 命名空间合并有哪些实际应用场景?

虽然现代开发推荐使用模块,但在特定场景下命名空间合并仍有其价值。

::: code-group

```ts [场景1:扩展第三方库类型]
// ✅ 扩展第三方库的类型定义
declare namespace jQuery {
  interface AjaxSettings {
    customOption?: boolean
  }
}

// 继续扩展
declare namespace jQuery {
  function customPlugin(selector: string): void
}

// 现在可以使用扩展的类型
// $.ajax({ customOption: true });
// $.customPlugin('.element');
```

```ts [场景2:组织相关功能]
namespace MathUtils {
  export function add(a: number, b: number) {
    return a + b
  }

  export function subtract(a: number, b: number) {
    return a - b
  }
}

namespace MathUtils {
  // ✅ 在不同文件中扩展功能
  export function multiply(a: number, b: number) {
    return a * b
  }

  export function divide(a: number, b: number) {
    return a / b
  }
}

// 所有功能都可用
console.log(MathUtils.add(10, 5))
console.log(MathUtils.multiply(10, 5))
```

```ts [场景3:渐进式扩展API]
class API {
  constructor(public baseURL: string) {}

  get(path: string) {
    return fetch(`${this.baseURL}${path}`)
  }
}

namespace API {
  // ✅ 添加类型定义
  export interface Response<T> {
    data: T
    status: number
  }

  // ✅ 添加辅助函数
  export function create(baseURL: string) {
    return new API(baseURL)
  }
}

// 另一个模块继续扩展
namespace API {
  export interface RequestConfig {
    timeout: number
    headers: Record<string, string>
  }

  export const DEFAULT_CONFIG: RequestConfig = {
    timeout: 3000,
    headers: {},
  }
}

// 使用
const api = API.create('https://api.example.com')
const config: API.RequestConfig = API.DEFAULT_CONFIG
```

:::

### 8.1. 常见错误与解决方案

::: warning ⚠️ 错误 1:在不同作用域声明

```ts
// ❌ 在不同作用域中的同名命名空间不会合并
function scope1() {
  namespace Utils {
    export const value = 1
  }
}

function scope2() {
  namespace Utils {
    export const value = 2
  }
  // 这是独立的命名空间,不会合并
}

// ✅ 解决方案:在同一作用域声明
namespace Utils {
  export const value1 = 1
}

namespace Utils {
  export const value2 = 2
}
```

:::

::: warning ⚠️ 错误 2:期望非导出成员合并

```ts
namespace Config {
  let privateValue = 10 // ❌ 未导出

  export function getValue() {
    return privateValue
  }
}

namespace Config {
  export function setValue(v: number) {
    // ❌ 无法访问另一个命名空间的私有成员
    // privateValue = v; // 编译错误
  }
}

// ✅ 解决方案:导出需要共享的成员
namespace Config {
  export let sharedValue = 10

  export function getValue() {
    return sharedValue
  }
}

namespace Config {
  export function setValue(v: number) {
    sharedValue = v // ✅ 可以访问
  }
}
```

:::

### 8.2. 最佳实践建议

::: tip 💡 使用建议

1. 优先使用 ES6 模块而非命名空间
2. 仅在以下场景使用命名空间合并:
   - 编写或扩展类型声明文件
   - 维护遗留的命名空间代码
   - 需要全局命名空间时
3. 确保所有需要共享的成员都使用 `export` 导出
4. 注意声明顺序,特别是与类、函数合并时
5. 避免过度使用命名空间合并,保持代码简洁

:::

## 9. 🔗 引用

- [TypeScript Handbook - Declaration Merging][1]
- [TypeScript Deep Dive - Declaration Merging][2]
- [TypeScript 官方文档 - 命名空间][3]

[1]: https://www.typescriptlang.org/docs/handbook/declaration-merging.html
[2]: https://basarat.gitbook.io/typescript/type-system/declaration-merging
[3]: https://www.typescriptlang.org/docs/handbook/namespaces.html
