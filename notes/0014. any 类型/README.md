# [0014. any 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0014.%20any%20%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. any 类型是什么？](#3-any-类型是什么)
- [4. TS 会关闭对 any 的类型检查吗？](#4-ts-会关闭对-any-的类型检查吗)
- [5. 实际开发中，通常会在什么场景下主动使用 any 类型呢？](#5-实际开发中通常会在什么场景下主动使用-any-类型呢)
- [6. "any assignability"是什么？](#6-any-assignability是什么)
- [7. TS 会关闭对 any 类型的检查，但是为什么将 any 类型的值赋值给 never 类型还是会触发报错呢？](#7-ts-会关闭对-any-类型的检查但是为什么将-any-类型的值赋值给-never-类型还是会触发报错呢)
- [8. 如何在 IDE 中识别哪些类型被 TS 隐式地推断为了 any 类型呢？](#8-如何在-ide-中识别哪些类型被-ts-隐式地推断为了-any-类型呢)
- [9. TS 对 any 的类型推断是如何处理的？](#9-ts-对-any-的类型推断是如何处理的)
- [10. 关于 any 类型的一些开发建议都有哪些？](#10-关于-any-类型的一些开发建议都有哪些)
- [11. noImplicitAny 配置的作用是？](#11-noimplicitany-配置的作用是)
- [12. any 类型的污染问题是什么？](#12-any-类型的污染问题是什么)
- [13. 空数组会被 TS 推断为什么类型？](#13-空数组会被-ts-推断为什么类型)
- [14. 引用](#14-引用)

<!-- endregion:toc -->

## 1. 本节内容

- any 类型
- any assignability
- any 类型污染问题
- noImplicitAny 配置
- 空数组的类型推断

## 2. 评价

any 类型被很多教程视作兜底类型，告诉不想处理类型错误，就 any 一下，但是这么做会导致很多问题。

如果遇到类型问题就 any 一下，那学习 TS 也就没啥必要了，建议最好还是少用 any。

## 3. any 类型是什么？

- `any` 类型是 TypeScript 中的一种特殊类型，表示没有任何类型限制
- `any` 类型的变量可以被赋予任意类型的值，也可以被赋值给任何其他类型的变量（除了 `never` 类型）
- 从集合论的角度看，`any` 类型可以看作是所有其他类型的全集，包含了所有可能的类型
- TypeScript 将 `any` 类型称为"顶层类型"，意味着它涵盖了所有下层类型
- 使用 `any` 类型虽然可以避免类型检查错误，但会失去 TypeScript 提供的类型安全保障
- 应该尽量避免使用 `any` 类型，否则就失去了使用 TypeScript 的意义

## 4. TS 会关闭对 any 的类型检查吗？

- 变量类型一旦设为 any，TypeScript 实际上会关闭这个变量的类型检查。即使有明显的类型错误，只要句法正确，都不会报错。应该尽量避免使用 any 类型，否则就失去了使用 TypeScript 的意义。
- TypeScript 认为，只要开发者使用了 any 类型，就表示开发者想要自己来处理这些代码，所以就不对 any 类型进行任何限制，怎么使用都可以。
- 不要养成一旦遇到类型报错就 any 一下（过于暴力），可以督促自己多学习下 TypeScript 的类型系统，后边儿会有更 nice 的解决方案！

```ts
let x: any = 'hello'

x(1) // 不报错
x.foo = 100 // 不报错
```

上面示例中，变量 x 的值是一个字符串，但是把它当作函数调用，或者当作对象读取任意属性，TypeScript 编译时都不报错。原因就是 x 的类型是 any，TypeScript 不对其进行类型检查。

## 5. 实际开发中，通常会在什么场景下主动使用 any 类型呢？

实际开发中，any 类型主要适用以下两个场合：

- 场景 1：出于特殊原因，需要关闭某些变量的类型检查，就可以把该变量的类型设为 any。比如"剩余参数"，`console.log()` 可以传入任意数量和类型的参数，此时就需要用到 any 类型。

```ts
interface Console {
  log(...data: any[]): void
}
```

- 场景 2：为了适配以前老的 JavaScript 项目，让代码快速迁移到 TypeScript，可以把变量类型设为 any。有些年代很久的大型 JavaScript 项目，尤其是别人的代码，很难为每一行适配正确的类型，这时你为那些类型复杂的变量加上 any，TypeScript 编译时就不会报错。

对比分析：

- 场景 1：情有可原，这时候使用 any 类型是比较合适的。
- 场景 2：不推荐，如果是迁移 `*.js` 到 `*.ts` 的项目，还有有更好的方案来解决迁移初期因类型检查而出现大量报错的问题。

## 6. "any assignability"是什么？

any assignability 表示 any 类型的可赋值性。

- 🤔 可赋值性是什么？
- 答：简单来讲就是 -> 该类型可以被什么类型赋值，可以赋值给什么类型。

这里刻意用英文来表述，目的是为了跟官方文档保持同步，如果你在 TypeScript 官网中，想要查询某些类型的可赋值性，就可以直接搜 assignability 关键字。

![图 2](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-19-08-46-43.png)

any 类型表示没有任何限制，该类型的变量可以被赋予任意类型的值。从集合论的角度看，any 类型可以看成是所有其他类型的全集，包含了一切可能的类型。TypeScript 将这种类型称为"顶层类型"，意为涵盖了所有下层。

```ts
let x: any

x = 1 // ✅
x = 'foo' // ✅
x = true // ✅
```

上面示例中，变量 x 的类型是 any，就可以被赋值为任意类型的值。

需要注意的是，我们在表述时通常会说 any 是任意类型，可以赋值给其他任何类型。但是，这么描述其实是错误的，any 类型无法赋值给 never 类型。

```ts
const a: any = 1
const x: never = a // ❌
// Type 'any' is not assignable to type 'never'.ts(2322)
```

![图 1](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-19-08-24-14.png)

::: warning 注意

- 网上很多文章对 any 类型的介绍，会直接说 any 类型可以赋值给其他任何类型，并且任意类型也可以赋值给 any 类型。
- 上面这样的说法，其实是不完全正确的。
- ❌ 前半句：any 类型可以赋值给任何类型。 -> 这句话是错的
- ✅ 后半句：任何类型都可以赋值给 any 类型。 -> 这句话是对的

:::

## 7. TS 会关闭对 any 类型的检查，但是为什么将 any 类型的值赋值给 never 类型还是会触发报错呢？

- 在非 strict 模式下，TS 会关闭对 any 的类型检查，是指你可以把 any 类型视作任意类型来使用，比如将 any 类型当做函数 `a()` 或是当做对象 `a.xxx` 使用，都不会触发报错。
- 但任何类型（包括 any）都不能赋值给 never。
- never 是一个特殊的类型，它代表"永远不会出现的值"（即值的空集）。虽然它是一个合法的类型，但没有任何实际的值可以属于 never 类型（除了类型系统内部的 never 本身）。

## 8. 如何在 IDE 中识别哪些类型被 TS 隐式地推断为了 any 类型呢？

在一些 IDE 中（比如在线的 TS Playground），能够直观地看到那些被推断为 any 类型的成员，如果变量被隐式地推断为 any 类型，底部会有 3 个点。

![图 0](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-19-08-23-59.png)

```ts
// 测试程序：
function add(x, y) {
  return x + y
}

add(1, [1, 2, 3])
```

需要注意的是，如果你开启了 noImplicitAny 配置，那么在 TS 推断出 any 类型时就会报错。那就是直接爆红提醒了，而不是像上面这样标注 3 个点来提示你。

## 9. TS 对 any 的类型推断是如何处理的？

对于开发者没有指定类型、TypeScript 必须自己推断类型的那些变量，如果无法推断出类型，TypeScript 就会认为该变量的类型是 any。

需要注意的是，TS 的具体推断行为会受到 TS 配置文件的影响，如果开启了 noImplicitAny 配置，那么在 TS 推断出 any 类型时就会报错。

```ts
function add(x, y) {
  return x + y
}

add(1, [1, 2, 3]) // ✅
```

TS 类型推断的结果如下：

```ts
function add(x: any, y: any): any
```

上述程序不会报错。函数 add() 的参数变量 x 和 y，都没有足够的信息，TypeScript 无法推断出它们的类型，就会认为这两个变量和函数返回值的类型都是 any。后面 TS 就不再对函数 add() 进行类型检查了。

```ts
// xxx.ts
// 给 add 函数的两个参数 x、y 加上类型注解
function add(x: number, y: number) {
  return x + y
}

add(1, [1, 2, 3]) // ❌
// 报错：Argument of type 'number[]' is not assignable to parameter of type 'number'.
```

---

noImplicitAny -> 禁止出现隐式的 any 类型

- TypeScript 提供了一个编译选项 noImplicitAny，打开该选项，只要推断出 any 类型就会报错。
- 比如执行命令 -> `tsc --noImplicitAny xxx.ts`
- 由于该命令使用了 noImplicitAny 编译选项进行编译，这时 `xxx.ts` 中的函数 `add()` 就会报错了。

---

特殊情况 -> var 和 let 命令声明的变量

- 即使打开了 noImplicitAny，使用 let 和 var 命令声明变量，但不赋值也不指定类型，是不会报错的。
- 建议使用 let 和 var 声明变量时，如果不赋值，就一定要显式声明类型，否则可能存在安全隐患。
- const 命令没有这个问题，因为 JavaScript 语言规定 const 声明变量时，必须同时进行初始化（赋值）。

```ts
var x // 不报错
let y // 不报错

// 变量 x 和 y 的类型推断为 any，TS 不会对它进行类型检查
x = 123 // 不报错
x = { foo: 'hello' } // 不报错

const z // 报错
```

- 变量 x 和 y 声明时没有赋值，也没有指定类型，TypeScript 会推断它们的类型为 any。这时即使打开了 noImplicitAny，也不会报错。
- const 命令声明的 z 是不能改变值的，声明时必须同时赋值，否则报错，所以它不存在类型推断为 any 的问题。

## 10. 关于 any 类型的一些开发建议都有哪些？

- 对于那些类型不明显的变量，一定要显式声明类型，防止被推断为 any；
- 始终开启 TS 的 noImplicitAny 配置；
- 使用 let 和 var 声明变量时，如果不赋值，就一定要显式声明类型，否则可能存在安全隐患；

## 11. noImplicitAny 配置的作用是？

- TypeScript 提供了一个编译选项 noImplicitAny，打开该选项，只要推断出 any 类型就会报错。
- 特殊情况：
  - 使用 var、let 声明的变量如果被推断为 any 类型是不会报错的。
  - noImplicitAny 的约束更多体现在「函数参数」的类型约束上，对于「变量」的类型约束起不到多大作用。
- 建议：
  - 始终将 noImplicitAny 配置打开。
  - 使用 let 和 var 声明变量时，如果不赋初始值，就一定要显式声明类型，否则可能存在安全隐患。

```json
{
  "compilerOptions": {
    "noImplicitAny": true
  }
}
```

```ts
function add(x, y) {
  return x + y
}

add(1, [1, 2, 3])

// TS 类型推断的结果如下：
function add(x: any, y: any): any
```

- 关闭 noImplicitAny：上述程序不会报错
- 开启 noImplicitAny：报错：
  - `Parameter 'x' implicitly has an 'any' type.`
  - `Parameter 'y' implicitly has an 'any' type.`

```ts
// 开启 noImplicitAny
var x1
let x2

// TS 类型推断的结果如下：
var x1: any
let x2: any
```

- 虽然 x1、x2 被 TS 推断为了 any 类型，并且我们也打开了 noImplicitAny 配置，但是上述程序并不会报错。这是一种特殊情况，使用 var、let 声明的变量如果被推断为 any 类型是不会报错的，无论是否开启了 noImplicitAny 配置。但是对于 const 声明的变量并不会存在该问题，因为 const 声明的变量必须在声明的同时进行初始化，TS 不会将其隐式地推断为 any 类型。
- 由此可见，noImplicitAny 对于变量被推断为 any 类型，其实没啥实际的约束，使用 var、let 定义的变量在没有赋初值的情况下，依旧会被推断为 any 类型；noImplicitAny 的约束更多时候体现在函数的参数类型上。

```ts
// 开启 noImplicitAny
var x1: number
let x2: string
var x3 // var x3: any 不报错
let x4 // let x4: any 不报错

x3 = 123 // ✅
x4 = { foo: 'hello' } // ✅
// x3、x4 被推断为 any 类型，可以赋任意值。

x1 = 123 // ✅
x2 = 'abc' // ✅

x1 = x2 // ❌
// Type 'string' is not assignable to type 'number'.ts(2322)
```

- 上面示例中，变量 x3 和 x4 声明时没有赋值，也没有指定类型，TypeScript 会推断它们的类型为 any。这时即使打开了 noImplicitAny，也不会报错。
- 建议使用 let 和 var 声明变量时，如果不赋初始值，就一定要显式声明类型，否则可能存在安全隐患。

## 12. any 类型的污染问题是什么？

- any 类型除了关闭类型检查，有一个很大的问题，就是它会"污染"其他变量。
- any 可以赋值给其他任何类型的变量（因为没有类型检查），导致其他变量出错。
- 污染其他具有正确类型的变量，把错误留到运行时，这就是不宜使用 any 类型的另一个主要原因。

```ts
const add: any = (a: number, b: number): number => a + b

// 使用 add 污染 result
const result = add(1, 2) // result 将被推断为 any 类型

result.toUpperCase() // 不报错，因为 result 被 add 污染了
```

- 语句 1. `const add: any = (a: number, b: number): number => a + b` add 函数是 any 类型
- 语句 2. `const result = add(1, 2)`
- 语句 3. `result.toUpperCase()`

2 执行之后，result 被 add 污染了，也成为了 any 类型，因此，上述的 「语句 3」 并不会报错。

```ts
// 下面是推荐的写法：
const add = (a: number, b: number): number => a + b
const result = add(1, 2)
// result 将被推断为 number 类型

result.toUpperCase()
// ❌ 报错：
// Property 'toUpperCase' does not exist on type 'number'.(2339)
// 类型"number"上不存在属性"toUpperCase"。ts(2339)
```

- 由于 `toUpperCase()` 是字符串特有的，数字类型的原型链上默认是不存在这样一个 API 的，应该及时报错，才是我们更希望看到的。

```ts
let x: any = 'hello'
let y: number

// x 污染 y
y = x // 不报错

y * 123 // 不报错
y.toFixed() // 不报错
```

- 上面示例中，变量 x 的类型是 any，实际的值是一个字符串。变量 y 的类型是 number，表示这是一个数值变量，但是它被赋值为 x，这时并不会报错。然后，变量 y 继续进行各种数值运算，TypeScript 也检查不出错误，问题就这样留到运行时才会暴露。

## 13. 空数组会被 TS 推断为什么类型？

没有声明类型的空数组，默认会被 TypeScript 视作一个 any 类型的数组。

如果开启了 strictNullChecks 配置，并且关闭了 noImplicitAny 配置，那么 TypeScript 会将没有声明类型的空数组视作一个 never 类型的数组。否则会被推断为 `any[]`。

::: code-group

```ts [any 数组]
// tsconfig.json 不满足：
// {
//   "compilerOptions": {
//     "strictNullChecks": true,
//     "noImplicitAny": false
//   }
// }

const arr = []

// 等效
// const arr: any[]

arr.push(1, 2, 3) // ok
```

```ts [never 数组]
// tsconfig.json 满足：
// {
//   "compilerOptions": {
//     "strictNullChecks": true,
//     "noImplicitAny": false
//   }
// }

const arr = []

// 等效
// const arr: never[]

arr.push(1, 2, 3) // error
// Argument of type 'number' is not assignable to parameter of type 'never'.
```

:::

## 14. 引用

- [any][2]
- [noImplicitAny][1]

[1]: https://www.typescriptlang.org/docs/handbook/2/basic-types.html#noimplicitany
[2]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any
