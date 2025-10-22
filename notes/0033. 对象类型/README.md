# [0033. 对象类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0033.%20%E5%AF%B9%E8%B1%A1%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是 TypeScript 的对象类型？](#3--什么是-typescript-的对象类型)
- [4. 🤔 如何声明对象类型？](#4--如何声明对象类型)
- [5. 🤔 对象类型有哪些约束规则？](#5--对象类型有哪些约束规则)
- [6. 🤔 对象的方法如何声明类型？](#6--对象的方法如何声明类型)
- [7. 🤔 如何读取对象属性的类型？](#7--如何读取对象属性的类型)
- [8. 🤔 对象属性可以是可选的吗？](#8--对象属性可以是可选的吗)
- [9. 🤔 如何处理可选属性的 undefined 检查？](#9--如何处理可选属性的-undefined-检查)
- [10. 🤔 可选属性与 undefined 属性有什么区别？](#10--可选属性与-undefined-属性有什么区别)
- [11. 🤔 什么是只读属性？](#11--什么是只读属性)
- [12. 🤔 readonly 修饰符对嵌套对象有什么影响？](#12--readonly-修饰符对嵌套对象有什么影响)
- [13. 🤔 如何创建完全只读的对象？](#13--如何创建完全只读的对象)
- [14. 🤔 什么是属性名的索引类型？](#14--什么是属性名的索引类型)
- [15. 🤔 索引类型支持哪些属性名类型？](#15--索引类型支持哪些属性名类型)
- [16. 🤔 索引类型有什么限制和注意事项？](#16--索引类型有什么限制和注意事项)
- [17. 🤔 如何处理解构赋值的类型？](#17--如何处理解构赋值的类型)
- [18. 🤔 解构赋值中的冒号有什么特殊含义？](#18--解构赋值中的冒号有什么特殊含义)
- [19. 🤔 什么是结构类型原则？](#19--什么是结构类型原则)
- [20. 🤔 结构类型原则会带来什么问题？](#20--结构类型原则会带来什么问题)
- [21. 🤔 什么是严格字面量检查？](#21--什么是严格字面量检查)
- [22. 🤔 如何规避严格字面量检查？](#22--如何规避严格字面量检查)
- [23. 🤔 什么是"最小可选属性规则"？](#23--什么是最小可选属性规则)
- [24. 🤔 空对象在 TypeScript 中有什么特殊性？](#24--空对象在-typescript-中有什么特殊性)
- [25. 🤔 空对象类型与 Object 类型有什么关系？](#25--空对象类型与-object-类型有什么关系)
- [26. 🤔 如何强制使用没有任何属性的对象？](#26--如何强制使用没有任何属性的对象)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- todo

## 2. 🫧 评价

- todo

## 3. 🤔 什么是 TypeScript 的对象类型？

TypeScript 的对象类型是最基本的数据结构之一。对象类型的最简单声明方法是使用大括号表示对象，在大括号内部声明每个属性和方法的类型。

```typescript
const obj: {
  x: number
  y: number
} = { x: 1, y: 1 }
```

上面示例中，对象[obj](file:///Users/huyouda/tnotesjs/TNotes.typescript/notes/0003.%20简介/静态类型的优点/拼写错误.ts#L0-L0)的类型就写在变量名后面，使用大括号描述，内部声明每个属性的属性名和类型。

## 4. 🤔 如何声明对象类型？

可以使用大括号语法声明对象类型，属性的类型可以用分号或逗号结尾。最后一个属性后面可以写分号或逗号，也可以不写。

```typescript
// 属性类型以分号结尾
type MyObj = {
  x: number
  y: number
}

// 属性类型以逗号结尾
type MyObj = {
  x: number
  y: number
}
```

也可以使用 `type` 命令为对象类型声明别名，或使用 `interface` 命令把对象类型提炼为接口。

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

## 5. 🤔 对象类型有哪些约束规则？

一旦声明了类型，对象赋值时就不能缺少指定的属性，也不能有多余的属性。读写不存在的属性也会报错，同样不能删除类型声明中存在的属性。

```typescript
type MyObj = {
  x: number
  y: number
}

const o1: MyObj = { x: 1 } // 报错：缺少属性 y
const o2: MyObj = { x: 1, y: 1, z: 1 } // 报错：多出属性 z

const obj: {
  x: number
  y: number
} = { x: 1, y: 1 }

console.log(obj.z) // 报错：读取不存在的属性
obj.z = 1 // 报错：写入不存在的属性

const myUser = {
  name: 'Sabrina',
}

delete myUser.name // 报错：删除存在的属性
myUser.name = 'Cynthia' // 正确：修改属性值
```

## 6. 🤔 对象的方法如何声明类型？

对象的方法使用函数类型描述，有两种写法：

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

## 7. 🤔 如何读取对象属性的类型？

对象类型可以使用方括号读取属性的类型：

```typescript
type User = {
  name: string
  age: number
}
type Name = User['name'] // string
type Age = User['age'] // number
```

## 8. 🤔 对象属性可以是可选的吗？

是的，如果某个属性是可选的（即可以忽略），需要在属性名后面加一个问号：

```typescript
const obj: {
  x: number
  y?: number
} = { x: 1 }
```

上面示例中，属性[y](file:///Users/huyouda/tnotesjs/TNotes.typescript/notes/0003.%20简介/动态类型与静态类型/动态的%20JS.js#L5-L5)是可选的。

可选属性等同于允许赋值为`undefined`，下面两种写法是等效的：

```typescript
type User = {
  firstName: string
  lastName?: string
}

// 等同于
type UserWithUndefined = {
  firstName: string
  lastName?: string | undefined
}
```

## 9. 🤔 如何处理可选属性的 undefined 检查？

读取可选属性之前，必须检查是否为`undefined`：

```typescript
const user: {
  firstName: string
  lastName?: string
} = { firstName: 'Foo' }

// 方法一：使用 if 判断
if (user.lastName !== undefined) {
  console.log(`hello ${user.firstName} ${user.lastName}`)
}

// 方法二：使用三元运算符
let lastName = user.lastName === undefined ? 'Default' : user.lastName

// 方法三：使用 Null 判断运算符
let lastName2 = user.lastName ?? 'Default'
```

## 10. 🤔 可选属性与 undefined 属性有什么区别？

可选属性与允许设为`undefined`的必选属性是不等价的：

```typescript
type A = { x: number; y?: number }
type B = { x: number; y: number | undefined }

const ObjA: A = { x: 1 } // 正确：可选属性可以省略
const ObjB: B = { x: 1 } // 报错：必选属性不能省略
const ObjB2: B = { x: 1, y: undefined } // 正确：必须显式声明
```

## 11. 🤔 什么是只读属性？

属性名前面加上`readonly`关键字，表示这个属性是只读属性，不能修改：

```typescript
interface MyInterface {
  readonly prop: number
}

const person: {
  readonly age: number
} = { age: 20 }

person.age = 21 // 报错：不能修改只读属性
```

只读属性只能在对象初始化期间赋值，此后就不能修改该属性：

```typescript
type Point = {
  readonly x: number
  readonly y: number
}

const p: Point = { x: 0, y: 0 }

p.x = 100 // 报错：不能修改只读属性
```

## 12. 🤔 readonly 修饰符对嵌套对象有什么影响？

如果属性值是一个对象，`readonly`修饰符并不禁止修改该对象的属性，只是禁止完全替换掉该对象：

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

h.resident.age = 32 // 正确：可以修改嵌套对象的属性
h.resident = {
  name: 'Kate',
  age: 23,
} // 报错：不能替换整个只读属性
```

## 13. 🤔 如何创建完全只读的对象？

可以使用`as const`断言创建完全只读的对象：

```typescript
const myUser = {
  name: 'Sabrina',
  details: {
    age: 25,
  },
} as const

myUser.name = 'Cynthia' // 报错：不能修改只读属性
myUser.details.age = 26 // 报错：嵌套属性也变成只读
```

## 14. 🤔 什么是属性名的索引类型？

当对象属性非常多或无法事前知道对象会有多少属性时，可以采用属性名表达式的写法来描述类型，称为"属性名的索引类型"：

```typescript
type MyObj = {
  [property: string]: string
}

const obj: MyObj = {
  foo: 'a',
  bar: 'b',
  baz: 'c',
}
```

## 15. 🤔 索引类型支持哪些属性名类型？

JavaScript 对象的属性名类型有三种可能：`string`、`number`和`symbol`：

```typescript
type StringIndex = {
  [property: string]: string
}

type NumberIndex = {
  [property: number]: string
}

type SymbolIndex = {
  [property: symbol]: string
}

type MixedIndex = {
  name: string // 具体属性
  [index: number]: string // 数值索引
  [key: string]: string // 字符串索引
}
```

## 16. 🤔 索引类型有什么限制和注意事项？

索引类型有以下限制：

1. 数值索引必须服从字符串索引（因为 JS 中数值属性名会转为字符串）
2. 具体属性必须符合索引类型的约束

```typescript
// 错误示例：数值索引与字符串索引冲突
type MyType = {
  [x: number]: boolean // 报错
  [x: string]: string
}

// 错误示例：具体属性与索引类型冲突
type MyType2 = {
  foo: boolean // 报错
  [x: string]: string
}

// 正确示例：数值索引服从字符串索引
type MyType3 = {
  [x: number]: string // 正确
  [x: string]: string
}
```

## 17. 🤔 如何处理解构赋值的类型？

解构赋值用于直接从对象中提取属性，类型写法跟为对象声明类型是一样的：

```typescript
const product = {
  id: '123',
  name: '笔记本电脑',
  price: 5999,
}

// 基本解构
const { id, name, price } = product

// 带类型声明的解构
const {
  id: productId,
  name: productName,
  price: productPrice,
}: {
  id: string
  name: string
  price: number
} = product
```

## 18. 🤔 解构赋值中的冒号有什么特殊含义？

在解构赋值中，冒号不是表示类型，而是为属性指定新的变量名：

```typescript
let obj = { x: 1, y: 2 }

// 冒号表示重命名变量
let { x: foo, y: bar } = obj
// 等同于
let foo = obj.x
let bar = obj.y

// 如果要指定类型，需要整体声明
let { x: foo, y: bar }: { x: number; y: number } = obj
```

## 19. 🤔 什么是结构类型原则？

只要对象 B 满足对象 A 的结构特征，TypeScript 就认为对象 B 兼容对象 A 的类型，这称为"结构类型"原则：

```typescript
type A = {
  x: number
}

type B = {
  x: number
  y: number
}

const objB = {
  x: 1,
  y: 1,
}

const objA: A = objB // 正确：B 满足 A 的结构特征
```

## 20. 🤔 结构类型原则会带来什么问题？

结构类型原则有时会导致令人惊讶的结果，特别是在使用索引访问时：

```typescript
type MyObj = {
  x: number
  y: number
}

// 问题示例：使用 Object.keys 遍历时类型不安全
function getSum(obj: MyObj) {
  let sum = 0

  for (const n of Object.keys(obj)) {
    const v = obj[n] // 报错：类型不安全
    sum += Math.abs(v)
  }

  return sum
}

// 更安全的写法
function getSumSafe(obj: MyObj) {
  return Math.abs(obj.x) + Math.abs(obj.y)
}
```

## 21. 🤔 什么是严格字面量检查？

如果对象使用字面量表示，会触发 TypeScript 的严格字面量检查。如果字面量的结构跟类型定义的不一样（比如多出了未定义的属性），就会报错：

```typescript
const point: {
  x: number
  y: number
} = {
  x: 1,
  y: 1,
  z: 1, // 报错：多出未定义的属性
}
```

## 22. 🤔 如何规避严格字面量检查？

有几种方法可以规避严格字面量检查：

```typescript
type Options = {
  title: string
  darkMode?: boolean
}

// 方法一：使用中间变量
let myOptions = {
  title: '我的网页',
  darkmode: true, // 拼写错误
}

const obj1: Options = myOptions // 不报错

// 方法二：使用类型断言
const obj2: Options = {
  title: '我的网页',
  darkmode: true, // 拼写错误
} as Options // 不报错

// 方法三：在类型中允许额外属性
let obj3: {
  title: string
  darkMode?: boolean
  [x: string]: any // 允许任意额外属性
} = {
  title: '我的网页',
  darkmode: true,
}
```

## 23. 🤔 什么是"最小可选属性规则"？

如果某个类型的所有属性都是可选的，那么该类型的对象必须至少存在一个可选属性，不能所有可选属性都不存在：

```typescript
type Options = {
  a?: number
  b?: number
  c?: number
}

const opts = { d: 123 }

const obj: Options = opts // 报错：没有共同属性

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

## 24. 🤔 空对象在 TypeScript 中有什么特殊性？

空对象 `{}` 是 TypeScript 的一种特殊值和类型。TypeScript 会推断空对象不能有自定义属性，只能使用继承的属性：

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

## 25. 🤔 空对象类型与 Object 类型有什么关系？

空对象作为类型，其实是`Object`类型的简写形式：

```typescript
let d: {}
// 等同于
let d2: Object

d = {}
d = { x: 1 }
d = 'hello'
d = 2

// 但不能赋值给更严格的空接口
interface Empty {}
const b: Empty = { myProp: 1, anotherProp: 2 } // 正确
// b.myProp // 报错：不能读取未声明的属性
```

## 26. 🤔 如何强制使用没有任何属性的对象？

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
