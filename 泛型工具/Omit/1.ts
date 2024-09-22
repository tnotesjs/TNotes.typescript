export {}

// 假设我们有一个表示用户的接口 User，包括姓名、年龄和电子邮件地址：
interface User {
  name: string
  age: number
  email: string
}

// 如果我们想创建一个新类型，其中不包括 email 属性，我们可以使用 Omit：
type UserWithoutEmail = Omit<User, 'email'>

// 使用 UserWithoutEmail
const user: UserWithoutEmail = {
  name: 'Alice',
  age: 30,
  // email: "not allowed here" // 这会导致 TypeScript 编译错误
}
// UserWithoutEmail 类型具有 User 类型的所有属性，除了 email。
// 尝试添加 email 属性将导致 TypeScript 编译错误，因为 email 属性在 UserWithoutEmail 类型中被省略了。