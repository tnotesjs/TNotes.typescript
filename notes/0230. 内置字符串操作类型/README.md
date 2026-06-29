# [0230. 内置字符串操作类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0230.%20%E5%86%85%E7%BD%AE%E5%AD%97%E7%AC%A6%E4%B8%B2%E6%93%8D%E4%BD%9C%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. 内置字符串操作类型有哪些？](#3-内置字符串操作类型有哪些)
  - [3.1. Uppercase](#31-uppercase)
  - [3.2. Lowercase](#32-lowercase)
  - [3.3. Capitalize](#33-capitalize)
  - [3.4. Uncapitalize](#34-uncapitalize)
- [4. 引用](#4-引用)

<!-- endregion:toc -->

## 1. 本节内容

- todo

## 2. 评价

- todo

## 3. 内置字符串操作类型有哪些？

### 3.1. Uppercase

将字符串转换为大写。

```ts
type Uppercase<S extends string> = intrinsic

type Loud = Uppercase<'hello'> // 'HELLO'
type ShoutName = Uppercase<'TypeScript'> // 'TYPESCRIPT'

// 与模板字面量结合
type MakeConstant<T extends string> = Uppercase<`${T}_CONSTANT`>
type API_KEY = MakeConstant<'api'> // 'API_CONSTANT'
```

### 3.2. Lowercase

将字符串转换为小写。

```ts
type Lowercase<S extends string> = intrinsic

type Quiet = Lowercase<'HELLO'> // 'hello'
type VariableName = Lowercase<'UserName'> // 'username'

// 实际应用
type ToSnakeCase<T extends string> = Lowercase<T>
type FileName = ToSnakeCase<'MyComponent'> // 'mycomponent'
```

### 3.3. Capitalize

将首字母大写。

```ts
type Capitalize<S extends string> = intrinsic

type Title = Capitalize<'hello'> // 'Hello'
type PropertyName = Capitalize<'firstName'> // 'FirstName'

// 生成 getter 方法名
type Getter<T extends string> = `get${Capitalize<T>}`
type GetName = Getter<'name'> // 'getName'
type GetAge = Getter<'age'> // 'getAge'
```

### 3.4. Uncapitalize

将首字母小写。

```ts
type Uncapitalize<S extends string> = intrinsic

type LowerFirst = Uncapitalize<'Hello'> // 'hello'
type CamelCase = Uncapitalize<'FirstName'> // 'firstName'

// 从类型名生成实例变量名
type InstanceName<T extends string> = Uncapitalize<T>
type UserVar = InstanceName<'User'> // 'user'
```

## 4. 引用

- [TypeScript Handbook - Template Literal Types][1]

[1]: https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#intrinsic-string-manipulation-types
