# [0114. 类的静态块](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0114.%20%E7%B1%BB%E7%9A%84%E9%9D%99%E6%80%81%E5%9D%97)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是静态块？](#3--什么是静态块)
- [4. 🤔 静态块有什么用？](#4--静态块有什么用)
- [5. 🤔 一个类可以有多个静态块吗？](#5--一个类可以有多个静态块吗)
- [6. 🤔 静态块使用时的常见错误都有哪些？](#6--静态块使用时的常见错误都有哪些)
  - [6.1. 错误 1：在静态块中访问实例成员](#61-错误-1在静态块中访问实例成员)
  - [6.2. 错误 2：依赖未初始化的静态成员](#62-错误-2依赖未初始化的静态成员)
  - [6.3. 错误 3：在静态块中抛出错误](#63-错误-3在静态块中抛出错误)
  - [6.4. 错误 4：过度使用静态块](#64-错误-4过度使用静态块)
- [7. 🤔 关于静态块的一些实践建议都有哪些？](#7--关于静态块的一些实践建议都有哪些)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 静态块的概念、语法、执行时机、编译原理
- 多个静态块的使用
- 常见错误介绍
- 最佳实践介绍

## 2. 🫧 评价

静态块（Static Block）是 TypeScript 4.4+ 引入的特性，允许在类中编写静态初始化代码块。

静态块的特点：

- 初始化逻辑：在类加载时执行一次
- 访问私有成员：可以访问私有静态成员
- 作用域隔离：块内变量不会污染类作用域
- 按顺序执行：多个静态块按声明顺序执行

静态块 vs 其他初始化方式：

| 方式         | 优点                   | 缺点                 |
| ------------ | ---------------------- | -------------------- |
| 静态块       | 逻辑集中、访问私有成员 | 需要 TypeScript 4.4+ |
| 静态属性     | 简单直接               | 无法包含复杂逻辑     |
| 立即执行函数 | 可用于旧版本           | 语法繁琐             |
| 构造函数     | 实例初始化             | 每次实例化都执行     |

静态块的优势：

1. 集中初始化：复杂的静态初始化逻辑
2. 访问权限：访问私有静态成员
3. 代码组织：相关初始化代码放在一起
4. 作用域隔离：避免变量泄露

## 3. 🤔 什么是静态块？

静态块是在类定义时执行一次的代码块，用于初始化静态成员。

- 执行时机：类定义时立即执行
- 执行次数：只执行一次
- this 指向：指向类本身
- 核心作用：在定义类的同时，完成类静态成员的维护工作

基本静态块：

```ts
class Example {
  static value: number

  static {
    // 静态块在类加载时执行一次
    console.log('Static block executed')
    this.value = 42
  }
}

console.log(Example.value) // 42
```

编译后得到的 JS：

```js
'use strict'
var _a
class Example {}
_a = Example
;(() => {
  // 静态块在类加载时执行一次
  console.log('Static block executed')
  _a.value = 42
})()
console.log(Example.value) // 42
```

静态块是 TS 中新增的特性，对比着编译后的 JS 来理解会更简单。

核心原理：从编译结果来看，静态块的编译就是在类定义之前新建一个临时变量（比如 `_a`）在类的定义语句结束后，将这个临时变量指向这个类，随后创建一个立即执行函数，将静态块的代码放在这个立即执行函数中执行，同时将静态块中的 `this` 替换为这个临时变量。

在理解核心原理后，就不难理解：

1. 静态块中的 this 指向类本身
2. 静态块中的逻辑是一个独立的作用域
3. 静态块中的异步行为不会阻塞类的定义

::: code-group

```ts [1]
// this 指向类本身
class Counter {
  static count = 0

  static {
    console.log(this === Counter) // true
    this.count = 10 // 相当于 Counter.count = 10
  }

  static increment() {
    this.count++
  }
}

console.log(Counter.count) // 10
```

```ts [2]
// 块作用域变量
class Calculator {
  static result: number

  static {
    // 块内变量不会污染类
    const temp1 = 10
    const temp2 = 20
    const temp3 = 30

    this.result = temp1 + temp2 + temp3

    // temp1, temp2, temp3 在块外不可访问
  }

  static getResult() {
    // console.log(temp1)  // ❌ Error: temp1 不存在
    return this.result
  }
}
```

```ts [3]
// ⚠️ 静态块是同步的，但可以启动异步操作
class DataLoader {
  static data: any[] = []
  static isLoaded = false

  static {
    // 启动异步加载（不会阻塞类定义）
    ;(async () => {
      const response = await fetch('https://api.example.com/data')
      this.data = await response.json()
      this.isLoaded = true
    })()
  }
}

// 注意：类定义完成时，data 可能还未加载
console.log(DataLoader.isLoaded) // false
```

:::

## 4. 🤔 静态块有什么用？

下面是一些常见的使用场景：

1. 初始化静态属性
2. 使用静态块实现单例
3. 注册器模式 - 注册类到全局注册表
4. 配置加载 - 从环境变量加载配置
5. 初始化常量映射
6. ……

应用场景有很多，总结下来，核心作用就是：在定义类的同时，完成类静态成员的维护工作。

::: code-group

```ts [1]
class Config {
  static apiUrl: string
  static timeout: number
  static headers: Record<string, string>

  static {
    this.apiUrl = 'https://api.example.com'
    this.timeout = 5000
    this.headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
  }
}

console.log(Config.apiUrl) // 'https://api.example.com'
console.log(Config.timeout) // 5000
console.log(Config.headers) // { ... }

/* 
"use strict";
var _a;
class Config {
}
_a = Config;
(() => {
    _a.apiUrl = 'https://api.example.com';
    _a.timeout = 5000;
    _a.headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };
})();
console.log(Config.apiUrl); // 'https://api.example.com'
console.log(Config.timeout); // 5000
console.log(Config.headers); // { ... }
*/
```

```ts [2]
class Singleton {
  private static instance: Singleton

  private constructor() {
    console.log('Singleton created')
  }

  static {
    // 在类加载时创建实例
    this.instance = new Singleton()
  }

  static getInstance(): Singleton {
    return this.instance
  }

  someMethod() {
    console.log('Method called')
  }
}

const instance1 = Singleton.getInstance()
const instance2 = Singleton.getInstance()
console.log(instance1 === instance2) // true
/* 
"use strict";
var _a;
class Singleton {
    constructor() {
        console.log('Singleton created');
    }
    static getInstance() {
        return this.instance;
    }
    someMethod() {
        console.log('Method called');
    }
}
_a = Singleton;
(() => {
    // 在类加载时创建实例
    _a.instance = new _a();
})();
const instance1 = Singleton.getInstance();
const instance2 = Singleton.getInstance();
console.log(instance1 === instance2); // true
 */
```

```ts [3]
const classRegistry = new Map<string, any>()

class UserService {
  static {
    // 自动注册到全局注册表
    classRegistry.set('UserService', this)
    console.log('UserService registered')
  }

  getUser(id: number) {
    return { id, name: 'Alice' }
  }
}

class ProductService {
  static {
    classRegistry.set('ProductService', this)
    console.log('ProductService registered')
  }

  getProduct(id: number) {
    return { id, name: 'Product' }
  }
}

// 从注册表获取服务
const UserServiceClass = classRegistry.get('UserService')
const service = new UserServiceClass()

/* 
"use strict";
var _a, _b;
const classRegistry = new Map();
class UserService {
    getUser(id) {
        return { id, name: 'Alice' };
    }
}
_a = UserService;
(() => {
    // 自动注册到全局注册表
    classRegistry.set('UserService', _a);
    console.log('UserService registered');
})();
class ProductService {
    getProduct(id) {
        return { id, name: 'Product' };
    }
}
_b = ProductService;
(() => {
    classRegistry.set('ProductService', _b);
    console.log('ProductService registered');
})();
// 从注册表获取服务
const UserServiceClass = classRegistry.get('UserService');
const service = new UserServiceClass();
*/
```

```ts [4]
// 假设有一个 process 对象，其中 process.env 中存储了一些环境变量信息
const process: any = {}
class AppConfig {
  static database: {
    host: string
    port: number
    name: string
  }

  static redis: {
    host: string
    port: number
  }

  static jwt: {
    secret: string
    expiresIn: string
  }

  static {
    // 从环境变量加载数据库配置
    this.database = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      name: process.env.DB_NAME || 'myapp',
    }

    // Redis 配置
    this.redis = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    }

    // JWT 配置
    this.jwt = {
      secret: process.env.JWT_SECRET || 'default-secret',
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }

    console.log('Configuration loaded')
  }
}
/* 
"use strict";
var _a;
// 假设有一个 process 对象，其中 process.env 中存储了一些环境变量信息
const process = {};
class AppConfig {
}
_a = AppConfig;
(() => {
    // 从环境变量加载数据库配置
    _a.database = {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        name: process.env.DB_NAME || 'myapp',
    };
    // Redis 配置
    _a.redis = {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
    };
    // JWT 配置
    _a.jwt = {
        secret: process.env.JWT_SECRET || 'default-secret',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    };
    console.log('Configuration loaded');
})();

 */
```

```ts [5]
class HttpStatus {
  static readonly OK = 200
  static readonly CREATED = 201
  static readonly BAD_REQUEST = 400
  static readonly UNAUTHORIZED = 401
  static readonly NOT_FOUND = 404
  static readonly SERVER_ERROR = 500

  private static statusMessages = new Map<number, string>()

  static {
    // 初始化状态码到消息的映射
    this.statusMessages.set(this.OK, 'OK')
    this.statusMessages.set(this.CREATED, 'Created')
    this.statusMessages.set(this.BAD_REQUEST, 'Bad Request')
    this.statusMessages.set(this.UNAUTHORIZED, 'Unauthorized')
    this.statusMessages.set(this.NOT_FOUND, 'Not Found')
    this.statusMessages.set(this.SERVER_ERROR, 'Internal Server Error')
  }

  static getMessage(code: number): string {
    return this.statusMessages.get(code) || 'Unknown Status'
  }
}

console.log(HttpStatus.getMessage(404)) // 'Not Found'
/* 
"use strict";
var _a;
class HttpStatus {
    static getMessage(code) {
        return this.statusMessages.get(code) || 'Unknown Status';
    }
}
_a = HttpStatus;
HttpStatus.OK = 200;
HttpStatus.CREATED = 201;
HttpStatus.BAD_REQUEST = 400;
HttpStatus.UNAUTHORIZED = 401;
HttpStatus.NOT_FOUND = 404;
HttpStatus.SERVER_ERROR = 500;
HttpStatus.statusMessages = new Map();
(() => {
    // 初始化状态码到消息的映射
    _a.statusMessages.set(_a.OK, 'OK');
    _a.statusMessages.set(_a.CREATED, 'Created');
    _a.statusMessages.set(_a.BAD_REQUEST, 'Bad Request');
    _a.statusMessages.set(_a.UNAUTHORIZED, 'Unauthorized');
    _a.statusMessages.set(_a.NOT_FOUND, 'Not Found');
    _a.statusMessages.set(_a.SERVER_ERROR, 'Internal Server Error');
})();
console.log(HttpStatus.getMessage(404)); // 'Not Found'
 */
```

:::

## 5. 🤔 一个类可以有多个静态块吗？

可以，这些块会按照顺序执行，后者可以引用前者初始化好的静态成员，借助此特性，你可以将不同的逻辑组织在不同的块中。

1. 一个类可以有多个静态块，它们会按照声明顺序依次执行。
2. 后面的块可以使用前面块初始化的值。
3. 可以使用多个块组织不同的初始化逻辑。

::: code-group

```ts [1]
class Logger {
  static level: string
  static output: string
  static initialized = false

  static {
    console.log('Block 1: Setting level')
    this.level = 'info'
  }

  static {
    console.log('Block 2: Setting output')
    this.output = 'console'
  }

  static {
    console.log('Block 3: Finalizing')
    this.initialized = true
  }
}

// 输出顺序：
// Block 1: Setting level
// Block 2: Setting output
// Block 3: Finalizing
/* 
"use strict";
var _a;
class Logger {
}
_a = Logger;
Logger.initialized = false;
(() => {
    console.log('Block 1: Setting level');
    _a.level = 'info';
})();
(() => {
    console.log('Block 2: Setting output');
    _a.output = 'console';
})();
(() => {
    console.log('Block 3: Finalizing');
    _a.initialized = true;
})();
 */
```

```ts [2]
class Configuration {
  static baseUrl: string
  static apiUrl: string
  static timeout: number

  static {
    this.baseUrl = 'https://example.com'
  }

  static {
    // 使用前一个块设置的值
    this.apiUrl = `${this.baseUrl}/api`
  }

  static {
    // 进一步处理
    this.timeout = this.apiUrl.length * 100
  }
}

console.log(Configuration.apiUrl) // 'https://example.com/api'
/* 
"use strict";
var _a;
class Configuration {
}
_a = Configuration;
(() => {
    _a.baseUrl = 'https://example.com';
})();
(() => {
    // 使用前一个块设置的值
    _a.apiUrl = `${_a.baseUrl}/api`;
})();
(() => {
    // 进一步处理
    _a.timeout = _a.apiUrl.length * 100;
})();
console.log(Configuration.apiUrl); // 'https://example.com/api'

 */
```

```ts [3]
class Application {
  static config: any
  static database: any
  static cache: any

  // 配置初始化
  static {
    console.log('Initializing config...')
    this.config = {
      port: 3000,
      host: 'localhost',
    }
  }

  // 数据库初始化
  static {
    console.log('Initializing database...')
    this.database = {
      host: this.config.host,
      port: 5432,
    }
  }

  // 缓存初始化
  static {
    console.log('Initializing cache...')
    this.cache = {
      ttl: 3600,
      maxSize: 1000,
    }
  }
}
/* 
"use strict";
var _a;
class Application {
}
_a = Application;
// 配置初始化
(() => {
    console.log('Initializing config...');
    _a.config = {
        port: 3000,
        host: 'localhost',
    };
})();
// 数据库初始化
(() => {
    console.log('Initializing database...');
    _a.database = {
        host: _a.config.host,
        port: 5432,
    };
})();
// 缓存初始化
(() => {
    console.log('Initializing cache...');
    _a.cache = {
        ttl: 3600,
        maxSize: 1000,
    };
})();
 */
```

:::

## 6. 🤔 静态块使用时的常见错误都有哪些？

### 6.1. 错误 1：在静态块中访问实例成员

不能访问实例成员：

```ts
class User {
  xxx: string = ''

  static {
    // ❌ Error: 实例成员不存在
    console.log(this.xxx)
    // Property 'xxx' does not exist on type 'typeof User'.(2339)
  }
}
/* 
"use strict";
var _a;
class User {
    constructor() {
        this.xxx = '';
    }
}
_a = User;
(() => {
    // ❌ Error: 实例成员不存在
    console.log(_a.xxx);
})();
 */
```

只访问静态成员：

```ts
class User {
  static defaultName: string

  static {
    this.defaultName = 'Guest' // ✅
  }
}
/* 
"use strict";
var _a;
class User {
}
_a = User;
(() => {
    _a.defaultName = 'Guest'; // ✅
})();
 */
```

### 6.2. 错误 2：依赖未初始化的静态成员

依赖顺序错误：

```ts
class Config {
  static apiUrl: string

  static {
    // ❌ timeout 尚未声明
    console.log(this.timeout)
    // Property 'timeout' is used before its initialization.(2729)
  }

  static timeout: number = 5000
}
/* 
"use strict";
var _a;
class Config {
}
_a = Config;
(() => {
    // ❌ timeout 尚未声明
    console.log(_a.timeout);
})();
Config.timeout = 5000;
 */
```

正确的顺序：

```ts
class Config {
  static timeout: number = 5000

  static {
    console.log(this.timeout) // ✅
  }

  static apiUrl: string
}
/* 
"use strict";
var _a;
class Config {
}
_a = Config;
Config.timeout = 5000;
(() => {
    console.log(_a.timeout); // ✅
})();
 */
```

### 6.3. 错误 3：在静态块中抛出错误

静态块中的错误会在类定义后抛出，导致类定义后的程序直接崩溃：

```ts
class BadConfig {
  static {
    throw new Error('Configuration error') // 类无法使用
  }
}
// ❌ 后续代码永远不会执行
console.log(123)
// Unreachable code detected.(7027)
/* 
"use strict";
class BadConfig {
}
(() => {
    throw new Error('Configuration error'); // 类无法使用
})();
// ❌ 后续代码永远不会执行
console.log(123);
// Unreachable code detected.(7027)
 */
```

妥善处理错误：可以使用 try-catch 捕获错误，并在控制台输出，但不要直接 `throw`。

```ts
class GoodConfig {
  // ...
  static {
    try {
      // ... 一系列类静态成员的维护逻辑
      throw new Error('发生了未知错误')
    } catch (err) {
      console.error('Config initialization failed:', String(err))
    }
  }
}
/* 
"use strict";
class GoodConfig {
}
// ...
(() => {
    try {
        // ... 一系列类静态成员的维护逻辑
        throw new Error('发生了未知错误');
    }
    catch (err) {
        console.error('Config initialization failed:', String(err));
    }
})();

 */
```

### 6.4. 错误 4：过度使用静态块

简单初始化不需要静态块：

```ts
class Config {
  static port: number

  static {
    this.port = 3000 // 不需要静态块
  }
}
```

直接初始化更合适：

```ts
class Config {
  static port: number = 3000
}
```

静态块可以用于一些相对复杂的逻辑，比如：

```ts
const process: any = {}
class Config {
  static port: number
  static host: string

  static {
    const env = process.env.NODE_ENV
    if (env === 'production') {
      this.port = 8080
      this.host = '0.0.0.0'
    } else {
      this.port = 3000
      this.host = 'localhost'
    }
  }
}
```

## 7. 🤔 关于静态块的一些实践建议都有哪些？

```ts
// ✅ 1. 用于复杂的初始化逻辑
class Database {
  static connection: any

  static {
    const host = process.env.DB_HOST || 'localhost'
    const port = parseInt(process.env.DB_PORT || '5432')
    const db = process.env.DB_NAME || 'myapp'

    this.connection = {
      host,
      port,
      database: db,
      connectionString: `postgresql://${host}:${port}/${db}`,
    }
  }
}

// ✅ 2. 访问私有静态成员
class SecureStorage {
  static #data = new Map<string, any>()

  static {
    // 初始化私有存储
    this.#data.set('initialized', true)
    this.#data.set('timestamp', Date.now())
  }

  static get(key: string) {
    return this.#data.get(key)
  }
}

// ✅ 3. 分离不同的初始化逻辑
class App {
  static config: any
  static logger: any
  static database: any

  // 配置初始化
  static {
    this.config = {
      /* ... */
    }
  }

  // 日志初始化
  static {
    this.logger = {
      /* ... */
    }
  }

  // 数据库初始化
  static {
    this.database = {
      /* ... */
    }
  }
}

// ✅ 4. 注册和自动化
const services = new Map<string, any>()

class Service {
  static {
    services.set(this.name, this)
  }
}

// ✅ 5. 验证配置
class ValidatedConfig {
  static timeout: number

  static {
    const timeout = parseInt(process.env.TIMEOUT || '5000')

    if (timeout < 0 || timeout > 60000) {
      console.warn(`Invalid timeout ${timeout}, using default`)
      this.timeout = 5000
    } else {
      this.timeout = timeout
    }
  }
}

// ✅ 6. 避免副作用
class GoodInit {
  static data: any[]

  static {
    // 只初始化，不执行外部操作
    this.data = []
  }
}

// ❌ 避免在静态块中执行副作用
class BadInit {
  static {
    // ❌ 不要在静态块中执行 I/O 操作
    // fetch('https://api.example.com')
    // localStorage.setItem('key', 'value')
  }
}

// ✅ 7. 使用 try-catch 保护
class SafeInit {
  static isInitialized = false

  static {
    try {
      // 初始化逻辑
      this.isInitialized = true
    } catch (error) {
      console.error('Initialization failed:', error)
    }
  }
}

// ✅ 8. 添加日志帮助调试
class LoggedInit {
  static value: number

  static {
    console.log('Initializing LoggedInit...')
    this.value = 42
    console.log(`LoggedInit.value = ${this.value}`)
  }
}

// ✅ 9. 保持静态块简洁
class CleanInit {
  static config: any

  static {
    this.config = this.loadConfig()
  }

  private static loadConfig() {
    // 复杂逻辑放在单独的方法中
    return {
      host: process.env.HOST || 'localhost',
      port: parseInt(process.env.PORT || '3000'),
    }
  }
}

// ✅ 10. 文档化初始化逻辑
class DocumentedInit {
  static apiUrl: string

  /**
   * 初始化 API 配置
   * 从环境变量读取 API_URL，如果未设置则使用默认值
   */
  static {
    const url = process.env.API_URL
    if (!url) {
      console.warn('API_URL not set, using default')
      this.apiUrl = 'http://localhost:3000'
    } else {
      this.apiUrl = url
    }
  }
}
```

## 8. 🔗 引用

- [TypeScript 4.4 Release Notes - Static Blocks][1]
- [MDN - Static initialization blocks][2]
- [TypeScript Handbook - Classes][3]

[1]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-4.html#static-blocks-in-classes
[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Static_initialization_blocks
[3]: https://www.typescriptlang.org/docs/handbook/2/classes.html
