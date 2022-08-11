import {message} from 'antd'
import {getAutoAcceptListApi, acceptingApi} from "@/api/electronic";

export const STATE= {
  formParams: {
    pageNum: 1,
    pageSize: 10,
    type: "ALL"
  },
  clickAuto: false, // 用于刷新后的点击自动处理的状态提示
  autoAcceptList: [],
  account: {
    acceptedFailCount: 0,
    acceptedSuccessCount: 0,
    curDayAcceptedCount: 0,
    noAcceptCount: 0,
  },
  isEditorMachineModalVisible: false,
  id: '',
}

export default {
  namespace: 'autoAccept',
  state: {...STATE},
  effects: {
    // 获取设备列表信息
    * loadAutoList({}, {select, call, put}) {
        const state = yield select(state => state.autoAccept)
        const res = yield call(getAutoAcceptListApi, state.formParams)
        if (res.code === 0) {
          yield put({
            type: 'save',
            payload: {
              autoAcceptList: res.data.list,
              account: res.count,
              formParams: {...state.formParams, ...res.data.pagination}
            },
          })
        } else {
          message.warn(res.msg)
        }
    },
    // 自动受理
    * doAccept({}, {select, call, put}) {
      const state = yield select(state => state.autoAccept)
      const res = yield call(acceptingApi, state.formParams)
      if (res.code === 0) {
        if (res.data == 1) {
          message.warn('受理中，不能重复点击')
        }
        // yield put({
        //   type: 'save',
        //   payload: {
        //     autoAcceptList: res.data.list,
        //     account: res.count,
        //     formParams: {...state.formParams, ...res.data.pagination}
        //   },
        // })
      } else {
        message.warn(res.msg)
      }
  },
    // 更新设备状态
    * updateStatus({payload}, {call, put}) {
      // const res = yield call(signUpdateStatusApi, payload)
      // if (res.code === 0) {
      //   message.info(res.msg)
      //   // yield put({
      //   //   type: 'save',
      //   //   payload: {
      //   //     id: ''
      //   //   },
      //   // })
      // } else {
      //   message.warn(res.msg)
      // }
    },
    // 更新设备信息
    * updateClient({payload}, {call, put}) {
        // const res = yield call(signUpdateClientApi, payload)
        // if (res.code === 0) {
        //   message.info(res.msg)
        //   yield put({
        //     type: 'save',
        //     payload: {
        //       isEditorMachineModalVisible: false,
        //       id: ''
        //     },
        //   })
        // } else {
        //   message.warn(res.msg)
        // }
    },
    // 删除设备信息
    * deleteInfo({payload}, {call}) {
      // const res = yield call(signDeleteApi, payload)
      // if (res.code === 0) {
      //   message.info(res.msg)
      // } else {
      //   message.warn(res.msg)
      // }
    },
  },
  reducers: {
    save(state, {payload}) {
      return {...state, ...payload}
    },
  },
}
