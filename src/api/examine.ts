/**
 * @author: Gene
 * @age: 永远18岁的美少年
 * @Email： yangjianyun@58.com
 * @date: 2021-09-04 18:43:26
 * @description: 考生签名管理
 */
import request from "@/utils/request"

/** =========== 考生签名管理 ===========  */
// 考生签名看板列表
export function loadSignCardListApi(data = {}) {
  return request.postJson<any>(`/stu/transcript/sign/exam/layout/list`, data)
}

// 考生签名统计列表 title描述
export function loadTitleDescApi(data = {}) {
  return request.postJson<any>(`/stu/transcript/sign/exam/info`, data)
}

// 考生签名统计 列表
export function loadSignCountListApi(data = {}) {
  return request.postJson<any>(`/stu/transcript/sign/exam/info/students`, data)
}

// 根据 id 获取成绩单
export function loadScoreReportByIdApi(data = {}) {
  return request.postJson<any>(`/stu/transcript/sign/transcript/info`, data)
}

// 根据身份证号 获取成绩单
export function loadScoreAgainByIDCardApi(data = {}) {
  return request.postJson<any>(`/stu/transcript/sign/unsign/transcript/info`, data)
}

/** =========== 考生补签 ============= */

// 验证是否还有未签名成绩单
export function hasUnsignScoreApi(data = {}) {
  return request.postJson<any>(`/stu/transcript/sign/unsign/transcript/count`, data)
}

// 根据身份证号获取一张未签名成绩单
export function loadUnsignScoreReportApi(data = {}) { // /stu/transcript/sign/unsign/transcript/info
  return request.postJson<any>(`/stu/transcript/sign/unsign/transcript/info`, data)
}

// 确认签字
export function finishedSignApi(data = {}) {
  return request.postJson<any>(`/stu/transcript/sign/sign`, data)
}


export function preliList(data = {}) {
  return request.postJson<any>(`/stu/transcript/sign/sign`, data)
}

// 考生成绩单列表
export function loadExamResultListApi(data = {}) {
  return request.postJson<any>(`/stu/transcript/sign/examResultList`, data)
}

// 成绩单打印记录
export function recordPrintCountApi(data = {}) {
  return request.postJson<any>(`/stu/transcript/sign/exam/result/point/count`, data)
}

