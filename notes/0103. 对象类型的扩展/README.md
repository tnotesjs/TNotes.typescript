# [0103. 对象类型的扩展](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0103.%20%E5%AF%B9%E8%B1%A1%E7%B1%BB%E5%9E%8B%E7%9A%84%E6%89%A9%E5%B1%95)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是对象类型扩展？](#3--什么是对象类型扩展)
- [4. 🤔 接口扩展（extends）](#4--接口扩展extends)
  - [4.1. 基本用法](#41-基本用法)
  - [4.2. 多重继承](#42-多重继承)
  - [4.3. 覆盖属性类型](#43-覆盖属性类型)
  - [4.4. 添加新属性](#44-添加新属性)
- [5. 🤔 交叉类型（&）](#5--交叉类型)
  - [5.1. 基本用法](#51-基本用法)
  - [5.2. 组合多个类型](#52-组合多个类型)
  - [5.3. 类型冲突](#53-类型冲突)
  - [5.4. 混合对象类型和原始类型](#54-混合对象类型和原始类型)
- [6. 🤔 接口扩展 vs 交叉类型](#6--接口扩展-vs-交叉类型)
  - [6.1. 语法差异](#61-语法差异)
  - [6.2. 冲突处理](#62-冲突处理)
  - [6.3. 声明合并](#63-声明合并)
  - [6.4. 性能和可读性](#64-性能和可读性)
- [7. 🤔 多重继承](#7--多重继承)
  - [7.1. 接口的多重继承](#71-接口的多重继承)
  - [7.2. 处理属性冲突](#72-处理属性冲突)
  - [7.3. 钻石问题](#73-钻石问题)
- [8. 🤔 扩展泛型类型](#8--扩展泛型类型)
  - [8.1. 泛型接口继承](#81-泛型接口继承)
  - [8.2. 保持泛型参数](#82-保持泛型参数)
  - [8.3. 添加泛型约束](#83-添加泛型约束)
- [9. 🤔 常见使用场景](#9--常见使用场景)
  - [9.1. 场景 1：API 响应类型](#91-场景-1api-响应类型)
  - [9.2. 场景 2：实体继承](#92-场景-2实体继承)
  - [9.3. 场景 3：混入（Mixin）模式](#93-场景-3混入mixin模式)
  - [9.4. 场景 4：React 组件 Props](#94-场景-4react-组件-props)
  - [9.5. 场景 5：配置对象](#95-场景-5配置对象)
  - [9.6. 场景 6：表单验证](#96-场景-6表单验证)
  - [9.7. 场景 7：事件系统](#97-场景-7事件系统)
- [10. 🤔 常见错误和最佳实践](#10--常见错误和最佳实践)
  - [10.1. 错误 1：类型冲突未处理](#101-错误-1类型冲突未处理)
  - [10.2. 错误 2：过度使用交叉类型](#102-错误-2过度使用交叉类型)
  - [10.3. 错误 3：不必要的扩展层次](#103-错误-3不必要的扩展层次)
  - [10.4. 错误 4：混淆接口扩展和交叉类型](#104-错误-4混淆接口扩展和交叉类型)
  - [10.5. 最佳实践](#105-最佳实践)
- [11. 🔗 引用](#11--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 接口扩展（extends）
- 交叉类型（Intersection Types）
- 两种扩展方式的区别
- 多重继承
- 扩展泛型类型
- 实际应用场景

## 2. 🫧 评价

对象类型扩展是 TypeScript 中**组合和复用类型**的重要机制。有两种主要方式：

1. **接口扩展（extends）**：使用 `extends` 关键字
2. **交叉类型（&）**：使用 `&` 操作符

两种方式都能实现类型的组合，但有细微差别：

| 特性         | 接口扩展                | 交叉类型          |
| ------------ | ----------------------- | ----------------- |
| **语法**     | `interface A extends B` | `type A = B & C`  |
| **冲突处理** | 编译时错误              | 创建 `never` 类型 |
| **合并**     | 自动声明合并            | 不支持声明合并    |
| **可读性**   | 更清晰的继承关系        | 更灵活的组合      |

理解对象类型扩展，能帮助你：

1. 构建清晰的类型层次结构
2. 实现代码复用和组合
3. 正确处理类型冲突
4. 设计灵活的 API

类型扩展是构建大型 TypeScript 应用的基础，掌握它能让你的代码更加模块化和可维护。

## 3. 🤔 什么是对象类型扩展？

对象类型扩展允许你**基于已有类型创建新类型**，继承原有类型的所有属性。

```ts
// ✅ 基础类型
interface Animal {
  name: string
  age: number
}

// ✅ 扩展类型
interface Dog extends Animal {
  breed: string
  bark(): void
}

const dog: Dog = {
  name: 'Buddy',
  age: 3,
  breed: 'Golden Retriever',
  bark() {
    console.log('Woof!')
  },
}
```

**关键概念**：

- **继承**：新类型包含基类型的所有属性
- **扩展**：可以添加新属性
- **覆盖**：可以收窄基类型的属性类型
- **组合**：可以组合多个类型

## 4. 🤔 接口扩展（extends）

### 4.1. 基本用法

```ts
// ✅ 单一继承
interface Person {
  name: string
  age: number
}

interface Employee extends Person {
  employeeId: number
  department: string
}

const employee: Employee = {
  name: 'Alice',
  age: 30,
  employeeId: 12345,
  department: 'Engineering',
}
```

### 4.2. 多重继承

```ts
// ✅ 接口可以继承多个接口
interface Printable {
  print(): void
}

interface Serializable {
  serialize(): string
}

interface Document extends Printable, Serializable {
  title: string
  content: string
}

const doc: Document = {
  title: 'TypeScript Guide',
  content: '...',
  print() {
    console.log(this.content)
  },
  serialize() {
    return JSON.stringify(this)
  },
}
```

### 4.3. 覆盖属性类型

```ts
// ✅ 可以收窄类型
interface Base {
  value: string | number
}

interface Derived extends Base {
  value: string // ✅ 收窄为 string
}

// ❌ 不能扩宽类型
interface Invalid extends Base {
  value: string | number | boolean // ❌ Error
}
```

### 4.4. 添加新属性

```ts
// ✅ 添加新属性和方法
interface Shape {
  color: string
}

interface Rectangle extends Shape {
  width: number
  height: number
  area(): number
}

const rect: Rectangle = {
  color: 'red',
  width: 100,
  height: 50,
  area() {
    return this.width * this.height
  },
}
```

## 5. 🤔 交叉类型（&）

### 5.1. 基本用法

```ts
// ✅ 使用 & 组合类型
type Person = {
  name: string
  age: number
}

type Contact = {
  email: string
  phone: string
}

type PersonWithContact = Person & Contact

const person: PersonWithContact = {
  name: 'Alice',
  age: 30,
  email: 'alice@example.com',
  phone: '123-456-7890',
}
```

### 5.2. 组合多个类型

```ts
// ✅ 组合任意数量的类型
type A = { a: string }
type B = { b: number }
type C = { c: boolean }

type ABC = A & B & C

const obj: ABC = {
  a: 'hello',
  b: 42,
  c: true,
}
```

### 5.3. 类型冲突

```ts
// ⚠️ 属性类型冲突会产生 never
type A = { value: string }
type B = { value: number }

type Conflict = A & B
// { value: never } - string & number = never

const obj: Conflict = {
  value: 'test' as never, // 无法赋值有效值
}
```

### 5.4. 混合对象类型和原始类型

```ts
// ✅ 交叉类型可以包含非对象类型
type StringWithLength = string & { length: number }
// 但这在实践中很少用，因为 string 已经有 length

// ✅ 实用的例子：品牌类型
type UserId = number & { readonly brand: unique symbol }
type ProductId = number & { readonly brand: unique symbol }

// 不能混用
function getUser(id: UserId) {}
function getProduct(id: ProductId) {}

const userId = 1 as UserId
const productId = 1 as ProductId

getUser(userId) // ✅
getUser(productId) // ❌ Error
```

## 6. 🤔 接口扩展 vs 交叉类型

### 6.1. 语法差异

::: code-group

```ts [接口扩展]
// 使用 extends 关键字
interface Animal {
  name: string
}

interface Dog extends Animal {
  breed: string
}
```

```ts [交叉类型]
// 使用 & 操作符
type Animal = {
  name: string
}

type Dog = Animal & {
  breed: string
}
```

:::

### 6.2. 冲突处理

::: code-group

```ts [接口扩展]
// ❌ 接口扩展：编译时立即报错
interface A {
  prop: string
}

interface B extends A {
  prop: number // ❌ Error: Interface 'B' incorrectly extends interface 'A'
}
```

```ts [交叉类型]
// ⚠️ 交叉类型：创建 never 类型
type A = {
  prop: string
}

type B = A & {
  prop: number
}

// B 的 prop 类型是 never
const obj: B = {
  prop: 'test' as never, // 无法赋值
}
```

:::

### 6.3. 声明合并

::: code-group

```ts [接口扩展]
// ✅ 接口支持声明合并
interface User {
  name: string
}

interface User {
  age: number
}

// 自动合并
const user: User = {
  name: 'Alice',
  age: 30,
}
```

```ts [交叉类型]
// ❌ 类型别名不支持声明合并
type User = {
  name: string
}

type User = {
  // ❌ Error: Duplicate identifier
  age: number
}
```

:::

### 6.4. 性能和可读性

```ts
// ✅ 接口扩展：清晰的继承关系
interface Animal {
  name: string
}

interface Dog extends Animal {
  breed: string
}

interface Puppy extends Dog {
  age: number
}

// ✅ 交叉类型：灵活的组合
type Printable = { print(): void }
type Serializable = { serialize(): string }
type LogEntry = Timestamp & Printable & Serializable
```

## 7. 🤔 多重继承

### 7.1. 接口的多重继承

```ts
// ✅ 接口可以继承多个接口
interface Flyable {
  fly(): void
  altitude: number
}

interface Swimmable {
  swim(): void
  depth: number
}

interface Duck extends Flyable, Swimmable {
  quack(): void
}

const duck: Duck = {
  altitude: 100,
  depth: 10,
  fly() {
    console.log(`Flying at ${this.altitude}m`)
  },
  swim() {
    console.log(`Swimming at ${this.depth}m depth`)
  },
  quack() {
    console.log('Quack!')
  },
}
```

### 7.2. 处理属性冲突

```ts
// ✅ 相同属性必须类型兼容
interface A {
  value: string
}

interface B {
  value: string | number
}

// ✅ 交集类型（更窄的类型）
interface C extends A, B {
  // value 的类型是 string（A 和 B 的交集）
}

const c: C = {
  value: 'hello', // ✅ 必须是 string
}
```

### 7.3. 钻石问题

```ts
// ✅ TypeScript 的钻石问题处理
interface Base {
  value: number
}

interface Left extends Base {
  left: string
}

interface Right extends Base {
  right: string
}

// ✅ 多重继承
interface Bottom extends Left, Right {
  bottom: string
}

const obj: Bottom = {
  value: 42, // Base 的属性（只有一份）
  left: 'left',
  right: 'right',
  bottom: 'bottom',
}
```

## 8. 🤔 扩展泛型类型

### 8.1. 泛型接口继承

```ts
// ✅ 继承泛型接口
interface Container<T> {
  value: T
  getValue(): T
}

interface NumberContainer extends Container<number> {
  increment(): void
}

const counter: NumberContainer = {
  value: 0,
  getValue() {
    return this.value
  },
  increment() {
    this.value++
  },
}
```

### 8.2. 保持泛型参数

```ts
// ✅ 扩展时保持泛型
interface Repository<T> {
  find(id: number): T | null
  save(entity: T): void
}

interface UserRepository<T extends User> extends Repository<T> {
  findByEmail(email: string): T | null
}

interface User {
  id: number
  email: string
}

interface Admin extends User {
  permissions: string[]
}

const adminRepo: UserRepository<Admin> = {
  find(id) {
    return null
  },
  save(entity) {},
  findByEmail(email) {
    return null
  },
}
```

### 8.3. 添加泛型约束

```ts
// ✅ 扩展时添加约束
interface Identifiable {
  id: number
}

interface Entity<T> {
  data: T
}

interface IdentifiableEntity<T extends Identifiable> extends Entity<T> {
  getId(): number
}

const userEntity: IdentifiableEntity<User> = {
  data: { id: 1, email: 'test@example.com' },
  getId() {
    return this.data.id
  },
}
```

## 9. 🤔 常见使用场景

### 9.1. 场景 1：API 响应类型

```ts
// ✅ 基础响应类型
interface BaseResponse {
  status: number
  message: string
}

// ✅ 扩展添加数据
interface DataResponse<T> extends BaseResponse {
  data: T
}

// ✅ 分页响应
interface PaginatedResponse<T> extends DataResponse<T[]> {
  page: number
  pageSize: number
  total: number
}

type UsersResponse = PaginatedResponse<User>
```

### 9.2. 场景 2：实体继承

```ts
// ✅ 基础实体
interface BaseEntity {
  id: number
  createdAt: Date
  updatedAt: Date
}

// ✅ 具体实体
interface User extends BaseEntity {
  username: string
  email: string
}

interface Post extends BaseEntity {
  title: string
  content: string
  authorId: number
}
```

### 9.3. 场景 3：混入（Mixin）模式

```ts
// ✅ 使用交叉类型实现混入
type Timestamped = {
  createdAt: Date
  updatedAt: Date
}

type Versioned = {
  version: number
}

type SoftDeletable = {
  deletedAt: Date | null
}

// ✅ 组合多个混入
type AuditedEntity = Timestamped &
  Versioned &
  SoftDeletable & {
    id: number
    name: string
  }
```

### 9.4. 场景 4：React 组件 Props

```ts
// ✅ 基础 Props
interface BaseProps {
  className?: string
  style?: React.CSSProperties
}

// ✅ 扩展组件 Props
interface ButtonProps extends BaseProps {
  text: string
  onClick: () => void
  type?: 'primary' | 'secondary'
}

interface InputProps extends BaseProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}
```

### 9.5. 场景 5：配置对象

```ts
// ✅ 基础配置
interface BaseConfig {
  host: string
  port: number
}

// ✅ 开发配置
interface DevelopmentConfig extends BaseConfig {
  debug: true
  hotReload: boolean
}

// ✅ 生产配置
interface ProductionConfig extends BaseConfig {
  debug: false
  ssl: boolean
  compression: boolean
}

type Config = DevelopmentConfig | ProductionConfig
```

### 9.6. 场景 6：表单验证

```ts
// ✅ 基础字段
interface BaseField {
  name: string
  label: string
  required?: boolean
}

// ✅ 不同类型的字段
interface TextField extends BaseField {
  type: 'text'
  minLength?: number
  maxLength?: number
  pattern?: RegExp
}

interface NumberField extends BaseField {
  type: 'number'
  min?: number
  max?: number
  step?: number
}

interface SelectField extends BaseField {
  type: 'select'
  options: Array<{ value: string; label: string }>
  multiple?: boolean
}

type FormField = TextField | NumberField | SelectField
```

### 9.7. 场景 7：事件系统

```ts
// ✅ 基础事件
interface BaseEvent {
  type: string
  timestamp: number
}

// ✅ 特定事件
interface ClickEvent extends BaseEvent {
  type: 'click'
  x: number
  y: number
  button: number
}

interface KeyboardEvent extends BaseEvent {
  type: 'keydown' | 'keyup'
  key: string
  ctrlKey: boolean
  shiftKey: boolean
}

type DOMEvent = ClickEvent | KeyboardEvent
```

## 10. 🤔 常见错误和最佳实践

### 10.1. 错误 1：类型冲突未处理

```ts
// ❌ 接口扩展时未处理冲突
interface A {
  prop: string
}

interface B extends A {
  prop: number // ❌ Error
}

// ✅ 使用收窄的类型
interface Base {
  value: string | number
}

interface Derived extends Base {
  value: string // ✅ 收窄类型
}
```

### 10.2. 错误 2：过度使用交叉类型

```ts
// ❌ 交叉类型导致不可能的类型
type Conflict = { prop: string } & { prop: number }
// prop 的类型是 never

// ✅ 使用联合类型或重新设计
type Option1 = { stringProp: string } & { numberProp: number }

type Option2 =
  | { type: 'string'; value: string }
  | { type: 'number'; value: number }
```

### 10.3. 错误 3：不必要的扩展层次

```ts
// ❌ 过深的继承层次
interface A extends B {}
interface B extends C {}
interface C extends D {}
interface D extends E {}
interface E {
  value: string
}

// ✅ 扁平化设计
interface Combined {
  value: string
  // 其他必要属性
}
```

### 10.4. 错误 4：混淆接口扩展和交叉类型

```ts
// ❌ 期望声明合并但使用了类型别名
type User = { name: string }
type User = { age: number } // ❌ Error

// ✅ 使用接口实现声明合并
interface User {
  name: string
}
interface User {
  age: number
} // ✅ 自动合并
```

### 10.5. 最佳实践

```ts
// ✅ 1. 选择合适的扩展方式
// 继承关系 -> 使用 interface extends
interface Animal {
  name: string
}
interface Dog extends Animal {
  breed: string
}

// 组合/混入 -> 使用交叉类型
type Printable = { print(): void }
type Entity = BaseEntity & Printable

// ✅ 2. 保持继承层次浅
// 最多 2-3 层
interface Base {}
interface Derived extends Base {}
interface Specific extends Derived {}

// ✅ 3. 使用描述性名称
interface UserBase {
  id: number
}
interface RegisteredUser extends UserBase {
  email: string
}
interface PremiumUser extends RegisteredUser {
  subscription: string
}

// ✅ 4. 提取公共接口
interface Identifiable {
  id: number
}

interface Timestamped {
  createdAt: Date
  updatedAt: Date
}

interface User extends Identifiable, Timestamped {
  name: string
}

// ✅ 5. 使用泛型提高复用性
interface Repository<T extends Identifiable> {
  find(id: number): T | null
  save(entity: T): void
  delete(id: number): boolean
}

// ✅ 6. 文档化继承关系
/**
 * 基础实体接口
 * 所有实体都应该实现这个接口
 */
interface BaseEntity {
  id: number
  createdAt: Date
}

/**
 * 用户实体
 * @extends BaseEntity
 */
interface User extends BaseEntity {
  username: string
}

// ✅ 7. 避免循环继承
// ❌ 不要这样做
interface A extends B {}
interface B extends A {}

// ✅ 8. 使用工具类型简化扩展
type WithTimestamp<T> = T & Timestamped

interface User {
  name: string
}
type TimestampedUser = WithTimestamp<User>

// ✅ 9. 为 API 响应创建类型层次
interface BaseResponse {
  status: number
}
interface SuccessResponse<T> extends BaseResponse {
  data: T
}
interface ErrorResponse extends BaseResponse {
  error: string
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse

// ✅ 10. 测试类型兼容性
type AssertExtends<T, U extends T> = U

// 确保 Dog 扩展了 Animal
type Test = AssertExtends<Animal, Dog>
```

## 11. 🔗 引用

- [TypeScript Handbook - Interfaces][1]
- [TypeScript Handbook - Intersection Types][2]
- [TypeScript Deep Dive - Interfaces][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/objects.html#extending-types
[2]: https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types
[3]: https://basarat.gitbook.io/typescript/type-system/interfaces
