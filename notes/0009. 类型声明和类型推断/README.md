# [0009. 类型声明和类型推断](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0009.%20%E7%B1%BB%E5%9E%8B%E5%A3%B0%E6%98%8E%E5%92%8C%E7%B1%BB%E5%9E%8B%E6%8E%A8%E6%96%AD)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 类型声明、类型注解、Type Annotations、Type Declaration 分别是什么？](#3--类型声明类型注解type-annotationstype-declaration-分别是什么)
- [4. 🤔 类型声明的具体规则是什么？](#4--类型声明的具体规则是什么)
- [5. 🤔 类型声明的作用是什么？](#5--类型声明的作用是什么)
- [6. 🤔 类型声明是必需的吗？](#6--类型声明是必需的吗)
- [7. 🤔 如何处理迁移过程中的类型错误？](#7--如何处理迁移过程中的类型错误)
- [8. 🤔 所有变量在 TypeScript 中都有类型吗？](#8--所有变量在-typescript-中都有类型吗)
- [9. 🤔 TypeScript 能自动推断类型吗？](#9--typescript-能自动推断类型吗)
- [10. 🤔 什么情况下 TS 无法完成类型推断？](#10--什么情况下-ts-无法完成类型推断)
  - [10.1. 函数参数没有初始值](#101-函数参数没有初始值)
  - [10.2. 变量先声明后赋值（延迟初始化）](#102-变量先声明后赋值延迟初始化)
  - [10.3. 从 any 类型派生的值](#103-从-any-类型派生的值)
  - [10.4. 复杂的泛型或高阶函数返回类型](#104-复杂的泛型或高阶函数返回类型)
  - [10.5. 对象字面量的"新鲜性"限制（Freshness）](#105-对象字面量的新鲜性限制freshness)
  - [10.6. 最佳实践建议](#106-最佳实践建议)
- [11. 🤔 Type Annotations （类型注解）和 Type Declarations （类型声明）有什么区别？](#11--type-annotations-类型注解和-type-declarations-类型声明有什么区别)
- [12. 🤔 有必要区分"类型注解"和"类型声明"吗？](#12--有必要区分类型注解和类型声明吗)
- [13. 🤔 为什么要刻意记录"Type Annotations"、"Type Declaration"这俩玩意儿？](#13--为什么要刻意记录type-annotationstype-declaration这俩玩意儿)
- [14. 🔗 引用](#14--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 类型声明
- 类型注解
- Type Annotations
- 类型推断

## 2. 🫧 评价

- 类型声明不是必需的，如果我们没有手动声明类型，TS 会根据已知信息自动帮我们推断数据的类型。
  - 这一点我们知道就好，在写代码的时候，建议还是写明类型信息更好，不要依赖 TS 来帮你自动推断类型，一方面是不直观、另一方面是这玩意儿其实也不太可靠。
  - 除非那些特别明显的推断，比如 `let foo = 123;` 和 `let foo: number = 123;`，更推荐前者。
- 本节笔记还提到了有关 JS 项目迁移到 TS 项目的一些做法，如果有项目迁移的需求，或许可以参考一下。

## 3. 🤔 类型声明、类型注解、Type Annotations、Type Declaration 分别是什么？

- 描述的都是一个意思，只是叫法不同罢了。
- TypeScript 代码最明显的特征是为 JavaScript 变量加上了类型声明/注解。
- 类型声明的写法一律为在标识符后面添加"冒号 + 类型"。
- 函数参数和返回值也采用相同的方式声明类型。

```typescript
let foo: string

function toString(num: number): string {
  return String(num)
}
```

## 4. 🤔 类型声明的具体规则是什么？

- 如果变量的值与声明的类型不一致，TS 会报错。
- 如果在变量被赋值之前访问变量，TS 会报错。
  - TypeScript 规定变量只有赋值后才能使用，否则就会报错。
  - 这与 JavaScript 不同，JavaScript 允许这种行为，未赋值的变量会返回 `undefined`。

```typescript
let foo: string = 123 // ❌ Type 'number' is not assignable to type 'string'.(2322)

let x: number
console.log(x) // ❌ Variable 'x' is used before being assigned.(2454)
```

这部分内容准确地描述了 TypeScript 中类型声明的两个重要规则：

1. 类型一致性规则：变量的值必须与声明的类型一致。
2. 初始化规则：变量必须在使用前被赋值。

## 5. 🤔 类型声明的作用是什么？

- 向编译器提供变量、函数参数、函数返回值等的类型信息
- 编译器根据这些类型信息进行类型检查，确保代码运行时不出现类型错误
- 确保在使用值时遵循正确的类型约束
- 当违反类型约束时，编译器会在编译期间发出警告或错误，帮助提前发现问题

## 6. 🤔 类型声明是必需的吗？

- 不是必需的，类型声明在 TypeScript 中是可选的。
- 这样设计还有一个好处，将以前的 JavaScript 项目改为 TypeScript 项目时，你可以逐步地为老代码添加类型，即使有些代码没有添加，也不会无法运行。
- 可以直接将没有任何类型信息的 `*.js` 项目改为 `*.ts` 项目（比如在做 JS -> TS 项目迁移的时候）。
  - 即使不加类型声明，所有 JavaScript 代码依然是有效的 TypeScript 代码。
  - 类型错误大概率是会有不少的，不过这些类型上的错误并不影响程序的最终运行逻辑，你可以通过配置将这些错误给忽略掉，有空时逐步处理类型错误即可。

## 7. 🤔 如何处理迁移过程中的类型错误？

- 如果某一行不想要 TS 处理，可以在这一行上边儿添加 `// @ts-ignore`
- 如果某一个模块不想要 TS 处理，可以在模块头部添加 `// @ts-nocheck`
- 如果有大量模块不想要 TS 处理，可以在 tsconfig.json 中配置 exclude 忽略特定文件，让 TS 不处理这些模块。
- 如果在 ts 编译为 js 过程中遇到类型错误导致编译无法通过，可通过 `compilerOptions.noEmitOnError: false` 配置解决。

::: tip 迁移

- 迁移中遇到的很多细节问题，TS 其实都已考虑到，可查阅官方文档寻找更多解决方案。

:::

## 8. 🤔 所有变量在 TypeScript 中都有类型吗？

- 是的，所有变量都一定有类型。
- 如果不手动显示写明变量类型，系统会根据提供的已知信息自行推导变量类型。
- 如果推不出来，则默认为 any 类型。
  - 这是 TypeScript 类型推导的知识点，具体的推导规则，还跟 tsconfig.json 配置有关。

## 9. 🤔 TypeScript 能自动推断类型吗？

- TS 会尽力而为地推断类型，但不确保一定能推断准确。
- 如果 TS 能够根据代码推断出值的类型信息，可以不显式声明类型。
  - 例如 `let foo = 123` 等价于 `let foo: number = 123`，因为 TS 能推断出 123 是 number 类型。
- 如果 TS 无法推断出具体类型信息，则会根据配置做出不同处理。

```typescript
// 可以不显示地注解返回值类型为 string
function toString(num: number) {
  return String(num)
}

// 等效于
// function toString(num:number): string {
//   return String(num);
// }
// 因为 TypeScript 知道 String(num) 是一个 string 类型

let foo = 123
// 等效：let foo: number = 123;

// 变量 foo 并没有类型声明，TypeScript 就会推断它的类型
// 由于它被赋值为一个数值，因此 TypeScript 推断它的类型为 number
let foo = 123
foo = 'hello' // ❌
// Type 'string' is not assignable to type 'number'.(2322)

// 如果变量 foo 更改为其他类型的值，跟推断的类型不一致，TypeScript 就会报错
// 变量 foo 的类型推断为 number，后面赋值为字符串，TypeScript 就报错了

function toString(num: number) {
  return String(num)
}
// 等效：
// function toString(num: number): string {
//   return String(num);
// }

// 函数 toString() 没有声明返回值的类型，但是 TypeScript 知道 String(...) 返回的是字符串
// 所以它推断出 toString 的返回值类型是字符串类型
// 正是因为 TypeScript 的类型推断，所以函数返回值的类型通常是省略不写的
```

## 10. 🤔 什么情况下 TS 无法完成类型推断？

- 情况有很多，很难全部列举出来，这里主要记录一些经典的场景。

| 场景 | 原因 | 解决方案 |
| --- | --- | --- |
| 函数参数 | 无初始值，调用与定义分离 | 显式声明类型 |
| 延迟初始化变量 | 声明时无值 | 声明时加类型注解 |
| 涉及 any | 类型信息丢失 | 避免 any，使用断言或接口 |
| 复杂泛型/高阶函数 | 推断过于宽泛 | 显式指定返回类型 |
| 对象字面量的"新鲜性"限制 | 间接赋值中丢失精确类型 | 显式注解类型 |

- 可以通过 IDE（如 VSCode）将鼠标悬停在成员上来判断 TS 是否完成了类型推断。
  - 如果推断成功，会显示具体的类型。
  - 如果推断失败，通常会显示 any 类型，意味着任意类型都可以。

```typescript
// 悬停 a → 显示 `any`（推断失败）
function foo(a) {
  return a + 1
}

let x = 10 // 悬停 x → 显示 `number`（推断成功）

let user // 推断为 any
user = { name: 'Alice' }

// TS 是静态类型，在声明变量的时候就需要明确好变量的类型，并且之后类型不会改变
// 由于在声明的时候没有赋值，所以 TS 推断不出 user 的类型

function sum(a: number, b: number) {
  return a + b
}

// function sum(a: number, b: number): number
// 由于 a 和 b 都是 number 类型，因此 TS 能够推断出 sum 的返回值 a + b 必然也是 number 类型
```

- 小技巧：
  - 对于无法推断出具体类型的变量，IDE 会在成员的左下角标注 `...` 提醒我们。
  - 下面是来自 TS Playground 的截图。
  - ![图 0](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-15-20-14-33.png)
- 除了这个技巧之外，再就是我们自行通过逻辑来判断了，你可以这么理解：
  - TS 团队：我们会想办法尽可能帮你完成类型推断的，让你可以专注于业务逻辑的开发，而不被无意义的类型标注影响。但是，确实没法推断出类型的，我们也没办法，只能给个宽泛的类型了。
  - 在你具体程序的上下文中，某个成员的类型一定是 `xxx` 的话，那么 TS 大概率都是能推断出来的。
  - 也就是说，如果确实能够逻辑自洽的推断出类型，那么 TS 就会帮我们完成推断，否则就是推断不了。

### 10.1. 函数参数没有初始值

- 函数参数的类型完全依赖调用时传入的值，而声明时没有上下文，TS 无法推断。
- 原因：函数定义和调用是分离的，TS 在定义处看不到未来会传什么。

```ts
// ❌ 错误：参数隐式具有 'any' 类型（strict 模式下报错）
function greet(name) {
  console.log('Hello, ' + name.toUpperCase())
}

// 必须显式声明：
function greet(name: string) { ... }
```

### 10.2. 变量先声明后赋值（延迟初始化）

- 如果变量声明时没有初始化，TS 无法知道它将来会是什么类型。

```ts
let user // 推断为 any（非 strict）或报错（strict）
user = { name: 'Alice' }

// 正确做法：
let user: { name: string } | null = null
// 或使用接口
interface User {
  name: string
}
let user: User | null = null
```

### 10.3. 从 any 类型派生的值

- 一旦涉及 any，类型信息就"污染"了，TS 无法继续安全推断。

```ts
const data: any = fetchData() // 假设返回 { id: 1, name: "Bob" }
const id = data.id // id 的类型是 any！

// 正确做法：避免 any，使用类型断言或泛型。
interface User {
  id: number
  name: string
}
const data = fetchData() as User
const id = data.id // number ✅
```

### 10.4. 复杂的泛型或高阶函数返回类型

- 当函数返回类型依赖泛型且逻辑复杂时，TS 可能推断不准确或过于宽泛。

```ts
function createPair<T>(a: T) {
  return [a, a] // 推断为 T[]，但你可能想要 [T, T]（元组）
}

const pair = createPair('hello') // 类型是 string[]，不是 ["hello", "hello"]

// 显式指定返回类型：
function createPair<T>(a: T): [T, T] {
  return [a, a]
}
```

### 10.5. 对象字面量的"新鲜性"限制（Freshness）

- TS 对对象字面量有"多余属性检查"，但在某些间接赋值中会丢失精确类型。

```ts
interface Point {
  x: number
  y: number
}

const p = { x: 1, y: 2, z: 3 } // p 的类型是 { x: number; y: number; z: number }
const point: Point = p // ✅ OK（因为 p 不是字面量，是变量）

// 但如果你希望 p 严格符合 Point，TS 不会自动约束 z
// 如果需要精确类型，应显式注解：
const p: Point = { x: 1, y: 2 } // 此时写 z 会报错
```

### 10.6. 最佳实践建议

- 开启严格模式 - `strict: true`（尤其是 `noImplicitAny`），让 TS 在无法推断时直接报错，避免隐式 `any`。
- 对公共 API、函数签名、复杂对象显式加类型，提高可读性和安全性。
- 局部简单变量可依赖推断，减少冗余。

这样既能享受 TS 的智能推断，又能避免类型"黑洞"。

## 11. 🤔 Type Annotations （类型注解）和 Type Declarations （类型声明）有什么区别？

- 类型声明和类型注解都是用于指定变量或函数类型的方式，但使用场景和目的不同。
- 类型注解
  - 类型注解是在编写代码时明确指定变量、函数参数、函数返回值等的类型。
  - 通常写在 `.ts` 或 `.tsx` 这样的模块中，这些模块即包含类型信息，又包含程序运行逻辑的具体实现。
- 类型声明
  - 类型声明用于声明自定义类型或给已有类型添加类型信息。
  - 通常写在 `.d.ts` 模块中，包含类型信息但不包含实现代码。
  - 类型声明可以为第三方库添加类型信息，使其在 TypeScript 中获得类型检查和自动完成功能。

## 12. 🤔 有必要区分"类型注解"和"类型声明"吗？

- 实际上没有太大必要严格区分
- 很多在线文档中，人们经常将两者混用
- 可以粗暴点 -> 类型注解 = 类型声明

## 13. 🤔 为什么要刻意记录"Type Annotations"、"Type Declaration"这俩玩意儿？

- 因为这俩是官方术语 "Type Annotations"、"Type Declaration"，与官方文档中的术语保持一致，有助于快速查阅相关内容。
- 比如，要在 TypeScript 官方文档中查找变量类型注解相关内容（比如如何给变量标注类型），应使用关键字 annotations 查询，而不是 declaration。
- 比如，要在 TypeScript 官方文档中查找类型声明文件（`.d.ts` 文件）的相关内容，应找 declaration files。

::: swiper

![annotations](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-15-20-18-04.png)

![declaration](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-15-20-18-11.png)

:::

## 14. 🔗 引用

- [TS 官方文档，Type annotations][1]
- [TS 官方文档，Type Annotations on Variables][2]

[1]: https://www.typescriptlang.org/docs/handbook/typescript-tooling-in-5-minutes.html#type-annotations
[2]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-annotations-on-variables
