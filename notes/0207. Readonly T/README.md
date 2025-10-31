# [0207. Readonly T](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0207.%20Readonly%20T)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 Readonly\<T\> 是什么？](#3--readonlyt-是什么)
  - [3.1. 源码定义](#31-源码定义)
  - [3.2. 工作原理](#32-工作原理)
  - [3.3. 基本示例](#33-基本示例)
  - [3.4. readonly 关键字 vs Readonly\<T\>](#34-readonly-关键字-vs-readonlyt)
- [4. 🤔 如何使用 Readonly\<T\>？](#4--如何使用-readonlyt)
  - [4.1. 场景 1：配置对象](#41-场景-1配置对象)
  - [4.2. 场景 2：函数参数保护](#42-场景-2函数参数保护)
  - [4.3. 场景 3：常量定义](#43-场景-3常量定义)
  - [4.4. 场景 4：返回值保护](#44-场景-4返回值保护)
- [5. 🤔 Readonly\<T\> 的实际应用场景有哪些？](#5--readonlyt-的实际应用场景有哪些)
  - [5.1. 应用 1：React Props](#51-应用-1react-props)
  - [5.2. 应用 2：Redux State](#52-应用-2redux-state)
  - [5.3. 应用 3：API 响应缓存](#53-应用-3api-响应缓存)
  - [5.4. 应用 4：配置管理系统](#54-应用-4配置管理系统)
  - [5.5. 应用 5：事件对象](#55-应用-5事件对象)
- [6. 🤔 如何实现深度 Readonly？](#6--如何实现深度-readonly)
  - [6.1. 问题说明](#61-问题说明)
  - [6.2. DeepReadonly 实现](#62-deepreadonly-实现)
  - [6.3. 处理数组的 DeepReadonly](#63-处理数组的-deepreadonly)
  - [6.4. 结合 Object.freeze 实现运行时不可变](#64-结合-objectfreeze-实现运行时不可变)
- [7. 🤔 使用 Readonly\<T\> 需要注意什么？](#7--使用-readonlyt-需要注意什么)
  - [7.1. 注意事项 1：只是编译时约束](#71-注意事项-1只是编译时约束)
  - [7.2. 注意事项 2：浅层只读](#72-注意事项-2浅层只读)
  - [7.3. 注意事项 3：与可选属性的交互](#73-注意事项-3与可选属性的交互)
  - [7.4. 注意事项 4：数组的特殊性](#74-注意事项-4数组的特殊性)
  - [7.5. 注意事项 5：函数参数的协变](#75-注意事项-5函数参数的协变)
  - [7.6. 注意事项 6：类型兼容性](#76-注意事项-6类型兼容性)
  - [7.7. 注意事项 7：与其他工具类型的组合](#77-注意事项-7与其他工具类型的组合)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- `Readonly<T>` 的定义和实现原理
- 基本使用方法
- 实际应用场景
- 深度 Readonly 实现
- 使用注意事项

## 2. 🫧 评价

`Readonly<T>` 将类型的所有属性变为只读，防止在编译时被修改。

- 提供编译时的不可变性保证
- 适用于配置对象、常量定义等场景
- 只影响第一层属性，嵌套对象需要深度实现
- 只是编译时约束，运行时仍然可以修改（需要借助 `Object.freeze`）
- 常与 `as const` 断言配合使用

## 3. 🤔 Readonly\<T\> 是什么？

`Readonly<T>` 将类型 `T` 的所有属性变为只读属性。

### 3.1. 源码定义

```typescript
// TypeScript lib.es5.d.ts 中的定义
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}
```

### 3.2. 工作原理

```typescript
type User = {
  id: number
  name: string
  email: string
}

// Readonly<User> 的展开过程：
// 1. keyof User = 'id' | 'name' | 'email'
// 2. readonly [P in 'id' | 'name' | 'email']: User[P]
// 3. 结果：
type ReadonlyUser = Readonly<User>
// {
//   readonly id: number;
//   readonly name: string;
//   readonly email: string;
// }
```

### 3.3. 基本示例

```typescript
type Config = {
  host: string
  port: number
  timeout: number
}

type ReadonlyConfig = Readonly<Config>

const config: ReadonlyConfig = {
  host: 'localhost',
  port: 3000,
  timeout: 5000,
}

// ❌ 所有属性都不能修改
config.host = '0.0.0.0' // 错误
config.port = 8080 // 错误
config.timeout = 10000 // 错误
```

### 3.4. readonly 关键字 vs Readonly\<T\>

```typescript
// 方式 1：手动添加 readonly
type User1 = {
  readonly id: number
  readonly name: string
  readonly email: string
}

// 方式 2：使用 Readonly<T>
type User2 = Readonly<{
  id: number
  name: string
  email: string
}>

// User1 和 User2 等价
```

## 4. 🤔 如何使用 Readonly\<T\>？

### 4.1. 场景 1：配置对象

```typescript
type AppConfig = {
  apiUrl: string
  timeout: number
  retries: number
  enableLogging: boolean
}

// 配置在初始化后不应该被修改
const config: Readonly<AppConfig> = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3,
  enableLogging: true,
}

// ❌ 不能修改配置
config.timeout = 10000 // 错误

// ✅ 如果需要修改，创建新对象
const newConfig: AppConfig = {
  ...config,
  timeout: 10000,
}
```

### 4.2. 场景 2：函数参数保护

```typescript
type User = {
  id: number
  name: string
  email: string
}

// 防止函数内部修改参数
function displayUser(user: Readonly<User>): void {
  console.log(`${user.name} (${user.email})`)

  // ❌ 不能修改参数
  user.name = 'Modified' // 错误
}

// ✅ 可以传入普通对象
const user: User = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
}

displayUser(user)
// user 对象不会被修改
```

### 4.3. 场景 3：常量定义

```typescript
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

type HttpConfig = {
  methods: HttpMethod[]
  headers: Record<string, string>
  baseUrl: string
}

// 定义常量配置
const HTTP_CONFIG: Readonly<HttpConfig> = {
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  baseUrl: 'https://api.example.com',
}

// ❌ 不能修改
HTTP_CONFIG.baseUrl = 'https://other.com' // 错误

// ⚠️ 但嵌套对象仍然可以修改
HTTP_CONFIG.methods.push('OPTIONS') // ✅ 编译通过（浅层只读）
HTTP_CONFIG.headers['Authorization'] = 'Bearer token' // ✅ 编译通过
```

### 4.4. 场景 4：返回值保护

```typescript
type State = {
  count: number
  user: { id: number; name: string }
}

class Store {
  private state: State = {
    count: 0,
    user: { id: 1, name: 'Alice' },
  }

  // 返回只读状态，防止外部修改
  getState(): Readonly<State> {
    return this.state
  }

  // 提供修改方法
  increment(): void {
    this.state.count++
  }

  updateUser(user: { id: number; name: string }): void {
    this.state.user = user
  }
}

const store = new Store()
const state = store.getState()

// ❌ 不能直接修改状态
state.count = 10 // 错误

// ✅ 必须通过方法修改
store.increment()
```

## 5. 🤔 Readonly\<T\> 的实际应用场景有哪些？

### 5.1. 应用 1：React Props

```typescript
type ButtonProps = {
  text: string
  onClick: () => void
  variant: 'primary' | 'secondary'
  disabled: boolean
}

// Props 不应该在组件内被修改
function Button(props: Readonly<ButtonProps>): JSX.Element {
  // ❌ 不能修改 props
  // props.text = 'Modified'; // 错误

  return (
    <button onClick={props.onClick} disabled={props.disabled}>
      {props.text}
    </button>
  )
}
```

### 5.2. 应用 2：Redux State

```typescript
type TodoItem = {
  id: number
  text: string
  completed: boolean
}

type TodoState = {
  todos: TodoItem[]
  filter: 'all' | 'active' | 'completed'
}

// State 应该是不可变的
type ReadonlyState = Readonly<TodoState>

function todoReducer(
  state: ReadonlyState,
  action: { type: string; payload: any }
): ReadonlyState {
  switch (action.type) {
    case 'ADD_TODO':
      // ✅ 返回新对象
      return {
        ...state,
        todos: [...state.todos, action.payload],
      }

    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      }

    default:
      return state
  }
}
```

### 5.3. 应用 3：API 响应缓存

```typescript
type ApiResponse<T> = {
  data: T
  timestamp: number
  cacheKey: string
}

class ApiCache {
  private cache = new Map<string, Readonly<ApiResponse<any>>>()

  set<T>(key: string, data: T): void {
    const response: Readonly<ApiResponse<T>> = {
      data,
      timestamp: Date.now(),
      cacheKey: key,
    }
    this.cache.set(key, response)
  }

  get<T>(key: string): Readonly<ApiResponse<T>> | undefined {
    return this.cache.get(key)
  }
}

const cache = new ApiCache()
cache.set('users', [{ id: 1, name: 'Alice' }])

const cached = cache.get('users')
if (cached) {
  // ❌ 不能修改缓存数据
  // cached.data = []; // 错误
  // cached.timestamp = 0; // 错误
}
```

### 5.4. 应用 4：配置管理系统

```typescript
type DatabaseConfig = {
  host: string
  port: number
  username: string
  password: string
  database: string
  pool: {
    min: number
    max: number
  }
}

class ConfigManager {
  private config: Readonly<DatabaseConfig>

  constructor(config: DatabaseConfig) {
    // 冻结配置对象
    this.config = Object.freeze(config) as Readonly<DatabaseConfig>
  }

  getConfig(): Readonly<DatabaseConfig> {
    return this.config
  }

  // 不提供直接修改方法，只能重新初始化
  reload(newConfig: DatabaseConfig): void {
    this.config = Object.freeze(newConfig) as Readonly<DatabaseConfig>
  }
}

const manager = new ConfigManager({
  host: 'localhost',
  port: 5432,
  username: 'admin',
  password: 'secret',
  database: 'mydb',
  pool: { min: 5, max: 20 },
})

const config = manager.getConfig()
// ❌ 不能修改
// config.port = 3306; // 错误
```

### 5.5. 应用 5：事件对象

```typescript
type MouseEvent = {
  x: number
  y: number
  button: 'left' | 'right' | 'middle'
  timestamp: number
}

// 事件对象不应该被监听器修改
type ReadonlyMouseEvent = Readonly<MouseEvent>

class EventEmitter {
  private listeners: Array<(event: ReadonlyMouseEvent) => void> = []

  on(listener: (event: ReadonlyMouseEvent) => void): void {
    this.listeners.push(listener)
  }

  emit(event: MouseEvent): void {
    const readonlyEvent: ReadonlyMouseEvent = event
    this.listeners.forEach((listener) => listener(readonlyEvent))
  }
}

const emitter = new EventEmitter()

emitter.on((event) => {
  console.log(`Click at (${event.x}, ${event.y})`)
  // ❌ 不能修改事件对象
  // event.x = 0; // 错误
})
```

## 6. 🤔 如何实现深度 Readonly？

### 6.1. 问题说明

```typescript
type Config = {
  server: {
    host: string
    port: number
  }
  database: {
    url: string
  }
}

type ReadonlyConfig = Readonly<Config>
// {
//   readonly server: {   // ✅ server 只读
//     host: string;      // ❌ 但 host 可以修改
//     port: number;
//   };
//   readonly database: {
//     url: string;
//   };
// }

const config: ReadonlyConfig = {
  server: { host: 'localhost', port: 3000 },
  database: { url: 'mongodb://localhost' },
}

// ❌ 不能重新赋值 server
config.server = { host: '0.0.0.0', port: 8080 } // 错误

// ⚠️ 但可以修改 server 的属性
config.server.host = '0.0.0.0' // ✅ 编译通过
config.server.port = 8080 // ✅ 编译通过
```

### 6.2. DeepReadonly 实现

```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends Function
    ? T[P]
    : T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P]
}

type DeepReadonlyConfig = DeepReadonly<Config>
// {
//   readonly server: {
//     readonly host: string;
//     readonly port: number;
//   };
//   readonly database: {
//     readonly url: string;
//   };
// }

const config2: DeepReadonlyConfig = {
  server: { host: 'localhost', port: 3000 },
  database: { url: 'mongodb://localhost' },
}

// ❌ 所有层级都不能修改
config2.server = {} as any // 错误
config2.server.host = '0.0.0.0' // 错误
config2.server.port = 8080 // 错误
config2.database.url = 'other' // 错误
```

### 6.3. 处理数组的 DeepReadonly

```typescript
type DeepReadonlyWithArray<T> = T extends Array<infer U>
  ? ReadonlyArray<DeepReadonlyWithArray<U>>
  : T extends Function
  ? T
  : T extends object
  ? { readonly [P in keyof T]: DeepReadonlyWithArray<T[P]> }
  : T

type State = {
  users: Array<{ id: number; name: string }>
  settings: {
    theme: string
    notifications: boolean
  }
}

type DeepReadonlyState = DeepReadonlyWithArray<State>
// {
//   readonly users: ReadonlyArray<{
//     readonly id: number;
//     readonly name: string;
//   }>;
//   readonly settings: {
//     readonly theme: string;
//     readonly notifications: boolean;
//   };
// }

const state: DeepReadonlyState = {
  users: [{ id: 1, name: 'Alice' }],
  settings: { theme: 'dark', notifications: true },
}

// ❌ 数组方法也被禁用
state.users.push({ id: 2, name: 'Bob' }) // 错误
state.users[0].name = 'Bob' // 错误
```

### 6.4. 结合 Object.freeze 实现运行时不可变

```typescript
function deepFreeze<T extends object>(obj: T): DeepReadonly<T> {
  Object.freeze(obj)

  Object.keys(obj).forEach((key) => {
    const value = (obj as any)[key]
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      deepFreeze(value)
    }
  })

  return obj as DeepReadonly<T>
}

const config = {
  server: {
    host: 'localhost',
    port: 3000,
  },
  database: {
    url: 'mongodb://localhost',
  },
}

const frozenConfig = deepFreeze(config)

// ❌ 运行时也会报错
try {
  ;(frozenConfig as any).server.host = '0.0.0.0'
} catch (error) {
  console.error('Cannot modify frozen object')
}
```

## 7. 🤔 使用 Readonly\<T\> 需要注意什么？

### 7.1. 注意事项 1：只是编译时约束

```typescript
type User = {
  id: number
  name: string
}

const user: Readonly<User> = {
  id: 1,
  name: 'Alice',
}

// ❌ 编译错误
user.name = 'Bob' // 错误

// ⚠️ 但运行时可以修改（使用类型断言）
;(user as any).name = 'Bob' // ✅ 运行时成功

// ✅ 使用 Object.freeze 实现运行时不可变
const frozenUser = Object.freeze(user)
frozenUser.name = 'Bob' // 运行时报错（严格模式）
```

### 7.2. 注意事项 2：浅层只读

```typescript
type State = {
  user: {
    id: number
    name: string
  }
  settings: {
    theme: string
  }
}

const state: Readonly<State> = {
  user: { id: 1, name: 'Alice' },
  settings: { theme: 'dark' },
}

// ❌ 不能重新赋值
state.user = { id: 2, name: 'Bob' } // 错误

// ⚠️ 但可以修改嵌套属性
state.user.name = 'Bob' // ✅ 编译通过
state.settings.theme = 'light' // ✅ 编译通过
```

### 7.3. 注意事项 3：与可选属性的交互

```typescript
type User = {
  id: number
  name?: string
}

type ReadonlyUser = Readonly<User>
// { readonly id: number; readonly name?: string; }

const user: ReadonlyUser = { id: 1 }

// ❌ 不能赋值
user.name = 'Alice' // 错误

// ⚠️ 但 undefined 仍然有效
const user2: ReadonlyUser = { id: 1, name: undefined }
```

### 7.4. 注意事项 4：数组的特殊性

```typescript
type State = {
  items: number[]
}

type ReadonlyState = Readonly<State>
// { readonly items: number[]; }

const state: ReadonlyState = {
  items: [1, 2, 3],
}

// ❌ 不能重新赋值数组
state.items = [4, 5, 6] // 错误

// ⚠️ 但可以修改数组内容
state.items.push(4) // ✅ 编译通过
state.items[0] = 10 // ✅ 编译通过

// ✅ 使用 ReadonlyArray
type TrulyReadonlyState = {
  readonly items: ReadonlyArray<number>
}

const state2: TrulyReadonlyState = {
  items: [1, 2, 3],
}

state2.items.push(4) // ❌ 错误
state2.items[0] = 10 // ❌ 错误
```

### 7.5. 注意事项 5：函数参数的协变

```typescript
type User = {
  id: number
  name: string
}

function processUser(user: User): void {
  user.name = 'Modified'
}

const readonlyUser: Readonly<User> = {
  id: 1,
  name: 'Alice',
}

// ⚠️ 可以传递 Readonly<User> 给 User 参数
processUser(readonlyUser) // ✅ 编译通过

// 但函数内部可能修改对象
console.log(readonlyUser.name) // 可能已被修改
```

### 7.6. 注意事项 6：类型兼容性

```typescript
type User = {
  id: number
  name: string
}

type ReadonlyUser = Readonly<User>

// ✅ Readonly<User> 可以赋值给 User（协变）
const user: User = { id: 1, name: 'Alice' }
const readonlyUser: ReadonlyUser = user

// ❌ 但反过来可能不安全
const user2: User = readonlyUser // ✅ 编译通过
user2.name = 'Bob' // ⚠️ 修改了只读对象
```

### 7.7. 注意事项 7：与其他工具类型的组合

```typescript
type User = {
  id: number
  name: string
  email: string
}

// 只读 + 部分
type ReadonlyPartial = Readonly<Partial<User>>
// { readonly id?: number; readonly name?: string; readonly email?: string; }

// 只读 + 选择
type ReadonlyPick = Readonly<Pick<User, 'id' | 'name'>>
// { readonly id: number; readonly name: string; }

// 部分只读（选择性只读）
type PartialReadonly<T, K extends keyof T> = Readonly<Pick<T, K>> & Omit<T, K>

type UserWithReadonlyId = PartialReadonly<User, 'id'>
// { readonly id: number; name: string; email: string; }
```

## 8. 🔗 引用

- [TypeScript Utility Types - Readonly][1]
- [TypeScript Handbook - Readonly Properties][2]
- [MDN - Object.freeze()][3]

[1]: https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype
[2]: https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties
[3]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
