// 关闭 noImplicitAny
function add(x: number, y: number) {
  return x + y;
}

add(1, [1, 2, 3]) // ❌
// 报错：Argument of type 'number[]' is not assignable to parameter of type 'number'.