// 关闭 noImplicitAny
function add(x, y) {
  return x + y;
}

add(1, [1, 2, 3])

// TS 类型推断的结果如下：
// function add(x: any, y: any): any

// 上述程序不会报错