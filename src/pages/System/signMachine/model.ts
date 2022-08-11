import {message} from 'antd'
import {signMachineListApi, signUpdateClientApi, signUpdateStatusApi, signDeleteApi} from "@/api/system";

export const STATE= {
  signMachineSearchForm: {
    pageNum: 1,
    pageSize: 10,
    type: "2"
  },
  signMachineList: [],
  isEditorMachineModalVisible: false,
  id: '',
}

export default {
  namespace: 'signMachine',
  state: {...STATE},
  effects: {
    // 获取设备列表信息
    * loadSignList({}, {select, call, put}) {
      const state = yield select(state => state.signMachine)
      const res = yield call(signMachineListApi, state.signMachineSearchForm)
      if (res.code === 0) {
        yield put({
          type: 'save',
          payload: {
            signMachineList: res.data.list,
            signMachineSearchForm: {...state.signMachineSearchForm, ...res.data.pagination}
          },
        })
      } else {
        message.warn(res.msg)
      }
    },
    // 更新设备状态
    * updateStatus({payload}, {call, put}) {
      const res = yield call(signUpdateStatusApi, payload)
      if (res.code === 0) {
        message.info(res.msg)
        // yield put({
        //   type: 'save',
        //   payload: {
        //     id: ''
        //   },
        // })
      } else {
        message.warn(res.msg)
      }
    },
    // 更新设备信息
    * updateClient({payload}, {call, put}) {
        const res = yield call(signUpdateClientApi, payload)
        if (res.code === 0) {
          message.info(res.msg)
          yield put({
            type: 'save',
            payload: {
              isEditorMachineModalVisible: false,
              id: ''
            },
          })
        } else {
          message.warn(res.msg)
        }
    },
    // 删除设备信息
    * deleteInfo({payload}, {call}) {
      const res = yield call(signDeleteApi, payload)
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
