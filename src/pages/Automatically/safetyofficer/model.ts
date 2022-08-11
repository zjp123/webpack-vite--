import { getsafeyofficerList } from '@/api/automatically'
import { message } from 'antd'

export const STATE = {
  getsafeyofficerList: [],
  isSafetyofficerListModalVisible: false,
  searchSafetyofficerForm: {
    pageNum: 1,
    pageSize: 10,
  },
}
export default {
  namespace: 'safetyofficer',
  state: STATE,
  effects: {
    //获取签名列表
    * loadgetsafeyofficerList({ payload }, { select, call, put }) {
      const state = yield select(state => state.safetyofficer)
      const res = yield call(getsafeyofficerList, state.searchSafetyofficerForm)
      if (res && res.code === 0) {
        yield put({
          type: 'save',
          payload: {
            getsafeyofficerList: res.data,
          }
        })
      } else {
        message.warn(res.msg)
      }
    } 
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    },
  },
}
