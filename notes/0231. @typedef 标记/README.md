# [0231. @typedef 标记](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0231.%20%40typedef%20%E6%A0%87%E8%AE%B0)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是 @typedef 标记？](#3--什么是-typedef-标记)
  - [3.1. 基本语法](#31-基本语法)
  - [3.2. 使用已定义的类型](#32-使用已定义的类型)
  - [3.3. 类型定义的位置](#33-类型定义的位置)
- [4. 🤔 如何定义对象类型？](#4--如何定义对象类型)
  - [4.1. 简单对象类型](#41-简单对象类型)
  - [4.2. 嵌套对象类型](#42-嵌套对象类型)
  - [4.3. 可选属性](#43-可选属性)
  - [4.4. 只读属性](#44-只读属性)
  - [4.5. 索引签名](#45-索引签名)
  - [4.6. 复杂嵌套结构](#46-复杂嵌套结构)
- [5. 🤔 如何定义函数类型？](#5--如何定义函数类型)
  - [5.1. 基本函数类型](#51-基本函数类型)
  - [5.2. 详细的函数签名](#52-详细的函数签名)
  - [5.3. 多个回调函数](#53-多个回调函数)
  - [5.4. 泛型函数类型](#54-泛型函数类型)
  - [5.5. 函数重载类型](#55-函数重载类型)
- [6. 🤔 有哪些高级类型定义技巧？](#6--有哪些高级类型定义技巧)
  - [6.1. 联合类型](#61-联合类型)
  - [6.2. 交叉类型](#62-交叉类型)
  - [6.3. 泛型类型](#63-泛型类型)
  - [6.4. 递归类型](#64-递归类型)
  - [6.5. 条件类型（有限支持）](#65-条件类型有限支持)
  - [6.6. 映射类型](#66-映射类型)
  - [6.7. 工具类型组合](#67-工具类型组合)
  - [6.8. 类型导入](#68-类型导入)
- [7. 🤔 使用 @typedef 时需要注意什么？](#7--使用-typedef-时需要注意什么)
  - [7.1. 命名规范](#71-命名规范)
  - [7.2. 类型定义位置](#72-类型定义位置)
  - [7.3. 避免循环引用](#73-避免循环引用)
  - [7.4. 类型复用](#74-类型复用)
  - [7.5. 文档注释](#75-文档注释)
  - [7.6. 与 TypeScript 的互操作](#76-与-typescript-的互操作)
  - [7.7. 类型文件组织](#77-类型文件组织)
  - [7.8. 复杂类型的简化](#78-复杂类型的简化)
  - [7.9. 类型检查验证](#79-类型检查验证)
  - [7.10. 泛型约束](#710-泛型约束)
  - [7.11. 默认泛型参数](#711-默认泛型参数)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- @typedef 标记的基本语法
- 定义对象类型和嵌套结构
- 定义函数类型和回调
- 泛型类型定义
- 类型导入和引用
- 类型别名的复用
- 与其他 JSDoc 标记的配合使用

## 2. 🫧 评价

`@typedef` 是 JSDoc 中定义自定义类型的关键标记，可以为复杂类型创建可复用的类型别名，显著提升代码的可读性和类型安全性。

- 在 JavaScript 项目中使用类型系统的最佳方式
- 定义复杂对象类型比内联注解更清晰
- 支持泛型、联合类型等高级特性
- 类型定义可以集中管理和复用
- 配合 `@type` 和 `@param` 使用效果最佳
- 大型 JS 项目必备的类型管理工具

## 3. 🤔 什么是 @typedef 标记？

`@typedef` 用于定义自定义类型别名，可以为复杂类型创建有意义的名称，方便在代码中重复使用。

### 3.1. 基本语法

```javascript
/**
 * @typedef {类型定义} 类型名称
 */

// 示例：定义基本类型别名
/**
 * @typedef {string} UserId
 */

/**
 * @typedef {number} Timestamp
 */

/**
 * @typedef {string | number} ID
 */
```

### 3.2. 使用已定义的类型

```javascript
/**
 * @typedef {string} Email
 */

/**
 * @type {Email}
 */
const userEmail = 'user@example.com'

/**
 * @param {Email} email - 用户邮箱
 */
function sendEmail(email) {
  console.log(`Sending to ${email}`)
}
```

### 3.3. 类型定义的位置

```javascript
// ✅ 推荐：在文件顶部集中定义
/**
 * @typedef {Object} User
 * @property {string} name
 * @property {number} age
 */

/**
 * @typedef {Object} Post
 * @property {string} title
 * @property {User} author
 */

// 使用定义的类型
/**
 * @param {User} user
 * @param {Post} post
 */
function createPost(user, post) {
  // ...
}
```

## 4. 🤔 如何定义对象类型？

### 4.1. 简单对象类型

```javascript
/**
 * @typedef {Object} Point
 * @property {number} x - X 坐标
 * @property {number} y - Y 坐标
 */

/**
 * @type {Point}
 */
const point = { x: 10, y: 20 }
```

### 4.2. 嵌套对象类型

```javascript
/**
 * @typedef {Object} Address
 * @property {string} street
 * @property {string} city
 * @property {string} zipCode
 */

/**
 * @typedef {Object} Person
 * @property {string} name
 * @property {number} age
 * @property {Address} address - 嵌套的地址对象
 */

/**
 * @type {Person}
 */
const person = {
  name: 'Alice',
  age: 30,
  address: {
    street: '123 Main St',
    city: 'New York',
    zipCode: '10001',
  },
}
```

### 4.3. 可选属性

```javascript
/**
 * @typedef {Object} UserProfile
 * @property {string} username - 必填
 * @property {string} email - 必填
 * @property {string} [phone] - 可选的电话号码
 * @property {number} [age] - 可选的年龄
 */

/**
 * @type {UserProfile}
 */
const profile = {
  username: 'john',
  email: 'john@example.com',
  // phone 和 age 可以省略
}
```

### 4.4. 只读属性

```javascript
/**
 * @typedef {Object} Config
 * @property {readonly string} apiKey - 只读的 API 密钥
 * @property {readonly number} timeout - 只读的超时时间
 * @property {string} endpoint - 可修改的端点
 */

/**
 * @type {Config}
 */
const config = {
  apiKey: 'abc123',
  timeout: 5000,
  endpoint: 'https://api.example.com',
}

// config.apiKey = "new-key"; // ⚠️ 编辑器会提示只读属性不能赋值
```

### 4.5. 索引签名

```javascript
/**
 * @typedef {Object} Dictionary
 * @property {string} [key] - 任意字符串键对应字符串值
 */

/**
 * 定义具有索引签名的对象
 * @typedef {Object.<string, number>} ScoreMap
 */

/**
 * @type {ScoreMap}
 */
const scores = {
  math: 95,
  english: 88,
  science: 92,
}
```

### 4.6. 复杂嵌套结构

```javascript
/**
 * @typedef {Object} Comment
 * @property {string} id
 * @property {string} text
 * @property {string} authorId
 */

/**
 * @typedef {Object} Post
 * @property {string} id
 * @property {string} title
 * @property {string} content
 * @property {string[]} tags - 标签数组
 * @property {Comment[]} comments - 评论数组
 * @property {Object} metadata - 元数据
 * @property {number} metadata.views - 浏览次数
 * @property {number} metadata.likes - 点赞数
 */

/**
 * @type {Post}
 */
const post = {
  id: '1',
  title: 'Hello',
  content: 'World',
  tags: ['tech', 'news'],
  comments: [{ id: '1', text: 'Great!', authorId: 'user1' }],
  metadata: {
    views: 100,
    likes: 10,
  },
}
```

## 5. 🤔 如何定义函数类型？

### 5.1. 基本函数类型

```javascript
/**
 * @typedef {Function} Callback
 */

/**
 * 定义带参数和返回值的函数类型
 * @typedef {function(string, number): boolean} Validator
 */

/**
 * @param {Validator} validate - 验证函数
 */
function processData(validate) {
  const result = validate('test', 123)
  return result
}
```

### 5.2. 详细的函数签名

```javascript
/**
 * @typedef {Object} ProcessOptions
 * @property {boolean} verbose
 * @property {number} timeout
 */

/**
 * @callback ProcessCallback
 * @param {string} data - 处理的数据
 * @param {ProcessOptions} options - 处理选项
 * @returns {Promise<boolean>} 处理是否成功
 */

/**
 * @param {ProcessCallback} callback
 */
function registerProcessor(callback) {
  callback('data', { verbose: true, timeout: 5000 })
}
```

### 5.3. 多个回调函数

```javascript
/**
 * @callback OnSuccess
 * @param {any} data - 成功返回的数据
 * @returns {void}
 */

/**
 * @callback OnError
 * @param {Error} error - 错误对象
 * @returns {void}
 */

/**
 * @typedef {Object} ApiOptions
 * @property {OnSuccess} onSuccess - 成功回调
 * @property {OnError} onError - 错误回调
 */

/**
 * @param {string} url
 * @param {ApiOptions} options
 */
function fetchData(url, options) {
  fetch(url)
    .then((data) => options.onSuccess(data))
    .catch((error) => options.onError(error))
}
```

### 5.4. 泛型函数类型

```javascript
/**
 * @template T
 * @callback Mapper
 * @param {T} item - 输入项
 * @returns {T} 映射后的项
 */

/**
 * @template T
 * @param {T[]} array
 * @param {Mapper<T>} mapper
 * @returns {T[]}
 */
function map(array, mapper) {
  return array.map(mapper)
}
```

### 5.5. 函数重载类型

```javascript
/**
 * @typedef {Object} ParseFunction
 * @property {function(string): number} - 解析为数字
 * @property {function(string, boolean): string} - 带选项解析为字符串
 */

// ⚠️ JSDoc 不完全支持函数重载，建议使用 TypeScript
```

## 6. 🤔 有哪些高级类型定义技巧？

### 6.1. 联合类型

```javascript
/**
 * @typedef {'pending' | 'success' | 'error'} Status
 */

/**
 * @typedef {string | number | boolean} Primitive
 */

/**
 * @typedef {Object} SuccessResult
 * @property {'success'} status
 * @property {any} data
 */

/**
 * @typedef {Object} ErrorResult
 * @property {'error'} status
 * @property {string} message
 */

/**
 * @typedef {SuccessResult | ErrorResult} Result
 */

/**
 * @param {Result} result
 */
function handleResult(result) {
  if (result.status === 'success') {
    console.log(result.data)
  } else {
    console.log(result.message)
  }
}
```

### 6.2. 交叉类型

```javascript
/**
 * @typedef {Object} Timestamped
 * @property {number} createdAt
 * @property {number} updatedAt
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 */

/**
 * 组合类型（交叉类型）
 * @typedef {User & Timestamped} UserWithTimestamps
 */

/**
 * @type {UserWithTimestamps}
 */
const user = {
  id: '1',
  name: 'Alice',
  createdAt: Date.now(),
  updatedAt: Date.now(),
}
```

### 6.3. 泛型类型

```javascript
/**
 * @template T
 * @typedef {Object} Box
 * @property {T} value - 盒子中的值
 */

/**
 * @type {Box<number>}
 */
const numberBox = { value: 42 }

/**
 * @type {Box<string>}
 */
const stringBox = { value: 'hello' }

/**
 * @template T
 * @typedef {Object} Response
 * @property {boolean} success
 * @property {T} data
 * @property {string} [error]
 */

/**
 * @type {Response<User>}
 */
const userResponse = {
  success: true,
  data: { id: '1', name: 'Alice' },
}
```

### 6.4. 递归类型

```javascript
/**
 * @typedef {Object} TreeNode
 * @property {string} value
 * @property {TreeNode[]} [children] - 子节点数组
 */

/**
 * @type {TreeNode}
 */
const tree = {
  value: 'root',
  children: [
    {
      value: 'child1',
      children: [{ value: 'grandchild1' }],
    },
    {
      value: 'child2',
    },
  ],
}
```

### 6.5. 条件类型（有限支持）

```javascript
/**
 * @template T
 * @typedef {T extends string ? string[] : T extends number ? number[] : T[]} ArrayOf
 */

// ⚠️ JSDoc 对条件类型的支持有限，复杂场景建议使用 TypeScript
```

### 6.6. 映射类型

```javascript
/**
 * @typedef {Object} User
 * @property {string} name
 * @property {number} age
 */

/**
 * @typedef {Partial<User>} PartialUser
 */

/**
 * @typedef {Readonly<User>} ReadonlyUser
 */

/**
 * @typedef {Record<string, User>} UserMap
 */
```

### 6.7. 工具类型组合

```javascript
/**
 * @typedef {Object} Entity
 * @property {string} id
 * @property {string} name
 * @property {string} description
 */

/**
 * 创建时不需要 id
 * @typedef {Omit<Entity, 'id'>} CreateEntityInput
 */

/**
 * 更新时所有字段都是可选的
 * @typedef {Partial<Entity>} UpdateEntityInput
 */

/**
 * 只读的实体
 * @typedef {Readonly<Entity>} ReadonlyEntity
 */
```

### 6.8. 类型导入

```javascript
/**
 * 从其他文件导入类型
 * @typedef {import('./types').User} User
 * @typedef {import('./types').Post} Post
 */

/**
 * @param {User} user
 * @param {Post} post
 */
function createUserPost(user, post) {
  // ...
}
```

## 7. 🤔 使用 @typedef 时需要注意什么？

### 7.1. 命名规范

```javascript
// ✅ 推荐：使用 PascalCase
/**
 * @typedef {Object} UserProfile
 * @typedef {Object} ApiResponse
 * @typedef {string} EmailAddress
 */

// ❌ 避免：使用 camelCase 或其他形式
/**
 * @typedef {Object} userProfile
 * @typedef {Object} api_response
 */
```

### 7.2. 类型定义位置

```javascript
// ✅ 推荐：在文件顶部集中定义
/**
 * @typedef {Object} User
 * @property {string} id
 */

/**
 * @typedef {Object} Post
 * @property {string} title
 */

function doSomething() {
  // 使用类型
}

// ❌ 避免：在函数内部定义类型
function doSomething() {
  /**
   * @typedef {Object} User  // ⚠️ 作用域有限
   */
}
```

### 7.3. 避免循环引用

```javascript
// ⚠️ 注意：循环引用可能导致问题
/**
 * @typedef {Object} A
 * @property {B} b
 */

/**
 * @typedef {Object} B
 * @property {A} a
 */

// ✅ 解决方案：使用可选属性打破循环
/**
 * @typedef {Object} A
 * @property {B} [b]
 */

/**
 * @typedef {Object} B
 * @property {A} [a]
 */
```

### 7.4. 类型复用

```javascript
// ✅ 推荐：定义基础类型并组合
/**
 * @typedef {Object} BaseEntity
 * @property {string} id
 * @property {number} createdAt
 */

/**
 * @typedef {Object} User
 * @property {string} name
 * @property {string} email
 */

/**
 * @typedef {User & BaseEntity} UserEntity
 */

// ❌ 避免：重复定义相同属性
/**
 * @typedef {Object} User
 * @property {string} id
 * @property {number} createdAt
 * @property {string} name
 * @property {string} email
 */

/**
 * @typedef {Object} Post
 * @property {string} id
 * @property {number} createdAt
 * @property {string} title
 * @property {string} content
 */
```

### 7.5. 文档注释

```javascript
// ✅ 推荐：为类型和属性添加说明
/**
 * 用户账户信息
 * @typedef {Object} Account
 * @property {string} id - 唯一标识符
 * @property {string} username - 用户名（3-20个字符）
 * @property {string} email - 电子邮箱地址
 * @property {'active' | 'suspended' | 'deleted'} status - 账户状态
 */

// ❌ 避免：缺少说明
/**
 * @typedef {Object} Account
 * @property {string} id
 * @property {string} username
 */
```

### 7.6. 与 TypeScript 的互操作

```javascript
// ✅ JSDoc 类型定义可以被 TypeScript 识别
/**
 * @typedef {Object} User
 * @property {string} name
 * @property {number} age
 */

// 在 TypeScript 文件中可以导入和使用
// import { User } from './types.js';
```

### 7.7. 类型文件组织

```javascript
// types.js - 专门的类型定义文件
/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 */

/**
 * @typedef {Object} Post
 * @property {string} id
 * @property {string} title
 * @property {User} author
 */

// 导出供其他文件使用
export {}

// main.js - 使用类型
/**
 * @typedef {import('./types').User} User
 * @typedef {import('./types').Post} Post
 */
```

### 7.8. 复杂类型的简化

```javascript
// ❌ 避免：过于复杂的内联定义
/**
 * @typedef {function(string, number, {option1: boolean, option2: string, option3: number}): Promise<{success: boolean, data: any, error: string | null}>} ComplexFunction
 */

// ✅ 推荐：拆分为多个简单类型
/**
 * @typedef {Object} Options
 * @property {boolean} option1
 * @property {string} option2
 * @property {number} option3
 */

/**
 * @typedef {Object} Result
 * @property {boolean} success
 * @property {any} data
 * @property {string | null} error
 */

/**
 * @callback ComplexFunction
 * @param {string} arg1
 * @param {number} arg2
 * @param {Options} options
 * @returns {Promise<Result>}
 */
```

### 7.9. 类型检查验证

```javascript
// 使用 @ts-check 启用类型检查
// @ts-check

/**
 * @typedef {Object} User
 * @property {string} name
 * @property {number} age
 */

/**
 * @param {User} user
 */
function greet(user) {
  // ✅ 类型检查会验证 user 参数
  console.log(`Hello, ${user.name}`)

  // ❌ 错误：类型不匹配
  // user.age = "thirty";
}
```

### 7.10. 泛型约束

```javascript
/**
 * @template {string | number} T
 * @typedef {Object} Container
 * @property {T} value
 */

/**
 * @type {Container<string>}
 */
const stringContainer = { value: 'hello' }

/**
 * @type {Container<boolean>}  // ❌ 错误：boolean 不满足约束
 */
// const boolContainer = { value: true };
```

### 7.11. 默认泛型参数

```javascript
/**
 * @template {any} [T=string]
 * @typedef {Object} Box
 * @property {T} value
 */

/**
 * @type {Box}  // 默认使用 string
 */
const box1 = { value: 'hello' }

/**
 * @type {Box<number>}
 */
const box2 = { value: 42 }
```

## 8. 🔗 引用

- [JSDoc @typedef 文档][1]
- [TypeScript JSDoc Reference][2]
- [Using JSDoc with TypeScript][3]

[1]: https://jsdoc.app/tags-typedef.html
[2]: https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
[3]: https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
