function getStr(){
  if (Math.random() < 0.5) {
    return "  hEllO WoRLd ";
  }
  return 404;
}

function parseStr(str){
  return str.split(" ") // ④
    .filter(it => it)
    .map(it => it[0].touppercase() + it.subStr(1).toLowerCase()) // ③
    .join(" ");
}

const stt = getStr(); // ①
const result = parsestr(str); // ②
console.log('result:', result);

// 上述是 JS 实现的版本
// 含有一堆的错误的代码