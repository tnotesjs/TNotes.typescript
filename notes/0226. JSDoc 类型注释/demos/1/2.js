/**
 * 函数简短描述（第一行）
 *
 * 详细描述可以占多行
 * 可以包含示例代码
 *
 * @param {类型} 参数名 - 参数描述
 * @param {类型} [可选参数名] - 可选参数描述
 * @returns {返回类型} 返回值描述
 * @throws {错误类型} 抛出错误的描述
 * @example
 * // 使用示例
 * const result = myFunction(arg1, arg2);
 */
function myFunction(param1, param2) {
  // 函数实现
}

// 完整示例
/**
 * 从数组中查找元素
 *
 * 使用二分查找算法，要求数组已排序
 *
 * @template T
 * @param {T[]} array - 已排序的数组
 * @param {T} target - 要查找的目标值
 * @param {function(T, T): number} [compareFn] - 自定义比较函数
 * @returns {number} 元素索引，未找到返回 -1
 * @throws {TypeError} 如果数组未排序
 * @example
 * const index = binarySearch([1, 2, 3, 4, 5], 3);
 * console.log(index); // 2
 */
function binarySearch(array, target, compareFn) {
  // 实现...
}
