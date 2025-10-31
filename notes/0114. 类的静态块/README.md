# [0114. 类的静态块](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0114.%20%E7%B1%BB%E7%9A%84%E9%9D%99%E6%80%81%E5%9D%97)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是静态块？](#3--什么是静态块)
- [4. 🤔 基本语法](#4--基本语法)
  - [4.1. 简单初始化](#41-简单初始化)
  - [4.2. 复杂初始化逻辑](#42-复杂初始化逻辑)
  - [4.3. 条件初始化](#43-条件初始化)
- [5. 🤔 静态块的特性](#5--静态块的特性)
  - [5.1. this 指向类](#51-this-指向类)
  - [5.2. 异步操作（不推荐）](#52-异步操作不推荐)
  - [5.3. 变量作用域](#53-变量作用域)
- [6. 🤔 访问作用域](#6--访问作用域)
  - [6.1. 访问私有静态成员](#61-访问私有静态成员)
  - [6.2. 访问私有实例成员（不可以）](#62-访问私有实例成员不可以)
  - [6.3. 访问外部变量](#63-访问外部变量)
- [7. 🤔 多个静态块](#7--多个静态块)
  - [7.1. 按顺序执行](#71-按顺序执行)
  - [7.2. 块之间的依赖](#72-块之间的依赖)
  - [7.3. 组织相关初始化](#73-组织相关初始化)
- [8. 🤔 常见使用场景](#8--常见使用场景)
  - [8.1. 场景 1：单例模式](#81-场景-1单例模式)
  - [8.2. 场景 2：注册器模式](#82-场景-2注册器模式)
  - [8.3. 场景 3：配置加载](#83-场景-3配置加载)
  - [8.4. 场景 4：常量映射](#84-场景-4常量映射)
  - [8.5. 场景 5：验证和规范化](#85-场景-5验证和规范化)
  - [8.6. 场景 6：依赖初始化](#86-场景-6依赖初始化)
  - [8.7. 场景 7：私有静态成员初始化](#87-场景-7私有静态成员初始化)
- [9. 🤔 常见错误和最佳实践](#9--常见错误和最佳实践)
  - [9.1. 错误 1：在静态块中访问实例成员](#91-错误-1在静态块中访问实例成员)
  - [9.2. 错误 2：依赖未初始化的静态成员](#92-错误-2依赖未初始化的静态成员)
  - [9.3. 错误 3：在静态块中抛出错误](#93-错误-3在静态块中抛出错误)
  - [9.4. 错误 4：过度使用静态块](#94-错误-4过度使用静态块)
  - [9.5. 最佳实践](#95-最佳实践)
- [10. 🔗 引用](#10--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 静态块的概念和语法
- 静态块的执行时机
- 访问私有静态成员
- 静态块的作用域和特性
- 多个静态块的顺序
- 实际应用场景

## 2. 🫧 评价

静态块（Static Block）是 TypeScript 4.4+ 引入的特性，允许在类中编写**静态初始化代码块**。

静态块的特点：

- **初始化逻辑**：在类加载时执行一次
- **访问私有成员**：可以访问私有静态成员
- **作用域隔离**：块内变量不会污染类作用域
- **按顺序执行**：多个静态块按声明顺序执行

静态块 vs 其他初始化方式：

| 方式             | 优点                   | 缺点                 |
| ---------------- | ---------------------- | -------------------- |
| **静态块**       | 逻辑集中、访问私有成员 | 需要 TypeScript 4.4+ |
| **静态属性**     | 简单直接               | 无法包含复杂逻辑     |
| **立即执行函数** | 可用于旧版本           | 语法繁琐             |
| **构造函数**     | 实例初始化             | 每次实例化都执行     |

静态块的优势：

1. **集中初始化**：复杂的静态初始化逻辑
2. **访问权限**：访问私有静态成员
3. **代码组织**：相关初始化代码放在一起
4. **作用域隔离**：避免变量泄露

理解静态块，能帮助你：

1. 优雅地初始化静态成员
2. 处理复杂的类初始化逻辑
3. 保护私有静态成员的初始化
4. 提高代码的可读性和维护性

静态块是现代 TypeScript 类的重要特性，简化了静态成员的初始化。

## 3. 🤔 什么是静态块？

静态块是在**类定义时执行一次**的代码块，用于初始化静态成员。

```ts
// ✅ 基本静态块
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

**关键概念**：

- **执行时机**：类定义时立即执行
- **执行次数**：只执行一次
- **this 指向**：指向类本身
- **初始化目的**：初始化静态成员

## 4. 🤔 基本语法

### 4.1. 简单初始化

```ts
// ✅ 初始化静态属性
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
```

### 4.2. 复杂初始化逻辑

```ts
// ✅ 包含复杂逻辑的初始化
class MathConstants {
  static PI: number
  static E: number
  static PHI: number

  static {
    // 可以包含任意代码
    console.log('Initializing math constants...')

    this.PI = 3.14159
    this.E = 2.71828

    // 计算黄金比例
    this.PHI = (1 + Math.sqrt(5)) / 2

    console.log('Math constants initialized')
  }
}
```

### 4.3. 条件初始化

```ts
// ✅ 条件逻辑
class Environment {
  static mode: 'development' | 'production'
  static debug: boolean
  static apiUrl: string

  static {
    const env = process.env.NODE_ENV || 'development'

    if (env === 'production') {
      this.mode = 'production'
      this.debug = false
      this.apiUrl = 'https://api.production.com'
    } else {
      this.mode = 'development'
      this.debug = true
      this.apiUrl = 'http://localhost:3000'
    }

    console.log(`Environment: ${this.mode}`)
  }
}
```

## 5. 🤔 静态块的特性

### 5.1. this 指向类

```ts
// ✅ this 指向类本身
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

### 5.2. 异步操作（不推荐）

```ts
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

### 5.3. 变量作用域

```ts
// ✅ 块作用域变量
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

## 6. 🤔 访问作用域

### 6.1. 访问私有静态成员

```ts
// ✅ 访问私有静态成员
class Database {
  static #connection: any
  static #isConnected = false

  static {
    // 静态块可以访问私有静态成员
    console.log('Initializing database connection...')
    this.#connection = { host: 'localhost', port: 5432 }
    this.#isConnected = true
    console.log('Database connected')
  }

  static getConnection() {
    if (!this.#isConnected) {
      throw new Error('Database not connected')
    }
    return this.#connection
  }
}
```

### 6.2. 访问私有实例成员（不可以）

```ts
// ❌ 静态块不能访问私有实例成员
class User {
  #password: string = ''

  static {
    // ❌ 不能访问实例的私有成员
    // console.log(this.#password)  // Error
  }
}
```

### 6.3. 访问外部变量

```ts
// ✅ 可以访问外部作用域
const defaultConfig = {
  timeout: 5000,
  retries: 3,
}

class ApiClient {
  static config: typeof defaultConfig

  static {
    // 可以访问外部变量
    this.config = { ...defaultConfig }
    console.log('Config loaded from external variable')
  }
}
```

## 7. 🤔 多个静态块

### 7.1. 按顺序执行

```ts
// ✅ 多个静态块按声明顺序执行
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
```

### 7.2. 块之间的依赖

```ts
// ✅ 后面的块可以使用前面块初始化的值
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
```

### 7.3. 组织相关初始化

```ts
// ✅ 使用多个块组织不同的初始化逻辑
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
```

## 8. 🤔 常见使用场景

### 8.1. 场景 1：单例模式

```ts
// ✅ 使用静态块实现单例
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
```

### 8.2. 场景 2：注册器模式

```ts
// ✅ 注册类到全局注册表
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
```

### 8.3. 场景 3：配置加载

```ts
// ✅ 从环境变量加载配置
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
```

### 8.4. 场景 4：常量映射

```ts
// ✅ 初始化常量映射
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
```

### 8.5. 场景 5：验证和规范化

```ts
// ✅ 初始化时验证配置
class ServerConfig {
  static port: number
  static host: string
  static maxConnections: number

  static {
    // 读取配置
    const port = parseInt(process.env.PORT || '3000')
    const host = process.env.HOST || 'localhost'
    const maxConnections = parseInt(process.env.MAX_CONNECTIONS || '100')

    // 验证
    if (port < 1 || port > 65535) {
      throw new Error(`Invalid port: ${port}`)
    }

    if (maxConnections < 1) {
      throw new Error(`Invalid max connections: ${maxConnections}`)
    }

    // 设置
    this.port = port
    this.host = host
    this.maxConnections = maxConnections

    console.log(
      `Server config: ${host}:${port}, max connections: ${maxConnections}`
    )
  }
}
```

### 8.6. 场景 6：依赖初始化

```ts
// ✅ 初始化类的依赖
class Logger {
  static log(message: string) {
    console.log(`[LOG] ${message}`)
  }
}

class Database {
  static connection: any

  static {
    Logger.log('Initializing database...')
    this.connection = { status: 'connected' }
    Logger.log('Database initialized')
  }
}

class Cache {
  static instance: any

  static {
    Logger.log('Initializing cache...')
    this.instance = { status: 'ready' }
    Logger.log('Cache initialized')
  }
}

class Application {
  static {
    Logger.log('Application starting...')

    // 确保依赖已初始化
    const dbStatus = Database.connection.status
    const cacheStatus = Cache.instance.status

    Logger.log(`Dependencies: DB=${dbStatus}, Cache=${cacheStatus}`)
    Logger.log('Application started')
  }
}
```

### 8.7. 场景 7：私有静态成员初始化

```ts
// ✅ 安全地初始化私有静态成员
class SecureConfig {
  static #apiKey: string
  static #secretKey: string

  static {
    // 从安全源加载密钥
    this.#apiKey = this.loadFromSecureStore('API_KEY')
    this.#secretKey = this.loadFromSecureStore('SECRET_KEY')

    // 验证密钥
    if (!this.#apiKey || !this.#secretKey) {
      throw new Error('Failed to load secure credentials')
    }

    console.log('Secure credentials loaded')
  }

  private static loadFromSecureStore(key: string): string {
    // 从安全存储加载
    return process.env[key] || ''
  }

  static getApiKey(): string {
    return this.#apiKey
  }
}
```

## 9. 🤔 常见错误和最佳实践

### 9.1. 错误 1：在静态块中访问实例成员

```ts
// ❌ 不能访问实例成员
class User {
  name: string = ''

  static {
    // ❌ Error: 实例成员不存在
    // console.log(this.name)
  }
}

// ✅ 只访问静态成员
class User {
  static defaultName: string

  static {
    this.defaultName = 'Guest' // ✅
  }
}
```

### 9.2. 错误 2：依赖未初始化的静态成员

```ts
// ❌ 依赖顺序错误
class Config {
  static apiUrl: string

  static {
    // ❌ timeout 尚未声明
    console.log(this.timeout)
  }

  static timeout: number = 5000
}

// ✅ 正确的顺序
class Config {
  static timeout: number = 5000

  static {
    console.log(this.timeout) // ✅
  }

  static apiUrl: string
}
```

### 9.3. 错误 3：在静态块中抛出错误

```ts
// ⚠️ 静态块中的错误会阻止类定义
class BadConfig {
  static {
    throw new Error('Configuration error') // 类无法使用
  }
}

// ✅ 妥善处理错误
class GoodConfig {
  static isValid = false
  static error: string | null = null

  static {
    try {
      // 初始化逻辑
      this.isValid = true
    } catch (err) {
      this.error = String(err)
      console.error('Config initialization failed:', err)
    }
  }
}
```

### 9.4. 错误 4：过度使用静态块

```ts
// ❌ 简单初始化不需要静态块
class Config {
  static port: number

  static {
    this.port = 3000 // 不需要静态块
  }
}

// ✅ 直接初始化
class Config {
  static port: number = 3000
}

// ✅ 静态块用于复杂逻辑
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

### 9.5. 最佳实践

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

## 10. 🔗 引用

- [TypeScript 4.4 Release Notes - Static Blocks][1]
- [MDN - Static initialization blocks][2]
- [TypeScript Handbook - Classes][3]

[1]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-4.html#static-blocks-in-classes
[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Static_initialization_blocks
[3]: https://www.typescriptlang.org/docs/handbook/2/classes.html
