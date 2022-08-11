import {departmentList,} from '@/api/system'
import {message} from 'antd'

export default {
  namespace: 'account',
  state: {
    departmentList: [],
  },
  effects: {
    //获取部门管理列表
    * loadDepartmentList({payload}, {select, call, put}) {
      const state = yield select(state => state.department)
      const res = yield call(departmentList, state.searchDepartmentForm)
      if (res.code === 0) {
        yield put({
          type: 'save', payload: {
            departmentList: res.data,
            searchDepartmentForm: {...state.searchDepartmentForm},
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
