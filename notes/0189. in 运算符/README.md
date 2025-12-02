# [0189. in 运算符](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0189.%20in%20%E8%BF%90%E7%AE%97%E7%AC%A6)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 in 运算符有哪些用途？](#3--in-运算符有哪些用途)
  - [3.1. JavaScript 中的 in 运算符](#31-javascript-中的-in-运算符)
  - [3.2. TypeScript 类型系统中的 in](#32-typescript-类型系统中的-in)
- [4. 🤔 如何使用 in 创建映射类型？](#4--如何使用-in-创建映射类型)
  - [4.1. 基本映射类型](#41-基本映射类型)
  - [4.2. 遍历联合类型](#42-遍历联合类型)
  - [4.3. 结合 keyof 使用](#43-结合-keyof-使用)
- [5. 🤔 in 运算符如何用于类型守卫？](#5--in-运算符如何用于类型守卫)
  - [5.1. 基本类型守卫](#51-基本类型守卫)
  - [5.2. 区分联合类型](#52-区分联合类型)
  - [5.3. 复杂类型判断](#53-复杂类型判断)
- [6. 🤔 in 运算符的实际应用场景](#6--in-运算符的实际应用场景)
  - [6.1. 实现工具类型](#61-实现工具类型)
  - [6.2. 对象转换](#62-对象转换)
  - [6.3. API 响应处理](#63-api-响应处理)
- [7. 🤔 in 运算符有哪些注意事项？](#7--in-运算符有哪些注意事项)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- `in` 运算符在 JavaScript 和 TypeScript 中的不同用途
- 使用 `in` 创建映射类型
- `in` 运算符用于类型守卫
- `in` 在实际开发中的应用场景
- 使用注意事项和最佳实践

## 2. 🫧 评价

这篇笔记详细介绍了 `in` 运算符在 TypeScript 中的双重作用：作为 JavaScript 运行时的属性检查运算符，以及作为 TypeScript 类型系统中创建映射类型的关键字。

- `in` 在 JavaScript 中用于检查对象是否包含某个属性
- 在 TypeScript 类型系统中，`in` 用于遍历联合类型创建映射类型
- 作为类型守卫，`in` 可以安全地区分联合类型
- 理解 `in` 的两种用途是掌握 TypeScript 高级类型的关键
- `in` 是实现 `Partial`、`Required`、`Readonly` 等工具类型的基础
- 在实际开发中，合理使用 `in` 可以编写更安全、更灵活的代码

## 3. 🤔 in 运算符有哪些用途？

### 3.1. JavaScript 中的 in 运算符

`in` 运算符是 JavaScript 原生运算符，用于检查对象是否包含指定的属性。

**基本用法：**

```ts
const person = {
  name: 'Alice',
  age: 25,
}

// 检查属性是否存在
console.log('name' in person) // true
console.log('email' in person) // false

// 也会检查原型链上的属性
console.log('toString' in person) // true（继承自 Object.prototype）
```

**与 hasOwnProperty 的区别：**

```ts
const obj = {
  own: 'value',
}

// in 会检查原型链
'toString' in obj // true

// hasOwnProperty 只检查自有属性
obj.hasOwnProperty('toString') // false
obj.hasOwnProperty('own') // true
```

### 3.2. TypeScript 类型系统中的 in

在 TypeScript 的类型系统中，`in` 用于创建映射类型，遍历联合类型的每个成员。

**基本语法：**

```ts
// 语法：[K in Keys]: Type
type Keys = 'a' | 'b' | 'c'

type Obj = {
  [K in Keys]: string
}
// 等同于：
// type Obj = {
//   a: string;
//   b: string;
//   c: string;
// }
```

## 4. 🤔 如何使用 in 创建映射类型？

### 4.1. 基本映射类型

**将联合类型转换为对象类型：**

```ts
type Status = 'pending' | 'success' | 'error'

type StatusMap = {
  [K in Status]: boolean
}
// type StatusMap = {
//   pending: boolean;
//   success: boolean;
//   error: boolean;
// }

// 使用示例
const statusFlags: StatusMap = {
  pending: false,
  success: true,
  error: false,
}
```

**指定不同的值类型：**

```ts
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

type Handlers = {
  [K in HttpMethod]: (data?: any) => Promise<any>
}
// type Handlers = {
//   GET: (data?: any) => Promise<any>;
//   POST: (data?: any) => Promise<any>;
//   PUT: (data?: any) => Promise<any>;
//   DELETE: (data?: any) => Promise<any>;
// }

// 实现
const apiHandlers: Handlers = {
  GET: async (data) => {
    /* ... */
  },
  POST: async (data) => {
    /* ... */
  },
  PUT: async (data) => {
    /* ... */
  },
  DELETE: async (data) => {
    /* ... */
  },
}
```

### 4.2. 遍历联合类型

**从数字创建对象：**

```ts
type Range = 0 | 1 | 2 | 3 | 4

type RangeMap = {
  [K in Range]: K
}
// type RangeMap = {
//   0: 0;
//   1: 1;
//   2: 2;
//   3: 3;
//   4: 4;
// }
```

**结合模板字面量类型：**

```ts
type Direction = 'top' | 'right' | 'bottom' | 'left'

type Margins = {
  [K in Direction as `margin${Capitalize<K>}`]: number
}
// type Margins = {
//   marginTop: number;
//   marginRight: number;
//   marginBottom: number;
//   marginLeft: number;
// }

const margins: Margins = {
  marginTop: 10,
  marginRight: 20,
  marginBottom: 10,
  marginLeft: 20,
}
```

### 4.3. 结合 keyof 使用

**遍历对象的所有键：**

```ts
interface Person {
  name: string
  age: number
  email: string
}

// 将所有属性变为可选
type PartialPerson = {
  [K in keyof Person]?: Person[K]
}
// type PartialPerson = {
//   name?: string;
//   age?: number;
//   email?: string;
// }

// 将所有属性变为只读
type ReadonlyPerson = {
  readonly [K in keyof Person]: Person[K]
}
// type ReadonlyPerson = {
//   readonly name: string;
//   readonly age: number;
//   readonly email: string;
// }
```

**添加属性修饰符：**

```ts
type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}

type Optional<T> = {
  [K in keyof T]+?: T[K]
}

type Required<T> = {
  [K in keyof T]-?: T[K]
}
```

## 5. 🤔 in 运算符如何用于类型守卫？

### 5.1. 基本类型守卫

使用 `in` 运算符可以在运行时检查属性是否存在，TypeScript 会据此收窄类型。

```ts
interface Dog {
  bark(): void
  name: string
}

interface Cat {
  meow(): void
  name: string
}

type Pet = Dog | Cat

function makeSound(pet: Pet) {
  // 使用 in 进行类型守卫
  if ('bark' in pet) {
    // TypeScript 知道这里 pet 是 Dog
    pet.bark() // ✅
  } else {
    // TypeScript 知道这里 pet 是 Cat
    pet.meow() // ✅
  }
}
```

### 5.2. 区分联合类型

**多个类型的判断：**

```ts
interface Square {
  kind: 'square'
  size: number
}

interface Rectangle {
  kind: 'rectangle'
  width: number
  height: number
}

interface Circle {
  kind: 'circle'
  radius: number
}

type Shape = Square | Rectangle | Circle

function getArea(shape: Shape): number {
  // 使用 in 检查特定属性
  if ('size' in shape) {
    // shape: Square
    return shape.size * shape.size
  } else if ('width' in shape && 'height' in shape) {
    // shape: Rectangle
    return shape.width * shape.height
  } else if ('radius' in shape) {
    // shape: Circle
    return Math.PI * shape.radius ** 2
  }

  throw new Error('Unknown shape')
}
```

### 5.3. 复杂类型判断

**可选属性的处理：**

```ts
interface User {
  id: number
  name: string
  email?: string
  phone?: string
}

function sendNotification(user: User) {
  if ('email' in user && user.email) {
    // 发送邮件
    console.log(`Sending email to ${user.email}`)
  } else if ('phone' in user && user.phone) {
    // 发送短信
    console.log(`Sending SMS to ${user.phone}`)
  } else {
    // 无法发送通知
    console.log('No contact method available')
  }
}
```

**与其他类型守卫结合：**

```ts
interface ApiSuccess {
  status: 'success'
  data: any
}

interface ApiError {
  status: 'error'
  error: string
}

type ApiResponse = ApiSuccess | ApiError

function handleResponse(response: ApiResponse) {
  // 结合 in 和属性检查
  if ('data' in response && response.status === 'success') {
    console.log('Success:', response.data)
  } else if ('error' in response && response.status === 'error') {
    console.error('Error:', response.error)
  }
}
```

## 6. 🤔 in 运算符的实际应用场景

### 6.1. 实现工具类型

**Partial 的实现：**

```ts
type MyPartial<T> = {
  [K in keyof T]?: T[K]
}

interface Todo {
  title: string
  description: string
  completed: boolean
}

type PartialTodo = MyPartial<Todo>
// type PartialTodo = {
//   title?: string;
//   description?: string;
//   completed?: boolean;
// }
```

**Required 的实现：**

```ts
type MyRequired<T> = {
  [K in keyof T]-?: T[K]
}

type RequiredTodo = MyRequired<PartialTodo>
// type RequiredTodo = {
//   title: string;
//   description: string;
//   completed: boolean;
// }
```

**Pick 的实现：**

```ts
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'>
// type TodoPreview = {
//   title: string;
//   completed: boolean;
// }
```

### 6.2. 对象转换

**将对象值类型转换：**

```ts
interface Config {
  timeout: number
  retries: number
  debug: boolean
}

// 将所有值转为字符串
type StringConfig = {
  [K in keyof Config]: string
}
// type StringConfig = {
//   timeout: string;
//   retries: string;
//   debug: string;
// }

// 实现转换函数
function toStringConfig(config: Config): StringConfig {
  const result = {} as StringConfig
  for (const key in config) {
    result[key] = String(config[key])
  }
  return result
}
```

**创建 Getter 类型：**

```ts
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
}

interface State {
  count: number
  name: string
}

type StateGetters = Getters<State>
// type StateGetters = {
//   getCount: () => number;
//   getName: () => string;
// }

// 实现
const stateGetters: StateGetters = {
  getCount: () => 0,
  getName: () => '',
}
```

### 6.3. API 响应处理

**安全地处理不同的响应类型：**

```ts
interface UserResponse {
  user: {
    id: number
    name: string
  }
}

interface ErrorResponse {
  error: {
    code: number
    message: string
  }
}

type ApiResponse = UserResponse | ErrorResponse

async function fetchUser(id: number): Promise<ApiResponse> {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

// 使用 in 进行类型守卫
async function processUser(id: number) {
  const response = await fetchUser(id)

  if ('user' in response) {
    // response: UserResponse
    console.log(`User: ${response.user.name}`)
  } else if ('error' in response) {
    // response: ErrorResponse
    console.error(`Error: ${response.error.message}`)
  }
}
```

## 7. 🤔 in 运算符有哪些注意事项？

**1. in 与原型链**

```ts
const obj = { name: 'Alice' }

// in 会检查原型链
console.log('toString' in obj) // true

// 只检查自有属性
console.log(obj.hasOwnProperty('toString')) // false

// TypeScript 中的类型守卫
interface WithToString {
  toString(): string
}

function check(obj: object): obj is WithToString {
  return 'toString' in obj // ⚠️ 总是返回 true
}
```

**2. in 不能检查可选属性的值**

```ts
interface User {
  name: string
  email?: string
}

const user: User = { name: 'Alice' }

if ('email' in user) {
  // ⚠️ email 可能是 undefined
  console.log(user.email.length) // 运行时可能出错
}

// ✅ 正确：同时检查值
if ('email' in user && user.email !== undefined) {
  console.log(user.email.length) // 安全
}
```

**3. 映射类型中的 never**

```ts
type ExcludeKey<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P]
}

interface User {
  id: number
  name: string
  password: string
}

type PublicUser = ExcludeKey<User, 'password'>
// type PublicUser = {
//   id: number;
//   name: string;
// }
```

**4. 性能考虑**

```ts
// ❌ 不好：频繁使用 in 检查
function process(items: any[]) {
  for (const item of items) {
    if ('property1' in item) {
      /* ... */
    }
    if ('property2' in item) {
      /* ... */
    }
    if ('property3' in item) {
      /* ... */
    }
  }
}

// ✅ 好：使用类型谓词
interface ItemType1 {
  property1: string
}

interface ItemType2 {
  property2: number
}

function isType1(item: any): item is ItemType1 {
  return 'property1' in item
}

function processBetter(items: any[]) {
  for (const item of items) {
    if (isType1(item)) {
      // 类型已确定，后续不需要重复检查
      console.log(item.property1)
    }
  }
}
```

**5. 与联合类型的配合**

```ts
// ✅ 好的实践
type Action =
  | { type: 'INCREMENT'; payload: number }
  | { type: 'DECREMENT'; payload: number }
  | { type: 'RESET' }

function reducer(state: number, action: Action): number {
  // 使用 switch 比 in 更清晰
  switch (action.type) {
    case 'INCREMENT':
      return state + action.payload
    case 'DECREMENT':
      return state - action.payload
    case 'RESET':
      return 0
  }
}

// 但如果需要检查 payload 的存在
function hasPayload(action: Action): boolean {
  return 'payload' in action
}
```

## 8. 🔗 引用

- [TypeScript Handbook - Mapped Types][1]
- [TypeScript Handbook - Type Guards][2]
- [MDN - in operator][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
[2]: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-in-operator-narrowing
[3]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/in
