import {safetyoFficerinList, addSafetyo, updateSafetyo, deleteSafetyo, getanquanyuanList} from '@/api/drivingTest'
import {message} from 'antd'

export const STATE = {
  safetyoFficerinList: [],
  deptName: "",
  safetyOfficerName: "",
  searSafetyoFficerinForm: {
    pageNum: 1,
    pageSize: 10,
  },
  getanquanyuanList: [],
  searGetanquanyuanForm: {
    pageNum: 1,
    pageSize: 1,
  },
  isSafeModalVisible: false,
  isCuInformationModalVisible: false,
  studentList: [],
  searchStudentForm: {
    pageNum: 1,
    pageSize: 10,
  },

}
export default {
  namespace: 'safetyoFficerin',
  state: STATE,
  effects: {
    //获取安全员列表
    * loadSafetyoFficerinList({payload}, {select, call, put}) {
      try {
        const state = yield select(state => state.safetyoFficerin)
        const res = yield call(safetyoFficerinList, state.searSafetyoFficerinForm)
        const {list, pagination} = res.data
        if (res.code === 0) {
          yield put({
            type: 'save', payload: {
              safetyoFficerinList: list,
              searSafetyoFficerinForm: {...state.searSafetyoFficerinForm, ...pagination}
            }
          })
        }
      } catch (err) {
      }
    },
    * loadGetanquanyuanList({payload}, {select, call, put}) {
      try {
        const state = yield select(state => state.safetyoFficerin)
        const res = yield call(getanquanyuanList, {...state.searGetanquanyuanForm, ...payload})
        const {list, pagination} = res.data
        if (res.code === 0) {
          yield put({
            type: 'save', payload: {
              getanquanyuanList: list,
              searGetanquanyuanForm: {...state.searGetanquanyuanForm, ...pagination}
            }
          })
        }
      } catch (err) {
      }

    },
    // 获取

    //删除
    * deleteSafetyo({payload}, {select, call, put}) {
      try {
        const res = yield call(deleteSafetyo, payload)
        if (res && res.code === 0) {
          message.success('删除安全员成功');
          yield put({
            type: 'loadSafetyoFficerinList'
          })
        }
      } catch (err) {
      }
    },/* 新增安全员 */
    * addSafetyot({payload}, {select, call, put}) {
      try {
        let sOrU = payload.postData.safetyOfficerId ? updateSafetyo : addSafetyo,
          text = payload.postData.safetyOfficerId ? '修改' : '新增';
        const res = yield call(sOrU, payload.postData)
        if (res && res.code === 0) {
          message.success(text + '安全员信息成功');
          payload.parentForm.resetFields()
          yield put({
            type: 'save',
            payload: {
              isSafeModalVisible: false,
              searSafetyoFficerinForm: {...STATE.searSafetyoFficerinForm}
            }
          })
          yield put({
            type: 'loadSafetyoFficerinList'
          })
        }
      } catch (err) {
      }
    },
  },

  reducers: {
    save(state, {payload}) {
      return {...state, ...payload}
    },
  },
}
