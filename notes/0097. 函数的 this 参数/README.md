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
- [6. 🤔 和函数的 this 参数类型相关的 TS 内置工具类型都有哪些？](#6--和函数的-this-参数类型相关的-ts-内置工具类型都有哪些)
- [7. 🤔 箭头函数可以声明 this 参数类型吗？](#7--箭头函数可以声明-this-参数类型吗)
- [8. 🤔 关于函数的 this 参数都有哪些最佳实践建议？](#8--关于函数的-this-参数都有哪些最佳实践建议)
- [9. 🔗 引用](#9--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- this 参数的概念和语法
- this 参数的类型注解
- ThisParameterType
- OmitThisParameter
- 箭头函数
- this 参数类型的实践建议

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

## 6. 🤔 和函数的 this 参数类型相关的 TS 内置工具类型都有哪些？

主要有俩：

1. `ThisParameterType<T>` 提取函数类型中 this 参数的类型，若函数类型不含 this 参数则返回 unknown 类型。
2. `OmitThisParameter<T>` 从函数类型中移除 `this` 参数的类型，得到一个不带 `this` 参数的新函数类型，方便在需要普通函数类型的场景中复用带 `this` 的函数签名，通常结合 `.bind` 一起使用。

::: code-group

```ts [1]
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

```ts [2]
// TypeScript 内置工具 OmitThisParameter 的定义：
// type OmitThisParameter<T> = unknown extends ThisParameterType<T>
//   ? T
//   : T extends (...args: infer A) => infer R
//   ? (...args: A) => R
//   : T

interface User {
  name: string
}

function greet(this: User, message: string): string {
  return `${message}，${this.name}`
}

// 提取去掉 this 之后的函数类型
type GreetWithoutThis = OmitThisParameter<typeof greet>
// TS 推断结果：
// type GreetWithoutThis = (message: string) => string

type GreetWithThis = typeof greet
// TS 推断结果：
// type Greet = (this: User, message: string) => string

// 搭配 bind 使用
const greetWithoutThis = greet.bind({ name: 'Alice' })
// const greetWithoutThis: (message: string) => string

// greetWithoutThis 已经经过 bind 处理，this 指向已经确定了，因此无需 this
const foo: GreetWithoutThis = greetWithoutThis
foo('你好') // 你好，Alice

// 如果将无需 this 的 greetWithoutThis 赋值给需要 this 的 GreetWithThis 类型，在调用的时候会报错
const bar: GreetWithThis = greetWithoutThis
bar('你好') // ❌
// The 'this' context of type 'void' is not assignable to method's 'this' of type 'User'.(2684)
```

:::

相关源码 `src/lib/es5.d.ts`：

```ts {1-15,46-51}
/**
 * Extracts the type of the 'this' parameter of a function type, or 'unknown' if the function type has no 'this' parameter.
 */
type ThisParameterType<T> = T extends (this: infer U, ...args: never) => any
  ? U
  : unknown

/**
 * Removes the 'this' parameter from a function type.
 */
type OmitThisParameter<T> = unknown extends ThisParameterType<T>
  ? T
  : T extends (...args: infer A) => infer R
  ? (...args: A) => R
  : T

interface CallableFunction extends Function {
  /**
   * Calls the function with the specified object as the this value and the elements of specified array as the arguments.
   * @param thisArg The object to be used as the this object.
   */
  apply<T, R>(this: (this: T) => R, thisArg: T): R

  /**
   * Calls the function with the specified object as the this value and the elements of specified array as the arguments.
   * @param thisArg The object to be used as the this object.
   * @param args An array of argument values to be passed to the function.
   */
  apply<T, A extends any[], R>(
    this: (this: T, ...args: A) => R,
    thisArg: T,
    args: A
  ): R

  /**
   * Calls the function with the specified object as the this value and the specified rest arguments as the arguments.
   * @param thisArg The object to be used as the this object.
   * @param args Argument values to be passed to the function.
   */
  call<T, A extends any[], R>(
    this: (this: T, ...args: A) => R,
    thisArg: T,
    ...args: A
  ): R

  /**
   * For a given function, creates a bound function that has the same body as the original function.
   * The this object of the bound function is associated with the specified object, and has the specified initial parameters.
   * @param thisArg The object to be used as the this object.
   */
  bind<T>(this: T, thisArg: ThisParameterType<T>): OmitThisParameter<T>

  /**
   * For a given function, creates a bound function that has the same body as the original function.
   * The this object of the bound function is associated with the specified object, and has the specified initial parameters.
   * @param thisArg The object to be used as the this object.
   * @param args Arguments to bind to the parameters of the function.
   */
  bind<T, A extends any[], B extends any[], R>(
    this: (this: T, ...args: [...A, ...B]) => R,
    thisArg: T,
    ...args: A
  ): (...args: B) => R
}
```

`.bind` 的返回值类型就是 `: OmitThisParameter<T>` 类型。

## 7. 🤔 箭头函数可以声明 this 参数类型吗？

箭头函数不能声明 this 参数：

```ts
interface User {
  name: string
}

const bad = (this: User) => {} // ❌ Error
// An arrow function cannot have a 'this' parameter.(2730)
```

## 8. 🤔 关于函数的 this 参数都有哪些最佳实践建议？

```ts
// 1. 启用 noImplicitThis
{
  "compilerOptions": {
    "strict": true, // 启用严格模式
    "noImplicitThis": true // 启用 this 类型检查
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

## 9. 🔗 引用

- [TypeScript Handbook - this Parameters][1]
- [TypeScript Handbook - ThisParameterType][2]
- [MDN - this][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function
[2]: https://www.typescriptlang.org/docs/handbook/utility-types.html#thisparametertype
[3]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
