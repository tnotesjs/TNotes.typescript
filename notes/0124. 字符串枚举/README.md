# [0124. 字符串枚举](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0124.%20%E5%AD%97%E7%AC%A6%E4%B8%B2%E6%9E%9A%E4%B8%BE)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是字符串枚举？](#3--什么是字符串枚举)
- [4. 🤔 基本语法](#4--基本语法)
  - [4.1. 完全初始化](#41-完全初始化)
  - [4.2. 命名约定](#42-命名约定)
  - [4.3. 使用常量](#43-使用常量)
  - [4.4. 编译结果](#44-编译结果)
- [5. 🤔 字符串枚举的特性](#5--字符串枚举的特性)
  - [5.1. 无反向映射](#51-无反向映射)
  - [5.2. 类型安全](#52-类型安全)
  - [5.3. 序列化](#53-序列化)
  - [5.4. 枚举成员作为类型](#54-枚举成员作为类型)
- [6. 🤔 混合枚举](#6--混合枚举)
  - [6.1. 数字和字符串混合](#61-数字和字符串混合)
  - [6.2. 混合枚举的限制](#62-混合枚举的限制)
  - [6.3. 最佳实践：避免混合](#63-最佳实践避免混合)
- [7. 🤔 常见使用场景](#7--常见使用场景)
  - [7.1. 场景 1：API 端点](#71-场景-1api-端点)
  - [7.2. 场景 2：事件类型](#72-场景-2事件类型)
  - [7.3. 场景 3：配置键](#73-场景-3配置键)
  - [7.4. 场景 4：状态管理](#74-场景-4状态管理)
  - [7.5. 场景 5：本地化键](#75-场景-5本地化键)
  - [7.6. 场景 6：文件类型](#76-场景-6文件类型)
  - [7.7. 场景 7：数据库查询](#77-场景-7数据库查询)
- [8. 🤔 常见错误和最佳实践](#8--常见错误和最佳实践)
  - [8.1. 错误 1：忘记初始化](#81-错误-1忘记初始化)
  - [8.2. 错误 2：假设有反向映射](#82-错误-2假设有反向映射)
  - [8.3. 错误 3：值不一致](#83-错误-3值不一致)
  - [8.4. 错误 4：过长的枚举值](#84-错误-4过长的枚举值)
  - [8.5. 最佳实践](#85-最佳实践)
- [9. 🔗 引用](#9--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 字符串枚举的定义和特性
- 与数字枚举的区别
- 混合枚举的使用
- 序列化和调试优势
- 实际应用场景

## 2. 🫧 评价

字符串枚举（String Enum）是 TypeScript 中使用字符串作为值的枚举类型。

字符串枚举的特点：

- 显式赋值：每个成员必须手动赋值
- 可读性强：值本身具有语义
- 无反向映射：不支持从值获取名称
- 序列化友好：JSON 序列化后可读

字符串枚举 vs 数字枚举：

| 特性     | 字符串枚举 | 数字枚举 |
| -------- | ---------- | -------- |
| 值类型   | 字符串     | 数字     |
| 自动递增 | 不支持     | 支持     |
| 反向映射 | 不支持     | 支持     |
| 可读性   | 更好       | 较差     |
| 调试     | 更容易     | 需要查表 |
| 序列化   | 字符串     | 数字     |

字符串枚举的优势：

1. 自文档化：值本身说明含义
2. 调试友好：日志和错误信息更清晰
3. 序列化安全：JSON 中保持可读性
4. 重构安全：重命名时值不变

## 3. 🤔 什么是字符串枚举？

字符串枚举是成员值为字符串字面量的枚举类型，每个成员都必须显式初始化。

- 显式初始化：每个成员必须赋值
- 字符串字面量：值是字符串类型
- 无反向映射：只能通过名称访问
- 可读性：值本身具有语义

```ts
// ✅ 字符串枚举
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

// ✅ 使用
function move(direction: Direction): void {
  console.log(`Moving ${direction}`)
}

move(Direction.Up) // 'Moving UP'

// ✅ 序列化友好
const data = {
  direction: Direction.Left,
}
console.log(JSON.stringify(data)) // {"direction":"LEFT"}
```

## 4. 🤔 基本语法

### 4.1. 完全初始化

```ts
// ✅ 每个成员都必须初始化
enum Color {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE',
}

// ❌ 不能省略初始化
// enum Invalid {
//   First = 'FIRST',
//   Second  // Error: 必须初始化
// }
```

### 4.2. 命名约定

```ts
// ✅ 常见命名模式

// 1. 全大写
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

// 5. 与名称相同
enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}
```

### 4.3. 使用常量

```ts
// ✅ 使用 const 定义常量值
const PREFIX = 'APP_'

enum EventType {
  Login = `${PREFIX}LOGIN`,
  Logout = `${PREFIX}LOGOUT`,
}

console.log(EventType.Login) // 'APP_LOGIN'
```

### 4.4. 编译结果

```ts
// TypeScript 代码
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
}

// 编译为 JavaScript
var Direction
;(function (Direction) {
  Direction['Up'] = 'UP'
  Direction['Down'] = 'DOWN'
})(Direction || (Direction = {}))

// 等价于
const Direction = {
  Up: 'UP',
  Down: 'DOWN',
}
```

## 5. 🤔 字符串枚举的特性

### 5.1. 无反向映射

```ts
// ✅ 字符串枚举没有反向映射
enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

console.log(Status.Active) // 'ACTIVE'
console.log(Status['Active']) // 'ACTIVE'
console.log(Status['ACTIVE']) // undefined - 无反向映射

// ✅ 如需反向映射，需要手动实现
const StatusReverse: Record<string, string> = {}
for (const key in Status) {
  StatusReverse[Status[key as keyof typeof Status]] = key
}

console.log(StatusReverse['ACTIVE']) // 'Active'
```

### 5.2. 类型安全

```ts
// ✅ 类型检查
enum Color {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE',
}

function setColor(color: Color): void {
  console.log(`Setting color to ${color}`)
}

setColor(Color.Red) // ✅
// setColor('RED')       // ❌ Error: 类型不匹配
// setColor('YELLOW')    // ❌ Error: 不存在的值

// ✅ 使用联合类型接受字符串
function setColorLoose(color: Color | string): void {
  console.log(`Setting color to ${color}`)
}

setColorLoose(Color.Red) // ✅
setColorLoose('YELLOW') // ✅
```

### 5.3. 序列化

```ts
// ✅ JSON 序列化保持可读性
enum LogLevel {
  Debug = 'DEBUG',
  Info = 'INFO',
  Warn = 'WARN',
  Error = 'ERROR',
}

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: Date
}

const log: LogEntry = {
  level: LogLevel.Error,
  message: 'Something went wrong',
  timestamp: new Date(),
}

const json = JSON.stringify(log)
console.log(json)
// {"level":"ERROR","message":"Something went wrong","timestamp":"..."}

// ✅ 反序列化
const parsed = JSON.parse(json) as LogEntry
console.log(parsed.level === LogLevel.Error) // true
console.log(parsed.level) // 'ERROR'
```

### 5.4. 枚举成员作为类型

```ts
// ✅ 使用枚举成员作为字面量类型
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}

type VerticalDirection = Direction.Up | Direction.Down
type HorizontalDirection = Direction.Left | Direction.Right

function moveVertical(dir: VerticalDirection): void {
  console.log(`Moving vertically: ${dir}`)
}

moveVertical(Direction.Up) // ✅
moveVertical(Direction.Down) // ✅
// moveVertical(Direction.Left)  // ❌ Error
```

## 6. 🤔 混合枚举

### 6.1. 数字和字符串混合

```ts
// ✅ 可以混合使用（不推荐）
enum Mixed {
  No = 0,
  Yes = 'YES',
}

console.log(Mixed.No) // 0
console.log(Mixed.Yes) // 'YES'

// ✅ 实际使用场景：兼容旧代码
enum Status {
  Unknown = 0, // 数字保持兼容
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}
```

### 6.2. 混合枚举的限制

```ts
// ❌ 混合枚举的自动递增问题
enum Problem {
  A = 'A',
  B, // Error: 字符串后的成员必须初始化
  C = 1,
  D, // 2 - 数字后可以自动递增
}

// ✅ 正确的混合方式
enum Correct {
  None = 0,
  First = 'FIRST',
  Second = 'SECOND',
  Third = 3,
  Fourth, // 4
}
```

### 6.3. 最佳实践：避免混合

```ts
// ❌ 不推荐混合
enum NotRecommended {
  Flag = 0,
  Name = 'NAME',
}

// ✅ 推荐分开定义
enum Flags {
  None = 0,
  Read = 1,
  Write = 2,
}

enum Names {
  User = 'USER',
  Admin = 'ADMIN',
}
```

## 7. 🤔 常见使用场景

### 7.1. 场景 1：API 端点

```ts
// ✅ 定义 API 路径
enum ApiRoute {
  GetUsers = '/api/users',
  GetUser = '/api/users/:id',
  CreateUser = '/api/users',
  UpdateUser = '/api/users/:id',
  DeleteUser = '/api/users/:id',
}

class ApiClient {
  async get(route: ApiRoute, params?: any): Promise<any> {
    const url = this.buildUrl(route, params)
    return fetch(url).then((res) => res.json())
  }

  private buildUrl(route: ApiRoute, params?: any): string {
    let url = route
    if (params?.id) {
      url = url.replace(':id', params.id)
    }
    return url
  }
}

const client = new ApiClient()
client.get(ApiRoute.GetUsers)
```

### 7.2. 场景 2：事件类型

```ts
// ✅ 定义事件名称
enum AppEvent {
  UserLogin = 'user:login',
  UserLogout = 'user:logout',
  DataLoaded = 'data:loaded',
  ErrorOccurred = 'error:occurred',
}

class EventEmitter {
  private handlers = new Map<AppEvent, Array<(data: any) => void>>()

  on(event: AppEvent, handler: (data: any) => void): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, [])
    }
    this.handlers.get(event)!.push(handler)
  }

  emit(event: AppEvent, data?: any): void {
    const handlers = this.handlers.get(event)
    if (handlers) {
      handlers.forEach((handler) => handler(data))
    }
  }
}

const emitter = new EventEmitter()
emitter.on(AppEvent.UserLogin, (user) => {
  console.log('User logged in:', user)
})

emitter.emit(AppEvent.UserLogin, { id: 1, name: 'Alice' })
```

### 7.3. 场景 3：配置键

```ts
// ✅ 配置项键名
enum ConfigKey {
  ApiUrl = 'api.url',
  ApiTimeout = 'api.timeout',
  CacheEnabled = 'cache.enabled',
  CacheTTL = 'cache.ttl',
  LogLevel = 'log.level',
}

class Config {
  private values = new Map<ConfigKey, any>()

  set(key: ConfigKey, value: any): void {
    this.values.set(key, value)
  }

  get<T = any>(key: ConfigKey): T | undefined {
    return this.values.get(key)
  }

  has(key: ConfigKey): boolean {
    return this.values.has(key)
  }
}

const config = new Config()
config.set(ConfigKey.ApiUrl, 'https://api.example.com')
config.set(ConfigKey.ApiTimeout, 5000)

console.log(config.get(ConfigKey.ApiUrl))
```

### 7.4. 场景 4：状态管理

```ts
// ✅ Redux 风格的 Action 类型
enum ActionType {
  // User actions
  UserLoginRequest = 'USER_LOGIN_REQUEST',
  UserLoginSuccess = 'USER_LOGIN_SUCCESS',
  UserLoginFailure = 'USER_LOGIN_FAILURE',

  // Data actions
  FetchDataRequest = 'FETCH_DATA_REQUEST',
  FetchDataSuccess = 'FETCH_DATA_SUCCESS',
  FetchDataFailure = 'FETCH_DATA_FAILURE',
}

interface Action<T = any> {
  type: ActionType
  payload?: T
}

function reducer(state: any, action: Action): any {
  switch (action.type) {
    case ActionType.UserLoginSuccess:
      return { ...state, user: action.payload }
    case ActionType.FetchDataSuccess:
      return { ...state, data: action.payload }
    default:
      return state
  }
}

// ✅ Action 创建器
function createAction<T>(type: ActionType, payload?: T): Action<T> {
  return { type, payload }
}

const loginAction = createAction(ActionType.UserLoginSuccess, {
  id: 1,
  name: 'Alice',
})
```

### 7.5. 场景 5：本地化键

```ts
// ✅ 国际化键名
enum I18nKey {
  // Common
  Common_Yes = 'common.yes',
  Common_No = 'common.no',
  Common_Cancel = 'common.cancel',
  Common_Confirm = 'common.confirm',

  // Errors
  Error_NotFound = 'error.notFound',
  Error_ServerError = 'error.serverError',
  Error_Unauthorized = 'error.unauthorized',

  // User
  User_Name = 'user.name',
  User_Email = 'user.email',
  User_Password = 'user.password',
}

class I18n {
  private translations: Record<string, Record<string, string>> = {
    en: {
      [I18nKey.Common_Yes]: 'Yes',
      [I18nKey.Common_No]: 'No',
      [I18nKey.Error_NotFound]: 'Not found',
    },
    zh: {
      [I18nKey.Common_Yes]: '是',
      [I18nKey.Common_No]: '否',
      [I18nKey.Error_NotFound]: '未找到',
    },
  }

  constructor(private locale: string = 'en') {}

  t(key: I18nKey): string {
    return this.translations[this.locale]?.[key] || key
  }

  setLocale(locale: string): void {
    this.locale = locale
  }
}

const i18n = new I18n('zh')
console.log(i18n.t(I18nKey.Common_Yes)) // '是'
```

### 7.6. 场景 6：文件类型

```ts
// ✅ MIME 类型
enum MimeType {
  // Text
  TextPlain = 'text/plain',
  TextHtml = 'text/html',
  TextCss = 'text/css',
  TextJavascript = 'text/javascript',

  // Application
  Json = 'application/json',
  Xml = 'application/xml',
  Pdf = 'application/pdf',

  // Image
  Jpeg = 'image/jpeg',
  Png = 'image/png',
  Gif = 'image/gif',
  Svg = 'image/svg+xml',
}

class FileUploader {
  private allowedTypes: Set<MimeType>

  constructor(allowedTypes: MimeType[]) {
    this.allowedTypes = new Set(allowedTypes)
  }

  isAllowed(mimeType: MimeType): boolean {
    return this.allowedTypes.has(mimeType)
  }

  upload(file: File): boolean {
    const mimeType = file.type as MimeType

    if (!this.isAllowed(mimeType)) {
      console.error(`File type ${mimeType} not allowed`)
      return false
    }

    console.log(`Uploading ${file.name} (${mimeType})`)
    return true
  }
}

const uploader = new FileUploader([MimeType.Jpeg, MimeType.Png, MimeType.Pdf])
```

### 7.7. 场景 7：数据库查询

```ts
// ✅ 查询操作符
enum QueryOperator {
  Equal = 'eq',
  NotEqual = 'ne',
  GreaterThan = 'gt',
  GreaterThanOrEqual = 'gte',
  LessThan = 'lt',
  LessThanOrEqual = 'lte',
  In = 'in',
  NotIn = 'nin',
  Like = 'like',
}

interface QueryCondition {
  field: string
  operator: QueryOperator
  value: any
}

class QueryBuilder {
  private conditions: QueryCondition[] = []

  where(field: string, operator: QueryOperator, value: any): this {
    this.conditions.push({ field, operator, value })
    return this
  }

  build(): string {
    return this.conditions
      .map((c) => `${c.field} ${c.operator} ${JSON.stringify(c.value)}`)
      .join(' AND ')
  }
}

const query = new QueryBuilder()
  .where('age', QueryOperator.GreaterThan, 18)
  .where('status', QueryOperator.Equal, 'active')
  .build()

console.log(query) // 'age gt 18 AND status eq "active"'
```

## 8. 🤔 常见错误和最佳实践

### 8.1. 错误 1：忘记初始化

```ts
// ❌ 字符串枚举必须全部初始化
// enum Bad {
//   First = 'FIRST',
//   Second  // Error
// }

// ✅ 全部初始化
enum Good {
  First = 'FIRST',
  Second = 'SECOND',
}
```

### 8.2. 错误 2：假设有反向映射

```ts
// ❌ 字符串枚举没有反向映射
enum Status {
  Active = 'ACTIVE',
}

// console.log(Status['ACTIVE'])  // undefined

// ✅ 手动创建反向映射
const StatusValue = {
  ACTIVE: Status.Active,
}

// ✅ 或使用辅助函数
function getStatusByValue(value: string): keyof typeof Status | undefined {
  for (const key in Status) {
    if (Status[key as keyof typeof Status] === value) {
      return key as keyof typeof Status
    }
  }
  return undefined
}
```

### 8.3. 错误 3：值不一致

```ts
// ❌ 值与名称不一致容易混淆
enum Bad {
  FirstItem = 'SECOND',
  SecondItem = 'FIRST',
}

// ✅ 保持一致性
enum Good {
  FirstItem = 'FIRST_ITEM',
  SecondItem = 'SECOND_ITEM',
}

// ✅ 或使用相同值
enum Better {
  First = 'First',
  Second = 'Second',
}
```

### 8.4. 错误 4：过长的枚举值

```ts
// ❌ 值过长影响可读性
enum VeryLongEnum {
  SomeVeryLongNameThatIsHardToRead = 'some_very_long_name_that_is_hard_to_read',
}

// ✅ 使用简短有意义的值
enum BetterEnum {
  LongName = 'long-name',
}
```

### 8.5. 最佳实践

```ts
// ✅ 1. 使用大写值（约定）
enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

// ✅ 2. 使用短横线分隔（kebab-case）
enum EventType {
  UserLogin = 'user-login',
  UserLogout = 'user-logout',
  DataUpdated = 'data-updated',
}

// ✅ 3. 保持值与名称一致
enum Color {
  Red = 'Red',
  Green = 'Green',
  Blue = 'Blue',
}

// ✅ 4. 使用命名空间扩展功能
enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

namespace Status {
  export function parse(value: string): Status | undefined {
    return Object.values(Status).includes(value as Status)
      ? (value as Status)
      : undefined
  }

  export function isValid(value: any): value is Status {
    return Object.values(Status).includes(value)
  }

  export const all = Object.values(Status)
}

console.log(Status.parse('ACTIVE')) // Status.Active
console.log(Status.isValid('ACTIVE')) // true
console.log(Status.all) // ['ACTIVE', 'INACTIVE']

// ✅ 5. 使用 const enum 优化
const enum Direction {
  Up = 'UP',
  Down = 'DOWN',
}

const dir = Direction.Up // 编译为: const dir = "UP"

// ✅ 6. 使用类型别名简化
enum LongEnumName {
  VeryLongFirstValue = 'VERY_LONG_FIRST_VALUE',
  VeryLongSecondValue = 'VERY_LONG_SECOND_VALUE',
}

type ShortName = LongEnumName

function process(value: ShortName): void {}

// ✅ 7. 导出枚举值类型
enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

export type StatusValue = `${Status}`
// 等价于: type StatusValue = 'ACTIVE' | 'INACTIVE'

// ✅ 8. 使用 satisfies 确保完整性
enum Color {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE',
}

const colorNames = {
  [Color.Red]: '红色',
  [Color.Green]: '绿色',
  [Color.Blue]: '蓝色',
} satisfies Record<Color, string>

// ✅ 9. 文档化枚举
/
 * HTTP 请求方法
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
 */
enum HttpMethod {
  / GET 方法用于请求指定资源 */
  GET = 'GET',

  / POST 方法用于提交数据 */
  POST = 'POST',

  / PUT 方法用于更新资源 */
  PUT = 'PUT',

  / DELETE 方法用于删除资源 */
  DELETE = 'DELETE',
}

// ✅ 10. 使用工具函数
enum Status {
  Draft = 'DRAFT',
  Published = 'PUBLISHED',
  Archived = 'ARCHIVED',
}

// 获取所有枚举值
function getEnumValues<T extends Record<string, string>>(
  enumObj: T
): T[keyof T][] {
  return Object.values(enumObj)
}

// 获取所有枚举键
function getEnumKeys<T extends Record<string, string>>(
  enumObj: T
): (keyof T)[] {
  return Object.keys(enumObj) as (keyof T)[]
}

// 检查值是否有效
function isEnumValue<T extends Record<string, string>>(
  enumObj: T,
  value: any
): value is T[keyof T] {
  return Object.values(enumObj).includes(value)
}

console.log(getEnumValues(Status)) // ['DRAFT', 'PUBLISHED', 'ARCHIVED']
console.log(getEnumKeys(Status)) // ['Draft', 'Published', 'Archived']
console.log(isEnumValue(Status, 'DRAFT')) // true
```

## 9. 🔗 引用

- [TypeScript Handbook - Enums][1]
- [TypeScript Deep Dive - String Enums][2]
- [TypeScript Enum Best Practices][3]

[1]: https://www.typescriptlang.org/docs/handbook/enums.html
[2]: https://basarat.gitbook.io/typescript/type-system/enums#string-enums
[3]: https://www.typescriptlang.org/docs/handbook/enums.html#string-enums
