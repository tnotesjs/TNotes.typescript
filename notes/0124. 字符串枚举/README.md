# [0124. 字符串枚举](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0124.%20%E5%AD%97%E7%AC%A6%E4%B8%B2%E6%9E%9A%E4%B8%BE)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是字符串枚举？](#3--什么是字符串枚举)
- [4. 🤔 字符串枚举的常见命名模式有哪些？](#4--字符串枚举的常见命名模式有哪些)
- [5. 🤔 关于字符串枚举的开发实践建议都有哪些？](#5--关于字符串枚举的开发实践建议都有哪些)
- [6. 🔗 引用](#6--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 字符串枚举的定义和特性
- 字符串枚举的一些使用建议

## 2. 🫧 评价

字符串枚举（String Enum）是 TypeScript 中使用字符串作为值的枚举类型。

## 3. 🤔 什么是字符串枚举？

字符串枚举是成员值为字符串字面量的枚举类型，每个成员都必须显式初始化。

- 显式初始化：每个成员必须赋值
- 字符串字面量：值是字符串类型
- 无反向映射：只能通过名称访问

```ts
// 字符串枚举
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}

const dir: Direction = Direction.Up
console.log(dir) // 'UP'

// ❌ 没有反向映射
// console.log(Direction['UP'])  // undefined
// 当访问 Direction['UP'] 的时候，会报错提示：
// Property 'UP' does not exist on type 'typeof Direction'. Did you mean 'Up'?(2551)
```

## 4. 🤔 字符串枚举的常见命名模式有哪些？

```ts
// 1. 全大写且与名称相同（推荐）
enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
}

// 2. 小写短横线
enum EventType {
  UserLogin = 'user-login',
  UserLogout = 'user-logout',
  DataUpdated = 'data-updated',
}

// 3. 小写下划线
enum ApiEndpoint {
  GetUsers = 'get_users',
  CreateUser = 'create_user',
  DeleteUser = 'delete_user',
}

// 4. 驼峰命名
enum ActionType {
  AddItem = 'addItem',
  RemoveItem = 'removeItem',
  UpdateItem = 'updateItem',
}
```

## 5. 🤔 关于字符串枚举的开发实践建议都有哪些？

```ts
// ✅ 1. 使用大写值，并且 val 和 key 同名
enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}
// 这么做的话，key 和 val 都是同名的，也就无所谓什么反向映射了

// ✅ 2. 使用 const enum 优化
const enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
}

const dir = Direction.UP // 编译为: const dir = "UP"

// ✅ 3. 导出枚举值类型
enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export type StatusValue = `${Status}`
// 等价于: type StatusValue = 'ACTIVE' | 'INACTIVE'

// ✅ 4. 使用 satisfies 确保完整性
enum Color {
  RED = 'RED',
  GREEN = 'GREEN',
  BLUE = 'BLUE',
}

const colorNames = {
  [Color.RED]: '红色',
  [Color.GREEN]: '绿色',
  [Color.BLUE]: '蓝色',
} satisfies Record<Color, string>

// ✅ 5. 文档化枚举
/**
 * HTTP 请求方法
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
 */
enum HttpMethod {
  /** GET 方法用于请求指定资源 */
  GET = 'GET',

  /** POST 方法用于提交数据 */
  POST = 'POST',

  /** PUT 方法用于更新资源 */
  PUT = 'PUT',

  /** DELETE 方法用于删除资源 */
  DELETE = 'DELETE',
}
```

## 6. 🔗 引用

- [TypeScript Handbook - Enums][1]
- [TypeScript Deep Dive - String Enums][2]
- [TypeScript Enum Best Practices][3]

[1]: https://www.typescriptlang.org/docs/handbook/enums.html
[2]: https://basarat.gitbook.io/typescript/type-system/enums#string-enums
[3]: https://www.typescriptlang.org/docs/handbook/enums.html#string-enums
