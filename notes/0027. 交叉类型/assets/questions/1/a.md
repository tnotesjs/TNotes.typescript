# TypeScript 交叉类型中修饰符的处理机制

你的观察是正确的！TypeScript 在处理 `Readonly<T> & Partial<T>` 时，确实会"丢弃"两个修饰符。这不是 bug，而是交叉类型的设计行为。让我详细解释编译器是如何处理的：

## 1. 工具类型的定义

首先，`Readonly<T>` 和 `Partial<T>` 是通过映射类型定义的： TypeScript:1567-1569 TypeScript:1581-1583

## 2. 交叉类型的属性合并规则

在交叉类型 `A & B` 中，TypeScript 对**同名属性**的修饰符采用了特定的合并逻辑：

### readonly 修饰符的处理

TypeScript 使用 `CheckFlags` 枚举来标记合成属性的特征： TypeScript:6114-6140

关键的测试用例清楚地展示了这个行为： TypeScript:1-25 TypeScript:61-75

**readonly 的合并规则：如果任一成员类型的属性是可变的（非 readonly），则交叉类型的结果属性就是可变的。**

在你的例子中：

- `Readonly<User>` 提供 `readonly name: string`（只读）
- `Partial<User>` 提供 `name?: string`（可变，因为 Partial 不添加 readonly）
- 交叉结果：`name` 是**可变的**（因为有一个成员是可变的）

### 可选修饰符（?）的处理

可选性的逻辑则相反： TypeScript:1-23

**可选性的合并规则：如果任一成员类型的属性是必需的（非可选），则交叉类型的结果属性就是必需的。**

在你的例子中：

- `Readonly<User>` 提供 `readonly name: string`（必需，没有 `?`）
- `Partial<User>` 提供 `name?: string`（可选）
- 交叉结果：`name` 是**必需的**（因为有一个成员要求它必需）

## 3. 为什么是这样的设计？

这个设计符合交叉类型的语义：**一个值必须同时满足所有成员类型的约束**。

- **对于 readonly**：如果一个类型说属性可以修改，那么交叉类型就必须允许修改（否则无法同时满足两个类型）
- **对于可选性**：如果一个类型要求属性必须存在，那么交叉类型就必须要求属性存在（否则不满足那个类型的约束）

## 4. 编译器内部实现

编译器使用 `TransientSymbol`（临时符号）来表示交叉类型中的合成属性，并通过 `CheckFlags` 来追踪这些属性的特征： TypeScript:6142-6150 TypeScript:7173-7176

## Notes

你的猜测"取了修饰符的交集"方向是对的，但更准确的理解是：

- **readonly 修饰符**：任一成员可变 → 结果可变（相当于"或"逻辑）
- **可选修饰符**：任一成员必需 → 结果必需（相当于"且"逻辑）

这就是为什么 `Readonly<T> & Partial<T>` 的结果既不是只读也不是可选，而是回归到了最基本的必需且可变的属性类型。如果你需要同时应用两个修饰符，应该使用嵌套的映射类型，例如 `Readonly<Partial<T>>` 或 `Partial<Readonly<T>>`（它们是等价的）。

### Citations

**File:** src/lib/es5.d.ts (L1567-1569)

```typescript
type Partial<T> = {
  [P in keyof T]?: T[P]
}
```

**File:** src/lib/es5.d.ts (L1581-1583)

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}
```

**File:** src/compiler/types.ts (L6114-6140)

```typescript
export const enum CheckFlags {
  None = 0,
  Instantiated = 1 << 0, // Instantiated symbol
  SyntheticProperty = 1 << 1, // Property in union or intersection type
  SyntheticMethod = 1 << 2, // Method in union or intersection type
  Readonly = 1 << 3, // Readonly transient symbol
  ReadPartial = 1 << 4, // Synthetic property present in some but not all constituents
  WritePartial = 1 << 5, // Synthetic property present in some but only satisfied by an index signature in others
  HasNonUniformType = 1 << 6, // Synthetic property with non-uniform type in constituents
  HasLiteralType = 1 << 7, // Synthetic property with at least one literal type in constituents
  ContainsPublic = 1 << 8, // Synthetic property with public constituent(s)
  ContainsProtected = 1 << 9, // Synthetic property with protected constituent(s)
  ContainsPrivate = 1 << 10, // Synthetic property with private constituent(s)
  ContainsStatic = 1 << 11, // Synthetic property with static constituent(s)
  Late = 1 << 12, // Late-bound symbol for a computed property with a dynamic name
  ReverseMapped = 1 << 13, // Property of reverse-inferred homomorphic mapped type
  OptionalParameter = 1 << 14, // Optional parameter
  RestParameter = 1 << 15, // Rest parameter
  DeferredType = 1 << 16, // Calculation of the type of this symbol is deferred due to processing costs, should be fetched with `getTypeOfSymbolWithDeferredType`
  HasNeverType = 1 << 17, // Synthetic property with at least one never type in constituents
  Mapped = 1 << 18, // Property of mapped type
  StripOptional = 1 << 19, // Strip optionality in mapped property
  Unresolved = 1 << 20, // Unresolved type alias symbol
  Synthetic = SyntheticProperty | SyntheticMethod,
  Discriminant = HasNonUniformType | HasLiteralType,
  Partial = ReadPartial | WritePartial,
}
```

**File:** src/compiler/types.ts (L6142-6150)

```typescript
/** @internal */
export interface TransientSymbolLinks extends SymbolLinks {
  checkFlags: CheckFlags
}

/** @internal */
export interface TransientSymbol extends Symbol {
  links: TransientSymbolLinks
}
```

**File:** tests/cases/conformance/types/intersection/intersectionTypeReadonly.ts (L1-25)

```typescript
interface Base {
  readonly value: number
}
interface Identical {
  readonly value: number
}
interface Mutable {
  value: number
}
interface DifferentType {
  readonly value: string
}
interface DifferentName {
  readonly other: number
}
let base: Base
base.value = 12 // error, lhs can't be a readonly property
let identical: Base & Identical
identical.value = 12 // error, lhs can't be a readonly property
let mutable: Base & Mutable
mutable.value = 12
let differentType: Base & DifferentType
differentType.value = 12 // error, lhs can't be a readonly property
let differentName: Base & DifferentName
differentName.value = 12 // error, property 'value' doesn't exist
```

**File:** tests/baselines/reference/intersectionTypeReadonly.types (L61-75)

```text
let mutable: Base & Mutable;
>mutable : Base & Mutable
>        : ^^^^^^^^^^^^^^

mutable.value = 12;
>mutable.value = 12 : 12
>                   : ^^
>mutable.value : number
>              : ^^^^^^
>mutable : Base & Mutable
>        : ^^^^^^^^^^^^^^
>value : number
>      : ^^^^^^
>12 : 12
>   : ^^
```

**File:** tests/cases/compiler/intersectionsAndOptionalProperties.ts (L1-23)

```typescript
// @strict: true

declare let x: { a?: number; b: string }
declare let y: { a: null; b: string }
declare let z: { a: null } & { b: string }

x = y // Error
x = z // Error

// Repro from #36604

interface To {
  field?: number
  anotherField: string
}

type From = { field: null } & Omit<To, 'field'>

function foo(v: From) {
  let x: To
  x = v // Error
  x.field = v.field // Error
}
```

**File:** src/compiler/utilities.ts (L7173-7176)

```typescript
/** @internal */
export function hasEffectiveReadonlyModifier(node: Node): boolean {
  return hasEffectiveModifier(node, ModifierFlags.Readonly)
}
```
