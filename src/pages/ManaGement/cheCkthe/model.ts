import {checktheList, stuChecktheList} from '@/api/management'

export const STATE = {
  checktheList: [],
  stuChecktheList: [],
  searchChecktheForm: {
    pageNum: 1,
    pageSize: 10,

  },
  searchStuChecktheForm: {
    pageNum: 1,
    pageSize: 10,

  },
  total: {},
  stuTotal: {}
}
export default {
  namespace: 'cheCkthe',
  state: STATE,
  effects: {
    //获取角色列表
    * loadChecktheList({payload}, {select, call, put}) {
      const state = yield select(state => state.cheCkthe)
      const res = yield call(checktheList, state.searchChecktheForm)
      if (res.code === 0) {
        const {list, pagination} = res.data
        const {total} = res
        yield put({
          type: 'save', payload: {
            checktheList: list,
            searchChecktheForm: {...state.searchChecktheForm, ...pagination},
            total
          }
        })
      }
    },
    //获取角色列表
    * loadStuChecktheList({payload}, {select, call, put}) {
      const state = yield select(state => state.cheCkthe)
      console.log(state.searchStuChecktheForm, payload)
      const res = yield call(stuChecktheList, {...state.searchStuChecktheForm, ...payload})
      if (res.code === 0) {
        const {list, pagination, total} = res.data
        yield put({
          type: 'save', payload: {
            stuChecktheList: list,
            searchStuChecktheForm: {...state.searchStuChecktheForm, ...pagination},
            stuTotal: total
          }
        })
      }
    },
  },
  reducers: {
    save(state, {payload}) {
      return {...state, ...payload}
    },
  },
}
