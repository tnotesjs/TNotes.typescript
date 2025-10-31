# [0229. @returns 标记](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0229.%20%40returns%20%E6%A0%87%E8%AE%B0)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 @returns 标记的作用是什么？](#3--returns-标记的作用是什么)
- [4. 🤔 如何使用 @returns 标记复杂返回类型？](#4--如何使用-returns-标记复杂返回类型)
- [5. 🤔 使用 @returns 时需要注意哪些问题？](#5--使用-returns-时需要注意哪些问题)
- [6. 🔗 引用](#6--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- `@returns` 标记的基本用法
- 不同返回类型的标注
- Promise 和异步函数的返回类型
- 复杂对象返回类型的描述

## 2. 🫧 评价

`@returns`（或 `@return`）是 JSDoc 中用于描述函数返回值类型的标记，为函数提供返回值的类型信息和文档说明。

- 清楚说明函数返回什么类型的值
- 支持基本类型、复杂对象、Promise 等
- 配合 `@ts-check` 提供返回值类型检查
- 帮助理解函数的输出和用途
- `@returns` 和 `@return` 两种拼写都支持，推荐使用 `@returns`

## 3. 🤔 @returns 标记的作用是什么？

`@returns` 用于描述函数的返回值类型：

```javascript
// @ts-check

// 基本类型返回
/**
 * 计算两个数的和
 * @param {number} a
 * @param {number} b
 * @returns {number} 两数之和
 */
function add(a, b) {
  return a + b
}

const result = add(1, 2) // result: number

// 字符串返回
/**
 * @param {string} name
 * @returns {string} 问候语
 */
function greet(name) {
  return `Hello, ${name}!`
}

// 布尔返回
/**
 * @param {number} age
 * @returns {boolean} 是否成年
 */
function isAdult(age) {
  return age >= 18
}

// void 返回（无返回值）
/**
 * @param {string} message
 * @returns {void}
 */
function log(message) {
  console.log(message)
}

// undefined 返回
/**
 * @returns {undefined}
 */
function doNothing() {
  return undefined
}

// null 返回
/**
 * @param {string} key
 * @returns {string | null} 找到返回值，否则返回 null
 */
function getConfig(key) {
  const config = { apiKey: 'secret' }
  return config[key] || null
}

// 数组返回
/**
 * @param {number} n
 * @returns {number[]} 前 n 个自然数
 */
function range(n) {
  return Array.from({ length: n }, (_, i) => i + 1)
}

// 对象返回
/**
 * @param {string} name
 * @param {number} age
 * @returns {{ name: string, age: number }} 用户对象
 */
function createUser(name, age) {
  return { name, age }
}

// 联合类型返回
/**
 * @param {string} input
 * @returns {number | string} 解析结果
 */
function parse(input) {
  const num = parseInt(input)
  return isNaN(num) ? input : num
}

// 函数返回
/**
 * @param {number} x
 * @returns {function(number): number} 柯里化函数
 */
function add(x) {
  return function (y) {
    return x + y
  }
}

// 类实例返回
class User {
  constructor(name) {
    this.name = name
  }
}

/**
 * @param {string} name
 * @returns {User} 用户实例
 */
function createUserInstance(name) {
  return new User(name)
}

// Promise 返回
/**
 * @param {string} url
 * @returns {Promise<string>} 异步数据
 */
async function fetchData(url) {
  const response = await fetch(url)
  return response.text()
}

// 异步对象返回
/**
 * @param {number} id
 * @returns {Promise<{ id: number, name: string }>} 用户数据
 */
async function getUser(id) {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

// 泛型返回
/**
 * @template T
 * @param {T[]} array
 * @returns {T | undefined} 第一个元素
 */
function first(array) {
  return array[0]
}
```

**@return 和 @returns 的区别：**

```javascript
// 两种拼写都可以，效果相同
/**
 * @returns {number}
 */
function func1() {
  return 1
}

/**
 * @return {number}
 */
function func2() {
  return 1
}

// 推荐使用 @returns（更符合 TypeScript 习惯）
```

## 4. 🤔 如何使用 @returns 标记复杂返回类型？

`@returns` 可以描述各种复杂的返回类型：

```javascript
// @ts-check

// 1. 嵌套对象返回
/**
 * @returns {{ user: { name: string, age: number }, meta: { createdAt: number }}}
 */
function getUserData() {
  return {
    user: { name: 'Alice', age: 30 },
    meta: { createdAt: Date.now() }
  };
}

// 2. 使用 typedef 简化复杂返回类型
/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {any} [data]
 * @property {string} [error]
 */

/**
 * @param {string} url
 * @returns {Promise<ApiResponse>}
 */
async function callApi(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// 3. 可辨识联合类型
/**
 * @typedef {Object} SuccessResult
 * @property {'success'} type
 * @property {string} data
 */

/**
 * @typedef {Object} ErrorResult
 * @property {'error'} type
 * @property {string} message
 */

/**
 * @param {string} url
 * @returns {Promise<SuccessResult | ErrorResult>}
 */
async function fetch Data(url) {
  try {
    const response = await fetch(url);
    const data = await response.text();
    return { type: 'success', data };
  } catch (error) {
    return { type: 'error', message: error.message };
  }
}

// 4. 数组元素类型
/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} email
 */

/**
 * @returns {User[]} 用户列表
 */
function getAllUsers() {
  return [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' }
  ];
}

// 5. 元组返回
/**
 * @param {string} input
 * @returns {[boolean, string]} [是否成功, 结果或错误信息]
 */
function validate(input) {
  if (input.length === 0) {
    return [false, 'Input cannot be empty'];
  }
  return [true, 'Valid'];
}

// 6. Map 和 Set 返回
/**
 * @param {Array<[string, number]>} entries
 * @returns {Map<string, number>}
 */
function createMap(entries) {
  return new Map(entries);
}

/**
 * @param {number[]} numbers
 * @returns {Set<number>}
 */
function createSet(numbers) {
  return new Set(numbers);
}

// 7. 函数返回函数
/**
 * @param {number} multiplier
 * @returns {function(number): number} 乘法函数
 */
function createMultiplier(multiplier) {
  return function(x) {
    return x * multiplier;
  };
}

// 8. Promise 链式类型
/**
 * @returns {Promise<Promise<string>>} 嵌套 Promise
 */
function getNestedPromise() {
  return Promise.resolve(Promise.resolve('data'));
}

// 9. 条件返回类型
/**
 * @template T
 * @param {T} value
 * @param {boolean} returnArray
 * @returns {T | T[]} 单个值或数组
 */
function maybeArray(value, returnArray) {
  return returnArray ? [value] : value;
}

// 10. 部分类型返回
/**
 * @typedef {Object} FullUser
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {string} password
 */

/**
 * @param {FullUser} user
 * @returns {Omit<FullUser, 'password'>} 不含密码的用户对象
 */
function sanitizeUser(user) {
  const { password, ...rest } = user;
  return rest;
}

// 11. Record 类型返回
/**
 * @param {string[]} keys
 * @param {number} value
 * @returns {Record<string, number>}
 */
function createRecord(keys, value) {
  const record = {};
  keys.forEach(key => {
    record[key] = value;
  });
  return record;
}

// 12. 生成器返回类型
/**
 * @param {number} max
 * @returns {Generator<number, void, undefined>} 数字生成器
 */
function* numberGenerator(max) {
  for (let i = 0; i < max; i++) {
    yield i;
  }
}

// 13. 异步生成器
/**
 * @param {string[]} urls
 * @returns {AsyncGenerator<string, void, undefined>}
 */
async function* fetchMultiple(urls) {
  for (const url of urls) {
    const response = await fetch(url);
    yield await response.text();
  }
}

// 14. 类构造函数返回
/**
 * @template T
 * @param {new (...args: any[]) => T} Class
 * @returns {T}
 */
function createInstance(Class) {
  return new Class();
}

// 15. 导入类型返回
/**
 * @typedef {import('./types').User} User
 * @typedef {import('./types').Config} Config
 */

/**
 * @param {Config} config
 * @returns {User}
 */
function initializeUser(config) {
  return {
    id: 1,
    name: config.defaultName,
    email: config.defaultEmail
  };
}

// 16. 工具类型返回
/**
 * @template T
 * @param {T} obj
 * @returns {Partial<T>} 部分对象
 */
function toPartial(obj) {
  return { ...obj };
}

/**
 * @template T
 * @param {T} obj
 * @returns {Readonly<T>} 只读对象
 */
function toReadonly(obj) {
  return Object.freeze({ ...obj });
}

// 17. 递归类型返回
/**
 * @typedef {Object} TreeNode
 * @property {string} value
 * @property {TreeNode[]} [children]
 */

/**
 * @param {string[]} values
 * @returns {TreeNode} 树节点
 */
function createTree(values) {
  return {
    value: values[0],
    children: values.slice(1).map(v => ({ value: v }))
  };
}

// 18. 多种可能的返回类型
/**
 * @param {string} input
 * @returns {number | string | null} 解析结果
 */
function parseValue(input) {
  if (!input) return null;
  const num = parseFloat(input);
  return isNaN(num) ? input : num;
}

// 19. 异步错误处理
/**
 * @typedef {Object} Result
 * @property {boolean} success
 * @property {string} [data]
 * @property {Error} [error]
 */

/**
 * @param {string} url
 * @returns {Promise<Result>}
 */
async function safeProcess(url) {
  try {
    const data = await fetch(url).then(r => r.text());
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

// 20. 柯里化函数链
/**
 * @param {number} a
 * @returns {function(number): function(number): number}
 */
function curriedAdd(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    };
  };
}
```

## 5. 🤔 使用 @returns 时需要注意哪些问题？

使用 `@returns` 的注意事项：

```javascript
// @ts-check

// 注意 1：所有分支都应该有返回值
// ⚠️ 不好：某些分支没有返回
/**
 * @param {number} x
 * @returns {string}
 */
function bad(x) {
  if (x > 0) {
    return 'positive'
  }
  // ⚠️ 缺少 else 分支的返回
}

// ✅ 好：所有分支都有返回
/**
 * @param {number} x
 * @returns {string}
 */
function good(x) {
  if (x > 0) {
    return 'positive'
  } else if (x < 0) {
    return 'negative'
  } else {
    return 'zero'
  }
}

// 注意 2：Promise 的类型要明确
// ⚠️ 不好：Promise 类型不明确
/**
 * @returns {Promise} // ⚠️ Promise 的什么类型？
 */
async function fetchData1() {
  return 'data'
}

// ✅ 好：明确 Promise 的泛型类型
/**
 * @returns {Promise<string>}
 */
async function fetchData2() {
  return 'data'
}

// 注意 3：void 和 undefined 的区别
// void：函数不关心返回值
/**
 * @param {string} message
 * @returns {void}
 */
function log(message) {
  console.log(message)
  // 可以 return; 或不 return
}

// undefined：明确返回 undefined
/**
 * @returns {undefined}
 */
function getUndefined() {
  return undefined
}

// 注意 4：泛型返回类型
// ⚠️ 不好：没有使用泛型
/**
 * @param {any[]} array
 * @returns {any}
 */
function first1(array) {
  return array[0]
}

// ✅ 好：使用泛型保持类型关系
/**
 * @template T
 * @param {T[]} array
 * @returns {T | undefined}
 */
function first2(array) {
  return array[0]
}

// 注意 5：复杂类型使用 typedef
// ⚠️ 不好：内联复杂类型
/**
 * @returns {{ user: { name: string, profile: { avatar: string, bio: string }}, meta: { timestamp: number }}}
 */
function getComplexData1() {}

// ✅ 好：使用 typedef
/**
 * @typedef {Object} UserProfile
 * @property {string} avatar
 * @property {string} bio
 */

/**
 * @typedef {Object} User
 * @property {string} name
 * @property {UserProfile} profile
 */

/**
 * @typedef {Object} ComplexData
 * @property {User} user
 * @property {{ timestamp: number }} meta
 */

/**
 * @returns {ComplexData}
 */
function getComplexData2() {}

// 注意 6：null 和 undefined 的处理
// ⚠️ 不好：可能返回 null 但没有标注
/**
 * @param {string} key
 * @returns {string} // ⚠️ 实际可能返回 null
 */
function getValue1(key) {
  return map.get(key) || null
}

// ✅ 好：明确可能的 null
/**
 * @param {string} key
 * @returns {string | null}
 */
function getValue2(key) {
  return map.get(key) || null
}

// 注意 7：异步函数必须返回 Promise
// ❌ 错误：async 函数但返回类型不是 Promise
/**
 * @returns {string} // ❌ 错误
 */
async function asyncFunc1() {
  return 'data'
}

// ✅ 正确
/**
 * @returns {Promise<string>}
 */
async function asyncFunc2() {
  return 'data'
}

// 注意 8：函数重载的返回类型
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

// 注意 9：this 返回类型
/**
 * @returns {this} 返回当前实例（链式调用）
 */
class Builder {
  setValue(value) {
    this.value = value
    return this
  }

  build() {
    return this.value
  }
}

// 注意 10：错误处理的返回类型
// ⚠️ 不好：没有说明可能抛出错误
/**
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */
function divide1(x, y) {
  if (y === 0) {
    throw new Error('Division by zero')
  }
  return x / y
}

// ✅ 好：使用 @throws 说明
/**
 * @param {number} x
 * @param {number} y
 * @returns {number}
 * @throws {Error} 当除数为 0 时
 */
function divide2(x, y) {
  if (y === 0) {
    throw new Error('Division by zero')
  }
  return x / y
}

// 或者返回 Result 类型
/**
 * @typedef {Object} Result
 * @property {boolean} success
 * @property {number} [value]
 * @property {string} [error]
 */

/**
 * @param {number} x
 * @param {number} y
 * @returns {Result}
 */
function divide3(x, y) {
  if (y === 0) {
    return { success: false, error: 'Division by zero' }
  }
  return { success: true, value: x / y }
}

// 注意 11：生成器的返回类型
/**
 * @param {number} max
 * @returns {Generator<number, void, undefined>}
 */
function* numbers(max) {
  for (let i = 0; i < max; i++) {
    yield i
  }
}

// 注意 12：类型导入的正确性
/**
 * @typedef {import('./types').User} User
 */

/**
 * @param {string} name
 * @returns {User} // 确保 User 类型已正确导入
 */
function createUser(name) {
  return { id: 1, name, email: `${name}@example.com` }
}

// 注意 13：避免过度精确
// ⚠️ 太精确可能导致不灵活
/**
 * @returns {{ name: 'Alice', age: 30 }} // ⚠️ 字面量类型太具体
 */
function getUser1() {
  return { name: 'Alice', age: 30 }
}

// ✅ 合适的抽象级别
/**
 * @returns {{ name: string, age: number }}
 */
function getUser2() {
  return { name: 'Alice', age: 30 }
}

// 注意 14：联合类型的说明
/**
 * @param {string} input
 * @returns {number | string}
 *   返回解析后的数字，如果无法解析则返回原字符串
 */
function parseOrKeep(input) {
  const num = parseFloat(input)
  return isNaN(num) ? input : num
}

// 注意 15：不要忘记标注返回类型
// ❌ 不好：缺少返回类型
/**
 * @param {number} x
 */
function double(x) {
  return x * 2
}

// ✅ 好：完整的类型信息
/**
 * @param {number} x
 * @returns {number}
 */
function betterDouble(x) {
  return x * 2
}
```

## 6. 🔗 引用

- [TypeScript Handbook - JSDoc @returns][1]
- [JSDoc @returns Tag][2]
- [Documenting Return Types][3]

[1]: https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#param-and-returns
[2]: https://jsdoc.app/tags-returns.html
[3]: https://github.com/Microsoft/TypeScript/wiki/JSDoc-support-in-JavaScript#returns
