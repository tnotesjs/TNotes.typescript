// TS
let x = 1;
x = 'hello'; // ❌
// Type 'string' is not assignable to type 'number'.(2322)

// 一开始给变量 x 赋值为 1
// 此时 TS 会认为变量 x 的类型是一个 number 类型
// 然后重新给 x 赋值为字符串 'hello'，会报错

// 这是因为在 TS 中，类型是静态的，类型确定后如果再随便改，那是会报错的。