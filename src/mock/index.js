/**
 * @author: Gene
 * @age: 永远18岁的美少年
 * @Email： yangjianyun@58.com
 * @date: 2021-11-30 13:46:36
 * @description: 添加 mockjs ajax 请求拦截
 */
import Mock from "mockjs"

// 领导驾舱 数据
export const mockData = Mock.mock({
  "data": {
    "code": 0,
    "msg": "请求成功", 
    "list|1-10": [{
      "id|+1": 0, // 初始值是0 自增1
      "goodsName": "@ctitle(3,5)", // 官网 这个名字是 3-5之间
      "goodsPrice|+1": 100,
      "address": "@county(true)", //
      "telNum": /^1(3|5|7|8|9)\d{9}$/, //正则写的电话后面1开头，
      "goodsImg": "@image('200x100','#894FC4','FFF','alley')", //生成图片
      "date": "@date('yyyy-MM-dd HH:mm:ss')", // 时间
      "email": "@email()", // 邮箱
      'ss': ''
    }]
  }
})

export {}
