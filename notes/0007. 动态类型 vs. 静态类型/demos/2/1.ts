// 示例 1
let arr: string[] = ['hello', 'typescript', 'world']
let foo = arr[3] // 1 正确
foo.toUpperCase() // 2 正确
// 1 - foo 被推断为了 string 类型，但是 arr[3] 是 undefined
// 2 - 实际运行的时候会抛出错误
