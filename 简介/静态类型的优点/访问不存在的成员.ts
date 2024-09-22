function hello() {
  return 'hello world';
}

hello().find('hello'); // ❌
// Property 'find' does not exist on type 'string'.(2339)

// hello() 返回的是一个字符串，TypeScript 发现字符串没有 find() 方法，所以报错了。
// 如果是 JavaScript，只有到运行阶段才会报错。
// 访问了一个不存在的成员，这在 JS 中是最为常见的一种报错。