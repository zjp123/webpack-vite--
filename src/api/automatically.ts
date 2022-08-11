import request from '@/utils/request'

/**
 * 获取获取考场人像比对结果监控列表
 * @param data
 */

// 考生分配列表/考神核验列表
export function getListDataApi(data = {}) {
  return request.postJson<Result.ListResult>(`/exam/assign/pageList`, data)
}

// todo 后期注释掉
export function sheetList(data = {}) {
  return request.postJson<Result.ListResult>(`/exam/assign/pageList`, data)
}

//考生核验右边部分
export function theexamineeList(data = {}) {
  return request.postJson<Result.ListResult>(`/school/info/list`, data)
}

//安全员核验列表
export function safetyofficerList(data = {}) {
  return request.postJson<Result.ListResult>(`/exam/assign/pageList`, data)
}

//安全员核验列表
export function safAssignScrollList(data = {}) {
  return request.postJson<Result.ListResult>(`/exam/assign/safAssignScrollList`, data)
}

// 考生核验保存
export function saveExamineeCheckApi(data = {}) {
  return request.postJson<Result.ListResult>(`/exam/assign/auto`, data)
}

// todo 后期注释
export function getExamoSave(data = {}) {
  return request.postJson<Result.ListResult>(`/exam/assign/auto`, data)
}

//安全员核验列表
export function verificaList(data = {}) {
  return request.postJson<Result.ListResult>(`/exam/assign/safAssignList`, data)
}

//安全员核验滚动列表
export function getsafeyofficerList(data = {}) {
  return request.postJson<Result.ListResult>(`/exam/assign/safAssignScrollList`, data)
}

// 安全员自动分配
export function assignment(data = {}) {
  return request.postJson<Result.ListResult>(`/exam/assign/auto`, data)
}

// 安全员手动分车列表
export function getSafManualAssignmentList(data = {}) {
  return request.postJson<Result.ListResult>(`/exam/assign/safManualAssignmentList`, data)
}

// 安全员手动分配考车提交/保存草稿
export function postSafManualAssignment(data = {}) {
  return request.postJson<Result.ListResult>(`/exam/assign/safManualAssignment`, data)
}

// 获取可分配考车的考试计划
export function getPlanList(data = {}) {
  return request.postJson<Result.ListResult>(`/exam/assign/allocatableExamInfo`, data)
}

// 获取可分配的考车
export function getCarList(data = {}) {
  return request.postJson<Result.ListResult>(`/exam/assign/allocatableCarInfoList`, data)
}

// 获取可分配的安全员
export function getSafeList(data = {}) {
  return request.postJson<Result.ListResult>(`/exam/assign/allocatableSafInfoList`, data)
}

// 获取安全员手动分车草稿
export function getSafManualAssignmentDraft(data = {}) {
  return request.postJson<Result.ListResult>(`/exam/assign/safManualAssignmentDraft`, data)
}

// 清除安全员手动分车草稿
export function clearSafManualAssignmentDraft(data = {}) {
  return request.postJson<Result.ListResult>(`/exam/assign/clearSafManualAssignmentDraft`, data)
}

// 安全员手动分车——更换考车
export function changeSafExamCarApi(data = {}) {
  return request.postJson<Result.ListResult>(`/exam/assign/changeSafExamCar`, data)
}
