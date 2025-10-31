# [0230. @template 标记](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0230.%20%40template%20%E6%A0%87%E8%AE%B0)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 @template 标记的作用是什么？](#3--template-标记的作用是什么)
- [4. 🤔 如何使用 @template 创建泛型约束？](#4--如何使用-template-创建泛型约束)
- [5. 🤔 使用 @template 时需要注意哪些问题？](#5--使用-template-时需要注意哪些问题)
- [6. 🔗 引用](#6--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- `@template` 标记的基本用法
- 泛型参数的声明和使用
- 泛型约束的表示
- 多个泛型参数的处理

## 2. 🫧 评价

`@template` 是 JSDoc 中用于声明泛型类型参数的标记，让 JavaScript 函数和类也能使用泛型编程。

- 使 JavaScript 代码支持泛型类型
- 保持类型参数之间的关系
- 支持泛型约束和默认值
- 提供类似 TypeScript 泛型的体验
- 是实现类型安全工具函数的关键

## 3. 🤔 @template 标记的作用是什么？

`@template` 用于声明泛型类型参数：

```javascript
// @ts-check

// 基本泛型函数
/**
 * 返回数组的第一个元素
 * @template T
 * @param {T[]} array - 输入数组
 * @returns {T | undefined} 第一个元素
 */
function first(array) {
  return array[0]
}

const num = first([1, 2, 3]) // num: number | undefined
const str = first(['a', 'b']) // str: string | undefined

// 多个泛型参数
/**
 * 创建键值对
 * @template K, V
 * @param {K} key - 键
 * @param {V} value - 值
 * @returns {[K, V]} 键值对元组
 */
function pair(key, value) {
  return [key, value]
}

const p1 = pair('name', 'Alice') // [string, string]
const p2 = pair(1, 'Alice') // [number, string]

// 泛型类
/**
 * 容器类
 * @template T
 */
class Container {
  /**
   * @param {T} value
   */
  constructor(value) {
    /** @type {T} */
    this.value = value
  }

  /**
   * @returns {T}
   */
  getValue() {
    return this.value
  }

  /**
   * @param {T} newValue
   */
  setValue(newValue) {
    this.value = newValue
  }
}

const numContainer = new Container(42)
const num2 = numContainer.getValue() // number

const strContainer = new Container('hello')
const str2 = strContainer.getValue() // string

// 泛型方法
/**
 * @template T
 */
class Mapper {
  /**
   * @template U
   * @param {T[]} array
   * @param {function(T): U} fn
   * @returns {U[]}
   */
  map(array, fn) {
    return array.map(fn)
  }
}

// 泛型接口（使用 typedef）
/**
 * @template T
 * @typedef {Object} Result
 * @property {boolean} success
 * @property {T} [data]
 * @property {string} [error]
 */

/**
 * @param {string} url
 * @returns {Promise<Result<any>>}
 */
async function fetchAPI(url) {
  try {
    const response = await fetch(url)
    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// 函数返回泛型
/**
 * @template T
 * @param {T} value
 * @returns {function(): T}
 */
function constant(value) {
  return function () {
    return value
  }
}

const getNumber = constant(42)
const n = getNumber() // number

// 泛型数组操作
/**
 * @template T
 * @param {T[]} array
 * @param {function(T): boolean} predicate
 * @returns {T[]}
 */
function filter(array, predicate) {
  return array.filter(predicate)
}

const numbers = filter([1, 2, 3, 4], (n) => n > 2) // number[]
const strings = filter(['a', 'b', 'c'], (s) => s !== 'b') // string[]

// 泛型Promise
/**
 * @template T
 * @param {Promise<T>} promise
 * @returns {Promise<T | null>}
 */
async function safely(promise) {
  try {
    return await promise
  } catch {
    return null
  }
}

// 泛型转换
/**
 * @template T, U
 * @param {T} value
 * @param {function(T): U} transform
 * @returns {U}
 */
function convert(value, transform) {
  return transform(value)
}

const length = convert('hello', (s) => s.length) // number
const upper = convert('hello', (s) => s.toUpperCase()) // string
```

**@template 的位置：**

```javascript
// @ts-check

// 在函数上
/**
 * @template T
 * @param {T} value
 * @returns {T}
 */
function identity(value) {
  return value
}

// 在类上
/**
 * @template T
 */
class Stack {
  constructor() {
    /** @type {T[]} */
    this.items = []
  }

  /**
   * @param {T} item
   */
  push(item) {
    this.items.push(item)
  }

  /**
   * @returns {T | undefined}
   */
  pop() {
    return this.items.pop()
  }
}

// 在 typedef 上
/**
 * @template T
 * @typedef {Object} Box
 * @property {T} value
 */

/**
 * @type {Box<number>}
 */
const numBox = { value: 42 }

// 在回调函数中
/**
 * @callback MapCallback
 * @template T, U
 * @param {T} item
 * @returns {U}
 */
```

## 4. 🤔 如何使用 @template 创建泛型约束？

`@template` 支持泛型约束来限制类型参数：

```javascript
// @ts-check

// 1. 使用 extends 约束
/**
 * @template {string | number} T
 * @param {T} value
 * @returns {string}
 */
function toString(value) {
  return String(value)
}

toString('hello') // ✅ 正确
toString(123) // ✅ 正确
toString(true) // ❌ Error: boolean 不满足约束

// 2. 对象形状约束
/**
 * @template {{ name: string }} T
 * @param {T} obj
 * @returns {string}
 */
function getName(obj) {
  return obj.name
}

getName({ name: 'Alice', age: 30 }) // ✅ 正确
getName({ age: 30 }) // ❌ Error: 缺少 name 属性

// 3. 数组约束
/**
 * @template {any[]} T
 * @param {T} array
 * @returns {T[0]}
 */
function firstElement(array) {
  return array[0]
}

// 4. 函数约束
/**
 * @template {function(...any): any} T
 * @param {T} fn
 * @param {Parameters<T>} args
 * @returns {ReturnType<T>}
 */
function call(fn, args) {
  return fn(...args)
}

// 5. 键约束
/**
 * @template T
 * @template {keyof T} K
 * @param {T} obj
 * @param {K} key
 * @returns {T[K]}
 */
function getProperty(obj, key) {
  return obj[key]
}

const user = { name: 'Alice', age: 30 }
const name = getProperty(user, 'name') // string
const age = getProperty(user, 'age') // number
getProperty(user, 'email') // ❌ Error: 'email' 不在键中

// 6. 多个约束
/**
 * @template {string | number} K
 * @template {{ [key in K]: any }} T
 * @param {T} obj
 * @param {K} key
 * @returns {T[K]}
 */
function getValue(obj, key) {
  return obj[key]
}

// 7. 递归约束
/**
 * @template {{ children?: T[] }} T
 * @param {T} node
 * @returns {number}
 */
function countNodes(node) {
  let count = 1
  if (node.children) {
    for (const child of node.children) {
      count += countNodes(child)
    }
  }
  return count
}

// 8. 构造函数约束
/**
 * @template {new (...args: any[]) => any} T
 * @param {T} Class
 * @returns {InstanceType<T>}
 */
function createInstance(Class) {
  return new Class()
}

// 9. Promise 约束
/**
 * @template {Promise<any>} T
 * @param {T} promise
 * @returns {Promise<Awaited<T>>}
 */
async function unwrap(promise) {
  return await promise
}

// 10. 联合约束
/**
 * @template {'add' | 'subtract' | 'multiply'} T
 * @param {T} operation
 * @returns {function(number, number): number}
 */
function getOperator(operation) {
  switch (operation) {
    case 'add':
      return (a, b) => a + b
    case 'subtract':
      return (a, b) => a - b
    case 'multiply':
      return (a, b) => a * b
  }
}

// 11. 使用导入的类型约束
/**
 * @typedef {import('./types').User} User
 */

/**
 * @template {User} T
 * @param {T} user
 * @returns {T['name']}
 */
function getUserName(user) {
  return user.name
}

// 12. 数组元素约束
/**
 * @template {ReadonlyArray<any>} T
 * @param {T} array
 * @returns {T[number]}
 */
function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)]
}

// 13. 复杂对象约束
/**
 * @template {{ id: number | string }} T
 * @param {T[]} items
 * @param {T['id']} id
 * @returns {T | undefined}
 */
function findById(items, id) {
  return items.find((item) => item.id === id)
}

// 14. 函数参数约束
/**
 * @template {(...args: any[]) => any} T
 * @param {T} fn
 * @returns {(...args: Parameters<T>) => ReturnType<T>}
 */
function memoize(fn) {
  const cache = new Map()
  return function (...args) {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)
    }
    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}

// 15. 默认类型参数
/**
 * @template [T=string]
 * @param {T} [value]
 * @returns {T}
 */
function defaultValue(value = 'default') {
  return value
}

// 16. 多重约束链
/**
 * @template T
 * @template {keyof T} K
 * @template {T[K]} V
 * @param {T} obj
 * @param {K} key
 * @param {V} value
 */
function setProperty(obj, key, value) {
  obj[key] = value
}

// 17. 条件类型约束
/**
 * @template T
 * @template {T extends string ? string : number} U
 * @param {T} value
 * @returns {U}
 */
function process(value) {
  return typeof value === 'string' ? value : 0
}

// 18. 映射类型约束
/**
 * @template {{ [key: string]: any }} T
 * @param {T} obj
 * @returns {{ [K in keyof T]: T[K][] }}
 */
function arrayify(obj) {
  const result = {}
  for (const key in obj) {
    result[key] = [obj[key]]
  }
  return result
}

// 19. 元组约束
/**
 * @template {[any, any, ...any[]]} T
 * @param {T} tuple
 * @returns {T}
 */
function ensureMinLength(tuple) {
  return tuple
}

// 20. 类型保护约束
/**
 * @template T
 * @template {(value: unknown) => value is T} Guard
 * @param {unknown} value
 * @param {Guard} guard
 * @returns {T | null}
 */
function safeCast(value, guard) {
  return guard(value) ? value : null
}
```

## 5. 🤔 使用 @template 时需要注意哪些问题？

使用 `@template` 的注意事项：

```javascript
// @ts-check

// 注意 1：泛型参数的命名
// ⚠️ 不好：名称不清晰
/**
 * @template X, Y
 * @param {X} a
 * @param {Y} b
 */
function func1(a, b) {}

// ✅ 好：使用有意义的名称
/**
 * @template TKey, TValue
 * @param {TKey} key
 * @param {TValue} value
 */
function createEntry(key, value) {}

// 常用命名约定：T, U, V 或 TData, TResult, TKey 等

// 注意 2：泛型参数的位置
// @template 必须在使用前声明

/**
 * @template T
 * @param {T[]} array
 * @returns {T}
 */
function first(array) {
  return array[0]
}

// 注意 3：避免过度泛型化
// ⚠️ 不好：不必要的泛型
/**
 * @template T
 * @param {T} value
 * @returns {T}
 */
function logValue(value) {
  console.log(value)
  return value
}

// ✅ 好：简单函数不需要泛型
/**
 * @param {any} value
 */
function logValue2(value) {
  console.log(value)
}

// 注意 4：泛型约束的必要性
// ⚠️ 不好：没有约束，可能导致运行时错误
/**
 * @template T
 * @param {T} value
 * @returns {number}
 */
function getLength1(value) {
  return value.length // ⚠️ T 可能没有 length 属性
}

// ✅ 好：添加约束
/**
 * @template {{ length: number }} T
 * @param {T} value
 * @returns {number}
 */
function getLength2(value) {
  return value.length
}

// 注意 5：多个泛型参数的关系
/**
 * @template T
 * @template U
 * @param {T} source
 * @param {function(T): U} transform
 * @returns {U}
 */
function map(source, transform) {
  return transform(source)
}

// 注意 6：泛型类的实例化
/**
 * @template T
 */
class Box {
  /**
   * @param {T} value
   */
  constructor(value) {
    /** @type {T} */
    this.value = value
  }
}

// ⚠️ JavaScript 无法直接指定泛型参数
const box = new Box(42) // 类型推断为 Box<number>

// 如果需要明确类型，使用类型注解
/** @type {Box<string>} */
const stringBox = new Box('hello')

// 注意 7：泛型和 this 类型
/**
 * @template T
 */
class Builder {
  /**
   * @param {T} value
   * @returns {this}
   */
  setValue(value) {
    this.value = value
    return this
  }
}

// 注意 8：泛型默认值
// ⚠️ 默认值语法支持有限
/**
 * @template [T=string]
 * @param {T} [value]
 * @returns {T}
 */
function withDefault(value = 'default') {
  return value
}

// 注意 9：泛型类型推断
/**
 * @template T
 * @param {T[]} array
 * @returns {T}
 */
function first(array) {
  return array[0]
}

// 类型会自动推断
const num = first([1, 2, 3]) // T 推断为 number
const str = first(['a', 'b']) // T 推断为 string

// 注意 10：复杂泛型约束的可读性
// ⚠️ 不好：过于复杂
/**
 * @template {{ [key: string]: { id: number, data: { value: string }[] }}} T
 * @param {T} obj
 */
function complex1(obj) {}

// ✅ 好：使用 typedef 分解
/**
 * @typedef {Object} DataItem
 * @property {string} value
 */

/**
 * @typedef {Object} Entry
 * @property {number} id
 * @property {DataItem[]} data
 */

/**
 * @template {{ [key: string]: Entry }} T
 * @param {T} obj
 */
function complex2(obj) {}

// 注意 11：泛型和函数重载
// JSDoc 中函数重载需要特殊处理

/**
 * @overload
 * @param {string} value
 * @returns {number}
 */

/**
 * @overload
 * @param {number} value
 * @returns {string}
 */

/**
 * @param {string | number} value
 * @returns {string | number}
 */
function convert(value) {
  return typeof value === 'string' ? parseInt(value) : String(value)
}

// 注意 12：泛型和可选参数
/**
 * @template T
 * @param {T[]} array
 * @param {number} [index=0]
 * @returns {T | undefined}
 */
function at(array, index = 0) {
  return array[index]
}

// 注意 13：泛型的继承关系
/**
 * @template T
 */
class Animal {
  /**
   * @param {T} name
   */
  constructor(name) {
    this.name = name
  }
}

/**
 * @template T
 * @extends {Animal<T>}
 */
class Dog extends Animal {
  /**
   * @param {T} name
   * @param {string} breed
   */
  constructor(name, breed) {
    super(name)
    this.breed = breed
  }
}

// 注意 14：泛型和 Promise
/**
 * @template T
 * @param {Promise<T>} promise
 * @returns {Promise<T | null>}
 */
async function safely(promise) {
  try {
    return await promise
  } catch {
    return null
  }
}

// 注意 15：泛型类型参数的使用位置
/**
 * @template T
 * @param {T} value - T 用作参数类型
 * @returns {T} - T 用作返回类型
 */
function identity(value) {
  /** @type {T} */ // ❌ 错误：不能在函数体内使用泛型参数
  let temp = value
  return value
}

// 注意 16：与类型导入配合
/**
 * @typedef {import('./types').User} User
 */

/**
 * @template {User} T
 * @param {T} user
 * @returns {T}
 */
function processUser(user) {
  return user
}

// 注意 17：避免泛型循环依赖
// ⚠️ 可能导致类型推断问题
/**
 * @template T
 * @param {T} value
 * @returns {T extends Array<infer U> ? U : T}
 */
function unwrapArray(value) {
  return Array.isArray(value) ? value[0] : value
}

// 注意 18：泛型和类型守卫
/**
 * @template T
 * @param {unknown} value
 * @returns {value is T}
 */
function isType(value) {
  // ⚠️ 无法在运行时检查泛型类型
  return true // 这只是示例，实际需要具体的类型检查逻辑
}

// 注意 19：文档化泛型参数
/**
 * 创建键值对映射
 *
 * @template TKey - 键的类型，必须是 string 或 number
 * @template TValue - 值的类型
 * @param {TKey[]} keys - 键数组
 * @param {TValue[]} values - 值数组
 * @returns {Map<TKey, TValue>} 键值对映射
 */
function createMap(keys, values) {
  const map = new Map()
  keys.forEach((key, i) => map.set(key, values[i]))
  return map
}

// 注意 20：测试泛型函数
/**
 * @template T
 * @param {T[]} array
 * @returns {T | undefined}
 */
function first(array) {
  return array[0]
}

// 确保类型推断正确
const n = first([1, 2, 3]) // n 应该是 number | undefined
const s = first(['a', 'b']) // s 应该是 string | undefined
```

## 6. 🔗 引用

- [TypeScript Handbook - JSDoc @template][1]
- [JSDoc @template Tag][2]
- [Generics in JSDoc][3]

[1]: https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#template
[2]: https://jsdoc.app/tags-template.html
[3]: https://github.com/Microsoft/TypeScript/wiki/JSDoc-support-in-JavaScript#template
