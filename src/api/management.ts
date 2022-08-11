import request from '@/utils/request'

// 欠费信息查询列表
export function checktheList(data = {}) {
    return request.postJson<any>(`/fin/sch/arrears/pageList`, data)
}
// 学员欠费列表
export function stuChecktheList(data = {}) {
  return request.postJson<any>(`/fin/stu/arrears/pageList`, data )
}
// 导出欠费名单
export function downloadChecktheList(data = {}, prefix = '.zip') {
  return request.downloadZip<any>(`/fin/sch/arrears/export/release`, data, '', prefix)
}

//考前核验记录列表
export function lackofinforList(data = {}) {
    return request.postJson<any>(`/stu/fin/check/pageList`, data)
}

//电子档案补录管理列表
export function recordingList(data = {}) {
    return request.postJson<any>(`/system/recording/list`, data)
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
