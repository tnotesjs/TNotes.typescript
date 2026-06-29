# [0147. 命名空间的基本使用](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0147.%20%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4%E7%9A%84%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 如何创建和导出命名空间成员？](#3-如何创建和导出命名空间成员)
- [4. 如何在多个文件中组织命名空间？](#4-如何在多个文件中组织命名空间)
- [5. 如何使用别名简化命名空间访问？](#5-如何使用别名简化命名空间访问)
- [6. 如何在命名空间中组织类型？](#6-如何在命名空间中组织类型)
- [7. 如何结合类和命名空间使用？](#7-如何结合类和命名空间使用)
- [8. 实际项目中的应用场景有哪些？](#8-实际项目中的应用场景有哪些)
- [9. 常见错误和解决方案是什么？](#9-常见错误和解决方案是什么)
- [10. 引用](#10-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 命名空间的基本语法和导出规则
- 多文件命名空间的组织方式
- 别名的使用技巧
- 类型组织和管理
- 实际项目应用案例

## 2. 评价

- 这篇笔记是对 namespace 关键字的实战补充，重点关注实际使用中的技巧和模式。
- 在现代 TypeScript 开发中：
  - 普通应用代码不推荐使用 namespace，应使用 ES6 模块
  - 类型声明文件中仍然推荐使用 namespace 来组织类型
  - 为全局对象添加类型定义时 namespace 不可或缺
  - 维护旧项目时需要理解 namespace 的用法
- 掌握 namespace 的基本使用有助于：
  - 编写高质量的类型声明文件
  - 理解和维护使用 namespace 的旧代码
  - 为第三方库添加类型定义
  - 扩展全局类型

## 3. 如何创建和导出命名空间成员？

基本导出语法

::: code-group

```ts [基本成员导出]
namespace Utils {
  // ✅ 导出函数
  export function formatDate(date: Date): string {
    return date.toISOString().split('T')[0]
  }

  // ✅ 导出类
  export class Logger {
    log(message: string): void {
      console.log(`[LOG] ${message}`)
    }
  }

  // ✅ 导出常量
  export const VERSION = '1.0.0'

  // ✅ 导出接口
  export interface Config {
    debug: boolean
    timeout: number
  }

  // ❌ 未导出的成员（只能在命名空间内部使用）
  function internalHelper(): void {
    console.log('内部函数')
  }

  // ✅ 内部使用未导出的函数
  export function publicFunction(): void {
    internalHelper()
    console.log('公开函数')
  }
}

// 使用导出的成员
const date = Utils.formatDate(new Date())
const logger = new Utils.Logger()
logger.log('Hello')
console.log(Utils.VERSION)

const config: Utils.Config = { debug: true, timeout: 5000 }
Utils.publicFunction() // ✅ 会调用内部函数

// ❌ 无法访问未导出的成员
Utils.internalHelper() // 错误：internalHelper 不存在
```

```ts [批量导出]
namespace MathUtils {
  // 先定义
  function add(a: number, b: number): number {
    return a + b
  }

  function subtract(a: number, b: number): number {
    return a - b
  }

  class Calculator {
    result: number = 0
  }

  // ✅ 批量导出
  export { add, subtract, Calculator }
}

// 使用
const sum = MathUtils.add(1, 2)
const calc = new MathUtils.Calculator()
```

```ts [默认导出模式]
namespace App {
  // ✅ 导出主类
  export class Application {
    constructor(public name: string) {}

    start(): void {
      console.log(`${this.name} 启动`)
    }
  }

  // ✅ 导出工厂函数
  export function create(name: string): Application {
    return new Application(name)
  }

  // ✅ 导出类型
  export type Options = {
    name: string
    version: string
  }
}

// 使用
const app = App.create('MyApp')
app.start()

const options: App.Options = {
  name: 'MyApp',
  version: '1.0',
}
```

:::

导出不同类型的成员

```ts
namespace DataTypes {
  // ✅ 导出类型别名
  export type ID = string | number
  export type Status = 'pending' | 'success' | 'error'

  // ✅ 导出枚举
  export enum UserRole {
    Admin = 'admin',
    User = 'user',
    Guest = 'guest',
  }

  // ✅ 导出接口
  export interface User {
    id: ID
    name: string
    role: UserRole
    status: Status
  }

  // ✅ 导出泛型类
  export class Container<T> {
    private items: T[] = []

    add(item: T): void {
      this.items.push(item)
    }

    getAll(): T[] {
      return this.items
    }
  }

  // ✅ 导出泛型函数
  export function createArray<T>(length: number, value: T): T[] {
    return Array(length).fill(value)
  }
}

// 使用各种类型的导出
const userId: DataTypes.ID = '123'
const role = DataTypes.UserRole.Admin

const user: DataTypes.User = {
  id: userId,
  name: 'Alice',
  role: role,
  status: 'success',
}

const container = new DataTypes.Container<number>()
container.add(1)
container.add(2)

const arr = DataTypes.createArray(3, 'hello')
```

## 4. 如何在多个文件中组织命名空间？

使用三斜线指令引用

::: code-group

```ts [types.ts - 基础类型定义]
// 定义基础类型
namespace App {
  export interface User {
    id: string
    name: string
    email: string
  }

  export interface Post {
    id: string
    title: string
    content: string
    author: User
  }
}
```

```ts [validators.ts - 验证器]
// ✅ 使用三斜线指令引用其他文件
/// <reference path="./types.ts" />

namespace App {
  // ✅ 扩展已存在的命名空间
  export class UserValidator {
    static isValid(user: User): boolean {
      return user.name.length > 0 && user.email.includes('@')
    }
  }

  export class PostValidator {
    static isValid(post: Post): boolean {
      return post.title.length > 0 && post.content.length > 0
    }
  }
}
```

```ts [services.ts - 服务层]
/// <reference path="./types.ts" />
/// <reference path="./validators.ts" />

namespace App {
  // ✅ 继续扩展命名空间
  export class UserService {
    createUser(name: string, email: string): User | null {
      const user: User = {
        id: Math.random().toString(36),
        name,
        email,
      }

      // 使用同一命名空间中的验证器
      if (UserValidator.isValid(user)) {
        return user
      }

      return null
    }
  }

  export class PostService {
    createPost(title: string, content: string, author: User): Post | null {
      const post: Post = {
        id: Math.random().toString(36),
        title,
        content,
        author,
      }

      if (PostValidator.isValid(post)) {
        return post
      }

      return null
    }
  }
}
```

```ts [main.ts - 使用]
/// <reference path="./types.ts" />
/// <reference path="./validators.ts" />
/// <reference path="./services.ts" />

// ✅ 使用所有文件中定义的成员
const userService = new App.UserService()
const user = userService.createUser('Alice', 'alice@example.com')

if (user) {
  const postService = new App.PostService()
  const post = postService.createPost('Hello', 'This is my first post', user)

  console.log(post)
}
```

:::

编译多文件命名空间

```bash
# ✅ 使用 --outFile 合并所有文件
tsc --outFile dist/bundle.js types.ts validators.ts services.ts main.ts

# tsconfig.json 配置
{
  "compilerOptions": {
    "outFile": "./dist/bundle.js",
    "module": "amd" // 或 "system"
  },
  "files": [
    "types.ts",
    "validators.ts",
    "services.ts",
    "main.ts"
  ]
}
```

模块化组织命名空间

::: code-group

```ts [core/types.ts]
// ✅ 在模块中定义命名空间
export namespace Core {
  export interface Entity {
    id: string
    createdAt: Date
  }

  export interface Repository<T extends Entity> {
    findById(id: string): T | null
    save(entity: T): void
    delete(id: string): void
  }
}
```

```ts [user/types.ts]
import { Core } from '../core/types'

// ✅ 扩展导入的命名空间
export namespace User {
  // 使用 Core 中的类型
  export interface User extends Core.Entity {
    name: string
    email: string
  }

  export class UserRepository implements Core.Repository<User> {
    private users: Map<string, User> = new Map()

    findById(id: string): User | null {
      return this.users.get(id) || null
    }

    save(user: User): void {
      this.users.set(user.id, user)
    }

    delete(id: string): void {
      this.users.delete(id)
    }
  }
}
```

```ts [app.ts]
import { User } from './user/types'

// ✅ 使用模块化的命名空间
const repo = new User.UserRepository()

const user: User.User = {
  id: '1',
  name: 'Alice',
  email: 'alice@example.com',
  createdAt: new Date(),
}

repo.save(user)
const found = repo.findById('1')
console.log(found)
```

:::

## 5. 如何使用别名简化命名空间访问？

创建命名空间别名

```ts
namespace Company {
  export namespace HR {
    export namespace Employee {
      export class Manager {
        constructor(public name: string) {}

        approve(): void {
          console.log(`${this.name} 批准了请求`)
        }
      }

      export class Developer {
        constructor(
          public name: string,
          public level: number,
        ) {}

        code(): void {
          console.log(`${this.name} 正在编码`)
        }
      }
    }
  }
}

// ❌ 每次都写完整路径很麻烦
const manager1 = new Company.HR.Employee.Manager('Alice')
const dev1 = new Company.HR.Employee.Developer('Bob', 5)

// ✅ 使用别名简化访问
import Employee = Company.HR.Employee

const manager2 = new Employee.Manager('Alice')
const dev2 = new Employee.Developer('Bob', 5)

// ✅ 可以为具体的类创建别名
import Manager = Company.HR.Employee.Manager
import Developer = Company.HR.Employee.Developer

const manager3 = new Manager('Charlie')
const dev3 = new Developer('David', 3)
```

在函数作用域中使用别名

```ts
namespace API {
  export namespace V1 {
    export interface User {
      id: number
      name: string
    }

    export interface Post {
      id: number
      title: string
    }
  }

  export namespace V2 {
    export interface User {
      id: string
      name: string
      email: string
    }

    export interface Post {
      id: string
      title: string
      content: string
    }
  }
}

function useV1API() {
  // ✅ 在函数内创建别名
  import V1 = API.V1

  const user: V1.User = {
    id: 1,
    name: 'Alice',
  }

  const post: V1.Post = {
    id: 1,
    title: 'Hello',
  }

  console.log(user, post)
}

function useV2API() {
  // ✅ 同样的别名名称，不会冲突
  import V2 = API.V2

  const user: V2.User = {
    id: '1',
    name: 'Bob',
    email: 'bob@example.com',
  }

  const post: V2.Post = {
    id: '1',
    title: 'Hello',
    content: 'Content here',
  }

  console.log(user, post)
}
```

别名的实际应用场景

::: code-group

```ts [简化深层嵌套]
namespace Framework {
  export namespace UI {
    export namespace Components {
      export namespace Forms {
        export class Input {
          value: string = ''
        }

        export class Button {
          label: string = ''
        }

        export class Select {
          options: string[] = []
        }
      }
    }
  }
}

// ❌ 不使用别名
function createForm() {
  const input = new Framework.UI.Components.Forms.Input()
  const button = new Framework.UI.Components.Forms.Button()
  const select = new Framework.UI.Components.Forms.Select()
}

// ✅ 使用别名
import Forms = Framework.UI.Components.Forms

function createFormWithAlias() {
  const input = new Forms.Input()
  const button = new Forms.Button()
  const select = new Forms.Select()
}
```

```ts [版本切换]
namespace Database {
  export namespace MySQL {
    export class Connection {
      connect(): void {
        console.log('连接到 MySQL')
      }
    }
  }

  export namespace PostgreSQL {
    export class Connection {
      connect(): void {
        console.log('连接到 PostgreSQL')
      }
    }
  }
}

// ✅ 使用配置决定使用哪个数据库
const useMySQL = true

if (useMySQL) {
  import DB = Database.MySQL
  const conn = new DB.Connection()
  conn.connect()
} else {
  import DB = Database.PostgreSQL
  const conn = new DB.Connection()
  conn.connect()
}
```

```ts [条件类型别名]
namespace Config {
  export namespace Development {
    export interface Settings {
      debug: true
      apiUrl: string
    }
  }

  export namespace Production {
    export interface Settings {
      debug: false
      apiUrl: string
      cdn: string
    }
  }
}

// ✅ 根据环境使用不同的配置类型
const isDev = process.env.NODE_ENV === 'development'

if (isDev) {
  import Settings = Config.Development.Settings

  const config: Settings = {
    debug: true,
    apiUrl: 'http://localhost:3000',
  }
} else {
  import Settings = Config.Production.Settings

  const config: Settings = {
    debug: false,
    apiUrl: 'https://api.example.com',
    cdn: 'https://cdn.example.com',
  }
}
```

:::

## 6. 如何在命名空间中组织类型？

按功能分组类型

```ts
namespace Models {
  // ✅ 用户相关类型
  export namespace User {
    export interface User {
      id: string
      name: string
      email: string
      profile: Profile
    }

    export interface Profile {
      avatar: string
      bio: string
    }

    export type Role = 'admin' | 'user' | 'guest'

    export interface CreateUserDTO {
      name: string
      email: string
      password: string
    }

    export interface UpdateUserDTO {
      name?: string
      email?: string
    }
  }

  // ✅ 文章相关类型
  export namespace Post {
    export interface Post {
      id: string
      title: string
      content: string
      author: User.User // 引用其他命名空间的类型
      tags: Tag[]
      createdAt: Date
    }

    export interface Tag {
      id: string
      name: string
    }

    export type Status = 'draft' | 'published' | 'archived'

    export interface CreatePostDTO {
      title: string
      content: string
      tags: string[]
    }
  }
}

// 使用组织好的类型
function createUser(dto: Models.User.CreateUserDTO): Models.User.User {
  return {
    id: Math.random().toString(36),
    name: dto.name,
    email: dto.email,
    profile: {
      avatar: '',
      bio: '',
    },
  }
}

function createPost(
  dto: Models.Post.CreatePostDTO,
  author: Models.User.User,
): Models.Post.Post {
  return {
    id: Math.random().toString(36),
    title: dto.title,
    content: dto.content,
    author: author,
    tags: dto.tags.map((name) => ({ id: Math.random().toString(36), name })),
    createdAt: new Date(),
  }
}
```

请求和响应类型组织

```ts
namespace API {
  // ✅ 请求类型
  export namespace Request {
    export interface GetUser {
      userId: string
    }

    export interface CreateUser {
      name: string
      email: string
      password: string
    }

    export interface UpdateUser {
      userId: string
      data: {
        name?: string
        email?: string
      }
    }

    export interface ListUsers {
      page: number
      pageSize: number
      search?: string
    }
  }

  // ✅ 响应类型
  export namespace Response {
    export interface Success<T> {
      code: 200
      data: T
      message: string
    }

    export interface Error {
      code: number
      message: string
      errors?: Record<string, string>
    }

    export interface User {
      id: string
      name: string
      email: string
      createdAt: string
    }

    export interface UserList {
      users: User[]
      total: number
      page: number
      pageSize: number
    }
  }

  // ✅ API 端点类型
  export interface UserAPI {
    getUser(req: Request.GetUser): Promise<Response.Success<Response.User>>
    createUser(
      req: Request.CreateUser,
    ): Promise<Response.Success<Response.User>>
    updateUser(
      req: Request.UpdateUser,
    ): Promise<Response.Success<Response.User>>
    listUsers(
      req: Request.ListUsers,
    ): Promise<Response.Success<Response.UserList>>
  }
}

// 使用 API 类型
class UserAPIImpl implements API.UserAPI {
  async getUser(
    req: API.Request.GetUser,
  ): Promise<API.Response.Success<API.Response.User>> {
    // 实现
    return {
      code: 200,
      data: {
        id: req.userId,
        name: 'Alice',
        email: 'alice@example.com',
        createdAt: new Date().toISOString(),
      },
      message: 'Success',
    }
  }

  async createUser(
    req: API.Request.CreateUser,
  ): Promise<API.Response.Success<API.Response.User>> {
    // 实现
    return {
      code: 200,
      data: {
        id: Math.random().toString(36),
        name: req.name,
        email: req.email,
        createdAt: new Date().toISOString(),
      },
      message: 'User created',
    }
  }

  async updateUser(
    req: API.Request.UpdateUser,
  ): Promise<API.Response.Success<API.Response.User>> {
    // 实现
    return {
      code: 200,
      data: {
        id: req.userId,
        name: req.data.name || 'Alice',
        email: req.data.email || 'alice@example.com',
        createdAt: new Date().toISOString(),
      },
      message: 'User updated',
    }
  }

  async listUsers(
    req: API.Request.ListUsers,
  ): Promise<API.Response.Success<API.Response.UserList>> {
    // 实现
    return {
      code: 200,
      data: {
        users: [],
        total: 0,
        page: req.page,
        pageSize: req.pageSize,
      },
      message: 'Success',
    }
  }
}
```

状态管理类型组织

```ts
namespace Store {
  // ✅ 状态类型
  export namespace State {
    export interface User {
      currentUser: Models.User.User | null
      isAuthenticated: boolean
      loading: boolean
    }

    export interface Post {
      posts: Models.Post.Post[]
      currentPost: Models.Post.Post | null
      loading: boolean
    }

    export interface RootState {
      user: User
      post: Post
    }
  }

  // ✅ 动作类型
  export namespace Action {
    export type UserAction =
      | { type: 'USER_LOGIN'; payload: Models.User.User }
      | { type: 'USER_LOGOUT' }
      | { type: 'USER_UPDATE'; payload: Partial<Models.User.User> }

    export type PostAction =
      | { type: 'POST_LOAD'; payload: Models.Post.Post[] }
      | { type: 'POST_SELECT'; payload: Models.Post.Post }
      | { type: 'POST_CREATE'; payload: Models.Post.Post }
  }

  // ✅ Reducer 类型
  export type UserReducer = (
    state: State.User,
    action: Action.UserAction,
  ) => State.User

  export type PostReducer = (
    state: State.Post,
    action: Action.PostAction,
  ) => State.Post
}

// 使用状态管理类型
const userReducer: Store.UserReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOGIN':
      return {
        ...state,
        currentUser: action.payload,
        isAuthenticated: true,
      }
    case 'USER_LOGOUT':
      return {
        ...state,
        currentUser: null,
        isAuthenticated: false,
      }
    case 'USER_UPDATE':
      return {
        ...state,
        currentUser: state.currentUser
          ? { ...state.currentUser, ...action.payload }
          : null,
      }
    default:
      return state
  }
}
```

## 7. 如何结合类和命名空间使用？

为类添加静态成员命名空间

```ts
class Database {
  constructor(private connectionString: string) {}

  connect(): void {
    console.log(`连接到 ${this.connectionString}`)
  }
}

namespace Database {
  // ✅ 添加静态配置
  export interface Config {
    host: string
    port: number
    database: string
    username: string
    password: string
  }

  // ✅ 添加静态工厂方法
  export function fromConfig(config: Config): Database {
    const connectionString = `${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`
    return new Database(connectionString)
  }

  // ✅ 添加静态常量
  export const DEFAULT_PORT = 5432
  export const DEFAULT_HOST = 'localhost'

  // ✅ 添加辅助类型
  export type ConnectionStatus = 'connected' | 'disconnected' | 'error'
}

// 使用类的实例方法
const db = new Database('connection-string')
db.connect()

// 使用命名空间中的静态成员
const config: Database.Config = {
  host: Database.DEFAULT_HOST,
  port: Database.DEFAULT_PORT,
  database: 'mydb',
  username: 'user',
  password: 'pass',
}

const db2 = Database.fromConfig(config)
db2.connect()
```

为函数添加属性命名空间

```ts
function createLogger(name: string): createLogger.Logger {
  return {
    name,
    log: (message: string) => {
      const level = createLogger.defaultLevel
      console.log(`[${level}] ${name}: ${message}`)
    },
  }
}

namespace createLogger {
  // ✅ 函数的返回类型
  export interface Logger {
    name: string
    log(message: string): void
  }

  // ✅ 日志级别类型
  export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

  // ✅ 配置选项
  export interface Options {
    level?: LogLevel
    format?: 'json' | 'text'
  }

  // ✅ 默认配置
  export const defaultLevel: LogLevel = 'info'
  export const defaultOptions: Options = {
    level: 'info',
    format: 'text',
  }

  // ✅ 辅助函数
  export function withOptions(name: string, options: Options): Logger {
    return {
      name,
      log: (message: string) => {
        console.log(`[${options.level}] ${name}: ${message}`)
      },
    }
  }
}

// 使用
const logger = createLogger('App')
logger.log('应用启动')

// 使用命名空间中的辅助函数
const customLogger = createLogger.withOptions('Custom', {
  level: 'debug',
  format: 'json',
})
customLogger.log('调试信息')
```

实战案例：HTTP 客户端

::: code-group

```ts [HTTP 类和命名空间]
class HTTP {
  constructor(private baseURL: string) {}

  async request<T>(config: HTTP.RequestConfig): Promise<HTTP.Response<T>> {
    // 实现请求逻辑
    console.log(`${config.method} ${this.baseURL}${config.url}`)

    return {
      data: {} as T,
      status: 200,
      statusText: 'OK',
      headers: {},
    }
  }

  get<T>(url: string, config?: HTTP.GetConfig): Promise<HTTP.Response<T>> {
    return this.request<T>({ ...config, method: 'GET', url })
  }

  post<T>(
    url: string,
    data?: any,
    config?: HTTP.PostConfig,
  ): Promise<HTTP.Response<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data })
  }
}

namespace HTTP {
  // ✅ 请求方法类型
  export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

  // ✅ 请求配置
  export interface RequestConfig {
    url: string
    method: Method
    headers?: Record<string, string>
    params?: Record<string, any>
    data?: any
    timeout?: number
  }

  export interface GetConfig {
    headers?: Record<string, string>
    params?: Record<string, any>
    timeout?: number
  }

  export interface PostConfig {
    headers?: Record<string, string>
    timeout?: number
  }

  // ✅ 响应类型
  export interface Response<T> {
    data: T
    status: number
    statusText: string
    headers: Record<string, string>
  }

  // ✅ 错误类型
  export class HTTPError extends Error {
    constructor(
      message: string,
      public status: number,
      public response?: Response<any>,
    ) {
      super(message)
      this.name = 'HTTPError'
    }
  }

  // ✅ 拦截器类型
  export interface Interceptor {
    request?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>
    response?: <T>(response: Response<T>) => Response<T> | Promise<Response<T>>
  }

  // ✅ 静态工厂方法
  export function create(baseURL: string, interceptors?: Interceptor): HTTP {
    const instance = new HTTP(baseURL)
    // 应用拦截器逻辑
    return instance
  }

  // ✅ 预定义实例
  export const defaultInstance = new HTTP('https://api.example.com')
}
```

```ts [使用示例]
// 创建实例
const api = HTTP.create('https://api.example.com', {
  request: (config) => {
    console.log('请求拦截器', config)
    return config
  },
  response: (response) => {
    console.log('响应拦截器', response)
    return response
  },
})

// 定义 API 响应类型
interface User {
  id: string
  name: string
  email: string
}

// 发起请求
async function getUser(id: string) {
  try {
    const response = await api.get<User>(`/users/${id}`)
    console.log(response.data)
  } catch (error) {
    if (error instanceof HTTP.HTTPError) {
      console.error(`HTTP 错误 ${error.status}: ${error.message}`)
    }
  }
}

// 使用默认实例
HTTP.defaultInstance.get<User[]>('/users')
```

:::

## 8. 实际项目中的应用场景有哪些？

类型声明文件

```ts
// types/express.d.ts
// ✅ 为 Express 添加自定义类型

import 'express'

declare global {
  namespace Express {
    // 扩展 Request 接口
    interface Request {
      user?: {
        id: string
        name: string
        role: 'admin' | 'user'
      }

      // 添加自定义方法
      authenticate(): Promise<boolean>
    }

    // 扩展 Response 接口
    interface Response {
      // 添加自定义响应方法
      success<T>(data: T, message?: string): void
      error(message: string, code?: number): void
    }
  }
}

export {}
```

```ts
// middleware/auth.ts
import { Request, Response, NextFunction } from 'express'

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // ✅ 可以访问扩展的属性
  req.user = {
    id: '1',
    name: 'Alice',
    role: 'admin',
  }

  // ✅ 可以访问扩展的方法
  req.authenticate = async () => {
    return true
  }

  next()
}

// routes/user.ts
import { Router } from 'express'

const router = Router()

router.get('/profile', async (req, res) => {
  // ✅ TypeScript 知道 req.user 的类型
  if (req.user) {
    res.success({
      id: req.user.id,
      name: req.user.name,
      role: req.user.role,
    })
  } else {
    res.error('未授权', 401)
  }
})
```

全局配置管理

```ts
// config/types.ts
declare global {
  namespace Config {
    // ✅ 环境配置
    interface Environment {
      NODE_ENV: 'development' | 'production' | 'test'
      PORT: number
      HOST: string
    }

    // ✅ 数据库配置
    interface Database {
      host: string
      port: number
      username: string
      password: string
      database: string
    }

    // ✅ Redis 配置
    interface Redis {
      host: string
      port: number
      password?: string
      db: number
    }

    // ✅ JWT 配置
    interface JWT {
      secret: string
      expiresIn: string
      refreshExpiresIn: string
    }

    // ✅ 完整配置
    interface AppConfig {
      env: Environment
      database: Database
      redis: Redis
      jwt: JWT
    }
  }
}

export {}
```

```ts
// config/index.ts
const config: Config.AppConfig = {
  env: {
    NODE_ENV: (process.env.NODE_ENV as any) || 'development',
    PORT: Number(process.env.PORT) || 3000,
    HOST: process.env.HOST || 'localhost',
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'myapp',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    db: 0,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: '7d',
    refreshExpiresIn: '30d',
  },
}

export default config

// 在其他文件中使用
// services/database.ts
import config from '../config'

class DatabaseService {
  connect() {
    // ✅ 有完整的类型提示
    const { host, port, database } = config.database
    console.log(`连接到 ${host}:${port}/${database}`)
  }
}
```

领域模型组织

```ts
// models/ecommerce.ts
namespace Ecommerce {
  // ✅ 产品模块
  export namespace Product {
    export interface Product {
      id: string
      name: string
      price: number
      stock: number
      category: Category
    }

    export interface Category {
      id: string
      name: string
      parent?: Category
    }

    export class ProductService {
      async getProduct(id: string): Promise<Product | null> {
        // 实现
        return null
      }

      async updateStock(id: string, quantity: number): Promise<void> {
        // 实现
      }
    }
  }

  // ✅ 订单模块
  export namespace Order {
    export interface Order {
      id: string
      customer: Customer.Customer
      items: OrderItem[]
      total: number
      status: OrderStatus
      createdAt: Date
    }

    export interface OrderItem {
      product: Product.Product
      quantity: number
      price: number
    }

    export type OrderStatus =
      | 'pending'
      | 'paid'
      | 'shipped'
      | 'delivered'
      | 'cancelled'

    export class OrderService {
      async createOrder(
        customerId: string,
        items: OrderItem[],
      ): Promise<Order> {
        // 实现
        throw new Error('Not implemented')
      }

      async updateStatus(orderId: string, status: OrderStatus): Promise<void> {
        // 实现
      }
    }
  }

  // ✅ 客户模块
  export namespace Customer {
    export interface Customer {
      id: string
      name: string
      email: string
      addresses: Address[]
    }

    export interface Address {
      id: string
      street: string
      city: string
      country: string
      postalCode: string
      isDefault: boolean
    }

    export class CustomerService {
      async getCustomer(id: string): Promise<Customer | null> {
        // 实现
        return null
      }

      async addAddress(
        customerId: string,
        address: Omit<Address, 'id'>,
      ): Promise<Address> {
        // 实现
        throw new Error('Not implemented')
      }
    }
  }
}

// 使用领域模型
async function checkoutProcess() {
  const productService = new Ecommerce.Product.ProductService()
  const orderService = new Ecommerce.Order.OrderService()
  const customerService = new Ecommerce.Customer.CustomerService()

  // ✅ 类型清晰，结构明确
  const customer = await customerService.getCustomer('customer-1')
  const product = await productService.getProduct('product-1')

  if (customer && product) {
    const order = await orderService.createOrder(customer.id, [
      {
        product: product,
        quantity: 1,
        price: product.price,
      },
    ])

    console.log(`订单 ${order.id} 创建成功`)
  }
}
```

## 9. 常见错误和解决方案是什么？

错误 1：忘记导出成员

::: code-group

```ts [❌ 问题代码]
namespace Utils {
  // 忘记 export
  function helper() {
    return 'help'
  }
}

// ❌ 错误：helper 不存在
Utils.helper()
```

```ts [✅ 解决方案]
namespace Utils {
  // 添加 export
  export function helper() {
    return 'help'
  }
}

// ✅ 正常使用
Utils.helper()
```

:::

错误 2：循环依赖

::: code-group

```ts [❌ 问题代码]
// file1.ts
/// <reference path="./file2.ts" />

namespace ModuleA {
  export function useB() {
    ModuleB.doSomething() // 依赖 ModuleB
  }
}

// file2.ts
/// <reference path="./file1.ts" />

namespace ModuleB {
  export function doSomething() {
    ModuleA.useB() // 依赖 ModuleA - 循环依赖！
  }
}
```

```ts [✅ 解决方案 1：重构避免循环]
// file1.ts
namespace ModuleA {
  export function useB(callback: () => void) {
    callback()
  }
}

// file2.ts
/// <reference path="./file1.ts" />

namespace ModuleB {
  export function doSomething() {
    console.log('执行操作')
  }

  export function callA() {
    ModuleA.useB(() => {
      doSomething()
    })
  }
}
```

```ts [✅ 解决方案 2：提取共享逻辑]
// shared.ts
namespace Shared {
  export function commonLogic() {
    console.log('共享逻辑')
  }
}

// file1.ts
/// <reference path="./shared.ts" />

namespace ModuleA {
  export function doWork() {
    Shared.commonLogic()
  }
}

// file2.ts
/// <reference path="./shared.ts" />

namespace ModuleB {
  export function doWork() {
    Shared.commonLogic()
  }
}
```

:::

错误 3：命名空间和模块混用

::: code-group

```ts [❌ 问题代码]
// utils.ts
export namespace Utils {
  export function helper() {
    return 'help'
  }
}

// app.ts
import { Utils } from './utils'

// ❌ 混淆：既是命名空间又是模块
Utils.helper()
```

```ts [✅ 解决方案 1：只用模块]
// utils.ts
export function helper() {
  return 'help'
}

export function another() {
  return 'another'
}

// app.ts
import * as Utils from './utils'

Utils.helper()
Utils.another()
```

```ts [✅ 解决方案 2：使用对象]
// utils.ts
export const Utils = {
  helper() {
    return 'help'
  },
  another() {
    return 'another'
  },
}

// app.ts
import { Utils } from './utils'

Utils.helper()
Utils.another()
```

:::

错误 4：访问未导出的类型

::: code-group

```ts [❌ 问题代码]
namespace API {
  // 内部类型，未导出
  interface InternalUser {
    id: string
    name: string
  }

  // 导出的函数返回未导出的类型
  export function getUser(): InternalUser {
    return { id: '1', name: 'Alice' }
  }
}

// ❌ 无法引用返回类型
const user: API.InternalUser = API.getUser()
```

```ts [✅ 解决方案 1：导出类型]
namespace API {
  // 导出类型
  export interface User {
    id: string
    name: string
  }

  export function getUser(): User {
    return { id: '1', name: 'Alice' }
  }
}

// ✅ 可以使用类型
const user: API.User = API.getUser()
```

```ts [✅ 解决方案 2：使用类型推断]
namespace API {
  interface InternalUser {
    id: string
    name: string
  }

  export function getUser(): InternalUser {
    return { id: '1', name: 'Alice' }
  }
}

// ✅ 使用 ReturnType 获取返回类型
type User = ReturnType<typeof API.getUser>
const user: User = API.getUser()
```

:::

错误 5：忘记三斜线指令

::: code-group

```ts [❌ 问题代码]
// types.ts
namespace App {
  export interface User {
    id: string
    name: string
  }
}

// services.ts
// ❌ 忘记引用 types.ts
namespace App {
  export class UserService {
    getUser(): User {
      // 找不到 User
      return { id: '1', name: 'Alice' }
    }
  }
}
```

```ts [✅ 解决方案]
// types.ts
namespace App {
  export interface User {
    id: string
    name: string
  }
}

// services.ts
// ✅ 添加三斜线指令
/// <reference path="./types.ts" />

namespace App {
  export class UserService {
    getUser(): User {
      return { id: '1', name: 'Alice' }
    }
  }
}
```

:::

## 10. 引用

- [TypeScript 官方文档 - Namespaces][1]
- [TypeScript 官方文档 - Namespaces and Modules][2]
- [TypeScript 官方文档 - Declaration Merging][3]
- [TypeScript 官方文档 - Triple-Slash Directives][4]

[1]: https://www.typescriptlang.org/docs/handbook/namespaces.html
[2]: https://www.typescriptlang.org/docs/handbook/namespaces-and-modules.html
[3]: https://www.typescriptlang.org/docs/handbook/declaration-merging.html
[4]: https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html
