# [0225. @ts-check](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0225.%20%40ts-check)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 @ts-check 的作用是什么？](#3--ts-check-的作用是什么)
- [4. 🤔 如何在项目中逐步启用类型检查？](#4--如何在项目中逐步启用类型检查)
- [5. 🤔 @ts-check 与 JSDoc 如何配合使用？](#5--ts-check-与-jsdoc-如何配合使用)
- [6. 🤔 使用 @ts-check 时需要注意哪些问题？](#6--使用-ts-check-时需要注意哪些问题)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- `@ts-check` 注释的基本用法
- 在 JavaScript 文件中启用类型检查
- 与 JSDoc 的配合使用
- 渐进式迁移到 TypeScript

## 2. 🫧 评价

`@ts-check` 允许在 JavaScript 文件中启用 TypeScript 类型检查，无需将文件改为 `.ts` 扩展名。

- 适合在 JavaScript 项目中逐步引入类型检查
- 必须放在文件第一行才能生效
- 可以配合 JSDoc 注释提供类型信息
- 是从 JavaScript 迁移到 TypeScript 的好方法
- 比直接迁移到 TypeScript 风险更低

## 3. 🤔 @ts-check 的作用是什么？

`@ts-check` 在 JavaScript 文件中启用 TypeScript 类型检查：

```javascript
// @ts-check

// ✅ 基本类型推断
let count = 0
count = 'hello' // ❌ Error: Type 'string' is not assignable to type 'number'

// ✅ 函数参数检查
function add(a, b) {
  return a + b
}

add(1, 2) // ✅ 正确
add(1, 'hello') // ⚠️ 警告：参数类型不匹配

// ✅ 对象属性检查
const user = {
  name: 'Alice',
  age: 30,
}

console.log(user.name) // ✅ 正确
console.log(user.email) // ❌ Error: Property 'email' does not exist

// ✅ null/undefined 检查
function greet(name) {
  return `Hello, ${name.toUpperCase()}` // ⚠️ 警告：name 可能是 undefined
}

// ✅ 数组类型推断
const numbers = [1, 2, 3]
numbers.push(4) // ✅ 正确
numbers.push('5') // ⚠️ 警告：类型不匹配
```

**位置要求：**

```javascript
// ❌ 错误：不是第一行
// 文件说明
// @ts-check

// ❌ 错误：前面有其他代码
const x = 1
// @ts-check

// ✅ 正确：第一行
// @ts-check
// 文件其他说明

// ✅ 正确：可以有说明
// @ts-check - 启用类型检查

// ✅ 正确：块注释形式
/* @ts-check */
```

**与 tsconfig.json 配合：**

```javascript
// tsconfig.json
{
  "compilerOptions": {
    "allowJs": true, // 允许编译 JS 文件
    "checkJs": false, // 全局不检查 JS 文件
    "noEmit": true // 不生成输出文件
  },
  "include": ["src/**/*"]
}

// 单个文件启用检查
// src/utils.js
// @ts-check

function multiply(a, b) {
  return a * b;
}

// src/helpers.js
// 这个文件不会被检查（没有 @ts-check）
function divide(a, b) {
  return a / b; // 不会报错
}
```

**关闭特定文件的检查：**

```javascript
// tsconfig.json
{
  "compilerOptions": {
    "checkJs": true // 全局检查所有 JS 文件
  }
}

// 某个文件关闭检查
// legacy-code.js
// @ts-nocheck

function oldFunction() {
  // 不进行类型检查
}

// 另一个文件保持检查
// new-code.js
// 自动检查（因为 checkJs: true）

function newFunction(x) {
  return x * 2;
}
```

## 4. 🤔 如何在项目中逐步启用类型检查？

渐进式启用类型检查的策略：

```javascript
// 阶段 1：选择一个简单的文件开始
// src/utils/string.js
// @ts-check

/**
 * 转换字符串为大写
 * @param {string} str
 * @returns {string}
 */
function toUpperCase(str) {
  return str.toUpperCase();
}

/**
 * 连接字符串
 * @param {...string} strings
 * @returns {string}
 */
function concat(...strings) {
  return strings.join('');
}

module.exports = { toUpperCase, concat };

// 阶段 2：扩展到相关文件
// src/utils/number.js
// @ts-check

/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function add(a, b) {
  return a + b;
}

/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function subtract(a, b) {
  return a - b;
}

module.exports = { add, subtract };

// 阶段 3：处理复杂类型
// src/models/user.js
// @ts-check

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {number} [age] - 可选属性
 */

/**
 * 创建用户
 * @param {Omit<User, 'id'>} userData
 * @returns {User}
 */
function createUser(userData) {
  return {
    id: Date.now(),
    ...userData
  };
}

/**
 * @param {User[]} users
 * @returns {User[]}
 */
function sortUsers(users) {
  return users.sort((a, b) => a.name.localeCompare(b.name));
}

module.exports = { createUser, sortUsers };

// 阶段 4：处理异步代码
// src/api/user-api.js
// @ts-check

/**
 * @typedef {import('./models/user').User} User
 */

/**
 * 获取用户
 * @param {number} id
 * @returns {Promise<User>}
 */
async function getUser(id) {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

/**
 * 获取所有用户
 * @returns {Promise<User[]>}
 */
async function getUsers() {
  const response = await fetch('/api/users');
  return response.json();
}

module.exports = { getUser, getUsers };

// 阶段 5：全局启用
// 当大部分文件都添加了 @ts-check 后
// 修改 tsconfig.json 全局启用

// tsconfig.json
{
  "compilerOptions": {
    "checkJs": true, // 全局启用
    "allowJs": true,
    "noEmit": true,
    "strict": true
  }
}

// 移除所有 @ts-check 注释
// 对于还有问题的文件，使用 @ts-nocheck
```

**迁移检查清单：**

```javascript
// scripts/check-migration.js
const fs = require('fs');
const path = require('path');

/**
 * 统计项目迁移进度
 */
function checkMigrationProgress() {
  let totalFiles = 0;
  let checkedFiles = 0;
  let typescriptFiles = 0;

  function scan(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory() && !file.includes('node_modules')) {
        scan(filePath);
      } else if (file.endsWith('.js')) {
        totalFiles++;
        const content = fs.readFileSync(filePath, 'utf-8');

        if (content.includes('@ts-check')) {
          checkedFiles++;
        }
      } else if (file.endsWith('.ts')) {
        typescriptFiles++;
      }
    });
  }

  scan('./src');

  const percentage = ((checkedFiles + typescriptFiles) / (totalFiles + typescriptFiles) * 100).toFixed(2);

  console.log('迁移进度报告:');
  console.log(`JavaScript 文件: ${totalFiles}`);
  console.log(`已添加 @ts-check: ${checkedFiles}`);
  console.log(`TypeScript 文件: ${typescriptFiles}`);
  console.log(`完成度: ${percentage}%`);

  return { totalFiles, checkedFiles, typescriptFiles, percentage };
}

// 运行检查
checkMigrationProgress();

// package.json
{
  "scripts": {
    "check:migration": "node scripts/check-migration.js"
  }
}
```

## 5. 🤔 @ts-check 与 JSDoc 如何配合使用？

结合 JSDoc 可以提供完整的类型信息：

```javascript
// @ts-check

// 示例 1：基础类型注解
/**
 * 计算两个数的和
 * @param {number} a - 第一个数
 * @param {number} b - 第二个数
 * @returns {number} 两数之和
 */
function add(a, b) {
  return a + b
}

add(1, 2) // ✅ 正确
add(1, '2') // ❌ Error: Argument of type 'string' is not assignable to parameter of type 'number'

// 示例 2：对象类型
/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {number} price
 * @property {string[]} tags
 */

/**
 * @param {Product} product
 * @returns {string}
 */
function formatProduct(product) {
  return `${product.name} - $${product.price}`
}

formatProduct({
  id: 1,
  name: 'Book',
  price: 29.99,
  tags: ['education'],
}) // ✅ 正确

formatProduct({
  id: 1,
  name: 'Book',
  // ❌ Error: Property 'price' is missing
})

// 示例 3：联合类型
/**
 * @param {string | number} value
 * @returns {string}
 */
function toString(value) {
  return String(value)
}

toString('hello') // ✅ 正确
toString(123) // ✅ 正确
toString(true) // ❌ Error: Argument of type 'boolean' is not assignable

// 示例 4：泛型
/**
 * @template T
 * @param {T[]} array
 * @returns {T | undefined}
 */
function first(array) {
  return array[0]
}

const num = first([1, 2, 3]) // num: number | undefined
const str = first(['a', 'b']) // str: string | undefined

// 示例 5：复杂对象
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
 * @property {Address} address
 * @property {string[]} [hobbies] - 可选属性
 */

/**
 * @param {Person} person
 * @returns {string}
 */
function formatAddress(person) {
  const { address } = person
  return `${address.street}, ${address.city} ${address.zipCode}`
}

// 示例 6：函数类型
/**
 * @typedef {function(number, number): number} BinaryOperation
 */

/**
 * @param {number[]} numbers
 * @param {BinaryOperation} operation
 * @returns {number}
 */
function reduce(numbers, operation) {
  return numbers.reduce(operation)
}

reduce([1, 2, 3], (a, b) => a + b) // ✅ 正确

// 示例 7：类型导入
/**
 * @typedef {import('./types').User} User
 * @typedef {import('./types').ApiResponse<User>} UserResponse
 */

/**
 * @param {number} id
 * @returns {Promise<UserResponse>}
 */
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

// 示例 8：类类型
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
}

const numContainer = new Container(42)
const strContainer = numContainer.map((n) => n.toString())
// strContainer: Container<string>

// 示例 9：回调函数
/**
 * @callback CompareFunction
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */

/**
 * @param {number[]} array
 * @param {CompareFunction} compare
 * @returns {number[]}
 */
function sort(array, compare) {
  return array.slice().sort(compare)
}

// 示例 10：枚举类型
/**
 * @typedef {'pending' | 'success' | 'error'} Status
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {Status} status
 */

/**
 * @param {Task} task
 * @param {Status} newStatus
 */
function updateTaskStatus(task, newStatus) {
  task.status = newStatus
}

const task = { id: '1', title: 'Task 1', status: 'pending' }
updateTaskStatus(task, 'success') // ✅ 正确
updateTaskStatus(task, 'completed') // ❌ Error: 不在枚举值中
```

## 6. 🤔 使用 @ts-check 时需要注意哪些问题？

使用 `@ts-check` 的注意事项：

```javascript
// 注意 1：必须在文件第一行
// ❌ 错误
'use strict';
// @ts-check

// ✅ 正确
// @ts-check
'use strict';

// 注意 2：类型推断的局限性
// @ts-check

// ⚠️ 推断为 any
function process(data) {
  return data.value; // 不会报错，data 是 any
}

// ✅ 明确类型
/**
 * @param {{ value: number }} data
 */
function betterProcess(data) {
  return data.value; // 有类型检查
}

// 注意 3：需要额外的 JSDoc 注解
// @ts-check

// ⚠️ 复杂类型需要 JSDoc
const complexObject = {
  users: [
    { id: 1, name: 'Alice' }
  ]
};

// ✅ 使用 typedef
/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 */

/**
 * @type {{ users: User[] }}
 */
const betterObject = {
  users: [
    { id: 1, name: 'Alice' }
  ]
};

// 注意 4：第三方库类型
// @ts-check

// ⚠️ 需要安装类型定义
const _ = require('lodash');
// 需要: npm install --save-dev @types/lodash

// ✅ 使用类型定义
// 现在有完整的类型检查
const result = _.map([1, 2, 3], n => n * 2);

// 注意 5：全局变量声明
// @ts-check

// ❌ 全局变量未定义
console.log(myGlobalVar); // Error

// ✅ 在 global.d.ts 中声明
// global.d.ts
// declare const myGlobalVar: string;

// 或者使用 @ts-ignore
// @ts-ignore
console.log(myGlobalVar);

// 注意 6：动态属性访问
// @ts-check

/**
 * @typedef {Object} Config
 * @property {string} apiUrl
 * @property {number} timeout
 */

/**
 * @param {Config} config
 * @param {string} key
 */
function getValue(config, key) {
  // ⚠️ 动态访问失去类型检查
  return config[key];
}

// ✅ 使用明确的属性访问
function getBetterValue(config) {
  return {
    apiUrl: config.apiUrl,
    timeout: config.timeout
  };
}

// 注意 7：this 类型
// @ts-check

const obj = {
  value: 42,
  getValue: function() {
    // ⚠️ this 类型不明确
    return this.value;
  }
};

// ✅ 明确 this 类型
const betterObj = {
  value: 42,
  /**
   * @this {{ value: number }}
   */
  getValue: function() {
    return this.value;
  }
};

// 注意 8：性能影响
// @ts-check 会增加编译时间

// 对于大型项目，考虑：
// 1. 仅在关键文件中使用
// 2. 使用增量编译
// 3. 逐步迁移到 TypeScript

// tsconfig.json
{
  "compilerOptions": {
    "incremental": true, // 启用增量编译
    "tsBuildInfoFile": ".tsbuildinfo"
  }
}

// 注意 9：与构建工具集成
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env'],
              ['@babel/preset-typescript', {
                allowDeclareFields: true
              }]
            ]
          }
        }
      }
    ]
  }
};

// 注意 10：团队约定
// 在团队中统一规范

// 示例团队规范：
/**
 * 代码规范
 *
 * 1. 所有新文件必须添加 @ts-check
 * 2. 所有公共 API 必须有 JSDoc 注解
 * 3. 复杂类型使用 @typedef 定义
 * 4. 定期审查和改进类型定义
 * 5. 目标：6个月内迁移到 TypeScript
 */

// .eslintrc.js
module.exports = {
  rules: {
    'jsdoc/require-jsdoc': ['error', {
      require: {
        FunctionDeclaration: true,
        MethodDefinition: true,
        ClassDeclaration: true
      }
    }],
    'jsdoc/require-param-type': 'error',
    'jsdoc/require-returns-type': 'error'
  }
};
```

## 7. 🔗 引用

- [TypeScript Handbook - Type Checking JavaScript Files][1]
- [JSDoc Reference][2]
- [VS Code - JavaScript Type Checking][3]

[1]: https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html
[2]: https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
[3]: https://code.visualstudio.com/docs/nodejs/working-with-javascript
