# [0051. 类型断言](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0051.%20%E7%B1%BB%E5%9E%8B%E6%96%AD%E8%A8%80)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是 TypeScript 中的类型断言？](#3--什么是-typescript-中的类型断言)
- [4. 🤔 类型断言的使用条件是什么？](#4--类型断言的使用条件是什么)
- [5. 🤔 什么是 as const 断言？](#5--什么是-as-const-断言)
- [6. 🤔 什么是非空断言？](#6--什么是非空断言)
- [7. 🤔 什么是断言函数？](#7--什么是断言函数)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- todo

## 2. 🫧 评价

- todo

## 3. 🤔 什么是 TypeScript 中的类型断言？

类型断言是 TypeScript 提供的一种手段，允许开发者在代码中"断言"某个值的类型，告诉编译器此处的值是什么类型。TypeScript 一旦发现存在类型断言，就不再对该值进行类型推断，而是直接采用断言给出的类型。

```typescript
type T = 'a' | 'b' | 'c'
let foo = 'a'

let bar: T = foo // 报错
```

上面示例中，TypeScript 推断变量 `foo` 的类型是 `string`，而变量 `bar` 的类型是 `'a'|'b'|'c'`，前者是后者的父类型。父类型不能赋值给子类型，所以就报错了。

解决方法就是进行类型断言：

```typescript
type T = 'a' | 'b' | 'c'

let foo = 'a'
let bar: T = foo as T // 正确
```

类型断言有两种语法：

```typescript
// 语法一：<类型>值
<Type>value

// 语法二：值 as 类型
value as Type
```

目前推荐使用语法二，因为它避免了与 JSX 语法的冲突。

## 4. 🤔 类型断言的使用条件是什么？

类型断言并不意味着可以把某个值断言为任意类型。类型断言的使用前提是，值的实际类型与断言的类型必须满足一个条件：

```typescript
expr as T
```

`expr`是实际的值，`T`是类型断言，它们必须满足下面的条件：`expr`是`T`的子类型，或者`T`是`expr`的子类型。

也就是说，类型断言要求实际的类型与断言的类型兼容，实际类型可以断言为一个更加宽泛的类型（父类型），也可以断言为一个更加精确的类型（子类型），但不能断言为一个完全无关的类型。

如果真的要断言成一个完全无关的类型，可以连续进行两次类型断言：

```typescript
// 或者写成 <T><unknown>expr
expr as unknown as T
```

下面是例子：

```typescript
const n = 1
const m: string = n as unknown as string // 正确
```

## 5. 🤔 什么是 as const 断言？

`as const`是一种特殊的类型断言，用于告诉编译器，推断类型时，可以将这个值推断为常量：

```typescript
let s = 'JavaScript' as const
```

使用了`as const`断言以后，let 变量就等同于是用 const 命令声明的，变量的类型会被推断为值类型：

```typescript
let s = 'JavaScript' as const
type Lang = 'JavaScript' | 'TypeScript' | 'Python'

function setLang(language: Lang) {
  /* ... */
}

setLang(s) // 正确
```

`as const`断言只能用于字面量，不能用于变量：

```typescript
let s = 'JavaScript'
setLang(s as const) // 报错
```

`as const`也可以用于整个对象或对象的单个属性：

```typescript
const v1 = {
  x: 1,
  y: 2,
} // 类型是 { x: number; y: number; }

const v2 = {
  x: 1 as const,
  y: 2,
} // 类型是 { x: 1; y: number; }

const v3 = {
  x: 1,
  y: 2,
} as const // 类型是 { readonly x: 1; readonly y: 2; }
```

## 6. 🤔 什么是非空断言？

对于那些可能为空的变量（即可能等于`undefined`或`null`），TypeScript 提供了非空断言，保证这些变量不会为空，写法是在变量名后面加上感叹号`!`：

```typescript
function f(x?: number | null) {
  validateNumber(x) // 自定义函数，确保 x 是数值
  console.log(x!.toFixed())
}
```

非空断言在实际编程中很有用，有时可以省去一些额外的判断：

```typescript
const root = document.getElementById('root')!
```

非空断言还可以用于赋值断言，解决类属性必须初始化的问题：

```typescript
class Point {
  x!: number // 正确
  y!: number // 正确

  constructor(x: number, y: number) {
    // ...
  }
}
```

## 7. 🤔 什么是断言函数？

断言函数是一种特殊函数，用于保证函数参数符合某种类型。如果函数参数达不到要求，就会抛出错误，中断程序执行；如果达到要求，就不进行任何操作，让代码按照正常流程运行：

```typescript
function isString(value: unknown): void {
  if (typeof value !== 'string') throw new Error('Not a string')
}
```

TypeScript 3.7 引入了新的类型写法来更清晰地表达断言函数：

```typescript
function isString(value: unknown): asserts value is string {
  if (typeof value !== 'string') throw new Error('Not a string')
}
```

使用了断言函数的新写法以后，TypeScript 就会自动识别，只要执行了该函数，对应的变量都为断言的类型。

如果要断言参数非空，可以使用工具类型`NonNullable<T>`：

```typescript
function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(`${value} is not defined`)
  }
}
```

如果要断言某个参数保证为真（即不等于`false`、`undefined`和`null`），TypeScript 提供了断言函数的一种简写形式：

```typescript
function assert(x: unknown): asserts x {
  if (!x) {
    throw new Error(`${x} should be a truthy value.`)
  }
}
```
