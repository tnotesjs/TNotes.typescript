# [0070. 泛型类型的兼容性规则](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0070.%20%E6%B3%9B%E5%9E%8B%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%85%BC%E5%AE%B9%E6%80%A7%E8%A7%84%E5%88%99)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 泛型类型的兼容性规则是什么？](#3--泛型类型的兼容性规则是什么)
  - [3.1. 简单规则（位置法则）](#31-简单规则位置法则)
  - [3.2. 协变（Covariance）](#32-协变covariance)
  - [3.3. 逆变（Contravariance）](#33-逆变contravariance)
  - [3.4. 不变（Invariance）](#34-不变invariance)
- [4. 🤔 常见容器与内置类型的变型是什么？](#4--常见容器与内置类型的变型是什么)
  - [4.1. 数组 Array 与 ReadonlyArray](#41-数组-array-与-readonlyarray)
  - [4.2. Promise](#42-promise)
  - [4.3. Box/Ref：可写容器与只读容器](#43-boxref可写容器与只读容器)
- [5. 🤔 函数类型中泛型的不同位置的兼容性规则是什么？](#5--函数类型中泛型的不同位置的兼容性规则是什么)
  - [5.1. 返回值位置（协变）](#51-返回值位置协变)
  - [5.2. 参数位置（逆变）](#52-参数位置逆变)
  - [5.3. 同时读写（不变）](#53-同时读写不变)
  - [5.4. strictFunctionTypes 的影响](#54-strictfunctiontypes-的影响)
- [6. 🤔 实战建议与易错点都有哪些？](#6--实战建议与易错点都有哪些)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 协变（Covariance）、逆变（Contravariance）、不变（Invariance）
- “位置法则”：参数位置（逆变）vs 返回值位置（协变）
- 常见容器的变型特性：Array、ReadonlyArray、Promise、只读容器
- 函数类型中的泛型位置与 strictFunctionTypes 的影响
- 实战中的安全用法与避坑

## 2. 🫧 评价

掌握“变型”（variance）是理解 TypeScript 泛型兼容性的关键。大多数时候，记住“位置法则”就够用：

- 参数位置逆变；
- 返回值位置协变；
- 读写同存则不变；

需要注意的是，为了实用性，TypeScript 在某些地方采取了宽松策略（如 Array 的协变、类/接口方法的参数双变），这会引入潜在的不安全性，建议在 API 设计中尽量使用只读容器来获得更强的类型保障。

## 3. 🤔 泛型类型的兼容性规则是什么？

泛型兼容性取决于类型参数出现的位置（只读/只写/读写）。

### 3.1. 简单规则（位置法则）

- 只读位置（产出/返回值）→ 协变
- 只写位置（消耗/参数）→ 逆变
- 既读又写（同时出现于参数和返回）→ 不变

### 3.2. 协变（Covariance）

当类型参数只出现在返回值（产出）位置，子类型可以赋给父类型。

```ts
// 协变：只读/产出
interface Producer<T> {
  produce(): T
}

let sp: Producer<string> = { produce: () => 'hello' }
// string 是 unknown 的子类型
let up: Producer<unknown> = sp // ✅ 协变允许
```

协变常见于“读取”型容器：`ReadonlyArray<T>`、`Promise<T>`（概念上）。

### 3.3. 逆变（Contravariance）

当类型参数只出现在参数（消耗）位置，父类型可以赋给子类型。

```ts
// 逆变：只写/消耗
interface Consumer<T> {
  consume(x: T): void
}

let cu: Consumer<unknown> = { consume: (x) => console.log(x) }
// unknown 是 string 的父类型
let cs: Consumer<string> = cu // ✅ 逆变允许
```

逆变常见于“接受输入”的函数参数位置。详细见第 5 节。

### 3.4. 不变（Invariance）

当类型参数既用于参数位置又用于返回值位置，必须类型完全一致。

```ts
// 不变：同时读写
interface Transformer<T> {
  transform(x: T): T
}

let ts: Transformer<string> = { transform: (s) => s.toUpperCase() }
// 下列两行都不允许，必须保持完全一致
// let tu: Transformer<unknown> = ts // ❌ 不变禁止
// let ts2: Transformer<string> = tu // ❌ 不变禁止
```

## 4. 🤔 常见容器与内置类型的变型是什么？

### 4.1. 数组 Array 与 ReadonlyArray

数组是大家最容易忽视的“协变但不完全安全”的例子。

1. Array 是协变的（有风险）
2. ReadonlyArray 更安全（纯读取，协变）

::: code-group

```ts [1]
class Animal {
  name = ''
}
class Dog extends Animal {
  breed = ''
}

let dogs: Dog[] = [new Dog()]
let animals: Animal[] = dogs // ✅ 允许（协变）

// 运行期风险：向 animals 推入 Animal，会污染 dogs
animals.push(new Animal()) // ✅ 编译不报错（但不安全）
dogs.forEach((d) => d.breed) // 运行时可能报错：d 里混入了 Animal
```

```ts [2]
const dogs: ReadonlyArray<Dog> = [new Dog()]
const animals: ReadonlyArray<Animal> = dogs // ✅ 协变且安全
// animals.push(...) // ❌ 编译期禁止写入
```

:::

结论：

- `Array<T>`：在 TS 中表现为协变（出于实用性），但“可写 + 协变”在理论上不安全
- `ReadonlyArray<T>`：只读容器，协变且安全，推荐对外暴露

### 4.2. Promise

`Promise<T>` 只“产出” T（不会把 T 当作参数写入），因此是协变的。

```ts
let ps: Promise<string> = Promise.resolve('hi')
let pu: Promise<unknown> = ps // ✅ 协变

// never / unknown 与协变
let pn: Promise<never> = Promise.reject('boom') as any
let ps2: Promise<string> = pn // ✅ never 是所有类型的子类型（理论上可赋值）
```

### 4.3. Box/Ref：可写容器与只读容器

概念上：

- 只读容器 → 协变
- 可写容器 → 应为不变（读写同存）

在 TypeScript 实际检查中，务必倾向只读以避免不安全赋值。

```ts
// 只读容器：协变
type ReadonlyBox<T> = {
  readonly value: T
}

let rbDog: ReadonlyBox<Dog> = { value: new Dog() }
let rbAnimal: ReadonlyBox<Animal> = rbDog // ✅ 协变

// 可写容器：理论上不变，避免相互赋值
type Box<T> = {
  value: T
}

let bDog: Box<Dog> = { value: new Dog() }
// 下列赋值会导致潜在不安全写入，建议避免：
// let bAnimal: Box<Animal> = bDog // ⚠️ 不建议（可能导致把 Animal 写入到 Dog 容器）
```

实战建议：对外暴露“只读”容器（readonly/ReadonlyXxx），写入在内部完成。

## 5. 🤔 函数类型中泛型的不同位置的兼容性规则是什么？

函数是“位置法则”的最佳载体：参数位置逆变，返回值位置协变。详细的函数兼容性见本系列笔记“函数类型的兼容性规则”。

### 5.1. 返回值位置（协变）

```ts
type Returner<T> = () => T

const getStr: Returner<string> = () => 'hi'
const getUnk: Returner<unknown> = getStr // ✅ 协变
```

### 5.2. 参数位置（逆变）

```ts
type Acceptor<T> = (x: T) => void

const acceptUnk: Acceptor<unknown> = (x) => console.log(x)
// 父类型 → 子位置（逆变）
const acceptStr: Acceptor<string> = acceptUnk // ✅ 逆变
```

### 5.3. 同时读写（不变）

```ts
type Mapper<T> = (x: T) => T

const mapStr: Mapper<string> = (s) => s.toUpperCase()
// const mapUnk: Mapper<unknown> = mapStr // ❌ 不变，不允许
```

### 5.4. strictFunctionTypes 的影响

- 当开启 strictFunctionTypes: true
  - 普通函数类型参数按“逆变”严格检查（推荐）
- 当关闭 strictFunctionTypes: false
  - 采用“宽松双变”策略，可能隐藏问题
- 注意：类/接口的方法参数在 TS 中始终较宽松（历史兼容），细节见“函数类型的兼容性规则”一节

```ts
type FnLiteral = (x: 'hello') => void
type FnString = (x: string) => void

let f1: FnLiteral = (x) => {}
let f2: FnString = (x) => {}

f1 = f2 // ✅ 始终允许（父到子）
// f2 = f1 // ❌ 在 strictFunctionTypes: true 下报错；关闭时可能通过（不安全）
```

## 6. 🤔 实战建议与易错点都有哪些？

- 尽量对外暴露只读容器（ReadonlyArray、readonly 属性、ReadonlyMap/Set 等），让类型沿协变安全传播
- 在函数 API 中，参数类型从“父类型”收敛（逆变），返回值尽量“具体”（协变）
- 对于“既读又写”的泛型容器，避免跨类型参数的相互赋值（理论上应不变）
- 开启 strict（至少 strictFunctionTypes）以获得更严格的检查
- 数组是协变但可写，容易埋下运行期隐患；只读数组能显著降低风险
- 使用 unknown/never 辅助思考：
  - 协变位置：never 是最具体（子），unknown 是最宽泛（父）
  - 逆变位置：unknown 更合适放在源类型侧

## 7. 🔗 引用

- [Type Compatibility（类型兼容性）][1]
- [Generics（泛型）][2]
- [strictFunctionTypes（tsconfig）][3]

[1]: https://www.typescriptlang.org/docs/handbook/type-compatibility.html
[2]: https://www.typescriptlang.org/docs/handbook/2/generics.html
[3]: https://www.typescriptlang.org/tsconfig/#strictFunctionTypes
