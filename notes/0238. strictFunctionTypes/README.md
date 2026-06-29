# [0238. strictFunctionTypes](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0238.%20strictFunctionTypes)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. strictFunctionTypes 是什么？](#3-strictfunctiontypes-是什么)
  - [3.1. 基本配置](#31-基本配置)
  - [3.2. 关闭时的行为](#32-关闭时的行为)
  - [3.3. 开启后的行为](#33-开启后的行为)
- [4. 为什么需要这个选项？](#4-为什么需要这个选项)
  - [4.1. 不安全的函数赋值](#41-不安全的函数赋值)
  - [4.2. 逆变规则](#42-逆变规则)
- [5. 它如何影响代码？](#5-它如何影响代码)
  - [5.1. 回调函数](#51-回调函数)
  - [5.2. 数组方法](#52-数组方法)
  - [5.3. 方法不受影响](#53-方法不受影响)
  - [5.4. 泛型函数](#54-泛型函数)
- [6. 使用时需要注意什么？](#6-使用时需要注意什么)
  - [6.1. 方法 vs. 函数属性](#61-方法-vs-函数属性)
  - [6.2. 事件处理](#62-事件处理)
  - [6.3. 高阶函数](#63-高阶函数)
  - [6.4. 类型断言](#64-类型断言)
  - [6.5. 联合类型处理](#65-联合类型处理)
  - [6.6. React 组件](#66-react-组件)
- [7. 引用](#7-引用)

<!-- endregion:toc -->

## 1. 本节内容

- strictFunctionTypes 的作用
- 函数参数的逆变检查
- 协变与逆变的概念
- 双向协变的问题
- 方法和函数的区别
- 实际应用场景

## 2. 评价

`strictFunctionTypes` 启用函数参数的严格逆变检查，防止不安全的函数类型赋值，是类型安全的重要保障。

- 防止函数参数类型的不安全赋值
- 涉及协变和逆变的概念
- 方法声明不受此选项影响
- 有助于捕获潜在的类型错误
- 对函数式编程风格影响较大
- 理解起来相对复杂但很重要

## 3. strictFunctionTypes 是什么？

`strictFunctionTypes` 启用函数参数的严格逆变检查。

### 3.1. 基本配置

```json
{
  "compilerOptions": {
    "strictFunctionTypes": true
  }
}
```

### 3.2. 关闭时的行为

```ts
// strictFunctionTypes: false（双向协变）
type EventCallback = (e: Event) => void

// ✅ 允许（不安全）
const handler: EventCallback = (e: MouseEvent) => {
  console.log(e.clientX) // ⚠️ 如果传入的是 KeyboardEvent 会出错
}
```

### 3.3. 开启后的行为

```ts
// strictFunctionTypes: true（逆变检查）
type EventCallback = (e: Event) => void

// ❌ 错误：MouseEvent 不能赋值给 Event
const handler: EventCallback = (e: MouseEvent) => {
  console.log(e.clientX)
}

// ✅ 正确：使用更宽泛的类型
const handler: EventCallback = (e: Event) => {
  if (e instanceof MouseEvent) {
    console.log(e.clientX)
  }
}
```

## 4. 为什么需要这个选项？

### 4.1. 不安全的函数赋值

```ts
class Animal {
  name: string = ''
}

class Dog extends Animal {
  bark() {
    console.log('Woof!')
  }
}

class Cat extends Animal {
  meow() {
    console.log('Meow!')
  }
}

// strictFunctionTypes: false
type Handler = (animal: Dog | Cat) => void

// ✅ 允许但不安全
const handle: Handler = (animal: Dog) => {
  animal.bark() // ⚠️ 如果传入 Cat 会出错
}

handle(new Cat()) // 运行时错误

// strictFunctionTypes: true
const handle: Handler = (animal: Dog) => {
  // ❌ 错误
  animal.bark()
}

// ✅ 正确的写法
const handle: Handler = (animal: Dog | Cat) => {
  if (animal instanceof Dog) {
    animal.bark()
  } else {
    animal.meow()
  }
}
```

### 4.2. 逆变规则

函数参数类型必须是逆变的（contravariant）：

```ts
// 类型层级：Animal > Dog
// 函数参数逆变：(animal: Animal) => void 可以赋值给 (dog: Dog) => void

type AnimalHandler = (animal: Animal) => void
type DogHandler = (dog: Dog) => void

// ✅ 正确：参数类型更宽泛
const animalHandler: AnimalHandler = (animal: Animal) => {
  console.log(animal.name)
}

const dogHandler: DogHandler = animalHandler // ✅ 安全

// ❌ 错误：参数类型更具体
const specificHandler: DogHandler = (dog: Dog) => {
  dog.bark()
}

const generalHandler: AnimalHandler = specificHandler // ❌ 不安全
```

## 5. 它如何影响代码？

### 5.1. 回调函数

```ts
// strictFunctionTypes: true
interface EventEmitter {
  on(event: string, callback: (e: Event) => void): void
}

const emitter: EventEmitter = {
  on(event, callback) {
    // ❌ 错误：不能传递更具体的类型
    callback(new MouseEvent('click'))
  },
}

// ✅ 正确：使用正确的参数类型
emitter.on('click', (e: Event) => {
  if (e instanceof MouseEvent) {
    console.log(e.clientX)
  }
})
```

### 5.2. 数组方法

```ts
class Shape {
  area(): number {
    return 0
  }
}

class Circle extends Shape {
  radius: number = 0

  area(): number {
    return Math.PI * this.radius ** 2
  }
}

const shapes: Shape[] = [new Circle()]

// strictFunctionTypes: false
shapes.forEach((shape: Circle) => {
  // ✅ 允许但不安全
  console.log(shape.radius) // ⚠️ 可能不是 Circle
})

// strictFunctionTypes: true
shapes.forEach((shape: Circle) => {
  // ❌ 错误
  console.log(shape.radius)
})

// ✅ 正确
shapes.forEach((shape: Shape) => {
  if (shape instanceof Circle) {
    console.log(shape.radius)
  }
})
```

### 5.3. 方法不受影响

```ts
// 方法声明不受 strictFunctionTypes 影响
interface Animal {
  move(distance: number): void
}

interface Dog extends Animal {
  // ✅ 允许（方法可以使用更具体的参数）
  move(distance: number): void
}

class MyDog implements Dog {
  move(distance: number) {
    console.log(`Dog moved ${distance}m`)
  }
}
```

### 5.4. 泛型函数

```ts
// strictFunctionTypes: true
function process<T>(arr: T[], callback: (item: T) => void) {
  arr.forEach(callback)
}

class Animal {
  name: string = ''
}

class Dog extends Animal {
  bark() {}
}

const dogs: Dog[] = [new Dog()]

// ❌ 错误：不能使用父类型
process(dogs, (animal: Animal) => {
  console.log(animal.name)
})

// ✅ 正确：使用正确的类型
process(dogs, (dog: Dog) => {
  dog.bark()
})

// ✅ 或使用类型参数
process<Animal>(dogs, (animal: Animal) => {
  console.log(animal.name)
})
```

## 6. 使用时需要注意什么？

### 6.1. 方法 vs. 函数属性

```ts
interface Handler {
  // 方法声明（不受 strictFunctionTypes 影响）
  handle(value: string): void

  // 函数属性（受 strictFunctionTypes 影响）
  process: (value: string) => void
}

type StringHandler = (value: string | number) => void

const handler: Handler = {
  // ✅ 方法可以使用更具体的类型
  handle(value: string) {
    console.log(value)
  },

  // ❌ 函数属性必须严格匹配
  process: (value: string) => {
    // 如果声明为 StringHandler 会报错
    console.log(value)
  },
}
```

### 6.2. 事件处理

```ts
// ✅ 推荐：使用具体的事件类型
button.addEventListener('click', (e: MouseEvent) => {
  console.log(e.clientX)
})

// ⚠️ 或使用类型守卫
button.addEventListener('click', (e: Event) => {
  if (e instanceof MouseEvent) {
    console.log(e.clientX)
  }
})
```

### 6.3. 高阶函数

```ts
// strictFunctionTypes: true
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn)
}

const numbers = [1, 2, 3]

// ✅ 正确
const strings = map(numbers, (n: number) => n.toString())

// ❌ 错误：参数类型不匹配
const result = map(numbers, (n: number | string) => n.toString())
```

### 6.4. 类型断言

```ts
// ⚠️ 可以使用类型断言绕过检查（不推荐）
type Callback = (value: string | number) => void

const handler: Callback = ((value: string) => {
  console.log(value.toUpperCase())
}) as Callback
```

### 6.5. 联合类型处理

```ts
type Handler = (value: string | number) => void

// ❌ 错误
const handle: Handler = (value: string) => {
  console.log(value.toUpperCase())
}

// ✅ 正确：处理所有可能的类型
const handle: Handler = (value: string | number) => {
  if (typeof value === 'string') {
    console.log(value.toUpperCase())
  } else {
    console.log(value.toFixed(2))
  }
}
```

### 6.6. React 组件

```ts
// strictFunctionTypes 对 React 组件的影响
interface Props {
  onClick: (e: React.MouseEvent) => void
}

// ❌ 错误：参数类型不匹配
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log(e.currentTarget)
}

;<Button onClick={handleClick} /> // 错误

// ✅ 正确：使用父类型
const handleClick = (e: React.MouseEvent) => {
  console.log(e.currentTarget)
}

;<Button onClick={handleClick} /> // 正确
```

## 7. 引用

- [TypeScript strictFunctionTypes][1]
- [Covariance and Contravariance][2]
- [Function Parameter Bivariance][3]

[1]: https://www.typescriptlang.org/tsconfig#strictFunctionTypes
[2]: https://www.typescriptlang.org/docs/handbook/type-compatibility.html#function-parameter-bivariance
[3]: https://github.com/Microsoft/TypeScript/pull/18654
