import {theexamineeList} from '@/api/automatically'
import {message} from 'antd'
export const STATE = {
  theexamineeList: [],
  searchTheexamineeForm: {
    pageNum: 1,
    pageSize: 10,
  },
}
export default {
  namespace: 'theexaminee',
  state: STATE,
  effects: {
    //获取签名列表
    * loadgetExamoList({payload}, {select, call, put}) {
      const state = yield select(state => state.theexaminee)
      const res = yield call(theexamineeList, state.searchAutographForm)
      if (res && res.code === 0) {
        const {list, pagination} = res.data
        yield put({
          type: 'save',
          payload: {
            theexamineeList: list,
            searchTheexamineeForm: {...state.searchAutographForm, ...pagination}
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
