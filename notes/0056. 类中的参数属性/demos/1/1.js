var Point = /** @class */ (function () {
    function Point(x, // 参数属性
    // ❌ 报错：Duplicate identifier 'x'.(2300)
    y) {
        this.x = x;
        this.y = y;
        this.x = 1; // 普通属性
    }
    return Point;
}());
var p = new Point(2, 3);
console.log(p.x);
