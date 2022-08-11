import { finishedSignApi, hasUnsignScoreApi, loadUnsignScoreReportApi } from "@/api/examine"
import { message } from "antd"
import { getCookie } from "@/utils/auth"

/**
 * 考生签名管理
 */
const NAMESPACE = "resign"
export const STATE = {
  unSigned: {}, // 未签名成绩单
  isShowResignContent: true, // 默认显示读身份证页面
  isShowScoreReport: false, // 默认显示读身份证页面
  isShowPlaceholderImg: false, //默认显示占位图
  isShowWriting: false, // 是否显示手动输入弹框
  scoreReport: {}, // 成绩单数据
  ipAndPort: "", // ip和端口
  isShowQZWC: false, // 是否展示签字完成
  idCard: "", // idCard
}
export default {
  namespace: NAMESPACE,
  state: STATE,
  effects: {
    // 验证是否有未签名成绩单
    * hasUnsignedReport({ payload }, { select, call, put }) {
      const state = yield select(state => state.resign)
      const res = yield call(hasUnsignScoreApi, { ...payload })
      if (res?.code === 0) {
        yield put({
          type: "save",
          payload: {
            unSigned: res.data
          }
        })
        return res.data
      } else {
        message.warn(res.msg)
      }
    },

    // 根据身份证号 获取一张未签名成绩单
    * loadUnsignScoreReport({ payload }, { select, call, put }) {
      const state = yield select(state => state.resign)
      const res = yield call(loadUnsignScoreReportApi, { ...payload })
      if (res?.code === 0) {
        yield put({
          type: "save",
          payload: {
            scoreReport: res.data
          }
        })
        return res
      } else {
        message.warn(res.msg)
      }
    },

    // 最终完成签字
    * finishedSign({ payload }, { select, call, put }) {
      const state = yield select(state => state.resign)
      const res = yield call(finishedSignApi, { ...payload })
      if (res?.code === 0) {
        return res
      } else {
        message.warn(res.msg)
      }
    }
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    }
  }
}
