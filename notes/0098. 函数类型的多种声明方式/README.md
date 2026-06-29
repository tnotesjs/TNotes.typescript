# [0098. 函数类型的多种声明方式](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0098.%20%E5%87%BD%E6%95%B0%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%A4%9A%E7%A7%8D%E5%A3%B0%E6%98%8E%E6%96%B9%E5%BC%8F)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 3 种声明函数类型的语法分别是？](#3-3-种声明函数类型的语法分别是)
- [4. 3 种不同写法的区别是?](#4-3-种不同写法的区别是)
- [5. 3 种写法的约束程度有区别吗？](#5-3-种写法的约束程度有区别吗)
- [6. 调用签名有啥特点？](#6-调用签名有啥特点)
- [7. 引用](#7-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 3 种声明函数类型的方式及其区别

## 2. 评价

TypeScript 提供了 3 种方式来描述函数类型：

1. 函数类型声明（Parameter Type Annotations + Return Type Annotations）：参数类型注解 + 返回值类型注解
2. 函数类型表达式（Function Type Expression）：使用箭头语法 `=>`
3. 调用签名（Call Signature）：在对象类型中使用方法语法

本节主要介绍上述这 3 种写法的语法及其细微的区别。

## 3. 3 种声明函数类型的语法分别是？

1. 函数类型声明（Parameter Type Annotations + Return Type Annotations）：参数类型注解 + 返回值类型注解
2. 函数类型表达式（Function Type Expression）：使用箭头语法 `=>`
3. 调用签名（Call Signature）：在对象类型中使用方法语法

::: code-group

```ts [1]
// 函数类型声明（Parameter Type Annotations + Return Type Annotations）
function greet(name: string): void {
  console.log('Hello, ' + name.toUpperCase() + '!!')
}
```

```ts [2]
// 函数类型表达式（Function Type Expression）
type Add = (a: number, b: number) => number
const add: Add = (a, b) => a + b
```

```ts [3]
// 调用签名（Call Signature）
// 类型别名形式：
type Add = {
  (a: number, b: number): number
}
// 接口形式：
// interface Add = {
//   (a: number, b: number): number
// }
const add: Add = (a, b) => a + b
```

:::

## 4. 3 种不同写法的区别是?

| 特性 | 函数类型声明 | 函数类型表达式 | 调用签名 |
| --- | --- | --- | --- |
| 语法 | `function(params): Type` | `(params) => ReturnType` | `{ (params): ReturnType }` |
| 位置 | 内嵌 | 分离 | 分离 |
| 简洁性 | ✅ 简洁 | ✅ 简洁 | ❌ 较繁琐 |
| 类型复用 | ❌ 不支持 | ✅ 支持 | ✅ 支持 |
| 添加属性 | ❌ 不支持 | ❌ 不支持 | ✅ 支持 |
| 函数重载 | ✅ 支持 | ❌ 不支持 | ✅ 支持 |
| 构造签名 | ❌ 不支持 | ✅ 支持 | ✅ 支持 |
| 推断能力 | ✅ 强 | ✅ 强 | ✅ 强 |
| 约束强度 | ✅ 强 | ❌ 弱 | ❌ 弱 |
| 适用场景 | 单次使用的函数定义 | 简单的可复用函数类型 | 复杂的可调用对象类型 |

核心区别说明：

1. 函数类型声明：直接在函数定义时标注类型，最常用，缺点是不能复用
2. 函数类型表达式：使用 `=>` 语法，简洁且可复用，适合大多数场景
3. 调用签名：使用 `{}` 包裹，功能最强大，可以描述函数的附加属性和多个重载

决策建议：

- 优先考虑函数类型声明、函数类型表达式
- 只有在需要额外功能时才使用调用签名（属性、重载、构造）
- 避免过度使用调用签名，保持代码简洁性
- 接口 vs 类型别名：两者都可以定义调用签名，选择团队统一的风格即可

## 5. 3 种写法的约束程度有区别吗？

是的，函数类型声明是强约束，其它两个是弱约束。

如果你在开发时发现相同的类型描述，但是出现了不同的表现行为，那么很可能就是你的函数类型声明方式不一致导致的。

这里以 void 返回值类型为例：

```ts
// 函数类型声明 - 强约束
// 必须返回和 void 兼容的类型
function strict(): void {
  return 123 // ❌ Error: Type 'number' is not assignable to type 'void'
}

// 函数类型表达式 - 弱约束
// 可以返回任何值
type VoidFunc = () => void
const voidFn: VoidFunc = () => {
  return 123 // ✅ OK
}

// 调用签名 - 弱约束
// 可以返回任何值
interface VoidFunc2 {
  (): void
}
const voidFn2: VoidFunc = () => {
  return 123 // ✅ OK
}
```

这是 TS 的设计哲学：但凡是你能直接控制的，都应该是强约束，但凡是你可能无法控制的，都应该是弱约束。

举一反三：对象的额外属性检查 - 也是同样的道理。

```ts
type Obj = { a: number }

const obj: Obj = { a: 1 } // ✅ OK
const obj2: Obj = { a: 1, b: 2 } // ❌ Error Object literal may only specify known properties, and 'b' does not exist in type 'Obj'.(2353)
// { a: 1, b: 2 } 这个字面量是你直接写出来的，是你能控制的
// 你必须按照严格的 Obj 类型来书写

const obj3 = { a: 1, b: 2 }
const obj4: Obj = obj3 // ✅ OK
// obj3 这个数据可能来自外部，比如后端接口返回的数据，可能不是你能直接控制的
// 因此，这里会采用宽松的鸭子类型策略来判断兼容性
```

## 6. 调用签名有啥特点？

```ts
// ✅ 1. 可以添加属性
type FuncWithProp = {
  (x: number): number
  description: string
  version: number
}

const func: FuncWithProp = Object.assign((x: number) => x * 2, {
  description: 'Double',
  version: 1,
})

// ✅ 2. 可以有多个调用签名（重载）
type Process = {
  (x: number): number
  (x: string): string
}

// ✅ 3. 可以结合构造签名
type Constructor = {
  new (name: string): { name: string }
  (name: string): string
}
```

## 7. 引用

- [TypeScript Handbook - Function Types][1]
- [TypeScript Handbook - Call Signatures][2]
- [TypeScript Deep Dive - Function Types][3]
- [TypeScript Handbook - Everyday Types - Function][4]

[1]: https://www.typescriptlang.org/docs/handbook/2/functions.html
[2]: https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures
[3]: https://basarat.gitbook.io/typescript/type-system/functions
[4]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#functions
