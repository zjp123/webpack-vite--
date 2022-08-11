import request from "@/utils/request"

// const Mock = require("mockjs")
import Mock from "mockjs"
const { Random } = Mock
Random.first()

/** -------- 考试预约管理 -------------  */
//考官预约管理 --> 看板
export function loadScheduleCardListApi(data = {}) {
  return request.postJson<any>(`/exam/preasign/info/layout/list`, data)
}

// 考官预约管理 --> 列表
export function loadScheduleListApi(data = {}) {
  return request.postJson<any>(`/exam/preasign/info/list`, data)
}

// 考官预约列表 --> 详情
export function loadDetailsApi(data = {}) {
  return request.postJson<any>(`/exam/preasign/info/info`, data)
}

/** --- 考官日程安排 ---- */

// 新增 考官排期
export function addArrangementApi(data = {}) {
  return request.postJson<any>(`/exam/plan/add`, data)
}

// 删除 考官排期
export function deleteOrderApi(data = {}) {
  return request.postJson<Result.ListResult>(`/exam/plan/delete`, data)
}

// 删除 排期内考官
export function deleteExaminerApi(data = {}) {
  return request.postJson<Result.ListResult>(`/exam/plan/examiners/delete`, data)
}

// 编辑 考官排期回显
export function getExaminerArrangementApi(data = {}) {
  return request.postJson<any>(`/exam/plan/info`, data)
}

// 编辑 考官排期
export function updateArrangementApi(data = {}) {
  return request.postJson<any>(`/exam/plan/update`, data)
}

// 查询 考官排期列表
export function loadOrderListApi(data = {}) {
  return request.postJson<any>(`/exam/plan/list`, data)
}


// 排期内 考官列表
export function loadExaminerListApi(data) {
  return request.postJson<any>(`/exam/plan/examiners/list`, data)
}

// 编辑 - 考官回显数据
export function getEditExaminerEchoApi(data) {
  return request.postJson<any>(`/exam/plan/examiner/info`, data)
}

// 新增考官 - 考官照片
export function getExaminerPicApi(data = {}) {
  return Promise.resolve({ name: "picurl" })
}

// 新增考官信息
export function addExaminerInfoApi(data = {}) {
  return request.postJson<any>(`/exam/plan/add/examiners`, data)
}

// 编辑考官信息
export function updateExaminerInfoApi(data = {}) {
  return request.postJson<any>(`/exam/plan/examiner/update`, data)
}

// // 查询考官 详情
// export function getExaminerDetailApi(data = {}) {
//   return request.postJson<any>(`/exam/plan/examiner/info`, data)
// }

// 编辑 - 保存
export function setCuOrderModal(data = {}) {
  return request.postJson<any>(`/exam/plasd111222n/list`, data)
}

/** ======= 考官日程安排 ============= */

//考官日程详情
export function getOrderInfo(data = {}) {
  return request.postJson<any>(`/system/information`, data)
}

//电子档案补录管理列表
export function recordingList(data = {}) {
  return request.postJson<any>(`/system/recording/list`, data)
}

/** ======= 考官签名管理 =======*/
// 考官签名列表
export function loadautographListApi(data) {
  return request.postJson<any>(`/examiner/sign/list`, data)
}


//电子档案补录详情
export function getRecordingInfo(data = {}) {
  return request.postJson<any>(`/system/recording`, data)
}

//电子档案完整性管理列表
export function integrityList(data = {}) {
  return request.postJson<any>(`/system/integrity/list`, data)
}

//电子档案完整性详情
export function getIntegrityInfo(data = {}) {
  return request.postJson<any>(`/system/integrity`, data)
}

//电子抽查档案信息管理列表
export function spotCheckList(data = {}) {
  return request.postJson<any>(`/system/spotCheck/list`, data)
}

//电子抽查档案信息详情
export function getSpotCheckInfo(data = {}) {
  return request.postJson<any>(`/system/spotCheck`, data)
}

/** 考试管理 */

// 考试管理列表
export function loadManageListApi(data = {}) {
  return request.postJson<any>(`/exam/plan/examiner/work/list`, data)
}

// 人脸拍照 比对照片
export function checkFaceApi(data = {}) {
  return request.postJson<any>(`/examiner/sign/compared`, data)
}

// 输入密码, 比对密码
export function checkPwdApi(data = {}) {
  return request.postJson<any>(`/examiner/sign/check/passwd`, data)
}

// 确认签字保存
export function saveSignedApi(data = {}) {
  return request.postJson<any>(`/examiner/sign/sign`, data)
}

// 开启或关闭考试
export function startOrCloseExaminationApi(data = {}) {
  return request.postJson<any>(`/exam/plan/update/exam/status`, data)
}
