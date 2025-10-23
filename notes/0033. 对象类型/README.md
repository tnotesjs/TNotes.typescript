# [0033. 对象类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0033.%20%E5%AF%B9%E8%B1%A1%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是 TypeScript 的对象类型？](#3--什么是-typescript-的对象类型)
- [4. 🤔 如何声明对象类型？](#4--如何声明对象类型)
  - [4.1. 多字段的声明](#41-多字段的声明)
  - [4.2. type 和 interface 都可以用来声明对象类型](#42-type-和-interface-都可以用来声明对象类型)
  - [4.3. 对象方法的声明](#43-对象方法的声明)
  - [4.4. 可选成员的声明](#44-可选成员的声明)
  - [4.5. 只读属性的声明](#45-只读属性的声明)
- [5. 🤔 对象类型有哪些约束规则？](#5--对象类型有哪些约束规则)
- [6. 🤔 如何读取对象属性的类型？](#6--如何读取对象属性的类型)
- [7. 🤔 可选属性与 undefined 属性有什么区别？「细节」](#7--可选属性与-undefined-属性有什么区别细节)
- [8. 🤔 readonly 修饰符对嵌套对象有什么影响？](#8--readonly-修饰符对嵌套对象有什么影响)
- [9. 🤔 如何创建完全只读的对象？](#9--如何创建完全只读的对象)
- [10. 🤔 什么是属性名的索引类型？](#10--什么是属性名的索引类型)
- [11. 🤔 如何处理解构赋值的类型？](#11--如何处理解构赋值的类型)
- [12. 🤔 什么是“最小可选属性规则”？](#12--什么是最小可选属性规则)
- [13. 🤔 空对象 `{}` 在 TypeScript 中有什么特殊性？「不重要的细节」](#13--空对象--在-typescript-中有什么特殊性不重要的细节)
- [14. 🤔 如何强制使用没有任何属性的对象？「没啥用的小技巧」](#14--如何强制使用没有任何属性的对象没啥用的小技巧)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 对象类型
- type
- interface
- optional 属性
- readonly 属性
- readonly 对象
- 属性名的索引类型

## 2. 🫧 评价

- 对象类型是我们在日常开发中接触最多的引用类型，可谓是随处可见。
- 注意，本节介绍的「对象类型 ≠ Object、object 类型」
  - 在笔记 `0023. object 类型和 Object 类型` 中介绍的是 TS 内置的 `Object`、`object` 类型，它们属于非常宽泛的类型，日常开发中几乎不用。
  - 这篇笔记介绍的「对象类型」是更加具体的对象结构，日常开发中几乎时刻都在使用。
- 本节介绍的关于对象类型的约束策略（结构子类型）记录在了 `0031. 类型的兼容` 笔记中，可以配合着一起看。

## 3. 🤔 什么是 TypeScript 的对象类型？

TypeScript 的对象类型是最基本的数据结构之一。对象类型的最简单声明方法是使用大括号表示对象，在大括号内部声明每个属性和方法的类型。

```typescript
const obj: {
  x: number
  y: number
} = { x: 1, y: 1 }
```

上面示例中，对象 obj 的类型就写在变量名后面，使用大括号描述，内部声明每个属性的属性名和类型。

## 4. 🤔 如何声明对象类型？

### 4.1. 多字段的声明

可以使用大括号语法声明对象类型，属性的类型可以用分号 `;` 或逗号 `,` 结尾，也可以什么都不填直接换行。

```typescript
type MyObj = {
  x: number // 可以加分号、或逗号、或直接换行
  y: number
}

// 如果要并行写多个字段，那么必须加分号或者逗号。

// ❌ 错误
type MyObj = {
  x: number y: number
}

// ✅ 正确
type MyObj = {
  x: number; y: number
}
type MyObj = {
  x: number, y: number
}
```

### 4.2. type 和 interface 都可以用来声明对象类型

可以使用 `type` 命令为对象类型声明别名，也使用 `interface` 命令把对象类型提炼为接口。

```typescript
// 使用 type 命令
type MyObj = {
  x: number
  y: number
}

const obj: MyObj = { x: 1, y: 1 }

// 使用 interface 命令
interface MyObjInterface {
  x: number
  y: number
}

const obj2: MyObjInterface = { x: 1, y: 1 }
```

当你遇到不知道使用 `type` 还是 `interface` 的时候，官方建议是优先考虑 `interface`，如果使用 `interface` 无法定义，再考虑使用 `type`。

### 4.3. 对象方法的声明

对象的方法使用函数类型描述，写法如下：

```typescript
const obj: {
  x: number
  y: number
  // 方法写法一：直接声明函数
  add(x: number, y: number): number
  // 方法写法二：使用箭头函数类型
  multiply: (x: number, y: number) => number
} = {
  x: 1,
  y: 1,
  add(x, y) {
    return x + y
  },
  multiply(x, y) {
    return x * y
  },
}
```

### 4.4. 可选成员的声明

如果某个属性是可选的（即可以忽略），需要在属性名后面加一个问号：

```typescript
const obj: {
  x: number
  y?: number
} = { x: 1 }
```

上面示例中，属性 y 是可选的。

读取可选属性之前，必须检查是否为`undefined`：

```typescript
const user: {
  firstName: string
  lastName?: string
} = { firstName: 'Foo' }

// user.lastName.toLowerCase() // ❌ 报错：因为 lastName 可能为空
// 'user.lastName' is possibly 'undefined'.(18048)

// 下面是常用的一些类型守卫方式：

// 方法一：使用 if 判断
if (user.lastName !== undefined) {
  console.log(`hello ${user.firstName} ${user.lastName}`)
}

// 方法二：使用三元运算符
let lastName = user.lastName === undefined ? 'Default' : user.lastName

// 方法三：使用 Null 判断运算符
let lastName2 = user.lastName ?? 'Default'
```

### 4.5. 只读属性的声明

属性名前面加上 `readonly` 关键字，表示这个属性是只读属性，不能修改：

```typescript
interface MyInterface {
  readonly prop: number
}

const person: {
  readonly age: number
} = { age: 20 }

person.age = 21 // ❌ 报错：不能修改只读属性
// Cannot assign to 'age' because it is a read-only property.(2540)
```

只读属性只能在对象初始化期间赋值，此后就不能修改该属性：

```typescript
type Point = {
  readonly x: number
  readonly y: number
}

const p: Point = { x: 0, y: 0 }

p.x = 100 // 报错：不能修改只读属性
// Cannot assign to 'x' because it is a read-only property.(2540)
```

## 5. 🤔 对象类型有哪些约束规则？

一旦声明了类型，对象赋值时就不能缺少指定的属性，也不能有多余的属性。读写不存在的属性也会报错，同样不能删除类型声明中存在的属性。

```typescript
interface MyObj {
  x: number
  y: number
}

const o1: MyObj = { x: 1 } // ❌ 报错：缺少属性 y
// Property 'y' is missing in type '{ x: number; }' but required in type 'MyObj'.(2741)

const o2: MyObj = { x: 1, y: 1, z: 1 } // ❌ 报错：多出属性 z
// Object literal may only specify known properties, and 'z' does not exist in type 'MyObj'.(2353)

const obj: {
  x: number
  y: number
} = { x: 1, y: 1 }

console.log(obj.z) // ❌ 报错：读取不存在的属性
// Property 'z' does not exist on type '{ x: number; y: number; }'.(2339)

obj.z = 1 // ❌ 报错：写入不存在的属性
// Property 'z' does not exist on type '{ x: number; y: number; }'.(2339)

const myUser = {
  name: 'Sabrina',
}

delete myUser.name // ❌ 报错：删除非可选的属性
// The operand of a 'delete' operator must be optional.(2790)

myUser.name = 'Cynthia' // ✅ 正确：修改属性值
```

## 6. 🤔 如何读取对象属性的类型？

对象类型可以使用方括号读取属性的类型：

```typescript
type User = {
  name: string
  age: number
}
type Name = User['name'] // string
type Age = User['age'] // number
```

## 7. 🤔 可选属性与 undefined 属性有什么区别？「细节」

可选属性与允许设为 `undefined` 的必选属性是不等价的：

```typescript
type A = { x: number; y?: number }
type B = { x: number; y: number | undefined }

const ObjA: A = { x: 1 } // 正确：可选属性可以省略
const ObjB: B = { x: 1 } // 报错：必选属性不能省略
const ObjB2: B = { x: 1, y: undefined } // 正确：必须显式声明
```

## 8. 🤔 readonly 修饰符对嵌套对象有什么影响？

如果属性值是一个对象，`readonly` 修饰符并不禁止修改该对象的属性，只是禁止完全替换掉该对象：

```typescript
interface Home {
  readonly resident: {
    name: string
    age: number
  }
}

const h: Home = {
  resident: {
    name: 'Vicky',
    age: 42,
  },
}

h.resident.age = 32 // ✅ 正确：可以修改嵌套对象的属性
h.resident = {
  name: 'Kate',
  age: 23,
} // ❌ 报错：不能替换整个只读属性
```

## 9. 🤔 如何创建完全只读的对象？

可以使用 `as const` 断言创建完全只读的对象：

```typescript
const myUser = {
  name: 'Sabrina',
  details: {
    age: 25,
  },
} as const

myUser.name = 'Cynthia' // ❌ 报错：不能修改只读属性
// Cannot assign to 'name' because it is a read-only property.(2540)

myUser.details.age = 26 // ❌ 报错：嵌套属性也变成只读
// Cannot assign to 'age' because it is a read-only property.(2540)
```

## 10. 🤔 什么是属性名的索引类型？

当对象属性非常多或无法事前知道对象会有多少属性时，可以采用属性名表达式的写法来描述类型，称为"属性名的索引类型"：

```typescript
interface MyObj {
  [property: string]: string
}

const obj: MyObj = {
  foo: 'a',
  bar: 'b',
  baz: 'c',
}
```

JavaScript 对象的属性名类型有三种可能：`string`、`number` 和 `symbol`：

```typescript
interface StringIndex {
  [property: string]: string
}

interface NumberIndex {
  [property: number]: string
}

interface SymbolIndex {
  [property: symbol]: string
}

interface MixedIndex {
  name: string // 具体属性
  [index: number]: string // 数值索引
  [key: string]: string // 字符串索引
}
```

索引类型有以下限制：

1. 数值索引必须服从字符串索引（因为 JS 中数值属性名会转为字符串）
2. 具体属性必须符合索引类型的约束

```typescript
// 错误示例：数值索引与字符串索引冲突
interface MyType {
  [x: number]: boolean // ❌ 报错
  // 'number' index type 'boolean' is not assignable to 'string' index type 'string'.(2413)
  [x: string]: string
}

// 错误示例：具体属性与索引类型冲突
interface MyType2 {
  foo: boolean // ❌ 报错
  // Property 'foo' of type 'boolean' is not assignable to 'string' index type 'string'.(2411)
  [x: string]: string
}

// 正确示例：数值索引服从字符串索引
interface MyType3 {
  [x: number]: string // ✅ 正确
  [x: string]: string
}

// 正确示例：具体属性与索引类型冲突
interface MyType4 {
  foo: 'bar' // ✅ 正确
  [x: string]: string
}
```

## 11. 🤔 如何处理解构赋值的类型？

解构赋值用于直接从对象中提取属性，类型写法跟为对象声明类型是一样的：

```typescript
const product = {
  project_id: '123',
  project_name: '笔记本电脑',
  project_price: 5999,
} as const

// 推断结果：
// const product: {
//     readonly project_id: "123";
//     readonly project_name: "笔记本电脑";
//     readonly project_price: 5999;
// }

// 基本解构
const { project_id, project_name, project_price } = product

// 推断结果：
// const project_id: "123"
// const project_name: "笔记本电脑"
// const project_price: 5999

// 带类型声明的解构
const {
  project_id: productId,
  project_name: productName,
  project_price: productPrice,
}: {
  // 注意：直接用原始类型的索引名来声明，而非重命名后的变量名。

  // ✅ 正确写法
  project_id: string
  project_name: string
  project_price: number

  // ❌ 错误写法
  // productId: string
  // productName: string
  // productPrice: number
} = product

// 推断结果：
// project_id: string
// project_name: string
// project_price: number
```

## 12. 🤔 什么是“最小可选属性规则”？

如果某个类型的所有属性都是可选的，那么该类型的对象必须至少存在一个可选属性，不能所有可选属性都不存在。

```typescript
type Options = {
  a?: number
  b?: number
  c?: number
}

const opts = { d: 123 }

const obj: Options = opts // ❌ 报错：没有共同属性
// Type '{ d: number; }' has no properties in common with type 'Options'.(2559)

// 解决方法一：使用类型断言
const obj1: Options = opts as Options

// 解决方法二：添加索引签名
type OptionsWithIndex = {
  a?: number
  b?: number
  c?: number
  [propName: string]: any
}
```

## 13. 🤔 空对象 `{}` 在 TypeScript 中有什么特殊性？「不重要的细节」

- 空对象 `{}` 是 TypeScript 的一种特殊值和类型。
- 视作类型来用的空对象 `{}` 是 `Object` 类型的简写形式，所以使用 `Object` 时常常用空对象代替。

```ts
let obj: {}

obj = true
obj = 'hi'
obj = 1
obj = { foo: 123 }
obj = [1, 2]
obj = (a: number) => a + 1

// 等效

let obj2: Object

obj2 = true
obj2 = 'hi'
obj2 = 1
obj2 = { foo: 123 }
obj2 = [1, 2]
obj2 = (a: number) => a + 1
```

- TypeScript 会约束空对象不能有自定义属性，只能使用继承的属性。

```typescript
const obj = {}
obj.prop = 123 // 报错：不能添加自定义属性

// 正确：使用继承的属性
obj.toString() // 正确
obj.hasOwnProperty('prop') // 正确

// 如果需要分步构建对象，使用扩展运算符
const pt0 = {}
const pt1 = { x: 3 }
const pt2 = { y: 4 }

const pt = {
  ...pt0,
  ...pt1,
  ...pt2,
}
```

::: tip 💡 提示

关于空对象 `{}` 的相关内容，是一个不重要的细节，在开发中我们通常不会去刻意定义一个空对象类型，更多情况下都是具体的对象结构，会明确列出都有哪些字段。

:::

## 14. 🤔 如何强制使用没有任何属性的对象？「没啥用的小技巧」

如果想强制使用没有任何属性的对象，可以采用索引签名 never 的方式：

```typescript
interface WithoutProperties {
  [key: string]: never
}

// 报错：不能有任意属性
const a: WithoutProperties = { prop: 1 }

// 正确：空对象
const b: WithoutProperties = {}
```
