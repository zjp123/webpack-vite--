import { message } from 'antd'
import { archiveConfigList, updateArchiveConfigList, deleteArchiveConfig, createArchiveConfig } from '@/api/system'
import { needActionItem, mergeData } from '@/utils/useFormatData'

export const STATE = {
  archiveConfigList: [],
  pagination: {},
  searchArchiveConfigForm: {
    pageNum: 1,
    pageSize: 100,
    perdritype: '',
    businessType: ''
  },
  virtualArchiveConfigList: []
}

export default {
  namespace: 'archiveConfig',
  state: { ...STATE },
  effects: {
    // 获取设备列表信息
    *loadArchiveConfigList({ payload }, { select, call, put }) {
      const state = yield select(state => state.archiveConfig)
      const res = yield call(archiveConfigList, state.searchArchiveConfigForm)
      if (res.code === 0) {
        yield put({
          type: 'save',
          payload: {
            archiveConfigList: res.data.list,
            pagination: res.data.pagination
          }
        })
      } else {
        message.warn(res.msg)
      }
    },
    *addArchiveConfig({ payload }, { select, call, put }) {
      const state = yield select(state => state.archiveConfig)
      const temp = payload
      needActionItem.forEach(item => {
        if (item in temp) {
          temp[item] = mergeData(temp[item])
        }
      })
      const res = yield call(createArchiveConfig, {configs: [temp]})
      if (res.code === 0) {
        message.success(res.msg)
      } else {
        message.warn(res.msg)
      }
    },
    *updateArchiveConfig({ payload }, { select, call, put }) {
      const state = yield select(state => state.archiveConfig)
      const temp = payload
      needActionItem.forEach(item => {
        if (item in temp) {
          temp[item] = mergeData(temp[item])
        }
      })
      const res = yield call(updateArchiveConfigList, temp)
      if (res.code === 0) {
        message.success(res.msg)
      } else {
        message.warn(res.msg)
      }
    },
    *delArchiveConfig({ payload }, { select, call, put }) {
      const state = yield select(state => state.archiveConfig)
      const res = yield call(deleteArchiveConfig, payload)
      if (res.code === 0) {
        message.success(res.msg)
      } else {
        message.warn(res.msg)
      }
    }
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  }
}
