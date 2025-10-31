# [0101. 对象索引签名](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0101.%20%E5%AF%B9%E8%B1%A1%E7%B4%A2%E5%BC%95%E7%AD%BE%E5%90%8D)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是索引签名？](#3--什么是索引签名)
- [4. 🤔 如何声明索引签名？](#4--如何声明索引签名)
  - [4.1. 基本语法](#41-基本语法)
  - [4.2. 字符串索引签名](#42-字符串索引签名)
  - [4.3. 数字索引签名](#43-数字索引签名)
  - [4.4. 混合索引签名](#44-混合索引签名)
- [5. 🤔 索引签名的类型](#5--索引签名的类型)
  - [5.1. 键的类型限制](#51-键的类型限制)
  - [5.2. 值的类型](#52-值的类型)
  - [5.3. 可选索引签名](#53-可选索引签名)
- [6. 🤔 索引签名的限制](#6--索引签名的限制)
  - [6.1. 数字索引必须兼容字符串索引](#61-数字索引必须兼容字符串索引)
  - [6.2. 具名属性必须兼容索引签名](#62-具名属性必须兼容索引签名)
  - [6.3. 只读索引签名](#63-只读索引签名)
- [7. 🤔 Record 工具类型](#7--record-工具类型)
  - [7.1. Record<K, T>](#71-recordk-t)
  - [7.2. 限定键的范围](#72-限定键的范围)
  - [7.3. Record vs 索引签名](#73-record-vs-索引签名)
- [8. 🤔 索引签名与其他属性](#8--索引签名与其他属性)
  - [8.1. 结合具名属性](#81-结合具名属性)
  - [8.2. 结合可选属性](#82-结合可选属性)
  - [8.3. 结合只读属性](#83-结合只读属性)
- [9. 🤔 常见使用场景](#9--常见使用场景)
  - [9.1. 场景 1：字典/映射](#91-场景-1字典映射)
  - [9.2. 场景 2：缓存系统](#92-场景-2缓存系统)
  - [9.3. 场景 3：HTTP 头](#93-场景-3http-头)
  - [9.4. 场景 4：表单数据](#94-场景-4表单数据)
  - [9.5. 场景 5：查询参数](#95-场景-5查询参数)
  - [9.6. 场景 6：事件系统](#96-场景-6事件系统)
  - [9.7. 场景 7：API 响应](#97-场景-7api-响应)
  - [9.8. 场景 8：国际化](#98-场景-8国际化)
- [10. 🤔 常见错误和最佳实践](#10--常见错误和最佳实践)
  - [10.1. 错误 1：违反索引签名兼容性](#101-错误-1违反索引签名兼容性)
  - [10.2. 错误 2：具名属性与索引签名不兼容](#102-错误-2具名属性与索引签名不兼容)
  - [10.3. 错误 3：过度使用 any](#103-错误-3过度使用-any)
  - [10.4. 错误 4：忘记索引访问可能返回 undefined](#104-错误-4忘记索引访问可能返回-undefined)
  - [10.5. 最佳实践](#105-最佳实践)
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

索引签名（Index Signature）用于描述**动态属性名**的对象类型，允许对象拥有**任意数量**的属性。

索引签名的特点：

- **动态属性**：属性名不固定
- **类型约束**：所有属性值必须符合指定类型
- **灵活性**：适合字典、映射等数据结构
- **类型安全**：访问任意属性都有类型检查

TypeScript 支持两种索引签名：

1. **字符串索引**：`[key: string]: T`
2. **数字索引**：`[index: number]: T`

理解索引签名，能帮助你：

1. 定义字典和映射类型
2. 处理动态属性的对象
3. 实现灵活的配置系统
4. 编写类型安全的动态代码

索引签名是处理动态对象结构的重要工具，是实现灵活 API 的基础。

## 3. 🤔 什么是索引签名？

索引签名定义了对象可以有**任意数量的属性**，这些属性的**键和值**都有特定类型。

```ts
// ✅ 字符串索引签名
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

// ✅ 数字索引签名
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

**关键概念**：

- **动态键**：属性名在编译时不确定
- **类型约束**：所有值必须是指定类型
- **无限属性**：可以有任意数量的属性
- **类型安全**：访问任何属性都返回指定类型

## 4. 🤔 如何声明索引签名？

### 4.1. 基本语法

```ts
// 字符串索引签名
interface StringIndex {
  [key: string]: ValueType
}

// 数字索引签名
interface NumberIndex {
  [index: number]: ValueType
}

// 可以指定键名（仅用于文档）
interface Dictionary {
  [propertyName: string]: any
}
```

### 4.2. 字符串索引签名

```ts
// ✅ 字符串键，字符串值
interface StringDictionary {
  [key: string]: string
}

const dict: StringDictionary = {
  name: 'Alice',
  city: 'New York',
  country: 'USA',
}

// ✅ 字符串键，数字值
interface NumberDictionary {
  [key: string]: number
}

const ages: NumberDictionary = {
  alice: 25,
  bob: 30,
  charlie: 35,
}
```

### 4.3. 数字索引签名

```ts
// ✅ 数字键，字符串值
interface StringArray {
  [index: number]: string
}

const names: StringArray = {
  0: 'Alice',
  1: 'Bob',
  2: 'Charlie',
}

// 或使用数组字面量
const names: StringArray = ['Alice', 'Bob', 'Charlie']
```

### 4.4. 混合索引签名

```ts
// ✅ 同时有字符串和数字索引
interface MixedIndex {
  [index: number]: string
  [key: string]: string | number
}

const mixed: MixedIndex = {
  0: 'zero',
  1: 'one',
  name: 'example',
  count: 100,
}
```

## 5. 🤔 索引签名的类型

### 5.1. 键的类型限制

```ts
// ✅ 只能是 string、number 或 symbol
interface ValidKeys {
  [key: string]: any // ✅
  [index: number]: any // ✅
  [sym: symbol]: any // ✅
}

// ❌ 不能使用其他类型
interface InvalidKeys {
  [key: boolean]: any // ❌ Error
  [key: object]: any // ❌ Error
}
```

### 5.2. 值的类型

```ts
// ✅ 值可以是任何类型
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

### 5.3. 可选索引签名

```ts
// ⚠️ 索引签名不支持 ? 修饰符
interface Bad {
  [key: string]?: string  // ❌ Error
}

// ✅ 使用 undefined 联合类型
interface Good {
  [key: string]: string | undefined
}

const obj: Good = {
  name: 'Alice',
  age: undefined  // ✅
}
```

## 6. 🤔 索引签名的限制

### 6.1. 数字索引必须兼容字符串索引

```ts
// ❌ 数字索引的类型必须是字符串索引类型的子类型
interface Bad {
  [index: number]: string
  [key: string]: number // ❌ Error
}

// ✅ 数字索引类型必须兼容
interface Good {
  [index: number]: string
  [key: string]: string | number // ✅
}
```

**原因**：JavaScript 会将数字索引转换为字符串

```ts
const obj: any = {}
obj[0] = 'zero'
obj['0'] // 'zero' - 相同的属性
```

### 6.2. 具名属性必须兼容索引签名

```ts
// ❌ 具名属性类型必须兼容索引签名
interface Bad {
  [key: string]: number
  name: string // ❌ Error: 'name' 的类型不兼容
}

// ✅ 具名属性兼容索引签名
interface Good {
  [key: string]: number | string
  name: string // ✅
  age: number // ✅
}
```

### 6.3. 只读索引签名

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
dict.country = 'USA' // ❌ Error
```

## 7. 🤔 Record 工具类型

### 7.1. Record<K, T>

```ts
// ✅ Record<K, T> 创建键值对类型
type Dictionary = Record<string, string>
// 等价于
type Dictionary = {
  [key: string]: string
}

// 使用
const colors: Record<string, string> = {
  red: '#FF0000',
  green: '#00FF00',
  blue: '#0000FF',
}
```

### 7.2. 限定键的范围

```ts
// ✅ 使用字面量类型限定键
type Status = 'pending' | 'success' | 'error'

type StatusMessages = Record<Status, string>
// 等价于
type StatusMessages = {
  pending: string
  success: string
  error: string
}

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

### 7.3. Record vs 索引签名

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

## 8. 🤔 索引签名与其他属性

### 8.1. 结合具名属性

```ts
// ✅ 索引签名 + 具名属性
interface Config {
  [key: string]: any
  host: string // 必需的具名属性
  port: number // 必需的具名属性
}

const config: Config = {
  host: 'localhost',
  port: 3000,
  timeout: 5000, // 额外的动态属性
  maxConnections: 100,
}
```

### 8.2. 结合可选属性

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

### 8.3. 结合只读属性

```ts
// ✅ 索引签名 + 只读属性
interface Data {
  readonly [key: string]: any
  readonly id: number
  name: string
}

const data: Data = {
  id: 1,
  name: 'Alice',
  extra: 'data',
}

data.id = 2 // ❌ Error: readonly
data.name = 'Bob' // ❌ Error: readonly
data.extra = 'new' // ❌ Error: readonly
```

## 9. 🤔 常见使用场景

### 9.1. 场景 1：字典/映射

```ts
// ✅ 键值对存储
interface StringMap {
  [key: string]: string
}

const translations: StringMap = {
  hello: '你好',
  goodbye: '再见',
  thanks: '谢谢',
}

// ✅ 配置映射
type Environment = Record<string, string>

const env: Environment = {
  NODE_ENV: 'production',
  API_URL: 'https://api.example.com',
  PORT: '3000',
}
```

### 9.2. 场景 2：缓存系统

```ts
// ✅ 缓存数据
interface Cache<T> {
  [key: string]: T
}

const userCache: Cache<User> = {}

function getUser(id: string): User | undefined {
  return userCache[id]
}

function setUser(id: string, user: User): void {
  userCache[id] = user
}
```

### 9.3. 场景 3：HTTP 头

```ts
// ✅ HTTP 请求头
interface Headers {
  [name: string]: string
}

const headers: Headers = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer token',
  Accept: 'application/json',
}

function setHeader(name: string, value: string): void {
  headers[name] = value
}
```

### 9.4. 场景 4：表单数据

```ts
// ✅ 动态表单字段
interface FormData {
  [fieldName: string]: string | number | boolean
}

const formData: FormData = {
  username: 'alice',
  age: 25,
  newsletter: true,
  country: 'USA',
}

// ✅ 验证错误
interface ValidationErrors {
  [fieldName: string]: string[]
}

const errors: ValidationErrors = {
  username: ['Username is required', 'Username must be at least 3 characters'],
  email: ['Invalid email format'],
}
```

### 9.5. 场景 5：查询参数

```ts
// ✅ URL 查询参数
interface QueryParams {
  [key: string]: string | string[]
}

const params: QueryParams = {
  search: 'typescript',
  category: 'programming',
  tags: ['javascript', 'web'],
}

function buildQueryString(params: QueryParams): string {
  return Object.entries(params)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((v) => `${key}=${encodeURIComponent(v)}`).join('&')
      }
      return `${key}=${encodeURIComponent(value)}`
    })
    .join('&')
}
```

### 9.6. 场景 6：事件系统

```ts
// ✅ 事件监听器
type EventHandler = (...args: any[]) => void

interface EventEmitter {
  [eventName: string]: EventHandler[]
}

class Events {
  private listeners: EventEmitter = {}

  on(event: string, handler: EventHandler): void {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(handler)
  }

  emit(event: string, ...args: any[]): void {
    const handlers = this.listeners[event]
    if (handlers) {
      handlers.forEach((handler) => handler(...args))
    }
  }
}
```

### 9.7. 场景 7：API 响应

```ts
// ✅ 灵活的 API 响应
interface ApiResponse {
  status: number
  message: string
  [key: string]: any // 允许额外的字段
}

const response: ApiResponse = {
  status: 200,
  message: 'Success',
  data: { id: 1, name: 'Alice' },
  timestamp: Date.now(),
}
```

### 9.8. 场景 8：国际化

```ts
// ✅ 多语言翻译
type Locale = 'en' | 'zh' | 'ja'

interface Translations {
  [key: string]: Record<Locale, string>
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

function translate(key: string, locale: Locale): string {
  return translations[key]?.[locale] ?? key
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

### 10.3. 错误 3：过度使用 any

```ts
// ❌ 使用 any 失去类型安全
interface Bad {
  [key: string]: any
}

const data: Bad = { value: 123 }
data.value.toFixed() // ✅ 编译通过，但运行时可能出错

// ✅ 使用更具体的类型
interface Good {
  [key: string]: string | number | boolean
}
```

### 10.4. 错误 4：忘记索引访问可能返回 undefined

```ts
interface Dictionary {
  [key: string]: string
}

const dict: Dictionary = { name: 'Alice' }

// ⚠️ 可能返回 undefined
const value = dict['unknown'] // 类型是 string，但实际可能是 undefined

// ✅ 处理 undefined
const value = dict['unknown']
if (value !== undefined) {
  console.log(value.toUpperCase())
}

// ✅ 或使用可选链
console.log(dict['unknown']?.toUpperCase())

// ✅ 或使用联合类型
interface SafeDictionary {
  [key: string]: string | undefined
}
```

### 10.5. 最佳实践

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

// ✅ 9. 为嵌套对象定义类型
interface NestedConfig {
  [key: string]: {
    enabled: boolean
    value: any
  }
}

// ✅ 10. 使用类型守卫验证动态属性
function isValidKey(obj: any, key: string): key is keyof typeof obj {
  return key in obj
}

const dict: Dictionary = { name: 'Alice' }
if (isValidKey(dict, 'name')) {
  console.log(dict.name) // 类型安全
}
```

## 11. 🔗 引用

- [TypeScript Handbook - Index Signatures][1]
- [TypeScript Handbook - Record][2]
- [TypeScript Deep Dive - Index Signatures][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures
[2]: https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type
[3]: https://basarat.gitbook.io/typescript/type-system/index-signatures
