# [0159. 属性装饰器](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0159.%20%E5%B1%9E%E6%80%A7%E8%A3%85%E9%A5%B0%E5%99%A8)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是属性装饰器？](#3--什么是属性装饰器)
- [4. 🤔 属性装饰器的基本语法是什么？](#4--属性装饰器的基本语法是什么)
  - [4.1. 参数说明](#41-参数说明)
  - [4.2. target 参数说明](#42-target-参数说明)
- [5. 🤔 属性装饰器如何工作？](#5--属性装饰器如何工作)
  - [5.1. 存储元数据](#51-存储元数据)
  - [5.2. 标记属性](#52-标记属性)
  - [5.3. 修改属性描述符](#53-修改属性描述符)
- [6. 🤔 属性装饰器有哪些实际应用场景？](#6--属性装饰器有哪些实际应用场景)
  - [6.1. 属性验证](#61-属性验证)
  - [6.2. ORM 列定义](#62-orm-列定义)
  - [6.3. 依赖注入](#63-依赖注入)
  - [6.4. 属性转换](#64-属性转换)
- [7. 🤔 使用属性装饰器时需要注意什么？](#7--使用属性装饰器时需要注意什么)
  - [7.1. 不能直接修改属性值](#71-不能直接修改属性值)
  - [7.2. 不能返回值](#72-不能返回值)
  - [7.3. 执行时机](#73-执行时机)
  - [7.4. 与访问器装饰器的选择](#74-与访问器装饰器的选择)
  - [7.5. 静态属性装饰器](#75-静态属性装饰器)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 属性装饰器的定义和本质
- 属性装饰器的基本语法
- 属性装饰器的参数说明
- 属性装饰器的工作原理
- 属性装饰器的实际应用场景
- 属性装饰器的使用注意事项

## 2. 🫧 评价

属性装饰器应用于类的属性声明，用于观察属性定义或存储元数据，但不能直接修改属性行为。

- 属性装饰器不能修改属性的值或行为，只能观察属性的存在
- 主要用于配合元数据反射 API 存储类型信息
- 常用于依赖注入、ORM 框架、验证库等场景
- 属性装饰器不接收属性描述符参数，也不能返回值
- 要修改属性行为应该使用访问器装饰器或在构造函数中处理

## 3. 🤔 什么是属性装饰器？

属性装饰器是应用在类属性声明上的函数，用于观察属性定义。

```typescript
// 属性装饰器的本质
function logProperty(target: any, propertyKey: string) {
  console.log('装饰的类：', target.constructor.name)
  console.log('属性名：', propertyKey)
}

class User {
  @logProperty
  name: string = ''

  @logProperty
  age: number = 0
}

// 输出：
// 装饰的类：User
// 属性名：name
// 装饰的类：User
// 属性名：age
```

## 4. 🤔 属性装饰器的基本语法是什么？

属性装饰器只接收两个参数，不接收属性描述符。

### 4.1. 参数说明

```typescript
// 属性装饰器的完整参数
function propertyDecorator(
  target: any, // 静态属性是类的构造函数，实例属性是类的原型对象
  propertyKey: string | symbol // 属性的名称
): void {
  // 装饰器逻辑
  // 注意：不能返回值
}

class Example {
  // 实例属性
  @propertyDecorator
  instanceProp: string = ''

  // 静态属性
  @propertyDecorator
  static staticProp: number = 0
}
```

### 4.2. target 参数说明

```typescript
// target 参数的不同情况
function logTarget(target: any, propertyKey: string) {
  if (typeof target === 'function') {
    console.log(`${propertyKey} 是静态属性`)
    console.log('target 是构造函数：', target.name)
  } else {
    console.log(`${propertyKey} 是实例属性`)
    console.log('target 是原型对象：', target.constructor.name)
  }
}

class User {
  @logTarget
  name: string = '' // 实例属性

  @logTarget
  static version: string = '1.0' // 静态属性
}

// 输出：
// name 是实例属性
// target 是原型对象：User
// version 是静态属性
// target 是构造函数：User
```

## 5. 🤔 属性装饰器如何工作？

属性装饰器不能直接修改属性，但可以通过元数据或其他方式间接影响属性行为。

### 5.1. 存储元数据

```typescript
// 使用 WeakMap 存储元数据
const metadataStorage = new WeakMap<any, Map<string, any>>()

function metadata(key: string, value: any) {
  return function (target: any, propertyKey: string) {
    // 获取或创建目标的元数据存储
    if (!metadataStorage.has(target)) {
      metadataStorage.set(target, new Map())
    }

    const targetMetadata = metadataStorage.get(target)!

    // 存储属性的元数据
    if (!targetMetadata.has(propertyKey)) {
      targetMetadata.set(propertyKey, {})
    }

    const propMetadata = targetMetadata.get(propertyKey)!
    propMetadata[key] = value
  }
}

class User {
  @metadata('type', 'string')
  @metadata('required', true)
  name: string = ''

  @metadata('type', 'number')
  @metadata('min', 0)
  @metadata('max', 120)
  age: number = 0
}

// 读取元数据
function getMetadata(target: any, propertyKey: string) {
  const targetMetadata = metadataStorage.get(target.constructor.prototype)
  return targetMetadata?.get(propertyKey) || {}
}

const user = new User()
console.log(getMetadata(user, 'name')) // { type: 'string', required: true }
console.log(getMetadata(user, 'age')) // { type: 'number', min: 0, max: 120 }
```

### 5.2. 标记属性

```typescript
// 标记需要序列化的属性
const serializableProps = new WeakMap<any, Set<string>>()

function serializable(target: any, propertyKey: string) {
  if (!serializableProps.has(target.constructor)) {
    serializableProps.set(target.constructor, new Set())
  }

  serializableProps.get(target.constructor)!.add(propertyKey)
}

class User {
  @serializable
  name: string = ''

  @serializable
  email: string = ''

  password: string = '' // 不序列化
}

// 序列化函数
function serialize(obj: any): string {
  const constructor = obj.constructor
  const props = serializableProps.get(constructor) || new Set()

  const data: any = {}
  props.forEach((prop) => {
    data[prop] = obj[prop]
  })

  return JSON.stringify(data)
}

const user = new User()
user.name = 'Alice'
user.email = 'alice@example.com'
user.password = 'secret'

console.log(serialize(user)) // {"name":"Alice","email":"alice@example.com"}
```

### 5.3. 修改属性描述符

```typescript
// 通过 Object.defineProperty 修改属性
function readonly(target: any, propertyKey: string) {
  // 保存初始值
  let value: any

  // 重新定义属性
  Object.defineProperty(target, propertyKey, {
    get() {
      return value
    },
    set(newValue: any) {
      if (value === undefined) {
        // 首次设置允许
        value = newValue
      } else {
        // 后续设置抛出错误
        throw new Error(`${propertyKey} 是只读属性`)
      }
    },
    enumerable: true,
    configurable: false,
  })
}

class Config {
  @readonly
  apiUrl: string = ''
}

const config = new Config()
config.apiUrl = 'https://api.example.com' // 首次设置成功
console.log(config.apiUrl)
// config.apiUrl = 'new-url';  // ❌ Error: apiUrl 是只读属性
```

## 6. 🤔 属性装饰器有哪些实际应用场景？

### 6.1. 属性验证

```typescript
// 验证规则装饰器
const validationRules = new WeakMap<any, Map<string, any[]>>()

function addValidation(target: any, propertyKey: string, rule: any) {
  if (!validationRules.has(target.constructor)) {
    validationRules.set(target.constructor, new Map())
  }

  const rules = validationRules.get(target.constructor)!
  if (!rules.has(propertyKey)) {
    rules.set(propertyKey, [])
  }

  rules.get(propertyKey)!.push(rule)
}

function required(target: any, propertyKey: string) {
  addValidation(target, propertyKey, {
    type: 'required',
    validate: (value: any) =>
      value !== null && value !== undefined && value !== '',
  })
}

function minLength(length: number) {
  return function (target: any, propertyKey: string) {
    addValidation(target, propertyKey, {
      type: 'minLength',
      length,
      validate: (value: string) => value.length >= length,
    })
  }
}

function email(target: any, propertyKey: string) {
  addValidation(target, propertyKey, {
    type: 'email',
    validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  })
}

class RegisterForm {
  @required
  @minLength(3)
  username: string = ''

  @required
  @email
  email: string = ''
}

// 验证函数
function validate(obj: any): { valid: boolean; errors: string[] } {
  const rules = validationRules.get(obj.constructor)
  const errors: string[] = []

  if (rules) {
    rules.forEach((propRules, prop) => {
      const value = obj[prop]

      propRules.forEach((rule) => {
        if (!rule.validate(value)) {
          errors.push(`${prop} 验证失败：${rule.type}`)
        }
      })
    })
  }

  return { valid: errors.length === 0, errors }
}

const form = new RegisterForm()
form.username = 'ab'
form.email = 'invalid-email'

console.log(validate(form))
// { valid: false, errors: ['username 验证失败：minLength', 'email 验证失败：email'] }
```

### 6.2. ORM 列定义

```typescript
// 模拟 ORM 框架的列定义
interface ColumnMetadata {
  type: string
  nullable?: boolean
  unique?: boolean
  default?: any
}

const columnMetadata = new WeakMap<any, Map<string, ColumnMetadata>>()

function Column(metadata: ColumnMetadata) {
  return function (target: any, propertyKey: string) {
    if (!columnMetadata.has(target.constructor)) {
      columnMetadata.set(target.constructor, new Map())
    }

    columnMetadata.get(target.constructor)!.set(propertyKey, metadata)
  }
}

function PrimaryColumn(target: any, propertyKey: string) {
  Column({ type: 'integer', unique: true })(target, propertyKey)
}

class User {
  @PrimaryColumn
  id!: number

  @Column({ type: 'varchar', nullable: false })
  name!: string

  @Column({ type: 'varchar', unique: true })
  email!: string

  @Column({ type: 'integer', default: 0 })
  age!: number
}

// 生成表结构
function generateSchema(EntityClass: any): string {
  const metadata = columnMetadata.get(EntityClass)
  if (!metadata) return ''

  const columns: string[] = []

  metadata.forEach((column, prop) => {
    let sql = `${prop} ${column.type}`
    if (column.nullable === false) sql += ' NOT NULL'
    if (column.unique) sql += ' UNIQUE'
    if (column.default !== undefined) sql += ` DEFAULT ${column.default}`
    columns.push(sql)
  })

  return `CREATE TABLE ${EntityClass.name.toLowerCase()} (\n  ${columns.join(
    ',\n  '
  )}\n);`
}

console.log(generateSchema(User))
// CREATE TABLE user (
//   id integer UNIQUE,
//   name varchar NOT NULL,
//   email varchar UNIQUE,
//   age integer DEFAULT 0
// );
```

### 6.3. 依赖注入

```typescript
// 简单的依赖注入实现
const dependencies = new WeakMap<any, Map<string, any>>()

function Inject(serviceId: string) {
  return function (target: any, propertyKey: string) {
    if (!dependencies.has(target.constructor)) {
      dependencies.set(target.constructor, new Map())
    }

    dependencies.get(target.constructor)!.set(propertyKey, serviceId)
  }
}

// 服务容器
class Container {
  private services = new Map<string, any>()

  register(id: string, service: any) {
    this.services.set(id, service)
  }

  resolve<T>(ClassType: new () => T): T {
    const instance = new ClassType()
    const deps = dependencies.get(ClassType)

    if (deps) {
      deps.forEach((serviceId, prop) => {
        const service = this.services.get(serviceId)
        if (service) {
          ;(instance as any)[prop] = service
        }
      })
    }

    return instance
  }
}

// 服务定义
class Logger {
  log(message: string) {
    console.log(`[LOG] ${message}`)
  }
}

class UserService {
  @Inject('logger')
  logger!: Logger

  getUser(id: number) {
    this.logger.log(`获取用户 ${id}`)
    return { id, name: 'Alice' }
  }
}

// 使用
const container = new Container()
container.register('logger', new Logger())

const userService = container.resolve(UserService)
userService.getUser(1) // [LOG] 获取用户 1
```

### 6.4. 属性转换

```typescript
// 类型转换装饰器
const transformers = new WeakMap<any, Map<string, (value: any) => any>>()

function Transform(transformer: (value: any) => any) {
  return function (target: any, propertyKey: string) {
    if (!transformers.has(target.constructor)) {
      transformers.set(target.constructor, new Map())
    }

    transformers.get(target.constructor)!.set(propertyKey, transformer)
  }
}

// 便捷装饰器
function ToNumber(target: any, propertyKey: string) {
  Transform((value: any) => Number(value))(target, propertyKey)
}

function ToDate(target: any, propertyKey: string) {
  Transform((value: any) => new Date(value))(target, propertyKey)
}

class Event {
  @Transform((value: string) => value.toUpperCase())
  name!: string

  @ToNumber
  duration!: number

  @ToDate
  startTime!: Date
}

// 转换函数
function transform<T>(ClassType: new () => T, data: any): T {
  const instance = new ClassType()
  const trans = transformers.get(ClassType)

  Object.keys(data).forEach((key) => {
    const transformer = trans?.get(key)
    ;(instance as any)[key] = transformer ? transformer(data[key]) : data[key]
  })

  return instance
}

const eventData = {
  name: 'meeting',
  duration: '60',
  startTime: '2024-01-01T10:00:00Z',
}

const event = transform(Event, eventData)
console.log(event.name) // 'MEETING'
console.log(event.duration) // 60
console.log(event.startTime) // Date 对象
```

## 7. 🤔 使用属性装饰器时需要注意什么？

### 7.1. 不能直接修改属性值

::: code-group

```typescript [❌ 错误示例]
// 属性装饰器不能修改属性的初始值
function setDefault(value: any) {
  return function (target: any, propertyKey: string) {
    // ❌ 这不会生效
    target[propertyKey] = value
  }
}

class User {
  @setDefault('Unknown')
  name: string = ''
}

const user = new User()
console.log(user.name) // ''（不是 'Unknown'）
```

```typescript [✅ 正确示例]
// 通过重新定义属性来设置默认值
function setDefault(value: any) {
  return function (target: any, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get() {
        return value
      },
      set(newValue: any) {
        value = newValue
      },
      enumerable: true,
      configurable: true,
    })
  }
}

class User {
  @setDefault('Unknown')
  name!: string
}

const user = new User()
console.log(user.name) // 'Unknown'
```

:::

### 7.2. 不能返回值

```typescript
// 属性装饰器的返回值会被忽略
function decorator(target: any, propertyKey: string) {
  // 返回值无效
  return {
    get() {
      return 'value'
    },
  }
}

class Example {
  @decorator
  prop: string = ''
}
```

### 7.3. 执行时机

```typescript
// 属性装饰器在类定义时执行，不是在实例化时
let counter = 0

function count(target: any, propertyKey: string) {
  counter++
  console.log(`装饰器执行次数：${counter}`)
}

class User {
  @count
  name: string = ''
}

console.log('创建实例前：', counter) // 1
const user1 = new User()
console.log('创建实例 1 后：', counter) // 1
const user2 = new User()
console.log('创建实例 2 后：', counter) // 1
```

### 7.4. 与访问器装饰器的选择

::: code-group

```typescript [属性装饰器]
// 只能存储元数据或标记
class Example {
  @metadata('type', 'string')
  prop: string = ''
}
```

```typescript [访问器装饰器]
// 可以修改属性的读写行为
class Example {
  private _prop: string = ''

  @log
  get prop() {
    return this._prop
  }

  set prop(value: string) {
    this._prop = value
  }
}
```

:::

### 7.5. 静态属性装饰器

```typescript
// 静态属性装饰器的 target 是构造函数
function logStatic(target: any, propertyKey: string) {
  console.log('target 是构造函数：', typeof target === 'function')
  console.log('类名：', target.name)
}

class Example {
  @logStatic
  static config: string = ''
}

// 输出：
// target 是构造函数：true
// 类名：Example
```

## 8. 🔗 引用

- [TypeScript Handbook - Property Decorators][1]
- [TC39 Decorator Proposal][2]
- [Reflect Metadata][3]
- [Property Decorators vs Accessor Decorators][4]

[1]: https://www.typescriptlang.org/docs/handbook/decorators.html#property-decorators
[2]: https://github.com/tc39/proposal-decorators
[3]: https://github.com/rbuckton/reflect-metadata
[4]: https://www.typescriptlang.org/docs/handbook/decorators.html
