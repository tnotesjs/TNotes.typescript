# [0148. 嵌套命名空间](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0148.%20%E5%B5%8C%E5%A5%97%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是嵌套命名空间?](#3--什么是嵌套命名空间)
  - [3.1. 嵌套命名空间 vs. 平铺命名空间](#31-嵌套命名空间-vs-平铺命名空间)
- [4. 🤔 如何声明嵌套命名空间?](#4--如何声明嵌套命名空间)
  - [4.1. 声明方式对比](#41-声明方式对比)
- [5. 🤔 如何访问嵌套命名空间的成员?](#5--如何访问嵌套命名空间的成员)
- [6. 🤔 如何导出嵌套命名空间?](#6--如何导出嵌套命名空间)
  - [6.1. 导出级别对比](#61-导出级别对比)
- [7. 🤔 嵌套命名空间有哪些实际应用场景?](#7--嵌套命名空间有哪些实际应用场景)
  - [7.1. 常见错误与解决方案](#71-常见错误与解决方案)
  - [7.2. 最佳实践建议](#72-最佳实践建议)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 嵌套命名空间的定义和作用
- 嵌套命名空间的声明方式
- 嵌套命名空间成员的访问方法
- 嵌套命名空间的导出机制
- 实际应用场景与最佳实践

## 2. 🫧 评价

嵌套命名空间是 TypeScript 早期组织大型代码库的方式,通过多层级结构提供更细粒度的模块化。但在现代 TypeScript 开发中,ES6 模块系统已经成为主流,嵌套命名空间的使用场景越来越少。

建议:

- 新项目优先使用 ES6 模块系统,而非命名空间
- 维护遗留代码时需要理解嵌套命名空间的工作原理
- 如果必须使用命名空间,嵌套层级不要超过 3 层,否则会增加代码复杂度
- 主要用于处理全局库的类型定义文件(`.d.ts`)

核心内容总结:嵌套命名空间通过点号分隔或嵌套声明来创建多层级结构,使用 `export` 关键字控制成员的可见性,访问时需要使用完整的命名空间路径。

## 3. 🤔 什么是嵌套命名空间?

嵌套命名空间是指在一个命名空间内部声明另一个命名空间,形成多层级的命名空间结构。这种层次化的组织方式可以更清晰地表达代码的逻辑关系。

::: code-group

```typescript [基本概念]
// ✅ 嵌套命名空间示例
namespace Company {
  // 外层命名空间
  export namespace HR {
    // 内层命名空间
    export class Employee {
      constructor(public name: string) {}
    }
  }

  export namespace IT {
    // 另一个内层命名空间
    export class Developer {
      constructor(public name: string, public language: string) {}
    }
  }
}

// 使用嵌套命名空间
const emp = new Company.HR.Employee('张三')
const dev = new Company.IT.Developer('李四', 'TypeScript')
```

```typescript [命名空间层级]
// ✅ 三层嵌套结构
namespace App {
  export namespace UI {
    export namespace Components {
      export class Button {
        render() {
          return '<button>Click</button>'
        }
      }
    }
  }
}

// 完整路径访问
const btn = new App.UI.Components.Button()
console.log(btn.render()) // <button>Click</button>
```

:::

### 3.1. 嵌套命名空间 vs. 平铺命名空间

| 特性     | 嵌套命名空间                | 平铺命名空间          |
| -------- | --------------------------- | --------------------- |
| 结构     | 多层级,层次分明             | 单层级,扁平结构       |
| 命名冲突 | 通过层级隔离,减少冲突       | 需要更长的命名来区分  |
| 访问方式 | 需要完整路径(如 `A.B.C`)    | 直接访问(如 `ABC`)    |
| 适用场景 | 大型项目,复杂的功能模块划分 | 小型项目,功能相对简单 |
| 可读性   | 结构清晰,但路径可能过长     | 简洁,但缺少层次感     |

## 4. 🤔 如何声明嵌套命名空间?

TypeScript 提供两种声明嵌套命名空间的语法:嵌套声明和点号分隔。

::: code-group

```typescript [嵌套声明语法]
// ✅ 传统嵌套声明方式
namespace Outer {
  export namespace Inner {
    export class MyClass {
      sayHello() {
        return 'Hello from nested namespace'
      }
    }
  }
}

// 使用
const obj = new Outer.Inner.MyClass()
console.log(obj.sayHello())
```

```typescript [点号分隔语法]
// ✅ 简化的点号语法(推荐)
namespace Outer.Inner {
  export class MyClass {
    sayHello() {
      return 'Hello from nested namespace'
    }
  }
}

// 使用方式完全相同
const obj = new Outer.Inner.MyClass()
console.log(obj.sayHello())
```

```typescript [混合使用]
// ✅ 可以混合使用两种语法
namespace Library {
  export namespace Utils {
    export function log(msg: string) {
      console.log(`[Utils] ${msg}`)
    }
  }
}

// 继续扩展(点号语法)
namespace Library.Utils {
  export function warn(msg: string) {
    console.log(`[Utils] Warning: ${msg}`)
  }
}

// 两个函数都可用
Library.Utils.log('Info message')
Library.Utils.warn('Warning message')
```

:::

::: tip 💡 最佳实践

点号分隔语法更简洁,代码缩进更少,推荐用于深层嵌套的命名空间。但要注意,点号语法只是语法糖,本质上和嵌套声明完全等价。

:::

### 4.1. 声明方式对比

| 语法 | 优点 | 缺点 | 适用场景 |
| --- | --- | --- | --- |
| 嵌套声明 | 结构直观,易于理解 | 层级深时缩进过多 | 层级较少时 |
| 点号分隔 | 代码简洁,减少缩进 | 不够直观 | 深层嵌套时 |
| 混合使用 | 灵活,可逐步扩展命名空间 | 可能造成代码风格不统一 | 大型项目分模块时 |

## 5. 🤔 如何访问嵌套命名空间的成员?

访问嵌套命名空间的成员需要使用完整的命名空间路径,也可以通过别名简化访问。

::: code-group

```typescript [完整路径访问]
namespace Company {
  export namespace Department {
    export namespace Team {
      export class Member {
        constructor(public name: string) {}

        greet() {
          return `Hello, I'm ${this.name}`
        }
      }
    }
  }
}

// ✅ 使用完整路径访问
const member = new Company.Department.Team.Member('王五')
console.log(member.greet()) // Hello, I'm 王五
```

```typescript [使用别名简化]
namespace Company {
  export namespace Department {
    export namespace Team {
      export class Member {
        constructor(public name: string) {}
      }
    }
  }
}

// ✅ 使用 import 创建别名
import TeamMember = Company.Department.Team.Member

// 简化后的访问
const member = new TeamMember('赵六')
```

```typescript [导入整个命名空间]
namespace Library {
  export namespace Math {
    export function add(a: number, b: number) {
      return a + b
    }

    export function subtract(a: number, b: number) {
      return a - b
    }
  }
}

// ✅ 导入整个子命名空间
import MathUtils = Library.Math

console.log(MathUtils.add(10, 5)) // 15
console.log(MathUtils.subtract(10, 5)) // 5
```

```typescript [访问限制示例]
namespace Outer {
  export namespace Inner {
    export class PublicClass {}
    class PrivateClass {} // ❌ 未导出,外部无法访问
  }
}

// ✅ 可以访问导出的类
const pub = new Outer.Inner.PublicClass()

// ❌ 编译错误:PrivateClass 未导出
// const priv = new Outer.Inner.PrivateClass();
```

:::

::: warning ⚠️ 注意事项

- 未使用 `export` 导出的成员只能在声明的命名空间内部访问
- 命名空间别名只能使用 `import` 关键字,不能使用 ES6 的 `import` 语句
- 别名不会创建新的类型,只是引用的快捷方式

:::

## 6. 🤔 如何导出嵌套命名空间?

嵌套命名空间的导出机制决定了哪些成员可以被外部访问。

::: code-group

```typescript [基本导出]
namespace App {
  // ✅ 导出子命名空间
  export namespace Config {
    export interface Settings {
      theme: string
      language: string
    }

    export const defaultSettings: Settings = {
      theme: 'light',
      language: 'zh-CN',
    }
  }

  // ❌ 未导出的子命名空间(外部不可见)
  namespace Internal {
    export function helper() {
      return 'internal helper'
    }
  }
}

// ✅ 可以访问导出的命名空间
const settings = App.Config.defaultSettings

// ❌ 无法访问未导出的命名空间
// App.Internal.helper(); // 编译错误
```

```typescript [选择性导出]
namespace Database {
  export namespace Models {
    // ✅ 导出的类
    export class User {
      constructor(public id: number, public name: string) {}
    }

    // ❌ 未导出的类(模块内部使用)
    class BaseModel {
      protected createdAt: Date = new Date()
    }
  }

  export namespace Operations {
    export function findUser(id: number): Database.Models.User | null {
      // 实现逻辑
      return new Database.Models.User(id, 'Test User')
    }
  }
}

// ✅ 可以访问导出的类和函数
const user = new Database.Models.User(1, '张三')
const foundUser = Database.Operations.findUser(1)

// ❌ 无法访问 BaseModel
// const base = new Database.Models.BaseModel(); // 编译错误
```

```typescript [跨命名空间访问]
namespace Lib {
  export namespace Utils {
    export function format(str: string): string {
      return str.toUpperCase()
    }
  }

  export namespace Validators {
    // ✅ 可以访问同一顶层命名空间下的其他命名空间
    export function validateAndFormat(str: string): string {
      if (str.length === 0) {
        throw new Error('Empty string')
      }
      return Utils.format(str) // 直接使用 Utils
    }
  }
}

console.log(Lib.Validators.validateAndFormat('hello')) // HELLO
```

:::

### 6.1. 导出级别对比

| 导出方式                | 可见性                   | 使用场景            |
| ----------------------- | ------------------------ | ------------------- |
| `export namespace`      | 子命名空间可被外部访问   | 需要暴露的功能模块  |
| `namespace`(未导出)     | 仅内部可见               | 私有实现,工具函数   |
| `export class/function` | 命名空间成员可被外部访问 | 公开 API            |
| 未导出的成员            | 仅当前命名空间可见       | 内部辅助类,私有常量 |

## 7. 🤔 嵌套命名空间有哪些实际应用场景?

虽然现代开发推荐使用 ES6 模块,但在特定场景下嵌套命名空间仍有其价值。

::: code-group

```typescript [场景1:组织大型类型定义]
// ✅ 为第三方库编写类型定义文件
declare namespace jQuery {
  export namespace fn {
    export function extend(obj: any): void
  }

  export namespace ajax {
    export interface Settings {
      url: string
      method: string
    }

    export function request(settings: Settings): Promise<any>
  }
}

// 使用类型定义
const settings: jQuery.ajax.Settings = {
  url: '/api/data',
  method: 'GET',
}
```

```typescript [场景2:多层级功能模块]
// ✅ 电商系统的命名空间组织
namespace ECommerce {
  export namespace Product {
    export interface Item {
      id: string
      name: string
      price: number
    }

    export namespace Category {
      export class Electronics {
        static getProducts(): Item[] {
          return [{ id: '1', name: '手机', price: 3999 }]
        }
      }
    }
  }

  export namespace Order {
    export interface OrderInfo {
      orderId: string
      items: Product.Item[]
      total: number
    }

    export class OrderManager {
      createOrder(items: Product.Item[]): OrderInfo {
        const total = items.reduce((sum, item) => sum + item.price, 0)
        return {
          orderId: Date.now().toString(),
          items,
          total,
        }
      }
    }
  }
}

// 使用
const products = ECommerce.Product.Category.Electronics.getProducts()
const orderMgr = new ECommerce.Order.OrderManager()
const order = orderMgr.createOrder(products)
```

```typescript [场景3:全局配置管理]
// ✅ 应用配置的命名空间组织
namespace AppConfig {
  export namespace Database {
    export const host = 'localhost'
    export const port = 5432

    export namespace Connection {
      export const timeout = 30000
      export const poolSize = 10
    }
  }

  export namespace API {
    export const baseURL = 'https://api.example.com'
    export const version = 'v1'

    export namespace Auth {
      export const tokenKey = 'auth_token'
      export const refreshInterval = 3600000
    }
  }
}

// 集中访问配置
console.log(`${AppConfig.API.baseURL}/${AppConfig.API.version}`)
console.log(`Token: ${AppConfig.API.Auth.tokenKey}`)
```

:::

### 7.1. 常见错误与解决方案

::: warning ⚠️ 错误 1:过度嵌套

```typescript
// ❌ 嵌套层级过深,难以维护
namespace A {
  export namespace B {
    export namespace C {
      export namespace D {
        export namespace E {
          export class MyClass {}
        }
      }
    }
  }
}

// 访问路径过长
const obj = new A.B.C.D.E.MyClass()

// ✅ 解决方案:使用别名或重新设计结构
import MyClass = A.B.C.D.E.MyClass
const obj2 = new MyClass()

// 或者扁平化命名空间
namespace A {
  export class MyClass {}
}
```

:::

::: warning ⚠️ 错误 2:与 ES6 模块混用

```typescript
// ❌ 不推荐在模块文件中使用命名空间
export namespace Utils {
  export function helper() {}
}

// ✅ 推荐使用纯 ES6 模块
export function helper() {}
```

:::

### 7.2. 最佳实践建议

::: tip 💡 使用建议

1. 新项目优先使用 ES6 模块系统(`import/export`)
2. 仅在以下场景考虑命名空间:
   - 编写全局类型定义文件(`.d.ts`)
   - 维护遗留代码
   - 在浏览器环境中需要全局变量时
3. 命名空间嵌套深度不超过 3 层
4. 使用别名(`import xxx = yyy`)简化长路径访问
5. 清晰区分导出和内部成员

:::

## 8. 🔗 引用

- [TypeScript Handbook - Namespaces][1]
- [TypeScript Deep Dive - Namespaces][2]
- [TypeScript 官方文档 - 命名空间与模块][3]

[1]: https://www.typescriptlang.org/docs/handbook/namespaces.html
[2]: https://basarat.gitbook.io/typescript/project/namespaces
[3]: https://www.typescriptlang.org/docs/handbook/namespaces-and-modules.html
