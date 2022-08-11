import {message} from 'antd'
import {loadExamResultListApi} from "@/api/examine";

export const STATE = {
  signSearchForm: {
    pageNum: 1,
    pageSize: 10,
  },
  signList: [],
}

export default {
  namespace: 'sign',
  state: {...STATE},
  effects: {
    // 获取设备列表信息
    * loadSignList({payload}, {select, call, put}) {
      const state = yield select(state => state.sign)
      const res = yield call(loadExamResultListApi, {...state.signSearchForm})
      if (res.code === 0) {
        yield put({
          type: 'save',
          payload: {
            signList: res.data.list,
            signSearchForm: {...state.signSearchForm, ...res.data.pagination}
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
