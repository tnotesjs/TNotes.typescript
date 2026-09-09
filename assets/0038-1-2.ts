export {} // 转为一个模块
type Recordable<T = any> = Record<string, T>

// 声明一个 Recordable 类型的对象
let obj: Recordable = {
  name: 'abc',
  age: 30,
  isActive: true,
  data: { key: 'value' },
  // 这里可以添加任意数量的 key-val
  // 且 val 的类型没有约束
}

// 访问对象的属性
console.log(obj.name) // abc
console.log(obj.age) // 30
console.log(obj.isActive) // true
console.log(obj.data) // { key: 'value' }
