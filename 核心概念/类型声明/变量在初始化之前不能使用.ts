let x:number;
console.log(x) // ❌
// Variable 'x' is used before being assigned.(2454)

// 变量 x 没有赋值就被读取，导致报错。

// TypeScript 规定，变量只有赋值后才能使用，否则就会报错。
// JavaScript 允许这种行为，不会报错，没有赋值的变量会返回 undefined。