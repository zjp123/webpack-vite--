import {message} from 'antd'
import {
  initConfigListApi,
  editInitConfigListApi,
  updateInitConfigListApi,
  cleanTableApi,
  startJobApi,
  stopJobApi,
  loadInitInfoApi
} from "@/api/system";

export const STATE= {
  initConfigSearchForm: {
    pageNum: 1,
    pageSize: 10,
    name: ''
  },
  initConfigList: [],
  editInitConfigList: [],
  isHasRunningJob: false,
  runningJob:null,
  isCuInitModalVisible: false,
  id: '',
}

export default {
  namespace: 'initConfig',
  state: {...STATE},
  effects: {
    // 获取设备列表信息
    * loadInitConfigList({payload}, {select, call, put}) {
      const state = yield select(state => state.initConfig)
      const res = yield call(initConfigListApi, state.initConfigSearchForm)
      if (res.code === 0) {
        yield put({
          type: 'save',
          payload: {
            initConfigList: res.data.list,
            initConfigSearchForm: {...state.initConfigSearchForm, ...res.data.pagination}
          },
        })
      } else {
        message.warn(res.msg)
      }
    },
    // 获取任务配置列表
    * loadEditInitConfigList({payload}, {select, call, put}) {
      const res = yield call(editInitConfigListApi, payload)
      if (res.code === 0) {
        yield put({
          type: 'save',
          payload: {
            editInitConfigList: res.data,
          },
        })
        return res.data
      } else {
        message.warn(res.msg)
      }
    },
    // 更新设备状态
    * updateInitConfigList({payload}, {select, call, put}) {
      const res = yield call(updateInitConfigListApi, payload)
      if (res.code === 0) {
        message.info(res.msg)
        yield put({
          type: 'save',
          payload: {
            isCuInitModalVisible: false,
            id: ''
          },
        })
        yield put({
          type: 'loadInitConfigList'
        })
      } else {
        message.warn(res.msg)
      }
    },
    // 删除设备信息
    * cleanTable({payload}, {select, call, put}) {
      const res = yield call(cleanTableApi, payload)
      if (res.code === 0) {
        message.info(res.msg)
        yield put({
          type: 'loadInitInfo'
        })
        yield put({
          type: 'loadInitConfigList'
        })
      } else {
        message.warn(res.msg)
      }
    },
    // 开始任务
    * startJob({payload}, {select, call, put}) {
      const res = yield call(startJobApi, payload)
      if (res.code === 0) {
        message.info(res.msg)
        yield put({
          type: 'save',
          payload: {
            isHasRunningJob: true
          }
        })
      } else {
        message.warn(res.msg)
      }
    },
    // 停止任务
    * stopJob({payload}, {select, call, put}) {
      const res = yield call(stopJobApi, payload)
      if (res.code === 0) {
        message.info(res.msg)
        yield put({
          type: 'save',
          payload: {
            isHasRunningJob: false
          }
        })
        yield put({
          type: 'loadInitConfigList'
        })
      } else {
        message.warn(res.msg)
      }
    },
    // 获取实时任务状态
    * loadInitInfo({payload}, {select, call, put}) {
      const res = yield call(loadInitInfoApi, payload)
      if (res.code === 0) {
        yield put({
          type: 'save',
          payload: {
            runningJob: res.data?.runningJob
          }
        })
        return res.data?.runningJob
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
