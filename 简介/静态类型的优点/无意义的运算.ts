const a = 0;
const b = true;
const result = a + b; // ❌
// Operator '+' cannot be applied to types 'number' and 'boolean'.(2365)

// 上面示例是合法的 JavaScript 代码，但是没有意义
// 不应该将数值 a 与布尔值 b 相加
// TypeScript 就会直接报错，提示运算符 + 不能用于数值和布尔值的相加。
// 对于大多数类似这样“无意义”的运算，在 TS 中都能够在程序运行之前给予我们反馈。