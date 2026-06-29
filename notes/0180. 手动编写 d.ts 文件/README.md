# [0180. 手动编写 d.ts 文件](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0180.%20%E6%89%8B%E5%8A%A8%E7%BC%96%E5%86%99%20d.ts%20%E6%96%87%E4%BB%B6)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 什么时候需要手动编写声明文件？](#3-什么时候需要手动编写声明文件)
  - [3.1. 场景 1：第三方库没有类型定义](#31-场景-1第三方库没有类型定义)
  - [3.2. 场景 2：为遗留 JavaScript 代码添加类型](#32-场景-2为遗留-javascript-代码添加类型)
  - [3.3. 场景 3：扩展现有类型定义](#33-场景-3扩展现有类型定义)
  - [3.4. 场景 4：为全局脚本添加类型](#34-场景-4为全局脚本添加类型)
  - [3.5. 场景 5：自定义类型定义](#35-场景-5自定义类型定义)
- [4. 如何为函数库编写声明文件？](#4-如何为函数库编写声明文件)
  - [4.1. 简单函数库](#41-简单函数库)
  - [4.2. 带命名空间的函数库](#42-带命名空间的函数库)
  - [4.3. 重载函数](#43-重载函数)
  - [4.4. 回调和异步函数](#44-回调和异步函数)
- [5. 如何为类库编写声明文件？](#5-如何为类库编写声明文件)
  - [5.1. 简单类](#51-简单类)
  - [5.2. 带静态方法的类](#52-带静态方法的类)
  - [5.3. 继承和泛型](#53-继承和泛型)
  - [5.4. 混合导出](#54-混合导出)
- [6. 如何组织大型声明文件？](#6-如何组织大型声明文件)
  - [6.1. 分模块组织](#61-分模块组织)
  - [6.2. 使用命名空间组织](#62-使用命名空间组织)
  - [6.3. 使用类型引用](#63-使用类型引用)
  - [6.4. 实际案例：Express 风格](#64-实际案例express-风格)
- [7. 编写声明文件的最佳实践是什么？](#7-编写声明文件的最佳实践是什么)
  - [7.1. 从简单开始](#71-从简单开始)
  - [7.2. 使用 JSDoc 注释](#72-使用-jsdoc-注释)
  - [7.3. 保持类型精确](#73-保持类型精确)
  - [7.4. 合理使用泛型](#74-合理使用泛型)
  - [7.5. 版本和兼容性说明](#75-版本和兼容性说明)
  - [7.6. 测试声明文件](#76-测试声明文件)
- [8. 引用](#8-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 手动编写声明文件的场景
- 函数库的声明文件编写
- 类库的声明文件编写
- 大型声明文件的组织
- 编写声明文件的最佳实践

## 2. 评价

手动编写声明文件是为 JavaScript 代码添加类型的重要技能。

- 主要用于为没有类型的第三方库添加类型定义
- 需要理解库的 API 和使用方式
- 应当从简单到复杂逐步完善类型
- 优先使用官方文档和示例代码作为参考
- 编写的声明文件可以贡献到 DefinitelyTyped 项目

## 3. 什么时候需要手动编写声明文件？

识别需要手动编写声明的场景。

### 3.1. 场景 1：第三方库没有类型定义

```ts
// node_modules/awesome-lib/index.js
module.exports = {
  version: '1.0.0',
  init: function (config) {
    /* ... */
  },
  process: function (data) {
    /* ... */
  },
}

// 创建 types/awesome-lib.d.ts
declare module 'awesome-lib' {
  export interface Config {
    apiKey: string
    timeout?: number
  }

  export const version: string
  export function init(config: Config): void
  export function process(data: any): Promise<any>
}
```

### 3.2. 场景 2：为遗留 JavaScript 代码添加类型

```javascript
// legacy/utils.js
function formatDate(date, format) {
  // 实现
}

function parseJSON(str) {
  // 实现
}

exports.formatDate = formatDate
exports.parseJSON = parseJSON
```

```ts
// legacy/utils.d.ts
export function formatDate(date: Date, format?: string): string
export function parseJSON<T = any>(str: string): T | null
```

### 3.3. 场景 3：扩展现有类型定义

```ts
// types/express-extend.d.ts
import 'express'

declare module 'express' {
  interface Request {
    user?: {
      id: string
      name: string
    }
  }
}
```

### 3.4. 场景 4：为全局脚本添加类型

```ts
// types/globals.d.ts
declare const APP_VERSION: string
declare const API_URL: string

declare function initApp(config: { debug?: boolean; locale?: string }): void
```

### 3.5. 场景 5：自定义类型定义

```ts
// types/custom.d.ts
// 为项目特定的模块添加类型
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.png' {
  const src: string
  export default src
}
```

## 4. 如何为函数库编写声明文件？

函数库的声明文件编写方法。

### 4.1. 简单函数库

```javascript
// lodash-lite.js
function debounce(func, wait) {
  // 实现
}

function throttle(func, wait) {
  // 实现
}

function cloneDeep(obj) {
  // 实现
}

module.exports = {
  debounce,
  throttle,
  cloneDeep,
}
```

```ts
// lodash-lite.d.ts
declare module 'lodash-lite' {
  /**
   * 创建一个防抖函数
   * @param func - 要防抖的函数
   * @param wait - 延迟时间（毫秒）
   */
  export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait?: number
  ): T

  /**
   * 创建一个节流函数
   * @param func - 要节流的函数
   * @param wait - 间隔时间（毫秒）
   */
  export function throttle<T extends (...args: any[]) => any>(
    func: T,
    wait?: number
  ): T

  /**
   * 深拷贝对象
   * @param obj - 要拷贝的对象
   */
  export function cloneDeep<T>(obj: T): T
}
```

### 4.2. 带命名空间的函数库

```javascript
// math-utils.js
const MathUtils = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b,

  advanced: {
    power: (base, exp) => Math.pow(base, exp),
    sqrt: (n) => Math.sqrt(n),
  },
}

module.exports = MathUtils
```

```ts
// math-utils.d.ts
declare module 'math-utils' {
  namespace MathUtils {
    function add(a: number, b: number): number
    function subtract(a: number, b: number): number
    function multiply(a: number, b: number): number
    function divide(a: number, b: number): number

    namespace advanced {
      function power(base: number, exp: number): number
      function sqrt(n: number): number
    }
  }

  export = MathUtils
}
```

### 4.3. 重载函数

```javascript
// formatter.js
function format(value) {
  if (typeof value === 'number') {
    return value.toFixed(2)
  }
  if (value instanceof Date) {
    return value.toISOString()
  }
  return String(value)
}

module.exports = { format }
```

```ts
// formatter.d.ts
declare module 'formatter' {
  // 函数重载
  export function format(value: number): string
  export function format(value: Date): string
  export function format(value: any): string
}
```

### 4.4. 回调和异步函数

```javascript
// http-client.js
function request(url, callback) {
  // 实现
}

function requestAsync(url) {
  return new Promise((resolve, reject) => {
    // 实现
  })
}

module.exports = { request, requestAsync }
```

```ts
// http-client.d.ts
declare module 'http-client' {
  export interface Response {
    status: number
    data: any
    headers: Record<string, string>
  }

  export type RequestCallback = (
    error: Error | null,
    response: Response | null
  ) => void

  export function request(url: string, callback: RequestCallback): void

  export function requestAsync(url: string): Promise<Response>
}
```

## 5. 如何为类库编写声明文件？

类库的声明文件编写方法。

### 5.1. 简单类

```javascript
// logger.js
class Logger {
  constructor(name) {
    this.name = name
  }

  log(message) {
    console.log(`[${this.name}] ${message}`)
  }

  error(message) {
    console.error(`[${this.name}] ${message}`)
  }
}

module.exports = Logger
```

```ts
// logger.d.ts
declare module 'logger' {
  export default class Logger {
    constructor(name: string)

    log(message: string): void

    error(message: string): void
  }
}
```

### 5.2. 带静态方法的类

```javascript
// validator.js
class Validator {
  static isEmail(str) {
    // 实现
  }

  static isURL(str) {
    // 实现
  }

  constructor(rules) {
    this.rules = rules
  }

  validate(data) {
    // 实现
  }
}

module.exports = Validator
```

```ts
// validator.d.ts
declare module 'validator' {
  export interface ValidationRules {
    [field: string]: {
      required?: boolean
      type?: 'string' | 'number' | 'email' | 'url'
      min?: number
      max?: number
    }
  }

  export interface ValidationResult {
    valid: boolean
    errors: Record<string, string[]>
  }

  export default class Validator {
    // 静态方法
    static isEmail(str: string): boolean
    static isURL(str: string): boolean

    // 构造函数
    constructor(rules: ValidationRules)

    // 实例方法
    validate(data: Record<string, any>): ValidationResult
  }
}
```

### 5.3. 继承和泛型

```javascript
// event-emitter.js
class EventEmitter {
  on(event, handler) {}
  emit(event, ...args) {}
}

class TypedEmitter extends EventEmitter {
  // 带类型安全的事件发射器
}

module.exports = { EventEmitter, TypedEmitter }
```

```ts
// event-emitter.d.ts
declare module 'event-emitter' {
  export class EventEmitter {
    on(event: string, handler: (...args: any[]) => void): this
    emit(event: string, ...args: any[]): boolean
    off(event: string, handler?: (...args: any[]) => void): this
  }

  // 泛型类
  export class TypedEmitter<Events extends Record<string, any[]>> {
    on<K extends keyof Events>(
      event: K,
      handler: (...args: Events[K]) => void
    ): this

    emit<K extends keyof Events>(event: K, ...args: Events[K]): boolean

    off<K extends keyof Events>(
      event: K,
      handler?: (...args: Events[K]) => void
    ): this
  }
}

// 使用示例
// import { TypedEmitter } from 'event-emitter';
//
// interface MyEvents {
//   'user:login': [userId: string];
//   'user:logout': [];
//   'data:update': [data: any];
// }
//
// const emitter = new TypedEmitter<MyEvents>();
// emitter.on('user:login', (userId) => {
//   // userId 的类型是 string
// });
```

### 5.4. 混合导出

```javascript
// database.js
class Database {
  constructor(config) {}
  connect() {}
  disconnect() {}
}

Database.create = function (config) {
  return new Database(config)
}

module.exports = Database
```

```ts
// database.d.ts
declare module 'database' {
  export interface DatabaseConfig {
    host: string
    port: number
    username: string
    password: string
    database: string
  }

  export default class Database {
    constructor(config: DatabaseConfig)

    connect(): Promise<void>
    disconnect(): Promise<void>

    // 静态工厂方法
    static create(config: DatabaseConfig): Database
  }
}
```

## 6. 如何组织大型声明文件？

大型库的声明文件组织方法。

### 6.1. 分模块组织

```ts
// types/my-library/index.d.ts
declare module 'my-library' {
  // 导出所有子模块
  export * from 'my-library/core'
  export * from 'my-library/utils'
  export * from 'my-library/types'
}

// types/my-library/core.d.ts
declare module 'my-library/core' {
  export class Core {
    constructor(options: CoreOptions)
    init(): Promise<void>
  }

  export interface CoreOptions {
    debug?: boolean
  }
}

// types/my-library/utils.d.ts
declare module 'my-library/utils' {
  export function formatDate(date: Date): string
  export function parseJSON<T>(str: string): T | null
}

// types/my-library/types.d.ts
declare module 'my-library/types' {
  export interface User {
    id: string
    name: string
  }

  export type Status = 'active' | 'inactive'
}
```

### 6.2. 使用命名空间组织

```ts
// types/big-library.d.ts
declare module 'big-library' {
  // 核心 API
  export function init(config: Config): void

  // 工具命名空间
  export namespace Utils {
    function format(value: any): string
    function parse(str: string): any
  }

  // HTTP 命名空间
  export namespace HTTP {
    interface RequestOptions {
      method?: string
      headers?: Record<string, string>
    }

    function get(url: string, options?: RequestOptions): Promise<Response>
    function post(
      url: string,
      data: any,
      options?: RequestOptions
    ): Promise<Response>
  }

  // 数据库命名空间
  export namespace DB {
    class Connection {
      constructor(config: ConnectionConfig)
      query(sql: string): Promise<any>
    }

    interface ConnectionConfig {
      host: string
      port: number
    }
  }

  // 共享类型
  export interface Config {
    apiUrl: string
    timeout?: number
  }

  export interface Response {
    status: number
    data: any
  }
}
```

### 6.3. 使用类型引用

```ts
// types/api/base.d.ts
declare module 'my-api/base' {
  export interface BaseResponse {
    status: number
    message: string
  }

  export interface BaseRequest {
    timestamp: number
  }
}

// types/api/user.d.ts
declare module 'my-api/user' {
  import { BaseResponse, BaseRequest } from 'my-api/base'

  export interface User {
    id: string
    name: string
    email: string
  }

  export interface GetUserRequest extends BaseRequest {
    userId: string
  }

  export interface GetUserResponse extends BaseResponse {
    data: User
  }

  export function getUser(req: GetUserRequest): Promise<GetUserResponse>
}
```

### 6.4. 实际案例：Express 风格

```ts
// types/web-framework.d.ts
declare module 'web-framework' {
  import { IncomingMessage, ServerResponse } from 'http'

  // 核心应用类
  export class Application {
    use(middleware: Middleware): this
    get(path: string, handler: RouteHandler): this
    post(path: string, handler: RouteHandler): this
    listen(port: number, callback?: () => void): Server
  }

  // 请求对象
  export interface Request extends IncomingMessage {
    params: Record<string, string>
    query: Record<string, string>
    body: any
    headers: Record<string, string>
  }

  // 响应对象
  export interface Response extends ServerResponse {
    status(code: number): this
    json(data: any): this
    send(data: string | Buffer): this
  }

  // 中间件
  export type Middleware = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>

  export type NextFunction = (error?: Error) => void

  // 路由处理器
  export type RouteHandler = (
    req: Request,
    res: Response
  ) => void | Promise<void>

  // Server
  export interface Server {
    close(): void
  }

  // 工厂函数
  export default function createApp(): Application
}
```

## 7. 编写声明文件的最佳实践是什么？

声明文件的编写规范和技巧。

### 7.1. 从简单开始

```ts
// ❌ 避免：一开始就追求完美
declare module 'complex-lib' {
  // 过于复杂的类型定义
  export function process<
    T extends Record<string, any>,
    K extends keyof T,
    R = T[K] extends Array<infer U> ? U : T[K]
  >(data: T, key: K): Promise<R[]>
}

// ✅ 推荐：从简单开始，逐步完善
declare module 'complex-lib' {
  // 第一版：使用 any
  export function process(data: any, key: string): Promise<any>

  // 第二版：添加基础类型
  // export function process(data: object, key: string): Promise<any[]>;

  // 第三版：添加泛型
  // export function process<T>(data: T, key: keyof T): Promise<any[]>;
}
```

### 7.2. 使用 JSDoc 注释

````ts
// ✅ 推荐：详细的 JSDoc 注释
declare module 'my-library' {
  /**
   * 用户接口
   */
  export interface User {
    /** 用户唯一标识符 */
    id: string

    /** 用户名称 */
    name: string

    /** 电子邮件地址 */
    email: string

    /**
     * 用户角色
     * @default 'user'
     */
    role?: 'admin' | 'user'
  }

  /**
   * 获取用户信息
   * @param id - 用户 ID
   * @returns 用户对象
   * @throws 当用户不存在时抛出错误
   * @example
   * ```ts
   * const user = await getUser('123');
   * console.log(user.name);
   * ```
   */
  export function getUser(id: string): Promise<User>
}
````

### 7.3. 保持类型精确

```ts
// ❌ 避免：过于宽泛的类型
declare module 'api-client' {
  export function request(options: any): Promise<any>
}

// ✅ 推荐：精确的类型
declare module 'api-client' {
  export interface RequestOptions {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    url: string
    headers?: Record<string, string>
    data?: any
    timeout?: number
  }

  export interface Response<T = any> {
    status: number
    statusText: string
    data: T
    headers: Record<string, string>
  }

  export function request<T = any>(
    options: RequestOptions
  ): Promise<Response<T>>
}
```

### 7.4. 合理使用泛型

```ts
// ✅ 推荐：恰当的泛型使用
declare module 'storage' {
  /**
   * 存储接口
   */
  export interface Storage {
    /**
     * 获取存储的值
     * @param key - 存储键
     * @param defaultValue - 默认值
     */
    get<T = any>(key: string, defaultValue?: T): T | undefined

    /**
     * 设置存储的值
     * @param key - 存储键
     * @param value - 存储值
     */
    set<T>(key: string, value: T): void

    /**
     * 删除存储的值
     * @param key - 存储键
     */
    remove(key: string): void

    /**
     * 清空所有存储
     */
    clear(): void
  }

  export function createStorage(): Storage
}
```

### 7.5. 版本和兼容性说明

```ts
/**
 * Type definitions for my-library v2.0.0
 * Project: https://github.com/org/my-library
 * Definitions by: Your Name <https://github.com/yourname>
 * TypeScript Version: 4.5
 */

declare module 'my-library' {
  /**
   * @deprecated 使用 newMethod 代替
   * @since 1.0.0
   */
  export function oldMethod(): void

  /**
   * @since 2.0.0
   */
  export function newMethod(): void
}
```

### 7.6. 测试声明文件

```ts
// test/types.test.ts
import { getUser, User } from 'my-library'

// 测试类型推断
const user: User = {
  id: '1',
  name: 'John',
  email: 'john@example.com',
}

// 测试函数返回类型
getUser('1').then((u) => {
  const name: string = u.name // ✅ 应该通过
  const age: number = u.age // ❌ 应该报错
})

// 测试类型约束
getUser(123) // ❌ 应该报错：参数应该是 string
```

## 8. 引用

- [TypeScript Handbook - Declaration Files][1]
- [Declaration Files - By Example][2]
- [Declaration Files - Do's and Don'ts][3]
- [DefinitelyTyped Repository][4]

[1]: https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html
[2]: https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html
[3]: https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html
[4]: https://github.com/DefinitelyTyped/DefinitelyTyped
