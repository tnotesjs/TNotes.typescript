# [0212. Extract](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0212.%20Extract)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 `Extract<T, U>` 是什么？](#3--extractt-u-是什么)
  - [3.1. 源码定义](#31-源码定义)
  - [3.2. 工作原理](#32-工作原理)
  - [3.3. 与 Exclude 的对比](#33-与-exclude-的对比)
  - [3.4. 基本示例](#34-基本示例)
- [4. 🤔 如何使用 `Extract<T, U>`？](#4--如何使用-extractt-u)
  - [4.1. 场景 1：事件处理器类型提取](#41-场景-1事件处理器类型提取)
  - [4.2. 场景 2：Redux Action 类型过滤](#42-场景-2redux-action-类型过滤)
  - [4.3. 场景 3：API 响应类型提取](#43-场景-3api-响应类型提取)
  - [4.4. 场景 4：路由参数类型提取](#44-场景-4路由参数类型提取)
- [5. 🤔 `Extract<T, U>` 的实际应用场景有哪些？](#5--extractt-u-的实际应用场景有哪些)
  - [5.1. 应用 1：表单字段类型提取](#51-应用-1表单字段类型提取)
  - [5.2. 应用 2：数据库查询结果类型](#52-应用-2数据库查询结果类型)
  - [5.3. 应用 3：WebSocket 消息类型](#53-应用-3websocket-消息类型)
  - [5.4. 应用 4：状态机类型提取](#54-应用-4状态机类型提取)
  - [5.5. 应用 5：日志级别过滤](#55-应用-5日志级别过滤)
- [6. 🤔 使用 `Extract<T, U>` 需要注意什么？](#6--使用-extractt-u-需要注意什么)
  - [6.1. 注意事项 1：类型兼容性判断](#61-注意事项-1类型兼容性判断)
  - [6.2. 注意事项 2：对象类型的提取](#62-注意事项-2对象类型的提取)
  - [6.3. 注意事项 3：never 的处理](#63-注意事项-3never-的处理)
  - [6.4. 注意事项 4：函数类型的提取](#64-注意事项-4函数类型的提取)
  - [6.5. 注意事项 5：与泛型的结合](#65-注意事项-5与泛型的结合)
  - [6.6. 注意事项 6：模板字面量类型](#66-注意事项-6模板字面量类型)
  - [6.7. 注意事项 7：分布式条件类型的限制](#67-注意事项-7分布式条件类型的限制)
- [7. 🆚 Exclude vs. Extract](#7--exclude-vs-extract)
  - [7.1. 对比表格](#71-对比表格)
  - [7.2. 互补关系](#72-互补关系)
  - [7.3. 使用场景选择](#73-使用场景选择)
  - [7.4. 性能对比](#74-性能对比)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- `Extract<T, U>` 的定义和实现原理
- 条件类型的应用
- 基本使用方法
- 实际应用场景
- `Exclude` 与 `Extract` 的对比

## 2. 🫧 评价

`Extract<T, U>` 从联合类型 `T` 中提取可以赋值给 `U` 的类型。

## 3. 🤔 `Extract<T, U>` 是什么？

`Extract<T, U>` 从联合类型 `T` 中提取可以赋值给类型 `U` 的成员。

- 与 `Exclude<T, U>` 互为相反操作
- 基于条件类型和分布式特性
- 用于联合类型的交集运算
- 常用于类型过滤和提取
- 在泛型约束中非常有用

### 3.1. 源码定义

```ts
type Extract<T, U> = T extends U ? T : never
```

### 3.2. 工作原理

```ts
// 分布式条件类型的展开过程
type Example = Extract<'a' | 'b' | 'c', 'a' | 'c'>

// 展开步骤：
// 1. 联合类型会分发到条件类型的每个成员
// 'a' extends 'a' | 'c' ? 'a' : never  → 'a'
// 'b' extends 'a' | 'c' ? 'b' : never  → never
// 'c' extends 'a' | 'c' ? 'c' : never  → 'c'

// 2. 联合 never 会被自动移除
// 'a' | never | 'c' → 'a' | 'c'

// 结果：'a' | 'c'
```

### 3.3. 与 Exclude 的对比

```ts
type Union = 'a' | 'b' | 'c'
type Target = 'a' | 'c'

// Extract：提取匹配的类型
type Extracted = Extract<Union, Target> // 'a' | 'c'

// Exclude：排除匹配的类型
type Excluded = Exclude<Union, Target> // 'b'

// 两者互补
type Both = Extracted | Excluded // 'a' | 'b' | 'c'
```

### 3.4. 基本示例

```ts
// 字符串字面量
type Colors = 'red' | 'green' | 'blue' | 'yellow'
type PrimaryColors = Extract<Colors, 'red' | 'green' | 'blue'>
// 'red' | 'green' | 'blue'

// 提取函数类型
type Mixed = string | number | (() => void) | ((x: number) => void)
type OnlyFunctions = Extract<Mixed, Function>
// (() => void) | ((x: number) => void)

// 提取特定形状的对象
type Objects =
  | { type: 'a'; value: number }
  | { type: 'b'; value: string }
  | { type: 'c' }
type WithValue = Extract<Objects, { value: any }>
// { type: 'a'; value: number; } | { type: 'b'; value: string; }
```

## 4. 🤔 如何使用 `Extract<T, U>`？

### 4.1. 场景 1：事件处理器类型提取

```ts
type EventMap = {
  click: MouseEvent
  dblclick: MouseEvent
  keydown: KeyboardEvent
  keyup: KeyboardEvent
  focus: FocusEvent
  blur: FocusEvent
}

// 提取所有鼠标事件
type MouseEventNames = Extract<keyof EventMap, `${'click' | 'dblclick'}`>
// 'click' | 'dblclick'

// 提取所有键盘事件名称
type KeyboardEventNames = Extract<keyof EventMap, `key${string}`>
// 'keydown' | 'keyup'

function addMouseListener(
  event: MouseEventNames,
  handler: (e: MouseEvent) => void
): void {
  document.addEventListener(event, handler as any)
}

// ✅ 只能监听鼠标事件
addMouseListener('click', (e) => {})
addMouseListener('dblclick', (e) => {})

// ❌ 不能监听键盘事件
addMouseListener('keydown', (e) => {}) // 错误
```

### 4.2. 场景 2：Redux Action 类型过滤

```ts
type Action =
  | { type: 'USER_LOGIN'; payload: { username: string } }
  | { type: 'USER_LOGOUT' }
  | { type: 'POST_CREATE'; payload: { title: string } }
  | { type: 'POST_DELETE'; payload: { id: number } }
  | { type: 'COMMENT_ADD'; payload: { text: string } }

// 提取所有用户相关的 action
type UserActions = Extract<Action, { type: `USER_${string}` }>
// { type: 'USER_LOGIN'; ... } | { type: 'USER_LOGOUT' }

// 提取所有带 payload 的 action
type ActionsWithPayload = Extract<Action, { payload: any }>
// 排除了 USER_LOGOUT

function handleUserAction(action: UserActions): void {
  switch (action.type) {
    case 'USER_LOGIN':
      console.log('Login:', action.payload.username)
      break
    case 'USER_LOGOUT':
      console.log('Logout')
      break
  }
}
```

### 4.3. 场景 3：API 响应类型提取

```ts
type ApiResponse<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
  | { status: 'loading' }

// 提取成功响应
type SuccessResponse<T> = Extract<ApiResponse<T>, { status: 'success' }>
// { status: 'success'; data: T; }

// 提取失败响应
type ErrorResponse = Extract<ApiResponse<any>, { status: 'error' }>
// { status: 'error'; error: string; }

function handleSuccess<T>(response: SuccessResponse<T>): T {
  return response.data
}

function handleError(response: ErrorResponse): void {
  console.error(response.error)
}

// 使用
const response: ApiResponse<{ id: number }> = {
  status: 'success',
  data: { id: 1 },
}

if (response.status === 'success') {
  handleSuccess(response)
}
```

### 4.4. 场景 4：路由参数类型提取

```ts
type Route =
  | { path: '/'; params: never }
  | { path: '/users'; params: never }
  | { path: '/users/:id'; params: { id: string } }
  | {
      path: '/posts/:postId/comments/:commentId'
      params: { postId: string; commentId: string }
    }

// 提取带参数的路由
type RoutesWithParams = Extract<Route, { params: object }>
// { path: '/users/:id'; ... } | { path: '/posts/:postId/comments/:commentId'; ... }

// 提取无参数路由
type RoutesWithoutParams = Extract<Route, { params: never }>
// { path: '/'; ... } | { path: '/users'; ... }

function navigateWithParams(route: RoutesWithParams): void {
  console.log('Navigate to:', route.path)
  console.log('Params:', route.params)
}

// ✅ 可以传入带参数的路由
navigateWithParams({
  path: '/users/:id',
  params: { id: '123' },
})

// ❌ 不能传入无参数路由
navigateWithParams({
  path: '/',
  params: never, // 错误
})
```

## 5. 🤔 `Extract<T, U>` 的实际应用场景有哪些？

### 5.1. 应用 1：表单字段类型提取

```ts
type FormField =
  | { type: 'text'; name: string; value: string }
  | { type: 'number'; name: string; value: number; min?: number; max?: number }
  | { type: 'checkbox'; name: string; value: boolean }
  | { type: 'select'; name: string; value: string; options: string[] }
  | { type: 'date'; name: string; value: Date }

// 提取需要选项的字段类型
type FieldsWithOptions = Extract<FormField, { options: any }>
// { type: 'select'; ... }

// 提取数值类型的字段
type NumericFields = Extract<FormField, { value: number }>
// { type: 'number'; ... }

// 提取有范围限制的字段
type FieldsWithRange = Extract<FormField, { min: any }>
// { type: 'number'; ... }

class FormBuilder {
  addSelectField(field: FieldsWithOptions): void {
    // 只能添加有 options 的字段
    console.log('Options:', field.options)
  }

  addNumericField(field: NumericFields): void {
    // 只能添加数值字段
    if (field.min !== undefined && field.value < field.min) {
      throw new Error('Value below minimum')
    }
  }
}

const builder = new FormBuilder()

builder.addSelectField({
  type: 'select',
  name: 'country',
  value: 'US',
  options: ['US', 'UK', 'CN'],
})

builder.addNumericField({
  type: 'number',
  name: 'age',
  value: 25,
  min: 0,
  max: 120,
})
```

### 5.2. 应用 2：数据库查询结果类型

```ts
type DbResult =
  | { type: 'single'; value: any }
  | { type: 'multiple'; values: any[] }
  | { type: 'none' }
  | { type: 'error'; message: string }

// 提取成功的结果
type SuccessResults = Extract<DbResult, { type: 'single' | 'multiple' }>
// { type: 'single'; value: any; } | { type: 'multiple'; values: any[]; }

// 提取有数据的结果
type ResultsWithData = Extract<DbResult, { value: any } | { values: any }>

class Database {
  async query<T>(sql: string): Promise<DbResult> {
    // 实现查询...
    return { type: 'single', value: {} }
  }

  extractValue<T>(result: Extract<DbResult, { value: any }>): T {
    return result.value
  }

  extractValues<T>(result: Extract<DbResult, { values: any }>): T[] {
    return result.values
  }
}

// 使用
const db = new Database()
const result = await db.query('SELECT * FROM users WHERE id = 1')

if (result.type === 'single') {
  const user = db.extractValue(result)
}
```

### 5.3. 应用 3：WebSocket 消息类型

```ts
type WebSocketMessage =
  | { type: 'connect'; clientId: string }
  | { type: 'disconnect'; clientId: string; reason: string }
  | { type: 'message'; from: string; to: string; content: string }
  | { type: 'broadcast'; content: string }
  | { type: 'ping' }
  | { type: 'pong' }

// 提取需要客户端 ID 的消息
type ClientMessages = Extract<WebSocketMessage, { clientId: string }>
// { type: 'connect'; ... } | { type: 'disconnect'; ... }

// 提取有内容的消息
type ContentMessages = Extract<WebSocketMessage, { content: string }>
// { type: 'message'; ... } | { type: 'broadcast'; ... }

// 提取心跳消息
type HeartbeatMessages = Extract<WebSocketMessage, { type: 'ping' | 'pong' }>
// { type: 'ping' } | { type: 'pong' }

class WebSocketServer {
  handleClientMessage(msg: ClientMessages): void {
    console.log('Client:', msg.clientId)
    if (msg.type === 'disconnect') {
      console.log('Reason:', msg.reason)
    }
  }

  broadcastContent(msg: ContentMessages): void {
    // 广播有内容的消息
    if (msg.type === 'message') {
      console.log(`From ${msg.from} to ${msg.to}: ${msg.content}`)
    } else {
      console.log('Broadcast:', msg.content)
    }
  }

  handleHeartbeat(msg: HeartbeatMessages): void {
    // 处理心跳
    console.log('Heartbeat:', msg.type)
  }
}
```

### 5.4. 应用 4：状态机类型提取

```ts
type State =
  | { status: 'idle' }
  | { status: 'loading'; progress: number }
  | { status: 'success'; data: any }
  | { status: 'error'; error: string }
  | { status: 'retrying'; attempt: number; maxAttempts: number }

// 提取可重试的状态
type RetryableStates = Extract<State, { attempt: any }>
// { status: 'retrying'; ... }

// 提取有数据的状态
type StatesWithData = Extract<State, { data: any } | { error: any }>
// { status: 'success'; ... } | { status: 'error'; ... }

// 提取进行中的状态
type ActiveStates = Extract<State, { status: 'loading' | 'retrying' }>
// { status: 'loading'; ... } | { status: 'retrying'; ... }

class StateMachine {
  private state: State = { status: 'idle' }

  canRetry(state: State): state is RetryableStates {
    return 'attempt' in state
  }

  showProgress(state: ActiveStates): void {
    if (state.status === 'loading') {
      console.log('Progress:', state.progress)
    } else {
      console.log(`Retry ${state.attempt}/${state.maxAttempts}`)
    }
  }

  handleCompletion(state: StatesWithData): void {
    if (state.status === 'success') {
      console.log('Data:', state.data)
    } else {
      console.error('Error:', state.error)
    }
  }
}
```

### 5.5. 应用 5：日志级别过滤

```ts
type LogEntry =
  | { level: 'debug'; message: string; timestamp: number }
  | { level: 'info'; message: string; timestamp: number }
  | { level: 'warn'; message: string; timestamp: number; stack?: string }
  | {
      level: 'error'
      message: string
      timestamp: number
      stack: string
      code: number
    }

// 提取严重日志
type SeriousLogs = Extract<LogEntry, { level: 'warn' | 'error' }>
// { level: 'warn'; ... } | { level: 'error'; ... }

// 提取有堆栈信息的日志
type LogsWithStack = Extract<LogEntry, { stack: string }>
// { level: 'error'; ... }

// 提取有错误码的日志
type LogsWithCode = Extract<LogEntry, { code: number }>
// { level: 'error'; ... }

class Logger {
  private logs: LogEntry[] = []

  filterSerious(): SeriousLogs[] {
    return this.logs.filter(
      (log): log is SeriousLogs => log.level === 'warn' || log.level === 'error'
    )
  }

  alertOnError(log: LogsWithCode): void {
    // 只处理有错误码的日志
    console.error(`Error ${log.code}: ${log.message}`)
    console.error('Stack:', log.stack)
  }

  log(entry: LogEntry): void {
    this.logs.push(entry)

    // 自动报警错误日志
    if ('code' in entry) {
      this.alertOnError(entry)
    }
  }
}

const logger = new Logger()

logger.log({
  level: 'error',
  message: 'Database connection failed',
  timestamp: Date.now(),
  stack: 'Error: ...',
  code: 500,
})
```

## 6. 🤔 使用 `Extract<T, U>` 需要注意什么？

### 6.1. 注意事项 1：类型兼容性判断

```ts
// Extract 基于 extends 判断
type Numbers = 1 | 2 | 3

// ✅ 提取字面量
type One = Extract<Numbers, 1> // 1

// ❌ 提取父类型会得到所有子类型
type All = Extract<Numbers, number> // 1 | 2 | 3

// 原因：1 extends number 为 true
```

### 6.2. 注意事项 2：对象类型的提取

```ts
type Objects =
  | { a: number }
  | { a: number; b: string }
  | { a: number; b: string; c: boolean }

// ⚠️ 结构子类型的影响
type WithB = Extract<Objects, { a: number; b: string }>
// { a: number; b: string; } | { a: number; b: string; c: boolean; }
// 因为 { a, b, c } extends { a, b }

// ✅ 精确匹配需要额外处理
type ExactlyAB = Extract<Objects, { a: number; b: string } & { c?: never }>
```

### 6.3. 注意事项 3：never 的处理

```ts
type Union = 'a' | 'b' | 'c'

// Extract 不匹配的结果是 never
type None = Extract<Union, 'd'> // never

// ⚠️ never 在联合类型中消失
type WithNever = 'a' | never // 'a'

// 检查是否为 never
type IsNever<T> = [T] extends [never] ? true : false
type Check1 = IsNever<None> // true
type Check2 = IsNever<'a'> // false
```

### 6.4. 注意事项 4：函数类型的提取

```ts
type Funcs = (() => void) | ((x: number) => void) | ((x: string) => string)

// ⚠️ 函数类型的 extends 基于参数和返回值
type VoidFuncs = Extract<Funcs, (...args: any[]) => void>
// (() => void) | ((x: number) => void)

// 提取特定签名
type NumberFunc = Extract<Funcs, (x: number) => any>
// ((x: number) => void)
```

### 6.5. 注意事项 5：与泛型的结合

```ts
// ⚠️ 泛型约束可能影响结果
function extract<T extends string, U extends string>(
  value: T,
  match: U
): Extract<T, U> {
  // 编译通过但运行时无法保证
  return value as Extract<T, U>
}

// ✅ Extract 主要用于类型层面
type StringLiterals = 'a' | 'b' | 'c'
type Extracted = Extract<StringLiterals, 'a' | 'b'>
```

### 6.6. 注意事项 6：模板字面量类型

```ts
type Events = 'onClick' | 'onFocus' | 'onBlur' | 'onKeyDown'

// ✅ 可以使用模板字面量提取
type OnEvents = Extract<Events, `on${string}`>
// 'onClick' | 'onFocus' | 'onBlur' | 'onKeyDown'

type ClickEvents = Extract<Events, `${'onClick' | 'onDblClick'}`>
// 'onClick'

// ⚠️ 但要注意匹配规则
type NoMatch = Extract<Events, 'click'> // never（不匹配）
```

### 6.7. 注意事项 7：分布式条件类型的限制

```ts
// ✅ 正常分布
type Normal = Extract<'a' | 'b', 'a'> // 'a'

// ⚠️ 数组不会分布
type Arrays = ['a'] | ['b']
type NotDistributed = Extract<Arrays, ['a']> // ['a']

// ⚠️ 元组类型
type Tuples = [1, 2] | [3, 4]
type ExtractTuple = Extract<Tuples, [1, 2]> // [1, 2]
```

## 7. 🆚 Exclude vs. Extract

### 7.1. 对比表格

| 特性          | Exclude<T, U>             | Extract<T, U>               |
| ------------- | ------------------------- | --------------------------- |
| 操作          | 排除匹配的类型            | 提取匹配的类型              |
| 条件类型实现  | `T extends U ? never : T` | `T extends U ? T : never`   |
| 结果          | T 中不属于 U 的部分       | T 和 U 的交集               |
| 使用场景      | 移除不需要的类型          | 筛选需要的类型              |
| 常见用途      | 类型过滤、排除特殊值      | 类型提取、取交集            |
| 与 never 交互 | `Exclude<T, never> = T`   | `Extract<T, never> = never` |
| 关系          | 互补                      | 互补                        |

### 7.2. 互补关系

```ts
type Union = 'a' | 'b' | 'c'
type Target = 'a' | 'b'

type Extracted = Extract<Union, Target> // 'a' | 'b'
type Excluded = Exclude<Union, Target> // 'c'

// 两者合并等于原类型
type Combined = Extracted | Excluded // 'a' | 'b' | 'c'

// 验证互补性
type IsOriginal = Combined extends Union
  ? Union extends Combined
    ? true
    : false
  : false
// true
```

### 7.3. 使用场景选择

```ts
type AllColors = 'red' | 'green' | 'blue' | 'yellow' | 'orange'
type PrimaryColors = 'red' | 'green' | 'blue'

// 场景 1：需要主要颜色 → 使用 Extract
type UsePrimary = Extract<AllColors, PrimaryColors>
// 'red' | 'green' | 'blue'

// 场景 2：需要非主要颜色 → 使用 Exclude
type UseSecondary = Exclude<AllColors, PrimaryColors>
// 'yellow' | 'orange'

// 选择指南：
// - 明确知道要什么 → Extract
// - 明确知道不要什么 → Exclude
```

### 7.4. 性能对比

```ts
type Large = 'a' | 'b' | 'c' /* ... 100个成员 */

// 如果只需要少数类型
type Few = 'a' | 'b'

// ✅ 使用 Extract 更直观
type Extracted = Extract<Large, Few> // 'a' | 'b'

// ⚠️ 使用 Exclude 需要列出大量类型
type Excluded = Exclude<Large /* 98个成员 */> // 'a' | 'b'

// 如果要排除少数类型
// ✅ 使用 Exclude 更简洁
type ExcludeTwo = Exclude<Large, 'a' | 'b'> // 其余98个

// ⚠️ 使用 Extract 需要列出大量类型
type ExtractMany = Extract<Large /* 98个成员 */>
```

## 8. 🔗 引用

- [TypeScript Utility Types - Extract][1]
- [TypeScript Handbook - Conditional Types][2]
- [TypeScript Deep Dive - Extract Type][3]

[1]: https://www.typescriptlang.org/docs/handbook/utility-types.html#extracttype-union
[2]: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
[3]: https://basarat.gitbook.io/typescript/type-system/conditional-types
