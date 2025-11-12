type Point = { x: number; y: number }

// ✅ 不再报错（开启 suppressExcessPropertyErrors 后）
const p: Point = { x: 1, y: 3, m: 10 }

type A = { x: number }

// ✅ 不再报错（开启 suppressExcessPropertyErrors 后）
let a: A = { x: 1, y: 'extra' }
