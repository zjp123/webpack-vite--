import request from '@/utils/request'

// 考生数据分析
export function loadExamineeDataApi(data = {}) {
  return request.postJson<Result.ListResult>(`/commandCenter/stuDataAnalysis`, data)
}

/**  ========= 考试数据分析 ========*/
// 考试信息分析 a.顶部对比数据
export function loadTopCompareDataApi(data = {}) {
  return request.postJson<any>(`/exam/statistical/compared`, data)
}
// 考试信息分析 b.各车型数据
export function loadMiddleVehicleDataApi(data = {}) {
  return request.postJson<any>(`/exam/statistical/histogram`, data)
}
// 考试信息分析 c.底部排行榜数据
export function loadBottomRankingDataApi(data = {}) {
  return request.postJson<any>(`/exam/statistical/ranking`, data)
}

// 首页登录日志信息
export function loadLoginLogDataApi(data = {}) {
  return request.postJson<any>(`/index/userLoginInformation`, data)
}

// 考场数据分析—考场基础数据
export function loadExamSiteBasicDataApi(data = {}) {
  return request.postJson<any>(`/commandCenter/examSiteBasicData`, data)
}

// 考场排名接口
export function loadLeaderboardInfoApi(data = {}) {
  return request.postJson<any>(`/leaderboard/info`, data)
}

// 考场排名接口
export function loadExamSiteAdvancedApi(data = {}) {
  return request.postJson<any>(`/commandCenter/examSiteAdvancedData`, data)
}

// 驾校总体数据分析
export function loadSchoolDataAnalysisApi(data = {}) {
  return request.postJson<any>(`/schoolDataAnalysis/overall`, data)
}

// 驾校数据分析-具体分析（顶部）
export function loadSchoolDataAnalysisDetailTopApi(data = {}) {
  return request.postJson<any>(`/schoolDataAnalysis/detailTop`, data)
}

// 驾校数据分析-具体分析（中部）
export function loadSchoolDataAnalysisDetailMiddleApi(data = {}) {
  return request.postJson<any>(`/schoolDataAnalysis/detailMiddle`, data)
}

// 驾校数据分析-具体分析（底部）
export function loadSchoolDataAnalysisDetailBottomApi(data = {}) {
  return request.postJson<any>(`/schoolDataAnalysis/detailBottom`, data)
}
