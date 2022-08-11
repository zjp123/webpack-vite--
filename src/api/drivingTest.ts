import request from '@/utils/request'

/**
 * 获取获取考场人像比对结果监控列表
 * @param data
 */
//驾校信息列表管理接口
export function schoolInfoList(data = {}) {
  return request.postJson<Result.ListResult>(`/school/info/list`, data)
}
// 预录入配置详情
export function schoolConfigInfo(data = {}) {
  return request.postJson<Result.ListResult>(`/school/info/signup/config/info`, data)
}
//保存驾校预录入配置
export function saveSchoolConfig(data = {}) {
  return request.postJson<Result.ListResult>(`/school/info/signup/config`, data)
}
//更新预录入配置状态
export function updateSchoolConfigStatus(data = {}) {
  return request.postJson<Result.ListResult>(`/school/info/signup/config/status`, data)
}
// 驾校列表-导出
export function schoolListExport(data = {}) {
  return request.postJson<Result.ListResult>(`/school/info/export`, data)
}

//驾校同步六合一

export function synchronous(data = {}) {
  return request.postJson<Result.ListResult>(`/school/info/syn`, data)
}
//驾校信息详情
export function getdrvingIofo(data = {}) {
  return request.postJson<Result.ListResult>(`/school/info/info`, data)
}
//x
export function updathedoctor(data = {}) {
  return request.postJson<Result.ListResult>(`/exam/site/info/update`, data)
}

//教练车信息列表管理接口
export function coachCarList(data = {}) {
  return request.postJson<Result.ListResult>(`/school/car/info/list`, data)
}
//考场信息列表管理接口
export function examinationList(data = {}) {
  return request.postJson<Result.ListResult>(`/exam/site/info/list`, data)
}

//考场信息修改
export function getInfoCardDataApi(data = {}) {
  return request.postJson<Result.ListResult>(`/exam/site/info/info`, data)
}
// 考场排期列表
export function getExaminationPlanListDataApi(data = {}) {
  return request.postJson<Result.ListResult>(`/exam/plan/exam/site/list`, data)
}

// 考生名单列表
export function getStudentListDataApi(data = {}) {
  return request.postJson<Result.ListResult>(`/exam/preasign/info/examplan/preasign/list`, data)
}

// 考场考试计划 - 导出
export function downloadAllStudentListApi(data = {}) {
  return request.postJson<Result.ListResult>(`/exam/preasign/info/examplan/preasign/list/export`, data)
}

// 新增考场详情接口
export function addExaminationRoomApi() {
  return {}
}

// 修改考场详情接口
export function editExaminationRoomApi(data = {}) {
  return request.postJson<any>(`/exam/site/info/update`, data)
}
//考官信息管理列表接口
export function examinerInformationListApi(data = {}) {
  return request.postJson<Result.ListResult>(`/invigilator/info/list`, data)
}
// 考官排期列表
export function getExaminerListDataApi(data = {}) {
  return request.postJson<Result.ListResult>(`/exam/plan/examiner/list`, data)
}
// 安全员新增接口
export function addSafetyo(data = {}) {
  return request.postJson<Result.ListResult>(`/sch/safetyOfficer/addSafetyOfficer`, data)
}
// 安全员修改接口
export function updateSafetyo(data = {}) {
  return request.postJson<Result.ListResult>(`/sch/safetyOfficer/updateSafetyOfficer`, data)
}
//安全员查询信息
export function getSafetyoInfo(data = {}) {
  return request.postJson<Result.ListResult>(`/sch/safetyOfficer/detail`, data)
}
// 安全员删除接口
export function deleteSafetyo(data = {}) {
  return request.postJson<Result.ListResult>(`/sch/safetyOfficer/deleteSafetyOfficer`, data)
}
// 安全员管理列表接口
export function safetyoFficerinList(data = {}) {
  return request.postJson<Result.ListResult>(`/sch/safetyOfficer/list`, data)
}
//驾校管理增加
export function addDrivingSchool(data = {}) {
  return request.postJson<Result.ListResult>(`/school/info`, data)
}

//驾校管理修改
export function updateDrivingSchool(data = {}) {
  return request.postJson<Result.ListResult>(`/school/info/update`, data)
}
// 删除接口
export function deleteGuan(data = {}) {
  return request.postJson<Result.ListResult>(`/school/info/delete`, data)
}
//教练车管理同步接口
export function sync(data = {}) {
  return request.postJson<any>(`/school/car/syn`, data)
}
//教练车管理详情接口
export function getDrivInfo(data = {}) {
  return request.postJson<Result.ListResult>(`/school/info/info`, data)
}
//教练车详情接口
export function SouYList(data = {}) {
  return request.postJson<any>(`/school/car/info/info`, data)
}

//考官详情接口
export function getExaminerInfoCardDataApi(data = {}) {
  return request.postJson<any>(`/invigilator/info/info`, data)
}

//安全员信息接口详情
export function getOfficer(data = {}) {
  return request.postJson<any>(`/sch/safetyOfficer/3`, data)
}
// 安全员详情列表
export function getanquanyuanList(data = {}) {
  return request.postJson<any>(`/sch/safetyOfficer/invigilationRecordList`, data)
}

// 驾校回显

export function roleMenuTreeselect(data = {}) {
  return request.postJson<any>(`/system/menu/roleMenuTreeselect`, data)
}
// 修改考官信息
export function addOrUpdateExaminerApi(data = {}) {
  return request.postJson<any>(`/invigilator/info/sys/upsert`, data)
}

// 车辆信息列表
export function examSiteList(data = {}) {
  return request.postJson<Result.ListResult>(`/examSite/car/info/list`, data)
}

// 车辆信息新增
export function addExamCar(data = {}) {
  return request.postJson<Result.ListResult>(`/examSite/car/info/addExamCar`, data)
}

// 车辆信息修改
export function updateExamCar(data = {}) {
  return request.postJson<Result.ListResult>(`/examSite/car/info/updateExamCar`, data)
}

// 车辆信息删除
export function deleteExamCar(data = {}) {
  return request.postJson<Result.ListResult>(`/examSite/car/info/deleteExamCar`, data)
}

// 车辆信息详情
export function getExamCarInfo(data = {}) {
  return request.postJson<Result.ListResult>(`/examSite/car/info/getExamCarInfo`, data)
}

// 电子签名信息列表
export function loadESignListApi(data = {}) {
  return request.postJson<Result.ListResult>(`/eSign/eSignList`, data)
}

// 新增电子签名
export function insertESignApi(data = {}) {
  return request.postJson<any>(`/eSign/insertESign`, data)
}

// 更新电子签名
export function updateESignApi(data = {}) {
  return request.postJson<any>(`/eSign/updateESign`, data)
}

// 电子签名详情
export function detailESignApi(data = {}) {
  return request.postJson<any>(`/eSign/detail`, data)
}

// 删除电子签名
export function deleteESignApi(data = {}) {
  return request.postJson<any>(`/eSign/deleteESign`, data)
}

// 启用禁用电子签名状态
export function updateESignStatusApi(data = {}) {
  return request.postJson<any>(`/eSign/updateESignStatus`, data)
}
