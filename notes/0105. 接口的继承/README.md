# [0105. 接口的继承](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0105.%20%E6%8E%A5%E5%8F%A3%E7%9A%84%E7%BB%A7%E6%89%BF)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是接口继承？](#3--什么是接口继承)
- [4. 🤔 单一继承](#4--单一继承)
  - [4.1. 基本语法](#41-基本语法)
  - [4.2. 添加方法](#42-添加方法)
  - [4.3. 类型兼容性](#43-类型兼容性)
- [5. 🤔 多重继承](#5--多重继承)
  - [5.1. 继承多个接口](#51-继承多个接口)
  - [5.2. 组合功能接口](#52-组合功能接口)
  - [5.3. 属性冲突](#53-属性冲突)
- [6. 🤔 继承链](#6--继承链)
  - [6.1. 多层继承](#61-多层继承)
  - [6.2. 继承关系可视化](#62-继承关系可视化)
  - [6.3. 避免过深的继承链](#63-避免过深的继承链)
- [7. 🤔 覆盖和扩展](#7--覆盖和扩展)
  - [7.1. 类型收窄](#71-类型收窄)
  - [7.2. 添加可选属性](#72-添加可选属性)
  - [7.3. 添加新属性](#73-添加新属性)
- [8. 🤔 接口继承类](#8--接口继承类)
  - [8.1. 基本用法](#81-基本用法)
  - [8.2. 继承类的公共成员](#82-继承类的公共成员)
- [9. 🤔 常见使用场景](#9--常见使用场景)
  - [9.1. 场景 1：API 响应层次](#91-场景-1api-响应层次)
  - [9.2. 场景 2：实体继承](#92-场景-2实体继承)
  - [9.3. 场景 3：表单字段](#93-场景-3表单字段)
  - [9.4. 场景 4：事件系统](#94-场景-4事件系统)
  - [9.5. 场景 5：配置继承](#95-场景-5配置继承)
  - [9.6. 场景 6：React 组件 Props](#96-场景-6react-组件-props)
  - [9.7. 场景 7：权限系统](#97-场景-7权限系统)
- [10. 🤔 常见错误和最佳实践](#10--常见错误和最佳实践)
  - [10.1. 错误 1：类型冲突](#101-错误-1类型冲突)
  - [10.2. 错误 2：过度继承](#102-错误-2过度继承)
  - [10.3. 错误 3：违反里氏替换原则](#103-错误-3违反里氏替换原则)
  - [10.4. 错误 4：循环继承](#104-错误-4循环继承)
  - [10.5. 最佳实践](#105-最佳实践)
- [11. 🔗 引用](#11--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 接口继承的语法
- 单一继承和多重继承
- 继承链
- 属性覆盖和类型收窄
- 接口继承类
- 实际应用场景

## 2. 🫧 评价

接口继承（Interface Inheritance）使用 `extends` 关键字，允许一个接口继承另一个或多个接口的属性和方法。

接口继承的特点：

- 代码复用：避免重复定义相同属性
- 多重继承：可以同时继承多个接口
- 类型扩展：可以添加新属性或收窄类型
- 清晰层次：建立明确的类型继承关系

TypeScript 的接口继承与传统 OOP 的区别：

- 多重继承：TypeScript 接口支持多重继承，类只支持单继承
- 结构类型：基于结构而非名义，不需要显式声明继承关系
- 编译时：只在编译时存在，运行时会被擦除

理解接口继承，能帮助你：

1. 构建清晰的类型层次结构
2. 实现类型的组合和复用
3. 设计灵活的 API 接口
4. 编写可维护的大型应用

接口继承是 TypeScript 中最重要的代码复用机制之一，是构建类型系统的基础。

## 3. 🤔 什么是接口继承？

接口继承允许一个接口扩展另一个接口，继承所有属性和方法。

```ts
// ✅ 基础接口
interface Animal {
  name: string
  age: number
}

// ✅ 继承 Animal 接口
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

关键概念：

- extends 关键字：表示继承关系
- 所有属性继承：子接口包含父接口的所有属性
- 可以扩展：子接口可以添加新属性
- 类型兼容：子类型可以赋值给父类型

## 4. 🤔 单一继承

### 4.1. 基本语法

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

### 4.2. 添加方法

```ts
// ✅ 继承并添加方法
interface Shape {
  color: string
  area(): number
}

interface Circle extends Shape {
  radius: number
  circumference(): number
}

const circle: Circle = {
  color: 'red',
  radius: 10,
  area() {
    return Math.PI * this.radius  2
  },
  circumference() {
    return 2 * Math.PI * this.radius
  },
}
```

### 4.3. 类型兼容性

```ts
// ✅ 子类型可以赋值给父类型
interface Animal {
  name: string
}

interface Dog extends Animal {
  breed: string
}

const dog: Dog = {
  name: 'Buddy',
  breed: 'Golden Retriever',
}

// ✅ Dog 是 Animal 的子类型
const animal: Animal = dog // ✅ 可以赋值
```

## 5. 🤔 多重继承

### 5.1. 继承多个接口

```ts
// ✅ 同时继承多个接口
interface Printable {
  print(): void
}

interface Serializable {
  serialize(): string
}

interface Loggable {
  log(): void
}

interface Document extends Printable, Serializable, Loggable {
  title: string
  content: string
}

const doc: Document = {
  title: 'TypeScript Guide',
  content: 'Content...',
  print() {
    console.log(this.content)
  },
  serialize() {
    return JSON.stringify(this)
  },
  log() {
    console.log(`Document: ${this.title}`)
  },
}
```

### 5.2. 组合功能接口

```ts
// ✅ 组合不同的功能接口
interface Identifiable {
  id: number
}

interface Timestamped {
  createdAt: Date
  updatedAt: Date
}

interface Deletable {
  deletedAt: Date | null
  isDeleted(): boolean
}

interface User extends Identifiable, Timestamped, Deletable {
  username: string
  email: string
}

const user: User = {
  id: 1,
  username: 'alice',
  email: 'alice@example.com',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  isDeleted() {
    return this.deletedAt !== null
  },
}
```

### 5.3. 属性冲突

```ts
// ✅ 相同属性名必须类型兼容
interface A {
  value: string | number
}

interface B {
  value: string
}

// ✅ B 的 value 更窄，兼容
interface C extends A, B {
  // value 的类型是 string（取交集）
}

// ❌ 不兼容的类型会报错
interface D {
  value: boolean
}

interface E extends A, D {
  // ❌ Error: 类型不兼容
  // value: string | number & boolean = never
}
```

## 6. 🤔 继承链

### 6.1. 多层继承

```ts
// ✅ 建立继承链
interface Entity {
  id: number
}

interface NamedEntity extends Entity {
  name: string
}

interface TimestampedEntity extends NamedEntity {
  createdAt: Date
  updatedAt: Date
}

interface User extends TimestampedEntity {
  email: string
  password: string
}

const user: User = {
  id: 1,
  name: 'Alice',
  createdAt: new Date(),
  updatedAt: new Date(),
  email: 'alice@example.com',
  password: 'hashed',
}
```

### 6.2. 继承关系可视化

```ts
// ✅ 清晰的继承层次
interface Vehicle {
  wheels: number
  maxSpeed: number
}

interface MotorVehicle extends Vehicle {
  engineType: 'gas' | 'electric' | 'hybrid'
  horsepower: number
}

interface Car extends MotorVehicle {
  seats: number
  doors: number
}

interface SportsCar extends Car {
  turbo: boolean
  topSpeed: number
}

// SportsCar 包含所有父接口的属性
const ferrari: SportsCar = {
  wheels: 4, // Vehicle
  maxSpeed: 340, // Vehicle
  engineType: 'gas', // MotorVehicle
  horsepower: 800, // MotorVehicle
  seats: 2, // Car
  doors: 2, // Car
  turbo: true, // SportsCar
  topSpeed: 340, // SportsCar
}
```

### 6.3. 避免过深的继承链

```ts
// ⚠️ 过深的继承链（不推荐）
interface A extends B {}
interface B extends C {}
interface C extends D {}
interface D extends E {}
interface E extends F {}
interface F {
  value: string
}

// ✅ 使用组合代替深层继承
interface Identifiable {
  id: number
}
interface Timestamped {
  createdAt: Date
  updatedAt: Date
}
interface Deletable {
  deletedAt: Date | null
}

interface Entity extends Identifiable, Timestamped, Deletable {
  // 扁平化的组合
}
```

## 7. 🤔 覆盖和扩展

### 7.1. 类型收窄

```ts
// ✅ 可以收窄父接口的属性类型
interface Base {
  value: string | number
  status: string
}

interface Derived extends Base {
  value: string // ✅ 收窄为 string
  status: 'active' | 'inactive' // ✅ 收窄为字面量联合
}

const obj: Derived = {
  value: 'hello',
  status: 'active',
}

// ❌ 不能扩宽类型
interface Invalid extends Base {
  value: string | number | boolean // ❌ Error
}
```

### 7.2. 添加可选属性

```ts
// ✅ 将必需属性改为可选
interface Required {
  name: string
  age: number
}

interface Optional extends Required {
  name: string // 保持必需
  email?: string // 添加可选属性
}

// ⚠️ 不能将必需属性改为可选
interface Invalid extends Required {
  name?: string // ❌ Error: 'name' is required in base
}
```

### 7.3. 添加新属性

```ts
// ✅ 添加新属性和方法
interface Point {
  x: number
  y: number
}

interface Point3D extends Point {
  z: number // 添加新属性
  distanceFromOrigin(): number // 添加新方法
}

const point: Point3D = {
  x: 1,
  y: 2,
  z: 3,
  distanceFromOrigin() {
    return Math.sqrt(this.x  2 + this.y  2 + this.z  2)
  },
}
```

## 8. 🤔 接口继承类

### 8.1. 基本用法

```ts
// ✅ 接口可以继承类
class Control {
  private state: any

  constructor(state: any) {
    this.state = state
  }
}

// ✅ 接口继承类，包括私有成员
interface SelectableControl extends Control {
  select(): void
}

// ✅ 类实现该接口必须继承 Control
class Button extends Control implements SelectableControl {
  select() {
    console.log('Button selected')
  }
}

// ❌ 不继承 Control 的类无法实现接口
class TextBox implements SelectableControl {
  // ❌ Error
  select() {}
}
```

### 8.2. 继承类的公共成员

```ts
// ✅ 只继承公共成员
class Point {
  x: number
  y: number
  private id: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.id = Math.random()
  }
}

interface Point3D extends Point {
  z: number
  // 不能访问 private id
}

const point: Point3D = {
  x: 1,
  y: 2,
  z: 3,
  // id 不需要实现（私有成员）
}
```

## 9. 🤔 常见使用场景

### 9.1. 场景 1：API 响应层次

```ts
// ✅ 基础响应
interface BaseResponse {
  status: number
  message: string
  timestamp: Date
}

// ✅ 成功响应
interface SuccessResponse<T> extends BaseResponse {
  data: T
}

// ✅ 错误响应
interface ErrorResponse extends BaseResponse {
  error: {
    code: string
    details: string[]
  }
}

// ✅ 分页响应
interface PaginatedResponse<T> extends SuccessResponse<T[]> {
  pagination: {
    page: number
    pageSize: number
    total: number
  }
}
```

### 9.2. 场景 2：实体继承

```ts
// ✅ 基础实体
interface BaseEntity {
  id: number
  createdAt: Date
  updatedAt: Date
}

// ✅ 用户实体
interface User extends BaseEntity {
  username: string
  email: string
  role: 'admin' | 'user'
}

// ✅ 文章实体
interface Post extends BaseEntity {
  title: string
  content: string
  authorId: number
  published: boolean
}

// ✅ 评论实体
interface Comment extends BaseEntity {
  content: string
  postId: number
  authorId: number
}
```

### 9.3. 场景 3：表单字段

```ts
// ✅ 基础字段
interface BaseField {
  name: string
  label: string
  required: boolean
  disabled?: boolean
}

// ✅ 输入字段
interface InputField extends BaseField {
  type: 'text' | 'email' | 'password'
  placeholder?: string
  minLength?: number
  maxLength?: number
}

// ✅ 选择字段
interface SelectField extends BaseField {
  options: Array<{ value: string; label: string }>
  multiple?: boolean
}

// ✅ 数字字段
interface NumberField extends BaseField {
  min?: number
  max?: number
  step?: number
}
```

### 9.4. 场景 4：事件系统

```ts
// ✅ 基础事件
interface BaseEvent {
  type: string
  timestamp: Date
  target: HTMLElement
}

// ✅ 鼠标事件
interface MouseEvent extends BaseEvent {
  type: 'click' | 'mousedown' | 'mouseup' | 'mousemove'
  x: number
  y: number
  button: number
}

// ✅ 键盘事件
interface KeyboardEvent extends BaseEvent {
  type: 'keydown' | 'keyup' | 'keypress'
  key: string
  code: string
  ctrlKey: boolean
  shiftKey: boolean
  altKey: boolean
}

// ✅ 自定义事件
interface CustomEvent<T> extends BaseEvent {
  type: string
  detail: T
}
```

### 9.5. 场景 5：配置继承

```ts
// ✅ 基础配置
interface BaseConfig {
  host: string
  port: number
  timeout: number
}

// ✅ 数据库配置
interface DatabaseConfig extends BaseConfig {
  database: string
  username: string
  password: string
  pool: {
    min: number
    max: number
  }
}

// ✅ 缓存配置
interface CacheConfig extends BaseConfig {
  ttl: number
  maxSize: number
}

// ✅ 完整应用配置
interface AppConfig {
  database: DatabaseConfig
  cache: CacheConfig
  api: BaseConfig
}
```

### 9.6. 场景 6：React 组件 Props

```ts
// ✅ 基础 Props
interface BaseProps {
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

// ✅ 按钮 Props
interface ButtonProps extends BaseProps {
  text: string
  onClick: () => void
  type?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}

// ✅ 输入框 Props
interface InputProps extends BaseProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'email' | 'password'
}

// ✅ 卡片 Props
interface CardProps extends BaseProps {
  title: string
  subtitle?: string
  footer?: React.ReactNode
}
```

### 9.7. 场景 7：权限系统

```ts
// ✅ 基础用户
interface BaseUser {
  id: number
  username: string
  email: string
}

// ✅ 普通用户
interface RegularUser extends BaseUser {
  role: 'user'
  permissions: ['read']
}

// ✅ 管理员
interface AdminUser extends BaseUser {
  role: 'admin'
  permissions: ['read', 'write', 'delete']
  adminLevel: number
}

// ✅ 超级管理员
interface SuperAdmin extends AdminUser {
  role: 'super_admin'
  permissions: ['read', 'write', 'delete', 'manage_users', 'system_config']
  canAccessAll: boolean
}

type User = RegularUser | AdminUser | SuperAdmin
```

## 10. 🤔 常见错误和最佳实践

### 10.1. 错误 1：类型冲突

```ts
// ❌ 继承的接口有冲突属性
interface A {
  value: string
}

interface B {
  value: number
}

interface C extends A, B {
  // ❌ Error
  // value: string & number = never
}

// ✅ 确保类型兼容
interface A {
  value: string | number
}

interface B {
  value: number
}

interface C extends A, B {
  // ✅
  // value: number (取交集)
}
```

### 10.2. 错误 2：过度继承

```ts
// ❌ 不必要的继承链
interface A extends B {}
interface B extends C {}
interface C extends D {}
interface D extends E {}
interface E {
  value: string
}

// ✅ 使用组合
interface Combined {
  value: string
  // 直接定义需要的属性
}
```

### 10.3. 错误 3：违反里氏替换原则

```ts
// ❌ 子接口限制过严，无法替换父接口
interface Animal {
  eat(food: string): void
}

interface Dog extends Animal {
  eat(food: 'bone'): void // ❌ 过于严格
}

// ✅ 子接口应该能替换父接口
interface Dog extends Animal {
  eat(food: string): void // ✅ 保持兼容
  bark(): void
}
```

### 10.4. 错误 4：循环继承

```ts
// ❌ 循环继承
interface A extends B {
  // ❌ Error
  a: string
}

interface B extends A {
  // ❌ Error
  b: string
}

// ✅ 避免循环依赖
interface Base {
  common: string
}

interface A extends Base {
  a: string
}

interface B extends Base {
  b: string
}
```

### 10.5. 最佳实践

```ts
// ✅ 1. 使用描述性接口名
interface Entity {}
interface NamedEntity extends Entity {}
interface TimestampedEntity extends NamedEntity {}

// ✅ 2. 保持继承层次浅（2-3 层）
interface Base {}
interface Derived extends Base {}
interface Specific extends Derived {} // 最多 3 层

// ✅ 3. 优先使用组合而非继承
interface Identifiable {
  id: number
}
interface Timestamped {
  createdAt: Date
}
interface User extends Identifiable, Timestamped {}

// ✅ 4. 使用泛型提高复用性
interface Repository<T> {
  find(id: number): T | null
}

interface UserRepository extends Repository<User> {
  findByEmail(email: string): User | null
}

// ✅ 5. 文档化继承关系
/**
 * 用户实体
 * @extends BaseEntity - 继承基础实体属性
 */
interface User extends BaseEntity {
  username: string
}

// ✅ 6. 提取公共接口
interface HasId {
  id: number
}
interface HasTimestamps {
  createdAt: Date
  updatedAt: Date
}

// ✅ 7. 使用继承构建类型层次
interface Shape {
  area(): number
}

interface ColoredShape extends Shape {
  color: string
}

interface Circle extends ColoredShape {
  radius: number
}

// ✅ 8. 避免不必要的继承
// ❌ 不好
interface Point {
  x: number
  y: number
}
interface Point3D extends Point {
  z: number
}

// ✅ 可能更好（如果不需要类型兼容）
interface Point3D {
  x: number
  y: number
  z: number
}

// ✅ 9. 使用接口分离原则
interface Printable {
  print(): void
}
interface Serializable {
  serialize(): string
}

// 不要创建大而全的接口
interface Document extends Printable, Serializable {}

// ✅ 10. 测试类型兼容性
type AssertExtends<T, U extends T> = U

// 确保类型关系正确
type Test1 = AssertExtends<Animal, Dog> // Dog extends Animal
type Test2 = AssertExtends<BaseEntity, User> // User extends BaseEntity
```

## 11. 🔗 引用

- [TypeScript Handbook - Interfaces][1]
- [TypeScript Handbook - Extending Interfaces][2]
- [TypeScript Deep Dive - Interfaces][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/objects.html
[2]: https://www.typescriptlang.org/docs/handbook/2/objects.html#extending-types
[3]: https://basarat.gitbook.io/typescript/type-system/interfaces
