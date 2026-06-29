# [0122. 泛型的最佳实践](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0122.%20%E6%B3%9B%E5%9E%8B%E7%9A%84%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 泛型参数的命名规范都有哪些？](#3-泛型参数的命名规范都有哪些)
- [4. 动态条件泛型与函数重载如何选择？](#4-动态条件泛型与函数重载如何选择)
- [5. 如何使用 JSDoc 给泛型参数添加注释？](#5-如何使用-jsdoc-给泛型参数添加注释)
- [6. 引用](#6-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 泛型命名规范
- 动态条件泛型与函数重载
- 文档化泛型代码

## 2. 评价

泛型的最佳实践是一系列提高泛型代码质量和可维护性的经验总结，推荐向一些知名的开源项目学习，看看大家都是咋做的。具体做法也非常简单，你并不需要刻意去拉项目到本地来挨个学习，只需要在日常开发的时候，在用到某个库的 API 时，略微留意一下相关库的类型声明文件中的类型定义即可。

## 3. 泛型参数的命名规范都有哪些？

下面是一些相对比较常见的命名约定：

1. 标准单字母约定，比如 T、K、V、E、R 分别表示类型、键、值、元素、返回值（常见约定）
2. 描述性名称（看团队喜好，也有很多项目是直接使用 T、U、V 这样的简写命名，通常在具有泛型参数的类型中，泛型参数的数量也不会超过 3 个，再加之使用 JSDoc 中的 `@template` 来描述泛型参数）
3. 前缀约定（看团队喜好，你可以给所有的接口前面都加上大写 `I` 作为前缀，以便于区分接口，也可以全都不加）

::: code-group

```ts [1]
// 标准单字母约定
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

```ts [2]
// 复杂场景可以考虑使用描述性名称，类型变量命名，通过类型名称了解到相应的语义。
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
interface BaseResponse<T, U> {
  // 不好
  data: T
  meta: U
}
```

```ts [3]
// 使用前缀增加可读性
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

// 一致性的命名
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

:::

::: info 💡 仅建议而非强制

命名规范这玩意儿，并非强制的，更多得看团队的偏好，只需要保持风格统一就行。

:::

## 4. 动态条件泛型与函数重载如何选择？

避免使用复杂的动态条件泛型逻辑来模拟函数重载的逻辑。

```ts
// ❌ 复杂的条件泛型
type Result<T> = T extends string
  ? { type: 'string'; value: string }
  : T extends number
  ? { type: 'number'; value: number }
  : never

function process1<T extends string | number>(value: T): Result<T> {
  if (typeof value === 'string') {
    return { type: 'string', value } as Result<T>
  }
  return { type: 'number', value } as Result<T>
}

// ✅ 使用重载更清晰
function process2(value: string): { type: 'string'; value: string }
function process2(value: number): { type: 'number'; value: number }
function process2(value: string | number): {
  type: string
  value: string | number
} {
  return {
    type: typeof value,
    value,
  }
}
```

必要时可以考虑组合使用泛型参数和函数重载。

```ts
// 泛型 + 函数重载提供更好的类型支持
function map<T, R>(arr: T[], fn: (item: T) => R): R[]
function map<T, R>(arr: T[], fn: (item: T, index: number) => R): R[]
function map<T, R>(arr: T[], fn: (item: T, index?: number) => R): R[] {
  return arr.map(fn as any)
}

// 重载处理不同情况
function create<T>(value: T): T
function create<T>(): T | undefined
function create<T>(value?: T): T | undefined {
  return value
}
```

## 5. 如何使用 JSDoc 给泛型参数添加注释？

1. JSDoc 注释 - 可以使用 `@template` 标记来添加泛型参数的注释说明
2. 约束说明 - 可以使用 `@remarks` 标记来添加约束规则说明
3. 使用示例 - 可以使用 `@example` 标记来添加示例代码

::: code-group

````ts [1]
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

```ts [2]
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

````ts [3]
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

  /
   * 转换容器中的值
   * @template R - 转换后的类型
   */
  map<R>(fn: (value: T) => R): Container<R> {
    return new Container(fn(this.value))
  }
}
````

:::

## 6. 引用

- [TypeScript Handbook - Generics][1]
- [TypeScript Deep Dive - Generics][2]
- [Effective TypeScript][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/generics.html
[2]: https://basarat.gitbook.io/typescript/type-system/generics
[3]: https://effectivetypescript.com/
