// 使用 TypeScript 的 JavaScript 项目

// 若果你加上 @ts-check 注释，那么将会开启 TS 类型检查
// @ts-check

// 在 JS 文件中，类型通常可以被自动推断。
// 当无法推断类型时，可使用 JSDoc 语法进行显式声明。

/**
 * 可以通过 JSDoc 在 JavaScript 中实现渐进式类型
 * @type {number}
 */
var foo
// 上述写法相当于 TypeScript 中的: let foo: number

var bar
// 上述写法相当于 TypeScript 中的: let bar: any

foo = 0 // ✅ OK
foo = false // ❌ Error 不能将类型“boolean”分配给类型“number”。ts(2322)

bar = 0 // ✅ OK
bar = 'string' // ✅ OK
