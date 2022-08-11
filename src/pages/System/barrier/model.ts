import {message} from 'antd'
import {barrierList, barrierGetClientInfo, barrierUpdateClient, barrierDeleteClient} from "@/api/system";

export const STATE= {
  barrierSearchForm: {
    pageNum: 1,
    pageSize: 10,
  },
  barrierList: [],
  isCuBarrierModalVisible: false,
  id: '',
}

export default {
  namespace: 'barrier',
  state: {...STATE},
  effects: {
    // 获取设备列表信息
    * loadBarrierList({payload}, {select, call, put}) {
      const state = yield select(state => state.barrier)
      const res = yield call(barrierList, state.barrierSearchForm)
      if (res.code === 0) {
        yield put({
          type: 'save',
          payload: {
            barrierList: res.data.list,
            barrierSearchForm: {...state.barrierSearchForm, ...res.data.pagination}
          },
        })
      } else {
        message.warn(res.msg)
      }
    },
    // 更新设备状态
    * updateStatus({payload}, {select, call, put}) {
      const res = yield call(barrierUpdateClient, payload)
      if (res.code === 0) {
        message.info(res.msg)
        yield put({
          type: 'save',
          payload: {
            isCuBarrierModalVisible: false,
            id: ''
          },
        })
      } else {
        message.warn(res.msg)
      }
    },
    // 删除设备信息
    * deleteInfo({payload}, {select, call, put}) {
      const res = yield call(barrierDeleteClient, payload)
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
