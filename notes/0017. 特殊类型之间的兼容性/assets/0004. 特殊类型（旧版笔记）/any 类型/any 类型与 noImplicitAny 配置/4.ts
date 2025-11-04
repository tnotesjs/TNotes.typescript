// 开启 noImplicitAny
var x1: number
let x2: string
var x3 // var x3: any 不报错
let x4 // let x4: any 不报错

x3 = 123 // ✅
x4 = { foo: 'hello' } // ✅
// x3、x4 被推断为 any 类型，可以赋任意值。

x1 = 123 // ✅
x2 = 'abc' // ✅

x1 = x2 // ❌
// Type 'string' is not assignable to type 'number'.ts(2322)
