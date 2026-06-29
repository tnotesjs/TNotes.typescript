# [0211. Exclude](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0211.%20Exclude)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. `Exclude<T, U>` 是什么？](#3-excludet-u-是什么)
  - [3.1. 源码定义](#31-源码定义)
  - [3.2. 工作原理](#32-工作原理)
  - [3.3. 分布式条件类型](#33-分布式条件类型)
  - [3.4. 基本示例](#34-基本示例)
- [4. 如何使用 `Exclude<T, U>`？](#4-如何使用-excludet-u)
  - [4.1. 场景 1：事件类型过滤](#41-场景-1事件类型过滤)
  - [4.2. 场景 2：API 响应状态过滤](#42-场景-2api-响应状态过滤)
  - [4.3. 场景 3：联合类型精确控制](#43-场景-3联合类型精确控制)
  - [4.4. 场景 4：泛型约束](#44-场景-4泛型约束)
- [5. `Exclude<T, U>` 的实际应用场景有哪些？](#5-excludet-u-的实际应用场景有哪些)
  - [5.1. 应用 1：Redux Action 类型安全](#51-应用-1redux-action-类型安全)
  - [5.2. 应用 2：React Props 类型优化](#52-应用-2react-props-类型优化)
  - [5.3. 应用 3：数据库查询构建器](#53-应用-3数据库查询构建器)
  - [5.4. 应用 4：路由守卫类型](#54-应用-4路由守卫类型)
  - [5.5. 应用 5：表单验证规则](#55-应用-5表单验证规则)
- [6. 使用 `Exclude<T, U>` 需要注意什么？](#6-使用-excludet-u-需要注意什么)
  - [6.1. 注意事项 1：只对联合类型有效](#61-注意事项-1只对联合类型有效)
  - [6.2. 注意事项 2：类型兼容性判断](#62-注意事项-2类型兼容性判断)
  - [6.3. 注意事项 3：never 的处理](#63-注意事项-3never-的处理)
  - [6.4. 注意事项 4：分布式条件类型的边界](#64-注意事项-4分布式条件类型的边界)
  - [6.5. 注意事项 5：与泛型的结合](#65-注意事项-5与泛型的结合)
  - [6.6. 注意事项 6：函数类型的排除](#66-注意事项-6函数类型的排除)
  - [6.7. 注意事项 7：性能考虑](#67-注意事项-7性能考虑)
- [7. 引用](#7-引用)

<!-- endregion:toc -->

## 1. 本节内容

- `Exclude<T, U>` 的定义和实现原理
- 条件类型的分布式特性
- 基本使用方法
- 实际应用场景
- 使用注意事项

## 2. 评价

`Exclude<T, U>` 从联合类型 `T` 中排除可以赋值给 `U` 的类型。

## 3. `Exclude<T, U>` 是什么？

`Exclude<T, U>` 从联合类型 `T` 中移除可以赋值给类型 `U` 的成员。

- 基于条件类型实现
- 利用分布式条件类型特性
- 与 `Extract<T, U>` 互为补充操作
- 常用于类型过滤和精确控制
- 是 `Omit<T, K>` 的底层实现之一

### 3.1. 源码定义

```ts
type Exclude<T, U> = T extends U ? never : T
```

### 3.2. 工作原理

```ts
// 分布式条件类型的展开过程
type Example = Exclude<'a' | 'b' | 'c', 'a' | 'c'>

// 展开步骤：
// 1. 联合类型会分发到条件类型的每个成员
// 'a' extends 'a' | 'c' ? never : 'a'  → never
// 'b' extends 'a' | 'c' ? never : 'b'  → 'b'
// 'c' extends 'a' | 'c' ? never : 'c'  → never

// 2. 联合 never 会被自动移除
// never | 'b' | never → 'b'

// 结果：'b'
```

### 3.3. 分布式条件类型

```ts
// Exclude 利用了条件类型的分布式特性
type T = 'a' | 'b' | 'c'
type U = 'a'

// T extends U 会对 T 的每个成员进行判断
type Result = Exclude<T, U>
// 等价于：
// Exclude<'a', 'a'> | Exclude<'b', 'a'> | Exclude<'c', 'a'>
// never | 'b' | 'c'
// 'b' | 'c'
```

### 3.4. 基本示例

```ts
// 字符串字面量类型
type Colors = 'red' | 'green' | 'blue' | 'yellow'
type PrimaryColors = 'red' | 'green' | 'blue'

type SecondaryColors = Exclude<Colors, PrimaryColors>
// 'yellow'

// 数字字面量类型
type Numbers = 1 | 2 | 3 | 4 | 5
type OddNumbers = 1 | 3 | 5

type EvenNumbers = Exclude<Numbers, OddNumbers>
// 2 | 4

// 混合类型
type Mixed = string | number | boolean
type OnlyString = Exclude<Mixed, number | boolean>
// string
```

## 4. 如何使用 `Exclude<T, U>`？

### 4.1. 场景 1：事件类型过滤

```ts
type MouseEvent = 'click' | 'dblclick' | 'mousedown' | 'mouseup' | 'mousemove'
type KeyboardEvent = 'keydown' | 'keyup' | 'keypress'
type AllEvents = MouseEvent | KeyboardEvent

// 只监听键盘事件
type OnlyKeyboardEvents = Exclude<AllEvents, MouseEvent>
// 'keydown' | 'keyup' | 'keypress'

// 排除移动相关的鼠标事件
type StaticMouseEvents = Exclude<MouseEvent, 'mousemove'>
// 'click' | 'dblclick' | 'mousedown' | 'mouseup'

function addEventListener(
  event: StaticMouseEvents,
  handler: (e: Event) => void,
): void {
  document.addEventListener(event, handler)
}

// ✅ 可以监听
addEventListener('click', (e) => {})

// ❌ 不能监听 mousemove
addEventListener('mousemove', (e) => {}) // 错误
```

### 4.2. 场景 2：API 响应状态过滤

```ts
type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'HEAD'
  | 'OPTIONS'

// 只允许修改数据的方法
type MutationMethods = Exclude<HttpMethod, 'GET' | 'HEAD' | 'OPTIONS'>
// 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// 只读方法
type ReadOnlyMethods = Exclude<HttpMethod, MutationMethods>
// 'GET' | 'HEAD' | 'OPTIONS'

function requireAuth(method: MutationMethods): boolean {
  // 修改数据的请求都需要认证
  return true
}

// ✅ 修改方法需要认证
requireAuth('POST')
requireAuth('DELETE')

// ❌ GET 不是修改方法
requireAuth('GET') // 错误
```

### 4.3. 场景 3：联合类型精确控制

```ts
type Primitive = string | number | boolean | null | undefined | symbol | bigint

// 排除 null 和 undefined
type NonNullablePrimitive = Exclude<Primitive, null | undefined>
// string | number | boolean | symbol | bigint

// 只保留数值类型
type NumericTypes = Exclude<
  Primitive,
  string | boolean | null | undefined | symbol
>
// number | bigint

// 示例函数
function processNumeric(value: NumericTypes): number {
  return typeof value === 'number' ? value : Number(value)
}

processNumeric(42) // ✅
processNumeric(100n) // ✅
processNumeric('text') // ❌ 错误
```

### 4.4. 场景 4：泛型约束

```ts
type AllowedTypes = string | number | boolean | object
type ForbiddenTypes = object

// 创建只接受非对象类型的泛型函数
function logPrimitive<T extends Exclude<AllowedTypes, ForbiddenTypes>>(
  value: T,
): void {
  console.log(value)
}

logPrimitive('hello') // ✅
logPrimitive(42) // ✅
logPrimitive(true) // ✅
logPrimitive({}) // ❌ 错误：object 被排除
```

## 5. `Exclude<T, U>` 的实际应用场景有哪些？

### 5.1. 应用 1：Redux Action 类型安全

```ts
type BaseAction = {
  type: string
  payload?: any
}

type UserAction =
  | { type: 'USER_LOGIN'; payload: { username: string; token: string } }
  | { type: 'USER_LOGOUT'; payload: undefined }
  | { type: 'USER_UPDATE'; payload: { username: string } }

type PostAction =
  | { type: 'POST_CREATE'; payload: { title: string; content: string } }
  | { type: 'POST_DELETE'; payload: { id: number } }
  | { type: 'POST_UPDATE'; payload: { id: number; title: string } }

type AllActions = UserAction | PostAction

// 只处理用户相关的 action
type OnlyUserActions = Extract<AllActions, { type: `USER_${string}` }>

// 排除登出 action
type UserActionsWithoutLogout = Exclude<UserAction, { type: 'USER_LOGOUT' }>
// { type: 'USER_LOGIN'; ... } | { type: 'USER_UPDATE'; ... }

function handleUserAction(action: UserActionsWithoutLogout): void {
  switch (action.type) {
    case 'USER_LOGIN':
      console.log('Login:', action.payload.username)
      break
    case 'USER_UPDATE':
      console.log('Update:', action.payload.username)
      break
    // ✅ 不需要处理 USER_LOGOUT
  }
}
```

### 5.2. 应用 2：React Props 类型优化

```ts
type ButtonType = 'button' | 'submit' | 'reset'
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'link'

// Link 按钮不需要 type 属性
type NonLinkVariants = Exclude<ButtonVariant, 'link'>

type ButtonProps = {
  variant: ButtonVariant
  onClick?: () => void
} & (
  | { variant: NonLinkVariants; type?: ButtonType }
  | { variant: 'link'; href: string; type?: never }
)

function Button(props: ButtonProps): JSX.Element {
  if (props.variant === 'link') {
    return <a href={props.href}>{/* ... */}</a>
  }

  return (
    <button type={props.type} onClick={props.onClick}>
      {/* ... */}
    </button>
  )
}

// ✅ 正确用法
;<Button variant="primary" type="submit" />
;<Button variant="link" href="/home" />

// ❌ link 不能有 type
;<Button variant="link" href="/home" type="button" /> // 错误
```

### 5.3. 应用 3：数据库查询构建器

```ts
type Operator =
  | '='
  | '!='
  | '>'
  | '<'
  | '>='
  | '<='
  | 'LIKE'
  | 'IN'
  | 'NOT IN'
  | 'IS NULL'
  | 'IS NOT NULL'

// NULL 检查操作符不需要值
type NullOperators = 'IS NULL' | 'IS NOT NULL'
type ValueOperators = Exclude<Operator, NullOperators>

type WhereClause<T extends string = ValueOperators> = T extends NullOperators
  ? { column: string; operator: T; value?: never }
  : { column: string; operator: T; value: any }

class QueryBuilder {
  private conditions: WhereClause[] = []

  where(column: string, operator: ValueOperators, value: any): this
  where(column: string, operator: NullOperators): this
  where(column: string, operator: Operator, value?: any): this {
    if (operator === 'IS NULL' || operator === 'IS NOT NULL') {
      this.conditions.push({ column, operator, value: undefined })
    } else {
      this.conditions.push({ column, operator, value })
    }
    return this
  }

  build(): string {
    return this.conditions
      .map((c) => {
        if (c.operator === 'IS NULL' || c.operator === 'IS NOT NULL') {
          return `${c.column} ${c.operator}`
        }
        return `${c.column} ${c.operator} ${c.value}`
      })
      .join(' AND ')
  }
}

// 使用
const query = new QueryBuilder()
  .where('age', '>', 18)
  .where('email', 'IS NOT NULL')
  .where('status', '=', 'active')
  .build()
```

### 5.4. 应用 4：路由守卫类型

```ts
type RouteType = 'public' | 'protected' | 'admin' | 'guest'

// 不需要认证的路由
type UnauthenticatedRoutes = Exclude<RouteType, 'protected' | 'admin'>
// 'public' | 'guest'

// 需要认证的路由
type AuthenticatedRoutes = Exclude<RouteType, UnauthenticatedRoutes>
// 'protected' | 'admin'

type Route = {
  path: string
  component: any
  type: RouteType
}

class Router {
  canActivate(route: Route, isAuthenticated: boolean): boolean {
    const authenticatedTypes: AuthenticatedRoutes[] = ['protected', 'admin']

    if (authenticatedTypes.includes(route.type as AuthenticatedRoutes)) {
      return isAuthenticated
    }

    return true
  }
}

// 使用
const router = new Router()
router.canActivate(
  { path: '/profile', component: null, type: 'protected' },
  false,
) // false
router.canActivate({ path: '/home', component: null, type: 'public' }, false) // true
```

### 5.5. 应用 5：表单验证规则

```ts
type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'checkbox'
  | 'radio'

// 不需要长度验证的类型
type NoLengthValidation = 'checkbox' | 'radio'
type TextInputTypes = Exclude<InputType, NoLengthValidation>

type ValidationRule<T extends InputType> = {
  type: T
  required?: boolean
} & (T extends NoLengthValidation
  ? { minLength?: never; maxLength?: never }
  : { minLength?: number; maxLength?: number })

const emailRule: ValidationRule<'email'> = {
  type: 'email',
  required: true,
  minLength: 5, // ✅ 允许
  maxLength: 100,
}

const checkboxRule: ValidationRule<'checkbox'> = {
  type: 'checkbox',
  required: true,
  // minLength: 5, // ❌ 错误：checkbox 不能有长度验证
}

function validateInput<T extends InputType>(
  value: string,
  rule: ValidationRule<T>,
): boolean {
  if (rule.required && !value) {
    return false
  }

  // 类型守卫
  const textTypes: TextInputTypes[] = [
    'text',
    'email',
    'password',
    'number',
    'tel',
    'url',
  ]

  if (textTypes.includes(rule.type as TextInputTypes)) {
    const textRule = rule as ValidationRule<TextInputTypes>
    if (textRule.minLength && value.length < textRule.minLength) {
      return false
    }
    if (textRule.maxLength && value.length > textRule.maxLength) {
      return false
    }
  }

  return true
}
```

## 6. 使用 `Exclude<T, U>` 需要注意什么？

### 6.1. 注意事项 1：只对联合类型有效

```ts
// ✅ 联合类型正常工作
type Union = 'a' | 'b' | 'c'
type Excluded = Exclude<Union, 'a'> // 'b' | 'c'

// ⚠️ 非联合类型的行为
type Single = 'a'
type ExcludedSingle = Exclude<Single, 'a'> // never

type Object = { a: number }
type ExcludedObject = Exclude<Object, { a: number }> // { a: number; } (没有排除)
```

### 6.2. 注意事项 2：类型兼容性判断

```ts
type Numbers = 1 | 2 | 3

// ❌ 不会排除兼容的类型
type ExcludeNumber = Exclude<Numbers, number>
// never (1, 2, 3 都 extends number)

// ✅ 只排除精确匹配
type ExcludeOne = Exclude<Numbers, 1>
// 2 | 3

// 对象类型的兼容性
type A = { a: number; b: string }
type B = { a: number }

type ExcludeB = Exclude<A, B> // A (A 不 extends B，因为 B 少了 b 属性)
```

### 6.3. 注意事项 3：never 的处理

```ts
type WithNever = 'a' | 'b' | never

// never 在联合类型中自动消失
type Result1 = WithNever // 'a' | 'b'

// Exclude 后如果全部被排除，结果是 never
type Result2 = Exclude<'a' | 'b', 'a' | 'b'> // never

// ⚠️ 使用 never 结果的地方需要处理
function process(value: never): void {
  // 这个函数永远不能被调用
}
```

### 6.4. 注意事项 4：分布式条件类型的边界

```ts
// ✅ 正常分布
type Normal = Exclude<'a' | 'b', 'a'> // 'b'

// ⚠️ 联合类型作为整体不会分布
type Wrapped = ['a' | 'b']
type NotDistributed = Exclude<Wrapped, ['a']> // ['a' | 'b'] (没有分布)

// ✅ 解决方法：手动分布
type Distributed = [Exclude<'a' | 'b', 'a'>] // ['b']
```

### 6.5. 注意事项 5：与泛型的结合

```ts
// ⚠️ 泛型可能导致意外结果
function exclude<T, U>(value: T, excluded: U): Exclude<T, U> {
  // 运行时无法实现类型过滤
  return value as Exclude<T, U>
}

// 类型检查通过，但运行时不会真正排除
const result = exclude('a' as 'a' | 'b', 'a') // 类型是 'b'，但值是 'a'

// ✅ Exclude 主要用于类型层面
type SafeResult = Exclude<'a' | 'b', 'a'> // 正确用法
```

### 6.6. 注意事项 6：函数类型的排除

```ts
type Functions = (() => void) | ((x: number) => void) | ((x: string) => void)

// ⚠️ 函数类型的 extends 检查基于参数和返回值的兼容性
type ExcludeVoid = Exclude<Functions, () => void>
// ((x: number) => void) | ((x: string) => void)

// ✅ 更精确的函数类型判断
type FunctionWithParam = (x: any) => void
type NoParamFunction = () => void

type OnlyWithParam = Exclude<Functions, NoParamFunction>
// ((x: number) => void) | ((x: string) => void)
```

### 6.7. 注意事项 7：性能考虑

```ts
// ⚠️ 复杂的联合类型可能影响类型检查性能
type LargeUnion = 'a' | 'b' | 'c' /* ... 100个成员 */

// 每次 Exclude 都要遍历所有成员
type Excluded1 = Exclude<LargeUnion, 'a'>
type Excluded2 = Exclude<Excluded1, 'b'>
type Excluded3 = Exclude<Excluded2, 'c'>

// ✅ 一次性排除多个
type ExcludedOnce = Exclude<LargeUnion, 'a' | 'b' | 'c'>
```

## 7. 引用

- [TypeScript Utility Types - Exclude][1]
- [TypeScript Handbook - Conditional Types][2]
- [TypeScript Deep Dive - Distributive Conditional Types][3]

[1]: https://www.typescriptlang.org/docs/handbook/utility-types.html#excludeuniontype-excludedmembers
[2]: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
[3]: https://basarat.gitbook.io/typescript/type-system/conditional-types
