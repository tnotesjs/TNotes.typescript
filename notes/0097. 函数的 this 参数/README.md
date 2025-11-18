# [0097. 函数的 this 参数](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0097.%20%E5%87%BD%E6%95%B0%E7%9A%84%20this%20%E5%8F%82%E6%95%B0)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是 this 参数？](#3--什么是-this-参数)
  - [3.1. 基本语法](#31-基本语法)
  - [3.2. 对象方法中的 this](#32-对象方法中的-this)
  - [3.3. 类方法中的 this](#33-类方法中的-this)
- [4. 🤔 将 this 参数约束为 void 类型表示什么意思？](#4--将-this-参数约束为-void-类型表示什么意思)
- [5. 🤔 如何禁止隐式的 this 类型推断？](#5--如何禁止隐式的-this-类型推断)
- [6. 🤔 ThisParameterType 和 OmitThisParameter](#6--thisparametertype-和-omitthisparameter)
  - [6.1. `ThisParameterType<T>`](#61-thisparametertypet)
  - [6.2. `OmitThisParameter<T>`](#62-omitthisparametert)
  - [6.3. 实际应用](#63-实际应用)
- [7. 🤔 箭头函数与 this](#7--箭头函数与-this)
  - [7.1. 箭头函数没有自己的 this](#71-箭头函数没有自己的-this)
  - [7.2. 何时使用普通函数 vs 箭头函数](#72-何时使用普通函数-vs-箭头函数)
- [8. 🤔 常见使用场景](#8--常见使用场景)
  - [8.1. 场景 1：事件处理器](#81-场景-1事件处理器)
  - [8.2. 场景 2：jQuery 插件](#82-场景-2jquery-插件)
  - [8.3. 场景 3：数组方法回调](#83-场景-3数组方法回调)
  - [8.4. 场景 4：装饰器](#84-场景-4装饰器)
  - [8.5. 场景 5：Builder 模式](#85-场景-5builder-模式)
  - [8.6. 场景 6：回调函数库](#86-场景-6回调函数库)
  - [8.7. 场景 7：状态机](#87-场景-7状态机)
- [9. 🤔 常见错误和最佳实践](#9--常见错误和最佳实践)
  - [9.1. 错误 1：箭头函数使用 this 参数](#91-错误-1箭头函数使用-this-参数)
  - [9.2. 错误 2：this 参数位置错误](#92-错误-2this-参数位置错误)
  - [9.3. 错误 3：丢失 this 绑定](#93-错误-3丢失-this-绑定)
  - [9.4. 最佳实践](#94-最佳实践)
- [10. 🔗 引用](#10--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- this 参数的概念和语法
- this 参数的类型注解
- ThisParameterType 工具类型
- OmitThisParameter 工具类型
- 箭头函数与 this 的关系
- 实际应用场景

## 2. 🫧 评价

`this` 参数是 TypeScript 中的特殊参数，用于显式声明函数内部 `this` 的类型。它不是真正的函数参数，而是编译时的类型注解。

JavaScript 中 `this` 的值取决于调用方式，这导致很多运行时错误。TypeScript 的 `this` 参数让你可以：

- 明确 this 的类型
- 在编译时检查 this 的正确性
- 避免 this 绑定错误

`this` 参数的特点：

- 必须是第一个参数
- 只在类型层面存在
- 不影响函数签名（调用时不传递）
- 编译后会被移除

## 3. 🤔 什么是 this 参数？

`this` 参数是函数的第一个参数，用于声明函数内部 `this` 的类型。

- 伪参数：不是真正的参数，只用于类型检查，调用函数时不需要传递 this 参数，当它不存在即可
- 位置约束：必须是第一个参数
- 编译时移除：编译成 JS 后会被删除

```ts
// ❌ 错误：没有 this 参数 - this 类型不明确
function getName1() {
  return this.name // ❌ Error
  // 'this' implicitly has type 'any' because it does not have a type annotation.(2683)
}

// ✅ 正确：使用 this 参数 - 明确 this 的类型
interface User {
  name: string
}

// this: User - 在类型层面明确 this 指向
function getName2(this: User): string {
  return this.name // this 是 User 类型
}

// 调用（this 参数不需要传递）
const user = { name: 'Alice' }
const getName2BindThis = getName2.bind(user) // 绑定 this（值层面）
const foo = getName2BindThis() // 调用时无需传递任何参数
console.log(foo) // 'Alice'
```

### 3.1. 基本语法

函数声明中的 this：

```ts
// 语法：function name(this: Type, ...params) {}
function method(this: Type, param: ParamType): ReturnType {
  // this 的类型是 Type
}
```

函数表达式中的 this：

```ts
interface Database {
  query(sql: string): any[]
}

type QueryFunction = (this: Database, sql: string) => any[]

const query: QueryFunction = function (this: Database, sql: string) {
  return []
}
```

### 3.2. 对象方法中的 this

```ts
// 声明对象方法的 this 类型
interface Person {
  name: string
  age: number
  greet(this: Person): string
}

const person: Person = {
  name: 'Alice',
  age: 25,
  greet(this: Person) {
    return `Hello, I'm ${this.name}` // this 是 Person 类型
  },
}

person.greet() // 'Hello, I'm Alice'

const greet = person.greet // 这么做会导致 greet 丢失 this 绑定

const greetError = greet // 错误的绑定
const greetCorrect = greet.bind(person) // 正确的绑定

// 错误的 this 绑定调用会被检测
greetError() // ❌ Error
// The 'this' context of type 'void' is not assignable to method's 'this' of type 'Person'.(2684)

// 正确的 this 绑定可以正常调用
greetCorrect() // ✅ OK
```

### 3.3. 类方法中的 this

```ts
// 类方法中的 this
class User {
  constructor(public name: string) {}

  // this 参数自动推断为 User
  greet() {
    return `Hello, ${this.name}`
  }

  // 显式声明 this 类型
  introduce(this: User): string {
    return `I'm ${this.name}`
  }
}

const user = new User('Bob')

// this 绑定正常
user.greet() // ✅ OK
user.introduce() // ✅ OK

// 丢失 this 绑定
const greet = user.greet
greet() // ⚠️ 检测不到

// 丢失 this 绑定
const introduce = user.introduce
introduce() // ❌ Error
// The 'this' context of type 'void' is not assignable to method's 'this' of type 'User'.(2684)
```

注意：隐式的 this 会导致 this 丢失的错误调用无法被检测。

## 4. 🤔 将 this 参数约束为 void 类型表示什么意思？

`this: void` 表示函数不应该使用 `this`。

```ts
function standalone(this: void): void {
  console.log('No this here')
  // this.name // ❌ Error: 'this' is of type 'void'
}

// ✅ 可以在任何上下文调用
standalone()

// ❌ 不允许绑定 this
standalone.call({ name: 'test' }) // ❌ Error
// Argument of type '{ name: string; }' is not assignable to parameter of type 'void'.(2345)
```

## 5. 🤔 如何禁止隐式的 this 类型推断？

开启 `noImplicitThis` 配置，会禁止隐式的 this 类型推断。

关闭 `noImplicitThis` 的情况下：

```ts
// tsconfig.json
{
  "compilerOptions": {
    "strict": false, // 关闭严格模式
    "noImplicitThis": false // 关闭 this 类型检查
  }
}

// ✅ 允许没有 this 参数声明 OK
function foo() {
  return this.name // ✅ this 被隐式推断为 any 类型
}
```

开启 `noImplicitThis` 的情况下：

```ts
// tsconfig.json
{
  "compilerOptions": {
    "strict": true, // 启用严格模式
    "noImplicitThis": true // 启用 this 类型检查
  }
}

// ❌ 没有 this 参数声明会报错
function bad() {
  return this.name // ❌ Error
}
// 'this' implicitly has type 'any' because it does not have a type annotation.(2683)

// ✅ 需要显式声明 this 参数类型
function good(this: { name: string }) {
  return this.name
}
```

## 6. 🤔 ThisParameterType 和 OmitThisParameter

### 6.1. `ThisParameterType<T>`

`ThisParameterType<T>` 提取函数类型中 this 参数的类型，若函数类型不含 this 参数则返回 unknown 类型。

```ts
// 可以使用内置的 ThisParameterType 工具类型提取函数的 this 参数类型
// ThisParameterType 工具类型的定义如下：
// type ThisParameterType<T> = T extends (this: infer U, ...args: never) => any ? U : unknown

// 示例：
interface User {
  name: string
}

function greet(this: User): string {
  return `Hello, ${this.name}`
}

type GreetThisType = ThisParameterType<typeof greet>
// TS 推断结果：
// type GreetThisType = User
```

### 6.2. `OmitThisParameter<T>`

```ts
// 可以使用内置工具类型 OmitThisParameter 移除函数的 this 参数
// type OmitThisParameter<T> = unknown extends ThisParameterType<T> ? T : T extends (...args: infer A) => infer R ? (...args: A) => R : T

// 示例：
interface User {
  name: string
}

function greet(this: User, message: string): string {
  return `${message}, ${this.name}`
}

type GreetWithoutThis = OmitThisParameter<typeof greet>
// TS 推断结果：
// type GreetWithoutThis = (message: string) => string

// 应用场景说明：
// 情况 1. 如果函数显式声明了 this 参数类型，那么它在被调用的时候，必须先绑定 this 否则会报错
// 情况 2. 如果被赋值的目标（比如用于回调、高阶函数）不关心或无法提供 this 上下文，就无法完成赋值
// 情况 3. 这种时候就可以使用 OmitThisParameter 来剥离源函数中的 this 参数类型，来完成源函数到目标函数的赋值
const user = { name: 'Alice' }

// 情况 1
// ❌ 没有绑定 this 直接调用会报错
greet('0') // function greet(this: User, message: string): string
// The 'this' context of type 'void' is not assignable to method's 'this' of type 'User'.(2684)

// ✅ 需要先挺定 this，然后再调用
const greet1 = greet.bind(user) // const greet1: (message: string) => string
greet1('1')

// 情况 2
const callback: (message: string) => void = greet

const greet2: GreetWithoutThis = greet.bind(user)
greet2('2')
```

### 6.3. 实际应用

```ts
// 提取和转换函数类型
interface Database {
  query(this: Database, sql: string): any[]
  execute(this: Database, sql: string): void
}

// 提取 this 类型
type DbThis = ThisParameterType<Database['query']> // Database

// 移除 this 参数
type QueryWithoutThis = OmitThisParameter<Database['query']>
// (sql: string) => any[]

// 创建绑定版本
const db: Database = {
  query(sql: string) {
    return []
  },
  execute(sql: string) {},
}

const boundQuery: QueryWithoutThis = db.query.bind(db)
```

## 7. 🤔 箭头函数与 this

### 7.1. 箭头函数没有自己的 this

```ts
// ❌ 箭头函数不能声明 this 参数
const bad = (this: User) => {} // ❌ Error: An arrow function cannot have a 'this' parameter

// 箭头函数继承外层 this
class Component {
  name = 'Component'

  // 普通方法：this 需要绑定
  method() {
    setTimeout(function () {
      console.log(this.name) // ❌ this 可能丢失
    }, 100)
  }

  // 箭头函数：this 自动绑定
  arrowMethod() {
    setTimeout(() => {
      console.log(this.name) // this 是 Component
    }, 100)
  }
}
```

### 7.2. 何时使用普通函数 vs 箭头函数

```ts
class EventEmitter {
  listeners: Function[] = []

  // 箭头函数：保持 this 绑定
  on = (event: string, callback: Function) => {
    this.listeners.push(callback)
  }

  // 普通方法：允许子类覆盖
  emit(event: string, ...args: any[]) {
    this.listeners.forEach((listener) => listener(...args))
  }
}

// 使用箭头函数的好处
const emitter = new EventEmitter()
const { on } = emitter
on('event', () => {}) // this 仍然正确
```

## 8. 🤔 常见使用场景

### 8.1. 场景 1：事件处理器

```ts
// DOM 事件处理器
interface Button {
  text: string
  handleClick(this: Button, event: MouseEvent): void
}

const button: Button = {
  text: 'Click me',
  handleClick(this: Button, event: MouseEvent) {
    console.log(`${this.text} was clicked`)
  },
}

// 正确绑定
const el = document.querySelector('button')
el?.addEventListener('click', button.handleClick.bind(button))

// ❌ 错误：this 丢失
el?.addEventListener('click', button.handleClick)
```

### 8.2. 场景 2：jQuery 插件

```ts
// jQuery 插件的 this 类型
interface JQuery {
  addClass(this: JQuery, className: string): JQuery
  removeClass(this: JQuery, className: string): JQuery
}

// 链式调用
declare const $: (selector: string) => JQuery

$('.button')
  .addClass('active') // this 是 JQuery
  .removeClass('disabled') // this 是 JQuery
```

### 8.3. 场景 3：数组方法回调

```ts
// 数组方法的 thisArg
interface User {
  name: string
  age: number
}

class UserManager {
  users: User[] = []

  filterAdults(this: UserManager): User[] {
    // map 的回调可以指定 this
    return this.users.filter(function (this: UserManager, user) {
      return user.age >= 18
    }, this) // 传递 thisArg
  }

  // 使用箭头函数更简单
  filterAdultsArrow(): User[] {
    return this.users.filter((user) => user.age >= 18)
  }
}
```

### 8.4. 场景 4：装饰器

```ts
// 方法装饰器中的 this
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value

  descriptor.value = function (this: any, ...args: any[]) {
    console.log(`Calling ${propertyKey} with`, args)
    return originalMethod.apply(this, args)
  }
}

class Calculator {
  @log
  add(this: Calculator, a: number, b: number): number {
    return a + b
  }
}
```

### 8.5. 场景 5：Builder 模式

```ts
// 链式调用中的 this
class QueryBuilder {
  private query = ''

  select(this: QueryBuilder, ...fields: string[]): this {
    this.query += `SELECT ${fields.join(', ')}`
    return this
  }

  from(this: QueryBuilder, table: string): this {
    this.query += ` FROM ${table}`
    return this
  }

  where(this: QueryBuilder, condition: string): this {
    this.query += ` WHERE ${condition}`
    return this
  }

  build(this: QueryBuilder): string {
    return this.query
  }
}

// 链式调用
const query = new QueryBuilder()
  .select('id', 'name')
  .from('users')
  .where('age > 18')
  .build()
```

### 8.6. 场景 6：回调函数库

```ts
// 定义回调函数的 this 类型
interface CallbackContext {
  value: number
  increment(): void
}

type Callback = (this: CallbackContext) => void

function withContext(callback: Callback): void {
  const context: CallbackContext = {
    value: 0,
    increment() {
      this.value++
    },
  }
  callback.call(context)
}

// 使用
withContext(function (this: CallbackContext) {
  this.increment()
  console.log(this.value) // 1
})
```

### 8.7. 场景 7：状态机

```ts
// 状态机中的 this
interface State {
  name: string
  enter(this: StateMachine): void
  exit(this: StateMachine): void
}

class StateMachine {
  currentState: State | null = null

  transition(this: StateMachine, newState: State): void {
    if (this.currentState) {
      this.currentState.exit.call(this)
    }
    this.currentState = newState
    newState.enter.call(this)
  }
}

const idleState: State = {
  name: 'idle',
  enter(this: StateMachine) {
    console.log('Entering idle state')
  },
  exit(this: StateMachine) {
    console.log('Exiting idle state')
  },
}
```

## 9. 🤔 常见错误和最佳实践

### 9.1. 错误 1：箭头函数使用 this 参数

```ts
// ❌ 箭头函数不能有 this 参数
const bad = (this: User) => {} // Error

// 使用普通函数
const good = function (this: User) {}

// 或使用箭头函数（继承外层 this）
class Component {
  handler = () => {
    // this 自动是 Component
  }
}
```

### 9.2. 错误 2：this 参数位置错误

```ts
// ❌ this 参数必须是第一个
function bad(name: string, this: User) {} // Error

// this 参数在第一位
function good(this: User, name: string) {}
```

### 9.3. 错误 3：丢失 this 绑定

```ts
class Component {
  name = 'Component'

  // ❌ 方法赋值给变量会丢失 this
  greet(this: Component) {
    return `Hello from ${this.name}`
  }
}

const component = new Component()
const greet = component.greet
greet() // ❌ Error: 'this' is void

// 使用 bind
const boundGreet = component.greet.bind(component)
boundGreet() //

// 使用箭头函数
class Component2 {
  name = 'Component'

  greet = () => {
    return `Hello from ${this.name}`
  }
}
```

### 9.4. 最佳实践

```ts
// 1. 启用 noImplicitThis
{
  "compilerOptions": {
    "noImplicitThis": true
  }
}

// 2. 在需要的地方显式声明 this
function method(this: ExpectedType, ...args: any[]) {
  // 实现
}

// 3. 事件处理器使用箭头函数
class Component {
  // 普通方法会丢失 this
  handleClick() {
    console.log(this)
  }

  // 箭头函数保持 this
  handleClickArrow = () => {
    console.log(this)
  }
}

// 4. 回调函数明确 this 类型
type Callback = (this: Context, ...args: any[]) => void

// 5. 使用 this: void 表示不依赖 this
function standalone(this: void): void {
  // 不使用 this
}

// 6. 链式调用返回 this
class Builder {
  method(this: Builder): this {
    return this
  }
}

// 7. 使用 OmitThisParameter 处理绑定
type BoundMethod = OmitThisParameter<typeof method>

// 8. 文档化 this 的预期
/**
 * 查询数据库
 * @this Database - 必须在 Database 实例上调用
 */
function query(this: Database, sql: string): any[] {
  // 实现
}

// 9. 泛型 this 类型
class Builder {
  method<T extends this>(this: T): T {
    return this
  }
}

// 10. 测试 this 绑定
it('should maintain this binding', () => {
  const obj = {
    method(this: typeof obj) {
      return this
    }
  }

  expect(obj.method()).toBe(obj)
  expect(obj.method.call(obj)).toBe(obj)
})
```

## 10. 🔗 引用

- [TypeScript Handbook - this Parameters][1]
- [TypeScript Handbook - ThisParameterType][2]
- [MDN - this][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function
[2]: https://www.typescriptlang.org/docs/handbook/utility-types.html#thisparametertype
[3]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
