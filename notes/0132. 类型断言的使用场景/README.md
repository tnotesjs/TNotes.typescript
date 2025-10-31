# [0132. 类型断言的使用场景](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0132.%20%E7%B1%BB%E5%9E%8B%E6%96%AD%E8%A8%80%E7%9A%84%E4%BD%BF%E7%94%A8%E5%9C%BA%E6%99%AF)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 DOM 操作](#3--dom-操作)
  - [3.1. 场景 1：获取特定元素类型](#31-场景-1获取特定元素类型)
  - [3.2. 场景 2：querySelector 的类型细化](#32-场景-2queryselector-的类型细化)
  - [3.3. 场景 3：事件目标类型](#33-场景-3事件目标类型)
  - [3.4. 场景 4：自定义元素](#34-场景-4自定义元素)
- [4. 🤔 类型收窄](#4--类型收窄)
  - [4.1. 场景 1：联合类型收窄](#41-场景-1联合类型收窄)
  - [4.2. 场景 2：从宽类型到窄类型](#42-场景-2从宽类型到窄类型)
  - [4.3. 场景 3：字面量类型收窄](#43-场景-3字面量类型收窄)
- [5. 🤔 处理第三方库](#5--处理第三方库)
  - [5.1. 场景 1：修正库类型定义](#51-场景-1修正库类型定义)
  - [5.2. 场景 2：处理库的类型错误](#52-场景-2处理库的类型错误)
  - [5.3. 场景 3：兼容不同版本](#53-场景-3兼容不同版本)
- [6. 🤔 JSON 数据处理](#6--json-数据处理)
  - [6.1. 场景 1：API 响应处理](#61-场景-1api-响应处理)
  - [6.2. 场景 2：localStorage 数据](#62-场景-2localstorage-数据)
  - [6.3. 场景 3：配置文件解析](#63-场景-3配置文件解析)
- [7. 🤔 类型转换](#7--类型转换)
  - [7.1. 场景 1：数字和字符串转换](#71-场景-1数字和字符串转换)
  - [7.2. 场景 2：接口转换](#72-场景-2接口转换)
  - [7.3. 场景 3：枚举和字符串](#73-场景-3枚举和字符串)
- [8. 🤔 测试和 Mock](#8--测试和-mock)
  - [8.1. 场景 1：Mock 对象](#81-场景-1mock-对象)
  - [8.2. 场景 2：测试数据构造](#82-场景-2测试数据构造)
  - [8.3. 场景 3：Spy 和 Stub](#83-场景-3spy-和-stub)
- [9. 🤔 迁移和重构](#9--迁移和重构)
  - [9.1. 场景 1：JavaScript 到 TypeScript](#91-场景-1javascript-到-typescript)
  - [9.2. 场景 2：重构接口](#92-场景-2重构接口)
  - [9.3. 场景 3：类型演进](#93-场景-3类型演进)
- [10. 🤔 常见错误和最佳实践](#10--常见错误和最佳实践)
  - [10.1. 错误 1：过度使用断言](#101-错误-1过度使用断言)
  - [10.2. 错误 2：忽略 null/undefined](#102-错误-2忽略-nullundefined)
  - [10.3. 错误 3：掩盖类型问题](#103-错误-3掩盖类型问题)
  - [10.4. 最佳实践](#104-最佳实践)
- [11. 🔗 引用](#11--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- DOM 操作中的类型断言
- 类型收窄和细化
- 处理第三方库类型
- JSON 和 API 数据处理
- 测试场景中的断言
- 类型迁移和重构
- 最佳实践和注意事项

## 2. 🫧 评价

类型断言的使用场景是指**在实际开发中合理使用类型断言的典型情况**。

类型断言的特点：

- **告诉编译器**：开发者比编译器更了解类型
- **绕过检查**：跳过部分类型检查
- **有风险**：可能引入运行时错误
- **需谨慎**：应该是最后的手段

合理 vs 不合理的断言：

| 场景         | 合理断言     | 不合理断言   |
| ------------ | ------------ | ------------ |
| **DOM 操作** | 明确元素类型 | 假设元素存在 |
| **API 数据** | 已验证的数据 | 未验证的数据 |
| **第三方库** | 修正类型错误 | 掩盖类型问题 |
| **类型收窄** | 辅助推断     | 强制转换     |

类型断言的原则：

1. **最后手段**：优先其他方案
2. **确保正确**：断言必须准确
3. **添加验证**：配合运行时检查
4. **文档化**：说明断言原因

理解类型断言场景，能帮助你：

1. 识别合理的断言时机
2. 避免滥用类型断言
3. 编写更安全的代码
4. 提高代码可维护性

类型断言是工具而非捷径，应该谨慎使用。

## 3. 🤔 DOM 操作

### 3.1. 场景 1：获取特定元素类型

```ts
// ✅ 断言 DOM 元素类型
const canvas = document.getElementById('myCanvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d')

// ❌ 不检查 null
// const canvas = document.getElementById('myCanvas') as HTMLCanvasElement
// 如果元素不存在，会导致运行时错误

// ✅ 更安全的做法
const canvasElement = document.getElementById('myCanvas')
if (canvasElement instanceof HTMLCanvasElement) {
  const ctx = canvasElement.getContext('2d')
  // 使用 ctx
}

// ✅ 或使用非空断言（确定元素存在时）
const canvas2 = document.getElementById('myCanvas')!
if (canvas2 instanceof HTMLCanvasElement) {
  const ctx = canvas2.getContext('2d')
}
```

### 3.2. 场景 2：querySelector 的类型细化

```ts
// ✅ 细化查询结果类型
const button = document.querySelector('.submit-btn') as HTMLButtonElement
button.disabled = true

const input = document.querySelector<HTMLInputElement>('#username')
if (input) {
  input.value = 'default'
}

// ✅ 处理多种可能的元素类型
const element = document.querySelector('.target')

if (element instanceof HTMLInputElement) {
  console.log(element.value)
} else if (element instanceof HTMLButtonElement) {
  console.log(element.disabled)
}
```

### 3.3. 场景 3：事件目标类型

```ts
// ✅ 断言事件目标类型
function handleClick(event: MouseEvent) {
  const button = event.target as HTMLButtonElement
  button.disabled = true
}

// ✅ 更安全：检查类型
function handleClickSafe(event: MouseEvent) {
  const target = event.target
  if (target instanceof HTMLButtonElement) {
    target.disabled = true
  }
}

// ✅ 使用 currentTarget（更精确）
function handleSubmit(event: Event) {
  const form = event.currentTarget as HTMLFormElement
  const formData = new FormData(form)
}
```

### 3.4. 场景 4：自定义元素

```ts
// ✅ 断言自定义元素类型
interface CustomElement extends HTMLElement {
  customMethod(): void
}

const custom = document.querySelector('custom-element') as CustomElement
custom.customMethod()

// ✅ 使用类型守卫
function isCustomElement(el: Element | null): el is CustomElement {
  return el !== null && 'customMethod' in el
}

const element = document.querySelector('custom-element')
if (isCustomElement(element)) {
  element.customMethod()
}
```

## 4. 🤔 类型收窄

### 4.1. 场景 1：联合类型收窄

```ts
// ✅ 收窄联合类型
type Result =
  | { success: true; data: string }
  | { success: false; error: string }

function handle(result: Result) {
  if (result.success) {
    // result 自动收窄为 { success: true; data: string }
    console.log(result.data)
  } else {
    console.log(result.error)
  }
}

// ✅ 使用断言辅助收窄（明确知道类型时）
function handleWithAssertion(result: Result) {
  const success = result as { success: true; data: string }
  console.log(success.data) // 危险：如果 result.success 为 false
}
```

### 4.2. 场景 2：从宽类型到窄类型

```ts
// ✅ 从 unknown 收窄
function processUnknown(value: unknown) {
  // 使用断言（需要先验证）
  if (typeof value === 'string') {
    const str = value // 自动推断为 string
    console.log(str.toUpperCase())
  }

  // 或使用类型守卫
  if (isString(value)) {
    console.log(value.toUpperCase())
  }
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

// ✅ 从 any 收窄
function processAny(value: any) {
  const str = value as string // 明确断言
  console.log(str.toUpperCase())
}
```

### 4.3. 场景 3：字面量类型收窄

```ts
// ✅ 收窄到字面量类型
type Status = 'idle' | 'loading' | 'success' | 'error'

let status: string = 'idle'
const specificStatus = status as Status // 收窄

// ✅ 更好：直接声明为字面量类型
const status2: Status = 'idle'

// ✅ 使用 as const
const config = {
  status: 'idle',
} as const
// config.status 类型为 'idle' 而不是 string
```

## 5. 🤔 处理第三方库

### 5.1. 场景 1：修正库类型定义

```ts
// ✅ 第三方库类型不完整
import { OldLibraryType } from 'old-library'

interface ExtendedType extends OldLibraryType {
  newProperty: string // 实际存在但类型定义缺失
}

const data = getFromLibrary() as ExtendedType
console.log(data.newProperty)

// ✅ 更好：扩展模块声明
declare module 'old-library' {
  interface OldLibraryType {
    newProperty: string
  }
}
```

### 5.2. 场景 2：处理库的类型错误

```ts
// ✅ 库返回类型过于宽泛
import { fetchData } from 'api-library'

interface User {
  id: number
  name: string
}

// 库声明返回 any
const data = fetchData('/user') as Promise<User>

// ✅ 更好：创建包装函数
async function fetchUser(): Promise<User> {
  const data = await fetchData('/user')
  // 添加运行时验证
  if (isUser(data)) {
    return data
  }
  throw new Error('Invalid user data')
}

function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  )
}
```

### 5.3. 场景 3：兼容不同版本

```ts
// ✅ 处理 API 版本差异
interface V1Response {
  data: string
}

interface V2Response {
  result: {
    data: string
  }
}

function handleResponse(response: unknown, version: number) {
  if (version === 1) {
    const v1 = response as V1Response
    return v1.data
  } else {
    const v2 = response as V2Response
    return v2.result.data
  }
}
```

## 6. 🤔 JSON 数据处理

### 6.1. 场景 1：API 响应处理

```ts
// ✅ 处理 API 响应
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`)
  const json = await response.json()

  // 断言响应类型
  const apiResponse = json as ApiResponse<User>

  if (apiResponse.success) {
    return apiResponse.data
  }

  throw new Error(apiResponse.message || 'Failed to fetch user')
}

// ✅ 更好：添加运行时验证
async function fetchUserSafe(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`)
  const json = await response.json()

  if (!isApiResponse<User>(json, isUser)) {
    throw new Error('Invalid API response')
  }

  if (json.success) {
    return json.data
  }

  throw new Error(json.message || 'Failed to fetch user')
}

function isApiResponse<T>(
  value: unknown,
  dataValidator: (v: unknown) => v is T
): value is ApiResponse<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    typeof (value as any).success === 'boolean' &&
    'data' in value &&
    dataValidator((value as any).data)
  )
}
```

### 6.2. 场景 2：localStorage 数据

```ts
// ✅ 处理 localStorage 数据
interface Settings {
  theme: 'light' | 'dark'
  fontSize: number
}

function loadSettings(): Settings {
  const stored = localStorage.getItem('settings')
  if (!stored) {
    return getDefaultSettings()
  }

  try {
    const parsed = JSON.parse(stored) as Settings
    return parsed
  } catch {
    return getDefaultSettings()
  }
}

// ✅ 更安全：验证数据
function loadSettingsSafe(): Settings {
  const stored = localStorage.getItem('settings')
  if (!stored) {
    return getDefaultSettings()
  }

  try {
    const parsed = JSON.parse(stored)
    if (isSettings(parsed)) {
      return parsed
    }
  } catch {
    // JSON 解析失败
  }

  return getDefaultSettings()
}

function isSettings(value: unknown): value is Settings {
  return (
    typeof value === 'object' &&
    value !== null &&
    'theme' in value &&
    ['light', 'dark'].includes((value as any).theme) &&
    'fontSize' in value &&
    typeof (value as any).fontSize === 'number'
  )
}

function getDefaultSettings(): Settings {
  return {
    theme: 'light',
    fontSize: 14,
  }
}
```

### 6.3. 场景 3：配置文件解析

```ts
// ✅ 解析配置文件
interface Config {
  apiUrl: string
  timeout: number
  features: string[]
}

function loadConfig(jsonString: string): Config {
  const parsed = JSON.parse(jsonString) as Config

  // 提供默认值
  return {
    apiUrl: parsed.apiUrl || 'https://api.example.com',
    timeout: parsed.timeout || 5000,
    features: parsed.features || [],
  }
}

// ✅ 使用 Zod 验证
import { z } from 'zod'

const ConfigSchema = z.object({
  apiUrl: z.string().url(),
  timeout: z.number().positive(),
  features: z.array(z.string()),
})

function loadConfigSafe(jsonString: string): Config {
  const parsed = JSON.parse(jsonString)
  return ConfigSchema.parse(parsed)
}
```

## 7. 🤔 类型转换

### 7.1. 场景 1：数字和字符串转换

```ts
// ✅ 显式转换
const str = '123'
const num = Number(str) // 好于 str as number

const value: unknown = 456
const numValue = value as number // 需要确保 value 确实是数字

// ✅ 更安全
function toNumber(value: unknown): number {
  if (typeof value === 'number') {
    return value
  }
  if (typeof value === 'string') {
    const num = Number(value)
    if (!isNaN(num)) {
      return num
    }
  }
  throw new TypeError('Cannot convert to number')
}
```

### 7.2. 场景 2：接口转换

```ts
// ✅ 相似接口转换
interface Point2D {
  x: number
  y: number
}

interface Point3D {
  x: number
  y: number
  z: number
}

const point2D: Point2D = { x: 1, y: 2 }

// 断言到兼容类型
const point3D = { ...point2D, z: 0 } as Point3D

// ✅ 或使用类型保护的转换
function to3D(point: Point2D): Point3D {
  return {
    x: point.x,
    y: point.y,
    z: 0,
  }
}
```

### 7.3. 场景 3：枚举和字符串

```ts
// ✅ 字符串到枚举
enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

const str = 'ACTIVE'
const status = str as Status // 需要确保值有效

// ✅ 更安全的转换
function parseStatus(value: string): Status | undefined {
  if (Object.values(Status).includes(value as Status)) {
    return value as Status
  }
  return undefined
}

const safeStatus = parseStatus('ACTIVE')
if (safeStatus) {
  console.log(safeStatus)
}
```

## 8. 🤔 测试和 Mock

### 8.1. 场景 1：Mock 对象

```ts
// ✅ 创建部分 Mock
interface UserService {
  getUser(id: number): Promise<User>
  updateUser(user: User): Promise<void>
  deleteUser(id: number): Promise<void>
}

// 测试中只 mock 需要的方法
const mockService = {
  getUser: jest.fn().mockResolvedValue({ id: 1, name: 'Test' }),
} as unknown as UserService

// ✅ 更类型安全的方式
const mockService2: Partial<UserService> = {
  getUser: jest.fn().mockResolvedValue({ id: 1, name: 'Test' }),
}

function useService(service: Partial<UserService>) {
  if (service.getUser) {
    return service.getUser(1)
  }
}
```

### 8.2. 场景 2：测试数据构造

```ts
// ✅ 快速创建测试数据
interface ComplexUser {
  id: number
  name: string
  email: string
  preferences: {
    theme: string
    language: string
  }
  // ... 很多其他属性
}

function createTestUser(overrides?: Partial<ComplexUser>): ComplexUser {
  return {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    preferences: {
      theme: 'light',
      language: 'en',
    },
    ...overrides,
  } as ComplexUser
}

// 使用
const testUser = createTestUser({ name: 'Alice' })
```

### 8.3. 场景 3：Spy 和 Stub

```ts
// ✅ 类型安全的 spy
interface Logger {
  log(message: string): void
  error(message: string): void
}

const loggerSpy = {
  log: jest.fn(),
  error: jest.fn(),
} as Logger

// 使用
function doSomething(logger: Logger) {
  logger.log('Processing...')
}

doSomething(loggerSpy)
expect(loggerSpy.log).toHaveBeenCalledWith('Processing...')
```

## 9. 🤔 迁移和重构

### 9.1. 场景 1：JavaScript 到 TypeScript

```ts
// ✅ 迁移过程中的临时断言
// 原 JavaScript 代码
function oldFunction(data) {
  return data.value
}

// 迁移中：添加类型但暂时使用 any
function migrationFunction(data: any) {
  return data.value as number
}

// 最终：完整类型
interface Data {
  value: number
}

function newFunction(data: Data): number {
  return data.value
}
```

### 9.2. 场景 2：重构接口

```ts
// ✅ 重构时的兼容层
interface OldUser {
  username: string
  password: string
}

interface NewUser {
  email: string
  hashedPassword: string
}

// 过渡期：支持两种类型
function handleUser(user: OldUser | NewUser) {
  if ('username' in user) {
    // 旧类型
    const oldUser = user as OldUser
    console.log(oldUser.username)
  } else {
    // 新类型
    const newUser = user as NewUser
    console.log(newUser.email)
  }
}
```

### 9.3. 场景 3：类型演进

```ts
// ✅ API 版本演进
interface ApiV1 {
  data: string
}

interface ApiV2 {
  result: {
    data: string
    metadata: object
  }
}

type ApiResponse = ApiV1 | ApiV2

function handleResponse(response: ApiResponse) {
  if ('result' in response) {
    const v2 = response as ApiV2
    return v2.result.data
  } else {
    const v1 = response as ApiV1
    return v1.data
  }
}
```

## 10. 🤔 常见错误和最佳实践

### 10.1. 错误 1：过度使用断言

```ts
// ❌ 到处都是断言
function bad(data: unknown) {
  const user = data as User
  const id = user.id as number
  const name = user.name as string
  return { id, name }
}

// ✅ 使用类型守卫
function good(data: unknown) {
  if (isUser(data)) {
    return {
      id: data.id,
      name: data.name,
    }
  }
  throw new Error('Invalid user data')
}
```

### 10.2. 错误 2：忽略 null/undefined

```ts
// ❌ 不检查 null
const element = document.getElementById('id') as HTMLElement
element.click() // 可能是 null

// ✅ 检查存在性
const element2 = document.getElementById('id')
if (element2) {
  element2.click()
}

// ✅ 使用可选链
document.getElementById('id')?.click()
```

### 10.3. 错误 3：掩盖类型问题

```ts
// ❌ 用断言掩盖设计问题
interface Response {
  data: string // 实际是对象，但类型定义错误
}

function process(res: Response) {
  const data = res.data as unknown as { value: number }
  return data.value
}

// ✅ 修复类型定义
interface CorrectResponse<T> {
  data: T
}

function processCorrect(res: CorrectResponse<{ value: number }>) {
  return res.data.value
}
```

### 10.4. 最佳实践

```ts
// ✅ 1. 优先使用类型守卫
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  )
}

// ✅ 2. 添加运行时验证
function assertUser(value: unknown): asserts value is User {
  if (!isUser(value)) {
    throw new TypeError('Not a valid user')
  }
}

// ✅ 3. 使用泛型减少断言
function fetchData<T>(
  url: string,
  validator: (data: unknown) => data is T
): Promise<T> {
  return fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (validator(data)) {
        return data
      }
      throw new Error('Invalid data')
    })
}

// ✅ 4. 文档化断言原因
/**
 * 使用断言原因：
 * - DOM API 返回 Element | null，但我们确定元素存在
 * - 在调用前已经检查过元素存在性
 */
const button = document.getElementById('btn') as HTMLButtonElement

// ✅ 5. 创建辅助函数
function getElementByIdOrThrow<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id)
  if (!element) {
    throw new Error(`Element with id ${id} not found`)
  }
  return element as T
}

// 使用
const button = getElementByIdOrThrow<HTMLButtonElement>('btn')

// ✅ 6. 使用条件类型
type AssertType<T, U> = T extends U ? T : never

function assertType<T, U>(value: T): asserts value is AssertType<T, U> {
  // 运行时检查
}

// ✅ 7. 渐进式类型化
// 第一步：使用 unknown
function step1(data: unknown) {
  const typed = data as SomeType // 临时断言
}

// 第二步：添加验证
function step2(data: unknown) {
  if (isSomeType(data)) {
    // 现在有类型保护
  }
}

// 第三步：移除断言
function step3(data: SomeType) {
  // 参数直接是正确类型
}

// ✅ 8. 使用 branded types
type UserId = number & { __brand: 'UserId' }

function createUserId(value: number): UserId {
  if (value <= 0) {
    throw new Error('Invalid user ID')
  }
  return value as UserId
}

// ✅ 9. 配合 ESLint 规则
// .eslintrc.js
module.exports = {
  rules: {
    '@typescript-eslint/consistent-type-assertions': [
      'error',
      {
        assertionStyle: 'as',
        objectLiteralTypeAssertions: 'never',
      },
    ],
  },
}

// ✅ 10. 单元测试覆盖
describe('type assertions', () => {
  it('should handle valid data', () => {
    const data = { id: 1, name: 'Test' }
    expect(isUser(data)).toBe(true)
  })

  it('should reject invalid data', () => {
    const data = { id: 1 }
    expect(isUser(data)).toBe(false)
  })
})
```

## 11. 🔗 引用

- [TypeScript Handbook - Type Assertions][1]
- [TypeScript Deep Dive - Type Assertion][2]
- [Effective TypeScript - Item 9][3]
- [TypeScript Best Practices][4]

[1]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions
[2]: https://basarat.gitbook.io/typescript/type-system/type-assertion
[3]: https://effectivetypescript.com/
[4]: https://typescript-eslint.io/rules/consistent-type-assertions
