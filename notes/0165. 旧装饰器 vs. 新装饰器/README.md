# [0165. 旧装饰器 vs. 新装饰器](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0165.%20%E6%97%A7%E8%A3%85%E9%A5%B0%E5%99%A8%20vs.%20%E6%96%B0%E8%A3%85%E9%A5%B0%E5%99%A8)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🆚 配置方式对比](#3--配置方式对比)
- [4. 🆚 类装饰器对比](#4--类装饰器对比)
- [5. 🆚 方法装饰器对比](#5--方法装饰器对比)
- [6. 🆚 属性装饰器对比](#6--属性装饰器对比)
- [7. 🆚 元数据支持对比](#7--元数据支持对比)
- [8. 🆚 总体差异对比](#8--总体差异对比)
  - [8.1. 使用建议](#81-使用建议)
- [9. 🔗 引用](#9--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 旧装饰器与新装饰器的配置差异
- 不同类型装饰器的实现对比
- 元数据支持的差异
- API 设计的改进
- 迁移注意事项

## 2. 🫧 评价

新旧装饰器在设计理念和实现方式上存在重大差异。

- 旧装饰器（Stage 2）需要 `experimentalDecorators`，新装饰器（Stage 3）为默认支持
- 新装饰器通过 `context` 参数提供更清晰的上下文信息
- 旧装饰器支持元数据，新装饰器需要配合新的元数据提案
- 新装饰器 API 更简洁，但功能上有所限制
- 项目迁移需要权衡框架依赖和标准兼容性

## 3. 🆚 配置方式对比

新旧装饰器需要不同的编译器配置。

::: code-group

```ts [旧装饰器配置]
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2015",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

```ts [新装饰器配置]
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    // TypeScript 5.0+ 默认支持
    // 无需额外配置
  }
}
```

:::

## 4. 🆚 类装饰器对比

类装饰器的签名和使用方式完全不同。

::: code-group

```ts [旧装饰器]
// 旧装饰器签名
function OldClassDecorator(target: Function) {
  // target 是类的构造函数
  console.log('类名：', target.name)

  // 可以修改类的原型
  target.prototype.newMethod = function () {
    return 'added'
  }

  // 可以替换构造函数
  return class extends (target as any) {
    constructor(...args: any[]) {
      super(...args)
      console.log('实例化')
    }
  }
}

@OldClassDecorator
class OldExample {
  value = 1
}
```

```ts [新装饰器]
// 新装饰器签名
function NewClassDecorator(target: Function, context: ClassDecoratorContext) {
  // context 提供元信息
  console.log('类名：', context.name)
  console.log('类型：', context.kind) // 'class'

  // 使用 addInitializer 添加初始化逻辑
  context.addInitializer(function () {
    console.log('类初始化')
  })

  // 返回新的构造函数
  return class extends target {
    constructor(...args: any[]) {
      super(...args)
      console.log('实例化')
    }
  }
}

@NewClassDecorator
class NewExample {
  value = 1
}
```

:::

## 5. 🆚 方法装饰器对比

方法装饰器的参数结构发生了重大变化。

::: code-group

```ts [旧装饰器]
// 旧装饰器签名
function OldMethodDecorator(
  target: Object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
) {
  console.log('目标对象：', target)
  console.log('方法名：', propertyKey)

  const originalMethod = descriptor.value

  descriptor.value = function (...args: any[]) {
    console.log(`调用 ${String(propertyKey)}`)
    return originalMethod.apply(this, args)
  }

  return descriptor
}

class OldService {
  @OldMethodDecorator
  getData() {
    return 'data'
  }
}
```

```ts [新装饰器]
// 新装饰器签名
function NewMethodDecorator(
  target: Function,
  context: ClassMethodDecoratorContext
) {
  console.log('方法名：', context.name)
  console.log('类型：', context.kind) // 'method'
  console.log('是否静态：', context.static)
  console.log('是否私有：', context.private)

  return function (this: any, ...args: any[]) {
    console.log(`调用 ${String(context.name)}`)
    return target.apply(this, args)
  }
}

class NewService {
  @NewMethodDecorator
  getData() {
    return 'data'
  }
}
```

:::

## 6. 🆚 属性装饰器对比

属性装饰器的功能和返回值有显著差异。

::: code-group

```ts [旧装饰器]
// 旧装饰器签名
function OldPropertyDecorator(target: Object, propertyKey: string | symbol) {
  console.log('属性名：', propertyKey)

  // 旧装饰器无返回值
  // 通常配合 metadata 使用
  let value: any

  Object.defineProperty(target, propertyKey, {
    get() {
      return value
    },
    set(newValue: any) {
      console.log(`设置 ${String(propertyKey)} = ${newValue}`)
      value = newValue
    },
  })
}

class OldModel {
  @OldPropertyDecorator
  name: string = ''
}
```

```ts [新装饰器]
// 新装饰器签名
function NewPropertyDecorator(
  target: undefined,
  context: ClassFieldDecoratorContext
) {
  console.log('属性名：', context.name)
  console.log('类型：', context.kind) // 'field'

  // 返回初始化函数
  return function (this: any, initialValue: any) {
    console.log(`初始化 ${String(context.name)} = ${initialValue}`)
    return initialValue
  }
}

class NewModel {
  @NewPropertyDecorator
  name: string = ''
}
```

:::

## 7. 🆚 元数据支持对比

元数据是旧装饰器的重要特性，新装饰器需要新的方案。

::: code-group

```ts [旧装饰器]
import 'reflect-metadata'

// 旧装饰器使用 reflect-metadata
function Entity(tableName: string) {
  return function (target: Function) {
    Reflect.defineMetadata('table', tableName, target)
  }
}

function Column(target: Object, propertyKey: string) {
  const columns = Reflect.getMetadata('columns', target.constructor) || []
  columns.push(propertyKey)
  Reflect.defineMetadata('columns', columns, target.constructor)
}

@Entity('users')
class OldUser {
  @Column
  name: string = ''

  @Column
  email: string = ''
}

// 读取元数据
const table = Reflect.getMetadata('table', OldUser)
const columns = Reflect.getMetadata('columns', OldUser)
console.log(table) // 'users'
console.log(columns) // ['name', 'email']
```

```ts [新装饰器]
// 新装饰器需要使用 Symbol.metadata（提案阶段）
// 目前需要手动管理元数据

const metadataMap = new WeakMap()

function Entity(tableName: string) {
  return function (target: Function, context: ClassDecoratorContext) {
    metadataMap.set(target, { table: tableName, columns: [] })
  }
}

function Column(target: undefined, context: ClassFieldDecoratorContext) {
  context.addInitializer(function () {
    const metadata = metadataMap.get(this.constructor)
    if (metadata) {
      metadata.columns.push(context.name)
    }
  })
}

@Entity('users')
class NewUser {
  @Column
  name: string = ''

  @Column
  email: string = ''
}

// 读取元数据
const metadata = metadataMap.get(NewUser)
console.log(metadata?.table) // 'users'
console.log(metadata?.columns) // ['name', 'email']
```

:::

## 8. 🆚 总体差异对比

| 特性         | 旧装饰器（Stage 2）            | 新装饰器（Stage 3）  |
| ------------ | ------------------------------ | -------------------- |
| 启用方式     | `experimentalDecorators: true` | TypeScript 5.0+ 默认 |
| 标准化       | TypeScript 独有                | TC39 标准            |
| Context 参数 | ❌ 无                          | ✅ 有                |
| 元数据支持   | ✅ reflect-metadata            | ⚠️ 需新方案          |
| 访问器装饰器 | ✅ 独立装饰器                  | ❌ 合并到方法装饰器  |
| 参数装饰器   | ✅ 支持                        | ❌ 不支持            |
| 运行时性能   | 依赖反射，较慢                 | 更轻量，更快         |
| 类型安全     | 较弱                           | 更强                 |
| 框架支持     | Angular、NestJS 等             | 逐步支持中           |

### 8.1. 使用建议

```ts
// 新项目：使用新装饰器
// 优点：符合标准，性能更好

// 现有项目：继续使用旧装饰器
// 原因：框架依赖，迁移成本高

// 库开发：考虑同时支持两种
// 通过条件编译或运行时检测
```

## 9. 🔗 引用

- [TypeScript 5.0 Release Notes][1]
- [TC39 Decorator Proposal][2]
- [Decorator Metadata Proposal][3]
- [TypeScript Decorators Documentation][4]

[1]: https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/
[2]: https://github.com/tc39/proposal-decorators
[3]: https://github.com/tc39/proposal-decorator-metadata
[4]: https://www.typescriptlang.org/docs/handbook/decorators.html
