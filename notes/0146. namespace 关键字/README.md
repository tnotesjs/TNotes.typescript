# [0146. namespace 关键字](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0146.%20namespace%20%E5%85%B3%E9%94%AE%E5%AD%97)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是 namespace？](#3--什么是-namespace)
- [4. 🤔 为什么需要 namespace？](#4--为什么需要-namespace)
- [5. 🤔 如何定义和使用 namespace？](#5--如何定义和使用-namespace)
- [6. 🤔 namespace 如何导出成员？](#6--namespace-如何导出成员)
- [7. 🤔 如何嵌套 namespace？](#7--如何嵌套-namespace)
- [8. 🤔 namespace 和模块有什么区别？](#8--namespace-和模块有什么区别)
- [9. 🤔 如何合并多个 namespace？](#9--如何合并多个-namespace)
- [10. 🤔 namespace 如何与类和函数配合使用？](#10--namespace-如何与类和函数配合使用)
- [11. 🤔 什么时候应该使用 namespace？](#11--什么时候应该使用-namespace)
- [12. 🤔 如何将 namespace 编译为 JavaScript？](#12--如何将-namespace-编译为-javascript)
- [13. 🤔 常见问题有哪些？](#13--常见问题有哪些)
- [14. 🤔 最佳实践是什么？](#14--最佳实践是什么)
- [15. 🔗 引用](#15--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- namespace 关键字的基本概念
- namespace 的定义和使用
- namespace 的导出和嵌套
- namespace 与模块的区别
- 声明合并
- 实际应用场景

## 2. 🫧 评价

- `namespace` 是 TypeScript 早期用于组织代码的机制，在 ES6 模块出现之前非常流行。
- 在现代 TypeScript 开发中，`namespace` 的使用场景已经很少，主要原因：
  - ES6 模块系统（`import/export`）已经成为标准
  - namespace 不支持 Tree-shaking
  - 与现代构建工具的集成不如模块好
- 但在以下场景中仍然有用：
  - 为全局对象添加类型定义
  - 组织类型声明文件中的类型
  - 维护旧的 TypeScript 代码
  - 编写声明文件时组织命名空间
- 建议：新项目使用 ES6 模块，只在必要时使用 namespace（如类型声明文件）。

## 3. 🤔 什么是 namespace？

namespace（命名空间）是 TypeScript 提供的一种将代码组织在逻辑分组中的方式，用于避免全局命名冲突。

基本语法：

```ts
// 定义命名空间
namespace MyNamespace {
  // 命名空间内的代码
  export function doSomething() {
    console.log('执行某操作')
  }

  export class MyClass {
    name: string
  }
}

// 使用命名空间中的成员
MyNamespace.doSomething()
const instance = new MyNamespace.MyClass()
```

namespace 的特点：

- 创建一个逻辑分组
- 防止全局命名冲突
- 可以跨文件分割
- 支持嵌套
- 可以包含类型、接口、类、函数等

## 4. 🤔 为什么需要 namespace？

在 ES6 模块出现之前，JavaScript 没有内置的模块系统，namespace 解决了以下问题：

避免全局命名冲突

::: code-group

```ts [不使用 namespace]
// utils.ts
function formatDate(date: Date): string {
  return date.toISOString()
}

// math.ts
function formatDate(num: number): string {
  // ❌ 命名冲突
  return num.toFixed(2)
}
```

```ts [使用 namespace]
// utils.ts
namespace Utils {
  export function formatDate(date: Date): string {
    return date.toISOString()
  }
}

// math.ts
namespace Math {
  export function formatDate(num: number): string {
    return num.toFixed(2)
  }
}

// 使用时不会冲突
Utils.formatDate(new Date()) // ✅
Math.formatDate(123.456) // ✅
```

:::

组织相关代码

```ts
// 将相关的功能组织在一起
namespace Validation {
  export interface StringValidator {
    isValid(s: string): boolean
  }

  export class EmailValidator implements StringValidator {
    isValid(s: string): boolean {
      return /\S+@\S+\.\S+/.test(s)
    }
  }

  export class URLValidator implements StringValidator {
    isValid(s: string): boolean {
      return /^https?:\/\//.test(s)
    }
  }
}

// 使用
const emailValidator = new Validation.EmailValidator()
console.log(emailValidator.isValid('test@example.com')) // true
```

提供清晰的 API 结构

```ts
// 为库提供清晰的命名空间
namespace MyLibrary {
  export namespace Utils {
    export function helper() {}
  }

  export namespace Components {
    export class Button {}
    export class Input {}
  }

  export namespace Types {
    export interface Config {}
  }
}

// 使用时结构清晰
MyLibrary.Utils.helper()
const button = new MyLibrary.Components.Button()
```

## 5. 🤔 如何定义和使用 namespace？

基本定义

```ts
// 定义命名空间
namespace Animals {
  // 导出的成员可以在外部访问
  export class Dog {
    bark() {
      console.log('汪汪！')
    }
  }

  // 未导出的成员只能在命名空间内部访问
  class Cat {
    meow() {
      console.log('喵喵！')
    }
  }

  // 导出函数
  export function createDog(): Dog {
    return new Dog()
  }

  // 内部使用未导出的类
  function createCat(): Cat {
    return new Cat()
  }
}

// ✅ 使用导出的成员
const dog = new Animals.Dog()
dog.bark()

const dog2 = Animals.createDog()

// ❌ 无法访问未导出的成员
const cat = new Animals.Cat() // 错误：Cat 不可访问
```

在多个文件中定义同一个 namespace

::: code-group

```ts [validation.ts]
namespace Validation {
  export interface StringValidator {
    isValid(s: string): boolean
  }
}
```

```ts [emailValidator.ts]
/// <reference path="validation.ts" />

namespace Validation {
  export class EmailValidator implements StringValidator {
    isValid(s: string): boolean {
      return /\S+@\S+\.\S+/.test(s)
    }
  }
}
```

```ts [urlValidator.ts]
/// <reference path="validation.ts" />

namespace Validation {
  export class URLValidator implements StringValidator {
    isValid(s: string): boolean {
      return /^https?:\/\//.test(s)
    }
  }
}
```

```ts [使用]
/// <reference path="emailValidator.ts" />
/// <reference path="urlValidator.ts" />

const emailValidator = new Validation.EmailValidator()
const urlValidator = new Validation.URLValidator()
```

:::

别名

使用 `import` 关键字为 namespace 成员创建别名。

```ts
namespace Shapes {
  export namespace Polygons {
    export class Triangle {}
    export class Square {}
  }
}

// 创建别名
import polygons = Shapes.Polygons

// 使用别名
const triangle = new polygons.Triangle()
const square = new polygons.Square()

// 也可以为具体类创建别名
import Triangle = Shapes.Polygons.Triangle
const tri = new Triangle()
```

## 6. 🤔 namespace 如何导出成员？

使用 export 关键字

```ts
namespace MyNamespace {
  // 导出类型
  export interface User {
    name: string
    age: number
  }

  // 导出类型别名
  export type ID = string | number

  // 导出类
  export class UserManager {
    users: User[] = []

    addUser(user: User) {
      this.users.push(user)
    }
  }

  // 导出函数
  export function createUser(name: string, age: number): User {
    return { name, age }
  }

  // 导出常量
  export const MAX_USERS = 100

  // 导出枚举
  export enum UserRole {
    Admin = 'admin',
    User = 'user',
  }

  // 内部使用的私有函数（不导出）
  function validateUser(user: User): boolean {
    return user.age >= 0 && user.name.length > 0
  }
}

// 使用导出的成员
const user: MyNamespace.User = MyNamespace.createUser('Alice', 25)
const manager = new MyNamespace.UserManager()
manager.addUser(user)

const role = MyNamespace.UserRole.Admin
const maxUsers = MyNamespace.MAX_USERS
```

批量导出

```ts
namespace Utils {
  class Helper1 {}
  class Helper2 {}
  function util1() {}
  function util2() {}

  // 批量导出
  export { Helper1, Helper2, util1, util2 }
}
```

## 7. 🤔 如何嵌套 namespace？

基本嵌套

```ts
namespace Company {
  export namespace HR {
    export class Employee {
      constructor(public name: string) {}
    }

    export function hire(name: string): Employee {
      return new Employee(name)
    }
  }

  export namespace IT {
    export class Developer {
      constructor(public name: string, public skills: string[]) {}
    }

    export function recruit(name: string, skills: string[]): Developer {
      return new Developer(name, skills)
    }
  }

  // 公司级别的函数
  export function getEmployeeCount(): number {
    return 100
  }
}

// 使用嵌套的命名空间
const employee = new Company.HR.Employee('Alice')
const developer = Company.IT.recruit('Bob', ['TypeScript', 'React'])

// 使用外层命名空间的成员
const count = Company.getEmployeeCount()
```

多层嵌套

```ts
namespace App {
  export namespace UI {
    export namespace Components {
      export class Button {
        click() {
          console.log('按钮被点击')
        }
      }

      export class Input {
        value: string = ''
      }
    }

    export namespace Utils {
      export function formatText(text: string): string {
        return text.trim().toLowerCase()
      }
    }
  }

  export namespace API {
    export namespace Client {
      export function get(url: string) {}
      export function post(url: string, data: any) {}
    }
  }
}

// 使用深层嵌套的成员
const button = new App.UI.Components.Button()
button.click()

const formatted = App.UI.Utils.formatText('  HELLO  ')
App.API.Client.get('/api/users')
```

使用别名简化访问

```ts
namespace LongNamespace {
  export namespace VeryLongSubNamespace {
    export namespace AnotherLevel {
      export class MyClass {
        doSomething() {
          console.log('执行操作')
        }
      }
    }
  }
}

// ❌ 每次都写完整路径很麻烦
const instance1 = new LongNamespace.VeryLongSubNamespace.AnotherLevel.MyClass()

// ✅ 使用别名
import MyClass = LongNamespace.VeryLongSubNamespace.AnotherLevel.MyClass
const instance2 = new MyClass()

// ✅ 也可以为中间层创建别名
import SubNS = LongNamespace.VeryLongSubNamespace.AnotherLevel
const instance3 = new SubNS.MyClass()
```

## 8. 🤔 namespace 和模块有什么区别？

主要区别对比

| 特性         | namespace           | ES6 模块           |
| ------------ | ------------------- | ------------------ |
| 语法         | `namespace Name {}` | `export/import`    |
| 作用域       | 全局或嵌套          | 文件作用域         |
| 加载方式     | 全部加载            | 按需加载           |
| Tree-shaking | 不支持              | 支持               |
| 文件组织     | 可跨文件            | 每个文件是独立模块 |
| 现代性       | 旧式（不推荐）      | 现代标准（推荐）   |
| 适用场景     | 类型声明、全局对象  | 所有代码组织       |

::: code-group

```ts [使用 namespace]
// utils.ts
namespace Utils {
  export function add(a: number, b: number): number {
    return a + b
  }

  export function subtract(a: number, b: number): number {
    return a - b
  }
}

// app.ts
// 使用三斜线指令引用
/// <reference path="utils.ts" />

// 直接使用，无需导入
Utils.add(1, 2)
Utils.subtract(5, 3)
```

```ts [使用 ES6 模块]
// utils.ts
export function add(a: number, b: number): number {
  return a + b
}

export function subtract(a: number, b: number): number {
  return a - b
}

// app.ts
// 需要显式导入
import { add, subtract } from './utils'

add(1, 2)
subtract(5, 3)
```

:::

namespace 的全局性

```ts
// math.ts
namespace MathUtils {
  export function square(x: number): number {
    return x * x
  }
}

// app.ts
// 即使不导入，只要文件被包含，就可以使用
console.log(MathUtils.square(5)) // 25

// 模块系统则必须显式导入
```

模块的隔离性

```ts
// ✅ 模块提供更好的隔离
// user.ts
const SECRET_KEY = 'abc123' // 私有，外部无法访问

export class User {
  constructor(public name: string) {}
}

// app.ts
import { User } from './user'
// 无法访问 SECRET_KEY
```

## 9. 🤔 如何合并多个 namespace？

同名 namespace 自动合并

TypeScript 会自动合并同名的 namespace 声明。

::: code-group

```ts [第一个声明]
namespace Animals {
  export class Dog {
    bark() {
      console.log('汪汪！')
    }
  }
}
```

```ts [第二个声明]
namespace Animals {
  export class Cat {
    meow() {
      console.log('喵喵！')
    }
  }
}
```

```ts [合并后的效果]
// 两个声明合并为一个
namespace Animals {
  export class Dog {
    bark() {
      console.log('汪汪！')
    }
  }

  export class Cat {
    meow() {
      console.log('喵喵！')
    }
  }
}

// 可以同时使用两个类
const dog = new Animals.Dog()
const cat = new Animals.Cat()
```

:::

跨文件合并

::: code-group

```ts [file1.ts]
namespace MyLib {
  export function functionA() {
    console.log('Function A')
  }
}
```

```ts [file2.ts]
namespace MyLib {
  export function functionB() {
    console.log('Function B')
  }
}
```

```ts [使用]
/// <reference path="file1.ts" />
/// <reference path="file2.ts" />

MyLib.functionA() // ✅ 可用
MyLib.functionB() // ✅ 可用
```

:::

与接口合并

namespace 可以与同名的接口合并。

```ts
// 定义接口
interface User {
  name: string
  age: number
}

// 定义同名的命名空间
namespace User {
  export function create(name: string, age: number): User {
    return { name, age }
  }

  export function isValid(user: User): boolean {
    return user.age >= 0 && user.name.length > 0
  }
}

// 使用接口
const user: User = { name: 'Alice', age: 25 }

// 使用命名空间中的函数
const newUser = User.create('Bob', 30)
console.log(User.isValid(newUser))
```

与类合并

```ts
class Album {
  constructor(public title: string) {}
}

namespace Album {
  export class Track {
    constructor(public name: string, public duration: number) {}
  }

  export function createEmpty(title: string): Album {
    return new Album(title)
  }
}

// 使用类
const album = new Album('Greatest Hits')

// 使用命名空间中的成员
const track = new Album.Track('Song 1', 180)
const emptyAlbum = Album.createEmpty('New Album')
```

与函数合并

```ts
function buildLabel(name: string): string {
  return buildLabel.prefix + name + buildLabel.suffix
}

namespace buildLabel {
  export let prefix = '['
  export let suffix = ']'
}

// 使用函数
console.log(buildLabel('test')) // [test]

// 修改命名空间中的属性
buildLabel.prefix = '<<'
buildLabel.suffix = '>>'
console.log(buildLabel('test')) // <<test>>
```

## 10. 🤔 namespace 如何与类和函数配合使用？

为类添加静态成员

```ts
class Calculator {
  add(a: number, b: number): number {
    return a + b
  }
}

namespace Calculator {
  // 添加静态常量
  export const PI = 3.14159
  export const E = 2.71828

  // 添加静态工具函数
  export function square(x: number): number {
    return x * x
  }

  // 添加嵌套类型
  export interface Options {
    precision: number
  }
}

// 使用实例方法
const calc = new Calculator()
console.log(calc.add(1, 2))

// 使用静态成员
console.log(Calculator.PI)
console.log(Calculator.square(5))

const options: Calculator.Options = { precision: 2 }
```

为函数添加属性

```ts
function ajax(url: string, options?: ajax.Options) {
  const config = { ...ajax.defaultOptions, ...options }
  console.log(`请求 ${url}`, config)
}

namespace ajax {
  export interface Options {
    method?: 'GET' | 'POST'
    headers?: Record<string, string>
  }

  export const defaultOptions: Options = {
    method: 'GET',
    headers: {},
  }

  export function get(url: string) {
    return ajax(url, { method: 'GET' })
  }

  export function post(url: string) {
    return ajax(url, { method: 'POST' })
  }
}

// 使用函数
ajax('/api/users')

// 使用命名空间中的方法
ajax.get('/api/users')
ajax.post('/api/users')

// 访问默认配置
console.log(ajax.defaultOptions)
```

实际应用：jQuery 风格的 API

```ts
function $(selector: string): $.Elements {
  return new $.Elements(selector)
}

namespace $ {
  export class Elements {
    constructor(public selector: string) {}

    addClass(className: string): this {
      console.log(`添加类 ${className} 到 ${this.selector}`)
      return this
    }

    on(event: string, handler: Function): this {
      console.log(`为 ${this.selector} 绑定 ${event} 事件`)
      return this
    }
  }

  export function ajax(url: string): Promise<any> {
    return fetch(url).then((res) => res.json())
  }

  export const version = '3.6.0'
}

// 使用
$('.button')
  .addClass('active')
  .on('click', () => {})
$.ajax('/api/data')
console.log($.version)
```

## 11. 🤔 什么时候应该使用 namespace？

推荐使用场景

编写类型声明文件

在 `.d.ts` 文件中组织类型定义。

```ts
// jquery.d.ts
declare namespace JQuery {
  interface Options {
    timeout?: number
    async?: boolean
  }

  interface AjaxSettings extends Options {
    url: string
    method?: 'GET' | 'POST'
  }
}

declare function $(selector: string): JQuery.Elements

declare namespace $ {
  function ajax(settings: JQuery.AjaxSettings): Promise<any>
  const version: string

  class Elements {
    addClass(name: string): this
    on(event: string, handler: Function): this
  }
}
```

为全局对象添加类型

```ts
// global.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'
      API_URL: string
      SECRET_KEY: string
    }

    interface Global {
      myCustomProperty: string
    }
  }
}

export {}

// 使用
process.env.NODE_ENV // 有类型提示
process.env.API_URL
```

组织大型类型系统

```ts
// types.d.ts
declare namespace API {
  namespace Request {
    interface GetUser {
      userId: string
    }

    interface CreatePost {
      title: string
      content: string
    }
  }

  namespace Response {
    interface User {
      id: string
      name: string
    }

    interface Post {
      id: string
      title: string
    }
  }
}

// 使用
function getUser(req: API.Request.GetUser): Promise<API.Response.User> {
  // ...
}
```

不推荐使用场景

普通应用代码

```ts
// ❌ 不推荐：使用 namespace
namespace Utils {
  export function formatDate(date: Date): string {
    return date.toISOString()
  }
}

// ✅ 推荐：使用模块
export function formatDate(date: Date): string {
  return date.toISOString()
}
```

可以用模块替代的场景

```ts
// ❌ 不推荐
namespace MathUtils {
  export function add(a: number, b: number): number {
    return a + b
  }

  export function subtract(a: number, b: number): number {
    return a - b
  }
}

// ✅ 推荐
// math.ts
export function add(a: number, b: number): number {
  return a + b
}

export function subtract(a: number, b: number): number {
  return a - b
}

// 或使用对象
export const MathUtils = {
  add(a: number, b: number): number {
    return a + b
  },
  subtract(a: number, b: number): number {
    return a - b
  },
}
```

## 12. 🤔 如何将 namespace 编译为 JavaScript？

编译输出

::: code-group

```ts [TypeScript 源码]
namespace MyNamespace {
  export class MyClass {
    constructor(public value: number) {}

    getValue(): number {
      return this.value
    }
  }

  export function createInstance(value: number): MyClass {
    return new MyClass(value)
  }
}
```

```js [编译后的 JavaScript]
var MyNamespace
;(function (MyNamespace) {
  class MyClass {
    constructor(value) {
      this.value = value
    }
    getValue() {
      return this.value
    }
  }
  MyNamespace.MyClass = MyClass

  function createInstance(value) {
    return new MyClass(value)
  }
  MyNamespace.createInstance = createInstance
})(MyNamespace || (MyNamespace = {}))

// 使用
const instance = new MyNamespace.MyClass(42)
console.log(instance.getValue())
```

:::

嵌套 namespace 的编译

::: code-group

```ts [TypeScript 源码]
namespace Outer {
  export namespace Inner {
    export function helper() {
      console.log('helper')
    }
  }
}
```

```js [编译后的 JavaScript]
var Outer
;(function (Outer) {
  let Inner
  ;(function (Inner) {
    function helper() {
      console.log('helper')
    }
    Inner.helper = helper
  })((Inner = Outer.Inner || (Outer.Inner = {})))
})(Outer || (Outer = {}))
```

:::

多文件 namespace 的编译

::: code-group

```ts [file1.ts]
namespace MyLib {
  export function funcA() {}
}
```

```ts [file2.ts]
namespace MyLib {
  export function funcB() {}
}
```

```js [合并编译]
// 使用 --outFile 选项合并
tsc --outFile output.js file1.ts file2.ts

// output.js
var MyLib
;(function (MyLib) {
  function funcA() {}
  MyLib.funcA = funcA
})(MyLib || (MyLib = {}))

;(function (MyLib) {
  function funcB() {}
  MyLib.funcB = funcB
})(MyLib || (MyLib = {}))
```

:::

## 13. 🤔 常见问题有哪些？

问题 1：namespace 和模块混用

::: code-group

```ts [❌ 错误做法]
// utils.ts
// 同时使用 export 和 namespace
export namespace Utils {
  export function helper() {}
}

// 这会导致混乱的作用域
```

```ts [✅ 正确做法]
// 如果使用模块，就不要用 namespace
// utils.ts
export function helper() {}

// 或者如果必须用 namespace，就不要用 export
// utils.ts
namespace Utils {
  export function helper() {}
}
```

:::

问题 2：无法访问未导出的成员

```ts
namespace MyNamespace {
  // 未导出
  class PrivateClass {}

  export class PublicClass {
    // ❌ 返回类型引用了未导出的类
    createPrivate(): PrivateClass {
      return new PrivateClass()
    }
  }
}

// ✅ 解决方案 1：导出该类
namespace MyNamespace {
  export class PrivateClass {}

  export class PublicClass {
    createPrivate(): PrivateClass {
      return new PrivateClass()
    }
  }
}

// ✅ 解决方案 2：使用接口
namespace MyNamespace {
  interface IPrivate {}

  class PrivateClass implements IPrivate {}

  export class PublicClass {
    createPrivate(): IPrivate {
      return new PrivateClass()
    }
  }
}
```

问题 3：循环依赖

```ts
// ❌ 可能导致问题
namespace A {
  export function useB() {
    B.doSomething()
  }
}

namespace B {
  export function doSomething() {
    A.useB() // 循环调用
  }
}

// ✅ 解决方案：重构代码避免循环依赖
namespace A {
  export function useB() {
    B.doSomething()
  }
}

namespace B {
  export function doSomething() {
    console.log('执行操作')
  }
}
```

问题 4：与全局变量冲突

```ts
// global.d.ts 中定义了全局 Window 接口
declare global {
  interface Window {
    myLib: any
  }
}

// ❌ 可能与全局对象冲突
namespace Window {
  export function helper() {}
}

// ✅ 使用不同的名称
namespace MyWindow {
  export function helper() {}
}
```

## 14. 🤔 最佳实践是什么？

优先使用 ES6 模块

在新项目中使用模块而不是 namespace。

::: code-group

```ts [❌ 不推荐]
// utils.ts
namespace Utils {
  export function formatDate(date: Date): string {
    return date.toISOString()
  }
}
```

```ts [✅ 推荐]
// utils.ts
export function formatDate(date: Date): string {
  return date.toISOString()
}

// app.ts
import { formatDate } from './utils'
```

:::

只在必要时使用 namespace

在类型声明文件和全局类型定义中使用。

```ts
// ✅ 在声明文件中使用
// types.d.ts
declare namespace API {
  interface User {
    id: string
    name: string
  }

  interface Post {
    id: string
    title: string
  }
}

// ✅ 扩展全局对象
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_KEY: string
    }
  }
}
```

保持 namespace 扁平化

避免过深的嵌套层级。

```ts
// ❌ 过度嵌套
namespace A {
  export namespace B {
    export namespace C {
      export namespace D {
        export class MyClass {}
      }
    }
  }
}

// ✅ 保持扁平
namespace API {
  export class User {}
  export class Post {}
  export class Comment {}
}
```

使用别名简化访问

```ts
namespace VeryLong {
  export namespace SubNamespace {
    export class ImportantClass {}
  }
}

// ✅ 创建别名
import ImportantClass = VeryLong.SubNamespace.ImportantClass

const instance = new ImportantClass()
```

文档化 namespace 的用途

```ts
/**
 * 工具函数命名空间
 * 包含各种辅助函数
 * @deprecated 推荐使用独立的工具模块
 */
namespace Utils {
  /**
   * 格式化日期
   * @param date - 要格式化的日期
   * @returns ISO 格式的日期字符串
   */
  export function formatDate(date: Date): string {
    return date.toISOString()
  }
}
```

渐进式迁移旧代码

如果维护使用 namespace 的旧项目，可以逐步迁移。

```ts
// 第一步：将 namespace 改为模块
// 旧代码
namespace Utils {
  export function helper() {}
}

// 新代码（保持兼容）
export namespace Utils {
  export function helper() {}
}

// 第二步：完全改为模块
export function helper() {}
```

## 15. 🔗 引用

- [TypeScript 官方文档 - Namespaces][1]
- [TypeScript 官方文档 - Namespaces and Modules][2]
- [TypeScript 官方文档 - Declaration Merging][3]

[1]: https://www.typescriptlang.org/docs/handbook/namespaces.html
[2]: https://www.typescriptlang.org/docs/handbook/namespaces-and-modules.html
[3]: https://www.typescriptlang.org/docs/handbook/declaration-merging.html
