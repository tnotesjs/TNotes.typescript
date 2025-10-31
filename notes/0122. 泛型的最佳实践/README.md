# [0122. 泛型的最佳实践](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0122.%20%E6%B3%9B%E5%9E%8B%E7%9A%84%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 命名约定](#3--命名约定)
  - [3.1. 单字母约定](#31-单字母约定)
  - [3.2. 描述性名称](#32-描述性名称)
  - [3.3. 前缀约定](#33-前缀约定)
  - [3.4. 避免混淆](#34-避免混淆)
- [4. 🤔 类型参数数量](#4--类型参数数量)
  - [4.1. 控制数量](#41-控制数量)
  - [4.2. 重构复杂泛型](#42-重构复杂泛型)
  - [4.3. 使用元组类型](#43-使用元组类型)
- [5. 🤔 约束的使用](#5--约束的使用)
  - [5.1. 精确约束](#51-精确约束)
  - [5.2. 组合约束](#52-组合约束)
  - [5.3. 避免不必要的约束](#53-避免不必要的约束)
- [6. 🤔 类型推断](#6--类型推断)
  - [6.1. 充分利用推断](#61-充分利用推断)
  - [6.2. 推断友好的设计](#62-推断友好的设计)
  - [6.3. 避免推断失败](#63-避免推断失败)
- [7. 🤔 默认值的选择](#7--默认值的选择)
  - [7.1. 合理的默认值](#71-合理的默认值)
  - [7.2. 默认值依赖](#72-默认值依赖)
  - [7.3. 避免不当默认值](#73-避免不当默认值)
- [8. 🤔 避免过度泛型化](#8--避免过度泛型化)
  - [8.1. 识别过度泛型](#81-识别过度泛型)
  - [8.2. 只在必要时使用泛型](#82-只在必要时使用泛型)
  - [8.3. 泛型 vs 联合类型](#83-泛型-vs-联合类型)
- [9. 🤔 泛型与函数重载](#9--泛型与函数重载)
  - [9.1. 组合使用](#91-组合使用)
  - [9.2. 重载优于复杂泛型](#92-重载优于复杂泛型)
- [10. 🤔 文档和注释](#10--文档和注释)
  - [10.1. JSDoc 注释](#101-jsdoc-注释)
  - [10.2. 约束说明](#102-约束说明)
  - [10.3. 使用示例](#103-使用示例)
- [11. 🤔 性能考虑](#11--性能考虑)
  - [11.1. 避免复杂类型计算](#111-避免复杂类型计算)
  - [11.2. 缓存类型计算](#112-缓存类型计算)
  - [11.3. 简化条件类型](#113-简化条件类型)
- [12. 🤔 常见反模式](#12--常见反模式)
  - [12.1. 反模式 1：过度使用 any](#121-反模式-1过度使用-any)
  - [12.2. 反模式 2：忽略约束](#122-反模式-2忽略约束)
  - [12.3. 反模式 3：类型断言滥用](#123-反模式-3类型断言滥用)
  - [12.4. 反模式 4：单一职责违反](#124-反模式-4单一职责违反)
  - [12.5. 反模式 5：不一致的命名](#125-反模式-5不一致的命名)
  - [12.6. 反模式 6：过早优化](#126-反模式-6过早优化)
  - [12.7. 反模式 7：类型参数污染](#127-反模式-7类型参数污染)
- [13. 🔗 引用](#13--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 泛型命名规范
- 类型参数数量控制
- 约束和默认值的最佳实践
- 类型推断优化
- 避免常见错误
- 文档化泛型代码

## 2. 🫧 评价

泛型的最佳实践是一系列**提高泛型代码质量和可维护性**的经验总结。

泛型最佳实践的特点：

- **可读性**：代码易于理解和维护
- **类型安全**：充分利用类型检查
- **性能优化**：避免不必要的类型计算
- **可扩展性**：设计灵活且可扩展

良好实践 vs 不良实践：

| 维度       | 良好实践     | 不良实践   |
| ---------- | ------------ | ---------- |
| **命名**   | 有意义的名称 | 单字母滥用 |
| **复杂度** | 简单清晰     | 过度复杂   |
| **约束**   | 精确适当     | 过严或缺失 |
| **推断**   | 充分利用     | 过度标注   |
| **文档**   | 清晰完整     | 缺失或模糊 |

遵循最佳实践的好处：

1. **提高可读性**：代码更容易理解
2. **减少错误**：避免常见陷阱
3. **易于维护**：降低维护成本
4. **团队协作**：统一代码风格

理解泛型最佳实践，能帮助你：

1. 编写高质量的泛型代码
2. 避免常见的设计问题
3. 提高团队开发效率
4. 构建可维护的类型系统

泛型最佳实践是 TypeScript 开发的重要指南，是专业代码的标志。

## 3. 🤔 命名约定

### 3.1. 单字母约定

```ts
// ✅ 标准单字母约定
// T - Type（类型）
// K - Key（键）
// V - Value（值）
// E - Element（元素）
// R - Return（返回值）

function identity<T>(arg: T): T {
  return arg
}

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

function map<T, R>(arr: T[], fn: (item: T) => R): R[] {
  return arr.map(fn)
}
```

### 3.2. 描述性名称

```ts
// ✅ 复杂场景使用描述性名称
interface ApiResponse<TData, TError = Error> {
  data?: TData
  error?: TError
  status: number
}

class Repository<TEntity, TId = number> {
  async findById(id: TId): Promise<TEntity | null> {
    return null
  }
}

function transform<TInput, TOutput>(
  input: TInput,
  transformer: (value: TInput) => TOutput
): TOutput {
  return transformer(input)
}

// ❌ 避免无意义的名称
interface Response<Foo, Bar> {
  // 不好
  data: Foo
  meta: Bar
}
```

### 3.3. 前缀约定

```ts
// ✅ 使用前缀增加可读性
// T 前缀表示类型参数
interface Container<TValue> {
  value: TValue
}

// I 前缀表示接口（可选）
interface IComparable<T> {
  compareTo(other: T): number
}

// P 前缀表示 Props
interface ComponentProps<PData> {
  data: PData
  onLoad?: (data: PData) => void
}

// ✅ 一致性的命名
class DataStore<TItem, TKey extends keyof TItem> {
  private items = new Map<TItem[TKey], TItem>()

  set(key: TItem[TKey], item: TItem): void {
    this.items.set(key, item)
  }

  get(key: TItem[TKey]): TItem | undefined {
    return this.items.get(key)
  }
}
```

### 3.4. 避免混淆

```ts
// ❌ 容易混淆的命名
interface Bad<T, T1, T2, T3> {
  // 不好
  value: T
  other: T1
}

// ✅ 清晰的命名
interface Good<TValue, TMetadata, TOptions> {
  value: TValue
  metadata: TMetadata
  options: TOptions
}

// ❌ 与关键字冲突
// interface Container<Type> {}  // Type 是保留字

// ✅ 使用 T 前缀
interface Container<TType> {
  value: TType
}
```

## 4. 🤔 类型参数数量

### 4.1. 控制数量

```ts
// ✅ 1-2 个类型参数通常是合理的
function map<T, R>(arr: T[], fn: (item: T) => R): R[] {
  return arr.map(fn)
}

// ✅ 3 个参数仍然可接受
function reduce<T, R, TAcc = R>(
  arr: T[],
  fn: (acc: TAcc, item: T) => TAcc,
  initial: TAcc
): TAcc {
  return arr.reduce(fn, initial)
}

// ❌ 避免过多类型参数
function complex<T1, T2, T3, T4, T5, T6>(
  a: T1,
  b: T2,
  c: T3,
  d: T4,
  e: T5,
  f: T6
): void {} // 太多了

// ✅ 使用接口封装
interface ComplexOptions<T1, T2, T3> {
  a: T1
  b: T2
  c: T3
}

function betterComplex<TOptions extends ComplexOptions<any, any, any>>(
  options: TOptions
): void {}
```

### 4.2. 重构复杂泛型

```ts
// ❌ 过于复杂
function process<T1, T2, T3, T4>(a: T1, b: T2, c: T3, d: T4): [T1, T2, T3, T4] {
  return [a, b, c, d]
}

// ✅ 使用辅助类型
interface ProcessInput<T1, T2> {
  first: T1
  second: T2
}

interface ProcessOutput<T3, T4> {
  third: T3
  fourth: T4
}

function process<
  TInput extends ProcessInput<any, any>,
  TOutput extends ProcessOutput<any, any>
>(input: TInput, output: TOutput): TInput & TOutput {
  return { ...input, ...output }
}

// ✅ 或拆分为多个函数
function processFirst<T1, T2>(a: T1, b: T2): ProcessInput<T1, T2> {
  return { first: a, second: b }
}

function processSecond<T3, T4>(c: T3, d: T4): ProcessOutput<T3, T4> {
  return { third: c, fourth: d }
}
```

### 4.3. 使用元组类型

```ts
// ✅ 使用元组简化多个类型参数
type MultiResult<T extends any[]> = {
  [K in keyof T]: {
    value: T[K]
    index: number
  }
}

function processMultiple<T extends any[]>(...args: T): MultiResult<T> {
  return args.map((value, index) => ({ value, index })) as any
}

const results = processMultiple('hello', 42, true)
// results: [
//   { value: string; index: number },
//   { value: number; index: number },
//   { value: boolean; index: number }
// ]
```

## 5. 🤔 约束的使用

### 5.1. 精确约束

```ts
// ✅ 只约束必要的部分
interface Identifiable {
  id: number
}

function findById<T extends Identifiable>(
  items: T[],
  id: number
): T | undefined {
  return items.find((item) => item.id === id)
}

// ❌ 过度约束
interface TooSpecific {
  id: number
  name: string
  createdAt: Date
}

function findByIdBad<T extends TooSpecific>(
  items: T[],
  id: number
): T | undefined {
  return items.find((item) => item.id === id) // 只需要 id
}
```

### 5.2. 组合约束

```ts
// ✅ 使用交叉类型组合约束
interface Named {
  name: string
}

interface Aged {
  age: number
}

function describe<T extends Named & Aged>(person: T): string {
  return `${person.name}, ${person.age} years old`
}

// ✅ 使用工具类型
function update<T, K extends keyof T>(obj: T, key: K, value: T[K]): T {
  return { ...obj, [key]: value }
}
```

### 5.3. 避免不必要的约束

```ts
// ❌ 不必要的约束
function identity<T extends any>(arg: T): T {
  return arg // extends any 是多余的
}

// ✅ 简化
function identity<T>(arg: T): T {
  return arg
}

// ❌ 过严约束
function length<T extends string>(str: T): number {
  return str.length
}

// ✅ 使用更宽松的约束
function length<T extends { length: number }>(obj: T): number {
  return obj.length // 适用于 string、array 等
}
```

## 6. 🤔 类型推断

### 6.1. 充分利用推断

```ts
// ✅ 让 TypeScript 推断类型
function wrap<T>(value: T) {
  return { value }
}

const wrapped1 = wrap('hello') // ✅ 自动推断为 string
const wrapped2 = wrap(42) // ✅ 自动推断为 number

// ❌ 不必要的类型标注
const wrapped3 = wrap<string>('hello') // 多余

// ✅ 只在必要时指定类型
const wrapped4 = wrap<unknown>({}) // 有意义
```

### 6.2. 推断友好的设计

```ts
// ✅ 参数位置影响推断
function map<T, R>(arr: T[], fn: (item: T) => R): R[] {
  return arr.map(fn)
}

// T 从 arr 推断，R 从 fn 返回值推断
const results = map([1, 2, 3], (x) => x.toString()) // string[]

// ✅ 使用 as const 辅助推断
function tuple<T extends readonly any[]>(...args: T): T {
  return args
}

const t1 = tuple(1, 'hello', true) // [number, string, boolean]
const t2 = tuple(1, 'hello', true) as const // readonly [1, 'hello', true]
```

### 6.3. 避免推断失败

```ts
// ❌ 推断失败
function create<T>(): T {
  return {} as T // 无法推断 T
}

const obj = create() // T = unknown

// ✅ 提供推断线索
function create<T>(defaults?: Partial<T>): T {
  return { ...defaults } as T
}

// ✅ 使用默认值
function create<T = {}>(): T {
  return {} as T
}
```

## 7. 🤔 默认值的选择

### 7.1. 合理的默认值

```ts
// ✅ 为常见情况提供默认值
interface Response<T = void, E = Error> {
  data?: T
  error?: E
  status: number
}

// 简单响应
const response1: Response = {
  status: 200,
}

// 带数据响应
const response2: Response<User> = {
  data: { id: 1, name: 'Alice' },
  status: 200,
}

// ✅ unknown 比 any 更安全
interface Container<T = unknown> {
  value: T
}
```

### 7.2. 默认值依赖

```ts
// ✅ 后续参数依赖前面的参数
interface Transformer<TInput, TOutput = TInput> {
  transform(input: TInput): TOutput
}

// 默认转换为相同类型
const identity: Transformer<number> = {
  transform(x) {
    return x
  },
}

// 转换为不同类型
const toString: Transformer<number, string> = {
  transform(x) {
    return x.toString()
  },
}
```

### 7.3. 避免不当默认值

```ts
// ❌ 默认值不满足约束
// interface Bad<T extends number = string> {}  // Error

// ✅ 默认值满足约束
interface Good<T extends number = 0> {
  value: T
}

// ❌ 过于宽泛的默认值
interface Response<T = any> {
  // 失去类型安全
  data: T
}

// ✅ 使用更安全的默认值
interface Response<T = unknown> {
  data: T
}
```

## 8. 🤔 避免过度泛型化

### 8.1. 识别过度泛型

```ts
// ❌ 不必要的泛型
interface User<TName extends string, TAge extends number> {
  name: TName
  age: TAge
}

// ✅ 简化
interface User {
  name: string
  age: number
}

// ❌ 过度参数化
function add<T extends number>(a: T, b: T): T {
  return (a + b) as T
}

// ✅ 直接使用具体类型
function add(a: number, b: number): number {
  return a + b
}
```

### 8.2. 只在必要时使用泛型

```ts
// ❌ 不需要泛型
class Logger<T> {
  log(message: T): void {
    console.log(message)
  }
}

// ✅ 简化
class Logger {
  log(message: string): void {
    console.log(message)
  }
}

// ✅ 泛型有意义的场景
class Container<T> {
  constructor(public value: T) {}

  map<R>(fn: (value: T) => R): Container<R> {
    return new Container(fn(this.value))
  }
}
```

### 8.3. 泛型 vs 联合类型

```ts
// ❌ 过度使用泛型
function process<T extends string | number>(value: T): T {
  return value
}

// ✅ 使用联合类型
function process(value: string | number): string | number {
  return value
}

// ✅ 泛型保留精确类型
function identity<T>(value: T): T {
  return value
}

const str = identity('hello') // string，不是 string | number
```

## 9. 🤔 泛型与函数重载

### 9.1. 组合使用

```ts
// ✅ 泛型 + 函数重载提供更好的类型支持
function map<T, R>(arr: T[], fn: (item: T) => R): R[]
function map<T, R>(arr: T[], fn: (item: T, index: number) => R): R[]
function map<T, R>(arr: T[], fn: (item: T, index?: number) => R): R[] {
  return arr.map(fn as any)
}

// ✅ 重载处理不同情况
function create<T>(value: T): T
function create<T>(): T | undefined
function create<T>(value?: T): T | undefined {
  return value
}
```

### 9.2. 重载优于复杂泛型

```ts
// ❌ 复杂的条件泛型
type Result<T> = T extends string
  ? { type: 'string'; value: string }
  : T extends number
  ? { type: 'number'; value: number }
  : never

function process<T extends string | number>(value: T): Result<T> {
  if (typeof value === 'string') {
    return { type: 'string', value } as Result<T>
  }
  return { type: 'number', value } as Result<T>
}

// ✅ 使用重载更清晰
function process(value: string): { type: 'string'; value: string }
function process(value: number): { type: 'number'; value: number }
function process(value: string | number): {
  type: string
  value: string | number
} {
  return {
    type: typeof value,
    value,
  }
}
```

## 10. 🤔 文档和注释

### 10.1. JSDoc 注释

````ts
/**
 * 创建数组的副本并进行转换
 *
 * @template T - 输入数组元素类型
 * @template R - 输出数组元素类型
 * @param arr - 要转换的数组
 * @param fn - 转换函数
 * @returns 转换后的新数组
 *
 * @example
 * ```ts
 * const numbers = [1, 2, 3]
 * const strings = map(numbers, x => x.toString())
 * // strings: ['1', '2', '3']
 * ```
 */
function map<T, R>(arr: T[], fn: (item: T) => R): R[] {
  return arr.map(fn)
}
````

### 10.2. 约束说明

```ts
/**
 * 按指定属性排序数组
 *
 * @template T - 数组元素类型
 * @template K - T 的键，确保键存在
 * @param arr - 要排序的数组
 * @param key - 排序依据的属性名
 * @returns 排序后的新数组
 *
 * @remarks
 * K 被约束为 T 的键，确保不会使用不存在的属性排序
 */
function sortBy<T, K extends keyof T>(arr: T[], key: K): T[] {
  return [...arr].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
  })
}
```

### 10.3. 使用示例

````ts
/**
 * 通用容器类
 *
 * @template T - 容器中存储的值的类型
 *
 * @example
 * ```ts
 * // 创建字符串容器
 * const strContainer = new Container('hello')
 * strContainer.map(s => s.toUpperCase())  // Container<string>
 *
 * // 创建数字容器
 * const numContainer = new Container(42)
 * numContainer.map(n => n * 2)  // Container<number>
 * ```
 */
class Container<T> {
  constructor(public value: T) {}

  /**
   * 转换容器中的值
   * @template R - 转换后的类型
   */
  map<R>(fn: (value: T) => R): Container<R> {
    return new Container(fn(this.value))
  }
}
````

## 11. 🤔 性能考虑

### 11.1. 避免复杂类型计算

```ts
// ❌ 非常复杂的递归类型
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? T[P] extends Array<infer U>
      ? ReadonlyArray<DeepReadonly<U>>
      : DeepReadonly<T[P]>
    : T[P]
}

// ✅ 限制递归深度
type DeepReadonly<T, Depth extends number = 5> = Depth extends 0
  ? T
  : {
      readonly [P in keyof T]: T[P] extends object
        ? DeepReadonly<T[P], MinusOne<Depth>>
        : T[P]
    }

type MinusOne<N extends number> = [never, 0, 1, 2, 3, 4][N]
```

### 11.2. 缓存类型计算

```ts
// ✅ 使用类型别名缓存计算结果
type UserKeys = keyof User
type UserValues = User[UserKeys]

function processUser<K extends UserKeys>(key: K): UserValues {
  // 使用预计算的类型
  return null as any
}

// ❌ 每次都计算
function processUser<K extends keyof User>(key: K): User[K] {
  return null as any
}
```

### 11.3. 简化条件类型

```ts
// ❌ 复杂的嵌套条件
type Complex<T> = T extends string
  ? T extends `${infer Prefix}:${infer Suffix}`
    ? Prefix extends 'a' | 'b'
      ? Suffix extends 'x' | 'y'
        ? `${Prefix}-${Suffix}`
        : never
      : never
    : never
  : never

// ✅ 拆分为多个简单类型
type HasColon<T extends string> = T extends `${string}:${string}` ? T : never
type ValidPrefix<T extends string> = T extends `${infer P}:${string}`
  ? P extends 'a' | 'b'
    ? P
    : never
  : never
type Transform<T extends string> = HasColon<T> extends never
  ? never
  : `${ValidPrefix<T>}-${string}`
```

## 12. 🤔 常见反模式

### 12.1. 反模式 1：过度使用 any

```ts
// ❌ 失去类型安全
function process<T = any>(value: T): T {
  return value
}

// ✅ 使用 unknown 或具体类型
function process<T = unknown>(value: T): T {
  return value
}
```

### 12.2. 反模式 2：忽略约束

```ts
// ❌ 没有约束，无法安全使用属性
function getLength<T>(obj: T): number {
  // return obj.length  // Error
  return 0
}

// ✅ 添加必要约束
function getLength<T extends { length: number }>(obj: T): number {
  return obj.length
}
```

### 12.3. 反模式 3：类型断言滥用

```ts
// ❌ 过度使用类型断言
function convert<T, R>(value: T): R {
  return value as unknown as R // 危险
}

// ✅ 使用正确的类型关系
function convert<T, R>(value: T, converter: (v: T) => R): R {
  return converter(value)
}
```

### 12.4. 反模式 4：单一职责违反

```ts
// ❌ 泛型做太多事
class DataManager<T, K extends keyof T, V extends T[K]> {
  // 过于复杂
}

// ✅ 拆分职责
class DataStore<T> {
  // 存储
}

class DataQuery<T, K extends keyof T> {
  // 查询
}
```

### 12.5. 反模式 5：不一致的命名

```ts
// ❌ 命名混乱
interface Container<T> {
  value: T
}

interface Box<V> {
  content: V
}

interface Wrapper<Data> {
  data: Data
}

// ✅ 保持一致
interface Container<T> {
  value: T
}

interface Box<T> {
  value: T
}

interface Wrapper<T> {
  value: T
}
```

### 12.6. 反模式 6：过早优化

```ts
// ❌ 过度复杂的优化
type OptimizedString<S extends string> = S extends `${infer First}${infer Rest}`
  ? First extends 'a' | 'b' | 'c'
    ? `${First}${OptimizedString<Rest>}`
    : OptimizedString<Rest>
  : ''

// ✅ 先保持简单
type FilteredString<S extends string> = S // 后续再优化
```

### 12.7. 反模式 7：类型参数污染

```ts
// ❌ 不必要的类型参数传递
class Parent<T> {
  value: T

  constructor(value: T) {
    this.value = value
  }
}

class Child<T, U> extends Parent<T> {
  extra: U

  constructor(value: T, extra: U) {
    super(value)
    this.extra = extra
  }
}

// ✅ 只传递必要的类型参数
class Parent<T> {
  constructor(public value: T) {}
}

class Child<U> extends Parent<string> {
  constructor(public extra: U) {
    super('')
  }
}
```

## 13. 🔗 引用

- [TypeScript Handbook - Generics][1]
- [TypeScript Deep Dive - Generics][2]
- [Effective TypeScript][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/generics.html
[2]: https://basarat.gitbook.io/typescript/type-system/generics
[3]: https://effectivetypescript.com/
