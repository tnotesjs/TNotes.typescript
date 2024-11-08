function f(target: any) {
  console.log('f called')
  return target
}

console.log(1)
@f
class A {
  constructor() {
    console.log('A called')
  }
}
console.log(2)

const a = new A()

console.log(3)

/* 运行上述程序，打印结果如下：
1
f called
2
A called
3
*/