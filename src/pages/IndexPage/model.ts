/**
 * @author: Gene
 * @age: 永远18岁的美少年
 * @Email： yangjianyun@58.com
 * @date: 2021-09-26 13:47:40
 * @description: 首页数据model
 */

import { loadSysIndexDataApi, loadLoginLogDataApi } from "@/api/sysIndex"
import { message } from "antd"

export default {
  namespace: "sysIndex",
  state: {
    titleCard: {}, // 第一行看板数据
    examinessCountHistogram: [], // 考生统计柱状图
    pieChartData: {}, // 考生年龄分布一行饼图数据
    last30Examinees: [], // 近30 日考试人数
    subjectAndRanking: {}, // 各科目考试人数 和 驾校排行榜
    abnormalData: {}, // 电子档案数和异常数据
    loginLogData: {},
  },
  effects: {
    // 首页数据接口
    * loadSysIndexData({payload}, {select, call, put}) {
      const state = yield select(state => state.sysIndex)
      const res = yield call(loadSysIndexDataApi)
      if (res?.code === 0) {
        yield put({
          type: "save",
          payload: {
            titleCard: {
              schAmount: res?.data?.schAmount, // 驾校总数
              schoolStuNumberLeaderboard: res?.data?.schoolStuNumberLeaderboard, //驾校学员数排行榜 []
              examinationRoomAmount: res?.data?.examinationRoomAmount, //考场总数
              testedTimes: res?.data?.testedTimes, //已考场次
              testedStuNumber: res?.data?.testedStuNumber, //已考人数
              stuAmount: res?.data?.stuAmount || 0, //考生总数
              monthlyStatistics: res?.data?.monthlyStatistics, // 月度统计数据
              stuPassRate: res?.data?.stuPassRate || "", // 考生通过率
              averageLicensingPeriod: res?.data?.averageLicensingPeriod || 0, // 平均领证周期
            },
            examinessCountHistogram: [
              ...res?.data?.monthlyStatistics, // 月度统计数据
            ],
            pieChartData: {
              ageStatistics: res?.data?.ageStatistics,
              sexStatistics: res?.data?.sexStatistics,
              perdritypeStatistics: res?.data?.perdritypeStatistics,
              businessTypeStatistics: res?.data?.businessTypeStatistics,
              arrearsStatistics: res?.data?.arrearsStatistics,
            },
            last30Examinees: [
              ...res?.data?.monthlyExamStudentNumber,
            ],
            subjectAndRanking: {
              examSubjectStudentNumber: res?.data?.examSubjectStudentNumber,
              schoolPassRateLeaderboard: res?.data?.schoolPassRateLeaderboard,
            },
            abnormalData: {
              archivesStatistics: res?.data?.archivesStatistics, // 档案统计数
            },
          },
        })
      } else {
        message.warn(res.msg)
      }
    },

    * loadLoginLogData({payload}, {select, call, put}) {
      const state = yield select(state => state.sysIndex)
      const res = yield call(loadLoginLogDataApi, {...payload})
      if (res?.code === 0) {
        yield put({
          type: "save",
          payload: {
            loginLogData: {
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
