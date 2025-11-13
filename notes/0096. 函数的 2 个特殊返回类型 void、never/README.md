# [0096. 函数的 2 个特殊返回类型 void、never](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0096.%20%E5%87%BD%E6%95%B0%E7%9A%84%202%20%E4%B8%AA%E7%89%B9%E6%AE%8A%E8%BF%94%E5%9B%9E%E7%B1%BB%E5%9E%8B%20void%E3%80%81never)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 函数返回值类型为 void 意味着什么？](#3--函数返回值类型为-void-意味着什么)
- [4. 🤔 函数返回值类型为 never 意味着什么？](#4--函数返回值类型为-never-意味着什么)
- [5. 🤔 void 返回类型的特殊规则都有哪些？](#5--void-返回类型的特殊规则都有哪些)
  - [5.1. 规则 1：函数声明中的 void 很严格](#51-规则-1函数声明中的-void-很严格)
  - [5.2. 规则 2：函数类型（也叫函数表达式类型）中的 void 很宽松](#52-规则-2函数类型也叫函数表达式类型中的-void-很宽松)
- [6. 🤔 为什么 void 类型在函数声明和函数表达式中的约束表现存在差异呢？](#6--为什么-void-类型在函数声明和函数表达式中的约束表现存在差异呢)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- void、never 类型的基本概念
- void 返回类型的特殊规则

## 2. 🫧 评价

有关 void 类型和 never 类型的详细说明，可以在 TNotes.typescript 中查阅对应的笔记，有专门介绍它们的笔记。

本节主要介绍在函数返回值类型中，void 和 never 的特殊性。

## 3. 🤔 函数返回值类型为 void 意味着什么？

表示函数没有返回值，或者这个返回值是没有意义的，你不应该使用它。

- `void` 是 TS 中表示函数没有返回值的特殊类型。
- 与其他类型不同，`void` 返回类型有一些反直觉的特殊行为：
  - 声明为 `void` 的函数可以返回任何值（但返回值会被忽略）
  - 类型为 `() => void` 的变量可以赋值给返回任何类型的函数（这是为了支持常见的回调函数模式）

```ts
// void 表示函数没有返回值
function log(message: string): void {
  console.log(message)
  // 没有 return 语句，或者 return undefined
}

// ✅ 可以不写 return
function notify(): void {
  alert('Notification')
}

// ✅ 可以 return（不返回值）
function save(): void {
  // 保存数据...
  return
}

// ✅ 可以 return undefined
function clear(): void {
  return undefined
}

// ✅ 可以 return 任何值
const voidFn: () => void = () => {
  return 123 // ✅ 允许
}

// ⚠️ 注意：函数声明不允许返回任何值，要求必须兼容 void 类型
function voidFn2(): void {
  // return 123 // ❌ 报错：Type 'number' is not assignable to type 'void'.(2322)
}
// 这种写法不是函数赋值，因此不会按照函数整体的类型兼容性规则来判断
```

## 4. 🤔 函数返回值类型为 never 意味着什么？

意味着这个函数执行后不会结束，比如抛出错误、或者死循环。

```ts
// void：函数执行完成，但没有返回值
function doSomething(): void {
  console.log('Done')
}

// never：函数永远不会执行完成（抛出错误或无限循环）
function throwError(): never {
  throw new Error('Error')
}

function infiniteLoop(): never {
  while (true) {}
}
```

## 5. 🤔 void 返回类型的特殊规则都有哪些？

### 5.1. 规则 1：函数声明中的 void 很严格

```ts
// ❌ 函数声明：不能返回非 undefined 的值
function strict(): void {
  return 123 // Error: Type 'number' is not assignable to type 'void'
}

// ✅ 只能返回 undefined 或不返回
function correct1(): void {
  return undefined
}

function correct2(): void {
  return // 隐式返回 undefined
}

function correct3(): void {
  // 没有 return 语句
}
```

### 5.2. 规则 2：函数类型（也叫函数表达式类型）中的 void 很宽松

```ts
// ✅ 函数类型：可以返回任何值！
type VoidFunc = () => void

// 这个函数返回 number，但可以赋值给 VoidFunc
const fn: VoidFunc = () => {
  return 123 // ✅ 不报错！
}

const result = fn()
result // 类型：void（但实际值是 123）
```

## 6. 🤔 为什么 void 类型在函数声明和函数表达式中的约束表现存在差异呢？

这一切都是出于历史原因来考量的，在 TS 眼中，函数声明和函数表达式是完全不同的两种写法，处理行为也是不一样的。

```ts
// 场景：数组的 forEach 方法
const numbers = [1, 2, 3]

// forEach 的回调函数类型是 (value: number) => void
numbers.forEach((n) => {
  // ...
  return n * 2 // ✅ 可以返回值，并不会报错，虽然这个返回值毫无意义
})

// forEach 方法的类型定义如下：
// Array<number>.forEach(callbackfn: (value: number, index: number, array: number[]) => void, thisArg?: any): void
// 其中回调函数的类型定义如下：
// callbackfn: (value: number, index: number, array: number[]) => void
```

函数表达式类型通常用于约束一些回调的类型，回调的传递约束会宽松很多，因为很多时候回调是别人定义的，回调的具体类型要求不是我们能控制的，因此 TS 采用了宽松的约束策略，只要我们传入的类型基本满足要求即可。

但是函数声明，这基本上都是我们来控制的，因此采用了更为严格的约束策略。

## 7. 🔗 引用

- [TypeScript Handbook - Functions][1]
- [TypeScript Handbook - void][2]
- [TypeScript Handbook - never][4]
- [TypeScript Deep Dive - void][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/functions.html
[2]: https://www.typescriptlang.org/docs/handbook/2/functions.html#void
[3]: https://basarat.gitbook.io/typescript/type-system/never#void
[4]: https://www.typescriptlang.org/docs/handbook/2/functions.html#never
