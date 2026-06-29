# [0164. Stage 2 装饰器提案](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0164.%20Stage%202%20%E8%A3%85%E9%A5%B0%E5%99%A8%E6%8F%90%E6%A1%88)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 什么是 Stage 2 装饰器提案？](#3-什么是-stage-2-装饰器提案)
- [4. Stage 2 装饰器的特点是什么？](#4-stage-2-装饰器的特点是什么)
  - [4.1. 支持元数据](#41-支持元数据)
  - [4.2. 自动类型元数据](#42-自动类型元数据)
  - [4.3. 装饰器签名](#43-装饰器签名)
- [5. Stage 2 装饰器如何使用？](#5-stage-2-装饰器如何使用)
  - [5.1. Angular 示例](#51-angular-示例)
  - [5.2. NestJS 示例](#52-nestjs-示例)
  - [5.3. TypeORM 示例](#53-typeorm-示例)
- [6. Stage 2 装饰器为什么会被替代？](#6-stage-2-装饰器为什么会被替代)
  - [6.1. 与 JavaScript 标准不一致](#61-与-javascript-标准不一致)
  - [6.2. 性能和实现复杂度](#62-性能和实现复杂度)
  - [6.3. API 设计问题](#63-api-设计问题)
  - [6.4. Stage 2 vs Stage 3 主要区别](#64-stage-2-vs-stage-3-主要区别)
  - [6.5. 实际影响](#65-实际影响)
- [7. 引用](#7-引用)

<!-- endregion:toc -->

## 1. 本节内容

- Stage 2 装饰器提案的历史背景
- Stage 2 装饰器的主要特点
- Stage 2 装饰器的使用方式
- Stage 2 装饰器被替代的原因
- Stage 2 与 Stage 3 的主要区别

## 2. 评价

Stage 2 装饰器是 TypeScript 早期实现的装饰器规范，现已被 Stage 3 提案取代。

- Stage 2 装饰器是 TypeScript 独有的实验性功能，需要启用 `experimentalDecorators`
- 支持元数据反射功能，广泛用于 Angular、NestJS 等框架
- 由于与最终标准不兼容，TypeScript 5.0 引入了 Stage 3 装饰器
- 现有项目仍在使用 Stage 2 装饰器，迁移需要谨慎规划
- 理解 Stage 2 装饰器有助于维护旧代码和理解框架实现

## 3. 什么是 Stage 2 装饰器提案？

Stage 2 装饰器是 TC39 在 2016 年提出的装饰器规范，TypeScript 基于此实现了装饰器功能。

```ts
// Stage 2 装饰器需要启用配置
// tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

```ts
// Stage 2 装饰器示例
function sealed(constructor: Function) {
  Object.seal(constructor)
  Object.seal(constructor.prototype)
}

@sealed
class Greeter {
  greeting: string

  constructor(message: string) {
    this.greeting = message
  }

  greet() {
    return `Hello, ${this.greeting}`
  }
}
```

## 4. Stage 2 装饰器的特点是什么？

Stage 2 装饰器具有以下主要特点。

### 4.1. 支持元数据

```ts
import 'reflect-metadata'

// 可以存储和读取元数据
function Component(metadata: { selector: string }) {
  return function (target: Function) {
    Reflect.defineMetadata('component', metadata, target)
  }
}

@Component({ selector: 'app-root' })
class AppComponent {
  title = 'My App'
}

const metadata = Reflect.getMetadata('component', AppComponent)
console.log(metadata) // { selector: 'app-root' }
```

### 4.2. 自动类型元数据

```ts
import 'reflect-metadata'

function Injectable() {
  return function (target: Function) {
    // 自动获取构造函数参数类型
    const paramTypes = Reflect.getMetadata('design:paramtypes', target)
    console.log('参数类型：', paramTypes)
  }
}

class Logger {}
class Database {}

@Injectable()
class UserService {
  constructor(logger: Logger, db: Database) {}
}

// 输出：参数类型：[Logger, Database]
```

### 4.3. 装饰器签名

```ts
// 类装饰器
type ClassDecorator = <TFunction extends Function>(
  target: TFunction
) => TFunction | void

// 方法装饰器
type MethodDecorator = <T>(
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
) => TypedPropertyDescriptor<T> | void

// 属性装饰器
type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void

// 参数装饰器
type ParameterDecorator = (
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number
) => void
```

## 5. Stage 2 装饰器如何使用？

Stage 2 装饰器在各类框架中广泛使用。

### 5.1. Angular 示例

```ts
import { Component, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'app-user',
  template: '<div>{{ name }}</div>',
})
export class UserComponent {
  @Input() name: string
  @Output() userClick = new EventEmitter<string>()

  onClick() {
    this.userClick.emit(this.name)
  }
}
```

### 5.2. NestJS 示例

```ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { Injectable } from '@nestjs/common'

@Injectable()
class UserService {
  findAll() {
    return ['user1', 'user2']
  }
}

@Controller('users')
class UserController {
  constructor(private userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id }
  }

  @Post()
  create(@Body() userData: any) {
    return userData
  }
}
```

### 5.3. TypeORM 示例

```ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column({ unique: true })
  email: string
}
```

## 6. Stage 2 装饰器为什么会被替代？

Stage 2 装饰器存在多个问题，导致其被 Stage 3 提案替代。

### 6.1. 与 JavaScript 标准不一致

```ts
// Stage 2 装饰器是 TypeScript 独有
// JavaScript 引擎不支持

// Stage 3 装饰器是 JavaScript 标准
// 最终会被原生支持
```

### 6.2. 性能和实现复杂度

```ts
// Stage 2 装饰器依赖运行时反射
import 'reflect-metadata'

@Injectable()
class Service {
  // 需要额外的元数据库支持
}

// Stage 3 装饰器不依赖元数据
// 更轻量，性能更好
```

### 6.3. API 设计问题

```ts
// Stage 2 装饰器 API 较复杂
function decorator(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  // 需要手动处理 descriptor
  const originalMethod = descriptor.value
  descriptor.value = function (...args: any[]) {
    return originalMethod.apply(this, args)
  }
  return descriptor
}

// Stage 3 装饰器 API 更简洁
function decorator(target: Function, context: ClassMethodDecoratorContext) {
  // 提供更清晰的上下文信息
  return function (...args: any[]) {
    return target.apply(this, args)
  }
}
```

### 6.4. Stage 2 vs Stage 3 主要区别

| 特性         | Stage 2                        | Stage 3              |
| ------------ | ------------------------------ | -------------------- |
| 标准化状态   | TypeScript 独有                | TC39 标准            |
| 启用方式     | `experimentalDecorators: true` | TypeScript 5.0+ 默认 |
| 元数据支持   | 支持（需 reflect-metadata）    | 不支持               |
| Context 参数 | 无                             | 有                   |
| 装饰器顺序   | 从下到上                       | 从下到上             |
| 框架支持     | Angular、NestJS、TypeORM       | 逐步支持中           |

### 6.5. 实际影响

```ts
// Stage 2 装饰器（旧代码）
function OldDecorator(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  console.log('Stage 2 装饰器')
  return descriptor
}

class OldExample {
  @OldDecorator
  method() {}
}

// Stage 3 装饰器（新代码）
function NewDecorator(target: Function, context: ClassMethodDecoratorContext) {
  console.log('Stage 3 装饰器')
  console.log('方法名：', context.name)
  console.log('类型：', context.kind)
  return target
}

class NewExample {
  @NewDecorator
  method() {}
}
```

## 7. 引用

- [TC39 Stage 2 Decorator Proposal][1]
- [TypeScript Decorators Documentation][2]
- [TypeScript 5.0 Release Notes][3]
- [Decorator Metadata Proposal][4]

[1]: https://github.com/tc39/proposal-decorators/tree/7fa580b40f2c19c561511ea2c978847ae0f1e742
[2]: https://www.typescriptlang.org/docs/handbook/decorators.html
[3]: https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/
[4]: https://github.com/tc39/proposal-decorator-metadata
