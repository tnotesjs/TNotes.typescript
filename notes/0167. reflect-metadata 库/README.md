# [0167. reflect-metadata 库](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0167.%20reflect-metadata%20%E5%BA%93)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是 reflect-metadata？](#3--什么是-reflect-metadata)
  - [3.1. 核心功能](#31-核心功能)
  - [3.2. 应用场景](#32-应用场景)
- [4. 🤔 如何安装和使用 reflect-metadata？](#4--如何安装和使用-reflect-metadata)
  - [4.1. 安装](#41-安装)
  - [4.2. TypeScript 配置](#42-typescript-配置)
  - [4.3. 导入方式](#43-导入方式)
  - [4.4. 基本使用](#44-基本使用)
- [5. 🤔 reflect-metadata 的核心 API 有哪些？](#5--reflect-metadata-的核心-api-有哪些)
  - [5.1. defineMetadata 和 getMetadata](#51-definemetadata-和-getmetadata)
  - [5.2. hasMetadata 和 hasOwnMetadata](#52-hasmetadata-和-hasownmetadata)
  - [5.3. getMetadataKeys 和 getOwnMetadataKeys](#53-getmetadatakeys-和-getownmetadatakeys)
  - [5.4. deleteMetadata](#54-deletemetadata)
  - [5.5. metadata 装饰器](#55-metadata-装饰器)
- [6. 🤔 如何使用元数据键管理复杂元数据？](#6--如何使用元数据键管理复杂元数据)
  - [6.1. 使用 Symbol 键](#61-使用-symbol-键)
  - [6.2. 元数据继承](#62-元数据继承)
  - [6.3. 复杂元数据管理](#63-复杂元数据管理)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- reflect-metadata 库的作用
- reflect-metadata 的安装和配置
- 核心 API 的使用方法
- 元数据的存储和读取
- 元数据的继承和删除

## 2. 🫧 评价

reflect-metadata 是支持装饰器元数据的关键库，实现了元数据反射 API。

- reflect-metadata 提供了 Reflect Metadata API 的 polyfill 实现
- 是 TypeScript 旧装饰器元数据功能的基础依赖
- Angular、NestJS 等框架依赖此库实现依赖注入
- API 设计简洁，支持对象、属性、方法级别的元数据
- 新装饰器（Stage 3）不再支持，需要等待新的元数据标准

## 3. 🤔 什么是 reflect-metadata？

reflect-metadata 是一个提供元数据反射 API 的 JavaScript 库。

### 3.1. 核心功能

```typescript
// reflect-metadata 扩展了 Reflect 对象
// 提供了以下能力：

// 1. 存储元数据
Reflect.defineMetadata(metadataKey, metadataValue, target)

// 2. 读取元数据
const value = Reflect.getMetadata(metadataKey, target)

// 3. 检查元数据
const hasMetadata = Reflect.hasMetadata(metadataKey, target)

// 4. 删除元数据
const deleted = Reflect.deleteMetadata(metadataKey, target)

// 5. 获取所有元数据键
const keys = Reflect.getMetadataKeys(target)
```

### 3.2. 应用场景

```typescript
import 'reflect-metadata'

// 1. 类型信息保存
// TypeScript 自动生成 design:type 等元数据

// 2. 框架元数据
// Angular 的 @Component、@Injectable
// NestJS 的 @Controller、@Get

// 3. 验证规则
// class-validator 的 @IsString、@MinLength

// 4. ORM 映射
// TypeORM 的 @Entity、@Column

// 5. 自定义装饰器
// 实现自己的元数据系统
```

## 4. 🤔 如何安装和使用 reflect-metadata？

reflect-metadata 的安装和配置非常简单。

### 4.1. 安装

```bash
npm install reflect-metadata
```

### 4.2. TypeScript 配置

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### 4.3. 导入方式

```typescript
// 方式一：在入口文件顶部导入一次
import 'reflect-metadata';

// 方式二：在 tsconfig.json 中配置
{
  "compilerOptions": {
    "types": ["reflect-metadata"]
  }
}

// 方式三：在 HTML 中引入（浏览器环境）
<script src="node_modules/reflect-metadata/Reflect.js"></script>
```

### 4.4. 基本使用

```typescript
import 'reflect-metadata'

// 在类上定义元数据
@Reflect.metadata('role', 'admin')
class User {
  name: string = ''
}

// 读取元数据
const role = Reflect.getMetadata('role', User)
console.log(role) // 'admin'

// 在属性上定义元数据
class Product {
  @Reflect.metadata('required', true)
  name: string = ''
}

const required = Reflect.getMetadata('required', Product.prototype, 'name')
console.log(required) // true
```

## 5. 🤔 reflect-metadata 的核心 API 有哪些？

reflect-metadata 提供了丰富的 API 来操作元数据。

### 5.1. defineMetadata 和 getMetadata

```typescript
import 'reflect-metadata'

class Example {
  method() {}
}

// 在类上定义元数据
Reflect.defineMetadata('class-meta', 'class value', Example)

// 在方法上定义元数据
Reflect.defineMetadata(
  'method-meta',
  'method value',
  Example.prototype,
  'method'
)

// 读取类的元数据
console.log(Reflect.getMetadata('class-meta', Example)) // 'class value'

// 读取方法的元数据
console.log(Reflect.getMetadata('method-meta', Example.prototype, 'method')) // 'method value'
```

### 5.2. hasMetadata 和 hasOwnMetadata

```typescript
import 'reflect-metadata'

class Parent {
  @Reflect.metadata('inherited', true)
  parentMethod() {}
}

class Child extends Parent {
  @Reflect.metadata('own', true)
  childMethod() {}
}

// hasMetadata 会查找继承链
console.log(Reflect.hasMetadata('inherited', Child.prototype, 'parentMethod')) // true

// hasOwnMetadata 只查找自身
console.log(
  Reflect.hasOwnMetadata('inherited', Child.prototype, 'parentMethod')
) // false
console.log(Reflect.hasOwnMetadata('own', Child.prototype, 'childMethod')) // true
```

### 5.3. getMetadataKeys 和 getOwnMetadataKeys

```typescript
import 'reflect-metadata'

Reflect.defineMetadata('key1', 'value1', Example)
Reflect.defineMetadata('key2', 'value2', Example)
Reflect.defineMetadata('key3', 'value3', Example)

class Example {}

// 获取所有元数据键
const keys = Reflect.getMetadataKeys(Example)
console.log(keys) // ['key1', 'key2', 'key3']

// 获取自身的元数据键（不包括继承）
const ownKeys = Reflect.getOwnMetadataKeys(Example)
console.log(ownKeys) // ['key1', 'key2', 'key3']
```

### 5.4. deleteMetadata

```typescript
import 'reflect-metadata'

class Example {}

Reflect.defineMetadata('temp', 'value', Example)
console.log(Reflect.hasMetadata('temp', Example)) // true

// 删除元数据
const deleted = Reflect.deleteMetadata('temp', Example)
console.log(deleted) // true
console.log(Reflect.hasMetadata('temp', Example)) // false
```

### 5.5. metadata 装饰器

```typescript
import 'reflect-metadata'

// Reflect.metadata 是一个装饰器工厂
@Reflect.metadata('version', '1.0')
class Service {
  @Reflect.metadata('required', true)
  @Reflect.metadata('type', 'string')
  name: string = ''

  @Reflect.metadata('async', true)
  fetchData() {
    return Promise.resolve('data')
  }
}

// 读取类的元数据
console.log(Reflect.getMetadata('version', Service)) // '1.0'

// 读取属性的元数据
console.log(Reflect.getMetadata('required', Service.prototype, 'name')) // true
console.log(Reflect.getMetadata('type', Service.prototype, 'name')) // 'string'

// 读取方法的元数据
console.log(Reflect.getMetadata('async', Service.prototype, 'fetchData')) // true
```

## 6. 🤔 如何使用元数据键管理复杂元数据？

使用 Symbol 作为元数据键可以避免命名冲突。

### 6.1. 使用 Symbol 键

```typescript
import 'reflect-metadata'

// 定义 Symbol 键
const ValidatorsKey = Symbol('validators')
const RouteKey = Symbol('route')

// 使用 Symbol 作为元数据键
function Validate(validator: Function) {
  return function (target: any, propertyKey: string) {
    const validators =
      Reflect.getMetadata(ValidatorsKey, target, propertyKey) || []
    validators.push(validator)
    Reflect.defineMetadata(ValidatorsKey, validators, target, propertyKey)
  }
}

function Route(path: string) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata(RouteKey, path, target, propertyKey)
  }
}

class UserController {
  @Route('/users')
  @Validate((value: any) => typeof value === 'string')
  @Validate((value: any) => value.length > 0)
  getUsers(query: string) {
    return []
  }
}

// 读取元数据
const validators = Reflect.getMetadata(
  ValidatorsKey,
  UserController.prototype,
  'getUsers'
)
const route = Reflect.getMetadata(
  RouteKey,
  UserController.prototype,
  'getUsers'
)

console.log('路由：', route) // '/users'
console.log('验证器数量：', validators.length) // 2
```

### 6.2. 元数据继承

```typescript
import 'reflect-metadata'

const MetaKey = Symbol('meta')

class Parent {
  @Reflect.metadata(MetaKey, 'parent')
  method() {}
}

class Child extends Parent {
  // 继承了 parent 的元数据
}

// 子类会继承父类的元数据
const parentMeta = Reflect.getMetadata(MetaKey, Parent.prototype, 'method')
const childMeta = Reflect.getMetadata(MetaKey, Child.prototype, 'method')

console.log(parentMeta) // 'parent'
console.log(childMeta) // 'parent'

// 使用 getOwnMetadata 只获取自身的元数据
const childOwnMeta = Reflect.getOwnMetadata(MetaKey, Child.prototype, 'method')
console.log(childOwnMeta) // undefined
```

### 6.3. 复杂元数据管理

```typescript
import 'reflect-metadata'

// 定义元数据管理器
class MetadataManager {
  private static keys = {
    validation: Symbol('validation'),
    route: Symbol('route'),
    permissions: Symbol('permissions'),
  }

  // 添加验证规则
  static addValidation(target: any, propertyKey: string, rule: any) {
    const rules = this.getValidations(target, propertyKey)
    rules.push(rule)
    Reflect.defineMetadata(this.keys.validation, rules, target, propertyKey)
  }

  // 获取验证规则
  static getValidations(target: any, propertyKey: string): any[] {
    return Reflect.getMetadata(this.keys.validation, target, propertyKey) || []
  }

  // 设置路由
  static setRoute(target: any, propertyKey: string, path: string) {
    Reflect.defineMetadata(this.keys.route, path, target, propertyKey)
  }

  // 获取路由
  static getRoute(target: any, propertyKey: string): string | undefined {
    return Reflect.getMetadata(this.keys.route, target, propertyKey)
  }

  // 添加权限
  static addPermission(target: any, propertyKey: string, permission: string) {
    const permissions = this.getPermissions(target, propertyKey)
    permissions.push(permission)
    Reflect.defineMetadata(
      this.keys.permissions,
      permissions,
      target,
      propertyKey
    )
  }

  // 获取权限
  static getPermissions(target: any, propertyKey: string): string[] {
    return Reflect.getMetadata(this.keys.permissions, target, propertyKey) || []
  }
}

// 使用元数据管理器
function Route(path: string) {
  return function (target: any, propertyKey: string) {
    MetadataManager.setRoute(target, propertyKey, path)
  }
}

function Permission(...permissions: string[]) {
  return function (target: any, propertyKey: string) {
    permissions.forEach((p) => {
      MetadataManager.addPermission(target, propertyKey, p)
    })
  }
}

class AdminController {
  @Route('/admin/users')
  @Permission('admin', 'user:read')
  getUsers() {
    return []
  }
}

// 读取元数据
const route = MetadataManager.getRoute(AdminController.prototype, 'getUsers')
const permissions = MetadataManager.getPermissions(
  AdminController.prototype,
  'getUsers'
)

console.log('路由：', route) // '/admin/users'
console.log('权限：', permissions) // ['admin', 'user:read']
```

## 7. 🔗 引用

- [reflect-metadata GitHub][1]
- [Reflect Metadata API][2]
- [TypeScript Decorators][3]
- [TC39 Metadata Proposal][4]

[1]: https://github.com/rbuckton/reflect-metadata
[2]: https://rbuckton.github.io/reflect-metadata/
[3]: https://www.typescriptlang.org/docs/handbook/decorators.html
[4]: https://github.com/tc39/proposal-decorator-metadata
