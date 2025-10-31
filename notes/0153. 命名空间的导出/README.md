# [0153. 命名空间的导出](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0153.%20%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4%E7%9A%84%E5%AF%BC%E5%87%BA)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 命名空间中的 export 关键字如何使用？](#3--命名空间中的-export-关键字如何使用)
  - [3.1. 导出规则总结](#31-导出规则总结)
- [4. 🤔 如何导出命名空间本身？](#4--如何导出命名空间本身)
  - [4.1. 导出方式对比](#41-导出方式对比)
- [5. 🤔 命名空间导出与模块导出有什么区别？](#5--命名空间导出与模块导出有什么区别)
  - [5.1. 区别对比表](#51-区别对比表)
- [6. 🤔 如何在模块中导出命名空间？](#6--如何在模块中导出命名空间)
  - [6.1. 在模块中使用命名空间的场景](#61-在模块中使用命名空间的场景)
- [7. 🤔 命名空间导出的实际应用有哪些？](#7--命名空间导出的实际应用有哪些)
  - [7.1. 常见错误与解决方案](#71-常见错误与解决方案)
  - [7.2. 最佳实践建议](#72-最佳实践建议)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 命名空间内部成员的导出语法
- 导出命名空间本身的方法
- 命名空间导出与模块导出的区别
- 在模块中导出命名空间的方式
- 命名空间导出的实际应用场景

## 2. 🫧 评价

命名空间的导出机制是 TypeScript 早期组织代码的重要特性。在命名空间内部使用 export 关键字可以控制成员的可见性，只有导出的成员才能被外部访问。在现代开发中，虽然 ES6 模块系统已经取代命名空间成为主流，但理解命名空间的导出机制对于维护遗留代码和阅读类型声明文件仍然重要。

建议：

- 新项目统一使用 ES6 模块的 import/export，避免使用命名空间
- 命名空间的 export 主要用于控制内部成员的访问权限
- 理解命名空间导出主要是为了阅读第三方库的类型定义
- 在模块文件中可以导出命名空间用于逻辑分组，但应谨慎使用

核心内容总结：命名空间使用 export 关键字导出成员，控制可见性。可以通过 export namespace 导出整个命名空间，也可以在模块中导出命名空间。现代开发应优先使用模块系统。

## 3. 🤔 命名空间中的 export 关键字如何使用？

在命名空间内部使用 export 关键字导出成员，使其可被外部访问。

::: code-group

```typescript [基本导出语法]
// ✅ 命名空间内部使用 export 导出成员
namespace Utils {
  // ❌ 未导出的成员外部无法访问
  const privateValue = 'private'

  // ✅ 导出的常量
  export const VERSION = '1.0.0'

  // ✅ 导出的函数
  export function format(str: string): string {
    return str.toUpperCase()
  }

  // ✅ 导出的接口
  export interface Config {
    timeout: number
    retries: number
  }

  // ✅ 导出的类
  export class Logger {
    log(message: string) {
      console.log(message)
    }
  }

  // ❌ 未导出的函数
  function internalHelper() {
    return privateValue
  }
}

// 使用导出的成员
console.log(Utils.VERSION) // 1.0.0
console.log(Utils.format('hello')) // HELLO

const config: Utils.Config = {
  timeout: 3000,
  retries: 3,
}

const logger = new Utils.Logger()

// ❌ 错误：无法访问未导出的成员
// console.log(Utils.privateValue); // 错误
// Utils.internalHelper(); // 错误
```

```typescript [嵌套命名空间的导出]
// ✅ 嵌套命名空间需要逐层导出
namespace App {
  // ✅ 导出子命名空间
  export namespace Models {
    // ✅ 在子命名空间中导出成员
    export interface User {
      id: string
      name: string
    }

    export interface Post {
      id: string
      title: string
    }

    // ❌ 未导出的接口
    interface Internal {
      data: any
    }
  }

  // ✅ 导出另一个子命名空间
  export namespace Services {
    export class UserService {
      getUser(id: string): Models.User {
        return { id, name: 'User' }
      }
    }
  }

  // ❌ 未导出的子命名空间
  namespace Private {
    export function helper() {
      return 'private'
    }
  }
}

// 访问嵌套导出的成员
const user: App.Models.User = {
  id: '1',
  name: '张三',
}

const service = new App.Services.UserService()

// ❌ 错误：无法访问未导出的命名空间
// App.Private.helper(); // 错误
```

```typescript [选择性导出]
// ✅ 只导出部分成员实现封装
namespace Database {
  // 私有配置
  const connectionPool = new Map()

  // 私有辅助函数
  function validateConnection(id: string): boolean {
    return connectionPool.has(id)
  }

  // ✅ 导出的公共接口
  export interface ConnectionConfig {
    host: string
    port: number
  }

  // ✅ 导出的公共方法
  export function connect(config: ConnectionConfig): string {
    const id = `${config.host}:${config.port}`
    if (!validateConnection(id)) {
      connectionPool.set(id, config)
    }
    return id
  }

  // ✅ 导出的公共方法
  export function disconnect(id: string): void {
    connectionPool.delete(id)
  }

  // ⚠️ 未导出，用于测试的方法
  export function __testOnly_clearPool(): void {
    connectionPool.clear()
  }
}

// 使用公共 API
const connId = Database.connect({
  host: 'localhost',
  port: 5432,
})

Database.disconnect(connId)

// ❌ 无法访问私有实现
// Database.validateConnection('id'); // 错误
// Database.connectionPool; // 错误
```

```typescript [导出类型和值]
// ✅ 可以同时导出类型和值
namespace API {
  // ✅ 导出类型
  export type ResponseStatus = 'success' | 'error'

  export interface Response<T> {
    status: ResponseStatus
    data: T
  }

  // ✅ 导出值
  export const STATUS_SUCCESS: ResponseStatus = 'success'
  export const STATUS_ERROR: ResponseStatus = 'error'

  // ✅ 导出函数
  export function createResponse<T>(
    data: T,
    status: ResponseStatus = STATUS_SUCCESS
  ): Response<T> {
    return { status, data }
  }
}

// 使用导出的类型和值
type UserResponse = API.Response<{ name: string }>

const response: UserResponse = API.createResponse(
  { name: '张三' },
  API.STATUS_SUCCESS
)
```

:::

### 3.1. 导出规则总结

| 特性       | 说明                       |
| ---------- | -------------------------- |
| 导出语法   | 在成员前添加 export        |
| 可导出内容 | 函数、类、接口、类型、常量 |
| 嵌套导出   | 子命名空间也需要 export    |
| 访问控制   | 未导出成员仅内部可见       |
| 默认不导出 | 所有成员默认为私有         |
| 导出顺序   | 导出声明的顺序不影响使用   |

## 4. 🤔 如何导出命名空间本身？

可以将命名空间作为一个整体导出，供其他模块使用。

::: code-group

```typescript [导出顶层命名空间]
// ✅ utils.ts - 导出整个命名空间
export namespace StringUtils {
  export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  export function reverse(str: string): string {
    return str.split('').reverse().join('')
  }
}

export namespace NumberUtils {
  export function isEven(num: number): boolean {
    return num % 2 === 0
  }

  export function isOdd(num: number): boolean {
    return num % 2 !== 0
  }
}

// main.ts - 使用导出的命名空间
import { StringUtils, NumberUtils } from './utils'

console.log(StringUtils.capitalize('hello')) // Hello
console.log(NumberUtils.isEven(4)) // true
```

```typescript [重新导出命名空间]
// ✅ core/math.ts
export namespace Math {
  export function add(a: number, b: number): number {
    return a + b
  }
}

// ✅ index.ts - 重新导出
export { Math } from './core/math'

// 或者使用别名重新导出
export { Math as MathUtils } from './core/math'

// app.ts - 使用
import { Math, MathUtils } from './index'

console.log(Math.add(1, 2)) // 3
console.log(MathUtils.add(1, 2)) // 3
```

```typescript [导出嵌套命名空间]
// ✅ api.ts
export namespace API {
  export namespace V1 {
    export interface User {
      id: string
      name: string
    }

    export function getUser(id: string): User {
      return { id, name: 'User' }
    }
  }

  export namespace V2 {
    export interface User {
      id: string
      username: string
      email: string
    }

    export function getUser(id: string): User {
      return {
        id,
        username: 'user',
        email: 'user@example.com',
      }
    }
  }
}

// main.ts
import { API } from './api'

const v1User = API.V1.getUser('1')
const v2User = API.V2.getUser('1')
```

```typescript [混合导出]
// ✅ lib.ts - 混合导出命名空间和其他内容
// 导出普通函数
export function globalHelper() {
  return 'helper'
}

// 导出命名空间
export namespace Utils {
  export function format(str: string): string {
    return str.trim()
  }
}

// 导出类
export class Logger {
  log(msg: string) {
    console.log(msg)
  }
}

// main.ts - 使用
import { globalHelper, Utils, Logger } from './lib'

console.log(globalHelper())
console.log(Utils.format('  text  '))

const logger = new Logger()
logger.log('message')
```

:::

### 4.1. 导出方式对比

| 导出方式         | 语法                            | 使用场景             |
| ---------------- | ------------------------------- | -------------------- |
| 直接导出命名空间 | `export namespace NS { }`       | 模块文件中的命名空间 |
| 重新导出命名空间 | `export { NS } from './module'` | 统一对外接口         |
| 导出并重命名     | `export { NS as Alias }`        | 避免命名冲突         |
| 导出嵌套命名空间 | `export namespace NS.Sub { }`   | 多层级组织           |
| 混合导出         | 同时导出命名空间和其他成员      | 灵活的模块结构       |

## 5. 🤔 命名空间导出与模块导出有什么区别？

命名空间的 export 和模块的 export 虽然使用相同关键字，但含义和作用完全不同。

::: code-group

```typescript [命名空间导出]
// ✅ 命名空间的 export - 控制内部可见性
namespace MyLib {
  // export 决定成员是否可以通过命名空间访问
  export function publicFunc() {
    return 'public'
  }

  // 未导出的成员只在命名空间内部可见
  function privateFunc() {
    return 'private'
  }
}

// 命名空间成员通过点号访问
MyLib.publicFunc() // ✅ 可以访问
// MyLib.privateFunc(); // ❌ 错误：未导出

// 💡 特点：
// 1. 在同一文件内生效
// 2. 不涉及模块系统
// 3. 编译后成为对象属性
```

```typescript [模块导出]
// ✅ 模块的 export - 跨文件共享
// utils.ts
export function publicFunc() {
  return 'public'
}

// 未导出的函数在模块外不可见
function privateFunc() {
  return 'private'
}

// main.ts
import { publicFunc } from './utils'

publicFunc() // ✅ 可以访问
// privateFunc(); // ❌ 错误：未导入

// 💡 特点：
// 1. 跨文件工作
// 2. 基于模块系统
// 3. 需要 import/export
// 4. 支持 tree-shaking
```

```typescript [作用域对比]
// ✅ 命名空间 - 全局或文件作用域
namespace GlobalNS {
  export const value = 'global'
}

// 同一文件任何地方都可以访问
console.log(GlobalNS.value)

// ===================================

// ✅ 模块 - 文件作用域
// module1.ts
export const value = 'module'

// module2.ts
// ❌ 错误：必须导入才能使用
// console.log(value);

// ✅ 正确：显式导入
import { value } from './module1'
console.log(value)
```

```typescript [编译结果对比]
// 命名空间编译后
var MyNS
;(function (MyNS) {
  function func() {
    return 'value'
  }
  MyNS.func = func
})(MyNS || (MyNS = {}))

// 使用
MyNS.func()

// ===================================

// 模块编译后（CommonJS）
// module.js
Object.defineProperty(exports, '__esModule', { value: true })
exports.func = func
function func() {
  return 'value'
}

// main.js
const module_1 = require('./module')
module_1.func()
```

:::

### 5.1. 区别对比表

| 特性         | 命名空间 export          | 模块 export          |
| ------------ | ------------------------ | -------------------- |
| 作用范围     | 文件或全局作用域         | 模块作用域           |
| 访问方式     | 通过命名空间名称访问     | 通过 import 导入     |
| 依赖管理     | 无显式依赖声明           | 明确的 import/export |
| 编译输出     | IIFE 包装的对象          | 模块格式             |
| Tree-shaking | 不支持                   | 支持                 |
| 代码分割     | 不支持                   | 支持                 |
| 跨文件使用   | 需要全局声明或三斜线指令 | 直接 import          |
| 工具支持     | 有限                     | 完善                 |
| 推荐使用场景 | 类型声明文件、遗留代码   | 现代应用开发         |

## 6. 🤔 如何在模块中导出命名空间？

在 ES6 模块文件中可以导出命名空间，用于特定的逻辑分组。

::: code-group

```typescript [模块中导出命名空间]
// ✅ config.ts - 在模块中导出命名空间
export namespace Database {
  export interface Config {
    host: string
    port: number
  }

  export const defaultConfig: Config = {
    host: 'localhost',
    port: 5432,
  }
}

export namespace API {
  export interface Config {
    baseURL: string
    timeout: number
  }

  export const defaultConfig: Config = {
    baseURL: 'https://api.example.com',
    timeout: 3000,
  }
}

// main.ts - 导入使用
import { Database, API } from './config'

const dbConfig: Database.Config = Database.defaultConfig
const apiConfig: API.Config = API.defaultConfig
```

```typescript [混合导出模式]
// ✅ services.ts
// 普通导出
export class BaseService {
  protected request(url: string) {
    return fetch(url)
  }
}

// 命名空间导出（用于分组相关类型）
export namespace ServiceTypes {
  export interface RequestConfig {
    url: string
    method: string
  }

  export interface Response<T> {
    data: T
    status: number
  }
}

// 使用命名空间类型的类
export class ApiService extends BaseService {
  async get<T>(
    config: ServiceTypes.RequestConfig
  ): Promise<ServiceTypes.Response<T>> {
    const response = await this.request(config.url)
    return {
      data: await response.json(),
      status: response.status,
    }
  }
}

// main.ts
import { ApiService, ServiceTypes } from './services'

const service = new ApiService()
const config: ServiceTypes.RequestConfig = {
  url: '/api/users',
  method: 'GET',
}
```

```typescript [重新导出和组合]
// ✅ core/types.ts
export namespace CoreTypes {
  export interface User {
    id: string
    name: string
  }
}

// ✅ core/utils.ts
export namespace CoreUtils {
  export function formatId(id: string): string {
    return id.toUpperCase()
  }
}

// ✅ index.ts - 统一导出
export { CoreTypes } from './core/types'
export { CoreUtils } from './core/utils'

// 或者组合到一个命名空间
export namespace Core {
  export import Types = require('./core/types').CoreTypes
  export import Utils = require('./core/utils').CoreUtils
}

// app.ts
import { CoreTypes, CoreUtils } from './index'
// 或
import { Core } from './index'
```

```typescript [条件导出]
// ✅ features.ts
const FEATURE_FLAGS = {
  newAPI: true,
  legacySupport: false,
}

// 根据特性标志导出不同命名空间
export namespace API {
  if (FEATURE_FLAGS.newAPI) {
    export namespace V2 {
      export function request() {
        return 'v2'
      }
    }
  }

  if (FEATURE_FLAGS.legacySupport) {
    export namespace V1 {
      export function request() {
        return 'v1'
      }
    }
  }
}
```

:::

### 6.1. 在模块中使用命名空间的场景

| 场景             | 是否推荐  | 说明                     |
| ---------------- | --------- | ------------------------ |
| 类型分组         | ✅ 推荐   | 组织相关的类型定义       |
| 常量分组         | ⚠️ 谨慎   | 考虑使用对象或枚举       |
| 避免命名冲突     | ✅ 推荐   | 区分同名但不同用途的类型 |
| 逻辑功能分组     | ❌ 不推荐 | 应使用目录结构           |
| 版本化 API       | ✅ 推荐   | 区分不同版本的接口       |
| 临时兼容遗留代码 | ⚠️ 谨慎   | 过渡期使用，计划迁移     |

## 7. 🤔 命名空间导出的实际应用有哪些？

命名空间导出在特定场景下仍有其应用价值。

::: code-group

```typescript [应用1：类型声明文件]
// ✅ types/express.d.ts - 扩展第三方库类型
import 'express'

declare global {
  namespace Express {
    // 导出自定义接口扩展
    export interface Request {
      user?: {
        id: string
        name: string
        role: string
      }
    }

    export interface Response {
      sendSuccess<T>(data: T): void
      sendError(message: string): void
    }
  }
}

// middleware.ts - 使用扩展的类型
import { Request, Response } from 'express'

export function authMiddleware(req: Request, res: Response, next: Function) {
  // req.user 现在有类型提示
  if (!req.user) {
    res.sendError('Unauthorized')
    return
  }
  next()
}
```

```typescript [应用2：API 版本管理]
// ✅ api.ts
export namespace API {
  // V1 版本
  export namespace V1 {
    export interface User {
      id: string
      name: string
    }

    export function getUser(id: string): User {
      return { id, name: 'User' }
    }
  }

  // V2 版本
  export namespace V2 {
    export interface User {
      id: string
      username: string
      email: string
      profile: {
        avatar: string
        bio: string
      }
    }

    export function getUser(id: string): User {
      return {
        id,
        username: 'user',
        email: 'user@example.com',
        profile: {
          avatar: 'avatar.jpg',
          bio: 'User bio',
        },
      }
    }
  }

  // 迁移工具
  export namespace Migration {
    export function v1ToV2(v1User: V1.User): V2.User {
      return {
        id: v1User.id,
        username: v1User.name,
        email: `${v1User.name}@example.com`,
        profile: {
          avatar: 'default.jpg',
          bio: '',
        },
      }
    }
  }
}

// 使用不同版本
import { API } from './api'

const v1User = API.V1.getUser('1')
const v2User = API.V2.getUser('1')
const migrated = API.Migration.v1ToV2(v1User)
```

```typescript [应用3：配置管理]
// ✅ config.ts
export namespace AppConfig {
  export namespace Development {
    export const API_URL = 'http://localhost:3000'
    export const DEBUG = true
    export const LOG_LEVEL = 'debug'
  }

  export namespace Production {
    export const API_URL = 'https://api.example.com'
    export const DEBUG = false
    export const LOG_LEVEL = 'error'
  }

  export namespace Test {
    export const API_URL = 'http://test.example.com'
    export const DEBUG = true
    export const LOG_LEVEL = 'info'
  }

  // 根据环境选择配置
  export function getConfig() {
    const env = process.env.NODE_ENV || 'development'

    switch (env) {
      case 'production':
        return Production
      case 'test':
        return Test
      default:
        return Development
    }
  }
}

// app.ts
import { AppConfig } from './config'

const config = AppConfig.getConfig()
console.log(`API URL: ${config.API_URL}`)
console.log(`Debug: ${config.DEBUG}`)
```

```typescript [应用4：工具函数分组]
// ✅ utils.ts
export namespace StringUtils {
  export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  export function truncate(str: string, length: number): string {
    return str.length > length ? str.slice(0, length) + '...' : str
  }

  export function slug(str: string): string {
    return str
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
  }
}

export namespace DateUtils {
  export function formatDate(date: Date): string {
    return date.toISOString().split('T')[0]
  }

  export function addDays(date: Date, days: number): Date {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }

  export function diffDays(date1: Date, date2: Date): number {
    const diff = date2.getTime() - date1.getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24))
  }
}

// main.ts
import { StringUtils, DateUtils } from './utils'

const title = StringUtils.capitalize('hello world')
const slug = StringUtils.slug(title)
const today = DateUtils.formatDate(new Date())
```

:::

### 7.1. 常见错误与解决方案

- 错误 1：过度使用命名空间替代模块
- 错误 2：命名空间导出混乱

::: code-group

```typescript [1]
// ❌ 不推荐：用命名空间组织所有代码
export namespace App {
  export namespace Components {
    export namespace Buttons {
      export class PrimaryButton {}
    }
  }
}

// ✅ 推荐：使用模块和目录结构
// components/buttons/PrimaryButton.ts
export class PrimaryButton {}

// 使用
import { PrimaryButton } from './components/buttons/PrimaryButton'
```

```typescript [2]
// ❌ 错误：命名空间内外混用导出
namespace Utils {
  export function func1() {}
}

export function func2() {} // 模块导出

// 💡 导致使用混乱
// Utils.func1(); // 命名空间成员
// import { func2 } from './utils'; // 模块成员

// ✅ 解决方案：统一使用模块导出
export namespace Utils {
  export function func1() {}
  export function func2() {}
}

// 或完全使用模块
export function func1() {}
export function func2() {}
```

:::

### 7.2. 最佳实践建议

1. 优先使用 ES6 模块系统组织代码
2. 命名空间导出主要用于：
   - 类型声明文件中的逻辑分组
   - API 版本管理
   - 配置的环境区分
   - 扩展第三方库类型
3. 避免过深的命名空间嵌套（建议不超过 2 层）
4. 在模块中导出命名空间时保持清晰的语义
5. 记录导出决策的原因，提高可维护性
6. 规划向模块系统迁移的路径

## 8. 🔗 引用

- [TypeScript Handbook - Namespaces][1]
- [TypeScript Deep Dive - Namespaces][2]
- [Do's and Don'ts - TypeScript][3]

[1]: https://www.typescriptlang.org/docs/handbook/namespaces.html
[2]: https://basarat.gitbook.io/typescript/project/namespaces
[3]: https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html
