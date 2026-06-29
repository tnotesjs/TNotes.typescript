# [0255. 结构类型系统的实现](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0255.%20%E7%BB%93%E6%9E%84%E7%B1%BB%E5%9E%8B%E7%B3%BB%E7%BB%9F%E7%9A%84%E5%AE%9E%E7%8E%B0)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 结构类型系统的基本原理？](#3-结构类型系统的基本原理)
  - [3.1. 基本概念](#31-基本概念)
  - [3.2. 属性比较](#32-属性比较)
  - [3.3. 嵌套结构比较](#33-嵌套结构比较)
- [4. 类型比较算法？](#4-类型比较算法)
  - [4.1. 对象类型比较](#41-对象类型比较)
  - [4.2. 函数类型比较](#42-函数类型比较)
- [5. 循环类型引用的处理？](#5-循环类型引用的处理)
  - [5.1. 循环引用示例](#51-循环引用示例)
  - [5.2. 处理策略](#52-处理策略)
  - [5.3. 实际应用](#53-实际应用)
- [6. 性能优化策略？](#6-性能优化策略)
  - [6.1. 类型缓存](#61-类型缓存)
  - [6.2. 结构共享](#62-结构共享)
  - [6.3. 增量类型检查](#63-增量类型检查)
  - [6.4. 延迟计算](#64-延迟计算)
- [7. 结构类型 vs. 名义类型](#7-结构类型-vs-名义类型)
  - [7.1. 结构类型示例](#71-结构类型示例)
  - [7.2. 名义类型示例](#72-名义类型示例)
  - [7.3. 模拟名义类型](#73-模拟名义类型)
- [8. 引用](#8-引用)

<!-- endregion:toc -->

## 1. 本节内容

- 结构类型系统的基本原理
- 类型比较算法
- 循环类型引用的处理
- 性能优化策略
- 结构类型与名义类型的对比

## 2. 评价

TypeScript 使用结构类型系统，只关心类型的形状而非名称。

- 类型兼容性基于结构
- 支持鸭子类型
- 与 JavaScript 的灵活性匹配
- 需要处理循环引用
- 使用缓存优化性能

## 3. 结构类型系统的基本原理？

结构类型系统比较类型的结构而非名称。

### 3.1. 基本概念

```ts
// ✅ 结构类型：只看形状
interface Point {
  x: number
  y: number
}

interface Coordinate {
  x: number
  y: number
}

const point: Point = { x: 1, y: 2 }
const coord: Coordinate = point // ✅ 兼容（结构相同）

// 类型检查不关心名称
// 只检查：
// 1. 是否有 x 属性且类型为 number
// 2. 是否有 y 属性且类型为 number
```

### 3.2. 属性比较

```ts
// ✅ 多余属性是兼容的
interface Named {
  name: string
}

const person = {
  name: 'Tom',
  age: 25,
  email: 'tom@example.com',
}

const named: Named = person // ✅ 兼容

// 比较过程：
// 1. Named 需要 name: string
// 2. person 有 name: string ✅
// 3. person 有额外属性 → 允许（更多属性不影响兼容性）
```

### 3.3. 嵌套结构比较

```ts
// ✅ 递归比较嵌套结构
interface User {
  name: string
  address: {
    city: string
    country: string
  }
}

const user = {
  name: 'Tom',
  address: {
    city: 'Beijing',
    country: 'China',
    zipCode: '100000', // 额外属性
  },
}

const u: User = user // ✅ 兼容

// 比较过程：
// 1. 检查 name: string ✅
// 2. 检查 address 对象：
//    - city: string ✅
//    - country: string ✅
//    - 额外的 zipCode 不影响兼容性
```

## 4. 类型比较算法？

TypeScript 使用递归算法比较类型结构。

### 4.1. 对象类型比较

```ts
// TypeScript 内部的比较算法（简化版）

function isAssignableTo(source: Type, target: Type): boolean {
  // 1. 相同类型
  if (source === target) return true

  // 2. any 类型
  if (target.kind === TypeKind.Any) return true
  if (source.kind === TypeKind.Any) return true

  // 3. 对象类型
  if (target.kind === TypeKind.Object) {
    // 检查目标类型的每个属性
    for (const prop of target.properties) {
      const sourceProp = source.getProperty(prop.name)

      // 源类型必须有对应属性
      if (!sourceProp) return false

      // 递归比较属性类型
      if (!isAssignableTo(sourceProp.type, prop.type)) {
        return false
      }
    }
    return true
  }

  // 4. 联合类型
  if (source.kind === TypeKind.Union) {
    // 源是联合类型，每个成员都必须兼容
    return source.types.every((t) => isAssignableTo(t, target))
  }

  return false
}

// 示例
interface A {
  name: string
}

interface B {
  name: string
  age: number
}

// isAssignableTo(B, A) → true
// 因为 B 有 A 需要的所有属性

// isAssignableTo(A, B) → false
// 因为 A 缺少 age 属性
```

### 4.2. 函数类型比较

```ts
// ✅ 函数类型的比较规则

// 参数：逆变
type Handler1 = (a: string | number) => void
type Handler2 = (a: string) => void

// Handler1 可以赋值给 Handler2
// 因为 Handler1 可以处理更多类型

// 比较算法：
// isAssignableTo(Handler1, Handler2):
// 1. 参数类型比较（逆变）
//    isAssignableTo(string, string | number) ✅
// 2. 返回类型比较（协变）
//    isAssignableTo(void, void) ✅

// 返回值：协变
type Getter1 = () => string
type Getter2 = () => string | number

// Getter1 可以赋值给 Getter2
// 因为 string 是 string | number 的子类型

// 比较算法：
// isAssignableTo(Getter1, Getter2):
// isAssignableTo(string, string | number) ✅
```

## 5. 循环类型引用的处理？

TypeScript 需要处理循环引用的类型。

### 5.1. 循环引用示例

```ts
// ✅ 循环引用的类型
interface Node {
  value: number
  next: Node | null // 循环引用
}

interface TreeNode {
  value: number
  left: TreeNode | null // 循环引用
  right: TreeNode | null // 循环引用
}

// 比较这些类型时需要避免无限递归
```

### 5.2. 处理策略

```ts
// TypeScript 使用栈跟踪正在比较的类型对

// 伪代码
function isAssignableTo(
  source: Type,
  target: Type,
  stack: Set<TypePair> = new Set()
): boolean {
  // 检查是否正在比较这对类型（避免无限递归）
  const pair = { source, target }
  if (stack.has(pair)) {
    // 假设兼容（乐观策略）
    return true
  }

  // 添加到栈
  stack.add(pair)

  try {
    // 执行实际比较
    return doCompare(source, target, stack)
  } finally {
    // 从栈移除
    stack.delete(pair)
  }
}

// 示例：比较循环类型
interface A {
  prop: A | null
}

interface B {
  prop: B | null
}

// isAssignableTo(A, B):
// 1. 比较 A 和 B
// 2. 比较 prop 属性：A | null 和 B | null
// 3. 比较 A 和 B（检测到循环）
// 4. 假设兼容 ✅
```

### 5.3. 实际应用

```ts
// ✅ 链表类型
interface LinkedList<T> {
  value: T
  next: LinkedList<T> | null
}

const list: LinkedList<number> = {
  value: 1,
  next: {
    value: 2,
    next: null,
  },
}

// ✅ JSON 类型（可能有循环）
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue }

// 类型检查能正确处理这些循环定义
```

## 6. 性能优化策略？

TypeScript 使用多种策略优化类型比较性能。

### 6.1. 类型缓存

```ts
// TypeScript 内部缓存类型比较结果

// 伪代码
const comparisonCache = new Map<TypePair, boolean>()

function isAssignableTo(source: Type, target: Type): boolean {
  const key = { source, target }

  // 检查缓存
  if (comparisonCache.has(key)) {
    return comparisonCache.get(key)!
  }

  // 执行比较
  const result = doCompare(source, target)

  // 缓存结果
  comparisonCache.set(key, result)

  return result
}

// 优势：
// - 避免重复计算
// - 特别是对于复杂类型和循环引用
```

### 6.2. 结构共享

```ts
// ✅ TypeScript 共享相同的类型对象

// 源代码
interface User1 {
  name: string
  age: number
}
interface User2 {
  name: string
  age: number
}

// 编译器内部可能只创建一个类型对象：
// UserType = { properties: { name: string, age: number } }
// User1 和 User2 都指向同一个对象

// 优势：
// - 减少内存使用
// - 类型比较更快（指针相等性检查）
```

### 6.3. 增量类型检查

```ts
// ✅ 增量编译

// tsconfig.json
{
  "compilerOptions": {
    "incremental": true,           // 启用增量编译
    "tsBuildInfoFile": ".tsbuildinfo"  // 缓存文件
  }
}

// 工作原理：
// 1. 首次编译：检查所有文件，保存类型信息
// 2. 后续编译：
//    - 只重新检查修改的文件
//    - 使用缓存的类型信息
//    - 避免重新解析未修改的依赖
```

### 6.4. 延迟计算

```ts
// TypeScript 延迟计算复杂类型

// ✅ 只在需要时才计算
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}

interface User {
  name: string
  profile: {
    age: number
    address: {
      city: string
    }
  }
}

// 类型 DeepReadonly<User> 不会立即计算
// 只在实际使用时才递归展开
```

## 7. 结构类型 vs. 名义类型

不同类型系统的对比。

| 特性              | 结构类型（TypeScript） | 名义类型（Java、C#） |
| ----------------- | ---------------------- | -------------------- |
| 比较依据          | 类型的结构             | 类型的名称           |
| 兼容性            | 结构相同即兼容         | 必须显式继承         |
| 灵活性            | 高（鸭子类型）         | 低（需要明确声明）   |
| 类型安全          | 中等                   | 高                   |
| JavaScript 兼容性 | 完美                   | 不适用               |

### 7.1. 结构类型示例

```ts
// ✅ TypeScript：结构类型
interface Printable {
  print(): void
}

class Document {
  print() {
    console.log('Printing document')
  }
}

// Document 没有显式实现 Printable
// 但因为结构匹配，所以兼容
const printable: Printable = new Document() // ✅
```

### 7.2. 名义类型示例

```java
// Java：名义类型
interface Printable {
  void print();
}

class Document {  // ❌ 必须显式 implements Printable
  public void print() {
    System.out.println("Printing document");
  }
}

// ❌ 编译错误：Document 没有实现 Printable
// Printable printable = new Document();

// ✅ 必须显式声明
class Document implements Printable {
  public void print() {
    System.out.println("Printing document");
  }
}
```

### 7.3. 模拟名义类型

```ts
// ✅ TypeScript 中模拟名义类型（品牌类型）
type Brand<K, T> = K & { __brand: T }

type UserId = Brand<number, 'UserId'>
type ProductId = Brand<number, 'ProductId'>

function getUserById(id: UserId) {
  console.log(`Getting user ${id}`)
}

const userId = 1 as UserId
const productId = 2 as ProductId

getUserById(userId) // ✅
// getUserById(productId);  // ❌ 类型不兼容

// 即使底层都是 number，但品牌不同，不能混用
```

## 8. 引用

- [Structural Type System][1]
- [Type Compatibility][2]
- [TypeScript Type Checker][3]

[1]: https://www.typescriptlang.org/docs/handbook/type-compatibility.html
[2]: https://github.com/microsoft/TypeScript/wiki/FAQ#why-are-function-parameters-bivariant
[3]: https://github.com/microsoft/TypeScript/wiki/Architectural-Overview#type-checker
