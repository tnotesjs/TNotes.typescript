# [0101. 对象索引签名](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0101.%20%E5%AF%B9%E8%B1%A1%E7%B4%A2%E5%BC%95%E7%AD%BE%E5%90%8D)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是索引签名？](#3--什么是索引签名)
- [4. 🤔 索引签名中的 key 和 val 的类型有什么要求？](#4--索引签名中的-key-和-val-的类型有什么要求)
- [5. 🤔 索引签名支持可选吗？](#5--索引签名支持可选吗)
- [6. 🤔 索引签名支持只读吗？](#6--索引签名支持只读吗)
- [7. 🤔 数字索引和字符串索引可以同时出现吗？](#7--数字索引和字符串索引可以同时出现吗)
- [8. 🤔 具名属性和索引签名可以同时存在吗？](#8--具名属性和索引签名可以同时存在吗)
- [9. 🤔 `Record<K, T>` 工具类型有什么用？](#9--recordk-t-工具类型有什么用)
- [10. 🤔 关于对象的索引签名在实际开发中都有哪些建议？](#10--关于对象的索引签名在实际开发中都有哪些建议)
- [11. 🔗 引用](#11--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 索引签名的定义和语法
- 字符串索引签名
- 数字索引签名
- Record 工具类型
- 索引签名与具名属性的结合
- 实际应用场景

## 2. 🫧 评价

索引签名（Index Signature）用于描述动态属性名的对象类型，允许对象拥有任意数量的属性。

索引签名的特点：

- 动态属性：属性名不固定
- 类型约束：所有属性值必须符合指定类型
- 灵活性：适合字典、映射等数据结构
- 类型安全：访问任意属性都有类型检查

## 3. 🤔 什么是索引签名？

索引签名定义了对象可以有任意数量的属性，这些属性的键和值都有特定类型。

- 动态键：属性名在编译时不确定
- 类型约束：所有值必须是指定类型
- 无限属性：可以有任意数量的属性
- 类型安全：访问任何属性都返回指定类型

TypeScript 支持两种索引签名：

1. 字符串索引：`[key: string]: T`
2. 数字索引：`[index: number]: T`

::: code-group

```ts [1]
interface StringMap {
  [key: string]: string
}

const colors: StringMap = {
  red: '#FF0000',
  green: '#00FF00',
  blue: '#0000FF',
  // 可以添加任意字符串键
  yellow: '#FFFF00',
}
```

```ts [2]
interface NumberArray {
  [index: number]: number
}

const fibonacci: NumberArray = {
  0: 0,
  1: 1,
  2: 1,
  3: 2,
  4: 3,
}
```

:::

::: warning ⚠️ 注意

索引签名的名称只起到一个语义提醒的作用，没有任何实际的约束。

- `[key: string]: T`
- `[foo: string]: T`
- `[bar: string]: T`

上述这些写法最终都是等效的，索引名称 key、foo、bar 除了传递语义之外，没有任何实际作用，但是不能省略。

:::

## 4. 🤔 索引签名中的 key 和 val 的类型有什么要求？

- key 只能是 string、number 或 symbol，不能使用其他类型
- val 可以是任意类型

```ts
// key 只能是 string、number 或 symbol，不能使用其他类型
interface ValidKeys {
  [key: string]: any // ✅
  [index: number]: any // ✅
  [sym: symbol]: any // ✅
}

// interface InvalidKeys {
//   [key: boolean]: any // ❌ Error
//   [key: object]: any // ❌ Error
// }

// val 可以是任意类型
interface AnyValue {
  [key: string]: any
}

interface StringValue {
  [key: string]: string
}

interface ComplexValue {
  [key: string]: {
    name: string
    value: number
  }
}

interface UnionValue {
  [key: string]: string | number | boolean
}
```

## 5. 🤔 索引签名支持可选吗？

不支持。

```ts
// 索引签名不支持 ? 修饰符
interface Bad {
  [key: string]?: string  // ❌ Error
}
```

如果确实有需要，你也可以考虑自行封装工具类型来提供支持，比如：

```ts
type PartialRecord<K extends string | number | symbol, T> = {
  [P in K]?: T
}

type Good = PartialRecord<string, string>

const obj: Good = {}
// obj 可以为空，也可以添加其他属性
```

## 6. 🤔 索引签名支持只读吗？

支持。

```ts
// 支持只读索引签名
interface ReadonlyDict {
  readonly [key: string]: string
}

const dict: ReadonlyDict = {
  name: 'Alice',
  city: 'New York',
}

dict.name = 'Bob' // ❌ Error
dict.country = 'USA' // ❌ Error

// 报错：
// Index signature in type 'ReadonlyDict' only permits reading.(2542)
```

## 7. 🤔 数字索引和字符串索引可以同时出现吗？

可以，但是数字索引必须兼容字符串索引。

```ts
// ❌ 数字索引的类型必须是字符串索引类型的子类型
// interface Bad {
//   [index: number]: string // ❌ Error
//   [key: string]: number
// }
// 报错：
// 'number' index type 'string' is not assignable to 'string' index type 'number'.(2413)

// ✅ 数字索引类型必须兼容
interface Good {
  [index: number]: string
  [key: string]: string | number // ✅ OK
}
```

根本原因：JS 中压根就没有数字索引一说，所有的 key 本质上都是 string 类型，比如 `obj[123]` 实际上是 `obj["123"]`，JS 会将数字索引转换为字符串。

## 8. 🤔 具名属性和索引签名可以同时存在吗？

可以，但是具名属性必须兼容索引签名。

```ts
// ❌ 具名属性类型必须兼容索引签名
// interface Bad {
//   [key: string]: number
//   name: string // ❌ Error: 'name' 的类型不兼容
// }
// 报错：
// Property 'name' of type 'string' is not assignable to 'string' index type 'number'.(2411)

// ✅ 具名属性兼容索引签名
interface Good {
  [key: string]: number | string
  name: string // ✅
  age: number // ✅
}
```

## 9. 🤔 `Record<K, T>` 工具类型有什么用？

`Record<K, T>` 可以用于创建键值对类型。

```ts
type Dictionary = Record<string, string>
// TS 推断结果：
// type Dictionary = {
//     [x: string]: string;
// }

// 使用示例：
const colors: Record<string, string> = {
  red: '#FF0000',
  green: '#00FF00',
  blue: '#0000FF',
}
```

Record 的实现原理：

```ts
type Record<K extends keyof any, T> = { [P in K]: T }
```

Record 在实际使用时，可以限定键的范围，实现比索引类型更加精细的键约束。

```ts
// 使用字面量类型限定键
type Status = 'pending' | 'success' | 'error'

type StatusMessages = Record<Status, string>
// TS 推断结果：
// type StatusMessages = {
//     pending: string;
//     success: string;
//     error: string;
// }

const messages: StatusMessages = {
  pending: 'Loading...',
  success: 'Success!',
  error: 'Error occurred',
}

// ❌ 缺少键会报错
const bad: StatusMessages = {
  pending: 'Loading...',
  success: 'Success!',
  // Error: Property 'error' is missing
}
```

Record vs 索引签名

::: code-group

```ts [索引签名]
// 索引签名：键可以是任意字符串
interface Dictionary {
  [key: string]: string
}

const dict: Dictionary = {
  a: 'A',
  b: 'B',
  anyKey: 'value', // ✅ 可以是任意键
}
```

```ts [Record]
// Record：键必须是指定的字面量
type ABC = Record<'a' | 'b' | 'c', string>

const abc: ABC = {
  a: 'A',
  b: 'B',
  c: 'C',
  // d: 'D'  // ❌ Error: 键必须是 'a' | 'b' | 'c'
}
```

:::

## 10. 🤔 关于对象的索引签名在实际开发中都有哪些建议？

```ts
// ✅ 1. 使用 Record 限定键的范围
type Status = 'idle' | 'loading' | 'success' | 'error'
type StatusMap = Record<Status, string>

// ✅ 2. 为值提供具体类型
interface Config {
  [key: string]: string | number | boolean
}

// ✅ 3. 结合具名属性确保必需字段
interface Options {
  [key: string]: any
  host: string // 必需
  port: number // 必需
}

// ✅ 4. 使用泛型增加灵活性
interface Dictionary<T> {
  [key: string]: T
}

const strings: Dictionary<string> = { a: 'A' }
const numbers: Dictionary<number> = { a: 1 }

// ✅ 5. 只读索引签名保护数据
interface ReadonlyCache {
  readonly [key: string]: any
}

// ✅ 6. 文档化索引签名的用途
/**
 * 用户配置
 * @property host - 服务器地址
 * @property port - 端口号
 * @property [key: string] - 其他配置项
 */
interface UserConfig {
  host: string
  port: number
  [key: string]: any
}

// ✅ 7. 使用工具类型处理可选性
type PartialRecord<K extends string | number | symbol, T> = {
  [P in K]?: T
}

// ✅ 8. 避免过于宽泛的索引签名
// ❌ 太宽泛
interface Bad {
  [key: string]: any
}

// ✅ 更具体
interface Good {
  [key: string]: string | number
}

// ✅ 9. 可以为嵌套对象定义类型
interface NestedConfig {
  [key: string]: {
    enabled: boolean
    value: any
  }
}
```

## 11. 🔗 引用

- [TypeScript Handbook - Index Signatures][1]
- [TypeScript Handbook - Record][2]
- [TypeScript Deep Dive - Index Signatures][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures
[2]: https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type
[3]: https://basarat.gitbook.io/typescript/type-system/index-signatures
