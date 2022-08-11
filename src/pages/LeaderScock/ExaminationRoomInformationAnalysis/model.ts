import { loadExamSiteBasicDataApi, loadLeaderboardInfoApi, loadExamSiteAdvancedApi } from '@/api/leaderscock'
import { message } from 'antd'
export default {
  namespace: "examinationRoomInformationAnalysis",
  state: {
    examSiteBasicData: [],// 考场基础数据
    leaderboardInfoData: {}, // 考场排名数据
    examSiteAdvancedData: {}, // 考试人数数据
  },
  effects: {
    * loadExamSiteBasicData({payload}, {select, call, put}) {
      let res
      try {
        res = yield call(loadExamSiteBasicDataApi, {...payload})
      } catch (error) {
        // message.warn('服务开小差了')
      }
      if (res?.code === 0) {
        yield put({
          type: "save",
          payload: {
            examSiteBasicData: [
              ...res.data,
            ],
          },
        })
      } else {
        message.error('服务开小差了')
      }
    },
    * loadLeaderboardInfoData({payload}, {select, call, put}) {
      const res = yield call(loadLeaderboardInfoApi, {...payload})
      if (res?.code === 0) {
        const payload = {
          leaderboardInfoData:{
            ...res?.data
          },
          // ...res?.data
        }
        yield put({
          type: "save",
          payload,
        })
        return payload
      } else {
        message.warn(res.msg)
      }
      // console.log(res, 'uuuuuuu')
      // if (res?.code === 0) {
      //   yield put({
      //     type: "save",
      //     payload: {
      //       leaderboardInfoData: {
      //         ...res.data,
      //       },
      //     },
      //   })
      // } else {
      //   message.warn(res.msg)
      // }
    },
    * loadExamSiteAdvancedData({payload}, {select, call, put}) {
      const res = yield call(loadExamSiteAdvancedApi, {...payload})
      if (res?.code === 0) {
        yield put({
          type: "save",
          payload: {
            examSiteAdvancedData: {
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
