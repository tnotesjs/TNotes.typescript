# [0190. extends 条件类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0190.%20extends%20%E6%9D%A1%E4%BB%B6%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 `extends` 是什么？](#3--extends-是什么)
- [4. 🤔 条件类型是什么？](#4--条件类型是什么)
- [5. 🤔 条件类型与 infer 如何配合？](#5--条件类型与-infer-如何配合)
  - [5.1. 推断函数返回值](#51-推断函数返回值)
  - [5.2. 推断函数参数](#52-推断函数参数)
  - [5.3. 推断 Promise 值类型](#53-推断-promise-值类型)
- [6. 🤔 条件类型有哪些注意事项？](#6--条件类型有哪些注意事项)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 条件类型的基本语法和 `extends` 关键字含义
- 条件类型的使用方法
- 条件类型的实际应用场景
- 条件类型与 `infer` 的配合使用
- 使用注意事项和最佳实践

## 2. 🫧 评价

TS 条件类型是通过 `extends` 检查一个类型是否满足约束，然后根据结果为 `true` 或 `false` 选择不同类型分支的类型运算技术。

`extends` 并非 TS 特有的，在 JS 中也存在这个关键字，主要用于表示类之间的继承关系，在 TS 中，对 `extends` 关键字进行了扩展，除了表达类的继承关系之外，它可以用于类型约束。

## 3. 🤔 `extends` 是什么？

`extends` 关键字在 TS 中有两层含义：

1. JS 运行时层面 - 类继承
2. TS 类型系统层面 - 类型约束条件

::: code-group

```ts [1]
// JS 层面 - 运行时层面的 extends（类继承）
class Animal {
  name: string

  constructor(name: string) {
    this.name = name
  }

  move(distance: number = 0) {
    console.log(`${this.name} moved ${distance}m.`)
  }
}

// Dog 继承 Animal
class Dog extends Animal {
  bark() {
    console.log('Woof! Woof!')
  }
}

const dog = new Dog('Buddy')
dog.move(10) // 继承的方法
dog.bark() // 自己的方法
```

```ts [2]
// TS 层面 - 使用 extends 添加约束条件
// T extends { length: number }
// 这么写表示传入的类型必须具备 length 属性
function logLength<T extends { length: number }>(arg: T): T {
  console.log(arg.length)
  return arg
}

logLength([1, 2, 3]) // ✅ 数组有 length
logLength('hello') // ✅ 字符串有 length
logLength({ length: 5 }) // ✅ 对象有 length 属性
// logLength(42) // ❌ 数字没有 length
```

:::

## 4. 🤔 条件类型是什么？

条件类型允许根据类型之间的关系选择不同的类型，类似于 JavaScript 中的三元运算符。

- 条件类型使用 `T extends U ? X : Y` 语法进行类型分支判断
- `extends` 在条件类型中表示类型兼容性检查，而非继承
- 条件类型是实现高级工具类型的基础，如 `Exclude`、`Extract`、`NonNullable` 等
- 结合 `infer` 关键字可以在条件类型中提取类型信息
- 条件类型支持嵌套，可以实现复杂的类型逻辑

```ts
// 语法：T extends U ? X : Y
// 如果 T 可以赋值给 U，则类型为 X，否则为 Y

type IsString<T> = T extends string ? true : false

// 示例：
type A = IsString<string> // type A = true
type B = IsString<number> // type B = false
type C = IsString<'hello'> // type C = true (字面量类型也是 string 的子类型)
```

在条件类型中，`extends` 表示类型兼容性或子类型关系，不是类继承的意思。比如 `T extends U`，意思是：`T` 可以赋值给 `U`。

```ts
type IsNumber<T> = T extends number ? 'yes' : 'no'

type R1 = IsNumber<42> // type R1 = "yes"
type R2 = IsNumber<string> // type R2 = "no"
```

## 5. 🤔 条件类型与 infer 如何配合？

### 5.1. 推断函数返回值

```ts
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

### 5.2. 推断函数参数

```ts
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

### 5.3. 推断 Promise 值类型

```ts
type Awaited<T> = T extends Promise<infer U> ? U : T

type T1 = Awaited<Promise<string>> // string
type T2 = Awaited<Promise<number>> // number
type T3 = Awaited<string> // string

// 处理嵌套 Promise
type DeepAwaited<T> = T extends Promise<infer U> ? DeepAwaited<U> : T

type T4 = DeepAwaited<Promise<Promise<string>>> // string
```

实际应用：

```ts
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

## 6. 🤔 条件类型有哪些注意事项？

1. 分布式条件类型

当条件类型作用于联合类型时，会自动分发：

```ts
type ToArray<T> = T extends any ? T[] : never

type T1 = ToArray<string | number>
// 分发：ToArray<string> | ToArray<number>
// 结果：string[] | number[]

// 阻止分发：使用元组包裹
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never

type T2 = ToArrayNonDist<string | number>
// 结果：(string | number)[]
```

2. never 的特殊行为

```ts
type Test<T> = T extends string ? true : false

type T1 = Test<never> // never (而不是 false)

// 原因：never 是空联合类型，分发后得到 never
// 解决：使用元组包裹
type TestFixed<T> = [T] extends [string] ? true : false
type T2 = TestFixed<never> // false
```

3. extends 不是严格相等

```ts
// extends 检查的是兼容性，不是相等性
type T1 = 'hello' extends string ? true : false // true
type T2 = string extends 'hello' ? true : false // false

// 检查是否完全相等
type IsExact<T, U> = [T] extends [U] ? ([U] extends [T] ? true : false) : false

type T3 = IsExact<string, string> // true
type T4 = IsExact<string, 'hello'> // false
```

4. 条件类型的延迟求值

```ts
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

5. 循环引用问题

```ts
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

6. 性能考虑

```ts
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

## 7. 🔗 引用

- [TypeScript Handbook - Conditional Types][1]
- [TypeScript Handbook - Type Inference in Conditional Types][2]
- [TypeScript Handbook - Distributive Conditional Types][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
[2]: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types
[3]: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
