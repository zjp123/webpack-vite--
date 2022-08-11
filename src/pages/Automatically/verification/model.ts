import {verificaList} from '@/api/automatically'
import {message} from 'antd'
export const STATE = {
  verificaList: [],
  isCheckSpotCheckModalVisible: false,
  searchAutographForm: {
    pageNum: 1,
    pageSize: 10,
    examSite:"",
    name:"",
  },
}
export default {
  namespace: 'verification',
  state: {...STATE},
  effects: {
    //获取安全员核验列表
    * loadverificaList({payload}, {select, call, put}) {
      const state = yield select(state => state.verification)
      const res = yield call(verificaList, state.searchAutographForm)
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
    }
  },
  reducers: {
    save(state, {payload}) {
      return {...state, ...payload}
    },
  },
}
