import {
  postSafManualAssignment,
  getSafManualAssignmentList,
  getPlanList,
  getCarList,
  getSafeList,
  getSafManualAssignmentDraft,
  clearSafManualAssignmentDraft,
  changeSafExamCarApi
} from '@/api/automatically'
import {message} from 'antd'
export const STATE = {
  verificaList: [],
  planList: [],
  carList: [],
  safeList: [],
  saveList: [],
  isCheckSpotCheckModalVisible: false,
  isShowChangeCarModal: false,
  safExamAssign: {},
  searchAutographForm: {
    pageNum: 1,
    pageSize: 10,
  },
}
export default {
  namespace: 'assignTestCar',
  state: {...STATE},
  effects: {
    //获取安全员手动分车列表
    * loadSafManualAssignmentList({payload}, {select, call, put}) {
      const state = yield select(state => state.assignTestCar)
      const res = yield call(getSafManualAssignmentList, state.searchAutographForm)
      if (res && res.code === 0) {
        const {list, pagination} = res.data
        yield put({
          type: 'save',
          payload: {
            verificaList: list,
            searchAutographForm: {...state.searchAutographForm, ...pagination}
          }
        })
      } else {
        message.warn(res.msg)
      }
    },
    // 获取可分配考车的考试计划
    * loadPlanList({payload}, {select, call, put}) {
      const res = yield call(getPlanList)
      if (res && res.code === 0) {
        yield put({
          type: 'save',
          payload: {
            planList: res.data,
          }
        })
      } else {
        message.warn(res.msg)
      }
    },
    // 获取可分配的考车
    * loadCarList({payload}, {select, call, put}) {
      const res = yield call(getCarList, payload)
      if (res && res.code === 0) {
        yield put({
          type: 'save',
          payload: {
            carList: res.data,
          }
        })
      } else {
        message.warn(res.msg)
      }
    },
    // 获取可分配的安全员
    * loadSafeList({payload}, {select, call, put}) {
      const res = yield call(getSafeList, payload)
      console.log(res.code)
      if (res && res.code === 0) {
        yield put({
          type: 'save',
          payload: {
            safeList: res.data,
          }
        })
      } else {
        message.warn(res.msg)
      }
    },
    // 安全员手动分配考车提交/保存草稿
    * saveSafManualAssignment({payload}, {select, call, put}) {
      const res = yield call(postSafManualAssignment, {assignQoList: payload})
      if (res && res.code === 0) {
        message.info(res.msg)
        yield put({
          type: 'loadSafManualAssignmentList'
        })
        return true
      } else {
        message.warn(res.msg)
      }
    },
    // 获取安全员手动分车草稿
    * loadSafManualAssignmentDraft({payload}, {select, call, put}) {
      const res = yield call(getSafManualAssignmentDraft)
      if (res && res.code === 0) {
        yield put({
          type: 'save',
          payload: {
            saveList: res.data,
          }
        })
      } else {
        message.warn(res.msg)
      }
    },
    // 清空安全员手动分车草稿
    * toClearSafManualAssignmentDraft({payload}, {select, call, put}) {
      const res = yield call(clearSafManualAssignmentDraft)
      if (res && res.code === 0) {
        yield put({
          type: 'save',
          payload: {
            saveList: [],
          }
        })
      } else {
        message.warn(res.msg)
      }
    },
    // 更换考车
    * changeSafExamCar({payload}, {select, call, put}) {
      const res = yield call(changeSafExamCarApi, payload)
      if (res && res.code === 0) {
        message.info(res.msg)
      } else {
        message.warn(res.msg)
      }
    },
  }
  ,
  reducers: {
    save(state, {payload}) {
      return {...state, ...payload}
    },
  },
}
