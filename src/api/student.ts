import request from '@/utils/request'

// 考生预录入
export function saveAndNextApi(data = {}) {
  return request.postJson<any>(`/stu/signup`, data)
}

//学员体检预录入列表
export function medicalList(data = {}) {
  return request.postJson<any>(`/stu/health/list`, data)
}
// 体检信息详情
export function getstudent(data = {}) {
  return request.postJson<any>(`/stu/health/info`, data)
}
//学员报名预录入体检列表
export function preliList(data = {}) {
  return request.postJson<any>(`/stu/signup/list`, data)
}

//体检信息列表手动同步
export function Manualsync(data = {}) {
  return request.postJson<any>(`/stu/signup/syn/health/again`, data)
}

// 报名信息列表详情
export function getprelInfo(data = {}) {
  return request.postJson<any>(`/stu/signup/info`, data)
}

// 报名信息列表
export function getanquanyuanList(data = {}) {
  return request.postJson<any>(`/stu/signup/info`, data)
}

//体检采集
export function preliLista(data = {}) {
  return request.postJson<any>(`/stu/health`, data)
}

// 医院管理列表 重命名
export function getHospitalManagementDataListApi(data = {}) {
  return request.postJson<any>(`/hospital/pageList`, data)
}
export function thedoctorList(data = {}) {
  return request.postJson<any>(`/hospital/pageList`, data)
}

// 医院管理删除
export function deleteHospitalApi(data = {}) {
  return request.postJson<any>(`/hospital/delete`, data)
}

//医院管理 新增
export function addHospitalApi(data = {}) {
  return request.postJson<any>(`/hospital/saveOrUpdate`, data)
}

// 医院管理 修改
export function updateHospitalApi(data = {}) {
  return request.postJson<any>(`/hospital/saveOrUpdate`, data)
}

// 获取 医院管理详情
export function getHospitalDetailApi(data = {}) {
  return request.postJson<any>(`/hospital/detail`, data)
}

// 医院管理状态
export function changeStatusUser(data = {}) {
  return request.postJson<any>(`/system/user/changeStatus`, data)
}

//医生管理列表
export function doctormanagementList(data = {}) {
  return request.postJson<any>(`/hosp/doctor/list`, data)
}

//医生管理删除
export function addoctorman(data = {}) {
  return request.postJson<any>(`/hosp/doctor/deleteDoctor`, data)
}

//医生管理修改状态
export function changeStatusUsert(data = {}) {
  return request.postJson<any>(`/system/user/changeStatus`, data)
}

// 医生管理新增
export function addctorman(data = {}) {
  return request.postJson<any>(`/hosp/doctor/addDoctor`, data)
}

// 医生管理修改
export function updatectorman(data = {}) {
  return request.postJson<any>(`/hosp/doctor/updateDoctor`, data)
}

// 医院管理重置秘密
export function resetHospitalPasswordApi(data = {}) {
  return request.postJson<any>(`/system/user/resetPwd`, data)
}

// 医生详情回显
export function roleMenuTreeselect(data = {}) {
  return request.postJson<any>(`/system/menu/roleMenuTreeselect`, data)
}

// 体检预录入 保存学员基本信息
export function addStudentBasicInfo(data = {}) {
  return request.postJson<any>(`/stu/signup/studentInfo`, data)
}

// 保存体检信息 savePhysicalInfoApi
export function savePhysicalInfoApi(data = {}) {
  return request.postJson<any>(`/stu/health`, data)
}

// 获取体检单预览图
export function getExamineePhysicalReportApi(data = {}) {
  return request.postJson<any>(`/stu/health/preview`, data)
}

// 体检单签字
export function savePhysicalSigningApi(data = {}) {
  return request.postJson<any>(`/stu/health/sign`, data)
}

// 考生预录入 报名信息采集
// 获取识别身份证信息
export function getIDCardInfoByUrlApi(data = {}) {
  return request.postJson<any>(`/stu/ocr/idcard`, data)
}

// 获取
export function getRegistrationInfoApi(data = {}) {
  return request.postJson<any>(`/stu/signup/get`, data)
}

// 预录入基础信息接口
export function saveRegistrationApi(data = {}) {
  return request.postJson<any>(`/stu/signup/studentInfo`, data)
}

// 验证六合一是否有证件照接口
export function getPhotoApi(data = {}) {
  return request.postJson<any>(`/stu/getPhoto`, data)
}

// 保存用户证件照接口
export function uploadPhotoApi(data) {
  return request.postJson<any>(`/stu/uploadPhoto`, data)
}

// 驾校保存学员体检信息接口
export function saveHealthExaminationApi(data = {}) {
  return request.postJson<any>(`/stu/signup/health`, data)
}

// 保存报名附加信息接口
export function saveVehicleLicenseApplyApi(data = {}) {
  return request.postJson<any>(`/stu/signup/dirver`, data)
}

//开通 医生账号
export function createDoctorAccountApi(data = {}) {
  return request.postJson<any>(`/hospital/create/doctor/account`, data)
}

//医院下拉
export function getExaminerSelectApi(data = {}) {
  return request.postJson<any>(`/api/combobox/hospital`, data)
}
