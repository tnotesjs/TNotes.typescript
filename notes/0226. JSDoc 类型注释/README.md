# [0226. JSDoc 类型注释](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0226.%20JSDoc%20%E7%B1%BB%E5%9E%8B%E6%B3%A8%E9%87%8A)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 JSDoc 类型注释是什么？](#3--jsdoc-类型注释是什么)
- [4. 🤔 TypeScript 支持哪些 JSDoc 标记？](#4--typescript-支持哪些-jsdoc-标记)
- [5. 🤔 如何使用 JSDoc 描述复杂类型？](#5--如何使用-jsdoc-描述复杂类型)
- [6. 🤔 JSDoc 与 TypeScript 有什么区别？](#6--jsdoc-与-typescript-有什么区别)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- JSDoc 类型注释系统概述
- TypeScript 支持的 JSDoc 标记
- 复杂类型的 JSDoc 表示
- JSDoc 与 TypeScript 的关系和区别

## 2. 🫧 评价

JSDoc 是 JavaScript 的文档注释标准，TypeScript 扩展了 JSDoc 以支持类型注释，让 JavaScript 项目也能享受类型检查的好处。

- 允许在 JavaScript 中添加类型信息而无需改为 `.ts` 文件
- 配合 `@ts-check` 可以启用类型检查
- 适合渐进式迁移或不想完全转向 TypeScript 的项目
- 编辑器（VS Code）能提供智能提示和类型检查
- 是从 JavaScript 到 TypeScript 的平滑过渡方案

## 3. 🤔 JSDoc 类型注释是什么？

JSDoc 是 JavaScript 的文档注释标准，TypeScript 扩展了它以支持类型信息：

```javascript
// @ts-check

// 基本类型注解
/**
 * 计算两个数的和
 * @param {number} a - 第一个数字
 * @param {number} b - 第二个数字
 * @returns {number} 两数之和
 */
function add(a, b) {
  return a + b
}

// 使用时有类型检查
add(1, 2) // ✅ 正确
add('1', 2) // ❌ Error: Argument of type 'string' is not assignable to parameter of type 'number'

// 变量类型注解
/**
 * @type {string}
 */
let username = 'Alice'

username = 'Bob' // ✅ 正确
username = 123 // ❌ Error: Type 'number' is not assignable to type 'string'

// 对象类型注解
/**
 * @type {{ name: string, age: number }}
 */
const person = {
  name: 'Alice',
  age: 30,
}

// 数组类型注解
/**
 * @type {number[]}
 */
const numbers = [1, 2, 3]

/**
 * @type {Array<string>}
 */
const names = ['Alice', 'Bob']

// 联合类型
/**
 * @type {string | number}
 */
let value = 'hello'
value = 123 // ✅ 正确
value = true // ❌ Error

// 可选参数
/**
 * @param {string} name
 * @param {number} [age] - 可选参数
 * @returns {string}
 */
function greet(name, age) {
  if (age !== undefined) {
    return `Hello, ${name}! You are ${age} years old.`
  }
  return `Hello, ${name}!`
}

// 默认参数
/**
 * @param {string} message
 * @param {number} [times=1] - 重复次数
 */
function repeat(message, times = 1) {
  return message.repeat(times)
}

// 剩余参数
/**
 * @param {...number} numbers
 * @returns {number}
 */
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0)
}
```

**JSDoc 注释的结构：**

```javascript
/**
 * 函数简短描述（第一行）
 *
 * 详细描述可以占多行
 * 可以包含示例代码
 *
 * @param {类型} 参数名 - 参数描述
 * @param {类型} [可选参数名] - 可选参数描述
 * @returns {返回类型} 返回值描述
 * @throws {错误类型} 抛出错误的描述
 * @example
 * // 使用示例
 * const result = myFunction(arg1, arg2);
 */
function myFunction(param1, param2) {
  // 函数实现
}

// 完整示例
/**
 * 从数组中查找元素
 *
 * 使用二分查找算法，要求数组已排序
 *
 * @template T
 * @param {T[]} array - 已排序的数组
 * @param {T} target - 要查找的目标值
 * @param {function(T, T): number} [compareFn] - 自定义比较函数
 * @returns {number} 元素索引，未找到返回 -1
 * @throws {TypeError} 如果数组未排序
 * @example
 * const index = binarySearch([1, 2, 3, 4, 5], 3);
 * console.log(index); // 2
 */
function binarySearch(array, target, compareFn) {
  // 实现...
}
```

## 4. 🤔 TypeScript 支持哪些 JSDoc 标记？

TypeScript 支持的主要 JSDoc 标记：

```javascript
// @ts-check

// @param - 参数类型
/**
 * @param {string} name
 * @param {number} age
 * @param {boolean} [isActive] - 可选参数
 */
function createUser(name, age, isActive) {
  return { name, age, isActive }
}

// @returns 或 @return - 返回类型
/**
 * @returns {Promise<string>}
 */
async function fetchData() {
  return 'data'
}

// @type - 变量类型
/**
 * @type {string | null}
 */
let result = null

// @typedef - 定义类型别名
/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} email
 */

/**
 * @param {User} user
 */
function displayUser(user) {
  console.log(user.name)
}

// @template - 泛型
/**
 * @template T
 * @param {T} value
 * @returns {T}
 */
function identity(value) {
  return value
}

// @callback - 定义回调函数类型
/**
 * @callback CompareFunction
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */

/**
 * @param {number[]} array
 * @param {CompareFunction} compareFn
 */
function sort(array, compareFn) {
  return array.sort(compareFn)
}

// @this - 函数中 this 的类型
/**
 * @this {{ value: number }}
 * @returns {number}
 */
function getValue() {
  return this.value
}

// @enum - 枚举类型
/**
 * @enum {number}
 */
const Status = {
  Pending: 0,
  Active: 1,
  Completed: 2,
}

// @extends 或 @augments - 继承
/**
 * @typedef {Object} Animal
 * @property {string} name
 */

/**
 * @typedef {Object} Dog
 * @extends Animal
 * @property {string} breed
 */

// @implements - 实现接口
/**
 * @implements {Comparable}
 */
class Person {
  /**
   * @param {Person} other
   * @returns {number}
   */
  compareTo(other) {
    return this.age - other.age
  }
}

// @class 或 @constructor - 标记构造函数
/**
 * @class
 * @param {string} name
 */
function Animal(name) {
  this.name = name
}

// @readonly - 只读属性
/**
 * @typedef {Object} Config
 * @property {readonly string} apiKey
 * @property {readonly number} timeout
 */

// @deprecated - 标记废弃
/**
 * @deprecated 请使用 newFunction 代替
 * @param {string} value
 */
function oldFunction(value) {
  // ...
}

// @see - 参考链接
/**
 * @see {@link https://example.com/docs}
 * @param {string} id
 */
function processId(id) {
  // ...
}

// @throws 或 @exception - 抛出的异常
/**
 * @param {number} divisor
 * @throws {Error} 当 divisor 为 0 时
 * @returns {number}
 */
function divide(dividend, divisor) {
  if (divisor === 0) {
    throw new Error('Division by zero')
  }
  return dividend / divisor
}

// @public, @private, @protected - 访问修饰符
class MyClass {
  /**
   * @private
   * @type {string}
   */
  _secretValue

  /**
   * @public
   * @param {string} value
   */
  setValue(value) {
    this._secretValue = value
  }
}

// @override - 重写父类方法
class Child extends Parent {
  /**
   * @override
   * @param {string} message
   */
  log(message) {
    console.log(`Child: ${message}`)
  }
}

// @satisfies - TypeScript 4.9+ 新增
/**
 * @satisfies {Record<string, string>}
 */
const config = {
  apiUrl: 'https://api.example.com',
  timeout: '5000',
}
```

## 5. 🤔 如何使用 JSDoc 描述复杂类型？

JSDoc 支持描述各种复杂类型：

```javascript
// @ts-check

// 1. 嵌套对象类型
/**
 * @typedef {Object} Address
 * @property {string} street
 * @property {string} city
 * @property {string} zipCode
 * @property {string} country
 */

/**
 * @typedef {Object} Person
 * @property {string} name
 * @property {number} age
 * @property {Address} address
 * @property {string[]} hobbies
 */

/**
 * @param {Person} person
 */
function displayPerson(person) {
  console.log(person.address.city)
}

// 2. 联合和交叉类型
/**
 * @typedef {string | number} ID
 */

/**
 * @typedef {Person & { employeeId: number }} Employee
 */

/**
 * @param {ID} id
 * @param {Employee} employee
 */
function processEmployee(id, employee) {
  // ...
}

// 3. 泛型类型
/**
 * @template T
 * @typedef {Object} Result
 * @property {boolean} success
 * @property {T} [data]
 * @property {string} [error]
 */

/**
 * @param {number} id
 * @returns {Promise<Result<Person>>}
 */
async function fetchPerson(id) {
  try {
    const data = await fetch(`/api/persons/${id}`)
    return { success: true, data: await data.json() }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// 4. 函数类型
/**
 * @typedef {function(number, number): number} BinaryOperation
 */

/**
 * @typedef {function(string): boolean} Predicate
 */

/**
 * @param {number[]} numbers
 * @param {BinaryOperation} operation
 */
function reduce(numbers, operation) {
  return numbers.reduce(operation)
}

// 5. 元组类型
/**
 * @typedef {[string, number]} NameAgePair
 */

/**
 * @param {NameAgePair} pair
 */
function processPair(pair) {
  const [name, age] = pair
  console.log(`${name} is ${age} years old`)
}

// 6. 索引签名
/**
 * @typedef {Object.<string, number>} ScoreMap
 */

/**
 * @param {ScoreMap} scores
 */
function calculateAverage(scores) {
  const values = Object.values(scores)
  return values.reduce((a, b) => a + b) / values.length
}

// 7. 条件类型（通过字符串字面量模拟）
/**
 * @typedef {'idle' | 'loading' | 'success' | 'error'} LoadingState
 */

/**
 * @param {LoadingState} state
 */
function handleState(state) {
  switch (state) {
    case 'loading':
      console.log('Loading...')
      break
    case 'success':
      console.log('Success!')
      break
  }
}

// 8. 导入类型
/**
 * @typedef {import('./types').User} User
 * @typedef {import('./types').ApiResponse<User>} UserResponse
 */

/**
 * @param {number} id
 * @returns {Promise<UserResponse>}
 */
async function getUser(id) {
  // ...
}

// 9. 映射类型（通过 typedef 模拟）
/**
 * @template T
 * @typedef {Object} Partial
 * @property {T[keyof T]} [key]
 */

// 10. 类类型
/**
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
   * @template U
   * @param {function(T): U} fn
   * @returns {Container<U>}
   */
  map(fn) {
    return new Container(fn(this.value))
  }

  /**
   * @returns {T}
   */
  getValue() {
    return this.value
  }
}

// 11. Promise 类型
/**
 * @returns {Promise<string>}
 */
async function fetchText() {
  return 'text'
}

/**
 * @returns {Promise<void>}
 */
async function doSomething() {
  await fetchText()
}

// 12. 高级工具类型
/**
 * @template T
 * @template K
 * @typedef {Pick<T, K>} PickType
 */

/**
 * @template T
 * @template K
 * @typedef {Omit<T, K>} OmitType
 */

/**
 * @typedef {Partial<Person>} PartialPerson
 */

/**
 * @typedef {Required<Person>} RequiredPerson
 */

/**
 * @typedef {Readonly<Person>} ReadonlyPerson
 */

/**
 * @typedef {Record<string, number>} StringToNumberMap
 */

// 13. 可辨识联合
/**
 * @typedef {Object} SuccessResult
 * @property {'success'} type
 * @property {any} data
 */

/**
 * @typedef {Object} ErrorResult
 * @property {'error'} type
 * @property {string} message
 */

/**
 * @typedef {SuccessResult | ErrorResult} Result
 */

/**
 * @param {Result} result
 */
function handleResult(result) {
  if (result.type === 'success') {
    console.log(result.data)
  } else {
    console.error(result.message)
  }
}

// 14. 递归类型
/**
 * @typedef {Object} TreeNode
 * @property {string} value
 * @property {TreeNode[]} [children]
 */

/**
 * @param {TreeNode} node
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

// 15. 类型守卫
/**
 * @param {any} value
 * @returns {value is string}
 */
function isString(value) {
  return typeof value === 'string'
}

/**
 * @param {unknown} value
 */
function process(value) {
  if (isString(value)) {
    // value 被收窄为 string
    console.log(value.toUpperCase())
  }
}
```

## 6. 🤔 JSDoc 与 TypeScript 有什么区别？

JSDoc 和 TypeScript 的对比：

```javascript
// 示例 1：基本类型声明

// JSDoc 方式
/**
 * @param {string} name
 * @param {number} age
 * @returns {string}
 */
function greetJS(name, age) {
  return `Hello, ${name}! You are ${age} years old.`;
}

// TypeScript 方式
function greetTS(name: string, age: number): string {
  return `Hello, ${name}! You are ${age} years old.`;
}

// 示例 2：接口定义

// JSDoc 方式
/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} email
 */

/**
 * @param {User} user
 */
function displayUserJS(user) {
  console.log(user.name);
}

// TypeScript 方式
interface User {
  id: number;
  name: string;
  email: string;
}

function displayUserTS(user: User): void {
  console.log(user.name);
}

// 示例 3：泛型

// JSDoc 方式
/**
 * @template T
 * @param {T[]} array
 * @returns {T | undefined}
 */
function firstJS(array) {
  return array[0];
}

// TypeScript 方式
function firstTS<T>(array: T[]): T | undefined {
  return array[0];
}

// 示例 4：类

// JSDoc 方式
class PersonJS {
  /**
   * @param {string} name
   * @param {number} age
   */
  constructor(name, age) {
    /** @type {string} */
    this.name = name;
    /** @type {number} */
    this.age = age;
  }

  /**
   * @returns {string}
   */
  greet() {
    return `Hello, I'm ${this.name}`;
  }
}

// TypeScript 方式
class PersonTS {
  constructor(
    private name: string,
    private age: number
  ) {}

  greet(): string {
    return `Hello, I'm ${this.name}`;
  }
}

// 示例 5：联合类型和类型守卫

// JSDoc 方式
/**
 * @param {string | number} value
 * @returns {string}
 */
function toStringJS(value) {
  if (typeof value === 'number') {
    return value.toString();
  }
  return value;
}

// TypeScript 方式
function toStringTS(value: string | number): string {
  if (typeof value === 'number') {
    return value.toString();
  }
  return value;
}

// 示例 6：可选属性和参数

// JSDoc 方式
/**
 * @typedef {Object} Config
 * @property {string} apiUrl
 * @property {number} [timeout] - 可选属性
 */

/**
 * @param {string} message
 * @param {number} [times] - 可选参数
 */
function repeatJS(message, times = 1) {
  return message.repeat(times);
}

// TypeScript 方式
interface Config {
  apiUrl: string;
  timeout?: number;
}

function repeatTS(message: string, times?: number): string {
  return message.repeat(times || 1);
}

// 示例 7：类型别名

// JSDoc 方式
/**
 * @typedef {string | number} ID
 */

/**
 * @param {ID} id
 */
function processIdJS(id) {
  console.log(id);
}

// TypeScript 方式
type ID = string | number;

function processIdTS(id: ID): void {
  console.log(id);
}

// 示例 8：枚举

// JSDoc 方式
/**
 * @enum {number}
 */
const StatusJS = {
  Pending: 0,
  Active: 1,
  Completed: 2
};

// TypeScript 方式
enum StatusTS {
  Pending,
  Active,
  Completed
}

// 对比总结

/**
 * JSDoc 优势：
 * - 不需要编译，直接运行 JavaScript
 * - 渐进式引入类型检查
 * - 与现有 JavaScript 项目兼容
 * - 文档和类型信息合二为一
 *
 * JSDoc 劣势：
 * - 语法冗长，写起来麻烦
 * - 类型表达能力有限
 * - 缺少一些高级类型特性
 * - 编辑器支持不如原生 TypeScript
 *
 * TypeScript 优势：
 * - 语法简洁，类型声明更自然
 * - 完整的类型系统支持
 * - 更好的编辑器支持
 * - 更强大的类型推断
 * - 丰富的高级类型特性
 *
 * TypeScript 劣势：
 * - 需要编译步骤
 * - 学习曲线较陡
 * - 需要完全重写为 .ts 文件
 * - 可能影响构建流程
 */

// 选择建议

// 使用 JSDoc 的场景：
// 1. 现有大型 JavaScript 项目
// 2. 不想改变构建流程
// 3. 团队不熟悉 TypeScript
// 4. 需要渐进式迁移
// 5. 库需要同时提供 JS 和类型

// 使用 TypeScript 的场景：
// 1. 新项目
// 2. 需要完整类型系统
// 3. 团队熟悉 TypeScript
// 4. 追求最佳开发体验
// 5. 复杂的类型逻辑

// 混合使用：
// 可以在 TypeScript 项目中导入使用 JSDoc 的 JavaScript 文件
// 也可以在 JavaScript 项目中逐步添加 JSDoc，最终迁移到 TypeScript
```

## 7. 🔗 引用

- [TypeScript Handbook - JSDoc Reference][1]
- [JSDoc Official Documentation][2]
- [VS Code JavaScript Type Checking][3]

[1]: https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
[2]: https://jsdoc.app/
[3]: https://code.visualstudio.com/docs/nodejs/working-with-javascript#_type-checking
