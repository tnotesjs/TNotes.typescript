function addOne(n:number) {
  return n + 1;
}
addOne('hello') // ❌
// Argument of type 'string' is not assignable to parameter of type 'number'.(2345)

// 函数 addOne() 有一个参数 n，类型为数值 number，表示这个位置只能使用数值，传入其他类型的值就会报错。
// 函数 addOne() 传入了一个字符串 hello，TypeScript 发现类型不对，就报错了，指出这个位置只能传入数值，不能传入字符串。

// JavaScript 语言就没有这个功能，不会检查类型对不对。开发阶段很可能发现不了这个问题，代码也许就会原样发布，导致用户在使用时遇到错误。
// TypeScript 是在开发阶段报错，这样有利于提早发现错误，避免使用时报错。另一方面，函数定义里面加入类型，具有提示作用，可以告诉开发者这个函数怎么用。