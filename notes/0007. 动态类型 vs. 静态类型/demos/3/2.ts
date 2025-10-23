const arr: number[] = []

type ArrType = typeof arr

const newArr: ArrType = [1, '1']
// IDE 报错：
// Type 'string' is not assignable to type 'number'.(2322)
