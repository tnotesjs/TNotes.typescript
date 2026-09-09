// 开启 noImplicitAny
function add(x, y) {
  return x + y;
}
// TS 类型推断的结果如下：
// function add(x: any, y: any): any

// 报错：
// Parameter 'x' implicitly has an 'any' type.
// Parameter 'y' implicitly has an 'any' type.