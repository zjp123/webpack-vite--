import request from '@/utils/request'
import BASE_URL from '@/utils/base'
import axios from 'axios'
import { getCookie } from '@/utils/auth'

//电子档案信息管理列表
export function informationList(data = {}) {
  return request.postJson<any>(`/archives/list`, data)
}

//电子档案考生信息详情
export function getInformationInfo(data = {}) {
  return request.postJson<any>(`/archives/getInfo/personInfo`, data)
}

//电子档案学员流水基本信息
export function getStudentInfoApi(data = {}) {
  return request.postJson<any>(`/archives/getInfo/studentInfo`, data)
}

//电子档案考生信息详情
export function updateInformationInfo(data = {}) {
  return request.postJson<any>(`/archives/updatePersonInfo`, data)
}

// 考生流水业务阶段列表
export function getStageList(data = {}) {
  return request.postJson<any>(`/archives/getInfo/stageInfo`, data)
}

//电子档案学员流水列表
export function getFlowList(data = {}) {
  return request.postJson<any>(`/archives/flowList`, data)
}

//电子档案档案清单列表
export function electronicList(data = {}) {
  return request.postJson<any>(`/archives/getInfo/archivesInfoList`, data)
}

//电子档案详情预约信息列表
export function appoiNtmentList(data = {}) {
  return request.postJson<any>(`/archives/getInfo/reserveInfo`, data)
}

//电子档案详情人像对比信息列表
export function compAredList(data = {}) {
  return request.postJson<any>(`/face/compare/pageList`, data)
}

//电子档案详情欠费信息列表
export function lackFormationList(data = {}) {
  return request.postJson<any>(`/stu/fin/check/pageList`, data)
}

//电子档案详情业务日志列表
export function businessLogListApi(data = {}) {
  return request.postJson<any>(`/archives/getInfo/flowLogList`, data)
}

//电子档案生编辑考生信息
export function upDateformation(data = {}) {
  return request.postJson<any>(`/archives/updateStudentInfo`, data)
}

//电子档案补录管理列表
export function recordingList(data = {}) {
  return request.postJson<any>(`/archives/list`, data)
}

//电子档案补录信息详情
export function getInfoCollectionInfo(data = {}) {
  return request.postJson<any>(`/archives/getInfo/studentInfo`, data)
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
  return request.postJson<any>(`/spot/check/list`, data)
}

//电子档案抽查管理增、加
export function addCheck(data = {}) {
  return request.postJson<any>(`/spot/check/create`, data)
}

//电子抽查档案信息详情
export function getSpotCheckInfo(data = {}) {
  return request.postJson<any>(`/system/spotCheck`, data)
}

//电子档案抽查-任务详情列表
export function checkStudentList(data = {}) {
  return request.postJson<any>(`/spot/check/student/list`, data)
}

//电子档案抽查-已读档案信息
export function getCheckRead(data = {}) {
  return request.postJson<any>(`/spot/check/read`, data)
}

//电子档案抽查-抽查任务内某个学员审查完成
export function getStudentSuccess(data = {}) {
  return request.postJson<any>(`/spot/check/student/success`, data)
}

//电子档案心情-任务内某个学员档案标记异常
export function getStudentError(data = {}) {
  return request.postJson<any>(`/spot/check/student/error`, data)
}

//电子档案抽查详情基本信息
export function getBasicInfo(data = {}) {
  return request.postJson<any>(`/archives/getInfo/studentInfo`, data)
}

//电子档案详情-档案下载
export function getdownload(data = {}) {
  return request.postJson<any>(`/file/download`, data)
}

//电子档案补录
export function getArchives(data = {}) {
  return request.postJson<any>(`/archives/makeup`, data)
}

//电子档案人像对比记录详情
export function getComparisonInfo(data = {}) {
  return request.postJson<any>(`/stu/pic/collect/detai`, data)
}

//批量下载
export function batchDownload(data = {}) {
  return request.downloadZip(`/archives/batchDownload/release`, data)
}

//生成指定学员电子档案
export function generateStuArchivesApi(data = {}) {
  return request.postJson(`/stu/generateStuArchives`, data)
}

//自动受理列表
export function getAutoAcceptListApi(data = {}) {
  return request.postJson(`/auto/accept/list`, data)
}

//自动受理按钮
export function acceptingApi(data = {}) {
  return request.postJson(`/auto/accept/doAcceptJob`, data)
}

//成绩单档案URL 批量获取
export function batchLoadUrlApi(data = {}) {
  return request.postJson(`/stu/transcript/sign/exam/result/archives`, data)
}

// 考生签名删除
export function deleteTranscriptApi(data = {}) {
  return request.postJson(`/stu/transcript/sign/deleteTranscript`, data)
}

// 重新生成成绩单
export function regenerateTranscriptApi(data = {}) {
  return request.postJson(`/stu/transcript/sign/regenerateTranscript`, data)
}
