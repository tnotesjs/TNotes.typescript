function getStr() {
  if (Math.random() < 0.5) {
    return '  hEllO WoRLd '
  }
  return 404
}

function parseStr(str: string) {
  return str
    .split(' ') // ④
    .filter((it) => it)
    .map((it) => it[0].toUpperCase() + it.substring(1).toLowerCase()) // ③
    .join(' ')
}

const str: string | number = getStr() // ①
if (typeof str === 'string') {
  const result = parseStr(str) // ②
  console.log('result:', result)
}

// 将 index.js 的后缀给改为 .ts
// 程序中的很多隐患会立刻暴露出来
// 根据提示，逐个修改，最终得到的 TS 代码如上。
