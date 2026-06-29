# [0115. 泛型类](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0115.%20%E6%B3%9B%E5%9E%8B%E7%B1%BB)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 什么是泛型类？](#3-什么是泛型类)
  - [3.1. 泛型类](#31-泛型类)
  - [3.2. 基本语法](#32-基本语法)
  - [3.3. 泛型类的特点](#33-泛型类的特点)
  - [3.4. 泛型类 vs 普通类](#34-泛型类-vs-普通类)
  - [3.5. 泛型类的优势](#35-泛型类的优势)
- [4. 如何给泛型添加约束？](#4-如何给泛型添加约束)
  - [4.1. extends 约束](#41-extends-约束)
  - [4.2. keyof 约束](#42-keyof-约束)
- [5. 如何给泛型类添加多个类型参数？](#5-如何给泛型类添加多个类型参数)
- [6. 静态成员可以使用类的泛型参数吗？](#6-静态成员可以使用类的泛型参数吗)
- [7. 如何继承泛型类？](#7-如何继承泛型类)
- [8. 类如何实现泛型接口？](#8-类如何实现泛型接口)
- [9. 泛型类可以继承泛型类吗？](#9-泛型类可以继承泛型类吗)
- [10. 关于泛型类，都有哪些实践建议？](#10-关于泛型类都有哪些实践建议)
- [11. 引用](#11-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 泛型类的定义和使用

## 2. 评价

泛型类（Generic Class）是使用类型参数的类，可以在实例化时指定具体类型。

## 3. 什么是泛型类？

### 3.1. 泛型类

泛型类在定义时使用类型参数，在实例化时指定具体类型。

- 类型参数：`<T>` 是类型占位符
- 实例化时确定：创建实例时指定具体类型
- 类型一致性：所有使用 T 的地方类型相同
- 类型推断：可以省略类型参数，由构造函数参数推断

基本泛型类：

```ts
class Box<T> {
  private value: T

  constructor(value: T) {
    this.value = value
  }

  getValue(): T {
    return this.value
  }

  setValue(value: T): void {
    this.value = value
  }
}

// 使用时指定类型
const numberBox = new Box<number>(42)
const num: number = numberBox.getValue() // 类型安全

const stringBox = new Box<string>('hello')
const str: string = stringBox.getValue() // 类型安全

// 通常不需要显式声明类型，TS 的类型推断会自动识别泛型的具体类型。
const boolBox = new Box(true) // Box<boolean>
// 我们传入了 true
// constructor(value: T) { ... } 这个位置就能推断出 T 是 boolean 类型
// 类中的所有 T 的位置都会被推断为 boolean 类型
// 因此，上述的写法其实也可以简写：
// new Box<number>(42) 可以简写为 new Box(42)
// new Box<string>('hello') 可以简写为 new Box('hello')
```

### 3.2. 基本语法

1. 单个类型参数
2. 泛型属性
3. 泛型方法
4. 默认类型参数

::: code-group

```ts [1]
class Stack<T> {
  private items: T[] = []

  push(item: T): void {
    this.items.push(item)
  }

  pop(): T | undefined {
    return this.items.pop()
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1]
  }

  isEmpty(): boolean {
    return this.items.length === 0
  }

  size(): number {
    return this.items.length
  }
}

const numberStack = new Stack<number>()
numberStack.push(1)
numberStack.push(2)

// 推入错误类型会立刻报错
// numberStack.push('3') // ❌
// Argument of type 'string' is not assignable to parameter of type 'number'.(2345)

console.log(numberStack.pop()) // 2

const stringStack = new Stack<string>()
stringStack.push('a')
stringStack.push('b')
stringStack.push('c')
console.log(stringStack.pop()) // 'c'
```

```ts [2]
class Container<T> {
  // 泛型属性
  public content: T

  constructor(content: T) {
    this.content = content
  }

  getContent(): T {
    return this.content
  }

  setContent(content: T): void {
    this.content = content
  }
}

const container = new Container<number>(100) // 可简写 new Container(100)
const content = container.content // TS 会推断出 content 的类型是 number 类型
console.log(content) // 100
```

```ts [3]
class Mapper<T> {
  constructor(private items: T[]) {}

  // 泛型方法
  map<U>(fn: (item: T) => U): U[] {
    return this.items.map(fn)
  }
}

const numbers = new Mapper([1, 2, 3])
const strings = numbers.map((n) => n.toString()) // 推断结果 string[]
const doubled = numbers.map((n) => n * 2) // 推断结果 number[]
```

```ts [4]
class Result<T = string> {
  constructor(
    public success: boolean,
    public data: any,
    public error?: string
  ) {}

  getResult(): T {
    return this.data
  }
}

// 使用默认类型
const result1 = new Result(true, 'success') // Result<string>

// 指定其他类型
const result2 = new Result<number>(true, 42) // Result<number>
```

:::

### 3.3. 泛型类的特点

- 类型参数化：类的类型可以作为参数传入
- 类型安全：编译时检查类型一致性
- 代码复用：同一个类适用于多种类型
- 灵活性：在使用时指定具体类型

### 3.4. 泛型类 vs 普通类

| 特性       | 泛型类       | 普通类     |
| ---------- | ------------ | ---------- |
| 类型灵活性 | 高           | 低         |
| 代码复用   | 高           | 需要继承   |
| 类型安全   | 编译时检查   | 编译时检查 |
| 复杂度     | 稍高         | 简单       |
| 适用场景   | 容器、工具类 | 业务类     |

### 3.5. 泛型类的优势

1. 类型安全：避免类型转换和运行时错误
2. 代码复用：一套代码适用多种类型
3. 智能提示：IDE 能提供准确的类型提示
4. 约束灵活：可以对类型参数添加约束

## 4. 如何给泛型添加约束？

### 4.1. extends 约束

1. 基本约束
2. 多重约束 - 可以使用交叉类型实现多重约束

::: code-group

```ts [1]
// 使用 extends 约束类型
interface Lengthwise {
  length: number
}

// T extends Lengthwise
// 这么写意味着 T 类型必须满足 Lengthwise 接口
// 表示 T 类型必须具备属性 length: number
class LengthChecker<T extends Lengthwise> {
  constructor(private value: T) {}

  getLength(): number {
    return this.value.length // 类型安全
  }

  compare(other: T): number {
    return this.value.length - other.length
  }
}

const checker1 = new LengthChecker('hello') // string 有 length
const checker2 = new LengthChecker([1, 2, 3]) // array 有 length
// const checker3 = new LengthChecker(42)  // ❌ Error: number 没有 length
// Argument of type 'number' is not assignable to parameter of type 'Lengthwise'.(2345)
```

```ts [2]
interface Named {
  name: string
}

interface Aged {
  age: number
}

// T extends Named & Aged
// 这么写意味着 T 必须同时满足 Named、Aged 接口
class PersonManager<T extends Named & Aged> {
  constructor(private person: T) {}

  introduce(): string {
    return `${this.person.name} is ${this.person.age} years old`
  }
}

interface Student {
  name: string
  age: number
  grade: number
}

const manager = new PersonManager<Student>({
  name: 'Alice',
  age: 20,
  grade: 3,
})

console.log(manager.introduce()) // 'Alice is 20 years old'
```

:::

### 4.2. keyof 约束

使用 `keyof` 可以约束类型参数必须是某个对象类型的键。

```ts
// T 是对象类型，K 必须是 T 的键之一
class PropertyGetter<T, K extends keyof T> {
  constructor(private obj: T, private key: K) {}

  getValue(): T[K] {
    // T[K] 是索引访问类型，表示对象 T 中键 K 对应的值的类型
    return this.obj[this.key]
  }

  setValue(value: T[K]): void {
    this.obj[this.key] = value
  }
}

interface Person {
  name: string
  age: number
}

const person: Person = { name: 'Alice', age: 30 }

// K 被推断为 'name'，因此 getValue() 返回 string 类型
const nameGetter = new PropertyGetter(person, 'name')
console.log(nameGetter.getValue()) // 'Alice'

// ❌ 'invalid' 不是 Person 的键，编译错误
// const invalidGetter = new PropertyGetter(person, 'invalid')
// Argument of type '"invalid"' is not assignable to parameter of type 'keyof Person'.(2345)
```

## 5. 如何给泛型类添加多个类型参数？

```ts
class Pair<K, V> {
  constructor(public key: K, public value: V) {}

  getKey(): K {
    return this.key
  }

  getValue(): V {
    return this.value
  }

  setPair(key: K, value: V): void {
    this.key = key
    this.value = value
  }
}

const pair1 = new Pair<string, number>('age', 30)
const pair2 = new Pair<number, string>(1, 'first')

console.log(pair1.getKey()) // 'age'
console.log(pair1.getValue()) // 30
```

## 6. 静态成员可以使用类的泛型参数吗？

不能。

1. 静态成员属性：不能使用类的泛型参数
2. 静态成员方法：不能使用类的泛型参数（但是允许有自己的泛型参数）

::: code-group

```ts [1]
class Container<T> {
  // ❌ Error: 静态成员不能引用类型参数
  // static defaultValue: T
  // Static members cannot reference class type parameters.(2302)

  private value: T

  constructor(value: T) {
    this.value = value
  }
}
```

```ts [2]
class Container<T> {
  private value: T

  constructor(value: T) {
    this.value = value
  }

  // 静态成员方法可以有自己的泛型，比如这里的 U
  static create<U>(value: U): Container<U> {
    return new Container(value)
  }
}

const container = Container.create(42)
// 推断结果：
// const container = Container<number>
```

:::

## 7. 如何继承泛型类？

在继承一个泛型类的时候，你可以做以下操作：

1. 可以指定具体类型
2. 可以保持原有的泛型信息，或在原有泛型信息的基础上添加新的约束规则
3. 可以在原有泛型信息的基础上添加新的泛型参数

::: code-group

```ts [1]
class Container<T> {
  constructor(protected value: T) {}

  getValue(): T {
    return this.value
  }
}

// 指定具体类型
class StringContainer extends Container<string> {
  getUpperCase(): string {
    return this.value.toUpperCase()
  }
}
```

```ts [2]
class Container<T> {
  constructor(protected value: T) {}

  getValue(): T {
    return this.value
  }
}

// 保持原有的泛型信息
class LogContainer<T> extends Container<T> {
  log(): void {
    console.log(this.value)
  }
}

// 在原有泛型信息的基础上添加新的约束规则
class NumberContainer<T extends number> extends Container<T> {
  double(): T {
    return (this.value * 2) as T
  }
}
```

```ts [3]
class Container<T> {
  constructor(protected value: T) {}

  getValue(): T {
    return this.value
  }
}

// 在原有泛型信息的基础上添加新的泛型参数
// 比如这里的 U 就是新增的泛型参数
class PairContainer<T, U> extends Container<T> {
  constructor(value: T, private secondValue: U) {
    super(value)
  }

  getSecondValue(): U {
    return this.secondValue
  }
}
```

:::

## 8. 类如何实现泛型接口？

1. 普通类（非泛型类）在实现泛型接口时，必须显式指定泛型的具体类型。因为普通类本身没有类型参数可以“传递”给接口，所以必须在实现时“固化”接口中的泛型类型，以便 TypeScript 进行类型检查。
2. 泛型类在实现泛型接口时，可以将类的类型参数传递给接口。这样，接口的类型参数就由类的实例化类型决定，保持了类型的灵活性。

::: code-group

```ts [1]
interface Comparable<T> {
  compareTo(other: T): number
}

class Version implements Comparable<Version> {
  constructor(
    public major: number,
    public minor: number,
    public patch: number
  ) {}

  compareTo(other: Version): number {
    if (this.major !== other.major) {
      return this.major - other.major
    }
    if (this.minor !== other.minor) {
      return this.minor - other.minor
    }
    return this.patch - other.patch
  }

  toString(): string {
    return `${this.major}.${this.minor}.${this.patch}`
  }
}

const v1 = new Version(1, 0, 0)
const v2 = new Version(2, 0, 0)
console.log(v1.compareTo(v2)) // -1
```

```ts [2]
interface IContainer<T> {
  value: T
  getValue(): T
}

// 泛型类实现泛型接口
// 这里的 T 是 Box 类的类型参数，传递给了 IContainer 接口
class Box<T> implements IContainer<T> {
  constructor(public value: T) {}

  getValue(): T {
    return this.value
  }
}

const box1 = new Box<string>('hello')
console.log(box1.getValue()) // 'hello'

const box2 = new Box(100) // 等价于 new Box<number>(100)
// TS 推断结果：
// const box2: Box<number>
// 在这个示例中，TS 会根据我们传入的值自动推断出泛型 T 的类型是 number
console.log(box2.getValue()) // 100
```

:::

## 9. 泛型类可以继承泛型类吗？

可以。这完全符合泛型类的继承规则，你依然可以灵活地处理类型参数：

1. 部分指定：父类有多个类型参数时，子类可以固定其中一部分，保留一部分。
2. 完全传递：子类完全保留父类的泛型参数，甚至可以添加额外的约束。
3. 扩展参数：子类在继承父类泛型的基础上，定义新的泛型参数。

::: code-group

```ts [1]
// 1. 部分指定类型
class KeyValue<K, V> {
  constructor(public key: K, public value: V) {}
}

// 子类固定了 K 为 string，但 V 依然是泛型
// 因此 StringKeyMap 依然是一个泛型类
class StringKeyMap<V> extends KeyValue<string, V> {
  constructor(key: string, value: V) {
    super(key, value)
  }
}

const map = new StringKeyMap<number>('id', 1)
```

```ts [2]
// 2. 完全传递（可添加约束）
class Collection<T> {
  protected items: T[] = []
  add(item: T) {
    this.items.push(item)
  }
}

interface Comparable {
  compareTo(other: this): number
}

// 子类继承了 T，并添加了 extends Comparable 约束
class SortedCollection<T extends Comparable> extends Collection<T> {
  sort() {
    // ...
  }
}
```

```ts [3]
// 3. 扩展新参数
class BaseResponse<T> {
  constructor(public data: T) {}
}

// 子类引入了新的泛型参数 M
class PagedResponse<T, M> extends BaseResponse<T> {
  constructor(data: T, public meta: M) {
    super(data)
  }
}

const res = new PagedResponse<string[], number>(['a', 'b'], 2)
```

:::

## 10. 关于泛型类，都有哪些实践建议？

```ts
// ✅ 使用有意义的类型参数名
class Repository<TEntity extends { id: number }> {
  // TEntity 清楚表明这是实体类型
}

// ✅ 添加必要的约束
class Validator<T extends object> {
  // 约束 T 为对象类型
}

// ✅ 提供默认类型参数
class Response<T = any> {
  constructor(public data: T) {}
}

// ✅ 合理使用泛型提高可复用性
class Collection<T> {
  private items: T[] = []

  add(item: T): void {
    this.items.push(item)
  }

  filter(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate)
  }

  map<U>(fn: (item: T) => U): U[] {
    return this.items.map(fn)
  }
}

// ✅ 文档化泛型参数
/**
 * 泛型容器类
 * @template T - 容器中存储的元素类型
 */
class Container<T> {
  constructor(private value: T) {}
}

// ✅ 使用类型推断
class Box<T> {
  constructor(public value: T) {}

  static from<T>(value: T): Box<T> {
    return new Box(value) // 自动推断类型
  }
}

const box = Box.from(42) // Box<number>

// ✅ 避免过度嵌套
class Complex<T extends Container<Array<Map<string, Set<T>>>>> {}
// 这么写难以理解

// 可以使用类型别名简化
type EntityMap<T> = Map<string, Set<T>>
type EntityArray<T> = Array<EntityMap<T>>
type EntityContainer<T> = Container<EntityArray<T>>

class Simple<T extends EntityContainer<T>> {}
```

## 11. 引用

- [TypeScript Handbook - Generics][1]
- [TypeScript Handbook - Classes][2]
- [TypeScript Deep Dive - Generics][3]

[1]: https://www.typescriptlang.org/docs/handbook/2/generics.html
[2]: https://www.typescriptlang.org/docs/handbook/2/classes.html
[3]: https://basarat.gitbook.io/typescript/type-system/generics
