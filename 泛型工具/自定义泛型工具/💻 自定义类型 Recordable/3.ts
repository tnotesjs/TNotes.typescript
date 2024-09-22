export {} // 转为一个模块
type Recordable<T = any> = Record<string, T>

// 声明一个混合类型的 Recordable 对象
let mixedObj: Recordable<number | string | boolean> = {
  name: 'abc',
  age: 30,
  isActive: true,
  isAdmin: false,
  // ...其他属性，这些属性的值只能是 number、string、boolean 类型

  // obj: { a: 1, b: 2 } // ❌ 这么写是错误的
}

// 访问对象的属性
console.log(mixedObj.name) // abc
console.log(mixedObj.age) // 30
console.log(mixedObj.isActive) // true
console.log(mixedObj.isAdmin) // false
