const arr2 = []
arr2.push(1) // ❌
// Argument of type 'number' is not assignable to parameter of type 'never'.ts(2345)

const obj2 = {}
obj2.a = 1 // ❌
// Property 'a' does not exist on type '{}'.ts(2339)

// 上述代码在 JS 中一切正常，但是在 TS 看来就是有问题的。
// TS 会自动帮我们检查不规范的代码。
// 这些不规范的写法在 TS 中会立刻给予我们报错提示。