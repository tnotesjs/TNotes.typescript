// 例一
let x = 1;
x = 'hello'; // ❌
// Type 'string' is not assignable to type 'number'.(2322)

// 例二
let y = { foo: 1 };
delete y.foo; // ❌
// The operand of a 'delete' operator must be optional.(2790)
// (property) foo: number

y.bar = 2; // ❌
// Property 'bar' does not exist on type '{ foo: number; }'.(2339)

// 例一的报错是因为变量赋值时，TypeScript 已经推断确定了类型，后面就不允许再赋值为其他类型的值，即变量的类型是静态的。
// 例二的报错是因为对象的属性也是静态的，不允许随意增删。