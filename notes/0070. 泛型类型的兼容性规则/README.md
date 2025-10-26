# [0070. 泛型类型的兼容性规则](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0070.%20%E6%B3%9B%E5%9E%8B%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%85%BC%E5%AE%B9%E6%80%A7%E8%A7%84%E5%88%99)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 泛型类型的兼容性规则是什么？](#3--泛型类型的兼容性规则是什么)
  - [3.1. 简单规则](#31-简单规则)
  - [3.2. 协变（Covariance）](#32-协变covariance)
  - [3.3. 逆变（Contravariance）](#33-逆变contravariance)
  - [3.4. 不变（Invariance）](#34-不变invariance)
  - [3.5. 示例：数组（协变）](#35-示例数组协变)
  - [3.6. 函数类型中的泛型位置分析](#36-函数类型中的泛型位置分析)
  - [3.7. 评价](#37-评价)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- todo

## 2. 🫧 评价

- todo

## 3. 🤔 泛型类型的兼容性规则是什么？

泛型兼容性取决于类型参数的使用位置（协变/逆变/不变）。

### 3.1. 简单规则

- 如果泛型只用于返回值位置 → 协变（子类型兼容）
- 如果泛型只用于参数位置 → 逆变（父类型兼容）
- 如果泛型既用于参数位置又用于返回值位置 → 不变（必须完全相同）

### 3.2. 协变（Covariance）

协变指的是子类型关系在某种变换下得以保持。当泛型类型参数只出现在返回值位置时，类型关系保持不变。

```ts
// 协变示例：泛型只用于返回值位置
interface Producer<T> {
  produce(): T
}

let stringProducer: Producer<string> = {
  produce: () => 'hello',
}

// string 是 unknown 的子类型，Producer<string> 也是 Producer<unknown> 的子类型
let unknownProducer: Producer<unknown> = stringProducer // ✅ 协变允许
```

### 3.3. 逆变（Contravariance）

逆变指的是子类型关系在某种变换下发生逆转。当泛型类型参数只出现在参数位置时，类型关系发生逆转。

```ts
// 逆变示例：泛型只用于参数位置
interface Consumer<T> {
  consume(item: T): void
}

let unknownConsumer: Consumer<unknown> = {
  consume: (item: unknown) => console.log(item),
}

// unknown 是 string 的父类型，Consumer<unknown> 可以安全地赋值给 Consumer<string>
let stringConsumer: Consumer<string> = unknownConsumer // ✅ 逆变允许
```

### 3.4. 不变（Invariance）

不变指的是无论在什么情况下都不能改变原有的类型关系。当泛型类型参数既出现在参数位置又出现在返回值位置时，必须保持类型完全一致。

```ts
// 不变示例：泛型既用于参数又用于返回值
interface Transformer<T> {
  transform(item: T): T
}

let stringTransformer: Transformer<string> = {
  transform: (item: string) => item.toUpperCase(),
}

// 以下两行都会报错，必须保持类型完全一致
let unknownTransformer: Transformer<unknown> = stringTransformer // ❌ 不变禁止
let stringTransformer2: Transformer<string> = unknownTransformer // ❌ 不变禁止
```

### 3.5. 示例：数组（协变）

```ts
class Animal {
  name: string = ''
}
class Dog extends Animal {
  breed: string = ''
}

let animals: Animal[] = [new Animal()]
let dogs: Dog[] = [new Dog()]

animals = dogs // ✅ Dog[] 兼容 Animal[]（因为 Dog 是 Animal 的子类型）
// 这体现了数组类型的协变特性

// ⚠️ 注意：这在可变数组中不安全（可以 animals.push(new Animal())，但实际是 dogs 数组）
// 但 TypeScript 仍允许（出于实用性）
```

### 3.6. 函数类型中的泛型位置分析

```ts
// 函数返回值位置的泛型 - 协变
type FuncReturning<T> = () => T
let getString: FuncReturning<string> = () => 'hello'
let getUnknown: FuncReturning<unknown> = getString // ✅ 协变

// 函数参数位置的泛型 - 逆变
type FuncAccepting<T> = (param: T) => void
let acceptUnknown: FuncAccepting<unknown> = (x: unknown) => console.log(x)
let acceptString: FuncAccepting<string> = acceptUnknown // ✅ 逆变

// 函数参数和返回值都有的泛型 - 不变
type FuncTransform<T> = (param: T) => T
let transformString: FuncTransform<string> = (s: string) => s.toUpperCase()
// let transformUnknown: FuncTransform<unknown> = transformString; // ❌ 不变禁止
```

### 3.7. 评价

- 这些规则确保了类型安全：协变适用于"读取"场景（子类型兼容父类型），逆变适用于"写入"场景（父类型兼容子类型），不变适用于"读写"场景（必须类型完全一致）
- 理解协变、逆变和不变有助于深入掌握 TypeScript 的类型系统
- 在实际开发中，这些规则影响着泛型类型、数组、函数等的赋值兼容性
