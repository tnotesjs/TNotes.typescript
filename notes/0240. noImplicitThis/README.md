# [0240. noImplicitThis](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0240.%20noImplicitThis)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. noImplicitThis 是什么？](#3-noimplicitthis-是什么)
  - [3.1. 基本配置](#31-基本配置)
  - [3.2. 关闭时的行为](#32-关闭时的行为)
  - [3.3. 开启后的行为](#33-开启后的行为)
- [4. 为什么需要这个选项？](#4-为什么需要这个选项)
  - [4.1. this 上下文丢失](#41-this-上下文丢失)
  - [4.2. 回调函数](#42-回调函数)
  - [4.3. 事件处理](#43-事件处理)
- [5. 哪些情况会触发隐式 this？](#5-哪些情况会触发隐式-this)
  - [5.1. 独立函数](#51-独立函数)
  - [5.2. 对象方法的回调](#52-对象方法的回调)
  - [5.3. 高阶函数](#53-高阶函数)
  - [5.4. 工具方法](#54-工具方法)
- [6. 如何正确声明 this 类型？](#6-如何正确声明-this-类型)
  - [6.1. this 参数](#61-this-参数)
  - [6.2. 接口中的 this](#62-接口中的-this)
  - [6.3. 类方法](#63-类方法)
  - [6.4. ThisType 工具类型](#64-thistype-工具类型)
  - [6.5. void this](#65-void-this)
- [7. 使用时需要注意什么？](#7-使用时需要注意什么)
  - [7.1. 箭头函数 vs. 普通函数](#71-箭头函数-vs-普通函数)
  - [7.2. React 组件](#72-react-组件)
  - [7.3. 工具函数库](#73-工具函数库)
  - [7.4. bind/call/apply](#74-bindcallapply)
  - [7.5. 类型守卫中的 this](#75-类型守卫中的-this)
  - [7.6. 装饰器中的 this](#76-装饰器中的-this)
- [8. 引用](#8-引用)

<!-- endregion:toc -->

## 1. 本节内容

- noImplicitThis 的作用
- 隐式 this 的问题
- this 参数
- 箭头函数 vs. 普通函数
- 事件处理中的 this
- 实际应用场景

## 2. 评价

`noImplicitThis` 要求显式声明 this 类型，防止 this 指向错误导致的运行时错误。

- 避免 this 上下文丢失
- 提高代码可预测性
- 是 strict 模式的组成部分
- 对 OOP 风格代码影响较大
- 箭头函数不受影响
- 帮助理解 this 绑定机制

## 3. noImplicitThis 是什么？

`noImplicitThis` 禁止在函数中使用隐式的 `this`，要求显式声明 this 类型。

### 3.1. 基本配置

```json
{
  "compilerOptions": {
    "noImplicitThis": true
  }
}
```

### 3.2. 关闭时的行为

```ts
// noImplicitThis: false
function getName() {
  return this.name // ✅ 允许（this: any）
}

// ⚠️ 运行时可能出错
getName() // undefined
getName.call({ name: 'Alice' }) // "Alice"
```

### 3.3. 开启后的行为

```ts
// noImplicitThis: true
function getName() {
  return this.name // ❌ 错误：'this' 隐式具有类型 'any'
}

// ✅ 正确：显式声明 this
function getName(this: { name: string }) {
  return this.name
}

getName.call({ name: 'Alice' }) // "Alice"
getName() // ❌ 错误：缺少 this 上下文
```

## 4. 为什么需要这个选项？

### 4.1. this 上下文丢失

```ts
// noImplicitThis: false
const obj = {
  name: 'Alice',
  greet() {
    return function () {
      return `Hello, ${this.name}` // ⚠️ this 指向错误
    }
  },
}

const greetFn = obj.greet()
greetFn() // ⚠️ undefined

// noImplicitThis: true
const obj = {
  name: 'Alice',
  greet() {
    return function (this: typeof obj) {
      // ✅ 显式声明
      return `Hello, ${this.name}`
    }
  },
}

// 或使用箭头函数
const obj = {
  name: 'Alice',
  greet() {
    return () => {
      // ✅ 箭头函数继承外层 this
      return `Hello, ${this.name}`
    }
  },
}
```

### 4.2. 回调函数

```ts
// noImplicitThis: false
class Counter {
  count = 0

  increment() {
    setTimeout(function () {
      this.count++ // ⚠️ this 不是 Counter 实例
    }, 1000)
  }
}

// noImplicitThis: true
class Counter {
  count = 0

  increment() {
    setTimeout(function (this: Counter) {
      // ❌ 错误：类型不匹配
      this.count++
    }, 1000)
  }
}

// ✅ 正确：使用箭头函数
class Counter {
  count = 0

  increment() {
    setTimeout(() => {
      this.count++ // ✅ this 是 Counter 实例
    }, 1000)
  }
}
```

### 4.3. 事件处理

```ts
// noImplicitThis: false
class Button {
  label = 'Click me'

  handleClick() {
    console.log(this.label)
  }
}

const button = new Button()
document.addEventListener('click', button.handleClick) // ⚠️ this 丢失

// noImplicitThis: true
class Button {
  label = 'Click me'

  handleClick(this: Button) {
    // ✅ 显式声明
    console.log(this.label)
  }

  attach() {
    // ❌ 错误：类型不兼容
    document.addEventListener('click', this.handleClick)
  }
}

// ✅ 正确：绑定 this
class Button {
  label = 'Click me'

  handleClick = () => {
    // 箭头函数
    console.log(this.label)
  }

  attach() {
    document.addEventListener('click', this.handleClick) // ✅ OK
  }
}
```

## 5. 哪些情况会触发隐式 this？

### 5.1. 独立函数

```ts
// ❌ 错误
function getCount() {
  return this.count // 'this' 隐式具有类型 'any'
}

// ✅ 正确
function getCount(this: { count: number }) {
  return this.count
}
```

### 5.2. 对象方法的回调

```ts
// ❌ 错误
const obj = {
  value: 42,
  getValue() {
    return this.value
  },
  delayedGet() {
    setTimeout(function () {
      console.log(this.value) // 'this' 隐式具有类型 'any'
    }, 1000)
  },
}

// ✅ 正确
const obj = {
  value: 42,
  getValue() {
    return this.value
  },
  delayedGet() {
    setTimeout(() => {
      // 使用箭头函数
      console.log(this.value)
    }, 1000)
  },
}
```

### 5.3. 高阶函数

```ts
// ❌ 错误
function map(this: any[], fn: Function) {
  return this.map(fn)
}

// ✅ 正确
interface ArrayLike<T> {
  map<U>(fn: (item: T) => U): U[]
}

function map<T, U>(this: ArrayLike<T>, fn: (item: T) => U): U[] {
  return this.map(fn)
}
```

### 5.4. 工具方法

```ts
// ❌ 错误
const utils = {
  log() {
    console.log(this) // 'this' 隐式具有类型 'any'
  },
}

// ✅ 正确：明确不需要 this
const utils = {
  log(this: void) {
    // this 类型为 void
    console.log('logging')
  },
}

// ✅ 或使用箭头函数
const utils = {
  log: () => {
    console.log('logging')
  },
}
```

## 6. 如何正确声明 this 类型？

### 6.1. this 参数

```ts
// this 参数是伪参数，不计入实际参数列表
function getFullName(this: { firstName: string; lastName: string }) {
  return `${this.firstName} ${this.lastName}`
}

// ✅ 调用时不传递 this
getFullName.call({ firstName: 'Alice', lastName: 'Wang' })
```

### 6.2. 接口中的 this

```ts
interface Person {
  name: string
  greet(this: Person): string
}

const person: Person = {
  name: 'Alice',
  greet() {
    return `Hello, ${this.name}`
  },
}

const greet = person.greet
greet() // ❌ 错误：缺少 this 上下文
```

### 6.3. 类方法

```ts
class Calculator {
  value = 0

  // ✅ 类方法自动有正确的 this 类型
  add(n: number) {
    this.value += n
    return this
  }

  // ✅ 箭头函数属性
  multiply = (n: number) => {
    this.value *= n
    return this
  }
}
```

### 6.4. ThisType 工具类型

```ts
// 使用 ThisType 指定对象方法的 this 类型
interface Person {
  name: string
  age: number
}

const methods: ThisType<Person> = {
  getName() {
    return this.name // this: Person
  },
  getAge() {
    return this.age // this: Person
  },
}

const person = Object.assign({ name: 'Alice', age: 25 }, methods)
person.getName() // "Alice"
```

### 6.5. void this

```ts
// 函数不应依赖 this
function standalone(this: void, value: number) {
  console.log(value)
  // this 不可用
}

// ✅ 可以独立调用
standalone(42)

// ❌ 错误：不能用 call/apply/bind
standalone.call({ value: 1 }, 42)
```

## 7. 使用时需要注意什么？

### 7.1. 箭头函数 vs. 普通函数

```ts
class Component {
  value = 10

  // ⚠️ 普通方法：this 可能丢失
  normalMethod() {
    return this.value
  }

  // ✅ 箭头函数：this 永远绑定到实例
  arrowMethod = () => {
    return this.value
  }
}

const comp = new Component()

// 普通方法
const fn1 = comp.normalMethod
fn1() // ⚠️ 可能 undefined

// 箭头函数
const fn2 = comp.arrowMethod
fn2() // ✅ 10
```

### 7.2. React 组件

```ts
class MyComponent extends React.Component {
  state = { count: 0 }

  // ⚠️ 普通方法需要绑定
  handleClick() {
    this.setState({ count: this.state.count + 1 })
  }

  componentDidMount() {
    // ❌ 需要绑定
    button.addEventListener('click', this.handleClick.bind(this))
  }

  // ✅ 箭头函数自动绑定
  handleClickArrow = () => {
    this.setState({ count: this.state.count + 1 })
  }

  render() {
    return <button onClick={this.handleClickArrow}>Click</button>
  }
}
```

### 7.3. 工具函数库

```ts
// 不依赖 this 的工具函数
const utils = {
  // ✅ 明确 this: void
  sum(this: void, ...numbers: number[]) {
    return numbers.reduce((a, b) => a + b, 0)
  },

  // ✅ 使用箭头函数
  average: (...numbers: number[]) => {
    return utils.sum(...numbers) / numbers.length
  },
}

// ✅ 可以独立调用
const sum = utils.sum
sum(1, 2, 3) // 6
```

### 7.4. bind/call/apply

```ts
interface Context {
  name: string
}

function greet(this: Context, greeting: string) {
  return `${greeting}, ${this.name}`
}

const context: Context = { name: 'Alice' }

// ✅ 类型安全的调用
greet.call(context, 'Hello') // "Hello, Alice"
greet.apply(context, ['Hi']) // "Hi, Alice"
greet.bind(context)('Hey') // "Hey, Alice"

// ❌ 错误：类型不匹配
greet.call({ age: 25 }, 'Hello')
```

### 7.5. 类型守卫中的 this

```ts
interface Animal {
  name: string
}

interface Dog extends Animal {
  bark(): void
}

function isDog(this: Animal): this is Dog {
  return 'bark' in this
}

const animal: Animal = { name: 'Max' }

if (isDog.call(animal)) {
  animal.bark() // animal: Dog
}
```

### 7.6. 装饰器中的 this

```ts
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value

  descriptor.value = function (this: any, ...args: any[]) {
    console.log(`Calling ${propertyKey}`)
    return originalMethod.apply(this, args) // 保持 this 上下文
  }
}

class Calculator {
  @log
  add(a: number, b: number) {
    return a + b
  }
}
```

## 8. 引用

- [TypeScript noImplicitThis][1]
- [Understanding this in TypeScript][2]
- [Functions and this][3]

[1]: https://www.typescriptlang.org/tsconfig#noImplicitThis
[2]: https://www.typescriptlang.org/docs/handbook/2/classes.html#this-types
[3]: https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function
