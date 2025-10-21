# DeepWiki Q&A with Code Context for Repository: microsoft/TypeScript

https://deepwiki.com/search/-type-readonlyandpartialt-read_a096601d-5e4e-40e4-a992-6f483462739a

```ts
// 修饰符冲突示例
type ReadonlyAndPartial<T> = Readonly<T> & Partial<T>
// - Readonly<T> 要求所有属性只读
// - Partial<T> 要求所有属性可选

interface User {
  name: string
  age: number
}

type UserReadonlyAndPartial = ReadonlyAndPartial<User> // 【1】
// type UserReadonlyAndPartial = { readonly name: string; readonly age: number } & { name?: string; age?: number } // 【2】行为表现同【1】

// 【1】推断结果：
// type UserReadonlyAndPartial = Readonly<User> & Partial<User>
// 展开后相当于：{ readonly name: string; readonly age: number } & { name?: string; age?: number }

// ❌ 【1】错误的理解：
// type UserReadonlyAndPartial = {
//   readonly name?: string;
//   readonly age?: number;
// }

// ✅ 【1】正确理解：
// type UserReadonlyAndPartial = {
//   name: string;
//   age: number;
// }

// TypeScript 在交叉类型中会合并属性类型，但不会合并修饰符为 readonly + ? 这种组合（属性即是只读、又是可选）。
// 从最终的行为表现来看，TS 是直接将修饰符给丢弃了，只读约束和可选约束都没有起到作用。

// ⚠️ 以下是根据最终行为表现的猜测（没读过 tsc 源码）：
// 更像是取了修饰符「readonly 只读」、「? 可选」中的共同“特性”
// 只读是 Readonly<T> 特有的“特性”
// 可选是 Partial<T> 特有的“特性”
// 两者之间的交集 ∩，自然就是既不只读、也不可选

// 丢弃 Partial<T>
const user: UserReadonlyAndPartial = {
  // name，age 都不可以省略
  name: 'Foo',
  age: 18,
}

// ❌ 比如，如果省略 age，那么会报错：
// Type '{ name: string; }' is not assignable to type 'UserReadonlyAndPartial'.
// Property 'age' is missing in type '{ name: string; }' but required in type 'Readonly<User>'.(2322)

// 丢弃 Readonly<T>
// 这里不会报错（readonly 未被严格应用）
user.name = 'Bob' // ✅ 可修改（行为宽松）
```

你能解释 TS 编译器是如何处理这种情况的吗？
