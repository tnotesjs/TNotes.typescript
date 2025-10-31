# [0228. @param 标记](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0228.%20%40param%20%E6%A0%87%E8%AE%B0)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 @param 标记的作用是什么？](#3--param-标记的作用是什么)
- [4. 🤔 如何使用 @param 标记复杂参数？](#4--如何使用-param-标记复杂参数)
- [5. 🤔 使用 @param 时需要注意哪些问题？](#5--使用-param-时需要注意哪些问题)
- [6. 🔗 引用](#6--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- `@param` 标记的基本用法
- 可选参数、默认参数和剩余参数
- 对象参数和解构参数
- 函数参数的类型注解

## 2. 🫧 评价

`@param` 是 JSDoc 中用于描述函数参数类型的标记，为函数提供完整的类型信息和文档说明。

- 语法清晰，同时提供类型和文档
- 支持可选参数、默认值、剩余参数等
- 可以描述复杂的对象参数和解构
- 配合 `@ts-check` 提供参数类型检查
- 是函数文档的重要组成部分

## 3. 🤔 @param 标记的作用是什么？

`@param` 用于描述函数参数的类型和说明：

```javascript
// @ts-check

// 基本用法
/**
 * 计算两个数的和
 * @param {number} a - 第一个数字
 * @param {number} b - 第二个数字
 * @returns {number} 两数之和
 */
function add(a, b) {
  return a + b
}

add(1, 2) // ✅ 正确
add('1', 2) // ❌ Error: Argument of type 'string' is not assignable to parameter of type 'number'

// 多种类型
/**
 * @param {string} name - 用户名
 * @param {number} age - 年龄
 * @param {boolean} isActive - 是否激活
 */
function createUser(name, age, isActive) {
  return { name, age, isActive }
}

// 联合类型
/**
 * @param {string | number} id - 用户 ID
 */
function getUser(id) {
  console.log(id)
}

getUser('user-123') // ✅ 正确
getUser(456) // ✅ 正确
getUser(true) // ❌ Error

// 数组类型
/**
 * @param {string[]} names - 名字列表
 * @param {Array<number>} scores - 分数列表
 */
function processData(names, scores) {
  // ...
}

// 对象类型
/**
 * @param {{ name: string, age: number }} user - 用户对象
 */
function displayUser(user) {
  console.log(`${user.name} is ${user.age} years old`)
}

// 函数类型
/**
 * @param {(x: number) => number} fn - 转换函数
 * @param {number} value - 要转换的值
 */
function transform(fn, value) {
  return fn(value)
}

// 可选参数
/**
 * @param {string} message - 消息内容
 * @param {number} [times=1] - 重复次数（可选，默认为 1）
 */
function repeat(message, times = 1) {
  return message.repeat(times)
}

repeat('hello') // ✅ 正确
repeat('hello', 3) // ✅ 正确

// 剩余参数
/**
 * @param {...number} numbers - 数字列表
 * @returns {number} 所有数字的和
 */
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0)
}

sum(1, 2, 3, 4) // ✅ 正确

// 泛型参数（通过 @template）
/**
 * @template T
 * @param {T[]} array - 输入数组
 * @returns {T | undefined} 第一个元素
 */
function first(array) {
  return array[0]
}

const num = first([1, 2, 3]) // num: number | undefined
const str = first(['a', 'b']) // str: string | undefined
```

**参数名称的不同写法：**

```javascript
// @ts-check

// 短格式（仅类型）
/**
 * @param {string} name
 * @param {number} age
 */
function func1(name, age) {}

// 完整格式（类型 + 说明）
/**
 * @param {string} name - 用户名
 * @param {number} age - 年龄
 */
function func2(name, age) {}

// 多行说明
/**
 * @param {string} query - 搜索查询
 *   支持通配符和正则表达式
 *   最大长度为 100 个字符
 */
function search(query) {}

// 参数别名（实际参数名不同）
/**
 * @param {string} username - 用户名
 */
function login(user) {
  // 参数名可以不同
  console.log(user)
}
```

## 4. 🤔 如何使用 @param 标记复杂参数？

`@param` 可以描述各种复杂的参数类型：

```javascript
// @ts-check

// 1. 对象参数的属性
/**
 * @param {Object} options - 配置选项
 * @param {string} options.url - API 地址
 * @param {number} options.timeout - 超时时间
 * @param {string[]} [options.headers] - 请求头（可选）
 */
function fetchData(options) {
  // ...
}

fetchData({
  url: 'https://api.example.com',
  timeout: 5000,
}) // ✅ 正确

// 2. 嵌套对象参数
/**
 * @param {Object} user - 用户信息
 * @param {string} user.name - 用户名
 * @param {Object} user.address - 地址信息
 * @param {string} user.address.city - 城市
 * @param {string} user.address.street - 街道
 */
function processUser(user) {
  console.log(user.address.city)
}

// 3. 使用 typedef 简化复杂对象
/**
 * @typedef {Object} UserOptions
 * @property {string} name - 用户名
 * @property {number} age - 年龄
 * @property {string} email - 邮箱
 * @property {boolean} [isActive] - 是否激活（可选）
 */

/**
 * @param {UserOptions} options - 用户选项
 */
function createUser(options) {
  return {
    id: Date.now(),
    ...options,
  }
}

// 4. 回调函数参数
/**
 * @param {number[]} array - 数字数组
 * @param {function(number, number): number} callback - 累加器函数
 * @param {number} [initialValue=0] - 初始值
 * @returns {number}
 */
function reduce(array, callback, initialValue = 0) {
  return array.reduce(callback, initialValue)
}

// 5. 解构参数
/**
 * @param {Object} props - 属性对象
 * @param {string} props.firstName - 名
 * @param {string} props.lastName - 姓
 * @param {number} [props.age] - 年龄
 */
function greet({ firstName, lastName, age }) {
  console.log(`Hello, ${firstName} ${lastName}`)
  if (age) {
    console.log(`You are ${age} years old`)
  }
}

// 6. 数组解构参数
/**
 * @param {[number, number]} coordinates - 坐标 [x, y]
 */
function plotPoint([x, y]) {
  console.log(`Point at (${x}, ${y})`)
}

// 7. 剩余参数（具体类型）
/**
 * @param {string} separator - 分隔符
 * @param {...string} strings - 要连接的字符串
 * @returns {string}
 */
function join(separator, ...strings) {
  return strings.join(separator)
}

// 8. 可变参数类型
/**
 * @param {string | number} value - 值
 * @param {Object} [options] - 选项
 * @param {boolean} [options.uppercase] - 是否转大写
 * @param {number} [options.precision] - 数字精度
 */
function format(value, options = {}) {
  if (typeof value === 'string' && options.uppercase) {
    return value.toUpperCase()
  }
  if (typeof value === 'number' && options.precision) {
    return value.toFixed(options.precision)
  }
  return String(value)
}

// 9. Promise 参数
/**
 * @param {Promise<string>} promise - 异步数据
 * @param {function(string): void} callback - 成功回调
 * @returns {Promise<void>}
 */
async function handlePromise(promise, callback) {
  const result = await promise
  callback(result)
}

// 10. 泛型回调
/**
 * @template T
 * @param {T[]} array - 数组
 * @param {function(T, number, T[]): boolean} predicate - 测试函数
 * @returns {T | undefined}
 */
function find(array, predicate) {
  return array.find(predicate)
}

// 11. 类实例参数
class User {
  constructor(name) {
    this.name = name
  }
}

/**
 * @param {User} user - 用户实例
 */
function processUser(user) {
  console.log(user.name)
}

// 12. 类构造函数参数
/**
 * @param {typeof User} UserClass - User 类
 * @param {string} name - 用户名
 * @returns {User}
 */
function createInstance(UserClass, name) {
  return new UserClass(name)
}

// 13. 混合类型参数
/**
 * @param {string | number | { toString(): string }} value - 值
 */
function display(value) {
  console.log(String(value))
}

// 14. 元组类型参数
/**
 * @param {[string, number, boolean]} tuple - 元组
 */
function processTuple([str, num, bool]) {
  console.log(str, num, bool)
}

// 15. 导入的类型参数
/**
 * @param {import('./types').User} user - 用户对象
 * @param {import('./types').Config} config - 配置对象
 */
function initialize(user, config) {
  // ...
}

// 16. 联合对象类型
/**
 * @typedef {Object} SuccessResponse
 * @property {'success'} status
 * @property {any} data
 */

/**
 * @typedef {Object} ErrorResponse
 * @property {'error'} status
 * @property {string} message
 */

/**
 * @param {SuccessResponse | ErrorResponse} response - API 响应
 */
function handleResponse(response) {
  if (response.status === 'success') {
    console.log(response.data)
  } else {
    console.error(response.message)
  }
}

// 17. 可选链参数
/**
 * @param {Object} data - 数据对象
 * @param {Object} [data.user] - 用户信息
 * @param {string} [data.user.name] - 用户名
 * @param {number} [data.user.age] - 年龄
 */
function processData(data) {
  console.log(data.user?.name)
}

// 18. 只读参数
/**
 * @param {Readonly<{ name: string, age: number }>} user - 只读用户对象
 */
function displayReadonlyUser(user) {
  console.log(user.name)
  // user.name = 'New'; // ❌ Error: Cannot assign to 'name'
}

// 19. 记录类型参数
/**
 * @param {Record<string, number>} scores - 分数映射
 */
function calculateAverage(scores) {
  const values = Object.values(scores)
  return values.reduce((a, b) => a + b) / values.length
}

// 20. this 参数
/**
 * @this {{ value: number }}
 * @param {number} increment - 增量
 */
function addToValue(increment) {
  return this.value + increment
}
```

## 5. 🤔 使用 @param 时需要注意哪些问题？

使用 `@param` 的注意事项：

```javascript
// @ts-check

// 注意 1：参数顺序必须一致
/**
 * @param {string} name
 * @param {number} age
 */
function func1(name, age) {} // ✅ 正确

/**
 * @param {number} age
 * @param {string} name
 */
function func2(name, age) {} // ⚠️ 顺序不一致，可能导致混淆

// 注意 2：不要遗漏参数
/**
 * @param {string} name
 * // ⚠️ 忘记标注 age 参数
 */
function func3(name, age) {}

// ✅ 完整标注
/**
 * @param {string} name
 * @param {number} age
 */
function func4(name, age) {}

// 注意 3：可选参数的标记方式
// 方式 1：使用 []
/**
 * @param {string} name
 * @param {number} [age] - 可选
 */
function greet1(name, age) {}

// 方式 2：使用默认值
/**
 * @param {string} name
 * @param {number} [age=18] - 默认 18
 */
function greet2(name, age = 18) {}

// 注意 4：对象参数的完整性
// ⚠️ 不完整
/**
 * @param {Object} options
 */
function fetch1(options) {}

// ✅ 详细描述
/**
 * @param {Object} options
 * @param {string} options.url
 * @param {number} [options.timeout]
 * @param {{ [key: string]: string }} [options.headers]
 */
function fetch2(options) {}

// 或者使用 typedef
/**
 * @typedef {Object} FetchOptions
 * @property {string} url
 * @property {number} [timeout]
 * @property {{ [key: string]: string }} [headers]
 */

/**
 * @param {FetchOptions} options
 */
function fetch3(options) {}

// 注意 5：解构参数的文档
// ⚠️ 不清楚
/**
 * @param {Object} user
 */
function display1({ name, age }) {}

// ✅ 清楚
/**
 * @param {Object} user
 * @param {string} user.name
 * @param {number} user.age
 */
function display2({ name, age }) {}

// 注意 6：剩余参数类型
// ⚠️ 类型不明确
/**
 * @param {...any} args
 */
function sum1(...args) {}

// ✅ 明确类型
/**
 * @param {...number} numbers
 */
function sum2(...numbers) {
  return numbers.reduce((a, b) => a + b, 0)
}

// 注意 7：回调函数的详细说明
// ⚠️ 简略
/**
 * @param {Function} callback
 */
function process1(callback) {}

// ✅ 详细
/**
 * @param {function(Error | null, string): void} callback - 回调函数
 *   第一个参数是错误对象（如果有）
 *   第二个参数是结果字符串
 */
function process2(callback) {}

// 注意 8：避免使用 any
// ❌ 不好
/**
 * @param {any} data
 */
function handle1(data) {}

// ✅ 好：使用 unknown 并添加类型守卫
/**
 * @param {unknown} data
 */
function handle2(data) {
  if (typeof data === 'string') {
    console.log(data.toUpperCase())
  }
}

// 注意 9：泛型参数的使用
// ⚠️ 没有泛型
/**
 * @param {any[]} array
 * @returns {any}
 */
function first1(array) {
  return array[0]
}

// ✅ 使用泛型
/**
 * @template T
 * @param {T[]} array
 * @returns {T | undefined}
 */
function first2(array) {
  return array[0]
}

// 注意 10：参数验证文档化
/**
 * 创建用户
 *
 * @param {string} name - 用户名（3-20 字符）
 * @param {string} email - 邮箱（必须有效格式）
 * @param {number} age - 年龄（18-120）
 * @throws {Error} 当参数无效时
 */
function createUser(name, email, age) {
  if (name.length < 3 || name.length > 20) {
    throw new Error('Invalid name length')
  }
  if (age < 18 || age > 120) {
    throw new Error('Invalid age')
  }
  // ...
}

// 注意 11：this 参数
/**
 * @this {{ value: number }}
 * @param {number} x
 */
function multiply(x) {
  return this.value * x
}

const obj = {
  value: 10,
  multiply,
}

obj.multiply(5) // ✅ 正确：this.value 是 10

// 注意 12：异步函数参数
/**
 * @param {string} url
 * @param {Object} [options]
 * @param {number} [options.timeout=5000]
 * @returns {Promise<Response>}
 */
async function fetchWithTimeout(url, options = {}) {
  const timeout = options.timeout || 5000
  // ...
}

// 注意 13：与 @returns 配合
/**
 * 计算数组平均值
 *
 * @param {number[]} numbers - 数字数组（不能为空）
 * @returns {number} 平均值
 * @throws {Error} 当数组为空时
 */
function average(numbers) {
  if (numbers.length === 0) {
    throw new Error('Array cannot be empty')
  }
  return numbers.reduce((a, b) => a + b) / numbers.length
}

// 注意 14：类型导入
/**
 * @typedef {import('./types').User} User
 * @typedef {import('./types').Config} Config
 */

/**
 * @param {User} user
 * @param {Config} config
 */
function initialize(user, config) {
  // ...
}

// 注意 15：复杂类型使用 typedef
// ❌ 难以维护
/**
 * @param {{ users: Array<{ id: number, profile: { name: string, avatar: string }}>, settings: { theme: string }}} data
 */
function processComplexData(data) {}

// ✅ 使用 typedef
/**
 * @typedef {Object} UserProfile
 * @property {string} name
 * @property {string} avatar
 */

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {UserProfile} profile
 */

/**
 * @typedef {Object} Settings
 * @property {string} theme
 */

/**
 * @typedef {Object} AppData
 * @property {User[]} users
 * @property {Settings} settings
 */

/**
 * @param {AppData} data
 */
function processBetterData(data) {}
```

## 6. 🔗 引用

- [TypeScript Handbook - JSDoc @param][1]
- [JSDoc @param Tag][2]
- [Documenting Function Parameters][3]

[1]: https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#param-and-returns
[2]: https://jsdoc.app/tags-param.html
[3]: https://github.com/Microsoft/TypeScript/wiki/JSDoc-support-in-JavaScript#param
