export {} // 转为一个模块
type Recordable<T = any> = Record<string, T>

type User = {
  id: number
  name: string
}

// 使用 Recordable 泛型来定义对象
let users: Recordable<User> = {
  '1': { id: 1, name: 'Foo' },
  '2': { id: 2, name: 'Bar' },
  // key 必须是字符串类型
  // val 必须满足 User 结构
}

// 访问对象的属性
console.log(users['1'].name) // Foo
console.log(users['2'].id) // 2
