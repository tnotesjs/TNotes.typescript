# [0152. 命名空间的别名](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0152.%20%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4%E7%9A%84%E5%88%AB%E5%90%8D)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 什么是命名空间的别名?](#3-什么是命名空间的别名)
- [4. 如何创建命名空间别名?](#4-如何创建命名空间别名)
  - [4.1. 创建别名的规则](#41-创建别名的规则)
- [5. 命名空间别名有哪些使用场景?](#5-命名空间别名有哪些使用场景)
- [6. 命名空间别名与 ES6 模块导入有什么区别?](#6-命名空间别名与-es6-模块导入有什么区别)
- [7. 命名空间别名与 ES6 模块导入有什么区别?](#7-命名空间别名与-es6-模块导入有什么区别)
  - [7.1. 区别对比表](#71-区别对比表)
- [8. 命名空间别名的实际应用有哪些?](#8-命名空间别名的实际应用有哪些)
  - [8.1. 常见错误与解决方案](#81-常见错误与解决方案)
  - [8.2. 最佳实践建议](#82-最佳实践建议)
- [9. 引用](#9-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 命名空间别名的定义和语法
- 创建命名空间别名的方法
- 命名空间别名的使用场景
- 命名空间别名与模块导入的区别
- 实际应用案例与最佳实践

## 2. 评价

命名空间别名是 TypeScript 提供的一种简化长命名空间路径访问的机制,通过 `import` 关键字创建本地引用。在现代开发中,ES6 模块系统已经取代命名空间成为主流,但理解命名空间别名对维护遗留代码和阅读类型声明文件仍然重要。

建议:

- 新项目使用 ES6 模块的 `import/export`避免使用命名空间
- 命名空间别名主要用于简化深层嵌套命名空间的访问
- 注意命名空间的 `import` 与 ES6 模块的 `import` 是不同的语法
- 仅在维护遗留代码或处理全局类型声明时使用

核心内容总结:命名空间别名使用 `import alias = Namespace.SubNamespace` 语法创建局部引用简化长路径访问。这与 ES6 模块导入语法不同仅在命名空间上下文中有效。

## 3. 什么是命名空间的别名?

命名空间别名是为嵌套命名空间或长命名空间路径创建的本地引用使代码更简洁易读。

::: warning ⚠️ 注意事项

- 命名空间别名使用 `import` 关键字但这不是 ES6 模块导入
- 别名只是引用不会创建新的类型或值
- 别名在当前作用域有效不能跨文件使用
- 只能为已导出的命名空间成员创建别名

:::

## 4. 如何创建命名空间别名?

命名空间别名使用 `import` 关键字配合赋值语法创建。

::: code-group

```ts [基本语法]
namespace Shapes {
  export namespace Circle {
    export interface Options {
      radius: number
      color: string
    }

    export function create(options: Options) {
      return { ...options, type: 'circle' }
    }
  }
}

// ✅ 语法:import 别名 = 命名空间路径
import CircleNS = Shapes.Circle

// 使用别名
const options: CircleNS.Options = {
  radius: 10,
  color: 'red',
}

const circle = CircleNS.create(options)
```

```ts [为类创建别名]
namespace Models {
  export namespace User {
    export class Entity {
      constructor(
        public id: string,
        public name: string,
      ) {}
    }

    export interface DTO {
      id: string
      name: string
      email: string
    }
  }
}

// ✅ 为类创建别名
import UserEntity = Models.User.Entity

// ✅ 使用别名创建实例
const user = new UserEntity('1', '张三')

// ✅ 也可以为接口路径创建别名
import UserDTO = Models.User.DTO

const dto: UserDTO = {
  id: '1',
  name: '张三',
  email: 'zhangsan@example.com',
}
```

```ts [为函数创建别名]
namespace Validators {
  export namespace Email {
    export function validate(email: string): boolean {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    export function normalize(email: string): string {
      return email.toLowerCase().trim()
    }
  }
}

// ✅ 为函数创建别名
import validateEmail = Validators.Email.validate

console.log(validateEmail('test@example.com')) // true
console.log(validateEmail('invalid')) // false
```

```ts [为常量创建别名]
namespace Config {
  export namespace API {
    export const BASE_URL = 'https://api.example.com'
    export const VERSION = 'v1'
    export const TIMEOUT = 3000
  }
}

// ✅ 为常量创建别名
import API_BASE = Config.API.BASE_URL

console.log(API_BASE) // https://api.example.com

// ⚠️ 注意:不能为整个常量命名空间创建别名并解构
// import { BASE_URL } = Config.API; // ❌ 错误语法
```

:::

### 4.1. 创建别名的规则

| 特性     | 说明                       |
| -------- | -------------------------- |
| 语法     | `import alias = NS.Path`   |
| 适用范围 | 命名空间、类、接口、函数等 |
| 作用域   | 当前文件或块级作用域       |
| 类型检查 | 保持原有类型信息           |
| 重命名   | 可以使用任意有效标识符     |
| 导出     | 别名不能被导出             |

## 5. 命名空间别名有哪些使用场景?

命名空间别名主要用于简化深层嵌套访问和提高代码可读性。

```ts [场景2:避免命名冲突]
namespace External {
  export namespace Utils {
    export function log(msg: string) {
      console.log(`[External] ${msg}`)
    }
  }
}

namespace Internal {
  export namespace Utils {
    export function log(msg: string) {
      console.log(`[Internal] ${msg}`)
    }
  }
}

// ✅ 使用别名区分同名命名空间
import ExternalUtils = External.Utils
import InternalUtils = Internal.Utils

ExternalUtils.log('External message')
InternalUtils.log('Internal message')
```

## 6. 命名空间别名与 ES6 模块导入有什么区别?

虽然都使用 `import` 关键字但命名空间别名和 ES6 模块导入是完全不同的概念。

```ts [命名空间别名]
// ✅ 命名空间别名(TypeScript 特有)
namespace MyLib {
  export namespace Utils {
    export function helper() {
      return 'Helper'
    }
  }
}

// 使用 import 创建别名
import Utils = MyLib.Utils

// 特点:
// 1. 用于命名空间内部引用
// 2. 不涉及模块系统
// 3. 编译后可能被内联
// 4. 仅在类型层面和运行时都有效
```

```ts [编译结果对比]
// 命名空间别名编译后
var Data
;(function (Data) {
  var Models
  ;(function (Models) {
    class User {}
    Models.User = User
  })((Models = Data.Models || (Data.Models = {})))
})(Data || (Data = {}))

// 别名通常被内联不产生额外代码
var user = new Data.Models.User()

// ES6 模块编译为 CommonJS
// models.js
exports.User = class User {}

// main.js
const models_1 = require('./models')
const user = new models_1.User()
```

## 7. 命名空间别名与 ES6 模块导入有什么区别?

虽然都使用 `import` 关键字,但命名空间别名和 ES6 模块导入是完全不同的概念。

::: code-group

```ts [命名空间别名]
// ✅ 命名空间别名(TypeScript 特有)
namespace MyLib {
  export namespace Utils {
    export function helper() {
      return 'Helper'
    }
  }
}

// 使用 import 创建别名
import Utils = MyLib.Utils

// 特点:
// 1. 用于命名空间内部引用
// 2. 不涉及模块系统
// 3. 编译后可能被内联
// 4. 仅在类型层面和运行时都有效
```

```ts [ES6 模块导入]
// ✅ ES6 模块导入(JavaScript 标准)
// utils.ts
export function helper() {
  return 'Helper'
}

// main.ts
import { helper } from './utils'

// 特点:
// 1. 用于跨文件模块引用
// 2. 基于文件系统
// 3. 支持按需加载和 tree-shaking
// 4. 是 JavaScript 标准的一部分
```

```ts [语法对比]
namespace Data {
  export namespace Models {
    export class User {}
  }
}

// ❌ 命名空间别名不能使用解构语法
// import { Models } = Data; // 错误

// ✅ 正确的命名空间别名语法
import Models = Data.Models

// ✅ ES6 模块可以使用解构
// import { User } from './models';
```

```ts [编译结果对比]
// 命名空间别名编译后
var Data
;(function (Data) {
  var Models
  ;(function (Models) {
    class User {}
    Models.User = User
  })((Models = Data.Models || (Data.Models = {})))
})(Data || (Data = {}))

// 别名通常被内联,不产生额外代码
var user = new Data.Models.User()

// ES6 模块编译为 CommonJS
// models.js
exports.User = class User {}

// main.js
const models_1 = require('./models')
const user = new models_1.User()
```

:::

### 7.1. 区别对比表

| 特性     | 命名空间别名             | ES6 模块导入              |
| -------- | ------------------------ | ------------------------- |
| 关键字   | `import alias = NS.Path` | `import { x } from 'mod'` |
| 适用范围 | 命名空间内部引用         | 跨文件模块引用            |
| 标准     | TypeScript 特有          | JavaScript ES6 标准       |
| 作用域   | 当前文件                 | 模块作用域                |
| 运行时   | 可能被内联               | 保留模块结构              |
| 工具支持 | 有限                     | 完善(打包、tree-shaking)  |
| 导出能力 | 不能导出别名             | 可以重新导出              |
| 使用场景 | 遗留代码、类型声明       | 现代应用开发              |

## 8. 命名空间别名的实际应用有哪些?

在实际开发中,命名空间别名主要用于特定场景。

::: code-group

```ts [应用1:简化类型声明文件]
// ✅ 第三方库的类型声明
declare namespace jQuery {
  export namespace fn {
    export interface JQuery {
      fadeIn(): this
      fadeOut(): this
    }
  }

  export namespace ajax {
    export interface Settings {
      url: string
      method: string
    }
  }
}

// 在使用时创建别名
import JQueryFn = jQuery.fn.JQuery
import AjaxSettings = jQuery.ajax.Settings

// 简化类型引用
function animate(element: JQueryFn) {
  element.fadeIn().fadeOut()
}

function request(settings: AjaxSettings) {
  // 实现
}
```

```ts [应用2:组织大型类型定义]
// ✅ 在模块中使用命名空间分组类型
export namespace API {
  export namespace V1 {
    export interface User {
      id: string
      name: string
    }

    export interface Post {
      id: string
      title: string
    }
  }

  export namespace V2 {
    export interface User {
      id: string
      username: string
      email: string
    }
  }
}

// 使用别名简化访问
import V1User = API.V1.User
import V2User = API.V2.User

function migrateUser(v1: V1User): V2User {
  return {
    id: v1.id,
    username: v1.name,
    email: `${v1.name}@example.com`,
  }
}
```

```ts [应用3:条件类型别名]
namespace Types {
  export namespace Strict {
    export type ID = string & { readonly __brand: 'ID' }
    export type Email = string & { readonly __brand: 'Email' }
  }

  export namespace Loose {
    export type ID = string
    export type Email = string
  }
}

// ✅ 根据配置选择不同的类型别名
const USE_STRICT_TYPES = true

if (USE_STRICT_TYPES) {
  import ID = Types.Strict.ID
  import Email = Types.Strict.Email
} else {
  import ID = Types.Loose.ID
  import Email = Types.Loose.Email
}
```

```ts [应用4:遗留代码维护]
// ✅ 维护使用命名空间的遗留项目
namespace LegacyApp {
  export namespace Data {
    export namespace Repository {
      export class UserRepository {
        findById(id: string) {
          return { id, name: 'User' }
        }
      }
    }
  }
}

// 在新代码中使用别名提高可读性
import UserRepo = LegacyApp.Data.Repository.UserRepository

class UserService {
  constructor(private repo: UserRepo) {}

  getUser(id: string) {
    return this.repo.findById(id)
  }
}

const service = new UserService(new UserRepo())
```

:::

### 8.1. 常见错误与解决方案

::: warning ⚠️ 错误 1:混淆命名空间别名和模块导入

```ts
// ❌ 错误:尝试从命名空间别名导出
namespace Utils {
  export function helper() {}
}

import UtilsAlias = Utils

// ❌ 不能重新导出命名空间别名
// export { UtilsAlias }; // 错误

// ✅ 解决方案:直接导出命名空间或迁移到模块
export namespace Utils {
  export function helper() {}
}
```

:::

::: warning ⚠️ 错误 2:在模块文件中过度使用命名空间

```ts
// ❌ 不推荐:在 ES6 模块中使用命名空间别名
export namespace MyLib {
  export namespace Utils {
    export function helper() {}
  }
}

import Utils = MyLib.Utils

// ✅ 推荐:使用纯模块方式
// utils.ts
export function helper() {}

// main.ts
import * as Utils from './utils'
// 或
import { helper } from './utils'
```

:::

### 8.2. 最佳实践建议

::: tip 💡 使用建议

1. 优先使用 ES6 模块系统避免命名空间
2. 仅在以下场景使用命名空间别名:
   - 维护使用命名空间的遗留代码
   - 简化类型声明文件中的长路径
   - 在全局类型声明中组织类型
3. 使用语义化的别名名称
4. 将别名限制在最小作用域内
5. 避免创建过多层级的别名
6. 记录别名的用途提高代码可维护性

:::

## 9. 引用

- [TypeScript Handbook - Namespaces][1]
- [TypeScript Deep Dive - Namespaces][2]
- [Do's and Don'ts - TypeScript][3]

[1]: https://www.typescriptlang.org/docs/handbook/namespaces.html
[2]: https://basarat.gitbook.io/typescript/project/namespaces
[3]: https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html
