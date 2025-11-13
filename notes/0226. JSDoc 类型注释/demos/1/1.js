// @ts-check

// 基本类型注解
/**
 * 计算两个数的和
 * @param {number} a - 第一个数字
 * @param {number} b - 第二个数字
 * @returns {number} 两数之和
 */
function add(a, b) {
  return a + b
}

// 使用时有类型检查
add(1, 2) // ✅ 正确
add('1', 2) // ❌ Error: Argument of type 'string' is not assignable to parameter of type 'number'

// 变量类型注解
/**
 * @type {string}
 */
let username = 'Alice'

username = 'Bob' // ✅ 正确
username = 123 // ❌ Error: Type 'number' is not assignable to type 'string'

// 对象类型注解
/**
 * @type {{ name: string, age: number }}
 */
const person = {
  name: 'Alice',
  age: 30,
}

// 数组类型注解
/**
 * @type {number[]}
 */
const numbers = [1, 2, 3]

/**
 * @type {Array<string>}
 */
const names = ['Alice', 'Bob']

// 联合类型
/**
 * @type {string | number}
 */
let value = 'hello'
value = 123 // ✅ 正确
value = true // ❌ Error: Type 'boolean' is not assignable to type 'string | number'

// 可选参数
/**
 * @param {string} name
 * @param {number} [age] - 可选参数
 * @returns {string}
 */
function greet(name, age) {
  if (age !== undefined) {
    return `Hello, ${name}! You are ${age} years old.`
  }
  return `Hello, ${name}!`
}

// 默认参数
/**
 * @param {string} message
 * @param {number} [times=1] - 重复次数
 */
function repeat(message, times = 1) {
  return message.repeat(times)
}

// 剩余参数
/**
 * @param {...number} numbers
 * @returns {number}
 */
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0)
}
