# [0142. 动态导入](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0142.%20%E5%8A%A8%E6%80%81%E5%AF%BC%E5%85%A5)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是动态导入？](#3--什么是动态导入)
- [4. 🤔 动态导入的语法是什么？](#4--动态导入的语法是什么)
- [5. 🤔 动态导入和静态导入有什么区别？](#5--动态导入和静态导入有什么区别)
- [6. 🤔 动态导入返回的是什么？](#6--动态导入返回的是什么)
- [7. 🤔 如何在 TypeScript 中使用动态导入？](#7--如何在-typescript-中使用动态导入)
- [8. 🤔 动态导入的类型推断是怎样的？](#8--动态导入的类型推断是怎样的)
- [9. 🤔 动态导入的使用场景有哪些？](#9--动态导入的使用场景有哪些)
- [10. 🤔 动态导入在打包时会发生什么？](#10--动态导入在打包时会发生什么)
- [11. 🤔 如何处理动态导入的错误？](#11--如何处理动态导入的错误)
- [12. 🤔 动态导入可以导入类型吗？](#12--动态导入可以导入类型吗)
- [13. 🤔 动态导入有什么限制？](#13--动态导入有什么限制)
- [14. 🤔 最佳实践是什么？](#14--最佳实践是什么)
- [15. 🔗 引用](#15--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 动态导入（Dynamic Import）
- import() 表达式
- 代码分割（Code Splitting）
- 懒加载（Lazy Loading）
- 类型推断和错误处理

## 2. 🫧 评价

- 动态导入是 ES2020 引入的特性，TypeScript 从 2.4 版本开始支持。
- 动态导入允许我们在运行时按需加载模块，而不是在编译时静态导入所有模块。
- 理解动态导入有助于：
  - 优化应用性能（减少初始加载时间）
  - 实现代码分割和懒加载
  - 根据条件动态加载模块
  - 提升用户体验
- 在现代前端开发中，动态导入是实现高性能应用的重要手段，特别是在 React、Vue 等框架中广泛使用。

## 3. 🤔 什么是动态导入？

动态导入是一种在运行时加载模块的机制，使用 `import()` 函数实现。与静态导入（`import` 语句）不同，动态导入可以在代码的任何位置调用，并返回一个 Promise。

静态导入示例：

```ts
// 静态导入：在模块顶层，编译时确定
import { User } from './user'

// 必须在模块顶层使用
// 不能在条件语句或函数内部使用
```

动态导入示例：

```ts
// 动态导入：可以在任何位置，运行时执行
async function loadUser() {
  const userModule = await import('./user')
  const user = new userModule.User()
}

// 可以在条件语句中使用
if (condition) {
  import('./feature').then((module) => {
    // 使用模块
  })
}
```

## 4. 🤔 动态导入的语法是什么？

动态导入使用 `import()` 函数，它返回一个 Promise。

基本语法：

```ts
// 方式 1: 使用 async/await
async function loadModule() {
  const module = await import('./module')
  module.someFunction()
}

// 方式 2: 使用 Promise
import('./module').then((module) => {
  module.someFunction()
})

// 方式 3: 使用 Promise.all 并行加载多个模块
async function loadModules() {
  const [moduleA, moduleB] = await Promise.all([
    import('./moduleA'),
    import('./moduleB'),
  ])
}
```

导入默认导出：

```ts
// module.ts
export default class User {
  name: string
}

// app.ts
async function loadUser() {
  const module = await import('./module')
  const User = module.default // 默认导出在 default 属性上
  const user = new User()
}
```

导入命名导出：

```ts
// utils.ts
export function add(a: number, b: number) {
  return a + b
}
export function subtract(a: number, b: number) {
  return a - b
}

// app.ts
async function loadUtils() {
  const { add, subtract } = await import('./utils')
  console.log(add(1, 2))
}
```

## 5. 🤔 动态导入和静态导入有什么区别？

| 特性         | 静态导入              | 动态导入                       |
| ------------ | --------------------- | ------------------------------ |
| 语法         | `import X from './m'` | `import('./m')`                |
| 执行时机     | 编译时                | 运行时                         |
| 返回值       | 直接返回模块内容      | 返回 Promise                   |
| 使用位置     | 只能在模块顶层        | 可以在任何位置                 |
| 条件加载     | 不支持                | 支持                           |
| 代码分割     | 不会自动分割          | 自动创建单独的 chunk           |
| 类型推断     | 完整的类型信息        | 需要类型断言或泛型             |
| Tree-shaking | 支持                  | 支持（但效果可能不如静态导入） |

示例对比：

```ts
// 静态导入
import { User } from './user' // 编译时就加载
const user = new User()

// 动态导入
const loadUser = async () => {
  const { User } = await import('./user') // 运行时才加载
  const user = new User()
}

// 静态导入不能在条件语句中使用
if (condition) {
  import { User } from './user' // ❌ 语法错误
}

// 动态导入可以在条件语句中使用
if (condition) {
  import('./user').then(({ User }) => {
    // ✅ 正确
    const user = new User()
  })
}
```

## 6. 🤔 动态导入返回的是什么？

`import()` 返回一个 Promise，该 Promise 解析为模块对象。

模块对象包含所有导出的成员：

```ts
// user.ts
export class User {
  name: string
}
export const userConfig = {
  maxAge: 100,
}
export default function createUser() {
  return new User()
}

// app.ts
const module = await import('./user')

// module 的结构：
// {
//   User: class User { ... },
//   userConfig: { maxAge: 100 },
//   default: function createUser() { ... }
// }

// 使用命名导出
const user = new module.User()
console.log(module.userConfig.maxAge)

// 使用默认导出
const createUser = module.default
const user2 = createUser()
```

解构导入：

```ts
// 可以直接解构需要的成员
const { User, userConfig } = await import('./user')
const user = new User()

// 也可以解构默认导出（注意要用 default）
const { default: createUser } = await import('./user')
const user = createUser()
```

## 7. 🤔 如何在 TypeScript 中使用动态导入？

TypeScript 完全支持动态导入，并能提供类型推断。

基本使用：

```ts
// user.ts
export interface User {
  name: string
  age: number
}

export function createUser(name: string): User {
  return { name, age: 0 }
}

// app.ts
async function loadUser() {
  // TypeScript 会自动推断 module 的类型
  const module = await import('./user')

  // module.createUser 有完整的类型信息
  const user = module.createUser('Alice') // user: User
}
```

使用类型注解：

```ts
// 可以显式指定模块类型
type UserModule = typeof import('./user')

async function loadUser() {
  const module: UserModule = await import('./user')
  const user = module.createUser('Alice')
}
```

处理默认导出：

```ts
// utils.ts
export default function add(a: number, b: number): number {
  return a + b
}

// app.ts
async function loadUtils() {
  const module = await import('./utils')
  const add = module.default
  console.log(add(1, 2)) // add 有完整的类型信息
}
```

## 8. 🤔 动态导入的类型推断是怎样的？

TypeScript 能够自动推断动态导入的类型，但在某些情况下需要手动指定类型。

自动类型推断：

```ts
// math.ts
export function add(a: number, b: number): number {
  return a + b
}

// app.ts
async function test() {
  const math = await import('./math')

  // TypeScript 自动推断 math.add 的类型
  const result = math.add(1, 2) // result: number

  // 如果传入错误的参数类型，会报错
  math.add('1', '2') // ❌ 类型错误
}
```

使用 `typeof import()` 获取模块类型：

```ts
// user.ts
export interface User {
  name: string
}
export function createUser(): User {
  return { name: 'Alice' }
}

// app.ts
// 获取模块类型
type UserModule = typeof import('./user')

// 使用模块类型
async function loadUser(): Promise<UserModule> {
  return await import('./user')
}

// 获取模块中特定导出的类型
type CreateUserFn = typeof import('./user')['createUser']
```

条件类型推断：

```ts
// 根据条件动态导入不同模块
async function loadModule(type: 'a' | 'b') {
  if (type === 'a') {
    const module = await import('./moduleA')
    return module // TypeScript 知道这是 moduleA
  } else {
    const module = await import('./moduleB')
    return module // TypeScript 知道这是 moduleB
  }
}
```

## 9. 🤔 动态导入的使用场景有哪些？

按需加载功能模块

只有当用户需要某个功能时才加载对应的代码。

```ts
// 用户点击按钮时才加载图表库
async function showChart() {
  const { Chart } = await import('chart.js')
  new Chart(ctx, config)
}

button.addEventListener('click', showChart)
```

条件加载

根据运行时条件决定加载哪个模块。

```ts
// 根据用户的语言设置加载对应的语言包
async function loadLocale(lang: string) {
  if (lang === 'zh') {
    return await import('./locales/zh.json')
  } else if (lang === 'en') {
    return await import('./locales/en.json')
  }
}

const locale = await loadLocale(userLanguage)
```

路由懒加载

在单页应用中，只有访问某个路由时才加载对应的组件。

```ts
// React Router 示例
import { lazy } from 'react'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))

// Vue Router 示例
const routes = [
  {
    path: '/home',
    component: () => import('./pages/Home.vue'),
  },
  {
    path: '/about',
    component: () => import('./pages/About.vue'),
  },
]
```

减少初始包大小

将不常用的功能代码分离出去，减少主包大小。

```ts
// 只有在需要导出功能时才加载导出相关的库
async function exportData() {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF()
  // 导出 PDF
}
```

Polyfill 按需加载

根据浏览器是否支持某个特性来决定是否加载 polyfill。

```ts
async function loadPolyfills() {
  if (!('IntersectionObserver' in window)) {
    await import('intersection-observer')
  }

  if (!('fetch' in window)) {
    await import('whatwg-fetch')
  }
}
```

A/B 测试

根据实验分组加载不同版本的功能。

```ts
async function loadFeature(experimentGroup: 'A' | 'B') {
  if (experimentGroup === 'A') {
    const { FeatureA } = await import('./features/FeatureA')
    return new FeatureA()
  } else {
    const { FeatureB } = await import('./features/FeatureB')
    return new FeatureB()
  }
}
```

## 10. 🤔 动态导入在打包时会发生什么？

现代打包工具（如 Webpack、Vite、Rollup）会将动态导入的模块分离成独立的代码块（chunk）。

Webpack 的代码分割：

```ts
// 源代码
async function loadChart() {
  const { Chart } = await import('chart.js')
  return new Chart(ctx, config)
}

// 打包后会生成：
// - main.js（主包）
// - chunk-chartjs.js（chart.js 单独的 chunk）

// 当 import('chart.js') 执行时，浏览器会动态加载 chunk-chartjs.js
```

Magic Comments（魔法注释）

可以使用特殊注释来控制代码分割的行为。

```ts
// webpackChunkName: 指定 chunk 的名称
import(
  /* webpackChunkName: "my-chart" */
  'chart.js'
)

// webpackPrefetch: 预加载（空闲时加载）
import(
  /* webpackPrefetch: true */
  './optional-feature'
)

// webpackPreload: 预先加载（与父 chunk 并行加载）
import(
  /* webpackPreload: true */
  './critical-feature'
)

// 组合使用
import(
  /* webpackChunkName: "my-feature" */
  /* webpackPrefetch: true */
  './feature'
)
```

Vite 的代码分割：

```ts
// Vite 会自动进行代码分割，无需特殊配置
const module = await import('./feature')

// 可以使用 ?url 获取模块 URL
import moduleUrl from './module?url'
```

## 11. 🤔 如何处理动态导入的错误？

动态导入返回 Promise，因此可以使用 Promise 的错误处理机制。

使用 try-catch：

```ts
async function loadModule() {
  try {
    const module = await import('./module')
    module.doSomething()
  } catch (error) {
    console.error('模块加载失败:', error)
    // 显示错误提示或加载备用方案
  }
}
```

使用 .catch()：

```ts
import('./module')
  .then((module) => {
    module.doSomething()
  })
  .catch((error) => {
    console.error('模块加载失败:', error)
  })
```

提供降级方案：

```ts
async function loadFeature() {
  try {
    const module = await import('./advanced-feature')
    return module.Feature
  } catch (error) {
    console.warn('高级功能加载失败，使用基础功能', error)
    const module = await import('./basic-feature')
    return module.Feature
  }
}
```

重试机制：

```ts
async function loadModuleWithRetry(modulePath: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await import(modulePath)
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error // 达到最大重试次数，抛出错误
      }
      console.warn(`加载失败，第 ${i + 1} 次重试...`)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }
}
```

## 12. 🤔 动态导入可以导入类型吗？

动态导入主要用于导入值（运行时代码），但可以配合 `typeof import()` 来获取类型信息。

获取模块类型：

```ts
// user.ts
export interface User {
  name: string
  age: number
}

export function createUser(name: string): User {
  return { name, age: 0 }
}

// app.ts
// 获取整个模块的类型
type UserModule = typeof import('./user')

// 获取模块中特定成员的类型
type User = typeof import('./user')['User']
type CreateUserFn = typeof import('./user')['createUser']
```

在函数中使用：

```ts
async function processUser() {
  // 运行时导入模块
  const userModule = await import('./user')

  // 使用 typeof 获取类型
  type User = typeof userModule.User

  // 或者使用 Parameters 和 ReturnType 工具类型
  type CreateUserParams = Parameters<typeof userModule.createUser>
  type UserType = ReturnType<typeof userModule.createUser>
}
```

注意事项：

```ts
// ❌ 不能使用 import type 进行动态导入
import type('./module') // 语法错误

// ❌ 不能在类型位置使用 import()
type MyType = import('./module').User // 语法错误

// ✅ 正确的方式
type MyType = typeof import('./module')['User']
```

## 13. 🤔 动态导入有什么限制？

路径必须是字符串字面量或模板字符串

动态导入的路径不能是完全动态的变量，必须包含部分静态信息，以便打包工具分析。

```ts
// ❌ 完全动态的路径（打包工具无法分析）
const moduleName = getUserInput()
import(moduleName) // 打包工具不知道要打包哪些模块

// ✅ 使用模板字符串（打包工具可以分析）
const lang = 'zh'
import(`./locales/${lang}.json`) // 打包工具会打包 locales 下的所有文件

// ✅ 限定范围的动态路径
const modules = {
  a: './moduleA',
  b: './moduleB',
}
import(modules[key]) // 打包工具知道只有这两个可能
```

不能在类型位置使用

```ts
// ❌ 不能直接在类型注解中使用
const module: import('./module') = await import('./module')

// ✅ 使用 typeof import()
const module: typeof import('./module') = await import('./module')
```

性能考虑

动态导入会创建额外的网络请求，过度使用可能影响性能。

```ts
// ❌ 在循环中动态导入（产生大量网络请求）
for (let i = 0; i < 100; i++) {
  const module = await import(`./module${i}`)
  module.doSomething()
}

// ✅ 批量加载
const modules = await Promise.all(
  Array.from({ length: 100 }, (_, i) => import(`./module${i}`))
)
```

某些构建工具可能不支持

虽然主流打包工具都支持动态导入，但在某些旧版本或特殊环境中可能不支持。

```json
// tsconfig.json 需要配置合适的 module 和 target
{
  "compilerOptions": {
    "module": "esnext", // 或 "commonjs"、"amd" 等
    "target": "es2020" // 需要支持 Promise
  }
}
```

## 14. 🤔 最佳实践是什么？

合理使用代码分割

只对真正需要懒加载的功能使用动态导入，不要过度分割。

```ts
// ✅ 合理：大型第三方库
import('monaco-editor')

// ✅ 合理：不常用的功能
import('./admin-panel')

// ❌ 过度：小型工具函数
import('./utils/add') // 这个可以静态导入
```

使用 Magic Comments 优化加载

利用 webpackPrefetch 和 webpackPreload 优化用户体验。

```ts
// 预加载可能需要的功能
import(
  /* webpackPrefetch: true */
  './likely-needed-feature'
)

// 关键路径的并行加载
import(
  /* webpackPreload: true */
  './critical-component'
)
```

提供加载状态和错误处理

动态加载时给用户提供反馈。

```ts
async function loadComponent() {
  setLoading(true)

  try {
    const module = await import('./component')
    setComponent(module.Component)
  } catch (error) {
    setError('加载失败，请刷新重试')
  } finally {
    setLoading(false)
  }
}
```

使用 Suspense（React）

在 React 中使用 Suspense 组件简化懒加载逻辑。

```tsx
import { lazy, Suspense } from 'react'

const LazyComponent = lazy(() => import('./Component'))

function App() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <LazyComponent />
    </Suspense>
  )
}
```

类型安全

使用 TypeScript 的类型推断或显式类型注解确保类型安全。

```ts
// 获取模块类型
type FeatureModule = typeof import('./feature')

async function loadFeature(): Promise<FeatureModule> {
  return await import('./feature')
}
```

避免过度碎片化

不要将代码分割得过于细碎，这会增加 HTTP 请求数量。

```ts
// ❌ 过度碎片化
import('./utils/add')
import('./utils/subtract')
import('./utils/multiply')

// ✅ 合理分组
import('./utils/math') // 包含所有数学工具
```

## 15. 🔗 引用

- [MDN - import()][1]
- [TypeScript 官方文档 - Dynamic Import Expressions][2]
- [Webpack - Code Splitting][3]
- [Vite - Dynamic Import][4]

[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import
[2]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-4.html#dynamic-import-expressions
[3]: https://webpack.js.org/guides/code-splitting/
[4]: https://vitejs.dev/guide/features.html#dynamic-import
