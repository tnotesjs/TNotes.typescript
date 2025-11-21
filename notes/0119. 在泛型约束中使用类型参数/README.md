# [0119. 在泛型约束中使用类型参数](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0119.%20%E5%9C%A8%E6%B3%9B%E5%9E%8B%E7%BA%A6%E6%9D%9F%E4%B8%AD%E4%BD%BF%E7%94%A8%E7%B1%BB%E5%9E%8B%E5%8F%82%E6%95%B0)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是类型参数约束？](#3--什么是类型参数约束)
- [4. 🤔 基本语法](#4--基本语法)
  - [4.1. 简单约束](#41-简单约束)
  - [4.2. 属性访问约束](#42-属性访问约束)
  - [4.3. 反向约束](#43-反向约束)
- [5. 🤔 常见模式](#5--常见模式)
  - [5.1. 子类型约束](#51-子类型约束)
  - [5.2. 数组元素约束](#52-数组元素约束)
  - [5.3. 构造函数约束](#53-构造函数约束)
  - [5.4. 函数参数约束](#54-函数参数约束)
- [6. 🤔 keyof 结合使用](#6--keyof-结合使用)
  - [6.1. 单键约束](#61-单键约束)
  - [6.2. 多键约束](#62-多键约束)
  - [6.3. 排除键约束](#63-排除键约束)
  - [6.4. 嵌套键约束](#64-嵌套键约束)
  - [6.5. 条件键约束](#65-条件键约束)
- [7. 🤔 多层约束](#7--多层约束)
  - [7.1. 三个参数的约束链](#71-三个参数的约束链)
  - [7.2. 复杂约束关系](#72-复杂约束关系)
  - [7.3. 递归约束](#73-递归约束)
- [8. 🤔 常见错误和最佳实践](#8--常见错误和最佳实践)
  - [8.1. 错误 1：约束顺序错误](#81-错误-1约束顺序错误)
  - [8.2. 错误 2：过度约束](#82-错误-2过度约束)
  - [8.3. 错误 3：循环约束](#83-错误-3循环约束)
  - [8.4. 错误 4：忽略类型兼容性](#84-错误-4忽略类型兼容性)
  - [8.5. 最佳实践](#85-最佳实践)
- [9. 🔗 引用](#9--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 类型参数之间的约束关系
- extends 约束其他类型参数
- keyof 与类型参数结合
- 多层类型参数约束
- 实际应用场景

## 2. 🫧 评价

在泛型约束中使用类型参数是指**一个类型参数可以约束另一个类型参数**。

类型参数约束的特点：

- **参数关联**：建立类型参数之间的关系
- **类型安全**：确保参数间的兼容性
- **灵活性**：在保持安全的同时提供灵活性
- **编译时检查**：在编译时验证类型关系

类型参数约束 vs 独立参数：

| 特性         | 有约束参数 | 独立参数 |
| ------------ | ---------- | -------- |
| **类型关系** | 有依赖     | 无关联   |
| **类型安全** | 更严格     | 较宽松   |
| **使用场景** | 有逻辑关联 | 独立使用 |
| **复杂度**   | 稍高       | 简单     |
| **错误检查** | 更精确     | 基本检查 |

类型参数约束的优势：

1. **保证兼容性**：确保类型参数之间的逻辑关系
2. **精确类型推断**：TypeScript 能推断更精确的类型
3. **防止错误**：在编译时捕获类型不匹配
4. **表达意图**：明确类型参数之间的关系

理解类型参数约束，能帮助你：

1. 编写更安全的泛型函数
2. 建立复杂的类型关系
3. 实现高级类型模式
4. 提高代码的类型安全性

类型参数约束是 TypeScript 高级泛型的核心技巧，是构建复杂类型系统的基础。

## 3. 🤔 什么是类型参数约束？

类型参数约束允许**一个类型参数依赖或约束另一个类型参数**。

```ts
// ❌ 无约束：可能导致类型不匹配
function assign<T, U>(target: T, source: U): T {
  return Object.assign(target, source)
}

const result1 = assign({ a: 1 }, { b: 2, c: 3 })
// result1 的类型是 { a: number }，但实际包含 b 和 c

// ✅ 有约束：确保类型兼容
function assign<T extends U, U>(target: T, source: U): T {
  return Object.assign(target, source)
}

const result2 = assign({ a: 1, b: 0 }, { b: 2 }) // ✅
// const result3 = assign({ a: 1 }, { b: 2 })  // ❌ Error: T 不满足 U 的约束
```

**关键概念**：

- **extends 关键字**：表示一个类型参数继承另一个
- **类型兼容性**：被约束的类型必须兼容约束类型
- **依赖关系**：建立类型参数之间的依赖
- **顺序重要**：约束的类型参数必须先定义

## 4. 🤔 基本语法

### 4.1. 简单约束

```ts
// ✅ K 被约束为 T 的子类型
function copy<T extends K, K>(source: T): K {
  return source
}

// 使用
const result = copy<{ a: number; b: string }, { a: number }>({
  a: 1,
  b: 'hello',
})
// result 的类型是 { a: number }
```

### 4.2. 属性访问约束

```ts
// ✅ K 必须是 T 的键
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const person = { name: 'Alice', age: 30 }
const name = getProperty(person, 'name') // string
const age = getProperty(person, 'age') // number
// getProperty(person, 'email')  // ❌ Error: 'email' 不是 person 的键
```

### 4.3. 反向约束

```ts
// ✅ T 被约束为 K 的子类型
function merge<T extends K, K>(target: K, source: T): K {
  return { ...target, ...source }
}

interface Base {
  id: number
}

interface Extended extends Base {
  name: string
}

const base: Base = { id: 1 }
const extended: Extended = { id: 2, name: 'Alice' }

const result = merge(base, extended) // Base
```

## 5. 🤔 常见模式

### 5.1. 子类型约束

```ts
// ✅ T 必须是 U 的子类型
function copyFields<T extends U, U>(target: T, source: U): T {
  return Object.assign({}, target, source) as T
}

interface Person {
  name: string
}

interface Employee extends Person {
  employeeId: number
}

const employee: Employee = { name: 'Alice', employeeId: 123 }
const person: Person = { name: 'Bob' }

const result = copyFields(employee, person) // Employee
// const invalid = copyFields(person, employee)  // ❌ Error
```

### 5.2. 数组元素约束

```ts
// ✅ 确保数组元素是某个类型的子类型
function filterByType<T, U extends T>(
  arr: T[],
  predicate: (item: T) => item is U
): U[] {
  return arr.filter(predicate)
}

type Animal = { type: string }
type Dog = Animal & { bark: () => void }
type Cat = Animal & { meow: () => void }

const animals: Animal[] = [{ type: 'dog' }, { type: 'cat' }]

function isDog(animal: Animal): animal is Dog {
  return animal.type === 'dog'
}

const dogs = filterByType(animals, isDog) // Dog[]
```

### 5.3. 构造函数约束

```ts
// ✅ C 必须是 T 的构造函数
function create<T, C extends new (...args: any[]) => T>(
  ctor: C,
  ...args: ConstructorParameters<C>
): T {
  return new ctor(...args)
}

class Person {
  constructor(public name: string, public age: number) {}
}

const person = create(Person, 'Alice', 30) // Person
```

### 5.4. 函数参数约束

```ts
// ✅ R 必须是 F 的返回类型
function wrapFunction<F extends (...args: any[]) => R, R>(
  fn: F
): (...args: Parameters<F>) => R {
  return (...args) => {
    console.log('Calling function with', args)
    return fn(...args)
  }
}

function add(a: number, b: number): number {
  return a + b
}

const wrappedAdd = wrapFunction(add)
const result = wrappedAdd(1, 2) // number
```

## 6. 🤔 keyof 结合使用

### 6.1. 单键约束

```ts
// ✅ K 必须是 T 的键
function pick<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user = { id: 1, name: 'Alice', email: 'alice@example.com' }
const name = pick(user, 'name') // string
const id = pick(user, 'id') // number
```

### 6.2. 多键约束

```ts
// ✅ K 是 T 的键的联合
function pickMultiple<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>
  keys.forEach((key) => {
    result[key] = obj[key]
  })
  return result
}

const user = { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 }
const picked = pickMultiple(user, 'name', 'email') // { name: string; email: string }
```

### 6.3. 排除键约束

```ts
// ✅ K 是要排除的键
function omit<T, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
  const result = { ...obj }
  keys.forEach((key) => {
    delete result[key]
  })
  return result
}

const user = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  password: 'secret',
}
const publicUser = omit(user, 'password') // { id: number; name: string; email: string }
```

### 6.4. 嵌套键约束

```ts
// ✅ K 是 T[P] 的键
function getNestedProperty<T, P extends keyof T, K extends keyof T[P]>(
  obj: T,
  prop: P,
  nestedProp: K
): T[P][K] {
  return obj[prop][nestedProp]
}

const user = {
  id: 1,
  profile: {
    name: 'Alice',
    age: 30,
  },
}

const name = getNestedProperty(user, 'profile', 'name') // string
const age = getNestedProperty(user, 'profile', 'age') // number
```

### 6.5. 条件键约束

```ts
// ✅ K 必须是值类型为 V 的键
type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never
}[keyof T]

function getKeysOfType<T, V, K extends KeysOfType<T, V>>(obj: T, key: K): T[K] {
  return obj[key]
}

const data = {
  name: 'Alice',
  age: 30,
  active: true,
  score: 95.5,
}

const num1 = getKeysOfType<typeof data, number, 'age'>(data, 'age') // ✅
const num2 = getKeysOfType<typeof data, number, 'score'>(data, 'score') // ✅
// const str = getKeysOfType<typeof data, number, 'name'>(data, 'name')  // ❌ Error
```

## 7. 🤔 多层约束

### 7.1. 三个参数的约束链

```ts
// ✅ R 约束 K，K 约束 T
function updateNested<T, K extends keyof T, R extends T[K]>(
  obj: T,
  key: K,
  value: R
): T {
  return { ...obj, [key]: value }
}

interface User {
  id: number
  profile: {
    name: string
    age: number
  }
}

const user: User = {
  id: 1,
  profile: { name: 'Alice', age: 30 },
}

const updated = updateNested(user, 'profile', { name: 'Bob', age: 25 })
```

### 7.2. 复杂约束关系

```ts
// ✅ 多个约束相互关联
function transform<T extends object, K extends keyof T, V extends T[K], R>(
  obj: T,
  key: K,
  transformer: (value: V) => R
): T & Record<K, R> {
  return {
    ...obj,
    [key]: transformer(obj[key] as V),
  }
}

const user = { name: 'Alice', age: 30 }
const result = transform(user, 'age', (age) => age.toString())
// result: { name: string; age: string }
```

### 7.3. 递归约束

```ts
// ✅ 递归的类型参数约束
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

function deepMerge<T extends object, U extends DeepPartial<T>>(
  target: T,
  source: U
): T {
  const result = { ...target }

  for (const key in source) {
    const sourceValue = source[key]
    const targetValue = result[key as keyof T]

    if (
      typeof sourceValue === 'object' &&
      sourceValue !== null &&
      typeof targetValue === 'object' &&
      targetValue !== null
    ) {
      ;(result as any)[key] = deepMerge(targetValue as any, sourceValue)
    } else if (sourceValue !== undefined) {
      ;(result as any)[key] = sourceValue
    }
  }

  return result
}

interface Config {
  database: {
    host: string
    port: number
    credentials: {
      username: string
      password: string
    }
  }
  cache: {
    enabled: boolean
  }
}

const defaultConfig: Config = {
  database: {
    host: 'localhost',
    port: 5432,
    credentials: {
      username: 'admin',
      password: 'secret',
    },
  },
  cache: {
    enabled: true,
  },
}

const customConfig = deepMerge(defaultConfig, {
  database: {
    port: 3306,
    credentials: {
      password: 'newpassword',
    },
  },
})
```

## 8. 🤔 常见错误和最佳实践

### 8.1. 错误 1：约束顺序错误

```ts
// ❌ K 在 T 之前使用
// function pick<K extends keyof T, T>(obj: T, key: K): T[K] {
//   return obj[key]
// }

// ✅ 正确顺序：被约束的类型参数在后
function pick<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
```

### 8.2. 错误 2：过度约束

```ts
// ❌ 约束过严
function assign<T extends U, U extends object>(target: T, source: U): T {
  return Object.assign(target, source)
}

// ✅ 适度约束
function assign<T extends object, U extends Partial<T>>(
  target: T,
  source: U
): T {
  return Object.assign({}, target, source)
}
```

### 8.3. 错误 3：循环约束

```ts
// ❌ 循环约束导致错误
// function invalid<T extends U, U extends T>(a: T, b: U): void {}

// ✅ 避免循环约束
function valid<T, U extends T>(source: T, target: U): U {
  return Object.assign({}, source, target) as U
}
```

### 8.4. 错误 4：忽略类型兼容性

```ts
// ❌ 没有确保兼容性
function merge<T, U>(a: T, b: U): T & U {
  return { ...(a as any), ...(b as any) }
}

// ✅ 确保类型兼容
function merge<T extends object, U extends object>(a: T, b: U): T & U {
  return { ...a, ...b }
}
```

### 8.5. 最佳实践

```ts
// ✅ 1. 明确约束关系
function updateField<T, K extends keyof T>(obj: T, key: K, value: T[K]): T {
  return { ...obj, [key]: value }
}

// ✅ 2. 使用 keyof 确保键存在
function pluck<T, K extends keyof T>(arr: T[], key: K): Array<T[K]> {
  return arr.map((item) => item[key])
}

// ✅ 3. 组合多个约束
function sortAndFilter<T, K extends keyof T>(
  arr: T[],
  key: K,
  predicate: (value: T[K]) => boolean
): T[] {
  return arr
    .filter((item) => predicate(item[key]))
    .sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    })
}

// ✅ 4. 条件约束
type Writable<T> = {
  -readonly [P in keyof T]: T[P]
}

function makeWritable<T, K extends keyof T>(
  obj: T,
  key: K
): Writable<Pick<T, K>> {
  return { [key]: obj[key] } as any
}

// ✅ 5. 文档化约束意图
/**
 * 更新对象的属性
 * @template T - 对象类型
 * @template K - T 的键，确保键存在
 */
function update<T, K extends keyof T>(obj: T, key: K, value: T[K]): T {
  return { ...obj, [key]: value }
}

// ✅ 6. 使用工具类型
function pickRequired<T, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Required<Pick<T, K>> {
  const result = {} as Required<Pick<T, K>>
  keys.forEach((key) => {
    const value = obj[key]
    if (value === undefined || value === null) {
      throw new Error(`${String(key)} is required`)
    }
    result[key] = value as Required<Pick<T, K>>[K]
  })
  return result
}

// ✅ 7. 保持约束简单
// 复杂逻辑使用辅助类型
type ValidKey<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never
}[keyof T]

function getByType<T, V, K extends ValidKey<T, V>>(obj: T, key: K): T[K] {
  return obj[key]
}

// ✅ 8. 递归约束要小心
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

function freeze<T extends object>(obj: T): DeepReadonly<T> {
  return Object.freeze(obj) as DeepReadonly<T>
}

// ✅ 9. 约束函数参数和返回值
function transform<T, U extends T, R>(
  value: T,
  validator: (v: T) => v is U,
  transformer: (v: U) => R
): R | null {
  if (validator(value)) {
    return transformer(value)
  }
  return null
}

// ✅ 10. 使用泛型约束实现构建器模式
class QueryBuilder<T> {
  private conditions: Array<(item: T) => boolean> = []

  where<K extends keyof T>(key: K, value: T[K]): QueryBuilder<T> {
    this.conditions.push((item) => item[key] === value)
    return this
  }

  execute(items: T[]): T[] {
    return items.filter((item) =>
      this.conditions.every((condition) => condition(item))
    )
  }
}

interface User {
  id: number
  name: string
  age: number
}

const users: User[] = [
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
]

const result = new QueryBuilder<User>().where('age', 30).execute(users)
```

## 9. 🔗 引用

- [TypeScript Handbook - Generics][1]
- [TypeScript Handbook - Generic Constraints][2]
- [TypeScript Deep Dive - Generics][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/generics.html
[2]: https://www.typescriptlang.org/docs/handbook/2/generics.html#using-type-parameters-in-generic-constraints
[3]: https://basarat.gitbook.io/typescript/type-system/generics
