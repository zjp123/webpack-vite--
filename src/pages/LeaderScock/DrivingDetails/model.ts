import {
  loadExamSiteBasicDataApi,
  loadLeaderboardInfoApi,
  loadExamSiteAdvancedApi,
  loadSchoolDataAnalysisDetailTopApi,
  loadSchoolDataAnalysisDetailMiddleApi,
  loadSchoolDataAnalysisDetailBottomApi,
  loadTopCompareDataApi , loadBottomRankingDataApi
} from '@/api/leaderscock'
import { message } from 'antd'
export default {
  namespace: "drivingDetails",
  state: {
    area:"", // 地区
    contrast:{}, // 顶部对比数据
    arrears:{}, // 欠费情况
    detailTop: {}, // 顶部数据
    detailBottom: {}, //底部数据
  },
  effects: {
    * loadTopCompareData({payload}, {select, call, put}) {
      const res = yield call(loadTopCompareDataApi, {...payload})
      if (res?.code === 0) {
        const payload = {
          area:res?.data?.area,
          contrast:res?.data?.contrast
        }
        yield put({
          type: "save",
          payload,
        })
        return payload
      } else {
        message.warn(res.msg)
      }
    },
    // 各车型各科目预约人数 考试情况分析

    * loadBottomRankingData({payload}, {select, call, put}) {
      const res = yield call(loadBottomRankingDataApi, {...payload})
      if (res?.code === 0) {
        const payload = {
          arrears:{
            ...res?.data?.arrears
          },
          ...res?.data
        }
        yield put({
          type: "save",
          payload,
        })
        return payload
      } else {
        message.warn(res.msg)
      }
    },
    // 驾校整体数据分析(顶部)
    * loadSchoolDataAnalysisDetailTop({payload}, {select, call, put}) {
      const state = yield select(state => state.sysIndex)
      const res = yield call(loadSchoolDataAnalysisDetailTopApi, {...payload})
      if (res?.code === 0) {
        yield put({
          type: "save",
          payload: {
            detailTop: {
              ...res.data,
            },
          },
        })
      } else {
        message.warn(res.msg)
      }
    },
    // 驾校整体数据分析(中部)
    * loadSchoolDataAnalysisMiddleTop({payload}, {select, call, put}) {
      const res = yield call(loadSchoolDataAnalysisDetailMiddleApi, {...payload})
      if (res?.code === 0) {
        console.log(res)
        const payload = {
          ...res?.data,
          subject:{
            ...res?.data?.subject,
            legendData:getVehicleLegendData(res?.data?.subject?.series)
          },
          exam:{
            ...res?.data?.exam,
            legendData:getVehicleLegendData(res?.data?.exam?.series)
          },
        }
        yield put({
          type: "save",
          payload
        })
        return payload
      } else {
        message.warn(res.msg)
      }
    },
    // 驾校整体数据分析(低部)
    * loadSchoolDataAnalysisBottomTop({payload}, {select, call, put}) {
      const state = yield select(state => state.sysIndex)
      const res = yield call(loadSchoolDataAnalysisDetailBottomApi, {...payload})
      if (res?.code === 0) {
        yield put({
          type: "save",
          payload: {
            detailBottom: {
              ...res.data,
            },
          },
        })
      } else {
        message.warn(res.msg)
      }
    },
  },
  reducers: {
    save(state, {payload}) {
      return {...state, ...payload}
    },
  },
}

// 获取各车型 legend 类别
const getVehicleLegendData = (series)=>{
  let legendData=[]
  series?.forEach((item)=>{
    legendData.push(item?.name)
  })
  return legendData
}
