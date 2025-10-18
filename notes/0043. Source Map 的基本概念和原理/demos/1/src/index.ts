function triggerError() {
  const obj: any = 123
  // 故意访问不存在的方法制造错误
  return obj.nonExistMethod()
}

console.log('----------------------------------------------------------')
console.log('⚠️ ⚠️ ⚠️ 即将抛出错误... 请注意下面报错的堆栈信息：')
console.log('----------------------------------------------------------')

triggerError()
