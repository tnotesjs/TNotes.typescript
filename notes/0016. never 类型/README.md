# [0016. never 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0016.%20never%20%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. never 类型是什么？](#3-never-类型是什么)
- [4. never 类型的可赋值性是？](#4-never-类型的可赋值性是)
- [5. never 类型可以赋值给其它所有类型吗？](#5-never-类型可以赋值给其它所有类型吗)
- [6. 为什么 never 类型可以赋值给任意其他类型呢？](#6-为什么-never-类型可以赋值给任意其他类型呢)
- [7. never 不能被任何类型赋值吗？](#7-never-不能被任何类型赋值吗)
- [8. never 类型的使用场景主要是？](#8-never-类型的使用场景主要是)
- [9. 空数组在什么情况下会被推断为 `never[]` 类型？](#9-空数组在什么情况下会被推断为-never-类型)
- [10. never 类型与 void 类型的本质区别是什么?](#10-never-类型与-void-类型的本质区别是什么)
- [11. 引用](#11-引用)

<!-- endregion:toc -->

## 1. 本节内容

- never

## 2. 评价

- never 类型 ≈ 空集 ∅

## 3. never 类型是什么？

官方描述：

Some functions never return a value:

```ts
function fail(msg: string): never {
  throw new Error(msg)
}
```

The never type represents values which are never observed. In a return type, this means that the function throws an exception or terminates execution of the program.

never also appears when TypeScript determines there’s nothing left in a union.

```ts
function fn(x: string | number) {
  if (typeof x === 'string') {
    // do something
  } else if (typeof x === 'number') {
    // do something else
  } else {
    x // has type 'never'!
  }
}
```

---

中文翻译：

有些函数永远不会返回值：

```ts
function fail(msg: string): never {
  throw new Error(msg)
}
```

never 类型表示永远无法观察到的值。作为返回类型时，这意味着函数会抛出异常或终止程序的执行。

当 TypeScript 确定联合类型中没有剩余内容时，也会出现 never 类型。

```ts
function fn(x: string | number) {
  if (typeof x === 'string') {
    // 做一些事情
  } else if (typeof x === 'number') {
    // 做其他事情
  } else {
    x // 具有 'never' 类型！
  }
}
```

---

- 为了保持与集合论的对应关系，以及类型运算的完整性，TypeScript 还引入了“空类型”的概念，即该类型为空，不包含任何值。
- 由于不存在任何属于“空类型”的值，所以该类型被称为 never，即不可能有这样的值。

```ts
let x: never
let x2: any
let x3: never

x = 1 // ❌ 报错 - 不能将类型“1”分配给类型“never”。ts(2322)
x = x2 // ❌ 报错 - 不能将类型“any”分配给类型“never”。ts(2322)
x = x3 // ✅ 正确

// 变量 x 的类型是 never，就不可能赋给它任何值，否则都会报错。
// 包括 any 类型也无法赋值给 never 类型。
// 只有 never 类型可以赋值给 never 类型。
```

## 4. never 类型的可赋值性是？

- never 类型可以赋值给其他任何类型
- never 类型不能被任何类型赋值（除了 never 自身）

## 5. never 类型可以赋值给其它所有类型吗？

- 是的
- never 类型的一个重要特点是，可以赋值给任意其他类型。

```ts
function f(): never {
  throw new Error('Error')
}

let v1: number = f() // ✅
let v2: string = f() // ✅
let v3: boolean = f() // ✅

// 上面示例中，函数 f() 会抛出错误，所以返回值类型可以写成 never，即不可能返回任何值。
// 各种其他类型的变量都可以赋值为 f() 的运行结果（never 类型）。

const neverVar = 'never' as unknown as never

const x1: number = neverVar // ✅
const x2: string = neverVar // ✅
const x3: boolean = neverVar // ✅
const x4: symbol = neverVar // ✅
const x5: undefined = neverVar // ✅
const x6: null = neverVar // ✅
const x7: object = neverVar // ✅
const x8: any = neverVar // ✅
const x9: never = neverVar // ✅
// ...
```

## 6. 为什么 never 类型可以赋值给任意其他类型呢？

- 这跟集合论的知识有关 -> 空集是任何集合的子集。
- TypeScript 就相应规定，任何类型都包含了 never 类型。
- 因此，never 类型是任何其他类型所共有的，TypeScript 把这种情况称为“底层类型”（bottom type）。
- 我们可以把 never 视作一个“不存在”的类型，当 never 出现在联合类型中时，它就像一个空集合，不会对联合类型的其他部分产生任何影响。

```ts
type UnionWithNever = 123 | 'abc' | true | void | never
// 将鼠标悬停在 UnionWithNever 上，查看 ts 推导出来的结果：
// type UnionWithNever = true | void | 123 | "abc"
// 会发现 never 类型直接被无视了

// | never 类型在联合类型中会被自动剔除
// 因为运算符 | 表示或者的含义，在集合的语义中，表示“并”
// 并上一个空集，结果不变
```

## 7. never 不能被任何类型赋值吗？

- 严格来说，这么讲是错误的！
- 「never 不能被任何类型赋值」网上很多文章中都会直接这么描述，但是这么说其实不是很准确，正确的说法应该是：「never 不能被除了 never 自身之外的任何类型赋值」。
- 评价：没必要死扣这一点细节。哪怕很多时候我们还是会在一些文章中看到“never 不能接受任意类型”这样的描述，当见到类似的说法时，能够 get 到要点即可。以免被一些“错误描述”误导，这里刻意记录一下。

## 8. never 类型的使用场景主要是？

::: code-group

```ts [1]
// 不可能返回的函数（如抛出异常或无限循环）
function throwError(message: string): never {
  throw new Error(message)
}

function infiniteLoop(): never {
  while (true) {
    // ...
  }
}
```

```ts [2]
// 在类型运算中排除某些类型（保证完整性）
// 定义一个条件类型 NonNullable，用于从类型 T 中排除 null 和 undefined 类型
// 如果 T 是 null 或 undefined 的联合类型，则返回 never（表示不可能的类型）
// 否则返回 T 本身
type NonNullable<T> = T extends null | undefined ? never : T

// 示例：NonNullable<string | null> 会排除 null，结果为 string
type A = NonNullable<string | null> // string

// 示例：NonNullable<undefined> 会排除 undefined，由于没有剩余类型，结果为 never
type B = NonNullable<undefined> // never
```

```ts [3]
// 用于穷尽性检查（exhaustive check）
type Color = 'red' | 'green' | 'blue'

function handleColor(color: Color): string {
  switch (color) {
    case 'red':
      return '🔴'
    case 'green':
      return '🟢'
    case 'blue':
      return '🔵'
    default: {
      // 如果 Color 新增了值而这里没处理，会报错
      const _exhaustiveCheck: never = color
      return _exhaustiveCheck
    }
  }
}

function fn(x: string | number) {
  if (typeof x === 'string') {
    x // x: string;
    // 在此区块中访问时，TS 知道 x 是 string 类型。
    // ...
  } else if (typeof x === 'number') {
    x // x: number;
    // 在此区块中访问时，TS 知道 x 是 number 类型。
    // ...
  } else {
    x // x: never;
    // 排除所有可能的类型后，x 只能是 never 类型。
  }
}
// 参数变量 x 可能是字符串，也可能是数值，判断了这两种情况后，
// 剩下的最后那个 else 分支里面，x 就是 never 类型了。

// 由于 TS 强大的类型分析能力，每经过一个 if 语句处理，x 的类型分支就会减少一个。
// 在最后的 else 代码块中，它的类型只剩下了 never 类型，即一个无法再细分、本质上并不存在的虚空类型。

// 如果一个变量可能有多种类型（即联合类型），通常需要使用分支处理每一种类型。
// 这时，处理所有可能的类型之后，剩余的情况就属于 never 类型。
```

:::

- 【1】在不可能返回值的函数，返回值的类型就可以写成 never
- 【2】在一些类型运算之中，使用 never 保证类型运算的完整性
- 【3】用于穷尽性检查（exhaustive check）

## 9. 空数组在什么情况下会被推断为 `never[]` 类型？

```ts
const arr = []
// const arr: never[]
// 或者 const arr: any[]
// 具体看 TS 配置

// 未标明类型的数组，可能会被推断为 never 类型。
// 前提：开启 strictNullChecks 配置，同时禁用 noImplicitAny 配置
// tsconfig.json
// {
//   "compilerOptions": {
//     "strictNullChecks": true,
//     "noImplicitAny": false
//   }
// }
```

## 10. never 类型与 void 类型的本质区别是什么?

核心区别：

- `void`
  - => 有返回点，但没有返回值
  - => 我执行完了，但我不返回任何有意义的值
- `never`
  - => 永远不会有返回点
  - => 我永远不会执行完，因为我会抛错或无限循环

```ts
// void - 函数正常结束,只是没有返回值
function logMessage(msg: string): void {
  console.log(msg)
  // 函数执行到这里就结束了,会返回到调用点
}

// never - 函数永远不会正常结束
function throwError(msg: string): never {
  throw new Error(msg)
  // 执行到这里就抛出异常,永远不会返回到调用点
}

function infiniteLoop(): never {
  while (true) {
    // 无限循环,永远不会返回
  }
}
```

| 特性     | void                     | never                         |
| -------- | ------------------------ | ----------------------------- |
| 含义     | 函数执行完毕，但不返回值 | 函数永远不会执行完毕          |
| 可赋值性 | 可以被赋值 `undefined`   | 不能被任何类型赋值(除了自身)  |
| 函数执行 | 函数会正常结束           | 函数永远不会结束(抛错/死循环) |
| 类型层级 | 普通类型                 | 底层类型(bottom type)         |

::: code-group

```ts [1]
// void 类型可以接受 undefined
let voidVar: void
voidVar = undefined // ✅ 正确
voidVar = null // ✅ 正确(strictNullChecks: false 时)
// voidVar = 123 // ❌ 错误

// never 类型不能接受任何值(除了 never 自身)
let neverVar: never
// neverVar = undefined // ❌ 错误
// neverVar = null // ❌ 错误
// neverVar = 123 // ❌ 错误
```

```ts [2]
// void 函数可以被正常调用和等待
function voidFunc(): void {
  console.log('done')
}
voidFunc() // 函数会执行完毕并返回
console.log('继续执行') // ✅ 这行代码会执行

// never 函数调用后不会返回
function neverFunc(): never {
  throw new Error('error')
}
neverFunc() // 抛出异常,下面的代码不会执行
console.log('继续执行') // ❌ 这行代码永远不会执行到
```

```ts [3]
// void 可以作为联合类型的一部分
type Result1 = string | void
// type Result1 = string | void

// never 在联合类型中会被忽略
type Result2 = string | never
// type Result2 = string
```

```ts [4]
// void - 用于无返回值的普通函数
function saveData(data: string): void {
  localStorage.setItem('key', data)
  // 函数正常结束
}

// never - 用于永远不会正常返回的函数
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`)
  // 用于穷尽性检查
}
```

:::

- 【1】赋值行为对比
- 【2】函数返回值的实际差异
- 【3】类型推断中的表现
- 【4】实际应用场景对比

## 11. 引用

- [never][1]

[1]: https://www.typescriptlang.org/docs/handbook/2/functions.html#never
