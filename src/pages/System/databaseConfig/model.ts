import {message} from 'antd'
import {databaseConfigListApi, loadDatabaseConfigDetailApi, saveDatabaseConfigApi, updateDatabaseConfigApi, deleteDatabaseConfigApi} from "@/api/system";

export const STATE= {
  databaseConfigSearchForm: {
    pageNum: 1,
    pageSize: 10,
  },
  databaseConfigList: [],
  isCuDatabaseConfigModalVisible: false,
  databaseConfigDetail: {},
  id: '',
}

export default {
  namespace: 'databaseConfig',
  state: {...STATE},
  effects: {
    // 获取列表信息
    * loadDatabaseConfigList({payload}, {select, call, put}) {
      const state = yield select(state => state.databaseConfig)
      const res = yield call(databaseConfigListApi, state.databaseConfigSearchForm)
      if (res.code === 0) {
        yield put({
          type: 'save',
          payload: {
            databaseConfigList: res.data.list,
            databaseConfigSearchForm: {...state.databaseConfigSearchForm, ...res.data.pagination}
          },
        })
      } else {
        message.warn(res.msg)
      }
    },
    // 新增或更新
    * saveOrUpdateDatabaseConfig({payload}, {select, call, put}) {
      const api = payload.id ? updateDatabaseConfigApi : saveDatabaseConfigApi
      const newPayload = payload
      !newPayload.id && delete newPayload.id
      const res = yield call(api, payload)
      if (res.code === 0) {
        message.info(res.msg)
        yield put({
          type: 'save',
          payload: {
            isCuDatabaseConfigModalVisible: false,
            id: ''
          },
        })
      } else {
        message.warn(res.msg)
      }
    },
    // 删除设备信息
    * deleteDatabaseConfig({payload}, {select, call, put}) {
      const res = yield call(deleteDatabaseConfigApi, payload)
      if (res.code === 0) {
        message.info(res.msg)
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
