function toString(num: number) {
  return String(num)
}
// 等效：
// function toString(num: number): string {
//   return String(num);
// }

// 函数 toString() 没有声明返回值的类型，但是 TypeScript 知道 String(...) 返回的是字符串，所以它推断出 toString 的返回值类型是字符串类型。
// 正是因为 TypeScript 的类型推断，所以函数返回值的类型通常是省略不写的。
