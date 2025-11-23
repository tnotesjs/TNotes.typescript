# [0121. 泛型默认值](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0121.%20%E6%B3%9B%E5%9E%8B%E9%BB%98%E8%AE%A4%E5%80%BC)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是泛型默认值？](#3--什么是泛型默认值)
- [4. 🤔 在什么情况下，泛型会使用默认值？](#4--在什么情况下泛型会使用默认值)
- [5. 🤔 泛型参数的默认值是否可以引用另一个泛型参数？](#5--泛型参数的默认值是否可以引用另一个泛型参数)
- [6. 🤔 带有默认值的泛型参数的位置有什么要求？](#6--带有默认值的泛型参数的位置有什么要求)
- [7. 🤔 泛型参数的默认值可以跟泛型约束一并使用吗？](#7--泛型参数的默认值可以跟泛型约束一并使用吗)
- [8. 🤔 如何定义条件默认值？](#8--如何定义条件默认值)
- [9. 🔗 引用](#9--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 泛型默认值的概念和语法
- 默认泛型参数的位置要求
- 默认值与约束的组合使用
- 使用默认值的判断机制
- 动态的条件默认值

## 2. 🫧 评价

泛型默认值（Generic Default Parameters）允许为类型参数指定默认类型。

## 3. 🤔 什么是泛型默认值？

泛型默认值允许为泛型参数指定默认类型，当使用时若无法根据已知信息推断出类型参数的类型时，则使用默认值。

无默认值：必须指定类型

```ts
interface Container<T> {
  value: T
}

const box: Container = { value: 42 } // ❌ Error: 需要类型参数
// Generic type 'Container<T>' requires 1 type argument(s).(2314)
```

有默认值：可以省略类型参数

```ts
interface Box<T = any> {
  value: T
}

const box1: Box = { value: 42 } // T 默认为 any
const box2: Box<number> = { value: 42 } // 明确指定为 number
const box3: Box<string> = { value: 'hello' } // 明确指定为 string
```

## 4. 🤔 在什么情况下，泛型会使用默认值？

“❌ 若不提供类型参数则使用默认值” —— 这种说法并不十分严谨，因为在“显式声明类型”和“省略类型声明”的中间还有一层类型推断。更加准确一些的说法应该是 “✅ 若无法根据已知信息推断出类型参数的类型时，则使用默认值”。

优先级：显式声明 > 类型推断 > 默认值

```ts
function wrap<T = string>(value: T): T {
  return value
}

// 1. 显式声明
const wrapped1 = wrap<string>(42 as any) // T 为 string

// 2. 类型推断
const wrapped2 = wrap('hello') // T 推断为 'hello'
const wrapped3 = wrap(42) // T 推断为 42

let wrapped4 = wrap('hello') // T 推断为 string
let wrapped5 = wrap(42) // T 推断为 number

// ⚠️ 仔细观察你会发现，上述提供的泛型默认值确实起不到什么作用！
// 因为 wrap 函数的调用必须传递实参 value
// 在 TS 中，每个值都是有类型的
// TS 会将 value 的类型传给 T，也就是说 T 不可能为空，也就不可能会启用默认值

// 在这个例子中，如果要让泛型定义的默认值有意义，需要函数参数也有默认值。
function wrapWithDefault<T = string>(value?: T): T | undefined {
  return value
}

const wrapped6 = wrapWithDefault() // T 使用默认值 string | undefined
const wrapped7 = wrapWithDefault('hello') // T 推断为 'hello' | undefined
const wrapped8 = wrapWithDefault<number>() // T 为 number | undefined
```

## 5. 🤔 泛型参数的默认值是否可以引用另一个泛型参数？

可以。

```ts
// 部分参数有默认值
interface KeyValueStore<K, V = K> {
  get(key: K): V | undefined
  set(key: K, value: V): void
}

// V 默认与 K 相同
const store1: KeyValueStore<string> = {
  get(key) {
    return key
  },
  set(key, value) {},
}

// 明确指定不同的 V
const store2: KeyValueStore<string, number> = {
  get(key) {
    return 0
  },
  set(key, value) {},
}
```

在上述示例中，`V = K` 表示泛型 V 使用的默认值是泛型参数 K 的类型。

## 6. 🤔 带有默认值的泛型参数的位置有什么要求？

所有带有默认值的泛型参数必须位于必填的泛型参数之后。

```ts
// 有默认值的参数必须在后面
interface Valid<T, U = string> {
  first: T
  second: U
}

// ❌ 不能在前面的参数后添加必需参数
// interface Invalid<T = string, U> {  // ❌ Error
//   first: T
//   second: U
// }
// 报错信息：
// Required type parameters may not follow optional type parameters.(2706)

// 所有带有默认值的泛型参数必须位于必填的泛型参数之后
interface Correct<T, U = string, V = number> {
  first: T
  second: U
  third: V
}
```

## 7. 🤔 泛型参数的默认值可以跟泛型约束一并使用吗？

可以，前提是默认值必须满足约束。

```ts
interface Lengthwise {
  length: number
}

// 默认值必须满足约束
// 比如这里的 string 类型，就满足 Lengthwise 接口约束
interface Container<T extends Lengthwise = string> {
  value: T
  getLength(): number
}

// number 不满足 Lengthwise 接口约束，会报错。
// interface Container2<T extends Lengthwise = number> { // ❌ Error
//   value: T
//   getLength(): number
// }
// 报错信息：
// Type 'number' does not satisfy the constraint 'Lengthwise'.(2344)

const container1: Container = {
  value: 'hello', // string 满足 Lengthwise
  getLength() {
    return this.value.length
  },
}

const container2: Container<number[]> = {
  value: [1, 2, 3],
  getLength() {
    return this.value.length
  },
}
```

## 8. 🤔 如何定义条件默认值？

泛型默认值可以使用条件类型，根据泛型参数的类型动态决定默认值。

```ts
// 条件默认值
type DefaultType<T> = T extends string ? string[] : T[]

interface Container<T, U = DefaultType<T>> {
  value: T
  list: U
}

// T 是 string，U 默认为 string[]
const container1: Container<string> = {
  value: 'hello',
  list: ['a', 'b', 'c'], // string[]
}

// T 是 number，U 默认为 number[]
const container2: Container<number> = {
  value: 42,
  list: [1, 2, 3], // number[]
}

// 显式指定 U，覆盖默认值
const container3: Container<string, Set<string>> = {
  value: 'hello',
  list: new Set(['a', 'b']), // Set<string>
}
```

三目运算符 `? :` 的运算也支持嵌套，实现更复杂的条件默认值。

```ts
// 根据类型特征决定默认值
type SmartDefault<T> = T extends (...args: any[]) => any
  ? ReturnType<T> // 如果是函数，默认为返回值类型
  : T extends Array<infer U>
  ? U // 如果是数组，默认为元素类型
  : T // 否则就是 T 本身

interface Wrapper<T, U = SmartDefault<T>> {
  input: T
  output: U
}

// T 是函数，U 默认为返回值类型
const wrapper1: Wrapper<() => number> = {
  input: () => 42,
  output: 100, // number
}

// T 是数组，U 默认为元素类型
const wrapper2: Wrapper<string[]> = {
  input: ['a', 'b'],
  output: 'c', // string
}

// T 是普通类型，U 就是 T
const wrapper3: Wrapper<boolean> = {
  input: true,
  output: false, // boolean
}
```

实际应用场景示例：API 响应包装器

```ts
type ApiData<T> = T extends { data: infer D } ? D : T
// 解释说明：
// T extends { data: ... }：检查类型 T 是否包含 data 属性
// infer D：如果 T 有 data 属性，就推断出 data 的类型，并将其赋值给临时类型变量 D
// ? D   // 如果 T 有 data 属性，返回 data 的类型 D
// : T   // 否则，返回 T 本身

interface ApiResponse<T, D = ApiData<T>> {
  raw: T
  data: D
  timestamp: number
}

// T 有 data 属性，D 默认提取 data 的类型
const response1: ApiResponse<{ data: string; code: number }> = {
  raw: { data: 'hello', code: 200 },
  data: 'hello', // string
  timestamp: Date.now(),
}

// T 没有 data 属性，D 默认就是 T
const response2: ApiResponse<number> = {
  raw: 42,
  data: 42, // number
  timestamp: Date.now(),
}
```

## 9. 🔗 引用

- [TypeScript Handbook - Generics][1]
- [TypeScript 3.0 - Generic Parameter Defaults][2]
- [TypeScript Deep Dive - Generics][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/generics.html
[2]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#generic-parameter-defaults
[3]: https://basarat.gitbook.io/typescript/type-system/generics
