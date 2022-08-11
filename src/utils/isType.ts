/**
 * @author: Gene
 * @age: 永远18岁的美少年
 * @Email： yangjianyun@58.com
 * @date: 2021-09-13 13:36:03
 * @description: 数据类型判断
 */
// 空字符串
const isUndefined = (val: any): boolean => typeof val === 'undefined'

// 判断图片是否存在
const isEmpty = (val: any): boolean => {
  //  val === "-"  这段判断是 刨坑 埋坑儿, 解决别人修改代码导致方法出现bug而添加的逻辑判断
  return isUndefined(val) || val === '' || Object.prototype.toString.call(val) === '[object Null]' || val === '-'
}

// 判断是否是 simple object
const isObject = (val: any) => {
  return Object.prototype.toString.call(val) === '[object Object]'
}

export { isUndefined, isEmpty, isObject }
