import request from '@/utils/request'


//人像采集列表接口
export function collectionList(data = {}) {
    return request.postJson<Result.ListResult>(`/stu/pic/collect/pageList`, data)
}
//人像采集详情接口
export function getCollectionInfo(data = {}) {
    return request.postJson<Result.ListResult>(`/stu/pic/collect/detail`, data)
}

//人像对比记录列表接口
export function comparisonList(data = {}) {
    return request.postJson<Result.ListResult>(`/face/compare/pageList`, data)
}
//人像对比记录变更状态接口
export function details(data = {}) {
    return request.postJson<Result.ListResult>(`/face/compare/detail`, data)
}
//人像对比记录详情接口
export function getComparisonInfo(data = {}) {
    return request.postJson<Result.ListResult>(`/stu/pic/collect/detail`, data)
}
//人像对比记录通过，不同过接口
export function through(data = {}) {
    return request.postJson<Result.ListResult>(`/face/compare/manual/update`, data)
}
//限制人员信息记录列表接口
export function limitRecordList(data = {}) {
    return request.postJson<Result.ListResult>(`/stu/limit/pageList`, data)
}
//限制人员信息变更状态接口
export function change(data = {}) {
    return request.postJson<Result.ListResult>(`/stu/limit/update/dealStatus`, data)
}
