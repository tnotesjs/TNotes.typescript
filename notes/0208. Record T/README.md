# [0208. Record T](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0208.%20Record%20T)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 Record\<K, T\> 是什么？](#3--recordk-t-是什么)
  - [3.1. 源码定义](#31-源码定义)
  - [3.2. 工作原理](#32-工作原理)
  - [3.3. 基本示例](#33-基本示例)
- [4. 🤔 如何使用 Record\<K, T\>？](#4--如何使用-recordk-t)
  - [4.1. 场景 1：枚举值映射](#41-场景-1枚举值映射)
  - [4.2. 场景 2：配置对象](#42-场景-2配置对象)
  - [4.3. 场景 3：事件处理器映射](#43-场景-3事件处理器映射)
  - [4.4. 场景 4：API 端点定义](#44-场景-4api-端点定义)
- [5. 🤔 Record\<K, T\> 的实际应用场景有哪些？](#5--recordk-t-的实际应用场景有哪些)
  - [5.1. 应用 1：国际化（i18n）](#51-应用-1国际化i18n)
  - [5.2. 应用 2：状态机](#52-应用-2状态机)
  - [5.3. 应用 3：表单验证规则](#53-应用-3表单验证规则)
  - [5.4. 应用 4：缓存策略](#54-应用-4缓存策略)
  - [5.5. 应用 5：路由配置](#55-应用-5路由配置)
- [6. 🤔 Record 与索引签名的区别是什么？](#6--record-与索引签名的区别是什么)
  - [6.1. 索引签名](#61-索引签名)
  - [6.2. Record 类型](#62-record-类型)
  - [6.3. 对比总结](#63-对比总结)
- [7. 🤔 使用 Record\<K, T\> 需要注意什么？](#7--使用-recordk-t-需要注意什么)
  - [7.1. 注意事项 1：键类型限制](#71-注意事项-1键类型限制)
  - [7.2. 注意事项 2：必须包含所有键](#72-注意事项-2必须包含所有键)
  - [7.3. 注意事项 3：键的动态性](#73-注意事项-3键的动态性)
  - [7.4. 注意事项 4：值类型的统一性](#74-注意事项-4值类型的统一性)
  - [7.5. 注意事项 5：与 keyof 的结合](#75-注意事项-5与-keyof-的结合)
  - [7.6. 注意事项 6：数字键的行为](#76-注意事项-6数字键的行为)
  - [7.7. 注意事项 7：与泛型的结合](#77-注意事项-7与泛型的结合)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- `Record<K, T>` 的定义和实现原理
- 基本使用方法
- 实际应用场景
- 与索引签名的对比
- 使用注意事项

## 2. 🫧 评价

`Record<K, T>` 用于创建键值对类型，是构建对象映射的强大工具。

- 比索引签名更加精确和类型安全
- 常用于创建枚举值映射、配置对象等
- 键类型必须是 `string | number | symbol`
- 可以与联合类型结合创建精确的对象结构
- 在处理字典、映射表等数据结构时特别有用

## 3. 🤔 Record\<K, T\> 是什么？

`Record<K, T>` 创建一个对象类型，其属性键为 `K`，属性值为 `T`。

### 3.1. 源码定义

```typescript
// TypeScript lib.es5.d.ts 中的定义
type Record<K extends keyof any, T> = {
  [P in K]: T
}

// keyof any = string | number | symbol
// 这是所有可能的对象键类型
```

### 3.2. 工作原理

```typescript
// 使用字符串字面量联合类型作为键
type Status = 'pending' | 'success' | 'error'

type StatusMessages = Record<Status, string>
// 展开过程：
// 1. K = 'pending' | 'success' | 'error'
// 2. [P in K]: string
// 3. 结果：
// {
//   pending: string;
//   success: string;
//   error: string;
// }
```

### 3.3. 基本示例

```typescript
// 示例 1：状态消息映射
type Status = 'idle' | 'loading' | 'success' | 'error'
type StatusMessages = Record<Status, string>

const messages: StatusMessages = {
  idle: 'Ready',
  loading: 'Loading...',
  success: 'Done!',
  error: 'Failed',
}

// ❌ 必须包含所有键
const incomplete: StatusMessages = {
  idle: 'Ready',
  loading: 'Loading...',
  // 错误：缺少 success 和 error
}

// ❌ 不能有额外的键
const extra: StatusMessages = {
  idle: 'Ready',
  loading: 'Loading...',
  success: 'Done!',
  error: 'Failed',
  warning: 'Warning', // 错误：多余的键
}
```

## 4. 🤔 如何使用 Record\<K, T\>？

### 4.1. 场景 1：枚举值映射

```typescript
enum UserRole {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest',
}

// 为每个角色定义权限
type Permissions = Record<UserRole, string[]>

const permissions: Permissions = {
  [UserRole.Admin]: ['read', 'write', 'delete', 'admin'],
  [UserRole.User]: ['read', 'write'],
  [UserRole.Guest]: ['read'],
}

// 使用
function checkPermission(role: UserRole, action: string): boolean {
  return permissions[role].includes(action)
}
```

### 4.2. 场景 2：配置对象

```typescript
type Environment = 'development' | 'staging' | 'production'

type Config = {
  apiUrl: string
  debug: boolean
  maxRetries: number
}

// 为每个环境定义配置
type EnvironmentConfig = Record<Environment, Config>

const config: EnvironmentConfig = {
  development: {
    apiUrl: 'http://localhost:3000',
    debug: true,
    maxRetries: 3,
  },
  staging: {
    apiUrl: 'https://staging.example.com',
    debug: true,
    maxRetries: 5,
  },
  production: {
    apiUrl: 'https://api.example.com',
    debug: false,
    maxRetries: 10,
  },
}

// 使用
function getConfig(env: Environment): Config {
  return config[env]
}
```

### 4.3. 场景 3：事件处理器映射

```typescript
type EventType = 'click' | 'hover' | 'focus' | 'blur'

type EventHandlers = Record<EventType, (event: Event) => void>

const handlers: EventHandlers = {
  click: (e) => console.log('Clicked', e.target),
  hover: (e) => console.log('Hovered', e.target),
  focus: (e) => console.log('Focused', e.target),
  blur: (e) => console.log('Blurred', e.target),
}

// 使用
function attachHandlers(element: HTMLElement, handlers: EventHandlers): void {
  ;(Object.keys(handlers) as EventType[]).forEach((eventType) => {
    element.addEventListener(eventType, handlers[eventType])
  })
}
```

### 4.4. 场景 4：API 端点定义

```typescript
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

type Endpoint = {
  url: string
  auth: boolean
}

type ApiEndpoints = Record<HttpMethod, Record<string, Endpoint>>

const api: ApiEndpoints = {
  GET: {
    users: { url: '/api/users', auth: true },
    posts: { url: '/api/posts', auth: false },
  },
  POST: {
    user: { url: '/api/users', auth: true },
    post: { url: '/api/posts', auth: true },
  },
  PUT: {
    user: { url: '/api/users/:id', auth: true },
    post: { url: '/api/posts/:id', auth: true },
  },
  DELETE: {
    user: { url: '/api/users/:id', auth: true },
    post: { url: '/api/posts/:id', auth: true },
  },
}
```

## 5. 🤔 Record\<K, T\> 的实际应用场景有哪些？

### 5.1. 应用 1：国际化（i18n）

```typescript
type Language = 'en' | 'zh' | 'ja' | 'es'

type TranslationKey = 'welcome' | 'goodbye' | 'hello' | 'thankyou'

type Translations = Record<Language, Record<TranslationKey, string>>

const translations: Translations = {
  en: {
    welcome: 'Welcome',
    goodbye: 'Goodbye',
    hello: 'Hello',
    thankyou: 'Thank you',
  },
  zh: {
    welcome: '欢迎',
    goodbye: '再见',
    hello: '你好',
    thankyou: '谢谢',
  },
  ja: {
    welcome: 'ようこそ',
    goodbye: 'さようなら',
    hello: 'こんにちは',
    thankyou: 'ありがとう',
  },
  es: {
    welcome: 'Bienvenido',
    goodbye: 'Adiós',
    hello: 'Hola',
    thankyou: 'Gracias',
  },
}

// 使用
function translate(lang: Language, key: TranslationKey): string {
  return translations[lang][key]
}

console.log(translate('zh', 'welcome')) // '欢迎'
```

### 5.2. 应用 2：状态机

```typescript
type State = 'idle' | 'loading' | 'success' | 'error'
type Action = 'start' | 'complete' | 'fail' | 'reset'

type StateMachine = Record<State, Partial<Record<Action, State>>>

const stateMachine: StateMachine = {
  idle: {
    start: 'loading',
  },
  loading: {
    complete: 'success',
    fail: 'error',
  },
  success: {
    reset: 'idle',
  },
  error: {
    reset: 'idle',
    start: 'loading', // 可以重试
  },
}

// 状态转换
function transition(currentState: State, action: Action): State {
  const nextState = stateMachine[currentState][action]
  return nextState ?? currentState
}

let state: State = 'idle'
state = transition(state, 'start') // 'loading'
state = transition(state, 'complete') // 'success'
state = transition(state, 'reset') // 'idle'
```

### 5.3. 应用 3：表单验证规则

```typescript
type FormField = 'username' | 'email' | 'password' | 'confirmPassword'

type ValidationRule = {
  required: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  validate?: (value: string) => boolean
  message: string
}

type FormValidation = Record<FormField, ValidationRule[]>

const validation: FormValidation = {
  username: [
    { required: true, message: 'Username is required' },
    {
      minLength: 3,
      maxLength: 20,
      message: 'Username must be 3-20 characters',
    },
    { pattern: /^[a-zA-Z0-9_]+$/, message: 'Only alphanumeric and underscore' },
  ],
  email: [
    { required: true, message: 'Email is required' },
    { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' },
  ],
  password: [
    { required: true, message: 'Password is required' },
    { minLength: 8, message: 'Password must be at least 8 characters' },
  ],
  confirmPassword: [
    { required: true, message: 'Please confirm password' },
    {
      validate: (value: string) => value === getPasswordValue(),
      message: 'Passwords do not match',
    },
  ],
}

declare function getPasswordValue(): string
```

### 5.4. 应用 4：缓存策略

```typescript
type CacheStrategy = 'memory' | 'localStorage' | 'sessionStorage' | 'indexedDB'

type CacheConfig = {
  get: <T>(key: string) => Promise<T | null>
  set: <T>(key: string, value: T) => Promise<void>
  delete: (key: string) => Promise<void>
  clear: () => Promise<void>
}

type CacheStrategies = Record<CacheStrategy, CacheConfig>

const cacheStrategies: CacheStrategies = {
  memory: {
    get: async (key) => memoryCache.get(key),
    set: async (key, value) => memoryCache.set(key, value),
    delete: async (key) => memoryCache.delete(key),
    clear: async () => memoryCache.clear(),
  },
  localStorage: {
    get: async (key) => JSON.parse(localStorage.getItem(key) || 'null'),
    set: async (key, value) => localStorage.setItem(key, JSON.stringify(value)),
    delete: async (key) => localStorage.removeItem(key),
    clear: async () => localStorage.clear(),
  },
  sessionStorage: {
    get: async (key) => JSON.parse(sessionStorage.getItem(key) || 'null'),
    set: async (key, value) =>
      sessionStorage.setItem(key, JSON.stringify(value)),
    delete: async (key) => sessionStorage.removeItem(key),
    clear: async () => sessionStorage.clear(),
  },
  indexedDB: {
    get: async (key) => indexedDBGet(key),
    set: async (key, value) => indexedDBSet(key, value),
    delete: async (key) => indexedDBDelete(key),
    clear: async () => indexedDBClear(),
  },
}

declare const memoryCache: Map<string, any>
declare function indexedDBGet(key: string): Promise<any>
declare function indexedDBSet(key: string, value: any): Promise<void>
declare function indexedDBDelete(key: string): Promise<void>
declare function indexedDBClear(): Promise<void>
```

### 5.5. 应用 5：路由配置

```typescript
type RoutePath =
  | '/'
  | '/about'
  | '/products'
  | '/product/:id'
  | '/contact'
  | '/login'
  | '/dashboard'

type RouteConfig = {
  component: string
  auth: boolean
  title: string
}

type Routes = Record<RoutePath, RouteConfig>

const routes: Routes = {
  '/': {
    component: 'Home',
    auth: false,
    title: 'Home',
  },
  '/about': {
    component: 'About',
    auth: false,
    title: 'About Us',
  },
  '/products': {
    component: 'Products',
    auth: false,
    title: 'Products',
  },
  '/product/:id': {
    component: 'ProductDetail',
    auth: false,
    title: 'Product Detail',
  },
  '/contact': {
    component: 'Contact',
    auth: false,
    title: 'Contact Us',
  },
  '/login': {
    component: 'Login',
    auth: false,
    title: 'Login',
  },
  '/dashboard': {
    component: 'Dashboard',
    auth: true,
    title: 'Dashboard',
  },
}
```

## 6. 🤔 Record 与索引签名的区别是什么？

### 6.1. 索引签名

```typescript
// 索引签名：任意字符串键
type Dictionary = {
  [key: string]: number
}

const dict: Dictionary = {
  a: 1,
  b: 2,
  c: 3,
  anything: 999, // ✅ 任意键都可以
}

// ⚠️ 类型不够精确
console.log(dict.nonexistent) // 类型是 number，但实际是 undefined
```

### 6.2. Record 类型

```typescript
// Record：精确的键
type Status = 'success' | 'error' | 'pending'
type StatusCode = Record<Status, number>

const codes: StatusCode = {
  success: 200,
  error: 500,
  pending: 102,
}

// ❌ 必须包含所有键
const incomplete: StatusCode = {
  success: 200,
  error: 500,
  // 错误：缺少 pending
}

// ❌ 不能有额外的键
const extra: StatusCode = {
  success: 200,
  error: 500,
  pending: 102,
  warning: 400, // 错误
}

// ✅ 类型安全访问
console.log(codes.success) // number
console.log(codes.nonexistent) // ❌ 编译错误
```

### 6.3. 对比总结

```typescript
// 索引签名：灵活但不精确
type FlexibleDict = {
  [key: string]: string
}

// Record：精确但严格
type PreciseDict = Record<'a' | 'b' | 'c', string>

// 使用场景
const flexible: FlexibleDict = {
  x: 'value',
  y: 'value',
  // 可以有任意多的键
}

const precise: PreciseDict = {
  a: 'value',
  b: 'value',
  c: 'value',
  // 必须恰好这三个键
}

// 选择建议：
// - 键数量未知或动态 → 使用索引签名
// - 键是固定的联合类型 → 使用 Record
```

## 7. 🤔 使用 Record\<K, T\> 需要注意什么？

### 7.1. 注意事项 1：键类型限制

```typescript
// ✅ 合法的键类型
type ValidKeys1 = Record<string, number>
type ValidKeys2 = Record<number, string>
type ValidKeys3 = Record<symbol, boolean>
type ValidKeys4 = Record<'a' | 'b' | 'c', string>

// ❌ 不合法的键类型
type InvalidKeys1 = Record<boolean, string> // 错误
type InvalidKeys2 = Record<object, string> // 错误
type InvalidKeys3 = Record<any[], string> // 错误
```

### 7.2. 注意事项 2：必须包含所有键

```typescript
type Status = 'idle' | 'loading' | 'success'
type StatusMap = Record<Status, boolean>

// ❌ 必须包含所有键
const incomplete: StatusMap = {
  idle: true,
  loading: false,
  // 错误：缺少 success
}

// ✅ 使用 Partial 让键变为可选
type PartialStatusMap = Partial<Record<Status, boolean>>

const partial: PartialStatusMap = {
  idle: true,
  loading: false,
  // ✅ success 可以省略
}
```

### 7.3. 注意事项 3：键的动态性

```typescript
type DynamicKey = string
type DynamicRecord = Record<DynamicKey, number>

// ⚠️ 这实际上等同于索引签名
const dynamic: DynamicRecord = {
  a: 1,
  b: 2,
  anything: 999, // ✅ 任意键
}

// ✅ 使用字面量联合类型获得精确性
type PreciseKey = 'a' | 'b' | 'c'
type PreciseRecord = Record<PreciseKey, number>
```

### 7.4. 注意事项 4：值类型的统一性

```typescript
type Status = 'idle' | 'loading' | 'success'

// ❌ Record 的值类型是统一的
type StatusMap = Record<Status, string>

const map: StatusMap = {
  idle: 'Ready',
  loading: 'Loading...',
  success: 200, // ❌ 错误：必须是 string
}

// ✅ 如果需要不同的值类型，使用普通对象类型
type MixedStatusMap = {
  idle: string
  loading: string
  success: number
}
```

### 7.5. 注意事项 5：与 keyof 的结合

```typescript
type User = {
  id: number
  name: string
  email: string
}

// ✅ 为每个属性创建验证器
type Validators = Record<keyof User, (value: any) => boolean>

const validators: Validators = {
  id: (value) => typeof value === 'number',
  name: (value) => typeof value === 'string' && value.length > 0,
  email: (value) => typeof value === 'string' && value.includes('@'),
}
```

### 7.6. 注意事项 6：数字键的行为

```typescript
type NumericRecord = Record<number, string>

const record: NumericRecord = {
  0: 'zero',
  1: 'one',
  2: 'two',
}

// ⚠️ 数字键会被转换为字符串
console.log(record[0]) // 'zero'
console.log(record['0']) // 'zero'

// 两种访问方式等价
type Keys = keyof NumericRecord // number
```

### 7.7. 注意事项 7：与泛型的结合

```typescript
// 创建通用的映射函数
function mapObject<K extends string, V, R>(
  obj: Record<K, V>,
  fn: (value: V, key: K) => R
): Record<K, R> {
  const result = {} as Record<K, R>
  for (const key in obj) {
    result[key] = fn(obj[key], key)
  }
  return result
}

type Status = 'idle' | 'loading' | 'success'
type StatusMessages = Record<Status, string>

const messages: StatusMessages = {
  idle: 'Ready',
  loading: 'Loading...',
  success: 'Done',
}

// 转换所有值
const upper = mapObject(messages, (value) => value.toUpperCase())
// { idle: 'READY', loading: 'LOADING...', success: 'DONE' }
```

## 8. 🔗 引用

- [TypeScript Utility Types - Record][1]
- [TypeScript Handbook - Index Signatures][2]
- [TypeScript Deep Dive - Record][3]

[1]: https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type
[2]: https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures
[3]: https://basarat.gitbook.io/typescript/type-system/index-signatures
