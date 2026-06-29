# [0047. 包装对象类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0047.%20%E5%8C%85%E8%A3%85%E5%AF%B9%E8%B1%A1%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. “包装对象”（wrapper object）是什么？【回顾 JS】](#3-包装对象wrapper-object是什么回顾-js)
- [4. “包装对象类型”（Wrapper Object Types）是什么？](#4-包装对象类型wrapper-object-types是什么)
- [5. “原始类型”和“包装对象类型”是相同的类型吗？是否可以互相赋值呢？](#5-原始类型和包装对象类型是相同的类型吗是否可以互相赋值呢)
- [6. 处理包装对象类型的最佳实践是什么？](#6-处理包装对象类型的最佳实践是什么)
- [7. 引用](#7-引用)

<!-- endregion:toc -->

## 1. 本节内容

- Boolean
- String
- Number
- Symbol
- BigInt

## 2. 评价

- 本节介绍的包装对象类型不重要，简单了解即可。
- 了解这些内容的唯一目的可能就是帮你建立更完整的 TS 类型体系。
- 记住一句话：在 TypeScript 中，永远使用小写的 `string`、`number`、`boolean`，非必要就别用大写的 `String`、`Number`、`Boolean` 作为类型注解。

## 3. “包装对象”（wrapper object）是什么？【回顾 JS】

JavaScript 的 8 种类型之中，`undefined` 和 `null` 其实是两个特殊值，`object` 属于复合类型，剩下的五种属于原始类型（primitive value），代表最基本的、不可再分的值。

- boolean
- string
- number
- bigint
- symbol

上面这五种原始类型的值，都有对应的包装对象（wrapper object）。所谓“包装对象”，指的是这些值在需要时，会自动产生的对象。

```javascript
'hello'.charAt(1) // 'e'
```

上面示例中，字符串 `hello` 执行了 `charAt()` 方法。但是，在 JavaScript 语言中，只有对象才有方法，原始类型的值本身没有方法。这行代码之所以可以运行，就是因为在调用方法时，字符串会自动转为包装对象，`charAt()` 方法其实是定义在包装对象上。

这样的设计大大方便了字符串处理，省去了将原始类型的值手动转成对象实例的麻烦。

五种包装对象之中，symbol 类型和 bigint 类型无法直接获取它们的包装对象（即 `Symbol()` 和 `BigInt()` 不能作为构造函数使用），但是剩下三种可以。

- `Boolean()`
- `String()`
- `Number()`

以上三个构造函数，执行后可以直接获取某个原始类型值的包装对象。

```javascript
const s = new String('hello')
typeof s // 'object'
s.charAt(1) // 'e'
```

上面示例中，`s` 就是字符串 `hello` 的包装对象，`typeof` 运算符返回 `object`，不是 `string`，但是本质上它还是字符串，可以使用所有的字符串方法。

注意，`String()` 只有当作构造函数使用时（即带有 `new` 命令调用），才会返回包装对象。如果当作普通函数使用（不带有 `new` 命令），返回就是一个普通字符串。其他两个构造函数 `Number()` 和 `Boolean()` 也是如此。

## 4. “包装对象类型”（Wrapper Object Types）是什么？

在 JavaScript 中，原始类型（primitive types） 本身没有方法或属性。但当我们对一个字符串调用 `.length` 或 `.toUpperCase()` 时，JavaScript 会临时将原始值包装成一个对象，以便调用方法，用完后立即销毁。这个临时创建的对象，就是包装对象（wrapper object），与之对应的类型，就是包装对象类型（wrapper object types）。

```js
const str = 'hello' // 原始类型 string

// 调用方法时，JS 临时创建 new String("hello")，调用后销毁
console.log(str.toUpperCase()) // "HELLO"

// 但 str 本身仍然是原始类型
console.log(typeof str) // "string"
console.log(str instanceof String) // false
```

如果你显式使用构造函数创建包装对象：

```js
const objStr = new String('hello') // 包装对象
console.log(typeof objStr) // "object"
console.log(objStr instanceof String) // true
console.log(objStr == 'hello') // true（== 会类型转换）
console.log(objStr === 'hello') // false（类型不同）
```

实际开发中，几乎从不手动创建包装对象，因为：

- 性能差（对象比原始值更重）
- 行为怪异（如 `new Boolean(false)` 在 if 中为 true！）

```js
const b = new Boolean(false)
if (b) {
  console.log('This will run!') // 因为 b 是一个对象，对象在布尔上下文中总是 true
}
```

原始类型与包装对象对应关系：

| 原始类型（Primitive） | 包装对象类型（Wrapper Object）            |
| --------------------- | ----------------------------------------- |
| `string`              | `String`                                  |
| `number`              | `Number`                                  |
| `boolean`             | `Boolean`                                 |
| `bigint`              | `BigInt`（`BigInt` 构造函数不能用 `new`） |
| `symbol`              | `Symbol`（`Symbol` 构造函数不能用 `new`） |

::: warning 注意

- `null` 和 `undefined` 没有对应的包装对象。

:::

## 5. “原始类型”和“包装对象类型”是相同的类型吗？是否可以互相赋值呢？

- TypeScript 对原始类型和包装对象类型做了严格区分，比如 `String` 和 `string` 是不同的两个类型。
- TypeScript 允许原始类型赋值给对应的包装对象类型（因为这是一种"向上"的赋值，相对安全），但不允许包装对象类型赋值给原始类型（因为这可能丢失对象的特性）。

```ts
let a: string = 'hello' // ✅ 推荐：原始类型
let b: String = new String('hello') // ⚠️ 不推荐：包装对象类型

// 在 strict 模式下
let s1: string = 'test'
let s2: String = s1 // ✅ 允许

// 在 strict 模式下
let s3: String = new String('test')
let s4: string = s3 // ❌ 错误！Type 'String' is not assignable to type 'string'.
```

原始类型和包装对象类型的关键区别：

| 特性 | 原始类型（推荐） | 包装对象类型（避免） |
| --- | --- | --- |
| 示例 | `string`, `number`, `boolean` | `String`, `Number`, `Boolean` |
| 创建方式 | 字面量：`"hi"`, `42`, `true` | `new String("hi")` |
| `typeof` | `"string"`, `"number"`, `"boolean"` | `"object"` |
| 性能 | 高（栈存储） | 低（堆存储） |
| 类型安全 | 高 | 低（易出错） |
| TypeScript 推荐 | ✅ 是 | ❌ 否 |

## 6. 处理包装对象类型的最佳实践是什么？

下面是官方对 [Number, String, Boolean, Symbol and Object][1] 的描述：

![图 0](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-20-14-13-34.png)

总结下来就俩字 -> 别用。

- 根据官方建议，最佳实践是「别用」包装对象类型。
- TypeScript 鼓励你使用原始类型，这是现代 JavaScript 的标准做法。

```ts
// ✅ 始终使用原始类型：
let name: string = 'Alice'
let age: number = 30
let isActive: boolean = true

// ❌ 避免使用包装对象类型：
let name: String = new String('Alice')
let age: Number = new Number(30)

// 在类型注解中只写小写：string、number、boolean、bigint、symbol
// 不要用 new String()、new Number() 等
```

## 7. 引用

- [Number, String, Boolean, Symbol and Object][1]
  - typescript - declaration files - do's and don'ts

[1]: https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html#number-string-boolean-symbol-and-object
