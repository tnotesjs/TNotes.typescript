class Point {
  x: number = 1 // 普通属性
  constructor(
    public x: number, // 参数属性
    // ❌ 报错：Duplicate identifier 'x'.(2300)
    public y: number
  ) {}
}

const p = new Point(2, 3)
console.log(p.x)
