const arr = []

// IDE 提示：
// const arr: any[]

arr.push(123) // 丢一个数字进去

type ArrType = typeof arr
// IDE 提示：
// type ArrType = number[]

arr.push('abc') // 丢一个字符串进去

type ArrType2 = typeof arr
// IDE 提示：
// type ArrType2 = (string | number)[]

const test1: ArrType = [1, '1']
// IDE 报错：
// Type 'string' is not assignable to type 'number'.(2322)

const test2: ArrType2 = [1, '1']
