# [0197. satisfies 运算符](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0197.%20satisfies%20%E8%BF%90%E7%AE%97%E7%AC%A6)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 `satisfies` 运算符是什么？](#3--satisfies-运算符是什么)
- [4. 🆚 satisfies vs. 类型注解](#4--satisfies-vs-类型注解)
  - [4.1. 类型注解的问题](#41-类型注解的问题)
  - [4.2. satisfies 的优势](#42-satisfies-的优势)
- [5. 🤔 satisfies 的使用场景](#5--satisfies-的使用场景)
  - [5.1. 保留字面量类型](#51-保留字面量类型)
  - [5.2. 验证对象结构](#52-验证对象结构)
  - [5.3. 确保类型覆盖](#53-确保类型覆盖)
- [6. 🤔 satisfies 的高级用法](#6--satisfies-的高级用法)
  - [6.1. 与泛型结合](#61-与泛型结合)
  - [6.2. 与映射类型结合](#62-与映射类型结合)
  - [6.3. 复杂类型验证](#63-复杂类型验证)
- [7. 🤔 satisfies 有哪些注意事项？](#7--satisfies-有哪些注意事项)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- `satisfies` 运算符的基本概念和语法
- `satisfies` 与类型注解的区别
- `satisfies` 的使用场景

## 2. 🫧 评价

在 TS 4.9 中引入的 `satisfies` 运算符，这是一个在类型安全和类型推断之间取得平衡的重要特性。

## 3. 🤔 `satisfies` 运算符是什么？

`satisfies` 运算符用于验证表达式是否符合某个类型，同时保持原有的类型推断。

- `satisfies` 用于验证表达式是否满足某个类型，但不改变推断的类型
- 与类型注解不同，`satisfies` 保留了更精确的类型信息
- 解决了类型注解导致类型信息丢失的问题
- 特别适合需要类型验证但又想保留字面量类型的场景
- 可以用来确保对象包含所有必需的键

```ts
// 语法：expression satisfies Type

const value = { x: 10, y: 20 } satisfies { x: number; y: number }
// value 的类型被推断为 { x: number; y: number }

const point = { x: 10, y: 20 } satisfies Record<string, number>
// point 的类型被推断为 { x: number; y: number }

// 基本示例：
type Color = 'red' | 'green' | 'blue'

const color = 'red' satisfies Color // ✅ 通过验证
// color 的类型是 'red'，不是 Color

const invalid = 'yellow' satisfies Color // ❌ 错误：'yellow' 不满足 Color
```

引入背景：在 `satisfies` 出现之前，我们面临两难选择：

```ts
// 问题 1：类型注解会丢失精确类型
type Colors = 'red' | 'green' | 'blue'
const palette: Record<Colors, string> = {
  red: '#ff0000',
  green: '#00ff00',
  blue: '#0000ff',
} as const
const red = palette.red // string（丢失了字面量类型）

// 问题 2：不加注解可能漏掉属性
const palette2 = {
  red: '#ff0000',
  green: '#00ff00',
  // ⚠️ 缺少 blue，但没有错误提示
}

// satisfies 解决了这个问题：

const palette3 = {
  red: '#ff0000',
  green: '#00ff00',
  blue: '#0000ff',
} as const satisfies Record<Colors, string>

const red3 = palette3.red // '#ff0000'（保留字面量类型）

// 缺少属性会报错
const palette4 = {
  red: '#ff0000',
  green: '#00ff00',
  // ❌ 错误：缺少 'blue' 属性
} satisfies Record<Colors, string>
// Type '{ red: string; green: string; }' does not satisfy the expected type 'Record<Colors, string>'.
//   Property 'blue' is missing in type '{ red: string; green: string; }' but required in type 'Record<Colors, string>'.(1360)
```

## 4. 🆚 satisfies vs. 类型注解

### 4.1. 类型注解的问题

类型注解会将变量的类型固定为注解的类型，丢失更精确的信息。

```ts
type RGB = [red: number, green: number, blue: number]

// 使用类型注解
const color1: RGB = [255, 0, 0]
// color1 的类型：RGB（即 [number, number, number]）

color1[0] // number
color1.length // 3（元组长度是已知的）

// 但是字面量值信息丢失了
const red: number = color1[0] // 只知道是 number
```

丢失字面量类型：

```ts
type Status = 'success' | 'error' | 'loading'

// 使用类型注解
const status1: Status = 'success'
// status1 的类型：Status

if (status1 === 'success') {
  // 需要运行时检查
  // ...
}
```

### 4.2. satisfies 的优势

`satisfies` 保留了推断的精确类型，同时确保类型安全。

```ts
// 使用 satisfies
const color2 = [255, 0, 0] satisfies RGB
// color2 的类型：[255, 0, 0]（精确的元组字面量类型）

color2[0] // 255（保留字面量值）

// 保留字面量类型
const status2 = 'success' satisfies Status
// status2 的类型：'success'

if (status2 === 'success') {
  // ✅ TypeScript 知道这总是 true
  // 编译时就能确定
}
```

对比示例：

::: code-group

```ts [类型注解]
type Point = { x: number; y: number }

const p1: Point = { x: 10, y: 20 }
// p1 的类型：{ x: number; y: number }

p1.x // number
```

```ts [satisfies]
const p2 = { x: 10, y: 20 } satisfies Point
// p2 的类型：{ x: number; y: number }（推断）

p2.x // number

// 但如果不用 satisfies
const p3 = { x: 10, y: 20 }
// p3 的类型：{ x: number; y: number }（也是推断）

// satisfies 的价值在于验证
const p4 = { x: 10 } satisfies Point // ❌ 错误：缺少 y
```

:::

## 5. 🤔 satisfies 的使用场景

### 5.1. 保留字面量类型

配置对象：

```ts
type Config = Record<string, string | number | boolean>

const config = {
  host: 'localhost',
  port: 3000,
  debug: true,
} satisfies Config

config.host // 'localhost'（字面量类型）
config.port // 3000（字面量类型）
config.debug // true（字面量类型）

// 如果使用类型注解
const config2: Config = {
  host: 'localhost',
  port: 3000,
  debug: true,
}

config2.host // string | number | boolean（丢失精确类型）
```

路由配置：

```ts
type Route = { path: string; handler: Function }
type Routes = Record<string, Route>

const routes = {
  home: { path: '/', handler: () => {} },
  about: { path: '/about', handler: () => {} },
} satisfies Routes

routes.home.path // '/'（字面量类型）

// 使用类型注解会丢失信息
const routes2: Routes = {
  home: { path: '/', handler: () => {} },
}

routes2.home.path // string
```

### 5.2. 验证对象结构

确保所有属性存在：

```ts
type Features = 'search' | 'filter' | 'sort'
type FeatureFlags = Record<Features, boolean>

const flags = {
  search: true,
  filter: false,
  sort: true,
} satisfies FeatureFlags // ✅

const incomplete = {
  search: true,
  filter: false,
  // ❌ 错误：缺少 'sort'
} satisfies FeatureFlags
```

验证方法签名：

```ts
interface API {
  get(id: string): Promise<any>
  post(data: any): Promise<any>
  delete(id: string): Promise<void>
}

const api = {
  get: async (id: string) => ({}),
  post: async (data: any) => ({}),
  delete: async (id: string) => {},
} satisfies API

// 方法签名错误会被捕获
const badApi = {
  get: async () => ({}), // ❌ 错误：缺少参数
  post: async (data: any) => ({}),
  delete: async (id: string) => {},
} satisfies API
```

### 5.3. 确保类型覆盖

穷尽性检查：

```ts
type Status = 'pending' | 'success' | 'error'

const statusMessages = {
  pending: 'Loading...',
  success: 'Done!',
  error: 'Failed!',
} satisfies Record<Status, string>

// 如果 Status 增加新成员，这里会报错
type Status2 = 'pending' | 'success' | 'error' | 'cancelled'

const messages = {
  pending: 'Loading...',
  success: 'Done!',
  error: 'Failed!',
  // ❌ 错误：缺少 'cancelled'
} satisfies Record<Status2, string>
```

## 6. 🤔 satisfies 的高级用法

### 6.1. 与泛型结合

```ts
function createMap<T extends Record<string, any>>(obj: T) {
  return new Map(Object.entries(obj))
}

const userMap = createMap({
  john: { age: 30 },
  jane: { age: 25 },
} satisfies Record<string, { age: number }>)

// userMap 保留了精确的键
userMap.get('john') // { age: number } | undefined
```

### 6.2. 与映射类型结合

```ts
type EventMap = {
  click: MouseEvent
  keydown: KeyboardEvent
  focus: FocusEvent
}

type Handlers = {
  [K in keyof EventMap]: (event: EventMap[K]) => void
}

const handlers = {
  click: (e) => console.log(e.clientX),
  keydown: (e) => console.log(e.key),
  focus: (e) => console.log(e.target),
} satisfies Handlers

// e 的类型被正确推断
handlers.click // (event: MouseEvent) => void
handlers.keydown // (event: KeyboardEvent) => void
```

### 6.3. 复杂类型验证

```ts
type Validator<T> = {
  [K in keyof T]: (value: T[K]) => boolean
}

interface User {
  name: string
  age: number
  email: string
}

const validators = {
  name: (v) => v.length > 0,
  age: (v) => v >= 0 && v <= 120,
  email: (v) => v.includes('@'),
} satisfies Validator<User>

// 验证器签名被检查
validators.name('test') // boolean
validators.age(25) // boolean
validators.email('a@b.c') // boolean
```

## 7. 🤔 satisfies 有哪些注意事项？

1. 不能用于类型定义

```ts
// ❌ 错误：satisfies 不能用于类型别名
type MyType = string satisfies string;

// ❌ 错误：satisfies 不能用于接口
interface MyInterface satisfies SomeType {
  // ...
}

// ✅ 正确：只能用于值
const value = 'hello' satisfies string;
```

2. 不改变推断类型

```ts
const value = 'hello' satisfies string
// value 的类型是 'hello'，不是 string

// 如果需要 string 类型，使用类型注解
const value2: string = 'hello'
// value2 的类型是 string
```

3. 与 as 断言的区别

```ts
// as 断言：强制类型转换（不安全）
const value1 = 'hello' as number // ⚠️ 不安全，但编译通过

// satisfies：类型验证（安全）
const value2 = 'hello' satisfies number // ❌ 错误：string 不满足 number

// as 可以覆盖类型系统
const obj = {} as { x: number }
obj.x // number，但运行时是 undefined

// satisfies 不会
const obj2 = {} satisfies { x: number } // ❌ 错误：缺少 x
```

4. 子类型检查

```ts
interface Animal {
  name: string
}

interface Dog extends Animal {
  bark(): void
}

// ✅ Dog 满足 Animal
const dog = {
  name: 'Buddy',
  bark: () => console.log('Woof!'),
} satisfies Animal

// dog 的类型保留了 bark 方法
dog.bark() // ✅

// 但如果使用类型注解
const dog2: Animal = {
  name: 'Buddy',
  bark: () => console.log('Woof!'),
}

dog2.bark() // ❌ 错误：Animal 上不存在 bark
```

5. 联合类型的处理

```ts
type Value = string | number

const val1 = 'hello' satisfies Value
// val1 的类型：'hello'

const val2 = 42 satisfies Value
// val2 的类型：42

// 不会扩展到联合类型
if (typeof val1 === 'string') {
  // ✅ 编译时已知
  // TypeScript 知道这总是 true
}
```

6. 性能考虑

```ts
// ❌ 不好：在循环中使用 satisfies
for (let i = 0; i < 1000; i++) {
  const value = computeValue() satisfies ComplexType
  // 每次迭代都进行类型检查
}

// ✅ 好：在循环外验证
const result = Array.from({ length: 1000 }, () =>
  computeValue()
) satisfies ComplexType[]
```

## 8. 🔗 引用

- [TypeScript 4.9 Release Notes - The satisfies Operator][1]
- [TypeScript Handbook - satisfies][2]
- [TypeScript PR #46827 - The satisfies operator][3]

[1]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator
[2]: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
[3]: https://github.com/microsoft/TypeScript/pull/46827
