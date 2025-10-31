# [0107. 接口的索引签名](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0107.%20%E6%8E%A5%E5%8F%A3%E7%9A%84%E7%B4%A2%E5%BC%95%E7%AD%BE%E5%90%8D)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是接口的索引签名？](#3--什么是接口的索引签名)
- [4. 🤔 字符串索引签名](#4--字符串索引签名)
  - [4.1. 基本用法](#41-基本用法)
  - [4.2. 字符串键的特点](#42-字符串键的特点)
  - [4.3. 结合具名属性](#43-结合具名属性)
- [5. 🤔 数字索引签名](#5--数字索引签名)
  - [5.1. 基本用法](#51-基本用法)
  - [5.2. 类数组对象](#52-类数组对象)
  - [5.3. 数字索引的转换](#53-数字索引的转换)
- [6. 🤔 索引签名的约束](#6--索引签名的约束)
  - [6.1. 数字索引必须兼容字符串索引](#61-数字索引必须兼容字符串索引)
  - [6.2. 具名属性必须兼容索引签名](#62-具名属性必须兼容索引签名)
  - [6.3. Symbol 索引签名](#63-symbol-索引签名)
- [7. 🤔 索引签名与具名属性](#7--索引签名与具名属性)
  - [7.1. 组合使用](#71-组合使用)
  - [7.2. 可选属性](#72-可选属性)
  - [7.3. 方法和索引签名](#73-方法和索引签名)
  - [7.4. 混合索引签名](#74-混合索引签名)
- [8. 🤔 只读索引签名](#8--只读索引签名)
  - [8.1. 基本用法](#81-基本用法)
  - [8.2. 只读数组](#82-只读数组)
  - [8.3. 部分只读](#83-部分只读)
- [9. 🤔 常见使用场景](#9--常见使用场景)
  - [9.1. 场景 1：字典和映射](#91-场景-1字典和映射)
  - [9.2. 场景 2：缓存系统](#92-场景-2缓存系统)
  - [9.3. 场景 3：配置对象](#93-场景-3配置对象)
  - [9.4. 场景 4：HTTP 头](#94-场景-4http-头)
  - [9.5. 场景 5：表单数据](#95-场景-5表单数据)
  - [9.6. 场景 6：API 响应](#96-场景-6api-响应)
  - [9.7. 场景 7：国际化](#97-场景-7国际化)
  - [9.8. 场景 8：CSS-in-JS 样式](#98-场景-8css-in-js-样式)
- [10. 🤔 常见错误和最佳实践](#10--常见错误和最佳实践)
  - [10.1. 错误 1：违反索引签名兼容性](#101-错误-1违反索引签名兼容性)
  - [10.2. 错误 2：具名属性与索引签名不兼容](#102-错误-2具名属性与索引签名不兼容)
  - [10.3. 错误 3：忘记处理 undefined](#103-错误-3忘记处理-undefined)
  - [10.4. 错误 4：过度使用 any](#104-错误-4过度使用-any)
  - [10.5. 最佳实践](#105-最佳实践)
- [11. 🔗 引用](#11--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 接口索引签名的语法
- 字符串索引签名
- 数字索引签名
- 索引签名的约束规则
- 索引签名与具名属性的结合
- 只读索引签名

## 2. 🫧 评价

接口的索引签名（Index Signature）允许你在接口中定义**动态属性**，描述对象可以有**任意数量的属性**。

索引签名的特点：

- **动态属性**：属性名不固定
- **类型约束**：所有动态属性必须符合指定类型
- **灵活性**：适合字典、映射等数据结构
- **类型安全**：访问任意属性都有类型检查

TypeScript 支持三种索引签名：

1. **字符串索引**：`[key: string]: T`
2. **数字索引**：`[index: number]: T`
3. **符号索引**：`[key: symbol]: T`

索引签名的约束规则：

- **数字索引的值类型必须是字符串索引值类型的子类型**
- **具名属性的类型必须兼容索引签名**
- **只读索引签名不能修改属性**

理解接口的索引签名，能帮助你：

1. 定义灵活的对象结构
2. 处理动态属性的对象
3. 实现类型安全的字典和映射
4. 正确组合索引签名和具名属性

索引签名是处理动态对象结构的核心工具，与前面学习的对象索引签名概念一致，这里重点关注在接口中的应用。

## 3. 🤔 什么是接口的索引签名？

接口的索引签名定义了对象可以有**任意数量的属性**，这些属性的**键和值**都有特定类型。

```ts
// ✅ 字符串索引签名
interface StringDictionary {
  [key: string]: string
}

const dict: StringDictionary = {
  name: 'Alice',
  city: 'New York',
  country: 'USA',
  // 可以有任意多个字符串属性
}

// ✅ 数字索引签名
interface NumberArray {
  [index: number]: string
}

const names: NumberArray = {
  0: 'Alice',
  1: 'Bob',
  2: 'Charlie',
}

// 或使用数组
const names2: NumberArray = ['Alice', 'Bob', 'Charlie']
```

**关键概念**：

- **动态键**：属性名在编译时不确定
- **类型约束**：所有值必须是指定类型
- **无限属性**：可以有任意数量的属性
- **类型安全**：访问任何属性都返回指定类型

## 4. 🤔 字符串索引签名

### 4.1. 基本用法

```ts
// ✅ 最常见的索引签名
interface Config {
  [key: string]: string | number | boolean
}

const config: Config = {
  host: 'localhost',
  port: 3000,
  debug: true,
  timeout: 5000,
}
```

### 4.2. 字符串键的特点

```ts
// ✅ 字符串索引可以匹配任何字符串键
interface FlexibleObject {
  [key: string]: any
}

const obj: FlexibleObject = {
  name: 'Alice',
  age: 30,
  'complex-key': 'value',
  '123': 'numeric string key',
  'key with spaces': 'value',
}
```

### 4.3. 结合具名属性

```ts
// ✅ 索引签名 + 具名属性
interface ConfigWithDefaults {
  [key: string]: string | number
  host: string // 必需的具名属性
  port: number // 必需的具名属性
}

const config: ConfigWithDefaults = {
  host: 'localhost',
  port: 3000,
  timeout: 5000, // 额外的动态属性
  maxConnections: 100,
}
```

## 5. 🤔 数字索引签名

### 5.1. 基本用法

```ts
// ✅ 数字索引
interface StringArray {
  [index: number]: string
}

const names: StringArray = {
  0: 'Alice',
  1: 'Bob',
  2: 'Charlie',
}

// 可以使用数组访问语法
console.log(names[0]) // 'Alice'
```

### 5.2. 类数组对象

```ts
// ✅ 定义类数组结构
interface ArrayLike<T> {
  [index: number]: T
  length: number
}

const arrayLike: ArrayLike<string> = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
}

// 可以使用 Array.from 转换
const arr = Array.from(arrayLike) // string[]
```

### 5.3. 数字索引的转换

```ts
// ⚠️ 数字索引会被转换为字符串
interface NumericDict {
  [index: number]: string
}

const dict: NumericDict = {
  0: 'zero',
  1: 'one',
}

// JavaScript 中这两种访问方式等价
dict[0] // 'zero'
dict['0'] // 'zero' - 数字会转为字符串
```

## 6. 🤔 索引签名的约束

### 6.1. 数字索引必须兼容字符串索引

```ts
// ❌ 数字索引的类型必须是字符串索引类型的子类型
interface Bad {
  [index: number]: number
  [key: string]: string // ❌ Error: 数字索引类型 number 不能赋值给字符串索引类型 string
}

// ✅ 数字索引类型必须兼容
interface Good {
  [index: number]: string
  [key: string]: string | number // ✅ string 是 string | number 的子类型
}

// ✅ 或者让字符串索引类型包含数字索引类型
interface AlsoGood {
  [index: number]: string
  [key: string]: string // ✅ 类型相同
}
```

### 6.2. 具名属性必须兼容索引签名

```ts
// ❌ 具名属性类型必须兼容索引签名
interface Bad {
  [key: string]: number
  name: string // ❌ Error: 'name' 的类型 string 不能赋值给索引签名类型 number
}

// ✅ 具名属性类型兼容索引签名
interface Good {
  [key: string]: number | string
  name: string // ✅ string 兼容 number | string
  age: number // ✅ number 兼容 number | string
}
```

### 6.3. Symbol 索引签名

```ts
// ✅ Symbol 索引签名
interface SymbolDict {
  [key: symbol]: string
}

const sym1 = Symbol('key1')
const sym2 = Symbol('key2')

const dict: SymbolDict = {
  [sym1]: 'value1',
  [sym2]: 'value2',
}

console.log(dict[sym1]) // 'value1'
```

## 7. 🤔 索引签名与具名属性

### 7.1. 组合使用

```ts
// ✅ 索引签名 + 必需属性
interface ServerConfig {
  [key: string]: any
  host: string // 必需
  port: number // 必需
}

const config: ServerConfig = {
  host: 'localhost',
  port: 3000,
  timeout: 5000,
  retries: 3,
}
```

### 7.2. 可选属性

```ts
// ✅ 索引签名 + 可选属性
interface Options {
  [key: string]: any
  required: string
  optional?: number
}

const options: Options = {
  required: 'value',
  extra: 'data',
}
```

### 7.3. 方法和索引签名

```ts
// ✅ 索引签名 + 方法
interface Dictionary {
  [key: string]: string
  get(key: string): string | undefined
  set(key: string, value: string): void
}

const dict: Dictionary = {
  key1: 'value1',
  key2: 'value2',

  get(key) {
    return this[key]
  },

  set(key, value) {
    ;(this as any)[key] = value
  },
}
```

### 7.4. 混合索引签名

```ts
// ✅ 同时使用字符串和数字索引
interface MixedIndex {
  [index: number]: string
  [key: string]: string | number

  name: string
  count: number
}

const obj: MixedIndex = {
  0: 'zero',
  1: 'one',
  name: 'example',
  count: 2,
  extra: 'data',
}
```

## 8. 🤔 只读索引签名

### 8.1. 基本用法

```ts
// ✅ 只读索引签名
interface ReadonlyDict {
  readonly [key: string]: string
}

const dict: ReadonlyDict = {
  name: 'Alice',
  city: 'New York',
}

dict.name = 'Bob' // ❌ Error: Index signature only permits reading
dict.country = 'USA' // ❌ Error: Index signature only permits reading
```

### 8.2. 只读数组

```ts
// ✅ 只读数组接口
interface ReadonlyStringArray {
  readonly [index: number]: string
  readonly length: number
}

const arr: ReadonlyStringArray = ['a', 'b', 'c']

arr[0] = 'd' // ❌ Error: Index signature only permits reading
arr.push('d') // ❌ Error: Property 'push' does not exist
```

### 8.3. 部分只读

```ts
// ✅ 部分属性只读
interface Config {
  readonly [key: string]: string | number
  readonly host: string
  port: number // ❌ Error: port 必须是只读的
}

// ✅ 正确的方式
interface Config {
  readonly [key: string]: string | number
  readonly host: string
  readonly port: number
}
```

## 9. 🤔 常见使用场景

### 9.1. 场景 1：字典和映射

```ts
// ✅ 键值对存储
interface TranslationDict {
  [key: string]: string
}

const translations: TranslationDict = {
  hello: '你好',
  goodbye: '再见',
  thank_you: '谢谢',
}

function translate(key: string): string {
  return translations[key] || key
}
```

### 9.2. 场景 2：缓存系统

```ts
// ✅ 通用缓存接口
interface Cache<T> {
  [key: string]: T | undefined
}

interface UserCache extends Cache<User> {
  // 特定类型的缓存
}

const userCache: UserCache = {}

function getUser(id: string): User | undefined {
  return userCache[id]
}

function setUser(id: string, user: User): void {
  userCache[id] = user
}
```

### 9.3. 场景 3：配置对象

```ts
// ✅ 灵活的配置
interface AppConfig {
  [key: string]: string | number | boolean
  appName: string
  version: string
  port: number
  debug: boolean
}

const config: AppConfig = {
  appName: 'My App',
  version: '1.0.0',
  port: 3000,
  debug: true,
  timeout: 5000,
  maxConnections: 100,
}
```

### 9.4. 场景 4：HTTP 头

```ts
// ✅ HTTP 请求头
interface HttpHeaders {
  [name: string]: string | string[]
}

const headers: HttpHeaders = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer token',
  Accept: 'application/json',
  'X-Custom-Header': ['value1', 'value2'],
}

function setHeader(name: string, value: string): void {
  headers[name] = value
}
```

### 9.5. 场景 5：表单数据

```ts
// ✅ 动态表单字段
interface FormData {
  [fieldName: string]: string | number | boolean | File
}

const formData: FormData = {
  username: 'alice',
  age: 25,
  newsletter: true,
  avatar: new File([], 'avatar.jpg'),
}

// ✅ 表单错误
interface FormErrors {
  [fieldName: string]: string[]
}

const errors: FormErrors = {
  username: ['Required', 'Too short'],
  email: ['Invalid format'],
}
```

### 9.6. 场景 6：API 响应

```ts
// ✅ 灵活的 API 响应
interface ApiResponse {
  status: number
  message: string
  [key: string]: any // 允许额外字段
}

const response: ApiResponse = {
  status: 200,
  message: 'Success',
  data: { id: 1, name: 'Alice' },
  timestamp: Date.now(),
  requestId: 'abc-123',
}
```

### 9.7. 场景 7：国际化

```ts
// ✅ 多语言翻译
interface Translations {
  [key: string]: {
    en: string
    zh: string
    ja: string
  }
}

const translations: Translations = {
  greeting: {
    en: 'Hello',
    zh: '你好',
    ja: 'こんにちは',
  },
  farewell: {
    en: 'Goodbye',
    zh: '再见',
    ja: 'さようなら',
  },
}

function translate(key: string, locale: 'en' | 'zh' | 'ja'): string {
  return translations[key]?.[locale] ?? key
}
```

### 9.8. 场景 8：CSS-in-JS 样式

```ts
// ✅ 样式对象
interface CSSProperties {
  [property: string]: string | number
}

const styles: CSSProperties = {
  color: 'red',
  fontSize: 16,
  padding: '10px',
  marginTop: 20,
  backgroundColor: '#fff',
}

// ✅ 主题对象
interface Theme {
  [key: string]: CSSProperties
}

const theme: Theme = {
  button: {
    padding: '10px 20px',
    backgroundColor: 'blue',
    color: 'white',
  },
  input: {
    border: '1px solid gray',
    padding: '8px',
  },
}
```

## 10. 🤔 常见错误和最佳实践

### 10.1. 错误 1：违反索引签名兼容性

```ts
// ❌ 数字索引类型与字符串索引类型不兼容
interface Bad {
  [index: number]: number
  [key: string]: string // ❌ Error
}

// ✅ 确保兼容性
interface Good {
  [index: number]: number
  [key: string]: number | string // ✅
}
```

### 10.2. 错误 2：具名属性与索引签名不兼容

```ts
// ❌ 具名属性类型不兼容
interface Bad {
  [key: string]: number
  name: string // ❌ Error
}

// ✅ 使用联合类型
interface Good {
  [key: string]: number | string
  name: string // ✅
  age: number // ✅
}
```

### 10.3. 错误 3：忘记处理 undefined

```ts
interface Dictionary {
  [key: string]: string
}

const dict: Dictionary = { name: 'Alice' }

// ⚠️ 可能返回 undefined
const value = dict['unknown'] // 类型是 string，但实际可能是 undefined

// ✅ 使用可选链
console.log(dict['unknown']?.toUpperCase())

// ✅ 或使用联合类型
interface SafeDictionary {
  [key: string]: string | undefined
}
```

### 10.4. 错误 4：过度使用 any

```ts
// ❌ 使用 any 失去类型安全
interface Bad {
  [key: string]: any
}

// ✅ 使用更具体的类型
interface Good {
  [key: string]: string | number | boolean
}

// ✅ 或使用泛型
interface Better<T> {
  [key: string]: T
}
```

### 10.5. 最佳实践

```ts
// ✅ 1. 为值提供具体类型
interface Config {
  [key: string]: string | number | boolean
}

// ✅ 2. 结合具名属性确保必需字段
interface Options {
  [key: string]: any
  host: string // 必需
  port: number // 必需
}

// ✅ 3. 使用泛型增加灵活性
interface Dictionary<T> {
  [key: string]: T
}

const strings: Dictionary<string> = { a: 'A' }
const numbers: Dictionary<number> = { a: 1 }

// ✅ 4. 只读索引签名保护数据
interface ReadonlyCache {
  readonly [key: string]: any
}

// ✅ 5. 处理可能的 undefined
interface SafeDict {
  [key: string]: string | undefined
}

function getValue(dict: SafeDict, key: string): string {
  return dict[key] ?? 'default'
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

// ✅ 7. 使用映射类型代替索引签名
// 当键的范围已知时
type Status = 'idle' | 'loading' | 'success' | 'error'
type StatusMap = {
  [K in Status]: string
}
// 等价于 Record<Status, string>

// ✅ 8. 为嵌套对象定义类型
interface NestedConfig {
  [key: string]: {
    enabled: boolean
    value: any
  }
}

// ✅ 9. 区分内部和外部接口
// 内部：严格类型
interface InternalConfig {
  host: string
  port: number
}

// 外部：灵活类型
interface ExternalConfig {
  host: string
  port: number
  [key: string]: any
}

// ✅ 10. 使用类型守卫验证动态属性
function isValidKey<T>(obj: T, key: PropertyKey): key is keyof T {
  return key in obj
}

const dict: Dictionary = { name: 'Alice' }
const key = 'name'

if (isValidKey(dict, key)) {
  console.log(dict[key]) // 类型安全
}
```

## 11. 🔗 引用

- [TypeScript Handbook - Index Signatures][1]
- [TypeScript Handbook - Indexable Types][2]
- [TypeScript Deep Dive - Index Signatures][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures
[2]: https://www.typescriptlang.org/docs/handbook/interfaces.html#indexable-types
[3]: https://basarat.gitbook.io/typescript/type-system/index-signatures
