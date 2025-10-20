# [0023. object 类型和 Object 类型](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0023.%20object%20%E7%B1%BB%E5%9E%8B%E5%92%8C%20Object%20%E7%B1%BB%E5%9E%8B)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是 Object 类型（大写 O）？](#3--什么是-object-类型大写-o)
- [4. 🤔 什么是 object 类型（小写 o）？](#4--什么是-object-类型小写-o)
- [5. 🆚 Object vs. object](#5--object-vs-object)
- [6. 🤔 使用 object 类型的最佳实践是什么？](#6--使用-object-类型的最佳实践是什么)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- object
- Object

## 2. 🫧 评价

- object 和 Object 都不太常用，简单了解即可。
- 官方文档对 object 和 Object 的描述也不多（因为它们的约束太宽泛了，通常起不到太大的作用），更多的篇幅都是在介绍 interface 类型和 type 类型，以定义对象的具体类型。

## 3. 🤔 什么是 Object 类型（大写 O）？

`Object` 是 JavaScript 内置的 `Object` 构造函数的类型，它代表所有对象的基类。

- 包含原始类型：`Object` 类型实际上可以接受任何值，包括原始类型（string、number、boolean 等）
- 过于宽泛：几乎等同于 `any` 类型，但仍然保留一些类型检查
- 不推荐使用：因为它无法提供有效的类型安全

```typescript
// Object 类型可以接受任何值
let obj1: Object = 'hello' // ✅ 允许
let obj2: Object = 42 // ✅ 允许
let obj3: Object = true // ✅ 允许
let obj4: Object = { name: 'John' } // ✅ 允许
let obj5: Object = null // ❌ 错误（严格模式下）
let obj6: Object = undefined // ❌ 错误（严格模式下）

// 虽然可以赋值，但访问属性时会有问题
let str: Object = 'hello'
// str.length; // ❌ 错误：Property 'length' does not exist on type 'Object'
```

---

不推荐使用 Object 类型的原因：

```typescript
// 不好的做法
function processItem(item: Object) {
  // 无法确定 item 的具体结构
  // 可能是字符串、数字或真正的对象
}

// 更好的做法
function processItem(item: object) {
  // 确保 item 是真正的对象
}

// 或者使用更具体的类型
function processItem(item: Record<string, any>) {
  // 明确表示这是一个键值对对象
}

// 如果能够明确具体的字段，更推荐直接使用 interface 或类型别名来明确具体的结构。
```

## 4. 🤔 什么是 object 类型（小写 o）？

`object` 是 TypeScript 2.2 引入的类型，专门表示非原始类型的值。

- 排除原始类型：不能是 `string`、`number`、`boolean`、`symbol`、`null`、`undefined`
- 只接受对象：包括普通对象、数组、函数等
- 类型安全：提供更好的类型约束

```typescript
// object 类型只能接受非原始类型
let obj1: object = { name: 'John' } // ✅ 允许
let obj2: object = [1, 2, 3] // ✅ 允许（数组是对象）
let obj3: object = () => {} // ✅ 允许（函数是对象）
let obj4: object = new Date() // ✅ 允许
// 对象、数组、函数都属于 object 类型

// 以下都会报错
let obj5: object = 'hello' // ❌ 错误
let obj6: object = 42 // ❌ 错误
let obj7: object = true // ❌ 错误
let obj8: object = null // ❌ 错误(开启 strictNullChecks 时)
let obj9: object = undefined // ❌ 错误(开启 strictNullChecks 时)
```

---

使用 object 类型的一些常见场景：

```typescript
// 函数参数需要确保传入的是对象而不是原始类型
function cloneObject(obj: object): object {
  return { ...(obj as any) } // 注意：需要类型断言
}

// 更好的做法是使用泛型
function cloneObject<T extends object>(obj: T): T {
  return { ...obj }
}

// 对象字面量类型
type Config = {
  settings: object // 确保 settings 是对象而非字符串等
}
```

## 5. 🆚 Object vs. object

| 特性     | `Object` (大写) | `object` (小写)     |
| -------- | --------------- | ------------------- |
| 使用频率 | 低              | 低（但高于 Object） |
| 原始类型 | ✅ 允许         | ❌ 不允许           |
| 对象类型 | ✅ 允许         | ✅ 允许             |
| 类型安全 | 低（过于宽泛）  | 高（精确约束）      |
| 推荐使用 | ❌ 不推荐       | ✅ 推荐             |
| 引入版本 | TypeScript 1.0+ | TypeScript 2.2+     |

## 6. 🤔 使用 object 类型的最佳实践是什么？

1. 优先使用 `object`：当你需要表示非原始类型的对象时
2. 避免使用 `Object`：除非你有特殊需求
3. 使用更具体的类型：如接口、类型别名、`Record` 等
4. 结合泛型使用：提供更好的类型推断

```typescript
// 推荐的模式
function mergeObjects<T extends object, U extends object>(
  obj1: T,
  obj2: U
): T & U {
  return { ...obj1, ...obj2 }
}

// 而不是
function mergeObjects(obj1: Object, obj2: Object) {
  // 类型信息丢失
}
```
