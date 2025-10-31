# [0227. @type 标记](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0227.%20%40type%20%E6%A0%87%E8%AE%B0)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 @type 标记的作用是什么？](#3--type-标记的作用是什么)
- [4. 🤔 如何使用 @type 标记复杂类型？](#4--如何使用-type-标记复杂类型)
- [5. 🤔 使用 @type 时需要注意哪些问题？](#5--使用-type-时需要注意哪些问题)
- [6. 🔗 引用](#6--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- `@type` 标记的基本用法
- 变量和属性的类型注解
- 复杂类型的声明
- 类型导入和引用

## 2. 🫧 评价

`@type` 是 JSDoc 中最常用的标记之一，用于为变量、属性和表达式添加类型注解。

- 语法简单，适合为单个变量添加类型
- 支持内联类型和类型导入
- 可以声明数组、对象、联合类型等复杂类型
- 配合 `@ts-check` 可以启用类型检查
- 比直接声明 TypeScript 类型更灵活，但也更冗长

## 3. 🤔 @type 标记的作用是什么？

`@type` 用于声明变量、属性或表达式的类型：

```javascript
// @ts-check

// 基本类型
/** @type {string} */
let name = 'Alice'

/** @type {number} */
let age = 30

/** @type {boolean} */
let isActive = true

/** @type {null} */
let empty = null

/** @type {undefined} */
let notDefined = undefined

// 类型约束
name = 'Bob' // ✅ 正确
name = 123 // ❌ Error: Type 'number' is not assignable to type 'string'

// 数组类型
/** @type {string[]} */
let names = ['Alice', 'Bob']

/** @type {Array<number>} */
let numbers = [1, 2, 3]

// 对象类型
/** @type {{ name: string, age: number }} */
let person = {
  name: 'Alice',
  age: 30,
}

// 联合类型
/** @type {string | number} */
let id = 'user-123'
id = 456 // ✅ 正确

// 函数类型
/** @type {(x: number, y: number) => number} */
let add = (x, y) => x + y

/** @type {function(string): boolean} */
let isValid = (str) => str.length > 0

// 泛型类型
/** @type {Promise<string>} */
let asyncData = Promise.resolve('data')

/** @type {Map<string, number>} */
let scoreMap = new Map()

/** @type {Set<string>} */
let uniqueNames = new Set()

// 类实例类型
class User {
  constructor(name) {
    this.name = name
  }
}

/** @type {User} */
let user = new User('Alice')

// 类类型（构造函数）
/** @type {typeof User} */
let UserClass = User

// 元组类型
/** @type {[string, number]} */
let tuple = ['Alice', 30]

// 只读数组
/** @type {ReadonlyArray<number>} */
let readonlyNumbers = [1, 2, 3]
```

**在对象属性中使用：**

```javascript
// @ts-check

const config = {
  /** @type {string} */
  apiUrl: 'https://api.example.com',

  /** @type {number} */
  timeout: 5000,

  /** @type {string[]} */
  endpoints: ['/users', '/posts'],

  /** @type {{ [key: string]: string }} */
  headers: {
    'Content-Type': 'application/json',
  },
}

// 类属性
class Database {
  constructor() {
    /** @type {string} */
    this.connectionString = ''

    /** @type {number} */
    this.maxConnections = 10

    /** @type {boolean} */
    this.isConnected = false
  }
}

// 模块导出
/** @type {string} */
const API_KEY = 'secret-key'

/** @type {{ host: string, port: number }} */
const serverConfig = {
  host: 'localhost',
  port: 3000,
}

module.exports = { API_KEY, serverConfig }
```

**类型转换（类型断言）：**

```javascript
// @ts-check

// 使用 @type 进行类型转换
const data = JSON.parse('{"name":"Alice"}')

/** @type {{ name: string }} */
const typedData = data

// 更复杂的转换
/** @type {HTMLInputElement} */
const input = document.getElementById('username')

/** @type {Array<{ id: number, title: string }>} */
const posts = fetchPosts()
```

## 4. 🤔 如何使用 @type 标记复杂类型？

`@type` 可以声明各种复杂类型：

```javascript
// @ts-check

// 1. 嵌套对象类型
/** @type {{ user: { name: string, email: string }, timestamp: number }} */
let userData = {
  user: {
    name: 'Alice',
    email: 'alice@example.com',
  },
  timestamp: Date.now(),
}

// 2. 可选属性
/** @type {{ name: string, age?: number }} */
let person = {
  name: 'Alice',
  // age 是可选的
}

// 3. 索引签名
/** @type {{ [key: string]: number }} */
let scores = {
  math: 95,
  english: 87,
}

// 4. 数组和对象的组合
/** @type {Array<{ id: number, name: string }>} */
let users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
]

// 5. 联合类型
/** @type {string | number | boolean} */
let mixed = 'hello'

/** @type {'success' | 'error' | 'pending'} */
let status = 'pending'

// 6. 交叉类型（使用 & ）
/** @type {{ name: string } & { age: number }} */
let personWithAge = {
  name: 'Alice',
  age: 30,
}

// 7. 函数签名
/** @type {(name: string, age: number) => string} */
let formatUser = (name, age) => `${name} (${age})`

/** @type {(...args: number[]) => number} */
let sum = (...args) => args.reduce((a, b) => a + b, 0)

// 8. 回调函数
/** @type {(callback: (error: Error | null, data: string) => void) => void} */
let asyncOperation = (callback) => {
  setTimeout(() => {
    callback(null, 'data')
  }, 1000)
}

// 9. Promise 类型
/** @type {Promise<{ data: string[], count: number }>} */
let fetchData = fetch('/api/data').then((res) => res.json())

// 10. 泛型约束
/** @type {Map<string, { id: number, name: string }>} */
let userMap = new Map()

/** @type {Set<number>} */
let idSet = new Set([1, 2, 3])

// 11. 导入类型
/** @type {import('./types').User} */
let importedUser = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
}

/** @type {import('./types').ApiResponse<string>} */
let apiResponse = {
  success: true,
  data: 'result',
}

// 12. 类型别名引用
/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {number} price
 */

/** @type {Product} */
let product = {
  id: 1,
  name: 'Book',
  price: 29.99,
}

/** @type {Product[]} */
let products = [product]

// 13. 构造函数类型
/** @type {new (name: string) => { name: string }} */
let Constructor = class {
  constructor(name) {
    this.name = name
  }
}

// 14. This 类型
const obj = {
  value: 42,
  /** @type {function(this: { value: number }): number} */
  getValue: function () {
    return this.value
  },
}

// 15. 类型保护
/** @type {(value: unknown) => value is string} */
let isString = (value) => typeof value === 'string'

// 16. 只读类型
/** @type {Readonly<{ name: string, age: number }>} */
let readonlyPerson = {
  name: 'Alice',
  age: 30,
}

// readonlyPerson.age = 31; // ❌ Error: Cannot assign to 'age'

// 17. 部分类型
/** @type {Partial<{ name: string, age: number, email: string }>} */
let partialUser = {
  name: 'Alice',
  // age 和 email 是可选的
}

// 18. 记录类型
/** @type {Record<string, number>} */
let stringToNumber = {
  one: 1,
  two: 2,
  three: 3,
}

// 19. 条件类型（通过字符串字面量）
/** @type {'loading' | 'success' | 'error'} */
let loadingState = 'loading'

// 20. 数组元素类型提取
/**
 * @typedef {string[]} StringArray
 */

/** @type {StringArray[number]} */
let arrayElement = 'item'
```

## 5. 🤔 使用 @type 时需要注意哪些问题？

使用 `@type` 的注意事项：

```javascript
// @ts-check

// 注意 1：类型断言的安全性
const rawData = getData()

// ⚠️ 不安全的断言
/** @type {{ name: string }} */
const data = rawData // 没有运行时检查

// ✅ 更好的方式：使用类型守卫
/**
 * @param {any} value
 * @returns {value is { name: string }}
 */
function isValidData(value) {
  return value && typeof value.name === 'string'
}

if (isValidData(rawData)) {
  // 这里 rawData 被安全地收窄为 { name: string }
  console.log(rawData.name)
}

// 注意 2：不要过度使用
// ❌ 不好：每个变量都标注
/** @type {number} */
const a = 1
/** @type {number} */
const b = 2
/** @type {number} */
const c = a + b

// ✅ 好：让 TypeScript 自动推断
const x = 1 // 自动推断为 number
const y = 2
const z = x + y

// 注意 3：复杂类型使用 typedef
// ❌ 不好：重复的复杂类型
/** @type {{ id: number, name: string, email: string }} */
let user1 = { id: 1, name: 'Alice', email: 'alice@example.com' }

/** @type {{ id: number, name: string, email: string }} */
let user2 = { id: 2, name: 'Bob', email: 'bob@example.com' }

// ✅ 好：定义类型别名
/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} email
 */

/** @type {User} */
let user3 = { id: 1, name: 'Alice', email: 'alice@example.com' }

/** @type {User} */
let user4 = { id: 2, name: 'Bob', email: 'bob@example.com' }

// 注意 4：类型与值的分离
// ⚠️ @type 只影响类型检查，不影响运行时
/** @type {string} */
let value = 123 // 编译时错误，但运行时 value 是 123

// 注意 5：类型兼容性
/** @type {{ name: string }} */
let obj1 = { name: 'Alice', age: 30 } // ✅ 多余属性在赋值时被忽略

let obj2 = { name: 'Bob', age: 25 }
/** @type {{ name: string }} */
let obj3 = obj2 // ✅ 正确

// 注意 6：联合类型的使用
/** @type {string | number} */
let id = 'user-123'

// ⚠️ 使用前需要类型守卫
// id.toUpperCase(); // ❌ Error: Property 'toUpperCase' does not exist on type 'string | number'

// ✅ 正确使用
if (typeof id === 'string') {
  id.toUpperCase() // ✅ 类型被收窄为 string
}

// 注意 7：数组类型的两种写法
/** @type {string[]} */
let arr1 = ['a', 'b']

/** @type {Array<string>} */
let arr2 = ['a', 'b']

// 两种写法等价，推荐使用第一种（更简洁）

// 注意 8：函数类型的声明
// 方式 1：箭头函数语法
/** @type {(x: number) => number} */
let fn1 = (x) => x * 2

// 方式 2：function 关键字
/** @type {function(number): number} */
let fn2 = (x) => x * 2

// 推荐使用方式 1（更接近 TypeScript 语法）

// 注意 9：类型导入的路径
// ⚠️ 确保路径正确
/** @type {import('./nonexistent').User} */ // ❌ 错误：文件不存在
let user

// ✅ 使用正确的路径
/** @type {import('./types').User} */
let validUser

// 注意 10：与 TypeScript 的兼容性
// JSDoc 类型在 TypeScript 中也能工作
// 但某些高级特性可能不支持

// ✅ 支持
/** @type {Record<string, number>} */
let map1 = {}

// ⚠️ 某些映射类型可能不支持
// 如果遇到问题，考虑迁移到 .ts 文件

// 注意 11：类型的位置
// @type 必须在变量声明之前

/** @type {string} */
let name1 = 'Alice' // ✅ 正确

let name2 = 'Bob'
/** @type {string} */ // ⚠️ 这个注释不会生效
let name3 = 'Charlie'

// 注意 12：在表达式中使用
// @type 也可以用于表达式
const result = /** @type {string} */ (unknownValue)

// 等价于 TypeScript 的
// const result = unknownValue as string;

// 注意 13：避免循环引用
/**
 * @typedef {Object} Node
 * @property {string} value
 * @property {Node} [next]
 */

/** @type {Node} */
let linkedList = {
  value: 'a',
  next: {
    value: 'b',
    next: undefined,
  },
}

// 注意 14：类型的可读性
// ⚠️ 太复杂的内联类型
/** @type {{ user: { profile: { name: string, avatar: string }, settings: { theme: string, language: string }}, meta: { createdAt: number, updatedAt: number }}} */
let complexData

// ✅ 使用 typedef 提高可读性
/**
 * @typedef {Object} Profile
 * @property {string} name
 * @property {string} avatar
 */

/**
 * @typedef {Object} Settings
 * @property {string} theme
 * @property {string} language
 */

/**
 * @typedef {Object} Meta
 * @property {number} createdAt
 * @property {number} updatedAt
 */

/**
 * @typedef {Object} ComplexData
 * @property {{ profile: Profile, settings: Settings }} user
 * @property {Meta} meta
 */

/** @type {ComplexData} */
let betterComplexData

// 注意 15：与 JSDoc 其他标记配合
/**
 * 用户配置
 * @type {{ apiKey: string, endpoint: string }}
 * @readonly
 */
const CONFIG = {
  apiKey: 'secret',
  endpoint: 'https://api.example.com',
}
```

## 6. 🔗 引用

- [TypeScript Handbook - JSDoc @type][1]
- [JSDoc @type Tag][2]
- [Type Annotations in JavaScript][3]

[1]: https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#type
[2]: https://jsdoc.app/tags-type.html
[3]: https://github.com/Microsoft/TypeScript/wiki/JSDoc-support-in-JavaScript
