import {
  loadESignListApi,
  insertESignApi,
  updateESignApi,
  detailESignApi,
  deleteESignApi,
  updateESignStatusApi,
} from '@/api/drivingTest'
import {message} from 'antd'

export const STATE = {
  ESignList: [],
  searchESignListForm: {
    pageNum: 1,
    pageSize: 10,
    userNameOrName: ''
  },
  id: '',
  visible: false,
}
export default {
  namespace: 'electronicSignature',
  state: STATE,
  effects: {
    //获取考场列表
    * loadESignList({payload}, {select, call, put}) {
      try {
        const state = yield select(state => state.electronicSignature)
        const res = yield call(loadESignListApi, state.searchESignListForm)
        const {list, pagination, additional} = res.data

        if (res.code === 0) {
          yield put({
            type: 'save',
            payload: {
              ESignList: list,
              searchESignListForm: {...state.searchESignListForm, ...pagination}
            }
          })
        }
      } catch (err) {
      }
    },
    // 新增||更新电子签名
    * addOrUpdateESign({payload}, {select, call, put}) {
      try {
        const state = yield select(state => state.electronicSignature)
        const api = payload.id ? updateESignApi : insertESignApi
        const res = yield call(api, payload)
        console.log('addOrUpdateESign', res)
        if (res.code === 0) {
          message.info(res.msg)
          yield put({
            type: 'loadESignList'
          })
        } else {
          message.warn(res.msg)
        }
      } catch (err) {
      }
    },
    // 获取电子签名详情
    * loadDetailESign({payload}, {select, call, put}) {
      try {
        const state = yield select(state => state.electronicSignature)
        const res = yield call(detailESignApi, payload)
        console.log('loadDetailESign', res)
        if (res.code === 0) {
          return res.data
        } else {
          message.warn(res.msg)
        }
      } catch (err) {
      }
    },
    // 删除电子签名
    * deleteESign({payload}, {select, call, put}) {
      try {
        const state = yield select(state => state.electronicSignature)
        const res = yield call(deleteESignApi, payload)
        console.log('deleteESign', res)
        if (res.code === 0) {
          message.info(res.msg)
          yield put({
            type: 'loadESignList'
          })
        } else {
          message.warn(res.msg)
        }
      } catch (err) {
      }
    },
    // 启用禁用电子签名
    * updateESignStatus({payload}, {select, call, put}) {
      try {
        const state = yield select(state => state.electronicSignature)
        const res = yield call(updateESignStatusApi, payload)
        console.log('updateESignStatusApi', res)
        if (res.code === 0) {
          message.info(res.msg)
          yield put({
            type: 'loadESignList'
          })
        } else {
          message.warn(res.msg)
        }
      } catch (err) {
      }
    },
  },
  reducers: {
    save(state, {payload}) {
      return {...state, ...payload}
    }
  }
}
