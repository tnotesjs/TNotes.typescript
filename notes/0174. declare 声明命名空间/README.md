# [0174. declare 声明命名空间](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0174.%20declare%20%E5%A3%B0%E6%98%8E%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 如何使用 declare 声明命名空间？](#3--如何使用-declare-声明命名空间)
  - [3.1. 基本语法](#31-基本语法)
  - [3.2. 命名空间中的各种成员](#32-命名空间中的各种成员)
  - [3.3. 命名空间分组](#33-命名空间分组)
- [4. 🤔 如何声明嵌套命名空间？](#4--如何声明嵌套命名空间)
  - [4.1. 基本嵌套](#41-基本嵌套)
  - [4.2. 多层嵌套](#42-多层嵌套)
  - [4.3. 命名空间别名](#43-命名空间别名)
- [5. 🤔 如何声明命名空间与类、函数的合并？](#5--如何声明命名空间与类函数的合并)
  - [5.1. 命名空间与类合并](#51-命名空间与类合并)
  - [5.2. 命名空间与函数合并](#52-命名空间与函数合并)
  - [5.3. 命名空间与枚举合并](#53-命名空间与枚举合并)
  - [5.4. 实际应用示例](#54-实际应用示例)
  - [5.5. jQuery 完整示例](#55-jquery-完整示例)
- [6. 🔗 引用](#6--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- declare 声明命名空间的基本语法
- 命名空间内的成员声明
- 嵌套命名空间的声明
- 命名空间合并
- 命名空间的实际应用

## 2. 🫧 评价

使用 declare 声明命名空间可以为全局对象和第三方库提供结构化的类型定义。

- declare namespace 主要用于组织全局 API 的类型声明
- 支持嵌套命名空间，可以构建层次化的类型结构
- 可以与类、函数、枚举合并，提供更丰富的类型信息
- 在现代 TypeScript 中，ES 模块更受推荐
- 理解命名空间对维护旧代码和使用旧库很重要

## 3. 🤔 如何使用 declare 声明命名空间？

declare namespace 用于声明全局命名空间的类型。

### 3.1. 基本语法

```ts
// 声明命名空间
declare namespace MyLibrary {
  function init(config: object): void
  function destroy(): void

  const version: string

  interface Config {
    apiUrl: string
    timeout: number
  }
}

// 使用命名空间成员
MyLibrary.init({ apiUrl: 'https://api.example.com', timeout: 5000 })
console.log(MyLibrary.version)
MyLibrary.destroy()
```

### 3.2. 命名空间中的各种成员

```ts
// 包含多种成员的命名空间
declare namespace Utils {
  // 函数
  function formatDate(date: Date): string
  function parseDate(str: string): Date

  // 变量
  const DEFAULT_FORMAT: string
  let currentLocale: string

  // 接口
  interface DateFormat {
    year: string
    month: string
    day: string
  }

  // 类型别名
  type Timestamp = number

  // 类
  class DateFormatter {
    constructor(format: string)
    format(date: Date): string
  }

  // 枚举
  enum Locale {
    EN = 'en',
    ZH = 'zh',
    JA = 'ja',
  }
}

// 使用
Utils.formatDate(new Date())
console.log(Utils.DEFAULT_FORMAT)
const formatter = new Utils.DateFormatter('YYYY-MM-DD')
const locale: Utils.Locale = Utils.Locale.EN
```

### 3.3. 命名空间分组

```ts
// API 相关的命名空间
declare namespace API {
  interface Response<T> {
    data: T
    status: number
    message: string
  }

  interface RequestConfig {
    url: string
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    headers?: Record<string, string>
  }

  function request<T>(config: RequestConfig): Promise<Response<T>>
}

// 使用
API.request<{ id: number; name: string }>({
  url: '/users',
  method: 'GET',
}).then((response) => {
  console.log(response.data)
})
```

## 4. 🤔 如何声明嵌套命名空间？

命名空间可以嵌套，形成层次结构。

### 4.1. 基本嵌套

```ts
// 嵌套命名空间
declare namespace App {
  namespace Models {
    interface User {
      id: number
      name: string
    }

    interface Post {
      id: number
      title: string
      author: User
    }
  }

  namespace Services {
    class UserService {
      getUser(id: number): Promise<Models.User>
      createUser(data: Partial<Models.User>): Promise<Models.User>
    }

    class PostService {
      getPost(id: number): Promise<Models.Post>
    }
  }

  namespace Utils {
    function serialize<T>(obj: T): string
    function deserialize<T>(json: string): T
  }
}

// 使用
const userService = new App.Services.UserService()
userService.getUser(1).then((user) => {
  console.log(user.name)
})

const serialized = App.Utils.serialize({ name: 'Alice' })
```

### 4.2. 多层嵌套

```ts
// 深层嵌套
declare namespace Company {
  namespace Department {
    namespace Engineering {
      interface Developer {
        name: string
        level: 'junior' | 'mid' | 'senior'
      }

      namespace Frontend {
        interface ReactDeveloper extends Developer {
          reactVersion: string
        }
      }

      namespace Backend {
        interface NodeDeveloper extends Developer {
          nodeVersion: string
        }
      }
    }
  }
}

// 使用
const dev: Company.Department.Engineering.Frontend.ReactDeveloper = {
  name: 'Alice',
  level: 'senior',
  reactVersion: '18.0',
}
```

### 4.3. 命名空间别名

```ts
// 为长命名空间创建别名
declare namespace VeryLongNamespace {
  namespace DeepNested {
    namespace AnotherLevel {
      interface SomeType {
        value: string
      }

      function someFunction(): void
    }
  }
}

// 使用别名简化访问
import Alias = VeryLongNamespace.DeepNested.AnotherLevel

const value: Alias.SomeType = { value: 'test' }
Alias.someFunction()
```

## 5. 🤔 如何声明命名空间与类、函数的合并？

命名空间可以与类、函数合并，提供额外的静态成员。

### 5.1. 命名空间与类合并

```ts
// 类声明
declare class Calculator {
  add(a: number, b: number): number
  subtract(a: number, b: number): number
}

// 命名空间与类合并（添加静态成员）
declare namespace Calculator {
  export const PI: number
  export const E: number

  export function abs(value: number): number
  export function pow(base: number, exponent: number): number
}

// 使用
const calc = new Calculator()
calc.add(1, 2) // 实例方法

Calculator.PI // 静态成员
Calculator.abs(-5) // 静态方法
```

### 5.2. 命名空间与函数合并

```ts
// 函数声明
declare function jQuery(selector: string): any

// 命名空间与函数合并
declare namespace jQuery {
  export const version: string

  export function ajax(settings: {
    url: string
    method?: string
    data?: any
  }): Promise<any>

  export interface Event {
    type: string
    target: any
  }
}

// 使用
jQuery('#app') // 作为函数调用
jQuery.version // 访问命名空间成员
jQuery.ajax({ url: '/api/data' }) // 命名空间方法
```

### 5.3. 命名空间与枚举合并

```ts
// 枚举声明
declare enum Color {
  Red,
  Green,
  Blue,
}

// 命名空间与枚举合并
declare namespace Color {
  export function toHex(color: Color): string
  export function fromHex(hex: string): Color
}

// 使用
const red = Color.Red // 枚举值
const hex = Color.toHex(red) // 命名空间方法
```

### 5.4. 实际应用示例

```ts
// Express 风格的库声明
declare function express(): express.Application

declare namespace express {
  // 接口
  interface Request {
    params: any
    query: any
    body: any
  }

  interface Response {
    send(body: any): void
    json(obj: any): void
    status(code: number): Response
  }

  interface Application {
    get(path: string, handler: RequestHandler): void
    post(path: string, handler: RequestHandler): void
    listen(port: number, callback?: () => void): void
  }

  type RequestHandler = (req: Request, res: Response) => void

  // 静态方法
  function Router(): Router

  interface Router {
    get(path: string, handler: RequestHandler): void
    post(path: string, handler: RequestHandler): void
  }
}

// 使用
const app = express() // 调用函数

app.get('/', (req, res) => {
  // 使用接口
  res.send('Hello')
})

const router = express.Router() // 使用命名空间成员
```

### 5.5. jQuery 完整示例

```ts
// jQuery 的类型声明
declare function $(selector: string): JQuery
declare function $(element: Element): JQuery
declare function $(callback: () => void): void

declare namespace $ {
  // 工具方法
  function ajax(settings: AjaxSettings): JQueryXHR
  function get(url: string, data?: any): JQueryXHR
  function post(url: string, data?: any): JQueryXHR

  // 属性
  const fn: JQuery

  // 接口
  interface AjaxSettings {
    url: string
    method?: string
    data?: any
    success?: (data: any) => void
    error?: (error: any) => void
  }

  interface JQueryXHR {
    done(callback: (data: any) => void): JQueryXHR
    fail(callback: (error: any) => void): JQueryXHR
  }
}

interface JQuery {
  html(content?: string): any
  css(prop: string, value?: string): any
  on(event: string, handler: (e: Event) => void): JQuery
}

// 使用
$('#app').html('Hello') // 选择器
$(document.body).css('color', 'red') // 元素
$(() => console.log('ready')) // 回调

$.ajax({
  // 命名空间方法
  url: '/api/data',
  success: (data) => console.log(data),
})
```

## 6. 🔗 引用

- [TypeScript Handbook - Namespaces][1]
- [Declaration Files - Namespaces][2]
- [Declaration Merging][3]
- [Ambient Namespaces][4]

[1]: https://www.typescriptlang.org/docs/handbook/namespaces.html
[2]: https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html#namespaces
[3]: https://www.typescriptlang.org/docs/handbook/declaration-merging.html
[4]: https://www.typescriptlang.org/docs/handbook/namespaces.html#ambient-namespaces
