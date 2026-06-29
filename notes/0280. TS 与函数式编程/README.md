# [0280. TS 与函数式编程](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0280.%20TS%20%E4%B8%8E%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BC%96%E7%A8%8B)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 纯函数的类型表达？](#3-纯函数的类型表达)
  - [3.1. 纯函数定义](#31-纯函数定义)
  - [3.2. 柯里化](#32-柯里化)
- [4. 函数组合？](#4-函数组合)
  - [4.1. Compose 和 Pipe](#41-compose-和-pipe)
- [5. Functor 和 Monad？](#5-functor-和-monad)
  - [5.1. Functor](#51-functor)
  - [5.2. Monad](#52-monad)
- [6. Option/Maybe 类型？](#6-optionmaybe-类型)
  - [6.1. Option 实现](#61-option-实现)
- [7. Result/Either 类型？](#7-resulteither-类型)
  - [7.1. Result 实现](#71-result-实现)
  - [7.2. 实际应用](#72-实际应用)
- [8. 引用](#8-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 纯函数的类型表达
- 函数组合
- Functor 和 Monad
- Option/Maybe 类型
- Result/Either 类型

## 2. 评价

TypeScript 的类型系统非常适合函数式编程。

- 函数是一等公民
- 支持高阶函数
- 类型推断减少样板代码
- 可以实现类型安全的 Monad
- 泛型提供抽象能力

## 3. 纯函数的类型表达？

纯函数通过类型签名表达其行为。

### 3.1. 纯函数定义

```ts
// ✅ 纯函数：相同输入总是产生相同输出，无副作用
function add(a: number, b: number): number {
  return a + b
}

function multiply(a: number, b: number): number {
  return a * b
}

// ✅ 高阶函数
function map<T, U>(fn: (value: T) => U): (array: T[]) => U[] {
  return (array) => array.map(fn)
}

// 使用
const double = (x: number) => x * 2
const doubleAll = map(double)
console.log(doubleAll([1, 2, 3])) // [2, 4, 6]
```

### 3.2. 柯里化

```ts
// ✅ 柯里化函数
function curry<A, B, C>(fn: (a: A, b: B) => C): (a: A) => (b: B) => C {
  return (a) => (b) => fn(a, b)
}

const curriedAdd = curry((a: number, b: number) => a + b)
const add5 = curriedAdd(5)
console.log(add5(3)) // 8

// ✅ 自动柯里化（多参数）
type Curry<P extends any[], R> = P extends [infer First, ...infer Rest]
  ? (arg: First) => Rest extends [] ? R : Curry<Rest, R>
  : R

function autoCurry<P extends any[], R>(fn: (...args: P) => R): Curry<P, R> {
  return ((...args: any[]) => {
    if (args.length >= fn.length) {
      return fn(...(args as P))
    }
    return autoCurry((fn as any).bind(null, ...args))
  }) as any
}

const add3 = (a: number, b: number, c: number) => a + b + c
const curriedAdd3 = autoCurry(add3)
console.log(curriedAdd3(1)(2)(3)) // 6
```

## 4. 函数组合？

将多个函数组合成一个新函数。

### 4.1. Compose 和 Pipe

```ts
// ✅ Compose：从右向左执行
function compose<A, B, C>(f: (b: B) => C, g: (a: A) => B): (a: A) => C {
  return (a) => f(g(a))
}

const addOne = (x: number) => x + 1
const double = (x: number) => x * 2

const addOneThenDouble = compose(double, addOne)
console.log(addOneThenDouble(5)) // 12 ((5 + 1) * 2)

// ✅ Pipe：从左向右执行
function pipe<A, B, C>(f: (a: A) => B, g: (b: B) => C): (a: A) => C {
  return (a) => g(f(a))
}

const doubleThenAddOne = pipe(double, addOne)
console.log(doubleThenAddOne(5)) // 11 ((5 * 2) + 1)

// ✅ 多函数组合
function composeMany<T>(...fns: ((arg: T) => T)[]): (arg: T) => T {
  return fns.reduceRight(
    (prev, curr) => (arg) => curr(prev(arg)),
    (arg) => arg
  )
}

const multiComposed = composeMany(
  (x: number) => x + 1,
  (x) => x * 2,
  (x) => x - 3
)
console.log(multiComposed(10)) // 15 (((10 - 3) * 2) + 1)
```

## 5. Functor 和 Monad？

Functor 和 Monad 是函数式编程的核心概念。

### 5.1. Functor

```ts
// ✅ Functor：可以被 map 的容器
interface Functor<T> {
  map<U>(fn: (value: T) => U): Functor<U>
}

class Box<T> implements Functor<T> {
  constructor(private value: T) {}

  map<U>(fn: (value: T) => U): Box<U> {
    return new Box(fn(this.value))
  }

  getValue(): T {
    return this.value
  }
}

// 使用
const box = new Box(5)
const result = box
  .map((x) => x + 1)
  .map((x) => x * 2)
  .getValue()
console.log(result) // 12
```

### 5.2. Monad

```ts
// ✅ Monad：支持 flatMap 的 Functor
interface Monad<T> extends Functor<T> {
  flatMap<U>(fn: (value: T) => Monad<U>): Monad<U>
}

class Identity<T> implements Monad<T> {
  constructor(private value: T) {}

  map<U>(fn: (value: T) => U): Identity<U> {
    return new Identity(fn(this.value))
  }

  flatMap<U>(fn: (value: T) => Identity<U>): Identity<U> {
    return fn(this.value)
  }

  getValue(): T {
    return this.value
  }
}

// 使用
function divide(a: number, b: number): Identity<number> {
  return new Identity(a / b)
}

const result2 = new Identity(10)
  .flatMap((x) => divide(x, 2))
  .flatMap((x) => divide(x, 5))
  .getValue()
console.log(result2) // 1
```

## 6. Option/Maybe 类型？

处理可能不存在的值。

### 6.1. Option 实现

```ts
// ✅ Option 类型
type Option<T> = { type: 'Some'; value: T } | { type: 'None' }

const Some = <T>(value: T): Option<T> => ({
  type: 'Some',
  value,
})

const None = <T = never>(): Option<T> => ({
  type: 'None',
})

// 工具函数
function map<T, U>(option: Option<T>, fn: (value: T) => U): Option<U> {
  return option.type === 'Some' ? Some(fn(option.value)) : None()
}

function flatMap<T, U>(
  option: Option<T>,
  fn: (value: T) => Option<U>
): Option<U> {
  return option.type === 'Some' ? fn(option.value) : None()
}

function getOrElse<T>(option: Option<T>, defaultValue: T): T {
  return option.type === 'Some' ? option.value : defaultValue
}

// 使用
function findUser(id: number): Option<{ name: string; age: number }> {
  if (id === 1) {
    return Some({ name: 'Tom', age: 25 })
  }
  return None()
}

const user = findUser(1)
const userName = map(user, (u) => u.name)
console.log(getOrElse(userName, 'Unknown')) // "Tom"

const noUser = findUser(999)
const noUserName = map(noUser, (u) => u.name)
console.log(getOrElse(noUserName, 'Unknown')) // "Unknown"
```

## 7. Result/Either 类型？

处理可能失败的操作。

### 7.1. Result 实现

```ts
// ✅ Result 类型
type Result<T, E> = { type: 'Ok'; value: T } | { type: 'Err'; error: E }

const Ok = <T, E = never>(value: T): Result<T, E> => ({
  type: 'Ok',
  value,
})

const Err = <T = never, E = Error>(error: E): Result<T, E> => ({
  type: 'Err',
  error,
})

// 工具函数
function mapResult<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> {
  return result.type === 'Ok' ? Ok(fn(result.value)) : result
}

function flatMapResult<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>
): Result<U, E> {
  return result.type === 'Ok' ? fn(result.value) : result
}

function match<T, E, U>(
  result: Result<T, E>,
  handlers: {
    ok: (value: T) => U
    err: (error: E) => U
  }
): U {
  return result.type === 'Ok'
    ? handlers.ok(result.value)
    : handlers.err(result.error)
}

// 使用
function divide2(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return Err('Division by zero')
  }
  return Ok(a / b)
}

function safeDivide(a: number, b: number, c: number): Result<number, string> {
  return flatMapResult(divide2(a, b), (result) => divide2(result, c))
}

const result3 = safeDivide(100, 2, 5)
console.log(
  match(result3, {
    ok: (value) => `Result: ${value}`,
    err: (error) => `Error: ${error}`,
  })
) // "Result: 10"

const result4 = safeDivide(100, 0, 5)
console.log(
  match(result4, {
    ok: (value) => `Result: ${value}`,
    err: (error) => `Error: ${error}`,
  })
) // "Error: Division by zero"
```

### 7.2. 实际应用

```ts
// ✅ API 调用示例
async function fetchUser(id: number): Promise<Result<User, Error>> {
  try {
    const response = await fetch(`/api/users/${id}`)
    if (!response.ok) {
      return Err(new Error(`HTTP ${response.status}`))
    }
    const data = await response.json()
    return Ok(data)
  } catch (error) {
    return Err(error as Error)
  }
}

interface User {
  id: number
  name: string
  email: string
}

// 使用
async function displayUser(id: number) {
  const result = await fetchUser(id)

  const message = match(result, {
    ok: (user) => `User: ${user.name} (${user.email})`,
    err: (error) => `Failed to fetch user: ${error.message}`,
  })

  console.log(message)
}
```

## 8. 引用

- [Functional Programming in TypeScript][1]
- [fp-ts Library][2]
- [Functors and Monads][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/functions.html
[2]: https://gcanti.github.io/fp-ts/
[3]: https://mostly-adequate.gitbook.io/mostly-adequate-guide/
