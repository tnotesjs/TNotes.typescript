let obj = { message: '' }
console.log(obj.messege) // ❌
// Property 'messege' does not exist on type '{ message: string; }'. Did you mean 'message'?(2551)

// 上面示例中，不小心把 message 拼错了，写成 messege。
// JavaScript 遇到这种情况是不报错的。
// TypeScript 就会报错，指出没有定义过这个属性。
// 错误提示中甚至会纠正你，询问你是否是想要访问 message。