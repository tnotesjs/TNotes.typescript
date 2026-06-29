# [0207. Readonly](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0207.%20Readonly)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. `Readonly<T>` 是什么？](#3-readonlyt-是什么)
  - [3.1. 源码定义](#31-源码定义)
  - [3.2. 工作原理](#32-工作原理)
  - [3.3. 基本示例](#33-基本示例)
  - [3.4. readonly 关键字 vs `Readonly<T>`](#34-readonly-关键字-vs-readonlyt)
- [4. 如何实现深度 `Readonly<T>`？](#4-如何实现深度-readonlyt)
- [5. 如何实现运行时不可变的冻结对象？](#5-如何实现运行时不可变的冻结对象)
- [6. 引用](#6-引用)

<!-- endregion:toc -->

## 1. 本节内容

- `Readonly<T>` 的定义和实现原理
- 基本使用方法
- 深度 Readonly 实现

## 2. 评价

`Readonly<T>` 用于将类型 `T` 的所有属性变为只读属性，如果只是想要实现部分属性只读的效果，直接使用 `readonly` 修饰符即可。

## 3. `Readonly<T>` 是什么？

`Readonly<T>` 用于将类型 `T` 的所有属性变为只读属性。

- 提供编译时的不可变性保证
- 适用于配置对象、常量定义等场景
- 只影响第一层属性，嵌套对象需要深度实现
- 只是编译时约束，运行时仍然可以修改（需要借助 `Object.freeze`）

### 3.1. 源码定义

```ts
/**
 * Make all properties in T readonly
 */
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}
```

### 3.2. 工作原理

```ts
type User = {
  id: number
  name: string
  email: string
}

type ReadonlyUser = Readonly<User>
// Readonly<User> 的展开过程：
// 1. keyof User = 'id' | 'name' | 'email'
// 2. readonly [P in 'id' | 'name' | 'email']: User[P]
// 结果：
// type ReadonlyUser = {
//     readonly id: number;
//     readonly name: string;
//     readonly email: string;
// }
```

### 3.3. 基本示例

```ts
type Config = {
  host: string
  port: number
  timeout: number
}

type ReadonlyConfig = Readonly<Config>

const config: ReadonlyConfig = {
  host: 'localhost',
  port: 3000,
  timeout: 5000,
}

// ❌ 所有属性都不能修改
config.host = '0.0.0.0' // ❌ Error
config.port = 8080 // ❌ Error
config.timeout = 10000 // ❌ Error
```

### 3.4. readonly 关键字 vs `Readonly<T>`

```ts
type User = {
  id: number
  name: string
  email: string
}

// 方式 1：手动添加 readonly
type User1 = {
  readonly id: number
  readonly name: string
  readonly email: string
}

// 方式 2：使用 Readonly<T>
type User2 = Readonly<User>

// User1 和 User2 等价
```

## 4. 如何实现深度 `Readonly<T>`？

`Readonly<T>` 只能影响第一层属性，嵌套对象需要自定义工具类型实现。

```ts
type Config = {
  server: {
    host: string
    port: number
  }
  database: {
    url: string
  }
}

type ReadonlyConfig = Readonly<Config>
// type ReadonlyConfig = {
//     readonly server: { // ✅ server 只读
//         host: string; // ❌ 但内层属性并非只读
//         port: number;
//     };
//     readonly database: {
//         url: string;
//     };
// }

const config: ReadonlyConfig = {
  server: { host: 'localhost', port: 3000 },
  database: { url: 'mongodb://localhost' },
}

// ❌ 不能重新赋值 server
config.server = { host: '0.0.0.0', port: 8080 } // ❌ Error

// ⚠️ 但可以修改 server 的属性
config.server.host = '0.0.0.0' // ✅ OK
config.server.port = 8080 // ✅ OK
```

自定义工具类型实现深度只读效果。

```ts
type Config = {
  server: {
    host: string
    port: number
  }
  database: {
    url: string
  }
}

type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends Function
    ? T[P]
    : T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P]
}

type DeepReadonlyConfig = DeepReadonly<Config>
// type DeepReadonlyConfig = {
//     readonly server: DeepReadonly<{
//         host: string;
//         port: number;
//     }>;
//     readonly database: DeepReadonly<{
//         url: string;
//     }>;
// }

const config2: DeepReadonlyConfig = {
  server: { host: 'localhost', port: 3000 },
  database: { url: 'mongodb://localhost' },
}

// ❌ 所有层级都不能修改
config2.server = {} as any // ❌ Error
config2.server.host = '0.0.0.0' // ❌ Error
config2.server.port = 8080 // ❌ Error
config2.database.url = 'other' // ❌ Error
```

## 5. 如何实现运行时不可变的冻结对象？

可以使用 JS 中的 API -> `Object.freeze` 实现运行时不可变的效果。

```ts
// DeepReadonly 提供 TS 类型层面的约束保障
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends Function
    ? T[P]
    : T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P]
}

// Object.freeze 提供 JS 运行层面的约束保障
function deepFreeze<T extends object>(obj: T): DeepReadonly<T> {
  Object.freeze(obj)

  Object.keys(obj).forEach((key) => {
    const value = (obj as any)[key]
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      deepFreeze(value)
    }
  })

  return obj as DeepReadonly<T>
}

const config = {
  server: {
    host: 'localhost',
    port: 3000,
  },
  database: {
    url: 'mongodb://localhost',
  },
}

const frozenConfig = deepFreeze(config)

// ❌ 运行时也会报错
try {
  ;(frozenConfig as any).server.host = '0.0.0.0'
} catch (error) {
  console.error('Cannot modify frozen object')
}
```

## 6. 引用

- [TypeScript Utility Types - Readonly][1]
- [TypeScript Handbook - Readonly Properties][2]
- [MDN - Object.freeze()][3]

[1]: https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype
[2]: https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties
[3]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
