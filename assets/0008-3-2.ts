let foo = 123
foo = 'hello' // ❌
// Type 'string' is not assignable to type 'number'.(2322)

// 如果变量 foo 更改为其他类型的值，跟推断的类型不一致，TypeScript 就会报错。
// 变量 foo 的类型推断为 number，后面赋值为字符串，TypeScript 就报错了。
