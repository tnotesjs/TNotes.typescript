# [0190. extends 条件类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0190.%20extends%20%E6%9D%A1%E4%BB%B6%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是条件类型？](#3--什么是条件类型)
  - [3.1. 基本语法](#31-基本语法)
  - [3.2. extends 的含义](#32-extends-的含义)
- [4. 🤔 条件类型如何使用？](#4--条件类型如何使用)
  - [4.1. 简单条件判断](#41-简单条件判断)
  - [4.2. 泛型约束中的条件类型](#42-泛型约束中的条件类型)
  - [4.3. 嵌套条件类型](#43-嵌套条件类型)
- [5. 🤔 条件类型的实际应用场景](#5--条件类型的实际应用场景)
  - [5.1. 类型过滤](#51-类型过滤)
  - [5.2. 函数重载类型](#52-函数重载类型)
  - [5.3. 提取类型信息](#53-提取类型信息)
- [6. 🤔 条件类型与 infer 如何配合？](#6--条件类型与-infer-如何配合)
  - [6.1. 推断函数返回值](#61-推断函数返回值)
  - [6.2. 推断函数参数](#62-推断函数参数)
  - [6.3. 推断 Promise 值类型](#63-推断-promise-值类型)
- [7. 🤔 条件类型有哪些注意事项？](#7--条件类型有哪些注意事项)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 条件类型的基本语法和 `extends` 关键字含义
- 条件类型的使用方法
- 条件类型的实际应用场景
- 条件类型与 `infer` 的配合使用
- 使用注意事项和最佳实践

## 2. 🫧 评价

这篇笔记详细介绍了 TypeScript 中的条件类型，这是类型系统中非常强大的特性，允许根据类型之间的关系来动态选择类型。

- 条件类型使用 `T extends U ? X : Y` 语法进行类型分支判断
- `extends` 在条件类型中表示类型兼容性检查，而非继承
- 条件类型是实现高级工具类型的基础，如 `Exclude`、`Extract`、`NonNullable` 等
- 结合 `infer` 关键字可以在条件类型中提取类型信息
- 条件类型支持嵌套，可以实现复杂的类型逻辑
- 理解条件类型是掌握 TypeScript 高级类型编程的关键

## 3. 🤔 什么是条件类型？

### 3.1. 基本语法

条件类型允许根据类型之间的关系选择不同的类型，类似于 JavaScript 中的三元运算符。

```typescript
// 语法：T extends U ? X : Y
// 如果 T 可以赋值给 U，则类型为 X，否则为 Y

type IsString<T> = T extends string ? true : false

type A = IsString<string> // type A = true
type B = IsString<number> // type B = false
type C = IsString<'hello'> // type C = true (字面量类型也是 string 的子类型)
```

### 3.2. extends 的含义

在条件类型中，`extends` 表示类型兼容性或子类型关系，不是类继承的意思。

```typescript
// T extends U 意思是：T 可以赋值给 U

// 示例 1：基本类型
type IsNumber<T> = T extends number ? 'yes' : 'no'

type R1 = IsNumber<42> // 'yes'
type R2 = IsNumber<string> // 'no'

// 示例 2：对象类型
interface Animal {
  name: string
}

interface Dog extends Animal {
  bark(): void
}

type IsDog<T> = T extends Dog ? 'dog' : 'not dog'

type R3 = IsDog<Dog> // 'dog'
type R4 = IsDog<Animal> // 'not dog'

// 示例 3：联合类型
type IsStringOrNumber<T> = T extends string | number ? 'yes' : 'no'

type R5 = IsStringOrNumber<string> // 'yes'
type R6 = IsStringOrNumber<number> // 'yes'
type R7 = IsStringOrNumber<boolean> // 'no'
```

**extends 的类型兼容性规则：**

```typescript
// 1. 字面量类型 extends 基本类型
type T1 = 'hello' extends string ? true : false // true
type T2 = 42 extends number ? true : false // true

// 2. 子类型 extends 父类型
type T3 = Dog extends Animal ? true : false // true
type T4 = Animal extends Dog ? true : false // false

// 3. never extends 任何类型
type T5 = never extends string ? true : false // true
type T6 = never extends number ? true : false // true

// 4. 任何类型 extends any
type T7 = string extends any ? true : false // true
type T8 = number extends any ? true : false // true

// 5. any extends unknown
type T9 = any extends unknown ? true : false // true
type T10 = unknown extends any ? true : false // true (特殊情况)
```

## 4. 🤔 条件类型如何使用？

### 4.1. 简单条件判断

**基于类型进行分支：**

```typescript
type TypeName<T> = T extends string
  ? 'string'
  : T extends number
  ? 'number'
  : T extends boolean
  ? 'boolean'
  : T extends undefined
  ? 'undefined'
  : T extends Function
  ? 'function'
  : 'object'

type T1 = TypeName<string> // 'string'
type T2 = TypeName<42> // 'number'
type T3 = TypeName<true> // 'boolean'
type T4 = TypeName<() => void> // 'function'
type T5 = TypeName<{}> // 'object'
```

**检查可选属性：**

```typescript
type HasProperty<T, K extends keyof T> = undefined extends T[K]
  ? 'optional'
  : 'required'

interface User {
  name: string
  age: number
  email?: string
}

type T1 = HasProperty<User, 'name'> // 'required'
type T2 = HasProperty<User, 'email'> // 'optional'
```

### 4.2. 泛型约束中的条件类型

**约束函数参数：**

```typescript
// 只接受数组类型
function getLength<T extends any[]>(arr: T): number {
  return arr.length
}

getLength([1, 2, 3]) // ✅
getLength('hello') // ❌ 类型 "string" 不满足约束 "any[]"

// 使用条件类型优化
type ArrayLength<T> = T extends any[] ? number : never

function getLength2<T>(value: T): ArrayLength<T> {
  if (Array.isArray(value)) {
    return value.length as ArrayLength<T>
  }
  throw new Error('Not an array')
}
```

**条件返回类型：**

```typescript
type ApiResponse<T> = T extends { error: any }
  ? { success: false; error: T['error'] }
  : { success: true; data: T }

function handleResponse<T>(response: T): ApiResponse<T> {
  if ('error' in (response as any)) {
    return { success: false, error: (response as any).error } as ApiResponse<T>
  }
  return { success: true, data: response } as ApiResponse<T>
}
```

### 4.3. 嵌套条件类型

**多层条件判断：**

```typescript
type DeepReadonly<T> = T extends (infer U)[]
  ? ReadonlyArray<DeepReadonly<U>>
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T

interface Person {
  name: string
  address: {
    street: string
    city: string
  }
  hobbies: string[]
}

type ReadonlyPerson = DeepReadonly<Person>
// type ReadonlyPerson = {
//   readonly name: string;
//   readonly address: {
//     readonly street: string;
//     readonly city: string;
//   };
//   readonly hobbies: readonly string[];
// }
```

**复杂类型转换：**

```typescript
type FlattenArray<T> = T extends (infer U)[]
  ? U extends any[]
    ? FlattenArray<U>
    : U
  : T

type T1 = FlattenArray<number[]> // number
type T2 = FlattenArray<number[][]> // number
type T3 = FlattenArray<number[][][]> // number
type T4 = FlattenArray<string> // string
```

## 5. 🤔 条件类型的实际应用场景

### 5.1. 类型过滤

**Exclude 的实现：**

```typescript
type MyExclude<T, U> = T extends U ? never : T

type T1 = MyExclude<'a' | 'b' | 'c', 'a'> // 'b' | 'c'
type T2 = MyExclude<string | number, string> // number
type T3 = MyExclude<1 | 2 | 3, 1 | 2> // 3
```

**Extract 的实现：**

```typescript
type MyExtract<T, U> = T extends U ? T : never

type T1 = MyExtract<'a' | 'b' | 'c', 'a' | 'c'> // 'a' | 'c'
type T2 = MyExtract<string | number, string> // string
type T3 = MyExtract<1 | 2 | 3, 2 | 4> // 2
```

**NonNullable 的实现：**

```typescript
type MyNonNullable<T> = T extends null | undefined ? never : T

type T1 = MyNonNullable<string | null> // string
type T2 = MyNonNullable<number | undefined> // number
type T3 = MyNonNullable<string | null | undefined> // string
```

### 5.2. 函数重载类型

**根据参数类型返回不同结果：**

```typescript
function createLogger<T extends 'console' | 'file'>(
  type: T
): T extends 'console' ? ConsoleLogger : FileLogger

function createLogger(type: 'console' | 'file') {
  if (type === 'console') {
    return new ConsoleLogger()
  }
  return new FileLogger()
}

class ConsoleLogger {
  log(message: string) {
    console.log(message)
  }
}

class FileLogger {
  log(message: string) {
    // 写入文件
  }
}

const logger1 = createLogger('console') // ConsoleLogger
const logger2 = createLogger('file') // FileLogger
```

**智能类型推断：**

```typescript
type ParseResult<T> = T extends 'json'
  ? object
  : T extends 'text'
  ? string
  : T extends 'blob'
  ? Blob
  : never

async function fetchData<T extends 'json' | 'text' | 'blob'>(
  url: string,
  type: T
): Promise<ParseResult<T>> {
  const response = await fetch(url)

  if (type === 'json') {
    return response.json() as ParseResult<T>
  } else if (type === 'text') {
    return response.text() as ParseResult<T>
  } else {
    return response.blob() as ParseResult<T>
  }
}

// 使用
const data1 = await fetchData('/api/users', 'json') // object
const data2 = await fetchData('/api/users', 'text') // string
const data3 = await fetchData('/api/file', 'blob') // Blob
```

### 5.3. 提取类型信息

**提取数组元素类型：**

```typescript
type ElementType<T> = T extends (infer U)[] ? U : never

type T1 = ElementType<string[]> // string
type T2 = ElementType<number[]> // number
type T3 = ElementType<(string | number)[]> // string | number
```

**提取对象值类型：**

```typescript
type ValueOf<T> = T extends { [key: string]: infer U } ? U : never

interface User {
  name: string
  age: number
  active: boolean
}

type UserValue = ValueOf<User> // string | number | boolean
```

**提取构造函数类型：**

```typescript
type ConstructorParameters<T> = T extends new (...args: infer P) => any
  ? P
  : never

class Person {
  constructor(name: string, age: number) {}
}

type PersonParams = ConstructorParameters<typeof Person> // [string, number]
```

## 6. 🤔 条件类型与 infer 如何配合？

### 6.1. 推断函数返回值

```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

function getString(): string {
  return 'hello'
}

function getNumber(): number {
  return 42
}

type T1 = ReturnType<typeof getString> // string
type T2 = ReturnType<typeof getNumber> // number
```

### 6.2. 推断函数参数

```typescript
type Parameters<T> = T extends (...args: infer P) => any ? P : never

function add(a: number, b: number): number {
  return a + b
}

type AddParams = Parameters<typeof add> // [a: number, b: number]

// 使用推断的参数类型
function wrapper(...args: AddParams) {
  return add(...args)
}
```

### 6.3. 推断 Promise 值类型

```typescript
type Awaited<T> = T extends Promise<infer U> ? U : T

type T1 = Awaited<Promise<string>> // string
type T2 = Awaited<Promise<number>> // number
type T3 = Awaited<string> // string

// 处理嵌套 Promise
type DeepAwaited<T> = T extends Promise<infer U> ? DeepAwaited<U> : T

type T4 = DeepAwaited<Promise<Promise<string>>> // string
```

**实际应用：**

```typescript
async function fetchUser(): Promise<{ id: number; name: string }> {
  const response = await fetch('/api/user')
  return response.json()
}

type User = Awaited<ReturnType<typeof fetchUser>>
// type User = {
//   id: number;
//   name: string;
// }
```

## 7. 🤔 条件类型有哪些注意事项？

**1. 分布式条件类型**

当条件类型作用于联合类型时，会自动分发：

```typescript
type ToArray<T> = T extends any ? T[] : never

type T1 = ToArray<string | number>
// 分发：ToArray<string> | ToArray<number>
// 结果：string[] | number[]

// 阻止分发：使用元组包裹
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never

type T2 = ToArrayNonDist<string | number>
// 结果：(string | number)[]
```

**2. never 的特殊行为**

```typescript
type Test<T> = T extends string ? true : false

type T1 = Test<never> // never (而不是 false)

// 原因：never 是空联合类型，分发后得到 never
// 解决：使用元组包裹
type TestFixed<T> = [T] extends [string] ? true : false
type T2 = TestFixed<never> // false
```

**3. extends 不是严格相等**

```typescript
// extends 检查的是兼容性，不是相等性
type T1 = 'hello' extends string ? true : false // true
type T2 = string extends 'hello' ? true : false // false

// 检查是否完全相等
type IsExact<T, U> = [T] extends [U] ? ([U] extends [T] ? true : false) : false

type T3 = IsExact<string, string> // true
type T4 = IsExact<string, 'hello'> // false
```

**4. 条件类型的延迟求值**

```typescript
type TypeName<T> = T extends string
  ? 'string'
  : T extends number
  ? 'number'
  : 'other'

// 在泛型中，类型参数未知时不会立即求值
function getName<T>(value: T): TypeName<T> {
  // TypeScript 无法在这里确定具体类型
  if (typeof value === 'string') {
    return 'string' as TypeName<T>
  }
  if (typeof value === 'number') {
    return 'number' as TypeName<T>
  }
  return 'other' as TypeName<T>
}
```

**5. 循环引用问题**

```typescript
// ❌ 错误：类型实例化过深
type InfiniteNest<T> = {
  value: T
  next: InfiniteNest<T>
}

// ✅ 正确：添加终止条件
type FiniteNest<T, Depth extends number = 5> = Depth extends 0
  ? T
  : {
      value: T
      next: FiniteNest<T, Prev<Depth>>
    }

type Prev<T extends number> = T extends 0 ? 0 : [-1, 0, 1, 2, 3, 4, 5][T]
```

**6. 性能考虑**

```typescript
// ❌ 不好：复杂的嵌套条件类型可能影响性能
type Complex<T> = T extends A
  ? T extends B
    ? T extends C
      ? T extends D
        ? T extends E
          ? Result1
          : Result2
        : Result3
      : Result4
    : Result5
  : Result6

// ✅ 好：简化逻辑，使用辅助类型
type Helper1<T> = T extends A ? (T extends B ? T : never) : never
type Helper2<T> = T extends C ? (T extends D ? T : never) : never
type Simplified<T> = Helper1<T> | Helper2<T>
```

## 8. 🔗 引用

- [TypeScript Handbook - Conditional Types][1]
- [TypeScript Handbook - Type Inference in Conditional Types][2]
- [TypeScript Handbook - Distributive Conditional Types][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
[2]: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types
[3]: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
