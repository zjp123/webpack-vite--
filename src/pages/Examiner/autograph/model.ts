import {loadautographListApi} from '@/api/examiner'
import {message} from 'antd'

export const STATE = {
  autographList: [],
  isCheckSpotCheckModalVisible: false,
  searchAutographForm: {
    pageNum: 1,
    pageSize: 10,
  },
}
export default {
  namespace: 'autograph',
  state: STATE,
  effects: {
    //获取签名列表
    * loadautographList({payload}, {select, call, put}) {
      const state = yield select(state => state.autograph)
      const res = yield call(loadautographListApi, state.searchAutographForm)
      if (res && res.code === 0) {
        const {list, pagination} = res.data
        yield put({
          type: 'save',
          payload: {
            autographList: list,
            searchAutographForm: {...state.searchAutographForm, ...pagination}
          }
        })
      } else {
        message.warn(res.msg)
      }
    }
  },
  reducers: {
    save(state, {payload}) {
      return {...state, ...payload}
    },
  },
}
