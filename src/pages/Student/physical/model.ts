import {preliList, addStudentBasicInfo, savePhysicalInfoApi} from "@/api/student"
import {message} from "antd"

/**
 * 考生签名管理
 */
const NAMESPACE = "physical"
export const STATE = {
  idInfo: {}, // 身份证信息
  unSigned: {}, // 未签名成绩单
  isShowResignContent: true, // 默认显示读身份证页面
  isShowScoreReport: false, // 默认显示读身份证页面
  isShowWriting: false, // 是否显示手动输入弹框
  scoreReport: {},// 成绩单数据
  preliList: [],
  searchphysicalForm: {
    pageNum: 1,
    pageSize: 10,
  },
}
export default {
  namespace: NAMESPACE,
  state: STATE,
  effects: {
    * loadPreliList({payload}, {select, call, put}) {
      const state = yield select(state => state.physical)
      const res = yield call(preliList, state.searchphysicalForm)
      if (res.code === 0) {
        const {list, pagination} = res.data
        yield put({
          type: 'save', payload: {
            preliList: list,
            searchphysicalForm: {...state.searchphysicalForm, ...pagination},
          },
        })
      } else {
        message.warn(res.msg)
      }
    },

    // 体检信息录入 保存学员基本信息
    * addStudentBasicInfo({payload}, {select, call, put}) {
      const state = yield select(state => state.physical)
      const res = yield call(addStudentBasicInfo, payload)
      if (res?.code === 0) {
        const {list, pagination} = res.data
        yield put({
          type: 'save',
          payload: {
            preliList: list,
            searchphysicalForm: {...state.searchphysicalForm, ...pagination},
          },
        })
        return res
      } else {
        message.warn(res.msg)
      }
    },

    // 保存体检信息
    * savePhysicalInfo({payload}, {select, call, put}) {
      // const state = yield select(state => state.physical)
      const res = yield call(savePhysicalInfoApi, payload)
      return res
    },

  },
  reducers: {
    save(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}
